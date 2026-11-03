'use client';

import React, { useState } from 'react';
import { StatCards } from '@/components/StatCards';
import { InteractiveCharts } from '@/components/InteractiveCharts';
import { BigramNetwork } from '@/components/BigramNetwork';
import { AdvancedViewerAnalysis } from '@/components/AdvancedViewerAnalysis';
import { AIInsightsSection } from '@/components/AIInsightsSection';
import { AnalysisSkeleton } from '@/components/AnalysisSkeleton';
import { AnalysisSummary } from '@/types/analysis';
import {
  RotateCcw,
  Search,
  Sparkles,
  PlaySquare,
  AlertCircle,
  Lock,
  Layers
} from 'lucide-react';

export default function Home() {
  const [videoInput, setVideoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisSummary | null>(null);

  // 빠른 샘플 비디오 클릭 핸들러
  const handleSampleClick = (sampleId: string) => {
    setVideoInput(sampleId);
    executeAnalysis(sampleId);
  };

  const executeAnalysis = async (inputVal: string) => {
    if (!inputVal.trim()) {
      setError('유튜브 영상 URL 또는 비디오 ID를 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep('1단계: YouTube API를 통해 영상 정보 및 댓글을 수집하고 있습니다...');

    const timer1 = setTimeout(() => {
      setLoadingStep('2단계: Gemini 3.6 Flash로 한국어 형태소 분석 및 품사 원형 복원을 수행합니다...');
    }, 2200);

    const timer2 = setTimeout(() => {
      setLoadingStep('3단계: 감성 분류 및 바이그램 연관 단어 쌍 네트워크를 계산합니다...');
    }, 4500);

    const timer3 = setTimeout(() => {
      setLoadingStep('4단계: 시청자 Q&A 추출, 페르소나 유형 및 반응 폭발 피크 시간대를 분석 중입니다...');
    }, 7000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoInput: inputVal,
          maxComments: 100
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || '분석 과정에서 오류가 발생했습니다.');
      }

      setAnalysisData(json.data);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      console.error(err);
      setError(err.message || '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAnalysis(videoInput);
  };

  // 요구사항 11: [다시시작] 버튼 기능
  const handleReset = () => {
    setVideoInput('');
    setAnalysisData(null);
    setError(null);
    setLoading(false);
    setLoadingStep('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white">
              <PlaySquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                YouTube Comments Analyzer
              </span>
              <span className="ml-2.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
          </div>

          {/* 다시시작 버튼 */}
          {analysisData && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-all cursor-pointer active:scale-95 hover:border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>다시시작</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
        {/* 분석 전 검색/입력 히어로 섹션 */}
        {!analysisData && !loading && (
          <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center max-w-3xl mx-auto">
            {/* 뱃지 태그 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-xs text-xs font-medium text-indigo-700 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>형태소 분석 · 시청자 Q&A & 페르소나 · 반응 폭발 시간대 진단</span>
            </div>

            {/* 타이포 스케일 1.333 기반 대제목 */}
            <h1 className="typo-h1 text-slate-900 mb-4 max-w-2xl">
              유튜브 댓글을 <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 bg-clip-text text-transparent">더 깊고 똑똑하게</span> 분석하세요
            </h1>
            <p className="typo-body text-slate-600 mb-10 max-w-xl leading-relaxed">
              Google Gemini 3.6 Flash 모델을 활용하여 댓글 문장의 형태소 분석, 시청자 질문(Q&A) 추출, 시청자 페르소나 유형 및 반응 폭발 시간대를 인터랙티브하게 시각화합니다.
            </p>

            {/* 검색 폼 (60-30-10 강조색 10% 적용) */}
            <form onSubmit={handleFormSubmit} className="w-full flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="유튜브 영상 링크 또는 비디오 ID를 입력하세요 (예: dQw4w9WgXcQ)"
                  disabled={loading}
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                />
                <PlaySquare className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>댓글 분석 시작</span>
              </button>
            </form>

            {/* 에러 피드백 */}
            {error && (
              <div className="mt-6 w-full p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 text-left shadow-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <div>
                  <div className="font-semibold">오류가 발생했습니다</div>
                  <div className="text-xs text-rose-700 mt-0.5">{error}</div>
                </div>
              </div>
            )}

            {/* 빠른 테스트용 샘플 링크 */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs text-slate-500">
              <span className="font-medium text-slate-600">빠른 테스트 샘플:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => handleSampleClick('dQw4w9WgXcQ')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs font-medium hover:border-slate-300"
                >
                  Rick Astley - Never Gonna Give You Up
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('9bZkp7q19f0')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs font-medium hover:border-slate-300"
                >
                  PSY - GANGNAM STYLE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 진행 상태 Skeleton UI (Shimmer 애니메이션 적용) */}
        {loading && (
          <AnalysisSkeleton currentStep={loadingStep} />
        )}

        {/* 분석 완료 결과 대시보드 */}
        {analysisData && !loading && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Top Video Header Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {analysisData.videoInfo?.thumbnailUrl && (
                  <img
                    src={analysisData.videoInfo.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-semibold">
                      분석 완료
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      채널: {analysisData.videoInfo?.channelTitle || 'YouTube'}
                    </span>
                  </div>
                  <h2 className="typo-h4 text-slate-900 line-clamp-1 font-bold">
                    {analysisData.videoInfo?.title || '유튜브 영상 댓글 분석 대시보드'}
                  </h2>
                  <p className="typo-sub text-slate-500 mt-0.5">
                    총 {analysisData.totalComments}개의 댓글 수집 및 다차원 AI 심층 분석 완료 (댓글 원문 비노출 보호 모드 적용)
                  </p>
                </div>
              </div>

              {/* 상단 다시시작 액션 버튼 */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white typo-sub font-semibold shadow-sm shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>새로운 영상 분석 (다시시작)</span>
                </button>
              </div>
            </div>

            {/* 1. 댓글 종합 통계 카드 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                <h3 className="typo-h4 text-slate-800 font-bold">
                  1. 댓글 통계 요약 카드
                </h3>
              </div>
              <StatCards data={analysisData} />
            </section>

            {/* 2~4. 시간대별 추이 및 감성 분포 · 고빈도 키워드 TOP 20 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                <h3 className="typo-h4 text-slate-800 font-bold">
                  2~4. 시간대별 등록 및 감성 추이 · 형태소 키워드 TOP 20
                </h3>
              </div>
              <InteractiveCharts
                hourlyData={analysisData.hourlyTrends}
                sentimentDist={analysisData.sentimentDistribution}
                keywords={analysisData.topKeywords}
              />
            </section>

            {/* 5~8. 바이그램 네트워크 시각화 및 요약 */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                    <h3 className="typo-h4 text-slate-900 font-bold">
                      5~8. 바이그램(Bigram) 단어 쌍 인터랙티브 네트워크 시각화
                    </h3>
                  </div>
                  <p className="typo-sub text-slate-500 mt-1">
                    한국어 형태소 분석을 통해 복원된 원형 단어 쌍의 상관관계를 화면 경계 안쪽에 최적으로 배치합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">
                    경계 이탈 방지 제약 적용됨
                  </span>
                </div>
              </div>

              {/* 바이그램 네트워크 그래프 & 아래 요약 정보 */}
              <BigramNetwork
                data={analysisData.bigramNetwork}
                summary={analysisData.bigramSummary}
              />
            </section>

            {/* 신규 기능 3종 섹션: 시청자 Q&A · 페르소나 의도 · 반응 폭발 시간대 분석 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                <h3 className="typo-h4 text-slate-800 font-bold">
                  심층 시청자 분석: Q&A 추출 · 페르소나 유형 · 반응 폭발 시간대 분석
                </h3>
              </div>
              <AdvancedViewerAnalysis
                inquiries={analysisData.viewerInquiries}
                personas={analysisData.viewerPersonas}
                spikeAnalysis={analysisData.peakSpikeAnalysis}
              />
            </section>

            {/* 9. AI 심층 해석 섹션 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                <h3 className="typo-h4 text-slate-800 font-bold">
                  9. 댓글 분석 기반 AI 종합 해석 및 전략 제언
                </h3>
              </div>
              <AIInsightsSection insight={analysisData.aiInsight} />
            </section>

            {/* 10. 댓글 원문 비노출 보호 안내 배너 */}
            <div className="py-3.5 px-5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-center typo-sub text-slate-600 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>개인정보 보호 및 통계 집계 원칙(요구사항 10)에 따라 개별 댓글 원문은 일체 노출되지 않으며 집계된 지표로만 제공됩니다.</span>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer 영역 */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              INU
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800">
                Copyright INU YouTube Comments Analyzer by Wooyoung Kwon
              </p>
              <p className="text-[11px] text-slate-500">
                Powered by Google Gemini 3.6 Flash & YouTube Data API v3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="hover:text-slate-800 transition-colors">자연어 처리 (NLP)</span>
            <span className="hover:text-slate-800 transition-colors">시청자 Q&A & 페르소나</span>
            <span className="hover:text-slate-800 transition-colors">반응 폭발 피크 진단</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
