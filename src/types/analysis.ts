export interface RawComment {
  id: string;
  author: string;
  publishedAt: string;
  likeCount: number;
  text: string;
}

export interface SentimentCount {
  positive: number;
  neutral: number;
  negative: number;
}

export interface HourlySentiment {
  timeLabel: string;
  fullDate: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface KeywordItem {
  keyword: string;
  count: number;
  pos: string; // 명사, 동사, 형용사 등
}

export interface BigramItem {
  source: string;
  target: string;
  weight: number;
}

export interface NetworkNode {
  id: string;
  val: number; // 빈도에 따른 노드 크기
  group?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  weight: number;
}

export interface BigramNetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// 1. 시청자 Q&A 및 정보 요청
export interface ViewerInquiry {
  category: string; // 예: "정보 요청", "방법/사용법 문의", "영상 내용 질의", "추후 주제 제안"
  question: string; // 요약된 질문/요청 내용 (원문 전체 노출 방지 규칙 준수)
  frequency: number; // 유사 질문 빈도 (추정치/언급 수)
  urgencyOrImportance: '높음' | '보통' | '참고';
}

// 2. 시청자 유형/의도 페르소나
export interface ViewerPersona {
  persona: string; // 페르소나 명칭 (예: "열혈 지지자", "호기심 탐색자", "비판적 검증자", "정보 탐색자")
  percentage: number; // 비율 (합계 100%)
  intentDescription: string; // 방문/시청 주된 의도 및 행동 양식
  characteristics: string[]; // 대표 특성 키워드/태그
}

// 3. 반응 폭발 시간대 분석 (Peak Spike Analysis)
export interface PeakSpikeItem {
  timeLabel: string;
  commentCount: number;
  spikeReason: string; // 급증 원인 AI 분석 (예: "영상 업로드 직후 초기 유입 집중", "특정 커뮤니티 공유 시점", "논쟁 발생 구간")
  dominantSentiment: '긍정' | '중립' | '부정';
}

export interface AnalysisSummary {
  totalComments: number;
  averageLength: number;
  maxLikes: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
    positiveRatio: number;
    neutralRatio: number;
    negativeRatio: number;
  };
  hourlyTrends: HourlySentiment[];
  topKeywords: KeywordItem[];
  bigrams: BigramItem[];
  bigramNetwork: BigramNetworkData;
  bigramSummary: string;
  aiInsight: {
    overallEvaluation: string;
    keyThemes: string[];
    sentimentRationale: string;
    audienceReactions: string[];
    strategicAdvice: string;
  };
  // 신규 추가 기능 3종
  viewerInquiries: ViewerInquiry[];
  viewerPersonas: ViewerPersona[];
  peakSpikeAnalysis: {
    peakSpikes: PeakSpikeItem[];
    overallSpikePattern: string; // 전체 폭발 패턴에 대한 해석
  };
  videoInfo?: {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
  };
}
