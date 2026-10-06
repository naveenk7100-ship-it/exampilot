import { Question } from '../types';

export const DEMO_QUESTIONS: Question[] = [
  // ==========================================
  // MATHEMATICS
  // ==========================================
  {
    id: 'math-q1',
    subjectId: 'mathematics',
    chapterId: 'math-quadratic-equations',
    topic: 'Nature of Roots & Discriminant',
    type: 'assertion-reason',
    difficulty: 'Medium',
    marks: 1,
    conceptTested: 'Discriminant condition for real and equal roots in quadratic equations',
    questionText: `Direction: In the question, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct option:

Assertion (A): The equation 4x² - 12x + 9 = 0 has two real and equal roots.
Reason (R): For any quadratic equation ax² + bx + c = 0, if the discriminant D = b² - 4ac = 0, then the equation has real and equal roots.`,
    options: [
      '(a) Both (A) and (R) are true and (R) is the correct explanation of (A).',
      '(b) Both (A) and (R) are true but (R) is NOT the correct explanation of (A).',
      '(c) (A) is true but (R) is false.',
      '(d) (A) is false but (R) is true.'
    ],
    correctOptionIndex: 0,
    expectedAnswer: `(a) Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).

Detailed check:
a = 4, b = -12, c = 9
D = b² - 4ac = (-12)² - 4(4)(9) = 144 - 144 = 0.
Since D = 0, the equation has real and equal roots. Reason correctly states this exact mathematical criterion.`,
    markingPoints: [
      { step: 'Correct calculation of discriminant D = (-12)² - 4(4)(9) = 0', marks: 0.5 },
      { step: 'Connecting D = 0 condition with Reason to select option (a)', marks: 0.5 }
    ],
    explanation: 'Evaluating the discriminant D = (-12)² - 4(4)(9) = 144 - 144 = 0 confirms equal roots. The Reason states the formal condition for zero discriminant, which directly explains the Assertion.',
    commonMistake: 'Students often calculate (-12)² as -144 instead of +144 due to forgetting that the square of a negative number is always positive, leading them to falsely conclude D < 0.',
    estimatedSolvingTime: 90,
    claritySteps: {
      step1Asking: 'Determine the truth value of Assertion (A) regarding root equality, verify Reason (R), and decide if (R) logically justifies (A).',
      step2DataMatters: 'Given equation: 4x² - 12x + 9 = 0. Coefficients: a = 4, b = -12, c = 9. The term "real and equal roots" triggers discriminant evaluation.',
      step3Concept: 'Quadratic Discriminant Theory: D = b² - 4ac determines root nature (D > 0: two distinct real roots; D = 0: two equal real roots; D < 0: no real roots).',
      step4Method: 'Compute numerical value of D = b² - 4ac. Compare with zero. Check if Reason is the standard definition that validates the Assertion.',
      step5Solving: '1) Identify: a=4, b=-12, c=9. \n2) D = (-12)² - 4(4)(9) = 144 - 144 = 0. \n3) Since D = 0, roots are real and equal -> Assertion is TRUE. \n4) Reason provides the exact theorem -> Reason is TRUE and explains (A).',
      step6Presentation: 'State option (a). Show the 1-line discriminant calculation clearly so examiner sees the mathematical justification.'
    },
    progressiveHints: {
      hint1Asking: 'Check if 4x² - 12x + 9 = 0 produces zero discriminant, then see if the Reason rule proves that exact outcome.',
      hint2Concept: 'Recall the nature of roots criterion: D = b² - 4ac. If D = 0, roots are real and equal.',
      hint3MethodFormula: 'Calculate D = (-12)² - 4(4)(9). Watch your negative sign inside the square.',
      hint4NextSolvingStep: 'D = 144 - 144 = 0. Because D is zero, roots are equal. The Reason directly explains the Assertion, so select Option (a).'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Ability to calculate quadratic discriminant and verify logical causality in CBSE Assertion-Reason format.',
      informationThatMattered: ['Coefficients: a = 4, b = -12, c = 9', 'The condition "real and equal roots" means D = 0'],
      informationThatWasDistraction: ['General variable x (can be any real number)'],
      conceptToRecognize: 'Quadratic Discriminant: D = b² - 4ac = 0 signifies real and identical roots.',
      methodToUse: 'Compute numerical D, evaluate truth of (A) and (R), and check causal linkage.',
      commonTrap: 'Squaring -12 as -144 instead of +144 or failing to verify if Reason is the true cause of Assertion.',
      howFinalAnswerShouldBeWritten: 'Option (a) followed by a 1-line proof showing D = (-12)² - 4(4)(9) = 0.'
    },
    isDemoSample: true
  },
  {
    id: 'math-q2',
    subjectId: 'mathematics',
    chapterId: 'math-quadratic-equations',
    topic: 'Applied Word Problems (Speed & Distance)',
    type: 'numerical',
    difficulty: 'Hard',
    marks: 4,
    conceptTested: 'Translating speed-distance-time relation into standard quadratic form and factoring extraneous physical roots',
    questionText: `A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.`,
    expectedAnswer: `Let the speed of the stream be x km/h (where x < 18).
Speed upstream = (18 - x) km/h
Speed downstream = (18 + x) km/h

Time = Distance / Speed
Time taken upstream = 24 / (18 - x) hours
Time taken downstream = 24 / (18 + x) hours

According to the question:
[24 / (18 - x)] - [24 / (18 + x)] = 1

24 * [(18 + x) - (18 - x)] / [(18 - x)(18 + x)] = 1
24 * (2x) / (324 - x²) = 1
48x = 324 - x²
x² + 48x - 324 = 0

Factoring:
x² + 54x - 6x - 324 = 0
x(x + 54) - 6(x + 54) = 0
(x - 6)(x + 54) = 0

x = 6 or x = -54.
Since speed of stream cannot be negative, x ≠ -54.
Therefore, speed of the stream = 6 km/h.`,
    markingPoints: [
      { step: 'Assumption of variable x and expressing upstream/downstream speeds', marks: 1.0 },
      { step: 'Forming correct rational equation: 24/(18-x) - 24/(18+x) = 1', marks: 1.0 },
      { step: 'Simplifying to standard quadratic equation: x² + 48x - 324 = 0', marks: 1.0 },
      { step: 'Solving for x, discarding negative root with reason, final answer with unit (6 km/h)', marks: 1.0 }
    ],
    explanation: 'Upstream movement opposes stream velocity (v - x), increasing travel time. Downstream aids motion (v + x). Setting the time difference equal to 1 hour yields the quadratic equation.',
    commonMistake: 'Writing (x - 18) instead of (18 - x) for upstream speed, or subtracting downstream time from upstream time in reverse order.',
    estimatedSolvingTime: 300,
    claritySteps: {
      step1Asking: 'Calculate the speed of the water stream in km/h using upstream vs downstream travel time difference.',
      step2DataMatters: 'Boat speed in still water = 18 km/h. Distance each way = 24 km. Upstream takes 1 hour longer than downstream.',
      step3Concept: 'Relative speed in river flow: Upstream speed = (v_boat - v_stream); Downstream speed = (v_boat + v_stream). Time = Distance / Speed.',
      step4Method: 'Set up T_upstream - T_downstream = 1. Clear fractions to produce ax² + bx + c = 0. Factorize by splitting the middle term.',
      step5Solving: '1) 24/(18-x) - 24/(18+x) = 1 \n2) 24(18+x - 18+x) = 324 - x² \n3) 48x = 324 - x² => x² + 48x - 324 = 0 \n4) (x + 54)(x - 6) = 0 => x = 6 or x = -54. Discard -54.',
      step6Presentation: 'State the variable definition with units first. Conclude with a clear statement: "Speed of stream = 6 km/h". Always explicitly state why negative root is rejected.'
    },
    progressiveHints: {
      hint1Asking: 'Define stream speed as x km/h. Find upstream speed (18 - x) and downstream speed (18 + x).',
      hint2Concept: 'Use Time = Distance / Speed. Upstream time is 24/(18 - x) and downstream time is 24/(18 + x).',
      hint3MethodFormula: 'The problem states: Upstream Time - Downstream Time = 1. Set up: 24/(18 - x) - 24/(18 + x) = 1.',
      hint4NextSolvingStep: 'Cross multiply: 24(2x) = 324 - x², leading to x² + 48x - 324 = 0. Factor as (x + 54)(x - 6) = 0.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Formulation of real-world speed-time relationship into a quadratic equation, factoring, and rejection of negative roots.',
      informationThatMattered: ['Still water speed = 18 km/h', 'Distance = 24 km', 'Time difference = 1 hour'],
      informationThatWasDistraction: ['"Motor boat" (propulsion mechanism is irrelevant)'],
      conceptToRecognize: 'Opposing water current reduces net speed (18 - x), assisting current increases net speed (18 + x).',
      methodToUse: 'Fractional difference equation -> Standard quadratic -> Factorization.',
      commonTrap: 'Writing (x - 18) which produces negative speeds or omitting the unit "km/h".',
      howFinalAnswerShouldBeWritten: 'State "Speed of stream = 6 km/h" with boxed final value and physical reason for discarding x = -54.'
    },
    isDemoSample: true
  },
  {
    id: 'math-q3',
    subjectId: 'mathematics',
    chapterId: 'math-triangles',
    topic: 'Basic Proportionality Theorem (BPT)',
    type: 'short-answer',
    difficulty: 'Medium',
    marks: 3,
    conceptTested: 'Applying Thales Theorem / BPT to solve for unknown side segment lengths',
    questionText: `In triangle ABC, DE || BC such that AD = (x + 3), DB = (3x + 19), AE = x, and EC = (3x + 4). Find the value of x.`,
    expectedAnswer: `Given: In ΔABC, DE || BC.
By Basic Proportionality Theorem (Thales Theorem):
If a line is drawn parallel to one side of a triangle intersecting the other two sides, then it divides the two sides in the same ratio.

Therefore:
AD / DB = AE / EC

Substituting the given values:
(x + 3) / (3x + 19) = x / (3x + 4)

Cross multiplying:
(x + 3)(3x + 4) = x(3x + 19)
3x² + 4x + 9x + 12 = 3x² + 19x
3x² + 13x + 12 = 3x² + 19x

Subtracting 3x² from both sides:
13x + 12 = 19x
19x - 13x = 12
6x = 12
x = 2.

Verification:
AD = 5, DB = 25 (ratio 5/25 = 1/5)
AE = 2, EC = 10 (ratio 2/10 = 1/5)
Hence verified.`,
    markingPoints: [
      { step: 'Statement and application of Basic Proportionality Theorem: AD/DB = AE/EC', marks: 1.0 },
      { step: 'Substitution and algebraic expansion: (x+3)(3x+4) = x(3x+19)', marks: 1.0 },
      { step: 'Simplifying linear reduction to 6x = 12 and finding x = 2', marks: 1.0 }
    ],
    explanation: 'Because DE is parallel to BC, the segments formed on sides AB and AC are strictly proportional according to BPT.',
    commonMistake: 'Failing to mention the name "Basic Proportionality Theorem" or "Thales Theorem" loses 1 full mark in CBSE criteria even if final numeric answer is right.',
    estimatedSolvingTime: 180,
    claritySteps: {
      step1Asking: 'Find the unknown scalar x in a triangle with a line segment parallel to the base.',
      step2DataMatters: 'DE || BC. Segments are: AD = x + 3, DB = 3x + 19, AE = x, EC = 3x + 4.',
      step3Concept: 'Basic Proportionality Theorem (BPT): A line parallel to one side dividing two sides maintains equal segment ratios AD/DB = AE/EC.',
      step4Method: 'Formulate the equality of ratios AD/DB = AE/EC, cross-multiply to solve the resulting equation.',
      step5Solving: '1) (x + 3)/(3x + 19) = x/(3x + 4) \n2) 3x² + 13x + 12 = 3x² + 19x \n3) 12 = 6x => x = 2.',
      step6Presentation: 'State "By Basic Proportionality Theorem (BPT)" explicitly at step 1. Highlight final answer in a box: [x = 2].'
    },
    progressiveHints: {
      hint1Asking: 'Recognize the parallel condition: DE || BC in triangle ABC.',
      hint2Concept: 'Recall Thales Theorem / BPT: AD / DB = AE / EC.',
      hint3MethodFormula: 'Substitute: (x + 3) / (3x + 19) = x / (3x + 4). Cross-multiply both fractions.',
      hint4NextSolvingStep: 'Expand: 3x² + 13x + 12 = 3x² + 19x. Notice 3x² cancels on both sides, leaving 12 = 6x => x = 2.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Application of Basic Proportionality Theorem to set up algebraic proportions and simplify.',
      informationThatMattered: ['DE || BC', 'Segment expressions: AD = x + 3, DB = 3x + 19, AE = x, EC = 3x + 4'],
      informationThatWasDistraction: ['No external triangle angles or vertices coordinates needed'],
      conceptToRecognize: 'Line parallel to one side dividing remaining two sides produces equal division ratios.',
      methodToUse: 'BPT Ratio Equality -> Cross-multiplication -> Linear simplification.',
      commonTrap: 'Not writing the name of the theorem (BPT) in the justification line.',
      howFinalAnswerShouldBeWritten: 'State Given, write theorem name, show cross-multiplication, and end with [x = 2].'
    },
    isDemoSample: true
  },

  // ==========================================
  // SCIENCE
  // ==========================================
  {
    id: 'sci-q1',
    subjectId: 'science',
    chapterId: 'sci-electricity',
    topic: 'Equivalent Resistance & Circuit Power',
    type: 'case-based',
    difficulty: 'Hard',
    marks: 4,
    conceptTested: 'Multi-part circuit analysis: series-parallel combinations, current distribution, and Joule heating',
    questionText: `Study the electric circuit scenario below and answer the questions that follow:

A student designs an experiment using a 12V battery with negligible internal resistance. Three resistors R1 = 4 Ω, R2 = 6 Ω, and R3 = 3 Ω are connected such that R2 and R3 are connected in parallel with each other, and this combination is connected in series with R1 and a plug key.

(i) Draw the schematic circuit diagram. (1 Mark)
(ii) Calculate the total equivalent resistance of the entire circuit. (1 Mark)
(iii) Calculate the total current flowing through the circuit. (1 Mark)
(iv) Calculate the potential difference across the parallel combination of R2 and R3. (1 Mark)`,
    expectedAnswer: `(i) Circuit Diagram:
[A battery of 12V in series with key (K), resistor R1 (4 Ω), followed by parallel branches containing R2 (6 Ω) and R3 (3 Ω), returning to negative terminal. Current arrow from positive to negative.]

(ii) Total Equivalent Resistance:
For parallel combination of R2 and R3:
1 / Rp = 1 / R2 + 1 / R3 = 1/6 + 1/3 = (1 + 2) / 6 = 3/6 = 1/2
=> Rp = 2 Ω

Since R1 is in series with Rp:
Req = R1 + Rp = 4 Ω + 2 Ω = 6 Ω.

(iii) Total Current:
Using Ohm's Law: I = V / Req
I = 12 V / 6 Ω = 2 A.

(iv) Potential Difference across Parallel Combination:
Current entering parallel branch = Total current I = 2 A.
Equivalent resistance of parallel branch Rp = 2 Ω.
V_parallel = I * Rp = 2 A * 2 Ω = 4 V.
(Alternatively: V1 = I * R1 = 2 * 4 = 8V; V_parallel = 12V - 8V = 4V).`,
    markingPoints: [
      { step: '(i) Correct circuit symbols, series-parallel layout, and current arrow', marks: 1.0 },
      { step: '(ii) Stepwise calculation of Rp = 2 Ω and Req = 6 Ω', marks: 1.0 },
      { step: '(iii) Application of Ohm’s law I = V/R = 2 A with proper unit', marks: 1.0 },
      { step: '(iv) Potential difference Vp = 4 V calculated with unit', marks: 1.0 }
    ],
    explanation: 'Parallel branches share potential difference; equivalent resistance formula 1/Rp = 1/R1 + 1/R2 must be applied before summing with the series resistor.',
    commonMistake: 'Adding all three resistors in series directly (4 + 6 + 3 = 13 Ω) or omitting the unit "Amperes" and "Volts" in the final values.',
    estimatedSolvingTime: 360,
    claritySteps: {
      step1Asking: 'Solve 4 subparts: construct diagram, compute parallel + series equivalent resistance, total circuit current, and sub-circuit voltage drop.',
      step2DataMatters: 'Battery V = 12V. R1 = 4 Ω (series). R2 = 6 Ω & R3 = 3 Ω (in parallel).',
      step3Concept: "Equivalent Resistance formulas: 1/Rp = 1/R2 + 1/R3; Req = R1 + Rp. Ohm's Law V = I * R.",
      step4Method: '1) Reduce parallel branches first. 2) Sum series components. 3) Apply I = V/Req. 4) Calculate V_parallel = I * Rp.',
      step5Solving: '1) Rp = (6 * 3)/(6 + 3) = 18/9 = 2 Ω. \n2) Req = 4 + 2 = 6 Ω. \n3) I = 12 / 6 = 2 A. \n4) Vp = 2 A * 2 Ω = 4 V.',
      step6Presentation: 'Label each Roman numeral subpart (i)-(iv) clearly. Every numeric value must have its proper SI unit (Ω, A, V).'
    },
    progressiveHints: {
      hint1Asking: 'Break the problem into subparts (i) through (iv). Do not try to solve everything in one combined line.',
      hint2Concept: 'Recognize circuit topology: R2 (6 Ω) and R3 (3 Ω) are in parallel. Their combination is in series with R1 (4 Ω).',
      hint3MethodFormula: 'Parallel equivalent: 1/Rp = 1/6 + 1/3 = 1/2 => Rp = 2 Ω. Total Req = 4 + 2 = 6 Ω. Ohm\'s law: I = V / Req.',
      hint4NextSolvingStep: 'Total current I = 12V / 6Ω = 2 A. Voltage across parallel combo = I * Rp = 2 A * 2 Ω = 4 V.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Multi-part circuit reduction, Ohm\'s law calculation, and current/voltage distribution across mixed networks.',
      informationThatMattered: ['V = 12V', 'R1 = 4 Ω (series)', 'R2 = 6 Ω & R3 = 3 Ω (parallel)'],
      informationThatWasDistraction: ['"Student designs an experiment" (laboratory setup context is cosmetic)'],
      conceptToRecognize: 'Parallel branches have identical voltage drops; current adds up. Series branches have identical current.',
      methodToUse: 'Stepwise equivalent resistance -> Total current -> Branch potential difference.',
      commonTrap: 'Summing all resistors in series without applying parallel reciprocal formula, or omitting SI units (Ω, A, V).',
      howFinalAnswerShouldBeWritten: 'Explicit subpart labeling (i), (ii), (iii), (iv) with intermediate formulas and boxed answers with SI units.'
    },
    isDemoSample: true
  },
  {
    id: 'sci-q2',
    subjectId: 'science',
    chapterId: 'sci-light',
    topic: 'Mirror Formula & Sign Convention',
    type: 'numerical',
    difficulty: 'Medium',
    marks: 3,
    conceptTested: 'New Cartesian Sign Convention applied to concave mirror imaging and magnification',
    questionText: `An object 4 cm in height is placed at 15 cm in front of a concave mirror of focal length 10 cm. At what distance from the mirror should a screen be placed to obtain a sharp image? Find the nature and height of the image formed.`,
    expectedAnswer: `Given (by New Cartesian Sign Convention):
Object height (h) = +4 cm
Object distance (u) = -15 cm
Focal length of concave mirror (f) = -10 cm

(1) Image distance (v):
Mirror formula: 1/f = 1/v + 1/u
1/v = 1/f - 1/u
1/v = 1/(-10) - 1/(-15)
1/v = -1/10 + 1/15 = (-3 + 2) / 30 = -1/30
v = -30 cm.

Therefore, the screen should be placed at 30 cm in front of the mirror (on the same side as object).

(2) Height and Nature of image:
Magnification (m) = -v / u = h' / h
h' = - (v / u) * h
h' = - (-30 / -15) * 4 = - (2) * 4 = -8 cm.

Nature of image:
- Real and inverted (since h' is negative and v is negative)
- Magnified / enlarged (height is 8 cm vs object 4 cm).`,
    markingPoints: [
      { step: 'Correct sign convention: u = -15 cm, f = -10 cm', marks: 0.5 },
      { step: 'Mirror formula statement and calculation of v = -30 cm', marks: 1.0 },
      { step: 'Magnification formula and calculation of h’ = -8 cm', marks: 1.0 },
      { step: 'Complete statement of nature: Real, inverted, and magnified', marks: 0.5 }
    ],
    explanation: 'For a concave mirror, both focal length and real image distances are negative as they lie in front of the reflecting surface.',
    commonMistake: 'Using lens formula 1/f = 1/v - 1/u instead of mirror formula 1/f = 1/v + 1/u, or taking f as positive.',
    estimatedSolvingTime: 240,
    claritySteps: {
      step1Asking: 'Calculate image position (screen placement), image height, and state image nature for a concave mirror.',
      step2DataMatters: 'Concave mirror. h = +4 cm, u = 15 cm (must be -15 cm), f = 10 cm (must be -10 cm).',
      step3Concept: 'Cartesian Sign Convention for spherical mirrors and Mirror Formula 1/f = 1/v + 1/u, m = -v/u = h\'/h.',
      step4Method: 'Substitute signs into 1/v = 1/f - 1/u. Solve for v. Then use m = -v/u to find h\' and interpret sign for real/inverted.',
      step5Solving: '1) 1/v = -1/10 - (-1/15) = -1/30 => v = -30 cm. \n2) m = -(-30)/(-15) = -2. \n3) h\' = -2 * 4 = -8 cm. Negative sign indicates inverted.',
      step6Presentation: 'Write explicit statement: "Screen must be placed at a distance of 30 cm in front of the mirror". Conclude with bullet points for Nature: Real, Inverted, Magnified.'
    },
    progressiveHints: {
      hint1Asking: 'Assign proper Cartesian signs to u and f before writing any equation.',
      hint2Concept: 'Concave mirror has negative focal length: f = -10 cm. Object distance is always negative: u = -15 cm.',
      hint3MethodFormula: 'Use Mirror Formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u. Magnification m = -v/u = h\'/h.',
      hint4NextSolvingStep: '1/v = -1/10 - (-1/15) = -1/30 => v = -30 cm. h\' = -(-30/-15) * 4 = -8 cm. Image is Real, Inverted, and Enlarged.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Application of Cartesian sign convention to mirror formula, calculation of image position and height, and characterization of image nature.',
      informationThatMattered: ['Concave mirror', 'h = +4 cm', 'u = -15 cm', 'f = -10 cm'],
      informationThatWasDistraction: ['"Sharp image on screen" (indicates image is real)'],
      conceptToRecognize: 'Concave mirror focal length is negative. Mirror formula has + sign between 1/v and 1/u.',
      methodToUse: '1/v = 1/f - 1/u -> Magnification formula m = -v/u.',
      commonTrap: 'Using Lens Formula (1/f = 1/v - 1/u) instead of Mirror Formula, or missing the minus sign in m = -v/u.',
      howFinalAnswerShouldBeWritten: 'State Screen Position (30 cm in front of mirror), Image Height (-8 cm), and bulleted Nature (Real, Inverted, Magnified).'
    },
    isDemoSample: true
  },
  {
    id: 'sci-q3',
    subjectId: 'science',
    chapterId: 'sci-chemical-reactions',
    topic: 'Redox Reactions & Oxidation-Reduction Identification',
    type: 'short-answer',
    difficulty: 'Easy',
    marks: 2,
    conceptTested: 'Identifying substance oxidized, reduced, oxidizing agent, and reducing agent in a redox reaction',
    questionText: `Identify the substance oxidized, substance reduced, oxidizing agent, and reducing agent in the following chemical reaction:
MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂`,
    expectedAnswer: `In the given reaction:
MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂

1. Substance Oxidized: HCl (Hydrogen chloride loses hydrogen / chlorine is oxidized to Cl₂).
2. Substance Reduced: MnO₂ (Manganese dioxide loses oxygen to form MnCl₂).
3. Oxidizing Agent: MnO₂ (It supplies oxygen / causes oxidation of HCl).
4. Reducing Agent: HCl (It removes oxygen from MnO₂).`,
    markingPoints: [
      { step: 'Correct identification of substance oxidized (HCl) and substance reduced (MnO₂)', marks: 1.0 },
      { step: 'Correct identification of oxidizing agent (MnO₂) and reducing agent (HCl)', marks: 1.0 }
    ],
    explanation: 'Oxidation is loss of hydrogen or gain of oxygen. Reduction is loss of oxygen or gain of hydrogen. The substance oxidized acts as reducing agent and vice-versa.',
    commonMistake: 'Students frequently write only elemental names like "Mn" or "Cl" instead of the whole reacting compounds "MnO₂" and "HCl". In CBSE, agents must always be reactants.',
    estimatedSolvingTime: 120,
    claritySteps: {
      step1Asking: 'Identify 4 redox entities from the given balanced equation.',
      step2DataMatters: 'Reactants are MnO₂ and HCl. Mn changes from +4 to +2. Cl changes from -1 to 0.',
      step3Concept: 'Redox Definitions: Oxidation = addition of O / removal of H. Reduction = removal of O / addition of H.',
      step4Method: 'Track oxygen transfer: MnO₂ loses oxygen to form MnCl₂ (reduced). HCl loses hydrogen to form Cl₂ (oxidized).',
      step5Solving: '1) MnO₂ -> MnCl₂: Loss of O = Reduction. \n2) HCl -> Cl₂: Loss of H = Oxidation. \n3) Substance that gets reduced is Oxidizing Agent (MnO₂). \n4) Substance that gets oxidized is Reducing Agent (HCl).',
      step6Presentation: 'Present as a 4-row structured list or table. Never mention products as oxidizing or reducing agents.'
    },
    progressiveHints: {
      hint1Asking: 'Remember that oxidizing and reducing agents are ALWAYS reactants, never products.',
      hint2Concept: 'Oxidation is gain of oxygen / loss of hydrogen. Reduction is loss of oxygen / gain of hydrogen.',
      hint3MethodFormula: 'MnO₂ loses oxygen to become MnCl₂ (Reduction). HCl loses hydrogen to form Cl₂ (Oxidation).',
      hint4NextSolvingStep: 'Substance oxidized = HCl, Substance reduced = MnO₂, Oxidizing agent = MnO₂, Reducing agent = HCl.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Identifying oxidized/reduced chemical species and distinguishing reactants as agents.',
      informationThatMattered: ['MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂'],
      informationThatWasDistraction: ['Stoichiometric coefficients (do not change identity of species)'],
      conceptToRecognize: 'Species losing oxygen is reduced; species losing hydrogen is oxidized.',
      methodToUse: 'Track oxygen/hydrogen transfer between reactants and products.',
      commonTrap: 'Listing products (like Cl₂ or MnCl₂) as agents instead of reactants (HCl, MnO₂).',
      howFinalAnswerShouldBeWritten: 'A clear 4-line list specifying full chemical formulas of all 4 entities.'
    },
    isDemoSample: true
  },

  // ==========================================
  // SOCIAL SCIENCE
  // ==========================================
  {
    id: 'sst-q1',
    subjectId: 'social-science',
    chapterId: 'sst-nationalism-europe',
    topic: 'Napoleonic Code (Civil Code of 1804)',
    type: 'long-answer',
    difficulty: 'Medium',
    marks: 5,
    conceptTested: 'Evaluating administrative reforms vs democratic constraints under Napoleon Bonaparte in Europe',
    questionText: `“Napoleon had destroyed democracy in France, but in the administrative field he had incorporated revolutionary principles in order to make the whole system more rational and efficient.” Analyse the statement with five relevant points.`,
    expectedAnswer: `The Civil Code of 1804, commonly known as the Napoleonic Code, brought revolutionary administrative changes across France and conquered territories:

1. Abolition of Feudal Privileges:
He abolished all privileges based on birth, established equality before the law, and secured the right to property.

2. Simplification of Administrative Divisions:
In the Dutch Republic, Switzerland, Italy, and Germany, Napoleon simplified administrative divisions, abolished the feudal system, and freed peasants from serfdom and manorial dues.

3. Removal of Guild Restrictions:
In towns, guild restrictions were abolished, encouraging trade, artisan growth, and market competition.

4. Standardized Measures and Currency:
Transport and communication systems were upgraded. A uniform system of weights and measures, alongside a common national currency, facilitated the free movement of goods and capital.

5. Reaction and Limitations (Drawbacks):
However, the initial enthusiasm turned into hostility as political freedom was curtailed, censorship was imposed, and forced conscription into the French armies was mandated to conquer Europe.`,
    markingPoints: [
      { step: 'Point 1: Privileges based on birth removed & equality before law', marks: 1.0 },
      { step: 'Point 2: Feudal system abolished and peasant emancipation', marks: 1.0 },
      { step: 'Point 3: Removal of town guild restrictions', marks: 1.0 },
      { step: 'Point 4: Standardized weights, measures, and uniform currency', marks: 1.0 },
      { step: 'Point 5: Critical evaluation mentioning loss of political freedom / censorship', marks: 1.0 }
    ],
    explanation: 'CBSE marking scheme expects 5 distinct structured points with sub-headings covering both the positive administrative modernization and the political backlash.',
    commonMistake: 'Writing an unstructured essay paragraph without headings, which causes markers to miss individual key points.',
    estimatedSolvingTime: 420,
    claritySteps: {
      step1Asking: 'Analyze how Napoleon reformed administration while curbing democracy, supplying 5 distinct arguments.',
      step2DataMatters: 'Trigger phrase: "administrative field incorporated revolutionary principles". Relates to Napoleonic Civil Code of 1804.',
      step3Concept: 'Administrative modernization vs political suppression in post-revolutionary Europe under French expansion.',
      step4Method: 'Structure 5 bullet points with clear bold sub-headings: Privileges, Feudalism, Guilds, Economic standardization, and Political restriction.',
      step5Solving: 'Recall 4 core administrative changes (equality/property, peasant emancipation, guild removal, currency/weights) and 1 balancing critical point (censorship/conscription).',
      step6Presentation: 'Use numbered points with 2-3 word bold headings. Write concise, precise sentences conforming to CBSE key vocabulary.'
    },
    progressiveHints: {
      hint1Asking: 'Structure your answer into exactly 5 numbered points with bold headings for full 5 marks.',
      hint2Concept: 'Recall the Civil Code of 1804 (Napoleonic Code) covering legal, agrarian, urban, and commercial reforms.',
      hint3MethodFormula: 'Headings to cover: 1) Abolition of birth privileges, 2) Feudal reforms, 3) Guild restrictions, 4) Uniform currency, 5) Political drawbacks.',
      hint4NextSolvingStep: 'Include the critical balancing point: censorship and forced military conscription turned initial enthusiasm into hostility.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Historical analysis of Napoleonic administrative modernization and its imperial limitations.',
      informationThatMattered: ['Civil Code of 1804', 'Administrative efficiency vs political suppression'],
      informationThatWasDistraction: ['Military battle dates and personal life of Napoleon'],
      conceptToRecognize: 'Revolutionary administrative reforms accompanied by suppression of political freedom.',
      methodToUse: '5-point thematic structure with bold sub-headings.',
      commonTrap: 'Writing a single continuous paragraph without point headers, causing lost step marks.',
      howFinalAnswerShouldBeWritten: 'Title + 5 numbered points with bold headings and 2-sentence elaboration per point.'
    },
    isDemoSample: true
  },
  {
    id: 'sst-q2',
    subjectId: 'social-science',
    chapterId: 'sst-power-sharing',
    topic: 'Prudential vs Moral Reasons for Power Sharing',
    type: 'short-answer',
    difficulty: 'Easy',
    marks: 3,
    conceptTested: 'Differentiating prudential (outcome-based) and moral (democratic spirit) justifications for power sharing',
    questionText: `Differentiate between Prudential reasons and Moral reasons for power sharing in a democracy, giving one suitable example of each.`,
    expectedAnswer: `1. Prudential Reasons:
- Meaning: Based on careful calculation of gains and losses. It emphasizes that power sharing will bring out better outcomes.
- Purpose: It helps to reduce the possibility of conflict between social groups and ensures the political stability of a nation.
- Example: Reservation of seats in Parliament and State Assemblies for Scheduled Castes (SC) and Scheduled Tribes (ST) in India, or Belgium's accommodation model.

2. Moral Reasons:
- Meaning: Emphasizes the intrinsic value of power sharing as the very spirit of democracy.
- Purpose: A democratic rule involves sharing power with those affected by its exercise and who have to live with its effects; people have a right to be consulted on how they are governed.
- Example: Decentralization of power to local governments (Panchayati Raj and Municipalities) in India where citizens directly participate in decision-making.`,
    markingPoints: [
      { step: 'Clear definition and outcome focus of Prudential reasons with valid example', marks: 1.5 },
      { step: 'Clear definition and intrinsic spirit of Moral reasons with valid example', marks: 1.5 }
    ],
    explanation: 'Prudential reasons focus on stability and avoiding violence, while moral reasons view power sharing as an essential ethical requirement of democracy.',
    commonMistake: 'Confusing "prudential" with "moral" or failing to provide real-world democratic examples.',
    estimatedSolvingTime: 180,
    claritySteps: {
      step1Asking: 'Distinguish between Prudential and Moral power-sharing justifications with one example for each.',
      step2DataMatters: 'Two contrasting categories. Must provide: definition, objective, and concrete example.',
      step3Concept: 'Democratic theory: Outcome-oriented vs Principle-oriented power distribution.',
      step4Method: 'Present as two clear distinct headings with parallel comparative points (Meaning, Objective, Example).',
      step5Solving: 'Prudential = calculation of outcomes (avoids civil strife; e.g. minority reservation). Moral = spirit of democracy (legitimate government; e.g. local Panchayats).',
      step6Presentation: 'Highlight key terms: "calculation of gains and losses" vs "very spirit of democracy".'
    },
    progressiveHints: {
      hint1Asking: 'Provide definition, objective, and one concrete democratic example for BOTH reasons.',
      hint2Concept: 'Prudential relates to avoiding social conflict; Moral relates to the intrinsic spirit of democracy.',
      hint3MethodFormula: 'Structure under two clear headings: 1. Prudential Reasons (Outcome-based), 2. Moral Reasons (Principle-based).',
      hint4NextSolvingStep: 'Example for Prudential: Reserved constituencies in India / Belgium model. Example for Moral: Panchayati Raj decentralization.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Conceptual distinction between outcome-based prudential arguments and intrinsic moral justifications of democracy.',
      informationThatMattered: ['Definitions of both', 'Objectives of both', 'Examples for both'],
      informationThatWasDistraction: ['Specific population percentages of minority groups'],
      conceptToRecognize: 'Prudential avoids conflict; Moral upholds citizen participation as legitimate governance.',
      methodToUse: 'Comparative 2-block structure (Meaning, Purpose, Example).',
      commonTrap: 'Omitting concrete real-world democratic examples.',
      howFinalAnswerShouldBeWritten: 'Two clearly demarcated sections with highlighted keywords and verified examples.'
    },
    isDemoSample: true
  },

  // ==========================================
  // ENGLISH
  // ==========================================
  {
    id: 'eng-q1',
    subjectId: 'english',
    chapterId: 'eng-letter-god',
    topic: 'Irony & Character Analysis in Lencho',
    type: 'short-answer',
    difficulty: 'Medium',
    marks: 3,
    conceptTested: 'Explaining situational irony and Lencho’s paradoxical faith in God vs distrust of humans',
    questionText: `Bring out the element of irony in the chapter 'A Letter to God'. How did Lencho react upon receiving the money?`,
    expectedAnswer: `Irony is an unexpected situation where the actual outcome is contrary to what is anticipated.

The central irony in 'A Letter to God':
The postmaster and his employees showed exemplary kindness and selflessness by collecting 70 pesos from their own salaries to keep Lencho's faith alive. However, when Lencho counted the money and found 30 pesos short, he suspected that the post office employees had stolen the remaining amount, referring to them as a "bunch of crooks." 

Thus, the very people who helped him in his distress were branded as dishonest thieves by Lencho due to his blind, unquestioning faith in God and naive mistrust of humanity.`,
    markingPoints: [
      { step: 'Definition and identification of situational irony', marks: 1.0 },
      { step: 'Mentioning the postmaster’s generous act of collecting 70 pesos', marks: 1.0 },
      { step: 'Lencho’s reaction ("bunch of crooks") branding his benefactors as thieves', marks: 1.0 }
    ],
    explanation: 'The irony lies in the clash between the reader\'s awareness of the post office workers\' charity and Lencho\'s accusation against them.',
    commonMistake: 'Retelling the entire story of hail damage instead of directly addressing the specific question of irony.',
    estimatedSolvingTime: 180,
    claritySteps: {
      step1Asking: 'Explain the situational irony in Lencho’s reaction upon finding only 70 pesos in the envelope.',
      step2DataMatters: 'Target concepts: definition of irony, post office staff’s charity, Lencho’s letter calling them "bunch of crooks".',
      step3Concept: 'Literary device: Situational irony in CBSE First Flight prose.',
      step4Method: '1) Define what makes the situation ironic. 2) State the good deed done. 3) State the contrary accusation made.',
      step5Solving: 'Workers sacrifice part of salary -> Lencho thinks God sent 100 pesos and workers stole 30 -> accuses his saviors.',
      step6Presentation: 'Keep strictly within 30-40 words for standard short answer. Quote the phrase "bunch of crooks" accurately.'
    },
    progressiveHints: {
      hint1Asking: 'Focus directly on why the ending is ironic, not the hailstorm or crop loss.',
      hint2Concept: 'Situational irony happens when the outcome is the exact opposite of what is expected.',
      hint3MethodFormula: 'Contrast: Post office staff collected 70 pesos out of kindness vs Lencho calling them "a bunch of crooks".',
      hint4NextSolvingStep: 'Conclude with the paradox: Lencho had unquestioning faith in God but complete distrust in helpful humans.'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Understanding situational irony and literary character analysis in CBSE English prose.',
      informationThatMattered: ['70 pesos collected by post office staff', 'Lencho calling them "bunch of crooks"'],
      informationThatWasDistraction: ['Details about the corn field, locust comparisons, valley geography'],
      conceptToRecognize: 'Irony of benefactors being accused of theft by the beneficiary.',
      methodToUse: 'State definition of irony -> Contrast postmaster\'s charity with Lencho\'s letter.',
      commonTrap: 'Summarizing the whole plot rather than focusing on the irony.',
      howFinalAnswerShouldBeWritten: 'A crisp 40-50 word analytical response quoting "bunch of crooks".'
    },
    isDemoSample: true
  },
  {
    id: 'eng-q2',
    subjectId: 'english',
    chapterId: 'eng-analytical-paragraph',
    topic: 'Writing Skills: Analytical Paragraph',
    type: 'long-answer',
    difficulty: 'Hard',
    marks: 5,
    conceptTested: 'Drafting a structured 100-120 word analytical paragraph based on data trends without personal bias',
    questionText: `The chart below illustrates the preferred study resources chosen by Class 10 students in 2024:
- Conceptual Video Modules: 45%
- Structured Question Banks & Clarity Practice: 35%
- Traditional Heavy Reference Books: 12%
- Unsupervised Social Media Study Groups: 8%

Write an analytical paragraph in 100-120 words summarizing the trends, comparing the key choices, and drawing an appropriate conclusion.`,
    expectedAnswer: `Title: Shift in Class 10 Learning Preferences

The given data illustrates the distribution of study resources favored by Class 10 students in 2024. A distinct trend toward high-efficiency, targeted digital learning is immediately apparent.

A dominant majority of 45% of students rely primarily on conceptual video modules for understanding fundamental theories, followed closely by 35% who prioritize structured question banks and clarity practice engines to master CBSE examination rubrics. In stark contrast, traditional heavy reference volumes account for merely 12% of the preference, indicating a decisive departure from rote voluminous reading. Furthermore, unsupervised social media study groups occupy the lowest position at just 8%, reflecting student awareness of potential distractions.

In conclusion, the data demonstrates that modern CBSE students predominantly prefer focused, concept-oriented, and active examination-centric tools over exhaustive conventional textbooks.`,
    markingPoints: [
      { step: 'Title and introductory paraphrase of data topic', marks: 1.0 },
      { step: 'Accurate comparison and trend language (dominant majority, stark contrast, followed closely)', marks: 2.0 },
      { step: 'Concluding sentence summarizing overall insight', marks: 1.0 },
      { step: 'Adherence to 100-120 word limit, formal tone, zero personal pronouns', marks: 1.0 }
    ],
    explanation: 'An analytical paragraph requires three clear components: Overview/Introduction, Detailed Comparative Analysis with trend vocabulary, and a Summary Conclusion.',
    commonMistake: 'Using first-person phrases like "In my opinion" or "I think students like videos", which violates CBSE analytical writing guidelines.',
    estimatedSolvingTime: 360,
    claritySteps: {
      step1Asking: 'Draft an analytical paragraph (100-120 words) interpreting data on Class 10 study resource choices.',
      step2DataMatters: 'Data percentages: 45% conceptual videos, 35% question banks, 12% reference books, 8% social media groups.',
      step3Concept: 'CBSE Analytical Writing: Objective reporting, comparative connectors, trend analysis without subjective opinion.',
      step4Method: 'Template: 1) Paraphrase topic. 2) Compare high vs low percentages using contrasting linkers. 3) Synthesis conclusion.',
      step5Solving: 'Identify highest (45% + 35% = 80% active/digital) vs lowest (12% heavy books, 8% social). Use phrases "in stark contrast", "dominant majority".',
      step6Presentation: 'Include a suitable title. Maintain single continuous paragraph or crisp 3-part flow. Word count must be 100-120 words.'
    },
    progressiveHints: {
      hint1Asking: 'Include a title, introductory overview, data comparison using trend connectors, and a concluding insight.',
      hint2Concept: 'Never use personal pronouns ("I", "my opinion"). Maintain strictly formal, objective reporting.',
      hint3MethodFormula: 'Use comparative keywords: "dominant majority", "followed closely", "in stark contrast to", "accounts for merely".',
      hint4NextSolvingStep: 'Synthesize the highest (45% videos + 35% question banks) against the lowest (12% reference books, 8% social groups).'
    },
    deconstruction: {
      whatQuestionIsTesting: 'Objective data interpretation, comparative linguistic connectors, and synthesis in CBSE Section B Writing.',
      informationThatMattered: ['45% Video modules', '35% Question banks', '12% Reference books', '8% Social study groups'],
      informationThatWasDistraction: ['Any personal studying habits not supported by the data'],
      conceptToRecognize: 'Objective trend comparison without personal bias.',
      methodToUse: 'Introduction -> Comparative Data Synthesis -> Concluding Trend Summary.',
      commonTrap: 'Using first-person phrases ("I believe") or exceeding the 120-word limit.',
      howFinalAnswerShouldBeWritten: 'A formal 100-120 word paragraph with a clear title and comparative connectors.'
    },
    isDemoSample: true
  },

  // ==========================================
  // HINDI
  // ==========================================
  {
    id: 'hin-q1',
    subjectId: 'hindi',
    chapterId: 'hin-vakya-bhed',
    topic: 'रचना के आधार पर वाक्य रूपांतरण (Sentence Transformation)',
    type: 'mcq',
    difficulty: 'Medium',
    marks: 1,
    conceptTested: 'सरल वाक्य को मिश्र वाक्य में परिवर्तित करने का नियम',
    questionText: `निर्देश: निम्नलिखित वाक्य को मिश्र वाक्य में रूपांतरित करने का सही विकल्प चुनिए:
"परिश्रमी छात्र परीक्षा में अवश्य सफल होते हैं।"`,
    options: [
      '(क) छात्र परिश्रम करते हैं और परीक्षा में सफल होते हैं।',
      '(ख) जो छात्र परिश्रमी होते हैं, वे परीक्षा में अवश्य सफल होते हैं।',
      '(ग) परिश्रमी होने के कारण छात्र परीक्षा में सफल हो गए।',
      '(घ) छात्र परीक्षा में सफल होते हैं क्योंकि वे पढ़ते हैं।'
    ],
    correctOptionIndex: 1,
    expectedAnswer: `(ख) जो छात्र परिश्रमी होते हैं, वे परीक्षा में अवश्य सफल होते हैं।

स्पष्टीकरण:
- मिश्र वाक्य में एक मुख्य उपवाक्य और एक या एक से अधिक आश्रित उपवाक्य होते हैं, जो 'जो-वह', 'जैसा-वैसा', 'यदि-तो', 'क्योंकि' आदि समुच्चयबोधक शब्दों से जुड़े होते हैं।
- विकल्प (क) 'और' से जुड़ा होने के कारण संयुक्त वाक्य है।
- विकल्प (ग) सरल वाक्य है।
- विकल्प (ख) 'जो... वे' योजक से जुड़ा आश्रित विशेषण उपवाक्य युक्त मिश्र वाक्य है।`,
    markingPoints: [
      { step: 'मिश्र वाक्य के सही योजक (जो...वे) की पहचान एवं सही विकल्प चयन', marks: 1.0 }
    ],
    explanation: 'मिश्र वाक्य की पहचान है कि उसमें प्रधान उपवाक्य पर आश्रित उपवाक्य निर्भर करता है। \'जो छात्र परिश्रमी होते हैं, वे परीक्षा में सफल होते हैं\' शुद्ध मिश्र वाक्य है।',
    commonMistake: 'विद्यार्थी अक्सर \'और\' लगे संयुक्त वाक्य (विकल्प क) को मिश्र वाक्य समझ बैठते हैं।',
    estimatedSolvingTime: 60,
    claritySteps: {
      step1Asking: 'दिए गए सरल वाक्य को नियमपूर्वक \'मिश्र वाक्य\' में परिवर्तित करना।',
      step2DataMatters: 'मूल वाक्य: "परिश्रमी छात्र परीक्षा में अवश्य सफल होते हैं।" कर्ता: परिश्रमी छात्र, क्रिया: सफल होना।',
      step3Concept: 'रचना के आधार पर वाक्य भेद: सरल, संयुक्त (और, तथा, किंतु), मिश्र (जो-वह, जिसे, जब-तब)।',
      step4Method: 'विशेषण पदबंध "परिश्रमी छात्र" को आश्रित उपवाक्य "जो छात्र परिश्रमी होते हैं" में बदलना।',
      step5Solving: 'विकल्प (ख) में \'जो... वे\' का सटीक प्रयोग है जो मिश्र वाक्य का लक्षण है।',
      step6Presentation: 'सही विकल्प अक्षर (ख) के साथ पूरा वाक्य स्पष्ट लिखें।'
    },
    progressiveHints: {
      hint1Asking: 'मिश्र वाक्य में एक प्रधान तथा एक आश्रित उपवाक्य होना आवश्यक है।',
      hint2Concept: 'मिश्र वाक्य के योजक शब्द हैं: जो-वह, जिसे-उसे, यदि-तो, क्योंकि।',
      hint3MethodFormula: '\'और\' से जुड़े वाक्य संयुक्त होते हैं, इसलिए विकल्प (क) उत्तर नहीं हो सकता।',
      hint4NextSolvingStep: 'विकल्प (ख) में \'जो छात्र परिश्रमी होते हैं, वे...\' शुद्ध मिश्र वाक्य संरचना है।'
    },
    deconstruction: {
      whatQuestionIsTesting: 'रचना के आधार पर सरल वाक्य को मिश्र वाक्य में रूपांतरित करने का व्याकरणिक ज्ञान।',
      informationThatMattered: ['मूल सरल वाक्य: परिश्रमी छात्र परीक्षा में अवश्य सफल होते हैं'],
      informationThatWasDistraction: ['वाक्य का काल या भावार्थ (केवल संरचनात्मक रूपांतरण अपेक्षित है)'],
      conceptToRecognize: 'मिश्र वाक्य में प्रधान उपवाक्य के साथ आश्रित विशेषण उपवाक्य का संयोजन (जो...वे)।',
      methodToUse: 'योजक शब्दों की परख करके संयुक्त (और) व सरल वाक्यों को छांटना।',
      commonTrap: 'संयुक्त वाक्य के योजक \'और\' को मिश्र वाक्य का योजक मान लेना।',
      howFinalAnswerShouldBeWritten: 'विकल्प (ख) का चयन कर पूर्ण वाक्य लिखना।'
    },
    isDemoSample: true
  },
  {
    id: 'hin-q2',
    subjectId: 'hindi',
    chapterId: 'hin-netaji-chashma',
    topic: 'कैप्टन की देशभक्ति और मूर्ति पर चश्मा',
    type: 'short-answer',
    difficulty: 'Easy',
    marks: 2,
    conceptTested: 'नेताजी का चश्मा पाठ में कैप्टन के चरित्र के माध्यम से देशभक्ति की भावना का मूल्यांकन',
    questionText: `सेनानी न होते हुए भी चश्मेवाले को लोग 'कैप्टन' क्यों कहते थे?`,
    expectedAnswer: `सेनानी न होते हुए भी चश्मेवाले को लोग 'कैप्टन' इसलिए कहते थे क्योंकि:
1. उसके मन में देश के अमर शहीदों और स्वतंत्रता सेनानियों के प्रति अगाध श्रद्धा व सम्मान की भावना थी।
2. वह नेताजी सुभाषचंद्र बोस की बिना चश्मे वाली अधूरी मूर्ति देखकर आहत होता था और अपनी सीमित क्षमता के बावजूद अपनी ओर से मूर्ति पर चश्मा लगाता था। 
उसकी इसी सच्ची देशभक्ति की भावना को देखकर लोग सम्मान व व्यंग्य दोनों भावों से उसे 'कैप्टन' कहकर पुकारते थे।`,
    markingPoints: [
      { step: 'देशभक्ति तथा स्वतंत्रता सेनानियों के प्रति आदर का उल्लेख', marks: 1.0 },
      { step: 'नेताजी की मूर्ति पर चश्मा लगाने के मानवीय प्रयास का वर्णन', marks: 1.0 }
    ],
    explanation: 'कैप्टन कोई फौजी नहीं था, बल्कि एक साधारण फेरीवाला था, परंतु देश के प्रति उसका समर्पण किसी फौजी से कम नहीं था।',
    commonMistake: 'यह लिख देना कि वह सेना में काम करता था। पाठ में स्पष्ट है कि वह शारीरिक रूप से दुर्बल फेरीवाला था।',
    estimatedSolvingTime: 120,
    claritySteps: {
      step1Asking: 'चश्मेवाले को सेनानी न होने पर भी \'कैप्टन\' कहे जाने का मूल कारण बताना।',
      step2DataMatters: 'पात्र: लंगड़ा चश्मेवाला। संदर्भ: नेताजी की मूर्ति पर चश्मा लगाना।',
      step3Concept: 'देशभक्ति केवल सेना में भर्ती होने से नहीं, बल्कि देश के प्रतीकों और सेनानियों के सम्मान से झलकती है।',
      step4Method: 'दो मुख्य बिंदु: 1) सेनानियों के प्रति सम्मान, 2) मूर्ति के प्रति संवेदनशीलता।',
      step5Solving: 'कैप्टन के मन में नेताजी के प्रति गहरी आस्था थी, इसलिए लोग उसे कैप्टन कहते थे।',
      step6Presentation: '25-30 शब्दों में बिंदुवार या दो संतुलित वाक्यों में उत्तर प्रस्तुत करें।'
    },
    progressiveHints: {
      hint1Asking: 'कैप्टन नाम केवल सेना के लिए नहीं, बल्कि उसके भावनात्मक समर्पण के कारण पड़ा था।',
      hint2Concept: 'कैप्टन शारीरिक रूप से दुर्बल और गरीब फेरीवाला था, लेकिन उसमें देशभक्ति की अटूट भावना थी।',
      hint3MethodFormula: 'दो प्रमुख कारण बताएं: 1) शहीदों के प्रति सम्मान, 2) नेताजी की मूर्ति पर चश्मा लगाना।',
      hint4NextSolvingStep: 'निष्कर्ष दें कि उसकी सच्ची देशभक्ति की भावना को देखकर लोग आदर व व्यंग्य में उसे कैप्टन कहते थे।'
    },
    deconstruction: {
      whatQuestionIsTesting: 'साहित्यिक चरित्र का विश्लेषण और पाठ के मूल देशभक्ति संदेश की समझ।',
      informationThatMattered: ['चश्मेवाला सेनानी नहीं था', 'मूर्ति पर चश्मा लगाता था', 'देशभक्ति की भावना'],
      informationThatWasDistraction: ['पानवाले की शारीरिक बनावट और कस्बे का भूगोल'],
      conceptToRecognize: 'सच्ची देशभक्ति नागरिक आचरण और प्रतीकों के प्रति आदर से व्यक्त होती है।',
      methodToUse: '2-बिंदु विश्लेषण: सेनानियों के प्रति सम्मान + मूर्ति की अधूरी स्थिति पर संवेदनशीलता।',
      commonTrap: 'यह लिख देना कि वह भूतपूर्व सैनिक या आजाद हिंद फौज का सिपाही था।',
      howFinalAnswerShouldBeWritten: '25-30 शब्दों में दो सुगठित बिंदुओं में संतुलित उत्तर।'
    },
    isDemoSample: true
  }
];
