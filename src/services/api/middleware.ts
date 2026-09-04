import { API_CONFIG } from "./config";
import { fetchApi } from "./client";
import type { ApiError } from "./types";

export interface ApiRequestContext<T> {
  readonly endpoint: string;
  readonly mockResolver: () => Promise<T>;
  readonly options?: RequestInit;
}

export type ApiMiddleware = <T>(
  ctx: ApiRequestContext<T>,
  next: () => Promise<T>
) => Promise<T>;

const middlewares: ApiMiddleware[] = [];

export function useApiMiddleware(middleware: ApiMiddleware): void {
  middlewares.push(middleware);
}

/**
 * Core execution handler:
 * Simple if / else condition driven purely by .env (VITE_USE_MOCK_DATA).
 */
async function coreApiHandler<T>(ctx: ApiRequestContext<T>): Promise<T> {
  if (API_CONFIG.useMockData) {
    // Flag is ON (default): return mock data
    return await ctx.mockResolver();
  } else {
    // Flag is OFF: forward to backend endpoint, never fallback to mock
    try {
      return await fetchApi<T>(ctx.endpoint, ctx.options);
    } catch (err) {
      const apiError: ApiError = {
        message: `Backend API unavailable: ${err instanceof Error ? err.message : String(err)}`,
        status: 503,
        code: "BACKEND_UNAVAILABLE",
      };
      throw apiError;
    }
  }
}

export async function executeApiRequest<T>(
  endpoint: string,
  mockResolver: () => Promise<T>,
  options?: RequestInit
): Promise<T> {
  const ctx: ApiRequestContext<T> = {
    endpoint,
    mockResolver,
    options,
  };

  let index = -1;
  const dispatch = async (i: number): Promise<T> => {
    if (i <= index) throw new Error("next() called multiple times in middleware");
    index = i;
    const fn = middlewares[i];
    if (fn) {
      return fn(ctx, () => dispatch(i + 1));
    }
    return coreApiHandler(ctx);
  };

  return dispatch(0);
}
