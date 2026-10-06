import React from 'react';
import { TestResultAnalysis } from '../../types';
import { Timer, Award, Zap, ArrowRight, Clock } from 'lucide-react';

interface MockScoreCardProps {
  lastResult?: TestResultAnalysis;
  onLaunchSimulator: () => void;
}

export const MockScoreCard: React.FC<MockScoreCardProps> = ({
  lastResult,
  onLaunchSimulator
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-blue-600" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
              Mock Exam Performance
            </h3>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            CBSE Timed
          </span>
        </div>

        {lastResult ? (
          <div className="space-y-3.5">
            <div className="flex items-baseline justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div>
                <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {lastResult.totalScore}
                </span>
                <span className="text-sm text-slate-500 font-mono font-medium">/{lastResult.maxScore} Marks</span>
                <p className="text-[11px] text-slate-500 font-medium m-0 truncate mt-0.5">
                  {lastResult.examTitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-600 font-mono">
                  {lastResult.percentage}%
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase font-mono font-bold block mt-0.5">
                  Passed
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">Accuracy</span>
                <p className="text-slate-900 font-extrabold font-mono text-sm mt-0.5 m-0">{lastResult.accuracy}%</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">Efficiency</span>
                <p className="text-slate-900 font-bold text-xs mt-0.5 m-0 flex items-center justify-center gap-1">
                  <Zap size={12} className="text-amber-500 shrink-0" />
                  <span>{lastResult.timeEfficiency}</span>
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <span className="text-slate-400 text-[10px] uppercase font-mono block font-bold">Time Taken</span>
                <p className="text-slate-900 font-bold font-mono text-xs mt-0.5 m-0 flex items-center justify-center gap-1">
                  <Clock size={11} className="text-slate-400 shrink-0" />
                  <span>{Math.round(lastResult.totalTimeSeconds / 60)}m</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/70 text-center text-xs text-slate-500 space-y-1.5">
            <Award size={24} className="text-blue-500 mx-auto opacity-90" />
            <p className="font-bold text-slate-800 m-0">No mock exam attempted yet</p>
            <p className="text-[11px] text-slate-400 m-0">
              Experience official CBSE sectional blueprints under timed conditions.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={onLaunchSimulator}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs group"
        >
          <span>{lastResult ? 'Take Another Timed Mock' : 'Start Timed Mock Exam'}</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
