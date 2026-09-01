import type { MachineCodingProblem } from "../../types";

export const resizableSplitPaneProblem: MachineCodingProblem = {
  id: "mc-resizable-split",
  title: "Resizable Split Pane",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "split-pane",
    "resize",
    "drag",
    "pointer-events",
    "min-max",
    "responsive",
    "layout",
  ],
  problemStatement: `Build a Resizable Split Pane component in React consisting of two panels separated by a draggable divider. Users can click and drag the divider to resize the panels. The component must enforce minimum and maximum width constraints so neither panel becomes too small or too large.

The divider should change cursor to indicate it's draggable. During drag, the panels resize in real-time based on mouse position. Pointer events on the panels' content should be disabled during drag to prevent unintended interactions (like text selection or iframe interference). The component should handle window resizing and recalculate proportions.

This problem tests pointer event handling, refs for DOM measurements, CSS layout techniques, and performance considerations for high-frequency events like mousemove.`,
  functionalRequirements: [
    "Two panels (left and right) side by side with a draggable divider between them",
    "Drag the divider to resize panels — left panel grows/shrinks, right panel adjusts inversely",
    "Enforce minimum width on both panels (e.g., 100px)",
    "Enforce maximum width (neither panel exceeds container width minus min of the other)",
    "Divider cursor changes to col-resize on hover and during drag",
    "Content inside panels is not selectable during drag",
    "Double-click the divider to reset to 50/50 split",
  ],
  nonFunctionalRequirements: [
    "Smooth real-time resizing without jank (use requestAnimationFrame or direct style mutation)",
    'Accessible: divider has role="separator" with aria-valuenow for split percentage',
    "Keyboard support: arrow keys on focused divider move it left/right by step increments",
    "Responsive: panels stack vertically on narrow viewports",
  ],
  componentHierarchy: `SplitPane
├── LeftPanel
│   └── {children or content}
├── Divider (draggable separator)
└── RightPanel
    └── {children or content}`,
  stateDesign: `interface SplitPaneProps {
  minSize?: number;     // min panel width in px, default 100
  initialSplit?: number; // 0-1, default 0.5
  left: React.ReactNode;
  right: React.ReactNode;
}

const [splitRatio, setSplitRatio] = useState(initialSplit);
const [isDragging, setIsDragging] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);
const dividerWidth = 6; // px`,
  architecture: `The SplitPane renders a flex container with two panels and a divider. The left panel's width is computed as splitRatio * (containerWidth - dividerWidth). On mousedown on the divider, a pointerdown handler begins the drag. Global pointermove updates the split ratio based on pointer position relative to the container's left edge. Pointerup ends the drag. Using pointer events (instead of mouse events) provides better compatibility with touch devices.

During drag, pointer-events: none is applied to both panels to prevent iframes or text selection from interfering. The divider uses setPointerCapture to reliably receive all move events even if the cursor leaves the element. Keyboard support listens for ArrowLeft/Right on the divider, adjusting the ratio by a step amount.`,
  implementation: `import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SplitPaneProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  minSize?: number;
  initialSplit?: number;
}

const DIVIDER_WIDTH = 6;

export default function SplitPane({
  left,
  right,
  minSize = 100,
  initialSplit = 0.5,
}: SplitPaneProps) {
  const [splitRatio, setSplitRatio] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampRatio = useCallback(
    (ratio: number): number => {
      if (!containerRef.current) return ratio;
      const containerWidth = containerRef.current.getBoundingClientRect().width - DIVIDER_WIDTH;
      const minRatio = minSize / containerWidth;
      const maxRatio = 1 - minRatio;
      return Math.min(maxRatio, Math.max(minRatio, ratio));
    },
    [minSize]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const containerWidth = rect.width - DIVIDER_WIDTH;
      const newRatio = clampRatio(x / containerWidth);
      setSplitRatio(newRatio);
    },
    [isDragging, clampRatio]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setIsDragging(false);
    },
    []
  );

  const handleDoubleClick = useCallback(() => {
    setSplitRatio(clampRatio(0.5));
  }, [clampRatio]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 0.02;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSplitRatio((prev) => clampRatio(prev - step));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSplitRatio((prev) => clampRatio(prev + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSplitRatio(clampRatio(0));
      } else if (e.key === 'End') {
        e.preventDefault();
        setSplitRatio(clampRatio(1));
      }
    },
    [clampRatio]
  );

  useEffect(() => {
    const handleResize = () => {
      setSplitRatio((prev) => clampRatio(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampRatio]);

  const percentage = Math.round(splitRatio * 100);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex', width: '100%', height: 400, border: '1px solid #e2e8f0',
        borderRadius: 8, overflow: 'hidden', userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          flex: \`0 0 calc(\${splitRatio * 100}% - \${DIVIDER_WIDTH / 2}px)\`,
          overflow: 'auto',
          pointerEvents: isDragging ? 'none' : 'auto',
          background: '#f8fafc',
        }}
      >
        {left ?? (
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px' }}>Left Panel</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              This panel takes {percentage}% of the width. Drag the divider to resize.
            </p>
          </div>
        )}
      </div>

      <div
        role="separator"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Resize panels"
        aria-orientation="vertical"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        style={{
          flex: \`0 0 \${DIVIDER_WIDTH}px\`,
          background: isDragging ? '#3b82f6' : '#cbd5e1',
          cursor: 'col-resize',
          transition: isDragging ? 'none' : 'background 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 2, height: 24, borderRadius: 1,
            background: isDragging ? '#fff' : '#94a3b8',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          pointerEvents: isDragging ? 'none' : 'auto',
          background: '#fff',
        }}
      >
        {right ?? (
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px' }}>Right Panel</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              This panel takes {100 - percentage}% of the width.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}`,
  accessibility: `The divider has role="separator" with aria-valuenow, aria-valuemin, aria-valuemax, and aria-orientation for screen readers. It's focusable (tabIndex={0}) and responds to ArrowLeft/Right to resize via keyboard. Home/End keys jump to minimum/maximum positions. The aria-label describes the action. During drag, user-select is disabled to prevent text selection interference.`,
  performance: `Pointer events fire at high frequency during drag. Using state updates is acceptable for this component because React batches state updates. For extremely complex panel content, consider using refs to mutate styles directly and only syncing state on pointerup. setPointerCapture ensures events are captured even if the cursor leaves the divider, preventing stuck-drag states. Window resize events re-clamp the ratio to prevent overflow.`,
  edgeCases: [
    "Container is narrower than 2× minSize — both panels are at minimum, divider at center",
    "Dragging beyond container bounds — clamped by minSize constraints",
    "Window resize shrinks container — ratio is re-clamped to valid range",
    "Double-click to reset when already at 50/50 — no-op, still works",
    "Content in panels includes iframes — pointer-events: none during drag prevents iframe capturing mouse",
    "Very fast drag movements — setPointerCapture prevents losing the drag",
    "Touch devices — pointer events work natively on touch",
  ],
  testingStrategy: [
    "Unit test: clampRatio enforces min/max bounds correctly",
    "Integration test: pointerdown + pointermove + pointerup resizes panels",
    "Integration test: double-click resets to 50/50 split",
    "Integration test: ArrowLeft/Right adjusts split ratio by step",
    "Integration test: panels enforce minimum width constraint",
    "Integration test: pointer-events on panels are disabled during drag",
    "Accessibility test: divider has correct ARIA attributes and keyboard support",
  ],
  improvements: [
    "Support vertical split (top/bottom) in addition to horizontal",
    "Persist split ratio in localStorage per component instance",
    "Support collapsible panels (click arrow to fully collapse one side)",
    "Add multi-pane support (3+ panels with multiple dividers)",
    "Add snap points (e.g., snap to 25%, 50%, 75%) during drag",
  ],
  followUpQuestions: [
    "How would you implement a vertical (top/bottom) split pane with the same component?",
    "What are the advantages of pointer events over mouse events for this use case?",
    "How would you handle nested split panes (split within a split)?",
    "How would you optimize for panels containing heavy content like code editors?",
  ],
};
