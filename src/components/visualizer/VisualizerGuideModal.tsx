import type React from "react";
import styles from "@/pages/visualizer/Visualizer.module.css";

export function getGuideModalContent(): React.ReactNode {
  return (
    <div className={styles.modalContent}>
      <p>
        Welcome to the <strong>FrontendForge JavaScript Runtime &amp; Event Loop Visualizer</strong>!
        This simulator gives you an X-ray view into how JavaScript executes code in the browser and Node.js.
      </p>
      <h4>🎮 How to Interact:</h4>
      <ul>
        <li><strong>✏️ Live Code Editor:</strong> The code panel is directly editable! Edit any line or paste your own code — then simply click <strong>Play</strong> or <strong>Next</strong>.</li>
        <li><strong>▶ Moving Arrow:</strong> Watch the animated arrow and glowing strip follow execution line by line in the code gutter.</li>
        <li><strong>Play / Pause:</strong> Starts automatic continuous execution at 0.5x, 1x, or 2x speeds.</li>
        <li><strong>Prev / Next:</strong> Step through line-by-line to observe state transitions at your own pace.</li>
        <li><strong>Slider Track:</strong> Scrub to any point in the timeline immediately.</li>
        <li><strong>Info Buttons:</strong> Click the small icon on any panel to inspect that engine component's theory.</li>
      </ul>
      <h4>🧱 What You Are Watching:</h4>
      <ul>
        <li><strong>Call Stack (LIFO):</strong> Where functions execute synchronously.</li>
        <li><strong>Memory Heap:</strong> Hex addresses (e.g. <code>0x10A</code>) where objects and arrays live.</li>
        <li><strong>Event Loop Coordinator:</strong> The engine that monitors Call Stack emptiness and coordinates task execution.</li>
        <li><strong>Microtask Queue (VIP):</strong> High-priority callbacks (Promises, <code>queueMicrotask</code>) that drain before any Macrotask.</li>
        <li><strong>Macrotask Queue:</strong> Callback timers (<code>setTimeout</code>, <code>setInterval</code>) and I/O tasks.</li>
      </ul>
    </div>
  );
}

export function getEventLoopModalContent(): React.ReactNode {
  return (
    <div className={styles.modalContent}>
      <p>
        The <strong>Event Loop</strong> is a single-threaded infinite coordinator that decides what runs when:
      </p>
      <ol>
        <li><strong>Step 1:</strong> Checks if the <strong>Call Stack</strong> is empty. If frames are still running, it waits.</li>
        <li><strong>Step 2:</strong> Once empty, it drains <em>ALL</em> pending tasks in the <strong>Microtask Queue</strong> (Promises, <code>queueMicrotask</code>) to completion.</li>
        <li><strong>Step 3:</strong> Allows a browser rendering opportunity to update layout and paint.</li>
        <li><strong>Step 4:</strong> Pulls <strong>exactly ONE task</strong> from the <strong>Macrotask Queue</strong> (<code>setTimeout</code>, <code>setInterval</code>) and pushes it to the Call Stack.</li>
        <li><strong>Step 5:</strong> Repeats!</li>
      </ol>
    </div>
  );
}

export function getCallStackModalContent(): React.ReactNode {
  return (
    <div className={styles.modalContent}>
      <p>
        The <strong>Call Stack</strong> is a LIFO (Last-In, First-Out) data structure that tracks active execution contexts:
      </p>
      <ul>
        <li>Whenever a function is invoked, a new frame is <strong>pushed</strong> onto the stack.</li>
        <li>When it returns, its frame is <strong>popped</strong>.</li>
        <li>Primitives are stored directly by value in the frame.</li>
        <li>Objects and arrays live on the Heap — only their 64-bit reference address is kept in the frame!</li>
        <li>Exceeding stack capacity triggers a <code>RangeError: Maximum call stack size exceeded</code>.</li>
      </ul>
    </div>
  );
}

export function getHeapModalContent(): React.ReactNode {
  return (
    <div className={styles.modalContent}>
      <p>
        The <strong>Memory Heap</strong> is an unstructured memory pool where objects, arrays, and closures are allocated:
      </p>
      <ul>
        <li>Each object has a unique hexadecimal address (e.g. <code>0x10A</code>).</li>
        <li>Writing <code>let b = a</code> copies the <strong>memory pointer</strong>, creating an alias to the same object.</li>
        <li><strong>Garbage Collection (Mark &amp; Sweep):</strong> Unreachable objects disconnected from the root set are swept away.</li>
      </ul>
    </div>
  );
}

export function getQueueModalContent(
  area: "webapis" | "microtasks" | "macrotasks",
): { title: string; content: React.ReactNode } {
  if (area === "webapis") {
    return {
      title: "🌐 Web APIs (Browser Worker Threads)",
      content: (
        <div className={styles.modalContent}>
          <p>
            JavaScript is single-threaded, but browser APIs run on multi-threaded C++ background threads:
          </p>
          <ul>
            <li><code>setTimeout</code> and <code>setInterval</code> timers tick down in background threads.</li>
            <li><code>fetch()</code> network requests transfer packets without blocking JS.</li>
            <li>On completion, their callbacks are pushed into the Macrotask Queue.</li>
          </ul>
        </div>
      ),
    };
  }

  if (area === "microtasks") {
    return {
      title: "⚡ Microtask Queue (VIP Priority)",
      content: (
        <div className={styles.modalContent}>
          <p>
            The <strong>Microtask Queue</strong> has strict VIP priority:
          </p>
          <ul>
            <li>Holds callbacks from <code>Promise.then()</code>, <code>async/await</code>, and <code>queueMicrotask()</code>.</li>
            <li>The Event Loop drains this queue to completion before touching any Macrotask!</li>
          </ul>
        </div>
      ),
    };
  }

  return {
    title: "⏳ Macrotask Queue (Callback Queue)",
    content: (
      <div className={styles.modalContent}>
        <p>
          The <strong>Macrotask Queue</strong> holds standard deferred callbacks:
        </p>
        <ul>
          <li>Callbacks from <code>setTimeout</code> and <code>setInterval</code>.</li>
          <li>The Event Loop processes only <strong>ONE task per cycle</strong>, then yields to microtasks and rendering.</li>
        </ul>
      </div>
    ),
  };
}
