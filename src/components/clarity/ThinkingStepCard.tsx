import React, { useState } from 'react';
import { aiCoachService, StepEvaluationResult } from '../../services/aiCoachService';
import { Question } from '../../types';
import { CheckCircle2, Lock, Eye, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ThinkingStepCardProps {
  stepNumber: number;
  title: string;
  questionPrompt: string;
  modelContent: string;
  isUnlocked: boolean;
  isActive: boolean;
  question: Question;
  onStepCompleted: () => void;
}

export const ThinkingStepCard: React.FC<ThinkingStepCardProps> = ({
  stepNumber,
  title,
  questionPrompt,
  modelContent,
  isUnlocked,
  isActive,
  question,
  onStepCompleted
}) => {
  const [studentInput, setStudentInput] = useState('');
  const [evaluation, setEvaluation] = useState<StepEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isModelRevealed, setIsModelRevealed] = useState(false);
  const [isExpandedManual, setIsExpandedManual] = useState<boolean | null>(null);

  const isExpanded = isExpandedManual !== null ? isExpandedManual : isActive;

  const handleEvaluate = () => {
    if (!studentInput.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      const res = aiCoachService.evaluateStepDraft(question, stepNumber, studentInput);
      setEvaluation(res);
      setIsEvaluating(false);
      onStepCompleted();
    }, 300);
  };

  const handleReveal = () => {
    setIsModelRevealed(true);
    onStepCompleted();
  };

  if (!isUnlocked) {
    return (
      <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-2xl opacity-75 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs font-mono font-bold flex items-center justify-center">
            {stepNumber}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 m-0">
              STEP {stepNumber}: {title}
            </h4>
            <span className="text-[11px] text-slate-400">
              Complete previous steps to unlock thinking flow.
            </span>
          </div>
        </div>
        <Lock size={15} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div 
      className={`border rounded-2xl transition-all overflow-hidden ${
        isActive 
          ? 'bg-white border-blue-300 shadow-sm ring-2 ring-blue-100' 
          : 'bg-white border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Header */}
      <div 
        onClick={() => setIsExpandedManual(!isExpanded)}
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
            evaluation?.isSatisfactory || isModelRevealed
              ? 'bg-emerald-100 text-emerald-700'
              : isActive
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {evaluation?.isSatisfactory || isModelRevealed ? <CheckCircle2 size={16} /> : stepNumber}
          </div>
          <div>
            <h4 className={`text-xs sm:text-sm font-bold m-0 flex items-center gap-2 ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
              STEP {stepNumber}: {title}
            </h4>
            <p className="text-[11px] text-slate-500 m-0">{questionPrompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {evaluation && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Score: {evaluation.score}%
            </span>
          )}
          {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3.5">
          {/* Student Thought Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Your Thought Process (Attempt first before revealing):</span>
              <span className="text-[10px] text-slate-400 font-mono">No marks deducted for drafts</span>
            </label>
            <textarea
              value={studentInput}
              onChange={e => setStudentInput(e.target.value)}
              placeholder={`Write down your interpretation for Step ${stepNumber}... (e.g., target variables, knowns, or method)`}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none shadow-xs"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleEvaluate}
              disabled={!studentInput.trim() || isEvaluating}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles size={13} className="text-amber-300" />
              <span>{isEvaluating ? 'Evaluating...' : 'Evaluate My Thinking'}</span>
            </button>

            <button
              onClick={handleReveal}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Eye size={13} />
              <span>{isModelRevealed ? 'Re-inspect Model Step' : 'Reveal Model Thinking Step'}</span>
            </button>
          </div>

          {/* AI Coach Feedback */}
          {evaluation && (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" /> Clarity Coach Feedback:
                </span>
                <span className="font-mono text-xs font-bold text-blue-700">{evaluation.praise}</span>
              </div>
              <p className="text-slate-700 leading-relaxed m-0">
                {evaluation.feedback}
              </p>

              {evaluation.suggestedChecklist.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60">
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block mb-1">
                    CBSE Examiner Checklist:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                    {evaluation.suggestedChecklist.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Revealed Model Thinking */}
          {isModelRevealed && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>CBSE Benchmark Thinking — Step {stepNumber}:</span>
              </div>
              <p className="text-slate-800 whitespace-pre-line leading-relaxed m-0 font-sans">
                {modelContent}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
