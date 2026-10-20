import type { SprintDayLesson } from "./types";

export const day3Lesson: SprintDayLesson = {
  day: 3,
  id: "performance-core-web-vitals",
  title: "Performance & Core Web Vitals Optimization",
  tagline: "LCP, INP, CLS thresholds, long task breaking, React profiling, list virtualization, and real user monitoring",
  estimatedMinutes: 85,
  objectives: [
    "Memorize and master Google's 3 Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1",
    "Diagnose and eliminate high INP caused by JavaScript main-thread blocking long tasks (>50ms)",
    "Prevent Cumulative Layout Shift (CLS) using explicit dimensions, aspect-ratio, and font display strategies",
    "Profile React render cascades using DevTools Flamegraphs and pinpoint unnecessary re-renders",
    "Implement list virtualization and distinguish Lab synthetic metrics (Lighthouse) from Field RUM metrics (CrUX)",
  ],
  beginnerOverview:
    "Web performance directly impacts conversion, user engagement, and search engine ranking. Core Web Vitals are Google's standardized metrics quantifying real user experience across loading speed, user responsiveness, and visual stability.",
  deepDiveExplanation:
    "Core Web Vitals consist of three pillar metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). INP replaced FID (First Input Delay) as a Core Web Vital to capture the *entire lifecycle* of user interactions (input delay + processing time + presentation delay) across the whole session, not just the first click. Whenever JavaScript executes a task taking longer than 50ms (a Long Task), the main thread cannot process user gestures or render animation frames. Senior engineers use `PerformanceObserver`, React Profiler flamegraphs, code splitting, and `scheduler.yield()` or microtask chunking to ensure 60fps responsiveness.",
  sections: [
    {
      id: "cwv-thresholds-breakdown",
      heading: "1. Core Web Vitals Targets & Diagnostic Anatomy",
      content:
        "Every frontend engineer MUST know these exact target thresholds:\n\n1. **LCP (Largest Contentful Paint)**: Measures loading speed. The render time of the largest image or text block in viewport.\n   - **Good**: ≤ 2.5 seconds\n   - **Needs Improvement**: 2.5s – 4.0s\n   - **Poor**: > 4.0s\n\n2. **INP (Interaction to Next Paint)**: Measures responsiveness. Time from when a user interacts (click, keypress, tap) until the browser presents the next visual frame on screen.\n   - **Good**: ≤ 200 milliseconds\n   - **Needs Improvement**: 200ms – 500ms\n   - **Poor**: > 500ms\n\n3. **CLS (Cumulative Layout Shift)**: Measures visual stability. Sum of layout shift scores for unexpected movements of visible elements.\n   - **Good**: ≤ 0.1\n   - **Needs Improvement**: 0.1 – 0.25\n   - **Poor**: > 0.25",
      codeExample: {
        language: "typescript",
        caption: "Measuring Core Web Vitals in JavaScript using PerformanceObserver",
        code: `// Observing LCP with PerformanceObserver API
const lcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log("LCP candidate time:", lastEntry.startTime); // Target: <= 2500ms
});
lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

// Observing Layout Shifts (CLS)
let clsScore = 0;
const clsObserver = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Only count shifts that were NOT caused by recent user input
    if (!(entry as any).hadRecentInput) {
      clsScore += (entry as any).value;
    }
  }
  console.log("Current CLS Score:", clsScore); // Target: <= 0.1
});
clsObserver.observe({ type: "layout-shift", buffered: true });`,
      },
      keyTakeaway:
        "Thresholds: LCP ≤ 2.5s | INP ≤ 200ms | CLS ≤ 0.1. Measure buffered performance entries to capture early load events.",
    },
    {
      id: "inp-and-long-tasks",
      heading: "2. Cracking INP: Breaking Long Tasks (>50ms)",
      content:
        "Any synchronous JavaScript execution block running longer than 50ms is classified by the browser as a Long Task. During a long task, the browser main thread is completely frozen: clicks, keystrokes, and scrolls cannot be processed, spiking INP.\n\nINP consists of 3 distinct phases:\n1. **Input Delay**: Time waiting for previous tasks to finish before handler starts.\n2. **Processing Time**: Synchronous execution of the event handler code.\n3. **Presentation Delay**: Time for browser to layout, paint, and display the next frame.\n\nTo optimize INP:\n- Yield to the main thread during heavy calculations using `await scheduler.yield()` or `setTimeout(..., 0)`.\n- Use `useTransition` to mark non-urgent UI updates as interruptible.",
      codeExample: {
        language: "typescript",
        caption: "Yielding to the main thread to prevent UI freezing during large data processing",
        code: `async function yieldToMain() {
  if ('scheduler' in window && 'yield' in (window as any).scheduler) {
    await (window as any).scheduler.yield();
  } else {
    // Fallback: yield via task queue
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

// Processing 50,000 items without freezing the browser
async function processLargeDataset(items: string[]) {
  const chunkSize = 1000;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    // Process chunk synchronously
    computeChunk(chunk);

    // Yield control back to browser so it can process user clicks & paint!
    await yieldToMain();
  }
}`,
      },
      keyTakeaway:
        "Break CPU-bound loops into chunks and yield to the main thread every ~16ms-50ms to keep INP well below 200ms.",
    },
    {
      id: "cls-prevention",
      heading: "3. Eliminating Cumulative Layout Shift (CLS)",
      content:
        "CLS happens when elements shift unexpectedly after initial render. Major causes and solutions:\n\n1. **Images without dimensions**: Browser doesn't know image aspect ratio until image bytes download, causing page content below to violently jump.\n   - **Fix**: Always specify `width` and `height` attributes on `<img>` or use CSS `aspect-ratio: 16 / 9`.\n2. **Dynamic ad banners / dynamic content injected above the fold**:\n   - **Fix**: Reserve static container placeholder dimensions (e.g. `min-height: 250px`).\n3. **FOUT (Flash of Unstyled Text) / FOIT**:\n   - **Fix**: Use `font-display: optional` or preload web fonts to prevent text reflow when custom fonts arrive.",
      codeExample: {
        language: "css",
        caption: "CSS Aspect-Ratio & Skeleton placeholders to guarantee 0.00 CLS",
        code: `/* Reserve layout space before remote image or banner loads */
.banner-card {
  width: 100%;
  aspect-ratio: 16 / 9; /* Browser reserves exact height immediately! */
  background: #282828;  /* Subtle placeholder surface prevents jump */
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`,
      },
      expectedOutput: "Zero layout shift (CLS = 0.00) even on slow 3G connections when images load slowly.",
      keyTakeaway:
        "Always reserve aspect-ratio or min-height for dynamically loaded media, ads, and remote data cards.",
    },
    {
      id: "virtualization-dom-optimization",
      heading: "4. List Virtualization: Rendering 100,000 Rows at 60 FPS",
      content:
        "Rendering 10,000 DOM nodes consumes hundreds of megabytes of memory and causes severe layout/style recalculation lag. Virtualization renders only the items currently visible in the user's viewport (plus a small buffer of 3-5 items above and below).\n\nKey Concepts:\n- **Container Height**: Defines the scrollable boundary.\n- **Total Height (Spacer)**: `items.length * itemHeight` keeps the scrollbar native and accurate.\n- **Start Index**: `Math.floor(scrollTop / itemHeight)`\n- **Visible Count**: `Math.ceil(containerHeight / itemHeight)`\n- **Offset Transform**: `translateY(startIndex * itemHeight)` positions rendered items accurately.",
      codeExample: {
        language: "typescript",
        caption: "Core mathematics of a fixed-height virtualized list",
        code: `function VirtualList({ items, itemHeight = 40, containerHeight = 400 }: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2); // 2 buffer
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 4; // 4 buffer
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Invisible spacer keeps scrollbar accurate */}
      <div style={{ height: totalHeight, width: '100%' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ height: itemHeight }}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      },
      keyTakeaway:
        "Virtualization replaces tens of thousands of DOM nodes with ~20 active nodes, keeping memory negligible and scrolling at 60fps.",
    },
    {
      id: "lab-vs-field-crux",
      heading: "5. Lab vs. Field Data (Lighthouse vs. CrUX)",
      content:
        "A critical senior interview distinction:\n\n- **Lab Data (Synthetic)**: Collected in a controlled environment using tools like Lighthouse on a single simulated device/network. Good for reproducible debugging and pre-commit checks, but cannot measure INP accurately because no real humans are clicking the UI.\n\n- **Field Data (RUM / Real User Monitoring)**: Collected from actual users visiting the site across real devices, networks, and sessions (e.g. Chrome User Experience Report - CrUX). Field data is what Google uses for search ranking algorithms.\n\nA site can have a 100/100 Lighthouse score in Lab testing while having a terrible INP in the Field due to low-end Android mobile devices and long-running analytics scripts.",
      keyTakeaway:
        "Lighthouse measures Lab data; CrUX measures Field data. INP can only be measured reliably with Field data from real user interactions.",
    },
  ],
  misconceptions: [
    {
      myth: "Lighthouse 100 score guarantees your site passes Google's Core Web Vitals.",
      reality:
        "Lighthouse is synthetic lab data. Google ranks sites using real-user Field data from CrUX over a rolling 28-day window. If real users on low-end devices experience lag, the site fails Core Web Vitals regardless of Lighthouse scores.",
    },
    {
      myth: "First Input Delay (FID) is still a Core Web Vital.",
      reality:
        "In March 2024, Google officially replaced FID with INP (Interaction to Next Paint). FID only measured the very first click's input delay; INP measures all clicks, taps, and keystrokes throughout the entire page lifecycle.",
    },
  ],
  realWorldScenario: {
    title: "E-Commerce Checkout Button Freezing (High INP)",
    problem:
      "When users clicked 'Place Order' on a high-traffic retail app, the button froze for 680ms with no visual feedback. Users repeatedly smashed the button, submitting duplicate orders. Field INP was 720ms ('Poor').",
    solution:
      "Root cause analysis revealed the click handler was synchronously calculating cart tax and dispatching 4 synchronous analytics trackers before updating UI state. Refactored the handler to immediately set `isSubmitting = true` (providing instantaneous visual feedback in <50ms) and deferred the analytics logging using `queueMicrotask` and `navigator.sendBeacon`. Reduced INP to 65ms ('Good').",
  },
  questions: [
    {
      id: "d3-q1",
      question: "State the three Core Web Vitals metrics, their exact target thresholds, and what each measures.",
      difficulty: "medium",
      answer:
        "1. LCP (Largest Contentful Paint) ≤ 2.5s: Measures loading performance by timing when the largest visible image or text block is rendered.\n2. INP (Interaction to Next Paint) ≤ 200ms: Measures responsiveness by tracking the latency of all user interactions (clicks, keypresses, taps) until the next frame paints.\n3. CLS (Cumulative Layout Shift) ≤ 0.1: Measures visual stability by summing layout shift scores of unexpected content movement.",
      explanation:
        "Every frontend candidate must state these three numbers without hesitation.",
      interviewTrap:
        "Saying FID instead of INP, or getting the thresholds wrong (e.g. saying 100ms for INP or 0.25 for CLS).",
    },
    {
      id: "d3-q2",
      question: "What is the difference between Lab Data and Field Data, and why does it matter?",
      difficulty: "medium",
      answer:
        "Lab data is gathered in simulated, controlled test conditions (e.g., Lighthouse running on a MacBook with CPU throttling). It is repeatable and useful for debugging, but does not capture real-world user variety or authentic user interaction latency. Field data (RUM) is gathered from real users browsing on real devices and networks across the globe (e.g., Google CrUX). Field data reflects actual user experience and is the basis for Google's search ranking algorithms.",
      explanation:
        "Shows maturity in understanding real-world production monitoring versus development tools.",
      interviewTrap:
        "Relying solely on local Lighthouse audits to claim a website has passed Core Web Vitals.",
    },
    {
      id: "d3-q3",
      question: "How do you diagnose and optimize high Interaction to Next Paint (INP)?",
      difficulty: "hard",
      answer:
        "INP has three sub-phases: Input Delay, Processing Time, and Presentation Delay. 1) Identify slow interactions using PerformanceObserver with `type: 'event'` or Chrome DevTools Performance panel (looking for Long Tasks >50ms). 2) Minimize Input Delay by avoiding main-thread blocking tasks during page idle. 3) Minimize Processing Time by offloading heavy work to Web Workers, breaking long loops using `await scheduler.yield()`, and deferring non-critical tracking. 4) Minimize Presentation Delay by keeping DOM trees shallow and avoiding forced synchronous layouts (layout thrashing) in the render cycle.",
      explanation:
        "Breaking INP into its three constituent parts immediately signals senior-level understanding.",
      interviewTrap:
        "Confusing INP with LCP or only mentioning debouncing without explaining main-thread yielding.",
    },
    {
      id: "d3-q4",
      question: "How does list virtualization work and what are its trade-offs?",
      difficulty: "hard",
      answer:
        "List virtualization calculates the visible slice of items based on container height and scroll offset, rendering only those ~15-25 DOM elements plus a small buffer. It simulates the full list height using an outer spacer element with `height: totalCount * itemHeight` so the scrollbar remains natural. Trade-offs include: complex implementation for variable dynamic row heights, keyboard accessibility / screen reader navigation requires virtual focus management, and Ctrl+F browser native in-page text search only finds visible items.",
      explanation:
        "Senior engineers understand both how virtualization works and its accessibility trade-offs.",
      interviewTrap:
        "Failing to mention the trade-offs (like in-page Ctrl+F search breaking) when recommending virtualization.",
    },
  ],
  quiz: [
    {
      id: "d3-qz1",
      question: "What is Google's recommended target threshold for Interaction to Next Paint (INP)?",
      options: [
        {
          id: "a",
          text: "200 milliseconds or less",
          isCorrect: true,
          explanation: "Google's 75th percentile threshold for a 'Good' INP rating is ≤ 200ms.",
        },
        {
          id: "b",
          text: "100 milliseconds or less",
          isCorrect: false,
          explanation: "100ms was the threshold for FID; INP includes processing and presentation delay with a threshold of 200ms.",
        },
        {
          id: "c",
          text: "2.5 seconds or less",
          isCorrect: false,
          explanation: "2.5 seconds is the target threshold for LCP, not INP.",
        },
      ],
      explanation: "Good Core Web Vitals thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.",
    },
    {
      id: "d3-qz2",
      question: "How can you prevent Cumulative Layout Shift (CLS) when loading responsive images?",
      options: [
        {
          id: "a",
          text: "Always provide explicit width/height attributes or a CSS aspect-ratio on the container.",
          isCorrect: true,
          explanation: "This allows the browser to calculate the container height before image bytes are downloaded.",
        },
        {
          id: "b",
          text: "Wrap all images in a React.memo component.",
          isCorrect: false,
          explanation: "React.memo affects component re-renders, not DOM layout shift geometry.",
        },
        {
          id: "c",
          text: "Convert all images to SVG base64 strings inline.",
          isCorrect: false,
          explanation: "Inlining large SVGs bloats the HTML bundle and harms LCP.",
        },
      ],
      explanation: "CSS aspect-ratio reserves the geometry box immediately, eliminating layout shift.",
    },
    {
      id: "d3-qz3",
      question: "Why does a 50ms task duration represent a critical boundary in browser performance?",
      options: [
        {
          id: "a",
          text: "Tasks exceeding 50ms are classified as 'Long Tasks' that block the event loop from servicing user input.",
          isCorrect: true,
          explanation: "The browser needs the main thread to stay responsive. Tasks >50ms cause noticeable input latency.",
        },
        {
          id: "b",
          text: "The browser automatically terminates any script running longer than 50ms with an Out of Memory error.",
          isCorrect: false,
          explanation: "Browsers do not terminate scripts at 50ms.",
        },
        {
          id: "c",
          text: "50ms is the maximum size of a TCP packet.",
          isCorrect: false,
          explanation: "TCP packets are measured in bytes, not time.",
        },
      ],
      explanation: "Tasks >50ms are Long Tasks that directly inflate INP and cause frame drops.",
    },
  ],
  exercise: {
    id: "coding-web-vitals-scenarios",
    title: "Core Web Vitals Diagnostics & Scenario Evaluator",
    track: "coding",
    url: "/coding/coding-web-vitals-scenarios",
    description:
      "Analyze and diagnose real-world frontend performance metric scenarios: evaluate LCP, INP, and CLS scores, classify performance buckets ('Good', 'Needs Improvement', 'Poor'), and calculate aggregate session scores.",
    expectedOutcome:
      "Pass all test cases verifying exact metric threshold categorization and layout shift aggregations.",
    complexityTip:
      "Ensure boundaries match the official spec: LCP <= 2500ms, INP <= 200ms, CLS <= 0.1.",
    starterSnippet: `// Exercise: Web Vitals Diagnostics
export function evaluateVitals(metrics) {
  const { lcp, inp, cls } = metrics;
  
  const getRating = (val, good, poor) => {
    if (val <= good) return 'good';
    if (val <= poor) return 'needs-improvement';
    return 'poor';
  };

  return {
    lcpRating: getRating(lcp, 2500, 4000),
    inpRating: getRating(inp, 200, 500),
    clsRating: getRating(cls, 0.1, 0.25),
    isAllGood: lcp <= 2500 && inp <= 200 && cls <= 0.1
  };
}`,
    hints: [
      "Check that LCP is measured in milliseconds (2500ms = 2.5s).",
      "Notice that CLS is a dimensionless unitless score (0.1, 0.25).",
      "Verify that boundary conditions use <= rather than <.",
    ],
  },
};
