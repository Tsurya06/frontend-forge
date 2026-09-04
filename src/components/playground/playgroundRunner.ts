import { transform } from "sucrase";

export function buildReactIframeSrc(rawSource: string): { html: string; error?: string } {
  try {
    const res = transform(rawSource, {
      transforms: ["typescript", "jsx"],
      production: false,
    });

    const cleanedCode = res.code
      .replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "")
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1\nwindow.__defaultComponent = $1;")
      .replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/g, "class $1\nwindow.__defaultComponent = $1;")
      .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "window.__defaultComponent = $1;")
      .replace(/export\s+{[^}]+};?/g, "");

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin></script>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        background: #09090b;
        color: #f4f4f5;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
      }
      #root {
        min-height: 100vh;
      }
    </style>
    <script>
      const _log = console.log, _warn = console.warn, _error = console.error;
      console.log = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'log', args }, '*'); _log(...args); };
      console.warn = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'warn', args }, '*'); _warn(...args); };
      console.error = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'error', args }, '*'); _error(...args); };

      window.onerror = function(message, source, lineno, colno, error) {
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = '<div style="padding:24px;background:#2d1215;color:#fca5a5;border:1px solid #ef4444;border-radius:12px;margin:24px;font-family:monospace;font-size:13px;line-height:1.6;">' +
            '<div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#f87171;">⚠️ React Runtime Error</div>' +
            '<div>' + String(message) + '</div>' +
            (lineno ? '<div style="color:#94a3b8;font-size:11px;margin-top:8px;">Line: ' + lineno + ', Column: ' + colno + '</div>' : '') +
          '</div>';
        }
        window.parent.postMessage({ type: 'feeq-log', logType: 'error', args: [message] }, '*');
        return true;
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      (function() {
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
          document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f87171;">Error: React UMD could not be loaded from CDN. Please check network connection.</div>';
          return;
        }

        const {
          useState,
          useEffect,
          useReducer,
          useCallback,
          useMemo,
          useRef,
          useContext,
          createContext,
          useId,
          useTransition,
          useDeferredValue,
          Fragment
        } = React;
        const { createPortal } = ReactDOM;

        try {
          ${cleanedCode}

          const __Comp = window.__defaultComponent ||
            (typeof App !== 'undefined' ? App :
            (typeof Modal !== 'undefined' ? Modal :
            (typeof TicTacToe !== 'undefined' ? TicTacToe :
            (typeof CounterApp !== 'undefined' ? CounterApp :
            (typeof Component !== 'undefined' ? Component : null))));

          if (__Comp) {
            function ComponentHarness() {
              const [isOpen, setIsOpen] = useState(true);
              const compStr = String(__Comp);
              const needsModalProps = compStr.includes('isOpen') || compStr.includes('onClose');

              if (needsModalProps) {
                return React.createElement(
                  'div',
                  { style: { padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', fontFamily: 'system-ui, sans-serif' } },
                  React.createElement(
                    'button',
                    {
                      onClick: () => setIsOpen(true),
                      style: {
                        padding: '10px 20px',
                        background: '#6366f1',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                      }
                    },
                    '✨ Open ' + (__Comp.name || 'Modal')
                  ),
                  React.createElement(__Comp, {
                    isOpen: isOpen,
                    onClose: () => setIsOpen(false),
                    title: 'Live Interactive Modal',
                    children: React.createElement(
                      'div',
                      null,
                      React.createElement('p', { style: { margin: '0 0 12px', color: '#334155' } }, 'This is a live interactive test of the modal component. Try pressing Escape or clicking outside!'),
                      React.createElement('input', {
                        placeholder: 'Type here to test focus trapping...',
                        style: { padding: '8px 12px', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '8px' }
                      })
                    ),
                    footer: React.createElement(
                      'button',
                      {
                        onClick: () => setIsOpen(false),
                        style: { padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }
                      },
                      'Close Modal'
                    )
                  })
                );
              }

              return React.createElement(__Comp);
            }

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(ComponentHarness));
          } else {
            console.warn("No default component found to mount. Export a component with 'export default function App() { ... }'");
          }
        } catch (err) {
          window.onerror(err.message, "", 0, 0, err);
        }
      })();
    </script>
  </body>
</html>`;
    return { html };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 24px; background: #09090b; color: #fca5a5; font-family: monospace; font-size: 13px; }
      .box { background: #2d1215; border: 1px solid #ef4444; border-radius: 12px; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3 style="margin:0 0 10px;color:#f87171;">⚠️ JSX / TSX Compilation Error</h3>
      <pre style="white-space:pre-wrap;margin:0;">${errorMsg}</pre>
    </div>
  </body>
</html>`;
    return { html: errorHtml, error: errorMsg };
  }
}



export function buildHtmlIframeSrc(rawSource: string): string {
  const isPureCSS = !rawSource.includes("<" ) && !rawSource.includes("</");
  let injectedContent = rawSource;

  if (isPureCSS) {
    const classMatches = Array.from(rawSource.matchAll(/\.([a-zA-Z0-9_-]+)/g))
      .map((m) => m[1])
      .filter((c): c is string => Boolean(c));
    const uniqueClasses = Array.from(new Set(classMatches)).filter(
      (c) =>
        ![
          "hover",
          "focus",
          "active",
          "before",
          "after",
          "disabled",
          "checked",
        ].includes(c),
    );

    injectedContent = `
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 24px;
        margin: 0;
        background: #f7f7f8;
        color: #2d2d2d;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .demo-canvas {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        width: 100%;
        max-width: 480px;
      }
      .demo-card-box {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        text-align: center;
      }
      /* Injected User CSS */
      ${rawSource}
    </style>
    <div class="demo-canvas">
      ${
        uniqueClasses.length > 0
          ? uniqueClasses
              .map(
                (cls) =>
                  `<div class="${cls} demo-card-box"><strong>.${cls}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles applied</p></div>`,
              )
              .join("")
          : `<div class="card demo-card-box"><strong>CSS Live Preview</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Styles applied to canvas</p></div>`
      }
    </div>
  `;
  }

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script>
        const _log = console.log, _warn = console.warn, _error = console.error;
        console.log = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'log', args }, '*'); _log(...args); };
        console.warn = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'warn', args }, '*'); _warn(...args); };
        console.error = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'error', args }, '*'); _error(...args); };
      </script>
    </head>
    <body>${injectedContent}</body>
  </html>`;
}
