import type { Topic } from "../../types";

export const cssTopics: Topic[] = [
  // ─── 1. Class Selectors & Other Selectors ───────────────────────────
  {
    id: "css-selectors",
    title: "CSS Selectors & Combinators",
    description:
      "Deep dive into CSS selectors: class, ID, element, universal, attribute selectors, pseudo-classes, pseudo-elements, and combinators (descendant, child, adjacent, general sibling).",
    category: "CSS",
    difficulty: "Beginner",
    tags: [
      "selectors",
      "combinators",
      "attribute-selectors",
      "pseudo-classes",
      "pseudo-elements",
      "has",
      "is",
      "where",
    ],
    overview:
      "CSS selectors specify which HTML elements styles apply to. Understanding selector types, combinators (>, +, ~), modern functional pseudo-classes (:has, :is, :where), and attribute matching ([attr^=val], [attr*=val]) is critical for writing performant, expressive, and maintainable CSS without unnecessary utility classes or ID bloat.",
    concepts: [
      "Basic selectors: Type, Class (.class), ID (#id), Universal (*)",
      "Combinators: Descendant (space), Child (>), Adjacent Sibling (+), General Sibling (~)",
      "Attribute selectors: [attr], [attr=val], [attr^=val], [attr$=val], [attr*=val], [attr~=val], [attr|=val]",
      "Pseudo-classes: :hover, :active, :focus, :focus-visible, :focus-within, :first-child, :last-child, :nth-child(), :not(), :is(), :where(), :has()",
      "Pseudo-elements: ::before, ::after, ::first-line, ::first-letter, ::placeholder, ::selection, ::marker",
      "Modern :has() relational parent selector",
      ":is() vs :where() specificity differences",
    ],
    relatedTopicIds: ["css-specificity-cascade", "css-box-model"],
    questions: [
      {
        id: "css-selectors-1",
        question:
          "What are the CSS combinators and how do descendant, child, adjacent sibling, and general sibling combinators differ?",
        answer:
          "CSS combinators express relationships between selectors:\n1. **Descendant Combinator (space)**: Matches all matching elements nested inside the ancestor, regardless of depth (`div p` matches `<p>` directly or deeply nested inside `<div>`).\n2. **Child Combinator (`>`)**: Matches only direct children (`ul > li` matches `<li>` directly under `<ul>`, but not inside a nested sublist).\n3. **Adjacent Sibling Combinator (`+`)**: Matches the element immediately following the first element sharing the same parent (`h2 + p` targets the first paragraph immediately following an `<h2>`).\n4. **General Sibling Combinator (`~`)**: Matches all subsequent sibling elements sharing the same parent (`h2 ~ p` targets all `<p>` elements following `<h2>`).",
        shortAnswer:
          "Descendant (space) selects any nested descendant; Child (>) selects only direct children; Adjacent Sibling (+) selects the immediate next sibling; General Sibling (~) selects all subsequent siblings.",
        code: `/* Descendant: all p inside article */
article p { color: #333; }

/* Child: only direct li of .nav */
.nav > li { display: inline-block; }

/* Adjacent Sibling: paragraph immediately after h2 */
h2 + p { font-size: 1.2rem; font-weight: 500; }

/* General Sibling: all buttons after input */
input ~ button { opacity: 1; }`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-selectors",
        tags: ["combinators", "child", "sibling", "descendant"],
        commonMistakes: [
          "Confusing descendant selector (space) with chaining (no space, e.g. .card.active).",
          "Assuming + targets elements preceding the selector (CSS selectors only match forward in source order).",
        ],
        followUps: [
          "How does :has() simulate previous-sibling or parent selection?",
        ],
        interviewTips: [
          "Show practical use cases, like using + for input label float patterns or typography vertical margins.",
        ],
      },
      {
        id: "css-selectors-2",
        question:
          "Explain modern CSS pseudo-classes: :is(), :where(), and the relational selector :has().",
        answer:
          "Modern CSS introduced powerful functional pseudo-classes:\n1. **`:is()`**: Takes a selector list and matches if any selector matches. Specificity is calculated as the **highest specificity** of any argument in the list.\n2. **`:where()`**: Identical to `:is()` in matching behavior, but its specificity is **always zero (0, 0, 0)**. This makes it ideal for CSS resets, design systems, and default component styling where consumers should easily override rules without specificity hacks.\n3. **`:has()` (The Parent Selector)**: A relational pseudo-class that matches an element if any relative selector passed to it matches. For example, `article:has(img)` matches `<article>` only if it contains an `<img>`. It can also check subsequent siblings (`h2:has(+ p.intro)`).",
        shortAnswer:
          ":is() groups selectors taking the highest specificity; :where() groups selectors with zero specificity (great for resets); :has() is the long-awaited parent/relational selector matching elements based on their children or siblings.",
        code: `/* :is() - Specificity = (1, 0, 0) because of #nav */
:is(header, footer, #nav) a { color: blue; }

/* :where() - Specificity = (0, 0, 1) for 'a' only, :where() is 0 */
:where(header, footer, #nav) a { color: blue; }

/* :has() - Parent selector: card with an image */
.card:has(img) { grid-template-columns: 200px 1fr; }

/* Form styling: highlight fieldset containing invalid input */
fieldset:has(input:invalid) { border-color: red; }`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-selectors",
        tags: ["has", "is", "where", "pseudo-classes", "specificity"],
        commonMistakes: [
          "Nesting :has() inside :has(), which is invalid according to the CSS specification.",
          "Not knowing that :where() has zero specificity, leading to unexpected cascade overwrites.",
        ],
        followUps: [
          "What are the performance implications of complex :has() selectors?",
        ],
        interviewTips: [
          "Highlight that :has() eliminated the need for JavaScript class toggles for parent/sibling state in modern web apps.",
        ],
      },
      {
        id: "css-selectors-3",
        question:
          "What is the difference between pseudo-classes (:hover, :focus, :nth-child) and pseudo-elements (::before, ::after)?",
        answer:
          '**Pseudo-classes (single colon `:`)** target an element based on its dynamic state (e.g. `:hover`, `:active`, `:focus`, `:checked`, `:disabled`) or structural position in the DOM (e.g. `:first-child`, `:nth-child(2n+1)`). They select existing DOM elements in a specific state.\n\n**Pseudo-elements (double colon `::`)** create virtual sub-elements or style specific parts of an element that do not exist as independent HTML tags in the DOM tree (e.g. `::before`, `::after`, `::placeholder`, `::selection`, `::marker`).\n\n`::before` and `::after` insert generated content before or after the element\'s real content (requiring a `content: ""` property) and behave like inline elements by default.',
        shortAnswer:
          "Pseudo-classes (:) style existing elements in specific states or DOM positions; Pseudo-elements (::) create virtual elements or target sub-parts (like ::before, ::after, ::selection).",
        code: `/* Pseudo-class: state */
button:hover { background: #4f46e5; }
button:focus-visible { outline: 2px solid #6366f1; }
li:nth-child(even) { background: #f8fafc; }

/* Pseudo-element: generated content */
.badge::before {
  content: "•";
  margin-right: 4px;
  color: green;
}

::selection {
  background: #fef08a;
  color: #1e293b;
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-selectors",
        tags: [
          "pseudo-class",
          "pseudo-element",
          "before",
          "after",
          "nth-child",
        ],
        commonMistakes: [
          'Forgetting `content: ""` on ::before and ::after, causing them not to render.',
          "Using pseudo-elements on void elements (<input>, <img>, <br>) which do not support child content.",
        ],
        followUps: [
          "How does :focus-visible differ from :focus for accessibility?",
        ],
        interviewTips: [
          "Mention :focus-visible as an accessibility best practice to avoid showing focus rings on mouse clicks while keeping them for keyboard Tab navigation.",
        ],
      },
    ],
  },

  // ─── 2. Box Model, Normal Flow & Centering ───────────────────────────
  {
    id: "css-box-model",
    title: "Box Model, Normal Flow & Centering",
    description:
      "Comprehensive understanding of content-box vs border-box, padding, borders, margins, margin collapsing, block vs inline formatting contexts, and all modern centering techniques.",
    category: "CSS",
    difficulty: "Beginner",
    tags: [
      "box-model",
      "border-box",
      "margin-collapsing",
      "centering",
      "normal-flow",
    ],
    overview:
      "Every element in CSS is rendered as a rectangular box. The CSS Box Model describes how content, padding, border, and margin combine to calculate the element dimensions and layout spacing. Mastering box-sizing: border-box, margin collapsing rules, and centering methods is foundational for every frontend engineer.",
    concepts: [
      "Box Model components: Content, Padding, Border, Margin",
      "box-sizing: content-box (default) vs border-box",
      "Margin collapsing rules and triggers (adjacent siblings, parent/child, empty blocks)",
      "Ways to prevent margin collapsing (padding, border, overflow: hidden, flex/grid)",
      "Normal flow: Block vs Inline vs Inline-Block formatting contexts",
      "Centering techniques: Flexbox, Grid, Margin auto, Absolute + Transform, Text-align",
    ],
    relatedTopicIds: ["css-selectors", "css-flexbox", "css-grid"],
    questions: [
      {
        id: "css-box-model-1",
        question:
          "Explain the difference between box-sizing: content-box and box-sizing: border-box.",
        answer:
          "In standard CSS:\n1. **`content-box` (Default)**: The `width` and `height` properties apply **only to the content area**. Any `padding` and `border` are added on top of the specified width. If an element has `width: 200px; padding: 20px; border: 5px solid;`, its total rendered width in the layout is $200 + 40 + 10 = 250\\text{px}$.\n2. **`border-box`**: The `width` and `height` include **content, padding, and border**. The browser automatically shrinks the content area to accommodate padding and border. With `width: 200px; padding: 20px; border: 5px solid;`, the total width remains exactly $200\\text{px}$ (content width becomes $150\\text{px}$).\n\n`border-box` makes responsive layouts, fluid percentages, and grid calculations far more intuitive. It is standard industry practice to apply `box-sizing: border-box` globally via the universal selector reset.",
        shortAnswer:
          "content-box calculates total width as width + padding + border; border-box includes padding and border inside the declared width, making layout sizing predictable.",
        code: `/* Universal Box Sizing Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Example */
.box-content {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 5px solid black;
  /* Rendered width = 130px */
}

.box-border {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid black;
  /* Rendered width = 100px */
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-box-model",
        tags: ["box-sizing", "content-box", "border-box", "box-model"],
        commonMistakes: [
          "Forgetting to include *::before and *::after in the universal box-sizing reset.",
          "Assuming margin is included in border-box (margins are always outside the box).",
        ],
        followUps: ["Does box-sizing affect margins or outlines?"],
        interviewTips: [
          "Explain why border-box was inspired by the old IE quirk mode box model.",
        ],
      },
      {
        id: "css-box-model-2",
        question:
          "What is margin collapsing and under what conditions does it occur and how can it be prevented?",
        answer:
          "Margin collapsing is a behavior in block layout where adjacent vertical margins (top and bottom) combine into a single margin equal to the largest individual margin (or the sum if one is negative).\n\n**When it occurs:**\n1. **Adjacent Siblings**: Bottom margin of an element collides with the top margin of the next sibling.\n2. **Parent and First/Last Child**: When there is no border, padding, or inline content separating the parent's margin from its child's margin.\n3. **Empty Blocks**: An element with no height, border, or padding collapses its own top and bottom margins.\n\n**When it does NOT occur:**\n- Horizontal margins never collapse.\n- Elements with `display: flex`, `display: grid`, `position: absolute`, `position: fixed`, or `display: inline-block`.\n- Elements establishing a Block Formatting Context (BFC) like `overflow: hidden` or `display: flow-root`.\n- When padding or borders separate parent and child margins.",
        shortAnswer:
          "Margin collapsing merges adjacent vertical margins of block elements into the largest single margin. It does not happen horizontally, in flex/grid items, floating/absolute elements, or across BFC/padding/border boundaries.",
        code: `/* Sibling Collapse: total space between them is 30px, NOT 50px */
h1 { margin-bottom: 30px; }
p  { margin-top: 20px; }

/* Preventing Parent-Child Margin Collapse */
.parent-fix-1 {
  display: flow-root; /* Modern BFC creation */
}
.parent-fix-2 {
  padding-top: 1px; /* Separator */
}
.parent-fix-3 {
  display: flex;
  flex-direction: column;
}`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-box-model",
        tags: ["margin-collapsing", "bfc", "margin", "flow-root"],
        commonMistakes: [
          "Thinking margins add up (e.g. 20px + 30px = 50px).",
          "Attempting to use overflow: hidden when display: flow-root is the cleaner modern standard.",
        ],
        followUps: [
          "How do negative margins interact with positive margins during collapsing?",
        ],
        interviewTips: [
          "Mention `display: flow-root` as the clean modern standard for creating a BFC without side effects like hiding overflowing menus.",
        ],
      },
      {
        id: "css-box-model-3",
        question:
          "Describe the modern ways to horizontally and vertically center an element in CSS.",
        answer:
          "Modern CSS offers several reliable centering techniques:\n\n1. **Flexbox (Parent)**:\n```css\n.parent { display: flex; justify-content: center; align-items: center; }\n```\nOr with `margin: auto` on the flex child: `.parent { display: flex; } .child { margin: auto; }`\n\n2. **Grid (Parent)**:\n```css\n.parent { display: grid; place-items: center; }\n```\n(Short for `justify-items: center; align-items: center;`)\n\n3. **Absolute Positioning + Transform (Child)**:\n```css\n.parent { position: relative; }\n.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }\n```\n\n4. **Margin Auto with Inset (Child)**:\n```css\n.child { position: absolute; inset: 0; margin: auto; width: fit-content; height: fit-content; }\n```",
        shortAnswer:
          "1. Grid: `display: grid; place-items: center;` (cleanest single-child)\n2. Flexbox: `display: flex; justify-content: center; align-items: center;`\n3. Absolute + Transform: `top: 50%; left: 50%; transform: translate(-50%, -50%);`\n4. Flex child `margin: auto`.",
        code: `/* 1. Grid place-items (Most concise) */
.center-grid {
  display: grid;
  place-items: center;
}

/* 2. Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 3. Absolute + Transform (Works regardless of child dimensions) */
.center-abs {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-box-model",
        tags: ["centering", "flexbox", "grid", "place-items", "transform"],
        commonMistakes: [
          "Using fixed margin offsets which break when child content size changes dynamically.",
          "Forgetting position: relative on the parent container when using absolute positioning.",
        ],
        followUps: [
          "Why does margin: auto work vertically inside Flexbox but not in normal block flow?",
        ],
        interviewTips: [
          "Show `place-items: center` in CSS Grid as the modern 2-line standard.",
        ],
      },
    ],
  },

  // ─── 3. Flexbox & Grid Layouts ───────────────────────────────────────
  {
    id: "css-flexbox-grid",
    title: "Flexbox & CSS Grid Layouts",
    description:
      "Master 1D Flexbox layouts and 2D CSS Grid layouts: container vs item properties, fr units, minmax, auto-fit vs auto-fill, subgrid, alignment, and when to use Flexbox vs Grid.",
    category: "CSS",
    difficulty: "Intermediate",
    tags: [
      "flexbox",
      "grid",
      "css-grid",
      "minmax",
      "subgrid",
      "auto-fit",
      "auto-fill",
      "fr",
    ],
    overview:
      "CSS Layout has evolved from floats and tables to Flexbox (1D layouts along a main axis) and CSS Grid (2D layouts across rows and columns simultaneously). Knowing how to leverage flex-grow/shrink/basis, grid template areas, dynamic auto-fill/auto-fit responsive grids, and subgrid is essential for building modern responsive web apps.",
    concepts: [
      "Flexbox 1D layout: Main Axis vs Cross Axis",
      "Flex container: flex-direction, justify-content, align-items, align-content, flex-wrap, gap",
      "Flex items: flex-grow, flex-shrink, flex-basis, flex shorthand, order, align-self",
      "Grid 2D layout: Tracks, Cells, Areas, Lines",
      "Grid container: grid-template-columns, grid-template-rows, grid-template-areas, gap",
      "Functions and units: fr unit, repeat(), minmax(), fit-content()",
      "Responsive grids without media queries: repeat(auto-fit, minmax(250px, 1fr))",
      "auto-fill vs auto-fit differences",
      "CSS Subgrid: sharing parent grid lines with nested components",
    ],
    relatedTopicIds: ["css-box-model", "css-responsive-media-queries"],
    questions: [
      {
        id: "css-flexbox-grid-1",
        question:
          "Explain the flex shorthand property: flex: grow shrink basis. How do flex: 1, flex: auto, and flex: initial behave?",
        answer:
          "The `flex` shorthand combines `flex-grow`, `flex-shrink`, and `flex-basis` (defaulting to `0 1 auto`):\n\n1. **`flex-grow`**: Factor defining how much remaining free space in the container the item absorbs (0 = do not grow).\n2. **`flex-shrink`**: Factor defining how much the item shrinks when container space is insufficient (1 = shrink proportionally; 0 = never shrink below basis).\n3. **`flex-basis`**: Initial size of the item along the main axis before free space is distributed.\n\n**Common Presets:**\n- **`flex: 1`** (`1 1 0%`): Item grows and shrinks equally from a 0 basis, ensuring equal size distribution regardless of content length.\n- **`flex: auto`** (`1 1 auto`): Item grows and shrinks, but sizes based on its content size first.\n- **`flex: initial`** (`0 1 auto`): Default behavior. Does not grow, can shrink, basis is auto.\n- **`flex: none`** (`0 0 auto`): Fully rigid. Does not grow or shrink.",
        shortAnswer:
          "flex: [grow] [shrink] [basis]. flex: 1 (1 1 0%) shares space equally; flex: auto (1 1 auto) sizes based on content first; flex: initial (0 1 auto) shrinks but does not grow; flex: none (0 0 auto) is rigid.",
        code: `/* Equal width columns */
.col { flex: 1; }

/* Fixed sidebar + fluid main content */
.sidebar { flex: 0 0 260px; }
.main    { flex: 1; }

/* Never shrink badge */
.badge   { flex-shrink: 0; }`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-flexbox-grid",
        tags: ["flex", "flex-grow", "flex-shrink", "flex-basis", "flexbox"],
        commonMistakes: [
          "Setting flex: 1 and expecting items to maintain their content size (use flex: auto or min-width).",
          "Text overflowing in a flex child because default min-width is auto (fix: min-width: 0 on flex child).",
        ],
        followUps: [
          "Why is min-width: 0 needed on flex children with text truncation?",
        ],
        interviewTips: [
          "Mention the `min-width: 0` fix for flex truncation — interviewers love this bug/solution!",
        ],
      },
      {
        id: "css-flexbox-grid-2",
        question:
          "How do you create an intrinsically responsive grid without media queries using repeat(auto-fit, minmax(250px, 1fr))? What is the difference between auto-fit and auto-fill?",
        answer:
          "The pattern `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` creates a fully responsive column layout that automatically wraps and stretches without a single media query:\n- `minmax(250px, 1fr)`: Each column must be at least 250px wide, but expands to fill available space (`1fr`).\n- `repeat(auto-fit/auto-fill, ...)`: Automatically calculates how many 250px columns fit across the container width.\n\n**Difference between auto-fill and auto-fit:**\n- **`auto-fill`**: Fills the row with as many columns as possible, creating empty invisible column tracks if there aren't enough items to fill the row.\n- **`auto-fit`**: Drops empty column tracks and stretches the existing items across the full row width.",
        shortAnswer:
          "repeat(auto-fit, minmax(250px, 1fr)) wraps columns dynamically. auto-fill preserves empty tracks if items are few; auto-fit collapses empty tracks so existing items expand to fill the full container width.",
        code: `/* Responsive card grid - no media queries needed! */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* With 1 card: auto-fit expands card to 100% width.
   auto-fill keeps card at 280px and leaves empty space. */`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-flexbox-grid",
        tags: ["grid", "auto-fit", "auto-fill", "minmax", "responsive"],
        commonMistakes: [
          "Using auto-fill when auto-fit was desired, leaving empty awkward gaps when only 1 or 2 items exist.",
          "Using 100% instead of 1fr in minmax().",
        ],
        followUps: [
          "How does CSS Subgrid allow nested cards to align headers and footers across rows?",
        ],
        interviewTips: [
          "Highlight that auto-fit + minmax replaces dozens of breakpoint media queries.",
        ],
      },
      {
        id: "css-flexbox-grid-3",
        question: "When should you choose Flexbox versus CSS Grid?",
        answer:
          "**Choose Flexbox when:**\n- Layout is **one-dimensional** (either a row OR a column, but not both aligned together).\n- Sizing is content-driven (e.g. navigation bar links, button groups, badge lists, tags).\n- Aligning items along a single axis (e.g. centering an icon and text together).\n\n**Choose CSS Grid when:**\n- Layout is **two-dimensional** (aligning items in both rows AND columns simultaneously).\n- Layout is container-driven (e.g. dashboard cards, page shells, photo galleries, data tables).\n- Layering items directly on top of each other in the same grid area without absolute positioning.\n- Needing CSS Subgrid for multi-card internal alignment (e.g. aligning card titles, descriptions, and action buttons across rows).",
        shortAnswer:
          "Flexbox is for 1D content-driven flow (navbars, toolbars, icon groups); CSS Grid is for 2D container-driven layouts (page layouts, dashboards, galleries, overlapping areas).",
        code: `/* 1D Nav bar -> Flexbox */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 2D App Layout -> Grid */
.app-layout {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: 260px 1fr;
  grid-template-rows: 60px 1fr 40px;
  height: 100vh;
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-flexbox-grid",
        tags: ["flexbox", "grid", "architecture", "layout-comparison"],
        commonMistakes: [
          "Using complex flex wrapping with fixed percentages to simulate a 2D grid instead of using CSS Grid.",
          "Overcomplicating simple 1D toolbars with CSS Grid.",
        ],
        followUps: [
          "Can Flexbox and Grid be composed together? Give an example.",
        ],
        interviewTips: [
          'Mention: "Flexbox from the content out, Grid from the layout in".',
        ],
      },
    ],
  },

  // ─── 4. Positioning, Stacking Context & z-index ──────────────────────
  {
    id: "css-positioning-stacking",
    title: "Positioning, Stacking Context & z-index",
    description:
      "Detailed coverage of static, relative, absolute, fixed, sticky positioning, containing blocks, stacking context creation, z-index calculation, and overflow handling.",
    category: "CSS",
    difficulty: "Intermediate",
    tags: ["positioning", "stacking-context", "z-index", "sticky", "overflow"],
    overview:
      "CSS positioning controls how elements are removed from or shifted within the normal document flow. Understanding containing blocks, sticky thresholds, how new Stacking Contexts are formed (via opacity, transform, filter, will-change, isolation: isolate), and how z-index operates within local stacking contexts prevents ubiquitous z-index bugs.",
    concepts: [
      "Position types: static (default), relative, absolute, fixed, sticky",
      "Containing block resolution for absolute and fixed elements",
      "Position sticky requirements (parent overflow, scroll ancestor, top/bottom threshold)",
      "Stacking Context: what it is and why z-index: 99999 fails",
      "Triggers that create a Stacking Context (transform, opacity < 1, filter, isolation: isolate, will-change)",
      "Modern `isolation: isolate` property",
      "Overflow values: visible, hidden, scroll, auto, clip",
    ],
    relatedTopicIds: ["css-box-model", "css-selectors"],
    questions: [
      {
        id: "css-pos-1",
        question:
          "Explain how position: static, relative, absolute, fixed, and sticky differ in document flow and containing block.",
        answer:
          "1. **`static` (Default)**: Normal document flow. `top`, `right`, `bottom`, `left`, and `z-index` have no effect.\n2. **`relative`**: Remains in the normal document flow (its original space is preserved). Offsets (`top`, `left`) shift the visual rendering relative to where it would normally be without affecting neighboring elements. Forms containing block for absolute children.\n3. **`absolute`**: Removed from the normal document flow (leaves no space). Positioned relative to its **nearest positioned ancestor** (an ancestor with position != static). If none exists, positioned relative to the initial containing block (viewport).\n4. **`fixed`**: Removed from flow. Positioned relative to the **viewport** (unless an ancestor has `transform`, `filter`, or `perspective` set, which acts as containing block).\n5. **`sticky`**: Hybrid. Behaves as `relative` until the scroll position crosses a specified threshold (e.g. `top: 0`), after which it behaves as `fixed` within the bounds of its parent container.",
        shortAnswer:
          "static: normal flow; relative: offset from self, keeps space; absolute: removed from flow, relative to nearest positioned ancestor; fixed: removed from flow, relative to viewport; sticky: toggles between relative and fixed within its parent.",
        code: `/* Sticky header */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

/* Absolute modal overlay */
.overlay {
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-positioning-stacking",
        tags: ["position", "relative", "absolute", "fixed", "sticky"],
        commonMistakes: [
          "Wondering why position: sticky fails when an ancestor has overflow: hidden (overflow on any ancestor breaks sticky scrolling).",
          "Not realizing an ancestor with `transform` traps `position: fixed` elements.",
        ],
        followUps: ["What causes position: sticky to stop sticking?"],
        interviewTips: [
          "Mention `inset: 0` as the modern shorthand for `top: 0; right: 0; bottom: 0; left: 0`.",
        ],
      },
      {
        id: "css-pos-2",
        question:
          "What is a Stacking Context, how is it created, and why does setting z-index: 999999 sometimes fail to bring an element to the front?",
        answer:
          "A **Stacking Context** is a three-dimensional conceptual layer in the browser along the z-axis. Elements within a stacking context are rendered relative to each other. Crucially, child stacking contexts are **flattened** into their parent stacking context — a child with `z-index: 999999` inside a parent with `z-index: 1` can NEVER appear above a sibling container that has `z-index: 2`.\n\n**Common Triggers that Create a Stacking Context:**\n1. Root element (`<html>`).\n2. Positioned element (`relative`, `absolute`, `fixed`, `sticky`) with `z-index` other than `auto`.\n3. Element with `opacity < 1`.\n4. Element with `transform`, `filter`, `perspective`, `clip-path`, or `backdrop-filter` other than `none`.\n5. Element with `will-change` specifying any stacking context trigger property.\n6. Element with `isolation: isolate` (the explicit, cleanest modern way to establish a new stacking context).\n7. Flex/Grid child with `z-index` other than `auto`.",
        shortAnswer:
          "A stacking context scopes z-index locally. An element with z-index: 999999 inside a parent with z-index: 1 will always be behind a sibling with z-index: 2 because the parent stacking context limits the child. Use isolation: isolate to contain z-indexes cleanly.",
        code: `/* z-index trap example */
.parent-A {
  position: relative;
  z-index: 1; /* Caps all children to level 1 */
}
.child-A {
  position: absolute;
  z-index: 999999; /* Still behind .parent-B! */
}

.parent-B {
  position: relative;
  z-index: 2; /* Wins over parent-A and all its children */
}

/* Clean fix with isolation: isolate */
.component-root {
  isolation: isolate; /* Creates isolated local stacking context */
}`,
        language: "css",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-positioning-stacking",
        tags: ["stacking-context", "z-index", "isolation", "transform"],
        commonMistakes: [
          "Increasing z-index to arbitrary numbers (z-index: 9999999) instead of inspecting the stacking context hierarchy.",
          "Not knowing that CSS transforms or opacity create new stacking contexts that trap z-indexes.",
        ],
        followUps: [
          "How does isolation: isolate solve component z-index leakage in design systems?",
        ],
        interviewTips: [
          "Explaining the flattening of child stacking contexts immediately signals senior-level CSS mastery.",
        ],
      },
    ],
  },

  // ─── 5. Specificity, Cascade & Inheritance ───────────────────────────
  {
    id: "css-specificity-cascade",
    title: "Specificity, Cascade & Inheritance",
    description:
      "Understanding the CSS cascade algorithm, specificity calculation tuples (inline, ID, class, element), !important, CSS Cascade Layers (@layer), and property inheritance.",
    category: "CSS",
    difficulty: "Intermediate",
    tags: [
      "specificity",
      "cascade",
      "inheritance",
      "cascade-layers",
      "important",
    ],
    overview:
      'The "C" in CSS stands for Cascade. When multiple rules target the same element and property, the Cascade determines which declaration wins based on Origin & Importance, Cascade Layers (@layer), Specificity, and Source Order. Understanding these four steps eliminates specificity wars.',
    concepts: [
      "Cascade Algorithm order: Origin & Importance -> Layers -> Specificity -> Order of Appearance",
      "Specificity 3-tuple / 4-tuple calculation: (Inline, ID, Class/Attr/Pseudo-class, Element/Pseudo-element)",
      "The power and danger of !important",
      "CSS Cascade Layers (`@layer`) for managing resets, frameworks, and component styles",
      "Inheritance: Inherited properties (color, font) vs Non-inherited properties (margin, padding, border)",
      "Explicit inheritance keywords: inherit, initial, unset, revert",
    ],
    relatedTopicIds: ["css-selectors", "css-variables-preprocessors"],
    questions: [
      {
        id: "css-spec-1",
        question:
          "How is CSS Specificity calculated? Rank the specificity of various selector combinations.",
        answer:
          'CSS Specificity is calculated as a 3-part tuple `(A, B, C)` (or 4-part if counting inline styles `(Inline, ID, Class, Element)`):\n\n1. **Inline styles**: `style="..."` attribute (highest priority outside `!important`).\n2. **A (ID Selectors)**: `#header` (adds 1 to A).\n3. **B (Class, Attribute, Pseudo-class)**: `.btn`, `[type="text"]`, `:hover`, `:nth-child()`, `:is()` (highest in list) (adds 1 to B).\n4. **C (Type / Element, Pseudo-element)**: `div`, `p`, `::before`, `::after` (adds 1 to C).\n\nUniversal selector (`*`), combinators (`+`, `>`, `~`, space), and `:where()` add **(0, 0, 0)**.\n\n**Comparison Rule:** Specificity is compared from left to right. One ID (1, 0, 0) beats any number of classes (0, 99, 0). If specificity is identical, the **last declaration in source order** wins.',
        shortAnswer:
          "Specificity is (Inline, ID, Class/Attr/Pseudo-class, Element). Compared left-to-right: an ID (1,0,0) beats 100 classes (0,100,0). Ties are broken by the last rule in source order.",
        code: `/* Specificity rankings (low to high): */
*                  /* (0, 0, 0) */
p                  /* (0, 0, 1) */
div p              /* (0, 0, 2) */
.card p            /* (0, 1, 1) */
.card .title       /* (0, 2, 0) */
#main .title       /* (1, 1, 0) */
#main #header      /* (2, 0, 0) */
style="color: red" /* Inline */
color: red !important; /* Overrides everything */`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-specificity-cascade",
        tags: ["specificity", "cascade", "selectors", "important"],
        commonMistakes: [
          "Thinking specificity is a base-10 number (e.g. thinking 10 classes equal 1 ID). They are independent columns.",
          "Using !important to solve specificity issues instead of flattening selector structure.",
        ],
        followUps: ["How does :where() allow zero-specificity selectors?"],
        interviewTips: [
          "Write out the (0, 1, 1) tuple notation clearly during interviews to show precise understanding.",
        ],
      },
      {
        id: "css-spec-2",
        question:
          "What are CSS Cascade Layers (@layer) and how do they solve specificity wars in large applications?",
        answer:
          "**CSS Cascade Layers (`@layer`)** introduce explicit hierarchy control in the CSS Cascade, evaluated **before** selector specificity.\n\nRules in a higher-priority layer always override rules in a lower-priority layer, **regardless of selector specificity** inside those layers. For example, a single class selector `.btn` in the `components` layer will defeat `#nav-button#primary` in the `reset` layer.\n\n**Layer Declaration:**\n```css\n@layer reset, framework, components, utilities;\n```\nLayers declared later have higher priority. Normal un-layered CSS has higher priority than layered CSS.\n\nThis solves the fundamental problem of third-party libraries (e.g. Bootstrap or Tailwind) using high specificity that application developers struggled to override.",
        shortAnswer:
          "@layer lets you define explicit priority orders for stylesheets. A higher layer always wins over a lower layer regardless of selector specificity, eliminating specificity wars between resets, design systems, and components.",
        code: `/* 1. Define layer priority (last has highest priority) */
@layer reset, base, components, overrides;

@layer reset {
  /* High specificity ID selector */
  #main a { color: black; }
}

@layer components {
  /* Low specificity class selector WINS because 'components' > 'reset' */
  .link { color: blue; }
}`,
        language: "css",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-specificity-cascade",
        tags: ["layer", "cascade-layers", "specificity", "architecture"],
        commonMistakes: [
          "Not knowing that unlayered styles have higher priority than any @layer styles.",
          "Not knowing that !important inverses layer priority (lower layers with !important beat higher layers with !important).",
        ],
        followUps: ["How does !important interact with @layer priority order?"],
        interviewTips: [
          "Mention that @layer is now supported across all modern evergreen browsers (Chrome, Safari, Firefox, Edge).",
        ],
      },
    ],
  },

  // ─── 6. CSS Variables, BEM & Preprocessors ───────────────────────────
  {
    id: "css-variables-preprocessors",
    title: "CSS Variables, BEM & Preprocessors (SCSS/LESS)",
    description:
      "Custom Properties (CSS variables), dynamic theming, BEM methodology, and comparison with preprocessors (SASS/SCSS, LESS, Mixins, Nesting).",
    category: "CSS",
    difficulty: "Intermediate",
    tags: [
      "css-variables",
      "custom-properties",
      "bem",
      "scss",
      "sass",
      "mixins",
      "theming",
    ],
    overview:
      "CSS Custom Properties (Variables) provide dynamic, cascading, runtime-accessible values in pure CSS. Combined with methodologies like BEM (Block Element Modifier) and tools like SASS/SCSS mixins and modern native CSS Nesting, developers can construct scalable design systems and dark mode theming.",
    concepts: [
      "CSS Custom Properties: syntax (`--var-name`), access (`var(--var-name, fallback)`)",
      "Scoping and inheritance of custom properties",
      "Dynamic theming: Dark mode with CSS variables + prefers-color-scheme",
      "Accessing and mutating CSS variables via JavaScript (`style.setProperty`)",
      "BEM Methodology: Block, Element (__), Modifier (--)",
      "SCSS vs LESS: Mixins, Functions, Loops, Nesting, @extend vs @include",
      "Native CSS Nesting vs SCSS Nesting",
    ],
    relatedTopicIds: ["css-selectors", "css-responsive-media-queries"],
    questions: [
      {
        id: "css-var-1",
        question:
          "How do CSS Custom Properties (CSS Variables) differ from SASS/SCSS variables, and how do you implement dynamic dark mode with them?",
        answer:
          "**Key Differences:**\n1. **Runtime vs Build-time**: SCSS variables (`$primary: blue;`) are resolved at build time and compiled to static values. CSS Custom Properties (`--primary: blue;`) exist at runtime in the browser DOM.\n2. **Cascading & Inheritance**: CSS variables cascade and can be scoped to specific elements or media queries. Changing `--bg` under `[data-theme=\"dark\"]` updates all child components automatically.\n3. **JavaScript Interoperability**: JavaScript can read and modify CSS variables in real time using `element.style.setProperty('--accent', color)` and `getComputedStyle(element).getPropertyValue('--accent')`.\n\n**Dark Mode Implementation:**\nDefine theme tokens in `:root` and override them in `[data-theme=\"dark\"]` or `@media (prefers-color-scheme: dark)`.",
        shortAnswer:
          "CSS Variables are dynamic, cascade, can be updated via JavaScript at runtime, and respect media queries. SCSS variables are static compile-time constants. CSS variables are ideal for runtime theming.",
        code: `/* Design Tokens */
:root {
  --color-bg: #ffffff;
  --color-text: #1e293b;
  --color-primary: #4f46e5;
}

/* Dark Mode Override */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-text: #f8fafc;
    --color-primary: #818cf8;
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* JavaScript Dynamic Theme Toggle */
// document.documentElement.setAttribute('data-theme', 'dark');
// document.documentElement.style.setProperty('--color-primary', '#10b981');`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-variables-preprocessors",
        tags: [
          "css-variables",
          "custom-properties",
          "dark-mode",
          "theming",
          "sass",
        ],
        commonMistakes: [
          "Using SASS variables for dark mode, which requires duplicating all CSS rules for dark selectors.",
          "Forgetting fallback values: `var(--font-size, 16px)`.",
        ],
        followUps: [
          "How does @property register custom properties with type checking and default animation values?",
        ],
        interviewTips: [
          "Explain how CSS variables allow seamless dark mode toggle with zero layout recalculation.",
        ],
      },
      {
        id: "css-var-2",
        question:
          "Explain the BEM (Block, Element, Modifier) naming convention and its architectural benefits.",
        answer:
          "**BEM (Block, Element, Modifier)** is a CSS naming convention that creates modular, reusable components with flat specificity:\n\n1. **Block**: Standalone component with meaning on its own (`.card`, `.btn`, `.navbar`).\n2. **Element (`__`)**: Part of a block that has no standalone meaning and is semantically tied to its block (`.card__title`, `.card__image`, `.btn__icon`).\n3. **Modifier (`--`)**: Flag on a block or element that changes its appearance or state (`.card--featured`, `.btn--primary`, `.btn--disabled`).\n\n**Benefits:**\n- **Flat Specificity**: All selectors are single class names `(0, 1, 0)`, preventing specificity wars.\n- **Self-Documenting**: Reading the class name clearly indicates component hierarchy and relationships.\n- **Encapsulation**: Eliminates accidental cascade overrides from nested tags.",
        shortAnswer:
          "BEM divides UI into Block, Element (__), and Modifier (--). It maintains flat specificity (0,1,0), makes relationships self-documenting, and prevents selector collision.",
        code: `/* BEM Structure */
.card { /* Block */
  border-radius: 8px;
  padding: 16px;
}

.card__header { /* Element */
  font-size: 1.25rem;
}

.card__button { /* Element */
  padding: 8px 16px;
}

.card__button--primary { /* Modifier on Element */
  background: #4f46e5;
  color: white;
}

.card--dark { /* Modifier on Block */
  background: #1e293b;
  color: white;
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-variables-preprocessors",
        tags: ["bem", "methodology", "naming-conventions", "architecture"],
        commonMistakes: [
          "Creating grand-child selectors like `.card__header__title` (elements should not be nested in BEM names; use `.card__title`).",
          'Using modifiers without their base block (`<div class="btn--primary">` instead of `<div class="btn btn--primary">`).',
        ],
        followUps: ["How does CSS Modules or Tailwind CSS compare to BEM?"],
        interviewTips: [
          "Emphasize that BEM keeps specificity at (0, 1, 0) across entire enterprise codebases.",
        ],
      },
    ],
  },

  // ─── 7. Media Queries, Container Queries & Responsive Design ─────────
  {
    id: "css-responsive-media-queries",
    title: "Responsive Design: Media & Container Queries",
    description:
      "Mobile-first responsive design, modern range syntax media queries, preference queries (dark mode, reduced motion), and Container Queries (@container, cqw, cqh).",
    category: "CSS",
    difficulty: "Intermediate",
    tags: [
      "media-queries",
      "container-queries",
      "responsive-design",
      "prefers-reduced-motion",
      "mobile-first",
    ],
    overview:
      "Responsive design ensures websites adapt seamlessly across mobile phones, tablets, desktops, and foldable screens. Modern responsive design combines mobile-first media queries with Container Queries (@container), which style components based on their parent container's size rather than the global viewport.",
    concepts: [
      "Mobile-first (`min-width`) vs Desktop-first (`max-width`) responsive strategies",
      "Modern Media Query Range syntax (`@media (320px <= width <= 768px)`)",
      "User preference queries: `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`",
      "Container Queries (`@container`): why viewport media queries are inadequate for modular components",
      "Declaring a container: `container-type: inline-size; container-name: card;`",
      "Container query units: `cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`",
    ],
    relatedTopicIds: ["css-flexbox-grid", "css-variables-preprocessors"],
    questions: [
      {
        id: "css-resp-1",
        question:
          "What are CSS Container Queries (@container) and how do they solve the limitations of Viewport Media Queries (@media)?",
        answer:
          "**The Limitation of `@media`:**\nViewport media queries check the size of the **browser window**. However, in modern modular component architectures, a `<Card>` component might be rendered in a full-width main area (wide) OR in a narrow 300px sidebar on the exact same desktop screen. Viewport media queries cannot know the component's context.\n\n**The Solution: `@container`**:\nContainer Queries style an element based on the **width/height of its parent container**:\n1. Declare a parent container: `container-type: inline-size;`\n2. Query the container in child styles: `@container (min-width: 400px) { ... }`\n\nNow the component automatically displays its horizontal layout when placed in a wide container, and switches to a stacked vertical layout when placed in a narrow sidebar or mobile drawer, regardless of viewport size.",
        shortAnswer:
          "Viewport media queries (@media) only check screen width. Container Queries (@container) check the parent container's size, allowing components to adapt based on where they are placed (e.g. main area vs sidebar).",
        code: `/* 1. Define container context on parent */
.card-container {
  container-type: inline-size;
  container-name: card-wrapper;
}

/* 2. Style child based on container width */
.card {
  display: flex;
  flex-direction: column;
}

@container card-wrapper (min-width: 450px) {
  .card {
    flex-direction: row; /* Horizontal layout when container is wide */
  }
  .card__image {
    width: 180px;
  }
}`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-responsive-media-queries",
        tags: ["container-queries", "media-queries", "responsive", "cqw"],
        commonMistakes: [
          "Forgetting `container-type: inline-size` on the parent container element.",
          "Using container query on the container element itself instead of its children.",
        ],
        followUps: [
          "What are container query units (cqw, cqi) and how can they be used for fluid typography?",
        ],
        interviewTips: [
          "Container queries represent the biggest paradigm shift in responsive CSS since Flexbox and Grid.",
        ],
      },
      {
        id: "css-resp-2",
        question:
          "How do accessibility media queries like prefers-reduced-motion enhance user experience?",
        answer:
          "`@media (prefers-reduced-motion: reduce)` detects whether the user has requested the operating system to minimize non-essential animations and motion effects (critical for users with vestibular motion disorders or motion sickness).\n\n**Best Practice Implementation:**\nWrap non-essential animations in a preference check, or disable animations globally for users requesting reduced motion:\n```css\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n```",
        shortAnswer:
          "prefers-reduced-motion respects OS accessibility settings for users with vestibular disorders. Disabling or simplifying rapid animations and parallax prevents dizziness and motion sickness.",
        code: `/* Respecting reduced motion */
.banner {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .banner {
    transition: none; /* Disable animation */
  }
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-responsive-media-queries",
        tags: ["accessibility", "prefers-reduced-motion", "animation", "a11y"],
        commonMistakes: [
          "Completely removing visual feedback instead of replacing intense motion with subtle opacity fades.",
        ],
        followUps: [
          "What other preference media queries exist (e.g. prefers-contrast, forced-colors)?",
        ],
        interviewTips: [
          "Mentioning prefers-reduced-motion demonstrates deep accessibility and frontend empathy.",
        ],
      },
    ],
  },

  // ─── 8. Animations, Transitions & Performance ────────────────────────
  {
    id: "css-animations-transitions",
    title: "CSS Animations, Transitions & GPU Acceleration",
    description:
      "Transitions, @keyframes animations, timing functions (cubic-bezier), will-change, composite layers, and GPU hardware acceleration.",
    category: "CSS",
    difficulty: "Intermediate",
    tags: [
      "animations",
      "transitions",
      "keyframes",
      "gpu-acceleration",
      "will-change",
      "performance",
    ],
    overview:
      "CSS animations and transitions bring interfaces to life. Understanding the browser rendering pipeline (Layout -> Paint -> Composite) ensures animations run smoothly at 60fps/120fps by targeting GPU-accelerated properties (`transform` and `opacity`) rather than triggering expensive layout reflows (like `top`, `left`, `width`, `height`).",
    concepts: [
      "Transitions: property, duration, timing-function (ease, linear, cubic-bezier), delay",
      "@keyframes animation syntax: duration, timing-function, delay, iteration-count, direction, fill-mode",
      "animation-fill-mode: none, forwards, backwards, both",
      "The 3 stages of rendering: Layout (Reflow) -> Paint (Repaint) -> Composite",
      "GPU accelerated properties: `transform` (translate, scale, rotate) and `opacity`",
      "Promoting layers: `will-change: transform` and `transform: translateZ(0)`",
      "Avoid animating layout properties: `top`, `left`, `height`, `width`, `margin`",
    ],
    relatedTopicIds: ["css-selectors", "css-positioning-stacking"],
    questions: [
      {
        id: "css-anim-1",
        question:
          "Explain the browser rendering pipeline (Layout, Paint, Composite) and why animating transform and opacity is vastly more performant than animating top, left, or height.",
        answer:
          "When the browser renders or updates styles, it executes three phases:\n1. **Layout (Reflow)**: Calculates geometric positions and sizes for all elements. Animating properties like `top`, `left`, `width`, `height`, `margin`, or `padding` forces the browser to recalculate layout for the element and potentially the entire document tree.\n2. **Paint (Repaint)**: Fills pixels for colors, text, borders, shadows. Animating `background-color`, `color`, or `box-shadow` skips Layout but still triggers Paint on the CPU.\n3. **Composite (GPU Acceleration)**: Draws painted layers onto the screen. **`transform`** and **`opacity`** are handled directly on the GPU compositor thread without triggering Layout or Paint recalculations.\n\nAnimating `transform: translate(x, y)` runs at a silky 60/120 FPS on a dedicated thread, even if the main JavaScript thread is busy.",
        shortAnswer:
          "Layout (reflow) calculates geometry; Paint fills pixels; Composite puts layers on screen. `transform` and `opacity` execute directly on the GPU Compositor thread without triggering expensive Layout or Paint reflows.",
        code: `/* \u274C Bad Performance: Triggers Layout & Paint on every frame */
.drawer-bad {
  position: absolute;
  left: -300px;
  transition: left 0.3s ease;
}
.drawer-bad.open {
  left: 0;
}

/* \u2705 High Performance: Composited on GPU */
.drawer-good {
  position: absolute;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.drawer-good.open {
  transform: translateX(0);
}`,
        language: "css",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-animations-transitions",
        tags: [
          "performance",
          "gpu",
          "transform",
          "reflow",
          "repaint",
          "composite",
        ],
        commonMistakes: [
          "Overusing `will-change: transform` on hundreds of elements, consuming excessive GPU memory.",
          "Animating max-height for accordion expansion (causes continuous layout reflows; use CSS Grid `grid-template-rows: 0fr -> 1fr` instead).",
        ],
        followUps: [
          "How can CSS Grid animate accordion expansion smoothly without JavaScript?",
        ],
        interviewTips: [
          "Show how `grid-template-rows: 0fr` to `1fr` animates height without fixed pixel assumptions.",
        ],
      },
      {
        id: "css-anim-2",
        question:
          "What does animation-fill-mode: forwards and backwards do in CSS @keyframes animations?",
        answer:
          "`animation-fill-mode` defines how styles are applied to an element before the animation starts (during `animation-delay`) and after it finishes:\n\n1. **`none` (Default)**: The animation has no effect before starting or after completing (element snaps back to its base style).\n2. **`forwards`**: The element **retains the computed values set by the last keyframe** (100% or `to`) after the animation finishes.\n3. **`backwards`**: The element **applies the values of the first keyframe** (0% or `from`) immediately during the `animation-delay` period before the animation starts.\n4. **`both`**: Applies both `backwards` (during delay) and `forwards` (after completion).",
        shortAnswer:
          "forwards keeps the styles of the last keyframe when animation ends; backwards applies the first keyframe styles during the animation delay; both applies both rules.",
        code: `@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInSlide 0.5s ease 0.2s both;
  /* 0.2s delay applies 0% styles immediately, and stays at 100% when done */
}`,
        language: "css",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "CSS",
        topicId: "css-animations-transitions",
        tags: ["keyframes", "animation-fill-mode", "forwards", "backwards"],
        commonMistakes: [
          "Omitting `forwards` on entrance animations, causing the element to flash and snap back to its unstyled initial state after the animation finishes.",
        ],
        followUps: [
          "How does Web Animations API (WAAPI) in JavaScript compare to CSS Keyframes?",
        ],
        interviewTips: [
          "Recommend using `animation-fill-mode: both` for delayed entrance animations to avoid visual flashes.",
        ],
      },
    ],
  },
];
