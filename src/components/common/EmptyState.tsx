import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-2xl bg-white my-4 shadow-xs">
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 mb-3">
        <Icon size={28} className="text-slate-600" />
      </div>
      <h4 className="text-base font-extrabold text-slate-900 mb-1 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
