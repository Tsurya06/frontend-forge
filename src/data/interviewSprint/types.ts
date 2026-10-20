export interface LessonSection {
  id: string;
  heading: string;
  content: string;
  codeExample?: {
    code: string;
    language: string;
    caption?: string;
  };
  expectedOutput?: string;
  keyTakeaway?: string;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  answer: string;
  explanation: string;
  interviewTrap?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface SprintExerciseRef {
  id: string;
  title: string;
  track: "coding" | "machineCoding" | "systemDesign";
  url: string;
  description: string;
  expectedOutcome: string;
  complexityTip?: string;
  starterSnippet?: string;
  hints: string[];
}

export interface SprintDayLesson {
  day: number;
  id: string;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  objectives: string[];
  beginnerOverview: string;
  deepDiveExplanation: string;
  sections: LessonSection[];
  misconceptions: Array<{
    myth: string;
    reality: string;
  }>;
  realWorldScenario: {
    title: string;
    problem: string;
    solution: string;
  };
  questions: InterviewQuestionItem[];
  quiz: QuizQuestionItem[];
  exercise: SprintExerciseRef;
}

export interface DayProgress {
  day: number;
  completed: boolean;
  needsRevision: boolean;
  quizScore?: number; // 0 to 100
  quizAnswered?: Record<string, string>; // questionId -> selectedOptionId
  exerciseAttempted?: boolean;
  exerciseCompleted?: boolean;
  lastPracticedAt?: string;
}

export interface MockInterviewResult {
  completedAt: string;
  scorePercentage: number;
  timeSpentSeconds: number;
  passedCount: number;
  totalCount: number;
  weakTopics: string[];
}

export interface SprintProgressState {
  version: number;
  currentDay: number;
  dayProgress: Record<number, DayProgress>;
  mockResult?: MockInterviewResult;
  lastUpdated: string;
}
