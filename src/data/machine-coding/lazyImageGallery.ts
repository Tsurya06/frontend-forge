import type { MachineCodingProblem } from '../../types';

export const lazyImageGalleryProblem: MachineCodingProblem = {
  id: 'mc-lazy-gallery',
  title: 'Lazy-Loaded Image Gallery',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['intersection-observer', 'lazy-loading', 'image', 'placeholder', 'performance', 'gallery'],
  problemStatement: `Build a Lazy-Loaded Image Gallery component in React that defers loading images until they are about to enter the viewport. Use the IntersectionObserver API to detect when an image placeholder scrolls into view, then swap it with the actual image source. Each image should display a blurred placeholder or skeleton while loading and gracefully handle load errors.

The gallery should render a responsive grid of image cards. Initially, all images render with a lightweight placeholder (a colored div or a tiny blurred thumbnail). As the user scrolls, the IntersectionObserver fires callbacks for images approaching the viewport, triggering the actual image load. Once loaded, the image fades in smoothly. If an image fails to load, a fallback error state is shown with a retry option.

This problem tests understanding of the IntersectionObserver API, ref management for multiple elements, image loading lifecycle, and performance optimization techniques.`,
  functionalRequirements: [
    'Render a grid of image cards with placeholder content initially',
    'Use IntersectionObserver to detect when images enter the viewport (with a rootMargin buffer)',
    'Load the actual image when the placeholder intersects the viewport',
    'Show a smooth fade-in transition when the image finishes loading',
    'Display an error fallback with a retry button if the image fails to load',
    'Support a configurable rootMargin (e.g., 200px) to start loading images before they are visible',
    'Clean up observers on unmount',
  ],
  nonFunctionalRequirements: [
    'Memory efficient: disconnect observers for loaded images',
    'Responsive grid layout adapting to viewport width',
    'Accessible: images have alt text, error states communicated to screen readers',
    'Minimal layout shift: placeholders match the aspect ratio of the final image',
  ],
  componentHierarchy: `LazyGallery
└── GalleryGrid
    └── LazyImage (per image)
        ├── Placeholder (skeleton/blur)
        ├── ActualImage (once loaded)
        └── ErrorFallback (on failure)`,
  stateDesign: `interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder?: string; // tiny base64 blur or color
}

// Per-image state managed inside LazyImage
const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
const imgRef = useRef<HTMLDivElement>(null);

// Observer options
const observerOptions: IntersectionObserverInit = {
  rootMargin: '200px 0px',
  threshold: 0,
};`,
  architecture: `The LazyGallery renders a grid of LazyImage components. Each LazyImage creates a ref to its container div. A custom useIntersection hook attaches an IntersectionObserver to the ref. When the element enters the viewport (plus rootMargin), the hook returns isIntersecting=true and the observer disconnects for that element.

Once triggered, the LazyImage sets a src on a hidden <img> element. The onload event transitions state to 'loaded' and fades in the image. The onerror event transitions to 'error'. The placeholder maintains the image's aspect ratio using a padding-bottom technique to avoid layout shift. A single shared IntersectionObserver instance could optimize further by observing all images from the parent.`,
  implementation: `import React, { useState, useRef, useEffect, useCallback } from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  color: string;
}

const sampleImages: GalleryImage[] = Array.from({ length: 24 }, (_, i) => ({
  id: \`img-\${i}\`,
  src: \`https://picsum.photos/seed/\${i + 1}/400/\${250 + (i % 4) * 50}\`,
  alt: \`Gallery image \${i + 1}\`,
  width: 400,
  height: 250 + (i % 4) * 50,
  color: ['#e2e8f0', '#dbeafe', '#fce7f3', '#d1fae5', '#fef3c7', '#e0e7ff'][i % 6],
}));

function useIntersection(
  ref: React.RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isIntersecting) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, isIntersecting, options.rootMargin, options.threshold]);

  return isIntersecting;
}

function LazyImage({ image }: { image: GalleryImage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersection(containerRef, { rootMargin: '200px 0px', threshold: 0 });
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    if (!isVisible || loadState !== 'idle') return;
    setLoadState('loading');
  }, [isVisible, loadState]);

  const handleLoad = useCallback(() => setLoadState('loaded'), []);
  const handleError = useCallback(() => setLoadState('error'), []);
  const handleRetry = useCallback(() => setLoadState('idle'), []);

  const aspectRatio = (image.height / image.width) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        paddingBottom: \`\${aspectRatio}%\`,
        background: image.color,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {(loadState === 'loading' || loadState === 'loaded') && (
        <img
          src={image.src}
          alt={image.alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loadState === 'loaded' ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}

      {loadState === 'idle' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#94a3b8', fontSize: 14,
          }}
          aria-hidden="true"
        />
      )}

      {loadState === 'loading' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 24, height: 24, border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', borderRadius: '50%',
              animation: 'lazy-spin 0.8s linear infinite',
            }}
          />
        </div>
      )}

      {loadState === 'error' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(0,0,0,0.05)',
          }}
          role="alert"
        >
          <span style={{ fontSize: 24 }}>⚠️</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>Failed to load</span>
          <button
            onClick={handleRetry}
            style={{
              padding: '4px 12px', fontSize: 12, background: '#3b82f6', color: '#fff',
              border: 'none', borderRadius: 4, cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default function LazyGallery() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2 style={{ margin: '0 0 4px' }}>Image Gallery</h2>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px' }}>
        Scroll down — images load lazily as they enter the viewport.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}
        role="list"
        aria-label="Image gallery"
      >
        {sampleImages.map((img) => (
          <div role="listitem" key={img.id}>
            <LazyImage image={img} />
          </div>
        ))}
      </div>

      <style>{\`@keyframes lazy-spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  );
}`,
  accessibility: `All images have descriptive alt text. The gallery uses role="list" with role="listitem" for structure. Error states use role="alert" for screen reader announcement. The retry button is keyboard accessible. Placeholder divs are aria-hidden since they're decorative. The loading spinner is visual-only; the image's loading state is implicit from the alt text appearing once loaded.`,
  performance: `IntersectionObserver is highly performant — it runs off the main thread and only fires callbacks when intersection state changes. Each observer is disconnected after the image enters the viewport, reducing overhead. The rootMargin of 200px starts loading images before they're visible, creating a seamless experience. The padding-bottom technique for aspect ratio prevents Cumulative Layout Shift (CLS). Only intersecting images trigger network requests.`,
  edgeCases: [
    'Image URL is 404 — onerror fires, error state shown with retry',
    'User scrolls very fast past many images — all observers fire, but images load in parallel',
    'IntersectionObserver not supported (old browsers) — provide a fallback that loads all images',
    'Image loads instantly from cache — onload fires immediately, fade-in still applies',
    'Component unmounts while images are loading — observer cleanup prevents memory leaks',
    'Network goes offline — images in flight will error, retry available when online again',
    'Very large gallery (1000+ images) — consider virtualization alongside lazy loading',
  ],
  testingStrategy: [
    'Unit test: useIntersection returns false initially and true when intersection fires',
    'Unit test: observer disconnects after intersection (check disconnect was called)',
    'Integration test: images below viewport do not have src set initially',
    'Integration test: scrolling triggers image loading and fade-in',
    'Integration test: error state shows retry button that resets loading',
    'Performance test: verify only visible images make network requests',
    'Accessibility test: images have alt text and error states have role="alert"',
  ],
  improvements: [
    'Use tiny base64-encoded blurred thumbnails (LQIP) instead of colored placeholders',
    'Add lightbox modal for viewing full-resolution images',
    'Implement virtualized scrolling for galleries with thousands of images',
    'Add progressive image loading (low-res → high-res)',
    'Support native loading="lazy" as a fallback when IntersectionObserver is unavailable',
  ],
  followUpQuestions: [
    'How does IntersectionObserver differ from scroll event listeners for lazy loading?',
    'What is LQIP (Low-Quality Image Placeholder) and how would you generate it?',
    'How would you combine lazy loading with virtualized scrolling for huge galleries?',
    'What is Cumulative Layout Shift and how does the padding-bottom technique prevent it?',
  ],
};
