import React from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ReferenceLine
} from 'recharts';
import { StockData, TradeSignal, SignalType } from '../types';

interface StockChartProps {
  data: StockData[];
  signals: TradeSignal[];
  supportLevels: number[];
  resistanceLevels: number[];
  theme: 'light' | 'dark';
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const bgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-800';
    return (
      <div className={`${bgClass} border p-3 rounded shadow-xl text-xs`}>
        <p className="font-bold mb-2">{label}</p>
        <p className="text-emerald-500">Yüksek: {data.high}</p>
        <p className="text-rose-500">Düşük: {data.low}</p>
        <p className="text-blue-500">Kapanış: {data.close}</p>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>Hacim: {data.volume.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, signals, supportLevels, resistanceLevels, theme }) => {
  
  // Transform signals to be renderable on the chart
  const chartData = data.map((d, idx) => {
    const signal = signals.find(s => s.index === idx);
    return {
      ...d,
      signalType: signal ? signal.type : null,
      signalPrice: signal ? d.close : null, 
      signalDesc: signal ? signal.description : null
    };
  });

  const minPrice = Math.min(...data.map(d => d.low)) * 0.95;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.05;

  const axisColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';

  return (
    <div className="w-full h-[400px] bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 backdrop-blur-sm transition-colors">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke={axisColor}
            tick={{fontSize: 10}} 
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke={axisColor}
            tick={{fontSize: 10}} 
            width={40}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip theme={theme} />} />
          
          <Area 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClose)" 
          />

          <Scatter 
            name="Buy Signals" 
            data={chartData.filter(d => d.signalType === SignalType.BUY)} 
            fill="#10b981" 
            shape="triangle" 
            dataKey="signalPrice"
          />
          <Scatter 
            name="Sell Signals" 
            data={chartData.filter(d => d.signalType === SignalType.SELL)} 
            fill="#f43f5e" 
            shape="triangle-down" 
            dataKey="signalPrice"
          />

          {supportLevels.map((level, i) => (
            <ReferenceLine key={`sup-${i}`} y={level} stroke="#10b981" strokeDasharray="5 5" strokeOpacity={0.5} label={{ value: 'Destek', position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
          ))}
          {resistanceLevels.map((level, i) => (
            <ReferenceLine key={`res-${i}`} y={level} stroke="#f43f5e" strokeDasharray="5 5" strokeOpacity={0.5} label={{ value: 'Direnç', position: 'insideLeft', fill: '#f43f5e', fontSize: 10 }} />
          ))}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;