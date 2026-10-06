import React, { useState } from 'react';
import { Chapter, SubjectId } from '../../types';
import { readinessEngine } from '../../services/readinessEngine';
import { Search } from 'lucide-react';

interface ChapterHealthGridProps {
  chapters: Chapter[];
  enrolledSubjects?: SubjectId[];
  onSelectChapter: (chapter: Chapter) => void;
}

export const ChapterHealthGrid: React.FC<ChapterHealthGridProps> = ({
  chapters,
  enrolledSubjects,
  onSelectChapter
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [search, setSearch] = useState('');

  const allTabs: { id: 'all' | SubjectId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'mathematics', label: 'Maths' },
    { id: 'science', label: 'Science' },
    { id: 'social-science', label: 'SST' },
    { id: 'english', label: 'English' },
    { id: 'hindi', label: 'Hindi' }
  ];

  const subjectTabs = enrolledSubjects
    ? allTabs.filter(tab => tab.id === 'all' || enrolledSubjects.includes(tab.id as SubjectId))
    : allTabs;

  const filteredChapters = chapters.filter(ch => {
    const isEnrolled = !enrolledSubjects || enrolledSubjects.includes(ch.subjectId);
    const matchesSubject = selectedSubject === 'all' || ch.subjectId === selectedSubject;
    const matchesSearch = ch.name.toLowerCase().includes(search.toLowerCase()) ||
                          ch.subjectId.toLowerCase().includes(search.toLowerCase());
    return isEnrolled && matchesSubject && matchesSearch;
  });

  const getStatusBadge = (tier: 'strong' | 'needs-practice' | 'weak') => {
    switch (tier) {
      case 'strong':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          bar: 'bg-emerald-500',
          label: 'Strong'
        };
      case 'needs-practice':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          bar: 'bg-amber-500',
          label: 'Needs Practice'
        };
      case 'weak':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          bar: 'bg-rose-500',
          label: 'Weak'
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="pb-3 border-b border-slate-100 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight m-0">
              Chapter Health
            </h3>
            <p className="text-xs text-slate-500 m-0">
              Class 10 chapter readiness distribution
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredChapters.length} Chapters
          </span>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {subjectTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubject(tab.id)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all shrink-0 ${
                selectedSubject === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3.5">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter chapters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Chapters List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredChapters.map(chapter => {
          const tier = readinessEngine.getChapterOverallTier(chapter);
          const score = readinessEngine.calculateChapterScore(chapter);
          const badge = getStatusBadge(tier);

          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                    {chapter.subjectId} • {chapter.cbseWeightageMarks}m
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate m-0">
                    {chapter.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border font-mono ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full ${badge.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
