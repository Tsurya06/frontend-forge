import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Ensure global Prism is available for Prism language components and plugins
if (typeof window !== "undefined") {
  (window as any).Prism = Prism;
}
if (typeof globalThis !== "undefined") {
  (globalThis as any).Prism = Prism;
}

// Load components in strict dependency order:
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

export default Prism;
