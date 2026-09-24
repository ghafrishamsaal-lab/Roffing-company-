import React from 'react';
import { QuoteStatus } from '../../types';

interface StatusBadgeProps {
  status: QuoteStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Pending':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Contacted':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Approved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'In Progress':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Completed':
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
      break;
    case 'Rejected':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'unread':
      colorClasses = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'read':
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
    case 'replied':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {status}
    </span>
  );
};
