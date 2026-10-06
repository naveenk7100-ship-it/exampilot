import { describe, it, expect } from 'vitest';
import { adaptiveQuestionEngine } from '../services/adaptiveQuestionEngine';
import { DEMO_QUESTIONS } from '../data/questionsData';
import { INITIAL_CHAPTERS } from '../data/subjectsData';
import { MistakeEntry, QuestionAttempt, Chapter } from '../types';

describe('Adaptive Question Engine', () => {
  it('Priority 1: Selects repeated unresolved mistakes first', () => {
    const repeatedMistakes: MistakeEntry[] = [
      {
        id: 'm1',
        questionId: 'sci-q2',
        subjectId: 'science',
        chapterId: 'sci-light',
        category: 'Wrong method',
        timestamp: Date.now() - 10000,
        attemptNumber: 1,
        resolved: false
      },
      {
        id: 'm2',
        questionId: 'sci-q2',
        subjectId: 'science',
        chapterId: 'sci-light',
        category: 'Wrong method',
        timestamp: Date.now(),
        attemptNumber: 2,
        resolved: false
      }
    ];

    const recommendation = adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      DEMO_QUESTIONS,
      INITIAL_CHAPTERS,
      [],
      repeatedMistakes
    );

    expect(recommendation.reasonPriority).toBe('repeated-mistake');
    expect(recommendation.question.id).toBe('sci-q2');
    expect(recommendation.explanation).toContain('Repeated issue identified');
  });

  it('Priority 2: Targets weakest skill dimension (e.g. weak application -> case-based question)', () => {
    const modifiedChapters = INITIAL_CHAPTERS.map(ch => {
      if (ch.id === 'sci-electricity') {
        return {
          ...ch,
          readiness: {
            ...ch.readiness,
            conceptUnderstanding: 'strong' as const,
            application: 'weak' as const
          }
        };
      }
      return ch;
    });

    const recommendation = adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      DEMO_QUESTIONS,
      modifiedChapters,
      [],
      [],
      'science'
    );

    expect(recommendation.reasonPriority).toBe('weakest-dimension');
    expect(recommendation.dimensionTested).toBe('application');
    expect(recommendation.explanation).toContain('application score is weak');
  });

  it('Priority 3: Targets weak question type when accuracy is below 60%', () => {
    // Chapters with solid application readiness so Priority 2 does not overshadow Priority 3
    const strongAppChapters: Chapter[] = INITIAL_CHAPTERS.map(ch => ({
      ...ch,
      readiness: {
        ...ch.readiness,
        application: 'strong' as const
      }
    }));

    const attemptsWithWeakAR: QuestionAttempt[] = [
      {
        id: 'att-1',
        questionId: 'math-q1',
        subjectId: 'mathematics',
        chapterId: 'math-quadratic-equations',
        topic: 'Fundamental Theorem of Arithmetic',
        questionType: 'assertion-reason',
        difficulty: 'Medium',
        isCorrect: false,
        scoreAchieved: 0,
        maxScore: 1,
        timeSpentSeconds: 45,
        expectedTimeSeconds: 60,
        hintsUsedCount: 0,
        timestamp: Date.now() - 5000
      },
      {
        id: 'att-2',
        questionId: 'math-q1',
        subjectId: 'mathematics',
        chapterId: 'math-quadratic-equations',
        topic: 'Fundamental Theorem of Arithmetic',
        questionType: 'assertion-reason',
        difficulty: 'Medium',
        isCorrect: false,
        scoreAchieved: 0,
        maxScore: 1,
        timeSpentSeconds: 50,
        expectedTimeSeconds: 60,
        hintsUsedCount: 0,
        timestamp: Date.now()
      }
    ];

    const recommendation = adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      DEMO_QUESTIONS,
      strongAppChapters,
      attemptsWithWeakAR,
      [],
      'mathematics'
    );

    expect(recommendation.reasonPriority).toBe('weak-question-type');
    expect(recommendation.question.type).toBe('assertion-reason');
  });

  it('handles edge case: zero attempts and zero mistakes', () => {
    const recommendation = adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      DEMO_QUESTIONS,
      INITIAL_CHAPTERS,
      [],
      []
    );

    expect(recommendation).toBeDefined();
    expect(recommendation.question).toBeDefined();
    expect(recommendation.explanation).toBeDefined();
  });

  it('handles edge case: empty questions and chapters pool fallback', () => {
    const recommendation = adaptiveQuestionEngine.selectNextAdaptiveQuestion(
      [],
      [],
      [],
      []
    );

    expect(recommendation).toBeDefined();
    expect(recommendation.question).toBeDefined();
    expect(recommendation.chapter).toBeDefined();
  });
});
