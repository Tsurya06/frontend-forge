import { topicsApi } from "./endpoints/topicsApi";
import { codingApi } from "./endpoints/codingApi";
import { machineCodingApi } from "./endpoints/machineCodingApi";
import { systemDesignApi } from "./endpoints/systemDesignApi";
import type { IApiService } from "./types";

export const api: IApiService = {
  topics: topicsApi,
  coding: codingApi,
  machineCoding: machineCodingApi,
  systemDesign: systemDesignApi,
};

export { topicsApi } from "./endpoints/topicsApi";
export { codingApi } from "./endpoints/codingApi";
export { machineCodingApi } from "./endpoints/machineCodingApi";
export { systemDesignApi } from "./endpoints/systemDesignApi";

export { API_CONFIG } from "./config";
export { executeApiRequest, useApiMiddleware } from "./middleware";
export * from "./types";
export * from "./client";
export * from "./hooks";

export default api;
