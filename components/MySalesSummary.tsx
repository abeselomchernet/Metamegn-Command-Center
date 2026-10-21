import React from 'react';

interface MySalesSummaryProps {
  total: number;
  count: number;
}

export const MySalesSummary: React.FC<MySalesSummaryProps> = ({ total, count }) => {
  return (
    <div className="bg-gradient-to-br from-brand-green to-green-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      <p className="text-green-100 text-sm font-medium font-ethiopic">የዛሬ ድምር (Today's Total)</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h2 className="text-4xl font-black tracking-tight">ETB {total.toLocaleString()}</h2>
        <span className="text-green-200 text-sm font-medium">({count} ግብይቶች)</span>
      </div>
      
      {/* Progress bar simulation */}
      <div className="mt-4 h-1.5 bg-black/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/90 w-2/3 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
      </div>
    </div>
  );
};