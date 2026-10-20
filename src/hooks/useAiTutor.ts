import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  type AiConfig,
  type ChatMessage,
  type ChatSession,
  type ActiveContext,
  loadAiConfig,
  saveAiConfig,
  saveChatHistory,
  clearChatHistory,
  extractActiveContext,
  sendAiMessage,
  saveChatSessions,
  initializeSessionsOnPageLoad,
  createEmptySession,
  MAX_CHAT_SESSIONS,
} from "@/services/ai";

export function useAiTutor() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [config, setConfig] = useState<AiConfig>(() => loadAiConfig());

  // Initialize sessions: on refresh/load, archives previous chat if non-empty and starts fresh chat
  const [sessionState, setSessionState] = useState<{
    sessions: ChatSession[];
    activeSessionId: string;
  }>(() => initializeSessionsOnPageLoad());

  const { sessions, activeSessionId } = sessionState;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Active session object
  const activeSession = useMemo(() => {
    return (
      sessions.find((s) => s.id === activeSessionId) ||
      sessions[0] ||
      createEmptySession()
    );
  }, [sessions, activeSessionId]);

  const messages = activeSession.messages;

  // Listen for config changes across tabs/windows
  useEffect(() => {
    const handleConfigChange = (e: Event) => {
      const custom = e as CustomEvent<AiConfig>;
      if (custom.detail) {
        setConfig(custom.detail);
      } else {
        setConfig(loadAiConfig());
      }
    };
    window.addEventListener("feeq-ai-config-changed", handleConfigChange);
    return () => window.removeEventListener("feeq-ai-config-changed", handleConfigChange);
  }, []);

  // Listen for sessions changes
  useEffect(() => {
    const handleSessionsChange = (e: Event) => {
      const custom = e as CustomEvent<ChatSession[]>;
      if (custom.detail) {
        setSessionState((prev) => ({
          ...prev,
          sessions: custom.detail,
        }));
      }
    };
    window.addEventListener("feeq-ai-sessions-changed", handleSessionsChange);
    return () => window.removeEventListener("feeq-ai-sessions-changed", handleSessionsChange);
  }, []);

  // Keyboard shortcut: Cmd+J or Ctrl+J to toggle AI drawer, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Extract real-time active context from current route
  const activeContext = useMemo<ActiveContext>(() => {
    return extractActiveContext(location.pathname);
  }, [location.pathname]);

  const updateConfig = useCallback((updates: Partial<AiConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      saveAiConfig(next);
      return next;
    });
  }, []);

  const updateActiveSessionMessages = useCallback(
    (updater: (prevMessages: ChatMessage[]) => ChatMessage[], newTitle?: string) => {
      setSessionState((prev) => {
        const nextSessions = prev.sessions.map((s) => {
          if (s.id !== prev.activeSessionId) return s;
          const nextMsgs = updater(s.messages);
          return {
            ...s,
            title: newTitle || s.title,
            messages: nextMsgs,
            updatedAt: Date.now(),
          };
        });
        saveChatSessions(nextSessions);
        return { ...prev, sessions: nextSessions };
      });
    },
    []
  );

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    updateActiveSessionMessages(() => [], "New Chat");
    clearChatHistory();
    setError(null);
  }, [updateActiveSessionMessages]);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Check if adding an 11th chat will trigger limit warning
  const createNewChat = useCallback(() => {
    if (activeSession.messages.length === 0) {
      setIsHistoryOpen(false);
      return;
    }

    const sessionsWithContent = sessions.filter((s) => s.messages.length > 0);

    if (sessionsWithContent.length >= MAX_CHAT_SESSIONS) {
      setShowLimitWarning(true);
      return;
    }

    const fresh = createEmptySession();
    const updated = [fresh, ...sessions].slice(0, MAX_CHAT_SESSIONS);
    setSessionState({
      sessions: updated,
      activeSessionId: fresh.id,
    });
    saveChatSessions(updated);
    setIsHistoryOpen(false);
  }, [activeSession, sessions]);

  // Confirmed 11th chat creation: evicts oldest chat
  const confirmCreateNewChat = useCallback(() => {
    const oldestIndex = sessions.length - 1;
    const remaining = sessions.filter((_, idx) => idx !== oldestIndex);
    const fresh = createEmptySession();
    const updated = [fresh, ...remaining].slice(0, MAX_CHAT_SESSIONS);

    setSessionState({
      sessions: updated,
      activeSessionId: fresh.id,
    });
    saveChatSessions(updated);
    setShowLimitWarning(false);
    setIsHistoryOpen(false);
  }, [sessions]);

  const switchSession = useCallback((sessionId: string) => {
    setSessionState((prev) => ({
      ...prev,
      activeSessionId: sessionId,
    }));
    setIsHistoryOpen(false);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessionState((prev) => {
      const remaining = prev.sessions.filter((s) => s.id !== sessionId);
      const safeRemaining = remaining.length > 0 ? remaining : [createEmptySession()];
      const first = safeRemaining[0];
      const nextActiveId =
        prev.activeSessionId === sessionId && first ? first.id : prev.activeSessionId;
      saveChatSessions(safeRemaining);
      return {
        sessions: safeRemaining,
        activeSessionId: nextActiveId,
      };
    });
  }, []);

  const clearAllSessions = useCallback(() => {
    const fresh = createEmptySession();
    setSessionState({
      sessions: [fresh],
      activeSessionId: fresh.id,
    });
    saveChatSessions([fresh]);
    clearChatHistory();
    setIsHistoryOpen(false);
  }, []);

  const oldestSession = useMemo(() => {
    return sessions.length > 0 ? sessions[sessions.length - 1] : null;
  }, [sessions]);

  const sendMessage = useCallback(
    async (promptText: string, contextOverride?: ActiveContext) => {
      const trimmed = promptText.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const ctx = contextOverride || activeContext;

      // 1. Create and append user message
      const userMsgId = `user-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
        contextSummary: `${ctx.title}${ctx.subtitle ? ` (${ctx.subtitle})` : ""}`,
      };

      // 2. Prepare streaming assistant placeholder
      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      const currentMsgs = activeSession.messages;
      const updatedHistory = [...currentMsgs, userMsg];

      // Auto-title session from first user message if it's currently "New Chat"
      const sessionTitle =
        activeSession.title === "New Chat"
          ? trimmed.slice(0, 36) + (trimmed.length > 36 ? "..." : "")
          : activeSession.title;

      updateActiveSessionMessages(
        () => [...updatedHistory, placeholderAssistantMsg],
        sessionTitle
      );
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await sendAiMessage(
          trimmed,
          ctx,
          updatedHistory,
          config,
          {
            onChunk: (chunk) => {
              updateActiveSessionMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: chunk, isStreaming: true }
                    : m
                )
              );
            },
            onDone: (finalText) => {
              const finalAssistant: ChatMessage = {
                id: assistantMsgId,
                role: "assistant",
                content: finalText,
                timestamp: Date.now(),
                isStreaming: false,
              };
              const newFullList = [...updatedHistory, finalAssistant];
              updateActiveSessionMessages(() => newFullList, sessionTitle);
              saveChatHistory(newFullList);
              setIsLoading(false);
              abortControllerRef.current = null;
            },
            onError: (err) => {
              setError(err.message);
              updateActiveSessionMessages((prev) =>
                prev.filter((m) => m.id !== assistantMsgId || m.content.length > 0)
              );
              setIsLoading(false);
              abortControllerRef.current = null;
            },
          },
          controller.signal
        );
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          setError(err instanceof Error ? err.message : String(err));
        }
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, activeContext, activeSession, config, updateActiveSessionMessages]
  );

  const editUserMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const trimmed = newContent.trim();
      if (!trimmed || isLoading) return;

      const currentMsgs = activeSession.messages;
      const targetIndex = currentMsgs.findIndex((m) => m.id === messageId);
      if (targetIndex === -1) return;

      // Abort any ongoing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      setError(null);
      const ctx = activeContext;

      // History prior to the edited message
      const priorHistory = currentMsgs.slice(0, targetIndex);

      const targetMsg = currentMsgs[targetIndex];
      const editedUserMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
        contextSummary: targetMsg ? targetMsg.contextSummary : undefined,
      };

      // Placeholder for new streaming response
      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      const updatedHistory = [...priorHistory, editedUserMsg];
      const newMessagesList = [...updatedHistory, placeholderAssistantMsg];

      const sessionTitle =
        targetIndex === 0
          ? trimmed.slice(0, 36) + (trimmed.length > 36 ? "..." : "")
          : activeSession.title;

      updateActiveSessionMessages(() => newMessagesList, sessionTitle);
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await sendAiMessage(
          trimmed,
          ctx,
          updatedHistory,
          config,
          {
            onChunk: (chunk) => {
              updateActiveSessionMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: chunk, isStreaming: true }
                    : m
                )
              );
            },
            onDone: (finalText) => {
              const finalAssistant: ChatMessage = {
                id: assistantMsgId,
                role: "assistant",
                content: finalText,
                timestamp: Date.now(),
                isStreaming: false,
              };
              const finalHistory = [...updatedHistory, finalAssistant];
              updateActiveSessionMessages(() => finalHistory, sessionTitle);
              saveChatHistory(finalHistory);
              setIsLoading(false);
              abortControllerRef.current = null;
            },
            onError: (err) => {
              setError(err.message);
              updateActiveSessionMessages((prev) =>
                prev.filter((m) => m.id !== assistantMsgId || m.content.length > 0)
              );
              setIsLoading(false);
              abortControllerRef.current = null;
            },
          },
          controller.signal
        );
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          setError(err instanceof Error ? err.message : String(err));
        }
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, activeSession, activeContext, config, updateActiveSessionMessages]
  );

  const hasConfiguredProvider = useMemo(() => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    return Boolean(config.apiKey || config.proxyUrl || isLocal);
  }, [config]);

  return {
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    isSettingsOpen,
    setIsSettingsOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    showLimitWarning,
    setShowLimitWarning,
    oldestSessionTitle: oldestSession?.title || "Oldest Chat",
    sessions,
    activeSessionId,
    activeSession,
    createNewChat,
    confirmCreateNewChat,
    switchSession,
    deleteSession,
    clearAllSessions,
    activeContext,
    config,
    updateConfig,
    messages,
    isLoading,
    error,
    hasConfiguredProvider,
    sendMessage,
    editUserMessage,
    clearChat,
    cancelStream,
  };
}
