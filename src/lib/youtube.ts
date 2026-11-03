import { RawComment } from '@/types/analysis';

export async function fetchYouTubeComments(
  videoId: string,
  apiKey: string,
  maxResults: number = 100
): Promise<{ comments: RawComment[]; videoInfo?: { id: string; title: string; channelTitle: string; thumbnailUrl: string } }> {
  // 1. 영상 기본 정보 가져오기 (선택적 보너스 UI 개선용)
  let videoInfo: { id: string; title: string; channelTitle: string; thumbnailUrl: string } | undefined;
  try {
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );
    if (videoRes.ok) {
      const videoData = await videoRes.json();
      if (videoData.items && videoData.items.length > 0) {
        const item = videoData.items[0];
        videoInfo = {
          id: videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || ''
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch video info:', err);
  }

  // 2. 댓글 스레드 가져오기
  const comments: RawComment[] = [];
  let nextPageToken: string | undefined = undefined;

  while (comments.length < maxResults) {
    const pageSize = Math.min(100, maxResults - comments.length);
    let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${pageSize}&order=relevance&key=${apiKey}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const message = errJson?.error?.message || `YouTube API error (${res.status})`;
      throw new Error(message);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      break;
    }

    for (const item of data.items) {
      const topComment = item.snippet?.topLevelComment?.snippet;
      if (topComment) {
        comments.push({
          id: item.id,
          author: topComment.authorDisplayName || '익명',
          publishedAt: topComment.publishedAt,
          likeCount: topComment.likeCount || 0,
          text: topComment.textOriginal || topComment.textDisplay || ''
        });
      }
    }

    nextPageToken = data.nextPageToken;
    if (!nextPageToken) break;
  }

  return { comments, videoInfo };
}
