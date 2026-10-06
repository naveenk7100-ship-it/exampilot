import { Chapter, MistakeEntry, QuestionAttempt, SmartNextAction } from '../types';
import { DEMO_QUESTIONS } from '../data/questionsData';

export const recommendationEngine = {
  getHighestImpactAction(
    chapters: Chapter[],
    mistakes: MistakeEntry[] = [],
    _attempts: QuestionAttempt[] = []
  ): SmartNextAction {
    // 1. Priority 1: Unresolved repeated mistakes in a specific chapter
    const chapterMistakeCounts: Record<string, { count: number; mistake: MistakeEntry }> = {};
    mistakes.filter(m => !m.resolved).forEach(m => {
      if (!chapterMistakeCounts[m.chapterId]) {
        chapterMistakeCounts[m.chapterId] = { count: 0, mistake: m };
      }
      chapterMistakeCounts[m.chapterId].count++;
    });

    const repeatedEntry = Object.values(chapterMistakeCounts).find(e => e.count >= 2);
    if (repeatedEntry) {
      const ch = chapters.find(c => c.id === repeatedEntry.mistake.chapterId) || chapters[0];
      const targetQ = DEMO_QUESTIONS.find(q => q.id === repeatedEntry.mistake.questionId)
        || DEMO_QUESTIONS.find(q => q.chapterId === ch.id)
        || DEMO_QUESTIONS[0];

      return {
        id: `act-repeated-${ch.id}`,
        title: `${ch.name} — ${repeatedEntry.mistake.category} Remediation`,
        subjectId: ch.subjectId,
        chapterId: ch.id,
        chapterName: ch.name,
        skillTested: 'questionSolving',
        reason: `${repeatedEntry.count} repeated "${repeatedEntry.mistake.category}" mistakes recorded. Eliminating this specific blunder prevents 2-4 lost marks in board exams.`,
        actionType: 'mistake-remedy',
        targetQuestionId: targetQ.id,
        estimatedMinutes: 12,
        questionCount: 2,
        expectedOutcome: 'Fix recurring calculation or method traps through step-by-step verification.',
        priorityScore: 99
      };
    }

    // 2. Priority 2: Weak Application / Case-Based dimension
    const weakAppChapter = chapters.find(c => c.readiness.application === 'weak');
    if (weakAppChapter) {
      const targetQ = DEMO_QUESTIONS.find(q => q.chapterId === weakAppChapter.id && q.type === 'case-based')
        || DEMO_QUESTIONS.find(q => q.chapterId === weakAppChapter.id)
        || DEMO_QUESTIONS[0];

      return {
        id: `act-weak-app-${weakAppChapter.id}`,
        title: `${weakAppChapter.name} — Application & Scenarios`,
        subjectId: weakAppChapter.subjectId,
        chapterId: weakAppChapter.id,
        chapterName: weakAppChapter.name,
        skillTested: 'application',
        reason: `Your concept understanding in ${weakAppChapter.name} is solid, but application accuracy is low. Practice case-based questions to learn information filtering.`,
        actionType: 'case-based',
        targetQuestionId: targetQ.id,
        estimatedMinutes: 15,
        questionCount: 3,
        expectedOutcome: 'Confidently extract variables from wordy case scenarios without hesitation.',
        priorityScore: 95
      };
    }

    // 3. Priority 3: Weak Answer Writing Structure
    const weakWriting = chapters.find(c => c.readiness.answerWriting === 'weak');
    if (weakWriting) {
      const targetQ = DEMO_QUESTIONS.find(q => q.chapterId === weakWriting.id && (q.type === 'short-answer' || q.type === 'long-answer'))
        || DEMO_QUESTIONS.find(q => q.chapterId === weakWriting.id)
        || DEMO_QUESTIONS[1];

      return {
        id: `act-writing-${weakWriting.id}`,
        title: `${weakWriting.name} — CBSE Answer Writing Format`,
        subjectId: weakWriting.subjectId,
        chapterId: weakWriting.id,
        chapterName: weakWriting.name,
        skillTested: 'answerWriting',
        reason: `Step presentation and unit standards in ${weakWriting.name} need alignment with CBSE examiner rubrics.`,
        actionType: 'answer-structure',
        targetQuestionId: targetQ.id,
        estimatedMinutes: 15,
        questionCount: 2,
        expectedOutcome: 'Master CBSE standard structure: Given -> Formula -> Derivation -> Boxed Answer.',
        priorityScore: 90
      };
    }

    // 4. Priority 4: Weak Question Solving
    const weakSolving = chapters.find(c => c.readiness.questionSolving === 'weak');
    if (weakSolving) {
      const targetQ = DEMO_QUESTIONS.find(q => q.chapterId === weakSolving.id) || DEMO_QUESTIONS[0];
      return {
        id: `act-solving-${weakSolving.id}`,
        title: `${weakSolving.name} — Problem Solving Method`,
        subjectId: weakSolving.subjectId,
        chapterId: weakSolving.id,
        chapterName: weakSolving.name,
        skillTested: 'questionSolving',
        reason: `Intermediate calculation errors detected in ${weakSolving.name}. Work through guided progressive hints.`,
        actionType: 'clarity-practice',
        targetQuestionId: targetQ.id,
        estimatedMinutes: 15,
        questionCount: 3,
        expectedOutcome: 'Eliminate intermediate algebraic and arithmetic slip-ups.',
        priorityScore: 88
      };
    }

    // 5. Default High-Yield CBSE Task
    const defaultChapter = chapters.find(c => c.id === 'sci-electricity') || chapters[0];
    const defaultQ = DEMO_QUESTIONS.find(q => q.chapterId === defaultChapter.id) || DEMO_QUESTIONS[0];

    return {
      id: 'act-default-high-yield',
      title: `${defaultChapter.name} — Application & Scenarios`,
      subjectId: defaultChapter.subjectId,
      chapterId: defaultChapter.id,
      chapterName: defaultChapter.name,
      skillTested: 'application',
      reason: `High weightage CBSE chapter (${defaultChapter.cbseWeightageMarks} Marks). Reinforce case-based circuit analysis before upcoming tests.`,
      actionType: 'case-based',
      targetQuestionId: defaultQ.id,
      estimatedMinutes: 15,
      questionCount: 3,
      expectedOutcome: 'Flawless calculation of equivalent resistance and power dissipation in mixed circuits.',
      priorityScore: 85
    };
  },

  getDailyRecommendedTasks(
    chapters: Chapter[],
    mistakes: MistakeEntry[] = [],
    attempts: QuestionAttempt[] = []
  ): SmartNextAction[] {
    const tasks: SmartNextAction[] = [];

    // Task 1: Primary highest impact
    const primaryTask = this.getHighestImpactAction(chapters, mistakes, attempts);
    tasks.push(primaryTask);

    // Task 2: High weightage weak chapter (different from primary)
    const highWeightageWeak = chapters
      .filter(c => c.id !== primaryTask.chapterId && c.cbseWeightageMarks >= 7 && (c.readiness.questionSolving !== 'strong' || c.readiness.application !== 'strong'))
      .sort((a, b) => b.cbseWeightageMarks - a.cbseWeightageMarks)[0];

    if (highWeightageWeak) {
      const targetQ = DEMO_QUESTIONS.find(q => q.chapterId === highWeightageWeak.id);
      tasks.push({
        id: `act-hw-${highWeightageWeak.id}`,
        title: `${highWeightageWeak.name} — Speed & Precision Sprint`,
        subjectId: highWeightageWeak.subjectId,
        chapterId: highWeightageWeak.id,
        chapterName: highWeightageWeak.name,
        skillTested: 'timeSpeed',
        reason: `Carries ${highWeightageWeak.cbseWeightageMarks} board marks. Timed problem solving protects you from last-minute time crunch.`,
        actionType: 'speed-sprint',
        targetQuestionId: targetQ?.id || 'sci-q1',
        estimatedMinutes: 15,
        questionCount: 3,
        expectedOutcome: 'Complete 3-mark and 4-mark subparts comfortably within 1.5 mins per mark.',
        priorityScore: 88
      });
    } else {
      tasks.push({
        id: 'act-speed-drill',
        title: 'Electricity — Time & Pacing Sprint',
        subjectId: 'science',
        chapterId: 'sci-electricity',
        chapterName: 'Electricity',
        skillTested: 'timeSpeed',
        reason: 'Solve 1 case-based numerical within 6 minutes, ensuring all circuit steps and SI units are written.',
        actionType: 'speed-sprint',
        targetQuestionId: 'sci-q1',
        estimatedMinutes: 10,
        questionCount: 2,
        expectedOutcome: 'Fast, accurate calculation of equivalent resistances under 6 minutes.',
        priorityScore: 84
      });
    }

    // Task 3: Answer Writing Structure Drill
    const writingChapter = chapters.find(c => c.id !== tasks[0].chapterId && c.id !== tasks[1].chapterId && (c.subjectId === 'social-science' || c.subjectId === 'english' || c.readiness.answerWriting !== 'strong'))
      || chapters[2];

    const targetQ3 = DEMO_QUESTIONS.find(q => q.chapterId === writingChapter.id) || DEMO_QUESTIONS[3];

    tasks.push({
      id: `act-structure-${writingChapter.id}`,
      title: `${writingChapter.name} — CBSE 5-Point Structure`,
      subjectId: writingChapter.subjectId,
      chapterId: writingChapter.id,
      chapterName: writingChapter.name,
      skillTested: 'answerWriting',
      reason: 'Practice framing distinct bold sub-headings for board evaluators instead of dense paragraphs.',
      actionType: 'answer-structure',
      targetQuestionId: targetQ3.id,
      estimatedMinutes: 12,
      questionCount: 2,
      expectedOutcome: 'Structure long answers with clear headings to capture maximum step-marks.',
      priorityScore: 80
    });

    return tasks.slice(0, 3); // Maximum 3 priority tasks
  }
};
