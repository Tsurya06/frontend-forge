import type { CodingProblem, Difficulty } from "@/types";
import type { ProblemEvaluationResult } from "@/utils/codeRunner";

export type LeftTab = "description" | "editorial" | "solutions" | "submissions";
export type RightTab = "testcase" | "result" | "preview";
export type SolutionTier = "beginner" | "intermediate" | "expert";

export interface UserSubmission {
  readonly id: string;
  readonly timestamp: string;
  readonly status: "accepted" | "wrong_answer" | "runtime_error";
  readonly passedCases: number;
  readonly totalCases: number;
  readonly runtimeMs: number;
  readonly codeSnippet: string;
}

export interface CodingDetailHeaderProps {
  readonly problem: CodingProblem;
  readonly prevProblem: CodingProblem | null;
  readonly nextProblem: CodingProblem | null;
  readonly isRunning: boolean;
  readonly isHtmlCss: boolean;
  readonly completed: boolean;
  readonly bookmarked: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly hasSubmissions: boolean;
  readonly onRun: () => void;
  readonly onSubmit: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onRandom: () => void;
  readonly onToggleBookmark: () => void;
}

export interface ProblemDescriptionTabProps {
  readonly problem: CodingProblem;
  readonly currentIndex: number;
  readonly completed: boolean;
  readonly difficultyVariant: Record<Difficulty, "beginner" | "intermediate" | "advanced" | "senior">;
}

export interface ProblemEditorialTabProps {
  readonly problem: CodingProblem;
}

export interface ProblemSolutionsTabProps {
  readonly problem: CodingProblem;
  readonly selectedTier: SolutionTier;
  readonly isHtmlCss: boolean;
  readonly onSelectTier: (tier: SolutionTier) => void;
  readonly onLoadSolution: (code: string) => void;
}

export interface ProblemSubmissionsTabProps {
  readonly submissions: readonly UserSubmission[];
}

export interface ProblemEditorHeaderProps {
  readonly isHtmlCss: boolean;
  readonly selectedLang: "javascript" | "typescript" | "html";
  readonly editorTheme: string;
  readonly onSelectLang: (lang: "javascript" | "typescript" | "html") => void;
  readonly onSelectTheme: (theme: string) => void;
  readonly onResetCode: () => void;
}

export interface ProblemTestPanelProps {
  readonly rightTab: RightTab;
  readonly isHtmlCss: boolean;
  readonly evaluationResult: ProblemEvaluationResult | null;
  readonly onSelectTab: (tab: RightTab) => void;
}

export interface ProblemTestPanelContentProps {
  readonly problem: CodingProblem;
  readonly rightTab: RightTab;
  readonly isHtmlCss: boolean;
  readonly userCode: string;
  readonly activeTestCaseIdx: number;
  readonly isRunning: boolean;
  readonly evaluationResult: ProblemEvaluationResult | null;
  readonly onSelectTestCase: (idx: number) => void;
}
