import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-700 font-semibold">{label}</span>}
          {sublabel && <span className="text-slate-500 font-mono">{sublabel}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
