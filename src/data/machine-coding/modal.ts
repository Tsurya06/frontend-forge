import type { MachineCodingProblem } from '../../types';

export const modalProblem: MachineCodingProblem = {
  id: 'mc-modal',
  title: 'Modal / Dialog Component',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'portal', 'accessibility', 'focus-trap', 'overlay', 'keyboard'],

  problemStatement: `Build a reusable Modal (dialog) component in React that renders an overlay with centered content. The modal must support closing via the Escape key, clicking the overlay backdrop, or an explicit close button. This is a fundamental UI pattern and a very common frontend interview question that tests your knowledge of portals, focus management, and accessibility.

The modal should trap focus within itself when open, preventing users from tabbing to elements behind the overlay. When the modal closes, focus should return to the element that triggered it. The body scroll should be locked while the modal is open to prevent background scrolling. The component must work correctly with screen readers, using proper ARIA attributes and roles.`,

  functionalRequirements: [
    'Open and close the modal programmatically via props',
    'Close on Escape key press',
    'Close on overlay/backdrop click',
    'Render modal content via children prop',
    'Trap focus inside the modal when open',
    'Restore focus to trigger element on close',
    'Lock body scroll when modal is open',
    'Support custom header, body, and footer sections',
  ],

  nonFunctionalRequirements: [
    'Use React Portal to render outside the component tree',
    'Accessible: role="dialog", aria-modal, aria-labelledby',
    'Smooth open/close animations with CSS transitions',
    'No external dependencies',
  ],

  componentHierarchy: `Modal (Portal)
├── Overlay (backdrop)
└── ModalContainer
    ├── ModalHeader
    │   ├── Title
    │   └── CloseButton
    ├── ModalBody
    │   └── {children}
    └── ModalFooter (optional)
        └── Action Buttons`,

  stateDesign: `// State shape
interface ModalState {
  isOpen: boolean;           // controls visibility
  isAnimating: boolean;      // tracks enter/exit animation
}

// The parent controls isOpen. Internally, isAnimating delays
// unmounting until the exit animation completes.
// A ref stores the previously focused element for focus restoration.

// Usage:
// const [isOpen, setIsOpen] = useState(false);
// <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>...</Modal>`,

  architecture: `The Modal uses \`ReactDOM.createPortal\` to render into a dedicated DOM node (typically document.body or a #modal-root div), ensuring it sits above all other content in the stacking context. The overlay is a full-screen fixed-position div that captures backdrop clicks.

Focus management is handled by capturing the first and last focusable elements inside the modal on mount, then intercepting Tab key presses to loop focus between them. A ref stores \`document.activeElement\` before the modal opens, and focus is restored to that element when the modal unmounts. Body scroll locking is achieved by setting \`overflow: hidden\` on the document body and restoring it on cleanup. The component uses \`useEffect\` for all side effects and cleans up properly to avoid memory leaks.`,

  implementation: `import React, { useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  width?: string;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true,
  closeOnEscape = true,
  width = '500px',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.focus(), 0);
    }
    return () => {
      document.body.style.overflow = '';
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = getFocusableElements(modalRef.current);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [closeOnEscape, onClose]
  );

  if (!isOpen) return null;

  const titleId = title ? 'modal-title' : undefined;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          transition: 'opacity 0.2s',
        }}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative', zIndex: 1001,
          background: '#fff', borderRadius: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width, maxWidth: '90vw', maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          outline: 'none',
          animation: 'modalSlideIn 0.2s ease-out',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #e5e7eb',
        }}>
          {title && <h2 id={titleId} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none', border: 'none', fontSize: 24,
              cursor: 'pointer', padding: '4px 8px', borderRadius: 4,
              color: '#6b7280', marginLeft: 'auto',
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #e5e7eb',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}`,

  accessibility: `The modal uses \`role="dialog"\` and \`aria-modal="true"\` to inform assistive technologies that this is a modal dialog. The title is linked via \`aria-labelledby\` for proper labeling. Focus is trapped within the modal using Tab key interception, cycling between the first and last focusable elements. When the modal opens, focus moves to the modal container; when it closes, focus returns to the element that triggered the opening. The close button has an \`aria-label\` for screen readers. The backdrop overlay has \`aria-hidden="true"\` since it's purely decorative.`,

  performance: `The modal renders nothing when closed (\`isOpen\` is false), so there is zero overhead when not visible. Portal rendering avoids unnecessary re-renders in the parent component tree. Event listeners for keyboard handling are attached only when the modal is open and cleaned up on unmount. Body scroll locking is handled via direct DOM manipulation in useEffect with proper cleanup. The focus-trapping logic queries focusable elements on each Tab press rather than caching them, which is simpler and handles dynamic content correctly with negligible performance cost.`,

  edgeCases: [
    'Modal with no focusable elements inside should still be keyboard-dismissible',
    'Nested modals should maintain separate focus traps',
    'Dynamic content changes inside the modal should not break focus trapping',
    'Browser back button should close the modal on mobile',
    'Multiple rapid open/close calls should not cause scroll lock issues',
  ],

  testingStrategy: [
    'Unit test: modal renders when isOpen is true and hides when false',
    'Unit test: Escape key triggers onClose callback',
    'Unit test: overlay click triggers onClose when closeOnOverlay is true',
    'Integration test: focus moves into modal on open and returns to trigger on close',
    'Integration test: Tab key cycles focus within modal boundaries',
    'Accessibility audit: ARIA roles and attributes are correctly applied',
  ],

  improvements: [
    'Add enter/exit CSS animations with AnimatePresence-like unmount delay',
    'Support stacking multiple modals with a modal manager context',
    'Add size variants (sm, md, lg, fullscreen)',
    'Implement a confirmation dialog variant with built-in confirm/cancel buttons',
  ],

  followUpQuestions: [
    'How would you handle nested modals with independent focus traps?',
    'What is the difference between a modal dialog and a non-modal dialog?',
    'How would you implement animation on mount and unmount without a library?',
    'How do you handle modals in a server-side rendered application?',
  ],
};
