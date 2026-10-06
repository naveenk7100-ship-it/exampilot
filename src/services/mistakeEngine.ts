import { MistakeCategory, MistakeEntry, Question, SubjectId } from '../types';

export interface MistakePattern {
  category: MistakeCategory;
  count: number;
  percentage: number;
  chapterName?: string;
  description: string;
  cbseImpactDescription: string;
  recommendedFix: string;
  repeatedDiagnosisHeadline?: string;
}

export const MISTAKE_META: Record<MistakeCategory, { description: string; impact: string; fix: string }> = {
  'Concept': {
    description: 'Fundamental theoretical misunderstanding or confusion between principles.',
    impact: 'Zero credit for the whole question subpart.',
    fix: 'Use Clarity Step 3 to isolate the exact theorem before attempting calculations.'
  },
  'Misread question': {
    description: 'Overlooking critical constraints like "not", "except", or upstream/downstream flow.',
    impact: 'Solves the wrong equation or answers opposite condition.',
    fix: 'Underline trigger keywords and target variables in Clarity Step 1.'
  },
  'Wrong method': {
    description: 'Picking an incorrect formula (e.g., lens vs mirror formula, parallel vs series).',
    impact: 'Step-marks lost immediately after formula declaration.',
    fix: 'Explicitly write the governing standard equation in Clarity Step 4 before substituting values.'
  },
  'Calculation': {
    description: 'Arithmetic error, sign blunder, or incorrect fractional simplification.',
    impact: 'Loses 0.5 to 1 mark in final answer step.',
    fix: 'Perform sanity check and reverse substitution for root verification.'
  },
  'Missing unit': {
    description: 'Omitting SI or physical units (Ω, A, cm, km/h, Joules, cm²).',
    impact: 'Direct 0.5 to 1.0 mark deduction per numerical question.',
    fix: 'Always wrap the final answer in a box with its explicit unit: [Speed = 6 km/h].'
  },
  'Incomplete answer': {
    description: 'Stopping mid-way or forgetting to answer all sub-parts (e.g. state nature + height).',
    impact: 'Unanswered subparts receive 0 marks regardless of prior work.',
    fix: 'Cross-check against the question question marks: if it is 3 marks, ensure 3 separate outputs.'
  },
  'Poor answer structure': {
    description: 'Writing long paragraphs without headings, missing "Given/To Prove", or lacking steps.',
    impact: 'Examiners miss core keywords in dense text blocks.',
    fix: 'Use numbered bullet points with bold sub-headings and underline key terms.'
  },
  'Time issue': {
    description: 'Spending disproportionate time or rushing under time panic.',
    impact: 'Unattempted high-yield questions at the end of paper.',
    fix: 'Strictly adhere to the 1.5 min per mark rule (e.g., 3-mark question = 4.5 minutes maximum).'
  }
};

export const mistakeEngine = {
  // Automatically classify the likely mistake from student response heuristics
  autoClassifyMistake(
    question: Question,
    studentText: string = '',
    isOptionWrong: boolean = false,
    _selectedOption?: number,
    timeSpentSeconds: number = 0
  ): MistakeCategory {
    const text = studentText.trim().toLowerCase();

    // Heuristic 1: Time issue if elapsed time > 2.2x estimated time
    if (timeSpentSeconds > question.estimatedSolvingTime * 2.2) {
      return 'Time issue';
    }

    // Heuristic 2: Missing unit for numerical & case-based questions
    if (['numerical', 'case-based'].includes(question.type)) {
      const unitPattern = /\b(km\/h|km\/hr|kmph|volts?|v|amperes?|amps?|a|ohms?|ω|cm|meters?|m|joules?|j|watts?|w|sec|s|hz|pa)\b|\d+\s*(km\/h|km\/hr|kmph|v|a|ohm|ω|cm|m|j|w)\b/i;
      const hasUnit = unitPattern.test(text);
      const hasNumbers = /\d+/.test(text);
      if (hasNumbers && !hasUnit) {
        return 'Missing unit';
      }
    }

    // Heuristic 3: MCQ / Assertion-Reason mistake
    if (isOptionWrong || ['mcq', 'assertion-reason'].includes(question.type)) {
      if (question.type === 'assertion-reason') {
        return 'Misread question';
      }
      return 'Concept';
    }

    // Heuristic 4: Wrong method / formula check
    if (question.chapterId === 'sci-light' && text.includes('1/v - 1/u')) {
      return 'Wrong method'; // Lens formula used on mirror
    }
    if (question.chapterId === 'math-quadratic-equations' && text.includes('x - 18')) {
      return 'Misread question'; // (x - 18) instead of (18 - x)
    }

    // Heuristic 5: Incomplete answer (too short)
    if (text.length > 0 && text.length < 35 && question.marks >= 3) {
      return 'Incomplete answer';
    }

    // Heuristic 6: Poor answer structure (dense block without linebreaks)
    if (text.length > 80 && !text.includes('\n') && !text.includes('-') && question.marks >= 3) {
      return 'Poor answer structure';
    }

    // Heuristic 7: Calculation blunder
    if (text.includes('=') && (text.includes('144') || text.includes('324') || text.includes('6'))) {
      return 'Calculation';
    }

    // Default
    return 'Concept';
  },

  // Analyze patterns across logged mistakes and detect chapter-specific repetitions
  analyzePatterns(mistakes: MistakeEntry[], subjectFilter?: SubjectId): {
    totalMistakes: number;
    unresolvedCount: number;
    patterns: MistakePattern[];
    primaryPitfall?: MistakePattern;
    chapterSpecificPatterns: { chapterId: string; category: MistakeCategory; count: number; diagnosis: string }[];
    insights: string[];
  } {
    const filtered = subjectFilter ? mistakes.filter(m => m.subjectId === subjectFilter) : mistakes;
    const total = filtered.length;
    const unresolvedCount = filtered.filter(m => !m.resolved).length;

    if (total === 0) {
      return {
        totalMistakes: 0,
        unresolvedCount: 0,
        patterns: [],
        chapterSpecificPatterns: [],
        insights: ['No mistakes recorded yet. Attempt questions to track pattern clarity!']
      };
    }

    // Category frequency
    const counts: Partial<Record<MistakeCategory, number>> = {};
    filtered.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });

    const patterns: MistakePattern[] = Object.entries(counts).map(([cat, cnt]) => {
      const category = cat as MistakeCategory;
      const count = cnt || 0;
      const percentage = Math.round((count / total) * 100);
      const meta = MISTAKE_META[category] || {
        description: 'Exam execution mistake.',
        impact: 'Loss of marks.',
        fix: 'Review step-by-step.'
      };

      return {
        category,
        count,
        percentage,
        description: meta.description,
        cbseImpactDescription: meta.impact,
        recommendedFix: meta.fix
      };
    }).sort((a, b) => b.count - a.count);

    const primaryPitfall = patterns[0];

    // Detect Chapter-Specific Repeating Mistakes (e.g. 2+ calculation mistakes in same chapter)
    const chapterMistakeMap: Record<string, Partial<Record<MistakeCategory, number>>> = {};
    filtered.forEach(m => {
      if (!chapterMistakeMap[m.chapterId]) chapterMistakeMap[m.chapterId] = {};
      chapterMistakeMap[m.chapterId][m.category] = (chapterMistakeMap[m.chapterId][m.category] || 0) + 1;
    });

    const chapterSpecificPatterns: { chapterId: string; category: MistakeCategory; count: number; diagnosis: string }[] = [];
    Object.entries(chapterMistakeMap).forEach(([chId, catMap]) => {
      Object.entries(catMap).forEach(([cat, count]) => {
        if (count && count >= 2) {
          const category = cat as MistakeCategory;
          let diagnosis = `Your concept is okay, but your repeated issue in this chapter is ${category.toLowerCase()}.`;
          if (category === 'Calculation') {
            diagnosis = 'Your concept is okay. Your repeated issue is calculation accuracy.';
          } else if (category === 'Missing unit') {
            diagnosis = 'Your calculations are sound, but repeated unit omissions incur direct mark penalties.';
          } else if (category === 'Poor answer structure') {
            diagnosis = 'You know the facts, but your answer structure lacks bold CBSE headings.';
          }
          chapterSpecificPatterns.push({
            chapterId: chId,
            category,
            count,
            diagnosis
          });
        }
      });
    });

    const insights: string[] = [];
    if (primaryPitfall) {
      insights.push(
        `Your most frequent pitfall is "${primaryPitfall.category}" accounting for ${primaryPitfall.percentage}% of all errors.`
      );
      insights.push(primaryPitfall.cbseImpactDescription);
      insights.push(`Action plan: ${primaryPitfall.recommendedFix}`);
    }

    chapterSpecificPatterns.forEach(csp => {
      insights.push(`Chapter Pattern: ${csp.diagnosis}`);
    });

    return {
      totalMistakes: total,
      unresolvedCount,
      patterns,
      primaryPitfall,
      chapterSpecificPatterns,
      insights
    };
  }
};
