import type { CodingProblem } from "../../types";

export const holyGrailLayoutProblem: CodingProblem = {
  id: "holy-grail-layout",
  title: "Responsive Holy Grail Layout (CSS Grid & Flexbox)",
  difficulty: "Intermediate",
  category: "CSS",
  tags: ["CSS Grid", "Flexbox", "Layout", "Responsive Design", "Holy Grail"],
  problem:
    "Implement the classic Holy Grail layout with a fixed-height header, a 3-column middle area (left navigation sidebar, flexible main content, and right ads/sidebar), and a footer pinned to the bottom of the viewport even when content is short. On mobile viewports (≤ 768px), stack the sections vertically in logical mobile order (Header -> Main Content -> Left Sidebar -> Right Sidebar -> Footer).",
  requirements: [
    "Header and Footer span 100% width.",
    "Left sidebar: fixed 220px width; Right sidebar: fixed 200px width; Middle main content: flexible (1fr) expanding to fill remaining width.",
    "Footer must stay pinned to the bottom of the screen (min-height: 100vh) without overlapping content.",
    "On mobile viewports (< 768px), middle columns must collapse to a single vertical column with main content appearing before secondary sidebars.",
    "Must be pure, semantic HTML and modern CSS Grid without JavaScript.",
  ],
  examples: [
    {
      input:
        '<div class="holy-grail"><header>Header</header><aside class="nav">Nav</aside><main>Content</main><aside class="ads">Ads</aside><footer>Footer</footer></div>',
      output:
        "Full viewport responsive 3-column layout desktop, stacked content-first on mobile",
      explanation:
        'Uses CSS Grid grid-template-areas: "header header header" "nav main ads" "footer footer footer" with min-height: 100dvh.',
    },
  ],
  edgeCases: [
    "Short content: footer must stay at the bottom of the window without creating unwanted scrollbars.",
    "Extremely long content in main: page scrolls naturally without clipping sidebars.",
    "Mobile browser viewport height shifts: use `100dvh` to prevent mobile address bar jumping.",
  ],
  optimalApproach:
    "Use CSS Grid on the container with `min-height: 100dvh`, defining `grid-template-rows: auto 1fr auto`, `grid-template-columns: 220px 1fr 200px`, and named `grid-template-areas`. Use a media query for mobile screens to reorder grid areas so `<main>` appears above secondary navigation.",
  implementation: `<!-- HTML Structure -->
<div class="holy-grail">
  <header class="header">Header (Logo & Nav)</header>
  <aside class="left-sidebar">Navigation Sidebar</aside>
  <main class="main-content">
    <h1>Main Article</h1>
    <p>Flexible content that expands to fill available viewport space.</p>
  </main>
  <aside class="right-sidebar">Widgets & Ads</aside>
  <footer class="footer">Footer & Copyright</footer>
</div>

<style>
/* CSS Grid Holy Grail Implementation */
.holy-grail {
  display: grid;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 220px 1fr 200px;
  grid-template-areas:
    "header  header  header"
    "nav     main    ads"
    "footer  footer  footer";
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}

.header {
  grid-area: header;
  background: #202123;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
}

.left-sidebar {
  grid-area: nav;
  background: #f7f7f8;
  border: 1px solid #e5e5e5;
  padding: 16px;
  border-radius: 8px;
}

.main-content {
  grid-area: main;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 24px;
  border-radius: 8px;
}

.right-sidebar {
  grid-area: ads;
  background: #f7f7f8;
  border: 1px solid #e5e5e5;
  padding: 16px;
  border-radius: 8px;
}

.footer {
  grid-area: footer;
  background: #202123;
  color: #ececf1;
  padding: 16px;
  text-align: center;
  border-radius: 8px;
}

/* Mobile Responsive Breakpoint */
@media (max-width: 768px) {
  .holy-grail {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "header"
      "main"
      "nav"
      "ads"
      "footer";
  }
}
</style>`,
  stepByStep: [
    "Define `display: grid` with `min-height: 100dvh` (or `100vh`).",
    "Set `grid-template-rows: auto 1fr auto` so the middle row expands to take all remaining height.",
    "Set `grid-template-columns: 220px 1fr 200px` for left sidebar, flexible center, and right widget area.",
    "Assign `grid-area` identifiers to each semantic child element.",
    "Add media query `@media (max-width: 768px)` changing grid template areas to a single stacked column.",
  ],
  timeComplexity: "O(1) browser layout reflow",
  spaceComplexity: "O(1) DOM nodes",
  commonMistakes: [
    "Using float or inline-block with fixed pixel heights which break responsive resizing.",
    "Using 100vh instead of 100dvh on mobile, causing jumpy overflow when the URL bar collapses.",
    "Ordering HTML source so secondary sidebars come before main content, harming screen reader accessibility.",
  ],
  followUps: [
    "How would you implement sticky navigation within the left sidebar during page scroll?",
    "How would you achieve subgrid alignment between header items and main content columns?",
  ],
};

export const accessibleToggleSwitchProblem: CodingProblem = {
  id: "accessible-toggle-switch",
  title: "Accessible Custom Toggle Switch (Semantic HTML + Pure CSS)",
  difficulty: "Beginner",
  category: "HTML & CSS",
  tags: ["HTML", "CSS", "Accessibility", "ARIA", "Checkbox"],
  problem:
    'Build an accessible custom toggle switch (slider switch) using semantic HTML and CSS. The switch must support full keyboard navigation (Tab to focus, Space to toggle), announce its state accurately to screen readers via a native checkbox or `role="switch"`, provide high-contrast visible focus rings, and animate smoothly with GPU-accelerated CSS transforms.',
  requirements: [
    "Must be operable with both mouse click and keyboard (Space/Enter).",
    "Accessible to screen readers (announce Checked / Unchecked and accessible label).",
    "Smooth toggle pill slide animation using `transform: translateX()` (not `left` or `margin`).",
    "Visible focus-visible indicator complying with WCAG 2.1 AA (contrast ratio ≥ 3:1).",
    "Support disabled state with reduced opacity and `cursor: not-allowed`.",
  ],
  examples: [
    {
      input:
        '<label class="switch"><input type="checkbox" role="switch"><span class="slider"></span><span>Enable Notifications</span></label>',
      output:
        "Animated green pill switch toggling smoothly between on/off states",
      explanation:
        'Uses visually hidden input[type="checkbox"] + :checked CSS selector with transform: translateX(20px).',
    },
  ],
  edgeCases: [
    "Screen reader accessibility: do not use `display: none` on the input, as that removes it from the accessibility tree; use standard `.sr-only` clipping.",
    "Reduced motion user preference: disable transition animation under `@media (prefers-reduced-motion: reduce)`.",
  ],
  optimalApproach:
    'Use a real `<input type="checkbox" role="switch">` visually clipped with `clip: rect(0,0,0,0)`. Use the sibling selector `input:checked + .slider` to update colors and `input:checked + .slider::after` with `transform: translateX()` for GPU 60fps sliding animation.',
  implementation: `<!-- Accessible HTML Switch -->
<label class="switch-container">
  <input type="checkbox" role="switch" class="switch-input" id="notif-toggle" />
  <span class="switch-track" aria-hidden="true">
    <span class="switch-thumb"></span>
  </span>
  <span class="switch-label">Enable Notifications</span>
</label>

<style>
.switch-container {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #2d2d2d;
}

/* Visually hidden accessible checkbox */
.switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Pill Track */
.switch-track {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: #e5e5e5;
  border-radius: 9999px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

/* Sliding Thumb */
.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Checked State */
.switch-input:checked + .switch-track {
  background-color: #10a37f; /* ChatGPT Green */
}

.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(20px);
}

/* Keyboard Focus Visible Ring */
.switch-input:focus-visible + .switch-track {
  outline: 2px solid #10a37f;
  outline-offset: 2px;
}

/* Disabled State */
.switch-input:disabled + .switch-track {
  background-color: #f0f0f2;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .switch-track,
  .switch-thumb {
    transition: none;
  }
}
</style>`,
  stepByStep: [
    'Wrap `<input type="checkbox" role="switch">` inside a `<label>` element for built-in click association.',
    "Hide the checkbox visually using CSS clipping (`clip: rect(0,0,0,0)`) so keyboard focus and screen readers remain 100% active.",
    "Style `.switch-track` with `border-radius: 9999px` and background color.",
    "Style `.switch-thumb` with `border-radius: 50%` and `box-shadow`.",
    "Use `:checked` pseudo-class to transition the track to green and translateX(20px) on the thumb.",
    "Add `:focus-visible` outline on the track for keyboard tab accessibility.",
  ],
  timeComplexity: "O(1) GPU composite layer",
  spaceComplexity: "O(1)",
  commonMistakes: [
    "Using `display: none` which breaks screen reader accessibility and tab keyboard navigation.",
    "Animating `left` property instead of `transform: translateX()`, causing layout thrashing and stutter on low-end devices.",
    'Forgetting `role="switch"` or accessible label association.',
  ],
  followUps: [
    "How would you add icons (like Sun/Moon for theme toggle) inside the switch track?",
  ],
};

export const nativeDialogModalProblem: CodingProblem = {
  id: "dialog-modal-native",
  title: "Native HTML5 <dialog> Modal with Backdrop Transition",
  difficulty: "Intermediate",
  category: "HTML & CSS",
  tags: ["HTML5", "CSS", "Modal", "Dialog", "Accessibility"],
  problem:
    "Implement an accessible, performant modal dialog using the native HTML5 `<dialog>` element. The dialog must support `.showModal()` with top-layer placement, native keyboard Escape to dismiss, custom animated backdrop blur, and focus trapping without external libraries.",
  requirements: [
    "Use semantic `<dialog>` element with `showModal()` API.",
    "Custom styled `::backdrop` with soft blur (`backdrop-filter: blur(4px)`) and semi-transparent dark overlay.",
    "Smooth CSS scale-in and fade-in animation on open.",
    "Close on clicking the outside backdrop overlay or pressing Escape.",
    "Focus automatically moves to first focusable element inside the modal.",
  ],
  examples: [
    {
      input: 'document.querySelector("dialog").showModal()',
      output: "Centered modal with backdrop overlay and focus trap",
      explanation:
        "Native <dialog> renders in browser top layer with native Escape key handling.",
    },
  ],
  edgeCases: [
    "Closing on backdrop click: detect if click coordinates `(e.clientX, e.clientY)` fall outside the dialog bounding rectangle `dialog.getBoundingClientRect()`.",
    "Prevent background body scrolling when modal is open.",
  ],
  optimalApproach:
    'Use `<dialog id="modal">` and open with `modal.showModal()`. Style the native `::backdrop` pseudo-element. Add a click handler on the dialog that checks if click was outside the rect to auto-close.',
  implementation: `<!-- Native Dialog Modal -->
<button id="open-btn" class="primary-btn">Open Dialog</button>

<dialog id="fav-dialog" class="native-dialog">
  <div class="dialog-header">
    <h2>Confirm Action</h2>
    <button id="close-x" class="close-btn" aria-label="Close dialog">✕</button>
  </div>
  <p class="dialog-body">
    Are you sure you want to proceed with this operation? This action is instant and reversible.
  </p>
  <div class="dialog-footer">
    <button id="cancel-btn" class="secondary-btn">Cancel</button>
    <button id="confirm-btn" class="primary-btn">Confirm</button>
  </div>
</dialog>

<style>
/* Native <dialog> Modern Styling */
.native-dialog {
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: calc(100% - 32px);
  background: #ffffff;
  color: #2d2d2d;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), display 0.2s allow-discrete;
}

/* Dialog Open State Animation */
.native-dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Native Backdrop Pseudo Element */
.native-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s ease, display 0.2s allow-discrete;
}

.native-dialog[open]::backdrop {
  opacity: 1;
}

/* Header & Footer */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dialog-header h2 {
  font-size: 18px;
  margin: 0;
}

.dialog-body {
  font-size: 14px;
  color: #6b6b6b;
  line-height: 1.6;
  margin: 0 0 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary-btn {
  background: #10a37f;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.secondary-btn {
  background: #f7f7f8;
  color: #2d2d2d;
  border: 1px solid #e5e5e5;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #8e8ea0;
  cursor: pointer;
}
</style>

<script>
const dialog = document.getElementById('fav-dialog');
const openBtn = document.getElementById('open-btn');
const closeX = document.getElementById('close-x');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

openBtn.addEventListener('click', () => dialog.showModal());
[closeX, cancelBtn, confirmBtn].forEach(b => b.addEventListener('click', () => dialog.close()));

// Close on backdrop click
dialog.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect();
  const isInDialog = (
    rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX && e.clientX <= rect.left + rect.width
  );
  if (!isInDialog) dialog.close();
});
</script>`,
  stepByStep: [
    "Create semantic `<dialog>` element containing modal title, body, and action buttons.",
    "Use `dialog.showModal()` to launch modal into the browser top layer.",
    "Style `::backdrop` pseudo-element with `background-color` and `backdrop-filter`.",
    "Add click event checking `getBoundingClientRect()` to close when clicking the outside overlay.",
  ],
  timeComplexity: "O(1)",
  spaceComplexity: "O(1)",
  commonMistakes: [
    "Using `dialog.show()` instead of `dialog.showModal()`, which does not create a backdrop or focus trap.",
    "Trying to implement complex manual focus trap JavaScript when the native `<dialog>` handles it automatically.",
  ],
  followUps: [
    "How does the browser Top Layer interact with z-index stacking contexts?",
  ],
};

export const cssSkeletonShimmerProblem: CodingProblem = {
  id: "css-skeleton-shimmer",
  title: "CSS Skeleton Loader with Shimmer Animation",
  difficulty: "Beginner",
  category: "CSS",
  tags: ["CSS", "Animations", "Performance", "UX", "Skeleton"],
  problem:
    "Design a reusable, high-performance CSS Skeleton loading component with a smooth diagonal linear-gradient shimmer effect. The skeleton must adapt flexibly to avatar circles, heading lines, and body paragraphs without hardcoded dimensions.",
  requirements: [
    "Use pure CSS keyframe animations with `linear-gradient` shimmer wave.",
    "Support `.skeleton-circle` (for avatars), `.skeleton-text` (for paragraphs), and `.skeleton-card`.",
    "Hardware accelerated 60fps smooth animation with infinite loop.",
    "Respect `prefers-reduced-motion` by displaying a soft static pulse instead of high-frequency shimmer.",
    "Support seamless Dark and Light themes via CSS variables.",
  ],
  examples: [
    {
      input:
        '<div class="skeleton skeleton-circle"></div><div class="skeleton skeleton-text"></div>',
      output: "Smooth silver-wave shimmering placeholder card",
      explanation:
        "Uses background-size: 200% 100% and keyframes animating background-position-x.",
    },
  ],
  edgeCases: [
    "Multiple skeletons on page: keep gradient angles and timing synced to avoid visual chaos.",
    'Accessibility: mark with `aria-hidden="true"` or `aria-busy="true"` on parent.',
  ],
  optimalApproach:
    "Use `background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)` with `background-size: 200% 100%` and animate `background-position-x: -200%` to `200%` over 1.5s.",
  implementation: `<!-- Skeleton Loader Card -->
<div class="card-placeholder" aria-busy="true" aria-label="Loading content...">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton-body">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line short"></div>
  </div>
</div>

<style>
/* Base Skeleton Style with Shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f2 0%,
    #e5e5e8 50%,
    #f0f0f2 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 6px;
}

[data-theme="dark"] .skeleton {
  background: linear-gradient(
    90deg,
    #2a2b32 0%,
    #343541 50%,
    #2a2b32 100%
  );
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Shape Variants */
.card-placeholder {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #ffffff;
  max-width: 400px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-title {
  height: 18px;
  width: 60%;
}

.skeleton-line {
  height: 14px;
  width: 100%;
}

.skeleton-line.short {
  width: 40%;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: pulse 2s infinite ease-in-out;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
}
</style>`,
  stepByStep: [
    "Define `.skeleton` with a 3-stop `linear-gradient` (base color, lighter highlight, base color).",
    "Set `background-size: 200% 100%` so the highlight wave can translate across.",
    "Create keyframe `shimmer` translating `background-position-x` from `200%` to `-200%`.",
    "Create utility shapes: `.skeleton-avatar` (50% border radius), `.skeleton-title`, and `.skeleton-line`.",
  ],
  timeComplexity: "O(1) GPU rendering",
  spaceComplexity: "O(1)",
  commonMistakes: [
    "Animating `opacity` repeatedly instead of gradient position, which can look flashing and jarring.",
    "Forgetting `background-size: 200% 100%`, which prevents the gradient from shifting smoothly.",
  ],
  followUps: [
    "How does skeleton rendering improve perceived performance (FCP/LCP) over a spinner icon?",
  ],
};

export const htmlCssCodingProblems: CodingProblem[] = [
  holyGrailLayoutProblem,
  accessibleToggleSwitchProblem,
  nativeDialogModalProblem,
  cssSkeletonShimmerProblem,
];
