import { AdaptiveRecommendation, Chapter, MistakeEntry, Question, QuestionAttempt, SubjectId } from '../types';
import { DEMO_QUESTIONS } from '../data/questionsData';
import { INITIAL_CHAPTERS } from '../data/subjectsData';

export const adaptiveQuestionEngine = {
  selectNextAdaptiveQuestion(
    questions: Question[] = DEMO_QUESTIONS,
    chapters: Chapter[] = INITIAL_CHAPTERS,
    attempts: QuestionAttempt[] = [],
    mistakes: MistakeEntry[] = [],
    subjectFilter?: SubjectId
  ): AdaptiveRecommendation {
    const rawQuestions = (questions && questions.length > 0) ? questions : DEMO_QUESTIONS;
    const rawChapters = (chapters && chapters.length > 0) ? chapters : INITIAL_CHAPTERS;

    const candidateQuestions = subjectFilter 
      ? rawQuestions.filter(q => q.subjectId === subjectFilter) 
      : rawQuestions;

    const availablePool = candidateQuestions.length > 0 ? candidateQuestions : rawQuestions;
    const fallbackQ = availablePool[0] || DEMO_QUESTIONS[0];
    const fallbackCh = rawChapters[0] || INITIAL_CHAPTERS[0];

    // Helper to find chapter
    const getChapter = (chapterId: string) => rawChapters.find(c => c.id === chapterId) || fallbackCh;

    // Priority 1: Repeated Unresolved Mistakes
    const mistakeCounts: Record<string, { count: number; mistake: MistakeEntry }> = {};
    mistakes.filter(m => !m.resolved).forEach(m => {
      if (!mistakeCounts[m.questionId]) {
        mistakeCounts[m.questionId] = { count: 0, mistake: m };
      }
      mistakeCounts[m.questionId].count++;
    });

    const repeatedMistakeEntry = Object.values(mistakeCounts).find(item => item.count >= 2);
    if (repeatedMistakeEntry) {
      const q = availablePool.find(item => item.id === repeatedMistakeEntry.mistake.questionId) || fallbackQ;
      const ch = getChapter(q.chapterId);
      return {
        reasonPriority: 'repeated-mistake',
        explanation: `Repeated issue identified: ${repeatedMistakeEntry.count} unresolved "${repeatedMistakeEntry.mistake.category}" mistakes recorded in ${ch.name}. Re-attempting this question with step-by-step clarity will stop persistent mark loss.`,
        question: q,
        chapter: ch,
        dimensionTested: 'questionSolving',
        suggestedAction: 'Practice with Progressive Hints'
      };
    }

    // Priority 2: Weakest Skill Dimension (e.g. Concept strong, Application weak -> Case-Based)
    const weakAppChapter = rawChapters.find(c => c.readiness.application === 'weak' && (!subjectFilter || c.subjectId === subjectFilter));
    if (weakAppChapter) {
      const caseQ = availablePool.find(q => q.chapterId === weakAppChapter.id && q.type === 'case-based')
        || availablePool.find(q => q.chapterId === weakAppChapter.id)
        || fallbackQ;

      return {
        reasonPriority: 'weakest-dimension',
        explanation: `Your concept understanding is established, but your application score is weak. We picked this case-based scenario to train information filtering without getting overwhelmed.`,
        question: caseQ,
        chapter: getChapter(caseQ.chapterId),
        dimensionTested: 'application',
        suggestedAction: 'Practice Case-Based Scenario'
      };
    }

    // Priority 3: Weak Question Type (lowest accuracy across recent attempts)
    if (attempts.length >= 2) {
      const typeStats: Record<string, { correct: number; total: number }> = {};
      attempts.forEach(a => {
        if (!typeStats[a.questionType]) typeStats[a.questionType] = { correct: 0, total: 0 };
        typeStats[a.questionType].total++;
        if (a.isCorrect) typeStats[a.questionType].correct++;
      });

      const weakestTypeEntry = Object.entries(typeStats)
        .map(([type, stats]) => ({ type, accuracy: stats.correct / stats.total }))
        .sort((a, b) => a.accuracy - b.accuracy)[0];

      if (weakestTypeEntry && weakestTypeEntry.accuracy < 0.6) {
        const typeQ = availablePool.find(q => q.type === weakestTypeEntry.type) || fallbackQ;
        return {
          reasonPriority: 'weak-question-type',
          explanation: `Your accuracy on ${weakestTypeEntry.type.replace('-', ' ')} questions is ${Math.round(weakestTypeEntry.accuracy * 100)}%. Targeting this specific question format prevents board score leakage.`,
          question: typeQ,
          chapter: getChapter(typeQ.chapterId),
          dimensionTested: 'questionSolving',
          suggestedAction: `Practice ${typeQ.type.toUpperCase()}`
        };
      }
    }

    // Priority 4: Dynamic Difficulty Calibration based on recent performance
    if (attempts.length > 0) {
      const lastAttempt = attempts[0];
      if (lastAttempt.isCorrect) {
        // Upgrade to Hard difficulty for stretch clarity
        const hardQ = availablePool.find(q => q.difficulty === 'Hard') || fallbackQ;
        return {
          reasonPriority: 'appropriate-difficulty',
          explanation: 'Your last attempt was accurate! Moving you up to a High-Order Thinking (Hard) board problem to cement mastery.',
          question: hardQ,
          chapter: getChapter(hardQ.chapterId),
          dimensionTested: 'application',
          suggestedAction: 'High-Order Thinking Challenge'
        };
      } else {
        // Provide targeted remediation with progressive hints
        const mediumQ = availablePool.find(q => q.id === lastAttempt.questionId)
          || availablePool.find(q => q.difficulty === 'Medium')
          || fallbackQ;
        return {
          reasonPriority: 'recent-performance',
          explanation: `Let's dissect the last concept where an error occurred (${lastAttempt.topic}). Use the 4 progressive hints to systematically build the solution.`,
          question: mediumQ,
          chapter: getChapter(mediumQ.chapterId),
          dimensionTested: 'conceptUnderstanding',
          suggestedAction: 'Remediation with Progressive Hints'
        };
      }
    }

    // Priority 5: Default High-Yield Foundation Question
    return {
      reasonPriority: 'appropriate-difficulty',
      explanation: 'Starting with high-weightage CBSE board question. Read carefully and unlock hints step-by-step if stuck.',
      question: fallbackQ,
      chapter: getChapter(fallbackQ.chapterId),
      dimensionTested: 'conceptUnderstanding',
      suggestedAction: 'Initial Clarity Practice'
    };
  }
};
