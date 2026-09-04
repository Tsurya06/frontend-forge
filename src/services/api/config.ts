export interface ApiConfig {
  readonly baseUrl: string;
  readonly useMockData: boolean;
  readonly timeoutMs: number;
}

export const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, ""),
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== "false",
  timeoutMs: 15000,
};
