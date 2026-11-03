import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeComments } from '@/lib/youtube';
import { analyzeCommentsWithGemini } from '@/lib/gemini';

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v && v.length === 11) return v;
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1].slice(0, 11);
      }
      if (parsed.pathname.startsWith('/live/')) {
        return parsed.pathname.split('/live/')[1].slice(0, 11);
      }
    } else if (parsed.hostname.includes('youtu.be')) {
      const v = parsed.pathname.slice(1, 12);
      if (v.length === 11) return v;
    }
  } catch {
    // URL 파싱 실패 시 정규식 시도
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regex);
    if (match && match[1]) return match[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { videoInput, maxComments = 100 } = await req.json();

    if (!videoInput) {
      return NextResponse.json({ error: '비디오 ID 또는 유튜브 URL을 입력해주세요.' }, { status: 400 });
    }

    const videoId = extractVideoId(videoInput);
    if (!videoId) {
      return NextResponse.json({ error: '올바른 유튜브 비디오 ID 또는 URL 형식이 아닙니다.' }, { status: 400 });
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!youtubeApiKey) {
      return NextResponse.json({ error: '서버에 YouTube API 키가 설정되어 있지 않습니다.' }, { status: 500 });
    }
    if (!geminiApiKey) {
      return NextResponse.json({ error: '서버에 Gemini API 키가 설정되어 있지 않습니다.' }, { status: 500 });
    }

    // 1. YouTube 댓글 수집
    const { comments, videoInfo } = await fetchYouTubeComments(videoId, youtubeApiKey, maxComments);

    if (comments.length === 0) {
      return NextResponse.json(
        { error: '해당 영상에 수집 가능한 댓글이 없거나 댓글 기능이 사용 중지되어 있습니다.' },
        { status: 404 }
      );
    }

    // 2. Gemini 3.6 Flash를 통한 형태소 분석, 감성 분석, 키워드 및 바이그램 분석
    const summary = await analyzeCommentsWithGemini(comments, geminiApiKey, videoInfo);

    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || '댓글 수집 및 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
