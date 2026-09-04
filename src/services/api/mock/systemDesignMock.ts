import {
  allSystemDesignProblems,
  getSystemDesignProblemById,
} from "@/data";
import type { ISystemDesignService } from "../types";
import type { SystemDesignProblem } from "@/types";

export const systemDesignMock: ISystemDesignService = {
  async getAll(): Promise<SystemDesignProblem[]> {
    return Promise.resolve([...allSystemDesignProblems]);
  },

  async getById(id: string): Promise<SystemDesignProblem | undefined> {
    return Promise.resolve(getSystemDesignProblemById(id));
  },
};
