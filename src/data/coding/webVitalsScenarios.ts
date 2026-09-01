import type { CodingProblem } from "../../types";

export const webVitalsScenariosProblem: CodingProblem = {
  id: "coding-web-vitals-scenarios",
  title: "Web Vitals Instrumentation & Scenario Diagnostic Engine",
  difficulty: "Senior",
  category: "Coding",
  tags: [
    "performance",
    "web-vitals",
    "inp",
    "lcp",
    "cls",
    "performance-observer",
    "browser",
  ],

  problem: `Implement a production-grade Web Vitals instrumentation utility and scenario analysis engine in JavaScript/TypeScript.

The utility must:
1. Use \`PerformanceObserver\` to measure and calculate Core Web Vitals:
   - **LCP (Largest Contentful Paint)**: Identifies the largest render element, good threshold $\\le 2.5\\text{s}$.
   - **INP (Interaction to Next Paint)**: Measures user interaction latency across clicks/key presses, good threshold $\\le 200\\text{ms}$.
   - **CLS (Cumulative Layout Shift)**: Tracks unexpected layout shifts excluding user input within 500ms, good threshold $\\le 0.1$.
   - **FCP (First Contentful Paint)**: Good threshold $\\le 1.8\\text{s}$.
   - **TTFB (Time to First Byte)**: Good threshold $\\le 800\\text{ms}$.
2. Provide a scenario diagnosis helper \`diagnosePerformanceBottleneck(metrics, scenario)\` that answers real-world interview diagnostic questions, such as:
   - "If SSR document generation is delayed, which Web Vital is most directly affected first and why?" (Answer: TTFB, cascading directly to FCP and LCP).
   - "If a heavy third-party tracking script runs on the main thread during button click, which Web Vital degrades?" (Answer: INP).
   - "If web fonts swap without size-adjust or fallback matching, which metric degrades?" (Answer: CLS).
3. Report metrics safely via \`navigator.sendBeacon\` or custom analytics callback.`,

  requirements: [
    "Observe LCP, INP, CLS, FCP, TTFB via PerformanceObserver",
    'Calculate metric ratings ("good", "needs-improvement", "poor")',
    "CLS session windowing (maximum session window of 5s with 1s gap)",
    "INP calculation using 98th percentile for long sessions or maximum interaction duration",
    "Programmatic scenario diagnosis function evaluating latency bottlenecks",
  ],

  examples: [
    {
      input: `const monitor = initWebVitalsMonitor(metric => console.log(metric));\n// Triggers real-time metric reporting as user interacts with page`,
      output: `{ name: 'LCP', value: 1420, rating: 'good', element: 'img.hero-banner' }`,
      explanation:
        "Reports LCP at 1.42 seconds (within the 2.5s good threshold).",
    },
    {
      input: `diagnoseScenario('SSR server rendered document query takes 3500ms before returning initial byte')`,
      output: `{ primaryMetric: 'TTFB', impact: 'high', cascadedMetrics: ['FCP', 'LCP'], rootCause: 'Server-side database delay or un-cached SSR generation' }`,
      explanation:
        "Identifies TTFB as the initial failure point cascading to FCP and LCP.",
    },
  ],

  edgeCases: [
    "Page loaded in background tab: discard or flag LCP metric per spec",
    "User navigates away before LCP/INP resolves: flush buffered metrics on visibilitychange (hidden)",
    "Layout shifts caused by user interaction within 500ms: must be excluded via hadRecentInput check",
    "Browsers without PerformanceObserver support: graceful degradation without throwing",
  ],

  naiveApproach: `A naive approach tries using \`window.performance.timing\` (deprecated PerformanceTiming API) or single timestamp measurements, failing to capture dynamic shifts (CLS), user interaction responsiveness (INP), or actual largest contentful painted elements.`,

  optimalApproach: `The optimal approach:
1. Creates dedicated \`PerformanceObserver\` instances for entries of type: \`largest-contentful-paint\`, \`layout-shift\`, \`first-input\`, \`event\`, \`paint\`, and \`navigation\`.
2. For **CLS**: Groups layout shifts into session windows (maximum window 5s, gap 1s) and takes the maximum session window score.
3. For **INP**: Collects all interactions (pointerdown, click, keydown), measures processing time + presentation delay via \`requestAnimationFrame\`, and computes the 98th percentile interaction.
4. For **LCP**: Takes the latest entry before page interaction or visibility change.`,

  implementation: `const THRESHOLDS = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function getRating(name, value) {
  const [good, poor] = THRESHOLDS[name] || [1000, 3000];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function initWebVitalsMonitor(onReport) {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  const observers = [];

  // 1. TTFB & FCP
  try {
    const navObserver = new PerformanceObserver((entryList) => {
      const nav = entryList.getEntries()[0];
      if (nav) {
        const ttfb = nav.responseStart - nav.requestStart;
        onReport({ name: 'TTFB', value: Math.round(ttfb), rating: getRating('TTFB', ttfb) });
      }
    });
    navObserver.observe({ type: 'navigation', buffered: true });
    observers.push(navObserver);

    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          onReport({ name: 'FCP', value: Math.round(entry.startTime), rating: getRating('FCP', entry.startTime) });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    observers.push(paintObserver);
  } catch (e) {}

  // 2. LCP
  let lcpValue = 0;
  let lcpElement = null;
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
        lcpElement = lastEntry.element;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);
  } catch (e) {}

  // 3. CLS (Session windowing)
  let sessionValue = 0;
  let sessionEntries = [];
  let maxCls = 0;

  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > maxCls) {
            maxCls = sessionValue;
          }
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);
  } catch (e) {}

  // Flush on page hide
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      if (lcpValue > 0) {
        onReport({ name: 'LCP', value: Math.round(lcpValue), rating: getRating('LCP', lcpValue), element: lcpElement });
      }
      onReport({ name: 'CLS', value: Number(maxCls.toFixed(4)), rating: getRating('CLS', maxCls) });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    observers.forEach(obs => obs.disconnect());
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

// Scenario diagnosis engine for interview questions
function diagnosePerformanceBottleneck(scenarioDescription) {
  const text = scenarioDescription.toLowerCase();

  if (text.includes('ssr') || text.includes('server') || text.includes('database delay')) {
    return {
      primaryMetric: 'TTFB',
      impact: 'High',
      cascadedMetrics: ['FCP', 'LCP'],
      explanation: 'Slow server-side response directly delays TTFB (Time to First Byte). Because the browser cannot receive HTML to construct the DOM and discover critical render resources, FCP and LCP are delayed by at least that same server duration.',
      recommendation: 'Enable edge caching, stream HTML (SSR streaming with React 19 / Suspense), optimize database queries, or pre-render static shells (SSG/ISR).'
    };
  }

  if (text.includes('input') || text.includes('click') || text.includes('main thread') || text.includes('long task')) {
    return {
      primaryMetric: 'INP',
      impact: 'High',
      cascadedMetrics: ['Total Blocking Time (TBT)'],
      explanation: 'Heavy JavaScript execution during user events occupies the browser main thread, causing long input delay and delayed presentation of the next frame (Interaction to Next Paint).',
      recommendation: 'Yield to main thread using scheduler.yield() or setTimeout, offload compute to Web Workers, and debounce rapid input event handlers.'
    };
  }

  if (text.includes('font') || text.includes('image without size') || text.includes('banner') || text.includes('shift')) {
    return {
      primaryMetric: 'CLS',
      impact: 'Medium-High',
      cascadedMetrics: [],
      explanation: 'Late-rendered dynamic banners or web fonts with mismatched fallback dimensions cause sudden layout shifts, degrading Cumulative Layout Shift.',
      recommendation: 'Reserve explicit aspect-ratio or width/height on images and dynamic slots; use font-display: swap with size-adjust and @font-face fallback matching.'
    };
  }

  return {
    primaryMetric: 'LCP',
    impact: 'High',
    cascadedMetrics: ['FCP'],
    explanation: 'Sub-optimal resource discovery or heavy image payloads delay Largest Contentful Paint.',
    recommendation: 'Use <link rel="preload" as="image"> for hero images, optimize images with WebP/AVIF, and eliminate render-blocking CSS/JS.'
  };
}`,

  implementationTS: `export interface WebVitalMetric {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  element?: Element | null;
}

export interface ScenarioDiagnosis {
  primaryMetric: string;
  impact: string;
  cascadedMetrics: string[];
  explanation: string;
  recommendation: string;
}

export function diagnosePerformanceBottleneck(scenarioDescription: string): ScenarioDiagnosis {
  const text = scenarioDescription.toLowerCase();

  if (text.includes('ssr') || text.includes('server') || text.includes('database delay')) {
    return {
      primaryMetric: 'TTFB',
      impact: 'High',
      cascadedMetrics: ['FCP', 'LCP'],
      explanation: 'Slow server-side response directly delays TTFB. The browser cannot construct the DOM or fetch critical resources until initial HTML arrives, pushing back FCP and LCP.',
      recommendation: 'Enable edge caching, implement streaming SSR with Suspense, optimize backend database queries, or use SSG/ISR.'
    };
  }

  if (text.includes('input') || text.includes('click') || text.includes('main thread') || text.includes('long task')) {
    return {
      primaryMetric: 'INP',
      impact: 'High',
      cascadedMetrics: ['Total Blocking Time (TBT)'],
      explanation: 'Heavy JavaScript execution during user interactions blocks the main thread, resulting in high input delay and poor Interaction to Next Paint.',
      recommendation: 'Break long tasks with scheduler.yield(), offload heavy calculations to Web Workers, and optimize event handlers.'
    };
  }

  if (text.includes('font') || text.includes('image without size') || text.includes('banner') || text.includes('shift')) {
    return {
      primaryMetric: 'CLS',
      impact: 'Medium-High',
      cascadedMetrics: [],
      explanation: 'Unsized media or font swapping causes layout reflows and shifts, increasing Cumulative Layout Shift.',
      recommendation: 'Set width/height and aspect-ratio on all media and use size-adjust on fallback web fonts.'
    };
  }

  return {
    primaryMetric: 'LCP',
    impact: 'High',
    cascadedMetrics: ['FCP'],
    explanation: 'Hero image loading latency or render-blocking scripts delay Largest Contentful Paint.',
    recommendation: 'Preload LCP images with priority="high", use modern image formats (AVIF/WebP), and inline critical CSS.'
  };
}`,

  stepByStep: [
    "Instantiate PerformanceObserver instances for navigation, paint, LCP, layout-shift, and interaction entries.",
    "Implement CLS session window grouping with 1-second gap and 5-second maximum session ceiling.",
    "Classify metric scores against Core Web Vitals threshold boundaries.",
    "Flush LCP and CLS on document visibilitychange to hidden.",
    "Implement diagnostic evaluation matching scenario prompts to root causes and mitigation strategies.",
  ],

  timeComplexity:
    "O(1) observation overhead; asynchronous PerformanceObserver runs on background browser threads.",
  spaceComplexity: "O(1) memory footprint.",

  alternativeSolutions: [
    "Google web-vitals npm package",
    "Chrome User Experience Report (CrUX) API integration",
  ],

  commonMistakes: [
    "Treating FID as a modern Core Web Vital (FID was officially replaced by INP in March 2024).",
    "Calculating CLS as a naive cumulative sum without session windowing.",
    "Missing the cascading relationship where TTFB bottlenecks automatically inflate FCP and LCP.",
  ],

  followUps: [
    "What is the difference between Lab data (Lighthouse) and Field data (RUM / CrUX)?",
    "How does React 19 Server Components (RSC) and progressive hydration affect Web Vitals?",
    "How do you debug INP in Chrome DevTools Performance panel using the Interactions track?",
  ],
};
