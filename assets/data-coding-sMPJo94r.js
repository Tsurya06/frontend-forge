var e=[{id:`holy-grail-layout`,title:`Responsive Holy Grail Layout (CSS Grid & Flexbox)`,difficulty:`Intermediate`,category:`CSS`,tags:[`CSS Grid`,`Flexbox`,`Layout`,`Responsive Design`,`Holy Grail`],problem:`Implement the classic Holy Grail layout with a fixed-height header, a 3-column middle area (left navigation sidebar, flexible main content, and right ads/sidebar), and a footer pinned to the bottom of the viewport even when content is short. On mobile viewports (≤ 768px), stack the sections vertically in logical mobile order (Header -> Main Content -> Left Sidebar -> Right Sidebar -> Footer).`,requirements:[`Header and Footer span 100% width.`,`Left sidebar: fixed 220px width; Right sidebar: fixed 200px width; Middle main content: flexible (1fr) expanding to fill remaining width.`,`Footer must stay pinned to the bottom of the screen (min-height: 100vh) without overlapping content.`,`On mobile viewports (< 768px), middle columns must collapse to a single vertical column with main content appearing before secondary sidebars.`,`Must be pure, semantic HTML and modern CSS Grid without JavaScript.`],examples:[{input:`<div class="holy-grail"><header>Header</header><aside class="nav">Nav</aside><main>Content</main><aside class="ads">Ads</aside><footer>Footer</footer></div>`,output:`Full viewport responsive 3-column layout desktop, stacked content-first on mobile`,explanation:`Uses CSS Grid grid-template-areas: "header header header" "nav main ads" "footer footer footer" with min-height: 100dvh.`}],edgeCases:[`Short content: footer must stay at the bottom of the window without creating unwanted scrollbars.`,`Extremely long content in main: page scrolls naturally without clipping sidebars.`,"Mobile browser viewport height shifts: use `100dvh` to prevent mobile address bar jumping."],optimalApproach:"Use CSS Grid on the container with `min-height: 100dvh`, defining `grid-template-rows: auto 1fr auto`, `grid-template-columns: 220px 1fr 200px`, and named `grid-template-areas`. Use a media query for mobile screens to reorder grid areas so `<main>` appears above secondary navigation.",implementation:`<!-- HTML Structure -->
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
</style>`,stepByStep:["Define `display: grid` with `min-height: 100dvh` (or `100vh`).","Set `grid-template-rows: auto 1fr auto` so the middle row expands to take all remaining height.","Set `grid-template-columns: 220px 1fr 200px` for left sidebar, flexible center, and right widget area.","Assign `grid-area` identifiers to each semantic child element.","Add media query `@media (max-width: 768px)` changing grid template areas to a single stacked column."],timeComplexity:`O(1) browser layout reflow`,spaceComplexity:`O(1) DOM nodes`,commonMistakes:[`Using float or inline-block with fixed pixel heights which break responsive resizing.`,`Using 100vh instead of 100dvh on mobile, causing jumpy overflow when the URL bar collapses.`,`Ordering HTML source so secondary sidebars come before main content, harming screen reader accessibility.`],followUps:[`How would you implement sticky navigation within the left sidebar during page scroll?`,`How would you achieve subgrid alignment between header items and main content columns?`]},{id:`accessible-toggle-switch`,title:`Accessible Custom Toggle Switch (Semantic HTML + Pure CSS)`,difficulty:`Beginner`,category:`HTML & CSS`,tags:[`HTML`,`CSS`,`Accessibility`,`ARIA`,`Checkbox`],problem:'Build an accessible custom toggle switch (slider switch) using semantic HTML and CSS. The switch must support full keyboard navigation (Tab to focus, Space to toggle), announce its state accurately to screen readers via a native checkbox or `role="switch"`, provide high-contrast visible focus rings, and animate smoothly with GPU-accelerated CSS transforms.',requirements:[`Must be operable with both mouse click and keyboard (Space/Enter).`,`Accessible to screen readers (announce Checked / Unchecked and accessible label).`,"Smooth toggle pill slide animation using `transform: translateX()` (not `left` or `margin`).",`Visible focus-visible indicator complying with WCAG 2.1 AA (contrast ratio ≥ 3:1).`,"Support disabled state with reduced opacity and `cursor: not-allowed`."],examples:[{input:`<label class="switch"><input type="checkbox" role="switch"><span class="slider"></span><span>Enable Notifications</span></label>`,output:`Animated green pill switch toggling smoothly between on/off states`,explanation:`Uses visually hidden input[type="checkbox"] + :checked CSS selector with transform: translateX(20px).`}],edgeCases:["Screen reader accessibility: do not use `display: none` on the input, as that removes it from the accessibility tree; use standard `.sr-only` clipping.","Reduced motion user preference: disable transition animation under `@media (prefers-reduced-motion: reduce)`."],optimalApproach:'Use a real `<input type="checkbox" role="switch">` visually clipped with `clip: rect(0,0,0,0)`. Use the sibling selector `input:checked + .slider` to update colors and `input:checked + .slider::after` with `transform: translateX()` for GPU 60fps sliding animation.',implementation:`<!-- Accessible HTML Switch -->
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
</style>`,stepByStep:['Wrap `<input type="checkbox" role="switch">` inside a `<label>` element for built-in click association.',"Hide the checkbox visually using CSS clipping (`clip: rect(0,0,0,0)`) so keyboard focus and screen readers remain 100% active.","Style `.switch-track` with `border-radius: 9999px` and background color.","Style `.switch-thumb` with `border-radius: 50%` and `box-shadow`.","Use `:checked` pseudo-class to transition the track to green and translateX(20px) on the thumb.","Add `:focus-visible` outline on the track for keyboard tab accessibility."],timeComplexity:`O(1) GPU composite layer`,spaceComplexity:`O(1)`,commonMistakes:["Using `display: none` which breaks screen reader accessibility and tab keyboard navigation.","Animating `left` property instead of `transform: translateX()`, causing layout thrashing and stutter on low-end devices.",'Forgetting `role="switch"` or accessible label association.'],followUps:[`How would you add icons (like Sun/Moon for theme toggle) inside the switch track?`]},{id:`dialog-modal-native`,title:`Native HTML5 <dialog> Modal with Backdrop Transition`,difficulty:`Intermediate`,category:`HTML & CSS`,tags:[`HTML5`,`CSS`,`Modal`,`Dialog`,`Accessibility`],problem:"Implement an accessible, performant modal dialog using the native HTML5 `<dialog>` element. The dialog must support `.showModal()` with top-layer placement, native keyboard Escape to dismiss, custom animated backdrop blur, and focus trapping without external libraries.",requirements:["Use semantic `<dialog>` element with `showModal()` API.","Custom styled `::backdrop` with soft blur (`backdrop-filter: blur(4px)`) and semi-transparent dark overlay.",`Smooth CSS scale-in and fade-in animation on open.`,`Close on clicking the outside backdrop overlay or pressing Escape.`,`Focus automatically moves to first focusable element inside the modal.`],examples:[{input:`document.querySelector("dialog").showModal()`,output:`Centered modal with backdrop overlay and focus trap`,explanation:`Native <dialog> renders in browser top layer with native Escape key handling.`}],edgeCases:["Closing on backdrop click: detect if click coordinates `(e.clientX, e.clientY)` fall outside the dialog bounding rectangle `dialog.getBoundingClientRect()`.",`Prevent background body scrolling when modal is open.`],optimalApproach:'Use `<dialog id="modal">` and open with `modal.showModal()`. Style the native `::backdrop` pseudo-element. Add a click handler on the dialog that checks if click was outside the rect to auto-close.',implementation:`<!-- Native Dialog Modal -->
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
<\/script>`,stepByStep:["Create semantic `<dialog>` element containing modal title, body, and action buttons.","Use `dialog.showModal()` to launch modal into the browser top layer.","Style `::backdrop` pseudo-element with `background-color` and `backdrop-filter`.","Add click event checking `getBoundingClientRect()` to close when clicking the outside overlay."],timeComplexity:`O(1)`,spaceComplexity:`O(1)`,commonMistakes:["Using `dialog.show()` instead of `dialog.showModal()`, which does not create a backdrop or focus trap.","Trying to implement complex manual focus trap JavaScript when the native `<dialog>` handles it automatically."],followUps:[`How does the browser Top Layer interact with z-index stacking contexts?`]},{id:`css-skeleton-shimmer`,title:`CSS Skeleton Loader with Shimmer Animation`,difficulty:`Beginner`,category:`CSS`,tags:[`CSS`,`Animations`,`Performance`,`UX`,`Skeleton`],problem:`Design a reusable, high-performance CSS Skeleton loading component with a smooth diagonal linear-gradient shimmer effect. The skeleton must adapt flexibly to avatar circles, heading lines, and body paragraphs without hardcoded dimensions.`,requirements:["Use pure CSS keyframe animations with `linear-gradient` shimmer wave.","Support `.skeleton-circle` (for avatars), `.skeleton-text` (for paragraphs), and `.skeleton-card`.",`Hardware accelerated 60fps smooth animation with infinite loop.`,"Respect `prefers-reduced-motion` by displaying a soft static pulse instead of high-frequency shimmer.",`Support seamless Dark and Light themes via CSS variables.`],examples:[{input:`<div class="skeleton skeleton-circle"></div><div class="skeleton skeleton-text"></div>`,output:`Smooth silver-wave shimmering placeholder card`,explanation:`Uses background-size: 200% 100% and keyframes animating background-position-x.`}],edgeCases:[`Multiple skeletons on page: keep gradient angles and timing synced to avoid visual chaos.`,'Accessibility: mark with `aria-hidden="true"` or `aria-busy="true"` on parent.'],optimalApproach:"Use `background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)` with `background-size: 200% 100%` and animate `background-position-x: -200%` to `200%` over 1.5s.",implementation:`<!-- Skeleton Loader Card -->
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
</style>`,stepByStep:["Define `.skeleton` with a 3-stop `linear-gradient` (base color, lighter highlight, base color).","Set `background-size: 200% 100%` so the highlight wave can translate across.","Create keyframe `shimmer` translating `background-position-x` from `200%` to `-200%`.","Create utility shapes: `.skeleton-avatar` (50% border radius), `.skeleton-title`, and `.skeleton-line`."],timeComplexity:`O(1) GPU rendering`,spaceComplexity:`O(1)`,commonMistakes:["Animating `opacity` repeatedly instead of gradient position, which can look flashing and jarring.","Forgetting `background-size: 200% 100%`, which prevents the gradient from shifting smoothly."],followUps:[`How does skeleton rendering improve perceived performance (FCP/LCP) over a spinner icon?`]},{id:`coding-json-serializer`,title:`Implement JSON.stringify`,difficulty:`Advanced`,category:`Coding`,tags:[`serialization`,`recursion`,`type-checking`,`edge-cases`,`json`],problem:`Implement a custom version of JSON.stringify that converts a JavaScript value into a JSON-formatted string. Your implementation must handle all primitive types (strings, numbers, booleans, null), as well as complex types like nested objects and arrays.

The function should correctly handle edge cases such as undefined values (omitted from objects, converted to null in arrays), function values (treated the same as undefined), special number values like NaN and Infinity (converted to null), and Date objects (converted via toISOString). The behavior should match the native JSON.stringify as closely as possible.

This is a classic interview problem that tests your understanding of JavaScript type coercion, recursion, and the JSON specification. A production-quality solution should also handle circular references gracefully rather than throwing a stack overflow.`,requirements:[`Handle primitive types: string, number, boolean, null`,`Handle arrays with recursive serialization of elements`,`Handle plain objects with recursive serialization of values`,`Convert undefined and function values to null inside arrays`,`Omit keys with undefined or function values in objects`,`Convert NaN and Infinity to null`,`Handle Date objects by calling toISOString()`,`Properly escape special characters in strings`,`Handle nested structures of arbitrary depth`],examples:[{input:`jsonStringify({ a: 1, b: "hello", c: true })`,output:`'{"a":1,"b":"hello","c":true}'`,explanation:`Object with primitives is serialized with quoted keys and appropriate value formatting.`},{input:`jsonStringify([1, "two", null, undefined, true])`,output:`'[1,"two",null,null,true]'`,explanation:`Arrays serialize each element; undefined becomes null in array context.`},{input:`jsonStringify({ a: undefined, b: function(){}, c: 42 })`,output:`'{"c":42}'`,explanation:`Keys with undefined or function values are omitted from the output.`}],edgeCases:[`NaN and Infinity should serialize as null`,`Nested objects and arrays of arbitrary depth`,`Empty objects {} and empty arrays []`,`Strings containing quotes, backslashes, and control characters`,`Date objects should use toISOString()`],naiveApproach:`A naive approach is to use typeof checks and simple string concatenation. You start by checking the type of the input, handle primitives directly, then iterate over arrays and objects. The main issue with the naive approach is forgetting edge cases like NaN, Infinity, undefined in different contexts (array vs object), and special characters in strings. Without careful handling, the output will diverge from the real JSON.stringify behavior.`,optimalApproach:`The optimal approach uses a single recursive function with a clear type-dispatch pattern. First, handle the null case (since typeof null === 'object'). Then dispatch on typeof: strings get wrapped in quotes with special-character escaping, numbers check for NaN/Infinity and convert to 'null', booleans convert directly to string.

For objects, check if the value is a Date (use toISOString), an Array (map elements recursively, converting undefined/function to null), or a plain object (iterate keys, skip undefined/function values, recursively serialize the rest). This clean dispatch avoids bugs and handles all edge cases in a maintainable way. Each branch is independent and easy to test.`,implementation:`function jsonStringify(value) {
  if (value === null) {
    return 'null';
  }

  const type = typeof value;

  if (type === 'undefined' || type === 'function' || type === 'symbol') {
    return undefined;
  }

  if (type === 'boolean') {
    return value.toString();
  }

  if (type === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'null';
    }
    return value.toString();
  }

  if (type === 'string') {
    return '"' + value
      .replace(/\\\\/g, '\\\\\\\\')
      .replace(/"/g, '\\\\"')
      .replace(/\\n/g, '\\\\n')
      .replace(/\\r/g, '\\\\r')
      .replace(/\\t/g, '\\\\t') + '"';
  }

  if (type === 'bigint') {
    throw new TypeError('BigInt value can\\'t be serialized in JSON');
  }

  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }

  if (Array.isArray(value)) {
    const items = value.map(item => {
      const serialized = jsonStringify(item);
      return serialized === undefined ? 'null' : serialized;
    });
    return '[' + items.join(',') + ']';
  }

  if (type === 'object') {
    const pairs = [];
    const keys = Object.keys(value);
    for (const key of keys) {
      const serialized = jsonStringify(value[key]);
      if (serialized !== undefined) {
        pairs.push('"' + key + '":' + serialized);
      }
    }
    return '{' + pairs.join(',') + '}';
  }

  return undefined;
}

// Usage
console.log(jsonStringify({ a: 1, b: "hello" }));
// '{"a":1,"b":"hello"}'

console.log(jsonStringify([1, null, undefined, true]));
// '[1,null,null,true]'

console.log(jsonStringify({ fn: function(){}, val: 42 }));
// '{"val":42}'`,implementationTS:`function jsonStringify(value: unknown): string | undefined {
  if (value === null) {
    return 'null';
  }

  const type = typeof value;

  if (type === 'undefined' || type === 'function' || type === 'symbol') {
    return undefined;
  }

  if (type === 'boolean') {
    return (value as boolean).toString();
  }

  if (type === 'number') {
    const num = value as number;
    if (Number.isNaN(num) || !Number.isFinite(num)) {
      return 'null';
    }
    return num.toString();
  }

  if (type === 'string') {
    return '"' + (value as string)
      .replace(/\\\\/g, '\\\\\\\\')
      .replace(/"/g, '\\\\"')
      .replace(/\\n/g, '\\\\n')
      .replace(/\\r/g, '\\\\r')
      .replace(/\\t/g, '\\\\t') + '"';
  }

  if (type === 'bigint') {
    throw new TypeError('BigInt value can\\'t be serialized in JSON');
  }

  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }

  if (Array.isArray(value)) {
    const items: string[] = value.map((item: unknown) => {
      const serialized = jsonStringify(item);
      return serialized === undefined ? 'null' : serialized;
    });
    return '[' + items.join(',') + ']';
  }

  if (type === 'object') {
    const pairs: string[] = [];
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    for (const key of keys) {
      const serialized = jsonStringify(obj[key]);
      if (serialized !== undefined) {
        pairs.push('"' + key + '":' + serialized);
      }
    }
    return '{' + pairs.join(',') + '}';
  }

  return undefined;
}`,theoryAndConcepts:`WHAT IS JSON SERIALIZATION?
---------------------------
JSON (JavaScript Object Notation) serialization is the process of converting
a JavaScript value (object, array, primitive) into a JSON-formatted string.

WHY IS IT IMPORTANT?
--------------------
1. Sending data over network (APIs)
2. Storing data in localStorage/sessionStorage
3. Deep cloning objects (simple cases)
4. Logging complex objects

NATIVE METHOD: JSON.stringify()
--------------------------------
JavaScript has built-in JSON.stringify(), but understanding how it works
internally is crucial for interviews and edge case handling.`,beginnerApproach:`Beginner: Handle basic types only
- strings, numbers, booleans, null, arrays, simple objects`,beginnerImplementation:`function jsonStringifyBeginner(value) {
  // Handle null
  if (value === null) {
    return 'null';
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  // Handle number
  if (typeof value === 'number') {
    return String(value);
  }
  
  // Handle string - wrap in quotes
  if (typeof value === 'string') {
    return '"' + value + '"';
  }
  
  // Handle array
  if (Array.isArray(value)) {
    const items = value.map(item => jsonStringifyBeginner(item));
    return '[' + items.join(',') + ']';
  }
  
  // Handle object
  if (typeof value === 'object') {
    const pairs = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        pairs.push('"' + key + '":' + jsonStringifyBeginner(value[key]));
      }
    }
    return '{' + pairs.join(',') + '}';
  }
  
  return undefined;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL TESTS ===');
console.log(jsonStringifyBeginner(null));              // null
console.log(jsonStringifyBeginner(true));              // true
console.log(jsonStringifyBeginner(42));                // 42
console.log(jsonStringifyBeginner('hello'));           // "hello"
console.log(jsonStringifyBeginner([1, 2, 3]));         // [1,2,3]
console.log(jsonStringifyBeginner({ a: 1, b: 2 }));    // {"a":1,"b":2}`,intermediateApproach:`Intermediate: Handle special cases
- undefined, functions, NaN, Infinity
- String escaping
- Date objects`,intermediateImplementation:`function jsonStringifyIntermediate(value) {
  // Handle null
  if (value === null) {
    return 'null';
  }
  
  // Handle undefined - returns undefined (will be omitted)
  if (value === undefined) {
    return undefined;
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  // Handle number - special cases for NaN and Infinity
  if (typeof value === 'number') {
    // NaN and Infinity become null in JSON
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'null';
    }
    return String(value);
  }
  
  // Handle string with escape characters
  if (typeof value === 'string') {
    return '"' + escapeString(value) + '"';
  }
  
  // Handle function - returns undefined
  if (typeof value === 'function') {
    return undefined;
  }
  
  // Handle Symbol - returns undefined
  if (typeof value === 'symbol') {
    return undefined;
  }
  
  // Handle Date
  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }
  
  // Handle array
  if (Array.isArray(value)) {
    const items = value.map(item => {
      const result = jsonStringifyIntermediate(item);
      // undefined, function, symbol in arrays become null
      return result === undefined ? 'null' : result;
    });
    return '[' + items.join(',') + ']';
  }
  
  // Handle object
  if (typeof value === 'object') {
    const pairs = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const serializedValue = jsonStringifyIntermediate(value[key]);
        // Skip undefined, function, symbol values in objects
        if (serializedValue !== undefined) {
          pairs.push('"' + escapeString(key) + '":' + serializedValue);
        }
      }
    }
    return '{' + pairs.join(',') + '}';
  }
  
  return undefined;
}

// Helper: Escape special characters in strings
function escapeString(str) {
  const escapeMap = {
    '"': '\\\\"',      // Quote
    '\\\\': '\\\\\\\\',    // Backslash
    '\\n': '\\\\n',     // Newline
    '\\r': '\\\\r',     // Carriage return
    '\\t': '\\\\t',     // Tab
    '\\b': '\\\\b',     // Backspace
    '\\f': '\\\\f'      // Form feed
  };
  
  let result = '';
  for (const char of str) {
    result += escapeMap[char] || char;
  }
  return result;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL TESTS ===');
console.log(jsonStringifyIntermediate(undefined));           // undefined
console.log(jsonStringifyIntermediate(NaN));                 // null
console.log(jsonStringifyIntermediate(Infinity));            // null
console.log(jsonStringifyIntermediate(new Date('2024-01-01'))); // "2024-01-01T00:00:00.000Z"
console.log(jsonStringifyIntermediate('hello\\nworld'));      // "hello\\nworld"
console.log(jsonStringifyIntermediate({ a: undefined, b: 1 })); // {"b":1}
console.log(jsonStringifyIntermediate([1, undefined, 3]));   // [1,null,3]
console.log(jsonStringifyIntermediate({ fn: () => {} }));    // {}`,expertApproach:`Expert: Full implementation with all edge cases
- BigInt handling
- toJSON() method support
- Replacer function (like JSON.stringify)
- Space parameter for formatting
- Circular reference detection`,expertImplementation:`function jsonStringifyExpert(value, replacer = null, space = 0) {
  // Track seen objects for circular reference detection
  const seen = new WeakSet();
  
  // Normalize space parameter
  const indent = typeof space === 'number' 
    ? ' '.repeat(Math.min(space, 10)) 
    : (typeof space === 'string' ? space.slice(0, 10) : '');
  
  function serialize(val, currentIndent = '') {
    // Handle toJSON method
    if (val !== null && typeof val === 'object' && typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    
    // Handle null
    if (val === null) {
      return 'null';
    }
    
    // Handle undefined
    if (val === undefined) {
      return undefined;
    }
    
    // Handle boolean
    if (typeof val === 'boolean') {
      return val ? 'true' : 'false';
    }
    
    // Handle number
    if (typeof val === 'number') {
      if (Number.isNaN(val) || !Number.isFinite(val)) {
        return 'null';
      }
      return String(val);
    }
    
    // Handle BigInt - throws error like native JSON.stringify
    if (typeof val === 'bigint') {
      throw new TypeError('Do not know how to serialize a BigInt');
    }
    
    // Handle string
    if (typeof val === 'string') {
      return '"' + escapeStringExpert(val) + '"';
    }
    
    // Handle function and symbol
    if (typeof val === 'function' || typeof val === 'symbol') {
      return undefined;
    }
    
    // Handle Date (after toJSON check, but Date has toJSON)
    if (val instanceof Date) {
      return '"' + val.toISOString() + '"';
    }
    
    // Handle circular reference
    if (seen.has(val)) {
      throw new TypeError('Converting circular structure to JSON');
    }
    seen.add(val);
    
    // Handle array
    if (Array.isArray(val)) {
      if (val.length === 0) {
        seen.delete(val);
        return '[]';
      }
      
      const nextIndent = currentIndent + indent;
      const items = val.map(item => {
        const result = serialize(item, nextIndent);
        return result === undefined ? 'null' : result;
      });
      
      seen.delete(val);
      
      if (indent) {
        return '[\\n' + nextIndent + items.join(',\\n' + nextIndent) + '\\n' + currentIndent + ']';
      }
      return '[' + items.join(',') + ']';
    }
    
    // Handle object
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      
      // Apply replacer if it's an array (filter keys)
      const filteredKeys = Array.isArray(replacer) 
        ? keys.filter(k => replacer.includes(k))
        : keys;
      
      if (filteredKeys.length === 0) {
        seen.delete(val);
        return '{}';
      }
      
      const nextIndent = currentIndent + indent;
      const pairs = [];
      
      for (const key of filteredKeys) {
        let serializedValue;
        
        // Apply replacer function
        if (typeof replacer === 'function') {
          const replaced = replacer(key, val[key]);
          serializedValue = serialize(replaced, nextIndent);
        } else {
          serializedValue = serialize(val[key], nextIndent);
        }
        
        if (serializedValue !== undefined) {
          const serializedKey = '"' + escapeStringExpert(key) + '"';
          if (indent) {
            pairs.push(serializedKey + ': ' + serializedValue);
          } else {
            pairs.push(serializedKey + ':' + serializedValue);
          }
        }
      }
      
      seen.delete(val);
      
      if (pairs.length === 0) {
        return '{}';
      }
      
      if (indent) {
        return '{\\n' + nextIndent + pairs.join(',\\n' + nextIndent) + '\\n' + currentIndent + '}';
      }
      return '{' + pairs.join(',') + '}';
    }
    
    return undefined;
  }
  
  // Apply replacer to root value if function
  let rootValue = value;
  if (typeof replacer === 'function') {
    rootValue = replacer('', value);
  }
  
  return serialize(rootValue);
}

// Expert string escaping with unicode support
function escapeStringExpert(str) {
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = str.charCodeAt(i);
    
    switch (char) {
      case '"':  result += '\\\\"'; break;
      case '\\\\': result += '\\\\\\\\'; break;
      case '\\n': result += '\\\\n'; break;
      case '\\r': result += '\\\\r'; break;
      case '\\t': result += '\\\\t'; break;
      case '\\b': result += '\\\\b'; break;
      case '\\f': result += '\\\\f'; break;
      default:
        // Escape control characters (0x00-0x1F)
        if (code < 0x20) {
          result += '\\\\u' + code.toString(16).padStart(4, '0');
        } else {
          result += char;
        }
    }
  }
  
  return result;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL TESTS ===');

// Basic test
console.log(jsonStringifyExpert({ a: 1, b: 'hello' }));

// With formatting (space = 2)
console.log(jsonStringifyExpert({ a: 1, b: { c: 2 } }, null, 2));

// With replacer function
console.log(jsonStringifyExpert(
  { a: 1, b: 2, c: 3 },
  (key, value) => typeof value === 'number' ? value * 2 : value
));

// With replacer array (filter keys)
console.log(jsonStringifyExpert({ a: 1, b: 2, c: 3 }, ['a', 'c']));

// toJSON support
const objWithToJSON = {
  data: 'secret',
  toJSON() {
    return { data: 'redacted' };
  }
};
console.log(jsonStringifyExpert(objWithToJSON));

// Circular reference detection
try {
  const circular = { a: 1 };
  circular.self = circular;
  jsonStringifyExpert(circular);
} catch (e) {
  console.log('Circular reference error:', e.message);
}

// BigInt error
try {
  jsonStringifyExpert({ big: BigInt(123) });
} catch (e) {
  console.log('BigInt error:', e.message);
}`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Empty values`,`console.log('Empty object:', jsonStringifyExpert({}));           // {}`,`console.log('Empty array:', jsonStringifyExpert([]));            // []`,`console.log('Empty string:', jsonStringifyExpert(''));           // ""`,`EDGE CASE 2: Nested structures`,`console.log('Deeply nested:', jsonStringifyExpert({ a: { b: { c: { d: 1 } } } }));`,`EDGE CASE 3: Mixed array types`],practiceExercises:[`EXERCISE 1: Implement JSON.parse (reverse of stringify)`,`EXERCISE 2: Add support for Map and Set (convert to array)`,`EXERCISE 3: Implement pretty-print with custom indentation`,`EXERCISE 4: Add support for comments in JSON (non-standard)`,`EXERCISE 5: Handle very deep nesting without stack overflow`],stepByStep:[`Check if the value is null — return the string "null" immediately.`,`Use typeof to dispatch: handle undefined, function, symbol by returning undefined.`,`For booleans, return the string representation directly.`,`For numbers, check for NaN and Infinity, returning "null" for those; otherwise return the string form.`,`For strings, wrap in quotes and escape special characters (backslash, quotes, newlines, tabs).`,`For Date instances, return the quoted ISO string.`,`For arrays, map each element through the function recursively, replacing undefined results with "null", and join with commas.`,`For plain objects, iterate keys, skip those whose serialized value is undefined, and build key-value pairs.`,`Return the composed string for objects/arrays wrapped in the appropriate brackets.`],timeComplexity:`O(n) where n is the total number of values in the structure (each value is visited exactly once).`,spaceComplexity:`O(d) where d is the maximum nesting depth (recursion stack), plus O(n) for the output string.`,commonMistakes:[`Forgetting that typeof null === "object" and not handling null before the object branch`,`Not converting undefined/functions to null inside arrays while omitting them in objects`,`Missing string escaping for backslashes, quotes, and control characters`,`Not handling NaN and Infinity as special number cases`],followUps:[`How would you add circular reference detection? (Hint: use a Set or WeakSet)`,`How would you implement the replacer parameter that JSON.stringify accepts?`,`How would you implement the space/indentation parameter for pretty-printing?`]},{id:`coding-currying`,title:`Implement Function Currying`,difficulty:`Advanced`,category:`Coding`,tags:[`currying`,`closures`,`higher-order-functions`,`functional-programming`,`recursion`],problem:`Implement a curry function that transforms a function so it can be called with any combination of arguments. For example, if the original function takes three arguments, the curried version can be called as f(1)(2)(3), f(1, 2)(3), f(1)(2, 3), or f(1, 2, 3) — all producing the same result.

The key challenge is handling variable-length argument lists. Unlike simple currying where each call provides exactly one argument, your implementation must accumulate arguments across multiple calls and invoke the original function only when enough arguments have been collected.

This is a frequently asked interview question that tests understanding of closures, the arguments object (or rest parameters), Function.length, and recursive higher-order function patterns.`,requirements:[`Accept a function and return a curried version`,`Support partial application with any number of arguments per call`,`Invoke the original function when sufficient arguments are collected`,`Preserve the original function's behavior and return value`,`Handle functions with zero arguments correctly`,`Support chaining of arbitrary depth: curry(fn)(a)(b)(c) and curry(fn)(a, b, c)`],examples:[{input:`const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3)`,output:`6`,explanation:`Each call provides one argument; the original function is called when all three are collected.`},{input:`const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1, 2)(3)`,output:`6`,explanation:`First call provides two arguments, second provides the remaining one.`},{input:`const multiply = (a, b, c, d) => a * b * c * d;
const cm = curry(multiply);
cm(2)(3)(4)(5)`,output:`120`,explanation:`Works with functions of any arity, collecting args until fn.length is reached.`}],edgeCases:[`Function with zero parameters (should invoke immediately)`,`Providing more arguments than the function expects`,`Calling with no arguments (should return a function waiting for args)`,`Functions that use default parameters (fn.length doesn't count defaults)`],naiveApproach:`A naive approach might use a fixed number of nested closures matching the arity. For example, for a 3-argument function, you'd return a => b => c => fn(a, b, c). This fails for variable arity and doesn't support passing multiple arguments at once. You'd need a different wrapper for every function length, making it impractical.`,optimalApproach:`The optimal approach uses a recursive helper that accumulates arguments in a closure. The curry function reads fn.length to know how many arguments are needed. It returns a new function that collects arguments via rest parameters and concatenates them with previously accumulated args. If the total collected args meet or exceed fn.length, call the original function with all args. Otherwise, recursively return another curried function that remembers the accumulated args.

This recursive pattern naturally handles all calling styles because each returned function is itself a curry-wrapper that checks the accumulated count. The closure captures the accumulated args array, so no external state is needed. The recursion terminates when enough arguments are gathered, at which point the original function is invoked.`,implementation:`function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Usage examples
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));       // 6
console.log(curriedSum(1, 2)(3));       // 6
console.log(curriedSum(1)(2, 3));       // 6
console.log(curriedSum(1, 2, 3));       // 6

const multiply = (a, b, c, d) => a * b * c * d;
const curriedMul = curry(multiply);

console.log(curriedMul(2)(3)(4)(5));    // 120
console.log(curriedMul(2, 3)(4, 5));    // 120

// Partial application reuse
const add10 = curriedSum(10);
console.log(add10(20)(30));             // 60
console.log(add10(5, 5));              // 20`,implementationTS:`function curry<T extends (...args: any[]) => any>(fn: T): Function {
  return function curried(this: unknown, ...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (this: unknown, ...nextArgs: unknown[]): unknown {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const sum = (a: number, b: number, c: number): number => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));       // 6
console.log(curriedSum(1, 2)(3));       // 6
console.log(curriedSum(1)(2, 3));       // 6`,theoryAndConcepts:`WHAT IS CURRYING?
-----------------
Currying is a technique where a function with multiple arguments is transformed
into a sequence of functions, each taking a single argument.

Original: f(a, b, c)
Curried:  f(a)(b)(c)

WHY USE CURRYING?
-----------------
1. Partial Application - Pre-fill some arguments
2. Function Composition - Build complex functions from simple ones
3. Reusability - Create specialized functions from general ones
4. Lazy Evaluation - Delay computation until all arguments are provided

CURRYING VS PARTIAL APPLICATION:
---------------------------------
- Currying: Always produces single-argument functions
- Partial Application: Can fix any number of arguments

REAL-WORLD EXAMPLES:
--------------------
1. Event handlers: onClick = curry(handleEvent)('click')
2. API calls: fetchUser = curry(fetch)(baseUrl)
3. Logging: logError = curry(log)('ERROR')`,beginnerApproach:`Beginner: Basic curry for fixed number of arguments
Transforms: add(a, b, c) => add(a)(b)(c)`,beginnerImplementation:`// Simple 2-argument curry
function curryTwo(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

// Simple 3-argument curry
function curryThree(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
}

// Test Beginner Level
console.log('\\n=== BEGINNER LEVEL ===');

const add2 = (a, b) => a + b;
const curriedAdd2 = curryTwo(add2);
console.log('curryTwo: add(2)(3) =', curriedAdd2(2)(3)); // 5

const add3 = (a, b, c) => a + b + c;
const curriedAdd3 = curryThree(add3);
console.log('curryThree: add(1)(2)(3) =', curriedAdd3(1)(2)(3)); // 6`,intermediateApproach:`Intermediate: Generic curry that works with any arity
Also supports partial application: curry(fn)(a, b)(c)`,intermediateImplementation:`function curry(fn) {
  // Return a curried version of the function
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);

console.log('curry(fn)(1)(2)(3) =', curriedSum(1)(2)(3));      // 6
console.log('curry(fn)(1, 2)(3) =', curriedSum(1, 2)(3));      // 6
console.log('curry(fn)(1)(2, 3) =', curriedSum(1)(2, 3));      // 6
console.log('curry(fn)(1, 2, 3) =', curriedSum(1, 2, 3));      // 6

// Real-world example: Creating specialized functions
const multiply = (a, b, c) => a * b * c;
const curriedMultiply = curry(multiply);
const double = curriedMultiply(2);
const quadruple = double(2);
console.log('quadruple(5) =', quadruple(5)); // 20`,expertApproach:`Expert Level 1: Infinite currying with valueOf/toString
No need for terminator - auto-converts when used in expression


Expert Level 2: Curry with placeholder support
Allows skipping arguments: curry(fn)(_, 2)(1) same as fn(1, 2)


Expert Level 3: Curry that preserves \`this\` context


Expert Level 4: Right curry (arguments from right to left)`,expertImplementation:`function sum(...args) {
  // Calculate total of all arguments
  const total = args.reduce((acc, val) => acc + val, 0);
  
  // Create the next function
  const fn = (...nextArgs) => {
    // If no arguments, return total
    if (nextArgs.length === 0) {
      return total;
    }
    // Otherwise, add to total and return new function
    return sum(total, ...nextArgs);
  };
  
  // These methods are called when JS needs to convert to primitive
  fn.valueOf = () => total;
  fn.toString = () => String(total);
  
  // Allow accessing value directly
  fn.value = total;
  
  return fn;
}

console.log('\\n=== EXPERT LEVEL: valueOf/toString ===');
console.log('sum(1, 2)(3)(4, 5, 6) + 0 =', sum(1, 2)(3)(4, 5, 6) + 0);  // 21
console.log('sum(1)(2)(3).value =', sum(1)(2)(3).value);                 // 6
console.log('\`Result: \${sum(1)(2)}\`  =', \`Result: \${sum(1)(2)}\`);        // "Result: 3"
console.log('sum(10)(20)() =', sum(10)(20)());                           // 30



const _ = Symbol('placeholder'); // Unique placeholder symbol

function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Check if we have enough non-placeholder arguments in required positions
    const complete = args.length >= fn.length && 
                     !args.slice(0, fn.length).includes(_);
    
    if (complete) {
      return fn.apply(this, args);
    }
    
    return function(...newArgs) {
      // Replace placeholders with new arguments
      const combined = args.map(arg => {
        if (arg === _ && newArgs.length > 0) {
          return newArgs.shift();
        }
        return arg;
      });
      
      // Add any remaining new arguments
      return curried.apply(this, combined.concat(newArgs));
    };
  };
}

console.log('\\n=== EXPERT LEVEL: Placeholder Curry ===');

const greet = (greeting, name, punctuation) => \`\${greeting}, \${name}\${punctuation}\`;
const curriedGreet = curryWithPlaceholder(greet);

console.log('Normal:', curriedGreet('Hello')('World')('!'));           // Hello, World!
console.log('With placeholder:', curriedGreet(_, 'World')('Hi')('?')); // Hi, World?

const sayHelloTo = curriedGreet('Hello', _, '!');
console.log('Specialized:', sayHelloTo('Alice'));                       // Hello, Alice!



function curryWithContext(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    // Use arrow function to preserve outer \`this\`
    const self = this;
    return function(...moreArgs) {
      return curried.apply(self, args.concat(moreArgs));
    };
  };
}

console.log('\\n=== EXPERT LEVEL: Context Preservation ===');

const obj = {
  multiplier: 10,
  multiply: curryWithContext(function(a, b) {
    return (a + b) * this.multiplier;
  })
};

console.log('With context:', obj.multiply(2)(3)); // 50 (2+3)*10



function curryRight(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args.reverse());
    }
    
    return function(...moreArgs) {
      return curried.apply(this, [...moreArgs, ...args]);
    };
  };
}

console.log('\\n=== EXPERT LEVEL: Right Curry ===');

const divide = (a, b) => a / b;
const curriedDivideRight = curryRight(divide);
const divideBy2 = curriedDivideRight(2);
console.log('10 / 2 =', divideBy2(10)); // 5 (10 / 2, not 2 / 10)`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Functions with no arguments`,`const noArgs = curry(() => 'no args');`,`console.log('No args function:', noArgs()); // 'no args'`,`EDGE CASE 2: Functions with rest parameters`,`fn.length is 0 for (...args) => {}`,`const withRest = (...args) => args.reduce((a, b) => a + b, 0);`,`console.log('Rest params - fn.length:', withRest.length); // 0`],practiceExercises:[`EXERCISE 1: Implement uncurry - reverse of curry`,`uncurry(curriedFn)(a, b, c) === fn(a, b, c)`,`EXERCISE 2: Implement pipe with currying`,`pipe(fn1, fn2, fn3)(x) === fn3(fn2(fn1(x)))`,`EXERCISE 3: Implement compose with currying`,`compose(fn1, fn2, fn3)(x) === fn1(fn2(fn3(x)))`,`EXERCISE 4: Implement a curried map function`,`map(fn)(array) === array.map(fn)`],stepByStep:[`Read fn.length to determine how many arguments the original function expects.`,`Return a new function (curried) that collects arguments via rest parameters.`,`Inside curried, check if collected args.length >= fn.length.`,`If enough args are collected, call fn.apply(this, args) to invoke the original function.`,`If not enough, return a new function that captures current args in its closure.`,`The new function concatenates its own args with the previously accumulated args and calls curried recursively.`,`This recursion continues until sufficient arguments are gathered.`],timeComplexity:`O(n) where n is the number of arguments (each call concatenates and checks the array).`,spaceComplexity:`O(n) for storing accumulated arguments in the closure chain.`,commonMistakes:[`Using fn.length without understanding it doesn't count rest params or default params`,"Not preserving the `this` context when invoking the original function",`Creating a new array copy each time instead of concatenating (leads to stale references)`,`Forgetting to handle the case where all arguments are passed at once`],followUps:[`How would you implement infinite currying where sum(1)(2)(3)() returns 6 (call with no args to finalize)?`,`How would you implement a placeholder-based curry that allows skipping arguments?`,`What is the difference between currying and partial application?`]},{id:`coding-deep-copy`,title:`Deep Copy with Circular Reference Handling`,difficulty:`Advanced`,category:`Coding`,tags:[`deep-clone`,`recursion`,`WeakMap`,`circular-references`,`data-structures`],problem:`Implement a deep copy function that creates a completely independent clone of any JavaScript value, including nested objects, arrays, Dates, RegExps, Maps, Sets, and most importantly — objects with circular references.

A shallow copy (Object.assign or spread) only copies the top-level properties, meaning nested objects still share references with the original. A true deep copy must recursively clone every nested structure so that modifying the clone never affects the original. The critical challenge is handling circular references: if an object references itself (directly or indirectly), a naive recursive clone will enter infinite recursion.

Your solution must use a WeakMap to track already-cloned objects. When a previously-seen object is encountered during traversal, return the already-created clone instead of recursing into it again. This breaks the cycle and correctly preserves the circular structure in the clone.`,requirements:[`Clone primitive values (string, number, boolean, null, undefined) by direct return`,`Deep clone nested objects preserving all enumerable properties`,`Deep clone arrays preserving order and nested structures`,`Handle circular references without infinite recursion using a WeakMap`,`Clone Date objects preserving the timestamp`,`Clone RegExp objects preserving pattern and flags`,`Clone Map and Set instances with deep-cloned entries`,`Preserve prototype chain of cloned objects`],examples:[{input:`const obj = { a: 1, b: { c: 2, d: [3, 4] } };
const clone = deepCopy(obj);
clone.b.c = 99;`,output:`obj.b.c is still 2 (original unaffected)`,explanation:`The nested object is independently cloned, so mutations to the clone do not affect the original.`},{input:`const obj = { name: "test" };
obj.self = obj;
const clone = deepCopy(obj);`,output:`clone.self === clone (circular ref preserved, no infinite loop)`,explanation:`The WeakMap detects the circular reference and returns the already-created clone object.`},{input:`const original = { date: new Date("2024-01-01"), regex: /abc/gi };
const clone = deepCopy(original);`,output:`clone.date instanceof Date === true, clone.regex instanceof RegExp === true`,explanation:`Special built-in objects are cloned using their constructors with the original values.`}],edgeCases:[`Self-referencing objects (obj.self = obj)`,`Mutually referencing objects (a.ref = b; b.ref = a)`,`Nested arrays containing objects with circular refs`,`Date, RegExp, Map, Set instances inside deeply nested structures`,`Null and undefined values within nested objects`],naiveApproach:`The naive approach is JSON.parse(JSON.stringify(obj)). While simple, it fails on circular references (throws TypeError), loses Date objects (converts to strings), drops undefined and function values, and cannot handle RegExp, Map, or Set. It's only suitable for plain JSON-compatible data without cycles.`,optimalApproach:`The optimal approach uses a recursive function with a WeakMap parameter to cache cloned objects. At the start of each call, check if the value is a primitive (return directly) or already in the cache (return the cached clone to break cycles). For objects, create an empty clone first, store it in the cache immediately (before recursing into properties), then recursively clone each property.

Special types are handled with targeted constructors: new Date(original.getTime()) for dates, new RegExp(original.source, original.flags) for regexps. For Maps and Sets, create empty instances, cache them, then iterate and deep-clone each entry. Arrays are handled by creating a new array, caching it, and recursively cloning each element. This cache-before-recurse pattern is the key insight that makes circular reference handling work.`,implementation:`function deepCopy(value, cache = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    cache.set(value, mapClone);
    value.forEach((val, key) => {
      mapClone.set(deepCopy(key, cache), deepCopy(val, cache));
    });
    return mapClone;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    cache.set(value, setClone);
    value.forEach((val) => {
      setClone.add(deepCopy(val, cache));
    });
    return setClone;
  }

  const clone = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));

  cache.set(value, clone);

  const keys = [...Object.keys(value), ...Object.getOwnPropertySymbols(value)];
  for (const key of keys) {
    clone[key] = deepCopy(value[key], cache);
  }

  return clone;
}

// Usage
const original = { a: 1, b: { c: [2, 3] }, d: new Date() };
original.self = original;

const cloned = deepCopy(original);
console.log(cloned.b.c);          // [2, 3]
console.log(cloned.self === cloned); // true (circular ref preserved)
console.log(cloned.d instanceof Date); // true
cloned.b.c.push(4);
console.log(original.b.c);        // [2, 3] (original unaffected)`,implementationTS:`function deepCopy<T>(value: T, cache: WeakMap<object, unknown> = new WeakMap()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const obj = value as object;

  if (cache.has(obj)) {
    return cache.get(obj) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    cache.set(obj, mapClone);
    value.forEach((val, key) => {
      mapClone.set(deepCopy(key, cache), deepCopy(val, cache));
    });
    return mapClone as unknown as T;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    cache.set(obj, setClone);
    value.forEach((val) => {
      setClone.add(deepCopy(val, cache));
    });
    return setClone as unknown as T;
  }

  const clone: Record<string | symbol, unknown> = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(obj));

  cache.set(obj, clone);

  const keys: (string | symbol)[] = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
  for (const key of keys) {
    clone[key] = deepCopy((obj as Record<string | symbol, unknown>)[key], cache);
  }

  return clone as T;
}`,theoryAndConcepts:`SHALLOW COPY VS DEEP COPY:
--------------------------

SHALLOW COPY:
- Creates a new object
- Copies only the first level properties
- Nested objects share the same reference
- Methods: Object.assign(), spread operator {...}

DEEP COPY:
- Creates a completely independent copy
- All nested objects are also cloned
- No shared references
- Methods: JSON.parse(JSON.stringify()), structuredClone(), custom function

VISUAL EXAMPLE:
---------------
Original: { a: 1, b: { c: 2 } }

Shallow Copy:
- new.a = 1 (copied)
- new.b === original.b (SAME reference)

Deep Copy:
- new.a = 1 (copied)
- new.b !== original.b (DIFFERENT reference)
- new.b.c = 2 (copied)



CIRCULAR REFERENCE:
-------------------
When an object references itself directly or through a chain:

Direct:   obj.self = obj
Indirect: obj.a.b.parent = obj

Without handling, this causes infinite recursion!



COMMON APPROACHES:
------------------
1. JSON.parse(JSON.stringify(obj))
   - Simple but limited
   - Loses: functions, undefined, Symbols, Date (becomes string), RegExp, Map, Set
   - Throws on circular references

2. structuredClone(obj) - Modern browsers
   - Handles most cases
   - Handles circular references
   - Still loses: functions, DOM elements

3. Custom recursive function with WeakMap
   - Full control
   - Can handle any type
   - Can handle circular references`,beginnerApproach:`Beginner: Simple deep copy using JSON
Limitations: No functions, undefined, circular refs`,beginnerImplementation:`function deepCopyBeginner(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const simpleObj = { a: 1, b: { c: 2 } };
const copiedSimple = deepCopyBeginner(simpleObj);

console.log('Original:', simpleObj);
console.log('Copy:', copiedSimple);
console.log('Are equal?', JSON.stringify(simpleObj) === JSON.stringify(copiedSimple)); // true
console.log('Same reference?', simpleObj === copiedSimple); // false
console.log('Nested same ref?', simpleObj.b === copiedSimple.b); // false

// Show limitations
console.log('\\n--- BEGINNER LIMITATIONS ---');
const objWithFunction = { fn: () => 'hello', value: 1 };
console.log('With function:', deepCopyBeginner(objWithFunction)); // { value: 1 } - function lost!

const objWithUndefined = { a: undefined, b: 1 };
console.log('With undefined:', deepCopyBeginner(objWithUndefined)); // { b: 1 } - undefined lost!

const objWithDate = { date: new Date() };
console.log('With Date:', deepCopyBeginner(objWithDate)); // date becomes string!`,intermediateApproach:`Intermediate: Handle special types + circular references
- Date, RegExp
- Arrays
- Circular reference detection with WeakMap`,intermediateImplementation:`function deepCopyIntermediate(obj, seen = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArray = [];
    seen.set(obj, clonedArray); // Store before recursion to handle circular refs
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepCopyIntermediate(obj[i], seen);
    }
    return clonedArray;
  }
  
  // Handle Object
  const clonedObj = {};
  seen.set(obj, clonedObj); // Store before recursion
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepCopyIntermediate(obj[key], seen);
    }
  }
  
  return clonedObj;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// Test Date
const objWithDateInt = { date: new Date('2024-01-15'), value: 42 };
const copiedDate = deepCopyIntermediate(objWithDateInt);
console.log('Date preserved:', copiedDate.date instanceof Date); // true
console.log('Date value:', copiedDate.date.toISOString());

// Test RegExp
const objWithRegex = { pattern: /test/gi, name: 'regex test' };
const copiedRegex = deepCopyIntermediate(objWithRegex);
console.log('RegExp preserved:', copiedRegex.pattern instanceof RegExp); // true
console.log('RegExp flags:', copiedRegex.pattern.flags); // 'gi'

// Test Circular Reference
console.log('\\n--- CIRCULAR REFERENCE TEST ---');
const circularObj = { a: 1, b: { c: 2 } };
circularObj.self = circularObj;           // Direct circular
circularObj.b.parent = circularObj;       // Indirect circular

const copiedCircular = deepCopyIntermediate(circularObj);
console.log('Circular handled:', copiedCircular.self === copiedCircular); // true
console.log('Nested circular:', copiedCircular.b.parent === copiedCircular); // true
console.log('Original not affected:', circularObj !== copiedCircular); // true`,expertApproach:`Expert: Full implementation handling ALL types
- Map, Set
- TypedArrays (ArrayBuffer, Uint8Array, etc.)
- Symbol keys
- Property descriptors (getters/setters, non-enumerable)
- Prototype chain
- Functions (by reference - cannot truly clone)`,expertImplementation:`function deepCopyExpert(obj, seen = new WeakMap()) {
  // Handle primitives and null
  if (obj === null) return null;
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return obj;
  }
  
  // Handle functions (return reference - can't truly clone)
  if (typeof obj === 'function') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    seen.set(obj, clonedMap);
    
    obj.forEach((value, key) => {
      // Clone both key and value (keys can be objects too!)
      clonedMap.set(
        deepCopyExpert(key, seen),
        deepCopyExpert(value, seen)
      );
    });
    return clonedMap;
  }
  
  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    seen.set(obj, clonedSet);
    
    obj.forEach(value => {
      clonedSet.add(deepCopyExpert(value, seen));
    });
    return clonedSet;
  }
  
  // Handle ArrayBuffer
  if (obj instanceof ArrayBuffer) {
    const clonedBuffer = obj.slice(0);
    seen.set(obj, clonedBuffer);
    return clonedBuffer;
  }
  
  // Handle TypedArrays (Uint8Array, Int32Array, etc.)
  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const clonedTypedArray = new obj.constructor(
      deepCopyExpert(obj.buffer, seen),
      obj.byteOffset,
      obj.length
    );
    seen.set(obj, clonedTypedArray);
    return clonedTypedArray;
  }
  
  // Handle DataView
  if (obj instanceof DataView) {
    const clonedDataView = new DataView(
      deepCopyExpert(obj.buffer, seen),
      obj.byteOffset,
      obj.byteLength
    );
    seen.set(obj, clonedDataView);
    return clonedDataView;
  }
  
  // Handle Error objects
  if (obj instanceof Error) {
    const clonedError = new obj.constructor(obj.message);
    clonedError.stack = obj.stack;
    seen.set(obj, clonedError);
    return clonedError;
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArray = [];
    seen.set(obj, clonedArray);
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepCopyExpert(obj[i], seen);
    }
    return clonedArray;
  }
  
  // Handle plain objects and class instances
  // Preserve prototype chain
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, clonedObj);
  
  // Get all keys including Symbols
  const allKeys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj)
  ];
  
  for (const key of allKeys) {
    // Get property descriptor to preserve getters/setters
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    
    if (descriptor) {
      if ('value' in descriptor) {
        // Regular property with value
        descriptor.value = deepCopyExpert(descriptor.value, seen);
      }
      // Getter/setter are functions - keep as reference
      
      Object.defineProperty(clonedObj, key, descriptor);
    }
  }
  
  return clonedObj;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Test Map
console.log('--- Map Test ---');
const originalMap = new Map([
  ['key1', { nested: 'value1' }],
  [{ objKey: 1 }, 'objectKey']
]);
const clonedMap = deepCopyExpert(originalMap);
console.log('Map cloned:', clonedMap instanceof Map); // true
console.log('Map size:', clonedMap.size); // 2
console.log('Map value cloned:', clonedMap.get('key1') !== originalMap.get('key1')); // true

// Test Set
console.log('\\n--- Set Test ---');
const originalSet = new Set([1, { a: 2 }, [3, 4]]);
const clonedSet = deepCopyExpert(originalSet);
console.log('Set cloned:', clonedSet instanceof Set); // true
console.log('Set size:', clonedSet.size); // 3

// Test Symbol keys
console.log('\\n--- Symbol Keys Test ---');
const sym = Symbol('mySymbol');
const objWithSymbol = { [sym]: 'symbolValue', regular: 'regularValue' };
const clonedWithSymbol = deepCopyExpert(objWithSymbol);
console.log('Symbol preserved:', clonedWithSymbol[sym]); // 'symbolValue'

// Test class instance
console.log('\\n--- Class Instance Test ---');
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return \`Hello, \${this.name}\`;
  }
}
const person = new Person('John');
const clonedPerson = deepCopyExpert(person);
console.log('Prototype preserved:', clonedPerson instanceof Person); // true
console.log('Method works:', clonedPerson.greet()); // 'Hello, John'

// Test property descriptors
console.log('\\n--- Property Descriptors Test ---');
const objWithDescriptors = {};
Object.defineProperty(objWithDescriptors, 'readonly', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(objWithDescriptors, 'computed', {
  get() { return this._value * 2; },
  set(v) { this._value = v; },
  enumerable: true
});
objWithDescriptors._value = 10;

const clonedWithDescriptors = deepCopyExpert(objWithDescriptors);
console.log('Readonly preserved:', Object.getOwnPropertyDescriptor(clonedWithDescriptors, 'readonly').writable === false);
console.log('Getter works:', clonedWithDescriptors.computed); // 20

// Complex circular reference test
console.log('\\n--- Complex Circular Test ---');
const complexCircular = {
  a: 1,
  arr: [1, 2, 3],
  map: new Map(),
  set: new Set()
};
complexCircular.self = complexCircular;
complexCircular.arr.push(complexCircular);
complexCircular.map.set('circular', complexCircular);
complexCircular.set.add(complexCircular);

const clonedComplex = deepCopyExpert(complexCircular);
console.log('Direct circular:', clonedComplex.self === clonedComplex); // true
console.log('Array circular:', clonedComplex.arr[3] === clonedComplex); // true
console.log('Map circular:', clonedComplex.map.get('circular') === clonedComplex); // true`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: null vs undefined`,`console.log('null:', deepCopyExpert(null)); // null`,`console.log('undefined:', deepCopyExpert(undefined)); // undefined`,`EDGE CASE 2: Primitives`,`console.log('string:', deepCopyExpert('hello')); // 'hello'`,`console.log('number:', deepCopyExpert(42)); // 42`,`console.log('boolean:', deepCopyExpert(true)); // true`],practiceExercises:[`EXERCISE 1: Implement shallow copy for comparison`,`EXERCISE 2: Add option to exclude certain keys`,`EXERCISE 3: Add option to transform values during copy`,`EXERCISE 4: Implement copy with depth limit`,`EXERCISE 5: Add support for WeakMap and WeakSet`,`Exercise 1: Shallow copy for comparison`,`function shallowCopy(obj) {`,`if (Array.isArray(obj)) return [...obj];`],stepByStep:[`Check if the value is a primitive (null or non-object typeof) — return it directly.`,`Check the WeakMap cache — if the object was already cloned, return the cached clone.`,`Handle special built-in types: Date (new Date with same time), RegExp (new RegExp with source/flags).`,`Handle Map and Set: create empty instance, cache it, then iterate and deep-clone each entry.`,`For arrays and plain objects, create an empty clone ([] or Object.create(proto)).`,`Immediately store the empty clone in the WeakMap cache BEFORE recursing into properties.`,`Iterate all keys (including Symbols) and recursively deep-copy each value into the clone.`,`Return the fully populated clone.`],timeComplexity:`O(n) where n is the total number of properties/elements across all nested structures.`,spaceComplexity:`O(n) for the cloned structure plus O(d) recursion stack depth, plus O(n) for the WeakMap cache.`,commonMistakes:[`Not caching the clone BEFORE recursing — the clone must be in the cache before processing children to break cycles`,`Using a regular Map or object instead of WeakMap (prevents garbage collection of cloned objects)`,`Forgetting to handle Date, RegExp, Map, or Set (they need constructor-based cloning)`,`Using JSON.parse(JSON.stringify()) which fails on circular refs, Dates, and undefined`],followUps:[`How would you handle cloning of functions or class instances with methods?`,`What are the trade-offs of structuredClone() vs a manual deep copy?`,`How would you deep copy objects with non-enumerable or getter/setter properties?`]},{id:`coding-toc`,title:`Build Table of Contents from Headings`,difficulty:`Intermediate`,category:`Coding`,tags:[`DOM`,`tree`,`recursion`,`html-parsing`,`nested-structure`],problem:`Given a flat list of HTML heading elements (h1 through h6), build a nested tree structure representing a table of contents. Each heading has a level (1-6) and text content. The output should be a hierarchical tree where lower-level headings are nested as children of the nearest preceding higher-level heading.

For example, an h2 following an h1 should become a child of that h1. An h3 following an h2 should become a child of that h2. If heading levels are skipped (e.g., h1 followed directly by h3), the h3 still nests under the h1. The result should be an array of top-level nodes, each with an optional children array.

This problem tests your ability to convert a flat sequential structure into a tree — a common task in document processors, CMS platforms, and markdown renderers.`,requirements:[`Accept an array of heading objects with level (1-6) and text properties`,`Return a nested tree structure with children arrays`,`Properly nest headings based on their level hierarchy`,`Handle non-sequential heading levels (e.g., h1 directly to h3)`,`Support multiple top-level headings`,`Preserve the original order of headings`,`Handle empty input (return empty array)`],examples:[{input:`[{ level: 1, text: "Intro" }, { level: 2, text: "Background" }, { level: 2, text: "Goals" }, { level: 1, text: "Main" }]`,output:`[{ level: 1, text: "Intro", children: [{ level: 2, text: "Background", children: [] }, { level: 2, text: "Goals", children: [] }] }, { level: 1, text: "Main", children: [] }]`,explanation:`Two h2s nest under the first h1. The second h1 starts a new top-level section.`},{input:`[{ level: 1, text: "A" }, { level: 3, text: "B" }, { level: 2, text: "C" }]`,output:`[{ level: 1, text: "A", children: [{ level: 3, text: "B", children: [] }, { level: 2, text: "C", children: [] }] }]`,explanation:`Skipped level (h1 -> h3) still nests under h1. The h2 also nests under h1 since it has a higher level number.`},{input:`[]`,output:`[]`,explanation:`Empty input returns empty output.`}],edgeCases:[`All headings at the same level (flat list, no nesting)`,`Deeply nested headings (h1 > h2 > h3 > h4 > h5 > h6)`,`Skipped heading levels (h1 directly to h4)`,`Document starting with h3 instead of h1`,`Single heading in the array`],naiveApproach:`A naive approach might try to process headings in multiple passes — first finding all h1s, then for each h1 finding h2s between it and the next h1, and so on for each level. This is fragile, hard to maintain, and doesn't handle edge cases like skipped levels well. The code becomes deeply nested with level-specific logic that's hard to generalize.`,optimalApproach:`The optimal approach uses a stack-based algorithm in a single pass. Maintain a stack that tracks the current nesting path. For each heading, pop items from the stack until the top item has a smaller level number than the current heading (meaning the current heading should be a child of the stack top). Push the current heading as a child of the new stack top and add it to the stack.

A sentinel root node with level 0 simplifies the logic — it acts as a universal parent so you never have an empty stack. After processing all headings, the root's children array is the final tree. This runs in O(n) time since each heading is pushed and popped at most once, and handles all edge cases including skipped levels and non-h1 starting headings naturally.`,implementation:`function buildTableOfContents(headings) {
  const root = { level: 0, text: '', children: [] };
  const stack = [root];

  for (const heading of headings) {
    const node = {
      level: heading.level,
      text: heading.text,
      children: [],
    };

    while (stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
}

// Usage
const headings = [
  { level: 1, text: 'Introduction' },
  { level: 2, text: 'Background' },
  { level: 3, text: 'History' },
  { level: 3, text: 'Current State' },
  { level: 2, text: 'Objectives' },
  { level: 1, text: 'Methodology' },
  { level: 2, text: 'Data Collection' },
];

const toc = buildTableOfContents(headings);
console.log(JSON.stringify(toc, null, 2));
// [
//   { level: 1, text: "Introduction", children: [
//     { level: 2, text: "Background", children: [
//       { level: 3, text: "History", children: [] },
//       { level: 3, text: "Current State", children: [] }
//     ]},
//     { level: 2, text: "Objectives", children: [] }
//   ]},
//   { level: 1, text: "Methodology", children: [
//     { level: 2, text: "Data Collection", children: [] }
//   ]}
// ]`,implementationTS:`interface Heading {
  level: number;
  text: string;
}

interface TocNode {
  level: number;
  text: string;
  children: TocNode[];
}

function buildTableOfContents(headings: Heading[]): TocNode[] {
  const root: TocNode = { level: 0, text: '', children: [] };
  const stack: TocNode[] = [root];

  for (const heading of headings) {
    const node: TocNode = {
      level: heading.level,
      text: heading.text,
      children: [],
    };

    while (stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
}`,theoryAndConcepts:`WHAT IS A TABLE OF CONTENTS (TOC)?
----------------------------------
A navigation structure that lists document sections with links.
Usually built from heading elements (h1, h2, h3, h4, h5, h6).

WHY IS IT USEFUL?
-----------------
1. Easy navigation in long documents
2. SEO benefits (search engines understand structure)
3. Accessibility (screen readers can navigate)
4. User experience (quick overview of content)

KEY CONCEPTS:
-------------
1. Heading hierarchy: h1 > h2 > h3 > h4 > h5 > h6
2. Nested structure: h2 items under h1, h3 under h2, etc.
3. IDs for linking: Each heading needs an id attribute
4. Anchor links: <a href="#section-id">



DOM METHODS TO KNOW:
--------------------
- document.querySelectorAll('h1, h2, h3') - Get all headings
- element.textContent - Get text inside element
- element.id - Get/set id attribute
- element.tagName - Get tag name (H1, H2, etc.)`,beginnerApproach:`Beginner: Flat list of all headings (no nesting)
Returns simple array of heading info`,beginnerImplementation:`function tocBeginner(htmlString) {
  // Create a temporary container to parse HTML
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  
  // Get all heading elements
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Build flat list
  const toc = [];
  
  headings.forEach((heading, index) => {
    // Get or generate ID
    const id = heading.id || \`heading-\${index}\`;
    heading.id = id;
    
    toc.push({
      level: parseInt(heading.tagName[1]), // H1 -> 1, H2 -> 2, etc.
      text: heading.textContent.trim(),
      id: id
    });
  });
  
  return toc;
}

// Generate simple HTML list
function tocToHtmlBeginner(toc) {
  const items = toc.map(item => 
    \`<li><a href="#\${item.id}">\${item.text}</a></li>\`
  ).join('');
  
  return \`<ul>\${items}</ul>\`;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const sampleHtml = \`
  <h1>Introduction</h1>
  <p>Some text...</p>
  <h2>Getting Started</h2>
  <h3>Installation</h3>
  <h3>Configuration</h3>
  <h2>Advanced Topics</h2>
  <h3>Performance</h3>
  <h1>Conclusion</h1>
\`;

// Note: In Node.js, we need to simulate DOM
// In browser, this would work directly
if (typeof document !== 'undefined') {
  const flatToc = tocBeginner(sampleHtml);
  console.log('Flat TOC:', flatToc);
  console.log('HTML:', tocToHtmlBeginner(flatToc));
}`,intermediateApproach:`Intermediate: Nested structure based on heading levels
Produces proper hierarchy`,intermediateImplementation:`function tocIntermediate(htmlString) {
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Root of our tree
  const root = { items: [], level: 0 };
  
  // Stack to track current path
  const stack = [root];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent.trim();
    const id = heading.id || generateSlug(text, index);
    heading.id = id;
    
    const item = {
      level,
      text,
      id,
      items: [] // Children
    };
    
    // Find the correct parent
    // Pop until we find a parent with lower level
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    // Add to parent's items
    stack[stack.length - 1].items.push(item);
    
    // Push current item to stack (it can be parent of next items)
    stack.push(item);
  });
  
  return root.items;
}

// Helper: Generate URL-friendly slug from text
function generateSlug(text, index) {
  const slug = text
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '') // Remove special chars
    .replace(/\\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens
    .trim();
  
  return slug || \`heading-\${index}\`;
}

// Generate nested HTML list
function tocToHtmlIntermediate(items) {
  if (!items || items.length === 0) return '';
  
  const listItems = items.map(item => {
    const children = tocToHtmlIntermediate(item.items);
    return \`<li><a href="#\${item.id}">\${item.text}</a>\${children}</li>\`;
  }).join('');
  
  return \`<ul>\${listItems}</ul>\`;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');
console.log('Nested structure (see implementation)');`,expertApproach:`Expert: Full-featured TOC generator
- Configurable heading levels
- Unique ID generation
- Numbering support
- Active state tracking
- Smooth scroll support`,expertImplementation:`class TableOfContents {
  constructor(options = {}) {
    this.options = {
      container: options.container || document.body,
      headings: options.headings || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      listType: options.listType || 'ul',  // 'ul' or 'ol'
      numbered: options.numbered || false,
      smoothScroll: options.smoothScroll ?? true,
      activeClass: options.activeClass || 'active',
      generateIds: options.generateIds ?? true,
      minLevel: options.minLevel || 1,
      maxLevel: options.maxLevel || 6,
      ...options
    };
    
    this.usedIds = new Set();
    this.tocElement = null;
    this.headingElements = [];
  }
  
  // Generate unique ID
  generateUniqueId(text) {
    let baseId = text
      .toLowerCase()
      .replace(/[^\\w\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'section';
    
    let id = baseId;
    let counter = 1;
    
    while (this.usedIds.has(id)) {
      id = \`\${baseId}-\${counter++}\`;
    }
    
    this.usedIds.add(id);
    return id;
  }
  
  // Parse headings from container
  parse() {
    const { container, headings, minLevel, maxLevel, generateIds } = this.options;
    
    const selector = headings
      .filter(h => {
        const level = parseInt(h[1]);
        return level >= minLevel && level <= maxLevel;
      })
      .join(', ');
    
    const elements = container.querySelectorAll(selector);
    
    const root = { items: [], level: 0 };
    const stack = [root];
    
    this.headingElements = [];
    
    elements.forEach(el => {
      const level = parseInt(el.tagName[1]);
      const text = el.textContent.trim();
      
      // Generate or get ID
      let id = el.id;
      if (!id && generateIds) {
        id = this.generateUniqueId(text);
        el.id = id;
      }
      
      this.headingElements.push({ el, id, level });
      
      const item = {
        level,
        text,
        id,
        element: el,
        items: []
      };
      
      // Find correct parent
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      stack[stack.length - 1].items.push(item);
      stack.push(item);
    });
    
    return root.items;
  }
  
  // Build HTML
  render(items = null, parentNumber = '') {
    items = items || this.parse();
    
    if (!items || items.length === 0) return '';
    
    const { listType, numbered, smoothScroll } = this.options;
    
    const listItems = items.map((item, index) => {
      const number = parentNumber 
        ? \`\${parentNumber}.\${index + 1}\` 
        : \`\${index + 1}\`;
      
      const prefix = numbered ? \`<span class="toc-number">\${number}</span> \` : '';
      
      const link = smoothScroll
        ? \`<a href="#\${item.id}" data-scroll-to="\${item.id}">\${prefix}\${item.text}</a>\`
        : \`<a href="#\${item.id}">\${prefix}\${item.text}</a>\`;
      
      const children = this.render(item.items, numbered ? number : '');
      
      return \`<li data-level="\${item.level}" data-id="\${item.id}">\${link}\${children}</li>\`;
    }).join('');
    
    return \`<\${listType} class="toc-list">\${listItems}</\${listType}>\`;
  }
  
  // Mount to DOM
  mount(targetElement) {
    const html = this.render();
    
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    targetElement.innerHTML = html;
    this.tocElement = targetElement;
    
    // Add click handlers for smooth scroll
    if (this.options.smoothScroll) {
      this.setupSmoothScroll();
    }
    
    // Setup intersection observer for active state
    this.setupActiveTracking();
    
    return this;
  }
  
  // Smooth scroll handler
  setupSmoothScroll() {
    this.tocElement.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-scroll-to]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.dataset.scrollTo;
      const target = document.getElementById(targetId);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update URL without jumping
        history.pushState(null, '', \`#\${targetId}\`);
      }
    });
  }
  
  // Track active section
  setupActiveTracking() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const { activeClass } = this.options;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = this.tocElement.querySelector(\`[data-id="\${id}"]\`);
          
          if (link) {
            if (entry.isIntersecting) {
              // Remove active from all
              this.tocElement.querySelectorAll(\`.\${activeClass}\`)
                .forEach(el => el.classList.remove(activeClass));
              
              // Add active to current
              link.classList.add(activeClass);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in top 30%
        threshold: 0
      }
    );
    
    this.headingElements.forEach(({ el }) => {
      observer.observe(el);
    });
    
    this.observer = observer;
  }
  
  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.tocElement) {
      this.tocElement.innerHTML = '';
    }
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');
console.log('Full TableOfContents class with:');
console.log('- Configurable heading levels');
console.log('- Unique ID generation');
console.log('- Numbering support');
console.log('- Smooth scroll');
console.log('- Active state tracking');`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Skipped heading levels`,`h1 -> h3 (skipping h2)`,`Solution: Still nest under nearest lower level`,"const skippedLevels = `<h1>Title</h1><h3>Subsection</h3>`;",`console.log('Skipped levels:', tocFromString(skippedLevels));`,`EDGE CASE 2: Headings with HTML inside`,`<h2><strong>Bold</strong> Title</h2>`],stepByStep:[`Create a sentinel root node with level 0 and an empty children array.`,`Initialize a stack containing only the root node.`,`For each heading in the input array, create a new tree node with an empty children array.`,`Pop elements from the stack while the top element's level is >= the current heading's level.`,`Append the new node to the children of the current stack top (which has a lower level).`,`Push the new node onto the stack so it can be a parent for subsequent deeper headings.`,`After processing all headings, return root.children as the final tree.`],timeComplexity:`O(n) — each heading is pushed and popped from the stack at most once.`,spaceComplexity:`O(n) for the output tree nodes, plus O(d) for the stack where d is the maximum heading depth (at most 6).`,commonMistakes:[`Not using a sentinel root node, leading to complex empty-stack handling`,`Using >= instead of > (or vice versa) in the stack-pop condition, causing incorrect nesting`,`Mutating the input heading objects instead of creating new tree nodes`,`Not handling skipped levels (e.g., assuming h2 always follows h1)`],followUps:[`How would you generate HTML (nested <ul><li>) from the resulting tree?`,`How would you extract headings from an actual HTML document string?`,`How would you add id anchors and scroll-to-heading functionality?`]},{id:`coding-memoize-multi`,title:`Memoize with Multiple Arguments`,difficulty:`Intermediate`,category:`Coding`,tags:[`memoization`,`caching`,`closures`,`performance`,`higher-order-functions`],problem:`Implement a memoize function that caches results of expensive function calls based on all arguments passed. When the memoized function is called again with the same set of arguments, it should return the cached result instead of re-executing the original function.

The main challenge is creating a reliable cache key from multiple arguments of varying types. A simple approach using JSON.stringify works for many cases but fails with argument ordering in objects or special values. A more robust approach uses a nested Map structure (trie) where each argument level creates a new Map branch.

This is a fundamental optimization technique used extensively in React (useMemo, React.memo), dynamic programming, and API response caching. Interviewers test this to evaluate your understanding of closures, cache invalidation trade-offs, and key-generation strategies.`,requirements:[`Accept a function and return a memoized version`,`Cache results based on all arguments passed to the function`,`Return cached results for identical argument sets`,`Handle any number of arguments (variadic)`,`Handle arguments of different types (primitives, objects, arrays)`,`Preserve the original function's return value and behavior`],examples:[{input:`const add = (a, b) => { console.log("computing"); return a + b; };
const memoAdd = memoize(add);
memoAdd(1, 2); // logs "computing", returns 3
memoAdd(1, 2);`,output:`3 (no "computing" logged the second time)`,explanation:`The second call with same args returns the cached result without executing the original function.`},{input:`const fn = memoize((x, y) => x * y);
fn(3, 4); // 12
fn(3, 5); // 15
fn(3, 4);`,output:`12 (from cache)`,explanation:`Different argument sets have independent cache entries. (3,4) and (3,5) are separate.`},{input:`const factorial = memoize((n) => n <= 1 ? 1 : n * factorial(n - 1));
factorial(5);`,output:`120`,explanation:`Memoization works with recursive functions, caching intermediate results.`}],edgeCases:[`Functions with zero arguments (always return cached result after first call)`,`Arguments that include null, undefined, NaN, 0, and -0`,`Object arguments where identity matters (same content but different references)`,`Very large number of unique argument combinations (memory considerations)`],naiveApproach:`The naive approach uses JSON.stringify on the arguments array to create a cache key. This is simple but has problems: it conflates different types that stringify the same way (undefined vs the string "undefined"), fails on circular references, ignores functions, and treats distinct objects with the same properties as identical. It also has performance overhead from serialization on every call.`,optimalApproach:`The optimal approach uses a nested Map structure (sometimes called a trie or map-tree). The idea is to use each argument as a key in a chain of Maps. For memoize(fn) called as fn(a, b, c), we navigate cache.get(a).get(b).get(c) to find the result. If any level doesn't exist, we create a new Map at that level.

This handles all argument types correctly because Map uses SameValueZero equality, which works for primitives and uses reference equality for objects. A special sentinel key marks the "leaf" entry that holds the cached result. This approach avoids serialization entirely and naturally handles any argument type.

For simpler use cases where arguments are always primitives, the JSON.stringify approach as a key into a plain object is perfectly adequate and more readable. The Map-trie is best when you need to handle object arguments by reference.`,implementation:`function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    let currentLevel = cache;

    for (const arg of args) {
      if (!currentLevel.has(arg)) {
        currentLevel.set(arg, new Map());
      }
      currentLevel = currentLevel.get(arg);
    }

    const RESULT_KEY = Symbol.for('memoize_result');

    if (currentLevel.has(RESULT_KEY)) {
      return currentLevel.get(RESULT_KEY);
    }

    const result = fn.apply(this, args);
    currentLevel.set(RESULT_KEY, result);
    return result;
  };
}

// Usage
const expensiveCalc = (a, b, c) => {
  console.log('Computing...');
  return a + b + c;
};

const memoCalc = memoize(expensiveCalc);

console.log(memoCalc(1, 2, 3));  // "Computing..." then 6
console.log(memoCalc(1, 2, 3));  // 6 (no "Computing...")
console.log(memoCalc(1, 2, 4));  // "Computing..." then 7

// Works with object arguments (by reference)
const getUser = memoize((config) => {
  console.log('Fetching...');
  return { name: 'Alice', ...config };
});

const cfg = { role: 'admin' };
console.log(getUser(cfg));       // "Fetching..."
console.log(getUser(cfg));       // cached (same reference)`,implementationTS:`function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<unknown, Map<unknown, unknown>>();

  return function (this: unknown, ...args: unknown[]): unknown {
    let currentLevel: Map<unknown, unknown> = cache;

    for (const arg of args) {
      if (!currentLevel.has(arg)) {
        currentLevel.set(arg, new Map());
      }
      currentLevel = currentLevel.get(arg) as Map<unknown, unknown>;
    }

    const RESULT_KEY = Symbol.for('memoize_result');

    if (currentLevel.has(RESULT_KEY)) {
      return currentLevel.get(RESULT_KEY);
    }

    const result = fn.apply(this, args);
    currentLevel.set(RESULT_KEY, result);
    return result;
  } as T;
}`,theoryAndConcepts:`WHAT IS MEMOIZATION?
--------------------
Memoization is an optimization technique that stores the results of
expensive function calls and returns cached results when same inputs occur.

It's a form of CACHING specific to function results.

WHEN TO USE:
------------
1. Pure functions (same input = same output)
2. Expensive computations (recursive, API calls)
3. Frequently called with same arguments

WHEN NOT TO USE:
----------------
1. Functions with side effects
2. Random/time-dependent results
3. Functions rarely called with same args
4. Large argument objects (memory issues)

TRADE-OFFS:
-----------
+ Faster subsequent calls (O(1) lookup)
- Memory usage for cache
- Cache invalidation complexity



CACHE KEY STRATEGIES:
---------------------
1. Single primitive arg: Use arg directly as key
2. Multiple args: JSON.stringify(args) or nested Maps
3. Object args: WeakMap (allows garbage collection)
4. Mixed: Combination of above`,beginnerApproach:`Beginner: Memoize function with single argument
Simplest case - use Map with argument as key`,beginnerImplementation:`function memoizeSingleBeginner(fn) {
  const cache = new Map();
  
  return function(arg) {
    // Check if we have cached result
    if (cache.has(arg)) {
      console.log('Cache HIT for:', arg);
      return cache.get(arg);
    }
    
    // Compute and cache
    console.log('Cache MISS for:', arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL (Single Arg) ===');

// Expensive function - calculate factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const memoizedFactorial = memoizeSingleBeginner(factorial);

console.log(memoizedFactorial(5)); // Cache MISS, returns 120
console.log(memoizedFactorial(5)); // Cache HIT, returns 120
console.log(memoizedFactorial(10)); // Cache MISS, returns 3628800
console.log(memoizedFactorial(10)); // Cache HIT`,intermediateApproach:`Intermediate: Better memoization with:
- WeakMap for object arguments (memory efficient)
- Cache clearing
- Cache size tracking`,intermediateImplementation:`function memoizeIntermediate(fn) {
  // Use Map for primitives, WeakMap for objects
  const primitiveCache = new Map();
  const objectCache = new WeakMap();
  
  function memoized(...args) {
    // Single argument optimization
    if (args.length === 1) {
      const arg = args[0];
      const isObject = arg !== null && typeof arg === 'object';
      const cache = isObject ? objectCache : primitiveCache;
      
      if (cache.has(arg)) {
        return cache.get(arg);
      }
      
      const result = fn.call(this, arg);
      cache.set(arg, result);
      return result;
    }
    
    // Multiple arguments - use JSON key
    const key = JSON.stringify(args);
    
    if (primitiveCache.has(key)) {
      return primitiveCache.get(key);
    }
    
    const result = fn.apply(this, args);
    primitiveCache.set(key, result);
    return result;
  }
  
  // Utility methods
  memoized.clear = () => {
    primitiveCache.clear();
    // Note: WeakMap doesn't have clear(), entries are garbage collected
  };
  
  memoized.delete = (key) => {
    if (typeof key === 'object' && key !== null) {
      return objectCache.delete(key);
    }
    return primitiveCache.delete(key);
  };
  
  memoized.has = (key) => {
    if (typeof key === 'object' && key !== null) {
      return objectCache.has(key);
    }
    return primitiveCache.has(key);
  };
  
  memoized.size = () => primitiveCache.size;
  
  return memoized;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const processData = memoizeIntermediate((data) => {
  console.log('Processing...');
  return data.value * 2;
});

const obj1 = { value: 10 };
const obj2 = { value: 10 }; // Same content, different reference

console.log(processData(obj1)); // Processing... 20
console.log(processData(obj1)); // Cached: 20
console.log(processData(obj2)); // Processing... 20 (different object!)

console.log('Cache size:', processData.size());
processData.clear();
console.log('After clear:', processData.size());`,expertApproach:`Expert: Full-featured memoization with:
- Custom key resolver
- Max cache size (LRU eviction)
- TTL (time-to-live)
- Async support
- Statistics`,expertImplementation:`function memoizeExpert(fn, options = {}) {
  const {
    resolver = null,           // Custom key generator
    maxSize = Infinity,        // Max cache entries
    maxAge = Infinity,         // TTL in milliseconds
    onHit = null,              // Callback on cache hit
    onMiss = null,             // Callback on cache miss
  } = options;
  
  // Use Map to maintain insertion order for LRU
  const cache = new Map();
  
  // Statistics
  const stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };
  
  function memoized(...args) {
    // Generate cache key
    const key = resolver 
      ? resolver.apply(this, args) 
      : (args.length === 1 ? args[0] : JSON.stringify(args));
    
    // Check cache
    if (cache.has(key)) {
      const entry = cache.get(key);
      
      // Check if expired
      if (Date.now() < entry.expiresAt) {
        stats.hits++;
        onHit?.(key, entry.value);
        
        // Move to end for LRU
        cache.delete(key);
        cache.set(key, entry);
        
        return entry.value;
      }
      
      // Expired - remove
      cache.delete(key);
    }
    
    // Cache miss
    stats.misses++;
    onMiss?.(key);
    
    // Compute result
    const result = fn.apply(this, args);
    
    // Evict oldest if at max size
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
      stats.evictions++;
    }
    
    // Store with expiration
    cache.set(key, {
      value: result,
      createdAt: Date.now(),
      expiresAt: Date.now() + maxAge
    });
    
    return result;
  }
  
  // Utility methods
  memoized.clear = () => {
    cache.clear();
    stats.hits = 0;
    stats.misses = 0;
    stats.evictions = 0;
  };
  
  memoized.delete = (key) => cache.delete(key);
  memoized.has = (key) => cache.has(key) && Date.now() < cache.get(key).expiresAt;
  memoized.size = () => cache.size;
  memoized.stats = () => ({ ...stats, size: cache.size });
  
  memoized.keys = () => Array.from(cache.keys());
  memoized.entries = () => Array.from(cache.entries()).map(
    ([k, v]) => [k, v.value]
  );
  
  return memoized;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// With max size (LRU)
const limitedCache = memoizeExpert(
  (x) => {
    console.log(\`Computing for \${x}\`);
    return x * 2;
  },
  { maxSize: 3 }
);

console.log('--- Max Size Test ---');
limitedCache(1); // Computing
limitedCache(2); // Computing
limitedCache(3); // Computing
console.log('Cache size:', limitedCache.size()); // 3
limitedCache(4); // Computing, evicts 1
console.log('Cache size:', limitedCache.size()); // 3
console.log('Keys:', limitedCache.keys()); // [2, 3, 4]
limitedCache(1); // Computing (was evicted)

// With TTL
console.log('\\n--- TTL Test ---');
const ttlCache = memoizeExpert(
  (x) => {
    console.log(\`Computing TTL for \${x}\`);
    return x;
  },
  { maxAge: 100 } // 100ms TTL
);

ttlCache('test'); // Computing
ttlCache('test'); // Cached
setTimeout(() => {
  ttlCache('test'); // Computing (expired)
}, 150);

// With custom resolver
console.log('\\n--- Custom Resolver Test ---');
const userCache = memoizeExpert(
  (user) => {
    console.log(\`Fetching user \${user.id}\`);
    return { ...user, fetched: true };
  },
  { resolver: (user) => user.id }
);

userCache({ id: 1, name: 'John' }); // Fetching
userCache({ id: 1, name: 'John Doe' }); // Cached (same id)
userCache({ id: 2, name: 'Jane' }); // Fetching

// With statistics
console.log('\\n--- Statistics ---');
console.log(limitedCache.stats());`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Object arguments with same content`,`{ a: 1 } !== { a: 1 } (different references)`,`const objMemo = memoizeIntermediate((obj) => obj.value * 2);`,`const objA = { value: 5 };`,`const objB = { value: 5 };`,`console.log('Same object:', objMemo(objA) === objMemo(objA)); // true (cached)`,`console.log('Different objects:', objMemo(objA), objMemo(objB)); // Both compute`],stepByStep:[`Create a Map as the top-level cache inside a closure.`,`Return a new function that accepts any number of arguments via rest params.`,`For each argument, traverse deeper into the nested Map structure, creating new Maps as needed.`,`After traversing all arguments, check the final Map for a sentinel RESULT_KEY.`,`If the result exists, return it immediately (cache hit).`,`If not, call the original function with all arguments, store the result at the RESULT_KEY, and return it.`,`The nested Map structure ensures each unique argument combination maps to a unique leaf node.`],timeComplexity:`O(k) per call for cache lookup where k is the number of arguments. O(k + T) for cache misses where T is the original function's time complexity.`,spaceComplexity:`O(n * k) where n is the number of unique argument sets cached and k is the average number of arguments per call.`,commonMistakes:[`Using JSON.stringify for cache keys, which conflates types and fails on circular references`,`Not handling the zero-arguments case (need to still cache the result)`,`Forgetting that Map uses reference equality for objects, so {a:1} !== {a:1}`,`Not using a sentinel key for the result, potentially confusing nested Maps with cached results`],followUps:[`How would you add a maximum cache size with LRU eviction?`,`How would you implement cache expiration (TTL)?`,`How does this relate to React.memo and useMemo? What are the differences?`]},{id:`coding-set-interval`,title:`Implement Custom setInterval`,difficulty:`Intermediate`,category:`Coding`,tags:[`timers`,`setTimeout`,`closures`,`async`,`browser-api`],problem:`Implement a custom version of setInterval using only setTimeout. The function should repeatedly call a callback at a specified interval and return a cancel function that stops the repetition when invoked.

The native setInterval has a subtle behavior: it schedules the next call at a fixed interval from the start of the previous call, regardless of how long the callback takes. Depending on interview requirements, you might implement it as scheduling the next call after the previous one completes (chained setTimeout), or at fixed wall-clock intervals. The chained approach is generally preferred because it prevents overlapping executions when the callback takes longer than the interval.

This problem tests understanding of JavaScript's event loop, timer APIs, closure-based state management, and the differences between setInterval and chained setTimeout.`,requirements:[`Accept a callback function and an interval in milliseconds`,`Repeatedly execute the callback at the specified interval using setTimeout`,`Return a cancel/clear function that stops future executions`,`The callback should not execute after cancel is called`,`Handle edge cases like zero or negative intervals`,`Optional: support passing arguments to the callback`],examples:[{input:`const cancel = customSetInterval(() => console.log("tick"), 1000);`,output:`Logs "tick" every ~1000ms`,explanation:`The callback is called repeatedly using chained setTimeout calls.`},{input:`const cancel = customSetInterval(() => console.log("tick"), 1000);
setTimeout(() => cancel(), 3500);`,output:`Logs "tick" 3 times then stops`,explanation:`Calling cancel() after 3.5 seconds stops the interval, so approximately 3 ticks occur.`},{input:`const cancel = customSetInterval((msg) => console.log(msg), 500, "hello");`,output:`Logs "hello" every ~500ms`,explanation:`Extra arguments are forwarded to the callback.`}],edgeCases:[`Calling cancel immediately before any callback fires`,`Calling cancel multiple times (should be safe/idempotent)`,`Very short intervals (0ms or 1ms)`,`Callback that throws an error (should not prevent future calls)`],naiveApproach:`A naive approach might just wrap setInterval in a function and return clearInterval. But the actual challenge is implementing setInterval from scratch using only setTimeout. Another naive attempt might use a while loop with a sleep, but JavaScript is single-threaded and this would block the event loop entirely.`,optimalApproach:`The optimal approach uses a recursive pattern: schedule a setTimeout that calls the callback and then schedules the next setTimeout. A boolean flag or timer ID tracked in a closure allows the cancel function to prevent the next scheduling.

The function creates a closure over a "cancelled" flag. An inner function (tick) calls setTimeout with the given delay. When the timer fires, it checks the cancelled flag — if not cancelled, it executes the callback and calls tick() again to schedule the next iteration. The returned cancel function simply sets the cancelled flag to true and clears the pending timeout.

This chained-setTimeout approach is actually superior to native setInterval for async work because it guarantees the interval between the END of one callback and the START of the next, preventing overlapping executions.`,implementation:`function customSetInterval(callback, delay, ...args) {
  let timerId = null;
  let cancelled = false;

  function tick() {
    timerId = setTimeout(() => {
      if (cancelled) return;
      callback(...args);
      tick();
    }, delay);
  }

  tick();

  return function cancel() {
    cancelled = true;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}

// Usage
let count = 0;
const cancel = customSetInterval(() => {
  count++;
  console.log('Tick:', count);
}, 1000);

// Stop after 5 ticks
setTimeout(() => {
  cancel();
  console.log('Cancelled after', count, 'ticks');
}, 5500);

// With arguments
const cancelGreet = customSetInterval(
  (name, emoji) => console.log(\`Hello \${name} \${emoji}\`),
  2000,
  'World',
  '👋'
);

setTimeout(() => cancelGreet(), 7000);`,implementationTS:`function customSetInterval(
  callback: (...args: unknown[]) => void,
  delay: number,
  ...args: unknown[]
): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  function tick(): void {
    timerId = setTimeout(() => {
      if (cancelled) return;
      callback(...args);
      tick();
    }, delay);
  }

  tick();

  return function cancel(): void {
    cancelled = true;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}`,theoryAndConcepts:`WHAT IS setInterval?
--------------------
setInterval() repeatedly executes a function at specified intervals.
It returns an interval ID used to cancel it with clearInterval().

THE PROBLEM:
------------
Native setInterval requires:
1. Storing the interval ID manually
2. Calling clearInterval(id) to stop
3. Managing IDs can be messy in complex code

THE SOLUTION:
-------------
Create a wrapper that returns a cancel function directly,
encapsulating the ID management.

RELATED CONCEPTS:
-----------------
1. setTimeout vs setInterval
2. Closure (holding interval ID)
3. Memory leaks (forgetting to clear)
4. Browser throttling in background tabs



setInterval vs setTimeout:
--------------------------
setInterval: Repeats forever until cancelled
setTimeout: Runs once after delay

Recursive setTimeout: More precise timing (waits for completion)
setInterval: Can have drift if callback takes too long`,beginnerApproach:`Beginner: Simple wrapper returning cancel function`,beginnerImplementation:`function setIntervalBeginner(callback, delay) {
  // Start the interval
  const intervalId = setInterval(callback, delay);
  
  // Return cancel function
  return function cancel() {
    clearInterval(intervalId);
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

let count = 0;
const cancel = setIntervalBeginner(() => {
  count++;
  console.log('Tick:', count);
}, 500);

// Cancel after 2 seconds
setTimeout(() => {
  cancel();
  console.log('Interval cancelled at count:', count);
}, 2100);`,intermediateApproach:`Intermediate: With immediate execution option and arguments`,intermediateImplementation:`function setIntervalIntermediate(callback, delay, options = {}) {
  const { 
    immediate = false,  // Execute immediately before first interval
    args = []           // Arguments to pass to callback
  } = options;
  
  let intervalId = null;
  let isCancelled = false;
  
  // Execute immediately if requested
  if (immediate && !isCancelled) {
    callback(...args);
  }
  
  // Start interval
  intervalId = setInterval(() => {
    callback(...args);
  }, delay);
  
  // Return control object
  return {
    cancel() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isCancelled = true;
      }
    },
    isCancelled() {
      return isCancelled;
    },
    isRunning() {
      return intervalId !== null && !isCancelled;
    }
  };
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const interval = setIntervalIntermediate(
  (msg) => console.log(msg, new Date().toISOString()),
  1000,
  { immediate: true, args: ['Tick at:'] }
);

console.log('Is running:', interval.isRunning());

setTimeout(() => {
  interval.cancel();
  console.log('Cancelled:', interval.isCancelled());
  console.log('Is running:', interval.isRunning());
}, 3500);`,expertApproach:`Expert: Full-featured interval with:
- Pause/Resume
- Reset
- Tick count
- Remaining time tracking
- Dynamic delay change
- Max iterations`,expertImplementation:`function createInterval(callback, delay, options = {}) {
  const {
    immediate = false,
    maxIterations = Infinity,
    context = null,
    args = [],
    onStart = null,
    onStop = null,
    onTick = null
  } = options;
  
  let intervalId = null;
  let timeoutId = null;
  let tickCount = 0;
  let startTime = null;
  let remaining = delay;
  let isPaused = false;
  let isStarted = false;
  let currentDelay = delay;
  
  function tick() {
    tickCount++;
    startTime = Date.now();
    remaining = currentDelay;
    
    onTick?.(tickCount);
    callback.apply(context, args);
    
    // Check max iterations
    if (tickCount >= maxIterations) {
      stop();
    }
  }
  
  function start() {
    if (isStarted && !isPaused) return api;
    
    isStarted = true;
    isPaused = false;
    startTime = Date.now();
    
    onStart?.();
    
    // Immediate execution
    if (immediate && tickCount === 0) {
      tick();
      if (tickCount >= maxIterations) return api;
    }
    
    intervalId = setInterval(tick, currentDelay);
    
    return api;
  }
  
  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    isStarted = false;
    isPaused = false;
    tickCount = 0;
    remaining = currentDelay;
    
    onStop?.();
    
    return api;
  }
  
  function pause() {
    if (!isStarted || isPaused) return api;
    
    // Calculate remaining time in current interval
    remaining = currentDelay - (Date.now() - startTime);
    if (remaining < 0) remaining = 0;
    
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = null;
    timeoutId = null;
    isPaused = true;
    
    return api;
  }
  
  function resume() {
    if (!isPaused) return api;
    
    isPaused = false;
    startTime = Date.now();
    
    // Use timeout for remaining time, then switch to interval
    timeoutId = setTimeout(() => {
      tick();
      if (tickCount < maxIterations) {
        intervalId = setInterval(tick, currentDelay);
      }
    }, remaining);
    
    return api;
  }
  
  function reset() {
    stop();
    return start();
  }
  
  function setDelay(newDelay) {
    currentDelay = newDelay;
    
    if (isStarted && !isPaused) {
      // Restart with new delay
      clearInterval(intervalId);
      intervalId = setInterval(tick, currentDelay);
    }
    
    return api;
  }
  
  const api = {
    start,
    stop,
    pause,
    resume,
    reset,
    setDelay,
    
    // Getters
    isRunning: () => isStarted && !isPaused,
    isPaused: () => isPaused,
    isStopped: () => !isStarted,
    getTickCount: () => tickCount,
    getDelay: () => currentDelay,
    getRemaining: () => {
      if (isPaused) return remaining;
      if (!isStarted) return currentDelay;
      return Math.max(0, currentDelay - (Date.now() - startTime));
    }
  };
  
  return api;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const timer = createInterval(
  () => console.log('Expert tick at:', new Date().toISOString()),
  1000,
  {
    immediate: true,
    maxIterations: 10,
    onStart: () => console.log('Timer started!'),
    onStop: () => console.log('Timer stopped!'),
    onTick: (count) => console.log(\`Tick #\${count}\`)
  }
);

// Start the timer
timer.start();

// Pause after 2.5 seconds
setTimeout(() => {
  timer.pause();
  console.log('Paused! Remaining:', timer.getRemaining(), 'ms');
  console.log('Is paused:', timer.isPaused());
}, 2500);

// Resume after 4 seconds
setTimeout(() => {
  console.log('Resuming...');
  timer.resume();
}, 4000);

// Stop after 7 seconds
setTimeout(() => {
  timer.stop();
  console.log('Final tick count:', timer.getTickCount());
}, 7000);`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Zero delay`,`Browser enforces minimum of 4ms`,`console.log('Zero delay becomes ~4ms minimum');`,`EDGE CASE 2: Negative delay`,`Treated as 0`,`EDGE CASE 3: Very long delay`,`JavaScript uses 32-bit integer for delay`],stepByStep:[`Declare state variables in a closure: timerId to track the current timeout, and a cancelled flag.`,`Define a tick() function that schedules a setTimeout with the given delay.`,`Inside the timeout callback, first check if cancelled is true — if so, return immediately.`,`If not cancelled, invoke the original callback with any extra arguments.`,`Call tick() again to schedule the next repetition (recursive chaining).`,`Call tick() once immediately to start the first timer.`,`Return a cancel function that sets cancelled = true and clears the pending timeout.`],timeComplexity:`O(1) per tick — each setTimeout callback does constant work beyond the user callback.`,spaceComplexity:`O(1) — only a timer ID and boolean flag are stored in the closure.`,commonMistakes:[`Not clearing the pending timeout in the cancel function, causing one more callback to fire`,`Using setInterval internally instead of implementing with setTimeout from scratch`,`Not checking the cancelled flag inside the timeout callback, causing race conditions`,`Scheduling the next tick before the callback runs (use after to avoid overlap)`],followUps:[`How would you implement a version that adjusts timing to stay on schedule (drift correction)?`,`What is the difference between chained setTimeout and setInterval in terms of timing?`,`How would you implement setInterval that pauses when the browser tab is inactive?`]},{id:`coding-merge-objects`,title:`Deep Merge Two Objects`,difficulty:`Intermediate`,category:`Coding`,tags:[`recursion`,`objects`,`deep-merge`,`utility`,`data-structures`],problem:`Implement a deep merge function that combines two objects into one. Unlike Object.assign or the spread operator which only perform a shallow merge (overwriting nested objects entirely), a deep merge should recursively merge nested objects so that properties from both sources are preserved at every level.

For example, merging { a: { b: 1, c: 2 } } with { a: { c: 3, d: 4 } } should produce { a: { b: 1, c: 3, d: 4 } }. A shallow merge would replace the entire 'a' object. The function must handle arrays (with a configurable strategy — concatenation or replacement), null values, and mixed types where one side has a primitive and the other has an object.

Deep merging is used extensively in configuration management (merging default configs with overrides), state management (Redux reducers), and API response normalization.`,requirements:[`Recursively merge nested plain objects from both sources`,`Values in the second object (source) take precedence for non-object values`,`When both values are plain objects, recurse into them instead of replacing`,`Handle arrays — default strategy: source array replaces target array`,`Handle null values correctly (null is not an object to recurse into)`,`Return a new object without mutating either input`,`Handle properties that exist in only one of the two objects`],examples:[{input:`deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 10, e: 5 }, f: 6 })`,output:`{ a: 1, b: { c: 10, d: 3, e: 5 }, f: 6 }`,explanation:`Top-level keys are merged. Nested object "b" is recursively merged: c is overwritten, d is preserved, e is added.`},{input:`deepMerge({ arr: [1, 2], x: { y: 1 } }, { arr: [3, 4], x: null })`,output:`{ arr: [3, 4], x: null }`,explanation:`Arrays are replaced (not merged). Null in source overwrites the nested object.`},{input:`deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })`,output:`{ a: { b: { c: 1, d: 2 } } }`,explanation:`Deep nesting is handled correctly — all levels are recursively merged.`}],edgeCases:[`One or both inputs are null or undefined`,`Merging a primitive value with an object at the same key`,`Deeply nested structures with 5+ levels`,`Keys with undefined values (should they be preserved or omitted?)`,`Arrays containing objects (merge by index vs concatenate)`],naiveApproach:`A naive approach uses Object.assign or spread at each level. You iterate the source keys and for each one, check if both target and source have object values — if so, recursively merge. But a common mistake is mutating the target object directly instead of creating a new one, or not checking for null (since typeof null === 'object').`,optimalApproach:`The optimal approach creates a helper function isPlainObject that checks if a value is a non-null, non-array object (using typeof and constructor checks). The merge function creates a new result object, copies all keys from the target, then iterates source keys. For each source key, if both the existing result value and the source value are plain objects, recursively merge them. Otherwise, the source value overwrites.

This produces a clean, immutable merge that never mutates the inputs. By starting with a shallow clone of the target and then layering source properties, we ensure all target-only keys are preserved while source keys take precedence. The recursion only activates when both sides are plain objects, preventing bugs with arrays, dates, or null values.`,implementation:`function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const result = {};

  const allKeys = new Set([
    ...Object.keys(target),
    ...Object.keys(source),
  ]);

  for (const key of allKeys) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (key in source && key in target) {
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        result[key] = sourceVal;
      }
    } else if (key in source) {
      result[key] = sourceVal;
    } else {
      result[key] = targetVal;
    }
  }

  return result;
}

// Usage
const defaults = {
  theme: { color: 'blue', fontSize: 14, font: { family: 'Arial' } },
  debug: false,
  features: ['basic'],
};

const userConfig = {
  theme: { color: 'red', font: { weight: 'bold' } },
  debug: true,
};

const merged = deepMerge(defaults, userConfig);
console.log(merged);
// {
//   theme: { color: 'red', fontSize: 14, font: { family: 'Arial', weight: 'bold' } },
//   debug: true,
//   features: ['basic']
// }`,implementationTS:`function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge<
  T extends Record<string, unknown>,
  S extends Record<string, unknown>,
>(target: T, source: S): T & S {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source as T & S;
  }

  const result: Record<string, unknown> = {};

  const allKeys = new Set([
    ...Object.keys(target),
    ...Object.keys(source),
  ]);

  for (const key of allKeys) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (key in source && key in target) {
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = deepMerge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>,
        );
      } else {
        result[key] = sourceVal;
      }
    } else if (key in source) {
      result[key] = sourceVal;
    } else {
      result[key] = targetVal;
    }
  }

  return result as T & S;
}`,theoryAndConcepts:`SHALLOW MERGE VS DEEP MERGE:
----------------------------

SHALLOW MERGE (Object.assign, spread):
const merged = { ...obj1, ...obj2 };
- Only merges top-level properties
- Nested objects are replaced, not merged

Example:
obj1 = { a: { x: 1, y: 2 } }
obj2 = { a: { z: 3 } }
Shallow: { a: { z: 3 } }      // obj1.a is lost!
Deep:    { a: { x: 1, y: 2, z: 3 } }  // Merged!

USE CASES:
----------
1. Configuration objects (defaults + user config)
2. State management (partial updates)
3. API response merging
4. Theme customization



KEY CONSIDERATIONS:
-------------------
1. How to handle arrays? (Replace, concat, merge by index)
2. How to handle null/undefined? (Replace or skip)
3. How to handle circular references?
4. Mutate original or return new object?`,beginnerApproach:`Beginner: Simple deep merge (mutates target)
Only handles plain objects and primitives`,beginnerImplementation:`function deepMergeBeginner(target, source) {
  // Loop through source properties
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // If both are plain objects, recurse
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        deepMergeBeginner(targetValue, sourceValue);
      } else {
        // Otherwise, overwrite
        target[key] = sourceValue;
      }
    }
  }
  
  return target;
}

// Helper: Check if value is a plain object
function isPlainObject(value) {
  return value !== null && 
         typeof value === 'object' && 
         !Array.isArray(value);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const config1 = {
  database: { host: 'localhost', port: 5432 },
  logging: true
};

const config2 = {
  database: { port: 3306, name: 'mydb' },
  cache: true
};

const merged = deepMergeBeginner({ ...config1 }, config2);
console.log('Merged:', JSON.stringify(merged, null, 2));
// { database: { host: 'localhost', port: 3306, name: 'mydb' }, logging: true, cache: true }`,intermediateApproach:`Intermediate: Immutable deep merge with array handling
Returns new object, doesn't mutate originals`,intermediateImplementation:`function deepMergeIntermediate(target, source, options = {}) {
  const {
    arrayStrategy = 'replace' // 'replace' | 'concat' | 'merge'
  } = options;
  
  // Handle non-objects
  if (!isPlainObject(source)) {
    return source;
  }
  
  if (!isPlainObject(target)) {
    return deepClone(source);
  }
  
  // Create new object (immutable)
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // Both are plain objects - recurse
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = deepMergeIntermediate(targetValue, sourceValue, options);
      }
      // Both are arrays - apply strategy
      else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        switch (arrayStrategy) {
          case 'concat':
            result[key] = [...targetValue, ...sourceValue];
            break;
          case 'merge':
            // Merge by index
            result[key] = sourceValue.map((item, index) => {
              if (isPlainObject(item) && isPlainObject(targetValue[index])) {
                return deepMergeIntermediate(targetValue[index], item, options);
              }
              return item;
            });
            // Include any extra items from target
            if (targetValue.length > sourceValue.length) {
              result[key] = [...result[key], ...targetValue.slice(sourceValue.length)];
            }
            break;
          case 'replace':
          default:
            result[key] = [...sourceValue];
        }
      }
      // Otherwise, use source value
      else {
        result[key] = deepClone(sourceValue);
      }
    }
  }
  
  return result;
}

// Helper: Simple deep clone
function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  
  const result = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      result[key] = deepClone(value[key]);
    }
  }
  return result;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const base = {
  name: 'App',
  settings: { theme: 'dark', fontSize: 14 },
  plugins: ['plugin1', 'plugin2']
};

const override = {
  settings: { fontSize: 16, language: 'en' },
  plugins: ['plugin3']
};

console.log('Replace arrays:', deepMergeIntermediate(base, override));
console.log('Concat arrays:', deepMergeIntermediate(base, override, { arrayStrategy: 'concat' }));`,expertApproach:`Expert: Full-featured deep merge
- Custom merge functions per key
- Circular reference handling
- Symbol keys support
- Multiple sources
- Skip undefined option`,expertImplementation:`function deepMergeExpert(...args) {
  // Last argument can be options
  let options = {};
  let sources = args;
  
  if (args.length > 0 && args[args.length - 1]?._isOptions) {
    options = args[args.length - 1];
    sources = args.slice(0, -1);
  }
  
  const {
    arrayStrategy = 'replace',
    skipUndefined = false,
    skipNull = false,
    customMerge = {},  // { 'key.path': (target, source) => merged }
    circular = new WeakMap()
  } = options;
  
  if (sources.length === 0) return {};
  if (sources.length === 1) return deepCloneExpert(sources[0], circular);
  
  // Merge all sources from left to right
  return sources.reduce((acc, source) => {
    return mergeTwo(acc, source, '', options, circular);
  });
}

function mergeTwo(target, source, path, options, seen) {
  const { arrayStrategy, skipUndefined, skipNull, customMerge } = options;
  
  // Handle primitives and special values
  if (source === undefined && skipUndefined) return target;
  if (source === null && skipNull) return target;
  if (source === null || typeof source !== 'object') return source;
  if (target === null || typeof target !== 'object') return deepCloneExpert(source, seen);
  
  // Check for circular reference
  if (seen.has(source)) {
    return seen.get(source);
  }
  
  // Handle arrays
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) {
      return deepCloneExpert(source, seen);
    }
    
    let result;
    switch (arrayStrategy) {
      case 'concat':
        result = [...target, ...source.map(s => deepCloneExpert(s, seen))];
        break;
      case 'merge':
        result = source.map((item, i) => {
          if (i < target.length) {
            return mergeTwo(target[i], item, \`\${path}[\${i}]\`, options, seen);
          }
          return deepCloneExpert(item, seen);
        });
        if (target.length > source.length) {
          result = [...result, ...target.slice(source.length).map(t => deepCloneExpert(t, seen))];
        }
        break;
      case 'unique':
        // Combine and remove duplicates (for primitives)
        result = [...new Set([...target, ...source])];
        break;
      default:
        result = source.map(s => deepCloneExpert(s, seen));
    }
    seen.set(source, result);
    return result;
  }
  
  // Handle plain objects
  const result = { ...target };
  seen.set(source, result);
  
  // Get all keys including symbols
  const keys = [
    ...Object.keys(source),
    ...Object.getOwnPropertySymbols(source)
  ];
  
  for (const key of keys) {
    const keyPath = path ? \`\${path}.\${String(key)}\` : String(key);
    
    // Check for custom merge function
    if (customMerge[keyPath]) {
      result[key] = customMerge[keyPath](target[key], source[key]);
      continue;
    }
    
    const sourceValue = source[key];
    const targetValue = target[key];
    
    // Skip undefined/null if configured
    if (sourceValue === undefined && skipUndefined) continue;
    if (sourceValue === null && skipNull) continue;
    
    // Recursive merge for objects
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);
    }
    // Array handling
    else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      result[key] = mergeTwo(targetValue, sourceValue, keyPath, options, seen);
    }
    // Direct assignment
    else {
      result[key] = deepCloneExpert(sourceValue, seen);
    }
  }
  
  return result;
}

function deepCloneExpert(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    value.forEach((v, k) => cloned.set(deepCloneExpert(k, seen), deepCloneExpert(v, seen)));
    return cloned;
  }
  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    value.forEach(v => cloned.add(deepCloneExpert(v, seen)));
    return cloned;
  }
  
  if (Array.isArray(value)) {
    const cloned = [];
    seen.set(value, cloned);
    value.forEach((item, i) => cloned[i] = deepCloneExpert(item, seen));
    return cloned;
  }
  
  const cloned = {};
  seen.set(value, cloned);
  
  for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
    cloned[key] = deepCloneExpert(value[key], seen);
  }
  
  return cloned;
}

// Create options helper
deepMergeExpert.options = (opts) => ({ ...opts, _isOptions: true });

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Multiple sources
const defaults = { a: 1, b: { c: 2 } };
const userConfig = { b: { d: 3 } };
const runtimeConfig = { b: { e: 4 }, f: 5 };

console.log('Multiple sources:', deepMergeExpert(defaults, userConfig, runtimeConfig));

// Custom merge function
const result = deepMergeExpert(
  { score: 10, items: [1, 2] },
  { score: 5, items: [3] },
  deepMergeExpert.options({
    customMerge: {
      'score': (target, source) => target + source,  // Sum scores
    },
    arrayStrategy: 'concat'
  })
);
console.log('Custom merge:', result); // { score: 15, items: [1, 2, 3] }

// Skip undefined
const withUndefined = deepMergeExpert(
  { a: 1, b: 2 },
  { a: undefined, b: 3 },
  deepMergeExpert.options({ skipUndefined: true })
);
console.log('Skip undefined:', withUndefined); // { a: 1, b: 3 }`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Prototype pollution`,`Never merge __proto__ or constructor`,`function safeMerge(target, source) {`,`const dangerousKeys = ['__proto__', 'constructor', 'prototype'];`,`for (const key in source) {`,`if (dangerousKeys.includes(key)) continue; // Skip dangerous keys`,`if (source.hasOwnProperty(key)) {`],stepByStep:[`Create a helper isPlainObject to check if a value is a non-null, non-array object with Object.prototype.`,`If either target or source is not a plain object, return source (source wins for primitives).`,`Create an empty result object and collect all unique keys from both target and source.`,`For each key, check if it exists in both objects.`,`If both values are plain objects, recursively deepMerge them.`,`If not both plain objects, use the source value (source takes precedence).`,`If the key exists only in target or only in source, copy that value directly.`,`Return the new result object.`],timeComplexity:`O(n) where n is the total number of keys across all nested levels of both objects.`,spaceComplexity:`O(n) for the new merged object, plus O(d) recursion stack for nesting depth d.`,commonMistakes:[`Not checking for null before recursing (typeof null === "object" is a classic JS gotcha)`,`Mutating the target object instead of creating a new result (breaks immutability)`,`Treating arrays as plain objects and merging by index instead of replacing`,`Forgetting to handle keys that only exist in one of the two inputs`],followUps:[`How would you implement an array merge strategy option (concat, replace, merge-by-index)?`,`How would you merge more than two objects (variadic deep merge)?`,`How does this compare to lodash.merge or lodash.defaultsDeep?`]},{id:`coding-recursive-transform`,title:`Recursively Transform Nested Values`,difficulty:`Intermediate`,category:`Coding`,tags:[`recursion`,`tree-traversal`,`data-transformation`,`nested-structures`,`functional`],problem:`Implement a function that recursively traverses a deeply nested data structure (objects and arrays of arbitrary depth) and applies a transformation function to every leaf value (primitives like strings, numbers, booleans). The structure of the data must be preserved — objects remain objects, arrays remain arrays — but all primitive values are transformed.

A common use case is converting all string values to uppercase, converting all numbers to strings, sanitizing user input, or applying a formatting function across an entire API response payload. The challenge is correctly identifying leaf values vs container values (objects and arrays) and handling edge cases like null, undefined, and empty containers.

This pattern is the foundation for many utilities in data processing libraries and ORMs. It tests recursive thinking, type checking, and the ability to write generic, reusable utility functions.`,requirements:[`Accept a nested data structure and a transform function`,`Apply the transform function to all leaf (primitive) values`,`Preserve the structure: objects stay objects, arrays stay arrays`,`Handle nested structures of arbitrary depth`,`Handle null and undefined as leaf values (pass them to transform)`,`Return a new structure without mutating the original`,`Handle empty objects and empty arrays`],examples:[{input:`recursiveTransform({ a: 1, b: { c: 2, d: [3, 4] } }, x => x * 2)`,output:`{ a: 2, b: { c: 4, d: [6, 8] } }`,explanation:`All numeric leaf values are doubled while the object/array structure is preserved.`},{input:`recursiveTransform({ name: "alice", info: { city: "paris" } }, s => typeof s === 'string' ? s.toUpperCase() : s)`,output:`{ name: "ALICE", info: { city: "PARIS" } }`,explanation:`The transform selectively uppercases strings, leaving other types unchanged.`},{input:`recursiveTransform([1, [2, [3, [4]]]], x => x + 10)`,output:`[11, [12, [13, [14]]]]`,explanation:`Works with nested arrays as the root container.`}],edgeCases:[`Root value is a primitive (not an object or array)`,`Empty objects {} and empty arrays []`,`Null values nested inside objects`,`Mixed-type arrays containing objects, arrays, and primitives`,`Very deep nesting (potential stack overflow)`],naiveApproach:`A naive approach handles only one level of nesting using Object.keys and a simple map. It doesn't recurse into nested objects or arrays, so only top-level primitives get transformed. Another common mistake is mutating the original object instead of building a new one, which causes bugs in immutable data patterns.`,optimalApproach:`The optimal approach uses a recursive function with clear type dispatch. If the value is an array, map over each element and recursively transform it. If the value is a non-null, non-array object, iterate over its keys and recursively transform each value, building a new object. Otherwise, it's a leaf value — apply the transform function to it directly.

The key insight is the order of checks: first check for null (since typeof null === 'object'), then check for Array.isArray, then check for typeof === 'object'. This ensures correct dispatch. The function naturally handles any depth of nesting because each recursive call handles exactly one level, and the base case (leaf value) terminates the recursion.`,implementation:`function recursiveTransform(value, transformFn) {
  if (Array.isArray(value)) {
    return value.map(item => recursiveTransform(item, transformFn));
  }

  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = recursiveTransform(value[key], transformFn);
    }
    return result;
  }

  return transformFn(value);
}

// Usage: double all numbers
const data = {
  users: [
    { name: 'Alice', scores: { math: 90, science: 85 } },
    { name: 'Bob', scores: { math: 78, science: 92 } },
  ],
  metadata: { count: 2, version: 1 },
};

const doubled = recursiveTransform(data, val =>
  typeof val === 'number' ? val * 2 : val
);
console.log(doubled);
// { users: [
//   { name: 'Alice', scores: { math: 180, science: 170 } },
//   { name: 'Bob', scores: { math: 156, science: 184 } },
// ], metadata: { count: 4, version: 2 } }

// Usage: sanitize all strings
const input = { comment: '<script>alert("xss")<\/script>', nested: { text: '<b>bold</b>' } };
const sanitized = recursiveTransform(input, val =>
  typeof val === 'string' ? val.replace(/</g, '&lt;').replace(/>/g, '&gt;') : val
);
console.log(sanitized);
// { comment: '&lt;script&gt;alert("xss")&lt;/script&gt;',
//   nested: { text: '&lt;b&gt;bold&lt;/b&gt;' } }`,implementationTS:`function recursiveTransform<T>(
  value: unknown,
  transformFn: (leaf: unknown) => T
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => recursiveTransform(item, transformFn));
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = recursiveTransform(
        (value as Record<string, unknown>)[key],
        transformFn,
      );
    }
    return result;
  }

  return transformFn(value);
}`,theoryAndConcepts:`WHAT IS RECURSIVE TRANSFORMATION?
---------------------------------
Walking through an object/array structure and applying a
transformation function to each value.

USE CASES:
----------
1. Converting all strings to lowercase/uppercase
2. Transforming dates to ISO strings
3. Sanitizing user input
4. Converting types (string numbers to actual numbers)
5. Redacting sensitive data

KEY CONSIDERATIONS:
-------------------
- Handle circular references
- Transform keys vs values
- Maintain object structure
- Handle special types (Date, RegExp, etc.)`,beginnerApproach:`Beginner: Simple recursive transformer for values`,beginnerImplementation:`function transformValuesBeginner(obj, transformer) {
  // Handle primitives
  if (obj === null || typeof obj !== 'object') {
    return transformer(obj);
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => transformValuesBeginner(item, transformer));
  }
  
  // Handle objects
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = transformValuesBeginner(obj[key], transformer);
    }
  }
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const data = {
  name: 'JOHN',
  details: {
    email: 'JOHN@EXAMPLE.COM',
    tags: ['ADMIN', 'USER']
  }
};

// Transform all strings to lowercase
const lowercased = transformValuesBeginner(data, value =>
  typeof value === 'string' ? value.toLowerCase() : value
);
console.log('Lowercased:', lowercased);

// Double all numbers
const numbers = { a: 1, b: { c: 2, d: [3, 4] } };
const doubled = transformValuesBeginner(numbers, value =>
  typeof value === 'number' ? value * 2 : value
);
console.log('Doubled:', doubled);`,intermediateApproach:`Intermediate: Transform with path context and circular handling`,intermediateImplementation:`function transformValuesIntermediate(obj, transformer, options = {}) {
  const { transformKeys = false, seen = new WeakMap() } = options;
  
  function transform(value, path = []) {
    // Handle primitives
    if (value === null || typeof value !== 'object') {
      return transformer(value, path);
    }
    
    // Handle circular references
    if (seen.has(value)) {
      return seen.get(value);
    }
    
    // Handle Date
    if (value instanceof Date) {
      return transformer(value, path);
    }
    
    // Handle RegExp
    if (value instanceof RegExp) {
      return transformer(value, path);
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      const result = [];
      seen.set(value, result);
      
      for (let i = 0; i < value.length; i++) {
        result[i] = transform(value[i], [...path, i]);
      }
      return result;
    }
    
    // Handle objects
    const result = {};
    seen.set(value, result);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const newKey = transformKeys ? transformer(key, [...path, key]) : key;
        result[newKey] = transform(value[key], [...path, key]);
      }
    }
    
    return result;
  }
  
  return transform(obj);
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// Transform with path context
const withPaths = transformValuesIntermediate(
  { user: { name: 'John', age: 30 } },
  (value, path) => {
    console.log(\`Path: \${path.join('.')} = \${value}\`);
    return value;
  }
);

// Transform keys
const snakeCase = {
  firstName: 'John',
  lastName: 'Doe',
  contactInfo: { phoneNumber: '123' }
};

const transformedKeys = transformValuesIntermediate(
  snakeCase,
  (value, path) => {
    if (typeof value === 'string' && path.length > 0) {
      // This transforms keys
      return value;
    }
    return value;
  },
  { transformKeys: false }
);

// Handle circular reference
const circular = { a: 1 };
circular.self = circular;
const transformedCircular = transformValuesIntermediate(circular, v => v);
console.log('Circular handled:', transformedCircular.self === transformedCircular);`,expertApproach:`Expert: Full-featured transformer with type-specific handlers`,expertImplementation:`function transformDeep(obj, options = {}) {
  const {
    transformers = {},      // Type-specific transformers
    defaultTransformer = v => v,
    transformKeys = false,
    keyTransformer = k => k,
    maxDepth = Infinity,
    skipTypes = [],         // Types to skip
    seen = new WeakMap()
  } = options;
  
  function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (value instanceof Map) return 'map';
    if (value instanceof Set) return 'set';
    return typeof value;
  }
  
  function transform(value, path = [], depth = 0) {
    const type = getType(value);
    
    // Skip certain types
    if (skipTypes.includes(type)) {
      return value;
    }
    
    // Max depth reached
    if (depth > maxDepth) {
      return value;
    }
    
    // Apply type-specific transformer or default
    const transformer = transformers[type] || defaultTransformer;
    
    // Handle primitives and special types
    if (['null', 'undefined', 'boolean', 'number', 'string', 'symbol', 'bigint'].includes(type)) {
      return transformer(value, path, depth);
    }
    
    // Handle Date
    if (type === 'date') {
      return transformer(value, path, depth);
    }
    
    // Handle RegExp
    if (type === 'regexp') {
      return transformer(value, path, depth);
    }
    
    // Handle circular references
    if (seen.has(value)) {
      return seen.get(value);
    }
    
    // Handle Map
    if (type === 'map') {
      const result = new Map();
      seen.set(value, result);
      
      value.forEach((v, k) => {
        const newKey = transformKeys ? transform(k, [...path, k], depth + 1) : k;
        result.set(newKey, transform(v, [...path, k], depth + 1));
      });
      
      return transformer(result, path, depth);
    }
    
    // Handle Set
    if (type === 'set') {
      const result = new Set();
      seen.set(value, result);
      
      value.forEach(v => {
        result.add(transform(v, path, depth + 1));
      });
      
      return transformer(result, path, depth);
    }
    
    // Handle Array
    if (type === 'array') {
      const result = [];
      seen.set(value, result);
      
      for (let i = 0; i < value.length; i++) {
        result[i] = transform(value[i], [...path, i], depth + 1);
      }
      
      return transformer(result, path, depth);
    }
    
    // Handle Object
    const result = {};
    seen.set(value, result);
    
    for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
      const newKey = transformKeys ? keyTransformer(key, path) : key;
      result[newKey] = transform(value[key], [...path, key], depth + 1);
    }
    
    return transformer(result, path, depth);
  }
  
  return transform(obj);
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Type-specific transformers
const complexData = {
  name: 'John',
  age: 30,
  active: true,
  created: new Date('2024-01-01'),
  pattern: /test/gi,
  scores: [85, 90, 95],
  metadata: new Map([['key', 'value']]),
  tags: new Set(['a', 'b'])
};

const transformed = transformDeep(complexData, {
  transformers: {
    string: (v) => v.toUpperCase(),
    number: (v) => v * 2,
    date: (v) => v.toISOString(),
    array: (v) => v.reverse()
  }
});

console.log('Transformed:', transformed);

// Redact sensitive data based on path
const userData = {
  user: {
    name: 'John',
    password: 'secret123',
    email: 'john@example.com',
    profile: {
      ssn: '123-45-6789'
    }
  }
};

const sensitiveFields = ['password', 'ssn'];

const redacted = transformDeep(userData, {
  defaultTransformer: (value, path) => {
    const lastKey = path[path.length - 1];
    if (sensitiveFields.includes(lastKey)) {
      return '[REDACTED]';
    }
    return value;
  }
});

console.log('Redacted:', JSON.stringify(redacted, null, 2));`,stepByStep:[`Check if the value is an array — if so, return a new array by mapping each element through recursiveTransform.`,`Check if the value is a non-null object — if so, create a new empty object.`,`Iterate over the object's keys and recursively transform each value, assigning to the new object.`,`If the value is neither array nor object, it's a leaf value — apply the transform function to it.`,`Return the transformed value (new array, new object, or transformed leaf).`,`The recursion naturally bottoms out at leaf values, handling any depth of nesting.`],timeComplexity:`O(n) where n is the total number of values (both leaf and container) in the structure.`,spaceComplexity:`O(n) for the new cloned structure, plus O(d) recursion stack for maximum nesting depth d.`,commonMistakes:[`Checking typeof before checking for null (typeof null === "object" causes recursion into null)`,`Mutating the original object/array instead of creating new ones`,`Not handling arrays separately from objects (arrays should use map, not Object.keys)`,`Applying the transform to container values instead of only leaf values`],followUps:[`How would you also provide the key path to the transform function (e.g., "users.0.name")?`,`How would you handle circular references in the structure?`,`How would you allow the transform function to skip certain branches (e.g., stop recursing into specific keys)?`]},{id:`coding-deep-equal`,title:`Deep Equality Comparison`,difficulty:`Advanced`,category:`Coding`,tags:[`comparison`,`recursion`,`type-checking`,`edge-cases`,`utility`],problem:`Implement a deep equality function that determines whether two JavaScript values are structurally equivalent. Unlike the strict equality operator (===) which checks reference identity for objects, deep equality should compare the actual contents: two distinct objects with the same properties and values should be considered equal.

The function must handle all JavaScript types: primitives (string, number, boolean, null, undefined), plain objects, arrays, Date objects, RegExp objects, and special values like NaN (which is not === to itself). Nested structures should be compared recursively. Two objects are deeply equal if they have the same set of keys and all corresponding values are deeply equal.

This is used extensively in testing frameworks (Jest's toEqual), React's shallow/deep comparison for memoization, and state management libraries for detecting changes.`,requirements:[`Compare primitives using strict equality (===)`,`Handle NaN correctly (NaN should equal NaN)`,`Recursively compare plain objects by keys and values`,`Recursively compare arrays by length and elements`,`Compare Date objects by their time value`,`Compare RegExp objects by source and flags`,`Return false for values of different types`,`Handle null and undefined correctly`],examples:[{input:`deepEqual({ a: 1, b: { c: [2, 3] } }, { a: 1, b: { c: [2, 3] } })`,output:`true`,explanation:`Both objects have identical structure and values at every level.`},{input:`deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })`,output:`false`,explanation:`The value of key "b" differs between the two objects.`},{input:`deepEqual(NaN, NaN)`,output:`true`,explanation:`Special case: NaN === NaN is false in JS, but they should be considered deeply equal.`}],edgeCases:[`NaN compared to NaN (should return true)`,`null compared to undefined (should return false)`,`+0 compared to -0 (typically considered equal)`,`Objects with different key counts but overlapping keys`,`Arrays of different lengths`,`Date objects with the same vs different timestamps`,`RegExp objects with same pattern but different flags`],naiveApproach:`A naive approach is JSON.stringify(a) === JSON.stringify(b). This fails for many reasons: key order in objects is not guaranteed, NaN serializes to null, undefined is dropped, Date objects become strings, RegExp becomes {}, and circular references throw errors. It also has unnecessary performance overhead from stringifying the entire structure.`,optimalApproach:`The optimal approach uses a recursive function with early type-checking bailouts. First, use === for quick identity check (same reference or same primitive). Then handle NaN with Number.isNaN. Check if types match (typeof). Handle special objects: compare Dates via getTime(), RegExps via source and flags.

For arrays, compare lengths first (quick bailout) then recursively compare each element by index. For objects, compare key counts first (quick bailout), then check that every key in the first object exists in the second and that the corresponding values are deeply equal. The key-count check is important — without it, { a: 1 } would incorrectly equal { a: 1, b: 2 } because all of the first object's keys match.

The early bailouts at each level make this efficient in practice: most unequal structures differ at a high level and the function returns false quickly without traversing the entire tree.`,implementation:`function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (
    a === null || b === null ||
    typeof a !== 'object' || typeof b !== 'object'
  ) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Date !== b instanceof Date) return false;
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

// Usage
console.log(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }));  // true
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 }));                    // false
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                     // true
console.log(deepEqual(NaN, NaN));                                      // true
console.log(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))); // true
console.log(deepEqual(/abc/gi, /abc/gi));                              // true
console.log(deepEqual(/abc/g, /abc/i));                                // false
console.log(deepEqual(null, undefined));                               // false`,implementationTS:`function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (
    a === null || b === null ||
    typeof a !== 'object' || typeof b !== 'object'
  ) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Date !== b instanceof Date) return false;
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (!deepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}`,theoryAndConcepts:`SHALLOW VS DEEP EQUALITY:
-------------------------

SHALLOW (===):
- Primitives: Compare by value
- Objects: Compare by reference (same memory location)

DEEP EQUALITY:
- Compare structure and values recursively
- Two different objects with same content are equal

EXAMPLE:
const a = { x: { y: 1 } };
const b = { x: { y: 1 } };
a === b           // false (different references)
deepEqual(a, b)   // true (same structure and values)

SPECIAL CASES:
--------------
NaN === NaN       // false (!)
+0 === -0         // true (but Object.is says false)
null === null     // true
undefined === undefined // true



COMPARISON APPROACHES:
----------------------
1. JSON.stringify() - Simple but loses functions, order-dependent
2. Object.is() - Better than === for NaN and ±0
3. Recursive comparison - Full control, handles all types`,beginnerApproach:`Beginner: Basic deep equal for simple objects and arrays`,beginnerImplementation:`function deepEqualBeginner(a, b) {
  // Same reference or same primitive
  if (a === b) return true;
  
  // Different types
  if (typeof a !== typeof b) return false;
  
  // Handle null (typeof null === 'object')
  if (a === null || b === null) return false;
  
  // Not objects? (primitives that are !== already)
  if (typeof a !== 'object') return false;
  
  // Both are objects/arrays
  
  // Different constructors (Array vs Object)
  if (a.constructor !== b.constructor) return false;
  
  // Compare arrays
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualBeginner(a[i], b[i])) return false;
    }
    return true;
  }
  
  // Compare objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqualBeginner(a[key], b[key])) return false;
  }
  
  return true;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log(deepEqualBeginner(1, 1));                      // true
console.log(deepEqualBeginner('a', 'a'));                  // true
console.log(deepEqualBeginner({ a: 1 }, { a: 1 }));        // true
console.log(deepEqualBeginner([1, 2], [1, 2]));            // true
console.log(deepEqualBeginner({ a: { b: 1 } }, { a: { b: 1 } })); // true
console.log(deepEqualBeginner({ a: 1 }, { a: 2 }));        // false
console.log(deepEqualBeginner([1, 2], [1, 2, 3]));         // false`,intermediateApproach:`Intermediate: Handle special values (NaN, Date, RegExp)
Add circular reference detection`,intermediateImplementation:`function deepEqualIntermediate(a, b, seen = new WeakMap()) {
  // Same reference
  if (a === b) return true;
  
  // Handle NaN (NaN !== NaN, but should be equal)
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  
  // Null or non-objects
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  // Different constructors
  if (a.constructor !== b.constructor) return false;
  
  // Circular reference check
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  seen.set(a, b);
  
  // Date comparison
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  // RegExp comparison
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  
  // Array comparison
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualIntermediate(a[i], b[i], seen)) return false;
    }
    return true;
  }
  
  // Object comparison
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqualIntermediate(a[key], b[key], seen)) return false;
  }
  
  return true;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// NaN
console.log('NaN:', deepEqualIntermediate(NaN, NaN)); // true

// Date
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-01');
console.log('Date:', deepEqualIntermediate(date1, date2)); // true

// RegExp
console.log('RegExp:', deepEqualIntermediate(/test/gi, /test/gi)); // true
console.log('RegExp diff:', deepEqualIntermediate(/test/g, /test/i)); // false

// Circular reference
const obj1 = { a: 1 };
obj1.self = obj1;
const obj2 = { a: 1 };
obj2.self = obj2;
console.log('Circular:', deepEqualIntermediate(obj1, obj2)); // true`,expertApproach:`Expert: Full implementation handling all types
- Map, Set
- Symbol keys
- Functions
- ArrayBuffer, TypedArray
- Error objects
- Property descriptors (optional)`,expertImplementation:`function deepEqual(a, b, options = {}) {
  const {
    strict = true,           // Use Object.is for -0/+0
    compareFunctions = false, // Compare function references
    compareSymbols = true,    // Compare Symbol properties
    seen = new WeakMap()
  } = options;
  
  // Same reference
  if (a === b) return true;
  
  // Strict comparison using Object.is
  if (strict && Object.is(a, b)) return true;
  
  // Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  
  // Handle -0 and +0 in strict mode
  if (strict && a === 0 && b === 0) {
    return Object.is(a, b);
  }
  
  // Null or undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }
  
  // Different types
  const typeA = typeof a;
  const typeB = typeof b;
  
  if (typeA !== typeB) return false;
  
  // Functions
  if (typeA === 'function') {
    if (!compareFunctions) return a === b;
    return a.toString() === b.toString();
  }
  
  // Not objects (primitive that are !== already)
  if (typeA !== 'object') return false;
  
  // Different constructors
  if (a.constructor !== b.constructor) return false;
  
  // Circular reference detection
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  seen.set(a, b);
  
  // Date
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  // RegExp
  if (a instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  
  // Error
  if (a instanceof Error) {
    return a.name === b.name && 
           a.message === b.message && 
           a.stack === b.stack;
  }
  
  // Map
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    
    for (const [key, value] of a) {
      // Check if key exists in b (need to find matching key for objects)
      let found = false;
      for (const [bKey, bValue] of b) {
        if (deepEqual(key, bKey, { ...options, seen })) {
          if (!deepEqual(value, bValue, { ...options, seen })) {
            return false;
          }
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  // Set
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    
    for (const value of a) {
      // For primitives, simple check
      if (typeof value !== 'object' || value === null) {
        if (!b.has(value)) return false;
      } else {
        // For objects, need deep comparison
        let found = false;
        for (const bValue of b) {
          if (deepEqual(value, bValue, { ...options, seen })) {
            found = true;
            break;
          }
        }
        if (!found) return false;
      }
    }
    return true;
  }
  
  // ArrayBuffer
  if (a instanceof ArrayBuffer) {
    if (a.byteLength !== b.byteLength) return false;
    const viewA = new Uint8Array(a);
    const viewB = new Uint8Array(b);
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) return false;
    }
    return true;
  }
  
  // TypedArray
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  // Array
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], { ...options, seen })) return false;
    }
    return true;
  }
  
  // Plain object
  // Get all keys including Symbols
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  // Compare string keys
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], { ...options, seen })) return false;
  }
  
  // Compare Symbol keys
  if (compareSymbols) {
    const symbolsA = Object.getOwnPropertySymbols(a);
    const symbolsB = Object.getOwnPropertySymbols(b);
    
    if (symbolsA.length !== symbolsB.length) return false;
    
    for (const sym of symbolsA) {
      if (!symbolsB.includes(sym)) return false;
      if (!deepEqual(a[sym], b[sym], { ...options, seen })) return false;
    }
  }
  
  return true;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Map
const map1 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);
const map2 = new Map([[{ id: 1 }, 'one'], [{ id: 2 }, 'two']]);
console.log('Map:', deepEqual(map1, map2)); // true

// Set
const set1 = new Set([{ a: 1 }, { b: 2 }]);
const set2 = new Set([{ a: 1 }, { b: 2 }]);
console.log('Set:', deepEqual(set1, set2)); // true

// Symbol keys
const sym = Symbol('test');
const withSym1 = { [sym]: 'value', regular: 1 };
const withSym2 = { [sym]: 'value', regular: 1 };
console.log('Symbol keys:', deepEqual(withSym1, withSym2)); // true

// Error
const err1 = new Error('test');
const err2 = new Error('test');
err2.stack = err1.stack; // Match stack
console.log('Error:', deepEqual(err1, err2)); // true

// +0 vs -0
console.log('+0 vs -0 (strict):', deepEqual(+0, -0, { strict: true })); // false
console.log('+0 vs -0 (loose):', deepEqual(+0, -0, { strict: false })); // true

// ArrayBuffer
const buf1 = new Uint8Array([1, 2, 3]).buffer;
const buf2 = new Uint8Array([1, 2, 3]).buffer;
console.log('ArrayBuffer:', deepEqual(buf1, buf2)); // true`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: NaN`,`console.log('NaN === NaN:', NaN === NaN); // false`,`console.log('deepEqual(NaN, NaN):', deepEqual(NaN, NaN)); // true`,`EDGE CASE 2: +0 and -0`,`console.log('+0 === -0:', +0 === -0); // true`,`console.log('Object.is(+0, -0):', Object.is(+0, -0)); // false`,`EDGE CASE 3: Object with null prototype`],stepByStep:[`Check strict equality (===) first — handles same reference and same primitives.`,`Handle NaN: both values being NaN should return true (NaN !== NaN in JS).`,`If either value is null or non-object, return false (different primitives already failed === check).`,`Check for Date instances — compare using getTime() for timestamp equality.`,`Check for RegExp instances — compare source and flags strings.`,`Check Array.isArray consistency — an array should not equal a non-array.`,`Compare key counts — different counts means not equal.`,`Iterate keys of the first object: verify each key exists in the second and recursively deepEqual the values.`,`If all keys and values match, return true.`],timeComplexity:`O(n) where n is the total number of properties/elements across both structures. Early bailouts make average case faster.`,spaceComplexity:`O(d) where d is the maximum nesting depth (recursion stack).`,commonMistakes:[`Forgetting that NaN !== NaN in JavaScript — must explicitly handle this case`,`Not comparing key counts, causing { a: 1 } to equal { a: 1, b: 2 }`,`Using typeof null === "object" without a null guard, causing crashes on null.keys()`,`Not handling Date and RegExp as special cases (they need value-based comparison)`],followUps:[`How would you handle circular references in deep equality?`,`How does React.memo's shallow comparison differ from deep equality?`,`How would you implement a "diff" function that returns the paths where two objects differ?`]},{id:`coding-highlight`,title:`Highlight Search Term in Text`,difficulty:`Beginner`,category:`Coding`,tags:[`string-manipulation`,`regex`,`DOM`,`search`,`text-processing`],problem:`Implement a function that takes a text string and a search term, and returns a new string where every occurrence of the search term is wrapped in <mark> tags for highlighting. The search should be case-insensitive, meaning searching for "hello" should also highlight "Hello" and "HELLO", but the original casing in the text must be preserved in the output.

This is a common feature in search-as-you-type UIs, documentation viewers, and text editors. The implementation must handle special regex characters in the search term (e.g., searching for "C++" should not break), empty search terms, and overlapping or adjacent matches.

For a React context, the function might return an array of React elements (strings and <mark> elements) instead of an HTML string, to avoid using dangerouslySetInnerHTML. Both approaches are valuable to discuss.`,requirements:[`Wrap all occurrences of the search term in <mark></mark> tags`,`Perform case-insensitive matching`,`Preserve the original casing of the matched text in the output`,`Escape special regex characters in the search term`,`Return the original text unchanged if the search term is empty`,`Handle multiple occurrences in the same string`],examples:[{input:`highlightText("The quick brown fox jumps over the lazy dog", "the")`,output:`"<mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog"`,explanation:`Both "The" and "the" are matched case-insensitively and wrapped in mark tags with original casing.`},{input:`highlightText("Hello World, hello!", "hello")`,output:`"<mark>Hello</mark> World, <mark>hello</mark>!"`,explanation:`All occurrences highlighted regardless of case.`},{input:`highlightText("Price is $100.00 (USD)", "$100.00")`,output:`"Price is <mark>$100.00</mark> (USD)"`,explanation:`Special regex characters ($ and .) in the search term are properly escaped.`}],edgeCases:[`Empty search term (return text unchanged)`,`Search term not found in text (return text unchanged)`,`Search term with special regex characters ($, ., *, +, etc.)`,`Entire text matches the search term`,`Adjacent occurrences of the search term`],naiveApproach:`A naive approach uses string.replace() with a simple string argument. However, replace with a string only replaces the first occurrence. Using string.replaceAll() fixes that but doesn't support case-insensitive matching. Manually splitting and joining is another approach, but it's harder to get right with case-insensitive matching while preserving original casing.`,optimalApproach:`The optimal approach uses a RegExp with the 'gi' flags (global, case-insensitive) and string.replace(). The key detail is escaping the search term first so that special regex characters are treated as literals. Use a regex-escape helper that prepends a backslash before each special character.

The replace method with the 'gi' regex finds all matches case-insensitively. The replacement function receives the matched substring (with its original casing), wraps it in <mark> tags, and returns it. This single-pass approach is clean, efficient, and handles all edge cases.

For React applications, you can use string.split(regex) to split the text around matches, then map the resulting array to alternate between plain text and <mark> elements, preserving React's virtual DOM model without dangerouslySetInnerHTML.`,implementation:`function escapeRegExp(string) {
  return string.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    return text;
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');

  return text.replace(regex, '<mark>$1</mark>');
}

// React-friendly version returning an array of string/JSX elements
function highlightTextReact(text, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    return [text];
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return { type: 'mark', key: index, text: part };
    }
    return part;
  });
}

// Usage
console.log(highlightText(
  'The quick brown fox jumps over the lazy dog',
  'the'
));
// '<mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog'

console.log(highlightText('Hello World, hello!', 'hello'));
// '<mark>Hello</mark> World, <mark>hello</mark>!'

console.log(highlightText('Price is $100.00', '$100.00'));
// 'Price is <mark>$100.00</mark>'

console.log(highlightText('No match here', 'xyz'));
// 'No match here'`,implementationTS:`function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}

function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm || !searchTerm.trim()) {
    return text;
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');

  return text.replace(regex, '<mark>$1</mark>');
}

interface HighlightPart {
  type: 'text' | 'mark';
  text: string;
}

function highlightTextParts(text: string, searchTerm: string): HighlightPart[] {
  if (!searchTerm || !searchTerm.trim()) {
    return [{ type: 'text', text }];
  }

  const escaped = escapeRegExp(searchTerm);
  const regex = new RegExp(\`(\${escaped})\`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(part => part !== '')
    .map(part => ({
      type: part.toLowerCase() === searchTerm.toLowerCase() ? 'mark' : 'text' as const,
      text: part,
    }));
}`,theoryAndConcepts:`WHAT IS TEXT HIGHLIGHTING?
--------------------------
Finding search terms in text and wrapping them with markup
(usually <mark> or <span>) for visual emphasis.

USE CASES:
----------
1. Search result highlighting
2. Code syntax highlighting
3. Find and replace preview
4. Keyword emphasis

KEY CONSIDERATIONS:
-------------------
1. Case sensitivity
2. Whole word matching
3. Multiple terms
4. HTML safety (XSS prevention)
5. Overlapping matches
6. Preserving original HTML structure`,beginnerApproach:`Beginner: Simple string replacement`,beginnerImplementation:`function highlightBeginner(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  // Case-insensitive search using regex
  // Escape special regex characters in search term
  const escaped = searchTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  const regex = new RegExp(\`(\${escaped})\`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const text = 'The quick brown fox jumps over the lazy dog';
console.log(highlightBeginner(text, 'fox'));
// The quick brown <mark>fox</mark> jumps over the lazy dog

console.log(highlightBeginner(text, 'the'));
// <mark>The</mark> quick brown fox jumps over <mark>the</mark> lazy dog

console.log(highlightBeginner('Hello World', 'o'));
// Hell<mark>o</mark> W<mark>o</mark>rld`,intermediateApproach:`Intermediate: With options (case sensitivity, whole word, custom tag)


Intermediate: Highlight multiple terms`,intermediateImplementation:`function highlightIntermediate(text, searchTerm, options = {}) {
  const {
    caseSensitive = false,
    wholeWord = false,
    tag = 'mark',
    className = 'highlight'
  } = options;
  
  if (!searchTerm || !text) return text;
  
  // Escape special regex characters
  let escaped = searchTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  
  // Whole word matching
  if (wholeWord) {
    escaped = \`\\\\b\${escaped}\\\\b\`;
  }
  
  // Build regex with appropriate flags
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(\`(\${escaped})\`, flags);
  
  // Replace with highlighted version
  return text.replace(regex, \`<\${tag} class="\${className}">$1</\${tag}>\`);
}

function highlightMultiple(text, terms, options = {}) {
  if (!terms || terms.length === 0) return text;
  
  // Sort by length (longest first) to match longer terms before shorter
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Escape and join terms
  const escaped = sortedTerms.map(term =>
    term.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')
  );
  
  const pattern = escaped.join('|');
  const flags = options.caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(\`(\${pattern})\`, flags);
  
  const tag = options.tag || 'mark';
  const className = options.className || 'highlight';
  
  return text.replace(regex, \`<\${tag} class="\${className}">$1</\${tag}>\`);
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// Case sensitive
console.log('Case sensitive:', highlightIntermediate('The THE the', 'the', { caseSensitive: true }));
// The THE <mark class="highlight">the</mark>

// Whole word
console.log('Whole word:', highlightIntermediate('theater the theft', 'the', { wholeWord: true }));
// theater <mark class="highlight">the</mark> theft

// Multiple terms
console.log('Multiple:', highlightMultiple('The quick brown fox', ['the', 'fox', 'brown']));`,expertApproach:`Expert: DOM-based highlighter (preserves HTML structure)


Expert: String-based with HTML safety


Expert: Fuzzy highlight (with typo tolerance)`,expertImplementation:`class TextHighlighter {
  constructor(options = {}) {
    this.options = {
      tag: 'mark',
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      ...options
    };
    this.highlights = [];
  }
  
  // Highlight in a DOM element
  highlight(element, searchTerm) {
    if (!searchTerm) return;
    
    // Build regex
    let pattern = searchTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    if (this.options.wholeWord) {
      pattern = \`\\\\b\${pattern}\\\\b\`;
    }
    const flags = this.options.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    
    // Walk through text nodes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (regex.test(node.textContent)) {
        textNodes.push(node);
      }
      regex.lastIndex = 0; // Reset regex state
    }
    
    // Process each text node
    textNodes.forEach(textNode => {
      this.highlightTextNode(textNode, regex);
    });
  }
  
  highlightTextNode(textNode, regex) {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    
    regex.lastIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      
      // Add highlighted match
      const mark = document.createElement(this.options.tag);
      mark.className = this.options.className;
      mark.textContent = match[0];
      fragment.appendChild(mark);
      
      this.highlights.push(mark);
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    
    // Replace original node
    textNode.parentNode.replaceChild(fragment, textNode);
  }
  
  // Remove all highlights
  removeHighlights(element) {
    const marks = element.querySelectorAll(\`\${this.options.tag}.\${this.options.className}\`);
    
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize(); // Merge adjacent text nodes
    });
    
    this.highlights = [];
  }
  
  // Get highlight count
  count() {
    return this.highlights.length;
  }
  
  // Navigate to next/previous highlight
  scrollToHighlight(index) {
    if (index >= 0 && index < this.highlights.length) {
      this.highlights[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return true;
    }
    return false;
  }
}

function highlightSafe(text, searchTerm, options = {}) {
  const {
    caseSensitive = false,
    wholeWord = false,
    tag = 'mark',
    className = 'highlight',
    escapeHtml = true
  } = options;
  
  if (!searchTerm || !text) return text;
  
  // Escape HTML if needed
  let safeText = escapeHtml ? escapeHTML(text) : text;
  let safeTerm = escapeHtml ? escapeHTML(searchTerm) : searchTerm;
  
  // Build pattern
  let pattern = safeTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  if (wholeWord) {
    pattern = \`\\\\b\${pattern}\\\\b\`;
  }
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(\`(\${pattern})\`, flags);
  
  return safeText.replace(regex, \`<\${tag} class="\${className}">$1</\${tag}>\`);
}

function escapeHTML(str) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => escapeMap[char]);
}

function highlightFuzzy(text, searchTerm, maxDistance = 1) {
  if (!searchTerm || !text) return text;
  
  const words = text.split(/(\\s+)/);
  const searchLower = searchTerm.toLowerCase();
  
  return words.map(word => {
    // Skip whitespace
    if (/^\\s+$/.test(word)) return word;
    
    // Check if word is close enough to search term
    if (levenshteinDistance(word.toLowerCase(), searchLower) <= maxDistance) {
      return \`<mark class="highlight-fuzzy">\${word}</mark>\`;
    }
    return word;
  }).join('');
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Safe highlighting (XSS prevention)
console.log('Safe:', highlightSafe('<script>alert("xss")<\/script> test', 'test'));

// Fuzzy highlighting
console.log('Fuzzy:', highlightFuzzy('The quik brown foks', 'quick', 2));`,interviewTraps:[`QUICK REFERENCE:`,`1. Escape regex special characters in search term`,`2. Use (capturing group) to preserve case in replacement`,`3. Use TreeWalker for DOM traversal`,`4. Escape HTML to prevent XSS`,`5. Use \\b for whole word matching`,`INTERVIEW TIPS:`,`1. Start with simple regex replacement`],stepByStep:[`Check if the search term is empty or whitespace-only — return the original text if so.`,`Escape special regex characters in the search term using a helper function.`,`Create a RegExp with the escaped term, using "gi" flags for global and case-insensitive matching.`,`Use the capturing group version in the regex so replace can reference the matched text.`,`Call text.replace(regex, "<mark>$1</mark>") to wrap all matches.`,`The $1 backreference preserves the original casing of each match.`],timeComplexity:`O(n) where n is the length of the text string (single pass with regex).`,spaceComplexity:`O(n) for the resulting string with mark tags.`,commonMistakes:[`Not escaping special regex characters in the search term, causing regex syntax errors`,`Using string.replace instead of regex with "g" flag, which only replaces the first match`,`Losing original casing by replacing with the search term instead of the matched text`,`Not handling empty search terms, which creates a regex matching empty string at every position`],followUps:[`How would you highlight multiple different search terms with different colors?`,`How would you implement this in React without dangerouslySetInnerHTML?`,`How would you support fuzzy matching or highlighting partial word matches?`]},{id:`coding-resumable-interval`,title:`Resumable Interval with Start/Stop/Resume/Reset`,difficulty:`Intermediate`,category:`Coding`,tags:[`timers`,`state-machine`,`closures`,`OOP`,`browser-api`],problem:`Create an interval utility object that provides fine-grained control over periodic execution. Unlike a simple setInterval, this utility should support four operations: start (begin the interval), stop (pause without losing state), resume (continue from where it stopped), and reset (restart the interval and optionally change the callback or delay).

This pattern is essential for building countdown timers, polling mechanisms, animation loops, and auto-save features. The key challenge is managing the internal state correctly: tracking whether the interval is running, paused, or stopped, handling the remaining time when paused mid-interval, and ensuring that resume picks up at the right point.

Your implementation should be robust against edge cases like calling start when already running, calling resume when not paused, or calling stop multiple times. Each method should be idempotent and safe to call in any state.`,requirements:[`start(): Begin executing the callback at the specified interval`,`stop(): Pause execution, remembering elapsed time in the current interval`,`resume(): Continue from where stop() paused (accounting for elapsed time)`,`reset(): Clear all state and optionally restart with new parameters`,`Prevent duplicate starts (calling start while already running should be a no-op)`,`Track running state so consumers can check if the interval is active`,`Return the interval object for method chaining`],examples:[{input:`const timer = createResumableInterval(() => console.log("tick"), 1000);
timer.start(); // starts ticking every 1s`,output:`Logs "tick" every second`,explanation:`start() initiates the repeating interval.`},{input:`timer.stop(); // pauses at 600ms into current interval
timer.resume(); // next tick fires in ~400ms`,output:`Resumes with only the remaining time for the current interval`,explanation:`stop() saves the elapsed portion; resume() only waits for the remainder before the next full interval cycle.`},{input:`timer.reset();
timer.start();`,output:`Restarts from scratch as if newly created`,explanation:`reset() clears all internal state so start() begins a fresh interval.`}],edgeCases:[`Calling start() when already running (should be no-op)`,`Calling resume() when not paused (should be no-op)`,`Calling stop() when already stopped (should be no-op)`,`Calling reset() while running (should stop and clear)`,`Very short intervals (0-10ms)`],naiveApproach:`A naive approach directly uses setInterval and clearInterval for start/stop. The problem is that clearInterval cancels the entire interval — when you restart it, you lose the elapsed time within the current tick. If the interval is 1000ms and you stop at 600ms in, restarting with setInterval waits a full 1000ms instead of the remaining 400ms. There's no way to resume mid-interval with native setInterval alone.`,optimalApproach:`The optimal approach uses setTimeout internally and tracks timing state. When the interval starts, record the timestamp (Date.now()). Use setTimeout for each tick. When stop() is called, calculate how much time has elapsed since the last tick started and store the remaining time (delay - elapsed).

When resume() is called, use a one-time setTimeout with the remaining time. Once that fires, switch back to the regular interval cycle. This gives the user a seamless resume experience. The state machine has three states: idle, running, paused. Each method checks the current state and only acts if the transition is valid.

The reset() method clears all timers and resets internal state (remaining time, start time) to initial values. The implementation uses closure-based private state to encapsulate the timer IDs and timing variables.`,implementation:`function createResumableInterval(callback, delay) {
  let timerId = null;
  let startTime = null;
  let remaining = delay;
  let isRunning = false;

  function tick() {
    startTime = Date.now();
    callback();
    timerId = setTimeout(tick, delay);
  }

  function start() {
    if (isRunning) return api;
    isRunning = true;
    remaining = delay;
    startTime = Date.now();
    timerId = setTimeout(tick, delay);
    return api;
  }

  function stop() {
    if (!isRunning) return api;
    isRunning = false;
    clearTimeout(timerId);
    timerId = null;
    const elapsed = Date.now() - startTime;
    remaining = Math.max(delay - elapsed, 0);
    return api;
  }

  function resume() {
    if (isRunning || remaining === delay) return api;
    isRunning = true;
    startTime = Date.now();

    timerId = setTimeout(() => {
      callback();
      remaining = delay;
      startTime = Date.now();
      timerId = setTimeout(tick, delay);
    }, remaining);

    return api;
  }

  function reset(newCallback, newDelay) {
    clearTimeout(timerId);
    timerId = null;
    isRunning = false;
    remaining = newDelay || delay;
    startTime = null;
    if (newCallback) callback = newCallback;
    if (newDelay) delay = newDelay;
    return api;
  }

  const api = {
    start,
    stop,
    resume,
    reset,
    get isRunning() { return isRunning; },
  };

  return api;
}

// Usage
const timer = createResumableInterval(() => {
  console.log('Tick at', new Date().toLocaleTimeString());
}, 1000);

timer.start();

// Stop after 2.5 seconds (mid-interval)
setTimeout(() => {
  timer.stop();
  console.log('Paused. Running:', timer.isRunning);
}, 2500);

// Resume after 3 more seconds
setTimeout(() => {
  timer.resume();
  console.log('Resumed. Running:', timer.isRunning);
}, 5500);

// Final stop
setTimeout(() => {
  timer.reset();
  console.log('Reset. Running:', timer.isRunning);
}, 8000);`,implementationTS:`interface ResumableInterval {
  start(): ResumableInterval;
  stop(): ResumableInterval;
  resume(): ResumableInterval;
  reset(newCallback?: () => void, newDelay?: number): ResumableInterval;
  readonly isRunning: boolean;
}

function createResumableInterval(
  callback: () => void,
  delay: number,
): ResumableInterval {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let startTime: number | null = null;
  let remaining: number = delay;
  let isRunning = false;
  let cb = callback;
  let interval = delay;

  function tick(): void {
    startTime = Date.now();
    cb();
    timerId = setTimeout(tick, interval);
  }

  const api: ResumableInterval = {
    start() {
      if (isRunning) return api;
      isRunning = true;
      remaining = interval;
      startTime = Date.now();
      timerId = setTimeout(tick, interval);
      return api;
    },
    stop() {
      if (!isRunning) return api;
      isRunning = false;
      clearTimeout(timerId!);
      timerId = null;
      const elapsed = Date.now() - (startTime ?? Date.now());
      remaining = Math.max(interval - elapsed, 0);
      return api;
    },
    resume() {
      if (isRunning || remaining === interval) return api;
      isRunning = true;
      startTime = Date.now();
      timerId = setTimeout(() => {
        cb();
        remaining = interval;
        startTime = Date.now();
        timerId = setTimeout(tick, interval);
      }, remaining);
      return api;
    },
    reset(newCallback?: () => void, newDelay?: number) {
      if (timerId !== null) clearTimeout(timerId);
      timerId = null;
      isRunning = false;
      if (newCallback) cb = newCallback;
      if (newDelay) interval = newDelay;
      remaining = interval;
      startTime = null;
      return api;
    },
    get isRunning() { return isRunning; },
  };

  return api;
}`,theoryAndConcepts:`WHAT IS A RESUMABLE INTERVAL?
-----------------------------
Unlike basic setInterval which only supports start/stop,
a resumable interval can be PAUSED and RESUMED, continuing
from where it left off.

KEY CHALLENGE:
--------------
When pausing, we need to track how much time has elapsed
in the current interval, so we can resume with the
remaining time.

Example:
- Interval: 5000ms
- Pause after: 3000ms
- Remaining: 2000ms
- On resume: Wait 2000ms, then continue with 5000ms intervals`,beginnerApproach:`Beginner: Simple pause/resume (restarts interval)
Note: This doesn't track remaining time`,beginnerImplementation:`function createIntervalBeginner(callback, delay) {
  let intervalId = null;
  let isPaused = false;
  
  return {
    start() {
      if (intervalId === null) {
        intervalId = setInterval(callback, delay);
        isPaused = false;
      }
    },
    
    pause() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isPaused = true;
      }
    },
    
    resume() {
      if (isPaused) {
        this.start();
      }
    },
    
    stop() {
      clearInterval(intervalId);
      intervalId = null;
      isPaused = false;
    },
    
    isRunning() {
      return intervalId !== null;
    },
    
    isPaused() {
      return isPaused;
    }
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');
console.log('Basic interval with pause/resume (but loses remaining time on pause)');`,intermediateApproach:`Intermediate: True resumable interval with remaining time tracking`,intermediateImplementation:`function createResumableInterval(callback, delay) {
  let intervalId = null;
  let timeoutId = null;
  let startTime = null;
  let remaining = delay;
  let isPaused = false;
  let isRunning = false;
  let tickCount = 0;
  
  function tick() {
    tickCount++;
    startTime = Date.now();
    remaining = delay;
    callback(tickCount);
  }
  
  const api = {
    start() {
      if (isRunning) return api;
      
      isRunning = true;
      isPaused = false;
      startTime = Date.now();
      remaining = delay;
      
      intervalId = setInterval(tick, delay);
      
      return api;
    },
    
    pause() {
      if (!isRunning || isPaused) return api;
      
      // Calculate remaining time
      const elapsed = Date.now() - startTime;
      remaining = delay - (elapsed % delay);
      if (remaining <= 0) remaining = delay;
      
      // Clear timers
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      intervalId = null;
      timeoutId = null;
      
      isPaused = true;
      
      return api;
    },
    
    resume() {
      if (!isPaused) return api;
      
      isPaused = false;
      startTime = Date.now();
      
      // Use timeout for remaining time, then switch to interval
      timeoutId = setTimeout(() => {
        tick();
        intervalId = setInterval(tick, delay);
        timeoutId = null;
      }, remaining);
      
      return api;
    },
    
    stop() {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      intervalId = null;
      timeoutId = null;
      isRunning = false;
      isPaused = false;
      remaining = delay;
      tickCount = 0;
      
      return api;
    },
    
    reset() {
      api.stop();
      return api.start();
    },
    
    // Getters
    isRunning() {
      return isRunning && !isPaused;
    },
    
    isPaused() {
      return isPaused;
    },
    
    isStopped() {
      return !isRunning;
    },
    
    getRemaining() {
      if (isPaused) return remaining;
      if (!isRunning) return delay;
      
      const elapsed = Date.now() - startTime;
      return Math.max(0, delay - (elapsed % delay));
    },
    
    getTickCount() {
      return tickCount;
    },
    
    getDelay() {
      return delay;
    }
  };
  
  return api;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const timer = createResumableInterval(() => {
  console.log('Tick at:', new Date().toISOString());
}, 2000);

console.log('Starting timer...');
timer.start();

setTimeout(() => {
  console.log('Pausing... Remaining:', timer.getRemaining(), 'ms');
  timer.pause();
}, 3500); // Pause 1.5s into 2nd interval

setTimeout(() => {
  console.log('Resuming...');
  timer.resume();
}, 5000);

setTimeout(() => {
  console.log('Stopping. Total ticks:', timer.getTickCount());
  timer.stop();
}, 9000);`,expertApproach:`Expert: Full-featured resumable interval`,expertImplementation:`class ResumableInterval {
  constructor(callback, delay, options = {}) {
    this.callback = callback;
    this.delay = delay;
    this.options = {
      immediate: false,       // Execute immediately on start
      maxTicks: Infinity,     // Max number of ticks
      onStart: null,
      onPause: null,
      onResume: null,
      onStop: null,
      onTick: null,
      ...options
    };
    
    this.intervalId = null;
    this.timeoutId = null;
    this.startTime = null;
    this.pauseTime = null;
    this.remaining = delay;
    this.state = 'stopped'; // 'stopped' | 'running' | 'paused'
    this.tickCount = 0;
    this.totalRunTime = 0;
  }
  
  _tick() {
    this.tickCount++;
    this.startTime = Date.now();
    this.remaining = this.delay;
    
    this.options.onTick?.(this.tickCount, this);
    this.callback(this.tickCount, this);
    
    // Check max ticks
    if (this.tickCount >= this.options.maxTicks) {
      this.stop();
    }
  }
  
  start() {
    if (this.state === 'running') return this;
    
    this.state = 'running';
    this.startTime = Date.now();
    this.remaining = this.delay;
    
    this.options.onStart?.(this);
    
    // Immediate execution
    if (this.options.immediate && this.tickCount === 0) {
      this._tick();
      if (this.state !== 'running') return this; // Might have stopped in tick
    }
    
    this.intervalId = setInterval(() => this._tick(), this.delay);
    
    return this;
  }
  
  pause() {
    if (this.state !== 'running') return this;
    
    // Calculate remaining time
    const elapsed = Date.now() - this.startTime;
    this.remaining = this.delay - (elapsed % this.delay);
    if (this.remaining <= 0) this.remaining = this.delay;
    
    this.totalRunTime += elapsed;
    this.pauseTime = Date.now();
    
    // Clear timers
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
    this.intervalId = null;
    this.timeoutId = null;
    
    this.state = 'paused';
    this.options.onPause?.(this.remaining, this);
    
    return this;
  }
  
  resume() {
    if (this.state !== 'paused') return this;
    
    this.state = 'running';
    this.startTime = Date.now();
    
    this.options.onResume?.(this.remaining, this);
    
    // Resume with remaining time
    this.timeoutId = setTimeout(() => {
      this._tick();
      if (this.state === 'running') {
        this.intervalId = setInterval(() => this._tick(), this.delay);
      }
      this.timeoutId = null;
    }, this.remaining);
    
    return this;
  }
  
  stop() {
    if (this.state === 'stopped') return this;
    
    // Calculate final run time
    if (this.state === 'running') {
      this.totalRunTime += Date.now() - this.startTime;
    }
    
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
    this.intervalId = null;
    this.timeoutId = null;
    
    const previousState = this.state;
    this.state = 'stopped';
    this.remaining = this.delay;
    
    this.options.onStop?.(this.tickCount, this.totalRunTime, this);
    
    return this;
  }
  
  reset() {
    this.stop();
    this.tickCount = 0;
    this.totalRunTime = 0;
    return this;
  }
  
  restart() {
    return this.reset().start();
  }
  
  // Change delay (takes effect on next tick)
  setDelay(newDelay) {
    this.delay = newDelay;
    
    if (this.state === 'running') {
      // Restart with new delay
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => this._tick(), this.delay);
    }
    
    return this;
  }
  
  // Getters
  getState() { return this.state; }
  isRunning() { return this.state === 'running'; }
  isPaused() { return this.state === 'paused'; }
  isStopped() { return this.state === 'stopped'; }
  getTickCount() { return this.tickCount; }
  getDelay() { return this.delay; }
  getTotalRunTime() { return this.totalRunTime; }
  
  getRemaining() {
    if (this.state === 'paused') return this.remaining;
    if (this.state === 'stopped') return this.delay;
    
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.delay - (elapsed % this.delay));
  }
  
  getProgress() {
    const remaining = this.getRemaining();
    return 1 - (remaining / this.delay);
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const expertTimer = new ResumableInterval(
  (tick) => console.log(\`Expert tick #\${tick}\`),
  2000,
  {
    immediate: true,
    maxTicks: 5,
    onStart: () => console.log('Timer started'),
    onPause: (remaining) => console.log(\`Paused with \${remaining}ms remaining\`),
    onResume: (remaining) => console.log(\`Resuming, \${remaining}ms to next tick\`),
    onStop: (ticks, totalTime) => console.log(\`Stopped after \${ticks} ticks, \${totalTime}ms total\`)
  }
);

// Demonstrate usage
expertTimer.start();

setTimeout(() => {
  expertTimer.pause();
  console.log('Progress:', (expertTimer.getProgress() * 100).toFixed(1) + '%');
}, 1500);

setTimeout(() => {
  expertTimer.resume();
}, 3000);

setTimeout(() => {
  expertTimer.stop();
}, 8000);`,interviewTraps:[`QUICK REFERENCE:`,`1. Track startTime to calculate remaining`,`2. Use setTimeout for remaining, then setInterval`,`3. Clear both timeout AND interval on pause/stop`,"4. Return `this` for method chaining",`INTERVIEW TIPS:`,`1. Explain the remaining time calculation`,`2. Show understanding of setTimeout vs setInterval`],stepByStep:[`Initialize closure state: timerId, startTime, remaining (set to full delay), and isRunning flag.`,`start(): If already running, return early. Set isRunning, record startTime, schedule first setTimeout.`,`tick(): Record startTime, call the callback, schedule the next setTimeout with full delay.`,`stop(): Clear the timeout, calculate elapsed time, store remaining = delay - elapsed.`,`resume(): Schedule a one-shot setTimeout for the remaining time. On fire, call callback, then switch to regular tick() cycle.`,`reset(): Clear any active timeout, reset all state to initial values, optionally accept new callback/delay.`,`Return an API object with all methods and an isRunning getter.`],timeComplexity:`O(1) for each method call. The callback execution time depends on the user's function.`,spaceComplexity:`O(1) — only a fixed number of state variables in the closure.`,commonMistakes:[`Not tracking remaining time when stopping, causing resume to wait a full interval instead of the remainder`,`Forgetting to update startTime when resuming, leading to incorrect remaining time on the next stop`,`Not guarding against duplicate start/resume calls, causing multiple concurrent timers`,`Using setInterval internally, which makes mid-interval resume impossible`],followUps:[`How would you add an onTick event that reports the elapsed time since start?`,`How would you implement drift correction for more accurate long-running intervals?`,`How would you adapt this for a React hook (useResumableInterval)?`]},{id:`coding-memoize-single`,title:`Memoize with Single Argument`,difficulty:`Beginner`,category:`Coding`,tags:[`memoization`,`caching`,`closures`,`performance`,`higher-order-functions`],problem:`Implement a memoize function that takes a single-argument function and returns a new function that caches its results. When the memoized function is called with an argument it has seen before, it should return the cached result immediately without re-executing the original function.

This is the simplest form of memoization and is the perfect entry point for understanding the concept. Since there's only one argument, the cache key is straightforward — use the argument itself as the key in a Map or plain object. This avoids the complexity of multi-argument key generation.

Memoization is a fundamental optimization technique. It's the basis for React.memo, useMemo, and selector libraries like Reselect. This problem tests your understanding of closures (the cache lives in the closure), higher-order functions (accepting and returning functions), and the trade-off between time and space complexity.`,requirements:[`Accept a single-argument function and return a memoized version`,`Cache results using the argument as the cache key`,`Return cached results for previously seen arguments`,`Only execute the original function once per unique argument`,`Handle any argument type (primitives, objects by reference)`,`Preserve the original function's return value exactly`],examples:[{input:`const square = memoize(x => { console.log("calc"); return x * x; });
square(4); // logs "calc", returns 16
square(4);`,output:`16 (no "calc" logged second time)`,explanation:`First call computes and caches. Second call returns cached result.`},{input:`const memoFib = memoize(n => n <= 1 ? n : memoFib(n-1) + memoFib(n-2));
memoFib(40);`,output:`102334155 (computed instantly)`,explanation:`Without memoization, fib(40) takes billions of operations. Memoized version computes each value once.`},{input:`const upper = memoize(s => s.toUpperCase());
upper("hello"); // "HELLO"
upper("world"); // "WORLD"
upper("hello");`,output:`"HELLO" (from cache)`,explanation:`Different arguments get separate cache entries.`}],edgeCases:[`Argument is undefined or null (should still be cached)`,`Function returns undefined (should cache it, not treat as uncached)`,`Function returns falsy values like 0, false, or empty string`,`Object arguments — cached by reference, not by value`],naiveApproach:`The most naive approach doesn't cache at all and just wraps the function. A slightly better naive approach uses a plain object ({}) as the cache with argument.toString() as the key. This fails because different values can have the same toString (e.g., [1,2].toString() === "1,2" === String("1,2")). It also coerces all keys to strings, conflating 1 and "1".`,optimalApproach:`The optimal approach for single-argument memoization uses a Map as the cache. Map preserves key types (unlike plain objects which coerce keys to strings), so number 1 and string "1" are separate keys. The memoized function checks cache.has(arg) first — if found, returns cache.get(arg). Otherwise, calls the original function, stores the result with cache.set(arg, result), and returns it.

Using has() instead of checking for undefined is important because the function might legitimately return undefined, and we want to cache that result too. The Map is created once in the closure and persists across all calls to the memoized function. For memory management, you could use a WeakMap if arguments are always objects (allows garbage collection of cached entries when the key object is no longer referenced).`,implementation:`function memoize(fn) {
  const cache = new Map();

  return function memoized(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Usage: expensive computation
const factorial = memoize(function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
});

console.log(factorial(10));  // 3628800 (computed)
console.log(factorial(10));  // 3628800 (cached)

// Usage: Fibonacci with memoization
const fib = memoize(function fibonacci(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fib(50));  // 12586269025 (instant with memoization)

// Usage: API/string processing
const processName = memoize((name) => {
  console.log('Processing:', name);
  return name.trim().toLowerCase().replace(/\\s+/g, '-');
});

console.log(processName('  Hello World  ')); // 'hello-world' (logs Processing)
console.log(processName('  Hello World  ')); // 'hello-world' (from cache)
console.log(processName('Foo Bar'));          // 'foo-bar' (logs Processing)`,implementationTS:`function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();

  return function memoized(arg: T): R {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const square = memoize((x: number): number => x * x);
console.log(square(5));  // 25
console.log(square(5));  // 25 (cached)`,stepByStep:[`Create a new Map inside the closure to serve as the cache.`,`Return a new function that takes a single argument.`,`Check if the cache already has an entry for the argument using cache.has().`,`If cached, return cache.get(arg) immediately — no function execution.`,`If not cached, call the original function fn(arg) and store the result.`,`Save the result in the cache with cache.set(arg, result).`,`Return the computed result.`],timeComplexity:`O(1) for cache hits. O(T) for cache misses where T is the original function's time complexity.`,spaceComplexity:`O(n) where n is the number of unique arguments cached.`,commonMistakes:[`Using a plain object instead of Map, which coerces keys to strings (1 and "1" collide)`,`Checking cache[arg] !== undefined instead of cache.has(arg), which breaks if the function returns undefined`,`Not returning the result from the memoized function after computing it`,`Confusing memoization (caching returns) with debouncing/throttling (controlling call frequency)`],followUps:[`How would you extend this to handle multiple arguments?`,`How would you add a maximum cache size (LRU eviction)?`,`What is the difference between memoize and React.useMemo?`]},{id:`coding-event-emitter`,title:`Implement EventEmitter`,difficulty:`Intermediate`,category:`Coding`,tags:[`events`,`pub-sub`,`design-pattern`,`observer`,`callbacks`],problem:`Implement an EventEmitter class that provides a publish-subscribe (pub/sub) event system. The class should support four core methods: on (subscribe to an event), off (unsubscribe), emit (trigger an event with optional data), and once (subscribe but automatically unsubscribe after the first trigger).

The EventEmitter pattern is one of the most fundamental design patterns in JavaScript. It's used in Node.js (the events module), browser DOM events, React synthetic events, and virtually every UI framework. Understanding this pattern is essential for building decoupled, event-driven architectures.

Key implementation details include supporting multiple listeners per event, maintaining listener order, handling the case where a listener removes itself during emit (concurrent modification), and ensuring once listeners fire exactly once even if the event is emitted multiple times in quick succession.`,requirements:[`on(event, listener): Register a listener for an event, return unsubscribe function`,`off(event, listener): Remove a specific listener from an event`,`emit(event, ...args): Call all listeners for an event with the provided arguments`,`once(event, listener): Register a listener that fires only once then auto-removes`,`Support multiple listeners per event`,`Maintain listener execution order (FIFO)`,`Handle removing a listener that doesn't exist gracefully`],examples:[{input:`const emitter = new EventEmitter();
emitter.on('data', (msg) => console.log(msg));
emitter.emit('data', 'hello');`,output:`Logs: "hello"`,explanation:`The listener registered with on() is called when the event is emitted with the provided argument.`},{input:`emitter.once('connect', () => console.log('connected'));
emitter.emit('connect');
emitter.emit('connect');`,output:`Logs "connected" only once`,explanation:`The once listener auto-unsubscribes after the first emit, so the second emit has no effect.`},{input:`const listener = (x) => console.log(x);
emitter.on('tick', listener);
emitter.off('tick', listener);
emitter.emit('tick', 42);`,output:`Nothing logged`,explanation:`The listener was removed with off() before emit, so it doesn't fire.`}],edgeCases:[`Emitting an event with no listeners (should not throw)`,`Removing a listener during emit (concurrent modification)`,`Registering the same listener function twice for the same event`,`Calling off() with a listener that was never registered`,`once listener that throws an error (should still be removed)`],naiveApproach:`A naive approach stores listeners in a plain object with arrays: { eventName: [fn1, fn2] }. It works for simple cases but has issues: removing listeners by reference during iteration can cause skipped listeners, once() is tricky to implement without a wrapper, and there's no protection against adding the same listener twice. The naive version also often forgets to handle emit for non-existent events.`,optimalApproach:`The optimal approach uses a Map<string, Set<Function>> or Map<string, Function[]> as the internal store. For emit, iterate over a copy of the listeners array to safely handle modifications during iteration (a listener calling off on itself). For once, create a wrapper function that calls the original listener then calls off — but store a reference mapping so off(event, originalListener) can find and remove the wrapper.

The Map provides cleaner semantics than a plain object (no prototype pollution, any string as key). Using a snapshot (spread or slice) of the listeners array during emit prevents concurrent modification bugs. The once wrapper pattern ensures exactly-once semantics even in edge cases.`,implementation:`class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);

    return () => this.off(event, listener);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    const snapshot = [...listeners];
    for (const listener of snapshot) {
      listener(...args);
    }
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };

    wrapper._originalListener = listener;
    this.on(event, wrapper);

    return () => this.off(event, wrapper);
  }

  listenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.length : 0;
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('message', (text) => console.log('Received:', text));

const unsubscribe = emitter.on('message', (text) =>
  console.log('Also got:', text)
);

emitter.emit('message', 'hello');
// Received: hello
// Also got: hello

unsubscribe();
emitter.emit('message', 'world');
// Received: world

emitter.once('connect', () => console.log('Connected!'));
emitter.emit('connect'); // Connected!
emitter.emit('connect'); // (nothing)

console.log(emitter.listenerCount('message')); // 1`,implementationTS:`type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private events: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);

    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  emit(event: string, ...args: unknown[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    const snapshot = [...listeners];
    for (const listener of snapshot) {
      listener(...args);
    }
    return true;
  }

  once(event: string, listener: Listener): () => void {
    const wrapper: Listener = (...args: unknown[]) => {
      this.off(event, wrapper);
      listener(...args);
    };

    this.on(event, wrapper);
    return () => this.off(event, wrapper);
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.length ?? 0;
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}`,theoryAndConcepts:`WHAT IS AN EVENT EMITTER?
-------------------------
An Event Emitter implements the Observer/Pub-Sub pattern:
- Publishers emit events (don't know who's listening)
- Subscribers react to events (don't know who emitted)

This decouples components - they communicate via events, not direct calls.

NODE.JS EVENTS:
---------------
Node.js has built-in EventEmitter class:
const EventEmitter = require('events');

COMMON METHODS:
---------------
on(event, listener)    - Add listener
off(event, listener)   - Remove listener
once(event, listener)  - Add one-time listener
emit(event, ...args)   - Trigger event with data

USE CASES:
----------
1. Custom event systems
2. Component communication
3. Async operation notifications
4. Plugin/middleware systems
5. State change notifications



OBSERVER PATTERN:
-----------------
Subject (Observable)  ->  notifies  ->  Observers

Event Emitter is a specific implementation where:
- Subject = EventEmitter instance
- Observers = Listener functions
- notify = emit()`,beginnerApproach:`Beginner: Basic event emitter with on, off, emit`,beginnerImplementation:`class EventEmitterBeginner {
  constructor() {
    // Store listeners: { eventName: [listener1, listener2, ...] }
    this.events = {};
  }
  
  // Subscribe to an event
  on(event, listener) {
    // Create array for event if doesn't exist
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    // Add listener
    this.events[event].push(listener);
  }
  
  // Unsubscribe from an event
  off(event, listener) {
    if (!this.events[event]) return;
    
    // Find and remove listener
    const index = this.events[event].indexOf(listener);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }
  
  // Emit an event
  emit(event, ...args) {
    if (!this.events[event]) return;
    
    // Call all listeners
    this.events[event].forEach(listener => {
      listener(...args);
    });
  }
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const emitter = new EventEmitterBeginner();

// Subscribe
const greetListener = (name) => console.log(\`Hello, \${name}!\`);
emitter.on('greet', greetListener);
emitter.on('greet', (name) => console.log(\`Welcome, \${name}!\`));

// Emit
emitter.emit('greet', 'John');
// Output: Hello, John! / Welcome, John!

// Unsubscribe
emitter.off('greet', greetListener);
emitter.emit('greet', 'Jane');
// Output: Welcome, Jane! (first listener removed)`,intermediateApproach:`Intermediate: Add once, removeAllListeners, listenerCount
Use Map for better performance`,intermediateImplementation:`class EventEmitterIntermediate {
  constructor() {
    this.events = new Map();
  }
  
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(listener);
    return this; // Enable chaining
  }
  
  off(event, listener) {
    if (!this.events.has(event)) return this;
    
    if (!listener) {
      // Remove all listeners for event
      this.events.delete(event);
      return this;
    }
    
    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    
    // Clean up empty arrays
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  // One-time listener
  once(event, listener) {
    // Create wrapper that removes itself after first call
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    
    // Store reference to original for removal
    wrapper.originalListener = listener;
    
    return this.on(event, wrapper);
  }
  
  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    
    // Clone array to avoid issues if listener modifies it
    const listeners = [...this.events.get(event)];
    
    listeners.forEach(listener => {
      listener.apply(this, args);
    });
    
    return true;
  }
  
  // Get listener count for event
  listenerCount(event) {
    if (!this.events.has(event)) return 0;
    return this.events.get(event).length;
  }
  
  // Get all event names
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  // Remove all listeners
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
  
  // Get listeners for event
  listeners(event) {
    if (!this.events.has(event)) return [];
    return [...this.events.get(event)];
  }
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const emitter2 = new EventEmitterIntermediate();

// Chaining
emitter2
  .on('data', (d) => console.log('Data:', d))
  .on('error', (e) => console.log('Error:', e));

// Once
emitter2.once('connect', () => console.log('Connected!'));
emitter2.emit('connect'); // Connected!
emitter2.emit('connect'); // Nothing (listener removed)

// Listener count
console.log('Data listeners:', emitter2.listenerCount('data')); // 1
console.log('Event names:', emitter2.eventNames()); // ['data', 'error']`,expertApproach:`Expert: Full-featured emitter with:
- Error handling
- Max listeners warning
- Prepend listeners
- Async emit
- Wildcard events`,expertImplementation:`class EventEmitterExpert {
  static defaultMaxListeners = 10;
  
  constructor() {
    this.events = new Map();
    this.maxListeners = EventEmitterExpert.defaultMaxListeners;
    this.onceWrappers = new WeakMap();
  }
  
  // Set max listeners (0 = unlimited)
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }
  
  getMaxListeners() {
    return this.maxListeners;
  }
  
  // Add listener (alias: addListener)
  on(event, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event);
    
    // Max listeners warning
    if (this.maxListeners > 0 && listeners.length >= this.maxListeners) {
      console.warn(
        \`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. \` +
        \`\${listeners.length + 1} \${event} listeners added. \` +
        \`Use emitter.setMaxListeners() to increase limit\`
      );
    }
    
    // Prepend or append
    if (options.prepend) {
      listeners.unshift(listener);
    } else {
      listeners.push(listener);
    }
    
    // Emit 'newListener' event
    if (event !== 'newListener') {
      this.emit('newListener', event, listener);
    }
    
    return this;
  }
  
  addListener(event, listener) {
    return this.on(event, listener);
  }
  
  prependListener(event, listener) {
    return this.on(event, listener, { prepend: true });
  }
  
  // One-time listener
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    
    this.onceWrappers.set(wrapper, listener);
    return this.on(event, wrapper);
  }
  
  prependOnceListener(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    
    this.onceWrappers.set(wrapper, listener);
    return this.on(event, wrapper, { prepend: true });
  }
  
  // Remove listener
  off(event, listener) {
    if (!this.events.has(event)) return this;
    
    const listeners = this.events.get(event);
    
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (
        listeners[i] === listener ||
        this.onceWrappers.get(listeners[i]) === listener
      ) {
        listeners.splice(i, 1);
        
        // Emit 'removeListener' event
        if (event !== 'removeListener') {
          this.emit('removeListener', event, listener);
        }
        break;
      }
    }
    
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  removeListener(event, listener) {
    return this.off(event, listener);
  }
  
  // Emit event
  emit(event, ...args) {
    // Special handling for 'error' event
    if (event === 'error' && !this.events.has('error')) {
      const error = args[0];
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unhandled error event');
    }
    
    if (!this.events.has(event)) {
      // Also check for wildcard listeners
      if (this.events.has('*')) {
        const wildcardListeners = [...this.events.get('*')];
        wildcardListeners.forEach(listener => {
          this.safeCall(listener, event, ...args);
        });
        return true;
      }
      return false;
    }
    
    const listeners = [...this.events.get(event)];
    
    listeners.forEach(listener => {
      this.safeCall(listener, ...args);
    });
    
    // Also notify wildcard listeners
    if (event !== '*' && this.events.has('*')) {
      const wildcardListeners = [...this.events.get('*')];
      wildcardListeners.forEach(listener => {
        this.safeCall(listener, event, ...args);
      });
    }
    
    return true;
  }
  
  // Safe call with error handling
  safeCall(listener, ...args) {
    try {
      listener.apply(this, args);
    } catch (error) {
      // Emit error or log
      if (this.events.has('error')) {
        this.emit('error', error);
      } else {
        console.error('Error in event listener:', error);
      }
    }
  }
  
  // Async emit (returns Promise)
  async emitAsync(event, ...args) {
    if (!this.events.has(event)) return false;
    
    const listeners = [...this.events.get(event)];
    
    await Promise.all(
      listeners.map(listener => 
        Promise.resolve(listener.apply(this, args))
      )
    );
    
    return true;
  }
  
  // Emit in series (wait for each listener)
  async emitSeries(event, ...args) {
    if (!this.events.has(event)) return false;
    
    const listeners = [...this.events.get(event)];
    
    for (const listener of listeners) {
      await Promise.resolve(listener.apply(this, args));
    }
    
    return true;
  }
  
  // Utility methods
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
  
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  listeners(event) {
    if (!this.events.has(event)) return [];
    return this.events.get(event).map(listener => 
      this.onceWrappers.get(listener) || listener
    );
  }
  
  rawListeners(event) {
    return this.events.has(event) ? [...this.events.get(event)] : [];
  }
  
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const emitter3 = new EventEmitterExpert();

// Error handling
emitter3.on('error', (err) => console.log('Caught error:', err.message));

// Wildcard listener
emitter3.on('*', (event, ...args) => {
  console.log(\`[Wildcard] Event: \${event}, Args:\`, args);
});

// Regular events
emitter3.on('user:login', (user) => console.log('User logged in:', user));
emitter3.emit('user:login', { id: 1, name: 'John' });

// Async emit
emitter3.on('async', async () => {
  await new Promise(r => setTimeout(r, 100));
  console.log('Async listener done');
});

// Prepend
emitter3.on('order', () => console.log('Second'));
emitter3.prependListener('order', () => console.log('First'));
emitter3.emit('order');

// newListener/removeListener events
emitter3.on('newListener', (event) => {
  console.log(\`New listener added for: \${event}\`);
});`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Removing listener during emit`,`const emitter4 = new EventEmitterIntermediate();`,`let count = 0;`,`const listener1 = () => {`,`console.log('Listener 1');`,`emitter4.off('test', listener2); // Remove next listener`,`const listener2 = () => console.log('Listener 2');`],stepByStep:[`Initialize a Map to store event names as keys and listener arrays as values.`,`on(): Get or create the listener array for the event, push the new listener, return an unsubscribe function.`,`off(): Find the listener in the event's array by reference (indexOf), splice it out, clean up empty arrays.`,`emit(): Get the listener array, create a snapshot copy, iterate the snapshot calling each listener with the provided args.`,`once(): Create a wrapper function that calls off(event, wrapper) then calls the original listener. Register the wrapper via on().`,`The snapshot in emit() prevents bugs when listeners modify the listener list during iteration.`,`Return boolean from emit() to indicate whether any listeners were called.`],timeComplexity:`O(n) for emit where n is the number of listeners. O(n) for off (indexOf search). O(1) for on.`,spaceComplexity:`O(e * l) where e is the number of event types and l is the average number of listeners per event.`,commonMistakes:[`Not using a snapshot during emit, causing skipped or double-called listeners when the list is modified`,`Implementing once() without a wrapper, leading to inability to remove the listener by reference`,`Forgetting to clean up empty listener arrays, causing memory leaks over time`,`Using === to compare wrapper functions with original listeners in off(), breaking once+off interop`],followUps:[`How would you add support for wildcard events (e.g., on("user.*", callback))?`,`How would you implement async event emission (await all listeners)?`,`How does this compare to the Node.js EventEmitter API?`]},{id:`coding-debounce`,title:`Debounce with Cancel and Leading/Trailing Edge`,difficulty:`Intermediate`,category:`Coding`,tags:[`debounce`,`timers`,`closures`,`performance`,`event-handling`],problem:`Implement a debounce function that delays invoking a function until after a specified wait period has elapsed since the last time it was called. If the function is called again before the wait period expires, the timer resets. This is essential for handling rapid-fire events like keystrokes, window resizing, or scroll events.

Your implementation should support three features beyond basic debouncing: (1) a cancel method to abort a pending invocation, (2) a flush method to immediately execute the pending invocation, and (3) configurable leading/trailing edge execution. Leading edge means the function fires immediately on the first call, then ignores subsequent calls within the wait period. Trailing edge (default) means the function fires after the wait period following the last call.

Debouncing is one of the most commonly asked frontend interview questions. It tests understanding of closures, timer management, the this context, and API design. Libraries like Lodash provide full-featured debounce implementations that serve as the gold standard.`,requirements:[`Delay function execution until after the wait period since the last call`,`Reset the timer on each new call within the wait period`,`Support trailing edge execution (fire after wait, default behavior)`,`Support leading edge execution (fire immediately on first call)`,`Provide a cancel() method to abort pending execution`,`Provide a flush() method to immediately execute the pending call`,`Preserve the this context and arguments of the most recent call`],examples:[{input:`const log = debounce((msg) => console.log(msg), 300);
log("a"); log("b"); log("c");`,output:`Logs "c" after 300ms (only the last call)`,explanation:`Each call resets the timer. Only the last call ("c") executes after the wait period.`},{input:`const log = debounce((msg) => console.log(msg), 300, { leading: true });
log("a"); log("b"); log("c");`,output:`Logs "a" immediately, then "c" after 300ms`,explanation:`With leading: true, the first call fires immediately. The trailing call fires with the most recent args.`},{input:`const search = debounce(query => fetch(query), 500);
search("h"); search("he"); search("hel");
search.cancel();`,output:`No fetch is made (cancelled)`,explanation:`cancel() aborts the pending debounced execution.`}],edgeCases:[`Calling cancel when no invocation is pending (should be safe)`,`Calling flush when no invocation is pending (should be a no-op)`,`Both leading and trailing set to true (fire on both edges)`,`Both leading and trailing set to false (never fires — edge case to handle)`,`Rapid calls followed by a long pause`],naiveApproach:`A naive debounce just uses clearTimeout and setTimeout — each call clears the previous timer and sets a new one. While this handles the basic trailing-edge case, it doesn't support leading edge, cancel, or flush. It also often loses the this context by not using apply/call when invoking the original function.`,optimalApproach:`The optimal approach tracks several pieces of state in a closure: the timer ID, the most recent arguments and context, and whether we're in a debounce cycle (for leading edge). The returned function clears any existing timer, saves the latest args and context, then sets a new timer for the wait duration.

For leading edge: on the first call (when no timer is active), invoke immediately. Set a flag indicating we're in a cycle. Subsequent calls within the wait period update the saved args but don't invoke. When the timer fires, check if there are newer args to invoke with (trailing), then reset the cycle flag.

The cancel method clears the timer and resets all state. The flush method checks if there's a pending invocation, and if so, clears the timer and executes immediately with the saved args. Both are attached as properties of the returned function.`,implementation:`function debounce(fn, wait, options = {}) {
  const { leading = false, trailing = true } = options;

  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result;

  function invoke() {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    result = fn.apply(thisArg, args);
    return result;
  }

  function startTimer() {
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        invoke();
      }
    }, wait);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const isFirstCall = timerId === null;

    clearTimeout(timerId);

    if (leading && isFirstCall) {
      invoke();
      startTimer();
    } else {
      startTimer();
    }

    return result;
  }

  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = function () {
    if (timerId !== null && lastArgs) {
      clearTimeout(timerId);
      timerId = null;
      return invoke();
    }
    return result;
  };

  debounced.pending = function () {
    return timerId !== null;
  };

  return debounced;
}

// Usage: basic trailing debounce
const onResize = debounce(() => {
  console.log('Resized at', Date.now());
}, 250);

window.addEventListener('resize', onResize);

// Usage: search with leading edge
const onSearch = debounce(
  (query) => console.log('Searching:', query),
  300,
  { leading: true, trailing: true }
);

onSearch('h');    // fires immediately: "Searching: h"
onSearch('he');   // resets timer
onSearch('hel');  // resets timer
// after 300ms: "Searching: hel"

// Usage: cancel pending
const autoSave = debounce((data) => {
  console.log('Saving:', data);
}, 2000);

autoSave({ text: 'draft' });
autoSave.cancel(); // abort the save
console.log('Pending:', autoSave.pending()); // false`,implementationTS:`interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
  pending(): boolean;
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;

  function invoke(): ReturnType<T> {
    const args = lastArgs!;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    result = fn.apply(thisArg, args);
    return result!;
  }

  function startTimer(): void {
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        invoke();
      }
    }, wait);
  }

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    const isFirstCall = timerId === null;

    if (timerId !== null) clearTimeout(timerId);

    if (leading && isFirstCall) {
      invoke();
      startTimer();
    } else {
      startTimer();
    }

    return result;
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timerId !== null && lastArgs) {
      clearTimeout(timerId);
      timerId = null;
      return invoke();
    }
    return result;
  };

  debounced.pending = () => timerId !== null;

  return debounced;
}`,theoryAndConcepts:`WHAT IS DEBOUNCING?
-------------------
Debouncing delays function execution until a pause in invocations.
The function only executes after the user "stops" triggering it.

VISUAL TIMELINE:
----------------
Calls:    |--X--X--X--X--------|-------X--X--------|
Wait:                   [300ms]           [300ms]
Execute:                      ↓                   ↓

USE CASES:
----------
1. Search input (wait for user to stop typing)
2. Window resize handlers
3. Auto-save (save after user stops editing)
4. Button click (prevent double-clicks)

DEBOUNCE VS THROTTLE:
---------------------
DEBOUNCE: Waits for "silence", executes once at the end
THROTTLE: Executes at regular intervals during activity

Calls:    |--X--X--X--X--X--X--|
Debounce:                      ↓ (once at end)
Throttle: ↓-----↓-----↓-----↓   (every N ms)



DEBOUNCE OPTIONS:
-----------------
leading:  Execute on first call (immediate feedback)
trailing: Execute after delay (default behavior)
maxWait:  Maximum time to wait before forcing execution`,beginnerApproach:`Beginner: Simple debounce (trailing only)
Most common use case`,beginnerImplementation:`function debounceBeginner(fn, delay) {
  let timeoutId = null;
  
  return function(...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const logBeginner = debounceBeginner((text) => {
  console.log('Search:', text);
}, 300);

// Simulate typing
logBeginner('h');
logBeginner('he');
logBeginner('hel');
logBeginner('hell');
logBeginner('hello');
// Only "hello" will be logged after 300ms`,intermediateApproach:`Intermediate: Debounce with cancel and flush`,intermediateImplementation:`function debounceIntermediate(fn, delay) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(lastThis, lastArgs);
      timeoutId = null;
      lastArgs = null;
      lastThis = null;
    }, delay);
  }
  
  // Cancel pending execution
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
  };
  
  // Execute immediately if pending
  debounced.flush = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      fn.apply(lastThis, lastArgs);
      timeoutId = null;
      lastArgs = null;
      lastThis = null;
    }
  };
  
  // Check if there's a pending execution
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const save = debounceIntermediate((data) => {
  console.log('Saving:', data);
}, 1000);

save('draft 1');
save('draft 2');
console.log('Pending:', save.pending()); // true

// Cancel example
save('draft 3');
save.cancel();
console.log('After cancel, pending:', save.pending()); // false

// Flush example
save('final');
save.flush(); // Saves immediately`,expertApproach:`Expert: Full-featured debounce with leading, trailing, maxWait`,expertImplementation:`function debounceExpert(fn, delay, options = {}) {
  const {
    leading = false,    // Execute on leading edge
    trailing = true,    // Execute on trailing edge
    maxWait = null      // Maximum time to wait
  } = options;
  
  let timeoutId = null;
  let maxTimeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = null;
  let lastInvokeTime = 0;
  let result = undefined;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    lastInvokeTime = time;
    result = fn.apply(thisArg, args);
    return result;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    // First call, or enough time passed, or system time went backwards
    return (
      lastCallTime === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== null && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;
    
    return maxWait !== null
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function trailingEdge(time) {
    timeoutId = null;
    
    // Only invoke if we have args (meaning debounced was called)
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    
    lastArgs = lastThis = null;
    return result;
  }
  
  function timerExpired() {
    const time = Date.now();
    
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    // Restart timer with remaining time
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, delay);
    
    // Invoke on leading edge
    return leading ? invokeFunc(time) : result;
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
      
      // Handle maxWait case
      if (maxWait !== null) {
        timeoutId = setTimeout(timerExpired, delay);
        return invokeFunc(time);
      }
    }
    
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    
    return result;
  }
  
  debounced.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = null;
  };
  
  debounced.flush = function() {
    if (timeoutId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };
  
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Leading edge (immediate execution)
console.log('--- Leading Edge ---');
const leadingDebounce = debounceExpert(
  (x) => console.log('Leading:', x),
  300,
  { leading: true, trailing: false }
);

leadingDebounce('first'); // Executes immediately
leadingDebounce('second'); // Ignored
leadingDebounce('third'); // Ignored

// Both leading and trailing
console.log('\\n--- Leading + Trailing ---');
const bothDebounce = debounceExpert(
  (x) => console.log('Both:', x),
  300,
  { leading: true, trailing: true }
);

bothDebounce('first'); // Executes immediately
bothDebounce('second');
bothDebounce('third'); // Will execute after 300ms

// MaxWait (guarantees execution within time limit)
console.log('\\n--- MaxWait ---');
const maxWaitDebounce = debounceExpert(
  (x) => console.log('MaxWait:', x, 'at', Date.now()),
  300,
  { maxWait: 1000 }
);

// Continuous calls for 2 seconds
let counter = 0;
const interval = setInterval(() => {
  maxWaitDebounce(++counter);
}, 100);

setTimeout(() => {
  clearInterval(interval);
  maxWaitDebounce.flush();
}, 2000);`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Zero delay`,`Still defers execution to next tick`,`const zeroDelay = debounceBeginner((x) => console.log('Zero delay:', x), 0);`,`zeroDelay('test'); // Executes on next tick`,"EDGE CASE 2: Preserving `this` context",`const obj = {`,`logValue: debounceBeginner(function() {`],stepByStep:[`Initialize closure state: timerId, lastArgs, lastThis, and result.`,`In the debounced function, save the latest arguments and this context.`,`Check if this is the first call (no active timer) for leading-edge logic.`,`Clear any existing timer with clearTimeout to reset the wait period.`,`If leading mode and first call: invoke immediately, then start a new timer.`,`If trailing mode (default): just start a new timer that will invoke when it fires.`,`When the timer fires: check if there are saved args and trailing is enabled, invoke if so.`,`Implement cancel(): clear the timer and reset all saved state.`,`Implement flush(): if there's a pending timer and saved args, clear the timer and invoke immediately.`],timeComplexity:`O(1) per call — just timer management and state updates.`,spaceComplexity:`O(1) — fixed number of closure variables regardless of call frequency.`,commonMistakes:["Not preserving the `this` context — must use fn.apply(thisArg, args) not fn(...args)",`Not saving lastArgs on leading-edge invoke, causing stale arguments`,`Forgetting to clear lastArgs after invoke, causing the trailing edge to fire with stale args`,`Not handling the case where both leading and trailing are true (should fire on both edges)`],followUps:[`What is the difference between debounce and throttle? When would you use each?`,`How would you implement a debounce that returns a Promise resolving with the result?`,`How does React's useDeferredValue relate to debouncing?`]},{id:`coding-merge-rows`,title:`Merge Data Rows by User ID`,difficulty:`Intermediate`,category:`Coding`,tags:[`data-processing`,`Map`,`reduce`,`grouping`,`real-world`],problem:`Given an array of data rows where each row has a userId and various other properties, merge all rows belonging to the same user into a single consolidated object. When the same property appears in multiple rows for the same user, later values should overwrite earlier ones (last-write-wins). Array properties should be concatenated rather than overwritten.

This is an extremely common data processing task in real-world applications: combining API responses from multiple endpoints, merging data from different database tables, consolidating event logs, or aggregating user activity across sessions. The challenge is handling the merge strategy correctly for different data types.

Your solution should be efficient (single pass using a Map for O(n) performance), handle missing or null fields gracefully, and produce clean output without duplicate array entries when specified.`,requirements:[`Group rows by userId into single consolidated objects`,`Scalar properties: last-write-wins (later rows overwrite earlier)`,`Array properties: concatenate arrays from all rows for the same user`,`Handle rows with missing or null/undefined fields (skip them)`,`Maintain the order of first appearance for users`,`Remove duplicate entries in concatenated arrays (optional, configurable)`,`Return an array of merged user objects`],examples:[{input:`mergeUserRows([
  { userId: 1, name: "Alice", roles: ["admin"] },
  { userId: 2, name: "Bob", roles: ["user"] },
  { userId: 1, email: "alice@example.com", roles: ["editor"] }
])`,output:`[
  { userId: 1, name: "Alice", email: "alice@example.com", roles: ["admin", "editor"] },
  { userId: 2, name: "Bob", roles: ["user"] }
]`,explanation:`Alice's rows are merged: name from first row, email from third, roles concatenated.`},{input:`mergeUserRows([
  { userId: 1, score: 10 },
  { userId: 1, score: 25 },
  { userId: 1, score: 15 }
])`,output:`[{ userId: 1, score: 15 }]`,explanation:`Scalar values use last-write-wins: the final score of 15 overwrites 10 and 25.`},{input:`mergeUserRows([
  { userId: "a", tags: ["js"], level: 1 },
  { userId: "a", tags: ["ts", "js"], level: 2 }
], { deduplicateArrays: true })`,output:`[{ userId: "a", tags: ["js", "ts"], level: 2 }]`,explanation:`With deduplication enabled, duplicate "js" in tags is removed.`}],edgeCases:[`Empty input array (return empty array)`,`All rows have unique userIds (no merging needed)`,`Rows with null or undefined field values`,`Nested objects within rows (shallow merge vs deep merge)`,`Mixed types for the same field across rows (e.g., string in one, array in another)`],naiveApproach:`A naive approach uses nested loops: for each row, search through a result array to find an existing entry with the same userId, then merge. This is O(n^2) because searching the result array is O(n) for each of the n rows. It also tends to have messy merge logic with lots of if/else branches for different types.`,optimalApproach:`The optimal approach uses a Map keyed by userId for O(1) lookups. Iterate through rows once. For each row, check if the userId exists in the Map. If not, create a new entry (clone the row). If it does, merge the row into the existing entry: for each property, check if both the existing value and the new value are arrays — if so, concatenate them. Otherwise, overwrite with the new value (last-write-wins).

After processing all rows, convert the Map values to an array. The Map preserves insertion order, so users appear in the order of their first row. Optional deduplication of arrays uses a Set. This runs in O(n * k) where n is the number of rows and k is the average number of properties per row — essentially linear.`,implementation:`function mergeUserRows(rows, options = {}) {
  const { deduplicateArrays = false } = options;
  const userMap = new Map();

  for (const row of rows) {
    const { userId, ...rest } = row;

    if (!userMap.has(userId)) {
      const entry = { userId };
      for (const [key, value] of Object.entries(rest)) {
        if (value === null || value === undefined) continue;
        entry[key] = Array.isArray(value) ? [...value] : value;
      }
      userMap.set(userId, entry);
      continue;
    }

    const existing = userMap.get(userId);

    for (const [key, value] of Object.entries(rest)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value) && Array.isArray(existing[key])) {
        existing[key] = [...existing[key], ...value];
      } else if (Array.isArray(value)) {
        existing[key] = [...value];
      } else {
        existing[key] = value;
      }
    }
  }

  if (deduplicateArrays) {
    for (const entry of userMap.values()) {
      for (const [key, value] of Object.entries(entry)) {
        if (Array.isArray(value)) {
          entry[key] = [...new Set(value)];
        }
      }
    }
  }

  return Array.from(userMap.values());
}

// Usage
const rows = [
  { userId: 1, name: 'Alice', roles: ['admin'], department: 'Engineering' },
  { userId: 2, name: 'Bob', roles: ['user'], department: 'Marketing' },
  { userId: 1, email: 'alice@co.com', roles: ['editor'], level: 3 },
  { userId: 2, phone: '555-1234' },
  { userId: 1, level: 5, roles: ['viewer'] },
];

const merged = mergeUserRows(rows);
console.log(JSON.stringify(merged, null, 2));
// [
//   {
//     userId: 1,
//     name: "Alice",
//     roles: ["admin", "editor", "viewer"],
//     department: "Engineering",
//     email: "alice@co.com",
//     level: 5
//   },
//   {
//     userId: 2,
//     name: "Bob",
//     roles: ["user"],
//     department: "Marketing",
//     phone: "555-1234"
//   }
// ]`,implementationTS:`interface Row {
  userId: string | number;
  [key: string]: unknown;
}

interface MergeOptions {
  deduplicateArrays?: boolean;
}

function mergeUserRows(rows: Row[], options: MergeOptions = {}): Row[] {
  const { deduplicateArrays = false } = options;
  const userMap = new Map<string | number, Row>();

  for (const row of rows) {
    const { userId, ...rest } = row;

    if (!userMap.has(userId)) {
      const entry: Row = { userId };
      for (const [key, value] of Object.entries(rest)) {
        if (value === null || value === undefined) continue;
        entry[key] = Array.isArray(value) ? [...value] : value;
      }
      userMap.set(userId, entry);
      continue;
    }

    const existing = userMap.get(userId)!;

    for (const [key, value] of Object.entries(rest)) {
      if (value === null || value === undefined) continue;

      const existingVal = existing[key];
      if (Array.isArray(value) && Array.isArray(existingVal)) {
        existing[key] = [...existingVal, ...value];
      } else if (Array.isArray(value)) {
        existing[key] = [...value];
      } else {
        existing[key] = value;
      }
    }
  }

  if (deduplicateArrays) {
    for (const entry of userMap.values()) {
      for (const [key, value] of Object.entries(entry)) {
        if (Array.isArray(value)) {
          entry[key] = [...new Set(value)];
        }
      }
    }
  }

  return Array.from(userMap.values());
}`,theoryAndConcepts:`WHAT IS ROW MERGING?
--------------------
Combining multiple data rows that share a common identifier (like userId)
into a single consolidated record.

USE CASES:
----------
1. Combining user activity logs
2. Aggregating metrics from multiple sources
3. De-duplicating records with latest data
4. Merging partial data from different API calls

MERGE STRATEGIES:
-----------------
- Last wins: Latest value overwrites
- First wins: Keep original value
- Concat: Combine arrays
- Sum: Add numeric values
- Max/Min: Keep highest/lowest
- Custom: User-defined merge logic`,beginnerApproach:`Beginner: Simple merge (last wins)`,beginnerImplementation:`function mergeUserRowsBeginner(rows, idKey = 'userId') {
  const merged = {};
  
  for (const row of rows) {
    const id = row[idKey];
    
    if (!merged[id]) {
      // First occurrence - copy the row
      merged[id] = { ...row };
    } else {
      // Merge with existing (later values overwrite)
      merged[id] = { ...merged[id], ...row };
    }
  }
  
  // Convert back to array
  return Object.values(merged);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const userActivities = [
  { userId: 1, name: 'John', visits: 5 },
  { userId: 2, name: 'Jane', visits: 3 },
  { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },
  { userId: 2, visits: 7 }
];

console.log('Merged (last wins):', mergeUserRowsBeginner(userActivities));
// [
//   { userId: 1, name: 'John Doe', visits: 10, email: 'john@example.com' },
//   { userId: 2, name: 'Jane', visits: 7 }
// ]`,intermediateApproach:`Intermediate: Merge with strategy per field`,intermediateImplementation:`function mergeUserRowsIntermediate(rows, options = {}) {
  const {
    idKey = 'userId',
    strategies = {}  // { fieldName: 'lastWins' | 'firstWins' | 'sum' | 'concat' | 'max' | 'min' }
  } = options;
  
  const merged = new Map();
  
  for (const row of rows) {
    const id = row[idKey];
    
    if (!merged.has(id)) {
      merged.set(id, { ...row });
      continue;
    }
    
    const existing = merged.get(id);
    
    for (const key of Object.keys(row)) {
      if (key === idKey) continue;
      
      const strategy = strategies[key] || 'lastWins';
      const existingValue = existing[key];
      const newValue = row[key];
      
      // Skip if new value is undefined
      if (newValue === undefined) continue;
      
      // If no existing value, just use new value
      if (existingValue === undefined) {
        existing[key] = newValue;
        continue;
      }
      
      // Apply strategy
      switch (strategy) {
        case 'firstWins':
          // Keep existing value
          break;
          
        case 'lastWins':
          existing[key] = newValue;
          break;
          
        case 'sum':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = existingValue + newValue;
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'concat':
          if (Array.isArray(existingValue) && Array.isArray(newValue)) {
            existing[key] = [...existingValue, ...newValue];
          } else if (Array.isArray(existingValue)) {
            existing[key] = [...existingValue, newValue];
          } else if (Array.isArray(newValue)) {
            existing[key] = [existingValue, ...newValue];
          } else {
            existing[key] = [existingValue, newValue];
          }
          break;
          
        case 'unique':
          if (Array.isArray(existingValue) && Array.isArray(newValue)) {
            existing[key] = [...new Set([...existingValue, ...newValue])];
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'max':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = Math.max(existingValue, newValue);
          } else {
            existing[key] = newValue;
          }
          break;
          
        case 'min':
          if (typeof existingValue === 'number' && typeof newValue === 'number') {
            existing[key] = Math.min(existingValue, newValue);
          } else {
            existing[key] = newValue;
          }
          break;
          
        default:
          existing[key] = newValue;
      }
    }
  }
  
  return Array.from(merged.values());
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const userData = [
  { userId: 1, name: 'John', visits: 5, tags: ['admin'], score: 80 },
  { userId: 2, name: 'Jane', visits: 3, tags: ['user'], score: 90 },
  { userId: 1, visits: 10, tags: ['vip'], score: 95 },
  { userId: 2, visits: 7, tags: ['premium'], score: 85 }
];

const merged = mergeUserRowsIntermediate(userData, {
  strategies: {
    name: 'firstWins',     // Keep original name
    visits: 'sum',         // Add up visits
    tags: 'unique',        // Combine unique tags
    score: 'max'           // Keep highest score
  }
});

console.log('Merged with strategies:', JSON.stringify(merged, null, 2));`,expertApproach:`Expert: Full-featured merger with custom functions`,expertImplementation:`class RowMerger {
  constructor(options = {}) {
    this.idKey = options.idKey || 'id';
    this.strategies = options.strategies || {};
    this.defaultStrategy = options.defaultStrategy || 'lastWins';
    this.customMergers = options.customMergers || {};
    this.validators = options.validators || {};
    this.transformers = options.transformers || {};
  }
  
  // Built-in strategies
  static strategies = {
    lastWins: (existing, incoming) => incoming,
    firstWins: (existing, incoming) => existing,
    sum: (a, b) => (typeof a === 'number' && typeof b === 'number') ? a + b : b,
    max: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.max(a, b) : b,
    min: (a, b) => (typeof a === 'number' && typeof b === 'number') ? Math.min(a, b) : b,
    concat: (a, b) => [...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])],
    unique: (a, b) => [...new Set([...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])])],
    average: (a, b, context) => {
      const count = context.mergeCount || 1;
      return (a * count + b) / (count + 1);
    },
    latest: (a, b, context) => {
      const aTime = context.existingRow?.timestamp || 0;
      const bTime = context.incomingRow?.timestamp || 0;
      return bTime >= aTime ? b : a;
    },
    deepMerge: (a, b) => {
      if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
        return { ...a, ...b };
      }
      return b;
    }
  };
  
  merge(rows) {
    const merged = new Map();
    const mergeCounts = new Map();
    
    for (const row of rows) {
      // Validate row
      if (!this.validateRow(row)) continue;
      
      // Transform row
      const transformedRow = this.transformRow(row);
      const id = transformedRow[this.idKey];
      
      if (id === undefined) {
        console.warn('Row missing id key:', row);
        continue;
      }
      
      if (!merged.has(id)) {
        merged.set(id, { ...transformedRow });
        mergeCounts.set(id, 1);
        continue;
      }
      
      const existing = merged.get(id);
      const mergeCount = mergeCounts.get(id);
      
      // Merge each field
      for (const key of Object.keys(transformedRow)) {
        if (key === this.idKey) continue;
        
        const incomingValue = transformedRow[key];
        if (incomingValue === undefined) continue;
        
        const existingValue = existing[key];
        
        if (existingValue === undefined) {
          existing[key] = incomingValue;
          continue;
        }
        
        // Context for custom mergers
        const context = {
          existingRow: existing,
          incomingRow: transformedRow,
          mergeCount,
          key,
          id
        };
        
        // Check for custom merger
        if (this.customMergers[key]) {
          existing[key] = this.customMergers[key](existingValue, incomingValue, context);
          continue;
        }
        
        // Get strategy
        const strategyName = this.strategies[key] || this.defaultStrategy;
        const strategy = RowMerger.strategies[strategyName];
        
        if (strategy) {
          existing[key] = strategy(existingValue, incomingValue, context);
        } else {
          existing[key] = incomingValue;
        }
      }
      
      mergeCounts.set(id, mergeCount + 1);
    }
    
    return Array.from(merged.values());
  }
  
  validateRow(row) {
    if (!row || typeof row !== 'object') return false;
    
    for (const [key, validator] of Object.entries(this.validators)) {
      if (row[key] !== undefined && !validator(row[key])) {
        console.warn(\`Validation failed for \${key}:\`, row[key]);
        return false;
      }
    }
    
    return true;
  }
  
  transformRow(row) {
    const transformed = { ...row };
    
    for (const [key, transformer] of Object.entries(this.transformers)) {
      if (transformed[key] !== undefined) {
        transformed[key] = transformer(transformed[key]);
      }
    }
    
    return transformed;
  }
  
  // Fluent API for configuration
  setIdKey(key) {
    this.idKey = key;
    return this;
  }
  
  setStrategy(field, strategy) {
    this.strategies[field] = strategy;
    return this;
  }
  
  setCustomMerger(field, mergerFn) {
    this.customMergers[field] = mergerFn;
    return this;
  }
  
  setValidator(field, validatorFn) {
    this.validators[field] = validatorFn;
    return this;
  }
  
  setTransformer(field, transformerFn) {
    this.transformers[field] = transformerFn;
    return this;
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const merger = new RowMerger({
  idKey: 'userId',
  strategies: {
    visits: 'sum',
    score: 'max',
    tags: 'unique',
    name: 'firstWins'
  },
  customMergers: {
    // Custom: Keep last non-empty email
    email: (existing, incoming) => 
      incoming && incoming.trim() ? incoming : existing
  },
  transformers: {
    // Trim all names
    name: (name) => name?.trim()
  },
  validators: {
    // Score must be between 0-100
    score: (score) => score >= 0 && score <= 100
  }
});

const data = [
  { userId: 1, name: ' John ', visits: 5, score: 80, email: '' },
  { userId: 1, name: 'Johnny', visits: 3, score: 95, email: 'john@example.com' },
  { userId: 1, visits: 2, score: 150 }, // Invalid score - will be skipped
  { userId: 2, name: 'Jane', visits: 10, score: 88 }
];

console.log('Expert merged:', merger.merge(data));`,interviewTraps:[`QUICK REFERENCE:`,`1. Use Map for O(1) lookups by id`,`2. Handle undefined values explicitly`,`3. Consider array fields (concat vs replace)`,`4. Maintain original order if needed`,`INTERVIEW TIPS:`,`1. Ask about merge strategy requirements`,`2. Start with simple "last wins" approach`],stepByStep:[`Create a Map keyed by userId to store the merged entries.`,`Iterate through each row in the input array.`,`Destructure the row into userId and the remaining properties.`,`If the userId is new (not in Map), create a fresh entry cloning all non-null values.`,`If the userId exists, merge properties: concatenate arrays, overwrite scalars.`,`Skip null/undefined values to avoid polluting the merged entry.`,`After processing all rows, optionally deduplicate array values using Set.`,`Convert the Map values to an array and return.`],timeComplexity:`O(n * k) where n is the number of rows and k is the average number of properties per row.`,spaceComplexity:`O(u * k) where u is the number of unique users and k is the total number of unique properties.`,commonMistakes:[`Using an array scan instead of Map for lookups, resulting in O(n^2) complexity`,`Not cloning arrays when creating the initial entry, causing shared references`,`Overwriting arrays instead of concatenating them`,`Not handling the case where a field is an array in one row but a scalar in another`],followUps:[`How would you handle deep-nested objects within the rows (recursive merge)?`,`How would you implement a custom merge strategy per field (e.g., sum for numeric fields)?`,`How would you handle this as a streaming operation for very large datasets?`]},{id:`coding-flatten`,title:`Flatten Array: Recursive, Depth-Limited, and Iterative`,difficulty:`Intermediate`,category:`Coding`,tags:[`arrays`,`recursion`,`iteration`,`stack`,`depth-control`],problem:`Implement a function to flatten a deeply nested array into a single-level array. Provide three variations: (1) full recursive flatten that removes all nesting, (2) depth-limited flatten that only flattens up to a specified number of levels (like Array.prototype.flat(depth)), and (3) an iterative version using a stack that avoids recursion entirely.

Array flattening is a fundamental operation in data processing. The native Array.prototype.flat() method was added in ES2019, but implementing it from scratch is a common interview question because it tests recursion, iteration with explicit stacks, and understanding of depth control. The iterative version is especially interesting because it demonstrates how to convert a recursive algorithm to an iterative one using a stack — a technique applicable to many tree/graph problems.

Your implementations should handle mixed-type arrays (elements that are a mix of arrays and non-arrays), empty arrays, and very deeply nested structures (where recursion might hit the call stack limit, making the iterative version necessary).`,requirements:[`flattenRecursive: Fully flatten nested arrays to a single level`,`flattenDepth: Flatten only up to a specified depth (depth=1 flattens one level)`,`flattenIterative: Flatten without recursion using an explicit stack`,`Preserve non-array elements in their original order`,`Handle empty arrays at any nesting level`,`Handle mixed content (arrays and non-arrays at the same level)`,`Do not mutate the original array`],examples:[{input:`flattenRecursive([1, [2, [3, [4, [5]]]]])`,output:`[1, 2, 3, 4, 5]`,explanation:`All levels of nesting are removed.`},{input:`flattenDepth([1, [2, [3, [4]]]], 2)`,output:`[1, 2, 3, [4]]`,explanation:`Only 2 levels are flattened. The innermost [4] remains nested.`},{input:`flattenIterative([1, [2, 3], [4, [5, 6]]])`,output:`[1, 2, 3, 4, 5, 6]`,explanation:`Same result as recursive but using a stack internally.`}],edgeCases:[`Already flat array (no nesting) — return copy of original`,`Empty nested arrays: [1, [], [2, [], 3]]`,`Depth of 0 (should return a shallow copy, no flattening)`,`Infinity as depth (should fully flatten)`,`Very deeply nested arrays (1000+ levels) — recursive version may stack overflow`],naiveApproach:`A naive approach for the recursive version uses concat in a reduce: arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []). While correct, creating new arrays with concat at every step is inefficient — O(n^2) in the worst case due to repeated array copying. The naive depth-limited version often passes depth incorrectly (e.g., not decrementing, or decrementing too early).`,optimalApproach:`The optimal recursive version uses a result array and pushes to it directly instead of creating intermediate arrays with concat. A helper function takes the input array and the result array, iterates elements, and either pushes non-arrays directly or recurses into nested arrays. This is O(n) where n is the total number of elements.

The depth-limited version adds a depth parameter: if depth > 0 and the element is an array, recurse with depth - 1. If depth is 0, push the element as-is (even if it's an array).

The iterative version uses a stack initialized with the input elements (in reverse order to maintain left-to-right processing). Pop from the stack: if the popped element is not an array, push to result. If it is an array, push its elements onto the stack in reverse order. Continue until the stack is empty. This avoids recursion entirely and handles arbitrary depth without stack overflow.`,implementation:`// Recursive full flatten
function flattenRecursive(arr) {
  const result = [];

  function helper(items) {
    for (const item of items) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr);
  return result;
}

// Depth-limited flatten
function flattenDepth(arr, depth = 1) {
  const result = [];

  function helper(items, currentDepth) {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth > 0) {
        helper(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr, depth);
  return result;
}

// Iterative flatten using stack
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const item = stack.pop();

    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  result.reverse();
  return result;
}

// Usage
console.log(flattenRecursive([1, [2, [3, [4, [5]]]]]));
// [1, 2, 3, 4, 5]

console.log(flattenDepth([1, [2, [3, [4]]]], 1));
// [1, 2, [3, [4]]]

console.log(flattenDepth([1, [2, [3, [4]]]], 2));
// [1, 2, 3, [4]]

console.log(flattenIterative([1, [2, 3], [4, [5, [6]]]]));
// [1, 2, 3, 4, 5, 6]

console.log(flattenDepth([1, [2, [3]]], 0));
// [1, [2, [3]]]

console.log(flattenRecursive([1, [], [2, [], [3, []]]]));
// [1, 2, 3]`,implementationTS:`function flattenRecursive<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];

  function helper(items: unknown[]): void {
    for (const item of items) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item as T);
      }
    }
  }

  helper(arr);
  return result;
}

function flattenDepth(arr: unknown[], depth: number = 1): unknown[] {
  const result: unknown[] = [];

  function helper(items: unknown[], currentDepth: number): void {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth > 0) {
        helper(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  helper(arr, depth);
  return result;
}

function flattenIterative<T>(arr: (T | T[])[]): T[] {
  const stack: unknown[] = [...arr];
  const result: T[] = [];

  while (stack.length > 0) {
    const item = stack.pop();

    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item as T);
    }
  }

  result.reverse();
  return result;
}`,theoryAndConcepts:`WHAT IS ARRAY FLATTENING?
-------------------------
Flattening reduces array nesting by concatenating sub-arrays into
the parent array up to a specified depth.

EXAMPLE:
[1, [2, [3, [4]]]]
flat(1): [1, 2, [3, [4]]]
flat(2): [1, 2, 3, [4]]
flat(Infinity): [1, 2, 3, 4]

NATIVE METHOD (ES2019):
Array.prototype.flat(depth = 1)
Array.prototype.flatMap(callback) = map + flat(1)

USE CASES:
----------
1. Normalizing data from APIs
2. Processing nested structures
3. Combining results from multiple sources
4. Simplifying recursive data



APPROACHES:
-----------
1. Recursive - Simple, natural for trees
2. Iterative with stack - Avoids recursion limit
3. reduce + concat - Functional style
4. Generator - Memory efficient for large arrays`,beginnerApproach:`Beginner: Flatten one level (depth = 1)`,beginnerImplementation:`function flattenOnce(arr) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // Spread nested array
      for (let j = 0; j < arr[i].length; j++) {
        result.push(arr[i][j]);
      }
    } else {
      result.push(arr[i]);
    }
  }
  
  return result;
}

// Using concat
function flattenOnceConcat(arr) {
  return [].concat(...arr);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const nested1 = [1, [2, 3], [4, 5]];
console.log('flattenOnce:', flattenOnce(nested1)); // [1, 2, 3, 4, 5]
console.log('flattenOnceConcat:', flattenOnceConcat(nested1)); // [1, 2, 3, 4, 5]

const nested2 = [1, [2, [3, 4]]];
console.log('One level only:', flattenOnce(nested2)); // [1, 2, [3, 4]]`,intermediateApproach:`Intermediate: Recursive flatten with configurable depth`,intermediateImplementation:`function flatten(arr, depth = 1) {
  // Base case: no more flattening needed
  if (depth < 1) {
    return arr.slice(); // Return copy
  }
  
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    
    if (Array.isArray(item)) {
      // Recursively flatten with reduced depth
      const flattened = flatten(item, depth - 1);
      result.push(...flattened);
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Using reduce (functional style)
function flattenReduce(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((acc, val) => {
        return acc.concat(
          Array.isArray(val) ? flattenReduce(val, depth - 1) : val
        );
      }, [])
    : arr.slice();
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const deepNested = [1, [2, [3, [4, [5]]]]];
console.log('depth 1:', flatten(deepNested, 1));          // [1, 2, [3, [4, [5]]]]
console.log('depth 2:', flatten(deepNested, 2));          // [1, 2, 3, [4, [5]]]
console.log('depth 3:', flatten(deepNested, 3));          // [1, 2, 3, 4, [5]]
console.log('depth Infinity:', flatten(deepNested, Infinity)); // [1, 2, 3, 4, 5]`,expertApproach:`Expert: Iterative flatten (avoids stack overflow for very deep arrays)


Expert: Generator-based flatten (memory efficient)


Expert: Polyfill for Array.prototype.flat


Expert: Polyfill for Array.prototype.flatMap`,expertImplementation:`function flattenIterative(arr, depth = 1) {
  // Stack holds [item, currentDepth]
  const stack = arr.map(item => [item, depth]);
  const result = [];
  
  while (stack.length > 0) {
    const [item, d] = stack.pop();
    
    if (Array.isArray(item) && d > 0) {
      // Add items in reverse order (to maintain original order)
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push([item[i], d - 1]);
      }
    } else {
      result.push(item);
    }
  }
  
  return result.reverse(); // Reverse because we popped
}

function* flattenGenerator(arr, depth = 1) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flattenGenerator(item, depth - 1);
    } else {
      yield item;
    }
  }
}

if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    // Convert depth to number
    const d = Math.floor(Number(depth)) || 0;
    
    if (d < 1) {
      return this.slice();
    }
    
    return this.reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(val.flat(d - 1));
      }
      return acc.concat(val);
    }, []);
  };
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map(callback, thisArg).flat(1);
  };
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Iterative (handles very deep nesting)
console.log('Iterative:', flattenIterative([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]

// Generator
const gen = flattenGenerator([1, [2, [3, [4]]]], 2);
console.log('Generator:', [...gen]); // [1, 2, 3, [4]]

// FlatMap example
const sentences = ['Hello World', 'How are you'];
console.log('FlatMap:', sentences.flatMap(s => s.split(' '))); // ['Hello', 'World', 'How', 'are', 'you']`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Empty arrays`,`console.log('Empty:', flatten([])); // []`,`console.log('Nested empty:', flatten([[], [[]]])); // [[]]`,`EDGE CASE 2: Sparse arrays (holes)`,`const sparse = [1, , 3, , 5];`,`console.log('Sparse:', flatten([sparse])); // [1, 3, 5] - holes removed!`,`EDGE CASE 3: Non-array items that look like arrays`],stepByStep:[`Recursive: Create an outer result array and an inner helper that iterates each element.`,`If the element is an array, recurse into it. If not, push it to the result.`,`Depth-limited: Add a depth parameter. Only recurse if depth > 0, decrementing each level.`,`If depth reaches 0, push the element as-is (even if it's an array).`,`Iterative: Initialize a stack with the input array elements.`,`Pop from the stack: if it's an array, push its elements back onto the stack; if not, add to result.`,`Since stack processes in reverse (LIFO), reverse the result at the end to restore original order.`],timeComplexity:`O(n) for all versions where n is the total number of elements across all nesting levels.`,spaceComplexity:`O(n) for the output array. Recursive versions also use O(d) call stack where d is max depth. Iterative uses O(n) for the explicit stack.`,commonMistakes:[`Using concat in a loop creating O(n^2) copies instead of pushing to a shared result array`,`In the iterative version, forgetting to reverse the result (stack reverses order)`,`Not decrementing depth correctly in the depth-limited version`,`Mutating the original array instead of creating a new result`],followUps:[`How does Array.prototype.flat(Infinity) differ from your implementation?`,`How would you implement a depth-limited iterative version?`,`How would you flatten an object's nested keys into dot-notation paths?`]},{id:`coding-remove-falsy`,title:`Remove Falsy Values from Nested Object`,difficulty:`Intermediate`,category:`Coding`,tags:[`recursion`,`objects`,`filtering`,`data-cleaning`,`nested-structures`],problem:`Implement a function that recursively removes all falsy values from a deeply nested object. Falsy values in JavaScript are: false, 0, -0, 0n, "", null, undefined, and NaN. The function should traverse objects and arrays at every level, removing falsy entries.

For objects, remove keys whose values are falsy. For arrays, filter out falsy elements. For nested objects and arrays, recurse into them first, then check if the resulting object/array is empty — if so, remove it too (since an empty object or array after cleaning provides no useful data).

This is a practical data-cleaning utility used in form processing (removing empty fields before submission), API payload optimization (reducing transfer size), configuration merging (stripping unset values), and database query building (omitting null parameters). It tests recursive traversal, type checking, and the nuanced definition of "falsy" in JavaScript.`,requirements:[`Remove all falsy values (false, 0, "", null, undefined, NaN) from objects`,`Filter falsy values from arrays`,`Recursively process nested objects and arrays`,`Remove empty objects ({}) and empty arrays ([]) that result from cleaning`,`Preserve truthy values including objects, arrays, strings, numbers`,`Return a new structure without mutating the original`,`Handle the root value being falsy (return undefined or empty object)`],examples:[{input:`removeFalsy({ a: 1, b: null, c: { d: "", e: 2, f: undefined }, g: false })`,output:`{ a: 1, c: { e: 2 } }`,explanation:`null, empty string, undefined, and false are removed. The nested object c retains only its truthy value e.`},{input:`removeFalsy({ a: [1, 0, null, 2, "", 3], b: { c: { d: null } } })`,output:`{ a: [1, 2, 3] }`,explanation:`Array is filtered. Nested object b.c becomes empty after removing d:null, then b becomes empty, so both are removed.`},{input:`removeFalsy({ x: 0, y: "hello", z: { nested: NaN } })`,output:`{ y: "hello" }`,explanation:`0 and NaN are falsy. The nested object with only NaN becomes empty and is removed.`}],edgeCases:[`All values are falsy (should return empty object or undefined)`,`Deeply nested structure where cleaning propagates upward`,`Arrays containing objects that become empty after cleaning`,`Value 0 is falsy — important distinction from "zero is valid data" use cases`,`Empty string "" is falsy — may need a custom predicate for form data`],naiveApproach:`A naive approach only removes top-level falsy values using Object.entries and filter, ignoring nested structures. Another common mistake is removing falsy values but not cleaning up the resulting empty objects/arrays, leading to hollow structures like { a: {}, b: [] } that are effectively empty but still present. A third mistake is mutating the original object instead of creating a clean copy.`,optimalApproach:`The optimal approach uses a recursive function with bottom-up cleaning. For arrays: map each element through the function recursively, then filter out falsy values and empty containers. For objects: iterate keys, recursively clean each value, and only include the key in the result if the cleaned value is truthy and not an empty container.

The "bottom-up" strategy is key: clean the deepest levels first, then check if the resulting container is empty. This naturally handles cases where nested objects become empty after their children are removed. A helper function isEmptyContainer checks if a value is {} or [], and is used after recursive cleaning to decide whether to include the value.

For flexibility, accepting a custom predicate instead of the default Boolean check allows users to customize what counts as "falsy" (e.g., keeping 0 but removing null).`,implementation:`function removeFalsy(value, predicate) {
  const shouldRemove = predicate || ((v) => !v && v !== undefined);

  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      const cleaned = val
        .map(item => clean(item))
        .filter(item => {
          if (isEmptyContainer(item)) return false;
          return !!item || item === 0 || item === false;
        });
      return cleaned;
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (isEmptyContainer(cleaned)) continue;
        if (!cleaned && cleaned !== 0 && cleaned !== false) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  if (isEmptyContainer(result)) return Array.isArray(value) ? [] : {};
  return result;
}

// Stricter version that removes all JS falsy values
function removeFalsyStrict(value) {
  function isEmptyContainer(v) {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val) {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const key of Object.keys(val)) {
        const cleaned = clean(val[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result) ? (Array.isArray(value) ? [] : {}) : result;
}

// Usage
const formData = {
  name: 'Alice',
  age: 0,
  email: '',
  address: {
    street: '123 Main St',
    apt: null,
    city: '',
    state: 'CA',
    details: { floor: undefined, notes: '' },
  },
  tags: ['dev', '', null, 'admin'],
  preferences: { theme: null, lang: undefined },
};

console.log(removeFalsyStrict(formData));
// {
//   name: 'Alice',
//   address: { street: '123 Main St', state: 'CA' },
//   tags: ['dev', 'admin']
// }`,implementationTS:`function removeFalsyStrict(value: unknown): unknown {
  function isEmptyContainer(v: unknown): boolean {
    if (Array.isArray(v)) return v.length === 0;
    if (v && typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }

  function clean(val: unknown): unknown {
    if (Array.isArray(val)) {
      return val
        .map(item => clean(item))
        .filter(item => !isEmptyContainer(item) && Boolean(item));
    }

    if (val !== null && typeof val === 'object') {
      const result: Record<string, unknown> = {};
      const obj = val as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        const cleaned = clean(obj[key]);
        if (!Boolean(cleaned) || isEmptyContainer(cleaned)) continue;
        result[key] = cleaned;
      }
      return result;
    }

    return val;
  }

  const result = clean(value);
  return isEmptyContainer(result)
    ? (Array.isArray(value) ? [] : {})
    : result;
}`,theoryAndConcepts:`WHAT ARE FALSY VALUES IN JAVASCRIPT?
------------------------------------
Values that evaluate to false in boolean context:

1. false        - boolean false
2. 0            - zero
3. -0           - negative zero
4. 0n           - BigInt zero
5. ""           - empty string
6. null         - null
7. undefined    - undefined
8. NaN          - Not a Number

TRUTHY VALUES (NOT falsy):
- true
- Any non-zero number
- Non-empty string
- Objects {} (even empty!)
- Arrays [] (even empty!)
- Functions

USE CASES:
----------
1. Cleaning API responses
2. Form data sanitization
3. Removing optional empty fields
4. Preparing data for storage`,beginnerApproach:`Beginner: Remove falsy values from array


Beginner: Remove falsy values from object (shallow)`,beginnerImplementation:`function compactArrayBeginner(arr) {
  return arr.filter(Boolean);
  // Same as: arr.filter(item => Boolean(item))
  // Same as: arr.filter(item => !!item)
}

function compactObjectBeginner(obj) {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Array
const arr = [0, 1, false, 2, '', 3, null, undefined, NaN, 4];
console.log('Compact array:', compactArrayBeginner(arr));
// [1, 2, 3, 4]

// Object
const obj = {
  name: 'John',
  age: 0,
  email: '',
  active: false,
  address: null,
  phone: undefined
};
console.log('Compact object:', compactObjectBeginner(obj));
// { name: 'John' }`,intermediateApproach:`Intermediate: Deep compact with options`,intermediateImplementation:`function compactIntermediate(value, options = {}) {
  const {
    deep = true,              // Recursively compact nested objects
    removeEmptyArrays = false,// Remove [] as falsy
    removeEmptyObjects = false,// Remove {} as falsy
    removeZero = false,       // Treat 0 as falsy (it is by default)
    keepZero = false,         // Explicitly keep 0 (override default)
    keepEmptyString = false   // Keep empty strings
  } = options;
  
  function isFalsy(val) {
    if (val === null || val === undefined || Number.isNaN(val)) {
      return true;
    }
    if (val === false) return true;
    if (val === 0 && !keepZero) return true;
    if (val === '' && !keepEmptyString) return true;
    if (removeEmptyArrays && Array.isArray(val) && val.length === 0) return true;
    if (removeEmptyObjects && isPlainObject(val) && Object.keys(val).length === 0) return true;
    return false;
  }
  
  function isPlainObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
  
  function compact(val) {
    // Handle arrays
    if (Array.isArray(val)) {
      const result = val
        .map(item => deep ? compact(item) : item)
        .filter(item => !isFalsy(item));
      
      return removeEmptyArrays && result.length === 0 ? undefined : result;
    }
    
    // Handle plain objects
    if (isPlainObject(val)) {
      const result = {};
      
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const processed = deep ? compact(val[key]) : val[key];
          
          if (!isFalsy(processed)) {
            result[key] = processed;
          }
        }
      }
      
      return removeEmptyObjects && Object.keys(result).length === 0 ? undefined : result;
    }
    
    // Return primitives as-is (filtering happens at parent level)
    return val;
  }
  
  return compact(value);
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const nestedData = {
  user: {
    name: 'John',
    age: 0,
    profile: {
      bio: '',
      avatar: null,
      social: {
        twitter: '@john',
        facebook: ''
      }
    }
  },
  items: [1, 0, null, '', 'valid', { empty: '' }],
  empty: {},
  emptyArr: []
};

console.log('Deep compact:');
console.log(JSON.stringify(compactIntermediate(nestedData), null, 2));

console.log('\\nWith options (keep zero, remove empty):');
console.log(JSON.stringify(compactIntermediate(nestedData, {
  keepZero: true,
  removeEmptyArrays: true,
  removeEmptyObjects: true
}), null, 2));`,expertApproach:`Expert: Highly configurable compactor`,expertImplementation:`class DataCompactor {
  constructor(options = {}) {
    this.options = {
      deep: true,
      customFalsyCheck: null,  // Custom function to determine falsy
      preserveKeys: [],        // Keys to never remove
      removeKeys: [],          // Keys to always remove
      transformers: {},        // Transform values before checking
      maxDepth: Infinity,
      ...options
    };
  }
  
  isFalsy(value, key, depth) {
    // Custom check
    if (this.options.customFalsyCheck) {
      return this.options.customFalsyCheck(value, key, depth);
    }
    
    // Standard falsy check
    if (value === null || value === undefined) return true;
    if (value === false) return true;
    if (value === '') return true;
    if (typeof value === 'number' && (value === 0 || Number.isNaN(value))) return true;
    
    return false;
  }
  
  shouldRemoveKey(key) {
    return this.options.removeKeys.includes(key);
  }
  
  shouldPreserveKey(key) {
    return this.options.preserveKeys.includes(key);
  }
  
  compact(value, currentDepth = 0, parentKey = null) {
    // Max depth reached
    if (currentDepth > this.options.maxDepth) {
      return value;
    }
    
    // Apply transformer
    if (parentKey && this.options.transformers[parentKey]) {
      value = this.options.transformers[parentKey](value);
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      const result = [];
      
      for (let i = 0; i < value.length; i++) {
        const item = this.options.deep 
          ? this.compact(value[i], currentDepth + 1, null)
          : value[i];
        
        if (!this.isFalsy(item, i, currentDepth)) {
          result.push(item);
        }
      }
      
      return result;
    }
    
    // Handle objects
    if (value !== null && typeof value === 'object') {
      const result = {};
      
      for (const key of Object.keys(value)) {
        // Always remove certain keys
        if (this.shouldRemoveKey(key)) continue;
        
        const processed = this.options.deep
          ? this.compact(value[key], currentDepth + 1, key)
          : value[key];
        
        // Preserve certain keys regardless of value
        if (this.shouldPreserveKey(key)) {
          result[key] = processed;
          continue;
        }
        
        if (!this.isFalsy(processed, key, currentDepth)) {
          result[key] = processed;
        }
      }
      
      return result;
    }
    
    return value;
  }
  
  // Fluent API
  preserveKey(...keys) {
    this.options.preserveKeys.push(...keys);
    return this;
  }
  
  removeKey(...keys) {
    this.options.removeKeys.push(...keys);
    return this;
  }
  
  transform(key, fn) {
    this.options.transformers[key] = fn;
    return this;
  }
  
  setFalsyCheck(fn) {
    this.options.customFalsyCheck = fn;
    return this;
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const compactor = new DataCompactor()
  .preserveKey('id', 'version')      // Never remove these
  .removeKey('_internal', 'debug')   // Always remove these
  .transform('name', v => v?.trim()) // Trim names
  .setFalsyCheck((value, key, depth) => {
    // Custom: Keep 0 for 'count' fields
    if (key === 'count' && value === 0) return false;
    // Standard check
    return value === null || value === undefined || value === '' || value === false;
  });

const complexData = {
  id: 0,                    // Preserved (even though 0)
  version: '',              // Preserved (even though empty)
  name: '  John  ',         // Transformed (trimmed)
  _internal: 'secret',      // Removed
  debug: true,              // Removed
  count: 0,                 // Kept (custom check)
  status: null,             // Removed
  nested: {
    value: '',              // Removed
    count: 0                // Kept
  }
};

console.log('Expert compacted:', compactor.compact(complexData));`,interviewTraps:[`QUICK REFERENCE:`,`Falsy: false, 0, -0, 0n, "", null, undefined, NaN`,`Truthy: Everything else (including [] and {})`,`INTERVIEW TIPS:`,`1. List all 8 falsy values`,`2. Explain [] and {} are truthy`,`3. Mention NaN !== NaN`,`4. Discuss deep vs shallow compact`],stepByStep:[`Define a helper isEmptyContainer to check if a value is an empty array or empty object.`,`For arrays: recursively clean each element via map, then filter out falsy values and empty containers.`,`For objects: iterate keys, recursively clean each value, skip falsy or empty container results.`,`For primitives: return the value as-is (the parent will decide whether to include it).`,`The bottom-up approach ensures nested empty containers are detected after their children are cleaned.`,`After the root-level clean, check if the result itself is an empty container.`],timeComplexity:`O(n) where n is the total number of values in the nested structure.`,spaceComplexity:`O(n) for the new cleaned structure, plus O(d) recursion depth.`,commonMistakes:[`Not handling the typeof null === "object" gotcha, causing crashes when recursing into null`,`Removing 0 or false when they should be treated as valid data (depends on use case)`,`Not cleaning up empty containers after removing their children`,`Mutating the original object instead of building a new one`],followUps:[`How would you make this configurable — e.g., keep 0 and false but remove null and undefined?`,`How would you implement the inverse: extract all paths with falsy values for validation errors?`,`How would you handle this with immutable data structures (e.g., Immer)?`]},{id:`coding-async-series`,title:`Execute Async Tasks in Series`,difficulty:`Intermediate`,category:`Coding`,tags:[`async`,`promises`,`series-execution`,`callbacks`,`control-flow`],problem:`Implement a function \`asyncSeries\` that takes an array of asynchronous task functions and executes them one after another — in series — collecting the resolved results in order. Each task is a function that returns a Promise. The next task must not start until the previous one has resolved.

This is a fundamental async control-flow pattern used extensively in real-world applications: database migrations that must run sequentially, file processing pipelines where each step depends on the previous, API calls that must respect rate limits, and initialization sequences where services depend on each other.

Your function should return a Promise that resolves with an array of all results in the same order as the input tasks. If any task rejects, the entire series should reject immediately with that error, without executing remaining tasks.`,requirements:[`Accept an array of functions, each returning a Promise`,`Execute tasks strictly one at a time in input order`,`Collect all resolved values into an array preserving order`,`Return a Promise that resolves with the results array`,`Reject immediately if any task rejects, skipping remaining tasks`,`Handle an empty tasks array by resolving with an empty array`,`Each task receives no arguments (zero-parameter async functions)`],examples:[{input:`const tasks = [
  () => new Promise(res => setTimeout(() => res('a'), 100)),
  () => new Promise(res => setTimeout(() => res('b'), 50)),
  () => new Promise(res => setTimeout(() => res('c'), 75)),
];
asyncSeries(tasks);`,output:`Promise resolves with ['a', 'b', 'c']`,explanation:`Even though task 2 has a shorter delay, it only starts after task 1 completes. Results are in input order.`},{input:`const tasks = [
  () => Promise.resolve(1),
  () => Promise.reject(new Error('fail')),
  () => Promise.resolve(3),
];
asyncSeries(tasks);`,output:`Promise rejects with Error('fail')`,explanation:`Task 2 rejects, so task 3 never executes and the overall promise rejects.`},{input:`asyncSeries([]);`,output:`Promise resolves with []`,explanation:`An empty input array resolves with an empty results array.`}],edgeCases:[`Empty tasks array should resolve with []`,`Single task array should resolve with a single-element array`,`Task that rejects should halt execution of subsequent tasks`,`Tasks returning non-Promise values (auto-wrapped by async/await)`,`Tasks with varying execution times still run strictly in order`],naiveApproach:`A naive approach might try to use forEach or map with async callbacks, but these don't actually serialize execution — all tasks would start nearly simultaneously. Another naive attempt uses a simple for loop without await, which similarly fails to wait for each task to finish. Some developers attempt to chain .then() calls manually with reduce but get confused about accumulating results.`,optimalApproach:`The optimal approach uses a simple async/await for...of loop. Declare an empty results array, then iterate through the tasks array. For each task function, await its invocation and push the resolved value into the results array. Because await pauses the loop until the Promise settles, each task is guaranteed to complete before the next begins.

Alternatively, you can use Array.reduce to build a Promise chain. Start with Promise.resolve([]) as the accumulator. For each task, chain a .then() that invokes the task, awaits its result, and appends it to the accumulated array. This approach is more functional but harder to read. The async/await approach is preferred for clarity and is equally performant. Both approaches correctly propagate rejections — await throws on rejection, and an unhandled .then() rejection propagates down the chain.`,implementation:`function asyncSeries(tasks) {
  return tasks.reduce((chain, task) => {
    return chain.then((results) => {
      return task().then((result) => {
        results.push(result);
        return results;
      });
    });
  }, Promise.resolve([]));
}

async function asyncSeriesAwait(tasks) {
  const results = [];
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  return results;
}

// Usage
const tasks = [
  () => new Promise((res) => setTimeout(() => res('first'), 300)),
  () => new Promise((res) => setTimeout(() => res('second'), 100)),
  () => new Promise((res) => setTimeout(() => res('third'), 200)),
];

asyncSeries(tasks).then(console.log);
// ['first', 'second', 'third'] — order matches input, not completion time

asyncSeriesAwait(tasks).then(console.log);
// ['first', 'second', 'third']

// Error handling
const failingTasks = [
  () => Promise.resolve('ok'),
  () => Promise.reject(new Error('boom')),
  () => Promise.resolve('never reached'),
];

asyncSeries(failingTasks).catch((err) => console.log(err.message));
// 'boom' — third task never executes`,theoryAndConcepts:`SERIES vs PARALLEL EXECUTION:
-----------------------------

SERIES (Sequential):
- One task at a time
- Wait for each to complete before starting next
- Total time = sum of all task times

PARALLEL:
- All tasks at once
- Total time = longest task time

CONCURRENT (with limit):
- N tasks at a time
- Balance between series and parallel

USE CASES FOR SERIES:
---------------------
1. Order-dependent operations (create then update)
2. Rate limiting
3. Resource constraints
4. Transaction sequences
5. Testing/debugging`,beginnerApproach:`Beginner: Using async/await loop`,beginnerImplementation:`async function runSeriesBeginner(tasks) {
  const results = [];
  
  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }
  
  return results;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const tasks = [
  () => new Promise(r => setTimeout(() => { console.log('Task 1'); r(1); }, 100)),
  () => new Promise(r => setTimeout(() => { console.log('Task 2'); r(2); }, 50)),
  () => new Promise(r => setTimeout(() => { console.log('Task 3'); r(3); }, 75))
];

runSeriesBeginner(tasks).then(results => {
  console.log('Results:', results); // [1, 2, 3]
});`,intermediateApproach:`Intermediate: With error handling and callbacks


Intermediate: Using reduce (functional style)`,intermediateImplementation:`async function runSeriesIntermediate(tasks, options = {}) {
  const {
    continueOnError = false,
    onProgress = null,
    onError = null
  } = options;
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < tasks.length; i++) {
    try {
      const result = await tasks[i]();
      results.push({ status: 'fulfilled', value: result, index: i });
      
      onProgress?.({
        completed: i + 1,
        total: tasks.length,
        result,
        progress: (i + 1) / tasks.length
      });
      
    } catch (error) {
      errors.push({ index: i, error });
      results.push({ status: 'rejected', reason: error, index: i });
      
      onError?.({ index: i, error });
      
      if (!continueOnError) {
        throw error;
      }
    }
  }
  
  return { results, errors, hasErrors: errors.length > 0 };
}

function runSeriesReduce(tasks) {
  return tasks.reduce(
    (promiseChain, task) => promiseChain.then(results =>
      task().then(result => [...results, result])
    ),
    Promise.resolve([])
  );
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const mixedTasks = [
  () => Promise.resolve(1),
  () => Promise.reject(new Error('Task 2 failed')),
  () => Promise.resolve(3)
];

runSeriesIntermediate(mixedTasks, {
  continueOnError: true,
  onProgress: ({ completed, total }) => console.log(\`Progress: \${completed}/\${total}\`),
  onError: ({ index, error }) => console.log(\`Error at \${index}: \${error.message}\`)
}).then(({ results, hasErrors }) => {
  console.log('Results:', results);
  console.log('Has errors:', hasErrors);
});`,expertApproach:`Expert: Waterfall - pass result of each task to next


Expert: Series with timeout per task


Expert: Series with retry


Expert: Concurrent with limit (pool)


Expert: Async iterator for streaming results`,expertImplementation:`async function waterfall(tasks, initialValue) {
  let result = initialValue;
  
  for (const task of tasks) {
    result = await task(result);
  }
  
  return result;
}

async function runSeriesWithTimeout(tasks, timeoutMs) {
  const results = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const result = await Promise.race([
      tasks[i](),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(\`Task \${i} timed out\`)), timeoutMs)
      )
    ]);
    results.push(result);
  }
  
  return results;
}

async function runSeriesWithRetry(tasks, options = {}) {
  const { retries = 3, retryDelay = 1000 } = options;
  const results = [];
  
  for (let i = 0; i < tasks.length; i++) {
    let lastError;
    let attempts = 0;
    
    while (attempts <= retries) {
      try {
        const result = await tasks[i]();
        results.push(result);
        break;
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts > retries) {
          throw new Error(\`Task \${i} failed after \${retries} retries: \${error.message}\`);
        }
        
        await new Promise(r => setTimeout(r, retryDelay));
      }
    }
  }
  
  return results;
}

async function runConcurrent(tasks, limit = 3) {
  const results = new Array(tasks.length);
  let currentIndex = 0;
  let completedCount = 0;
  
  return new Promise((resolve, reject) => {
    function runNext() {
      const index = currentIndex++;
      
      if (index >= tasks.length) {
        if (completedCount === tasks.length) {
          resolve(results);
        }
        return;
      }
      
      tasks[index]()
        .then(result => {
          results[index] = result;
          completedCount++;
          runNext();
        })
        .catch(reject);
    }
    
    // Start initial batch
    const initialBatch = Math.min(limit, tasks.length);
    for (let i = 0; i < initialBatch; i++) {
      runNext();
    }
    
    // Handle empty tasks
    if (tasks.length === 0) {
      resolve([]);
    }
  });
}

async function* runSeriesIterator(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    const result = await tasks[i]();
    yield { index: i, result, done: i === tasks.length - 1 };
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Waterfall
const waterfallTasks = [
  (x) => Promise.resolve(x + 1),
  (x) => Promise.resolve(x * 2),
  (x) => Promise.resolve(x + 10)
];

waterfall(waterfallTasks, 5).then(result => {
  console.log('Waterfall result:', result); // ((5 + 1) * 2) + 10 = 22
});

// Concurrent with limit
const concurrentTasks = Array(10).fill(null).map((_, i) => 
  () => new Promise(r => {
    console.log(\`Starting task \${i}\`);
    setTimeout(() => {
      console.log(\`Completing task \${i}\`);
      r(i);
    }, Math.random() * 200);
  })
);

runConcurrent(concurrentTasks, 3).then(results => {
  console.log('Concurrent results:', results);
});

// Iterator usage
async function useIterator() {
  const tasks = [
    () => Promise.resolve('a'),
    () => Promise.resolve('b'),
    () => Promise.resolve('c')
  ];
  
  for await (const { index, result } of runSeriesIterator(tasks)) {
    console.log(\`Iterator - Task \${index}: \${result}\`);
  }
}

useIterator();`,interviewTraps:[`QUICK REFERENCE:`,`Series: for await...of / reduce`,`Waterfall: Pass result to next task`,`Concurrent: Control parallelism with pool`,`INTERVIEW TIPS:`,`1. Show async/await approach first`,`2. Explain difference from Promise.all`,`3. Discuss error handling strategies`],stepByStep:[`Accept an array of task functions that each return a Promise.`,`Initialize a results accumulator (empty array).`,`Iterate through tasks sequentially using reduce with Promise chain or async for...of loop.`,`For each task, invoke it and await the resolved value.`,`Push the resolved value into the results array.`,`If any task rejects, propagation halts the chain / throws in the loop.`,`After all tasks complete, return the accumulated results array.`],timeComplexity:`O(n) where n is the number of tasks (each task is invoked exactly once).`,spaceComplexity:`O(n) for storing the results array.`,commonMistakes:[`Using forEach with async callbacks — forEach does not await, so all tasks fire concurrently`,`Forgetting to invoke the task function — writing task instead of task() inside the loop`,`Not handling the empty array case — some reduce implementations throw on empty arrays without an initial value`,`Using Promise.all instead of sequential execution — Promise.all runs tasks in parallel`],followUps:[`How would you implement asyncParallel that runs all tasks concurrently?`,`How would you add a concurrency limit (e.g., run at most 3 tasks at a time)?`,`How would you modify this to pass the result of each task as input to the next (waterfall pattern)?`,`How would you implement asyncSeriesWithRetry that retries each failed task N times?`]},{id:`coding-promisify`,title:`Implement Promisify`,difficulty:`Intermediate`,category:`Coding`,tags:[`promises`,`callbacks`,`node-style`,`async`,`utility`],problem:`Implement a \`promisify\` function that converts a Node-style callback-based function into a function that returns a Promise. Node-style callbacks follow the convention where the callback is the last argument and is invoked as \`callback(error, result)\` — the first argument is an error (null if success) and the second is the result.

This pattern is essential when working with legacy Node.js APIs (fs.readFile, dns.lookup, etc.) or any library that uses the error-first callback convention. Before util.promisify was added to Node.js, developers had to write this utility themselves. Understanding how it works reveals deep knowledge of higher-order functions, closures, and the relationship between callbacks and Promises.

Your promisify function should accept a function that expects a Node-style callback as its last parameter, and return a new function with the same parameters (minus the callback) that returns a Promise. The Promise should resolve with the result on success or reject with the error on failure.`,requirements:[`Accept a function that uses a Node-style error-first callback as its last parameter`,`Return a new function that returns a Promise instead of accepting a callback`,`The returned function must forward all arguments to the original function`,`Resolve the Promise with the callback result value on success`,`Reject the Promise with the callback error on failure`,"Preserve the correct `this` context when the original function is invoked",`Handle functions with any number of parameters before the callback`],examples:[{input:`function readFile(path, callback) {
  setTimeout(() => callback(null, 'file contents'), 100);
}
const readFileAsync = promisify(readFile);
readFileAsync('/path/to/file');`,output:`Promise resolves with 'file contents'`,explanation:`The callback-based readFile is converted to return a Promise. Success calls callback(null, result), so the Promise resolves with result.`},{input:`function failingOp(callback) {
  setTimeout(() => callback(new Error('disk error')), 50);
}
const failingOpAsync = promisify(failingOp);
failingOpAsync();`,output:`Promise rejects with Error('disk error')`,explanation:`When the callback receives an error as the first argument, the Promise rejects with that error.`},{input:`function add(a, b, callback) {
  callback(null, a + b);
}
const addAsync = promisify(add);
addAsync(3, 4);`,output:`Promise resolves with 7`,explanation:`Multiple arguments before the callback are correctly forwarded.`}],edgeCases:[`Original function with zero parameters before the callback`,`Original function with multiple parameters before the callback`,`Callback invoked synchronously vs asynchronously`,"Original function that relies on `this` context",`Error is a falsy non-null value (e.g., empty string or 0)`],naiveApproach:"A naive approach hardcodes the number of arguments or doesn't preserve the `this` context. For example, wrapping the function with a fixed number of parameters and creating a new Promise inside, but not using the rest/spread pattern to handle arbitrary argument counts. Another mistake is using an arrow function for the returned function, which prevents proper `this` binding.",optimalApproach:"The optimal solution returns a regular function (not arrow, to preserve `this`) that collects all arguments using the rest operator. Inside this wrapper, create and return a new Promise. Within the Promise executor, call the original function with the spread arguments plus a callback appended at the end. The callback checks if the error argument is truthy — if so, reject the Promise; otherwise, resolve with the result.\n\nUsing a regular function expression instead of an arrow function ensures that if the promisified function is later called as a method on an object, the `this` context is correctly passed through to the original function via `.call(this, ...)`. The rest/spread pattern handles any number of leading arguments generically, making the solution work for functions with 0, 1, or N parameters before the callback.",implementation:`function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Usage with a Node-style function
function fetchData(url, callback) {
  setTimeout(() => {
    if (url.startsWith('http')) {
      callback(null, { status: 200, data: 'response from ' + url });
    } else {
      callback(new Error('Invalid URL: ' + url));
    }
  }, 100);
}

const fetchDataAsync = promisify(fetchData);

fetchDataAsync('http://example.com')
  .then((result) => console.log(result))
  .catch((err) => console.error(err.message));
// { status: 200, data: 'response from http://example.com' }

fetchDataAsync('ftp://bad')
  .catch((err) => console.error(err.message));
// 'Invalid URL: ftp://bad'

// Works with this context
const db = {
  connection: 'active',
  query(sql, callback) {
    callback(null, { sql, connection: this.connection });
  },
};

db.queryAsync = promisify(db.query);
db.queryAsync('SELECT * FROM users')
  .then((result) => console.log(result));
// { sql: 'SELECT * FROM users', connection: 'active' }`,theoryAndConcepts:`WHAT IS PROMISIFY?
------------------
Converts callback-based async functions to Promise-based ones.

CALLBACK PATTERN (Node.js style):
fn(arg1, arg2, (error, result) => { ... })

PROMISE PATTERN:
fn(arg1, arg2).then(result => { ... }).catch(error => { ... })

WHY PROMISIFY?
--------------
1. Cleaner async/await syntax
2. Better error handling
3. Easier composition
4. Modern API design

NODE.JS:
--------
Built-in: const { promisify } = require('util');`,beginnerApproach:`Beginner: Basic promisify
Assumes callback is last argument with (error, result) signature`,beginnerImplementation:`function promisifyBeginner(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      // Add callback as last argument
      fn(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Simulate callback-based function
function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === 'error') {
      callback(new Error('File not found'));
    } else {
      callback(null, \`Contents of \${path}\`);
    }
  }, 100);
}

const readFilePromise = promisifyBeginner(readFileCallback);

readFilePromise('test.txt')
  .then(contents => console.log('Success:', contents))
  .catch(error => console.log('Error:', error.message));`,intermediateApproach:`Intermediate: Handle multiple callback arguments
Some callbacks return (error, result1, result2, ...)


Intermediate: Promisify with context binding`,intermediateImplementation:`function promisifyIntermediate(fn, options = {}) {
  const { multiArgs = false } = options;
  
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (error, ...results) => {
        if (error) {
          reject(error);
        } else if (multiArgs) {
          // Return array of all results
          resolve(results);
        } else {
          // Return just the first result
          resolve(results[0]);
        }
      });
    });
  };
}

function promisifyWithContext(fn, context) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(context, ...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// Function that returns multiple values
function getCoordinates(address, callback) {
  setTimeout(() => {
    callback(null, 40.7128, -74.0060); // lat, lng
  }, 100);
}

const getCoordsPromise = promisifyIntermediate(getCoordinates, { multiArgs: true });

getCoordsPromise('New York')
  .then(([lat, lng]) => console.log('Coordinates:', lat, lng));

// With context
const database = {
  connection: 'DB_CONNECTION',
  query(sql, callback) {
    setTimeout(() => {
      callback(null, \`Result from \${this.connection}: \${sql}\`);
    }, 100);
  }
};

const queryPromise = promisifyWithContext(database.query, database);
queryPromise('SELECT * FROM users')
  .then(result => console.log('Query result:', result));`,expertApproach:`Expert: Full-featured promisify with custom resolver


Expert: Promisify all methods of an object


Expert: Callbackify (reverse of promisify)`,expertImplementation:`function promisifyExpert(fn, options = {}) {
  const {
    multiArgs = false,
    errorFirst = true,     // Error-first callback convention
    thisArg = undefined,   // Context binding
    customResolver = null  // Custom (error, ...results) => value
  } = options;
  
  // Allow promisify.custom symbol (like Node.js)
  if (fn[promisifyExpert.custom]) {
    return fn[promisifyExpert.custom];
  }
  
  return function promisified(...args) {
    const context = thisArg !== undefined ? thisArg : this;
    
    return new Promise((resolve, reject) => {
      const callback = (...callbackArgs) => {
        // Custom resolver
        if (customResolver) {
          try {
            const result = customResolver(...callbackArgs);
            resolve(result);
          } catch (error) {
            reject(error);
          }
          return;
        }
        
        if (errorFirst) {
          const [error, ...results] = callbackArgs;
          
          if (error) {
            reject(error);
          } else {
            resolve(multiArgs ? results : results[0]);
          }
        } else {
          // Non-error-first callback
          resolve(multiArgs ? callbackArgs : callbackArgs[0]);
        }
      };
      
      // Check for synchronous return that might indicate override
      const returnValue = fn.call(context, ...args, callback);
      
      // If function returns a promise directly, use that
      if (returnValue && typeof returnValue.then === 'function') {
        returnValue.then(resolve, reject);
      }
    });
  };
}

// Custom promisify symbol
promisifyExpert.custom = Symbol('util.promisify.custom');

function promisifyAll(obj, options = {}) {
  const {
    suffix = 'Async',
    filter = (key) => typeof obj[key] === 'function',
    promisifier = promisifyExpert
  } = options;
  
  const promisified = {};
  
  // Copy all properties
  Object.keys(obj).forEach(key => {
    promisified[key] = obj[key];
  });
  
  // Add promisified versions
  Object.keys(obj).forEach(key => {
    if (filter(key)) {
      promisified[key + suffix] = promisifier(obj[key].bind(obj), options);
    }
  });
  
  return promisified;
}

function callbackify(fn) {
  return function(...args) {
    const callback = args.pop();
    
    if (typeof callback !== 'function') {
      throw new TypeError('Last argument must be a callback function');
    }
    
    fn.apply(this, args)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  };
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Custom resolver
function weirdCallback(value, callback) {
  setTimeout(() => {
    callback({ success: true, data: value * 2 }, null); // Data first, error second!
  }, 100);
}

const weirdPromise = promisifyExpert(weirdCallback, {
  customResolver: (response, error) => {
    if (error) throw error;
    return response.data;
  }
});

weirdPromise(21).then(result => console.log('Custom resolver:', result)); // 42

// Promisify all
const fs = {
  readFile(path, cb) { setTimeout(() => cb(null, 'contents'), 50); },
  writeFile(path, data, cb) { setTimeout(() => cb(null), 50); },
  unlink(path, cb) { setTimeout(() => cb(null), 50); }
};

const fsPromises = promisifyAll(fs);
console.log('Promisified methods:', Object.keys(fsPromises).filter(k => k.endsWith('Async')));

fsPromises.readFileAsync('test.txt')
  .then(contents => console.log('Read result:', contents));

// Custom promisify symbol usage
function specialFn(callback) {
  callback(null, 'default');
}
specialFn[promisifyExpert.custom] = () => Promise.resolve('custom implementation');

const specialPromise = promisifyExpert(specialFn);
specialPromise().then(result => console.log('Custom symbol:', result)); // 'custom implementation'

// Callbackify
async function asyncFn(x) {
  return x * 2;
}

const callbackFn = callbackify(asyncFn);
callbackFn(21, (err, result) => {
  console.log('Callbackified:', result); // 42
});`,interviewTraps:[`QUICK REFERENCE:`,`1. Error-first callback: (error, result) => {}`,`2. Add callback as last argument`,"3. Preserve `this` context with .call()",`4. Handle multiple results with array`,`INTERVIEW TIPS:`,`1. Explain callback convention`,`2. Show basic implementation first`],stepByStep:[`Accept the original callback-based function as a parameter.`,"Return a new regular function (not arrow) to preserve `this` context.",`Collect all arguments to the new function using the rest operator (...args).`,`Inside the returned function, create and return a new Promise.`,`In the Promise executor, call the original function with fn.call(this, ...args, callback).`,`Append a callback as the last argument that checks the error parameter.`,`If error is truthy, reject the Promise with the error.`,`If error is falsy, resolve the Promise with the result.`],timeComplexity:`O(1) for the promisify wrapper creation. Runtime depends on the original function.`,spaceComplexity:`O(1) additional space — one closure per promisified call.`,commonMistakes:["Using an arrow function for the returned function, which breaks `this` context propagation",`Forgetting to use the rest/spread pattern, hardcoding a fixed number of arguments`,`Not appending the callback as the last argument via fn.call or fn.apply`,`Checking err !== null instead of just truthiness — some callbacks pass undefined for no error`],followUps:[`How would you handle functions whose callbacks receive multiple success values (e.g., callback(err, bytesRead, buffer))?`,`How does Node.js util.promisify handle custom promisify symbols?`,`How would you implement callbackify — the reverse of promisify?`,`How would you promisify an entire object of methods at once?`]},{id:`coding-camel-case`,title:`Convert Object Keys to camelCase Recursively`,difficulty:`Intermediate`,category:`Coding`,tags:[`recursion`,`objects`,`string-manipulation`,`data-transformation`,`api`],problem:"Implement a function `camelCaseKeys` that takes an object (or array) and recursively converts all of its keys from snake_case (or kebab-case, PascalCase, etc.) to camelCase. This is an extremely common real-world task when consuming REST APIs that return snake_case JSON but your frontend code uses camelCase conventions.\n\nThe function must handle deeply nested structures: objects within objects, arrays of objects, mixed arrays containing both primitives and objects, and any combination thereof. Primitives (strings, numbers, booleans, null) should pass through unchanged. Array elements should each be processed recursively, but array indices should not be treated as keys to convert.\n\nThe string conversion must handle multiple common patterns: `user_name` → `userName`, `first-name` → `firstName`, `Content-Type` → `contentType`, and `__private_field__` → `privateField`. Leading/trailing delimiters should be stripped, and consecutive delimiters should be treated as a single separator.",requirements:[`Convert snake_case keys to camelCase (user_name → userName)`,`Convert kebab-case keys to camelCase (content-type → contentType)`,`Handle deeply nested objects recursively`,`Process arrays by recursively converting each element`,`Preserve primitive values (string, number, boolean, null, undefined) unchanged`,`Handle edge cases like empty objects, empty arrays, and null input`,`Strip leading and trailing underscores/hyphens from keys`],examples:[{input:`camelCaseKeys({ user_name: 'Alice', user_age: 30 })`,output:`{ userName: 'Alice', userAge: 30 }`,explanation:`Top-level snake_case keys are converted to camelCase. Primitive values are unchanged.`},{input:`camelCaseKeys({
  user_profile: {
    first_name: 'Bob',
    address_info: { street_name: '123 Main' }
  }
})`,output:`{ userProfile: { firstName: 'Bob', addressInfo: { streetName: '123 Main' } } }`,explanation:`Nested object keys are recursively converted at all levels.`},{input:`camelCaseKeys([
  { item_id: 1, item_name: 'Apple' },
  { item_id: 2, item_name: 'Banana' },
])`,output:`[{ itemId: 1, itemName: 'Apple' }, { itemId: 2, itemName: 'Banana' }]`,explanation:`Array elements that are objects have their keys converted; the array structure is preserved.`}],edgeCases:[`Null or undefined input should return null/undefined`,`Primitive values (string, number) should be returned as-is`,`Already-camelCase keys should remain unchanged`,`Keys with consecutive underscores (e.g., __proto__) should be handled`,`Mixed arrays containing both objects and primitives`,`Empty objects and empty arrays should return empty equivalents`],naiveApproach:`A naive approach only handles the top level — iterating over Object.keys and converting each key without recursing into nested objects. This breaks on real-world API responses that have nested structures. Another common mistake is using a regex replace that only handles the first delimiter occurrence instead of all of them.`,optimalApproach:`The optimal approach separates the key conversion logic from the recursive traversal. First, write a toCamelCase helper that splits a string by underscores, hyphens, or word boundaries (using a regex like /[_\\-\\s]+/ or splitting on non-alphanumeric characters), lowercases the first segment, and capitalizes the first letter of each subsequent segment.

Then write the recursive camelCaseKeys function. Check the type of the input: if it's null or a primitive, return it directly. If it's an array, map over each element and recurse. If it's an object, iterate over its keys, convert each key with toCamelCase, and set the value to the recursively processed original value. This separation of concerns makes the code clean and testable — you can unit test the string conversion independently from the recursion logic.`,implementation:`function toCamelCase(str) {
  return str
    .replace(/^[_\\-]+|[_\\-]+$/g, '')
    .split(/[_\\-\\s]+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

function camelCaseKeys(input) {
  if (input === null || input === undefined) return input;
  if (typeof input !== 'object') return input;

  if (Array.isArray(input)) {
    return input.map((item) => camelCaseKeys(item));
  }

  const result = {};
  for (const key of Object.keys(input)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = camelCaseKeys(input[key]);
  }
  return result;
}

// Usage
const apiResponse = {
  user_id: 42,
  user_name: 'alice_wonder',
  account_details: {
    created_at: '2024-01-15',
    last_login: '2024-06-01',
    billing_address: {
      street_name: '123 Main St',
      zip_code: '10001',
    },
  },
  order_history: [
    { order_id: 1, total_amount: 29.99, line_items: [{ item_name: 'Widget' }] },
    { order_id: 2, total_amount: 49.99, line_items: [{ item_name: 'Gadget' }] },
  ],
};

const result = camelCaseKeys(apiResponse);
console.log(result.userName);                        // 'alice_wonder'
console.log(result.accountDetails.billingAddress);   // { streetName: '123 Main St', zipCode: '10001' }
console.log(result.orderHistory[0].lineItems[0]);    // { itemName: 'Widget' }

// Edge cases
console.log(camelCaseKeys(null));                    // null
console.log(camelCaseKeys('hello'));                  // 'hello'
console.log(camelCaseKeys([]));                       // []
console.log(camelCaseKeys({ already_camel: 'ok' })); // { alreadyCamel: 'ok' }`,theoryAndConcepts:`NAMING CONVENTIONS:
-------------------

camelCase:   myVariableName   (lowercase first, capitalize words)
PascalCase:  MyVariableName   (capitalize all words including first)
snake_case:  my_variable_name (lowercase with underscores)
kebab-case:  my-variable-name (lowercase with hyphens)
SCREAMING_SNAKE_CASE: MY_VARIABLE_NAME (uppercase with underscores)

WHY CONVERT?
------------
- APIs often use snake_case (Python, Ruby backends)
- JavaScript convention is camelCase
- Database columns often snake_case
- CSS uses kebab-case`,beginnerApproach:`Beginner: Convert string to camelCase


Beginner: Convert object keys (shallow)`,beginnerImplementation:`function toCamelCaseBeginner(str) {
  return str
    // Replace underscores and hyphens with spaces
    .replace(/[-_]+/g, ' ')
    // Capitalize first letter of each word (except first)
    .replace(/\\s+(.)/g, (match, char) => char.toUpperCase())
    // Remove remaining spaces and lowercase first char
    .replace(/\\s/g, '')
    .replace(/^./, char => char.toLowerCase());
}

function camelCaseKeysBeginner(obj) {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = toCamelCaseBeginner(key);
      result[camelKey] = obj[key];
    }
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log('String conversions:');
console.log('snake_case:', toCamelCaseBeginner('hello_world'));      // helloWorld
console.log('kebab-case:', toCamelCaseBeginner('hello-world'));      // helloWorld
console.log('mixed:', toCamelCaseBeginner('hello_world-test'));      // helloWorldTest

const snakeObj = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com'
};

console.log('Object:', camelCaseKeysBeginner(snakeObj));`,intermediateApproach:`Intermediate: Deep conversion with better regex


Intermediate: Deep key transformation`,intermediateImplementation:`function toCamelCase(str) {
  return str
    .replace(/[-_\\s]+(.)?/g, (match, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\\s]+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\\s]+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toScreamingSnakeCase(str) {
  return toSnakeCase(str).toUpperCase();
}

function transformKeysDeep(obj, transformer, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    const result = [];
    seen.set(obj, result);
    
    for (let i = 0; i < obj.length; i++) {
      result[i] = transformKeysDeep(obj[i], transformer, seen);
    }
    return result;
  }
  
  // Handle objects
  const result = {};
  seen.set(obj, result);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = transformer(key);
      result[newKey] = transformKeysDeep(obj[key], transformer, seen);
    }
  }
  
  return result;
}

// Convenience functions
const camelCaseKeysDeep = (obj) => transformKeysDeep(obj, toCamelCase);
const snakeCaseKeysDeep = (obj) => transformKeysDeep(obj, toSnakeCase);
const kebabCaseKeysDeep = (obj) => transformKeysDeep(obj, toKebabCase);

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const apiResponse = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  contact_info: {
    email_address: 'john@example.com',
    phone_number: '123-456-7890',
    mailing_address: {
      street_name: '123 Main St',
      zip_code: '12345'
    }
  },
  user_roles: ['admin_user', 'power_user']  // Array values NOT changed
};

console.log('Deep camelCase:');
console.log(JSON.stringify(camelCaseKeysDeep(apiResponse), null, 2));

// Reverse: camelCase to snake_case
const jsObject = {
  userId: 1,
  firstName: 'John',
  contactInfo: {
    emailAddress: 'john@example.com'
  }
};

console.log('\\nDeep snake_case:');
console.log(JSON.stringify(snakeCaseKeysDeep(jsObject), null, 2));`,expertApproach:`Expert: Highly configurable key transformer


Expert: Bidirectional transformer (for API communication)`,expertImplementation:`class KeyTransformer {
  static converters = {
    camel: toCamelCase,
    snake: toSnakeCase,
    kebab: toKebabCase,
    pascal: toPascalCase,
    screaming: toScreamingSnakeCase
  };
  
  constructor(options = {}) {
    this.options = {
      case: 'camel',           // Target case
      deep: true,              // Transform nested objects
      preserveKeys: [],        // Keys to not transform
      transformValues: false,  // Also transform string values
      maxDepth: Infinity,
      ...options
    };
    
    this.converter = KeyTransformer.converters[this.options.case] || toCamelCase;
  }
  
  shouldTransformKey(key) {
    return !this.options.preserveKeys.includes(key);
  }
  
  transform(obj, depth = 0) {
    if (obj === null || typeof obj !== 'object') {
      // Optionally transform string values
      if (this.options.transformValues && typeof obj === 'string') {
        return this.converter(obj);
      }
      return obj;
    }
    
    if (depth > this.options.maxDepth) {
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.transform(item, depth + 1));
    }
    
    // Handle objects
    const result = {};
    
    for (const key of Object.keys(obj)) {
      const newKey = this.shouldTransformKey(key) ? this.converter(key) : key;
      
      if (this.options.deep) {
        result[newKey] = this.transform(obj[key], depth + 1);
      } else {
        result[newKey] = obj[key];
      }
    }
    
    return result;
  }
}

function createApiTransformer(options = {}) {
  const {
    requestCase = 'snake',  // JS -> API
    responseCase = 'camel'  // API -> JS
  } = options;
  
  const toRequest = new KeyTransformer({ case: requestCase });
  const fromResponse = new KeyTransformer({ case: responseCase });
  
  return {
    // Transform JS object for API request
    toApi(obj) {
      return toRequest.transform(obj);
    },
    
    // Transform API response to JS
    fromApi(obj) {
      return fromResponse.transform(obj);
    },
    
    // Wrap fetch with automatic transformation
    async fetch(url, options = {}) {
      const transformedOptions = { ...options };
      
      if (options.body && typeof options.body === 'object') {
        transformedOptions.body = JSON.stringify(this.toApi(options.body));
        transformedOptions.headers = {
          'Content-Type': 'application/json',
          ...options.headers
        };
      }
      
      const response = await fetch(url, transformedOptions);
      const data = await response.json();
      
      return this.fromApi(data);
    }
  };
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Preserve certain keys
const transformer = new KeyTransformer({
  case: 'camel',
  preserveKeys: ['_id', '__v']  // MongoDB special keys
});

const mongoDoc = {
  _id: '507f1f77bcf86cd799439011',
  __v: 0,
  user_name: 'john',
  created_at: new Date()
};

console.log('Preserve keys:', transformer.transform(mongoDoc));

// API transformer
const apiTransformer = createApiTransformer();

const jsData = {
  userId: 1,
  firstName: 'John',
  isActive: true
};

console.log('To API (snake_case):', apiTransformer.toApi(jsData));
console.log('From API (camelCase):', apiTransformer.fromApi({
  user_id: 1,
  first_name: 'John',
  is_active: true
}));`,interviewTraps:[`QUICK REFERENCE:`,`camelCase:  str.replace(/[-_]+(.)?/g, (_, c) => c?.toUpperCase() || '')`,`snake_case: str.replace(/[A-Z]/g, '_$1').toLowerCase()`,`kebab-case: str.replace(/[A-Z]/g, '-$1').toLowerCase()`,`INTERVIEW TIPS:`,`1. Start with string converter`,`2. Then wrap for object keys`,`3. Add deep/recursive support`],stepByStep:[`Create a toCamelCase helper: strip leading/trailing delimiters, split on underscores/hyphens/spaces.`,`Lowercase the first word, capitalize the first letter of subsequent words, and join them.`,`In camelCaseKeys, return null/undefined/primitives unchanged.`,`If the input is an array, map each element through camelCaseKeys recursively.`,`If the input is an object, iterate over Object.keys.`,`For each key, compute the camelCase version and set the result property to the recursively processed value.`,`Return the new object with all keys converted.`],timeComplexity:`O(n * k) where n is the total number of key-value pairs across all levels and k is the average key length.`,spaceComplexity:`O(n) for the new transformed object (full copy), plus O(d) recursion stack depth for nesting depth d.`,commonMistakes:[`Only converting top-level keys and not recursing into nested objects or array elements`,`Using a regex that only replaces the first underscore/hyphen instead of all occurrences`,`Not handling arrays — array elements that are objects also need key conversion`,`Mutating the original input object instead of creating a new one`],followUps:[`How would you implement the reverse — camelCase to snake_case?`,`How would you make this configurable to support multiple target conventions?`,`How would you handle keys that are already in camelCase (avoid double-converting)?`,`How would you implement this using a generic recursive object transformer pattern?`]},{id:`coding-array-flat`,title:`Array.flat Polyfill with Depth`,difficulty:`Intermediate`,category:`Coding`,tags:[`arrays`,`recursion`,`polyfill`,`depth`,`flattening`],problem:`Implement a polyfill for \`Array.prototype.flat(depth)\` that flattens a nested array up to the specified depth. The default depth is 1, meaning only the first level of nesting is flattened. A depth of Infinity flattens all levels completely.

The native Array.flat was introduced in ES2019 and is not available in older environments. Understanding how to build this polyfill demonstrates mastery of recursion with controlled depth, array manipulation, and handling of sparse arrays (holes). It's a frequently asked interview question because it tests recursive thinking, base case identification, and iterative alternatives.

Your implementation should handle arrays of arbitrary nesting depth, sparse arrays (arrays with holes/empty slots), and should not mutate the original array. It should match the behavior of the native Array.prototype.flat as closely as possible.`,requirements:[`Flatten a nested array up to the specified depth level`,`Default depth should be 1 if not provided`,`Depth of Infinity should flatten all levels completely`,`Depth of 0 should return a shallow copy (no flattening)`,`Handle sparse arrays by skipping holes (matching native behavior)`,`Do not mutate the original array`,`Handle non-array elements by including them as-is in the result`],examples:[{input:`flat([1, [2, [3, [4]]]], 1)`,output:`[1, 2, [3, [4]]]`,explanation:`With depth 1, only the first level of nesting is removed. Inner arrays beyond depth 1 remain as-is.`},{input:`flat([1, [2, [3, [4]]]], Infinity)`,output:`[1, 2, 3, 4]`,explanation:`With Infinity depth, all nesting levels are flattened into a single flat array.`},{input:`flat([1, [2, 3], [4, [5, 6]]], 0)`,output:`[1, [2, 3], [4, [5, 6]]]`,explanation:`Depth 0 returns a shallow copy of the array without any flattening.`}],edgeCases:[`Empty array should return an empty array`,`Array with no nested arrays returns a shallow copy`,`Sparse arrays (holes) — holes should be removed, matching native flat behavior`,`Depth is a negative number — should behave like depth 0 (no flattening)`,`Very deeply nested arrays with Infinity depth`,`Arrays containing mixed types (objects, strings, numbers, null, undefined) alongside nested arrays`],naiveApproach:`A naive approach uses toString() or JSON.stringify to flatten and re-parse, but this loses type information and fails on non-primitive values. Another common naive solution recursively flattens without respecting the depth parameter, always flattening completely regardless of the requested depth. This doesn't match the native behavior where depth controls how many levels to unwrap.`,optimalApproach:`The optimal recursive approach iterates through each element of the array. For each element, check if it is an array and the current depth is greater than 0. If so, recursively flatten that element with depth - 1 and spread or concat the results. If the element is not an array or depth has reached 0, push the element as-is into the result.

An iterative stack-based approach also works well: use a stack of [element, depth] pairs. Pop from the stack, and if the element is an array and depth > 0, push its children with depth - 1. Otherwise, add to the result. Since stacks are LIFO, push children in reverse order to maintain the original sequence. Both approaches achieve O(n) time where n is the total number of elements in the fully flattened result. The recursive approach is cleaner; the iterative approach avoids stack overflow on extremely deep arrays.`,implementation:`function flat(arr, depth = 1) {
  const result = [];

  function flatten(items, currentDepth) {
    for (let i = 0; i < items.length; i++) {
      if (!(i in items)) continue;

      const item = items[i];
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  flatten(arr, depth);
  return result;
}

function flatIterative(arr, depth = 1) {
  const stack = arr.map((item) => [item, depth]);
  const result = [];

  while (stack.length > 0) {
    const [item, d] = stack.shift();
    if (Array.isArray(item) && d > 0) {
      for (let i = 0; i < item.length; i++) {
        stack.splice(i, 0, [item[i], d - 1]);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

function flatReduce(arr, depth = 1) {
  return depth > 0
    ? arr.reduce(
        (acc, item) =>
          acc.concat(Array.isArray(item) ? flatReduce(item, depth - 1) : item),
        []
      )
    : arr.slice();
}

// Usage
console.log(flat([1, [2, [3, [4, [5]]]]], 1));
// [1, 2, [3, [4, [5]]]]

console.log(flat([1, [2, [3, [4, [5]]]]], 2));
// [1, 2, 3, [4, [5]]]

console.log(flat([1, [2, [3, [4, [5]]]]], Infinity));
// [1, 2, 3, 4, 5]

console.log(flat([1, [2, 3], [4, [5, 6]]], 0));
// [1, [2, 3], [4, [5, 6]]]

// Sparse array handling
const sparse = [1, , 3, [4, , 6]];
console.log(flat(sparse, 1));
// [1, 3, 4, 6] — holes are removed

// Reduce approach
console.log(flatReduce([1, [2, [3]]], 1));
// [1, 2, [3]]`,stepByStep:[`Create a result array to collect flattened elements.`,`Define an inner recursive function that takes items and currentDepth.`,`Iterate through each element in items using a for loop (to handle sparse arrays).`,`Skip holes by checking if the index exists in the array (i in items).`,`If the element is an array AND currentDepth > 0, recurse with currentDepth - 1.`,`Otherwise, push the element directly into the result array.`,`Call the inner function with the original array and the requested depth.`,`Return the result array.`],timeComplexity:`O(n) where n is the total number of elements after flattening to the requested depth.`,spaceComplexity:`O(n) for the result array, plus O(d) recursion stack depth where d is the flattening depth.`,commonMistakes:[`Ignoring the depth parameter and always flattening completely`,`Not handling sparse arrays — using forEach or for...of skips holes differently than the native flat`,`Mutating the original array instead of creating a new one`,`Using concat without recursion, which only flattens one level regardless of depth parameter`],followUps:[`How would you implement Array.prototype.flatMap as a polyfill?`,`What are the performance differences between the recursive and iterative approaches?`,`How would you handle flattening iterables (not just arrays) like Sets and generators?`,`How does the native Array.flat handle sparse arrays vs. Array.from?`]},{id:`coding-merge-sorted`,title:`Merge Two Sorted Arrays In Place`,difficulty:`Intermediate`,category:`Coding`,tags:[`arrays`,`two-pointers`,`sorting`,`in-place`,`algorithms`],problem:`Implement a function that merges two sorted arrays into a single sorted array. The first array has enough trailing space (filled with zeros or empty slots) to accommodate all elements from the second array. The merge must happen in-place in the first array, without creating a new array.

This is a classic algorithm question (Classic Two-Pointer Array Merge) that tests understanding of the two-pointer technique. The key insight is to fill the first array from the end rather than the beginning — this avoids overwriting elements that haven't been processed yet. Starting from the back, compare the largest remaining elements from both arrays and place the larger one at the current end position.

The function takes: arr1 (the first sorted array with trailing space), m (number of valid elements in arr1), arr2 (the second sorted array), and n (number of elements in arr2). After merging, arr1 should contain all m + n elements in sorted order.`,requirements:[`Merge arr2 into arr1 in-place without creating a new array`,`Maintain sorted order in the final merged array`,`arr1 has length m + n with the last n positions available for merging`,`Handle cases where all elements of one array are larger than the other`,`Handle empty arr2 (n = 0) — arr1 remains unchanged`,`Handle empty valid portion of arr1 (m = 0) — copy all of arr2 into arr1`,`Both input arrays are already sorted in ascending order`],examples:[{input:`merge([1, 3, 5, 0, 0, 0], 3, [2, 4, 6], 3)`,output:`arr1 becomes [1, 2, 3, 4, 5, 6]`,explanation:`Starting from the end, compare 5 vs 6 → place 6, then 5 vs 4 → place 5, continue until all elements are placed.`},{input:`merge([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3)`,output:`arr1 becomes [1, 2, 3, 4, 5, 6]`,explanation:`All elements of arr2 are smaller, so they fill the front while arr1 elements shift to the back.`},{input:`merge([1, 0], 1, [2], 1)`,output:`arr1 becomes [1, 2]`,explanation:`Simple case: 2 > 1, so 2 goes at index 1. Then 1 stays at index 0.`}],edgeCases:[`arr2 is empty (n = 0) — arr1 should remain unchanged`,`arr1 has no valid elements (m = 0) — all arr2 elements are copied in`,`All arr2 elements are smaller than all arr1 elements`,`All arr2 elements are larger than all arr1 elements`,`Duplicate values across both arrays`,`Single element arrays`],naiveApproach:`The naive approach concatenates both arrays, sorts the result, and copies it back into arr1. This works but has O((m+n) log(m+n)) time complexity instead of O(m+n). Another naive approach tries to merge from the front, which requires shifting elements right to make room for smaller arr2 elements, resulting in O(m*n) time in the worst case.`,optimalApproach:`The optimal approach uses three pointers and works from right to left. Pointer p1 starts at index m - 1 (last valid element in arr1), pointer p2 starts at index n - 1 (last element in arr2), and pointer write starts at index m + n - 1 (last position in arr1). At each step, compare arr1[p1] and arr2[p2], place the larger value at arr1[write], and decrement the corresponding pointer and write.

This right-to-left strategy is the key insight: since we're filling from the end of arr1's available space, we never overwrite elements that still need to be compared. When p1 goes below 0, copy remaining arr2 elements. When p2 goes below 0, the remaining arr1 elements are already in place. This achieves O(m + n) time with O(1) extra space — truly in-place with no auxiliary array.`,implementation:`function merge(arr1, m, arr2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let write = m + n - 1;

  while (p1 >= 0 && p2 >= 0) {
    if (arr1[p1] > arr2[p2]) {
      arr1[write] = arr1[p1];
      p1--;
    } else {
      arr1[write] = arr2[p2];
      p2--;
    }
    write--;
  }

  while (p2 >= 0) {
    arr1[write] = arr2[p2];
    p2--;
    write--;
  }
}

// Usage
const nums1 = [1, 3, 5, 7, 0, 0, 0, 0];
merge(nums1, 4, [2, 4, 6, 8], 4);
console.log(nums1);
// [1, 2, 3, 4, 5, 6, 7, 8]

const nums2 = [4, 5, 6, 0, 0, 0];
merge(nums2, 3, [1, 2, 3], 3);
console.log(nums2);
// [1, 2, 3, 4, 5, 6]

const nums3 = [0];
merge(nums3, 0, [1], 1);
console.log(nums3);
// [1]

const nums4 = [1];
merge(nums4, 1, [], 0);
console.log(nums4);
// [1]

// Also provide a version that returns a new array for comparison
function mergeSorted(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

console.log(mergeSorted([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]

console.log(mergeSorted([1, 1, 2], [1, 3, 3]));
// [1, 1, 1, 2, 3, 3]`,theoryAndConcepts:`PROBLEM STATEMENT:
------------------
Given two sorted arrays nums1 and nums2, merge nums2 into nums1
as one sorted array IN-PLACE.

nums1 has enough space (zeros at the end) to hold all elements.

CONSTRAINTS:
------------
- nums1.length = m + n (m actual elements + n zeros)
- nums2.length = n
- Both arrays are sorted in ascending order
- Must be done in O(1) extra space (in-place)

KEY INSIGHT:
------------
Merge from the END to avoid overwriting elements!
If you merge from the start, you'd overwrite nums1 elements.

VISUAL:
-------
nums1 = [1, 3, 5, 0, 0, 0], m = 3
nums2 = [2, 4, 6], n = 3

Start from end:
Compare 5 and 6: 6 > 5, place 6 at position 5
Compare 5 and 4: 5 > 4, place 5 at position 4
Compare 3 and 4: 4 > 3, place 4 at position 3
And so on...`,beginnerApproach:`Beginner: Simple approach (not in-place)
Creates new array - easy to understand`,beginnerImplementation:`function mergeSortedBeginner(nums1, nums2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }
  
  // Add remaining elements
  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }
  
  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }
  
  return result;
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

console.log('Merge [1,3,5] and [2,4,6]:');
console.log(mergeSortedBeginner([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]`,intermediateApproach:`Intermediate: In-place two-pointer merge
Merge from the end to avoid overwriting`,intermediateImplementation:`function mergeSortedInPlace(nums1, m, nums2, n) {
  // Start from the end of both arrays
  let i = m - 1;      // Last actual element in nums1
  let j = n - 1;      // Last element in nums2
  let k = m + n - 1;  // Last position in nums1
  
  // Merge from the end
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
  
  // If nums2 has remaining elements, copy them
  // (No need to copy remaining nums1 - they're already in place)
  while (j >= 0) {
    nums1[k] = nums2[j];
    j--;
    k--;
  }
  
  return nums1;
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const nums1 = [1, 3, 5, 0, 0, 0];
const m = 3;
const nums2 = [2, 4, 6];
const n = 3;

console.log('Before:', [...nums1]);
mergeSortedInPlace(nums1, m, nums2, n);
console.log('After:', nums1);
// [1, 2, 3, 4, 5, 6]

// Another example
const arr1 = [1, 2, 3, 0, 0, 0];
const arr2 = [2, 5, 6];
mergeSortedInPlace(arr1, 3, arr2, 3);
console.log('Example 2:', arr1);
// [1, 2, 2, 3, 5, 6]`,expertApproach:`Expert: Handle edge cases and variations


Expert: Merge K sorted arrays


Expert: Merge with duplicates handling


Expert: Merge sorted arrays maintaining original positions (stable)`,expertImplementation:`function mergeSortedExpert(nums1, m, nums2, n) {
  // Edge cases
  if (n === 0) return nums1;
  if (m === 0) {
    for (let i = 0; i < n; i++) {
      nums1[i] = nums2[i];
    }
    return nums1;
  }
  
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  
  while (j >= 0) {
    // Use short-circuit: if i < 0, just copy from nums2
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  
  return nums1;
}

function mergeKSorted(arrays) {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  
  // Divide and conquer approach
  while (arrays.length > 1) {
    const merged = [];
    
    for (let i = 0; i < arrays.length; i += 2) {
      if (i + 1 < arrays.length) {
        merged.push(mergeSortedBeginner(arrays[i], arrays[i + 1]));
      } else {
        merged.push(arrays[i]);
      }
    }
    
    arrays = merged;
  }
  
  return arrays[0];
}

function mergeSortedUnique(nums1, nums2) {
  const merged = mergeSortedBeginner(nums1, nums2);
  return [...new Set(merged)];
}

function mergeWithIndices(nums1, nums2) {
  const result = [];
  const indices = [];  // Track which array each element came from
  let i = 0, j = 0;
  
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      indices.push({ value: nums1[i], source: 1, originalIndex: i });
      i++;
    } else {
      result.push(nums2[j]);
      indices.push({ value: nums2[j], source: 2, originalIndex: j });
      j++;
    }
  }
  
  while (i < nums1.length) {
    result.push(nums1[i]);
    indices.push({ value: nums1[i], source: 1, originalIndex: i });
    i++;
  }
  
  while (j < nums2.length) {
    result.push(nums2[j]);
    indices.push({ value: nums2[j], source: 2, originalIndex: j });
    j++;
  }
  
  return { merged: result, indices };
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Edge case: one array empty
const e1 = [1, 2, 3, 0, 0];
mergeSortedExpert(e1, 3, [4, 5], 2);
console.log('One empty:', e1);

const e2 = [0, 0, 0];
mergeSortedExpert(e2, 0, [1, 2, 3], 3);
console.log('First empty:', e2);

// Merge K sorted
console.log('Merge K:', mergeKSorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]));
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Merge unique
console.log('Merge unique:', mergeSortedUnique([1, 2, 2, 3], [2, 3, 4, 5]));
// [1, 2, 3, 4, 5]

// With indices
console.log('With indices:', mergeWithIndices([1, 3, 5], [2, 4]));`,interviewTraps:[`QUICK REFERENCE:`,`1. Merge from END to avoid overwriting`,`2. i = m-1, j = n-1, k = m+n-1`,`3. Only need to copy remaining nums2 (nums1 already in place)`,`INTERVIEW TIPS:`,`1. Clarify: is nums1 large enough?`,`2. Ask about edge cases (empty arrays)`,`3. Explain why merge from end`],stepByStep:[`Initialize pointer p1 at the last valid element of arr1 (index m - 1).`,`Initialize pointer p2 at the last element of arr2 (index n - 1).`,`Initialize write pointer at the last position of arr1 (index m + n - 1).`,`While both p1 and p2 are valid (>= 0), compare arr1[p1] and arr2[p2].`,`Place the larger value at arr1[write], decrement the source pointer and write pointer.`,`After the main loop, if p2 >= 0 still, copy remaining arr2 elements into arr1.`,`No need to copy remaining arr1 elements — they are already in the correct positions.`],timeComplexity:`O(m + n) — each element is visited and placed exactly once.`,spaceComplexity:`O(1) — the merge is done in-place using only pointer variables.`,commonMistakes:[`Merging from left to right — this overwrites arr1 elements that have not been compared yet`,`Forgetting to handle remaining arr2 elements after the main loop exits`,`Not realizing that remaining arr1 elements are already in place (no copy needed)`,`Off-by-one errors on pointer initialization — p1 starts at m-1, not m`],followUps:[`How would you merge K sorted arrays efficiently?`,`How does this relate to the merge step in merge sort?`,`How would you merge two sorted linked lists in place?`,`What if the arrays contain duplicates — how would you merge and deduplicate?`]},{id:`coding-calculator`,title:`Calculator with Method Chaining`,difficulty:`Intermediate`,category:`Coding`,tags:[`method-chaining`,`fluent-api`,`oop`,`design-patterns`,`this`],problem:"Implement a calculator function/class that supports method chaining for arithmetic operations. The API should allow expressions like `calc().add(10).subtract(5).multiply(20).divide(2).getResult()` which evaluates to 50. Each arithmetic method should return the calculator instance to enable chaining, and a final `getResult()` method should return the computed value.\n\nMethod chaining (also called a fluent interface) is a common design pattern used in libraries like jQuery, Lodash, and builder patterns throughout JavaScript. Understanding how to implement it requires knowledge of `this` binding, object-oriented design, and how returning the instance from methods enables chainable APIs.\n\nYour solution should handle division by zero gracefully, support an optional initial value, and provide a reset mechanism. The implementation can use either a class, a factory function with closures, or a constructor function — each approach demonstrates different JavaScript fundamentals.",requirements:[`Support add(n), subtract(n), multiply(n), divide(n) operations`,`Each arithmetic method returns the instance for chaining`,`getResult() returns the current computed value`,`Support optional initial value: calc(10).add(5) starts from 10`,`Default initial value is 0 if not provided`,`Handle division by zero gracefully (throw Error or return Infinity)`,`Provide a reset() method that returns the value to the initial state`],examples:[{input:`calc().add(10).subtract(5).multiply(20).divide(2).getResult()`,output:`50`,explanation:`Starting from 0: +10=10, -5=5, *20=100, /2=50.`},{input:`calc(100).divide(10).subtract(5).getResult()`,output:`5`,explanation:`Starting from 100: /10=10, -5=5.`},{input:`const c = calc(10);
c.add(5).getResult(); // 15
c.reset().getResult(); // 10`,output:`15 then 10 after reset`,explanation:`The calculator maintains state across operations and can be reset to its initial value.`}],edgeCases:[`Division by zero should throw an Error with a descriptive message`,`Chaining many operations in sequence`,`Using the same calculator instance multiple times`,`Calling getResult() without any operations returns the initial value`,`Operations with negative numbers`,`Operations with floating point numbers (precision considerations)`],naiveApproach:"A naive approach stores the value in a global or closure variable and has standalone functions that modify it. This doesn't support multiple independent calculator instances and isn't chainable. Another common mistake is forgetting to return `this` from arithmetic methods, breaking the chain. Some developers try returning the value directly from each method instead of the instance, which makes the API non-chainable.",optimalApproach:"The optimal approach creates a factory function that returns an object with a private value (via closure) and methods that mutate the value and return the object itself. Alternatively, a class-based approach defines methods on the prototype that modify `this.value` and return `this`.\n\nThe factory function approach is preferred in interviews because it demonstrates closures and encapsulation without the `new` keyword. The key insight is that every arithmetic method must end with `return this` (or return the object in the factory pattern). The `getResult()` method is the terminal operation that breaks the chain by returning a primitive value. The `reset()` method restores the value to the initial parameter and returns `this` so more operations can follow a reset.",implementation:`function calc(initialValue = 0) {
  let value = initialValue;

  const calculator = {
    add(n) {
      value += n;
      return calculator;
    },
    subtract(n) {
      value -= n;
      return calculator;
    },
    multiply(n) {
      value *= n;
      return calculator;
    },
    divide(n) {
      if (n === 0) {
        throw new Error('Division by zero');
      }
      value /= n;
      return calculator;
    },
    reset() {
      value = initialValue;
      return calculator;
    },
    getResult() {
      return value;
    },
  };

  return calculator;
}

// Class-based alternative
class Calculator {
  constructor(initialValue = 0) {
    this.initialValue = initialValue;
    this.value = initialValue;
  }

  add(n) {
    this.value += n;
    return this;
  }

  subtract(n) {
    this.value -= n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  divide(n) {
    if (n === 0) throw new Error('Division by zero');
    this.value /= n;
    return this;
  }

  reset() {
    this.value = this.initialValue;
    return this;
  }

  getResult() {
    return this.value;
  }
}

// Usage — factory function
console.log(calc().add(10).subtract(5).multiply(20).divide(2).getResult());
// 50

console.log(calc(100).divide(10).subtract(5).getResult());
// 5

const myCalc = calc(10);
console.log(myCalc.add(5).multiply(2).getResult());
// 30
console.log(myCalc.reset().getResult());
// 10

// Usage — class
const classCalc = new Calculator(10);
console.log(classCalc.add(5).subtract(3).multiply(4).getResult());
// 48
console.log(classCalc.reset().add(1).getResult());
// 11

// Division by zero
try {
  calc(10).divide(0);
} catch (e) {
  console.log(e.message); // 'Division by zero'
}`,theoryAndConcepts:`WHAT IS METHOD CHAINING?
------------------------
Method chaining (fluent interface) allows calling multiple methods
in a single statement by returning \`this\` from each method.

EXAMPLE:
Instead of:
  calc.add(10);
  calc.subtract(5);
  calc.multiply(2);
  const result = calc.getResult();

We can write:
  calc.add(10).subtract(5).multiply(2).getResult();

COMMON EXAMPLES:
----------------
- jQuery: $('div').addClass('active').css('color', 'red')
- Array methods: arr.filter().map().reduce()
- Builders: new QueryBuilder().select('*').from('users').where('id = 1')

KEY PRINCIPLE:
--------------
Return \`this\` from methods to enable chaining.
Exception: Terminal methods like getResult() return the value.`,beginnerApproach:`Beginner: Simple chainable calculator function`,beginnerImplementation:`function calcBeginner(initialValue = 0) {
  let value = initialValue;
  
  return {
    add(n) {
      value += n;
      return this; // Enable chaining
    },
    
    subtract(n) {
      value -= n;
      return this;
    },
    
    multiply(n) {
      value *= n;
      return this;
    },
    
    divide(n) {
      if (n === 0) throw new Error('Cannot divide by zero');
      value /= n;
      return this;
    },
    
    getResult() {
      return value; // Terminal method - returns value, not this
    }
  };
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const result1 = calcBeginner()
  .add(10)
  .subtract(5)
  .multiply(20)
  .divide(2)
  .getResult();

console.log('Result:', result1); // 50: ((0 + 10 - 5) * 20) / 2 = 50

// With initial value
const result2 = calcBeginner(100)
  .divide(2)
  .subtract(30)
  .getResult();

console.log('With initial:', result2); // 20: (100 / 2) - 30 = 20`,intermediateApproach:`Intermediate: Class-based with more features`,intermediateImplementation:`class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.history = [];
  }
  
  // Record operation in history
  _record(operation, operand) {
    this.history.push({
      operation,
      operand,
      result: this.value
    });
  }
  
  add(n) {
    this.value += n;
    this._record('add', n);
    return this;
  }
  
  subtract(n) {
    this.value -= n;
    this._record('subtract', n);
    return this;
  }
  
  multiply(n) {
    this.value *= n;
    this._record('multiply', n);
    return this;
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    this.value /= n;
    this._record('divide', n);
    return this;
  }
  
  // Additional operations
  mod(n) {
    this.value %= n;
    this._record('mod', n);
    return this;
  }
  
  pow(n) {
    this.value = Math.pow(this.value, n);
    this._record('pow', n);
    return this;
  }
  
  sqrt() {
    this.value = Math.sqrt(this.value);
    this._record('sqrt', null);
    return this;
  }
  
  abs() {
    this.value = Math.abs(this.value);
    this._record('abs', null);
    return this;
  }
  
  negate() {
    this.value = -this.value;
    this._record('negate', null);
    return this;
  }
  
  // Reset
  reset(n = 0) {
    this.value = n;
    this.history = [];
    return this;
  }
  
  // Undo last operation
  undo() {
    if (this.history.length > 0) {
      this.history.pop();
      // Recalculate from initial value
      const initial = this.history.length > 0 
        ? this.history[0].result - this._getOperationResult(this.history[0])
        : 0;
      
      this.value = initial;
      const historySnapshot = [...this.history];
      this.history = [];
      
      // Replay operations
      historySnapshot.forEach(op => {
        this._applyOperation(op.operation, op.operand);
      });
    }
    return this;
  }
  
  _getOperationResult(op) {
    switch (op.operation) {
      case 'add': return op.operand;
      case 'subtract': return -op.operand;
      case 'multiply': return op.result / op.operand;
      case 'divide': return op.result * op.operand;
      default: return 0;
    }
  }
  
  _applyOperation(operation, operand) {
    switch (operation) {
      case 'add': return this.add(operand);
      case 'subtract': return this.subtract(operand);
      case 'multiply': return this.multiply(operand);
      case 'divide': return this.divide(operand);
      case 'mod': return this.mod(operand);
      case 'pow': return this.pow(operand);
      case 'sqrt': return this.sqrt();
      case 'abs': return this.abs();
      case 'negate': return this.negate();
    }
    return this;
  }
  
  // Terminal methods
  getResult() {
    return this.value;
  }
  
  getHistory() {
    return [...this.history];
  }
  
  // Enable use in expressions via valueOf
  valueOf() {
    return this.value;
  }
  
  toString() {
    return String(this.value);
  }
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const calc = new Calculator(0)
  .add(10)
  .subtract(5)
  .multiply(20)
  .divide(2);

console.log('Result:', calc.getResult()); // 50
console.log('History:', calc.getHistory());

// With undo
calc.add(100);
console.log('After add 100:', calc.getResult()); // 150
calc.undo();
console.log('After undo:', calc.getResult()); // 50

// valueOf allows use in expressions
console.log('In expression:', calc + 10); // 60`,expertApproach:`Expert: Immutable calculator (returns new instance)


Expert: Lazy calculator (stores operations, computes on getResult)


Expert: Calculator with expression parsing`,expertImplementation:`class ImmutableCalculator {
  constructor(value = 0, history = []) {
    this._value = value;
    this._history = Object.freeze([...history]);
    Object.freeze(this);
  }
  
  _next(value, operation, operand) {
    return new ImmutableCalculator(value, [
      ...this._history,
      { operation, operand, result: value }
    ]);
  }
  
  add(n) {
    return this._next(this._value + n, 'add', n);
  }
  
  subtract(n) {
    return this._next(this._value - n, 'subtract', n);
  }
  
  multiply(n) {
    return this._next(this._value * n, 'multiply', n);
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    return this._next(this._value / n, 'divide', n);
  }
  
  getResult() {
    return this._value;
  }
  
  getHistory() {
    return [...this._history];
  }
  
  // Static factory
  static of(value) {
    return new ImmutableCalculator(value);
  }
}

class LazyCalculator {
  constructor() {
    this.operations = [];
  }
  
  add(n) {
    this.operations.push(v => v + n);
    return this;
  }
  
  subtract(n) {
    this.operations.push(v => v - n);
    return this;
  }
  
  multiply(n) {
    this.operations.push(v => v * n);
    return this;
  }
  
  divide(n) {
    if (n === 0) throw new Error('Cannot divide by zero');
    this.operations.push(v => v / n);
    return this;
  }
  
  // Execute all operations
  getResult(initialValue = 0) {
    return this.operations.reduce((value, op) => op(value), initialValue);
  }
  
  // Clear operations
  clear() {
    this.operations = [];
    return this;
  }
  
  // Clone the calculator
  clone() {
    const clone = new LazyCalculator();
    clone.operations = [...this.operations];
    return clone;
  }
}

class ExpressionCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  
  // Parse and evaluate expression
  evaluate(expression) {
    // Simple expression parser: "10 + 5 * 2"
    // Uses basic operator precedence
    const tokens = expression.match(/(\\d+\\.?\\d*|[+\\-*/()])/g);
    if (!tokens) return this;
    
    // Convert to postfix (Shunting-yard algorithm simplified)
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    
    for (const token of tokens) {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if ('+-*/'.includes(token)) {
        while (
          operators.length &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }
    
    while (operators.length) {
      output.push(operators.pop());
    }
    
    // Evaluate postfix
    const stack = [];
    for (const token of output) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
        }
      }
    }
    
    this.value = stack[0];
    return this;
  }
  
  // Chain with existing value
  then(expression) {
    return this.evaluate(String(this.value) + expression);
  }
  
  getResult() {
    return this.value;
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Immutable
const imm1 = ImmutableCalculator.of(10);
const imm2 = imm1.add(5);
const imm3 = imm2.multiply(2);

console.log('Immutable - Original:', imm1.getResult()); // 10 (unchanged)
console.log('Immutable - After ops:', imm3.getResult()); // 30

// Lazy
const lazy = new LazyCalculator()
  .add(10)
  .multiply(2)
  .subtract(5);

console.log('Lazy from 0:', lazy.getResult(0));   // 15
console.log('Lazy from 100:', lazy.getResult(100)); // 205

// Expression
const expr = new ExpressionCalculator();
console.log('Expression "10 + 5 * 2":', expr.evaluate('10 + 5 * 2').getResult()); // 20`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Division by zero`,`calcBeginner().divide(0);`,`} catch (e) {`,`console.log('Division by zero:', e.message);`,`EDGE CASE 2: Floating point precision`,`const floatCalc = calcBeginner().add(0.1).add(0.2);`,`console.log('0.1 + 0.2:', floatCalc.getResult()); // 0.30000000000000004`],stepByStep:[`Create a factory function (or class) that accepts an optional initial value (default 0).`,`Store the current value in a closure variable (or instance property).`,`Implement add(n): add n to value, return the calculator object/this.`,`Implement subtract(n): subtract n from value, return the calculator object/this.`,`Implement multiply(n): multiply value by n, return the calculator object/this.`,`Implement divide(n): check for zero, divide value by n, return the calculator object/this.`,`Implement reset(): restore value to the initial value, return the calculator object/this.`,`Implement getResult(): return the current value (terminal operation, breaks the chain).`],timeComplexity:`O(1) per operation — each method performs a single arithmetic operation.`,spaceComplexity:`O(1) — only stores the current value and initial value.`,commonMistakes:["Forgetting to return `this` (or the object) from arithmetic methods, breaking the chain",`Not handling division by zero — silently producing Infinity or NaN`,"Using arrow functions in the class approach — arrow methods don't bind `this` to the instance",`Not storing the initial value separately for the reset() functionality`],followUps:[`How would you add an undo() method that reverts the last operation?`,`How would you implement lazy evaluation — storing operations and computing only at getResult()?`,`How is method chaining used in popular libraries like jQuery, Lodash, and D3?`,`How would you make the calculator immutable, returning a new instance from each operation?`]},{id:`coding-calc-chaining-method`,title:`Implement Calculator Method Chaining (Fluent API)`,difficulty:`Beginner`,category:`Coding`,tags:[`javascript`,`method-chaining`,`closures`,`oop`,`fluent-interface`,`calculator`],problem:"Implement a calculator function `calc(initialValue = 0)` that supports continuous method chaining:\n```js\ncalc(0).add(10).subtract(5).multiply(20).divide(2).getResult(); // returns 45\n```\n\nRequirements:\n1. `calc(initialValue)`: Initializes the calculator with an optional initial number (defaulting to 0).\n2. Supports mathematical operations:\n   - `.add(n)`\n   - `.subtract(n)`\n   - `.multiply(n)`\n   - `.divide(n)` (handling division by zero by throwing an Error or returning NaN/Infinity gracefully)\n   - `.power(n)`\n   - `.reset()` (resets accumulator to 0 or initial value)\n3. `.getResult()` (or `.value` / `.valueOf()` / `.toString()`) returns the final computed numerical value.\n4. The calculation must support both immutable (returning new instances on each step) and stateful/builder patterns.",requirements:[`Support chaining of add, subtract, multiply, divide, power, reset`,`Terminate chain with getResult() to extract numeric value`,`Support valueOf() and toString() for implicit type coercion`,`Handle division by zero gracefully with descriptive Error`,`Preserve numerical precision where possible`],examples:[{input:`calc().add(10).subtract(5).multiply(20).divide(2).getResult()`,output:`50`,explanation:`(0 + 10 - 5) * 20 / 2 = 5 * 20 / 2 = 100 / 2 = 50`},{input:`calc(5).multiply(4).add(10).divide(5).getResult()`,output:`6`,explanation:`(5 * 4 + 10) / 5 = (20 + 10) / 5 = 30 / 5 = 6`}],edgeCases:[`Division by zero (throw Error: "Division by zero is undefined")`,`Chaining without initial value (defaults to 0)`,`Floating point precision (e.g. 0.1 + 0.2 handling)`,`Calling getResult multiple times or continuing chain after getResult`],naiveApproach:`A naive approach modifies a global variable, which breaks if multiple calculator instances run concurrently in the application.`,optimalApproach:"The optimal approach encapsulates the accumulator in an object with methods that each return `this` (or return a new calculator instance for immutability):\n1. Inside `calc(initialValue = 0)`, define an internal object holding `currentValue`.\n2. Each method performs the arithmetic and returns `this` (fluent interface).\n3. Implement `getResult()` returning `currentValue`.\n4. Add `valueOf()` and `[Symbol.toPrimitive]()` so `+calc(10).add(5)` automatically coerces to `15`.",implementation:`function calc(initialValue = 0) {
  let value = Number(initialValue) || 0;

  const calculator = {
    add(n) {
      value += Number(n) || 0;
      return this;
    },
    subtract(n) {
      value -= Number(n) || 0;
      return this;
    },
    multiply(n) {
      value *= Number(n) || 0;
      return this;
    },
    divide(n) {
      const divisor = Number(n);
      if (divisor === 0) {
        throw new Error('Division by zero is undefined');
      }
      value /= divisor;
      return this;
    },
    power(n) {
      value = Math.pow(value, Number(n) || 0);
      return this;
    },
    reset(newVal = 0) {
      value = newVal;
      return this;
    },
    getResult() {
      return value;
    },
    valueOf() {
      return value;
    },
    toString() {
      return String(value);
    }
  };

  return calculator;
}`,implementationTS:`export interface Calculator {
  add(n: number): this;
  subtract(n: number): this;
  multiply(n: number): this;
  divide(n: number): this;
  power(n: number): this;
  reset(newVal?: number): this;
  getResult(): number;
  valueOf(): number;
  toString(): string;
}

export function calc(initialValue: number = 0): Calculator {
  let value = Number(initialValue) || 0;

  const calculator: Calculator = {
    add(n: number) {
      value += Number(n) || 0;
      return this;
    },
    subtract(n: number) {
      value -= Number(n) || 0;
      return this;
    },
    multiply(n: number) {
      value *= Number(n) || 0;
      return this;
    },
    divide(n: number) {
      const divisor = Number(n);
      if (divisor === 0) {
        throw new Error('Division by zero is undefined');
      }
      value /= divisor;
      return this;
    },
    power(n: number) {
      value = Math.pow(value, Number(n) || 0);
      return this;
    },
    reset(newVal: number = 0) {
      value = newVal;
      return this;
    },
    getResult(): number {
      return value;
    },
    valueOf(): number {
      return value;
    },
    toString(): string {
      return String(value);
    }
  };

  return calculator;
}`,stepByStep:[`Initialize value variable scoped inside calc function closure.`,`Create calculator object containing operational methods.`,`In each operation method (add, subtract, etc.), update value and return this.`,`Implement divide checking for zero divisor.`,`Implement getResult() returning the current value.`,`Return calculator instance.`],timeComplexity:`O(1) per chained operation.`,spaceComplexity:`O(1) memory allocation.`,alternativeSolutions:[`ES6 Class implementation with fluent methods`,`Immutable Functional approach where each method returns new calc(newValue)`],commonMistakes:[`Forgetting to return this from chained methods, breaking subsequent calls with TypeError.`,`Not handling division by zero.`,`Mutating a global or shared prototype variable instead of instance-scoped state.`],followUps:[`How would you implement an immutable calculator where every operation returns a new instance?`,`How would you implement an undo() / redo() method in the chain?`,"How does JavaScript Symbol.toPrimitive allow implicit arithmetic like `calc(5).add(10) + 5` to equal 20?"]},{id:`coding-web-vitals-scenarios`,title:`Web Vitals Instrumentation & Scenario Diagnostic Engine`,difficulty:`Senior`,category:`Coding`,tags:[`performance`,`web-vitals`,`inp`,`lcp`,`cls`,`performance-observer`,`browser`],problem:`Implement a production-grade Web Vitals instrumentation utility and scenario analysis engine in JavaScript/TypeScript.

The utility must:
1. Use \`PerformanceObserver\` to measure and calculate Core Web Vitals:
   - **LCP (Largest Contentful Paint)**: Identifies the largest render element, good threshold $\\le 2.5\\text{s}$.
   - **INP (Interaction to Next Paint)**: Measures user interaction latency across clicks/key presses, good threshold $\\le 200\\text{ms}$.
   - **CLS (Cumulative Layout Shift)**: Tracks unexpected layout shifts excluding user input within 500ms, good threshold $\\le 0.1$.
   - **FCP (First Contentful Paint)**: Good threshold $\\le 1.8\\text{s}$.
   - **TTFB (Time to First Byte)**: Good threshold $\\le 800\\text{ms}$.
2. Provide a scenario diagnosis helper \`diagnosePerformanceBottleneck(metrics, scenario)\` that answers real-world interview diagnostic questions, such as:
   - "If SSR document generation is delayed, which Web Vital is most directly affected first and why?" (Answer: TTFB, cascading directly to FCP and LCP).
   - "If a heavy third-party tracking script runs on the main thread during button click, which Web Vital degrades?" (Answer: INP).
   - "If web fonts swap without size-adjust or fallback matching, which metric degrades?" (Answer: CLS).
3. Report metrics safely via \`navigator.sendBeacon\` or custom analytics callback.`,requirements:[`Observe LCP, INP, CLS, FCP, TTFB via PerformanceObserver`,`Calculate metric ratings ("good", "needs-improvement", "poor")`,`CLS session windowing (maximum session window of 5s with 1s gap)`,`INP calculation using 98th percentile for long sessions or maximum interaction duration`,`Programmatic scenario diagnosis function evaluating latency bottlenecks`],examples:[{input:`const monitor = initWebVitalsMonitor(metric => console.log(metric));
// Triggers real-time metric reporting as user interacts with page`,output:`{ name: 'LCP', value: 1420, rating: 'good', element: 'img.hero-banner' }`,explanation:`Reports LCP at 1.42 seconds (within the 2.5s good threshold).`},{input:`diagnoseScenario('SSR server rendered document query takes 3500ms before returning initial byte')`,output:`{ primaryMetric: 'TTFB', impact: 'high', cascadedMetrics: ['FCP', 'LCP'], rootCause: 'Server-side database delay or un-cached SSR generation' }`,explanation:`Identifies TTFB as the initial failure point cascading to FCP and LCP.`}],edgeCases:[`Page loaded in background tab: discard or flag LCP metric per spec`,`User navigates away before LCP/INP resolves: flush buffered metrics on visibilitychange (hidden)`,`Layout shifts caused by user interaction within 500ms: must be excluded via hadRecentInput check`,`Browsers without PerformanceObserver support: graceful degradation without throwing`],naiveApproach:"A naive approach tries using `window.performance.timing` (deprecated PerformanceTiming API) or single timestamp measurements, failing to capture dynamic shifts (CLS), user interaction responsiveness (INP), or actual largest contentful painted elements.",optimalApproach:"The optimal approach:\n1. Creates dedicated `PerformanceObserver` instances for entries of type: `largest-contentful-paint`, `layout-shift`, `first-input`, `event`, `paint`, and `navigation`.\n2. For **CLS**: Groups layout shifts into session windows (maximum window 5s, gap 1s) and takes the maximum session window score.\n3. For **INP**: Collects all interactions (pointerdown, click, keydown), measures processing time + presentation delay via `requestAnimationFrame`, and computes the 98th percentile interaction.\n4. For **LCP**: Takes the latest entry before page interaction or visibility change.",implementation:`const THRESHOLDS = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function getRating(name, value) {
  const [good, poor] = THRESHOLDS[name] || [1000, 3000];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function initWebVitalsMonitor(onReport) {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  const observers = [];

  // 1. TTFB & FCP
  try {
    const navObserver = new PerformanceObserver((entryList) => {
      const nav = entryList.getEntries()[0];
      if (nav) {
        const ttfb = nav.responseStart - nav.requestStart;
        onReport({ name: 'TTFB', value: Math.round(ttfb), rating: getRating('TTFB', ttfb) });
      }
    });
    navObserver.observe({ type: 'navigation', buffered: true });
    observers.push(navObserver);

    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          onReport({ name: 'FCP', value: Math.round(entry.startTime), rating: getRating('FCP', entry.startTime) });
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    observers.push(paintObserver);
  } catch (e) {}

  // 2. LCP
  let lcpValue = 0;
  let lcpElement = null;
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
        lcpElement = lastEntry.element;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);
  } catch (e) {}

  // 3. CLS (Session windowing)
  let sessionValue = 0;
  let sessionEntries = [];
  let maxCls = 0;

  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > maxCls) {
            maxCls = sessionValue;
          }
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);
  } catch (e) {}

  // Flush on page hide
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      if (lcpValue > 0) {
        onReport({ name: 'LCP', value: Math.round(lcpValue), rating: getRating('LCP', lcpValue), element: lcpElement });
      }
      onReport({ name: 'CLS', value: Number(maxCls.toFixed(4)), rating: getRating('CLS', maxCls) });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    observers.forEach(obs => obs.disconnect());
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

// Scenario diagnosis engine for interview questions
function diagnosePerformanceBottleneck(scenarioDescription) {
  const text = scenarioDescription.toLowerCase();

  if (text.includes('ssr') || text.includes('server') || text.includes('database delay')) {
    return {
      primaryMetric: 'TTFB',
      impact: 'High',
      cascadedMetrics: ['FCP', 'LCP'],
      explanation: 'Slow server-side response directly delays TTFB (Time to First Byte). Because the browser cannot receive HTML to construct the DOM and discover critical render resources, FCP and LCP are delayed by at least that same server duration.',
      recommendation: 'Enable edge caching, stream HTML (SSR streaming with React 19 / Suspense), optimize database queries, or pre-render static shells (SSG/ISR).'
    };
  }

  if (text.includes('input') || text.includes('click') || text.includes('main thread') || text.includes('long task')) {
    return {
      primaryMetric: 'INP',
      impact: 'High',
      cascadedMetrics: ['Total Blocking Time (TBT)'],
      explanation: 'Heavy JavaScript execution during user events occupies the browser main thread, causing long input delay and delayed presentation of the next frame (Interaction to Next Paint).',
      recommendation: 'Yield to main thread using scheduler.yield() or setTimeout, offload compute to Web Workers, and debounce rapid input event handlers.'
    };
  }

  if (text.includes('font') || text.includes('image without size') || text.includes('banner') || text.includes('shift')) {
    return {
      primaryMetric: 'CLS',
      impact: 'Medium-High',
      cascadedMetrics: [],
      explanation: 'Late-rendered dynamic banners or web fonts with mismatched fallback dimensions cause sudden layout shifts, degrading Cumulative Layout Shift.',
      recommendation: 'Reserve explicit aspect-ratio or width/height on images and dynamic slots; use font-display: swap with size-adjust and @font-face fallback matching.'
    };
  }

  return {
    primaryMetric: 'LCP',
    impact: 'High',
    cascadedMetrics: ['FCP'],
    explanation: 'Sub-optimal resource discovery or heavy image payloads delay Largest Contentful Paint.',
    recommendation: 'Use <link rel="preload" as="image"> for hero images, optimize images with WebP/AVIF, and eliminate render-blocking CSS/JS.'
  };
}`,implementationTS:`export interface WebVitalMetric {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  element?: Element | null;
}

export interface ScenarioDiagnosis {
  primaryMetric: string;
  impact: string;
  cascadedMetrics: string[];
  explanation: string;
  recommendation: string;
}

export function diagnosePerformanceBottleneck(scenarioDescription: string): ScenarioDiagnosis {
  const text = scenarioDescription.toLowerCase();

  if (text.includes('ssr') || text.includes('server') || text.includes('database delay')) {
    return {
      primaryMetric: 'TTFB',
      impact: 'High',
      cascadedMetrics: ['FCP', 'LCP'],
      explanation: 'Slow server-side response directly delays TTFB. The browser cannot construct the DOM or fetch critical resources until initial HTML arrives, pushing back FCP and LCP.',
      recommendation: 'Enable edge caching, implement streaming SSR with Suspense, optimize backend database queries, or use SSG/ISR.'
    };
  }

  if (text.includes('input') || text.includes('click') || text.includes('main thread') || text.includes('long task')) {
    return {
      primaryMetric: 'INP',
      impact: 'High',
      cascadedMetrics: ['Total Blocking Time (TBT)'],
      explanation: 'Heavy JavaScript execution during user interactions blocks the main thread, resulting in high input delay and poor Interaction to Next Paint.',
      recommendation: 'Break long tasks with scheduler.yield(), offload heavy calculations to Web Workers, and optimize event handlers.'
    };
  }

  if (text.includes('font') || text.includes('image without size') || text.includes('banner') || text.includes('shift')) {
    return {
      primaryMetric: 'CLS',
      impact: 'Medium-High',
      cascadedMetrics: [],
      explanation: 'Unsized media or font swapping causes layout reflows and shifts, increasing Cumulative Layout Shift.',
      recommendation: 'Set width/height and aspect-ratio on all media and use size-adjust on fallback web fonts.'
    };
  }

  return {
    primaryMetric: 'LCP',
    impact: 'High',
    cascadedMetrics: ['FCP'],
    explanation: 'Hero image loading latency or render-blocking scripts delay Largest Contentful Paint.',
    recommendation: 'Preload LCP images with priority="high", use modern image formats (AVIF/WebP), and inline critical CSS.'
  };
}`,stepByStep:[`Instantiate PerformanceObserver instances for navigation, paint, LCP, layout-shift, and interaction entries.`,`Implement CLS session window grouping with 1-second gap and 5-second maximum session ceiling.`,`Classify metric scores against Core Web Vitals threshold boundaries.`,`Flush LCP and CLS on document visibilitychange to hidden.`,`Implement diagnostic evaluation matching scenario prompts to root causes and mitigation strategies.`],timeComplexity:`O(1) observation overhead; asynchronous PerformanceObserver runs on background browser threads.`,spaceComplexity:`O(1) memory footprint.`,alternativeSolutions:[`Google web-vitals npm package`,`Chrome User Experience Report (CrUX) API integration`],commonMistakes:[`Treating FID as a modern Core Web Vital (FID was officially replaced by INP in March 2024).`,`Calculating CLS as a naive cumulative sum without session windowing.`,`Missing the cascading relationship where TTFB bottlenecks automatically inflate FCP and LCP.`],followUps:[`What is the difference between Lab data (Lighthouse) and Field data (RUM / CrUX)?`,`How does React 19 Server Components (RSC) and progressive hydration affect Web Vitals?`,`How do you debug INP in Chrome DevTools Performance panel using the Interactions track?`]},{id:`coding-promise-all`,title:`Implement Promise.all Polyfill`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`promises`,`async`,`polyfill`,`concurrency`],problem:`Implement a polyfill for Promise.all. The function \`promiseAll\` takes an iterable (or array) of promises (or plain values) and returns a single Promise that:
1. Resolves when all of the input promises have resolved, with an array of the resolved values in the exact same order as the input.
2. Rejects immediately as soon as ANY of the input promises rejects, with the rejection reason of that first rejected promise (fail-fast behavior).
3. If an empty array/iterable is passed, it resolves immediately with an empty array.
4. Non-promise values in the input array should be wrapped via \`Promise.resolve()\` so they resolve correctly.`,requirements:[`Return a new Promise`,`Resolve with an array of results preserving original input index order`,`Reject immediately when the first promise rejects (fail-fast)`,`Handle non-promise values seamlessly`,`Handle empty array input immediately`,`Support any iterable (convert via Array.from or for...of)`],examples:[{input:`const p1 = Promise.resolve(10);
const p2 = 20;
const p3 = new Promise(res => setTimeout(() => res(30), 50));
promiseAll([p1, p2, p3])`,output:`[10, 20, 30]`,explanation:`Resolves with all three values in order once the asynchronous p3 finishes.`},{input:`const p1 = Promise.resolve(1);
const p2 = Promise.reject(new Error('Failed!'));
promiseAll([p1, p2])`,output:`Error: Failed!`,explanation:`Rejects immediately with the error from p2.`},{input:`promiseAll([])`,output:`[]`,explanation:`Empty array resolves immediately to empty array.`}],edgeCases:[`Empty input array or iterable: resolves immediately to []`,`Input contains non-promises (primitives, plain objects): wrap with Promise.resolve`,`Promises that resolve out of order: results must maintain original input indices (use counter, not array.push)`,`Input is a sparse array: preserve correct length and index placement`,`Multiple rejections: only the first rejection reason is forwarded`],naiveApproach:`A naive approach might use an async function and loop through each promise with \`await\`:
\`\`\`js
async function naivePromiseAll(promises) {
  const results = [];
  for (const p of promises) {
    results.push(await p);
  }
  return results;
}
\`\`\`
This is flawed because it runs promises sequentially in series rather than in parallel concurrency, defeating the entire performance purpose of Promise.all.`,optimalApproach:"The optimal approach attaches `.then()` handlers to all promises concurrently and tracks completion with an integer counter `completedCount`:\n1. If the input iterable has length 0, resolve immediately with `[]`.\n2. Allocate a `results` array of size $N$.\n3. For each item at index $i$, wrap it with `Promise.resolve(item)`.\n4. In the `.then(value)` callback:\n   - Assign `results[i] = value` (preserving index order regardless of resolution timing).\n   - Increment `completedCount++`.\n   - If `completedCount === totalCount`, resolve the outer promise with `results`.\n5. In the `.catch(err)` callback:\n   - Immediately reject the outer promise with `err`.",implementation:`function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    if (iterable == null || typeof iterable[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    const promises = Array.from(iterable);
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    const results = new Array(total);
    let completed = 0;

    promises.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}`,implementationTS:`export function promiseAll<T extends readonly unknown[] | []>(
  iterable: T
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  return new Promise((resolve, reject) => {
    if (iterable == null || typeof (iterable as any)[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    const promises = Array.from(iterable);
    const total = promises.length;

    if (total === 0) {
      return resolve([] as any);
    }

    const results: any[] = new Array(total);
    let completed = 0;

    promises.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results as any);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}`,theoryAndConcepts:`WHAT IS Promise.all()?
----------------------
Promise.all() takes an iterable of promises and returns a single Promise that:
- RESOLVES when ALL promises resolve (with array of results)
- REJECTS when ANY promise rejects (with first rejection reason)

KEY CHARACTERISTICS:
--------------------
1. Executes promises in parallel (not sequential)
2. Results array matches input order (not completion order)
3. Fail-fast: First rejection rejects the whole thing
4. Non-promise values are wrapped with Promise.resolve()

PROMISE STATIC METHODS:
-----------------------
Promise.all()        - All must succeed
Promise.allSettled() - Wait for all to settle (success or failure)
Promise.race()       - First to settle wins
Promise.any()        - First to succeed wins



VISUAL TIMELINE:
----------------
Promise.all([p1, p2, p3]):

p1: |----resolve----|
p2: |--resolve--|
p3: |------resolve------|
                        ↓
                   returns [r1, r2, r3]

If any rejects:
p1: |----resolve----|
p2: |--reject--|
              ↓
         rejects immediately`,beginnerApproach:`Beginner: Basic Promise.all implementation`,beginnerImplementation:`function promiseAllBeginner(promises) {
  return new Promise((resolve, reject) => {
    // Convert to array (handle iterables)
    const promiseArray = Array.from(promises);
    
    // Handle empty array
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let completedCount = 0;
    
    promiseArray.forEach((promise, index) => {
      // Wrap non-promises
      Promise.resolve(promise)
        .then(value => {
          results[index] = value; // Maintain order
          completedCount++;
          
          // All done?
          if (completedCount === promiseArray.length) {
            resolve(results);
          }
        })
        .catch(reject); // First rejection rejects all
    });
  });
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const p1 = Promise.resolve(1);
const p2 = new Promise(resolve => setTimeout(() => resolve(2), 100));
const p3 = Promise.resolve(3);

promiseAllBeginner([p1, p2, p3]).then(results => {
  console.log('All resolved:', results); // [1, 2, 3]
});

// With rejection
const pReject = Promise.reject('Error!');
promiseAllBeginner([p1, pReject, p3]).catch(error => {
  console.log('Rejected:', error); // 'Error!'
});

// With non-promises
promiseAllBeginner([1, 2, 3]).then(results => {
  console.log('Non-promises:', results); // [1, 2, 3]
});`,intermediateApproach:`Intermediate: Promise.allSettled implementation
Waits for all promises regardless of success/failure


Intermediate: Promise.race implementation
Returns first settled promise (success or failure)`,intermediateImplementation:`function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let settledCount = 0;
    
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch(reason => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promiseArray.length) {
            resolve(results);
          }
        });
    });
  });
}

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    // Note: Empty array = promise never settles (per spec)
    
    promiseArray.forEach(promise => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

// allSettled
promiseAllSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log('allSettled:', results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// race
const slow = new Promise(r => setTimeout(() => r('slow'), 200));
const fast = new Promise(r => setTimeout(() => r('fast'), 100));

promiseRace([slow, fast]).then(result => {
  console.log('Race winner:', result); // 'fast'
});`,expertApproach:`Expert: Promise.any implementation
Returns first fulfilled promise, rejects only if ALL reject


Expert: Promise.all with concurrency limit
Process at most N promises at a time


Expert: Promise.map (like Array.map but with promises)


Expert: Promise.retry
Retry a promise-returning function on failure


Expert: Promise.timeout
Reject if promise doesn't resolve within time limit`,expertImplementation:`function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }
    
    const errors = [];
    let rejectedCount = 0;
    
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // First success wins
        .catch(error => {
          errors[index] = error;
          rejectedCount++;
          
          // All rejected?
          if (rejectedCount === promiseArray.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
}

// AggregateError polyfill for older environments
if (typeof AggregateError === 'undefined') {
  class AggregateError extends Error {
    constructor(errors, message) {
      super(message);
      this.errors = errors;
      this.name = 'AggregateError';
    }
  }
  globalThis.AggregateError = AggregateError;
}

function promiseAllWithLimit(promises, limit) {
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    
    if (promiseArray.length === 0) {
      resolve([]);
      return;
    }
    
    const results = new Array(promiseArray.length);
    let currentIndex = 0;
    let completedCount = 0;
    let hasRejected = false;
    
    function runNext() {
      if (hasRejected) return;
      
      const index = currentIndex++;
      if (index >= promiseArray.length) return;
      
      Promise.resolve(promiseArray[index])
        .then(value => {
          if (hasRejected) return;
          
          results[index] = value;
          completedCount++;
          
          if (completedCount === promiseArray.length) {
            resolve(results);
          } else {
            runNext(); // Start next promise
          }
        })
        .catch(error => {
          hasRejected = true;
          reject(error);
        });
    }
    
    // Start up to 'limit' promises
    const initialBatch = Math.min(limit, promiseArray.length);
    for (let i = 0; i < initialBatch; i++) {
      runNext();
    }
  });
}

function promiseMap(items, mapper, options = {}) {
  const { concurrency = Infinity } = options;
  
  const promises = items.map((item, index) => 
    () => Promise.resolve(mapper(item, index))
  );
  
  if (concurrency === Infinity) {
    return Promise.all(promises.map(fn => fn()));
  }
  
  return promiseAllWithLimit(
    promises.map(fn => fn()),
    concurrency
  );
}

function promiseRetry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 1, // Multiplier for delay
    onRetry = null
  } = options;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      fn()
        .then(resolve)
        .catch(error => {
          attempts++;
          
          if (attempts >= retries) {
            reject(error);
            return;
          }
          
          const waitTime = delay * Math.pow(backoff, attempts - 1);
          onRetry?.(error, attempts, waitTime);
          
          setTimeout(attempt, waitTime);
        });
    }
    
    attempt();
  });
}

function promiseTimeout(promise, ms, message = 'Promise timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    })
  ]);
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// any
const fail1 = Promise.reject('fail1');
const fail2 = Promise.reject('fail2');
const succeed = new Promise(r => setTimeout(() => r('success'), 100));

promiseAny([fail1, fail2, succeed]).then(result => {
  console.log('Any succeeded:', result); // 'success'
});

promiseAny([fail1, fail2]).catch(error => {
  console.log('All rejected:', error.message); // 'All promises were rejected'
});

// Concurrency limit
console.log('\\n--- Concurrency Limit ---');
const tasks = [1, 2, 3, 4, 5].map(i => 
  new Promise(r => {
    console.log(\`Starting task \${i}\`);
    setTimeout(() => {
      console.log(\`Completing task \${i}\`);
      r(i);
    }, 100);
  })
);

promiseAllWithLimit(tasks, 2).then(results => {
  console.log('All completed:', results);
});

// Retry
console.log('\\n--- Retry ---');
let attemptCount = 0;
const flakyFn = () => {
  attemptCount++;
  if (attemptCount < 3) {
    return Promise.reject(new Error(\`Attempt \${attemptCount} failed\`));
  }
  return Promise.resolve('Success!');
};

promiseRetry(flakyFn, {
  retries: 5,
  delay: 100,
  onRetry: (err, attempt) => console.log(\`Retry \${attempt}:\`, err.message)
}).then(result => {
  console.log('Finally succeeded:', result);
});`,interviewTraps:[`console.log('\\n=== EDGE CASES ===');`,`EDGE CASE 1: Empty array`,`Promise.all([]).then(r => console.log('Empty all:', r)); // []`,`Promise.race([]) never settles!`,`EDGE CASE 2: Non-promise values`,`promiseAllBeginner([1, 2, 3]).then(r => console.log('Non-promises:', r)); // [1, 2, 3]`,`EDGE CASE 3: Already resolved/rejected promises`,`const resolved = Promise.resolve('already resolved');`],stepByStep:[`Validate that input is iterable and convert to array.`,`Handle empty array boundary case immediately.`,`Create fixed-size results array and completed counter.`,`Iterate with forEach capturing the index in closure.`,`Wrap each element with Promise.resolve to handle plain values.`,`On resolution, store value at captured index and increment counter.`,`When counter equals total, resolve outer promise with results array.`,`On rejection, reject outer promise immediately.`],timeComplexity:`O(N) where N is the number of promises to attach handlers, with concurrent execution time equal to the slowest individual promise (max(T_i)).`,spaceComplexity:`O(N) to store the results array and closure handlers.`,alternativeSolutions:[`Implementing via Promise.allSettled by filtering rejections`,`Using async iterator / generator with Promise.race for worker pooling`],commonMistakes:[`Using results.push(val) instead of results[index] = val, which scrambles the order when faster promises resolve earlier.`,`Checking results.length === total instead of an explicit completed count (empty slots in sparse arrays still increment length).`,`Forgetting to wrap non-promise inputs with Promise.resolve().`],followUps:[`How would you implement Promise.allSettled?`,`How would you implement Promise.any and Promise.race?`,`How would you limit concurrency to at most K active promises at a time (p-limit)?`]},{id:`coding-cached-fetch`,title:`Implement Cached Fetch with TTL & Request Deduplication`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`networking`,`caching`,`fetch`,`async`,`promises`],problem:`Implement a higher-order wrapper \`createCachedFetch\` (or \`cachedFetch\`) that caches network responses in memory with a Time-To-Live (TTL) expiration and prevents duplicate concurrent in-flight requests for the same URL (request coalescing / deduplication).

Requirements:
1. \`cachedFetch(url, options, ttlMs)\`: If a valid cached response exists for the URL and hasn't expired, return the cached data without making a network request.
2. **In-flight Deduplication**: If multiple calls for the same URL occur simultaneously while a request is already pending, all callers should receive the promise of that single in-flight request rather than firing multiple duplicate HTTP calls.
3. **TTL Expiration**: Expired cache entries must be evicted and a fresh network request made on subsequent calls.
4. **Cache Invalidation**: Provide a method to manually clear or invalidate the cache for a specific key or all keys.`,requirements:[`Cache successful responses in memory with configurable TTL`,`Coalesce duplicate in-flight requests to share a single pending Promise`,`Purge or bypass expired cache entries automatically`,`Do not cache failed/rejected network requests`,`Expose clearCache(url?) helper to invalidate cache`],examples:[{input:`const cachedFetch = createCachedFetch();
// 1st call fires fetch
const p1 = cachedFetch('/api/user', {}, 5000);
// 2nd call (same millisecond) shares in-flight promise
const p2 = cachedFetch('/api/user', {}, 5000);
// p1 === p2`,output:`true (single network call dispatched)`,explanation:`Concurrent requests for the same URL share the in-flight promise.`},{input:`// Call again after 2 seconds (within 5s TTL)
const data = await cachedFetch('/api/user', {}, 5000);`,output:`Cached response returned immediately without network fetch`,explanation:`The cached entry is valid and within the TTL.`}],edgeCases:[`Failed network request (network error or non-200 HTTP status): do NOT cache the error, allow retry immediately`,`Multiple simultaneous requests for same resource: share the exact same promise`,`TTL of 0: bypasses cache or only performs in-flight deduplication`,`Complex URL parameters or request headers: key should incorporate method/body if supporting non-GET requests`],naiveApproach:`A naive approach might only store the resolved response object in a plain Map with a timestamp. This fails during concurrent requests because multiple calls arriving before the first one completes will all find a cache miss and fire duplicate network requests.`,optimalApproach:"The optimal approach uses a dual-entry cache map storing either the **in-flight Promise** or the **resolved data with expiration timestamp**:\n1. Check if `inFlightMap.has(cacheKey)`. If so, return that pending promise.\n2. Check if `dataCache.has(cacheKey)` and `Date.now() < entry.expiry`. If valid, return `Promise.resolve(entry.data)`.\n3. Otherwise, create a new fetch promise.\n4. Store the promise in `inFlightMap`.\n5. On resolution:\n   - Save `{ data: result, expiry: Date.now() + ttl }` in `dataCache`.\n   - Remove key from `inFlightMap`.\n   - Return `result`.\n6. On rejection:\n   - Remove key from `inFlightMap` so subsequent calls can retry.\n   - Re-throw error.",implementation:`function createCachedFetch() {
  const cache = new Map();
  const inFlight = new Map();

  async function cachedFetch(url, options = {}, ttlMs = 60000) {
    const key = typeof url === 'string' ? url : url.toString();

    // 1. Check in-flight requests (coalescing)
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    // 2. Check cached data
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (Date.now() < entry.expiry) {
        return entry.data;
      }
      cache.delete(key); // Expired
    }

    // 3. Initiate fetch
    const fetchPromise = (async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();

        // Store in cache with TTL
        if (ttlMs > 0) {
          cache.set(key, {
            data,
            expiry: Date.now() + ttlMs,
          });
        }
        return data;
      } finally {
        // Clean up in-flight tracker
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, fetchPromise);
    return fetchPromise;
  }

  cachedFetch.clear = function(url) {
    if (url) {
      cache.delete(url);
      inFlight.delete(url);
    } else {
      cache.clear();
      inFlight.clear();
    }
  };

  return cachedFetch;
}`,implementationTS:`export interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export function createCachedFetch() {
  const cache = new Map<string, CacheEntry<any>>();
  const inFlight = new Map<string, Promise<any>>();

  async function cachedFetch<T = any>(
    url: string,
    options: RequestInit = {},
    ttlMs: number = 60000
  ): Promise<T> {
    const key = url;

    if (inFlight.has(key)) {
      return inFlight.get(key) as Promise<T>;
    }

    if (cache.has(key)) {
      const entry = cache.get(key)!;
      if (Date.now() < entry.expiry) {
        return entry.data as T;
      }
      cache.delete(key);
    }

    const fetchPromise = (async (): Promise<T> => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();

        if (ttlMs > 0) {
          cache.set(key, {
            data,
            expiry: Date.now() + ttlMs,
          });
        }
        return data as T;
      } finally {
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, fetchPromise);
    return fetchPromise;
  }

  cachedFetch.clear = (url?: string) => {
    if (url) {
      cache.delete(url);
      inFlight.delete(url);
    } else {
      cache.clear();
      inFlight.clear();
    }
  };

  return cachedFetch;
}`,stepByStep:[`Create internal Map for cached entries and Map for in-flight promises.`,`On incoming request, check if key is in inFlight map. If so, return existing promise.`,`Check if key is in cache map and verify timestamp against Date.now(). Return cached data if unexpired.`,`If expired or not in cache, construct asynchronous fetch wrapper.`,`Register promise in inFlight map.`,`Execute fetch, parse JSON, and store result with expiry in cache.`,`In finally block, delete key from inFlight map.`,`Return resolved result to caller.`],timeComplexity:`O(1) lookup and cache insertion time.`,spaceComplexity:`O(K) where K is the number of distinct cached URLs.`,alternativeSolutions:[`Using LRU cache eviction policy for memory-constrained environments`,`ServiceWorker Cache API for persistent cross-session HTTP caching`],commonMistakes:[`Caching failed network responses, preventing recovery on transient network errors.`,`Not clearing in-flight entry on rejection, causing subsequent requests to be stuck with the failed promise.`,`Not cloning response stream if multiple callers read raw Response body.`],followUps:[`How would you implement an LRU (Least Recently Used) cache with maximum capacity?`,`How would you support Stale-While-Revalidate caching strategy?`,`How would you generate cache keys for POST/GraphQL queries?`]},{id:`coding-fetch-with-retries`,title:`Implement Fetch with Retries & Exponential Backoff`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`networking`,`promises`,`async`,`retry`,`exponential-backoff`],problem:"Implement a robust network request utility `fetchWithRetries` that automatically retries failed network requests with configurable retry count, exponential backoff delay, jitter, custom retry conditions, and request timeout.\n\nRequirements:\n1. `fetchWithRetries(url, options, config)`: Makes a fetch request to `url`.\n2. **Retries & Backoff**: If the request fails (network error or non-2xx status code matching retry condition), retry up to `maxRetries` times (e.g. 3).\n3. **Exponential Backoff**: Successive retry delays scale exponentially: $\\text{delay} = \\text{baseDelay} \\times 2^{\\text{attempt}} + \\text{jitter}$.\n4. **Timeout**: Each individual attempt should abort after a configured `timeoutMs` (using `AbortController`).\n5. **Retry Predicate**: Provide a `shouldRetry(error, response)` callback to avoid retrying non-transient 4xx errors (e.g., 400 Bad Request or 404 Not Found) while retrying transient errors (500, 502, 503, 504, 429, network timeouts).",requirements:[`Configurable maxRetries (default 3)`,`Exponential backoff delay calculation with random jitter`,`Abort timeout per attempt using AbortController`,`Custom shouldRetry callback to filter retryable errors vs fatal client errors`,`Rejects with the final error if all retry attempts are exhausted`],examples:[{input:`fetchWithRetries('https://api.example.com/data', {}, {
  maxRetries: 3,
  baseDelayMs: 1000,
  timeoutMs: 3000
})`,output:`Resolves with response data if successful within 3 retries`,explanation:`Retries on transient failure with delays of ~1s, ~2s, ~4s.`}],edgeCases:[`Non-retryable 4xx client errors (401, 403, 404): should fail fast without wasting retries`,`429 Too Many Requests: should respect Retry-After header if present`,`Network disconnection / timeout: abort signal cleans up correctly`,`maxRetries = 0: attempts exactly once without retry`],naiveApproach:`A naive loop with fixed delay (e.g. sleep 1000ms on error) can cause "thundering herd" problems where thousands of clients retry at the exact same millisecond, overwhelming an already struggling backend server.`,optimalApproach:`The optimal approach uses:
1. **Exponential Backoff**: $\\text{delay} = \\text{baseDelay} \\times 2^{\\text{attempt}}$.
2. **Full Jitter**: $\\text{actualDelay} = \\text{Math.random()} \\times \\text{delay}$ to distribute retry traffic evenly across time.
3. **AbortController**: Times out hung requests so slow connections do not block the retry loop indefinitely.
4. **Recursive or Loop Driver**: A clean loop tracking current attempt $0 \\dots N$.`,implementation:`async function fetchWithRetries(url, options = {}, config = {}) {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 10000,
    timeoutMs = 5000,
    shouldRetry = (err, res) => {
      if (err) return true; // Network errors
      if (res && (res.status >= 500 || res.status === 429)) return true;
      return false;
    }
  } = config;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      if (!shouldRetry(null, response) || attempt === maxRetries) {
        return response; // Return non-retryable response (e.g. 404) or final attempt
      }

      lastError = new Error(\`Request failed with status \${response.status}\`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      if (attempt === maxRetries || !shouldRetry(err, null)) {
        throw err;
      }
    }

    // Compute exponential backoff with jitter
    const exponentialDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
    const jitter = Math.random() * 0.5 * exponentialDelay;
    const finalDelay = exponentialDelay + jitter;

    await new Promise(resolve => setTimeout(resolve, finalDelay));
  }

  throw lastError;
}`,implementationTS:`export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  shouldRetry?: (error: unknown | null, response: Response | null) => boolean;
}

export async function fetchWithRetries(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 10000,
    timeoutMs = 5000,
    shouldRetry = (err, res) => {
      if (err) return true;
      if (res && (res.status >= 500 || res.status === 429)) return true;
      return false;
    }
  } = config;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok || !shouldRetry(null, response) || attempt === maxRetries) {
        return response;
      }

      lastError = new Error(\`HTTP \${response.status}\`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      if (attempt === maxRetries || !shouldRetry(err, null)) {
        throw err;
      }
    }

    const exponentialDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
    const jitter = Math.random() * 0.5 * exponentialDelay;
    const finalDelay = exponentialDelay + jitter;

    await new Promise(resolve => setTimeout(resolve, finalDelay));
  }

  throw lastError;
}`,theoryAndConcepts:`WHY RETRY REQUESTS?
-------------------
Network requests can fail temporarily due to:
- Network glitches
- Server overload
- Rate limiting
- Timeout

RETRY STRATEGIES:
-----------------
1. Fixed delay: Wait same time between retries
2. Exponential backoff: Increase delay each time (1s, 2s, 4s, 8s)
3. Jitter: Add randomness to prevent thundering herd

WHY CACHE REQUESTS?
-------------------
- Reduce server load
- Faster responses
- Offline support
- Save bandwidth

CACHE STRATEGIES:
-----------------
1. Cache-first: Check cache, then network
2. Network-first: Try network, fallback to cache
3. Stale-while-revalidate: Return cached, update in background`,beginnerApproach:`Beginner: Simple retry with fixed delay`,beginnerImplementation:`async function fetchWithRetryBeginner(url, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      
      return response;
    } catch (error) {
      // Last attempt - throw error
      if (attempt === retries) {
        throw error;
      }
      
      console.log(\`Attempt \${attempt + 1} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Test
console.log('=== BEGINNER RETRY ===');
console.log('fetchWithRetryBeginner(url, retries=3, delay=1000)');`,intermediateApproach:`Intermediate: Retry with exponential backoff`,intermediateImplementation:`async function fetchWithRetryIntermediate(url, options = {}) {
  const {
    retries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryOn = [408, 429, 500, 502, 503, 504], // Status codes to retry
    onRetry = null,
    ...fetchOptions
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      
      // Check if should retry based on status
      if (!response.ok && retryOn.includes(response.status)) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt === retries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      // Add jitter (±25%)
      const jitter = delay * (0.75 + Math.random() * 0.5);
      
      onRetry?.({
        attempt: attempt + 1,
        delay: jitter,
        error
      });
      
      await new Promise(resolve => setTimeout(resolve, jitter));
    }
  }
  
  throw lastError;
}`,expertApproach:`Expert: Full-featured fetch with retry + cache`,expertImplementation:`class SmartFetch {
  constructor(options = {}) {
    this.cache = new Map();
    this.inFlight = new Map();
    this.defaultOptions = {
      retries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffFactor: 2,
      cacheTTL: 60000,
      cacheMaxSize: 100,
      retryOn: [408, 429, 500, 502, 503, 504],
      timeout: 30000,
      ...options
    };
  }
  
  async fetch(url, options = {}) {
    const opts = { ...this.defaultOptions, ...options };
    const {
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      cacheTTL,
      retryOn,
      timeout,
      forceRefresh,
      cacheStrategy,
      onRetry,
      ...fetchOptions
    } = opts;
    
    const cacheKey = this._generateKey(url, fetchOptions);
    
    // Cache-first strategy
    if (cacheStrategy !== 'network-first' && !forceRefresh) {
      const cached = this._getFromCache(cacheKey);
      
      if (cached) {
        // Stale-while-revalidate
        if (cacheStrategy === 'stale-while-revalidate') {
          this._revalidateInBackground(url, fetchOptions, cacheKey, cacheTTL);
        }
        return cached;
      }
    }
    
    // Deduplicate concurrent requests
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }
    
    // Make request with retry
    const promise = this._fetchWithRetry(url, {
      fetchOptions,
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      retryOn,
      timeout,
      onRetry
    }).then(data => {
      this._setCache(cacheKey, data, cacheTTL);
      return data;
    });
    
    this.inFlight.set(cacheKey, promise);
    
    try {
      return await promise;
    } catch (error) {
      // Network-first: Try cache on failure
      if (cacheStrategy === 'network-first') {
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;
      }
      throw error;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }
  
  async _fetchWithRetry(url, config) {
    const {
      fetchOptions,
      retries,
      baseDelay,
      maxDelay,
      backoffFactor,
      retryOn,
      timeout,
      onRetry
    } = config;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok && retryOn.includes(response.status)) {
          throw new Error(\`HTTP \${response.status}\`);
        }
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt === retries) break;
        
        // Don't retry abort errors (timeout)
        if (error.name === 'AbortError') {
          lastError = new Error('Request timeout');
          break;
        }
        
        const delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt),
          maxDelay
        );
        const jitter = delay * (0.75 + Math.random() * 0.5);
        
        onRetry?.({ attempt: attempt + 1, delay: jitter, error });
        
        await new Promise(r => setTimeout(r, jitter));
      }
    }
    
    throw lastError;
  }
  
  async _revalidateInBackground(url, fetchOptions, cacheKey, ttl) {
    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        const data = await response.json();
        this._setCache(cacheKey, data, ttl);
      }
    } catch {
      // Silently fail background revalidation
    }
  }
  
  _generateKey(url, options = {}) {
    return \`\${options.method || 'GET'}:\${url}\`;
  }
  
  _getFromCache(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data;
    }
    return null;
  }
  
  _setCache(key, data, ttl) {
    if (this.cache.size >= this.defaultOptions.cacheMaxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }
  
  // Utility methods
  clearCache() {
    this.cache.clear();
  }
  
  invalidate(url) {
    for (const key of this.cache.keys()) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const smartFetch = new SmartFetch({
  cacheTTL: 5000,
  retries: 3,
  timeout: 10000,
  onRetry: ({ attempt, delay, error }) => {
    console.log(\`Retry \${attempt} in \${Math.round(delay)}ms: \${error.message}\`);
  }
});

// Usage example
async function fetchUser(id) {
  return smartFetch.fetch(\`/api/users/\${id}\`, {
    cacheStrategy: 'stale-while-revalidate'
  });
}`,interviewTraps:[`QUICK REFERENCE:`,`1. Use exponential backoff`,`2. Add jitter to prevent thundering herd`,`3. Don't retry client errors (4xx)`,`4. Respect Retry-After header`,`1. Include method and body in cache key`,`2. Deduplicate concurrent requests`,`3. Implement TTL for freshness`],stepByStep:[`Define retry configuration defaults (maxRetries=3, baseDelay=500ms, timeout=5000ms).`,`Loop from attempt 0 to maxRetries.`,`Set up AbortController with setTimeout to enforce per-request timeout.`,`Execute fetch with controller.signal.`,`Clear timeout immediately on response.`,`If response is ok or non-retryable, return response.`,`If attempt is exhausted, throw error.`,`Calculate exponential backoff + jitter delay.`,`Wait for delay using Promise-based setTimeout before next attempt.`],timeComplexity:`O(attempts) with total elapsed time bounded by sum of retry delays + timeouts.`,spaceComplexity:`O(1) auxiliary space.`,alternativeSolutions:[`RxJS retryWhen / retry operator with backoff pipe`,`Axios interceptor retry wrapper`],commonMistakes:[`Retrying 400 or 404 client errors indefinitely.`,`Forgetting to clear the timeout timer, causing memory leaks.`,`Using deterministic delays without jitter, causing synchronized traffic spikes.`],followUps:[`How do you parse and respect the Retry-After HTTP header?`,`How would you implement circuit breaker pattern in conjunction with retries?`,`How do you cancel subsequent retries if the component unmounts?`]},{id:`coding-fill-dom`,title:`Fill DOM Tree from an Array of Objects`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`dom`,`recursion`,`virtual-dom`,`html-generation`],problem:"Implement a function `renderDOMTree(vnode, container)` (or `createDOMFromObject(schema)`) that takes a structured JSON/object tree description of a DOM subtree and dynamically constructs and attaches real HTML DOM nodes.\n\nThe object descriptor format represents:\n- `tag`: string tag name (e.g. 'div', 'span', 'ul', 'li', 'button', 'input')\n- `attrs` / `props`: object containing HTML attributes (e.g. `id`, `className` or `class`, `style`, `href`, `data-*`, boolean attributes like `disabled`)\n- `events`: object containing event listeners (e.g. `{ click: fn, input: fn }`)\n- `children`: array of strings (text nodes) or nested node descriptor objects.\n\nThe implementation must handle:\n1. Creating elements with `document.createElement` and text nodes with `document.createTextNode`.\n2. Setting standard attributes, dataset properties, inline styles (both as strings or style objects), and event listeners.\n3. Safe XSS prevention (never using raw `innerHTML` without sanitization).\n4. Efficient batch attachment using `DocumentFragment`.",requirements:[`Construct real DOM nodes from nested descriptor objects`,`Handle strings and numbers as text nodes`,`Handle className / class, inline styles, and standard HTML attributes`,`Attach event listeners safely using addEventListener`,`Recursively process children arrays and append to parent`,`Use DocumentFragment when mounting multiple children to minimize reflows`],examples:[{input:`const schema = {
  tag: 'div',
  props: { className: 'card', id: 'card-1' },
  children: [
    { tag: 'h2', children: ['Hello World'] },
    { tag: 'p', props: { style: { color: 'blue' } }, children: ['Dynamic DOM tree'] },
    { tag: 'button', events: { click: () => alert('clicked') }, children: ['Click Me'] }
  ]
};
const root = document.getElementById('app');
renderDOMTree(schema, root);`,output:`<div class="card" id="card-1"><h2>Hello World</h2><p style="color: blue;">Dynamic DOM tree</p><button>Click Me</button></div> mounted inside root`,explanation:`Constructs the full interactive DOM hierarchy.`}],edgeCases:[`Null or undefined children: ignore gracefully`,`Plain string or number as root or child: convert to TextNode`,`Boolean attributes (disabled, checked, hidden): set attribute or property correctly`,`Event listener cleanup: support returning a cleanup function or unmount handler`],naiveApproach:'A naive approach builds a raw HTML string using string concatenation (e.g. `<div class="${props.className}">...`) and sets `container.innerHTML = html`. This is extremely dangerous (high XSS vulnerability risk), cannot attach real JavaScript event listener functions directly, and causes expensive re-parsing of the entire DOM string.',optimalApproach:"The optimal approach uses the native DOM API recursively:\n1. If the node is a string or number, return `document.createTextNode(String(node))`.\n2. Create the element using `document.createElement(node.tag)`.\n3. Set attributes:\n   - If key is `style` and value is an object, iterate properties with `el.style[prop] = value`.\n   - If key is `className` or `class`, set `el.className = value`.\n   - Otherwise, set with `el.setAttribute(key, value)`.\n4. Attach event listeners from `node.events` using `el.addEventListener(event, handler)`.\n5. For `node.children`, create a `DocumentFragment`, recursively render each child, append to fragment, and then append fragment to the element.\n6. Return the constructed element.",implementation:`function createDOMFromObject(node) {
  // 1. Primitive text nodes
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  if (!node || typeof node !== 'object') {
    return document.createTextNode('');
  }

  // 2. Create Element
  const el = document.createElement(node.tag || 'div');

  // 3. Set Props & Attributes
  const props = node.props || node.attrs || {};
  for (const [key, val] of Object.entries(props)) {
    if (val == null) continue;

    if (key === 'className' || key === 'class') {
      el.className = val;
    } else if (key === 'style') {
      if (typeof val === 'string') {
        el.style.cssText = val;
      } else if (typeof val === 'object') {
        Object.assign(el.style, val);
      }
    } else if (typeof val === 'boolean') {
      if (val) el.setAttribute(key, '');
      else el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(val));
    }
  }

  // 4. Attach Event Listeners
  if (node.events && typeof node.events === 'object') {
    for (const [event, handler] of Object.entries(node.events)) {
      if (typeof handler === 'function') {
        el.addEventListener(event, handler);
      }
    }
  }

  // 5. Recursively append children via DocumentFragment
  if (Array.isArray(node.children)) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
      if (child != null) {
        fragment.appendChild(createDOMFromObject(child));
      }
    }
    el.appendChild(fragment);
  }

  return el;
}

function renderDOMTree(vnode, container) {
  const domNode = createDOMFromObject(vnode);
  if (container) {
    container.innerHTML = '';
    container.appendChild(domNode);
  }
  return domNode;
}`,implementationTS:`export interface VNode {
  tag?: string;
  props?: Record<string, any>;
  attrs?: Record<string, any>;
  events?: Record<string, (e: Event) => void>;
  children?: Array<VNode | string | number | null | undefined>;
}

export function createDOMFromObject(node: VNode | string | number): Node {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  if (!node || typeof node !== 'object') {
    return document.createTextNode('');
  }

  const el = document.createElement(node.tag || 'div');

  const props = node.props || node.attrs || {};
  for (const [key, val] of Object.entries(props)) {
    if (val == null) continue;

    if (key === 'className' || key === 'class') {
      el.className = val;
    } else if (key === 'style') {
      if (typeof val === 'string') {
        el.style.cssText = val;
      } else if (typeof val === 'object') {
        Object.assign(el.style, val);
      }
    } else if (typeof val === 'boolean') {
      if (val) el.setAttribute(key, '');
      else el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(val));
    }
  }

  if (node.events) {
    for (const [event, handler] of Object.entries(node.events)) {
      if (typeof handler === 'function') {
        el.addEventListener(event, handler);
      }
    }
  }

  if (Array.isArray(node.children)) {
    const fragment = document.createDocumentFragment();
    for (const child of node.children) {
      if (child != null) {
        fragment.appendChild(createDOMFromObject(child));
      }
    }
    el.appendChild(fragment);
  }

  return el;
}

export function renderDOMTree(vnode: VNode | string | number, container: HTMLElement): Node {
  const domNode = createDOMFromObject(vnode);
  container.innerHTML = '';
  container.appendChild(domNode);
  return domNode;
}`,theoryAndConcepts:`PROBLEM STATEMENT:
------------------
Given an array of objects where each object describes a DOM element,
create and render those elements to the DOM.

OBJECT STRUCTURE (typical):
---------------------------
{
  tag: 'div',           // Element type
  id: 'myId',           // ID attribute
  className: 'my-class', // CSS classes
  textContent: 'Hello', // Text content
  children: [...],      // Nested elements
  attributes: {},       // Custom attributes
  events: {},           // Event listeners
  styles: {}            // Inline styles
}

KEY DOM METHODS:
----------------
- document.createElement(tag)
- element.setAttribute(name, value)
- element.appendChild(child)
- element.textContent = text
- element.innerHTML = html (use carefully - XSS risk)`,beginnerApproach:`Beginner: Simple element creation


Beginner: Create multiple elements and append to container`,beginnerImplementation:`function createElementBeginner(config) {
  // Create the element
  const element = document.createElement(config.tag || 'div');
  
  // Set ID
  if (config.id) {
    element.id = config.id;
  }
  
  // Set class
  if (config.className) {
    element.className = config.className;
  }
  
  // Set text content
  if (config.textContent) {
    element.textContent = config.textContent;
  }
  
  return element;
}

function fillDOMBeginner(container, elements) {
  elements.forEach(config => {
    const element = createElementBeginner(config);
    container.appendChild(element);
  });
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const simpleElements = [
  { tag: 'h1', textContent: 'Hello World', id: 'title' },
  { tag: 'p', textContent: 'This is a paragraph', className: 'content' },
  { tag: 'button', textContent: 'Click Me', className: 'btn' }
];

// Usage:
// const container = document.getElementById('app');
// fillDOMBeginner(container, simpleElements);

console.log('Simple element configs:', simpleElements);`,intermediateApproach:`Intermediate: Handle nested children and attributes


Intermediate: Fill DOM with fragment (better performance)`,intermediateImplementation:`function createElementIntermediate(config) {
  const { 
    tag = 'div', 
    id, 
    className, 
    textContent, 
    children = [], 
    attributes = {},
    styles = {},
    events = {}
  } = config;
  
  const element = document.createElement(tag);
  
  // ID
  if (id) element.id = id;
  
  // Classes
  if (className) {
    if (Array.isArray(className)) {
      element.className = className.join(' ');
    } else {
      element.className = className;
    }
  }
  
  // Text content
  if (textContent) element.textContent = textContent;
  
  // Custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Styles
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
  
  // Event listeners
  Object.entries(events).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });
  
  // Recursively create children
  children.forEach(childConfig => {
    if (typeof childConfig === 'string') {
      element.appendChild(document.createTextNode(childConfig));
    } else {
      element.appendChild(createElementIntermediate(childConfig));
    }
  });
  
  return element;
}

function fillDOMIntermediate(container, elements) {
  const fragment = document.createDocumentFragment();
  
  elements.forEach(config => {
    fragment.appendChild(createElementIntermediate(config));
  });
  
  container.appendChild(fragment);
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const nestedElements = [
  {
    tag: 'div',
    className: 'card',
    children: [
      { tag: 'h2', textContent: 'Card Title', className: 'card-title' },
      { 
        tag: 'p', 
        textContent: 'Card description',
        styles: { color: 'gray', fontSize: '14px' }
      },
      {
        tag: 'button',
        textContent: 'Learn More',
        className: 'btn btn-primary',
        attributes: { 'data-id': '123' },
        events: {
          click: (e) => console.log('Clicked!', e.target)
        }
      }
    ]
  }
];

console.log('Nested config:', JSON.stringify(nestedElements, null, 2));`,expertApproach:`Expert: Full-featured DOM builder


Expert: JSX-like helper (hyperscript style)`,expertImplementation:`class DOMBuilder {
  constructor(options = {}) {
    this.options = {
      sanitize: true,      // XSS protection
      namespace: null,     // SVG namespace support
      ...options
    };
  }
  
  // Sanitize text to prevent XSS
  sanitize(text) {
    if (!this.options.sanitize || typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Create single element
  createElement(config) {
    if (typeof config === 'string') {
      return document.createTextNode(config);
    }
    
    const {
      tag = 'div',
      id,
      className,
      classList = [],
      textContent,
      innerHTML,
      children = [],
      attributes = {},
      dataset = {},
      styles = {},
      events = {},
      ref,
      namespace
    } = config;
    
    // Create element (with namespace for SVG)
    const ns = namespace || this.options.namespace;
    const element = ns
      ? document.createElementNS(ns, tag)
      : document.createElement(tag);
    
    // ID
    if (id) element.id = id;
    
    // Classes
    if (className) {
      const classes = Array.isArray(className) ? className : className.split(' ');
      element.classList.add(...classes.filter(Boolean));
    }
    if (classList.length) {
      element.classList.add(...classList);
    }
    
    // Text content (sanitized)
    if (textContent !== undefined) {
      element.textContent = this.sanitize(textContent);
    }
    
    // innerHTML (only if explicitly allowed and sanitize is false)
    if (innerHTML && !this.options.sanitize) {
      element.innerHTML = innerHTML;
    }
    
    // Attributes
    for (const [key, value] of Object.entries(attributes)) {
      if (value === true) {
        element.setAttribute(key, '');
      } else if (value !== false && value !== null && value !== undefined) {
        element.setAttribute(key, String(value));
      }
    }
    
    // Dataset (data-* attributes)
    for (const [key, value] of Object.entries(dataset)) {
      element.dataset[key] = value;
    }
    
    // Styles
    for (const [property, value] of Object.entries(styles)) {
      if (value !== null && value !== undefined) {
        // Handle camelCase to kebab-case
        const kebabProp = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        element.style.setProperty(kebabProp, value);
      }
    }
    
    // Events
    for (const [event, handler] of Object.entries(events)) {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      } else if (typeof handler === 'object') {
        // Advanced: { handler, options }
        element.addEventListener(event, handler.handler, handler.options);
      }
    }
    
    // Ref callback
    if (typeof ref === 'function') {
      ref(element);
    }
    
    // Children
    this.appendChildren(element, children);
    
    return element;
  }
  
  appendChildren(parent, children) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    
    children.forEach(child => {
      if (child === null || child === undefined) return;
      parent.appendChild(this.createElement(child));
    });
  }
  
  // Build from array
  buildFromArray(configs) {
    const fragment = document.createDocumentFragment();
    
    configs.forEach(config => {
      fragment.appendChild(this.createElement(config));
    });
    
    return fragment;
  }
  
  // Render to container
  render(container, configs) {
    const fragment = this.buildFromArray(Array.isArray(configs) ? configs : [configs]);
    container.appendChild(fragment);
    return container;
  }
  
  // Replace container content
  renderAndReplace(container, configs) {
    container.innerHTML = '';
    return this.render(container, configs);
  }
}

function h(tag, props = {}, ...children) {
  return {
    tag,
    ...props,
    children: children.flat()
  };
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const builder = new DOMBuilder({ sanitize: true });

// Complex configuration
const complexUI = [
  h('header', { className: 'header' },
    h('nav', { className: 'nav' },
      h('ul', { className: 'nav-list' },
        h('li', {}, h('a', { attributes: { href: '/' } }, 'Home')),
        h('li', {}, h('a', { attributes: { href: '/about' } }, 'About')),
        h('li', {}, h('a', { attributes: { href: '/contact' } }, 'Contact'))
      )
    )
  ),
  h('main', { className: 'main' },
    h('article', { className: 'article' },
      h('h1', {}, 'Welcome'),
      h('p', { styles: { lineHeight: '1.6' } }, 'This is the content.')
    )
  ),
  h('footer', { className: 'footer' },
    'Copyright 2024'
  )
];

console.log('Complex UI config:', JSON.stringify(complexUI, null, 2));`,interviewTraps:[`QUICK REFERENCE:`,`createElement(tag) - Create element`,`setAttribute(name, value) - Set attribute`,`appendChild(child) - Add child`,`textContent - Safe text`,`innerHTML - Unsafe HTML (XSS risk)`,`DocumentFragment - Batch operations`,`INTERVIEW TIPS:`],stepByStep:[`Check if node is primitive (string or number); create TextNode and return.`,`Create element using document.createElement(tag).`,`Iterate props object to assign classes, styles, and attributes.`,`Attach event handlers with addEventListener.`,`Create DocumentFragment to batch render children.`,`Recursively call createDOMFromObject for each child and append to fragment.`,`Append fragment to parent element.`,`Attach generated root element to container.`],timeComplexity:`O(N) where N is the total count of nodes and attributes in the tree.`,spaceComplexity:`O(D) call stack depth where D is the maximum depth of the tree, plus O(N) DOM nodes created in memory.`,alternativeSolutions:[`Iterative stack/queue-based tree generation`,`JSX compiler transform target (custom h / createElement factory)`],commonMistakes:[`Using innerHTML with interpolated strings, creating security holes.`,`Not checking for null/undefined child nodes in arrays.`,`Appending children one-by-one directly to container triggering multiple DOM reflows instead of using DocumentFragment.`],followUps:[`How does this relate to React.createElement and the Virtual DOM diffing process?`,`How would you add diff and patch capabilities to update an existing DOM tree rather than replacing it?`,`How would you support SVG element creation with document.createElementNS?`]},{id:`coding-bfs-object`,title:`BFS Traversal of JavaScript Objects`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`bfs`,`queue`,`tree-traversal`,`objects`,`data-structures`],problem:"Implement a Breadth-First Search (BFS) traversal function `bfsTraverse(obj, callback)` (or `bfsObject(obj)`) for deeply nested JavaScript objects and arrays.\n\nThe function should:\n1. Traverse all keys and values level by level (level-order traversal), starting from the root properties, then their direct child properties, then grandchildren, etc.\n2. Handle circular references safely using a `Set` or `WeakSet` of visited object references so the traversal never enters an infinite loop.\n3. Pass `{ key, value, path, depth, parent }` to a visitor callback function on each visited property.\n4. Support finding a value, transforming values level-by-level, or returning an array of all visited node values in BFS order.",requirements:[`Perform level-order (BFS) traversal using an explicit FIFO queue`,`Track visited objects to prevent infinite loops from circular references`,`Yield or return full path info (e.g. ["user", "address", "city"])`,`Support plain objects, arrays, and primitive values`,`Record depth level for each node`],examples:[{input:`const tree = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  },
  f: 4
};
bfsObject(tree);`,output:`['a', 'b', 'f', 'c', 'd', 'e'] (keys visited level-by-level)`,explanation:`Level 1: a, b, f -> Level 2: c, d -> Level 3: e`}],edgeCases:[`Circular references (obj.self = obj): do not revisit already queued object references`,`Array children: traverse indices 0, 1, 2, ... in order`,`Null or non-object roots: handle gracefully without errors`,`Empty objects or primitives: return empty or single entry`],naiveApproach:`A recursive function naturally executes Depth-First Search (DFS) because function call stacks dive to the deepest leaf before returning. Attempting BFS with recursion requires multi-pass depth-limited searches, which is inefficient ($O(N^2)$).`,optimalApproach:"The optimal BFS approach uses an explicit **FIFO Queue** and a **Visited Set**:\n1. Initialize a queue containing `[{ value: root, path: [], depth: 0, key: '' }]`.\n2. Maintain `const visited = new Set()` (or `WeakSet`).\n3. While queue is not empty, dequeue the item at the front.\n4. Check if `item.value` is an object. If already in `visited`, skip.\n5. If it's an object, mark as visited.\n6. Iterate its keys (via `Object.entries(item.value)`) and enqueue each child:\n   `queue.push({ value: childVal, path: [...item.path, childKey], depth: item.depth + 1, key: childKey, parent: item.value })`.\n7. Execute callback or accumulate result.",implementation:`function bfsObject(obj, callback) {
  if (obj === null || typeof obj !== 'object') {
    if (callback) callback({ key: '', value: obj, path: [], depth: 0 });
    return [{ key: '', value: obj, path: [], depth: 0 }];
  }

  const results = [];
  const queue = [];
  const visited = new Set();

  // Enqueue direct properties of root
  for (const [key, value] of Object.entries(obj)) {
    queue.push({ key, value, path: [key], depth: 1, parent: obj });
  }
  visited.add(obj);

  while (queue.length > 0) {
    const item = queue.shift();
    results.push(item);

    if (callback) {
      callback(item);
    }

    if (item.value !== null && typeof item.value === 'object') {
      if (!visited.has(item.value)) {
        visited.add(item.value);
        for (const [childKey, childValue] of Object.entries(item.value)) {
          queue.push({
            key: childKey,
            value: childValue,
            path: [...item.path, childKey],
            depth: item.depth + 1,
            parent: item.value,
          });
        }
      }
    }
  }

  return results;
}`,implementationTS:`export interface BFSNode {
  key: string;
  value: any;
  path: string[];
  depth: number;
  parent?: any;
}

export function bfsObject(
  obj: unknown,
  callback?: (node: BFSNode) => void
): BFSNode[] {
  if (obj === null || typeof obj !== 'object') {
    const single: BFSNode = { key: '', value: obj, path: [], depth: 0 };
    callback?.(single);
    return [single];
  }

  const results: BFSNode[] = [];
  const queue: BFSNode[] = [];
  const visited = new Set<any>();

  for (const [key, value] of Object.entries(obj)) {
    queue.push({ key, value, path: [key], depth: 1, parent: obj });
  }
  visited.add(obj);

  while (queue.length > 0) {
    const item = queue.shift()!;
    results.push(item);
    callback?.(item);

    if (item.value !== null && typeof item.value === 'object') {
      if (!visited.has(item.value)) {
        visited.add(item.value);
        for (const [childKey, childValue] of Object.entries(item.value)) {
          queue.push({
            key: childKey,
            value: childValue,
            path: [...item.path, childKey],
            depth: item.depth + 1,
            parent: item.value,
          });
        }
      }
    }
  }

  return results;
}`,theoryAndConcepts:`WHAT IS BFS & DFS?
------------------

DFS (Depth-First Search):
- Go as deep as possible before backtracking
- Uses STACK (LIFO) or recursion
- Memory efficient for wide structures

BFS (Breadth-First Search):
- Visit all nodes at current level before going deeper
- Uses QUEUE (FIFO)
- Finds shortest path

VISUAL:
-------
       A
      / \\
     B   C
    / \\   \\
   D   E   F

DFS (pre-order): A -> B -> D -> E -> C -> F
BFS:             A -> B -> C -> D -> E -> F



OBJECT TRAVERSAL:
-----------------
Objects can be viewed as trees:
- Root = the object itself
- Nodes = nested objects/arrays
- Leaves = primitive values

USE CASES:
----------
1. Finding values by key
2. Transforming nested data
3. Detecting circular references
4. Calculating depth
5. Serialization`,beginnerApproach:`Beginner: Simple recursive DFS`,beginnerImplementation:`function dfsRecursiveBeginner(obj, callback) {
  // Visit current node
  callback(obj);
  
  // If object/array, visit children
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        dfsRecursiveBeginner(obj[key], callback);
      }
    }
  }
}

// Test Beginner DFS
console.log('=== BEGINNER DFS ===');

const simpleObj = {
  a: 1,
  b: {
    c: 2,
    d: 3
  }
};

console.log('DFS Order:');
dfsRecursiveBeginner(simpleObj, (value) => {
  console.log(typeof value === 'object' ? '{...}' : value);
});`,intermediateApproach:`Intermediate: DFS with path tracking and key info


Intermediate: DFS iterative (using stack)


Intermediate: BFS with level tracking`,intermediateImplementation:`function dfsWithPath(obj, callback, path = []) {
  // Visit with path context
  callback(obj, path);
  
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        dfsWithPath(obj[key], callback, [...path, key]);
      }
    }
  }
}

function dfsIterative(obj, callback) {
  const stack = [{ value: obj, path: [] }];
  
  while (stack.length > 0) {
    const { value, path } = stack.pop();
    
    callback(value, path);
    
    if (value !== null && typeof value === 'object') {
      // Push in reverse order to maintain left-to-right traversal
      const keys = Object.keys(value).reverse();
      for (const key of keys) {
        stack.push({ value: value[key], path: [...path, key] });
      }
    }
  }
}

function bfsWithLevel(obj, callback) {
  const queue = [{ value: obj, path: [], level: 0 }];
  
  while (queue.length > 0) {
    const { value, path, level } = queue.shift();
    
    callback(value, path, level);
    
    if (value !== null && typeof value === 'object') {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          queue.push({
            value: value[key],
            path: [...path, key],
            level: level + 1
          });
        }
      }
    }
  }
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const nested = {
  a: {
    b: { c: 1 },
    d: 2
  },
  e: [3, 4, { f: 5 }]
};

console.log('DFS with path:');
dfsWithPath(nested, (value, path) => {
  const display = typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : value;
  console.log(\`\${path.join('.') || 'root'}: \${display}\`);
});

console.log('\\nBFS with level:');
bfsWithLevel(nested, (value, path, level) => {
  const display = typeof value === 'object' ? '{...}' : value;
  console.log(\`Level \${level} - \${path.join('.') || 'root'}: \${display}\`);
});`,expertApproach:`Expert: Full-featured traversal with all options`,expertImplementation:`class ObjectTraverser {
  constructor(options = {}) {
    this.options = {
      circular: 'skip', // 'skip' | 'error' | 'mark'
      arrays: 'traverse', // 'traverse' | 'value'
      maxDepth: Infinity,
      ...options
    };
  }
  
  // DFS Pre-order (visit before children)
  dfsPreOrder(obj, callback) {
    const seen = new WeakSet();
    
    const traverse = (value, path, depth) => {
      // Max depth check
      if (depth > this.options.maxDepth) return;
      
      // Circular reference handling
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          if (this.options.circular === 'error') {
            throw new Error(\`Circular reference at \${path.join('.')}\`);
          }
          if (this.options.circular === 'mark') {
            callback('[Circular]', path, depth, true);
          }
          return;
        }
        seen.add(value);
      }
      
      // Visit current node
      const shouldContinue = callback(value, path, depth, false);
      if (shouldContinue === false) return;
      
      // Traverse children
      if (value !== null && typeof value === 'object') {
        if (Array.isArray(value) && this.options.arrays === 'value') {
          return; // Treat arrays as values
        }
        
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            traverse(value[key], [...path, key], depth + 1);
          }
        }
      }
    };
    
    traverse(obj, [], 0);
  }
  
  // DFS Post-order (visit after children)
  dfsPostOrder(obj, callback) {
    const seen = new WeakSet();
    
    const traverse = (value, path, depth) => {
      if (depth > this.options.maxDepth) return;
      
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) return;
        seen.add(value);
        
        if (!(Array.isArray(value) && this.options.arrays === 'value')) {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              traverse(value[key], [...path, key], depth + 1);
            }
          }
        }
      }
      
      // Visit after children
      callback(value, path, depth);
    };
    
    traverse(obj, [], 0);
  }
  
  // BFS
  bfs(obj, callback) {
    const seen = new WeakSet();
    const queue = [{ value: obj, path: [], depth: 0 }];
    
    while (queue.length > 0) {
      const { value, path, depth } = queue.shift();
      
      if (depth > this.options.maxDepth) continue;
      
      // Circular check
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          if (this.options.circular === 'error') {
            throw new Error(\`Circular reference at \${path.join('.')}\`);
          }
          if (this.options.circular === 'mark') {
            callback('[Circular]', path, depth, true);
          }
          continue;
        }
        seen.add(value);
      }
      
      // Visit
      const shouldContinue = callback(value, path, depth, false);
      if (shouldContinue === false) continue;
      
      // Enqueue children
      if (value !== null && typeof value === 'object') {
        if (!(Array.isArray(value) && this.options.arrays === 'value')) {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              queue.push({
                value: value[key],
                path: [...path, key],
                depth: depth + 1
              });
            }
          }
        }
      }
    }
  }
  
  // Find all paths to a value
  findPaths(obj, predicate) {
    const paths = [];
    
    this.dfsPreOrder(obj, (value, path, depth, isCircular) => {
      if (!isCircular && predicate(value, path)) {
        paths.push([...path]);
      }
    });
    
    return paths;
  }
  
  // Get value at path
  getAtPath(obj, path) {
    return path.reduce((current, key) => 
      current !== null && current !== undefined ? current[key] : undefined, 
      obj
    );
  }
  
  // Level-order with level separation
  levelOrder(obj, callback) {
    const queue = [{ value: obj, path: [] }];
    let level = 0;
    let currentLevelSize = 1;
    let nextLevelSize = 0;
    let levelItems = [];
    
    while (queue.length > 0) {
      const { value, path } = queue.shift();
      currentLevelSize--;
      
      levelItems.push({ value, path });
      
      if (value !== null && typeof value === 'object') {
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            queue.push({ value: value[key], path: [...path, key] });
            nextLevelSize++;
          }
        }
      }
      
      // Level complete
      if (currentLevelSize === 0) {
        callback(levelItems, level);
        levelItems = [];
        level++;
        currentLevelSize = nextLevelSize;
        nextLevelSize = 0;
      }
    }
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const complexObj = {
  users: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, push: false }
  }
};

const traverser = new ObjectTraverser({ maxDepth: 3 });

console.log('Find paths to "dark":');
const paths = traverser.findPaths(complexObj, value => value === 'dark');
console.log(paths); // [['settings', 'theme']]

console.log('\\nLevel order:');
traverser.levelOrder(complexObj, (items, level) => {
  console.log(\`Level \${level}:\`, items.map(i => i.path.join('.') || 'root'));
});

// Circular reference test
console.log('\\nCircular reference handling:');
const circular = { a: 1 };
circular.self = circular;

const safeTraverser = new ObjectTraverser({ circular: 'mark' });
safeTraverser.dfsPreOrder(circular, (value, path, depth, isCircular) => {
  console.log(\`\${path.join('.') || 'root'}: \${isCircular ? '[CIRCULAR]' : value}\`);
});`,interviewTraps:[`QUICK REFERENCE:`,`DFS: Stack (LIFO) or recursion, good for deep trees`,`BFS: Queue (FIFO), good for finding shortest path`,`INTERVIEW TIPS:`,`1. Start with simple recursive DFS`,`2. Mention stack vs queue difference`,`3. Handle circular references`,`4. Discuss time/space complexity`],stepByStep:[`Verify root input; handle non-objects immediately.`,`Initialize results list, queue array, and visited Set.`,`Enqueue all top-level key/value entries of the root object with depth 1.`,`Add root object to visited Set.`,`While queue has elements, shift first element from front.`,`Append element to results and invoke optional visitor callback.`,`If element value is an unvisited object, add to visited Set and enqueue its entries with depth + 1.`,`Return full results list after queue drains.`],timeComplexity:`O(V + E) where V is the total number of properties and E is the number of child links in the object graph.`,spaceComplexity:`O(W) where W is the maximum width (number of nodes in the widest level) stored in the queue, plus O(V) for the visited set.`,alternativeSolutions:[`Generator function (function* bfsGenerator) yielding nodes on demand`,`Using double-ended queue (deque) or linked list queue for O(1) dequeue operations`],commonMistakes:[`Omitting visited tracking, causing browser crash / stack overflow on circular references.`,`Using array.pop() instead of array.shift(), which turns BFS into DFS.`,`Mutating the path array in place instead of creating a new path array for children.`],followUps:[`How would you implement a generator that yields each level as a batch array?`,`How would you search for a specific key and return the shortest path to it?`,`How does BFS traversal differ when handling Maps, Sets, and custom iterables?`]},{id:`coding-dfs-object`,title:`DFS Traversal of JavaScript Objects`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`dfs`,`recursion`,`stack`,`tree-traversal`,`objects`],problem:`Implement a Depth-First Search (DFS) traversal function \`dfsTraverse(obj, callback)\` (or \`dfsObject(obj)\`) for arbitrary nested JavaScript objects and arrays.

The function should:
1. Traverse down each branch to its leaf nodes before backtracking and exploring sibling branches.
2. Support both **pre-order** (visiting parent before its children) and **post-order** (visiting children before parent) modes.
3. Prevent infinite recursion caused by circular object references using a visited set.
4. Pass node details \`{ key, value, path, depth, isLeaf, parent }\` to the visitor callback function.
5. Provide both recursive and iterative (stack-based) implementations.`,requirements:[`Perform depth-first traversal (pre-order by default)`,`Handle circular references safely without infinite recursion`,`Track path hierarchy from root to current node`,`Differentiate leaf values from internal object nodes`,`Support deep objects, nested arrays, and primitives`],examples:[{input:`const tree = {
  a: 1,
  b: {
    c: 2,
    d: 3
  },
  e: 4
};
const visited = [];
dfsObject(tree, n => visited.push(n.key));`,output:`['a', 'b', 'c', 'd', 'e'] (descends deeply into b before visiting e)`,explanation:`Pre-order DFS visits a, enters branch b, visits c, d, then visits e.`}],edgeCases:[`Circular links: skip previously visited object references`,`Arrays: traverse items in index order 0, 1, 2...`,`Null values: typeof null === "object", handle as primitive leaf`,`Functions, Dates, RegExps: treat as leaf values or inspect as needed`],naiveApproach:"A simple recursive function without a `visited` set will immediately trigger `RangeError: Maximum call stack size exceeded` when traversing objects with back-references or circular links (e.g. parent-child references).",optimalApproach:"The optimal approach uses recursive DFS with a `WeakSet` / `Set` of active ancestors or visited references:\n1. If the node is primitive, `null`, or a non-plain object (e.g. RegExp, Date), invoke callback with `isLeaf: true` and return.\n2. If already in `visited`, return immediately to avoid cyclic loops.\n3. Mark node in `visited`.\n4. If in `pre-order` mode, invoke callback on the object node.\n5. Iterate each `[key, value]` pair:\n   - Construct `newPath = [...path, key]`.\n   - Recursively call `dfs(value, newPath, depth + 1)`.\n6. If in `post-order` mode, invoke callback on the object node after children finish.",implementation:`function dfsObject(obj, callback, options = {}) {
  const { order = 'pre', visited = new Set() } = options;
  const results = [];

  function traverse(current, path, depth, key, parent) {
    const isObject = current !== null && typeof current === 'object';
    const isLeaf = !isObject;

    const nodeInfo = {
      key,
      value: current,
      path,
      depth,
      isLeaf,
      parent,
    };

    if (isLeaf) {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
      return;
    }

    // Circular reference guard
    if (visited.has(current)) {
      return;
    }
    visited.add(current);

    if (order === 'pre') {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
    }

    for (const [childKey, childVal] of Object.entries(current)) {
      traverse(childVal, [...path, childKey], depth + 1, childKey, current);
    }

    if (order === 'post') {
      if (callback) callback(nodeInfo);
      results.push(nodeInfo);
    }
  }

  // Handle top-level keys
  if (obj !== null && typeof obj === 'object') {
    visited.add(obj);
    for (const [k, v] of Object.entries(obj)) {
      traverse(v, [k], 1, k, obj);
    }
  } else {
    traverse(obj, [], 0, '', null);
  }

  return results;
}`,implementationTS:`export interface DFSNode {
  key: string;
  value: any;
  path: string[];
  depth: number;
  isLeaf: boolean;
  parent?: any;
}

export interface DFSOptions {
  order?: 'pre' | 'post';
}

export function dfsObject(
  obj: unknown,
  callback?: (node: DFSNode) => void,
  options: DFSOptions = {}
): DFSNode[] {
  const { order = 'pre' } = options;
  const visited = new Set<any>();
  const results: DFSNode[] = [];

  function traverse(current: any, path: string[], depth: number, key: string, parent: any) {
    const isObject = current !== null && typeof current === 'object';
    const isLeaf = !isObject;

    const nodeInfo: DFSNode = {
      key,
      value: current,
      path,
      depth,
      isLeaf,
      parent,
    };

    if (isLeaf) {
      callback?.(nodeInfo);
      results.push(nodeInfo);
      return;
    }

    if (visited.has(current)) {
      return;
    }
    visited.add(current);

    if (order === 'pre') {
      callback?.(nodeInfo);
      results.push(nodeInfo);
    }

    for (const [childKey, childVal] of Object.entries(current)) {
      traverse(childVal, [...path, childKey], depth + 1, childKey, current);
    }

    if (order === 'post') {
      callback?.(nodeInfo);
      results.push(nodeInfo);
    }
  }

  if (obj !== null && typeof obj === 'object') {
    visited.add(obj);
    for (const [k, v] of Object.entries(obj)) {
      traverse(v, [k], 1, k, obj);
    }
  } else {
    traverse(obj, [], 0, '', null);
  }

  return results;
}`,stepByStep:[`Check if current node is object or primitive leaf.`,`If leaf, invoke callback and return.`,`Check visited Set to avoid circular loops.`,`If pre-order, process parent node.`,`Iterate child properties and recursively traverse down each branch.`,`If post-order, process parent node after subtrees finish.`,`Return aggregated traversal list.`],timeComplexity:`O(N) where N is the total number of keys and values in the object tree.`,spaceComplexity:`O(D) call stack space where D is the maximum nesting depth of the tree.`,alternativeSolutions:[`Iterative DFS using an explicit LIFO Stack (stack.pop() pattern)`,`Generator implementation yielding DFS nodes step by step`],commonMistakes:[`Failing to treat null as a primitive (null is typeof "object").`,`Calling Object.entries on circular references without visited checks.`,`Confusing pre-order with post-order traversal timing.`],followUps:[`How would you flatten an object into a single-level dot-notated map using DFS (e.g. {"a.b.c": 1})?`,`How would you implement an iterative DFS with an explicit stack to avoid call stack limits on 10,000-deep objects?`,`How does DFS compare to BFS for memory consumption in deep vs wide trees?`]},{id:`coding-remove-circular`,title:`Remove Circular References from JavaScript Objects`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`circular-reference`,`recursion`,`serialization`,`cloning`,`weakset`],problem:'Implement a function `removeCircular(obj)` (or `censorCircular(obj)`) that takes an arbitrary JavaScript object or array that may contain circular references and returns a clean, sanitized deep copy with all circular back-references removed or replaced.\n\nRequirements:\n1. Return a new deep clone where circular references are replaced with `undefined` (omitted from output / JSON), `null`, or a marker string (e.g. `"[Circular]"`).\n2. Do not mutate the original input object.\n3. Handle multiple non-circular shared references correctly (DAGs / Diamond dependencies) — if two different properties point to the same object instance without forming a cycle, preserve the data without falsely flagging it as circular.\n4. Support nested objects, arrays, primitives, and null.\n5. Provide a serializer polyfill: `safeStringify(obj, replacer, space)` that never throws `TypeError: Converting circular structure to JSON`.',requirements:[`Detect and remove cyclic/circular references`,`Do not mutate the original object`,`Distinguish genuine cycles from shared non-circular references (DAG)`,`Handle arrays and objects recursively`,`Return valid JSON-serializable structure`],examples:[{input:`const obj = { a: 1 };
obj.self = obj;
removeCircular(obj)`,output:`{ a: 1, self: undefined } (or "[Circular]")`,explanation:`The self-referential cycle is removed, making the object safely serializable with JSON.stringify().`},{input:`const shared = { x: 10 };
const obj = { first: shared, second: shared };
removeCircular(obj)`,output:`{ first: { x: 10 }, second: { x: 10 } }`,explanation:`Shared reference (DAG) is not a cycle and is properly cloned without being removed.`}],edgeCases:[`Direct cycle (obj.self = obj)`,`Indirect cycle (obj.a.b.c = obj)`,`Array containing itself (arr[0] = arr)`,`Shared references (diamond dependency): should not be treated as circular`,`Primitives, null, and undefined values`],naiveApproach:"A naive approach puts every visited object into a global `Set`. If an object is in the Set, it is skipped. This is incorrect because it falsely breaks shared sub-objects in a Directed Acyclic Graph (DAG) that are not cycles:\n```js\n// Buggy naive approach:\nconst shared = { name: 'Shared' };\nconst data = { a: shared, b: shared }; // b would be falsely stripped!\n```",optimalApproach:'To correctly distinguish true cycles from shared DAG references:\nUse an **Active Ancestor Stack / Set** (tracking objects currently on the active recursion path from root to current node):\n1. Maintain `const ancestors = new Set()` (or an array).\n2. When entering an object, check `ancestors.has(current)`.\n   - If `true`, a circular back-edge is detected! Return `undefined` or `"[Circular]"`.\n3. Add `current` to `ancestors`.\n4. Create cloned object or array.\n5. Recursively clone each key/value pair.\n6. **Backtrack**: Remove `current` from `ancestors` before returning so sibling branches can reference the same sub-object safely.\n7. Return cloned object.',implementation:`function removeCircular(obj, placeholder = undefined) {
  const ancestors = new Set();

  function clone(val) {
    // 1. Handle primitives and null
    if (val === null || typeof val !== 'object') {
      return val;
    }

    // 2. Detect cycle in active recursion stack
    if (ancestors.has(val)) {
      return placeholder;
    }

    // 3. Mark current in active ancestor stack
    ancestors.add(val);

    try {
      if (Array.isArray(val)) {
        const arrCopy = [];
        for (let i = 0; i < val.length; i++) {
          const item = clone(val[i]);
          arrCopy.push(item);
        }
        return arrCopy;
      }

      const objCopy = {};
      for (const [k, v] of Object.entries(val)) {
        const clonedVal = clone(v);
        if (clonedVal !== undefined) {
          objCopy[k] = clonedVal;
        }
      }
      return objCopy;
    } finally {
      // 4. Backtrack: remove from active ancestor stack
      ancestors.delete(val);
    }
  }

  return clone(obj);
}

// Safe JSON stringify helper
function safeStringify(obj, replacer, space) {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return replacer ? replacer(key, value) : value;
    },
    space
  );
}`,implementationTS:`export function removeCircular<T = any>(
  obj: T,
  placeholder: any = undefined
): T {
  const ancestors = new Set<any>();

  function clone(val: any): any {
    if (val === null || typeof val !== 'object') {
      return val;
    }

    if (ancestors.has(val)) {
      return placeholder;
    }

    ancestors.add(val);

    try {
      if (Array.isArray(val)) {
        const arrCopy: any[] = [];
        for (let i = 0; i < val.length; i++) {
          arrCopy.push(clone(val[i]));
        }
        return arrCopy;
      }

      const objCopy: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        const clonedVal = clone(v);
        if (clonedVal !== undefined) {
          objCopy[k] = clonedVal;
        }
      }
      return objCopy;
    } finally {
      ancestors.delete(val);
    }
  }

  return clone(obj);
}

export function safeStringify(
  obj: unknown,
  replacer?: (key: string, value: any) => any,
  space?: string | number
): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return replacer ? replacer(key, value) : value;
    },
    space
  );
}`,theoryAndConcepts:`WHAT IS A CIRCULAR REFERENCE?
-----------------------------
When an object references itself, directly or indirectly.

DIRECT: obj.self = obj
INDIRECT: a.b = b; b.a = a (cycle: a → b → a)

WHY IS IT A PROBLEM?
--------------------
1. JSON.stringify() throws error
2. Deep copy fails (infinite loop)
3. Memory leaks possible
4. Serialization fails

DETECTION STRATEGY:
-------------------
Keep track of visited objects using WeakSet/WeakMap
If we encounter an object we've seen, it's circular`,beginnerApproach:`Beginner: Detect circular references


Beginner: Simple circular removal (replace with null)`,beginnerImplementation:`function hasCircularReference(obj) {
  const seen = new WeakSet();
  
  function detect(value) {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    
    if (seen.has(value)) {
      return true; // Found circular!
    }
    
    seen.add(value);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (detect(value[key])) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  return detect(obj);
}

function removeCircularBeginner(obj) {
  const seen = new WeakSet();
  
  function process(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      return null; // Replace circular with null
    }
    
    seen.add(value);
    
    if (Array.isArray(value)) {
      return value.map(process);
    }
    
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = process(value[key]);
      }
    }
    
    return result;
  }
  
  return process(obj);
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

// Direct circular reference
const direct = { name: 'obj' };
direct.self = direct;

console.log('Has circular (direct):', hasCircularReference(direct)); // true

// Indirect circular reference
const a = { name: 'a' };
const b = { name: 'b' };
a.ref = b;
b.ref = a;

console.log('Has circular (indirect):', hasCircularReference(a)); // true

// No circular
const normal = { a: 1, b: { c: 2 } };
console.log('Has circular (normal):', hasCircularReference(normal)); // false

// Remove circular
const cleaned = removeCircularBeginner(direct);
console.log('Cleaned:', cleaned); // { name: 'obj', self: null }
console.log('Can stringify:', JSON.stringify(cleaned));`,intermediateApproach:`Intermediate: Remove with path information


Intermediate: JSON.stringify replacer for circular references`,intermediateImplementation:`function removeCircularIntermediate(obj, options = {}) {
  const {
    replacement = '[Circular]',  // What to replace with
    keepPath = false             // Include path to circular ref
  } = options;
  
  const seen = new WeakMap();
  
  function process(value, path = 'root') {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      const originalPath = seen.get(value);
      return keepPath ? \`\${replacement}: \${originalPath}\` : replacement;
    }
    
    seen.set(value, path);
    
    if (Array.isArray(value)) {
      return value.map((item, index) => process(item, \`\${path}[\${index}]\`));
    }
    
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = process(value[key], \`\${path}.\${key}\`);
      }
    }
    
    return result;
  }
  
  return process(obj);
}

function getCircularReplacer(replacement = '[Circular]') {
  const seen = new WeakSet();
  
  return function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return replacement;
      }
      seen.add(value);
    }
    return value;
  };
}

// Safe JSON stringify
function safeStringify(obj, space = 2) {
  return JSON.stringify(obj, getCircularReplacer(), space);
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const complex = {
  name: 'root',
  child: {
    name: 'child',
    parent: null // will be circular
  }
};
complex.child.parent = complex;

console.log('With path:', removeCircularIntermediate(complex, { 
  keepPath: true,
  replacement: '[Circular Reference]'
}));

console.log('Safe stringify:', safeStringify(complex));`,expertApproach:`Expert: Full-featured circular handler


Expert: Break circular by replacing with reference IDs`,expertImplementation:`class CircularHandler {
  constructor(options = {}) {
    this.options = {
      replacement: '[Circular]',
      keepPath: false,
      detectOnly: false,
      onCircular: null,        // Callback when circular found
      maxDepth: Infinity,
      handleSpecialTypes: true, // Handle Map, Set, etc.
      ...options
    };
  }
  
  // Find all circular references
  findCirculars(obj) {
    const circulars = [];
    const seen = new WeakMap();
    
    const find = (value, path = []) => {
      if (value === null || typeof value !== 'object') {
        return;
      }
      
      if (seen.has(value)) {
        circulars.push({
          path: path.join('.'),
          referencesPath: seen.get(value).join('.')
        });
        return;
      }
      
      seen.set(value, [...path]);
      
      if (Array.isArray(value)) {
        value.forEach((item, index) => find(item, [...path, \`[\${index}]\`]));
      } else if (value instanceof Map) {
        value.forEach((v, k) => find(v, [...path, \`Map(\${k})\`]));
      } else if (value instanceof Set) {
        let i = 0;
        value.forEach(v => find(v, [...path, \`Set[\${i++}]\`]));
      } else {
        for (const key of Object.keys(value)) {
          find(value[key], [...path, key]);
        }
      }
    };
    
    find(obj, ['root']);
    return circulars;
  }
  
  // Remove circular references
  remove(obj) {
    const seen = new WeakMap();
    const { replacement, keepPath, onCircular, maxDepth, handleSpecialTypes } = this.options;
    
    const process = (value, path = [], depth = 0) => {
      // Primitive or null
      if (value === null || typeof value !== 'object') {
        return value;
      }
      
      // Max depth
      if (depth > maxDepth) {
        return '[Max Depth]';
      }
      
      // Circular detection
      if (seen.has(value)) {
        const originalPath = seen.get(value);
        onCircular?.(path.join('.'), originalPath.join('.'));
        return keepPath ? \`\${replacement}: \${originalPath.join('.')}\` : replacement;
      }
      
      seen.set(value, [...path]);
      
      // Date
      if (value instanceof Date) {
        return new Date(value.getTime());
      }
      
      // RegExp
      if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags);
      }
      
      // Map
      if (handleSpecialTypes && value instanceof Map) {
        const result = new Map();
        value.forEach((v, k) => {
          result.set(k, process(v, [...path, \`Map(\${k})\`], depth + 1));
        });
        return result;
      }
      
      // Set
      if (handleSpecialTypes && value instanceof Set) {
        const result = new Set();
        let i = 0;
        value.forEach(v => {
          result.add(process(v, [...path, \`Set[\${i++}]\`], depth + 1));
        });
        return result;
      }
      
      // Array
      if (Array.isArray(value)) {
        return value.map((item, index) => 
          process(item, [...path, \`[\${index}]\`], depth + 1)
        );
      }
      
      // Object
      const result = {};
      
      // Handle Symbol keys
      const keys = [
        ...Object.keys(value),
        ...Object.getOwnPropertySymbols(value)
      ];
      
      for (const key of keys) {
        const keyStr = typeof key === 'symbol' ? key.toString() : key;
        result[key] = process(value[key], [...path, keyStr], depth + 1);
      }
      
      return result;
    };
    
    return process(obj, ['root']);
  }
  
  // Check if has circular (faster than findCirculars)
  hasCircular(obj) {
    const seen = new WeakSet();
    
    const check = (value) => {
      if (value === null || typeof value !== 'object') return false;
      if (seen.has(value)) return true;
      seen.add(value);
      
      if (Array.isArray(value)) {
        return value.some(check);
      }
      
      return Object.values(value).some(check);
    };
    
    return check(obj);
  }
  
  // Safe stringify
  stringify(obj, space) {
    return JSON.stringify(this.remove(obj), null, space);
  }
}

function serializeWithRefs(obj) {
  const seen = new Map();
  let idCounter = 0;
  
  // First pass: assign IDs to all objects
  function assignIds(value) {
    if (value === null || typeof value !== 'object') return;
    if (seen.has(value)) return;
    
    seen.set(value, idCounter++);
    
    if (Array.isArray(value)) {
      value.forEach(assignIds);
    } else {
      Object.values(value).forEach(assignIds);
    }
  }
  
  assignIds(obj);
  
  // Second pass: serialize with refs
  const serialized = new Map();
  
  function serialize(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    const id = seen.get(value);
    
    if (serialized.has(id)) {
      return { $ref: id };
    }
    
    if (Array.isArray(value)) {
      const arr = [];
      serialized.set(id, arr);
      value.forEach((item, i) => arr[i] = serialize(item));
      return arr;
    }
    
    const result = { $id: id };
    serialized.set(id, result);
    
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = serialize(value[key]);
      }
    }
    
    return result;
  }
  
  return serialize(obj);
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

const handler = new CircularHandler({
  keepPath: true,
  onCircular: (path, refPath) => {
    console.log(\`Circular at "\${path}" referencing "\${refPath}"\`);
  }
});

// Complex structure with multiple circulars
const root = {
  a: { name: 'a' },
  b: { name: 'b' },
  deep: {
    nested: {
      back: null
    }
  }
};
root.a.toB = root.b;
root.b.toA = root.a;
root.deep.nested.back = root;

console.log('Find all circulars:', handler.findCirculars(root));
console.log('Removed:', handler.remove(root));

// With reference IDs
console.log('\\nWith refs:', JSON.stringify(serializeWithRefs(root), null, 2));`,interviewTraps:[`QUICK REFERENCE:`,`- Use WeakSet/WeakMap to track seen objects`,`- WeakSet for detection only`,`- WeakMap to store path/info`,`- JSON.stringify throws on circular`,`INTERVIEW TIPS:`,`1. Explain what circular reference is`,`2. Show WeakSet for detection`],stepByStep:[`Define ancestors Set tracking the active depth-first traversal path.`,`Check if value is null or primitive; return as-is.`,`If ancestors.has(val), cycle is detected: return replacement placeholder.`,`Add val to ancestors Set.`,`Recursively process array elements or object properties in a try block.`,`In finally block, delete val from ancestors Set (backtracking).`,`Return clean cloned structure.`],timeComplexity:`O(N) where N is the total count of properties in the object graph.`,spaceComplexity:`O(D) where D is the maximum recursion depth stored in the ancestors Set.`,alternativeSolutions:[`JSON.stringify with replacer function tracking WeakSet of visited objects`,`Structured Clone algorithm / MessageChannel serialization`],commonMistakes:[`Using a permanent Set without backtracking, breaking legitimate shared DAG references.`,`Mutating the input object (e.g. deleting keys directly on the input).`,`Forgetting array iteration vs object key iteration.`],followUps:[`How does structuredClone in modern browsers handle circular references compared to JSON.stringify?`,`How would you preserve circular references using JSONPath or $ref pointers (like JSON-LD / Flatted)?`,`How would you implement deep equality for objects with circular references?`]},{id:`coding-observer-pattern`,title:`Implement the Observer Pattern (Observable / Subject)`,difficulty:`Intermediate`,category:`Coding`,tags:[`javascript`,`design-patterns`,`observer-pattern`,`pub-sub`,`reactive-programming`,`rxjs`],problem:'Implement the classic Observer Pattern with a `Subject` (or `Observable`) and `Observer` interface in JavaScript/TypeScript.\n\nThe implementation must support:\n1. `subject.subscribe(observer)`: Subscribes an observer (function or object with `next`, `error`, `complete` methods). Returns a subscription object with an `unsubscribe()` method.\n2. `subject.next(data)`: Notifies all active subscribers with data.\n3. `subject.error(err)`: Notifies subscribers of an error and completes the stream.\n4. `subject.complete()`: Notifies subscribers of completion; no further values are emitted.\n5. **BehaviorSubject**: A specialized subject variant that stores the "current" value and immediately emits it to any new subscriber upon subscription.\n6. **Operators**: Basic pipeline operators like `map` and `filter` to transform streams.',requirements:[`Subject with subscribe, next, error, complete methods`,`Return subscription with unsubscribe() function`,`Prevent memory leaks: unsubscribe cleans up observer reference`,`BehaviorSubject storing current/initial value and replaying to new subscribers`,`Stream completion stops further notifications`],examples:[{input:`const subject = new Subject();
const sub1 = subject.subscribe(val => console.log('Sub 1:', val));
subject.next(10);
const sub2 = subject.subscribe(val => console.log('Sub 2:', val));
subject.next(20);
sub1.unsubscribe();
subject.next(30);`,output:`Sub 1: 10
Sub 1: 20
Sub 2: 20
Sub 2: 30`,explanation:`sub1 receives 10 and 20, then unsubscribes; sub2 receives 20 and 30.`},{input:`const bSubject = new BehaviorSubject('initial');
bSubject.subscribe(val => console.log('Received:', val));
bSubject.next('updated');`,output:`Received: initial
Received: updated`,explanation:`BehaviorSubject immediately emits its current value on subscription.`}],edgeCases:[`Unsubscribing multiple times: idempotent, does not throw error`,`Unsubscribing inside an observer callback during a next() broadcast: iterate a copy of observers array to avoid index shifting`,`Calling next() after complete() or error(): silently ignored`,`Throwing inside an observer callback: isolate errors so other observers still receive data`],naiveApproach:"A naive approach iterates directly over the observers array while calling each observer. If an observer calls `unsubscribe()` inside its callback, the array length changes in-place during the loop, skipping subsequent observers in the iteration.",optimalApproach:"The optimal approach:\n1. Stores observers in a `Set` or creates a snapshot copy (`[...this.observers]`) before iterating in `next()`.\n2. Encapsulates observers into a normalized interface `{ next, error, complete }`.\n3. Returns a subscription object with `unsubscribe()` that removes the observer from the set and flags itself as closed.\n4. Tracks stream status: `isStopped: boolean` to ignore calls after complete/error.",implementation:`class Subject {
  constructor() {
    this.observers = new Set();
    this.isClosed = false;
  }

  subscribe(observerOrNext, error, complete) {
    if (this.isClosed) {
      if (typeof complete === 'function') complete();
      return { unsubscribe: () => {} };
    }

    const observer = typeof observerOrNext === 'function'
      ? { next: observerOrNext, error, complete }
      : observerOrNext;

    this.observers.add(observer);

    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  next(value) {
    if (this.isClosed) return;
    // Iterate snapshot copy to protect against in-flight unsubscribes
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.next === 'function') {
          observer.next(value);
        }
      } catch (err) {
        console.error('Error in observer next():', err);
      }
    }
  }

  error(err) {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.error === 'function') {
          observer.error(err);
        }
      } catch (e) {
        console.error('Error in observer error():', e);
      }
    }
    this.observers.clear();
  }

  complete() {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      try {
        if (typeof observer.complete === 'function') {
          observer.complete();
        }
      } catch (err) {
        console.error('Error in observer complete():', err);
      }
    }
    this.observers.clear();
  }
}

class BehaviorSubject extends Subject {
  constructor(initialValue) {
    super();
    this.value = initialValue;
  }

  getValue() {
    if (this.isClosed) {
      throw new Error('BehaviorSubject is closed');
    }
    return this.value;
  }

  subscribe(observerOrNext, error, complete) {
    const subscription = super.subscribe(observerOrNext, error, complete);

    if (!this.isClosed) {
      const observer = typeof observerOrNext === 'function'
        ? { next: observerOrNext }
        : observerOrNext;

      if (typeof observer.next === 'function') {
        observer.next(this.value);
      }
    }

    return subscription;
  }

  next(value) {
    if (this.isClosed) return;
    this.value = value;
    super.next(value);
  }
}`,implementationTS:`export interface Observer<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe: () => void;
  readonly closed: boolean;
}

export class Subject<T> {
  protected observers = new Set<Observer<T>>();
  protected isClosed = false;

  subscribe(
    observerOrNext: Observer<T> | ((value: T) => void),
    error?: (err: any) => void,
    complete?: () => void
  ): Subscription {
    if (this.isClosed) {
      if (typeof complete === 'function') complete();
      return { unsubscribe: () => {}, closed: true };
    }

    const observer: Observer<T> =
      typeof observerOrNext === 'function'
        ? { next: observerOrNext, error, complete }
        : observerOrNext;

    this.observers.add(observer);
    let isSubscribed = true;

    return {
      unsubscribe: () => {
        if (!isSubscribed) return;
        isSubscribed = false;
        this.observers.delete(observer);
      },
      get closed() {
        return !isSubscribed;
      },
    };
  }

  next(value: T): void {
    if (this.isClosed) return;
    for (const observer of Array.from(this.observers)) {
      observer.next?.(value);
    }
  }

  error(err: any): void {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      observer.error?.(err);
    }
    this.observers.clear();
  }

  complete(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    for (const observer of Array.from(this.observers)) {
      observer.complete?.();
    }
    this.observers.clear();
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  private _value: T;

  constructor(initialValue: T) {
    super();
    this._value = initialValue;
  }

  getValue(): T {
    return this._value;
  }

  override subscribe(
    observerOrNext: Observer<T> | ((value: T) => void),
    error?: (err: any) => void,
    complete?: () => void
  ): Subscription {
    const subscription = super.subscribe(observerOrNext, error, complete);
    if (!this.isClosed) {
      const observer: Observer<T> =
        typeof observerOrNext === 'function'
          ? { next: observerOrNext }
          : observerOrNext;
      observer.next?.(this._value);
    }
    return subscription;
  }

  override next(value: T): void {
    this._value = value;
    super.next(value);
  }
}`,theoryAndConcepts:`WHAT IS THE OBSERVER PATTERN?
-----------------------------
A behavioral design pattern where an object (Subject/Observable)
maintains a list of dependents (Observers) and notifies them
automatically of state changes.

Also known as:
- Pub/Sub (Publish/Subscribe)
- Event Emitter
- Listener Pattern

KEY COMPONENTS:
---------------
1. Subject (Observable): Maintains observers, sends notifications
2. Observer: Receives updates from subject
3. ConcreteSubject: Stores state, notifies when state changes
4. ConcreteObserver: Implements update logic

USE CASES:
----------
- Event handling (DOM events)
- State management (Redux, MobX)
- Real-time updates (WebSocket messages)
- Data binding (frameworks)
- Logging systems

OBSERVER vs EVENT EMITTER:
--------------------------
Observer: Objects subscribe to subject
Event Emitter: Functions subscribe to named events
(In practice, very similar - EventEmitter is a form of Observer)`,beginnerApproach:`Beginner: Simple Observer Pattern`,beginnerImplementation:`class SubjectBeginner {
  constructor() {
    this.observers = [];
  }
  
  // Add observer
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  // Remove observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Notify all observers
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

// Test Beginner Level
console.log('=== BEGINNER LEVEL ===');

const subject = new SubjectBeginner();

// Observer functions
const observer1 = (data) => console.log('Observer 1:', data);
const observer2 = (data) => console.log('Observer 2:', data);

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');

subject.unsubscribe(observer1);
subject.notify('Only Observer 2');`,intermediateApproach:`Intermediate: Observable with state


Intermediate: Observer with filter (selective subscription)`,intermediateImplementation:`class Observable {
  constructor(initialState = null) {
    this._observers = new Set();
    this._state = initialState;
  }
  
  // Get current state
  get state() {
    return this._state;
  }
  
  // Set state and notify
  set state(newState) {
    const oldState = this._state;
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  // Update state (for objects)
  setState(updater) {
    const oldState = this._state;
    
    if (typeof updater === 'function') {
      this._state = updater(this._state);
    } else {
      this._state = { ...this._state, ...updater };
    }
    
    this._notify(this._state, oldState);
  }
  
  // Subscribe with automatic unsubscribe function
  subscribe(observer) {
    this._observers.add(observer);
    
    // Immediately call with current state
    observer(this._state, this._state);
    
    // Return unsubscribe function
    return () => {
      this._observers.delete(observer);
    };
  }
  
  _notify(newState, oldState) {
    this._observers.forEach(observer => {
      try {
        observer(newState, oldState);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }
}

class SelectiveObservable extends Observable {
  subscribe(observer, selector = state => state) {
    let previousSelected = selector(this._state);
    
    const wrappedObserver = (newState, oldState) => {
      const newSelected = selector(newState);
      const oldSelected = previousSelected;
      
      // Only notify if selected value changed
      if (newSelected !== oldSelected) {
        previousSelected = newSelected;
        observer(newSelected, oldSelected);
      }
    };
    
    return super.subscribe(wrappedObserver);
  }
}

// Test Intermediate Level
console.log('\\n=== INTERMEDIATE LEVEL ===');

const store = new Observable({ count: 0, name: 'Test' });

const unsubscribe = store.subscribe((state, oldState) => {
  console.log('State changed:', oldState, '->', state);
});

store.setState({ count: 1 });
store.setState(state => ({ ...state, count: state.count + 1 }));

unsubscribe();
store.setState({ count: 100 }); // No log - unsubscribed

// Selective
const selectiveStore = new SelectiveObservable({ a: 1, b: 2 });
selectiveStore.subscribe(
  (value) => console.log('A changed:', value),
  state => state.a
);

selectiveStore.setState({ a: 1, b: 100 }); // No notify (a unchanged)
selectiveStore.setState({ a: 2, b: 100 }); // Notify (a changed)`,expertApproach:`Expert: Full-featured Observable System


Expert: Reactive programming style`,expertImplementation:`class AdvancedObservable {
  constructor(initialState = {}) {
    this._state = initialState;
    this._observers = new Map(); // Map<observerId, { callback, options }>
    this._nextId = 0;
    this._middleware = [];
    this._history = [];
    this._maxHistory = 10;
  }
  
  // Get state or nested value
  get(path) {
    if (!path) return this._state;
    
    return path.split('.').reduce((obj, key) => 
      obj && obj[key] !== undefined ? obj[key] : undefined
    , this._state);
  }
  
  // Set state with optional path
  set(pathOrValue, value) {
    let newState;
    
    if (typeof pathOrValue === 'string') {
      newState = this._setNested(this._state, pathOrValue, value);
    } else {
      newState = typeof pathOrValue === 'function' 
        ? pathOrValue(this._state) 
        : pathOrValue;
    }
    
    // Run middleware
    for (const mw of this._middleware) {
      newState = mw(newState, this._state);
      if (newState === false) return; // Middleware can cancel
    }
    
    // Save history
    this._history.push(this._state);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }
    
    const oldState = this._state;
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  _setNested(obj, path, value) {
    const keys = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return newObj;
  }
  
  // Subscribe with options
  subscribe(callback, options = {}) {
    const {
      immediate = true,      // Call immediately with current state
      selector = null,       // Select specific part of state
      equalityFn = (a, b) => a === b, // Custom equality check
      debounce = 0           // Debounce notifications
    } = options;
    
    const id = this._nextId++;
    
    let previousSelected = selector ? selector(this._state) : this._state;
    let timeoutId = null;
    
    const wrappedCallback = (newState, oldState) => {
      const newSelected = selector ? selector(newState) : newState;
      
      // Check if changed
      if (equalityFn(newSelected, previousSelected)) {
        return;
      }
      
      const oldSelected = previousSelected;
      previousSelected = newSelected;
      
      if (debounce > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(newSelected, oldSelected);
        }, debounce);
      } else {
        callback(newSelected, oldSelected);
      }
    };
    
    this._observers.set(id, { callback: wrappedCallback, options });
    
    // Immediate call
    if (immediate) {
      callback(previousSelected, previousSelected);
    }
    
    // Return unsubscribe function
    return () => {
      clearTimeout(timeoutId);
      this._observers.delete(id);
    };
  }
  
  // Add middleware
  use(middleware) {
    this._middleware.push(middleware);
    return () => {
      const index = this._middleware.indexOf(middleware);
      if (index > -1) this._middleware.splice(index, 1);
    };
  }
  
  // Undo last change
  undo() {
    if (this._history.length > 0) {
      const previousState = this._history.pop();
      const oldState = this._state;
      this._state = previousState;
      this._notify(this._state, oldState);
      return true;
    }
    return false;
  }
  
  // Batch multiple updates
  batch(updates) {
    const oldState = this._state;
    let newState = this._state;
    
    for (const update of updates) {
      if (typeof update === 'function') {
        newState = update(newState);
      } else {
        newState = { ...newState, ...update };
      }
    }
    
    this._state = newState;
    this._notify(newState, oldState);
  }
  
  _notify(newState, oldState) {
    this._observers.forEach(({ callback }) => {
      try {
        callback(newState, oldState);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }
  
  // Observable info
  get observerCount() {
    return this._observers.size;
  }
  
  get historyLength() {
    return this._history.length;
  }
}

class ReactiveValue {
  static create(initialValue) {
    return new ReactiveValue(initialValue);
  }
  
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
    this._derivations = new Set();
  }
  
  get value() {
    return this._value;
  }
  
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
      this._updateDerived();
    }
  }
  
  subscribe(fn) {
    this._subscribers.add(fn);
    return () => this._subscribers.delete(fn);
  }
  
  _notify() {
    this._subscribers.forEach(fn => fn(this._value));
  }
  
  _updateDerived() {
    this._derivations.forEach(derived => derived._recompute());
  }
  
  // Create derived value
  derive(computeFn) {
    const derived = new DerivedValue(computeFn, [this]);
    this._derivations.add(derived);
    return derived;
  }
  
  // Combine multiple reactive values
  static combine(reactives, combineFn) {
    return new DerivedValue(() => combineFn(...reactives.map(r => r.value)), reactives);
  }
}

class DerivedValue extends ReactiveValue {
  constructor(computeFn, dependencies) {
    super(null);
    this._computeFn = computeFn;
    this._dependencies = dependencies;
    this._recompute();
  }
  
  _recompute() {
    this.value = this._computeFn();
  }
  
  // Derived values are read-only
  set value(v) {
    super.value = v;
  }
}

// Test Expert Level
console.log('\\n=== EXPERT LEVEL ===');

// Advanced Observable
const appState = new AdvancedObservable({
  user: { name: 'John', age: 30 },
  settings: { theme: 'dark' }
});

// Middleware for logging
appState.use((newState, oldState) => {
  console.log('State update:', { from: oldState, to: newState });
  return newState;
});

// Subscribe to specific path
const unsubUser = appState.subscribe(
  (user) => console.log('User changed:', user),
  { selector: state => state.user }
);

appState.set('user.name', 'Jane');
appState.set('settings.theme', 'light'); // User observer not called

appState.undo(); // Revert last change

// Reactive values
const count = ReactiveValue.create(0);
const doubled = count.derive(c => c.value * 2);

doubled.subscribe(val => console.log('Doubled:', val));

count.value = 5; // Logs: "Doubled: 10"`,interviewTraps:[`QUICK REFERENCE:`,`Subject: Maintains list of observers, notifies them`,`Observer: Receives updates, implements update method`,`INTERVIEW TIPS:`,`1. Explain the pattern conceptually first`,`2. Show simple implementation`,`3. Discuss use cases (events, state, data binding)`,`4. Mention memory leaks (unsubscribe!)`],stepByStep:[`Define Subject class maintaining observers Set and isClosed boolean.`,`Implement subscribe returning subscription with idempotent unsubscribe closure.`,`Implement next iterating snapshot of observers and executing callback safely.`,`Implement error and complete closing stream and cleaning up observer Set.`,`Subclass BehaviorSubject to store current value and immediately emit to new subscribers.`],timeComplexity:`O(1) subscription and unsubscription; O(K) broadcast where K is the number of active subscribers.`,spaceComplexity:`O(K) to store references to active subscribers in memory.`,alternativeSolutions:[`EventEmitter (keyed by string event names vs typed streams)`,`BroadcastChannel / CustomEvent browser event system`],commonMistakes:[`Iterating over the live observers collection while allowing subscribers to unsubscribe in their next() handlers.`,`Emitting values after complete() or error() has been called.`,`Not emitting initial value synchronously during BehaviorSubject.subscribe().`],followUps:[`How does the Observer pattern differ from the Pub/Sub pattern (broker vs direct coupling)?`,`How would you implement a pipe() method supporting map, filter, and debounce operators?`,`How is this pattern used internally in React state managers like Zustand, Redux, and RxJS?`]}];export{e as t};