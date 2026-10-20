export interface AiConfig {
  apiKey: string;
  model: string;
  proxyUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  contextSummary?: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ActiveContext {
  pageType: "lesson" | "coding" | "machine-coding" | "topics" | "system-design" | "dashboard" | "general";
  title: string;
  subtitle?: string;
  summary: string;
  details?: string;
  selectedText?: string;
  codeSnippet?: string;
}

export interface AiStreamHandlers {
  onChunk: (chunk: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: Error) => void;
}
