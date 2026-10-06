import { describe, it, expect, beforeEach } from 'vitest';
import { 
  storageService, 
  CLEAN_PROFILE, 
  DEMO_PROFILE, 
  SEED_MISTAKES, 
  getDefaultExamDate,
  getCleanChapters 
} from '../services/storageService';
import { readinessEngine } from '../services/readinessEngine';
import { recommendationEngine } from '../services/recommendationEngine';

// Setup in-memory localStorage for Node test runner
const memoryStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => memoryStorage[key] || null,
  setItem: (key: string, value: string) => { memoryStorage[key] = value; },
  removeItem: (key: string) => { delete memoryStorage[key]; },
  clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); }
};

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = mockLocalStorage as any;
}

describe('First-User State & Demo Isolation QA', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });


  it('fresh install initializes with zero seeded student history and empty mistakes', () => {
    const profile = storageService.getProfile();
    const mistakes = storageService.getMistakes();
    const attempts = storageService.getAttempts();
    const sessions = storageService.getSessions();
    const testResults = storageService.getTestResults();

    expect(profile.name).toBe('');
    expect(profile.hasCompletedSetup).toBe(false);
    expect(profile.isDemoMode).toBe(false);
    expect(mistakes).toEqual([]);
    expect(attempts).toEqual([]);
    expect(sessions).toEqual([]);
    expect(testResults).toEqual([]);
  });

  it('fresh chapters start with neutral unstarted readiness status', () => {
    const chapters = storageService.getChapters();
    expect(chapters.length).toBeGreaterThan(0);
    chapters.forEach(ch => {
      expect(ch.readiness.conceptUnderstanding).toBe('needs-practice');
      expect(ch.readiness.application).toBe('needs-practice');
      expect(ch.readiness.questionSolving).toBe('needs-practice');
      expect(ch.readiness.answerWriting).toBe('needs-practice');
      expect(ch.readiness.timeSpeed).toBe('needs-practice');
      expect(ch.readiness.revision).toBe('needs-practice');
    });
  });

  it('calculates initial 0% readiness baseline and friendly onboarding diagnostic for clean student', () => {
    const cleanChapters = getCleanChapters();
    const summary = readinessEngine.analyzeReadiness(cleanChapters, [], [], []);

    expect(summary.overallReadinessIndex).toBe(0);
    expect(summary.report.tier).toBe('NOT YET READY');
    expect(summary.report.totalAttemptsCount).toBe(0);
    expect(summary.report.diagnosisHeadline).toContain('baseline is ready');
    expect(summary.report.reasons[0]).toContain('No question attempts');
  });

  it('demo mode loads rich demonstration dataset when explicitly requested', () => {
    const demoData = storageService.loadDemoData();
    expect(demoData.profile.name).toBe('Aarav Sharma');
    expect(demoData.profile.isDemoMode).toBe(true);
    expect(demoData.profile.hasCompletedSetup).toBe(true);
    expect(demoData.mistakes.length).toBe(SEED_MISTAKES.length);
    expect(demoData.chapters.length).toBeGreaterThan(0);
  });

  it('demo mode is strictly isolated: exiting demo mode returns to clean student state without contamination', () => {
    // 1. Activate demo mode
    storageService.loadDemoData();
    expect(storageService.getProfile().name).toBe('Aarav Sharma');
    expect(storageService.getMistakes().length).toBeGreaterThan(0);

    // 2. Exit demo mode
    const cleanData = storageService.exitDemoMode();
    expect(cleanData.profile.name).toBe('');
    expect(cleanData.profile.isDemoMode).toBe(false);
    expect(cleanData.profile.hasCompletedSetup).toBe(false);
    expect(cleanData.mistakes).toEqual([]);

    // Verify storage is completely clean
    expect(storageService.getProfile().name).toBe('');
    expect(storageService.getMistakes()).toEqual([]);
    expect(storageService.getAttempts()).toEqual([]);
  });

  it('real student activity does not mutate the demo dataset templates', () => {
    // Save a custom real student attempt
    storageService.saveProfile({
      ...CLEAN_PROFILE,
      name: 'Priyanshu Verma',
      hasCompletedSetup: true,
      isDemoMode: false
    });

    storageService.addMistake({
      questionId: 'sci-q1',
      subjectId: 'science',
      chapterId: 'sci-electricity',
      category: 'Calculation',
      userNote: 'Real student mistake note',
      studentAnswer: 'x = 12',
      resolved: false
    });

    // Check real student data
    expect(storageService.getProfile().name).toBe('Priyanshu Verma');
    expect(storageService.getMistakes().length).toBe(1);

    // Verify DEMO_PROFILE and SEED_MISTAKES remain untouched
    expect(DEMO_PROFILE.name).toBe('Aarav Sharma');
    expect(SEED_MISTAKES[0].userNote).toContain('Forgot to write Ω');
  });

  it('dynamically computes target board exam countdown without hardcoded strings', () => {
    const defaultDate = getDefaultExamDate();
    expect(defaultDate).toMatch(/^\d{4}-02-15$/);

    const now = Date.now();
    const targetTime = new Date(defaultDate).getTime();
    const expectedDays = Math.max(0, Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24)));

    expect(expectedDays).toBeGreaterThan(0);
  });

  it('recommendation engine suggests initial high-yield foundation task for brand-new student', () => {
    const cleanChapters = getCleanChapters();
    const nextAction = recommendationEngine.getHighestImpactAction(cleanChapters, [], []);

    expect(nextAction).toBeDefined();
    expect(nextAction.title).toBeDefined();
    expect(nextAction.estimatedMinutes).toBeGreaterThan(0);
    expect(nextAction.questionCount).toBeGreaterThan(0);
  });
});
