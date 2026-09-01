import type { CodingProblem } from "../../types";

export const fetchWithRetriesProblem: CodingProblem = {
  id: "coding-fetch-with-retries",
  title: "Implement Fetch with Retries & Exponential Backoff",
  difficulty: "Intermediate",
  category: "Coding",
  tags: [
    "javascript",
    "networking",
    "promises",
    "async",
    "retry",
    "exponential-backoff",
  ],

  problem: `Implement a robust network request utility \`fetchWithRetries\` that automatically retries failed network requests with configurable retry count, exponential backoff delay, jitter, custom retry conditions, and request timeout.

Requirements:
1. \`fetchWithRetries(url, options, config)\`: Makes a fetch request to \`url\`.
2. **Retries & Backoff**: If the request fails (network error or non-2xx status code matching retry condition), retry up to \`maxRetries\` times (e.g. 3).
3. **Exponential Backoff**: Successive retry delays scale exponentially: $\\text{delay} = \\text{baseDelay} \\times 2^{\\text{attempt}} + \\text{jitter}$.
4. **Timeout**: Each individual attempt should abort after a configured \`timeoutMs\` (using \`AbortController\`).
5. **Retry Predicate**: Provide a \`shouldRetry(error, response)\` callback to avoid retrying non-transient 4xx errors (e.g., 400 Bad Request or 404 Not Found) while retrying transient errors (500, 502, 503, 504, 429, network timeouts).`,

  requirements: [
    "Configurable maxRetries (default 3)",
    "Exponential backoff delay calculation with random jitter",
    "Abort timeout per attempt using AbortController",
    "Custom shouldRetry callback to filter retryable errors vs fatal client errors",
    "Rejects with the final error if all retry attempts are exhausted",
  ],

  examples: [
    {
      input: `fetchWithRetries('https://api.example.com/data', {}, {\n  maxRetries: 3,\n  baseDelayMs: 1000,\n  timeoutMs: 3000\n})`,
      output: "Resolves with response data if successful within 3 retries",
      explanation: "Retries on transient failure with delays of ~1s, ~2s, ~4s.",
    },
  ],

  edgeCases: [
    "Non-retryable 4xx client errors (401, 403, 404): should fail fast without wasting retries",
    "429 Too Many Requests: should respect Retry-After header if present",
    "Network disconnection / timeout: abort signal cleans up correctly",
    "maxRetries = 0: attempts exactly once without retry",
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

  theoryAndConcepts:
    "WHY RETRY REQUESTS?\n-------------------\nNetwork requests can fail temporarily due to:\n- Network glitches\n- Server overload\n- Rate limiting\n- Timeout\n\nRETRY STRATEGIES:\n-----------------\n1. Fixed delay: Wait same time between retries\n2. Exponential backoff: Increase delay each time (1s, 2s, 4s, 8s)\n3. Jitter: Add randomness to prevent thundering herd\n\nWHY CACHE REQUESTS?\n-------------------\n- Reduce server load\n- Faster responses\n- Offline support\n- Save bandwidth\n\nCACHE STRATEGIES:\n-----------------\n1. Cache-first: Check cache, then network\n2. Network-first: Try network, fallback to cache\n3. Stale-while-revalidate: Return cached, update in background",
  beginnerApproach: "Beginner: Simple retry with fixed delay",
  beginnerImplementation:
    "async function fetchWithRetryBeginner(url, retries = 3, delay = 1000) {\n  for (let attempt = 0; attempt <= retries; attempt++) {\n    try {\n      const response = await fetch(url);\n      \n      if (!response.ok) {\n        throw new Error(`HTTP ${response.status}`);\n      }\n      \n      return response;\n    } catch (error) {\n      // Last attempt - throw error\n      if (attempt === retries) {\n        throw error;\n      }\n      \n      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);\n      await new Promise(resolve => setTimeout(resolve, delay));\n    }\n  }\n}\n\n// Test\nconsole.log('=== BEGINNER RETRY ===');\nconsole.log('fetchWithRetryBeginner(url, retries=3, delay=1000)');",
  intermediateApproach: "Intermediate: Retry with exponential backoff",
  intermediateImplementation:
    "async function fetchWithRetryIntermediate(url, options = {}) {\n  const {\n    retries = 3,\n    baseDelay = 1000,\n    maxDelay = 30000,\n    backoffFactor = 2,\n    retryOn = [408, 429, 500, 502, 503, 504], // Status codes to retry\n    onRetry = null,\n    ...fetchOptions\n  } = options;\n  \n  let lastError;\n  \n  for (let attempt = 0; attempt <= retries; attempt++) {\n    try {\n      const response = await fetch(url, fetchOptions);\n      \n      // Check if should retry based on status\n      if (!response.ok && retryOn.includes(response.status)) {\n        throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n      }\n      \n      return response;\n    } catch (error) {\n      lastError = error;\n      \n      if (attempt === retries) {\n        throw error;\n      }\n      \n      // Calculate delay with exponential backoff\n      const delay = Math.min(\n        baseDelay * Math.pow(backoffFactor, attempt),\n        maxDelay\n      );\n      \n      // Add jitter (\u00b125%)\n      const jitter = delay * (0.75 + Math.random() * 0.5);\n      \n      onRetry?.({\n        attempt: attempt + 1,\n        delay: jitter,\n        error\n      });\n      \n      await new Promise(resolve => setTimeout(resolve, jitter));\n    }\n  }\n  \n  throw lastError;\n}",
  expertApproach: "Expert: Full-featured fetch with retry + cache",
  expertImplementation:
    "class SmartFetch {\n  constructor(options = {}) {\n    this.cache = new Map();\n    this.inFlight = new Map();\n    this.defaultOptions = {\n      retries: 3,\n      baseDelay: 1000,\n      maxDelay: 30000,\n      backoffFactor: 2,\n      cacheTTL: 60000,\n      cacheMaxSize: 100,\n      retryOn: [408, 429, 500, 502, 503, 504],\n      timeout: 30000,\n      ...options\n    };\n  }\n  \n  async fetch(url, options = {}) {\n    const opts = { ...this.defaultOptions, ...options };\n    const {\n      retries,\n      baseDelay,\n      maxDelay,\n      backoffFactor,\n      cacheTTL,\n      retryOn,\n      timeout,\n      forceRefresh,\n      cacheStrategy,\n      onRetry,\n      ...fetchOptions\n    } = opts;\n    \n    const cacheKey = this._generateKey(url, fetchOptions);\n    \n    // Cache-first strategy\n    if (cacheStrategy !== 'network-first' && !forceRefresh) {\n      const cached = this._getFromCache(cacheKey);\n      \n      if (cached) {\n        // Stale-while-revalidate\n        if (cacheStrategy === 'stale-while-revalidate') {\n          this._revalidateInBackground(url, fetchOptions, cacheKey, cacheTTL);\n        }\n        return cached;\n      }\n    }\n    \n    // Deduplicate concurrent requests\n    if (this.inFlight.has(cacheKey)) {\n      return this.inFlight.get(cacheKey);\n    }\n    \n    // Make request with retry\n    const promise = this._fetchWithRetry(url, {\n      fetchOptions,\n      retries,\n      baseDelay,\n      maxDelay,\n      backoffFactor,\n      retryOn,\n      timeout,\n      onRetry\n    }).then(data => {\n      this._setCache(cacheKey, data, cacheTTL);\n      return data;\n    });\n    \n    this.inFlight.set(cacheKey, promise);\n    \n    try {\n      return await promise;\n    } catch (error) {\n      // Network-first: Try cache on failure\n      if (cacheStrategy === 'network-first') {\n        const cached = this._getFromCache(cacheKey);\n        if (cached) return cached;\n      }\n      throw error;\n    } finally {\n      this.inFlight.delete(cacheKey);\n    }\n  }\n  \n  async _fetchWithRetry(url, config) {\n    const {\n      fetchOptions,\n      retries,\n      baseDelay,\n      maxDelay,\n      backoffFactor,\n      retryOn,\n      timeout,\n      onRetry\n    } = config;\n    \n    let lastError;\n    \n    for (let attempt = 0; attempt <= retries; attempt++) {\n      try {\n        // Create abort controller for timeout\n        const controller = new AbortController();\n        const timeoutId = setTimeout(() => controller.abort(), timeout);\n        \n        const response = await fetch(url, {\n          ...fetchOptions,\n          signal: controller.signal\n        });\n        \n        clearTimeout(timeoutId);\n        \n        if (!response.ok && retryOn.includes(response.status)) {\n          throw new Error(`HTTP ${response.status}`);\n        }\n        \n        if (!response.ok) {\n          throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n        }\n        \n        return await response.json();\n      } catch (error) {\n        lastError = error;\n        \n        if (attempt === retries) break;\n        \n        // Don't retry abort errors (timeout)\n        if (error.name === 'AbortError') {\n          lastError = new Error('Request timeout');\n          break;\n        }\n        \n        const delay = Math.min(\n          baseDelay * Math.pow(backoffFactor, attempt),\n          maxDelay\n        );\n        const jitter = delay * (0.75 + Math.random() * 0.5);\n        \n        onRetry?.({ attempt: attempt + 1, delay: jitter, error });\n        \n        await new Promise(r => setTimeout(r, jitter));\n      }\n    }\n    \n    throw lastError;\n  }\n  \n  async _revalidateInBackground(url, fetchOptions, cacheKey, ttl) {\n    try {\n      const response = await fetch(url, fetchOptions);\n      if (response.ok) {\n        const data = await response.json();\n        this._setCache(cacheKey, data, ttl);\n      }\n    } catch {\n      // Silently fail background revalidation\n    }\n  }\n  \n  _generateKey(url, options = {}) {\n    return `${options.method || 'GET'}:${url}`;\n  }\n  \n  _getFromCache(key) {\n    const entry = this.cache.get(key);\n    if (entry && Date.now() < entry.expiresAt) {\n      return entry.data;\n    }\n    return null;\n  }\n  \n  _setCache(key, data, ttl) {\n    if (this.cache.size >= this.defaultOptions.cacheMaxSize) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    \n    this.cache.set(key, {\n      data,\n      expiresAt: Date.now() + ttl\n    });\n  }\n  \n  // Utility methods\n  clearCache() {\n    this.cache.clear();\n  }\n  \n  invalidate(url) {\n    for (const key of this.cache.keys()) {\n      if (key.includes(url)) {\n        this.cache.delete(key);\n      }\n    }\n  }\n}\n\n// Test Expert Level\nconsole.log('\\n=== EXPERT LEVEL ===');\n\nconst smartFetch = new SmartFetch({\n  cacheTTL: 5000,\n  retries: 3,\n  timeout: 10000,\n  onRetry: ({ attempt, delay, error }) => {\n    console.log(`Retry ${attempt} in ${Math.round(delay)}ms: ${error.message}`);\n  }\n});\n\n// Usage example\nasync function fetchUser(id) {\n  return smartFetch.fetch(`/api/users/${id}`, {\n    cacheStrategy: 'stale-while-revalidate'\n  });\n}",
  interviewTraps: [
    "QUICK REFERENCE:",
    "1. Use exponential backoff",
    "2. Add jitter to prevent thundering herd",
    "3. Don't retry client errors (4xx)",
    "4. Respect Retry-After header",
    "1. Include method and body in cache key",
    "2. Deduplicate concurrent requests",
    "3. Implement TTL for freshness",
  ],
  stepByStep: [
    "Define retry configuration defaults (maxRetries=3, baseDelay=500ms, timeout=5000ms).",
    "Loop from attempt 0 to maxRetries.",
    "Set up AbortController with setTimeout to enforce per-request timeout.",
    "Execute fetch with controller.signal.",
    "Clear timeout immediately on response.",
    "If response is ok or non-retryable, return response.",
    "If attempt is exhausted, throw error.",
    "Calculate exponential backoff + jitter delay.",
    "Wait for delay using Promise-based setTimeout before next attempt.",
  ],

  timeComplexity:
    "O(attempts) with total elapsed time bounded by sum of retry delays + timeouts.",
  spaceComplexity: "O(1) auxiliary space.",

  alternativeSolutions: [
    "RxJS retryWhen / retry operator with backoff pipe",
    "Axios interceptor retry wrapper",
  ],

  commonMistakes: [
    "Retrying 400 or 404 client errors indefinitely.",
    "Forgetting to clear the timeout timer, causing memory leaks.",
    "Using deterministic delays without jitter, causing synchronized traffic spikes.",
  ],

  followUps: [
    "How do you parse and respect the Retry-After HTTP header?",
    "How would you implement circuit breaker pattern in conjunction with retries?",
    "How do you cancel subsequent retries if the component unmounts?",
  ],
};
