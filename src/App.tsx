import { useState } from 'react';
import { Chapter, MistakeCategory, MistakeEntry, QuestionAttempt, ReadinessStatus, SmartNextAction, StudentProfile, StudySession, TestResultAnalysis } from './types';
import { storageService } from './services/storageService';
import { readinessEngine } from './services/readinessEngine';
import { recommendationEngine } from './services/recommendationEngine';
import { DEMO_QUESTIONS } from './data/questionsData';

// Layout components
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';

// View components
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { PracticeView } from './components/practice/PracticeView';
import { MistakeBookView } from './components/mistakes/MistakeBookView';
import { ExamSimulatorView } from './components/simulator/ExamSimulatorView';
import { RevisionView } from './components/revision/RevisionView';
import { ProfileView } from './components/profile/ProfileView';
import { ResultAnalysisView } from './components/simulator/ResultAnalysisView';
import { EmptyState } from './components/common/EmptyState';
import { BarChart3 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // App State backed by local-first storage
  const [profile, setProfile] = useState<StudentProfile>(() => storageService.getProfile());
  const [chapters, setChapters] = useState<Chapter[]>(() => storageService.getChapters());
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => storageService.getMistakes());
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() => storageService.getAttempts());
  const [sessions, setSessions] = useState<StudySession[]>(() => storageService.getSessions());
  const [testResults, setTestResults] = useState<TestResultAnalysis[]>(() => storageService.getTestResults());

  // Deep routing filters
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<any>('all');
  const [practiceChapterFilter, setPracticeChapterFilter] = useState<string | 'all'>('all');
  const [practiceTargetQuestionId, setPracticeTargetQuestionId] = useState<string | undefined>(undefined);
  const [revisionChapterId, setRevisionChapterId] = useState<string | undefined>(undefined);

  // Computed live analysis from student behavior for enrolled subjects
  const enrolledChapters = chapters.filter(c => profile.enrolledSubjects.includes(c.subjectId));
  const activeChapters = enrolledChapters.length > 0 ? enrolledChapters : chapters;

  const readinessSummary = readinessEngine.analyzeReadiness(activeChapters, attempts, mistakes, sessions);
  const highestImpactAction = recommendationEngine.getHighestImpactAction(activeChapters, mistakes, attempts);
  const recommendedTasks = recommendationEngine.getDailyRecommendedTasks(activeChapters, mistakes, attempts);
  const unresolvedMistakesCount = mistakes.filter(m => !m.resolved && (!profile.enrolledSubjects || profile.enrolledSubjects.includes(m.subjectId))).length;
  const lastTestResult = testResults.length > 0 ? testResults[0] : undefined;

  // Handlers
  const handleUpdateChapterDimension = (
    chapterId: string, 
    dimensionKey: keyof Chapter['readiness'], 
    newStatus: ReadinessStatus
  ) => {
    const updated = storageService.updateChapterReadiness(chapterId, dimensionKey, newStatus);
    setChapters(updated);
  };

  const handleRecordAttempt = (attempt: QuestionAttempt) => {
    const updated = [attempt, ...attempts];
    storageService.saveAttempts(updated);
    setAttempts(updated);

    // If profile was demo mode, switch to live mode
    if (profile.isDemoMode) {
      const updatedProfile = { ...profile, isDemoMode: false };
      storageService.saveProfile(updatedProfile);
      setProfile(updatedProfile);
    }
  };

  const handleSaveMistake = (mistakeData: MistakeEntry | {
    questionId: string;
    subjectId: any;
    chapterId: string;
    category: MistakeCategory;
    userNote: string;
    studentAnswer: string;
  }) => {
    const newEntry = storageService.addMistake({
      questionId: mistakeData.questionId,
      subjectId: mistakeData.subjectId,
      chapterId: mistakeData.chapterId,
      topic: 'topic' in mistakeData ? mistakeData.topic : undefined,
      category: mistakeData.category,
      userNote: mistakeData.userNote,
      studentAnswer: mistakeData.studentAnswer,
      resolved: false
    });
    setMistakes(prev => [newEntry, ...prev]);
  };

  const handleResolveMistake = (id: string) => {
    storageService.resolveMistake(id);
    setMistakes(prev => prev.map(m => m.id === id ? { ...m, resolved: true } : m));
  };

  const handleSaveTestResult = (result: TestResultAnalysis) => {
    storageService.saveTestResult(result);
    setTestResults(prev => [result, ...prev]);

    // Record individual question attempts from mock exam
    if (result.questionBreakdown && result.questionBreakdown.length > 0) {
      const newAttempts: QuestionAttempt[] = result.questionBreakdown.map(qb => {
        const q = DEMO_QUESTIONS.find(item => item.id === qb.questionId) || DEMO_QUESTIONS[0];
        return {
          id: `attempt-mock-${Date.now()}-${qb.questionId}`,
          questionId: qb.questionId,
          subjectId: result.subjectId,
          chapterId: q.chapterId,
          topic: q.topic,
          questionType: q.type,
          difficulty: q.difficulty,
          isCorrect: qb.isCorrect,
          scoreAchieved: qb.marksObtained,
          maxScore: qb.maxMarks,
          timeSpentSeconds: Math.round(result.totalTimeSeconds / result.questionBreakdown.length),
          expectedTimeSeconds: q.estimatedSolvingTime,
          hintsUsedCount: 0,
          mistakeCategory: qb.mistakeCategory,
          timestamp: Date.now()
        };
      });

      const updatedAttempts = [...newAttempts, ...attempts];
      storageService.saveAttempts(updatedAttempts);
      setAttempts(updatedAttempts);
    }

    // Record study session
    const newSession = storageService.recordSession({
      startedAt: Date.now() - (result.totalTimeSeconds * 1000),
      completedAt: Date.now(),
      subjectId: result.subjectId,
      sessionType: 'simulator',
      questionsAttemptedCount: result.questionBreakdown.length,
      correctCount: result.questionBreakdown.filter(q => q.isCorrect).length,
      incorrectCount: result.questionBreakdown.filter(q => !q.isCorrect).length,
      timeSpentSeconds: result.totalTimeSeconds,
      mistakesLoggedCount: result.repeatedMistakeCategories.reduce((acc, r) => acc + r.count, 0),
      hintsUsedTotal: 0
    });
    setSessions(prev => [newSession, ...prev]);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleResetData = () => {
    storageService.resetAllData();
    setProfile(storageService.getProfile());
    setChapters(storageService.getChapters());
    setMistakes(storageService.getMistakes());
    setAttempts([]);
    setSessions([]);
    setTestResults([]);
    setActiveTab('dashboard');
  };

  // Intelligent task launcher
  const handleExecuteTask = (task: SmartNextAction) => {
    if (task.actionType === 'case-based' || task.actionType === 'clarity-practice' || task.actionType === 'mistake-remedy' || task.actionType === 'answer-structure' || task.actionType === 'speed-sprint') {
      setPracticeSubjectFilter(task.subjectId);
      setPracticeChapterFilter(task.chapterId);
      setPracticeTargetQuestionId(task.targetQuestionId);
      setActiveTab('practice');
    }
  };

  const handlePracticeChapter = (chapterId: string) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (ch) {
      setPracticeSubjectFilter(ch.subjectId);
      setPracticeChapterFilter(chapterId);
      setPracticeTargetQuestionId(undefined);
      setActiveTab('practice');
    }
  };

  const handleRevisionSprint = (chapterId: string) => {
    setRevisionChapterId(chapterId);
    setActiveTab('revision');
  };

  const handleRemediateMistake = (mistake: MistakeEntry) => {
    setPracticeSubjectFilter(mistake.subjectId);
    setPracticeChapterFilter(mistake.chapterId);
    setPracticeTargetQuestionId(mistake.questionId);
    setActiveTab('practice');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        readinessScore={readinessSummary.overallReadinessIndex}
        onTriggerWhatToStudy={() => handleExecuteTask(highestImpactAction)}
        unresolvedMistakesCount={unresolvedMistakesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          isDemoMode={profile.isDemoMode}
          attemptsCount={attempts.length}
          onTriggerWhatToStudy={() => handleExecuteTask(highestImpactAction)}
          unresolvedMistakesCount={unresolvedMistakesCount}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              chapters={chapters}
              readinessSummary={readinessSummary}
              recommendedTasks={recommendedTasks}
              highestImpactAction={highestImpactAction}
              mistakes={mistakes}
              lastTestResult={lastTestResult}
              onExecuteTask={handleExecuteTask}
              onSelectChapter={ch => {
                setPracticeSubjectFilter(ch.subjectId);
                setPracticeChapterFilter(ch.id);
                setActiveTab('subjects');
              }}
              onOpenMistakeBook={() => setActiveTab('mistakes')}
              onRemediateMistake={handleRemediateMistake}
              onLaunchSimulator={() => setActiveTab('simulator')}
              onNavigateToSubjects={() => setActiveTab('subjects')}
              onNavigateToPractice={() => setActiveTab('practice')}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView
              chapters={chapters}
              enrolledSubjects={profile.enrolledSubjects}
              onUpdateChapterDimension={handleUpdateChapterDimension}
              onPracticeChapter={handlePracticeChapter}
              onRevisionSprint={handleRevisionSprint}
              initialSubjectId={practiceSubjectFilter !== 'all' ? practiceSubjectFilter : undefined}
            />
          )}

          {(activeTab === 'practice' || activeTab === 'clarity-mode') && (
            <PracticeView
              questions={DEMO_QUESTIONS}
              chapters={chapters}
              attempts={attempts}
              mistakes={mistakes}
              enrolledSubjects={profile.enrolledSubjects}
              onSaveMistake={handleSaveMistake}
              onRecordAttempt={handleRecordAttempt}
              initialSubjectFilter={practiceSubjectFilter}
              initialChapterFilter={practiceChapterFilter}
              initialQuestionId={practiceTargetQuestionId}
            />
          )}

          {activeTab === 'mistakes' && (
            <MistakeBookView
              mistakes={mistakes}
              enrolledSubjects={profile.enrolledSubjects}
              onResolveMistake={handleResolveMistake}
              onSaveMistake={handleSaveMistake}
            />
          )}

          {activeTab === 'simulator' && (
            <ExamSimulatorView
              enrolledSubjects={profile.enrolledSubjects}
              onSaveResult={handleSaveTestResult}
              onExecuteRecommendedTask={handleExecuteTask}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionView
              chapters={chapters}
              enrolledSubjects={profile.enrolledSubjects}
              onCompleteRevision={chId => {
                handleUpdateChapterDimension(chId, 'revision', 'strong');
                const session = storageService.recordSession({
                  startedAt: Date.now() - (15 * 60 * 1000),
                  completedAt: Date.now(),
                  chapterId: chId,
                  sessionType: 'revision',
                  questionsAttemptedCount: 3,
                  correctCount: 3,
                  incorrectCount: 0,
                  timeSpentSeconds: 15 * 60,
                  mistakesLoggedCount: 0,
                  hintsUsedTotal: 1
                });
                setSessions(prev => [session, ...prev]);
              }}
              initialChapterId={revisionChapterId}
            />
          )}

          {activeTab === 'results' && (
            lastTestResult ? (
              <ResultAnalysisView
                result={lastTestResult}
                onRetake={() => setActiveTab('simulator')}
                onExecuteRecommendedTask={handleExecuteTask}
              />
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
                <EmptyState
                  icon={BarChart3}
                  title="No simulated exam results yet"
                  description="Complete a CBSE Class 10 mock test in the Exam Simulator to generate your full diagnostic report and high-impact next tasks."
                  actionText="Take a Mock Test"
                  onAction={() => setActiveTab('simulator')}
                />
              </div>
            )
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unresolvedMistakesCount={unresolvedMistakesCount}
      />
    </div>
  );
}

export default App;
