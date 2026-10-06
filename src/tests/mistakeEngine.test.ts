import { describe, it, expect } from 'vitest';
import { mistakeEngine } from '../services/mistakeEngine';
import { MistakeEntry, Question } from '../types';
import { DEMO_QUESTIONS } from '../data/questionsData';

describe('Mistake Engine', () => {
  const numericalQuestion: Question = DEMO_QUESTIONS.find(q => q.type === 'numerical' || q.type === 'case-based') || DEMO_QUESTIONS[0];

  it('classifies time issue when solving time exceeds 2.2x threshold', () => {
    const category = mistakeEngine.autoClassifyMistake(
      numericalQuestion,
      'Req = 6 ohm',
      false,
      undefined,
      numericalQuestion.estimatedSolvingTime * 2.5
    );
    expect(category).toBe('Time issue');
  });

  it('classifies missing unit for numerical questions with numbers but no SI unit', () => {
    const category = mistakeEngine.autoClassifyMistake(
      numericalQuestion,
      'The equivalent resistance is 12 and the current is 2',
      false,
      undefined,
      60
    );
    expect(category).toBe('Missing unit');
  });

  it('classifies incomplete answer when response is too short for a 3-mark question', () => {
    const threeMarkQuestion = DEMO_QUESTIONS.find(q => q.marks >= 3 && q.type === 'short-answer') || numericalQuestion;
    const category = mistakeEngine.autoClassifyMistake(
      threeMarkQuestion,
      'It creates unity.',
      false,
      undefined,
      60
    );
    expect(category).toBe('Incomplete answer');
  });

  it('detects repeated same mistakes in a chapter and generates diagnosis', () => {
    const mistakes: MistakeEntry[] = [
      {
        id: 'm1',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        category: 'Calculation',
        timestamp: Date.now() - 5000,
        attemptNumber: 1,
        resolved: false
      },
      {
        id: 'm2',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        category: 'Calculation',
        timestamp: Date.now() - 2000,
        attemptNumber: 2,
        resolved: false
      },
      {
        id: 'm3',
        questionId: 'sci-q1',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        category: 'Calculation',
        timestamp: Date.now(),
        attemptNumber: 3,
        resolved: false
      }
    ];

    const analysis = mistakeEngine.analyzePatterns(mistakes);
    expect(analysis.totalMistakes).toBe(3);
    expect(analysis.unresolvedCount).toBe(3);
    expect(analysis.primaryPitfall?.category).toBe('Calculation');
    expect(analysis.chapterSpecificPatterns.length).toBeGreaterThan(0);
    expect(analysis.chapterSpecificPatterns[0].diagnosis).toContain('calculation accuracy');
  });

  it('handles edge case: zero mistakes gracefully', () => {
    const analysis = mistakeEngine.analyzePatterns([]);
    expect(analysis.totalMistakes).toBe(0);
    expect(analysis.unresolvedCount).toBe(0);
    expect(analysis.patterns.length).toBe(0);
    expect(analysis.chapterSpecificPatterns.length).toBe(0);
    expect(analysis.insights.length).toBeGreaterThan(0);
  });
});
