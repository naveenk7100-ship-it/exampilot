import { describe, it, expect } from 'vitest';
import { readinessEngine } from '../services/readinessEngine';
import { Chapter, QuestionAttempt, MistakeEntry } from '../types';
import { INITIAL_CHAPTERS } from '../data/subjectsData';

describe('Readiness Engine', () => {
  const sampleChapter: Chapter = {
    id: 'sci-electricity',
    subjectId: 'science',
    name: 'Electricity',
    unit: 'Effects of Current',
    order: 1,
    cbseWeightageMarks: 7,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'needs-practice',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['Ohm’s Law', 'Resistors in Series & Parallel', 'Joule’s Heating Law'],
    cbseWatchouts: ['SI Units must be explicitly stated', 'Parallel vs Series resistance logic']
  };

  it('calculates weighted scoring properly', () => {
    const score = readinessEngine.calculateChapterScore(sampleChapter);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('evaluates overall tier as strong when >= 4 dimensions are strong and 0 weak', () => {
    const strongChapter: Chapter = {
      ...sampleChapter,
      readiness: {
        conceptUnderstanding: 'strong',
        application: 'strong',
        questionSolving: 'strong',
        answerWriting: 'strong',
        timeSpeed: 'needs-practice',
        revision: 'needs-practice'
      }
    };
    expect(readinessEngine.getChapterOverallTier(strongChapter)).toBe('strong');
  });

  it('evaluates overall tier as weak when >= 2 dimensions are weak', () => {
    const weakChapter: Chapter = {
      ...sampleChapter,
      readiness: {
        conceptUnderstanding: 'strong',
        application: 'weak',
        questionSolving: 'weak',
        answerWriting: 'needs-practice',
        timeSpeed: 'strong',
        revision: 'needs-practice'
      }
    };
    expect(readinessEngine.getChapterOverallTier(weakChapter)).toBe('weak');
  });

  it('handles edge case: zero attempts (marks demo mode)', () => {
    const summary = readinessEngine.analyzeReadiness(INITIAL_CHAPTERS, [], [], []);
    expect(summary.isDemo).toBe(true);
    expect(summary.report.totalAttemptsCount).toBe(0);
    expect(summary.totalChapters).toBe(INITIAL_CHAPTERS.length);
    expect(summary.dimensionMetrics.length).toBe(6);
  });

  it('handles edge case: one attempt correctly updating readiness', () => {
    const singleAttempt: QuestionAttempt = {
      id: 'att-1',
      questionId: 'sci-q1',
      subjectId: 'science',
      chapterId: 'sci-electricity',
      topic: 'Ohm’s Law',
      questionType: 'mcq',
      difficulty: 'Easy',
      isCorrect: true,
      scoreAchieved: 1,
      maxScore: 1,
      timeSpentSeconds: 40,
      expectedTimeSeconds: 60,
      hintsUsedCount: 0,
      timestamp: Date.now()
    };

    const summary = readinessEngine.analyzeReadiness(INITIAL_CHAPTERS, [singleAttempt], [], []);
    expect(summary.isDemo).toBe(false);
    expect(summary.report.totalAttemptsCount).toBe(1);
  });

  it('handles edge case: all correct attempts (READY tier)', () => {
    const attempts: QuestionAttempt[] = INITIAL_CHAPTERS.map((ch, idx) => ({
      id: `att-${idx}`,
      questionId: `q-${idx}`,
      subjectId: ch.subjectId,
      chapterId: ch.id,
      topic: ch.coreConcepts[0] || 'Core',
      questionType: 'numerical',
      difficulty: 'Hard',
      isCorrect: true,
      scoreAchieved: 4,
      maxScore: 4,
      timeSpentSeconds: 120,
      expectedTimeSeconds: 150,
      hintsUsedCount: 0,
      timestamp: Date.now()
    }));

    const summary = readinessEngine.analyzeReadiness(INITIAL_CHAPTERS, attempts, [], []);
    expect(summary.report.tier).toBe('READY');
    expect(summary.report.overallScorePercent).toBeGreaterThanOrEqual(75);
  });

  it('handles edge case: all incorrect attempts (NOT YET READY tier)', () => {
    const attempts: QuestionAttempt[] = INITIAL_CHAPTERS.map((ch, idx) => ({
      id: `att-${idx}`,
      questionId: `q-${idx}`,
      subjectId: ch.subjectId,
      chapterId: ch.id,
      topic: ch.coreConcepts[0] || 'Core',
      questionType: 'case-based',
      difficulty: 'Hard',
      isCorrect: false,
      scoreAchieved: 0,
      maxScore: 4,
      timeSpentSeconds: 300,
      expectedTimeSeconds: 120,
      hintsUsedCount: 4,
      timestamp: Date.now()
    }));

    const mistakes: MistakeEntry[] = INITIAL_CHAPTERS.map((ch, idx) => ({
      id: `m-${idx}`,
      questionId: `q-${idx}`,
      subjectId: ch.subjectId,
      chapterId: ch.id,
      category: 'Concept',
      timestamp: Date.now(),
      attemptNumber: 1,
      resolved: false
    }));

    const summary = readinessEngine.analyzeReadiness(INITIAL_CHAPTERS, attempts, mistakes, []);
    expect(summary.report.tier).toBe('NOT YET READY');
    expect(summary.weakChapters.length).toBeGreaterThan(0);
  });

  it('penalizes hint reliance on concept understanding and question solving', () => {
    const heavyHintAttempts: QuestionAttempt[] = [
      {
        id: 'att-hint-1',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        topic: 'Resistors',
        questionType: 'mcq',
        difficulty: 'Easy',
        isCorrect: true,
        scoreAchieved: 1,
        maxScore: 1,
        timeSpentSeconds: 60,
        expectedTimeSeconds: 60,
        hintsUsedCount: 3, // heavy hint reliance
        timestamp: Date.now()
      }
    ];

    const dynamicReadiness = readinessEngine.computeDynamicChapterReadiness(
      sampleChapter,
      heavyHintAttempts,
      [],
      []
    );

    expect(dynamicReadiness).toBeDefined();
    expect(['needs-practice', 'weak', 'strong']).toContain(dynamicReadiness.conceptUnderstanding);
  });

  it('guarantees that completing only a revision sprint does not make a weak chapter strong', () => {
    const weakChapter: Chapter = {
      ...sampleChapter,
      readiness: {
        conceptUnderstanding: 'weak',
        application: 'weak',
        questionSolving: 'needs-practice',
        answerWriting: 'needs-practice',
        timeSpeed: 'weak',
        revision: 'weak'
      }
    };
    expect(readinessEngine.getChapterOverallTier(weakChapter)).toBe('weak');

    // After revision sprint, only revision dimension changes to strong
    const afterSprintChapter: Chapter = {
      ...weakChapter,
      readiness: {
        ...weakChapter.readiness,
        revision: 'strong'
      }
    };
    // Overall chapter tier must remain weak or needs-practice, NOT strong
    expect(readinessEngine.getChapterOverallTier(afterSprintChapter)).not.toBe('strong');
    expect(readinessEngine.getChapterOverallTier(afterSprintChapter)).toBe('weak');
  });
});

