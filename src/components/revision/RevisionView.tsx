import React, { useState } from 'react';
import { Chapter, SubjectId } from '../../types';
import { ActiveRevisionSession } from './ActiveRevisionSession';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface RevisionViewProps {
  chapters: Chapter[];
  enrolledSubjects?: SubjectId[];
  onCompleteRevision: (chapterId: string) => void;
  initialChapterId?: string;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  chapters,
  enrolledSubjects,
  onCompleteRevision,
  initialChapterId
}) => {
  const availableChapters = enrolledSubjects
    ? chapters.filter(c => enrolledSubjects.includes(c.subjectId))
    : chapters;

  const [selectedChapterId, setSelectedChapterId] = useState<string>(() => {
    if (initialChapterId && availableChapters.some(c => c.id === initialChapterId)) return initialChapterId;
    const weak = availableChapters.find(c => c.readiness.revision !== 'strong');
    return weak ? weak.id : (availableChapters[0]?.id || chapters[0].id);
  });

  const [activeSessionChapter, setActiveSessionChapter] = useState<Chapter | null>(null);

  const selectedChapter = availableChapters.find(c => c.id === selectedChapterId) || availableChapters[0] || chapters[0];

  const handleStartSprint = () => {
    setActiveSessionChapter(selectedChapter);
  };

  if (activeSessionChapter) {
    return (
      <ActiveRevisionSession
        chapter={activeSessionChapter}
        totalDurationMinutes={15}
        onSessionComplete={chapterId => {
          onCompleteRevision(chapterId);
        }}
        onExit={() => setActiveSessionChapter(null)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Revision Mode Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full">
              <Sparkles size={12} /> Targeted Micro-Revision
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">15-Minute Protocol</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
            Precision Revision Sprint
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
            Never waste hours passively re-reading entire textbooks. ExamPilot breaks revision into 3 high-impact phases: 5 min core concept recall, 5 min high-yield question solving, and 5 min board rubric & mistake review.
          </p>
        </div>
      </div>

      {/* Sprint Configurator Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 max-w-2xl mx-auto">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono m-0 flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          Configure Your 15-Minute Sprint
        </h3>

        {/* Chapter Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Select Chapter to Fortify:
          </label>
          <select
            value={selectedChapterId}
            onChange={e => setSelectedChapterId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-purple-500 transition-colors shadow-xs"
          >
            {availableChapters.map(c => (
              <option key={c.id} value={c.id}>
                [{c.subjectId.toUpperCase()}] {c.name} — (Revision: {c.readiness.revision.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* 3 Phases Preview */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-2">
            The 15-Minute High-Yield Protocol:
          </span>

          <div className="space-y-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-mono font-bold flex items-center justify-center text-[10px]">
                  1
                </span>
                <span className="font-semibold text-slate-800">5 Mins: Core Concept & Theorem Checkpoints</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px] font-bold">Recall Drill</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="font-semibold text-slate-800">5 Mins: High-Yield Question Solving (6 Thinking Steps)</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px] font-bold">Active Problem</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-mono font-bold flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="font-semibold text-slate-800">5 Mins: CBSE Watchouts & Common Pitfalls Audit</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px] font-bold">Trap Shield</span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStartSprint}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span>Start 15-Minute Revision Sprint</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
