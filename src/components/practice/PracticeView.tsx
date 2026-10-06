import React, { useState } from 'react';
import { Chapter, DifficultyLevel, MistakeCategory, MistakeEntry, Question, QuestionAttempt, QuestionType, SubjectId } from '../../types';
import { CBSE_SUBJECTS } from '../../data/subjectsData';
import { QuestionCard } from './QuestionCard';
import { ClarityModeModal } from '../clarity/ClarityModeModal';
import { LogMistakeModal } from '../mistakes/LogMistakeModal';
import { EmptyState } from '../common/EmptyState';
import { adaptiveQuestionEngine } from '../../services/adaptiveQuestionEngine';
import { HelpCircle, Search, Sparkles, Zap } from 'lucide-react';

interface PracticeViewProps {
  questions: Question[];
  chapters: Chapter[];
  attempts?: QuestionAttempt[];
  mistakes?: MistakeEntry[];
  enrolledSubjects?: SubjectId[];
  onSaveMistake: (mistake: MistakeEntry) => void;
  onRecordAttempt?: (attempt: QuestionAttempt) => void;
  initialSubjectFilter?: SubjectId;
  initialChapterFilter?: string;
  initialQuestionId?: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  questions,
  chapters,
  attempts = [],
  mistakes = [],
  enrolledSubjects,
  onSaveMistake,
  onRecordAttempt,
  initialSubjectFilter,
  initialChapterFilter,
  initialQuestionId
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(initialSubjectFilter || 'all');
  const [selectedChapter, setSelectedChapter] = useState<string | 'all'>(initialChapterFilter || 'all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [clarityModalQuestion, setClarityModalQuestion] = useState<Question | null>(() => {
    if (initialQuestionId) {
      return questions.find(q => q.id === initialQuestionId) || null;
    }
    return null;
  });
  const [mistakeModalQuestion, setMistakeModalQuestion] = useState<Question | null>(null);
  const [prefilledMistakeCategory, setPrefilledMistakeCategory] = useState<MistakeCategory | undefined>();

  // Compute adaptive recommendation for current subject filter
  const adaptiveRecommendation = React.useMemo(() => {
    return adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      questions,
      chapters,
      attempts,
      mistakes,
      selectedSubject === 'all' ? undefined : selectedSubject
    );
  }, [questions, chapters, attempts, mistakes, selectedSubject]);

  // Available chapters based on subject filter
  const availableChapters = selectedSubject === 'all'
    ? chapters
    : chapters.filter(c => c.subjectId === selectedSubject);

  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subjectId === selectedSubject;
    const matchesChapter = selectedChapter === 'all' || q.chapterId === selectedChapter;
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.conceptTested.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesChapter && matchesType && matchesDifficulty && matchesSearch;
  });

  const handleOpenMistakeModal = (q: Question, prefill?: MistakeCategory) => {
    setMistakeModalQuestion(q);
    setPrefilledMistakeCategory(prefill);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Adaptive Question Banner */}
      {adaptiveRecommendation && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-indigo-50/40 to-blue-50/60 border border-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300/80 px-2.5 py-0.5 rounded-full font-mono">
                <Sparkles size={11} className="text-amber-600" /> Real Exam Intelligence Engine
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Targeting: {adaptiveRecommendation.dimensionTested.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 m-0">
              {adaptiveRecommendation.suggestedAction}: {adaptiveRecommendation.chapter.name}
            </h3>
            <p className="text-xs text-slate-600 m-0 leading-relaxed font-normal">
              {adaptiveRecommendation.explanation}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedSubject(adaptiveRecommendation.question.subjectId);
              setSelectedChapter(adaptiveRecommendation.question.chapterId);
              setClarityModalQuestion(adaptiveRecommendation.question);
            }}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all self-start md:self-auto"
          >
            <Zap size={14} className="fill-current text-white" />
            <span>Solve in Clarity Mode</span>
          </button>
        </div>
      )}

      {/* Practice Header & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight m-0">
                CBSE High-Clarity Question Practice
              </h2>
            </div>
            <p className="text-xs text-slate-500 m-0">
              Filter by question format (MCQ, Assertion-Reason, Numerical, Case-based) and apply the 6 thinking steps.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            {filteredQuestions.length} Questions Available
          </span>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Subject Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={e => {
                setSelectedSubject(e.target.value as any);
                setSelectedChapter('all');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All Enrolled Subjects</option>
              {CBSE_SUBJECTS.filter(s => !enrolledSubjects || enrolledSubjects.includes(s.id)).map(s => (
                <option key={s.id} value={s.id}>{s.name.split(' (')[0]}</option>
              ))}
            </select>
          </div>

          {/* Chapter Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
              Chapter:
            </label>
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All Chapters</option>
              {availableChapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
              Question Type:
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors capitalize"
            >
              <option value="all">All 6 Types</option>
              <option value="mcq">MCQ (1m)</option>
              <option value="assertion-reason">Assertion / Reason (1m)</option>
              <option value="short-answer">Short Answer (2-3m)</option>
              <option value="long-answer">Long Answer (5m)</option>
              <option value="case-based">Case-Based (4m)</option>
              <option value="numerical">Numerical / Problem (3-4m)</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
              Difficulty:
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard (High-Order Thinking)</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by concept tested or keywords (e.g. speed, resistor, BPT, Napoleon)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions match these filters"
          description="Try broadening your subject, chapter, or question type filters to see more board questions."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedSubject('all');
            setSelectedChapter('all');
            setSelectedType('all');
            setSelectedDifficulty('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map(q => {
            const isRecommended = adaptiveRecommendation?.question.id === q.id;
            return (
              <QuestionCard
                key={q.id}
                question={q}
                onLaunchClarityMode={question => setClarityModalQuestion(question)}
                onLogMistake={(question, prefill) => handleOpenMistakeModal(question, prefill)}
                onRecordAttempt={onRecordAttempt}
                highlightAdaptive={isRecommended}
                adaptiveReason={isRecommended ? adaptiveRecommendation.explanation : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Exam Clarity Mode Modal */}
      <ClarityModeModal
        question={clarityModalQuestion}
        isOpen={Boolean(clarityModalQuestion)}
        onClose={() => setClarityModalQuestion(null)}
        onLogMistake={question => handleOpenMistakeModal(question)}
      />

      {/* Log Mistake Modal */}
      <LogMistakeModal
        question={mistakeModalQuestion}
        prefilledCategory={prefilledMistakeCategory}
        isOpen={Boolean(mistakeModalQuestion)}
        onClose={() => {
          setMistakeModalQuestion(null);
          setPrefilledMistakeCategory(undefined);
        }}
        onSaveMistake={onSaveMistake}
      />
    </div>
  );
};
