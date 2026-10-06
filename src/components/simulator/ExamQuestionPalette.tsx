import React from 'react';
import { QuestionAnswerStatus } from '../../types';

interface ExamQuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  questionStatuses: Record<number, QuestionAnswerStatus>;
  onSelectQuestion: (index: number) => void;
}

export const ExamQuestionPalette: React.FC<ExamQuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  questionStatuses,
  onSelectQuestion
}) => {
  // Counts
  let answered = 0;
  let notAnswered = 0;
  let markedReview = 0;
  let notVisited = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const status = questionStatuses[i] || 'not-visited';
    if (status === 'answered') answered++;
    else if (status === 'not-answered') notAnswered++;
    else if (status === 'marked-for-review' || status === 'answered-and-marked') markedReview++;
    else notVisited++;
  }

  const getStatusButtonClass = (status: QuestionAnswerStatus, isCurrent: boolean) => {
    let base = 'relative flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all shadow-2xs';
    if (isCurrent) {
      base += ' ring-2 ring-blue-600 ring-offset-2 ring-offset-white scale-105';
    }

    switch (status) {
      case 'answered':
        return `${base} bg-emerald-600 text-white`;
      case 'not-answered':
        return `${base} bg-rose-500 text-white`;
      case 'marked-for-review':
        return `${base} bg-purple-600 text-white`;
      case 'answered-and-marked':
        return `${base} bg-purple-600 text-white`;
      case 'not-visited':
      default:
        return `${base} bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200`;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono m-0">
          Question Palette
        </h4>
        <span className="text-[10px] text-slate-500 font-mono font-semibold">
          {totalQuestions} Questions
        </span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-700 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-emerald-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
            {answered}
          </span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-rose-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
            {notAnswered}
          </span>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-purple-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
            {markedReview}
          </span>
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono flex items-center justify-center font-bold">
            {notVisited}
          </span>
          <span>Not Visited</span>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-100">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const status = questionStatuses[idx] || 'not-visited';
          const isCurrent = currentIndex === idx;
          const isMarkedAndAnswered = status === 'answered-and-marked';

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={getStatusButtonClass(status, isCurrent)}
            >
              {idx + 1}
              {isMarkedAndAnswered && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
