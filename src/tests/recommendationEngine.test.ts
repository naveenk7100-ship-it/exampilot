import { describe, it, expect } from 'vitest';
import { recommendationEngine } from '../services/recommendationEngine';
import { INITIAL_CHAPTERS } from '../data/subjectsData';
import { MistakeEntry } from '../types';

describe('Recommendation Engine (Study Plan & Next Actions)', () => {
  it('generates max 3 priority daily recommended tasks with required schema', () => {
    const tasks = recommendationEngine.getDailyRecommendedTasks(INITIAL_CHAPTERS, [], []);
    expect(tasks.length).toBeLessThanOrEqual(3);
    expect(tasks.length).toBeGreaterThan(0);

    tasks.forEach(t => {
      expect(t.id).toBeDefined();
      expect(t.title).toBeDefined();
      expect(t.subjectId).toBeDefined();
      expect(t.chapterId).toBeDefined();
      expect(t.chapterName).toBeDefined();
      expect(t.skillTested).toBeDefined();
      expect(t.reason).toBeDefined();
      expect(t.estimatedMinutes).toBeGreaterThan(0);
      expect(t.questionCount).toBeGreaterThan(0);
      expect(t.expectedOutcome).toBeDefined();
    });
  });

  it('prioritizes unresolved repeated mistakes in a specific chapter', () => {
    const repeatedMistakes: MistakeEntry[] = [
      {
        id: 'm1',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        category: 'Missing unit',
        timestamp: Date.now() - 5000,
        attemptNumber: 1,
        resolved: false
      },
      {
        id: 'm2',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        category: 'Missing unit',
        timestamp: Date.now(),
        attemptNumber: 2,
        resolved: false
      }
    ];

    const action = recommendationEngine.getHighestImpactAction(INITIAL_CHAPTERS, repeatedMistakes, []);
    expect(action.chapterId).toBe('sci-electricity');
    expect(action.actionType).toBe('mistake-remedy');
    expect(action.reason).toContain('repeated "Missing unit" mistakes recorded');
  });

  it('handles edge case: zero attempts, zero mistakes, default high-yield action', () => {
    const action = recommendationEngine.getHighestImpactAction(INITIAL_CHAPTERS, [], []);
    expect(action).toBeDefined();
    expect(action.estimatedMinutes).toBeGreaterThan(0);
    expect(action.questionCount).toBeGreaterThan(0);
  });
});
