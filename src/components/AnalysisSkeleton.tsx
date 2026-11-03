import React from 'react';
import { Loader2, Sparkles, BrainCircuit, Network, LineChart, FileText } from 'lucide-react';

interface Props {
  currentStep: string;
}

export function AnalysisSkeleton({ currentStep }: Props) {
  const steps = [
    { title: 'YouTube 댓글 수집', desc: '비디오 정보 및 댓글 목록 로드', icon: FileText },
    { title: 'Gemini 3.6 형태소 분석', desc: '한국어 어절 분리 및 원형 복원', icon: BrainCircuit },
    { title: '감성 분류 & 바이그램 생성', desc: '긍정/부정 판별 및 연관 단어 쌍 도출', icon: Network },
    { title: '시청자 Q&A · 페르소나 · 피크 진단', desc: '질문 추출, 시청자 유형 및 폭발 시점 분석', icon: LineChart }
  ];

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* 진행 중 상태 배너 (모던 라이트 스타일) */}
      <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm shadow-indigo-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="typo-h4 text-slate-900">댓글 분석이 진행 중입니다</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
                  AI 분석 파이프라인
                </span>
              </div>
              <p className="typo-sub text-slate-500 mt-0.5">
                {currentStep || '데이터를 수집하고 자연어 처리를 수행하고 있습니다.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100/80 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Gemini 3.6 Flash 구동 중</span>
          </div>
        </div>

        {/* 4단계 스텝 인디케이터 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-xs">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{st.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. 통계 카드 Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 rounded-md animate-shimmer" />
              <div className="w-8 h-8 rounded-xl animate-shimmer" />
            </div>
            <div>
              <div className="h-7 w-20 rounded-md animate-shimmer mb-2" />
              <div className="h-3 w-32 rounded-md animate-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. 인터랙티브 라인 차트 Skeleton (2개) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-36 rounded-md animate-shimmer" />
              <div className="h-4 w-16 rounded-md animate-shimmer" />
            </div>
            <div className="h-64 w-full rounded-xl animate-shimmer" />
          </div>
        ))}
      </div>

      {/* 3. 파이 차트 & 키워드 바 차트 Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="h-4 w-28 rounded-md animate-shimmer" />
          <div className="h-60 w-full rounded-full mx-auto max-w-[240px] animate-shimmer" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="h-14 rounded-xl animate-shimmer" />
            <div className="h-14 rounded-xl animate-shimmer" />
            <div className="h-14 rounded-xl animate-shimmer" />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="h-4 w-48 rounded-md animate-shimmer" />
          <div className="h-72 w-full rounded-xl animate-shimmer" />
        </div>
      </div>

      {/* 4. 바이그램 네트워크 Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-52 rounded-md animate-shimmer" />
          <div className="h-4 w-24 rounded-md animate-shimmer" />
        </div>
        <div className="h-96 w-full rounded-2xl animate-shimmer" />
        <div className="h-20 w-full rounded-xl animate-shimmer" />
      </div>

      {/* 5. 신규 추가: 시청자 Q&A 및 페르소나 Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="h-5 w-60 rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-xl animate-shimmer" />
          <div className="h-28 rounded-xl animate-shimmer" />
          <div className="h-28 rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
