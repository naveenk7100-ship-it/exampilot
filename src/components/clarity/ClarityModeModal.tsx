import React, { useState } from 'react';
import { Question } from '../../types';
import { Modal } from '../common/Modal';
import { ThinkingStepCard } from './ThinkingStepCard';
import { ProgressBar } from '../common/ProgressBar';
import { Compass, AlertTriangle, CheckCircle } from 'lucide-react';

interface ClarityModeModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onLogMistake: (question: Question) => void;
}

export const ClarityModeModal: React.FC<ClarityModeModalProps> = ({
  question,
  isOpen,
  onClose,
  onLogMistake
}) => {
  // Unlocked step index (0 means Step 1 is unlocked, 1 means Step 2 is unlocked, etc.)
  const [highestUnlockedStep, setHighestUnlockedStep] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!question) return null;

  const stepsData = [
    {
      stepNumber: 1,
      title: 'What is the question asking?',
      questionPrompt: 'Isolate the core target variable, proof goal, or qualitative distinction without narrative noise.',
      modelContent: question.claritySteps.step1Asking
    },
    {
      stepNumber: 2,
      title: 'What information matters?',
      questionPrompt: 'Extract numerical values, units, sign conventions, and filter out distractors.',
      modelContent: question.claritySteps.step2DataMatters
    },
    {
      stepNumber: 3,
      title: 'What concept is being tested?',
      questionPrompt: 'Identify the exact governing law, principle, or definition from the CBSE curriculum.',
      modelContent: question.claritySteps.step3Concept
    },
    {
      stepNumber: 4,
      title: 'Which formula / rule / method applies?',
      questionPrompt: 'State the general algebraic relationship or formal proof structure before substituting numbers.',
      modelContent: question.claritySteps.step4Method
    },
    {
      stepNumber: 5,
      title: 'Solve step-by-step',
      questionPrompt: 'Derive the solution with intermediate calculations visible for step marks.',
      modelContent: question.claritySteps.step5Solving
    },
    {
      stepNumber: 6,
      title: 'How should the final answer be presented?',
      questionPrompt: 'Box the final value with units, use bullet points, and check against CBSE marking rubrics.',
      modelContent: question.claritySteps.step6Presentation
    }
  ];

  const handleStepCompleted = (stepNum: number) => {
    if (stepNum >= highestUnlockedStep && highestUnlockedStep < 6) {
      setHighestUnlockedStep(stepNum + 1);
      setActiveStep(stepNum + 1);
    }
  };

  const progressPercent = Math.round((highestUnlockedStep / 6) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exam Clarity Mode — The 6 Thinking Steps"
      subtitle={`${question.subjectId.toUpperCase()} • ${question.conceptTested} • ${question.marks} Marks`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Progress header */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 font-mono">
              <Compass size={14} className="text-blue-600" /> Thinking Flow Progress: Step {highestUnlockedStep} of 6
            </span>
            <span className="text-blue-600 font-mono font-bold">{progressPercent}% Unlocked</span>
          </div>
          <ProgressBar value={progressPercent} color="primary" size="sm" />
          <p className="text-[11px] text-slate-500 m-0">
            CBSE clarity rule: Do not rush into writing calculations until Steps 1 through 4 are crystallized.
          </p>
        </div>

        {/* Pinned Question Context */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {question.type} • {question.difficulty}
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {question.marks} Marks (~{Math.round(question.estimatedSolvingTime / 60)} mins)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed m-0">
            {question.questionText}
          </p>
        </div>

        {/* 6 Steps Stack */}
        <div className="space-y-3">
          {stepsData.map(step => (
            <ThinkingStepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              questionPrompt={step.questionPrompt}
              modelContent={step.modelContent}
              isUnlocked={step.stepNumber <= highestUnlockedStep}
              isActive={step.stepNumber === activeStep}
              question={question}
              onStepCompleted={() => handleStepCompleted(step.stepNumber)}
            />
          ))}
        </div>

        {/* Unlocked Final CBSE Model Answer (when all steps unlocked) */}
        {highestUnlockedStep >= 6 && (
          <div className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-4 animate-in fade-in duration-300 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 m-0">
                  Full CBSE Benchmark Answer & Marking Scheme
                </h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Max Marks: {question.marks}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed shadow-xs">
              {question.expectedAnswer}
            </div>

            {/* Marking points breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono block">
                Official Step-Marking Scheme Breakdown:
              </span>
              <div className="space-y-1.5">
                {question.markingPoints.map((mp, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 text-xs p-2.5 bg-white rounded-xl border border-emerald-100 shadow-xs">
                    <span className="text-slate-700">{mp.step}</span>
                    <span className="font-mono font-bold text-emerald-700 shrink-0">+{mp.marks}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistake callout */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-900 block mb-0.5 font-bold">Frequent Student Blunder:</strong>
                <p className="text-rose-800 leading-relaxed m-0">{question.commonMistake}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onLogMistake(question);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <AlertTriangle size={14} />
            <span>I Made a Mistake Here (Log to Mistake Book)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Done with Clarity Mode
          </button>
        </div>
      </div>
    </Modal>
  );
};
