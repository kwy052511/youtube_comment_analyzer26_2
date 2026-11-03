'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { HourlySentiment, KeywordItem } from '@/types/analysis';

interface Props {
  hourlyData: HourlySentiment[];
  sentimentDist: {
    positive: number;
    neutral: number;
    negative: number;
    positiveRatio: number;
    neutralRatio: number;
    negativeRatio: number;
  };
  keywords: KeywordItem[];
}

const SENTIMENT_COLORS = {
  positive: '#10b981', // Emerald
  neutral: '#64748b',  // Slate
  negative: '#ef4444'   // Red
};

export function InteractiveCharts({ hourlyData, sentimentDist, keywords }: Props) {
  const pieData = [
    { name: '긍정', value: sentimentDist.positive, ratio: sentimentDist.positiveRatio, color: SENTIMENT_COLORS.positive },
    { name: '중립', value: sentimentDist.neutral, ratio: sentimentDist.neutralRatio, color: SENTIMENT_COLORS.neutral },
    { name: '부정', value: sentimentDist.negative, ratio: sentimentDist.negativeRatio, color: SENTIMENT_COLORS.negative }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. 시간대별 라인 차트 영역 (2개) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간대별 댓글 수 라인 차트 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="typo-h4 text-slate-900">
                시간대별 댓글 등록 추이
              </h3>
              <p className="typo-sub text-slate-500">
                작성 시간대별 전체 댓글 수의 변화 흐름
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
              라인 차트
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                  labelFormatter={(val, items) => {
                    const item = items?.[0]?.payload;
                    return item?.fullDate ? `일시: ${item.fullDate}` : val;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="댓글 수"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#4338ca' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 시간대별 긍정, 부정, 중립 댓글 수 라인 차트 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="typo-h4 text-slate-900">
                시간대별 감성(긍정/부정/중립) 추이
              </h3>
              <p className="typo-sub text-slate-500">
                시간 경과에 따른 여론 및 감정 분포 변화
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 긍정
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> 중립
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> 부정
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                  labelFormatter={(val, items) => {
                    const item = items?.[0]?.payload;
                    return item?.fullDate ? `일시: ${item.fullDate}` : val;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="positive"
                  name="긍정"
                  stroke={SENTIMENT_COLORS.positive}
                  strokeWidth={2.2}
                  dot={{ r: 2.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  name="중립"
                  stroke={SENTIMENT_COLORS.neutral}
                  strokeWidth={2.2}
                  dot={{ r: 2.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  name="부정"
                  stroke={SENTIMENT_COLORS.negative}
                  strokeWidth={2.2}
                  dot={{ r: 2.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. 감정 분포 파이 차트 & 고빈도 TOP 20 키워드 바 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 감정 분포 파이 차트 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <h3 className="typo-h4 text-slate-900">
              전체 감정 분포 비율
            </h3>
            <p className="typo-sub text-slate-500">
              Gemini가 판별한 감성 라벨 분류 점유율
            </p>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}건 (${item.payload.ratio}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="typo-h3 font-bold text-slate-900">
                {sentimentDist.positiveRatio}%
              </span>
              <span className="text-xs font-semibold text-slate-400">긍정 비율</span>
            </div>
          </div>

          {/* 세부 배지 요약 카드 */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-700">긍정</span>
              <p className="typo-body font-bold text-emerald-800">{sentimentDist.positive}건</p>
              <p className="text-[11px] text-emerald-600 font-medium">{sentimentDist.positiveRatio}%</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600">중립</span>
              <p className="typo-body font-bold text-slate-800">{sentimentDist.neutral}건</p>
              <p className="text-[11px] text-slate-500 font-medium">{sentimentDist.neutralRatio}%</p>
            </div>
            <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-700">부정</span>
              <p className="typo-body font-bold text-rose-800">{sentimentDist.negative}건</p>
              <p className="text-[11px] text-rose-600 font-medium">{sentimentDist.negativeRatio}%</p>
            </div>
          </div>
        </div>

        {/* 고빈도 키워드 TOP 20 바 차트 */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="typo-h4 text-slate-900">
                  주요 고빈도 키워드 TOP 20
                </h3>
                <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full border border-indigo-100">
                  한국어 형태소 원형 복원
                </span>
              </div>
              <p className="typo-sub text-slate-500">
                어절 분리 및 활용형을 제거하여 추출한 원형 단어 빈도 분석
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={keywords.slice(0, 20)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  dataKey="keyword"
                  type="category"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
                  stroke="#cbd5e1"
                  width={65}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val}회 (${item.payload.pos || '단어'})`,
                    '출현 빈도'
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="count"
                  name="빈도수"
                  fill="#4f46e5"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
