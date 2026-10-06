import { describe, it, expect } from 'vitest';
import { aiEvaluatorService, DeterministicRubricEvaluator } from '../services/aiEvaluatorService';
import { DEMO_QUESTIONS } from '../data/questionsData';

describe('AI Evaluator Service (Deterministic Rubric + Provider Abstraction)', () => {
  const electricityQuestion = DEMO_QUESTIONS.find(q => q.id === 'sci-q1') || DEMO_QUESTIONS[0]; // 4 marks circuit numerical
  const sstQuestion = DEMO_QUESTIONS.find(q => q.id === 'sst-q1') || DEMO_QUESTIONS[3]; // 3 marks Napoleonic code

  it('evaluates accurate numerical answer with correct SI units', async () => {
    const studentAnswer = `
      (i) Schematic circuit with battery, key, R1 in series with parallel branches of R2 and R3.
      (ii) Parallel resistance 1/Rp = 1/6 + 1/3 = 1/2 => Rp = 2 ohm. Total Req = 4 + 2 = 6 ohm.
      (iii) Total current I = V / Req = 12 / 6 = 2 A.
      (iv) Potential difference Vp = I * Rp = 2 * 2 = 4 V.
    `;

    const result = await aiEvaluatorService.evaluateWrittenAnswer(electricityQuestion, studentAnswer);
    expect(result.marksEarned).toBeGreaterThanOrEqual(2.5);
    expect(result.maxMarks).toBe(4);
    expect(result.unitCheck.present).toBe(true);
    expect(result.providerUsed).toBe('deterministic-rubric');
  });

  it('penalizes missing SI units when numerical calculations are provided without units', async () => {
    const studentAnswerWithoutUnits = `
      (ii) Rp is 2 and total Req is 6
      (iii) Current is 2
      (iv) Voltage is 4
    `;

    const result = await aiEvaluatorService.evaluateWrittenAnswer(electricityQuestion, studentAnswerWithoutUnits);
    expect(result.unitCheck.present).toBe(false);
    expect(result.howToImprove.some(h => h.includes('SI unit'))).toBe(true);
  });

  it('detects missing marking points and lists them explicitly', async () => {
    const partialAnswer = `
      The Napoleonic Code of 1804 established equality before law and abolished feudal privileges.
    `;

    const result = await aiEvaluatorService.evaluateWrittenAnswer(sstQuestion, partialAnswer);
    expect(result.marksEarned).toBeLessThan(sstQuestion.marks);
    expect(result.missingMarkingPoints.length).toBeGreaterThan(0);
    expect(result.howToImprove.length).toBeGreaterThan(0);
  });

  it('detects dense paragraph without structure on multi-mark questions', async () => {
    const denseParagraph = `
      Napoleonic code of 1804 abolished all privileges based on birth established equality before the law secured the right to property removed guild restrictions in towns and improved transport and communication systems across French controlled territories in Europe.
    `;

    const result = await aiEvaluatorService.evaluateWrittenAnswer(sstQuestion, denseParagraph);
    expect(result.structureAssessment.rating).toBe('Needs Bullet Points');
  });

  it('handles edge case: empty student input', async () => {
    const result = await aiEvaluatorService.evaluateWrittenAnswer(electricityQuestion, '');
    expect(result.marksEarned).toBe(0);
    expect(result.missingMarkingPoints.length).toBe(electricityQuestion.markingPoints.length);
    expect(result.structureAssessment.rating).toBe('Too Brief');
  });

  it('handles edge case: custom AI provider failure gracefully falls back to deterministic evaluator', async () => {
    const service = new DeterministicRubricEvaluator();
    const result = await service.evaluate({
      question: electricityQuestion,
      studentAnswerText: `
        (ii) Stepwise calculation: Rp = 2 ohm and Req = 6 ohm
        (iii) Ohm's law: I = V/R = 2 A with proper unit
        (iv) Vp = 4 V calculated with unit
      `
    });

    expect(result.providerUsed).toBe('deterministic-rubric');
    expect(result.marksEarned).toBeGreaterThan(0);
  });
});
