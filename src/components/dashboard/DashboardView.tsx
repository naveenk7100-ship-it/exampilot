import React from 'react';
import { Chapter, MistakeEntry, SmartNextAction, StudentProfile, TestResultAnalysis } from '../../types';
import { ReadinessSummary } from '../../services/readinessEngine';
import { ReadinessOverviewCard } from './ReadinessOverviewCard';
import { RecommendedTasksCard } from './RecommendedTasksCard';
import { ChapterHealthGrid } from './ChapterHealthGrid';
import { RecentMistakesWidget } from './RecentMistakesWidget';
import { MockScoreCard } from './MockScoreCard';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  Target, 
  BookOpen, 
  AlertTriangle, 
  Timer, 
  Compass, 
  Award, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface DashboardViewProps {
  profile: StudentProfile;
  chapters: Chapter[];
  readinessSummary: ReadinessSummary;
  recommendedTasks: SmartNextAction[];
  highestImpactAction: SmartNextAction;
  mistakes: MistakeEntry[];
  lastTestResult?: TestResultAnalysis;
  onExecuteTask: (task: SmartNextAction) => void;
  onSelectChapter: (chapter: Chapter) => void;
  onOpenMistakeBook: () => void;
  onRemediateMistake: (mistake: MistakeEntry) => void;
  onLaunchSimulator: () => void;
  onNavigateToSubjects: () => void;
  onNavigateToPractice?: () => void;
  onNavigateToClarity?: () => void;
  onNavigateToRevision?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  chapters,
  readinessSummary,
  recommendedTasks,
  highestImpactAction,
  mistakes,
  lastTestResult,
  onExecuteTask,
  onSelectChapter,
  onOpenMistakeBook,
  onRemediateMistake,
  onLaunchSimulator,
  onNavigateToSubjects,
  onNavigateToPractice,
  onNavigateToClarity,
  onNavigateToRevision
}) => {
  const { report } = readinessSummary;

  const tierStyles = {
    'READY': {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      headlineBg: 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
    },
    'ALMOST READY': {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      headlineBg: 'bg-amber-50/50 border-amber-100 text-amber-900'
    },
    'NOT YET READY': {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle,
      headlineBg: 'bg-rose-50/50 border-rose-100 text-rose-900'
    }
  };

  const currentTier = tierStyles[report.tier] || tierStyles['ALMOST READY'];
  const TierIcon = currentTier.icon;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Row: Hero Card ("What should I study now?") & Overall Readiness Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dashboard Hero Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Soft background tint */}
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50/60 via-indigo-50/20 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/70 px-2.5 py-0.5 rounded-full font-mono">
                <Sparkles size={12} className="text-amber-500" /> AI Exam Clarity Engine
              </span>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                Daily Highest-Impact
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
                "What should I study now?"
              </h2>
              <p className="text-sm font-bold text-blue-700 mt-1 m-0">
                {highestImpactAction.title}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0 font-normal max-w-xl">
              {highestImpactAction.reason}
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1.5">
                <Target size={13} className="text-blue-600" />
                <span>Skill: <strong className="text-slate-900">{String(highestImpactAction.skillTested || 'Application').replace(/([A-Z])/g, ' $1')}</strong></span>
              </span>

              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1.5">
                <Clock size={13} className="text-amber-600" />
                <span>~{highestImpactAction.estimatedMinutes} mins</span>
              </span>

              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1.5">
                <HelpCircle size={13} className="text-emerald-600" />
                <span>{highestImpactAction.questionCount} Questions</span>
              </span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Rule: Target the exact mark-leakage barrier instead of blind notes revision.
            </span>

            <button
              onClick={() => onExecuteTask(highestImpactAction)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 group shrink-0 ml-auto sm:ml-0"
            >
              <span>Start Now</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Overall Exam Readiness Card (5 cols) */}
        <div className="lg:col-span-5">
          <ReadinessOverviewCard
            summary={readinessSummary}
            onExploreChapters={onNavigateToSubjects}
          />
        </div>
      </div>

      {/* Main Dashboard 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <div className="h-full flex flex-col">
          <RecommendedTasksCard
            tasks={recommendedTasks}
            onExecuteTask={onExecuteTask}
          />
        </div>

        <div className="h-full flex flex-col">
          <ChapterHealthGrid
            chapters={chapters}
            enrolledSubjects={profile.enrolledSubjects}
            onSelectChapter={onSelectChapter}
          />
        </div>

        <div className="h-full flex flex-col">
          <RecentMistakesWidget
            mistakes={mistakes}
            onOpenMistakeBook={onOpenMistakeBook}
            onRemediateMistake={onRemediateMistake}
          />
        </div>
      </div>

      {/* Lower Dashboard: Mock Performance, Readiness Diagnostic Report, and Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mock Exam Performance (4 cols) */}
        <div className="lg:col-span-4">
          <MockScoreCard
            lastResult={lastTestResult}
            onLaunchSimulator={onLaunchSimulator}
          />
        </div>

        {/* Exam Readiness Report (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-indigo-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
                  Exam Readiness Report
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold font-mono uppercase border flex items-center gap-1 ${currentTier.badge}`}>
                <TierIcon size={12} />
                {report.tier}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border ${currentTier.headlineBg}`}>
              <p className="text-xs font-bold leading-relaxed m-0">
                "{report.diagnosisHeadline}"
              </p>
            </div>

            {/* 3 Key Explanatory Reasons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Key Diagnostic Takeaways:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 m-0 pl-0 list-none">
                {report.reasons.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
            <Sparkles size={13} className="text-blue-500 shrink-0" />
            <span>{report.highestImpactImprovement}</span>
          </div>
        </div>

        {/* Quick Access Tiles (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
                Quick Access
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">4 Tools</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onNavigateToPractice}
                className="p-3 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 rounded-xl text-left transition-all group"
              >
                <BookOpen size={16} className="text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Practice</div>
                <div className="text-[10px] text-slate-500 font-mono">6 Formats</div>
              </button>

              <button
                onClick={onOpenMistakeBook}
                className="p-3 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/70 rounded-xl text-left transition-all group"
              >
                <AlertTriangle size={16} className="text-rose-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Mistakes</div>
                <div className="text-[10px] text-slate-500 font-mono">8 Pitfalls</div>
              </button>

              <button
                onClick={onNavigateToRevision}
                className="p-3 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/70 rounded-xl text-left transition-all group"
              >
                <Sparkles size={16} className="text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Revision</div>
                <div className="text-[10px] text-slate-500 font-mono">15m Sprints</div>
              </button>

              <button
                onClick={onLaunchSimulator}
                className="p-3 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/70 rounded-xl text-left transition-all group"
              >
                <Timer size={16} className="text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Simulator</div>
                <div className="text-[10px] text-slate-500 font-mono">Timed Tests</div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToClarity}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass size={14} className="text-blue-600" />
              <span>Explore Clarity Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
