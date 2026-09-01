/**
 * ============================================
 * WEB VITALS - Complete Guide
 * ============================================
 * 
 * Topic: Web Vitals - How they work and can be improved
 */

// ============================================
// CORE WEB VITALS OVERVIEW
// ============================================

/**
 * WHAT ARE CORE WEB VITALS?
 * -------------------------
 * Google's metrics for measuring user experience on the web.
 * They are part of Google's "Page Experience" ranking signal.
 * 
 * THE 3 CORE WEB VITALS:
 * ----------------------
 * 
 * 1. LCP (Largest Contentful Paint)
 *    - Measures: Loading performance
 *    - Target: < 2.5 seconds
 *    - What: Time until largest content element is visible
 * 
 * 2. INP (Interaction to Next Paint) [Replaced FID in 2024]
 *    - Measures: Interactivity/Responsiveness
 *    - Target: < 200 milliseconds
 *    - What: Time from user input to next visual update
 * 
 * 3. CLS (Cumulative Layout Shift)
 *    - Measures: Visual stability
 *    - Target: < 0.1
 *    - What: Sum of all unexpected layout shifts
 * 
 * OTHER IMPORTANT METRICS:
 * ------------------------
 * - FCP (First Contentful Paint): Time to first content
 * - TTFB (Time to First Byte): Server response time
 * - TTI (Time to Interactive): When page becomes usable
 * - TBT (Total Blocking Time): Time main thread is blocked
 */

// ============================================
// 1. LCP - LARGEST CONTENTFUL PAINT
// ============================================

/**
 * LCP THEORY:
 * -----------
 * Measures when the largest content element becomes visible.
 * Considered elements:
 * - <img>
 * - <image> inside <svg>
 * - <video> poster image
 * - Background image via url()
 * - Block-level text elements
 * 
 * CAUSES OF SLOW LCP:
 * -------------------
 * 1. Slow server response (TTFB)
 * 2. Render-blocking JS/CSS
 * 3. Slow resource loading
 * 4. Client-side rendering
 * 
 * IMPROVEMENTS:
 * -------------
 */

const LCP_IMPROVEMENTS = {
  // 1. Optimize server response
  serverOptimization: {
    useHTTPCache: 'Set appropriate Cache-Control headers',
    useCDN: 'Serve content from edge locations',
    preconnect: '<link rel="preconnect" href="https://cdn.example.com">',
    optimizeBackend: 'Database queries, caching, code efficiency'
  },
  
  // 2. Remove render-blocking resources
  renderBlocking: {
    deferJS: '<script defer src="...">',
    asyncJS: '<script async src="...">',
    inlineCSS: 'Inline critical CSS, defer non-critical',
    mediaQueries: '<link rel="stylesheet" media="print" onload="this.media=\'all\'">'
  },
  
  // 3. Optimize images (often the LCP element)
  imageOptimization: {
    modernFormats: 'WebP, AVIF instead of PNG/JPEG',
    responsive: '<img srcset="..." sizes="...">',
    preload: '<link rel="preload" as="image" href="hero.webp">',
    lazyLoad: 'Only for below-the-fold images!',
    CDN: 'Image CDN with automatic optimization'
  },
  
  // 4. Use SSR/SSG over CSR
  rendering: {
    SSR: 'Server-Side Rendering for critical content',
    SSG: 'Static Site Generation for static content',
    streaming: 'React 18 streaming SSR',
    priority: 'fetchPriority="high" on LCP image'
  }
};

// Measure LCP
function measureLCP() {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime, 'ms');
    console.log('LCP Element:', lastEntry.element);
  }).observe({ type: 'largest-contentful-paint', buffered: true });
}


// ============================================
// 2. INP - INTERACTION TO NEXT PAINT
// ============================================

/**
 * INP THEORY:
 * -----------
 * Measures responsiveness to user interactions.
 * The INP is the worst interaction latency (at 98th percentile).
 * 
 * What counts as interaction:
 * - Click
 * - Tap
 * - Key press
 * 
 * CAUSES OF SLOW INP:
 * -------------------
 * 1. Long JavaScript tasks blocking main thread
 * 2. Large DOM size
 * 3. Expensive event handlers
 * 4. Layout thrashing
 * 
 * IMPROVEMENTS:
 * -------------
 */

const INP_IMPROVEMENTS = {
  // 1. Break up long tasks
  longTasks: {
    yieldToMain: 'Use scheduler.yield() or setTimeout(0)',
    webWorkers: 'Offload heavy computation',
    codeSpitting: 'Dynamic imports for non-critical code'
  },
  
  // 2. Optimize event handlers
  eventHandlers: {
    debounce: 'Limit frequency of expensive handlers',
    passive: '{ passive: true } for scroll/touch',
    delegation: 'Single handler on parent instead of many'
  },
  
  // 3. Reduce DOM size
  domOptimization: {
    virtualization: 'Render only visible items (react-window)',
    lazyRender: 'Defer rendering off-screen content',
    simplifyStructure: 'Reduce nesting and element count'
  },
  
  // 4. Avoid layout thrashing
  layoutThrashing: {
    batchReads: 'Read all DOM values before writing',
    useTransform: 'Transform/opacity for animations',
    containment: 'CSS contain: layout for isolated sections'
  }
};

// Break up long task example
async function yieldToMain() {
  // Modern way (when available)
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return scheduler.yield();
  }
  // Fallback
  return new Promise(resolve => setTimeout(resolve, 0));
}

async function processLargeArray(items) {
  const results = [];
  
  for (let i = 0; i < items.length; i++) {
    results.push(processItem(items[i]));
    
    // Yield every 100 items
    if (i % 100 === 0) {
      await yieldToMain();
    }
  }
  
  return results;
}

function processItem(item) {
  // Heavy computation
  return item;
}

// Measure INP
function measureINP() {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.interactionId) {
        console.log('Interaction:', entry.name);
        console.log('Duration:', entry.duration, 'ms');
      }
    });
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
}


// ============================================
// 3. CLS - CUMULATIVE LAYOUT SHIFT
// ============================================

/**
 * CLS THEORY:
 * -----------
 * Measures visual stability - how much the page layout shifts unexpectedly.
 * 
 * Formula: CLS = impact fraction × distance fraction
 * - Impact fraction: % of viewport affected
 * - Distance fraction: How far elements moved (% of viewport)
 * 
 * CAUSES OF CLS:
 * --------------
 * 1. Images/videos without dimensions
 * 2. Ads/embeds/iframes without reserved space
 * 3. Web fonts causing FOIT/FOUT
 * 4. Dynamic content inserted above existing content
 * 
 * IMPROVEMENTS:
 * -------------
 */

const CLS_IMPROVEMENTS = {
  // 1. Reserve space for images/videos
  mediaDimensions: {
    explicit: '<img width="800" height="600">',
    aspectRatio: 'aspect-ratio: 16 / 9 in CSS',
    container: 'Wrapper with padding-bottom for ratio'
  },
  
  // 2. Reserve space for dynamic content
  dynamicContent: {
    skeleton: 'Show skeleton loaders with same dimensions',
    minHeight: 'Set min-height on containers',
    placeholder: 'Reserve space for ads/embeds'
  },
  
  // 3. Optimize font loading
  fontOptimization: {
    display: 'font-display: swap or optional',
    preload: '<link rel="preload" as="font" crossorigin>',
    fallback: 'Use similar system font as fallback',
    fontMetrics: 'Adjust fallback metrics to match web font'
  },
  
  // 4. Avoid inserting content above fold
  contentInsertion: {
    reserveSpace: 'Reserve space for banners/notifications',
    appendBottom: 'Add new content below existing',
    transform: 'Animate with transform instead of layout'
  }
};

// Measure CLS
function measureCLS() {
  let clsValue = 0;
  
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('Layout shift:', entry.value);
        console.log('Elements:', entry.sources?.map(s => s.node));
      }
    }
    console.log('Total CLS:', clsValue);
  }).observe({ type: 'layout-shift', buffered: true });
}


// ============================================
// SCENARIO: SSR DOCUMENT DELAYED
// ============================================

/**
 * QUESTION: If SSR document is delayed, what vital is most affected?
 * 
 * ANSWER: LCP (Largest Contentful Paint)
 * 
 * WHY:
 * ----
 * - TTFB increases → LCP increases
 * - Content can't render until HTML arrives
 * - LCP element is blocked on initial HTML
 * 
 * CHAIN OF EVENTS:
 * 1. Browser requests HTML
 * 2. Server processes SSR (takes time)
 * 3. TTFB is high (waiting for HTML)
 * 4. HTML arrives late
 * 5. LCP element (likely in HTML) renders late
 * 6. LCP metric is poor
 * 
 * SECONDARY EFFECTS:
 * - FCP also delayed (first content delayed)
 * - TTI delayed (page not interactive until loaded)
 * - TBT may increase if hydration is slow
 * 
 * CLS/INP usually NOT directly affected by slow SSR
 * (unless timeouts cause different layouts)
 */


// ============================================
// COMPLETE MEASUREMENT CODE
// ============================================

/**
 * Measure all Core Web Vitals
 * (Using web-vitals library pattern)
 */
function measureAllVitals(callback) {
  // LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback({ name: 'LCP', value: lastEntry.startTime });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  
  // CLS
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    callback({ name: 'CLS', value: clsValue });
  }).observe({ type: 'layout-shift', buffered: true });
  
  // INP (simplified)
  let inpValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.interactionId && entry.duration > inpValue) {
        inpValue = entry.duration;
        callback({ name: 'INP', value: inpValue });
      }
    }
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  
  // FCP
  new PerformanceObserver((list) => {
    const entry = list.getEntries()[0];
    callback({ name: 'FCP', value: entry.startTime });
  }).observe({ type: 'paint', buffered: true });
  
  // TTFB
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    callback({ name: 'TTFB', value: navigation.responseStart });
  }
}

// Usage
// measureAllVitals(({ name, value }) => {
//   console.log(`${name}: ${value.toFixed(2)}`);
//   // Send to analytics
// });


// ============================================
// QUICK REFERENCE TABLE
// ============================================

/**
 * CORE WEB VITALS SUMMARY
 * =======================
 * 
 * | Metric | Measures       | Good    | Needs Work | Poor   |
 * |--------|----------------|---------|------------|--------|
 * | LCP    | Loading        | <2.5s   | 2.5-4.0s   | >4.0s  |
 * | INP    | Interactivity  | <200ms  | 200-500ms  | >500ms |
 * | CLS    | Stability      | <0.1    | 0.1-0.25   | >0.25  |
 * 
 * PRIMARY CAUSE & FIX
 * ===================
 * 
 * LCP Too High:
 *   Cause: Large images, slow server, render-blocking resources
 *   Fix: Preload LCP image, optimize TTFB, use CDN
 * 
 * INP Too High:
 *   Cause: Long JavaScript tasks, heavy event handlers
 *   Fix: Break up tasks, use Web Workers, debounce handlers
 * 
 * CLS Too High:
 *   Cause: Images without dimensions, dynamic content, fonts
 *   Fix: Set dimensions, reserve space, preload fonts
 */


// ============================================
// INTERVIEW TIPS
// ============================================

/**
 * COMMON INTERVIEW QUESTIONS:
 * ---------------------------
 * 
 * 1. What are the Core Web Vitals?
 *    Answer: LCP, INP, CLS - measuring loading, interactivity, stability
 * 
 * 2. How do you improve LCP?
 *    Answer: Preload critical resources, optimize images, use CDN, 
 *    reduce TTFB, eliminate render-blocking resources
 * 
 * 3. What causes high CLS?
 *    Answer: Images without dimensions, dynamic content, fonts,
 *    ads loading without reserved space
 * 
 * 4. If SSR is slow, what metric suffers most?
 *    Answer: LCP (and FCP, TTFB) - content can't render until HTML arrives
 * 
 * 5. How do you measure Web Vitals in production?
 *    Answer: Use web-vitals library, PerformanceObserver API,
 *    send to analytics (GA4, custom endpoint)
 */


module.exports = {
  LCP_IMPROVEMENTS,
  INP_IMPROVEMENTS,
  CLS_IMPROVEMENTS,
  measureLCP,
  measureINP,
  measureCLS,
  measureAllVitals,
  yieldToMain
};
