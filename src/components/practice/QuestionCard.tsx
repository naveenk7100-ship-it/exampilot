import React, { useState } from 'react';
import { Question, QuestionAttempt, MistakeCategory } from '../../types';
import { aiEvaluatorService, SubjectiveEvaluationResult } from '../../services/aiEvaluatorService';
import { mistakeEngine } from '../../services/mistakeEngine';
import { 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  Send,
  Lightbulb,
  Split,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onLaunchClarityMode: (question: Question) => void;
  onLogMistake: (question: Question, prefilledCategory?: MistakeCategory) => void;
  onRecordAttempt?: (attempt: QuestionAttempt) => void;
  highlightAdaptive?: boolean;
  adaptiveReason?: string;
}

function buildAttemptRecord(
  question: Question,
  isCorrect: boolean,
  scoreAchieved: number,
  startTime: number,
  hintsUsedCount: number,
  options?: {
    selectedOption?: number;
    studentWrittenAnswer?: string;
    mistakeCategory?: MistakeCategory;
  }
): QuestionAttempt {
  const now = Date.now();
  const timeSpent = Math.max(5, Math.round((now - startTime) / 1000));
  return {
    id: `att-${now}-${Math.random().toString(36).substr(2, 6)}`,
    questionId: question.id,
    subjectId: question.subjectId,
    chapterId: question.chapterId,
    topic: question.topic,
    questionType: question.type,
    difficulty: question.difficulty,
    isCorrect,
    scoreAchieved,
    maxScore: question.marks,
    timeSpentSeconds: timeSpent,
    expectedTimeSeconds: question.estimatedSolvingTime,
    hintsUsedCount,
    selectedOption: options?.selectedOption,
    studentWrittenAnswer: options?.studentWrittenAnswer,
    mistakeCategory: options?.mistakeCategory,
    timestamp: now
  };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onLaunchClarityMode,
  onLogMistake,
  onRecordAttempt,
  highlightAdaptive,
  adaptiveReason
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isOptionSubmitted, setIsOptionSubmitted] = useState(false);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isEvaluatingWritten, setIsEvaluatingWritten] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SubjectiveEvaluationResult | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showDeconstruction, setShowDeconstruction] = useState(false);
  const [activeDeconstructTab, setActiveDeconstructTab] = useState<'testing' | 'data' | 'concept-method' | 'traps-presentation'>('testing');

  // Progressive Hint States (Hints 1 to 4)
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [startTime] = useState<number>(() => 0);

  // Auto-detected mistake banner state
  const [detectedMistake, setDetectedMistake] = useState<MistakeCategory | null>(null);

  const isMcqOrAR = ['mcq', 'assertion-reason'].includes(question.type) && Boolean(question.options);

  const handleUnlockNextHint = () => {
    if (unlockedHintLevel < 4) {
      setUnlockedHintLevel(prev => prev + 1);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isOptionSubmitted) return;
    setSelectedOption(idx);
    setIsOptionSubmitted(true);
    
    const isCorrect = idx === question.correctOptionIndex;
    const scoreAchieved = isCorrect ? question.marks : 0;

    let mistakeCat: MistakeCategory | undefined;
    if (!isCorrect) {
      mistakeCat = mistakeEngine.autoClassifyMistake(question, '', true, idx, 60);
      setDetectedMistake(mistakeCat);
    }

    if (onRecordAttempt) {
      const attempt = buildAttemptRecord(
        question,
        isCorrect,
        scoreAchieved,
        startTime,
        unlockedHintLevel,
        { selectedOption: idx, mistakeCategory: mistakeCat }
      );
      onRecordAttempt(attempt);
    }
  };

  const handleEvaluateWritten = async () => {
    if (!writtenAnswer.trim()) return;
    setIsEvaluatingWritten(true);

    try {
      const res = await aiEvaluatorService.evaluateWrittenAnswer(question, writtenAnswer);
      setEvaluationResult(res);

      const isCorrect = res.marksEarned >= (question.marks * 0.75);

      if (res.identifiedMistakeCategory) {
        setDetectedMistake(res.identifiedMistakeCategory);
      }

      if (onRecordAttempt) {
        const attempt = buildAttemptRecord(
          question,
          isCorrect,
          res.marksEarned,
          startTime,
          unlockedHintLevel,
          { studentWrittenAnswer: writtenAnswer, mistakeCategory: res.identifiedMistakeCategory }
        );
        onRecordAttempt(attempt);
      }
    } finally {
      setIsEvaluatingWritten(false);
    }
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-all ${
      highlightAdaptive ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200/80 hover:border-slate-300'
    }`}>
      {/* Adaptive Recommendation Badge */}
      {highlightAdaptive && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-extrabold text-amber-800 font-mono uppercase text-[10px] block">
              Smart Adaptive Recommendation
            </span>
            <p className="text-amber-900 m-0 leading-relaxed font-medium">
              {adaptiveReason || 'Selected dynamically based on your latest performance and error patterns.'}
            </p>
          </div>
        </div>
      )}

      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {question.type.replace('-', ' ')}
          </span>
          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-slate-700">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-900 font-extrabold">
            {question.marks} Mark{question.marks > 1 ? 's' : ''}
          </span>
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Clock size={12} />
            <span>~{Math.round(question.estimatedSolvingTime / 60)} min</span>
          </span>
        </div>
      </div>

      {/* Concept Tested Indicator */}
      <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
        <span className="text-blue-700 font-extrabold font-mono uppercase text-[10px]">Concept Tested:</span>
        <span className="text-slate-800 font-semibold">{question.conceptTested}</span>
      </div>

      {/* Case Context if Present */}
      {question.caseContext && (
        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium">
          <span className="font-extrabold text-indigo-700 font-mono uppercase text-[10px] block mb-1">
            Case Study Context:
          </span>
          {question.caseContext}
        </div>
      )}

      {/* Question Body */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
        <p className="text-xs sm:text-sm text-slate-900 font-medium whitespace-pre-line leading-relaxed m-0">
          {question.questionText}
        </p>
      </div>

      {/* Interactive Attempt Section */}
      {isMcqOrAR ? (
        // Options List for MCQ & Assertion-Reason
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-700 block mb-1">
            Select an option:
          </span>
          {question.options?.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctOptionIndex;
            let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50';

            if (isOptionSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400';
              }
            } else if (isSelected) {
              btnStyle = 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-300';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${btnStyle}`}
              >
                <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-mono text-[11px] font-bold ${
                  isOptionSubmitted && isCorrect
                    ? 'bg-emerald-600 text-white'
                    : isOptionSubmitted && isSelected && !isCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      ) : (
        // Written input for Short / Long / Case / Numerical
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Draft your answer (step-by-step or key points):
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Deterministic Rubric + AI Evaluation
            </span>
          </div>

          <textarea
            value={writtenAnswer}
            onChange={e => setWrittenAnswer(e.target.value)}
            placeholder="Type your structured solution, formula used, intermediate steps, and boxed final value..."
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-mono"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleEvaluateWritten}
              disabled={!writtenAnswer.trim() || isEvaluatingWritten}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Send size={13} />
              <span>{isEvaluatingWritten ? 'Evaluating...' : 'Evaluate Written Answer (Rubric Marking)'}</span>
            </button>

            {writtenAnswer && (
              <button
                onClick={() => {
                  setWrittenAnswer('');
                  setEvaluationResult(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Written Evaluation Result Box */}
          {evaluationResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <FileCheck size={16} className="text-blue-600" />
                  <span className="font-extrabold text-slate-900">
                    Marks Earned: {evaluationResult.marksEarned} / {evaluationResult.maxMarks}
                  </span>
                </div>
                <span className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  evaluationResult.percentage >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {evaluationResult.percentage}% Match
                </span>
              </div>

              <p className="text-slate-800 leading-relaxed m-0 font-medium">
                {evaluationResult.examinerFeedback}
              </p>

              {/* Missing Marking Points */}
              {evaluationResult.missingMarkingPoints.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-800">
                  <span className="font-bold text-[10px] uppercase font-mono block">Missing Marking Points:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] m-0">
                    {evaluationResult.missingMarkingPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Improve */}
              {evaluationResult.howToImprove.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-800">
                  <span className="font-bold text-[10px] uppercase font-mono block">How to Improve:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] m-0">
                    {evaluationResult.howToImprove.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quality Badges */}
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
                  evaluationResult.structureAssessment.rating === 'Optimal'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  Structure: {evaluationResult.structureAssessment.rating}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
                  evaluationResult.unitCheck.present
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  Unit Status: {evaluationResult.unitCheck.present ? 'Valid SI Units' : 'Unit Penalty Detected'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auto-detected Mistake Quick Prompt */}
      {detectedMistake && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-800">
            <ShieldAlert size={16} className="text-rose-600 shrink-0" />
            <span>
              Auto-detected issue: <strong className="text-slate-900 font-mono uppercase">{detectedMistake}</strong>
            </span>
          </div>
          <button
            onClick={() => onLogMistake(question, detectedMistake)}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
          >
            Log to Mistake Book
          </button>
        </div>
      )}

      {/* Progressive Hints Section */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <span className="text-xs font-extrabold text-slate-900">
              Progressive Hints ({unlockedHintLevel}/4 Unlocked)
            </span>
          </div>

          {unlockedHintLevel < 4 ? (
            <button
              onClick={handleUnlockNextHint}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Unlock Hint {unlockedHintLevel + 1}</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              All 4 Hints Revealed
            </span>
          )}
        </div>

        {unlockedHintLevel === 0 && (
          <p className="text-[11px] text-slate-500 italic m-0">
            Never look at the solution immediately. Unlock progressive hints step-by-step to test your own thinking.
          </p>
        )}

        {unlockedHintLevel >= 1 && (
          <div className="space-y-2 pt-1 border-t border-slate-200/70">
            {unlockedHintLevel >= 1 && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                <span className="font-mono font-bold text-amber-700 text-[10px] uppercase block">
                  Hint 1: What is the question asking?
                </span>
                <p className="text-slate-800 m-0 font-medium">{question.progressiveHints.hint1Asking}</p>
              </div>
            )}

            {unlockedHintLevel >= 2 && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                <span className="font-mono font-bold text-amber-700 text-[10px] uppercase block">
                  Hint 2: Identify relevant concept
                </span>
                <p className="text-slate-800 m-0 font-medium">{question.progressiveHints.hint2Concept}</p>
              </div>
            )}

            {unlockedHintLevel >= 3 && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                <span className="font-mono font-bold text-amber-700 text-[10px] uppercase block">
                  Hint 3: Formula / Method
                </span>
                <p className="text-slate-800 m-0 font-mono text-[11px] text-blue-700 font-semibold">{question.progressiveHints.hint3MethodFormula}</p>
              </div>
            )}

            {unlockedHintLevel >= 4 && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                <span className="font-mono font-bold text-amber-700 text-[10px] uppercase block">
                  Hint 4: Next Solving Step
                </span>
                <p className="text-slate-800 m-0 font-medium">{question.progressiveHints.hint4NextSolvingStep}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive 7-Part Question Deconstruction */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowDeconstruction(!showDeconstruction)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Split size={14} />
            <span>{showDeconstruction ? 'Hide Question Deconstruction' : 'Interactive Question Deconstruction (7 Parts)'}</span>
          </span>
          {showDeconstruction ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {showDeconstruction && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-indigo-100 space-y-3.5 text-xs animate-in fade-in">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200">
              <button
                onClick={() => setActiveDeconstructTab('testing')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  activeDeconstructTab === 'testing' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                1. Testing Goal
              </button>
              <button
                onClick={() => setActiveDeconstructTab('data')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  activeDeconstructTab === 'data' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                2. Data vs Distraction
              </button>
              <button
                onClick={() => setActiveDeconstructTab('concept-method')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  activeDeconstructTab === 'concept-method' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                3. Concept & Method
              </button>
              <button
                onClick={() => setActiveDeconstructTab('traps-presentation')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  activeDeconstructTab === 'traps-presentation' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                4. Traps & Final Answer
              </button>
            </div>

            {/* Tab Contents */}
            {activeDeconstructTab === 'testing' && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-indigo-700 font-bold block">
                  WHAT WAS THIS QUESTION TESTING?
                </span>
                <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 m-0 font-medium">
                  {question.deconstruction.whatQuestionIsTesting}
                </p>
              </div>
            )}

            {activeDeconstructTab === 'data' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
                    WHAT INFORMATION MATTERED:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-900 m-0">
                    {question.deconstruction.informationThatMattered.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase text-rose-800 font-bold block">
                    WHAT WAS DISTRACTION:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-900 m-0">
                    {question.deconstruction.informationThatWasDistraction.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeDeconstructTab === 'concept-method' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block mb-1">
                    WHAT CONCEPT SHOULD YOU HAVE RECOGNIZED?
                  </span>
                  <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 m-0 font-medium">
                    {question.deconstruction.conceptToRecognize}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block mb-1">
                    WHAT METHOD SHOULD YOU USE?
                  </span>
                  <p className="text-slate-800 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-blue-700 font-semibold m-0">
                    {question.deconstruction.methodToUse}
                  </p>
                </div>
              </div>
            )}

            {activeDeconstructTab === 'traps-presentation' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block mb-1">
                    WHAT WAS THE COMMON TRAP?
                  </span>
                  <p className="text-amber-900 text-[11px] m-0 font-medium">
                    {question.deconstruction.commonTrap}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-1">
                    HOW SHOULD THE FINAL ANSWER BE WRITTEN?
                  </span>
                  <p className="text-slate-800 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 m-0 font-medium">
                    {question.deconstruction.howFinalAnswerShouldBeWritten}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Model Answer & Marking Scheme Reveal Section */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowModelAnswer(!showModelAnswer)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-blue-600">
            <CheckCircle2 size={14} />
            <span>{showModelAnswer ? 'Hide CBSE Model Answer & Rubric' : 'View CBSE Model Answer & Step Marks'}</span>
          </span>
          {showModelAnswer ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {showModelAnswer && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs animate-in fade-in">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block mb-1">
                Official Expected Model Answer:
              </span>
              <p className="text-slate-800 font-mono whitespace-pre-line leading-relaxed m-0 bg-white p-3 rounded-lg border border-slate-200">
                {question.expectedAnswer}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1.5">
                CBSE Marking Breakdown:
              </span>
              <div className="space-y-1">
                {question.markingPoints.map((mp, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-700 font-medium">{mp.step}</span>
                    <span className="font-mono text-emerald-600 font-bold shrink-0">+{mp.marks}m</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <strong className="block text-[10px] uppercase font-mono mb-0.5">Common Board Mistake:</strong>
              <p className="text-[11px] m-0 text-rose-900 leading-snug">{question.commonMistake}</p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons: Clarity Mode & Mistake Log */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={() => onLaunchClarityMode(question)}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Compass size={15} />
          <span>Exam Clarity Mode (6 Thinking Steps)</span>
        </button>

        <button
          onClick={() => onLogMistake(question)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 hover:border-rose-200 border border-slate-200 rounded-xl text-xs font-bold transition-all"
        >
          <AlertTriangle size={14} className="text-rose-500" />
          <span>Log Mistake</span>
        </button>
      </div>
    </div>
  );
};
