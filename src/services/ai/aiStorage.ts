import { STORAGE_KEYS } from "@/constants/storage";
import type { AiConfig, ChatMessage, ChatSession } from "./types";

const envProxyUrl =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_PROXY_URL
    ? String(import.meta.env.VITE_AI_PROXY_URL).trim()
    : "https://feeq-ai-proxy.pages.dev";
const envNvidiaKey =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_NVIDIA_API_KEY
    ? String(import.meta.env.VITE_NVIDIA_API_KEY).trim()
    : "";
const envNvidiaModel =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_NVIDIA_MODEL
    ? String(import.meta.env.VITE_NVIDIA_MODEL).trim()
    : "nvidia/nemotron-3.5-lightning-30b-a3b";

export const DEFAULT_AI_CONFIG: AiConfig = {
  apiKey: envNvidiaKey,
  model: envNvidiaModel,
  proxyUrl: envProxyUrl,
};

export function loadAiConfig(): AiConfig {
  if (typeof window === "undefined") return DEFAULT_AI_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (!raw) return DEFAULT_AI_CONFIG;
    const parsed = JSON.parse(raw);
    const storedKey =
      typeof parsed.apiKey === "string" && parsed.apiKey.trim()
        ? parsed.apiKey.trim()
        : (typeof parsed.nvidiaApiKey === "string" && parsed.nvidiaApiKey.trim()
            ? parsed.nvidiaApiKey.trim()
            : "");
    const resolvedKey = storedKey || envNvidiaKey || DEFAULT_AI_CONFIG.apiKey;
    const resolvedModel =
      typeof parsed.model === "string" && parsed.model.trim()
        ? parsed.model.trim()
        : (typeof parsed.nvidiaModel === "string" && parsed.nvidiaModel.trim()
            ? parsed.nvidiaModel.trim()
            : DEFAULT_AI_CONFIG.model);
    // Sanitize proxyUrl: A valid proxy must start with http:// or https://, never an API key or placeholder
    const rawProxy = typeof parsed.proxyUrl === "string" ? parsed.proxyUrl.trim() : "";
    const isObsoletePlaceholder = rawProxy.includes("yourname.workers.dev");
    const safeProxy =
      (rawProxy.startsWith("http://") || rawProxy.startsWith("https://")) && !isObsoletePlaceholder
        ? rawProxy
        : (envProxyUrl || DEFAULT_AI_CONFIG.proxyUrl);

    // If stale localStorage had an API key or obsolete placeholder inside proxyUrl, clean it up
    if (rawProxy && (!rawProxy.startsWith("http://") || !rawProxy.startsWith("https://") || isObsoletePlaceholder)) {
      saveAiConfig({ apiKey: resolvedKey, model: resolvedModel, proxyUrl: safeProxy });
    }

    return {
      apiKey: resolvedKey,
      model: resolvedModel,
      proxyUrl: safeProxy,
    };
  } catch (err) {
    console.warn("Failed to parse AI configuration from localStorage:", err);
    return DEFAULT_AI_CONFIG;
  }
}

export function saveAiConfig(config: AiConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("feeq-ai-config-changed", { detail: config }));
  } catch (err) {
    console.warn("Failed to persist AI configuration to localStorage:", err);
  }
}

export const MAX_CHAT_SESSIONS = 10;

export function createEmptySession(title = "New Chat"): ChatSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CHAT_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, MAX_CHAT_SESSIONS);
      }
    }

    // Migration from legacy single chat history
    const legacyHistory = loadChatHistory();
    if (legacyHistory.length > 0) {
      const initialSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: legacyHistory[0]?.content.slice(0, 36) || "Previous Chat",
        messages: legacyHistory,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveChatSessions([initialSession]);
      return [initialSession];
    }

    return [];
  } catch (err) {
    console.warn("Failed to load chat sessions from localStorage:", err);
    return [];
  }
}

export function saveChatSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = sessions.slice(0, MAX_CHAT_SESSIONS);
    localStorage.setItem(STORAGE_KEYS.AI_CHAT_SESSIONS, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent("feeq-ai-sessions-changed", { detail: trimmed }));
  } catch (err) {
    console.warn("Failed to save chat sessions to localStorage:", err);
  }
}

/**
 * On page load / refresh:
 * Keeps the currently active conversation and its messages open for seamless UX.
 * If no session exists, initializes a fresh empty session.
 */
export function initializeSessionsOnPageLoad(): { sessions: ChatSession[]; activeSessionId: string } {
  if (typeof window === "undefined") {
    const initial = createEmptySession();
    return { sessions: [initial], activeSessionId: initial.id };
  }

  const existing = loadChatSessions();

  if (existing.length === 0) {
    const fresh = createEmptySession();
    saveChatSessions([fresh]);
    localStorage.setItem(STORAGE_KEYS.AI_ACTIVE_SESSION_ID, fresh.id);
    return { sessions: [fresh], activeSessionId: fresh.id };
  }

  // Restore the last active session ID if it exists in current sessions, otherwise fallback to most recent
  const storedActiveId = localStorage.getItem(STORAGE_KEYS.AI_ACTIVE_SESSION_ID);
  const matchingSession = existing.find((s) => s.id === storedActiveId);
  const first = existing[0];
  const activeSessionId = matchingSession ? matchingSession.id : (first ? first.id : "");

  localStorage.setItem(STORAGE_KEYS.AI_ACTIVE_SESSION_ID, activeSessionId);

  return {
    sessions: existing,
    activeSessionId,
  };
}

export function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CHAT_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-50); // Keep last 50 messages to prevent unbounded growth
  } catch (err) {
    console.warn("Failed to parse chat history from localStorage:", err);
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = messages.slice(-50);
    localStorage.setItem(STORAGE_KEYS.AI_CHAT_HISTORY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn("Failed to persist chat history to localStorage:", err);
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.AI_CHAT_HISTORY);
  } catch (err) {
    console.warn("Failed to clear chat history from localStorage:", err);
  }
}
