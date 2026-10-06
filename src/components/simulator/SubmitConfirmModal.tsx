import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answeredCount: number;
  notAnsweredCount: number;
  markedReviewCount: number;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  notAnsweredCount,
  markedReviewCount
}) => {
  const hasUnanswered = notAnsweredCount > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit CBSE Simulated Examination"
      subtitle="Verify your attempt summary before final scoring and diagnostic generation."
      maxWidth="md"
    >
      <div className="space-y-4">
        {hasUnanswered && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">You have unattempted questions:</strong>
              <span className="text-amber-800">CBSE board evaluation does not penalize incorrect answers in Class 10. Attempt all questions!</span>
            </div>
          </div>
        )}

        {/* Status Table */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden text-xs">
          <div className="p-3.5 flex justify-between items-center border-b border-slate-200">
            <span className="text-slate-600 font-medium">Total Questions:</span>
            <span className="font-mono font-bold text-slate-900">{totalQuestions}</span>
          </div>
          <div className="p-3.5 flex justify-between items-center border-b border-slate-200 bg-emerald-50/50">
            <span className="text-emerald-800 font-semibold">Answered:</span>
            <span className="font-mono font-bold text-emerald-700">{answeredCount}</span>
          </div>
          <div className="p-3.5 flex justify-between items-center border-b border-slate-200 bg-rose-50/50">
            <span className="text-rose-800 font-semibold">Not Answered:</span>
            <span className="font-mono font-bold text-rose-700">{notAnsweredCount}</span>
          </div>
          <div className="p-3.5 flex justify-between items-center bg-purple-50/50">
            <span className="text-purple-800 font-semibold">Marked for Review:</span>
            <span className="font-mono font-bold text-purple-700">{markedReviewCount}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Return to Test
          </button>
          <button
            onClick={onConfirmSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Submit & Generate Analysis
          </button>
        </div>
      </div>
    </Modal>
  );
};
