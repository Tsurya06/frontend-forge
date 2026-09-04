import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t}from"./monaco-vendor-BgAia2ap.js";import{r as n,t as r}from"./react-vendor-B8VQu9QQ.js";import{F as i,L as a,i as o,o as s,r as c,s as l}from"./index-13OqtTKi.js";var u=e(t(),1),d={codeBlock:`_codeBlock_5l2kp_1`,header:`_header_5l2kp_20`,windowControls:`_windowControls_5l2kp_31`,dotRed:`_dotRed_5l2kp_37`,dotYellow:`_dotYellow_5l2kp_38`,dotGreen:`_dotGreen_5l2kp_39`,titleWrapper:`_titleWrapper_5l2kp_55`,languageBadge:`_languageBadge_5l2kp_63`,title:`_title_5l2kp_55`,actions:`_actions_5l2kp_83`,runBtn:`_runBtn_5l2kp_89`,previewBtnActive:`_previewBtnActive_5l2kp_90`,runBtnRunning:`_runBtnRunning_5l2kp_91`,playgroundBtn:`_playgroundBtn_5l2kp_123`,copyButton:`_copyButton_5l2kp_145`,copied:`_copied_5l2kp_165`,pre:`_pre_5l2kp_90`,withLineNumbers:`_withLineNumbers_5l2kp_215`,codeLine:`_codeLine_5l2kp_219`,inlineConsole:`_inlineConsole_5l2kp_245`,slideDown:`_slideDown_5l2kp_1`,consoleHeader:`_consoleHeader_5l2kp_264`,consoleTitle:`_consoleTitle_5l2kp_273`,execTime:`_execTime_5l2kp_282`,consoleActions:`_consoleActions_5l2kp_287`,clearConsoleBtn:`_clearConsoleBtn_5l2kp_293`,closeConsoleBtn:`_closeConsoleBtn_5l2kp_294`,consoleBody:`_consoleBody_5l2kp_311`,emptyLog:`_emptyLog_5l2kp_320`,consoleLine:`_consoleLine_5l2kp_325`,consolePrefix:`_consolePrefix_5l2kp_332`,consoleText:`_consoleText_5l2kp_337`,consoleLog:`_consoleLog_5l2kp_342`,consoleWarn:`_consoleWarn_5l2kp_346`,consoleError:`_consoleError_5l2kp_350`,consoleResult:`_consoleResult_5l2kp_354`,htmlPreviewContainer:`_htmlPreviewContainer_5l2kp_360`,fadeIn:`_fadeIn_5l2kp_1`,previewBar:`_previewBar_5l2kp_369`,previewBarLeft:`_previewBarLeft_5l2kp_381`,previewLiveDot:`_previewLiveDot_5l2kp_387`,previewBarTitle:`_previewBarTitle_5l2kp_395`,previewIframe:`_previewIframe_5l2kp_401`},f=new Set([`text`,`txt`,`plain`,`plaintext`,`ascii`,`tree`,`bash`,`sh`,`shell`,`terminal`,`markdown`,`md`,`output`,`log`,`pseudo`,`pseudocode`,`dir`,`directory`]);function p(e){let t=e.trim();if(t.includes(`├──`)||t.includes(`└──`)||t.includes(`│  `)||t.includes(`├───`)||t.includes(`|--`))return!0;let n=t.split(`
`),r=n.filter(e=>/^[├└│|\s-]+[a-zA-Z0-9_./-]+/.test(e.trim()));return r.length>=2&&r.length>=n.length*.4}function m(e,t){let n=(t||``).toLowerCase().trim(),r=p(e),i=f.has(n)||r,a=!i&&([`react`,`jsx`,`tsx`].includes(n)||e.includes(`import React`)||e.includes(`from 'react'`)||e.includes(`from "react"`)||e.includes(`from 'react-dom'`)||e.includes(`from "react-dom"`)||e.includes(`export default function`)||e.includes(`export default class`)),o=!i&&!a&&([`html`,`markup`,`css`,`web`].includes(n)||e.trim().startsWith(`<!--`)||e.trim().startsWith(`<!DOCTYPE`)||e.trim().startsWith(`<div`)||e.trim().startsWith(`<style`)),s=o||a,c=e.includes(`import `)||e.includes(`export `)||a;return{isNonCode:i,isHtmlCss:o,isReact:a,isPreviewable:s,isRunnableJS:!i&&!s&&!c&&[`javascript`,`typescript`,`js`,`ts`].includes(n)}}async function h(e){try{await navigator.clipboard.writeText(e)}catch{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t)}}function g(e,t,n){let r=performance.now(),i={log:(...e)=>t(`log`,...e),warn:(...e)=>t(`warn`,...e),error:(...e)=>t(`error`,...e),info:(...e)=>t(`info`,...e),clear:()=>{},table:(...e)=>t(`log`,...e)},a=l(e);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
      return (async () => {
        ${a}
      })();
      `)(i,window.setTimeout.bind(window),window.setInterval.bind(window),window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);e&&typeof e.then==`function`?e.then(e=>{n(performance.now()-r),e!==void 0&&t(`result`,`← ${s(e)}`)}).catch(e=>{t(`error`,`Runtime Error: ${e instanceof Error?e.message:String(e)}`),n(performance.now()-r)}):n(performance.now()-r)}catch(e){t(`error`,`Execution Error: ${e instanceof Error?e.message:String(e)}`),n(performance.now()-r)}}function _(e){switch(e){case`error`:return d.consoleError??``;case`warn`:return d.consoleWarn??``;case`result`:return d.consoleResult??``;default:return d.consoleLog??``}}function v(e){switch(e){case`error`:return`✗`;case`warn`:return`⚠`;case`result`:return`→`;default:return`›`}}function y(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function b(e,t){if(t.toLowerCase()===`css`||!e.includes(`<`)&&!e.includes(`</`)){let t=Array.from(e.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),n=Array.from(new Set(t)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));return`<!DOCTYPE html>
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
</html>`}var x=r();function S({showHtmlPreview:e,previewDoc:t}){return e?(0,x.jsxs)(`div`,{className:d.htmlPreviewContainer,children:[(0,x.jsx)(`div`,{className:d.previewBar,children:(0,x.jsxs)(`div`,{className:d.previewBarLeft,children:[(0,x.jsx)(`span`,{className:d.previewLiveDot}),(0,x.jsx)(`span`,{className:d.previewBarTitle,children:`Live Interactive Preview`})]})}),(0,x.jsx)(`iframe`,{title:`Live Component Preview`,className:d.previewIframe,srcDoc:t,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})]}):null}function C({showConsole:e,isRunning:t,executionTime:n,consoleOutput:r,onClear:i,onClose:a}){return e?(0,x.jsxs)(`div`,{className:d.inlineConsole,children:[(0,x.jsxs)(`div`,{className:d.consoleHeader,children:[(0,x.jsxs)(`div`,{className:d.consoleTitle,children:[(0,x.jsx)(`span`,{children:`📟 Console Output`}),n!==null&&(0,x.jsxs)(`span`,{className:d.execTime,children:[`⏱ `,n.toFixed(1),`ms`]})]}),(0,x.jsxs)(`div`,{className:d.consoleActions,children:[(0,x.jsx)(`button`,{type:`button`,className:d.clearConsoleBtn,onClick:i,children:`Clear`}),(0,x.jsx)(`button`,{type:`button`,className:d.closeConsoleBtn,onClick:a,children:`✕`})]})]}),(0,x.jsx)(`div`,{className:d.consoleBody,children:r.length===0?(0,x.jsx)(`span`,{className:d.emptyLog,children:t?`Executing code...`:`No console output recorded.`}):r.map(e=>(0,x.jsxs)(`div`,{className:`${d.consoleLine} ${_(e.type)}`,children:[(0,x.jsx)(`span`,{className:d.consolePrefix,children:v(e.type)}),(0,x.jsx)(`span`,{className:d.consoleText,children:e.text})]},e.id))})]}):null}function w({code:e,language:t,title:r,showLineNumbers:l=!1,disablePlayground:f=!1}){let[p,_]=(0,u.useState)(!1),[v,w]=(0,u.useState)(!1),[T,E]=(0,u.useState)(!1),[D,O]=(0,u.useState)(!1),[k,A]=(0,u.useState)([]),[j,M]=(0,u.useState)(null),{isNonCode:N,isHtmlCss:P,isReact:F,isPreviewable:I,isRunnableJS:L}=(0,u.useMemo)(()=>m(e,t),[e,t]),R=!f&&!N&&e.trim().length>0,z=(0,u.useCallback)(async()=>{await h(e),_(!0),setTimeout(()=>_(!1),2e3)},[e]),B=(0,u.useCallback)(()=>{if(I){O(e=>!e);return}E(!0),w(!0),A([]),M(null),g(e,(e,...t)=>{let n=t.map(s).join(` `);A(t=>[...t,{id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:e,text:n}])},e=>{M(e),w(!1)})},[e,I]),V=t===`html`?`markup`:t,H=a.languages[V],U=(0,u.useMemo)(()=>e.split(`
`).map(e=>e?H?a.highlight(e,H,V):y(e):`&nbsp;`),[e,H,V]),W=(0,u.useMemo)(()=>I?F?c(e).html:b(e,t):``,[e,I,F,t]),G=r&&r.length<=28?r:null;return(0,x.jsxs)(`div`,{className:d.codeBlock,children:[(0,x.jsxs)(`div`,{className:d.header,children:[(0,x.jsxs)(`div`,{className:d.windowControls,"aria-hidden":`true`,children:[(0,x.jsx)(`span`,{className:d.dotRed}),(0,x.jsx)(`span`,{className:d.dotYellow}),(0,x.jsx)(`span`,{className:d.dotGreen})]}),(0,x.jsxs)(`div`,{className:d.titleWrapper,children:[(0,x.jsx)(`span`,{className:d.languageBadge,children:t.toUpperCase()}),G&&(0,x.jsx)(`span`,{className:d.title,children:G})]}),(0,x.jsxs)(`div`,{className:d.actions,children:[L&&(0,x.jsx)(`button`,{type:`button`,className:v?d.runBtnRunning:d.runBtn,onClick:B,disabled:v,"aria-label":`Run code in place`,title:`Run code snippet right here`,children:v?`⏳ Running...`:`▶ Run`}),I&&(0,x.jsx)(`button`,{type:`button`,className:D?d.previewBtnActive:d.runBtn,onClick:()=>O(e=>!e),"aria-label":D?`Show Code`:F?`Live Component Preview`:`Live HTML/CSS Preview`,title:D?`Switch back to Code view`:`Toggle Live Visual Preview`,children:D?`💻 Show Code`:`👁️ Live Preview`}),R&&(0,x.jsx)(n,{to:o.PLAYGROUND,onClick:()=>{sessionStorage.setItem(i.PLAYGROUND_SNIPPET,e),F?sessionStorage.setItem(i.PLAYGROUND_MODE,`react`):P&&sessionStorage.setItem(i.PLAYGROUND_MODE,`web`)},className:d.playgroundBtn,title:`Open in Code Playground`,children:`🛠️ Playground`}),(0,x.jsx)(`button`,{type:`button`,className:`${d.copyButton} ${p?d.copied:``}`,onClick:z,"aria-label":`Copy code to clipboard`,children:p?`✓ Copied`:`📋 Copy`})]})]}),D?(0,x.jsx)(S,{showHtmlPreview:D,previewDoc:W,onClose:()=>O(!1)}):(0,x.jsx)(`pre`,{className:`${d.pre} ${l?d.withLineNumbers:``}`,children:(0,x.jsx)(`code`,{className:`language-${V}`,children:U.map((e,t)=>(0,x.jsx)(`div`,{className:d.codeLine,dangerouslySetInnerHTML:{__html:e}},t))})}),(0,x.jsx)(C,{showConsole:T,isRunning:v,executionTime:j,consoleOutput:k,onClear:()=>A([]),onClose:()=>E(!1)})]})}export{b as n,w as t};