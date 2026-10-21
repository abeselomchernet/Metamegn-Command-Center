import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  subTitle: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  subTitle, 
  value, 
  icon: Icon, 
  trend, 
  trendUp 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
            <p className="text-xs text-slate-400 font-ethiopic mt-0.5">{subTitle}</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          <Icon size={20} />
        </div>
      </div>
      
      <div className="mt-auto">
        <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            <span className="font-medium">{trend}</span>
            <span className="text-slate-400 ml-1 font-normal">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};