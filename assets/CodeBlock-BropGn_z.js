import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t}from"./monaco-vendor-BgAia2ap.js";import{r as n,t as r}from"./react-vendor-B8VQu9QQ.js";import{I as i,P as a,a as o,o as s,r as c}from"./index-CETTJGiM.js";var l=e(t(),1),u={codeBlock:`_codeBlock_5l2kp_1`,header:`_header_5l2kp_20`,windowControls:`_windowControls_5l2kp_31`,dotRed:`_dotRed_5l2kp_37`,dotYellow:`_dotYellow_5l2kp_38`,dotGreen:`_dotGreen_5l2kp_39`,titleWrapper:`_titleWrapper_5l2kp_55`,languageBadge:`_languageBadge_5l2kp_63`,title:`_title_5l2kp_55`,actions:`_actions_5l2kp_83`,runBtn:`_runBtn_5l2kp_89`,previewBtnActive:`_previewBtnActive_5l2kp_90`,runBtnRunning:`_runBtnRunning_5l2kp_91`,playgroundBtn:`_playgroundBtn_5l2kp_123`,copyButton:`_copyButton_5l2kp_145`,copied:`_copied_5l2kp_165`,pre:`_pre_5l2kp_90`,withLineNumbers:`_withLineNumbers_5l2kp_215`,codeLine:`_codeLine_5l2kp_219`,inlineConsole:`_inlineConsole_5l2kp_245`,slideDown:`_slideDown_5l2kp_1`,consoleHeader:`_consoleHeader_5l2kp_264`,consoleTitle:`_consoleTitle_5l2kp_273`,execTime:`_execTime_5l2kp_282`,consoleActions:`_consoleActions_5l2kp_287`,clearConsoleBtn:`_clearConsoleBtn_5l2kp_293`,closeConsoleBtn:`_closeConsoleBtn_5l2kp_294`,consoleBody:`_consoleBody_5l2kp_311`,emptyLog:`_emptyLog_5l2kp_320`,consoleLine:`_consoleLine_5l2kp_325`,consolePrefix:`_consolePrefix_5l2kp_332`,consoleText:`_consoleText_5l2kp_337`,consoleLog:`_consoleLog_5l2kp_342`,consoleWarn:`_consoleWarn_5l2kp_346`,consoleError:`_consoleError_5l2kp_350`,consoleResult:`_consoleResult_5l2kp_354`,htmlPreviewContainer:`_htmlPreviewContainer_5l2kp_360`,fadeIn:`_fadeIn_5l2kp_1`,previewBar:`_previewBar_5l2kp_369`,previewBarLeft:`_previewBarLeft_5l2kp_381`,previewLiveDot:`_previewLiveDot_5l2kp_387`,previewBarTitle:`_previewBarTitle_5l2kp_395`,previewIframe:`_previewIframe_5l2kp_401`},d=new Set([`text`,`txt`,`plain`,`plaintext`,`ascii`,`tree`,`bash`,`sh`,`shell`,`terminal`,`markdown`,`md`,`output`,`log`,`pseudo`,`pseudocode`,`dir`,`directory`]);function f(e){let t=e.trim();if(t.includes(`├──`)||t.includes(`└──`)||t.includes(`│  `)||t.includes(`├───`)||t.includes(`|--`))return!0;let n=t.split(`
`),r=n.filter(e=>/^[├└│|\s-]+[a-zA-Z0-9_./-]+/.test(e.trim()));return r.length>=2&&r.length>=n.length*.4}function p(e,t){let n=(t||``).toLowerCase().trim(),r=f(e),i=d.has(n)||r,a=!i&&([`html`,`markup`,`css`,`web`].includes(n)||e.trim().startsWith(`<!--`)||e.trim().startsWith(`<!DOCTYPE`)||e.trim().startsWith(`<div`)||e.trim().startsWith(`<style`));return{isNonCode:i,isHtmlCss:a,isRunnableJS:!i&&[`javascript`,`typescript`,`js`,`ts`,`jsx`,`tsx`].includes(n)&&!a}}async function m(e){try{await navigator.clipboard.writeText(e)}catch{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t)}}function h(e,t,n){let r=performance.now(),i={log:(...e)=>t(`log`,...e),warn:(...e)=>t(`warn`,...e),error:(...e)=>t(`error`,...e),info:(...e)=>t(`info`,...e),clear:()=>{},table:(...e)=>t(`log`,...e)},a=s(e);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
      return (async () => {
        ${a}
      })();
      `)(i,window.setTimeout.bind(window),window.setInterval.bind(window),window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);e&&typeof e.then==`function`?e.then(e=>{n(performance.now()-r),e!==void 0&&t(`result`,`← ${o(e)}`)}).catch(e=>{t(`error`,`Runtime Error: ${e instanceof Error?e.message:String(e)}`),n(performance.now()-r)}):n(performance.now()-r)}catch(e){t(`error`,`Execution Error: ${e instanceof Error?e.message:String(e)}`),n(performance.now()-r)}}function g(e){switch(e){case`error`:return u.consoleError??``;case`warn`:return u.consoleWarn??``;case`result`:return u.consoleResult??``;default:return u.consoleLog??``}}function _(e){switch(e){case`error`:return`✗`;case`warn`:return`⚠`;case`result`:return`→`;default:return`›`}}function v(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function y(e,t){if(t.toLowerCase()===`css`||!e.includes(`<`)&&!e.includes(`</`)){let t=Array.from(e.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),n=Array.from(new Set(t)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));return`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
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
      .demo-card-fallback {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      /* Injected CSS */
      ${e}
    </style>
  </head>
  <body>
    <div class="demo-canvas">
      ${n.length>0?n.map(e=>`<div class="${e} demo-card-fallback"><strong>.${e}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles & animations active</p></div>`).join(``):`<div class="card demo-card-fallback"><strong>CSS Animation / Style Demo</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Live render testbed</p></div>`}
    </div>
  </body>
</html>`}return e.includes(`<html`)||e.includes(`<body`)?e:`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 32px 20px;
        margin: 0;
        background: #f8fafc;
        color: #0f172a;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
    </style>
  </head>
  <body>${e}</body>
</html>`}var b=r();function x({showHtmlPreview:e,previewDoc:t}){return e?(0,b.jsxs)(`div`,{className:u.htmlPreviewContainer,children:[(0,b.jsx)(`div`,{className:u.previewBar,children:(0,b.jsxs)(`div`,{className:u.previewBarLeft,children:[(0,b.jsx)(`span`,{className:u.previewLiveDot}),(0,b.jsx)(`span`,{className:u.previewBarTitle,children:`Live Interactive Preview`})]})}),(0,b.jsx)(`iframe`,{title:`Live Component Preview`,className:u.previewIframe,srcDoc:t,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})]}):null}function S({showConsole:e,isRunning:t,executionTime:n,consoleOutput:r,onClear:i,onClose:a}){return e?(0,b.jsxs)(`div`,{className:u.inlineConsole,children:[(0,b.jsxs)(`div`,{className:u.consoleHeader,children:[(0,b.jsxs)(`div`,{className:u.consoleTitle,children:[(0,b.jsx)(`span`,{children:`📟 Console Output`}),n!==null&&(0,b.jsxs)(`span`,{className:u.execTime,children:[`⏱ `,n.toFixed(1),`ms`]})]}),(0,b.jsxs)(`div`,{className:u.consoleActions,children:[(0,b.jsx)(`button`,{type:`button`,className:u.clearConsoleBtn,onClick:i,children:`Clear`}),(0,b.jsx)(`button`,{type:`button`,className:u.closeConsoleBtn,onClick:a,children:`✕`})]})]}),(0,b.jsx)(`div`,{className:u.consoleBody,children:r.length===0?(0,b.jsx)(`span`,{className:u.emptyLog,children:t?`Executing code...`:`No console output recorded.`}):r.map(e=>(0,b.jsxs)(`div`,{className:`${u.consoleLine} ${g(e.type)}`,children:[(0,b.jsx)(`span`,{className:u.consolePrefix,children:_(e.type)}),(0,b.jsx)(`span`,{className:u.consoleText,children:e.text})]},e.id))})]}):null}function C({code:e,language:t,title:r,showLineNumbers:s=!1,disablePlayground:d=!1}){let[f,g]=(0,l.useState)(!1),[_,C]=(0,l.useState)(!1),[w,T]=(0,l.useState)(!1),[E,D]=(0,l.useState)(!1),[O,k]=(0,l.useState)([]),[A,j]=(0,l.useState)(null),{isNonCode:M,isHtmlCss:N,isRunnableJS:P}=(0,l.useMemo)(()=>p(e,t),[e,t]),F=!d&&!M&&e.trim().length>0,I=(0,l.useCallback)(async()=>{await m(e),g(!0),setTimeout(()=>g(!1),2e3)},[e]),L=(0,l.useCallback)(()=>{if(N){D(e=>!e);return}T(!0),C(!0),k([]),j(null),h(e,(e,...t)=>{let n=t.map(o).join(` `);k(t=>[...t,{id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:e,text:n}])},e=>{j(e),C(!1)})},[e,N]),R=t===`html`?`markup`:t,z=i.languages[R],B=(0,l.useMemo)(()=>e.split(`
`).map(e=>e?z?i.highlight(e,z,R):v(e):`&nbsp;`),[e,z,R]),V=(0,l.useMemo)(()=>N?y(e,t):``,[e,N,t]),H=r&&r.length<=28?r:null;return(0,b.jsxs)(`div`,{className:u.codeBlock,children:[(0,b.jsxs)(`div`,{className:u.header,children:[(0,b.jsxs)(`div`,{className:u.windowControls,"aria-hidden":`true`,children:[(0,b.jsx)(`span`,{className:u.dotRed}),(0,b.jsx)(`span`,{className:u.dotYellow}),(0,b.jsx)(`span`,{className:u.dotGreen})]}),(0,b.jsxs)(`div`,{className:u.titleWrapper,children:[(0,b.jsx)(`span`,{className:u.languageBadge,children:t.toUpperCase()}),H&&(0,b.jsx)(`span`,{className:u.title,children:H})]}),(0,b.jsxs)(`div`,{className:u.actions,children:[P&&(0,b.jsx)(`button`,{type:`button`,className:_?u.runBtnRunning:u.runBtn,onClick:L,disabled:_,"aria-label":`Run code in place`,title:`Run code snippet right here`,children:_?`⏳ Running...`:`▶ Run`}),N&&(0,b.jsx)(`button`,{type:`button`,className:E?u.previewBtnActive:u.runBtn,onClick:()=>D(e=>!e),"aria-label":E?`Show Code`:`Live HTML/CSS Preview`,title:E?`Switch back to Code view`:`Toggle Live Visual Preview`,children:E?`💻 Show Code`:`👁️ Live Preview`}),F&&(0,b.jsx)(n,{to:c.PLAYGROUND,onClick:()=>{sessionStorage.setItem(a.PLAYGROUND_SNIPPET,e),N&&sessionStorage.setItem(a.PLAYGROUND_MODE,`web`)},className:u.playgroundBtn,title:`Open in Code Playground`,children:`🛠️ Playground`}),(0,b.jsx)(`button`,{type:`button`,className:`${u.copyButton} ${f?u.copied:``}`,onClick:I,"aria-label":`Copy code to clipboard`,children:f?`✓ Copied`:`📋 Copy`})]})]}),E?(0,b.jsx)(x,{showHtmlPreview:E,previewDoc:V,onClose:()=>D(!1)}):(0,b.jsx)(`pre`,{className:`${u.pre} ${s?u.withLineNumbers:``}`,children:(0,b.jsx)(`code`,{className:`language-${R}`,children:B.map((e,t)=>(0,b.jsx)(`div`,{className:u.codeLine,dangerouslySetInnerHTML:{__html:e}},t))})}),(0,b.jsx)(S,{showConsole:w,isRunning:_,executionTime:A,consoleOutput:O,onClear:()=>k([]),onClose:()=>T(!1)})]})}export{y as n,C as t};