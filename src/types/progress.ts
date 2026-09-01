export interface UserProgress {
  completedQuestions: string[];
  bookmarkedQuestions: string[];
  completedCodingProblems: string[];
  completedMachineCodingProblems: string[];
  topicProgress: Record<string, number>;
  categoryProgress: Record<string, number>;
  quizHistory: QuizResult[];
  flashcardHistory: FlashcardResult[];
  interviewHistory: InterviewResult[];
  dailyPracticeHistory: DailyPracticeResult[];
  recentlyViewed: string[];
  notes: Record<string, string>;
  theme: "light" | "dark" | "system";
}

export interface QuizResult {
  id: string;
  date: string;
  category: string;
  topic?: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  strongTopics: string[];
  weakTopics: string[];
}

export interface FlashcardResult {
  date: string;
  totalCards: number;
  easy: number;
  hard: number;
  skipped: number;
}

export interface InterviewResult {
  id: string;
  date: string;
  experience: string;
  focus: string;
  duration: number;
  totalQuestions: number;
  answered: number;
  skipped: number;
  score: number;
  categoryScores: Record<string, number>;
}

export interface DailyPracticeResult {
  date: string;
  completed: number;
  total: number;
  questions: string[];
}
