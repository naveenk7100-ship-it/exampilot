import React from 'react';
import { MistakeEntry } from '../../types';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface RecentMistakesWidgetProps {
  mistakes: MistakeEntry[];
  onOpenMistakeBook: () => void;
  onRemediateMistake: (mistake: MistakeEntry) => void;
}

export const RecentMistakesWidget: React.FC<RecentMistakesWidgetProps> = ({
  mistakes,
  onOpenMistakeBook,
  onRemediateMistake
}) => {
  const unresolvedMistakes = mistakes.filter(m => !m.resolved).slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Calculation':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Missing unit':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Wrong method':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Poor answer structure':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
              Recent Mistakes
            </h3>
            {unresolvedMistakes.length > 0 && (
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {unresolvedMistakes.length} Active
              </span>
            )}
          </div>
          <button
            onClick={onOpenMistakeBook}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <span>Mistake Book</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {unresolvedMistakes.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1" />
            <p className="font-bold text-slate-800 m-0">Zero active mistakes!</p>
            <p className="text-[11px] text-slate-400 m-0">Solve new board questions to identify hidden traps.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {unresolvedMistakes.map(m => (
              <div
                key={m.id}
                className="p-3 bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-rose-200 hover:shadow-xs rounded-xl flex items-start justify-between gap-3 transition-all group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border font-mono ${getCategoryColor(m.category)}`}>
                      {m.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 truncate">
                      {m.subjectId}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                      <Clock size={10} />
                      {formatDate(m.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium line-clamp-1 m-0">
                    {m.userNote || m.topic || 'Error identified during board question solving'}
                  </p>
                </div>

                <button
                  onClick={() => onRemediateMistake(m)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  <span>Fix</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span>Total Logged: {mistakes.length}</span>
        <span className="text-rose-600 font-semibold flex items-center gap-1">
          <AlertTriangle size={12} />
          {unresolvedMistakes.length} needing step remediation
        </span>
      </div>
    </div>
  );
};
