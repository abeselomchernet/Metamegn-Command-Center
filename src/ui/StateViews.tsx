import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-xl my-4">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
        <Inbox size={28} />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <RefreshCw size={24} className="animate-spin text-slate-400 mb-2" />
      <p className="text-xs text-slate-500 font-medium">{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 border border-rose-200 rounded-xl my-4">
      <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-3">
        <AlertCircle size={28} />
      </div>
      <h4 className="text-sm font-semibold text-rose-900 mb-1">Encountered an Issue</h4>
      <p className="text-xs text-rose-600 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-700 rounded-lg hover:bg-rose-800 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
