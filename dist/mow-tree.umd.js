(function(L,_){typeof exports=="object"&&typeof module!="undefined"?_(exports):typeof define=="function"&&define.amd?define(["exports"],_):(L=typeof globalThis!="undefined"?globalThis:L||self,_(L.MowTree={}))})(this,function(L){"use strict";function _(){}const Ne=t=>t;function Z(t){return t()}function ae(){return Object.create(null)}function C(t){t.forEach(Z)}function ee(t){return typeof t=="function"}function z(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Se(t){return Object.keys(t).length===0}const de=typeof window!="undefined";let Fe=de?()=>window.performance.now():()=>Date.now(),te=de?t=>requestAnimationFrame(t):_;const A=new Set;function he(t){A.forEach(e=>{e.c(t)||(A.delete(e),e.f())}),A.size!==0&&te(he)}function Oe(t){let e;return A.size===0&&te(he),{promise:new Promise(n=>{A.add(e={c:t,f:n})}),abort(){A.delete(e)}}}function w(t,e){t.appendChild(e)}function me(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function je(t){const e=$("style");return Pe(me(t),e),e.sheet}function Pe(t,e){w(t.head||t,e)}function g(t,e,n){t.insertBefore(e,n||null)}function b(t){t.parentNode.removeChild(t)}function Be(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function $(t){return document.createElement(t)}function q(t){return document.createTextNode(t)}function ne(){return q(" ")}function J(){return q("")}function N(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function x(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function M(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:x(t,e,n)}function De(t){return Array.from(t.childNodes)}function _e(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ge(t,e,n,r){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function pe(t,e,n){t.classList[n?"add":"remove"](e)}function be(t,e,{bubbles:n=!1,cancelable:r=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,r,e),i}function V(t){const e={};for(const n of t)e[n.name]=n.value;return e}const W=new Map;let I=0;function He(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function ze(t,e){const n={stylesheet:je(e),rules:{}};return W.set(t,n),n}function $e(t,e,n,r,i,o,l,f=0){const s=16.666/r;let c=`{
`;for(let T=0;T<=1;T+=s){const R=e+(n-e)*o(T);c+=T*100+`%{${l(R,1-R)}}
`}const h=c+`100% {${l(n,1-n)}}
}`,m=`__svelte_${He(h)}_${f}`,a=me(t),{stylesheet:u,rules:d}=W.get(a)||ze(a,t);d[m]||(d[m]=!0,u.insertRule(`@keyframes ${m} ${h}`,u.cssRules.length));const E=t.style.animation||"";return t.style.animation=`${E?`${E}, `:""}${m} ${r}ms linear ${i}ms 1 both`,I+=1,m}function qe(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),i=n.length-r.length;i&&(t.style.animation=r.join(", "),I-=i,I||Je())}function Je(){te(()=>{I||(W.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),W.clear())})}let S;function F(t){S=t}function re(){if(!S)throw new Error("Function called outside component initialization");return S}function ye(){const t=re();return(e,n,{cancelable:r=!1}={})=>{const i=t.$$.callbacks[e];if(i){const o=be(e,n,{cancelable:r});return i.slice().forEach(l=>{l.call(t,o)}),!o.defaultPrevented}return!0}}function G(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(r=>r.call(this,e))}const O=[],ke=[],K=[],xe=[],Ve=Promise.resolve();let ie=!1;function We(){ie||(ie=!0,Ve.then(y))}function j(t){K.push(t)}const le=new Set;let Q=0;function y(){const t=S;do{for(;Q<O.length;){const e=O[Q];Q++,F(e),Ie(e.$$)}for(F(null),O.length=0,Q=0;ke.length;)ke.pop()();for(let e=0;e<K.length;e+=1){const n=K[e];le.has(n)||(le.add(n),n())}K.length=0}while(O.length);for(;xe.length;)xe.pop()();ie=!1,le.clear(),F(t)}function Ie(t){if(t.fragment!==null){t.update(),C(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(j)}}let P;function Ge(){return P||(P=Promise.resolve(),P.then(()=>{P=null})),P}function se(t,e,n){t.dispatchEvent(be(`${e?"intro":"outro"}${n}`))}const U=new Set;let v;function B(){v={r:0,c:[],p:v}}function D(){v.r||C(v.c),v=v.p}function p(t,e){t&&t.i&&(U.delete(t),t.i(e))}function k(t,e,n,r){if(t&&t.o){if(U.has(t))return;U.add(t),v.c.push(()=>{U.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const Ke={duration:0};function we(t,e,n,r){let i=e(t,n),o=r?0:1,l=null,f=null,s=null;function c(){s&&qe(t,s)}function h(a,u){const d=a.b-o;return u*=Math.abs(d),{a:o,b:a.b,d,duration:u,start:a.start,end:a.start+u,group:a.group}}function m(a){const{delay:u=0,duration:d=300,easing:E=Ne,tick:T=_,css:R}=i||Ke,ue={start:Fe()+u,b:a};a||(ue.group=v,v.r+=1),l||f?f=ue:(R&&(c(),s=$e(t,o,a,d,u,E,R)),a&&T(0,1),l=h(ue,d),j(()=>se(t,a,"start")),Oe(Y=>{if(f&&Y>f.start&&(l=h(f,d),f=null,se(t,l.b,"start"),R&&(c(),s=$e(t,o,l.b,l.duration,0,E,i.css))),l){if(Y>=l.end)T(o=l.b,1-o),se(t,l.b,"end"),f||(l.b?c():--l.group.r||C(l.group.c)),l=null;else if(Y>=l.start){const at=Y-l.start;o=l.a+l.d*E(at/l.duration),T(o,1-o)}}return!!(l||f)}))}return{run(a){ee(i)?Ge().then(()=>{i=i(),m(a)}):m(a)},end(){c(),l=f=null}}}function ve(t){t&&t.c()}function oe(t,e,n,r){const{fragment:i,on_mount:o,on_destroy:l,after_update:f}=t.$$;i&&i.m(e,n),r||j(()=>{const s=o.map(Z).filter(ee);l?l.push(...s):C(s),t.$$.on_mount=[]}),f.forEach(j)}function ce(t,e){const n=t.$$;n.fragment!==null&&(C(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Qe(t,e){t.$$.dirty[0]===-1&&(O.push(t),We(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function X(t,e,n,r,i,o,l,f=[-1]){const s=S;F(t);const c=t.$$={fragment:null,ctx:null,props:o,update:_,not_equal:i,bound:ae(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(s?s.$$.context:[])),callbacks:ae(),dirty:f,skip_bound:!1,root:e.target||s.$$.root};l&&l(c.root);let h=!1;if(c.ctx=n?n(t,e.props||{},(m,a,...u)=>{const d=u.length?u[0]:a;return c.ctx&&i(c.ctx[m],c.ctx[m]=d)&&(!c.skip_bound&&c.bound[m]&&c.bound[m](d),h&&Qe(t,m)),a}):[],c.update(),h=!0,C(c.before_update),c.fragment=r?r(c.ctx):!1,e.target){if(e.hydrate){const m=De(e.target);c.fragment&&c.fragment.l(m),m.forEach(b)}else c.fragment&&c.fragment.c();e.intro&&p(t.$$.fragment),oe(t,e.target,e.anchor,e.customElement),y()}F(s)}let H;typeof HTMLElement=="function"&&(H=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(Z).filter(ee);for(const e in this.$$.slotted)this.appendChild(this.$$.slotted[e])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){C(this.$$.on_disconnect)}$destroy(){ce(this,1),this.$destroy=_}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const r=n.indexOf(e);r!==-1&&n.splice(r,1)}}$set(t){this.$$set&&!Se(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});function Ue(t){const e=t-1;return e*e*e+1}function Ee(t,{delay:e=0,duration:n=400,easing:r=Ue}={}){const i=getComputedStyle(t),o=+i.opacity,l=parseFloat(i.height),f=parseFloat(i.paddingTop),s=parseFloat(i.paddingBottom),c=parseFloat(i.marginTop),h=parseFloat(i.marginBottom),m=parseFloat(i.borderTopWidth),a=parseFloat(i.borderBottomWidth);return{delay:e,duration:n,easing:r,css:u=>`overflow: hidden;opacity: ${Math.min(u*20,1)*o};height: ${u*l}px;padding-top: ${u*f}px;padding-bottom: ${u*s}px;margin-top: ${u*c}px;margin-bottom: ${u*h}px;border-top-width: ${u*m}px;border-bottom-width: ${u*a}px;`}}function Xe(t){let e,n,r,i,o,l,f,s,c,h,m,a=t[0]&&Te();return{c(){e=$("div"),n=$("div"),r=$("div"),r.innerHTML='<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="1089"></path></svg>',i=ne(),o=$("div"),l=q(t[2]),f=ne(),a&&a.c(),s=J(),x(r,"class","flex items-center transition"),pe(r,"rotate-90",t[0]),x(n,"class","ml-1 text-12px text-gray-600 flex item-center"),ge(n,"height","100%"),ge(n,"width","16px"),x(o,"class","ml-1"),x(e,"class","cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee")},m(u,d){g(u,e,d),w(e,n),w(n,r),w(e,i),w(e,o),w(o,l),g(u,f,d),a&&a.m(u,d),g(u,s,d),c=!0,h||(m=N(e,"click",t[6]),h=!0)},p(u,d){d&1&&pe(r,"rotate-90",u[0]),(!c||d&4)&&_e(l,u[2]),u[0]?a?d&1&&p(a,1):(a=Te(),a.c(),p(a,1),a.m(s.parentNode,s)):a&&(B(),k(a,1,1,()=>{a=null}),D())},i(u){c||(p(a),c=!0)},o(u){k(a),c=!1},d(u){u&&b(e),u&&b(f),a&&a.d(u),u&&b(s),h=!1,m()}}}function Ye(t){let e,n,r,i,o;return{c(){e=$("div"),n=$("div"),n.innerHTML="<slot></slot>",x(n,"class","ml-4"),x(e,"class","cursor-pointer text-gray-600 flex items-center h-40px bg-white transition hover-bg-eee"),x(e,"style",r=t[3]?"background-color: rgba(119, 197, 250, 0.315)":"")},m(l,f){g(l,e,f),w(e,n),i||(o=N(e,"click",t[5]),i=!0)},p(l,f){f&8&&r!==(r=l[3]?"background-color: rgba(119, 197, 250, 0.315)":"")&&x(e,"style",r)},i:_,o:_,d(l){l&&b(e),i=!1,o()}}}function Te(t){let e,n,r;return{c(){e=$("div"),e.innerHTML="<slot></slot>",x(e,"class","ml-1")},m(i,o){g(i,e,o),r=!0},i(i){r||(j(()=>{n||(n=we(e,Ee,{},!0)),n.run(1)}),r=!0)},o(i){n||(n=we(e,Ee,{},!1)),n.run(0),r=!1},d(i){i&&b(e),i&&n&&n.end()}}}function Ze(t){let e,n,r,i;const o=[Ye,Xe],l=[];function f(s,c){return s[1]?0:1}return n=f(t),r=l[n]=o[n](t),{c(){e=$("div"),r.c(),this.c=_,x(e,"class","item")},m(s,c){g(s,e,c),l[n].m(e,null),i=!0},p(s,[c]){let h=n;n=f(s),n===h?l[n].p(s,c):(B(),k(l[h],1,1,()=>{l[h]=null}),D(),r=l[n],r?r.p(s,c):(r=l[n]=o[n](s),r.c()),p(r,1),r.m(e,null))},i(s){i||(p(r),i=!0)},o(s){k(r),i=!1},d(s){s&&b(e),l[n].d()}}}function et(t,e,n){let{leaf:r=!1}=e,{text:i=""}=e,{expand:o=!1}=e,{selected:l=!1}=e;const f=re(),s=ye(),c=(a,u)=>{var d;return(d=f==null?void 0:f.dispatchEvent)==null||d.call(f,new CustomEvent(a,{detail:u})),s(a,u)};function h(a){G.call(this,t,a)}const m=()=>{n(0,o=!o),c("toggleExpand",o)};return t.$$set=a=>{"leaf"in a&&n(1,r=a.leaf),"text"in a&&n(2,i=a.text),"expand"in a&&n(0,o=a.expand),"selected"in a&&n(3,l=a.selected)},[o,r,i,l,c,h,m]}class tt extends H{constructor(e){super(),this.shadowRoot.innerHTML="<style>.item{user-select:none}.item .cursor-pointer{cursor:pointer}.item .text-gray-600{color:#494949}.item .flex{display:flex}.item .items-center{align-items:center}.item .bg-white{background-color:#fff}.item .hover-bg-eee:hover{background-color:#eee}.item .transition{transition:all 0.2s ease}.item .ml-4{margin-left:32px}.item .ml-1{margin-left:8px}.item .h-40px{height:40px}.item .text-12px{font-size:12px}.item div.rotate-90{transform:rotate(90deg)}</style>",X(this,{target:this.shadowRoot,props:V(this.attributes),customElement:!0},et,Ze,z,{leaf:1,text:2,expand:0,selected:3},null),e&&(e.target&&g(e.target,this,e.anchor),e.props&&(this.$set(e.props),y()))}static get observedAttributes(){return["leaf","text","expand","selected"]}get leaf(){return this.$$.ctx[1]}set leaf(e){this.$$set({leaf:e}),y()}get text(){return this.$$.ctx[2]}set text(e){this.$$set({text:e}),y()}get expand(){return this.$$.ctx[0]}set expand(e){this.$$set({expand:e}),y()}get selected(){return this.$$.ctx[3]}set selected(e){this.$$set({selected:e}),y()}}customElements.define("tree-item",tt);function nt(t){let e,n,r,i;return{c(){e=$("tree-item"),n=$("slot"),this.c=_,M(e,"leaf",""),M(e,"selected",t[0])},m(o,l){g(o,e,l),w(e,n),r||(i=N(e,"click",t[1]),r=!0)},p(o,[l]){l&1&&M(e,"selected",o[0])},i:_,o:_,d(o){o&&b(e),r=!1,i()}}}function rt(t,e,n){let{selected:r=!1}=e;function i(o){G.call(this,t,o)}return t.$$set=o=>{"selected"in o&&n(0,r=o.selected)},[r,i]}class it extends H{constructor(e){super(),X(this,{target:this.shadowRoot,props:V(this.attributes),customElement:!0},rt,nt,z,{selected:0},null),e&&(e.target&&g(e.target,this,e.anchor),e.props&&(this.$set(e.props),y()))}static get observedAttributes(){return["selected"]}get selected(){return this.$$.ctx[0]}set selected(e){this.$$set({selected:e}),y()}}customElements.define("tree-leaf",it);function Ce(t,e,n){const r=t.slice();return r[10]=e[n],r}function lt(t){let e,n,r,i,o,l,f;n=new fe({props:{tree:t[10].children}}),n.$on("leafClick",t[5]),n.$on("itemToggle",t[6]);function s(...c){return t[7](t[10],...c)}return{c(){e=$("tree-item"),ve(n.$$.fragment),r=ne(),M(e,"text",i=t[10].text)},m(c,h){g(c,e,h),oe(n,e,null),w(e,r),o=!0,l||(f=N(e,"toggleExpand",s),l=!0)},p(c,h){t=c;const m={};h&1&&(m.tree=t[10].children),n.$set(m),(!o||h&1&&i!==(i=t[10].text))&&M(e,"text",i)},i(c){o||(p(n.$$.fragment,c),o=!0)},o(c){k(n.$$.fragment,c),o=!1},d(c){c&&b(e),ce(n),l=!1,f()}}}function st(t){let e,n=t[10].text+"",r,i,o,l;function f(){return t[4](t[10])}return{c(){e=$("tree-leaf"),r=q(n),M(e,"selected",i=t[10].selected)},m(s,c){g(s,e,c),w(e,r),o||(l=N(e,"click",f),o=!0)},p(s,c){t=s,c&1&&n!==(n=t[10].text+"")&&_e(r,n),c&1&&i!==(i=t[10].selected)&&M(e,"selected",i)},i:_,o:_,d(s){s&&b(e),o=!1,l()}}}function Me(t){let e,n,r,i;const o=[st,lt],l=[];function f(s,c){return s[10].children?1:0}return e=f(t),n=l[e]=o[e](t),{c(){n.c(),r=J()},m(s,c){l[e].m(s,c),g(s,r,c),i=!0},p(s,c){let h=e;e=f(s),e===h?l[e].p(s,c):(B(),k(l[h],1,1,()=>{l[h]=null}),D(),n=l[e],n?n.p(s,c):(n=l[e]=o[e](s),n.c()),p(n,1),n.m(r.parentNode,r))},i(s){i||(p(n),i=!0)},o(s){k(n),i=!1},d(s){l[e].d(s),s&&b(r)}}}function ot(t){let e,n,r=t[0],i=[];for(let l=0;l<r.length;l+=1)i[l]=Me(Ce(t,r,l));const o=l=>k(i[l],1,1,()=>{i[l]=null});return{c(){for(let l=0;l<i.length;l+=1)i[l].c();e=J(),this.c=_},m(l,f){for(let s=0;s<i.length;s+=1)i[s].m(l,f);g(l,e,f),n=!0},p(l,[f]){if(f&15){r=l[0];let s;for(s=0;s<r.length;s+=1){const c=Ce(l,r,s);i[s]?(i[s].p(c,f),p(i[s],1)):(i[s]=Me(c),i[s].c(),p(i[s],1),i[s].m(e.parentNode,e))}for(B(),s=r.length;s<i.length;s+=1)o(s);D()}},i(l){if(!n){for(let f=0;f<r.length;f+=1)p(i[f]);n=!0}},o(l){i=i.filter(Boolean);for(let f=0;f<i.length;f+=1)k(i[f]);n=!1},d(l){Be(i,l),l&&b(e)}}}function Le(t){const e=[...t],n=[];for(;!(e.length<=0);){const r=e.shift();n.push(r),r.children&&r.children.length>0&&e.push(...r.children)}return n}function ct(t,e,n){let{tree:r=[]}=e;const i=re(),o=ye(),l=(u,d)=>{var E;return(E=i==null?void 0:i.dispatchEvent)==null||E.call(i,new CustomEvent(u,{detail:d})),o(u,d)},f=u=>{Le(r).forEach(d=>{d.selected=!1}),u.selected=!0,n(0,r)},s=u=>{Le(r).forEach(d=>{d.selected=!1}),n(0,r),l("leafClick",u.detail)},c=u=>{l("leafClick",u),f(u)},h=u=>{s(u)},m=u=>{l("itemToggle",u.detail)},a=(u,d)=>{l("itemToggle",{target:u,expand:d.detail})};return t.$$set=u=>{"tree"in u&&n(0,r=u.tree)},[r,l,f,s,c,h,m,a]}class fe extends H{constructor(e){super(),X(this,{target:this.shadowRoot,props:V(this.attributes),customElement:!0},ct,ot,z,{tree:0},null),e&&(e.target&&g(e.target,this,e.anchor),e.props&&(this.$set(e.props),y()))}static get observedAttributes(){return["tree"]}get tree(){return this.$$.ctx[0]}set tree(e){this.$$set({tree:e}),y()}}customElements.define("tree-view",fe);function Ae(t){let e,n;return e=new fe({props:{tree:t[1]}}),e.$on("itemToggle",t[3]),e.$on("leafClick",t[4]),{c(){ve(e.$$.fragment)},m(r,i){oe(e,r,i),n=!0},p(r,i){const o={};i&2&&(o.tree=r[1]),e.$set(o)},i(r){n||(p(e.$$.fragment,r),n=!0)},o(r){k(e.$$.fragment,r),n=!1},d(r){ce(e,r)}}}function ft(t){let e,n,r=t[0]&&Ae(t);return{c(){r&&r.c(),e=J(),this.c=_},m(i,o){r&&r.m(i,o),g(i,e,o),n=!0},p(i,[o]){i[0]?r?(r.p(i,o),o&1&&p(r,1)):(r=Ae(i),r.c(),p(r,1),r.m(e.parentNode,e)):r&&(B(),k(r,1,1,()=>{r=null}),D())},i(i){n||(p(r),n=!0)},o(i){k(r),n=!1},d(i){r&&r.d(i),i&&b(e)}}}function ut(t,e,n){let{tree:r=[]}=e,i=!1,o=[];function l(s){G.call(this,t,s)}function f(s){G.call(this,t,s)}return t.$$set=s=>{"tree"in s&&n(2,r=s.tree)},t.$$.update=()=>{t.$$.dirty&4&&(Array.isArray(r)?(n(1,o=r),n(0,i=!0)):typeof r=="string"?(n(1,o=JSON.parse(r)),n(0,i=!0)):console.warn("tree\u5FC5\u987B\u662F\u5408\u6CD5\u7684JSON\u5B57\u7B26\u4E32\u6216\u5BF9\u8C61\u6570\u7EC4"))},[i,o,r,l,f]}class Re extends H{constructor(e){super(),X(this,{target:this.shadowRoot,props:V(this.attributes),customElement:!0},ut,ft,z,{tree:2},null),e&&(e.target&&g(e.target,this,e.anchor),e.props&&(this.$set(e.props),y()))}static get observedAttributes(){return["tree"]}get tree(){return this.$$.ctx[2]}set tree(e){this.$$set({tree:e}),y()}}customElements.define("mow-tree",Re),L.MowTree=Re,Object.defineProperties(L,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});