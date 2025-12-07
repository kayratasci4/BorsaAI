import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisCardProps {
  analysis: AnalysisResult | null;
  loading: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="h-full bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 animate-pulse flex flex-col gap-4">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
        <div className="mt-auto h-20 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-full bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-400">
        Analiz verisi bekleniyor...
      </div>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Yükseliş': return 'text-emerald-600 dark:text-emerald-400';
      case 'Düşüş': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Düşük': return 'text-emerald-600 dark:text-emerald-400';
      case 'Yüksek': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 backdrop-blur-sm h-full flex flex-col transition-colors">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Teknik Görünüm
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
          <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Trend</span>
          <p className={`text-lg font-bold ${getTrendColor(analysis.trend)}`}>{analysis.trend}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
          <span className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Risk</span>
          <p className={`text-lg font-bold ${getRiskColor(analysis.riskLevel)}`}>{analysis.riskLevel}</p>
        </div>
      </div>

      <div className="mb-6 flex-grow">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Yapay Zeka Yorumu</h4>
        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{analysis.summary}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Önemli Seviyeler</h4>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <span className="text-emerald-600 dark:text-emerald-500 font-medium block mb-1">Destek</span>
            {analysis.supportLevels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.supportLevels.map((val, i) => (
                  <span key={i} className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">{val}</span>
                ))}
              </div>
            ) : <span className="text-gray-400">-</span>}
          </div>
          <div className="flex-1">
            <span className="text-rose-600 dark:text-rose-500 font-medium block mb-1">Direnç</span>
            {analysis.resistanceLevels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.resistanceLevels.map((val, i) => (
                  <span key={i} className="bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 px-2 py-1 rounded border border-rose-200 dark:border-rose-500/20">{val}</span>
                ))}
              </div>
            ) : <span className="text-gray-400">-</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;