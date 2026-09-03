import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t}from"./monaco-vendor-BgAia2ap.js";import{r as n,t as r}from"./react-vendor-B8VQu9QQ.js";import{t as i}from"./prism-vendor-DfaG54Sv.js";import{a,o}from"./index-Cj4y766s.js";var s=e(t(),1),c=e(i(),1),l={codeBlock:`_codeBlock_5cjnc_1`,header:`_header_5cjnc_20`,windowControls:`_windowControls_5cjnc_31`,dotRed:`_dotRed_5cjnc_37`,dotYellow:`_dotYellow_5cjnc_38`,dotGreen:`_dotGreen_5cjnc_39`,titleWrapper:`_titleWrapper_5cjnc_55`,languageBadge:`_languageBadge_5cjnc_63`,title:`_title_5cjnc_55`,actions:`_actions_5cjnc_83`,runBtn:`_runBtn_5cjnc_89`,previewBtnActive:`_previewBtnActive_5cjnc_90`,runBtnRunning:`_runBtnRunning_5cjnc_91`,playgroundBtn:`_playgroundBtn_5cjnc_123`,copyButton:`_copyButton_5cjnc_145`,copied:`_copied_5cjnc_165`,pre:`_pre_5cjnc_90`,withLineNumbers:`_withLineNumbers_5cjnc_215`,codeLine:`_codeLine_5cjnc_219`,inlineConsole:`_inlineConsole_5cjnc_245`,slideDown:`_slideDown_5cjnc_1`,consoleHeader:`_consoleHeader_5cjnc_264`,consoleTitle:`_consoleTitle_5cjnc_273`,execTime:`_execTime_5cjnc_282`,consoleActions:`_consoleActions_5cjnc_287`,clearConsoleBtn:`_clearConsoleBtn_5cjnc_293`,closeConsoleBtn:`_closeConsoleBtn_5cjnc_294`,consoleBody:`_consoleBody_5cjnc_311`,emptyLog:`_emptyLog_5cjnc_320`,consoleLine:`_consoleLine_5cjnc_325`,consolePrefix:`_consolePrefix_5cjnc_332`,consoleText:`_consoleText_5cjnc_337`,consoleLog:`_consoleLog_5cjnc_342`,consoleWarn:`_consoleWarn_5cjnc_346`,consoleError:`_consoleError_5cjnc_350`,consoleResult:`_consoleResult_5cjnc_354`,htmlPreviewContainer:`_htmlPreviewContainer_5cjnc_360`,previewBar:`_previewBar_5cjnc_367`,previewIframe:`_previewIframe_5cjnc_379`},u=r(),d=new Set([`text`,`txt`,`plain`,`plaintext`,`ascii`,`tree`,`bash`,`sh`,`shell`,`terminal`,`markdown`,`md`,`output`,`log`,`pseudo`,`pseudocode`,`dir`,`directory`]);function f(e){let t=e.trim();if(t.includes(`├──`)||t.includes(`└──`)||t.includes(`│  `)||t.includes(`├───`)||t.includes(`|--`))return!0;let n=t.split(`
`),r=n.filter(e=>/^[├└│|\s-]+[a-zA-Z0-9_./-]+/.test(e.trim()));return r.length>=2&&r.length>=n.length*.4}function p({code:e,language:t,title:r,showLineNumbers:i=!1,disablePlayground:p=!1}){let[g,_]=(0,s.useState)(!1),[v,y]=(0,s.useState)(!1),[b,x]=(0,s.useState)(!1),[S,C]=(0,s.useState)(!1),[w,T]=(0,s.useState)([]),[E,D]=(0,s.useState)(null),O=(t||``).toLowerCase().trim(),k=f(e),A=d.has(O)||k,j=!A&&([`html`,`markup`,`css`,`web`].includes(O)||e.trim().startsWith(`<!--`)||e.trim().startsWith(`<!DOCTYPE`)||e.trim().startsWith(`<div`)||e.trim().startsWith(`<style`)),M=!A&&[`javascript`,`typescript`,`js`,`ts`,`jsx`,`tsx`].includes(O)&&!j,N=!p&&!A&&e.trim().length>0,P=(0,s.useCallback)(async()=>{try{await navigator.clipboard.writeText(e),_(!0),setTimeout(()=>_(!1),2e3)}catch{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t),_(!0),setTimeout(()=>_(!1),2e3)}},[e]),F=(0,s.useCallback)(()=>{if(j){C(e=>!e);return}x(!0),y(!0),T([]),D(null);let t=performance.now(),n=(e,...t)=>{let n=t.map(a).join(` `);T(t=>[...t,{id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:e,text:n}])},r={log:(...e)=>n(`log`,...e),warn:(...e)=>n(`warn`,...e),error:(...e)=>n(`error`,...e),info:(...e)=>n(`info`,...e),clear:()=>T([]),table:(...e)=>n(`log`,...e)},i=o(e);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
        return (async () => {
          ${i}
        })();
        `)(r,window.setTimeout.bind(window),window.setInterval.bind(window),window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);if(e&&typeof e.then==`function`)e.then(e=>{let r=performance.now()-t;D(r),y(!1),e!==void 0&&n(`result`,`← ${a(e)}`)}).catch(e=>{let r=e instanceof Error?e.message:String(e);n(`error`,`Runtime Error: ${r}`),D(performance.now()-t),y(!1)});else{let e=performance.now()-t;D(e),y(!1)}}catch(e){n(`error`,`Execution Error: ${e instanceof Error?e.message:String(e)}`),D(performance.now()-t),y(!1)}},[e,j]),I=t===`html`?`markup`:t,L=c.default.languages[I],R=(0,s.useMemo)(()=>e.split(`
`).map(e=>e?L?c.default.highlight(e,L,I):m(e):`&nbsp;`),[e,L,I]),z=(0,s.useMemo)(()=>j?h(e,t):``,[e,j,t]),B=r&&r.length<=28?r:null;return(0,u.jsxs)(`div`,{className:l.codeBlock,children:[(0,u.jsxs)(`div`,{className:l.header,children:[(0,u.jsxs)(`div`,{className:l.windowControls,"aria-hidden":`true`,children:[(0,u.jsx)(`span`,{className:l.dotRed}),(0,u.jsx)(`span`,{className:l.dotYellow}),(0,u.jsx)(`span`,{className:l.dotGreen})]}),(0,u.jsxs)(`div`,{className:l.titleWrapper,children:[(0,u.jsx)(`span`,{className:l.languageBadge,children:t.toUpperCase()}),B&&(0,u.jsx)(`span`,{className:l.title,children:B})]}),(0,u.jsxs)(`div`,{className:l.actions,children:[M&&(0,u.jsx)(`button`,{type:`button`,className:v?l.runBtnRunning:l.runBtn,onClick:F,disabled:v,"aria-label":`Run code in place`,title:`Run code snippet right here`,children:v?`⏳ Running...`:`▶ Run`}),j&&(0,u.jsx)(`button`,{type:`button`,className:S?l.previewBtnActive:l.runBtn,onClick:()=>C(e=>!e),"aria-label":`Live HTML/CSS Preview`,title:`Toggle Live Visual Preview`,children:S?`✕ Hide Preview`:`👁️ Live Preview`}),N&&(0,u.jsx)(n,{to:`/playground`,onClick:()=>{sessionStorage.setItem(`feeq-playground-snippet`,e),j&&sessionStorage.setItem(`feeq-playground-mode`,`web`)},className:l.playgroundBtn,title:`Open in Code Playground`,children:`🛠️ Playground`}),(0,u.jsx)(`button`,{type:`button`,className:`${l.copyButton} ${g?l.copied:``}`,onClick:P,"aria-label":`Copy code to clipboard`,children:g?`✓ Copied`:`📋 Copy`})]})]}),(0,u.jsx)(`pre`,{className:`${l.pre} ${i?l.withLineNumbers:``}`,children:(0,u.jsx)(`code`,{className:`language-${I}`,children:R.map((e,t)=>(0,u.jsx)(`div`,{className:l.codeLine,dangerouslySetInnerHTML:{__html:e}},t))})}),S&&(0,u.jsxs)(`div`,{className:l.htmlPreviewContainer,children:[(0,u.jsxs)(`div`,{className:l.previewBar,children:[(0,u.jsx)(`span`,{children:`🌐 Live Interactive Component Preview`}),(0,u.jsx)(`button`,{type:`button`,className:l.closeConsoleBtn,onClick:()=>C(!1),children:`✕`})]}),(0,u.jsx)(`iframe`,{title:`Live Component Preview`,className:l.previewIframe,srcDoc:z,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})]}),b&&(0,u.jsxs)(`div`,{className:l.inlineConsole,children:[(0,u.jsxs)(`div`,{className:l.consoleHeader,children:[(0,u.jsxs)(`div`,{className:l.consoleTitle,children:[(0,u.jsx)(`span`,{children:`📟 Console Output`}),E!==null&&(0,u.jsxs)(`span`,{className:l.execTime,children:[`⏱ `,E.toFixed(1),`ms`]})]}),(0,u.jsxs)(`div`,{className:l.consoleActions,children:[(0,u.jsx)(`button`,{type:`button`,className:l.clearConsoleBtn,onClick:()=>T([]),children:`Clear`}),(0,u.jsx)(`button`,{type:`button`,className:l.closeConsoleBtn,onClick:()=>x(!1),children:`✕`})]})]}),(0,u.jsx)(`div`,{className:l.consoleBody,children:w.length===0?(0,u.jsx)(`span`,{className:l.emptyLog,children:v?`Executing code...`:`No console output recorded.`}):w.map(e=>(0,u.jsxs)(`div`,{className:`${l.consoleLine} ${e.type===`error`?l.consoleError:e.type===`warn`?l.consoleWarn:e.type===`result`?l.consoleResult:l.consoleLog}`,children:[(0,u.jsx)(`span`,{className:l.consolePrefix,children:e.type===`error`?`✗`:e.type===`warn`?`⚠`:e.type===`result`?`→`:`›`}),(0,u.jsx)(`span`,{className:l.consoleText,children:e.text})]},e.id))})]})]})}function m(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function h(e,t){if(t.toLowerCase()===`css`||!e.includes(`<`)&&!e.includes(`</`)){let t=Array.from(e.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),n=Array.from(new Set(t)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));return`<!DOCTYPE html>
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
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        margin: 0;
        background: #ffffff;
        color: #2d2d2d;
      }
    </style>
  </head>
  <body>${e}</body>
</html>`}export{p as t};