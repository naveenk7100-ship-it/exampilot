import React from 'react';
import { Chapter, ReadinessStatus } from '../../types';
import { Modal } from '../common/Modal';
import { readinessEngine } from '../../services/readinessEngine';
import { ReadinessDimensionBadge } from './ReadinessDimensionBadge';
import { AlertCircle, CheckCircle2, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

interface ChapterDetailModalProps {
  chapter: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDimension: (chapterId: string, dimensionKey: keyof Chapter['readiness'], newStatus: ReadinessStatus) => void;
  onPracticeChapter: (chapterId: string) => void;
  onRevisionSprint: (chapterId: string) => void;
}

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  chapter,
  isOpen,
  onClose,
  onUpdateDimension,
  onPracticeChapter,
  onRevisionSprint
}) => {
  if (!chapter) return null;

  const cycleStatus = (current: ReadinessStatus): ReadinessStatus => {
    if (current === 'strong') return 'needs-practice';
    if (current === 'needs-practice') return 'weak';
    return 'strong';
  };

  const dimensionsList: { key: keyof Chapter['readiness']; name: string; desc: string }[] = [
    { 
      key: 'conceptUnderstanding', 
      name: 'Concept Understanding', 
      desc: 'Clarity of core NCERT theorems, formulas, definitions, and causal mechanisms.' 
    },
    { 
      key: 'application', 
      name: 'Application in Scenarios', 
      desc: 'Ability to dissect unfamiliar situations, case-studies, and real-life problems.' 
    },
    { 
      key: 'questionSolving', 
      name: 'Question Solving Method', 
      desc: 'Choosing correct mathematical equations, ray diagrams, or logical arguments.' 
    },
    { 
      key: 'answerWriting', 
      name: 'CBSE Answer Writing Structure', 
      desc: 'Point-wise presentation, Given/To Prove layout, key terms, and final boxed units.' 
    },
    { 
      key: 'timeSpeed', 
      name: 'Time & Pacing', 
      desc: 'Solving within CBSE 1.5 minutes per mark limit without rushing panic.' 
    },
    { 
      key: 'revision', 
      name: 'Active Revision Status', 
      desc: 'Recent spaced repetition and mistake re-attempts.' 
    }
  ];

  const overallTier = readinessEngine.getChapterOverallTier(chapter);
  const badgeStyle = readinessEngine.getStatusBadgeStyle(overallTier);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={chapter.name}
      subtitle={`${chapter.subjectId.toUpperCase()} • Unit: ${chapter.unit} • CBSE Weightage: ~${chapter.cbseWeightageMarks} Marks`}
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border font-mono ${
                overallTier === 'strong' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                overallTier === 'needs-practice' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                Overall: {badgeStyle.label}
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">
                Weightage: {chapter.cbseWeightageMarks} Marks
              </span>
            </div>
            <p className="text-xs text-slate-600 m-0">
              Click any dimension below to toggle status based on your recent performance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onPracticeChapter(chapter.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <HelpCircle size={14} />
              <span>Practice</span>
            </button>
            <button
              onClick={() => {
                onRevisionSprint(chapter.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Sparkles size={14} />
              <span>15m Sprint</span>
            </button>
          </div>
        </div>

        {/* 6 Dimensions Tracking Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
            <BookOpen size={14} className="text-blue-600" />
            6-Dimension Exam Readiness Tracker
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dimensionsList.map(dim => {
              const currentStatus = chapter.readiness[dim.key];
              return (
                <div
                  key={dim.key}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-between gap-2 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        {dim.name}
                      </span>
                      <ReadinessDimensionBadge
                        dimensionName={dim.name}
                        status={currentStatus}
                        showLabel={false}
                        onCycleStatus={() => onUpdateDimension(chapter.id, dim.key, cycleStatus(currentStatus))}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug m-0">
                      {dim.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Concepts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            Core High-Yield Concepts
          </h4>
          <div className="flex flex-wrap gap-2">
            {chapter.coreConcepts.map((concept, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 font-medium"
              >
                <CheckCircle2 size={12} className="text-blue-600" /> {concept}
              </span>
            ))}
          </div>
        </div>

        {/* CBSE Examiner Watchouts */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
          <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5 font-mono">
            <AlertCircle size={14} className="text-amber-600" />
            CBSE Evaluator Watchouts & Common Pitfalls
          </h4>
          <ul className="space-y-1.5 text-xs text-amber-900/90 list-disc list-inside m-0">
            {chapter.cbseWatchouts.map((watchout, i) => (
              <li key={i} className="leading-relaxed">
                {watchout}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};
