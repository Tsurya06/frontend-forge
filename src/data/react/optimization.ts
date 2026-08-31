import type { Topic } from '../../types';

export const optimizationTopics: Topic[] = [
  {
    id: 'react-optimization',
    title: 'React Performance Optimization, Memoization & Virtualization',
    description:
      'Mastering React performance: avoiding unnecessary re-renders, React.memo, useMemo, useCallback, list virtualization (@tanstack/react-virtual), bundle splitting with React.lazy, and React DevTools Profiler.',
    category: 'React',
    difficulty: 'Advanced',
    tags: ['react', 'performance', 'optimization', 'react-memo', 'useMemo', 'useCallback', 'virtualization', 'profiler'],
    overview:
      'React is fast by default, but complex applications with high-frequency updates, large lists, or deep component trees can suffer from redundant rendering cycles, heavy JavaScript execution, and large bundle payloads. Optimizing React involves eliminating wasted renders, stabilizing references, virtualizing large datasets, and code splitting.',
    concepts: [
      'Why React re-renders: State changes, Prop changes, Parent re-renders, Context value updates',
      'The cost of re-rendering: Virtual DOM execution vs DOM mutations',
      '`React.memo`: shallow comparison of props and custom arePropsEqual comparators',
      '`useMemo` and `useCallback`: reference stability for objects/functions passed to memoized children',
      'When NOT to use useMemo / useCallback (overhead vs benefit)',
      'List Virtualization / Windowing: rendering only visible items in the viewport (TanStack Virtual, react-window)',
      'Code splitting and dynamic imports with `React.lazy` and `<Suspense>`',
      'React Profiler API and DevTools flamegraphs to identify render bottlenecks',
    ],
    relatedTopicIds: ['react-components', 'react-custom-hooks', 'react-vdom-reconciliation'],
    questions: [
      {
        id: 'react-perf-1',
        question: 'When does a React component re-render, and how do React.memo, useMemo, and useCallback work together to prevent wasted re-renders?',
        answer:
          '**Why Components Re-render:**\nBy default in React, **when a parent component re-renders, ALL of its child components re-render recursively**, regardless of whether their props have changed.\n\n**How the Memoization Trio Works Together:**\n1. **`React.memo(Component)`**: Wraps a component to prevent re-rendering if its props have not changed (performs shallow equality comparison `prevProps === nextProps`).\n2. **`useCallback(fn, deps)`**: Returns a memoized reference to a function instance. If you pass an inline arrow function `onClick={() => ...}` to a `React.memo` child, the child will re-render anyway because a new function reference is created on every parent render. `useCallback` preserves the same function reference across renders.\n3. **`useMemo(() => compute(a, b), [a, b])`**: Caches the result of an expensive calculation and preserves object reference stability (`style={{ ... }}`, `config={{ ... }}`) passed to `React.memo` children.\n\n**Crucial Rule**: `useCallback` and `useMemo` on their own do NOT stop child components from re-rendering unless the child component is wrapped in `React.memo` or used in a dependency array.',
        shortAnswer:
          'Parents re-render children by default. `React.memo` skips child renders if props haven\'t changed; `useCallback` and `useMemo` preserve reference stability for callbacks and objects so `React.memo`\'s shallow comparison succeeds.',
        code: `import React, { useState, useCallback, useMemo } from 'react';

interface ItemProps {
  item: { id: string; name: string };
  onSelect: (id: string) => void;
}

// 1. Child is wrapped in React.memo (performs shallow prop comparison)
const ListItem = React.memo(function ListItem({ item, onSelect }: ItemProps) {
  console.log('Rendering ListItem:', item.name);
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});

export function ItemList({ items }: { items: { id: string; name: string }[] }) {
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 2. useCallback ensures onSelect function reference stays stable
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Counter: {count}</button>
      <ul>
        {items.map(item => (
          <ListItem key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </div>
  );
}`,
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-optimization',
        tags: ['react-memo', 'useMemo', 'useCallback', 're-renders', 'memoization'],
        commonMistakes: [
          'Wrapping callbacks in useCallback without wrapping the child component in React.memo (wasting memory without preventing re-renders).',
          'Prematurely wrapping trivial computations in useMemo where the hook overhead exceeds the computation cost.',
        ],
        followUps: ['How does React Compiler (React Forget) automate memoization at build time?'],
        interviewTips: ['Emphasize that `React.memo` requires stable prop references (via useCallback/useMemo) to function effectively.']
      },
      {
        id: 'react-perf-2',
        question: 'What is DOM Virtualization (Windowing) and how does it allow rendering lists with 100,000+ items smoothly at 60 FPS?',
        answer:
          '**The Problem with Large Lists**:\nRendering 10,000+ DOM nodes creates significant memory pressure, long layout/paint times, and slow scrolling because the browser has to track and paint thousands of off-screen DOM elements.\n\n**How Virtualization Works**:\nVirtualization (windowing) renders **only the small subset of items currently visible within the scrollable viewport container** (plus a small overscan buffer above and below).\n\n**Core Mechanics**:\n1. A scrollable viewport container with `overflow-y: auto` and a fixed height (e.g. 500px).\n2. An inner container whose height is set to `totalItems * itemHeight` (e.g. 100,000 * 50px = 5,000,000px), giving the browser a realistic scrollbar.\n3. The virtualizer calculates `startIndex = Math.floor(scrollTop / itemHeight)` and `endIndex = Math.min(total, startIndex + visibleCount + overscan)`.\n4. Only the 15-20 visible items are rendered into the DOM, positioned absolutely using `transform: translateY(index * itemHeight)`. As the user scrolls, items leaving the top are removed from the DOM and new items entering the bottom are inserted, keeping DOM node count constant at ~20 nodes.',
        shortAnswer:
          'Virtualization only renders items currently visible inside the viewport window (~20 DOM nodes) while simulating the full scroll height. This keeps memory constant and scrolling silky smooth regardless of list length.',
        code: `import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // 40px estimated row height
    overscan: 5,           // render 5 extra items above/below viewport
  });

  return (
    <div
      ref={parentRef}
      style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc' }}
    >
      <div
        style={{
          height: \`\${rowVirtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: \`\${virtualItem.size}px\`,
              transform: \`translateY(\${virtualItem.start}px)\`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-optimization',
        tags: ['virtualization', 'windowing', 'tanstack-virtual', 'scroll-performance', 'dom-optimization'],
        commonMistakes: [
          'Using top instead of transform: translateY() to position virtual rows (triggers layout reflows on scroll).',
          'Not handling dynamic variable row heights with element measurement observers.',
        ],
        followUps: ['How do you handle variable-height items in virtualized lists using ResizeObserver?'],
        interviewTips: ['Explain the math: Total height spacer + translateY offset for visible slice.']
      }
    ]
  }
];
