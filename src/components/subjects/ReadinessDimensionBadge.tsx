import React from 'react';
import { ReadinessStatus } from '../../types';

interface ReadinessDimensionBadgeProps {
  dimensionName: string;
  status: ReadinessStatus;
  onCycleStatus?: () => void;
  showLabel?: boolean;
}

export const ReadinessDimensionBadge: React.FC<ReadinessDimensionBadgeProps> = ({
  dimensionName,
  status,
  onCycleStatus,
  showLabel = true
}) => {
  const styles = {
    strong: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
      dot: 'bg-emerald-500',
      text: 'Strong'
    },
    'needs-practice': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100',
      dot: 'bg-amber-500',
      text: 'Practice'
    },
    weak: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100',
      dot: 'bg-rose-500',
      text: 'Weak'
    }
  }[status];

  return (
    <button
      type="button"
      onClick={onCycleStatus}
      title={`${dimensionName}: ${styles.text}. Click to change status.`}
      className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${styles.bg}`}
    >
      <div className="flex items-center gap-1.5 truncate">
        <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
        {showLabel && <span className="truncate text-slate-700 font-semibold">{dimensionName}</span>}
      </div>
      <span className="font-mono uppercase text-[10px] shrink-0 font-extrabold">{styles.text}</span>
    </button>
  );
};
