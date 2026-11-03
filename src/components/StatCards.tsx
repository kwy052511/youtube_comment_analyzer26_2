import React from 'react';
import { MessageSquare, AlignLeft, ThumbsUp, Activity } from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface Props {
  data: AnalysisSummary;
}

export function StatCards({ data }: Props) {
  const isPositiveDominant = data.sentimentDistribution.positiveRatio >= data.sentimentDistribution.negativeRatio;

  const stats = [
    {
      title: '총 분석 댓글 수',
      value: `${data.totalComments.toLocaleString()}개`,
      desc: '자연어 형태소 분석 완료',
      icon: MessageSquare,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: '댓글 평균 길이',
      value: `${data.averageLength}자`,
      desc: '문장당 평균 글자 수',
      icon: AlignLeft,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
    },
    {
      title: '최고 좋아요 수',
      value: `${data.maxLikes.toLocaleString()}개`,
      desc: '가장 많은 공감을 얻은 댓글',
      icon: ThumbsUp,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
    },
    {
      title: '지배적 감성 여론',
      value: isPositiveDominant
        ? `긍정 우세 (${data.sentimentDistribution.positiveRatio}%)`
        : `부정 우세 (${data.sentimentDistribution.negativeRatio}%)`,
      desc: `긍정 ${data.sentimentDistribution.positive} / 중립 ${data.sentimentDistribution.neutral} / 부정 ${data.sentimentDistribution.negative}`,
      icon: Activity,
      iconColor: isPositiveDominant ? 'text-emerald-600' : 'text-rose-600',
      iconBg: isPositiveDominant ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="typo-sub font-semibold text-slate-500">
                {stat.title}
              </span>
              <div className={`p-2 rounded-xl border ${stat.iconBg} ${stat.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="typo-h3 text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <p className="typo-sub text-slate-400 mt-1">
                {stat.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
