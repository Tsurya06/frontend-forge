import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{n as t}from"./monaco-vendor-BgAia2ap.js";import{f as n,r,t as i}from"./react-vendor-DMx3giZ7.js";import{a,o}from"./index-RO-zgmb1.js";import{t as s}from"./prism-Be-4h6rd.js";var c=e(t(),1),l=e(s(),1),u=i(),d={codeBlock:`_codeBlock_18vi6_1`,header:`_header_18vi6_39`,windowControls:`_windowControls_18vi6_61`,dotRed:`_dotRed_18vi6_73`,dotYellow:`_dotYellow_18vi6_75`,dotGreen:`_dotGreen_18vi6_77`,titleWrapper:`_titleWrapper_18vi6_109`,languageBadge:`_languageBadge_18vi6_125`,title:`_title_18vi6_109`,actions:`_actions_18vi6_165`,runBtn:`_runBtn_18vi6_177`,previewBtnActive:`_previewBtnActive_18vi6_179`,runBtnRunning:`_runBtnRunning_18vi6_181`,playgroundBtn:`_playgroundBtn_18vi6_245`,copyButton:`_copyButton_18vi6_289`,copied:`_copied_18vi6_329`,pre:`_pre_18vi6_179`,withLineNumbers:`_withLineNumbers_18vi6_429`,codeLine:`_codeLine_18vi6_437`,inlineConsole:`_inlineConsole_18vi6_489`,slideDown:`_slideDown_18vi6_1`,consoleHeader:`_consoleHeader_18vi6_527`,consoleTitle:`_consoleTitle_18vi6_545`,execTime:`_execTime_18vi6_563`,consoleActions:`_consoleActions_18vi6_573`,clearConsoleBtn:`_clearConsoleBtn_18vi6_585`,closeConsoleBtn:`_closeConsoleBtn_18vi6_587`,consoleBody:`_consoleBody_18vi6_621`,emptyLog:`_emptyLog_18vi6_639`,consoleLine:`_consoleLine_18vi6_649`,consolePrefix:`_consolePrefix_18vi6_663`,consoleText:`_consoleText_18vi6_673`,consoleLog:`_consoleLog_18vi6_683`,consoleWarn:`_consoleWarn_18vi6_691`,consoleError:`_consoleError_18vi6_699`,consoleResult:`_consoleResult_18vi6_707`,htmlPreviewContainer:`_htmlPreviewContainer_18vi6_719`,previewBar:`_previewBar_18vi6_733`,previewIframe:`_previewIframe_18vi6_757`};typeof window<`u`&&(window.Prism=l.default,n(()=>import(`./prism-typescript-BMqONzxf.js`),[],import.meta.url),n(()=>import(`./prism-javascript-BnO-swvr.js`),[],import.meta.url),n(()=>import(`./prism-jsx-D-D0NWtC.js`),[],import.meta.url),n(()=>import(`./prism-tsx-p6J2Kc_4.js`),[],import.meta.url),n(()=>import(`./prism-css-CPgOzxXp.js`),[],import.meta.url),n(()=>import(`./prism-json-Dp_-W-Hv.js`),[],import.meta.url),n(()=>import(`./prism-bash-D6zCJ74D.js`),[],import.meta.url),n(()=>import(`./prism-markup-Cp04rIa1.js`),[],import.meta.url));var f=new Set([`text`,`txt`,`plain`,`plaintext`,`ascii`,`tree`,`bash`,`sh`,`shell`,`terminal`,`markdown`,`md`,`output`,`log`,`pseudo`,`pseudocode`,`dir`,`directory`]);function p(e){let t=e.trim();if(t.includes(`├──`)||t.includes(`└──`)||t.includes(`│  `)||t.includes(`├───`)||t.includes(`|--`))return!0;let n=t.split(`
`),r=n.filter(e=>/^[├└│|\s-]+[a-zA-Z0-9_./-]+/.test(e.trim()));return r.length>=2&&r.length>=n.length*.4}function m({code:e,language:t,title:n,showLineNumbers:i=!1,disablePlayground:s=!1}){let[m,_]=(0,c.useState)(!1),[v,y]=(0,c.useState)(!1),[b,x]=(0,c.useState)(!1),[S,C]=(0,c.useState)(!1),[w,T]=(0,c.useState)([]),[E,D]=(0,c.useState)(null),O=(t||``).toLowerCase().trim(),k=p(e),A=f.has(O)||k,j=!A&&([`html`,`markup`,`css`,`web`].includes(O)||e.trim().startsWith(`<!--`)||e.trim().startsWith(`<!DOCTYPE`)||e.trim().startsWith(`<div`)||e.trim().startsWith(`<style`)),M=!A&&[`javascript`,`typescript`,`js`,`ts`,`jsx`,`tsx`].includes(O)&&!j,N=!s&&!A&&e.trim().length>0,P=(0,c.useCallback)(async()=>{try{await navigator.clipboard.writeText(e),_(!0),setTimeout(()=>_(!1),2e3)}catch{let t=document.createElement(`textarea`);t.value=e,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t),_(!0),setTimeout(()=>_(!1),2e3)}},[e]),F=(0,c.useCallback)(()=>{if(j){C(e=>!e);return}x(!0),y(!0),T([]),D(null);let t=performance.now(),n=(e,...t)=>{let n=t.map(a).join(` `);T(t=>[...t,{id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:e,text:n}])},r={log:(...e)=>n(`log`,...e),warn:(...e)=>n(`warn`,...e),error:(...e)=>n(`error`,...e),info:(...e)=>n(`info`,...e),clear:()=>T([]),table:(...e)=>n(`log`,...e)},i=o(e);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
        return (async () => {
          ${i}
        })();
        `)(r,window.setTimeout.bind(window),window.setInterval.bind(window),window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);if(e&&typeof e.then==`function`)e.then(e=>{let r=performance.now()-t;D(r),y(!1),e!==void 0&&n(`result`,`← ${a(e)}`)}).catch(e=>{let r=e instanceof Error?e.message:String(e);n(`error`,`Runtime Error: ${r}`),D(performance.now()-t),y(!1)});else{let e=performance.now()-t;D(e),y(!1)}}catch(e){n(`error`,`Execution Error: ${e instanceof Error?e.message:String(e)}`),D(performance.now()-t),y(!1)}},[e,j]),I=t===`html`?`markup`:t,L=l.default.languages[I],R=(0,c.useMemo)(()=>e.split(`
`).map(e=>e?L?l.default.highlight(e,L,I):h(e):`&nbsp;`),[e,L,I]),z=(0,c.useMemo)(()=>j?g(e,t):``,[e,j,t]),B=n&&n.length<=28?n:null;return(0,u.jsxs)(`div`,{className:d.codeBlock,children:[(0,u.jsxs)(`div`,{className:d.header,children:[(0,u.jsxs)(`div`,{className:d.windowControls,"aria-hidden":`true`,children:[(0,u.jsx)(`span`,{className:d.dotRed}),(0,u.jsx)(`span`,{className:d.dotYellow}),(0,u.jsx)(`span`,{className:d.dotGreen})]}),(0,u.jsxs)(`div`,{className:d.titleWrapper,children:[(0,u.jsx)(`span`,{className:d.languageBadge,children:t.toUpperCase()}),B&&(0,u.jsx)(`span`,{className:d.title,children:B})]}),(0,u.jsxs)(`div`,{className:d.actions,children:[M&&(0,u.jsx)(`button`,{type:`button`,className:v?d.runBtnRunning:d.runBtn,onClick:F,disabled:v,"aria-label":`Run code in place`,title:`Run code snippet right here`,children:v?`⏳ Running...`:`▶ Run`}),j&&(0,u.jsx)(`button`,{type:`button`,className:S?d.previewBtnActive:d.runBtn,onClick:()=>C(e=>!e),"aria-label":`Live HTML/CSS Preview`,title:`Toggle Live Visual Preview`,children:S?`✕ Hide Preview`:`👁️ Live Preview`}),N&&(0,u.jsx)(r,{to:`/playground`,onClick:()=>{sessionStorage.setItem(`feeq-playground-snippet`,e),j&&sessionStorage.setItem(`feeq-playground-mode`,`web`)},className:d.playgroundBtn,title:`Open in Code Playground`,children:`🛠️ Playground`}),(0,u.jsx)(`button`,{type:`button`,className:`${d.copyButton} ${m?d.copied:``}`,onClick:P,"aria-label":`Copy code to clipboard`,children:m?`✓ Copied`:`📋 Copy`})]})]}),(0,u.jsx)(`pre`,{className:`${d.pre} ${i?d.withLineNumbers:``}`,children:(0,u.jsx)(`code`,{className:`language-${I}`,children:R.map((e,t)=>(0,u.jsx)(`div`,{className:d.codeLine,dangerouslySetInnerHTML:{__html:e}},t))})}),S&&(0,u.jsxs)(`div`,{className:d.htmlPreviewContainer,children:[(0,u.jsxs)(`div`,{className:d.previewBar,children:[(0,u.jsx)(`span`,{children:`🌐 Live Interactive Component Preview`}),(0,u.jsx)(`button`,{type:`button`,className:d.closeConsoleBtn,onClick:()=>C(!1),children:`✕`})]}),(0,u.jsx)(`iframe`,{title:`Live Component Preview`,className:d.previewIframe,srcDoc:z,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})]}),b&&(0,u.jsxs)(`div`,{className:d.inlineConsole,children:[(0,u.jsxs)(`div`,{className:d.consoleHeader,children:[(0,u.jsxs)(`div`,{className:d.consoleTitle,children:[(0,u.jsx)(`span`,{children:`📟 Console Output`}),E!==null&&(0,u.jsxs)(`span`,{className:d.execTime,children:[`⏱ `,E.toFixed(1),`ms`]})]}),(0,u.jsxs)(`div`,{className:d.consoleActions,children:[(0,u.jsx)(`button`,{type:`button`,className:d.clearConsoleBtn,onClick:()=>T([]),children:`Clear`}),(0,u.jsx)(`button`,{type:`button`,className:d.closeConsoleBtn,onClick:()=>x(!1),children:`✕`})]})]}),(0,u.jsx)(`div`,{className:d.consoleBody,children:w.length===0?(0,u.jsx)(`span`,{className:d.emptyLog,children:v?`Executing code...`:`No console output recorded.`}):w.map(e=>(0,u.jsxs)(`div`,{className:`${d.consoleLine} ${e.type===`error`?d.consoleError:e.type===`warn`?d.consoleWarn:e.type===`result`?d.consoleResult:d.consoleLog}`,children:[(0,u.jsx)(`span`,{className:d.consolePrefix,children:e.type===`error`?`✗`:e.type===`warn`?`⚠`:e.type===`result`?`→`:`›`}),(0,u.jsx)(`span`,{className:d.consoleText,children:e.text})]},e.id))})]})]})}function h(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function g(e,t){if(t.toLowerCase()===`css`||!e.includes(`<`)&&!e.includes(`</`)){let t=Array.from(e.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),n=Array.from(new Set(t)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));return`<!DOCTYPE html>
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
</html>`}export{m as t};