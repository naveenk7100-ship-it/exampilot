import React from 'react';
import { NavTab } from './Sidebar';
import { 
  Bell, 
  ChevronDown, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface NavbarProps {
  activeTab?: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: StudentProfile;
  isDemoMode?: boolean;
  attemptsCount?: number;
  unresolvedMistakesCount: number;
  onTriggerWhatToStudy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab: _activeTab,
  setActiveTab,
  profile,
  isDemoMode = true,
  attemptsCount = 0,
  unresolvedMistakesCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-20 shadow-sm/50">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Greeting & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight m-0 truncate">
              Good Morning, {profile.name.split(' ')[0]}! 👋
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
              Class 10 • CBSE
            </span>
          </div>
          <p className="text-xs text-slate-500 m-0 hidden sm:block truncate">
            Let's make today count. Focus on your weak areas and build your exam confidence.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Demo Mode / Live Intelligence Status Pill */}
          {isDemoMode ? (
            <div 
              title="Demo Mode: Sample data loaded. Attempt questions to see live performance tracking."
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-[11px] font-semibold font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Demo Mode</span>
              <span className="sm:hidden">Demo</span>
            </div>
          ) : (
            <div 
              title={`Live Intelligence: ${attemptsCount} attempts tracked.`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold font-mono"
            >
              <Activity size={12} className="text-emerald-600" />
              <span className="hidden sm:inline">Live Student Intel ({attemptsCount})</span>
              <span className="sm:hidden">Live ({attemptsCount})</span>
            </div>
          )}

          {/* Quick Mistakes Counter Pill */}
          {unresolvedMistakesCount > 0 && (
            <button
              onClick={() => setActiveTab('mistakes')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold font-mono transition-colors"
            >
              <AlertTriangle size={12} className="text-rose-500" />
              <span>{unresolvedMistakesCount} Pitfall{unresolvedMistakesCount > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Notification Icon */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* Student Profile Pill */}
          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {profile.standard} CBSE
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
