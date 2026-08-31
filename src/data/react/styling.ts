import type { Topic } from '../../types';

export const stylingTopics: Topic[] = [
  {
    id: 'react-styling',
    title: 'Styling in React: CSS Modules, Tailwind, CSS-in-JS & Zero-Runtime',
    description:
      'Comparison and best practices for styling React applications: CSS Modules, Utility-First Tailwind CSS, CSS-in-JS (Styled Components, Emotion), Inline Styles, and Zero-Runtime Solutions (Vanilla Extract, StyleX).',
    category: 'React',
    difficulty: 'Intermediate',
    tags: ['react', 'styling', 'css-modules', 'tailwind', 'styled-components', 'css-in-js', 'zero-runtime'],
    overview:
      'React applications have diverse styling paradigms. Choosing between scoped CSS Modules, utility-first Tailwind CSS, dynamic runtime CSS-in-JS, or modern zero-runtime CSS engines impacts developer velocity, bundle size, CSS specificity, runtime overhead, and React Server Components (RSC) compatibility.',
    concepts: [
      'Inline styles and style prop limitations (no pseudo-classes, no media queries)',
      'CSS Modules: local scoping via hashed class names and :global() escape hatch',
      'Utility-First CSS (Tailwind CSS): design tokens, JIT compiler, performance benefits',
      'CSS-in-JS (Styled Components, Emotion): dynamic props interpolation, runtime style injection',
      'CSS-in-JS limitations in React 18/19 Server Components',
      'Zero-Runtime CSS: Vanilla Extract, StyleX, Panda CSS, Pigment CSS',
      'Performance and bundle size tradeoffs across approaches',
    ],
    relatedTopicIds: ['react-components', 'css-selectors'],
    questions: [
      {
        id: 'react-styling-1',
        question: 'Compare CSS Modules, Tailwind CSS, and Styled Components. What are their architectural tradeoffs?',
        answer:
          '1. **CSS Modules**:\n- **How it works**: Standard CSS files where class names are hashed at build time (e.g. `Button_btn__a1b2c`). Imported as a JS object (`styles.btn`).\n- **Pros**: Zero runtime overhead, full CSS language support, static extraction, full compatibility with React Server Components (RSC).\n- **Cons**: Requires switching between TSX and CSS files, no dynamic JS prop interpolation.\n\n2. **Tailwind CSS**:\n- **How it works**: Utility-first atomic CSS classes scanned at build time by a JIT compiler.\n- **Pros**: Tiny production CSS bundle (~10-15KB), no naming fatigue, enforces design system consistency, 100% RSC compatible.\n- **Cons**: Cluttered JSX markup, steep initial learning curve for class acronyms.\n\n3. **Styled Components / Emotion (Runtime CSS-in-JS)**:\n- **How it works**: Uses tagged template literals to inject `<style>` tags dynamically at runtime.\n- **Pros**: Tight component encapsulation, dynamic styling based on props/state.\n- **Cons**: Runtime CPU overhead (parsing & hashing styles on every render), larger JS bundle, incompatible with streaming SSR and React Server Components.',
        shortAnswer:
          'CSS Modules offers zero-runtime static CSS with scoped names; Tailwind provides atomic utilities with minimal bundle size and RSC compatibility; Styled Components offers dynamic prop-driven styling but introduces runtime overhead and SSR/RSC incompatibility.',
        code: `/* 1. CSS Modules */
// Button.module.css -> .primary { background: blue; }
import styles from './Button.module.css';
export const Button = () => <button className={styles.primary}>Click</button>;

/* 2. Tailwind CSS */
export const TailwindButton = () => (
  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg">
    Click
  </button>
);

/* 3. Styled Components */
import styled from 'styled-components';
export const StyledButton = styled.button<{ $variant: 'primary' | 'danger' }>\`
  background: \${props => props.$variant === 'danger' ? '#ef4444' : '#4f46e5'};
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
\`;`,
        language: 'tsx',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-styling',
        tags: ['styling', 'css-modules', 'tailwind', 'styled-components', 'css-in-js'],
        commonMistakes: [
          'Using runtime CSS-in-JS in React Server Components, which causes hydration and build errors.',
          'Using inline styles for interactive elements, missing hover, focus, and media query support.',
        ],
        followUps: ['Why does React team recommend Zero-Runtime CSS (like Vanilla Extract or StyleX) for modern React apps?'],
        interviewTips: ['Highlight that runtime CSS-in-JS incurs a performance penalty on frequent re-renders due to style recalculation.']
      },
      {
        id: 'react-styling-2',
        question: 'Why do runtime CSS-in-JS libraries struggle with React Server Components (RSC) and Streaming SSR?',
        answer:
          'Runtime CSS-in-JS libraries (like Styled Components v5 and Emotion) rely on executing JavaScript in the client or server component rendering phase to parse template strings, generate unique class name hashes, and inject `<style>` tags into the document `<head>`.\n\nIn **React Server Components (RSC)**:\n1. Server Components execute only on the server and send a serialized JSON component tree to the client without shipping their component JS.\n2. In **Streaming SSR**, HTML chunks are flushed to the browser before the full tree is rendered. Injecting styles into the `<head>` after the `<head>` has already streamed to the browser causes flash of unstyled content (FOUC) or invalid HTML insertion.\n3. Zero-runtime solutions (CSS Modules, Tailwind, Vanilla Extract, StyleX) extract all CSS ahead-of-time at build time into static `.css` files, completely avoiding runtime style injection.',
        shortAnswer:
          'Runtime CSS-in-JS requires inserting <style> tags at render time, which breaks streaming SSR (where <head> is already flushed) and Server Components (which do not execute client JS). Build-time extracted CSS avoids this completely.',
        code: `// Modern Zero-Runtime styling with Vanilla Extract
// styles.css.ts
import { style } from '@vanilla-extract/css';

export const button = style({
  backgroundColor: '#4f46e5',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '6px',
  ':hover': {
    backgroundColor: '#4338ca',
  },
});

// Component.tsx - 100% Zero-Runtime & RSC Compatible
import * as styles from './styles.css';
export function Button() {
  return <button className={styles.button}>Server Component Ready</button>;
}`,
        language: 'tsx',
        difficulty: 'Senior',
        type: 'Conceptual',
        category: 'React',
        topicId: 'react-styling',
        tags: ['rsc', 'ssr', 'zero-runtime', 'streaming', 'css-in-js'],
        commonMistakes: [
          'Assuming styled-components works out-of-the-box in Next.js App Router without client component wrappers.',
        ],
        followUps: ['How does Next.js App Router handle static vs dynamic CSS chunking?'],
        interviewTips: ['Explaining the incompatibility between streaming HTTP responses and runtime <style> injection shows deep fullstack React knowledge.']
      }
    ]
  }
];
