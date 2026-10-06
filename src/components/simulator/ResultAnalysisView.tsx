import React, { useEffect } from 'react';
import { SmartNextAction, TestResultAnalysis } from '../../types';
import { DEMO_QUESTIONS } from '../../data/questionsData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface ResultAnalysisViewProps {
  result: TestResultAnalysis;
  onRetake: () => void;
  onExecuteRecommendedTask: (task: SmartNextAction) => void;
}

export const ResultAnalysisView: React.FC<ResultAnalysisViewProps> = ({
  result,
  onRetake,
  onExecuteRecommendedTask
}) => {
  useEffect(() => {
    if (result.percentage >= 75) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore in non-browser or mock
      }
    }
  }, [result.percentage]);

  const totalMin = Math.round(result.totalTimeSeconds / 60);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Score */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award size={13} /> Evaluation Completed
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {result.subjectId.toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              {result.examTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed m-0">
              CBSE performance breakdown with step-scoring diagnostic and high-leverage remedy tasks.
            </p>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 self-start lg:self-auto shrink-0 shadow-xs">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono leading-none">
                {result.totalScore}
                <span className="text-base text-slate-400 font-normal">/{result.maxScore}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase mt-1 block font-semibold">Marks Awarded</span>
            </div>

            <div className="w-px h-12 bg-slate-200" />

            <div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono leading-none ${
                result.percentage >= 75 ? 'text-emerald-600' : result.percentage >= 50 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {result.percentage}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase mt-1 block font-semibold">Score Rate</span>
            </div>
          </div>
        </div>

        {/* 4 Metric Badges: Accuracy, Time Efficiency, Time Spent, Weak Concepts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
              Accuracy Rate
            </span>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {result.accuracy}%
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
              Pacing / Time Efficiency
            </span>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <Zap size={15} className="text-amber-500" />
              <span>{result.timeEfficiency}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
              Time Consumed
            </span>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {totalMin} mins
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
              Concepts to Fortify
            </span>
            <div className="text-lg font-extrabold text-rose-600 font-mono">
              {result.weakConcepts.length} Topics
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Row: Question Types & Repeated Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Types Causing Mistakes */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">
              Question Types Causing Mark Loss
            </h3>
          </div>

          {result.questionTypesCausingMistakes.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600" /> Zero format-specific mistakes! Full credit achieved across question types.
            </div>
          ) : (
            <div className="space-y-2">
              {result.questionTypesCausingMistakes.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 capitalize">
                    {item.type.replace('-', ' ')}
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {item.wrongCount} mark deduction{item.wrongCount > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repeated Mistake Categories */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">
              Repeated Error Categories Detected
            </h3>
          </div>

          {result.repeatedMistakeCategories.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600" /> No systematic execution habits triggered during this test.
            </div>
          ) : (
            <div className="space-y-2">
              {result.repeatedMistakeCategories.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {item.count} instance{item.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Next 3 Tasks */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight m-0">
              Recommended Next 3 Tasks (Calculated from Diagnostic)
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
            Post-Mock Strategy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {result.recommendedNextTasks.map((task, idx) => (
            <div
              key={task.id || idx}
              className="p-4 bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl flex flex-col justify-between gap-3.5 group transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500">Task 0{idx + 1}</span>
                  <span className="font-mono text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ~{task.estimatedMinutes}m
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors m-0">
                  {task.title}
                </h4>

                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 m-0">
                  {task.reason}
                </p>
              </div>

              <button
                onClick={() => onExecuteRecommendedTask(task)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Launch Task</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight m-0 font-mono">
          Question-by-Question Step Review
        </h3>

        <div className="space-y-3.5">
          {result.questionBreakdown.map((item, idx) => {
            const q = DEMO_QUESTIONS.find(question => question.id === item.questionId);
            if (!q) return null;

            return (
              <div
                key={item.questionId}
                className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-500">
                      Q{idx + 1}.
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {q.conceptTested}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                      {q.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    {item.isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Full Marks: +{item.marksObtained}/{item.maxMarks}
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 font-bold flex items-center gap-1">
                        <XCircle size={14} /> Partial / Lost: {item.marksObtained}/{item.maxMarks}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed m-0 font-sans">
                  {q.questionText}
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
                  <strong className="text-emerald-700 block mb-1 font-sans">CBSE Model Expected Solution:</strong>
                  {q.expectedAnswer}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retake Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <RotateCcw size={15} />
          <span>Return to Exam Simulator</span>
        </button>
      </div>
    </div>
  );
};
