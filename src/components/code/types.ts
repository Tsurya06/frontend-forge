export interface CodeBlockProps {
  readonly code: string;
  readonly language: string;
  readonly title?: string;
  readonly showLineNumbers?: boolean;
  readonly disablePlayground?: boolean;
}

export interface ConsoleOutputLine {
  readonly id: string;
  readonly type: "log" | "warn" | "error" | "info" | "result";
  readonly text: string;
}

export interface CodeBlockPreviewProps {
  readonly showHtmlPreview: boolean;
  readonly previewDoc: string;
  readonly onClose?: () => void;
}

export interface CodeBlockConsoleProps {
  readonly showConsole: boolean;
  readonly isRunning: boolean;
  readonly executionTime: number | null;
  readonly consoleOutput: readonly ConsoleOutputLine[];
  readonly onClear: () => void;
  readonly onClose: () => void;
}
