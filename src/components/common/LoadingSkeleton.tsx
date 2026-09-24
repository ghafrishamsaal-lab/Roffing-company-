import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse w-full">
      <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-6" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-16 bg-slate-100 rounded-xl w-full" />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border border-slate-200 rounded-2xl p-5 bg-white animate-pulse">
      <div className="w-full aspect-video bg-slate-200 rounded-xl mb-4" />
      <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3" />
      <div className="h-4 bg-slate-100 rounded-md w-full mb-2" />
      <div className="h-4 bg-slate-100 rounded-md w-2/3" />
    </div>
  );
};
