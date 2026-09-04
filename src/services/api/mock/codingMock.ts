import { allCodingProblems, getCodingProblemById } from "@/data";
import type { ICodingService } from "../types";
import type { CodingProblem } from "@/types";

export const codingMock: ICodingService = {
  async getAll(): Promise<CodingProblem[]> {
    return Promise.resolve([...allCodingProblems]);
  },

  async getById(id: string): Promise<CodingProblem | undefined> {
    return Promise.resolve(getCodingProblemById(id));
  },
};
