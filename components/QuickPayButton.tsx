import React from 'react';
import { Plus } from 'lucide-react';

interface QuickPayButtonProps {
  onClick: () => void;
}

export const QuickPayButton: React.FC<QuickPayButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white border-2 border-blue-600 text-blue-600 h-20 rounded-2xl flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-sm hover:bg-blue-50"
    >
      <div className="bg-blue-600 rounded-full p-2 shadow-md">
        <Plus className="h-6 w-6 text-white" strokeWidth={3} />
      </div>
      <span className="text-xl font-bold font-ethiopic">አዲስ ክፍያ ተቀበል (New Payment)</span>
    </button>
  );
};