import {
  allMachineCodingProblems,
  getMachineCodingProblemById,
} from "@/data";
import type { IMachineCodingService } from "../types";
import type { MachineCodingProblem } from "@/types";

export const machineCodingMock: IMachineCodingService = {
  async getAll(): Promise<MachineCodingProblem[]> {
    return Promise.resolve([...allMachineCodingProblems]);
  },

  async getById(id: string): Promise<MachineCodingProblem | undefined> {
    return Promise.resolve(getMachineCodingProblemById(id));
  },
};
