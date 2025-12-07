import { GoogleGenAI, Type } from "@google/genai";
import { StockData, AnalysisResult, MarketSentiment, SignalType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketSentiment = async (query: string): Promise<MarketSentiment> => {
  const model = "gemini-2.5-flash";
  
  try {
    // Enhanced prompt for free-text search
    const prompt = `"${query}" hakkında finansal piyasalardaki son durumu, güncel fiyat hareketlerini, önemli haberleri ve uzman yorumlarını araştır. 
    Eğer bu bir hisse senedi, emtia veya kripto para ise, yatırımcıların genel hissiyatını (bullish/bearish) özetle.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Sen profesyonel bir piyasa analistisin. Türkçe yanıt ver. Yanıtın kısa, öz ve bilgi verici olsun."
      },
    });

    const text = response.text || "Veri alınamadı.";
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title) || [];

    return {
      summary: text,
      news: [], 
      sources: sources,
      sentimentScore: 50 
    };

  } catch (error) {
    console.error("Gemini Market Sentiment Error:", error);
    return {
      summary: "Haber verilerine şu an ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.",
      news: [],
      sources: [],
      sentimentScore: 50
    };
  }
};

export const analyzeTechnicalData = async (symbol: string, data: StockData[]): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash"; 
  
  const recentData = data.slice(-40);
  
  // Prompt updated to reflect that 'symbol' is a user search query
  const prompt = `
    Aşağıdaki JSON verisi sanal bir grafik verisidir. Ancak sen "${symbol}" için GENEL PİYASA BİLGİNİ kullanarak ve aşağıdaki matematiksel verilere bakarak teknik bir yorum yap.
    
    Veri (Son 40 mum): ${JSON.stringify(recentData)}
    
    Görevin:
    1. Verilen matematiksel veriyi analiz et (RSI, MACD benzeri mantık).
    2. Destek ve Direnç seviyelerini sayısal verilere göre belirle.
    3. Alım (BUY) veya satım (SELL) noktalarını tespit et.
    4. "${symbol}" varlığının gerçek dünyadaki genel trendini de göz önünde bulundurarak (örneğin son haberler pozitifse yükseliş eğilimi olabilir) bir trend belirle.

    Yanıtını SADECE aşağıdaki JSON şemasına uygun ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Teknik analiz yorumu (Türkçe)" },
            supportLevels: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            resistanceLevels: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            trend: { type: Type.STRING, enum: ["Yükseliş", "Düşüş", "Yatay"] },
            riskLevel: { type: Type.STRING, enum: ["Düşük", "Orta", "Yüksek"] },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER, description: "Verilen dizideki index (0-39 arası)" },
                  price: { type: Type.NUMBER },
                  type: { type: Type.STRING, enum: ["AL", "SAT", "TUT", "NÖTR"] },
                  description: { type: Type.STRING, description: "Sinyal nedeni" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as AnalysisResult;
      
      const offset = data.length - 40;
      const adjustedSignals = result.signals.map(s => ({
        ...s,
        index: s.index + offset
      }));

      return {
        ...result,
        signals: adjustedSignals
      };
    }
    throw new Error("Boş yanıt");

  } catch (error) {
    console.error("Technical Analysis Error:", error);
    return {
      summary: "Teknik analiz oluşturulurken bir hata oluştu.",
      supportLevels: [],
      resistanceLevels: [],
      signals: [],
      trend: "Yatay",
      riskLevel: "Orta"
    };
  }
};