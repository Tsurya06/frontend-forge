import type { MachineCodingProblem } from '../../types';

export const dragDropProblem: MachineCodingProblem = {
  id: 'mc-drag-drop',
  title: 'Drag and Drop Reordering',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['drag-and-drop', 'reorder', 'HTML5-DnD', 'accessibility', 'keyboard', 'state-update'],
  problemStatement: `Build a drag-and-drop reorderable list in React using the HTML5 Drag and Drop API. Users should be able to pick up a list item, drag it to a new position, and drop it to reorder the list. The dragged item should have a visual ghost preview, and the drop target should show a visual indicator of where the item will be placed.

The component must handle the full lifecycle of a drag operation: dragstart (set data, style dragged item), dragover (prevent default, show drop indicator), drop (reorder array), and dragend (cleanup). State should be updated immutably, moving the item from its original index to the target index.

In addition, discuss how you would add keyboard-accessible reordering for users who cannot use a mouse, using arrow keys with a modifier (e.g., Alt+Arrow) to move items.`,
  functionalRequirements: [
    'Drag a list item by clicking and holding on it',
    'Visual feedback: dragged item becomes semi-transparent, drop target shows insertion line',
    'Drop the item at a new position to reorder the list',
    'State updates immutably to reflect the new order',
    'Support reordering in both directions (up and down)',
    'Reset visual state on dragend (including cancelled drags)',
    'Handle edge cases: dropping on self, dropping outside the list',
  ],
  nonFunctionalRequirements: [
    'Keyboard reordering support (Alt+ArrowUp/Down) discussed and optionally implemented',
    'Smooth visual transitions for list reordering',
    'Works on touch devices (discuss touch event alternatives)',
    'Items maintain stable identity (key) across reorders',
  ],
  componentHierarchy: `DragDropList
└── DraggableItem (per item)
    ├── DragHandle (grip icon)
    ├── ItemContent
    └── DropIndicator (line above or below)`,
  stateDesign: `interface ListItem {
  id: string;
  label: string;
}

const [items, setItems] = useState<ListItem[]>(initialItems);
const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
const [overIdx, setOverIdx] = useState<number | null>(null);

// Reorder helper
function reorder<T>(list: T[], fromIdx: number, toIdx: number): T[] {
  const result = [...list];
  const [removed] = result.splice(fromIdx, 1);
  result.splice(toIdx, 0, removed);
  return result;
}`,
  architecture: `The DragDropList renders an ordered list where each item has draggable="true". On dragstart, the dragged item's index is stored in state and in dataTransfer. During dragover, the component calculates which item the cursor is over and stores that index for visual feedback. On drop, the items array is reordered using splice. On dragend, all drag state is cleared.

For keyboard accessibility, a focused item listens for Alt+ArrowUp/Down, which calls the same reorder function and moves focus to the item's new position. This provides equivalent functionality without drag-and-drop.`,
  implementation: `import React, { useState, useCallback, useRef } from 'react';

interface ListItem {
  id: string;
  label: string;
}

const initialItems: ListItem[] = [
  { id: '1', label: 'Learn React fundamentals' },
  { id: '2', label: 'Build a drag-and-drop list' },
  { id: '3', label: 'Style with CSS-in-JS' },
  { id: '4', label: 'Write unit tests' },
  { id: '5', label: 'Deploy to production' },
  { id: '6', label: 'Monitor performance' },
  { id: '7', label: 'Iterate on feedback' },
];

function reorder<T>(list: T[], from: number, to: number): T[] {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

export default function DragDropList() {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedIdx !== null && idx !== draggedIdx) {
        setOverIdx(idx);
      }
    },
    [draggedIdx]
  );

  const handleDragLeave = useCallback(() => {
    setOverIdx(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, toIdx: number) => {
      e.preventDefault();
      if (draggedIdx !== null && draggedIdx !== toIdx) {
        setItems((prev) => reorder(prev, draggedIdx, toIdx));
      }
      setDraggedIdx(null);
      setOverIdx(null);
    },
    [draggedIdx]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedIdx(null);
    setOverIdx(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        setItems((prev) => reorder(prev, idx, idx - 1));
        requestAnimationFrame(() => itemRefs.current[idx - 1]?.focus());
      } else if (e.key === 'ArrowDown' && idx < items.length - 1) {
        e.preventDefault();
        setItems((prev) => reorder(prev, idx, idx + 1));
        requestAnimationFrame(() => itemRefs.current[idx + 1]?.focus());
      }
    },
    [items.length]
  );

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2 style={{ margin: '0 0 4px' }}>Reorderable List</h2>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px' }}>
        Drag items to reorder, or use Alt + ↑/↓ with keyboard.
      </p>

      <ul
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
        role="listbox"
        aria-label="Reorderable list"
      >
        {items.map((item, idx) => {
          const isDragged = draggedIdx === idx;
          const isOver = overIdx === idx;

          return (
            <li
              key={item.id}
              ref={(el) => { itemRefs.current[idx] = el; }}
              role="option"
              aria-selected={isDragged}
              aria-roledescription="sortable item"
              tabIndex={0}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                marginBottom: 4,
                background: isDragged ? '#dbeafe' : '#fff',
                border: '1px solid',
                borderColor: isOver ? '#3b82f6' : '#e2e8f0',
                borderRadius: 6,
                cursor: 'grab',
                transition: 'border-color 0.15s, background 0.15s',
                borderTopWidth: isOver && draggedIdx !== null && draggedIdx > idx ? 3 : 1,
                borderBottomWidth: isOver && draggedIdx !== null && draggedIdx < idx ? 3 : 1,
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1, userSelect: 'none' }}
              >
                ⠿
              </span>
              <span style={{ flex: 1, fontSize: 14, color: '#1e293b' }}>{item.label}</span>
              <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 20, textAlign: 'right' }}>
                {idx + 1}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        aria-live="polite"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        {draggedIdx !== null && overIdx !== null && (
          <span>Moving item {draggedIdx + 1} to position {overIdx + 1}</span>
        )}
      </div>
    </div>
  );
}`,
  accessibility: `Each item has role="option" within a role="listbox" and aria-roledescription="sortable item" to communicate its purpose. Keyboard reordering uses Alt+Arrow keys, moving focus to the item's new position after reorder. A visually hidden aria-live region announces the reorder action to screen readers. The drag handle icon has aria-hidden="true" since it's decorative. All items are focusable with tabIndex={0}.`,
  performance: `The reorder function creates a new array via splice, which is O(n) but fine for typical list sizes. React reconciliation uses stable keys (item.id) so only moved items re-render. requestAnimationFrame is used for focus management after state update to ensure the DOM has updated. For very large lists (100+), consider virtualizing the list or using a more efficient reorder algorithm with React.memo on items.`,
  edgeCases: [
    'Dropping an item on itself — no-op, state unchanged',
    'Dragging outside the list and releasing — dragend fires and resets state',
    'Rapidly dragging between items — overIdx updates correctly per dragover',
    'Touch devices — HTML5 DnD has limited touch support; discuss using touch events or a polyfill',
    'Empty list — should still render the container with appropriate empty state',
    'Single item list — drag should be a no-op since there is nowhere to reorder',
  ],
  testingStrategy: [
    'Unit test: reorder function correctly moves items between indices',
    'Unit test: reorder handles edge cases (first to last, last to first)',
    'Integration test: simulate drag events and verify DOM order changes',
    'Integration test: Alt+ArrowDown moves item down and shifts focus',
    'Integration test: Alt+ArrowUp at index 0 is a no-op',
    'Accessibility test: aria-live region announces during drag operations',
  ],
  improvements: [
    'Add smooth CSS transitions (transform) for items shifting position during drag',
    'Support multi-select drag (hold Shift to select multiple, drag together)',
    'Add touch event support with a longpress gesture to initiate drag',
    'Implement drag between multiple lists (Kanban-style)',
    'Persist order to localStorage or API on drop',
  ],
  followUpQuestions: [
    'How would you implement drag-and-drop between multiple lists (Kanban board)?',
    'What are the limitations of the HTML5 Drag and Drop API vs pointer events?',
    'How would you add animated transitions when items shift position?',
    'How would you make this work reliably on mobile touch devices?',
  ],
};
