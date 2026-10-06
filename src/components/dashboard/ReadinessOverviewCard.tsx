import React from 'react';
import { ReadinessSummary } from '../../services/readinessEngine';
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ReadinessOverviewCardProps {
  summary: ReadinessSummary;
  onExploreChapters: () => void;
}

export const ReadinessOverviewCard: React.FC<ReadinessOverviewCardProps> = ({
  summary,
  onExploreChapters
}) => {
  const { report, overallReadinessIndex } = summary;

  const tierStyles = {
    'READY': {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ringColor: '#10b981',
      icon: ShieldCheck,
      statusLabel: 'Exam Ready'
    },
    'ALMOST READY': {
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      ringColor: '#f59e0b',
      icon: AlertTriangle,
      statusLabel: 'Almost Ready'
    },
    'NOT YET READY': {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      ringColor: '#ef4444',
      icon: AlertCircle,
      statusLabel: 'Needs Focus'
    }
  };

  const currentTier = tierStyles[report.tier] || tierStyles['ALMOST READY'];
  const TierIcon = currentTier.icon;

  // SVG Circular progress params
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallReadinessIndex / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
            Overall Exam Readiness
          </h3>
          <p className="text-xs text-slate-500 m-0">
            Multi-facet CBSE Class 10 clarity index
          </p>
        </div>

        <button
          onClick={onExploreChapters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
        >
          <span>All Chapters</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Row: Circular Progress & 6 Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Large Circular Progress Indicator */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-50/70 border border-slate-100 rounded-2xl">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={currentTier.ringColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {overallReadinessIndex}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Readiness
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase border flex items-center gap-1 ${currentTier.badgeBg}`}>
              <TierIcon size={12} />
              {currentTier.statusLabel}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 mt-1 font-medium text-center">
            {summary.strongChapters.length} Strong • {summary.needsPracticeChapters.length} Practice • {summary.weakChapters.length} Weak
          </span>
        </div>

        {/* Right: 6 Dimensions Progress Bars */}
        <div className="md:col-span-7 space-y-2.5">
          {summary.dimensionMetrics.map(dim => {
            const isWeakest = dim.key === summary.weakestDimension.key;
            
            // Color based on percentage
            let barColor = 'bg-emerald-500';
            let textColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            if (dim.healthPercent < 55) {
              barColor = 'bg-rose-500';
              textColor = 'text-rose-700 bg-rose-50 border-rose-200';
            } else if (dim.healthPercent < 75) {
              barColor = 'bg-amber-500';
              textColor = 'text-amber-700 bg-amber-50 border-amber-200';
            }

            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                    {dim.name}
                    {isWeakest && (
                      <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 px-1 py-0.2 rounded font-mono uppercase font-bold shrink-0">
                        Priority Fix
                      </span>
                    )}
                  </span>
                  <span className={`font-mono text-[11px] font-bold px-1.5 py-0.2 rounded border ${textColor}`}>
                    {dim.healthPercent}%
                  </span>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${dim.healthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
