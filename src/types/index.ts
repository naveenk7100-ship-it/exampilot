export type SubjectId = 'mathematics' | 'science' | 'social-science' | 'english' | 'hindi';

export type ReadinessStatus = 'strong' | 'needs-practice' | 'weak';

export interface ReadinessDimensions {
  conceptUnderstanding: ReadinessStatus;
  application: ReadinessStatus;
  questionSolving: ReadinessStatus;
  answerWriting: ReadinessStatus;
  timeSpeed: ReadinessStatus;
  revision: ReadinessStatus;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  name: string;
  unit: string;
  order: number;
  cbseWeightageMarks: number;
  readiness: ReadinessDimensions;
  coreConcepts: string[];
  cbseWatchouts: string[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  code: string;
  color: string;
  accentColor: string;
  description: string;
  totalChapters: number;
  totalMarks: number;
}

export type QuestionType = 
  | 'mcq' 
  | 'assertion-reason' 
  | 'short-answer' 
  | 'long-answer' 
  | 'case-based' 
  | 'numerical';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface MarkingPoint {
  step: string;
  marks: number;
}

export interface ClarityThinkingProcess {
  step1Asking: string;       // STEP 1: What is the question asking?
  step2DataMatters: string;   // STEP 2: What information matters?
  step3Concept: string;       // STEP 3: What concept is being tested?
  step4Method: string;        // STEP 4: Which formula/rule/method applies?
  step5Solving: string;       // STEP 5: Step-by-step solution derivation
  step6Presentation: string;  // STEP 6: How should the final answer be presented (CBSE rubric)?
}

export interface ProgressiveHints {
  hint1Asking: string;
  hint2Concept: string;
  hint3MethodFormula: string;
  hint4NextSolvingStep: string;
}

export interface QuestionDeconstruction {
  whatQuestionIsTesting: string;
  informationThatMattered: string[];
  informationThatWasDistraction: string[];
  conceptToRecognize: string;
  methodToUse: string;
  commonTrap: string;
  howFinalAnswerShouldBeWritten: string;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  conceptTested: string;
  questionText: string;
  caseContext?: string; // For case-based questions
  options?: string[];   // For MCQ / Assertion-Reason
  correctOptionIndex?: number;
  expectedAnswer: string;
  markingPoints: MarkingPoint[];
  explanation: string;
  commonMistake: string;
  estimatedSolvingTime: number; // in seconds
  claritySteps: ClarityThinkingProcess;
  progressiveHints: ProgressiveHints;
  deconstruction: QuestionDeconstruction;
  isDemoSample?: boolean;
}

export type MistakeCategory =
  | 'Concept'
  | 'Misread question'
  | 'Wrong method'
  | 'Calculation'
  | 'Missing unit'
  | 'Incomplete answer'
  | 'Poor answer structure'
  | 'Time issue';

export interface MistakeEntry {
  id: string;
  questionId: string;
  subjectId: SubjectId;
  chapterId: string;
  topic?: string;
  category: MistakeCategory;
  userNote?: string;
  studentAnswer?: string;
  timestamp: number;
  attemptNumber: number;
  resolved: boolean;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  subjectId: SubjectId;
  chapterId: string;
  topic: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  isCorrect: boolean;
  scoreAchieved: number;
  maxScore: number;
  timeSpentSeconds: number;
  expectedTimeSeconds: number;
  hintsUsedCount: number; // 0 to 4
  selectedOption?: number;
  studentWrittenAnswer?: string;
  mistakeCategory?: MistakeCategory;
  timestamp: number;
}

export interface StudySession {
  id: string;
  startedAt: number;
  completedAt: number;
  subjectId?: SubjectId;
  chapterId?: string;
  sessionType: 'practice' | 'revision' | 'simulator';
  questionsAttemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  mistakesLoggedCount: number;
  hintsUsedTotal: number;
}

export type ExamReadinessTier = 'READY' | 'ALMOST READY' | 'NOT YET READY';

export interface ExamReadinessReport {
  tier: ExamReadinessTier;
  overallScorePercent: number;
  conceptScorePercent: number;
  applicationScorePercent: number;
  solvingScorePercent: number;
  writingScorePercent: number;
  timeSpeedScorePercent: number;
  revisionScorePercent: number;
  diagnosisHeadline: string;
  reasons: string[];
  highestImpactImprovement: string;
  isDemo: boolean;
  totalAttemptsCount: number;
}

export interface SmartNextAction {
  id: string;
  title: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  skillTested: keyof Chapter['readiness'];
  reason: string;
  actionType: 'clarity-practice' | 'case-based' | 'mistake-remedy' | 'speed-sprint' | 'answer-structure';
  targetQuestionId?: string;
  estimatedMinutes: number;
  questionCount: number;
  expectedOutcome: string;
  priorityScore: number;
}

export interface AdaptiveRecommendation {
  reasonPriority: 'repeated-mistake' | 'weakest-dimension' | 'weak-question-type' | 'appropriate-difficulty' | 'recent-performance';
  explanation: string;
  question: Question;
  chapter: Chapter;
  dimensionTested: keyof Chapter['readiness'];
  suggestedAction: string;
}

export interface ExamSimulatorSection {
  id: string;
  title: string;
  description: string;
  marksPerQuestion: number;
  questionIds: string[];
}

export interface ExamSimulatorConfig {
  id: string;
  title: string;
  subjectId: SubjectId;
  totalMarks: number;
  durationMinutes: number;
  sections: ExamSimulatorSection[];
}

export type QuestionAnswerStatus = 
  | 'not-visited' 
  | 'not-answered' 
  | 'answered' 
  | 'marked-for-review' 
  | 'answered-and-marked';

export interface StudentExamSession {
  examConfigId: string;
  subjectId: SubjectId;
  startTime: number;
  timeSpentSeconds: number;
  answers: Record<string, {
    selectedOption?: number;
    textAnswer?: string;
    status: QuestionAnswerStatus;
    timeSpentSeconds: number;
  }>;
  isSubmitted: boolean;
  score?: number;
}

export interface TestResultAnalysis {
  examTitle: string;
  subjectId: SubjectId;
  totalScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  totalTimeSeconds: number;
  expectedTimeSeconds: number;
  timeEfficiency: 'Optimal' | 'Hurried' | 'Slow';
  weakConcepts: string[];
  questionTypesCausingMistakes: { type: QuestionType; wrongCount: number }[];
  repeatedMistakeCategories: { category: MistakeCategory; count: number }[];
  recommendedNextTasks: SmartNextAction[];
  questionBreakdown: {
    questionId: string;
    marksObtained: number;
    maxMarks: number;
    isCorrect: boolean;
    mistakeCategory?: MistakeCategory;
  }[];
}

export interface StudentSubjectConfig {
  language1: 'english-184' | 'english-101' | 'hindi-002' | 'hindi-085';
  language2: 'hindi-002' | 'hindi-085' | 'sanskrit-122' | 'french-018' | 'english-184' | 'none';
  mathType: 'standard-041' | 'basic-241';
  science: boolean;
  socialScience: boolean;
  optionalSubject: 'none' | 'info-tech-402' | 'ai-417';
}

export interface StudentProfile {
  name: string;
  standard: string;
  board: string;
  subjectConfig?: StudentSubjectConfig;
  enrolledSubjects: SubjectId[];
  targetExamDate: string; // YYYY-MM-DD
  targetScore: number;    // e.g. 95%
  studyTimeDailyMinutes: number;
  isDemoMode: boolean;
}

export interface RevisionSessionConfig {
  chapterId: string;
  subjectId: SubjectId;
  totalMinutes: number;
  phases: {
    title: string;
    durationMinutes: number;
    type: 'concept' | 'questions' | 'mistakes';
    description: string;
  }[];
}
