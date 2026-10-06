import { Question, MarkingPoint, MistakeCategory } from '../types';

export interface StepEvaluationResult {
  stepNumber: number;
  isSatisfactory: boolean;
  score: number; // 0 to 100
  praise: string;
  feedback: string;
  suggestedChecklist: string[];
}

export interface AnswerEvaluationResult {
  estimatedScore: number;
  maxScore: number;
  percentage: number;
  matchedMarkingPoints: MarkingPoint[];
  missedMarkingPoints: MarkingPoint[];
  identifiedMistakeCategory?: MistakeCategory;
  cbseExaminerRemarks: string;
  presentationSuggestions: string[];
}

export const aiCoachService = {
  // Deterministic step coaching for Exam Clarity Mode
  evaluateStepDraft(question: Question, stepNumber: number, studentText: string): StepEvaluationResult {
    const text = studentText.trim().toLowerCase();
    const isShort = text.length < 10;

    switch (stepNumber) {
      case 1: { // What is the question asking?
        const keywords = ['find', 'calculate', 'prove', 'determine', 'ratio', 'speed', 'distance', 'resistance', 'why', 'value', 'differentiate'];
        const hasTrigger = keywords.some(k => text.includes(k) || question.questionText.toLowerCase().includes(k));
        const satisfactory = !isShort && (hasTrigger || text.length > 25);

        return {
          stepNumber: 1,
          isSatisfactory: satisfactory,
          score: satisfactory ? 90 : 50,
          praise: satisfactory ? 'Sharp focus on the target objective!' : 'Partially identified the question goal.',
          feedback: satisfactory 
            ? 'You clearly articulated the exact required output without getting distracted by background story.'
            : 'Make sure to explicitly state: What exact variable, value, or proof is the examiner looking for?',
          suggestedChecklist: [
            'What is the final physical quantity or state required?',
            'Are there secondary sub-parts hidden in the text?',
            'What are the question trigger words (e.g. calculate vs explain vs prove)?'
          ]
        };
      }

      case 2: { // What information matters?
        const satisfactory = !isShort && (text.includes('given') || text.includes('=') || text.length > 30);
        return {
          stepNumber: 2,
          isSatisfactory: satisfactory,
          score: satisfactory ? 88 : 55,
          praise: satisfactory ? 'Great extraction of given values and boundary conditions.' : 'Needs more selective data extraction.',
          feedback: satisfactory
            ? 'You isolated the relevant parameters while filtering out background noise.'
            : 'Filter out the context: list the explicit numeric quantities with their units, and check for hidden signs (e.g., concave mirror focal length is negative).',
          suggestedChecklist: [
            'List known values with symbols and standard units',
            'Identify implicit conditions (e.g. speed cannot be negative, at rest v=0)',
            'Watch out for distractor details that are not needed for computation'
          ]
        };
      }

      case 3: { // What concept is being tested?
        const conceptWords = question.conceptTested.toLowerCase().split(' ');
        const matchesConcept = conceptWords.some(w => w.length > 4 && text.includes(w));
        const satisfactory = !isShort && (matchesConcept || text.length > 25);

        return {
          stepNumber: 3,
          isSatisfactory: satisfactory,
          score: satisfactory ? 95 : 60,
          praise: satisfactory ? 'Exact CBSE syllabus concept pinpointed!' : 'Concept is close but could be more specific.',
          feedback: satisfactory
            ? `Properly mapped to: "${question.conceptTested}".`
            : `Examiners reward connecting this question to the core principle: "${question.conceptTested}".`,
          suggestedChecklist: [
            'Which NCERT / CBSE chapter and subsection does this fall under?',
            'What core theorem, definition, or law governs this behavior?'
          ]
        };
      }

      case 4: { // Which formula/rule/method applies?
        const hasMathOrRule = text.includes('=') || text.includes('/') || text.includes('theorem') || text.includes('law') || text.includes('formula') || text.length > 25;
        return {
          stepNumber: 4,
          isSatisfactory: hasMathOrRule,
          score: hasMathOrRule ? 92 : 50,
          praise: hasMathOrRule ? 'Governing formula / method correctly stated.' : 'Formula or rule statement is incomplete.',
          feedback: hasMathOrRule
            ? 'CBSE marking schemes always award 0.5 to 1.0 mark just for stating the general formula in algebraic form before putting in numbers.'
            : 'Always write the raw algebraic equation first (e.g. 1/f = 1/v + 1/u, or AD/DB = AE/EC) before substituting numeric values.',
          suggestedChecklist: [
            'State the general formula in pure algebraic form',
            'Check if sign conventions apply to the formula symbols'
          ]
        };
      }

      case 5: { // Solve
        const satisfactory = !isShort && text.length > 30;
        return {
          stepNumber: 5,
          isSatisfactory: satisfactory,
          score: satisfactory ? 85 : 45,
          praise: satisfactory ? 'Systematic algebraic or logical progression.' : 'Intermediate solving steps need to be shown.',
          feedback: satisfactory
            ? 'Good progression. Remember to show at least 2 intermediate steps so you don\'t lose partial credit if there is a calculation error.'
            : 'Do not jump straight to the answer. Show the algebraic simplification step-by-step so the examiner can award step marks.',
          suggestedChecklist: [
            'Show factorisation or cross-multiplication steps clearly',
            'If quadratic, write both roots and explain why extraneous roots are rejected'
          ]
        };
      }

      case 6: { // How should the final answer be presented?
        const checksUnits = text.includes('unit') || text.includes('box') || text.includes('km/h') || text.includes('v') || text.includes('a') || text.includes('point');
        return {
          stepNumber: 6,
          isSatisfactory: checksUnits || text.length > 20,
          score: checksUnits ? 96 : 70,
          praise: 'CBSE presentation checklist applied.',
          feedback: 'Top scorers box their final numeric answer with units and end theory questions with 2-line summary conclusions.',
          suggestedChecklist: [
            'Is the final answer highlighted in a box?',
            'Are proper SI units attached (e.g., Ω, V, km/h, cm²)?',
            'Are theory answers structured with bold bullet points rather than dense paragraphs?'
          ]
        };
      }

      default:
        return {
          stepNumber,
          isSatisfactory: true,
          score: 80,
          praise: 'Good reflection.',
          feedback: 'Proceed to next step.',
          suggestedChecklist: []
        };
    }
  },

  // Deterministic evaluation of complete written answer against CBSE criteria
  evaluateWrittenAnswer(question: Question, studentAnswerText: string): AnswerEvaluationResult {
    const text = studentAnswerText.trim();
    const lower = text.toLowerCase();
    const maxScore = question.marks;

    if (!text || text.length < 10) {
      return {
        estimatedScore: 0,
        maxScore,
        percentage: 0,
        matchedMarkingPoints: [],
        missedMarkingPoints: question.markingPoints,
        identifiedMistakeCategory: 'Incomplete answer',
        cbseExaminerRemarks: 'Answer is too brief or empty. CBSE requires step-by-step reasoning.',
        presentationSuggestions: ['Write down the given parameters and applicable formula to salvage step marks.']
      };
    }

    // Match marking points
    const matched: MarkingPoint[] = [];
    const missed: MarkingPoint[] = [];
    let score = 0;

    question.markingPoints.forEach(mp => {
      // Check keywords from the marking step
      const stepWords = mp.step.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
        .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'then', 'step'].includes(w));
      
      const matchCount = stepWords.filter(w => lower.includes(w)).length;
      const isMatched = matchCount >= Math.min(2, stepWords.length);

      if (isMatched) {
        matched.push(mp);
        score += mp.marks;
      } else {
        missed.push(mp);
      }
    });

    // Check for units
    const needsUnits = ['numerical', 'case-based'].includes(question.type);
    const unitKeywords = ['km/h', 'v', 'a', 'ohm', 'ω', 'cm', 'm', 'joule', 'j', 'watt', 'w'];
    const hasUnits = unitKeywords.some(u => lower.includes(u));

    let mistakeCat: MistakeCategory | undefined;

    if (needsUnits && !hasUnits && score > 0) {
      mistakeCat = 'Missing unit';
      score = Math.max(0.5, score - 0.5); // Penalty
    } else if (missed.length > matched.length) {
      if (text.length > 100 && !text.includes('\n') && !text.includes('-')) {
        mistakeCat = 'Poor answer structure';
      } else {
        mistakeCat = 'Incomplete answer';
      }
    }

    // Cap score
    score = Math.min(maxScore, Math.max(0, Math.round(score * 2) / 2));
    const percentage = Math.round((score / maxScore) * 100);

    const remarks = percentage >= 80 
      ? `Excellent response! Follows CBSE rubrics accurately (${score}/${maxScore} marks).`
      : percentage >= 50
      ? `Partial credit awarded (${score}/${maxScore} marks). Some key steps or justifications were omitted.`
      : `Needs revision (${score}/${maxScore} marks). Missing fundamental step requirements.`;

    const suggestions: string[] = [];
    if (missed.length > 0) {
      suggestions.push(`Ensure to explicitly mention: ${missed.map(m => m.step.substring(0, 40) + '...').join('; ')}`);
    }
    if (needsUnits && !hasUnits) {
      suggestions.push('Add proper SI unit in the final answer step to avoid losing 0.5 to 1 full mark.');
    }
    if (!text.includes('\n') && question.marks >= 3) {
      suggestions.push('Break into numbered points or steps with clear sub-headings for the board examiner.');
    }

    return {
      estimatedScore: score,
      maxScore,
      percentage,
      matchedMarkingPoints: matched,
      missedMarkingPoints: missed,
      identifiedMistakeCategory: mistakeCat,
      cbseExaminerRemarks: remarks,
      presentationSuggestions: suggestions
    };
  }
};
