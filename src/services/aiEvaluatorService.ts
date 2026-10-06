import { Question, MarkingPoint, MistakeCategory } from '../types';

export interface EvaluationRequest {
  question: Question;
  studentAnswerText: string;
}

export interface AnswerStructureAssessment {
  rating: 'Optimal' | 'Needs Bullet Points' | 'Too Brief';
  notes: string;
}

export interface UnitCheckResult {
  required: boolean;
  present: boolean;
  details?: string;
}

export interface SubjectiveEvaluationResult {
  marksEarned: number;
  maxMarks: number;
  percentage: number;
  matchedMarkingPoints: MarkingPoint[];
  missingMarkingPoints: string[];
  howToImprove: string[];
  identifiedMistakeCategory?: MistakeCategory;
  examinerFeedback: string;
  structureAssessment: AnswerStructureAssessment;
  unitCheck: UnitCheckResult;
  unnecessaryContentDetected: boolean;
  providerUsed: 'deterministic-rubric' | 'ai-provider';
}

export interface IAIEvaluatorProvider {
  name: string;
  isAvailable(): boolean;
  evaluate(request: EvaluationRequest): Promise<SubjectiveEvaluationResult>;
}

/**
 * Deterministic Rubric Evaluator
 * Evaluates student answers against CBSE marking schemes, required keywords, SI units, and structural criteria.
 * Operates safely offline with zero paid API requirement.
 */
export class DeterministicRubricEvaluator implements IAIEvaluatorProvider {
  name = 'deterministic-rubric';

  isAvailable(): boolean {
    return true; // Always available offline
  }

  async evaluate(request: EvaluationRequest): Promise<SubjectiveEvaluationResult> {
    const { question, studentAnswerText } = request;
    const text = (studentAnswerText || '').trim();
    const lower = text.toLowerCase().replace(/[\u03A9\u2126]/g, 'ohm'); // normalize Ω to ohm
    const maxMarks = question.marks;

    // Edge case: Empty or negligible answer
    if (!text || text.length < 8) {
      return {
        marksEarned: 0,
        maxMarks,
        percentage: 0,
        matchedMarkingPoints: [],
        missingMarkingPoints: question.markingPoints.map(m => m.step),
        howToImprove: [
          'State given data and relevant CBSE formula to secure at least step marks.',
          'Always write the raw formula even if numerical calculations are incomplete.'
        ],
        identifiedMistakeCategory: 'Incomplete answer',
        examinerFeedback: 'No substantial content provided. CBSE examiners award marks only for visible intermediate reasoning.',
        structureAssessment: {
          rating: 'Too Brief',
          notes: 'Answer length is insufficient for board evaluation.'
        },
        unitCheck: {
          required: ['numerical', 'case-based'].includes(question.type),
          present: false,
          details: 'No units provided.'
        },
        unnecessaryContentDetected: false,
        providerUsed: 'deterministic-rubric'
      };
    }

    // 1. Evaluate required marking points
    const matched: MarkingPoint[] = [];
    const missing: string[] = [];
    let calculatedMarks = 0;

    question.markingPoints.forEach(mp => {
      const stepNormalized = mp.step.toLowerCase().replace(/[\u03A9\u2126]/g, 'ohm');
      
      // Extract key terms, numbers, and formulas
      const stepWords = stepNormalized
        .replace(/[^a-z0-9\s/=\-.]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2 && !['with', 'from', 'that', 'this', 'have', 'then', 'step', 'using', 'both', 'will', 'and', 'the', 'for'].includes(w));

      // Check number/formula tokens (e.g. 2, 6, 4, 12, rp, req, ohm, a, v, bpt)
      const matchedTokens = stepWords.filter(token => {
        if (lower.includes(token)) return true;
        // Check numeric without symbol or symbol without space
        const cleanToken = token.replace(/[^a-z0-9]/g, '');
        if (cleanToken.length >= 2 && lower.includes(cleanToken)) return true;
        return false;
      });

      const matchRatio = stepWords.length > 0 ? matchedTokens.length / stepWords.length : 0;
      const isMatched = matchRatio >= 0.25 || matchedTokens.length >= Math.min(2, stepWords.length);

      if (isMatched) {
        matched.push(mp);
        calculatedMarks += mp.marks;
      } else {
        missing.push(mp.step);
      }
    });

    // 2. Unit verification for numerical / case-based questions
    const isUnitRequired = ['numerical', 'case-based'].includes(question.type);
    const unitKeywords = ['km/h', 'km/hr', 'kmph', 'v', 'volt', 'volts', 'a', 'amp', 'amps', 'ampere', 'amperes', 'ohm', 'ohms', 'ω', 'cm', 'm', 'joule', 'joules', 'j', 'watt', 'watts', 'w', 'sec', 's', 'hz', 'pa'];
    
    // Check if any unit keyword appears in the student's text
    const hasUnit = unitKeywords.some(u => {
      const escaped = u.replace('/', '\\/');
      const regex = new RegExp(`(\\b|\\d+)${escaped}(\\b|\\s|$)`, 'i');
      return regex.test(lower) || lower.includes(` ${u} `) || lower.endsWith(` ${u}`) || lower.includes(`${u}=`) || lower.includes(`=${u}`);
    });
    const hasNumbers = /\d+/.test(lower);
    let unitDeduction = 0;

    const unitCheckPresent = hasUnit || !hasNumbers;

    if (isUnitRequired && hasNumbers && !hasUnit) {
      unitDeduction = 0.5; // CBSE 0.5 mark deduction
    }

    // 3. Structure assessment
    const isMultiMark = question.marks >= 3;
    const hasBulletOrLinebreak = text.includes('\n') || text.includes('-') || text.includes('1.') || text.includes('i)') || text.includes('•') || text.includes('(i)');
    let structureRating: AnswerStructureAssessment['rating'] = 'Optimal';
    let structureNotes = 'Good stepwise presentation adhering to CBSE guidelines.';

    if (isMultiMark && text.length > 80 && !hasBulletOrLinebreak) {
      structureRating = 'Needs Bullet Points';
      structureNotes = 'Continuous dense paragraph detected. CBSE evaluators prefer numbered step-by-step points.';
    } else if (text.length < 20 && question.marks >= 2) {
      structureRating = 'Too Brief';
      structureNotes = 'Too concise. Intermediate derivation or justification was omitted.';
    }

    // 4. Unnecessary Content / Fluff detection
    const wordCount = text.split(/\s+/).length;
    const unnecessaryContentDetected = (question.marks <= 2 && wordCount > 80) || (question.marks === 3 && wordCount > 150);

    // 5. Final mark calculation & classification
    calculatedMarks = Math.max(0, calculatedMarks - unitDeduction);
    calculatedMarks = Math.min(maxMarks, Math.round(calculatedMarks * 2) / 2); // Round to nearest 0.5
    const percentage = Math.round((calculatedMarks / maxMarks) * 100);

    // Identify mistake category
    let identifiedMistakeCategory: MistakeCategory | undefined;
    if (unitDeduction > 0) {
      identifiedMistakeCategory = 'Missing unit';
    } else if (missing.length > matched.length) {
      if (structureRating === 'Needs Bullet Points') {
        identifiedMistakeCategory = 'Poor answer structure';
      } else if (structureRating === 'Too Brief') {
        identifiedMistakeCategory = 'Incomplete answer';
      } else {
        identifiedMistakeCategory = 'Wrong method';
      }
    }

    // 6. Actionable recommendations on how to improve
    const howToImprove: string[] = [];
    if (missing.length > 0) {
      missing.slice(0, 3).forEach(m => {
        howToImprove.push(`Include: "${m}"`);
      });
    }
    if (unitDeduction > 0 || (!unitCheckPresent && isUnitRequired)) {
      howToImprove.push('Attach correct SI unit (e.g. km/h, Ω, V, A, cm) to your final calculated value.');
    }
    if (structureRating === 'Needs Bullet Points') {
      howToImprove.push('Break continuous sentences into numbered points: 1) Given, 2) Formula, 3) Calculation, 4) Boxed conclusion.');
    }
    if (unnecessaryContentDetected) {
      howToImprove.push('Avoid non-essential intro sentences. CBSE evaluators look directly for formula and step accuracy.');
    }

    // Feedback remark
    let examinerFeedback = '';
    if (percentage >= 80) {
      examinerFeedback = `Full / high credit standard (${calculatedMarks}/${maxMarks} marks). Clear demonstration of CBSE syllabus marking criteria.`;
    } else if (percentage >= 40) {
      examinerFeedback = `Partial credit awarded (${calculatedMarks}/${maxMarks} marks). You have the core intuition, but missed ${missing.length} explicit marking step(s).`;
    } else {
      examinerFeedback = `Substantial step-mark deficit (${calculatedMarks}/${maxMarks} marks). Review the model step sequence below to see where credit was deducted.`;
    }

    return {
      marksEarned: calculatedMarks,
      maxMarks,
      percentage,
      matchedMarkingPoints: matched,
      missingMarkingPoints: missing,
      howToImprove,
      identifiedMistakeCategory,
      examinerFeedback,
      structureAssessment: {
        rating: structureRating,
        notes: structureNotes
      },
      unitCheck: {
        required: isUnitRequired,
        present: unitCheckPresent,
        details: isUnitRequired && !unitCheckPresent ? 'Missing mandatory SI unit' : 'Units verified'
      },
      unnecessaryContentDetected,
      providerUsed: 'deterministic-rubric'
    };
  }
}

/**
 * AI Evaluator Provider Interface
 * Safe client-side wrapper: uses deterministic evaluator by default,
 * with zero key exposure.
 */
class AIEvaluatorService {
  private deterministicEvaluator: IAIEvaluatorProvider;
  private customProvider: IAIEvaluatorProvider | null = null;

  constructor() {
    this.deterministicEvaluator = new DeterministicRubricEvaluator();
  }

  public registerProvider(provider: IAIEvaluatorProvider) {
    this.customProvider = provider;
  }

  public async evaluateWrittenAnswer(
    question: Question,
    studentAnswerText: string
  ): Promise<SubjectiveEvaluationResult> {
    if (this.customProvider && this.customProvider.isAvailable()) {
      try {
        return await this.customProvider.evaluate({ question, studentAnswerText });
      } catch {
        // Safe fallback to deterministic evaluator on any network/API failure
        return await this.deterministicEvaluator.evaluate({ question, studentAnswerText });
      }
    }

    return await this.deterministicEvaluator.evaluate({ question, studentAnswerText });
  }
}

export const aiEvaluatorService = new AIEvaluatorService();
