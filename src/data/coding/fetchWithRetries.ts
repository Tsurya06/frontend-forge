import type { CodingProblem } from '../../types';

export const fetchWithRetriesProblem: CodingProblem = {
  id: 'coding-fetch-with-retries',
  title: 'Implement Fetch with Retries & Exponential Backoff',
  difficulty: 'Intermediate',
  category: 'Coding',
  tags: ['javascript', 'networking', 'promises', 'async', 'retry', 'exponential-backoff'],

  problem: `Implement a robust network request utility \`fetchWithRetries\` that automatically retries failed network requests with configurable retry count, exponential backoff delay, jitter, custom retry conditions, and request timeout.

Requirements:
1. \`fetchWithRetries(url, options, config)\`: Makes a fetch request to \`url\`.
2. **Retries & Backoff**: If the request fails (network error or non-2xx status code matching retry condition), retry up to \`maxRetries\` times (e.g. 3).
3. **Exponential Backoff**: Successive retry delays scale exponentially: $\\text{delay} = \\text{baseDelay} \\times 2^{\\text{attempt}} + \\text{jitter}$.
4. **Timeout**: Each individual attempt should abort after a configured \`timeoutMs\` (using \`AbortController\`).
5. **Retry Predicate**: Provide a \`shouldRetry(error, response)\` callback to avoid retrying non-transient 4xx errors (e.g., 400 Bad Request or 404 Not Found) while retrying transient errors (500, 502, 503, 504, 429, network timeouts).`,

  requirements: [
    'Configurable maxRetries (default 3)',
    'Exponential backoff delay calculation with random jitter',
    'Abort timeout per attempt using AbortController',
    'Custom shouldRetry callback to filter retryable errors vs fatal client errors',
    'Rejects with the final error if all retry attempts are exhausted',
  ],

  examples: [
    {
      input: `fetchWithRetries('https://api.example.com/data', {}, {\n  maxRetries: 3,\n  baseDelayMs: 1000,\n  timeoutMs: 3000\n})`,
      output: 'Resolves with response data if successful within 3 retries',
      explanation: 'Retries on transient failure with delays of ~1s, ~2s, ~4s.',
    },
  ],

  edgeCases: [
    'Non-retryable 4xx client errors (401, 403, 404): should fail fast without wasting retries',
    '429 Too Many Requests: should respect Retry-After header if present',
    'Network disconnection / timeout: abort signal cleans up correctly',
    'maxRetries = 0: attempts exactly once without retry',
  ],

  naiveApproach: `A naive loop with fixed delay (e.g. sleep 1000ms on error) can cause "thundering herd" problems where thousands of clients retry at the exact same millisecond, overwhelming an already struggling backend server.`,

  optimalApproach: `The optimal approach uses:
1. **Exponential Backoff**: $\\text{delay} = \\text{baseDelay} \\times 2^{\\text{attempt}}$.
2. **Full Jitter**: $\\text{actualDelay} = \\text{Math.random()} \\times \\text{delay}$ to distribute retry traffic evenly across time.
3. **AbortController**: Times out hung requests so slow connections do not block the retry loop indefinitely.
4. **Recursive or Loop Driver**: A clean loop tracking current attempt $0 \\dots N$.`,

  implementation: `async function fetchWithRetries(url, options = {}, config = {}) {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 10000,
    timeoutMs = 5000,
    shouldRetry = (err, res) => {
      if (err) return true; // Network errors
      if (res && (res.status >= 500 || res.status === 429)) return true;
      return false;
    }
  } = config;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      if (!shouldRetry(null, response) || attempt === maxRetries) {
        return response; // Return non-retryable response (e.g. 404) or final attempt
      }

      lastError = new Error(\`Request failed with status \${response.status}\`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      if (attempt === maxRetries || !shouldRetry(err, null)) {
        throw err;
      }
    }

    // Compute exponential backoff with jitter
    const exponentialDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
    const jitter = Math.random() * 0.5 * exponentialDelay;
    const finalDelay = exponentialDelay + jitter;

    await new Promise(resolve => setTimeout(resolve, finalDelay));
  }

  throw lastError;
}`,

  implementationTS: `export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  shouldRetry?: (error: unknown | null, response: Response | null) => boolean;
}

export async function fetchWithRetries(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 10000,
    timeoutMs = 5000,
    shouldRetry = (err, res) => {
      if (err) return true;
      if (res && (res.status >= 500 || res.status === 429)) return true;
      return false;
    }
  } = config;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok || !shouldRetry(null, response) || attempt === maxRetries) {
        return response;
      }

      lastError = new Error(\`HTTP \${response.status}\`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      if (attempt === maxRetries || !shouldRetry(err, null)) {
        throw err;
      }
    }

    const exponentialDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
    const jitter = Math.random() * 0.5 * exponentialDelay;
    const finalDelay = exponentialDelay + jitter;

    await new Promise(resolve => setTimeout(resolve, finalDelay));
  }

  throw lastError;
}`,

  stepByStep: [
    'Define retry configuration defaults (maxRetries=3, baseDelay=500ms, timeout=5000ms).',
    'Loop from attempt 0 to maxRetries.',
    'Set up AbortController with setTimeout to enforce per-request timeout.',
    'Execute fetch with controller.signal.',
    'Clear timeout immediately on response.',
    'If response is ok or non-retryable, return response.',
    'If attempt is exhausted, throw error.',
    'Calculate exponential backoff + jitter delay.',
    'Wait for delay using Promise-based setTimeout before next attempt.',
  ],

  timeComplexity: 'O(attempts) with total elapsed time bounded by sum of retry delays + timeouts.',
  spaceComplexity: 'O(1) auxiliary space.',

  alternativeSolutions: [
    'RxJS retryWhen / retry operator with backoff pipe',
    'Axios interceptor retry wrapper',
  ],

  commonMistakes: [
    'Retrying 400 or 404 client errors indefinitely.',
    'Forgetting to clear the timeout timer, causing memory leaks.',
    'Using deterministic delays without jitter, causing synchronized traffic spikes.',
  ],

  followUps: [
    'How do you parse and respect the Retry-After HTTP header?',
    'How would you implement circuit breaker pattern in conjunction with retries?',
    'How do you cancel subsequent retries if the component unmounts?',
  ],
};
