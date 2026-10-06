import React, { useState, useEffect } from 'react';
import { Chapter } from '../../types';
import { DEMO_QUESTIONS } from '../../data/questionsData';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle 
} from 'lucide-react';

interface ActiveRevisionSessionProps {
  chapter: Chapter;
  totalDurationMinutes?: number;
  onSessionComplete: (chapterId: string) => void;
  onExit: () => void;
}

export const ActiveRevisionSession: React.FC<ActiveRevisionSessionProps> = ({
  chapter,
  totalDurationMinutes: _totalDurationMinutes,
  onSessionComplete,
  onExit
}) => {
  // 3 Phases: 0: Concept (5m), 1: Questions (5m), 2: Mistakes (5m)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(5 * 60);
  const [isFinished, setIsFinished] = useState(false);

  const phases = [
    {
      title: 'Phase 1: Core Concept & Theorem Checkpoints',
      durationMinutes: 5,
      type: 'concept',
      description: 'Review high-yield definitions, formula derivations, and standard CBSE statements.'
    },
    {
      title: 'Phase 2: High-Yield Question Solving Drill',
      durationMinutes: 5,
      type: 'questions',
      description: 'Practice 1 high-probability board question using the 6-step thinking process.'
    },
    {
      title: 'Phase 3: Frequent Board Mistakes & Rubric Review',
      durationMinutes: 5,
      type: 'mistakes',
      description: 'Neutralize typical mark loss traps (units, signs, theorem names, and headings).'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (currentPhaseIndex < phases.length - 1) {
            setCurrentPhaseIndex(c => c + 1);
            return 5 * 60;
          } else {
            setIsFinished(true);
            try {
              confetti({ particleCount: 50, spread: 60 });
            } catch {}
            onSessionComplete(chapter.id);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPhaseIndex, isFinished, phases.length, onSessionComplete, chapter.id]);

  const handleManualNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setSecondsRemaining(5 * 60);
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      onSessionComplete(chapter.id);
    }
  };

  const currentPhase = phases[currentPhaseIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const targetQ = DEMO_QUESTIONS.find(q => q.chapterId === chapter.id) || DEMO_QUESTIONS[0];

  if (isFinished) {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs animate-in zoom-in-95">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 m-0">
          Revision Sprint Completed!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto m-0">
          You conquered 15 targeted minutes on <strong className="text-emerald-700">{chapter.name}</strong>. Your chapter readiness revision dimension has been updated to Strong.
        </p>

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={onExit}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Active 15-Minute Sprint
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 m-0">
            {chapter.name} ({chapter.subjectId.toUpperCase()})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono text-sm font-bold text-amber-700">
            <Clock size={15} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          <button
            onClick={onExit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="grid grid-cols-3 gap-2">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border text-center transition-all ${
              idx === currentPhaseIndex
                ? 'bg-purple-50/80 border-purple-300 text-purple-900 ring-2 ring-purple-100 shadow-xs'
                : idx < currentPhaseIndex
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-bold">
              {idx < currentPhaseIndex ? 'Done' : idx === currentPhaseIndex ? 'In Progress' : 'Upcoming'}
            </div>
            <div className="text-xs font-bold mt-0.5 truncate">{p.title.split(':')[0]}</div>
          </div>
        ))}
      </div>

      {/* Active Phase Content */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 m-0">
            <Sparkles size={16} className="text-purple-600" />
            {currentPhase.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 m-0">{currentPhase.description}</p>
        </div>

        {/* Phase 1 Content: Concepts */}
        {currentPhaseIndex === 0 && (
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-mono text-blue-700 font-bold block mb-1.5">
                Core NCERT Principles to Cement:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {chapter.coreConcepts.map((concept, i) => (
                  <li key={i} className="leading-relaxed">{concept}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900">
              💡 <strong>Board Memory Check:</strong> Close your eyes and recite the core definition or formula before moving to the question phase.
            </div>
          </div>
        )}

        {/* Phase 2 Content: Question Drill */}
        {currentPhaseIndex === 1 && (
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {targetQ.type.toUpperCase()} • {targetQ.marks} Marks
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">Concept: {targetQ.conceptTested}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {targetQ.questionText}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
              <strong className="text-emerald-700 block font-sans">CBSE Step Focus:</strong>
              <p className="text-slate-700 m-0 font-mono text-[11px] whitespace-pre-line">
                {targetQ.markingPoints.map(m => `• ${m.step} (+${m.marks}m)`).join('\n')}
              </p>
            </div>
          </div>
        )}

        {/* Phase 3 Content: Mistake Review */}
        {currentPhaseIndex === 2 && (
          <div className="space-y-3">
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 font-mono">
                <AlertTriangle size={14} className="text-rose-600" /> Evaluator Pitfall Checklist:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {chapter.cbseWatchouts.map((watchout, i) => (
                  <li key={i} className="leading-relaxed">{watchout}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
              Common mistake in this topic: <span className="text-amber-800 font-bold">{targetQ.commonMistake}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500 font-mono font-semibold">
          Phase {currentPhaseIndex + 1} of 3
        </span>

        <button
          onClick={handleManualNextPhase}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <span>{currentPhaseIndex === 2 ? 'Complete Sprint' : 'Next Phase'}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
