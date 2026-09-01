import type { MachineCodingProblem } from "../../types";

export const starRatingProblem: MachineCodingProblem = {
  id: "mc-star-rating",
  title: "Star Rating Component",
  difficulty: "Beginner",
  category: "Machine Coding",
  tags: [
    "react",
    "component",
    "accessibility",
    "keyboard-navigation",
    "hover-state",
    "controlled-component",
  ],

  problemStatement: `Build a reusable Star Rating component in React that allows users to select a rating by clicking on stars. The component should support hover previews so users can see which rating they are about to select before committing. This is one of the most commonly asked machine coding questions in frontend interviews, testing your understanding of event handling, controlled components, and accessibility.

The component should be flexible enough to support a configurable number of stars, read-only mode, and different sizes. It must be fully accessible via keyboard navigation, allowing users to tab into the component and use arrow keys to adjust the rating. Screen readers should announce the current and selected ratings properly using ARIA attributes.`,

  functionalRequirements: [
    "Render a configurable number of stars (default 5)",
    "Click on a star to select that rating",
    "Hover over stars to preview the rating before selection",
    "Support half-star ratings optionally",
    "Allow clearing the rating by clicking the same star again",
    "Support read-only mode for display purposes",
    "Support controlled and uncontrolled usage patterns",
  ],

  nonFunctionalRequirements: [
    "Keyboard accessible: Tab to focus, Arrow keys to change rating, Enter/Space to confirm",
    "Screen reader friendly with proper ARIA labels and live regions",
    "Smooth hover transitions with CSS",
    "No external dependencies beyond React",
  ],

  componentHierarchy: `StarRating
├── Star (repeated N times)
│   ├── SVG Icon (filled / half / empty)
│   └── Hidden Radio Input (for a11y)
└── ScreenReaderAnnouncement (aria-live region)`,

  stateDesign: `// State shape
interface StarRatingState {
  selectedRating: number;   // The committed rating (0 = none)
  hoverRating: number;      // The rating being hovered (-1 = none)
}

// selectedRating is the source of truth for the chosen value.
// hoverRating temporarily overrides the visual display during mouse interaction.
// When the mouse leaves, hoverRating resets to -1 and the display reverts to selectedRating.`,

  propsApiDesign: `interface StarRatingProps {
  totalStars?: number;       // default 5
  value?: number;            // controlled rating
  defaultValue?: number;     // uncontrolled initial rating
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  allowHalf?: boolean;
  allowClear?: boolean;      // click same star to clear
  label?: string;            // accessible label
}`,

  architecture: `The Star Rating component follows a controlled/uncontrolled pattern. Internally it tracks \`hoverRating\` for preview effects. Each star is rendered as a button element with an SVG icon that changes fill based on whether the star index is less than, equal to, or greater than the active rating (hover or selected).

Event handling uses a combination of \`onMouseEnter\` per star (to set hover state), \`onMouseLeave\` on the container (to clear hover state), and \`onClick\` per star (to commit the rating). Keyboard navigation is implemented with a roving tabindex pattern where only the currently selected star is tabbable, and arrow keys move focus between stars. The component uses \`role="radiogroup"\` with individual stars as \`role="radio"\` for proper screen reader semantics.`,

  implementation: `import React, { useState, useCallback, useRef, KeyboardEvent } from 'react';

interface StarRatingProps {
  totalStars?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  allowClear?: boolean;
  label?: string;
}

const sizeMap = { sm: 16, md: 24, lg: 32 };

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#fbbf24' : 'none'}
      stroke={filled ? '#fbbf24' : '#d1d5db'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function StarRating({
  totalStars = 5,
  value,
  defaultValue = 0,
  onChange,
  readOnly = false,
  size = 'md',
  allowClear = true,
  label = 'Rating',
}: StarRatingProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverRating, setHoverRating] = useState(-1);
  const starsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const rating = value !== undefined ? value : internalValue;
  const activeRating = hoverRating >= 0 ? hoverRating : rating;
  const pixelSize = sizeMap[size];

  const handleSelect = useCallback(
    (index: number) => {
      if (readOnly) return;
      const newRating = allowClear && rating === index + 1 ? 0 : index + 1;
      if (value === undefined) setInternalValue(newRating);
      onChange?.(newRating);
    },
    [readOnly, allowClear, rating, value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (readOnly) return;
      let nextIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = Math.min(index + 1, totalStars - 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = Math.max(index - 1, 0);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(index);
        return;
      }
      starsRef.current[nextIndex]?.focus();
    },
    [readOnly, totalStars, handleSelect]
  );

  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}
      onMouseLeave={() => !readOnly && setHoverRating(-1)}
    >
      {Array.from({ length: totalStars }, (_, i) => {
        const filled = i < activeRating;
        const isSelected = i < rating;
        return (
          <button
            key={i}
            ref={(el) => { starsRef.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={\`\${i + 1} star\${i === 0 ? '' : 's'}\`}
            tabIndex={i === Math.max(0, rating - 1) ? 0 : -1}
            onClick={() => handleSelect(i)}
            onMouseEnter={() => !readOnly && setHoverRating(i + 1)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            style={{
              background: 'none',
              border: 'none',
              padding: 2,
              cursor: readOnly ? 'default' : 'pointer',
              outline: 'none',
              transition: 'transform 0.15s',
              transform: hoverRating === i + 1 ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <StarIcon filled={filled} size={pixelSize} />
          </button>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {rating > 0 ? \`Selected: \${rating} of \${totalStars} stars\` : 'No rating selected'}
      </span>
    </div>
  );
}`,

  accessibility: `The component uses \`role="radiogroup"\` on the container and \`role="radio"\` with \`aria-checked\` on each star, following the WAI-ARIA radio group pattern. A roving tabindex ensures only one star is in the tab order at a time, and arrow keys move focus between stars. Each star has an \`aria-label\` like "3 stars" for screen reader announcement. An \`aria-live="polite"\` region announces rating changes. In read-only mode, the component conveys the current rating without interactive semantics.`,

  performance: `The component is lightweight with minimal re-renders. Hover state changes only update the container component, and each star receives primitive props, making them easy to memoize with \`React.memo\` if needed. SVG icons are inlined to avoid extra network requests. The \`useCallback\` hooks prevent unnecessary re-creation of event handlers. For very large star counts, individual star components could be virtualized, but this is rarely needed in practice.`,

  edgeCases: [
    "Rating of 0 (no stars selected) must be visually distinct",
    "Rapid mouse movement across stars should not cause flickering",
    "Touch devices need tap support without hover preview",
    "RTL layouts should reverse star order",
    "Controlled mode where external value changes should override internal state",
  ],

  testingStrategy: [
    "Unit test: clicking star N sets rating to N",
    "Unit test: clicking same star in allowClear mode clears rating",
    "Unit test: hover previews correct number of filled stars",
    "Integration test: keyboard navigation cycles through stars with ArrowRight/ArrowLeft",
    "Accessibility audit: verify ARIA roles and live region announcements",
  ],

  improvements: [
    "Add half-star support using mouse position within each star element",
    "Support custom icons (hearts, thumbs up) via render prop or icon prop",
    "Add animation/transition effects when rating changes",
    "Support fractional display ratings (e.g., 3.7 stars) in read-only mode",
  ],

  followUpQuestions: [
    "How would you implement half-star ratings based on mouse position?",
    "How would you make this component work with form libraries like React Hook Form?",
    "What changes are needed to support RTL languages?",
    "How would you animate the star fill transition?",
  ],
};
