import { describe, it, expect, beforeEach } from "vitest";
import {
  extractActiveContext,
  buildSystemPrompt,
  loadAiConfig,
  saveAiConfig,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  DEFAULT_AI_CONFIG,
  isOffTopicQuery,
  OFF_TOPIC_REFUSAL_MESSAGE,
  loadChatSessions,
  saveChatSessions,
  initializeSessionsOnPageLoad,
  createEmptySession,
  MAX_CHAT_SESSIONS,
} from "@/services/ai";
import { STORAGE_KEYS } from "@/constants/storage";

describe("AI Tutor Context Extractor & System Prompt", () => {
  it("extracts rich context from a sprint lesson route", () => {
    const ctx = extractActiveContext("/interview-sprint/1");
    expect(ctx.pageType).toBe("lesson");
    expect(ctx.title).toContain("Day 1");
    expect(ctx.summary).toBeTruthy();
    expect(ctx.details).toContain("Key Learning Objectives");
  });

  it("extracts coding problem context and saved code", () => {
    localStorage.setItem(STORAGE_KEYS.problemCode("coding-debounce"), "function debounce() {}");
    const ctx = extractActiveContext("/coding/coding-debounce");
    expect(ctx.pageType).toBe("coding");
    expect(ctx.title).toBeTruthy();
    expect(ctx.codeSnippet).toContain("function debounce");
  });

  it("extracts general context for dashboard", () => {
    const ctx = extractActiveContext("/dashboard");
    expect(ctx.pageType).toBe("general");
    expect(ctx.title).toContain("FrontendForge");
  });

  it("builds a system prompt containing the active context and mentoring instructions", () => {
    const ctx = extractActiveContext("/interview-sprint/1");
    const prompt = buildSystemPrompt(ctx);
    expect(prompt).toContain("FrontendForge AI Tutor");
    expect(prompt).toContain(ctx.title);
    expect(prompt).toContain("SCOPE & TECHNICAL EXPERTISE");
  });

  it("correctly flags off-topic non-coding queries", () => {
    expect(isOffTopicQuery("who is PM of india")).toBe(true);
    expect(isOffTopicQuery("who is the prime minister")).toBe(true);
    expect(isOffTopicQuery("who is president of USA")).toBe(true);
    expect(isOffTopicQuery("what is the weather today in Delhi")).toBe(true);
    expect(isOffTopicQuery("tell me a joke about dogs")).toBe(true);

    // Legitimate coding / frontend questions should NOT be flagged
    expect(isOffTopicQuery("Explain Fiber reconciliation")).toBe(false);
    expect(isOffTopicQuery("How does useState batching work?")).toBe(false);
    expect(isOffTopicQuery("Help me debug this debounce polyfill")).toBe(false);
    expect(isOffTopicQuery("what is an array")).toBe(false);
    expect(isOffTopicQuery("how to use map and filter")).toBe(false);
    expect(OFF_TOPIC_REFUSAL_MESSAGE).toContain("strictly dedicated to frontend engineering");
  });
});

describe("AI Configuration & Chat History Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default config when localStorage is empty", () => {
    const config = loadAiConfig();
    expect(config).toEqual(DEFAULT_AI_CONFIG);
    expect(config.model).toBe(DEFAULT_AI_CONFIG.model);
  });

  it("saves and loads updated AI provider config", () => {
    saveAiConfig({
      apiKey: "nvapi-test123",
      model: "nvidia/nemotron-3.5-lightning-30b-a3b",
      proxyUrl: "https://feeq-ai.workers.dev/api/chat",
    });

    const loaded = loadAiConfig();
    expect(loaded.apiKey).toBe("nvapi-test123");
    expect(loaded.model).toBe("nvidia/nemotron-3.5-lightning-30b-a3b");
    expect(loaded.proxyUrl).toBe("https://feeq-ai.workers.dev/api/chat");
  });

  it("sanitizes proxyUrl so API keys mistakenly stored in proxyUrl are never loaded", () => {
    localStorage.setItem(
      STORAGE_KEYS.AI_CONFIG,
      JSON.stringify({
        apiKey: "nvapi-real",
        model: "nvidia/nemotron-3.5-lightning-30b-a3b",
        proxyUrl: "nvapi-leakedkey123",
      })
    );

    const loaded = loadAiConfig();
    expect(loaded.proxyUrl).not.toContain("nvapi-leakedkey123");
  });

  it("saves, loads, and clears chat history safely", () => {
    expect(loadChatHistory()).toEqual([]);

    const messages = [
      { id: "1", role: "user" as const, content: "What is reconciliation?", timestamp: Date.now() },
      { id: "2", role: "assistant" as const, content: "Reconciliation is...", timestamp: Date.now() },
    ];

    saveChatHistory(messages);
    const loaded = loadChatHistory();
    expect(loaded).toHaveLength(2);
    expect(loaded[0]?.content).toBe("What is reconciliation?");

    clearChatHistory();
    expect(loadChatHistory()).toEqual([]);
  });

  it("enforces max 50 messages limit in history", () => {
    const many = Array.from({ length: 65 }, (_, idx) => ({
      id: `msg-${idx}`,
      role: "user" as const,
      content: `Question ${idx}`,
      timestamp: Date.now(),
    }));

    saveChatHistory(many);
    const loaded = loadChatHistory();
    expect(loaded.length).toBe(50);
    expect(loaded[loaded.length - 1]?.content).toBe("Question 64");
  });
});

describe("AI Multi-Session Chat & 10-Chat Limit", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("enforces max 10 sessions limit", () => {
    const sessions = Array.from({ length: 15 }, (_, i) => ({
      ...createEmptySession(`Chat ${i}`),
      messages: [{ id: `m-${i}`, role: "user" as const, content: `Hi ${i}`, timestamp: Date.now() }],
    }));

    saveChatSessions(sessions);
    const loaded = loadChatSessions();
    expect(loaded.length).toBe(MAX_CHAT_SESSIONS);
    expect(loaded[0]?.title).toBe("Chat 0");
    expect(loaded[MAX_CHAT_SESSIONS - 1]?.title).toBe(`Chat ${MAX_CHAT_SESSIONS - 1}`);
  });

  it("preserves active chat session and its messages on page load/refresh", () => {
    // Simulate user having an active chat before refresh
    const initialSession = {
      ...createEmptySession("React Internals"),
      messages: [{ id: "1", role: "user" as const, content: "Explain React Fiber", timestamp: Date.now() }],
    };
    saveChatSessions([initialSession]);
    localStorage.setItem(STORAGE_KEYS.AI_ACTIVE_SESSION_ID, initialSession.id);

    // Page refresh occurs
    const { sessions, activeSessionId } = initializeSessionsOnPageLoad();

    expect(sessions.length).toBe(1);
    // Active session stays the exact same chat
    expect(activeSessionId).toBe(initialSession.id);
    expect(sessions[0]?.title).toBe("React Internals");
    expect(sessions[0]?.messages).toHaveLength(1);
    expect(sessions[0]?.messages[0]?.content).toBe("Explain React Fiber");
  });

  it("supports editing a previous user message with history truncation", () => {
    const session = createEmptySession("Initial Thread");
    session.messages = [
      { id: "u1", role: "user" as const, content: "First question", timestamp: 1 },
      { id: "a1", role: "assistant" as const, content: "First answer", timestamp: 2 },
      { id: "u2", role: "user" as const, content: "Second question", timestamp: 3 },
      { id: "a2", role: "assistant" as const, content: "Second answer", timestamp: 4 },
    ];

    // Editing message u1 should discard everything after u1 and replace u1
    const targetIdx = session.messages.findIndex((m) => m.id === "u1");
    expect(targetIdx).toBe(0);

    const priorHistory = session.messages.slice(0, targetIdx);
    const updatedUserMsg = {
      id: "u1-edited",
      role: "user" as const,
      content: "Edited first question",
      timestamp: 5,
    };
    const newHistory = [...priorHistory, updatedUserMsg];

    expect(newHistory).toHaveLength(1);
    expect(newHistory[0]?.content).toBe("Edited first question");

    // Editing message u2 should keep u1 and a1, discard a2
    const targetIdx2 = session.messages.findIndex((m) => m.id === "u2");
    expect(targetIdx2).toBe(2);

    const priorHistory2 = session.messages.slice(0, targetIdx2);
    const updatedUserMsg2 = {
      id: "u2-edited",
      role: "user" as const,
      content: "Edited second question",
      timestamp: 6,
    };
    const newHistory2 = [...priorHistory2, updatedUserMsg2];

    expect(newHistory2).toHaveLength(3);
    expect(newHistory2[0]?.content).toBe("First question");
    expect(newHistory2[1]?.content).toBe("First answer");
    expect(newHistory2[2]?.content).toBe("Edited second question");
  });
});

