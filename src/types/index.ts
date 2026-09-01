export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior';
export type QuestionType = 'Conceptual' | 'Coding' | 'Scenario' | 'Machine Coding';

export interface Question {
  id: string;
  question: string;
  answer: string;
  shortAnswer: string;
  explanation?: string;
  code?: string;
  language?: string;
  difficulty: Difficulty;
  type: QuestionType;
  category: string;
  topicId: string;
  tags: string[];
  commonMistakes?: string[];
  followUps?: string[];
  interviewTips?: string[];
  relatedTopics?: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: Difficulty;
  tags: string[];
  questions: Question[];
  overview?: string;
  concepts?: string[];
  codeExamples?: CodeExample[];
  relatedTopicIds?: string[];
}

export interface CodeExample {
  title: string;
  code: string;
  language: string;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  problem: string;
  requirements: string[];
  examples: ProblemExample[];
  edgeCases: string[];
  theoryAndConcepts?: string;
  keyConcepts?: string[];
  beginnerApproach?: string;
  beginnerImplementation?: string;
  intermediateApproach?: string;
  intermediateImplementation?: string;
  expertApproach?: string;
  expertImplementation?: string;
  naiveApproach?: string;
  optimalApproach: string;
  implementation: string;
  implementationTS?: string;
  stepByStep: string[];
  timeComplexity: string;
  spaceComplexity: string;
  interviewTraps?: string[];
  practiceExercises?: string[];
  alternativeSolutions?: string[];
  commonMistakes?: string[];
  followUps?: string[];
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface MachineCodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  problemStatement: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  componentHierarchy: string;
  stateDesign: string;
  propsApiDesign?: string;
  architecture: string;
  implementation: string;
  accessibility: string;
  performance: string;
  edgeCases: string[];
  testingStrategy: string[];
  improvements: string[];
  followUpQuestions: string[];
}

export interface SystemDesignProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  requirements: string;
  constraints: string;
  highLevelArchitecture: string;
  componentArchitecture: string;
  stateManagement: string;
  apiDesign: string;
  caching: string;
  performance: string;
  security: string;
  accessibility: string;
  errorHandling: string;
  offlineStrategy: string;
  scalability: string;
  tradeoffs: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  topicCount: number;
  questionCount: number;
}
