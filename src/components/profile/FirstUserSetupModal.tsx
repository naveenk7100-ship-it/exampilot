import React, { useState } from 'react';
import { StudentProfile, StudentSubjectConfig, SubjectId } from '../../types';
import { getDefaultExamDate } from '../../services/storageService';
import { 
  User, 
  GraduationCap, 
  ArrowRight, 
  Eye
} from 'lucide-react';

interface FirstUserSetupModalProps {
  isOpen: boolean;
  onCompleteSetup: (profile: StudentProfile) => void;
  onLoadDemo: () => void;
}

const DEFAULT_SUBJECT_CONFIG: StudentSubjectConfig = {
  language1: 'english-184',
  language2: 'hindi-002',
  mathType: 'standard-041',
  science: true,
  socialScience: true,
  optionalSubject: 'none'
};

export const FirstUserSetupModal: React.FC<FirstUserSetupModalProps> = ({
  isOpen,
  onCompleteSetup,
  onLoadDemo
}) => {
  const [currentTimestamp] = useState(() => Date.now());
  const [name, setName] = useState('');
  const [subjectConfig, setSubjectConfig] = useState<StudentSubjectConfig>(DEFAULT_SUBJECT_CONFIG);
  const [targetExamDate, setTargetExamDate] = useState(() => getDefaultExamDate());
  const [targetScore, setTargetScore] = useState(90);

  if (!isOpen) return null;

  const deriveEnrolledSubjects = (cfg: StudentSubjectConfig): SubjectId[] => {
    const list: SubjectId[] = ['mathematics'];
    if (cfg.science) list.push('science');
    if (cfg.socialScience) list.push('social-science');
    
    if (cfg.language1.startsWith('english')) {
      list.push('english');
    } else if (cfg.language1.startsWith('hindi')) {
      list.push('hindi');
    }

    if (cfg.language2.startsWith('english') && !list.includes('english')) {
      list.push('english');
    } else if (cfg.language2.startsWith('hindi') && !list.includes('hindi')) {
      list.push('hindi');
    }

    return list;
  };

  const handleConfigChange = (key: keyof StudentSubjectConfig, value: any) => {
    setSubjectConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentName = name.trim() || 'Student';
    const enrolledSubjects = deriveEnrolledSubjects(subjectConfig);
    const profile: StudentProfile = {
      name: studentName,
      standard: 'Class 10',
      board: 'CBSE',
      subjectConfig,
      enrolledSubjects,
      targetExamDate,
      targetScore: Number(targetScore) || 90,
      studyTimeDailyMinutes: 120,
      isDemoMode: false,
      hasCompletedSetup: true
    };
    onCompleteSetup(profile);
  };

  const targetTime = new Date(targetExamDate).getTime();
  const daysUntilExam = Math.max(0, Math.ceil((targetTime - currentTimestamp) / (1000 * 60 * 60 * 24)));


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                CBSE Class 10 2026–27
              </span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
            Welcome to ExamPilot
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
            Configure your student profile and CBSE subjects to personalize your exam readiness engine.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-blue-600" />
              <span>Your Name:</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Enter your name (e.g., Aarav, Diya, Rohan)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:bg-white focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>

          {/* Subjects Grid */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono block">
              CBSE Subject Combination:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Language 1 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Language 1:
                </label>
                <select
                  value={subjectConfig.language1}
                  onChange={e => handleConfigChange('language1', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="english-184">English Lang & Lit (184)</option>
                  <option value="english-101">English Communicative (101)</option>
                  <option value="hindi-002">Hindi Course A (002)</option>
                  <option value="hindi-085">Hindi Course B (085)</option>
                </select>
              </div>

              {/* Language 2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Language 2:
                </label>
                <select
                  value={subjectConfig.language2}
                  onChange={e => handleConfigChange('language2', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="hindi-002">Hindi Course A (002)</option>
                  <option value="hindi-085">Hindi Course B (085)</option>
                  <option value="english-184">English Lang & Lit (184)</option>
                  <option value="sanskrit-122">Sanskrit (122)</option>
                  <option value="french-018">French (018)</option>
                  <option value="none">None / Exempted</option>
                </select>
              </div>

              {/* Mathematics Standard vs Basic */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Mathematics:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleConfigChange('mathType', 'standard-041')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                      subjectConfig.mathType === 'standard-041'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Standard (041)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfigChange('mathType', 'basic-241')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                      subjectConfig.mathType === 'basic-241'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Basic (241)
                  </button>
                </div>
              </div>

              {/* Core Compulsory */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Core Subjects (80M Theory):
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-semibold">
                    ✓ Science (086)
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold">
                    ✓ Social Science (087)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Goal & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
                <span>Target Exam Date:</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {daysUntilExam} Days
                </span>
              </label>
              <input
                type="date"
                value={targetExamDate}
                onChange={e => setTargetExamDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Target Score Goal (%):
              </label>
              <input
                type="number"
                min={60}
                max={100}
                value={targetScore}
                onChange={e => setTargetScore(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              <span>Start My CBSE Preparation</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onLoadDemo}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye size={14} className="text-amber-600" />
              <span>Or Explore with Demo Mode Preview</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
