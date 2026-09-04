import { describe, it, expect, afterEach, vi } from "vitest";
import { api, API_CONFIG } from "@/services/api";

describe("Centralized API Service Layer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should have correct default configuration from .env", () => {
    expect(API_CONFIG.useMockData).toBe(true);
    expect(typeof API_CONFIG.timeoutMs).toBe("number");
  });

  describe("Flag-based Data Passing & Centralized Middleware", () => {
    it("should return mock data when useMockData is true", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network connection refused"));

      const problems = await api.coding.getAll();
      expect(Array.isArray(problems)).toBe(true);
      expect(problems.length).toBeGreaterThan(0);
    });

    it("should reject and NOT fallback to mock data when flag is OFF and backend fails", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network connection refused"));

      // Simulate VITE_USE_MOCK_DATA=false
      const originalFlag = API_CONFIG.useMockData;
      Object.defineProperty(API_CONFIG, "useMockData", { value: false, configurable: true });

      try {
        await expect(api.coding.getAll()).rejects.toMatchObject({
          code: "BACKEND_UNAVAILABLE",
        });
      } finally {
        Object.defineProperty(API_CONFIG, "useMockData", { value: originalFlag, configurable: true });
      }
    });
  });

  describe("Topics API", () => {
    it("should fetch all topics", async () => {
      const topics = await api.topics.getAll();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(50);
    });

    it("should fetch topics by category", async () => {
      const jsTopics = await api.topics.getByCategory("javascript");
      expect(jsTopics.length).toBeGreaterThan(0);
      jsTopics.forEach((t) => {
        expect(t.category.toLowerCase()).toBe("javascript");
      });
    });

    it("should fetch a topic by id", async () => {
      const topic = await api.topics.getById("js-async");
      expect(topic).toBeDefined();
      expect(topic?.id).toBe("js-async");
      expect(topic?.title).toContain("Asynchronous JavaScript");
    });

    it("should fetch all categories with counts", async () => {
      const categories = await api.topics.getCategories();
      expect(categories.length).toBeGreaterThan(10);
      const jsCat = categories.find((c) => c.id === "javascript");
      expect(jsCat).toBeDefined();
      expect(jsCat?.topicCount).toBeGreaterThan(0);
    });
  });

  describe("Coding API", () => {
    it("should fetch all coding problems", async () => {
      const problems = await api.coding.getAll();
      expect(problems.length).toBeGreaterThanOrEqual(30);
    });

    it("should fetch coding problem by id", async () => {
      const problem = await api.coding.getById("debounce");
      expect(problem).toBeDefined();
      expect(problem?.id).toBe("coding-debounce");
      expect(problem?.title.toLowerCase()).toContain("debounce");
    });
  });

  describe("Machine Coding API", () => {
    it("should fetch all machine coding problems", async () => {
      const problems = await api.machineCoding.getAll();
      expect(problems.length).toBe(35);
    });

    it("should fetch machine coding problem by id", async () => {
      const problem = await api.machineCoding.getById("mc-popover");
      expect(problem).toBeDefined();
      expect(problem?.id).toBe("mc-popover");
    });
  });

  describe("System Design API", () => {
    it("should fetch all system design problems", async () => {
      const problems = await api.systemDesign.getAll();
      expect(problems.length).toBeGreaterThanOrEqual(9);
    });

    it("should fetch system design problem by id", async () => {
      const problem = await api.systemDesign.getById("sd-autocomplete");
      expect(problem).toBeDefined();
      expect(problem?.id).toBe("sd-autocomplete");
    });
  });
});
