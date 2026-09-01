import { useMemo } from "react";
import type {
  Topic,
  Question,
  CodingProblem,
  MachineCodingProblem,
  Difficulty,
} from "@/types";

interface SearchSource {
  topics?: Topic[];
  questions?: Question[];
  codingProblems?: CodingProblem[];
  machineCodingProblems?: MachineCodingProblem[];
}

export interface SearchResultItem {
  type: "topic" | "question" | "coding" | "machineCoding";
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
}

export interface SearchResults {
  topics: SearchResultItem[];
  questions: SearchResultItem[];
  codingProblems: SearchResultItem[];
  machineCodingProblems: SearchResultItem[];
  total: number;
}

const EMPTY_RESULTS: SearchResults = {
  topics: [],
  questions: [],
  codingProblems: [],
  machineCodingProblems: [],
  total: 0,
};

function matches(text: string, query: string): boolean {
  return text.toLowerCase().includes(query);
}

function matchesAny(fields: string[], query: string): boolean {
  return fields.some((f) => matches(f, query));
}

export function useSearch(query: string, sources: SearchSource): SearchResults {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return EMPTY_RESULTS;

    const topics: SearchResultItem[] = (sources.topics ?? [])
      .filter((t) =>
        matchesAny([t.title, t.description, t.category, ...t.tags], trimmed),
      )
      .map((t) => ({
        type: "topic" as const,
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        difficulty: t.difficulty,
      }));

    const questions: SearchResultItem[] = (sources.questions ?? [])
      .filter((q) =>
        matchesAny([q.question, q.shortAnswer, q.category, ...q.tags], trimmed),
      )
      .map((q) => ({
        type: "question" as const,
        id: q.id,
        title: q.question,
        description: q.shortAnswer,
        category: q.category,
        difficulty: q.difficulty,
      }));

    const codingProblems: SearchResultItem[] = (sources.codingProblems ?? [])
      .filter((p) =>
        matchesAny([p.title, p.problem, p.category, ...p.tags], trimmed),
      )
      .map((p) => ({
        type: "coding" as const,
        id: p.id,
        title: p.title,
        description: p.problem,
        category: p.category,
        difficulty: p.difficulty,
      }));

    const machineCodingProblems: SearchResultItem[] = (
      sources.machineCodingProblems ?? []
    )
      .filter((p) =>
        matchesAny(
          [p.title, p.problemStatement, p.category, ...p.tags],
          trimmed,
        ),
      )
      .map((p) => ({
        type: "machineCoding" as const,
        id: p.id,
        title: p.title,
        description: p.problemStatement,
        category: p.category,
        difficulty: p.difficulty,
      }));

    return {
      topics,
      questions,
      codingProblems,
      machineCodingProblems,
      total:
        topics.length +
        questions.length +
        codingProblems.length +
        machineCodingProblems.length,
    };
  }, [query, sources]);
}
