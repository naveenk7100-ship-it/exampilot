import { Chapter, ExamReadinessReport, ExamReadinessTier, MistakeEntry, QuestionAttempt, ReadinessDimensions, ReadinessStatus, StudySession, SubjectId } from '../types';

export interface DimensionMetric {
  name: string;
  key: keyof Chapter['readiness'];
  strongCount: number;
  needsPracticeCount: number;
  weakCount: number;
  healthPercent: number; // 0-100
}

export interface ReadinessSummary {
  totalChapters: number;
  strongChapters: Chapter[];
  needsPracticeChapters: Chapter[];
  weakChapters: Chapter[];
  overallReadinessIndex: number;
  dimensionMetrics: DimensionMetric[];
  weakestDimension: DimensionMetric;
  strongestDimension: DimensionMetric;
  report: ExamReadinessReport;
  isDemo: boolean;
}

export const DIMENSION_CONFIG: { key: keyof Chapter['readiness']; name: string; weight: number }[] = [
  { key: 'conceptUnderstanding', name: 'Concept Understanding', weight: 0.20 },
  { key: 'application', name: 'Application & Scenarios', weight: 0.25 },
  { key: 'questionSolving', name: 'Question Solving Method', weight: 0.20 },
  { key: 'answerWriting', name: 'CBSE Answer Writing Format', weight: 0.15 },
  { key: 'timeSpeed', name: 'Time & Pacing', weight: 0.10 },
  { key: 'revision', name: 'Active Revision Status', weight: 0.10 }
];

export const readinessEngine = {
  // Evaluates a single chapter into strong / needs-practice / weak tier
  getChapterOverallTier(chapter: Chapter): ReadinessStatus {
    const statuses = Object.values(chapter.readiness);
    const strongCount = statuses.filter(s => s === 'strong').length;
    const weakCount = statuses.filter(s => s === 'weak').length;

    if (weakCount >= 2) return 'weak';
    if (strongCount >= 4 && weakCount === 0) return 'strong';
    return 'needs-practice';
  },

  // Calculate dynamic 6-dimension scores for a chapter from actual attempts, mistakes, and sessions
  computeDynamicChapterReadiness(
    chapter: Chapter,
    attempts: QuestionAttempt[],
    mistakes: MistakeEntry[],
    sessions: StudySession[]
  ): ReadinessDimensions {
    const chapterAttempts = attempts.filter(a => a.chapterId === chapter.id);
    const chapterMistakes = mistakes.filter(m => m.chapterId === chapter.id);
    const chapterSessions = sessions.filter(s => s.chapterId === chapter.id);

    // If no live attempts exist for this chapter, keep the baseline
    if (chapterAttempts.length === 0 && chapterMistakes.length === 0 && chapterSessions.length === 0) {
      return chapter.readiness;
    }

    // 1. Concept Understanding
    // Derived from MCQs, Assertion-Reason questions, Easy difficulty attempts, and Hint 1/2 reliance
    const conceptAttempts = chapterAttempts.filter(a => 
      ['mcq', 'assertion-reason'].includes(a.questionType) || a.difficulty === 'Easy'
    );
    let conceptScore = 70; // baseline
    if (conceptAttempts.length > 0) {
      const correct = conceptAttempts.filter(a => a.isCorrect).length;
      const hintPenalty = conceptAttempts.reduce((acc, a) => acc + (a.hintsUsedCount >= 2 ? 10 : 0), 0) / conceptAttempts.length;
      conceptScore = Math.max(0, Math.min(100, Math.round((correct / conceptAttempts.length) * 100 - hintPenalty)));
    }
    const conceptMistakes = chapterMistakes.filter(m => m.category === 'Concept' && !m.resolved).length;
    if (conceptMistakes > 0) conceptScore = Math.max(20, conceptScore - (conceptMistakes * 15));

    // 2. Application
    // Derived from Case-based, Scenario questions, Hard difficulty questions
    const appAttempts = chapterAttempts.filter(a => a.questionType === 'case-based' || a.difficulty === 'Hard');
    let appScore = 55;
    if (appAttempts.length > 0) {
      const earned = appAttempts.reduce((acc, a) => acc + a.scoreAchieved, 0);
      const total = appAttempts.reduce((acc, a) => acc + a.maxScore, 0);
      appScore = total > 0 ? Math.round((earned / total) * 100) : 55;
    }
    const appMistakes = chapterMistakes.filter(m => ['Misread question', 'Wrong method'].includes(m.category) && !m.resolved).length;
    if (appMistakes > 0) appScore = Math.max(20, appScore - (appMistakes * 12));

    // 3. Question Solving
    // Derived from Numerical, Short/Long problems, step accuracy, Hint 3/4 reliance
    const solvingAttempts = chapterAttempts.filter(a => ['numerical', 'short-answer', 'long-answer'].includes(a.questionType));
    let solvingScore = 65;
    if (solvingAttempts.length > 0) {
      const earned = solvingAttempts.reduce((acc, a) => acc + a.scoreAchieved, 0);
      const total = solvingAttempts.reduce((acc, a) => acc + a.maxScore, 0);
      const hintPenalty = solvingAttempts.reduce((acc, a) => acc + (a.hintsUsedCount >= 3 ? 15 : 0), 0) / solvingAttempts.length;
      solvingScore = total > 0 ? Math.max(0, Math.min(100, Math.round((earned / total) * 100 - hintPenalty))) : 65;
    }
    const calcMistakes = chapterMistakes.filter(m => m.category === 'Calculation' && !m.resolved).length;
    if (calcMistakes > 0) solvingScore = Math.max(20, solvingScore - (calcMistakes * 12));

    // 4. Answer Writing
    // Derived from Subjective rubric scores, missing unit penalties, poor answer structure mistakes
    const writingAttempts = chapterAttempts.filter(a => ['short-answer', 'long-answer', 'case-based'].includes(a.questionType));
    let writingScore = 65;
    if (writingAttempts.length > 0) {
      const earned = writingAttempts.reduce((acc, a) => acc + a.scoreAchieved, 0);
      const total = writingAttempts.reduce((acc, a) => acc + a.maxScore, 0);
      writingScore = total > 0 ? Math.round((earned / total) * 100) : 65;
    }
    const writingMistakes = chapterMistakes.filter(m => ['Missing unit', 'Poor answer structure', 'Incomplete answer'].includes(m.category) && !m.resolved).length;
    if (writingMistakes > 0) writingScore = Math.max(20, writingScore - (writingMistakes * 15));

    // 5. Time & Speed
    // Derived from timeSpent vs expectedTime
    let timeScore = 75;
    if (chapterAttempts.length > 0) {
      let speedPoints = 0;
      chapterAttempts.forEach(a => {
        const ratio = a.expectedTimeSeconds > 0 ? a.timeSpentSeconds / a.expectedTimeSeconds : 1.0;
        if (ratio <= 1.1) speedPoints += 100;
        else if (ratio <= 1.5) speedPoints += 65;
        else speedPoints += 30;
      });
      timeScore = Math.round(speedPoints / chapterAttempts.length);
    }
    const timeMistakes = chapterMistakes.filter(m => m.category === 'Time issue' && !m.resolved).length;
    if (timeMistakes > 0) timeScore = Math.max(25, timeScore - (timeMistakes * 20));

    // 6. Active Revision
    // Derived from recent revision sessions and resolved mistake ratio
    let revisionScore = 50;
    const hasRecentSession = chapterSessions.some(s => s.completedAt > Date.now() - (1000 * 60 * 60 * 24 * 7));
    if (hasRecentSession) revisionScore += 30;
    if (chapterMistakes.length > 0) {
      const resolvedCount = chapterMistakes.filter(m => m.resolved).length;
      revisionScore += Math.round((resolvedCount / chapterMistakes.length) * 20);
    }
    revisionScore = Math.min(100, revisionScore);

    const toTier = (score: number): ReadinessStatus => {
      if (score >= 75) return 'strong';
      if (score >= 50) return 'needs-practice';
      return 'weak';
    };

    return {
      conceptUnderstanding: toTier(conceptScore),
      application: toTier(appScore),
      questionSolving: toTier(solvingScore),
      answerWriting: toTier(writingScore),
      timeSpeed: toTier(timeScore),
      revision: toTier(revisionScore)
    };
  },

  // Numerical score for single chapter based on weights (0-100)
  calculateChapterScore(chapter: Chapter): number {
    let score = 0;
    DIMENSION_CONFIG.forEach(({ key, weight }) => {
      const val = chapter.readiness[key];
      const points = val === 'strong' ? 100 : val === 'needs-practice' ? 60 : 25;
      score += points * weight;
    });
    return Math.round(score);
  },

  // Complete analysis across all chapters with live student attempt history
  analyzeReadiness(
    chapters: Chapter[],
    attempts: QuestionAttempt[] = [],
    mistakes: MistakeEntry[] = [],
    sessions: StudySession[] = [],
    subjectFilter?: SubjectId
  ): ReadinessSummary {
    const isDemo = attempts.length === 0;
    const list = subjectFilter ? chapters.filter(c => c.subjectId === subjectFilter) : chapters;

    // Compute dynamic readiness per chapter if real attempts exist
    const processedChapters = list.map(ch => {
      if (!isDemo) {
        const dynamicReadiness = this.computeDynamicChapterReadiness(ch, attempts, mistakes, sessions);
        return { ...ch, readiness: dynamicReadiness };
      }
      return ch;
    });

    const strongChapters: Chapter[] = [];
    const needsPracticeChapters: Chapter[] = [];
    const weakChapters: Chapter[] = [];

    processedChapters.forEach(ch => {
      const tier = this.getChapterOverallTier(ch);
      if (tier === 'strong') strongChapters.push(ch);
      else if (tier === 'weak') weakChapters.push(ch);
      else needsPracticeChapters.push(ch);
    });

    // Dimension level metrics
    const dimensionMetrics: DimensionMetric[] = DIMENSION_CONFIG.map(dim => {
      let strong = 0;
      let needsPractice = 0;
      let weak = 0;

      processedChapters.forEach(ch => {
        const val = ch.readiness[dim.key];
        if (val === 'strong') strong++;
        else if (val === 'needs-practice') needsPractice++;
        else weak++;
      });

      const total = processedChapters.length || 1;
      const healthPercent = Math.round(((strong * 100) + (needsPractice * 60) + (weak * 20)) / (total * 100) * 100);

      return {
        name: dim.name,
        key: dim.key,
        strongCount: strong,
        needsPracticeCount: needsPractice,
        weakCount: weak,
        healthPercent
      };
    });

    const sortedDimensions = [...dimensionMetrics].sort((a, b) => a.healthPercent - b.healthPercent);
    const weakestDimension = sortedDimensions[0] || dimensionMetrics[0];
    const strongestDimension = sortedDimensions[sortedDimensions.length - 1] || dimensionMetrics[0];

    // Multidimensional overall index
    const isCleanStudent = attempts.length === 0 && mistakes.length === 0 && sessions.length === 0;
    const totalScoreSum = processedChapters.reduce((acc, ch) => acc + this.calculateChapterScore(ch), 0);
    const overallReadinessIndex = isCleanStudent 
      ? 0 
      : (processedChapters.length > 0 ? Math.round(totalScoreSum / processedChapters.length) : 0);

    // Compute Diagnostic Report & Tier (READY / ALMOST READY / NOT YET READY)
    let tier: ExamReadinessTier = 'NOT YET READY';
    if (overallReadinessIndex >= 80) tier = 'READY';
    else if (overallReadinessIndex >= 60) tier = 'ALMOST READY';

    const getDimScore = (key: keyof Chapter['readiness']) => {
      return dimensionMetrics.find(d => d.key === key)?.healthPercent || (isCleanStudent ? 0 : 50);
    };

    const conceptScorePercent = isCleanStudent ? 0 : getDimScore('conceptUnderstanding');
    const applicationScorePercent = isCleanStudent ? 0 : getDimScore('application');
    const solvingScorePercent = isCleanStudent ? 0 : getDimScore('questionSolving');
    const writingScorePercent = isCleanStudent ? 0 : getDimScore('answerWriting');
    const timeSpeedScorePercent = isCleanStudent ? 0 : getDimScore('timeSpeed');
    const revisionScorePercent = isCleanStudent ? 0 : getDimScore('revision');

    const reasons: string[] = [];
    if (isCleanStudent) {
      reasons.push('No question attempts recorded yet.');
      reasons.push('Solve CBSE board questions to calibrate your 6-dimension readiness index.');
      reasons.push('Mistakes, pacing, and step-by-step scoring will be tracked automatically.');
    } else {
      if (conceptScorePercent >= 75) {
        reasons.push('Concept knowledge is strong and accurate across syllabus theorems.');
      } else {
        reasons.push(`Concept understanding needs fortification (${conceptScorePercent}%).`);
      }

      if (applicationScorePercent < 70) {
        reasons.push(`Application accuracy in case-based and scenario questions is currently ${applicationScorePercent}%.`);
      }

      if (writingScorePercent < 70) {
        reasons.push(`Answer writing structure and unit conventions are at ${writingScorePercent}%.`);
      }

      if (timeSpeedScorePercent < 70) {
        reasons.push(`Time pacing needs calibration (${timeSpeedScorePercent}% optimal pacing).`);
      }
    }

    const diagnosisHeadline = isCleanStudent
      ? 'Welcome to ExamPilot! Your baseline is ready. Solve practice problems or take a mock test to calibrate your 6-dimension readiness.'
      : tier === 'READY'
      ? 'Comprehensive board exam clarity achieved across multiple question formats.'
      : tier === 'ALMOST READY'
      ? `Concept baseline is established, but ${weakestDimension.name.toLowerCase()} is capping your score potential.`
      : `Mark barriers identified in ${weakestDimension.name.toLowerCase()}. Focus on structured thinking before attempting full mock exams.`;

    const highestImpactImprovement = isCleanStudent
      ? 'Start with high-yield Practice questions in Mathematics or Science.'
      : `Your highest-impact improvement is ${weakestDimension.name.toLowerCase()} practice.`;

    const report: ExamReadinessReport = {
      tier,
      overallScorePercent: overallReadinessIndex,
      conceptScorePercent,
      applicationScorePercent,
      solvingScorePercent,
      writingScorePercent,
      timeSpeedScorePercent,
      revisionScorePercent,
      diagnosisHeadline,
      reasons,
      highestImpactImprovement,
      isDemo: false,
      totalAttemptsCount: attempts.length
    };


    return {
      totalChapters: processedChapters.length,
      strongChapters,
      needsPracticeChapters,
      weakChapters,
      overallReadinessIndex,
      dimensionMetrics,
      weakestDimension,
      strongestDimension,
      report,
      isDemo
    };
  },

  getStatusBadgeStyle(status: ReadinessStatus): { bg: string; text: string; border: string; label: string } {
    switch (status) {
      case 'strong':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          label: 'Strong'
        };
      case 'needs-practice':
        return {
          bg: 'bg-amber-500/10 text-amber-400',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          label: 'Needs Practice'
        };
      case 'weak':
        return {
          bg: 'bg-rose-500/10 text-rose-400',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          label: 'Weak'
        };
    }
  }
};
