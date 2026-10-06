import React, { useState, useRef } from 'react';
import { StudentProfile, StudentSubjectConfig, SubjectId } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  User, 
  Target, 
  BookOpen, 
  RotateCcw, 
  Download, 
  Upload,
  ShieldCheck,
  CheckCircle2,
  Save,
  GraduationCap
} from 'lucide-react';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onResetData: () => void;
  onLoadDemo?: () => void;
  onExitDemo?: () => void;
}

const DEFAULT_SUBJECT_CONFIG: StudentSubjectConfig = {
  language1: 'english-184',
  language2: 'hindi-002',
  mathType: 'standard-041',
  science: true,
  socialScience: true,
  optionalSubject: 'none'
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetData,
  onLoadDemo,
  onExitDemo
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    ...profile,
    subjectConfig: profile.subjectConfig || DEFAULT_SUBJECT_CONFIG
  });
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive enrolled SubjectId list from subjectConfig
  const deriveEnrolledSubjects = (cfg: StudentSubjectConfig): SubjectId[] => {
    const list: SubjectId[] = ['mathematics'];
    if (cfg.science) list.push('science');
    if (cfg.socialScience) list.push('social-science');
    
    // Language 1
    if (cfg.language1.startsWith('english')) {
      list.push('english');
    } else if (cfg.language1.startsWith('hindi')) {
      list.push('hindi');
    }

    // Language 2
    if (cfg.language2.startsWith('english') && !list.includes('english')) {
      list.push('english');
    } else if (cfg.language2.startsWith('hindi') && !list.includes('hindi')) {
      list.push('hindi');
    }

    return list;
  };

  const handleConfigChange = (key: keyof StudentSubjectConfig, value: any) => {
    const nextConfig: StudentSubjectConfig = {
      ...(formData.subjectConfig || DEFAULT_SUBJECT_CONFIG),
      [key]: value
    };
    const nextEnrolled = deriveEnrolledSubjects(nextConfig);
    setFormData(prev => ({
      ...prev,
      subjectConfig: nextConfig,
      enrolledSubjects: nextEnrolled
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentName = formData.name.trim() || 'Student';
    const updated: StudentProfile = {
      ...formData,
      name: studentName,
      hasCompletedSetup: true
    };
    setFormData(updated);
    onSaveProfile(updated);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };


  // Export JSON backup
  const handleExportData = () => {
    const jsonStr = storageService.exportFullBackup();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ExamPilot_CBSE10_${formData.name.replace(/\s+/g, '_')}_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore JSON backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = storageService.restoreBackup(content);
        if (success) {
          const fresh = storageService.getProfile();
          setFormData(fresh);
          onSaveProfile(fresh);
          setRestoreMessage('Backup restored successfully! All chapter metrics loaded.');
        } else {
          setRestoreMessage('Failed to restore: Invalid backup file format.');
        }
      } catch {
        setRestoreMessage('Error reading JSON file.');
      }
      setTimeout(() => setRestoreMessage(null), 3500);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [currentTimestamp] = useState(() => Date.now());
  const targetTime = new Date(formData.targetExamDate).getTime();
  const daysUntilExam = Math.max(0, Math.ceil((targetTime - currentTimestamp) / (1000 * 60 * 60 * 24)));

  const cfg = formData.subjectConfig || DEFAULT_SUBJECT_CONFIG;

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-lg shadow-2xs">
            <User size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                CBSE Class 10 Student Profile & Subject Combination
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 m-0">
              Official CBSE 2026–27 Scheme of Studies configuration. Local-first persistence.
            </p>
          </div>
        </div>
      </div>

      {isSavedAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Settings, subject selection, and target goals updated successfully!
        </div>
      )}

      {restoreMessage && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 font-medium flex items-center gap-2 animate-in fade-in shadow-xs">
          <ShieldCheck size={16} className="text-blue-600" />
          {restoreMessage}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        {/* Basic Student Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono m-0 flex items-center gap-2">
            <Target size={16} className="text-blue-600" />
            1. Student Target Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Student Name:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors shadow-2xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Academic Curriculum:
              </label>
              <input
                type="text"
                disabled
                value="CBSE Secondary School Examination (Class X 2026–27)"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                <span>Target Board Exam Date:</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {daysUntilExam} Days Remaining
                </span>
              </label>
              <input
                type="date"
                value={formData.targetExamDate}
                onChange={e => setFormData({ ...formData, targetExamDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono shadow-2xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Board Score Goal (%):
              </label>
              <input
                type="number"
                min={60}
                max={100}
                value={formData.targetScore}
                onChange={e => setFormData({ ...formData, targetScore: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Official CBSE Scheme of Studies Subject Model */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono m-0 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-600" />
              2. CBSE Class 10 Scheme of Studies (Subject Selection)
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {formData.enrolledSubjects.length} Active Subjects
            </span>
          </div>

          <p className="text-xs text-slate-600 m-0 leading-relaxed">
            Per CBSE guidelines, Class 10 requires Language 1, Language 2, Mathematics (Standard or Basic), Science, Social Science, and optional Skill subjects. Configure your actual enrolled subjects below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language 1 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Language 1 (First Language):
              </label>
              <select
                value={cfg.language1}
                onChange={e => handleConfigChange('language1', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="english-184">English Language & Literature (Code: 184)</option>
                <option value="english-101">English Communicative (Code: 101)</option>
                <option value="hindi-002">Hindi Course A (Code: 002)</option>
                <option value="hindi-085">Hindi Course B (Code: 085)</option>
              </select>
            </div>

            {/* Language 2 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Language 2 (Second Language):
              </label>
              <select
                value={cfg.language2}
                onChange={e => handleConfigChange('language2', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="hindi-002">Hindi Course A (Code: 002)</option>
                <option value="hindi-085">Hindi Course B (Code: 085)</option>
                <option value="english-184">English Language & Literature (Code: 184)</option>
                <option value="sanskrit-122">Sanskrit (Code: 122)</option>
                <option value="french-018">French (Code: 018)</option>
                <option value="none">None / Exempted</option>
              </select>
            </div>

            {/* Mathematics Standard vs Basic */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Mathematics Track:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConfigChange('mathType', 'standard-041')}
                  className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                    cfg.mathType === 'standard-041'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Standard (041)
                </button>

                <button
                  type="button"
                  onClick={() => handleConfigChange('mathType', 'basic-241')}
                  className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                    cfg.mathType === 'basic-241'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Basic (241)
                </button>
              </div>
            </div>

            {/* Core Compulsory: Science & SST */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Core Academic Subjects (80 Marks Theory):
              </label>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-semibold">
                  ✓ Science (086)
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold">
                  ✓ Social Science (087)
                </span>
              </div>
            </div>

            {/* Optional / Skill Subject */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Optional / Skill Subject (Group S):
              </label>
              <select
                value={cfg.optionalSubject}
                onChange={e => handleConfigChange('optionalSubject', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="none">None (Standard 5 Subjects Scheme)</option>
                <option value="info-tech-402">Information Technology (Code: 402)</option>
                <option value="ai-417">Artificial Intelligence (Code: 417)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Enrolled Overview Pills */}
        <div className="pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
            <BookOpen size={14} className="text-blue-600" />
            Active Subjects Included in Readiness Engine:
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.enrolledSubjects.map(subId => (
              <span
                key={subId}
                className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} className="text-blue-600" />
                {subId}
              </span>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Save size={15} />
            <span>Save Profile & Subjects</span>
          </button>
        </div>
      </form>

      {/* Local-First Persistence & Backup Import/Export */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">
            Local-First Persistence & Diagnostics Backup
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed m-0">
          All your chapter readiness metrics, logged mistakes, and mock results are stored locally in your browser storage. You can export a JSON backup, restore an existing backup file, explore with demo mode preview, or reset to a clean baseline.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export button */}
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <Download size={14} />
            <span>Export Progress Backup (JSON)</span>
          </button>

          {/* Import / Restore button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <Upload size={14} />
            <span>Restore Backup File</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestoreFile}
            accept=".json,application/json"
            className="hidden"
          />

          {/* Demo Mode Toggle */}
          {profile.isDemoMode ? (
            <button
              type="button"
              onClick={onExitDemo}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Exit Demo Mode (Start Clean)</span>
            </button>
          ) : (
            onLoadDemo && (
              <button
                type="button"
                onClick={onLoadDemo}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                <span>Load Demo Mode Preview</span>
              </button>
            )
          )}

          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all data to a clean student state?")) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset to Clean Student Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};

