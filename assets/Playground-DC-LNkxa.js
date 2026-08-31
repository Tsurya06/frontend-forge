import{i as e,n as t,t as n}from"./jsx-runtime-Cltr0gcK.js";import{a as r,d as i}from"./index-Dr6T_848.js";import{s as a,t as o}from"./data-Dp8R_1G9.js";import{n as s,t as c}from"./codeRunner-D7lLUULz.js";var l=e(t(),1);function u(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function d(e){if(Array.isArray(e))return e}function f(e,t,n){return(t=x(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function m(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function h(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?h(Object(n),!0).forEach(function(t){f(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):h(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function _(e,t){if(e==null)return{};var n,r,i=v(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function v(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function y(e,t){return d(e)||p(e,t)||S(e,t)||m()}function b(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function x(e){var t=b(e,`string`);return typeof t==`symbol`?t:t+``}function S(e,t){if(e){if(typeof e==`string`)return u(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(e,t):void 0}}function C(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?w(Object(n),!0).forEach(function(t){C(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function E(){var e=[...arguments];return function(t){return e.reduceRight(function(e,t){return t(e)},t)}}function D(e){return function t(){var n=this,r=[...arguments];return r.length>=e.length?e.apply(this,r):function(){var e=[...arguments];return t.apply(n,[].concat(r,e))}}}function O(e){return{}.toString.call(e).includes(`Object`)}function k(e){return!Object.keys(e).length}function A(e){return typeof e==`function`}function j(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function M(e,t){return O(t)||L(`changeType`),Object.keys(t).some(function(t){return!j(e,t)})&&L(`changeField`),t}function N(e){A(e)||L(`selectorType`)}function P(e){A(e)||O(e)||L(`handlerType`),O(e)&&Object.values(e).some(function(e){return!A(e)})&&L(`handlersType`)}function F(e){e||L(`initialIsRequired`),O(e)||L(`initialType`),k(e)&&L(`initialContent`)}function I(e,t){throw Error(e[t]||e.default)}var L=D(I)({initialIsRequired:`initial state is required`,initialType:`initial state should be an object`,initialContent:`initial state shouldn't be an empty object`,handlerType:`handler should be an object or a function`,handlersType:`all handlers should be a functions`,selectorType:`selector should be a function`,changeType:`provided value of changes should be an object`,changeField:`it seams you want to change a field in the state which is not specified in the "initial" state`,default:"an unknown error accured in `state-local` package"}),R={changes:M,selector:N,handler:P,initial:F};function z(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};R.initial(e),R.handler(t);var n={current:e},r=D(ee)(n,t),i=D(V)(n),a=D(R.changes)(e),o=D(B)(n);function s(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(e){return e};return R.selector(e),e(n.current)}function c(e){E(r,i,a,o)(e)}return[s,c]}function B(e,t){return A(t)?t(e.current):t}function V(e,t){return e.current=T(T({},e.current),t),t}function ee(e,t,n){return A(t)?t(e.current):Object.keys(n).forEach(function(n){return t[n]?.call(t,e.current[n])}),n}var te={create:z},ne={paths:{vs:`https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs`}};function H(e){return function t(){var n=this,r=[...arguments];return r.length>=e.length?e.apply(this,r):function(){var e=[...arguments];return t.apply(n,[].concat(r,e))}}}function re(e){return{}.toString.call(e).includes(`Object`)}function ie(e){return e||ce(`configIsRequired`),re(e)||ce(`configType`),e.urls?(ae(),{paths:{vs:e.urls.monacoBase}}):e}function ae(){console.warn(se.deprecation)}function oe(e,t){throw Error(e[t]||e.default)}var se={configIsRequired:`the configuration object is required`,configType:`the configuration object should be an object`,default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},ce=H(oe)(se),le={config:ie},ue=function(){var e=[...arguments];return function(t){return e.reduceRight(function(e,t){return t(e)},t)}};function de(e,t){return Object.keys(t).forEach(function(n){t[n]instanceof Object&&e[n]&&Object.assign(t[n],de(e[n],t[n]))}),g(g({},e),t)}var fe={type:`cancelation`,msg:`operation is manually canceled`};function U(e){var t=!1,n=new Promise(function(n,r){e.then(function(e){return t?r(fe):n(e)}),e.catch(r)});return n.cancel=function(){return t=!0},n}var pe=[`monaco`],me=y(te.create({config:ne,isInitialized:!1,resolve:null,reject:null,monaco:null}),2),W=me[0],G=me[1];function he(e){var t=le.config(e),n=t.monaco,r=_(t,pe);G(function(e){return{config:de(e.config,r),monaco:n}})}function ge(){var e=W(function(e){return{monaco:e.monaco,isInitialized:e.isInitialized,resolve:e.resolve}});if(!e.isInitialized){if(G({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),U(K);if(window.monaco&&window.monaco.editor)return xe(window.monaco),e.resolve(window.monaco),U(K);ue(_e,ye)(be)}return U(K)}function _e(e){return document.body.appendChild(e)}function ve(e){var t=document.createElement(`script`);return e&&(t.src=e),t}function ye(e){var t=W(function(e){return{config:e.config,reject:e.reject}}),n=ve(`${t.config.paths.vs}/loader.js`);return n.onload=function(){return e()},n.onerror=t.reject,n}function be(){var e=W(function(e){return{config:e.config,resolve:e.resolve,reject:e.reject}}),t=window.require;t.config(e.config),t([`vs/editor/editor.main`],function(t){var n=t.m||t;xe(n),e.resolve(n)},function(t){e.reject(t)})}function xe(e){W().monaco||G({monaco:e})}function Se(){return W(function(e){return e.monaco})}var K=new Promise(function(e,t){return G({resolve:e,reject:t})}),Ce={config:he,init:ge,__getMonacoInstance:Se},q={wrapper:{display:`flex`,position:`relative`,textAlign:`initial`},fullWidth:{width:`100%`},hide:{display:`none`}},we={container:{display:`flex`,height:`100%`,width:`100%`,justifyContent:`center`,alignItems:`center`}};function Te({children:e}){return l.createElement(`div`,{style:we.container},e)}var Ee=Te;function De({width:e,height:t,isEditorReady:n,loading:r,_ref:i,className:a,wrapperProps:o}){return l.createElement(`section`,{style:{...q.wrapper,width:e,height:t},...o},!n&&l.createElement(Ee,null,r),l.createElement(`div`,{ref:i,style:{...q.fullWidth,...!n&&q.hide},className:a}))}var Oe=(0,l.memo)(De);function ke(e){(0,l.useEffect)(e,[])}var Ae=ke;function je(e,t,n=!0){let r=(0,l.useRef)(!0);(0,l.useEffect)(r.current||!n?()=>{r.current=!1}:e,t)}var J=je;function Y(){}function X(e,t,n,r){return Me(e,r)||Ne(e,t,n,r)}function Me(e,t){return e.editor.getModel(Pe(e,t))}function Ne(e,t,n,r){return e.editor.createModel(t,n,r?Pe(e,r):void 0)}function Pe(e,t){return e.Uri.parse(t)}function Fe({original:e,modified:t,language:n,originalLanguage:r,modifiedLanguage:i,originalModelPath:a,modifiedModelPath:o,keepCurrentOriginalModel:s=!1,keepCurrentModifiedModel:c=!1,theme:u=`light`,loading:d=`Loading...`,options:f={},height:p=`100%`,width:m=`100%`,className:h,wrapperProps:g={},beforeMount:_=Y,onMount:v=Y}){let[y,b]=(0,l.useState)(!1),[x,S]=(0,l.useState)(!0),C=(0,l.useRef)(null),w=(0,l.useRef)(null),T=(0,l.useRef)(null),E=(0,l.useRef)(v),D=(0,l.useRef)(_),O=(0,l.useRef)(!1);Ae(()=>{let e=Ce.init();return e.then(e=>(w.current=e)&&S(!1)).catch(e=>e?.type!==`cancelation`&&console.error(`Monaco initialization: error:`,e)),()=>C.current?j():e.cancel()}),J(()=>{if(C.current&&w.current){let t=C.current.getOriginalEditor(),i=X(w.current,e||``,r||n||`text`,a||``);i!==t.getModel()&&t.setModel(i)}},[a],y),J(()=>{if(C.current&&w.current){let e=C.current.getModifiedEditor(),r=X(w.current,t||``,i||n||`text`,o||``);r!==e.getModel()&&e.setModel(r)}},[o],y),J(()=>{let e=C.current.getModifiedEditor();e.getOption(w.current.editor.EditorOption.readOnly)?e.setValue(t||``):t!==e.getValue()&&(e.executeEdits(``,[{range:e.getModel().getFullModelRange(),text:t||``,forceMoveMarkers:!0}]),e.pushUndoStop())},[t],y),J(()=>{C.current?.getModel()?.original.setValue(e||``)},[e],y),J(()=>{let{original:e,modified:t}=C.current.getModel();w.current.editor.setModelLanguage(e,r||n||`text`),w.current.editor.setModelLanguage(t,i||n||`text`)},[n,r,i],y),J(()=>{w.current?.editor.setTheme(u)},[u],y),J(()=>{C.current?.updateOptions(f)},[f],y);let k=(0,l.useCallback)(()=>{if(!w.current)return;D.current(w.current);let s=X(w.current,e||``,r||n||`text`,a||``),c=X(w.current,t||``,i||n||`text`,o||``);C.current?.setModel({original:s,modified:c})},[n,t,i,e,r,a,o]),A=(0,l.useCallback)(()=>{!O.current&&T.current&&(C.current=w.current.editor.createDiffEditor(T.current,{automaticLayout:!0,...f}),k(),w.current?.editor.setTheme(u),b(!0),O.current=!0)},[f,u,k]);(0,l.useEffect)(()=>{y&&E.current(C.current,w.current)},[y]),(0,l.useEffect)(()=>{!x&&!y&&A()},[x,y,A]);function j(){let e=C.current?.getModel();s||e?.original?.dispose(),c||e?.modified?.dispose(),C.current?.dispose()}return l.createElement(Oe,{width:m,height:p,isEditorReady:y,loading:d,_ref:T,className:h,wrapperProps:g})}(0,l.memo)(Fe);function Ie(e){let t=(0,l.useRef)();return(0,l.useEffect)(()=>{t.current=e},[e]),t.current}var Le=Ie,Z=new Map;function Re({defaultValue:e,defaultLanguage:t,defaultPath:n,value:r,language:i,path:a,theme:o=`light`,line:s,loading:c=`Loading...`,options:u={},overrideServices:d={},saveViewState:f=!0,keepCurrentModel:p=!1,width:m=`100%`,height:h=`100%`,className:g,wrapperProps:_={},beforeMount:v=Y,onMount:y=Y,onChange:b,onValidate:x=Y}){let[S,C]=(0,l.useState)(!1),[w,T]=(0,l.useState)(!0),E=(0,l.useRef)(null),D=(0,l.useRef)(null),O=(0,l.useRef)(null),k=(0,l.useRef)(y),A=(0,l.useRef)(v),j=(0,l.useRef)(),M=(0,l.useRef)(r),N=Le(a),P=(0,l.useRef)(!1),F=(0,l.useRef)(!1);Ae(()=>{let e=Ce.init();return e.then(e=>(E.current=e)&&T(!1)).catch(e=>e?.type!==`cancelation`&&console.error(`Monaco initialization: error:`,e)),()=>D.current?L():e.cancel()}),J(()=>{let o=X(E.current,e||r||``,t||i||``,a||n||``);o!==D.current?.getModel()&&(f&&Z.set(N,D.current?.saveViewState()),D.current?.setModel(o),f&&D.current?.restoreViewState(Z.get(a)))},[a],S),J(()=>{D.current?.updateOptions(u)},[u],S),J(()=>{!D.current||r===void 0||(D.current.getOption(E.current.editor.EditorOption.readOnly)?D.current.setValue(r):r!==D.current.getValue()&&(F.current=!0,D.current.executeEdits(``,[{range:D.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),D.current.pushUndoStop(),F.current=!1))},[r],S),J(()=>{let e=D.current?.getModel();e&&i&&E.current?.editor.setModelLanguage(e,i)},[i],S),J(()=>{s!==void 0&&D.current?.revealLine(s)},[s],S),J(()=>{E.current?.editor.setTheme(o)},[o],S);let I=(0,l.useCallback)(()=>{if(!(!O.current||!E.current)&&!P.current){A.current(E.current);let c=a||n,l=X(E.current,r||e||``,t||i||``,c||``);D.current=E.current?.editor.create(O.current,{model:l,automaticLayout:!0,...u},d),f&&D.current.restoreViewState(Z.get(c)),E.current.editor.setTheme(o),s!==void 0&&D.current.revealLine(s),C(!0),P.current=!0}},[e,t,n,r,i,a,u,d,f,o,s]);(0,l.useEffect)(()=>{S&&k.current(D.current,E.current)},[S]),(0,l.useEffect)(()=>{!w&&!S&&I()},[w,S,I]),M.current=r,(0,l.useEffect)(()=>{S&&b&&(j.current?.dispose(),j.current=D.current?.onDidChangeModelContent(e=>{F.current||b(D.current.getValue(),e)}))},[S,b]),(0,l.useEffect)(()=>{if(S){let e=E.current.editor.onDidChangeMarkers(e=>{let t=D.current.getModel()?.uri;if(t&&e.find(e=>e.path===t.path)){let e=E.current.editor.getModelMarkers({resource:t});x?.(e)}});return()=>{e?.dispose()}}return()=>{}},[S,x]);function L(){j.current?.dispose(),p?f&&Z.set(a,D.current.saveViewState()):D.current.getModel()?.dispose(),D.current.dispose()}return l.createElement(Oe,{width:m,height:h,isEditorReady:S,loading:c,_ref:O,className:g,wrapperProps:_})}var ze=(0,l.memo)(Re),Q={page:`_page_s6g71_1`,header:`_header_s6g71_8`,title:`_title_s6g71_12`,subtitle:`_subtitle_s6g71_22`,playgroundContainer:`_playgroundContainer_s6g71_30`,fullscreenContainer:`_fullscreenContainer_s6g71_44`,toolbar:`_toolbar_s6g71_58`,toolbarGroup:`_toolbarGroup_s6g71_68`,toolbarLabel:`_toolbarLabel_s6g71_74`,toolbarSeparator:`_toolbarSeparator_s6g71_81`,select:`_select_s6g71_88`,runBtn:`_runBtn_s6g71_116`,runBtnRunning:`_runBtnRunning_s6g71_143 _runBtn_s6g71_116`,formatBtn:`_formatBtn_s6g71_150`,fullscreenBtn:`_fullscreenBtn_s6g71_172`,toolbarBtn:`_toolbarBtn_s6g71_193`,toolbarSpacer:`_toolbarSpacer_s6g71_215`,shortcutHint:`_shortcutHint_s6g71_219`,editorArea:`_editorArea_s6g71_228`,editorPane:`_editorPane_s6g71_239`,outputPane:`_outputPane_s6g71_246`,paneHeader:`_paneHeader_s6g71_253`,paneTitle:`_paneTitle_s6g71_265`,editorHeaderActions:`_editorHeaderActions_s6g71_271`,langBadge:`_langBadge_s6g71_277`,countBadge:`_countBadge_s6g71_287`,tabButtons:`_tabButtons_s6g71_297`,tabBtn:`_tabBtn_s6g71_303`,activeTabBtn:`_activeTabBtn_s6g71_320`,previewPane:`_previewPane_s6g71_328`,liveIframe:`_liveIframe_s6g71_337`,outputActions:`_outputActions_s6g71_345`,miniActionBtn:`_miniActionBtn_s6g71_351`,editorWrapper:`_editorWrapper_s6g71_368`,consoleOutput:`_consoleOutput_s6g71_373`,consoleLine:`_consoleLine_s6g71_384`,fadeIn:`_fadeIn_s6g71_1`,consolePrefix:`_consolePrefix_s6g71_402`,consoleText:`_consoleText_s6g71_409`,logLine:`_logLine_s6g71_415`,warnLine:`_warnLine_s6g71_419`,errorLine:`_errorLine_s6g71_426`,infoLine:`_infoLine_s6g71_433`,resultLine:`_resultLine_s6g71_437`,emptyConsole:`_emptyConsole_s6g71_442`,emptyIcon:`_emptyIcon_s6g71_455`,emptyText:`_emptyText_s6g71_461`,emptySub:`_emptySub_s6g71_467`,statusBar:`_statusBar_s6g71_473`,statusLeft:`_statusLeft_s6g71_484`,statusText:`_statusText_s6g71_490`,statusDot:`_statusDot_s6g71_495`,statusDotRunning:`_statusDotRunning_s6g71_503 _statusDot_s6g71_495`,pulse:`_pulse_s6g71_1`,statusDotError:`_statusDotError_s6g71_509 _statusDot_s6g71_495`,statusRight:`_statusRight_s6g71_519`,executionTime:`_executionTime_s6g71_525`,themeIndicator:`_themeIndicator_s6g71_532`,snippetsSection:`_snippetsSection_s6g71_537`,sectionHeader:`_sectionHeader_s6g71_541`,snippetsTitle:`_snippetsTitle_s6g71_550`,sectionHint:`_sectionHint_s6g71_557`,snippetsGrid:`_snippetsGrid_s6g71_562`,snippetCard:`_snippetCard_s6g71_568`,snippetTop:`_snippetTop_s6g71_588`,snippetName:`_snippetName_s6g71_595`,snippetDesc:`_snippetDesc_s6g71_602`,snippetFooter:`_snippetFooter_s6g71_609`,categoryTag:`_categoryTag_s6g71_617`,snippetRunHint:`_snippetRunHint_s6g71_626`,snippetBadge:`_snippetBadge_s6g71_635`,snippetBeginner:`_snippetBeginner_s6g71_646 _snippetBadge_s6g71_635`,snippetIntermediate:`_snippetIntermediate_s6g71_652 _snippetBadge_s6g71_635`,snippetAdvanced:`_snippetAdvanced_s6g71_658 _snippetBadge_s6g71_635`,snippetSenior:`_snippetSenior_s6g71_664 _snippetBadge_s6g71_635`},$=n(),Be=`// 🚀 Welcome to the Frontend Mastery Code Playground!
// Write your code here and click "Run" (or press Ctrl+Enter / ⌘+Enter)

function greet(name: string) {
  return \`Hello, \${name}! 👋\`;
}

console.log(greet('Developer'));
console.log('Ready to practice coding!');

// Try async code & promises:
setTimeout(() => {
  console.log('⏱️ Async timeout completed after 300ms!');
}, 300);

const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n ** 2);
console.log('Squares:', squares);
`,Ve=`<!-- 🌐 HTML & CSS Live Interactive Component Sandbox -->
<div class="component-card">
  <div class="badge">Live Component</div>
  <h2 class="title">Interactive Switch & Button</h2>
  <p class="description">Edit this HTML, CSS, or JavaScript and click "▶ Run" to see live updates!</p>
  
  <div class="controls">
    <label class="toggle-switch">
      <input type="checkbox" id="demo-toggle" checked />
      <span class="slider"></span>
    </label>
    <span id="status-label">Feature Enabled</span>
  </div>

  <button id="action-btn" class="btn">Click to Test Event</button>
</div>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f7f7f8;
  color: #2d2d2d;
  padding: 24px;
  margin: 0;
  display: flex;
  justify-content: center;
}

.component-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #10a37f;
  background: #e6f7f2;
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
}

.description {
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.5;
  margin: 0 0 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #e5e5e5;
  border-radius: 24px;
  transition: 0.2s ease;
  cursor: pointer;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

input:checked + .slider {
  background-color: #10a37f;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.btn {
  background: #10a37f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s ease;
}

.btn:hover {
  background: #0d8f70;
}
</style>

<script>
const toggle = document.getElementById('demo-toggle');
const label = document.getElementById('status-label');
const btn = document.getElementById('action-btn');

toggle.addEventListener('change', (e) => {
  label.textContent = e.target.checked ? 'Feature Enabled' : 'Feature Disabled';
  console.log('⚡ Toggle state changed:', e.target.checked);
});

btn.addEventListener('click', () => {
  console.log('🎉 Button clicked inside live iframe component!');
  alert('Event fired successfully!');
});
<\/script>
`,He=[{id:`auto`,name:`Auto (Follow App)`},{id:`vs-dark`,name:`VS Dark`},{id:`light`,name:`VS Light`},{id:`one-dark`,name:`One Dark Pro`},{id:`dracula`,name:`Dracula`},{id:`github-dark`,name:`GitHub Dark`},{id:`monokai`,name:`Monokai`},{id:`night-owl`,name:`Night Owl`},{id:`hc-black`,name:`High Contrast Dark`}],Ue=[{name:`Holy Grail Layout (CSS Grid)`,description:`3-column responsive layout with sticky footer`,difficulty:`Intermediate`,category:`HTML & CSS`,language:`html`,code:`<div class="holy-grail">
  <header class="hg-header">Header & Branding</header>
  <aside class="hg-nav">Navigation Sidebar</aside>
  <main class="hg-main">
    <h2>Main Article Content</h2>
    <p>Flexible center column that expands responsively with CSS Grid areas.</p>
  </main>
  <aside class="hg-ads">Widgets & Side Info</aside>
  <footer class="hg-footer">Footer & Copyright (Pinned to Bottom)</footer>
</div>

<style>
body { margin: 0; font-family: system-ui, sans-serif; }
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 180px;
  grid-template-areas:
    "header header header"
    "nav    main   ads"
    "footer footer footer";
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
}

.hg-header { grid-area: header; background: #202123; color: #fff; padding: 14px; border-radius: 6px; }
.hg-nav { grid-area: nav; background: #f7f7f8; border: 1px solid #e5e5e5; padding: 14px; border-radius: 6px; }
.hg-main { grid-area: main; background: #ffffff; border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; }
.hg-ads { grid-area: ads; background: #f7f7f8; border: 1px solid #e5e5e5; padding: 14px; border-radius: 6px; }
.hg-footer { grid-area: footer; background: #202123; color: #ececf1; padding: 14px; text-align: center; border-radius: 6px; }

@media (max-width: 700px) {
  .holy-grail {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "nav"
      "ads"
      "footer";
  }
}
</style>
`},{name:`CSS Shimmer Skeleton`,description:`Smooth 60fps GPU shimmer wave animation`,difficulty:`Beginner`,category:`HTML & CSS`,language:`html`,code:`<div class="card-skeleton">
  <div class="shimmer avatar"></div>
  <div class="content">
    <div class="shimmer title-line"></div>
    <div class="shimmer desc-line"></div>
    <div class="shimmer desc-line short"></div>
  </div>
</div>

<style>
body { background: #f7f7f8; font-family: system-ui; padding: 24px; }
.card-skeleton {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  max-width: 360px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.shimmer {
  background: linear-gradient(90deg, #f0f0f2 0%, #e2e2e6 50%, #f0f0f2 100%);
  background-size: 200% 100%;
  animation: shimmerAnim 1.4s infinite linear;
  border-radius: 4px;
}
@keyframes shimmerAnim {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
.content { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.title-line { height: 16px; width: 65%; }
.desc-line { height: 12px; width: 100%; }
.desc-line.short { width: 45%; }
</style>
`},{name:`Promise.all Polyfill`,description:`Implement Promise.all from scratch`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement Promise.all polyfill
function promiseAll<T>(promises: (T | Promise<T>)[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results: T[] = new Array(promises.length);
    let completed = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test it with immediate values and async promises:
console.log('Starting Promise.all test...');

promiseAll([
  Promise.resolve(10),
  new Promise(res => setTimeout(() => res(20), 200)),
  30,
  new Promise(res => setTimeout(() => res(40), 100)),
]).then(results => {
  console.log('✅ Promise.all Results:', results);
}).catch(err => {
  console.error('❌ Promise.all Error:', err);
});
`},{name:`Debounce with Cancel`,description:`Create a debounce utility with cancel & immediate trigger`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement debounce with cancel and immediate execution
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
) {
  let timerId: any = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timerId;
    
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      fn.apply(this, args);
    }
  };
  
  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };
  
  return debounced;
}

// Demo:
const logMessage = debounce((msg: string) => {
  console.log('⚡ Debounced event fired:', msg);
}, 250);

console.log('Sending rapid calls...');
logMessage('Call 1');
logMessage('Call 2');
logMessage('Call 3 (only this will execute after 250ms)');
`},{name:`Currying with Placeholders`,description:`Implement flexible curry function`,difficulty:`Advanced`,category:`JavaScript`,language:`typescript`,code:`// Implement function currying
function curry(fn: (...args: any[]) => any) {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs: any[]) => {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Test curried function:
const add = curry((a: number, b: number, c: number, d: number) => a + b + c + d);

console.log('curry(add)(1)(2)(3)(4) =', add(1)(2)(3)(4));
console.log('curry(add)(1, 2)(3)(4) =', add(1, 2)(3)(4));
console.log('curry(add)(1, 2, 3)(4) =', add(1, 2, 3)(4));
console.log('curry(add)(1, 2, 3, 4) =', add(1, 2, 3, 4));
`},{name:`Deep Clone with Circular Refs`,description:`Deep copy preserving Maps, Sets, and circular graphs`,difficulty:`Advanced`,category:`JavaScript`,language:`typescript`,code:`// Deep clone with circular reference & built-in type handling
function deepClone(obj: any, seen = new WeakMap()): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Set) {
    const copySet = new Set();
    obj.forEach(val => copySet.add(deepClone(val, seen)));
    return copySet;
  }
  if (obj instanceof Map) {
    const copyMap = new Map();
    obj.forEach((val, key) => copyMap.set(key, deepClone(val, seen)));
    return copyMap;
  }
  
  if (seen.has(obj)) return seen.get(obj);
  
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, clone);
  
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  
  return clone;
}

// Test with nested and circular structure:
const original: any = {
  name: 'Antigravity',
  skills: ['React', 'TypeScript', 'System Design'],
  nested: { count: 42, active: true },
};
original.self = original; // circular!

const cloned = deepClone(original);
console.log('Cloned name:', cloned.name);
console.log('Cloned skills:', cloned.skills);
console.log('Is circular preserved?', cloned.self === cloned);
console.log('Is clone detached from original?', cloned !== original);
`},{name:`Event Emitter`,description:`Full Pub/Sub with once, off, and wildcards`,difficulty:`Intermediate`,category:`JavaScript`,language:`typescript`,code:`// Implement EventEmitter
class EventEmitter {
  private events: Record<string, Function[]> = {};
  
  on(event: string, listener: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }
  
  off(event: string, listener: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }
  
  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => {
      try {
        listener(...args);
      } catch (err) {
        console.error(\`Error in \${event} listener:\`, err);
      }
    });
    return true;
  }
  
  once(event: string, listener: Function) {
    const wrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

// Demo:
const emitter = new EventEmitter();

const unsubscribe = emitter.on('login', (user: string) => {
  console.log(\`👤 User logged in: \${user}\`);
});

emitter.once('welcome', () => {
  console.log('🎉 First time welcome gift delivered!');
});

emitter.emit('login', 'Alice');
emitter.emit('welcome');
emitter.emit('welcome'); // won't fire again
unsubscribe();
emitter.emit('login', 'Bob'); // won't fire because unsubscribed
console.log('Done with EventEmitter demo.');
`}];function We(){let{theme:e}=r(),[t]=i(),[n,u]=(0,l.useState)(Be),[d,f]=(0,l.useState)(`typescript`),[p,m]=(0,l.useState)(`console`),[h,g]=(0,l.useState)(()=>localStorage.getItem(`feeq-playground-theme`)||`auto`),[_,v]=(0,l.useState)([]),[y,b]=(0,l.useState)(!1),[x,S]=(0,l.useState)(null),[C,w]=(0,l.useState)(!1),[T,E]=(0,l.useState)(`Ready`),[D,O]=(0,l.useState)(!1),k=(0,l.useRef)(null),A=(0,l.useRef)(null),j=(0,l.useRef)(null),M=(0,l.useRef)(null),N=(0,l.useRef)(0),P=(0,l.useRef)(null);(0,l.useEffect)(()=>{let e=sessionStorage.getItem(`feeq-playground-mode`),n=sessionStorage.getItem(`feeq-playground-snippet`);if(n){sessionStorage.removeItem(`feeq-playground-snippet`),sessionStorage.removeItem(`feeq-playground-mode`),(e===`web`||n.includes(`<html`)||n.includes(`<div`)||n.includes(`<style`))&&(f(`html`),m(`preview`)),u(n),P.current=n,k.current&&k.current.setValue(n);return}let r=t.get(`problem`);if(r){let e=a(r);if(e){(e.category===`CSS`||e.category===`HTML & CSS`)&&(f(`html`),m(`preview`));let t=e.implementation.startsWith(`<!--`)?e.implementation:`// 🎯 ${e.title} (${e.difficulty})\n// ${e.problem}\n\n// Solution implementation:\n${e.implementation}\n\n// Try running tests:\nconsole.log('Testing solution for ${e.title}...');\n`;u(t),P.current=t,k.current&&k.current.setValue(t)}}},[t]);let F=e=>{g(e),localStorage.setItem(`feeq-playground-theme`,e)},I=e=>{let t=k.current?.getValue()??n;if(f(e),e===`html`){m(`preview`),!t.includes(`<div`)&&!t.includes(`<style`)&&!t.includes(`<html`)&&(u(Ve),k.current&&k.current.setValue(Ve));return}if(e===`javascript`){P.current=t;try{let e=s(t);u(e),k.current&&k.current.setValue(e)}catch(e){console.error(`Failed to convert TS to JS`,e)}}else e===`typescript`&&P.current&&(u(P.current),k.current&&k.current.setValue(P.current))},L=(e,t)=>{k.current=e,A.current=t,t.editor.defineTheme(`dracula`,{base:`vs-dark`,inherit:!0,rules:[{token:`comment`,foreground:`6272a4`,fontStyle:`italic`},{token:`keyword`,foreground:`ff79c6`,fontStyle:`bold`},{token:`string`,foreground:`f1fa8c`},{token:`number`,foreground:`bd93f9`},{token:`type`,foreground:`8be9fd`}],colors:{"editor.background":`#282a36`,"editor.foreground":`#f8f8f2`,"editorLineNumber.foreground":`#6272a4`}}),t.editor.defineTheme(`one-dark`,{base:`vs-dark`,inherit:!0,rules:[{token:`comment`,foreground:`5c6370`,fontStyle:`italic`},{token:`keyword`,foreground:`c678dd`},{token:`string`,foreground:`98c379`},{token:`number`,foreground:`d19a66`}],colors:{"editor.background":`#21252b`,"editor.foreground":`#abb2bf`}}),t.languages.typescript.javascriptDefaults.setDiagnosticsOptions({noSemanticValidation:!0,noSyntaxValidation:!1}),t.languages.typescript.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:!1,noSyntaxValidation:!1,noSuggestionDiagnostics:!1}),t.languages.typescript.typescriptDefaults.setCompilerOptions({target:t.languages.typescript.ScriptTarget.ES2022,allowNonTextFiles:!0,noLib:!1,alwaysStrict:!1,allowJs:!0})},R=h===`auto`?e===`dark`?`vs-dark`:`light`:h,z=(0,l.useCallback)(()=>{k.current&&k.current.getAction(`editor.action.formatDocument`)?.run()},[]),B=(0,l.useCallback)(e=>{let t=typeof e==`string`?e:k.current?.getValue()??n,r=++N.current;b(!0),w(!1),E(`Executing...`),S(null);let i=performance.now(),a=(e,...t)=>{if(N.current!==r)return;let n=t.map(c).join(` `),i={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:e,text:n,timestamp:Date.now()};v(e=>[...e,i])};if(d===`html`||t.includes(`<html`)||t.includes(`<div`)||t.includes(`<style`)){if(m(`preview`),M.current){let e=!t.includes(`<`)&&!t.includes(`</`),n=t;if(e){let e=Array.from(t.matchAll(/\.([a-zA-Z0-9_-]+)/g)).map(e=>e[1]).filter(e=>!!e),r=Array.from(new Set(e)).filter(e=>![`hover`,`focus`,`active`,`before`,`after`,`disabled`,`checked`].includes(e));n=`
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
              ${t}
            </style>
            <div class="demo-canvas">
              ${r.length>0?r.map(e=>`<div class="${e} demo-card-box"><strong>.${e}</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">CSS styles applied</p></div>`).join(``):`<div class="card demo-card-box"><strong>CSS Live Preview</strong><p style="margin:4px 0 0;font-size:12px;color:#6b6b6b">Styles applied to canvas</p></div>`}
            </div>
          `}let r=`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <script>
                // Intercept console inside iframe
                const _log = console.log, _warn = console.warn, _error = console.error;
                console.log = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'log', args }, '*'); _log(...args); };
                console.warn = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'warn', args }, '*'); _warn(...args); };
                console.error = (...args) => { window.parent.postMessage({ type: 'feeq-log', logType: 'error', args }, '*'); _error(...args); };
              <\/script>
            </head>
            <body>${n}</body>
          </html>
        `;M.current.srcdoc=r}S(performance.now()-i),b(!1),E(`Preview Updated`);return}v([]);let o={log:(...e)=>a(`log`,...e),warn:(...e)=>a(`warn`,...e),error:(...e)=>a(`error`,...e),info:(...e)=>a(`info`,...e),clear:()=>v([]),table:(...e)=>a(`log`,...e)},l=(e,t,...n)=>window.setTimeout(()=>{if(N.current===r&&typeof e==`function`)try{e(...n)}catch(e){a(`error`,`Async Error: ${e?.message||String(e)}`)}},t),u=(e,t,...n)=>window.setInterval(()=>{if(N.current===r&&typeof e==`function`)try{e(...n)}catch(e){a(`error`,`Interval Error: ${e?.message||String(e)}`)}},t),f=s(t);try{let e=Function(`console`,`setTimeout`,`setInterval`,`clearTimeout`,`clearInterval`,`Promise`,`
        return (async () => {
          ${f}
        })();
        `)(o,l,u,window.clearTimeout.bind(window),window.clearInterval.bind(window),Promise);e&&typeof e.then==`function`?e.then(e=>{N.current===r&&(S(performance.now()-i),b(!1),E(`Success`),e!==void 0&&a(`result`,e))}).catch(e=>{N.current===r&&(a(`error`,`Runtime Error: ${e instanceof Error?e.message:String(e)}`),w(!0),b(!1),E(`Error`),S(performance.now()-i))}):(S(performance.now()-i),b(!1),E(`Success`))}catch(e){a(`error`,`Syntax / Execution Error: ${e instanceof Error?e.message:String(e)}`),w(!0),b(!1),E(`Error`),S(performance.now()-i)}},[n,d]);(0,l.useEffect)(()=>{let e=e=>{if(e.data&&e.data.type===`feeq-log`){let{logType:t,args:n}=e.data,r=n.map(e=>c(e)).join(` `);v(e=>[...e,{id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type:t,text:r,timestamp:Date.now()}])}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]),(0,l.useEffect)(()=>{let e=e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&(e.preventDefault(),B()),e.altKey&&e.shiftKey&&(e.key===`F`||e.key===`f`)&&(e.preventDefault(),z()),e.key===`Escape`&&D&&O(!1)};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[B,z,D]);let V=(0,l.useCallback)(()=>{v([]),S(null),w(!1),E(`Cleared`)},[]),ee=(0,l.useCallback)(()=>{let e=d===`html`?Ve:Be;u(e),k.current&&k.current.setValue(e),v([]),S(null),w(!1),E(`Reset`)},[d]),te=(0,l.useCallback)(e=>{f(e.language),u(e.code),P.current=e.code,k.current&&k.current.setValue(e.code),e.language===`html`&&m(`preview`),B(e.code)},[B]),ne=(0,l.useCallback)(e=>{e.category===`CSS`||e.category===`HTML & CSS`?(f(`html`),m(`preview`)):(f(`typescript`),m(`console`));let t=e.implementation.startsWith(`<!--`)?e.implementation:`// 🎯 ${e.title} (${e.difficulty})\n// ${e.problem}\n\n// Solution implementation:\n${e.implementation}\n\n// Test invocation:\nconsole.log('Testing solution for ${e.title}...');\n`;u(t),P.current=t,k.current&&k.current.setValue(t),B(t)},[B]),H=e=>{switch(e){case`Beginner`:return Q.snippetBeginner;case`Intermediate`:return Q.snippetIntermediate;case`Advanced`:return Q.snippetAdvanced;case`Senior`:return Q.snippetSenior;default:return Q.snippetBadge}},re=(0,l.useCallback)(()=>{let e=_.map(e=>`${e.type.toUpperCase()}: ${e.text}`).join(`
`);navigator.clipboard.writeText(e)},[_]);return(0,$.jsxs)(`div`,{className:Q.page,children:[(0,$.jsxs)(`div`,{className:Q.header,children:[(0,$.jsxs)(`h1`,{className:Q.title,children:[(0,$.jsx)(`span`,{children:`🛠️`}),` Code Playground & Live Component Sandbox`]}),(0,$.jsx)(`p`,{className:Q.subtitle,children:`Interactive JavaScript, TypeScript, HTML & Modern CSS sandbox with live iframe component previews, streaming console logs, and real-world interview challenges.`})]}),(0,$.jsxs)(`div`,{className:`${Q.playgroundContainer} ${D?Q.fullscreenContainer:``}`,children:[(0,$.jsxs)(`div`,{className:Q.toolbar,children:[(0,$.jsxs)(`div`,{className:Q.toolbarGroup,children:[(0,$.jsx)(`label`,{className:Q.toolbarLabel,htmlFor:`lang-select`,children:`Mode / Language:`}),(0,$.jsxs)(`select`,{id:`lang-select`,className:Q.select,value:d,onChange:e=>I(e.target.value),"aria-label":`Language`,children:[(0,$.jsx)(`option`,{value:`typescript`,children:`TypeScript`}),(0,$.jsx)(`option`,{value:`javascript`,children:`JavaScript`}),(0,$.jsx)(`option`,{value:`html`,children:`🌐 HTML & CSS (Web Component Preview)`})]})]}),(0,$.jsx)(`div`,{className:Q.toolbarSeparator}),(0,$.jsxs)(`div`,{className:Q.toolbarGroup,children:[(0,$.jsx)(`label`,{className:Q.toolbarLabel,htmlFor:`theme-select`,children:`🎨 Theme:`}),(0,$.jsx)(`select`,{id:`theme-select`,className:Q.select,value:h,onChange:e=>F(e.target.value),"aria-label":`Editor Theme`,children:He.map(e=>(0,$.jsx)(`option`,{value:e.id,children:e.name},e.id))})]}),(0,$.jsx)(`div`,{className:Q.toolbarSeparator}),(0,$.jsx)(`button`,{className:y?Q.runBtnRunning:Q.runBtn,onClick:()=>B(),disabled:y,"aria-label":`Run code`,title:`Run code (⌘+Enter / Ctrl+Enter)`,children:y?`⏳ Running...`:d===`html`?`▶ Run & Preview`:`▶ Run`}),(0,$.jsx)(`button`,{className:Q.formatBtn,onClick:z,"aria-label":`Auto Format Code`,title:`Auto Format (Shift+Alt+F)`,children:`✨ Format`}),(0,$.jsx)(`button`,{className:Q.fullscreenBtn,onClick:()=>O(e=>!e),"aria-label":D?`Exit Fullscreen`:`Open Fullscreen`,title:D?`Exit Fullscreen (Esc)`:`Open Fullscreen`,children:D?`🗗 Exit`:`⛶ Fullscreen`}),(0,$.jsx)(`button`,{className:Q.toolbarBtn,onClick:V,"aria-label":`Clear output`,children:`🧹 Clear`}),(0,$.jsx)(`button`,{className:Q.toolbarBtn,onClick:ee,"aria-label":`Reset code`,children:`↺ Reset`}),(0,$.jsx)(`div`,{className:Q.toolbarSpacer}),(0,$.jsxs)(`div`,{className:Q.shortcutHint,children:[(0,$.jsx)(`span`,{children:`⌘+Enter to run`}),(0,$.jsx)(`span`,{children:`•`}),(0,$.jsx)(`span`,{children:`⌥⇧F to format`})]})]}),(0,$.jsxs)(`div`,{className:Q.editorArea,children:[(0,$.jsxs)(`div`,{className:Q.editorPane,children:[(0,$.jsxs)(`div`,{className:Q.paneHeader,children:[(0,$.jsxs)(`div`,{className:Q.paneTitle,children:[(0,$.jsx)(`span`,{children:`📝 Editor`}),(0,$.jsx)(`span`,{className:Q.langBadge,children:d.toUpperCase()})]}),(0,$.jsxs)(`div`,{className:Q.editorHeaderActions,children:[(0,$.jsx)(`button`,{className:Q.miniActionBtn,onClick:z,title:`Format Code`,children:`✨ Format`}),(0,$.jsx)(`button`,{className:Q.miniActionBtn,onClick:()=>O(e=>!e),title:D?`Exit Fullscreen`:`Fullscreen`,children:D?`🗗`:`⛶`})]})]}),(0,$.jsx)(`div`,{className:Q.editorWrapper,children:(0,$.jsx)(ze,{height:`100%`,language:d===`html`?`html`:d,value:n,theme:R,onMount:L,onChange:e=>u(e||``),options:{minimap:{enabled:!1},fontSize:14,fontFamily:`var(--font-mono, "JetBrains Mono", monospace)`,lineNumbers:`on`,scrollBeyondLastLine:!1,wordWrap:`on`,tabSize:2,automaticLayout:!0,padding:{top:14,bottom:14}}})})]}),(0,$.jsxs)(`div`,{className:Q.outputPane,children:[(0,$.jsxs)(`div`,{className:Q.paneHeader,children:[(0,$.jsxs)(`div`,{className:Q.tabButtons,children:[d===`html`&&(0,$.jsx)(`button`,{className:`${Q.tabBtn} ${p===`preview`?Q.activeTabBtn:``}`,onClick:()=>m(`preview`),children:`🌐 Live Web Preview`}),(0,$.jsxs)(`button`,{className:`${Q.tabBtn} ${p===`console`?Q.activeTabBtn:``}`,onClick:()=>m(`console`),children:[`📟 Console (`,_.length,`)`]})]}),p===`console`&&_.length>0&&(0,$.jsxs)(`div`,{className:Q.outputActions,children:[(0,$.jsx)(`button`,{className:Q.miniActionBtn,onClick:re,title:`Copy Output`,children:`📋 Copy`}),(0,$.jsx)(`button`,{className:Q.miniActionBtn,onClick:V,title:`Clear Console`,children:`✕ Clear`})]})]}),p===`preview`?(0,$.jsx)(`div`,{className:Q.previewPane,children:(0,$.jsx)(`iframe`,{ref:M,title:`Live Web Preview`,className:Q.liveIframe,sandbox:`allow-scripts allow-modals allow-forms allow-popups`})}):(0,$.jsx)(`div`,{className:Q.consoleOutput,ref:j,children:_.length===0?(0,$.jsxs)(`div`,{className:Q.emptyConsole,children:[(0,$.jsx)(`span`,{className:Q.emptyIcon,children:`💡`}),(0,$.jsxs)(`p`,{className:Q.emptyText,children:[`Click `,(0,$.jsx)(`strong`,{children:`"▶ Run"`}),` or press `,(0,$.jsx)(`strong`,{children:`⌘+Enter`}),` to execute`]}),(0,$.jsx)(`span`,{className:Q.emptySub,children:`Outputs, return values, errors, and async logs stream here`})]}):_.map(e=>(0,$.jsxs)(`div`,{className:`${Q.consoleLine} ${e.type===`error`?Q.errorLine:e.type===`warn`?Q.warnLine:e.type===`info`?Q.infoLine:e.type===`result`?Q.resultLine:Q.logLine}`,children:[(0,$.jsx)(`span`,{className:Q.consolePrefix,children:e.type===`error`?`✗`:e.type===`warn`?`⚠`:e.type===`info`?`ℹ`:e.type===`result`?`→`:`›`}),(0,$.jsx)(`span`,{className:Q.consoleText,children:e.text})]},e.id))})]})]}),(0,$.jsxs)(`div`,{className:Q.statusBar,children:[(0,$.jsxs)(`div`,{className:Q.statusLeft,children:[(0,$.jsx)(`span`,{className:C?Q.statusDotError:y?Q.statusDotRunning:Q.statusDot}),(0,$.jsx)(`span`,{className:Q.statusText,children:T})]}),(0,$.jsxs)(`div`,{className:Q.statusRight,children:[x!==null&&(0,$.jsxs)(`span`,{className:Q.executionTime,children:[`⏱ `,x.toFixed(2),`ms`]}),(0,$.jsxs)(`span`,{className:Q.themeIndicator,children:[`Theme: `,He.find(e=>e.id===h)?.name]})]})]})]}),(0,$.jsxs)(`div`,{className:Q.snippetsSection,children:[(0,$.jsxs)(`div`,{className:Q.sectionHeader,children:[(0,$.jsx)(`h2`,{className:Q.snippetsTitle,children:`📚 Practice Snippets (HTML, CSS & JS)`}),(0,$.jsx)(`span`,{className:Q.sectionHint,children:`One-click loads code into editor and executes`})]}),(0,$.jsx)(`div`,{className:Q.snippetsGrid,children:Ue.map(e=>(0,$.jsxs)(`button`,{className:Q.snippetCard,onClick:()=>te(e),children:[(0,$.jsxs)(`div`,{className:Q.snippetTop,children:[(0,$.jsx)(`p`,{className:Q.snippetName,children:e.name}),(0,$.jsx)(`span`,{className:H(e.difficulty),children:e.difficulty})]}),(0,$.jsx)(`p`,{className:Q.snippetDesc,children:e.description}),(0,$.jsxs)(`div`,{className:Q.snippetFooter,children:[(0,$.jsx)(`span`,{className:Q.categoryTag,children:e.category}),(0,$.jsx)(`span`,{className:Q.snippetRunHint,children:`▶ Click to load & run`})]})]},e.name))})]}),o.length>0&&(0,$.jsxs)(`div`,{className:Q.snippetsSection,children:[(0,$.jsxs)(`div`,{className:Q.sectionHeader,children:[(0,$.jsxs)(`h2`,{className:Q.snippetsTitle,children:[`🧩 Coding Challenge Implementations (`,o.length,`)`]}),(0,$.jsx)(`span`,{className:Q.sectionHint,children:`Load algorithm & CSS layout solutions directly into sandbox`})]}),(0,$.jsx)(`div`,{className:Q.snippetsGrid,children:o.slice(0,16).map(e=>(0,$.jsxs)(`button`,{className:Q.snippetCard,onClick:()=>ne(e),children:[(0,$.jsxs)(`div`,{className:Q.snippetTop,children:[(0,$.jsx)(`p`,{className:Q.snippetName,children:e.title}),(0,$.jsx)(`span`,{className:H(e.difficulty),children:e.difficulty})]}),(0,$.jsxs)(`p`,{className:Q.snippetDesc,children:[e.problem.slice(0,90),`…`]}),(0,$.jsxs)(`div`,{className:Q.snippetFooter,children:[(0,$.jsx)(`span`,{className:Q.categoryTag,children:e.category}),(0,$.jsx)(`span`,{className:Q.snippetRunHint,children:`▶ Click to test in editor`})]})]},e.id))})]})]})}export{We as default};