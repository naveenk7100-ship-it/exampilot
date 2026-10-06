import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  Timer, 
  User,
  Compass
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  unresolvedMistakesCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  unresolvedMistakesCount
}) => {
  const items = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'subjects' as NavTab, label: 'Subjects', icon: BookOpen },
    { id: 'practice' as NavTab, label: 'Practice', icon: HelpCircle },
    { id: 'clarity-mode' as NavTab, label: 'Clarity', icon: Compass },
    { 
      id: 'mistakes' as NavTab, 
      label: 'Mistakes', 
      icon: AlertTriangle,
      hasDot: unresolvedMistakesCount > 0 
    },
    { id: 'simulator' as NavTab, label: 'Mock Test', icon: Timer },
    { id: 'profile' as NavTab, label: 'Profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex items-center justify-around px-1 z-40 shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[44px] py-1 relative transition-all ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Icon size={18} />
              {item.hasDot && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
