import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t}from"./monaco-vendor-BgAia2ap.js";import{r as n,t as r}from"./react-vendor-B8VQu9QQ.js";import{M as i,a,o}from"./index-CxJU2FY8.js";var s=e(t(),1),c={codeBlock:`_codeBlock_5cjnc_1`,header:`_header_5cjnc_20`,windowControls:`_windowControls_5cjnc_31`,dotRed:`_dotRed_5cjnc_37`,dotYellow:`_dotYellow_5cjnc_38`,dotGreen:`_dotGreen_5cjnc_39`,titleWrapper:`_titleWrapper_5cjnc_55`,languageBadge:`_languageBadge_5cjnc_63`,title:`_title_5cjnc_55`,actions:`_actions_5cjnc_83`,runBtn:`_runBtn_5cjnc_89`,previewBtnActive:`_previewBtnActive_5cjnc_90`,runBtnRunning:`_runBtnRunning_5cjnc_91`,playgroundBtn:`_playgroundBtn_5cjnc_123`,copyButton:`_copyButton_5cjnc_145`,copied:`_copied_5cjnc_165`,pre:`_pre_5cjnc_90`,withLineNumbers:`_withLineNumbers_5cjnc_215`,codeLine:`_codeLine_5cjnc_219`,inlineConsole:`_inlineConsole_5cjnc_245`,slideDown:`_slideDown_5cjnc_1`,consoleHeader:`_consoleHeader_5cjnc_264`,consoleTitle:`_consoleTitle_5cjnc_273`,execTime:`_execTime_5cjnc_282`,consoleActions:`_consoleActions_5cjnc_287`,clearConsoleBtn:`_clearConsoleBtn_5cjnc_293`,closeConsoleBtn:`_closeConsoleBtn_5cjnc_294`,consoleBody:`_consoleBody_5cjnc_311`,emptyLog:`_emptyLog_5cjnc_320`,consoleLine:`_consoleLine_5cjnc_325`,consolePrefix:`_consolePrefix_5cjnc_332`,consoleText:`_consoleText_5cjnc_337`,consoleLog:`_consoleLog_5cjnc_342`,consoleWarn:`_consoleWarn_5cjnc_346`,consoleError:`_consoleError_5cjnc_350`,consoleResult:`_consoleResult_5cjnc_354`,htmlPreviewContainer:`_htmlPreviewContainer_5cjnc_360`,previewBar:`_previewBar_5cjnc_367`,previewIframe:`_previewIframe_5cjnc_379`},l=r(),u=new Set([`text`,`txt`,`plain`,`plaintext`,`ascii`,`tree`,`bash`,`sh`,`shell`,`terminal`,`markdown`,`md`,`output`,`log`,`pseudo`,`pseudocode`,`dir`,`directory`]);function d(e){let t=e.trim();if(t.includes(`├──`)||t.includes(`└──`)||t.includes(`│  `)||t.includes(`├───`)||t.includes(`|--`))return!0;let n=t.split(`
`),r=n.filter(e=>/^[├└│|\s\-]+[a-zA-Z0-9_\-./]+/.test(e.trim()));return r.length>=2&&r.length>=n.length*.4}function f({code:e,language:t,title:r,showLineNumbers:f=!1,disablePlayground:h=!1}){let[g,_]=(0,s.useState)(!1),[v,y]=(0,s.useState)(!1),[b,x]=(0,s.useState)(!1),[S,C]=(0,s.useState)(!1),[w,T]=(0,s.useState)([]),[E,D]=(0,s.useState)(null),O=(t||``).toLowerCase().trim(),k=d(e),A=u.has(O)||k,j=!A&&([`html`,`markup`,`css`,`web`].includes(O)||e.trim().startsWith(`<!--`)||e.trim().startsWith(`<!DOCTYPE`)||e.trim().startsWith(`<div`)||e.trim().startsWith(`<style`)),M=!A&&[`javascript`,`typescript`,`js`,`ts`,`jsx`,`tsx`].includes(O)&&!j,N=!h&&!A&&e.trim().length>0,P=(0,s.useCallback)(async()=>{try{await navigator.clipboard.writeText(e),_(!0),setTimeout(()=>_(!1),2e3)}catch{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t),_(!0),setTimeout(()=>_(!1),2e3)}},[e]),F=(0,s.useCallback)(()=>{if(j){C(e=>!e);return}x(!0),y(!0),T([]),D(null);let t=performance.now(),n=(e,...t)=>{let n=t.map(a).join(` `);T(t=>[...t,{id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:e,text:n}])},r={log:(...e)=>n(`log`,...e),warn:(...e)=>n(`warn`,...e),error:(...e)=>n(`error`,...e),info:(...e)=>n(`info`,...e),clear:()=>T([]),table:(...e)=>n(`log`,...e)},i=o(e);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
        return (async () => {
          ${i}
        })();
        `)(r,window.setTimeout.bind(window),window.setInterval.bind(window),window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);if(e&&typeof e.then==`function`)e.then(e=>{let r=performance.now()-t;D(r),y(!1),e!==void 0&&n(`result`,`← ${a(e)}`)}).catch(e=>{let r=e instanceof Error?e.message:String(e);n(`error`,`Runtime Error: ${r}`),D(performance.now()-t),y(!1)});else{let e=performance.now()-t;D(e),y(!1)}}catch(e){n(`error`,`Execution Error: ${e instanceof Error?e.message:String(e)}`),D(performance.now()-t),y(!1)}},[e,j]),I=t===`html`?`markup`:t,L=i.languages[I],R=(0,s.useMemo)(()=>e.split(`
`).map(e=>e?L?i.highlight(e,L,I):p(e):`&nbsp;`),[e,L,I]),z=(0,s.useMemo)(()=>j?m(e,t):``,[e,j,t]),B=r&&r.length<=28?r:null;return(0,l.jsxs)(`div`,{className:c.codeBlock,children:[(0,l.jsxs)(`div`,{className:c.header,children:[(0,l.jsxs)(`div`,{className:c.windowControls,"aria-hidden":`true`,children:[(0,l.jsx)(`span`,{className:c.dotRed}),(0,l.jsx)(`span`,{className:c.dotYellow}),(0,l.jsx)(`span`,{className:c.dotGreen})]}),(0,l.jsxs)(`div`,{className:c.titleWrapper,children:[(0,l.jsx)(`span`,{className:c.languageBadge,children:t.toUpperCase()}),B&&(0,l.jsx)(`span`,{className:c.title,children:B})]}),(0,l.jsxs)(`div`,{className:c.actions,children:[M&&(0,l.jsx)(`button`,{type:`button`,className:v?c.runBtnRunning:c.runBtn,onClick:F,disabled:v,"aria-label":`Run code in place`,title:`Run code snippet right here`,children:v?`⏳ Running...`:`▶ Run`}),j&&(0,l.jsx)(`button`,{type:`button`,className:S?c.previewBtnActive:c.runBtn,onClick:()=>C(e=>!e),"aria-label":`Live HTML/CSS Preview`,title:`Toggle Live Visual Preview`,children:S?`✕ Hide Preview`:`👁️ Live Preview`}),N&&(0,l.jsx)(n,{to:`/playground`,onClick:()=>{sessionStorage.setItem(`feeq-playground-snippet`,e),j&&sessionStorage.setItem(`feeq-playground-mode`,`web`)},className:c.playgroundBtn,title:`Open in Code Playground`,children:`🛠️ Playground`}),(0,l.jsx)(`button`,{type:`button`,className:`${c.copyButton} ${g?c.copied:``}`,onClick:P,"aria-label":`Copy code to clipboard`,children:g?`✓ Copied`:`📋 Copy`})]})]}),(0,l.jsx)(`pre`,{className:`${c.pre} ${f?c.withLineNumbers:``}`,children:(0,l.jsx)(`code`,{className:`language-${I}`,children:R.map((e,t)=>(0,l.jsx)(`div`,{className:c.codeLine,dangerouslySetInnerHTML:{__html:e}},t))})}),S&&(0,l.jsxs)(`div`,{className:c.htmlPreviewContainer,children:[(0,l.jsxs)(`div`,{className:c.previewBar,children:[(0,l.jsx)(`span`,{children:`🌐 Live Interactive Component Preview`}),(0,l.jsx)(`button`,{type:`button`,className:c.closeConsoleBtn,onClick:()=>C(!1),children:`✕`})]}),(0,l.jsx)(`iframe`,{title:`Live Component Preview`,className:c.previewIframe,srcDoc:z,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})]}),b&&(0,l.jsxs)(`div`,{className:c.inlineConsole,children:[(0,l.jsxs)(`div`,{className:c.consoleHeader,children:[(0,l.jsxs)(`div`,{className:c.consoleTitle,children:[(0,l.jsx)(`span`,{children:`📟 Console Output`}),E!==null&&(0,l.jsxs)(`span`,{className:c.execTime,children:[`⏱ `,E.toFixed(1),`ms`]})]}),(0,l.jsxs)(`div`,{className:c.consoleActions,children:[(0,l.jsx)(`button`,{type:`button`,className:c.clearConsoleBtn,onClick:()=>T([]),children:`Clear`}),(0,l.jsx)(`button`,{type:`button`,className:c.closeConsoleBtn,onClick:()=>x(!1),children:`✕`})]})]}),(0,l.jsx)(`div`,{className:c.consoleBody,children:w.length===0?(0,l.jsx)(`span`,{className:c.emptyLog,children:v?`Executing code...`:`No console output recorded.`}):w.map(e=>(0,l.jsxs)(`div`,{className:`${c.consoleLine} ${e.type===`error`?c.consoleError:e.type===`warn`?c.consoleWarn:e.type===`result`?c.consoleResult:c.consoleLog}`,children:[(0,l.jsx)(`span`,{className:c.consolePrefix,children:e.type===`error`?`✗`:e.type===`warn`?`⚠`:e.type===`result`?`→`:`›`}),(0,l.jsx)(`span`,{className:c.consoleText,children:e.text})]},e.id))})]})]})}function p(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function m(e,t){if(t.toLowerCase()===`css`||!e.includes(`<`)&&!e.includes(`</`)){let t=Array.from(e.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),n=Array.from(new Set(t)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));return`<!DOCTYPE html>
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
</html>`}export{f as t};