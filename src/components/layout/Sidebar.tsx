import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  Timer, 
  Sparkles, 
  User, 
  Compass,
  CheckCircle2,
  Calendar,
  BarChart3,
  Flame
} from 'lucide-react';
import { StudentProfile } from '../../types';

export type NavTab = 
  | 'dashboard' 
  | 'subjects' 
  | 'practice' 
  | 'clarity-mode'
  | 'mistakes' 
  | 'simulator' 
  | 'revision' 
  | 'results'
  | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: StudentProfile;
  readinessScore: number;
  readinessTier?: string;
  onTriggerWhatToStudy: () => void;
  unresolvedMistakesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  readinessScore,
  readinessTier = 'Almost Ready',
  onTriggerWhatToStudy,
  unresolvedMistakesCount
}) => {
  const [currentTimestamp] = useState(() => Date.now());
  const targetTime = new Date(profile.targetExamDate).getTime();
  const daysLeft = Math.max(0, Math.ceil((targetTime - currentTimestamp) / (1000 * 60 * 60 * 24)));

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'subjects' as NavTab, label: 'Subjects', icon: BookOpen, badge: '5 Core' },
    { id: 'practice' as NavTab, label: 'Practice', icon: HelpCircle, badge: '6 Types' },
    { id: 'clarity-mode' as NavTab, label: 'Clarity Mode', icon: Compass, badge: '6 Steps' },
    { 
      id: 'mistakes' as NavTab, 
      label: 'Mistake Book', 
      icon: AlertTriangle, 
      badge: unresolvedMistakesCount > 0 ? `${unresolvedMistakesCount}` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    { id: 'simulator' as NavTab, label: 'Exam Simulator', icon: Timer, badge: 'CBSE' },
    { id: 'revision' as NavTab, label: 'Revision Sprint', icon: Sparkles, badge: '15m' },
    { id: 'results' as NavTab, label: 'Results & Analysis', icon: BarChart3, badge: null },
    { id: 'profile' as NavTab, label: 'Profile & Goal', icon: User, badge: null }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0b132b] text-slate-200 border-r border-slate-800/80 h-screen sticky top-0 p-4 select-none justify-between z-30 shadow-xl">
      {/* Brand Header */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Compass className="animate-spin-slow" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">ExamPilot</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                Class 10
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">CBSE Exam Clarity Engine</p>
          </div>
        </div>

        {/* Primary CTA button in sidebar */}
        <div className="px-1">
          <button
            onClick={onTriggerWhatToStudy}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-amber-300 group-hover:scale-110 transition-transform" />
              <span>What to study now?</span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-white font-mono">
              AI
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : (item.badgeColor || 'bg-slate-800 text-slate-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card: Readiness & Board Countdown */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2.5 px-1">
        {/* Readiness Meter Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Exam Readiness
            </span>
            <span className="font-mono font-bold text-white text-xs">{readinessScore}%</span>
          </div>

          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${readinessScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span className="text-emerald-400 font-medium">{readinessTier}</span>
            <span className="font-mono text-[10px] text-slate-500">Goal: {profile.targetScore}%</span>
          </div>
        </div>

        {/* Board Countdown */}
        <div className="flex items-center justify-between text-xs px-2.5 py-2 bg-slate-900/60 border border-slate-800/60 rounded-xl text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar size={13} className="text-amber-400" /> CBSE Boards
          </span>
          <span className="font-mono font-bold text-amber-300 text-xs">
            {daysLeft} Days Left
          </span>
        </div>
      </div>
    </aside>
  );
};
