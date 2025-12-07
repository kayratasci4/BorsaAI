import React from 'react';
import { MarketSentiment } from '../types';

interface NewsFeedProps {
  sentiment: MarketSentiment | null;
  loading: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ sentiment, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mt-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!sentiment) return null;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mt-6 backdrop-blur-sm transition-colors">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        Piyasa Haberleri & Gelişmeler
      </h3>
      
      <div className="prose prose-sm max-w-none mb-6 text-gray-600 dark:text-slate-300">
        {/* Render the summary text, preserving newlines */}
        <p className="whitespace-pre-line leading-relaxed">
            {sentiment.summary}
        </p>
      </div>

      {sentiment.sources.length > 0 && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-3">Kaynaklar (Google Search)</h4>
          <div className="flex flex-wrap gap-2">
            {sentiment.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-xs px-3 py-2 rounded transition-colors truncate max-w-[200px]"
                title={source.title}
              >
                <span className="truncate">{source.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;