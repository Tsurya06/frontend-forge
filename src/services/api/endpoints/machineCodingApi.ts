import { executeApiRequest } from "../middleware";
import { machineCodingMock } from "../mock/machineCodingMock";
import type { IMachineCodingService } from "../types";
import type { MachineCodingProblem } from "@/types";

export const machineCodingApi: IMachineCodingService = {
  async getAll(): Promise<MachineCodingProblem[]> {
    return executeApiRequest<MachineCodingProblem[]>(
      "/api/machine-coding",
      () => machineCodingMock.getAll()
    );
  },

  async getById(id: string): Promise<MachineCodingProblem | undefined> {
    return executeApiRequest<MachineCodingProblem | undefined>(
      `/api/machine-coding/${encodeURIComponent(id)}`,
      () => machineCodingMock.getById(id)
    );
  },
};
