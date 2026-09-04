import { executeApiRequest } from "../middleware";
import { codingMock } from "../mock/codingMock";
import type { ICodingService } from "../types";
import type { CodingProblem } from "@/types";

export const codingApi: ICodingService = {
  async getAll(): Promise<CodingProblem[]> {
    return executeApiRequest<CodingProblem[]>(
      "/api/coding",
      () => codingMock.getAll()
    );
  },

  async getById(id: string): Promise<CodingProblem | undefined> {
    return executeApiRequest<CodingProblem | undefined>(
      `/api/coding/${encodeURIComponent(id)}`,
      () => codingMock.getById(id)
    );
  },
};
