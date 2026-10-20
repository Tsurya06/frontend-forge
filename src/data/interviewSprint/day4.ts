import type { SprintDayLesson } from "./types";

export const day4Lesson: SprintDayLesson = {
  day: 4,
  id: "browser-internals-build-tools",
  title: "Browser Internals, Event Loop & Modern Build Tools",
  tagline: "DOM/CSSOM pipeline, compositing, microtask/macrotask event loop execution, Vite vs Webpack, tree-shaking, and CDN caching",
  estimatedMinutes: 80,
  objectives: [
    "Trace the critical rendering path: DOM + CSSOM → Render Tree → Layout (Reflow) → Paint → Compositing",
    "Identify CSS properties that trigger Reflow vs Repaint vs GPU Compositing (`transform`, `opacity`)",
    "Predict exact execution order of Call Stack, Microtasks (`Promise`, `queueMicrotask`), and Macrotasks (`setTimeout`)",
    "Explain how Vite leverages native browser ESM and esbuild for sub-second HMR vs Webpack bundle overhead",
    "Master Tree-Shaking mechanics (ESM static analysis vs CommonJS) and immutable cache strategies",
  ],
  beginnerOverview:
    "Understanding what the browser does under the hood when parsing HTML, CSS, and executing JavaScript separates engineers who write code from engineers who build high-performance web systems.",
  deepDiveExplanation:
    "The browser's Critical Rendering Path starts by parsing HTML tokens into the DOM and CSS rules into the CSSOM. Combining visible DOM nodes with CSSOM computed styles yields the Render Tree. The browser then computes geometric coordinates (Layout / Reflow), draws pixels into layer bitmaps (Paint), and sends layers to the GPU to merge on screen (Compositing). Animating geometric properties (width, top, margin) forces expensive Layout and Paint on the main thread; animating `transform` or `opacity` bypasses Layout and Paint entirely, executing directly on the GPU compositor thread. Meanwhile, JavaScript execution follows the HTML5 Event Loop specification where the microtask queue is drained to completion after every single synchronous task before any macrotask runs.",
  sections: [
    {
      id: "critical-rendering-path",
      heading: "1. The Critical Rendering Path: Reflow vs. Repaint vs. Composite",
      content:
        "The rendering pipeline steps:\n1. **DOM Tree**: HTML parser converts raw bytes → characters → tokens → nodes → DOM Tree.\n2. **CSSOM Tree**: CSS bytes converted into computed style rule tree.\n3. **Render Tree**: Combines DOM and CSSOM. Elements with `display: none` are excluded (elements with `visibility: hidden` are included as empty boxes).\n4. **Layout (Reflow)**: Computes exact geometry (X, Y, width, height) of every render node.\n5. **Paint (Repaint)**: Fills in pixels (colors, borders, shadows, text).\n6. **Compositing**: GPU merges distinct visual layers into the final screen buffer.\n\nPerformance Golden Rule: Only `transform` and `opacity` can be handled exclusively on the compositor thread without triggering layout or paint!",
      codeExample: {
        language: "css",
        caption: "60 FPS GPU-accelerated animation vs 15 FPS Layout Thrashing",
        code: `/* ❌ TERRIBLE: Triggers Layout + Paint on every frame (CPU heavy) */
.box-slow {
  transition: left 0.3s ease;
  left: 200px; /* Forces full page reflow and repaint */
}

/* ✅ 60 FPS OPTIMAL: Bypasses Layout & Paint, runs on GPU Compositor */
.box-fast {
  transition: transform 0.3s ease;
  transform: translateX(200px); /* GPU layer translation only */
  will-change: transform;       /* Hints browser to create dedicated GPU layer */
}`,
      },
      keyTakeaway:
        "Always animate `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, or `margin` in interactive UI.",
    },
    {
      id: "event-loop-microtasks-macrotasks",
      heading: "2. The JavaScript Event Loop, Microtasks & Tasks",
      content:
        "JavaScript is single-threaded. Concurrency is handled by the Event Loop coordination between:\n\n1. **Call Stack**: Executes synchronous code until empty.\n2. **Microtask Queue**: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`.\n   - **Rule**: When the call stack empties, the browser drains the ENTIRE microtask queue until completely empty, including any new microtasks queued while draining!\n3. **Render Step**: Browser style recalculation, layout, and paint (runs ~every 16.6ms for 60fps display if main thread is free).\n4. **Macrotask (Task) Queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O, UI click dispatch.\n   - **Rule**: The event loop takes EXACTLY ONE macrotask, executes it, and immediately checks the microtask queue again.",
      codeExample: {
        language: "javascript",
        caption: "Classic interview question: Predict the exact console output order",
        code: `console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
}).then(() => {
  console.log("4");
});

queueMicrotask(() => {
  console.log("5");
});

console.log("6");

// Execution Order:
// 1. Sync: "1", "6"
// 2. Microtasks drained in FIFO order: "3", "5", "4"
// 3. Macrotask from timer: "2"
// Output: 1, 6, 3, 5, 4, 2`,
      },
      expectedOutput: "1, 6, 3, 5, 4, 2",
      keyTakeaway:
        "Microtasks always run before macrotasks. The event loop exhausts all queued microtasks before rendering or taking the next timer.",
    },
    {
      id: "vite-vs-webpack",
      heading: "3. Build Tools: Vite (ESM + esbuild/Rollup) vs. Webpack",
      content:
        "Traditional bundlers (Webpack) bundle your entire codebase before starting the local dev server. As an application scales to 5,000 modules, server boot and HMR slow to crawl.\n\nVite transforms this by splitting dependencies from source code:\n- **Dependencies** (rarely change): Pre-bundled once with Go-based `esbuild` (10-100x faster than JS bundlers).\n- **Source Code**: Served unbundled over native browser ES Modules (`<script type=\"module\">`). When a file changes, Vite only re-transforms that single file and sends an HMR update via WebSocket, achieving 10ms instantaneous HMR regardless of project size.\n\nIn production, Vite uses Rollup (or Rolldown) for highly optimized static bundle tree-shaking and asset hashing.",
      keyTakeaway:
        "Webpack bundles eagerly before serving. Vite serves unbundled native ESM on-demand during development and bundles with Rollup for production.",
    },
    {
      id: "tree-shaking-mechanics",
      heading: "4. Tree-Shaking: How it Works & Why CommonJS Fails",
      content:
        "Tree-shaking is dead code elimination that removes unused exports from final production bundles.\n\nWhy it requires ES Modules (ESM):\n- `import` and `export` statements are **static**: they cannot be nested inside `if` statements or dynamic expressions. The bundler can build a complete dependency graph and detect untouched exports *at build time*.\n\nWhy CommonJS fails tree-shaking:\n- `require('./module')` is **dynamic**: it can be called conditionally at runtime (`if (cond) require(...)`). Bundlers cannot guarantee whether an export is safe to delete, so they must bundle the entire module.\n\nPackage.json `\"sideEffects\": false`:\n- Informs bundlers that files in this package do not modify globals or have side effects on import, permitting aggressive unused class/function stripping.",
      codeExample: {
        language: "javascript",
        caption: "ESM Tree-shakable import vs CommonJS full bundle penalty",
        code: `// ✅ Tree-shakable (ESM): Bundler imports ONLY debounce (~1KB)
import { debounce } from 'lodash-es';

// ❌ BUNDLE BLOAT (CommonJS): Imports the entire 70KB lodash library!
const { debounce } = require('lodash');`,
      },
      keyTakeaway:
        "Tree-shaking requires static ES Module syntax. Always import from ESM-compatible packages and declare `sideEffects: false`.",
    },
    {
      id: "cdn-caching-strategies",
      heading: "5. Production Caching Strategies (HTTP Headers & Hashing)",
      content:
        "The gold standard for single-page application (SPA) caching on CDNs:\n\n1. **Static Assets (JS, CSS, Images with Content Hashes, e.g. `index-aQPLYkrj.js`)**:\n   - Header: `Cache-Control: public, max-age=31536000, immutable`\n   - Because the filename changes whenever file content changes, browsers and CDNs can cache it safely for 1 full year without re-validating.\n\n2. **HTML Entrypoint (`index.html`)**:\n   - Header: `Cache-Control: no-cache` (or `no-store, must-revalidate`)\n   - Tells the browser to always revalidate `index.html` with the server (using ETag or 304). When you deploy a new version with updated script hashes, users get the new app immediately on their next page refresh without stale cache lockouts!",
      keyTakeaway:
        "Hash asset filenames with 1-year immutable caching; serve index.html with `no-cache` to enable instant zero-downtime releases.",
    },
  ],
  misconceptions: [
    {
      myth: "setTimeout(fn, 0) runs immediately on the very next line.",
      reality:
        "No. setTimeout queues a macrotask in the timer queue. It cannot run until the current call stack empties AND all microtasks are drained.",
    },
    {
      myth: "Tree-shaking works on any npm package as long as you use Webpack 5 or Vite.",
      reality:
        "If the package is published only as CommonJS (`module.exports`), modern bundlers cannot safely tree-shake unused exports without ESM exports or specialized Babel transforms.",
    },
  ],
  realWorldScenario: {
    title: "Stale Bundle CDN Deployment Incident",
    problem:
      "A frontend team deployed a critical hotfix, but 40% of users continued reporting the bug for hours. Investigation showed their CDN was caching `index.html` with `max-age=86400` (24 hours). Returning users kept loading the old `index.html` which referenced old chunk hashes.",
    solution:
      "Configured Cloudflare CDN caching rules: Set `Cache-Control: no-cache` on `/index.html` so browsers always revalidate the entry file, while leaving `/assets/*.js` and `/assets/*.css` with `max-age=31536000, immutable`. All subsequent deployments reflected globally in <2 seconds.",
  },
  questions: [
    {
      id: "d4-q1",
      question: "Explain the difference between Layout (Reflow), Repaint, and Compositing. Which CSS properties are cheapest to animate?",
      difficulty: "medium",
      answer:
        "Layout (Reflow) recalculates the geometric dimensions and positions of elements on page. It is the most expensive operation. Repaint redraws visual aspects (color, visibility, shadows) without changing geometry. Compositing groups painted layers and blends them on the GPU for display on screen. The cheapest properties to animate are `transform` and `opacity` because modern browsers execute them exclusively on the GPU Compositor thread, skipping both Layout and Paint completely.",
      explanation:
        "Directly answers UI smoothness questions and demonstrates understanding of the browser rendering engine.",
      interviewTrap:
        "Saying that `left` or `top` with CSS transitions is GPU accelerated. It is not; it triggers reflow on every frame unless using `transform`.",
    },
    {
      id: "d4-q2",
      question: "What is the difference between a Microtask and a Macrotask in the JavaScript Event Loop?",
      difficulty: "medium",
      answer:
        "A Macrotask (Task) comes from timers (`setTimeout`, `setInterval`), I/O, UI event handlers, or message channels. A Microtask comes from `Promise.then/catch`, `queueMicrotask`, or `MutationObserver`. The key difference is queue execution behavior: after a task completes, the event loop drains the *entire* microtask queue to completion before yielding to browser rendering or executing the next macrotask. If microtasks schedule more microtasks, they continue executing synchronously, potentially starving the macrotask queue.",
      explanation:
        "One of the top 3 most frequently asked JavaScript interview questions across FAANG and top startups.",
      interviewTrap:
        "Claiming that setTimeout(fn, 0) executes before Promise.resolve().then(fn). Microtasks ALWAYS execute first.",
    },
    {
      id: "d4-q3",
      question: "How does Vite achieve instant server start compared to Webpack?",
      difficulty: "medium",
      answer:
        "Webpack builds an entire dependency graph and bundles all JavaScript into bundles before opening a local port. Vite splits code into dependencies and source code. It pre-bundles external dependencies once using Go-compiled `esbuild` (10-100x faster than Node-based tools), and serves application source code directly as native browser ES Modules over HTTP. The browser requests individual files on-demand as they are imported. When a file is modified, Vite only re-transforms that single file and pushes it over WebSocket HMR without rebundling the rest of the application.",
      explanation:
        "Shows modern tooling mastery and architectural awareness of ESM in browsers.",
      interviewTrap:
        "Saying Vite doesn't bundle in production. Vite uses Rollup to create bundles for production deployments.",
    },
    {
      id: "d4-q4",
      question: "What is tree-shaking, and what package.json configuration enables it?",
      difficulty: "hard",
      answer:
        "Tree-shaking is the process of removing unused exports from the final JavaScript bundle. It relies on the static structure of ES2015 module syntax (`import` and `export`) where imports are deterministic and statically analyzable at compile time. In package.json, setting `\"sideEffects\": false` tells the bundler that none of the files in the package contain side effects (like mutating global variables or modifying prototypes), allowing the bundler to safely drop any export that is not explicitly consumed by the application.",
      explanation:
        "Bundle size optimization is a core senior frontend responsibility.",
      interviewTrap:
        "Forgetting to mention that CSS imports or polyfills are side effects. If a project has CSS files, `\"sideEffects\": [\"*.css\"]` must be specified to avoid dropping styling.",
    },
  ],
  quiz: [
    {
      id: "d4-qz1",
      question: "Which of the following CSS properties can be animated without triggering a Layout (Reflow) or Paint operation?",
      options: [
        {
          id: "a",
          text: "transform and opacity",
          isCorrect: true,
          explanation: "These run exclusively on the GPU compositor thread without triggering layout or paint.",
        },
        {
          id: "b",
          text: "top and left",
          isCorrect: false,
          explanation: "top and left change geometry and force Layout (Reflow) on every frame.",
        },
        {
          id: "c",
          text: "width and height",
          isCorrect: false,
          explanation: "width and height trigger expensive reflows.",
        },
      ],
      explanation: "GPU compositor handles transform and opacity directly.",
    },
    {
      id: "d4-qz2",
      question: "Given: console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D'); What is printed?",
      options: [
        {
          id: "a",
          text: "A, D, C, B",
          isCorrect: true,
          explanation: "A and D run synchronously; then the microtask C runs; then the macrotask B runs.",
        },
        {
          id: "b",
          text: "A, B, C, D",
          isCorrect: false,
          explanation: "B is in the timer macrotask queue and cannot execute before synchronous code D.",
        },
        {
          id: "c",
          text: "A, D, B, C",
          isCorrect: false,
          explanation: "Microtask C must run before the timer macrotask B.",
        },
      ],
      explanation: "Sync code → Microtask queue → Macrotask queue.",
    },
    {
      id: "d4-qz3",
      question: "What is the optimal Cache-Control policy for index.html versus hashed asset bundles (e.g. bundle.a8f2c.js)?",
      options: [
        {
          id: "a",
          text: "index.html: no-cache | hashed assets: max-age=31536000, immutable",
          isCorrect: true,
          explanation: "This allows instant updates via index.html revalidation while maximizing CDN caching for assets.",
        },
        {
          id: "b",
          text: "index.html: max-age=31536000 | hashed assets: no-cache",
          isCorrect: false,
          explanation: "Caching index.html for a year prevents users from receiving any new deployments.",
        },
        {
          id: "c",
          text: "Both index.html and assets should be cached with max-age=0.",
          isCorrect: false,
          explanation: "Disabling asset caching degrades page load speed significantly.",
        },
      ],
      explanation: "Revalidate the entry HTML and cache content-hashed assets immutably.",
    },
  ],
  exercise: {
    id: "coding-async-series",
    title: "Event Loop & Async Pipeline Execution",
    track: "coding",
    url: "/coding/coding-async-series",
    description:
      "Implement an asynchronous series execution pipeline that resolves asynchronous tasks sequentially without blocking the browser main thread, handling errors, timeout bounds, and microtask resolution order.",
    expectedOutcome:
      "Sequential execution of asynchronous tasks with strict ordering, error propagation, and non-blocking event loop behavior.",
    complexityTip:
      "Use reduce or for-await-of loop rather than Promise.all, ensuring tasks execute in serial order.",
    starterSnippet: `// Exercise: Async Series Pipeline
export async function asyncSeries(tasks) {
  const results = [];
  for (const task of tasks) {
    try {
      const res = await task();
      results.push(res);
    } catch (err) {
      throw err; // Fail fast on error
    }
  }
  return results;
}`,
    hints: [
      "Avoid Promise.all because Promise.all executes tasks in parallel.",
      "Ensure each promise settles before the next function is invoked.",
      "Handle rejected promises properly according to spec.",
    ],
  },
};
