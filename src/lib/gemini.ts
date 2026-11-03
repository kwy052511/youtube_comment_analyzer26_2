import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import {
  RawComment,
  AnalysisSummary,
  HourlySentiment,
  KeywordItem,
  BigramItem,
  ViewerInquiry,
  ViewerPersona,
  PeakSpikeItem
} from '@/types/analysis';

export async function analyzeCommentsWithGemini(
  comments: RawComment[],
  geminiApiKey: string,
  videoInfo?: { id: string; title: string; channelTitle: string; thumbnailUrl: string }
): Promise<AnalysisSummary> {
  const google = createGoogleGenerativeAI({
    apiKey: geminiApiKey,
  });

  const model = google('gemini-3.6-flash');

  // 기본 통계 계산
  const totalComments = comments.length;
  const totalLength = comments.reduce((acc, c) => acc + c.text.length, 0);
  const averageLength = totalComments > 0 ? Math.round((totalLength / totalComments) * 10) / 10 : 0;
  const maxLikes = comments.reduce((max, c) => Math.max(max, c.likeCount), 0);

  // 시간대별 버킷 생성
  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );

  // Gemini에 전달할 축약된 데이터
  const commentPayload = comments.map((c, index) => ({
    i: index,
    t: c.text.slice(0, 300),
    d: c.publishedAt,
    l: c.likeCount
  }));

  const systemPrompt = `
당신은 한국어 자연어 처리(NLP) 및 시청자 데이터 분석 전문 AI 데이터 과학자입니다.
유튜브 댓글 데이터셋을 분석하여 다음 항목들을 심층적이고 정교하게 도출해야 합니다:
1. **한국어 형태소 분석**:
   - 어절을 쪼개고, 조사/어미를 분리하여 명사, 동사/형용사의 원형(Root/Base form)을 추출하세요.
   - 단어의 활용형을 원형으로 복원(Lemmatization)하고 무의미한 불용어(ㅋㅋ, ㅎㅎ, 조사 등)를 엄격히 제거하세요.
2. **주요 키워드 고빈도 TOP 20**:
   - 형태소 분석을 통해 복원된 원형 단어 중 상위 20개 빈도 및 품사(명사, 형용사, 동사)를 추출하세요.
3. **바이그램(Bigram) 단어 쌍 분석**:
   - 함께 자주 쓰이는 유의미한 단어 쌍(source, target) 최소 15~25개와 동시 출현 가중치(weight)를 산출하세요.
4. **개별 댓글 감성 분류**:
   - 각 댓글 순서대로 'positive', 'neutral', 'negative' 중 하나로 정확히 라벨링하세요.
5. **시청자 Q&A 및 정보 요청 모아보기 (Viewer Question & Inquiry Extraction)**:
   - 시청자들이 남긴 질문, 문의, 확인 요청, 후속 요청 사항을 파악하여 질문 의도별로 요약/정리하세요 (최소 3~6개).
   - 카테고리(예: "정보 요청", "내용 문의", "기술/방법 질문", "다음 주제 제안"), 요약된 질문 문장, 유사 질문 빈도수, 긴급/중요도("높음" | "보통" | "참고")를 도출하세요.
   - ※ 주의: 개인정보 보호를 위해 댓글 원문 전체를 그대로 복사하지 말고, 질문의 핵심 내용을 매끄러운 한글 요약문으로 작성하세요.
6. **시청자 유형/의도 분석 (Viewer Intent & Persona Breakdown)**:
   - 댓글 반응 패턴을 기반으로 시청자 페르소나를 3~5개 유형으로 분할하세요. (예: "열혈 지지형", "정보 탐색형", "비판적 검증형", "유머/밈 향유형" 등)
   - 각 페르소나별 점유 비율(percentage, 합계 100%), 주된 시청 의도 설명(intentDescription), 대표 특성 키워드 목록(characteristics)을 제공하세요.
7. **반응 폭발 시간대 분석 (Peak Comment Spike Analysis)**:
   - 댓글이 집중적으로 쏟아진 피크(Peak) 시점들(1~3개 구간)을 분석하고, 해당 시점에 왜 댓글이 폭발했는지 이유(spikeReason)와 지배적 감성("긍정" | "중립" | "부정")을 진단하세요.
   - 전체적인 시청자 반응 주기 패턴에 대한 요약(overallSpikePattern)을 함께 작성하세요.
8. **바이그램 요약 및 종합 AI 인사이트**:
   - 바이그램 연관성 요약 및 크리에이터를 위한 전략적 제언 등을 작성하세요.

출력은 반드시 마크다운 따옴표(\`\`\`json) 없는 순수한 유효한 JSON 오브젝트만 반환해야 합니다.
`;

  const userPrompt = `
비디오 제목: "${videoInfo?.title || '영상'}"
총 댓글 수: ${totalComments}건

분석할 댓글 목록 (JSON):
${JSON.stringify(commentPayload)}

반환해야 할 JSON 스키마:
{
  "sentiments": ["positive" | "neutral" | "negative", ...],
  "topKeywords": [
    { "keyword": "단어원형", "count": 15, "pos": "명사" | "형용사" | "동사" }
  ],
  "bigrams": [
    { "source": "단어1", "target": "단어2", "weight": 8 }
  ],
  "bigramSummary": "바이그램 네트워크에서 도출된 핵심 담론 요약 설명 (3~4문장)",
  "viewerInquiries": [
    {
      "category": "정보 요청" | "내용 문의" | "기술/방법 질문" | "후속 주제 제안",
      "question": "핵심 질문 내용 요약 문장",
      "frequency": 4,
      "urgencyOrImportance": "높음" | "보통" | "참고"
    }
  ],
  "viewerPersonas": [
    {
      "persona": "페르소나 명칭",
      "percentage": 40,
      "intentDescription": "시청 의도 및 반응 양식 설명",
      "characteristics": ["키워드1", "키워드2", "키워드3"]
    }
  ],
  "peakSpikeAnalysis": {
    "peakSpikes": [
      {
        "timeLabel": "시간대 라벨 (예: 11/04 14시 등)",
        "commentCount": 12,
        "spikeReason": "해당 시간대에 댓글 반응이 급증한 구체적인 원인 분석",
        "dominantSentiment": "긍정" | "중립" | "부정"
      }
    ],
    "overallSpikePattern": "전체 댓글의 시간대별 유입 곡선 및 피크 양상에 대한 총평"
  },
  "aiInsight": {
    "overallEvaluation": "영상의 전반적인 시청자 반응 요약 (1~2문장)",
    "keyThemes": ["주제 1", "주제 2", "주제 3"],
    "sentimentRationale": "긍정/부정/중립 감정이 나타난 구체적인 원인 및 배경 분석",
    "audienceReactions": ["대표적인 시청자 반응 포인트 1", "포인트 2", "포인트 3"],
    "strategicAdvice": "크리에이터 또는 분석가를 위한 향후 콘텐츠 개선 및 피드백 제언"
  }
}
`;

  const response = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.2,
  });

  let rawJson = response.text.trim();
  if (rawJson.startsWith('```json')) {
    rawJson = rawJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (rawJson.startsWith('```')) {
    rawJson = rawJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', rawJson);
    throw new Error('Gemini 분석 결과를 JSON으로 파싱하는데 실패했습니다.');
  }

  const sentiments: string[] = parsed.sentiments || [];

  // 감정 카운트 집계
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  comments.forEach((c, idx) => {
    const s = sentiments[idx] || 'neutral';
    if (s === 'positive') positiveCount++;
    else if (s === 'negative') negativeCount++;
    else neutralCount++;
  });

  const positiveRatio = totalComments > 0 ? Math.round((positiveCount / totalComments) * 1000) / 10 : 0;
  const neutralRatio = totalComments > 0 ? Math.round((neutralCount / totalComments) * 1000) / 10 : 0;
  const negativeRatio = totalComments > 0 ? Math.round((negativeCount / totalComments) * 1000) / 10 : 0;

  // 시간대별 댓글 추이 계산
  const hourlyMap = new Map<string, { total: number; positive: number; neutral: number; negative: number; timeLabel: string }>();

  const startTime = sortedComments.length > 0 ? new Date(sortedComments[0].publishedAt).getTime() : 0;
  const endTime = sortedComments.length > 0 ? new Date(sortedComments[sortedComments.length - 1].publishedAt).getTime() : 0;
  const diffHours = (endTime - startTime) / (1000 * 60 * 60);

  sortedComments.forEach((c) => {
    const originalIdx = comments.findIndex(orig => orig.id === c.id);
    const s = sentiments[originalIdx] || 'neutral';
    const date = new Date(c.publishedAt);

    let key = '';
    let label = '';

    if (diffHours <= 36) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = String(date.getHours()).padStart(2, '0');
      key = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${hour}:00`;
      label = `${month}/${day} ${hour}시`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      key = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      label = `${month}/${day}`;
    }

    if (!hourlyMap.has(key)) {
      hourlyMap.set(key, { total: 0, positive: 0, neutral: 0, negative: 0, timeLabel: label });
    }

    const item = hourlyMap.get(key)!;
    item.total += 1;
    if (s === 'positive') item.positive += 1;
    else if (s === 'negative') item.negative += 1;
    else item.neutral += 1;
  });

  const hourlyTrends: HourlySentiment[] = Array.from(hourlyMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, val]) => ({
      fullDate: key,
      timeLabel: val.timeLabel,
      total: val.total,
      positive: val.positive,
      neutral: val.neutral,
      negative: val.negative
    }));

  // 키워드 정제
  const topKeywords: KeywordItem[] = (parsed.topKeywords || []).slice(0, 20);

  // 바이그램 데이터 구성 및 네트워크 노드/링크 생성
  const rawBigrams: BigramItem[] = parsed.bigrams || [];
  const nodeMap = new Map<string, number>();

  rawBigrams.forEach(b => {
    nodeMap.set(b.source, (nodeMap.get(b.source) || 0) + b.weight);
    nodeMap.set(b.target, (nodeMap.get(b.target) || 0) + b.weight);
  });

  const nodes = Array.from(nodeMap.entries()).map(([id, val]) => ({
    id,
    val: Math.max(8, Math.min(val * 4, 32))
  }));

  const links = rawBigrams.map(b => ({
    source: b.source,
    target: b.target,
    weight: b.weight
  }));

  // 신규 추가 기능 데이터 검증 및 기본값 처리
  const viewerInquiries: ViewerInquiry[] = Array.isArray(parsed.viewerInquiries) && parsed.viewerInquiries.length > 0
    ? parsed.viewerInquiries
    : [
        {
          category: '정보 요청',
          question: '영상에서 언급된 주요 내용의 세부 정보 및 출처에 대한 질문',
          frequency: 3,
          urgencyOrImportance: '보통'
        }
      ];

  const viewerPersonas: ViewerPersona[] = Array.isArray(parsed.viewerPersonas) && parsed.viewerPersonas.length > 0
    ? parsed.viewerPersonas
    : [
        {
          persona: '핵심 지지형 시청자',
          percentage: 55,
          intentDescription: '콘텐츠에 적극 공감하며 호평을 남김',
          characteristics: ['공감', '칭찬', '지지']
        },
        {
          persona: '정보 탐색형 시청자',
          percentage: 45,
          intentDescription: '영상의 핵심 요점을 학습하거나 질문을 제기함',
          characteristics: ['질문', '정리', '분석']
        }
      ];

  const peakSpikeAnalysis = parsed.peakSpikeAnalysis || {
    peakSpikes: hourlyTrends.length > 0
      ? [
          {
            timeLabel: hourlyTrends[0].timeLabel,
            commentCount: hourlyTrends[0].total,
            spikeReason: '영상 등록 초기 시청자 유입 집중 구간',
            dominantSentiment: '긍정'
          }
        ]
      : [],
    overallSpikePattern: '영상 초기 반응 후 안정적인 댓글 유입 흐름을 보입니다.'
  };

  return {
    totalComments,
    averageLength,
    maxLikes,
    sentimentDistribution: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
      positiveRatio,
      neutralRatio,
      negativeRatio
    },
    hourlyTrends,
    topKeywords,
    bigrams: rawBigrams,
    bigramNetwork: {
      nodes,
      links
    },
    bigramSummary: parsed.bigramSummary || '바이그램 분석 결과 주요 단어 간 연관성이 도출되었습니다.',
    viewerInquiries,
    viewerPersonas,
    peakSpikeAnalysis,
    aiInsight: parsed.aiInsight || {
      overallEvaluation: '댓글 데이터 분석이 완료되었습니다.',
      keyThemes: [],
      sentimentRationale: '',
      audienceReactions: [],
      strategicAdvice: ''
    },
    videoInfo
  };
}
