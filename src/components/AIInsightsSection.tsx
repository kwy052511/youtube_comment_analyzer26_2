import React from 'react';
import { Sparkles, CheckCircle2, MessageSquare, HelpCircle, Lightbulb } from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface Props {
  insight: AnalysisSummary['aiInsight'];
}

export function AIInsightsSection({ insight }: Props) {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-indigo-800/50 shadow-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6 pb-4 border-b border-indigo-800/60">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="typo-h3 text-white">
                Gemini 3.6 Flash 기반 AI 종합 심층 해석
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                AI Insight
              </span>
            </div>
            <p className="typo-sub text-slate-300 mt-0.5">
              형태소 분석 및 감성 분류를 결합하여 AI가 도출한 시청자 여론과 피드백 제언
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 전반적 총평 및 주요 테마 */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/80">
            <h4 className="typo-sub font-bold uppercase tracking-wider text-indigo-300 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              전반적인 시청자 반응 총평
            </h4>
            <p className="typo-body text-slate-100 leading-relaxed font-medium">
              {insight.overallEvaluation}
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/80 flex-1">
            <h4 className="typo-sub font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              핵심 논의 주제 및 키워드 테마
            </h4>
            <div className="flex flex-wrap gap-2">
              {insight.keyThemes.map((theme, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-purple-950/60 border border-purple-500/40 rounded-lg typo-sub font-medium text-purple-200"
                >
                  #{theme}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 감성 배경 분석 및 전략 제언 */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/80">
            <h4 className="typo-sub font-bold uppercase tracking-wider text-emerald-300 mb-2.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              감성 형성의 주요 원인 및 배경
            </h4>
            <p className="typo-body text-slate-200 leading-relaxed">
              {insight.sentimentRationale}
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-950/80 to-blue-950/80 rounded-xl p-5 border border-indigo-500/40 flex-1">
            <h4 className="typo-sub font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-300" />
              크리에이터를 위한 전략적 제언 및 피드백
            </h4>
            <p className="typo-body text-slate-100 leading-relaxed">
              {insight.strategicAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* 시청자 대표 반응 포인트 요약 */}
      {insight.audienceReactions && insight.audienceReactions.length > 0 && (
        <div className="relative z-10 mt-6 pt-5 border-t border-indigo-800/60">
          <h4 className="typo-sub font-semibold text-slate-300 mb-3">
            주요 시청자 여론 포인트 (요약)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {insight.audienceReactions.map((reaction, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/60 typo-sub text-slate-200 flex items-start gap-2.5"
              >
                <span className="text-indigo-400 font-bold">•</span>
                <span>{reaction}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
