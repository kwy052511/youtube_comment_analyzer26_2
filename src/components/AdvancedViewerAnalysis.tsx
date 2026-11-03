'use client';

import React from 'react';
import { ViewerInquiry, ViewerPersona, PeakSpikeItem } from '@/types/analysis';
import {
  HelpCircle,
  Users,
  Flame,
  AlertCircle,
  TrendingUp,
  Tag,
  CheckCircle,
  Zap,
  Clock
} from 'lucide-react';

interface Props {
  inquiries: ViewerInquiry[];
  personas: ViewerPersona[];
  spikeAnalysis: {
    peakSpikes: PeakSpikeItem[];
    overallSpikePattern: string;
  };
}

export function AdvancedViewerAnalysis({ inquiries, personas, spikeAnalysis }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. 시청자 Q&A 및 정보 요청 모아보기 */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="typo-h4 text-slate-900">
                  시청자 Q&A 및 정보 요청 모아보기
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Inquiry Extraction
                </span>
              </div>
              <p className="typo-sub text-slate-500 mt-0.5">
                댓글에서 추출된 주요 질문, 문의, 확인 요청 사항을 카테고리별로 집계·요약했습니다. (원문 보호 요약)
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 self-start sm:self-auto">
            총 {inquiries.length}개 주요 질의 유형
          </span>
        </div>

        {/* 질의응답 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inquiries.map((inq, idx) => {
            const isHigh = inq.urgencyOrImportance === '높음';
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                      {inq.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isHigh
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      중요도: {inq.urgencyOrImportance}
                    </span>
                  </div>
                  <p className="typo-body text-slate-800 font-medium text-sm leading-relaxed mb-3">
                    &quot;{inq.question}&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs text-slate-500">
                  <span>유사 언급 빈도</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    약 {inq.frequency}건 언급
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 시청자 유형/의도 분석 (Viewer Intent & Persona Breakdown) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="typo-h4 text-slate-900">
                  시청자 유형/의도 페르소나 분석
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Persona Breakdown
                </span>
              </div>
              <p className="typo-sub text-slate-500 mt-0.5">
                댓글 작성 패턴 및 감정 태도를 토대로 시청자의 주된 방문 의도와 성향을 클러스터링했습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 페르소나 프로필 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-900">
                    {p.persona}
                  </span>
                  <span className="typo-h4 font-black text-indigo-600">
                    {p.percentage}%
                  </span>
                </div>

                {/* 프로그레스 바 */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>

                <p className="typo-sub text-slate-600 leading-relaxed mb-4">
                  {p.intentDescription}
                </p>
              </div>

              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/80">
                {p.characteristics.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-indigo-50/80 text-indigo-700 text-[11px] font-medium border border-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 반응 폭발 시간대 분석 (Peak Comment Spike Analysis) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="typo-h4 text-slate-900">
                  반응 폭발 시간대 분석
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Peak Comment Spike
                </span>
              </div>
              <p className="typo-sub text-slate-500 mt-0.5">
                댓글 유입량이 단시간에 집중적으로 급증한 구간의 원인과 당시 감성 여론을 진단합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 피크 스파이크 카드 & 전체 패턴 진단 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 전체 패턴 종합 진단 배너 */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-rose-50/60 to-orange-50/60 border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-rose-600" />
                전체 유입 곡선 및 피크 양상 총평
              </div>
              <p className="typo-body text-slate-700 font-medium leading-relaxed">
                {spikeAnalysis.overallSpikePattern}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 text-xs text-rose-800 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>타임라인 피크 감지: {spikeAnalysis.peakSpikes.length}개 구간 포착</span>
            </div>
          </div>

          {/* 감지된 피크 시간대 상세 리스트 */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spikeAnalysis.peakSpikes.map((spike, idx) => {
              const isPos = spike.dominantSentiment === '긍정';
              const isNeg = spike.dominantSentiment === '부정';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-bold text-sm text-slate-900">
                          {spike.timeLabel}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                        {spike.commentCount}건 급증
                      </span>
                    </div>

                    <p className="typo-sub text-slate-600 leading-relaxed mb-3">
                      {spike.spikeReason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-medium">당시 지배적 감성</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        isPos
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isNeg
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {spike.dominantSentiment} 우세
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
