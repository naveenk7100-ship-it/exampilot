import React, { useState } from 'react';
import { ExamSimulatorConfig, Question, QuestionAnswerStatus, SmartNextAction, SubjectId, TestResultAnalysis } from '../../types';
import { CBSE_MOCK_EXAMS } from '../../data/mockExamData';
import { DEMO_QUESTIONS } from '../../data/questionsData';
import { ExamTimer } from './ExamTimer';
import { ExamQuestionPalette } from './ExamQuestionPalette';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { ResultAnalysisView } from './ResultAnalysisView';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  ShieldCheck 
} from 'lucide-react';

interface ExamSimulatorViewProps {
  onSaveResult: (result: TestResultAnalysis) => void;
  onExecuteRecommendedTask: (task: SmartNextAction) => void;
  initialExamId?: string;
  enrolledSubjects?: SubjectId[];
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({
  onSaveResult,
  onExecuteRecommendedTask,
  initialExamId,
  enrolledSubjects
}) => {
  const [selectedExamConfig, setSelectedExamConfig] = useState<ExamSimulatorConfig | null>(() => {
    if (initialExamId) {
      return CBSE_MOCK_EXAMS.find(e => e.id === initialExamId) || null;
    }
    return null;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, { option?: number; text?: string }>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionAnswerStatus>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [completedResult, setCompletedResult] = useState<TestResultAnalysis | null>(null);

  // Flatten questions list for selected exam
  const examQuestions: Question[] = selectedExamConfig
    ? selectedExamConfig.sections.flatMap(sec =>
        sec.questionIds
          .map(qId => DEMO_QUESTIONS.find(q => q.id === qId))
          .filter((q): q is Question => Boolean(q))
      )
    : [];

  const currentQuestion = examQuestions[currentQuestionIndex];

  // Start exam session
  const handleStartExam = (config: ExamSimulatorConfig) => {
    setSelectedExamConfig(config);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionStatuses({ 0: 'not-answered' });
    setTimeSpentSeconds(0);
    setCompletedResult(null);
  };

  // Select question from palette
  const handleSelectQuestion = (idx: number) => {
    // If previous was not-visited, mark as not-answered
    if (!questionStatuses[idx]) {
      setQuestionStatuses(prev => ({ ...prev, [idx]: 'not-answered' }));
    }
    setCurrentQuestionIndex(idx);
  };

  // Handle MCQ option selection
  const handleOptionSelect = (optionIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { ...prev[currentQuestionIndex], option: optionIdx }
    }));
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestionIndex]: 'answered'
    }));
  };

  // Handle written response text
  const handleWrittenChange = (text: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { ...prev[currentQuestionIndex], text }
    }));
    if (text.trim().length > 0) {
      setQuestionStatuses(prev => ({
        ...prev,
        [currentQuestionIndex]: 'answered'
      }));
    }
  };

  // Mark for review & Next
  const handleMarkForReview = () => {
    const hasAnswer = userAnswers[currentQuestionIndex]?.option !== undefined ||
      Boolean(userAnswers[currentQuestionIndex]?.text?.trim());
    
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestionIndex]: hasAnswer ? 'answered-and-marked' : 'marked-for-review'
    }));

    if (currentQuestionIndex < examQuestions.length - 1) {
      handleSelectQuestion(currentQuestionIndex + 1);
    }
  };

  // Clear Response
  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestionIndex];
      return copy;
    });
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestionIndex]: 'not-answered'
    }));
  };

  // Next / Previous
  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      handleSelectQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      handleSelectQuestion(currentQuestionIndex - 1);
    }
  };

  // Calculate results on Submit
  const handleFinalSubmit = () => {
    if (!selectedExamConfig) return;

    let score = 0;
    const maxScore = selectedExamConfig.totalMarks;
    const weakConcepts: string[] = [];
    const questionTypesCausingMistakesMap: Record<string, number> = {};
    const repeatedMistakeMap: Record<string, number> = {};

    const breakdown = examQuestions.map((q, idx) => {
      const ans = userAnswers[idx];
      let marksObtained = 0;
      let isCorrect = false;

      if (['mcq', 'assertion-reason'].includes(q.type)) {
        if (ans?.option === q.correctOptionIndex) {
          marksObtained = q.marks;
          isCorrect = true;
        } else {
          weakConcepts.push(q.conceptTested);
          questionTypesCausingMistakesMap[q.type] = (questionTypesCausingMistakesMap[q.type] || 0) + 1;
          repeatedMistakeMap['Concept'] = (repeatedMistakeMap['Concept'] || 0) + 1;
        }
      } else {
        // Written answer heuristic scoring for simulation
        const text = ans?.text?.trim() || '';
        if (text.length > 30) {
          marksObtained = Math.max(1, Math.round(q.marks * 0.75));
          isCorrect = marksObtained >= q.marks * 0.8;
          if (!isCorrect) {
            weakConcepts.push(q.conceptTested);
            questionTypesCausingMistakesMap[q.type] = (questionTypesCausingMistakesMap[q.type] || 0) + 1;
            repeatedMistakeMap['Poor answer structure'] = (repeatedMistakeMap['Poor answer structure'] || 0) + 1;
          }
        } else if (text.length > 0) {
          marksObtained = Math.min(1, q.marks);
          weakConcepts.push(q.conceptTested);
          repeatedMistakeMap['Incomplete answer'] = (repeatedMistakeMap['Incomplete answer'] || 0) + 1;
        } else {
          weakConcepts.push(q.conceptTested);
          repeatedMistakeMap['Time issue'] = (repeatedMistakeMap['Time issue'] || 0) + 1;
        }
      }

      score += marksObtained;
      return {
        questionId: q.id,
        marksObtained,
        maxMarks: q.marks,
        isCorrect
      };
    });

    const percentage = Math.round((score / maxScore) * 100);
    const correctCount = breakdown.filter(b => b.isCorrect).length;
    const accuracy = Math.round((correctCount / examQuestions.length) * 100);

    const questionTypesCausingMistakes = Object.entries(questionTypesCausingMistakesMap).map(([type, wrongCount]) => ({
      type: type as any,
      wrongCount
    }));

    const repeatedMistakeCategories = Object.entries(repeatedMistakeMap).map(([cat, count]) => ({
      category: cat as any,
      count
    }));

    const result: TestResultAnalysis = {
      examTitle: selectedExamConfig.title,
      subjectId: selectedExamConfig.subjectId,
      totalScore: score,
      maxScore,
      percentage,
      accuracy,
      totalTimeSeconds: timeSpentSeconds || selectedExamConfig.durationMinutes * 60 * 0.6,
      expectedTimeSeconds: selectedExamConfig.durationMinutes * 60,
      timeEfficiency: timeSpentSeconds < selectedExamConfig.durationMinutes * 30 ? 'Hurried' : 'Optimal',
      weakConcepts: Array.from(new Set(weakConcepts)),
      questionTypesCausingMistakes,
      repeatedMistakeCategories,
      recommendedNextTasks: [
        {
          id: 'post-mock-1',
          title: `Reinforce ${weakConcepts[0] || 'Core Theory'}`,
          subjectId: selectedExamConfig.subjectId,
          chapterId: 'math-quadratic-equations',
          chapterName: 'Board Focus Area',
          skillTested: 'conceptUnderstanding',
          reason: 'Identified as a mark deduction during the simulated test. Solve 2 step-wise application questions.',
          actionType: 'clarity-practice',
          estimatedMinutes: 10,
          questionCount: 2,
          expectedOutcome: 'Zero ambiguity on core formulas and theorem applications.',
          priorityScore: 95
        },
        {
          id: 'post-mock-2',
          title: 'CBSE Answer Writing Polish',
          subjectId: selectedExamConfig.subjectId,
          chapterId: 'sci-electricity',
          chapterName: 'Formatting Sprint',
          skillTested: 'answerWriting',
          reason: 'Lacking intermediate step declarations. Structure with proper formulas and SI units.',
          actionType: 'answer-structure',
          estimatedMinutes: 12,
          questionCount: 2,
          expectedOutcome: 'Clear Given-Formula-Step-Answer progression with highlighted units.',
          priorityScore: 88
        },
        {
          id: 'post-mock-3',
          title: 'Timed Pacing Drill',
          subjectId: selectedExamConfig.subjectId,
          chapterId: 'math-triangles',
          chapterName: 'Geometry / Algebra',
          skillTested: 'timeSpeed',
          reason: 'Practice 4-mark numerical questions within the 6-minute target window.',
          actionType: 'speed-sprint',
          estimatedMinutes: 15,
          questionCount: 3,
          expectedOutcome: 'Complete 4-mark questions within 6 minutes under timed pressure.',
          priorityScore: 82
        }
      ],
      questionBreakdown: breakdown
    };

    onSaveResult(result);
    setCompletedResult(result);
    setIsSubmitModalOpen(false);
  };

  // If result is ready, show Result Analysis View!
  if (completedResult) {
    return (
      <ResultAnalysisView
        result={completedResult}
        onRetake={() => {
          setCompletedResult(null);
          setSelectedExamConfig(null);
        }}
        onExecuteRecommendedTask={onExecuteRecommendedTask}
      />
    );
  }

  // If no exam selected, show Simulator Menu
  if (!selectedExamConfig) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck size={12} /> Official CBSE Blueprint Pacing
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
              CBSE Class 10 Board Exam Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
              Step into an authentic timed board exam environment. Master sectional navigation, question status tracking, and time management without exam-day panic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CBSE_MOCK_EXAMS.filter(e => !enrolledSubjects || enrolledSubjects.includes(e.subjectId)).map(exam => (
            <div
              key={exam.id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-6 transition-all group hover:shadow-sm"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {exam.subjectId}
                  </span>
                  <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 font-bold">
                    <Timer size={13} /> {exam.durationMinutes} Minutes
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors m-0">
                  {exam.title}
                </h3>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Total Marks:</span>
                    <span className="font-mono text-slate-900 font-bold">{exam.totalMarks} Marks</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Sections:</span>
                    <span className="text-slate-700 font-medium">{exam.sections.map(s => s.title.split(' (')[0]).join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Questions:</span>
                    <span className="font-mono text-slate-900 font-semibold">{exam.sections.reduce((acc, s) => acc + s.questionIds.length, 0)} Questions</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 group-hover:scale-[1.01]"
              >
                <span>Enter Timed Simulator</span>
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Exam Simulator View
  const answeredCount = Object.values(questionStatuses).filter(s => s === 'answered' || s === 'answered-and-marked').length;
  const notAnsweredCount = examQuestions.length - answeredCount;
  const markedReviewCount = Object.values(questionStatuses).filter(s => s === 'marked-for-review' || s === 'answered-and-marked').length;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Exam Top Header */}
      <div className="bg-white/95 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs sticky top-16 z-20 backdrop-blur-md">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
            CBSE Timed Examination Simulator
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 m-0 line-clamp-1">
            {selectedExamConfig.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ExamTimer
            initialSeconds={selectedExamConfig.durationMinutes * 60}
            onTimeExpired={handleFinalSubmit}
            onTimeUpdate={secLeft => setTimeSpentSeconds(selectedExamConfig.durationMinutes * 60 - secLeft)}
          />

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit Paper
          </button>
        </div>
      </div>

      {/* Main Examination Grid: Left Question, Right Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Question Area (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Question Subhead */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-blue-600">
                Question {currentQuestionIndex + 1} of {examQuestions.length}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono capitalize">
                {currentQuestion.type.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span>Marks: +{currentQuestion.marks}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed m-0 font-sans">
              {currentQuestion.questionText}
            </p>
          </div>

          {/* Answer Input Area */}
          {['mcq', 'assertion-reason'].includes(currentQuestion.type) && currentQuestion.options ? (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Select your choice:
              </span>
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex]?.option === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-950 font-medium ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-mono text-[11px] font-bold ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Write your step-by-step solution according to CBSE marking criteria:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  State Given, Formulas & Boxed Units
                </span>
              </div>
              <textarea
                value={userAnswers[currentQuestionIndex]?.text || ''}
                onChange={e => handleWrittenChange(e.target.value)}
                placeholder="Type step 1 (Given parameters), step 2 (Governing theorem/formula), step 3 (Calculations), and final answer with units..."
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono shadow-xs"
              />
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Clear Response
              </button>
              <button
                onClick={handleMarkForReview}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Flag size={13} />
                <span>Mark for Review & Next</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette (1 col) */}
        <div className="lg:col-span-1">
          <ExamQuestionPalette
            totalQuestions={examQuestions.length}
            currentIndex={currentQuestionIndex}
            questionStatuses={questionStatuses}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        totalQuestions={examQuestions.length}
        answeredCount={answeredCount}
        notAnsweredCount={notAnsweredCount}
        markedReviewCount={markedReviewCount}
      />
    </div>
  );
};
