import React, { useEffect, useState } from 'react';
import { Timer, Pause, Play } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeExpired: () => void;
  onTimeUpdate?: (secondsLeft: number) => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialSeconds,
  onTimeExpired,
  onTimeUpdate
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const next = prev - 1;
        if (onTimeUpdate) onTimeUpdate(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, onTimeExpired, onTimeUpdate]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 300; // Under 5 mins

  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-colors shadow-xs ${
      isUrgent
        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
        : 'bg-white text-slate-800 border-slate-200'
    }`}>
      <Timer size={16} className={isUrgent ? 'text-rose-600' : 'text-blue-600'} />

      <div className="font-mono text-sm font-bold tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <button
        onClick={() => setIsPaused(!isPaused)}
        className="p-1 text-slate-400 hover:text-slate-700 transition-colors ml-1 rounded-md hover:bg-slate-100"
        title={isPaused ? 'Resume Timer' : 'Pause Timer'}
      >
        {isPaused ? <Play size={12} className="text-emerald-600" /> : <Pause size={12} />}
      </button>
    </div>
  );
};
