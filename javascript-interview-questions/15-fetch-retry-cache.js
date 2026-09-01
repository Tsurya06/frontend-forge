/**
 * ============================================
 * FETCH WITH RETRY & CACHE - Complete Guide
 * ============================================
 * 
 * Topic: Implement cached fetch requests and fetch with retries
 */

// ============================================
// THEORY & CONCEPTS
// ============================================

/**
 * WHY RETRY REQUESTS?
 * -------------------
 * Network requests can fail temporarily due to:
 * - Network glitches
 * - Server overload
 * - Rate limiting
 * - Timeout
 * 
 * RETRY STRATEGIES:
 * -----------------
 * 1. Fixed delay: Wait same time between retries
 * 2. Exponential backoff: Increase delay each time (1s, 2s, 4s, 8s)
 * 3. Jitter: Add randomness to prevent thundering herd
 * 
 * WHY CACHE REQUESTS?
 * -------------------
 * - Reduce server load
 * - Faster responses
 * - Offline support
 * - Save bandwidth
 * 
 * CACHE STRATEGIES:
 * -----------------
 * 1. Cache-first: Check cache, then network
 * 2. Network-first: Try network, fallback to cache
 * 3. Stale-while-revalidate: Return cached, update in background
 */

// ============================================
// BEGINNER LEVEL - FETCH WITH RETRY
// ============================================

/**
 * Beginner: Simple retry with fixed delay
 */
async function fetchWithRetryBeginner(url, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Last attempt - throw error
      if (attempt === retries) {
        throw error;
      }
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Test
console.log('=== BEGINNER RETRY ===');
console.log('fetchWithRetryBeginner(url, retries=3, delay=1000)');


// ============================================
// BEGINNER LEVEL - CACHED FETCH
// ============================================

/**
 * Beginner: Simple in-memory cache
 */
const simpleCache = new Map();

async function cachedFetchBeginner(url) {
  // Check cache
  if (simpleCache.has(url)) {
    console.log('Cache HIT:', url);
    return simpleCache.get(url);
  }
  
  // Fetch and cache
  console.log('Cache MISS:', url);
  const response = await fetch(url);
  const data = await response.json();
  
  simpleCache.set(url, data);
  return data;
}

// Clear cache
function clearCache() {
  simpleCache.clear();
}


// ============================================
// INTERMEDIATE LEVEL - RETRY
// ============================================

/**
 * Intermediate: Retry with exponential backoff
 */
async function fetchWithRetryIntermediate(url, options = {}) {
  const {
    retries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryOn = [408, 429, 500, 502, 503, 504], // Status codes to retry
    onRetry = null,
    ...fetchOptions
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      
      // Check if should retry based on status
      if (!response.ok && retryOn.includes(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt === retries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      // Add jitter (±25%)
      const jitter = delay * (0.75 + Math.random() * 0.5);
      
      onRetry?.({
        attempt: attempt + 1,
        delay: jitter,
        error
      });
      
      await new Promise(resolve => setTimeout(resolve, jitter));
    }
  }
  
  throw lastError;
}


// ============================================
// INTERMEDIATE LEVEL - CACHE
// ============================================

/**
 * Intermediate: Cache with TTL and deduplication
 */
class FetchCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.inFlight = new Map(); // Prevent duplicate requests
    this.defaultTTL = options.ttl || 60000; // 1 minute
    this.maxSize = options.maxSize || 100;
  }
  
  generateKey(url, options = {}) {
    return `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || '')}`;
  }
  
  async fetch(url, options = {}) {
    const {
      ttl = this.defaultTTL,
      forceRefresh = false,
      ...fetchOptions
    } = options;
    
    const key = this.generateKey(url, fetchOptions);
    
    // Check cache (if not forcing refresh)
    if (!forceRefresh) {
      const cached = this.cache.get(key);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
      }
    }
    
    // Check if request is already in flight (deduplication)
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }
    
    // Make request
    const promise = this._fetchAndCache(url, fetchOptions, key, ttl);
    this.inFlight.set(key, promise);
    
    try {
      return await promise;
    } finally {
      this.inFlight.delete(key);
    }
  }
  
  async _fetchAndCache(url, options, key, ttl) {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Evict oldest if at max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    // Cache the data
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now()
    });
    
    return data;
  }
  
  invalidate(key) {
    this.cache.delete(key);
  }
  
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  clear() {
    this.cache.clear();
    this.inFlight.clear();
  }
  
  size() {
    return this.cache.size;
  }
}


// ============================================
// EXPERT LEVEL - COMBINED
// ============================================

/**
 * Expert: Full-featured fetch with retry + cache
 */
class SmartFetch {
  constructor(options = {}) {
    this.cache = new Map();
    this.inFlight = new Map();
    this.defaultOptions = {
      retries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffFactor: 2,
      cacheTTL: 60000,
      cacheMaxSize: 100,
      retryOn: [408, 429, 500, 502, 503, 504],
      timeout: 30000,
      ...options
    };
  }
  
  async fetch(url, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    const {
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      cacheTTL,
      retryOn,
      timeout,
      forceRefresh,
      cacheStrategy,
      onRetry,
      ...fetchOptions
    } = opts;
    
    const cacheKey = this._generateKey(url, fetchOptions);
    
    // Cache-first strategy
    if (cacheStrategy !== 'network-first' && !forceRefresh) {
      const cached = this._getFromCache(cacheKey);
      
      if (cached) {
        // Stale-while-revalidate
        if (cacheStrategy === 'stale-while-revalidate') {
          this._revalidateInBackground(url, fetchOptions, cacheKey, cacheTTL);
        }
        return cached;
      }
    }
    
    // Deduplicate concurrent requests
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }
    
    // Make request with retry
    const promise = this._fetchWithRetry(url, {
      fetchOptions,
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      retryOn,
      timeout,
      onRetry
    }).then(data => {
      this._setCache(cacheKey, data, cacheTTL);
      return data;
    });
    
    this.inFlight.set(cacheKey, promise);
    
    try {
      return await promise;
    } catch (error) {
      // Network-first: Try cache on failure
      if (cacheStrategy === 'network-first') {
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }
  
  async _fetchWithRetry(url, config) {
    const {
      fetchOptions,
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      retryOn,
      timeout,
      onRetry
    } = config;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok && retryOn.includes(response.status)) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt === retries) break;
        
        // Don't retry abort errors (timeout)
        if (error.name === 'AbortError') {
          lastError = new Error('Request timeout');
          break;
        }
        
        const delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt),
          maxDelay
        );
        const jitter = delay * (0.75 + Math.random() * 0.5);
        
        onRetry?.({ attempt: attempt + 1, delay: jitter, error });
        
        await new Promise(r => setTimeout(r, jitter));
      }
    }
    
    throw lastError;
  }
  
  async _revalidateInBackground(url, fetchOptions, cacheKey, ttl) {
    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        const data = await response.json();
        this._setCache(cacheKey, data, ttl);
      }
    } catch {
      // Silently fail background revalidation
    }
  }
  
  _generateKey(url, options = {}) {
    return `${options.method || 'GET'}:${url}`;
  }
  
  _getFromCache(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data;
    }
    return null;
  }
  
  _setCache(key, data, ttl) {
    if (this.cache.size >= this.defaultOptions.cacheMaxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }
  
  // Utility methods
  clearCache() {
    this.cache.clear();
  }
  
  invalidate(url) {
    for (const key of this.cache.keys()) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }
}

// Test Expert Level
console.log('\n=== EXPERT LEVEL ===');

const smartFetch = new SmartFetch({
  cacheTTL: 5000,
  retries: 3,
  timeout: 10000,
  onRetry: ({ attempt, delay, error }) => {
    console.log(`Retry ${attempt} in ${Math.round(delay)}ms: ${error.message}`);
  }
});

// Usage example
async function fetchUser(id) {
  return smartFetch.fetch(`/api/users/${id}`, {
    cacheStrategy: 'stale-while-revalidate'
  });
}


// ============================================
// EDGE CASES & ERROR HANDLING
// ============================================

console.log('\n=== EDGE CASES ===');

/**
 * Handle specific errors differently
 */
async function fetchWithErrorHandling(url, options = {}) {
  const { retries = 3, retryDelay = 1000 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const error = new Error(`Client error: ${response.status}`);
        error.status = response.status;
        error.retryable = false;
        throw error;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Don't retry non-retryable errors
      if (error.retryable === false) {
        throw error;
      }
      
      if (attempt === retries) {
        throw error;
      }
      
      await new Promise(r => setTimeout(r, retryDelay * Math.pow(2, attempt)));
    }
  }
}

/**
 * Handle 429 (Rate Limit) with Retry-After header
 */
async function fetchWithRateLimit(url, options = {}) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter 
      ? parseInt(retryAfter) * 1000 
      : 60000; // Default 1 minute
    
    console.log(`Rate limited. Retrying after ${delay}ms`);
    await new Promise(r => setTimeout(r, delay));
    
    return fetchWithRateLimit(url, options);
  }
  
  return response;
}


// ============================================
// THINGS TO REMEMBER
// ============================================

/**
 * QUICK REFERENCE:
 * ----------------
 * Retry:
 * 1. Use exponential backoff
 * 2. Add jitter to prevent thundering herd
 * 3. Don't retry client errors (4xx)
 * 4. Respect Retry-After header
 * 
 * Cache:
 * 1. Include method and body in cache key
 * 2. Deduplicate concurrent requests
 * 3. Implement TTL for freshness
 * 4. Have max size with eviction
 * 
 * INTERVIEW TIPS:
 * ---------------
 * 1. Start with simple retry loop
 * 2. Add exponential backoff
 * 3. Explain deduplication importance
 * 4. Discuss cache strategies
 */


module.exports = {
  fetchWithRetryBeginner,
  cachedFetchBeginner,
  fetchWithRetryIntermediate,
  FetchCache,
  SmartFetch,
  fetchWithErrorHandling,
  fetchWithRateLimit
};
