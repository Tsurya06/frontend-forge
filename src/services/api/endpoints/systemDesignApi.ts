import { executeApiRequest } from "../middleware";
import { systemDesignMock } from "../mock/systemDesignMock";
import type { ISystemDesignService } from "../types";
import type { SystemDesignProblem } from "@/types";

export const systemDesignApi: ISystemDesignService = {
  async getAll(): Promise<SystemDesignProblem[]> {
    return executeApiRequest<SystemDesignProblem[]>(
      "/api/system-design",
      () => systemDesignMock.getAll()
    );
  },

  async getById(id: string): Promise<SystemDesignProblem | undefined> {
    return executeApiRequest<SystemDesignProblem | undefined>(
      `/api/system-design/${encodeURIComponent(id)}`,
      () => systemDesignMock.getById(id)
    );
  },
};
