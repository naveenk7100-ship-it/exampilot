import React, { useState } from 'react';
import { MistakeCategory, MistakeEntry, Question } from '../../types';
import { Modal } from '../common/Modal';
import { MISTAKE_META } from '../../services/mistakeEngine';
import { AlertTriangle } from 'lucide-react';

interface LogMistakeModalProps {
  question: Question | null;
  prefilledCategory?: MistakeCategory;
  isOpen: boolean;
  onClose: () => void;
  onSaveMistake: (mistake: MistakeEntry) => void;
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

export const LogMistakeModal: React.FC<LogMistakeModalProps> = ({
  question,
  prefilledCategory,
  isOpen,
  onClose,
  onSaveMistake
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MistakeCategory>('Calculation');
  const [userNote, setUserNote] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');

  const activeCategory = prefilledCategory || selectedCategory;

  if (!question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMistake: MistakeEntry = {
      id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      questionId: question.id,
      subjectId: question.subjectId,
      chapterId: question.chapterId,
      topic: question.topic,
      category: activeCategory,
      userNote: userNote.trim() || `Made ${activeCategory} mistake in ${question.topic}`,
      studentAnswer: studentAnswer.trim(),
      timestamp: Date.now(),
      attemptNumber: 1,
      resolved: false
    };

    onSaveMistake(newMistake);
    setUserNote('');
    setStudentAnswer('');
    onClose();
  };

  const currentMeta = MISTAKE_META[activeCategory];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Mistake to Mistake Book"
      subtitle={`${question.subjectId.toUpperCase()} • ${question.conceptTested}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Picker */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 font-mono">
            1. Select Exact Mistake Classification:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs ring-2 ring-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Category Diagnostic Impact */}
        {currentMeta && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold">
              <AlertTriangle size={14} className="text-rose-600" />
              <span>CBSE Board Impact: {currentMeta.impact}</span>
            </div>
            <p className="text-rose-800 m-0 leading-relaxed">
              {currentMeta.description}
            </p>
          </div>
        )}

        {/* User Note */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            2. What went wrong in your thinking? (Self-Reflection):
          </label>
          <textarea
            value={userNote}
            onChange={e => setUserNote(e.target.value)}
            placeholder="e.g. I subtracted upstream speed from boat speed backwards, or forgot the minus sign in mirror formula..."
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors font-mono shadow-xs"
          />
        </div>

        {/* Optional Student Attempt Text */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            3. Your Attempted Value / Notes (Optional):
          </label>
          <input
            type="text"
            value={studentAnswer}
            onChange={e => setStudentAnswer(e.target.value)}
            placeholder="e.g., Calculated v = 30 cm without minus sign"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors font-mono shadow-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Record in Mistake Book
          </button>
        </div>
      </form>
    </Modal>
  );
};
