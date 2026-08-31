import type { Topic } from '../../types';

export const eventsTopics: Topic[] = [
  {
    id: 'js-events',
    title: 'Event Handling',
    description:
      'Master JavaScript event handling including event listeners, propagation phases, delegation patterns, and the Event API for building interactive web applications.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    tags: [
      'events',
      'event handling',
      'addEventListener',
      'event bubbling',
      'event capturing',
      'event delegation',
      'DOM events',
      'event propagation',
    ],
    overview:
      'Event handling is the backbone of interactive web development. JavaScript uses an event-driven programming model where the browser fires events in response to user interactions, network activity, timers, and DOM mutations. Understanding how events propagate through the DOM tree—capturing down, then bubbling up—is critical for writing efficient, bug-free UI code. Patterns like event delegation leverage propagation to handle events on many child elements with a single listener, dramatically improving performance and simplifying dynamic content management.',
    concepts: [
      'Event bubbling and capturing phases',
      'The EventTarget interface and addEventListener API',
      'Event propagation and the three-phase model',
      'Event delegation for dynamic and list-based UIs',
      'stopPropagation vs stopImmediatePropagation vs preventDefault',
      'The Event object and its key properties',
      'Removing event listeners and avoiding memory leaks',
      'Inline handlers vs DOM property handlers vs addEventListener',
      'Passive event listeners and scroll performance',
      'Custom events with CustomEvent constructor',
    ],
    relatedTopicIds: ['js-dom', 'js-closures', 'js-async'],
    questions: [
      {
        id: 'js-events-1',
        question: 'Explain event bubbling and capturing in JavaScript.',
        answer:
          'Event bubbling and capturing are the two directional phases of event propagation in the DOM. When an event occurs on an element, the browser does not simply fire the handler on that element alone—it walks the entire ancestor chain in a well-defined order described by the DOM Level 2 Events specification.\n\nDuring the **capturing phase** (phase 1), the event travels from the `window` object down through every ancestor element until it reaches the target element. Any listener registered with `{ capture: true }` (or the legacy third argument `true`) fires during this phase. Capturing is rarely used in everyday code but is essential when you need to intercept an event before it reaches its target—for example, to implement focus trapping in a modal dialog.\n\nDuring the **target phase** (phase 2), the event has arrived at the element that originally dispatched it. Listeners on the target fire regardless of whether they were registered for capture or bubble.\n\nDuring the **bubbling phase** (phase 3), the event travels back up from the target through its ancestors to the `window`. This is the default phase, and most listeners fire here. Bubbling is what makes event delegation possible: a single listener on a parent can respond to events from any of its descendants.\n\nNot every event bubbles. Events like `focus`, `blur`, `load`, `unload`, `scroll`, and `mouseenter`/`mouseleave` do not bubble by default. Their bubbling counterparts (`focusin`/`focusout`, for example) exist specifically for delegation scenarios. Understanding which events bubble is critical for choosing the right delegation strategy.',
        shortAnswer:
          'Capturing travels from the window down to the target element, while bubbling travels from the target back up to the window. Together with the target phase they form the three phases of DOM event propagation. Most listeners fire during the bubbling phase by default.',
        code: '// HTML: <div id="outer"><button id="inner">Click</button></div>\n\nconst outer = document.getElementById("outer")!;\nconst inner = document.getElementById("inner")!;\n\n// Capturing listener (fires first)\nouter.addEventListener(\n  "click",\n  () => console.log("outer – capture"),\n  { capture: true }\n);\n\n// Bubbling listener (fires last)\nouter.addEventListener(\n  "click",\n  () => console.log("outer – bubble")\n);\n\n// Target listeners fire in registration order\ninner.addEventListener(\n  "click",\n  () => console.log("inner – capture"),\n  { capture: true }\n);\ninner.addEventListener(\n  "click",\n  () => console.log("inner – bubble")\n);\n\n// Clicking the button logs:\n// "outer – capture"\n// "inner – capture"\n// "inner – bubble"\n// "outer – bubble"',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['bubbling', 'capturing', 'event propagation'],
        commonMistakes: [
          'Assuming all events bubble—events like focus, blur, mouseenter, and mouseleave do not bubble.',
          'Forgetting that at the target phase, capture and bubble listeners fire in registration order, not phase order.',
          'Using the legacy boolean third argument to addEventListener without realizing true means capture.',
        ],
        followUps: [
          'How would you stop an event from propagating further?',
          'What is the difference between stopPropagation and stopImmediatePropagation?',
          'Which common events do NOT bubble?',
        ],
        interviewTips: [
          'Draw the three-phase diagram (capture → target → bubble) on a whiteboard to visually demonstrate the concept.',
          'Mention real-world use cases: capturing for focus traps, bubbling for delegation.',
        ],
      },
      {
        id: 'js-events-2',
        question: 'What is event delegation? Why is it useful?',
        answer:
          'Event delegation is a pattern where you attach a single event listener to a common ancestor element instead of attaching individual listeners to every child element. It relies on the bubbling phase of event propagation: when a child element fires an event, that event bubbles up through the DOM, and the ancestor\'s listener can inspect `event.target` to determine which child was the actual source.\n\nThe primary benefit is **performance**. Imagine a list with 1,000 items. Without delegation you would attach 1,000 click listeners—one per item—consuming memory and slowing down initial render. With delegation, a single listener on the `<ul>` handles clicks on every `<li>`. This also reduces the cost of adding or removing items because you never need to attach or detach per-item listeners.\n\nA second major benefit is **dynamic content handling**. If new items are added to the DOM after the initial render (for example, via an infinite scroll or AJAX load), those items automatically participate in the delegated listener without any extra wiring. This is why virtually every major framework and library—React\'s synthetic event system, jQuery\'s `.on()` with a selector—uses delegation internally.\n\nWhen implementing delegation, you typically check `event.target` or use `event.target.closest(selector)` to match the element you care about. The `closest()` approach is more robust because it handles cases where the click lands on a nested child (like a `<span>` inside a `<button>`). You should also be aware that not all events bubble, so delegation only works with bubbling events (or their bubbling equivalents like `focusin` instead of `focus`).\n\nOne caveat is that delegation can make debugging harder because the listener lives far from the element it conceptually belongs to. Use clear selector checks and descriptive comments to maintain readability.',
        shortAnswer:
          'Event delegation attaches a single listener to a parent element and uses event.target to identify which child triggered the event. It improves performance by reducing the number of listeners, and automatically handles dynamically added elements because events bubble up through the DOM.',
        code: '// Instead of adding a listener to every <li>:\nconst list = document.getElementById("todo-list")!;\n\nlist.addEventListener("click", (event: Event) => {\n  const target = (event.target as HTMLElement).closest<HTMLLIElement>("li");\n  if (!target || !list.contains(target)) return;\n\n  const taskId = target.dataset.taskId;\n  console.log(`Clicked task: ${taskId}`);\n  target.classList.toggle("completed");\n});\n\n// Works even for items added later:\nconst newItem = document.createElement("li");\nnewItem.dataset.taskId = "42";\nnewItem.textContent = "New dynamic task";\nlist.appendChild(newItem); // click handler already covers it',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['event delegation', 'performance', 'bubbling'],
        commonMistakes: [
          'Checking only event.target without using closest(), which fails when the click lands on a nested child element inside the intended target.',
          'Trying to delegate events that do not bubble, such as focus or blur, instead of using their bubbling equivalents focusin and focusout.',
          'Forgetting to guard against targets outside the container with a contains() check.',
        ],
        followUps: [
          'How does React\'s synthetic event system relate to event delegation?',
          'When would delegation be a poor choice compared to direct listeners?',
          'How do you delegate keyboard events like Enter on list items?',
        ],
        interviewTips: [
          'Emphasize both performance gains and dynamic-content benefits—interviewers look for awareness of both.',
          'Mention closest() as the modern best practice for target matching.',
        ],
      },
      {
        id: 'js-events-3',
        question:
          'What is the difference between stopPropagation() and preventDefault()?',
        answer:
          'These two methods solve completely different problems and are frequently confused. `stopPropagation()` controls **event flow through the DOM tree**, while `preventDefault()` controls the **browser\'s default behavior** associated with an event.\n\n`event.stopPropagation()` prevents the event from continuing to the next element in the propagation chain. If called during the capturing phase, the event never reaches the target or the bubbling phase. If called during bubbling, ancestors further up the tree never see the event. A more aggressive variant, `stopImmediatePropagation()`, also prevents other listeners on the **same** element from firing. Use `stopPropagation()` sparingly—it can silently break delegation listeners, analytics trackers, and third-party scripts that depend on events reaching the document.\n\n`event.preventDefault()` tells the browser not to perform the action it normally associates with the event. For example, calling it on a `submit` event prevents the form from navigating; on a `click` event of an `<a>` tag it prevents navigation; on a `keydown` event it can prevent a character from being typed. Importantly, `preventDefault()` does **not** stop propagation—the event continues to bubble or capture normally. You can check whether default was prevented via `event.defaultPrevented`.\n\nA practical scenario: in a form with nested delegated listeners, you might call `preventDefault()` on the submit event to handle submission via fetch, while deliberately not calling `stopPropagation()` so that an analytics listener on a parent element can still log the submission. Conversely, in a modal overlay, you might `stopPropagation()` on a click inside the modal to prevent a document-level listener from closing it, while not needing `preventDefault()` because clicks on a `<div>` have no default behavior.\n\nReturning `false` from an inline HTML event handler (`onclick="return false"`) calls both `preventDefault()` and `stopPropagation()`, which is one reason inline handlers are discouraged—the behavior is less explicit and harder to reason about.',
        shortAnswer:
          'stopPropagation() stops the event from traveling further through the DOM tree (capture or bubble), while preventDefault() cancels the browser\'s default action for that event (like form submission or link navigation). They are independent—using one does not imply the other.',
        code: '// preventDefault: stop form submission but let event bubble\nconst form = document.getElementById("login-form") as HTMLFormElement;\nform.addEventListener("submit", (event: SubmitEvent) => {\n  event.preventDefault(); // no page reload\n  const data = new FormData(form);\n  fetch("/api/login", { method: "POST", body: data });\n  // event still bubbles — analytics listeners above will fire\n});\n\n// stopPropagation: keep click inside modal from closing overlay\nconst modal = document.getElementById("modal")!;\nconst overlay = document.getElementById("overlay")!;\n\nmodal.addEventListener("click", (event: MouseEvent) => {\n  event.stopPropagation(); // overlay listener won\'t fire\n});\n\noverlay.addEventListener("click", () => {\n  overlay.classList.add("hidden"); // closes only on overlay click\n});',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['stopPropagation', 'preventDefault', 'event flow'],
        commonMistakes: [
          'Believing preventDefault() also stops propagation—it does not; the event continues through the DOM.',
          'Overusing stopPropagation(), which silently breaks event delegation, analytics, and third-party integrations.',
          'Confusing the behavior of returning false in inline handlers (which does both) with returning false in addEventListener callbacks (which does neither).',
        ],
        followUps: [
          'What does stopImmediatePropagation() do differently from stopPropagation()?',
          'How can you check if preventDefault() was already called on an event?',
          'Why is returning false from an addEventListener callback not equivalent to preventDefault()?',
        ],
        interviewTips: [
          'Clearly separate the two concepts: one is about DOM tree traversal, the other is about browser defaults. Interviewers specifically watch for conflation.',
        ],
      },
      {
        id: 'js-events-4',
        question:
          'How does addEventListener work? What are its parameters?',
        answer:
          'The `addEventListener` method is defined on the `EventTarget` interface, which is implemented by all DOM nodes, the `window` object, and several non-DOM objects like `XMLHttpRequest` and `WebSocket`. Its signature is `target.addEventListener(type, listener, options?)`, and it registers a callback to be invoked whenever the specified event type is dispatched on the target.\n\nThe **first parameter** (`type`) is a string identifying the event, such as `"click"`, `"keydown"`, or `"submit"`. Event names are case-sensitive—`"Click"` will not match a native click event.\n\nThe **second parameter** (`listener`) is a callback function or an object implementing the `EventListener` interface (i.e., an object with a `handleEvent` method). Using the object form is useful when you need to share state across handler invocations or cleanly remove the listener, because the same object reference serves as the identity for removal.\n\nThe **third parameter** is either a boolean or an options object. The boolean form is legacy: passing `true` registers the listener for the capturing phase, `false` (the default) for bubbling. The options object is the modern approach and accepts three properties: `capture` (boolean, same as the legacy flag), `once` (boolean, if `true` the listener is automatically removed after it fires once), and `passive` (boolean, if `true` the listener promises not to call `preventDefault()`, allowing the browser to optimize scrolling performance).\n\nUnlike the older `onclick` property approach, `addEventListener` allows multiple listeners for the same event on the same element. Listeners are called in the order they were registered. If you register the exact same function reference with the same capture flag on the same target, the duplicate is silently ignored—this is a spec-mandated deduplication.\n\nOne subtle detail: the options object is not compared for equality beyond the `capture` flag when checking for duplicates. Two calls with `{ capture: false, passive: true }` and `{ capture: false, once: true }` using the same function reference still result in a single registration.',
        shortAnswer:
          'addEventListener(type, listener, options?) registers an event handler on any EventTarget. The third parameter can be a boolean for capture, or an options object with capture, once, and passive flags. Unlike DOM property handlers, it supports multiple listeners per event and gives fine-grained control over propagation phase and performance.',
        code: '// Basic usage\nconst button = document.getElementById("btn")!;\n\nfunction handleClick(event: MouseEvent): void {\n  console.log("Button clicked at", event.clientX, event.clientY);\n}\n\n// Register for bubbling phase (default)\nbutton.addEventListener("click", handleClick);\n\n// Register with options\nbutton.addEventListener("click", handleClick, {\n  capture: false,\n  once: true,     // auto-removes after first invocation\n  passive: true,  // promises not to call preventDefault()\n});\n\n// Using EventListener interface (object form)\nconst counter = {\n  count: 0,\n  handleEvent(event: Event): void {\n    this.count++;\n    console.log(`Clicked ${this.count} times`);\n  },\n};\nbutton.addEventListener("click", counter);\n\n// Removal requires the same reference and capture flag\nbutton.removeEventListener("click", handleClick);',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['addEventListener', 'EventTarget', 'event options'],
        commonMistakes: [
          'Using an anonymous function and then being unable to remove it later because you have no reference to pass to removeEventListener.',
          'Forgetting that the capture flag must match between addEventListener and removeEventListener for removal to work.',
          'Not using the passive flag on touch/wheel listeners, causing scroll jank on mobile devices.',
        ],
        followUps: [
          'What is the EventListener interface\'s object form, and when is it useful?',
          'How does the once option work internally?',
          'Why does the passive flag improve scroll performance?',
        ],
        interviewTips: [
          'Mention the options object (once, passive, capture) over the legacy boolean—it shows you stay current with the API.',
          'Highlight the deduplication behavior: registering the same function reference twice is a no-op.',
        ],
      },
      {
        id: 'js-events-5',
        question:
          'What is event propagation? Describe its phases.',
        answer:
          'Event propagation is the mechanism by which the browser determines the order in which event listeners are notified when an event occurs on a DOM element. The DOM Level 2 Events specification defines three distinct phases, and every dispatched event traverses them in sequence.\n\n**Phase 1 — Capturing (CAPTURING_PHASE, numeric value 1):** The event starts at the `window` and travels down through `document`, `<html>`, `<body>`, and each successive ancestor until it reaches the parent of the target element. Listeners registered with `{ capture: true }` fire during this phase. Capturing is the first opportunity to intercept an event, which is useful for implementing global shortcuts or access control.\n\n**Phase 2 — Target (AT_TARGET, numeric value 2):** The event has arrived at the element on which the event was originally dispatched. During this phase, both capture and bubble listeners on the target fire in their registration order. You can identify this phase by checking `event.eventPhase === 2`. The distinction between capture and bubble semantics disappears at the target itself.\n\n**Phase 3 — Bubbling (BUBBLING_PHASE, numeric value 3):** The event reverses direction and travels back up from the target\'s parent through every ancestor to the `window`. Listeners registered without the capture flag (the default) fire during this phase. Bubbling is what enables event delegation—the most common and powerful pattern in DOM event handling.\n\nYou can inspect which phase an event is in at any point by reading `event.eventPhase`. You can halt propagation at any phase using `stopPropagation()` or `stopImmediatePropagation()`. Note that `preventDefault()` does not affect propagation—it only cancels the browser\'s default action.\n\nSome events are specified as non-bubbling: `focus`, `blur`, `load`, `unload`, `mouseenter`, `mouseleave`, and `resize` among others. For these, only the capturing and target phases occur. The spec provides bubbling equivalents for common cases (`focusin`/`focusout`) to enable delegation.',
        shortAnswer:
          'Event propagation has three phases: capturing (window down to target\'s parent), target (the element itself), and bubbling (target\'s parent back up to window). Listeners fire in phase order, and you can control this via the capture option in addEventListener. Not all events bubble.',
        code: 'const outer = document.getElementById("outer")!;\nconst middle = document.getElementById("middle")!;\nconst inner = document.getElementById("inner")!;\n\nfunction logPhase(event: Event): void {\n  const phaseNames = ["NONE", "CAPTURING", "AT_TARGET", "BUBBLING"];\n  const el = (event.currentTarget as HTMLElement).id;\n  console.log(`${el}: ${phaseNames[event.eventPhase]}`);\n}\n\n// Register both phases on every element\n[outer, middle, inner].forEach((el) => {\n  el.addEventListener("click", logPhase, { capture: true });\n  el.addEventListener("click", logPhase);\n});\n\n// Clicking #inner logs:\n// outer: CAPTURING\n// middle: CAPTURING\n// inner: AT_TARGET      (capture listener)\n// inner: AT_TARGET      (bubble listener)\n// middle: BUBBLING\n// outer: BUBBLING',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['event propagation', 'capturing', 'bubbling', 'target phase'],
        commonMistakes: [
          'Forgetting that at the target phase, capture and bubble listeners fire in registration order—not capture-first.',
          'Assuming every event goes through all three phases—non-bubbling events skip the bubbling phase entirely.',
          'Confusing event.target (the original element) with event.currentTarget (the element whose listener is firing).',
        ],
        followUps: [
          'How can you determine which phase an event is currently in?',
          'What is the difference between event.target and event.currentTarget?',
          'Name three events that do not bubble.',
        ],
        interviewTips: [
          'Use the numeric phase values (1, 2, 3) and their constant names—it shows precise knowledge of the spec.',
        ],
      },
      {
        id: 'js-events-6',
        question: 'How do you remove an event listener properly?',
        answer:
          'Removing an event listener requires calling `removeEventListener` with the exact same arguments used during registration: the same event type string, the same function reference, and the same capture flag. Getting any of these wrong results in a silent no-op—no error is thrown, and the listener remains active. This is one of the most common sources of memory leaks in long-lived single-page applications.\n\nThe most frequent mistake is using anonymous functions or arrow functions directly in `addEventListener`. Since each anonymous function creates a new reference, you can never pass the same reference to `removeEventListener`. The solution is to store the handler in a named variable or use the `{ once: true }` option if the listener should fire only once.\n\nThe capture flag must match between registration and removal. If you registered with `{ capture: true }` and try to remove without the capture flag, the listener will not be removed. The other options (`once`, `passive`) are ignored during the removal comparison—only `capture` matters.\n\nFor class-based components or objects, a common pattern is binding methods in the constructor and storing the bound reference: `this.handleClick = this.handleClick.bind(this)`. Without this, each call to `.bind()` creates a new function reference, making removal impossible. Alternatively, using the `EventListener` interface object form (`{ handleEvent }`) avoids binding issues entirely because the object reference itself is stable.\n\nModern code increasingly uses `AbortController` for listener cleanup. You pass the controller\'s `signal` in the options, and calling `controller.abort()` removes all listeners associated with that signal in one shot. This is especially powerful for components with many listeners or for cleanup in framework lifecycle hooks.',
        shortAnswer:
          'Call removeEventListener with the same event type, the same function reference, and the same capture flag used in addEventListener. Anonymous functions cannot be removed because each creates a new reference. Modern best practice is to use AbortController signals or the once option for automatic cleanup.',
        code: '// ❌ WRONG: anonymous function cannot be removed\nconst btn = document.getElementById("btn")!;\nbtn.addEventListener("click", () => console.log("clicked"));\nbtn.removeEventListener("click", () => console.log("clicked")); // no-op\n\n// ✅ CORRECT: named function reference\nfunction handleClick(): void {\n  console.log("clicked");\n}\nbtn.addEventListener("click", handleClick);\nbtn.removeEventListener("click", handleClick); // works\n\n// ✅ Modern: AbortController for bulk cleanup\nconst controller = new AbortController();\n\nbtn.addEventListener("click", handleClick, {\n  signal: controller.signal,\n});\nwindow.addEventListener("keydown", (e: KeyboardEvent) => {\n  if (e.key === "Escape") console.log("escape pressed");\n}, { signal: controller.signal });\n\n// Remove ALL listeners tied to this controller at once\ncontroller.abort();\n\n// ✅ One-shot listener with { once: true }\nbtn.addEventListener("click", handleClick, { once: true });',
        language: 'typescript',
        difficulty: 'Intermediate',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: [
          'removeEventListener',
          'AbortController',
          'memory leaks',
          'cleanup',
        ],
        commonMistakes: [
          'Using anonymous or inline arrow functions with addEventListener and then attempting to remove them—this always fails silently.',
          'Forgetting to match the capture flag during removal, which causes the listener to remain active.',
          'Calling .bind(this) in both addEventListener and removeEventListener, creating two different references.',
        ],
        followUps: [
          'How does AbortController simplify listener cleanup in component lifecycles?',
          'What memory leak risks exist if listeners are never removed in a single-page app?',
          'How does the EventListener object form help with removal?',
        ],
        interviewTips: [
          'Mention AbortController as the modern cleanup pattern—many interviewers are not yet aware of it, and it demonstrates up-to-date knowledge.',
        ],
      },
      {
        id: 'js-events-7',
        question:
          'What is the Event object? What are its important properties?',
        answer:
          'Every time an event fires, the browser creates an Event object (or a subclass like `MouseEvent`, `KeyboardEvent`, `SubmitEvent`, etc.) and passes it as the sole argument to the listener callback. This object contains all the metadata about the event: what happened, where it happened, which element dispatched it, and the current state of propagation.\n\nThe most fundamental properties are `event.type` (the event name string like `"click"`), `event.target` (the element that originally dispatched the event), and `event.currentTarget` (the element whose listener is currently executing). The distinction between `target` and `currentTarget` is critical for delegation: `target` is the deepest element clicked, while `currentTarget` is the delegating ancestor.\n\n`event.eventPhase` returns a number (1 for capturing, 2 for at-target, 3 for bubbling) indicating the current propagation phase. `event.bubbles` indicates whether the event will bubble. `event.cancelable` indicates whether `preventDefault()` will have any effect. `event.defaultPrevented` is `true` if `preventDefault()` has already been called.\n\nSubclass-specific properties provide richer context. `MouseEvent` adds `clientX`/`clientY` (viewport coordinates), `pageX`/`pageY` (document coordinates), `button` (which mouse button), and modifier flags (`shiftKey`, `ctrlKey`, `altKey`, `metaKey`). `KeyboardEvent` adds `key` (the logical key value like `"Enter"`), `code` (the physical key like `"KeyA"`), and `repeat` (whether the key is being held). `InputEvent` adds `data` (the inserted text) and `inputType` (like `"insertText"` or `"deleteContentBackward"`).\n\n`event.timeStamp` provides a high-resolution timestamp (in milliseconds since the page load origin) useful for measuring interaction latency or debouncing. `event.isTrusted` distinguishes real user actions (`true`) from programmatically dispatched events (`false`), which is relevant for security-sensitive logic. `event.composedPath()` returns the full propagation path including shadow DOM boundaries, which is important in web component architectures.',
        shortAnswer:
          'The Event object is passed to every listener and contains metadata like type, target (originating element), currentTarget (listening element), eventPhase, and methods like preventDefault() and stopPropagation(). Subclasses like MouseEvent and KeyboardEvent add context-specific properties such as coordinates, keys, and modifier flags.',
        code: 'document.addEventListener("click", (event: MouseEvent) => {\n  // Core Event properties\n  console.log("Type:", event.type);                  // "click"\n  console.log("Target:", event.target);              // element clicked\n  console.log("CurrentTarget:", event.currentTarget);// document\n  console.log("Phase:", event.eventPhase);           // 3 (bubbling)\n  console.log("Bubbles:", event.bubbles);            // true\n  console.log("Cancelable:", event.cancelable);      // true\n  console.log("Trusted:", event.isTrusted);          // true for real clicks\n  console.log("Timestamp:", event.timeStamp);        // ms since origin\n\n  // MouseEvent-specific properties\n  console.log("Coordinates:", event.clientX, event.clientY);\n  console.log("Button:", event.button);              // 0=left, 1=middle, 2=right\n  console.log("Modifiers:", {\n    shift: event.shiftKey,\n    ctrl: event.ctrlKey,\n    alt: event.altKey,\n    meta: event.metaKey,\n  });\n\n  // Propagation path (includes shadow DOM)\n  console.log("Path:", event.composedPath());\n});\n\n// KeyboardEvent example\ndocument.addEventListener("keydown", (event: KeyboardEvent) => {\n  console.log("Key:", event.key);     // "Enter", "a", "Shift"\n  console.log("Code:", event.code);   // "Enter", "KeyA", "ShiftLeft"\n  console.log("Repeat:", event.repeat);\n});',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: ['Event object', 'MouseEvent', 'KeyboardEvent', 'event properties'],
        commonMistakes: [
          'Confusing event.target with event.currentTarget—target is the originating element, currentTarget is the element whose listener is running.',
          'Using the deprecated event.keyCode or event.which instead of the modern event.key and event.code properties.',
          'Assuming event.isTrusted is true for programmatically dispatched events—it is always false for synthetic events.',
        ],
        followUps: [
          'What is the difference between clientX/clientY and pageX/pageY?',
          'How does composedPath() behave with Shadow DOM?',
          'When would you check event.isTrusted in production code?',
        ],
        interviewTips: [
          'Mention the distinction between key (logical) and code (physical) on KeyboardEvent—this shows awareness of internationalization concerns.',
        ],
      },
      {
        id: 'js-events-8',
        question:
          'Compare inline event handlers, DOM property handlers, and addEventListener.',
        answer:
          'JavaScript offers three mechanisms for attaching event handlers to DOM elements, each with distinct capabilities and trade-offs. Understanding all three is important because legacy codebases use all of them, and knowing the limitations of older approaches explains why `addEventListener` became the standard.\n\n**Inline HTML handlers** (e.g., `<button onclick="handleClick()">`) embed JavaScript directly in the HTML attribute. The code runs in a special scope chain that includes the element itself and `document`—a legacy quirk that can cause subtle bugs. Only one handler can exist per event per element; setting a new `onclick` attribute replaces the previous one. Inline handlers also violate separation of concerns, interfere with Content Security Policy (CSP), and implicitly call `preventDefault()` when they return `false`. They are universally discouraged in modern development.\n\n**DOM property handlers** (e.g., `element.onclick = function() {}`) assign a function to a property on the DOM node. This is cleaner than inline HTML because the JavaScript lives in script files, but it shares the same single-handler limitation: assigning a new function to `onclick` replaces the previous handler. There is no way to register multiple click listeners, no control over the propagation phase, and no `once`/`passive` options. The handler always fires during the bubbling phase (or at target).\n\n**addEventListener** is the modern, spec-compliant approach and the one you should use in virtually all cases. It supports multiple listeners for the same event on the same element, provides control over the propagation phase via the `capture` option, supports `once` for auto-removal, `passive` for scroll performance optimization, and `signal` for bulk cleanup via `AbortController`. Listeners fire in registration order and can be precisely removed with `removeEventListener`.\n\nA hybrid quirk worth noting: if both a DOM property handler and `addEventListener` listeners exist on the same element for the same event, the property handler behaves as if it were registered via `addEventListener` at the time the property was set—so ordering can be surprising. The property handler is effectively just another listener in the bubbling queue, but it can be replaced by reassigning the property.',
        shortAnswer:
          'Inline handlers are HTML attributes limited to one handler per event and violate CSP and separation of concerns. DOM property handlers (element.onclick) also support only one handler per event. addEventListener is the modern standard: it supports multiple listeners, capture/bubble control, once, passive, and AbortController cleanup.',
        code: '// 1. Inline HTML handler (avoid)\n// <button onclick="alert(\'clicked\')">Click</button>\n// - one handler per event, violates CSP, implicit scope issues\n\n// 2. DOM property handler (legacy)\nconst btn = document.getElementById("btn")!;\nbtn.onclick = (event: MouseEvent) => {\n  console.log("first handler");\n};\nbtn.onclick = (event: MouseEvent) => {\n  console.log("second handler"); // replaces the first!\n};\n// Only "second handler" runs on click\n\n// 3. addEventListener (modern, recommended)\nfunction handlerA(event: MouseEvent): void {\n  console.log("handler A");\n}\nfunction handlerB(event: MouseEvent): void {\n  console.log("handler B");\n}\n\nbtn.addEventListener("click", handlerA);\nbtn.addEventListener("click", handlerB);\n// Both "handler A" and "handler B" run on click\n\n// Advanced options only available with addEventListener\nbtn.addEventListener("click", handlerA, {\n  capture: true,   // fire during capture phase\n  once: true,      // auto-remove after first call\n  passive: true,   // won\'t call preventDefault\n});',
        language: 'typescript',
        difficulty: 'Beginner',
        type: 'Conceptual',
        category: 'JavaScript',
        topicId: 'js-events',
        tags: [
          'addEventListener',
          'onclick',
          'inline handlers',
          'event registration',
        ],
        commonMistakes: [
          'Using DOM property handlers (element.onclick) in modern code without realizing that only one handler can exist—subsequent assignments silently replace previous ones.',
          'Relying on inline HTML handlers which are blocked by strict Content Security Policies and introduce scope chain issues.',
          'Not knowing that returning false in an inline handler calls both preventDefault and stopPropagation, while returning false from addEventListener does nothing.',
        ],
        followUps: [
          'Why do inline handlers violate Content Security Policy?',
          'How does the scope chain differ for inline HTML event handlers?',
          'Can you mix DOM property handlers and addEventListener on the same element?',
        ],
        interviewTips: [
          'Frame your answer as an evolution: inline → property → addEventListener. This shows historical awareness and makes the recommendation for addEventListener feel natural.',
        ],
      },
    ],
  },
];
