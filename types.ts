export interface StockData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum SignalType {
  BUY = 'AL',
  SELL = 'SAT',
  HOLD = 'TUT',
  NEUTRAL = 'NÖTR'
}

export interface TradeSignal {
  index: number; // Index in the StockData array
  price: number;
  type: SignalType;
  description: string;
}

export interface AnalysisResult {
  summary: string;
  supportLevels: number[];
  resistanceLevels: number[];
  signals: TradeSignal[];
  trend: 'Yükseliş' | 'Düşüş' | 'Yatay';
  riskLevel: 'Düşük' | 'Orta' | 'Yüksek';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MarketSentiment {
  summary: string;
  news: string[];
  sources: GroundingSource[];
  sentimentScore: number; // 0 to 100 (0 bearish, 100 bullish)
}

// Simplified to just represent the current view context
export interface AssetContext {
  query: string; // The user's search term
  displayName: string; // Formatted name
}