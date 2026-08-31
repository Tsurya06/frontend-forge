import type { MachineCodingProblem } from '../../types';

export const carouselProblem: MachineCodingProblem = {
  id: 'mc-carousel',
  title: 'Image Carousel / Slider',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'carousel', 'slider', 'autoplay', 'animation', 'touch-events'],

  problemStatement: `Build an Image Carousel component in React that displays a series of images with next/previous navigation, dot indicators, and optional autoplay functionality. The carousel should support smooth sliding transitions between images and wrap around from the last image back to the first.

This problem tests your understanding of CSS transforms for animation, timer management with useEffect cleanup, touch/swipe gesture handling for mobile, and proper state management for circular navigation. The component should be responsive, performant, and accessible to keyboard and screen reader users.`,

  functionalRequirements: [
    'Display one image at a time with smooth sliding transition',
    'Next and Previous navigation buttons',
    'Dot indicators showing current slide and allowing direct navigation',
    'Autoplay with configurable interval that pauses on hover',
    'Infinite loop (wrap from last to first and vice versa)',
    'Support touch/swipe gestures for mobile navigation',
    'Keyboard navigation with arrow keys',
  ],

  nonFunctionalRequirements: [
    'CSS transform-based animation for smooth 60fps transitions',
    'Proper cleanup of autoplay timers to prevent memory leaks',
    'Responsive design that adapts to container width',
    'Accessible with ARIA live region for slide announcements',
  ],

  componentHierarchy: `Carousel
├── SlideTrack (transform-based sliding container)
│   └── Slide (repeated for each image)
│       └── <img> element
├── PrevButton
├── NextButton
└── DotIndicators
    └── Dot (repeated, one per slide)`,

  stateDesign: `// State shape
interface CarouselState {
  currentIndex: number;       // index of the currently visible slide
  isTransitioning: boolean;   // whether a slide animation is in progress
  isPaused: boolean;          // whether autoplay is paused (e.g., on hover)
}

// The track container uses transform: translateX(-currentIndex * 100%)
// to position slides. isTransitioning prevents rapid clicks from
// breaking the animation. Autoplay uses setInterval, cleared on
// hover or unmount.`,

  architecture: `The carousel renders all slides in a horizontal track container that is wider than the viewport. Only one slide is visible at a time, determined by a CSS \`translateX\` transform based on \`currentIndex\`. Navigation updates the index, and CSS \`transition\` on the transform property creates the sliding effect.

Autoplay is implemented with \`setInterval\` inside a \`useEffect\` that depends on the pause state. When the user hovers over the carousel, autoplay pauses. The interval is cleaned up on unmount to prevent memory leaks. Touch handling tracks \`touchstart\` and \`touchend\` positions to determine swipe direction, with a minimum threshold to avoid accidental navigation. The component uses a ref-based approach to always have the latest callback in the interval without restarting it.`,

  implementation: `import React, { useState, useEffect, useRef, useCallback, TouchEvent } from 'react';

interface CarouselProps {
  images: { src: string; alt: string }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function Carousel({
  images,
  autoPlay = true,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const slideCount = images.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(((index % slideCount) + slideCount) % slideCount);
  }, [slideCount]);

  const goNext = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    if (!autoPlay || isPaused || slideCount <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, autoPlayInterval, goNext, slideCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (delta > threshold) goNext();
    else if (delta < -threshold) goPrev();
  };

  if (slideCount === 0) return null;

  const btnStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
    width: 40, height: 40, fontSize: 18, cursor: 'pointer', zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  };

  return (
    <div
      role="region"
      aria-label="Image carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}
    >
      <div
        style={{
          display: 'flex',
          transform: \`translateX(-\${currentIndex * 100}%)\`,
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={\`Slide \${idx + 1} of \${slideCount}\`}
            style={{ minWidth: '100%', flexShrink: 0 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>

      {showArrows && slideCount > 1 && (
        <>
          <button onClick={goPrev} aria-label="Previous slide" style={{ ...btnStyle, left: 12 }}>
            ‹
          </button>
          <button onClick={goNext} aria-label="Next slide" style={{ ...btnStyle, right: 12 }}>
            ›
          </button>
        </>
      )}

      {showDots && slideCount > 1 && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8,
        }}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={\`Go to slide \${idx + 1}\`}
              aria-current={idx === currentIndex ? 'true' : undefined}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                border: '2px solid #fff', padding: 0, cursor: 'pointer',
                background: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        Slide {currentIndex + 1} of {slideCount}
      </div>
    </div>
  );
}`,

  accessibility: `The carousel uses \`role="region"\` with \`aria-roledescription="carousel"\` on the container. Each slide has \`role="group"\` with \`aria-roledescription="slide"\` and a label indicating its position. Navigation buttons have descriptive \`aria-label\` attributes. An \`aria-live="polite"\` region announces the current slide number on change. Dot indicators use \`aria-current\` for the active slide. Keyboard navigation with arrow keys mirrors the button functionality. Autoplay pauses on focus/hover to avoid disorienting users.`,

  performance: `Slides use CSS \`transform: translateX\` for animation, which is GPU-accelerated and achieves 60fps. All slides are rendered in the DOM but only one is visible, avoiding the cost of mount/unmount on navigation. Images should use \`loading="lazy"\` for offscreen slides to defer network requests. The autoplay timer is a single \`setInterval\` rather than chained \`setTimeout\`s, and is cleaned up properly. Touch event handling uses refs for start position, avoiding state updates during the gesture.`,

  edgeCases: [
    'Carousel with a single image should hide navigation controls',
    'Very rapid clicking should not skip slides or break animation',
    'Window resize while transitioning should maintain correct positions',
    'Images with different aspect ratios should be handled consistently',
    'Autoplay cleanup on unmount to prevent state updates on unmounted component',
  ],

  testingStrategy: [
    'Unit test: next/prev buttons navigate to correct slides',
    'Unit test: dot indicators navigate to the correct slide directly',
    'Unit test: autoplay advances slides at the correct interval',
    'Integration test: hovering pauses and resuming hover restarts autoplay',
    'Integration test: swipe gestures trigger correct navigation',
    'Accessibility audit: verify ARIA roles and live region announcements',
  ],

  improvements: [
    'Add fade transition option alongside slide transition',
    'Support vertical sliding direction',
    'Implement lazy loading with blur-up placeholder images',
    'Add thumbnail strip navigation below the main carousel',
    'Support video slides alongside images',
  ],

  followUpQuestions: [
    'How would you implement an infinite loop carousel without cloning slides?',
    'What are the trade-offs between transform-based and scroll-based carousels?',
    'How would you handle variable-width slides?',
    'How would you make the carousel work with server-side rendering?',
  ],
};
