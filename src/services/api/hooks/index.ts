import { useApiQuery } from "./useApi";
import { topicsApi } from "../endpoints/topicsApi";
import { codingApi } from "../endpoints/codingApi";
import { machineCodingApi } from "../endpoints/machineCodingApi";
import { systemDesignApi } from "../endpoints/systemDesignApi";
import type {
  Topic,
  Category,
  CodingProblem,
  MachineCodingProblem,
  SystemDesignProblem,
} from "@/types";

export * from "./useApi";

export function useTopics() {
  return useApiQuery<Topic[]>(() => topicsApi.getAll(), []);
}

export function useTopicsByCategory(category: string) {
  return useApiQuery<Topic[]>(
    () => topicsApi.getByCategory(category),
    [category],
  );
}

export function useTopic(id: string) {
  return useApiQuery<Topic | undefined>(
    () => topicsApi.getById(id),
    [id],
  );
}

export function useCategories() {
  return useApiQuery<Category[]>(() => topicsApi.getCategories(), []);
}

export function useCodingProblems() {
  return useApiQuery<CodingProblem[]>(() => codingApi.getAll(), []);
}

export function useCodingProblem(id: string) {
  return useApiQuery<CodingProblem | undefined>(
    () => codingApi.getById(id),
    [id],
  );
}

export function useMachineCodingProblems() {
  return useApiQuery<MachineCodingProblem[]>(
    () => machineCodingApi.getAll(),
    [],
  );
}

export function useMachineCodingProblem(id: string) {
  return useApiQuery<MachineCodingProblem | undefined>(
    () => machineCodingApi.getById(id),
    [id],
  );
}

export function useSystemDesignProblems() {
  return useApiQuery<SystemDesignProblem[]>(
    () => systemDesignApi.getAll(),
    [],
  );
}

export function useSystemDesignProblem(id: string) {
  return useApiQuery<SystemDesignProblem | undefined>(
    () => systemDesignApi.getById(id),
    [id],
  );
}
