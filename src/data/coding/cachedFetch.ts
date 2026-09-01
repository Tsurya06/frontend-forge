import type { CodingProblem } from "../../types";

export const cachedFetchProblem: CodingProblem = {
  id: "coding-cached-fetch",
  title: "Implement Cached Fetch with TTL & Request Deduplication",
  difficulty: "Intermediate",
  category: "Coding",
  tags: ["javascript", "networking", "caching", "fetch", "async", "promises"],

  problem: `Implement a higher-order wrapper \`createCachedFetch\` (or \`cachedFetch\`) that caches network responses in memory with a Time-To-Live (TTL) expiration and prevents duplicate concurrent in-flight requests for the same URL (request coalescing / deduplication).

Requirements:
1. \`cachedFetch(url, options, ttlMs)\`: If a valid cached response exists for the URL and hasn't expired, return the cached data without making a network request.
2. **In-flight Deduplication**: If multiple calls for the same URL occur simultaneously while a request is already pending, all callers should receive the promise of that single in-flight request rather than firing multiple duplicate HTTP calls.
3. **TTL Expiration**: Expired cache entries must be evicted and a fresh network request made on subsequent calls.
4. **Cache Invalidation**: Provide a method to manually clear or invalidate the cache for a specific key or all keys.`,

  requirements: [
    "Cache successful responses in memory with configurable TTL",
    "Coalesce duplicate in-flight requests to share a single pending Promise",
    "Purge or bypass expired cache entries automatically",
    "Do not cache failed/rejected network requests",
    "Expose clearCache(url?) helper to invalidate cache",
  ],

  examples: [
    {
      input: `const cachedFetch = createCachedFetch();\n// 1st call fires fetch\nconst p1 = cachedFetch('/api/user', {}, 5000);\n// 2nd call (same millisecond) shares in-flight promise\nconst p2 = cachedFetch('/api/user', {}, 5000);\n// p1 === p2`,
      output: "true (single network call dispatched)",
      explanation:
        "Concurrent requests for the same URL share the in-flight promise.",
    },
    {
      input: `// Call again after 2 seconds (within 5s TTL)\nconst data = await cachedFetch('/api/user', {}, 5000);`,
      output: "Cached response returned immediately without network fetch",
      explanation: "The cached entry is valid and within the TTL.",
    },
  ],

  edgeCases: [
    "Failed network request (network error or non-200 HTTP status): do NOT cache the error, allow retry immediately",
    "Multiple simultaneous requests for same resource: share the exact same promise",
    "TTL of 0: bypasses cache or only performs in-flight deduplication",
    "Complex URL parameters or request headers: key should incorporate method/body if supporting non-GET requests",
  ],

  naiveApproach: `A naive approach might only store the resolved response object in a plain Map with a timestamp. This fails during concurrent requests because multiple calls arriving before the first one completes will all find a cache miss and fire duplicate network requests.`,

  optimalApproach: `The optimal approach uses a dual-entry cache map storing either the **in-flight Promise** or the **resolved data with expiration timestamp**:
1. Check if \`inFlightMap.has(cacheKey)\`. If so, return that pending promise.
2. Check if \`dataCache.has(cacheKey)\` and \`Date.now() < entry.expiry\`. If valid, return \`Promise.resolve(entry.data)\`.
3. Otherwise, create a new fetch promise.
4. Store the promise in \`inFlightMap\`.
5. On resolution:
   - Save \`{ data: result, expiry: Date.now() + ttl }\` in \`dataCache\`.
   - Remove key from \`inFlightMap\`.
   - Return \`result\`.
6. On rejection:
   - Remove key from \`inFlightMap\` so subsequent calls can retry.
   - Re-throw error.`,

  implementation: `function createCachedFetch() {
  const cache = new Map();
  const inFlight = new Map();

  async function cachedFetch(url, options = {}, ttlMs = 60000) {
    const key = typeof url === 'string' ? url : url.toString();

    // 1. Check in-flight requests (coalescing)
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    // 2. Check cached data
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (Date.now() < entry.expiry) {
        return entry.data;
      }
      cache.delete(key); // Expired
    }

    // 3. Initiate fetch
    const fetchPromise = (async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();

        // Store in cache with TTL
        if (ttlMs > 0) {
          cache.set(key, {
            data,
            expiry: Date.now() + ttlMs,
          });
        }
        return data;
      } finally {
        // Clean up in-flight tracker
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, fetchPromise);
    return fetchPromise;
  }

  cachedFetch.clear = function(url) {
    if (url) {
      cache.delete(url);
      inFlight.delete(url);
    } else {
      cache.clear();
      inFlight.clear();
    }
  };

  return cachedFetch;
}`,

  implementationTS: `export interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export function createCachedFetch() {
  const cache = new Map<string, CacheEntry<any>>();
  const inFlight = new Map<string, Promise<any>>();

  async function cachedFetch<T = any>(
    url: string,
    options: RequestInit = {},
    ttlMs: number = 60000
  ): Promise<T> {
    const key = url;

    if (inFlight.has(key)) {
      return inFlight.get(key) as Promise<T>;
    }

    if (cache.has(key)) {
      const entry = cache.get(key)!;
      if (Date.now() < entry.expiry) {
        return entry.data as T;
      }
      cache.delete(key);
    }

    const fetchPromise = (async (): Promise<T> => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();

        if (ttlMs > 0) {
          cache.set(key, {
            data,
            expiry: Date.now() + ttlMs,
          });
        }
        return data as T;
      } finally {
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, fetchPromise);
    return fetchPromise;
  }

  cachedFetch.clear = (url?: string) => {
    if (url) {
      cache.delete(url);
      inFlight.delete(url);
    } else {
      cache.clear();
      inFlight.clear();
    }
  };

  return cachedFetch;
}`,

  stepByStep: [
    "Create internal Map for cached entries and Map for in-flight promises.",
    "On incoming request, check if key is in inFlight map. If so, return existing promise.",
    "Check if key is in cache map and verify timestamp against Date.now(). Return cached data if unexpired.",
    "If expired or not in cache, construct asynchronous fetch wrapper.",
    "Register promise in inFlight map.",
    "Execute fetch, parse JSON, and store result with expiry in cache.",
    "In finally block, delete key from inFlight map.",
    "Return resolved result to caller.",
  ],

  timeComplexity: "O(1) lookup and cache insertion time.",
  spaceComplexity: "O(K) where K is the number of distinct cached URLs.",

  alternativeSolutions: [
    "Using LRU cache eviction policy for memory-constrained environments",
    "ServiceWorker Cache API for persistent cross-session HTTP caching",
  ],

  commonMistakes: [
    "Caching failed network responses, preventing recovery on transient network errors.",
    "Not clearing in-flight entry on rejection, causing subsequent requests to be stuck with the failed promise.",
    "Not cloning response stream if multiple callers read raw Response body.",
  ],

  followUps: [
    "How would you implement an LRU (Least Recently Used) cache with maximum capacity?",
    "How would you support Stale-While-Revalidate caching strategy?",
    "How would you generate cache keys for POST/GraphQL queries?",
  ],
};
