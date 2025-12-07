import { StockData } from "../types";

export const generateMockData = (days: number = 100, startPrice: number = 100): StockData[] => {
  let currentPrice = startPrice;
  const data: StockData[] = [];
  const now = new Date();
  
  // Go back 'days' in time
  const startDate = new Date();
  startDate.setDate(now.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Random walk with drift
    const changePercent = (Math.random() - 0.48) * 0.05; // Slightly bullish bias
    const open = currentPrice;
    const close = currentPrice * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000) + 50000;

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });

    currentPrice = close;
  }
  return data;
};

export const STOCK_LIST = [
  // Emtialar
  { symbol: "ALTIN.S1", name: "Gram Altın", sector: "Emtia" },
  { symbol: "GUMUS.S1", name: "Gram Gümüş", sector: "Emtia" },
  
  // BIST 30 & Popüler Hisseler
  { symbol: "THYAO", name: "Türk Hava Yolları", sector: "Ulaştırma" },
  { symbol: "GARAN", name: "Garanti BBVA", sector: "Bankacılık" },
  { symbol: "AKBNK", name: "Akbank", sector: "Bankacılık" },
  { symbol: "ISCTR", name: "İş Bankası (C)", sector: "Bankacılık" },
  { symbol: "YKBNK", name: "Yapı Kredi", sector: "Bankacılık" },
  { symbol: "ASELS", name: "Aselsan", sector: "Savunma" },
  { symbol: "KCHOL", name: "Koç Holding", sector: "Holding" },
  { symbol: "SAHOL", name: "Sabancı Holding", sector: "Holding" },
  { symbol: "EREGL", name: "Ereğli Demir Çelik", sector: "Sanayi" },
  { symbol: "KRDMD", name: "Kardemir (D)", sector: "Sanayi" },
  { symbol: "SISE", name: "Şişecam", sector: "Sanayi" },
  { symbol: "TUPRS", name: "Tüpraş", sector: "Petrol & Kimya" },
  { symbol: "PETKM", name: "Petkim", sector: "Petrol & Kimya" },
  { symbol: "BIMAS", name: "BİM Mağazalar", sector: "Perakende" },
  { symbol: "MGROS", name: "Migros", sector: "Perakende" },
  { symbol: "SOKM", name: "Şok Marketler", sector: "Perakende" },
  { symbol: "TOASO", name: "Tofaş Oto", sector: "Otomotiv" },
  { symbol: "FROTO", name: "Ford Otosan", sector: "Otomotiv" },
  { symbol: "TTKOM", name: "Türk Telekom", sector: "İletişim" },
  { symbol: "TCELL", name: "Turkcell", sector: "İletişim" },
  { symbol: "ENKAI", name: "Enka İnşaat", sector: "İnşaat" },
  { symbol: "VESTL", name: "Vestel", sector: "Teknoloji" },
  { symbol: "ARCLK", name: "Arçelik", sector: "Dayanıklı Tüketim" },
  { symbol: "KOZAL", name: "Koza Altın", sector: "Madencilik" },
  { symbol: "KOZAA", name: "Koza Anadolu", sector: "Madencilik" },
  { symbol: "IPEKE", name: "İpek Doğal Enerji", sector: "Enerji" },
  { symbol: "ASTOR", name: "Astor Enerji", sector: "Enerji" },
  { symbol: "EUPWR", name: "Europower Enerji", sector: "Enerji" },
  { symbol: "SASA", name: "Sasa Polyester", sector: "Kimya" },
  { symbol: "HEKTS", name: "Hektaş", sector: "Tarım & Kimya" },
];