import React, { useState } from 'react';
import { Chapter, ReadinessStatus, SubjectId } from '../../types';
import { CBSE_SUBJECTS } from '../../data/subjectsData';
import { readinessEngine } from '../../services/readinessEngine';
import { ChapterDetailModal } from './ChapterDetailModal';
import { ReadinessDimensionBadge } from './ReadinessDimensionBadge';
import { 
  Calculator, 
  FlaskConical, 
  Globe2, 
  BookA, 
  Languages, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SubjectsViewProps {
  chapters: Chapter[];
  enrolledSubjects?: SubjectId[];
  onUpdateChapterDimension: (chapterId: string, dimensionKey: keyof Chapter['readiness'], newStatus: ReadinessStatus) => void;
  onPracticeChapter: (chapterId: string) => void;
  onRevisionSprint: (chapterId: string) => void;
  initialSubjectId?: SubjectId;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  chapters,
  enrolledSubjects,
  onUpdateChapterDimension,
  onPracticeChapter,
  onRevisionSprint,
  initialSubjectId = 'mathematics'
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(initialSubjectId);
  const [activeChapterForModal, setActiveChapterForModal] = useState<Chapter | null>(null);

  const currentSubject = CBSE_SUBJECTS.find(s => s.id === selectedSubjectId) || CBSE_SUBJECTS[0];
  const subjectChapters = chapters.filter(c => c.subjectId === selectedSubjectId);
  const subjectReadiness = readinessEngine.analyzeReadiness(chapters, [], [], [], selectedSubjectId);

  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'mathematics': return <Calculator size={17} />;
      case 'science': return <FlaskConical size={17} />;
      case 'social-science': return <Globe2 size={17} />;
      case 'english': return <BookA size={17} />;
      case 'hindi': return <Languages size={17} />;
    }
  };

  const cycleStatus = (current: ReadinessStatus): ReadinessStatus => {
    if (current === 'strong') return 'needs-practice';
    if (current === 'needs-practice') return 'weak';
    return 'strong';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CBSE_SUBJECTS.map(subject => {
          const isSelected = subject.id === selectedSubjectId;
          const isEnrolled = !enrolledSubjects || enrolledSubjects.includes(subject.id);
          const count = chapters.filter(c => c.subjectId === subject.id).length;
          return (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{getSubjectIcon(subject.id)}</span>
              <span>{subject.name.split(' (')[0]}</span>
              {isEnrolled && (
                <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  Enrolled
                </span>
              )}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                CBSE Code: {currentSubject.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Annual Board Paper: {currentSubject.totalMarks} Marks
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
              {currentSubject.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed m-0">
              {currentSubject.description}
            </p>
          </div>

          {/* Quick Subject Readiness Stats */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div className="text-center px-3">
              <div className="text-sm font-extrabold text-emerald-600 font-mono">
                {subjectReadiness.strongChapters.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Strong</div>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-sm font-extrabold text-amber-600 font-mono">
                {subjectReadiness.needsPracticeChapters.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Practice</div>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center px-3">
              <div className="text-sm font-extrabold text-rose-600 font-mono">
                {subjectReadiness.weakChapters.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Weak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Detailed List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight m-0">
            Chapter Readiness Matrix ({subjectChapters.length} Chapters)
          </h3>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any facet badge to toggle status directly
          </span>
        </div>

        {subjectChapters.map((chapter, index) => {
          const overallTier = readinessEngine.getChapterOverallTier(chapter);
          const score = readinessEngine.calculateChapterScore(chapter);

          let tierBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          let tierLabel = 'Strong';
          if (overallTier === 'weak') {
            tierBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            tierLabel = 'Weak';
          } else if (overallTier === 'needs-practice') {
            tierBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
            tierLabel = 'Needs Practice';
          }

          return (
            <div
              key={chapter.id}
              className="bg-white border border-slate-200/80 hover:border-blue-200/80 rounded-2xl p-5 shadow-sm transition-all space-y-4"
            >
              {/* Chapter Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Ch {index + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Unit: {chapter.unit}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-mono text-slate-700 font-bold">
                      ~{chapter.cbseWeightageMarks} Marks
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900 m-0">
                      {chapter.name}
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border font-mono uppercase ${tierBadgeClass}`}>
                      {tierLabel} ({score}%)
                    </span>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setActiveChapterForModal(chapter)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Inspect Details
                  </button>
                  <button
                    onClick={() => onPracticeChapter(chapter.id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Practice</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => onRevisionSprint(chapter.id)}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
                    title="15-Min Quick Revision"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>

              {/* 6 Dimensions Tracked Separately */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  6-Dimension Clarity Breakdown:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <ReadinessDimensionBadge
                    dimensionName="Concept"
                    status={chapter.readiness.conceptUnderstanding}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'conceptUnderstanding', cycleStatus(chapter.readiness.conceptUnderstanding))}
                  />
                  <ReadinessDimensionBadge
                    dimensionName="Application"
                    status={chapter.readiness.application}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'application', cycleStatus(chapter.readiness.application))}
                  />
                  <ReadinessDimensionBadge
                    dimensionName="Solving"
                    status={chapter.readiness.questionSolving}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'questionSolving', cycleStatus(chapter.readiness.questionSolving))}
                  />
                  <ReadinessDimensionBadge
                    dimensionName="Writing"
                    status={chapter.readiness.answerWriting}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'answerWriting', cycleStatus(chapter.readiness.answerWriting))}
                  />
                  <ReadinessDimensionBadge
                    dimensionName="Time/Speed"
                    status={chapter.readiness.timeSpeed}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'timeSpeed', cycleStatus(chapter.readiness.timeSpeed))}
                  />
                  <ReadinessDimensionBadge
                    dimensionName="Revision"
                    status={chapter.readiness.revision}
                    onCycleStatus={() => onUpdateChapterDimension(chapter.id, 'revision', cycleStatus(chapter.readiness.revision))}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapter Detail Inspect Modal */}
      <ChapterDetailModal
        chapter={activeChapterForModal}
        isOpen={Boolean(activeChapterForModal)}
        onClose={() => setActiveChapterForModal(null)}
        onUpdateDimension={onUpdateChapterDimension}
        onPracticeChapter={onPracticeChapter}
        onRevisionSprint={onRevisionSprint}
      />
    </div>
  );
};
