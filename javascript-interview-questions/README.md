# JavaScript Interview Questions - Complete Guide

A comprehensive collection of JavaScript coding challenges with solutions at **Beginner**, **Intermediate**, and **Expert** levels.

## 📚 How to Use This Guide

Each file contains:
- **Theory & Concepts** - Understanding the fundamentals
- **Beginner Level** - Simple, straightforward implementation
- **Intermediate Level** - Added features and edge case handling
- **Expert Level** - Production-ready, optimized solutions
- **Edge Cases & Gotchas** - Common pitfalls to avoid
- **Things to Remember** - Quick reference for interviews
- **Practice Exercises** - Additional challenges

## 📂 File Index

| # | Topic | File | Key Concepts |
|---|-------|------|--------------|
| 01 | JSON Serialization | `01-json-serialization.js` | Type handling, escaping, toJSON |
| 02 | Currying | `02-currying.js` | Partial application, infinite curry, valueOf |
| 03 | Deep Copy | `03-deep-copy.js` | Circular refs, WeakMap, special types |
| 04 | Table of Contents | `04-table-of-contents.js` | DOM traversal, heading hierarchy |
| 05 | Memoization | `05-memoization.js` | Cache strategies, multiple args, TTL |
| 06 | Cancellable Interval | `06-cancellable-interval.js` | Closures, pause/resume, cleanup |
| 07 | Deep Merge | `07-deep-merge.js` | Recursive merge, array strategies |
| 08 | Debounce | `08-debounce.js` | Leading/trailing, maxWait, cancel |
| 09 | Event Emitter | `09-event-emitter.js` | Pub/Sub, on/off/emit, once |
| 10 | Promise.all | `10-promise-all.js` | allSettled, race, any, concurrency |
| 11 | Deep Equal | `11-deep-equal.js` | NaN, circular refs, Map/Set |
| 12 | Array Flatten | `12-array-flatten.js` | Depth control, iterative, flatMap |
| 13 | Chainable Calculator | `13-chainable-calculator.js` | Fluent interface, return this |
| 14 | BFS/DFS Traversal | `14-bfs-dfs-traversal.js` | Stack vs Queue, path tracking |
| 15 | Fetch Retry & Cache | `15-fetch-retry-cache.js` | Exponential backoff, TTL, deduplication |
| 16 | Recursive Transform | `16-recursive-transform.js` | Value transformation, path context |
| 17 | Text Highlighter | `17-text-highlighter.js` | Regex, DOM TreeWalker, XSS prevention |
| 18 | Resumable Interval | `18-resumable-interval.js` | Pause/resume, remaining time tracking |
| 19 | Merge User Rows | `19-merge-user-rows.js` | Merge strategies, conflict resolution |
| 20 | Remove Falsy | `20-remove-falsy.js` | Falsy values, deep compact |
| 21 | Async Series | `21-async-series.js` | Waterfall, concurrency control, retry |
| 22 | Promisify | `22-promisify.js` | Callback to Promise, multiArgs, callbackify |
| 23 | camelCase Keys | `23-camelcase-keys.js` | Case conversion, deep transformation |
| 24 | Merge Sorted Arrays | `24-merge-sorted-arrays.js` | In-place merge, two-pointer technique |
| 25 | Web Vitals | `25-web-vitals.js` | LCP, INP, CLS, performance optimization |
| 26 | Fill DOM from Array | `26-fill-dom-from-array.js` | DOM creation, DocumentFragment, XSS safety |
| 27 | Remove Circular Refs | `27-remove-circular-refs.js` | WeakSet detection, JSON replacer |
| 28 | Observer Pattern | `28-observer-pattern.js` | Subject/Observer, reactive values, middleware |

## 🎯 Quick Reference Snippets

### JSON Stringify (Safe)
```javascript
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}
```

### Currying
```javascript
const curry = (fn) => function curried(...args) {
  return args.length >= fn.length
    ? fn.apply(this, args)
    : (...more) => curried.apply(this, [...args, ...more]);
};
```

### Deep Clone
```javascript
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Object.keys(obj)) clone[key] = deepClone(obj[key], seen);
  return clone;
}
```

### Debounce
```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Memoize
```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn.apply(this, args));
    return cache.get(key);
  };
}
```

### Flatten Array
```javascript
const flatten = (arr, depth = 1) => depth > 0
  ? arr.reduce((acc, val) => acc.concat(
      Array.isArray(val) ? flatten(val, depth - 1) : val
    ), [])
  : arr.slice();
```

### Event Emitter
```javascript
class EventEmitter {
  constructor() { this.events = new Map(); }
  on(event, fn) { (this.events.get(event) || this.events.set(event, []).get(event)).push(fn); }
  off(event, fn) { this.events.set(event, (this.events.get(event) || []).filter(f => f !== fn)); }
  emit(event, ...args) { (this.events.get(event) || []).forEach(fn => fn(...args)); }
}
```

### Promise.all
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
    if (promises.length === 0) resolve([]);
  });
}
```

## 📊 Web Vitals Quick Reference

| Metric | Good | Needs Work | Poor | What it Measures |
|--------|------|------------|------|------------------|
| **LCP** | ≤ 2.5s | 2.5-4.0s | > 4.0s | Largest content paint |
| **INP** | ≤ 200ms | 200-500ms | > 500ms | Interaction responsiveness |
| **CLS** | ≤ 0.1 | 0.1-0.25 | > 0.25 | Layout stability |
| **TTFB** | ≤ 800ms | 800-1800ms | > 1800ms | Server response time |

**SSR Delay Impact:** LCP is most affected when SSR is delayed (TTFB → LCP → FCP).

## 🧠 Interview Tips

1. **Start simple** - Begin with beginner solution, then optimize
2. **Think out loud** - Explain your approach
3. **Handle edge cases** - null, undefined, empty, circular refs
4. **Discuss trade-offs** - Time vs space, mutability vs immutability
5. **Know Big O** - Be ready to analyze complexity

## 📝 Common Patterns

### Closure for State
```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}
```

### Recursion with Seen (Circular Detection)
```javascript
function traverse(obj, seen = new WeakMap()) {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) return; // Circular!
    seen.set(obj, true);
    // ... process
  }
}
```

### Method Chaining (Fluent Interface)
```javascript
class Builder {
  constructor() { this.value = ''; }
  add(str) { this.value += str; return this; }
  build() { return this.value; }
}
```

### Factory Function
```javascript
const createPerson = (name) => ({
  name,
  greet() { return `Hello, ${this.name}`; }
});
```

## 🔧 Running the Examples

```bash
# Run any file directly with Node.js
node 01-json-serialization.js

# Or in browser console
# Copy/paste the code and test
```

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [web.dev](https://web.dev/) (Web Vitals)

---

Good luck with your interviews! 🚀
