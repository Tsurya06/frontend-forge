import type { Topic } from '../../types';

export const vdomTopics: Topic[] = [
  {
    id: 'react-vdom-reconciliation',
    title: 'Virtual DOM, Reconciliation, Fiber Architecture & Synthetic Events',
    description:
      'Deep dive into the React Virtual DOM, diffing heuristics, the Fiber architecture (work loop, time slicing, priority lanes), and SyntheticEvent delegation.',
    category: 'React',
    difficulty: 'Advanced',
    tags: ['react', 'virtual-dom', 'reconciliation', 'fiber', 'synthetic-events', 'concurrent-mode'],
    overview:
      'React achieves high performance and predictable UI updates through its Virtual DOM abstraction and the Fiber reconciliation engine. Fiber replaced the synchronous stack reconciler with an asynchronous, priority-based cooperative work loop that enables Concurrent React, Transitions, and Suspense.',
    concepts: [
      'Virtual DOM: lightweight in-memory tree representation of real DOM',
      'The Reconciliation diffing heuristics ($O(N)$ algorithm vs theoretical $O(N^3)$): element type matching and key identity',
      'Why array indexes as keys cause state corruption during reordering/deletions',
      'The Fiber Reconciler: units of work, double buffering (current vs workInProgress), fibers linked list tree (child, sibling, return)',
      'Render Phase (interruptible, asynchronous) vs Commit Phase (synchronous DOM mutations)',
      'Fiber Priority Lanes and Concurrent Features (useTransition, useDeferredValue)',
      'SyntheticEvent system: cross-browser normalization, event delegation at root container (React 17+ vs document level in React 16)',
    ],
    relatedTopicIds: ['react-intro', 'react-components'],
    questions: [
      {
        id: 'react-vdom-1',
        question: 'How does React\'s Reconciliation diffing algorithm work, and what are its two core heuristics?',
        answer:
          'A general algorithm for finding the minimal edits between two trees has a theoretical complexity of $O(N^3)$. React implements an $O(N)$ heuristic diffing algorithm based on two key assumptions:\n\n1. **Two elements of different types will produce different trees**:\n   - If the element tag changes (e.g. `<div>` becomes `<span>`, or `<Header>` becomes `<Footer>`), React does not attempt to diff children. It completely tears down and unmounts the old tree and mounts the new tree from scratch.\n   - If the element type is the same, React preserves the DOM node and only updates the modified attributes/props.\n\n2. **The developer can hint which child elements are stable across renders using the `key` prop**:\n   - When diffing children lists, React uses keys to match children in the original tree with children in the new tree.\n   - With keys, inserting an item at the beginning of a list is an $O(1)$ reordering operation rather than tearing down and mutating every child in the list.',
        shortAnswer:
          'React uses an O(N) heuristic diffing algorithm based on 2 rules: (1) Different element types produce completely different trees (unmounts old, mounts new); (2) Elements with unique `key` props are preserved and reordered efficiently across renders.',
        code: `// Key issue demonstration:
// \u274C Bad: Index as key causes state bleed on deletion
{items.map((item, index) => (
  <TodoItem key={index} text={item.text} />
))}

// \u2705 Good: Stable unique ID preserves local state and DOM integrity
{items.map((item) => (
  <TodoItem key={item.id} text={item.text} />
))}`,
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-vdom-reconciliation',
        tags: ['reconciliation', 'diffing', 'virtual-dom', 'keys', 'algorithm'],
        commonMistakes: [
          'Using Math.random() as a key, forcing React to destroy and re-create the DOM node on every single render.',
          'Using array index as key when items can be filtered, sorted, inserted, or removed.',
        ],
        followUps: ['Why does an index as key cause input fields or state to retain old values when an item is deleted?'],
        interviewTips: ['Mention the $O(N^3)$ theoretical tree diff vs React\'s $O(N)$ heuristic constraint.']
      },
      {
        id: 'react-vdom-2',
        question: 'What is the React Fiber architecture and how does it enable Concurrent React features (like useTransition)?',
        answer:
          'Before React 16, React used a synchronous **Stack Reconciler**. Once rendering started, it could not be paused or interrupted until the entire component tree finished rendering, causing frame drops and unresponsive user input on large trees.\n\n**React Fiber** is a complete rewrite of the reconciliation engine based on a custom call stack:\n1. **Fiber as a Unit of Work**: Each React element is represented by a `Fiber` node containing pointers: `child` (first child), `sibling` (next sibling), and `return` (parent). This forms a singly linked list tree that can be traversed iteratively without recursion.\n2. **Double Buffering**: Fiber maintains two trees in memory: the `current` tree (visible on screen) and the `workInProgress` tree (being computed off-screen). Once work finishes, React swaps pointers in a single commit.\n3. **Render Phase (Interruptible)**: Work is scheduled via a work loop. React can pause rendering if a high-priority user interaction arrives (like typing), yield back to the browser to paint a frame, and resume background rendering.\n4. **Commit Phase (Synchronous)**: Once the entire tree is prepared, React performs all real DOM mutations synchronously so users never see an incomplete or flickering UI.',
        shortAnswer:
          'Fiber turns rendering into an asynchronous, interruptible linked-list work loop. It enables Concurrent React by allowing low-priority renders (transitions) to be paused for high-priority user inputs (typing), utilizing double-buffered current and workInProgress trees.',
        code: `import React, { useState, useTransition } from 'react';

export function SearchFilter({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 1. High priority: update input text immediately
    setQuery(e.target.value);

    // 2. Low priority (Transition): defer heavy list re-render so typing stays smooth
    startTransition(() => {
      setFilterQuery(e.target.value);
    });
  }

  const filtered = items.filter(i => i.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Type rapidly..." />
      {isPending && <span>Filtering in background...</span>}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-vdom-reconciliation',
        tags: ['fiber', 'concurrent-mode', 'useTransition', 'work-loop', 'reconciler'],
        commonMistakes: [
          'Confusing the interruptible Render phase with the synchronous Commit phase.',
          'Thinking useTransition debounces; useTransition executes immediately in the background with lower priority scheduling rather than a timer delay.',
        ],
        followUps: ['How does React 17+ SyntheticEvent delegation at the root container differ from React 16 delegation at document level?'],
        interviewTips: ['Explaining the child-sibling-return linked list data structure shows extraordinary depth.']
      },
      {
        id: 'react-vdom-3',
        question: 'How do React Synthetic Events work, and what changed in event delegation in React 17?',
        answer:
          '**SyntheticEvent** is React\'s cross-browser wrapper around the native browser event. It normalizes event properties and behaviors across different browsers and implements unified event pooling (prior to React 17) and delegation.\n\n**Event Delegation Mechanism:**\n- React does not attach event listeners to individual DOM nodes (e.g. `<button onClick={...}>`).\n- Instead, React attaches a single event listener per event type at a top-level container and uses event bubbling to catch events and dispatch them to the corresponding React component tree.\n\n**What Changed in React 17:**\n- In React 16 and earlier, all synthetic events were attached to the **`document`** object (`document.addEventListener`). This caused issues when nesting multiple React root applications or micro-frontends on the same page, as `e.stopPropagation()` in a nested app wouldn\'t stop events from bubbling to the outer document.\n- In **React 17+**, event listeners are attached directly to the **root DOM container** (`rootNode` where `createRoot(rootNode)` is called).',
        shortAnswer:
          'SyntheticEvent normalizes cross-browser events. In React 17+, event delegation attaches to the root DOM container (root node) rather than the global document, fixing micro-frontend event propagation collisions.',
        code: `// React 17+ delegates to root container, not document
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

// e.nativeEvent gives access to the underlying browser event
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log('React Synthetic Event:', e.type);
  console.log('Native Browser Event:', e.nativeEvent);
  e.stopPropagation(); // Stops propagation in React tree AND at root container level
}`,
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-vdom-reconciliation',
        tags: ['synthetic-events', 'event-delegation', 'react-17', 'native-events'],
        commonMistakes: [
          'Thinking stopPropagation on nativeEvent stops React event handlers (React dispatches synthetic events at root).',
        ],
        followUps: ['How do Synthetic Events interact with third-party vanilla JS event listeners?'],
        interviewTips: ['Mention the React 17 change from document delegation to root container delegation for micro-frontends.']
      }
    ]
  }
];
