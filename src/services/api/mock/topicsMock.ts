import {
  allTopics,
  categories,
  getTopicsByCategory,
  getTopicById,
  getQuestionById,
} from "@/data";
import type { ITopicsService } from "../types";
import type { Topic, Category, Question } from "@/types";

export const topicsMock: ITopicsService = {
  async getAll(): Promise<Topic[]> {
    return Promise.resolve([...allTopics]);
  },

  async getByCategory(category: string): Promise<Topic[]> {
    return Promise.resolve(getTopicsByCategory(category));
  },

  async getById(id: string): Promise<Topic | undefined> {
    return Promise.resolve(getTopicById(id));
  },

  async getCategories(): Promise<Category[]> {
    return Promise.resolve([...categories]);
  },

  async getQuestionById(id: string): Promise<Question | undefined> {
    return Promise.resolve(getQuestionById(id));
  },
};
