import type { Topic } from '../../types';

export const concurrencyTopics: Topic[] = [
  {
    id: 'js-concurrency',
    title: 'Concurrency and Parallelism',
    description:
      'Understanding Web Workers, Service Workers, main thread execution, inter-thread communication, and strategies for offline-capable applications in JavaScript.',
    category: 'JavaScript',
    difficulty: 'Advanced',
    tags: [
      'Web Workers',
      'Service Workers',
      'Concurrency',
      'Parallelism',
      'postMessage',
      'SharedArrayBuffer',
      'Atomics',
      'Offline',
      'Caching',
    ],
    overview:
      'JavaScript is single-threaded at its core, relying on the event loop for concurrency. However, true parallelism is achievable through Web Workers, which run scripts in background threads. Service Workers extend this model by acting as programmable network proxies, enabling powerful caching strategies and offline support. Mastering these APIs is essential for building performant, resilient web applications that remain responsive under heavy computational loads or unreliable network conditions.',
    concepts: [
      'Event loop and single-threaded execution model',
      'Web Workers and dedicated worker threads',
      'Shared Workers for cross-tab communication',
      'Service Workers as network proxies',
      'Structured cloning and transferable objects',
      'postMessage API for inter-thread communication',
      'SharedArrayBuffer and Atomics for shared memory',
      'Cache API and caching strategies',
      'Offline-first application architecture',
      'Worker lifecycle management and termination',
    ],
    relatedTopicIds: [
      'js-event-loop',
      'js-async-programming',
      'js-performance',
    ],
    questions: [
      {
        id: 'js-conc-1',
        question:
          'What are Web Workers? How do they enable parallelism in JavaScript?',
        answer:
          'Web Workers are a browser API that allows JavaScript code to run in background threads, separate from the main execution thread. This is significant because JavaScript itself is single-threaded — all UI rendering, DOM manipulation, and script execution share one thread. When heavy computation blocks this thread, the entire page becomes unresponsive. Web Workers solve this by enabling true parallelism: CPU-intensive tasks can be offloaded to worker threads that execute simultaneously on separate CPU cores.\n\nA Web Worker is created by instantiating the `Worker` constructor with a path to a JavaScript file. This file runs in an entirely separate global context — it has no access to the DOM, `window`, or `document`. Instead, workers communicate with the main thread via the `postMessage` API and the `onmessage` event handler. Data sent between threads is structurally cloned by default, meaning it is deep-copied rather than shared.\n\nThere are three flavours of workers. Dedicated Workers are tied to a single page context and are the most common type. Shared Workers can be accessed from multiple browsing contexts (tabs, iframes) that share the same origin, enabling cross-tab communication. Service Workers are a special class that act as network proxies and have their own lifecycle, discussed separately.\n\nWeb Workers are ideal for tasks like image processing, data parsing, encryption, sorting large datasets, and running WebAssembly modules. Because worker code runs on a separate OS-level thread, it achieves true parallel execution rather than the cooperative concurrency provided by the event loop. However, the communication overhead of structured cloning means workers are most beneficial for coarse-grained, long-running tasks rather than tiny, frequent operations.\n\nModern enhancements include Transferable Objects, which allow zero-copy transfer of `ArrayBuffer` data between threads, and `SharedArrayBuffer` with `Atomics`, which enable low-level shared memory. These make workers practical for high-throughput scenarios like real-time audio processing and game physics engines.',
        shortAnswer:
          'Web Workers run JavaScript in background threads separate from the main thread, enabling true parallelism. They communicate via `postMessage` and structured cloning, have no DOM access, and are ideal for CPU-intensive tasks like data processing and encryption.',
        code: `// main.js — spawning a dedicated worker
const worker = new Worker('worker.js');

worker.postMessage({ type: 'SORT', data: largeArray });

worker.onmessage = (event) => {
  console.log('Sorted result:', event.data);
};

worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// worker.js — background thread
self.onmessage = (event) => {
  const { type, data } = event.data;

  if (type === 'SORT') {
    const sorted = data.sort((a, b) => a - b);
    self.postMessage(sorted);
  }
};

// Transferable objects for zero-copy transfer
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);
// buffer.byteLength is now 0 — ownership transferred`,
        language: 'javascript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: ['Web Workers', 'Parallelism', 'Threads', 'postMessage'],
        commonMistakes: [
          'Trying to access the DOM or window object from within a worker — workers have no DOM access and will throw a ReferenceError',
          'Sending very large objects via postMessage without using Transferable Objects, causing expensive structured cloning and memory duplication',
          'Creating too many workers simultaneously — each worker spawns a real OS thread and consumes significant memory',
        ],
        followUps: [
          'How do Transferable Objects differ from structured cloning?',
          'When would you choose a Shared Worker over a Dedicated Worker?',
          'How can you use worker_threads in Node.js for server-side parallelism?',
        ],
        interviewTips: [
          'Emphasize that Web Workers provide true OS-level thread parallelism, not just event-loop concurrency',
          'Mention real-world use cases like off-main-thread image processing in apps like Figma or Google Sheets',
        ],
        relatedTopics: ['Event Loop', 'Shared Workers', 'Transferable Objects'],
      },
      {
        id: 'js-conc-2',
        question:
          'How does communication between the main thread and Web Workers work?',
        answer:
          'Communication between the main thread and a Web Worker is based on an asynchronous message-passing model using the `postMessage` API. The main thread calls `worker.postMessage(data)` to send data to the worker, and the worker calls `self.postMessage(data)` to send data back. Both sides listen for incoming messages via the `onmessage` event handler or by using `addEventListener("message", callback)`.\n\nBy default, data sent through `postMessage` undergoes structured cloning. The structured clone algorithm creates a deep copy of the object, supporting most built-in types including `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, `Blob`, `File`, `ImageData`, and nested objects or arrays. However, it cannot clone functions, DOM nodes, `Error` objects (in some engines), or objects with prototype chains — attempting to do so throws a `DataCloneError`.\n\nFor performance-critical applications, Transferable Objects provide a zero-copy alternative. When you pass an `ArrayBuffer` (or a typed array\'s underlying buffer) in the transfer list — the second argument to `postMessage` — ownership of that memory region is transferred to the receiving thread. The sending side\'s reference becomes neutered (its `byteLength` drops to 0), but no data is copied. This is orders of magnitude faster for large binary payloads like image pixel data or audio samples.\n\nA common pattern is to build a request-response protocol on top of `postMessage` by assigning unique IDs to each message and matching responses. Libraries like Comlink by Google abstract this further, wrapping the worker in a Proxy so you can call worker functions as if they were local async methods, hiding the postMessage plumbing entirely.\n\nError handling is also part of the communication model. Uncaught exceptions inside a worker fire an `error` event on the worker object in the main thread. Additionally, if `postMessage` is called with non-cloneable data, a `DataCloneError` is thrown synchronously on the sending side. Robust worker communication should always include error listeners on both ends.',
        shortAnswer:
          'The main thread and Web Workers communicate asynchronously via `postMessage` and `onmessage`. Data is deep-copied using the structured clone algorithm by default. For large binary data, Transferable Objects enable zero-copy transfer by moving memory ownership between threads.',
        code: `// === Structured cloning (default) ===
// main.js
const worker = new Worker('worker.js');

worker.postMessage({
  id: 1,
  action: 'processImage',
  pixels: imageDataArray  // deep-copied
});

worker.onmessage = ({ data }) => {
  if (data.id === 1) {
    renderResult(data.result);
  }
};

// worker.js
self.onmessage = ({ data }) => {
  const { id, action, pixels } = data;
  const result = heavyProcessing(pixels);
  self.postMessage({ id, result });
};

// === Transferable Objects (zero-copy) ===
const buffer = new ArrayBuffer(1024 * 1024 * 10); // 10 MB
const view = new Uint8Array(buffer);
// fill view with pixel data...

worker.postMessage(buffer, [buffer]);
console.log(buffer.byteLength); // 0 — ownership transferred

// === Comlink pattern (library abstraction) ===
// worker.js
import * as Comlink from 'comlink';

const api = {
  async heavyComputation(data: number[]): Promise<number> {
    return data.reduce((sum, n) => sum + n, 0);
  }
};
Comlink.expose(api);

// main.js
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap<typeof import('./worker')>(worker);
const result = await api.heavyComputation([1, 2, 3, 4, 5]);`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'postMessage',
          'Structured Cloning',
          'Transferable Objects',
          'Comlink',
        ],
        commonMistakes: [
          'Forgetting that structured cloning cannot handle functions or DOM nodes — attempting to send these throws a DataCloneError',
          'Not using the transfer list for large ArrayBuffers, leading to unnecessary memory duplication and GC pressure',
          'Assuming postMessage is synchronous — it is always asynchronous, and the order of message delivery is guaranteed only within a single port',
        ],
        followUps: [
          'What types of objects cannot be structurally cloned?',
          'How does Comlink simplify worker communication under the hood?',
          'What is a MessageChannel and when would you use one?',
        ],
        interviewTips: [
          'Demonstrate knowledge of the performance tradeoff between structured cloning (safe but slow for large data) and transferable objects (fast but destructive to the sender)',
          'Mentioning Comlink shows familiarity with modern tooling and real-world patterns',
        ],
        relatedTopics: [
          'Structured Clone Algorithm',
          'MessageChannel',
          'MessagePort',
        ],
      },
      {
        id: 'js-conc-3',
        question: 'What are the limitations of Web Workers?',
        answer:
          'The most fundamental limitation of Web Workers is the absence of DOM access. Workers run in a separate global context (`DedicatedWorkerGlobalScope`) that has no `window`, `document`, or any DOM APIs. This means you cannot directly manipulate the UI, read element dimensions, or attach event listeners from within a worker. All UI updates must be coordinated by sending results back to the main thread via `postMessage`, which then performs the actual DOM manipulation.\n\nWorkers also lack access to several main-thread APIs. They cannot use `localStorage`, `sessionStorage`, `alert()`, `confirm()`, `prompt()`, or any synchronous blocking APIs that assume a UI context. Workers do have access to `fetch`, `XMLHttpRequest`, `IndexedDB`, `WebSockets`, `setTimeout`/`setInterval`, `crypto`, and `navigator` (partially). The exact API surface varies by browser and worker type — Service Workers, for instance, cannot use synchronous `XMLHttpRequest`.\n\nMemory and resource overhead is another practical limitation. Each Web Worker spawns a real OS-level thread with its own JavaScript engine instance, memory heap, and event loop. Creating dozens of workers can consume hundreds of megabytes of RAM and strain the thread scheduler. There is no standardized limit, but browsers may throttle or refuse to create workers beyond a certain count. For this reason, worker pools — where a fixed number of workers are reused across tasks — are a common pattern in production applications.\n\nThe communication overhead should not be underestimated. Structured cloning of large objects can take significant time and temporarily doubles memory usage since both the original and the clone exist simultaneously. While Transferable Objects solve the memory issue, they require careful lifecycle management because the sender loses access to the transferred data. SharedArrayBuffer enables true shared memory but requires careful synchronization with Atomics to avoid data races.\n\nFinally, debugging workers is more complex than debugging main-thread code. Workers appear as separate contexts in browser DevTools, breakpoints must be set independently, and console output may be routed differently. Module workers (`type: "module"`) are relatively new and not universally supported in older browsers, which historically required bundling worker code into separate files rather than using ES module imports.',
        shortAnswer:
          'Web Workers cannot access the DOM, `window`, `localStorage`, or any UI-related APIs. They incur memory overhead per thread, structured cloning can be expensive for large data, debugging is more complex, and module worker support varies across browsers.',
        code: `// Demonstrating what workers CAN and CANNOT do

// worker.js
self.onmessage = async ({ data }) => {
  // ✅ These APIs are available in workers
  const response = await fetch('/api/data');
  const json = await response.json();

  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('myDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const id = crypto.randomUUID();

  setTimeout(() => {
    self.postMessage({ status: 'delayed', id });
  }, 1000);

  // ❌ These will throw ReferenceError
  // document.getElementById('app');     // No DOM
  // window.localStorage.getItem('key'); // No localStorage
  // alert('hello');                      // No UI dialogs
  // const el = new HTMLDivElement();     // No DOM constructors

  self.postMessage({ json, id });
};

// Worker pool pattern to manage resource usage
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    data: unknown;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private activeWorkers = new Set<Worker>();

  constructor(private script: string, private size: number) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(script);
      w.onmessage = (e) => this.handleComplete(w, e.data);
      this.workers.push(w);
    }
  }

  exec(data: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const idle = this.workers.find(w => !this.activeWorkers.has(w));
      if (idle) {
        this.activeWorkers.add(idle);
        idle.postMessage(data);
        idle.onmessage = (e) => {
          this.activeWorkers.delete(idle);
          resolve(e.data);
          this.dequeue();
        };
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  private handleComplete(worker: Worker, result: unknown) {
    this.activeWorkers.delete(worker);
    this.dequeue();
  }

  private dequeue() {
    if (this.queue.length === 0) return;
    const idle = this.workers.find(w => !this.activeWorkers.has(w));
    if (!idle) return;
    const task = this.queue.shift()!;
    this.activeWorkers.add(idle);
    idle.postMessage(task.data);
    idle.onmessage = (e) => {
      this.activeWorkers.delete(idle);
      task.resolve(e.data);
      this.dequeue();
    };
  }

  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}

const pool = new WorkerPool('worker.js', navigator.hardwareConcurrency || 4);`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'Web Workers',
          'Limitations',
          'Worker Pool',
          'DOM',
          'Memory',
        ],
        commonMistakes: [
          'Creating a new worker for every small task instead of using a worker pool — this wastes memory and thread resources',
          'Assuming all browser APIs are available inside workers — many UI-related APIs like localStorage and DOM are absent',
          'Not terminating workers when they are no longer needed, causing memory leaks in long-running applications',
        ],
        followUps: [
          'How would you implement a worker pool with task prioritization?',
          'What is OffscreenCanvas and how does it extend worker capabilities?',
          'How does navigator.hardwareConcurrency help size a worker pool?',
        ],
        interviewTips: [
          'Showing awareness of practical constraints like memory overhead and the worker pool pattern demonstrates production experience beyond textbook knowledge',
        ],
        relatedTopics: [
          'Worker Pool',
          'OffscreenCanvas',
          'navigator.hardwareConcurrency',
        ],
      },
      {
        id: 'js-conc-4',
        question:
          'What are Service Workers? How do they differ from Web Workers?',
        answer:
          'Service Workers are a specialized type of worker that acts as a programmable network proxy between the browser and the network. They intercept every network request made by the pages they control and can respond with cached resources, modify requests, or route them to the network — giving developers fine-grained control over caching, offline behaviour, and background processing. Unlike Web Workers, which are general-purpose compute threads, Service Workers are designed specifically for network-related concerns.\n\nThe lifecycle of a Service Worker is fundamentally different from a Web Worker. A Web Worker lives as long as the page that created it (or until explicitly terminated). A Service Worker, on the other hand, has a distinct lifecycle: it is installed, activated, and then can be idle or terminated by the browser at any time to conserve resources. It persists across page navigations and even browser restarts. Registration happens via `navigator.serviceWorker.register()`, installation fires an `install` event (typically used to pre-cache assets), and activation fires an `activate` event (typically used to clean up old caches).\n\nService Workers operate on an event-driven model. The key events are `install`, `activate`, `fetch` (intercepts network requests), `push` (receives push notifications), `sync` (handles background sync), and `message` (receives postMessage communication). The `fetch` event handler is the heart of most Service Worker implementations — it decides whether to serve a response from cache, fetch from the network, or use a combination strategy.\n\nA critical difference is scope. A Web Worker is tied to the page that spawned it. A Service Worker controls all pages within its registered scope (a URL path prefix) and continues to exist even after those pages are closed. This makes Service Workers essential for Progressive Web Apps (PWAs), enabling push notifications and background sync even when no tab is open. However, Service Workers require HTTPS (except on localhost) because of the power they have to intercept and modify network requests.\n\nService Workers also differ in their API surface. They have access to the Cache API, Push API, Background Sync API, and Notification API, but they cannot access the DOM, just like regular workers. They use `clients.matchAll()` and `client.postMessage()` to communicate with the pages they control. Unlike Web Workers, Service Workers cannot use synchronous APIs like `XMLHttpRequest` — all network calls must use `fetch()`.',
        shortAnswer:
          'Service Workers are event-driven workers that act as network proxies, intercepting fetch requests and enabling caching, offline support, and push notifications. Unlike Web Workers (general-purpose compute threads), Service Workers have a persistent lifecycle, control a URL scope, and require HTTPS.',
        code: `// Registering a Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('SW registered, scope:', registration.scope);
    })
    .catch((error) => {
      console.error('SW registration failed:', error);
    });
}

// sw.js — Service Worker lifecycle and fetch interception
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Communicating with controlled pages
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.source.postMessage({ type: 'VERSION', version: CACHE_NAME });
  }
});`,
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'Service Workers',
          'PWA',
          'Caching',
          'Offline',
          'Lifecycle',
        ],
        commonMistakes: [
          'Forgetting that Service Workers require HTTPS in production — they only work on localhost during development without SSL',
          'Not calling self.skipWaiting() and self.clients.claim() when you need the new Service Worker to take effect immediately, leaving stale workers in control',
          'Caching responses without a versioning strategy, leading to users being stuck with outdated assets indefinitely',
        ],
        followUps: [
          'What happens when a new version of a Service Worker is deployed?',
          'How does the Service Worker lifecycle differ from a regular Web Worker?',
          'What is the difference between self.skipWaiting() and self.clients.claim()?',
        ],
        interviewTips: [
          'Draw a clear distinction: Web Workers are for computation, Service Workers are for network control — conflating them is a common interview pitfall',
          'Mention that Service Workers are the backbone of PWAs and enable features like push notifications and background sync',
        ],
        relatedTopics: ['Cache API', 'PWA', 'Push API', 'Background Sync'],
      },
      {
        id: 'js-conc-5',
        question:
          'How can Service Workers be used for caching and offline support?',
        answer:
          'Service Workers enable offline support by intercepting network requests through the `fetch` event and responding with cached resources when the network is unavailable. The Cache API, available within the Service Worker context, provides a programmatic key-value store where requests map to responses. During the `install` event, critical assets (HTML, CSS, JavaScript, images) are pre-cached so the application shell loads instantly on subsequent visits, even without a network connection.\n\nSeveral caching strategies are commonly used, each with different tradeoffs. Cache-First checks the cache before the network and is ideal for static assets that rarely change. Network-First tries the network first and falls back to cache, suitable for dynamic content like API responses where freshness matters. Stale-While-Revalidate serves the cached version immediately for speed while simultaneously fetching an updated version from the network to update the cache for next time — a great balance for content that changes but where slight staleness is acceptable. Cache-Only and Network-Only are simpler strategies for assets that should never hit the network or never be cached, respectively.\n\nFor offline support beyond static assets, the Background Sync API lets you defer actions until connectivity is restored. For example, if a user submits a form while offline, the request can be queued and replayed when the Service Worker detects a network connection via the `sync` event. This creates a seamless experience where the user does not need to know whether they are online or offline.\n\nVersioning and cache invalidation are critical operational concerns. Each deployment should use a new cache name (e.g., `app-cache-v2`). During the `activate` event, old caches are deleted to prevent unbounded storage growth. The Cache API has storage limits (varies by browser, typically a percentage of available disk space), and browsers can evict cached data under storage pressure unless the application requests persistent storage via `navigator.storage.persist()`.\n\nAdvanced patterns include runtime caching (caching resources on first access rather than pre-caching everything), cache warming (pre-fetching resources the user is likely to need next), and serving a custom offline fallback page when neither cache nor network can fulfill a request. Workbox, a library from Google, abstracts these patterns into declarative configuration, reducing boilerplate while providing robust production-grade caching.',
        shortAnswer:
          'Service Workers intercept fetch requests and use the Cache API to serve pre-cached or runtime-cached resources when offline. Common strategies include Cache-First for static assets, Network-First for dynamic data, and Stale-While-Revalidate for balanced freshness. Background Sync enables deferred actions until connectivity resumes.',
        code: `// Cache-First strategy (static assets)
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    return cached || fetch(request).then((response) => {
      const clone = response.clone();
      caches.open('static-v1').then((cache) => cache.put(request, clone));
      return response;
    });
  });
}

// Network-First strategy (API calls)
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      const clone = response.clone();
      caches.open('api-v1').then((cache) => cache.put(request, clone));
      return response;
    })
    .catch(() => caches.match(request));
}

// Stale-While-Revalidate strategy
function staleWhileRevalidate(request) {
  return caches.open('swr-v1').then((cache) => {
    return cache.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      });
      return cached || networkFetch;
    });
  });
}

// Routing requests to the appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.destination === 'image' ||
      url.pathname.match(/\\.(css|js|woff2?)$/)) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request).catch(() =>
        caches.match('/offline.html')
      )
    );
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(replayQueuedRequests());
  }
});

async function replayQueuedRequests() {
  const db = await openIndexedDB();
  const pending = await db.getAll('outbox');

  await Promise.all(
    pending.map(async (entry) => {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
      });
      await db.delete('outbox', entry.id);
    })
  );
}`,
        language: 'javascript',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'Service Workers',
          'Cache API',
          'Offline',
          'Caching Strategies',
          'Background Sync',
          'Workbox',
        ],
        commonMistakes: [
          'Forgetting to clone responses before caching — a Response body can only be consumed once, so both cache.put() and returning the response require separate copies',
          'Pre-caching too many assets during install, making the initial Service Worker installation slow and potentially failing if any single asset fails to fetch',
          'Not implementing cache versioning and cleanup in the activate event, leading to ever-growing storage usage',
        ],
        followUps: [
          'How would you implement a cache size limit to prevent storage bloat?',
          'What is the difference between pre-caching and runtime caching?',
          'How does Workbox simplify Service Worker caching strategies?',
        ],
        interviewTips: [
          'Being able to name and explain at least three caching strategies (Cache-First, Network-First, Stale-While-Revalidate) demonstrates practical Service Worker experience',
        ],
        relatedTopics: [
          'Cache API',
          'Workbox',
          'Background Sync',
          'IndexedDB',
        ],
      },
      {
        id: 'js-conc-6',
        question:
          'What is the difference between concurrency and parallelism in JavaScript?',
        answer:
          'Concurrency and parallelism are related but distinct concepts that are often conflated. Concurrency means dealing with multiple tasks that are in progress at the same time — tasks can start, run, and complete in overlapping time periods, but they do not necessarily execute simultaneously. Parallelism means multiple tasks are literally executing at the same instant, typically on different CPU cores. In JavaScript, the event loop provides concurrency, while Web Workers provide parallelism.\n\nJavaScript\'s main thread is inherently concurrent but not parallel. The event loop multiplexes between multiple asynchronous operations — network requests, timers, user interactions, promise callbacks — giving the illusion that they are happening simultaneously. In reality, only one piece of JavaScript executes at any given moment on the main thread. When an `async` function `await`s a fetch call, the engine suspends that function, processes other queued microtasks and macrotasks, and resumes the function when the response arrives. This is cooperative concurrency: tasks voluntarily yield control by awaiting asynchronous operations.\n\nTrue parallelism in the browser requires Web Workers. When you spawn a worker, the browser creates a new OS-level thread with its own JavaScript engine instance, heap, and call stack. Code in the worker runs simultaneously with code on the main thread — you can verify this by running CPU-intensive loops in both and observing that neither blocks the other. This is preemptive parallelism managed by the operating system\'s thread scheduler.\n\nThe practical implication is that concurrency (event loop) is sufficient for I/O-bound work — network requests, file reads, database queries — because the actual waiting happens outside JavaScript and the engine can do other work in the meantime. Parallelism (workers) is necessary for CPU-bound work — heavy computation, data processing, encryption — because there is no I/O wait to exploit; the CPU is continuously busy and would block the main thread.\n\nA helpful analogy: a single chef (main thread) juggling multiple dishes by switching between them while waiting for water to boil is concurrency. Hiring additional chefs (workers) who each prepare a separate dish simultaneously is parallelism. Modern web applications use both: the event loop handles I/O-bound orchestration while workers handle CPU-bound computation, keeping the UI responsive under all conditions.',
        shortAnswer:
          'Concurrency means managing multiple tasks that overlap in time (achieved by the event loop). Parallelism means tasks execute simultaneously on separate CPU cores (achieved by Web Workers). JavaScript\'s main thread is concurrent but not parallel; workers enable true parallelism for CPU-bound tasks.',
        code: `// Concurrency via the event loop (single thread, interleaved)
async function concurrentIO() {
  console.time('concurrent');

  const [users, products, orders] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/products').then(r => r.json()),
    fetch('/api/orders').then(r => r.json()),
  ]);

  console.timeEnd('concurrent');
  // All three requests were in-flight concurrently,
  // but JavaScript processed their callbacks one at a time
  return { users, products, orders };
}

// Parallelism via Web Workers (multiple threads, simultaneous)
function parallelCompute(datasets: number[][]): Promise<number[]> {
  const workerCount = Math.min(datasets.length, navigator.hardwareConcurrency);

  return new Promise((resolve) => {
    const results: number[] = new Array(datasets.length);
    let completed = 0;

    datasets.forEach((data, index) => {
      const worker = new Worker('compute-worker.js');

      worker.postMessage({ index, data });

      worker.onmessage = (event) => {
        results[event.data.index] = event.data.result;
        completed++;
        worker.terminate();

        if (completed === datasets.length) {
          resolve(results);
        }
      };
    });
  });
}

// compute-worker.js
self.onmessage = ({ data: { index, data } }) => {
  // CPU-intensive work running on a separate thread
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result += Math.sqrt(data[i]) * Math.log(data[i] + 1);
  }
  self.postMessage({ index, result });
};

// Combining both: concurrent I/O + parallel compute
async function processLargeDataset() {
  // Concurrent I/O: fetch data from multiple endpoints
  const chunks = await Promise.all(
    Array.from({ length: 4 }, (_, i) =>
      fetch(\`/api/data/chunk/\${i}\`).then(r => r.json())
    )
  );

  // Parallel compute: process each chunk on a separate worker
  const results = await parallelCompute(chunks);

  return results;
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'Concurrency',
          'Parallelism',
          'Event Loop',
          'Web Workers',
          'Promise.all',
        ],
        commonMistakes: [
          'Claiming that Promise.all runs tasks "in parallel" — it runs them concurrently on a single thread; true parallelism requires multiple threads',
          'Using Web Workers for simple I/O-bound tasks where the event loop would be more efficient — workers add overhead that only pays off for CPU-intensive work',
          'Confusing async/await with parallelism — async/await is syntactic sugar for promises and provides concurrency, not parallelism',
        ],
        followUps: [
          'Can you achieve parallelism without Web Workers in JavaScript?',
          'How does the event loop model compare to thread-based concurrency in languages like Java?',
          'What is cooperative scheduling versus preemptive scheduling?',
        ],
        interviewTips: [
          'Use the chef analogy or a similar metaphor — interviewers value candidates who can explain complex concepts simply and clearly',
          'Emphasize the practical guidance: use the event loop for I/O, use workers for CPU — this shows you know when to apply each tool',
        ],
        relatedTopics: [
          'Event Loop',
          'Microtasks vs Macrotasks',
          'Promise.all',
          'Thread Scheduling',
        ],
      },
      {
        id: 'js-conc-7',
        question: 'What are SharedArrayBuffer and Atomics?',
        answer:
          'SharedArrayBuffer is a special type of ArrayBuffer whose underlying memory can be shared between the main thread and Web Workers simultaneously. Unlike regular ArrayBuffers that are either copied (structured cloning) or transferred (ownership moves), a SharedArrayBuffer allows multiple threads to read and write the same memory region concurrently. This is the only mechanism in JavaScript for true shared-memory parallelism, enabling patterns similar to multi-threaded programming in languages like C++ or Java.\n\nThe Atomics object provides static methods for performing atomic (indivisible) operations on SharedArrayBuffer views. When multiple threads access shared memory, data races can occur — one thread might read a partially-written value if another thread is mid-update. Atomics operations guarantee that reads and writes to specific memory locations are completed fully before any other thread can access that location. Key methods include `Atomics.load()`, `Atomics.store()`, `Atomics.add()`, `Atomics.sub()`, `Atomics.compareExchange()`, `Atomics.wait()`, and `Atomics.notify()`.\n\n`Atomics.wait()` and `Atomics.notify()` are particularly powerful because they enable thread synchronization primitives. `Atomics.wait()` suspends a worker thread until another thread calls `Atomics.notify()` on the same memory location, acting like a condition variable in traditional threading. This allows you to build mutexes, semaphores, and barriers purely in JavaScript. Note that `Atomics.wait()` blocks the calling thread and is only available in workers — calling it on the main thread throws because blocking the main thread would freeze the UI.\n\nSharedArrayBuffer was temporarily disabled in all browsers after the Spectre CPU vulnerability was discovered in 2018 because shared memory combined with high-resolution timing could be used as a side-channel attack vector. It was re-enabled with the requirement that the page sets specific HTTP headers: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. These headers put the page into a cross-origin isolated state, mitigating Spectre-class attacks by preventing cross-origin resources from being loaded into the same process.\n\nPractical use cases for SharedArrayBuffer and Atomics include WebAssembly multi-threading (wasm threads compile down to SharedArrayBuffer), real-time audio and video processing, physics engines in games, and any workload that requires high-throughput data exchange between threads without the overhead of postMessage serialization. Libraries like `Comlink` and frameworks like Emscripten\'s pthread implementation build on these primitives to provide higher-level abstractions.',
        shortAnswer:
          'SharedArrayBuffer allows multiple threads to share the same memory region. Atomics provides thread-safe operations (load, store, add, compareExchange, wait, notify) to prevent data races. Together they enable true shared-memory parallelism in JavaScript, requiring cross-origin isolation headers due to Spectre mitigations.',
        code: `// Setting up SharedArrayBuffer between main thread and worker

// main.js
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

const worker = new Worker('worker.js');
worker.postMessage({ buffer: sharedBuffer });

// Write to shared memory atomically
Atomics.store(sharedArray, 0, 42);

// Read from shared memory atomically
const value = Atomics.load(sharedArray, 0);
console.log('Value:', value); // 42

// Atomic increment (thread-safe counter)
Atomics.add(sharedArray, 1, 1);

// worker.js
self.onmessage = ({ data: { buffer } }) => {
  const sharedArray = new Int32Array(buffer);

  // Both threads see the same memory
  const mainValue = Atomics.load(sharedArray, 0);
  console.log('From worker:', mainValue); // 42

  // Atomic compare-and-swap (lock-free pattern)
  const old = Atomics.compareExchange(sharedArray, 0, 42, 100);
  // If index 0 was 42, it's now 100; old === 42

  // Worker can increment the same counter
  Atomics.add(sharedArray, 1, 1);
};

// === Thread synchronization with wait/notify ===

// producer-worker.js
self.onmessage = ({ data: { buffer } }) => {
  const view = new Int32Array(buffer);

  // Simulate producing data
  for (let i = 1; i <= 10; i++) {
    Atomics.store(view, 0, i);      // write value
    Atomics.store(view, 1, 1);      // set "ready" flag
    Atomics.notify(view, 1, 1);     // wake consumer
    Atomics.wait(view, 2, 0);       // wait for consumer to acknowledge
    Atomics.store(view, 2, 0);      // reset ack flag
  }
};

// consumer-worker.js
self.onmessage = ({ data: { buffer } }) => {
  const view = new Int32Array(buffer);

  for (let i = 0; i < 10; i++) {
    Atomics.wait(view, 1, 0);       // wait until "ready" flag is set
    const value = Atomics.load(view, 0);
    console.log('Consumed:', value);
    Atomics.store(view, 1, 0);      // reset ready flag
    Atomics.store(view, 2, 1);      // set ack flag
    Atomics.notify(view, 2, 1);     // wake producer
  }
};

// Required HTTP headers for SharedArrayBuffer
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp`,
        language: 'javascript',
        difficulty: 'Senior',
        type: 'Coding',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'SharedArrayBuffer',
          'Atomics',
          'Shared Memory',
          'Thread Safety',
          'Spectre',
        ],
        commonMistakes: [
          'Accessing SharedArrayBuffer without Atomics — non-atomic reads and writes can cause torn reads and data races that produce corrupt or inconsistent values',
          'Calling Atomics.wait() on the main thread — it is only permitted in workers because it blocks the thread, and blocking the main thread would freeze the UI',
          'Deploying SharedArrayBuffer without the required COOP/COEP headers — the browser will throw a TypeError when constructing SharedArrayBuffer in a non-isolated context',
        ],
        followUps: [
          'How do COOP and COEP headers enable SharedArrayBuffer after Spectre?',
          'How does WebAssembly use SharedArrayBuffer for multi-threading?',
          'Can you implement a mutex using only Atomics.compareExchange?',
        ],
        interviewTips: [
          'Mentioning the Spectre security context shows you understand not just the API but the real-world security considerations that shaped its deployment',
          'Connect SharedArrayBuffer to WebAssembly multi-threading — this demonstrates awareness of the broader performance ecosystem',
        ],
        relatedTopics: [
          'WebAssembly Threads',
          'Spectre Mitigation',
          'Cross-Origin Isolation',
          'Mutex',
        ],
      },
      {
        id: 'js-conc-8',
        question:
          'How would you architect an offline-first application using Service Workers?',
        answer:
          'An offline-first architecture treats the network as an enhancement rather than a requirement. The application is designed to function fully from cached data by default and synchronizes with the server when connectivity is available. The Service Worker is the linchpin: it pre-caches the application shell during installation, intercepts all network requests to apply appropriate caching strategies, and uses Background Sync to queue and replay failed mutations.\n\nThe application shell model is the foundation. During the Service Worker\'s `install` event, all critical resources — HTML, CSS, JavaScript bundles, fonts, and essential images — are cached. This ensures the application structure loads instantly on repeat visits regardless of network status. Dynamic content (API responses, user data) is cached at runtime using strategy-appropriate patterns: Stale-While-Revalidate for feeds and lists, Network-First for user-specific data, and Cache-First for immutable assets like hashed bundles.\n\nFor data persistence and offline mutations, IndexedDB serves as the client-side database. When the user creates, updates, or deletes data while offline, the change is written to IndexedDB immediately (so the UI reflects it) and a sync request is queued. The Background Sync API registers a sync event tag, and the Service Worker\'s `sync` handler replays queued requests when the network returns. Conflict resolution — what happens when the server state diverged during the offline period — must be planned: strategies include last-write-wins, server-wins, or operational transform / CRDT-based merging for collaborative applications.\n\nUI feedback is essential for a good offline experience. The application should detect connectivity changes via `navigator.onLine` and the `online`/`offline` events, displaying clear indicators of the current state. Optimistic UI updates (showing changes immediately before server confirmation) combined with subtle sync-status indicators (a small icon showing "synced", "syncing", or "offline — changes will sync when online") create a seamless experience.\n\nStorage management rounds out the architecture. Browsers impose storage quotas that vary by origin and device. Calling `navigator.storage.estimate()` lets you monitor usage and warn users before hitting limits. Requesting `navigator.storage.persist()` prevents the browser from evicting your data under storage pressure. Old caches must be cleaned up during Service Worker activation, and a cache eviction policy (e.g., LRU for runtime-cached images) prevents unbounded growth. Tools like Workbox provide battle-tested implementations of all these patterns with minimal configuration.',
        shortAnswer:
          'An offline-first app pre-caches the app shell via Service Worker install, applies caching strategies per resource type, stores data in IndexedDB for offline access, queues mutations via Background Sync, and provides clear UI indicators. Storage management and conflict resolution are critical for production robustness.',
        code: `// Offline-first architecture overview

// 1. Service Worker: sw.js
const APP_SHELL_CACHE = 'shell-v2';
const RUNTIME_CACHE = 'runtime-v1';
const API_CACHE = 'api-v1';

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keepCaches = [APP_SHELL_CACHE, RUNTIME_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => !keepCaches.includes(name))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithFallback(event.request));
  } else if (event.request.mode === 'navigate') {
    event.respondWith(navigationHandler(event.request));
  } else {
    event.respondWith(cacheFirstWithRefresh(event.request));
  }
});

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(API_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}

async function navigationHandler(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function cacheFirstWithRefresh(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then((response) => {
    caches.open(RUNTIME_CACHE)
      .then((cache) => cache.put(request, response));
    return response.clone();
  }).catch(() => undefined);
  return cached || networkFetch;
}

// 2. Background Sync for offline mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'outbox-sync') {
    event.waitUntil(processOutbox());
  }
});

async function processOutbox() {
  const db = await idbOpen('app-db', 1);
  const tx = db.transaction('outbox', 'readwrite');
  const store = tx.objectStore('outbox');
  const entries = await store.getAll();

  for (const entry of entries) {
    try {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: JSON.stringify(entry.body),
      });
      await store.delete(entry.id);
    } catch {
      break; // stop processing, will retry on next sync
    }
  }
}

// 3. Client-side: queue mutations when offline
async function saveData(item) {
  // Always save locally first (optimistic)
  await idbPut('app-db', 'items', item);
  updateUI(item);

  if (navigator.onLine) {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  } else {
    await idbPut('app-db', 'outbox', {
      id: crypto.randomUUID(),
      url: '/api/items',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: item,
      timestamp: Date.now(),
    });
    await navigator.serviceWorker.ready
      .then((reg) => reg.sync.register('outbox-sync'));
  }
}

// 4. Connectivity status indicator
window.addEventListener('online', () => showStatus('online'));
window.addEventListener('offline', () => showStatus('offline'));

async function checkStorageQuota() {
  const { usage, quota } = await navigator.storage.estimate();
  const percentUsed = ((usage / quota) * 100).toFixed(1);
  console.log(\`Storage: \${percentUsed}% used (\${usage} / \${quota} bytes)\`);
}`,
        language: 'javascript',
        difficulty: 'Senior',
        type: 'Scenario',
        category: 'JavaScript',
        topicId: 'js-concurrency',
        tags: [
          'Offline-First',
          'Service Workers',
          'IndexedDB',
          'Background Sync',
          'App Shell',
          'PWA',
        ],
        commonMistakes: [
          'Relying solely on navigator.onLine for connectivity detection — it only indicates whether the device has a network interface, not whether the connection actually works (it can report true behind a captive portal)',
          'Not planning a conflict resolution strategy for data that was modified both offline and on the server — this leads to data loss or silent overwrites',
          'Caching API responses without considering authentication tokens that may expire — serving stale auth-gated responses can cause confusing errors',
        ],
        followUps: [
          'How would you handle conflict resolution when the same resource is modified offline and on the server?',
          'What are CRDTs and how do they help with offline-first data sync?',
          'How does navigator.storage.persist() differ from the default storage policy?',
        ],
        interviewTips: [
          'Framing your answer around the app shell model and specific caching strategies shows architectural thinking, which is what senior-level interviews look for',
          'Mentioning Background Sync and IndexedDB together shows you understand the full offline stack, not just the caching layer',
        ],
        relatedTopics: [
          'App Shell Model',
          'CRDTs',
          'Workbox',
          'IndexedDB',
          'Storage API',
        ],
      },
    ],
  },
];
