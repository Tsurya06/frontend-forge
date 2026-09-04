import { useState, useEffect, useCallback, useRef } from "react";

export interface UseApiQueryResult<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: readonly unknown[] = [],
): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFnRef.current();
      setData(result);
    } catch (err: unknown) {
      setData(null);
      const formatted =
        err instanceof Error ? err : new Error(String(err));
      setError(formatted);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, execute]);

  return { data, loading, error, refetch: execute };
}

export const useApi = useApiQuery;
