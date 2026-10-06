import React, { useState } from 'react';
import { MistakeCategory, MistakeEntry, Question, SubjectId } from '../../types';
import { mistakeEngine } from '../../services/mistakeEngine';
import { DEMO_QUESTIONS } from '../../data/questionsData';
import { ClarityModeModal } from '../clarity/ClarityModeModal';
import { LogMistakeModal } from './LogMistakeModal';
import { EmptyState } from '../common/EmptyState';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  TrendingDown, 
  Plus, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';

interface MistakeBookViewProps {
  mistakes: MistakeEntry[];
  enrolledSubjects?: SubjectId[];
  onResolveMistake: (id: string) => void;
  onSaveMistake: (mistake: any) => void;
}

const CATEGORIES: MistakeCategory[] = [
  'Concept',
  'Misread question',
  'Wrong method',
  'Calculation',
  'Missing unit',
  'Incomplete answer',
  'Poor answer structure',
  'Time issue'
];

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  enrolledSubjects,
  onResolveMistake,
  onSaveMistake
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MistakeCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');

  const relevantMistakes = enrolledSubjects
    ? mistakes.filter(m => enrolledSubjects.includes(m.subjectId))
    : mistakes;

  // Modal triggers
  const [clarityQuestion, setClarityQuestion] = useState<Question | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const analysis = mistakeEngine.analyzePatterns(
    relevantMistakes,
    subjectFilter === 'all' ? undefined : subjectFilter
  );

  const filteredMistakes = relevantMistakes.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'unresolved' 
      ? !m.resolved 
      : m.resolved;
    const matchesSubject = subjectFilter === 'all' || m.subjectId === subjectFilter;
    return matchesCat && matchesStatus && matchesSubject;
  });

  const handleLaunchClarity = (questionId: string) => {
    const q = DEMO_QUESTIONS.find(item => item.id === questionId) || DEMO_QUESTIONS[0];
    setClarityQuestion(q);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header and Summary Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                <AlertTriangle size={12} /> Systematic Error Tracker
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Class 10 Board Alignment
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              Student Mistake Book & Error Patterns
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed m-0">
              Exam clarity is built by neutralizing repeatable execution habits. Unpack why you lost marks: concept confusion, misread constraints, or missing units.
            </p>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Log a Mistake</span>
          </button>
        </div>

        {/* Primary Pitfall Callout */}
        {analysis.primaryPitfall && (
          <div className="mt-5 p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 font-mono">
                <ShieldAlert size={15} className="text-rose-600" /> Repeated Mistake Pattern Detected:
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                {analysis.primaryPitfall.count} Occurrences ({analysis.primaryPitfall.percentage}% of all errors)
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed m-0">
              <strong className="text-rose-950 font-bold">"{analysis.primaryPitfall.category}"</strong>: {analysis.primaryPitfall.cbseImpactDescription}
            </p>
            <p className="text-xs text-amber-800 font-semibold m-0 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60">
              Remedy: {analysis.primaryPitfall.recommendedFix}
            </p>
          </div>
        )}
      </div>

      {/* Mistake Pattern Bar Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
            <TrendingDown size={14} className="text-rose-600" />
            Distribution Across 8 CBSE Error Categories
          </h3>
          <span className="text-[11px] text-slate-500 font-mono font-semibold">
            {analysis.totalMistakes} Recorded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(category => {
            const pat = analysis.patterns.find(p => p.category === category);
            const count = pat?.count || 0;
            const pct = pat?.percentage || 0;
            const isTop = pat && pat.category === analysis.primaryPitfall?.category && count > 0;

            return (
              <div
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedCategory === category
                    ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-100 shadow-xs'
                    : isTop
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className={`font-bold ${isTop ? 'text-rose-900' : 'text-slate-800'}`}>
                    {category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {count}
                  </span>
                </div>

                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isTop ? 'bg-rose-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                  <span>{pct}% share</span>
                  <span className="text-slate-600 font-semibold">{selectedCategory === category ? 'Active' : 'Filter'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and List */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {(['all', 'unresolved', 'resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="social-science">Social Science</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-rose-600 hover:text-rose-700 underline font-mono font-bold"
          >
            Clear category filter ({selectedCategory})
          </button>
        )}
      </div>

      {/* Mistake Entries List */}
      {filteredMistakes.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No mistakes recorded under this filter"
          description="Great job! Keep practicing and log any errors or missed marks so ExamPilot can detect your patterns."
          actionText="Log a Mistake"
          onAction={() => setIsLogModalOpen(true)}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredMistakes.map(entry => {
            const relatedQuestion = DEMO_QUESTIONS.find(q => q.id === entry.questionId);

            return (
              <div
                key={entry.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-3.5 ${
                  entry.resolved ? 'border-slate-200/60 opacity-80' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {entry.subjectId}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                      {entry.category}
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onResolveMistake(entry.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        entry.resolved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 size={13} className={entry.resolved ? 'text-emerald-600' : 'text-slate-500'} />
                      <span>{entry.resolved ? 'Resolved' : 'Mark as Fixed'}</span>
                    </button>

                    <button
                      onClick={() => handleLaunchClarity(entry.questionId)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Compass size={13} />
                      <span>Re-attempt in Clarity Mode</span>
                    </button>
                  </div>
                </div>

                {/* Reflection Notes */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                    Student Reflection:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed m-0 font-medium">
                    {entry.userNote || 'Error identified during board question solving'}
                  </p>
                  {entry.studentAnswer && (
                    <p className="text-xs font-mono text-rose-700 pt-1.5 border-t border-slate-200 m-0">
                      Drafted Answer: "{entry.studentAnswer}"
                    </p>
                  )}
                </div>

                {/* Question reference */}
                {relatedQuestion && (
                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span className="line-clamp-1">
                      Question: <span className="text-slate-700 font-medium">{relatedQuestion.questionText.slice(0, 80)}...</span>
                    </span>
                    <span className="font-mono text-amber-700 font-bold shrink-0 ml-2 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {relatedQuestion.marks} Marks
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Clarity Mode Modal for Re-attempting */}
      <ClarityModeModal
        question={clarityQuestion}
        isOpen={Boolean(clarityQuestion)}
        onClose={() => setClarityQuestion(null)}
        onLogMistake={() => {}}
      />

      {/* Manual Mistake Logger Modal */}
      <LogMistakeModal
        question={DEMO_QUESTIONS[0]}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSaveMistake={onSaveMistake}
      />
    </div>
  );
};
