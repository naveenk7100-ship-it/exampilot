import React from 'react';
import { SmartNextAction } from '../../types';
import { Sparkles, Clock, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';

interface RecommendedTasksCardProps {
  tasks: SmartNextAction[];
  onExecuteTask: (task: SmartNextAction) => void;
}

export const RecommendedTasksCard: React.FC<RecommendedTasksCardProps> = ({
  tasks,
  onExecuteTask
}) => {
  const subjectColors: Record<string, { badge: string; text: string }> = {
    mathematics: { badge: 'bg-blue-50 text-blue-700 border-blue-200/80', text: 'Maths' },
    science: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', text: 'Science' },
    'social-science': { badge: 'bg-amber-50 text-amber-700 border-amber-200/80', text: 'Social Science' },
    english: { badge: 'bg-purple-50 text-purple-700 border-purple-200/80', text: 'English' },
    hindi: { badge: 'bg-rose-50 text-rose-700 border-rose-200/80', text: 'Hindi' }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
              Today's Recommended Tasks
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Top 3
            </span>
          </div>
          <p className="text-xs text-slate-500 m-0">
            Calculated dynamically to target your highest mark-gain opportunities.
          </p>
        </div>

        <Sparkles size={16} className="text-amber-500 shrink-0 hidden sm:block" />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task, idx) => {
          const subInfo = subjectColors[task.subjectId] || { badge: 'bg-slate-100 text-slate-700 border-slate-200', text: task.subjectId };

          return (
            <div
              key={task.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between gap-2.5 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-slate-200/70 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border font-mono ${subInfo.badge}`}>
                      {subInfo.text}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {task.chapterName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {task.estimatedMinutes}m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HelpCircle size={12} className="text-slate-400" />
                      {task.questionCount} Qs
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors m-0">
                  {task.title}
                </h4>

                <p className="text-[11px] text-slate-600 leading-relaxed m-0 font-normal line-clamp-2">
                  {task.reason}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-emerald-700 font-medium flex items-center gap-1 truncate max-w-[240px]">
                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{task.expectedOutcome || 'Build step-by-step clarity'}</span>
                </span>

                <button
                  onClick={() => onExecuteTask(task)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <span>Start</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
