import type { Topic } from "../../types";

export const browserTopics: Topic[] = [
  {
    id: "browser-rendering-1",
    title: "Page Rendering Cycle",
    description:
      "Understand how the browser transforms raw HTML, CSS, and JavaScript into the pixels you see on screen, including the critical rendering path, reflow, paint, and compositing layers.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: [
      "browser",
      "rendering",
      "dom",
      "performance",
      "critical-rendering-path",
    ],
    overview:
      "The page rendering cycle is the sequence of steps the browser follows to turn HTML, CSS, and JavaScript into a fully rendered page. Understanding this pipeline is essential for diagnosing performance bottlenecks and writing efficient front-end code.",
    concepts: [
      "HTML parsing and DOM construction",
      "CSSOM construction",
      "Render tree building",
      "Layout (reflow)",
      "Paint",
      "Composite layers",
      "Critical rendering path",
      "JavaScript blocking behavior",
    ],
    relatedTopicIds: [
      "browser-web-vitals-1",
      "browser-devtools-1",
      "browser-debugging-1",
    ],
    codeExamples: [
      {
        title: "Deferring JavaScript to avoid blocking parsing",
        code: '<!-- Blocks parsing until script downloads and executes -->\n<script src="app.js"></script>\n\n<!-- Downloads in parallel, executes after HTML is fully parsed -->\n<script defer src="app.js"></script>\n\n<!-- Downloads in parallel, executes as soon as ready (order not guaranteed) -->\n<script async src="analytics.js"></script>',
        language: "html",
        explanation:
          "The defer attribute lets the parser continue building the DOM while the script downloads, then executes scripts in order after parsing completes. async downloads in parallel but executes immediately, potentially interrupting parsing.",
      },
      {
        title: "Triggering and avoiding forced reflow",
        code: 'const elements = document.querySelectorAll(".card");\n\n// BAD: read-write cycle inside a loop causes layout thrashing\nelements.forEach((el) => {\n  const height = el.offsetHeight; // read -> forces layout\n  el.style.height = height + 10 + "px"; // write -> invalidates layout\n});\n\n// GOOD: batch reads, then batch writes\nconst heights = Array.from(elements).map((el) => el.offsetHeight);\nelements.forEach((el, i) => {\n  el.style.height = heights[i] + 10 + "px";\n});',
        language: "javascript",
        explanation:
          "Layout thrashing occurs when you interleave DOM reads and writes inside a loop, forcing the browser to recalculate layout on every read. Batching reads before writes avoids this.",
      },
      {
        title: "Using will-change for compositing hints",
        code: ".animated-card {\n  will-change: transform, opacity;\n  transition: transform 0.3s ease;\n}\n\n.animated-card:hover {\n  transform: translateY(-4px);\n}",
        language: "css",
        explanation:
          "The will-change property tells the browser to promote the element to its own compositor layer ahead of time, so the animation runs on the GPU without triggering layout or paint.",
      },
    ],
    questions: [
      {
        id: "browser-rendering-q1",
        question:
          "Explain the critical rendering path from HTML to pixels on screen.",
        answer:
          "The critical rendering path is the sequence of steps the browser must complete before it can render the first pixel of a page. It begins when the browser receives the HTML response from the server and ends when the composited frame is displayed on screen.\n\nFirst, the browser parses the HTML byte stream and constructs the Document Object Model (DOM), a tree structure representing every element and its relationships. As the parser encounters CSS links or inline styles, it fetches and parses them into the CSS Object Model (CSSOM), another tree that describes the styling rules. Both trees must be built before rendering can proceed, making CSS a render-blocking resource by default.\n\nOnce both the DOM and CSSOM are ready, the browser merges them into a render tree. The render tree contains only visible elements with their computed styles — elements with display:none are excluded, while elements with visibility:hidden remain because they still occupy layout space. Next comes the layout phase (also called reflow), where the browser calculates the exact position and dimensions of every node in the render tree based on the viewport size and box-model rules.\n\nAfter layout, the paint phase records the drawing instructions for each element — colors, borders, shadows, text — into a list of paint records. The browser may split the page into multiple compositor layers (e.g., for elements with will-change or transform) and paint each layer independently. Finally, the compositing step combines these layers in the correct stacking order and sends the result to the GPU for display.\n\nOptimizing the critical rendering path means reducing the number of critical resources, minimizing critical bytes, and shortening the critical path length. Techniques include inlining critical CSS, deferring non-essential JavaScript, preloading key resources, and minimizing render-blocking requests.",
        shortAnswer:
          "The critical rendering path is the sequence: parse HTML into the DOM, parse CSS into the CSSOM, merge both into a render tree, calculate layout (reflow), paint pixels, and composite layers. CSS blocks rendering; synchronous JavaScript blocks HTML parsing. Optimizing this path reduces time-to-first-paint.",
        code: '<!-- Optimized critical rendering path -->\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <!-- Inline critical CSS to eliminate render-blocking request -->\n  <style>\n    body { font-family: sans-serif; margin: 0; }\n    .hero { background: #0a0a0a; color: #fff; padding: 2rem; }\n  </style>\n  <!-- Preload important resources -->\n  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />\n  <!-- Non-critical CSS loaded asynchronously -->\n  <link rel="preload" href="/styles/main.css" as="style" onload="this.rel=\'stylesheet\'" />\n</head>\n<body>\n  <section class="hero"><h1>Hello World</h1></section>\n  <!-- Defer non-critical JS -->\n  <script defer src="/js/app.js"></script>\n</body>\n</html>',
        language: "html",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["critical-rendering-path", "dom", "cssom", "layout", "paint"],
        commonMistakes: [
          "Forgetting that CSS is render-blocking — the browser will not paint until the CSSOM is fully constructed.",
          "Confusing the DOM with the render tree — elements with display:none exist in the DOM but not in the render tree.",
          "Ignoring the compositing phase and assuming all animations trigger layout + paint.",
        ],
        followUps: [
          "How can you measure the critical rendering path performance?",
          "What is the difference between async and defer on script tags?",
          "How do preload, prefetch, and preconnect differ?",
        ],
        interviewTips: [
          "Walk through the five steps in order: DOM, CSSOM, Render Tree, Layout, Paint + Composite.",
          "Mention that CSS is render-blocking and synchronous JS is parser-blocking to show you understand the bottleneck points.",
        ],
        relatedTopics: ["web vitals", "performance optimization", "DOM"],
      },
      {
        id: "browser-rendering-q2",
        question: "What is the difference between reflow (layout) and repaint?",
        answer:
          "Reflow and repaint are two distinct phases of the browser rendering pipeline that get triggered when the DOM or styles change after the initial render. Understanding when each occurs is key to writing performant UI code.\n\nA reflow (also called layout) occurs when a change affects the geometry of one or more elements — their size, position, or visibility in terms of layout impact. When a reflow is triggered, the browser must recalculate the position and dimensions of affected elements and potentially all their descendants and siblings. Examples of reflow triggers include changing width, height, padding, margin, font-size, adding or removing DOM elements, resizing the window, or reading certain layout properties like offsetHeight or getBoundingClientRect() when the layout is dirty.\n\nA repaint occurs when a change affects the visual appearance of an element without altering its geometry. Changing color, background-color, box-shadow, visibility, or outline causes a repaint but not a reflow. The browser skips the layout step and goes straight to painting the affected pixels. Repaints are cheaper than reflows but still have a cost, especially for large elements or complex visual effects.\n\nEvery reflow triggers a subsequent repaint because recalculating geometry means the affected area needs to be redrawn. The reverse is not true — a repaint does not cause a reflow. The most expensive scenario is layout thrashing, where JavaScript reads a layout property, writes a style change, reads again, and writes again in a tight loop, forcing the browser to perform synchronous reflows on every read.\n\nChanges that only affect composite properties like transform and opacity bypass both reflow and repaint entirely. These changes are handled directly by the compositor on the GPU, making them the cheapest type of visual update. This is why CSS animations using transform and opacity are significantly smoother than animations that change top, left, width, or height.",
        shortAnswer:
          "Reflow recalculates the geometry (size and position) of elements and is triggered by changes to dimensions, margins, or DOM structure. Repaint redraws pixels without geometry changes, triggered by color or visibility changes. Reflow always causes repaint but not vice versa. Transform and opacity skip both.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["reflow", "repaint", "layout", "performance"],
        commonMistakes: [
          "Assuming every DOM change causes a reflow — changes to color or background only trigger a repaint.",
          "Not realizing that reading layout properties (offsetHeight, scrollTop) forces a synchronous reflow if the layout is dirty.",
          "Animating top/left instead of using transform, which avoids both reflow and repaint.",
        ],
        followUps: [
          "What is layout thrashing and how do you prevent it?",
          "Which CSS properties only trigger compositing?",
        ],
        interviewTips: [
          "Mention the three-tier cost hierarchy: reflow (most expensive) > repaint > composite (cheapest).",
          "Give a concrete example of layout thrashing and how to batch reads/writes to fix it.",
          "Reference the CSS Triggers website as a resource for knowing which properties trigger what.",
        ],
        relatedTopics: [
          "layout thrashing",
          "GPU compositing",
          "animation performance",
        ],
      },
      {
        id: "browser-rendering-q3",
        question: "How does the browser construct the DOM tree?",
        answer:
          "The DOM (Document Object Model) tree is the browser internal representation of an HTML document. It is built through a multi-step parsing process that transforms the raw bytes of an HTML response into a structured tree of nodes that JavaScript can interact with.\n\nThe process begins with byte-to-character conversion. The browser reads the raw bytes from the network and converts them into characters using the specified encoding (usually UTF-8). Next, these characters are passed to a tokenizer that breaks the character stream into tokens — start tags, end tags, attribute names and values, text content, and comments. The HTML specification defines a detailed state machine for tokenization.\n\nTokens are then consumed by the tree construction algorithm, which creates DOM nodes and inserts them into the tree. When the parser encounters a start tag token, it creates an element node and pushes it onto the stack of open elements. Text tokens become text nodes appended to the current parent. End tag tokens pop elements from the stack. The parser also handles error correction — the HTML spec defines recovery behavior for malformed markup, such as auto-closing tags or rearranging misnested elements.\n\nThe parsing process is incremental: the browser does not wait for the entire HTML document to arrive before starting. It processes chunks of HTML as they stream in, allowing the page to begin rendering progressively. However, parsing is interrupted when the parser encounters a synchronous script tag. The parser must pause, download the script (if external), execute it, and only then resume parsing. This is because JavaScript can modify the DOM via document.write(), so the parser cannot safely continue until the script finishes.\n\nPreload scanners mitigate some of this blocking by looking ahead in the HTML for resources (images, stylesheets, scripts) to fetch while the main parser is blocked on script execution. This optimization significantly reduces total page load time even when scripts block the parser.",
        shortAnswer:
          "The browser converts HTML bytes into characters, tokenizes them into HTML tokens (start tags, end tags, text), and feeds those tokens into a tree-construction algorithm that builds DOM nodes and inserts them into the tree. Parsing is incremental but pauses for synchronous scripts.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["dom", "parsing", "html", "tokenization"],
        commonMistakes: [
          "Thinking the entire HTML must download before DOM construction begins — parsing is incremental.",
          "Forgetting that synchronous scripts block the parser, delaying DOM construction.",
          "Confusing the DOM with the HTML source — the DOM is the browser parsed and error-corrected representation.",
        ],
        followUps: [
          "What role does the preload scanner play during parsing?",
          "How does document.write() affect DOM construction?",
          "What happens when the parser encounters invalid HTML?",
        ],
        interviewTips: [
          "Describe the pipeline: Bytes -> Characters -> Tokens -> Nodes -> DOM Tree.",
          "Highlight the incremental nature and the parser-blocking behavior of scripts.",
        ],
        relatedTopics: ["HTML parsing", "preload scanner", "script loading"],
      },
      {
        id: "browser-rendering-q4",
        question:
          "What is the CSSOM, and why is CSS considered render-blocking?",
        answer:
          'The CSSOM (CSS Object Model) is a tree structure similar to the DOM that represents all the CSS rules and their cascade relationships. Just as the browser parses HTML into the DOM, it parses CSS (from external stylesheets, style tags, and inline styles) into the CSSOM. Each node in the CSSOM tree holds the computed style information for the corresponding element.\n\nCSS is considered render-blocking because the browser cannot construct the render tree — and therefore cannot paint anything on screen — until the CSSOM is fully built. Unlike the DOM, which can be constructed incrementally, the CSSOM cannot be used partially. The reason is CSS cascade and inheritance: a rule defined at the bottom of a stylesheet could override a rule at the top, and child elements inherit properties from their parents. The browser must process the entire stylesheet before it can determine the final computed style of any element.\n\nWhen the browser encounters a link to an external stylesheet, it issues a network request and blocks rendering until the stylesheet is downloaded and parsed. This means a large or slow-to-load CSS file directly delays the First Contentful Paint. The HTML parser itself is not blocked by CSS — it continues building the DOM — but the render tree merge step waits for both the DOM and CSSOM to be ready.\n\nThere is an important interaction between CSS and JavaScript: if a script tag appears after a stylesheet link in the HTML, the browser will delay script execution until the stylesheet is loaded. This is because the script might query computed styles (e.g., getComputedStyle()), and the browser must ensure the CSSOM is up to date before running JavaScript that depends on it. This can create a chain reaction where CSS blocks JavaScript, which in turn blocks DOM parsing.\n\nTo mitigate CSS render-blocking, best practices include inlining critical above-the-fold CSS directly in a style tag, loading non-critical CSS asynchronously using rel="preload", splitting CSS into media-specific files with media attributes (the browser still downloads them but marks non-matching ones as non-render-blocking), and minimizing overall CSS size.',
        shortAnswer:
          "The CSSOM is a tree representation of all CSS rules. CSS is render-blocking because the browser cannot build the render tree until the entire CSSOM is complete, since cascade and inheritance rules require full knowledge of all styles. This delays first paint until all CSS is downloaded and parsed.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["cssom", "css", "render-blocking", "performance"],
        commonMistakes: [
          "Confusing render-blocking (CSS) with parser-blocking (synchronous JS) — CSS blocks rendering but not HTML parsing.",
          "Assuming media-queried stylesheets are not downloaded — they are, but non-matching ones are not render-blocking.",
          "Not considering the CSS-blocks-JS chain that can indirectly block DOM parsing.",
        ],
        followUps: [
          "How can you inline critical CSS automatically?",
          "What is the impact of @import in CSS on the critical path?",
        ],
        interviewTips: [
          "Clearly distinguish between parser-blocking and render-blocking resources.",
          "Mention that the CSS-JS dependency chain can make CSS indirectly parser-blocking.",
        ],
        relatedTopics: [
          "critical rendering path",
          "render-blocking resources",
          "CSS optimization",
        ],
      },
      {
        id: "browser-rendering-q5",
        question:
          "What are compositor layers and how do they improve animation performance?",
        answer:
          'Compositor layers are separate surfaces that the browser creates to paint and manage independently before combining them into the final image displayed on screen. When elements are promoted to their own compositor layer, changes to those elements (such as transform or opacity animations) can be handled entirely by the GPU without involving the main thread.\n\nThe browser normally paints the entire page as a single layer. However, certain CSS properties and conditions cause the browser to promote an element to its own layer: using will-change with transform or opacity, applying a 3D transform (translate3d, rotate3d), using CSS animations or transitions on transform or opacity, having a fixed-position or sticky element, and video or canvas elements. Each layer is rasterized (painted into a bitmap) independently and then composited together in the correct z-order.\n\nThe performance benefit comes from what happens during animation. When you animate the top or left property of an element, the browser must recalculate layout (reflow) and repaint on every frame — this runs on the main thread and competes with JavaScript execution. If the main thread is busy, frames are dropped and the animation stutters. In contrast, when you animate transform or opacity on a composited layer, the compositor thread handles the animation entirely on the GPU. The main thread is not involved, so even if JavaScript is running a heavy computation, the animation remains smooth at 60fps.\n\nHowever, creating too many layers has a cost. Each layer consumes GPU memory, and the compositor must manage and combine them all. This is called layer explosion and can actually degrade performance on memory-constrained devices like mobile phones. The will-change property should be used judiciously — apply it only to elements that will actually animate, and remove it when the animation completes if possible.\n\nYou can inspect compositor layers in Chrome DevTools by enabling the Layers panel or checking the "Layer borders" option in the Rendering tab. Green borders indicate composited layers. This is an invaluable tool for debugging animation jank and understanding why certain elements are or are not being promoted.',
        shortAnswer:
          "Compositor layers are independently painted surfaces composited by the GPU. Elements promoted to their own layer (via will-change, transform, or opacity) can animate without involving the main thread, avoiding reflow and repaint. This enables smooth 60fps animations but excessive layers waste GPU memory.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["compositing", "layers", "gpu", "animation", "performance"],
        commonMistakes: [
          "Overusing will-change or translateZ(0) to force layer promotion everywhere, causing layer explosion and high memory usage.",
          "Assuming all CSS animations run on the compositor — only transform and opacity are composited; animating background-color still triggers paint.",
          "Ignoring that layer promotion is a heuristic and varies between browsers.",
        ],
        followUps: [
          "How can you inspect compositor layers in Chrome DevTools?",
          "What is the difference between implicit and explicit layer promotion?",
          "How does the contain CSS property relate to compositing?",
        ],
        interviewTips: [
          "Explain the three rendering tiers: layout, paint, composite — and why composite-only changes are cheapest.",
          "Mention the trade-off between animation smoothness and GPU memory usage.",
        ],
        relatedTopics: [
          "GPU acceleration",
          "will-change",
          "animation performance",
        ],
      },
      {
        id: "browser-rendering-q6",
        question:
          "How does JavaScript block HTML parsing, and what are the solutions?",
        answer:
          "When the HTML parser encounters a script tag without async or defer attributes, it must stop parsing the document, download the script if it is external, and execute it before resuming. This is called parser-blocking behavior, and it exists because JavaScript can modify the DOM structure using APIs like document.write(), so the parser cannot safely continue until it knows the script will not alter the content it has already parsed.\n\nThe cost of parser-blocking scripts is significant. While the parser is paused, no new DOM nodes are created, which delays the render tree construction and ultimately the first paint. If the script is hosted on a slow server or is large, the delay is compounded by the network fetch time. Even if the script does not use document.write() or modify the DOM, the browser has no way to know that ahead of time, so it blocks regardless.\n\nThe primary solution is the defer attribute. A deferred script downloads in parallel with HTML parsing but does not execute until the entire document has been parsed. Multiple deferred scripts execute in the order they appear in the HTML. This is ideal for scripts that need to interact with the full DOM but do not need to run during parsing.\n\nThe async attribute also downloads the script in parallel, but it executes as soon as the download finishes, potentially interrupting the parser. Async scripts do not maintain execution order, making them suitable for independent scripts like analytics or ads that do not depend on other scripts or the full DOM.\n\nA modern best practice is to place script tags at the bottom of the body element, use ES modules (which are deferred by default), or use dynamic import() to load scripts on demand. The preload scanner in modern browsers partially mitigates blocking by discovering and fetching resources ahead of the parser, but it cannot eliminate the execution delay.\n\nFor inline scripts, neither async nor defer applies. The best approach is to minimize inline script size or move the logic to external deferred files. The requestIdleCallback API can also be used to defer non-critical JavaScript execution until the browser is idle.",
        shortAnswer:
          "Synchronous script tags block the HTML parser because JavaScript could modify the DOM via document.write(). Solutions include the defer attribute (downloads in parallel, executes after parsing), async (downloads in parallel, executes immediately), placing scripts at the body end, and using ES modules which are deferred by default.",
        code: '<!-- Parser-blocking: stops DOM construction -->\n<script src="blocking.js"></script>\n\n<!-- Deferred: downloads in parallel, runs after parsing, maintains order -->\n<script defer src="app.js"></script>\n<script defer src="utils.js"></script>\n\n<!-- Async: downloads in parallel, runs immediately when ready, no order guarantee -->\n<script async src="analytics.js"></script>\n\n<!-- ES modules are deferred by default -->\n<script type="module" src="main.js"></script>\n\n<!-- Dynamic import for on-demand loading -->\n<script>\n  document.getElementById("btn").addEventListener("click", async () => {\n    const module = await import("./heavy-feature.js");\n    module.init();\n  });\n</script>',
        language: "html",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rendering-1",
        tags: ["script-loading", "defer", "async", "parser-blocking"],
        commonMistakes: [
          "Using async for scripts that depend on each other — async does not guarantee execution order.",
          "Placing defer on inline scripts — defer only works on external scripts with a src attribute.",
          "Forgetting that ES modules are always deferred, making an explicit defer attribute redundant on type=module scripts.",
        ],
        followUps: [
          "What is the preload scanner and how does it help with blocked parsing?",
          "How do dynamic imports differ from static imports in terms of loading behavior?",
        ],
        interviewTips: [
          "Draw a timeline showing when each loading strategy (normal, async, defer) downloads and executes relative to HTML parsing.",
          "Mention that ES modules are deferred by default to show awareness of modern JavaScript practices.",
        ],
        relatedTopics: ["async vs defer", "ES modules", "code splitting"],
      },
    ],
  },
  {
    id: "browser-http-1",
    title: "HTTP/HTTPS",
    description:
      "Master the HTTP protocol from methods and status codes to the TLS handshake, HTTP/2 multiplexing, and HTTP/3 over QUIC.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "http", "https", "protocols", "http2", "http3"],
    overview:
      "HTTP is the foundation of data communication on the web. Understanding its methods, status codes, headers, and the evolution from HTTP/1.1 through HTTP/2 to HTTP/3 is essential for building and debugging web applications.",
    concepts: [
      "HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD)",
      "Status codes (1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error)",
      "Request and response headers",
      "HTTPS and TLS handshake",
      "HTTP/2 multiplexing and server push",
      "HTTP/2 header compression (HPACK) and binary framing",
      "HTTP/3 and QUIC protocol",
    ],
    relatedTopicIds: [
      "browser-cors-1",
      "browser-xhr-fetch-1",
      "browser-rest-graphql-1",
      "browser-cookies-1",
    ],
    codeExamples: [
      {
        title: "Making HTTP requests with Fetch",
        code: 'async function makeRequests(): Promise<void> {\n  // GET request\n  const getRes = await fetch("https://api.example.com/users");\n  const users = await getRes.json();\n\n  // POST with JSON body\n  const postRes = await fetch("https://api.example.com/users", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),\n  });\n\n  // PUT (full replacement)\n  await fetch("https://api.example.com/users/1", {\n    method: "PUT",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ name: "Alice", email: "new@example.com" }),\n  });\n\n  // PATCH (partial update)\n  await fetch("https://api.example.com/users/1", {\n    method: "PATCH",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ email: "updated@example.com" }),\n  });\n\n  // DELETE\n  await fetch("https://api.example.com/users/1", { method: "DELETE" });\n}',
        language: "typescript",
        explanation:
          "Demonstrates the five most common HTTP methods using the Fetch API with appropriate headers and body payloads.",
      },
      {
        title: "Reading response status and headers",
        code: 'async function inspectResponse(): Promise<void> {\n  const response = await fetch("https://api.example.com/data");\n\n  console.log(response.status);       // 200\n  console.log(response.statusText);   // "OK"\n  console.log(response.ok);           // true (status 200-299)\n  console.log(response.headers.get("content-type")); // "application/json"\n  console.log(response.headers.get("cache-control")); // "max-age=3600"\n\n  if (!response.ok) {\n    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);\n  }\n\n  const data = await response.json();\n}',
        language: "typescript",
        explanation:
          "Shows how to inspect HTTP response properties including status codes, headers, and the ok shorthand for success status ranges.",
      },
    ],
    questions: [
      {
        id: "browser-http-q1",
        question: "Explain the main HTTP methods and when to use each one.",
        answer:
          "HTTP methods (also called verbs) define the intended action to perform on a resource. The HTTP specification defines several methods, each with specific semantics, safety, and idempotency characteristics that inform when they should be used.\n\nGET retrieves a representation of the specified resource. It is safe (does not modify server state) and idempotent (making the same request multiple times produces the same result). GET requests should never have side effects and should not include a request body (though technically allowed, most servers ignore it). Browsers use GET for navigation, image loading, and script fetching.\n\nPOST submits data to be processed by the target resource. It is neither safe nor idempotent — each POST may create a new resource or trigger a different side effect. POST is used for creating new resources, submitting forms, uploading files, and any operation that changes server state. The request body carries the data in a format specified by the Content-Type header (JSON, form-urlencoded, multipart, etc.).\n\nPUT replaces the entire target resource with the request body. It is idempotent: sending the same PUT request multiple times has the same effect as sending it once (the resource ends up in the same state). PUT is used when the client knows the full representation of the resource and wants to create or completely replace it.\n\nPATCH applies partial modifications to a resource. Unlike PUT, which requires the full representation, PATCH sends only the fields that should change. It is not necessarily idempotent (e.g., a PATCH that increments a counter). PATCH is preferred over PUT when you only need to update a few fields of a large resource.\n\nDELETE removes the specified resource. It is idempotent — deleting the same resource twice results in the same state (the resource is gone). OPTIONS is used by browsers in CORS preflight requests to ask the server which methods and headers are allowed. HEAD is identical to GET but returns only the response headers without a body, useful for checking if a resource exists or reading its metadata without downloading the full content.",
        shortAnswer:
          "GET retrieves resources (safe, idempotent). POST creates or processes data (not safe, not idempotent). PUT replaces a resource entirely (idempotent). PATCH partially updates a resource. DELETE removes a resource (idempotent). OPTIONS checks allowed methods (used in CORS preflight). HEAD retrieves only headers.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: ["http-methods", "get", "post", "put", "delete", "rest"],
        commonMistakes: [
          "Using GET requests for operations that modify server state — GET should be safe and idempotent.",
          "Confusing PUT and PATCH — PUT replaces the entire resource while PATCH updates only specified fields.",
          "Assuming POST is idempotent — duplicate POST requests can create duplicate resources if not handled by the server.",
          "Sending a body with GET requests — while technically allowed, most servers and proxies ignore or reject it.",
        ],
        followUps: [
          "What does idempotent mean and why does it matter for API design?",
          "When would you choose PATCH over PUT?",
          "How does the OPTIONS method relate to CORS?",
        ],
        interviewTips: [
          "Organize your answer by grouping methods: safe (GET, HEAD, OPTIONS) vs unsafe (POST, PUT, PATCH, DELETE), and idempotent vs non-idempotent.",
          "Mention real-world use cases for each method to show practical understanding.",
        ],
        relatedTopics: ["REST API design", "CORS preflight", "idempotency"],
      },
      {
        id: "browser-http-q2",
        question:
          "Describe the HTTP status code ranges and give important examples from each.",
        answer:
          "HTTP status codes are three-digit numbers returned by the server to indicate the result of a request. They are grouped into five classes based on the first digit, each representing a different category of response.\n\n1xx (Informational) codes indicate the request was received and the server is continuing to process it. 100 Continue tells the client to proceed with sending the request body (used when the client sends an Expect: 100-continue header). 101 Switching Protocols is sent when the server agrees to change protocols, such as upgrading from HTTP to WebSocket. 103 Early Hints allows the server to send preliminary headers (like Link headers for preloading) before the final response.\n\n2xx (Success) codes mean the request was successfully received, understood, and accepted. 200 OK is the standard success response for GET and POST. 201 Created indicates a new resource was successfully created (typically returned by POST). 204 No Content means success but the response has no body (common for DELETE). 206 Partial Content is used for range requests when the client requests a portion of a resource.\n\n3xx (Redirection) codes indicate the client must take additional action to complete the request. 301 Moved Permanently redirects all future requests to the new URL and is cacheable. 302 Found is a temporary redirect. 304 Not Modified tells the client its cached version is still valid (used with conditional requests via ETag or Last-Modified). 307 Temporary Redirect and 308 Permanent Redirect preserve the original HTTP method, unlike 301/302 which may change POST to GET.\n\n4xx (Client Error) codes indicate the request was malformed or unauthorized. 400 Bad Request means the server cannot process the request due to client error (invalid syntax, missing fields). 401 Unauthorized means authentication is required. 403 Forbidden means the server understood the request but refuses to authorize it. 404 Not Found means the requested resource does not exist. 405 Method Not Allowed, 409 Conflict, 422 Unprocessable Entity, and 429 Too Many Requests are other commonly encountered codes.\n\n5xx (Server Error) codes indicate the server failed to fulfill a valid request. 500 Internal Server Error is a generic server-side failure. 502 Bad Gateway means an upstream server sent an invalid response. 503 Service Unavailable means the server is temporarily overloaded or under maintenance. 504 Gateway Timeout means an upstream server did not respond in time.",
        shortAnswer:
          "1xx: Informational (100 Continue, 101 Switching Protocols). 2xx: Success (200 OK, 201 Created, 204 No Content). 3xx: Redirection (301 Permanent, 304 Not Modified). 4xx: Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). 5xx: Server Error (500 Internal, 502 Bad Gateway, 503 Unavailable).",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: ["status-codes", "http", "error-handling"],
        commonMistakes: [
          "Confusing 401 Unauthorized (authentication needed) with 403 Forbidden (authenticated but not authorized).",
          "Not knowing the difference between 301 and 308 — 301 may change POST to GET, 308 preserves the method.",
          "Using 200 for everything instead of semantically correct codes like 201 for creation or 204 for no-content responses.",
        ],
        followUps: [
          "What is the difference between 301 and 302 redirects for SEO?",
          "How does 304 Not Modified work with ETag and If-None-Match headers?",
          "When would you use 429 Too Many Requests?",
        ],
        interviewTips: [
          "Organize by ranges and give 2-3 key codes per range with their practical meaning.",
          "Mention 304 Not Modified to demonstrate awareness of browser caching mechanisms.",
        ],
        relatedTopics: ["caching", "error handling", "REST API design"],
      },
      {
        id: "browser-http-q3",
        question: "How does the HTTPS/TLS handshake work?",
        answer:
          "The TLS (Transport Layer Security) handshake is the process by which a client and server establish a secure encrypted connection before any HTTP data is exchanged. It ensures confidentiality (data is encrypted), integrity (data is not tampered with), and authentication (the server is who it claims to be).\n\nThe handshake begins with the Client Hello message. The client sends the server a list of supported TLS versions, cipher suites (encryption algorithms), and a randomly generated client random value. In TLS 1.3, the client also includes key share extensions with its preferred key exchange parameters, enabling a faster handshake.\n\nThe server responds with a Server Hello containing the chosen TLS version and cipher suite, along with its own server random value. The server then sends its digital certificate, which contains its public key and is signed by a trusted Certificate Authority (CA). The client verifies this certificate by checking the CA signature chain, the certificate expiration date, and that the certificate domain matches the requested domain.\n\nIn TLS 1.2, the handshake then involves a key exchange step (often using Diffie-Hellman or ECDHE) where both parties contribute to generating a shared pre-master secret without ever transmitting it directly. Both the client and server derive the session keys (symmetric encryption keys) from the pre-master secret, client random, and server random. The client sends a Change Cipher Spec message and a Finished message encrypted with the new session key. The server does the same.\n\nTLS 1.3 streamlines this process significantly. By including key shares in the Client Hello, the handshake completes in a single round trip (1-RTT) instead of two. TLS 1.3 also removes support for older, insecure cipher suites and eliminates the separate Change Cipher Spec step. It even supports 0-RTT resumption for returning clients, where data can be sent with the first message, though this comes with replay attack risks.\n\nOnce the handshake is complete, all HTTP traffic is encrypted with symmetric encryption (typically AES-GCM or ChaCha20-Poly1305) using the derived session keys. Symmetric encryption is used for the actual data because it is much faster than asymmetric encryption, which is only used during the handshake for key exchange.",
        shortAnswer:
          "The TLS handshake starts with Client Hello (supported ciphers + client random) and Server Hello (chosen cipher + server random + certificate). The client verifies the certificate, both parties perform a key exchange (e.g., ECDHE) to derive shared session keys, and all subsequent HTTP data is symmetrically encrypted. TLS 1.3 reduces this to one round trip.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: ["tls", "https", "encryption", "security", "handshake"],
        commonMistakes: [
          "Thinking HTTPS uses asymmetric encryption for all data — it only uses it during the handshake; the actual traffic uses faster symmetric encryption.",
          "Confusing SSL and TLS — SSL is the deprecated predecessor; modern secure connections use TLS 1.2 or 1.3.",
          "Not knowing that TLS 1.3 removed the RSA key exchange and mandates forward secrecy via ephemeral Diffie-Hellman.",
        ],
        followUps: [
          "What is forward secrecy and why does TLS 1.3 mandate it?",
          "What are the risks of TLS 1.3 0-RTT resumption?",
          "How does certificate pinning work?",
        ],
        interviewTips: [
          "Walk through the handshake step by step: Client Hello, Server Hello + Certificate, Key Exchange, Session Keys, Encrypted Data.",
          "Mention the TLS 1.2 to 1.3 improvements (1-RTT, removed insecure ciphers) to show current knowledge.",
        ],
        relatedTopics: [
          "certificate authorities",
          "symmetric encryption",
          "forward secrecy",
        ],
      },
      {
        id: "browser-http-q4",
        question: "What are the key improvements in HTTP/2 over HTTP/1.1?",
        answer:
          "HTTP/2, standardized in 2015, introduced fundamental changes to the HTTP protocol to address the performance limitations of HTTP/1.1. The most significant improvements are multiplexing, header compression, server push, and binary framing.\n\nMultiplexing is the headline feature. In HTTP/1.1, each TCP connection can only handle one request-response pair at a time. To fetch multiple resources concurrently, browsers open 6-8 parallel TCP connections per domain, which is wasteful and limited. HTTP/2 allows multiple requests and responses to be interleaved on a single TCP connection simultaneously. Each request-response pair is assigned a stream with a unique identifier, and data is sent in small frames that can be interleaved. This eliminates head-of-line blocking at the HTTP level and makes domain sharding unnecessary.\n\nHeader compression (HPACK) addresses the verbosity of HTTP headers. In HTTP/1.1, headers are sent as plain text with every request and can be several kilobytes, especially with cookies. HPACK uses Huffman encoding and a dynamic table that indexes previously sent headers. Subsequent requests only need to reference the index number for repeated headers, dramatically reducing overhead — particularly important for APIs making many small requests.\n\nServer push allows the server to send resources to the client before the client requests them. When the server knows the client will need a CSS file after requesting the HTML page, it can push that CSS file proactively, saving a round trip. In practice, server push has proven difficult to implement correctly (it can waste bandwidth if the client already has the resource cached) and has been deprecated in Chrome.\n\nBinary framing is the underlying change that enables all the above features. HTTP/1.1 uses plain text, which is human-readable but inefficient to parse. HTTP/2 frames messages in a binary format with a fixed structure: a frame header indicating the length, type, flags, and stream identifier, followed by the payload. This is more compact, less error-prone to parse, and enables features like multiplexing and prioritization.\n\nHTTP/2 also introduces stream prioritization, allowing clients to indicate the relative importance of resources so the server can allocate bandwidth accordingly. However, HTTP/2 still runs over TCP, which means TCP-level head-of-line blocking remains: if a single TCP packet is lost, all streams on that connection are stalled until retransmission completes.",
        shortAnswer:
          "HTTP/2 introduces multiplexing (multiple requests/responses on one TCP connection), HPACK header compression, server push (proactive resource delivery), and binary framing (compact, parseable format). These eliminate HTTP-level head-of-line blocking and reduce overhead, though TCP-level head-of-line blocking remains.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: [
          "http2",
          "multiplexing",
          "hpack",
          "server-push",
          "binary-framing",
        ],
        commonMistakes: [
          "Thinking HTTP/2 eliminates all head-of-line blocking — it only removes it at the HTTP level; TCP-level HOL blocking persists.",
          "Still applying HTTP/1.1 optimizations (domain sharding, sprite sheets) when using HTTP/2, which can actually hurt performance.",
          "Assuming server push is widely used — it has been deprecated in Chrome due to practical difficulties.",
        ],
        followUps: [
          "What is TCP head-of-line blocking and how does HTTP/3 solve it?",
          "Why was server push deprecated in practice?",
          "How does stream prioritization work in HTTP/2?",
        ],
        interviewTips: [
          "Cover the four main features: multiplexing, HPACK, server push, binary framing.",
          "Mention that HTTP/2 makes HTTP/1.1 performance hacks like domain sharding unnecessary.",
        ],
        relatedTopics: ["HTTP/3", "QUIC", "TCP head-of-line blocking"],
      },
      {
        id: "browser-http-q5",
        question: "What is HTTP/3 and how does QUIC improve upon TCP?",
        answer:
          "HTTP/3 is the latest major version of the HTTP protocol, standardized by the IETF in 2022. Its defining characteristic is that it runs over QUIC instead of TCP, fundamentally changing the transport layer to address limitations that HTTP/2 could not solve.\n\nQUIC (Quick UDP Internet Connections) is a transport protocol built on top of UDP. Unlike TCP, which is implemented in operating system kernels and is difficult to modify, QUIC is implemented in user space, allowing faster iteration and deployment. QUIC integrates TLS 1.3 directly into the transport handshake, combining what would be separate TCP and TLS handshakes into a single operation. A new connection to a QUIC server completes in a single round trip (1-RTT), compared to the 2-3 round trips needed for TCP + TLS.\n\nThe most significant improvement is the elimination of TCP head-of-line (HOL) blocking. In HTTP/2 over TCP, all streams share a single TCP connection, and a single lost packet stalls all streams until the lost packet is retransmitted. QUIC handles streams independently at the transport layer. If a packet belonging to one stream is lost, only that stream is paused for retransmission — all other streams continue unaffected. This dramatically improves performance on lossy networks like mobile connections.\n\nQUIC also supports connection migration. TCP connections are identified by a four-tuple of source IP, source port, destination IP, and destination port. When a mobile device switches from WiFi to cellular, the IP changes and the TCP connection breaks, requiring a new handshake. QUIC uses a connection ID that persists across network changes, allowing seamless migration without re-establishing the connection.\n\nFor returning visitors, QUIC supports 0-RTT resumption, where the client can send application data in its very first packet using a previously established session key. This means there is effectively zero handshake delay for repeat connections, though 0-RTT data is susceptible to replay attacks and should only be used for idempotent requests.\n\nHTTP/3 adoption has grown rapidly, with major services like Google, Facebook, and Cloudflare supporting it. Modern browsers automatically negotiate HTTP/3 via the Alt-Svc HTTP header, falling back to HTTP/2 if QUIC is unavailable.",
        shortAnswer:
          "HTTP/3 replaces TCP with QUIC, a UDP-based transport that eliminates TCP head-of-line blocking, integrates TLS 1.3 for a 1-RTT handshake, supports connection migration across network changes, and enables 0-RTT resumption for returning clients. Each QUIC stream is independent, so packet loss on one stream does not affect others.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: ["http3", "quic", "udp", "transport", "performance"],
        commonMistakes: [
          "Saying HTTP/3 uses raw UDP — it uses QUIC, which provides reliability, ordering, and congestion control on top of UDP.",
          "Confusing HTTP/2 multiplexing with QUIC stream independence — HTTP/2 multiplexes at the application layer but shares one TCP stream; QUIC multiplexes at the transport layer.",
          "Assuming 0-RTT is always safe — it is vulnerable to replay attacks and should only be used for safe, idempotent requests.",
        ],
        followUps: [
          "How does a browser discover that a server supports HTTP/3?",
          "What are the downsides of QUIC running over UDP?",
          "How does connection migration work in practice?",
        ],
        interviewTips: [
          "Structure your answer around the problems QUIC solves: HOL blocking, handshake latency, connection migration.",
          "Contrast HTTP/2 over TCP with HTTP/3 over QUIC to show you understand the evolution.",
        ],
        relatedTopics: ["HTTP/2", "TLS 1.3", "UDP", "mobile networking"],
      },
      {
        id: "browser-http-q6",
        question:
          "What are HTTP headers and what are the most important ones to know?",
        answer:
          "HTTP headers are key-value pairs sent in both requests and responses that carry metadata about the message. They control caching, authentication, content negotiation, security policies, and more. Headers are categorized as request headers (sent by the client), response headers (sent by the server), and general headers (applicable to both).\n\nContent-related headers include Content-Type, which specifies the media type of the body (e.g., application/json, text/html, multipart/form-data), Content-Length, which indicates the size of the body in bytes, and Content-Encoding, which specifies compression (e.g., gzip, br for Brotli). The Accept header in requests tells the server which content types the client can handle.\n\nCaching headers are critical for performance. Cache-Control is the primary mechanism, with directives like max-age (how long to cache), no-cache (revalidate before using), no-store (never cache), and public/private (whether shared caches like CDNs can store the response). ETag provides a fingerprint of the resource for conditional requests — the client sends If-None-Match with the ETag value, and the server responds with 304 Not Modified if the resource has not changed.\n\nSecurity headers include Strict-Transport-Security (HSTS, forces HTTPS), Content-Security-Policy (CSP, controls which resources can load), X-Content-Type-Options (prevents MIME sniffing), X-Frame-Options (prevents clickjacking via iframes), and the CORS headers (Access-Control-Allow-Origin, etc.).\n\nAuthentication headers include Authorization (carries credentials like Bearer tokens) and WWW-Authenticate (server challenge in 401 responses). Cookie and Set-Cookie headers manage cookie-based sessions. The Origin header is sent with cross-origin requests and is checked during CORS.\n\nModern performance headers include Link (for resource hints like preload and prefetch), Alt-Svc (advertising HTTP/3 support), and Server-Timing (exposing backend timing metrics to the browser). The User-Agent header identifies the client application, though its usefulness has diminished due to privacy concerns and the push toward Client Hints (Sec-CH-UA, etc.) as a replacement.",
        shortAnswer:
          "HTTP headers are key-value metadata pairs in requests and responses. Key categories include content (Content-Type, Content-Length), caching (Cache-Control, ETag), security (CSP, HSTS, X-Frame-Options, CORS), authentication (Authorization, Cookie), and performance (Link, Alt-Svc, Server-Timing).",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-http-1",
        tags: ["headers", "caching", "security", "content-type"],
        commonMistakes: [
          "Not setting Cache-Control properly, leading to stale content or unnecessary revalidation.",
          "Confusing no-cache (revalidate before using) with no-store (never cache) — no-cache still caches but always checks freshness.",
          "Forgetting Content-Type on POST/PUT requests, causing the server to misinterpret the body format.",
        ],
        followUps: [
          "How do ETag and If-None-Match enable conditional requests?",
          "What is the difference between Cache-Control: no-cache and no-store?",
          "How do Client Hints replace User-Agent?",
        ],
        interviewTips: [
          "Group headers by function (content, caching, security, auth) for a structured answer.",
          "Demonstrate practical knowledge by mentioning Cache-Control directives and their effects.",
        ],
        relatedTopics: [
          "caching",
          "CORS",
          "content negotiation",
          "security headers",
        ],
      },
    ],
  },
  {
    id: "browser-cors-1",
    title: "CORS",
    description:
      "Understand the same-origin policy, Cross-Origin Resource Sharing headers, preflight requests, and common solutions for cross-origin issues.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "cors", "security", "same-origin"],
    overview:
      "CORS (Cross-Origin Resource Sharing) is a security mechanism that controls how web pages make HTTP requests to domains different from their own. It extends the same-origin policy to allow safe cross-origin access when the server explicitly permits it.",
    concepts: [
      "Same-origin policy",
      "Origin definition (scheme + host + port)",
      "CORS headers (Access-Control-Allow-Origin, etc.)",
      "Preflight requests (OPTIONS)",
      "Simple vs complex (preflighted) requests",
      "Credentials and cookies with CORS",
      "Proxy solutions for CORS",
    ],
    relatedTopicIds: [
      "browser-http-1",
      "browser-cookies-1",
      "browser-xhr-fetch-1",
    ],
    codeExamples: [
      {
        title: "Server-side CORS configuration (Express)",
        code: 'import express from "express";\nimport cors from "cors";\n\nconst app = express();\n\n// Allow specific origins\napp.use(cors({\n  origin: ["https://myapp.com", "https://staging.myapp.com"],\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true,\n  maxAge: 86400, // Cache preflight for 24 hours\n}));\n\n// Manual CORS headers (without middleware)\napp.use((req, res, next) => {\n  res.header("Access-Control-Allow-Origin", "https://myapp.com");\n  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");\n  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");\n  res.header("Access-Control-Allow-Credentials", "true");\n  if (req.method === "OPTIONS") {\n    return res.sendStatus(204);\n  }\n  next();\n});',
        language: "typescript",
        explanation:
          "Shows both middleware-based and manual CORS header configuration on an Express server.",
      },
      {
        title: "Fetch request with credentials (cookies)",
        code: '// Client-side: send cookies with cross-origin request\nconst response = await fetch("https://api.example.com/user", {\n  method: "GET",\n  credentials: "include", // send cookies cross-origin\n});\n\n// For this to work, the server MUST respond with:\n// Access-Control-Allow-Origin: https://myapp.com (NOT *)\n// Access-Control-Allow-Credentials: true',
        language: "typescript",
        explanation:
          'When sending cookies cross-origin, the client must set credentials: "include" and the server must respond with the specific origin (not wildcard) and Access-Control-Allow-Credentials: true.',
      },
    ],
    questions: [
      {
        id: "browser-cors-q1",
        question: "What is the same-origin policy and why does it exist?",
        answer:
          "The same-origin policy is a fundamental browser security mechanism that restricts how documents and scripts from one origin can interact with resources from another origin. An origin is defined by the combination of three components: the scheme (protocol), the host (domain), and the port number. Two URLs have the same origin only if all three components match exactly.\n\nFor example, https://example.com:443/page and https://example.com:443/other share the same origin. But https://example.com and http://example.com differ in scheme, https://example.com and https://api.example.com differ in host, and https://example.com:443 and https://example.com:8080 differ in port — all are cross-origin.\n\nThe same-origin policy exists to protect users from malicious websites. Without it, a malicious page could make authenticated requests to your bank website (which shares your cookies), read the response containing your account data, and send it to an attacker server. The same-origin policy prevents this by blocking scripts on one origin from reading responses from a different origin.\n\nImportantly, the same-origin policy does not prevent cross-origin requests from being sent — it prevents the response from being read by the requesting script. The request still reaches the server, which is why CSRF (Cross-Site Request Forgery) attacks are possible even with the same-origin policy in place. The server may still process the request; the browser just refuses to expose the response to the JavaScript that made the request.\n\nThe policy applies to XMLHttpRequest and Fetch API calls, iframe access (cross-origin iframes cannot be accessed via JavaScript), Web Storage and IndexedDB (each origin has its own storage), and cookies (with some exceptions based on domain and path attributes). Certain cross-origin requests are allowed by design: loading images, CSS, and scripts via HTML tags, submitting forms, and embedding iframes (though you cannot access their content).",
        shortAnswer:
          "The same-origin policy restricts cross-origin interactions between documents/scripts. An origin is defined by scheme + host + port. It prevents malicious sites from reading sensitive data from other origins. Requests are still sent but responses are blocked from being read. CORS provides a controlled way to relax this restriction.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cors-1",
        tags: ["same-origin-policy", "security", "origin", "browser"],
        commonMistakes: [
          "Thinking the same-origin policy blocks requests from being sent — it blocks reading the response, not sending the request.",
          "Confusing same-origin with same-domain — subdomains are different origins even though they share a domain.",
          "Not realizing that scheme matters — http and https are different origins even for the same domain.",
        ],
        followUps: [
          "How does the same-origin policy relate to CSRF attacks?",
          "What cross-origin actions are allowed by default without CORS?",
          "How do cookies handle same-origin vs same-site?",
        ],
        interviewTips: [
          "Define origin precisely (scheme + host + port) and give clear examples of same-origin vs cross-origin URLs.",
          "Emphasize that the policy blocks reading responses, not sending requests, which is a nuance interviewers look for.",
        ],
        relatedTopics: ["CORS", "CSRF", "cookie security", "iframe sandboxing"],
      },
      {
        id: "browser-cors-q2",
        question: "What is a CORS preflight request and when does it occur?",
        answer:
          'A CORS preflight request is an automatic OPTIONS request that the browser sends before certain cross-origin requests to ask the server whether the actual request is permitted. The preflight is a safety check that allows the server to inspect the intended request method, headers, and origin before deciding to allow or reject it.\n\nA preflight is triggered when the request is a "complex" (non-simple) request. A request is considered simple only if it meets all of these criteria: the method is GET, HEAD, or POST; the only manually set headers are Accept, Accept-Language, Content-Language, and Content-Type; and the Content-Type value is application/x-www-form-urlencoded, multipart/form-data, or text/plain. Any request that falls outside these criteria — such as using PUT/DELETE/PATCH, setting custom headers like Authorization, or sending JSON (Content-Type: application/json) — triggers a preflight.\n\nThe preflight OPTIONS request includes these headers: Origin (the requesting origin), Access-Control-Request-Method (the HTTP method the actual request will use), and Access-Control-Request-Headers (any custom headers the actual request will include). The server responds with Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, and optionally Access-Control-Max-Age (how long the browser can cache the preflight result).\n\nIf the server response indicates the actual request is permitted, the browser proceeds to send the real request. If the server does not include the correct CORS headers or returns an error, the browser blocks the actual request and the JavaScript receives a CORS error. The developer will see an error in the console but cannot programmatically access details about the failure for security reasons.\n\nPreflight caching via Access-Control-Max-Age is important for performance. Without it, every non-simple cross-origin request incurs an extra OPTIONS round trip. Setting a reasonable max-age (e.g., 86400 seconds for 24 hours) lets the browser skip the preflight for subsequent requests with the same method and headers.',
        shortAnswer:
          "A preflight is an automatic OPTIONS request the browser sends before complex cross-origin requests. It occurs when the request uses non-simple methods (PUT, DELETE), custom headers (Authorization), or JSON Content-Type. The server must respond with appropriate Access-Control-Allow-* headers or the actual request is blocked.",
        code: '// This triggers a preflight because of custom headers and JSON content\nfetch("https://api.example.com/data", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json", // not a "simple" content type\n    "Authorization": "Bearer token123",  // custom header\n  },\n  body: JSON.stringify({ name: "test" }),\n});\n\n// Preflight OPTIONS request sent by browser:\n// OPTIONS /data HTTP/1.1\n// Origin: https://myapp.com\n// Access-Control-Request-Method: POST\n// Access-Control-Request-Headers: Content-Type, Authorization\n\n// Server must respond with:\n// Access-Control-Allow-Origin: https://myapp.com\n// Access-Control-Allow-Methods: POST\n// Access-Control-Allow-Headers: Content-Type, Authorization\n// Access-Control-Max-Age: 86400',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cors-1",
        tags: ["preflight", "options", "cors-headers", "simple-request"],
        commonMistakes: [
          "Not handling OPTIONS requests on the server, causing preflight failures even though the server supports the actual request.",
          'Forgetting that application/json Content-Type triggers a preflight — it is not a "simple" content type.',
          "Not setting Access-Control-Max-Age, causing unnecessary preflight requests on every API call.",
          "Returning 200 with a body for OPTIONS instead of 204 No Content, wasting bandwidth.",
        ],
        followUps: [
          "How can you reduce the number of preflight requests?",
          "What happens if the preflight response has incorrect headers?",
        ],
        interviewTips: [
          "List the exact criteria for a simple request (methods, headers, content types) to show thorough understanding.",
          "Mention Access-Control-Max-Age as a performance optimization — this shows practical experience.",
        ],
        relatedTopics: ["simple requests", "CORS caching", "OPTIONS method"],
      },
      {
        id: "browser-cors-q3",
        question: "Explain the key CORS response headers and their purpose.",
        answer:
          'CORS relies on a set of HTTP response headers that the server sends to tell the browser which cross-origin requests are allowed. Understanding each header and its valid values is essential for debugging CORS issues.\n\nAccess-Control-Allow-Origin is the most fundamental CORS header. It specifies which origins are permitted to access the resource. It can be set to a specific origin (e.g., https://myapp.com) or the wildcard (*) to allow any origin. However, the wildcard cannot be used when the request includes credentials (cookies, HTTP authentication). When dynamically reflecting the request Origin header, the server should also include a Vary: Origin header to ensure caches store separate responses per origin.\n\nAccess-Control-Allow-Methods lists the HTTP methods the server permits for cross-origin requests (e.g., GET, POST, PUT, DELETE). This is returned in the preflight response and tells the browser which methods are safe to use. Access-Control-Allow-Headers similarly lists the request headers the server will accept (e.g., Content-Type, Authorization, X-Custom-Header).\n\nAccess-Control-Allow-Credentials is a boolean header (set to "true") that indicates whether the server allows requests with credentials (cookies, Authorization headers). When this header is present, Access-Control-Allow-Origin cannot be the wildcard — it must be the specific requesting origin. On the client side, the Fetch request must also set credentials: "include".\n\nAccess-Control-Expose-Headers lists response headers that the browser should make accessible to JavaScript. By default, only a handful of "CORS-safelisted" response headers are exposed (Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma). Custom response headers like X-Request-Id or X-Total-Count are hidden unless explicitly exposed.\n\nAccess-Control-Max-Age specifies how many seconds the browser can cache the preflight response. During this window, the browser will not send another OPTIONS request for the same resource, method, and headers. Setting this to 86400 (24 hours) reduces preflight overhead significantly, though browsers may cap the maximum value (Chrome caps at 7200 seconds / 2 hours).',
        shortAnswer:
          "Key CORS headers: Access-Control-Allow-Origin (which origins can access), Allow-Methods (permitted HTTP methods), Allow-Headers (permitted request headers), Allow-Credentials (allow cookies), Expose-Headers (which response headers JS can read), Max-Age (preflight cache duration). The wildcard * cannot be used with credentials.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cors-1",
        tags: ["cors-headers", "access-control", "security"],
        commonMistakes: [
          'Using Access-Control-Allow-Origin: * with credentials: "include" — this combination is explicitly forbidden by the spec.',
          "Not including Vary: Origin when dynamically reflecting the request origin, causing incorrect cached responses.",
          "Forgetting Access-Control-Expose-Headers for custom response headers, making them invisible to client JavaScript.",
        ],
        followUps: [
          "Why must Vary: Origin be included when dynamically reflecting the origin?",
          "What response headers are exposed by default without Access-Control-Expose-Headers?",
          "How do CDN caches interact with CORS headers?",
        ],
        interviewTips: [
          "Cover each header systematically and mention the credentials + wildcard restriction.",
          "Mention Access-Control-Expose-Headers as it is commonly overlooked and shows depth.",
        ],
        relatedTopics: ["preflight requests", "credentials", "CDN caching"],
      },
      {
        id: "browser-cors-q4",
        question:
          "How would you solve CORS issues during development and in production?",
        answer:
          "CORS issues arise when a front-end application on one origin tries to access an API on a different origin without proper CORS headers from the server. The solution depends on whether you are in development or production and whether you control the server.\n\nIn development, the most common solution is a proxy server. Frameworks like Vite, Create React App, and Next.js allow configuring a development proxy that forwards API requests from the dev server to the actual API. Since the browser makes the request to the same origin (the dev server), no CORS headers are needed. The proxy server, being a server-to-server communication, is not subject to browser CORS restrictions. For Vite, this is configured in vite.config.ts under server.proxy.\n\nIn production, the proper solution is configuring CORS on the server. The server should validate the Origin header against a whitelist of allowed origins and respond with the appropriate Access-Control-Allow-Origin header. For APIs that serve both browser clients and server-to-server traffic, the server should only add CORS headers when the Origin header is present. Middleware like the cors package for Express makes this straightforward.\n\nIf you do not control the API server, you can set up a reverse proxy (like Nginx or a Cloudflare Worker) that sits in front of the API and adds CORS headers. The browser talks to the proxy, which forwards the request to the API and adds CORS headers to the response. Services like cors-anywhere exist for this purpose but should not be used in production due to security and reliability concerns.\n\nAnother pattern is to use your own backend as a relay. The front end makes requests to your same-origin backend, which then makes server-side requests to the third-party API and returns the results. This avoids CORS entirely and also hides API keys from the client.\n\nFor static resources like fonts or images hosted on a CDN, the CDN must be configured to include CORS headers. Most CDN providers (Cloudflare, AWS CloudFront, Fastly) have built-in CORS configuration options. When caching CORS responses, ensure the cache varies by Origin to prevent cross-origin pollution.",
        shortAnswer:
          "Development: use a dev proxy (Vite, CRA, Next.js). Production: configure CORS headers on the server with an origin whitelist. If you do not control the server, use a reverse proxy or relay through your own backend. For CDN resources, configure CORS at the CDN level.",
        code: '// Vite dev proxy configuration\n// vite.config.ts\nimport { defineConfig } from "vite";\n\nexport default defineConfig({\n  server: {\n    proxy: {\n      "/api": {\n        target: "https://api.example.com",\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, ""),\n      },\n    },\n  },\n});\n\n// Now fetch("/api/users") in dev goes to https://api.example.com/users\n// No CORS issues because the browser sees it as a same-origin request',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-cors-1",
        tags: ["cors-solutions", "proxy", "development", "production"],
        commonMistakes: [
          "Disabling CORS in the browser (via flags or extensions) for development — this masks the issue and does not work in production.",
          "Setting Access-Control-Allow-Origin: * in production for APIs that handle sensitive data — always use a specific origin whitelist.",
          "Using a public CORS proxy service in production, which introduces a single point of failure and potential security risk.",
        ],
        followUps: [
          "How would you handle CORS for a multi-tenant application with many allowed origins?",
          "What is the security risk of reflecting any Origin header back as the allowed origin?",
        ],
        interviewTips: [
          "Distinguish between development solutions (proxy) and production solutions (server config) to show practical experience.",
          "Mention the relay pattern as an alternative when you cannot control the API server.",
        ],
        relatedTopics: ["reverse proxy", "Nginx configuration", "CDN setup"],
      },
      {
        id: "browser-cors-q5",
        question: "How do credentials (cookies) work with CORS requests?",
        answer:
          'By default, cross-origin requests made with Fetch or XMLHttpRequest do not include credentials — cookies, HTTP authentication headers, and TLS client certificates are omitted. To send credentials with a cross-origin request, both the client and server must explicitly opt in.\n\nOn the client side, the Fetch API requires setting credentials: "include" in the request options. For XMLHttpRequest, you set the withCredentials property to true. Without these settings, cookies for the target domain are not sent with the request, even if they exist in the browser cookie jar.\n\nOn the server side, two conditions must be met. First, the response must include the header Access-Control-Allow-Credentials: true. Second, the Access-Control-Allow-Origin header must specify the exact requesting origin — the wildcard (*) is explicitly forbidden when credentials are involved. If the server responds with Access-Control-Allow-Origin: * while the request includes credentials, the browser will reject the response entirely.\n\nThis restriction exists for security. If wildcard origins were allowed with credentials, any website could make authenticated requests to your API and read the responses, effectively bypassing the same-origin policy protection. By requiring the server to name the specific allowed origin, CORS ensures the server has consciously decided to share data with that particular origin.\n\nThe same restrictions apply to Access-Control-Allow-Headers and Access-Control-Allow-Methods during preflight — they cannot use the wildcard * when credentials are involved. Each allowed header and method must be explicitly listed. The Access-Control-Expose-Headers wildcard is also forbidden with credentials.\n\nA common real-world scenario is a single-page application on https://app.example.com authenticating with an API on https://api.example.com. The API sets an HttpOnly cookie during login. Subsequent requests from the SPA must use credentials: "include", and the API must respond with Access-Control-Allow-Origin: https://app.example.com and Access-Control-Allow-Credentials: true. Additionally, the cookie must have SameSite=None and Secure attributes to be sent cross-site in modern browsers.',
        shortAnswer:
          'Cross-origin credentials require credentials: "include" on the client and Access-Control-Allow-Credentials: true on the server. The server must specify the exact origin (wildcard * is forbidden with credentials). Cookies must also have SameSite=None and Secure attributes for cross-site delivery.',
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cors-1",
        tags: ["credentials", "cookies", "cors", "authentication"],
        commonMistakes: [
          "Using Access-Control-Allow-Origin: * with credentials — the browser will reject the response.",
          "Forgetting to set SameSite=None and Secure on cookies for cross-site requests in modern browsers.",
          'Not setting credentials: "include" on the client side and wondering why cookies are not sent.',
          "Dynamically reflecting all origins as allowed without validation, creating a security vulnerability.",
        ],
        followUps: [
          "How does the SameSite cookie attribute interact with CORS credentials?",
          "What security risks arise from improperly configured credentialed CORS?",
        ],
        interviewTips: [
          "Emphasize the wildcard restriction with credentials — it is a very common interview question.",
          "Mention SameSite=None; Secure as a modern browser requirement for cross-site cookies.",
        ],
        relatedTopics: ["cookie attributes", "SameSite", "authentication"],
      },
    ],
  },
  {
    id: "browser-storage-1",
    title: "Web Storage",
    description:
      "Learn about localStorage and sessionStorage APIs, their differences, storage limits, events, and security considerations.",
    category: "Browser",
    difficulty: "Beginner",
    tags: ["browser", "storage", "localStorage", "sessionStorage"],
    overview:
      "Web Storage provides a simple key-value storage mechanism in the browser via localStorage and sessionStorage. Understanding their differences, limits, and appropriate use cases is fundamental for front-end development.",
    concepts: [
      "localStorage API and persistence",
      "sessionStorage API and tab scoping",
      "Key differences between localStorage and sessionStorage",
      "Storage events for cross-tab communication",
      "Storage limits (~5MB per origin)",
      "Security considerations",
      "JSON serialization for complex data",
      "When to use each storage type",
    ],
    relatedTopicIds: [
      "browser-cookies-1",
      "browser-indexeddb-1",
      "browser-jwt-1",
    ],
    codeExamples: [
      {
        title: "Basic localStorage and sessionStorage usage",
        code: '// localStorage persists across sessions\nlocalStorage.setItem("theme", "dark");\nlocalStorage.getItem("theme"); // "dark"\nlocalStorage.removeItem("theme");\nlocalStorage.clear(); // removes everything\n\n// sessionStorage persists only for the tab session\nsessionStorage.setItem("formDraft", "Hello world");\nsessionStorage.getItem("formDraft"); // "Hello world"\n\n// Storing complex data (must serialize to JSON)\nconst user = { name: "Alice", role: "admin" };\nlocalStorage.setItem("user", JSON.stringify(user));\nconst stored = JSON.parse(localStorage.getItem("user") ?? "{}");\nconsole.log(stored.name); // "Alice"\n\n// Check storage capacity\nfunction getStorageUsage(): string {\n  let total = 0;\n  for (let i = 0; i < localStorage.length; i++) {\n    const key = localStorage.key(i);\n    if (key) {\n      total += key.length + (localStorage.getItem(key)?.length ?? 0);\n    }\n  }\n  return (total * 2 / 1024 / 1024).toFixed(2) + " MB";\n}',
        language: "typescript",
        explanation:
          "Demonstrates basic CRUD operations on both storage types, JSON serialization for complex data, and a utility to check storage usage.",
      },
      {
        title: "Cross-tab communication via storage events",
        code: '// Tab A: listen for changes from other tabs\nwindow.addEventListener("storage", (event: StorageEvent) => {\n  if (event.key === "user-session") {\n    if (event.newValue === null) {\n      console.log("User logged out in another tab");\n      redirectToLogin();\n    } else {\n      console.log("Session updated:", event.newValue);\n    }\n  }\n});\n\nfunction redirectToLogin(): void {\n  window.location.href = "/login";\n}\n\n// Tab B: this change fires the storage event in Tab A\nlocalStorage.removeItem("user-session"); // triggers logout in all tabs',
        language: "typescript",
        explanation:
          "The storage event fires in all other tabs/windows of the same origin when localStorage changes. This enables cross-tab communication patterns like synchronized logout.",
      },
    ],
    questions: [
      {
        id: "browser-storage-q1",
        question:
          "What are the differences between localStorage and sessionStorage?",
        answer:
          'localStorage and sessionStorage are both part of the Web Storage API and share the same synchronous key-value interface, but they differ fundamentally in lifetime, scope, and use cases.\n\nlocalStorage persists indefinitely until explicitly cleared by the user, the application, or browser data cleanup. Data survives browser restarts, system reboots, and new tabs. It is scoped to the origin (scheme + host + port), meaning all tabs and windows from the same origin share the same localStorage data. When one tab writes to localStorage, the data is immediately available in all other tabs of the same origin.\n\nsessionStorage has a much shorter lifetime and narrower scope. Data persists only for the duration of the page session — it is cleared when the tab or window is closed. Each tab has its own independent sessionStorage, even for the same origin. Opening a new tab to the same URL creates a fresh sessionStorage, while duplicating a tab (Ctrl+D or "Duplicate tab") copies the sessionStorage at that moment but changes are independent afterward. Navigation within the same tab preserves sessionStorage, but closing and reopening the tab clears it.\n\nBoth storage types share the same synchronous API: setItem, getItem, removeItem, clear, key, and length. Both store data as strings only — objects must be serialized with JSON.stringify and deserialized with JSON.parse. Both have a storage limit of approximately 5MB per origin (the exact limit varies by browser), which is significantly more than cookies (4KB) but less than IndexedDB (which can store gigabytes).\n\nChoose localStorage for user preferences, themes, saved settings, or any data that should persist across sessions and tabs. Choose sessionStorage for temporary state like form drafts, wizard progress, or one-time tokens that should not leak to other tabs or survive a browser restart. Avoid storing sensitive data (tokens, passwords) in either, as both are accessible to any JavaScript running on the page, making them vulnerable to XSS attacks.',
        shortAnswer:
          "localStorage persists indefinitely and is shared across all tabs of the same origin. sessionStorage persists only for the tab session and is isolated per tab. Both use the same API, store strings only, and have a ~5MB limit. Use localStorage for persistent preferences and sessionStorage for temporary per-tab state.",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-storage-1",
        tags: ["localStorage", "sessionStorage", "web-storage", "comparison"],
        commonMistakes: [
          "Storing sensitive data (tokens, passwords) in localStorage where any XSS attack can access it.",
          'Forgetting to JSON.stringify objects before storing — Web Storage only stores strings, and objects become "[object Object]".',
          "Assuming sessionStorage is shared across tabs like localStorage — each tab has its own isolated sessionStorage.",
          "Not handling the case where storage is full, which throws a QuotaExceededError.",
        ],
        followUps: [
          "What happens when you exceed the storage quota?",
          "How does sessionStorage behave when duplicating a tab?",
          "When would you choose IndexedDB over Web Storage?",
        ],
        interviewTips: [
          "Create a comparison table in your mind: lifetime, scope, shared across tabs, typical use cases.",
          "Mention the XSS vulnerability to show security awareness — interviewers value this.",
        ],
        relatedTopics: ["IndexedDB", "cookies", "XSS", "session management"],
      },
      {
        id: "browser-storage-q2",
        question: "How do storage events work for cross-tab communication?",
        answer:
          "The storage event is a built-in browser mechanism that fires whenever localStorage is modified by another tab, window, or iframe of the same origin. It provides a simple way to synchronize state across multiple open instances of a web application without external services.\n\nWhen a tab calls localStorage.setItem(), localStorage.removeItem(), or localStorage.clear(), the browser fires a StorageEvent on the window object of every other tab or window of the same origin. Crucially, the event does not fire in the tab that made the change — only in other tabs. This prevents infinite loops and allows the originating tab to handle its own state update synchronously.\n\nThe StorageEvent object contains several useful properties: key is the key that was changed (null for clear()), oldValue is the previous value (null if the key is new), newValue is the new value (null for removals), url is the URL of the document that made the change, and storageArea is a reference to the Storage object (localStorage) that was modified.\n\nA common use case is synchronized logout. When a user logs out in one tab, the application removes the session token from localStorage. All other tabs receive the storage event, detect that the session key was removed, and redirect to the login page. Another use case is theme synchronization — changing the theme in one tab instantly updates all other tabs.\n\nsessionStorage does not trigger cross-tab storage events because it is isolated per tab. The storage event is exclusive to localStorage. For more complex cross-tab communication patterns (like broadcasting messages that are not related to storage), the BroadcastChannel API is a better fit. However, for simple state synchronization, storage events require no additional setup and work across all modern browsers.",
        shortAnswer:
          "The storage event fires on all other tabs of the same origin when localStorage changes. The event includes key, oldValue, newValue, and url properties. It does not fire in the tab that made the change. Common uses include synchronized logout and cross-tab state sync. sessionStorage does not trigger these events.",
        code: '// Robust cross-tab sync utility\nfunction onStorageChange(\n  key: string,\n  callback: (newValue: string | null, oldValue: string | null) => void\n): () => void {\n  const handler = (event: StorageEvent) => {\n    if (event.key === key) {\n      callback(event.newValue, event.oldValue);\n    }\n  };\n  window.addEventListener("storage", handler);\n  return () => window.removeEventListener("storage", handler);\n}\n\n// Usage: sync auth state across tabs\nconst cleanup = onStorageChange("auth-token", (newValue) => {\n  if (newValue === null) {\n    console.log("Logged out in another tab");\n    window.location.href = "/login";\n  }\n});\n\n// Call cleanup() to remove the listener',
        language: "typescript",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-storage-1",
        tags: ["storage-event", "cross-tab", "sync", "localStorage"],
        commonMistakes: [
          "Expecting the storage event to fire in the same tab that made the change — it only fires in other tabs.",
          "Forgetting that clear() fires a single event with key: null, not one event per key.",
          "Trying to use storage events with sessionStorage — only localStorage triggers cross-tab events.",
        ],
        followUps: [
          "What alternatives exist for cross-tab communication besides storage events?",
          "How would you implement a cross-tab lock using localStorage?",
        ],
        interviewTips: [
          "Mention the real-world use case of synchronized logout to demonstrate practical application.",
          "Contrast with BroadcastChannel API to show you know multiple communication mechanisms.",
        ],
        relatedTopics: [
          "BroadcastChannel API",
          "cross-tab communication",
          "event handling",
        ],
      },
      {
        id: "browser-storage-q3",
        question:
          "What are the storage limits and what happens when they are exceeded?",
        answer:
          "Web Storage (both localStorage and sessionStorage) has a per-origin storage limit of approximately 5MB in most browsers. This limit applies to the total size of all keys and values combined for a single origin. The exact limit varies: Chrome, Firefox, and Edge typically allow 5MB, while Safari may allow 5MB but can be reduced in private browsing mode to as little as 0 bytes in some older versions.\n\nThe 5MB limit refers to the number of characters, and since JavaScript strings use UTF-16 encoding (2 bytes per character), the actual memory consumed is approximately 10MB. However, the browser counts by character, so for practical purposes, you have 5 million characters of storage space. Each key and its associated value both count toward this limit.\n\nWhen you attempt to store data that would exceed the quota, the setItem() method throws a DOMException with the name QuotaExceededError. This error should always be caught to prevent your application from crashing. A robust approach is to wrap storage operations in try-catch blocks and implement a fallback strategy, such as removing the oldest cached items to make room or falling back to in-memory storage.\n\nTo check how much storage is being used, you can iterate over all keys and sum the character lengths. There is no built-in API to query the remaining quota for Web Storage (unlike the StorageManager API for IndexedDB and Cache Storage). Some developers use a binary search approach to determine the remaining space by attempting to store increasingly large strings.\n\nFor applications that need more storage than 5MB, IndexedDB is the appropriate choice. IndexedDB can store hundreds of megabytes or even gigabytes, with the browser typically prompting the user for permission above a certain threshold. The Cache API (used with service workers) is another option for storing network responses for offline use.",
        shortAnswer:
          "Web Storage has a ~5MB per-origin limit (varies by browser). Exceeding it throws a QuotaExceededError from setItem(). Always wrap storage operations in try-catch. For larger storage needs, use IndexedDB (supports hundreds of MBs). In Safari private browsing, the quota can be severely restricted.",
        code: 'function safeSetItem(key: string, value: string): boolean {\n  try {\n    localStorage.setItem(key, value);\n    return true;\n  } catch (error) {\n    if (\n      error instanceof DOMException &&\n      (error.name === "QuotaExceededError" ||\n       error.code === 22) // Legacy code for QuotaExceededError\n    ) {\n      console.warn("Storage quota exceeded. Attempting cleanup...");\n      evictOldEntries();\n      try {\n        localStorage.setItem(key, value);\n        return true;\n      } catch {\n        console.error("Storage still full after cleanup");\n        return false;\n      }\n    }\n    return false;\n  }\n}\n\nfunction evictOldEntries(): void {\n  const cachePrefix = "cache_";\n  const keys: string[] = [];\n  for (let i = 0; i < localStorage.length; i++) {\n    const key = localStorage.key(i);\n    if (key?.startsWith(cachePrefix)) {\n      keys.push(key);\n    }\n  }\n  // Remove oldest 25% of cached entries\n  keys.sort();\n  const toRemove = Math.ceil(keys.length * 0.25);\n  keys.slice(0, toRemove).forEach((k) => localStorage.removeItem(k));\n}',
        language: "typescript",
        difficulty: "Beginner",
        type: "Coding",
        category: "Browser",
        topicId: "browser-storage-1",
        tags: ["quota", "storage-limit", "error-handling", "localStorage"],
        commonMistakes: [
          "Not wrapping setItem in try-catch, causing unhandled exceptions when storage is full.",
          "Assuming 5MB is a hard universal limit — it varies across browsers and can be 0 in some private browsing modes.",
          "Storing large amounts of data in Web Storage instead of using IndexedDB, which is designed for larger datasets.",
        ],
        followUps: [
          "How would you implement an LRU cache on top of localStorage?",
          "What is the StorageManager API and how does it differ from Web Storage quotas?",
        ],
        interviewTips: [
          "Always mention error handling for QuotaExceededError — it shows you have dealt with this in practice.",
          "Compare the 5MB limit to cookies (4KB) and IndexedDB (GBs) to provide context.",
        ],
        relatedTopics: ["IndexedDB", "Cache API", "storage management"],
      },
      {
        id: "browser-storage-q4",
        question: "What are the security considerations for Web Storage?",
        answer:
          "Web Storage has significant security implications that every developer should understand, particularly regarding XSS vulnerability, data sensitivity, and the lack of built-in protection mechanisms.\n\nThe most critical concern is XSS (Cross-Site Scripting) vulnerability. Any JavaScript code running on a page has full access to both localStorage and sessionStorage for that origin. If an attacker injects a script into your page — through an XSS vulnerability in your application or a compromised third-party script — they can read, modify, or exfiltrate all stored data. This is why storing sensitive information like authentication tokens, API keys, or personal data in Web Storage is discouraged. HttpOnly cookies, which are inaccessible to JavaScript, are the safer choice for session tokens.\n\nUnlike cookies, Web Storage has no built-in expiration mechanism. Data in localStorage persists indefinitely until explicitly removed, meaning stale or sensitive data can linger long after it should have been cleaned up. Developers should implement their own expiration logic by storing timestamps alongside data and checking freshness on read.\n\nWeb Storage provides no encryption. Data is stored as plain text on the user disk, readable by anyone with access to the browser profile or developer tools. In shared computer environments (libraries, kiosks), data from one user session may be accessible to the next user. Encrypting values before storing them adds a layer of protection but introduces key management complexity.\n\nWeb Storage is synchronous and runs on the main thread. For large amounts of data or frequent operations, this can block the UI. However, for typical use cases (small key-value pairs, infrequent reads/writes), the performance impact is negligible.\n\nWeb Storage is origin-scoped but not path-scoped. All pages on the same origin share the same storage, which means a vulnerable page on your domain can expose data stored by any other page. This is a concern for sites that host user-generated content (like embedded widgets) on the same origin as the main application.",
        shortAnswer:
          "Web Storage is vulnerable to XSS — any JavaScript on the page can read all stored data. It has no encryption, no expiration, and no HttpOnly equivalent. Never store sensitive tokens in Web Storage; use HttpOnly cookies instead. Implement custom expiration logic and consider encryption for any stored data.",
        difficulty: "Beginner",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-storage-1",
        tags: ["security", "xss", "storage", "authentication"],
        commonMistakes: [
          "Storing JWT tokens in localStorage, exposing them to XSS attacks — HttpOnly cookies are safer.",
          "Assuming Web Storage is secure because it is origin-scoped — XSS bypasses origin restrictions.",
          "Not implementing expiration logic for cached data, leaving stale information accessible indefinitely.",
        ],
        followUps: [
          "Where should you store authentication tokens if not in localStorage?",
          "How does the Content Security Policy (CSP) help mitigate XSS risks to Web Storage?",
          "What is the difference between origin-scoping and path-scoping in terms of security?",
        ],
        interviewTips: [
          "Lead with XSS vulnerability as the primary security concern and recommend HttpOnly cookies for tokens.",
          "Mention the lack of expiration and encryption as secondary concerns to show thoroughness.",
        ],
        relatedTopics: [
          "XSS",
          "cookies",
          "Content Security Policy",
          "token storage",
        ],
      },
      {
        id: "browser-storage-q5",
        question:
          "When should you use localStorage vs sessionStorage vs cookies vs IndexedDB?",
        answer:
          "Choosing the right client-side storage mechanism depends on the data size, persistence requirements, security needs, and access patterns. Each option serves different use cases, and understanding their trade-offs is essential.\n\nlocalStorage is best for small amounts of data (under 5MB) that must persist across sessions and be accessible to JavaScript. Typical use cases include user preferences (theme, language, layout), feature flags, cached API responses, and application state that should survive browser restarts. Its synchronous API is simple and requires no setup, but it should never store sensitive data due to XSS vulnerability.\n\nsessionStorage is ideal for temporary data scoped to a single tab session. Use it for form drafts (so users do not lose input if they navigate away and return), one-time tokens, wizard/multi-step flow progress, and scroll positions. It is automatically cleaned up when the tab closes, eliminating the need for manual expiration.\n\nCookies are the right choice when data needs to be sent to the server with every HTTP request, particularly for authentication. HttpOnly cookies cannot be accessed by JavaScript, making them the most secure option for session tokens. Cookies also support expiration (Expires/Max-Age), domain scoping, and path restrictions. However, they are limited to 4KB per cookie and add overhead to every request since they are included in HTTP headers.\n\nIndexedDB is designed for large, structured datasets that need client-side querying. Use it for offline-first applications, large caches (hundreds of MBs), complex data with indexes and search requirements, and binary data (files, images). IndexedDB is asynchronous and transactional, making it more complex to use but far more powerful than Web Storage. Libraries like idb or Dexie simplify the API significantly.\n\nThe Cache API (used with service workers) is specifically designed for caching HTTP request-response pairs for offline access and performance. It is the best choice for implementing Progressive Web App caching strategies and is not meant for arbitrary key-value storage.",
        shortAnswer:
          "localStorage: persistent preferences under 5MB. sessionStorage: temporary per-tab data. Cookies: auth tokens sent to server (HttpOnly, 4KB limit). IndexedDB: large/structured data, offline apps. Cache API: HTTP response caching for PWAs. Never store sensitive data in Web Storage.",
        difficulty: "Beginner",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-storage-1",
        tags: ["storage-comparison", "localStorage", "cookies", "indexeddb"],
        commonMistakes: [
          "Using localStorage for authentication tokens instead of HttpOnly cookies.",
          "Using Web Storage for large datasets (over 5MB) when IndexedDB would be more appropriate.",
          "Using cookies for large data, not realizing they are sent with every HTTP request and add network overhead.",
          "Not considering the synchronous nature of Web Storage for performance-sensitive applications.",
        ],
        followUps: [
          "How would you implement an offline-first application?",
          "What is the Cache API and when would you use it?",
        ],
        interviewTips: [
          "Create a quick comparison mentioning size limits, persistence, security, and use cases for each.",
          "Recommending HttpOnly cookies for auth tokens shows security-first thinking.",
        ],
        relatedTopics: ["IndexedDB", "cookies", "service workers", "Cache API"],
      },
    ],
  },
  {
    id: "browser-web-vitals-1",
    title: "Web Vitals",
    description:
      "Master the Core Web Vitals metrics — LCP, INP, and CLS — along with supplementary metrics like FCP and TTFB, including measurement techniques and optimization strategies.",
    category: "Browser",
    difficulty: "Advanced",
    tags: ["browser", "web-vitals", "performance", "lcp", "inp", "cls"],
    overview:
      "Web Vitals are a set of metrics defined by Google to quantify real-world user experience on the web. Core Web Vitals (LCP, INP, CLS) are used as ranking signals and are critical for delivering a fast, responsive, and visually stable experience.",
    concepts: [
      "Largest Contentful Paint (LCP)",
      "Interaction to Next Paint (INP)",
      "Cumulative Layout Shift (CLS)",
      "First Contentful Paint (FCP)",
      "Time to First Byte (TTFB)",
      "Good/Needs Improvement/Poor thresholds",
      "Measurement tools (Lighthouse, CrUX, web-vitals library)",
      "Optimization strategies for each metric",
    ],
    relatedTopicIds: [
      "browser-rendering-1",
      "browser-devtools-1",
      "browser-http-1",
    ],
    codeExamples: [
      {
        title: "Measuring Web Vitals with the web-vitals library",
        code: 'import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";\n\ninterface VitalMetric {\n  name: string;\n  value: number;\n  rating: "good" | "needs-improvement" | "poor";\n}\n\nfunction sendToAnalytics(metric: VitalMetric): void {\n  fetch("/api/analytics", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(metric),\n    keepalive: true, // ensures request completes even if page is closing\n  });\n}\n\nonLCP((metric) => sendToAnalytics(metric as VitalMetric));\nonINP((metric) => sendToAnalytics(metric as VitalMetric));\nonCLS((metric) => sendToAnalytics(metric as VitalMetric));\nonFCP((metric) => sendToAnalytics(metric as VitalMetric));\nonTTFB((metric) => sendToAnalytics(metric as VitalMetric));',
        language: "typescript",
        explanation:
          "The web-vitals library provides a simple API to measure all Core Web Vitals. Results should be sent to an analytics endpoint for real-user monitoring (RUM).",
      },
      {
        title: "Preventing CLS with explicit dimensions",
        code: '<!-- BAD: no dimensions = layout shift when image loads -->\n<img src="/hero.jpg" alt="Hero" />\n\n<!-- GOOD: explicit dimensions prevent layout shift -->\n<img src="/hero.jpg" alt="Hero" width="1200" height="600" />\n\n<!-- GOOD: CSS aspect-ratio for responsive images -->\n<style>\n  .responsive-img {\n    width: 100%;\n    aspect-ratio: 16 / 9;\n    object-fit: cover;\n  }\n</style>\n<img class="responsive-img" src="/hero.jpg" alt="Hero" />',
        language: "html",
        explanation:
          "Setting explicit width and height attributes or using CSS aspect-ratio reserves space before the image loads, preventing layout shifts.",
      },
      {
        title: "Optimizing LCP with resource hints",
        code: '<head>\n  <!-- Preconnect to critical origins -->\n  <link rel="preconnect" href="https://cdn.example.com" />\n\n  <!-- Preload the LCP image so it starts downloading immediately -->\n  <link\n    rel="preload"\n    as="image"\n    href="https://cdn.example.com/hero.webp"\n    fetchpriority="high"\n  />\n\n  <!-- Inline critical CSS -->\n  <style>\n    .hero { min-height: 500px; background: #1a1a1a; }\n  </style>\n</head>',
        language: "html",
        explanation:
          'Preloading the LCP image with fetchpriority="high" and inlining critical CSS ensures the largest contentful element renders as early as possible.',
      },
    ],
    questions: [
      {
        id: "browser-web-vitals-q1",
        question:
          "What is Largest Contentful Paint (LCP) and how do you optimize it?",
        answer:
          'Largest Contentful Paint (LCP) measures the time from when the page starts loading to when the largest visible content element is rendered in the viewport. It is one of the three Core Web Vitals and is a key indicator of perceived load speed from the user perspective.\n\nThe LCP element is typically the hero image, a large text block, a video poster, or a background image — essentially the biggest piece of content the user sees without scrolling. Google defines good LCP as under 2.5 seconds, needs improvement between 2.5 and 4 seconds, and poor as above 4 seconds. LCP is measured at the 75th percentile of real user data, meaning 75% of page loads should achieve the good threshold.\n\nLCP is affected by four main factors: server response time (TTFB), resource load time (how long the LCP image or font takes to download), render-blocking resources (CSS and synchronous JavaScript that delay rendering), and client-side rendering (JavaScript that must execute before content appears). Each factor represents an optimization opportunity.\n\nTo optimize TTFB, use a CDN to reduce geographic latency, enable server-side caching, optimize database queries, and consider edge rendering (SSR at the CDN edge). For resource load time, compress and properly size images, use modern formats (WebP, AVIF), preload the LCP image with <link rel="preload"> and fetchpriority="high", and use responsive images with srcset. To reduce render-blocking, inline critical CSS, defer non-critical CSS, and use async/defer on scripts.\n\nFor JavaScript-rendered applications (SPAs), LCP can be significantly worse because the browser must download, parse, and execute JavaScript before rendering content. Server-side rendering (SSR), static site generation (SSG), or streaming SSR can dramatically improve LCP by delivering meaningful HTML in the initial response. Lazy loading should never be applied to the LCP element — it should load eagerly with the highest priority.',
        shortAnswer:
          "LCP measures when the largest visible content element renders. Good is under 2.5s, poor is above 4s. Optimize by reducing TTFB (CDN, caching), preloading the LCP image, inlining critical CSS, avoiding render-blocking resources, and using SSR for JS-heavy apps. Never lazy-load the LCP element.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["lcp", "performance", "loading", "optimization"],
        commonMistakes: [
          "Lazy-loading the LCP image, which delays its download and worsens the LCP score.",
          "Not preloading the LCP resource, causing the browser to discover it late in the loading process.",
          "Ignoring TTFB as a component of LCP — a slow server response shifts the entire timeline.",
          "Assuming LCP only applies to images — large text blocks and video posters also count.",
        ],
        followUps: [
          'How does fetchpriority="high" affect LCP optimization?',
          "What is the relationship between TTFB and LCP?",
          "How do you identify the LCP element on a page?",
        ],
        interviewTips: [
          "State the threshold (2.5s) and the four main factors that affect LCP.",
          "Mention that LCP is measured at the 75th percentile of real user data to show you understand field vs lab metrics.",
        ],
        relatedTopics: ["TTFB", "preloading", "SSR", "image optimization"],
      },
      {
        id: "browser-web-vitals-q2",
        question:
          "What is Interaction to Next Paint (INP) and how does it differ from FID?",
        answer:
          "Interaction to Next Paint (INP) is a Core Web Vital that measures the overall responsiveness of a page to user interactions throughout its entire lifecycle. It replaced First Input Delay (FID) as a Core Web Vital in March 2024 because INP provides a more comprehensive picture of interactivity.\n\nINP measures the latency from when a user interacts with the page (click, tap, or keypress) to when the browser paints the next frame reflecting that interaction visual feedback. It considers all interactions during the page visit and reports a value near the worst-case latency (specifically, the highest interaction latency, or the 98th percentile for pages with many interactions). A good INP is under 200 milliseconds, needs improvement is between 200ms and 500ms, and poor is above 500ms.\n\nFID only measured the delay before the first interaction event handler began executing — it did not account for the time the handler took to run or the time for the browser to paint. This meant a page could have good FID but terrible responsiveness because event handlers were slow. INP solves this by measuring the complete interaction lifecycle: input delay (time before the handler runs, usually because the main thread is busy), processing time (how long the event handler takes), and presentation delay (time from handler completion to the next paint).\n\nTo optimize INP, you must address all three phases. Reduce input delay by keeping the main thread free — break up long tasks using scheduler.yield() or setTimeout, avoid heavy synchronous computations, and defer non-critical work. Reduce processing time by optimizing event handlers — avoid unnecessary DOM reads/writes, debounce high-frequency events, and use efficient algorithms. Reduce presentation delay by minimizing DOM mutations in handlers and avoiding forced reflows.\n\nCommon culprits for poor INP include third-party scripts that run long tasks, heavy JavaScript frameworks with expensive re-renders, synchronous localStorage or IndexedDB operations, complex CSS selectors that slow style recalculation, and unoptimized list rendering without virtualization.",
        shortAnswer:
          "INP measures the complete latency of user interactions (input delay + processing + paint), considering all interactions throughout the page visit. Good INP is under 200ms. It replaced FID, which only measured the delay before the first interaction handler started. Optimize by breaking long tasks, efficient handlers, and minimizing DOM mutations.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["inp", "fid", "responsiveness", "interaction"],
        commonMistakes: [
          "Confusing INP with FID — FID only measured input delay for the first interaction, not all interactions.",
          "Only optimizing the first interaction and ignoring subsequent ones — INP considers the entire page lifecycle.",
          "Not breaking up long tasks, causing high input delay when the main thread is busy.",
        ],
        followUps: [
          "How do you use scheduler.yield() to improve INP?",
          "What tools can identify which interactions have high latency?",
          "How does React concurrent rendering help with INP?",
        ],
        interviewTips: [
          "Explain the three components: input delay + processing time + presentation delay.",
          "Mention that INP replaced FID in 2024 to show you follow the latest standards.",
        ],
        relatedTopics: [
          "long tasks",
          "main thread optimization",
          "event handling",
        ],
      },
      {
        id: "browser-web-vitals-q3",
        question: "What is Cumulative Layout Shift (CLS) and what causes it?",
        answer:
          "Cumulative Layout Shift (CLS) measures the visual stability of a page by quantifying how much visible content unexpectedly shifts during the page lifecycle. A layout shift occurs when a visible element changes its position from one rendered frame to the next without user interaction triggering the change.\n\nCLS is calculated as the sum of individual layout shift scores, where each shift score is the product of the impact fraction (how much of the viewport was affected) and the distance fraction (how far the element moved). A good CLS score is under 0.1, needs improvement is between 0.1 and 0.25, and poor is above 0.25. CLS uses session windows: shifts that occur within 1 second of each other (and the window spans no more than 5 seconds total) are grouped together, and the largest session window is reported as the CLS value.\n\nThe most common causes of CLS are images and videos without explicit dimensions (the browser does not know the size until the resource loads, causing surrounding content to shift), dynamically injected content (ads, banners, cookie consent bars that push content down), web fonts that cause text to reflow when they load (FOUT — Flash of Unstyled Text), and late-loading third-party embeds or iframes.\n\nTo prevent CLS from images and video, always specify width and height attributes or use the CSS aspect-ratio property. For dynamically injected content, reserve space in the layout using min-height or placeholder containers. For web fonts, use font-display: optional (which avoids layout shift entirely by using fallback if the font is not already cached) or font-display: swap with carefully matched fallback font metrics using the CSS size-adjust property.\n\nAnother subtle cause of CLS is JavaScript that modifies the DOM in a way that shifts visible elements after the initial render. For example, a React hydration mismatch where the server-rendered HTML differs from the client-rendered output can cause the entire page to shift. Animations triggered by JavaScript should use transform (which does not affect layout) rather than properties like top, left, width, or height.",
        shortAnswer:
          "CLS measures unexpected visual shifts during page load. Good is under 0.1. Main causes: images without dimensions, dynamically injected content (ads, banners), font loading (FOUT), and late-loading embeds. Fixes include explicit dimensions, reserved placeholder space, font-display: optional, and using transform instead of layout properties.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["cls", "layout-shift", "visual-stability", "performance"],
        commonMistakes: [
          "Not setting explicit width and height on images, causing layout shifts when they load.",
          "Injecting banners or notifications above existing content without reserving space.",
          "Using font-display: swap without size-adjust on the fallback font, causing text reflow.",
          "Assuming CLS only happens during initial load — it is measured throughout the page lifecycle.",
        ],
        followUps: [
          "How do session windows work in CLS calculation?",
          "How can you use the Layout Instability API to debug CLS issues?",
          "What is the size-adjust CSS property and how does it help with CLS?",
        ],
        interviewTips: [
          "List the top causes and their solutions systematically.",
          "Mention the 0.1 threshold and that CLS is measured throughout the page lifecycle, not just during load.",
        ],
        relatedTopics: [
          "image optimization",
          "font loading",
          "layout stability",
        ],
      },
      {
        id: "browser-web-vitals-q4",
        question:
          "What are FCP and TTFB, and how do they relate to Core Web Vitals?",
        answer:
          "First Contentful Paint (FCP) and Time to First Byte (TTFB) are supplementary performance metrics that influence the Core Web Vitals but are not themselves Core Web Vitals. They measure the earliest stages of the page loading experience and serve as diagnostic indicators.\n\nFCP measures the time from navigation start to when the browser renders the first piece of content from the DOM — this could be text, an image, a non-white canvas, or an SVG. A good FCP is under 1.8 seconds, needs improvement is between 1.8 and 3 seconds, and poor is above 3 seconds. FCP is important because it represents the first visual feedback the user receives that the page is loading. It differs from LCP in that FCP captures any first content, while LCP captures the largest content element.\n\nTTFB measures the time from the start of the navigation request to when the first byte of the response is received by the browser. It includes DNS resolution, TCP connection, TLS handshake, and server processing time. A good TTFB is under 800 milliseconds. TTFB is entirely server-side and network-dependent — it is not affected by client-side JavaScript or rendering.\n\nTTFB directly impacts both FCP and LCP because the browser cannot start parsing HTML until the first byte arrives. A slow TTFB shifts the entire loading timeline forward. Similarly, FCP acts as a lower bound for LCP — the largest content cannot render before the first content does. Improving TTFB improves all subsequent metrics.\n\nTo optimize TTFB, use a CDN to serve content from edge locations close to the user, implement efficient server-side caching (Redis, Varnish), optimize backend processing (database queries, API calls), enable HTTP/2 or HTTP/3 for connection efficiency, and consider edge computing (Cloudflare Workers, Vercel Edge Functions) to run server logic closer to the user. For FCP specifically, eliminate render-blocking resources, inline critical CSS, use preload for key resources, and ensure the initial HTML contains meaningful content rather than an empty shell that waits for JavaScript.",
        shortAnswer:
          "FCP measures when the first content renders (good: <1.8s). TTFB measures when the first response byte arrives (good: <800ms). Neither are Core Web Vitals but directly impact LCP and overall loading. Optimize TTFB with CDNs and caching; optimize FCP by eliminating render-blocking resources and inlining critical CSS.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["fcp", "ttfb", "loading", "performance"],
        commonMistakes: [
          "Confusing FCP (first content) with LCP (largest content) — a page can have fast FCP but slow LCP.",
          "Ignoring TTFB optimization and focusing only on client-side performance.",
          "Not realizing that TTFB includes DNS, TCP, and TLS time, not just server processing.",
        ],
        followUps: [
          "How does a CDN reduce TTFB?",
          "What is the relationship between FCP and LCP on a typical page?",
        ],
        interviewTips: [
          "Position TTFB and FCP as diagnostic metrics that feed into Core Web Vitals, not as standalone goals.",
          "Mention specific thresholds to demonstrate you know the numbers, not just the concepts.",
        ],
        relatedTopics: [
          "LCP",
          "CDN",
          "server-side rendering",
          "critical rendering path",
        ],
      },
      {
        id: "browser-web-vitals-q5",
        question:
          "Scenario: Your production site has poor LCP (4.5s) and poor CLS (0.35). Walk through your debugging and optimization approach.",
        answer:
          'Debugging and optimizing poor Web Vitals scores requires a systematic approach that combines field data analysis, lab diagnostics, and targeted fixes. Here is how I would approach a site with 4.5s LCP and 0.35 CLS.\n\nFirst, I would analyze field data from Chrome User Experience Report (CrUX) or a real-user monitoring (RUM) tool to understand which pages and user segments are most affected. Field data reveals if the issue is universal or concentrated on specific pages, device types, or network conditions. I would check the PageSpeed Insights report for the affected URLs to get both field and lab data.\n\nFor LCP (4.5s, target <2.5s), I would identify the LCP element on the affected pages using Chrome DevTools Performance panel or the web-vitals attribution build. Common findings include: the LCP element is an image that is not preloaded (fix: add <link rel="preload"> with fetchpriority="high"); the image is too large or in a legacy format (fix: serve WebP/AVIF with responsive srcset and proper sizing); render-blocking CSS or JavaScript delays painting (fix: inline critical CSS, defer non-critical scripts); slow TTFB shifts the entire timeline (fix: CDN, caching, edge rendering); the page is client-side rendered and waits for JavaScript before showing content (fix: implement SSR or SSG).\n\nFor CLS (0.35, target <0.1), I would use the Layout Instability API or Chrome DevTools Performance panel to identify which elements are shifting and when. Common findings include: images without dimensions (fix: add explicit width/height or aspect-ratio); late-loading ads or banners pushing content down (fix: reserve space with min-height placeholders); web fonts causing text reflow (fix: use font-display: optional or match fallback metrics with size-adjust); dynamic content injected above the fold after load (fix: reserve space or load below the fold).\n\nI would prioritize fixes by impact — typically the single largest contributor to each metric — implement changes, deploy to a staging environment, verify with Lighthouse and WebPageTest, then deploy to production and monitor field data over the next 28 days (CrUX data is aggregated over a 28-day window).',
        shortAnswer:
          "For poor LCP: identify the LCP element, preload it, optimize image format/size, inline critical CSS, reduce TTFB with CDN. For poor CLS: find shifting elements, add explicit image dimensions, reserve space for dynamic content, fix font loading. Use field data (CrUX/RUM) to identify affected pages, lab tools (Lighthouse/DevTools) to diagnose, and monitor improvements over 28 days.",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["debugging", "optimization", "lcp", "cls", "scenario"],
        commonMistakes: [
          "Optimizing based only on lab data (Lighthouse) without checking field data (CrUX) for real user impact.",
          "Applying blanket lazy-loading to all images, including the LCP image.",
          "Deploying fixes and expecting immediate CrUX improvement — the data is aggregated over 28 days.",
        ],
        followUps: [
          "How would you set up continuous Web Vitals monitoring?",
          "How do you prioritize which metric to optimize first?",
        ],
        interviewTips: [
          "Show a structured debugging approach: identify, diagnose, fix, verify, monitor.",
          "Distinguish between field data and lab data to demonstrate real-world performance debugging experience.",
        ],
        relatedTopics: ["Lighthouse", "CrUX", "RUM", "performance monitoring"],
      },
      {
        id: "browser-web-vitals-q6",
        question:
          "How do you measure Web Vitals in production using real user monitoring?",
        answer:
          "Measuring Web Vitals in production requires Real User Monitoring (RUM), which captures performance metrics from actual user sessions rather than synthetic tests. Lab tools like Lighthouse provide controlled measurements, but field data reflects the diverse conditions of real users — varying devices, network speeds, and geographic locations.\n\nThe web-vitals JavaScript library by Google is the standard way to capture Web Vitals in production. It provides callbacks for each metric (onLCP, onINP, onCLS, onFCP, onTTFB) that fire when the metric is finalized. The attribution build of the library provides additional diagnostic information, such as which element was the LCP element or which interaction caused the worst INP. The library is lightweight (under 2KB) and has no dependencies.\n\nWhen reporting metrics, use the navigator.sendBeacon() API or fetch with keepalive: true to ensure data is transmitted even when the user is navigating away or closing the tab. Batch metrics to reduce network requests, and include contextual data like the page URL, user agent, connection type (navigator.connection), and device memory (navigator.deviceMemory) to segment analysis.\n\nFor analytics integration, you can send metrics to any endpoint. Popular choices include Google Analytics (using the gtag() function), custom analytics dashboards backed by services like BigQuery or ClickHouse, and third-party RUM services like Datadog, New Relic, SpeedCurve, or Vercel Analytics. Chrome User Experience Report (CrUX) automatically collects Web Vitals from opted-in Chrome users and is available through the CrUX API, PageSpeed Insights, and BigQuery.\n\nWhen analyzing RUM data, always look at percentile distributions (especially the 75th percentile, which is what Google uses for ranking). Averages can be misleading because they hide the experience of users on slow connections or low-end devices. Segment data by page type, device category, geography, and connection type to identify specific areas for improvement. Set up alerting for regressions so you can catch performance degradation quickly after deploys.",
        shortAnswer:
          "Use the web-vitals library to capture metrics from real users and send them via sendBeacon or fetch with keepalive. Report to analytics services (GA, Datadog, custom dashboards). Analyze at the 75th percentile, segment by device/geography/page, and set up regression alerts. CrUX provides passive Chrome user data.",
        code: 'import { onLCP, onINP, onCLS } from "web-vitals/attribution";\n\ninterface MetricPayload {\n  name: string;\n  value: number;\n  rating: string;\n  page: string;\n  connection?: string;\n  deviceMemory?: number;\n  attribution?: Record<string, unknown>;\n}\n\nfunction reportMetric(metric: MetricPayload): void {\n  const body = JSON.stringify(metric);\n  if (navigator.sendBeacon) {\n    navigator.sendBeacon("/api/vitals", body);\n  } else {\n    fetch("/api/vitals", {\n      method: "POST",\n      body,\n      keepalive: true,\n      headers: { "Content-Type": "application/json" },\n    });\n  }\n}\n\nfunction getConnection(): string | undefined {\n  const nav = navigator as Record<string, unknown>;\n  const conn = nav.connection as Record<string, unknown> | undefined;\n  return conn?.effectiveType as string | undefined;\n}\n\nfunction getDeviceMemory(): number | undefined {\n  return (navigator as Record<string, unknown>).deviceMemory as number | undefined;\n}\n\nonLCP((metric) => {\n  reportMetric({\n    name: metric.name,\n    value: metric.value,\n    rating: metric.rating,\n    page: window.location.pathname,\n    connection: getConnection(),\n    deviceMemory: getDeviceMemory(),\n    attribution: metric.attribution as Record<string, unknown>,\n  });\n});\n\nonINP((metric) => {\n  reportMetric({\n    name: metric.name,\n    value: metric.value,\n    rating: metric.rating,\n    page: window.location.pathname,\n    connection: getConnection(),\n    deviceMemory: getDeviceMemory(),\n    attribution: metric.attribution as Record<string, unknown>,\n  });\n});\n\nonCLS((metric) => {\n  reportMetric({\n    name: metric.name,\n    value: metric.value,\n    rating: metric.rating,\n    page: window.location.pathname,\n    connection: getConnection(),\n    deviceMemory: getDeviceMemory(),\n    attribution: metric.attribution as Record<string, unknown>,\n  });\n});',
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "Browser",
        topicId: "browser-web-vitals-1",
        tags: ["rum", "monitoring", "analytics", "web-vitals-library"],
        commonMistakes: [
          "Using fetch without keepalive, causing metric reports to be cancelled on page navigation.",
          "Reporting only averages instead of percentile distributions, hiding poor experiences.",
          "Not including contextual data (device, connection type) in reports, making analysis difficult.",
        ],
        followUps: [
          "What is the difference between field data and lab data?",
          "How does CrUX collect and aggregate Web Vitals data?",
          "How would you set up performance budgets based on Web Vitals?",
        ],
        interviewTips: [
          "Mention the attribution build for diagnostic data beyond raw numbers.",
          "Emphasize percentile analysis (75th percentile) over averages.",
        ],
        relatedTopics: [
          "sendBeacon",
          "analytics",
          "CrUX",
          "performance budgets",
        ],
      },
    ],
  },
  {
    id: "browser-cookies-1",
    title: "Cookies",
    description:
      "Deep dive into HTTP cookies — attributes, security flags, SameSite policies, session vs persistent cookies, and the document.cookie API.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "cookies", "security", "authentication"],
    overview:
      "Cookies are small pieces of data sent by the server and stored by the browser, automatically included in subsequent requests to the same domain. They are the primary mechanism for session management, authentication, and user tracking on the web.",
    concepts: [
      "Cookie attributes (HttpOnly, Secure, SameSite, Domain, Path)",
      "Expires and Max-Age for cookie lifetime",
      "Session cookies vs persistent cookies",
      "Third-party cookies and tracking",
      "SameSite=Strict, Lax, and None",
      "Cookie size limits and count limits",
      "document.cookie API",
      "Cookie security best practices",
    ],
    relatedTopicIds: ["browser-cors-1", "browser-jwt-1", "browser-storage-1"],
    codeExamples: [
      {
        title: "Setting cookies with various attributes",
        code: '// Server-side (Express)\nres.cookie("session_id", "abc123", {\n  httpOnly: true,     // Not accessible via JavaScript\n  secure: true,       // Only sent over HTTPS\n  sameSite: "strict", // Not sent with cross-site requests\n  maxAge: 86400000,   // 1 day in milliseconds\n  path: "/",          // Available on all paths\n  domain: ".example.com", // Available on all subdomains\n});\n\n// Server-side via Set-Cookie header\n// Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/; Domain=.example.com',
        language: "typescript",
        explanation:
          "Demonstrates setting a secure session cookie with all recommended security attributes using Express and the equivalent raw Set-Cookie header.",
      },
      {
        title: "Client-side cookie management",
        code: '// Reading cookies (returns all cookies as a single string)\nconst allCookies: string = document.cookie;\n// "theme=dark; lang=en; promo_seen=true"\n\n// Setting a cookie from JavaScript\ndocument.cookie = "theme=dark; path=/; max-age=31536000; secure; samesite=lax";\n\n// Utility functions for cookie management\nfunction getCookie(name: string): string | null {\n  const match = document.cookie.match(\n    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\\[\\]\\\\/+^])/g, "\\\\$1") + "=([^;]*)")\n  );\n  return match ? decodeURIComponent(match[1]) : null;\n}\n\nfunction setCookie(name: string, value: string, days: number): void {\n  const maxAge = days * 86400;\n  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; secure; samesite=lax`;\n}\n\nfunction deleteCookie(name: string): void {\n  document.cookie = `${name}=; path=/; max-age=0`;\n}',
        language: "typescript",
        explanation:
          "The document.cookie API is string-based and unintuitive. Helper functions simplify getting, setting, and deleting cookies. Note that HttpOnly cookies are invisible to document.cookie.",
      },
    ],
    questions: [
      {
        id: "browser-cookies-q1",
        question:
          "Explain the key cookie attributes and their security implications.",
        answer:
          "Cookie attributes control how, when, and where cookies are sent and accessed. Understanding each attribute is critical for secure web development.\n\nHttpOnly prevents JavaScript from accessing the cookie via document.cookie. This is the most important security attribute for session cookies because it mitigates XSS attacks — even if an attacker injects a script, they cannot steal HttpOnly cookies. All authentication and session cookies should be HttpOnly.\n\nSecure ensures the cookie is only sent over HTTPS connections, never over plain HTTP. This prevents the cookie from being intercepted by network attackers (man-in-the-middle attacks). In modern browsers, cookies with SameSite=None are required to also have the Secure flag.\n\nSameSite controls whether the cookie is sent with cross-site requests. SameSite=Strict means the cookie is never sent with cross-site requests — not even when the user clicks a link from an external site to your domain. SameSite=Lax (the browser default) sends the cookie with top-level navigations (clicking a link) but not with cross-site subresource requests (images, iframes, AJAX). SameSite=None sends the cookie with all requests, including cross-site, and requires the Secure flag. Lax is the best default for most session cookies.\n\nDomain specifies which domains receive the cookie. If not set, the cookie is sent only to the exact domain that set it (not including subdomains). Setting Domain=.example.com makes the cookie available to example.com and all its subdomains (api.example.com, app.example.com). Path restricts the cookie to a specific URL path and its descendants.\n\nExpires sets an absolute expiration date (a Date string), while Max-Age sets a relative lifetime in seconds. If neither is set, the cookie is a session cookie that is deleted when the browser closes. Max-Age=0 deletes the cookie immediately. Max-Age takes precedence over Expires if both are set.",
        shortAnswer:
          "HttpOnly prevents JavaScript access (XSS protection). Secure ensures HTTPS-only transmission. SameSite controls cross-site sending (Strict/Lax/None). Domain sets which domains receive the cookie. Path limits to URL paths. Expires/Max-Age control lifetime. Session cookies (no expiry) are deleted when the browser closes.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cookies-1",
        tags: ["cookie-attributes", "httponly", "secure", "samesite"],
        commonMistakes: [
          "Not setting HttpOnly on session cookies, exposing them to XSS attacks.",
          "Using SameSite=None without the Secure flag, which modern browsers reject.",
          "Setting Domain too broadly, making cookies available to subdomains that should not have access.",
          "Confusing session cookies (no Expires/Max-Age) with sessionStorage — they are completely different mechanisms.",
        ],
        followUps: [
          "What is the default SameSite value in modern browsers?",
          "How does SameSite=Lax differ from Strict for user experience?",
          "When would you need SameSite=None?",
        ],
        interviewTips: [
          "Cover HttpOnly, Secure, and SameSite as the security trio for cookies.",
          "Give a practical recommendation: HttpOnly + Secure + SameSite=Lax for session cookies.",
        ],
        relatedTopics: ["XSS", "CSRF", "session management", "HTTPS"],
      },
      {
        id: "browser-cookies-q2",
        question:
          "What is the difference between session cookies and persistent cookies?",
        answer:
          'Session cookies and persistent cookies differ in their lifetime and how the browser manages their expiration. The distinction has implications for both user experience and security.\n\nSession cookies are created when no Expires or Max-Age attribute is set. They exist only in the browser memory and are automatically deleted when the browser session ends — typically when the user closes the browser (not just the tab). Session cookies are ideal for short-lived state that should not persist, such as shopping cart contents, CSRF tokens, or temporary authentication during a single browsing session.\n\nPersistent cookies have an explicit Expires date or Max-Age value. They are written to disk and survive browser restarts, system reboots, and power failures. They persist until their expiration time is reached or until the user or application explicitly deletes them. Persistent cookies are used for "remember me" functionality, user preferences (language, theme), analytics identifiers, and any data that should be available across sessions.\n\nFrom a security perspective, session cookies are generally safer because they have a shorter exposure window. If a user walks away from a shared computer and closes the browser, session cookies are gone. Persistent cookies remain on disk and could be accessed by the next user. However, the definition of "browser session end" is nuanced — many browsers have a "continue where I left off" feature that restores session cookies, effectively making them persistent.\n\nFor authentication, a common pattern combines both types: a short-lived session cookie for the active session and a persistent "remember me" cookie (with a longer Max-Age, like 30 days) that can generate a new session. The persistent cookie should have a separate, revocable token, so compromised refresh tokens can be invalidated server-side. Both cookies should be HttpOnly and Secure.',
        shortAnswer:
          'Session cookies have no Expires/Max-Age and are deleted when the browser closes. Persistent cookies have an explicit lifetime and survive restarts. Session cookies are safer on shared computers. A common auth pattern uses a session cookie for active sessions and a persistent cookie for "remember me" functionality.',
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cookies-1",
        tags: [
          "session-cookie",
          "persistent-cookie",
          "lifetime",
          "authentication",
        ],
        commonMistakes: [
          'Assuming session cookies are always deleted when the browser closes — "restore session" features can preserve them.',
          "Setting very long Max-Age values (like years) on authentication cookies without a server-side revocation mechanism.",
          "Confusing session cookies with sessionStorage — they are entirely different storage mechanisms.",
        ],
        followUps: [
          'How does the "restore session" browser feature affect session cookies?',
          'What is a secure pattern for implementing "remember me" functionality?',
        ],
        interviewTips: [
          "Clearly state the defining difference: presence or absence of Expires/Max-Age.",
          "Discuss the security trade-offs to show you think beyond just the technical definition.",
        ],
        relatedTopics: ["session management", "remember me", "cookie security"],
      },
      {
        id: "browser-cookies-q3",
        question:
          "What are third-party cookies and why are they being phased out?",
        answer:
          "Third-party cookies are cookies set by a domain different from the one the user is currently visiting. When you visit example.com and it loads an ad from ads.tracker.com, any cookies set by ads.tracker.com are third-party cookies. In contrast, cookies set by example.com itself are first-party cookies.\n\nThird-party cookies have been the backbone of online advertising and user tracking for decades. Ad networks use them to track users across multiple websites — when tracker.com sets a cookie on example.com, it can read that same cookie when the user visits another-site.com that also loads tracker.com resources. This enables cross-site user profiling, behavioral targeting, retargeting ads, and conversion tracking without the websites themselves sharing any data.\n\nThe phase-out of third-party cookies is driven by privacy concerns. Users generally do not realize they are being tracked across the web, and the data collection is opaque. Regulations like GDPR and CCPA have increased scrutiny on tracking practices. Safari (Intelligent Tracking Prevention) and Firefox (Enhanced Tracking Protection) have blocked third-party cookies by default since 2019-2020. Chrome, which dominates the browser market, has been developing the Privacy Sandbox initiative with alternative APIs that provide advertising functionality without cross-site tracking.\n\nThe Privacy Sandbox includes APIs like Topics (interest-based advertising without individual tracking), Attribution Reporting (conversion measurement without cross-site cookies), Protected Audience (remarketing in the browser without tracking), and CHIPS (Cookies Having Independent Partitioned State, which allows third-party cookies but partitioned per top-level site so they cannot be used for cross-site tracking).\n\nFor developers, the phase-out means rethinking authentication flows that rely on third-party cookies (like SSO across different domains), embedded content that needs authentication (iframes loading content from another domain), and payment or widget integrations that use cookies. The SameSite=None; Secure attribute is required for any legitimate cross-site cookie use, and developers should migrate to first-party alternatives (like token-based auth passed via headers) where possible.",
        shortAnswer:
          "Third-party cookies are set by domains other than the one the user visits, enabling cross-site tracking for advertising. They are being phased out for privacy reasons. Safari and Firefox already block them. Chrome is developing Privacy Sandbox alternatives (Topics, Attribution Reporting, CHIPS). Developers should migrate to first-party alternatives.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cookies-1",
        tags: ["third-party-cookies", "privacy", "tracking", "privacy-sandbox"],
        commonMistakes: [
          "Thinking all cross-domain cookies are blocked — only third-party contexts are affected; first-party cookies remain.",
          "Not preparing SSO and embedded authentication flows for the third-party cookie phase-out.",
          "Confusing first-party and third-party — the distinction depends on context, not who owns the domain.",
        ],
        followUps: [
          "What is CHIPS and how does it partition cookies?",
          "How will SSO flows work without third-party cookies?",
          "What is the Storage Access API?",
        ],
        interviewTips: [
          "Explain the first-party vs third-party distinction based on context, not domain ownership.",
          "Mention the Privacy Sandbox by name to show awareness of the Chrome team approach.",
        ],
        relatedTopics: ["privacy", "advertising", "GDPR", "SameSite"],
      },
      {
        id: "browser-cookies-q4",
        question:
          "How does the SameSite attribute protect against CSRF attacks?",
        answer:
          "The SameSite cookie attribute is a defense mechanism against Cross-Site Request Forgery (CSRF) attacks by controlling when cookies are included in cross-site requests. CSRF exploits the fact that browsers automatically attach cookies to requests, allowing a malicious site to forge authenticated requests to a vulnerable site.\n\nIn a classic CSRF attack, a user is logged into bank.com (which stores a session cookie). They visit malicious.com, which contains a hidden form or image tag that triggers a request to bank.com/transfer?amount=10000&to=attacker. The browser automatically includes the bank.com session cookie with this request, and the server processes the transfer as if the user intentionally initiated it.\n\nSameSite=Strict provides the strongest CSRF protection. Cookies with this attribute are never sent with any cross-site request — not even when the user clicks a link from another site to your domain. While this eliminates CSRF entirely, it creates a UX issue: if a user clicks a link to your site from an email or social media, they arrive unauthenticated because the session cookie is not sent with the initial navigation.\n\nSameSite=Lax is the default in modern browsers and provides a practical balance. Cookies are sent with top-level navigations using safe methods (GET), so clicking a link from an external site preserves the session. However, cookies are not sent with cross-site subrequests (POST forms, iframes, AJAX, images). Since CSRF attacks typically use POST requests or hidden forms to trigger state-changing operations, Lax effectively blocks most CSRF vectors while maintaining good UX.\n\nSameSite=None disables SameSite protection entirely and requires the Secure flag. Cookies are sent with all cross-site requests. This is necessary for legitimate cross-site cookie use cases like third-party embeds, SSO iframes, and payment widgets. However, it provides no CSRF protection, so additional defenses (CSRF tokens, Origin header validation) are needed.\n\nSameSite is not a complete CSRF solution on its own. GET-based state-changing endpoints are still vulnerable with Lax, and older browsers that do not support SameSite fall back to sending cookies on all requests. A defense-in-depth approach combines SameSite with CSRF tokens, Origin/Referer header validation, and ensuring state-changing operations only use POST/PUT/DELETE.",
        shortAnswer:
          "SameSite controls cross-site cookie sending. Strict: never sent cross-site (strong CSRF protection but blocks links from external sites). Lax (default): sent only with top-level GET navigations (blocks most CSRF while preserving UX). None: always sent (no CSRF protection, requires Secure). Use Lax as default plus CSRF tokens for defense-in-depth.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cookies-1",
        tags: ["samesite", "csrf", "security", "cookies"],
        commonMistakes: [
          "Relying solely on SameSite for CSRF protection — GET-based state changes are still vulnerable with Lax.",
          "Using SameSite=Strict for general session cookies, causing poor UX when users arrive from external links.",
          "Not realizing that SameSite=Lax is now the browser default when no SameSite attribute is specified.",
        ],
        followUps: [
          "What additional CSRF defenses should be used alongside SameSite?",
          "How does the Origin header help prevent CSRF?",
        ],
        interviewTips: [
          "Describe a concrete CSRF attack scenario to contextualize the SameSite protection.",
          "Recommend Lax as the default and explain why Strict is often too restrictive for UX.",
        ],
        relatedTopics: [
          "CSRF",
          "session management",
          "same-site vs same-origin",
        ],
      },
      {
        id: "browser-cookies-q5",
        question: "What are the size and count limits for cookies?",
        answer:
          "Cookies have strict size and count limitations imposed by browsers, and exceeding these limits leads to silent data loss or cookie rejection. Understanding these constraints is important for designing robust cookie-based systems.\n\nThe size limit per individual cookie is approximately 4096 bytes (4KB), which includes the cookie name, value, and all attributes. This limit is defined in RFC 6265 and is enforced by all major browsers. If you attempt to set a cookie that exceeds 4KB, the browser silently discards it without throwing an error. This makes debugging oversized cookies particularly tricky.\n\nThe count limit per domain is typically around 50-180 cookies depending on the browser. Chrome allows approximately 180 cookies per domain, Firefox allows about 150, and Safari around 600. When the limit is exceeded, the browser evicts the least recently used cookies to make room for new ones. Again, this happens silently.\n\nThere is also a total cookie size limit per domain — typically around 80KB for all cookies combined. When the total size is exceeded, the browser may reject new cookies or evict old ones. Since all cookies for a domain are sent with every HTTP request in the Cookie header, excessive cookie data adds significant overhead to every request. A domain with 80KB of cookies adds 80KB to every single image, script, stylesheet, and API request.\n\nTo mitigate these limitations, keep cookies as small as possible. Store a session identifier in the cookie and keep the actual session data server-side. Use Web Storage or IndexedDB for larger client-side data that does not need to be sent to the server. For organizations with many cookies (analytics, A/B testing, marketing), consider consolidating multiple values into a single cookie using a custom encoding scheme.\n\nCookie-free domains are a performance optimization where static assets (images, CSS, JS) are served from a separate domain that has no cookies set on it, eliminating the overhead of sending cookies with every static resource request. This is less important with HTTP/2 header compression but still relevant for high-traffic sites.",
        shortAnswer:
          "Each cookie is limited to ~4KB (name + value + attributes). Browsers allow ~50-180 cookies per domain. Total cookie data per domain is ~80KB. Exceeding limits causes silent cookie rejection or eviction. Keep cookies small, store only identifiers, and use cookie-free domains for static assets.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-cookies-1",
        tags: ["cookie-limits", "size", "performance", "best-practices"],
        commonMistakes: [
          "Not realizing cookies are silently discarded when exceeding size limits — no error is thrown.",
          "Storing large amounts of data in cookies instead of using a session ID with server-side storage.",
          "Forgetting that all cookies are sent with every HTTP request, impacting performance on every resource fetch.",
        ],
        followUps: [
          "What is a cookie-free domain and why is it used?",
          "How does HTTP/2 header compression affect cookie overhead?",
        ],
        interviewTips: [
          "Mention both the per-cookie limit (4KB) and the per-domain limit (count and total size).",
          "Discuss the performance impact of cookies on every request to show practical awareness.",
        ],
        relatedTopics: [
          "performance optimization",
          "session management",
          "HTTP headers",
        ],
      },
    ],
  },
  {
    id: "browser-jwt-1",
    title: "JWT",
    description:
      "Understand JSON Web Tokens — their structure, claims, encoding, storage strategies, refresh token patterns, and security considerations.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "jwt", "authentication", "security", "tokens"],
    overview:
      "JSON Web Tokens (JWT) are a compact, self-contained format for securely transmitting claims between parties. They are widely used for stateless authentication in web applications and APIs.",
    concepts: [
      "JWT structure (header.payload.signature)",
      "Base64URL encoding",
      "Standard claims (iss, exp, sub, aud, iat, nbf, jti)",
      "Stateless authentication",
      "Token storage strategies (HttpOnly cookie vs localStorage)",
      "Refresh tokens and token rotation",
      "Security concerns (XSS, CSRF, token theft)",
      "JWS vs JWE (signed vs encrypted)",
    ],
    relatedTopicIds: [
      "browser-cookies-1",
      "browser-storage-1",
      "browser-cors-1",
    ],
    codeExamples: [
      {
        title: "JWT structure and decoding",
        code: '// A JWT has three Base64URL-encoded parts: header.payload.signature\n// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIn0.signature\n\nfunction decodeJWT(token: string): { header: Record<string, unknown>; payload: Record<string, unknown> } {\n  const [headerB64, payloadB64] = token.split(".");\n  const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));\n  const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));\n  return { header, payload };\n}\n\nfunction isTokenExpired(token: string): boolean {\n  const { payload } = decodeJWT(token);\n  const exp = payload.exp as number | undefined;\n  if (!exp) return false;\n  return Date.now() >= exp * 1000;\n}',
        language: "typescript",
        explanation:
          "JWTs can be decoded (not verified) on the client to read claims like expiration. Verification requires the secret/key and should only happen server-side.",
      },
      {
        title: "Refresh token pattern with Fetch",
        code: 'let accessToken: string | null = null;\n\nasync function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {\n  if (!accessToken || isTokenExpired(accessToken)) {\n    await refreshAccessToken();\n  }\n\n  const response = await fetch(url, {\n    ...options,\n    headers: {\n      ...options.headers,\n      Authorization: `Bearer ${accessToken}`,\n    },\n  });\n\n  if (response.status === 401) {\n    await refreshAccessToken();\n    return fetch(url, {\n      ...options,\n      headers: {\n        ...options.headers,\n        Authorization: `Bearer ${accessToken}`,\n      },\n    });\n  }\n\n  return response;\n}\n\nasync function refreshAccessToken(): Promise<void> {\n  const response = await fetch("/api/auth/refresh", {\n    method: "POST",\n    credentials: "include", // sends refresh token cookie\n  });\n  if (!response.ok) {\n    window.location.href = "/login";\n    return;\n  }\n  const data = await response.json() as { accessToken: string };\n  accessToken = data.accessToken;\n}',
        language: "typescript",
        explanation:
          "Demonstrates a common pattern: short-lived access token in memory, long-lived refresh token in an HttpOnly cookie. The access token is refreshed automatically when it expires.",
      },
    ],
    questions: [
      {
        id: "browser-jwt-q1",
        question: "Explain the structure of a JWT and what each part contains.",
        answer:
          'A JSON Web Token (JWT) consists of three parts separated by dots: header, payload, and signature. Each part is Base64URL-encoded, making the token URL-safe and compact for transmission in HTTP headers or URL parameters.\n\nThe header is a JSON object that typically contains two fields: alg (the signing algorithm, such as HS256 for HMAC-SHA256 or RS256 for RSA-SHA256) and typ (the token type, always "JWT"). The header tells the receiving party how to verify the signature. Example: {"alg": "HS256", "typ": "JWT"} encodes to eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\n\nThe payload contains the claims — statements about the entity (usually the user) and additional metadata. Claims are categorized as registered claims (standardized names defined in RFC 7519), public claims (custom names registered with IANA or using collision-resistant namespaces), and private claims (application-specific names agreed upon between parties). Key registered claims include: sub (subject — typically the user ID), iss (issuer — who created the token), aud (audience — who the token is intended for), exp (expiration — Unix timestamp after which the token is invalid), iat (issued at — when the token was created), nbf (not before — token is not valid before this time), and jti (JWT ID — unique identifier for the token, useful for revocation).\n\nThe signature is created by taking the encoded header, encoded payload, and a secret key, then applying the specified algorithm. For HS256: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret). For RS256, the server signs with a private key and consumers verify with the corresponding public key. The signature ensures the token has not been tampered with — any modification to the header or payload invalidates the signature.\n\nImportantly, the header and payload are only encoded (Base64URL), not encrypted. Anyone can decode and read the contents of a JWT without any key. The signature only provides integrity (tamper detection) and authentication (proof of origin), not confidentiality. If the payload contains sensitive data that must be hidden, use JWE (JSON Web Encryption) instead of JWS (JSON Web Signature).',
        shortAnswer:
          "A JWT has three Base64URL-encoded parts separated by dots: the header (algorithm and type), the payload (claims like sub, exp, iss, aud), and the signature (HMAC or RSA hash of header + payload + secret). The payload is readable by anyone — JWTs provide integrity and authentication, not confidentiality.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-jwt-1",
        tags: ["jwt-structure", "claims", "base64url", "signature"],
        commonMistakes: [
          "Thinking JWTs are encrypted — they are only encoded (Base64URL) and can be decoded by anyone.",
          "Storing sensitive data in the JWT payload without encryption, since it is readable by anyone who has the token.",
          "Not including the exp claim, creating tokens that never expire.",
          "Confusing Base64 with Base64URL — JWT uses Base64URL which replaces + with - and / with _.",
        ],
        followUps: [
          "What is the difference between JWS and JWE?",
          "When would you use RS256 vs HS256?",
          "How do you validate a JWT on the server?",
        ],
        interviewTips: [
          "Walk through each part (header, payload, signature) with a concrete example.",
          "Explicitly state that JWTs are not encrypted to show you understand the security model.",
        ],
        relatedTopics: [
          "Base64URL encoding",
          "HMAC",
          "RSA",
          "token validation",
        ],
      },
      {
        id: "browser-jwt-q2",
        question:
          "Where should you store JWTs on the client — localStorage or HttpOnly cookies?",
        answer:
          "The storage location for JWTs is one of the most debated topics in front-end security, and both approaches have trade-offs. The choice depends on your threat model, architecture, and the types of attacks you prioritize defending against.\n\nStoring the JWT in localStorage is simple and works well with single-page applications (SPAs). The token is easily accessible to JavaScript for attaching to API requests via the Authorization header. However, localStorage is vulnerable to XSS attacks — any JavaScript running on the page (including injected scripts from XSS vulnerabilities or compromised third-party packages) can read the token and exfiltrate it to an attacker server. Once stolen, the attacker can use the token from anywhere until it expires.\n\nStoring the JWT in an HttpOnly cookie removes the XSS risk because JavaScript cannot access HttpOnly cookies. The browser automatically attaches the cookie to requests to the cookie domain, eliminating the need for manual token management. However, this approach introduces CSRF vulnerability because the browser sends cookies automatically with all requests to the domain, including forged requests from malicious sites. CSRF can be mitigated with SameSite=Lax/Strict and CSRF tokens.\n\nThe recommended approach for most applications is a hybrid pattern: store the refresh token in an HttpOnly, Secure, SameSite=Strict cookie and keep the short-lived access token only in memory (a JavaScript variable, not localStorage or sessionStorage). The access token is used for API calls via the Authorization header and has a short lifespan (5-15 minutes). When it expires, the client calls a refresh endpoint that reads the HttpOnly refresh token cookie and issues a new access token. If the page is refreshed, the access token is gone (it was only in memory), so the client silently refreshes it on startup.\n\nThis pattern minimizes both XSS and CSRF risk: the access token is not in storage (XSS cannot steal it from a variable without active, real-time access), and the refresh token is in an HttpOnly cookie protected by SameSite (CSRF cannot forge the specific refresh endpoint request with custom headers). Token rotation (issuing a new refresh token with each refresh) adds another layer of security by making stolen refresh tokens single-use.",
        shortAnswer:
          "localStorage is vulnerable to XSS; HttpOnly cookies are vulnerable to CSRF. The recommended pattern: store the refresh token in an HttpOnly/Secure/SameSite cookie and keep the short-lived access token in memory only. On page refresh, silently obtain a new access token via the refresh endpoint.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-jwt-1",
        tags: ["token-storage", "security", "httponly", "xss", "csrf"],
        commonMistakes: [
          "Storing long-lived JWTs in localStorage without considering XSS risk.",
          "Keeping the access token in sessionStorage thinking it is safe — sessionStorage is still accessible to JavaScript and vulnerable to XSS.",
          "Not implementing token rotation for refresh tokens, allowing a stolen refresh token to be used indefinitely.",
        ],
        followUps: [
          "How does the in-memory token pattern handle page refreshes?",
          "What is refresh token rotation?",
          "How do you implement silent token refresh?",
        ],
        interviewTips: [
          "Present both sides (localStorage vs cookies) with their specific vulnerabilities before recommending the hybrid approach.",
          "Mentioning the in-memory access token + HttpOnly refresh token pattern shows real-world security expertise.",
        ],
        relatedTopics: ["XSS", "CSRF", "refresh tokens", "session management"],
      },
      {
        id: "browser-jwt-q3",
        question: "What are refresh tokens and how does token rotation work?",
        answer:
          "Refresh tokens are long-lived credentials used to obtain new access tokens without requiring the user to re-authenticate. They solve the tension between security (short-lived access tokens) and user experience (not forcing frequent logins).\n\nThe typical flow works as follows: the user logs in and receives both an access token (short-lived, 5-15 minutes) and a refresh token (long-lived, days to weeks). The access token is used for API requests. When the access token expires, the client sends the refresh token to a dedicated refresh endpoint, which validates the refresh token and returns a new access token. The user never sees a login prompt as long as their refresh token is valid.\n\nRefresh token rotation is a security enhancement where the server issues a new refresh token with every token refresh, invalidating the old one. This means each refresh token can only be used once. If an attacker steals a refresh token and tries to use it after the legitimate user has already used it, the server detects the reuse of an invalidated token and can immediately revoke the entire token family (all tokens derived from the original login), forcing the user to re-authenticate.\n\nThe server typically stores refresh tokens (or their hashes) in a database with a token family identifier. When a refresh token is used, the server checks if it has already been used. If it has, this indicates a potential token theft (either the legitimate user or the attacker already used it), and the server revokes all tokens in the family as a precaution.\n\nRefresh tokens should always be stored in HttpOnly cookies, never in localStorage. They should have an absolute expiration (e.g., 7 days) beyond which the user must log in again, regardless of activity. Idle timeout can also be implemented by tracking the last use time and revoking tokens that have not been used within a period. For mobile applications, refresh tokens may have longer lifetimes (30-90 days) due to different UX expectations.",
        shortAnswer:
          "Refresh tokens are long-lived credentials that obtain new short-lived access tokens. Token rotation issues a new refresh token with every refresh, invalidating the previous one. If a reused (invalidated) token is detected, the entire token family is revoked. Store refresh tokens in HttpOnly cookies with absolute expiration.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-jwt-1",
        tags: ["refresh-token", "token-rotation", "authentication", "security"],
        commonMistakes: [
          "Not implementing token rotation, allowing stolen refresh tokens to be used indefinitely.",
          "Storing refresh tokens in localStorage where they are vulnerable to XSS.",
          "Not setting an absolute expiration on refresh tokens, creating permanent sessions.",
          "Not revoking the entire token family when reuse is detected.",
        ],
        followUps: [
          "How do you handle concurrent requests that all try to refresh the token at the same time?",
          "What database schema would you use for refresh token storage?",
        ],
        interviewTips: [
          "Explain the reuse detection mechanism — it is the key security benefit of rotation.",
          "Mention absolute expiration and idle timeout as complementary controls.",
        ],
        relatedTopics: ["OAuth 2.0", "session management", "token revocation"],
      },
      {
        id: "browser-jwt-q4",
        question: "What are the security vulnerabilities of JWTs?",
        answer:
          'JWTs have several well-known security vulnerabilities that developers must understand and mitigate. These range from implementation mistakes to fundamental design trade-offs of stateless tokens.\n\nThe "none" algorithm attack occurs when an attacker modifies the JWT header to set alg: "none" and removes the signature. Some JWT libraries accept unsigned tokens when the algorithm is set to "none," effectively bypassing authentication. This is prevented by explicitly allowlisting accepted algorithms in the verification configuration and never accepting alg: "none".\n\nAlgorithm confusion (key confusion) attacks exploit libraries that automatically detect the algorithm from the token header. An attacker can change the algorithm from RS256 (asymmetric, uses public/private keys) to HS256 (symmetric, uses a shared secret) and sign the token with the server public key (which is often publicly available). The server then verifies the HS256 signature using the public key as the HMAC secret, and the validation passes. This is prevented by configuring the server to only accept the expected algorithm, never letting the token dictate the algorithm.\n\nToken theft is a fundamental risk. Since JWTs are bearer tokens, anyone who possesses the token can use it. If an access token is stolen (via XSS, man-in-the-middle, log files, or URL parameters), the attacker can impersonate the user until the token expires. Mitigation includes short expiration times, HttpOnly cookie storage, HTTPS-only transmission, and avoiding putting tokens in URLs.\n\nStateless revocation is inherently difficult. Once a JWT is issued, it remains valid until it expires. You cannot revoke a specific JWT without introducing server-side state (a revocation list or database check), which partially defeats the purpose of stateless tokens. For scenarios requiring immediate revocation (account compromise, permission changes), a short access token lifetime (5-15 minutes) limits the exposure window, and the refresh token (stored server-side) can be revoked immediately.\n\nPayload exposure is another consideration. JWT payloads are Base64URL-encoded, not encrypted. Any intermediary (browser extensions, proxies, logs) that captures the token can read its contents. Sensitive data should never be placed in the payload unless JWE (encryption) is used.',
        shortAnswer:
          'Key JWT vulnerabilities: the "none" algorithm attack (bypassing signatures), algorithm confusion attacks (RS256 to HS256), token theft (bearer tokens usable by anyone), inability to revoke tokens (stateless = no invalidation), and payload exposure (encoded, not encrypted). Mitigate with strict algorithm validation, short expiry, HttpOnly storage, and HTTPS.',
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-jwt-1",
        tags: [
          "jwt-security",
          "vulnerabilities",
          "none-algorithm",
          "token-theft",
        ],
        commonMistakes: [
          "Trusting the alg field in the JWT header instead of configuring accepted algorithms server-side.",
          "Setting excessively long expiration times on access tokens, increasing the window for stolen token misuse.",
          "Putting sensitive data in JWT payloads without encryption.",
          "Relying on client-side JWT validation for security — always validate on the server.",
        ],
        followUps: [
          "How would you implement JWT revocation?",
          "What is the difference between JWS and JWE?",
          "How do you prevent algorithm confusion attacks?",
        ],
        interviewTips: [
          "Cover the none algorithm and algorithm confusion attacks — they are well-known and interviewers expect candidates to know them.",
          "Discuss the stateless revocation trade-off to show you understand the fundamental limitation of JWTs.",
        ],
        relatedTopics: [
          "XSS",
          "CSRF",
          "token revocation",
          "algorithm security",
        ],
      },
      {
        id: "browser-jwt-q5",
        question:
          "How does stateless authentication with JWT compare to session-based authentication?",
        answer:
          'Session-based and JWT-based authentication represent two fundamentally different approaches to managing user identity in web applications, each with distinct advantages and trade-offs.\n\nIn session-based authentication, the server creates a session record (in memory, a database, or a cache like Redis) when the user logs in and sends back a session ID as a cookie. Every subsequent request includes this session ID, and the server looks up the full session data server-side. The session ID itself carries no information — it is simply a random identifier that maps to server-stored state.\n\nIn JWT-based (stateless) authentication, the server encodes the user identity and claims directly into a signed token. The token carries all necessary information (user ID, roles, permissions, expiration), so the server does not need to look up any session store. It simply verifies the token signature and reads the claims. This is why JWTs are called "self-contained" or "stateless."\n\nJWT advantages include horizontal scalability (any server can validate the token without shared session storage), suitability for microservices (each service independently verifies the token using the public key), reduced database load (no session lookup per request), and cross-domain capability (tokens can be used across different domains and services).\n\nSession-based advantages include immediate revocation (delete the session record to instantly invalidate), smaller request size (a short session ID vs a potentially large JWT), server-controlled state (the server has full control over session data and can update it without issuing new tokens), and simpler security model (session IDs in HttpOnly cookies are well-understood and have fewer attack vectors than JWTs).\n\nIn practice, most production applications use a hybrid approach. Short-lived JWTs serve as access tokens for stateless API authentication, providing the scalability benefits. A server-side refresh token store provides the revocation capability. This combines the best of both worlds: stateless request authentication with the ability to revoke sessions by invalidating refresh tokens.',
        shortAnswer:
          "JWTs are stateless (token carries all claims, no server-side lookup), enabling horizontal scaling and microservice auth. Sessions are stateful (server stores data, client has only an ID), enabling instant revocation and simpler security. Most production apps use a hybrid: stateless JWT access tokens with server-stored refresh tokens for revocation.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-jwt-1",
        tags: ["stateless-auth", "sessions", "comparison", "architecture"],
        commonMistakes: [
          "Claiming JWTs are always better than sessions — sessions have real advantages in simplicity and revocation.",
          "Not considering the token size overhead — JWTs with many claims can be significantly larger than a session ID.",
          "Implementing JWTs without a refresh token mechanism, losing the ability to revoke access.",
        ],
        followUps: [
          "How would you handle JWT authentication in a microservice architecture?",
          "What is the performance difference between session lookup and JWT verification?",
        ],
        interviewTips: [
          "Present both approaches fairly with pros and cons before recommending the hybrid approach.",
          "Mention that the choice depends on the architecture — monoliths often do fine with sessions, distributed systems benefit from JWTs.",
        ],
        relatedTopics: [
          "session management",
          "microservices",
          "horizontal scaling",
          "Redis",
        ],
      },
    ],
  },
  {
    id: "browser-xhr-fetch-1",
    title: "XHR and Fetch",
    description:
      "Compare XMLHttpRequest and the Fetch API, including promises vs callbacks, AbortController, streaming, and error handling patterns.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "fetch", "xhr", "api", "async"],
    overview:
      "XMLHttpRequest (XHR) and the Fetch API are the two browser-native mechanisms for making HTTP requests from JavaScript. Fetch is the modern replacement with a cleaner promise-based API, but understanding both is important for maintaining legacy code.",
    concepts: [
      "XMLHttpRequest lifecycle and events",
      "Fetch API and Promises",
      "AbortController for request cancellation",
      "Streaming responses with ReadableStream",
      "Error handling differences",
      "Request and response headers",
      "Interceptor patterns",
      "Progress tracking",
    ],
    relatedTopicIds: [
      "browser-http-1",
      "browser-cors-1",
      "browser-rest-graphql-1",
    ],
    codeExamples: [
      {
        title: "XHR vs Fetch comparison",
        code: '// XMLHttpRequest (callback-based)\nfunction xhrGet(url: string): Promise<unknown> {\n  return new Promise((resolve, reject) => {\n    const xhr = new XMLHttpRequest();\n    xhr.open("GET", url);\n    xhr.responseType = "json";\n    xhr.onload = () => {\n      if (xhr.status >= 200 && xhr.status < 300) {\n        resolve(xhr.response);\n      } else {\n        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));\n      }\n    };\n    xhr.onerror = () => reject(new Error("Network error"));\n    xhr.send();\n  });\n}\n\n// Fetch (promise-based)\nasync function fetchGet(url: string): Promise<unknown> {\n  const response = await fetch(url);\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n  }\n  return response.json();\n}',
        language: "typescript",
        explanation:
          "XHR uses callbacks and requires manual promise wrapping. Fetch returns a Promise natively but does not reject on HTTP error statuses — only on network failures.",
      },
      {
        title: "AbortController for request cancellation",
        code: 'const controller = new AbortController();\n\n// Cancel the request after 5 seconds\nconst timeoutId = setTimeout(() => controller.abort(), 5000);\n\ntry {\n  const response = await fetch("https://api.example.com/data", {\n    signal: controller.signal,\n  });\n  clearTimeout(timeoutId);\n  const data = await response.json();\n  console.log(data);\n} catch (error) {\n  if (error instanceof DOMException && error.name === "AbortError") {\n    console.log("Request was cancelled");\n  } else {\n    console.error("Request failed:", error);\n  }\n}',
        language: "typescript",
        explanation:
          "AbortController provides a standard way to cancel Fetch requests. It throws an AbortError that should be caught and handled separately from other errors.",
      },
    ],
    questions: [
      {
        id: "browser-xhr-fetch-q1",
        question:
          "What are the key differences between XMLHttpRequest and the Fetch API?",
        answer:
          "XMLHttpRequest (XHR) and the Fetch API are both browser-native mechanisms for making HTTP requests, but they differ significantly in their API design, error handling, feature set, and developer experience.\n\nThe most visible difference is the programming model. XHR uses an event-based callback pattern — you create an XMLHttpRequest object, configure it with open(), attach event handlers (onload, onerror, onprogress), and call send(). Fetch returns a Promise, integrating naturally with async/await syntax and Promise chaining. This makes Fetch code more readable and easier to compose with other asynchronous operations.\n\nError handling differs fundamentally. XHR fires the onerror event only for network-level failures (DNS resolution, connection refused). For HTTP error responses (404, 500), the onload event fires and you must check xhr.status manually. Fetch similarly does not reject the promise on HTTP errors — it only rejects on network failures or aborted requests. The response.ok property (true for status 200-299) must be checked explicitly. This catches many developers off guard who expect Fetch to throw on 404 or 500 responses.\n\nFetch has several capabilities that XHR lacks. It supports ReadableStream for streaming response bodies, allowing you to process data as it arrives rather than waiting for the entire response. It integrates with the Service Worker API, making it interceptable for caching and offline strategies. It uses the Request and Response objects, which are standard interfaces shared across the platform (Service Workers, Cache API).\n\nXHR has a few capabilities that Fetch lacks or handles differently. XHR supports upload progress tracking via xhr.upload.onprogress, which is essential for file upload progress bars. Fetch has no built-in upload progress API (you must use ReadableStream or fall back to XHR). XHR supports synchronous requests (though they are deprecated and block the main thread), while Fetch is always asynchronous.\n\nFor request cancellation, XHR has the xhr.abort() method built in. Fetch uses the external AbortController/AbortSignal API, which is more flexible (one signal can cancel multiple requests) but requires more setup.",
        shortAnswer:
          "Fetch uses promises (cleaner async/await), XHR uses callbacks. Both do not throw on HTTP errors (only network failures). Fetch supports streaming (ReadableStream) and Service Worker integration. XHR supports upload progress tracking. Fetch uses AbortController for cancellation; XHR has built-in abort(). Fetch is the modern standard.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-xhr-fetch-1",
        tags: ["xhr", "fetch", "comparison", "promises", "callbacks"],
        commonMistakes: [
          "Assuming Fetch rejects on HTTP 404 or 500 — it only rejects on network failures; check response.ok.",
          "Using XHR for new code when Fetch is available — Fetch is the modern standard.",
          "Not handling AbortError separately from other errors when using AbortController.",
          "Forgetting that XHR supports upload progress while Fetch does not have a built-in equivalent.",
        ],
        followUps: [
          "How would you implement upload progress tracking with Fetch?",
          "What is the role of Fetch in Service Workers?",
          "How do you implement request retries with Fetch?",
        ],
        interviewTips: [
          "Cover the promise vs callback difference, error handling, and the streaming capability of Fetch.",
          "Mention that Fetch does not reject on HTTP errors — this is a common interview gotcha.",
        ],
        relatedTopics: [
          "Promises",
          "AbortController",
          "Service Workers",
          "streaming",
        ],
      },
      {
        id: "browser-xhr-fetch-q2",
        question: "How does AbortController work and what are its use cases?",
        answer:
          'AbortController is a built-in browser API that provides a standardized mechanism for cancelling asynchronous operations, most commonly Fetch requests. It consists of two parts: the AbortController instance (which provides the abort() method) and the AbortSignal (which communicates the cancellation to the operation).\n\nTo use AbortController with Fetch, you create an AbortController instance and pass its signal property to the Fetch options. When you call controller.abort(), the Fetch request is cancelled, and the promise rejects with an AbortError (a DOMException with name "AbortError"). Any response body streaming in progress is also terminated.\n\nThe primary use cases include request timeouts (aborting requests that take too long), component unmount cleanup (cancelling in-flight requests when a React component unmounts to prevent state updates on unmounted components), search-as-you-type (cancelling the previous search request when the user types a new character), and race conditions (ensuring only the latest request result is used when multiple requests are fired).\n\nA single AbortSignal can be shared across multiple Fetch requests, cancelling them all with a single abort() call. This is useful for page transitions or component teardowns where multiple API calls need to be cleaned up simultaneously. The AbortSignal.timeout() static method (available in modern browsers) creates a signal that automatically aborts after a specified duration, simplifying timeout implementations.\n\nAbortController also works beyond Fetch. It can be used with addEventListener (passing the signal option to automatically remove the listener when aborted), with ReadableStream operations, and with any custom asynchronous operation that accepts an AbortSignal. Libraries like Axios also support AbortController/AbortSignal for request cancellation.',
        shortAnswer:
          "AbortController provides a standard way to cancel Fetch requests and other async operations. Create a controller, pass its signal to Fetch, and call abort() to cancel. Use cases include timeouts, component unmount cleanup, search debouncing, and race condition prevention. One signal can cancel multiple requests.",
        code: '// Cancel previous request on new search input\nlet currentController: AbortController | null = null;\n\nasync function search(query: string): Promise<unknown[]> {\n  // Cancel any in-flight request\n  currentController?.abort();\n  currentController = new AbortController();\n\n  try {\n    const response = await fetch(\n      `/api/search?q=${encodeURIComponent(query)}`,\n      { signal: currentController.signal }\n    );\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return response.json() as Promise<unknown[]>;\n  } catch (error) {\n    if (error instanceof DOMException && error.name === "AbortError") {\n      return []; // Request was cancelled, return empty\n    }\n    throw error; // Re-throw real errors\n  }\n}\n\n// Timeout using AbortSignal.timeout()\nasync function fetchWithTimeout(url: string, ms: number): Promise<Response> {\n  return fetch(url, { signal: AbortSignal.timeout(ms) });\n}\n\n// React cleanup pattern\n// useEffect(() => {\n//   const controller = new AbortController();\n//   fetchData(controller.signal);\n//   return () => controller.abort();\n// }, [dependency]);',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-xhr-fetch-1",
        tags: ["abort-controller", "cancellation", "timeout", "fetch"],
        commonMistakes: [
          "Not catching AbortError, causing unhandled promise rejections in the console.",
          "Creating a new AbortController for every request but not aborting the previous one in search-as-you-type scenarios.",
          "Forgetting to clean up AbortController in React useEffect, causing memory leaks and state-update-on-unmounted-component warnings.",
        ],
        followUps: [
          "How does AbortSignal.any() combine multiple signals?",
          "Can you use AbortController with addEventListener?",
        ],
        interviewTips: [
          "Give a practical example like search-as-you-type to demonstrate real-world usage.",
          "Mention the React cleanup pattern to show you handle component lifecycle properly.",
        ],
        relatedTopics: ["race conditions", "React hooks", "async cleanup"],
      },
      {
        id: "browser-xhr-fetch-q3",
        question: "How do you handle streaming responses with the Fetch API?",
        answer:
          "The Fetch API provides native support for streaming response bodies through the ReadableStream interface. Instead of waiting for the entire response to download before processing it, you can read and process chunks as they arrive, enabling lower memory usage and faster time-to-first-data.\n\nThe response.body property is a ReadableStream that can be consumed incrementally. You obtain a reader by calling response.body.getReader(), which returns a ReadableStreamDefaultReader. The reader read() method returns a promise that resolves with an object containing a value (a Uint8Array chunk) and a done flag. You loop until done is true, processing each chunk as it arrives.\n\nThis pattern is particularly valuable for several use cases. Large file downloads can be processed or displayed incrementally. Server-Sent Events can be implemented manually when the EventSource API is too limited. Streaming JSON APIs (newline-delimited JSON or JSON streaming from AI services) can be parsed and displayed in real time. Large dataset transfers can be processed without buffering the entire response in memory.\n\nFor text-based streaming, the TextDecoderStream (or manual TextDecoder) converts Uint8Array chunks into string chunks. For newline-delimited JSON, you accumulate text until you find a newline, then parse each complete line as JSON.\n\nOne important caveat is that response.json(), response.text(), and similar convenience methods consume the stream entirely — you cannot use them and also read the stream manually. If you need to both stream and get the full body, you must use the tee() method to split the stream into two independent branches.\n\nFetch streaming is also available in Service Workers, where you can create synthetic streaming responses using the ReadableStream constructor. This enables server-push-like patterns where the Service Worker starts returning cached content immediately while fetching fresh content in the background.",
        shortAnswer:
          "Fetch response.body is a ReadableStream. Use getReader() to read chunks incrementally via the read() method. Convert chunks to text with TextDecoder. Use cases include large downloads, streaming AI responses, and NDJSON parsing. Consuming the body with .json() or .text() prevents manual streaming.",
        code: 'async function streamResponse(url: string): Promise<string> {\n  const response = await fetch(url);\n  if (!response.ok || !response.body) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n\n  const reader = response.body.getReader();\n  const decoder = new TextDecoder();\n  let result = "";\n\n  while (true) {\n    const { done, value } = await reader.read();\n    if (done) break;\n\n    const chunk = decoder.decode(value, { stream: true });\n    result += chunk;\n    console.log("Received chunk:", chunk.length, "bytes");\n  }\n\n  return result;\n}\n\n// Streaming NDJSON (newline-delimited JSON)\nasync function streamNDJSON(\n  url: string,\n  onItem: (item: Record<string, unknown>) => void\n): Promise<void> {\n  const response = await fetch(url);\n  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);\n\n  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();\n  let buffer = "";\n\n  while (true) {\n    const { done, value } = await reader.read();\n    if (done) break;\n\n    buffer += value;\n    const lines = buffer.split("\\n");\n    buffer = lines.pop() ?? "";\n\n    for (const line of lines) {\n      if (line.trim()) {\n        onItem(JSON.parse(line));\n      }\n    }\n  }\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Browser",
        topicId: "browser-xhr-fetch-1",
        tags: ["streaming", "readable-stream", "fetch", "ndjson"],
        commonMistakes: [
          "Calling response.json() or response.text() before trying to read the stream — these methods consume the body.",
          "Not handling the TextDecoder stream option correctly, causing multi-byte characters to be split across chunks.",
          "Forgetting that ReadableStream is not available in older browsers and may need a polyfill.",
        ],
        followUps: [
          "How do you implement upload streaming with Fetch?",
          "What is the difference between ReadableStream and WritableStream?",
        ],
        interviewTips: [
          "Demonstrate the basic reader loop pattern: getReader, read in a while loop, check done flag.",
          "Mention practical use cases like streaming AI responses to show real-world relevance.",
        ],
        relatedTopics: ["ReadableStream", "TextDecoder", "Service Workers"],
      },
      {
        id: "browser-xhr-fetch-q4",
        question:
          "How would you build a Fetch wrapper with interceptors, retries, and error handling?",
        answer:
          "Building a robust Fetch wrapper involves implementing request/response interceptors, automatic retry logic, consistent error handling, and timeout support. This pattern is common in production applications and mirrors what libraries like Axios provide out of the box.\n\nRequest interceptors run before each request and can modify the request configuration — adding authentication headers, logging, or transforming the body. Response interceptors run after each response and can handle global error patterns — refreshing tokens on 401, logging errors, or transforming response data. The interceptor chain pattern allows composing multiple interceptors in order.\n\nRetry logic should handle transient failures (network errors, 503 Service Unavailable, 429 Too Many Requests) with exponential backoff and a maximum retry count. The 429 status often includes a Retry-After header that specifies when to retry. Network errors (fetch rejection) are always retryable, while 4xx client errors (except 429) are generally not.\n\nError handling should normalize the various failure modes (network error, HTTP error, JSON parse error, timeout) into a consistent error type that calling code can handle uniformly. Each error should carry the HTTP status (if available), the response body (if available), and the original request information for debugging.\n\nTimeout support can be implemented using AbortSignal.timeout() in modern browsers or by creating an AbortController with a setTimeout. The timeout should be configurable per request but have a sensible default.\n\nThis wrapper pattern centralizes cross-cutting concerns, reducing duplication across the application. Every API call benefits from consistent token attachment, error logging, retry behavior, and timeout handling without each call site needing to implement these independently.",
        shortAnswer:
          "A Fetch wrapper adds interceptors (modify requests/responses globally), retries with exponential backoff (for transient failures like 503/429), consistent error normalization, and timeout support via AbortController. This centralizes auth headers, error logging, and retry logic across all API calls.",
        code: 'interface FetchConfig extends RequestInit {\n  retries?: number;\n  retryDelay?: number;\n  timeout?: number;\n}\n\ntype Interceptor<T> = (value: T) => T | Promise<T>;\n\nclass HttpClient {\n  private baseURL: string;\n  private requestInterceptors: Interceptor<Request>[] = [];\n  private responseInterceptors: Interceptor<Response>[] = [];\n\n  constructor(baseURL: string) {\n    this.baseURL = baseURL;\n  }\n\n  onRequest(interceptor: Interceptor<Request>): void {\n    this.requestInterceptors.push(interceptor);\n  }\n\n  onResponse(interceptor: Interceptor<Response>): void {\n    this.responseInterceptors.push(interceptor);\n  }\n\n  async request<T>(path: string, config: FetchConfig = {}): Promise<T> {\n    const { retries = 3, retryDelay = 1000, timeout = 10000, ...init } = config;\n    const url = `${this.baseURL}${path}`;\n\n    let request = new Request(url, init);\n    for (const interceptor of this.requestInterceptors) {\n      request = await interceptor(request);\n    }\n\n    let lastError: Error | null = null;\n    for (let attempt = 0; attempt <= retries; attempt++) {\n      try {\n        let response = await fetch(request.clone(), {\n          signal: AbortSignal.timeout(timeout),\n        });\n\n        for (const interceptor of this.responseInterceptors) {\n          response = await interceptor(response);\n        }\n\n        if (!response.ok) {\n          if (attempt < retries && [503, 429].includes(response.status)) {\n            await this.delay(retryDelay * Math.pow(2, attempt));\n            continue;\n          }\n          throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n        }\n\n        return response.json() as Promise<T>;\n      } catch (error) {\n        lastError = error as Error;\n        if (error instanceof DOMException && error.name === "AbortError") {\n          throw new Error(`Request timeout after ${timeout}ms`);\n        }\n        if (attempt < retries) {\n          await this.delay(retryDelay * Math.pow(2, attempt));\n        }\n      }\n    }\n    throw lastError ?? new Error("Request failed");\n  }\n\n  private delay(ms: number): Promise<void> {\n    return new Promise((resolve) => setTimeout(resolve, ms));\n  }\n}\n\n// Usage\nconst api = new HttpClient("https://api.example.com");\n\napi.onRequest(async (req) => {\n  const token = getAccessToken();\n  if (token) {\n    const headers = new Headers(req.headers);\n    headers.set("Authorization", `Bearer ${token}`);\n    return new Request(req.url, { ...req, headers });\n  }\n  return req;\n});',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Browser",
        topicId: "browser-xhr-fetch-1",
        tags: ["fetch-wrapper", "interceptors", "retries", "error-handling"],
        commonMistakes: [
          "Retrying non-idempotent requests (POST) without considering side effects — duplicate resource creation.",
          "Not cloning the Request before retrying, as the body stream can only be consumed once.",
          "Implementing linear retry delays instead of exponential backoff, overwhelming the server.",
        ],
        followUps: [
          "How do you handle concurrent 401 responses to avoid multiple token refresh calls?",
          "How would you add request/response logging to the wrapper?",
        ],
        interviewTips: [
          "Mention the interceptor pattern and compare it to Axios interceptors to show you know the ecosystem.",
          "Discuss which status codes should and should not be retried.",
        ],
        relatedTopics: ["Axios", "exponential backoff", "token refresh"],
      },
      {
        id: "browser-xhr-fetch-q5",
        question: "Why does Fetch not reject on HTTP error status codes?",
        answer:
          "Fetch considers a request successful as long as the server responded, regardless of the HTTP status code. The promise returned by fetch() only rejects when the request itself cannot complete — network failures (offline, DNS resolution failure, CORS blocking), request abortion via AbortController, or other transport-level errors.\n\nThis design choice reflects the fact that HTTP error responses (4xx, 5xx) are valid HTTP communication. A 404 Not Found is a successful HTTP transaction — the server received the request, processed it, and responded with a meaningful status. The response may contain an error body with useful information (error messages, validation details). Rejecting the promise would lose easy access to this response data.\n\nThe response.ok property is a convenience boolean that is true when the status code is in the 200-299 range. Checking response.ok is the idiomatic way to handle HTTP errors with Fetch. A common pattern is to throw a custom error when response.ok is false, including the status code and response body in the error for debugging.\n\nThis behavior contrasts with libraries like Axios, which by default reject the promise for any status outside the 2xx range (configurable via validateStatus). Developers migrating from Axios to Fetch are often surprised when their catch blocks do not trigger on 404 or 500 responses.\n\nThe rationale also aligns with the lower-level nature of Fetch — it is a platform primitive that maps closely to the HTTP protocol rather than imposing opinions about what constitutes an error. Higher-level wrappers built on top of Fetch can implement their own error status handling according to application needs.",
        shortAnswer:
          "Fetch considers any server response (including 4xx/5xx) a successful network transaction and only rejects on network failures or abort. Use response.ok to check for HTTP success. This design choice preserves access to error response bodies and reflects that HTTP errors are valid protocol communication.",
        code: '// Common mistake: assuming this catches 404\ntry {\n  const response = await fetch("/api/nonexistent");\n  // This line RUNS even for 404 responses\n  const data = await response.json();\n} catch (error) {\n  // Only fires for network errors, NOT for 404\n}\n\n// Correct pattern: check response.ok\nasync function safeFetch<T>(url: string): Promise<T> {\n  const response = await fetch(url);\n\n  if (!response.ok) {\n    const errorBody = await response.text();\n    throw new Error(\n      `HTTP ${response.status} ${response.statusText}: ${errorBody}`\n    );\n  }\n\n  return response.json() as Promise<T>;\n}\n\n// Usage with proper error handling\ntry {\n  const user = await safeFetch<{ name: string }>("/api/user/123");\n  console.log(user.name);\n} catch (error) {\n  // Now catches both network errors AND HTTP errors\n  console.error("Request failed:", error);\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-xhr-fetch-1",
        tags: ["fetch", "error-handling", "response-ok", "promise"],
        commonMistakes: [
          "Wrapping Fetch in try-catch and assuming HTTP 4xx/5xx errors are caught — they are not.",
          "Not reading the error response body before throwing, losing valuable debugging information.",
          "Calling response.json() on error responses that may not contain JSON, causing a parse error.",
        ],
        followUps: [
          "How does Axios handle HTTP errors differently from Fetch?",
          "How would you create a typed error class for HTTP errors?",
        ],
        interviewTips: [
          "This is a very common interview question. Show you know that fetch only rejects on network errors.",
          "Present the response.ok pattern as the standard solution.",
        ],
        relatedTopics: ["Promise rejection", "error handling", "Axios"],
      },
    ],
  },
  {
    id: "browser-rest-graphql-1",
    title: "REST and GraphQL",
    description:
      "Compare REST and GraphQL API paradigms — principles, query structures, data fetching patterns, caching, and when to use each.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "rest", "graphql", "api", "architecture"],
    overview:
      "REST and GraphQL are two dominant API paradigms for client-server communication. REST uses resource-oriented URLs with HTTP methods, while GraphQL provides a typed query language that lets clients request exactly the data they need.",
    concepts: [
      "REST principles (stateless, resource-based, HTTP verbs)",
      "GraphQL queries, mutations, and subscriptions",
      "Over-fetching and under-fetching problems",
      "N+1 query problem",
      "Caching strategies for REST vs GraphQL",
      "Schema and type system in GraphQL",
      "When to choose REST vs GraphQL",
      "Error handling differences",
    ],
    relatedTopicIds: [
      "browser-http-1",
      "browser-xhr-fetch-1",
      "browser-websockets-1",
    ],
    codeExamples: [
      {
        title: "REST vs GraphQL data fetching comparison",
        code: '// REST: Multiple endpoints, potential over-fetching\n// GET /api/users/1 -> { id, name, email, avatar, bio, joinDate, ... }\n// GET /api/users/1/posts -> [{ id, title, body, date, ... }, ...]\n// GET /api/users/1/followers -> [{ id, name, ... }, ...]\n\n// Three HTTP requests, each returning more data than needed\n\n// GraphQL: Single request, exact data\nconst query = `\n  query GetUserProfile($id: ID!) {\n    user(id: $id) {\n      name\n      avatar\n      posts(limit: 5) {\n        title\n        date\n      }\n      followersCount\n    }\n  }\n`;\n\nconst response = await fetch("/graphql", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ query, variables: { id: "1" } }),\n});',
        language: "typescript",
        explanation:
          "REST requires multiple requests to different endpoints (under-fetching) and returns entire resource objects (over-fetching). GraphQL requests exactly the needed fields in a single query.",
      },
      {
        title: "GraphQL mutation example",
        code: 'const CREATE_POST_MUTATION = `\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      title\n      createdAt\n      author {\n        name\n      }\n    }\n  }\n`;\n\nasync function createPost(title: string, body: string): Promise<{ id: string; title: string }> {\n  const response = await fetch("/graphql", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({\n      query: CREATE_POST_MUTATION,\n      variables: {\n        input: { title, body },\n      },\n    }),\n  });\n\n  const result = await response.json() as {\n    data?: { createPost: { id: string; title: string } };\n    errors?: Array<{ message: string }>;\n  };\n\n  if (result.errors) {\n    throw new Error(result.errors[0].message);\n  }\n\n  return result.data!.createPost;\n}',
        language: "typescript",
        explanation:
          "GraphQL mutations modify data and can return the updated resource in a single operation. Errors are returned in the errors array alongside partial data.",
      },
    ],
    questions: [
      {
        id: "browser-rest-graphql-q1",
        question:
          "What are the core principles of REST and how do they apply to API design?",
        answer:
          "REST (Representational State Transfer) is an architectural style defined by Roy Fielding that uses a set of constraints to guide API design. Understanding these principles helps create predictable, scalable, and maintainable APIs.\n\nThe resource-based model is central to REST. Every entity is a resource identified by a unique URL (e.g., /users/123, /posts/456). Resources are manipulated using standard HTTP methods: GET retrieves a resource, POST creates a new resource, PUT replaces a resource, PATCH partially updates it, and DELETE removes it. This maps CRUD operations to HTTP verbs in a consistent, predictable way.\n\nStatelessness means each request must contain all the information the server needs to process it. The server does not store client session state between requests. Authentication tokens, pagination parameters, and any context must be sent with every request. This simplifies server architecture (any server can handle any request) and improves scalability.\n\nA uniform interface ensures consistency across the API. Resources should have consistent naming conventions (plural nouns for collections, e.g., /users, /posts), standard response formats (JSON with consistent error structures), proper use of HTTP status codes, and HATEOAS (Hypermedia as the Engine of Application State) — though few APIs implement full HATEOAS in practice.\n\nLayered system architecture means the client does not need to know whether it is communicating directly with the server or through intermediaries (load balancers, CDNs, caching proxies, API gateways). Each layer only interacts with the adjacent layer. This enables caching at multiple levels and infrastructure flexibility.\n\nCacheability is a key advantage of REST. HTTP caching headers (Cache-Control, ETag, Last-Modified) work naturally with GET requests because each URL represents a specific resource. Proxies, CDNs, and browsers can cache responses based on the URL and caching headers. This built-in caching mechanism is one of REST most significant advantages over GraphQL.",
        shortAnswer:
          "REST principles: resource-based URLs (/users/123), standard HTTP methods (GET, POST, PUT, DELETE), stateless requests, uniform interface with consistent naming and status codes, layered architecture, and cacheability via HTTP headers. Each resource has a unique URL, and HTTP verbs define the operations.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rest-graphql-1",
        tags: ["rest", "api-design", "http-methods", "architecture"],
        commonMistakes: [
          "Using verbs in URLs (POST /createUser) instead of nouns with HTTP methods (POST /users).",
          "Returning 200 for all responses and putting the actual status in the body instead of using proper HTTP status codes.",
          "Making endpoints that are not idempotent when they should be (e.g., PUT should be idempotent).",
        ],
        followUps: [
          "What is HATEOAS and do real-world APIs implement it?",
          "How do you handle nested resources in REST (e.g., posts by a user)?",
          "What is the Richardson Maturity Model?",
        ],
        interviewTips: [
          "Cover the key principles: resources, HTTP methods, statelessness, cacheability.",
          "Give concrete URL examples to illustrate resource-based design.",
        ],
        relatedTopics: ["HTTP methods", "API versioning", "caching"],
      },
      {
        id: "browser-rest-graphql-q2",
        question:
          "What are over-fetching and under-fetching, and how does GraphQL solve them?",
        answer:
          'Over-fetching and under-fetching are two of the most commonly cited problems with REST APIs, and they are the primary motivation for GraphQL existence.\n\nOver-fetching occurs when an API endpoint returns more data than the client needs. For example, a mobile app showing a user list only needs names and avatars, but the /users endpoint returns full user profiles with email, address, bio, settings, and other fields. The excess data wastes bandwidth (critical on mobile networks), increases memory usage on the client, and adds unnecessary serialization/deserialization overhead. REST endpoints are designed around resources, not views, so they often return the complete resource representation.\n\nUnder-fetching is the opposite problem — a single endpoint does not provide all the data the client needs, requiring multiple round trips. To display a user profile page with their posts and followers, a REST client might need to call /users/1, then /users/1/posts, then /users/1/followers — three sequential HTTP requests. Each round trip adds latency, and on slow networks, this significantly degrades the user experience. This is sometimes called the "waterfall" problem.\n\nGraphQL solves both problems with its query language. The client specifies exactly which fields it needs in each query, down to the individual field level. A single GraphQL request can traverse relationships (user -> posts -> comments -> author) and return a precise data shape that matches the UI requirements. No extra fields, no missing data, no extra round trips.\n\nHowever, GraphQL introduces its own trade-offs. The N+1 problem can occur on the server side when resolving nested fields — fetching 10 users and their posts might trigger 10 separate database queries. DataLoader (a batching and caching utility) is the standard solution. GraphQL also makes HTTP caching harder because all requests go to a single endpoint (typically POST /graphql) and caching based on URL does not work. Client-side caching libraries like Apollo and urql implement normalized caches to address this.\n\nFor simple APIs with well-defined resource boundaries and few clients, REST can avoid over/under-fetching by offering query parameters for field selection (e.g., ?fields=name,avatar) or creating client-specific endpoints. For complex APIs serving diverse clients (web, mobile, third-party), GraphQL flexibility in data fetching is a significant advantage.',
        shortAnswer:
          "Over-fetching: REST returns more data than needed. Under-fetching: one endpoint lacks all required data, requiring multiple requests. GraphQL solves both by letting clients specify exact fields in a single query. Trade-offs: GraphQL introduces N+1 server-side problems and complicates HTTP caching.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rest-graphql-1",
        tags: ["over-fetching", "under-fetching", "graphql", "data-fetching"],
        commonMistakes: [
          "Assuming GraphQL automatically solves the N+1 problem — it only addresses client-side over/under-fetching; server-side N+1 requires DataLoader.",
          "Not considering that REST APIs can mitigate over-fetching with sparse fieldsets or client-specific endpoints.",
          "Thinking GraphQL is always better than REST — for simple, well-defined APIs, REST can be more appropriate.",
        ],
        followUps: [
          "What is DataLoader and how does it solve the N+1 problem?",
          "How can REST APIs implement field selection?",
        ],
        interviewTips: [
          "Define both problems clearly with concrete examples before explaining GraphQL solution.",
          "Acknowledge that GraphQL introduces its own trade-offs to show balanced thinking.",
        ],
        relatedTopics: [
          "N+1 problem",
          "DataLoader",
          "client-specific endpoints",
        ],
      },
      {
        id: "browser-rest-graphql-q3",
        question: "How do caching strategies differ between REST and GraphQL?",
        answer:
          "Caching is one of the areas where REST and GraphQL differ most dramatically, and it is often a deciding factor when choosing between the two paradigms.\n\nREST benefits from the entire HTTP caching infrastructure. Each resource has a unique URL, and HTTP provides built-in caching mechanisms: Cache-Control headers specify caching rules, ETag enables conditional requests for revalidation, CDNs can cache GET responses by URL, browser caches automatically store responses based on caching headers, and API gateways can implement response caching by URL pattern. This multi-layered caching works transparently because the URL uniquely identifies the resource.\n\nGraphQL makes HTTP caching difficult because all requests typically go to a single endpoint (POST /graphql). CDNs and browser HTTP caches cannot distinguish between different queries hitting the same URL. The request body (which contains the query) is not used for HTTP cache keying. Some GraphQL servers support persisted queries with GET requests (where the query hash is in the URL), enabling HTTP caching, but this requires additional setup.\n\nGraphQL relies instead on client-side normalized caching, implemented by libraries like Apollo Client, urql, and Relay. These libraries parse GraphQL responses and store each entity in a normalized cache keyed by type and ID (e.g., User:123). When the same entity appears in different queries, it is stored once and all queries reference the same cached entry. Updates to an entity automatically reflect everywhere it appears in the UI.\n\nNormalized caching in GraphQL provides powerful capabilities: automatic UI updates when mutation responses include the modified entity, optimistic updates (updating the cache before the server responds), and cache invalidation at the entity level rather than the endpoint level. However, this approach requires a client-side library, increases bundle size, and adds complexity.\n\nFor server-side caching, REST can cache at the reverse proxy level (Varnish, Nginx, Cloudflare) based on URL patterns. GraphQL caching at the server level requires more sophisticated approaches like query complexity analysis, field-level caching, and response caching with query hashing. Tools like Apollo Server plugins and GraphQL CDNs (Stellate) address this but add operational complexity.",
        shortAnswer:
          "REST uses HTTP caching naturally (Cache-Control, ETag, CDN by URL). GraphQL cannot leverage HTTP caching (single endpoint, POST requests) and relies on client-side normalized caches (Apollo, urql) that store entities by type+ID. REST caching is simpler; GraphQL caching is more powerful for complex UIs but requires client libraries.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rest-graphql-1",
        tags: ["caching", "rest", "graphql", "normalized-cache", "http-cache"],
        commonMistakes: [
          "Assuming GraphQL cannot be cached — it can, but requires different techniques (normalized client cache, persisted queries).",
          "Not leveraging HTTP caching for REST APIs, missing a major performance advantage.",
          "Over-complicating GraphQL caching when simple REST caching would suffice for the use case.",
        ],
        followUps: [
          "What are persisted queries and how do they enable HTTP caching for GraphQL?",
          "How does Apollo Client normalized cache work?",
        ],
        interviewTips: [
          "Contrast HTTP-level caching (REST) with client-side normalized caching (GraphQL).",
          "Mention that caching differences are a key factor in choosing between REST and GraphQL.",
        ],
        relatedTopics: [
          "HTTP caching",
          "Apollo Client",
          "CDN",
          "cache invalidation",
        ],
      },
      {
        id: "browser-rest-graphql-q4",
        question: "When should you choose REST over GraphQL, and vice versa?",
        answer:
          "Choosing between REST and GraphQL depends on your application requirements, team expertise, client diversity, and data access patterns. Neither is universally better — each excels in different scenarios.\n\nChoose REST when your API serves a small number of clients with well-defined data needs, when HTTP caching is critical for performance (e.g., content-heavy sites, CDN-reliant architectures), when you need simple, predictable APIs that are easy for external consumers to understand, when your team is more experienced with REST, or when you are building CRUD-oriented microservices with clear resource boundaries. REST is also the better choice for file uploads/downloads, streaming, and webhook integrations.\n\nChoose GraphQL when your API serves multiple diverse clients (web, iOS, Android, third-party) with different data requirements, when your UI requires complex data relationships that would cause waterfall requests in REST, when teams want to iterate on frontend features without backend changes, when you need real-time data via subscriptions, or when your data graph is deeply nested and relational. GraphQL shines in scenarios where a dashboard displays data from many entities, a mobile client needs a subset of what the web client needs, or the frontend team wants autonomous control over data fetching.\n\nMany organizations use both. A common pattern is REST for simple, public-facing APIs and inter-service communication, with GraphQL as a Backend-for-Frontend (BFF) layer that aggregates data from multiple REST microservices. The GraphQL server queries internal REST services and composes the response for the frontend. This combines REST simplicity and caching for backend services with GraphQL flexibility for client-facing queries.\n\nConsider the operational cost as well. GraphQL requires a schema definition, resolver implementation, N+1 mitigation (DataLoader), query complexity limits (to prevent abuse), and client-side caching libraries. REST requires endpoint design, versioning strategy, and documentation. For small teams or simple applications, REST lower complexity is often the pragmatic choice.",
        shortAnswer:
          "Choose REST for simple APIs, HTTP caching needs, external consumers, and CRUD microservices. Choose GraphQL for multiple diverse clients, complex data relationships, frontend autonomy, and real-time features. Many organizations use both: REST for microservices, GraphQL as a BFF layer aggregating REST endpoints for frontends.",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-rest-graphql-1",
        tags: ["decision-making", "architecture", "rest", "graphql"],
        commonMistakes: [
          "Choosing GraphQL because it is newer without evaluating whether REST is sufficient for the use case.",
          "Using GraphQL as a direct database query layer without proper authorization and complexity limits.",
          "Not considering the operational overhead of GraphQL (schema management, N+1 prevention, complexity analysis).",
        ],
        followUps: [
          "What is the Backend-for-Frontend (BFF) pattern?",
          "How do you handle API versioning in REST vs GraphQL?",
        ],
        interviewTips: [
          "Present criteria for choosing each (not just pros/cons) to show you make informed architectural decisions.",
          "Mention the BFF pattern as a pragmatic hybrid approach.",
        ],
        relatedTopics: ["microservices", "BFF pattern", "API versioning"],
      },
      {
        id: "browser-rest-graphql-q5",
        question: "What is the N+1 problem in GraphQL and how is it solved?",
        answer:
          "The N+1 problem is a performance issue that occurs in GraphQL (and ORMs) when resolving nested relationships causes an explosion of database queries. It gets its name from the pattern: 1 query to fetch the parent records, then N additional queries to fetch related data for each parent.\n\nConsider a query that fetches a list of 10 users and their posts. The GraphQL server first executes one query to fetch the 10 users. Then, for each user, the posts resolver runs a separate database query to fetch that user posts. This results in 11 total queries (1 + 10). If the query also includes each post comments, that adds another query per post — the number grows exponentially with nesting depth. With 10 users having 5 posts each, you get 1 (users) + 10 (posts) + 50 (comments) = 61 queries instead of 3 batched queries.\n\nDataLoader is the standard solution, developed by Facebook specifically for this problem. It batches and caches data-fetching operations within a single request. Instead of immediately executing a database query when a resolver needs data, DataLoader queues the request. At the end of the current event loop tick, it combines all queued requests into a single batched query.\n\nWith DataLoader, the posts resolver for all 10 users is collected into a single batch. DataLoader calls a batch loading function with all 10 user IDs at once, and the database executes a single query: SELECT * FROM posts WHERE user_id IN (1, 2, 3, ..., 10). The result is 1 query for users + 1 query for all posts + 1 query for all comments = 3 queries total.\n\nDataLoader also provides per-request caching. If the same entity is requested multiple times within a single GraphQL operation (e.g., an author appearing in multiple posts), DataLoader returns the cached result instead of making a duplicate query. A new DataLoader instance should be created per request to prevent data leaking between users.\n\nOther solutions include query planning (analyzing the GraphQL query upfront and generating optimized SQL with JOINs), using ORMs that support eager loading (like Prisma includes or TypeORM relations), and implementing lookahead (inspecting the incoming query AST to determine what related data will be needed and loading it proactively).",
        shortAnswer:
          "The N+1 problem: 1 query for parent records + N queries for each record related data. In GraphQL, fetching 10 users and their posts causes 11 queries. DataLoader solves it by batching: it collects all IDs within an event loop tick and executes a single batch query (SELECT ... WHERE id IN (...)). Create a new DataLoader per request.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-rest-graphql-1",
        tags: ["n-plus-1", "dataloader", "performance", "graphql"],
        commonMistakes: [
          "Not using DataLoader in GraphQL resolvers, causing severe N+1 performance issues.",
          "Reusing DataLoader instances across requests, which can leak cached data between users.",
          "Assuming the N+1 problem only exists in GraphQL — it also affects REST APIs with ORMs.",
        ],
        followUps: [
          "How does DataLoader batching work with the event loop?",
          "What is query lookahead in GraphQL?",
        ],
        interviewTips: [
          "Walk through a concrete example with numbers (10 users, 5 posts each) to illustrate the problem.",
          "Explain DataLoader batching mechanism and mention per-request instantiation.",
        ],
        relatedTopics: [
          "DataLoader",
          "database optimization",
          "event loop",
          "batch queries",
        ],
      },
    ],
  },
  {
    id: "browser-websockets-1",
    title: "WebSockets",
    description:
      "Understand the WebSocket protocol, connection lifecycle, real-time communication patterns, comparison with SSE, and reconnection strategies.",
    category: "Browser",
    difficulty: "Advanced",
    tags: ["browser", "websockets", "real-time", "socket-io"],
    overview:
      "WebSockets provide full-duplex, persistent communication between client and server over a single TCP connection. They are essential for real-time applications like chat, live dashboards, collaborative editing, and gaming.",
    concepts: [
      "WebSocket protocol and handshake",
      "Connection lifecycle (open, message, close, error)",
      "Full-duplex communication",
      "Use cases (chat, live data, gaming)",
      "Socket.IO library",
      "Server-Sent Events (SSE) comparison",
      "Heartbeat / ping-pong mechanism",
      "Reconnection strategies",
    ],
    relatedTopicIds: [
      "browser-http-1",
      "browser-rest-graphql-1",
      "browser-xhr-fetch-1",
    ],
    codeExamples: [
      {
        title: "Basic WebSocket client with reconnection",
        code: 'class WebSocketClient {\n  private ws: WebSocket | null = null;\n  private url: string;\n  private reconnectAttempts = 0;\n  private maxReconnectAttempts = 10;\n  private reconnectDelay = 1000;\n  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;\n\n  constructor(url: string) {\n    this.url = url;\n    this.connect();\n  }\n\n  private connect(): void {\n    this.ws = new WebSocket(this.url);\n\n    this.ws.onopen = () => {\n      console.log("Connected");\n      this.reconnectAttempts = 0;\n      this.startHeartbeat();\n    };\n\n    this.ws.onmessage = (event: MessageEvent) => {\n      const data = JSON.parse(event.data as string);\n      if (data.type !== "pong") {\n        this.handleMessage(data);\n      }\n    };\n\n    this.ws.onclose = (event: CloseEvent) => {\n      this.stopHeartbeat();\n      if (!event.wasClean) {\n        this.reconnect();\n      }\n    };\n\n    this.ws.onerror = () => {\n      this.ws?.close();\n    };\n  }\n\n  private reconnect(): void {\n    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;\n    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);\n    this.reconnectAttempts++;\n    setTimeout(() => this.connect(), delay);\n  }\n\n  private startHeartbeat(): void {\n    this.heartbeatInterval = setInterval(() => {\n      this.send({ type: "ping" });\n    }, 30000);\n  }\n\n  private stopHeartbeat(): void {\n    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);\n  }\n\n  send(data: Record<string, unknown>): void {\n    if (this.ws?.readyState === WebSocket.OPEN) {\n      this.ws.send(JSON.stringify(data));\n    }\n  }\n\n  private handleMessage(data: Record<string, unknown>): void {\n    console.log("Received:", data);\n  }\n\n  disconnect(): void {\n    this.stopHeartbeat();\n    this.maxReconnectAttempts = 0;\n    this.ws?.close(1000, "Client disconnect");\n  }\n}',
        language: "typescript",
        explanation:
          "A production-ready WebSocket client with automatic reconnection using exponential backoff and a heartbeat mechanism to detect dead connections.",
      },
      {
        title: "Server-Sent Events (SSE) alternative",
        code: 'function connectSSE(url: string, onMessage: (data: unknown) => void): EventSource {\n  const source = new EventSource(url);\n\n  source.onmessage = (event: MessageEvent) => {\n    const data = JSON.parse(event.data as string);\n    onMessage(data);\n  };\n\n  source.addEventListener("update", (event: MessageEvent) => {\n    const data = JSON.parse(event.data);\n    onMessage(data);\n  });\n\n  source.onerror = () => {\n    // EventSource automatically reconnects\n    console.log("SSE connection error, reconnecting...");\n  };\n\n  return source;\n}\n\n// Usage\nconst sse = connectSSE("/api/events", (data) => {\n  console.log("Update:", data);\n});\n\n// Cleanup\n// sse.close();',
        language: "typescript",
        explanation:
          "SSE is a simpler alternative for server-to-client streaming. It uses standard HTTP, supports automatic reconnection, and works through proxies. The trade-off is it is one-directional (server to client only).",
      },
    ],
    questions: [
      {
        id: "browser-websockets-q1",
        question: "How does the WebSocket handshake work?",
        answer:
          "The WebSocket handshake is an HTTP upgrade mechanism that transitions a standard HTTP connection into a persistent WebSocket connection. It uses a regular HTTP/1.1 request-response exchange with specific upgrade headers.\n\nThe client initiates the handshake by sending an HTTP GET request with upgrade headers. The request includes Connection: Upgrade and Upgrade: websocket to signal the desire to switch protocols. It also includes Sec-WebSocket-Key, a Base64-encoded random 16-byte value that serves as a nonce to prevent caching proxies from replaying old WebSocket frames. The Sec-WebSocket-Version header specifies the protocol version (13 for the current standard, RFC 6455).\n\nThe server validates the request and responds with HTTP 101 Switching Protocols if it accepts the WebSocket connection. The response includes the same Connection: Upgrade and Upgrade: websocket headers, plus a Sec-WebSocket-Accept header. This value is computed by concatenating the client Sec-WebSocket-Key with a magic string (258EAFA5-E914-47DA-95CA-C5AB0DC85B11), computing the SHA-1 hash, and Base64-encoding the result. The client verifies this value to confirm the server understands the WebSocket protocol.\n\nOnce the handshake completes, the connection switches from HTTP to the WebSocket binary frame protocol. Both client and server can now send messages at any time (full-duplex). The underlying TCP connection remains open, eliminating the overhead of establishing new connections for each message.\n\nThe handshake passes through HTTP, which means it works with existing HTTP infrastructure — load balancers, proxies, and firewalls. However, some intermediaries may not support WebSocket upgrades. In those cases, libraries like Socket.IO fall back to HTTP long polling. The wss:// scheme (WebSocket Secure) runs WebSocket over TLS, analogous to HTTPS.",
        shortAnswer:
          "The client sends an HTTP GET with Upgrade: websocket and a random Sec-WebSocket-Key. The server responds with 101 Switching Protocols and Sec-WebSocket-Accept (a hash of the key + magic string). The connection then switches from HTTP to the WebSocket binary frame protocol, enabling full-duplex communication.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-websockets-1",
        tags: ["handshake", "upgrade", "protocol", "http-101"],
        commonMistakes: [
          "Thinking WebSocket is a completely separate protocol from HTTP — the handshake uses HTTP, then upgrades.",
          "Not using wss:// (WebSocket Secure) in production, leaving the connection vulnerable to interception.",
          "Forgetting that some proxies and load balancers may not support WebSocket upgrades without configuration.",
        ],
        followUps: [
          "What happens if a proxy does not support WebSocket upgrades?",
          "How does the Sec-WebSocket-Key prevent replay attacks?",
        ],
        interviewTips: [
          "Walk through the handshake headers step by step: client request, server response, protocol switch.",
          "Mention the HTTP 101 status code and the upgrade mechanism to show protocol-level understanding.",
        ],
        relatedTopics: ["HTTP upgrade", "TCP", "TLS", "load balancing"],
      },
      {
        id: "browser-websockets-q2",
        question:
          "Compare WebSockets with Server-Sent Events (SSE). When would you use each?",
        answer:
          "WebSockets and Server-Sent Events (SSE) are both mechanisms for real-time communication, but they have fundamentally different architectures and trade-offs that make each suitable for different use cases.\n\nWebSockets provide full-duplex communication — both the client and server can send messages to each other at any time over a single TCP connection. The protocol switches from HTTP to a binary frame protocol after the handshake. WebSockets support text and binary data, making them suitable for any real-time scenario.\n\nSSE is a unidirectional protocol — only the server can send events to the client. The client opens a long-lived HTTP connection (a regular GET request), and the server sends events in a simple text format (event type, data, and optional ID). The connection uses standard HTTP, which means it works through all proxies, CDNs, and load balancers without special configuration. SSE has built-in automatic reconnection with a Last-Event-ID header that enables the server to resume where it left off.\n\nChoose WebSockets when you need bidirectional communication (chat applications, multiplayer games, collaborative editing), when you need to send binary data (audio/video streams, file transfers), when you need very low latency (the binary frame protocol has less overhead than HTTP text), or when the client frequently sends data to the server.\n\nChoose SSE when communication is primarily server-to-client (live feeds, stock tickers, notification streams, log tailing), when you want simplicity (SSE uses standard HTTP, no special server infrastructure), when you need automatic reconnection and event ordering (built into the protocol), or when working behind restrictive firewalls or proxies that block WebSocket upgrades. SSE also benefits from HTTP/2 multiplexing, allowing many SSE connections over a single TCP connection.\n\nSSE has a limitation of 6 concurrent connections per domain in HTTP/1.1 (shared across all tabs). HTTP/2 eliminates this limit. WebSockets do not have this restriction because they use a different protocol after the upgrade.\n\nFor applications where the client occasionally sends data and the server streams updates, a hybrid approach works well: SSE for server-to-client events and regular HTTP requests (POST, PUT) for client-to-server actions.",
        shortAnswer:
          "WebSockets: bidirectional, binary frame protocol, ideal for chat/gaming/collaboration. SSE: server-to-client only, uses standard HTTP, has built-in reconnection and event IDs. Choose WebSockets for two-way communication. Choose SSE for server push scenarios (notifications, live feeds) where simplicity and HTTP compatibility matter.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-websockets-1",
        tags: ["sse", "comparison", "real-time", "unidirectional"],
        commonMistakes: [
          "Defaulting to WebSockets when SSE would be simpler and sufficient (e.g., notification streams).",
          "Not knowing about the 6-connection HTTP/1.1 limit for SSE.",
          "Forgetting that SSE has built-in reconnection while WebSockets require manual reconnection logic.",
        ],
        followUps: [
          "How does HTTP/2 improve SSE?",
          "Can you implement a chat application with SSE?",
        ],
        interviewTips: [
          "Create a clear comparison: direction (unidirectional vs bidirectional), protocol (HTTP vs custom), reconnection (built-in vs manual).",
          "Recommend the simpler option (SSE) when it fits the use case to show pragmatic thinking.",
        ],
        relatedTopics: ["EventSource API", "HTTP/2", "long polling"],
      },
      {
        id: "browser-websockets-q3",
        question:
          "How do you implement a robust reconnection strategy for WebSockets?",
        answer:
          "WebSocket connections can drop due to network changes, server deployments, idle timeouts, or infrastructure issues. A robust reconnection strategy is essential for production real-time applications.\n\nThe foundation is exponential backoff with jitter. When a connection drops, the client waits before reconnecting, with the delay increasing exponentially (1s, 2s, 4s, 8s, etc.) up to a maximum (e.g., 30 seconds). Adding random jitter (multiplying the delay by a random factor between 0.5 and 1.5) prevents the thundering herd problem where all clients reconnect simultaneously after a server restart, overwhelming the server.\n\nA heartbeat mechanism detects dead connections that the TCP stack has not recognized. The client sends periodic ping messages (every 30 seconds) and expects pong responses. If no pong is received within a timeout period (e.g., 10 seconds), the connection is assumed dead and the client closes it to trigger reconnection. WebSocket has built-in ping/pong frames at the protocol level, but not all libraries expose them — many applications implement application-level heartbeats using regular messages.\n\nState recovery after reconnection is critical for user experience. The client should track the last received message ID or timestamp. After reconnecting, it sends this ID to the server, which replays any missed messages. Without this, users miss events that occurred during the disconnection. The server should buffer recent messages (in memory or Redis) for a configurable duration to support reconnecting clients.\n\nAdditional robustness features include a maximum retry limit with user notification (after N failed attempts, inform the user and offer a manual reconnect button), online/offline detection (pause reconnection attempts when navigator.onLine is false, resume when the online event fires), page visibility awareness (reduce heartbeat frequency when the tab is in the background to save resources), and connection quality monitoring (track reconnection frequency to detect persistent issues).\n\nSocket.IO implements many of these features out of the box: automatic reconnection with backoff, heartbeat detection, room management, and transparent fallback to HTTP long polling when WebSockets are unavailable.",
        shortAnswer:
          "Use exponential backoff with jitter to prevent thundering herd on server restarts. Implement heartbeat (ping/pong) to detect dead connections. Track last message ID for state recovery after reconnection. Add max retry limits, online/offline awareness, and page visibility handling. Socket.IO provides these features built-in.",
        difficulty: "Advanced",
        type: "Coding",
        category: "Browser",
        topicId: "browser-websockets-1",
        tags: [
          "reconnection",
          "heartbeat",
          "exponential-backoff",
          "resilience",
        ],
        commonMistakes: [
          "Using fixed reconnection intervals instead of exponential backoff, causing server overload after outages.",
          "Not implementing jitter, allowing thousands of clients to reconnect simultaneously.",
          "Forgetting state recovery, causing users to miss messages that arrived during disconnection.",
          "Not pausing reconnection when the device is offline, wasting battery and resources.",
        ],
        followUps: [
          "How does Socket.IO handle transport fallback?",
          "What is the thundering herd problem?",
        ],
        interviewTips: [
          "Cover the three pillars: reconnection logic, heartbeat detection, and state recovery.",
          "Mention jitter specifically — it shows you understand distributed systems concerns.",
        ],
        relatedTopics: [
          "Socket.IO",
          "exponential backoff",
          "distributed systems",
        ],
      },
      {
        id: "browser-websockets-q4",
        question:
          "What are the common use cases for WebSockets and what are the alternatives?",
        answer:
          "WebSockets excel in scenarios requiring persistent, low-latency, bidirectional communication between client and server. Understanding use cases and alternatives helps make informed architectural decisions.\n\nChat and messaging applications are the classic WebSocket use case. Users need to send and receive messages in real time, with minimal latency. WebSockets provide instant delivery in both directions. Alternatives for simpler chat needs include SSE for receiving messages combined with HTTP POST for sending messages.\n\nLive dashboards and data feeds (stock tickers, sports scores, monitoring dashboards) benefit from WebSocket server push. The server streams updates to all connected clients. SSE is often a better fit here since communication is primarily one-directional. For less frequent updates (every few seconds), HTTP polling is simpler and may be sufficient.\n\nCollaborative editing (Google Docs, Figma, multiplayer whiteboards) requires bidirectional, low-latency communication with conflict resolution. WebSockets carry operational transforms (OT) or CRDT operations between clients and the server. This is one case where WebSockets are clearly the best choice.\n\nMultiplayer gaming requires very low latency for real-time player positions, actions, and game state synchronization. WebSockets provide the speed needed, though some games use WebRTC DataChannels for peer-to-peer communication with even lower latency.\n\nNotifications and alerts are often implemented with WebSockets but SSE is frequently more appropriate. Push notifications only flow from server to client, making SSE simpler. For infrequent notifications, HTTP long polling or even periodic polling is simpler and more scalable.\n\nAlternatives to WebSockets include SSE (server-to-client streaming over HTTP), HTTP long polling (the server holds the request open until data is available), WebRTC DataChannels (peer-to-peer, used for video calls and P2P games), HTTP/2 server push (pushing resources, deprecated in Chrome), and gRPC streaming (bidirectional streaming over HTTP/2, mainly used for service-to-service communication).",
        shortAnswer:
          "WebSocket use cases: chat, live dashboards, collaborative editing, multiplayer gaming, notifications. Alternatives: SSE (server-to-client, simpler), long polling (less infrastructure), WebRTC DataChannels (P2P, lower latency), gRPC streaming (service-to-service). Choose WebSockets for bidirectional, low-latency needs.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-websockets-1",
        tags: ["use-cases", "alternatives", "architecture", "real-time"],
        commonMistakes: [
          "Using WebSockets for use cases where simpler technologies (SSE, polling) would suffice.",
          "Not considering the operational cost of WebSocket infrastructure (persistent connections, load balancer configuration, scaling).",
          "Ignoring WebRTC DataChannels for P2P use cases where they offer lower latency.",
        ],
        followUps: [
          "How do you scale WebSocket connections across multiple server instances?",
          "What is the difference between WebSockets and WebRTC?",
        ],
        interviewTips: [
          "Match use cases to the right technology rather than defaulting to WebSockets for everything.",
          "Mention scaling challenges (sticky sessions, pub/sub for cross-server messaging) to show production awareness.",
        ],
        relatedTopics: ["SSE", "WebRTC", "long polling", "gRPC"],
      },
      {
        id: "browser-websockets-q5",
        question:
          "What is Socket.IO and how does it differ from native WebSockets?",
        answer:
          'Socket.IO is a popular JavaScript library that provides real-time, bidirectional communication between clients and servers. While it uses WebSockets as its primary transport, it is not a WebSocket library — it is a higher-level abstraction with additional features and its own protocol.\n\nThe most important difference is transport fallback. Socket.IO starts with HTTP long polling and upgrades to WebSockets when available. If WebSockets are blocked by a firewall, proxy, or corporate network, Socket.IO transparently falls back to long polling without any application code changes. Native WebSockets have no fallback — if the connection fails, you must implement an alternative yourself.\n\nSocket.IO provides automatic reconnection with exponential backoff out of the box. When the connection drops, it automatically attempts to reconnect, resuming the session. Native WebSockets require manual reconnection implementation including backoff logic, heartbeat detection, and state recovery.\n\nRooms and namespaces are Socket.IO features for organizing connections. Rooms allow grouping clients for targeted broadcasting (e.g., a chat room where messages are sent to room members only). Namespaces provide separate communication channels over a single connection (e.g., /chat and /notifications as independent channels). Native WebSockets have no concept of rooms or namespaces — you must implement these patterns yourself.\n\nSocket.IO includes event-based communication with named events (socket.emit("chat:message", data)) and acknowledgments (callbacks that confirm the server received and processed a message). Native WebSockets only support a generic onmessage handler and have no built-in acknowledgment mechanism.\n\nThe trade-offs of Socket.IO include: a larger bundle size (Socket.IO client is ~30KB gzipped vs 0 for native WebSockets), its own protocol that is not compatible with standard WebSocket servers (you need a Socket.IO server), slightly higher latency due to the protocol overhead, and less control over the underlying connection. For simple WebSocket needs without the extra features, native WebSockets are lighter and faster.',
        shortAnswer:
          "Socket.IO is a library built on top of WebSockets with transport fallback (long polling), automatic reconnection, rooms/namespaces, named events, and acknowledgments. Trade-offs: larger bundle, proprietary protocol (incompatible with plain WebSocket servers), higher overhead. Use Socket.IO for rich features; use native WebSockets for lightweight, standard-compliant connections.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-websockets-1",
        tags: ["socket-io", "library", "rooms", "fallback"],
        commonMistakes: [
          "Connecting a native WebSocket client to a Socket.IO server — they use different protocols.",
          "Using Socket.IO when native WebSockets are sufficient, adding unnecessary bundle size and complexity.",
          "Not realizing Socket.IO starts with long polling before upgrading to WebSockets, adding initial latency.",
        ],
        followUps: [
          "How do Socket.IO rooms work under the hood?",
          "What alternatives to Socket.IO exist (e.g., ws, Ably, Pusher)?",
        ],
        interviewTips: [
          "Clearly state that Socket.IO is not just a WebSocket wrapper — it has its own protocol and features.",
          "Compare the feature set to justify when each approach is appropriate.",
        ],
        relatedTopics: [
          "native WebSockets",
          "long polling",
          "real-time libraries",
        ],
      },
    ],
  },
  {
    id: "browser-micro-frontends-1",
    title: "Micro-frontends",
    description:
      "Explore micro-frontend architecture — Module Federation, iframe-based approaches, Web Components, routing, shared state, and trade-offs.",
    category: "Browser",
    difficulty: "Senior",
    tags: ["browser", "micro-frontends", "architecture", "module-federation"],
    overview:
      "Micro-frontends extend the microservices pattern to the front end, allowing independent teams to develop, deploy, and scale portions of a web application autonomously. Understanding integration strategies and their trade-offs is essential for senior-level architecture discussions.",
    concepts: [
      "Micro-frontend concept and motivation",
      "Module Federation (Webpack 5)",
      "Iframe-based integration",
      "Web Components approach",
      "Routing strategies across micro-frontends",
      "Shared state and inter-app communication",
      "Build-time vs runtime integration",
      "Pros, cons, and when to adopt",
    ],
    relatedTopicIds: ["browser-websockets-1", "browser-rest-graphql-1"],
    codeExamples: [
      {
        title: "Webpack Module Federation configuration",
        code: '// host/webpack.config.js\nconst { ModuleFederationPlugin } = require("webpack").container;\n\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: "host",\n      remotes: {\n        checkout: "checkout@https://checkout.example.com/remoteEntry.js",\n        catalog: "catalog@https://catalog.example.com/remoteEntry.js",\n      },\n      shared: {\n        react: { singleton: true, requiredVersion: "^18.0.0" },\n        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },\n      },\n    }),\n  ],\n};\n\n// host/src/App.tsx — dynamically importing a remote component\nconst RemoteCheckout = React.lazy(\n  () => import("checkout/CheckoutPage")\n);\n\nfunction App() {\n  return (\n    <React.Suspense fallback={<div>Loading checkout...</div>}>\n      <RemoteCheckout />\n    </React.Suspense>\n  );\n}',
        language: "javascript",
        explanation:
          "Module Federation allows independently deployed applications to share code at runtime. The host application loads remote components from other deployed applications without build-time coupling.",
      },
      {
        title: "Cross-micro-frontend communication via Custom Events",
        code: '// Shared event bus using CustomEvent\ninterface AppEvent<T = unknown> {\n  type: string;\n  payload: T;\n}\n\nfunction emitAppEvent<T>(type: string, payload: T): void {\n  window.dispatchEvent(\n    new CustomEvent("app-event", {\n      detail: { type, payload },\n    })\n  );\n}\n\nfunction onAppEvent<T>(type: string, handler: (payload: T) => void): () => void {\n  const listener = (event: Event) => {\n    const detail = (event as CustomEvent<AppEvent<T>>).detail;\n    if (detail.type === type) {\n      handler(detail.payload);\n    }\n  };\n  window.addEventListener("app-event", listener);\n  return () => window.removeEventListener("app-event", listener);\n}\n\n// Micro-frontend A: emit event\nemitAppEvent("cart:item-added", { productId: "123", quantity: 1 });\n\n// Micro-frontend B: listen for event\nconst cleanup = onAppEvent<{ productId: string; quantity: number }>(\n  "cart:item-added",\n  (payload) => console.log("Item added:", payload)\n);',
        language: "typescript",
        explanation:
          "Custom DOM events provide a framework-agnostic communication mechanism between micro-frontends. Each micro-frontend can emit and listen for events without direct dependencies on other micro-frontends.",
      },
    ],
    questions: [
      {
        id: "browser-micro-frontends-q1",
        question: "What are micro-frontends and what problems do they solve?",
        answer:
          "Micro-frontends are an architectural pattern that decomposes a monolithic front-end application into smaller, independently developed, tested, and deployed units. Each micro-frontend is owned by an autonomous team and represents a vertical slice of business functionality — for example, a product catalog, shopping cart, user account, and checkout might each be separate micro-frontends.\n\nThe primary problem micro-frontends solve is organizational scaling. As applications grow and more teams contribute, a monolithic frontend becomes a coordination bottleneck. Every team works in the same codebase, merge conflicts are frequent, testing is slow (the entire application must be tested for any change), deployments are coupled (one team cannot deploy without coordinating with others), and tech debt accumulates because refactoring risks breaking other teams code.\n\nMicro-frontends address this by giving each team full ownership of their domain from database to UI. Teams can choose their own technology stack (React, Vue, Svelte), set their own release schedule, maintain their own CI/CD pipeline, and evolve independently. A change to the checkout flow does not require changes to the catalog team codebase or deployment pipeline.\n\nOther benefits include incremental migration (you can rewrite one micro-frontend at a time without a full rewrite), fault isolation (a bug in one micro-frontend does not crash the entire application), and independent scaling (a high-traffic section can be deployed to more servers without scaling the entire app).\n\nHowever, micro-frontends introduce significant complexity. They require solving shared dependency management (how to avoid loading React twice), cross-app routing (how the URL maps to the correct micro-frontend), shared state (how the cart count updates in the header when an item is added in the catalog), consistent UI (how to maintain a unified look and feel across independently developed UIs), and operational overhead (monitoring, logging, and debugging across multiple deployed applications). This pattern is most appropriate for large organizations with multiple autonomous teams — small teams building a single product are usually better served by a well-structured monolith.",
        shortAnswer:
          "Micro-frontends decompose a monolithic frontend into independently developed and deployed units owned by autonomous teams. They solve organizational scaling by enabling independent releases, technology choices, and team autonomy. Trade-offs include complexity in routing, shared state, dependency management, and UX consistency. Best suited for large organizations.",
        difficulty: "Senior",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-micro-frontends-1",
        tags: [
          "architecture",
          "team-scaling",
          "independent-deployment",
          "monolith",
        ],
        commonMistakes: [
          "Adopting micro-frontends for a small team or simple application where the overhead is not justified.",
          "Not establishing shared design systems and component libraries, leading to inconsistent UX.",
          "Ignoring the coordination cost of cross-micro-frontend features that span multiple teams.",
        ],
        followUps: [
          "How do you decide the boundaries for each micro-frontend?",
          "What is the difference between vertical and horizontal decomposition?",
          "How do micro-frontends handle authentication?",
        ],
        interviewTips: [
          "Frame micro-frontends as an organizational solution, not just a technical one.",
          "Discuss the trade-offs honestly to show mature architectural thinking.",
        ],
        relatedTopics: [
          "microservices",
          "team topology",
          "monolith vs distributed",
        ],
      },
      {
        id: "browser-micro-frontends-q2",
        question:
          "Compare the main integration approaches: Module Federation, iframes, and Web Components.",
        answer:
          "There are several approaches to integrating micro-frontends in a host application, each with distinct strengths, limitations, and appropriate use cases.\n\nModule Federation (Webpack 5) enables runtime sharing of JavaScript modules between independently deployed applications. A host application can dynamically import components from remote applications loaded via separate URLs. Shared dependencies (React, lodash) can be declared as singletons to avoid duplication. This approach provides the tightest integration — remote components render as part of the host DOM, share the same React tree, and can use shared context providers. The downside is build tool coupling (both host and remote must use Webpack 5 or compatible tools like Rspack), version alignment for shared libraries, and complexity in development tooling. Vite has an equivalent via vite-plugin-federation.\n\nIframe-based integration provides the strongest isolation. Each micro-frontend runs in its own browsing context with separate JavaScript, CSS, and DOM. One micro-frontend cannot affect another through global styles, global variables, or script errors. Communication between iframes uses postMessage. The downsides are significant: iframes create layout challenges (no adaptive height by default, scrolling issues), poor accessibility (screen readers struggle with nested browsing contexts), performance overhead (each iframe loads its own copy of all resources), and no shared state without explicit messaging. Iframes are best when isolation is paramount — e.g., embedding untrusted third-party content or legacy applications.\n\nWeb Components use Custom Elements and Shadow DOM to create encapsulated, framework-agnostic components. Each micro-frontend registers its root component as a custom element (e.g., <checkout-app></checkout-app>). Shadow DOM provides style encapsulation, and the component lifecycle (connectedCallback, disconnectedCallback) integrates with any framework. This approach works across frameworks (React, Vue, Angular can all render custom elements), provides decent isolation, and is a web standard. The downsides include limited SSR support, framework-to-web-component wrappers adding complexity, and Shadow DOM sometimes being too isolating (shared themes require CSS custom properties or constructable stylesheets).\n\nBuild-time integration (npm packages) is the simplest approach: each micro-frontend is published as a package and consumed as a regular dependency. This provides excellent TypeScript support and tooling but eliminates independent deployment — any update requires rebuilding the host application.",
        shortAnswer:
          "Module Federation: tightest integration, runtime code sharing, build tool coupling. Iframes: strongest isolation but poor UX (layout, accessibility). Web Components: framework-agnostic, decent isolation via Shadow DOM, limited SSR. Build-time (npm): simplest but no independent deployment. Choose based on isolation needs, team constraints, and deployment requirements.",
        difficulty: "Senior",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-micro-frontends-1",
        tags: ["module-federation", "iframes", "web-components", "integration"],
        commonMistakes: [
          "Using iframes for tightly integrated UIs where layout and accessibility are important.",
          "Not declaring shared dependencies as singletons in Module Federation, loading React multiple times.",
          "Assuming Web Components provide complete style isolation — CSS custom properties leak through Shadow DOM by design.",
        ],
        followUps: [
          "How does single-spa compare to Module Federation?",
          "How do you handle shared dependencies across micro-frontends?",
        ],
        interviewTips: [
          "Compare all three approaches on the same dimensions: isolation, deployment, performance, complexity.",
          "Recommend different approaches for different scenarios to show nuanced thinking.",
        ],
        relatedTopics: [
          "Shadow DOM",
          "Custom Elements",
          "Webpack",
          "single-spa",
        ],
      },
      {
        id: "browser-micro-frontends-q3",
        question: "How do you handle routing across multiple micro-frontends?",
        answer:
          'Routing in a micro-frontend architecture is one of the most challenging aspects because the URL must be shared across independently developed applications. There are two primary patterns: shell-based routing and distributed routing.\n\nIn shell-based routing, a host application (the "shell") owns the top-level route structure and decides which micro-frontend to load based on the URL path. For example, /catalog/* loads the catalog micro-frontend, /cart/* loads the cart micro-frontend, and /account/* loads the account micro-frontend. The shell handles the first URL segment, and each micro-frontend manages its own sub-routing internally. This is the most common and simplest approach.\n\nFrameworks like single-spa formalize this pattern by registering micro-frontend "applications" with their active URL patterns. When the URL changes, single-spa mounts the matching application and unmounts others. Module Federation achieves similar results with React.lazy and React Router, where each route lazily imports the corresponding remote component.\n\nDistributed routing is more complex. Each micro-frontend contributes its own routes to a shared router, and route registration happens at runtime. This provides more flexibility but requires a shared routing protocol and careful coordination to avoid route conflicts.\n\nKey challenges include history management (all micro-frontends must share a single browser history to avoid conflicting pushState calls), navigation interception (the shell must intercept link clicks to route internally rather than triggering full page loads), deep linking (direct URL navigation must load the correct micro-frontend and pass the route to its internal router), and transitions (smooth navigation between micro-frontends should feel like navigating within a single application).\n\nA practical implementation uses the shell as the source of truth for routing, with each micro-frontend accepting its base path as a prop. The micro-frontend internal router uses relative paths from the base, and the shell handles top-level navigation events. Communication between the shell and micro-frontends for navigation uses Custom Events or a shared routing context.',
        shortAnswer:
          "Shell-based routing: a host app maps top-level URL paths to micro-frontends (e.g., /catalog/* loads the catalog app). Each micro-frontend handles its own sub-routing. Key challenges: shared browser history, navigation interception, deep linking. Frameworks like single-spa formalize this with application registration and active URL patterns.",
        difficulty: "Senior",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-micro-frontends-1",
        tags: ["routing", "single-spa", "navigation", "url-management"],
        commonMistakes: [
          "Each micro-frontend managing its own browser history independently, causing URL conflicts.",
          "Not handling deep links, so direct URL navigation fails to load the correct micro-frontend.",
          "Hard-coding absolute paths in micro-frontends, preventing them from being mounted at different base paths.",
        ],
        followUps: [
          "How does single-spa handle application lifecycle (bootstrap, mount, unmount)?",
          "How do you implement page transitions between micro-frontends?",
        ],
        interviewTips: [
          "Describe the shell-based pattern as the most common and explain why it works well.",
          "Mention specific challenges (history, deep linking) to show you have thought through the details.",
        ],
        relatedTopics: ["React Router", "single-spa", "browser history API"],
      },
      {
        id: "browser-micro-frontends-q4",
        question:
          "What are the trade-offs and when should you NOT use micro-frontends?",
        answer:
          'Micro-frontends are a powerful pattern but carry significant trade-offs that make them inappropriate for many situations. Understanding when not to use them is as important as knowing how to implement them.\n\nThe primary cost is complexity. Instead of one application to build, test, deploy, and monitor, you have many. Each micro-frontend needs its own CI/CD pipeline, deployment infrastructure, error monitoring, and performance tracking. Integration testing becomes harder because the full application is only assembled at runtime. Debugging issues that span micro-frontends requires correlating logs and traces across multiple systems.\n\nPerformance can suffer. Loading multiple independently bundled micro-frontends means potentially downloading duplicate dependencies (multiple copies of React, utility libraries, design system components) if shared dependency management is not configured carefully. Each micro-frontend may also make its own API calls, leading to redundant network requests. The overall JavaScript payload can be significantly larger than a well-optimized monolith.\n\nUX consistency is difficult to maintain. When different teams independently develop their portions of the UI, visual and behavioral inconsistencies creep in — different button styles, inconsistent spacing, varying loading states, different error handling patterns. A shared design system and component library mitigate this but require ongoing investment and governance.\n\nDo NOT use micro-frontends when your team is small (fewer than 3-4 frontend teams working on the same product), when the application is not complex enough to justify the overhead, when all teams use the same technology stack and deploy together, when the application has tight integration requirements (e.g., a highly interactive single-page tool), or when you are starting a new project (start with a well-structured monolith and split later when organizational pain points emerge).\n\nThe "micro-frontend tax" — the ongoing cost of maintaining the integration infrastructure — is only worth paying when the organizational benefits (team autonomy, independent deployment, technology diversity) outweigh the technical costs. Most applications, even moderately large ones, are better served by a modular monolith with clear domain boundaries.',
        shortAnswer:
          "Trade-offs: operational complexity (multiple CI/CD pipelines, monitoring), potential performance degradation (duplicate dependencies), UX inconsistency across teams, and difficult integration testing. Do NOT use micro-frontends for small teams, simple apps, or greenfield projects. Start with a modular monolith and split when organizational scaling pain justifies the overhead.",
        difficulty: "Senior",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-micro-frontends-1",
        tags: ["trade-offs", "decision-making", "architecture", "complexity"],
        commonMistakes: [
          "Adopting micro-frontends because they are trendy, not because the organization needs them.",
          "Underestimating the operational complexity of managing multiple deployed frontend applications.",
          "Not investing in a shared design system, leading to a fragmented user experience.",
        ],
        followUps: [
          "What is a modular monolith and how does it relate to micro-frontends?",
          "How do you migrate from a monolith to micro-frontends incrementally?",
        ],
        interviewTips: [
          "Acknowledge the costs before the benefits — this shows senior-level thinking.",
          "Give a clear recommendation for when to use and when to avoid micro-frontends.",
        ],
        relatedTopics: ["modular monolith", "team topology", "Conway Law"],
      },
      {
        id: "browser-micro-frontends-q5",
        question:
          "How do micro-frontends handle shared state and communication?",
        answer:
          "Communication and shared state between micro-frontends is a fundamental challenge because each micro-frontend should be as independent as possible, yet some data (user session, shopping cart, notifications) must be shared across the application.\n\nCustom DOM events are the simplest and most framework-agnostic approach. Micro-frontends dispatch CustomEvent objects on the window and listen for events from others. This provides loose coupling — producers do not know about consumers and vice versa. The downside is that events are fire-and-forget with no built-in state persistence. If a micro-frontend mounts after an event was fired, it misses the event.\n\nA shared event bus or pub/sub system adds structure to event-based communication. A lightweight library provides subscribe, publish, and optionally getLastValue methods. The bus can be initialized by the shell and passed to micro-frontends or made globally available. This pattern supports late subscribers by replaying the last event.\n\nShared state via URL is another approach. URL query parameters and path segments are naturally shared across all micro-frontends. Filters, search terms, and navigation state in the URL enable cross-micro-frontend coordination without direct communication. The shell manages URL changes and passes relevant segments to each micro-frontend.\n\nFor shared data stores, a lightweight global store (not Redux, which ties teams to a specific library) can hold cross-cutting state like user session, feature flags, and theme preference. The store should be framework-agnostic (plain JavaScript with observer pattern) and injected by the shell. Each micro-frontend subscribes to the slices of state it needs.\n\nModule Federation allows sharing a React context or a Zustand/Jotai store if all micro-frontends use the same framework. The store is exposed by one micro-frontend and imported by others at runtime. This provides the richest integration but creates tight coupling between micro-frontends.\n\nThe key principle is minimizing shared state. Each micro-frontend should own its domain state internally and only share what is genuinely cross-cutting. Excessive shared state recreates the coupling that micro-frontends were designed to eliminate.",
        shortAnswer:
          "Communication options: Custom DOM events (simplest, framework-agnostic), shared event bus (pub/sub with replay), URL state (naturally shared), lightweight global store (for cross-cutting data like user session), or shared framework context via Module Federation. Minimize shared state to maintain independence.",
        difficulty: "Senior",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-micro-frontends-1",
        tags: ["shared-state", "communication", "event-bus", "custom-events"],
        commonMistakes: [
          "Creating a large shared Redux store that couples all micro-frontends together.",
          "Not handling late subscribers who miss events fired before they mounted.",
          "Using direct function calls between micro-frontends, creating tight coupling.",
        ],
        followUps: [
          "How would you implement optimistic updates across micro-frontends?",
          "What is the contract testing approach for micro-frontend communication?",
        ],
        interviewTips: [
          "Recommend the simplest approach (Custom Events) first, then escalate to more complex solutions as needed.",
          "Emphasize the principle of minimizing shared state.",
        ],
        relatedTopics: [
          "event-driven architecture",
          "pub/sub",
          "state management",
        ],
      },
    ],
  },
  {
    id: "browser-indexeddb-1",
    title: "IndexedDB",
    description:
      "Learn the IndexedDB API — databases, object stores, indexes, transactions, cursors, versioning, and offline-first application patterns.",
    category: "Browser",
    difficulty: "Advanced",
    tags: ["browser", "indexeddb", "storage", "offline", "database"],
    overview:
      "IndexedDB is a low-level, transactional, client-side database that can store significant amounts of structured data including files and blobs. It is the foundation for offline-first web applications and progressive web apps.",
    concepts: [
      "Opening databases and version management",
      "Object stores (tables)",
      "Indexes for efficient querying",
      "Transactions (readonly, readwrite)",
      "Cursors for iterating records",
      "Structured cloning for value storage",
      "Versioning and schema migrations",
      "Offline-first application patterns",
    ],
    relatedTopicIds: ["browser-storage-1", "browser-navigator-1"],
    codeExamples: [
      {
        title: "Basic IndexedDB operations with idb wrapper",
        code: 'import { openDB, type IDBPDatabase } from "idb";\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  createdAt: Date;\n}\n\nasync function initDB(): Promise<IDBPDatabase> {\n  return openDB("my-app", 1, {\n    upgrade(db) {\n      const store = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });\n      store.createIndex("email", "email", { unique: true });\n      store.createIndex("createdAt", "createdAt");\n    },\n  });\n}\n\nasync function addUser(user: Omit<User, "id">): Promise<number> {\n  const db = await initDB();\n  return db.add("users", user) as Promise<number>;\n}\n\nasync function getUserByEmail(email: string): Promise<User | undefined> {\n  const db = await initDB();\n  return db.getFromIndex("users", "email", email) as Promise<User | undefined>;\n}\n\nasync function getAllUsers(): Promise<User[]> {\n  const db = await initDB();\n  return db.getAll("users") as Promise<User[]>;\n}\n\nasync function deleteUser(id: number): Promise<void> {\n  const db = await initDB();\n  await db.delete("users", id);\n}',
        language: "typescript",
        explanation:
          "The idb library provides a promise-based wrapper around IndexedDB. This example shows database initialization with schema creation, CRUD operations, and index-based querying.",
      },
      {
        title: "Raw IndexedDB transaction example",
        code: 'function transferFunds(\n  fromAccountId: number,\n  toAccountId: number,\n  amount: number\n): Promise<void> {\n  return new Promise((resolve, reject) => {\n    const request = indexedDB.open("bank", 1);\n\n    request.onsuccess = () => {\n      const db = request.result;\n      const tx = db.transaction("accounts", "readwrite");\n      const store = tx.objectStore("accounts");\n\n      const getFrom = store.get(fromAccountId);\n      getFrom.onsuccess = () => {\n        const from = getFrom.result as { id: number; balance: number };\n        if (from.balance < amount) {\n          tx.abort();\n          return;\n        }\n\n        from.balance -= amount;\n        store.put(from);\n\n        const getTo = store.get(toAccountId);\n        getTo.onsuccess = () => {\n          const to = getTo.result as { id: number; balance: number };\n          to.balance += amount;\n          store.put(to);\n        };\n      };\n\n      tx.oncomplete = () => resolve();\n      tx.onerror = () => reject(tx.error);\n      tx.onabort = () => reject(new Error("Transaction aborted"));\n    };\n  });\n}',
        language: "typescript",
        explanation:
          "Demonstrates a transactional read-modify-write operation. Both account updates happen within a single transaction — if either fails, both are rolled back, ensuring data consistency.",
      },
    ],
    questions: [
      {
        id: "browser-indexeddb-q1",
        question: "What is IndexedDB and how does it differ from Web Storage?",
        answer:
          "IndexedDB is a transactional, object-oriented database built into the browser. It stores key-value pairs where values can be complex structured objects (not just strings), and it supports indexes for efficient querying. It is fundamentally different from Web Storage (localStorage/sessionStorage) in capacity, capability, and use cases.\n\nThe most significant difference is capacity. While Web Storage is limited to approximately 5MB per origin, IndexedDB can store hundreds of megabytes or even gigabytes. The exact limit depends on the browser and available disk space — browsers typically allocate up to 50-80% of available disk space to IndexedDB, with per-origin limits within that pool. This makes IndexedDB suitable for storing large datasets, files, images, and application caches.\n\nIndexedDB stores structured data using the structured clone algorithm, which can handle objects, arrays, dates, Blobs, ArrayBuffers, Maps, Sets, and many other JavaScript types without manual JSON serialization. Web Storage stores only strings, requiring explicit JSON.stringify/parse for complex data.\n\nIndexedDB is asynchronous and transactional. All operations happen within transactions (readonly or readwrite), and the transactional model ensures data consistency even if the browser crashes mid-operation. Web Storage is synchronous and runs on the main thread, which can cause UI jank for large read/write operations.\n\nIndexedDB supports indexes, enabling efficient queries on specific fields without scanning all records. You can create object stores (similar to database tables), define key paths, and create secondary indexes for common query patterns. Web Storage only supports key-based lookup — there is no querying capability.\n\nHowever, the IndexedDB API is notoriously complex and callback-heavy. Libraries like idb (by Jake Archibald) wrap IndexedDB with a promise-based API, and Dexie provides a more ORM-like interface. Web Storage API is simple and intuitive by comparison.\n\nChoose IndexedDB for offline-first applications, large datasets, binary data (images, files), and any scenario requiring queries or indexes. Choose Web Storage for small, simple key-value data like preferences and flags.",
        shortAnswer:
          "IndexedDB is a transactional, asynchronous, client-side database with support for structured data, indexes, and large storage (GBs). Web Storage is synchronous, string-only, limited to 5MB. Use IndexedDB for offline apps, large datasets, and complex queries. Use Web Storage for simple preferences. Libraries like idb simplify the verbose IndexedDB API.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-indexeddb-1",
        tags: ["indexeddb", "web-storage", "comparison", "database"],
        commonMistakes: [
          "Using Web Storage for large datasets when IndexedDB is the appropriate choice.",
          "Not using a wrapper library (idb, Dexie) and struggling with the raw IndexedDB callback API.",
          "Forgetting that IndexedDB operations are asynchronous and trying to read results synchronously.",
        ],
        followUps: [
          "What data types can IndexedDB store that Web Storage cannot?",
          "How does IndexedDB handle concurrent access from multiple tabs?",
        ],
        interviewTips: [
          "Compare on key dimensions: capacity, data types, sync vs async, querying capability.",
          "Mention idb or Dexie to show you use the ecosystem effectively.",
        ],
        relatedTopics: [
          "Web Storage",
          "structured clone algorithm",
          "offline-first",
        ],
      },
      {
        id: "browser-indexeddb-q2",
        question:
          "How do IndexedDB transactions work and why are they important?",
        answer:
          'IndexedDB transactions are the mechanism through which all data operations occur. Every read or write operation must happen within a transaction, which provides atomicity, consistency, and isolation for data operations.\n\nTransactions are created on a database connection by specifying the object stores involved and the mode: "readonly" for reading data or "readwrite" for modifying data. Multiple readonly transactions can run concurrently on the same object stores, but readwrite transactions are serialized — only one readwrite transaction can operate on a given object store at a time. This prevents race conditions and ensures data consistency.\n\nThe atomicity guarantee means that either all operations in a transaction succeed, or none of them do. If a readwrite transaction involves updating two records and the second update fails (or the browser crashes), both updates are rolled back. This is critical for operations like fund transfers where partial completion would corrupt data.\n\nTransactions auto-commit when all outstanding requests within the transaction have completed and no new requests have been made. They also auto-commit if the event loop returns to idle (meaning you cannot keep a transaction alive across asynchronous boundaries like setTimeout or fetch calls). This is a common source of bugs — if you make a network request inside a transaction, the transaction will commit before the network response arrives.\n\nTo abort a transaction explicitly, call transaction.abort(), which rolls back all changes made in that transaction. The transaction.oncomplete event fires when the transaction successfully commits, transaction.onerror fires when a request error is not handled, and transaction.onabort fires when the transaction is aborted.\n\nA key optimization is batching operations in a single transaction. Opening a new transaction has overhead, so performing multiple reads or writes within one transaction is more efficient than opening a separate transaction for each operation. For bulk inserts, a single readwrite transaction with many put calls is dramatically faster than separate transactions.',
        shortAnswer:
          "All IndexedDB operations happen within transactions (readonly or readwrite). Transactions provide atomicity (all or nothing), consistency, and isolation. They auto-commit when all requests complete. Cannot span async boundaries (network calls). Multiple readonly transactions run concurrently; readwrite transactions are serialized per object store.",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-indexeddb-1",
        tags: ["transactions", "atomicity", "readwrite", "readonly"],
        commonMistakes: [
          "Performing async operations (fetch, setTimeout) inside a transaction — the transaction auto-commits before the async operation completes.",
          "Opening a new transaction for every individual read or write instead of batching operations.",
          "Not handling transaction errors, leading to silent data corruption.",
        ],
        followUps: [
          "What happens when two tabs try to write to the same object store simultaneously?",
          "How does IndexedDB handle version changes across tabs?",
        ],
        interviewTips: [
          "Explain the auto-commit behavior and the async boundary limitation — these are the most common gotchas.",
          "Mention the performance benefit of batching operations in a single transaction.",
        ],
        relatedTopics: [
          "ACID properties",
          "database transactions",
          "concurrency control",
        ],
      },
      {
        id: "browser-indexeddb-q3",
        question: "How does IndexedDB versioning and schema migration work?",
        answer:
          'IndexedDB uses a version-based schema management system. Every database has an integer version number, and schema changes (creating/deleting object stores, creating/deleting indexes) can only happen inside the onupgradeneeded callback that fires when a database is opened with a higher version number than the currently stored version.\n\nWhen you call indexedDB.open("mydb", 2), the browser compares the requested version (2) with the current database version. If the current version is lower (e.g., 1), the onupgradeneeded event fires with the old version and new version numbers. Inside this callback, you perform schema changes: creating new object stores, adding indexes, migrating data. The upgrade runs within a special "versionchange" transaction that has exclusive access to the database — all other connections are blocked until the upgrade completes.\n\nMigrations should be written incrementally, not as a single "build from scratch" operation. This ensures users upgrading from any previous version get the correct schema. For example, a migration from version 1 to version 3 should apply the v1-to-v2 changes first, then the v2-to-v3 changes. Checking the old version number inside onupgradeneeded lets you chain migrations.\n\nData migration (transforming existing records to match a new schema) is more complex. You can read records using cursors inside onupgradeneeded and write them back with the new structure. However, the versionchange transaction blocks all other database connections, so long migrations can disrupt the user experience. For large data migrations, consider doing them lazily — marking records as needing migration and transforming them on read.\n\nThe onblocked event fires when an upgrade is needed but another tab has an open connection to the old version. The other tab should listen for the versionchange event on its database connection and close it promptly. If it does not, the upgrade remains blocked. A well-behaved application listens for versionchange and calls db.close() immediately, then reloads the page.',
        shortAnswer:
          "IndexedDB uses integer versions. Schema changes happen in the onupgradeneeded callback when opening a database with a higher version. Write incremental migrations checking the old version. The versionchange transaction blocks all other connections. Handle the onblocked event for multi-tab scenarios by listening for versionchange and closing connections.",
        code: 'import { openDB } from "idb";\n\nconst db = await openDB("my-app", 3, {\n  upgrade(db, oldVersion, newVersion, transaction) {\n    // Migration from v0 (new database) to v1\n    if (oldVersion < 1) {\n      const store = db.createObjectStore("users", { keyPath: "id" });\n      store.createIndex("email", "email", { unique: true });\n    }\n\n    // Migration from v1 to v2: add posts store\n    if (oldVersion < 2) {\n      const posts = db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });\n      posts.createIndex("authorId", "authorId");\n      posts.createIndex("createdAt", "createdAt");\n    }\n\n    // Migration from v2 to v3: add index to users\n    if (oldVersion < 3) {\n      const userStore = transaction.objectStore("users");\n      userStore.createIndex("createdAt", "createdAt");\n    }\n  },\n  blocked() {\n    console.warn("Database upgrade blocked by another tab");\n  },\n  blocking() {\n    // Another tab is trying to upgrade — close our connection\n    db.close();\n    window.location.reload();\n  },\n});',
        language: "typescript",
        difficulty: "Advanced",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-indexeddb-1",
        tags: ["versioning", "migration", "schema", "upgrade"],
        commonMistakes: [
          "Writing a single migration that rebuilds the schema from scratch instead of incremental migrations.",
          "Not handling the onblocked event, causing the upgrade to hang silently.",
          "Trying to modify schema outside of onupgradeneeded, which throws an error.",
        ],
        followUps: [
          "How would you handle a large data migration without blocking the user?",
          "What happens if a user has multiple tabs open during a database upgrade?",
        ],
        interviewTips: [
          "Emphasize the incremental migration pattern and the multi-tab blocking issue.",
          "Show the version check pattern (if oldVersion < N) for chaining migrations.",
        ],
        relatedTopics: [
          "database migrations",
          "schema management",
          "multi-tab coordination",
        ],
      },
      {
        id: "browser-indexeddb-q4",
        question:
          "What are practical use cases for IndexedDB in modern web applications?",
        answer:
          "IndexedDB is the go-to client-side storage solution for several important web application patterns, particularly those requiring large data storage, offline capabilities, or complex querying.\n\nOffline-first applications are the primary use case. Progressive Web Apps (PWAs) use IndexedDB to store application data locally so the app remains functional without an internet connection. When connectivity returns, changes are synced to the server. This pattern is critical for field workers, travelers, and users on unreliable networks. The Service Worker handles caching network responses (using the Cache API), while IndexedDB stores the application structured data.\n\nClient-side caching of API responses reduces server load and improves perceived performance. Instead of fetching the same data repeatedly, applications store API responses in IndexedDB with timestamps and serve them from the local database. Stale data can be refreshed in the background (stale-while-revalidate pattern). This is particularly effective for data that changes infrequently, like product catalogs, user profiles, and configuration.\n\nLarge file and media storage is another key use case. IndexedDB can store Blobs and ArrayBuffers, making it suitable for caching images, videos, audio files, and documents. A music streaming app might cache recently played songs, a document editor might store draft files, or a mapping app might cache map tiles for offline use.\n\nComplex data with relationships benefits from IndexedDB indexes. Applications with search functionality can create full-text-like indexes, and data that needs to be queried by multiple fields (date ranges, categories, tags) is well-served by IndexedDB secondary indexes.\n\nClient-side data processing applications, such as data visualization tools or spreadsheet apps, can load large datasets into IndexedDB and process them locally using cursors and transactions, avoiding round trips to the server for every query.\n\nState persistence for complex applications (form wizards, multi-step workflows, draft editors) uses IndexedDB to save and restore application state across browser sessions, preventing data loss from accidental page closes or browser crashes.",
        shortAnswer:
          "Key use cases: offline-first PWAs (data sync when online), API response caching (stale-while-revalidate), large file/media storage (Blobs, ArrayBuffers), complex queryable data with indexes, client-side data processing, and state persistence for long workflows. IndexedDB is the foundation for any serious offline or data-heavy web app.",
        difficulty: "Advanced",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-indexeddb-1",
        tags: ["offline-first", "pwa", "caching", "use-cases"],
        commonMistakes: [
          "Using localStorage for offline data storage when IndexedDB is far more capable and performant.",
          "Not implementing proper sync strategies for offline-first apps, leading to data conflicts.",
          "Storing too much data without cleanup strategies, consuming excessive disk space.",
        ],
        followUps: [
          "How do you handle data conflicts in an offline-first sync architecture?",
          "How does the Cache API complement IndexedDB in a PWA?",
        ],
        interviewTips: [
          "Give specific, practical examples rather than abstract descriptions.",
          "Mention the offline-first pattern as the primary motivation for IndexedDB.",
        ],
        relatedTopics: [
          "Service Workers",
          "Cache API",
          "PWA",
          "data synchronization",
        ],
      },
      {
        id: "browser-indexeddb-q5",
        question: "How do indexes and cursors work in IndexedDB?",
        answer:
          'Indexes and cursors are the two mechanisms IndexedDB provides for efficient data retrieval beyond simple key-based lookups. They are analogous to database indexes and result set iteration in traditional databases.\n\nAn index is a secondary lookup structure on an object store that allows you to query records by a field other than the primary key. When you create an index on the "email" field of a "users" object store, IndexedDB maintains a sorted mapping from email values to the corresponding records. Querying by email using the index is an O(log n) operation rather than a full scan of all records.\n\nIndexes are created during database upgrades using store.createIndex(indexName, keyPath, options). The keyPath specifies which field to index, and options include unique (whether duplicate values are allowed) and multiEntry (for array fields, whether each array element should be indexed separately). For example, multiEntry on a "tags" field means you can look up all records that contain a specific tag.\n\nCursors provide a way to iterate over records in an object store or index one at a time, in order. They are essential for processing large result sets without loading all records into memory at once. You open a cursor on a store or index, optionally specifying a key range (IDBKeyRange) to limit the results.\n\nIDBKeyRange provides methods for range queries: only(value) matches a single key, lowerBound(value) matches keys greater than or equal to a value, upperBound(value) matches keys less than or equal to a value, and bound(lower, upper) matches keys within a range. These ranges work with cursors and also with getAll and count methods.\n\nCursors can iterate in ascending (next) or descending (prev) order and can skip duplicate index keys (nextunique, prevunique). For each position, the cursor provides the key, primary key, and value. Calling cursor.continue() advances to the next record, and cursor.advance(n) skips n records.\n\nIn practice, wrapper libraries like idb and Dexie abstract cursors into more familiar patterns like getAll with filtering, making IndexedDB feel more like a modern database API.',
        shortAnswer:
          "Indexes are secondary lookup structures enabling O(log n) queries on non-primary-key fields. Create them with createIndex() during upgrades. Cursors iterate over records one at a time in order, with IDBKeyRange for range queries (lowerBound, upperBound, bound). Wrapper libraries like idb and Dexie simplify cursor-based iteration.",
        code: '// Using cursors with IDBKeyRange (raw API)\nfunction getUsersCreatedAfter(date: Date): Promise<Array<{ name: string; createdAt: Date }>> {\n  return new Promise((resolve, reject) => {\n    const request = indexedDB.open("my-app", 1);\n    request.onsuccess = () => {\n      const db = request.result;\n      const tx = db.transaction("users", "readonly");\n      const store = tx.objectStore("users");\n      const index = store.index("createdAt");\n\n      const range = IDBKeyRange.lowerBound(date);\n      const results: Array<{ name: string; createdAt: Date }> = [];\n      const cursorReq = index.openCursor(range);\n\n      cursorReq.onsuccess = () => {\n        const cursor = cursorReq.result;\n        if (cursor) {\n          results.push(cursor.value as { name: string; createdAt: Date });\n          cursor.continue();\n        } else {\n          resolve(results);\n        }\n      };\n      cursorReq.onerror = () => reject(cursorReq.error);\n    };\n  });\n}\n\n// Same with idb (much cleaner)\nimport { openDB } from "idb";\n\nasync function getUsersAfterDate(date: Date): Promise<unknown[]> {\n  const db = await openDB("my-app", 1);\n  return db.getAllFromIndex("users", "createdAt", IDBKeyRange.lowerBound(date));\n}',
        language: "typescript",
        difficulty: "Advanced",
        type: "Coding",
        category: "Browser",
        topicId: "browser-indexeddb-1",
        tags: ["indexes", "cursors", "idb-key-range", "querying"],
        commonMistakes: [
          "Not creating indexes for commonly queried fields, resulting in full object store scans.",
          "Loading all records with getAll when only a subset is needed — use cursors or key ranges.",
          "Forgetting the multiEntry option for array fields, making tag-based queries impossible.",
        ],
        followUps: [
          "How would you implement pagination with cursors?",
          "What is the performance difference between getAll and cursor iteration?",
        ],
        interviewTips: [
          "Compare indexes to SQL database indexes for clarity.",
          "Show both the raw API and the idb wrapper to demonstrate you understand the underlying mechanism and the practical approach.",
        ],
        relatedTopics: ["database indexes", "B-tree", "range queries"],
      },
    ],
  },
  {
    id: "browser-navigator-1",
    title: "Navigator API",
    description:
      "Explore the Navigator API — user agent detection, geolocation, permissions, clipboard, share, service workers, and online/offline events.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "navigator", "api", "service-worker", "geolocation"],
    overview:
      "The Navigator API exposes information about the browser and device, and provides access to powerful platform capabilities like geolocation, clipboard, sharing, and service worker registration.",
    concepts: [
      "navigator.userAgent and Client Hints",
      "navigator.onLine and online/offline events",
      "Service Worker registration",
      "Geolocation API",
      "Permissions API",
      "Clipboard API",
      "Web Share API",
      "navigator.language and platform detection",
    ],
    relatedTopicIds: [
      "browser-indexeddb-1",
      "browser-storage-1",
      "browser-devtools-1",
    ],
    codeExamples: [
      {
        title: "Common Navigator API usage patterns",
        code: '// Online/offline detection\nconsole.log("Online:", navigator.onLine);\nwindow.addEventListener("online", () => console.log("Back online"));\nwindow.addEventListener("offline", () => console.log("Went offline"));\n\n// Language and platform\nconsole.log("Language:", navigator.language); // "en-US"\nconsole.log("Languages:", navigator.languages); // ["en-US", "en"]\n\n// Service Worker registration\nif ("serviceWorker" in navigator) {\n  navigator.serviceWorker.register("/sw.js")\n    .then((reg) => console.log("SW registered:", reg.scope))\n    .catch((err) => console.error("SW registration failed:", err));\n}\n\n// Check device memory and connection\nconst nav = navigator as Record<string, unknown>;\nconst conn = nav.connection as Record<string, unknown> | undefined;\nconsole.log("Device memory:", nav.deviceMemory, "GB");\nconsole.log("Connection type:", conn?.effectiveType);',
        language: "typescript",
        explanation:
          "Demonstrates common Navigator properties for feature detection, connectivity monitoring, service worker setup, and device capability detection.",
      },
      {
        title: "Clipboard and Share APIs",
        code: '// Modern Clipboard API (requires secure context)\nasync function copyToClipboard(text: string): Promise<boolean> {\n  try {\n    await navigator.clipboard.writeText(text);\n    return true;\n  } catch {\n    // Fallback for older browsers or denied permission\n    const textarea = document.createElement("textarea");\n    textarea.value = text;\n    textarea.style.position = "fixed";\n    textarea.style.opacity = "0";\n    document.body.appendChild(textarea);\n    textarea.select();\n    const success = document.execCommand("copy");\n    document.body.removeChild(textarea);\n    return success;\n  }\n}\n\n// Web Share API\nasync function shareContent(title: string, text: string, url: string): Promise<void> {\n  if (navigator.share) {\n    await navigator.share({ title, text, url });\n  } else {\n    await copyToClipboard(url);\n    alert("Link copied to clipboard!");\n  }\n}',
        language: "typescript",
        explanation:
          "The Clipboard API requires a secure context (HTTPS). The Share API triggers the native OS share sheet on mobile devices. Both need feature detection for graceful fallback.",
      },
    ],
    questions: [
      {
        id: "browser-navigator-q1",
        question:
          "How do you properly detect browser features and capabilities using the Navigator API?",
        answer:
          'Feature detection is the practice of checking whether a browser supports a specific API before using it, rather than detecting the browser identity via the user agent string. It is the recommended approach for writing cross-browser compatible code.\n\nThe basic pattern is checking if a property or method exists on the navigator object or other global objects. For example, "serviceWorker" in navigator checks if the Service Worker API is available, navigator.share !== undefined checks for the Web Share API, and "geolocation" in navigator checks for geolocation support. This is more reliable than user agent parsing because it directly tests capability.\n\nThe user agent string (navigator.userAgent) has historically been used for browser detection, but it has become unreliable. Browser vendors have extended and modified user agent strings over decades, leading to complex, misleading values. Chrome user agent string includes "Safari" and "Mozilla" for compatibility reasons. Modern browsers are moving toward freezing the user agent string and replacing it with User-Agent Client Hints (navigator.userAgentData), which provides structured information about the browser, platform, and whether it is a mobile device.\n\nFor responsive feature adaptation, combine feature detection with the Permissions API. Before using the geolocation API, check if the permission has been granted, denied, or if the user will be prompted. This enables adaptive UI — show a location button only if geolocation is available and not denied.\n\nThe navigator.onLine property and online/offline events enable connectivity-aware applications. However, navigator.onLine only indicates whether the device has a network connection, not whether the internet is actually reachable. A device can be connected to a WiFi network that has no internet access but navigator.onLine will still be true. For reliable connectivity detection, combine onLine checks with periodic fetch requests to a known endpoint.\n\nFor more detailed device capabilities, navigator.connection (Network Information API) provides effectiveType (2g, 3g, 4g), downlink speed, and RTT. navigator.deviceMemory reports the approximate device RAM. These help deliver appropriate content — serving lower-resolution images on slow connections or reducing animations on low-memory devices.',
        shortAnswer:
          'Use feature detection ("serviceWorker" in navigator) instead of user agent parsing. Check API availability directly, use the Permissions API for permission state, and navigator.onLine for connectivity. navigator.userAgent is unreliable; prefer User-Agent Client Hints. Combine navigator.connection and deviceMemory for adaptive content delivery.',
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-navigator-1",
        tags: [
          "feature-detection",
          "user-agent",
          "permissions",
          "capabilities",
        ],
        commonMistakes: [
          "Parsing the user agent string for browser detection instead of using feature detection.",
          "Assuming navigator.onLine means the internet is reachable — it only indicates a network connection exists.",
          "Not providing fallbacks when a feature is not available, breaking the app in older browsers.",
        ],
        followUps: [
          "What are User-Agent Client Hints and how do they replace the user agent string?",
          "How does the Permissions API work?",
        ],
        interviewTips: [
          "Emphasize feature detection over user agent parsing as a best practice.",
          "Mention the navigator.onLine limitation to show practical experience.",
        ],
        relatedTopics: [
          "progressive enhancement",
          "polyfills",
          "responsive design",
        ],
      },
      {
        id: "browser-navigator-q2",
        question:
          "How does the Geolocation API work and what are its privacy considerations?",
        answer:
          'The Geolocation API (navigator.geolocation) provides access to the device geographical position. It is one of the most commonly used navigator APIs and requires explicit user permission due to privacy sensitivity.\n\nThe API provides two methods: getCurrentPosition() for a one-time position lookup and watchPosition() for continuous position tracking. Both accept a success callback (receiving a GeolocationPosition object), an error callback, and an options object. The options include enableHighAccuracy (uses GPS on mobile, slower but more precise), timeout (maximum time to wait for a position), and maximumAge (accept a cached position if it is not older than this value in milliseconds).\n\nThe GeolocationPosition object contains a coords property with latitude, longitude, accuracy (in meters), and optionally altitude, altitudeAccuracy, heading, and speed. The timestamp property indicates when the position was determined. Accuracy varies significantly — GPS can provide 5-meter accuracy, while WiFi-based positioning might be 50-200 meters, and IP-based positioning can be off by kilometers.\n\nPrivacy is a primary concern. The browser always prompts the user for permission before sharing location data. The Permissions API (navigator.permissions.query) can check the current permission state (granted, denied, or prompt) without triggering a prompt, enabling adaptive UI. Modern browsers show a prominent permission dialog, and some (especially Safari) periodically re-prompt to remind users. HTTPS is required — the Geolocation API is not available on insecure HTTP origins.\n\nBest practices include requesting location only when the user takes an action that implies location need (clicking a "Find nearby" button, not on page load), providing a clear explanation of why location is needed before the browser prompt appears, gracefully handling denial (offer manual location entry), minimizing precision when high accuracy is not needed (enableHighAccuracy: false), and being transparent about how location data is used and stored.',
        shortAnswer:
          "The Geolocation API provides getCurrentPosition() and watchPosition() for one-time and continuous location. It requires user permission (HTTPS only). Options include enableHighAccuracy, timeout, and maximumAge. Always handle permission denial gracefully, request location only on user action, and be transparent about data usage.",
        code: 'interface LocationResult {\n  latitude: number;\n  longitude: number;\n  accuracy: number;\n}\n\nfunction getUserLocation(): Promise<LocationResult> {\n  return new Promise((resolve, reject) => {\n    if (!("geolocation" in navigator)) {\n      reject(new Error("Geolocation not supported"));\n      return;\n    }\n\n    navigator.geolocation.getCurrentPosition(\n      (position) => {\n        resolve({\n          latitude: position.coords.latitude,\n          longitude: position.coords.longitude,\n          accuracy: position.coords.accuracy,\n        });\n      },\n      (error) => {\n        switch (error.code) {\n          case error.PERMISSION_DENIED:\n            reject(new Error("Location permission denied"));\n            break;\n          case error.POSITION_UNAVAILABLE:\n            reject(new Error("Position unavailable"));\n            break;\n          case error.TIMEOUT:\n            reject(new Error("Location request timed out"));\n            break;\n          default:\n            reject(new Error("Unknown geolocation error"));\n        }\n      },\n      {\n        enableHighAccuracy: false,\n        timeout: 10000,\n        maximumAge: 300000, // Accept cached position up to 5 minutes old\n      }\n    );\n  });\n}\n\n// Check permission state without triggering prompt\nasync function checkLocationPermission(): Promise<PermissionState> {\n  const result = await navigator.permissions.query({ name: "geolocation" });\n  return result.state; // "granted", "denied", or "prompt"\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Browser",
        topicId: "browser-navigator-1",
        tags: ["geolocation", "privacy", "permissions", "location"],
        commonMistakes: [
          "Requesting location on page load without user action, causing poor UX and likely denial.",
          "Not handling all error codes (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT).",
          "Always using enableHighAccuracy: true when approximate location would suffice, draining battery.",
        ],
        followUps: [
          "How does the browser determine location (GPS, WiFi, IP)?",
          "What is the difference between getCurrentPosition and watchPosition?",
        ],
        interviewTips: [
          "Mention the privacy-first approach: explain why you need location before requesting it.",
          "Show you handle all error cases, not just the success path.",
        ],
        relatedTopics: [
          "Permissions API",
          "progressive enhancement",
          "privacy",
        ],
      },
      {
        id: "browser-navigator-q3",
        question: "How do Service Workers relate to the Navigator API?",
        answer:
          'Service Workers are registered through the navigator.serviceWorker API, making the Navigator the entry point for one of the most powerful web platform capabilities. Service Workers act as a programmable network proxy between the browser and the server, enabling offline functionality, push notifications, and background sync.\n\nRegistration happens via navigator.serviceWorker.register("/sw.js", { scope: "/" }). The scope defines which URLs the Service Worker controls — by default, it is the directory containing the service worker script. The registration returns a promise that resolves with a ServiceWorkerRegistration object, which provides access to the installing, waiting, and active service worker states.\n\nThe Service Worker lifecycle is important to understand. After registration, the browser downloads the script and fires the install event, where you typically cache essential assets. The worker then enters a waiting state until all tabs with the old version are closed (or you call skipWaiting). Once activated, the activate event fires, where you clean up old caches. After activation, the worker intercepts all fetch requests within its scope.\n\nThe navigator.serviceWorker.controller property references the active Service Worker controlling the current page, or null if none is active. The navigator.serviceWorker.ready property returns a promise that resolves when a service worker is active and controlling the page, useful for features that depend on a service worker being present.\n\nCommunication between the page and service worker uses postMessage. The page sends messages via navigator.serviceWorker.controller.postMessage(), and the service worker responds via client.postMessage(). The MessageChannel API enables two-way communication with response callbacks.\n\nService Workers are a foundational technology for Progressive Web Apps (PWAs). They enable offline pages (via Cache API), push notifications (via Push API), background sync (via Background Sync API), and periodic sync. They require HTTPS (except on localhost for development) and run in a separate thread from the main page, so they cannot access the DOM directly.',
        shortAnswer:
          "Service Workers are registered via navigator.serviceWorker.register(). They act as a programmable network proxy for offline support, push notifications, and background sync. The lifecycle is: install (cache assets) -> wait -> activate (cleanup old caches) -> control fetches. Requires HTTPS. Communicate with pages via postMessage.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-navigator-1",
        tags: ["service-worker", "offline", "pwa", "caching"],
        commonMistakes: [
          "Not understanding the waiting phase — new service workers do not activate until old tabs are closed.",
          "Caching too many resources during install, causing slow first visits.",
          "Forgetting that service workers cannot access the DOM — they run in a separate thread.",
          "Not implementing a cache invalidation strategy, serving stale content indefinitely.",
        ],
        followUps: [
          "What caching strategies can a Service Worker implement?",
          "How does skipWaiting() affect the service worker lifecycle?",
          "What is the difference between the Cache API and IndexedDB in a Service Worker context?",
        ],
        interviewTips: [
          "Walk through the lifecycle: register, install, wait, activate, control.",
          "Mention that service workers are the foundation for PWA capabilities.",
        ],
        relatedTopics: ["Cache API", "Push API", "Background Sync", "PWA"],
      },
      {
        id: "browser-navigator-q4",
        question: "How do the Clipboard and Web Share APIs work?",
        answer:
          'The Clipboard API and Web Share API are modern Navigator capabilities that enable web applications to interact with system-level features — the clipboard for copy/paste and the native share sheet for content sharing.\n\nThe Clipboard API (navigator.clipboard) provides asynchronous methods for reading and writing to the system clipboard. writeText(text) copies text to the clipboard and returns a promise. readText() reads text from the clipboard (requires the "clipboard-read" permission, which prompts the user). write() and read() support rich content including images via ClipboardItem objects. The Clipboard API requires a secure context (HTTPS) and only works in response to a user gesture (click, keypress) to prevent background clipboard access.\n\nBefore the modern Clipboard API, the only option was document.execCommand("copy") and document.execCommand("paste"), which are synchronous and deprecated. A robust implementation should try the modern API first and fall back to execCommand for older browsers.\n\nThe Web Share API (navigator.share) triggers the native operating system share dialog, allowing users to share content via installed apps (messaging, social media, email). It accepts an object with title, text, url, and optionally files. The API is primarily useful on mobile devices where the native share sheet provides a consistent, familiar UX. On desktop, browser support varies — Chrome and Edge support it, while Firefox has limited support.\n\nnavigator.canShare() checks whether the content can be shared (useful for validating file types before attempting to share). Like the Clipboard API, navigator.share() must be called in response to a user gesture. The promise it returns resolves when the user successfully shares or rejects if they cancel the share dialog.\n\nBoth APIs exemplify progressive enhancement: check for availability, use the modern API when available, and provide a fallback (manual copy, share link display) when not. This ensures the feature works across all browsers while providing the best experience where supported.',
        shortAnswer:
          'The Clipboard API (navigator.clipboard) provides async writeText/readText for clipboard access. Requires HTTPS and user gesture. Web Share API (navigator.share) opens the native OS share dialog with title, text, url, and files. Both require feature detection and user gesture. Fall back to execCommand("copy") or link display for unsupported browsers.',
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-navigator-1",
        tags: ["clipboard", "share", "navigator", "progressive-enhancement"],
        commonMistakes: [
          "Trying to use navigator.clipboard without a user gesture, which is silently blocked.",
          "Not providing a fallback for browsers that do not support navigator.share.",
          "Assuming the Web Share API works on all desktop browsers — it is primarily a mobile feature.",
        ],
        followUps: [
          "How do you share files using the Web Share API?",
          "What permissions does clipboard read require vs clipboard write?",
        ],
        interviewTips: [
          "Demonstrate progressive enhancement: try modern API, fall back to older API, then manual approach.",
          "Mention the user gesture requirement as a security measure.",
        ],
        relatedTopics: ["progressive enhancement", "mobile UX", "permissions"],
      },
      {
        id: "browser-navigator-q5",
        question:
          "How do you handle online/offline detection and build connectivity-aware applications?",
        answer:
          "Building connectivity-aware applications requires detecting network status changes and adapting the application behavior accordingly. The Navigator API provides basic tools, but a robust implementation needs additional strategies.\n\nThe navigator.onLine property returns a boolean indicating whether the browser has a network connection. The online and offline events fire on the window object when connectivity changes. However, navigator.onLine is unreliable for determining actual internet reachability — it returns true as long as the device has any network interface active, even if the network has no internet access (e.g., connected to a WiFi captive portal).\n\nFor reliable connectivity detection, combine navigator.onLine with active probing. When navigator.onLine is true, periodically fetch a small, known resource (like a 1-pixel image or a HEAD request to your API health endpoint) to verify actual reachability. This approach detects scenarios like captive portals, DNS failures, and proxy issues that navigator.onLine cannot detect.\n\nA connectivity-aware application should have several behaviors. When going offline, queue outgoing requests (API calls, form submissions) for later replay, show a clear offline indicator to the user, disable features that require connectivity (like real-time search), and serve cached content via service worker. When coming back online, replay queued requests in order, resolve any conflicts between local changes and server state, update the UI to reflect online status, and fetch fresh data to replace stale cache.\n\nThe Background Sync API (accessed via service worker registration) provides a reliable way to defer actions until connectivity is restored. Instead of queuing requests in application code, you register a sync event, and the browser automatically triggers it when connectivity returns — even if the user has navigated away from or closed the app.\n\nFor data synchronization, the common patterns are last-write-wins (simplest, server version overwrites local), client-wins (local changes always override), server-wins (server state always overrides), and merge (attempt to combine changes, flagging conflicts for manual resolution). The right strategy depends on the application domain and data sensitivity.",
        shortAnswer:
          "Use navigator.onLine and online/offline events for basic detection, but verify with active probing (fetch a health endpoint) since onLine does not confirm internet reachability. When offline: queue requests, show indicator, serve cached content. When online: replay queue, sync data, resolve conflicts. Use Background Sync API for reliable deferred actions.",
        code: 'class ConnectivityMonitor {\n  private isOnline = navigator.onLine;\n  private listeners: Array<(online: boolean) => void> = [];\n  private probeInterval: ReturnType<typeof setInterval> | null = null;\n\n  constructor(private probeUrl: string = "/api/health") {\n    window.addEventListener("online", () => this.check());\n    window.addEventListener("offline", () => this.update(false));\n    this.startProbing();\n  }\n\n  private async check(): Promise<void> {\n    if (!navigator.onLine) {\n      this.update(false);\n      return;\n    }\n    try {\n      const response = await fetch(this.probeUrl, {\n        method: "HEAD",\n        cache: "no-store",\n        signal: AbortSignal.timeout(5000),\n      });\n      this.update(response.ok);\n    } catch {\n      this.update(false);\n    }\n  }\n\n  private update(online: boolean): void {\n    if (this.isOnline !== online) {\n      this.isOnline = online;\n      this.listeners.forEach((fn) => fn(online));\n    }\n  }\n\n  private startProbing(): void {\n    this.probeInterval = setInterval(() => this.check(), 30000);\n  }\n\n  onChange(callback: (online: boolean) => void): () => void {\n    this.listeners.push(callback);\n    return () => {\n      this.listeners = this.listeners.filter((fn) => fn !== callback);\n    };\n  }\n\n  getStatus(): boolean {\n    return this.isOnline;\n  }\n\n  destroy(): void {\n    if (this.probeInterval) clearInterval(this.probeInterval);\n  }\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Coding",
        category: "Browser",
        topicId: "browser-navigator-1",
        tags: ["online-offline", "connectivity", "resilience", "sync"],
        commonMistakes: [
          "Relying solely on navigator.onLine without active probing, missing captive portal and DNS failure scenarios.",
          "Not queuing failed requests for retry, losing user data when connectivity drops.",
          "Not showing clear offline indicators, leaving users confused about why features are not working.",
        ],
        followUps: [
          "How does the Background Sync API work?",
          "What conflict resolution strategy would you use for a collaborative editing app?",
        ],
        interviewTips: [
          "Explain why navigator.onLine alone is insufficient with a concrete example (captive portal).",
          "Describe both the detection and the application behavior changes to show end-to-end thinking.",
        ],
        relatedTopics: [
          "Background Sync",
          "service workers",
          "offline-first",
          "data sync",
        ],
      },
    ],
  },
  {
    id: "browser-devtools-1",
    title: "Chrome DevTools",
    description:
      "Master Chrome DevTools panels — Elements, Console, Sources, Network, Performance, Memory, Application, and Lighthouse for effective debugging and optimization.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "devtools", "debugging", "performance", "chrome"],
    overview:
      "Chrome DevTools is an essential toolkit for web developers, providing comprehensive capabilities for inspecting, debugging, profiling, and optimizing web applications. Knowing how to effectively use each panel is a critical skill.",
    concepts: [
      "Elements panel (DOM/CSS inspection)",
      "Console panel (API and log levels)",
      "Sources panel (breakpoints and debugging)",
      "Network panel (waterfall, throttling, filtering)",
      "Performance panel (profiling, flame chart)",
      "Memory panel (heap snapshots, leak detection)",
      "Application panel (storage, service workers)",
      "Lighthouse (audits and scores)",
    ],
    relatedTopicIds: [
      "browser-rendering-1",
      "browser-web-vitals-1",
      "browser-debugging-1",
    ],
    codeExamples: [
      {
        title: "Console API techniques for debugging",
        code: '// Structured table output\nconst users = [\n  { name: "Alice", role: "admin", active: true },\n  { name: "Bob", role: "user", active: false },\n];\nconsole.table(users);\n\n// Grouped logging\nconsole.group("API Request");\nconsole.log("URL:", "/api/users");\nconsole.log("Method:", "GET");\nconsole.log("Headers:", { Authorization: "Bearer ..." });\nconsole.groupEnd();\n\n// Performance timing\nconsole.time("dataFetch");\nawait fetch("/api/data");\nconsole.timeEnd("dataFetch"); // "dataFetch: 245.3ms"\n\n// Conditional logging\nconsole.assert(users.length > 0, "Users array should not be empty");\n\n// Stack trace\nconsole.trace("Called from here");',
        language: "typescript",
        explanation:
          "Beyond console.log, the Console API provides structured output (table), grouping, timing, assertions, and stack traces for more effective debugging.",
      },
      {
        title: "Performance monitoring with DevTools API",
        code: '// Mark and measure for Performance panel\nperformance.mark("renderStart");\n// ... rendering work ...\nperformance.mark("renderEnd");\nperformance.measure("renderTime", "renderStart", "renderEnd");\n\nconst entries = performance.getEntriesByName("renderTime");\nconsole.log("Render took:", entries[0].duration, "ms");\n\n// Long Task observer\nconst observer = new PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    console.warn("Long task detected:", entry.duration, "ms", entry);\n  }\n});\nobserver.observe({ entryTypes: ["longtask"] });\n\n// Resource timing\nconst resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];\nresources.forEach((r) => {\n  if (r.duration > 1000) {\n    console.warn("Slow resource:", r.name, r.duration.toFixed(0) + "ms");\n  }\n});',
        language: "typescript",
        explanation:
          "The Performance API lets you add custom marks and measures that appear in the DevTools Performance panel, and observe long tasks that may cause jank.",
      },
    ],
    questions: [
      {
        id: "browser-devtools-q1",
        question:
          "How do you use the Network panel to debug API and loading issues?",
        answer:
          'The Network panel records all HTTP requests and responses made by the page, providing detailed information about timing, headers, payloads, and caching behavior. It is essential for debugging API issues, performance problems, and loading failures.\n\nThe request waterfall is the centerpiece, showing every request chronologically with colored bars indicating different timing phases: DNS lookup, initial connection, TLS handshake, waiting for server response (TTFB), and content download. Long blue bars (waiting) indicate slow server processing, while long gray bars (stalled) indicate browser queuing due to connection limits.\n\nFiltering is critical for focusing on specific request types. The filter bar supports type filters (XHR, JS, CSS, Img, Media, Font, WS), text search (any part of the URL), regular expressions, status code filtering (status-code:404), domain filtering (domain:api.example.com), and negative filters (-extension:woff2). The "Has blocked cookies" and "Blocked Requests" filters help debug CORS and cookie issues.\n\nFor API debugging, clicking a request reveals its Headers tab (request and response headers), Payload tab (request body), Preview tab (formatted response), Response tab (raw response), and Timing tab (detailed waterfall breakdown). The Initiator tab shows which JavaScript code triggered the request, which is invaluable for tracking down unexpected API calls.\n\nNetwork throttling simulates slow connections (3G, slow 3G, offline) to test how the application behaves under poor network conditions. This is crucial for ensuring good user experience on mobile networks. The "Disable cache" checkbox ensures you see fresh responses during development.\n\nThe "Preserve log" checkbox keeps network records across page navigations, useful for debugging redirect chains or form submissions that navigate away from the page. The "Record" button can be paused and resumed. Copy as cURL from the context menu lets you reproduce a request in the terminal with all headers and cookies, perfect for sharing with backend developers.',
        shortAnswer:
          "The Network panel shows all HTTP requests with timing waterfall, headers, payloads, and response data. Key features: type/text filtering, throttling for slow connections, timing breakdown (DNS, TTFB, download), initiator tracking (which code made the request), preserve log for navigations, and copy as cURL for reproducing requests.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-devtools-1",
        tags: ["network-panel", "debugging", "waterfall", "api"],
        commonMistakes: [
          "Not disabling the cache during development, getting cached responses instead of fresh ones.",
          'Forgetting to enable "Preserve log" when debugging form submissions or redirects.',
          "Not checking the Timing tab to identify whether slowness is from the network or the server.",
        ],
        followUps: [
          "How do you identify render-blocking resources in the Network panel?",
          "What does the Initiator column tell you?",
        ],
        interviewTips: [
          "Describe specific debugging workflows (e.g., debugging a slow API call) to show practical experience.",
          "Mention lesser-known features like copy as cURL and network throttling.",
        ],
        relatedTopics: [
          "HTTP debugging",
          "performance optimization",
          "API development",
        ],
      },
      {
        id: "browser-devtools-q2",
        question:
          "How do you use the Performance panel to profile and optimize a web application?",
        answer:
          'The Performance panel records and visualizes everything the browser does during a profiling session — JavaScript execution, rendering, layout, painting, and compositing. It is the primary tool for diagnosing performance bottlenecks, jank, and long tasks.\n\nTo record a profile, click the Record button (or Cmd/Ctrl+E), interact with the application, and stop recording. The panel shows a timeline with several tracks. The Main track shows JavaScript execution as a flame chart — each bar represents a function call, with width proportional to execution time. Tall, wide stacks indicate expensive operations. Red triangles on the top mark long tasks (exceeding 50ms), which can cause jank.\n\nThe flame chart reads top-to-bottom as the call stack. The topmost bar is the entry point (often an event handler or timer callback), and bars below it are functions called by the function above. Clicking a bar shows its source location, self time (time spent in the function itself), and total time (including time in called functions). Wide bars at the bottom of the stack are the actual hot spots.\n\nThe Frames track shows frame rendering timing. Each green bar represents a successfully rendered frame. Gaps or red bars indicate dropped frames (jank). The goal is 60fps, meaning each frame should complete within 16.7ms. The Timings track shows performance marks and measures created by your code (performance.mark/measure) and browser events like First Contentful Paint and Largest Contentful Paint.\n\nKey optimization workflows include identifying long tasks (any task over 50ms in the Main track) and breaking them into smaller chunks using requestAnimationFrame, setTimeout, or scheduler.yield(). Look for forced synchronous layout (labeled "Layout Forced" in the flame chart) triggered by interleaving DOM reads and writes. Check for excessive rendering — multiple layout or paint operations within a single frame. The Summary tab at the bottom breaks down time spent in Scripting, Rendering, Painting, and Idle, giving an overview of where the browser spends its time.\n\nThe CPU throttling feature (in the gear icon) simulates slower devices, helping you discover performance issues that only appear on low-end hardware.',
        shortAnswer:
          "Record a session, analyze the flame chart in the Main track to find expensive function calls. Red triangles indicate long tasks (>50ms) causing jank. The Frames track shows dropped frames. Look for forced layout, excessive paint, and wide bars at the bottom of call stacks. Use CPU throttling to simulate slow devices.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-devtools-1",
        tags: ["performance-panel", "flame-chart", "profiling", "long-tasks"],
        commonMistakes: [
          "Profiling in development mode with unminified code, which has extra overhead not present in production.",
          "Not using CPU throttling to simulate real-world device performance.",
          "Focusing on total function time instead of self time — the actual bottleneck is in functions with high self time.",
        ],
        followUps: [
          "What is the difference between self time and total time in the flame chart?",
          "How do you use performance.mark and performance.measure with the Performance panel?",
        ],
        interviewTips: [
          "Describe a specific workflow: record, find the long task, drill into the flame chart, identify the bottleneck.",
          "Mention the 50ms long task threshold and 16.7ms frame budget to show you know the targets.",
        ],
        relatedTopics: [
          "Web Vitals",
          "main thread optimization",
          "rendering pipeline",
        ],
      },
      {
        id: "browser-devtools-q3",
        question:
          "How do you detect and fix memory leaks using the Memory panel?",
        answer:
          'Memory leaks in web applications cause the browser to consume increasingly more RAM over time, leading to slowdowns, jank, and eventually crashes. The Memory panel provides three tools for investigating memory issues: Heap Snapshots, Allocation Instrumentation on Timeline, and Allocation Sampling.\n\nHeap Snapshots capture the complete JavaScript memory state at a point in time. The typical workflow for finding leaks involves the "three snapshot" technique: take a snapshot (baseline), perform an action that might leak (open and close a dialog, navigate to a page and back), take a second snapshot, repeat the action, take a third snapshot. Compare snapshot 2 with snapshot 1 using the "Comparison" view to see objects allocated between the snapshots. Objects that grow between snapshot 2 and snapshot 3 are likely leaks.\n\nThe Summary view groups objects by constructor name, showing shallow size (memory of the object itself) and retained size (memory that would be freed if the object was garbage collected, including everything it keeps alive). Large retained sizes indicate objects holding references to big subtrees of the object graph.\n\nCommon memory leak patterns in web applications include detached DOM nodes (DOM elements removed from the document but still referenced by JavaScript), forgotten event listeners (not removing listeners when components unmount), closures retaining large scopes (a closure that captures variables from a large scope), global variables and caches that grow without bounds, and timers and intervals not cleaned up (setInterval without clearInterval).\n\nThe Allocation Timeline records memory allocations over time, showing blue bars for allocations and gray bars for freed memory. It helps identify when allocations happen and correlate them with user actions or code execution. Allocations that remain blue (never freed) are potential leaks.\n\nAllocation Sampling provides a lower-overhead profiling mode suitable for production-like conditions. It samples the call stack during allocations, showing which functions allocate the most memory without the significant performance impact of full heap tracking.',
        shortAnswer:
          "Use the three-snapshot technique: baseline, action, repeat action. Compare snapshots to find growing object counts. Look for detached DOM nodes, forgotten listeners, uncleaned timers, and unbounded caches. The Allocation Timeline shows when allocations happen. Check retained size to understand the full memory impact of leaked objects.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-devtools-1",
        tags: ["memory-panel", "heap-snapshot", "memory-leaks", "debugging"],
        commonMistakes: [
          "Not taking a baseline snapshot before testing, making it impossible to compare.",
          "Confusing shallow size with retained size — retained size is what matters for understanding leak impact.",
          "Not forcing garbage collection (clicking the trash can icon) before taking snapshots, getting noisy results.",
        ],
        followUps: [
          "What are detached DOM nodes and how do you find them?",
          "How do closures cause memory leaks in event handlers?",
        ],
        interviewTips: [
          "Describe the three-snapshot technique as a systematic approach.",
          "List the common leak patterns (detached DOM, listeners, timers) to show awareness.",
        ],
        relatedTopics: [
          "garbage collection",
          "event handling",
          "React component cleanup",
        ],
      },
      {
        id: "browser-devtools-q4",
        question:
          "What is Lighthouse and how do you use it for web application audits?",
        answer:
          'Lighthouse is an automated auditing tool integrated into Chrome DevTools that evaluates web page quality across five categories: Performance, Accessibility, Best Practices, SEO, and Progressive Web App (PWA). It provides scores, specific diagnostics, and actionable recommendations.\n\nThe Performance score (0-100) is calculated from a weighted combination of metrics: First Contentful Paint (10%), Speed Index (10%), Largest Contentful Paint (25%), Total Blocking Time (30%), and Cumulative Layout Shift (25%). The score is compared against a reference dataset of real-world websites. Each metric section includes specific diagnostics (e.g., "Reduce unused JavaScript — 234KB of savings") with direct links to the problematic resources.\n\nThe Accessibility score checks for WCAG compliance issues: missing alt text on images, insufficient color contrast ratios, missing form labels, improper heading hierarchy, missing ARIA attributes, keyboard navigation issues, and more. Each finding links to the specific DOM element and provides a reference to the relevant WCAG guideline.\n\nBest Practices checks for security issues (HTTPS, mixed content, vulnerable JavaScript libraries), correct use of modern APIs (e.g., using passive event listeners), console errors, image aspect ratios, and deprecated API usage. The SEO score checks for meta descriptions, crawlability (robots.txt, canonical URLs), font sizes for mobile, and structured data.\n\nImportant caveats: Lighthouse runs in a simulated environment (throttled CPU and network by default), so scores may differ from field data. Lab scores are useful for comparing before and after optimization but should be supplemented with Real User Monitoring (RUM) data for accurate production performance understanding. Scores are relative to a dataset that is updated periodically, so a score can change without any code changes.\n\nFor CI/CD integration, Lighthouse CLI (lighthouse or @lhci/cli) runs audits in headless Chrome, enabling automated performance budgets. You can set thresholds (e.g., performance score must be above 90) and fail builds that regress below them.',
        shortAnswer:
          "Lighthouse audits five categories: Performance (LCP, TBT, CLS), Accessibility (WCAG), Best Practices (security, APIs), SEO, and PWA. It provides scores 0-100, specific diagnostics with recommendations, and links to problem elements. Use it in DevTools for development and via CLI for CI/CD performance budgets. Supplement with RUM for field data.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-devtools-1",
        tags: ["lighthouse", "audits", "performance", "accessibility", "seo"],
        commonMistakes: [
          "Treating Lighthouse scores as absolute truth rather than a guide — lab conditions differ from real users.",
          "Only running Lighthouse once instead of averaging multiple runs, which vary due to network and system conditions.",
          "Ignoring Accessibility and SEO scores and focusing only on Performance.",
        ],
        followUps: [
          "How do you integrate Lighthouse into a CI/CD pipeline?",
          "What is the difference between Lighthouse lab data and CrUX field data?",
        ],
        interviewTips: [
          "Mention the metric weights in the performance score to show you understand what is being measured.",
          "Discuss the lab vs field data distinction to demonstrate mature performance understanding.",
        ],
        relatedTopics: [
          "Web Vitals",
          "CI/CD",
          "accessibility",
          "performance budgets",
        ],
      },
      {
        id: "browser-devtools-q5",
        question:
          "What are the most useful Sources panel debugging techniques?",
        answer:
          "The Sources panel is the primary JavaScript debugging environment in Chrome DevTools. It provides far more powerful debugging capabilities than console.log, enabling precise control over code execution and inspection of program state.\n\nLine breakpoints are the foundation — click a line number in the source code to pause execution at that line. Conditional breakpoints (right-click the line number) only pause when a specified condition is true (e.g., user.id === 123), which is invaluable when a function is called thousands of times but you only care about a specific case. Logpoints (also from right-click) log a message to the console without pausing, effectively adding temporary console.log statements without modifying source code.\n\nDOM breakpoints (set in the Elements panel) pause execution when a specific DOM element is modified. You can break on subtree modifications (child elements added/removed), attribute modifications (class, style, data attributes changed), or node removal. This is essential for tracking down which JavaScript code is modifying a specific DOM element.\n\nXHR/Fetch breakpoints pause when a request URL matches a specified pattern. This helps identify which code is making unexpected API calls. Event listener breakpoints pause on specific event types (click, keydown, scroll, resize) without needing to know where the listener is attached.\n\nWhen execution is paused, the Scope panel shows all variables in the current scope (local, closure, and global). The Call Stack panel shows the chain of function calls that led to the current point. The Watch panel lets you evaluate custom expressions that update on every step. The debugger stepping controls (step over, step into, step out, continue) navigate through code execution.\n\nSource maps (automatically loaded in development builds) map minified or transpiled code back to the original source, allowing you to debug TypeScript, JSX, and SCSS as written. The Overrides feature lets you make local modifications to remote files that persist across page reloads, enabling quick experiments without modifying the actual source.",
        shortAnswer:
          "Key techniques: conditional breakpoints (break only when a condition is true), logpoints (log without pausing), DOM breakpoints (break on element changes), XHR breakpoints (break on API calls), event listener breakpoints. Use Scope/Watch panels for variable inspection, Call Stack for execution flow, and source maps for debugging original code.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-devtools-1",
        tags: ["sources-panel", "breakpoints", "debugging", "stepping"],
        commonMistakes: [
          "Over-relying on console.log when breakpoints and the Scope panel provide more information faster.",
          "Not using conditional breakpoints for functions called frequently, wasting time stepping through irrelevant calls.",
          "Forgetting about DOM breakpoints when trying to track down unexpected DOM changes.",
        ],
        followUps: [
          "How do source maps work and how do you configure them?",
          "What is the DevTools Overrides feature?",
        ],
        interviewTips: [
          "Demonstrate knowledge of advanced breakpoint types (conditional, DOM, XHR, event) beyond basic line breakpoints.",
          "Mention that you prefer breakpoints over console.log for systematic debugging.",
        ],
        relatedTopics: [
          "source maps",
          "debugging strategies",
          "JavaScript execution",
        ],
      },
    ],
  },
  {
    id: "browser-debugging-1",
    title: "Debugging Applications",
    description:
      "Master debugging techniques — console methods, breakpoint types, network debugging, performance profiling, memory leak detection, and React DevTools.",
    category: "Browser",
    difficulty: "Intermediate",
    tags: ["browser", "debugging", "console", "breakpoints", "performance"],
    overview:
      "Effective debugging is a core skill for frontend developers. Mastering console methods, breakpoint strategies, network debugging, performance profiling, and framework-specific tools dramatically improves development efficiency.",
    concepts: [
      "Console methods (log, warn, error, table, group, time, assert, trace)",
      "Breakpoint types (line, conditional, DOM, XHR, event listener)",
      "Network debugging (status codes, timing, payloads)",
      "Performance profiling and flame charts",
      "Memory leak detection (detached DOM, closures)",
      "React DevTools (component tree, profiler)",
      "Error tracking and monitoring",
      "Systematic debugging methodology",
    ],
    relatedTopicIds: [
      "browser-devtools-1",
      "browser-web-vitals-1",
      "browser-rendering-1",
    ],
    codeExamples: [
      {
        title: "Advanced console debugging techniques",
        code: '// Styled console output\nconsole.log(\n  "%cCritical Error%c in AuthModule",\n  "background: red; color: white; padding: 2px 6px; border-radius: 3px;",\n  "color: inherit;"\n);\n\n// Timing multiple operations\nconsole.time("total");\nconsole.time("fetch");\nconst data = await fetch("/api/data").then((r) => r.json());\nconsole.timeEnd("fetch");\n\nconsole.time("process");\nconst processed = processData(data);\nconsole.timeEnd("process");\nconsole.timeEnd("total");\n\n// Count occurrences\nfunction handleEvent(type: string): void {\n  console.count(type); // "click: 1", "click: 2", etc.\n}\n\n// Deep object inspection\nconsole.dir(document.body, { depth: 3 });\n\n// Assert with message\nfunction processUser(user: { name: string; age: number }): void {\n  console.assert(user.age > 0, "User age must be positive:", user);\n  console.assert(user.name.length > 0, "User name must not be empty:", user);\n}',
        language: "typescript",
        explanation:
          "Beyond basic logging, styled output helps identify important messages, timing measures specific operations, count tracks call frequency, and assert validates assumptions during development.",
      },
      {
        title: "Debugging React components with profiling",
        code: '// React Profiler component for measuring render performance\nimport { Profiler, type ProfilerOnRenderCallback } from "react";\n\nconst onRender: ProfilerOnRenderCallback = (\n  id,\n  phase,\n  actualDuration,\n  baseDuration,\n  startTime,\n  commitTime\n) => {\n  if (actualDuration > 16) {\n    console.warn(`Slow render: ${id}`, {\n      phase,\n      actualDuration: `${actualDuration.toFixed(2)}ms`,\n      baseDuration: `${baseDuration.toFixed(2)}ms`,\n    });\n  }\n};\n\nfunction App() {\n  return (\n    <Profiler id="UserList" onRender={onRender}>\n      <UserList />\n    </Profiler>\n  );\n}\n\n// Why-did-you-render tracking (dev only)\n// Helps identify unnecessary re-renders\nfunction useRenderCount(componentName: string): void {\n  const count = React.useRef(0);\n  count.current++;\n  console.log(`${componentName} rendered ${count.current} times`);\n}',
        language: "typescript",
        explanation:
          "The React Profiler API measures render performance programmatically. Logging renders that exceed the 16ms frame budget helps identify components that need optimization (memoization, virtualization).",
      },
    ],
    questions: [
      {
        id: "browser-debugging-q1",
        question:
          "What console methods go beyond console.log, and when should you use each?",
        answer:
          "The Console API provides a rich set of methods for different debugging scenarios, each designed to present information in the most useful format for its purpose.\n\nconsole.warn() and console.error() are semantically meaningful log levels. warn() displays with a yellow warning icon and is filterable in DevTools. error() displays with a red error icon and includes a stack trace. Using appropriate log levels instead of console.log for everything makes it easier to filter and find important messages in a noisy console.\n\nconsole.table() renders arrays and objects as sortable tables — dramatically more readable than JSON dumps for structured data. Passing a second argument as an array of property names selects which columns to display. This is ideal for inspecting API responses, arrays of objects, and any tabular data.\n\nconsole.group() and console.groupCollapsed() create collapsible groups in the console output, organizing related log statements together. groupCollapsed() starts collapsed, reducing visual noise while keeping information accessible. Always call console.groupEnd() to close the group. This is excellent for logging complex operations like API request/response cycles.\n\nconsole.time() and console.timeEnd() measure elapsed time between two points, printing the result in milliseconds. console.timeLog() prints the current elapsed time without stopping the timer. These are useful for quick performance measurements without setting up the Performance panel.\n\nconsole.assert() logs an error only when a condition is false. This is useful for validating assumptions during development (e.g., asserting that a function receives the expected argument types) without cluttering the console when conditions are met.\n\nconsole.trace() prints the current call stack, showing exactly how execution reached that point. This is invaluable when a function is called from multiple places and you need to know which call path triggered a specific behavior. console.count() and console.countReset() count how many times a labeled point is reached — useful for tracking how often a function is called or an event fires.",
        shortAnswer:
          "Key methods: warn/error (log levels with filtering), table (sortable data tables), group/groupCollapsed (collapsible sections), time/timeEnd (duration measurement), assert (conditional error logging), trace (call stack output), count (call frequency). Use appropriate methods for their purpose instead of console.log for everything.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-debugging-1",
        tags: ["console", "logging", "debugging", "api"],
        commonMistakes: [
          "Using console.log for everything instead of semantically appropriate methods like warn, error, table.",
          "Leaving console.log statements in production code — use a logging library with level controls.",
          "Not using console.table for arrays and objects, wasting time reading JSON in the console.",
        ],
        followUps: [
          "How do you filter console output by log level in DevTools?",
          "What is a good logging strategy for production applications?",
        ],
        interviewTips: [
          "List 4-5 specific methods with their use cases to show depth beyond basic logging.",
          "Mention that production apps should use a logging library with configurable levels.",
        ],
        relatedTopics: [
          "debugging strategies",
          "logging libraries",
          "error monitoring",
        ],
      },
      {
        id: "browser-debugging-q2",
        question:
          "Describe the different types of breakpoints available in Chrome DevTools.",
        answer:
          'Chrome DevTools offers several types of breakpoints beyond the basic line breakpoint, each designed for specific debugging scenarios. Mastering all types dramatically reduces debugging time.\n\nLine breakpoints pause execution at a specific line of code. Click the line number in the Sources panel to set one. They are the most common type but are only effective when you know exactly which code to inspect.\n\nConditional breakpoints only pause when a specified JavaScript expression evaluates to true. Right-click a line number and select "Add conditional breakpoint." For example, setting the condition item.id === "abc123" in a loop only pauses for the specific item you care about. This saves enormous time when a function is called thousands of times.\n\nLogpoints are non-pausing breakpoints that log a message to the console. They work like temporary console.log statements without modifying source code. The expression is evaluated in the local scope, so you can log variable values. This is perfect for observing behavior without stopping execution.\n\nDOM breakpoints (set in the Elements panel) trigger when the DOM changes. "Subtree modifications" breaks when child elements are added or removed. "Attribute modifications" breaks when any attribute changes. "Node removal" breaks when the element is removed. These are essential for tracking down which JavaScript code is unexpectedly modifying the DOM.\n\nXHR/Fetch breakpoints (in the Sources sidebar under "XHR/fetch Breakpoints") pause when a fetch or XHR request URL contains a specified string. This identifies which code triggers specific API calls, especially useful in large codebases with many network requests.\n\nEvent listener breakpoints (in the Sources sidebar) pause when a specific DOM event fires. Categories include Mouse (click, mousedown), Keyboard (keydown, keypress), Timer (setTimeout, setInterval fires), Animation (requestAnimationFrame), Script (script first statement), and many more. You do not need to know where the listener is registered — the breakpoint catches all listeners for that event type.\n\nException breakpoints pause on thrown exceptions — either all exceptions or only uncaught exceptions. The "Pause on caught exceptions" option is useful for debugging error handling logic where exceptions are caught and silently swallowed.',
        shortAnswer:
          "Types: line (specific line), conditional (break only if expression is true), logpoint (log without pausing), DOM (break on element changes), XHR/Fetch (break on API calls), event listener (break on click, keydown, timer), exception (break on thrown errors). Each targets a specific debugging scenario; use the right type to avoid stepping through irrelevant code.",
        difficulty: "Intermediate",
        type: "Conceptual",
        category: "Browser",
        topicId: "browser-debugging-1",
        tags: ["breakpoints", "conditional", "dom", "xhr", "event-listener"],
        commonMistakes: [
          "Using only line breakpoints and missing the power of conditional, DOM, and event listener breakpoints.",
          "Not using logpoints when you need to observe behavior without stopping execution.",
          "Setting exception breakpoints on all exceptions in codebases that use try-catch heavily, causing excessive pausing.",
        ],
        followUps: [
          "How do you set breakpoints in source-mapped code (TypeScript)?",
          "What is the blackbox scripting feature?",
        ],
        interviewTips: [
          "Describe at least 4 different breakpoint types with specific scenarios where each is useful.",
          "Mention that you prefer breakpoints over console.log for systematic debugging.",
        ],
        relatedTopics: [
          "Chrome DevTools",
          "debugging methodology",
          "source maps",
        ],
      },
      {
        id: "browser-debugging-q3",
        question:
          "How do you identify and fix memory leaks in a web application?",
        answer:
          'Memory leaks in web applications cause the browser memory usage to grow continuously, eventually degrading performance and potentially crashing the tab. Identifying and fixing them requires understanding common leak patterns and using the right DevTools tools.\n\nThe most common leak patterns are: detached DOM trees (elements removed from the document but still referenced by JavaScript — a variable, a closure, or an event listener holds a reference, preventing garbage collection), forgotten event listeners (adding listeners in component mount without removing them on unmount), uncleaned timers and intervals (setInterval callbacks that reference component state or DOM elements), closures capturing large scopes (a small callback function that accidentally retains a reference to a large data structure through its closure scope), and growing collections without bounds (arrays, maps, or caches that accumulate entries without eviction).\n\nTo detect leaks, open the Memory panel and use the Heap Snapshot comparison technique. Take a baseline snapshot, perform an action that might leak (navigate to a page and back, open and close a modal repeatedly), force garbage collection (click the trash icon), and take another snapshot. In the Comparison view, look for object counts that increase across iterations. Detached DOM elements appear as "Detached HTMLDivElement" in the snapshot.\n\nThe Allocation Timeline is useful for correlating leaks with specific actions. Blue bars that never turn gray represent allocations that are never freed. Recording during a specific interaction identifies exactly when the leak occurs.\n\nFor React applications, common leaks include setting state in an unmounted component (calling setState in a callback that fires after unmount), not cleaning up subscriptions and listeners in useEffect return functions, and holding references to large data in context or global stores. React DevTools Profiler helps identify components that re-render excessively, which while not a memory leak, causes performance degradation.\n\nFixing leaks involves ensuring cleanup: remove event listeners in useEffect cleanup or componentWillUnmount, clear timers and intervals, abort in-flight fetch requests, unsubscribe from observables and WebSocket connections, and use WeakRef or WeakMap for caches that should allow garbage collection.',
        shortAnswer:
          "Common leaks: detached DOM nodes, forgotten event listeners, uncleaned timers, closures capturing large scopes, unbounded collections. Detect with Heap Snapshot comparison (baseline -> action -> snapshot -> compare). Fix with cleanup: remove listeners on unmount, clear intervals, abort requests, use WeakRef for caches.",
        code: '// Common leak: event listener not cleaned up\nfunction LeakyComponent() {\n  const [size, setSize] = React.useState({ w: 0, h: 0 });\n\n  React.useEffect(() => {\n    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });\n    window.addEventListener("resize", handler);\n    // BUG: no cleanup! listener persists after unmount\n  }, []);\n}\n\n// Fixed: proper cleanup\nfunction FixedComponent() {\n  const [size, setSize] = React.useState({ w: 0, h: 0 });\n\n  React.useEffect(() => {\n    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });\n    window.addEventListener("resize", handler);\n    return () => window.removeEventListener("resize", handler);\n  }, []);\n}\n\n// Common leak: timer not cleaned\nfunction LeakyTimer() {\n  React.useEffect(() => {\n    const id = setInterval(() => fetchUpdates(), 5000);\n    // BUG: interval continues after unmount\n  }, []);\n}\n\n// Fixed: clear interval on cleanup\nfunction FixedTimer() {\n  React.useEffect(() => {\n    const id = setInterval(() => fetchUpdates(), 5000);\n    return () => clearInterval(id);\n  }, []);\n}',
        language: "typescript",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-debugging-1",
        tags: ["memory-leaks", "cleanup", "react", "event-listeners"],
        commonMistakes: [
          "Not cleaning up event listeners in React useEffect, causing listeners to accumulate on every re-mount.",
          "Using setInterval without clearInterval in component cleanup.",
          "Storing large data in module-level variables that are never released.",
        ],
        followUps: [
          "What is a WeakRef and how does it help prevent memory leaks?",
          "How do you detect memory leaks in production?",
        ],
        interviewTips: [
          "List the common leak patterns and their fixes systematically.",
          "Show the DevTools workflow: snapshot, action, snapshot, compare.",
        ],
        relatedTopics: [
          "garbage collection",
          "React lifecycle",
          "WeakMap/WeakRef",
        ],
      },
      {
        id: "browser-debugging-q4",
        question: "How do you debug network and API issues effectively?",
        answer:
          'Network debugging is a daily task for frontend developers, and a systematic approach saves significant time. The process involves identifying the failure, inspecting the details, reproducing the issue, and verifying the fix.\n\nStart by identifying the symptom in the Network panel. Filter for XHR/Fetch requests to focus on API calls. Look for red entries (failed requests), unexpected status codes (401, 403, 404, 500), slow responses (sort by Time column), or missing requests (expected API call not appearing). The Status column gives an immediate overview of response health.\n\nFor each problematic request, inspect the Headers tab (verify the correct URL, method, and headers like Authorization, Content-Type), the Payload tab (verify the request body is correct — missing fields, wrong format, encoding issues), the Response tab (read the server error message — many APIs return helpful error details in the body), and the Timing tab (identify whether the delay is in DNS, connection, waiting, or download).\n\nCORS issues appear as failed requests with a specific console error message. The Network panel shows the preflight OPTIONS request (if applicable) and the blocked actual request. Check that the server returns correct Access-Control-Allow-Origin, Allow-Methods, and Allow-Headers. The request Origin header shows what the server should allow.\n\nFor authentication issues, check the Cookie or Authorization header. Use the Application panel to verify cookies are set correctly (check Domain, Path, SameSite attributes). For JWT tokens, decode the token (in jwt.io or via console) to check expiration and claims.\n\nThe "Copy as cURL" feature (right-click a request) is invaluable for sharing exact request details with backend developers or testing in the terminal. The "Replay XHR" option re-sends a request without reloading the page. For complex debugging, the Network panel "Override content" feature lets you modify server responses locally.\n\nFor API testing beyond DevTools, tools like Postman or the fetch() API directly in the console can isolate whether the issue is in the frontend code or the API. Running the same request in the console without the application JavaScript helps determine if interceptors or middleware are modifying the request.',
        shortAnswer:
          "Systematic approach: identify failed/slow requests in Network panel, inspect headers/payload/response/timing, check CORS headers and authentication, use Copy as cURL to share with backend, verify with direct console fetch to isolate frontend vs API issues. For auth problems, decode JWTs and check cookie attributes in Application panel.",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-debugging-1",
        tags: ["network-debugging", "api", "cors", "authentication"],
        commonMistakes: [
          "Not reading the response body for error details — servers often return helpful error messages.",
          "Assuming a 401 is always a token issue when it could be a missing or malformed header.",
          "Not checking the Timing tab to identify whether slowness is from the network, server, or client.",
        ],
        followUps: [
          "How do you debug WebSocket connections in DevTools?",
          "What tools exist for API mocking during development?",
        ],
        interviewTips: [
          "Describe a structured debugging workflow rather than just listing tools.",
          "Mention Copy as cURL as it demonstrates practical, collaborative debugging.",
        ],
        relatedTopics: ["CORS", "HTTP debugging", "API testing"],
      },
      {
        id: "browser-debugging-q5",
        question:
          "What is your systematic approach to debugging an unknown issue in a web application?",
        answer:
          "A systematic debugging methodology is essential for efficiently resolving issues, especially unfamiliar ones. The approach follows a structured sequence: reproduce, isolate, diagnose, fix, and verify.\n\nReproduction is the first and most critical step. If you cannot reproduce the issue, you cannot verify it is fixed. Gather details: which browser, device, operating system, URL, user actions, and any error messages. Try to find the minimal set of steps that triggers the issue consistently. If the issue is intermittent, look for timing-dependent factors (race conditions, network latency, animation timing).\n\nIsolation narrows down where the problem lives. Use the console for immediate error messages (uncaught exceptions, unhandled promise rejections). Check the Network panel for failed API calls or unexpected responses. Use the Elements panel to verify the DOM state matches expectations. Disable browser extensions (Incognito mode) to rule out interference. If the issue is visual, the Elements panel CSS rules and computed styles reveal whether the problem is in HTML structure or CSS.\n\nDiagnosis involves identifying the root cause, not just the symptom. Set breakpoints at relevant code paths and step through execution. Check variable values in the Scope panel. Use the Call Stack to trace how execution reached the problematic point. For state management issues, React DevTools shows component props, state, and re-render triggers. For performance issues, the Performance panel flame chart reveals slow functions.\n\nApply a binary search approach for complex issues: if you do not know which of many possible causes is the problem, disable or isolate half of the potential causes at a time. This logarithmically narrows down the root cause. Git bisect applies the same concept to finding which commit introduced a bug.\n\nFix the root cause, not the symptom. If a null reference error occurs because an API response is unexpectedly empty, fix both the API contract and add defensive checks. After fixing, verify by re-running the reproduction steps and checking edge cases. Add tests to prevent regression.\n\nDocument the debugging process and solution for team knowledge sharing, especially for non-obvious issues. This turns individual debugging sessions into organizational learning.",
        shortAnswer:
          "Systematic approach: 1) Reproduce (find minimal steps), 2) Isolate (console errors, network, DOM inspection, Incognito mode), 3) Diagnose (breakpoints, stepping, call stack, React DevTools), 4) Binary search for complex issues (disable half the suspects at a time), 5) Fix the root cause not the symptom, 6) Verify and add tests, 7) Document for the team.",
        difficulty: "Intermediate",
        type: "Scenario",
        category: "Browser",
        topicId: "browser-debugging-1",
        tags: ["methodology", "systematic", "debugging", "process"],
        commonMistakes: [
          "Fixing symptoms instead of root causes, leading to the same bug recurring in different forms.",
          "Not reproducing the issue first, leading to unverifiable fixes.",
          "Applying random changes hoping to fix the issue instead of systematically isolating the cause.",
          "Not documenting the solution, forcing others to rediscover the same debugging path.",
        ],
        followUps: [
          "How do you debug issues that only occur in production?",
          "What is git bisect and how does it help with debugging?",
        ],
        interviewTips: [
          "Present a clear, structured methodology — interviewers value systematic thinking over ad-hoc debugging.",
          "Mention the binary search approach to show you handle complex, multi-factor issues efficiently.",
        ],
        relatedTopics: ["testing", "error monitoring", "git bisect"],
      },
    ],
  },
];
