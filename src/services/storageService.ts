import { Chapter, MistakeEntry, QuestionAttempt, StudentProfile, StudySession, TestResultAnalysis } from '../types';
import { INITIAL_CHAPTERS } from '../data/subjectsData';

const STORAGE_KEYS = {
  PROFILE: 'exampilot_profile_v2',
  CHAPTERS: 'exampilot_chapters_v2',
  MISTAKES: 'exampilot_mistakes_v2',
  TEST_RESULTS: 'exampilot_test_results_v2',
  ATTEMPTS: 'exampilot_attempts_v2',
  SESSIONS: 'exampilot_sessions_v2'
};

export function getDefaultExamDate(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  // Next CBSE Class 10 Board Exam starts mid-February
  const examYear = now.getMonth() >= 2 ? currentYear + 1 : currentYear;
  return `${examYear}-02-15`;
}

export const CLEAN_PROFILE: StudentProfile = {
  name: '',
  standard: 'Class 10',
  board: 'CBSE',
  subjectConfig: {
    language1: 'english-184',
    language2: 'hindi-002',
    mathType: 'standard-041',
    science: true,
    socialScience: true,
    optionalSubject: 'none'
  },
  enrolledSubjects: ['mathematics', 'science', 'social-science', 'english', 'hindi'],
  targetExamDate: getDefaultExamDate(),
  targetScore: 90,
  studyTimeDailyMinutes: 120,
  isDemoMode: false,
  hasCompletedSetup: false
};

export const DEMO_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  standard: 'Class 10',
  board: 'CBSE',
  subjectConfig: {
    language1: 'english-184',
    language2: 'hindi-002',
    mathType: 'standard-041',
    science: true,
    socialScience: true,
    optionalSubject: 'none'
  },
  enrolledSubjects: ['mathematics', 'science', 'social-science', 'english', 'hindi'],
  targetExamDate: getDefaultExamDate(),
  targetScore: 95,
  studyTimeDailyMinutes: 120,
  isDemoMode: true,
  hasCompletedSetup: true
};

export const getCleanChapters = (): Chapter[] => {
  return INITIAL_CHAPTERS.map(ch => ({
    ...ch,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'needs-practice',
      questionSolving: 'needs-practice',
      answerWriting: 'needs-practice',
      timeSpeed: 'needs-practice',
      revision: 'needs-practice'
    }
  }));
};

// Sample mistakes used ONLY for explicit Demo Mode preview
export const SEED_MISTAKES: MistakeEntry[] = [
  {
    id: 'mistake-seed-1',
    questionId: 'sci-q1',
    subjectId: 'science',
    chapterId: 'sci-electricity',
    topic: 'Equivalent Resistance & Circuit Power',
    category: 'Missing unit',
    userNote: 'Forgot to write Ω for equivalent resistance and V for parallel branch voltage.',
    studentAnswer: 'Req = 6, V = 4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    attemptNumber: 1,
    resolved: false
  },
  {
    id: 'mistake-seed-2',
    questionId: 'math-q2',
    subjectId: 'mathematics',
    chapterId: 'math-quadratic-equations',
    topic: 'Applied Word Problems (Speed & Distance)',
    category: 'Misread question',
    userNote: 'Formulated upstream speed as (x - 18) instead of (18 - x). Lost sign logic.',
    studentAnswer: 'x - 18 speed upstream',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    attemptNumber: 1,
    resolved: false
  },
  {
    id: 'mistake-seed-3',
    questionId: 'sci-q2',
    subjectId: 'science',
    chapterId: 'sci-light',
    topic: 'Mirror Formula & Sign Convention',
    category: 'Wrong method',
    userNote: 'Used lens formula 1/f = 1/v - 1/u instead of concave mirror formula 1/f = 1/v + 1/u.',
    studentAnswer: 'Used 1/f = 1/v - 1/u',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    attemptNumber: 2,
    resolved: false
  },
  {
    id: 'mistake-seed-4',
    questionId: 'sst-q1',
    subjectId: 'social-science',
    chapterId: 'sst-nationalism-europe',
    topic: 'Napoleonic Code (Civil Code of 1804)',
    category: 'Poor answer structure',
    userNote: 'Wrote one continuous paragraph without point headers. Examiner marked down for structure.',
    studentAnswer: 'Unstructured narrative',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    attemptNumber: 1,
    resolved: false
  }
];

export const storageService = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : CLEAN_PROFILE;
    } catch {
      return CLEAN_PROFILE;
    }
  },

  saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getChapters(): Chapter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      if (data) {
        return JSON.parse(data);
      }
      return getCleanChapters();
    } catch {
      return getCleanChapters();
    }
  },

  saveChapters(chapters: Chapter[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    } catch (e) {
      console.error('Failed to save chapters', e);
    }
  },


  updateChapterReadiness(chapterId: string, dimension: keyof Chapter['readiness'], status: Chapter['readiness'][keyof Chapter['readiness']]): Chapter[] {
    const chapters = this.getChapters();
    const updated = chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          readiness: {
            ...ch.readiness,
            [dimension]: status
          }
        };
      }
      return ch;
    });
    this.saveChapters(updated);
    return updated;
  },

  getAttempts(): QuestionAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAttempts(attempts: QuestionAttempt[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch (e) {
      console.error('Failed to save attempts', e);
    }
  },

  recordAttempt(attemptData: Omit<QuestionAttempt, 'id' | 'timestamp'>): { attempt: QuestionAttempt; allAttempts: QuestionAttempt[] } {
    const attempts = this.getAttempts();
    const newAttempt: QuestionAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    const updated = [newAttempt, ...attempts];
    this.saveAttempts(updated);

    // Switch profile out of Demo mode if active
    const profile = this.getProfile();
    if (profile.isDemoMode) {
      this.saveProfile({ ...profile, isDemoMode: false });
    }

    return { attempt: newAttempt, allAttempts: updated };
  },

  getSessions(): StudySession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions: StudySession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions', e);
    }
  },

  recordSession(sessionData: Omit<StudySession, 'id'>): StudySession {
    const sessions = this.getSessions();
    const newSession: StudySession = {
      ...sessionData,
      id: `session-${Date.now()}`
    };
    const updated = [newSession, ...sessions];
    this.saveSessions(updated);
    return newSession;
  },

  getMistakes(): MistakeEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMistakes(mistakes: MistakeEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    } catch (e) {
      console.error('Failed to save mistakes', e);
    }
  },

  addMistake(entry: Omit<MistakeEntry, 'id' | 'timestamp' | 'attemptNumber'> & { attemptNumber?: number }): MistakeEntry {
    const mistakes = this.getMistakes();
    const existingCount = mistakes.filter(m => m.questionId === entry.questionId).length;
    const newEntry: MistakeEntry = {
      ...entry,
      attemptNumber: entry.attemptNumber ?? (existingCount + 1),
      id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...mistakes];
    this.saveMistakes(updated);
    return newEntry;
  },

  resolveMistake(id: string): void {
    const mistakes = this.getMistakes();
    const updated = mistakes.map(m => m.id === id ? { ...m, resolved: true } : m);
    this.saveMistakes(updated);
  },

  getTestResults(): TestResultAnalysis[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTestResult(result: TestResultAnalysis): void {
    try {
      const results = this.getTestResults();
      localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify([result, ...results]));
    } catch (e) {
      console.error('Failed to save test result', e);
    }
  },

  // Explicit Demo Mode loader (isolated sample preview)
  loadDemoData(): { profile: StudentProfile; chapters: Chapter[]; mistakes: MistakeEntry[] } {
    this.saveProfile(DEMO_PROFILE);
    this.saveChapters(INITIAL_CHAPTERS);
    this.saveMistakes(SEED_MISTAKES);
    return {
      profile: DEMO_PROFILE,
      chapters: INITIAL_CHAPTERS,
      mistakes: SEED_MISTAKES
    };
  },

  // Clear demo mode and return to clean real student state
  exitDemoMode(): { profile: StudentProfile; chapters: Chapter[]; mistakes: MistakeEntry[] } {
    this.resetAllData();
    return {
      profile: CLEAN_PROFILE,
      chapters: getCleanChapters(),
      mistakes: []
    };
  },

  exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      chapters: this.getChapters(),
      mistakes: this.getMistakes(),
      attempts: this.getAttempts(),
      sessions: this.getSessions(),
      testResults: this.getTestResults()
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveProfile(data.profile);
      if (data.chapters) this.saveChapters(data.chapters);
      if (data.mistakes) this.saveMistakes(data.mistakes);
      if (data.attempts) this.saveAttempts(data.attempts);
      if (data.sessions) this.saveSessions(data.sessions);
      if (data.testResults && Array.isArray(data.testResults)) {
        localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(data.testResults));
      }
      return true;
    } catch (e) {
      console.error('Failed to restore backup', e);
      return false;
    }
  },

  resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CHAPTERS);
      localStorage.removeItem(STORAGE_KEYS.MISTAKES);
      localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (e) {
      console.error('Failed to clear data', e);
    }
  }
};

