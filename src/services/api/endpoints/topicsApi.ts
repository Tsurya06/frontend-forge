import { executeApiRequest } from "../middleware";
import { topicsMock } from "../mock/topicsMock";
import type { ITopicsService } from "../types";
import type { Topic, Category, Question } from "@/types";

export const topicsApi: ITopicsService = {
  async getAll(): Promise<Topic[]> {
    return executeApiRequest<Topic[]>(
      "/api/topics",
      () => topicsMock.getAll()
    );
  },

  async getByCategory(category: string): Promise<Topic[]> {
    return executeApiRequest<Topic[]>(
      `/api/topics?category=${encodeURIComponent(category)}`,
      () => topicsMock.getByCategory(category)
    );
  },

  async getById(id: string): Promise<Topic | undefined> {
    return executeApiRequest<Topic | undefined>(
      `/api/topics/${encodeURIComponent(id)}`,
      () => topicsMock.getById(id)
    );
  },

  async getCategories(): Promise<Category[]> {
    return executeApiRequest<Category[]>(
      "/api/categories",
      () => topicsMock.getCategories()
    );
  },

  async getQuestionById(id: string): Promise<Question | undefined> {
    return executeApiRequest<Question | undefined>(
      `/api/questions/${encodeURIComponent(id)}`,
      () => topicsMock.getQuestionById(id)
    );
  },
};
