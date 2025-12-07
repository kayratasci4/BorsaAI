import React, { useState, useEffect, useCallback } from 'react';
import StockChart from './components/StockChart';
import AnalysisCard from './components/AnalysisCard';
import NewsFeed from './components/NewsFeed';
import { generateMockData } from './utils/mockData';
import { analyzeTechnicalData, getMarketSentiment } from './services/geminiService';
import { StockData, AnalysisResult, MarketSentiment, AssetContext } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('BIST 100');
  const [currentAsset, setCurrentAsset] = useState<AssetContext>({ query: 'BIST 100', displayName: 'BIST 100 Endeksi' });
  
  const [data, setData] = useState<StockData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Apply theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setCurrentAsset({
      query: searchTerm,
      displayName: searchTerm.toUpperCase()
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSentiment(null);

    try {
      // 1. Generate realistic price data locally (Simulated for chart visualization)
      // Since we don't have a paid real-time finance API, we simulate the chart
      // but use REAL intelligence from Gemini for the commentary.
      const mockPrices = generateMockData(100, 100 + Math.random() * 50);
      setData(mockPrices);

      // 2. Parallel API Calls to Gemini
      const [sentimentRes, analysisRes] = await Promise.all([
        getMarketSentiment(currentAsset.query),
        analyzeTechnicalData(currentAsset.query, mockPrices)
      ]);

      setSentiment(sentimentRes);
      setAnalysis(analysisRes);

    } catch (err) {
      console.error(err);
      setError("Veriler alınırken bir hata oluştu. Lütfen bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  }, [currentAsset]);

  // Trigger fetch when currentAsset changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Suggested / Trending items for quick access
  const SUGGESTIONS = ["Türk Hava Yolları", "Gram Altın", "Bitcoin", "Aselsan", "USD/TRY", "Tesla"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-200 pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Borsa<span className="text-indigo-600 dark:text-indigo-500">AI</span></span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title={theme === 'dark' ? "Aydınlık Mod" : "Karanlık Mod"}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ne Analiz Etmek İstersiniz?
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            Hisse senedi, emtia veya döviz... İstediğinizi yazın, yapay zeka analiz etsin.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group z-20">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Örn: Ereğli, Ons Altın, BTC, Google..."
              className="block w-full pl-12 pr-24 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-lg"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 rounded-xl transition-colors"
            >
              Analiz Et
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSearchTerm(item);
                  setCurrentAsset({ query: item, displayName: item.toUpperCase() });
                }}
                className="text-xs bg-gray-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentAsset.displayName}</h2>
           <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs rounded font-medium border border-indigo-200 dark:border-indigo-500/30">CANLI ANALİZ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Container */}
            <div className="bg-white dark:bg-slate-800/50 p-1 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl relative transition-colors">
               {loading && (
                 <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors">
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">Piyasa verileri taranıyor...</span>
                   </div>
                 </div>
               )}
               <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-700 dark:text-slate-200">Teknik Sinyaller</h2>
                  <div className="flex gap-4 text-xs">
                     <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> AL</div>
                     <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> SAT</div>
                  </div>
               </div>
               <div className="p-2">
                 {/* Chart data is simulated for visualization of buy/sell point logic */}
                 <StockChart 
                    data={data} 
                    signals={analysis?.signals || []} 
                    supportLevels={analysis?.supportLevels || []}
                    resistanceLevels={analysis?.resistanceLevels || []}
                    theme={theme}
                 />
               </div>
            </div>

            {/* News Feed */}
            <NewsFeed sentiment={sentiment} loading={loading} />
          </div>

          {/* Analysis Sidebar */}
          <div className="lg:col-span-1">
            <AnalysisCard analysis={analysis} loading={loading} />
            
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 p-4 rounded-xl transition-colors">
               <h4 className="text-indigo-600 dark:text-indigo-400 font-bold mb-2 text-sm uppercase">Bilgilendirme</h4>
               <p className="text-xs text-indigo-800/70 dark:text-indigo-200/70 leading-relaxed">
                 Bu uygulama, girdiğiniz arama terimi için yapay zeka (Gemini) kullanarak internetteki güncel verileri tarar ve yorumlar.
                 Grafik verileri simülasyon amaçlıdır. Yatırım tavsiyesi değildir.
               </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;