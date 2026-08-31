import { transform } from 'sucrase';

export interface RunResult {
  logs: Array<{ type: 'log' | 'warn' | 'error' | 'info' | 'result'; text: string }>;
  executionTime: number;
  hasError: boolean;
}

/**
 * Transpiles TypeScript and JSX code to clean executable JavaScript using Sucrase.
 */
export function transpileToJS(code: string): string {
  try {
    const result = transform(code, {
      transforms: ['typescript', 'jsx'],
      disableESTransforms: true,
      production: true,
    });
    return result.code;
  } catch {
    // If sucrase fails, return raw code as fallback
    return code;
  }
}

/**
 * Formats any JavaScript value into a human-readable string.
 */
export function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Set) return `Set(${value.size}) { ${Array.from(value).map(formatValue).join(', ')} }`;
  if (value instanceof Map) {
    const entries = Array.from(value.entries()).map(([k, v]) => `${formatValue(k)} => ${formatValue(v)}`);
    return `Map(${value.size}) { ${entries.join(', ')} }`;
  }
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Circular Array]';
    }
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Circular Object]';
    }
  }
  return String(value);
}
