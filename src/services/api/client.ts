import { API_CONFIG } from "./config";
import type { ApiError } from "./types";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorPayload: Partial<ApiError> = await response
        .json()
        .catch(() => ({}));
      const error: ApiError = {
        message:
          errorPayload.message ||
          `Request failed with status ${response.status}`,
        status: response.status,
        code: errorPayload.code,
      };
      throw error;
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "message" in err && (err as Error).name === "AbortError") {
      throw {
        message: `Request timed out after ${API_CONFIG.timeoutMs}ms`,
        code: "TIMEOUT",
      } satisfies ApiError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
