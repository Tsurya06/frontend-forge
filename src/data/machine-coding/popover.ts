import type { MachineCodingProblem } from "../../types";

export const popoverProblem: MachineCodingProblem = {
  id: "mc-popover",
  title: "Popover Component",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "react",
    "positioning",
    "outside-click",
    "portal",
    "tooltip",
    "floating-ui",
  ],

  problemStatement: `Build a Popover component in React that displays floating content anchored to a trigger element. The popover should support multiple placement options (top, bottom, left, right) and automatically reposition itself when it would overflow the viewport. This tests understanding of DOM measurement, dynamic positioning, and event handling.

The popover must close when the user clicks outside of it, presses Escape, or when the trigger element loses focus. It should handle edge cases like window resizing, scrolling containers, and viewport boundary detection. The component should be composable and work with any trigger element, not just buttons.`,

  functionalRequirements: [
    "Show/hide popover content on trigger click or hover",
    "Support placement options: top, bottom, left, right (with auto-flip)",
    "Close on outside click",
    "Close on Escape key press",
    "Auto-reposition when overflowing viewport boundaries",
    "Support custom offset/spacing from the trigger",
    "Work with any trigger element via render prop or ref forwarding",
  ],

  nonFunctionalRequirements: [
    "Use React Portal to avoid overflow: hidden clipping",
    "Position calculation using getBoundingClientRect",
    "Accessible: proper ARIA attributes for expanded/collapsed state",
    "Clean event listener management to prevent memory leaks",
  ],

  componentHierarchy: `Popover
├── Trigger (wrapped child element)
└── PopoverContent (Portal)
    ├── Arrow (optional)
    └── {children}`,

  stateDesign: `// State shape
interface PopoverState {
  isOpen: boolean;
  position: { top: number; left: number };
  actualPlacement: Placement;  // may differ from requested if flipped
}

// The trigger element's ref is used to calculate position.
// On open, getBoundingClientRect measures the trigger, and the
// popover's position is computed relative to the viewport.
// If the popover would overflow, placement flips to the opposite side.`,

  architecture: `The Popover component consists of a trigger wrapper and a portal-rendered floating content panel. When the popover opens, a positioning function reads the trigger element's bounding rect and the popover's dimensions, then calculates the optimal position based on the requested placement. If the popover would overflow the viewport, it flips to the opposite side.

Outside click detection is handled by a document-level mousedown listener that checks if the event target is within the popover or trigger elements using \`contains()\`. The Escape key listener is added to the document when the popover is open. A ResizeObserver and scroll listeners trigger repositioning when the layout changes. All listeners are cleaned up when the popover closes or unmounts.`,

  implementation: `import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
  content: React.ReactNode;
  placement?: Placement;
  offset?: number;
  trigger?: 'click' | 'hover';
  children: React.ReactElement;
}

function computePosition(
  triggerRect: DOMRect,
  popoverEl: HTMLElement,
  placement: Placement,
  offset: number
): { top: number; left: number; flipped: Placement } {
  const popRect = popoverEl.getBoundingClientRect();
  let top = 0, left = 0;
  let flipped = placement;

  const positions: Record<Placement, () => void> = {
    top: () => { top = triggerRect.top - popRect.height - offset; left = triggerRect.left + (triggerRect.width - popRect.width) / 2; },
    bottom: () => { top = triggerRect.bottom + offset; left = triggerRect.left + (triggerRect.width - popRect.width) / 2; },
    left: () => { top = triggerRect.top + (triggerRect.height - popRect.height) / 2; left = triggerRect.left - popRect.width - offset; },
    right: () => { top = triggerRect.top + (triggerRect.height - popRect.height) / 2; left = triggerRect.right + offset; },
  };

  positions[placement]();

  if (top < 0 && placement === 'top') { flipped = 'bottom'; positions.bottom(); }
  else if (top + popRect.height > window.innerHeight && placement === 'bottom') { flipped = 'top'; positions.top(); }
  else if (left < 0 && placement === 'left') { flipped = 'right'; positions.right(); }
  else if (left + popRect.width > window.innerWidth && placement === 'right') { flipped = 'left'; positions.left(); }

  left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - popRect.height - 8));

  return { top: top + window.scrollY, left: left + window.scrollX, flipped };
}

export default function Popover({
  content,
  placement = 'bottom',
  offset = 8,
  trigger = 'click',
  children,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const result = computePosition(triggerRect, popoverRef.current, placement, offset);
    setPos({ top: result.top, left: result.left });
  }, [placement, offset]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const triggerProps: Record<string, unknown> = { ref: triggerRef };
  if (trigger === 'click') {
    triggerProps.onClick = () => setIsOpen((o) => !o);
    triggerProps['aria-expanded'] = isOpen;
    triggerProps['aria-haspopup'] = true;
  } else {
    triggerProps.onMouseEnter = () => setIsOpen(true);
    triggerProps.onMouseLeave = () => setIsOpen(false);
    triggerProps.onFocus = () => setIsOpen(true);
    triggerProps.onBlur = () => setIsOpen(false);
  }

  return (
    <>
      {React.cloneElement(children, triggerProps)}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            role="tooltip"
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              padding: '12px 16px',
              maxWidth: 320,
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}`,

  accessibility: `The trigger element receives \`aria-expanded\` and \`aria-haspopup\` attributes to communicate the popover's state to screen readers. The popover content uses \`role="tooltip"\` (or \`role="dialog"\` for interactive popovers). Focus management allows keyboard users to dismiss the popover with Escape. When used in hover mode, \`onFocus\` and \`onBlur\` handlers ensure keyboard users can also trigger the popover. The popover content should be reachable via Tab when it contains interactive elements.`,

  performance: `Position calculation uses \`getBoundingClientRect()\` which triggers a layout read but is efficient for single-element measurement. Scroll and resize listeners use passive event handling where possible. The popover renders nothing when closed, avoiding unnecessary DOM nodes. Position updates are batched through React state, preventing multiple reflows. For high-frequency scroll events, a \`requestAnimationFrame\` throttle could be added, but the simple approach works well for most use cases.`,

  edgeCases: [
    "Trigger element near viewport edge requires flip/shift positioning",
    "Scrolling container clips the popover if not using a portal",
    "Multiple popovers open simultaneously should not interfere",
    "Window resize while popover is open should reposition correctly",
    "Popover with interactive content must remain open when clicking inside it",
  ],

  testingStrategy: [
    "Unit test: popover opens on trigger click and closes on second click",
    "Unit test: outside click closes the popover",
    "Unit test: Escape key closes the popover",
    "Integration test: popover repositions when near viewport edge",
    "Integration test: scroll events trigger repositioning",
    "Accessibility: verify aria-expanded toggles correctly",
  ],

  improvements: [
    "Add arrow/caret indicator pointing to the trigger element",
    "Support all 12 placements (top-start, top-end, etc.)",
    "Add configurable enter/exit animations",
    "Implement nested popover support with context-based management",
  ],

  followUpQuestions: [
    "How does Floating UI / Popper.js solve the positioning problem?",
    "What is the difference between a tooltip, popover, and dropdown?",
    "How would you handle a popover inside a scrollable container without a portal?",
    "How would you implement a popover that stays open when hovering over its content?",
  ],
};
