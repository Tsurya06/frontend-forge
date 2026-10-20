import { getSprintDay } from "@/data/interviewSprint";
import {
  getCodingProblemById,
  getMachineCodingProblemById,
  getSystemDesignProblemById,
  getTopicById,
} from "@/data";
import { STORAGE_KEYS } from "@/constants/storage";
import type { ActiveContext } from "./types";

export function extractActiveContext(pathname: string): ActiveContext {
  const selectedText = typeof window !== "undefined" ? window.getSelection()?.toString().trim() : undefined;

  // 1. 7-Day Sprint Lesson: /interview-sprint/:dayNumber
  const sprintMatch = pathname.match(/\/interview-sprint\/(\d+)/);
  if (sprintMatch && sprintMatch[1]) {
    const dayNum = parseInt(sprintMatch[1], 10);
    const dayLesson = getSprintDay(dayNum);
    if (dayLesson) {
      return {
        pageType: "lesson",
        title: `Day ${dayLesson.day}: ${dayLesson.title}`,
        subtitle: dayLesson.tagline,
        summary: dayLesson.beginnerOverview,
        details: [
          `Key Learning Objectives:\n${dayLesson.objectives.map((o) => `• ${o}`).join("\n")}`,
          `Core Architecture Topics:\n${dayLesson.sections.map((s) => `• ${s.heading}`).join("\n")}`,
          `Practical Coding Exercise: ${dayLesson.exercise.title} (${dayLesson.exercise.description})`,
        ].join("\n\n"),
        selectedText: selectedText || undefined,
      };
    }
  }

  // 1b. Sprint Overview or Mock Assessment
  if (pathname.includes("/interview-sprint/mock")) {
    return {
      pageType: "lesson",
      title: "Timed Technical Capstone Assessment",
      subtitle: "45-Minute Multi-Stage Frontend Evaluation",
      summary: "Comprehensive simulation covering Frontend System Design, Performance Debugging, Testing & Accessibility, and Architectural Trade-offs.",
      details: "Stage 1: Real-time Collaboration Dashboard\nStage 2: High-INP E-commerce Performance Bottleneck\nStage 3: Accessible Auto-Suggest Component\nStage 4: SSR vs CSR Architecture Trade-offs",
      selectedText: selectedText || undefined,
    };
  }

  if (pathname.includes("/interview-sprint")) {
    return {
      pageType: "lesson",
      title: "7-Day Frontend Architecture & Mastery Sprint",
      subtitle: "Comprehensive 7-Day Curriculum",
      summary: "Curriculum covering React rendering mechanics, hook patterns, Core Web Vitals, browser engines, enterprise a11y & security, testing, and capstone assessment.",
      selectedText: selectedText || undefined,
    };
  }

  // 2. JavaScript / React Coding Problem: /coding/:id
  const codingMatch = pathname.match(/\/coding\/([^/?#]+)/);
  if (codingMatch && codingMatch[1]) {
    const problemId = codingMatch[1];
    const problem = getCodingProblemById(problemId);
    let userCode: string | undefined;

    if (typeof window !== "undefined") {
      try {
        userCode = localStorage.getItem(STORAGE_KEYS.problemCode(problemId)) || undefined;
      } catch {
        // ignore storage read error
      }
    }

    if (problem) {
      return {
        pageType: "coding",
        title: problem.title,
        subtitle: `Difficulty: ${problem.difficulty} · Category: ${problem.category}`,
        summary: problem.problem,
        details: [
          problem.requirements && problem.requirements.length > 0
            ? `Requirements:\n${problem.requirements.map((r: string) => `• ${r}`).join("\n")}`
            : "",
          problem.edgeCases && problem.edgeCases.length > 0
            ? `Edge Cases:\n${problem.edgeCases.map((c: string) => `• ${c}`).join("\n")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        codeSnippet: userCode || problem.implementation || undefined,
        selectedText: selectedText || undefined,
      };
    }
  }

  // 3. Machine Coding Component: /machine-coding/:id
  const machineMatch = pathname.match(/\/machine-coding\/([^/?#]+)/);
  if (machineMatch && machineMatch[1]) {
    const problemId = machineMatch[1];
    const problem = getMachineCodingProblemById(problemId);
    let userCode: string | undefined;

    if (typeof window !== "undefined") {
      try {
        userCode = localStorage.getItem(STORAGE_KEYS.problemCode(problemId)) || undefined;
      } catch {
        // ignore
      }
    }

    if (problem) {
      return {
        pageType: "machine-coding",
        title: problem.title,
        subtitle: `Machine Coding · ${problem.difficulty}`,
        summary: problem.problemStatement,
        details: [
          problem.functionalRequirements && problem.functionalRequirements.length > 0
            ? `Functional Requirements:\n${problem.functionalRequirements.map((r: string) => `• ${r}`).join("\n")}`
            : "",
          problem.nonFunctionalRequirements && problem.nonFunctionalRequirements.length > 0
            ? `Non-Functional Requirements:\n${problem.nonFunctionalRequirements.map((r: string) => `• ${r}`).join("\n")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        codeSnippet: userCode || problem.implementation || undefined,
        selectedText: selectedText || undefined,
      };
    }
  }

  // 4. System Design: /system-design/:id
  const sysMatch = pathname.match(/\/system-design\/([^/?#]+)/);
  if (sysMatch && sysMatch[1]) {
    const designId = sysMatch[1];
    const item = getSystemDesignProblemById(designId);
    if (item) {
      return {
        pageType: "system-design",
        title: item.title,
        subtitle: `System Design · ${item.difficulty}`,
        summary: item.highLevelArchitecture || item.title,
        details: [
          item.requirements ? `Requirements:\n${item.requirements}` : "",
          item.constraints ? `Constraints:\n${item.constraints}` : "",
          item.componentArchitecture ? `Component Architecture:\n${item.componentArchitecture}` : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        selectedText: selectedText || undefined,
      };
    }
  }

  // 5. Topics: /topics/:id or /topics
  const topicMatch = pathname.match(/\/topics\/([^/?#]+)/);
  if (topicMatch && topicMatch[1] && topicMatch[1] !== "all") {
    const topic = getTopicById(topicMatch[1]);
    if (topic) {
      return {
        pageType: "topics",
        title: topic.title,
        subtitle: `Category: ${topic.category} · ${topic.difficulty}`,
        summary: topic.description,
        details: topic.questions
          ? `Key Topic Questions:\n${topic.questions.slice(0, 3).map((q) => `• ${q.question}`).join("\n")}`
          : undefined,
        selectedText: selectedText || undefined,
      };
    }
  }

  if (pathname.includes("/topics")) {
    return {
      pageType: "topics",
      title: "Frontend Engineering Knowledge Base",
      subtitle: "Curated Technical Deep Dives",
      summary: "Core JavaScript, TypeScript, React internals, CSS architecture, browser engines, web performance, and security principles.",
      selectedText: selectedText || undefined,
    };
  }

  // 6. Roadmap: /roadmap
  if (pathname.includes("/roadmap")) {
    return {
      pageType: "dashboard",
      title: "FrontendForge Engineering Roadmap",
      subtitle: "Study Plans & Curriculum Pillars",
      summary: "Structured learning tracks spanning 7-Day Mastery Sprint, 30-Day Topic Sprints, and Senior Engineering Guides.",
      selectedText: selectedText || undefined,
    };
  }

  // 7. Dashboard: /dashboard or Default
  return {
    pageType: "general",
    title: "FrontendForge Engineering Platform",
    subtitle: "Developer Workspace & Practice Hub",
    summary: "Interactive technical challenge platform with polyfills, machine coding components, system design blueprints, and mastery sprint lessons.",
    selectedText: selectedText || undefined,
  };
}
