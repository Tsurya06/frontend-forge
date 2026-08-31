import type { Topic } from '../../types';

export const performanceTopics: Topic[] = [
  {
    id: 'performance-optimization-techniques',
    title: 'Performance Optimization Techniques',
    description: 'Core techniques for optimizing JavaScript and web application performance including debouncing, throttling, memoization, and caching strategies.',
    category: 'Performance',
    difficulty: 'Intermediate',
    tags: ['debouncing', 'throttling', 'memoization', 'caching', 'prefetching', 'preloading'],
    overview: 'Performance optimization is a critical aspect of frontend development that directly impacts user experience, SEO rankings, and conversion rates. Understanding techniques like debouncing, throttling, memoization, and caching allows developers to build applications that feel fast and responsive even under heavy load.',
    concepts: [
      'Debouncing delays function execution until a pause in events',
      'Throttling limits function execution to at most once per time interval',
      'Memoization caches function results based on arguments',
      'Caching stores computed values or fetched data for reuse',
      'Prefetching loads resources before they are needed',
      'Preloading prioritizes critical resource loading',
      'Resource hints guide the browser on resource priorities'
    ],
    codeExamples: [
      {
        title: 'Debounce Implementation',
        code: `function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: search input
const handleSearch = debounce((query: string) => {
  fetchResults(query);
}, 300);`,
        language: 'typescript',
        explanation: 'Debounce waits for a pause in calls before executing. Ideal for search inputs, resize handlers, and form validation.'
      },
      {
        title: 'Throttle Implementation',
        code: `function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

// Usage: scroll handler
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);`,
        language: 'typescript',
        explanation: 'Throttle ensures a function executes at most once per specified interval. Ideal for scroll, mousemove, and resize events.'
      },
      {
        title: 'Memoization with WeakMap',
        code: `function memoize<T extends object, R>(
  fn: (arg: T) => R
): (arg: T) => R {
  const cache = new WeakMap<T, R>();
  return (arg: T): R => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const expensiveCalc = memoize((data: { values: number[] }) => {
  return data.values.reduce((sum, v) => sum + v * v, 0);
});`,
        language: 'typescript',
        explanation: 'WeakMap-based memoization allows garbage collection of cached entries when keys are no longer referenced.'
      }
    ],
    relatedTopicIds: ['react-rendering-optimization', 'bundle-optimization'],
    questions: [
      {
        id: 'perf-1',
        question: 'What is debouncing and how does it differ from throttling? Provide implementation examples for both.',
        answer: `Debouncing and throttling are two fundamental rate-limiting techniques used to control how frequently a function executes in response to rapid events like scrolling, typing, or resizing. While they serve a similar purpose of improving performance, they work in fundamentally different ways and are suited to different use cases.

Debouncing delays the execution of a function until a specified period of inactivity has passed. Every time the debounced function is called, it resets its internal timer. The function only executes once the timer completes without interruption. This makes debouncing ideal for scenarios where you want to wait for a user to "finish" an action before responding — such as waiting for a user to stop typing before sending a search API request, or waiting for a window resize to complete before recalculating layouts.

Throttling, on the other hand, ensures that a function executes at most once within a given time interval, regardless of how many times it is triggered. Unlike debouncing, throttle guarantees periodic execution during continuous events. This makes it ideal for scroll-based animations, infinite scroll loading, or tracking mouse position — cases where you need consistent updates at a controlled rate rather than waiting for the event stream to end.

A key distinction is in their timing guarantees. Debounce may never fire if events continue without pause (the timer keeps resetting). Throttle guarantees execution at regular intervals as long as events continue. In practice, you might use debounce for a search input (fire after the user stops typing) and throttle for a scroll handler (fire every 100ms while scrolling).

Implementation-wise, debounce uses clearTimeout/setTimeout to reset a timer on each call, while throttle uses a boolean flag or timestamp to gate execution. Both can be enhanced with options like leading/trailing edge execution. Libraries like Lodash provide production-ready implementations with these options built in.`,
        shortAnswer: 'Debouncing delays execution until events pause for a specified duration, resetting the timer on each call. Throttling limits execution to at most once per time interval. Use debounce for search inputs and form validation; use throttle for scroll handlers and resize events.',
        code: `// Debounce
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn: Function, limit: number) {
  let lastCall = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

// Debounce: fires after user stops typing
input.addEventListener('input', debounce(handleSearch, 300));

// Throttle: fires at most every 100ms while scrolling
window.addEventListener('scroll', throttle(handleScroll, 100));`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Coding',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['debouncing', 'throttling', 'rate-limiting', 'events'],
        commonMistakes: [
          'Confusing debounce and throttle — debounce waits for inactivity, throttle caps frequency',
          'Not cleaning up timers when components unmount in React',
          'Creating new debounced/throttled functions on every render instead of memoizing them',
          'Forgetting to preserve the correct `this` context in the wrapper function'
        ],
        followUps: [
          'How would you implement debounce with leading and trailing options?',
          'How do you cancel a pending debounced call?',
          'When would you combine both debounce and throttle?'
        ],
        interviewTips: [
          'Start by explaining the problem both solve: too many rapid function calls',
          'Draw a timeline showing when each technique fires during continuous events',
          'Mention real-world use cases for each to demonstrate practical understanding'
        ]
      },
      {
        id: 'perf-2',
        question: 'Explain memoization in JavaScript. How does React.memo differ from useMemo and useCallback?',
        answer: `Memoization is a performance optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again. It trades memory for speed by avoiding redundant computations. The concept originates from dynamic programming but is widely applied in frontend development to prevent unnecessary recalculations and re-renders.

In plain JavaScript, memoization typically involves wrapping a function with a caching layer. When the function is called, it first checks if the result for the given arguments already exists in the cache. If so, it returns the cached value; otherwise, it computes the result, stores it, and returns it. For functions with object arguments, using a WeakMap as the cache allows garbage collection of entries when keys are no longer referenced, preventing memory leaks.

React provides three memoization primitives, each serving a different purpose. React.memo is a higher-order component that wraps a component and prevents re-renders if its props haven't changed (using shallow comparison by default). It memoizes the render output of a component. useMemo is a hook that memoizes the result of an expensive computation within a component, recomputing only when its dependency array changes. useCallback is a specialized version of useMemo that memoizes a function reference, ensuring the same function instance is returned across renders when dependencies haven't changed.

The critical distinction is what each memoizes: React.memo memoizes component rendering, useMemo memoizes computed values, and useCallback memoizes function references. useCallback(fn, deps) is essentially equivalent to useMemo(() => fn, deps). These tools work together — for example, passing a useCallback-memoized handler to a React.memo-wrapped child prevents the child from re-rendering due to a new function reference on every parent render.

It's important to note that memoization is not free — it adds memory overhead and comparison costs. Overusing memoization can actually hurt performance if the comparison cost exceeds the cost of the work being memoized. Profile before optimizing, and apply memoization strategically to genuinely expensive operations or frequently re-rendering components.`,
        shortAnswer: 'Memoization caches function results to avoid redundant computations. React.memo prevents component re-renders when props are unchanged. useMemo caches computed values between renders. useCallback caches function references. Each memoizes a different thing: rendering, values, and functions respectively.',
        code: `// Plain memoization
function memoize<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const cache = new Map<string, R>();
  return (...args: A): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// React.memo — memoizes component render
const ExpensiveList = React.memo(({ items }: { items: string[] }) => {
  return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
});

// useMemo — memoizes computed value
function Dashboard({ data }: { data: number[] }) {
  const total = useMemo(() => data.reduce((a, b) => a + b, 0), [data]);
  return <span>{total}</span>;
}

// useCallback — memoizes function reference
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount(c => c + 1), []);
  return <MemoizedChild onClick={handleClick} />;
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['memoization', 'React.memo', 'useMemo', 'useCallback', 'caching'],
        commonMistakes: [
          'Using useMemo/useCallback everywhere without measuring — adds overhead for trivial operations',
          'Missing dependencies in the dependency array causing stale closures',
          'Expecting React.memo to do deep comparison by default — it only does shallow comparison',
          'Memoizing values that change on every render, making memoization useless'
        ],
        followUps: [
          'When should you NOT use memoization?',
          'How does React.memo custom comparator work?',
          'What is the relationship between useMemo and React Compiler?'
        ],
        interviewTips: [
          'Clearly distinguish what each React memoization tool caches',
          'Emphasize that memoization is a tradeoff between memory and computation',
          'Mention profiling tools like React DevTools Profiler to justify optimization decisions'
        ]
      },
      {
        id: 'perf-3',
        question: 'What are resource hints (preload, prefetch, preconnect, dns-prefetch) and when should you use each?',
        answer: `Resource hints are HTML directives that inform the browser about resources the page will need in the future, allowing it to prepare for them in advance. By providing these hints, developers can significantly reduce perceived load times by front-loading network operations that would otherwise happen later in the page lifecycle. There are four primary resource hints, each operating at a different level of the resource loading pipeline.

dns-prefetch is the lightest hint, instructing the browser to perform DNS resolution for a domain before resources from that domain are requested. DNS resolution typically takes 20-120ms, and pre-resolving eliminates this latency from the critical path. Use dns-prefetch for third-party domains you know you'll connect to — analytics services, CDNs, font providers, or API endpoints on different domains. It's low-cost and broadly supported.

preconnect goes a step further than dns-prefetch by completing the full connection setup: DNS resolution, TCP handshake, and TLS negotiation. This can save 100-500ms per connection. Use preconnect for critical third-party origins where you'll fetch resources soon — like your primary API domain, font CDN, or authentication service. However, limit preconnect to 2-4 origins because each connection consumes resources on both the client and server.

preload is a mandatory fetch directive that tells the browser to download a specific resource with high priority as soon as possible, even before the browser's parser encounters it. Unlike the other hints, preload is assertive — the browser will download the resource and warn in the console if it isn't used within a few seconds. Use preload for critical resources that are discovered late in the loading process, such as fonts referenced in CSS files, hero images, or critical scripts loaded dynamically.

prefetch is a low-priority hint that tells the browser to download a resource during idle time for use in future navigations. Prefetched resources are stored in the HTTP cache and used when the user navigates to the page that needs them. This is ideal for anticipating user navigation — preloading the next page's JavaScript bundle or critical data. Unlike preload, prefetch won't compete with current page resources for bandwidth.

Understanding when to use each hint is crucial. For the current page's critical resources, use preload. For the next page's resources, use prefetch. For establishing early connections to important third-party origins, use preconnect. For lower-priority third-party domains, use dns-prefetch. Used correctly, these hints can dramatically improve both actual and perceived performance.`,
        shortAnswer: 'Resource hints help the browser prepare for future resource needs. dns-prefetch resolves DNS early. preconnect completes full connection setup. preload fetches critical current-page resources immediately. prefetch loads next-page resources during idle time. Each operates at a different level of urgency.',
        code: `<!-- dns-prefetch: resolve DNS for third-party domain -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- preconnect: full connection setup (DNS + TCP + TLS) -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />

<!-- preload: fetch critical resource for current page immediately -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero-image.webp" as="image" />
<link rel="preload" href="/critical.css" as="style" />

<!-- prefetch: load resource for future navigation during idle time -->
<link rel="prefetch" href="/next-page-bundle.js" />
<link rel="prefetch" href="/api/dashboard-data" as="fetch" />

<!-- React: programmatic prefetch on hover -->
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const prefetchRoute = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = to;
    document.head.appendChild(link);
  };
  return <a href={to} onMouseEnter={prefetchRoute}>{children}</a>;
}`,
        language: 'html',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['preload', 'prefetch', 'preconnect', 'dns-prefetch', 'resource-hints'],
        commonMistakes: [
          'Overusing preload for non-critical resources, competing with critical content for bandwidth',
          'Forgetting the crossorigin attribute on preconnect for CORS resources like fonts',
          'Using preload but never consuming the resource, triggering console warnings',
          'Prefetching too many resources, wasting bandwidth on mobile connections'
        ],
        followUps: [
          'How do resource hints interact with HTTP/2 server push?',
          'What is the fetchpriority attribute and how does it complement resource hints?',
          'How would you implement route-based prefetching in a React SPA?'
        ],
        interviewTips: [
          'Organize your answer by the urgency level: dns-prefetch → preconnect → preload → prefetch',
          'Mention specific timing savings for each hint to show you understand the impact',
          'Discuss practical limits — too many preconnects or preloads can hurt rather than help'
        ]
      },
      {
        id: 'perf-4',
        question: 'Explain caching strategies for web applications. When would you use each approach?',
        answer: `Caching is one of the most impactful performance optimization strategies in web development. By storing previously computed results or fetched data, caching eliminates redundant work and reduces latency. There are multiple layers of caching available to frontend developers, each with different characteristics, lifetimes, and use cases.

Browser HTTP caching is the most fundamental layer. When a server responds with cache headers like Cache-Control and ETag, the browser stores the response and can serve it from cache on subsequent requests. Cache-Control: max-age=31536000, immutable tells the browser to cache a resource for a year without revalidation — perfect for versioned static assets (app.a1b2c3.js). For dynamic resources, Cache-Control: no-cache combined with ETag headers allows the browser to revalidate with the server using conditional requests (If-None-Match), receiving a 304 Not Modified response when the content hasn't changed. Stale-while-revalidate allows serving stale content immediately while fetching fresh content in the background.

Application-level caching involves storing data in memory within your JavaScript application. This includes caching API responses, computed values, and UI state. Libraries like React Query (TanStack Query), SWR, and Apollo Client provide sophisticated caching with features like automatic background refetching, cache invalidation, optimistic updates, and deduplication of identical requests. These libraries implement a stale-while-revalidate pattern at the application level, showing cached data immediately while refreshing in the background.

Service Worker caching provides a programmable network proxy that intercepts requests and can serve responses from a cache. Common strategies include Cache First (serve from cache, fall back to network), Network First (try network, fall back to cache), and Stale While Revalidate (serve from cache immediately, update cache from network in background). Service workers enable offline functionality and can dramatically improve performance for repeat visitors. The Cache API used by service workers persists across sessions, unlike in-memory application caches.

Client-side storage APIs like localStorage, sessionStorage, and IndexedDB provide persistent key-value storage. localStorage is synchronous and limited to ~5MB, suitable for small pieces of data like user preferences or tokens. IndexedDB is asynchronous, supports larger datasets, and can store structured data including blobs. These are useful for caching data that should survive page refreshes but isn't suited for fine-grained HTTP caching.

Choosing the right caching strategy depends on the data characteristics. For static assets that change only on deploy, use long-lived HTTP cache with content hashing. For API data that changes moderately, use application-level caching with stale-while-revalidate. For offline-first features, use service worker caching. For user-specific settings, use localStorage or IndexedDB. Often, a layered approach combining multiple strategies provides the best overall performance.`,
        shortAnswer: 'Web caching operates at multiple layers: HTTP caching (Cache-Control, ETags), application-level caching (React Query, SWR), service worker caching (Cache API with strategies like Cache First or Network First), and client storage (localStorage, IndexedDB). Choose based on data volatility, offline needs, and persistence requirements.',
        code: `// HTTP Cache headers (server-side configuration)
// Immutable static assets: cache forever with content hash
// Cache-Control: public, max-age=31536000, immutable

// Dynamic API responses: revalidate on each request
// Cache-Control: no-cache
// ETag: "abc123"

// Application-level caching with React Query
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,       // data considered fresh for 5 min
    gcTime: 30 * 60 * 1000,          // cache kept for 30 min
  });

  if (isLoading) return <Skeleton />;
  return <div>{data.name}</div>;
}

// Service Worker: stale-while-revalidate strategy
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.open('api-cache').then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then((response) => {
        cache.put(event.request, response.clone());
        return response;
      });
      return cached || fetchPromise;
    })
  );
});`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['caching', 'HTTP-cache', 'service-worker', 'React-Query', 'stale-while-revalidate'],
        commonMistakes: [
          'Setting long cache-control max-age without content hashing, causing users to get stale files',
          'Not implementing cache invalidation, serving permanently outdated data',
          'Using localStorage for large or frequently changing data instead of IndexedDB',
          'Caching authenticated/personalized responses in shared caches'
        ],
        followUps: [
          'How do you invalidate cache when data changes?',
          'What is the difference between no-cache and no-store?',
          'How does React Query handle cache invalidation and background refetching?'
        ],
        interviewTips: [
          'Organize by cache layers: HTTP → application → service worker → client storage',
          'For each layer, explain what it caches, how long it persists, and when to use it',
          'Mention cache invalidation as the hard problem — show you understand the tradeoffs'
        ]
      },
      {
        id: 'perf-5',
        question: 'How does virtualization (windowing) work and when should you use it? Compare react-window and react-virtuoso.',
        answer: `Virtualization, also known as windowing, is a rendering optimization technique that only renders the visible portion of a large list or grid, plus a small overscan buffer. Instead of creating DOM nodes for every item in a dataset, virtualized lists calculate which items are currently in the viewport based on scroll position and only render those items. This dramatically reduces the number of DOM nodes, memory consumption, and initial render time.

The core mechanism works by maintaining a container element with the total scrollable height calculated from the number of items and their sizes. As the user scrolls, the library recalculates which items should be visible based on the scroll offset, renders only those items, and positions them absolutely within the container using CSS transforms or top/left offsets. Items that scroll out of view are unmounted and recycled. This creates the illusion of a fully rendered list while only maintaining a small window of actual DOM nodes — typically 10-30 items regardless of the total dataset size.

react-window (by Brian Vaughn, the creator of the original react-virtualized) is a lightweight library focused on simplicity and performance. It provides FixedSizeList, VariableSizeList, FixedSizeGrid, and VariableSizeGrid components. Its API is minimal and it requires you to know or estimate item sizes upfront. For variable-size items, you must provide a function that returns the height for each index. react-window has a smaller bundle size (~6KB gzipped) and is very fast but requires more manual work for complex scenarios like dynamic sizing or reverse scrolling.

react-virtuoso is a more feature-rich alternative that handles many complex scenarios out of the box. It supports automatic item measurement (no need to know sizes upfront), grouped lists, table virtualization, reverse infinite scrolling (chat-like interfaces), sticky headers, and responsive items that change size. It uses a more sophisticated measurement and positioning engine. The tradeoff is a larger bundle size (~15KB gzipped) and slightly more overhead, though for most applications this is negligible. react-virtuoso is generally the better choice when items have dynamic or unknown heights.

You should use virtualization when rendering lists with hundreds or thousands of items. Signs you need it include: slow initial render of long lists, janky scrolling, high memory usage with large datasets, or when you see thousands of DOM nodes in the elements panel. However, don't virtualize everything — for lists under 100-200 items with simple DOM structures, the overhead of virtualization may not be worth the complexity. Always measure actual performance before adding virtualization.`,
        shortAnswer: 'Virtualization renders only visible items in a list/grid plus a small buffer, dramatically reducing DOM nodes and memory. react-window is lightweight and fast but requires known item sizes. react-virtuoso handles dynamic sizing automatically and supports complex scenarios like grouped lists and reverse scrolling.',
        code: `// react-window: Fixed size list
import { FixedSizeList } from 'react-window';

function VirtualList({ items }: { items: string[] }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}

// react-virtuoso: Dynamic size list with auto-measurement
import { Virtuoso } from 'react-virtuoso';

function DynamicVirtualList({ items }: { items: Message[] }) {
  return (
    <Virtuoso
      data={items}
      itemContent={(index, item) => (
        <div className="message-card">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      )}
      overscan={200}
      followOutput="smooth" // auto-scroll for chat-like UIs
    />
  );
}`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['virtualization', 'windowing', 'react-window', 'react-virtuoso', 'large-lists'],
        commonMistakes: [
          'Virtualizing small lists where the overhead exceeds the benefit',
          'Not accounting for dynamic item heights with react-window, causing layout jumps',
          'Forgetting to set a fixed height on the container element',
          'Not handling keyboard navigation and accessibility in virtualized lists'
        ],
        followUps: [
          'How would you implement infinite scroll with virtualization?',
          'What accessibility challenges arise with virtualized lists?',
          'How do you handle search/filter with virtualized lists?'
        ],
        interviewTips: [
          'Explain the core mechanism: calculate visible range, render only those items, position with transforms',
          'Discuss when NOT to virtualize — it adds complexity and accessibility challenges',
          'Mention the bundle size and feature tradeoffs between libraries'
        ]
      },
      {
        id: 'perf-6',
        question: 'What is React rendering optimization? Explain how to prevent unnecessary re-renders.',
        answer: `React rendering optimization focuses on minimizing the work React does during its reconciliation process. Every time state or props change, React re-renders the component and its entire subtree by default, running the render function to produce a new virtual DOM tree, then diffing it against the previous tree to determine the minimal set of DOM updates. While React's diffing algorithm is efficient, unnecessary re-renders — where the output hasn't actually changed — waste CPU cycles and can cause perceptible lag in complex applications.

The first line of defense is proper state management architecture. State should be placed as close to where it's used as possible (colocation). When state is lifted too high in the component tree, every state change causes the parent and all its children to re-render, even if most children don't use that state. Splitting a large component into smaller ones with their own local state naturally limits the blast radius of re-renders. Using state management libraries like Zustand with selectors allows components to subscribe to only the specific pieces of state they need, preventing re-renders when unrelated state changes.

React.memo is the primary tool for preventing re-renders of child components. It wraps a component and skips re-rendering if props haven't changed (shallow comparison). However, React.memo is only effective if the props are actually stable between renders. This is where useMemo and useCallback become important — useMemo stabilizes computed values and useCallback stabilizes function references. Without these, new objects, arrays, or functions created during the parent's render will defeat React.memo's shallow comparison.

Context is a common source of unnecessary re-renders. When a context value changes, every consumer of that context re-renders, even if they only use a portion of the context that hasn't changed. To mitigate this, split contexts by update frequency (separate static config from frequently changing state), memoize context values, or use libraries like use-context-selector that allow subscribing to specific parts of a context. Another approach is to pass children as props (composition pattern), which avoids re-rendering children when the parent's state changes because the children were created by the grandparent and haven't changed.

React's newer features and the React Compiler (formerly React Forget) aim to make manual memoization unnecessary by automatically memoizing at the compiler level. Until these are widely adopted, developers should use React DevTools Profiler to identify actual performance bottlenecks before applying optimizations. The Profiler's "Why did this render?" feature and highlight updates option help pinpoint which re-renders are wasteful and their root causes.`,
        shortAnswer: 'React re-renders components and their subtrees when state or props change. Prevent unnecessary re-renders by colocating state, using React.memo with stable props (via useMemo and useCallback), splitting contexts, using composition patterns, and profiling with React DevTools before optimizing.',
        code: `// State colocation: keep state close to where it's used
function SearchPage() {
  return (
    <div>
      <SearchInput />     {/* Manages its own search state */}
      <ExpensiveChart />  {/* Won't re-render when search state changes */}
    </div>
  );
}

// React.memo + useCallback: prevent child re-renders
const TodoItem = React.memo(({ todo, onToggle }: {
  todo: Todo;
  onToggle: (id: string) => void;
}) => {
  return (
    <li onClick={() => onToggle(todo.id)}>
      {todo.text}
    </li>
  );
});

function TodoList({ todos }: { todos: Todo[] }) {
  const handleToggle = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', id });
  }, []);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </ul>
  );
}

// Composition pattern: children don't re-render with parent state
function ScrollTracker({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div>
      <ScrollIndicator position={scrollY} />
      {children} {/* children are stable — not re-created */}
    </div>
  );
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['React', 're-renders', 'React.memo', 'useCallback', 'useMemo', 'optimization'],
        commonMistakes: [
          'Wrapping everything in React.memo without measuring actual performance impact',
          'Creating new objects or arrays inline as props, defeating memoization',
          'Using a single large context for all application state',
          'Optimizing based on assumptions rather than profiler measurements'
        ],
        followUps: [
          'How does the React Compiler automate memoization?',
          'What is the composition pattern and how does it prevent re-renders?',
          'How do you use React DevTools Profiler to identify unnecessary re-renders?'
        ],
        interviewTips: [
          'Start with architecture-level solutions (state colocation, composition) before reaching for React.memo',
          'Show you understand the cost of memoization — it\'s not free',
          'Mention profiling as the first step before any optimization'
        ]
      },
      {
        id: 'perf-7',
        question: 'Explain image optimization techniques for web applications.',
        answer: `Image optimization is one of the most impactful performance improvements for web applications because images typically account for 50-75% of total page weight. A comprehensive image optimization strategy addresses format selection, sizing, compression, loading behavior, and delivery to ensure images load as fast as possible while maintaining acceptable visual quality.

Modern image formats offer significantly better compression than traditional JPEG and PNG. WebP, developed by Google, provides 25-35% smaller file sizes than JPEG at equivalent quality and supports transparency (replacing PNG for photos with alpha channels). AVIF, based on the AV1 video codec, provides even better compression — 50% smaller than JPEG — with excellent quality, but has slower encoding times and slightly less browser support. SVG remains the best choice for icons, logos, and simple illustrations as it's resolution-independent and typically tiny in file size. The strategy is to serve AVIF to browsers that support it, WebP as a fallback, and JPEG/PNG as the final fallback, using the HTML picture element or Accept header-based content negotiation.

Responsive images ensure that devices download only the resolution they need. A 4K hero image served to a mobile phone on a 3G connection wastes massive bandwidth. The srcset attribute with width descriptors lets the browser choose the appropriate image size based on viewport width and device pixel ratio. The sizes attribute tells the browser how wide the image will be displayed at different viewport widths, enabling accurate selection before CSS is parsed. For art direction — showing different crops at different breakpoints — use the picture element with media queries.

Lazy loading defers image downloads until they're about to enter the viewport. The native loading="lazy" attribute provides this with zero JavaScript, using the browser's intersection observer internally. For more control, libraries like react-intersection-observer or custom IntersectionObserver implementations allow customizing the root margin (how far in advance to start loading) and providing loading placeholders. Combined with blur-up placeholders or dominant color backgrounds, lazy loading maintains visual stability while dramatically reducing initial page load time.

Beyond individual image optimization, delivery infrastructure matters enormously. Serving images from a CDN reduces latency by delivering from edge nodes close to the user. Image CDNs like Cloudinary, imgix, or Vercel's Image Optimization can transform, resize, and compress images on the fly, eliminating the need to pre-generate multiple sizes. The width and quality parameters in the CDN URL allow serving exactly the right image for each context. Combining CDN delivery with aggressive cache headers (immutable with content hashes) ensures images are downloaded only once per version.`,
        shortAnswer: 'Image optimization includes using modern formats (WebP, AVIF), responsive images with srcset/sizes, lazy loading with loading="lazy" or IntersectionObserver, proper compression, and CDN delivery. Images often account for 50-75% of page weight, making optimization critical for performance.',
        code: `<!-- Modern format with fallbacks using picture element -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero banner" width="1200" height="600" />
</picture>

<!-- Responsive images with srcset and sizes -->
<img
  srcset="photo-400.webp 400w,
          photo-800.webp 800w,
          photo-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  src="photo-800.webp"
  alt="Product photo"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>

<!-- React: optimized image component -->
function OptimizedImage({ src, alt, width, height }: {
  src: string; alt: string; width: number; height: number;
}) {
  const avif = src.replace(/\\.(jpg|png)$/, '.avif');
  const webp = src.replace(/\\.(jpg|png)$/, '.webp');

  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: \`\${width}/\${height}\` }}
      />
    </picture>
  );
}`,
        language: 'html',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['images', 'WebP', 'AVIF', 'lazy-loading', 'responsive-images', 'srcset'],
        commonMistakes: [
          'Not setting width and height attributes, causing layout shifts (CLS)',
          'Serving desktop-sized images to mobile devices',
          'Using PNG for photographic images instead of WebP/AVIF',
          'Lazy loading above-the-fold images that should load eagerly'
        ],
        followUps: [
          'How does Next.js Image component optimize images automatically?',
          'What is the impact of images on Core Web Vitals (LCP, CLS)?',
          'How would you implement blur-up placeholder loading?'
        ],
        interviewTips: [
          'Quantify the impact: images are 50-75% of page weight, format changes can save 25-50%',
          'Cover the full pipeline: format → sizing → compression → loading → delivery',
          'Mention Core Web Vitals (LCP, CLS) to show you understand the metrics that matter'
        ]
      },
      {
        id: 'perf-8',
        question: 'What is prefetching and preloading data in React applications? How do libraries like React Query handle this?',
        answer: `Prefetching and preloading data in React applications are strategies for loading data before the user explicitly requests it, reducing or eliminating loading states during navigation and interaction. While they share the goal of faster perceived performance, they differ in timing and urgency. Preloading fetches data that will definitely be needed soon (for the current view), while prefetching fetches data that might be needed in the future (for anticipated navigation).

Preloading is typically used to fetch data in parallel with code loading or before a component mounts. In React Router, loader functions allow data fetching to begin as soon as a route is matched, rather than waiting for the component to render and then trigger a fetch (the waterfall problem). This means by the time the component mounts, the data is already available. React's Suspense and use hook further support this by allowing you to start a fetch outside the component and pass the promise in, with the component suspending until data is ready.

Prefetching anticipates what the user will need next and loads it proactively during idle time. Common triggers include hovering over a link (the user is likely to click), focusing an element with keyboard navigation, or even just rendering a link that's visible on screen. The data is stored in cache so that when the user does navigate, the response is immediate. This creates the perception of instant navigation, which dramatically improves user experience.

React Query (TanStack Query) provides first-class support for both patterns through its queryClient.prefetchQuery method. When called, it fetches data and populates the cache using the same query key system used by useQuery hooks. When a component later calls useQuery with the same key, it finds the data already in cache and renders immediately. Prefetching respects staleTime — if the cached data is still fresh, the prefetch is a no-op. You can integrate this with router events, hover handlers, or IntersectionObserver to prefetch at the right moment.

SWR provides similar capabilities through its preload function and mutate with pre-populated data. Apollo Client supports prefetching through client.query with a fetchPolicy of 'cache-first'. The key insight across all these libraries is that they decouple data fetching from component rendering. Data can be fetched anywhere — in event handlers, route loaders, or background effects — and components simply subscribe to the cache. This separation enables sophisticated preloading and prefetching strategies without coupling data timing to component lifecycle.`,
        shortAnswer: 'Preloading fetches data for the current view in parallel with code loading. Prefetching loads data for anticipated future navigation during idle time. React Query handles both via queryClient.prefetchQuery, populating cache so subsequent useQuery calls render instantly without loading states.',
        code: `// React Query: prefetch on hover
import { useQueryClient } from '@tanstack/react-query';

function ProjectLink({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  const prefetchProject = () => {
    queryClient.prefetchQuery({
      queryKey: ['project', projectId],
      queryFn: () => fetchProject(projectId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link
      to={\`/projects/\${projectId}\`}
      onMouseEnter={prefetchProject}
      onFocus={prefetchProject}
    >
      View Project
    </Link>
  );
}

// React Router loader: preload data during navigation
const router = createBrowserRouter([
  {
    path: '/projects/:id',
    loader: async ({ params }) => {
      return queryClient.ensureQueryData({
        queryKey: ['project', params.id],
        queryFn: () => fetchProject(params.id!),
      });
    },
    element: <ProjectPage />,
  },
]);

// Component uses cached data — no loading state
function ProjectPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
  });
  return <h1>{data.name}</h1>;
}`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Coding',
        category: 'Performance',
        topicId: 'performance-optimization-techniques',
        tags: ['prefetching', 'preloading', 'React-Query', 'data-loading', 'caching'],
        commonMistakes: [
          'Prefetching too aggressively, wasting bandwidth on data the user never needs',
          'Not setting appropriate staleTime, causing prefetched data to refetch immediately',
          'Creating waterfalls by fetching data only after components mount instead of in route loaders',
          'Forgetting to prefetch on focus events, excluding keyboard navigation users'
        ],
        followUps: [
          'How do you decide which data to prefetch vs. fetch on demand?',
          'What is the waterfall problem and how do route loaders solve it?',
          'How does React Suspense work with data prefetching?'
        ],
        interviewTips: [
          'Distinguish between preloading (current page) and prefetching (future navigation)',
          'Show how cache-based libraries make prefetching elegant: prefetch populates cache, useQuery reads it',
          'Discuss the UX improvement: eliminate loading spinners during navigation'
        ]
      }
    ]
  },
  {
    id: 'bundle-optimization',
    title: 'Bundle Optimization & Loading Strategies',
    description: 'Advanced techniques for reducing bundle size and optimizing resource loading including code splitting, lazy loading, tree shaking, and bundle analysis.',
    category: 'Performance',
    difficulty: 'Advanced',
    tags: ['code-splitting', 'lazy-loading', 'tree-shaking', 'bundle-size', 'webpack', 'dynamic-import'],
    overview: 'Bundle optimization is critical for fast-loading web applications. Large JavaScript bundles delay page interactivity because the browser must download, parse, and execute all code before the application becomes responsive. Code splitting, tree shaking, and lazy loading work together to ensure users only download the code they need, when they need it.',
    concepts: [
      'Code splitting divides the bundle into smaller chunks loaded on demand',
      'Lazy loading defers component loading until needed',
      'Tree shaking removes unused code during bundling',
      'Dynamic imports create split points for async chunk loading',
      'Bundle analysis visualizes what contributes to bundle size',
      'Compression (gzip, Brotli) reduces transfer size'
    ],
    codeExamples: [
      {
        title: 'React Lazy Loading with Suspense',
        code: `import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
        language: 'typescript',
        explanation: 'React.lazy with Suspense enables route-based code splitting, loading each page bundle only when navigated to.'
      },
      {
        title: 'Tree Shaking with Named Exports',
        code: `// utils.ts — use named exports for tree shaking
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD'
  }).format(amount);
}

// Consumer — only formatDate is included in the bundle
import { formatDate } from './utils';`,
        language: 'typescript',
        explanation: 'Named exports allow bundlers to statically analyze which functions are used and eliminate unused ones (tree shaking).'
      }
    ],
    relatedTopicIds: ['performance-optimization-techniques'],
    questions: [
      {
        id: 'perf-9',
        question: 'What is code splitting and how does React.lazy work with Suspense for route-based splitting?',
        answer: `Code splitting is the practice of dividing a JavaScript application into smaller bundles (chunks) that are loaded on demand rather than as a single monolithic bundle. Without code splitting, the browser must download, parse, and execute the entire application's JavaScript before the page becomes interactive — even code for routes the user hasn't visited or features they haven't used. By splitting the code, you dramatically reduce the initial bundle size and improve Time to Interactive.

The primary mechanism for code splitting is the dynamic import() syntax, which is part of the ECMAScript standard. Unlike static imports that are resolved at build time and bundled together, dynamic imports return a Promise that resolves to the module. Bundlers like webpack and Vite recognize dynamic imports as split points, creating separate chunks for the imported modules. These chunks are loaded over the network when the import() call executes at runtime.

React.lazy is React's built-in API for lazy-loading components using dynamic imports. It takes a function that calls import() and returns a Promise resolving to a module with a default export containing a React component. React.lazy integrates with React's Suspense mechanism — when a lazy component is being loaded, React suspends rendering and shows the nearest Suspense fallback. Once the chunk is downloaded and the component is ready, React replaces the fallback with the actual component.

Route-based code splitting is the most common and impactful application of this pattern. Since users only visit one route at a time, splitting each route into its own chunk ensures the initial bundle only contains the landing page code. Subsequent route navigations trigger chunk downloads for those pages. Combined with prefetching (loading route chunks on link hover), this creates near-instant navigation after the initial load. In a typical application, route-based splitting alone can reduce the initial bundle by 40-70%.

Beyond route-based splitting, you can split on component level (heavy modals, charts, rich text editors), on feature flags (only load premium features for premium users), or on interaction (load a heavy library only when the user clicks a button). The key is to identify the split points that give the most benefit — large code that isn't needed immediately. Bundle analyzers like webpack-bundle-analyzer help identify these opportunities.`,
        shortAnswer: 'Code splitting divides the app into smaller chunks loaded on demand. React.lazy enables lazy-loading components via dynamic import(). Suspense shows a fallback while the chunk loads. Route-based splitting is the most impactful pattern, loading each page\'s code only when navigated to.',
        code: `// Route-based code splitting
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Feature-based splitting: load heavy component on demand
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

function PostForm() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <button onClick={() => setShowEditor(true)}>Write Post</button>
      {showEditor && (
        <Suspense fallback={<EditorSkeleton />}>
          <RichTextEditor />
        </Suspense>
      )}
    </div>
  );
}

// Named export splitting (requires wrapper)
const UserChart = lazy(() =>
  import('./components/Charts').then(module => ({
    default: module.UserChart,
  }))
);`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'bundle-optimization',
        tags: ['code-splitting', 'React.lazy', 'Suspense', 'dynamic-import', 'chunks'],
        commonMistakes: [
          'Not wrapping lazy components in Suspense, causing runtime errors',
          'Splitting too granularly, creating too many small chunks with request overhead',
          'Not providing meaningful loading fallbacks, causing layout shifts',
          'Forgetting to handle import errors with error boundaries'
        ],
        followUps: [
          'How do you handle loading errors with lazy components?',
          'What is the difference between React.lazy and loadable-components?',
          'How would you prefetch lazy chunks on link hover?'
        ],
        interviewTips: [
          'Explain that code splitting addresses initial load time, not total code size',
          'Mention that route-based splitting is the highest-impact, lowest-effort optimization',
          'Discuss error handling — wrap Suspense with an error boundary for network failures'
        ]
      },
      {
        id: 'perf-10',
        question: 'Explain tree shaking. Why are ES modules important for it and what prevents tree shaking?',
        answer: `Tree shaking is a dead code elimination technique used by modern bundlers (webpack, Rollup, esbuild, Vite) to remove unused exports from JavaScript modules during the build process. The term comes from the mental model of "shaking the dependency tree" to let dead leaves (unused code) fall off. When you import only one function from a utility library, tree shaking ensures only that function and its dependencies end up in the final bundle, not the entire library.

ES modules (import/export syntax) are essential for tree shaking because they are statically analyzable. The import and export declarations must appear at the top level of a module and cannot be conditional or dynamic (import() is a separate feature). This means the bundler can determine at build time exactly which exports from each module are used by which consumers, without executing any code. It can then safely eliminate exports that no consumer imports. CommonJS modules (require/module.exports) cannot be tree-shaken effectively because require() calls can be dynamic, conditional, and computed at runtime, making static analysis impossible.

Several patterns prevent effective tree shaking. Side effects in modules — code that executes when a module is imported, modifying global state, adding event listeners, or polyfilling APIs — force the bundler to include the entire module even if no exports are used. The sideEffects field in package.json allows library authors to declare which files have side effects, enabling the bundler to safely skip side-effect-free modules. Barrel files (index.ts that re-exports from many files) can hinder tree shaking in some bundler configurations because importing from the barrel pulls in all re-exports before the bundler can determine which are unused.

Class declarations can also resist tree shaking because methods on a class are harder to analyze as used or unused — the bundler often has to include the entire class. Similarly, assignments to objects (like creating a utility object with many methods) prevent tree shaking because property access is dynamic. This is why functional utility libraries with individual named exports tree-shake better than OOP-style libraries. Default exports are also less friendly to tree shaking than named exports because the entire default export is a single unit.

To maximize tree shaking in your application: use named exports over default exports, avoid side effects in module scope, use the sideEffects field in package.json, import directly from sub-paths when barrel files cause issues (import from 'lodash-es/debounce' instead of 'lodash-es'), avoid mutating global state at module scope, and use a bundler analyzer to verify unused code is actually being eliminated.`,
        shortAnswer: 'Tree shaking removes unused exports during bundling. ES modules are required because their static import/export syntax allows compile-time analysis. Common blockers include side effects, CommonJS modules, barrel files, class declarations, and default exports. The sideEffects field in package.json helps bundlers skip side-effect-free modules.',
        code: `// GOOD: Named exports enable tree shaking
// math.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }
export function multiply(a: number, b: number) { return a * b; }

// consumer.ts — only 'add' is included in bundle
import { add } from './math';

// BAD: Object pattern prevents tree shaking
const MathUtils = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
};
export default MathUtils;
// Importing MathUtils.add includes subtract and multiply too

// BAD: Side effect prevents elimination
// analytics.ts
console.log('Analytics module loaded'); // side effect!
export function trackEvent(name: string) { /* ... */ }

// package.json — declare side-effect-free files
{
  "sideEffects": false
  // or specify files with side effects:
  // "sideEffects": ["./src/polyfills.ts", "*.css"]
}

// Direct imports for better tree shaking
import debounce from 'lodash-es/debounce'; // only debounce
// vs
import { debounce } from 'lodash-es'; // may pull in more`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'bundle-optimization',
        tags: ['tree-shaking', 'ES-modules', 'dead-code-elimination', 'sideEffects', 'bundling'],
        commonMistakes: [
          'Using CommonJS (require) which cannot be tree-shaken',
          'Not setting sideEffects in package.json for library code',
          'Importing from barrel files when direct imports would tree-shake better',
          'Adding side effects (console.log, global mutations) at module scope'
        ],
        followUps: [
          'How do you verify tree shaking is working in your bundle?',
          'What is the difference between tree shaking and dead code elimination?',
          'How do barrel files affect tree shaking and what are alternatives?'
        ],
        interviewTips: [
          'Explain why ES modules matter: static analysis requires static syntax',
          'Give concrete examples of what blocks tree shaking — side effects, CommonJS, object patterns',
          'Mention the sideEffects field in package.json as a key enabler for library tree shaking'
        ]
      },
      {
        id: 'perf-11',
        question: 'How do you analyze and reduce JavaScript bundle size?',
        answer: `Bundle analysis is the systematic process of understanding what code contributes to your application's JavaScript bundles, identifying optimization opportunities, and implementing reductions. It's a critical practice because JavaScript is the most expensive resource on the web — every kilobyte must be downloaded, parsed, compiled, and executed, with the parsing and execution phases being particularly costly on mobile devices.

The first step is visualization. Tools like webpack-bundle-analyzer generate interactive treemap visualizations showing every module in your bundles, their sizes (parsed and gzipped), and which chunks they belong to. For Vite projects, rollup-plugin-visualizer provides similar functionality. source-map-explorer analyzes source maps to show a more accurate picture of what code ends up in the final bundles. These tools immediately reveal surprising contributors — you might discover a date library adding 70KB, a full icon library loaded for 3 icons, or duplicate copies of the same package at different versions.

After identifying large contributors, apply targeted strategies. Replace heavy libraries with lighter alternatives: dayjs (2KB) instead of moment.js (70KB), just (individual functions) instead of lodash (72KB full). Use tree-shaking-friendly imports: import specific components from UI libraries instead of importing the entire library. Eliminate duplicate dependencies using npm dedupe or resolutions/overrides in package.json to force a single version. Move development-only dependencies out of the production bundle by checking import patterns and using conditional dynamic imports.

Code splitting is your primary tool for reducing what loads initially. Route-based splitting with React.lazy ensures each page's code loads independently. Feature-based splitting defers heavy features (rich text editors, chart libraries, PDF viewers) until needed. Vendor splitting separates third-party code (which changes infrequently) from application code (which changes often), enabling better caching — users re-download only the changed chunks after deployments.

Set up automated bundle budgets in your CI/CD pipeline to prevent regression. Tools like bundlesize, size-limit, or webpack's performance hints can fail the build if bundle size exceeds a threshold. This is crucial because bundle size tends to grow silently — individual additions seem small but compound over time. Track key metrics: initial JavaScript size (should be under 200KB gzipped for good performance), largest chunk size, and total number of chunks. Regular audits using Lighthouse, Chrome DevTools Coverage panel (showing unused code), and bundle analyzers keep bundles lean over time.`,
        shortAnswer: 'Analyze bundles with webpack-bundle-analyzer or source-map-explorer to visualize what contributes to size. Reduce by replacing heavy libraries with lighter ones, tree shaking, code splitting, deduplicating dependencies, and setting CI bundle budgets. Target under 200KB gzipped initial JavaScript.',
        code: `// webpack-bundle-analyzer setup
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
};

// package.json — size-limit for CI bundle budgets
{
  "size-limit": [
    { "path": "dist/index.js", "limit": "150 kB" },
    { "path": "dist/vendor.js", "limit": "100 kB" }
  ],
  "scripts": {
    "size": "size-limit",
    "size:report": "size-limit --json"
  }
}

// Replace heavy libraries with lighter alternatives
// Before: import moment from 'moment'; // 72KB
// After:
import dayjs from 'dayjs'; // 2KB

// Before: import _ from 'lodash'; // 72KB
// After:
import groupBy from 'lodash-es/groupBy'; // ~1KB

// Conditional dynamic import for dev-only tools
if (process.env.NODE_ENV === 'development') {
  import('./devtools').then(({ initDevTools }) => {
    initDevTools();
  });
}`,
        language: 'typescript',
        difficulty: 'Advanced',
        type: 'Scenario',
        category: 'Performance',
        topicId: 'bundle-optimization',
        tags: ['bundle-analysis', 'bundle-size', 'webpack', 'optimization', 'CI'],
        commonMistakes: [
          'Optimizing without measuring — always visualize the bundle first',
          'Not setting up CI bundle budgets, allowing gradual size regression',
          'Focusing only on gzipped size while ignoring parse/execution time',
          'Adding polyfills globally instead of per-feature when needed'
        ],
        followUps: [
          'What is the Chrome Coverage panel and how do you use it?',
          'How do you handle duplicate dependencies in node_modules?',
          'What are bundle budgets and how do you enforce them in CI?'
        ],
        interviewTips: [
          'Show a systematic approach: measure → identify → optimize → prevent regression',
          'Mention specific tools and real-world numbers (moment → dayjs saves 70KB)',
          'Discuss the CI/CD angle — bundle budgets prevent regression over time'
        ]
      },
      {
        id: 'perf-12',
        question: 'What is lazy loading in web development? Compare different lazy loading strategies for components, images, and data.',
        answer: `Lazy loading is a design pattern that defers the initialization or loading of a resource until it is actually needed. In web development, this applies to components, images, data, scripts, and any heavy resource that isn't required for the initial render. The core principle is to load the minimum necessary for the current view and progressively load additional resources as the user interacts with the application.

Component lazy loading uses dynamic imports and React.lazy (or equivalent framework features) to defer downloading JavaScript code for components until they are about to render. Route-based lazy loading is the most common pattern, where each page route is a separate chunk. Feature-based lazy loading defers heavy components like modals, charts, rich text editors, or complex forms until the user triggers them. The chunk is downloaded over the network when the component is first needed, and subsequent uses serve it from the browser's module cache.

Image lazy loading defers downloading images until they are about to enter the viewport. The simplest implementation uses the native loading="lazy" attribute on img tags, which is supported in all modern browsers. For more sophisticated control — custom thresholds, fade-in animations, placeholder strategies, or priority management — you can use the IntersectionObserver API. The observer watches elements and triggers a callback when they enter or approach the viewport, at which point you swap the data-src attribute to src to initiate the download. Image lazy loading is particularly impactful on image-heavy pages like e-commerce catalogs or media galleries.

Data lazy loading (or deferred data fetching) avoids loading data until a component that needs it is rendered or a user action requires it. This includes pagination (loading one page of results at a time), infinite scrolling (loading the next batch when the user scrolls near the bottom), and on-demand loading (fetching details when a user expands an accordion or opens a modal). Libraries like React Query support this through enabled/disabled queries — a query can be defined but only activated when a condition is met, preventing unnecessary network requests.

The tradeoff with lazy loading is the delay when the resource is finally needed. Users may see loading spinners or content shifts. Mitigate this with skeleton screens, blur-up placeholders, prefetching on hover/focus, and preloading critical resources. The best lazy loading strategies are invisible to users — they reduce initial load time without introducing perceptible delays during interaction.`,
        shortAnswer: 'Lazy loading defers resource loading until needed. Components use React.lazy/dynamic imports for code splitting. Images use loading="lazy" or IntersectionObserver. Data uses conditional fetching, pagination, and infinite scroll. Combine with prefetching and skeleton screens to eliminate perceived delays.',
        code: `// Component lazy loading with prefetch on hover
const Settings = lazy(() => import('./pages/Settings'));

function NavLink() {
  const prefetch = () => { import('./pages/Settings'); };
  return (
    <Link to="/settings" onMouseEnter={prefetch}>
      Settings
    </Link>
  );
}

// Image lazy loading with IntersectionObserver
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={loaded ? 'fade-in' : 'placeholder'}
    />
  );
}

// Data lazy loading with React Query
function UserDetails({ userId }: { userId: string }) {
  const [expanded, setExpanded] = useState(false);

  const { data } = useQuery({
    queryKey: ['userDetails', userId],
    queryFn: () => fetchUserDetails(userId),
    enabled: expanded, // only fetch when expanded
  });

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Show'} Details
      </button>
      {expanded && data && <DetailPanel data={data} />}
    </div>
  );
}`,
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'Performance',
        topicId: 'bundle-optimization',
        tags: ['lazy-loading', 'code-splitting', 'IntersectionObserver', 'dynamic-import'],
        commonMistakes: [
          'Lazy loading above-the-fold content, making the initial render slower',
          'Not providing placeholders, causing layout shifts when content loads',
          'Lazy loading too aggressively, adding loading delays to common interactions',
          'Not handling loading errors — network failures need retry logic and error boundaries'
        ],
        followUps: [
          'How do you implement infinite scroll with proper lazy loading?',
          'What is the priority hierarchy for loading resources on a page?',
          'How do you lazy load third-party scripts without blocking the main thread?'
        ],
        interviewTips: [
          'Cover all three dimensions: code, images, and data lazy loading',
          'Emphasize that lazy loading is a UX technique, not just a performance technique',
          'Discuss how to mitigate the downside (loading delays) with prefetching and placeholders'
        ]
      }
    ]
  }
];
