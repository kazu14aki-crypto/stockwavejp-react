import{r as S,a as hi}from"./react-vendor-jVyfcstf.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();var On={exports:{}},Vt={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ui=S,pi=Symbol.for("react.element"),fi=Symbol.for("react.fragment"),gi=Object.prototype.hasOwnProperty,xi=ui.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,mi={key:!0,ref:!0,__self:!0,__source:!0};function Wn(t,e,r){var i,s={},o=null,a=null;r!==void 0&&(o=""+r),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)gi.call(e,i)&&!mi.hasOwnProperty(i)&&(s[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)s[i]===void 0&&(s[i]=e[i]);return{$$typeof:pi,type:t,key:o,ref:a,props:s,_owner:xi.current}}Vt.Fragment=fi;Vt.jsx=Wn;Vt.jsxs=Wn;On.exports=Vt;var n=On.exports,Nn,Br=hi;Nn=Br.createRoot,Br.hydrateRoot;const Re="https://stockwavejp-api.onrender.com",yi="/data/market.json",Dn="swjp_v4_",vi=12*60*60*1e3;function Ae(t){try{const e=localStorage.getItem(Dn+t);if(!e)return null;const{data:r,ts:i}=JSON.parse(e);return Date.now()-i>vi?null:r}catch{return null}}function mt(t,e){try{localStorage.setItem(Dn+t,JSON.stringify({data:e,ts:Date.now()}))}catch{}}let er=null,Mr=0,Fe=null;const bi=90*60*1e3;async function At(){return er&&Date.now()-Mr<bi?er:Fe||(Fe=fetch(`${yi}?t=${Date.now()}`).then(t=>{if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}).then(t=>(er=t,Mr=Date.now(),Fe=null,t)).catch(t=>{throw Fe=null,t}),Fe)}function Ir(t,e,r=[]){const[i,s]=S.useState(()=>Ae(t)),[o,a]=S.useState(!Ae(t));return S.useEffect(()=>{let l=!1;const c=Ae(t);return c&&(s(c),a(!1)),(async()=>{try{const h=(await At())[t];if(h&&!l){s(h),mt(t,h),a(!1);return}}catch{}if(e)try{const h=await(await fetch(e)).json();l||(s(h),mt(t,h))}catch{}l||a(!1)})(),()=>{l=!0}},r),{data:i,loading:o}}function Ln(t="1mo"){const e=`themes_${t}`,[r,i]=S.useState(()=>Ae(e)),[s,o]=S.useState(!Ae(e)),[a,l]=S.useState(!1),[c,d]=S.useState(null),h=S.useCallback(async(f=!1)=>{f?l(!0):o(!0);try{const g=(await At())[e];if(g){i(g),mt(e,g),d(g.updated_at||null);return}}catch{}try{const g=await(await fetch(`${Re}/api/themes?period=${t}`)).json();i(g),mt(e,g)}catch{f||i(Ae(e))}finally{o(!1),l(!1)}},[t,e]);return S.useEffect(()=>{const f=Ae(e);f?(i(f),o(!1),h(!0)):h(!1)},[t]),{data:r,loading:s,refreshing:a,updatedAt:c,refresh:()=>h(!1)}}function Bn(t="1mo"){return Ir(`macro_${t}`,`${Re}/api/macro?period=${t}`,[t])}function Si(){const[t,e]=S.useState({time:"--:--",is_open:!1,label:"..."});return S.useEffect(()=>{const r=async()=>{try{const s=await At();if(s.status){e({...s.status,label:s.status.is_open?"市場オープン中":"市場クローズ中",updatedAt:s.status.updated_at||null});return}}catch{}try{const o=await(await fetch(`${Re}/api/status`)).json();e({...o,label:o.is_open?"市場オープン中":"市場クローズ中"})}catch{const s=new Date,o=new Date(s.getTime()+(s.getTimezoneOffset()+540)*6e4);e({time:`${String(o.getHours()).padStart(2,"0")}:${String(o.getMinutes()).padStart(2,"0")} JST`,is_open:!1,label:"接続エラー"})}};r();const i=setInterval(r,6e4);return()=>clearInterval(i)},[]),t}function wi(){return Ir("heatmap_monthly",`${Re}/api/heatmap/monthly`)}function Er(t="1mo"){const[e,r]=S.useState(null),[i,s]=S.useState(!0);return S.useEffect(()=>{let o=!1;return s(!0),(async()=>{let a=null;try{const c=(await At())[`momentum_${t}`];if(c){const d=(c==null?void 0:c.data)||c||[];Array.isArray(d)&&d.some(f=>f.volume_chg&&f.volume_chg!==0)&&(a=c)}}catch{}if(!a)try{const c=await(await fetch(`${Re}/api/momentum?period=${t}`)).json();o||(a=c)}catch{}o||(r(a),s(!1))})(),()=>{o=!0}},[t]),{data:e,loading:i}}function ki(t,e){const[r,i]=S.useState(null),[s,o]=S.useState(!1);return S.useEffect(()=>{if(!t)return;let a=!1;i(null),o(!0);const l=`seg_${t}_${e}`;return(async()=>{try{const d=(await At())[l];if(d&&!a){i(d),o(!1);return}}catch{}try{const d=await(await fetch(`${Re}/api/market-rank/${encodeURIComponent(t)}?period=${e}`)).json();a||i(d)}catch{}a||o(!1)})(),()=>{a=!0}},[t,e]),{data:r,loading:s}}function ji(t="1mo"){return Ir(`market_rank_${t}`,`${Re}/api/market-rank-list?period=${t}`,[t])}function Ai(t,e){const r=`custom_stats_${(t||[]).join(",")}_${e}`,[i,s]=S.useState(()=>Ae(r)),[o,a]=S.useState(!Ae(r));return S.useEffect(()=>{if(!t||t.length===0){a(!1);return}let l=!1;const c=Ae(r);return c&&(s(c),a(!1)),(async()=>{try{const h=await(await fetch(`${Re}/api/custom-theme-stats`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tickers:t,period:e})})).json();l||(s(h),mt(r,h))}catch{}l||a(!1)})(),()=>{l=!0}},[t==null?void 0:t.join(","),e]),{data:i,loading:o}}function qt(t,e){var r={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(r[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,i=Object.getOwnPropertySymbols(t);s<i.length;s++)e.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(t,i[s])&&(r[i[s]]=t[i[s]]);return r}function _i(t,e,r,i){function s(o){return o instanceof r?o:new r(function(a){a(o)})}return new(r||(r=Promise))(function(o,a){function l(h){try{d(i.next(h))}catch(f){a(f)}}function c(h){try{d(i.throw(h))}catch(f){a(f)}}function d(h){h.done?o(h.value):s(h.value).then(l,c)}d((i=i.apply(t,e||[])).next())})}const Hi=t=>t?(...e)=>t(...e):(...e)=>fetch(...e);class Pr extends Error{constructor(e,r="FunctionsError",i){super(e),this.name=r,this.context=i}}class Ii extends Pr{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class $r extends Pr{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class Fr extends Pr{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var xr;(function(t){t.Any="any",t.ApNortheast1="ap-northeast-1",t.ApNortheast2="ap-northeast-2",t.ApSouth1="ap-south-1",t.ApSoutheast1="ap-southeast-1",t.ApSoutheast2="ap-southeast-2",t.CaCentral1="ca-central-1",t.EuCentral1="eu-central-1",t.EuWest1="eu-west-1",t.EuWest2="eu-west-2",t.EuWest3="eu-west-3",t.SaEast1="sa-east-1",t.UsEast1="us-east-1",t.UsWest1="us-west-1",t.UsWest2="us-west-2"})(xr||(xr={}));class Ei{constructor(e,{headers:r={},customFetch:i,region:s=xr.Any}={}){this.url=e,this.headers=r,this.region=s,this.fetch=Hi(i)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return _i(this,arguments,void 0,function*(r,i={}){var s;let o,a;try{const{headers:l,method:c,body:d,signal:h,timeout:f}=i;let u={},{region:g}=i;g||(g=this.region);const y=new URL(`${this.url}/${r}`);g&&g!=="any"&&(u["x-region"]=g,y.searchParams.set("forceFunctionRegion",g));let m;d&&(l&&!Object.prototype.hasOwnProperty.call(l,"Content-Type")||!l)?typeof Blob<"u"&&d instanceof Blob||d instanceof ArrayBuffer?(u["Content-Type"]="application/octet-stream",m=d):typeof d=="string"?(u["Content-Type"]="text/plain",m=d):typeof FormData<"u"&&d instanceof FormData?m=d:(u["Content-Type"]="application/json",m=JSON.stringify(d)):d&&typeof d!="string"&&!(typeof Blob<"u"&&d instanceof Blob)&&!(d instanceof ArrayBuffer)&&!(typeof FormData<"u"&&d instanceof FormData)?m=JSON.stringify(d):m=d;let b=h;f&&(a=new AbortController,o=setTimeout(()=>a.abort(),f),h?(b=a.signal,h.addEventListener("abort",()=>a.abort())):b=a.signal);const x=yield this.fetch(y.toString(),{method:c||"POST",headers:Object.assign(Object.assign(Object.assign({},u),this.headers),l),body:m,signal:b}).catch(H=>{throw new Ii(H)}),p=x.headers.get("x-relay-error");if(p&&p==="true")throw new $r(x);if(!x.ok)throw new Fr(x);let v=((s=x.headers.get("Content-Type"))!==null&&s!==void 0?s:"text/plain").split(";")[0].trim(),w;return v==="application/json"?w=yield x.json():v==="application/octet-stream"||v==="application/pdf"?w=yield x.blob():v==="text/event-stream"?w=x:v==="multipart/form-data"?w=yield x.formData():w=yield x.text(),{data:w,error:null,response:x}}catch(l){return{data:null,error:l,response:l instanceof Fr||l instanceof $r?l.context:void 0}}finally{o&&clearTimeout(o)}})}}var Pi=class extends Error{constructor(t){super(t.message),this.name="PostgrestError",this.details=t.details,this.hint=t.hint,this.code=t.code}},Ti=class{constructor(t){var e,r,i;this.shouldThrowOnError=!1,this.method=t.method,this.url=t.url,this.headers=new Headers(t.headers),this.schema=t.schema,this.body=t.body,this.shouldThrowOnError=(e=t.shouldThrowOnError)!==null&&e!==void 0?e:!1,this.signal=t.signal,this.isMaybeSingle=(r=t.isMaybeSingle)!==null&&r!==void 0?r:!1,this.urlLengthLimit=(i=t.urlLengthLimit)!==null&&i!==void 0?i:8e3,t.fetch?this.fetch=t.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(t,e){return this.headers=new Headers(this.headers),this.headers.set(t,e),this}then(t,e){var r=this;this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json");const i=this.fetch;let s=i(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async o=>{let a=null,l=null,c=null,d=o.status,h=o.statusText;if(o.ok){var f,u;if(r.method!=="HEAD"){var g;const b=await o.text();b===""||(r.headers.get("Accept")==="text/csv"||r.headers.get("Accept")&&(!((g=r.headers.get("Accept"))===null||g===void 0)&&g.includes("application/vnd.pgrst.plan+text"))?l=b:l=JSON.parse(b))}const y=(f=r.headers.get("Prefer"))===null||f===void 0?void 0:f.match(/count=(exact|planned|estimated)/),m=(u=o.headers.get("content-range"))===null||u===void 0?void 0:u.split("/");y&&m&&m.length>1&&(c=parseInt(m[1])),r.isMaybeSingle&&Array.isArray(l)&&(l.length>1?(a={code:"PGRST116",details:`Results contain ${l.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},l=null,c=null,d=406,h="Not Acceptable"):l.length===1?l=l[0]:l=null)}else{const y=await o.text();try{a=JSON.parse(y),Array.isArray(a)&&o.status===404&&(l=[],a=null,d=200,h="OK")}catch{o.status===404&&y===""?(d=204,h="No Content"):a={message:y}}if(a&&r.shouldThrowOnError)throw new Pi(a)}return{error:a,data:l,count:c,status:d,statusText:h}});return this.shouldThrowOnError||(s=s.catch(o=>{var a;let l="",c="",d="";const h=o==null?void 0:o.cause;if(h){var f,u,g,y;const x=(f=h==null?void 0:h.message)!==null&&f!==void 0?f:"",p=(u=h==null?void 0:h.code)!==null&&u!==void 0?u:"";l=`${(g=o==null?void 0:o.name)!==null&&g!==void 0?g:"FetchError"}: ${o==null?void 0:o.message}`,l+=`

Caused by: ${(y=h==null?void 0:h.name)!==null&&y!==void 0?y:"Error"}: ${x}`,p&&(l+=` (${p})`),h!=null&&h.stack&&(l+=`
${h.stack}`)}else{var m;l=(m=o==null?void 0:o.stack)!==null&&m!==void 0?m:""}const b=this.url.toString().length;return(o==null?void 0:o.name)==="AbortError"||(o==null?void 0:o.code)==="ABORT_ERR"?(d="",c="Request was aborted (timeout or manual cancellation)",b>this.urlLengthLimit&&(c+=`. Note: Your request URL is ${b} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):((h==null?void 0:h.name)==="HeadersOverflowError"||(h==null?void 0:h.code)==="UND_ERR_HEADERS_OVERFLOW")&&(d="",c="HTTP headers exceeded server limits (typically 16KB)",b>this.urlLengthLimit&&(c+=`. Your request URL is ${b} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{error:{message:`${(a=o==null?void 0:o.name)!==null&&a!==void 0?a:"FetchError"}: ${o==null?void 0:o.message}`,details:l,hint:c,code:d},data:null,count:null,status:0,statusText:""}})),s.then(t,e)}returns(){return this}overrideTypes(){return this}},Ci=class extends Ti{select(t){let e=!1;const r=(t??"*").split("").map(i=>/\s/.test(i)&&!e?"":(i==='"'&&(e=!e),i)).join("");return this.url.searchParams.set("select",r),this.headers.append("Prefer","return=representation"),this}order(t,{ascending:e=!0,nullsFirst:r,foreignTable:i,referencedTable:s=i}={}){const o=s?`${s}.order`:"order",a=this.url.searchParams.get(o);return this.url.searchParams.set(o,`${a?`${a},`:""}${t}.${e?"asc":"desc"}${r===void 0?"":r?".nullsfirst":".nullslast"}`),this}limit(t,{foreignTable:e,referencedTable:r=e}={}){const i=typeof r>"u"?"limit":`${r}.limit`;return this.url.searchParams.set(i,`${t}`),this}range(t,e,{foreignTable:r,referencedTable:i=r}={}){const s=typeof i>"u"?"offset":`${i}.offset`,o=typeof i>"u"?"limit":`${i}.limit`;return this.url.searchParams.set(s,`${t}`),this.url.searchParams.set(o,`${e-t+1}`),this}abortSignal(t){return this.signal=t,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:t=!1,verbose:e=!1,settings:r=!1,buffers:i=!1,wal:s=!1,format:o="text"}={}){var a;const l=[t?"analyze":null,e?"verbose":null,r?"settings":null,i?"buffers":null,s?"wal":null].filter(Boolean).join("|"),c=(a=this.headers.get("Accept"))!==null&&a!==void 0?a:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${o}; for="${c}"; options=${l};`),o==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(t){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${t}`),this}};const zr=new RegExp("[,()]");var et=class extends Ci{eq(t,e){return this.url.searchParams.append(t,`eq.${e}`),this}neq(t,e){return this.url.searchParams.append(t,`neq.${e}`),this}gt(t,e){return this.url.searchParams.append(t,`gt.${e}`),this}gte(t,e){return this.url.searchParams.append(t,`gte.${e}`),this}lt(t,e){return this.url.searchParams.append(t,`lt.${e}`),this}lte(t,e){return this.url.searchParams.append(t,`lte.${e}`),this}like(t,e){return this.url.searchParams.append(t,`like.${e}`),this}likeAllOf(t,e){return this.url.searchParams.append(t,`like(all).{${e.join(",")}}`),this}likeAnyOf(t,e){return this.url.searchParams.append(t,`like(any).{${e.join(",")}}`),this}ilike(t,e){return this.url.searchParams.append(t,`ilike.${e}`),this}ilikeAllOf(t,e){return this.url.searchParams.append(t,`ilike(all).{${e.join(",")}}`),this}ilikeAnyOf(t,e){return this.url.searchParams.append(t,`ilike(any).{${e.join(",")}}`),this}regexMatch(t,e){return this.url.searchParams.append(t,`match.${e}`),this}regexIMatch(t,e){return this.url.searchParams.append(t,`imatch.${e}`),this}is(t,e){return this.url.searchParams.append(t,`is.${e}`),this}isDistinct(t,e){return this.url.searchParams.append(t,`isdistinct.${e}`),this}in(t,e){const r=Array.from(new Set(e)).map(i=>typeof i=="string"&&zr.test(i)?`"${i}"`:`${i}`).join(",");return this.url.searchParams.append(t,`in.(${r})`),this}notIn(t,e){const r=Array.from(new Set(e)).map(i=>typeof i=="string"&&zr.test(i)?`"${i}"`:`${i}`).join(",");return this.url.searchParams.append(t,`not.in.(${r})`),this}contains(t,e){return typeof e=="string"?this.url.searchParams.append(t,`cs.${e}`):Array.isArray(e)?this.url.searchParams.append(t,`cs.{${e.join(",")}}`):this.url.searchParams.append(t,`cs.${JSON.stringify(e)}`),this}containedBy(t,e){return typeof e=="string"?this.url.searchParams.append(t,`cd.${e}`):Array.isArray(e)?this.url.searchParams.append(t,`cd.{${e.join(",")}}`):this.url.searchParams.append(t,`cd.${JSON.stringify(e)}`),this}rangeGt(t,e){return this.url.searchParams.append(t,`sr.${e}`),this}rangeGte(t,e){return this.url.searchParams.append(t,`nxl.${e}`),this}rangeLt(t,e){return this.url.searchParams.append(t,`sl.${e}`),this}rangeLte(t,e){return this.url.searchParams.append(t,`nxr.${e}`),this}rangeAdjacent(t,e){return this.url.searchParams.append(t,`adj.${e}`),this}overlaps(t,e){return typeof e=="string"?this.url.searchParams.append(t,`ov.${e}`):this.url.searchParams.append(t,`ov.{${e.join(",")}}`),this}textSearch(t,e,{config:r,type:i}={}){let s="";i==="plain"?s="pl":i==="phrase"?s="ph":i==="websearch"&&(s="w");const o=r===void 0?"":`(${r})`;return this.url.searchParams.append(t,`${s}fts${o}.${e}`),this}match(t){return Object.entries(t).filter(([e,r])=>r!==void 0).forEach(([e,r])=>{this.url.searchParams.append(e,`eq.${r}`)}),this}not(t,e,r){return this.url.searchParams.append(t,`not.${e}.${r}`),this}or(t,{foreignTable:e,referencedTable:r=e}={}){const i=r?`${r}.or`:"or";return this.url.searchParams.append(i,`(${t})`),this}filter(t,e,r){return this.url.searchParams.append(t,`${e}.${r}`),this}},Ri=class{constructor(t,{headers:e={},schema:r,fetch:i,urlLengthLimit:s=8e3}){this.url=t,this.headers=new Headers(e),this.schema=r,this.fetch=i,this.urlLengthLimit=s}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(t,e){const{head:r=!1,count:i}=e??{},s=r?"HEAD":"GET";let o=!1;const a=(t??"*").split("").map(d=>/\s/.test(d)&&!o?"":(d==='"'&&(o=!o),d)).join(""),{url:l,headers:c}=this.cloneRequestState();return l.searchParams.set("select",a),i&&c.append("Prefer",`count=${i}`),new et({method:s,url:l,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit})}insert(t,{count:e,defaultToNull:r=!0}={}){var i;const s="POST",{url:o,headers:a}=this.cloneRequestState();if(e&&a.append("Prefer",`count=${e}`),r||a.append("Prefer","missing=default"),Array.isArray(t)){const l=t.reduce((c,d)=>c.concat(Object.keys(d)),[]);if(l.length>0){const c=[...new Set(l)].map(d=>`"${d}"`);o.searchParams.set("columns",c.join(","))}}return new et({method:s,url:o,headers:a,schema:this.schema,body:t,fetch:(i=this.fetch)!==null&&i!==void 0?i:fetch,urlLengthLimit:this.urlLengthLimit})}upsert(t,{onConflict:e,ignoreDuplicates:r=!1,count:i,defaultToNull:s=!0}={}){var o;const a="POST",{url:l,headers:c}=this.cloneRequestState();if(c.append("Prefer",`resolution=${r?"ignore":"merge"}-duplicates`),e!==void 0&&l.searchParams.set("on_conflict",e),i&&c.append("Prefer",`count=${i}`),s||c.append("Prefer","missing=default"),Array.isArray(t)){const d=t.reduce((h,f)=>h.concat(Object.keys(f)),[]);if(d.length>0){const h=[...new Set(d)].map(f=>`"${f}"`);l.searchParams.set("columns",h.join(","))}}return new et({method:a,url:l,headers:c,schema:this.schema,body:t,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch,urlLengthLimit:this.urlLengthLimit})}update(t,{count:e}={}){var r;const i="PATCH",{url:s,headers:o}=this.cloneRequestState();return e&&o.append("Prefer",`count=${e}`),new et({method:i,url:s,headers:o,schema:this.schema,body:t,fetch:(r=this.fetch)!==null&&r!==void 0?r:fetch,urlLengthLimit:this.urlLengthLimit})}delete({count:t}={}){var e;const r="DELETE",{url:i,headers:s}=this.cloneRequestState();return t&&s.append("Prefer",`count=${t}`),new et({method:r,url:i,headers:s,schema:this.schema,fetch:(e=this.fetch)!==null&&e!==void 0?e:fetch,urlLengthLimit:this.urlLengthLimit})}};function yt(t){"@babel/helpers - typeof";return yt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},yt(t)}function Oi(t,e){if(yt(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e);if(yt(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Wi(t){var e=Oi(t,"string");return yt(e)=="symbol"?e:e+""}function Ni(t,e,r){return(e=Wi(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ur(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),r.push.apply(r,i)}return r}function It(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?Ur(Object(r),!0).forEach(function(i){Ni(t,i,r[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):Ur(Object(r)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(r,i))})}return t}var Di=class Mn{constructor(e,{headers:r={},schema:i,fetch:s,timeout:o,urlLengthLimit:a=8e3}={}){this.url=e,this.headers=new Headers(r),this.schemaName=i,this.urlLengthLimit=a;const l=s??globalThis.fetch;o!==void 0&&o>0?this.fetch=(c,d)=>{const h=new AbortController,f=setTimeout(()=>h.abort(),o),u=d==null?void 0:d.signal;if(u){if(u.aborted)return clearTimeout(f),l(c,d);const g=()=>{clearTimeout(f),h.abort()};return u.addEventListener("abort",g,{once:!0}),l(c,It(It({},d),{},{signal:h.signal})).finally(()=>{clearTimeout(f),u.removeEventListener("abort",g)})}return l(c,It(It({},d),{},{signal:h.signal})).finally(()=>clearTimeout(f))}:this.fetch=l}from(e){if(!e||typeof e!="string"||e.trim()==="")throw new Error("Invalid relation name: relation must be a non-empty string.");return new Ri(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit})}schema(e){return new Mn(this.url,{headers:this.headers,schema:e,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit})}rpc(e,r={},{head:i=!1,get:s=!1,count:o}={}){var a;let l;const c=new URL(`${this.url}/rpc/${e}`);let d;const h=g=>g!==null&&typeof g=="object"&&(!Array.isArray(g)||g.some(h)),f=i&&Object.values(r).some(h);f?(l="POST",d=r):i||s?(l=i?"HEAD":"GET",Object.entries(r).filter(([g,y])=>y!==void 0).map(([g,y])=>[g,Array.isArray(y)?`{${y.join(",")}}`:`${y}`]).forEach(([g,y])=>{c.searchParams.append(g,y)})):(l="POST",d=r);const u=new Headers(this.headers);return f?u.set("Prefer",o?`count=${o},return=minimal`:"return=minimal"):o&&u.set("Prefer",`count=${o}`),new et({method:l,url:c,headers:u,schema:this.schemaName,body:d,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch,urlLengthLimit:this.urlLengthLimit})}};class Li{constructor(){}static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};const r=globalThis.process;if(r){const i=r.versions;if(i&&i.node){const s=i.node,o=parseInt(s.replace(/^v/,"").split(".")[0]);return o>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${o} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${o} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let r=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(r+=`

Suggested solution: ${e.workaround}`),new Error(r)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return e.type==="native"||e.type==="ws"}catch{return!1}}}const Bi="2.100.1",Mi=`realtime-js/${Bi}`,$i="1.0.0",$n="2.0.0",Fi=$n,zi=1e4,Ui=100,Pe={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},Fn={close:"phx_close",error:"phx_error",join:"phx_join",leave:"phx_leave",access_token:"access_token"},mr={connecting:"connecting",closing:"closing",closed:"closed"};class Ji{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT="broadcast",this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,r){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event=="string")return r(this._binaryEncodeUserBroadcastPush(e));let i=[e.join_ref,e.ref,e.topic,e.event,e.payload];return r(JSON.stringify(i))}_binaryEncodeUserBroadcastPush(e){var r;return this._isArrayBuffer((r=e.payload)===null||r===void 0?void 0:r.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){var r,i;const s=(i=(r=e.payload)===null||r===void 0?void 0:r.payload)!==null&&i!==void 0?i:new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,s)}_encodeJsonUserBroadcastPush(e){var r,i;const s=(i=(r=e.payload)===null||r===void 0?void 0:r.payload)!==null&&i!==void 0?i:{},a=new TextEncoder().encode(JSON.stringify(s)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,a)}_encodeUserBroadcastPush(e,r,i){var s,o;const a=e.topic,l=(s=e.ref)!==null&&s!==void 0?s:"",c=(o=e.join_ref)!==null&&o!==void 0?o:"",d=e.payload.event,h=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},f=Object.keys(h).length===0?"":JSON.stringify(h);if(c.length>255)throw new Error(`joinRef length ${c.length} exceeds maximum of 255`);if(l.length>255)throw new Error(`ref length ${l.length} exceeds maximum of 255`);if(a.length>255)throw new Error(`topic length ${a.length} exceeds maximum of 255`);if(d.length>255)throw new Error(`userEvent length ${d.length} exceeds maximum of 255`);if(f.length>255)throw new Error(`metadata length ${f.length} exceeds maximum of 255`);const u=this.USER_BROADCAST_PUSH_META_LENGTH+c.length+l.length+a.length+d.length+f.length,g=new ArrayBuffer(this.HEADER_LENGTH+u);let y=new DataView(g),m=0;y.setUint8(m++,this.KINDS.userBroadcastPush),y.setUint8(m++,c.length),y.setUint8(m++,l.length),y.setUint8(m++,a.length),y.setUint8(m++,d.length),y.setUint8(m++,f.length),y.setUint8(m++,r),Array.from(c,x=>y.setUint8(m++,x.charCodeAt(0))),Array.from(l,x=>y.setUint8(m++,x.charCodeAt(0))),Array.from(a,x=>y.setUint8(m++,x.charCodeAt(0))),Array.from(d,x=>y.setUint8(m++,x.charCodeAt(0))),Array.from(f,x=>y.setUint8(m++,x.charCodeAt(0)));var b=new Uint8Array(g.byteLength+i.byteLength);return b.set(new Uint8Array(g),0),b.set(new Uint8Array(i),g.byteLength),b.buffer}decode(e,r){if(this._isArrayBuffer(e)){let i=this._binaryDecode(e);return r(i)}if(typeof e=="string"){const i=JSON.parse(e),[s,o,a,l,c]=i;return r({join_ref:s,ref:o,topic:a,event:l,payload:c})}return r({})}_binaryDecode(e){const r=new DataView(e),i=r.getUint8(0),s=new TextDecoder;switch(i){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(e,r,s)}}_decodeUserBroadcast(e,r,i){const s=r.getUint8(1),o=r.getUint8(2),a=r.getUint8(3),l=r.getUint8(4);let c=this.HEADER_LENGTH+4;const d=i.decode(e.slice(c,c+s));c=c+s;const h=i.decode(e.slice(c,c+o));c=c+o;const f=i.decode(e.slice(c,c+a));c=c+a;const u=e.slice(c,e.byteLength),g=l===this.JSON_ENCODING?JSON.parse(i.decode(u)):u,y={type:this.BROADCAST_EVENT,event:h,payload:g};return a>0&&(y.meta=JSON.parse(f)),{join_ref:null,ref:null,topic:d,event:this.BROADCAST_EVENT,payload:y}}_isArrayBuffer(e){var r;return e instanceof ArrayBuffer||((r=e==null?void 0:e.constructor)===null||r===void 0?void 0:r.name)==="ArrayBuffer"}_pick(e,r){return!e||typeof e!="object"?{}:Object.fromEntries(Object.entries(e).filter(([i])=>r.includes(i)))}}var te;(function(t){t.abstime="abstime",t.bool="bool",t.date="date",t.daterange="daterange",t.float4="float4",t.float8="float8",t.int2="int2",t.int4="int4",t.int4range="int4range",t.int8="int8",t.int8range="int8range",t.json="json",t.jsonb="jsonb",t.money="money",t.numeric="numeric",t.oid="oid",t.reltime="reltime",t.text="text",t.time="time",t.timestamp="timestamp",t.timestamptz="timestamptz",t.timetz="timetz",t.tsrange="tsrange",t.tstzrange="tstzrange"})(te||(te={}));const Jr=(t,e,r={})=>{var i;const s=(i=r.skipTypes)!==null&&i!==void 0?i:[];return e?Object.keys(e).reduce((o,a)=>(o[a]=Gi(a,t,e,s),o),{}):{}},Gi=(t,e,r,i)=>{const s=e.find(l=>l.name===t),o=s==null?void 0:s.type,a=r[t];return o&&!i.includes(o)?zn(o,a):yr(a)},zn=(t,e)=>{if(t.charAt(0)==="_"){const r=t.slice(1,t.length);return Xi(e,r)}switch(t){case te.bool:return Vi(e);case te.float4:case te.float8:case te.int2:case te.int4:case te.int8:case te.numeric:case te.oid:return qi(e);case te.json:case te.jsonb:return Ki(e);case te.timestamp:return Yi(e);case te.abstime:case te.date:case te.daterange:case te.int4range:case te.int8range:case te.money:case te.reltime:case te.text:case te.time:case te.timestamptz:case te.timetz:case te.tsrange:case te.tstzrange:return yr(e);default:return yr(e)}},yr=t=>t,Vi=t=>{switch(t){case"t":return!0;case"f":return!1;default:return t}},qi=t=>{if(typeof t=="string"){const e=parseFloat(t);if(!Number.isNaN(e))return e}return t},Ki=t=>{if(typeof t=="string")try{return JSON.parse(t)}catch{return t}return t},Xi=(t,e)=>{if(typeof t!="string")return t;const r=t.length-1,i=t[r];if(t[0]==="{"&&i==="}"){let o;const a=t.slice(1,r);try{o=JSON.parse("["+a+"]")}catch{o=a?a.split(","):[]}return o.map(l=>zn(e,l))}return t},Yi=t=>typeof t=="string"?t.replace(" ","T"):t,Un=t=>{const e=new URL(t);return e.protocol=e.protocol.replace(/^ws/i,"http"),e.pathname=e.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),e.pathname===""||e.pathname==="/"?e.pathname="/api/broadcast":e.pathname=e.pathname+"/api/broadcast",e.href};var pt=t=>typeof t=="function"?t:function(){return t},Zi=typeof self<"u"?self:null,tt=typeof window<"u"?window:null,ke=Zi||tt||globalThis,Qi="2.0.0",es=1e4,ts=1e3,je={connecting:0,open:1,closing:2,closed:3},pe={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},He={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},vr={longpoll:"longpoll",websocket:"websocket"},rs={complete:4},br="base64url.bearer.phx.",Et=class{constructor(t,e,r,i){this.channel=t,this.event=e,this.payload=r||function(){return{}},this.receivedResp=null,this.timeout=i,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(t){this.timeout=t,this.reset(),this.send()}send(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(t,e){return this.hasReceived(t)&&e(this.receivedResp.response),this.recHooks.push({status:t,callback:e}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:t,response:e,_ref:r}){this.recHooks.filter(i=>i.status===t).forEach(i=>i.callback(e))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,t=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=t,this.matchReceive(t)}),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}hasReceived(t){return this.receivedResp&&this.receivedResp.status===t}trigger(t,e){this.channel.trigger(this.refEvent,{status:t,response:e})}},Jn=class{constructor(t,e){this.callback=t,this.timerCalc=e,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}},ns=class{constructor(t,e,r){this.state=pe.closed,this.topic=t,this.params=pt(e||{}),this.socket=r,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new Et(this,He.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new Jn(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive("ok",()=>{this.state=pe.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(i=>i.send()),this.pushBuffer=[]}),this.joinPush.receive("error",i=>{this.state=pe.errored,this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,i),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log("channel",`close ${this.topic}`),this.state=pe.closed,this.socket.remove(this)}),this.onError(i=>{this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,i),this.isJoining()&&this.joinPush.reset(),this.state=pe.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",()=>{this.socket.hasLogger()&&this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),new Et(this,He.leave,pt({}),this.timeout).send(),this.state=pe.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(He.reply,(i,s)=>{this.trigger(this.replyEventName(s),i)})}join(t=this.timeout){if(this.joinedOnce)throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");return this.timeout=t,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(t=>t.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=pe.closed,this.bindings=[]}onClose(t){this.on(He.close,t)}onError(t){return this.on(He.error,e=>t(e))}on(t,e){let r=this.bindingRef++;return this.bindings.push({event:t,ref:r,callback:e}),r}off(t,e){this.bindings=this.bindings.filter(r=>!(r.event===t&&(typeof e>"u"||e===r.ref)))}canPush(){return this.socket.isConnected()&&this.isJoined()}push(t,e,r=this.timeout){if(e=e||{},!this.joinedOnce)throw new Error(`tried to push '${t}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let i=new Et(this,t,function(){return e},r);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}leave(t=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=pe.leaving;let e=()=>{this.socket.hasLogger()&&this.socket.log("channel",`leave ${this.topic}`),this.trigger(He.close,"leave")},r=new Et(this,He.leave,pt({}),t);return r.receive("ok",()=>e()).receive("timeout",()=>e()),r.send(),this.canPush()||r.trigger("ok",{}),r}onMessage(t,e,r){return e}filterBindings(t,e,r){return!0}isMember(t,e,r,i){return this.topic!==t?!1:i&&i!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log("channel","dropping outdated message",{topic:t,event:e,payload:r,joinRef:i}),!1):!0}joinRef(){return this.joinPush.ref}rejoin(t=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=pe.joining,this.joinPush.resend(t))}trigger(t,e,r,i){let s=this.onMessage(t,e,r,i);if(e&&!s)throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");let o=this.bindings.filter(a=>a.event===t&&this.filterBindings(a,e,r));for(let a=0;a<o.length;a++)o[a].callback(s,r,i||this.joinRef())}replyEventName(t){return`chan_reply_${t}`}isClosed(){return this.state===pe.closed}isErrored(){return this.state===pe.errored}isJoined(){return this.state===pe.joined}isJoining(){return this.state===pe.joining}isLeaving(){return this.state===pe.leaving}},Ft=class{static request(t,e,r,i,s,o,a){if(ke.XDomainRequest){let l=new ke.XDomainRequest;return this.xdomainRequest(l,t,e,i,s,o,a)}else if(ke.XMLHttpRequest){let l=new ke.XMLHttpRequest;return this.xhrRequest(l,t,e,r,i,s,o,a)}else{if(ke.fetch&&ke.AbortController)return this.fetchRequest(t,e,r,i,s,o,a);throw new Error("No suitable XMLHttpRequest implementation found")}}static fetchRequest(t,e,r,i,s,o,a){let l={method:t,headers:r,body:i},c=null;return s&&(c=new AbortController,setTimeout(()=>c.abort(),s),l.signal=c.signal),ke.fetch(e,l).then(d=>d.text()).then(d=>this.parseJSON(d)).then(d=>a&&a(d)).catch(d=>{d.name==="AbortError"&&o?o():a&&a(null)}),c}static xdomainRequest(t,e,r,i,s,o,a){return t.timeout=s,t.open(e,r),t.onload=()=>{let l=this.parseJSON(t.responseText);a&&a(l)},o&&(t.ontimeout=o),t.onprogress=()=>{},t.send(i),t}static xhrRequest(t,e,r,i,s,o,a,l){t.open(e,r,!0),t.timeout=o;for(let[c,d]of Object.entries(i))t.setRequestHeader(c,d);return t.onerror=()=>l&&l(null),t.onreadystatechange=()=>{if(t.readyState===rs.complete&&l){let c=this.parseJSON(t.responseText);l(c)}},a&&(t.ontimeout=a),t.send(s),t}static parseJSON(t){if(!t||t==="")return null;try{return JSON.parse(t)}catch{return console&&console.log("failed to parse JSON response",t),null}}static serialize(t,e){let r=[];for(var i in t){if(!Object.prototype.hasOwnProperty.call(t,i))continue;let s=e?`${e}[${i}]`:i,o=t[i];typeof o=="object"?r.push(this.serialize(o,s)):r.push(encodeURIComponent(s)+"="+encodeURIComponent(o))}return r.join("&")}static appendParams(t,e){if(Object.keys(e).length===0)return t;let r=t.match(/\?/)?"&":"?";return`${t}${r}${this.serialize(e)}`}},is=t=>{let e="",r=new Uint8Array(t),i=r.byteLength;for(let s=0;s<i;s++)e+=String.fromCharCode(r[s]);return btoa(e)},ze=class{constructor(t,e){e&&e.length===2&&e[1].startsWith(br)&&(this.authToken=atob(e[1].slice(br.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(t),this.readyState=je.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(t){return t.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+vr.websocket),"$1/"+vr.longpoll)}endpointURL(){return Ft.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(t,e,r){this.close(t,e,r),this.readyState=je.connecting}ontimeout(){this.onerror("timeout"),this.closeAndRetry(1005,"timeout",!1)}isActive(){return this.readyState===je.open||this.readyState===je.connecting}poll(){const t={Accept:"application/json"};this.authToken&&(t["X-Phoenix-AuthToken"]=this.authToken),this.ajax("GET",t,null,()=>this.ontimeout(),e=>{if(e){var{status:r,token:i,messages:s}=e;if(r===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,"session_gone",!1);return}this.token=i}else r=0;switch(r){case 200:s.forEach(o=>{setTimeout(()=>this.onmessage({data:o}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=je.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,"forbidden",!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,"internal server error",500);break;default:throw new Error(`unhandled poll status ${r}`)}})}send(t){typeof t!="string"&&(t=is(t)),this.currentBatch?this.currentBatch.push(t):this.awaitingBatchAck?this.batchBuffer.push(t):(this.currentBatch=[t],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(t){this.awaitingBatchAck=!0,this.ajax("POST",{"Content-Type":"application/x-ndjson"},t.join(`
`),()=>this.onerror("timeout"),e=>{this.awaitingBatchAck=!1,!e||e.status!==200?(this.onerror(e&&e.status),this.closeAndRetry(1011,"internal server error",!1)):this.batchBuffer.length>0&&(this.batchSend(this.batchBuffer),this.batchBuffer=[])})}close(t,e,r){for(let s of this.reqs)s.abort();this.readyState=je.closed;let i=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:t,reason:e,wasClean:r});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<"u"?this.onclose(new CloseEvent("close",i)):this.onclose(i)}ajax(t,e,r,i,s){let o,a=()=>{this.reqs.delete(o),i()};o=Ft.request(t,this.endpointURL(),e,r,this.timeout,a,l=>{this.reqs.delete(o),this.isActive()&&s(l)}),this.reqs.add(o)}},ss=class ht{constructor(e,r={}){let i=r.events||{state:"presence_state",diff:"presence_diff"};this.state={},this.pendingDiffs=[],this.channel=e,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(i.state,s=>{let{onJoin:o,onLeave:a,onSync:l}=this.caller;this.joinRef=this.channel.joinRef(),this.state=ht.syncState(this.state,s,o,a),this.pendingDiffs.forEach(c=>{this.state=ht.syncDiff(this.state,c,o,a)}),this.pendingDiffs=[],l()}),this.channel.on(i.diff,s=>{let{onJoin:o,onLeave:a,onSync:l}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(s):(this.state=ht.syncDiff(this.state,s,o,a),l())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(e){return ht.list(this.state,e)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,r,i,s){let o=this.clone(e),a={},l={};return this.map(o,(c,d)=>{r[c]||(l[c]=d)}),this.map(r,(c,d)=>{let h=o[c];if(h){let f=d.metas.map(m=>m.phx_ref),u=h.metas.map(m=>m.phx_ref),g=d.metas.filter(m=>u.indexOf(m.phx_ref)<0),y=h.metas.filter(m=>f.indexOf(m.phx_ref)<0);g.length>0&&(a[c]=d,a[c].metas=g),y.length>0&&(l[c]=this.clone(h),l[c].metas=y)}else a[c]=d}),this.syncDiff(o,{joins:a,leaves:l},i,s)}static syncDiff(e,r,i,s){let{joins:o,leaves:a}=this.clone(r);return i||(i=function(){}),s||(s=function(){}),this.map(o,(l,c)=>{let d=e[l];if(e[l]=this.clone(c),d){let h=e[l].metas.map(u=>u.phx_ref),f=d.metas.filter(u=>h.indexOf(u.phx_ref)<0);e[l].metas.unshift(...f)}i(l,d,c)}),this.map(a,(l,c)=>{let d=e[l];if(!d)return;let h=c.metas.map(f=>f.phx_ref);d.metas=d.metas.filter(f=>h.indexOf(f.phx_ref)<0),s(l,d,c),d.metas.length===0&&delete e[l]}),e}static list(e,r){return r||(r=function(i,s){return s}),this.map(e,(i,s)=>r(i,s))}static map(e,r){return Object.getOwnPropertyNames(e).map(i=>r(i,e[i]))}static clone(e){return JSON.parse(JSON.stringify(e))}},Pt={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(t,e){if(t.payload.constructor===ArrayBuffer)return e(this.binaryEncode(t));{let r=[t.join_ref,t.ref,t.topic,t.event,t.payload];return e(JSON.stringify(r))}},decode(t,e){if(t.constructor===ArrayBuffer)return e(this.binaryDecode(t));{let[r,i,s,o,a]=JSON.parse(t);return e({join_ref:r,ref:i,topic:s,event:o,payload:a})}},binaryEncode(t){let{join_ref:e,ref:r,event:i,topic:s,payload:o}=t,a=this.META_LENGTH+e.length+r.length+s.length+i.length,l=new ArrayBuffer(this.HEADER_LENGTH+a),c=new DataView(l),d=0;c.setUint8(d++,this.KINDS.push),c.setUint8(d++,e.length),c.setUint8(d++,r.length),c.setUint8(d++,s.length),c.setUint8(d++,i.length),Array.from(e,f=>c.setUint8(d++,f.charCodeAt(0))),Array.from(r,f=>c.setUint8(d++,f.charCodeAt(0))),Array.from(s,f=>c.setUint8(d++,f.charCodeAt(0))),Array.from(i,f=>c.setUint8(d++,f.charCodeAt(0)));var h=new Uint8Array(l.byteLength+o.byteLength);return h.set(new Uint8Array(l),0),h.set(new Uint8Array(o),l.byteLength),h.buffer},binaryDecode(t){let e=new DataView(t),r=e.getUint8(0),i=new TextDecoder;switch(r){case this.KINDS.push:return this.decodePush(t,e,i);case this.KINDS.reply:return this.decodeReply(t,e,i);case this.KINDS.broadcast:return this.decodeBroadcast(t,e,i)}},decodePush(t,e,r){let i=e.getUint8(1),s=e.getUint8(2),o=e.getUint8(3),a=this.HEADER_LENGTH+this.META_LENGTH-1,l=r.decode(t.slice(a,a+i));a=a+i;let c=r.decode(t.slice(a,a+s));a=a+s;let d=r.decode(t.slice(a,a+o));a=a+o;let h=t.slice(a,t.byteLength);return{join_ref:l,ref:null,topic:c,event:d,payload:h}},decodeReply(t,e,r){let i=e.getUint8(1),s=e.getUint8(2),o=e.getUint8(3),a=e.getUint8(4),l=this.HEADER_LENGTH+this.META_LENGTH,c=r.decode(t.slice(l,l+i));l=l+i;let d=r.decode(t.slice(l,l+s));l=l+s;let h=r.decode(t.slice(l,l+o));l=l+o;let f=r.decode(t.slice(l,l+a));l=l+a;let u=t.slice(l,t.byteLength),g={status:f,response:u};return{join_ref:c,ref:d,topic:h,event:He.reply,payload:g}},decodeBroadcast(t,e,r){let i=e.getUint8(1),s=e.getUint8(2),o=this.HEADER_LENGTH+2,a=r.decode(t.slice(o,o+i));o=o+i;let l=r.decode(t.slice(o,o+s));o=o+s;let c=t.slice(o,t.byteLength);return{join_ref:null,ref:null,topic:a,event:l,payload:c}}},os=class{constructor(t,e={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=e.timeout||es,this.transport=e.transport||ke.WebSocket||ze,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=e.longPollFallbackMs,this.fallbackTimer=null,this.sessionStore=e.sessionStorage||ke&&ke.sessionStorage,this.establishedConnections=0,this.defaultEncoder=Pt.encode.bind(Pt),this.defaultDecoder=Pt.decode.bind(Pt),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=e.binaryType||"arraybuffer",this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport!==ze?(this.encode=e.encode||this.defaultEncoder,this.decode=e.decode||this.defaultDecoder):(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder);let r=null;tt&&tt.addEventListener&&(tt.addEventListener("pagehide",i=>{this.conn&&(this.disconnect(),r=this.connectClock)}),tt.addEventListener("pageshow",i=>{r===this.connectClock&&(r=null,this.connect())}),tt.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=e.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=e.autoSendHeartbeat??!0,this.heartbeatCallback=e.heartbeatCallback??(()=>{}),this.rejoinAfterMs=i=>e.rejoinAfterMs?e.rejoinAfterMs(i):[1e3,2e3,5e3][i-1]||1e4,this.reconnectAfterMs=i=>e.reconnectAfterMs?e.reconnectAfterMs(i):[10,50,100,150,200,250,500,1e3,2e3][i-1]||5e3,this.logger=e.logger||null,!this.logger&&e.debug&&(this.logger=(i,s,o)=>{console.log(`${i}: ${s}`,o)}),this.longpollerTimeout=e.longpollerTimeout||2e4,this.params=pt(e.params||{}),this.endPoint=`${t}/${vr.websocket}`,this.vsn=e.vsn||Qi,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new Jn(()=>{if(this.pageHidden){this.log("Not reconnecting as page is hidden!"),this.teardown();return}this.teardown(async()=>{e.beforeReconnect&&await e.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=e.authToken}getLongPollTransport(){return ze}replaceTransport(t){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&(this.conn.close(),this.conn=null),this.transport=t}protocol(){return location.protocol.match(/^https/)?"wss":"ws"}endPointURL(){let t=Ft.appendParams(Ft.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return t.charAt(0)!=="/"?t:t.charAt(1)==="/"?`${this.protocol()}:${t}`:`${this.protocol()}://${location.host}${t}`}disconnect(t,e,r){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,t&&t()},e,r)}connect(t){t&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=pt(t)),!(this.conn&&!this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==ze?this.connectWithFallback(ze,this.longPollFallbackMs):this.transportConnect())}log(t,e,r){this.logger&&this.logger(t,e,r)}hasLogger(){return this.logger!==null}onOpen(t){let e=this.makeRef();return this.stateChangeCallbacks.open.push([e,t]),e}onClose(t){let e=this.makeRef();return this.stateChangeCallbacks.close.push([e,t]),e}onError(t){let e=this.makeRef();return this.stateChangeCallbacks.error.push([e,t]),e}onMessage(t){let e=this.makeRef();return this.stateChangeCallbacks.message.push([e,t]),e}onHeartbeat(t){this.heartbeatCallback=t}ping(t){if(!this.isConnected())return!1;let e=this.makeRef(),r=Date.now();this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:e});let i=this.onMessage(s=>{s.ref===e&&(this.off([i]),t(Date.now()-r))});return!0}transportName(t){switch(t){case ze:return"LongPoll";default:return t.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let t;this.authToken&&(t=["phoenix",`${br}${btoa(this.authToken).replace(/=/g,"")}`]),this.conn=new this.transport(this.endPointURL(),t),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(t){return this.sessionStore&&this.sessionStore.getItem(t)}storeSession(t,e){this.sessionStore&&this.sessionStore.setItem(t,e)}connectWithFallback(t,e=2500){clearTimeout(this.fallbackTimer);let r=!1,i=!0,s,o,a=this.transportName(t),l=c=>{this.log("transport",`falling back to ${a}...`,c),this.off([s,o]),i=!1,this.replaceTransport(t),this.transportConnect()};if(this.getSession(`phx:fallback:${a}`))return l("memorized");this.fallbackTimer=setTimeout(l,e),o=this.onError(c=>{this.log("transport","error",c),i&&!r&&(clearTimeout(this.fallbackTimer),l(c))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(r=!0,!i){let c=this.transportName(t);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${c}`,"true"),this.log("transport",`established ${c} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(l,e),this.ping(c=>{this.log("transport","connected to primary after",c),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log("transport",`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks("open")}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(t){this.log("error","error in heartbeat callback",t)}this.triggerChanError(),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),ts,"heartbeat timeout")}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(t,e,r){if(!this.conn)return t&&t();const i=this.conn;this.waitForBufferDone(i,()=>{e?i.close(e,r||""):i.close(),this.waitForSocketClosed(i,()=>{this.conn===i&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),t&&t()})})}waitForBufferDone(t,e,r=1){if(r===5||!t.bufferedAmount){e();return}setTimeout(()=>{this.waitForBufferDone(t,e,r+1)},150*r)}waitForSocketClosed(t,e,r=1){if(r===5||t.readyState===je.closed){e();return}setTimeout(()=>{this.waitForSocketClosed(t,e,r+1)},150*r)}onConnClose(t){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log("transport","close",t),this.triggerChanError(),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks("close",t)}onConnError(t){this.hasLogger()&&this.log("transport",t);let e=this.transport,r=this.establishedConnections;this.triggerStateCallbacks("error",t,e,r),(e===this.transport||r>0)&&this.triggerChanError()}triggerChanError(){this.channels.forEach(t=>{t.isErrored()||t.isLeaving()||t.isClosed()||t.trigger(He.error)})}connectionState(){switch(this.conn&&this.conn.readyState){case je.connecting:return"connecting";case je.open:return"open";case je.closing:return"closing";default:return"closed"}}isConnected(){return this.connectionState()==="open"}remove(t){this.off(t.stateChangeRefs),this.channels=this.channels.filter(e=>e!==t)}off(t){for(let e in this.stateChangeCallbacks)this.stateChangeCallbacks[e]=this.stateChangeCallbacks[e].filter(([r])=>t.indexOf(r)===-1)}channel(t,e={}){let r=new ns(t,e,this);return this.channels.push(r),r}push(t){if(this.hasLogger()){let{topic:e,event:r,payload:i,ref:s,join_ref:o}=t;this.log("push",`${e} ${r} (${o}, ${s})`,i)}this.isConnected()?this.encode(t,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(t,e=>this.conn.send(e)))}makeRef(){let t=this.ref+1;return t===this.ref?this.ref=0:this.ref=t,this.ref.toString()}sendHeartbeat(){if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(t){this.log("error","error in heartbeat callback",t)}return}if(this.pendingHeartbeatRef){this.heartbeatTimeout();return}this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(t){this.log("error","error in heartbeat callback",t)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(t=>t()),this.sendBuffer=[])}onConnMessage(t){this.decode(t.data,e=>{let{topic:r,event:i,payload:s,ref:o,join_ref:a}=e;if(o&&o===this.pendingHeartbeatRef){const l=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(s.status==="ok"?"ok":"error",l)}catch(c){this.log("error","error in heartbeat callback",c)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log("receive",`${s.status||""} ${r} ${i} ${o&&"("+o+")"||""}`.trim(),s);for(let l=0;l<this.channels.length;l++){const c=this.channels[l];c.isMember(r,i,s,a)&&c.trigger(i,s,o,a)}this.triggerStateCallbacks("message",e)})}triggerStateCallbacks(t,...e){try{this.stateChangeCallbacks[t].forEach(([r,i])=>{try{i(...e)}catch(s){this.log("error",`error in ${t} callback`,s)}})}catch(r){this.log("error",`error triggering ${t} callbacks`,r)}}leaveOpenTopic(t){let e=this.channels.find(r=>r.topic===t&&(r.isJoined()||r.isJoining()));e&&(this.hasLogger()&&this.log("transport",`leaving duplicate topic "${t}"`),e.leave())}};class ft{constructor(e,r){const i=ls(r);this.presence=new ss(e.getChannel(),i),this.presence.onJoin((s,o,a)=>{const l=ft.onJoinPayload(s,o,a);e.getChannel().trigger("presence",l)}),this.presence.onLeave((s,o,a)=>{const l=ft.onLeavePayload(s,o,a);e.getChannel().trigger("presence",l)}),this.presence.onSync(()=>{e.getChannel().trigger("presence",{event:"sync"})})}get state(){return ft.transformState(this.presence.state)}static transformState(e){return e=as(e),Object.getOwnPropertyNames(e).reduce((r,i)=>{const s=e[i];return r[i]=$t(s),r},{})}static onJoinPayload(e,r,i){const s=Gr(r),o=$t(i);return{event:"join",key:e,currentPresences:s,newPresences:o}}static onLeavePayload(e,r,i){const s=Gr(r),o=$t(i);return{event:"leave",key:e,currentPresences:s,leftPresences:o}}}function $t(t){return t.metas.map(e=>(e.presence_ref=e.phx_ref,delete e.phx_ref,delete e.phx_ref_prev,e))}function as(t){return JSON.parse(JSON.stringify(t))}function ls(t){return(t==null?void 0:t.events)&&{events:t.events}}function Gr(t){return t!=null&&t.metas?$t(t):[]}var Vr;(function(t){t.SYNC="sync",t.JOIN="join",t.LEAVE="leave"})(Vr||(Vr={}));class cs{get state(){return this.presenceAdapter.state}constructor(e,r){this.channel=e,this.presenceAdapter=new ft(this.channel.channelAdapter,r)}}class ds{constructor(e,r,i){const s=hs(i);this.channel=e.getSocket().channel(r,s),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,r){return this.channel.on(e,r)}off(e,r){this.channel.off(e,r)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,r,i){let s;try{s=this.channel.push(e,r,i)}catch{throw`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`}if(this.channel.pushBuffer.length>Ui){const o=this.channel.pushBuffer.shift();o.cancelTimeout(),this.socket.log("channel",`discarded push due to buffer overflow: ${o.event}`,o.payload())}return s}updateJoinPayload(e){const r=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},r),e)}canPush(){return this.socket.isConnected()&&this.state===Pe.joined}isJoined(){return this.state===Pe.joined}isJoining(){return this.state===Pe.joining}isClosed(){return this.state===Pe.closed}isLeaving(){return this.state===Pe.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}}function hs(t){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},t.config)}}var qr;(function(t){t.ALL="*",t.INSERT="INSERT",t.UPDATE="UPDATE",t.DELETE="DELETE"})(qr||(qr={}));var gt;(function(t){t.BROADCAST="broadcast",t.PRESENCE="presence",t.POSTGRES_CHANGES="postgres_changes",t.SYSTEM="system"})(gt||(gt={}));var Ie;(function(t){t.SUBSCRIBED="SUBSCRIBED",t.TIMED_OUT="TIMED_OUT",t.CLOSED="CLOSED",t.CHANNEL_ERROR="CHANNEL_ERROR"})(Ie||(Ie={}));class xt{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,r={config:{}},i){var s,o;if(this.topic=e,this.params=r,this.socket=i,this.bindings={},this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},r.config),this.channelAdapter=new ds(this.socket.socketAdapter,e,this.params),this.presence=new cs(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=Un(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&(!((o=(s=this.params.config)===null||s===void 0?void 0:s.broadcast)===null||o===void 0)&&o.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,r=this.timeout){var i,s,o;if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){const{config:{broadcast:a,presence:l,private:c}}=this.params,d=(s=(i=this.bindings.postgres_changes)===null||i===void 0?void 0:i.map(g=>g.filter))!==null&&s!==void 0?s:[],h=!!this.bindings[gt.PRESENCE]&&this.bindings[gt.PRESENCE].length>0||((o=this.params.config.presence)===null||o===void 0?void 0:o.enabled)===!0,f={},u={broadcast:a,presence:Object.assign(Object.assign({},l),{enabled:h}),postgres_changes:d,private:c};this.socket.accessTokenValue&&(f.access_token=this.socket.accessTokenValue),this._onError(g=>{e==null||e(Ie.CHANNEL_ERROR,g)}),this._onClose(()=>e==null?void 0:e(Ie.CLOSED)),this.updateJoinPayload(Object.assign({config:u},f)),this._updateFilterMessage(),this.channelAdapter.subscribe(r).receive("ok",async({postgres_changes:g})=>{if(this.socket._isManualToken()||this.socket.setAuth(),g===void 0){e==null||e(Ie.SUBSCRIBED);return}this._updatePostgresBindings(g,e)}).receive("error",g=>{this.state=Pe.errored,e==null||e(Ie.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(g).join(", ")||"error")))}).receive("timeout",()=>{e==null||e(Ie.TIMED_OUT)})}return this}_updatePostgresBindings(e,r){var i;const s=this.bindings.postgres_changes,o=(i=s==null?void 0:s.length)!==null&&i!==void 0?i:0,a=[];for(let l=0;l<o;l++){const c=s[l],{filter:{event:d,schema:h,table:f,filter:u}}=c,g=e&&e[l];if(g&&g.event===d&&xt.isFilterValueEqual(g.schema,h)&&xt.isFilterValueEqual(g.table,f)&&xt.isFilterValueEqual(g.filter,u))a.push(Object.assign(Object.assign({},c),{id:g.id}));else{this.unsubscribe(),this.state=Pe.errored,r==null||r(Ie.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=a,this.state!=Pe.errored&&r&&r(Ie.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,r={}){return await this.send({type:"presence",event:"track",payload:e},r.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,r,i){if(this.channelAdapter.isJoined()&&e===gt.PRESENCE)throw this.socket.log("channel",`cannot add presence callbacks for ${this.topic} after joining.`),new Error("cannot add presence callbacks after joining a channel");return this._on(e,r,i)}async httpSend(e,r,i={}){var s;if(r==null)return Promise.reject("Payload is required for httpSend()");const o={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"};this.socket.accessTokenValue&&(o.Authorization=`Bearer ${this.socket.accessTokenValue}`);const a={method:"POST",headers:o,body:JSON.stringify({messages:[{topic:this.subTopic,event:e,payload:r,private:this.private}]})},l=await this._fetchWithTimeout(this.broadcastEndpointURL,a,(s=i.timeout)!==null&&s!==void 0?s:this.timeout);if(l.status===202)return{success:!0};let c=l.statusText;try{const d=await l.json();c=d.error||d.message||c}catch{}return Promise.reject(new Error(c))}async send(e,r={}){var i,s;if(!this.channelAdapter.canPush()&&e.type==="broadcast"){console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:o,payload:a}=e,l={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"};this.socket.accessTokenValue&&(l.Authorization=`Bearer ${this.socket.accessTokenValue}`);const c={method:"POST",headers:l,body:JSON.stringify({messages:[{topic:this.subTopic,event:o,payload:a,private:this.private}]})};try{const d=await this._fetchWithTimeout(this.broadcastEndpointURL,c,(i=r.timeout)!==null&&i!==void 0?i:this.timeout);return await((s=d.body)===null||s===void 0?void 0:s.cancel()),d.ok?"ok":"error"}catch(d){return d.name==="AbortError"?"timed out":"error"}}else return new Promise(o=>{var a,l,c;const d=this.channelAdapter.push(e.type,e,r.timeout||this.timeout);e.type==="broadcast"&&!(!((c=(l=(a=this.params)===null||a===void 0?void 0:a.config)===null||l===void 0?void 0:l.broadcast)===null||c===void 0)&&c.ack)&&o("ok"),d.receive("ok",()=>o("ok")),d.receive("error",()=>o("error")),d.receive("timeout",()=>o("timed out"))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(r=>{this.channelAdapter.unsubscribe(e).receive("ok",()=>r("ok")).receive("timeout",()=>r("timed out")).receive("error",()=>r("error"))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,r,i){const s=new AbortController,o=setTimeout(()=>s.abort(),i),a=await this.socket.fetch(e,Object.assign(Object.assign({},r),{signal:s.signal}));return clearTimeout(o),a}_on(e,r,i){const s=e.toLocaleLowerCase(),o=this.channelAdapter.on(e,i),a={type:s,filter:r,callback:i,ref:o};return this.bindings[s]?this.bindings[s].push(a):this.bindings[s]=[a],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,r,i)=>{var s,o,a,l,c,d,h;const f=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(f,i))return!1;const u=(s=this.bindings[f])===null||s===void 0?void 0:s.find(g=>g.ref===e.ref);if(!u)return!0;if(["broadcast","presence","postgres_changes"].includes(f))if("id"in u){const g=u.id,y=(o=u.filter)===null||o===void 0?void 0:o.event;return g&&((a=r.ids)===null||a===void 0?void 0:a.includes(g))&&(y==="*"||(y==null?void 0:y.toLocaleLowerCase())===((l=r.data)===null||l===void 0?void 0:l.type.toLocaleLowerCase()))}else{const g=(d=(c=u==null?void 0:u.filter)===null||c===void 0?void 0:c.event)===null||d===void 0?void 0:d.toLocaleLowerCase();return g==="*"||g===((h=r==null?void 0:r.event)===null||h===void 0?void 0:h.toLocaleLowerCase())}else return u.type.toLocaleLowerCase()===f})}_notThisChannelEvent(e,r){const{close:i,error:s,leave:o,join:a}=Fn;return r&&[i,s,o,a].includes(e)&&r!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,r,i)=>{if(typeof r=="object"&&"ids"in r){const s=r.data,{schema:o,table:a,commit_timestamp:l,type:c,errors:d}=s;return Object.assign(Object.assign({},{schema:o,table:a,commit_timestamp:l,eventType:c,new:{},old:{},errors:d}),this._getPayloadRecords(s))}return r})}static isFilterValueEqual(e,r){return(e??void 0)===(r??void 0)}_getPayloadRecords(e){const r={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(r.new=Jr(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(r.old=Jr(e.columns,e.old_record)),r}}class us{constructor(e,r){this.socket=new os(e,r)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,r,i,s=1e4){return new Promise(o=>{setTimeout(()=>o("timeout"),s),this.socket.disconnect(()=>{e(),o("ok")},r,i)})}push(e){this.socket.push(e)}log(e,r,i){this.socket.log(e,r,i)}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==mr.connecting}isDisconnecting(){return this.socket.connectionState()==mr.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}}const ps={HEARTBEAT_INTERVAL:25e3},fs=[1e3,2e3,5e3,1e4],gs=1e4,xs=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class ms{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,r){var i;if(this.channels=new Array,this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint="",this.headers={},this.params={},this.ref=0,this.serializer=new Ji,this._manuallySetToken=!1,this._authPromise=null,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._resolveFetch=o=>o?(...a)=>o(...a):(...a)=>fetch(...a),!(!((i=r==null?void 0:r.params)===null||i===void 0)&&i.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=r.params.apikey;const s=this._initializeOptions(r);this.socketAdapter=new us(e,s),this.httpEndpoint=Un(e),this.fetch=this._resolveFetch(r==null?void 0:r.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely("connect"),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){const r=e.message;throw r.includes("Node.js")?new Error(`${r}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${r}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,r){return this.isDisconnecting()?"ok":await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,r)}getChannels(){return this.channels}async removeChannel(e){const r=await e.unsubscribe();return r==="ok"&&e.teardown(),this.channels.length===0&&this.disconnect(),r}async removeAllChannels(){const e=this.channels.map(async i=>{const s=await i.unsubscribe();return i.teardown(),s}),r=await Promise.all(e);return this.disconnect(),r}log(e,r,i){this.socketAdapter.log(e,r,i)}connectionState(){return this.socketAdapter.connectionState()||mr.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,r={config:{}}){const i=`realtime:${e}`,s=this.getChannels().find(o=>o.topic===i);if(s)return s;{const o=new xt(`realtime:${e}`,r,this);return this.channels.push(o),o}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(r=>r.topic!==e.topic)}async _performAuth(e=null){let r,i=!1;if(e)r=e,i=!0;else if(this.accessToken)try{r=await this.accessToken()}catch(s){this.log("error","Error fetching access token from callback",s),r=this.accessTokenValue}else r=this.accessTokenValue;i?this._manuallySetToken=!0:this.accessToken&&(this._manuallySetToken=!1),this.accessTokenValue!=r&&(this.accessTokenValue=r,this.channels.forEach(s=>{const o={access_token:r,version:Mi};r&&s.updateJoinPayload(o),s.joinedOnce&&s.channelAdapter.isJoined()&&s.channelAdapter.push(Fn.access_token,{access_token:r})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this._isManualToken()||this.setAuth().catch(r=>{this.log("error",`Error setting auth in ${e}`,r)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(r=>{this.log("error","error waiting for auth on connect",r)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(r,i)=>{r=="sent"&&this._setAuthSafely(),e&&e(r,i)}}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=r=>{this.log("worker","worker error",r.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=r=>{r.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&(this.log("worker","terminating worker"),this.workerRef.terminate(),this.workerRef=void 0)}_workerObjectUrl(e){let r;if(e)r=e;else{const i=new Blob([xs],{type:"application/javascript"});r=URL.createObjectURL(i)}return r}_initializeOptions(e){var r,i,s,o,a,l,c,d,h;this.worker=(r=e==null?void 0:e.worker)!==null&&r!==void 0?r:!1,this.accessToken=(i=e==null?void 0:e.accessToken)!==null&&i!==void 0?i:null;const f={};f.timeout=(s=e==null?void 0:e.timeout)!==null&&s!==void 0?s:zi,f.heartbeatIntervalMs=(o=e==null?void 0:e.heartbeatIntervalMs)!==null&&o!==void 0?o:ps.HEARTBEAT_INTERVAL,f.transport=(a=e==null?void 0:e.transport)!==null&&a!==void 0?a:Li.getWebSocketConstructor(),f.params=e==null?void 0:e.params,f.logger=e==null?void 0:e.logger,f.heartbeatCallback=this._wrapHeartbeatCallback(e==null?void 0:e.heartbeatCallback),f.reconnectAfterMs=(l=e==null?void 0:e.reconnectAfterMs)!==null&&l!==void 0?l:m=>fs[m-1]||gs;let u,g;const y=(c=e==null?void 0:e.vsn)!==null&&c!==void 0?c:Fi;switch(y){case $i:u=(m,b)=>b(JSON.stringify(m)),g=(m,b)=>b(JSON.parse(m));break;case $n:u=this.serializer.encode.bind(this.serializer),g=this.serializer.decode.bind(this.serializer);break;default:throw new Error(`Unsupported serializer version: ${f.vsn}`)}if(f.vsn=y,f.encode=(d=e==null?void 0:e.encode)!==null&&d!==void 0?d:u,f.decode=(h=e==null?void 0:e.decode)!==null&&h!==void 0?h:g,f.beforeReconnect=this._reconnectAuth.bind(this),(e!=null&&e.logLevel||e!=null&&e.log_level)&&(this.logLevel=e.logLevel||e.log_level,f.params=Object.assign(Object.assign({},f.params),{log_level:this.logLevel})),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e==null?void 0:e.workerUrl,f.autoSendHeartbeat=!this.worker}return f}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}}var vt=class extends Error{constructor(t,e){var r;super(t),this.name="IcebergError",this.status=e.status,this.icebergType=e.icebergType,this.icebergCode=e.icebergCode,this.details=e.details,this.isCommitStateUnknown=e.icebergType==="CommitStateUnknownException"||[500,502,504].includes(e.status)&&((r=e.icebergType)==null?void 0:r.includes("CommitState"))===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function ys(t,e,r){const i=new URL(e,t);if(r)for(const[s,o]of Object.entries(r))o!==void 0&&i.searchParams.set(s,o);return i.toString()}async function vs(t){return!t||t.type==="none"?{}:t.type==="bearer"?{Authorization:`Bearer ${t.token}`}:t.type==="header"?{[t.name]:t.value}:t.type==="custom"?await t.getHeaders():{}}function bs(t){const e=t.fetchImpl??globalThis.fetch;return{async request({method:r,path:i,query:s,body:o,headers:a}){const l=ys(t.baseUrl,i,s),c=await vs(t.auth),d=await e(l,{method:r,headers:{...o?{"Content-Type":"application/json"}:{},...c,...a},body:o?JSON.stringify(o):void 0}),h=await d.text(),f=(d.headers.get("content-type")||"").includes("application/json"),u=f&&h?JSON.parse(h):h;if(!d.ok){const g=f?u:void 0,y=g==null?void 0:g.error;throw new vt((y==null?void 0:y.message)??`Request failed with status ${d.status}`,{status:d.status,icebergType:y==null?void 0:y.type,icebergCode:y==null?void 0:y.code,details:g})}return{status:d.status,headers:d.headers,data:u}}}}function Tt(t){return t.join("")}var Ss=class{constructor(t,e=""){this.client=t,this.prefix=e}async listNamespaces(t){const e=t?{parent:Tt(t.namespace)}:void 0;return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces`,query:e})).data.namespaces.map(i=>({namespace:i}))}async createNamespace(t,e){const r={namespace:t.namespace,properties:e==null?void 0:e.properties};return(await this.client.request({method:"POST",path:`${this.prefix}/namespaces`,body:r})).data}async dropNamespace(t){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${Tt(t.namespace)}`})}async loadNamespaceMetadata(t){return{properties:(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${Tt(t.namespace)}`})).data.properties}}async namespaceExists(t){try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${Tt(t.namespace)}`}),!0}catch(e){if(e instanceof vt&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(t,e){try{return await this.createNamespace(t,e)}catch(r){if(r instanceof vt&&r.status===409)return;throw r}}};function Ue(t){return t.join("")}var ws=class{constructor(t,e="",r){this.client=t,this.prefix=e,this.accessDelegation=r}async listTables(t){return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables`})).data.identifiers}async createTable(t,e){const r={};return this.accessDelegation&&(r["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables`,body:e,headers:r})).data.metadata}async updateTable(t,e){const r=await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables/${t.name}`,body:e});return{"metadata-location":r.data["metadata-location"],metadata:r.data.metadata}}async dropTable(t,e){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables/${t.name}`,query:{purgeRequested:String((e==null?void 0:e.purge)??!1)}})}async loadTable(t){const e={};return this.accessDelegation&&(e["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables/${t.name}`,headers:e})).data.metadata}async tableExists(t){const e={};this.accessDelegation&&(e["X-Iceberg-Access-Delegation"]=this.accessDelegation);try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${Ue(t.namespace)}/tables/${t.name}`,headers:e}),!0}catch(r){if(r instanceof vt&&r.status===404)return!1;throw r}}async createTableIfNotExists(t,e){try{return await this.createTable(t,e)}catch(r){if(r instanceof vt&&r.status===409)return await this.loadTable({namespace:t.namespace,name:e.name});throw r}}},ks=class{constructor(t){var i;let e="v1";t.catalogName&&(e+=`/${t.catalogName}`);const r=t.baseUrl.endsWith("/")?t.baseUrl:`${t.baseUrl}/`;this.client=bs({baseUrl:r,auth:t.auth,fetchImpl:t.fetch}),this.accessDelegation=(i=t.accessDelegation)==null?void 0:i.join(","),this.namespaceOps=new Ss(this.client,e),this.tableOps=new ws(this.client,e,this.accessDelegation)}async listNamespaces(t){return this.namespaceOps.listNamespaces(t)}async createNamespace(t,e){return this.namespaceOps.createNamespace(t,e)}async dropNamespace(t){await this.namespaceOps.dropNamespace(t)}async loadNamespaceMetadata(t){return this.namespaceOps.loadNamespaceMetadata(t)}async listTables(t){return this.tableOps.listTables(t)}async createTable(t,e){return this.tableOps.createTable(t,e)}async updateTable(t,e){return this.tableOps.updateTable(t,e)}async dropTable(t,e){await this.tableOps.dropTable(t,e)}async loadTable(t){return this.tableOps.loadTable(t)}async namespaceExists(t){return this.namespaceOps.namespaceExists(t)}async tableExists(t){return this.tableOps.tableExists(t)}async createNamespaceIfNotExists(t,e){return this.namespaceOps.createNamespaceIfNotExists(t,e)}async createTableIfNotExists(t,e){return this.tableOps.createTableIfNotExists(t,e)}},Kt=class extends Error{constructor(t,e="storage",r,i){super(t),this.__isStorageError=!0,this.namespace=e,this.name=e==="vectors"?"StorageVectorsError":"StorageError",this.status=r,this.statusCode=i}};function Xt(t){return typeof t=="object"&&t!==null&&"__isStorageError"in t}var Sr=class extends Kt{constructor(t,e,r,i="storage"){super(t,i,e,r),this.name=i==="vectors"?"StorageVectorsApiError":"StorageApiError",this.status=e,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}},Gn=class extends Kt{constructor(t,e,r="storage"){super(t,r),this.name=r==="vectors"?"StorageVectorsUnknownError":"StorageUnknownError",this.originalError=e}};const js=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),As=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},wr=t=>{if(Array.isArray(t))return t.map(r=>wr(r));if(typeof t=="function"||t!==Object(t))return t;const e={};return Object.entries(t).forEach(([r,i])=>{const s=r.replace(/([-_][a-z])/gi,o=>o.toUpperCase().replace(/[-_]/g,""));e[s]=wr(i)}),e},_s=t=>!t||typeof t!="string"||t.length===0||t.length>100||t.trim()!==t||t.includes("/")||t.includes("\\")?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(t);function bt(t){"@babel/helpers - typeof";return bt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},bt(t)}function Hs(t,e){if(bt(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e);if(bt(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Is(t){var e=Hs(t,"string");return bt(e)=="symbol"?e:e+""}function Es(t,e,r){return(e=Is(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Kr(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),r.push.apply(r,i)}return r}function U(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?Kr(Object(r),!0).forEach(function(i){Es(t,i,r[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):Kr(Object(r)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(r,i))})}return t}const Xr=t=>{var e;return t.msg||t.message||t.error_description||(typeof t.error=="string"?t.error:(e=t.error)===null||e===void 0?void 0:e.message)||JSON.stringify(t)},Ps=async(t,e,r,i)=>{if(t!==null&&typeof t=="object"&&typeof t.json=="function"){const s=t;let o=parseInt(s.status,10);Number.isFinite(o)||(o=500),s.json().then(a=>{const l=(a==null?void 0:a.statusCode)||(a==null?void 0:a.code)||o+"";e(new Sr(Xr(a),o,l,i))}).catch(()=>{const a=o+"";e(new Sr(s.statusText||`HTTP ${o} error`,o,a,i))})}else e(new Gn(Xr(t),t,i))},Ts=(t,e,r,i)=>{const s={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"||t==="HEAD"||!i?U(U({},s),r):(As(i)?(s.headers=U({"Content-Type":"application/json"},e==null?void 0:e.headers),s.body=JSON.stringify(i)):s.body=i,e!=null&&e.duplex&&(s.duplex=e.duplex),U(U({},s),r))};async function at(t,e,r,i,s,o,a){return new Promise((l,c)=>{t(r,Ts(e,i,s,o)).then(d=>{if(!d.ok)throw d;if(i!=null&&i.noResolveJson)return d;if(a==="vectors"){const h=d.headers.get("content-type");if(d.headers.get("content-length")==="0"||d.status===204)return{};if(!h||!h.includes("application/json"))return{}}return d.json()}).then(d=>l(d)).catch(d=>Ps(d,c,i,a))})}function Vn(t="storage"){return{get:async(e,r,i,s)=>at(e,"GET",r,i,s,void 0,t),post:async(e,r,i,s,o)=>at(e,"POST",r,s,o,i,t),put:async(e,r,i,s,o)=>at(e,"PUT",r,s,o,i,t),head:async(e,r,i,s)=>at(e,"HEAD",r,U(U({},i),{},{noResolveJson:!0}),s,void 0,t),remove:async(e,r,i,s,o)=>at(e,"DELETE",r,s,o,i,t)}}const Cs=Vn("storage"),{get:St,post:be,put:kr,head:Rs,remove:Tr}=Cs,xe=Vn("vectors");var st=class{constructor(t,e={},r,i="storage"){this.shouldThrowOnError=!1,this.url=t,this.headers=e,this.fetch=js(r),this.namespace=i}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(t,e){return this.headers=U(U({},this.headers),{},{[t]:e}),this}async handleOperation(t){var e=this;try{return{data:await t(),error:null}}catch(r){if(e.shouldThrowOnError)throw r;if(Xt(r))return{data:null,error:r};throw r}}},Os=class{constructor(t,e){this.downloadFn=t,this.shouldThrowOnError=e}then(t,e){return this.execute().then(t,e)}async execute(){var t=this;try{return{data:(await t.downloadFn()).body,error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Xt(e))return{data:null,error:e};throw e}}};let qn;qn=Symbol.toStringTag;var Ws=class{constructor(t,e){this.downloadFn=t,this.shouldThrowOnError=e,this[qn]="BlobDownloadBuilder",this.promise=null}asStream(){return new Os(this.downloadFn,this.shouldThrowOnError)}then(t,e){return this.getPromise().then(t,e)}catch(t){return this.getPromise().catch(t)}finally(t){return this.getPromise().finally(t)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}async execute(){var t=this;try{return{data:await(await t.downloadFn()).blob(),error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(Xt(e))return{data:null,error:e};throw e}}};const Ns={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},Yr={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};var Ds=class extends st{constructor(t,e={},r,i){super(t,e,i,"storage"),this.bucketId=r}async uploadOrUpdate(t,e,r,i){var s=this;return s.handleOperation(async()=>{let o;const a=U(U({},Yr),i);let l=U(U({},s.headers),t==="POST"&&{"x-upsert":String(a.upsert)});const c=a.metadata;typeof Blob<"u"&&r instanceof Blob?(o=new FormData,o.append("cacheControl",a.cacheControl),c&&o.append("metadata",s.encodeMetadata(c)),o.append("",r)):typeof FormData<"u"&&r instanceof FormData?(o=r,o.has("cacheControl")||o.append("cacheControl",a.cacheControl),c&&!o.has("metadata")&&o.append("metadata",s.encodeMetadata(c))):(o=r,l["cache-control"]=`max-age=${a.cacheControl}`,l["content-type"]=a.contentType,c&&(l["x-metadata"]=s.toBase64(s.encodeMetadata(c))),(typeof ReadableStream<"u"&&o instanceof ReadableStream||o&&typeof o=="object"&&"pipe"in o&&typeof o.pipe=="function")&&!a.duplex&&(a.duplex="half")),i!=null&&i.headers&&(l=U(U({},l),i.headers));const d=s._removeEmptyFolders(e),h=s._getFinalPath(d),f=await(t=="PUT"?kr:be)(s.fetch,`${s.url}/object/${h}`,o,U({headers:l},a!=null&&a.duplex?{duplex:a.duplex}:{}));return{path:d,id:f.Id,fullPath:f.Key}})}async upload(t,e,r){return this.uploadOrUpdate("POST",t,e,r)}async uploadToSignedUrl(t,e,r,i){var s=this;const o=s._removeEmptyFolders(t),a=s._getFinalPath(o),l=new URL(s.url+`/object/upload/sign/${a}`);return l.searchParams.set("token",e),s.handleOperation(async()=>{let c;const d=U(U({},Yr),i),h=U(U({},s.headers),{"x-upsert":String(d.upsert)});return typeof Blob<"u"&&r instanceof Blob?(c=new FormData,c.append("cacheControl",d.cacheControl),c.append("",r)):typeof FormData<"u"&&r instanceof FormData?(c=r,c.append("cacheControl",d.cacheControl)):(c=r,h["cache-control"]=`max-age=${d.cacheControl}`,h["content-type"]=d.contentType),{path:o,fullPath:(await kr(s.fetch,l.toString(),c,{headers:h})).Key}})}async createSignedUploadUrl(t,e){var r=this;return r.handleOperation(async()=>{let i=r._getFinalPath(t);const s=U({},r.headers);e!=null&&e.upsert&&(s["x-upsert"]="true");const o=await be(r.fetch,`${r.url}/object/upload/sign/${i}`,{},{headers:s}),a=new URL(r.url+o.url),l=a.searchParams.get("token");if(!l)throw new Kt("No token returned by API");return{signedUrl:a.toString(),path:t,token:l}})}async update(t,e,r){return this.uploadOrUpdate("PUT",t,e,r)}async move(t,e,r){var i=this;return i.handleOperation(async()=>await be(i.fetch,`${i.url}/object/move`,{bucketId:i.bucketId,sourceKey:t,destinationKey:e,destinationBucket:r==null?void 0:r.destinationBucket},{headers:i.headers}))}async copy(t,e,r){var i=this;return i.handleOperation(async()=>({path:(await be(i.fetch,`${i.url}/object/copy`,{bucketId:i.bucketId,sourceKey:t,destinationKey:e,destinationBucket:r==null?void 0:r.destinationBucket},{headers:i.headers})).Key}))}async createSignedUrl(t,e,r){var i=this;return i.handleOperation(async()=>{let s=i._getFinalPath(t);const o=typeof(r==null?void 0:r.transform)=="object"&&r.transform!==null&&Object.keys(r.transform).length>0;let a=await be(i.fetch,`${i.url}/object/sign/${s}`,U({expiresIn:e},o?{transform:r.transform}:{}),{headers:i.headers});const l=r!=null&&r.download?`&download=${r.download===!0?"":r.download}`:"",c=o&&a.signedURL.includes("/object/sign/")?a.signedURL.replace("/object/sign/","/render/image/sign/"):a.signedURL;return{signedUrl:encodeURI(`${i.url}${c}${l}`)}})}async createSignedUrls(t,e,r){var i=this;return i.handleOperation(async()=>{const s=await be(i.fetch,`${i.url}/object/sign/${i.bucketId}`,{expiresIn:e,paths:t},{headers:i.headers}),o=r!=null&&r.download?`&download=${r.download===!0?"":r.download}`:"";return s.map(a=>U(U({},a),{},{signedUrl:a.signedURL?encodeURI(`${i.url}${a.signedURL}${o}`):null}))})}download(t,e,r){const i=typeof(e==null?void 0:e.transform)<"u"?"render/image/authenticated":"object",s=this.transformOptsToQueryString((e==null?void 0:e.transform)||{}),o=s?`?${s}`:"",a=this._getFinalPath(t),l=()=>St(this.fetch,`${this.url}/${i}/${a}${o}`,{headers:this.headers,noResolveJson:!0},r);return new Ws(l,this.shouldThrowOnError)}async info(t){var e=this;const r=e._getFinalPath(t);return e.handleOperation(async()=>wr(await St(e.fetch,`${e.url}/object/info/${r}`,{headers:e.headers})))}async exists(t){var e=this;const r=e._getFinalPath(t);try{return await Rs(e.fetch,`${e.url}/object/${r}`,{headers:e.headers}),{data:!0,error:null}}catch(s){if(e.shouldThrowOnError)throw s;if(Xt(s)){var i;const o=s instanceof Sr?s.status:s instanceof Gn?(i=s.originalError)===null||i===void 0?void 0:i.status:void 0;if(o!==void 0&&[400,404].includes(o))return{data:!1,error:s}}throw s}}getPublicUrl(t,e){const r=this._getFinalPath(t),i=[],s=e!=null&&e.download?`download=${e.download===!0?"":e.download}`:"";s!==""&&i.push(s);const o=typeof(e==null?void 0:e.transform)<"u"?"render/image":"object",a=this.transformOptsToQueryString((e==null?void 0:e.transform)||{});a!==""&&i.push(a);let l=i.join("&");return l!==""&&(l=`?${l}`),{data:{publicUrl:encodeURI(`${this.url}/${o}/public/${r}${l}`)}}}async remove(t){var e=this;return e.handleOperation(async()=>await Tr(e.fetch,`${e.url}/object/${e.bucketId}`,{prefixes:t},{headers:e.headers}))}async list(t,e,r){var i=this;return i.handleOperation(async()=>{const s=U(U(U({},Ns),e),{},{prefix:t||""});return await be(i.fetch,`${i.url}/object/list/${i.bucketId}`,s,{headers:i.headers},r)})}async listV2(t,e){var r=this;return r.handleOperation(async()=>{const i=U({},t);return await be(r.fetch,`${r.url}/object/list-v2/${r.bucketId}`,i,{headers:r.headers},e)})}encodeMetadata(t){return JSON.stringify(t)}toBase64(t){return typeof Buffer<"u"?Buffer.from(t).toString("base64"):btoa(t)}_getFinalPath(t){return`${this.bucketId}/${t.replace(/^\/+/,"")}`}_removeEmptyFolders(t){return t.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(t){const e=[];return t.width&&e.push(`width=${t.width}`),t.height&&e.push(`height=${t.height}`),t.resize&&e.push(`resize=${t.resize}`),t.format&&e.push(`format=${t.format}`),t.quality&&e.push(`quality=${t.quality}`),e.join("&")}};const Ls="2.100.1",_t={"X-Client-Info":`storage-js/${Ls}`};var Bs=class extends st{constructor(t,e={},r,i){const s=new URL(t);i!=null&&i.useNewHostname&&/supabase\.(co|in|red)$/.test(s.hostname)&&!s.hostname.includes("storage.supabase.")&&(s.hostname=s.hostname.replace("supabase.","storage.supabase."));const o=s.href.replace(/\/$/,""),a=U(U({},_t),e);super(o,a,r,"storage")}async listBuckets(t){var e=this;return e.handleOperation(async()=>{const r=e.listBucketOptionsToQueryString(t);return await St(e.fetch,`${e.url}/bucket${r}`,{headers:e.headers})})}async getBucket(t){var e=this;return e.handleOperation(async()=>await St(e.fetch,`${e.url}/bucket/${t}`,{headers:e.headers}))}async createBucket(t,e={public:!1}){var r=this;return r.handleOperation(async()=>await be(r.fetch,`${r.url}/bucket`,{id:t,name:t,type:e.type,public:e.public,file_size_limit:e.fileSizeLimit,allowed_mime_types:e.allowedMimeTypes},{headers:r.headers}))}async updateBucket(t,e){var r=this;return r.handleOperation(async()=>await kr(r.fetch,`${r.url}/bucket/${t}`,{id:t,name:t,public:e.public,file_size_limit:e.fileSizeLimit,allowed_mime_types:e.allowedMimeTypes},{headers:r.headers}))}async emptyBucket(t){var e=this;return e.handleOperation(async()=>await be(e.fetch,`${e.url}/bucket/${t}/empty`,{},{headers:e.headers}))}async deleteBucket(t){var e=this;return e.handleOperation(async()=>await Tr(e.fetch,`${e.url}/bucket/${t}`,{},{headers:e.headers}))}listBucketOptionsToQueryString(t){const e={};return t&&("limit"in t&&(e.limit=String(t.limit)),"offset"in t&&(e.offset=String(t.offset)),t.search&&(e.search=t.search),t.sortColumn&&(e.sortColumn=t.sortColumn),t.sortOrder&&(e.sortOrder=t.sortOrder)),Object.keys(e).length>0?"?"+new URLSearchParams(e).toString():""}},Ms=class extends st{constructor(t,e={},r){const i=t.replace(/\/$/,""),s=U(U({},_t),e);super(i,s,r,"storage")}async createBucket(t){var e=this;return e.handleOperation(async()=>await be(e.fetch,`${e.url}/bucket`,{name:t},{headers:e.headers}))}async listBuckets(t){var e=this;return e.handleOperation(async()=>{const r=new URLSearchParams;(t==null?void 0:t.limit)!==void 0&&r.set("limit",t.limit.toString()),(t==null?void 0:t.offset)!==void 0&&r.set("offset",t.offset.toString()),t!=null&&t.sortColumn&&r.set("sortColumn",t.sortColumn),t!=null&&t.sortOrder&&r.set("sortOrder",t.sortOrder),t!=null&&t.search&&r.set("search",t.search);const i=r.toString(),s=i?`${e.url}/bucket?${i}`:`${e.url}/bucket`;return await St(e.fetch,s,{headers:e.headers})})}async deleteBucket(t){var e=this;return e.handleOperation(async()=>await Tr(e.fetch,`${e.url}/bucket/${t}`,{},{headers:e.headers}))}from(t){var e=this;if(!_s(t))throw new Kt("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");const r=new ks({baseUrl:this.url,catalogName:t,auth:{type:"custom",getHeaders:async()=>e.headers},fetch:this.fetch}),i=this.shouldThrowOnError;return new Proxy(r,{get(s,o){const a=s[o];return typeof a!="function"?a:async(...l)=>{try{return{data:await a.apply(s,l),error:null}}catch(c){if(i)throw c;return{data:null,error:c}}}}})}},$s=class extends st{constructor(t,e={},r){const i=t.replace(/\/$/,""),s=U(U({},_t),{},{"Content-Type":"application/json"},e);super(i,s,r,"vectors")}async createIndex(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/CreateIndex`,t,{headers:e.headers})||{})}async getIndex(t,e){var r=this;return r.handleOperation(async()=>await xe.post(r.fetch,`${r.url}/GetIndex`,{vectorBucketName:t,indexName:e},{headers:r.headers}))}async listIndexes(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/ListIndexes`,t,{headers:e.headers}))}async deleteIndex(t,e){var r=this;return r.handleOperation(async()=>await xe.post(r.fetch,`${r.url}/DeleteIndex`,{vectorBucketName:t,indexName:e},{headers:r.headers})||{})}},Fs=class extends st{constructor(t,e={},r){const i=t.replace(/\/$/,""),s=U(U({},_t),{},{"Content-Type":"application/json"},e);super(i,s,r,"vectors")}async putVectors(t){var e=this;if(t.vectors.length<1||t.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/PutVectors`,t,{headers:e.headers})||{})}async getVectors(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/GetVectors`,t,{headers:e.headers}))}async listVectors(t){var e=this;if(t.segmentCount!==void 0){if(t.segmentCount<1||t.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(t.segmentIndex!==void 0&&(t.segmentIndex<0||t.segmentIndex>=t.segmentCount))throw new Error(`segmentIndex must be between 0 and ${t.segmentCount-1}`)}return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/ListVectors`,t,{headers:e.headers}))}async queryVectors(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/QueryVectors`,t,{headers:e.headers}))}async deleteVectors(t){var e=this;if(t.keys.length<1||t.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/DeleteVectors`,t,{headers:e.headers})||{})}},zs=class extends st{constructor(t,e={},r){const i=t.replace(/\/$/,""),s=U(U({},_t),{},{"Content-Type":"application/json"},e);super(i,s,r,"vectors")}async createBucket(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/CreateVectorBucket`,{vectorBucketName:t},{headers:e.headers})||{})}async getBucket(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/GetVectorBucket`,{vectorBucketName:t},{headers:e.headers}))}async listBuckets(t={}){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/ListVectorBuckets`,t,{headers:e.headers}))}async deleteBucket(t){var e=this;return e.handleOperation(async()=>await xe.post(e.fetch,`${e.url}/DeleteVectorBucket`,{vectorBucketName:t},{headers:e.headers})||{})}},Us=class extends zs{constructor(t,e={}){super(t,e.headers||{},e.fetch)}from(t){return new Js(this.url,this.headers,t,this.fetch)}async createBucket(t){var e=()=>super.createBucket,r=this;return e().call(r,t)}async getBucket(t){var e=()=>super.getBucket,r=this;return e().call(r,t)}async listBuckets(t={}){var e=()=>super.listBuckets,r=this;return e().call(r,t)}async deleteBucket(t){var e=()=>super.deleteBucket,r=this;return e().call(r,t)}},Js=class extends $s{constructor(t,e,r,i){super(t,e,i),this.vectorBucketName=r}async createIndex(t){var e=()=>super.createIndex,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName}))}async listIndexes(t={}){var e=()=>super.listIndexes,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName}))}async getIndex(t){var e=()=>super.getIndex,r=this;return e().call(r,r.vectorBucketName,t)}async deleteIndex(t){var e=()=>super.deleteIndex,r=this;return e().call(r,r.vectorBucketName,t)}index(t){return new Gs(this.url,this.headers,this.vectorBucketName,t,this.fetch)}},Gs=class extends Fs{constructor(t,e,r,i,s){super(t,e,s),this.vectorBucketName=r,this.indexName=i}async putVectors(t){var e=()=>super.putVectors,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async getVectors(t){var e=()=>super.getVectors,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async listVectors(t={}){var e=()=>super.listVectors,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async queryVectors(t){var e=()=>super.queryVectors,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async deleteVectors(t){var e=()=>super.deleteVectors,r=this;return e().call(r,U(U({},t),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}},Vs=class extends Bs{constructor(t,e={},r,i){super(t,e,r,i)}from(t){return new Ds(this.url,this.headers,t,this.fetch)}get vectors(){return new Us(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new Ms(this.url+"/iceberg",this.headers,this.fetch)}};const Kn="2.100.1",rt=30*1e3,jr=3,tr=jr*rt,qs="http://localhost:9999",Ks="supabase.auth.token",Xs={"X-Client-Info":`gotrue-js/${Kn}`},Ar="X-Supabase-Api-Version",Xn={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},Ys=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,Zs=10*60*1e3;class wt extends Error{constructor(e,r,i){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=r,this.code=i}}function B(t){return typeof t=="object"&&t!==null&&"__isAuthError"in t}class Qs extends wt{constructor(e,r,i){super(e,r,i),this.name="AuthApiError",this.status=r,this.code=i}}function eo(t){return B(t)&&t.name==="AuthApiError"}class Be extends wt{constructor(e,r){super(e),this.name="AuthUnknownError",this.originalError=r}}class Ee extends wt{constructor(e,r,i,s){super(e,i,s),this.name=r,this.status=i}}class ge extends Ee{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function rr(t){return B(t)&&t.name==="AuthSessionMissingError"}class Je extends Ee{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class Ct extends Ee{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class Rt extends Ee{constructor(e,r=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function to(t){return B(t)&&t.name==="AuthImplicitGrantRedirectError"}class Zr extends Ee{constructor(e,r=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class ro extends Ee{constructor(){super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.","AuthPKCECodeVerifierMissingError",400,"pkce_code_verifier_not_found")}}class _r extends Ee{constructor(e,r){super(e,"AuthRetryableFetchError",r,void 0)}}function nr(t){return B(t)&&t.name==="AuthRetryableFetchError"}class Qr extends Ee{constructor(e,r,i){super(e,"AuthWeakPasswordError",r,"weak_password"),this.reasons=i}}class Hr extends Ee{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const zt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),en=` 	
\r=`.split(""),no=(()=>{const t=new Array(128);for(let e=0;e<t.length;e+=1)t[e]=-1;for(let e=0;e<en.length;e+=1)t[en[e].charCodeAt(0)]=-2;for(let e=0;e<zt.length;e+=1)t[zt[e].charCodeAt(0)]=e;return t})();function tn(t,e,r){if(t!==null)for(e.queue=e.queue<<8|t,e.queuedBits+=8;e.queuedBits>=6;){const i=e.queue>>e.queuedBits-6&63;r(zt[i]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const i=e.queue>>e.queuedBits-6&63;r(zt[i]),e.queuedBits-=6}}function Yn(t,e,r){const i=no[t];if(i>-1)for(e.queue=e.queue<<6|i,e.queuedBits+=6;e.queuedBits>=8;)r(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(i===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(t)}"`)}}function rn(t){const e=[],r=a=>{e.push(String.fromCodePoint(a))},i={utf8seq:0,codepoint:0},s={queue:0,queuedBits:0},o=a=>{oo(a,i,r)};for(let a=0;a<t.length;a+=1)Yn(t.charCodeAt(a),s,o);return e.join("")}function io(t,e){if(t<=127){e(t);return}else if(t<=2047){e(192|t>>6),e(128|t&63);return}else if(t<=65535){e(224|t>>12),e(128|t>>6&63),e(128|t&63);return}else if(t<=1114111){e(240|t>>18),e(128|t>>12&63),e(128|t>>6&63),e(128|t&63);return}throw new Error(`Unrecognized Unicode codepoint: ${t.toString(16)}`)}function so(t,e){for(let r=0;r<t.length;r+=1){let i=t.charCodeAt(r);if(i>55295&&i<=56319){const s=(i-55296)*1024&65535;i=(t.charCodeAt(r+1)-56320&65535|s)+65536,r+=1}io(i,e)}}function oo(t,e,r){if(e.utf8seq===0){if(t<=127){r(t);return}for(let i=1;i<6;i+=1)if(!(t>>7-i&1)){e.utf8seq=i;break}if(e.utf8seq===2)e.codepoint=t&31;else if(e.utf8seq===3)e.codepoint=t&15;else if(e.utf8seq===4)e.codepoint=t&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(t<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|t&63,e.utf8seq-=1,e.utf8seq===0&&r(e.codepoint)}}function it(t){const e=[],r={queue:0,queuedBits:0},i=s=>{e.push(s)};for(let s=0;s<t.length;s+=1)Yn(t.charCodeAt(s),r,i);return new Uint8Array(e)}function ao(t){const e=[];return so(t,r=>e.push(r)),new Uint8Array(e)}function Me(t){const e=[],r={queue:0,queuedBits:0},i=s=>{e.push(s)};return t.forEach(s=>tn(s,r,i)),tn(null,r,i),e.join("")}function lo(t){return Math.round(Date.now()/1e3)+t}function co(){return Symbol("auth-callback")}const he=()=>typeof window<"u"&&typeof document<"u",Oe={tested:!1,writable:!1},Zn=()=>{if(!he())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(Oe.tested)return Oe.writable;const t=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(t,t),globalThis.localStorage.removeItem(t),Oe.tested=!0,Oe.writable=!0}catch{Oe.tested=!0,Oe.writable=!1}return Oe.writable};function ho(t){const e={},r=new URL(t);if(r.hash&&r.hash[0]==="#")try{new URLSearchParams(r.hash.substring(1)).forEach((s,o)=>{e[o]=s})}catch{}return r.searchParams.forEach((i,s)=>{e[s]=i}),e}const Qn=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),uo=t=>typeof t=="object"&&t!==null&&"status"in t&&"ok"in t&&"json"in t&&typeof t.json=="function",nt=async(t,e,r)=>{await t.setItem(e,JSON.stringify(r))},We=async(t,e)=>{const r=await t.getItem(e);if(!r)return null;try{return JSON.parse(r)}catch{return r}},de=async(t,e)=>{await t.removeItem(e)};class Yt{constructor(){this.promise=new Yt.promiseConstructor((e,r)=>{this.resolve=e,this.reject=r})}}Yt.promiseConstructor=Promise;function Ot(t){const e=t.split(".");if(e.length!==3)throw new Hr("Invalid JWT structure");for(let i=0;i<e.length;i++)if(!Ys.test(e[i]))throw new Hr("JWT not in base64url format");return{header:JSON.parse(rn(e[0])),payload:JSON.parse(rn(e[1])),signature:it(e[2]),raw:{header:e[0],payload:e[1]}}}async function po(t){return await new Promise(e=>{setTimeout(()=>e(null),t)})}function fo(t,e){return new Promise((i,s)=>{(async()=>{for(let o=0;o<1/0;o++)try{const a=await t(o);if(!e(o,null,a)){i(a);return}}catch(a){if(!e(o,a)){s(a);return}}})()})}function go(t){return("0"+t.toString(16)).substr(-2)}function xo(){const e=new Uint32Array(56);if(typeof crypto>"u"){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",i=r.length;let s="";for(let o=0;o<56;o++)s+=r.charAt(Math.floor(Math.random()*i));return s}return crypto.getRandomValues(e),Array.from(e,go).join("")}async function mo(t){const r=new TextEncoder().encode(t),i=await crypto.subtle.digest("SHA-256",r),s=new Uint8Array(i);return Array.from(s).map(o=>String.fromCharCode(o)).join("")}async function yo(t){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),t;const r=await mo(t);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function Ge(t,e,r=!1){const i=xo();let s=i;r&&(s+="/PASSWORD_RECOVERY"),await nt(t,`${e}-code-verifier`,s);const o=await yo(i);return[o,i===o?"plain":"s256"]}const vo=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function bo(t){const e=t.headers.get(Ar);if(!e||!e.match(vo))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function So(t){if(!t)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(t<=e)throw new Error("JWT has expired")}function wo(t){switch(t){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const ko=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function Ve(t){if(!ko.test(t))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function ir(){const t={};return new Proxy(t,{get:(e,r)=>{if(r==="__isUserNotAvailableProxy")return!0;if(typeof r=="symbol"){const i=r.toString();if(i==="Symbol(Symbol.toPrimitive)"||i==="Symbol(Symbol.toStringTag)"||i==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function jo(t,e){return new Proxy(t,{get:(r,i,s)=>{if(i==="__isInsecureUserWarningProxy")return!0;if(typeof i=="symbol"){const o=i.toString();if(o==="Symbol(Symbol.toPrimitive)"||o==="Symbol(Symbol.toStringTag)"||o==="Symbol(util.inspect.custom)"||o==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(r,i,s)}return!e.value&&typeof i=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),e.value=!0),Reflect.get(r,i,s)}})}function nn(t){return JSON.parse(JSON.stringify(t))}const Le=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),Ao=[502,503,504];async function sn(t){var e;if(!uo(t))throw new _r(Le(t),0);if(Ao.includes(t.status))throw new _r(Le(t),t.status);let r;try{r=await t.json()}catch(o){throw new Be(Le(o),o)}let i;const s=bo(t);if(s&&s.getTime()>=Xn["2024-01-01"].timestamp&&typeof r=="object"&&r&&typeof r.code=="string"?i=r.code:typeof r=="object"&&r&&typeof r.error_code=="string"&&(i=r.error_code),i){if(i==="weak_password")throw new Qr(Le(r),t.status,((e=r.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(i==="session_not_found")throw new ge}else if(typeof r=="object"&&r&&typeof r.weak_password=="object"&&r.weak_password&&Array.isArray(r.weak_password.reasons)&&r.weak_password.reasons.length&&r.weak_password.reasons.reduce((o,a)=>o&&typeof a=="string",!0))throw new Qr(Le(r),t.status,r.weak_password.reasons);throw new Qs(Le(r),t.status||500,i)}const _o=(t,e,r,i)=>{const s={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"?s:(s.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e==null?void 0:e.headers),s.body=JSON.stringify(i),Object.assign(Object.assign({},s),r))};async function F(t,e,r,i){var s;const o=Object.assign({},i==null?void 0:i.headers);o[Ar]||(o[Ar]=Xn["2024-01-01"].name),i!=null&&i.jwt&&(o.Authorization=`Bearer ${i.jwt}`);const a=(s=i==null?void 0:i.query)!==null&&s!==void 0?s:{};i!=null&&i.redirectTo&&(a.redirect_to=i.redirectTo);const l=Object.keys(a).length?"?"+new URLSearchParams(a).toString():"",c=await Ho(t,e,r+l,{headers:o,noResolveJson:i==null?void 0:i.noResolveJson},{},i==null?void 0:i.body);return i!=null&&i.xform?i==null?void 0:i.xform(c):{data:Object.assign({},c),error:null}}async function Ho(t,e,r,i,s,o){const a=_o(e,i,s,o);let l;try{l=await t(r,Object.assign({},a))}catch(c){throw console.error(c),new _r(Le(c),0)}if(l.ok||await sn(l),i!=null&&i.noResolveJson)return l;try{return await l.json()}catch(c){await sn(c)}}function ve(t){var e;let r=null;Po(t)&&(r=Object.assign({},t),t.expires_at||(r.expires_at=lo(t.expires_in)));const i=(e=t.user)!==null&&e!==void 0?e:t;return{data:{session:r,user:i},error:null}}function on(t){const e=ve(t);return!e.error&&t.weak_password&&typeof t.weak_password=="object"&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.message&&typeof t.weak_password.message=="string"&&t.weak_password.reasons.reduce((r,i)=>r&&typeof i=="string",!0)&&(e.data.weak_password=t.weak_password),e}function Te(t){var e;return{data:{user:(e=t.user)!==null&&e!==void 0?e:t},error:null}}function Io(t){return{data:t,error:null}}function Eo(t){const{action_link:e,email_otp:r,hashed_token:i,redirect_to:s,verification_type:o}=t,a=qt(t,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),l={action_link:e,email_otp:r,hashed_token:i,redirect_to:s,verification_type:o},c=Object.assign({},a);return{data:{properties:l,user:c},error:null}}function an(t){return t}function Po(t){return t.access_token&&t.refresh_token&&t.expires_in}const sr=["global","local","others"];class To{constructor({url:e="",headers:r={},fetch:i}){this.url=e,this.headers=r,this.fetch=Qn(i),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)}}async signOut(e,r=sr[0]){if(sr.indexOf(r)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${sr.join(", ")}`);try{return await F(this.fetch,"POST",`${this.url}/logout?scope=${r}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(i){if(B(i))return{data:null,error:i};throw i}}async inviteUserByEmail(e,r={}){try{return await F(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:r.data},headers:this.headers,redirectTo:r.redirectTo,xform:Te})}catch(i){if(B(i))return{data:{user:null},error:i};throw i}}async generateLink(e){try{const{options:r}=e,i=qt(e,["options"]),s=Object.assign(Object.assign({},i),r);return"newEmail"in i&&(s.new_email=i==null?void 0:i.newEmail,delete s.newEmail),await F(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:s,headers:this.headers,xform:Eo,redirectTo:r==null?void 0:r.redirectTo})}catch(r){if(B(r))return{data:{properties:null,user:null},error:r};throw r}}async createUser(e){try{return await F(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:Te})}catch(r){if(B(r))return{data:{user:null},error:r};throw r}}async listUsers(e){var r,i,s,o,a,l,c;try{const d={nextPage:null,lastPage:0,total:0},h=await F(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(i=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&i!==void 0?i:"",per_page:(o=(s=e==null?void 0:e.perPage)===null||s===void 0?void 0:s.toString())!==null&&o!==void 0?o:""},xform:an});if(h.error)throw h.error;const f=await h.json(),u=(a=h.headers.get("x-total-count"))!==null&&a!==void 0?a:0,g=(c=(l=h.headers.get("link"))===null||l===void 0?void 0:l.split(","))!==null&&c!==void 0?c:[];return g.length>0&&(g.forEach(y=>{const m=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(y.split(";")[1].split("=")[1]);d[`${b}Page`]=m}),d.total=parseInt(u)),{data:Object.assign(Object.assign({},f),d),error:null}}catch(d){if(B(d))return{data:{users:[]},error:d};throw d}}async getUserById(e){Ve(e);try{return await F(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:Te})}catch(r){if(B(r))return{data:{user:null},error:r};throw r}}async updateUserById(e,r){Ve(e);try{return await F(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:r,headers:this.headers,xform:Te})}catch(i){if(B(i))return{data:{user:null},error:i};throw i}}async deleteUser(e,r=!1){Ve(e);try{return await F(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:r},xform:Te})}catch(i){if(B(i))return{data:{user:null},error:i};throw i}}async _listFactors(e){Ve(e.userId);try{const{data:r,error:i}=await F(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:s=>({data:{factors:s},error:null})});return{data:r,error:i}}catch(r){if(B(r))return{data:null,error:r};throw r}}async _deleteFactor(e){Ve(e.userId),Ve(e.id);try{return{data:await F(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}}async _listOAuthClients(e){var r,i,s,o,a,l,c;try{const d={nextPage:null,lastPage:0,total:0},h=await F(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(i=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&i!==void 0?i:"",per_page:(o=(s=e==null?void 0:e.perPage)===null||s===void 0?void 0:s.toString())!==null&&o!==void 0?o:""},xform:an});if(h.error)throw h.error;const f=await h.json(),u=(a=h.headers.get("x-total-count"))!==null&&a!==void 0?a:0,g=(c=(l=h.headers.get("link"))===null||l===void 0?void 0:l.split(","))!==null&&c!==void 0?c:[];return g.length>0&&(g.forEach(y=>{const m=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(y.split(";")[1].split("=")[1]);d[`${b}Page`]=m}),d.total=parseInt(u)),{data:Object.assign(Object.assign({},f),d),error:null}}catch(d){if(B(d))return{data:{clients:[]},error:d};throw d}}async _createOAuthClient(e){try{return await F(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(B(r))return{data:null,error:r};throw r}}async _getOAuthClient(e){try{return await F(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(B(r))return{data:null,error:r};throw r}}async _updateOAuthClient(e,r){try{return await F(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:r,headers:this.headers,xform:i=>({data:i,error:null})})}catch(i){if(B(i))return{data:null,error:i};throw i}}async _deleteOAuthClient(e){try{return await F(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}}async _regenerateOAuthClientSecret(e){try{return await F(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(B(r))return{data:null,error:r};throw r}}async _listCustomProviders(e){try{const r={};return e!=null&&e.type&&(r.type=e.type),await F(this.fetch,"GET",`${this.url}/admin/custom-providers`,{headers:this.headers,query:r,xform:i=>{var s;return{data:{providers:(s=i==null?void 0:i.providers)!==null&&s!==void 0?s:[]},error:null}}})}catch(r){if(B(r))return{data:{providers:[]},error:r};throw r}}async _createCustomProvider(e){try{return await F(this.fetch,"POST",`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(B(r))return{data:null,error:r};throw r}}async _getCustomProvider(e){try{return await F(this.fetch,"GET",`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(B(r))return{data:null,error:r};throw r}}async _updateCustomProvider(e,r){try{return await F(this.fetch,"PUT",`${this.url}/admin/custom-providers/${e}`,{body:r,headers:this.headers,xform:i=>({data:i,error:null})})}catch(i){if(B(i))return{data:null,error:i};throw i}}async _deleteCustomProvider(e){try{return await F(this.fetch,"DELETE",`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}}}function ln(t={}){return{getItem:e=>t[e]||null,setItem:(e,r)=>{t[e]=r},removeItem:e=>{delete t[e]}}}const we={debug:!!(globalThis&&Zn()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class ei extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class cn extends ei{}async function Co(t,e,r){we.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",t,e);const i=new globalThis.AbortController;let s;e>0&&(s=setTimeout(()=>{i.abort(),we.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",t)},e)),await Promise.resolve();try{return await globalThis.navigator.locks.request(t,e===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:i.signal},async o=>{if(o){clearTimeout(s),we.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",t,o.name);try{return await r()}finally{we.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",t,o.name)}}else{if(e===0)throw we.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",t),new cn(`Acquiring an exclusive Navigator LockManager lock "${t}" immediately failed`);if(we.debug)try{const a=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(a,null,"  "))}catch(a){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",a)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),clearTimeout(s),await r()}})}catch(o){if(e>0&&clearTimeout(s),(o==null?void 0:o.name)==="AbortError"&&e>0){if(i.signal.aborted)return we.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock",t),console.warn(`@supabase/gotrue-js: Lock "${t}" was not released within ${e}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`),await Promise.resolve().then(()=>globalThis.navigator.locks.request(t,{mode:"exclusive",steal:!0},async a=>{if(a){we.debug&&console.log("@supabase/gotrue-js: navigatorLock: recovered (stolen)",t,a.name);try{return await r()}finally{we.debug&&console.log("@supabase/gotrue-js: navigatorLock: released (stolen)",t,a.name)}}else return console.warn("@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true"),await r()}));throw we.debug&&console.log("@supabase/gotrue-js: navigatorLock: lock was stolen by another request",t),new cn(`Lock "${t}" was released because another request stole it`)}throw o}}function Ro(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function ti(t){if(!/^0x[a-fA-F0-9]{40}$/.test(t))throw new Error(`@supabase/auth-js: Address "${t}" is invalid.`);return t.toLowerCase()}function Oo(t){return parseInt(t,16)}function Wo(t){const e=new TextEncoder().encode(t);return"0x"+Array.from(e,i=>i.toString(16).padStart(2,"0")).join("")}function No(t){var e;const{chainId:r,domain:i,expirationTime:s,issuedAt:o=new Date,nonce:a,notBefore:l,requestId:c,resources:d,scheme:h,uri:f,version:u}=t;{if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!i)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(a&&a.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);if(!f)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(u!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${u}`);if(!((e=t.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${t.statement}`)}const g=ti(t.address),y=h?`${h}://${i}`:i,m=t.statement?`${t.statement}
`:"",b=`${y} wants you to sign in with your Ethereum account:
${g}

${m}`;let x=`URI: ${f}
Version: ${u}
Chain ID: ${r}${a?`
Nonce: ${a}`:""}
Issued At: ${o.toISOString()}`;if(s&&(x+=`
Expiration Time: ${s.toISOString()}`),l&&(x+=`
Not Before: ${l.toISOString()}`),c&&(x+=`
Request ID: ${c}`),d){let p=`
Resources:`;for(const v of d){if(!v||typeof v!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${v}`);p+=`
- ${v}`}x+=p}return`${b}
${x}`}class ae extends Error{constructor({message:e,code:r,cause:i,name:s}){var o;super(e,{cause:i}),this.__isWebAuthnError=!0,this.name=(o=s??(i instanceof Error?i.name:void 0))!==null&&o!==void 0?o:"Unknown Error",this.code=r}}class Ut extends ae{constructor(e,r){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:r,message:e}),this.name="WebAuthnUnknownError",this.originalError=r}}function Do({error:t,options:e}){var r,i,s;const{publicKey:o}=e;if(!o)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new ae({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else if(t.name==="ConstraintError"){if(((r=o.authenticatorSelection)===null||r===void 0?void 0:r.requireResidentKey)===!0)return new ae({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:t});if(e.mediation==="conditional"&&((i=o.authenticatorSelection)===null||i===void 0?void 0:i.userVerification)==="required")return new ae({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:t});if(((s=o.authenticatorSelection)===null||s===void 0?void 0:s.userVerification)==="required")return new ae({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:t})}else{if(t.name==="InvalidStateError")return new ae({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:t});if(t.name==="NotAllowedError")return new ae({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="NotSupportedError")return o.pubKeyCredParams.filter(l=>l.type==="public-key").length===0?new ae({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:t}):new ae({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:t});if(t.name==="SecurityError"){const a=window.location.hostname;if(ri(a)){if(o.rp.id!==a)return new ae({message:`The RP ID "${o.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new ae({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="TypeError"){if(o.user.id.byteLength<1||o.user.id.byteLength>64)return new ae({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:t})}else if(t.name==="UnknownError")return new ae({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new ae({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}function Lo({error:t,options:e}){const{publicKey:r}=e;if(!r)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new ae({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else{if(t.name==="NotAllowedError")return new ae({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="SecurityError"){const i=window.location.hostname;if(ri(i)){if(r.rpId!==i)return new ae({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new ae({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="UnknownError")return new ae({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new ae({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}class Bo{createNewAbortSignal(){if(this.controller){const r=new Error("Cancelling existing WebAuthn API call for new one");r.name="AbortError",this.controller.abort(r)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const Mo=new Bo;function $o(t){if(!t)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(t);const{challenge:e,user:r,excludeCredentials:i}=t,s=qt(t,["challenge","user","excludeCredentials"]),o=it(e).buffer,a=Object.assign(Object.assign({},r),{id:it(r.id).buffer}),l=Object.assign(Object.assign({},s),{challenge:o,user:a});if(i&&i.length>0){l.excludeCredentials=new Array(i.length);for(let c=0;c<i.length;c++){const d=i[c];l.excludeCredentials[c]=Object.assign(Object.assign({},d),{id:it(d.id).buffer,type:d.type||"public-key",transports:d.transports})}}return l}function Fo(t){if(!t)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(t);const{challenge:e,allowCredentials:r}=t,i=qt(t,["challenge","allowCredentials"]),s=it(e).buffer,o=Object.assign(Object.assign({},i),{challenge:s});if(r&&r.length>0){o.allowCredentials=new Array(r.length);for(let a=0;a<r.length;a++){const l=r[a];o.allowCredentials[a]=Object.assign(Object.assign({},l),{id:it(l.id).buffer,type:l.type||"public-key",transports:l.transports})}}return o}function zo(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t;return{id:t.id,rawId:t.id,response:{attestationObject:Me(new Uint8Array(t.response.attestationObject)),clientDataJSON:Me(new Uint8Array(t.response.clientDataJSON))},type:"public-key",clientExtensionResults:t.getClientExtensionResults(),authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function Uo(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t,i=t.getClientExtensionResults(),s=t.response;return{id:t.id,rawId:t.id,response:{authenticatorData:Me(new Uint8Array(s.authenticatorData)),clientDataJSON:Me(new Uint8Array(s.clientDataJSON)),signature:Me(new Uint8Array(s.signature)),userHandle:s.userHandle?Me(new Uint8Array(s.userHandle)):void 0},type:"public-key",clientExtensionResults:i,authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function ri(t){return t==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)}function dn(){var t,e;return!!(he()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((t=navigator==null?void 0:navigator.credentials)===null||t===void 0?void 0:t.create)=="function"&&typeof((e=navigator==null?void 0:navigator.credentials)===null||e===void 0?void 0:e.get)=="function")}async function Jo(t){try{const e=await navigator.credentials.create(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ut("Browser returned unexpected credential type",e)}:{data:null,error:new Ut("Empty credential response",e)}}catch(e){return{data:null,error:Do({error:e,options:t})}}}async function Go(t){try{const e=await navigator.credentials.get(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ut("Browser returned unexpected credential type",e)}:{data:null,error:new Ut("Empty credential response",e)}}catch(e){return{data:null,error:Lo({error:e,options:t})}}}const Vo={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"direct"},qo={userVerification:"preferred",hints:["security-key"],attestation:"direct"};function Jt(...t){const e=s=>s!==null&&typeof s=="object"&&!Array.isArray(s),r=s=>s instanceof ArrayBuffer||ArrayBuffer.isView(s),i={};for(const s of t)if(s)for(const o in s){const a=s[o];if(a!==void 0)if(Array.isArray(a))i[o]=a;else if(r(a))i[o]=a;else if(e(a)){const l=i[o];e(l)?i[o]=Jt(l,a):i[o]=Jt(a)}else i[o]=a}return i}function Ko(t,e){return Jt(Vo,t,e||{})}function Xo(t,e){return Jt(qo,t,e||{})}class Yo{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:r,friendlyName:i,signal:s},o){var a;try{const{data:l,error:c}=await this.client.mfa.challenge({factorId:e,webauthn:r});if(!l)return{data:null,error:c};const d=s??Mo.createNewAbortSignal();if(l.webauthn.type==="create"){const{user:h}=l.webauthn.credential_options.publicKey;if(!h.name){const f=i;if(f)h.name=`${h.id}:${f}`;else{const g=(await this.client.getUser()).data.user,y=((a=g==null?void 0:g.user_metadata)===null||a===void 0?void 0:a.name)||(g==null?void 0:g.email)||(g==null?void 0:g.id)||"User";h.name=`${h.id}:${y}`}}h.displayName||(h.displayName=h.name)}switch(l.webauthn.type){case"create":{const h=Ko(l.webauthn.credential_options.publicKey,o==null?void 0:o.create),{data:f,error:u}=await Jo({publicKey:h,signal:d});return f?{data:{factorId:e,challengeId:l.id,webauthn:{type:l.webauthn.type,credential_response:f}},error:null}:{data:null,error:u}}case"request":{const h=Xo(l.webauthn.credential_options.publicKey,o==null?void 0:o.request),{data:f,error:u}=await Go(Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:h,signal:d}));return f?{data:{factorId:e,challengeId:l.id,webauthn:{type:l.webauthn.type,credential_response:f}},error:null}:{data:null,error:u}}}}catch(l){return B(l)?{data:null,error:l}:{data:null,error:new Be("Unexpected error in challenge",l)}}}async _verify({challengeId:e,factorId:r,webauthn:i}){return this.client.mfa.verify({factorId:r,challengeId:e,webauthn:i})}async _authenticate({factorId:e,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:i=typeof window<"u"?[window.location.origin]:void 0,signal:s}={}},o){if(!r)return{data:null,error:new wt("rpId is required for WebAuthn authentication")};try{if(!dn())return{data:null,error:new Be("Browser does not support WebAuthn",null)};const{data:a,error:l}=await this.challenge({factorId:e,webauthn:{rpId:r,rpOrigins:i},signal:s},{request:o});if(!a)return{data:null,error:l};const{webauthn:c}=a;return this._verify({factorId:e,challengeId:a.challengeId,webauthn:{type:c.type,rpId:r,rpOrigins:i,credential_response:c.credential_response}})}catch(a){return B(a)?{data:null,error:a}:{data:null,error:new Be("Unexpected error in authenticate",a)}}}async _register({friendlyName:e,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:i=typeof window<"u"?[window.location.origin]:void 0,signal:s}={}},o){if(!r)return{data:null,error:new wt("rpId is required for WebAuthn registration")};try{if(!dn())return{data:null,error:new Be("Browser does not support WebAuthn",null)};const{data:a,error:l}=await this._enroll({friendlyName:e});if(!a)return await this.client.mfa.listFactors().then(h=>{var f;return(f=h.data)===null||f===void 0?void 0:f.all.find(u=>u.factor_type==="webauthn"&&u.friendly_name===e&&u.status!=="unverified")}).then(h=>h?this.client.mfa.unenroll({factorId:h==null?void 0:h.id}):void 0),{data:null,error:l};const{data:c,error:d}=await this._challenge({factorId:a.id,friendlyName:a.friendly_name,webauthn:{rpId:r,rpOrigins:i},signal:s},{create:o});return c?this._verify({factorId:a.id,challengeId:c.challengeId,webauthn:{rpId:r,rpOrigins:i,type:c.webauthn.type,credential_response:c.webauthn.credential_response}}):{data:null,error:d}}catch(a){return B(a)?{data:null,error:a}:{data:null,error:new Be("Unexpected error in register",a)}}}}Ro();const Zo={url:qs,storageKey:Ks,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Xs,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1};async function hn(t,e,r){return await r()}const qe={};class kt{get jwks(){var e,r;return(r=(e=qe[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&r!==void 0?r:{keys:[]}}set jwks(e){qe[this.storageKey]=Object.assign(Object.assign({},qe[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,r;return(r=(e=qe[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&r!==void 0?r:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){qe[this.storageKey]=Object.assign(Object.assign({},qe[this.storageKey]),{cachedAt:e})}constructor(e){var r,i,s;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;const o=Object.assign(Object.assign({},Zo),e);if(this.storageKey=o.storageKey,this.instanceID=(r=kt.nextInstanceID[this.storageKey])!==null&&r!==void 0?r:0,kt.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!o.debug,typeof o.debug=="function"&&(this.logger=o.debug),this.instanceID>0&&he()){const a=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(a),this.logDebugMessages&&console.trace(a)}if(this.persistSession=o.persistSession,this.autoRefreshToken=o.autoRefreshToken,this.admin=new To({url:o.url,headers:o.headers,fetch:o.fetch}),this.url=o.url,this.headers=o.headers,this.fetch=Qn(o.fetch),this.lock=o.lock||hn,this.detectSessionInUrl=o.detectSessionInUrl,this.flowType=o.flowType,this.hasCustomAuthorizationHeader=o.hasCustomAuthorizationHeader,this.throwOnError=o.throwOnError,this.lockAcquireTimeout=o.lockAcquireTimeout,o.lock?this.lock=o.lock:this.persistSession&&he()&&(!((i=globalThis==null?void 0:globalThis.navigator)===null||i===void 0)&&i.locks)?this.lock=Co:this.lock=hn,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Yo(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.persistSession?(o.storage?this.storage=o.storage:Zn()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=ln(this.memoryStorage)),o.userStorage&&(this.userStorage=o.userStorage)):(this.memoryStorage={},this.storage=ln(this.memoryStorage)),he()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(a){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",a)}(s=this.broadcastChannel)===null||s===void 0||s.addEventListener("message",async a=>{this._debug("received broadcast notification from other tab or client",a);try{await this._notifyAllSubscribers(a.data.event,a.data.session,!1)}catch(l){this._debug("#broadcastChannel","error",l)}})}o.skipAutoInitialize||this.initialize().catch(a=>{this._debug("#initialize()","error",a)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${Kn}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var e;try{let r={},i="none";if(he()&&(r=ho(window.location.href),this._isImplicitGrantCallback(r)?i="implicit":await this._isPKCECallback(r)&&(i="pkce")),he()&&this.detectSessionInUrl&&i!=="none"){const{data:s,error:o}=await this._getSessionFromURL(r,i);if(o){if(this._debug("#_initialize()","error detecting session from URL",o),to(o)){const c=(e=o.details)===null||e===void 0?void 0:e.code;if(c==="identity_already_exists"||c==="identity_not_found"||c==="single_identity_not_deletable")return{error:o}}return{error:o}}const{session:a,redirectType:l}=s;return this._debug("#_initialize()","detected session in URL",a,"redirect type",l),await this._saveSession(a),setTimeout(async()=>{l==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",a):await this._notifyAllSubscribers("SIGNED_IN",a)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(r){return B(r)?this._returnResult({error:r}):this._returnResult({error:new Be("Unexpected error during initialization",r)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var r,i,s;try{const o=await F(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(i=(r=e==null?void 0:e.options)===null||r===void 0?void 0:r.data)!==null&&i!==void 0?i:{},gotrue_meta_security:{captcha_token:(s=e==null?void 0:e.options)===null||s===void 0?void 0:s.captchaToken}},xform:ve}),{data:a,error:l}=o;if(l||!a)return this._returnResult({data:{user:null,session:null},error:l});const c=a.session,d=a.user;return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:d,session:c},error:null})}catch(o){if(B(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signUp(e){var r,i,s;try{let o;if("email"in e){const{email:h,password:f,options:u}=e;let g=null,y=null;this.flowType==="pkce"&&([g,y]=await Ge(this.storage,this.storageKey)),o=await F(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:u==null?void 0:u.emailRedirectTo,body:{email:h,password:f,data:(r=u==null?void 0:u.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:u==null?void 0:u.captchaToken},code_challenge:g,code_challenge_method:y},xform:ve})}else if("phone"in e){const{phone:h,password:f,options:u}=e;o=await F(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:h,password:f,data:(i=u==null?void 0:u.data)!==null&&i!==void 0?i:{},channel:(s=u==null?void 0:u.channel)!==null&&s!==void 0?s:"sms",gotrue_meta_security:{captcha_token:u==null?void 0:u.captchaToken}},xform:ve})}else throw new Ct("You must provide either an email or phone number and a password");const{data:a,error:l}=o;if(l||!a)return await de(this.storage,`${this.storageKey}-code-verifier`),this._returnResult({data:{user:null,session:null},error:l});const c=a.session,d=a.user;return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:d,session:c},error:null})}catch(o){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signInWithPassword(e){try{let r;if("email"in e){const{email:o,password:a,options:l}=e;r=await F(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:o,password:a,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken}},xform:on})}else if("phone"in e){const{phone:o,password:a,options:l}=e;r=await F(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:o,password:a,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken}},xform:on})}else throw new Ct("You must provide either an email or phone number and a password");const{data:i,error:s}=r;if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!i||!i.session||!i.user){const o=new Je;return this._returnResult({data:{user:null,session:null},error:o})}return i.session&&(await this._saveSession(i.session),await this._notifyAllSubscribers("SIGNED_IN",i.session)),this._returnResult({data:Object.assign({user:i.user,session:i.session},i.weak_password?{weakPassword:i.weak_password}:null),error:s})}catch(r){if(B(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOAuth(e){var r,i,s,o;return await this._handleProviderSignIn(e.provider,{redirectTo:(r=e.options)===null||r===void 0?void 0:r.redirectTo,scopes:(i=e.options)===null||i===void 0?void 0:i.scopes,queryParams:(s=e.options)===null||s===void 0?void 0:s.queryParams,skipBrowserRedirect:(o=e.options)===null||o===void 0?void 0:o.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:r}=e;switch(r){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`)}}async signInWithEthereum(e){var r,i,s,o,a,l,c,d,h,f,u;let g,y;if("message"in e)g=e.message,y=e.signature;else{const{chain:m,wallet:b,statement:x,options:p}=e;let v;if(he())if(typeof b=="object")v=b;else{const P=window;if("ethereum"in P&&typeof P.ethereum=="object"&&"request"in P.ethereum&&typeof P.ethereum.request=="function")v=P.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof b!="object"||!(p!=null&&p.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");v=b}const w=new URL((r=p==null?void 0:p.url)!==null&&r!==void 0?r:window.location.href),H=await v.request({method:"eth_requestAccounts"}).then(P=>P).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!H||H.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const I=ti(H[0]);let C=(i=p==null?void 0:p.signInWithEthereum)===null||i===void 0?void 0:i.chainId;if(!C){const P=await v.request({method:"eth_chainId"});C=Oo(P)}const z={domain:w.host,address:I,statement:x,uri:w.href,version:"1",chainId:C,nonce:(s=p==null?void 0:p.signInWithEthereum)===null||s===void 0?void 0:s.nonce,issuedAt:(a=(o=p==null?void 0:p.signInWithEthereum)===null||o===void 0?void 0:o.issuedAt)!==null&&a!==void 0?a:new Date,expirationTime:(l=p==null?void 0:p.signInWithEthereum)===null||l===void 0?void 0:l.expirationTime,notBefore:(c=p==null?void 0:p.signInWithEthereum)===null||c===void 0?void 0:c.notBefore,requestId:(d=p==null?void 0:p.signInWithEthereum)===null||d===void 0?void 0:d.requestId,resources:(h=p==null?void 0:p.signInWithEthereum)===null||h===void 0?void 0:h.resources};g=No(z),y=await v.request({method:"personal_sign",params:[Wo(g),I]})}try{const{data:m,error:b}=await F(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:g,signature:y},!((f=e.options)===null||f===void 0)&&f.captchaToken?{gotrue_meta_security:{captcha_token:(u=e.options)===null||u===void 0?void 0:u.captchaToken}}:null),xform:ve});if(b)throw b;if(!m||!m.session||!m.user){const x=new Je;return this._returnResult({data:{user:null,session:null},error:x})}return m.session&&(await this._saveSession(m.session),await this._notifyAllSubscribers("SIGNED_IN",m.session)),this._returnResult({data:Object.assign({},m),error:b})}catch(m){if(B(m))return this._returnResult({data:{user:null,session:null},error:m});throw m}}async signInWithSolana(e){var r,i,s,o,a,l,c,d,h,f,u,g;let y,m;if("message"in e)y=e.message,m=e.signature;else{const{chain:b,wallet:x,statement:p,options:v}=e;let w;if(he())if(typeof x=="object")w=x;else{const I=window;if("solana"in I&&typeof I.solana=="object"&&("signIn"in I.solana&&typeof I.solana.signIn=="function"||"signMessage"in I.solana&&typeof I.solana.signMessage=="function"))w=I.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof x!="object"||!(v!=null&&v.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");w=x}const H=new URL((r=v==null?void 0:v.url)!==null&&r!==void 0?r:window.location.href);if("signIn"in w&&w.signIn){const I=await w.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},v==null?void 0:v.signInWithSolana),{version:"1",domain:H.host,uri:H.href}),p?{statement:p}:null));let C;if(Array.isArray(I)&&I[0]&&typeof I[0]=="object")C=I[0];else if(I&&typeof I=="object"&&"signedMessage"in I&&"signature"in I)C=I;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in C&&"signature"in C&&(typeof C.signedMessage=="string"||C.signedMessage instanceof Uint8Array)&&C.signature instanceof Uint8Array)y=typeof C.signedMessage=="string"?C.signedMessage:new TextDecoder().decode(C.signedMessage),m=C.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in w)||typeof w.signMessage!="function"||!("publicKey"in w)||typeof w!="object"||!w.publicKey||!("toBase58"in w.publicKey)||typeof w.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");y=[`${H.host} wants you to sign in with your Solana account:`,w.publicKey.toBase58(),...p?["",p,""]:[""],"Version: 1",`URI: ${H.href}`,`Issued At: ${(s=(i=v==null?void 0:v.signInWithSolana)===null||i===void 0?void 0:i.issuedAt)!==null&&s!==void 0?s:new Date().toISOString()}`,...!((o=v==null?void 0:v.signInWithSolana)===null||o===void 0)&&o.notBefore?[`Not Before: ${v.signInWithSolana.notBefore}`]:[],...!((a=v==null?void 0:v.signInWithSolana)===null||a===void 0)&&a.expirationTime?[`Expiration Time: ${v.signInWithSolana.expirationTime}`]:[],...!((l=v==null?void 0:v.signInWithSolana)===null||l===void 0)&&l.chainId?[`Chain ID: ${v.signInWithSolana.chainId}`]:[],...!((c=v==null?void 0:v.signInWithSolana)===null||c===void 0)&&c.nonce?[`Nonce: ${v.signInWithSolana.nonce}`]:[],...!((d=v==null?void 0:v.signInWithSolana)===null||d===void 0)&&d.requestId?[`Request ID: ${v.signInWithSolana.requestId}`]:[],...!((f=(h=v==null?void 0:v.signInWithSolana)===null||h===void 0?void 0:h.resources)===null||f===void 0)&&f.length?["Resources",...v.signInWithSolana.resources.map(C=>`- ${C}`)]:[]].join(`
`);const I=await w.signMessage(new TextEncoder().encode(y),"utf8");if(!I||!(I instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");m=I}}try{const{data:b,error:x}=await F(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:y,signature:Me(m)},!((u=e.options)===null||u===void 0)&&u.captchaToken?{gotrue_meta_security:{captcha_token:(g=e.options)===null||g===void 0?void 0:g.captchaToken}}:null),xform:ve});if(x)throw x;if(!b||!b.session||!b.user){const p=new Je;return this._returnResult({data:{user:null,session:null},error:p})}return b.session&&(await this._saveSession(b.session),await this._notifyAllSubscribers("SIGNED_IN",b.session)),this._returnResult({data:Object.assign({},b),error:x})}catch(b){if(B(b))return this._returnResult({data:{user:null,session:null},error:b});throw b}}async _exchangeCodeForSession(e){const r=await We(this.storage,`${this.storageKey}-code-verifier`),[i,s]=(r??"").split("/");try{if(!i&&this.flowType==="pkce")throw new ro;const{data:o,error:a}=await F(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:i},xform:ve});if(await de(this.storage,`${this.storageKey}-code-verifier`),a)throw a;if(!o||!o.session||!o.user){const l=new Je;return this._returnResult({data:{user:null,session:null,redirectType:null},error:l})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",o.session)),this._returnResult({data:Object.assign(Object.assign({},o),{redirectType:s??null}),error:a})}catch(o){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(o))return this._returnResult({data:{user:null,session:null,redirectType:null},error:o});throw o}}async signInWithIdToken(e){try{const{options:r,provider:i,token:s,access_token:o,nonce:a}=e,l=await F(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:i,id_token:s,access_token:o,nonce:a,gotrue_meta_security:{captcha_token:r==null?void 0:r.captchaToken}},xform:ve}),{data:c,error:d}=l;if(d)return this._returnResult({data:{user:null,session:null},error:d});if(!c||!c.session||!c.user){const h=new Je;return this._returnResult({data:{user:null,session:null},error:h})}return c.session&&(await this._saveSession(c.session),await this._notifyAllSubscribers("SIGNED_IN",c.session)),this._returnResult({data:c,error:d})}catch(r){if(B(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOtp(e){var r,i,s,o,a;try{if("email"in e){const{email:l,options:c}=e;let d=null,h=null;this.flowType==="pkce"&&([d,h]=await Ge(this.storage,this.storageKey));const{error:f}=await F(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:l,data:(r=c==null?void 0:c.data)!==null&&r!==void 0?r:{},create_user:(i=c==null?void 0:c.shouldCreateUser)!==null&&i!==void 0?i:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},code_challenge:d,code_challenge_method:h},redirectTo:c==null?void 0:c.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:f})}if("phone"in e){const{phone:l,options:c}=e,{data:d,error:h}=await F(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:l,data:(s=c==null?void 0:c.data)!==null&&s!==void 0?s:{},create_user:(o=c==null?void 0:c.shouldCreateUser)!==null&&o!==void 0?o:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},channel:(a=c==null?void 0:c.channel)!==null&&a!==void 0?a:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:d==null?void 0:d.message_id},error:h})}throw new Ct("You must provide either an email or phone number.")}catch(l){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(l))return this._returnResult({data:{user:null,session:null},error:l});throw l}}async verifyOtp(e){var r,i;try{let s,o;"options"in e&&(s=(r=e.options)===null||r===void 0?void 0:r.redirectTo,o=(i=e.options)===null||i===void 0?void 0:i.captchaToken);const{data:a,error:l}=await F(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:o}}),redirectTo:s,xform:ve});if(l)throw l;if(!a)throw new Error("An error occurred on token verification.");const c=a.session,d=a.user;return c!=null&&c.access_token&&(await this._saveSession(c),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",c)),this._returnResult({data:{user:d,session:c},error:null})}catch(s){if(B(s))return this._returnResult({data:{user:null,session:null},error:s});throw s}}async signInWithSSO(e){var r,i,s,o,a;try{let l=null,c=null;this.flowType==="pkce"&&([l,c]=await Ge(this.storage,this.storageKey));const d=await F(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(i=(r=e.options)===null||r===void 0?void 0:r.redirectTo)!==null&&i!==void 0?i:void 0}),!((s=e==null?void 0:e.options)===null||s===void 0)&&s.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:l,code_challenge_method:c}),headers:this.headers,xform:Io});return!((o=d.data)===null||o===void 0)&&o.url&&he()&&!(!((a=e.options)===null||a===void 0)&&a.skipBrowserRedirect)&&window.location.assign(d.data.url),this._returnResult(d)}catch(l){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(l))return this._returnResult({data:null,error:l});throw l}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:r},error:i}=e;if(i)throw i;if(!r)throw new ge;const{error:s}=await F(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:r.access_token});return this._returnResult({data:{user:null,session:null},error:s})})}catch(e){if(B(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{const r=`${this.url}/resend`;if("email"in e){const{email:i,type:s,options:o}=e,{error:a}=await F(this.fetch,"POST",r,{headers:this.headers,body:{email:i,type:s,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},redirectTo:o==null?void 0:o.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:a})}else if("phone"in e){const{phone:i,type:s,options:o}=e,{data:a,error:l}=await F(this.fetch,"POST",r,{headers:this.headers,body:{phone:i,type:s,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a==null?void 0:a.message_id},error:l})}throw new Ct("You must provide either an email or phone number and a type")}catch(r){if(B(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async getSession(){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async r=>r))}async _acquireLock(e,r){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const i=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),s=(async()=>(await i,await r()))();return this.pendingInLock.push((async()=>{try{await s}catch{}})()),s}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const i=r();for(this.pendingInLock.push((async()=>{try{await i}catch{}})()),await i;this.pendingInLock.length;){const s=[...this.pendingInLock];await Promise.all(s),this.pendingInLock.splice(0,s.length)}return await i}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const r=await this.__loadSession();return await e(r)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const r=await We(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",r),r!==null&&(this._isValidSession(r)?e=r:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const i=e.expires_at?e.expires_at*1e3-Date.now()<tr:!1;if(this._debug("#__loadSession()",`session has${i?"":" not"} expired`,"expires_at",e.expires_at),!i){if(this.userStorage){const a=await We(this.userStorage,this.storageKey+"-user");a!=null&&a.user?e.user=a.user:e.user=ir()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const a={value:this.suppressGetSessionWarning};e.user=jo(e.user,a),a.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}const{data:s,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{session:null},error:o}):this._returnResult({data:{session:s},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;const r=await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser());return r.data.user&&(this.suppressGetSessionWarning=!0),r}async _getUser(e){try{return e?await F(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:Te}):await this._useSession(async r=>{var i,s,o;const{data:a,error:l}=r;if(l)throw l;return!(!((i=a.session)===null||i===void 0)&&i.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new ge}:await F(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(o=(s=a.session)===null||s===void 0?void 0:s.access_token)!==null&&o!==void 0?o:void 0,xform:Te})})}catch(r){if(B(r))return rr(r)&&(await this._removeSession(),await de(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:r});throw r}}async updateUser(e,r={}){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,r))}async _updateUser(e,r={}){try{return await this._useSession(async i=>{const{data:s,error:o}=i;if(o)throw o;if(!s.session)throw new ge;const a=s.session;let l=null,c=null;this.flowType==="pkce"&&e.email!=null&&([l,c]=await Ge(this.storage,this.storageKey));const{data:d,error:h}=await F(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:r==null?void 0:r.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:l,code_challenge_method:c}),jwt:a.access_token,xform:Te});if(h)throw h;return a.user=d.user,await this._saveSession(a),await this._notifyAllSubscribers("USER_UPDATED",a),this._returnResult({data:{user:a.user},error:null})})}catch(i){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(i))return this._returnResult({data:{user:null},error:i});throw i}}async setSession(e){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new ge;const r=Date.now()/1e3;let i=r,s=!0,o=null;const{payload:a}=Ot(e.access_token);if(a.exp&&(i=a.exp,s=i<=r),s){const{data:l,error:c}=await this._callRefreshToken(e.refresh_token);if(c)return this._returnResult({data:{user:null,session:null},error:c});if(!l)return{data:{user:null,session:null},error:null};o=l}else{const{data:l,error:c}=await this._getUser(e.access_token);if(c)return this._returnResult({data:{user:null,session:null},error:c});o={access_token:e.access_token,refresh_token:e.refresh_token,user:l.user,token_type:"bearer",expires_in:i-r,expires_at:i},await this._saveSession(o),await this._notifyAllSubscribers("SIGNED_IN",o)}return this._returnResult({data:{user:o.user,session:o},error:null})}catch(r){if(B(r))return this._returnResult({data:{session:null,user:null},error:r});throw r}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async r=>{var i;if(!e){const{data:a,error:l}=r;if(l)throw l;e=(i=a.session)!==null&&i!==void 0?i:void 0}if(!(e!=null&&e.refresh_token))throw new ge;const{data:s,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{user:null,session:null},error:o}):s?this._returnResult({data:{user:s.user,session:s},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(r){if(B(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async _getSessionFromURL(e,r){try{if(!he())throw new Rt("No browser detected.");if(e.error||e.error_description||e.error_code)throw new Rt(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(r){case"implicit":if(this.flowType==="pkce")throw new Zr("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new Rt("Not a valid implicit grant flow url.");break;default:}if(r==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new Zr("No code detected.");const{data:p,error:v}=await this._exchangeCodeForSession(e.code);if(v)throw v;const w=new URL(window.location.href);return w.searchParams.delete("code"),window.history.replaceState(window.history.state,"",w.toString()),{data:{session:p.session,redirectType:null},error:null}}const{provider_token:i,provider_refresh_token:s,access_token:o,refresh_token:a,expires_in:l,expires_at:c,token_type:d}=e;if(!o||!l||!a||!d)throw new Rt("No session defined in URL");const h=Math.round(Date.now()/1e3),f=parseInt(l);let u=h+f;c&&(u=parseInt(c));const g=u-h;g*1e3<=rt&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${g}s, should have been closer to ${f}s`);const y=u-f;h-y>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",y,u,h):h-y<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",y,u,h);const{data:m,error:b}=await this._getUser(o);if(b)throw b;const x={provider_token:i,provider_refresh_token:s,access_token:o,expires_in:f,expires_at:u,refresh_token:a,token_type:d,user:m.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:x,redirectType:e.type},error:null})}catch(i){if(B(i))return this._returnResult({data:{session:null,redirectType:null},error:i});throw i}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl=="function"?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error_description)}async _isPKCECallback(e){const r=await We(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&r)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async r=>{var i;const{data:s,error:o}=r;if(o&&!rr(o))return this._returnResult({error:o});const a=(i=s.session)===null||i===void 0?void 0:i.access_token;if(a){const{error:l}=await this.admin.signOut(a,e);if(l&&!(eo(l)&&(l.status===404||l.status===401||l.status===403)||rr(l)))return this._returnResult({error:l})}return e!=="others"&&(await this._removeSession(),await de(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){const r=co(),i={id:r,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",r),this.stateChangeEmitters.delete(r)}};return this._debug("#onAuthStateChange()","registered callback with id",r),this.stateChangeEmitters.set(r,i),(async()=>(await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(r)})))(),{data:{subscription:i}}}async _emitInitialSession(e){return await this._useSession(async r=>{var i,s;try{const{data:{session:o},error:a}=r;if(a)throw a;await((i=this.stateChangeEmitters.get(e))===null||i===void 0?void 0:i.callback("INITIAL_SESSION",o)),this._debug("INITIAL_SESSION","callback id",e,"session",o)}catch(o){await((s=this.stateChangeEmitters.get(e))===null||s===void 0?void 0:s.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",o),console.error(o)}})}async resetPasswordForEmail(e,r={}){let i=null,s=null;this.flowType==="pkce"&&([i,s]=await Ge(this.storage,this.storageKey,!0));try{return await F(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:i,code_challenge_method:s,gotrue_meta_security:{captcha_token:r.captchaToken}},headers:this.headers,redirectTo:r.redirectTo})}catch(o){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(o))return this._returnResult({data:null,error:o});throw o}}async getUserIdentities(){var e;try{const{data:r,error:i}=await this.getUser();if(i)throw i;return this._returnResult({data:{identities:(e=r.user.identities)!==null&&e!==void 0?e:[]},error:null})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var r;try{const{data:i,error:s}=await this._useSession(async o=>{var a,l,c,d,h;const{data:f,error:u}=o;if(u)throw u;const g=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(a=e.options)===null||a===void 0?void 0:a.redirectTo,scopes:(l=e.options)===null||l===void 0?void 0:l.scopes,queryParams:(c=e.options)===null||c===void 0?void 0:c.queryParams,skipBrowserRedirect:!0});return await F(this.fetch,"GET",g,{headers:this.headers,jwt:(h=(d=f.session)===null||d===void 0?void 0:d.access_token)!==null&&h!==void 0?h:void 0})});if(s)throw s;return he()&&!(!((r=e.options)===null||r===void 0)&&r.skipBrowserRedirect)&&window.location.assign(i==null?void 0:i.url),this._returnResult({data:{provider:e.provider,url:i==null?void 0:i.url},error:null})}catch(i){if(B(i))return this._returnResult({data:{provider:e.provider,url:null},error:i});throw i}}async linkIdentityIdToken(e){return await this._useSession(async r=>{var i;try{const{error:s,data:{session:o}}=r;if(s)throw s;const{options:a,provider:l,token:c,access_token:d,nonce:h}=e,f=await F(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(i=o==null?void 0:o.access_token)!==null&&i!==void 0?i:void 0,body:{provider:l,id_token:c,access_token:d,nonce:h,link_identity:!0,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},xform:ve}),{data:u,error:g}=f;return g?this._returnResult({data:{user:null,session:null},error:g}):!u||!u.session||!u.user?this._returnResult({data:{user:null,session:null},error:new Je}):(u.session&&(await this._saveSession(u.session),await this._notifyAllSubscribers("USER_UPDATED",u.session)),this._returnResult({data:u,error:g}))}catch(s){if(await de(this.storage,`${this.storageKey}-code-verifier`),B(s))return this._returnResult({data:{user:null,session:null},error:s});throw s}})}async unlinkIdentity(e){try{return await this._useSession(async r=>{var i,s;const{data:o,error:a}=r;if(a)throw a;return await F(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(s=(i=o.session)===null||i===void 0?void 0:i.access_token)!==null&&s!==void 0?s:void 0})})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async _refreshAccessToken(e){const r=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(r,"begin");try{const i=Date.now();return await fo(async s=>(s>0&&await po(200*Math.pow(2,s-1)),this._debug(r,"refreshing attempt",s),await F(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:ve})),(s,o)=>{const a=200*Math.pow(2,s);return o&&nr(o)&&Date.now()+a-i<rt})}catch(i){if(this._debug(r,"error",i),B(i))return this._returnResult({data:{session:null,user:null},error:i});throw i}finally{this._debug(r,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,r){const i=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:r.redirectTo,scopes:r.scopes,queryParams:r.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",r,"url",i),he()&&!r.skipBrowserRedirect&&window.location.assign(i),{data:{provider:e,url:i},error:null}}async _recoverAndRefresh(){var e,r;const i="#_recoverAndRefresh()";this._debug(i,"begin");try{const s=await We(this.storage,this.storageKey);if(s&&this.userStorage){let a=await We(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!a&&(a={user:s.user},await nt(this.userStorage,this.storageKey+"-user",a)),s.user=(e=a==null?void 0:a.user)!==null&&e!==void 0?e:ir()}else if(s&&!s.user&&!s.user){const a=await We(this.storage,this.storageKey+"-user");a&&(a!=null&&a.user)?(s.user=a.user,await de(this.storage,this.storageKey+"-user"),await nt(this.storage,this.storageKey,s)):s.user=ir()}if(this._debug(i,"session from storage",s),!this._isValidSession(s)){this._debug(i,"session is not valid"),s!==null&&await this._removeSession();return}const o=((r=s.expires_at)!==null&&r!==void 0?r:1/0)*1e3-Date.now()<tr;if(this._debug(i,`session has${o?"":" not"} expired with margin of ${tr}s`),o){if(this.autoRefreshToken&&s.refresh_token){const{error:a}=await this._callRefreshToken(s.refresh_token);a&&(console.error(a),nr(a)||(this._debug(i,"refresh failed with a non-retryable error, removing the session",a),await this._removeSession()))}}else if(s.user&&s.user.__isUserNotAvailableProxy===!0)try{const{data:a,error:l}=await this._getUser(s.access_token);!l&&(a!=null&&a.user)?(s.user=a.user,await this._saveSession(s),await this._notifyAllSubscribers("SIGNED_IN",s)):this._debug(i,"could not get user data, skipping SIGNED_IN notification")}catch(a){console.error("Error getting user data:",a),this._debug(i,"error getting user data, skipping SIGNED_IN notification",a)}else await this._notifyAllSubscribers("SIGNED_IN",s)}catch(s){this._debug(i,"error",s),console.error(s);return}finally{this._debug(i,"end")}}async _callRefreshToken(e){var r,i;if(!e)throw new ge;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const s=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(s,"begin");try{this.refreshingDeferred=new Yt;const{data:o,error:a}=await this._refreshAccessToken(e);if(a)throw a;if(!o.session)throw new ge;await this._saveSession(o.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",o.session);const l={data:o.session,error:null};return this.refreshingDeferred.resolve(l),l}catch(o){if(this._debug(s,"error",o),B(o)){const a={data:null,error:o};return nr(o)||await this._removeSession(),(r=this.refreshingDeferred)===null||r===void 0||r.resolve(a),a}throw(i=this.refreshingDeferred)===null||i===void 0||i.reject(o),o}finally{this.refreshingDeferred=null,this._debug(s,"end")}}async _notifyAllSubscribers(e,r,i=!0){const s=`#_notifyAllSubscribers(${e})`;this._debug(s,"begin",r,`broadcast = ${i}`);try{this.broadcastChannel&&i&&this.broadcastChannel.postMessage({event:e,session:r});const o=[],a=Array.from(this.stateChangeEmitters.values()).map(async l=>{try{await l.callback(e,r)}catch(c){o.push(c)}});if(await Promise.all(a),o.length>0){for(let l=0;l<o.length;l+=1)console.error(o[l]);throw o[0]}}finally{this._debug(s,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0,await de(this.storage,`${this.storageKey}-code-verifier`);const r=Object.assign({},e),i=r.user&&r.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!i&&r.user&&await nt(this.userStorage,this.storageKey+"-user",{user:r.user});const s=Object.assign({},r);delete s.user;const o=nn(s);await nt(this.storage,this.storageKey,o)}else{const s=nn(r);await nt(this.storage,this.storageKey,s)}}async _removeSession(){this._debug("#_removeSession()"),this.suppressGetSessionWarning=!1,await de(this.storage,this.storageKey),await de(this.storage,this.storageKey+"-code-verifier"),await de(this.storage,this.storageKey+"-user"),this.userStorage&&await de(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&he()&&(window!=null&&window.removeEventListener)&&window.removeEventListener("visibilitychange",e)}catch(r){console.error("removing visibilitychange callback failed",r)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),rt);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e);const r=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=r,r&&typeof r=="object"&&typeof r.unref=="function"?r.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(r)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);const r=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,r&&clearTimeout(r)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async r=>{const{data:{session:i}}=r;if(!i||!i.refresh_token||!i.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const s=Math.floor((i.expires_at*1e3-e)/rt);this._debug("#_autoRefreshTokenTick()",`access token expires in ${s} ticks, a tick lasts ${rt}ms, refresh threshold is ${jr} ticks`),s<=jr&&await this._callRefreshToken(i.refresh_token)})}catch(r){console.error("Auto refresh tick failed with error. This is likely a transient error.",r)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e.isAcquireTimeout||e instanceof ei)this._debug("auto refresh token tick lock not available");else throw e}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!he()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug("#visibilityChangedCallback","error",e)}},window==null||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const r=`#_onVisibilityChanged(${e})`;this._debug(r,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>{if(document.visibilityState!=="visible"){this._debug(r,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,r,i){const s=[`provider=${encodeURIComponent(r)}`];if(i!=null&&i.redirectTo&&s.push(`redirect_to=${encodeURIComponent(i.redirectTo)}`),i!=null&&i.scopes&&s.push(`scopes=${encodeURIComponent(i.scopes)}`),this.flowType==="pkce"){const[o,a]=await Ge(this.storage,this.storageKey),l=new URLSearchParams({code_challenge:`${encodeURIComponent(o)}`,code_challenge_method:`${encodeURIComponent(a)}`});s.push(l.toString())}if(i!=null&&i.queryParams){const o=new URLSearchParams(i.queryParams);s.push(o.toString())}return i!=null&&i.skipBrowserRedirect&&s.push(`skip_http_redirect=${i.skipBrowserRedirect}`),`${e}?${s.join("&")}`}async _unenroll(e){try{return await this._useSession(async r=>{var i;const{data:s,error:o}=r;return o?this._returnResult({data:null,error:o}):await F(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(i=s==null?void 0:s.session)===null||i===void 0?void 0:i.access_token})})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async _enroll(e){try{return await this._useSession(async r=>{var i,s;const{data:o,error:a}=r;if(a)return this._returnResult({data:null,error:a});const l=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:c,error:d}=await F(this.fetch,"POST",`${this.url}/factors`,{body:l,headers:this.headers,jwt:(i=o==null?void 0:o.session)===null||i===void 0?void 0:i.access_token});return d?this._returnResult({data:null,error:d}):(e.factorType==="totp"&&c.type==="totp"&&(!((s=c==null?void 0:c.totp)===null||s===void 0)&&s.qr_code)&&(c.totp.qr_code=`data:image/svg+xml;utf-8,${c.totp.qr_code}`),this._returnResult({data:c,error:null}))})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async _verify(e){return this._acquireLock(this.lockAcquireTimeout,async()=>{try{return await this._useSession(async r=>{var i;const{data:s,error:o}=r;if(o)return this._returnResult({data:null,error:o});const a=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?zo(e.webauthn.credential_response):Uo(e.webauthn.credential_response)})}:{code:e.code}),{data:l,error:c}=await F(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:a,headers:this.headers,jwt:(i=s==null?void 0:s.session)===null||i===void 0?void 0:i.access_token});return c?this._returnResult({data:null,error:c}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+l.expires_in},l)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",l),this._returnResult({data:l,error:c}))})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}})}async _challenge(e){return this._acquireLock(this.lockAcquireTimeout,async()=>{try{return await this._useSession(async r=>{var i;const{data:s,error:o}=r;if(o)return this._returnResult({data:null,error:o});const a=await F(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(i=s==null?void 0:s.session)===null||i===void 0?void 0:i.access_token});if(a.error)return a;const{data:l}=a;if(l.type!=="webauthn")return{data:l,error:null};switch(l.webauthn.type){case"create":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:$o(l.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:Fo(l.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}})}async _challengeAndVerify(e){const{data:r,error:i}=await this._challenge({factorId:e.factorId});return i?this._returnResult({data:null,error:i}):await this._verify({factorId:e.factorId,challengeId:r.id,code:e.code})}async _listFactors(){var e;const{data:{user:r},error:i}=await this.getUser();if(i)return{data:null,error:i};const s={all:[],phone:[],totp:[],webauthn:[]};for(const o of(e=r==null?void 0:r.factors)!==null&&e!==void 0?e:[])s.all.push(o),o.status==="verified"&&s[o.factor_type].push(o);return{data:s,error:null}}async _getAuthenticatorAssuranceLevel(e){var r,i,s,o;if(e)try{const{payload:g}=Ot(e);let y=null;g.aal&&(y=g.aal);let m=y;const{data:{user:b},error:x}=await this.getUser(e);if(x)return this._returnResult({data:null,error:x});((i=(r=b==null?void 0:b.factors)===null||r===void 0?void 0:r.filter(w=>w.status==="verified"))!==null&&i!==void 0?i:[]).length>0&&(m="aal2");const v=g.amr||[];return{data:{currentLevel:y,nextLevel:m,currentAuthenticationMethods:v},error:null}}catch(g){if(B(g))return this._returnResult({data:null,error:g});throw g}const{data:{session:a},error:l}=await this.getSession();if(l)return this._returnResult({data:null,error:l});if(!a)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:c}=Ot(a.access_token);let d=null;c.aal&&(d=c.aal);let h=d;((o=(s=a.user.factors)===null||s===void 0?void 0:s.filter(g=>g.status==="verified"))!==null&&o!==void 0?o:[]).length>0&&(h="aal2");const u=c.amr||[];return{data:{currentLevel:d,nextLevel:h,currentAuthenticationMethods:u},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async r=>{const{data:{session:i},error:s}=r;return s?this._returnResult({data:null,error:s}):i?await F(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:i.access_token,xform:o=>({data:o,error:null})}):this._returnResult({data:null,error:new ge})})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async _approveAuthorization(e,r){try{return await this._useSession(async i=>{const{data:{session:s},error:o}=i;if(o)return this._returnResult({data:null,error:o});if(!s)return this._returnResult({data:null,error:new ge});const a=await F(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"approve"},xform:l=>({data:l,error:null})});return a.data&&a.data.redirect_url&&he()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(a.data.redirect_url),a})}catch(i){if(B(i))return this._returnResult({data:null,error:i});throw i}}async _denyAuthorization(e,r){try{return await this._useSession(async i=>{const{data:{session:s},error:o}=i;if(o)return this._returnResult({data:null,error:o});if(!s)return this._returnResult({data:null,error:new ge});const a=await F(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"deny"},xform:l=>({data:l,error:null})});return a.data&&a.data.redirect_url&&he()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(a.data.redirect_url),a})}catch(i){if(B(i))return this._returnResult({data:null,error:i});throw i}}async _listOAuthGrants(){try{return await this._useSession(async e=>{const{data:{session:r},error:i}=e;return i?this._returnResult({data:null,error:i}):r?await F(this.fetch,"GET",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:r.access_token,xform:s=>({data:s,error:null})}):this._returnResult({data:null,error:new ge})})}catch(e){if(B(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async r=>{const{data:{session:i},error:s}=r;return s?this._returnResult({data:null,error:s}):i?(await F(this.fetch,"DELETE",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:i.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new ge})})}catch(r){if(B(r))return this._returnResult({data:null,error:r});throw r}}async fetchJwk(e,r={keys:[]}){let i=r.keys.find(l=>l.kid===e);if(i)return i;const s=Date.now();if(i=this.jwks.keys.find(l=>l.kid===e),i&&this.jwks_cached_at+Zs>s)return i;const{data:o,error:a}=await F(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(a)throw a;return!o.keys||o.keys.length===0||(this.jwks=o,this.jwks_cached_at=s,i=o.keys.find(l=>l.kid===e),!i)?null:i}async getClaims(e,r={}){try{let i=e;if(!i){const{data:g,error:y}=await this.getSession();if(y||!g.session)return this._returnResult({data:null,error:y});i=g.session.access_token}const{header:s,payload:o,signature:a,raw:{header:l,payload:c}}=Ot(i);r!=null&&r.allowExpired||So(o.exp);const d=!s.alg||s.alg.startsWith("HS")||!s.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(s.kid,r!=null&&r.keys?{keys:r.keys}:r==null?void 0:r.jwks);if(!d){const{error:g}=await this.getUser(i);if(g)throw g;return{data:{claims:o,header:s,signature:a},error:null}}const h=wo(s.alg),f=await crypto.subtle.importKey("jwk",d,h,!0,["verify"]);if(!await crypto.subtle.verify(h,f,a,ao(`${l}.${c}`)))throw new Hr("Invalid JWT signature");return{data:{claims:o,header:s,signature:a},error:null}}catch(i){if(B(i))return this._returnResult({data:null,error:i});throw i}}}kt.nextInstanceID={};const Qo=kt,ea="2.100.1";let ut="";typeof Deno<"u"?ut="deno":typeof document<"u"?ut="web":typeof navigator<"u"&&navigator.product==="ReactNative"?ut="react-native":ut="node";const ta={"X-Client-Info":`supabase-js-${ut}/${ea}`},ra={headers:ta},na={schema:"public"},ia={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},sa={};function jt(t){"@babel/helpers - typeof";return jt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},jt(t)}function oa(t,e){if(jt(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e);if(jt(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function aa(t){var e=oa(t,"string");return jt(e)=="symbol"?e:e+""}function la(t,e,r){return(e=aa(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function un(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),r.push.apply(r,i)}return r}function se(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?un(Object(r),!0).forEach(function(i){la(t,i,r[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):un(Object(r)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(r,i))})}return t}const ca=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),da=()=>Headers,ha=(t,e,r)=>{const i=ca(r),s=da();return async(o,a)=>{var l;const c=(l=await e())!==null&&l!==void 0?l:t;let d=new s(a==null?void 0:a.headers);return d.has("apikey")||d.set("apikey",t),d.has("Authorization")||d.set("Authorization",`Bearer ${c}`),i(o,se(se({},a),{},{headers:d}))}};function ua(t){return t.endsWith("/")?t:t+"/"}function pa(t,e){var r,i;const{db:s,auth:o,realtime:a,global:l}=t,{db:c,auth:d,realtime:h,global:f}=e,u={db:se(se({},c),s),auth:se(se({},d),o),realtime:se(se({},h),a),storage:{},global:se(se(se({},f),l),{},{headers:se(se({},(r=f==null?void 0:f.headers)!==null&&r!==void 0?r:{}),(i=l==null?void 0:l.headers)!==null&&i!==void 0?i:{})}),accessToken:async()=>""};return t.accessToken?u.accessToken=t.accessToken:delete u.accessToken,u}function fa(t){const e=t==null?void 0:t.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(ua(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}var ga=class extends Qo{constructor(t){super(t)}},xa=class{constructor(t,e,r){var i,s;this.supabaseUrl=t,this.supabaseKey=e;const o=fa(t);if(!e)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",o),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",o),this.storageUrl=new URL("storage/v1",o),this.functionsUrl=new URL("functions/v1",o);const a=`sb-${o.hostname.split(".")[0]}-auth-token`,l={db:na,realtime:sa,auth:se(se({},ia),{},{storageKey:a}),global:ra},c=pa(r??{},l);if(this.storageKey=(i=c.auth.storageKey)!==null&&i!==void 0?i:"",this.headers=(s=c.global.headers)!==null&&s!==void 0?s:{},c.accessToken)this.accessToken=c.accessToken,this.auth=new Proxy({},{get:(h,f)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(f)} is not possible`)}});else{var d;this.auth=this._initSupabaseAuthClient((d=c.auth)!==null&&d!==void 0?d:{},this.headers,c.global.fetch)}this.fetch=ha(e,this._getAccessToken.bind(this),c.global.fetch),this.realtime=this._initRealtimeClient(se({headers:this.headers,accessToken:this._getAccessToken.bind(this)},c.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(h=>this.realtime.setAuth(h)).catch(h=>console.warn("Failed to set initial Realtime auth token:",h)),this.rest=new Di(new URL("rest/v1",o).href,{headers:this.headers,schema:c.db.schema,fetch:this.fetch,timeout:c.db.timeout,urlLengthLimit:c.db.urlLengthLimit}),this.storage=new Vs(this.storageUrl.href,this.headers,this.fetch,r==null?void 0:r.storage),c.accessToken||this._listenForAuthEvents()}get functions(){return new Ei(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(t){return this.rest.from(t)}schema(t){return this.rest.schema(t)}rpc(t,e={},r={head:!1,get:!1,count:void 0}){return this.rest.rpc(t,e,r)}channel(t,e={config:{}}){return this.realtime.channel(t,e)}getChannels(){return this.realtime.getChannels()}removeChannel(t){return this.realtime.removeChannel(t)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var t=this,e,r;if(t.accessToken)return await t.accessToken();const{data:i}=await t.auth.getSession();return(e=(r=i.session)===null||r===void 0?void 0:r.access_token)!==null&&e!==void 0?e:t.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:t,persistSession:e,detectSessionInUrl:r,storage:i,userStorage:s,storageKey:o,flowType:a,lock:l,debug:c,throwOnError:d},h,f){const u={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new ga({url:this.authUrl.href,headers:se(se({},u),h),storageKey:o,autoRefreshToken:t,persistSession:e,detectSessionInUrl:r,storage:i,userStorage:s,flowType:a,lock:l,debug:c,throwOnError:d,fetch:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(g=>g.toLowerCase()==="authorization")})}_initRealtimeClient(t){return new ms(this.realtimeUrl.href,se(se({},t),{},{params:se(se({},{apikey:this.supabaseKey}),t==null?void 0:t.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((t,e)=>{this._handleTokenChanged(t,"CLIENT",e==null?void 0:e.access_token)})}_handleTokenChanged(t,e,r){(t==="TOKEN_REFRESHED"||t==="SIGNED_IN")&&this.changedAccessToken!==r?(this.changedAccessToken=r,this.realtime.setAuth(r)):t==="SIGNED_OUT"&&(this.realtime.setAuth(),e=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}};const ma=(t,e,r)=>new xa(t,e,r);function ya(){if(typeof window<"u")return!1;const t=globalThis.process;if(!t)return!1;const e=t.version;if(e==null)return!1;const r=e.match(/^v(\d+)\./);return r?parseInt(r[1],10)<=18:!1}ya()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");const va="https://mhrfecweuvueoxkoderc.supabase.co",ba="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmZlY3dldXZ1ZW94a29kZXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTU3NDAsImV4cCI6MjA5MDI5MTc0MH0.zZDhedTM9tp1dZJ9zbS1T8GM3NZOadah-FXD-IwdNJw",Ce=ma(va,ba,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});async function Sa(){const{error:t}=await Ce.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});if(t)throw t}async function wa(){const{error:t}=await Ce.auth.signOut();if(t)throw t}const ni=S.createContext(null);function ka({children:t}){var a,l;const[e,r]=S.useState(null),[i,s]=S.useState(!0);S.useEffect(()=>{Ce.auth.getSession().then(({data:{session:d}})=>{r((d==null?void 0:d.user)??null),s(!1)});const{data:{subscription:c}}=Ce.auth.onAuthStateChange((d,h)=>{r((h==null?void 0:h.user)??null),s(!1)});return()=>c.unsubscribe()},[]);const o={user:e,loading:i,isLoggedIn:!!e,displayName:((a=e==null?void 0:e.user_metadata)==null?void 0:a.full_name)||(e==null?void 0:e.email)||null,avatarUrl:((l=e==null?void 0:e.user_metadata)==null?void 0:l.avatar_url)||null,signIn:Sa,signOut:wa};return n.jsx(ni.Provider,{value:o,children:t})}function Cr(){const t=S.useContext(ni);if(!t)throw new Error("useAuth must be used within AuthProvider");return t}function ja(){const{isLoggedIn:t,loading:e,displayName:r,avatarUrl:i,signIn:s,signOut:o}=Cr(),[a,l]=S.useState(!1);return e?n.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",background:"var(--bg3)",flexShrink:0}}):t?n.jsxs("div",{style:{position:"relative",flexShrink:0},children:[n.jsxs("button",{onClick:()=>l(c=>!c),style:{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"1px solid var(--border)",borderRadius:"20px",cursor:"pointer",padding:"3px 10px 3px 3px",fontFamily:"var(--font)",transition:"all 0.15s"},onMouseEnter:c=>c.currentTarget.style.borderColor="rgba(74,158,255,0.4)",onMouseLeave:c=>c.currentTarget.style.borderColor="var(--border)",children:[i?n.jsx("img",{src:i,alt:"",width:22,height:22,style:{borderRadius:"50%",flexShrink:0}}):n.jsx("div",{style:{width:22,height:22,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#fff",fontWeight:700},children:(r||"?")[0].toUpperCase()}),n.jsx("span",{className:"auth-btn-label",style:{fontSize:"12px",color:"var(--text2)",maxWidth:"80px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:(r==null?void 0:r.split(" ")[0])||"ユーザー"})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx("div",{onClick:()=>l(!1),style:{position:"fixed",inset:0,zIndex:998}}),n.jsxs("div",{style:{position:"absolute",top:"calc(100% + 6px)",right:0,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"8px",zIndex:999,minWidth:"180px",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"},children:[n.jsxs("div",{style:{padding:"8px 12px 10px",borderBottom:"1px solid var(--border)",marginBottom:"4px"},children:[n.jsx("div",{style:{fontSize:"12px",fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r}),n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginTop:"2px"},children:"カスタムテーマを同期中"})]}),n.jsx("button",{onClick:()=>{o(),l(!1)},style:{width:"100%",textAlign:"left",background:"none",border:"none",padding:"8px 12px",borderRadius:"6px",color:"var(--red)",fontSize:"13px",cursor:"pointer",fontFamily:"var(--font)",transition:"background 0.1s"},onMouseEnter:c=>c.currentTarget.style.background="rgba(255,83,112,0.08)",onMouseLeave:c=>c.currentTarget.style.background="none",children:"ログアウト"})]})]})]}):n.jsxs("button",{onClick:()=>s(),title:"Googleでログインするとカスタムテーマがどのデバイスでも同期されます",style:{display:"flex",alignItems:"center",gap:"6px",background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.3)",borderRadius:"6px",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",fontSize:"12px",fontWeight:600,padding:"5px 10px",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s"},onMouseEnter:c=>c.currentTarget.style.background="rgba(74,158,255,0.18)",onMouseLeave:c=>c.currentTarget.style.background="rgba(74,158,255,0.1)",children:[n.jsx(Aa,{}),n.jsx("span",{className:"auth-btn-label",children:"ログイン"})]})}function Aa(){return n.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",children:[n.jsx("path",{d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",fill:"#4285F4"}),n.jsx("path",{d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",fill:"#34A853"}),n.jsx("path",{d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",fill:"#FBBC05"}),n.jsx("path",{d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",fill:"#EA4335"})]})}const _a=()=>n.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 56 56",fill:"none",children:[n.jsx("line",{x1:"28",y1:"4",x2:"28",y2:"10",stroke:"#e63030",strokeWidth:"2.2",strokeLinecap:"round"}),n.jsx("line",{x1:"42",y1:"9",x2:"38",y2:"14",stroke:"#e63030",strokeWidth:"2.2",strokeLinecap:"round"}),n.jsx("line",{x1:"14",y1:"9",x2:"18",y2:"14",stroke:"#e63030",strokeWidth:"2.2",strokeLinecap:"round"}),n.jsx("line",{x1:"50",y1:"21",x2:"45",y2:"23",stroke:"#e63030",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("line",{x1:"6",y1:"21",x2:"11",y2:"23",stroke:"#e63030",strokeWidth:"1.8",strokeLinecap:"round"}),n.jsx("path",{d:"M11,31 A17,17 0 0,1 45,31",fill:"none",stroke:"#e63030",strokeWidth:"2.5"}),n.jsx("circle",{cx:"28",cy:"31",r:"5.5",fill:"#e63030"}),n.jsx("line",{x1:"3",y1:"31",x2:"11",y2:"31",stroke:"#e63030",strokeWidth:"2.2",strokeLinecap:"round"}),n.jsx("line",{x1:"45",y1:"31",x2:"53",y2:"31",stroke:"#e63030",strokeWidth:"2.2",strokeLinecap:"round"}),n.jsx("path",{d:"M3,43 Q9,36 15,43 Q21,50 27,43 Q33,36 39,43 Q45,50 51,43",stroke:"var(--text)",strokeWidth:"2.5",fill:"none",strokeLinecap:"round"})]});function Ha({status:t,onMenuClick:e,sidebarOpen:r,viewMode:i,onViewModeChange:s,onLogoClick:o}){return n.jsxs(n.Fragment,{children:[n.jsxs("header",{style:{position:"fixed",top:0,left:0,right:0,height:"var(--header)",background:"var(--bg2)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",zIndex:1e3,minWidth:0},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexShrink:0},children:[n.jsx("button",{onClick:e,className:"hamburger-btn",style:{display:"none",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text)",fontSize:"16px",width:"34px",height:"34px",padding:"0",cursor:"pointer",fontFamily:"var(--font)",flexShrink:0,alignItems:"center",justifyContent:"center",lineHeight:1},children:r?"✕":"☰"}),n.jsxs("button",{onClick:o,style:{display:"flex",alignItems:"center",gap:"8px",background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0},children:[n.jsx(_a,{}),n.jsxs("div",{style:{textAlign:"left"},className:"logo-text",children:[n.jsxs("div",{className:"logo-main",style:{fontSize:"16px",fontWeight:700,letterSpacing:"-0.01em",lineHeight:1.1,color:"var(--text)"},children:[n.jsx("span",{style:{color:"#e63030"},children:"Stock"}),"Wave",n.jsx("span",{style:{color:"#e63030",fontSize:"10px",marginLeft:"2px"},children:"JP"})]}),n.jsx("div",{className:"logo-sub",style:{fontSize:"7px",letterSpacing:"0.3em",color:"var(--text3)",fontWeight:600,marginTop:"1px"},children:"株　式　波　動"})]})]})]}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexShrink:0},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},className:"status-area",children:[n.jsx("span",{style:{width:"7px",height:"7px",borderRadius:"50%",display:"inline-block",flexShrink:0,background:t.is_open?"var(--green)":"var(--text3)",boxShadow:t.is_open?"0 0 7px var(--green)":"none"}}),n.jsx("span",{className:"status-label",style:{fontSize:"11px",color:"var(--text2)",whiteSpace:"nowrap"},children:t.label}),t.updatedAt&&n.jsx("span",{className:"status-updated",style:{fontSize:"10px",color:"var(--text3)",whiteSpace:"nowrap",marginLeft:"4px"},children:(()=>{const a=(t.updatedAt||"").match(/(\d{2}\/\d{2} \d{2}:\d{2})/);return"最終更新："+(a?a[1]:t.updatedAt.slice(0,16))})()})]}),n.jsx("div",{style:{display:"flex",gap:"2px",flexShrink:0,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"2px"},children:[{key:"pc",label:"🖥"},{key:"mobile",label:"📱"}].map(({key:a,label:l})=>n.jsx("button",{onClick:()=>s(a),style:{padding:"3px 9px",borderRadius:"4px",fontSize:"12px",border:"none",cursor:"pointer",fontFamily:"var(--font)",background:i===a?"var(--accent)":"transparent",color:i===a?"#fff":"var(--text3)",transition:"all 0.15s",flexShrink:0},children:l},a))}),n.jsx(ja,{})]})]}),n.jsx("style",{children:`
        @media (max-width: 900px) {
          .hamburger-btn  { display: flex !important; }
          .status-label   { display: none !important; }
          .status-updated { display: none !important; }
          .logo-text .logo-main { font-size: 13px !important; }
          .logo-text .logo-sub  { display: none !important; }
          .auth-btn-label { display: none !important; }
        }
        /* ② タブレット横向き（901px〜1200px）でもハンバーガー維持 */
        @media (min-width: 901px) and (max-width: 1200px) {
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 400px) {
          .status-area { display: none !important; }
        }
      `})]})}function Ia({pages:t,pagesOther:e,currentPage:r,onPageChange:i,isOpen:s,isMobile:o,onOpen:a,onClose:l,contactUrl:c}){const d=S.useRef(null),h=S.useRef(null);S.useEffect(()=>{if(!o)return;const m=x=>{d.current=x.touches[0].clientX,h.current=x.touches[0].clientY},b=x=>{if(d.current===null)return;const p=x.changedTouches[0].clientX-d.current,v=Math.abs(x.changedTouches[0].clientY-(h.current||0));if(Math.abs(p)<70||v>Math.abs(p)*.6){d.current=null;return}p>70&&d.current<40&&!s||p>130&&!s?a==null||a():p<-70&&s&&(l==null||l()),d.current=null};return document.addEventListener("touchstart",m,{passive:!0}),document.addEventListener("touchend",b,{passive:!0}),()=>{document.removeEventListener("touchstart",m),document.removeEventListener("touchend",b)}},[o,s,a,l]);const u={position:"fixed",top:"var(--header)",left:0,right:"auto",bottom:0,width:o?"min(280px, 75vw)":"var(--sidebar)",background:"var(--bg2)",borderRight:"1px solid var(--border)",borderLeft:"none",padding:o?"12px 6px":"16px 8px",overflowY:"auto",overflowX:"hidden",zIndex:900,transition:"transform 0.25s cubic-bezier(0.22,1,0.36,1)",transform:o&&!s?"translateX(-100%)":"translateX(0)",boxShadow:o&&s?"6px 0 24px rgba(0,0,0,0.4)":"none",WebkitOverflowScrolling:"touch"},g=({icon:m,label:b})=>{const x=r===b;return n.jsxs("button",{onClick:()=>i(b),style:{padding:o?"11px 10px":"7px 10px",minHeight:o?"44px":"auto",fontSize:"12px",color:x?"var(--text)":"var(--text2)",borderRadius:"6px",marginBottom:"2px",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",letterSpacing:"-0.01em",fontWeight:x?600:400,borderLeft:x?"3px solid var(--accent)":"3px solid transparent",borderRight:"none",borderTop:"none",borderBottom:"none",background:x?"rgba(74,158,255,0.12)":"transparent",width:"100%",textAlign:"left",fontFamily:"var(--font)",transition:"all 0.15s",overflow:"hidden"},onMouseEnter:p=>{x||(p.currentTarget.style.background="rgba(74,158,255,0.06)",p.currentTarget.style.color="#8aaad0")},onMouseLeave:p=>{x||(p.currentTarget.style.background="transparent",p.currentTarget.style.color="var(--text2)")},children:[n.jsx("span",{style:{fontSize:"13px",opacity:.75,flexShrink:0,width:"18px",textAlign:"center"},children:m}),n.jsx("span",{style:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1},children:b})]})},y=({children:m})=>n.jsx("div",{style:{fontSize:"9px",fontWeight:600,letterSpacing:"0.2em",color:"var(--text3)",textTransform:"uppercase",padding:"0 10px",margin:"16px 0 6px"},children:m});return n.jsxs("nav",{style:u,children:[n.jsx(y,{children:"MENU"}),t.map(({icon:m,label:b})=>n.jsx(g,{icon:m,label:b},b)),n.jsx(y,{children:"OTHER"}),e.map(({icon:m,label:b})=>n.jsx(g,{icon:m,label:b},b)),c&&n.jsxs("a",{href:c,target:"_blank",rel:"noopener noreferrer",style:{display:"flex",alignItems:"center",gap:"8px",padding:"9px 12px",fontSize:"13px",color:"var(--text2)",borderRadius:"6px",marginBottom:"1px",borderLeft:"2px solid transparent",borderRight:"2px solid transparent",borderTop:"none",borderBottom:"none",background:"transparent",textDecoration:"none",fontFamily:"var(--font)",transition:"all 0.15s"},onMouseEnter:m=>{m.currentTarget.style.background="rgba(74,158,255,0.06)",m.currentTarget.style.color="#8aaad0"},onMouseLeave:m=>{m.currentTarget.style.background="transparent",m.currentTarget.style.color="var(--text2)"},children:[n.jsx("span",{style:{fontSize:"13px",opacity:.7},children:"✉️"}),"お問い合わせ"]})]})}const Ke=["#ff4560","#ff8c42","#ffd166","#06d6a0","#4a9eff","#aa77ff"];function Ea({name:t,data:e,color:r}){if(!e||!e.length)return null;const i=e[e.length-1],s=i.pct>=0?"var(--red)":"var(--green)",o=r||s,a=e.map(u=>u.pct),l=Math.min(...a),c=Math.max(...a),d=120,h=44,f=a.map((u,g)=>`${2+g/Math.max(a.length-1,1)*(d-4)},${2+(1-(u-l)/(c-l||.01))*(h-4)}`).join(" ");return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",display:"flex",flexDirection:"column",gap:"6px",minWidth:0},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",fontWeight:600,letterSpacing:"0.05em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:t}),n.jsxs("div",{style:{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"8px"},children:[n.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:"16px",fontWeight:700,color:s,lineHeight:1},children:[i.pct>=0?"+":"",i.pct.toFixed(1),"%"]}),n.jsx("div",{style:{width:`${d}px`,height:`${h}px`,flexShrink:0,overflow:"hidden",maxWidth:"45%"},children:n.jsx("svg",{viewBox:`0 0 ${d} ${h}`,width:"100%",height:h,style:{display:"block",overflow:"hidden"},children:n.jsx("polyline",{points:f,fill:"none",stroke:o,strokeWidth:"1.8",strokeLinejoin:"round",strokeLinecap:"round"})})})]})]})}function Pa({macro:t}){const e=Object.keys(t);if(!e.length)return null;const r=new Set;e.forEach(p=>(t[p]||[]).forEach(v=>r.add(v.date)));const i=[...r].sort();if(!i.length)return null;const s=800,o=160,a=46,l=16,c=12,d=28,h={};e.forEach(p=>{const v=t[p]||[];if(!v.length)return;const w=v.map(z=>z.pct),H=Math.min(...w),C=Math.max(...w)-H||.01;h[p]=v.map(z=>({date:z.date,pct:z.pct,scaled:(z.pct-H)/C*80-40}))});const f=-45,u=45,g=p=>a+p/Math.max(i.length-1,1)*(s-a-l),y=p=>c+(1-(p-f)/(u-f))*(o-c-d),m=[-40,-20,0,20,40],b=Math.max(1,Math.floor(i.length/5)),x=[];for(let p=0;p<i.length;p+=b)x.push({i:p,date:i[p]});return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px",overflowX:"auto"},children:[n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"8px",marginBottom:"14px"},className:"macro-mini-grid",children:e.map((p,v)=>n.jsx(Ea,{name:p,data:t[p]||[],color:Ke[v%Ke.length]},p))}),n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"6px"},children:"▼ 期間内の相対変化トレンド（各指標の変動幅を均等に正規化）"}),n.jsxs("svg",{viewBox:`0 0 ${s} ${o}`,width:"100%",style:{display:"block",minWidth:"320px"},children:[m.map(p=>n.jsxs("g",{children:[n.jsx("line",{x1:a,y1:y(p),x2:s-l,y2:y(p),stroke:"rgba(74,120,200,0.07)",strokeWidth:"1"}),p===0&&n.jsx("line",{x1:a,y1:y(0),x2:s-l,y2:y(0),stroke:"rgba(74,120,200,0.25)",strokeWidth:"1",strokeDasharray:"4,4"}),n.jsx("text",{x:a-4,y:y(p)+3,textAnchor:"end",fill:"var(--text3)",fontSize:"8",fontFamily:"DM Mono",children:p>0?`+${p}`:p})]},p)),x.map(({i:p,date:v})=>n.jsx("text",{x:g(p),y:o-4,textAnchor:"middle",fill:"var(--text3)",fontSize:"9",fontFamily:"DM Sans",children:Ta(v)},v)),e.map((p,v)=>{const w=h[p]||[];if(!w.length)return null;const H=Ke[v%Ke.length],I=w.map(C=>{const z=i.indexOf(C.date);return z>=0?`${g(z)},${y(C.scaled)}`:null}).filter(Boolean);return I.length?n.jsx("polyline",{points:I.join(" "),fill:"none",stroke:H,strokeWidth:"2",strokeLinejoin:"round",strokeLinecap:"round",opacity:"0.85"},p):null})]}),n.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"10px",marginTop:"8px"},children:e.map((p,v)=>{const w=t[p]||[],H=w[w.length-1],I=Ke[v%Ke.length];return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},children:[n.jsx("div",{style:{width:"14px",height:"2px",background:I,borderRadius:"1px"}}),n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)"},children:p}),H&&n.jsxs("span",{style:{fontSize:"11px",fontFamily:"var(--mono)",color:I,fontWeight:700},children:[H.pct>=0?"+":"",H.pct.toFixed(1),"%"]})]},p)})}),n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginTop:"6px"},children:"※ETFベースの独自指標。Y軸は各指標の変動幅を正規化した相対値（実際の騰落率はカード参照）"})]})}function or({title:t}){return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",margin:"20px 0 12px"},children:[n.jsx("span",{style:{fontSize:"12px",fontWeight:700,color:"var(--text2)",letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"},children:t}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]})}function Ta(t){if(!t)return"";const e=t.includes("-")?"-":"/",r=t.split(e);if(r.length<3)return t;const i=r[0].slice(2),s=r[1],o=r[2];return`${i}.${s}/${o}`}const pn={半導体製造装置:"semiconductor-theme",半導体検査装置:"semiconductor-theme",半導体材料:"semiconductor-theme",メモリ:"semiconductor-theme",パワー半導体:"power-semiconductor",次世代半導体:"semiconductor-theme",生成AI:"ai-cloud-theme",AIデータセンター:"ai-cloud-theme",フィジカルAI:"physical-ai-edge-ai",AI半導体:"semiconductor-theme",AI人材:"education-hr-theme",エッジAI:"physical-ai-edge-ai","EV・電気自動車":"ev-green-theme",全固体電池:"ev-green-theme",自動運転:"ev-green-theme",ドローン:"drone-theme","輸送・物流":"transport-logistics-theme",造船:"shipbuilding-theme",再生可能エネルギー:"renewable-energy-theme",太陽光発電:"renewable-energy-theme",核融合発電:"renewable-energy-theme",原子力発電:"renewable-energy-theme",電力会社:"renewable-energy-theme",LNG:"inpex-analysis",石油:"inpex-analysis",蓄電池:"ev-green-theme","資源（水素・ヘリウム・水）":"rare-earth-resources-theme",IOWN:"optical-communication",光通信:"optical-communication",通信:"telecom-theme",量子コンピューター:"ai-cloud-theme",SaaS:"fintech-theme",ウェアラブル端末:"game-entertainment-theme",仮想通貨:"fintech-theme",ネット銀行:"banking-finance-theme","鉄鋼・素材":"steel-materials-theme",化学:"chemical-theme",建築資材:"construction-infra-theme",塗料:"chemical-theme","医薬品・バイオ":"pharma-bio-theme","ヘルスケア・介護":"healthcare-nursing-theme","薬局・ドラッグストア":"healthcare-nursing-theme","銀行・金融":"banking-finance-theme",地方銀行:"regional-bank-theme",保険:"insurance-theme",フィンテック:"fintech-theme",不動産:"real-estate-theme","建設・インフラ":"construction-infra-theme",国土強靭化計画:"national-resilience",下水道:"construction-infra-theme","食品・飲料":"food-beverage-theme","農業・フードテック":"agritech-foodtech-theme","小売・EC":"retail-ec-theme","観光・ホテル・レジャー":"tourism-hotel-theme",インバウンド:"inbound-theme","リユース・中古品":"retail-ec-theme","防衛・航空":"defense-theme","宇宙・衛星":"space-satellite-theme","ロボット・自動化":"robot-automation-theme","レアアース・資源":"rare-earth-resources-theme",バフェット銘柄:"sogo-shosha-analysis",サイバーセキュリティ:"cybersecurity-theme",警備:"cybersecurity-theme","脱炭素・ESG":"ev-green-theme","教育・HR・人材":"education-hr-theme",人材派遣:"education-hr-theme","ゲーム・エンタメ":"game-entertainment-theme"},Ca=[{date:"2026/04/19",tag:"NEW",title:"週次レポート機能追加（毎週金曜自動生成）"},{date:"2026/04/19",tag:"UPDATE",title:"カスタムテーマに資金フロー散布図を追加"},{date:"2026/04/19",tag:"UPDATE",title:"テーマヒートマップの期間別タブを削除・整理"},{date:"2026/04/15",tag:"UPDATE",title:"市場別詳細の銘柄定義を修正・重複解消"},{date:"2026/04/10",tag:"UPDATE",title:"メニュー名「ヒートマップ」を「テーマヒートマップ」に変更"},{date:"2026/04/01",tag:"UPDATE",title:"コラム8本追加・各記事説明文充実"},{date:"2026/03/31",tag:"UPDATE",title:"カスタムテーマ機能強化"},{date:"2026/03/14",tag:"NEW",title:"React版リリース"}],Ra=[...Ca].sort((t,e)=>e.date.localeCompare(t.date)).slice(0,3),fn={NEW:{bg:"rgba(255,83,112,0.15)",color:"var(--red)",border:"rgba(255,83,112,0.3)"},UPDATE:{bg:"rgba(91,156,246,0.12)",color:"var(--accent)",border:"rgba(91,156,246,0.25)"},INFO:{bg:"rgba(76,175,130,0.12)",color:"var(--green)",border:"rgba(76,175,130,0.25)"}};function Oa({lines:t}){let e=t;if(!e||(typeof e=="string"&&(e=e.split(`
`).filter(Boolean)),!Array.isArray(e)||!e.length))return null;const r=e.map((i,s)=>{if(typeof i!="string")return null;if(i.startsWith("【")){const a=i.indexOf("】");if(a<0)return n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",marginBottom:"4px",paddingLeft:"4px"},children:i},s);const l=i.slice(1,a),c=i.slice(a+1).trim();return n.jsxs("div",{style:{marginBottom:"10px",marginTop:s>0?"14px":"0"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--accent)",letterSpacing:"0.04em",marginBottom:"4px",borderLeft:"3px solid var(--accent)",paddingLeft:"8px"},children:l}),c&&n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",paddingLeft:"11px"},children:c})]},s)}if(["▲","▼","📊","🔥","❄️","↗","↘","💡","✅","⚠️","📉"].some(a=>i.startsWith(a))){const a=i.indexOf(" "),l=a>0?i.slice(0,a):i[0],c=a>0?i.slice(a+1):"",d=c.indexOf("："),h=d>0?c.slice(0,d):null,f=d>0?c.slice(d+1).trim():c;return n.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"7px",paddingLeft:"4px",alignItems:"flex-start"},children:[n.jsx("span",{style:{fontSize:"13px",flexShrink:0,marginTop:"1px",lineHeight:1.5},children:l}),n.jsxs("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",flex:1},children:[h&&n.jsxs("span",{style:{fontWeight:600,color:"var(--text)"},children:[h,"："]}),f]})]},s)}return n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",marginBottom:"4px",paddingLeft:"4px"},children:i},s)}).filter(Boolean);return n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px 18px",marginBottom:"20px"},children:r})}function Wa(t,e){var P,k,T,L;if(!t||!t.themes)return null;const r=t.summary;if(!r)return null;const i=t.themes,s=r.rise,o=r.fall,a=r.total,l=r.avg??0,c=s>=a*.7?"広範な上昇相場":s>=a*.55?"上昇優勢の相場":o>=a*.7?"広範な下落相場":o>=a*.55?"下落優勢の相場":"方向感の定まらない相場",d=[...i].sort((D,E)=>E.pct-D.pct).slice(0,3),h=[...i].sort((D,E)=>D.pct-E.pct).slice(0,3),f=[...i].filter(D=>(D.volume_chg||0)>20).sort((D,E)=>(E.volume_chg||0)-(D.volume_chg||0)).slice(0,3),u=i.filter(D=>D.pct>=5),g=i.filter(D=>D.pct<=-5),y=(e==null?void 0:e["国内主要株(1321)"])||(e==null?void 0:e["日経225連動型(1321)"]),m=(e==null?void 0:e["TOPIX連動型上場投信(1306)"])||(e==null?void 0:e.TOPIX指数)||(e==null?void 0:e["TOPIX連動型(1306)"])||(e==null?void 0:e["1306.T"]),b=e==null?void 0:e["S&P500 ETF(SPY)"],x=e==null?void 0:e.ドル円,p=y?(P=y[y.length-1])==null?void 0:P.pct:null,v=m?(k=m[m.length-1])==null?void 0:k.pct:null,w=b?(T=b[b.length-1])==null?void 0:T.pct:null,H=x?(L=x[x.length-1])==null?void 0:L.pct:null,I=[];if(I.push(`【マーケット概況】現在の日本株テーマ相場は${c}です。全${a}テーマ中${s}テーマが上昇・${o}テーマが下落し、テーマ平均騰落率は${l>=0?"+":""}${l.toFixed(2)}%。${u.length>0?`+5%超の急騰テーマが${u.length}個、`:""}${g.length>0?`-5%超の急落テーマが${g.length}個あります。`:""}`),p!=null||w!=null){const D=[p!=null?`日経225連動型${p>=0?"+":""}${p.toFixed(1)}%`:null,v!=null?`TOPIX連動型${v>=0?"+":""}${v.toFixed(1)}%`:null,w!=null?`S&P500 ${w>=0?"+":""}${w.toFixed(1)}%`:null,H!=null?`ドル円${H>=0?"+":""}${H.toFixed(1)}%`:null].filter(Boolean).join(" / "),E=w!=null?w>1?"リスクオン（米国株高）でテーマ株にも追い風。":w<-1?"リスクオフ（米国株安）で地合いは慎重。":"米国株は横ばい。":"";I.push(`【マクロ指標（参照期間）】${D}。${E}${H!=null?H>1?"円安傾向で輸出・グローバル銘柄に有利な環境。":H<-1?"円高傾向で内需・消費系に資金が向かいやすい局面。":"":""}`)}if(d.length&&d[0].pct>0){const D=d.filter(E=>E.pct>0).map(E=>`「${E.theme}」(${E.pct>=0?"+":""}${E.pct.toFixed(1)}%)`).join("、");I.push(`▲ 上昇が目立つテーマ：${D}。${f.length>0&&d.some(E=>f.some(O=>O.theme===E.theme))?`特に「${d[0].theme}」は出来高も急増しており、資金の本格流入が始まっている可能性がある。`:""}`)}if(h.length&&h[0].pct<0){const D=h.filter(E=>E.pct<0).map(E=>`「${E.theme}」(${E.pct.toFixed(1)}%)`).join("、");I.push(`▼ 下落が目立つテーマ：${D}。${g.length>3?"広範な売り圧力がかかっており、個別テーマの選別が重要。":"下落幅が大きく過熱感の解消や外部要因が影響している可能性がある。"}`)}f.length>0&&I.push(`📊 出来高が前期比+20%超で急増しているテーマ：「${f.map(D=>D.theme).join("」「")}」。出来高増加は大口資金の動きを先行して示すことが多く、今後の株価動向を見極めるうえで重要なシグナル。`);const C=u.filter(D=>f.some(E=>E.theme===D.theme));C.length>0&&I.push(`🔥 急騰かつ出来高急増テーマ：「${C.map(D=>D.theme).join("」「")}」。価格上昇と出来高増加が同時発生しており、強いトレンドの初期段階である可能性が高い。`);const z=g.filter(D=>f.some(E=>E.theme===D.theme));return z.length>0&&I.push(`📉 下落テーマでも出来高増加：「${z.map(D=>D.theme).join("」「")}」。売り圧力が強いが出来高増は底値模索の兆しの可能性もある。反転サインを確認してから判断したい。`),I.push(`💡 本日のポイント：${l>=2?"全体的に強い相場環境。強気テーマへの集中投資が奏功しやすい局面。":l<=-2?"全体的に弱い地合い。守備的なテーマ（通信・医薬品等）や現金比率を高める局面。":"方向感が定まらないため、モメンタムの強いテーマに絞り込み、出来高増加を確認してから参入するのが有効。"}`),I}function ii(){return n.jsx("span",{style:{display:"inline-flex",gap:"3px",alignItems:"center"},children:[0,.15,.3].map((t,e)=>n.jsx("span",{style:{display:"inline-block",width:"5px",height:"5px",borderRadius:"50%",background:"var(--accent)",animation:`pulse 1.2s ease-in-out ${t}s infinite`}},e))})}function Wt({label:t,value:e,valueColor:r,sub:i,delay:s=0,loading:o=!1,arrow:a=null}){return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px 18px",animation:`fadeUp 0.4s ease ${s}s both`,transition:"border-color 0.2s, transform 0.15s"},onMouseEnter:l=>{l.currentTarget.style.borderColor="rgba(91,156,246,0.3)",l.currentTarget.style.transform="translateY(-2px)"},onMouseLeave:l=>{l.currentTarget.style.borderColor="var(--border)",l.currentTarget.style.transform="translateY(0)"},children:[n.jsx("div",{style:{fontSize:"10px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text3)",textTransform:"uppercase",marginBottom:"10px"},children:t}),n.jsx("div",{style:{fontFamily:"var(--mono)",fontSize:"22px",fontWeight:700,letterSpacing:"-0.02em",lineHeight:1,marginBottom:"6px",color:r||"var(--text)"},children:o?n.jsx(ii,{}):e}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)"},children:i})]})}function Na({onNavigate:t}){var c,d,h,f;const{data:e,loading:r}=Ln("1mo"),{data:i,loading:s}=Bn("1mo"),o=(i==null?void 0:i.data)||{},a=r||s,l=e==null?void 0:e.summary;return n.jsxs("div",{style:{padding:"20px 24px 48px",maxWidth:"100%",overflowX:"hidden"},children:[n.jsxs("div",{style:{background:"linear-gradient(135deg,rgba(91,156,246,0.07) 0%,rgba(255,83,112,0.05) 100%)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px 24px",marginBottom:"16px",animation:"fadeUp 0.5s ease both"},children:[n.jsxs("h1",{style:{fontSize:"22px",fontWeight:700,letterSpacing:"-0.02em",color:"var(--text)",marginBottom:"8px"},children:[n.jsx("span",{style:{color:"var(--logo-red)"},children:"Stock"}),"Wave",n.jsx("span",{style:{color:"var(--logo-red)",fontSize:"13px"},children:"JP"})]}),n.jsx("p",{style:{fontSize:"13px",color:"var(--text)",lineHeight:1.7},className:"hero-desc",children:"日本株テーマの騰落率・出来高・売買代金を定期取得し、資金の流れをテーマ別に可視化。期間別テーマヒートマップや市場別詳細、解説コラムを組み合わせ、より実践的な投資分析をサポートします。"})]}),n.jsx(or,{title:"📣 お知らせ"}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"4px"},children:Ra.map((u,g)=>{const y=fn[u.tag]||fn.INFO;return n.jsxs("div",{onClick:()=>t==null?void 0:t("お知らせ"),style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"6px",padding:"7px 12px",display:"flex",alignItems:"center",gap:"8px",animation:`fadeUp 0.25s ease ${g*.05}s both`,minWidth:0,cursor:"pointer",transition:"border-color 0.15s"},onMouseEnter:m=>m.currentTarget.style.borderColor="rgba(74,158,255,0.4)",onMouseLeave:m=>m.currentTarget.style.borderColor="var(--border)",children:[n.jsx("span",{style:{fontSize:"9px",fontWeight:700,padding:"1px 7px",borderRadius:"20px",flexShrink:0,background:y.bg,color:y.color,border:`1px solid ${y.border}`},children:u.tag}),n.jsx("span",{style:{fontSize:"12px",fontWeight:600,color:"var(--text)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:u.title}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)",whiteSpace:"nowrap",flexShrink:0},children:u.date})]},g)})}),n.jsx(or,{title:"📊 マーケットサマリー（1ヶ月）"}),n.jsxs("div",{className:"responsive-grid-4",style:{marginBottom:"4px"},children:[n.jsx(Wt,{delay:.05,loading:a,label:"上昇テーマ",value:n.jsxs("span",{children:[l?l.rise:"-",n.jsx("span",{style:{fontSize:"14px",color:"var(--text3)",fontWeight:400},children:l?` / ${l.total}`:""})]}),valueColor:"var(--red)",arrow:l?l.rise>l.fall?"up":l.rise<l.fall?"down":null:null,sub:"全テーマ中"}),n.jsx(Wt,{delay:.1,loading:a,label:"平均騰落率",value:l?`${l.avg>=0?"+":""}${(c=l.avg)==null?void 0:c.toFixed(2)}%`:"-",valueColor:(l==null?void 0:l.avg)>=0?"var(--red)":"var(--green)",arrow:l?l.avg>=0?"up":"down":null,sub:"期間:1ヶ月"}),n.jsx(Wt,{delay:.15,loading:a,label:"資金流入TOP",value:n.jsx("span",{style:{fontSize:"14px",color:"var(--red)",fontWeight:700},children:((d=l==null?void 0:l.top)==null?void 0:d.theme)||"-"}),arrow:"up",sub:l!=null&&l.top?n.jsxs("span",{style:{color:"var(--red)",fontWeight:600},children:["+",l.top.pct.toFixed(1),"%"]}):"-"}),n.jsx(Wt,{delay:.2,loading:a,label:"資金流出TOP",value:n.jsx("span",{style:{fontSize:"14px",color:"var(--green)",fontWeight:700},children:((h=l==null?void 0:l.bot)==null?void 0:h.theme)||"-"}),arrow:"down",sub:l!=null&&l.bot?n.jsxs("span",{style:{color:"var(--green)",fontWeight:600},children:[l.bot.pct.toFixed(1),"%"]}):"-"})]}),!a&&e&&n.jsxs("div",{style:{background:"rgba(74,158,255,0.05)",border:"1px solid rgba(74,158,255,0.18)",borderRadius:"8px",padding:"12px 16px",marginBottom:"4px",animation:"fadeUp 0.4s ease 0.25s both"},children:[n.jsx("div",{style:{fontSize:"10px",fontWeight:700,color:"var(--accent)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"6px"},children:"📝 本日のマーケットコメント（自動生成・1ヶ月集計）"}),n.jsx(Oa,{lines:Wa(e,o)}),((f=e==null?void 0:e.themes)==null?void 0:f.length)>0&&t&&(()=>{const u=[...e.themes||[]].sort((g,y)=>y.pct-g.pct).slice(0,3);return n.jsxs("div",{style:{marginTop:"14px"},children:[n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"10px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"},children:"🔎 注目テーマ TOP3"}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"12px"},className:"top3-grid",children:u.map((g,y)=>{var m;return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 14px",borderTop:`3px solid ${y===0?"#ffd166":y===1?"rgba(192,192,192,0.6)":"rgba(205,127,50,0.6)"}`},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"4px",fontWeight:600},children:y===0?"🥇 注目テーマ No.1":y===1?"🥈 注目テーマ No.2":"🥉 注目テーマ No.3"}),n.jsxs("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:[g.theme,n.jsxs("span",{style:{marginLeft:"8px",fontSize:"12px",fontWeight:700,color:g.pct>=0?"var(--red)":"var(--green)",fontFamily:"var(--mono)"},children:[g.pct>=0?"+":"",(m=g.pct)==null?void 0:m.toFixed(1),"%"]})]}),n.jsxs("div",{style:{display:"flex",gap:"6px"},children:[n.jsx("button",{onClick:()=>t("テーマ別詳細",g.theme),style:{padding:"5px 12px",borderRadius:"5px",fontSize:"11px",background:"rgba(170,119,255,0.1)",border:"1px solid rgba(170,119,255,0.3)",color:"#aa77ff",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"📊 テーマ詳細へ"}),pn[g.theme]&&n.jsx("button",{onClick:()=>t("コラム・解説",pn[g.theme]),style:{padding:"5px 12px",borderRadius:"5px",fontSize:"11px",background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.2)",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"📖 解説コラムへ"})]})]},g.theme)})}),n.jsx("button",{onClick:()=>t("週次レポート"),style:{padding:"6px 14px",borderRadius:"6px",fontSize:"11px",background:"rgba(255,140,66,0.1)",border:"1px solid rgba(255,140,66,0.3)",color:"#ff8c42",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"📰 最新週次レポートを読む →"})]})})()]}),n.jsx(or,{title:"📈 マーケット指標・比較（1ヶ月）"}),a?n.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",padding:"12px 0"},children:n.jsx(ii,{})}):n.jsx(Pa,{macro:o}),n.jsx("style",{children:`
        .col-quick-grid { grid-template-columns: 1fr 1fr 1fr; }
        .macro-mini-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width:640px) {
          .col-quick-grid { grid-template-columns: 1fr !important; }
          .macro-mini-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .top3-grid { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width:640px) {
          .top3-grid { grid-template-columns: 1fr !important; }
        }
        .hero-desc { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (max-width:900px) {
          .hero-desc { white-space:normal !important; overflow:visible !important; text-overflow:unset !important; }
        }
      `})]})}const si="swjp_custom_themes_v2";function ar(){try{return JSON.parse(localStorage.getItem(si)||"[]")}catch{return[]}}function gn(t){localStorage.setItem(si,JSON.stringify(t)),window.dispatchEvent(new CustomEvent("swjp_themes_updated"))}async function Da(t){const{data:e,error:r}=await Ce.from("custom_themes").select("id, name, stocks, updated_at").eq("user_id",t).order("created_at",{ascending:!0});if(r)throw r;return(e||[]).map(i=>({id:i.id,name:i.name,stocks:i.stocks||[]}))}async function La(t,e){const{data:r,error:i}=await Ce.from("custom_themes").insert({user_id:t,name:e.name,stocks:e.stocks}).select("id").single();if(i)throw i;return r.id}async function Ba(t,e){const{error:r}=await Ce.from("custom_themes").update({name:e.name,stocks:e.stocks}).eq("id",t);if(r)throw r}async function Ma(t){const{error:e}=await Ce.from("custom_themes").delete().eq("id",t);if(e)throw e}function Rr(){const{user:t,isLoggedIn:e}=Cr(),[r,i]=S.useState([]),[s,o]=S.useState(!1);S.useEffect(()=>{let f=!1;if((async()=>{o(!0);try{if(e&&t){const g=await Da(t.id);f||i(g)}else f||i(ar())}catch(g){console.error("テーマ読み込みエラー:",g),f||i(ar())}finally{f||o(!1)}})(),!e){const g=()=>i(ar());return window.addEventListener("swjp_themes_updated",g),()=>{f=!0,window.removeEventListener("swjp_themes_updated",g)}}return()=>{f=!0}},[e,t==null?void 0:t.id]);const a=3,l=S.useCallback(async(f,u=null)=>{var g;if(u===null&&r.length>=a)return alert(`カスタムテーマは最大${a}つまで作成できます。
既存のテーマを削除してから追加してください。`),!1;if(e&&t)if(u!==null&&((g=r[u])!=null&&g.id))await Ba(r[u].id,f),i(y=>y.map((m,b)=>b===u?{...f,id:m.id}:m));else{const y=await La(t.id,f);i(m=>[...m,{...f,id:y}])}else{const y=u!==null?r.map((m,b)=>b===u?f:m):[...r,f];i(y),gn(y)}return!0},[e,t,r]),c=S.useCallback(async f=>{const u=r[f];if(e&&t&&(u!=null&&u.id))await Ma(u.id),i(g=>g.filter((y,m)=>m!==f));else{const g=r.filter((y,m)=>m!==f);i(g),gn(g)}},[e,t,r]),d=S.useCallback(async(f,u)=>{var m;const g=r[f];if(!g||(m=g.stocks)!=null&&m.find(b=>b.ticker===u.ticker))return;const y={...g,stocks:[...g.stocks||[],u]};await l(y,f)},[r,l]),h=S.useCallback(async(f,u)=>{f.trim()&&await l({name:f.trim(),stocks:[u]})},[l]);return{themes:r,syncing:s,saveTheme:l,deleteTheme:c,addStockToTheme:d,createThemeWithStock:h}}function $a(t){const e={n:t.name,s:t.stocks.map(r=>`${r.ticker}|${r.name}`)};return`?ct=${encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(e)))))}`}function Fa(t){try{const r=new URLSearchParams(t).get("ct");if(!r)return null;const i=JSON.parse(decodeURIComponent(escape(atob(r))));return{name:i.n,stocks:i.s.map(s=>{const[o,...a]=s.split("|");return{ticker:o,name:a.join("|")}})}}catch{return null}}function za({refreshing:t,lastUpdate:e,onRefresh:r}){const i=e?e.toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"}):null;return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"11px",color:"var(--text3)"},children:[t?n.jsxs(n.Fragment,{children:[n.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",style:{animation:"spin 1s linear infinite",flexShrink:0},children:n.jsx("circle",{cx:"6",cy:"6",r:"4.5",fill:"none",stroke:"var(--accent)",strokeWidth:"1.5",strokeDasharray:"14 7"})}),n.jsx("span",{style:{color:"var(--accent)"},children:"更新中..."})]}):n.jsxs(n.Fragment,{children:[n.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"var(--green)",display:"inline-block",flexShrink:0}}),i&&n.jsxs("span",{children:[i," 時点"]}),r&&n.jsx("button",{onClick:r,style:{background:"none",border:"none",cursor:"pointer",color:"var(--accent)",fontSize:"11px",padding:"0 4px",fontFamily:"var(--font)",textDecoration:"underline"},children:"再取得"})]}),n.jsx("style",{children:`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `})]})}const xn=[{label:"1日",value:"1d"},{label:"1週間",value:"5d"},{label:"1ヶ月",value:"1mo"},{label:"3ヶ月",value:"3mo"},{label:"6ヶ月",value:"6mo"},{label:"1年",value:"1y"}];function Ua(t){return t?t>=1e12?(t/1e12).toFixed(1)+"兆":t>=1e8?(t/1e8).toFixed(1)+"億":t>=1e4?(t/1e4).toFixed(1)+"万":t.toLocaleString():"0"}function Ja(){return n.jsxs("div",{style:{textAlign:"center",padding:"60px 0",color:"var(--text3)"},children:[[0,.15,.3].map((t,e)=>n.jsx("span",{style:{display:"inline-block",width:"7px",height:"7px",borderRadius:"50%",background:"var(--accent)",margin:"0 3px",animation:`pulse 1.2s ease-in-out ${t}s infinite`}},e)),n.jsx("div",{style:{marginTop:"14px",fontSize:"13px"},children:"データ取得中..."})]})}function Ga({lines:t}){let e=t;if(!e||(typeof e=="string"&&(e=e.split(`
`).filter(Boolean)),!Array.isArray(e)||!e.length))return null;const r=e.map((i,s)=>{if(typeof i!="string")return null;if(i.startsWith("【")){const a=i.indexOf("】");if(a<0)return n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",marginBottom:"4px",paddingLeft:"4px"},children:i},s);const l=i.slice(1,a),c=i.slice(a+1).trim();return n.jsxs("div",{style:{marginBottom:"10px",marginTop:s>0?"14px":"0"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--accent)",letterSpacing:"0.04em",marginBottom:"4px",borderLeft:"3px solid var(--accent)",paddingLeft:"8px"},children:l}),c&&n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",paddingLeft:"11px"},children:c})]},s)}if(["▲","▼","📊","🔥","❄️","↗","↘","💡","✅","⚠️","📉"].some(a=>i.startsWith(a))){const a=i.indexOf(" "),l=a>0?i.slice(0,a):i[0],c=a>0?i.slice(a+1):"",d=c.indexOf("："),h=d>0?c.slice(0,d):null,f=d>0?c.slice(d+1).trim():c;return n.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"7px",paddingLeft:"4px",alignItems:"flex-start"},children:[n.jsx("span",{style:{fontSize:"13px",flexShrink:0,marginTop:"1px",lineHeight:1.5},children:l}),n.jsxs("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",flex:1},children:[h&&n.jsxs("span",{style:{fontWeight:600,color:"var(--text)"},children:[h,"："]}),f]})]},s)}return n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:"1.8",marginBottom:"4px",paddingLeft:"4px"},children:i},s)}).filter(Boolean);return n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px 18px",marginBottom:"20px"},children:r})}function Va(t,e,r,i){var v,w;if(!t||!t.length)return null;const s={"1d":"本日","5d":"週間","1mo":"1ヶ月","3mo":"3ヶ月","6mo":"6ヶ月","1y":"1年間"}[r]||r,o=t.filter(H=>H.pct>0),a=t.filter(H=>H.pct<0),l=(e==null?void 0:e.avg)??0,c=t[0],d=t[t.length-1],h=t.filter(H=>H.pct>=5).map(H=>H.theme),f=t.filter(H=>H.pct<=-5).map(H=>H.theme),u=t.filter(H=>(H.volume_chg||0)>=30).map(H=>H.theme),g=(i==null?void 0:i.filter(H=>{var I;return(I=H.state)==null?void 0:I.includes("加速")}).map(H=>H.theme))||[],y=(i==null?void 0:i.filter(H=>{var I;return(I=H.state)==null?void 0:I.includes("失速")}).map(H=>H.theme))||[],m=[],b=l>=2?"強気":l>=.5?"やや強気":l<=-2?"弱気":l<=-.5?"やや弱気":"中立";m.push(`【${s}の全体概況】${s}の全30テーマを見ると、上昇${o.length}テーマ・下落${a.length}テーマで平均騰落率は${l>=0?"+":""}${l.toFixed(2)}%（${b}）。`),m.push(`最高騰テーマは「${c==null?void 0:c.theme}」(${(c==null?void 0:c.pct)>=0?"+":""}${(v=c==null?void 0:c.pct)==null?void 0:v.toFixed(2)}%)、最大下落テーマは「${d==null?void 0:d.theme}」(${(w=d==null?void 0:d.pct)==null?void 0:w.toFixed(2)}%)で、その差は${((c==null?void 0:c.pct)-(d==null?void 0:d.pct)).toFixed(1)}ptと${Math.abs((c==null?void 0:c.pct)-(d==null?void 0:d.pct))>15?"テーマ間の格差が大きい":"テーマ間のばらつきは比較的小さい"}。`),h.length>0&&m.push(`▲ +5%超の急騰テーマ：「${h.slice(0,3).join("」「")}」${h.length>3?`など${h.length}テーマ`:""}。強いトレンドが継続しており、資金集中が進んでいる可能性がある。`),f.length>0&&m.push(`▼ -5%超の下落テーマ：「${f.slice(0,3).join("」「")}」${f.length>3?`など${f.length}テーマ`:""}。過熱感の解消か、外部環境の悪化が影響している可能性がある。`),u.length>0&&m.push(`📊 出来高が前期比+30%超の急増テーマ：「${u.slice(0,3).join("」「")}」。価格変動に先立つ出来高増加は、大口資金の流入を示唆することが多い。`),g.length>0&&m.push(`🔥 加速モメンタム（短期・中期ともに上昇が加速）：「${g.slice(0,4).join("」「")}」。既存トレンドが強まっており、追随資金が流入しやすい局面。`),y.length>0&&m.push(`❄️ 失速モメンタム（騰勢が鈍化または反転）：「${y.slice(0,4).join("」「")}」。天井形成の可能性を示す場合があるが、底値からの反発を見極める必要もある。`);const x=o.length-a.length,p=x>10?"広範な買い優勢で市場全体にリスクオンムードが漂う。":x<-10?"広範な売り優勢でリスクオフ傾向が強い。特定セクターへの集中も見られる。":"上昇・下落がまちまちで、個別テーマの選別が重要な局面。";return m.push(`💡 総合：${p}${h.length>0&&f.length>0?`一方で「${h[0]}」と「${f[0]}」の間に明確な強弱格差が生じており、テーマ選択の重要性が高まっている。`:""}`),m}const mn={半導体製造装置:"semiconductor-theme",半導体検査装置:"semiconductor-theme",半導体材料:"semiconductor-theme",メモリ:"semiconductor-theme",パワー半導体:"power-semiconductor",次世代半導体:"semiconductor-theme",生成AI:"ai-cloud-theme",AIデータセンター:"ai-cloud-theme",フィジカルAI:"physical-ai-edge-ai",AI半導体:"semiconductor-theme",AI人材:"education-hr-theme",エッジAI:"physical-ai-edge-ai","EV・電気自動車":"ev-green-theme",全固体電池:"ev-green-theme",自動運転:"ev-green-theme",ドローン:"drone-theme","輸送・物流":"transport-logistics-theme",造船:"shipbuilding-theme",再生可能エネルギー:"renewable-energy-theme",太陽光発電:"renewable-energy-theme",核融合発電:"renewable-energy-theme",原子力発電:"renewable-energy-theme",電力会社:"renewable-energy-theme",LNG:"inpex-analysis",石油:"inpex-analysis",蓄電池:"ev-green-theme","資源（水素・ヘリウム・水）":"rare-earth-resources-theme",IOWN:"optical-communication",光通信:"optical-communication",通信:"telecom-theme",量子コンピューター:"ai-cloud-theme",SaaS:"fintech-theme",ウェアラブル端末:"game-entertainment-theme",仮想通貨:"fintech-theme",ネット銀行:"banking-finance-theme","鉄鋼・素材":"steel-materials-theme",化学:"chemical-theme",建築資材:"construction-infra-theme",塗料:"chemical-theme","医薬品・バイオ":"pharma-bio-theme","ヘルスケア・介護":"healthcare-nursing-theme","薬局・ドラッグストア":"healthcare-nursing-theme","銀行・金融":"banking-finance-theme",地方銀行:"regional-bank-theme",保険:"insurance-theme",フィンテック:"fintech-theme",不動産:"real-estate-theme","建設・インフラ":"construction-infra-theme",国土強靭化計画:"national-resilience",下水道:"construction-infra-theme","食品・飲料":"food-beverage-theme","農業・フードテック":"agritech-foodtech-theme","小売・EC":"retail-ec-theme","観光・ホテル・レジャー":"tourism-hotel-theme",インバウンド:"inbound-theme","リユース・中古品":"retail-ec-theme","防衛・航空":"defense-theme","宇宙・衛星":"space-satellite-theme","ロボット・自動化":"robot-automation-theme","レアアース・資源":"rare-earth-resources-theme",バフェット銘柄:"sogo-shosha-analysis",サイバーセキュリティ:"cybersecurity-theme",警備:"cybersecurity-theme","脱炭素・ESG":"ev-green-theme","教育・HR・人材":"education-hr-theme",人材派遣:"education-hr-theme","ゲーム・エンタメ":"game-entertainment-theme"},qa=[{label:"🔥 注目ゾーン（右上）",desc:"上昇＋出来高急増＝最強シグナル",color:"#ff5370"},{label:"⚠️ 売り圧力（左上）",desc:"下落＋出来高急増＝強い売り",color:"#00c48c"},{label:"📈 静かな上昇（右下）",desc:"上昇＋出来高少＝じわり上昇",color:"#ff8c42"},{label:"❄️ 静かな下落（左下）",desc:"弱含みだが動意なし",color:"#4a9eff"}];function Nt({title:t,children:e,showZoneDesc:r=!1}){const[i,s]=S.useState(!1);return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"expandable-chart-wrap",children:[n.jsx("div",{className:"expandable-chart-preview",children:n.jsx("div",{style:{pointerEvents:"none",transformOrigin:"top left"},children:e})}),n.jsx("button",{className:"expandable-chart-btn",onClick:()=>s(!0),children:"🔍 クリックで拡大"}),n.jsx("div",{className:"expandable-chart-mobile",children:e})]}),i&&n.jsx("div",{onClick:()=>s(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2e3,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(4px)"},children:n.jsxs("div",{onClick:o=>o.stopPropagation(),style:{background:"var(--bg)",borderRadius:"12px",border:"1px solid var(--border)",padding:"16px",width:"min(80vw, 860px)",maxHeight:"80vh",overflowY:"auto",position:"relative"},children:[n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)"},children:t}),n.jsx("button",{onClick:()=>s(!1),style:{background:"rgba(255,255,255,0.08)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",fontSize:"13px",padding:"4px 12px",fontFamily:"var(--font)"},children:"✕ 閉じる"})]}),r&&n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px",marginBottom:"12px"},children:qa.map(o=>n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px",background:"var(--bg2)",borderRadius:"6px",padding:"6px 8px",border:"1px solid var(--border)"},children:[n.jsx("div",{style:{width:"8px",height:"8px",borderRadius:"50%",background:o.color,flexShrink:0}}),n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"10px",fontWeight:600,color:"var(--text)"},children:o.label}),n.jsx("div",{style:{fontSize:"9px",color:"var(--text3)"},children:o.desc})]})]},o.label))}),e]})})]})}function Ka({onNavigate:t}){const[e,r]=S.useState("1mo"),[i,s]=S.useState(null),{data:o}=Er(e),a=(o==null?void 0:o.data)||[];if(!a.length)return n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)",fontSize:"12px"},children:"データ読み込み中..."});const l=a.filter(j=>j.pct!=null&&!isNaN(j.pct)),c=800,d=380,h=54,f=24,u=32,g=44,y=c-h-f,m=d-u-g,b=l.map(j=>j.pct),x=l.map(j=>j.volume_chg??j.week_diff??0),p=l.map(j=>j.trade_value??0),v=Math.max(...p.filter(j=>j>0),1),w=Math.max((Math.max(...b)-Math.min(...b))*.15,1.5),H=Math.max((Math.max(...x)-Math.min(...x))*.15,2),I=Math.min(...b)-w,C=Math.max(...b)+w,z=Math.min(...x)-H,P=Math.max(...x)+H,k=j=>h+(j-I)/(C-I||1)*y,T=j=>u+m-(j-z)/(P-z||1)*m,L=j=>j>0?8+j/v*30:6,D=j=>j>=8?"#ff2244":j>=4?"#ff5370":j>=1.5?"#ff8c42":j>=0?"#e8a040":j>=-1.5?"#3db88a":j>=-4?"#00c48c":"#00a878",E=j=>j?j>=1e12?(j/1e12).toFixed(1)+"兆":j>=1e8?(j/1e8).toFixed(1)+"億":j>=1e4?(j/1e4).toFixed(1)+"万":j.toLocaleString():"-",O=k(0),J=T(0);return n.jsxs("div",{children:[n.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px"},children:[n.jsx("select",{value:e,onChange:j=>r(j.target.value),style:{background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"12px",padding:"4px 10px",cursor:"pointer"},children:[{v:"1d",l:"1日"},{v:"5d",l:"1週間"},{v:"1mo",l:"1ヶ月"},{v:"3mo",l:"3ヶ月"}].map(j=>n.jsx("option",{value:j.v,children:j.l},j.v))}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:"X=騰落率 Y=出来高急増率 円=売買代金"})]}),n.jsx("div",{style:{width:"100%",overflowX:"auto"},onMouseLeave:()=>s(null),children:n.jsxs("svg",{viewBox:`0 0 ${c} ${d}`,style:{width:"100%",minWidth:"320px",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:[n.jsx("rect",{x:O,y:u,width:h+y-O,height:J-u,fill:"rgba(255,83,112,0.07)",rx:"3"}),n.jsx("rect",{x:h,y:u,width:O-h,height:J-u,fill:"rgba(0,196,140,0.06)",rx:"3"}),n.jsx("rect",{x:O,y:J,width:h+y-O,height:u+m-J,fill:"rgba(255,140,66,0.04)",rx:"3"}),n.jsx("line",{x1:O,y1:u,x2:O,y2:u+m,stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.2",strokeDasharray:"5,3"}),n.jsx("line",{x1:h,y1:J,x2:h+y,y2:J,stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.2",strokeDasharray:"5,3"}),n.jsx("text",{x:O+6,y:u+14,fontSize:"10",fill:"rgba(255,83,112,0.8)",fontWeight:"700",children:"🔥 注目"}),n.jsx("text",{x:h+6,y:u+14,fontSize:"10",fill:"rgba(0,196,140,0.75)",fontWeight:"700",children:"⚠️ 売圧"}),n.jsx("text",{x:O+6,y:u+m-6,fontSize:"10",fill:"rgba(255,140,66,0.7)",children:"📈 静上昇"}),n.jsx("text",{x:h+6,y:u+m-6,fontSize:"10",fill:"rgba(74,158,255,0.65)",children:"❄️ 静下落"}),l.filter(j=>j.theme!==(i==null?void 0:i.theme)).map(j=>{const M=k(j.pct),Y=T(j.volume_chg??j.week_diff??0),Q=L(j.trade_value),ee=D(j.pct);return n.jsxs("g",{style:{cursor:"pointer"},onMouseEnter:()=>s(j),onClick:()=>t&&t("テーマ別詳細",j.theme),children:[n.jsx("circle",{cx:M,cy:Y,r:Q,fill:ee,opacity:"0.75",stroke:ee,strokeWidth:"0.5"}),Q>14&&n.jsx("text",{x:M,y:Y+3,textAnchor:"middle",fontSize:"7",fill:"white",fontWeight:"600",style:{pointerEvents:"none"},children:j.theme.slice(0,5)})]},j.theme)}),i&&(()=>{const j=i,M=k(j.pct),Y=T(j.volume_chg??j.week_diff??0),Q=L(j.trade_value),ee=D(j.pct),ne=Math.min(M,c-170),ce=Math.max(u+4,Y-Q-80);return n.jsxs("g",{style:{cursor:"pointer"},onMouseEnter:()=>s(j),onClick:()=>t&&t("テーマ別詳細",j.theme),children:[n.jsx("circle",{cx:M,cy:Y,r:Q+3,fill:"none",stroke:"white",strokeWidth:"2",strokeOpacity:"0.8"}),n.jsx("circle",{cx:M,cy:Y,r:Q,fill:ee,opacity:"0.9",stroke:ee,strokeWidth:"1.5"}),Q>10&&n.jsx("text",{x:M,y:Y+3,textAnchor:"middle",fontSize:"8",fill:"white",fontWeight:"700",style:{pointerEvents:"none"},children:j.theme.slice(0,6)}),n.jsxs("g",{style:{pointerEvents:"none"},children:[n.jsx("rect",{x:ne,y:ce,width:"164",height:"74",rx:"6",fill:"#1a1f2e",stroke:"rgba(255,255,255,0.2)",strokeWidth:"1"}),n.jsx("text",{x:ne+8,y:ce+16,fontSize:"11",fill:"#e8f0ff",fontWeight:"700",children:j.theme}),n.jsx("text",{x:ne+8,y:ce+32,fontSize:"10",fill:ee,children:"騰落率: "+(j.pct>=0?"+":"")+j.pct.toFixed(2)+"%"}),n.jsx("text",{x:ne+8,y:ce+47,fontSize:"10",fill:(j.volume_chg??0)>=0?"#ff8c42":"#4a9eff",children:"出来高増減: "+((j.volume_chg??0)>=0?"+":"")+(j.volume_chg??0).toFixed(0)+"%"}),n.jsx("text",{x:ne+8,y:ce+62,fontSize:"10",fill:"#8b949e",children:"売買代金: "+E(j.trade_value)})]})]},"hov")})()]})})]})}function Xe({title:t}){return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",margin:"28px 0 14px"},children:[n.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap"},children:t}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]})}function Ye({label:t,value:e,valueColor:r,sub:i,delay:s=0,arrow:o=null}){return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px 18px",animation:`fadeUp 0.4s ease ${s}s both`},children:[n.jsx("div",{style:{fontSize:"10px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text3)",textTransform:"uppercase",marginBottom:"10px"},children:t}),n.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:"22px",fontWeight:700,lineHeight:1,marginBottom:"6px",color:r||"var(--text)",display:"flex",alignItems:"center"},children:[e,o&&n.jsx("span",{style:{fontSize:"18px",marginLeft:"4px",color:o==="up"?"var(--red)":"var(--green)"},children:o==="up"?"↗":"↘"})]}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)"},children:i})]})}function yn({items:t,valueKey:e="pct",formatFn:r,colorFn:i,title:s,emptyMsg:o}){if(!t||!t.length)return n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px",textAlign:"center",color:"var(--text3)",fontSize:"12px"},children:o||"データなし"});const a=t.map(d=>d[e]||0),l=Math.max(...a.map(Math.abs),.01),c=d=>r?Ua(d):`${d>=0?"+":""}${d.toFixed(1)}%`;return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 14px"},children:[s&&n.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"var(--text3)",marginBottom:"10px",letterSpacing:"0.06em"},children:s}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:t.map((d,h)=>{const f=d[e]||0,u=i(f),g=Math.abs(f)/l*100;return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"110px 1fr 68px",alignItems:"center",gap:"8px",animation:`fadeUp 0.25s ease ${h*.02}s both`},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"},children:d.theme||d.name}),n.jsx("div",{style:{height:"14px",background:"rgba(255,255,255,0.04)",borderRadius:"3px",overflow:"hidden",position:"relative"},children:n.jsx("div",{style:{position:"absolute",height:"100%",width:`${g}%`,left:0,background:u,borderRadius:"3px",opacity:.85}})}),n.jsx("span",{style:{fontFamily:"var(--mono)",fontSize:"12px",fontWeight:700,textAlign:"right",color:u,whiteSpace:"nowrap"},children:c(f)})]},d.theme||d.name||h)})})]})}function vn({top5:t,bot5:e,topTitle:r,botTitle:i,topColorFn:s,botColorFn:o,valueKey:a,bot5ValueKey:l,formatFn:c}){return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},className:"top5-grid",children:[n.jsx(yn,{items:t,valueKey:a,formatFn:c,colorFn:s,title:r,emptyMsg:"上昇テーマなし"}),n.jsx(yn,{items:e,valueKey:l||a,formatFn:c,colorFn:o,title:i,emptyMsg:"下落テーマなし"})]})}function Xa({ct:t,period:e,pctColor:r,rank:i,volRankMap:s,tvRankMap:o}){const a=(t.stocks||[]).map(u=>u.ticker),{data:l,loading:c}=Ai(a,e),d=(l==null?void 0:l.pct)??null,h=u=>!u&&u!==0?"—":u>=1e12?(u/1e12).toFixed(1)+"兆":u>=1e8?(u/1e8).toFixed(1)+"億":u>=1e4?(u/1e4).toFixed(1)+"万":u.toLocaleString(),f=d!==null?r(d):"var(--text3)";return n.jsxs("div",{style:{background:"rgba(170,119,255,0.06)",border:"1px solid rgba(170,119,255,0.25)",borderRadius:"8px",padding:"8px 10px",display:"flex",gap:"8px",alignItems:"flex-start"},children:[n.jsx("div",{style:{minWidth:"22px",height:"22px",borderRadius:"5px",background:i<=3?"rgba(170,119,255,0.7)":"rgba(120,130,150,0.15)",color:i<=3?"#fff":"var(--text3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,fontFamily:"var(--mono)",flexShrink:0,marginTop:"1px"},children:"🎨"}),n.jsxs("div",{style:{flex:1,minWidth:0},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"#c8a8ff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"3px"},children:t.name}),c?n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)"},children:"取得中..."}):d!==null?n.jsxs(n.Fragment,{children:[n.jsxs("div",{style:{fontSize:"15px",fontWeight:700,color:f,fontFamily:"var(--mono)",lineHeight:1.2},children:[d>=0?"+":"",d.toFixed(2),"%"]}),n.jsx("div",{style:{height:"3px",background:"rgba(128,128,128,0.15)",borderRadius:"2px",margin:"4px 0"},children:n.jsx("div",{style:{width:`${Math.min(Math.abs(d)/25*100,100)}%`,height:"100%",background:f,borderRadius:"2px"}})}),n.jsxs("div",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)",lineHeight:1.7},children:[n.jsxs("span",{style:{display:"flex",justifyContent:"space-between"},children:[n.jsxs("span",{children:["出来高 ",h(l==null?void 0:l.volume)]}),(l==null?void 0:l.vol_rank)&&n.jsxs("span",{style:{color:"#378ADD"},children:["#",l.vol_rank]})]}),n.jsxs("span",{style:{display:"flex",justifyContent:"space-between"},children:[n.jsxs("span",{children:["売買代金 ",h(l==null?void 0:l.trade_value)]}),(l==null?void 0:l.tv_rank)&&n.jsxs("span",{style:{color:"#ff8c42"},children:["#",l.tv_rank]})]})]})]}):n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)"},children:"データなし"})]})]})}function Ya({themes:t,period:e,pctColor:r}){return n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"theme-card-grid",children:t.map((i,s)=>n.jsx(Xa,{ct:i,period:e,pctColor:r,rank:s+1},s))}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"8px"},children:"💡 詳細データはサイドメニュー「カスタムテーマ」から確認できます"})]})}function Za({item:t,rank:e,maxAbs:r,valueKey:i="pct",barColor:s,pctColor:o,pctRank:a,volRank:l,tvRank:c,onNavigate:d,momentumState:h,momentumPct:f}){const u=I=>I?I>=1e12?(I/1e12).toFixed(1)+"兆":I>=1e8?(I/1e8).toFixed(1)+"億":I>=1e4?(I/1e4).toFixed(1)+"万":I.toLocaleString():"0",g=(I,C)=>I?n.jsxs("span",{style:{fontSize:"9px",color:C||"var(--text3)",fontFamily:"var(--mono)",background:"rgba(128,128,128,0.1)",borderRadius:"3px",padding:"1px 4px",marginLeft:"4px"},children:["#",I]}):null,y=t.pct??0,m=t[i]??0,b=Math.min(r?Math.abs(m)/r*100:Math.abs(y)/25*100,100),x=o(y),p=Math.max(1-(e-1)*.028,.25),v=y>=0,w=i==="pct"?v?`rgba(226,75,74,${p})`:`rgba(29,158,117,${p})`:s||"#378ADD",H=e<=3;return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"8px 10px",display:"flex",gap:"8px",alignItems:"flex-start"},children:[n.jsx("div",{style:{minWidth:"22px",height:"22px",borderRadius:"5px",background:H?w:"rgba(120,130,150,0.15)",color:H?"#fff":"var(--text3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,fontFamily:"var(--mono)",flexShrink:0,marginTop:"1px"},children:e}),n.jsxs("div",{style:{flex:1,minWidth:0},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px",marginBottom:"3px",minWidth:0},children:[n.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0},children:t.theme}),i==="pct"&&h&&(()=>{const C={"🔥加速":"#ff4560","↗転換↑":"#ff8c42","→横ばい":"var(--text3)","↘転換↓":"#4a9eff","❄️失速":"#4a9eff"}[h]||"var(--text3)";return n.jsx("span",{style:{fontSize:"8px",fontWeight:700,color:C,flexShrink:0,background:`${C}18`,borderRadius:"8px",padding:"1px 5px",border:`1px solid ${C}40`,whiteSpace:"nowrap"},children:h})})()]}),i==="pct"?n.jsxs(n.Fragment,{children:[n.jsxs("div",{style:{fontSize:"15px",fontWeight:700,color:x,fontFamily:"var(--mono)",lineHeight:1.2},children:[y>=0?"+":"",y.toFixed(2),"%"]}),n.jsx("div",{style:{height:"3px",background:"rgba(128,128,128,0.15)",borderRadius:"2px",margin:"4px 0"},children:n.jsx("div",{style:{width:`${Math.min(Math.abs(y)/25*100,100)}%`,height:"100%",background:x,borderRadius:"2px"}})}),n.jsxs("div",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)",lineHeight:1.7},children:[n.jsxs("span",{style:{display:"flex",justifyContent:"space-between"},children:[n.jsxs("span",{children:["出来高 ",u(t.volume)]}),g(l,"#378ADD")]}),n.jsxs("span",{style:{display:"flex",justifyContent:"space-between"},children:[n.jsxs("span",{children:["売買代金 ",u(t.trade_value)]}),g(c,"#ff8c42")]})]}),d&&n.jsx("button",{onClick:I=>{I.stopPropagation(),d("テーマ別詳細",t.theme)},style:{marginTop:"6px",width:"100%",padding:"4px 0",background:"rgba(170,119,255,0.08)",border:"1px solid rgba(170,119,255,0.25)",borderRadius:"4px",color:"#aa77ff",cursor:"pointer",fontSize:"10px",fontFamily:"var(--font)",fontWeight:600},children:"📊 テーマ詳細を確認"}),mn[t.theme]&&d&&n.jsx("button",{onClick:I=>{I.stopPropagation(),d("コラム・解説",mn[t.theme])},style:{marginTop:"4px",width:"100%",padding:"4px 0",background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:"4px",color:"var(--accent)",cursor:"pointer",fontSize:"10px",fontFamily:"var(--font)",fontWeight:600},children:"📖 関連コラムを読む"})]}):i==="volume"?n.jsxs(n.Fragment,{children:[n.jsx("div",{style:{fontSize:"15px",fontWeight:700,color:"#378ADD",fontFamily:"var(--mono)",lineHeight:1.2},children:u(m)}),n.jsx("div",{style:{height:"3px",background:"rgba(128,128,128,0.15)",borderRadius:"2px",margin:"4px 0"},children:n.jsx("div",{style:{width:`${b}%`,height:"100%",background:"#378ADD",borderRadius:"2px"}})}),n.jsxs("div",{style:{fontSize:"10px",fontFamily:"var(--mono)",lineHeight:1.7},children:[n.jsxs("span",{style:{display:"flex",justifyContent:"space-between",color:x},children:[n.jsxs("span",{children:["騰落率 ",y>=0?"+":"",y.toFixed(2),"%"]}),g(a,x)]}),n.jsxs("span",{style:{display:"flex",justifyContent:"space-between",color:"#ff8c42"},children:[n.jsxs("span",{children:["売買代金 ",u(t.trade_value)]}),g(c,"#ff8c42")]})]})]}):n.jsxs(n.Fragment,{children:[n.jsx("div",{style:{fontSize:"15px",fontWeight:700,color:"#ff8c42",fontFamily:"var(--mono)",lineHeight:1.2},children:u(m)}),n.jsx("div",{style:{height:"3px",background:"rgba(128,128,128,0.15)",borderRadius:"2px",margin:"4px 0"},children:n.jsx("div",{style:{width:`${b}%`,height:"100%",background:"#ff8c42",borderRadius:"2px"}})}),n.jsxs("div",{style:{fontSize:"10px",fontFamily:"var(--mono)",lineHeight:1.7},children:[n.jsxs("span",{style:{display:"flex",justifyContent:"space-between",color:x},children:[n.jsxs("span",{children:["騰落率 ",y>=0?"+":"",y.toFixed(2),"%"]}),g(a,x)]}),n.jsxs("span",{style:{display:"flex",justifyContent:"space-between",color:"#378ADD"},children:[n.jsxs("span",{children:["出来高 ",u(t.volume)]}),g(l,"#378ADD")]})]})]})]})]})}function lr({items:t,pctColor:e,valueKey:r="pct",barColor:i,pctRankMap:s,volRankMap:o,tvRankMap:a,onNavigate:l,momentumMap:c}){const[d,h]=S.useState("top4"),f=4,u=10,g=d==="all"?t:d==="top10"?t.slice(0,u):t.slice(0,f),y=r==="pct"?0:Math.max(...g.map(m=>Math.abs(m[r]||0)),0);return n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"theme-card-grid",children:g.map((m,b)=>{var x,p;return n.jsx(Za,{item:m,rank:b+1,maxAbs:y,valueKey:r,barColor:i,pctColor:e,pctRank:s==null?void 0:s.get(m.theme),volRank:o==null?void 0:o.get(m.theme),tvRank:a==null?void 0:a.get(m.theme),onNavigate:l,momentumState:(x=c==null?void 0:c.get(m.theme))==null?void 0:x.state,momentumPct:(p=c==null?void 0:c.get(m.theme))==null?void 0:p.pct},m.theme)})}),n.jsxs("div",{style:{display:"flex",gap:"8px",marginTop:"12px",marginBottom:"4px",justifyContent:"center",flexWrap:"wrap"},children:[d!=="top4"&&n.jsx("button",{onClick:()=>h("top4"),style:{padding:"7px 18px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(255,255,255,0.05)",border:"1px solid var(--border)",color:"var(--text3)"},children:"▲ トップ4に戻す"}),d!=="top10"&&t.length>f&&n.jsx("button",{onClick:()=>h("top10"),style:{padding:"7px 18px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(74,158,255,0.08)",border:"1px solid rgba(74,158,255,0.3)",color:"var(--accent)"},children:"トップ10を表示"}),d!=="all"&&t.length>u&&n.jsxs("button",{onClick:()=>h("all"),style:{padding:"7px 18px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(255,140,66,0.08)",border:"1px solid rgba(255,140,66,0.3)",color:"#ff8c42"},children:["全",t.length,"テーマを表示"]})]})]})}const ue=["#4a9eff","#ff5370","#00c48c","#ffd166","#aa77ff","#ff8c42","#4ecdc4","#ff6b6b"];function Or({allThemes:t,selected:e,setSelected:r}){const[i,s]=S.useState(!1),o=a=>r(l=>l.includes(a)?l.filter(c=>c!==a):[...l,a]);return n.jsxs("div",{style:{marginBottom:"12px"},children:[n.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center",marginBottom:"8px"},children:[e.map((a,l)=>{const c=ue[l%ue.length];return n.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"3px 8px 3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:600,border:"1.5px solid "+c,background:c+"22",color:c},children:[a,n.jsx("button",{onClick:()=>o(a),style:{background:"none",border:"none",cursor:"pointer",color:c,fontSize:"12px",lineHeight:1,padding:"0 2px",fontFamily:"var(--font)"},children:"×"})]},a)}),n.jsx("button",{onClick:()=>s(a=>!a),style:{padding:"4px 12px",borderRadius:"20px",fontSize:"11px",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600,border:"1px dashed var(--accent)",background:"rgba(74,158,255,0.06)",color:"var(--accent)",transition:"all 0.15s"},children:i?"▲ 閉じる":"＋ テーマを追加する"}),e.length>0&&n.jsx("button",{onClick:()=>r([]),style:{padding:"4px 10px",borderRadius:"20px",fontSize:"10px",cursor:"pointer",fontFamily:"var(--font)",border:"1px solid var(--border)",background:"transparent",color:"var(--text3)",transition:"all 0.15s"},children:"すべて解除"})]}),i&&n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px 14px",marginBottom:"8px",maxHeight:"200px",overflowY:"auto"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"8px",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600},children:"テーマを選択（複数可）"}),n.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"5px"},children:t.map(a=>{const l=e.includes(a),c=l?ue[e.indexOf(a)%ue.length]:null;return n.jsxs("button",{onClick:()=>o(a),style:{padding:"3px 9px",borderRadius:"16px",fontSize:"10px",cursor:"pointer",fontFamily:"var(--font)",fontWeight:l?600:400,border:l?"1.5px solid "+c:"1px solid var(--border)",background:l?c+"22":"transparent",color:l?c:"var(--text3)",transition:"all 0.12s"},children:[l?"✓ ":"",a]},a)})})]})]})}function Qa({data:t,months:e,onNavigate:r}){const i=t?Object.keys(t):[],[s,o]=S.useState(()=>i.slice(0,3));if(S.useEffect(()=>{i.length>0&&s.length===0&&o(i.slice(0,3))},[i.length]),!t||!e||e.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)"},children:"データを読み込み中..."});const a=e.slice(-12),l=s.flatMap(P=>a.map(k=>{var T;return(T=t[P])==null?void 0:T[k]}).filter(k=>k!=null)),c=l.length?Math.min(...l):-10,d=l.length?Math.max(...l):10,h=5,f=Math.floor(c/h)*h-h,u=Math.ceil(d/h)*h+h,g=900,y=400,m=52,b=20,x=32,p=56,v=g-m-b,w=y-x-p,H=P=>m+P/Math.max(a.length-1,1)*v,I=P=>x+w-(P-f)/(u-f||1)*w,C=[];for(let P=f;P<=u;P+=h)C.push(P);const z=P=>{const k=P.split("/");return k.length>=2?k[0].slice(2)+"/"+k[1]:P};return n.jsxs("div",{children:[n.jsx(Or,{allThemes:i,selected:s,setSelected:o}),s.length>0?n.jsx("div",{style:{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"},children:n.jsxs("svg",{viewBox:"0 0 "+g+" "+y,style:{width:"100%",minWidth:"0",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:[C.includes(0)&&n.jsx("line",{x1:m,y1:I(0),x2:m+v,y2:I(0),stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.2",strokeDasharray:"4,3"}),C.map(P=>n.jsxs("g",{children:[n.jsx("line",{x1:m,y1:I(P),x2:m+v,y2:I(P),stroke:"rgba(255,255,255,0.07)",strokeWidth:"0.8"}),n.jsxs("text",{x:m-6,y:I(P)+4,textAnchor:"end",fontSize:"10",fill:"rgba(255,255,255,0.45)",children:[P>=0?"+":"",P,"%"]})]},P)),a.map((P,k)=>n.jsx("text",{x:H(k),y:x+w+18,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:z(P)},P)),s.map((P,k)=>{const T=ue[k%ue.length],L=a.map((E,O)=>{var J;return{i:O,v:(J=t[P])==null?void 0:J[E]}}).filter(E=>E.v!=null);if(L.length<2)return null;const D=L.map((E,O)=>(O===0?"M":"L")+H(E.i).toFixed(1)+","+I(E.v).toFixed(1)).join(" ");return n.jsxs("g",{children:[n.jsx("path",{d:D,fill:"none",stroke:T,strokeWidth:"2",strokeLinejoin:"round",strokeLinecap:"round",opacity:"0.9"}),L.map(E=>n.jsx("circle",{cx:H(E.i),cy:I(E.v),r:"3",fill:T,stroke:"var(--bg2)",strokeWidth:"1.5"},E.i))]},P)}),s.map((P,k)=>{const T=ue[k%ue.length];return n.jsxs("g",{children:[n.jsx("rect",{x:m+k*160,y:x-22,width:"12",height:"12",rx:"2",fill:T,opacity:"0.85"}),n.jsx("text",{x:m+k*160+16,y:x-12,fontSize:"10",fill:"rgba(255,255,255,0.75)",children:P.length>12?P.slice(0,12)+"…":P})]},P)})]})}):n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:"上のボタンでテーマを選択してください"})]})}function el({volTrendData:t,allThemeNames:e,months:r}){const[i,s]=S.useState(()=>(e||[]).slice(0,3));if(S.useEffect(()=>{(e==null?void 0:e.length)>0&&i.length===0&&s(e.slice(0,3))},[e==null?void 0:e.length]),!t||!e)return null;const o={};e.forEach(k=>{const T=t[`vol_trend_${k}`];if(!(T!=null&&T.dates))return;const L={};T.dates.forEach((D,E)=>{var J;const O=D.slice(0,7).replace("-","/");L[O]||(L[O]=0),L[O]+=((J=T.volumes)==null?void 0:J[E])||0}),o[k]=L});const a=r.slice(-12),l=i.flatMap(k=>a.map(T=>{var L;return((L=o[k])==null?void 0:L[T])||0})),c=Math.max(...l,1),d=900,h=340,f=80,u=20,g=32,y=48,m=d-f-u,b=h-g-y,x=k=>f+k/Math.max(a.length-1,1)*m,v=c<5e9?5e8:c<5e10?5e9:5e10,w=Math.ceil(c/v),H=w*v,I=Array.from({length:w+1},(k,T)=>T*v),C=k=>g+b-k/H*b,z=k=>k?Math.abs(k)>=1e12?(k/1e12).toFixed(k%1e12===0?0:1)+"兆":Math.abs(k)>=1e8?(k/1e8).toFixed(k%1e8===0?0:1)+"億":Math.abs(k)>=1e4?(k/1e4).toFixed(0)+"万":k.toLocaleString():"0",P=k=>{const T=k.split("/");return T.length>=2?T[0].slice(2)+"/"+T[1]:k};return n.jsxs("div",{children:[n.jsx(Or,{allThemes:e,selected:i,setSelected:s}),i.length>0?n.jsx("div",{style:{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"},children:n.jsxs("svg",{viewBox:`0 0 ${d} ${h}`,style:{width:"100%",minWidth:"0",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:[[.25,.5,.75,1].map(k=>n.jsx("line",{x1:f,y1:C(c*k),x2:f+m,y2:C(c*k),stroke:"rgba(255,255,255,0.06)",strokeWidth:"0.8"},k)),I.map((k,T)=>n.jsx("text",{x:f-6,y:C(k)+4,textAnchor:"end",fontSize:"9",fill:"rgba(255,255,255,0.45)",children:z(k)},T)),a.map((k,T)=>n.jsx("text",{x:x(T),y:g+b+18,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:P(k)},k)),i.map((k,T)=>{const L=ue[T%ue.length],D=a.map((O,J)=>{var j;return{i:J,v:((j=o[k])==null?void 0:j[O])||0}}),E=D.map((O,J)=>(J===0?"M":"L")+x(O.i).toFixed(1)+","+C(O.v).toFixed(1)).join(" ");return n.jsxs("g",{children:[n.jsx("path",{d:E,fill:"none",stroke:L,strokeWidth:"2",strokeLinejoin:"round",opacity:"0.9"}),D.map(O=>n.jsx("circle",{cx:x(O.i),cy:C(O.v),r:"3",fill:L,stroke:"var(--bg2)",strokeWidth:"1.5"},O.i))]},k)}),i.map((k,T)=>{const L=ue[T%ue.length];return n.jsxs("g",{children:[n.jsx("rect",{x:f+T*160,y:g-22,width:"12",height:"12",rx:"2",fill:L,opacity:"0.85"}),n.jsx("text",{x:f+T*160+16,y:g-12,fontSize:"10",fill:"rgba(255,255,255,0.75)",children:k.length>12?k.slice(0,12)+"…":k})]},k)})]})}):n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:"上のボタンでテーマを選択してください"})]})}function tl({volTrendData:t,allThemeNames:e,months:r}){const[i,s]=S.useState(()=>(e||[]).slice(0,3));if(S.useEffect(()=>{(e==null?void 0:e.length)>0&&i.length===0&&s(e.slice(0,3))},[e==null?void 0:e.length]),!t||!e)return null;const o={};e.forEach(k=>{const T=t[`vol_trend_${k}`];if(!(T!=null&&T.dates))return;const L={};T.dates.forEach((D,E)=>{var J;const O=D.slice(0,7).replace("-","/");L[O]||(L[O]=0),L[O]+=((J=T.trade_values)==null?void 0:J[E])||0}),o[k]=L});const a=r.slice(-12),l=i.flatMap(k=>a.map(T=>{var L;return((L=o[k])==null?void 0:L[T])||0})),c=Math.max(...l,1),d=900,h=340,f=80,u=20,g=32,y=48,m=d-f-u,b=h-g-y,x=k=>f+k/Math.max(a.length-1,1)*m,v=c<5e11?5e10:c<5e12?5e11:5e12,w=Math.ceil(c/v),H=w*v,I=Array.from({length:w+1},(k,T)=>T*v),C=k=>g+b-k/H*b,z=k=>k?Math.abs(k)>=1e12?(k/1e12).toFixed(k%1e12===0?0:1)+"兆":Math.abs(k)>=1e8?(k/1e8).toFixed(k%1e8===0?0:1)+"億":Math.abs(k)>=1e4?(k/1e4).toFixed(0)+"万":k.toLocaleString():"0",P=k=>{const T=k.split("/");return T.length>=2?T[0].slice(2)+"/"+T[1]:k};return n.jsxs("div",{children:[n.jsx(Or,{allThemes:e,selected:i,setSelected:s}),i.length>0?n.jsx("div",{style:{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"},children:n.jsxs("svg",{viewBox:`0 0 ${d} ${h}`,style:{width:"100%",minWidth:"0",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:[[.25,.5,.75,1].map(k=>n.jsx("line",{x1:f,y1:C(c*k),x2:f+m,y2:C(c*k),stroke:"rgba(255,255,255,0.06)",strokeWidth:"0.8"},k)),I.map((k,T)=>n.jsx("text",{x:f-6,y:C(k)+4,textAnchor:"end",fontSize:"9",fill:"rgba(255,255,255,0.45)",children:z(k)},T)),a.map((k,T)=>n.jsx("text",{x:x(T),y:g+b+18,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:P(k)},k)),i.map((k,T)=>{const L=ue[T%ue.length],D=a.map((O,J)=>{var j;return{i:J,v:((j=o[k])==null?void 0:j[O])||0}}),E=D.map((O,J)=>(J===0?"M":"L")+x(O.i).toFixed(1)+","+C(O.v).toFixed(1)).join(" ");return n.jsxs("g",{children:[n.jsx("path",{d:E,fill:"none",stroke:L,strokeWidth:"2",strokeLinejoin:"round",opacity:"0.9"}),D.map(O=>n.jsx("circle",{cx:x(O.i),cy:C(O.v),r:"3",fill:L,stroke:"var(--bg2)",strokeWidth:"1.5"},O.i))]},k)}),i.map((k,T)=>{const L=ue[T%ue.length];return n.jsxs("g",{children:[n.jsx("rect",{x:f+T*160,y:g-22,width:"12",height:"12",rx:"2",fill:L,opacity:"0.85"}),n.jsx("text",{x:f+T*160+16,y:g-12,fontSize:"10",fill:"rgba(255,255,255,0.75)",children:k.length>12?k.slice(0,12)+"…":k})]},k)})]})}):n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:"上のボタンでテーマを選択してください"})]})}function rl({onNavigate:t}){var ce,W,V,q,R,A,G,X;const[e,r]=S.useState("1mo"),{data:i}=wi(),s=(i==null?void 0:i.data)||null,o=(i==null?void 0:i.months)||[],[a,l]=S.useState({});S.useEffect(()=>{fetch("/data/market.json?t="+Date.now()).then(N=>N.json()).then(N=>{const $=Object.keys(N).filter(ie=>ie.startsWith("vol_trend_")),re={};$.forEach(ie=>{re[ie]=N[ie]}),l(re)}).catch(()=>{})},[]);const{themes:c}=Rr(),{data:d}=Bn("1mo"),{data:h}=Er(e),f=(d==null?void 0:d.data)||{},u=()=>{const N=f["国内主要株(1321)"]||[];if(N.length<2)return null;const $=N[N.length-1];return($==null?void 0:$.pct)??null},g=()=>{const N=f["TOPIX連動型上場投信(1306)"]||[];if(N.length<2)return null;const $=N[N.length-1];return($==null?void 0:$.pct)??null},y=u(),m=g(),{data:b,loading:x,refreshing:p,updatedAt:v,refresh:w}=Ln(e),H=v?new Date(v.replace(/\//g,"-").replace(" JST","")):null,I=(b==null?void 0:b.themes)??[],C=(b==null?void 0:b.summary)??{},z=[...I].sort((N,$)=>N.pct-$.pct),P=[...I].sort((N,$)=>($.volume||0)-(N.volume||0)),k=[...I].sort((N,$)=>($.trade_value||0)-(N.trade_value||0)),T=new Map(I.map((N,$)=>[N.theme,$+1])),L=new Map(P.map((N,$)=>[N.theme,$+1])),D=new Map(k.map((N,$)=>[N.theme,$+1])),E=(h==null?void 0:h.data)||[],O=new Map(E.map(N=>[N.theme,N])),J=Va(I,C,e,E),j=I.filter(N=>N.pct>0).slice(0,5),M=z.filter(N=>N.pct<0).slice(0,5),Y=((ce=xn.find(N=>N.value===e))==null?void 0:ce.label)??e,Q=N=>N>=0?"#ff5370":"#4caf82",ee=()=>"#5b9cf6",ne=()=>"#ff8c42";return n.jsxs("div",{children:[n.jsxs("div",{className:"page-header-sticky",children:[n.jsx("h1",{style:{fontSize:"18px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap"},children:"テーマ一覧"}),n.jsx("select",{value:e,onChange:N=>r(N.target.value),style:nl,children:xn.map(N=>n.jsx("option",{value:N.value,children:N.label},N.value))}),n.jsx("div",{style:{marginLeft:"auto"},children:n.jsx(za,{refreshing:p,lastUpdate:H,onRefresh:w})})]}),n.jsxs("div",{style:{padding:"20px 24px 48px",maxWidth:"1280px",margin:"0 auto",overflowX:"hidden"},children:[n.jsxs("div",{style:{background:"rgba(74,158,255,0.05)",border:"1px solid rgba(74,158,255,0.15)",borderRadius:"8px",padding:"12px 16px",marginBottom:"12px",fontSize:"13px",color:"var(--text)",lineHeight:1.9},children:["日本株の主要67テーマについて、騰落率・出来高・売買代金を一覧で比較できます。 期間（1週間〜1年）を切り替えることで、短期的な資金流入テーマと長期トレンドの両方を確認できます。",n.jsx("br",{}),n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)"},children:"💡 活用ポイント：「上昇TOP5」に連続して登場するテーマは強いトレンドの可能性があります。 出来高・売買代金も同時に確認し、資金の本気度を判断しましょう。"})]}),n.jsxs("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"20px"},children:["日本株テーマ別の騰落率・資金動向 — ",Y]}),x?n.jsx(Ja,{}):n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"responsive-grid-6",style:{marginBottom:"8px"},children:[n.jsx(Ye,{delay:.05,label:"上昇テーマ",value:n.jsxs("span",{children:[C.rise,n.jsxs("span",{style:{fontSize:"16px",color:"var(--text2)",fontWeight:400},children:[" / ",C.total]})]}),valueColor:"var(--red)",arrow:C.rise>C.fall?"up":C.rise<C.fall?"down":null,sub:`下落: ${C.fall}テーマ`}),n.jsx(Ye,{delay:.1,label:"全テーマ平均騰落率",value:`${C.avg>=0?"+":""}${(W=C.avg)==null?void 0:W.toFixed(2)}%`,valueColor:C.avg>=0?"var(--red)":"var(--green)",arrow:C.avg>=0?"up":"down",sub:`期間: ${Y}`}),n.jsx(Ye,{delay:.15,label:"資金流入 TOP",value:n.jsx("span",{style:{fontSize:"17px",color:"var(--red)",fontWeight:700},children:(V=C.top)==null?void 0:V.theme}),arrow:"up",sub:n.jsxs("span",{style:{color:"var(--red)",fontWeight:600},children:["+",(R=(q=C.top)==null?void 0:q.pct)==null?void 0:R.toFixed(1),"%"]})}),n.jsx(Ye,{delay:.2,label:"資金流出 TOP",value:n.jsx("span",{style:{fontSize:"17px",color:"var(--green)",fontWeight:700},children:(A=C.bot)==null?void 0:A.theme}),arrow:"down",sub:n.jsxs("span",{style:{color:"var(--green)",fontWeight:600},children:[(X=(G=C.bot)==null?void 0:G.pct)==null?void 0:X.toFixed(1),"%"]})}),n.jsx(Ye,{delay:.25,label:"日経225連動型(1321)",value:y!==null?`${y>=0?"+":""}${y.toFixed(2)}%`:"-",valueColor:y===null?"var(--text3)":y>=0?"var(--red)":"var(--green)",arrow:y===null?null:y>=0?"up":"down",sub:`期間: ${Y}`}),n.jsx(Ye,{delay:.3,label:"TOPIX連動型(1306)",value:m!==null?`${m>=0?"+":""}${m.toFixed(2)}%`:"-",valueColor:m===null?"var(--text3)":m>=0?"var(--red)":"var(--green)",arrow:m===null?null:m>=0?"up":"down",sub:"参照: 1ヶ月"})]}),n.jsx(Xe,{title:"📈 騰落ランキング TOP5"}),n.jsx(vn,{top5:j,bot5:M,topTitle:`▲ 上昇テーマ TOP5（${I.filter(N=>N.pct>0).length}テーマ上昇）`,botTitle:`▼ 下落テーマ TOP5（${I.filter(N=>N.pct<0).length}テーマ下落）`,topColorFn:Q,botColorFn:Q,valueKey:"pct"}),n.jsx(Xe,{title:"💹 出来高・売買代金 TOP5"}),n.jsx(vn,{top5:P.slice(0,5),bot5:k.slice(0,5),topTitle:"🔢 出来高 TOP5",botTitle:"💴 売買代金 TOP5",topColorFn:ee,botColorFn:ne,valueKey:"volume",bot5ValueKey:"trade_value",formatFn:!0}),n.jsx(Ga,{lines:J}),t&&n.jsx("div",{style:{textAlign:"right",marginTop:"-4px",marginBottom:"8px"},children:n.jsx("button",{onClick:()=>t("週次レポート"),style:{padding:"5px 14px",borderRadius:"6px",fontSize:"11px",background:"rgba(255,140,66,0.1)",border:"1px solid rgba(255,140,66,0.3)",color:"#ff8c42",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"📰 詳細な週次レポートを読む →"})}),n.jsx(Xe,{title:"📊 全テーマ 騰落率ランキング"}),n.jsx(lr,{items:I,pctColor:Q,valueKey:"pct",pctRankMap:T,volRankMap:L,tvRankMap:D,onNavigate:t,momentumMap:O}),c.length>0&&n.jsxs(n.Fragment,{children:[n.jsx(Xe,{title:"🎨 マイカスタムテーマ"}),n.jsx(Ya,{themes:c,period:e,pctColor:Q})]}),n.jsx(Xe,{title:"🔢 全テーマ 出来高ランキング"}),n.jsx(lr,{items:P,pctColor:Q,valueKey:"volume",barColor:"#378ADD",pctRankMap:T,volRankMap:L,tvRankMap:D,onNavigate:t}),n.jsx(Xe,{title:"💴 全テーマ 売買代金ランキング"}),n.jsx(lr,{items:k,pctColor:Q,valueKey:"trade_value",barColor:"#ff8c42",pctRankMap:T,volRankMap:L,tvRankMap:D,onNavigate:t}),Object.keys(a).length>0&&o.length>0&&(()=>{const N=Object.keys(a).map($=>$.replace("vol_trend_",""));return n.jsxs("div",{className:"monthly-chart-grid",children:[n.jsxs("div",{className:"monthly-chart-cell",children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:"📅 月次テーマ別騰落率推移"}),n.jsx(Nt,{title:"月次テーマ別騰落率推移",children:n.jsx(Qa,{data:s,months:o,onNavigate:t})})]}),n.jsxs("div",{className:"monthly-chart-cell",children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:"📊 月次テーマ別出来高推移"}),n.jsx(Nt,{title:"月次テーマ別出来高推移",children:n.jsx(el,{volTrendData:a,allThemeNames:N,months:o})})]}),n.jsxs("div",{className:"monthly-chart-cell",children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:"💴 月次テーマ別売買代金推移"}),n.jsx(Nt,{title:"月次テーマ別売買代金推移",children:n.jsx(tl,{volTrendData:a,allThemeNames:N,months:o})})]}),n.jsxs("div",{className:"monthly-chart-cell",children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:"🔥 テーマヒートマップ"}),n.jsx(Nt,{title:"テーマヒートマップ（資金フロー）",showZoneDesc:!0,children:n.jsx(Ka,{onNavigate:t})})]})]})})()]})]}),n.jsx("style",{children:`
        /* ② 月次グラフ2×2グリッド */
        .monthly-chart-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 8px;
        }
        @media (min-width: 900px) {
          .monthly-chart-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .monthly-chart-cell {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
        }
        /* ExpandableChart: PC=縮小+ボタン下部 / スマホ=通常 */
        .expandable-chart-preview {
          display: none;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          max-height: 200px;
        }
        .expandable-chart-preview > div {
          transform: scale(0.52);
          transform-origin: top left;
          width: 192%;
          pointer-events: none;
        }
        .expandable-chart-btn {
          display: none;
          width: 100%;
          margin-top: 6px;
          padding: 6px 0;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: rgba(74,158,255,0.06);
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font);
          transition: background 0.15s;
        }
        .expandable-chart-btn:hover { background: rgba(74,158,255,0.14); }
        .expandable-chart-mobile { display: block; }
        @media (min-width: 769px) {
          .expandable-chart-preview { display: block; }
          .expandable-chart-btn    { display: block; }
          .expandable-chart-mobile { display: none; }
        }
        .responsive-grid-6 { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
        @media (max-width:1024px) { .responsive-grid-6 { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .responsive-grid-6 { grid-template-columns:repeat(2,1fr); } }
        .theme-card-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .momentum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
        @media (max-width:1024px) { .momentum-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .momentum-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:1024px) { .theme-card-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .theme-card-grid { grid-template-columns:repeat(2,1fr); } }
        .top5-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 640px) {
          .top5-grid { grid-template-columns: 1fr !important; }
        }
      `}),n.jsx("style",{children:`
        @media (max-width: 640px) {
          .mobile-hidden-card { display: none !important; }
        }
      `})]})}const nl={background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"6px 12px",cursor:"pointer",outline:"none"};function il({data:t,mPeriod:e,setMPeriod:r,onNavigate:i}){const[s,o]=S.useState(null),[a,l]=S.useState({x:0,y:0});if(!t||t.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"60px",color:"var(--text3)"},children:"データを読み込み中..."});const c=800,d=400,h=60,f=28,u=40,g=48,y=c-h-f,m=d-u-g,b=t.filter(_=>_.pct!=null&&!isNaN(_.pct)),p=b.map(_=>typeof _.volume_chg=="number"?_.volume_chg:null).some(_=>_!==null&&_!==0),v=_=>p&&typeof _.volume_chg=="number"?_.volume_chg:typeof _.week_diff=="number"?_.week_diff:0,w=p?"出来高急増率 (%)":"先週比 (pt)",I=b.map(_=>_.trade_value??0).some(_=>_>0),C=_=>I?_.trade_value??0:Math.abs(_.pct??0)*1e9,z=b.map(_=>_.pct),P=b.map(_=>v(_)),k=b.map(_=>C(_)),T=z.length?Math.min(...z):-5,L=z.length?Math.max(...z):5,D=P.length?Math.min(...P):-10,E=P.length?Math.max(...P):10,O=Math.max((L-T)*.15,1.5),J=Math.max((E-D)*.15,2),j=T-O,M=L+O,Y=D-J,Q=E+J,ee=Math.max(...k.filter(_=>_>0),1);if(b.length===0)return n.jsxs("div",{style:{textAlign:"center",padding:"40px 20px",color:"var(--text3)",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:[n.jsx("div",{style:{fontSize:"24px",marginBottom:"12px"},children:"📊"}),n.jsx("div",{style:{fontSize:"13px",marginBottom:"6px",color:"var(--text2)"},children:"散布図データを準備中です"}),n.jsx("div",{style:{fontSize:"11px"},children:"GitHub Actions「Fetch Market Data」を手動実行すると表示されます"})]});const ne=M-j||1,ce=Q-Y||1,W=_=>h+(_-j)/ne*y,V=_=>u+m-(_-Y)/ce*m,q=_=>!_||_===0?7:8+_/ee*34,R=_=>_>=8?"#ff2244":_>=4?"#ff5370":_>=1.5?"#ff8c42":_>=0?"#e8a040":_>=-1.5?"#3db88a":_>=-4?"#00c48c":"#00a878",A=W(0),G=V(0),X=[{label:"注目ゾーン 上昇+出来高増",x:A,y:u,w:h+y-A,h:G-u,bg:"rgba(255,83,112,0.08)",border:"rgba(255,83,112,0.22)"},{label:"売り圧力 下落+出来高増",x:h,y:u,w:A-h,h:G-u,bg:"rgba(0,196,140,0.07)",border:"rgba(0,196,140,0.18)"},{label:"静かな上昇 出来高少",x:A,y:G,w:h+y-A,h:u+m-G,bg:"rgba(255,140,66,0.05)",border:"rgba(255,140,66,0.12)"},{label:"静かな下落",x:h,y:G,w:A-h,h:u+m-G,bg:"rgba(74,158,255,0.04)",border:"none"}],N=[],$=Math.ceil((M-j)/7);for(let _=Math.ceil(j);_<=M;_+=$||1)N.push(_);const re=[],ie=Math.ceil((Q-Y)/6);for(let _=Math.ceil(Y/ie)*ie;_<=Q;_+=ie||1)re.push(_);const _e=_=>_?_>=1e8?(_/1e8).toFixed(0)+"億":_>=1e4?(_/1e4).toFixed(0)+"万":_.toLocaleString():"-";return n.jsxs("div",{children:[n.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center",marginBottom:"16px"},children:[n.jsx("select",{value:e,onChange:_=>r(_.target.value),style:{background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"6px 12px",cursor:"pointer",outline:"none"},children:[{v:"1d",l:"1日"},{v:"5d",l:"1週間"},{v:"1mo",l:"1ヶ月"},{v:"3mo",l:"3ヶ月"},{v:"6mo",l:"6ヶ月"}].map(_=>n.jsx("option",{value:_.v,children:_.l},_.v))}),n.jsxs("span",{style:{fontSize:"11px",color:"var(--text3)"},children:["X軸=騰落率　Y軸=",w,"　円サイズ=売買代金"]})]}),n.jsx("div",{className:"scatter-zone-desc",children:[{label:"🔥 注目ゾーン（右上）",desc:"上昇＋出来高急増＝最強シグナル",color:"#ff5370"},{label:"⚠️ 売り圧力（左上）",desc:"下落＋出来高急増＝強い売り",color:"#00c48c"},{label:"📈 静かな上昇（右下）",desc:"上昇＋出来高少＝じわり上昇",color:"#ff8c42"},{label:"❄️ 静かな下落（左下）",desc:"弱含みだが動意なし",color:"#4a9eff"}].map(_=>n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},children:[n.jsx("div",{style:{width:"8px",height:"8px",borderRadius:"50%",background:_.color,flexShrink:0}}),n.jsxs("span",{style:{color:"var(--text3)"},children:[_.label,"："]}),n.jsx("span",{style:{color:"var(--text2)"},children:_.desc})]},_.label))}),n.jsx("div",{style:{width:"100%",overflowX:"auto",position:"relative",WebkitOverflowScrolling:"touch"},children:n.jsxs("svg",{viewBox:`0 0 ${c} ${d}`,style:{width:"100%",minWidth:"380px",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},onMouseLeave:()=>o(null),children:[X.map((_,K)=>n.jsx("g",{children:n.jsx("rect",{x:_.x,y:_.y,width:_.w,height:_.h,fill:_.bg,rx:"4",stroke:_.border||"none",strokeWidth:_.border?.8:0,strokeDasharray:"4,3"})},K)),N.map(_=>n.jsx("line",{x1:W(_),y1:u,x2:W(_),y2:u+m,stroke:"rgba(255,255,255,0.1)",strokeWidth:"0.8",strokeDasharray:"3,4"},_)),re.map(_=>n.jsx("line",{x1:h,y1:V(_),x2:h+y,y2:V(_),stroke:"rgba(255,255,255,0.1)",strokeWidth:"0.8",strokeDasharray:"3,4"},_)),n.jsx("line",{x1:A,y1:u,x2:A,y2:u+m,stroke:"rgba(255,255,255,0.35)",strokeWidth:"1.5",strokeDasharray:"5,3"}),n.jsx("line",{x1:h,y1:G,x2:h+y,y2:G,stroke:"rgba(255,255,255,0.35)",strokeWidth:"1.5",strokeDasharray:"5,3"}),n.jsx("text",{x:A+8,y:u+16,fontSize:"11",fill:"rgba(255,83,112,0.85)",fontWeight:"700",children:"🔥 注目ゾーン"}),n.jsx("text",{x:h+6,y:u+16,fontSize:"11",fill:"rgba(0,196,140,0.8)",fontWeight:"700",children:"⚠️ 売り圧力"}),n.jsx("text",{x:A+8,y:u+m-8,fontSize:"11",fill:"rgba(255,140,66,0.7)",fontWeight:"600",children:"📈 静かな上昇"}),n.jsx("text",{x:h+6,y:u+m-8,fontSize:"11",fill:"rgba(74,158,255,0.65)",fontWeight:"600",children:"❄️ 静かな下落"}),b.filter(_=>_.theme!==(s==null?void 0:s.theme)).map(_=>{const K=W(_.pct),oe=V(_.volume_chg??0),le=q(_.trade_value),Se=R(_.pct);return n.jsxs("g",{style:{cursor:i?"pointer":"default"},onMouseEnter:$e=>{const ye=$e.currentTarget.closest("svg").getBoundingClientRect();c/ye.width,o(_),l({x:K,y:oe-le-6})},onClick:()=>i&&i("テーマ別詳細",_.theme),children:[n.jsx("circle",{cx:K,cy:oe,r:le,fill:Se,fillOpacity:"0.75",stroke:Se,strokeWidth:"1.2",strokeOpacity:"0.9"}),le>=16&&n.jsx("text",{x:K,y:oe+3,textAnchor:"middle",fontSize:Math.min(10,le*.55),fill:"white",fontWeight:"600",style:{pointerEvents:"none"},children:_.theme.length>6?_.theme.slice(0,6)+"…":_.theme})]},_.theme)}),s&&(()=>{const _=s,K=W(_.pct),oe=V(_.volume_chg??0),le=q(_.trade_value),Se=R(_.pct);return n.jsxs("g",{style:{cursor:i?"pointer":"default"},onMouseEnter:()=>o(_),onClick:()=>i&&i("テーマ別詳細",_.theme),children:[n.jsx("circle",{cx:K,cy:oe,r:le+3,fill:"none",stroke:"white",strokeWidth:"2",strokeOpacity:"0.8"}),n.jsx("circle",{cx:K,cy:oe,r:le,fill:Se,fillOpacity:"0.9",stroke:Se,strokeWidth:"1.5"}),n.jsx("text",{x:K,y:oe+4,textAnchor:"middle",fontSize:"10",fill:"white",fontWeight:"700",style:{pointerEvents:"none"},children:_.theme.length>8?_.theme.slice(0,8)+"…":_.theme}),(()=>{var ot;const ye=K+le+8>c-210?K-210-le-4:K+le+4,me=Math.max(u,Math.min(u+m-90,oe-90/2));return n.jsxs("g",{style:{pointerEvents:"none"},children:[n.jsx("rect",{x:ye,y:me,width:210,height:90,rx:"8",fill:"#1a1f2e",stroke:"rgba(255,255,255,0.25)",strokeWidth:"1.2"}),n.jsx("text",{x:ye+12,y:me+20,fontSize:"13",fill:"#e8f0ff",fontWeight:"700",children:_.theme}),n.jsx("text",{x:ye+12,y:me+38,fontSize:"12",fill:R(_.pct),children:"騰落率: "+(_.pct>=0?"+":"")+(((ot=_.pct)==null?void 0:ot.toFixed(2))??"-")+"%"}),n.jsx("text",{x:ye+12,y:me+56,fontSize:"12",fill:(_.volume_chg??0)>=0?"#ff8c42":"#4a9eff",children:w+": "+(v(_)>=0?"+":"")+v(_).toFixed(1)+"%"}),n.jsx("text",{x:ye+12,y:me+74,fontSize:"12",fill:"#8b949e",children:"売買代金: "+_e(_.trade_value)})]})})()]},"hovered")})(),N.map(_=>n.jsxs("text",{x:W(_),y:u+m+16,textAnchor:"middle",fontSize:"10",fill:"rgba(255,255,255,0.4)",children:[_>=0?"+":"",_,"%"]},_)),n.jsx("text",{x:h+y/2,y:d-4,textAnchor:"middle",fontSize:"11",fill:"rgba(255,255,255,0.4)",children:"← 下落　　騰落率　　上昇 →"}),re.map(_=>n.jsxs("text",{x:h-6,y:V(_)+4,textAnchor:"end",fontSize:"10",fill:"rgba(255,255,255,0.4)",children:[_>=0?"+":"",_,"%"]},_)),n.jsx("text",{x:16,y:u+m/2,textAnchor:"middle",fontSize:"11",fill:"rgba(255,255,255,0.4)",transform:`rotate(-90, 16, ${u+m/2})`,children:w}),[{tv:5e10,l:"5000億"},{tv:1e10,l:"1000億"},{tv:2e9,l:"200億"}].map((_,K)=>{const oe=q(_.tv),le=h+y+f-24,Se=u+20+K*44;return n.jsxs("g",{children:[n.jsx("circle",{cx:le,cy:Se+oe,r:oe,fill:"rgba(255,255,255,0.08)",stroke:"rgba(255,255,255,0.25)",strokeWidth:"1"}),n.jsx("text",{x:le,y:Se+oe*2+12,textAnchor:"middle",fontSize:"8.5",fill:"rgba(255,255,255,0.4)",children:_.l})]},K)}),i&&n.jsx("text",{x:h+y/2,y:u-12,textAnchor:"middle",fontSize:"10",fill:"rgba(255,255,255,0.3)",children:"バブルをクリック → テーマ別詳細へ"})]})}),(()=>{const _=b.filter(K=>K.pct>0&&(K.volume_chg??0)>0).sort((K,oe)=>oe.pct*.6+(oe.volume_chg??0)*.4-(K.pct*.6+(K.volume_chg??0)*.4)).slice(0,5);return _.length?n.jsxs("div",{style:{marginTop:"16px",padding:"14px 18px",background:"rgba(220,60,60,0.06)",border:"1px solid rgba(220,60,60,0.15)",borderRadius:"8px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"rgba(220,80,80,0.9)",marginBottom:"10px",letterSpacing:"0.08em"},children:"🔥 注目ゾーン上位（上昇＋出来高増加）"}),n.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:_.map(K=>{var oe,le;return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid rgba(220,60,60,0.2)",borderRadius:"6px",padding:"6px 12px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{style:{fontSize:"12px",fontWeight:700,color:"var(--text)"},children:K.theme}),n.jsxs("span",{style:{fontSize:"11px",fontFamily:"var(--mono)",color:"#ff5370",fontWeight:700},children:[K.pct>=0?"+":"",(oe=K.pct)==null?void 0:oe.toFixed(1),"%"]}),n.jsx("span",{style:{fontSize:"11px",fontFamily:"var(--mono)",color:"#ff8c42"},children:"出来高"+(K.volume_chg>=0?"+":"")+((le=K.volume_chg)==null?void 0:le.toFixed(0))+"%"}),i&&n.jsx("button",{onClick:()=>i("テーマ別詳細",K.theme),style:{padding:"2px 8px",borderRadius:"4px",fontSize:"10px",background:"rgba(170,119,255,0.1)",border:"1px solid rgba(170,119,255,0.3)",color:"#aa77ff",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"詳細 →"})]},K.theme)})})]}):null})()]})}function sl({onNavigate:t}){const[e,r]=S.useState("1mo"),{data:i}=Er(e),s=(i==null?void 0:i.data)||[];return n.jsxs("div",{style:{padding:"20px 24px 48px",maxWidth:"1280px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"22px",fontWeight:700,color:"var(--text)",marginBottom:"4px"},children:"テーマヒートマップ"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"16px"},children:"67テーマの騰落率をテーマヒートマップと騰落モメンタムで多角的に分析できます。"}),n.jsx(il,{data:s,mPeriod:e,setMPeriod:r,onNavigate:t}),n.jsx("style",{children:`
        /* ⑥ PC版：注目ゾーン説明を横並び4列 */
        .scatter-zone-desc {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .scatter-zone-desc > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        @media (max-width: 640px) {
          .scatter-zone-desc {
            grid-template-columns: 1fr 1fr;
            font-size: 10px;
          }
        }
      `})]})}function oi({stock:t,onClose:e}){const{themes:r,addStockToTheme:i,createThemeWithStock:s}=Rr(),[o,a]=S.useState(""),[l,c]=S.useState("select"),[d,h]=S.useState(!1),[f,u]=S.useState(""),g=m=>{i(m,t),u(`「${r[m].name}」に追加しました`),h(!0),setTimeout(e,1200)},y=()=>{o.trim()&&(s(o.trim(),t),u(`「${o.trim()}」を作成して追加しました`),h(!0),setTimeout(e,1200))};return n.jsxs(n.Fragment,{children:[n.jsx("div",{onClick:e,style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:900}}),n.jsxs("div",{style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px 24px",zIndex:901,width:"clamp(280px, 90vw, 380px)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"},children:[n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"2px"},children:"カスタムテーマに追加"}),n.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)"},children:[t.ticker.replace(".T","")," · ",t.name]})]}),n.jsx("button",{onClick:e,style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"16px",padding:"0 0 0 8px",lineHeight:1},children:"✕"})]}),d?n.jsxs("div",{style:{textAlign:"center",padding:"16px 0",fontSize:"13px",color:"var(--green)",fontWeight:600},children:["✓ ",f]}):n.jsxs(n.Fragment,{children:[n.jsx("div",{style:{display:"flex",gap:"4px",marginBottom:"14px"},children:[["select","既存テーマへ追加"],["create","新規テーマを作成"]].map(([m,b])=>n.jsx("button",{onClick:()=>c(m),style:{flex:1,padding:"6px",borderRadius:"6px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",border:l===m?"1px solid var(--accent)":"1px solid var(--border)",background:l===m?"rgba(74,158,255,0.12)":"transparent",color:l===m?"var(--accent)":"var(--text3)"},children:b},m))}),l==="select"?r.length===0?n.jsxs("div",{style:{textAlign:"center",padding:"16px",fontSize:"12px",color:"var(--text3)"},children:["カスタムテーマがありません。",n.jsx("br",{}),"「新規テーマを作成」から追加できます。"]}):n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"5px",maxHeight:"200px",overflowY:"auto"},children:r.map((m,b)=>{var p;const x=(p=m.stocks)==null?void 0:p.some(v=>v.ticker===t.ticker);return n.jsxs("button",{onClick:()=>!x&&g(b),style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:"7px",cursor:x?"default":"pointer",background:x?"rgba(255,255,255,0.03)":"var(--bg3)",border:"1px solid var(--border)",fontFamily:"var(--font)",opacity:x?.5:1,transition:"all 0.12s"},onMouseEnter:v=>!x&&(v.currentTarget.style.borderColor="rgba(74,158,255,0.35)"),onMouseLeave:v=>v.currentTarget.style.borderColor="var(--border)",children:[n.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--text)"},children:m.name}),n.jsx("span",{style:{fontSize:"10px",color:x?"var(--text3)":"var(--accent)",fontWeight:600},children:x?"追加済み":`＋ 追加（${(m.stocks||[]).length}銘柄）`})]},b)})}):n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"6px"},children:"新しいテーマ名"}),n.jsxs("div",{style:{display:"flex",gap:"6px"},children:[n.jsx("input",{value:o,onChange:m=>a(m.target.value),onKeyDown:m=>m.key==="Enter"&&y(),placeholder:"例：注目銘柄、マイポートフォリオ",autoFocus:!0,style:{flex:1,background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"7px 10px",outline:"none"}}),n.jsx("button",{onClick:y,disabled:!o.trim(),style:{padding:"7px 14px",borderRadius:"6px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(74,158,255,0.15)",color:"var(--accent)",border:"1px solid rgba(74,158,255,0.3)",opacity:o.trim()?1:.4},children:"作成"})]})]})]})]})]})}function Wr({stocks:t,themeName:e,onNavigate:r}){const[i,s]=S.useState(null),o=(t||[]).filter(A=>A.pct!=null&&!isNaN(A.pct));if(o.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"30px",color:"var(--text3)",fontSize:"13px"},children:"データを読み込み中..."});const a=760,l=360,c=56,d=20,h=36,f=44,u=a-c-d,g=l-h-f,y=o.map(A=>A.pct),m=o.map(A=>typeof A.volume_chg=="number"?A.volume_chg:0),b=o.map(A=>A.trade_value??0),x=m.some(A=>A!==0),p=x?m:o.map(A=>A.pct*.5),v=x?"出来高急増率 (%)":"騰落率の0.5倍（出来高データ準備中）",w=Math.min(...y),H=Math.max(...y),I=Math.min(...p),C=Math.max(...p),z=Math.max((H-w)*.15,1.5),P=Math.max((C-I)*.15,2),k=w-z,T=H+z,L=I-P,D=C+P,E=T-k||1,O=D-L||1,J=Math.max(...b.filter(A=>A>0),1),j=A=>c+(A-k)/E*u,M=A=>h+g-(A-L)/O*g,Y=A=>A>0?6+A/J*22:6,Q=A=>A>=8?"#ff2244":A>=4?"#ff5370":A>=1.5?"#ff8c42":A>=0?"#e8a040":A>=-1.5?"#3db88a":A>=-4?"#00c48c":"#009966",ee=j(0),ne=M(0),ce=A=>A?A>=1e8?(A/1e8).toFixed(0)+"億":A>=1e4?(A/1e4).toFixed(0)+"万":A.toLocaleString():"-",W=[],V=Math.ceil((T-k)/6)||1;for(let A=Math.ceil(k);A<=T;A+=V)W.push(A);const q=[],R=Math.ceil((D-L)/5)||1;for(let A=Math.ceil(L/R)*R;A<=D;A+=R)q.push(A);return n.jsxs("div",{children:[n.jsxs("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"6px"},children:["X軸=騰落率　Y軸=",v,"　円サイズ=売買代金　バブルをクリックで銘柄確認"]}),n.jsx("div",{style:{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"},children:n.jsxs("svg",{viewBox:`0 0 ${a} ${l}`,style:{width:"100%",minWidth:"360px",display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},onMouseLeave:()=>s(null),children:[n.jsx("rect",{x:ee,y:h,width:c+u-ee,height:ne-h,fill:"rgba(255,83,112,0.06)"}),n.jsx("rect",{x:c,y:h,width:ee-c,height:ne-h,fill:"rgba(0,196,140,0.05)"}),n.jsx("rect",{x:ee,y:ne,width:c+u-ee,height:h+g-ne,fill:"rgba(255,140,66,0.04)"}),n.jsx("rect",{x:c,y:ne,width:ee-c,height:h+g-ne,fill:"rgba(74,158,255,0.03)"}),W.map(A=>n.jsx("line",{x1:j(A),y1:h,x2:j(A),y2:h+g,stroke:"rgba(255,255,255,0.08)",strokeWidth:"0.8",strokeDasharray:"3,4"},A)),q.map(A=>n.jsx("line",{x1:c,y1:M(A),x2:c+u,y2:M(A),stroke:"rgba(255,255,255,0.08)",strokeWidth:"0.8",strokeDasharray:"3,4"},A)),n.jsx("line",{x1:ee,y1:h,x2:ee,y2:h+g,stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.4",strokeDasharray:"5,3"}),n.jsx("line",{x1:c,y1:ne,x2:c+u,y2:ne,stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.4",strokeDasharray:"5,3"}),n.jsx("text",{x:ee+6,y:h+14,fontSize:"9",fill:"rgba(255,83,112,0.8)",fontWeight:"700",children:"🔥 注目"}),n.jsx("text",{x:c+4,y:h+14,fontSize:"9",fill:"rgba(0,196,140,0.7)",fontWeight:"700",children:"⚠️ 売り"}),n.jsx("text",{x:ee+6,y:h+g-6,fontSize:"9",fill:"rgba(255,140,66,0.6)",fontWeight:"700",children:"📈 上昇"}),n.jsx("text",{x:c+4,y:h+g-6,fontSize:"9",fill:"rgba(74,158,255,0.6)",fontWeight:"700",children:"❄️ 下落"}),o.filter(A=>A.ticker!==(i==null?void 0:i.ticker)).map(A=>{const G=j(A.pct),X=M(x?A.volume_chg??0:A.pct*.5),N=Y(A.trade_value),$=Q(A.pct);return n.jsxs("g",{style:{cursor:"pointer"},onMouseEnter:()=>s(A),children:[n.jsx("circle",{cx:G,cy:X,r:N,fill:$,fillOpacity:"0.75",stroke:$,strokeWidth:"1"}),N>=14&&n.jsx("text",{x:G,y:X+3,textAnchor:"middle",fontSize:Math.min(9,N*.55),fill:"white",fontWeight:"600",style:{pointerEvents:"none"},children:(A.name||A.ticker.replace(".T","")).slice(0,6)})]},A.ticker)}),i&&(()=>{var _e,_;const A=i,G=j(A.pct),X=M(x?A.volume_chg??0:A.pct*.5),N=Y(A.trade_value),$=Q(A.pct),re=Math.min(G,a-155),ie=Math.max(h+4,X-N-68);return n.jsxs("g",{style:{cursor:"pointer"},onMouseEnter:()=>s(A),children:[n.jsx("circle",{cx:G,cy:X,r:N+3,fill:"none",stroke:"white",strokeWidth:"2",strokeOpacity:"0.8"}),n.jsx("circle",{cx:G,cy:X,r:N,fill:$,fillOpacity:"0.9",stroke:$,strokeWidth:"1.5"}),n.jsx("text",{x:G,y:X+4,textAnchor:"middle",fontSize:"9",fill:"white",fontWeight:"700",style:{pointerEvents:"none"},children:(A.name||A.ticker.replace(".T","")).slice(0,8)}),n.jsxs("g",{style:{pointerEvents:"none"},children:[n.jsx("rect",{x:re,y:ie,width:"185",height:"82",rx:"8",fill:"#1a1f2e",stroke:"rgba(255,255,255,0.25)",strokeWidth:"1.2"}),n.jsx("text",{x:re+10,y:ie+18,fontSize:"12",fill:"#e8f0ff",fontWeight:"700",children:(A.name||A.ticker.replace(".T","")).slice(0,16)}),n.jsx("text",{x:re+10,y:ie+36,fontSize:"12",fill:$,children:"騰落率: "+(A.pct>=0?"+":"")+(((_e=A.pct)==null?void 0:_e.toFixed(2))??"-")+"%"}),x&&n.jsx("text",{x:re+10,y:ie+53,fontSize:"12",fill:(A.volume_chg??0)>=0?"#ff8c42":"#4a9eff",children:"出来高: "+((A.volume_chg??0)>=0?"+":"")+(((_=A.volume_chg)==null?void 0:_.toFixed(1))??"-")+"%"}),n.jsx("text",{x:re+10,y:ie+70,fontSize:"12",fill:"#8b949e",children:"売買代金: "+ce(A.trade_value)})]})]},"hov")})(),W.map(A=>n.jsxs("text",{x:j(A),y:h+g+16,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:[A>=0?"+":"",A,"%"]},A)),n.jsx("text",{x:c+u/2,y:l-4,textAnchor:"middle",fontSize:"10",fill:"rgba(255,255,255,0.35)",children:"← 下落　　騰落率　　上昇 →"}),q.map(A=>n.jsxs("text",{x:c-5,y:M(A)+3,textAnchor:"end",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:[A>=0?"+":"",A,"%"]},A)),n.jsx("text",{x:14,y:h+g/2,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.35)",transform:`rotate(-90, 14, ${h+g/2})`,children:x?"出来高急増率":""})]})})]})}function ol({stocks:t}){const[e,r]=S.useState("tv"),[i,s]=S.useState(!1);if(!t||t.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"24px",color:"var(--text3)",fontSize:"12px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px"},children:"データ取得中..."});const o=[...t].sort((d,h)=>(h[e==="tv"?"trade_value":"volume"]||0)-(d[e==="tv"?"trade_value":"volume"]||0)).slice(0,15),a=Math.max(...o.map(d=>d[e==="tv"?"trade_value":"volume"]||0),1),l=d=>d?d>=1e12?(d/1e12).toFixed(1)+"兆":d>=1e8?(d/1e8).toFixed(1)+"億":d>=1e4?(d/1e4).toFixed(1)+"万":d.toLocaleString():"0",c=n.jsxs("div",{children:[n.jsx("div",{style:{display:"flex",gap:"8px",marginBottom:"10px"},children:[{v:"tv",l:"売買代金"},{v:"vol",l:"出来高"}].map(d=>n.jsx("button",{onClick:()=>r(d.v),style:{padding:"4px 12px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:e===d.v?"rgba(74,158,255,0.15)":"transparent",border:e===d.v?"1px solid rgba(74,158,255,0.4)":"1px solid var(--border)",color:e===d.v?"var(--accent)":"var(--text3)"},children:d.l},d.v))}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:o.map(d=>{var g;const h=d[e==="tv"?"trade_value":"volume"]||0,f=h/a*100,u=d.pct>=0?"var(--red)":"var(--green)";return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"110px 1fr 70px 56px",gap:"6px",alignItems:"center"},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"},children:d.name}),n.jsx("div",{style:{height:"12px",background:"rgba(255,255,255,0.04)",borderRadius:"3px",overflow:"hidden"},children:n.jsx("div",{style:{height:"100%",width:`${f}%`,background:e==="tv"?"#ff8c42":"#378ADD",borderRadius:"3px",opacity:.85}})}),n.jsx("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",color:"var(--text2)",textAlign:"right",whiteSpace:"nowrap"},children:l(h)}),n.jsxs("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,color:u,textAlign:"right",whiteSpace:"nowrap"},children:[d.pct>=0?"+":"",(g=d.pct)==null?void 0:g.toFixed(1),"%"]})]},d.ticker)})})]});return n.jsxs("div",{children:[c,n.jsx("button",{onClick:()=>s(!0),style:{display:"block",width:"100%",marginTop:"8px",padding:"5px 0",borderRadius:"6px",border:"1px solid var(--border)",background:"rgba(74,158,255,0.06)",color:"var(--accent)",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"},children:"🔍 クリックで拡大"}),i&&n.jsx("div",{onClick:()=>s(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2e3,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(4px)"},children:n.jsxs("div",{onClick:d=>d.stopPropagation(),style:{background:"var(--bg)",borderRadius:"12px",border:"1px solid var(--border)",padding:"20px",width:"min(92vw,900px)",maxHeight:"90vh",overflowY:"auto"},children:[n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)"},children:"出来高・売買代金ランキング（拡大）"}),n.jsx("button",{onClick:()=>s(!1),style:{background:"rgba(255,255,255,0.08)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",fontSize:"13px",padding:"4px 12px",fontFamily:"var(--font)"},children:"✕ 閉じる"})]}),c]})})]})}function al({stocks:t}){const[e,r]=S.useState(!1);if(!t||!t.length)return n.jsx("div",{style:{textAlign:"center",padding:"24px",color:"var(--text3)",fontSize:"12px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px"},children:"データ取得中..."});const i=n.jsx(Wr,{stocks:t,themeName:"",onNavigate:null});return n.jsxs("div",{children:[i,n.jsx("button",{onClick:()=>r(!0),style:{display:"block",width:"100%",marginTop:"8px",padding:"5px 0",borderRadius:"6px",border:"1px solid var(--border)",background:"rgba(74,158,255,0.06)",color:"var(--accent)",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"},children:"🔍 クリックで拡大"}),e&&n.jsx("div",{onClick:()=>r(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2e3,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(4px)"},children:n.jsxs("div",{onClick:s=>s.stopPropagation(),style:{background:"var(--bg)",borderRadius:"12px",border:"1px solid var(--border)",padding:"20px",width:"min(92vw,1000px)",maxHeight:"90vh",overflowY:"auto"},children:[n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)"},children:"銘柄別ヒートマップ（拡大）"}),n.jsx("button",{onClick:()=>r(!1),style:{background:"rgba(255,255,255,0.08)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",fontSize:"13px",padding:"4px 12px",fontFamily:"var(--font)"},children:"✕ 閉じる"})]}),i]})})]})}const ll=[{label:"1日",value:"1d"},{label:"1週間",value:"5d"},{label:"1ヶ月",value:"1mo"},{label:"3ヶ月",value:"3mo"},{label:"6ヶ月",value:"6mo"},{label:"1年",value:"1y"}];function cr(t){return t?t>=1e12?(t/1e12).toFixed(1)+"兆":t>=1e8?(t/1e8).toFixed(1)+"億":t>=1e4?(t/1e4).toFixed(1)+"万":t.toLocaleString():"0"}function bn({msg:t="データ取得中..."}){return n.jsxs("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)"},children:[[0,.2,.4].map((e,r)=>n.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",background:"var(--accent)",margin:"0 3px",animation:`pulse 1.2s ease-in-out ${e}s infinite`}},r)),n.jsx("div",{style:{marginTop:"12px",fontSize:"12px"},children:t})]})}function Sn({items:t,title:e,colorFn:r,emptyMsg:i}){if(!t||!t.length)return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",textAlign:"center",color:"var(--text3)",fontSize:"12px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:e}),i||"データなし"]});const s=Math.max(...t.map(o=>Math.abs(o.pct)),.01);return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:e}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:t.map((o,a)=>{const l=r(o.pct),c=Math.abs(o.pct)/s*100;return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"90px 1fr 60px",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"},children:o.name}),n.jsx("div",{style:{height:"12px",background:"rgba(255,255,255,0.04)",borderRadius:"3px",overflow:"hidden"},children:n.jsx("div",{style:{height:"100%",width:`${c}%`,background:l,borderRadius:"3px",opacity:.85}})}),n.jsxs("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,textAlign:"right",color:l,whiteSpace:"nowrap"},children:[o.pct>=0?"+":"",o.pct.toFixed(1),"%"]})]},o.ticker)})})]})}function cl({data:t}){if(!t||t.length<3)return null;const e=64,r=24,i=Math.min(...t),o=Math.max(...t)-i||1,a=t.map((d,h)=>{const f=h/(t.length-1)*e,u=r-(d-i)/o*r;return`${f.toFixed(1)},${u.toFixed(1)}`}).join(" "),l=t[t.length-1]>=t[0]?"#ff5370":"#00c48c",c=Math.max(0,Math.min(r,r-(0-i)/o*r));return n.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${e} ${r}`,preserveAspectRatio:"none",style:{display:"block"},children:[n.jsx("line",{x1:0,y1:c,x2:e,y2:c,stroke:"rgba(255,255,255,0.15)",strokeWidth:"0.8",strokeDasharray:"2,2"}),n.jsx("polyline",{points:`0,${r} ${a} ${e},${r}`,fill:`${l}18`,stroke:"none"}),n.jsx("polyline",{points:a,fill:"none",stroke:l,strokeWidth:"1.4",strokeLinejoin:"round",strokeLinecap:"round"})]})}const dr={padding:"6px 8px",textAlign:"right",fontSize:"10px",fontWeight:600,letterSpacing:"0.06em",color:"var(--text3)",textTransform:"uppercase",whiteSpace:"nowrap",background:"var(--bg3)"},Dt={padding:"8px 10px",textAlign:"center",whiteSpace:"nowrap",color:"var(--text2)"},Ne={padding:"8px 10px",textAlign:"right",whiteSpace:"nowrap"},dl={padding:"8px 12px",textAlign:"left"};function hl({stocks:t,onAddToTheme:e}){if(!t||!t.length)return null;const[r,i]=S.useState("pct"),[s,o]=S.useState(!1),a=S.useRef(null),l=S.useRef(null),c=S.useRef(!1),d=S.useRef(0),h=S.useRef(0),f=[...t].sort((x,p)=>{const v=x[r]??0,w=p[r]??0;return s?v-w:w-v});S.useEffect(()=>{const x=a.current,p=l.current;if(!x||!p)return;const v=()=>{p.scrollLeft=x.scrollLeft},w=()=>{x.scrollLeft=p.scrollLeft};return x.addEventListener("scroll",v),p.addEventListener("scroll",w),()=>{x.removeEventListener("scroll",v),p.removeEventListener("scroll",w)}},[]);const u=x=>{c.current=!0,d.current=x.pageX-a.current.offsetLeft,h.current=a.current.scrollLeft,a.current.style.cursor="grabbing"},g=x=>{c.current&&(x.preventDefault(),a.current.scrollLeft=h.current-(x.pageX-a.current.offsetLeft-d.current)*1.2)},y=()=>{c.current=!1,a.current&&(a.current.style.cursor="grab")},m=["株価","騰落率","時価総額","寄与度%","出来高増減","出来高","出来高順位","売買代金","売買代金順位","追加"],b=[{key:"pct",label:"騰落率"},{key:"volume",label:"出来高"},{key:"trade_value",label:"売買代金"}];return n.jsxs(n.Fragment,{children:[n.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center",marginBottom:"8px",flexWrap:"wrap"},children:[n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",fontWeight:600,whiteSpace:"nowrap"},children:"並び替え:"}),b.map(x=>n.jsxs("button",{onClick:()=>{r===x.key?o(p=>!p):(i(x.key),o(!1))},style:{padding:"3px 10px",borderRadius:"5px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:r===x.key?"rgba(74,158,255,0.15)":"transparent",border:r===x.key?"1px solid rgba(74,158,255,0.4)":"1px solid var(--border)",color:r===x.key?"var(--accent)":"var(--text3)"},children:[x.label," ",r===x.key?s?"↑":"↓":""]},x.key)),n.jsx("button",{onClick:()=>o(x=>!x),style:{padding:"3px 10px",borderRadius:"5px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"transparent",border:"1px solid var(--border)",color:"var(--text3)"},children:s?"↑ 昇順":"↓ 降順"})]}),n.jsx("div",{ref:l,style:{overflowX:"auto",overflowY:"hidden",height:"14px",marginBottom:"2px"},children:n.jsx("div",{style:{width:"1400px",height:"1px"}})}),n.jsx("div",{ref:a,className:"sticky-table",style:{cursor:"grab",userSelect:"none"},onMouseDown:u,onMouseMove:g,onMouseUp:y,onMouseLeave:y,children:n.jsxs("table",{style:{borderCollapse:"collapse",fontSize:"12px",fontFamily:"var(--font)",width:"100%"},children:[n.jsx("thead",{children:n.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[n.jsx("th",{style:{...dr,textAlign:"center",width:"32px",minWidth:"32px",maxWidth:"32px",padding:"8px 4px",background:"var(--bg3)",position:"sticky",left:0,zIndex:3},children:"順"}),n.jsx("th",{style:{...dr,textAlign:"left",minWidth:"120px",background:"var(--bg3)",position:"sticky",left:"32px",zIndex:3},children:"銘柄名"}),m.map(x=>n.jsx("th",{style:{...dr,minWidth:x==="株価"||x==="騰落率"?"70px":"80px"},children:x},x))]})}),n.jsx("tbody",{children:f.map((x,p)=>{var w,H,I;const v=x.pct>=0?"var(--red)":"var(--green)";return n.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[n.jsx("td",{style:{...Dt,fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,color:"var(--text3)",background:p%2===0?"var(--bg2)":"var(--bg3)",position:"sticky",left:0,zIndex:2,width:"32px",minWidth:"32px",maxWidth:"32px",padding:"8px 4px"},children:p+1}),n.jsxs("td",{style:{...dl,fontWeight:600,color:"var(--text)",minWidth:"120px",background:p%2===0?"var(--bg2)":"var(--bg3)",position:"sticky",left:"32px",zIndex:2},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)",marginBottom:"1px"},children:x.ticker.replace(".T","")}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",width:"100%",minWidth:0},children:[n.jsx("span",{style:{flex:1,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0},children:x.name}),n.jsx("span",{style:{display:"inline-block",width:"64px",minWidth:"64px",height:"22px",flexShrink:0},children:n.jsx(cl,{data:x.spark})})]})]}),n.jsx("td",{style:Ne,children:n.jsxs("span",{style:{fontFamily:"var(--mono)",color:"var(--text2)"},children:["¥",(w=x.price)==null?void 0:w.toLocaleString()]})}),n.jsxs("td",{style:{...Ne,color:v,fontWeight:700,fontFamily:"var(--mono)"},children:[x.pct>=0?"+":"",(H=x.pct)==null?void 0:H.toFixed(1),"%"]}),n.jsx("td",{style:{...Ne,fontFamily:"var(--mono)",color:"var(--text2)"},children:x.market_cap>0?cr(x.market_cap):"-"}),n.jsx("td",{style:{...Ne,fontFamily:"var(--mono)",color:(x.contribution??0)>=.5?"#ff5370":(x.contribution??0)>=.1?"#ff8c42":(x.contribution??0)>-.1?"var(--text2)":"#4a9eff"},title:"寄与度",children:x.contribution!=null?(x.contribution>=0?"+":"")+x.contribution.toFixed(2)+"%":"-"}),n.jsxs("td",{style:{...Ne,color:x.volume_chg>=0?"var(--red)":"var(--green)",fontFamily:"var(--mono)"},children:[x.volume_chg>=0?"+":"",(I=x.volume_chg)==null?void 0:I.toFixed(1),"%"]}),n.jsx("td",{style:{...Ne,fontFamily:"var(--mono)",color:"var(--text2)"},children:cr(x.volume)}),n.jsxs("td",{style:Dt,children:[x.vol_rank,"位"]}),n.jsx("td",{style:{...Ne,fontFamily:"var(--mono)",color:"var(--text2)"},children:cr(x.trade_value)}),n.jsxs("td",{style:Dt,children:[x.tv_rank,"位"]}),n.jsx("td",{style:Dt,children:n.jsx("button",{onClick:()=>e&&e({ticker:x.ticker,name:x.name,price:x.price}),title:"カスタムテーマに追加",style:{background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.25)",borderRadius:"4px",color:"var(--accent)",cursor:"pointer",fontSize:"13px",padding:"3px 7px",fontFamily:"var(--font)",lineHeight:1},children:"＋"})})]},x.ticker)})})]})})]})}function ul(){const[t,e]=S.useState(null),[r,i]=S.useState("1mo"),[s,o]=S.useState(null),[a,l]=S.useState({}),[c,d]=S.useState("国内主要株"),[h,f]=S.useState(null),[u,g]=S.useState(null),{data:y,loading:m}=ji(r);S.useEffect(()=>{var O;if(!y)return;o(y.data),l(y.groups||{});const E=(((O=y.groups)==null?void 0:O.国内主要株)||Object.values(y.groups||{})[0]||[])[0];E&&!h&&f(E)},[y]),S.useEffect(()=>{g(null)},[h,r]);const{data:b,loading:x}=ki(h,r);S.useEffect(()=>{if(!b){g(null);return}Array.isArray(b)?g({stocks:b,avg:b.length?b.reduce((E,O)=>E+O.pct,0)/b.length:0}):g(b)},[b]);const p=E=>E>=0?"var(--red)":"var(--green)",v=(u==null?void 0:u.stocks)??[],w=[...v].sort((E,O)=>(O.volume||0)-(E.volume||0)),H=[...v].sort((E,O)=>(O.trade_value||0)-(E.trade_value||0)),I=new Map(w.map((E,O)=>[E.ticker,O+1])),C=new Map(H.map((E,O)=>[E.ticker,O+1])),z=c==="国内全般"&&(h==null?void 0:h.includes("時価総額")),P=v.map(E=>({...E,vol_rank:I.get(E.ticker)??E.vol_rank,tv_rank:C.get(E.ticker)??E.tv_rank})),k=z?[...P].sort((E,O)=>(O.market_cap||0)-(E.market_cap||0)):[...P].sort((E,O)=>O.pct-E.pct),T=(u==null?void 0:u.avg)??0,L=k.filter(E=>E.pct>0).slice(0,5),D=[...k].sort((E,O)=>E.pct-O.pct).filter(E=>E.pct<0).slice(0,5);return n.jsxs("div",{children:[t&&n.jsx(oi,{stock:t,onClose:()=>e(null)}),n.jsxs("div",{className:"page-header-sticky",children:[n.jsx("h1",{style:{fontSize:"18px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap"},children:"市場別詳細"}),n.jsx("select",{value:r,onChange:E=>i(E.target.value),style:pl,children:ll.map(E=>n.jsx("option",{value:E.value,children:E.label},E.value))})]}),n.jsxs("div",{style:{padding:"20px 32px 48px",maxWidth:"1280px",margin:"0 auto"},children:[n.jsxs("div",{style:{background:"rgba(6,214,160,0.05)",border:"1px solid rgba(6,214,160,0.15)",borderRadius:"8px",padding:"12px 16px",marginBottom:"16px",fontSize:"12px",color:"var(--text)",lineHeight:1.8},children:[n.jsx("span",{style:{fontWeight:700,color:"#06d6a0"},children:"📋 このページについて："}),"時価総額上位150銘柄・市場区分（プライム・スタンダード・グロース）ごとに、 構成銘柄の騰落率ランキングと詳細データを確認できます。 上部のタブで「国内主要株」「国内全般」「市場区分」を切り替え、各グループ内のセグメントを選択してください。",n.jsx("br",{}),n.jsx("span",{style:{fontSize:"11px",color:"var(--text3)"},children:"💡 活用ポイント：「テクノロジー」セグメントが強い時はテーマ一覧の「半導体」「AI・クラウド」も チェックしましょう。セグメントとテーマの同時確認で資金の流れをより精度高く把握できます。"})]}),n.jsx("div",{style:{display:"flex",gap:"4px",borderBottom:"1px solid var(--border)",marginBottom:"0"},children:Object.keys(a).map(E=>n.jsx("button",{onClick:()=>{d(E),f(a[E][0])},style:{padding:"8px 16px",fontSize:"13px",cursor:"pointer",border:"none",background:"transparent",color:c===E?"var(--text)":"var(--text3)",fontWeight:c===E?700:400,fontFamily:"var(--font)",borderBottom:c===E?"2px solid var(--accent)":"2px solid transparent",marginBottom:"-1px",transition:"all 0.15s"},children:E},E))}),m?n.jsx(bn,{}):n.jsxs("div",{children:[n.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap",padding:"12px 0",borderBottom:"1px solid var(--border)",marginBottom:"20px"},children:(a[c]||[]).map(E=>{var j;const O=(j=s==null?void 0:s[E])==null?void 0:j.pct,J=E.split("｜")[1]||E.split("（")[0];return n.jsxs("button",{onClick:()=>f(E),style:{padding:"6px 14px",borderRadius:"6px",fontSize:"12px",cursor:"pointer",border:`1px solid ${h===E?"var(--accent)":"var(--border)"}`,background:h===E?"rgba(91,156,246,0.12)":"transparent",color:h===E?"var(--accent)":"var(--text2)",fontFamily:"var(--font)",transition:"all 0.15s",whiteSpace:"nowrap"},children:[J,O!=null&&n.jsxs("span",{style:{marginLeft:"6px",fontSize:"11px",fontFamily:"var(--mono)",color:O>=0?"var(--red)":"var(--green)",fontWeight:700},children:[O>=0?"+":"",O.toFixed(1),"%"]})]},E)})}),x?n.jsx(bn,{msg:"個別株データ取得中..."}):u?n.jsxs("div",{children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"20px",flexWrap:"wrap"},children:[n.jsx("span",{style:{fontSize:"16px",fontWeight:700,color:"var(--text)"},children:h?h.split("｜")[1]||h:""}),n.jsxs("span",{style:{fontSize:"15px",fontFamily:"var(--mono)",fontWeight:700,color:T>=0?"var(--red)":"var(--green)"},children:["平均 ",T>=0?"+":"",T.toFixed(1),"%"]}),n.jsxs("span",{style:{fontSize:"12px",color:"var(--text3)"},children:[k.length,"銘柄"]})]}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"20px"},className:"top5g",children:[n.jsx(Sn,{items:L,title:`▲ 上昇TOP5（${k.filter(E=>E.pct>0).length}銘柄上昇）`,colorFn:p,emptyMsg:"上昇銘柄なし"}),n.jsx(Sn,{items:D,title:`▼ 下落TOP5（${k.filter(E=>E.pct<0).length}銘柄下落）`,colorFn:p,emptyMsg:"下落銘柄なし"})]}),n.jsxs("div",{className:"mr-bottom-grid",children:[n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"10px"},children:"📊 出来高・売買代金ランキング（上位15銘柄）"}),n.jsx(ol,{stocks:k}),n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",margin:"20px 0 10px"},children:"🔥 銘柄別ヒートマップ"}),n.jsx(al,{stocks:k})]}),n.jsxs("div",{children:[n.jsxs("div",{style:{fontSize:"11px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text3)",textTransform:"uppercase",marginBottom:"8px"},children:["構成銘柄一覧 ",n.jsx("span",{style:{color:"var(--text3)",fontSize:"10px",fontWeight:400},children:"← 横にスワイプで詳細確認"})]}),n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"visible"},children:n.jsx(hl,{stocks:k,onAddToTheme:e})})]})]})]}):null]})]}),n.jsx("style",{children:`
        @media (max-width:640px){.top5g{grid-template-columns:1fr !important;}}
        .mr-bottom-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .mr-bottom-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
      `})]})}const pl={background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"6px 12px",cursor:"pointer",outline:"none"};function hr({title:t,children:e,style:r}){const[i,s]=S.useState(!1);return n.jsxs("div",{style:r,children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:t}),n.jsx("div",{onClick:()=>s(!0),style:{cursor:"pointer",position:"relative"},children:e}),n.jsx("button",{onClick:()=>s(!0),style:{display:"block",width:"100%",marginTop:"6px",padding:"5px 0",borderRadius:"6px",border:"1px solid var(--border)",background:"rgba(74,158,255,0.06)",color:"var(--accent)",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"},children:"🔍 クリックで拡大"}),i&&n.jsx("div",{onClick:()=>s(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2e3,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(4px)"},children:n.jsxs("div",{onClick:o=>o.stopPropagation(),style:{background:"var(--bg)",borderRadius:"12px",border:"1px solid var(--border)",padding:"16px",width:"min(80vw, 860px)",maxHeight:"80vh",overflowY:"auto"},children:[n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)"},children:t}),n.jsx("button",{onClick:()=>s(!1),style:{background:"rgba(255,255,255,0.08)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",fontSize:"13px",padding:"4px 12px",fontFamily:"var(--font)"},children:"✕ 閉じる"})]}),e]})})]})}const lt="https://stockwavejp-api.onrender.com",ur=[{label:"1日",value:"1d"},{label:"1週間",value:"5d"},{label:"1ヶ月",value:"1mo"},{label:"3ヶ月",value:"3mo"},{label:"6ヶ月",value:"6mo"},{label:"1年",value:"1y"}],Ze={"🔥加速":"#ff4560","↗転換↑":"#ff8c42","→横ばい":"#4a6080","↘転換↓":"#4a9eff","❄️失速":"#00c48c"};function pr(t){return t?t>=1e12?(t/1e12).toFixed(1)+"兆":t>=1e8?(t/1e8).toFixed(1)+"億":t>=1e4?(t/1e4).toFixed(1)+"万":t.toLocaleString():"0"}function fl(){return n.jsxs("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)"},children:[[0,.2,.4].map((t,e)=>n.jsx("span",{style:{display:"inline-block",width:"6px",height:"6px",borderRadius:"50%",background:"var(--accent)",margin:"0 3px",animation:`pulse 1.2s ease-in-out ${t}s infinite`}},e)),n.jsx("div",{style:{marginTop:"12px",fontSize:"12px"},children:"データ取得中..."})]})}function wn({items:t,title:e,colorFn:r,emptyMsg:i}){if(!t||!t.length)return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"20px",textAlign:"center",color:"var(--text3)",fontSize:"12px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:e}),i||"データなし"]});const s=Math.max(...t.map(o=>Math.abs(o.pct)),.01);return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:e}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:t.map((o,a)=>{const l=r(o.pct),c=Math.abs(o.pct)/s*100;return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"90px 1fr 60px",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"},children:o.name}),n.jsx("div",{style:{height:"12px",background:"rgba(255,255,255,0.04)",borderRadius:"3px",overflow:"hidden"},children:n.jsx("div",{style:{height:"100%",width:`${c}%`,background:l,borderRadius:"3px",opacity:.85}})}),n.jsxs("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,textAlign:"right",color:l,whiteSpace:"nowrap"},children:[o.pct>=0?"+":"",o.pct.toFixed(1),"%"]})]},o.ticker)})})]})}function ai({data:t}){if(!t||t.length<3)return null;const e=64,r=24,i=Math.min(...t),o=Math.max(...t)-i||1,a=t.map((d,h)=>{const f=h/(t.length-1)*e,u=r-(d-i)/o*r;return`${f.toFixed(1)},${u.toFixed(1)}`}).join(" "),l=t[t.length-1]>=t[0]?"#ff5370":"#00c48c",c=Math.max(0,Math.min(r,r-(0-i)/o*r));return n.jsxs("svg",{width:"100%",height:"100%",viewBox:`0 0 ${e} ${r}`,preserveAspectRatio:"none",style:{display:"block"},children:[n.jsx("line",{x1:0,y1:c,x2:e,y2:c,stroke:"rgba(255,255,255,0.15)",strokeWidth:"0.8",strokeDasharray:"2,2"}),n.jsx("polyline",{points:`0,${r} ${a} ${e},${r}`,fill:`${l}18`,stroke:"none"}),n.jsx("polyline",{points:a,fill:"none",stroke:l,strokeWidth:"1.4",strokeLinejoin:"round",strokeLinecap:"round"})]})}function gl({selTheme:t}){const e="https://stockwavejp-api.onrender.com",[r,i]=S.useState(null),[s,o]=S.useState(!1);if(S.useEffect(()=>{t&&(o(!0),i(null),(async()=>{try{const M=(await fetch("/data/market.json?t="+Date.now()).then(Y=>Y.json()))[`vol_trend_${t}`];if(M&&M.dates&&M.dates.length>0){i(M),o(!1);return}}catch{}try{const j=await fetch(`${e}/api/vol-trend/${encodeURIComponent(t)}`).then(M=>M.json());if(j&&j.dates&&j.dates.length>0){i(j),o(!1);return}}catch{}o(!1)})())},[t]),s)return n.jsx("div",{style:{textAlign:"center",padding:"40px",color:"var(--text3)",fontSize:"13px"},children:"データ読み込み中..."});if(!r||!r.dates||r.dates.length===0)return n.jsx("div",{style:{textAlign:"center",padding:"32px",color:"var(--text3)",fontSize:"12px"},children:"推移データがありません（GitHub Actionsの次回実行後に表示されます）"});const{dates:a,volumes:l,trade_values:c}=r,d=c.some(j=>j>0),h=900,f=300,u=72,g=d?72:20,y=24,m=40,b=h-u-g,x=f-y-m,p=a.length,v=Math.max(...l,1),w=Math.max(...c,1),H=Math.min(...l,0),I=Math.min(...c,0),C=j=>u+j/Math.max(p-1,1)*b,z=j=>y+x-(j-H)/(v-H||1)*x,P=j=>y+x-(j-I)/(w-I||1)*x,k=l.map((j,M)=>`${C(M)},${z(j)}`).join(" "),T=j=>j===0?"0":Math.abs(j)>=1e12?(j/1e12).toFixed(1)+"兆":Math.abs(j)>=1e8?(j/1e8).toFixed(1)+"億":Math.abs(j)>=1e4?(j/1e4).toFixed(1)+"万":j.toLocaleString(),L=[0,.25,.5,.75,1].map(j=>H+j*(v-H)),D=[0,.25,.5,.75,1].map(j=>I+j*(w-I)),E=[];let O=null;a.forEach((j,M)=>{const Y=j.slice(0,7);Y!==O&&(E.push({i:M,label:j.slice(5,7)+"月"}),O=Y)});const J=Math.max(2,b/p*.6);return n.jsx("div",{style:{width:"100%",overflowX:"auto"},children:n.jsxs("svg",{viewBox:`0 0 ${h} ${f}`,width:"100%",height:"100%",style:{display:"block",minWidth:"320px",fontFamily:"var(--font)"},children:[[.25,.5,.75,1].map(j=>n.jsx("line",{x1:u,y1:y+x-j*x,x2:u+b,y2:y+x-j*x,stroke:"rgba(255,255,255,0.06)",strokeWidth:"1"},j)),d&&c.map((j,M)=>{const Y=P(I)-P(j);return Y<=0?null:n.jsx("rect",{x:C(M)-J/2,y:P(j),width:J,height:Y,fill:"rgba(255,140,66,0.45)",rx:"1"},M)}),n.jsx("polyline",{points:k,fill:"none",stroke:"#4a9eff",strokeWidth:"1.8",strokeLinejoin:"round"}),l.map((j,M)=>n.jsx("circle",{cx:C(M),cy:z(j),r:"2",fill:"#4a9eff"},M)),n.jsx("line",{x1:u,y1:y+x,x2:u+b,y2:y+x,stroke:"rgba(255,255,255,0.15)",strokeWidth:"1"}),E.map(({i:j,label:M})=>n.jsx("text",{x:C(j),y:f-4,textAnchor:"middle",fontSize:"9",fill:"rgba(255,255,255,0.35)",children:M},j)),n.jsx("text",{x:4,y:y-4,fontSize:"9",fill:"#4a9eff",children:"出来高"}),L.map((j,M)=>n.jsx("text",{x:u-4,y:z(j)+3,textAnchor:"end",fontSize:"8",fill:"rgba(74,158,255,0.7)",children:T(j)},M)),d&&n.jsx("text",{x:h-4,y:y-4,fontSize:"9",fill:"#ff8c42",textAnchor:"end",children:"売買代金"}),d&&D.map((j,M)=>n.jsx("text",{x:u+b+4,y:P(j)+3,textAnchor:"start",fontSize:"8",fill:"rgba(255,140,66,0.7)",children:T(j)},M)),n.jsx("circle",{cx:u+10,cy:y-5,r:"4",fill:"#4a9eff"}),n.jsx("text",{x:u+18,y:y-1,fontSize:"9",fill:"#4a9eff",children:"出来高（折れ線・左軸）"}),n.jsx("rect",{x:u+140,y:y-10,width:"10",height:"8",fill:"rgba(255,140,66,0.6)",rx:"1"}),d&&n.jsx("text",{x:u+154,y:y-1,fontSize:"9",fill:"#ff8c42",children:"売買代金（棒グラフ・右軸）"})]})})}function xl({stocks:t,period:e}){if(!t||t.length===0)return null;const r=a=>!a||a===0?"-":a>=1e12?(a/1e12).toFixed(1)+"兆":a>=1e8?(a/1e8).toFixed(1)+"億":a>=1e4?(a/1e4).toFixed(1)+"万":a.toLocaleString(),i=t.map(a=>{const l=a.pct??0,c=a.volume_chg??0,d=a.trade_value??0,h=Math.min(40,Math.max(0,l*2)),f=Math.min(25,Math.max(0,c*.5)),u=d>0?Math.min(15,Math.log10(d)*1.5):0;let g=0,y=0;if(a.spark&&a.spark.length>=6){const x=a.spark,p=x.length,v=Math.floor(p/2),w=x.slice(0,v).reduce((I,C)=>I+C,0)/v;y=x.slice(v).reduce((I,C)=>I+C,0)/(p-v)-w,g=Math.min(20,Math.max(0,y*3))}const m=h+f+g+u;return{...a,_score:m,_reason:(()=>{const x=[];return l>=10?x.push("この期間の騰落率は+"+l.toFixed(1)+"%と大幅上昇しており、テーマ全体を牽引する動きを見せています"):l>=5?x.push("この期間の騰落率は+"+l.toFixed(1)+"%と堅調で、テーマ内の上位上昇銘柄です"):l>=2?x.push("+"+l.toFixed(1)+"%の上昇でテーマ平均を上回っています"):l>0&&x.push("+"+l.toFixed(1)+"%と小幅ながらプラスを維持しています"),c>=50?x.push("出来高が+"+c.toFixed(0)+"%と急増しており、機関投資家・外国人投資家の大口資金の流入が強く示唆されます"):c>=20&&x.push("出来高が+"+c.toFixed(0)+"%増加しており、市場参加者の注目が高まっています"),y>3?x.push("直近の価格推移が後半にかけて加速（後半平均+"+y.toFixed(1)+"%）しており、モメンタムが強まっています"):y>1&&x.push("価格推移が後半にかけてやや改善（後半+"+y.toFixed(1)+"%）しています"),d>=5e9?x.push("売買代金は"+r(d)+"と非常に大きく、流動性が高い主力銘柄として積極的に売買されています"):d>=1e9&&x.push("売買代金は"+r(d)+"と十分な規模があり、積極的な売買が行われています"),x.length===0&&x.push("騰落率・出来高・価格推移・売買代金の総合評価で、このテーマ内での注目度が高い銘柄として選定されました"),x.join("。")+"。"})()}}).filter(a=>(a.pct??0)>0&&a._score>3).sort((a,l)=>l._score-a._score).slice(0,3);if(i.length===0)return null;const s=["🥇","🥈","🥉"],o=["#ffd166","rgba(192,192,192,0.7)","rgba(205,127,50,0.7)"];return n.jsxs("div",{style:{marginBottom:"20px"},children:[n.jsxs("div",{style:{marginBottom:"12px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"},children:[n.jsx("span",{style:{fontSize:"12px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap"},children:"🔎 注目銘柄ピックアップ"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",display:"block",paddingLeft:"2px"},children:"騰落率・出来高・勢い・売買代金を総合スコアで機械的に集計した参考情報です"})]}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"},className:"pickup-grid",children:i.map((a,l)=>{var f,u;const c=(a.pct??0)>=0?"#ff5370":"#00c48c",d=Math.min(100,Math.round(a._score)),h=d>=60?"#ff5370":d>=35?"#ff8c42":"#ffd166";return n.jsxs("div",{style:{background:"var(--bg2)",borderRadius:"8px",padding:"12px 14px",border:"1px solid var(--border)",borderTop:"3px solid "+o[l],display:"flex",flexDirection:"column",gap:"6px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"14px"},children:s[l]}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)"},children:a.ticker.replace(".T","")}),n.jsxs("span",{style:{marginLeft:"auto",fontSize:"13px",fontWeight:700,color:c,fontFamily:"var(--mono)"},children:[(a.pct??0)>=0?"+":"",(f=a.pct)==null?void 0:f.toFixed(1),"%"]})]}),n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)",lineHeight:1.4},children:a.name||a.ticker.replace(".T","")}),a.spark&&a.spark.length>=3&&n.jsx("span",{style:{display:"inline-block",width:"100%",height:"24px"},children:n.jsx(ai,{data:a.spark})}),n.jsxs("div",{style:{display:"flex",gap:"10px",fontSize:"10px",fontFamily:"var(--mono)",color:"var(--text3)"},children:["¥"+(((u=a.price)==null?void 0:u.toLocaleString())||"-"),(a.trade_value??0)>0&&n.jsx("span",{children:"売買代金 "+r(a.trade_value)})]}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"9px",color:"var(--text3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0},children:"注目度"}),n.jsx("span",{style:{fontSize:"15px",fontWeight:800,fontFamily:"var(--mono)",color:h,lineHeight:1},children:d}),n.jsx("span",{style:{fontSize:"9px",color:"var(--text3)",marginRight:"4px"},children:"/100"}),n.jsx("div",{style:{flex:1,height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"},children:n.jsx("div",{style:{width:d+"%",height:"100%",background:h,borderRadius:"2px"}})})]}),n.jsx("p",{style:{fontSize:"10px",color:"var(--text2)",lineHeight:1.75,margin:0},children:a._reason})]},a.ticker)})}),n.jsxs("div",{style:{marginTop:"8px",padding:"8px 12px",background:"rgba(255,193,7,0.05)",borderRadius:"5px",border:"1px solid rgba(255,193,7,0.15)",fontSize:"10px",color:"var(--text3)",lineHeight:1.8},children:["⚠️ ",n.jsx("strong",{style:{color:"var(--text2)"},children:"注意："}),"上記ピックアップは騰落率・出来高・価格推移・売買代金を独自スコアで機械的に集計したものです。",n.jsx("strong",{style:{color:"var(--text2)"},children:"リアルタイムデータではなく"}),"、 GitHub Actionsによるデータ取得タイミング（1日数回更新）に依存するため、 最新の市場状況と乖離する場合があります。 特定銘柄の購入・売却を推奨するものではなく、",n.jsx("strong",{style:{color:"var(--text2)"},children:"投資の最終判断はご自身の責任でお願いします"}),"。"]})]})}function ml({stocks:t}){if(!t||!t.length)return null;const[e,r]=S.useState(null),[i,s]=S.useState("pct"),[o,a]=S.useState(!1),l=S.useRef(null),c=S.useRef(null),d=S.useRef(!1),h=S.useRef(0),f=S.useRef(0),u=[...t].sort((p,v)=>{const w=p[i]??0,H=v[i]??0;return o?w-H:H-w});S.useEffect(()=>{const p=l.current,v=c.current;if(!p||!v)return;const w=()=>{v.scrollLeft=p.scrollLeft},H=()=>{p.scrollLeft=v.scrollLeft};return p.addEventListener("scroll",w),v.addEventListener("scroll",H),()=>{p.removeEventListener("scroll",w),v.removeEventListener("scroll",H)}},[]);const g=p=>{d.current=!0,h.current=p.pageX-l.current.offsetLeft,f.current=l.current.scrollLeft,l.current.style.cursor="grabbing"},y=p=>{if(!d.current)return;p.preventDefault();const w=(p.pageX-l.current.offsetLeft-h.current)*1.2;l.current.scrollLeft=f.current-w},m=()=>{d.current=!1,l.current&&(l.current.style.cursor="grab")},b=["ミニチャート","株価","騰落率","時価総額","寄与度%","出来高増減","出来高","出来高順位","売買代金","売買代金順位"],x=[{key:"pct",label:"騰落率"},{key:"volume",label:"出来高"},{key:"trade_value",label:"売買代金"}];return n.jsxs(n.Fragment,{children:[e&&n.jsx(oi,{stock:e,onClose:()=>r(null)}),n.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center",marginBottom:"8px",flexWrap:"wrap"},children:[n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",fontWeight:600,whiteSpace:"nowrap"},children:"並び替え:"}),x.map(p=>n.jsxs("button",{onClick:()=>{i===p.key?a(v=>!v):(s(p.key),a(!1))},style:{padding:"3px 10px",borderRadius:"5px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:i===p.key?"rgba(74,158,255,0.15)":"transparent",border:i===p.key?"1px solid rgba(74,158,255,0.4)":"1px solid var(--border)",color:i===p.key?"var(--accent)":"var(--text3)"},children:[p.label," ",i===p.key?o?"↑":"↓":""]},p.key)),n.jsx("button",{onClick:()=>a(p=>!p),style:{padding:"3px 10px",borderRadius:"5px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"transparent",border:"1px solid var(--border)",color:"var(--text3)"},children:o?"↑ 昇順":"↓ 降順"})]}),n.jsx("div",{ref:c,style:{overflowX:"auto",overflowY:"hidden",height:"14px",marginBottom:"2px"},children:n.jsx("div",{style:{width:"1400px",height:"1px"}})}),n.jsx("div",{ref:l,className:"sticky-table",style:{cursor:"grab",userSelect:"none"},onMouseDown:g,onMouseMove:y,onMouseUp:m,onMouseLeave:m,children:n.jsxs("table",{style:{borderCollapse:"collapse",fontSize:"12px",fontFamily:"var(--font)",width:"100%"},children:[n.jsx("thead",{children:n.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[n.jsx("th",{className:"sticky-col1",style:{...Lt,textAlign:"center",width:"32px",minWidth:"32px",maxWidth:"32px",padding:"8px 4px",background:"var(--bg3)",position:"sticky",left:0,zIndex:3},children:"順"}),n.jsx("th",{className:"sticky-col2",style:{...Lt,textAlign:"left",minWidth:"120px",background:"var(--bg3)",position:"sticky",left:"32px",zIndex:3},children:"銘柄名"}),b.map(p=>n.jsx("th",{style:{...Lt,minWidth:p==="ミニチャート"?"72px":"80px",width:p==="ミニチャート"?"72px":void 0},children:p},p)),n.jsx("th",{style:{...Lt,minWidth:"60px",background:"var(--bg3)"},children:"追加"})]})}),n.jsx("tbody",{children:u.map((p,v)=>{var H,I,C;const w=p.pct>=0?"var(--red)":"var(--green)";return n.jsxs("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.04)",background:v%2===0?"transparent":"rgba(255,255,255,0.02)"},children:[n.jsx("td",{style:{...ct,fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,color:"var(--text3)",background:v%2===0?"var(--bg2)":"var(--bg3)",position:"sticky",left:0,zIndex:2,minWidth:"32px",width:"32px",maxWidth:"32px",padding:"8px 4px"},children:v+1}),n.jsxs("td",{style:{...yl,fontWeight:600,color:"var(--text)",background:v%2===0?"var(--bg2)":"var(--bg3)",position:"sticky",left:"32px",zIndex:2,minWidth:"160px",maxWidth:"220px"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)",marginBottom:"1px"},children:p.ticker.replace(".T","")}),n.jsx("div",{style:{display:"flex",alignItems:"center"},children:n.jsx("span",{style:{fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:p.name})})]}),n.jsx("td",{style:{...ct,padding:"4px 8px",minWidth:"72px",width:"72px"},children:n.jsx("span",{style:{display:"inline-block",width:"64px",height:"22px",verticalAlign:"middle"},children:n.jsx(ai,{data:p.spark})})}),n.jsx("td",{style:De,children:n.jsxs("span",{style:{fontFamily:"var(--mono)",color:"var(--text2)"},children:["¥",(H=p.price)==null?void 0:H.toLocaleString()]})}),n.jsxs("td",{style:{...De,color:w,fontWeight:700,fontFamily:"var(--mono)"},children:[p.pct>=0?"+":"",(I=p.pct)==null?void 0:I.toFixed(1),"%"]}),n.jsx("td",{style:{...De,fontFamily:"var(--mono)",color:"var(--text2)"},children:p.market_cap>0?pr(p.market_cap):"-"}),n.jsx("td",{style:{...De,fontFamily:"var(--mono)",color:(p.contribution??0)>=70?"#ff5370":(p.contribution??0)>=40?"#ff8c42":(p.contribution??0)>=0?"var(--text2)":"#4a9eff"},title:"寄与度: この銘柄がテーマ騰落率に貢献した割合（%）",children:p.contribution!=null?(p.contribution>=0?"+":"")+p.contribution.toFixed(2)+"%":"-"}),n.jsxs("td",{style:{...De,color:p.volume_chg>=0?"var(--red)":"var(--green)",fontFamily:"var(--mono)"},children:[p.volume_chg>=0?"+":"",(C=p.volume_chg)==null?void 0:C.toFixed(1),"%"]}),n.jsx("td",{style:{...De,fontFamily:"var(--mono)",color:"var(--text2)"},children:pr(p.volume)}),n.jsxs("td",{style:ct,children:[p.vol_rank,"位"]}),n.jsx("td",{style:{...De,fontFamily:"var(--mono)",color:"var(--text2)"},children:pr(p.trade_value)}),n.jsxs("td",{style:ct,children:[p.tv_rank,"位"]}),n.jsx("td",{style:ct,children:n.jsx("button",{onClick:()=>r({ticker:p.ticker,name:p.name,price:p.price}),title:"カスタムテーマに追加",style:{background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.25)",borderRadius:"4px",color:"var(--accent)",cursor:"pointer",fontSize:"13px",padding:"3px 7px",fontFamily:"var(--font)",lineHeight:1},children:"＋"})})]},p.ticker)})})]})})]})}const Lt={padding:"6px 8px",textAlign:"right",fontSize:"10px",fontWeight:600,letterSpacing:"0.06em",color:"var(--text3)",textTransform:"uppercase",whiteSpace:"nowrap",background:"var(--bg3)"},ct={padding:"8px 10px",textAlign:"center",whiteSpace:"nowrap",color:"var(--text2)"},De={padding:"8px 10px",textAlign:"right",whiteSpace:"nowrap"},yl={padding:"8px 12px",textAlign:"left",minWidth:"120px"},Qe={半導体製造装置:"semiconductor-theme",半導体検査装置:"semiconductor-theme",半導体材料:"semiconductor-theme",メモリ:"semiconductor-theme",パワー半導体:"power-semiconductor",次世代半導体:"semiconductor-theme",生成AI:"ai-cloud-theme",AIデータセンター:"ai-cloud-theme",フィジカルAI:"physical-ai-edge-ai",AI半導体:"semiconductor-theme",AI人材:"education-hr-theme",エッジAI:"physical-ai-edge-ai","EV・電気自動車":"ev-green-theme",全固体電池:"ev-green-theme",自動運転:"ev-green-theme",ドローン:"drone-theme","輸送・物流":"transport-logistics-theme",造船:"shipbuilding-theme",再生可能エネルギー:"renewable-energy-theme",太陽光発電:"renewable-energy-theme",核融合発電:"renewable-energy-theme",原子力発電:"renewable-energy-theme",電力会社:"renewable-energy-theme",LNG:"inpex-analysis",石油:"inpex-analysis",蓄電池:"ev-green-theme","資源（水素・ヘリウム・水）":"rare-earth-resources-theme",IOWN:"optical-communication",光通信:"optical-communication",通信:"telecom-theme",量子コンピューター:"ai-cloud-theme",SaaS:"fintech-theme",ウェアラブル端末:"game-entertainment-theme",仮想通貨:"fintech-theme",ネット銀行:"banking-finance-theme","鉄鋼・素材":"steel-materials-theme",化学:"chemical-theme",建築資材:"construction-infra-theme",塗料:"chemical-theme","医薬品・バイオ":"pharma-bio-theme","ヘルスケア・介護":"healthcare-nursing-theme","薬局・ドラッグストア":"healthcare-nursing-theme","銀行・金融":"banking-finance-theme",地方銀行:"regional-bank-theme",保険:"insurance-theme",フィンテック:"fintech-theme",不動産:"real-estate-theme","建設・インフラ":"construction-infra-theme",国土強靭化計画:"national-resilience",下水道:"construction-infra-theme","食品・飲料":"food-beverage-theme","農業・フードテック":"agritech-foodtech-theme","小売・EC":"retail-ec-theme","観光・ホテル・レジャー":"tourism-hotel-theme",インバウンド:"inbound-theme","リユース・中古品":"retail-ec-theme","防衛・航空":"defense-theme","宇宙・衛星":"space-satellite-theme","ロボット・自動化":"robot-automation-theme","レアアース・資源":"rare-earth-resources-theme",バフェット銘柄:"sogo-shosha-analysis",サイバーセキュリティ:"cybersecurity-theme",警備:"cybersecurity-theme","脱炭素・ESG":"ev-green-theme","教育・HR・人材":"education-hr-theme",人材派遣:"education-hr-theme"};function vl({onNavigate:t,initialTheme:e}){var ee,ne,ce,W,V,q;const[r,i]=S.useState("1mo"),[s,o]=S.useState([]),[a,l]=S.useState(e||""),[c,d]=S.useState(null),[h,f]=S.useState(!1),[u,g]=S.useState(null),[y,m]=S.useState([]),[b,x]=S.useState({}),[p,v]=S.useState({}),[w,H]=S.useState(!1),[I,C]=S.useState(!1),[z,P]=S.useState("1y");S.useEffect(()=>{fetch("/data/market.json?t="+Date.now()).then(R=>R.json()).then(R=>{var G,X,N;const A=((G=R.theme_names)==null?void 0:G.themes)||((N=(X=R.themes_1mo)==null?void 0:X.themes)==null?void 0:N.map($=>$.theme))||[];if(A.length>0)return{themes:A};throw new Error("no names")}).catch(()=>fetch(`${lt}/api/theme-names`).then(R=>R.json())).then(R=>{var A;if(o(R.themes||[]),(A=R.themes)!=null&&A.length){const G=e&&R.themes.includes(e)?e:R.themes[0];l(X=>X||G),m(R.themes.slice(0,3))}}).catch(()=>{})},[]),S.useEffect(()=>{e&&l(e)},[e]),S.useEffect(()=>{a&&m(R=>R.includes(a)?R:[a,...R.slice(0,2)])},[a]),S.useEffect(()=>{a&&(f(!0),d(null),g(null),(async()=>{var R,A;try{const G=await fetch("/data/market.json?t="+Date.now()).then(ie=>ie.json()),X=`theme_detail_${a}_${r}`,N="momentum_1mo",$=G[X],re=((R=G[N])==null?void 0:R.data)||[];if($){d($);const ie=re.find(_e=>_e.theme===a);g(ie||null),f(!1);return}}catch{}try{const G=await fetch("/data/market.json?t="+Date.now()).then(re=>re.json()),X=`theme_detail_${a}_1mo`,N=G[X],$=((A=G.momentum_1mo)==null?void 0:A.data)||[];if(N){d(N);const re=$.find(ie=>ie.theme===a);g(re||null),f(!1);return}}catch{}try{const[G,X]=await Promise.all([fetch(`${lt}/api/theme-detail/${encodeURIComponent(a)}?period=${r}`).then($=>$.json()),fetch(`${lt}/api/momentum?period=1mo`).then($=>$.json())]);d(G.data);const N=(X.data||[]).find($=>$.theme===a);g(N||null)}catch{}f(!1)})())},[a,r]),S.useEffect(()=>{y.length&&(H(!0),(async()=>{var R;try{const A=await fetch("/data/market.json?t="+Date.now()).then($=>$.json()),G=`trends_${z}`,X=((R=A[G])==null?void 0:R.data)||{};if(y.some($=>X[$])){const $={};y.forEach(re=>{X[re]&&($[re]=X[re])}),x($),H(!1);return}}catch{}try{const A=await fetch(`${lt}/api/trends?themes=${encodeURIComponent(y.join(","))}&period=${z}`).then(G=>G.json());x(A.trends||{})}catch{}H(!1)})())},[y,z]),S.useEffect(()=>{C(!0),fetch("/data/market.json?t="+Date.now()).then(R=>R.json()).then(R=>{var G;const A=`macro_${z}`;if((G=R[A])!=null&&G.data){v(R[A].data);return}throw new Error("no macro")}).catch(()=>fetch(`${lt}/api/macro?period=${z}`).then(R=>R.json()).then(R=>v(R.data||{})).catch(()=>{})).finally(()=>C(!1))},[z]);const[k,T]=S.useState(null);S.useEffect(()=>{if(!a)return;let R=!1;return(async()=>{var A;try{const X=(A=(await fetch("/data/market.json?t="+Date.now()).then(N=>N.json())).heatmap)==null?void 0:A.data;if(X&&X[a]&&!R){T(X[a]);return}}catch{}})(),()=>{R=!0}},[a]);const L=R=>R>=0?"var(--red)":"var(--green)",D=(c==null?void 0:c.stocks)??[],E=[...D].sort((R,A)=>(A.volume||0)-(R.volume||0)),O=[...D].sort((R,A)=>(A.trade_value||0)-(R.trade_value||0)),J=new Map(E.map((R,A)=>[R.ticker,A+1])),j=new Map(O.map((R,A)=>[R.ticker,A+1])),M=D.map(R=>({...R,vol_rank:J.get(R.ticker)??R.vol_rank,tv_rank:j.get(R.ticker)??R.tv_rank})),Y=M.filter(R=>R.pct>0).slice(0,5),Q=[...M].sort((R,A)=>R.pct-A.pct).filter(R=>R.pct<0).slice(0,5);return n.jsxs("div",{children:[n.jsxs("div",{className:"page-header-sticky",style:{flexWrap:"wrap",gap:"6px"},children:[n.jsx("h1",{style:{fontSize:"16px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap",flexShrink:0},children:"テーマ別詳細"}),n.jsx("select",{value:a,onChange:R=>l(R.target.value),style:{...kn,maxWidth:"160px",flex:"1 1 120px"},children:s.map(R=>n.jsx("option",{value:R,children:R},R))}),n.jsx("select",{value:r,onChange:R=>i(R.target.value),style:{...kn,flexShrink:0},children:ur.map(R=>n.jsx("option",{value:R.value,children:R.label},R.value))})]}),n.jsx("div",{className:"theme-detail-body",style:{padding:"20px 32px 80px"},children:h?n.jsx(fl,{}):c?n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"theme-summary-card",style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px 16px",marginBottom:"12px"},children:[n.jsxs("div",{className:"theme-summary-pc",style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[n.jsx("span",{style:{fontSize:"18px",fontWeight:700,color:"var(--text)"},children:a}),n.jsxs("span",{style:{fontSize:"16px",fontFamily:"var(--mono)",fontWeight:700,color:((c==null?void 0:c.avg)??0)>=0?"var(--red)":"var(--green)"},children:["平均 ",((c==null?void 0:c.avg)??0)>=0?"+":"",(ee=c==null?void 0:c.avg)==null?void 0:ee.toFixed(1),"%"]}),u&&n.jsxs(n.Fragment,{children:[n.jsx("div",{style:{width:"1px",height:"20px",background:"var(--border)"}}),n.jsx("span",{style:{fontSize:"12px",color:"var(--text3)"},children:"先月比"}),n.jsxs("span",{style:{fontSize:"13px",fontFamily:"var(--mono)",fontWeight:600,color:u.month_diff>=0?"var(--red)":"var(--green)"},children:[u.month_diff>=0?"+":"",(ne=u.month_diff)==null?void 0:ne.toFixed(1),"pt"]}),n.jsx("span",{style:{fontSize:"12px",fontWeight:600,padding:"2px 10px",borderRadius:"20px",color:Ze[u.state]??"var(--text2)",background:(Ze[u.state]??"#4a6080")+"18",border:"1px solid "+(Ze[u.state]??"var(--border)")+"40"},children:u.state})]}),n.jsxs("span",{style:{fontSize:"11px",color:"var(--text3)",marginLeft:"auto"},children:[M.length,"銘柄構成 ／ ",(ce=ur.find(R=>R.value===r))==null?void 0:ce.label]}),Qe[a]&&t&&n.jsx("button",{onClick:()=>t("コラム・解説",Qe[a]),style:{padding:"6px 14px",background:"rgba(74,158,255,0.08)",border:"1px solid rgba(74,158,255,0.3)",borderRadius:"6px",color:"var(--accent)",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font)",fontWeight:600,whiteSpace:"nowrap"},children:"📖 解説記事を読む"})]}),n.jsxs("div",{className:"theme-summary-mobile",children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"},children:[Qe[a]&&t&&n.jsx("button",{onClick:()=>t("コラム・解説",Qe[a]),style:{padding:"4px 10px",flexShrink:0,background:"rgba(74,158,255,0.08)",border:"1px solid rgba(74,158,255,0.3)",borderRadius:"5px",color:"var(--accent)",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font)",fontWeight:600},children:"📖 解説記事"}),n.jsx("span",{style:{fontSize:"15px",fontWeight:700,color:"var(--text)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:a}),n.jsxs("span",{style:{fontSize:"16px",fontFamily:"var(--mono)",fontWeight:700,flexShrink:0,color:((c==null?void 0:c.avg)??0)>=0?"var(--red)":"var(--green)"},children:[((c==null?void 0:c.avg)??0)>=0?"+":"",(W=c==null?void 0:c.avg)==null?void 0:W.toFixed(1),"%"]})]}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"},children:[u&&n.jsxs(n.Fragment,{children:[n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:"先月比"}),n.jsxs("span",{style:{fontSize:"11px",fontFamily:"var(--mono)",fontWeight:600,color:u.month_diff>=0?"var(--red)":"var(--green)"},children:[u.month_diff>=0?"+":"",(V=u.month_diff)==null?void 0:V.toFixed(1),"pt"]}),n.jsx("span",{style:{fontSize:"10px",fontWeight:600,padding:"2px 7px",borderRadius:"20px",color:Ze[u.state]??"var(--text2)",background:(Ze[u.state]??"#4a6080")+"18",border:"1px solid "+(Ze[u.state]??"var(--border)")+"40"},children:u.state})]}),n.jsxs("span",{style:{fontSize:"10px",color:"var(--text3)"},children:[M.length,"銘柄 ／ ",(q=ur.find(R=>R.value===r))==null?void 0:q.label]})]})]})]}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},className:"top5g",children:[n.jsx(wn,{items:Y,title:`▲ 上昇TOP5（${M.filter(R=>R.pct>0).length}銘柄上昇）`,colorFn:L,emptyMsg:"上昇銘柄なし"}),n.jsx(wn,{items:Q,title:`▼ 下落TOP5（${M.filter(R=>R.pct<0).length}銘柄下落）`,colorFn:L,emptyMsg:"下落銘柄なし"})]}),n.jsx(xl,{stocks:M,period:r}),n.jsxs("div",{className:"td-bottom-grid",children:[n.jsxs("div",{className:"td-left",children:[n.jsx(hr,{title:`📈 ${a} 騰落率（期間別）`,children:k&&typeof k=="object"?(()=>{const R=[{k:"1d",label:"1D",v:(c==null?void 0:c.avg)??null},{k:"1W",label:"1W",v:k["1W"]},{k:"1M",label:"1M",v:k["1M"]},{k:"3M",label:"3M",v:k["3M"]},{k:"6M",label:"6M",v:k["6M"]},{k:"1Y",label:"1Y",v:k["1Y"]}].filter(Z=>Z.v!=null),A=R.map(Z=>Z.v),G=Math.min(...A),X=Math.max(...A),N=10,$=G>=0?0:Math.floor(G/N)*N-N,re=Math.ceil(X/N)*N+N,ie=re-$||1,_e=520,_=210,K=54,oe=16,le=16,Se=32,$e=_e-K-oe,Ht=_-le-Se,ye=Math.floor($e/R.length)-6,me=Z=>le+Ht-(Z-$)/ie*Ht,ot=me(0),Nr=[];for(let Z=$;Z<=re;Z+=N)Nr.push(Z);return n.jsx("div",{style:{width:"100%",overflowX:"auto"},children:n.jsxs("svg",{viewBox:`0 0 ${_e} ${_}`,width:"100%",style:{display:"block",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)",minWidth:"280px"},children:[Nr.map(Z=>n.jsxs("g",{children:[n.jsx("line",{x1:K,y1:me(Z),x2:K+$e,y2:me(Z),stroke:Z===0?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.07)",strokeWidth:Z===0?1.2:.8,strokeDasharray:Z===0?"4,3":"3,4"}),n.jsx("text",{x:K-4,y:me(Z)+4,textAnchor:"end",fontSize:"9",fill:"rgba(255,255,255,0.4)",children:Z===0?"0%":(Z>0?"+":"")+Z+"%"})]},Z)),R.map((Z,di)=>{const Zt=K+di*($e/R.length)+3,Dr=Z.v>=0?"#ff5370":"#00c48c",Qt=Z.v>=0?me(Z.v):ot,Lr=Math.abs(me(Z.v)-ot);return n.jsxs("g",{children:[n.jsx("rect",{x:Zt,y:Qt,width:ye,height:Math.max(Lr,1),fill:Dr,fillOpacity:"0.85",rx:"2"}),n.jsx("text",{x:Zt+ye/2,y:_-4,textAnchor:"middle",fontSize:"10",fill:"rgba(255,255,255,0.6)",children:Z.label}),n.jsxs("text",{x:Zt+ye/2,y:Z.v>=0?Qt-3:Qt+Lr+11,textAnchor:"middle",fontSize:"9",fill:Dr,fontWeight:"700",children:[Z.v>=0?"+":"",Z.v.toFixed(1),"%"]})]},Z.k)})]})})})():n.jsx("div",{style:{textAlign:"center",padding:"24px",color:"var(--text3)",fontSize:"12px",background:"var(--bg2)",borderRadius:"10px",border:"1px solid var(--border)"},children:"データ準備中（GitHub Actions実行後に表示）"})}),k&&typeof k=="object"&&k["1W"]!=null&&n.jsx(hr,{title:"🔥 銘柄別ヒートマップ",children:n.jsx(Wr,{stocks:M,themeName:a,onNavigate:t})}),n.jsx(hr,{title:"📊 出来高・売買代金 推移（週次）",style:{marginTop:"14px"},children:n.jsx("div",{style:{height:"200px"},children:n.jsx(gl,{selTheme:a})})}),t&&n.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"14px"},children:[Qe[a]&&n.jsxs("button",{onClick:()=>t("コラム・解説",Qe[a]),style:{padding:"7px 16px",borderRadius:"6px",fontSize:"12px",background:"rgba(74,158,255,0.08)",border:"1px solid rgba(74,158,255,0.3)",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:["📖 ",a,"のコラム記事"]}),n.jsx("button",{onClick:()=>t("週次レポート"),style:{padding:"7px 16px",borderRadius:"6px",fontSize:"12px",background:"rgba(255,140,66,0.08)",border:"1px solid rgba(255,140,66,0.3)",color:"#ff8c42",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600},children:"📰 週次レポート →"})]})]}),n.jsxs("div",{className:"td-right",children:[n.jsxs("div",{style:{fontSize:"11px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text3)",textTransform:"uppercase",marginBottom:"8px"},children:["構成銘柄一覧 ",n.jsx("span",{style:{fontSize:"10px",fontWeight:400},children:"← 横にスワイプ"})]}),n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"hidden"},children:n.jsx(ml,{stocks:M})})]})]})]}):n.jsx("div",{style:{color:"var(--text3)",fontSize:"13px"},children:"テーマを選択してください"})}),n.jsx("style",{children:`
        .theme-summary-pc     { display: flex; }
        .theme-summary-mobile { display: none; }
        /* ④ 下部2カラム: 左=グラフ / 右=銘柄表 */
        .td-bottom-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 12px;
        }
        .td-left  { min-width: 0; }
        .td-right { min-width: 0; }
        @media (min-width: 900px) {
          .td-bottom-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        @media (max-width:640px) {
          .top5g { grid-template-columns: 1fr !important; }
          .pickup-grid { grid-template-columns: 1fr !important; }
          .theme-detail-body { padding: 10px 10px 40px !important; }
          .theme-summary-pc     { display: none !important; }
          .theme-summary-mobile { display: block !important; }
        }
        @media (min-width:1200px) {
          .theme-detail-body { padding: 16px 40px 60px !important; }
        }
      `})]})}const kn={background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"6px 12px",cursor:"pointer",outline:"none"},Gt="https://stockwavejp-api.onrender.com",jn=[{label:"1週間",value:"5d"},{label:"1ヶ月",value:"1mo"},{label:"3ヶ月",value:"3mo"}];function An(t){return t?t>=1e12?(t/1e12).toFixed(1)+"兆":t>=1e8?(t/1e8).toFixed(1)+"億":t>=1e4?(t/1e4).toFixed(1)+"万":t.toLocaleString():"0"}function bl({stocks:t,period:e}){const[r,i]=S.useState({}),[s,o]=S.useState(!0);if(S.useEffect(()=>{if(!(t!=null&&t.length))return;o(!0);const P=t.map(k=>fetch(`${Gt}/api/stock-history/${encodeURIComponent(k.ticker)}?period=${e}`).then(T=>T.json()).catch(()=>null));Promise.all(P).then(k=>{const T={};k.forEach((L,D)=>{var E;(E=L==null?void 0:L.data)!=null&&E.length&&(T[t[D].name]=L.data)}),i(T),o(!1)})},[t,e]),s)return n.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--text3)",fontSize:"12px"},children:"グラフデータ取得中..."});const a=Object.keys(r);if(!a.length)return n.jsx("div",{style:{padding:"20px",textAlign:"center",color:"var(--text3)",fontSize:"12px"},children:"グラフデータなし"});const l=[...new Set(a.flatMap(P=>r[P].map(k=>k.date)))].sort(),c=800,d=200,h=44,f=16,u=12,g=28,y=["#4a9eff","#ff4560","#06d6a0","#ffd166","#aa77ff","#ff8c42","#e63030","#06d6a0"];let m=1/0,b=-1/0;a.forEach(P=>r[P].forEach(k=>{k.pct<m&&(m=k.pct),k.pct>b&&(b=k.pct)})),m===1/0&&(m=-1,b=1);const x=(b-m)*.1||1,p=m-x,v=b+x,w=P=>h+P/Math.max(l.length-1,1)*(c-h-f),H=P=>u+(1-(P-p)/(v-p))*(d-u-g),I=[-20,-10,0,10,20].filter(P=>P>=p-5&&P<=v+5),C=Math.max(1,Math.floor(l.length/5)),z=[];for(let P=0;P<l.length;P+=C)z.push({i:P,date:l[P]});return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px",overflowX:"auto"},children:[n.jsxs("svg",{viewBox:`0 0 ${c} ${d}`,width:"100%",style:{display:"block",minWidth:"280px"},children:[I.map(P=>n.jsxs("g",{children:[n.jsx("line",{x1:h,y1:H(P),x2:c-f,y2:H(P),stroke:"rgba(120,140,180,0.1)",strokeWidth:"1"}),P===0&&n.jsx("line",{x1:h,y1:H(0),x2:c-f,y2:H(0),stroke:"rgba(120,140,180,0.3)",strokeWidth:"1",strokeDasharray:"4,3"}),n.jsxs("text",{x:h-4,y:H(P)+3,textAnchor:"end",fill:"var(--text3)",fontSize:"8",fontFamily:"DM Mono",children:[P>0?`+${P}`:P,"%"]})]},P)),z.map(({i:P,date:k})=>n.jsx("text",{x:w(P),y:d-4,textAnchor:"middle",fill:"var(--text3)",fontSize:"8",children:wl(k)},k)),a.map((P,k)=>{const L=r[P].map(D=>{const E=l.indexOf(D.date);return E>=0?`${w(E)},${H(D.pct)}`:null}).filter(Boolean);return L.length?n.jsx("polyline",{points:L.join(" "),fill:"none",stroke:y[k%y.length],strokeWidth:"1.8",strokeLinejoin:"round",strokeLinecap:"round"},P):null})]}),n.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"10px",marginTop:"8px"},children:a.map((P,k)=>{var D,E;const T=(D=r[P])==null?void 0:D.at(-1),L=y[k%y.length];return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},children:[n.jsx("div",{style:{width:"14px",height:"2px",background:L,borderRadius:"1px"}}),n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)"},children:P}),T&&n.jsxs("span",{style:{fontSize:"11px",fontFamily:"var(--mono)",color:L,fontWeight:700},children:[T.pct>=0?"+":"",(E=T.pct)==null?void 0:E.toFixed(1),"%"]})]},P)})})]})}function _n({stocks:t,period:e,onRemove:r}){const[i,s]=S.useState({}),[o,a]=S.useState(!0);if(S.useEffect(()=>{t!=null&&t.length&&(a(!0),Promise.all(t.map(c=>fetch(`${Gt}/api/stock-info/${encodeURIComponent(c.ticker)}`).then(d=>d.json()).catch(()=>null))).then(c=>{const d={};c.forEach((h,f)=>{h&&(d[t[f].ticker]=h)}),s(d),a(!1)}))},[t,e]),!(t!=null&&t.length))return n.jsx("div",{style:{textAlign:"center",padding:"20px",color:"var(--text3)",fontSize:"12px"},children:"銘柄がありません"});const l=t.length&&Object.values(i).length?Object.values(i).reduce((c,d)=>c+(d.pct??0),0)/Object.values(i).length:null;return n.jsxs("div",{children:[l!==null&&n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"},children:[n.jsx("span",{style:{fontSize:"12px",color:"var(--text3)"},children:"テーマ平均騰落率"}),n.jsxs("span",{style:{fontSize:"18px",fontWeight:700,fontFamily:"var(--mono)",color:l>=0?"var(--red)":"var(--green)"},children:[l>=0?"+":"",l.toFixed(2),"%"]})]}),n.jsx("div",{style:{overflowX:"auto"},children:n.jsxs("table",{style:{borderCollapse:"collapse",fontSize:"12px",fontFamily:"var(--font)",width:"100%",minWidth:"600px"},children:[n.jsx("thead",{children:n.jsx("tr",{style:{borderBottom:"1px solid var(--border)"},children:["#","銘柄名","株価","騰落率","出来高","売買代金","操作"].map(c=>n.jsx("th",{style:{padding:"6px 10px",textAlign:c==="銘柄名"?"left":"right",fontSize:"10px",fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap",background:"var(--bg3)",...c==="#"||c==="操作"?{textAlign:"center"}:{}},children:c},c))})}),n.jsx("tbody",{children:t.map((c,d)=>{const h=i[c.ticker],f=((h==null?void 0:h.pct)??0)>=0?"var(--red)":"var(--green)",u=d%2===0?"transparent":"rgba(255,255,255,0.02)";return n.jsxs("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.04)",background:u},children:[n.jsx("td",{style:{padding:"8px 10px",textAlign:"center",color:"var(--text3)",fontFamily:"var(--mono)",fontSize:"11px"},children:d+1}),n.jsxs("td",{style:{padding:"8px 10px",textAlign:"left"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",fontFamily:"var(--mono)"},children:c.ticker.replace(".T","")}),n.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--text)"},children:c.name})]}),n.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontFamily:"var(--mono)",color:"var(--text2)"},children:o?"...":h!=null&&h.price?`¥${h.price.toLocaleString()}`:"-"}),n.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontFamily:"var(--mono)",fontWeight:700,color:o?"var(--text3)":f},children:o?"...":(h==null?void 0:h.pct)!=null?`${h.pct>=0?"+":""}${h.pct.toFixed(1)}%`:"-"}),n.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontFamily:"var(--mono)",color:"var(--text2)"},children:o?"...":An(h==null?void 0:h.volume)}),n.jsx("td",{style:{padding:"8px 10px",textAlign:"right",fontFamily:"var(--mono)",color:"var(--text2)"},children:o?"...":An(h==null?void 0:h.trade_value)}),n.jsx("td",{style:{padding:"8px 10px",textAlign:"center"},children:r&&n.jsx("button",{onClick:()=>r(c.ticker),style:{background:"none",border:"1px solid var(--border)",borderRadius:"4px",color:"var(--text3)",cursor:"pointer",padding:"2px 7px",fontSize:"11px",fontFamily:"var(--font)"},children:"✕"})})]},c.ticker)})})]})})]})}function Sl({stocks:t}){const[e,r]=S.useState({}),[i,s]=S.useState("tv");S.useEffect(()=>{t!=null&&t.length&&fetch("/data/market.json?t="+Date.now()).then(u=>u.json()).then(u=>{const g={};t.forEach(y=>{Object.keys(u).filter(m=>m.startsWith("vol_trend_"))}),r(g)}).catch(()=>{})},[t]);const[o,a]=S.useState({}),l="https://stockwavejp-api.onrender.com";if(S.useEffect(()=>{t!=null&&t.length&&Promise.all(t.map(u=>fetch(`${l}/api/stock-info/${encodeURIComponent(u.ticker)}`).then(g=>g.json()).catch(()=>null))).then(u=>{const g={};u.forEach((y,m)=>{y&&(g[t[m].ticker]=y)}),a(g)})},[t]),!Object.keys(o).length)return n.jsx("div",{style:{textAlign:"center",padding:"20px",color:"var(--text3)",fontSize:"12px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px"},children:"データ取得中..."});const c=i==="tv"?"trade_value":"volume",d=t.map(u=>{var g,y;return{...u,val:((g=o[u.ticker])==null?void 0:g[c])??0,pct:((y=o[u.ticker])==null?void 0:y.pct)??0}}).sort((u,g)=>g.val-u.val),h=Math.max(...d.map(u=>u.val),1),f=u=>u?u>=1e12?(u/1e12).toFixed(1)+"兆":u>=1e8?(u/1e8).toFixed(1)+"億":u>=1e4?(u/1e4).toFixed(1)+"万":u.toLocaleString():"0";return n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px"},children:[n.jsx("div",{style:{display:"flex",gap:"8px",marginBottom:"10px"},children:[{v:"tv",l:"売買代金"},{v:"vol",l:"出来高"}].map(u=>n.jsx("button",{onClick:()=>s(u.v),style:{padding:"4px 12px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:i===u.v?"rgba(74,158,255,0.15)":"transparent",border:i===u.v?"1px solid rgba(74,158,255,0.4)":"1px solid var(--border)",color:i===u.v?"var(--accent)":"var(--text3)"},children:u.l},u.v))}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"5px"},children:d.map(u=>{var m;const g=u.val/h*100,y=u.pct>=0?"var(--red)":"var(--green)";return n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"100px 1fr 70px 54px",gap:"6px",alignItems:"center"},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"},children:u.name}),n.jsx("div",{style:{height:"12px",background:"rgba(255,255,255,0.04)",borderRadius:"3px",overflow:"hidden"},children:n.jsx("div",{style:{height:"100%",width:`${g}%`,background:i==="tv"?"#ff8c42":"#378ADD",borderRadius:"3px",opacity:.85}})}),n.jsx("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",color:"var(--text2)",textAlign:"right"},children:f(u.val)}),n.jsxs("span",{style:{fontFamily:"var(--mono)",fontSize:"11px",fontWeight:700,color:y,textAlign:"right"},children:[u.pct>=0?"+":"",(m=u.pct)==null?void 0:m.toFixed(1),"%"]})]},u.ticker)})})]})}function wl(t){if(!t)return"";const e=t.includes("-")?"-":"/",r=t.split(e);if(r.length<3)return t;const i=r[0].slice(2),s=r[1],o=r[2];return`${i}.${s}/${o}`}function kl({stocks:t,period:e}){const[r,i]=S.useState({}),s="https://stockwavejp-api.onrender.com";S.useEffect(()=>{t!=null&&t.length&&Promise.all(t.map(a=>fetch(`${s}/api/stock-info/${encodeURIComponent(a.ticker)}`).then(l=>l.json()).catch(()=>null))).then(a=>{const l={};a.forEach((c,d)=>{c&&(l[t[d].ticker]=c)}),i(l)})},[t,e]);const o=t.filter(a=>{var l;return((l=r[a.ticker])==null?void 0:l.pct)!=null}).map(a=>({ticker:a.ticker,name:a.name,pct:r[a.ticker].pct??0,volume_chg:r[a.ticker].volume_chg??0,trade_value:r[a.ticker].trade_value??0}));return o.length<2?n.jsx("div",{style:{textAlign:"center",padding:"24px",color:"var(--text3)",fontSize:"12px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",marginTop:"20px"},children:t.length===0?"銘柄がありません":"データ取得中..."}):n.jsxs("div",{style:{marginTop:"20px"},children:[n.jsxs("div",{style:{fontSize:"12px",fontWeight:600,color:"var(--text3)",marginBottom:"8px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"📊 資金フロー散布図"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),n.jsx(Wr,{stocks:o,themeName:"",onNavigate:null})]})}function jl(){const{themes:t,saveTheme:e,deleteTheme:r,syncing:i}=Rr(),{isLoggedIn:s,signIn:o}=Cr(),[a,l]=S.useState("list"),[c,d]=S.useState(null),[h,f]=S.useState(null),[u,g]=S.useState("1mo"),[y,m]=S.useState(!1),[b,x]=S.useState(""),[p,v]=S.useState([]),[w,H]=S.useState(""),[I,C]=S.useState(!1),[z,P]=S.useState([]),[k,T]=S.useState(""),[L,D]=S.useState("1mo"),[E,O]=S.useState(null);S.useEffect(()=>{const W=Fa(window.location.search);W&&(t.find(q=>q.name===W.name)||window.confirm(`URLからテーマ「${W.name}」をインポートしますか？`)&&e(W),window.history.replaceState({},"",window.location.pathname))},[]);const J=c!==null?t[c]:null,j=()=>{if(!J)return;const W=window.location.origin+window.location.pathname+$a(J);navigator.clipboard.writeText(W).then(()=>{m(!0),setTimeout(()=>m(!1),2e3)})},M=W=>{const V=t[W];f(W),x(V.name),v(V.stocks||[]),l("edit"),P([]),H(""),T(""),O(null)},Y=()=>{f(null),x(""),v([]),l("create"),P([]),H(""),T(""),O(null)},Q=async()=>{const W=w.trim();if(W){C(!0),T(""),P([]),O(null);try{if(/^\d{4}$/.test(W)){const q=await(await fetch(`${Gt}/api/stock-info/${encodeURIComponent(W+".T")}`)).json();q.ticker?P([{ticker:q.ticker,name:q.name||q.ticker,price:q.price}]):T(`「${W}」が見つかりませんでした`)}else{const R=((await(await fetch(`${Gt}/api/stock-search?q=${encodeURIComponent(W)}`)).json()).results||[]).filter(A=>{var G;return(G=A.ticker)==null?void 0:G.endsWith(".T")});R.length?P(R):T(`「${W}」に一致する銘柄が見つかりませんでした（証券コード4桁でも検索できます）`)}}catch{T("検索に失敗しました")}C(!1)}},ee=W=>{if(p.find(V=>V.ticker===W.ticker)){T("すでに追加済みです");return}if(p.length>=10){T("1テーマあたりの銘柄上限は10個です");return}v(V=>[...V,W]),P([]),H(""),T(""),O(null)},ne=W=>v(V=>V.filter(q=>q.ticker!==W)),ce=()=>{if(!b.trim()){alert("テーマ名を入力してください");return}if(!p.length){alert("銘柄を1つ以上追加してください");return}e({name:b.trim(),stocks:p},h),l("list")};return a==="list"?n.jsxs("div",{style:{padding:"28px 24px 48px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"},children:[n.jsx("h1",{style:{fontSize:"22px",fontWeight:700,color:"var(--text)"},children:"カスタムテーマ"}),n.jsxs("button",{onClick:Y,disabled:t.length>=3,style:{...dt,opacity:t.length>=3?.4:1,cursor:t.length>=3?"not-allowed":"pointer"},children:["＋ 新規作成",t.length>=3?"（上限）":""]})]}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"8px"},children:"独自のテーマを作成・追跡。銘柄名または4桁証券コードで検索（日本株のみ）。"}),n.jsxs("div",{style:{fontSize:"11px",color:t.length>=3?"var(--red)":"var(--text3)",marginBottom:"16px",display:"flex",alignItems:"center",gap:"6px"},children:[n.jsxs("span",{style:{fontWeight:600},children:["📌 作成数: ",t.length," / 3"]}),t.length>=3&&n.jsx("span",{children:"（上限に達しました。既存テーマを削除してから追加してください）"}),t.length<3&&n.jsx("span",{children:"（最大3テーマまで作成できます）"})]}),!s&&n.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",gap:"12px",flexWrap:"wrap"},children:[n.jsxs("div",{children:[n.jsx("span",{style:{fontSize:"12px",color:"var(--text2)"},children:"💡 "}),n.jsx("span",{style:{fontSize:"12px",color:"var(--text2)"},children:"Googleログインするとどのデバイスでもテーマが同期されます"})]}),n.jsx("button",{onClick:o,style:{background:"rgba(74,158,255,0.15)",border:"1px solid rgba(74,158,255,0.35)",borderRadius:"6px",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",fontSize:"12px",fontWeight:600,padding:"5px 14px",whiteSpace:"nowrap"},children:"Googleでログイン"})]}),i&&n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"8px"},children:"同期中..."}),t.length===0?n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"48px",textAlign:"center"},children:[n.jsx("div",{style:{fontSize:"36px",marginBottom:"12px"},children:"🎨"}),n.jsx("div",{style:{fontSize:"14px",color:"var(--text2)",marginBottom:"20px"},children:"まだカスタムテーマがありません"}),n.jsx("button",{onClick:Y,style:dt,children:"最初のテーマを作成"})]}):n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:t.map((W,V)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",animation:`fadeUp 0.3s ease ${V*.05}s both`,cursor:"pointer",transition:"border-color 0.15s"},onClick:()=>{d(V),l("detail")},onMouseEnter:q=>q.currentTarget.style.borderColor="rgba(74,158,255,0.3)",onMouseLeave:q=>q.currentTarget.style.borderColor="var(--border)",children:[n.jsxs("div",{style:{flex:1,minWidth:0},children:[n.jsx("div",{style:{fontSize:"15px",fontWeight:700,color:"var(--text)",marginBottom:"6px"},children:W.name}),n.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"},children:(W.stocks||[]).map(q=>n.jsx("span",{style:{fontSize:"11px",padding:"2px 8px",borderRadius:"20px",background:"rgba(74,158,255,0.1)",color:"var(--accent)",border:"1px solid rgba(74,158,255,0.2)"},children:q.name},q.ticker))})]}),n.jsxs("span",{style:{fontSize:"12px",color:"var(--text3)",whiteSpace:"nowrap"},children:[(W.stocks||[]).length,"銘柄"]}),n.jsx("button",{onClick:q=>{q.stopPropagation(),M(V)},style:Bt,children:"編集"}),n.jsx("button",{onClick:q=>{q.stopPropagation(),window.confirm("削除しますか？")&&r(V)},style:Al,children:"削除"})]},V))})]}):a==="detail"&&J?n.jsxs("div",{style:{padding:"20px 24px 48px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px",flexWrap:"wrap"},children:[n.jsx("button",{onClick:()=>l("list"),style:{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",fontSize:"20px",padding:0},children:"←"}),n.jsx("h1",{style:{fontSize:"20px",fontWeight:700,color:"var(--text)",flex:1},children:J.name}),n.jsxs("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:[jn.map(W=>n.jsx("button",{onClick:()=>g(W.value),style:{padding:"4px 12px",borderRadius:"6px",fontSize:"11px",cursor:"pointer",fontFamily:"var(--font)",fontWeight:u===W.value?700:400,border:u===W.value?"1px solid var(--accent)":"1px solid var(--border)",background:u===W.value?"rgba(74,158,255,0.12)":"transparent",color:u===W.value?"var(--accent)":"var(--text3)"},children:W.label},W.value)),n.jsx("button",{onClick:()=>M(c),style:Bt,children:"✏️ 編集"}),n.jsx("button",{onClick:j,style:{...Bt,color:y?"var(--green)":"var(--text2)"},children:y?"✓ コピー済み":"🔗 URLをコピー"})]})]}),n.jsxs("div",{className:"ct-detail-grid",children:[n.jsxs("div",{children:[n.jsxs("div",{style:{marginBottom:"16px"},children:[n.jsxs("div",{style:{fontSize:"12px",fontWeight:600,color:"var(--text3)",marginBottom:"8px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"📈 構成銘柄 騰落率推移"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),n.jsx(bl,{stocks:J.stocks,period:u})]}),n.jsxs("div",{style:{marginBottom:"16px"},children:[n.jsxs("div",{style:{fontSize:"12px",fontWeight:600,color:"var(--text3)",marginBottom:"8px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"📊 出来高・売買代金推移"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),n.jsx(Sl,{stocks:J.stocks})]}),n.jsx(kl,{stocks:J.stocks,period:u})]}),n.jsxs("div",{children:[n.jsxs("div",{style:{fontSize:"12px",fontWeight:600,color:"var(--text3)",marginBottom:"8px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsxs("span",{children:["📋 構成銘柄 詳細データ（",J.stocks.length,"/10銘柄）"]}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px"},children:n.jsx(_n,{stocks:J.stocks,period:u})})]})]}),n.jsx("div",{style:{marginTop:"20px",padding:"12px 16px",background:"rgba(74,158,255,0.06)",border:"1px solid rgba(74,158,255,0.15)",borderRadius:"8px",fontSize:"12px",color:"var(--text3)"},children:"💡 「URLをコピー」でこのテーマを共有・ブックマークできます。URLにアクセスすると自動でインポートされます。"}),n.jsx("style",{children:`
        .ct-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .ct-detail-grid { grid-template-columns: 1fr 1fr; align-items: start; }
        }
      `})]}):n.jsxs("div",{style:{padding:"28px 24px 48px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"14px",marginBottom:"24px"},children:[n.jsx("button",{onClick:()=>l("list"),style:{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",fontSize:"20px",padding:0},children:"←"}),n.jsx("h1",{style:{fontSize:"20px",fontWeight:700,color:"var(--text)"},children:a==="edit"?"テーマを編集":"新規テーマ作成"})]}),n.jsxs("div",{style:{marginBottom:"20px"},children:[n.jsx("label",{style:fr,children:"テーマ名"}),n.jsx("input",{value:b,onChange:W=>x(W.target.value),placeholder:"例：AIロボット、注目銘柄 など",style:{...Hn,width:"100%",maxWidth:"400px"}})]}),n.jsxs("div",{style:{marginBottom:"20px"},children:[n.jsx("label",{style:fr,children:"銘柄を追加"}),n.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"6px",flexWrap:"wrap"},children:[n.jsx("input",{value:w,onChange:W=>H(W.target.value),onKeyDown:W=>W.key==="Enter"&&Q(),placeholder:"銘柄名（例：トヨタ、ソニー）または証券コード（例：7203）",style:{...Hn,flex:1,minWidth:"200px"}}),n.jsx("button",{onClick:Q,disabled:I||!w.trim(),style:{...dt,opacity:!w.trim()||I?.5:1},children:I?"検索中...":"🔍 検索"})]}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)"},children:"※ 日本株のみ対応"}),k&&n.jsx("div",{style:{fontSize:"12px",color:"var(--red)",marginTop:"8px",padding:"8px 12px",background:"rgba(255,83,112,0.08)",borderRadius:"6px",border:"1px solid rgba(255,83,112,0.2)"},children:k}),z.length>0&&n.jsxs("div",{style:{marginTop:"10px"},children:[n.jsx("div",{style:{display:"flex",gap:"4px",marginBottom:"8px"},children:jn.map(W=>n.jsx("button",{onClick:()=>D(W.value),style:{padding:"3px 10px",borderRadius:"4px",fontSize:"11px",cursor:"pointer",fontFamily:"var(--font)",border:"none",background:L===W.value?"var(--accent)":"var(--bg3)",color:L===W.value?"#fff":"var(--text3)"},children:W.label},W.value))}),n.jsx("div",{style:{border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden"},children:z.map((W,V)=>n.jsxs("div",{children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"10px 14px",background:V%2===0?"var(--bg2)":"var(--bg3)",borderBottom:V<z.length-1||E===W.ticker?"1px solid var(--border)":"none",cursor:"pointer"},onClick:()=>O(E===W.ticker?null:W.ticker),children:[n.jsxs("div",{style:{flex:1},children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--text)"},children:W.name}),n.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",fontFamily:"var(--mono)"},children:[W.ticker.replace(".T",""),W.price&&n.jsxs("span",{style:{marginLeft:"10px",color:"var(--text2)"},children:["¥",W.price.toLocaleString()]})]})]}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:E===W.ticker?"▲":"▼"}),n.jsx("button",{onClick:q=>{q.stopPropagation(),ee(W)},style:dt,children:"追加"})]}),E===W.ticker&&n.jsx("div",{style:{padding:"10px 14px",background:"var(--bg2)",borderBottom:V<z.length-1?"1px solid var(--border)":"none"},children:n.jsx(_n,{stocks:[W],period:L})})]},W.ticker))})]})]}),p.length>0&&n.jsxs("div",{style:{marginBottom:"24px"},children:[n.jsxs("label",{style:fr,children:["追加済み銘柄（",p.length,"/10銘柄　※最大10銘柄まで）"]}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"5px"},children:p.map((W,V)=>n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 12px",animation:`fadeUp 0.2s ease ${V*.03}s both`},children:[n.jsx("span",{style:{fontSize:"12px",color:"var(--text3)",fontFamily:"var(--mono)",width:"60px",flexShrink:0},children:W.ticker.replace(".T","")}),n.jsx("span",{style:{flex:1,fontSize:"13px",color:"var(--text)",fontWeight:500},children:W.name}),W.price&&n.jsxs("span",{style:{fontSize:"12px",color:"var(--text2)",fontFamily:"var(--mono)"},children:["¥",W.price.toLocaleString()]}),n.jsx("button",{onClick:()=>ne(W.ticker),style:{background:"none",border:"1px solid var(--border)",borderRadius:"4px",color:"var(--text3)",cursor:"pointer",padding:"3px 8px",fontSize:"12px",fontFamily:"var(--font)"},children:"✕"})]},W.ticker))})]}),n.jsxs("div",{style:{display:"flex",gap:"10px"},children:[n.jsxs("button",{onClick:ce,disabled:!b.trim()||!p.length,style:{...dt,fontSize:"14px",padding:"10px 24px",opacity:!b.trim()||!p.length?.4:1},children:["💾 ",a==="edit"?"変更を保存":"テーマを作成"]}),n.jsx("button",{onClick:()=>l("list"),style:{...Bt,fontSize:"14px",padding:"10px 18px"},children:"キャンセル"})]})]})}const dt={background:"rgba(74,158,255,0.15)",color:"var(--accent)",border:"1px solid rgba(74,158,255,0.3)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"7px 14px",cursor:"pointer",fontWeight:600,transition:"all 0.15s",whiteSpace:"nowrap"},Bt={background:"transparent",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"7px 12px",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"},Al={background:"rgba(255,83,112,0.1)",color:"var(--red)",border:"1px solid rgba(255,83,112,0.2)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"7px 12px",cursor:"pointer",transition:"all 0.15s"},Hn={background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"6px",fontFamily:"var(--font)",fontSize:"13px",padding:"8px 12px",outline:"none"},fr={display:"block",fontSize:"11px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text2)",textTransform:"uppercase",marginBottom:"8px"},In=[{date:"2026/04/01",title:"コラム8本追加・説明文充実",body:"各ページに説明文とポイントを追加しました。コラムページに親子上場・バフェット銘柄・フィジカルAI・パワー半導体・NISA・光通信・国土強靭化・中東情勢の8本を追加。全20本となりました。"},{date:"2026/03/31",title:"カスタムテーマ機能強化",body:"Googleログインによるマルチデバイス同期に対応しました。テーマ一覧・テーマ別詳細からカスタムテーマへの追加ボタンも設置されています。"},{date:"2026/03/28",title:"市場別ランキング→市場別詳細に名称変更",body:"より内容を正確に表す「市場別詳細」に名称を変更しました。また1日・1週間・1ヶ月など期間選択のデフォルトを1日表示に変更しました。"},{date:"2026/03/14",title:"React版リリース",body:"StockWaveJP がReact+FastAPIに移行しました。デザイン・モバイル対応が大幅に改善されています。"},{date:"2026/03/01",title:"出来高・売買代金ランキング追加",body:"テーマ一覧ページに出来高・売買代金のランキンググラフを追加しました。"},{date:"2026/02/15",title:"騰落モメンタム機能追加",body:"先週比・先月比の変化から「加速・失速・転換」テーマを一目で把握できる騰落モメンタムページを追加しました。"}],_l="/data/market.json";function Hl(){const[t,e]=S.useState([]);S.useEffect(()=>{fetch(`${_l}?t=${Date.now()}`).then(s=>s.json()).then(s=>{const o=s.corporate_actions||[];e(o)}).catch(()=>{})},[]);const r=In.map(s=>s.date),i=r.length>0?r.reduce((s,o)=>s>o?s:o):null;return n.jsxs("div",{style:{padding:"28px 32px 48px"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",color:"#e8f0ff",marginBottom:"4px"},children:"お知らせ"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"28px"},children:"StockWaveJPの機能追加・変更・修正情報"}),t.length>0&&n.jsxs("div",{style:{marginBottom:"24px"},children:[n.jsxs("div",{style:{fontSize:"12px",fontWeight:700,color:"var(--text2)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"10px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"📢 銘柄アクション情報"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),t.map((s,o)=>{var a;return n.jsxs("div",{style:{background:"rgba(255,214,25,0.06)",border:"1px solid rgba(255,214,25,0.2)",borderRadius:"8px",padding:"12px 16px",marginBottom:"8px",display:"flex",alignItems:"flex-start",gap:"12px"},children:[n.jsx("span",{style:{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:"20px",background:"rgba(255,214,25,0.15)",color:"#ffd619",border:"1px solid rgba(255,214,25,0.3)",flexShrink:0,marginTop:"1px"},children:s.type==="split"?"株式分割":s.type==="merge"?"株式併合":s.type==="delist"?"上場廃止":s.type==="rename"?"社名変更":"アクション"}),n.jsxs("div",{style:{flex:1,minWidth:0},children:[n.jsxs("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--text)",marginBottom:"3px"},children:[s.name,"（",(a=s.ticker)==null?void 0:a.replace(".T",""),"）"]}),n.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:1.7},children:s.detail}),n.jsxs("div",{style:{fontSize:"10px",color:"var(--text3)",marginTop:"4px",fontFamily:"var(--mono)"},children:["確認日: ",s.detected_at,s.effective_date&&` ／ 実施予定日: ${s.effective_date}`]})]})]},o)})]}),n.jsxs("div",{style:{fontSize:"12px",fontWeight:700,color:"var(--text2)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"10px",display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"📋 更新履歴"}),n.jsx("div",{style:{flex:1,height:"1px",background:"var(--border)"}})]}),In.map((s,o)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px 24px",marginBottom:"12px",animation:`fadeUp 0.3s ease ${o*.06}s both`},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"},children:[n.jsx("span",{style:{fontSize:"11px",color:"var(--text3)",fontFamily:"var(--mono)"},children:s.date}),s.date===i&&n.jsx("span",{style:{fontSize:"10px",padding:"2px 8px",borderRadius:"20px",background:"rgba(74,158,255,0.12)",color:"var(--accent)",border:"1px solid rgba(74,158,255,0.25)",fontWeight:700},children:"NEW"})]}),n.jsx("div",{style:{fontSize:"15px",fontWeight:600,color:"#e8f0ff",marginBottom:"8px"},children:s.title}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:1.7},children:s.body})]},o))]})}const Il=[{icon:"📊",title:"テーマ一覧",desc:"67テーマの騰落率・出来高・売買代金を一覧比較できるページです。",items:["上部の期間セレクター（1日/1週間/1ヶ月/3ヶ月/6ヶ月/1年）で表示期間を切り替えられます。","「全テーマ 騰落率ランキング」はデフォルトで上位4件を表示。「トップ10を表示」「全67テーマを表示」ボタンで拡張できます。","ページ下部の月次グラフ（騰落率・出来高・売買代金）はPC版ではクリックで拡大表示できます。スマホ版は通常表示です。","月次グラフはテーマを複数選択して比較できます。テーマバッジをクリックで解除、「＋ テーマを追加する」ボタンで追加できます。","テーマヒートマップ（右下）はPC版でクリック拡大。拡大時に注目ゾーンの説明が表示されます。バブルにカーソルを当てるとテーマ名・騰落率・出来高・売買代金がツールチップで表示されます。"]},{icon:"🔥",title:"テーマヒートマップ",desc:"67テーマの資金フローを散布図で可視化するページです。",items:["X軸が騰落率（右ほど上昇）、Y軸が出来高急増率（上ほど出来高増）、バブルの大きさが売買代金を示します。","右上の「注目ゾーン」は上昇＋出来高急増の最強シグナルエリアです。左上は売り圧力、右下は静かな上昇、左下は静かな下落を示します。","バブルにカーソルを当てるとテーマ名・騰落率・出来高急増率・売買代金が表示されます。","バブルをクリックするとそのテーマの詳細ページに移動します。","上部のセレクターで期間（1日/1週間/1ヶ月/3ヶ月）を切り替えられます。"]},{icon:"🔍",title:"テーマ別詳細",desc:"個別テーマの構成銘柄を詳細分析するページです。",items:["上部ドロップダウンでテーマを選択。期間も切り替え可能です。","上昇/下落TOP5、注目銘柄ピックアップ（※リアルタイムではなくデータ取得タイミングに依存）が全幅で表示されます。","ページ下部は2カラム構成（PC版）。左カラムに出来高グラフ・銘柄別ヒートマップ・遷移ボタン、右カラムに構成銘柄表が配置されます。","銘柄表は騰落率・出来高・売買代金でソート可能。ヘッダーのボタンで昇順/降順も切り替えられます。","表はクリック&ドラッグで横移動できます。上部にもスクロールバーが表示されています。","各グラフはクリックで拡大表示できます。","「＋」ボタンで銘柄をカスタムテーマに追加できます。"]},{icon:"📋",title:"市場別詳細",desc:"市場区分・業種別セグメントの銘柄を比較分析するページです。",items:["上部でセグメント（国内主要株・テクノロジー・金融・プライム市場など）と期間を切り替えられます。","ページ下部は2カラム構成（PC版）。左カラムに銘柄表、右カラムに銘柄別ヒートマップ・出来高/売買代金グラフが配置されます。","銘柄表はドラッグスクロール・ソートボタン対応。上部スクロールバーも表示されています。","バブルにカーソルを当てると銘柄名・騰落率・出来高・売買代金が表示されます。"]},{icon:"🎨",title:"カスタムテーマ",desc:"自分だけのテーマを作成して銘柄を比較追跡できます。",items:["最大3テーマ、1テーマあたり最大10銘柄まで作成できます。","銘柄名または4桁証券コードで日本株を検索して追加できます。","Googleログインするとデバイスをまたいでテーマが同期されます。未ログインの場合はブラウザのLocalStorageに保存されます。","テーマ詳細では騰落率グラフ・出来高グラフ・銘柄別ヒートマップ・構成銘柄表が表示されます（2カラム構成・PC版）。","「URLをコピー」でテーマを他のユーザーと共有できます。"]},{icon:"📰",title:"週次レポート",desc:"毎週末更新のマーケットレポートです。",items:["レポートはカード形式で一覧表示されます。クリックするとレポート全文が表示されます。","レポート内でテーマ名が登場する箇所の近くに「テーマ別詳細」「コラムを読む」ボタンが表示されます。","週間上昇/下落TOP5テーマのバッジをクリックするとそのテーマの詳細ページに移動できます。","AIによる自動生成ではなく、市場データをもとに手動作成しています。"]},{icon:"📝",title:"コラム・解説",desc:"各テーマの詳細解説・関連銘柄分析記事を掲載しています。",items:["67テーマすべての解説コラムと主要銘柄の個別分析記事があります。","テーマ別詳細ページからも「関連コラム記事を読む」ボタンで直接移動できます。"]},{icon:"⚙️",title:"設定",desc:"カラーテーマやグラフ表示モードを変更できます。",items:["カラーテーマ: ダーク（デフォルト）・ライト（ホワイト）から選択できます。","一部グラフ要素でカラーテーマ切替時に色が変わらない場合がありますが、順次改善中です。"]}],El=[{q:"データはリアルタイムですか？",a:"リアルタイムではありません。GitHub Actionsにより1日数回（平日7:00/9:00/12:00/15:30/23:30 UTC）自動更新されます。最新データの反映には最大数時間かかる場合があります。ページ右上の「最終更新」時刻を確認してください。"},{q:"注目銘柄ピックアップはどのように選ばれていますか？",a:"騰落率・出来高・価格推移・売買代金を独自スコアで機械的に集計しています。リアルタイムデータではなくデータ取得タイミングに依存するため、最新の市場状況と乖離する場合があります。投資判断の参考程度としてご利用ください。"},{q:"売買代金の単位は何ですか？",a:"億・兆単位で表示しています（例：2.4兆 = 2.4兆円）。出来高は株数です。"},{q:"カスタムテーマはいくつまで作れますか？",a:"最大3テーマ、1テーマあたり最大10銘柄まで作成できます。Googleログインするとデバイス間でデータが同期されます。未ログイン時はブラウザのLocalStorageに保存されるため、ブラウザのデータを削除すると失われます。"},{q:"テーマヒートマップのゾーン分けはどういう意味ですか？",a:"🔥注目ゾーン（右上）：上昇+出来高急増=最強シグナル / ⚠️売り圧力（左上）：下落+出来高急増=強い売り / 📈静かな上昇（右下）：上昇+出来高少=じわり上昇 / ❄️静かな下落（左下）：弱含みだが動意なし"},{q:"騰落率はどのように計算していますか？",a:"テーマの騰落率はそのテーマに属する構成銘柄の騰落率の単純平均値です。個別銘柄は終値ベースで計算しています。"},{q:"スマホで表が見づらいのですが？",a:"銘柄表は横スクロール対応です。表を左右にスワイプしてください。PC版ではクリック&ドラッグでも横移動できます。スマホではグラフが自動的に縮小表示されます。"},{q:"データソースはどこですか？",a:"現在はyfinance（Yahoo Finance非公式API）を利用しています。将来的には商用APIへの移行を予定しています。データの正確性については保証できません。"}];function En({open:t}){return n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",style:{transition:"transform 0.2s",transform:t?"rotate(180deg)":"rotate(0deg)",flexShrink:0},children:n.jsx("path",{d:"M4 6l4 4 4-4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}function Pl(){const[t,e]=S.useState(null),[r,i]=S.useState(null);return n.jsxs("div",{style:{padding:"24px 28px 60px",maxWidth:"900px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"22px",fontWeight:700,color:"var(--text)",marginBottom:"6px"},children:"📖 使い方・Q&A"}),n.jsx("p",{style:{fontSize:"13px",color:"var(--text3)",marginBottom:"28px"},children:"StockWaveJPの各機能の使い方と、よくある質問をまとめています。"}),n.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"var(--text)",marginBottom:"14px",borderBottom:"1px solid var(--border)",paddingBottom:"6px"},children:"🗺️ 機能ガイド"}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"32px"},children:Il.map((s,o)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden"},children:[n.jsxs("button",{onClick:()=>i(r===o?null:o),style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",padding:"12px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font)",color:"var(--text)"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[n.jsx("span",{style:{fontSize:"18px"},children:s.icon}),n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"13px",fontWeight:700,color:"var(--text)"},children:s.title}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"2px"},children:s.desc})]})]}),n.jsx(En,{open:r===o})]}),r===o&&n.jsx("div",{style:{padding:"0 16px 14px",borderTop:"1px solid var(--border)"},children:n.jsx("ul",{style:{margin:"10px 0 0",paddingLeft:"20px",display:"flex",flexDirection:"column",gap:"5px"},children:s.items.map((a,l)=>n.jsx("li",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:1.7},children:a},l))})})]},o))}),n.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"var(--text)",marginBottom:"14px",borderBottom:"1px solid var(--border)",paddingBottom:"6px"},children:"❓ よくある質問"}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"32px"},children:El.map((s,o)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden"},children:[n.jsxs("button",{onClick:()=>e(t===o?null:o),style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",padding:"12px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font)",color:"var(--text)"},children:[n.jsxs("span",{style:{fontSize:"13px",fontWeight:600},children:["Q. ",s.q]}),n.jsx(En,{open:t===o})]}),t===o&&n.jsx("div",{style:{padding:"0 16px 14px",fontSize:"12px",color:"var(--text2)",lineHeight:1.8,borderTop:"1px solid var(--border)"},children:n.jsxs("div",{style:{paddingTop:"10px"},children:["A. ",s.a]})})]},o))}),n.jsxs("div",{style:{padding:"14px 18px",background:"rgba(255,193,7,0.05)",border:"1px solid rgba(255,193,7,0.2)",borderRadius:"8px",fontSize:"12px",color:"var(--text3)",lineHeight:1.8},children:["⚠️ ",n.jsx("strong",{style:{color:"var(--text2)"},children:"免責事項："}),"当サイトに掲載されている情報は参考目的のみであり、特定の銘柄の売買を推奨するものではありません。 投資の最終判断はご自身の責任でお願いします。データの正確性・最新性について保証するものではありません。"]})]})}function Tl({viewMode:t,onViewModeChange:e,colorTheme:r,onColorThemeChange:i}){const s=({children:l,style:c={}})=>n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px 24px",marginBottom:"16px",...c},children:l}),o=({children:l})=>n.jsx("div",{style:{fontSize:"11px",fontWeight:600,letterSpacing:"0.1em",color:"var(--text)",textTransform:"uppercase",marginBottom:"14px"},children:l}),a=[{key:"dark",label:"🌑 ブラック",desc:"ダークモード（デフォルト）"},{key:"light",label:"☀️ ホワイト",desc:"ライトモード"}];return n.jsxs("div",{style:{padding:"28px 32px 48px"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",color:"var(--text)",marginBottom:"4px"},children:"設定"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text2)",marginBottom:"28px"},children:"表示モードやデザインの設定を変更できます"}),n.jsxs(s,{children:[n.jsx(o,{children:"カラーテーマ"}),n.jsx("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:a.map(({key:l,label:c,desc:d})=>n.jsxs("button",{onClick:()=>i(l),style:{padding:"12px 20px",borderRadius:"8px",cursor:"pointer",border:`2px solid ${r===l?"var(--accent)":"var(--border)"}`,background:r===l?"rgba(74,158,255,0.1)":"var(--bg3)",fontFamily:"var(--font)",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"4px",minWidth:"140px"},children:[n.jsx("span",{style:{fontSize:"14px",color:"var(--text)",fontWeight:600},children:c}),n.jsx("span",{style:{fontSize:"11px",color:"var(--text2)"},children:d}),r===l&&n.jsx("span",{style:{fontSize:"10px",color:"var(--accent)",fontWeight:600,marginTop:"4px"},children:"✓ 適用中"})]},l))}),n.jsx("p",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"12px"},children:"※ テーマはリロードなしで即時反映されます"})]}),n.jsxs(s,{children:[n.jsx(o,{children:"表示モード"}),n.jsx("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[{key:"auto",label:"🔄 自動"},{key:"pc",label:"🖥 PC"},{key:"mobile",label:"📱 スマホ"}].map(({key:l,label:c})=>n.jsx("button",{onClick:()=>e(l),style:{padding:"8px 20px",borderRadius:"6px",fontSize:"13px",cursor:"pointer",border:`1px solid ${t===l?"var(--accent)":"var(--border)"}`,background:t===l?"rgba(74,158,255,0.12)":"transparent",color:t===l?"var(--accent)":"var(--text2)",fontFamily:"var(--font)",fontWeight:t===l?600:400,transition:"all 0.15s"},children:c},l))}),n.jsx("p",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"10px"},children:"「自動」はブラウザの画面幅を検知してPC/スマホを自動判定します"})]})]})}const Cl=[{title:"情報の目的と責任",body:"本ツール（StockWaveJP）は、株式市場の動向分析のための参考情報の提供を目的としており、投資勧誘や特定の銘柄の推奨、投資助言を行うものではありません。投資に関する最終決定は、お客様ご自身の判断と責任において行われるようお願いいたします。"},{title:"データの独自集計について",body:"当サイトで表示される各数値（「国内主要225銘柄」「大型株70社」等の平均騰落率および集計データ）は、対象となる個別銘柄の終値を元に、当サイトが独自に集計・算出したものです。日本経済新聞社が公表する「日経平均株価」や、株式会社JPX総研が公表する「TOPIX」等の公式な指数値ではありません。"},{title:"データの正確性とソース",body:"当サイトの情報は信頼できると考えられるデータプロバイダーより取得しておりますが、データの正確性、完全性、最新性を保証するものではありません。提供データには市場に応じた遅延（15分〜20分程度、または日次更新）が含まれます。実際の投資に際しては、必ず証券会社等の公式データをご確認ください。"},{title:"損害への責任",body:"本ツールの利用により生じたいかなる損害（直接・間接を問わず）についても、運営者は一切の責任を負いません。本サービスは「現状のまま」提供されており、保守、中断、不具合等による損害についても同様とします。"},{title:"著作権について",body:"本ツールのコード・デザイン・データ構成は著作権により保護されています。無断転載・複製・商用利用を禁止します。"}];function Rl(){return n.jsxs("div",{style:{padding:"28px 32px 48px"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",color:"var(--text)",marginBottom:"4px"},children:"免責事項"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"28px"},children:"StockWaveJP 免責事項"}),Cl.map((t,e)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px 24px",marginBottom:"12px",animation:`fadeUp 0.3s ease ${e*.06}s both`},children:[n.jsx("div",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)",marginBottom:"10px",borderLeft:"3px solid var(--accent)",paddingLeft:"10px"},children:t.title}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:1.9},children:t.body})]},e)),n.jsx("div",{style:{fontSize:"12px",color:"var(--text3)",marginTop:"20px",textAlign:"center"},children:"© 2026 StockWaveJP. All rights reserved."})]})}const Mt=[{id:"theme-investing-basics",themes:["テーマ一覧"],keywords:["テーマ株","投資","入門","初心者"],category:"入門",icon:"📘",title:"テーマ株投資とは？個別株・インデックスとの違いをわかりやすく解説",date:"2026/03/20",summary:"「半導体関連株が急騰」「AI銘柄に資金集中」といったニュースを聞いたことがあるでしょう。テーマ株投資とは何か、メリット・リスクをゼロから解説します。",body:`
H2: テーマ株投資とは何か

テーマ株投資とは、「半導体」「AI・クラウド」「防衛・宇宙」「インバウンド消費」といった社会トレンドや技術革新・政策変更に関連する複数の銘柄を一つの「テーマ」として括り、そのテーマ全体の動向を分析・投資する手法です。個別企業の分析だけでは見えにくい「市場全体の資金の流れ」を把握することを目的としています。

例えば「半導体」テーマであれば、半導体製造装置メーカー・素材メーカー・設計会社・テスト装置メーカーなどを一つのグループとして見ることで、半導体産業全体の勢いを一目で把握できます。個別企業の1社が絶好調でも、業界全体が低迷していれば持続性に疑問が残ります。逆にテーマ全体が盛り上がっていれば、個別銘柄が多少出遅れていても追いつく可能性があります。

H2: 個別株投資との違い

個別株投資との最大の違いは「視点の広さ」です。個別株投資は1社の業績・財務状況・経営陣・競争環境を深く分析してから購入を判断します。非常に精度の高い投資判断ができる一方、分析に時間がかかり、また1社の問題（不祥事・業績悪化）で大きな損失を被るリスクがあります。

テーマ投資はその産業全体がどの方向に向かっているか・どこに資金が集まっているかを見ます。「今は半導体関連に資金が集中している」という大きなトレンドを捉えることで、その中の個別銘柄選択に活かすことができます。テーマ全体のリスク分散効果も期待できます。

H2: インデックス投資との違い

インデックス投資（日経平均・TOPIX・S&P500連動）は市場全体に投資するため、市場平均のリターンを得られます。テーマ投資は市場の中でも「特定の高成長分野」に絞って投資するため、市場平均を上回るリターンを狙えます。一方でその分野が市場平均を下回った時のリスクも高くなります。

H2: テーマ株のサイクルを理解する

テーマ株には特有のサイクルがあります。注目初期（材料出現）→加熱期（資金集中・急騰）→冷却期（材料出尽くし）→再評価期（業績確認）という流れです。このサイクルを理解することが重要です。

注目初期は政策発表・技術革新・世界的イベントなどがきっかけです。例えば「ChatGPT公開→AI・クラウドテーマ急騰」「防衛費増額決定→防衛テーマ急騰」などです。

加熱期は多くの投資家が注目し、業績が伴っていなくても「期待」で株価が上昇します。出来高・売買代金が急増するのが特徴です。

冷却期は「期待だけでは株価を支えられない」時期に入り、利益確定売りが増えます。テーマが終わったわけではなく、業績で株価を支えられるかが問われます。

再評価期は実際の業績・受注が出てきて、本当に強い企業と弱い企業の選別が進みます。

H2: テーマ投資のリスク

最大のリスクは「テーマの期待だけで株価が上昇し、業績が伴わずに暴落するケース」です。特に加熱期に飛び乗ると高値掴みになるリスクがあります。また、テーマが変化するスピードも早く、昨年の人気テーマが今年は不人気になることもあります。

複数テーマへの分散・損切りルールの設定・長期的な視点での保有が重要です。StockWaveJPでは騰落率・出来高・売買代金・モメンタムの4つの指標を組み合わせることで、テーマの旬と衰退を見極める参考にしていただけます。

H2: テーマ投資を始めるための具体的ステップ

テーマ投資を始めるにあたって、まず行うべきは「自分が関心を持てるテーマを1〜2つ選ぶ」ことです。関心がないテーマへの投資は継続的な情報収集が難しく、長続きしません。

次に、そのテーマに関連するニュースを意識的に読む習慣をつけましょう。日経電子版・ロイター・Bloomberg等の経済メディアで「半導体」「AI」「防衛」などのキーワードをフォローするだけで、テーマに関連する情報が自然と集まります。

そしてStockWaveJPのようなツールを使って、実際にテーマの騰落率・出来高がどう動いているかを週1回程度確認する習慣をつけることが、テーマ投資成功の第一歩です。最初から完璧な分析を目指す必要はありません。まず「見る習慣」を作ることが最も重要です。
    

H2: テーマ投資と情報収集の実践

テーマ投資で成功するためには、継続的な情報収集が欠かせません。まず日本経済新聞・ロイター・Bloombergなどの経済メディアで気になるテーマのキーワードをフォローする習慣をつけましょう。国会審議・閣議決定・規制変更などの政策ニュースは、テーマ投資にとって最も重要なシグナルになります。

決算発表シーズン（3月・6月・9月・12月の各末から4〜6週間後）は企業業績の実態が明らかになる時期です。テーマ内の複数銘柄が好決算を出す場合、そのテーマ全体への評価が高まる「決算相場」が発生します。逆に複数銘柄が業績下方修正を出す場合は、テーマ全体が売られる「決算ショック」に注意が必要です。

H2: テーマ投資の失敗パターンと回避策

よくある失敗パターンの第一は「加熱期の飛び乗り」です。テーマが急騰してニュースになった後に参入すると、高値掴みになるケースが多くあります。StockWaveJPのモメンタム指標で「加速」シグナルが出た後、まず一度様子を見てから「次の押し目」で参入するアプローチが有効です。

第二の失敗パターンは「損切りができない」ことです。テーマへの思い入れが強くなると、株価が下落しても「テーマの成長は長期的に続く」という根拠のない楽観で保有継続してしまいます。投資前に損切りラインを設定し（例：購入価格から10〜15%下落で撤退）、ルール通りに実行することが資産保全の基本です。

H2: StockWaveJPでの実践的な活用方法

StockWaveJPのテーマ一覧で全30テーマの騰落率・出来高・売買代金を一覧でき、テーマ間の相対的な強弱を把握できます。騰落率ランキングで上位にいながら出来高も増加しているテーマは、資金流入が本格化している可能性が高く、最も注目すべき状態です。

テーマヒートマップページでは、各テーマが期間別（1週間・1ヶ月・3ヶ月・6ヶ月・1年）にどのパフォーマンスを示しているかを色で直感的に把握できます。「短期が赤（上昇）・長期が緑（下落）」のパターンは底値圏からの反転シグナル、「短期が緑（下落）・長期が赤（上昇）」は高値圏での調整サインとして解釈できます。
    

H2: テーマ株投資が個人投資家に向いている理由

テーマ株投資が個人投資家に向いている理由は「情報の優位性が得やすいこと」にあります。機関投資家は数十〜数百銘柄の個別株を分析する必要がありますが、テーマ株投資では「どのテーマに資金が流れているか」というマクロの視点で判断できます。日常生活の中で「この分野に変化が起きている」と肌感覚で感じること（例：EVが増えた・AI搭載製品が身近になった・外国人観光客が増えた）が、テーマの変化を先読みする情報源になります。

H2: テーマ株の「旬」と投資タイミング

テーマ株には「旬（最も注目を集める時期）」があります。政策発表・業界の大型イベント（展示会・学会）・主要企業の決算などのカタリスト（触媒）が、テーマ全体への資金流入を引き起こします。例えば「防衛費拡大の予算案が閣議決定された翌週」「TSMCの熊本工場が開業した週」「訪日外国人統計が過去最高を更新した月」などが、各テーマの「旬」のタイミングです。

H2: テーマヒートマップの活用法：全体感を素早くつかむ

StockWaveJPのテーマヒートマップは全30テーマの騰落率を色（赤＝上昇・緑＝下落）で一覧表示します。テーマヒートマップを一瞥するだけで「今の相場はどのテーマが強く、どのテーマが弱いか」という全体感を数秒で把握できます。「すべてのテーマが赤（全面高）」の状態は市場全体のリスクオン、「すべてのテーマが緑（全面安）」はリスクオフの局面を示します。「一部のテーマだけが強い」状態は資金ローテーションが起きているシグナルです。

H2: 投資金額のルールと資金管理

テーマ株投資では「一つのテーマに総資産の何%まで集中するか」というルールを事前に決めることが重要です。一般的な目安として一テーマへの投資は総資産の20〜30%以内、一銘柄には10〜15%以内に抑えることで、単一テーマの失敗が壊滅的な損失につながらない資金管理が実現します。投資を始めて間もない段階では少額（総資産の10〜20%）から始め、テーマの動きと自分の判断の精度を把握しながら徐々に投資規模を拡大することを推奨します。

H2: StockWaveJP編集部の見解

テーマ株投資を始めたばかりの方が最初にぶつかる「失敗」は、「テーマが急騰しているのを見て慌てて飛びついたら高値づかみになった」というパターンです。モメンタムが「加速」の状態になっているときは「すでに多くの投資家が気づいて買っている状態」であり、その後のリターンは限定的になりやすいです。最も賢い参入タイミングは「転換↑（底打ちの初動）」と「加速の継続（2〜3週間以上加速が続く本物のトレンド）」の二つです。StockWaveJPのモメンタムを毎週確認することで、どのテーマがどの段階にあるかを継続的に把握し、焦らず適切なタイミングを待つ判断力が養われます。

H2: テーマ株投資の実践的なリスク管理

テーマ株投資には個別銘柄投資と異なる特有のリスクがあります。テーマのブームが終わると複数銘柄が一斉に下落する「テーマ崩壊リスク」は、個別銘柄の分散では防げません。対策として異なるセクター・景気感応度の違うテーマを複数組み合わせること、モメンタムが「失速」に転じたらポジション縮小を検討することが重要です。

また「テーマの人気が高まるほどバリュエーション（PER・PBR等）が割高になる」という傾向があります。テーマの注目度が最高潮に達したときは往々にして「売り時」であり、逆に誰も話題にしなくなったときが「仕込み時」になることが多いです。

H2: まとめ

テーマ株投資は日本株の魅力を最大限に活かす投資手法です。「どのテーマに資金が集まっているかをデータで把握し、そのテーマ内でモメンタムの強い銘柄を選ぶ」というシンプルなアプローチをStockWaveJPで実践することで、個別銘柄分析だけでは見えなかった市場の大きなトレンドを捉えることができます。
`},{id:"semiconductor-theme",themes:["半導体製造装置","半導体材料","AI半導体"],keywords:["半導体製造装置","東京エレクトロン","レーザーテック","アドバンテスト","AI"],category:"半導体製造装置",icon:"⚡",title:"半導体テーマ徹底解説：AI需要が牽引する構造的成長と主要銘柄の関係性",date:"2026/03/18",summary:"半導体は現代産業の「コメ」と呼ばれる基幹部品です。AI・EV・スマートフォンすべてに必要不可欠な半導体テーマの構造と、国内主要銘柄の役割を解説します。",body:`
H2: なぜ半導体テーマが注目されるのか

半導体は「産業のコメ」とも呼ばれ、現代のあらゆる電子機器・インフラに不可欠な存在です。スマートフォン・パソコンはもちろん、自動車・家電・医療機器・工場の制御装置、そしてAI学習用のデータセンターまで、半導体なしでは動きません。2022年以降、生成AI（ChatGPT等）の急速な普及により、AI処理に特化した高性能半導体の需要が爆発的に拡大し、半導体テーマへの世界的な関心が一段と高まっています。

H2: 半導体バリューチェーンと国内企業の位置づけ

半導体の製造には「設計→材料→製造装置→製造→検査→完成品」という長いバリューチェーン（価値連鎖）があります。日本企業は特に「製造装置」「材料・素材」「検査装置」の分野で世界トップクラスの競争力を持っています。

製造装置分野では、東京エレクトロン（8035）がエッチング装置・コーター/デベロッパーで世界首位に近いシェアを持ちます。アドバンテスト（6857）は半導体テスト装置で世界トップシェアを誇り、AIチップのテスト需要急増で恩恵を受けています。ディスコ（6146）はダイシング・研削装置で世界首位です。レーザーテック（6920）はEUVマスク欠陥検査装置でほぼ独占的なシェアを持ちます。

材料分野では、SUMCO（3436）がシリコンウェーハ（半導体の基板）で世界第2位のシェアを持ちます。

H2: AI需要が牽引する半導体市場の変化

生成AIの普及は半導体需要の質的変化をもたらしています。従来のPC・スマートフォン向けから、データセンター向けの高性能GPU・HBM（高帯域幅メモリ）・ASIC（特定用途向け半導体）の需要が急増しています。

特にNVIDIAのGPUはAI学習の「主役」として需要が爆発的に拡大し、その製造・検査に使われる東京エレクトロン・アドバンテスト・レーザーテックなどの日本企業にも恩恵が及んでいます。

H2: 半導体サプライチェーンの地政学

米中対立の激化により、半導体サプライチェーンの再編が世界規模で進んでいます。米国は中国への先端半導体・製造装置の輸出を規制し、日本も同調して規制を強化しています。一方、日本国内へのTSMC（台湾積体電路製造）の工場誘致（熊本）など、先端製造の日本回帰も進んでいます。

この地政学的変化は日本の半導体装置・材料企業に追い風となる面もありますが、中国向け売上の減少というリスクも抱えています。

H2: 投資する際の注意点

半導体産業は「シリコンサイクル」と呼ばれる景気循環が激しい産業です。好況期と不況期の入れ替わりが数年サイクルで起こり、需要減退期には半導体メーカーの設備投資が急減し、装置・材料メーカーの業績が大幅に悪化することがあります。

StockWaveJPの半導体テーマの出来高・売買代金・モメンタムを定期的に確認することで、投資タイミングの参考にしていただけます。長期的な成長トレンドは明確ですが、短期的な需給変動には注意が必要です。

H2: 半導体テーマへの投資タイミングの考え方

半導体テーマへの投資タイミングを計る上で重要なのは「シリコンサイクル」の位置把握です。在庫調整局面（過去1〜2年間に生産過剰で在庫が積み上がった後）は株価が底値圏にあることが多く、在庫正常化→需要回復が見えてきたタイミングが買いのチャンスとなることが多いです。

またNVIDIAなどの米国半導体株の動向は、日本の半導体関連株の先行指標になることが多いです。米国の決算発表・ガイダンス（業績見通し）を確認した上で、日本の半導体装置・材料株の動向をStockWaveJPで追うことが効果的です。

出来高・売買代金の増加は機関投資家の関与が増えているサインです。特に決算シーズン（1月・4月・7月・10月）前後に半導体テーマのモメンタム変化に注目してください。
    

H2: 国内半導体産業の再興：RapidusとTSMC熊本工場

2023〜2026年にかけて、日本の半導体産業を巡る環境が大きく変化しました。最大のトピックはTSMC（台湾積体電路製造）の熊本工場建設と、次世代半導体の国産化を目指すRapidusプロジェクトです。

TSMC熊本第1工場は2024年に稼働開始し、第2工場も建設が進んでいます。日本に最先端の半導体工場が誘致されたことで、周辺の製造装置・材料・インフラ企業への恩恵が広がっています。地元九州では関連産業の集積（シリコンアイランド化）が進み、地域経済への影響も大きくなっています。

Rapidusは2030年代に2ナノメートル以下の最先端半導体の国産製造を目指す官民プロジェクトです。政府から1兆円規模の支援が予定されており、北海道千歳市に工場建設が進んでいます。実現には技術・資金・人材の面で課題が多いですが、成功すれば日本の半導体産業に革命的な変化をもたらします。

H2: 米中技術覇権争いと日本への影響

米国による対中半導体輸出規制（EAR規制）の強化は、日本の半導体装置・材料メーカーにも影響を及ぼしています。日本も米国の同盟国として一定の輸出管理を実施しており、中国向けの高度な装置・材料の輸出が制限されるケースが生じています。

一方で米中対立は日本に「代替供給地」としての役割をもたらします。米国・欧州が中国依存を減らす中、日本の半導体産業への依存度は相対的に高まっており、日米半導体同盟を通じた技術協力も活発になっています。

H2: 投資タイミングと実践的アプローチ

半導体テーマへの投資タイミングとして有効なのは、装置メーカーの受注動向の確認です。東京エレクトロン・アドバンテストなどの決算での受注残・受注見通しが改善している局面は、半導体テーマ全体への資金流入サインとなります。

StockWaveJPのテーマ別詳細で「半導体」テーマを選択し、出来高順位上位の銘柄を確認することで、現在どの銘柄に資金が集中しているかを把握できます。テーマ全体が上昇する中で出来高が特に急増している銘柄は、機関投資家の本格参入を示唆していることが多く、個別銘柄の選定に活用できます。
    

H2: AI半導体の覇権と日本の位置づけ

エヌビディアのH100・H200・B200という最先端GPUは「AIを動かすエンジン」として世界的な争奪戦が起きています。ChatGPT・Gemini・Claudeなどの大規模言語モデルの学習・推論に必要なGPUを確保するためにMicrosoft・Google・Amazon・Metaが巨額の設備投資を続けており、AI半導体市場の成長は「構造的」かつ「長期的」なトレンドです。日本企業はこのGPU本体では恩恵を受けにくいですが、GPUを製造するTSMC・Samsungへの材料・製造装置の供給という「半導体サプライチェーンの上流」で重要な役割を果たしています。

H2: 半導体サプライチェーンにおける日本の強み

日本の半導体関連企業の強みは「材料・製造装置・検査装置」という領域です。信越化学（4063）のシリコンウェーハ・フォトレジスト、東京エレクトロン（8035）の成膜装置・エッチング装置・洗浄装置、アドバンテスト（6857）の半導体テスター（検査装置）、ディスコ（6146）のダイシング（切断）装置・研削装置、レーザーテック（6920）のマスク欠陥検査装置など、各社が世界市場でトップシェアを持つニッチ分野を担っています。

H2: Rapidus（ラピダス）：日本の2nm半導体製造への挑戦

トヨタ・ソニー・NTT・NEC・キオクシア・ソフトバンク・デンソー・三菱UFJが出資して2022年に設立されたラピダスは、北海道千歳に2nm（ナノメートル）世代の最先端半導体工場を2027年試作・2030年量産を目標に建設しています。日本が半導体製造から長年遠ざかっていた後、政府主導で「半導体産業の国内復活」を目指す国家プロジェクトです。ラピダスの成否は日本の半導体産業の将来を大きく左右するため、投資家・政府・産業界から極めて大きな注目を集めています。

H2: 半導体市場のサイクル性と投資への影響

半導体産業は「シリコンサイクル（好況・在庫調整・不況を繰り返す約4〜5年周期）」が知られており、投資タイミングの判断に重要です。2020〜2022年は在宅需要急増によるPC・スマホ向け半導体の爆発的需要（好況）、2023年は在庫調整による市況低迷（不況）、2024年以降はAI向け需要急増による次のサイクル上昇という流れで推移しています。AI向けGPU・HBMは在庫調整の影響を受けにくい「特需」であるため、従来のシリコンサイクルとは異なる需要構造が生まれています。

H2: StockWaveJP編集部の見解

半導体テーマは「テーマ一覧の騰落率・出来高ランキングで最も頻繁に上位を占めるテーマ」として当編集部では最重要モニタリング対象に位置づけています。エヌビディア決算・TSMC月次売上・半導体メーカーの受注動向など、月に複数回の重要イベントがある中で、StockWaveJPの週次データで「出来高がどう変化したか」を確認することがこのテーマへの投資管理の基本です。半導体テーマが「加速」状態にある期間は他のテーマへの相対的な資金配分を減らし、半導体に集中する戦略が過去のデータでも有効だったことを確認しています。また「半導体が失速・転換↓に転じたとき、他のテーマ（銀行・防衛・インバウンド等）に資金がローテーションする」というパターンも観察しており、半導体のモメンタム変化が相場全体のローテーション確認の先行指標となっています。

H2: 日本の半導体産業復興の取り組み

かつて世界首位だった日本の半導体産業は1990年代以降に大きく後退しましたが、TSMC熊本工場誘致（2024年開業）・ラピダス（北海道千歳での2ナノ以下次世代半導体製造）という2つの大型プロジェクトにより「半導体産業の国内回帰」が進んでいます。政府は半導体産業への大型補助金（ラピダスに対して9,200億円以上）を投じており、2030年代に向けた日本の半導体自給率向上を国家戦略として推進しています。

H2: まとめ

半導体テーマはAI時代の「最重要インフラ産業」として今後10年以上にわたって構造的な成長が続く長期テーマです。エヌビディア決算・TSMC月次売上・半導体受注統計をStockWaveJPのモメンタムデータと照合する週次ルーティンを確立することで、半導体サイクルの動向を先読みした投資判断が可能になります。
`},{id:"ai-cloud-theme",themes:["生成AI","AIデータセンター","エッジAI"],keywords:["AI","クラウド","生成AI","ChatGPT","データセンター"],category:"生成AI",icon:"🤖",title:"AI・クラウドテーマ：生成AI時代に変わる日本企業の競争環境と投資機会",date:"2026/03/16",summary:"ChatGPTの登場以来、AI関連への投資資金流入が世界規模で続いています。国内AI・クラウドテーマの特徴と、インフラ・ソフトウェア・サービス各層の主要企業を解説します。",body:`
H2: AI・クラウドテーマの全体像

AI（人工知能）とクラウドコンピューティングは、現代のデジタル経済を支える二大インフラです。2022年11月のChatGPT公開以降、生成AIは急速に普及し、企業・政府・個人の働き方・ビジネスモデルを根底から変えつつあります。日本においても、政府のAI戦略・企業のDX（デジタルトランスフォーメーション）推進・クラウド移行加速を背景に、関連企業への投資機会が拡大しています。

H2: 日本のAI・クラウド市場の特徴

日本のAI・クラウド市場には独自の特徴があります。第一に、クラウド化の遅れからくる「追いつき需要」が大きいです。日本企業の多くはオンプレミス（自社サーバー）からクラウドへの移行途中にあり、移行需要は今後も継続します。

第二に、生成AIの業務活用が本格化しています。ChatGPTのような汎用AIだけでなく、企業が自社データを活用した「プライベートAI」の構築ニーズが急増しており、SIer（システムインテグレーター）やクラウドサービス企業に恩恵をもたらしています。

第三に、政府のDX推進・マイナンバー活用・行政デジタル化が民間企業の投資を加速させています。

H2: テーマ内の主要企業と役割

富士通（6702）とNEC（6701）は、企業・政府向けのAIシステム構築・クラウド移行支援を主力事業とする国内最大手ITサービス企業です。大型の政府系プロジェクトを多数抱えており、安定した受注基盤があります。

さくらインターネット（3778）は、国産クラウドインフラの代表格です。政府がAI向けクラウド基盤として採用したことで注目が急上昇しました。データの国内保管・安全保障の観点からの国産クラウド需要の高まりを享受しています。

日立製作所（6501）はLumadaと呼ばれるDXプラットフォームを軸に、製造業・インフラ・金融向けのAI・クラウドソリューションを展開しています。国内外での大型プロジェクト受注が続いています。

野村総合研究所（4307）・オービック（4684）・SCSK（9719）は、企業向けのクラウドシステム開発・運用を担います。特にSAP・Oracle等の基幹系ERPのクラウド移行需要が拡大しています。

H2: AI活用の「波」の広がり

第1波（2022〜2023年）：ChatGPTブームによるAI認知拡大・試験導入フェーズ。コスト削減よりも「AIを使っている」というイメージ先行。

第2波（2024〜2025年）：企業の業務自動化・効率化での本格活用。コールセンター・文書作成・コード生成等でのROI（投資対効果）が明確化。

第3波（2026年以降）：AI×物理世界（フィジカルAI）の融合。製造業・物流・医療での実装が本格化。日本企業が強みを持つ精密機械・センサー分野との相乗効果が期待される。

H2: 投資リスクと注意点

AI・クラウドテーマは期待が先行しやすく、業績が追いついていない銘柄も多いです。PER（株価収益率）が高く、金利上昇局面では株価が下落しやすい特徴があります。また、米国の大手クラウド企業（Amazon・Google・Microsoft）との競争も激しく、純粋な国内SI需要と差別化することが重要です。StockWaveJPのAI・クラウドテーマのモメンタムで加速・失速のタイミングを確認しながら投資判断の参考にしてください。

H2: AI・クラウドテーマで注目すべき決算指標

AI・クラウド関連企業への投資では、以下の指標に注目することをお勧めします。

クラウドサービスの年間契約残高（ARR：Annual Recurring Revenue）は、将来の売上の安定性を示す重要指標です。ARRが高成長を続けている企業は評価されやすいです。

AI関連受注・パイプライン（受注見込み）の増加は、AI需要が実際のビジネスに転換されているかを示します。決算説明会での経営陣のコメントに注目しましょう。

データセンター投資の動向（Google・Amazon・Microsoft・Metaの設備投資額）は、日本のAI・クラウド関連企業の需要の先行指標になります。これらの米国大手が投資を増やすほど、日本企業の受注機会も増えます。
    

H2: 生成AI普及による日本企業のビジネスチャンス

生成AI（ChatGPT・Claude・Gemini等）の急速な普及は、日本の企業・産業に大きなビジネスチャンスをもたらしています。特に生産性向上への活用（コード生成・文書作成・翻訳・カスタマーサポート自動化）は多くの業種で実装が進んでいます。

日本語に特化したAIサービスでは、NTT・富士通・サイバーエージェント・LINEヤフーなどが独自のLLM（大規模言語モデル）開発や国内企業向けAIサービスを展開しています。海外の汎用モデルでは対応が難しい日本語の微妙なニュアンス・企業固有のデータ・法規制対応などの観点から、国産AIへのニーズが確実に存在します。

H2: クラウド市場の成長とGCP・AWS・Azureの影響

日本のクラウド市場はAWS（Amazon Web Services）・Microsoft Azure・Google Cloud Platform（GCP）の3強が市場を席巻しています。日本の企業ITのクラウド移行率はまだ欧米に比べて低く、移行余地が大きいことは今後のクラウド需要拡大を示唆しています。

国内SIer（システムインテグレーター）はこのクラウド移行の「橋渡し役」として重要な位置を占めています。富士通・NTTデータ・伊藤忠テクノソリューションズ・TDSYなどは、企業のクラウド移行支援・AI導入コンサルティングで収益を拡大しています。

H2: データセンターインフラへの投資拡大

AI・クラウドの成長を支えるデータセンターへの投資が日本でも急増しています。電力大量消費・冷却設備・高速ネットワーク接続を要するデータセンターは、立地・電力インフラ・建設能力の観点から日本国内で新たな産業集積を形成しつつあります。

さくらインターネット（3778）は政府の「重要インフラ」クラウドプロバイダーに認定され、GPUクラスタへの大規模投資を実施。IDCフロンティア・日本IBMなども国内データセンター増強を進めています。また、データセンター向けの建設需要（電気設備・空調・セキュリティ）も多業種に波及しています。

H2: 投資タイミングと注意点

AI・クラウドテーマへの投資で注意すべきは「期待先行の過熱」です。生成AIブームが本格化した2023〜2024年は、直接的なAI関連でない周辺企業まで「AI関連」として買われる局面がありました。実際に収益貢献が確認できる段階での投資が、リスクを抑えた実践的アプローチです。

StockWaveJPのテーマヒートマップでAI・クラウドテーマの期間別騰落率を確認することで、現在のテーマがどのフェーズにあるかを把握できます。短期で過熱しているように見えても、中長期のトレンドが継続している場合は押し目買いの機会となることもあります。
    

H2: 生成AIの日本企業への影響

ChatGPT登場以降、生成AIの企業活用が急速に進んでいます。富士通（6702）・NEC（6701）・NTTデータ（9613）・日立製作所（6501）などの国内IT大手はいずれも「AIサービス」「AI基盤の構築支援」を主力事業の一つに位置づけています。特に大企業向けの「AI導入コンサルティング・システム構築・運用支援（マネージドサービス）」という「AIのSI事業」が急成長しており、既存のSI（システムインテグレーター）ビジネスのAI化が国内ITテーマの大きな収益源になっています。

H2: エヌビディア・TSMCと日本企業のポジション

AI半導体（GPU）でほぼ独占的な地位を持つエヌビディア（NVDA）の好業績は、サプライチェーンを通じて日本企業にも恩恵をもたらします。エヌビディアのGPUを製造するTSMC（台湾）の熊本工場（TSMC Japan）は地域経済・関連サプライヤーに大きな影響を与えています。AI向けHBM（高帯域メモリ）製造に不可欠な半導体材料・製造装置・検査装置で日本企業（信越化学・東京エレクトロン・アドバンテスト等）が重要なポジションを占めています。

H2: クラウドシフトの加速とデータセンター需要

企業ITの「クラウドファースト」への移行が継続しています。AWS（アマゾン）・Azure（マイクロソフト）・GCP（グーグル）の三大クラウドへの日本企業のシステム移行が本格化しており、クラウド移行を支援するSI・コンサルティング・マネージドサービス企業の需要が拡大しています。さくらインターネット（3778）は日本のクラウドサービスの国産化需要（政府・金融機関の「外資クラウド依存リスクへの懸念」）を取り込み急成長しています。

H2: AIスタートアップと大企業の連携

日本でも生成AI特化型スタートアップが台頭しています。ELYZA（東大発のAIスタートアップ・KDDI出資）・AIメタバース企業・AI医療診断スタートアップなど多様な分野で新興企業が生まれており、大企業との協業・出資・買収が活発です。また、NTT・ソフトバンク・富士通などが独自の大規模言語モデル（LLM）開発に取り組んでおり、「日本語に特化したAI」の開発が進んでいます。

H2: StockWaveJP編集部の見解

AI・クラウドテーマはエヌビディアの四半期決算（年4回）に対して最も強い連動性を示すテーマです。エヌビディアが市場予想を大幅に上回る好決算を発表すると、翌日〜翌週にかけてAI・クラウドテーマの出来高が急増し、さくらインターネット・NEC・富士通などの主要銘柄が同時に上昇するパターンが繰り返されています。エヌビディアの決算スケジュール（2月・5月・8月・11月が多い）を把握した上でStockWaveJPでのモニタリングを習慣化することが、このテーマへの投資タイミング管理に最も有効なアプローチです。国内AI関連株は米国AI株よりも出遅れて反応することが多いため、「エヌビディア好決算の翌週に国内AI銘柄の出来高増加を確認してから参入する」という段階的なアプローチが実践的です。

H2: 日本企業のAI活用と「AI経営」

日本企業のAI活用は製造業（品質検査・需要予測）・金融（与信審査・不正検知）・ヘルスケア（画像診断）・サービス業（チャットボット・予測保全）など幅広い分野で進んでいます。富士通・NEC・日立製作所などの大手ITベンダーは、生成AI活用のソリューションを法人顧客に提供するビジネスを急拡大しています。「AI経営」という概念が普及し、業務プロセスへのAI組み込みが競争力に直結する時代となりました。

H2: まとめ

AI・クラウドテーマは生成AI革命という「10年に一度レベルのパラダイムシフト」の真っ只中にある長期成長テーマです。エヌビディア決算・国内大手IT企業の受注動向・政府のAI政策という三つの動向をStockWaveJPのモメンタムデータと組み合わせて定期確認することで、このテーマへの投資タイミングを精度高く管理することができます。
`},{id:"defense-theme",themes:["防衛・航空","宇宙・衛星"],keywords:["防衛","宇宙","防衛費","地政学"],category:"防衛・航空",icon:"🛡️",title:"防衛・宇宙テーマ：地政学リスクと防衛費拡大が生む構造的な追い風",date:"2026/03/14",summary:"日本の防衛費はGDP比2%への増額方針が決定し、2027年度に向けて大幅な拡大が続きます。防衛・宇宙テーマの構造と主要企業の関係を解説します。",body:`
H2: 防衛テーマが注目される背景

2022年2月のロシアによるウクライナ侵攻は、欧州・アジアの安全保障環境を一変させました。「平和が当たり前ではない」という現実が突きつけられ、日本を含む多くの国が防衛費増額に舵を切りました。日本は2022年12月に「防衛三文書」を閣議決定し、2027年度までに防衛費をGDP比2%（約10兆円規模）に増額する方針を打ち出しました。これは戦後日本の安全保障政策の歴史的大転換であり、防衛産業にとって数十年に一度の構造変化です。

H2: 防衛産業のバリューチェーン

防衛関連企業は大きく3つの層に分けられます。

システムインテグレーター層は、防衛装備品の主要契約企業です。三菱重工業（7011）は戦闘機・護衛艦・ミサイル・ロケットを手掛ける国内最大の防衛企業です。次期戦闘機（GCAP）プロジェクトの主契約企業として長期受注が見込まれます。川崎重工業（7012）は潜水艦・哨戒機・陸上戦闘車両を担当します。IHI（7013）は航空エンジン・ロケットエンジンを主力とします。

電子・情報通信層は、NEC（6701）が防衛通信システム・レーダー・指揮統制システムを担当します。富士通（6702）は指揮・通信・管制（C4I）システムを担います。東芝（6502）はレーダーシステム・電子戦システムを開発します。

宇宙・衛星層は、三菱電機（6503）が人工衛星・衛星搭載電子機器の主要メーカーです。

H2: 注目ポイント：装備品の国産化推進

従来、日本は多くの防衛装備品を米国からライセンス生産または輸入していました。しかし近年は「国産化・自前開発」の流れが加速しています。次期戦闘機の日英伊共同開発・国産スタンドオフミサイルの開発・国産早期警戒衛星の整備など、日本企業が主体的に開発する案件が増加しています。

この国産化推進は日本の防衛企業にとって大きな追い風です。従来のライセンス生産より利益率が高い国産装備品の割合が増えることで、売上・利益率の改善が期待されます。

H2: 最近のトピックス（2026年時点）

2025年には次期戦闘機（GCAP）の設計詳細が固まり始め、三菱重工業・IHI・三菱電機への発注額が具体化しつつあります。また2024年に防衛産業強化法が施行され、防衛装備品製造企業への支援制度が整備されました。事業継続・設備投資・輸出促進が国として後押しされる形になっています。

防衛装備品の輸出解禁も重要なトピックです。従来は国産装備品の輸出に厳しい制限がありましたが、2024年の制度改正でライセンス生産品の第三国への輸出が可能になりました。これは日本の防衛企業の海外市場開拓の可能性を大きく広げます。

H2: 投資リスク

防衛テーマへの投資には固有のリスクがあります。政治リスクとして、政権交代・外交関係の変化で防衛政策が変わるリスクがあります。需給リスクとして、受注は計上されても実際の売上計上まで数年かかる場合があります。倫理的懸念として、ESG投資の観点から防衛株を避ける機関投資家もいます。これらを踏まえた上で、StockWaveJPの防衛・宇宙テーマのデータを参考にしてください。

H2: 防衛テーマへの投資で押さえるべきポイント

防衛テーマへの投資では「受注→売上計上のタイムラグ」を理解することが重要です。防衛装備品は開発・製造に数年を要するため、今の受注が売上・利益に反映されるまで2〜5年かかることが珍しくありません。株価は「期待」で先行するため、受注発表時に株価が急騰した後、実際の業績反映まで長い時間がかかることがあります。

また防衛企業の多くは民需（民間向け事業）も持っており、民需の業績が足を引っ張る場合があります。防衛部門の売上・利益比率と民需部門の動向を別々に確認することが重要です。

政府の防衛予算の執行状況は国会の予算委員会・防衛省の発表を通じて確認できます。予算は決定しても実際の執行（発注）には時間がかかる場合があり、発注のタイミングが株価材料となります。
    

H2: 日本の防衛費増額と防衛テーマの背景

2022年のロシアによるウクライナ侵攻と北朝鮮・中国の軍事活動活発化を受け、日本政府は防衛費を2027年までにGDP比2%に引き上げることを決定しました。2022年比で約2倍以上の防衛費拡大（年間約11兆円規模）は、戦後最大規模の防衛力強化であり、防衛関連企業への需要増加に直結します。

防衛テーマを構成する日本企業は、三菱重工業（7011）・川崎重工業（7012）・IHI（7013）・富士通（6702）・NEC（6701）・ミツビシ電機（6503）など、日本の主要重工・電機大手が中心です。これらの企業は防衛省からの受注を通じて、艦艇・航空機・ミサイル・電子戦システム・通信システムなどを納入しています。

H2: 具体的な防衛装備品と国産化推進

日本の防衛力強化の柱の一つが「スタンド・オフ防衛能力」の強化です。敵の射程外から攻撃できる長射程ミサイルの国産開発が進んでおり、三菱重工業が主導する12式地対艦誘導弾の射程延伸・改良が進んでいます。

また宇宙・サイバー・電磁波領域への防衛力強化も重点分野です。偵察衛星・通信衛星・GPS代替システムの整備や、サイバー防衛隊の拡充・自衛隊のデジタル化なども防衛関連企業にとってのビジネス機会となっています。

H2: 防衛テーマの銘柄と投資ポイント

三菱重工業（7011）は防衛省向けの売上が全体の約20%を占め、防衛費増額の最大の恩恵を受ける企業として注目されています。また航空・宇宙・エネルギー事業も手掛けており、防衛需要の増加と脱炭素関連事業の成長が重なるポジションにあります。

川崎重工業（7012）は航空自衛隊向けの戦闘機・輸送機・哨戒機の整備・製造で存在感があります。IHI（7013）は航空機エンジンの製造・整備で重要な役割を担っており、次世代戦闘機（F-X）プロジェクトへの参加も期待されます。

H2: 上昇・下落因子と長期展望

上昇因子としては、防衛省の補正予算・概算要求での装備品調達拡大、日米共同開発（次世代戦闘機GCAP等）の進展、地政学リスクの高まりによる防衛意識の向上が挙げられます。また防衛装備の輸出解禁（防衛装備移転三原則の緩和）も中長期的な成長余地を広げます。

下落因子としては、国際情勢の緊張緩和（地政学リスク低下）や財政悪化による防衛予算の見直し、防衛調達のコスト超過・遅延問題が挙げられます。また、防衛関連株の場合は業績の安定性が高い半面、実際の業績への寄与が遅延することも特徴です（受注から納入・売上計上まで数年かかる場合が多い）。

StockWaveJPで防衛・宇宙テーマを確認すると、地政学的事件（軍事演習・緊張激化等）のニュースが出るたびに出来高が急増する傾向があります。こうした短期的な材料と、防衛費増額という中長期のトレンドを組み合わせて投資判断に活用することが重要です。
    

H2: 次期戦闘機FX（F-X）プログラム

日本・英国・イタリアが共同開発する「グローバル戦闘航空プログラム（GCAP: Global Combat Air Programme）」は、2035年の初飛行・2040年代の運用開始を目標とする次世代戦闘機プロジェクトです。日本側では三菱重工業（7011）が主契約会社として機体設計・製造を担当し、IHI（7013）はエンジン（XF9-1）を担当します。三菱電機（6503）・東芝・富士通がアビオニクス（電子機器）を担当します。GCAPは日本の防衛装備産業にとって半世紀ぶりの国産戦闘機開発という歴史的プロジェクトです。

H2: スタンドオフミサイルと長距離打撃能力

従来の「専守防衛」という自衛隊の方針が「反撃能力（敵基地攻撃能力）」の保有へと大きく転換しました。これに伴いスタンドオフミサイル（射程数百〜1,000km以上の長距離精密誘導ミサイル）の開発・取得が防衛費増額の中で最重要項目の一つとなっています。三菱重工業は12式地対艦誘導弾の能力向上型（射程を現在の200kmから1,000km超に延伸）を開発中で、将来的に日本が保有する最長射程の防衛装備となります。

H2: 防衛サイバーとEW（電子戦）

現代の戦争では「情報・電子・サイバー」という見えない戦場の重要性が急増しています。電子戦（EW: Electronic Warfare）は敵のレーダー・通信・誘導装置を電波で妨害する作戦で、自衛隊も専用装備（電子戦機・電子戦ポッド）の整備を進めています。サイバー攻撃への対応では「能動的サイバー防衛（積極的防御）」のための専門組織・人材育成・システム整備が急ピッチで進んでおり、セキュリティ関連企業にも官需が拡大しています。

H2: 海上防衛と護衛艦建造計画

海洋国家である日本にとって海上防衛は最重要課題の一つです。海上自衛隊は「いずも型護衛艦の空母化（F-35B搭載改修）」・新型護衛艦（FFM：もがみ型）の量産・イージスシステム搭載艦（イージス・アショア代替）の建造計画を推進しています。川崎重工業・三菱重工業・ジャパンマリンユナイテッドが海上自衛隊向け艦艇の主要建造企業です。

H2: StockWaveJP編集部の見解

防衛テーマは他のテーマと異なり「地政学的リスクが高まると上昇する」という独特の特性を持ちます。北朝鮮のミサイル発射・中台関係の緊張・南シナ海での事案発生などのニュースが出た翌営業日に、防衛テーマの出来高が急増するパターンが繰り返されています。これを「不謹慎」と感じる方もいますが、防衛産業への投資は「平和を守るための抑止力への投資」という側面があることも事実です。当編集部が観察しているのは、こうした地政学ニュースによる「短期の急騰後に一定の調整が入り、その後に防衛費増額の具体化に伴って再び上昇する」という二段上げパターンです。短期の地政学急騰には慎重に対応しつつ、防衛費倍増という「確実なファンダメンタルの裏付け」を重視した中長期投資が有効と考えています。

H2: 防衛産業の技術革新：次世代防衛装備

日本の防衛産業は従来の「純粋な国内需要向け」から「技術革新による輸出産業化」へと転換しつつあります。防衛装備移転三原則の改正（2023年）により、日本製の防衛装備品の海外輸出が一部解禁されました。ライセンス生産品（F-15のミサイル部品等）の完成品輸出・次世代戦闘機「GCAP（グローバル戦闘航空プログラム）」の日英伊共同開発など、日本の防衛産業が国際舞台に出る機会が増えています。

H2: まとめ

防衛テーマは「地政学リスクの高まり」「防衛費倍増計画（2027年度GDP比2%目標）」「防衛装備輸出の解禁」という三つの明確な政策的追い風を持つ長期投資テーマです。北朝鮮のミサイル発射・台湾海峡の緊張・ロシアの軍事動向など地政学的イベントに敏感に反応するテーマでもあり、StockWaveJPで防衛テーマのモメンタム変化と地政学ニュースを照合することが有効な投資管理手法です。
`},{id:"inbound-theme",themes:["インバウンド","観光・ホテル・レジャー"],keywords:["インバウンド","訪日","観光","円安","消費"],category:"インバウンド",icon:"✈️",title:"インバウンドテーマ：訪日外国人3,000万人超が生む消費拡大と恩恵企業",date:"2026/03/12",summary:"2025年の訪日外客数は3,000万人を超え、過去最高水準が続いています。インバウンド消費の拡大が直接・間接に恩恵をもたらす業種と主要銘柄を解説します。",body:`
H2: インバウンドテーマとは

インバウンドテーマは訪日外国人旅行者の増加によって恩恵を受ける企業群を対象とした投資テーマです。ホテル・旅館・航空・鉄道・百貨店・免税店・テーマパーク・飲食・旅行代理店・外国語対応サービスなど、訪日外国人が消費する幅広い産業が含まれます。

2024年に訪日外国人数が3,688万人と過去最高を記録し、訪日外国人消費額も8兆円超（推計）に達しました。コロナ禍（2020〜2022年）の「ゼロ」からわずか2年で過去最高を大幅更新したことで、インバウンドテーマへの投資家の関心が急高まりしています。

H2: 訪日外国人急増の背景と構造的要因

H3: 円安という強力な追い風

2022年以降の急速な円安（ドル円が110円台→150円超）は、外国人旅行者から見た日本旅行の「割安感」を大幅に高めました。東京の物価は国際的にみると「先進国最安値水準」とも言われ、グルメ・ショッピング・宿泊すべてが外国人には極めて割安に感じられます。この円安効果が訪日観光の強力な需要ドライバーとなっています。

H3: 日本文化・コンテンツの世界的普及

「COOL JAPAN」として知られる日本のアニメ・マンガ・ゲーム・映画（宮崎駿・黒澤明作品）・音楽（YOSAKOIソーランやJ-POP）・伝統文化（茶道・武道・歌舞伎）・食文化（寿司・ラーメン・焼肉・抹茶スイーツ）への世界的な関心が高まっています。NetflixやSNSを通じて日本のコンテンツが世界に広まり「いつか日本に行きたい」という潜在需要が世界規模で蓄積されています。

H3: 東アジア・東南アジア中間層の拡大

訪日外国人の上位を占める中国・韓国・台湾・香港に加え、近年はタイ・マレーシア・インドネシア・インド・中東からの旅行者も急増しています。特にインド・中東は訪日急増の「次の波」として注目されています。東南アジアの経済成長による中間層の拡大が、海外旅行の需要を押し上げています。

H2: インバウンド消費の「量から質へ」の変化

かつての「爆買い（大量の土産品購入）」から「体験消費（文化体験・高級旅館滞在・地方観光）」へのシフトが鮮明になっています。

外国人旅行者が1人あたりに使う消費額が増加しており、特に「富裕層旅行者（ラグジュアリー層）」による高額消費が目立ちます。東京の高級ホテル・旅館では1泊5万〜20万円超の客室が外国人に好まれ、稼働率と客室単価の両方が過去最高を更新しています。

H2: オーバーツーリズムという新たな課題

急増する訪日客への対応として「オーバーツーリズム（観光客の過密・マナー問題）」が社会問題化しています。京都（清水寺・祇園）・鎌倉・富士山（河口湖）・宮島などでは観光客の増加による渋滞・ゴミ問題・住民との摩擦が起きており、一部の自治体が以下の対策を導入しています。

観光地への入場制限（富士山の富士吉田口での登山規制・人数制限）、観光税・宿泊税の導入・増税（京都市）、バス路線の観光客向け有料化（鎌倉市の一部路線）などです。これらの規制がインバウンド消費に影響を与える可能性もあり、投資家として注視する必要があります。

H2: 主要関連銘柄の詳細

H3: ホテル・旅館

帝国ホテル（9708）は日本最高級ホテルとして外国人旅行者に高い認知度を持ち、客室単価・稼働率ともに過去最高を更新しています。藤田観光（9722）はワシントンホテル・椿山荘など多様なグレードのホテルを全国展開し、インバウンド需要の恩恵を幅広く受けています。

H3: 百貨店・免税店・小売

外国人の旺盛な消費需要を受け、百貨店の免税売上が急増しています。三越伊勢丹HD（3099）・高島屋（8233）・J.フロント リテイリング（3086、松坂屋）が特に外国人向け免税売上で恩恵を受けています。ドラッグストア（マツキヨコクミン・ウエルシア）やコンビニも外国人消費の重要な受け皿です。

H3: 航空・鉄道

ANAホールディングス（9202）・JAL（9201）は国際線の旅客数・旅客単価が過去最高を更新し、業績が急回復しています。鉄道では JR東日本（9020）・JR西日本（9021）が新幹線・観光列車の外国人利用増を取り込んでいます。交通ICカード（Suica等）の外国人向け整備も進んでいます。

H2: StockWaveJP編集部の見解

インバウンドテーマを観察していると、為替（円高・円安）の動向に対して最も感応度が高いテーマの一つであることがわかります。円高が進むと「割安感が薄れて訪日客が減る」という連想から売られ、円安が進むと「さらに割安感が増す」として買われるパターンが繰り返されています。

当編集部が特に注目しているのは「訪日外国人数の月次統計（観光庁・JNTOの発表）」のタイミングです。月次統計で「過去最高を更新」という発表があった翌週にテーマの出来高が急増し、モメンタムが「転換↑→加速」に転じることがあります。インバウンドテーマへの投資タイミングを判断する際に、この統計発表のカレンダーを把握することを推奨します。

H2: まとめと今後の展望

インバウンドテーマは「円安の継続」「日本文化への世界的な関心の高まり」「東南アジア・インド・中東からの新規需要」という三つの構造的追い風を受けており、2030年の訪日外国人6,000万人という政府目標に向けた成長トレンドが続くと当編集部は見ています。ただし為替変動リスクとオーバーツーリズム規制の影響を常にモニタリングしながら、StockWaveJPのモメンタムデータと組み合わせた投資判断を行ってください。

H2: インバウンド政策と政府の戦略

政府観光局（JNTO）と観光庁は「2030年に訪日外国人6,000万人・消費額15兆円」という目標を掲げています。この目標達成に向け、ビザ緩和（インド・サウジアラビア等との観光ビザ交渉）・地方空港の国際線就航促進・日本食・伝統文化の海外プロモーション強化が進んでいます。

特に注目されるのが「地方への分散誘導」政策です。東京・大阪・京都に集中する訪日客を北海道・東北・北陸・四国・九州・沖縄などの地方へ分散させることで、オーバーツーリズムを緩和しながら地域経済の活性化も図ります。地方の温泉旅館・食文化・自然体験・ユニークなアクティビティへの需要開拓が進んでいます。

H2: 免税制度と訪日消費の詳細

免税（Tax Free）制度は訪日外国人が日本国内で購入した物品の消費税（10%）が免除される制度で、訪日消費の重要な促進要因です。百貨店・ドラッグストア・家電量販店・コンビニなど幅広い店舗で対応しており、特にドラッグストア・化粧品・電子機器・アニメグッズ・高級ブランド品の購入が外国人に人気です。

マツキヨコクミンHD（3088）・ウエルシアHD（3141）はインバウンド向け免税対応の強化・多言語スタッフの配置・外国人向けSNSマーケティングで差別化を図っています。

H2: 交通インフラ：訪日外国人の移動体験

新幹線・在来線・バスの訪日外国人向け利用環境が大きく改善されています。JR東日本（9020）・JR西日本（9021）・JR東海（9022）は外国人向けIC乗車券（Suica等）の購入のしやすさ改善・多言語対応・Rail Passの拡充を進めています。訪日外国人の多い路線（成田エクスプレス・関空特急はるか・新幹線全線）の売上連動度が高まっています。

H2: まとめ

インバウンドテーマは「円安継続・日本文化への世界的関心・アジア新興国の訪日意欲拡大」という三重の追い風を受け、中長期的な成長が期待できます。JNTOの月次統計・為替動向・主要ホテルの稼働率データをStockWaveJPのモメンタムと組み合わせて確認することで、このテーマへの投資タイミングの精度を高めてください。
`},{id:"ev-green-theme",themes:["EV・電気自動車","蓄電池","全固体電池","脱炭素・ESG"],keywords:["EV","電気自動車","脱炭素","再エネ","ESG"],category:"EV・脱炭素",icon:"🔋",title:"EV・脱炭素テーマ：世界的な電動化シフトと日本企業の強みと課題",date:"2026/03/10",summary:"脱炭素・電動化は世界的な長期トレンドです。日本の自動車・素材・エネルギー関連企業が担う役割と、テーマ内の資金フローの読み方を解説します。",body:`
H2: EV・脱炭素テーマとは

EV・脱炭素テーマは電気自動車（EV）・プラグインハイブリッド（PHEV）・燃料電池車（FCV）などの次世代自動車と、脱炭素社会の実現に向けた各種技術・設備に関わる企業を対象とした投資テーマです。気候変動対策・カーボンニュートラル（温室効果ガス排出量ゼロ）の世界的潮流の中で、自動車産業の100年に一度の大変革が起きており、このテーマへの長期的な成長期待は揺るぎないものがあります。

H2: EV市場の現状と2030年の展望

H3: 世界のEV販売台数の急拡大

世界のEV（BEV＋PHEV）販売台数は2024年に約1,700万台に達し、新車販売全体の約20%を占めました。IEA（国際エネルギー機関）の予測では2030年に4,000万台超、2035年に7,000万台超とさらなる急拡大が見込まれています。特に中国（世界最大のEV市場）・欧州（内燃機関車の新車販売禁止方針）・米国（IRAによるEV補助金）が牽引しています。

H3: 中国BYDの台頭とEVの価格競争

中国の比亜迪（BYD）は2023年に初めてテスラを超える世界最多のEV販売台数を達成しました。BYDの強みはバッテリー・半導体・車体の垂直統合による圧倒的なコスト競争力で、低価格なEVを欧州・東南アジアに輸出する「中国EV攻勢」が欧米日の既存自動車メーカーを脅かしています。欧州はBYD等の中国製EVに対して追加関税（最大45%）を発動しており、EV市場の地政学的な緊張も高まっています。

H2: 日本の自動車メーカーのEV戦略

H3: トヨタのEV戦略と全固体電池

トヨタ自動車（7203）はハイブリッド（HV）で世界をリードしてきた企業として、EVへの転換が他社より遅いとの批判を受けてきましたが、2024〜2025年に大型EVの量産化を本格化させています。特に注目されるのが「全固体電池」の開発で、2027〜2028年の搭載開始を目標にしており、従来のリチウムイオン電池より航続距離・充電速度・安全性で優れるとされています。全固体電池が実用化されれば、EVの普及を加速させる「ゲームチェンジャー」になる可能性があります。

H3: ホンダ・日産の協業とEV戦略

ホンダ（7267）と日産自動車（7201）は2024年に包括的な業務提携を発表し、EV開発・電池調達・ソフトウェア開発でのリソース共有を進めています。三菱自動車もこの連合に加わり「日本連合」として中国・テスラ対抗の体制を整備しています。

H2: EV普及を支える周辺産業

H3: 電池・電池材料

リチウムイオン電池の製造ではパナソニックHD（6752）が北米・日本でテスラや国内EV向けに電池を供給しています。電池材料（正極材・負極材・電解液・セパレーター）では住友化学・東レ・旭化成・三菱ケミカル等の日本企業がグローバルなサプライヤーとして機能しています。

H3: 充電インフラ

EVの普及にはガソリンスタンドに代わる充電インフラの整備が不可欠です。急速充電器の設置拡大・マンション・商業施設への普通充電器の導入が全国で進んでいます。充電器メーカー（ニチコン・東光高岳等）・充電サービス（e-Mobility Power等）・送電設備（関西電力・東北電力系）への需要が拡大しています。

H3: カーボンクレジットとESG投資

企業が温室効果ガスの排出削減目標（SBT）を掲げ、目標に不足する部分をカーボンクレジット（排出削減量の証書）で補う市場が拡大しています。再生可能エネルギーの証書（RE100）・Jクレジット（国内の排出削減クレジット）の取引量が増加しており、証券会社・商社・エネルギー会社が新たな収益機会を見出しています。

H2: 脱炭素テーマの広がり：EVだけでない関連分野

H3: 再生可能エネルギー

太陽光発電・風力発電・地熱発電など再生可能エネルギーの普及が脱炭素の核心です。洋上風力（政府が2040年に最大4,500万kWの導入目標）・太陽光パネルの価格低下による住宅・産業用への普及・蓄電池との組み合わせによる24時間安定電力供給が進んでいます。

H3: 水素経済

水素は製造・輸送・利用が難しいですが、カーボンニュートラルの切り札として期待されています。グリーン水素（再エネ電力で水を電気分解して製造する純粋なゼロカーボン水素）の製造コスト低下が世界で進んでおり、燃料電池（トヨタのMIRAI・ホンダのClarityなど）・水素発電・工業用水素の需要が長期的に拡大します。

H2: EV・脱炭素テーマのリスク要因

EVの普及ペースが市場予想より遅れる「EV普及ペースリスク」が最大の懸念です。充電インフラ不足・EV価格の高さ・中国EVへの規制強化による供給制約・消費者の航続距離不安（レンジアンザイエティ）などの要因でEV販売が鈍化する局面もあります。また政権交代による政策変更（米国のEV補助金縮小等）も大きなリスク要因です。

H2: StockWaveJP編集部の見解

EV・脱炭素テーマは「長期の大きなトレンド」としては疑いがないものの、短期のモメンタムは「EVの販売統計（テスラの四半期納車台数・中国の月次EV販売データ）」「電池メタル価格（リチウム・コバルト）の動向」「各国の補助金政策の変化」に大きく左右されることを繰り返し観察しています。

特に印象的なのは「テスラの決算が予想を下回った直後にEV・脱炭素テーマ全体の出来高が急増して株価が下落し、その後数週間で回復する」というパターンです。テスラという「EVの象徴」の動向がテーマ全体の心理に与える影響は非常に大きく、テスラの決算スケジュールを把握した上でStockWaveJPのモメンタムを確認することを推奨します。

H2: まとめと今後の展望

EV・脱炭素テーマは「自動車産業の電動化」「再生可能エネルギーの主流化」「水素経済の勃興」という三つの巨大な構造変化を内包しており、2030〜2050年にかけて世界経済の根幹を変える長期テーマです。短期的なEV普及ペースの変動・政策変更のリスクを意識しながら、日本の自動車・電池・素材メーカーの技術競争力を長期的な視点で評価することが重要です。

H2: 日本のカーボンニュートラル政策

日本政府は2050年カーボンニュートラル（温室効果ガス排出実質ゼロ）を宣言し、2030年度に温室効果ガスを2013年度比で46%削減という目標を掲げています。この目標達成のためEV普及・再生可能エネルギー拡大・省エネ技術への大規模投資が政策的に後押しされています。2030年代以降の乗用車新車販売を電動車（EV・HV・PHV・FCV）に限定する方針も示されており、自動車産業の電動化は不可逆的なトレンドです。

H2: ハイブリッド車（HV）の再評価

EV一辺倒の欧米の流れに対し、トヨタが長年主張してきた「マルチパスウェイ（多様な電動化技術の並存）」という考え方が世界的に再評価されています。欧州でも「2035年内燃機関車新車販売禁止」の方針が一部修正・猶予が設けられるなど、HV・PHVへの需要が継続する見通しが出てきました。トヨタのHV技術の優位性と特許ポートフォリオは「EV一強時代」よりも「マルチパスウェイ時代」で最大化される可能性があり、この再評価がトヨタ株・EV・脱炭素テーマ全体の再評価につながっています。

H2: まとめ

EV・脱炭素テーマは長期的な構造変化を背景に持ちながら、短期のモメンタムはEV販売統計・電池材料価格・各国政策変更に大きく左右されます。StockWaveJPでテーマのモメンタムを定期確認しながら、テスラ決算・中国EV月次販売データのカレンダーと照合することで、エントリー・エグジットのタイミング精度を向上させてください。
`},{id:"how-to-read-data",themes:[],keywords:["騰落率","出来高","売買代金","分析","指標"],category:"分析手法",icon:"📊",title:"騰落率・出来高・売買代金の読み方：テーマ株分析の3つの基本指標",date:"2026/03/08",summary:"StockWaveJPに表示される3つの指標（騰落率・出来高・売買代金）がそれぞれ何を意味するのか、実際のテーマ分析でどう活用するかを解説します。",body:`
H2: テーマ株分析における3つの基本指標とは

StockWaveJPでは各テーマの動向を「騰落率・出来高・売買代金」という3つの指標で分析しています。これらを正しく読み解くことで、「どのテーマに資金が流れているのか」「その動きは本物のトレンドなのか一時的なものなのか」を判断できます。本コラムでは3つの指標の意味・読み方・組み合わせ方を詳しく解説します。

H2: 騰落率の読み方

H3: 騰落率とは何か

騰落率とはテーマを構成する銘柄群の株価変化率の平均値です。例えば「半導体テーマの1週間騰落率が+5.2%」であれば、半導体テーマを構成する銘柄群の株価が平均的に5.2%上昇したことを意味します。

個別銘柄の株価変化は「その銘柄特有の要因（決算・不祥事等）」と「テーマ全体の資金フロー」の両方で動きます。テーマ別の平均騰落率を見ることで、個別要因を排除した「テーマ全体への資金の流れ」を把握できます。

H3: 期間別騰落率の使い方

StockWaveJPでは「1週・1ヶ月・3ヶ月・6ヶ月・1年」などの複数期間で騰落率を確認できます。これらを組み合わせることで以下の判断ができます。

短期（1週）のみプラスで中長期がマイナスのテーマは「一時的な反発（デッドキャットバウンス）」の可能性があり、持続性に疑問が残ります。短期〜長期すべての期間でプラスかつ改善傾向にあるテーマは「真の上昇トレンド」にある可能性が高く、資金の流入が継続していると判断できます。長期はプラスだが短期がマイナスのテーマは「調整局面」であり、長期トレンドが崩れていなければエントリー候補になり得ます。

H3: 騰落率ランキングの活用

テーマ一覧の騰落率ランキングで上位に来るテーマは「今この瞬間に市場の注目が集まっているテーマ」を示します。ただし一時的なニュース（不祥事・サプライズ決算）による急騰・急落を含む場合もあるため、翌週以降のランキング変化（継続して上位にいるか）を確認することが重要です。

H2: 出来高の読み方

H3: 出来高とは何か、なぜ重要なのか

出来高は一定期間に取引された株数の合計です。出来高が多いということは「多くの投資家がその銘柄・テーマに注目して売買している」ことを意味します。出来高は「取引の参加者の多さ・関心の高さ」を示す指標であり、価格の動きの「信頼性」を判断するのに不可欠です。

投資の格言に「価格は嘘をつくが出来高は嘘をつかない」という言葉があります。株価が上昇していても出来高が少なければ「少ない参加者が動かした上昇（=信頼性が低い）」と判断できます。逆に出来高急増を伴う価格上昇は「多くの参加者が納得して買っている」という強いシグナルです。

H3: 出来高の急増パターンと意味

出来高が平常時の2〜3倍以上に急増するパターンには特定の意味があります。機関投資家・外国人投資家が大量に買い始めたとき出来高が急増します。重要なニュース（業績上方修正・大型受注・政策発表）が出たときも出来高が急増します。また「株価が長期間の高値や安値を突破したとき（ブレイクアウト）」にも出来高が急増し、その後のトレンドが継続しやすい傾向があります。

H3: 出来高ランキングの使い方

StockWaveJPの出来高ランキングで突然上位に浮上したテーマは「機関投資家が注目し始めた初期段階」の可能性があります。騰落率ランキングと出来高ランキングの両方で上位のテーマは「多くの参加者が買って株価が上昇している=強いモメンタム」の状態です。

H2: 売買代金の読み方

H3: 売買代金とは何か、出来高との違い

売買代金は一定期間の取引金額の合計（出来高×株価）です。出来高が「取引された株数」を示すのに対し、売買代金は「実際に動いた資金の規模」を示します。

例えば100円の株が100万株取引されると「出来高100万株・売買代金1億円」、1万円の株が10万株取引されると「出来高10万株・売買代金10億円」です。大型株（高価格）は少ない出来高でも大きな売買代金になります。出来高よりも売買代金を見ることで、「実際に動いた資金規模」をより正確に把握できます。

H3: 売買代金と機関投資家の動向

大型株を中心に保有する機関投資家（年金基金・投資信託・外国人投資家）の売買動向を把握するには、出来高よりも売買代金の変化が有効です。売買代金が突然増加したテーマは「大口の機関投資家が動き始めた」シグナルとして捉えられます。

H2: 3指標の組み合わせ方：実践的な分析手順

最も信頼性の高い「買いのシグナル」は以下の三つが揃ったときです。騰落率がプラス（株価が上昇している）、出来高が増加（多くの参加者が買っている）、売買代金が増加（大きな資金が動いている）。この「三拍子」が揃ったテーマは、トレンドの信頼性が高く持続性も期待できます。

逆に「騰落率はプラスだが出来高・売買代金が低水準」の場合、少数の参加者が作った価格変化であり、持続性が低いと判断できます。

H2: 騰落モメンタムとの組み合わせ

StockWaveJPの「騰落モメンタム」は3指標の変化の方向性をまとめた総合シグナルです。「🔥加速」は3指標すべてが改善方向にある状態、「❄️失速」は3指標すべてが悪化方向にある状態を示します。3指標をそれぞれ確認した後にモメンタムで全体像を把握するという使い方が最も効果的です。

H2: StockWaveJP編集部の見解

3指標を継続的に観察していると、「テーマが動き始める直前に売買代金だけが先行して増加する」パターンを見つけることがあります。株価がまだ動いていないのに売買代金（＝機関投資家の資金）が増加し始めているテーマは、翌週以降に騰落率・出来高も上昇してくる「先行シグナル」として機能することが多いです。

当編集部はこの「売買代金先行パターン」を意識しながら毎週のデータを確認しています。騰落率ランキングだけでなく売買代金ランキングも定期的に確認し、「静かに資金が動き始めているテーマ」を見つけることが、モメンタム投資における重要な先行指標の発掘につながると考えています。

H2: まとめ

騰落率・出来高・売買代金の3指標は、単体で見るより「組み合わせで見る」ことで本来の力を発揮します。3指標が揃って改善方向に動いているテーマは強いトレンドにある証拠であり、逆に一指標だけの動きは慎重に判断する必要があります。毎週のルーティンとしてこの3指標を確認することで、テーマ株投資の精度が大きく向上します。

H2: データの限界と補完的な活用法

騰落率・出来高・売買代金の3指標は非常に有用ですが、いくつかの限界があります。「組み入れ銘柄数の少ないテーマ」では一銘柄の決算発表などの個別要因がテーマ全体の数値を大きく歪める場合があります。また「テーマの定義（どの銘柄を含むか）」によって数値が変わるため、異なるサービス間での比較には注意が必要です。

これらの限界を補うために、StockWaveJPのデータと合わせて以下の情報源を活用することを推奨します。日経平均・TOPIXなど市場全体の指数と比較することでテーマの相対的な強さを確認できます。各テーマの代表銘柄の株価チャートと出来高を直接確認することで、テーマ指標の背景を理解できます。また経済ニュース（日経新聞・ブルームバーグ・ロイター）で出来高急増の「理由」を確認することが、モメンタムの持続性判断に不可欠です。

H2: テーマ間の相関分析

StockWaveJPのテーマヒートマップを活用することで、複数テーマの騰落率を期間別に並べて確認し「同じ方向に動くテーマ（高相関）」と「独立して動くテーマ（低相関）」を把握できます。例えば半導体・AI・クラウド・光通信は相関が高く、同じマクロ要因（AI需要・エヌビディア決算等）に連動して動きます。一方で銀行・金融・食品・通信などのディフェンシブテーマは半導体との相関が低く、ポートフォリオの分散効果をもたらします。

H2: まとめ

騰落率・出来高・売買代金の3指標を正しく読み解くことが、テーマ株投資の第一歩です。「3指標が揃って改善方向にある」状態こそ最も信頼性の高い買いシグナルであり、この組み合わせを習慣的に確認することでテーマ投資の精度を継続的に向上させることができます。StockWaveJPのデータを週1回のルーティンとして活用してください。
`},{id:"market-cycle",themes:[],keywords:["市場サイクル","資金ローテーション","テーマ投資"],category:"分析手法",icon:"🔄",title:"市場サイクルとテーマ投資：資金ローテーションを読む技術",date:"2026/03/06",summary:"株式市場では資金は常にどこかへ動いています。市場サイクルに応じてテーマ間で資金がローテーションする仕組みと、それを活用した投資アプローチを解説します。",body:`
H2: 市場サイクルとテーマ投資

株式市場は常に同じ動きをするわけではなく、「上昇→過熱→調整→回復→上昇」という周期的なサイクルを繰り返す傾向があります。このサイクルを理解し、現在の相場がどの局面にあるかを把握することで、どのテーマに投資すべきか・どのテーマを避けるべきかという判断精度が大きく向上します。

H2: 株式市場の四つの局面

H3: 第1局面：底打ちと回復初期（景気後退末期〜回復初期）

市場が最悪期を脱して底打ちした直後の局面です。多くの投資家はまだ悲観的で「まだ下がるのではないか」という心理が支配的です。この局面で最初に反応するのは「景気敏感・高ベータ（市場平均より大きく動く）」の銘柄・テーマです。

投資すべきテーマ：銀行・金融（金利低下が業績を刺激）・不動産（金利低下で住宅需要回復）・素材・鉄鋼（景気回復に先行）・テクノロジー（成長期待が再評価）

H3: 第2局面：上昇加速（景気拡大期）

景気回復が確認され、企業業績が改善し始める局面です。多くのテーマが同時に上昇する「総上げ相場」となることが多く、モメンタム投資が最も機能しやすい時期です。

投資すべきテーマ：半導体・AI・製造業・消費（内需拡大）・輸送・物流（生産活動の増加）

H3: 第3局面：過熱と高値圏（景気ピーク前後）

経済・業績は好調ですが株価が「楽観の織り込みすぎ」で割高になる局面です。インフレ圧力が高まり、中央銀行が利上げを実施し始めます。グロース株・投機的銘柄が特に過熱し、後から見ると「バブルの頂点だった」と分かるような局面です。

この局面では利益確定・ポジション縮小を意識し、高配当ディフェンシブ株へのシフトを準備する時期です。

H3: 第4局面：調整・下落（景気後退期）

景気後退が始まり株価が下落する局面です。リスクオフが強まり、全体的に株価が下落します。ただしこの局面でも相対的に強いテーマがあります。

相対的に強いテーマ：食品・飲料・医薬品・通信（生活必需品・ディフェンシブ）・金（インフレヘッジ・安全資産）

H2: セクターローテーション：資金の流れを読む

セクターローテーションとは、市場の資金が特定のセクター・テーマから別のセクター・テーマへと移動する現象です。景気サイクルの局面変化に合わせて資金が移動するため、このローテーションを先読みできれば大きなリターンが得られます。

典型的なローテーションの流れは「景気拡大期：製造業・素材→テクノロジー→消費・内需」「景気後退懸念時：グロース→バリュー・高配当・ディフェンシブ」というパターンです。

H2: 日本株特有のサイクルと要因

H3: 日銀政策との連動

日本株のサイクルには日銀の金融政策が強く影響します。量的緩和の縮小（テーパリング）・利上げは円高要因となり、輸出企業の収益悪化懸念から製造業・自動車テーマが売られます。逆に緩和的な政策維持は円安につながり、輸出関連テーマにプラスです。

H3: 決算シーズンとテーマの動き

日本株は3月末決算が多く、4〜5月が第4四半期決算（通期業績確定）・10〜11月が上半期決算の発表ピークとなります。決算シーズン前後にテーマの騰落率・出来高が急変することが多く、StockWaveJPでのモニタリングが特に有効な時期です。

H2: 現在のサイクル判断に使える指標

景気サイクルの現在位置を把握するための主要指標として以下があります。日銀短観（企業の業況感を四半期ごとに調査）・製造業PMI（購買担当者景気指数・50以上が拡大）・鉱工業生産指数（製造業の生産活動）・有効求人倍率（労働市場の強さ）・消費者物価指数（インフレの勢い）などです。

H2: StockWaveJP編集部の見解

市場サイクルを観察していて最も印象的なのは「多くの投資家が現在の局面に気づくのはすでに遅い」という事実です。景気回復の「初期段階」を正確に認識できれば大きなリターンが得られますが、その時点では多くのメディア・アナリストは「まだ不景気だ」と報道しており、先行して動くことが難しいです。

当編集部が重視しているのは「StockWaveJPのデータで、地味な景気敏感テーマに静かに出来高が増え始めているかどうか」という観察です。景気後退が意識されている局面でも、鉄鋼・化学・建設などの素材・景気敏感テーマに機関投資家の先行買いが入り始めると出来高が増加します。この「出来高の変化」が景気サイクルの転換点を示す早期警告シグナルとして機能することがあります。

相場環境がどの局面にあるかを判断しながら、StockWaveJPで強いモメンタムのテーマを確認する作業を組み合わせることで、単純なモメンタム投資より一歩深い投資判断が可能になると考えています。

H2: まとめ

株式市場はサイクルを繰り返します。現在のサイクルの局面を理解し、その局面で強くなりやすいテーマに資金を配分することが、テーマ株投資の長期的なパフォーマンス向上の鍵です。StockWaveJPのデータでモメンタムを確認しながら、マクロの景気サイクルも意識した複眼的な投資判断を心がけてください。


H2: 日銀金融政策と株式市場サイクルの関係

日本株特有のサイクルとして「日銀の金融政策サイクル」が非常に重要です。2013〜2024年の「異次元金融緩和（量的・質的緩和）」から「金利正常化（テーパリング→マイナス金利解除→利上げ）」への転換は、日本株市場に10年に一度のサイクル転換をもたらしました。超低金利時代にグロース株・不動産REITが評価されやすかったのに対し、金利正常化局面では銀行・保険・価値株が再評価される「バリュー相場」への転換が起きています。

H2: 円安・円高サイクルと業種別影響

日本株における最も重要な「見えないサイクル要因」の一つが円相場です。円安局面では輸出企業（自動車・精密機械・電子部品・製薬）の業績が改善し、これらのテーマが強くなります。円高局面では内需型企業（小売・食品・通信・建設）の相対的な強さが増し、輸出型テーマは逆風を受けます。2022〜2024年の急速な円安（130円台→155円超）は製造業・輸出テーマに大きな追い風をもたらし、2025年以降の円高・円安動向がテーマ配分の重要な判断軸となっています。

H2: 決算シーズンのサイクルとテーマへの影響

日本企業の多くは3月末決算であり、決算スケジュールに沿った「投資のカレンダー」を意識することでテーマ株投資の精度が高まります。4月下旬〜5月中旬（本決算・通期予想発表）・7月下旬〜8月中旬（第1四半期決算）・10月下旬〜11月中旬（第2四半期・中間決算）・1月下旬〜2月中旬（第3四半期決算）が主要な決算集中期です。決算サプライズ（上方修正・下方修正）はテーマ全体の騰落率・出来高に影響するため、このカレンダーを把握してStockWaveJPでのモニタリングを強化することを推奨します。

H2: グローバルサイクルと日本株

日本株は米国株式市場（S&P500・ナスダック）と高い相関があります。特に米国の景気後退懸念・FRBの金利政策・米国の主要企業決算（GAFAMなどのメガテック企業）が日本株全体のセンチメントに大きな影響を与えます。エヌビディア・アップル・テスラなどの決算が日本のIT・半導体・EV関連テーマに波及するという「グローバルサイクルの連動」を把握した上で、日本のテーマ投資を行うことが重要です。

H2: StockWaveJP編集部の見解追記

StockWaveJPのテーマヒートマップを数ヶ月間継続して観察すると、「どのテーマが景気敏感でどのテーマがディフェンシブか」という特性が自然と把握できるようになります。相場全体が下落する局面で「食品・通信が緑（小幅下落・横ばい）で、半導体・AI・グロースが大きな赤（大幅下落）」というパターンが繰り返されるため、これを視覚的に確認し続けることがテーマの相関理解の最も効果的な学習方法です。テーマヒートマップの期間を「1年」に設定して俯瞰すると、どのテーマが「年間を通じて強かったか・弱かったか」を一目で把握でき、来年のテーマ配分の参考になります。
`},{id:"japan-theme-investing-guide",themes:[],keywords:["テーマ投資","始め方","口座","銘柄選び"],category:"入門",icon:"🗾",title:"日本株テーマ投資の始め方（完全ガイド）：口座開設から銘柄選びまで",date:"2026/03/25",summary:"日本株のテーマ投資に興味はあるけど何から始めればいいかわからない、という方のために、口座開設から情報収集・銘柄の選び方まで完全ガイドとしてまとめました。",body:`
H2: 日本株テーマ投資とは何か

テーマ投資とは、社会トレンドや技術革新に関連する複数の銘柄を「テーマ」という括りで捉え、そのテーマ全体の動向を分析・投資する手法です。「半導体」「AI・クラウド」「防衛」「インバウンド」といったテーマに沿って銘柄を選ぶことで、個別企業の分析だけでは見えにくい「市場全体の資金の流れ」を掴むことができます。

個別株投資との最大の違いは「視点の広さ」です。個別株投資は1社の業績・財務・経営陣を深く分析しますが、テーマ投資はその産業全体がどの方向に向かっているか、どこに資金が集まっているかを見ます。

H2: 投資を始めるために必要なもの

H3: 証券口座の開設

日本株を購入するには証券会社に口座を開設する必要があります。主要なネット証券として、SBI証券・楽天証券・松井証券・マネックス証券などがあります。口座開設は無料で、本人確認書類とマイナンバーがあればオンラインで完結します。通常1週間程度で取引を開始できます。

特定口座（源泉徴収あり）を選ぶと確定申告が不要になるため、初心者にはおすすめです。

H3: 最低投資金額

日本株は原則として100株単位（単元株）で売買します。例えば株価1,000円の銘柄であれば10万円、株価3,000円であれば30万円が最低購入額になります。

ただし、証券会社によっては「単元未満株」「ミニ株」として1株から購入できるサービスもあり、少額から始めることも可能です。

H2: テーマの選び方

H3: ステップ1：自分が理解できるテーマから始める

投資の基本は「自分が理解できるものに投資する」です。普段から接しているもの、仕事で関わっているもの、ニュースで頻繁に見るテーマから始めるのが長続きする秘訣です。

例えば、ITエンジニアであればAI・クラウドやサイバーセキュリティ、医療従事者であれば医薬品・ヘルスケア、小売業であればECや消費関連といった具合です。

H3: ステップ2：テーマの「旬」を確認する

テーマ株には注目が集まる時期（旬）があります。政府の政策発表、大企業の決算発表、国際的な出来事などがきっかけになります。

StockWaveJPのテーマヒートマップページでは、過去12ヶ月の月次騰落率を確認できます。特定のテーマが継続的に強いのか、一時的な注目なのかを判断する材料になります。

H3: ステップ3：テーマ内の構成銘柄を確認する

同じ「半導体」テーマでも、製造装置メーカー・素材メーカー・設計会社では業績の動き方が異なります。テーマ全体が強くても、自分が投資する銘柄が恩恵を受けているかを個別に確認することが重要です。

H2: 銘柄の選び方

H3: バリューチェーンの上流・下流を理解する

テーマ内の銘柄は、産業の「川上（素材・部品）」から「川下（製品・サービス）」まで様々な位置にあります。一般的に、テーマが盛り上がる初期段階では川上（素材・設備）が先に動き、後から川下（完成品）に波及する傾向があります。

H3: 財務の健全性を確認する

テーマが良くても、財務が弱い企業は景気悪化時に倒産リスクがあります。最低限、以下の指標を確認しましょう。

自己資本比率（30%以上が目安）・流動比率（100%以上が理想）・売上高の成長傾向（3〜5年で見る）。これらはYahoo!ファイナンスや各証券会社のサイトで確認できます。

H3: 株価指標（PER・PBR）を参考にする

PER（株価収益率）は「今の株価が1株あたり利益の何倍か」を示します。業種平均と比較して割高・割安を判断する参考になります。PBR（株価純資産倍率）は「今の株価が1株あたり純資産の何倍か」を示し、1倍を下回ると理論上は解散価値より安く買えている状態です。

ただし、これらの指標だけで判断するのは危険で、成長性の高いテーマ株はPERが高くなる傾向があります。

H2: 情報収集の方法

H3: 公式情報を優先する

企業のIR（投資家向け情報）ページ、証券取引所のTDnet（適時開示情報閲覧サービス）、金融庁のEDINET（有価証券報告書）が一次情報です。SNSやブログの情報は参考程度に留め、必ず一次情報で確認する習慣をつけましょう。

H3: 日々の習慣

毎朝5〜10分でいいので、保有テーマの騰落率・出来高の変化を確認します。StockWaveJPの騰落モメンタムページで「状態」を確認することで、今のトレンドが加速しているか失速しているかを把握できます。

H2: リスク管理の基本

H3: 分散投資

1つのテーマに集中投資するのは高リスクです。複数のテーマに分散することで、1つのテーマが崩れても全体の損失を限定できます。

H3: 損切りルールを決める

購入時に「この価格まで下がったら売る」という損切りラインを決めておきます。一般的には購入価格の−10〜20%が目安です。感情的になる前にルールを決めておくことが大切です。

H3: 長期保有か短期売買かを決める

テーマ株は短期的な値動きが激しいため、長期保有を前提にするのか、短期的な値動きを狙うのかを最初に決めておく必要があります。長期保有の場合は一時的な下落に動じない心構えが必要です。

H2: まとめ

日本株テーマ投資は、時代の変化を先読みして資産形成できる魅力的な投資手法です。ただし、どんな投資にもリスクがあります。少額から始め、徐々に経験を積みながら自分なりのスタイルを確立していくことが長期的な成功の鍵です。

本サイト（StockWaveJP）は、テーマ別の騰落率・出来高・売買代金を客観的なデータとして提供しています。投資判断の一つの参考としてご活用ください。実際の投資はご自身の判断と責任において行われるようお願いします。
    

H2: テーマ株投資の具体的な実践サイクル

テーマ株投資を継続的に実践するには「週次の確認ルーティン」を確立することが重要です。月曜日にStockWaveJPのテーマ一覧を開き、（1）騰落率ランキング上位5テーマを確認、（2）出来高ランキング上位5テーマを確認、（3）モメンタムページで「加速」または「転換↑」のテーマをリストアップ、（4）三つの条件が重なるテーマを「注目テーマ」として絞り込む。これだけで15〜20分程度の確認作業が完了します。

H2: テーマ間の相関と分散効果

テーマ株投資においても分散は重要ですが、「見かけ上は異なるテーマでも実質的には同じリスク要因に連動する」という点に注意が必要です。例えば「半導体・AI・クラウド・ロボット・自動化」は互いに異なるテーマですが、米国のIT株相場・エヌビディア決算・ドル円相場に対して同じ方向に動くことが多いです。本当の分散効果を得るには、「景気敏感テーマ（鉄鋼・化学・海運）」と「ディフェンシブテーマ（食品・通信・医薬品）」と「政策テーマ（防衛・国土強靭化・再エネ）」をバランスよく組み合わせることが必要です。

H2: マクロ環境とテーマ投資の相関

テーマ株投資の精度を高めるには「マクロ環境とテーマの相関関係」を理解することが重要です。円安局面では輸出型テーマ（半導体・自動車・精密機械）が有利で、円高局面では内需型・輸入消費型テーマ（食品・小売・通信）が相対的に強い傾向があります。金利上昇局面では銀行・保険テーマが恩恵を受け、グロース系（AI・フィンテック・バイオ）は逆風となります。

H2: テーマ株投資の税務と口座管理

テーマ株投資で得た利益（配当・売却益）には通常20.315%の税金がかかります。NISA口座（非課税投資枠）を最大限活用することで税負担を軽減できます。特定口座（源泉徴収あり）では証券会社が自動的に税金を計算・納付してくれるため、確定申告の手間が省けます。損益通算（利益と損失を相殺して課税対象を減らす）も重要な節税手法で、年末に保有中の含み損銘柄を売却して損失を確定させる「損出し」は多くの個人投資家が実践しています。

H2: 情報収集と投資判断の精度向上

テーマ株投資の情報収集において以下のソースが特に重要です。日銀の政策決定会合の議事録・声明（金利関連テーマへの影響）、政府の予算案・重点政策発表（国土強靭化・防衛・再エネ等への影響）、米国の主要経済指標・FRB決算（為替・グローバルリスクへの影響）、主要企業の決算発表・IR資料（個別テーマの業績確認）。これらをStockWaveJPのデータと組み合わせることで、「なぜこのテーマが動いているのか」という根拠のある投資判断が可能になります。

H2: StockWaveJP編集部の見解

テーマ株投資を始めて最初にぶつかる壁は「テーマが動いているのを確認してから買うと高値づかみになる」という問題です。当編集部が推奨するのは「加速ではなく転換↑を狙う」アプローチです。テーマが「失速→横ばい→転換↑」に変化したタイミングでは、まだテーマへの強気センチメントが戻りきっていないため、「加速」になってから買うより有利な価格で参入できる可能性があります。ただしこの判断には「転換↑が本物のトレンド転換なのか、一時的な反発なのか」の見極めが必要で、出来高の増加・マクロ環境の改善・個別銘柄の業績確認を組み合わせることで判断精度を高めることができます。

H2: テーマ株投資の実践的ワークフロー

テーマ株投資を始める具体的な週次ワークフローを提案します。毎週月曜日（または週末）にStockWaveJPのテーマ一覧を開き、騰落率・出来高ランキング上位3テーマを「今週の注目テーマ」としてメモします。モメンタムページでそれらのテーマが「加速」または「転換↑」の状態にあるかを確認します。テーマヒートマップで短期・中期・長期の全期間で強いテーマかどうかを確認します。テーマ別詳細でそのテーマ内の構成銘柄の騰落率・出来高トップを確認し、証券口座のウォッチリストに追加します。

H2: まとめ

日本株のテーマ投資は「今どのテーマに資金が集まっているか」を客観的なデータで把握することが成功の鍵です。StockWaveJPの騰落率・出来高・売買代金・モメンタムという四つの指標を組み合わせた週次分析ルーティンを確立することで、テーマ株投資の精度と継続性が大きく向上します。本ガイドで学んだ基礎知識を実際の投資判断に活用してください。
`},{id:"defense-space-theme",themes:["防衛・航空","宇宙・衛星"],keywords:["防衛","宇宙","防衛費","国防","ミサイル"],category:"防衛・航空",icon:"🛡️",title:"防衛・宇宙テーマ徹底解説：国防費拡大と宇宙開発が生む長期投資機会と主要銘柄の全体像",date:"2026/03/23",summary:"日本の防衛費は2027年度にGDP比2%への増額が決定し、宇宙安全保障も国家戦略として位置づけられました。防衛・宇宙テーマの構造・主要銘柄・リスクを詳しく解説します。",body:`
H2: 防衛・宇宙テーマが注目される歴史的背景

2022年のロシアによるウクライナ侵攻以降、世界的に安全保障への意識が急速に高まりました。日本においても2022年12月に「国家安全保障戦略」「国家防衛戦略」「防衛力整備計画」のいわゆる「安保三文書」が閣議決定され、防衛費をGDP比2%（約10兆円規模）に増額する方針が打ち出されました。

この決定は日本の防衛産業にとって歴史的な転換点となりました。長年、防衛予算はGDP比1%前後に抑えられており、防衛関連企業の収益は安定しているものの成長は限定的でした。それが一転して大幅な予算拡大が決まったことで、防衛関連株への期待が急速に高まったのです。

H2: 宇宙安全保障の台頭

防衛テーマと密接に関連するのが宇宙安全保障です。現代の軍事作戦において、GPS・偵察・通信など宇宙インフラは不可欠であり、各国は「宇宙の軍事利用」に積極的に取り組んでいます。

日本政府は宇宙安全保障に関する戦略を策定し、早期警戒衛星（ミサイル発射を宇宙から探知）や偵察衛星の整備を推進しています。これにより、宇宙関連の防衛需要も拡大しています。

H2: 防衛産業のバリューチェーン

H3: システムインテグレーター（主契約企業）

防衛装備品の中核を担うのがシステムインテグレーターと呼ばれる大手企業です。

三菱重工業（7011）は日本最大の防衛企業であり、戦闘機・艦艇・ミサイル・ロケットなど幅広い防衛装備品を手掛けます。F-2戦闘機やイージス艦の建造にも関与しており、次期戦闘機（F-X）の日英伊共同開発でも中核的役割を担っています。

川崎重工業（7012）は潜水艦・哨戒機・陸上装備・ヘリコプターを手掛けます。特に潜水艦は高い技術力を持ち、海上自衛隊向けに継続的な建造実績があります。

IHI（7013）は航空エンジン・ロケットエンジンを主力とします。次期戦闘機のエンジン開発にも参画しており、長期的な受注が見込まれます。

H3: 電子・通信・センサー分野

NEC（6701）は防衛通信システム・レーダー・指揮統制システムを手掛ける総合電機メーカーです。自衛隊の情報通信インフラの多くにNECの技術が使われています。

富士通（6702）は指揮・通信・管制（C4I）システムを担当します。AIを活用した軍事情報分析システムの開発にも取り組んでいます。

東芝（6502）はレーダーシステム・電子戦システムを開発します。フェーズドアレイレーダーなどの高度な電子技術を保有しています。

H3: 宇宙インフラ分野

三菱電機（6503）は人工衛星・衛星搭載電子機器の主要メーカーです。日本の多くの観測衛星・通信衛星に三菱電機の機器が搭載されています。

IHIエアロスペースはイプシロンロケットの後継機開発を担います。小型衛星を低コストで打ち上げる能力は安全保障上も重要です。

H2: 注目トピックス

H3: 次期戦闘機（F-X）共同開発

日本・英国・イタリアの3か国が共同開発を進める次期戦闘機プロジェクト（グローバル戦闘航空プログラム：GCAP）は、2035年の配備を目標としています。三菱重工業・IHI・三菱電機・川崎重工業などが参画しており、総事業規模は数兆円規模とも言われます。

H3: スタンドオフミサイルの量産

敵の射程圏外から攻撃できるスタンドオフ能力の強化として、長射程ミサイルの開発・量産が始まっています。三菱重工業・川崎重工業が中心となり、量産効果による受注拡大が期待されます。

H3: 早期警戒衛星の整備

北朝鮮・中国のミサイル脅威に対応するため、ミサイル発射を早期に探知する衛星システムの整備が進んでいます。三菱電機・NECがこの分野で受注を獲得しています。

H2: 投資する際のリスク要因

H3: 政治・外交リスク

防衛テーマは地政学的リスクに敏感に反応します。緊張緩和のニュースが出ると株価が急落することがあります。また、政権交代による防衛政策の変更も大きなリスクです。

H3: 受注の不確実性

防衛関連企業の収益は政府の発注に依存しています。予算の執行遅延や政策変更により、受注計画が変更されるリスクがあります。

H3: 利益率の低さ

日本の防衛産業は長年「原価計算方式」で利益率が低く抑えられてきました。政府は利益率改善を検討していますが、民間ビジネスと比較すると依然として低い水準にあります。

H3: 採算性の課題

日本の防衛関連企業の多くにとって、防衛部門は売上の一部に過ぎません。三菱重工業は防衛・宇宙が売上の約30%、NEC・富士通は10%以下です。テーマ株として株価が動く一方、業績への影響は限定的な場合もあります。

H2: テーマの見方・活用法

防衛・宇宙テーマへの投資を考える際には、地政学的ニュースに過剰反応せず、長期的な予算増額の流れという大きな構造変化に注目することが重要です。

短期的には紛争関連ニュースで急騰・急落することがありますが、2027年度に向けた防衛費増額という確実な需要拡大が背景にある点で、構造的な追い風があります。

StockWaveJPでは防衛・宇宙テーマの騰落率・出来高・売買代金をリアルタイムで確認できます。出来高の急増を確認してから詳細を調査するという使い方が効果的です。
    

H2: 防衛費倍増計画の具体的な影響

日本政府は2022年末に「防衛費を2027年度までに対GDP比2%に倍増する（2023〜2027年で総額43兆円）」という方針を決定しました。従来の防衛予算（対GDP比約1%、年間約5兆円）から倍増するというのは戦後最大規模の防衛費拡大で、防衛産業・関連技術企業に対して強力な追い風となっています。具体的な調達計画として、スタンドオフミサイル（長射程・精密誘導ミサイル）・無人機（ドローン）・宇宙・サイバー・電磁波分野への重点投資が発表されました。

H2: 防衛装備移転三原則の緩和と輸出解禁

2023年に「防衛装備移転三原則」が見直され、日本製防衛装備品の輸出規制が大幅に緩和されました。特に「ライセンス生産品（外国技術で日本が生産した装備）の輸出」が可能になったことで、ライセンス先の米国・英国などへの完成品輸出や第三国への販売が現実的になっています。三菱電機製のパトリオットミサイルの米国への輸出が2024年に初めて実現し、「日本の防衛産業のグローバル化」という新章が始まりました。

H2: 防衛テーマの主要関連銘柄の詳細

三菱重工業（7011）は防衛省向けの戦闘機（F-2・次期戦闘機FX）・護衛艦・潜水艦・誘導弾の主要メーカーです。次期戦闘機（F-Xプログラム）は英国・イタリアとの「グローバル戦闘航空プログラム（GCAP）」として開発が進んでおり、三菱重工が日本側の主契約会社です。川崎重工業（7012）は潜水艦・哨戒機・輸送機の主要メーカーで、防衛省の中核サプライヤーです。三菱電機（6503）はレーダー・火器管制システム・誘導弾シーカー（誘導装置）で重要なポジションを占めます。IHI（7013）はジェットエンジン（F-2・F-35用エンジンの国内製造）で独自の地位を持ちます。

H2: 宇宙防衛と宇宙デブリ

防衛の観点から「宇宙の支配」が現代戦争の重要要素となっています。偵察衛星・通信衛星・GPS妨害・衛星攻撃（ASAT）が実際の紛争で使われるようになっており、日本も宇宙自衛隊（2020年設立）を中核とした宇宙防衛体制を整備しています。情報収集衛星・早期警戒衛星・宇宙状況把握（SSA）システムへの投資が拡大しており、三菱電機・NEC（6701）・IHIが防衛宇宙分野の主要サプライヤーです。

H2: StockWaveJP編集部の見解

防衛・宇宙テーマは「政策ニュース（防衛予算案・防衛装備調達計画）」と「地政学的緊張（北朝鮮・中国・ロシア関連ニュース）」の両方に感応することを観察しています。特に北朝鮮のミサイル発射・中台関係の緊張が高まる局面でテーマ全体の出来高が急増するパターンが繰り返されており、地政学カレンダー（北朝鮮の記念日・台湾選挙等）を意識したモニタリングが有効です。防衛テーマはディフェンシブ性（景気に左右されにくい安定した政府契約）と政策依存性（政権交代・予算削減リスク）という二面性を持ちます。防衛費拡大が法律・条約に裏付けられた「確定的なトレンド」である現状では、中長期の保有に適した安定成長テーマとして評価しています。

H2: 宇宙安全保障とデュアルユース技術

防衛・宇宙テーマの新たな側面として「デュアルユース（軍民両用）技術」の重要性が高まっています。衛星画像・GPS・通信・AIなどの技術は民間用と防衛用を明確に区別できなくなっており、民間の宇宙スタートアップ（QPS研究所・Synspective・Astroscale）の技術が防衛目的にも活用されています。また防衛省はスタートアップとの連携（防衛スタートアップ支援）を強化しており、革新的な民間技術を防衛に取り込む「民軍融合」政策が進んでいます。

H2: まとめ

防衛・宇宙テーマは地政学リスクの高まりと政府の防衛費増額という明確な政策的追い風を受け、中長期的な成長が確実視されます。三菱重工・川崎重工・三菱電機という大手防衛企業の株主還元強化とともに、宇宙スタートアップ（Astroscale・QPS研究所）という成長企業への注目も続きます。StockWaveJPで防衛テーマのモメンタム変化を地政学的ニュースと照合する習慣を持つことが、このテーマへの投資精度向上につながります。
`},{id:"momentum-investing",themes:[],keywords:["モメンタム","投資タイミング","加速","失速","転換"],category:"分析手法",icon:"📡",title:"騰落モメンタムを使った投資タイミングの考え方：加速・失速・転換シグナルの読み方",date:"2026/03/21",summary:"「騰落モメンタム」は単なる騰落率だけでなく、トレンドの勢いが増しているか衰えているかを示す指標です。加速・失速・転換の3つの状態を活用した投資タイミングの考え方を解説します。",body:`
H2: モメンタムとは何か

モメンタム（Momentum）とは「勢い」や「弾み」を意味します。投資の世界では、上昇している銘柄・テーマはさらに上昇し、下落しているものはさらに下落するという傾向（モメンタム効果）が知られています。これは行動経済学的には「群集心理」や「トレンドフォロー」によって説明されます。

騰落率が高いだけでは、そのトレンドが持続するかどうかはわかりません。重要なのは「加速しているか」「失速しているか」「方向転換しているか」という「変化の状態」です。

H2: StockWaveJPのモメンタム判定

StockWaveJPの騰落モメンタムページでは、各テーマを以下の5つの状態に分類しています。

H3: 🔥 加速

直近1週間の騰落率変化が+3ポイント超かつ先月比が+5ポイント超の状態です。テーマへの資金流入が加速していることを示します。強いトレンドが継続している可能性が高く、追い風が吹いている状態です。

H3: ❄️ 失速

加速の逆で、直近1週間・先月比ともに大幅にマイナスの状態です。資金流出が加速していることを示します。保有している場合は損切りラインの見直しを検討するタイミングです。

H3: ↗ 転換↑

先週比が+2ポイント超で、下落から上昇に方向転換した可能性がある状態です。底打ちのサインとして注目できます。ただし、一時的な反発で再下落することもあるため、出来高・売買代金の確認が必須です。

H3: ↘ 転換↓

先週比が-2ポイント未満で、上昇から下落に方向転換した可能性がある状態です。上昇トレンドが終わりを迎えているかもしれません。利益確定を検討するタイミングです。

H3: → 横ばい

上記のいずれにも該当しない状態で、方向感が定まっていない状態です。次の方向性が出るまで様子見するのが無難です。

H2: モメンタムの活用方法

H3: エントリー（買い）のタイミング

最も積極的なエントリーシグナルは「🔥加速」が継続している状態です。特に、前の週まで「→横ばい」や「↗転換↑」だったテーマが「🔥加速」に変化した場合は、新しい上昇トレンドが始まった可能性があります。

「↗転換↑」はリスクを取ったエントリーポイントです。底打ちが確認できればリターンが大きい反面、再度下落するリスクもあります。

H3: エグジット（売り）のタイミング

「❄️失速」や「↘転換↓」はポジションを減らすシグナルです。特に、長期間「🔥加速」が続いていたテーマが「↘転換↓」に変化した場合は、トレンド転換の重要なサインです。

ただし、1週間の変化だけで判断するのは早計なこともあります。2〜3週間継続してモメンタムが変化しているかを確認することを推奨します。

H2: 他の指標との組み合わせ

H3: 騰落率との組み合わせ

「🔥加速」でも騰落率がすでに+50%を超えているような過熱した状態は、高値掴みのリスクがあります。一方、騰落率が-20%程度で「↗転換↑」が出た場合は、底値からの反発を狙えるチャンスかもしれません。

H3: 出来高・売買代金との組み合わせ

モメンタムの状態変化と同時に出来高・売買代金が急増している場合は、そのシグナルの信頼性が高まります。逆に、出来高が少ない中での価格変動は「材料は出たが市場全体の関心は低い」という状況であり、過信は禁物です。

H3: テーマヒートマップとの組み合わせ

テーマヒートマップで複数期間（1M・3M・1Y）にわたって強い（赤い）テーマと、モメンタムが「🔥加速」であるテーマが一致している場合は、強固なトレンドである可能性が高いです。

H2: モメンタム投資の注意点

H3: 過去のパフォーマンスは将来を保証しない

モメンタム効果は統計的に確認されていますが、常に機能するわけではありません。相場環境の急変、予期しないニュース、政策変更などで一瞬でトレンドが崩れることがあります。

H3: 高値掴みのリスク

「🔥加速」のテーマに飛びつくと、すでに多くの投資家が注目した後で割高になっている可能性があります。特にニュースで大きく報道された後のタイミングは注意が必要です。

H3: 逆張りの危険性

「↗転換↑」を狙った底値買いは高リスクです。「まだ下がる可能性がある」という前提で、全資金を一度に投入せず、段階的に購入する（ドルコスト平均法的なアプローチ）ことを検討してください。

H2: まとめ：モメンタムを「参考情報」として活用する

騰落モメンタムは投資判断の「補助ツール」であり、それだけで売買を決めるべきではありません。企業の財務状況・業績見通し・市場全体の地合いと組み合わせて、総合的に判断することが重要です。

StockWaveJPのモメンタムページでは、全30テーマの状態を一覧で確認できます。「🔥加速」が多い時は市場全体が強気、「❄️失速」が多い時は弱気のサインとして、相場全体の地合い判断にも活用できます。
    

H2: 騰落モメンタムを機能させる相場環境

騰落モメンタムはすべての相場環境で等しく機能するわけではありません。最も有効なのは「トレンドが明確な相場（一方向に動き続ける相場）」で、逆に「横ばい・乱高下相場（方向感のない相場）」では機能しにくくなります。相場全体のVIX（恐怖指数）が高く日々の値動きが激しい局面では、モメンタムシグナルの信頼性が低下します。VIX20以下の落ち着いた相場環境でテーマのモメンタムシグナルを確認することで、精度が高まります。

H2: テーマモメンタムと個別銘柄モメンタムの組み合わせ

テーマ全体のモメンタムと個別銘柄のモメンタムを組み合わせることで、より精度の高い投資判断が可能です。「テーマが加速モメンタム」であることを確認した上で、「そのテーマ内の個別銘柄の株価が52週高値を更新しているか」「移動平均線（25日・75日）の上に位置しているか」「出来高が平均の2倍以上に増加しているか」という複数の条件が揃う銘柄を選ぶことが、モメンタム投資の実践的な手法です。

H2: 損切りとモメンタムの反転サイン

モメンタム投資で最も重要かつ難しいのが「損切りのタイミング」です。保有しているテーマのモメンタムが「加速→横ばい→転換↓」に変化した場合、それは「テーマに関するポジティブな見方が弱まっている」サインです。損切りの目安として「モメンタムが転換↓に変化した週の終値で売る」というルールを事前に決めておくことで、感情的な判断を避けられます。また個別銘柄レベルでは「購入価格から15〜20%下落で損切り」という機械的なルールと組み合わせることで、大きな損失を避けながらモメンタム投資を継続できます。

H2: 週次モニタリングの習慣化

モメンタム投資を成功させるには「定期的なモニタリング」が不可欠です。毎週月曜日（または週末）にStockWaveJPのテーマ一覧を開き、騰落率・出来高・モメンタムの変化を確認する習慣をつけることが、テーマ株投資の基本的なルーティンです。確認する頻度が低すぎると「転換↓→失速」のシグナルを見逃して損失が拡大し、頻度が高すぎると「日々のノイズ（一時的な変動）」に惑わされて不必要に売買を繰り返してしまいます。週次での確認が多くの個人投資家にとって適切なバランスです。

H2: StockWaveJP編集部の見解

騰落モメンタム指標を日々観察する中で気づいたことがあります。「加速」から「転換↓」へ突然変化することはほとんどなく、多くの場合「加速→横ばい（1〜2週）→転換↓」というプロセスを経ます。この「横ばい」の局面が「売りの準備タイミング」として機能することが多く、「横ばいになった時点でポジションを半分に縮小し、転換↓になったらさらに半分を売る」という段階的な対応が実践的と考えています。一気に全売りすると「その後に再び加速に転じた場合の機会損失」が生まれますが、段階的な縮小であればリスクとリターンのバランスが取りやすくなります。

H2: モメンタム投資の心理的課題と克服法

モメンタム投資の実践で最も難しいのは「すでに上がっている株をさらに買う」という心理的ハードルです。「もう上がりすぎたのでは」「高値掴みになるのでは」という恐れから、転換↑や加速のシグナルが出ていても実際にエントリーできないという投資家は多くいます。この心理的ハードルを克服するには「単一銘柄への集中投資を避け、テーマ全体の動向をデータで確認する」という客観的なプロセスが有効です。StockWaveJPのデータを見ることで「感情」ではなく「データ」に基づく判断ができるようになります。

H2: まとめ

モメンタム投資はStockWaveJPとの相性が最も高い投資手法です。毎週のルーティンとしてテーマ一覧の騰落率・出来高・モメンタムの三指標を確認し、「転換↑→加速」のパターンを持続的に追跡することで、テーマ株投資のエントリー精度が向上します。
`},{id:"shipbuilding-theme",themes:["造船","輸送・物流"],keywords:["造船","船舶","海運","LNG","コンテナ船"],category:"造船",icon:"🚢",title:"造船テーマ徹底解説：世界的な船舶需要増加と日本造船業の復活、主要銘柄と今後の展望",date:"2026/03/19",summary:"造船テーマは防衛・脱炭素・資源輸送需要という複数の追い風を受け、近年再注目されています。日本の造船業の現状と世界的な船舶需要の背景、主要銘柄の特徴を解説します。",body:`
H2: 造船テーマが再注目される背景

造船業は長年、中国・韓国との価格競争に苦しみ、日本の造船会社は事業縮小・再編を余儀なくされてきました。しかし2024年以降、複数の構造的な追い風が重なり、造船テーマが投資家から再注目されています。

H3: 追い風①：世界的な船舶更新需要

世界の商船の多くは老朽化しており、2030年代にかけて大量の船舶更新（代替建造）が見込まれています。特に、環境規制の強化（IMO（国際海事機関）による燃費規制）により、古い低燃費船を環境対応型の新造船に置き換える需要が急増しています。

H3: 追い風②：LNG・アンモニア船の需要急増

脱炭素社会への移行に伴い、液化天然ガス（LNG）・アンモニア・液化水素などの次世代燃料を輸送するための特殊タンカーの需要が急増しています。これらの船舶は高度な技術を要するため、技術力の高い日本・韓国の造船会社が競争優位を持ちます。

H3: 追い風③：防衛関連の艦艇需要

前述の通り、日本の防衛費増額により艦艇（護衛艦・潜水艦）の建造需要が拡大しています。川崎重工業・三菱重工業が主要な受注先となっています。

H3: 追い風④：コンテナ船・バルク船の需要

電子商取引（EC）の拡大とグローバルサプライチェーンの再構築により、コンテナ船・バルク船（ばら積み貨物船）の需要も堅調です。

H2: 日本の造船業の現状

日本の造船業は2010年代に大規模な再編を経て、現在は規模を縮小しつつも高付加価値船（LNGタンカー・大型コンテナ船・護衛艦など）に特化する戦略を取っています。

造船受注残高（バックログ）は近年大幅に積み上がっており、2026〜2028年にかけての建造スケジュールはほぼ埋まっています。これは今後数年間の業績安定を意味します。

H2: 主要銘柄と各社の特徴

H3: 今治造船（非上場）

日本最大の造船グループですが非上場のため、直接投資はできません。ただし、関連部品・素材メーカーへの投資で間接的に恩恵を受けることができます。

H3: ジャパンマリンユナイテッド（JMU）（非上場）

JFEスチールと日本海事興業の合弁会社で、大型タンカー・ばら積み船を主力とします。こちらも非上場です。

H3: 三菱重工業（7011）

艦艇（護衛艦）・潜水艦・LNGタンカーを手掛ける総合重工メーカーです。防衛需要の拡大とLNG需要の増加という二重の恩恵を受けています。

H3: 川崎重工業（7012）

潜水艦・LNG運搬船を主要製品とします。特に潜水艦は世界トップクラスの技術を持ち、防衛省からの安定受注があります。LNG船でも高い競争力を誇ります。

H3: 名村造船所（7014）

バルク船（ばら積み貨物船）を主力とする中堅造船会社です。船舶市況の影響を直接受けやすい銘柄です。

H3: 大島造船所（非上場）

バルク船に特化した造船会社で非上場ですが、業界内での高い技術評価があります。

H3: 関連素材・部品メーカー

造船関連への投資は、直接の造船会社だけでなく、鉄鋼（日本製鉄・JFEスチール）・エンジン（ダイハツディーゼル）・塗料（中国塗料）・バルブ（木村化工機）なども対象になります。

H2: 造船テーマのサイクル性

造船業は「シッピングサイクル」と呼ばれる景気循環が激しい産業です。船舶の需給バランスで運賃（船賃）が大きく変動し、それが造船会社の受注・業績に影響します。

H3: バルチック海運指数（BDI）

バルチック海運指数はバルク船の運賃指数で、世界の資源・穀物輸送需要を反映します。BDIが高い時は造船需要が強く、株価にもプラスに働く傾向があります。

H3: サイクルの特性

造船会社は受注から竣工まで2〜3年かかるため、今の市況が今の受注に直結しません。今好調でも2〜3年後に竣工が集中すると供給過剰になりやすいという構造があります。

H2: 投資リスク

H3: 中韓との価格競争

中国・韓国の造船会社は国家補助を背景に低価格で受注競争を展開しています。日本の造船会社は高付加価値船に特化することで差別化していますが、競争圧力は依然として強い。

H3: 資材・人件費の高騰

鉄鋼価格の上昇や人件費の増加は造船コストを押し上げます。固定価格で受注した船舶のコスト増は利益を直接圧迫します。

H3: 為替リスク

船舶の取引は主にドル建てで行われます。円高が進むと、円換算での受注金額が目減りするため、業績に悪影響があります。

H2: 今後の展望

2030年代にかけての船舶更新需要・LNGタンカー需要・防衛艦艇需要という複数の構造的追い風は当面続く見込みです。特に環境規制強化による高付加価値船の需要は、技術力の高い日本企業に有利に働きます。

ただし、シッピングサイクルの存在から短期的な株価変動は大きい傾向があります。長期的な構造変化に注目しながら、出来高・売買代金の変化も監視することで、エントリータイミングを計ることが重要です。

StockWaveJPでは造船テーマの騰落率推移をリアルタイムで確認できます。他のテーマ（防衛・EV・脱炭素）との比較分析にもご活用ください。
    

H2: 造船ビッグサイクルの到来

造船業は「20〜30年周期のビッグサイクル」が知られており、2024〜2030年代はその上昇サイクルにあると多くのアナリストが指摘しています。コロナ禍でのサプライチェーン混乱・老朽船の大量廃船・LNG船需要の急増・コンテナ船の代替需要が重なっており、造船所の受注残は日韓両国で2〜3年分を超える高水準にあります。

H2: 脱炭素対応船の需要急増

国際海事機関（IMO）は2050年までの海運業のカーボンニュートラル目標を設定しており、既存の重油燃料船からLNG燃料船・アンモニア燃料船・メタノール燃料船・水素燃料船への移行が急務となっています。代替燃料対応船は通常船より建造コストが30〜50%高く、単価の上昇が造船各社の収益改善につながります。今後15〜20年かけて世界の船舶の大部分が代替燃料対応に更新される見通しです。

H2: 日本造船大手の現状

今治造船（非上場）・ジャパンマリンユナイテッド（JMU・国内合弁）・三菱造船（三菱重工業・7011傘下）・川崎重工業（7012）・名村造船所（7014）・内海造船・佐世保重工業が主要な国内造船会社です。

三菱重工業（7011）は艦艇（護衛艦・潜水艦）の建造で防衛省との太い関係を持ちながら、商船部門でもLNG船・クルーズ船に実績があります。川崎重工業（7012）は潜水艦・護衛艦・LNG船・バルカー（バラ積み船）で多角的な船種を手掛けます。

H2: 韓国・中国造船との競争

日本造船業の最大の競合は韓国（現代重工業・サムスン重工業・大宇造船）と中国（CSSC・COSCO）です。韓国はLNG船・大型コンテナ船で強みを持ち、中国はコスト競争力で汎用船を席巻しています。日本は「高品質・環境対応・特殊船（LNG船・ケミカルタンカー）」での差別化を図っています。防衛省向けの艦艇建造を独自の競争優位として持つ点も日本造船業の特色です。

H2: StockWaveJP編集部の見解

造船テーマを観察していると、「海運運賃（コンテナ・タンカー・バルカー）の動向」と「LNG価格・エネルギー情勢」に対して感応度が高いことがわかります。海運運賃が上昇すると船主（海運会社）が新造船を発注する動きが活発化し、造船各社の受注が増加するというタイムラグがある連動関係です。この「海運→造船の2〜3ヶ月ラグ」を意識することが造船テーマの投資タイミング判断に有効です。また防衛費増額に伴う護衛艦・潜水艦の新造計画が国内で進んでおり、防衛関連テーマとの重複銘柄（三菱重工・川崎重工）の動向も注視しています。

H2: 造船テーマの需給構造と中長期見通し

世界の造船発注残は2024年時点で過去最高水準に達しており、韓国・中国・日本の3カ国でほぼ独占する寡占市場が形成されています。GHG（温室効果ガス）規制強化（国際海事機関IMOの2030・2050年目標）により、メタノール燃料船・アンモニア燃料船・水素燃料船など「次世代エコシップ」への建て替え需要が長期的に続きます。

H2: まとめ

造船テーマは「LNG船・自動車専用船需要の急増」「エコシップへの建て替え需要」「韓国・中国との技術競争」という三つのダイナミクスが交差する複雑なテーマです。今治造船・ジャパンマリンユナイテッド・三菱重工という日本造船のプレイヤーが設備投資・技術開発を加速する中、StockWaveJPで造船テーマのモメンタムと出来高急増を定期確認することが投資タイミング管理に有効です。
`},{id:"parent-child-listing",themes:[],keywords:["親子上場","ガバナンス","TOB","コーポレート"],category:"親子上場",icon:"🏢",date:"2026/03/28",title:"親子上場問題：日本株市場の構造的課題とガバナンス改革が生む投資機会",summary:"東証による上場制度改革で親子上場の解消が加速しています。親子上場とは何か、投資家にとってのリスクと機会を詳しく解説します。",body:`
H2: 親子上場問題とは何か

親子上場とは、ある会社（親会社）が株式の過半数または大部分を保有する子会社が、親会社とは別に証券取引所に上場している状態を指します。日本では約300社以上の親子上場が存在しており、国際的に見ると極めて多い水準です。欧米では「子会社を独立した上場企業として扱いながら、親会社が支配権を持つ」という構造が一般株主に対して不公平であるとして、親子上場は一般的に認められない傾向があります。

H2: なぜ親子上場は問題なのか

H3: 一般株主への不公平性

親会社と子会社が上場している場合、意思決定において「子会社の一般株主の利益」より「親会社の利益」が優先されるリスクがあります。例えば親会社が子会社に「低い価格での取引（関連当事者取引）」を強制したり、子会社の事業・人材を親会社のために優先的に使用させたりするケースが起こりうるからです。

H3: 「支配株主と少数株主の利益相反」

上場子会社には、親会社（支配株主）と一般株主（少数株主）という利害が必ずしも一致しない二種類の株主が存在します。親会社は子会社から自社に有利な利益誘導ができる立場にあり、一般株主は実質的にその恩恵を受けられない可能性があります。

H2: 日本での親子上場改革の動向

H3: 東証の上場制度改革

東京証券取引所は2023〜2024年にかけて親子上場のガバナンス強化に関するルールを整備しました。上場子会社において「独立社外取締役が過半数を占める取締役会」または「独立性の高い特別委員会の設置」を求めるなど、少数株主の利益を保護するための制度整備が進んでいます。

H3: スクイーズアウトと上場廃止の増加

最近のトレンドとして、親会社が子会社をTOB（株式公開買い付け）によって完全子会社化（非上場化）するケースが増えています。東芝グループのTOB・日立製作所の子会社の相次ぐ売却・独立化・SOMPOホールディングスによるSOMPOケアの完全子会社化などがその例です。

親会社がTOBを実施する場合、子会社株式を一定のプレミアム（上乗せ価格）を付けて買い取るため、子会社の一般株主は「プレミアム付きで株式を売却できる」というメリットを受けます。このため「親子上場解消の候補」と見られる銘柄は「TOBプレミアムへの期待」から株価が上昇することがあります。

H2: 投資機会としての親子上場銘柄

H3: 「親子上場解消候補」への投資

親子上場解消に向けたTOBが発表された場合、子会社の株式は通常20〜30%以上のプレミアムが付いた価格でTOBが行われます。事前にこの「TOB候補」を見つけることができれば、TOB発表による急騰の恩恵を受けられます。

TOB候補を見極める条件として以下が挙げられます。親会社の保有比率が50〜80%程度（完全子会社化しやすい水準）、子会社の事業が親会社の中核事業と近い（シナジーが大きい）、子会社のPBRが低水準（割安で買いやすい）、親会社がコーポレートガバナンス強化に積極的な姿勢を示している、などです。

H3: 「切り離し独立」による企業価値向上

逆に親会社が子会社を切り離して独立させる（親子上場を解消しつつ子会社を完全独立・上場維持させる）ケースもあります。この場合、子会社は親会社の「支配株主の目線」から解放され、自由に経営判断できるようになるため、企業価値が向上するという投資ストーリーが生まれます。

日立製作所はこの「選択と集中」戦略の代表例で、上場子会社（日立化成・日立建機・日立金属等）を次々に売却・独立化させることで本体の企業価値を大幅に向上させ、株価が数倍に上昇しました。

H2: 日本の主要親子上場グループ

ソフトバンクグループ（9984）は上場子会社にソフトバンク（9434）・ZHD（4689）等を持ちます。三菱UFJフィナンシャル・グループはアコム（8572）・三菱UFJニコス等を傘下に持ちます。キーエンスは非上場ですが多数の関連子会社を持ちます。製造業大手では日立・ソニー・パナソニックが過去に多数の上場子会社を持ち、それぞれ整理を進めてきました。

H2: StockWaveJP編集部の見解

親子上場テーマは「TOBアービトラージ（TOBを見越した投資）」という独特の投資機会を持つ分野です。StockWaveJPで「銀行・金融・IT・製造業テーマ」などにおいてモメンタムが上昇している局面では、そのテーマ内の上場子会社がTOBの候補となるケースがあります。

当編集部が観察していると、親会社がコーポレートガバナンス改善策を発表したり、親会社自身の株価が上昇してTOBの資金余力が生まれたりしたタイミングで、子会社株の出来高が急増することがあります。こうした「TOB前の静かな出来高増加」を見逃さないことが、親子上場テーマの投資において重要な観察ポイントです。

H2: まとめと今後の展望

親子上場問題は日本のコーポレートガバナンス改革の核心的なテーマです。東証の制度改革・機関投資家（特に外国人投資家）からの圧力・親会社自身のガバナンス改善意欲の高まりにより、今後数年にわたって親子上場の解消が加速する見通しです。このトレンドに乗った投資（TOB候補の発掘）は、適切に行えばリスク対比で高いリターンが期待できます。


H2: 東証の上場基準改革とガバナンス要件強化

2023〜2024年の東証の制度改革は親子上場に特に大きな影響を与えました。新たなコーポレートガバナンス・コードでは「支配株主（親会社）との取引における独立委員会の設置」「支配株主との利益相反が生じる取引の開示」「一般株主の保護のための手続き」が求められるようになりました。これにより上場子会社の経営コストと管理コストが増加し、「親子上場のメリットが薄れた」と判断する親会社が完全子会社化を選択するケースが増えています。

H2: 主要な親子上場解消事例

日立製作所（6501）は2010〜2020年代にかけて上場子会社（日立化成・日立建機・日立金属・日立物流等）を次々に売却・独立化させる「選択と集中」を実施し、時価総額が数倍に上昇しました。日立の事例は「親子上場の解消が企業価値向上につながる」という教科書的な成功事例として、機関投資家・アクティビストが他の親子上場企業に同様の改革を求める際の根拠として使われています。

ソニーグループ（6758）はソニー・フィナンシャルHDの完全子会社化（2020年）・ソニー銀行の非上場化・ソニーコンピュータサイエンス研究所の独立など、グループ再編を継続的に実施しています。NTTはNTTドコモの完全子会社化（2020年・完全非上場化）を実施し、ドコモとのグループ戦略の一体化を図りました。

H2: アクティビスト（物言う株主）と親子上場問題

外国人機関投資家・国内外のアクティビストファンドは、親子上場を「日本のコーポレートガバナンスの問題の象徴」として批判し、解消を求める株主提案を行うことがあります。バリューアクト・エリオット・Oasisマネジメントなどのアクティビストが特定の親子上場企業に対して「上場廃止・完全子会社化・適正なTOBプレミアム」を要求する活動が日本でも活発化しています。このアクティビストの動向はTeema株投資における重要な「カタリスト」となりうるため、企業の大株主情報（四半期報告書）の確認が重要です。

H2: 親子上場解消候補の見つけ方

投資対象として有望な「親子上場解消候補」を見つけるためのスクリーニング条件として以下が参考になります。親会社の保有比率が50〜80%程度（完全子会社化のTOBが行いやすい水準）、子会社のPBRが1倍以下（買収コストが低い）、子会社の事業が親会社の中核事業と密接に関連している（シナジーが大きい）、親会社がコーポレートガバナンス改善に積極的な姿勢を公表している、などです。これらの条件が重なる銘柄は「TOB候補プレミアム」を株価に反映しやすいです。

H2: StockWaveJP編集部の追記

親子上場テーマへの投資で注意すべきは「TOBプレミアムへの期待だけで投資すると、TOBが発表されなかった場合に株価が元の水準に戻る（プレミアム消失）リスク」です。TOBが実現しなくても「PBR改善・ROE向上」というファンダメンタルな改善が見込める企業を優先的に選ぶことが、このテーマへの長期投資において重要です。StockWaveJPで「銀行・金融・IT・製造業テーマが強い局面でそのテーマ内の上場子会社の出来高が増加している」という状況を確認することが、TOB候補の初期シグナルを掴む実践的な観察手法です。
`},{id:"buffett-japan-stocks",themes:["バフェット銘柄"],keywords:["バフェット","総合商社","長期投資","価値投資"],category:"バフェット銘柄",icon:"🎩",date:"2026/03/27",title:"バフェット銘柄：伝説の投資家が選ぶ日本の総合商社と投資哲学から学ぶ長期投資の本質",summary:"ウォーレン・バフェットが日本の5大総合商社に大規模投資したことで世界中の注目を集めました。その投資哲学と日本株への示唆を解説します。",body:`
H2: バフェット銘柄とは

ウォーレン・バフェット（Warren Buffett）は「投資の神様」と称されるバークシャー・ハサウェイCEOで、90歳を過ぎた今も現役の投資家として世界中から注目を集めています。2020年8月、バフェットが率いるバークシャー・ハサウェイが日本の総合商社5社（三菱商事・三井物産・住友商事・伊藤忠商事・丸紅）の株式を各社約5%取得したと発表し、日本株市場に衝撃が走りました。

この発表以降、「バフェットが選んだ日本株」として総合商社5社は世界の機関投資家から改めて注目を集め、株価は大幅に上昇しました。さらに2023年には来日して日本の経営者と面談し、追加購入の意欲を示すなど、バフェットの日本株への継続的な関心が確認されています。

H2: バフェットが総合商社に投資した理由

H3: 極めて低いバリュエーション（割安さ）

投資当時（2020年）の総合商社5社のPBR（株価純資産倍率）は軒並み1倍を下回る超割安水準にありました。自己資本の半分以下の価格で購入できる状態であり、バフェットの「安全域（マージン・オブ・セーフティ）」という投資原則に合致していました。

H3: 高い配当利回りと継続的な株主還元

投資当時、商社5社の配当利回りは4〜6%台と極めて高水準でした。バフェットは配当を受け取りながら株価上昇も狙える「配当＋キャピタルゲイン」の両取り戦略として評価しました。バークシャーは日本円建て社債を低金利で発行し、商社株の配当利回りとのスプレッドで利益を得るという「円建て裁定取引」の側面もあったと分析されています。

H3: 分散された事業ポートフォリオと資源権益

総合商社は石炭・原油・銅・LNG・農産物・半導体・食品など多様な資産・事業を世界中に持つコングロマリット（複合企業体）です。バフェットが長年好む「分散されたビジネスポートフォリオ」「実物資産（コモディティ）へのエクスポージャー」という特性が評価されました。バフェット自身が「商社はバークシャーに似ている」とコメントしたことでも知られています。

H3: 強固な財務基盤と経営の質

商社5社はいずれも強固なバランスシートを持ち、長期的に安定した利益を上げ続けています。コーポレートガバナンス改革の進展・株主還元の強化という流れも、バフェットの投資基準に合致する変化でした。

H2: 総合商社の事業構造と収益源

H3: 資源ビジネス（エネルギー・鉱山）

三菱商事はオーストラリアの石炭・LNG権益・チリの銅鉱山権益を大量保有。三井物産はブラジルの鉄鉱石（バーレ社への出資）・LNG・銅を中心とした資源ポートフォリオ。住友商事は銅（コンゴ・モロッコ）・ニッケル・マダガスカルの大型案件。伊藤忠は資源依存度を低め非資源（食品・繊維・金融）比率が高い体制。丸紅は農業（肥料・穀物）・電力（再生可能エネルギー）・水道事業に特色があります。

H3: 非資源ビジネスの成長

資源価格が低迷した2015〜2016年の商社業績悪化を教訓に、各社は非資源分野（食品・ヘルスケア・ITサービス・金融・小売）への多角化を進めています。三菱商事はローソン（コンビニ）・ケネディクス（不動産）、伊藤忠はファミリーマート（コンビニ）を傘下に持ち、消費関連の安定収益を持っています。

H2: バフェット以降の株価変化とバリュエーション

バフェットの投資発表（2020年8月）以降、商社5社の株価は2〜4倍以上に上昇しました。当初のPBR0.5〜0.8倍という超割安水準から、現在はPBR0.9〜1.5倍程度まで是正されています。バリュエーション是正と業績改善（資源価格上昇・株主還元強化）が重なったことで大きなリターンをもたらしました。

ただし2025〜2026年現在の商社株は「すでに割安ではない」という見方もあります。今後の株価を左右するのは「さらなる業績改善（M&A・新規事業）」「株主還元の継続強化」「資源価格の動向」という三つの要因です。

H2: バフェット投資哲学から学ぶ日本株投資

H3: 「素晴らしい企業を適正価格で」

バフェットの最も有名な格言の一つは「素晴らしい企業を適正な価格で買う方が、適正な企業をすばらしい価格で買うよりも良い」です。単純に株価が安い（PBR低い）というだけでなく、長期的に競争優位性を持つビジネス（ウォーモート）であることが重要です。

H3: 長期保有と複利の力

バフェットは「好きな保有期間は永遠」と言います。優れた企業の株式を長期保有することで、配当の再投資と株価上昇の複利効果を最大限に活かす戦略です。NISAの非課税・無期限保有という制度がバフェット流の長期投資と相性が良いことは言うまでもありません。

H2: StockWaveJP編集部の見解

バフェット銘柄（総合商社5社）をStockWaveJPのデータで観察していると、資源価格（原油・銅・LNG先物）の動向に対して特に敏感に反応することが確認されます。資源価格が急上昇する局面では商社テーマ全体の出来高が急増し、モメンタムが「転換↑→加速」に転じるパターンが繰り返されています。

当編集部が注目しているのは「バフェット来日・追加購入報道」のタイミングです。バフェットの日本株への言及があるたびに、商社株だけでなく日本株全体に外国人投資家の資金が流入する傾向があります。この「バフェット効果」は一時的ではなく数週間〜数ヶ月継続することが多く、テーマ全体のモメンタムへの影響を注視しています。

H2: まとめと今後の展望

総合商社5社は「バフェット銘柄」としてのブランド効果に加え、資源ポートフォリオの強化・非資源事業の多角化・積極的な株主還元という三つの価値創造要因を持つ日本株の代表的な「バリュー×高配当×連続増配」銘柄群です。今後の投資判断においては、資源価格サイクル・個社のM&A戦略・株主還元計画の継続性をStockWaveJPのテーマデータと組み合わせて判断することが重要です。

H2: バークシャーの日本商社株の追加購入

バフェットは2023年4月に来日し、日本の商社経営陣と面談。会見で「5社への保有比率を将来的に高める意向」を表明しました。実際に2024年以降も各社の株式を順次買い増しており、保有比率は当初の5%から各社8〜10%台に上昇しています。バークシャーが継続して日本商社株を購入するという「バフェット効果」は、外国人機関投資家の日本株全体への関心を高め続けています。

H2: 商社5社の株主還元競争

バフェットの投資以降、商社5社は積極的な株主還元強化で「バフェットの期待に応える」姿勢を明確にしています。三菱商事・三井物産は毎年の増配に加え大規模な自社株買いを実施。伊藤忠商事は「稼ぐ力を高め続ける」コミットメントのもと連続増益・連続増配を継続しています。これらの株主還元強化が商社株のバリュエーション向上に貢献しており、NISAでの人気高配当株としての地位も確立されています。

H2: まとめ

バフェット銘柄（総合商社5社）は「割安・高配当・資源ポートフォリオ」という三つの魅力が組み合わさった日本株の代表的な長期投資銘柄群です。バフェットの継続的な買い増し・自社株買い・増配という株主還元強化のサイクルが続く限り、このテーマへの中長期的なポジティブ見通しは維持されます。
`},{id:"physical-ai-edge-ai",themes:["フィジカルAI","エッジAI","ロボット・自動化"],keywords:["フィジカルAI","エッジAI","ロボット","自律走行"],category:"フィジカルAI",icon:"🤖",date:"2026/03/26",title:"フィジカルAI・エッジAIとは？次世代AIが生む産業革命と日本企業の投資機会",summary:"生成AIがソフトウェアの世界を変えた次のステージとして「フィジカルAI」と「エッジAI」が注目されています。現実世界を動かすAIの台頭と日本企業の競争優位を解説します。",body:`
H2: フィジカルAI・エッジAIとは何か

フィジカルAI（Physical AI）とは、物理世界（現実空間）に直接作用するAIシステムを指します。データセンターの中でデータを処理するだけでなく、工場のロボットアーム・自動運転車・農業ドローン・医療診断装置など、物理的な機械・装置に組み込まれて現実世界に影響を与えるAIです。エヌビディアのジェンスン・ファン CEOが2025年のCES基調講演で提唱した概念で、「AIの次の大波」として産業界・投資家から注目を集めています。

エッジAI（Edge AI）とはクラウドではなくデバイス側（エッジ）でAI処理を行う技術です。スマートフォン・IoTセンサー・工場の制御システム・自動車などに直接AIチップを搭載し、通信遅延なしにリアルタイムでAI処理を実行します。

H2: なぜフィジカルAI・エッジAIが注目されるのか

H3: クラウドAIの限界

ChatGPTなどの生成AIはクラウドサーバーで処理されるため、インターネット接続が前提となります。しかし自動運転車の衝突回避判断・工場の異常検知・手術ロボットの動作制御のような「ミリ秒単位の応答が求められる用途」ではクラウドAIの遅延（レイテンシ）は致命的です。エッジAIはこの問題を解決します。

H3: データプライバシーと通信コストの問題

クラウドにデータを送信することはプライバシーリスクと通信コストを生みます。工場の生産ラインデータ・病院の医療データ・個人の健康データをクラウドに送らずにデバイス側で処理するエッジAIは、セキュリティ・コスト両面で有利です。

H2: フィジカルAIが変える産業分野

H3: 製造業：スマートファクトリーの高度化

フィジカルAIが最も早く実用化が進んでいる分野が製造業です。生産ラインの異常検知（カメラとAIで不良品を自動発見）・予知保全（機械の故障を事前に予測）・ロボットアームの動作最適化（AIが最適な動作経路を学習）などが工場に導入されています。

ファナック（6954）はCNC装置・産業用ロボットにAIを組み込み、加工精度の自動最適化・熟練工の技術のAI化（匠技能の継承）を実現しています。安川電機（6506）も「次世代のスマートファクトリー」に向けたAI搭載ロボットの開発を加速しています。

H3: 自動運転・モビリティ

自動運転技術はフィジカルAIの代表例で、車両に搭載されたAIがカメラ・LiDAR・レーダーのデータをリアルタイムで処理して走行を制御します。エヌビディアのDRIVEプラットフォーム・クアルコムのSnapdragon Rideなどの自動運転AI半導体が主要OEM（完成車メーカー）に採用されています。日本ではソニーとホンダの合弁会社「ソニー・ホンダモビリティ」が先進的な車載AIを開発しています。

H3: ロボティクスと「ロボット革命」

エヌビディアはフィジカルAIの中核技術として「ロボット用AIプラットフォーム（Jetson・Isaac）」の開発を強化しており、工場用ロボット・倉庫用AMR（自律走行搬送ロボット）・ヒューマノイドロボット（人型ロボット）への応用が広がっています。テスラの「Optimus（オプティマス）」・Boston Dynamicsの「Atlas」・Figure AIのヒューマノイドロボットが注目を集めており、「物理世界で作業できるAIロボット」の実用化競争が激化しています。

H2: エッジAIを支える半導体

エッジAIの処理にはクラウド向けGPUとは異なる「低消費電力・小型・高性能」なAIチップが必要です。エヌビディアのJetson（組込み向けAIモジュール）・クアルコムのSnapdragon（スマートフォン・IoT向け）・ルネサスエレクトロニクス（6723）のAIマイコン・ソニーの画像認識AIチップなどが市場をリードしています。

ルネサスエレクトロニクス（6723）は自動車向け・産業機器向けのマイコン（小型制御用半導体）とAIプロセッサの融合を進めており、フィジカルAI・エッジAI時代の日本企業として注目されています。

H2: 日本企業のフィジカルAI・エッジAI関連銘柄

工場の自動化・スマートファクトリー分野ではファナック（6954）・安川電機（6506）・キーエンス（6861）・オムロン（6645）が代表的です。キーエンスは高精度センサー・機械ビジョン（AI画像検査）で製造現場のスマート化を支援し、圧倒的な利益率（営業利益率50%超）で知られます。

自動運転・車載AI分野ではデンソー（6902）・ソニーグループ（6758）・ルネサス（6723）が重要なプレイヤーです。通信インフラ（エッジAIを支えるMEC：モバイルエッジコンピューティング）ではNTT・KDDIが5Gインフラと組み合わせた展開を進めています。

H2: フィジカルAI・エッジAIの課題

H3: 計算資源と電力の制約

エッジデバイスはバッテリー・発熱・サイズの制約があるため、クラウドAIほど大規模なモデルを搭載できません。「軽量化（モデル圧縮・量子化）」技術の進歩が実用化の速度を左右します。

H3: データの品質と継続学習

フィジカルAIは現実世界の多様な環境（天候・照明・異常状態）に対応するため、大量の高品質な学習データが必要です。また現場での経験から継続的に学習（オンライン学習）する仕組みの整備も課題です。

H2: StockWaveJP編集部の見解

フィジカルAI・エッジAIテーマは「AI×製造業×ロボット×半導体」という複数の成長テーマが交差する点に位置しており、StockWaveJPのデータを見ていると、エヌビディア決算・CES・ロボット展などの大型イベント後にこのテーマへの出来高が急増することが確認されます。

特に注目しているのは「ファナックやキーエンスの受注動向」です。製造業の設備投資計画を示すこれらの企業の受注が上向くタイミングは、スマートファクトリー化の加速を示すシグナルであり、フィジカルAIテーマ全体の追い風となります。当編集部は「AIという言葉がある」だけでなく、実際の製造業・物流・医療の現場でどれだけ実装が進んでいるかという「実需」を重視してこのテーマを評価しています。

H2: まとめと今後の展望

フィジカルAI・エッジAIは「AIが仮想世界から物理世界に出てくる」という産業革命的な変化を象徴するテーマです。製造業・物流・医療・農業・モビリティのあらゆる分野で実装が加速しており、日本のロボット・センサー・制御機器・半導体メーカーが世界的な競争力を持つ分野です。中長期にわたって構造的な成長が続くテーマとして、StockWaveJPで継続的に動向を観察することを推奨します。

H2: AIロボットと製造現場の変革

フィジカルAIの最前線にいるのが工場の製造ラインです。これまでの産業用ロボットは「決められた動作を繰り返す」だけでしたが、AIの進化により「環境の変化に適応して最適な動作を自ら学習・改善する」ロボットが実用化されています。例えばカメラとAIを組み合わせた「ビジョンシステム」は、ランダムに投入されたバラ積みの部品を認識して正確に掴み取る作業を自動化できます。これは従来のロボットには難しかった作業であり、より複雑な工程への自動化が可能になります。

H2: スマートシティとエッジAIの融合

交通インフラ・エネルギーグリッド・上下水道など都市インフラの管理にエッジAIを活用する「スマートシティ」の取り組みが全国各地で始まっています。信号機のAI最適制御（渋滞緩和）・太陽光発電の出力予測と電力需給バランス管理・橋梁・トンネルのセンサーデータによる異常検知などが実用化されています。

H2: まとめ

フィジカルAI・エッジAIは「AIが仮想空間から物理世界へ出てくる」次の産業革命を象徴するテーマです。日本のロボット・センサー・制御技術の競争力がこのテーマで発揮される場面が多く、ファナック・キーエンス・安川電機などの長期的な成長ストーリーと組み合わせた投資判断が有効です。StockWaveJPで製造業・ロボット・AI関連テーマの相対的なモメンタムを定期確認しながら、主要イベント（ファナック決算・CES・国際ロボット展）前後の動向に注目してください。
`},{id:"power-semiconductor",themes:["パワー半導体","EV・電気自動車","蓄電池"],keywords:["パワー半導体","SiC","GaN","EV","電力制御"],category:"パワー半導体",icon:"⚡",date:"2026/03/25",title:"パワー半導体：EVシフト・再生可能エネルギーが牽引する次世代半導体市場と日本の優位性",summary:"EVの普及や電力インフラの高効率化に欠かせない「パワー半導体」。この分野で日本企業が持つ競争優位と市場拡大の背景を解説します。",body:`
H2: パワー半導体とは何か

パワー半導体（電力用半導体）は、電力の変換・制御・供給を行う半導体デバイスです。一般的なロジック半導体（CPU・メモリ等）が「情報処理」を担うのに対し、パワー半導体は「電力処理」を担います。電圧・電流・周波数を変換したり電力の流れをオン・オフしたりする「電力のスイッチ」として機能し、電気自動車のモーター制御・太陽光発電のインバーター・家電製品の省エネ制御・鉄道の駆動システムなど、電気を使うあらゆる機器に搭載されています。

現代社会の電力インフラはパワー半導体なしには成立しないと言っても過言ではなく、「産業のコメ」とも呼ばれるロジック半導体と並ぶ重要な半導体の一分野です。

H2: なぜ今、パワー半導体が注目されるのか

H3: EV普及による需要爆発

電気自動車（EV）1台に搭載されるパワー半導体の量は、従来のガソリン車の約3〜5倍です。EVのインバーター（バッテリーの直流電力をモーター駆動用の交流に変換）・DC-DCコンバーター（電圧変換）・オンボードチャージャー（充電制御）などの主要電力回路に大量のパワー半導体が使われます。

IEAの予測では世界のEV販売台数は2030年に4,000万台超に達するとされており、EV販売台数の増加は直接的にパワー半導体需要の増加を意味します。自動車向けパワー半導体市場は2030年までに2倍以上に拡大すると見込まれています。

H3: 再生可能エネルギーのインバーター需要

太陽光発電・風力発電で発電した直流または交流を、電力系統に接続できる高品質な交流に変換するインバーターには高性能パワー半導体が必要です。政府の2030年再エネ比率36〜38%目標に向けた大規模な太陽光・洋上風力設備の導入が進む中、インバーター向けパワー半導体の需要も急増しています。

H3: データセンターの電力効率化

AIデータセンターは膨大な電力を消費するため、電力変換の効率（変換損失の低減）が重要な課題です。サーバーの電源ユニット・UPS（無停電電源装置）・電力分配システムにはパワー半導体が使われており、高効率なパワー半導体の採用でデータセンター全体の消費電力を削減できます。

H2: SiC・GaN：次世代パワー半導体の覇権争い

H3: シリコン（Si）の限界とSiCの登場

従来のパワー半導体はシリコン（Si）を材料としていましたが、シリコンには「高電圧・高温での動作に限界がある」という制約があります。特にEVのインバーターのような「高電圧・高電流・高温」の用途ではシリコンの性能が不足し、より高性能な材料が求められていました。

炭化ケイ素（SiC）はシリコンと比べて「高耐電圧・高耐熱・低損失」という優れた特性を持ちます。SiCパワー半導体を使うとEVの航続距離が伸び、充電時間が短縮し、インバーターを小型・軽量化できます。テスラがモデル3のインバーターにSiCを採用したことで産業界全体に注目が広まり、現在は欧州・韓国・中国の自動車メーカーも相次いでSiC採用を進めています。

H3: GaNの特性と応用

窒化ガリウム（GaN）はSiCと並ぶ次世代パワー半導体材料です。GaNの特長は「高周波動作が可能」「スイッチング速度が超高速」であり、急速充電器（65W〜200W GaN充電器）・データセンターの電源装置・5G基地局などで急速に採用が拡大しています。スマートフォン向け超小型・高効率GaN充電器はすでに消費者市場で普及しています。

H3: 日本企業のSiC競争力

ローム（6963）はSiCパワー半導体の生産規模・技術力で世界トップクラスの位置にあります。独自のSiCウェーハの内製化（SiCウェーハは最も重要な原材料）を進めており、コスト競争力と供給安定性で差別化しています。欧州の自動車大手（ボルボ・ステランティス等）への供給契約を多数獲得しており、EV普及の恩恵を最も直接的に受ける日本企業の一つです。

三菱電機（6503）はIGBT（絶縁ゲート型バイポーラトランジスタ）で産業用・鉄道用途に長年の実績があり、産業機器・鉄道・大型インバーター向けで高い競争力を持ちます。富士電機（6504）も産業用IGBT・パワーモジュールで国内外で高い評価を受けています。

H2: SiCウェーハ供給問題：ボトルネックへの対応

SiCパワー半導体の普及を阻む最大の課題が「SiCウェーハの供給不足」です。SiCの結晶を成長させるには特殊な製造プロセスが必要で、現状では需要に対して供給が追いついていない状況が続いています。主要なSiCウェーハメーカーはウォルフスピード（米国）・コヒラント・STマイクロエレクトロニクスなどですが、いずれも生産能力の急拡大に取り組んでいます。

ロームは岡山の崇高工場でのSiCウェーハ内製化に加え、崇高ウエハーズ（ウォルフスピードとの合弁）での調達も進めており、ウェーハ不足への対応を強化しています。住友電気工業（5802）もSiCウェーハの製造・販売に参入しており、日本のSiCサプライチェーンの充実が進んでいます。

H2: パワー半導体の製造装置・材料

パワー半導体の製造工程ではロジック半導体とは異なる製造装置・材料が使われます。SiCウェーハの研磨・洗浄・エピタキシャル成長・イオン注入・酸化などのプロセスそれぞれに専用装置が必要です。ディスコ（6146）はSiCウェーハのダイシング（切断）装置で高いシェアを持ちます。信越化学（4063）はSiCエピタキシャルウェーハ（SiCウェーハ上に薄い単結晶層を成長させたもの）の材料供給に参入しています。

H2: 中国メーカーの台頭とリスク

SiCパワー半導体分野でも中国メーカーが急速にキャッチアップしています。比亜迪（BYD）は自社EVに自社製SiCパワー半導体を搭載する方向で開発を進めており、中国の国策企業もSiC量産に大型投資を行っています。価格競争が激化した場合、日本・欧州メーカーの利益率が圧迫されるリスクがあります。ただし自動車向けSiCは安全性・信頼性への要求が極めて高く、実績のない中国メーカーが短期間で欧米・日本の自動車メーカーへの採用を勝ち取ることは難しいとも言われています。

H2: StockWaveJP編集部の見解

パワー半導体テーマを観察していると、EV関連ニュース（テスラ・BYDの販売台数・自動車メーカーのEV戦略）に加えて、再生可能エネルギーの政策動向（FIT価格・洋上風力入札）にも感応していることがわかります。どちらか一方のテーマに追い風が吹くだけでなく、EV・再エネ双方の需要拡大が同時に進むときにこのテーマのモメンタムが最も強くなる傾向があります。

また、ロームなどのSiCパワー半導体メーカーの株価は、欧州・米国の主要自動車メーカーとの大型サプライヤー契約が公表されるタイミングで急騰することが多く、その後にしばらく高値で安定するパターンも見られます。大型契約の情報は決算説明会・プレスリリースで公開されるため、IRニュースのチェックが特に有効なテーマと感じています。当編集部は「EV普及の長期トレンドに乗りながら、テーマのモメンタム状態と個別銘柄のIRニュースの両方を組み合わせる」アプローチを推奨しています。

H2: まとめと今後の展望

パワー半導体はEV・再エネ・AIデータセンターという三つの巨大成長市場の必須部品であり、2030年代にかけて構造的な需要拡大が続く分野です。SiC・GaNへの移行という技術的な転換期にあり、先行している企業が長期にわたって高い利益率を享受できる可能性があります。ローム・三菱電機・富士電機など日本のパワー半導体メーカーは技術力と実績において世界的な競争力を持っており、日本株投資においてEV・電力テーマの中核銘柄として位置づけられます。
`},{id:"nisa-popular-stocks",themes:["銀行・金融","高配当"],keywords:["NISA","人気銘柄","配当","長期投資"],category:"NISA",icon:"💰",date:"2026/03/24",title:"NISA人気銘柄の傾向分析：なぜ同じ銘柄に資金が集中するのか、その特徴と投資の考え方",summary:"2024年からの新NISA開始で個人投資家の裾野が急拡大しました。NISA口座で人気の銘柄の共通点と、その動向がテーマ投資にどう影響するかを解説します。",body:`
H2: NISA人気銘柄とは何か

NISA（少額投資非課税制度）は投資利益に対する税金（通常20.315%）が非課税になる制度です。2024年から新NISAに制度が大幅に拡充され（年間投資枠360万円・非課税保有期間無期限・非課税保有限度額1,800万円）、個人投資家の長期投資への関心が急速に高まりました。この制度改革を機に、証券会社のNISA口座でよく購入される「NISA人気銘柄」が注目を集めています。

H2: 2024〜2026年のNISA人気銘柄の傾向

H3: 高配当株への根強い人気

NISA口座で最も人気が高いカテゴリの一つが「高配当株」です。配当金がNISA口座内では非課税になるため、長期保有で配当を受け取る「配当再投資戦略」との相性が抜群です。

日本の高配当株として特に人気が高いのは三菱UFJフィナンシャル・グループ（8306）・三菱商事（8058）・日本たばこ産業（JT・2914）・NTT（9432）・KDDI（9433）などです。これらは「配当利回り3〜5%・業績安定・大型株」という条件を満たしており、長期の配当収入を目的とした個人投資家に支持されています。

H3: インデックスファンドとの組み合わせ

NISA口座の「つみたて投資枠（年120万円）」では、低コストのインデックスファンド（全世界株・S&P500・日経平均等に連動する投資信託）が圧倒的な人気を誇ります。成長投資枠（年240万円）では個別株・高配当ETF・テーマ型ファンドが選ばれています。

「つみたて枠でインデックスファンドを積み立て、成長投資枠で高配当株や成長株に投資する」という二段構えの戦略が多くの個人投資家に採用されています。

H3: 日本株に加わった外国人投資家の目線

新NISA導入で個人の日本株への関心が高まる中、外国人投資家も「日本株の個人買いへの期待」から日本株全体に注目を向けています。バフェットが日本の5大商社に投資して以降、「日本株は割安」という認識が世界で広まり、PBR改革・コーポレートガバナンス改善への期待と合わさって外国人投資家の日本株買いが続いています。

H2: なぜ同じ銘柄に資金が集中するのか

H3: 情報の非対称性と「人気の自己強化」

NISA人気銘柄では「SNSで話題になる→証券会社のランキングで上位になる→さらに注目が集まる→また話題になる」という自己強化サイクルが生まれています。個人投資家は情報収集のコストが高いため、「みんなが買っているから安心」という心理（ハーディング効果）が働きやすく、人気銘柄に資金が集中する傾向があります。

H3: 株主優待の魅力

日本株特有の制度である「株主優待」もNISA人気の要因の一つです。自社商品・食事券・QUOカード・施設割引券などを提供する企業は個人投資家に人気があります。イオン（8267）・オリックス（8591）・JR東日本（9020）・マクドナルド（2702）などは株主優待の内容が充実しており、長年にわたって個人投資家の人気ランキング上位に位置しています。

H3: 「分かりやすいビジネス」への集中

個人投資家が好む銘柄には「普段から馴染みのある企業・ブランド」という共通点があります。ファーストリテイリング（ユニクロ）・任天堂・ソニー・トヨタ自動車など、日常生活で身近に感じられる企業の株式は、業績分析に自信がなくても「よく知っている企業だから」という理由で購入されやすいです。

H2: NISA人気銘柄への投資の落とし穴

H3: 「人気」と「投資価値」は別物

多くの個人が買っているからといって、その銘柄が「今の株価で買うべき」とは限りません。すでに十分に株価が高くなっている場合、人気が集中することでさらに割高になるリスクがあります。JTは高配当で有名ですが、タバコ産業の長期的な需要減少という構造的な問題も存在します。「配当利回りが高い=買うべき」という単純な判断は、「高配当トラップ」に陥るリスクがあります。

H3: 集中投資リスク

NISA人気銘柄に資金が集中すると、逆に「一斉に売られる」リスクも高まります。多くの個人投資家が同じ銘柄を保有している場合、業績悪化や株価急落をきっかけに一斉売りが発生すると、通常より大きな下落となることがあります。

H2: NISA活用の賢い戦略

H3: 非課税のメリットを最大化する使い方

NISAは「利益に対する税金が非課税」という特典があります。これを最大化するには「高いリターンが期待できる資産クラスに長期投資する」ことが基本です。値動きの小さな債券・安定高配当株よりも、長期的に高い成長が期待できる株式を長期保有することでNISAのメリットを最大限活かせます。

H3: 「損切りしにくい」NISA口座の特性に注意

NISA口座は損益通算（利益と損失を相殺して課税対象を減らす）ができないため、損失が出た場合のデメリットが通常口座より大きくなります。「損切りしにくい心理」が生まれやすいため、NISA口座に入れる銘柄は「長期的に業績が成長し続ける確信度が高いもの」に絞ることが重要です。

H2: StockWaveJPとNISA投資の組み合わせ

StockWaveJPのテーマ分析はNISA投資においても活用できます。NISA口座で保有しているテーマに関連する銘柄のモメンタム変化を定期的に確認することで、「長期保有の前提が崩れていないか」を客観的に判断できます。例えば銀行・金融テーマが長期にわたって「全期間失速」を示している場合は、保有している高配当銀行株の長期見通しを見直す材料になります。

H2: StockWaveJP編集部の見解

NISA人気銘柄の動向を観察していると、「証券会社のNISA口座ランキングで上位に入る銘柄は、その後数ヶ月にわたって買いが続く」というパターンが見られます。個人投資家の購入が積み上がることで需給が改善し、短期的に株価が支えられる効果があります。

ただし当編集部が重要と考えるのは「人気銘柄だから買う」ではなく「テーマのモメンタムが強い局面で、その中の人気銘柄（流動性が高い）を選ぶ」というアプローチです。例えば銀行・金融テーマが日銀利上げを背景にモメンタム加速となっている局面で、三菱UFJなどのNISA人気銘柄に投資するのは「テーマの追い風と個別銘柄の人気の両方を活かせる」判断として合理的です。

H2: まとめと今後の展望

NISA制度の恒久化・非課税枠の拡充により、日本の個人投資家の長期投資への参加が本格化しています。高配当株・インデックスファンド・優待株への需要が構造的に拡大する中、日本株市場における個人投資家の存在感が高まっています。NISA人気銘柄の動向はテーマ株投資においても重要な参考情報となるため、StockWaveJPのテーマ分析と組み合わせた総合的な判断を心がけてください。

H2: 2024〜2026年のNISA口座の拡大状況

新NISA開始（2024年1月）以降、NISAの口座数と投資残高が急拡大しています。金融庁の統計では2024年度内にNISA口座数が2,000万口座を超え、2025年度には累計非課税投資残高が数十兆円規模に達する見通しです。この「個人マネーの大量流入」は日本株市場全体への需給サポートとなっており、NISAで購入される高配当株・インデックスETFへの継続的な需要が株価を下支えしています。

H2: NISAと日本株の長期展望

新NISAの「非課税保有期間無期限」という特性は、個人投資家の「長期保有志向」を強める効果があります。従来は「5年で非課税期間が終了するので利益確定する」という売り圧力がありましたが、新NISAではその必要がなくなりました。これにより個人投資家が「高配当株を長期保有し続ける」という行動が定着しやすくなり、日本株のバリュエーション改善・株主還元強化の好循環が続くと予想されます。

H2: まとめ

NISA人気銘柄への投資は「人気があるから買う」のではなく「なぜ人気なのかの本質（高配当の持続性・連続増配の実績・業績の安定性）」を確認した上で判断することが重要です。StockWaveJPのテーマ分析と組み合わせて「テーマの追い風がある局面での高配当株への投資」という複合アプローチを活用してください。

H2: StockWaveJP活用の実践ポイント

NISA人気銘柄への投資においてStockWaveJPを活用するなら、「銀行・金融・通信テーマのモメンタムが加速している局面で、そのテーマ内の人気銘柄に投資する」というアプローチが有効です。テーマの追い風と個人投資家の安定的な買いが重なる局面は、短期・中期ともに株価が上昇しやすい環境です。

H2: まとめと今後の展望

NISA制度の恒久化・非課税枠の大幅拡充は日本の個人投資家の長期投資促進において歴史的な転換点です。高配当株・連続増配株・インデックスETFへの継続的な資金流入が日本株市場の底堅さを支えるというテーマは、今後10〜20年にわたって重要な投資ストーリーとして機能し続けます。
`},{id:"optical-communication",themes:["光通信","IOWN","通信"],keywords:["光通信","光ファイバー","データセンター","AI","フォトニクス"],category:"光通信",icon:"💡",date:"2026/03/23",title:"光通信テーマ：AI・データセンター需要急増が生む光ファイバー・光部品市場の構造的拡大",summary:"生成AIの普及でデータ通信量が爆発的に増加しています。光ファイバー・光トランシーバー・光半導体など光通信インフラの需要急増と日本企業の強みを解説します。",body:`
H2: 光通信テーマとは

光通信テーマは、光ファイバーケーブル・光トランシーバー・光増幅器・光スイッチ・フォトニクスデバイスなど、光を利用した通信インフラ・部品を製造・販売する企業を対象とした投資テーマです。ChatGPT登場以降の生成AIブームによりデータセンターでの大規模な演算処理需要が爆発的に増加し、その通信バックボーンとなる光通信インフラへの需要も急拡大しています。2024〜2026年は光通信テーマにとって「歴史的な需要ブーム」の時期に当たります。

H2: なぜ今、光通信テーマが注目されるのか

H3: AIとデータセンターが生む光通信需要

AIの学習・推論には膨大な計算能力が必要で、多数のGPU（グラフィックプロセッサ）を並列接続した大型データセンターが世界中で建設・拡張されています。このGPU間のデータ転送・データセンター間の通信には高速・大容量の光通信インフラが不可欠です。

エヌビディアのGPUクラスター（H100・B200等）では、GPU間を接続するNVLinkやInfiniBandとともに、データセンター外部との通信には400G・800Gbpsという超高速光トランシーバーが大量に使われます。マイクロソフト・グーグル・アマゾン・メタなどのハイパースケーラー（超大型クラウド企業）が競って大型データセンターを建設しており、光通信部品の需要が急増しています。

H3: 日本企業の競争力

光通信部品・デバイスの分野では日本企業が世界市場で高い競争力を持ちます。住友電気工業（5802）は光ファイバー・光ケーブルで世界最大手の一角であり、データセンター向け光ファイバーの需要急増で恩恵を受けています。古河電気工業（5801）も光ファイバー・光ケーブルで世界的なプレイヤーです。

半導体レーザー（光トランシーバーに使われる光源）では浜松ホトニクス（6965）が世界首位の技術力を誇り、科学・医療・産業用の光デバイスで圧倒的な存在感を示しています。光増幅器・光フィルタなどの光部品ではShin-Etsuケミカルのグループ企業や京セラ（6971）も関連します。

H2: 光通信技術の進化：400G・800Gから1.6Tへ

データセンター内の通信速度は急速に進化しています。2020〜2022年が100G（毎秒100ギガビット）の普及期だったのに対し、2023〜2024年には400G・800Gが標準化され、2025〜2026年には1.6T（毎秒1.6テラビット）への移行が始まっています。

通信速度が上がるほど光トランシーバー1個あたりの単価が高くなるため、量だけでなく単価の上昇も光通信部品メーカーの売上を押し上げます。また高速通信には高品質な光ファイバー・精度の高い光部品が必要なため、日本企業の高品質製品へのプレミアムが高まります。

H2: NTTのIOWN構想と光電融合技術

NTTは2030年代を見据えた次世代通信インフラ「IOWN（Innovative Optical and Wireless Network）」構想を推進しています。IOWNは光技術（フォトニクス）を活用し、現在の電気信号による通信と比べて消費電力を約100分の1に削減しながら通信速度・容量を大幅に向上させる革新的な技術です。

特に注目されるのが「光電融合デバイス」です。従来は電気信号と光信号の変換に多くのエネルギーロスが発生していましたが、光電融合デバイスはこの変換を最小限にすることでデータセンター全体の消費電力を大幅に削減できます。AI学習に使う大型データセンターの電力消費問題（電力不足・CO2排出）の解決策として世界から注目されています。

H2: 海底ケーブルとグローバル通信インフラ

光通信テーマはデータセンター向けだけでなく、海底ケーブル（海を横断する光ファイバー通信網）の分野でも成長が続いています。グーグル・アマゾン・メタなどのハイパースケーラーが自社専用の海底ケーブル敷設を積極的に進めており、通信会社向けだけだった海底ケーブル市場が大きく変化しています。

日本では日本電気（NEC・6701）が海底ケーブルシステムの設計・建設で世界トップクラスの実績を持ちます。NECは太平洋・大西洋・インド洋にわたる多数の海底ケーブルプロジェクトに参画しており、AI時代のデータ通信インフラ整備の恩恵を受けています。

H2: 主要関連銘柄の詳細

住友電気工業（5802）は光ファイバーの原材料となるガラス母材から光ファイバー・光ケーブルの製造まで垂直統合しており、コスト競争力と安定供給能力が強みです。同社の光ファイバー事業はAI・データセンター需要急増を背景に過去最高水準の受注を記録しています。

浜松ホトニクス（6965）は半導体レーザー・フォトディテクター（光検出器）・イメージセンサーなど高精度光電子デバイスで世界最高水準の技術力を持ちます。医療用・科学計測用に加え、通信向け光デバイスでも重要なサプライヤーです。レーザーの出力・精度で他社の追随を許さない技術的護城河（ウォーモート）が評価されています。

古河電気工業（5801）は光ファイバー・光部品に加え、自動車向けワイヤーハーネス・熱管理材料でも高い競争力を持ちます。光通信テーマとEV・自動車テーマ双方の恩恵を受けられる複合素材メーカーです。

H2: 光通信テーマの課題とリスク

H3: 需要の集中リスク

現在の光通信需要の多くはハイパースケーラー（GAFAM等）の大型データセンター建設に集中しています。これらの企業が設備投資計画を縮小・延期した場合、光通信部品の需要が急減するリスクがあります。2023年にはメタが一時的に設備投資を絞ったことで、光通信関連株が大きく下落した事例があります。

H3: 中国メーカーとの価格競争

光トランシーバー分野では中国の新興メーカー（インノライト・グループなど）が低価格製品を展開しており、汎用品での価格競争が激化しています。高付加価値・高速製品（800G・1.6T）での技術的優位を維持できるかが日本企業の競争力を左右します。

H2: StockWaveJP編集部の見解

光通信テーマをデータで観察していると、AI・データセンター関連のニュース（エヌビディア決算・ハイパースケーラーの設備投資計画）に対して特に敏感に反応することが確認されます。エヌビディアが「次世代GPUの出荷加速」を発表した際に光通信テーマの出来高が急増するパターンは、光部品がAIインフラの「必須部品」として位置づけられていることを示しています。

当編集部が注目しているのは「半導体テーマの動向と光通信テーマの連動性」です。半導体テーマが加速モメンタムにある時期は、光通信テーマも同時に強くなる傾向があります。逆に半導体が調整局面に入ると光通信も同様に調整することが多いです。この連動性を理解した上で、「半導体テーマが強い局面で光通信テーマにも注目する」という戦略が有効と考えています。

また、NTTのIOWN構想は長期的に日本の光通信産業全体を押し上げる可能性のある大型国家プロジェクトです。実用化・商用化のスケジュールや技術実証の進捗が具体化するたびに光通信関連株がポジティブに反応するパターンを今後も注視しています。

H2: まとめと今後の展望

光通信テーマはAI時代のデータセンター建設ラッシュという「今この瞬間の強い追い風」と、IOWNに代表される「次世代光電融合技術」という中長期の成長ストーリーを併せ持つ投資テーマです。住友電工・浜松ホトニクス・古河電工・NECなど、グローバルな競争力を持つ日本企業が多い点も魅力です。

短期的には「ハイパースケーラーの設備投資計画の変更」という需要集中リスクを常に意識しながら、中長期では「AI時代の必須インフラ」として光通信インフラへの投資拡大が継続するという構造的な成長トレンドを信頼することが、このテーマへの投資判断の軸となります。
`},{id:"national-resilience",themes:["国土強靭化計画","建設・インフラ","防衛・航空"],keywords:["国土強靭化計画","インフラ","建設","防災","土木"],category:"国土強靭化計画",icon:"🏗️",date:"2026/03/22",title:"国土強靭化計画：政府の大型インフラ投資が生む建設・土木・防災テーマの長期成長機会",summary:"頻発する自然災害と老朽化インフラ対策として政府が推進する国土強靭化計画。10年以上にわたる大型公共投資が建設・土木・防災関連企業にもたらす追い風を解説します。",body:`
H2: 国土強靭化計画とは何か

国土強靭化（ナショナル・レジリエンス）計画は、大規模自然災害・インフラ老朽化・有事に対応するため国土の社会インフラを強化・更新する政府の長期計画です。2013年制定の「国土強靭化基本法」に基づき、道路・橋梁・河川堤防・下水道・港湾・学校施設などの老朽化対策と耐震化が継続されています。

2021年からは「防災・減災、国土強靭化のための5か年加速化対策」として5年間で約15兆円規模の集中投資が行われました。この計画は2025年度で終了しましたが、インフラ老朽化問題は根本的には解消されておらず、次期計画として継続的な大型投資が見込まれています。

H2: なぜ今、インフラ更新が急務なのか

H3: 高度経済成長期のインフラが一斉に老朽化

日本の社会インフラの多くは1960〜1980年代の高度経済成長期に集中的に整備されました。道路橋は全国に約70万橋存在しますが、そのうち建設から50年以上を経過したものは2033年時点で約6割に達すると推計されています。トンネル・下水道管・上水道施設も同様に更新時期を迎えており、今後20〜30年間にわたって大規模な更新・補修投資が必要とされています。

H3: 気候変動による自然災害の激甚化

近年の気候変動により、台風・豪雨・洪水・土砂崩れなどの自然災害が「観測史上最大」を更新するケースが増えています。2024年の能登半島地震では道路・港湾・上下水道インフラの脆弱さが改めて露呈し、防災インフラへの追加投資が政策的に強化されています。また豪雨による河川氾濫が毎年のように発生しており、堤防強化・遊水地整備への需要が高まっています。

H3: 防衛費増額との連動

2022年以降の防衛費増額（2023〜2027年で43兆円）に伴い、有事における重要インフラの防護・代替ルート確保が安全保障政策の重要テーマになっています。港湾・空港・電力・通信インフラの強靭化が防衛・国土強靭化の双方から予算配分されており、「防衛+国土強靭化」の複合需要が建設・土木業界への発注増につながっています。

H2: 恩恵を受ける企業と業種の詳細

H3: スーパーゼネコン4社

大成建設（1801）・鹿島建設（1812）・清水建設（1803）・大林組（1802）は公共工事と民間工事を高いバランスで受注できる総合建設企業です。国土強靭化の公共工事に加え、半導体工場・データセンター・洋上風力などの民間大型案件も受注が拡大しており、受注残が過去最高水準にあります。受注残は「今後数年分の仕事が確定している」ことを意味するため、業績の先行指標として重要です。

H3: 専業・中堅ゼネコン

橋梁・トンネル・護岸・港湾など特定インフラに特化した専業建設会社も恩恵を受けています。川田工業（9055）は橋梁鉄骨で国内首位、東洋建設（1890）・五洋建設（1893）は海洋土木で高い技術力を持ちます。地方の道路・河川工事を担う地場ゼネコンも安定した受注が続いています。

H3: 建設コンサルタントとICT点検企業

インフラの老朽化対応では「点検・診断・補修」のメンテナンス市場が急成長しています。建設技術研究所（9621）・日本工営（9567）・パシフィックコンサルタンツ（非上場）などの建設コンサルタントは、政府のインフラ整備計画策定から個別設計・監理まで一貫して関与します。ドローンによる橋梁・トンネルのAI画像診断・IoTセンサーによる構造物モニタリングを提供するIT系企業にも投資機会があります。

H3: 建設資材メーカー

建設工事の拡大は鉄鋼（日本製鉄・JFEホールディングス）・セメント（太平洋セメント・住友大阪セメント）・生コンクリート・砂利・砂などの建設資材需要を高めます。特に橋梁・護岸に使われる鉄骨・H形鋼や、トンネル工事に使われるセグメント（コンクリートブロック）の需要増が見込まれます。

H2: 建設業界が抱える構造的課題

H3: 資材・人件費の高騰

ロシアのウクライナ侵攻以降の原材料高・円安による輸入コスト上昇・エネルギーコスト増加により、建設資材価格が大幅に上昇しました。鉄鋼・セメント・木材の価格高騰が工事費全体を押し上げており、受注時の採算と実際の工事費の乖離が問題になっています。

H3: 技能労働者の深刻な不足

2024年4月から適用された建設業の時間外労働規制（年960時間上限）により、工期延長・人件費上昇が避けられない状況です。大工・左官・型枠大工・鉄筋工・溶接工などの技能労働者は高齢化が進んでおり、若手の入職者が少ない構造的な人手不足が続いています。

これに対応するため、BIM（建築情報モデリング）・プレファブ化（工場での部材製作・現場組立）・ロボット施工（鉄筋配置ロボット・溶接ロボット・コンクリート打設ロボット）の導入が大手ゼネコンを中心に加速しています。

H2: 国土強靭化予算のサイクルと株価への影響

国土強靭化関連の予算は毎年度の政府予算案と補正予算で決まります。特に補正予算が大型化する局面（大規模自然災害発生後・政治的な景気対策が行われるとき）では、建設・土木テーマの株価が大きく反応することがあります。

また、年度末（3月）前後は工事の完工検査・引渡しが集中するため建設各社の売上・利益が確定しやすく、好決算が続くことが多いです。建設・インフラテーマへの投資においては、この季節性を意識したタイミング管理も有効です。

H2: デジタルインフラとの融合

国土強靭化は物理的なインフラだけでなく「デジタルインフラの強靭化」も含まれています。電力・ガス・水道・通信などの重要インフラへのサイバー攻撃対策、BCP（事業継続計画）の強化、スマートシティ化によるインフラ管理の効率化なども国土強靭化の重要テーマです。これにより建設・土木テーマとサイバーセキュリティ・スマートシティ関連企業の連携・受注が増えています。

H2: StockWaveJP編集部の見解

国土強靭化テーマを観察していると、大規模自然災害（台風・豪雨・地震）が発生した後に建設・インフラ関連の出来高が急増するパターンが繰り返されています。これは「復旧工事への期待から建設株が買われる」という短期的な反応ですが、実際に補正予算が成立するまでには数ヶ月かかるため、急騰後に一度調整が入り、補正予算の具体化とともに再び上昇するという「二段上げ」のパターンも見られます。

また、このテーマの特徴として「業績が安定的に良い反面、株価のバリュエーション（PER・PBR）は割安なまま放置されやすい」という面があります。成長性が高くない代わりに安定性は高く、景気後退局面でも公共工事があるため業績が底を打ちやすいディフェンシブな特性があります。当編集部は国土強靭化テーマを「高成長は期待できないが、受注残が豊富で業績が安定している時期にバリュー投資的な視点で保有する」ポジションとして捉えています。

H2: まとめと今後の展望

国土強靭化テーマは日本特有の「インフラ老朽化問題＋気候変動リスク＋防衛強化」という三つの構造的需要に支えられており、5か年計画が終了した後も継続的な投資が見込まれます。スーパーゼネコン4社を中心に受注残が高水準にある現状は、数年間の業績安定を示しています。リスクとしては資材・人件費の高騰による採算圧迫と、財政緊縮が強まった場合の予算削減があります。StockWaveJPのテーマ別詳細で各ゼネコンの相対パフォーマンスを定期的に確認し、補正予算・自然災害ニュースとの照合を続けることが有効な投資管理法です。
`},{id:"iraq-geopolitics",themes:["防衛・航空","石油","LNG","レアアース・資源"],keywords:["イラク","中東","地政学","石油","原油"],category:"イラク",icon:"🌍",date:"2026/03/28",title:"中東情勢とイラク：2026年現在の地政学的状況が日本株市場に与える影響を徹底分析",summary:"イラクを巡る中東情勢は原油価格・地政学リスクを通じて日本株市場にも影響を与えます。2026年時点での最新情勢と今後想定されるシナリオを詳しく解説します。",body:`
H2: 2026年現在のイラクとアメリカ・周辺諸国の軍事衝突

2026年、中東は歴史的な緊張の高まりを迎えています。イラクを中心とした地域では、イラク国内の親イラン武装組織（人民動員隊：PMF）と米軍・米国主導の多国籍軍との間で断続的な軍事衝突が続いています。この衝突はイラク単独の問題ではなく、イランの地域覇権拡大とアメリカの中東関与の縮小という大きな地政学的変化の中に位置づけられます。

イラクのシーア派主導の政府は表向き「中立」を標榜しながらも、国内に駐留するPMF（親イラン武装組織）の活動を完全にコントロールできていない状態が続いています。この「ダブルスタンダード」がアメリカとの外交的緊張を生み、時に直接的な軍事衝突のきっかけとなっています。

H2: ホルムズ海峡封鎖と原油価格への影響

2026年の最大のリスクとして市場が注目しているのが「ホルムズ海峡の封鎖・通航制限」です。ホルムズ海峡はペルシャ湾の出口に位置し、世界の原油・LNG輸送量の約20〜30%がこの海峡を通過します。1日あたり約1,700万バレルの石油がホルムズ海峡を通過しており、これが制限されると世界のエネルギー市場に壊滅的な影響を与えます。

現在、イラン支援の武装組織やイラク国内の過激派がホルムズ海峡周辺でのタンカーへの攻撃・嫌がらせを繰り返しています。実際の封鎖には至っていないものの、通航の安全性への懸念から輸送コスト（タンカー保険料・リスクプレミアム）が上昇しており、これが原油価格の上昇要因の一つとなっています。

原油価格は2026年時点で1バレル90〜110ドル程度の高水準で推移しており、ホルムズ海峡への攻撃情報が流れるたびに数ドル単位の急騰が起きています。完全封鎖となれば150ドル超という試算もあり、世界経済へのインパクトは計り知れません。

H2: 日本への直接的な影響

日本はエネルギーの大部分を中東からの原油・LNGに依存しています。日本が輸入する原油の約90%は中東からであり、そのうちサウジアラビア・UAE・クウェート・イラク・イランなどが主要な供給国です。ほぼすべてがホルムズ海峡を経由して運ばれます。

原油高の日本経済への影響は多岐にわたります。まずエネルギーコストの上昇です。電力・ガス料金の値上がりが家計・企業の負担を増加させます。次に輸入物価の上昇によるインフレ加速です。原油は製造業の原材料コストにも直結し、幅広い製品・サービスの価格上昇要因となります。さらに貿易赤字の拡大です。原油高は日本のエネルギー輸入額を押し上げ、貿易赤字が拡大します。これが円安圧力につながります。

一方で円安はトヨタ・ソニー・任天堂などの輸出企業の業績を押し上げます。2024〜2026年にかけての円安・原油高は、輸出企業にとっては追い風となっている面もあります。

H2: 中東情勢が日本株の各テーマに与える影響

原油高・中東緊張が各テーマに与える影響を具体的に見てみましょう。

エネルギー関連テーマ（プラス影響）：ENEOS・出光興産・コスモエネルギーなどの石油元売り企業は原油高で在庫評価益が拡大し、業績が改善します。石油開発企業（INPEXなど）も原油高で採掘の採算性が高まります。

防衛・宇宙テーマ（プラス影響）：中東情勢の緊張は防衛関連株全体への資金流入を促します。地政学リスクの高まりは防衛費増額の正当性を高め、三菱重工業・川崎重工業・IHIへの長期受注期待が高まります。

輸送・物流テーマ（マイナス影響）：航空・海運・陸運はエネルギーコスト増大の直撃を受けます。ただし海運（日本郵船・商船三井・川崎汽船）は原油高による輸送需要増と運賃上昇でプラスに転じるケースもあります。

製造業全般（マイナス影響）：原材料コスト増大が利益率を圧迫します。特に素材・化学・食品など原料に依存する業種への影響が大きいです。

消費・小売テーマ（マイナス影響）：エネルギー・食品価格の上昇による家計の購買力低下が消費を抑制し、小売・外食の売上に影響します。

H2: 今後想定される5つのシナリオ

H3: シナリオ①：現状維持・低烈度の衝突継続（確率35%）

イラク国内での散発的な攻撃は続くが、大規模衝突には発展しない。ホルムズ海峡は実質的に通航可能な状態を維持。原油価格は85〜100ドルのレンジで推移。日本株への影響は限定的で、エネルギー・防衛株の底堅さが継続。

H3: シナリオ②：ホルムズ海峡の部分的封鎖・通航制限（確率25%）

イラン支援の武装組織が積極的なタンカー攻撃を展開し、事実上の通航制限状態となる。原油価格は110〜130ドルに急騰。米軍の海峡護衛強化・有志連合の再組織化が検討される。日本ではエネルギー価格の急騰・貿易赤字の大幅拡大・円安加速・株式市場全般の下落（特にバリュー系を除く）。防衛・エネルギー株に資金が集中。

H3: シナリオ③：米軍とイラク・PMFの本格衝突拡大（確率20%）

米軍がPMFの拠点への大規模空爆を実施。イラン・シリアにも飛び火し、中東全域に緊張が広がる。原油価格は130〜150ドルに急騰。世界的な景気後退懸念が高まり株式市場は大幅下落。ただし防衛・エネルギー株は逆行高の可能性。日本では円安が加速し輸出企業は業績改善、エネルギー輸入コスト急増で内需企業は苦境。

H3: シナリオ④：中東緊張の段階的緩和（確率15%）

米国とイランの間接交渉が前進し、核合意の枠組み内での緊張緩和が実現。ホルムズ海峡の安全が確保され、原油価格は70〜80ドルに低下。日本ではエネルギーコストの低下・インフレ鈍化・個人消費回復。株式市場は全般的に好感し、内需関連株が強くなる。防衛・エネルギー株は調整。

H3: シナリオ⑤：地域的な全面戦争に発展（確率5%）

最悪のシナリオとして、イスラエルとイランの直接軍事衝突、サウジアラビアへの攻撃などが同時多発的に起きる可能性。原油供給が大規模に混乱し、価格が150ドルを超える可能性。世界的な深刻な景気後退が現実味を帯び、株式市場は全面的な暴落リスク。日本は非軍事国として直接的な軍事リスクは低いが、エネルギー危機・円安急進・輸入インフレが経済を直撃。

H2: 投資家として中東情勢に備える方法

中東情勢は複雑で予測が難しいですが、投資家として以下のアプローチが有効です。

エネルギー株でヘッジする：ポートフォリオの一部をエネルギー関連株（ENEOS・INPEX等）で保有することで、原油高リスクへのヘッジになります。原油高の時は一般的に株式市場全体にはマイナスですが、エネルギー株は逆方向に動きます。

防衛株の保有：防衛関連株は地政学リスク上昇時に逆行高する傾向があります。テーマ全体の動向はStockWaveJPの防衛・宇宙テーマで確認できます。

過度な集中投資を避ける：中東情勢は予測が難しいため、1つのシナリオに賭けた集中投資は危険です。複数のシナリオに対応できる分散ポートフォリオが重要です。

VIX指数を監視する：StockWaveJPのマクロ指標に含まれる「市場ボラティリティ指標（VIXY）」は、市場の恐怖度を示します。この指標が急上昇した場合、地政学リスクが市場に織り込まれているサインと判断できます。

H2: まとめ：原油価格は世界経済の体温計

イラクを中心とした中東情勢と原油価格の動向は、日本の個人投資家にとっても他人事ではありません。日常生活のガソリン・電気・食品価格に直結し、保有する株式の価値にも影響します。「中東は遠い話」と思わず、原油価格の動向を定期的にウォッチすることが、現代の投資家に求められるリテラシーの一つです。

StockWaveJPでは毎日の自動更新データを通じて、エネルギー・防衛・輸送テーマの動向変化をリアルタイムで確認できます。中東情勢が動いた時に「どのテーマが反応しているか」を素早く把握するツールとしてご活用ください。
    
H2: 原油価格と日本経済・日本株への影響

中東地政学リスクは原油価格を通じて日本経済に直接影響します。日本は原油消費量のほぼ全量を輸入に依存しており、原油価格の上昇は「輸入コストの増加→貿易赤字の拡大→円安圧力→企業コスト増加」という連鎖をもたらします。一方で商社（石油権益保有）・石油元売り（ENEOSホールディングス・出光興産）・一部の資源関連企業には原油高が追い風となります。

StockWaveJPで資源・エネルギーテーマの出来高急増を中東ニュースと照合することで、原油価格変動のシグナルを早期に把握することができます。

H2: まとめ

中東・イラクを巡る地政学的状況は日本株投資において常に意識すべきリスク要因です。原油価格・為替・株式市場の「地政学リスクプレミアム」を定期的に評価し、StockWaveJPのテーマデータと組み合わせることで、地政学的な変化が日本株テーマへ与える影響を先読みする投資判断が可能になります。
`},{id:"renewable-energy-theme",category:"再生可能エネルギー",icon:"🌱",title:"再生可能エネルギーテーマ徹底解説：脱炭素政策が生む長期成長と主要銘柄・投資機会",date:"2026/04/04",themes:["再生可能エネルギー","太陽光発電","脱炭素・ESG","蓄電池"],keywords:["再生可能エネルギー","太陽光","風力","脱炭素","洋上風力","FIT","GX","ESG","電力"],summary:"政府のGX（グリーントランスフォーメーション）政策と2050年カーボンニュートラル目標を背景に、再生可能エネルギーテーマは長期的な成長が見込まれます。太陽光・洋上風力・水素など分野ごとの動向と国内主要銘柄の関係性を詳しく解説します。",body:`
H2: 再生可能エネルギーテーマとは

再生可能エネルギーテーマとは、太陽光発電・風力発電・水力発電・地熱・バイオマスなど、自然の力を利用して繰り返し利用できるエネルギー源に関連する企業群を対象とした投資テーマです。日本政府は2050年のカーボンニュートラル（温室効果ガス排出実質ゼロ）を宣言し、その実現に向けて大規模な政策支援と投資が動いています。

世界的な脱炭素の潮流に加え、ロシアによるウクライナ侵攻以降、エネルギー安全保障の観点から国産エネルギー源としての再エネへの関心がさらに高まっています。電気代の高騰・化石燃料への依存低減・CO2削減目標達成という三つの要請が重なり、再生可能エネルギー分野は構造的な追い風を受け続けています。

H2: 日本の再生可能エネルギー政策とGX

日本政府は2022年から「GX（グリーントランスフォーメーション）」政策を本格化させています。2023年に成立したGX推進法・GX脱炭素電源法のもと、今後10年間で官民合わせて150兆円規模の投資を実現する計画が示されました。

GX経済移行債（いわゆるグリーン国債）の発行により、再エネ導入・省エネ・水素・アンモニア・CCS（二酸化炭素回収・貯留）などの分野に公的資金が投入されます。特に2030年の電源構成目標として再エネ比率36〜38%（現状約22%）の達成が掲げられており、太陽光・洋上風力を中心に急速な拡大が見込まれます。

FIT（固定価格買取制度）からFIP（フィードインプレミアム）制度への移行により、再エネ事業者には市場価格に応じた動的なプレミアムが付与されるようになり、より市場原理に沿った再エネ拡大が進みます。

H2: 太陽光発電分野の動向と関連銘柄

太陽光発電は日本で最も普及が進んでいる再エネ源です。住宅用・産業用・大規模発電所（メガソーラー）の三つのセグメントで成長が続いています。

レノバ（9519）は大規模太陽光・洋上風力事業を展開する再エネ開発会社で、国内再エネ開発の先駆的存在です。SBエナジー（ソフトバンクグループ系）は各地でメガソーラー開発を展開しています。太陽光パネルのEPC（設計・調達・建設）や保守管理（O&M）を手掛けるウエスト・ホールディングス（1407）は住宅用太陽光の施工から保守まで一括で対応し、ストック型のビジネスモデルで収益安定性を高めています。

パワーコンディショナー（PCS・電力変換装置）分野では、東芝インフラシステムズ・富士電機（6504）・安川電機（6506）が国内大手として存在感を持ちます。太陽光パネルそのものは中国メーカーが圧倒的シェアを持ちますが、パワコンや計測・制御装置では日本メーカーが競争力を維持しています。

H2: 洋上風力発電：日本の次世代再エネ柱

日本では陸上風力の適地が限られるため、洋上風力発電が次の大型再エネ源として位置づけられています。2020年に施行された「再エネ海域利用法」に基づき、国が指定する「促進区域」での大規模洋上風力開発が進んでいます。

2040年までに最大4,500万kW（原発45基分相当）の洋上風力導入を目指す国家目標が示されており、東北沖・北陸沖・九州沖での大型プロジェクトが順次立ち上がっています。

関連銘柄として、日本製鉄（5401）・大和ハウス工業（1925）・東洋建設（1890）・五洋建設（1893）などが洋上風力の基礎工事・設置工事に参入しています。タワー（支柱）製造では岡野バルブ製造・新日本無線（現ルネサスグループ）が注目されます。モノパイル（洋上風力の基礎）の鋼管製造では日鉄鋼板が参入検討中です。

三菱重工業（7011）・日立製作所（6501）は欧州大手と組んでブレードや発電機の国産化を進めており、洋上風力サプライチェーン形成の中核企業として期待されます。

H2: 水素・アンモニア：次世代エネルギーへの期待

再生可能エネルギーテーマと並走する形で、水素・アンモニアを使った脱炭素エネルギーシステムへの注目も急速に高まっています。再エネ電力を使って水素を製造し、エネルギーとして貯蔵・利用するグリーン水素は、電力の需給調整や長期エネルギー貯蔵の切り札として期待されています。

岩谷産業（8088）は国内水素インフラの最大手で、液化水素の製造・輸送・販売を長年手掛けており、水素ステーションの整備でも先行しています。エア・ウォーター（4088）は産業ガス大手として水素供給事業に参入しています。

発電分野では、アンモニアを既存の石炭火力発電所に混焼することで大幅にCO2排出を削減する「アンモニア混焼」の実証が進んでおり、JERA（東京電力と中部電力の合弁会社）・電源開発（9513）が主導しています。三菱商事（8058）はアジア向けのLNG・水素・アンモニアのサプライチェーン構築で先行しています。

H2: 蓄電池・スマートグリッド：再エネ普及の基盤技術

再エネが拡大するにつれて、天気や時間帯に左右される電力供給の不安定さを補う「蓄電池」と「スマートグリッド（次世代電力網）」の重要性が増しています。

蓄電池では村田製作所（6981）・パナソニックホールディングス（6752）が家庭用・産業用の蓄電システムに積極投資しています。住友電気工業（5802）はレドックスフロー電池（大型蓄電システム）で実証を進めており、大規模再エネ導入後の系統安定化に貢献が期待されます。

スマートグリッド分野では、日立製作所・東芝（6502）・富士通（6702）が電力需給管理システム・AIを活用した電力最適化ソフトウェアを展開し、電力会社向けのシステムインテグレーションで存在感を示しています。

H2: 再生可能エネルギーテーマの上昇因子と下落因子

上昇因子としては第一に政府のGX政策の進展が挙げられます。GX移行債の発行・補助金・税制優遇など具体的な政策が動くたびに株価への好影響が出やすくなります。第二に電気代・燃料費の高騰です。化石燃料コストが上がるほど再エネの経済的な優位性が高まり、導入を急ぐ動きが広がります。第三に欧米の再エネ拡大政策との連動です。米国IRA（インフレ抑制法）・EU欧州グリーンディール等の政策が日本企業のグローバル需要を後押しします。

下落因子としては、FIT買取価格の引き下げリスクがあります。政府がFIT単価を下げると再エネ事業の収益性が悪化します。また許認可・環境アセスメントの遅延も開発コスト増につながります。中国メーカーの低価格攻勢も太陽光パネル市場での日本企業の競争力を削ぐ要因です。

H2: 投資家が注目すべきポイントと中長期の展望

短期的には、洋上風力の促進区域指定・入札スケジュール・GX移行債の具体的な使途発表といったニュースに株価が反応しやすい傾向があります。中長期的には2030年の電源構成目標達成に向けた大型投資が続くため、設備メーカー・EPC企業・電力インフラ企業への継続的な需要が見込まれます。

StockWaveJPでは「再生可能エネルギー」テーマの騰落率・出来高・売買代金・モメンタム状態を随時確認できます。政策イベントのタイミングで出来高が急増するケースが多く、そのシグナルをテーマヒートマップや騰落モメンタムで早期に捉えることが、このテーマの投資タイミングをつかむ上で非常に有効です。

2030年代にかけて、再生可能エネルギーは日本の産業構造を変える可能性を持つテーマです。電力セクター・重工業・素材・電機の各分野を横断する広がりがあり、長期投資・テーマ分散投資の観点からもポートフォリオに組み入れる価値は十分にあると考えられます。
    
H2: 蓄電池と電力システムの変革

再生可能エネルギーの大量導入に伴い「電力の貯め置き（蓄電）」の重要性が増しています。太陽光・風力の発電量は天候に左右されるため、電力系統に安定的に供給するには大型蓄電システムが不可欠です。住友電気工業が開発する「レドックスフロー電池」・パナソニックHDの「リチウムイオン系蓄電システム」・三菱電機の「系統向け蓄電システム」などが大型案件の受注を積み上げています。また電力需給の最適化にAI・IoTを活用する「スマートグリッド」技術も急速に進化しています。

H2: まとめ

再生可能エネルギーテーマは「脱炭素政策」「洋上風力の大型導入」「太陽光の価格競争力向上」「蓄電システムの普及」という四つの成長ドライバーを持つ長期投資テーマです。政府のFIT価格発表・洋上風力の入札結果・大型蓄電案件の受注発表というカタリストをStockWaveJPの出来高データと照合することで、このテーマへの効果的な投資タイミング管理が可能です。
`},{id:"game-entertainment-theme",category:"ゲーム・エンタメ",icon:"🎮",title:"ゲーム・エンタメテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["ゲーム・エンタメ"],keywords:["ゲーム","エンタメ","任天堂","コナミ","eスポーツ"],summary:"日本のゲーム・エンタメ産業は世界的なコンテンツ競争力を持ちます。スマホゲームの成長、IP活用、eスポーツへの展開と主要銘柄の動向を解説します。",body:`
H2: ゲーム・エンタメテーマとは

ゲーム・エンタメテーマは家庭用ゲーム機・スマートフォン・PC・アーケードゲームの開発・販売企業、アニメ・映画・音楽などのエンタメコンテンツ関連企業、eスポーツ・メタバース関連企業を対象とした投資テーマです。日本はゲーム・アニメ・マンガにおいて世界有数のコンテンツ大国であり、北米・欧州・アジアへのグローバル展開が収益を大きく左右します。2025年にはNintendo Switch 2の発売もあり、国内外から大きな注目を集めています。

H2: 日本ゲーム産業の歴史的優位性とIPビジネス

H3: 世界に誇る日本のIPポートフォリオ

日本のゲーム・エンタメ産業の最大の強みは「IP（知的財産）の厚さ」です。任天堂の「マリオ」「ゼルダの伝説」「ポケモン」、バンダイナムコの「機動戦士ガンダム」「テイルズ」、カプコンの「モンスターハンター」「バイオハザード」「ストリートファイター」、スクウェア・エニックスの「ファイナルファンタジー」「ドラゴンクエスト」など、数十年にわたって愛されるIPが多数存在します。

H3: IPのマルチメディア展開

これらのIPは「ゲームだけで終わらない」ことが重要です。映画（スーパーマリオ映画は全世界13億ドル超の興行収入）・テレビアニメ・グッズ・テーマパーク・カードゲーム・コラボ商品など、多様なチャンネルで収益を生み出します。ポケモンカードゲームはゲーム本体の売上を超えるほどの市場規模を形成しており、IPのライセンス収益は安定した「寝ていても稼げる収益」として評価されます。

H2: コンシューマーゲーム（家庭用ゲーム）の現状

H3: Nintendo Switch 2の発売と任天堂の強み

任天堂（7974）は2025年に「Nintendo Switch 2」を発売し、市場に再び強いインパクトを与えました。Switch 2は前世代（初代Switch: 1億4,000万台超の販売）のユーザーベースを引き継ぎながら、より高性能なグラフィック・新たなゲームプレイ体験を提供します。任天堂は「ゲームの楽しさ」という体験価値を最優先にするという哲学を貫いており、性能スペック競争に参加せず独自の市場を開拓し続けています。

H3: ソニーPS5とサービス型ビジネスへのシフト

ソニーグループ（6758）のPlayStation 5は好調な販売を続けており、PlayStation Networkのサブスクリプション（PlayStation Plus）が月次経常収益として安定しています。ソニーはゲームだけでなく、映画（ソニーピクチャーズ）・音楽（ソニーミュージック）・アニメ（クランチロール）を組み合わせた総合エンタメ企業として、エンタメ全分野でのシナジーを追求しています。

H2: スマホゲーム市場の成熟と課題

H3: スマホゲーム市場の現状

日本のスマートフォンゲーム市場は2023年時点で約1.5兆円規模ですが、成長率が鈍化しており「成熟期」に入りつつあります。DeNA（2432）・グリー（3632）・ガンホー（3765）・コロプラ（3668）などの専業スマホゲーム企業は、競合激化・ユーザー獲得コストの増加・ヒット作への依存度の高さという課題に直面しています。

H3: 中国・韓国ゲームの台頭

中国のmiHoYo（原神・崩壊スターレイル）・NetEase・テンセントや、韓国のNCSoftなどが高品質なスマホゲームを低価格で展開しており、日本市場にも積極的に参入しています。グローバル競争の激化が日本のスマホゲーム企業の収益を圧迫しています。

H2: カプコン・バンダイナムコ・スクウェア・エニックスの戦略

H3: カプコンのリメイク戦略

カプコン（9697）はバイオハザード・ストリートファイター・モンスターハンター・デビルメイクライなどのIPをリメイク・続編で繰り返し収益化する戦略で高い利益率を維持しています。特に「バイオハザード ヴィレッジ」「ストリートファイター6」「モンスターハンターワイルズ」は世界的ヒットとなり、グローバルIP化が加速しています。ROE・営業利益率ともに日本のゲーム企業トップクラスで、長期投資家からも高い評価を受けています。

H3: バンダイナムコのIPメディア展開

バンダイナムコHD（7832）はガンダム・テイルズ・鉄拳・アイドルマスター・ソウルキャリバーなどのIPを軸にゲーム・アニメ・グッズをグローバル展開しています。特にガンダムはアニメ・ガンプラ・ゲームの三位一体で世界規模の収益を生み出しており、アジア・欧米でのファン層拡大が続いています。

H2: AIのゲーム産業への影響

生成AI・機械学習はゲーム開発の効率化に大きなインパクトをもたらしています。背景・テクスチャ・効果音の自動生成・ゲームシナリオの生成支援・NPCの行動をAIで高度化するなど、開発工数の削減と品質向上が同時に実現されつつあります。

一方でAI生成コンテンツに対するクリエイターからの懸念（権利問題・雇用影響）も強く、各社の対応方針が投資家に注目されています。

H2: eスポーツとメタバースの長期的展望

eスポーツ（競技ゲーム）は世界で視聴者数が急増しており、日本でも高校・大学のeスポーツ部が急増しています。ただし収益化（スポンサー・中継権・チケット収入）という面ではまだ課題が多く、日本の既存ゲーム会社がeスポーツ事業から直接大きな利益を得るには時間がかかる見通しです。

メタバース（仮想空間）はMeta・エピックゲームズ・ロブロックス等が推進しますが、普及ペースは当初の期待より遅く、バンダイナムコ等の大型投資計画の一部が縮小されました。

H2: StockWaveJP編集部の見解

ゲーム・エンタメテーマを観察していると、任天堂・ソニーの新ハード・大型タイトルの発売スケジュールがテーマ全体のモメンタムに強く影響することがわかります。特に任天堂の決算・Nintendo Switch 2の販売台数発表のタイミングでは、テーマ全体の出来高が急増するパターンが見られます。

カプコンのような「ヒット作の選択と集中・高い利益率・IP再活用」モデルは当編集部が長期投資対象として高く評価するビジネスモデルです。流行に依存せず既存のIPを繰り返し収益化できる企業は、業績の安定性と成長性を兼ね備えています。

H2: まとめと今後の展望

ゲーム・エンタメテーマは日本が世界最高レベルの競争力を持つ産業の一つです。IPビジネスの価値・デジタル化によるマージン改善・AI活用による開発効率化という三つの追い風を受けながら、Nintendo Switch 2・カプコンの新作・バンダイナムコのグローバル展開が2026年以降のテーマのドライバーとなります。

H2: 海外市場での日本コンテンツの展開

日本のゲーム・アニメ・マンガは「ジャパニメーション」として世界中に広がっており、NetflixやAmazon Primeでの日本アニメ配信が全世界規模でのファン層形成に貢献しています。ソニーグループ（6758）が買収したクランチロール（世界最大のアニメ配信サービス）は1億人超の会員を持ち、日本アニメの海外展開の主要プラットフォームとなっています。

H2: ゲーム業界の環境・社会的課題

ゲーム依存症・課金トラブル（特に未成年者の高額課金）への社会的関心が高まっており、各国での規制強化が業界全体の課題となっています。日本でも未成年者のオンラインゲーム課金上限設定・ガチャ（ランダム課金）の確率表示義務化などの対策が実施されています。

H2: まとめ

ゲーム・エンタメテーマは日本が世界に誇る「IP（知的財産）の力」と「グローバル展開の成熟度」が強みです。任天堂・ソニー・カプコンという世界的IPホルダーが中心にいる中、AI活用による開発効率化とeスポーツ・メタバースという新成長領域が長期的な成長ストーリーを支えます。StockWaveJPで任天堂・ソニー決算のタイミングとテーマのモメンタム変化を確認する習慣が有効です。

H2: StockWaveJP活用の実践ポイント

ゲーム・エンタメテーマは任天堂・ソニーの決算発表（年4回）・大型タイトルの発売スケジュール・東京ゲームショウなどの業界イベントに合わせてStockWaveJPのモメンタム変化を確認することが有効です。個別銘柄の決算をきっかけにテーマ全体が動くことが多く、特に任天堂の出来高急増はゲームテーマ全体への関心の高まりを示すシグナルとして機能します。

H2: まとめと今後の展望

ゲーム・エンタメテーマは日本が世界最高水準の競争力を持つ産業分野です。任天堂のNintendo Switch 2・カプコンのグローバルヒット連発・ソニーのエンタメ総合戦略という「日本IPの世界展開」というストーリーが今後も続く中、長期投資家にとって魅力的なテーマであり続けます。
`},{id:"banking-finance-theme",category:"銀行・金融",icon:"🏦",title:"銀行・金融テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["銀行・金融","地方銀行","フィンテック"],keywords:["銀行","金融","三菱UFJ","みずほ","金利","利上げ","NIM"],summary:"日銀の金利正常化政策を背景に、銀行・金融テーマは長年の低金利環境から脱却しつつあります。利鞘拡大の恩恵とメガバンクの動向を解説します。",body:`
H2: 銀行・金融テーマとは何か

銀行・金融テーマは預金・融資・資産運用・投資銀行・クレジットカード・リース・消費者金融などの総合金融サービスを提供する銀行グループ・証券会社を対象とした投資テーマです。三菱UFJフィナンシャル・グループ（MUFG）・三井住友フィナンシャルグループ（SMFG）・みずほフィナンシャルグループの「3大メガバンク」が業界をリードし、世界でも有数の資産規模を誇ります。2024年以降の日銀金利正常化政策を背景に、約10年ぶりの本格的な利上げサイクルに入り、銀行業の収益構造が大きく改善しています。

H2: マイナス金利解除が変えた銀行の収益構造

H3: 10年間の低金利からの脱却

2016年に導入されたマイナス金利政策（日本銀行当座預金の一部にマイナス金利を適用する政策）は、銀行の収益に深刻な打撃を与え続けました。貸出金利と預金金利の差（NIM: 純金利マージン）が極限まで圧縮され、メガバンクでさえ国内貸出業務だけでは収益を確保できず、海外業務・手数料ビジネス・コスト削減に活路を求めていました。

2024年3月にマイナス金利が解除され、同年7月と2025年1月に追加利上げが実施されたことで、この構造が一変しました。政策金利が0.5%台に上昇するだけで、MUFGは年間約1,000億円規模のNIM改善効果があるとされており、さらなる利上げが進めば利益への貢献は加速します。

H3: 日本国債利回りの上昇と運用収益改善

長期金利（10年国債利回り）の上昇は、銀行が保有する国債ポートフォリオの評価損を一時的に生じさせますが、新規購入分の利回りが改善するため中長期的には運用収益の増加につながります。また預金金利との逆ザヤ（低金利に設定した保険契約の利率を運用収益が下回る問題）が解消され、生命保険会社の運用収益も改善しています。

H2: コーポレートガバナンス改革と株主還元の強化

東京証券取引所が2023年以降、PBR1倍割れ企業に対して改善策の開示・実施を求めたことで、メガバンクを含む金融機関は以下の対応を加速しました。

政策保有株式（持ち合い株）の大幅削減を通じてROE（自己資本利益率）を向上させ、売却資金を自社株買い・増配に充てています。MUFGの自社株買いは2023〜2024年度で合計1兆円超に達しており、株主に対して積極的に利益還元しています。2024年度のメガバンク3社の決算は軒並み過去最高益を記録し、配当の大幅増額が相次ぎました。

H2: メガバンクの海外事業戦略

H3: MUFGのアジア・米国戦略

MUFGはタイのバンク・オブ・アユタヤ（クルンシィ、76%出資）・フィリピンのGTバンク（34.5%出資）・インドネシアのバンクダナモン（94.1%出資）など東南アジアの主要国で商業銀行に大型出資しています。高い経済成長が続くASEAN地域での中産階級向けリテール融資・中小企業融資が安定した収益源になっています。また米国のユニオンバンク（カリフォルニア州）を2023年に売却し、得た資金を株主還元・成長投資に充てる方針を明確にしました。

H3: SMFGとみずほのグローバル展開

SMFGは米国投資銀行ジェフリーズとの戦略的提携を強化し、M&Aアドバイザリー・株式引受などの投資銀行業務での成長を目指しています。インドのSBIカード（現地大手信用カード会社）への出資など、インド市場でも存在感を高めています。みずほはアジア・中東での法人ビジネスを強化しながら、国内リテール・デジタルバンキング改革に注力しています。

H2: フィンテック・デジタルバンキングとの競争と協業

メガバンクはフィンテック企業との「競争と協業（コペティション）」を進めています。MUFGはコンシューマーファイナンス（アコム）・デジタルウォレット・QRコード決済（Origami、現メルペイ傘下）などへの出資・連携を進めています。SMFGはSBIホールディングスとの提携によりデジタル証券・不動産小口化など新領域に進出しています。みずほはLINEとの提携でLINEスコアリング（AI信用スコア）・LINEバンクの構築に取り組んでいます（一部計画変更あり）。

デジタルバンク（楽天銀行・住信SBIネット銀行）の台頭により、若年層の口座流出という新たな競争圧力も生まれており、既存メガバンクのDX（デジタルトランスフォーメーション）への投資が加速しています。

H2: 証券会社・野村HD・大和証券グループ

証券ビジネスも銀行・金融テーマに含まれます。野村ホールディングス（8604）は国内最大の総合証券で、日本株・外国株・債券・投資信託の販売に加え投資銀行部門（M&Aアドバイザリー・株式引受）を持ちます。大和証券グループ（8601）は国内リテール証券で野村に次ぐ規模を持ち、SBI証券・楽天証券などネット証券との競争に直面しています。

株式市場が活況な時期は証券会社の手数料収入・トレーディング収益が増加し、株価上昇と業績改善が連動する特性があります。

H2: 金利上昇局面での投資戦略

銀行・金融株は「金利上昇→業績改善」という明確なロジックがあるため、日銀の金融政策決定会合（年8回）前後に大きく動くことが多いです。利上げ観測が高まると銀行株が買われ、利上げが見送られると売られるパターンが繰り返されます。

また銀行株は景気との相関も高く、景気後退局面では不良債権（貸倒れ）増加の懸念から売られやすい特性があります。「金利上昇で業績が改善する局面か、景気後退で不良債権が増加するリスクが高まる局面か」を判断することがこのテーマへの投資タイミングの核心です。

H2: StockWaveJP編集部の見解

銀行・金融テーマは、日銀の金融政策への感応度が非常に高いテーマです。毎月の消費者物価指数（CPI）の発表・日銀総裁のコメント・米連邦準備制度（FRB）の政策動向など、金利に関わるニュースが出るたびにこのテーマの出来高が急変動することを繰り返し観察しています。

特に印象的なのは「日銀の追加利上げ観測が高まると、銀行・金融テーマが他の全テーマをリードして上昇し始める」という傾向です。この「先行性」を把握しているかどうかが、利上げ相場での銀行株投資の成否を左右することが多いと感じています。

当編集部は日銀政策決定会合の1〜2週間前からStockWaveJPのテーマ一覧で銀行・金融テーマの出来高変化に注目し、出来高増加+モメンタム転換のタイミングをエントリー候補として確認するアプローチを有効と考えています。また「利上げ後に一時調整が入り、その後再び上昇する」という二段上げパターンも観察されており、利上げ直後の調整局面での追加買いも一つの戦略です。

H2: まとめと今後の展望

銀行・金融テーマは日銀の金利正常化という「10年に一度レベルの構造的な変化」の恩恵を最も直接的に受けるテーマです。金利上昇継続・政策株削減によるROE改善・株主還元強化という三つの追い風が重なる現状は、メガバンク株に対して中長期的にポジティブな見通しをもたらします。ただし景気後退リスクと不良債権増加のリスクは常に意識しながら、StockWaveJPでのモメンタム変化を定期的に確認してください。
`},{id:"regional-bank-theme",category:"地方銀行",icon:"🏢",title:"地方銀行テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["地方銀行","銀行・金融"],keywords:["地方銀行","地銀","金利","再編","人口減少"],summary:"日銀の利上げ政策は地方銀行にも追い風となっています。人口減少・地域経済縮小という構造問題を抱える地銀の現状と再編の動向を解説します。",body:`
H2: 地方銀行テーマとは何か

地方銀行テーマは各都道府県を基盤として地域密着型の金融サービスを展開する地域金融機関を対象とした投資テーマです。全国に100行以上の地方銀行（第一地銀・第二地銀）が存在し、中小企業融資・住宅ローン・地域企業向け貸出で地域経済を支えています。メガバンクと異なり海外業務が少なく、国内の金利環境・地域の企業業績・人口動態に収益が強く依存するという特性があります。

H2: マイナス金利解除が地方銀行に与えた恩恵

2024年3月の日銀マイナス金利解除は地方銀行にとって大きな転換点でした。10年近く続いた超低金利時代には、地方銀行は貸出金利と預金金利の差（NIM）が極限まで圧縮され、収益確保のために有価証券運用・手数料ビジネスへの転換を迫られていました。金利が上昇することで変動金利型の住宅ローン・中小企業融資の利率が上がり、NIMが改善します。

地方銀行の日銀当座預金への付利（利子）収入も増加しており、追加利上げが続く局面では業績改善が持続する見通しです。2024年度の地方銀行各社の決算は多くが増益となり、増配を実施する地銀が相次ぎました。

H2: 地方銀行が直面する構造的な課題

H3: 人口減少と借り手の減少

地方銀行の最大の課題は「人口減少による地域経済の縮小」です。地方では若年層の都市部への流出・少子高齢化が進んでおり、新規融資の需要となる企業数・創業件数・住宅着工件数が趨勢的に減少しています。借り手が減れば貸出残高が増えにくくなり、長期的な収益基盤が細っていきます。

H3: ゾンビ企業問題とコロナ融資の返済開始

コロナ禍（2020〜2022年）に政府・地方銀行が実施した実質無利子・無担保融資（ゼロゼロ融資）の返済が2023年以降に本格化しています。低金利・元本据え置き期間中は生き延びていた企業（いわゆる「ゾンビ企業」）が、返済開始・金利上昇により経営難に陥るケースが増えており、不良債権の増加リスクが高まっています。

H3: フィンテック・ネット銀行との競争

楽天銀行・住信SBIネット銀行・PayPay銀行などのデジタルバンクが高金利定期預金・低手数料の振込サービスで若年層を取り込んでいます。地方銀行は店舗・ATMネットワークというインフラコストが重く、デジタル化への対応が遅れると競争力がさらに低下するリスクがあります。

H2: 地方銀行再編の動向と持株会社化

政府は地方銀行の再編・統合を促す政策を継続しています。独占禁止法の特例（地域金融機関に限り合併・統合を認める緩和措置）が2022年に恒久化されており、経営統合の法的ハードルが下がりました。

ふくおかフィナンシャルグループ（8354）は福岡銀行・熊本銀行・十八親和銀行を傘下に持ち九州最大の地銀グループを形成。コンコルディア・フィナンシャルグループ（7186）は横浜銀行・東日本銀行を擁し神奈川・首都圏をカバーします。広島銀行と山口フィナンシャルグループの広域連携も進んでいます。統合効果（システム・店舗・人員の重複削減）が顕在化するタイミングで株価が評価される傾向があります。

H2: デジタル化・地域貢献という新戦略

生き残りをかけた地方銀行は以下の戦略で差別化を図っています。

「地域商社機能」として地元特産品を首都圏・海外に販売する事業を立ち上げる地銀が増えています。農業・観光・伝統工芸など地域の強みを活かした6次産業化支援も行っています。ビジネスマッチング（地元企業同士・地元企業と外部企業の商談仲介）サービスも積極化しています。スマートフォンアプリを活用した低コストの口座開設・振込・ローン申込など、デジタルチャンネルの強化も急務です。

H2: 主要関連銘柄の特徴

ふくおかフィナンシャルグループ（8354）は九州経済の活況を背景に業績が好調で、電力・観光・半導体（TSMC熊本）関連の融資需要が追い風です。京都フィナンシャルグループ（5844）は京都銀行を中核に、観光業・伝統産業・ベンチャー支援で独自のポジションを持ちます。滋賀銀行（8366）は滋賀県内でトップシェアを維持しながら、環境・ESG融資でのブランド構築に注力しています。七十七銀行（8341）は宮城県地盤で東北の復興需要恩恵を受けてきた実績があります。

H2: StockWaveJP編集部の見解

地方銀行テーマはメガバンク（銀行・金融テーマ）と同様に日銀金融政策への感応度が高いですが、よりローカルな要因（地域の経済指標・観光統計・製造業の景況感）にも影響されることを観察しています。

注目しているのは「利上げ期待でメガバンクが先行上昇した後に、地銀株に出来高増加とモメンタム転換が現れる」というパターンです。機関投資家がまずメガバンクを買い、次に地銀に資金をローテーションする動きが見られることがあり、StockWaveJPのテーマ別詳細で地銀銘柄の騰落率・出来高変化を確認することでこのローテーションを把握できます。

また地方銀行は「政策テーマ」的な側面もあり、地方創生・地域経済活性化が政治的な焦点になるタイミングでテーマ全体が注目を集めることがあります。地域経済政策の発表・地銀の特例合併認可のニュースにも注目することを推奨します。

H2: まとめと今後の展望

地方銀行テーマは「金利上昇の追い風」と「人口減少・デジタル化の逆風」という相反する力の中にあります。今後の株価を左右するのは「金利上昇の恩恵をどれだけ取り込めるか」と「人口減少・デジタル化という構造問題にどう対応するか」のバランスです。再編・統合による規模の効率化と、地域に根差した独自価値の提供を両立できる地銀グループが長期的な勝者になると当編集部は考えています。

H2: 不良債権問題とゾンビ企業の実態

コロナ禍（2020〜2022年）に実施された政府・地方銀行による「実質無利子・無担保融資（ゼロゼロ融資）」は中小企業の倒産を防ぐ役割を果たしましたが、返済が本格化した2023年以降に問題の輪郭が見えてきました。低金利・返済猶予期間中は事業継続できていた企業が、金利上昇と返済開始によって経営難に陥るケースが増えており、地方銀行の不良債権比率の推移が重要な監視指標となっています。

一方で2024年から中小企業向けの「事業再生・事業承継」支援が強化されており、地方銀行が借り手企業の再生を伴走支援することで不良債権の管理損失を最小化する取り組みが広がっています。

H2: 地方銀行の新収益源

預貸金利差（NIM）の改善に加え、地方銀行は以下の新収益源を開拓しています。地域企業のM&A仲介・事業承継支援フィー収入が増加しています。不動産コンサルティング・信託業務の拡充も進んでいます。証券子会社・保険代理店を通じた投信・保険の販売手数料収入も安定成長しています。

H2: まとめ

地方銀行テーマは「金利上昇の追い風」と「人口減少・デジタル化の逆風」が拮抗する複雑な局面にあります。再編・統合による規模拡大と地域密着の差別化を両立できる地銀グループが長期的な勝者となる見通しです。StockWaveJPでは日銀政策会合前後にこのテーマの出来高変化を確認し、利上げ観測の強弱とモメンタムの変化を照合することが有効な投資管理手法です。
`},{id:"insurance-theme",category:"保険",icon:"🛡️",title:"保険テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["保険"],keywords:["保険","損害保険","東京海上","第一生命","株式持ち合い","金利"],summary:"保険セクターは金利上昇・株式持ち合い解消の流れで注目を集めています。国内大手保険会社の収益構造と株主還元の動向を解説します。",body:`
H2: 保険テーマとは

保険テーマは損害保険と生命保険を提供する保険会社グループを対象とした投資テーマです。日本の保険市場は世界第3位の規模を誇り、東京海上ホールディングス・MS&ADインシュアランスグループHD・SOMPOホールディングスの損保3社と、第一生命HD・日本生命（非上場）・住友生命（非上場）などの大手生保が業界を牽引しています。保険テーマは「金利上昇の恩恵を受けながら株式持ち合い解消でROEが改善する」という二重の追い風を受けており、2024年以降の日本株を代表するバリュー株の宝庫となっています。

H2: 金利上昇と保険会社の収益構造

保険会社は顧客から受け取った保険料を主に国債・社債・株式などで運用し、運用収益を収益の柱の一つとしています。2016年から続いたマイナス金利・超低金利時代には運用利回りが極限まで低下し、特に生命保険会社では予定利率（顧客に約束した運用利率）を運用収益が下回る「逆ざや」が問題となっていました。

2024年3月に日銀がマイナス金利を解除し、同年7月と2025年1月に追加利上げを実施したことで状況が一変しました。長期金利（10年国債利回り）が上昇し、保険会社が新規に購入する国債の利回りが改善しています。特に毎年大量の保険料収入を国債で運用する生命保険会社にとって、金利上昇は長期的に大きな収益改善をもたらします。

H2: 株式持ち合い解消とROE改善

東京証券取引所が2023年以降、PBR（株価純資産倍率）1倍割れ企業に対して改善策の開示を要請したことを背景に、保険会社は長年の慣行であった「政策保有株式（株式持ち合い）」の売却を急速に進めています。保険会社が事業会社と相互に株式を保有し合う「持ち合い」は、ROEを低下させる要因として批判されてきました。

東京海上HDは政策保有株を一定期間で完全売却する方針を明確にし、SOMPOホールディングスも売却計画を加速しています。政策株の売却により得られた資金は自社株買い・増配・海外事業投資に充てられており、株式市場から高く評価されています。東京海上HDは政策株売却を発表した2023年以降、株価が2倍以上に上昇しました。

H2: 海外事業の成長と自然災害リスク

損保3社は成熟した国内市場を補完するため海外事業を積極拡大しています。東京海上HDはKiln（英国）・Philadelphia Consolidated（米国）などの買収で北米・欧州市場での存在感を高め、海外保険料収入が全体の55%超を占めるに至っています。MS&ADも東南アジア・欧州で積極的なM&Aを展開し、SOMPOも北米の大手損保Fairfax傘下の事業買収を進めています。

海外事業拡大の最大のリスクは自然災害です。米国では近年、ハリケーン（フロリダ・テキサス沿岸）・山火事（カリフォルニア）・洪水（中西部）の頻度・規模が気候変動を背景に拡大しており、損保各社のキャット（大規模災害）ロスが収益の変動要因となっています。2025年のロサンゼルス山火事では日系損保も多額の保険金支払いが発生しました。

H2: 生命保険の変化と新商品

生命保険分野でも大きな変化が起きています。少子高齢化により純粋な死亡保障ニーズは縮小しつつありますが、医療保険・介護保険・個人年金（老後資産形成）への需要は拡大しています。NISAの拡充や老後2000万円問題を背景に、個人の資産形成意識が高まる中、変額保険・投資型終身保険など運用機能を持つ商品も注目されています。

デジタル保険（スマホで完結する医療保険・自転車保険・旅行保険）の普及も加速しており、スタートアップ保険（InsurTech）との協業も進んでいます。テレマティクス保険（実際の走行データに基づいて保険料が変わる自動車保険）も導入が進んでいます。

H2: 主要関連銘柄の特徴

東京海上ホールディングス（8766）は日本最大の損保グループで、高い収益性と積極的な株主還元から「損保の優等生」と称されます。配当利回りも3〜4%台と高く、成長性・配当・バリューを兼ね備えた稀有な銘柄です。MS&ADインシュアランスグループHD（8725）は三井住友海上・あいおいニッセイ同和損保を傘下に持ち、アジア展開にも力を入れています。SOMPOホールディングス（8630）は損保ジャパンに加え、介護事業（SOMPOケア）・デジタルビジネスも展開するユニークな複合企業です。

生保では第一生命ホールディングス（8750）が東証に上場しており、米国の子会社プロテクティブ生命が重要な収益源です。T&Dホールディングス（8795）は太陽生命・大同生命・T&Dフィナンシャル生命を傘下に持ちます。

H2: 上昇因子と下落因子の詳細

上昇因子として最も重要なのは日銀の追加利上げです。利上げ観測が高まるたびに保険株が買われる傾向があります。次に政策保有株の売却加速による資本効率改善と株主還元強化、海外損保M&Aによる成長加速、円安（海外子会社の円換算収益増）が挙げられます。

下落因子として最も注意が必要なのは大規模自然災害（ハリケーン・地震・洪水）の発生です。保険金支払いが急増すると四半期業績が大きく悪化します。加えて円高転換による海外収益の目減り、M&A案件の失敗（のれん償却・業績不振）、金融庁による規制強化（保険料の引き上げ制限等）が下落要因となります。

H2: 投資タイミングとStockWaveJPの活用法

保険テーマは日銀の金融政策決定会合（年8回）の前後に大きく動く傾向があります。利上げ観測が高まる局面でこのテーマの出来高が急増し、モメンタムが「転換↑→加速」に転じることが多いです。

StockWaveJPのテーマ一覧で保険テーマの騰落率・出来高ランキングを確認し、特に出来高が急増しながら騰落率も上昇している局面は「機関投資家・外国人投資家の買い入れ」のシグナルとして捉えることができます。テーマ別詳細ページで東京海上HD・MS&AD・SOMPOの3社を比較し、どの銘柄に最も資金が集中しているかを確認することで、より精度の高い投資判断が可能になります。テーマヒートマップで短期・中期・長期すべての期間で「保険テーマが強い」パターンを確認できれば、トレンドの持続性が高いと判断できます。


H2: 第三分野保険の成長

死亡保障（生命保険）・損害保険（財物・賠償）に次ぐ「第三分野保険」（医療保険・がん保険・介護保険・就業不能保険など）が急成長しています。少子高齢化による死亡保障ニーズの減少を補い、病気・介護・就業不能という「生きるリスク」への保障ニーズが高まっています。特にがん保険（がん診断時に一時金を支払うタイプ）・三大疾病保険（がん・心疾患・脳卒中）・就業不能保険（病気やケガで働けなくなった時の収入補償）が個人の保険設計の中核になっています。

H2: 損保大手の企業向けリスクソリューション

SOMPOホールディングス（8630）・東京海上HD（8766）・MS&ADの損保大手は企業向けの「リスクソリューション」サービスを強化しています。企業のサイバーリスク（情報漏洩・ランサムウェア）への保険引受・コンサルティング、気候変動による農業リスク（天候デリバティブ）、人権デューデリジェンス対応（サプライチェーンリスク）など、保険を超えたリスク管理サービスの提供が差別化戦略となっています。

H2: 自動車保険の変化とテレマティクス

自動運転技術の普及・EV化により、自動車保険市場が大きく変わる可能性があります。完全自動運転の普及により「事故の責任が運転者からメーカーに移る」という法的・保険的な変化が起きます。現時点では「テレマティクス保険（実際の走行データ（速度・急加速・急ブレーキ・夜間走行頻度）に基づいて保険料が変わる）」が普及しており、安全運転者には割引が提供されます。

H2: 気候変動と保険業界の構造問題

気候変動による自然災害の激甚化・頻発化は損害保険業界の構造的な課題となっています。米国のフロリダ・カリフォルニア・テキサスでは自然災害リスクが高まりすぎたことで、大手保険会社が保険引受を停止・撤退する事態が起きています。この「保険ギャップ（Insurance Gap：保険に入れない・入れても保険料が高すぎる状態）」は社会問題となっており、日本でも将来的に同様の問題が生じる可能性があります。気候変動リスクの再保険（リスクの一部を別の保険会社に転嫁する仕組み）コストが上昇しており、損保大手の採算管理が一層複雑になっています。

H2: StockWaveJP編集部の見解

保険テーマを観察していると、「自然災害ニュース（台風・洪水・地震）の発生と株価の関係」が興味深いパターンを示しています。一般的に「大規模自然災害が発生すると保険株が売られる」と思われがちですが、実際には「中規模の自然災害（保険金支払いが増えるが、業績に致命的な影響を与えない規模）」の発生後は、逆に「防災・保険需要が高まる」という期待から保険株が買われることがあります。本当に株価を下押しするのは米国・欧州での「超大規模自然災害（カテゴリー5のハリケーン・大規模山火事）」の場合であり、こうした事案の発生時は損保三社の株価へのインパクトを速やかに確認することが重要です。東京海上HDの北米依存度が最も高いため、米国での大規模災害時に特に注意が必要です。

H2: 保険テーマのサステナビリティと気候変動リスク

保険業界の最大の長期リスクの一つが気候変動です。温暖化により台風・ハリケーン・洪水・山火事・熱波の頻度・規模が拡大しており、損害保険各社の「キャット（大規模自然災害）ロス」が増加しています。特に北米市場でのハリケーン・山火事被害が日系損保の海外収益を左右するリスクが高まっています。各社は保険料の引き上げ・カバレッジの見直し・再保険（保険会社が他の保険会社にリスクを分散する仕組み）の活用でリスク管理を強化しています。

H2: まとめ

保険テーマは「金利上昇による運用収益改善」「政策株削減によるROE向上」「株主還元強化」という三つの追い風が続く中期的に魅力的なテーマです。東京海上HDのような「グローバル損保企業」としての評価向上と高い株主還元は長期投資家に支持されています。日銀政策決定会合のタイミングとStockWaveJPのモメンタム変化を照合することが、このテーマへの投資精度向上につながります。
`},{id:"real-estate-theme",category:"不動産",icon:"🏗️",title:"不動産テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["不動産","建設・インフラ","国土強靭化計画"],keywords:["不動産","REIT","三井不動産","地価上昇","インバウンド","金利"],summary:"都市部の地価上昇・インバウンド需要・オフィス回復を背景に不動産テーマが注目されています。金利上昇リスクとのバランスや主要ディベロッパーの動向を解説します。",body:`
H2: 不動産テーマとは

不動産テーマはマンション・オフィス・商業施設・物流施設・ホテルなどを開発・運営・賃貸する企業と、J-REIT（不動産投資信託）を対象とした投資テーマです。日本の不動産市場は東京・大阪・名古屋などの大都市圏を中心に大規模開発が続いており、2024〜2026年にかけては「訪日外国人急増によるホテル需要」「AIデータセンターの爆発的需要」「外国人投資家による日本不動産への旺盛な買い需要」という三つの強力な追い風が重なっています。

H2: 都市部地価の継続上昇と外国人マネー

2022年以降、東京都心・大阪・京都・福岡などの主要都市の商業地地価は上昇基調が続いています。国土交通省の地価公示データによれば、東京都心部の商業地は2024年も前年比10%超の上昇を記録しました。

この地価上昇を下支えする大きな要因が外国人投資家による日本不動産への旺盛な投資です。円安を背景に日本の不動産が海外投資家から見て「割安」になっており、シンガポール・香港・中東系ファンド・米国系不動産投資ファンドが東京の高級マンション・ホテル・オフィスを積極的に購入しています。一部の超高級マンション（港区・渋谷区）では外国人購入比率が50%を超えるケースも出ています。

H2: オフィス市場の回復とグレードアップ需要

コロナ禍（2020〜2022年）でテレワーク普及によりオフィス需要が落ち込みましたが、2023年以降は主要都市のオフィス空室率が低下傾向に転じています。多くの大企業が出社回帰を進める中、従来の古いオフィスから高品質・環境配慮型の新築ビルへ移転する「フライト・トゥ・クオリティ（品質への飛躍）」が旺盛です。

東京では2027〜2030年にかけて大規模複合開発（虎ノ門・麻布台・大手町・渋谷）が竣工を予定しており、最新設備・低炭素・ウェルネス機能を備えたグレードAオフィスへの需要は今後も継続する見通しです。

H2: データセンター需要の爆発的拡大

不動産テーマの新たな成長ドライバーとして「データセンター用地・施設」への需要急増が挙げられます。AI・クラウドコンピューティング・5Gの拡大に伴い、大規模なデータセンターが全国各地で必要とされています。特に大量の電力と冷却水を安定的に確保できる立地（千葉・埼玉・大阪・北海道など）での大型データセンター開発が加速しています。

NTT・KDDI・ソフトバンクなどの通信会社や、三井不動産・野村不動産などのデベロッパーがデータセンター開発に参入しており、不動産テーマとAI・クラウドテーマの交差点として投資家から注目を集めています。

H2: 訪日外国人とホテル市場の活況

2024年の訪日外国人数は3,688万人と過去最高を更新し、消費額も8兆円超（推計）に達しました。ホテル市場では稼働率・客室平均単価（ADR）・1部屋あたりの収益（RevPAR）がいずれも過去最高水準を更新しています。

特に外国人旅行者が好む高級ホテル・旅館の客室単価は急騰しており、東京・京都・大阪の5つ星ホテルでは1泊10万円以上の高単価が当たり前になっています。帝国ホテル（9708）・藤田観光（9722）など老舗ホテルは客室単価の大幅引き上げにより過去最高益を更新しています。

H2: 物流施設とEコマース需要

Eコマース市場の拡大を背景に、物流施設（倉庫・配送センター）への需要が構造的に伸びています。2024年の日本のEC市場は20兆円超の規模に達し、巨大な物流インフラが必要とされています。プロロジス・日本プロロジスリート投資法人（3283）をはじめとする物流系J-REITは、安定した賃料収入から機関投資家に人気です。

H2: J-REITの現状と魅力

J-REIT（約60銘柄が東証に上場）は投資家から集めた資金で不動産を購入・運営し、賃料収入の90%以上を分配する仕組みです。分配金利回りは平均3〜5%台と高く、個人投資家のインカムゲイン投資として人気があります。

金利上昇局面では借入コストの増加や利回りの相対的な低下からJ-REIT価格が下落しやすい傾向があります。ただしインフレに伴う賃料収入の増加や資産価値の上昇が中長期的には下支えとなります。J-REITに投資する際は、保有物件の立地・種類・稼働率・賃料改定条項を確認することが重要です。

H2: 主要関連銘柄と投資のポイント

三井不動産（8801）は三井ショッピングパーク・三井アウトレットパーク・パークタワーシリーズなど多彩な不動産ポートフォリオを持ち、東京・大阪の大型再開発をリードしています。住友不動産（8830）は高層マンション（タワーマンション）開発で差別化し、超高額物件の販売実績が際立っています。東急不動産HD（3289）は渋谷の大規模再開発（渋谷スクランブルスクエア等）で注目を集めています。野村不動産HD（3231）はプラウドブランドのマンションで高い認知度を持ちます。ヒューリック（3003）は銀座・新橋など東京都心の路面店舗に特化した独自戦略で高い収益性を誇ります。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は都市部地価の継続上昇・外国人投資家の流入・訪日外国人増加によるホテル需要・データセンター開発ブーム・J-REIT利回りの相対的な魅力（低金利環境）です。下落因子は金利上昇による借入コスト増加・景気後退によるオフィス空室率再上昇・中国経済悪化に伴う外国人投資家の撤退リスク・人口減少による地方不動産市場の縮小です。

日銀の金融政策決定後に不動産テーマの出来高が急変することが多く、モメンタムページで転換シグナルを確認しながらタイミングを検討します。テーマ別詳細で大手ディベロッパーと物流系・ホテル系・データセンター系銘柄の動きを比較し、どのセグメントに資金が集まっているかを把握することが有効な投資分析手法です。


H2: リノベーション・中古不動産市場の台頭

新築マンション価格の高騰（東京23区の新築マンション平均価格が1億円超）により、中古マンションの購入+リノベーション（改装）という選択肢が注目されています。中古不動産は新築より安価ですが、設備・内装・耐震性を改修することで「新築同等の住宅」として活用できます。リノベーション専門業者（スタートアップ）・大手建設会社のリフォーム部門・不動産プラットフォーム（SUUMO・LIFULL）でのリノベ物件掲載が急増しています。

H2: 高齢化と不動産：シニア住宅・サービス付き高齢者向け住宅

超高齢化社会において「シニア向け住宅市場」が成長しています。サービス付き高齢者向け住宅（サ高住）・介護付き有料老人ホーム・バリアフリー設計の住宅などへの需要が拡大しており、不動産会社・介護事業者・建設会社が連携したビジネスが育っています。ニチイHD・SOMPOホールディングス（介護事業）・大和ハウス工業（3263）などがこの市場に積極参入しています。

H2: 2025年問題と空き家・空きビル問題

「2025年問題」で団塊世代が後期高齢者となることに伴い、相続による空き家の急増が社会問題化しています。全国の空き家数は2023年時点で900万戸超と過去最多を更新しており、固定資産税の特例廃止（空き家放置に対するペナルティ強化）・空き家バンクの整備・空き家の流通促進策が政府・自治体から相次いで打ち出されています。空き家を「DIYリノベ・民泊・コワーキングスペース」として活用するビジネスも生まれており、不動産仲介・リノベーション・民泊プラットフォーム企業に新たな機会があります。

H2: ESGと不動産：グリーンビルディングの普及

環境規制の強化と企業の脱炭素宣言を背景に、省エネ・低炭素のグリーンビルディング（ZEB: Zero Energy Building・ZEH: Zero Energy House）への需要が高まっています。特に企業のオフィス選定では「LEED認証・CASBEE評価・ZEB基準を満たした物件」が優先されるケースが増えており、既存のオフファーエネルギー対応が遅い物件は賃料・稼働率の低下リスクがあります。三井不動産・住友不動産・東急不動産などの大手が新築物件でのZEB取得を標準化しています。

H2: StockWaveJP編集部の見解

不動産テーマはJリート市場との連動性が高く、金利変動に対して最も敏感に反応するテーマの一つです。日銀が利上げ観測を示すとJリート価格が下落（利回りの相対的魅力低下）し、不動産テーマ全体の騰落率がマイナスに転じることが繰り返されています。逆に金利上昇が一旦落ち着くと「地価上昇・ホテル稼働率・賃料収入増加」というファンダメンタルな好材料が再評価されて反発するパターンも観察しています。金利とインバウンドという二つの主要ドライバーをStockWaveJPのモメンタムと組み合わせることで、不動産テーマへの投資タイミングをより精度高く判断できます。

H2: 不動産テクノロジー（プロップテック）の台頭

テクノロジーを活用した不動産サービス（プロップテック）が急速に普及しています。AI査定（不動産の適正価格をAIで瞬時に算出）・VR内見（3D映像で部屋を体験）・ブロックチェーンを使った不動産小口化投資（セキュリティトークン）・BIM（建築情報モデリング）による施工管理の効率化などが実用化されています。SREホールディングス（非上場）・GA technologies（3491）などのプロップテックスタートアップが市場を変えつつあります。

H2: まとめ

不動産テーマは「地価上昇・外国人投資家流入・データセンター需要・ホテル活況」という四つの追い風が重なる現在、日本株市場の中でも特に外国人投資家の関心が高いテーマです。日銀の金融政策（金利上昇がJ-REITの利回りに影響）と訪日外国人統計（ホテル需要）という二つの指標をStockWaveJPのテーマデータと照合することで、不動産テーマへの投資タイミング管理が可能になります。
`},{id:"pharma-bio-theme",category:"医薬品・バイオ",icon:"💊",title:"医薬品・バイオテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["医薬品・バイオ","ヘルスケア・介護"],keywords:["医薬品","バイオ","第一三共","武田薬品","ADC","創薬","FDA承認"],summary:"第一三共のADCの世界的成功で日本の医薬品・バイオへの注目が急上昇しています。創薬パイプラインの評価方法と主要企業の現状を解説します。",body:`
H2: 医薬品・バイオテーマとは

医薬品・バイオテーマは新薬の研究開発・製造・販売を行う製薬企業と、バイオテクノロジーを活用した革新的な医薬品（抗体医薬・細胞療法・核酸医薬等）を開発するバイオ企業を対象とした投資テーマです。日本の製薬産業は世界第3位の市場規模を持ち、武田薬品工業・第一三共・アステラス製薬・エーザイ・塩野義製薬・中外製薬などが国際競争力を持つグローバル企業として活躍しています。

H2: 第一三共ADCの世界的成功が業界を変えた

日本の医薬品・バイオテーマが世界的な注目を集めるきっかけとなったのが、第一三共（4568）が開発した抗体薬物複合体（ADC: Antibody Drug Conjugate）技術の圧倒的な成功です。ADCは「がん細胞を標的にする抗体」に「強力な抗がん剤」を化学的に結合させた次世代がん治療薬で、正常細胞へのダメージを最小限に抑えながらがん細胞を効率的に攻撃する「スマート爆弾」とも言える革新的な治療法です。

第一三共が開発した「エンハーツ（Trastuzumab deruxtecan、T-DXd）」は乳がん・胃がん・肺がんに対して従来治療を大幅に上回る有効性を示し、アストラゼネカとの開発・販売パートナーシップ（総額最大6.9兆円規模）は製薬業界史上最大規模の提携の一つとなりました。この成功を機に欧米の製薬大手が日本のバイオ創薬技術に注目し、日本の製薬株への外国人投資家の関心が急上昇しました。

H2: エーザイのアルツハイマー病治療薬

もう一つの重要な出来事がエーザイ（4523）とバイオジェン（米国）が共同開発したアルツハイマー病治療薬「レケンビ（Lecanemab）」のFDA（米国食品医薬品局）承認（2023年）です。レケンビは世界初のアルツハイマー病の進行を抑制する薬として歴史的な意義を持ちます。

アルツハイマー病は全世界に約5,500万人の患者がいると言われる巨大な疾患領域で、有効な治療薬が存在しなかった分野です。レケンビの市場規模は将来的に数兆円規模に成長する可能性があり、エーザイの株価を大きく押し上げました。

H2: 武田薬品のグローバル戦略と財務課題

武田薬品工業（4502）はアイルランドの希少疾患治療薬大手シャイアー（約7兆円）の買収により、世界トップ10の製薬企業となりました。消化器疾患・希少疾患・血漿由来医薬品・がん・神経精神疾患の5領域に集中し、世界80以上の国・地域で事業を展開しています。

一方でシャイアー買収に伴う多額の負債（買収時に約5兆円）の返済が財務上の課題で、事業売却・コスト削減を進めながら財務改善を図っています。武田の株価は長期間低迷しており、「バリュー株として割安」か「構造問題を抱えた割安トラップ」かで投資家の見方が分かれています。

H2: 中外製薬：ロシュグループの研究力と日本市場

中外製薬（4519）はスイスの製薬大手ロシュグループの一員で、がん・免疫疾患・骨・代謝疾患の領域で高い研究力を持ちます。ヘムライブラ（血友病）・アレセンサ（肺がん）・エンスプリング（視神経脊髄炎スペクトラム）などの革新的新薬で高い収益を維持しています。日本市場ではがん免疫療法薬の草分けとして認知されています。

H2: 薬価制度とジェネリックリスク

日本では2年に一度の薬価改定（薬の公定価格の見直し）が行われており、製薬企業の収益に大きな影響を与えます。特に売上高が高い医薬品は価格引き下げ幅が大きく設定される傾向があり、新薬で得た利益を薬価改定で削られる構造的な問題があります。

特許切れ後はジェネリック医薬品（後発薬）との競合にさらされ、一般的に特許切れから2〜3年で売上の80〜90%がジェネリックに置き換わります。このため製薬企業は常に新しいパイプライン（開発中の医薬品候補）の充実が求められます。

H2: 臨床試験と投資リスク

医薬品開発の大きな特徴は「成功確率の低さ」です。臨床試験（Phase I〜III）を経てFDA・PMDAの承認を取得できるのは全体の約10%以下とされ、Phase IIIで失敗すると数百億〜数千億円の開発費が一気に損失となり株価が暴落します。

このリスクのため、医薬品・バイオ株への投資には「パイプラインの多様性（複数の候補薬）」「承認済み製品の安定した売上」「財務の余力（キャッシュ）」の確認が重要です。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子はFDA・PMDAによる画期的新薬（ブレークスルー・セラピー指定）の承認・国際学会での良好な臨床データ発表・大手製薬会社との大型ライセンス契約締結・円安による海外収益の円換算増です。下落因子は薬価引き下げ・臨床試験の失敗（特にPhase III）・特許切れによる主力品の売上急減・後発薬・バイオシミラーの参入です。

FDA審査のPDUFA日（審査期限日）・学会発表（ASCO・ESMOなどのがん学会）・薬価改定の決定タイミングでこのテーマが大きく動く傾向があります。テーマ別詳細で第一三共・エーザイなど個別銘柄の出来高急増タイミングを確認し、学会発表や審査結果との照合が有効な投資分析手法です。


H2: バイオシミラー市場の拡大とジェネリック戦略

バイオシミラー（バイオ医薬品の後発品）は、先発バイオ医薬品の特許切れ後に類似製品が市場参入するもので、先発品より20〜40%安価に提供されます。政府は医療費抑制のためジェネリック・バイオシミラーの使用促進を積極的に推進しており、沢井製薬（4555）・東和薬品（4553）・日医工（4541・更生手続き中）などのジェネリックメーカーの市場が拡大しています。ただしバイオシミラーの製造は通常ジェネリックより複雑で参入障壁が高く、信頼性・安全性の確認が重要です。

H2: 創薬パイプラインの評価方法

医薬品株を評価する際に最も重要なのが「パイプライン（開発中の候補薬）の評価」です。臨床試験の段階（Phase I〜III）・適応疾患・市場規模・成功確率・提携先・権利収入の条件を分析することで、株価に織り込まれていない「隠れた価値」を発見できます。Phase I（安全性確認）→Phase II（有効性・用量確認）→Phase III（大規模比較試験）の順に成功確率が上がり、FDA/PMDA申請へと進みます。Phase III承認の確率は通常70〜80%とされており、Phase III失敗は株価の急落（30〜50%以上）を招くことがあります。

H2: 中外製薬のロシュ関係と独自パイプライン

中外製薬（4519）はスイスのロシュグループ（世界最大の製薬会社の一つ）が筆頭株主（約60%保有）で、ロシュとの長期的な協業関係がパイプラインの充実につながっています。ヘムライブラ（血友病A）・アレセンサ（ALK陽性非小細胞肺がん）・エンスプリング（視神経脊髄炎スペクトラム）など多くの革新的新薬が日本発・ロシュ協力で生まれています。中外製薬の特徴はロシュのグローバルな開発リソースを活用しながら、日本での速やかな承認・上市を実現する独自モデルにあります。

H2: ワクチン・感染症領域での成長

コロナ禍で感染症対策の重要性が世界的に再認識され、ワクチン開発への投資が拡大しました。第一三共はmRNAワクチン（新型コロナ向け）の開発を進めたほか、RSウイルス・インフルエンザ向けの次世代ワクチン開発にも取り組んでいます。塩野義製薬（4507）のコロナ治療薬「ゾコーバ」は日本初の国内承認コロナ飲み薬として市場投入されました。感染症・ワクチン分野は「次のパンデミック対策」という政策的な支援も背景に、中長期的な成長が期待されます。

H2: StockWaveJP編集部の見解

医薬品・バイオテーマを観察していると、「学会発表のカレンダー（ASCO・ESMO・ASH等のがん・血液学会）」のタイミングでテーマ全体の出来高が急変することが最も特徴的です。重要な臨床試験データが発表される前後の1〜2週間に出来高が増加し、結果が良好であれば急騰・期待外れであれば急落するというパターンが繰り返されています。第一三共・エーザイ・塩野義などの中核銘柄の株価動向とテーマ全体のモメンタムを合わせて確認することで、学会シーズンへのポジション管理を精度高く行うことができます。決算よりも学会発表・FDA審査結果が株価を動かすことが多いのが医薬品テーマの特色です。

H2: バイオベンチャーへの投資：高リスク・高リターン

製薬・バイオテーマには大手製薬会社に加え、創薬に特化したバイオベンチャー（ペプチドリーム・ステムセル研究所・UMN ファーマ等）も含まれます。バイオベンチャーは「画期的な新薬候補を持つが、まだ臨床試験段階」という企業が多く、FDA/PMDA承認取得で株価が数倍になる可能性がある一方、臨床試験の失敗で70〜80%下落するリスクもあります。高リスク・高リターンの投資対象として、ポートフォリオの一部として少額で関与するアプローチが一般的です。

H2: まとめ

医薬品・バイオテーマは第一三共のADC革命・エーザイのアルツハイマー病治療薬という「日本発の世界的革新」を背景に、グローバルな投資家から高い注目を集めています。FDA審査日程・国際学会（ASCO・ESMO）発表カレンダーをStockWaveJPのテーマ出来高データと組み合わせて確認することで、催事前後の株価変動を先読みする判断材料を得ることができます。
`},{id:"healthcare-nursing-theme",category:"ヘルスケア・介護",icon:"🏥",title:"ヘルスケア・介護テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["ヘルスケア・介護","医薬品・バイオ","薬局・ドラッグストア"],keywords:["ヘルスケア","介護","高齢化","デジタルヘルス","遠隔診療"],summary:"超高齢化社会の日本において、ヘルスケア・介護テーマは内需型の安定成長が期待できます。介護ロボット・デジタルヘルス・遠隔診療など新技術の動向を解説します。",body:`
H2: ヘルスケア・介護テーマとは何か

ヘルスケア・介護テーマは高齢者の介護・生活支援サービスを提供する事業者、医療機器・ヘルスケア機器メーカー、デジタルヘルス（遠隔診療・健康管理アプリ）・医療情報プラットフォーム企業を対象とした投資テーマです。日本は世界最高水準の高齢化率（65歳以上が総人口の約29%）を誇る「超高齢化社会」であり、2025年には団塊世代が全員75歳以上（後期高齢者）となる「2025年問題」を通過しました。ヘルスケア・介護テーマは景気に左右されにくい構造的な内需成長が見込まれるディフェンシブ投資テーマとして注目されています。

H2: 超高齢化社会の規模と介護需要の実態

H3: 2040年問題：さらなる高齢化の加速

日本の65歳以上人口は約3,600万人（2024年時点）で、2040年にはさらに増加する見通しです。特に75歳以上の後期高齢者は2040年までに2,300万人超に達すると推計されており、認知症・骨粗しょう症・心疾患などの高齢者特有の疾患への医療・介護需要が拡大し続けます。

介護が必要な認定者数（要介護・要支援認定者）は現在約700万人超で、今後さらに増加します。施設介護（特別養護老人ホーム・グループホーム等）・在宅介護・デイサービス・訪問看護など多様なサービスへの需要が構造的に拡大します。

H3: 介護人材の深刻な不足

最大の課題は介護を担う労働力の不足です。厚生労働省の推計では2040年に介護人材が約69万人不足するとされています。現状でも介護職は離職率が高く・給与が低いという問題を抱えており、政府は処遇改善加算の拡充・外国人介護人材の受入拡大・介護ロボット活用支援など多方面から対策を打っています。

H2: 介護ロボットとDXによる生産性革命

H3: 介護ロボットの種類と導入状況

介護現場での人手不足解消の切り札として期待されるのが介護ロボットです。主な種類と特徴は以下の通りです。

移乗介助ロボット（CYBERDYNE・HALシリーズ）は介護者の腰への負担を軽減し、被介護者の自立を支援します。見守りセンサー（富士通・パナソニック）は夜間の転倒・徘徊を検知し、少人数のスタッフでも安全な見守りを可能にします。排泄ケアロボット（PLEN Robotics等）は排泄介助の自動化で介護職員の精神的・身体的負担を大幅に軽減します。コミュニケーションロボット（ソニーのaibo・Softbankのペッパー）は認知症の方の孤立感を和らげ、認知機能の低下を遅らせる可能性が研究されています。

H3: デジタルヘルスの急成長

コロナ禍でオンライン診療（スマホ・PCで医師の診察を受けられるサービス）が規制緩和・恒久化されたことで、デジタルヘルス市場が急成長しています。エムスリー（2413）は医師向け情報プラットフォームと製薬会社向けeプロモーションで高い利益率を誇り、医療DXの最重要プレイヤーです。メドレー（4480）はオンライン診療システム「CLINICS」とクラウド電子カルテ「CLINICSカルテ」で急成長しています。

電子処方箋の普及・PHR（個人健康記録）の整備・マイナ保険証との連携など、医療DXのインフラ整備が政府主導で加速しています。これらのデジタル化を支援するITサービス・システム企業にも投資機会があります。

H2: 診療報酬・介護報酬改定の投資への影響

H3: 改定サイクルとその影響

介護報酬（政府が定める介護サービスの価格）は3年に1度、診療報酬（医療行為の価格）は2年に1度改定されます。改定でプラス方向の改定が行われた場合は事業者の収益が改善し、マイナス改定では収益が悪化します。また処遇改善加算（介護職員の賃金を引き上げるための補助）の拡充は事業者の人件費増加につながりますが、サービス単価の引き上げを伴わない場合は収益を圧迫します。

2024年度の介護報酬改定ではプラス1.59%（処遇改善分を含む）の改定が行われ、業界全体への影響がプラスとなりました。こうした改定タイミングでヘルスケア・介護関連株の株価が動くことが多いため、改定スケジュールを把握しておくことが重要です。

H2: 主要関連銘柄の詳細

ソラスト（6197）は訪問介護・介護施設の運営に加え、医療機関向けの医療事務委託・調剤薬局の事務代行など医療DX支援も手掛けており、介護と医療の双方に事業基盤を持ちます。エムスリー（2413）は医師を会員とする日本最大の医療情報プラットフォームで、製薬会社向けのeプロモーション・求人メディア・オンライン診療プラットフォームなど多様な医療DX事業を展開します。PHCホールディングス（6547）は糖尿病管理機器（血糖測定器）・診断機器・冷凍保存装置をグローバルに提供する医療機器メーカーです。ケアネット（2150）は医師向けオンライン医療教育・製薬会社向けメディカルマーケティングで高い利益率を維持しています。

H2: ジェネリック医薬品・後発薬と薬価改定

介護・医療テーマには医薬品分野との連携も重要です。政府はジェネリック医薬品（後発薬）の使用促進を積極推進しており、先発薬メーカーの売上は長期的に圧迫される一方、ジェネリックメーカー（沢井製薬・東和薬品等）には追い風となっています。薬価改定（2年に一度実施）は医薬品の公定価格を見直すもので、改定のたびに大きな株価変動が生じることがあります。

H2: 予防医療とウェルネスの成長分野

高齢化による医療費増大への対応として政府が注力しているのが「予防医療」です。特定健診・特定保健指導の強化、スポーツジム・フィットネスへの補助、健康増進アプリへの助成など、「病気になる前の健康維持」への投資が拡大しています。企業向けの健康経営（従業員の健康を経営資源として管理する取り組み）への需要も高まっており、健康管理サービス・産業医支援・EAP（従業員支援プログラム）を提供する企業に成長機会があります。

H2: StockWaveJP編集部の見解

ヘルスケア・介護テーマは「確実な需要拡大」という面では最も安心できる構造的テーマの一つです。高齢化は人口統計が変わらない限り不可逆的に進むため、需要の方向性に迷いがありません。ただし株価のパフォーマンスを観察していると、テーマ全体の騰落率が比較的小幅で推移することが多く「大きく上がりにくい代わりに大きく下がりにくい」ディフェンシブな動きが特徴的です。

モメンタム投資の観点では、介護報酬・診療報酬の改定タイミング（3月前後）に突然「転換↑」が現れることがあります。また、エムスリーのような高PERの医療DX銘柄は金利上昇・グロース株調整局面で大きく売られる傾向があり、「ディフェンシブテーマの中の高PER銘柄」という性質上、マクロ環境の変化に敏感に反応します。当編集部はこのテーマを「景気後退局面のディフェンシブな基盤」として活用しながら、デジタルヘルス・介護ロボット分野で成長性の高い銘柄を選別する戦略を推奨します。

H2: まとめと今後の展望

ヘルスケア・介護テーマは「超高齢化社会」という日本特有の構造的変化を最も直接的に反映する投資テーマです。需要拡大の方向性は明確ですが、政府の診療報酬・介護報酬政策・財政制約によって単価の上昇が抑えられるリスクがあるため、コスト管理・生産性向上（デジタル化・ロボット活用）に取り組む事業者が長期的な勝者になる可能性があります。
`},{id:"food-beverage-theme",category:"食品・飲料",icon:"🍱",title:"食品・飲料テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["食品・飲料","農業・フードテック"],keywords:["食品","飲料","値上げ","味の素","日清食品","キリン","原材料費"],summary:"食品・飲料テーマは価格転嫁の定着・原材料費安定化・海外展開強化で収益改善が続いています。ディフェンシブセクターの安定性と成長性を解説します。",body:`
H2: 食品・飲料テーマとは

食品・飲料テーマは調味料・加工食品・インスタント食品・菓子・清涼飲料水・アルコール飲料・乳製品・食肉加工品などを製造・販売する企業を対象とした投資テーマです。生活必需品を提供するため景気に左右されにくいディフェンシブセクターとして位置づけられ、市場が急落する局面でも相対的に安定したパフォーマンスを示しやすいという特性があります。また高配当銘柄が多く、長期保有志向の投資家に人気のテーマでもあります。

H2: 価格転嫁の定着と収益の大幅改善

2022〜2023年にかけて食品各社は原材料費（小麦・大豆・食用油・パーム油・砂糖・乳製品）の高騰・エネルギーコストの上昇・円安による輸入コスト増を背景に、多くの商品で値上げを実施しました。当初は消費者の節約志向から販売数量の一時的な落ち込みもありましたが、2024年以降は値上げが社会に定着し食品企業の収益が大幅に改善しています。

特に顕著なのは利益率の回復です。値上げ前に圧縮されていた売上総利益率（粗利率）が、値上げ定着と原材料費の一部安定化により改善しており、日清食品HD・明治HD・キリンHDなどが過去最高益を更新しました。

H2: 海外展開とグローバルブランドの確立

円安・日本食の世界的ブームを追い風に、食品企業の海外展開が加速しています。味の素（2802）はASEAN（タイ・インドネシア・フィリピン・ベトナム）でうま味調味料・冷凍食品が深く浸透しており、海外売上比率が全体の55%を超えています。日本製品のグローバル認知度向上により、プレミアム価格での販売が可能になっています。

日清食品HD（2897）はカップヌードルを世界100カ国以上で販売しており、中国・米国・英国・インド市場での成長が続いています。2026年にはインド市場向けの現地生産能力を大幅に拡大しました。山崎製パン（2212）は日本最大の製パン企業で、コンビニ・スーパーへの安定供給が強みです。

H2: 機能性食品・健康志向の波

高齢化・健康意識の高まりを背景に、機能性食品（特定保健用食品・機能性表示食品）・植物性食品・低糖質・高タンパク・プロテイン商品の市場が急拡大しています。

明治HD（2269）は「明治R-1ヨーグルト」「明治プロビオヨーグルトLG21」などの機能性ヨーグルトが高い認知度を持ちます。同社のプロテインバー・プロテインドリンクも健康志向の高まりで売上を伸ばしています。大塚HD（4578）はポカリスエット・カロリーメイト・ソイジョイ・FIBE-MINIなどの健康・スポーツ栄養食品で独自の地位を確立しています。

H2: インバウンド需要と日本食の輸出拡大

訪日外国人3,688万人（2024年実績）の増加は日本の食品・飲料メーカーにとっても恩恵をもたらしています。抹茶・わさび・みりん・だし醤油などの日本の伝統的な調味料・食材が訪日外国人に人気となり、帰国後も自国でオンライン購入する需要が生まれています。

農林水産省の農産物・食品輸出額は2023年に初めて1兆円を突破しました。政府は2025年に2兆円・2030年に5兆円の輸出目標を掲げており、食品輸出の拡大に伴うメーカーの海外収益増加が見込まれています。

H2: アルコール飲料と少子化の逆風

ビール・ワイン・ウイスキーなどのアルコール飲料分野では、少子高齢化・若者のアルコール離れという構造的な逆風があります。キリンHD（2503）・アサヒグループHD（2502）・サントリービバレッジ（非上場）は国内アルコール市場の縮小に対応するため、海外展開（キリンはオーストラリア・ミャンマー・フィリピン、アサヒはヨーロッパのCarlsberg・Peroni等）を積極化しています。

一方でノンアルコールビール・RTD（缶チューハイ）・クラフトビール・健康系低アルコール飲料は成長分野です。サントリーの「翠」ジャパニーズクラフトジンが国内外で大ヒットするなど、プレミアム化・差別化が成功のカギとなっています。

H2: 主要関連銘柄の特徴

味の素（2802）はグローバル展開が最も進んだ食品企業で、「アミノ酸・うま味」の分野で世界首位の研究力を持ちます。海外比率・利益率・株主還元のバランスが取れた優良企業として機関投資家に評価されています。日清食品HD（2897）は即席麺・チルド食品でグローバルな認知度を持ちます。明治HD（2269）は乳製品・機能性食品・プロテインで成長が続きます。キリンHD（2503）は国内ビールに加え海外クラフトビール・医薬事業（協和キリン）でのシナジーが評価されています。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は食品価格転嫁の定着・原材料費（小麦・大豆・食用油等）の安定化・海外展開の成果・インバウンド消費増・機能性食品の高い成長率・株主還元強化（増配・自社株買い）です。下落因子は原材料費の再上昇（ウクライナ情勢悪化・異常気象による作物不作）・消費者の節約志向による販売数量減・海外子会社の業績悪化・円高転換による海外収益の目減りです。

食品・飲料テーマはディフェンシブ性が高く、相場全体が下落する局面で他のテーマより相対的に強いパフォーマンスを示しやすい傾向があります。StockWaveJPのテーマヒートマップで「全期間安定した緑」が続いているパターンを確認できれば、中長期の安定保有候補として検討できます。決算期（3月・12月決算が多い）前後の出来高変化にも注目することが有効です。


H2: 食料価格インフレと企業戦略

2022〜2023年に起きた食料品の大幅な値上げ（食料品全体で平均20〜30%以上）は、食品企業にとって「原材料コスト上昇の価格転嫁」という点では一定の成功をもたらしました。消費者の反発を最小化しながら値上げを定着させるために、多くの食品企業が「値上げと同時に商品改良（内容量の見直し・品質向上）」「プレミアム商品の拡充」「コスト削減によるパッケージ変更」という複合的な戦略を採りました。

H2: 国内食品市場の成熟と海外展開

国内の食品市場は少子高齢化・人口減少により長期的な縮小傾向にあります。主要食品メーカーはこの構造問題に対応するため、海外市場（特に東南アジア・北米・欧州）での事業拡大を積極的に進めています。味の素（2802）はASEAN最大の食品メーカーの一つとして、うま味調味料・冷凍食品・アミノ酸・バイオサイエンス事業で海外売上比率55%超を実現しています。

H2: 機能性食品とヘルスケア食品の成長

少子高齢化・健康意識の高まりを背景に、特定保健用食品（トクホ）・機能性表示食品・プロテイン・サプリメント市場が成長しています。明治HD（2269）の「R-1乳酸菌ヨーグルト」「プロテインバー」・大塚HD（4578）のポカリスエット・カロリーメイト・ソイジョイなどの機能性商品は、価格上昇耐性が高く「高付加価値・高利益率」のセグメントとして業績を支えています。

H2: フードロス削減と食のサステナビリティ

日本の食品ロス量は年間約472万トン（2022年度推計）で、一人あたりに換算すると1日約103g（茶碗一杯分のご飯）が捨てられている計算です。食品ロス削減は環境問題だけでなく「コスト削減・利益率向上」という経営課題でもあり、AI需要予測による発注最適化・賞味期限延長技術・余剰食品のECプラットフォーム（KURADASHI等）など多様なアプローチが展開されています。

H2: アルコール飲料業界の変革：ノンアル・低アルの台頭

少子化・若者のアルコール離れ（「ソバーキュリアス」）を背景に、ノンアルコール・低アルコール飲料が急成長しています。キリンHD（2503）の「キリンゼロイチ」・アサヒGHD（2502）の「アサヒドライゼロ」・サントリーの「ALL FREE」などのノンアルビールが市場を形成しています。ワイン・スピリッツのノンアルコール版も欧米で急成長しており、日本への波及も始まっています。

H2: StockWaveJP編集部の見解

食品・飲料テーマを観察していると、相場全体が下落する「リスクオフ局面」での相対的な強さが最も特徴的です。半導体・AI・グロース系テーマが大きく下落する場面でも、食品・飲料テーマは下落幅が小さいか横ばいを維持するというディフェンシブな動きが繰り返されています。StockWaveJPのテーマヒートマップで「食品・飲料だけが緑（上昇）か小幅の赤（小幅下落）」という状態は、市場全体がリスクオフに傾いているシグナルとして活用できます。また原材料価格（小麦・大豆・食用油・砂糖の先物価格）の動向がこのテーマの利益率に直結するため、主要農産物の価格動向のチェックも組み合わせることを推奨します。

H2: 食品・飲料の新潮流：プロテイン・機能性食品市場

健康志向の高まりを背景にプロテイン（たんぱく質）・機能性食品市場が急成長しています。明治HD（2269）は「ザバス（SAVAS）」ブランドのプロテインバー・プロテインドリンクで市場をリードしています。森永製菓（2201）はプロテイン含有ゼリー「inゼリー」が市場を牽引しています。高齢化に伴うサルコペニア（筋肉減少症）対策としての高タンパク食品・介護食市場も成長しています。

H2: まとめ

食品・飲料テーマは「値上げ定着による利益率改善」「海外展開の加速」「機能性食品の成長」という三つの追い風を受けています。景気後退局面でのディフェンシブ性の高さも評価されており、StockWaveJPのテーマヒートマップで「全期間安定した上昇」を示している期間の食品テーマへの投資は、リスク管理を重視した中長期投資として有効なアプローチです。
`},{id:"retail-ec-theme",category:"小売・EC",icon:"🛒",title:"小売・ECテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["小売・EC","リユース・中古品","インバウンド"],keywords:["小売","EC","楽天","ZHD","消費","DX","キャッシュレス"],summary:"EC市場の拡大と実店舗のデジタル化が加速しています。楽天・ZHDのEC戦略、コンビニ・ドラッグストアの展開、消費者行動の変化と主要企業を解説します。",body:`
H2: 小売・ECテーマとは

小売・ECテーマはスーパーマーケット・コンビニエンスストア・ドラッグストア・百貨店・専門店などの実店舗小売業と、インターネット通販（EC）プラットフォーム・決済・物流サービスを提供する企業を対象とした投資テーマです。消費者行動のデジタルシフト・EC市場の継続的な拡大・実店舗のデジタルトランスフォーメーション（DX）が業界の構造変化を加速させています。日本の小売市場は約140兆円規模で、そのうちEC化率は10%程度にとどまっており、今後の拡大余地が大きい分野です。

H2: EC市場の拡大と3強の戦い

日本のEC市場（BtoC物販）は年々拡大を続け、2024年には20兆円超の規模に達しています。楽天市場・Amazon Japan・ZHD（Yahoo!ショッピング・ZOZOTOWN・PayPayモール）の3強が市場をリードしていますが、それぞれ異なる戦略で競争しています。

楽天グループ（4755）は楽天市場・楽天トラベル・楽天銀行・楽天証券・楽天モバイルを組み合わせた「楽天エコシステム」による囲い込み戦略を展開しています。ただし楽天モバイルの設備投資が重く、グループ全体での黒字化が課題となっています。ZHD（4689）はPayPay・LINEとの連携によるオムニチャネル戦略を強化し、特にD（データ）・C（コマース）・F（フィンテック）の三つを軸とした成長を目指しています。

H2: コンビニ業界の国際展開と進化

セブン&アイHD（3382）はセブン-イレブン・イトーヨーカドー・デニーズ・そごう西武を傘下に持つ日本最大の流通グループです。国内コンビニに加え、北米のサークルK（約9,000店）・台湾・タイ・中国など海外に約8万店以上を展開するグローバルコンビニ最大手です。日本のコンビニ業態（高品質・多機能・24時間営業）は世界でも評価が高く、海外展開の成功要因となっています。

ファーストリテイリング（9983）はユニクロ・GUで日本発のグローバルSPAブランドとして圧倒的な存在感を持ちます。2024年度は国内売上が好調な一方、中国事業の回復・北米・欧州市場での拡大が続いており、海外売上比率が60%を超えています。「ヒートテック」「エアリズム」「フリース」など機能性商品のブランド力が世界的に定着しています。

H2: ドラッグストア業界の統合と成長

ドラッグストア業界では大型合併・経営統合が進み、マツキヨコクミンホールディングス（3088）・ウエルシアHD（3141）・ツルハHD（3391）・スギHD（7649）などの大手が勢力を拡大しています。

ドラッグストアは処方箋薬・OTC医薬品・健康食品・化粧品・日用品の「ワンストップ購買」を低価格で提供し、食品スーパーやコンビニとの競争に勝利しています。インバウンド需要（訪日外国人による化粧品・医薬品・健康食品の購入）も大きな収益源となっており、銀座・渋谷・新宿などの観光エリアの店舗は外国人客で常に賑わっています。

H2: 物流・フルフィルメント競争の激化

EC成長を支える物流インフラの整備が競争の最前線となっています。Amazonは独自の物流ネットワークを構築し翌日・当日配送を実現。楽天は日本郵便と提携して「楽天エクスプレス」を展開。ヤマト運輸は大型物流拠点への投資を継続しています。

2024年4月から施行されたトラックドライバーの時間外労働規制（年960時間上限）は「物流の2024年問題」として業界全体に影響を与えています。再配達削減・置き配推進・宅配ロッカーの普及・自動配送ロボット・ドローン配送の実証が各地で進んでいます。

H2: キャッシュレス化とデータ活用

PayPay・楽天ペイ・au PAY・d払い・iD・Suicaなどのキャッシュレス決済の普及により、購買データの収集・活用が小売業の競争力の源泉となっています。購買履歴データを使った「レコメンデーション（おすすめ商品の提示）」「パーソナライズドプロモーション（個人向けクーポン）」の精度が競争力を左右します。

セブン&アイの「セブンペイ（失敗）」を教訓に、大手各社はフィンテックとの連携・独自決済プラットフォームの構築を慎重に進めています。流通業とフィンテックの融合は今後の大きなトレンドです。

H2: 主要関連銘柄と上昇・下落因子

楽天グループ（4755）・ZHD（4689）・セブン&アイHD（3382）・ファーストリテイリング（9983）・イオン（8267）・ウエルシアHD（3141）・マツキヨコクミンHD（3088）・スギHD（7649）が主要銘柄です。

上昇因子はEC市場の継続拡大・実店舗DXの成果顕現・インバウンド消費増・円安による外国人観光客の旺盛な購買・キャッシュレス化の進展・物流効率化によるコスト削減。下落因子は消費者の節約志向強化・配送コスト・人件費の継続上昇・競合激化による価格競争・楽天モバイルの投資負担（楽天の場合）・景気後退による消費全体の縮小です。

StockWaveJPのテーマ別詳細でファーストリテイリング（グローバル成長型）とイオン（国内内需型）の相対パフォーマンスを比較することで、円安・インバウンドの恩恵を受けているセグメントを特定できます。


H2: Eコマース市場の成熟と次の成長ドライバー

日本のEC化率（総小売売上高に占めるEC比率）は2024年時点で約10〜11%と欧米・中国（20〜30%）に比べてまだ低く、今後の伸びしろが大きいとされています。次の成長ドライバーとして注目されるのはSNSコマース（InstagramやTikTokからの直接購買）・ライブコマース（ライブ動画で商品をアピールしながら販売）・D2C（Direct to Consumer：メーカーが消費者に直接販売するモデル）の台頭です。

H2: ユニクロのグローバル戦略

ファーストリテイリング（9983）のユニクロは日本ブランドとして最も成功したグローバル小売企業です。2024年度の連結売上高は3兆円超に達し、海外売上比率が60%を超えました。特に中国（約900店）・東南アジア・欧米・インド市場での展開が加速しており、「機能性・シンプル・手頃な価格」というブランド価値が世界共通に認知されています。「ヒートテック」「エアリズム」「ウルトラライトダウン」などの機能性商品はグローバルでヒット商品として定着しています。

H2: コンビニの進化とDX

セブン-イレブン・ローソン・ファミリーマートの三大コンビニは「単なる便利な店舗」から「生活インフラ・金融拠点・行政サービス窓口」へと進化しています。ATM・公共料金支払い・住民票発行・保険・ネット通販の受取・コーヒー機・銀行口座開設と、コンビニで「社会的インフラ」として機能する場面が拡大しています。AIを活用した「自動発注システム（廃棄ロスを最小化する需要予測）」「セルフレジ・AI決済」の導入も加速しており、人件費削減と顧客利便性向上を同時に実現しています。

H2: ドラッグストア統合と医薬品特化戦略

ドラッグストア業界では大型合併・経営統合が進み、マツキヨコクミンホールディングス（3088）・ウエルシアHD（3141）・ツルハHD（3391）・コスモス薬品（3349）が上位を占めています。近年の差別化戦略として「調剤薬局の併設」「OTC医薬品のセルフメディケーション強化」「PB（プライベートブランド）商品の充実」が重要になっています。特に訪日外国人が化粧品・医薬品・健康食品を目当てに訪れるドラッグストアの免税売上が急増しており、インバウンド消費の重要な受け皿となっています。

H2: StockWaveJP編集部の見解

小売・ECテーマを観察していると、ファーストリテイリング（9983）は時価総額が非常に大きいため、テーマ全体の騰落率に占めるファーストリテイリングの影響力が極めて大きいという特性があります。ファーストリテイリングが好決算で急騰するとテーマ全体の騰落率ランキングが上昇し、モメンタムが改善するように見えますが、実態は「ユニクロ一社の動き」であることがあります。テーマ別詳細でファーストリテイリング以外の構成銘柄（セブン&アイ・イオン・楽天等）の動きも個別に確認することで、テーマ全体の「真の強さ」をより正確に把握できます。消費関連指標（小売業販売額・百貨店売上高）の発表タイミングにも注目しています。

H2: DtoC（ダイレクト・トゥ・コンシューマー）の台頭

メーカーが自社ECサイトや自社アプリで直接消費者に商品を販売するDtoC（D2C）モデルが拡大しています。中間業者（卸・小売）を省くことで高い利益率の実現・顧客データの直接取得・ブランドとのダイレクトな関係構築が可能になります。アパレル・化粧品・食品・スポーツ用品などの分野でDtoCブランドが急増しており、従来の小売流通チャネルを持つ企業にとっては競合の増加を意味します。

H2: まとめ

小売・ECテーマは「EC化率の拡大余地」「実店舗のDX化」「インバウンド消費の恩恵」という三つの成長ドライバーを持ちながら、物流コスト上昇・人件費増加・競争激化という課題に直面しています。ファーストリテイリング（グローバル成長型）とイオン（国内内需型）の相対パフォーマンスをStockWaveJPで比較することで、現在の相場環境での投資スタンス（成長重視か安定重視か）を選択するヒントが得られます。
`},{id:"telecom-theme",category:"通信",icon:"📡",title:"通信テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["通信","光通信","IOWN"],keywords:["通信","NTT","KDDI","ソフトバンク","5G","データセンター"],summary:"5G展開・光ファイバー普及・データセンター需要急増が通信セクターを下支えします。高配当・安定収益のディフェンシブ特性と成長投資のバランスを解説します。",body:`
H2: 通信テーマとは

通信テーマは携帯電話（スマートフォン）・固定通信・光回線・データセンターなどの通信インフラを提供するNTT・KDDI・ソフトバンクの大手3社を中心に、楽天グループや通信機器メーカーを含む投資テーマです。5G展開の加速・データセンター需要の爆発的増加・AI向け通信インフラの整備が成長ドライバーとなっています。高配当・安定収益・インフラとしての景気耐性を持つディフェンシブテーマでありながら、AI・データセンター需要という成長要素も加わり、2024年以降の注目テーマの一つとなっています。

H2: 5G展開と産業応用の広がり

日本での5G（第5世代移動通信）のエリア展開は2020年から始まり、2024年時点で主要都市・主要幹線の人口カバレッジが80%を超えています。5Gの特徴は「高速・大容量（4Gの約20倍）」「超低遅延（1ms以下）」「多数同時接続」の三つで、スマートフォンの高速化だけでなく産業用途での活用が本格化しています。

工場の自動化・遠隔医療（手術ロボット操作）・自動運転車両のリアルタイム制御・スタジアムでの高精細映像配信・農業のスマート化など、5Gを活用した「Society 5.0」実現に向けたユースケースが拡大しています。NTTドコモ・KDDI・ソフトバンクはそれぞれ企業向け「プライベート5G（専用ネットワーク）」の提供を開始しており、製造業・物流・医療機関からの需要が増えています。

H2: データセンター需要の爆発的拡大

通信テーマの最大の成長ドライバーとなっているのが、AIとクラウドコンピューティングの急拡大に伴うデータセンター需要です。ChatGPTに代表される生成AIの普及により、膨大な計算処理を行うデータセンターへの需要が爆発的に増加しています。

NTTは海外データセンター事業を積極拡大しており、欧州・米国・アジアでの施設増設を進めています。NTTのデータセンター事業売上は2025年度に1兆円を超える見通しです。KDDIも企業向けクラウドサービス「KDDI Accelerate 3.0」と組み合わせたデータセンター拡張を進め、AI時代のデジタルインフラとして差別化を図っています。ソフトバンクは孫正義会長が主導する「ソフトバンクグループ」全体でのAI投資と連動し、国内外でのデータセンター・AI半導体への大規模投資を発表しています。

H2: NTTの光技術「IOWN」構想

NTTは2030年代を見据えた次世代通信インフラ「IOWN（Innovative Optical and Wireless Network）」構想を推進しています。IOWNは光技術（フォトニクス）を活用し、現在の電気信号による通信と比べて消費電力を約100分の1に削減しながら、通信速度・容量を大幅に向上させる革新的な技術です。

NTTは2024年に「IOWN 1.0」の商用サービスを開始しており、光データ伝送・光電融合デバイスの実用化が進んでいます。この技術はデータセンターの消費電力問題を解決する技術として世界からも注目されています。

H2: 楽天モバイルの課題と展望

第4のキャリアとして2020年に本格参入した楽天モバイルは、「完全仮想化ネットワーク（Cloud-Native Network）」という革新的なアーキテクチャで差別化を図りましたが、設備投資の重さと顧客獲得コストの高さから多額の赤字が続いています。楽天グループ全体の財務を圧迫し、複数回の社債発行・増資が行われました。

しかし2024年以降は契約者数が増加傾向に転じており、ARPU（契約者1人あたりの月間収益）の改善・通信品質の向上が進んでいます。楽天モバイルが黒字化に成功すれば楽天グループ株価の大幅な上昇要因となる可能性があります。

H2: 携帯料金と政府規制の影響

通信大手3社は政府からの「携帯料金引き下げ」圧力を継続的に受けており、2021年以降の料金改定（菅政権以降）で低価格プランの導入を余儀なくされました。これにより短期的に業績が圧迫されましたが、現在は「安値プランで裾野を広げつつプレミアムプランへ誘導する」戦略が定着し、ARPU（1人あたり月間収益）は回復基調にあります。

H2: 主要関連銘柄の特徴

NTT（9432）は安定した配当（利回り3%台）・自社株買いで長期投資家に人気の高い銘柄です。IOWN構想・データセンター拡大・海外展開が成長ドライバーです。KDDI（9433）は通信とau PAY・auじぶん銀行・auエネルギーを組み合わせた「通信+αの価値」で差別化しており、配当は連続増配を続けています。ソフトバンク（9434）は国内通信事業の安定収益に加え、PayPay・LINE・ZHDを通じたデジタルビジネスとの相乗効果が魅力です。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は5G普及加速・データセンター需要のさらなる急増・AI向け通信インフラ需要・高配当による安定した投資家需要・国内IT投資の拡大・海外データセンター事業の成長です。下落因子は携帯料金引き下げ圧力の再燃・設備投資の重さ（5G・6G・データセンター投資）・楽天モバイルとの価格競争・サイバー攻撃・通信障害によるブランド毀損です。

通信テーマはディフェンシブ性が高く、相場全体が調整する局面でも比較的安定したパフォーマンスを示しやすい傾向があります。StockWaveJPのテーマヒートマップで「全期間安定した緑」を示している場合は長期配当投資の候補として検討できます。AIデータセンター関連ニュースが出た際に出来高が急増することがあり、テーマ別詳細でNTT・KDDIの動きを確認することが有効です。


H2: 5Gの産業利用（B2B）が本格化

スマートフォン向けの一般消費者向け5Gに続き、「産業用5G（PrivateG・企業専用5Gネットワーク）」の展開が加速しています。製造工場・病院・港湾・鉱山・建設現場などでの専用5Gネットワーク構築により、工場内のロボット制御・リアルタイム映像監視・遠隔医療・自動搬送車（AGV）など多様な産業応用が実現します。NTTドコモ・KDDI・ソフトバンクそれぞれが法人向けのプライベート5Gサービスを展開しており、企業のDX投資の増加が通信会社の法人収益を押し上げています。

H2: IOWN（光電融合）の商用展開

NTTが推進するIOWN（Innovative Optical and Wireless Network）構想は、光技術（フォトニクス）を活用して現在の電気信号による通信と比べて消費電力を約100分の1に削減しながら通信速度・容量を大幅に向上させる次世代通信インフラです。2024年に「IOWN 1.0（光電融合デバイスを使ったデータセンター間の高速・省電力通信）」が商用展開されました。AI時代のデータセンターの電力消費問題の解決策として世界から注目されており、Intel・Samsungなどのグローバル企業がIOWNへの参加・協力を表明しています。

H2: 楽天モバイルの転換点

楽天モバイル（楽天グループ4755傘下）は2024〜2025年にかけて損益改善の兆しが出始めています。完全仮想化ネットワーク（Cloud-Native Network）というユニークなアーキテクチャと、テクノロジーの海外ライセンス（Rakuten Symphony）が収益化しつつあります。契約者数が1,000万人を超えたことで「設備投資を回収できる規模」に近づいており、2026年度の黒字化が現実的な目標として見られています。楽天モバイルの黒字転換は楽天グループ株価の大幅上昇要因となる可能性があります。

H2: 衛星通信・非地上ネットワーク（NTN）の台頭

SpaceXのStarlinkに代表される衛星インターネットサービスが日本でも普及しています。離島・山間部・船舶・航空機など従来の地上インフラが届きにくい環境での通信を衛星で補完するNTN（Non-Terrestrial Network）は、5G・6Gの補完インフラとして重要性が高まっています。ソフトバンク（9434）はStarlinkとの提携を通じてNTNサービスを展開しており、KDDIも衛星・地上インフラの統合サービスを推進しています。

H2: StockWaveJP編集部の見解

通信テーマは高配当・安定収益というディフェンシブな特性から、相場全体が不安定な局面での「逃避先」として買われることが多いことを繰り返し確認しています。テーマ一覧で「通信テーマが珍しく騰落率上位に入っている」という状況は、「他のテーマが全体的に売られているリスクオフ相場」の指標として逆説的に機能することがあります。また、NTTは安定した増配実績と自社株買いが評価される「株主還元優良企業」として長期投資家に人気があり、高配当株投資の観点でも当テーマを検討することを推奨します。AIデータセンター・IOWNというグロース要素と高配当というインカム要素を兼ね備えた珍しいテーマとして、ポートフォリオの中での役割を明確にした上で保有することが重要です。

H2: 6G（第6世代移動通信）の開発競争

日本ではNTT・KDDI・ソフトバンクが6Gの技術開発に取り組んでいます。NTTのIOWN（アイオン）構想は光技術を活用した次世代通信インフラで、6G時代のコア技術として世界から注目されています。政府は「Beyond 5G（6G）推進コンソーシアム」を設立し、2030年の商用化・2040年の普及を目標にR&D投資を支援しています。6Gは5Gよりさらに高速・低遅延・大容量で、宇宙・空中通信（ドローン・衛星との統合）も視野に入れた次世代社会インフラです。

H2: まとめ

通信テーマは「5G普及」「データセンター・AI基盤」「6G開発」という三段階の成長ストーリーを持つ長期テーマです。NTT・KDDI・ソフトバンクという安定した高配当・連続増配企業がコアにいる中、AI時代のデータ通信需要という成長要素も加わっています。StockWaveJPのテーマヒートマップで通信テーマの長期的な安定性を確認しながら、AI関連ニュースでの出来高急増タイミングを短期エントリーの参考にすることが有効な投資管理です。
`},{id:"steel-materials-theme",category:"鉄鋼・素材",icon:"🔩",title:"鉄鋼・素材テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["鉄鋼・素材","化学","建設・インフラ"],keywords:["鉄鋼","素材","日本製鉄","JFE","洋上風力","建設","自動車"],summary:"日本製鉄によるUSスチール買収問題が注目を集めました。自動車向け高機能鋼板・洋上風力基礎鋼管・インフラ向け鉄鋼需要の動向を解説します。",body:`
H2: 鉄鋼・素材テーマとは

鉄鋼・素材テーマは鉄鋼・非鉄金属（アルミ・銅・チタン等）・ガラス・セメント・繊維・紙パルプなどの基礎素材を製造する企業を対象とした投資テーマです。製造業・建設業・エネルギー産業の基盤を支える素材産業は、自動車・建設・エネルギーなど幅広い最終需要に連動します。日本製鉄のUSスチール買収問題・高機能鋼板へのEV需要・洋上風力の基礎鋼材・国土強靭化インフラ投資という複数のテーマが重なる注目セクターです。

H2: 日本製鉄のUSスチール買収と地政学リスク

日本製鉄（5401）が2024年に米国の鉄鋼最大手USスチールを約2兆円で買収する計画を発表し、国際的な注目を集めました。USスチールはかつて米国最大の鉄鋼メーカーで、ペンシルベニア州など「ラストベルト」と呼ばれる工業地帯に多くの工場を持ちます。

バイデン政権・トランプ政権ともに「国家安全保障上の懸念」を理由に買収に難色を示し、全米鉄鋼労働組合（USW）も雇用保護の観点から反対を表明。この問題は日本の製造業が海外展開する際の「地政学的リスク」を象徴する事例となりました。日本製鉄は法的手段も含めて買収実現に向けた取り組みを継続しています。

H2: EV向け電磁鋼板の成長分野

電気自動車（EV）の普及に伴い、モーターコアに使われる「電磁鋼板」の需要が急増しています。電磁鋼板はEVの駆動モーターの効率を左右する重要素材で、その品質（エネルギー損失の低さ・高強度・薄板化）がEVの航続距離や性能に直結します。

日本製鉄・JFEホールディングス（5411）・住友金属（日本製鉄グループ）はいずれも高グレードの電磁鋼板で世界トップクラスの競争力を持ちます。EV1台あたりの電磁鋼板使用量はガソリン車の数倍に達するため、EV販売台数の拡大が直接的な需要増につながります。EV普及が本格化する2030年代に向けて、電磁鋼板は鉄鋼テーマの最重要成長分野です。

H2: 洋上風力の基礎鋼管と超大型厚板

洋上風力発電所の建設には大量の鋼材が必要です。海底に打ち込む「モノパイル（基礎杭）」は直径10m以上・重量数百トンの超大型鋼管で、特殊な高強度厚板から製造されます。政府が2040年までに最大4,500万kWの洋上風力導入を目標としており、今後の大型需要が見込まれます。

日本製鉄の君津製鉄所（千葉）・JFEの福山製鉄所（広島）・東京製鐵（5423）などが洋上風力向け厚板・鋼管の供給に参入しています。国産化によってサプライチェーンを確立することで、安定した長期需要が期待されます。

H2: セメント・ガラス・AGCの強み

太平洋セメント（5233）・住友大阪セメント（5232）はインフラ工事・建築向けセメントで安定した需要があります。国土強靭化・洋上風力の基礎工事・半導体工場建設ラッシュがセメント需要を下支えしています。

AGC（5201・旭硝子）は建築用・自動車用・電子材料用ガラスで世界最大手の一角を担います。スマートフォン・タブレット・ノートPCの薄型ガラス・半導体製造用フォトマスク基板・EUV露光用ガラス基板など高付加価値製品で世界首位級のシェアを持ちます。東レ（3402）は炭素繊維複合材料（CFRP）で世界首位を誇り、航空機ボーイング787の機体材料として採用されていることで有名です。炭素繊維は軽量・高強度であるため航空機・自動車・スポーツ用品・風力発電ブレードなど多岐にわたる用途があります。

H2: 中国の過剰供給問題

最大のリスク要因は中国の鉄鋼過剰生産です。中国の粗鋼生産量は世界全体の約50%を占め、国内需要の不振（不動産市場の低迷）を背景に余剰鋼材が輸出に回り、世界市場の鉄鋼価格を押し下げています。欧州・米国・日本が中国産鋼材に対してアンチダンピング措置（関税）を実施していますが、迂回輸出や価格競争は依然続いています。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は自動車生産の回復（特にEV向け高機能鋼板）・洋上風力向け鋼材の大型受注・国土強靭化によるインフラ投資・電磁鋼板など高機能製品の販売拡大・中国鉄鋼の輸出規制緩和（価格安定）・鉄鉱石価格の下落（コスト改善）です。下落因子は中国の大規模ダンピング輸出による価格急落・電炉向け電力コストの上昇・自動車販売の低迷・建設需要の停滞・原材料（鉄鉱石・石炭・合金鉄）の価格急騰です。

中国の経済指標（不動産着工件数・鉄鋼生産量・粗鋼在庫）・自動車販売統計・鉄鉱石先物価格の動向がこのテーマを大きく左右します。StockWaveJPのテーマ一覧で騰落率が急上昇した場合は、資源価格の変動や大型受注のニュースと照合してモメンタムの持続性を判断することが有効です。


H2: 鉄鋼・素材テーマの株価ドライバーまとめ

鉄鋼・素材テーマの株価は「中国経済の動向・資源価格・自動車生産台数・建設需要」という四つの要因が複合的に絡み合っています。中国の景気刺激策（インフラ投資・不動産支援）が発表されると資源・鉄鋼需要が拡大するとの期待から買われ、中国経済の悪化が懸念されると過剰供給・価格下落の懸念で売られます。

原材料価格（鉄鉱石・石炭・合金鉄）の動向も直接的に影響します。鉄鉱石の最大産出国はオーストラリア・ブラジルで、天候・採掘事故・輸出政策の変化がスポット価格に影響します。

H2: USスチール買収問題と日米経済関係

日本製鉄によるUSスチール買収問題は、日米の経済関係・政治問題を象徴する出来事として国際的に注目されました。バイデン政権・トランプ政権ともに「国家安全保障上の懸念」を理由に買収阻止の姿勢を示しており、日本製鉄は法的手段も含めて買収実現を目指し続けています。この問題はトヨタのテキサス工場・ソニーの米国映画事業など「日本企業の米国ビジネス全般」への影響も懸念されており、日米経済関係の今後を占う重要な事例として投資家が注目しています。

H2: StockWaveJP編集部の見解

鉄鋼・素材テーマは「中国の経済指標（PMI・不動産着工件数・インフラ投資額）」に対する感応度が非常に高いことを繰り返し観察しています。中国の景気刺激策が発表された直後に鉄鋼・素材テーマの出来高が急増するパターンは規則的で、中国の国務院会議・全国人民代表大会の開催スケジュールを把握することがこのテーマへの投資タイミング管理に有効と考えています。

また電磁鋼板（EV向け）の需要動向については、主要EVメーカー（テスラ・BYD）の四半期販売台数発表とテーマの動きを照合することで、電磁鋼板需要サイクルとの相関を確認できます。日本製鉄・JFEなどの決算説明資料で電磁鋼板の受注動向を確認することも有効な情報源です。

H2: StockWaveJP活用の実践ポイント

鉄鋼・素材テーマは中国の経済指標（製造業PMI・インフラ投資・不動産着工件数）に最も敏感なテーマの一つです。中国関連ニュースが出た直後にStockWaveJPのテーマ一覧で出来高ランキングを確認し、急変動を起こした銘柄をテーマ別詳細で確認することで、大口投資家の動向を素早く把握できます。鉄鉱石・石炭先物価格のリアルタイム確認とモメンタムの組み合わせが有効です。

H2: まとめと今後の展望

鉄鋼・素材テーマは「中国経済・資源価格・EV需要・インフラ投資」という複合的な要因で動く複雑なテーマですが、日本製鉄・JFEの電磁鋼板（EV向け）・AGCの半導体材料・東レの炭素繊維という高付加価値分野での競争力は世界トップクラスです。汎用品での価格競争よりも高機能品での差別化を選別基準にした投資判断を推奨します。
`},{id:"chemical-theme",category:"化学",icon:"🧪",title:"化学テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["化学","半導体材料","蓄電池"],keywords:["化学","信越化学","住友化学","半導体材料","電池材料"],summary:"化学テーマは汎用化学品とスペシャリティ化学品に大別されます。半導体材料・電池材料・自動車用高機能材料で世界トップを誇る日本化学企業の強みを解説します。",body:`
H2: 化学テーマとは

化学テーマは石油化学（エチレン・プロピレン・ポリエチレン等の汎用品）から半導体材料・電池材料・合成繊維・医薬品原料・塗料・接着剤・農薬・電子材料まで幅広い化学製品を製造する企業を対象としています。「汎用化学品（コモディティケミカル）」と「スペシャリティ化学品（機能性化学・高付加価値品）」に大別され、後者の高付加価値分野で日本企業は世界トップクラスの競争力を持ちます。特に半導体製造プロセス向けの化学材料は日本企業が世界市場を寡占的に支配しており、グローバルな半導体産業の不可欠なサプライヤーとなっています。

H2: 半導体材料で世界制覇する日本企業

化学テーマで最も注目される成長分野が半導体製造プロセス向け化学材料です。半導体の回路を基板に転写する際に使われる「フォトレジスト（感光性樹脂）」、ウェーハを研磨する「CMP（化学機械研磨）スラリー」、洗浄用の「高純度化学薬品」などの分野で日本企業が世界市場を寡占しています。

信越化学工業（4063）はシリコンウェーハ（半導体の基板）で世界最大シェアを誇り、フォトレジストでも世界首位級のシェアを持ちます。同社のシリコンウェーハシェアは約30%で、AIチップ生産に不可欠な最先端300mmウェーハも主要サプライヤーです。JSR（4185・現三菱ケミカルグループ傘下）はフォトレジストで世界シェア20%超、EUV（極端紫外線）対応フォトレジストでも技術的優位を持ちます。東京応化工業（4186）もフォトレジスト・高純度化学品で世界有数のシェアを誇ります。住友化学（4005）はフォトレジスト・半導体フォトマスク基板で重要サプライヤーです。

これらの材料は世界中の半導体メーカー（TSMC・サムスン・インテル・マイクロン）が使用しており、AI・HBM（高帯域メモリ）需要を背景に世界の半導体生産能力が拡張されるほど日本の化学材料メーカーの需要が増加します。

H2: EV電池材料の成長市場

電気自動車（EV）の普及に伴いリチウムイオン電池（LIB）の需要が急拡大しており、電池材料メーカーにとって巨大な成長機会となっています。

電池セパレーター（正極・負極を分離する多孔質フィルム）は電池の安全性・性能を左右する重要部品で、住友化学（ソレクト）・東レ（3402）・旭化成（3407）が世界トップクラスのシェアを持ちます。電解液・正極材・負極材・バインダーなど電池材料のサプライチェーンでも日本企業が存在感を示しています。

全固体電池（次世代EV電池）への移行が進めば使用する材料の種類・量が変化する可能性もあり、素材需要の変化にも対応できる研究開発力が各社の競争力を左右します。

H2: 石油化学の構造不況と再編

汎用石油化学品（エチレン・プロピレン・ポリエチレン等）分野では中国・中東の大型石化コンプレックスの増設により、慢性的な過剰供給・価格競争が続いています。日本の石油化学コンビナートは老朽化が進み、エネルギーコスト・人件費でも中東・中国に比べコスト競争力が劣ります。

三菱ケミカルグループ（4188）・住友化学（4005）・旭化成（3407）・東レ（3402）は石油化学からスペシャリティ化学への転換を進めながら、不採算設備の統廃合・コンビナートの集約化を進めています。国内石化の再編（コンビナート統合）は政府・業界が一体となって推進しており、今後さらに加速する見通しです。

H2: 機能性素材と環境対応材料

化学テーマの新たな成長分野として「機能性素材」と「環境対応材料」があります。機能性素材では東レが「ウルトラスエード（人工皮革）」「高強度炭素繊維（トレカ）」でブランドを確立。旭化成は透析膜・水処理膜・イオン交換膜など高機能膜事業で世界シェアを持ちます。

環境対応では生分解性プラスチック・植物由来原料からの化学品製造（バイオケミカル）・廃プラスチックのケミカルリサイクル技術の開発が加速しています。脱炭素規制強化が追い風となり、環境対応素材への投資・需要が世界的に拡大しています。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は半導体材料需要の増大（AI・HBM需要による半導体生産拡大）・EV電池材料の需要急増・高機能炭素繊維の航空機・スポーツ用途拡大・原油価格の安定化（石化コスト改善）・スペシャリティ分野での差別化製品の拡販です。下落因子は汎用石化品での中国競合の激化・原油価格急騰によるナフサ（石化原料）コスト上昇・半導体サイクルの下降局面（材料需要が減少）・中国経済の悪化による汎用品の価格下落です。

半導体需要サイクル・EV販売統計・原油価格の動向に連動してこのテーマが動きます。テーマ別詳細で信越化学（半導体材料）・住友化学（電池材料）・東レ（炭素繊維）など用途別に銘柄を分類して比較することで、現在どのサブセグメントに資金が集中しているかを把握できます。


H2: 石油化学の構造改革と集約化

日本の石油化学コンビナートは1960〜1980年代の設備が老朽化しており、エネルギーコスト・人件費の高さで中東・中国と比べて国際競争力が低下しています。三菱ケミカルグループ（4188）・住友化学（4005）・旭化成（3407）・東レ（3402）は「選択と集中」として不採算の汎用石化設備を統廃合し、スペシャリティ化学・高機能材料へリソースをシフトする構造改革を進めています。政府（経産省）も「石油化学産業の競争力強化策」として石化コンビナートの集約を後押しており、統廃合が加速する見通しです。

H2: 炭素繊維：日本が誇る超高機能素材

東レ（3402）は炭素繊維複合材料（CFRP）で世界首位のシェアを持ちます。炭素繊維は鉄の4分の1の軽さで鉄の10倍の強度という優れた特性から、航空機（ボーイング787の主翼・胴体に大量採用）・ロケット・高級自動車・スポーツ用品（テニスラケット・自転車・ゴルフクラブ）・風力発電ブレードに不可欠な素材です。EV軽量化・航空機の燃費改善という脱炭素ニーズが炭素繊維の長期的な需要を押し上げています。

H2: 機能性フィルム・電子材料

旭化成（3407）の電池セパレーター（リチウムイオン電池の正負極を分離する高機能フィルム）は世界トップシェアで、EV電池需要の拡大が直接的な追い風です。JSR（4185）は半導体フォトレジストの世界トップメーカーで、三菱ケミカルグループに買収・非上場化されましたが、半導体材料分野での存在感は依然として大きいです。信越化学（4063）のシリコンウェーハ・フォトレジストは半導体産業の心臓部であり、AI・HBM需要による半導体生産拡大の恩恵を最も大きく受ける日本企業の一つです。

H2: バイオ・グリーンケミストリーの台頭

脱炭素・循環経済（サーキュラーエコノミー）の流れを受け、石油由来の化学品を植物由来・廃棄物由来の原料で代替する「グリーンケミストリー」が注目されています。三菱ケミカルグループはPLA（ポリ乳酸：トウモロコシ由来の生分解性プラスチック）、東レはPTT（バイオポリトリメチレンテレフタレート）など植物由来の機能性素材を展開しています。廃プラスチックのケミカルリサイクル（化学的に分解して再び原料として使う）も各社が取り組む重要テーマです。

H2: StockWaveJP編集部の見解

化学テーマを観察していると、「半導体サイクル」と「EV販売動向」という二つのメガトレンドが同時に当テーマを動かしていることがわかります。半導体需要が好調な局面では信越化学・JSRなどの半導体材料銘柄が牽引し、EV需要が加速する局面では東レ・旭化成の電池材料・炭素繊維銘柄が強くなるというパターンが見られます。化学テーマ全体が同時に上昇するよりも「サブセクターごとに異なる動き」をすることが多く、テーマ別詳細で構成銘柄を個別に比較することが特に重要なテーマです。StockWaveJPで出来高が急増した銘柄がどのサブセクターに属するかを確認し、そのサブセクターのカタリスト（半導体好調なのかEV好調なのか）を把握することで、次の動きを先読みできます。

H2: 化学テーマの長期投資戦略

化学テーマへの投資において長期的に最も安定したリターンが期待できるのは「スペシャリティ化学品（高機能材料）」に特化した企業です。信越化学工業はシリコンウェーハとフォトレジストという世界首位の製品を持ち、どちらもAI・半導体需要の構造的成長に連動します。汎用石化品の市況変動リスクが少ない分、株価の安定性が高く長期投資に適しています。

H2: まとめ

化学テーマは「汎用品の競争激化」と「高機能材料の構造的成長」という二つの顔を持ちます。信越化学・JSR・東京応化工業などの半導体材料特化企業と、東レ・旭化成・住友化学などの総合化学企業を分けて評価し、現在の半導体サイクルの位置（拡大期か調整期か）をStockWaveJPのテーマデータと照合することが有効な分析手法です。
`},{id:"construction-infra-theme",category:"建設・インフラ",icon:"🏗️",title:"建設・インフラテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["建設・インフラ","国土強靭化計画","下水道"],keywords:["建設","インフラ","大成建設","鹿島","国土強靭化計画","公共工事"],summary:"国土強靭化計画・半導体工場建設ラッシュ・洋上風力基礎工事が建設需要を底上げしています。スーパーゼネコン4社を中心に建設インフラテーマの構造を解説します。",body:`
H2: 建設・インフラテーマとは

建設・インフラテーマは土木・建築工事を請け負う総合建設会社（ゼネコン）、橋梁・トンネル・港湾などの専業建設会社、道路・鉄道・上下水道・電力インフラの設備・管理に関わる企業を対象とした投資テーマです。政府の公共投資・民間の設備投資・インフラ老朽化更新という三つの需要軸が重なり、2024〜2026年の建設業界は歴史的な受注ブームを迎えています。

H2: 国土強靭化×半導体工場×洋上風力の三重奏

2024〜2026年の建設需要を特徴づけるのは「国土強靭化・半導体工場・洋上風力」という三つの大型需要が同時に発生していることです。これほど多くの超大型プロジェクトが重なる時期は建設業の歴史の中でも稀で、スーパーゼネコン4社（大成建設・鹿島建設・清水建設・大林組）はいずれも受注残が過去最高水準に達しています。

国土強靭化では道路・橋梁・河川堤防・上下水道・学校施設の老朽化更新・耐震化工事が全国各地で進んでいます。政府は2026年以降も継続的な投資を計画しており、5か年計画の次期版策定が進んでいます。

半導体工場建設ラッシュでは、TSMC熊本第1工場（2024年開業）・第2工場（2027年予定）・Rapidus（ラピダス）の北海道千歳工場・マイクロン広島工場拡張など、外資系半導体メーカーが日本各地に最先端工場を建設しています。これらは数千億〜1兆円規模のプロジェクトで、ゼネコン・設備工事会社に莫大な受注をもたらしています。

洋上風力では政府が2040年までに最大4,500万kWの導入目標を掲げ、東北沖・北陸沖・九州沖での大型プロジェクトが動き始めています。風車の基礎工事（海底地盤調査・モノパイル打設）・海底ケーブル敷設・港湾整備などで海洋土木会社に特需が生まれています。

H2: スーパーゼネコン4社の強さと差別化

大成建設（1801）は超高層ビル・複雑な地下工事・原子力施設で実績が多く、東京の大型再開発プロジェクトを多数手掛けています。鹿島建設（1812）はトンネル・海洋土木・原子力・海外展開（アジア・米国）に強みを持ちます。清水建設（1803）は病院・研究施設・クリーンルームなど医療・先端産業向けで高い技術力を持ちます。大林組（1802）は鉄道インフラ（新幹線・地下鉄）・大規模地下空間工事・海外PPP（官民連携）事業で差別化しています。

これら4社に共通するのは「設計・調達・施工をワンストップで提供するEPC能力」で、半導体工場・洋上風力など複雑な技術要件を持つプロジェクトをカバーできる点が中堅・地場ゼネコンとの差別化ポイントです。

H2: 海洋土木企業への特需

洋上風力発電所の基礎工事・海底ケーブル埋設・大規模護岸工事を手掛ける海洋土木会社も特需の恩恵を受けています。五洋建設（1893）は海洋土木の最大手で、国内・東南アジアでの実績が豊富です。東洋建設（1890）も海洋土木に強く、洋上風力向けの施工機械・工法開発を進めています。東亜建設工業（1885）・深田サルベージ建設も海洋工事で存在感を示しています。

H2: 資材・人件費高騰という課題と対応

建設需要が急増する一方で、資材（鉄鋼・セメント・木材）の価格高騰と技能労働者（大工・鉄筋工・溶接工）の深刻な不足が収益を圧迫しています。2024年4月の建設業の残業規制強化（年960時間上限）により、工期延長・人件費上昇が避けられない状況です。

大手ゼネコンはBIM（建築情報モデリング）・プレファブ化（工場での部材製作・現場組立）・ロボット施工（鉄筋配置ロボット・溶接ロボット）の導入で生産性向上と人手不足対応を進めています。

H2: 建設コンサルタントとメンテナンス市場

インフラの老朽化が進む中、点検・診断・補修のメンテナンス市場が成長しています。橋梁・トンネル・上下水道のドローン点検・センサーモニタリング・AI劣化診断などのデジタルインフラ保全技術を提供する企業にも投資機会があります。建設技術研究所（9621）・日本工営（9567）・パシフィックコンサルタンツ（非上場）などの建設コンサルタントも安定した収益基盤を持ちます。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は国土強靭化の次期計画確定・半導体工場建設の追加発注・洋上風力の入札結果・補正予算成立・大型再開発プロジェクトの着工決定・建設資材価格の安定化です。下落因子は資材・人件費のさらなる高騰による採算悪化・職人不足による工期遅延・完工損失リスク・公共工事の競争激化による受注価格下落・財政緊縮による公共投資削減です。

補正予算の成立・大型工場建設の発表・自然災害後の復旧工事着手などのニュースが出た際にこのテーマの出来高が急増する傾向があります。StockWaveJPのテーマヒートマップで建設・インフラテーマの短期（週次）に急変動が起きたタイミングを確認し、モメンタムの「転換↑」シグナルが出た銘柄を個別に確認することが有効な投資分析手法です。


H2: 受注残の水準と今後の業績見通し

スーパーゼネコン4社（大成建設・鹿島建設・清水建設・大林組）の受注残は2024〜2025年度にかけて過去最高水準を更新しました。受注残とは「すでに受注済みで、まだ工事が完了していない案件の合計金額」であり、今後数年分の仕事が確定していることを意味します。大成建設の受注残は3兆円超、鹿島・清水・大林組もそれぞれ2〜3兆円規模に達しており、数年間は安定した業績が続く見通しです。

H2: 大阪・関西万博と再開発需要

2025年に開催された大阪・関西万博は、万博会場（夢洲）の整備・周辺インフラ整備・大阪都心の大型再開発を加速させました。梅田・難波・天満橋などの大阪都心では大型複合ビル・ホテルの建設が相次いでおり、西日本における建設需要の拡大に貢献しています。万博後も、IR（統合型リゾート）の建設準備・夢洲の開発が継続する見通しです。

H2: 国際展開と新興国市場

大手ゼネコンは国内市場の成熟を補うため、新興国での建設事業を拡大しています。大林組・鹿島建設はASEAN（シンガポール・ベトナム・インドネシア）での都市開発・鉄道インフラに実績があります。PPP（官民連携）事業として、新興国政府と長期の維持管理契約を含む「コンセッション（運営権）」を取得するビジネスも拡大しており、安定した長期収益源となっています。

H2: BIMとデジタル建設の加速

BIM（Building Information Modeling）は建物の設計・施工・維持管理を3次元デジタルモデルで統合管理する技術です。BIMの普及により、設計変更の手戻り削減・施工精度向上・維持管理の効率化が実現され、建設業の生産性向上に大きく貢献します。2023年からBIMの活用が建設工事の標準要件に加わりつつあり、BIM対応能力が受注競争力を左右するようになっています。ゼネコン各社が自社のBIMエンジニアの育成・外部BIMソフトウェアへの投資を加速させています。

H2: StockWaveJP編集部の見解

建設・インフラテーマは「決算発表サイクル」に注目することが重要と感じています。大手ゼネコンは3月決算が多く、5月の通期決算発表と11月の中間決算発表が業績確認の重要タイミングです。「受注残が過去最高を更新」「受注が計画を上回る」という決算内容が発表されると出来高が急増することを繰り返し確認しています。また建設テーマは受注残の豊富さから「業績の先行きが見えやすい」という特性があり、複数年にわたる安定した業績予想が立てやすいことが長期投資家に好まれます。StockWaveJPのモメンタムが「横ばい〜転換↑」のタイミングで決算発表が重なる局面は、エントリーを検討する好機です。

H2: 建設業界のDXと生産性革命

人手不足と残業規制への対応として、大手ゼネコンを中心にBIM（建築情報モデリング・3Dデジタルモデルで設計・施工・維持管理を統合）・ICT施工（GPSを使った自動制御の建設機械）・ドローン測量の導入が急速に進んでいます。これらのDX投資は短期的にはコスト増要因ですが、中長期的には生産性向上・人件費削減・工期短縮につながり収益改善をもたらします。

H2: まとめ

建設・インフラテーマは「国土強靭化×半導体工場×洋上風力」という三重の特需が重なる歴史的なブームの中にあります。スーパーゼネコン4社の受注残は過去最高水準にあり、数年分の仕事が確定している状態です。資材・人件費高騰というリスクを意識しながら、補正予算・大型工場建設発表のカタリストとStockWaveJPのモメンタム変化を組み合わせた定期確認を推奨します。
`},{id:"transport-logistics-theme",category:"輸送・物流",icon:"🚢",title:"輸送・物流テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["輸送・物流","造船","ドローン"],keywords:["輸送","物流","海運","空運","日本郵船","商船三井","2024年問題"],summary:"物流2024年問題・EC拡大・海運運賃の動向が注目されています。コンテナ船・タンカー・航空貨物・陸上物流の各セグメントと主要企業の戦略を解説します。",body:`
H2: 輸送・物流テーマとは

輸送・物流テーマは外航・内航海運（コンテナ船・タンカー・バルカー・LNG船）・航空旅客・航空貨物・宅配・路線トラック・倉庫・フォワーディング（貨物取扱）など輸送・物流全般に関わる幅広い企業を対象とした投資テーマです。グローバルサプライチェーンの動向・燃料費・為替・Eコマースの拡大・2024年問題（ドライバーの時間外労働規制）が主要な変動要因となっています。

H2: コンテナ海運：地政学リスクと運賃の乱高下

日本郵船（9101）・商船三井（9104）・川崎汽船（9107）の海運3社は2020〜2022年のコロナ禍における世界的なサプライチェーン混乱でコンテナ船運賃が10倍以上に急騰し、空前の利益を計上しました。3社合計の純利益は2022年度に約3.4兆円に達し、日本企業としては異例の規模でした。

しかし2023年以降は運賃が急落し業績が大きく悪化。2024年前半には紅海問題（フーシ派による船舶攻撃）でスエズ運河迂回が増加し、再び運賃が急騰しました。2025年以降はパナマ運河の渇水問題・米国関税政策の変動なども運賃に影響を与えています。このように海運運賃は地政学・気候・政策に敏感に反応する特性を持ちます。

H2: LNGタンカーと資源輸送

日本郵船・商船三井はLNG（液化天然ガス）輸送専業のLNGタンカーを多数保有しており、長期用船契約（15〜20年）に基づく安定した収益があります。ロシアのウクライナ侵攻以降、欧州がロシア産ガスから代替調達に転換し、カタール・オーストラリア・米国産LNGの需要が拡大。LNG輸送需要の長期的な成長が見込まれます。

自動車専用船（PCC: Pure Car Carrier）も日本郵船・商船三井・川崎汽船が世界最大規模の船隊を持ち、日本・韓国・欧州からの自動車輸出拡大に伴う安定収益源となっています。

H2: 2024年問題と陸上物流の大変革

2024年4月から施行されたトラックドライバーの時間外労働規制（年960時間上限）は「物流の2024年問題」として業界全体に影響を与えています。規制により輸送能力が10〜15%低下するとも試算されており、荷主企業・物流会社が対応を迫られています。

ヤマトホールディングス（9064）は宅配事業の合理化（ネコポスから日本郵便への委託移行）・法人向け大型配送への注力で構造改革を進めています。SGホールディングス（佐川急便・9143）は法人向け幹線輸送に強みを持ち、中継輸送・共同配送の導入で対応しています。日本郵便は郵便事業の減収をゆうパック・ゆうパケットの拡大でカバーしようとしています。

H2: 航空旅客・貨物の完全回復

コロナ禍（2020〜2022年）で壊滅的な打撃を受けた航空旅客需要は2023年に完全回復し、2024年以降は訪日外国人の急増を追い風に国際線の搭乗率・旅客単価が過去最高水準を更新しています。

ANAホールディングス（9202）は国際線の収益回復に加え、格安航空会社（LCC）のピーチ・バニラエアの再編によるLCC事業の拡大を進めています。JAL（9201）は2010年の破綻・再上場を経て財務基盤が強固になり、国内外の旅客需要の旺盛さを背景に堅調な業績が続いています。航空貨物では半導体・医薬品など高付加価値品の輸送需要が安定しています。

H2: 物流DXと自動化の進展

人手不足・コスト上昇に対応するため、物流業界全体でデジタルトランスフォーメーション（DX）と自動化が加速しています。大型倉庫へのAMR（自律走行ロボット）・GTP（Goods to Person、商品を人のところへ）システムの導入、AIを活用した配送ルート最適化・需要予測、電動小型配送ロボット・ドローン配送の実証などが進んでいます。

H2: 主要関連銘柄と上昇・下落因子

日本郵船（9101）・商船三井（9104）・川崎汽船（9107）・ANAホールディングス（9202）・JAL（9201）・ヤマトホールディングス（9064）・SGホールディングス（9143）が主要銘柄です。

上昇因子は海運運賃の急騰（地政学リスク・需給逼迫）・訪日旅行者増加による航空需要の回復・EC物流需要の拡大・物流DXによるコスト削減・LNG・自動車輸送の安定需要です。下落因子は海運運賃の急落リスク（供給過剰・需要低迷）・航空燃料（ジェット燃料）・重油価格の高騰・ドライバー不足による輸送コスト増・中国景気後退による海上荷動き減少です。

地政学リスク（中東情勢・パナマ運河水不足・米中関係）に対してこのテーマが敏感に反応します。テーマ別詳細で海運3社の騰落率・出来高急増を確認し、出来高増加を伴う騰落率の上昇は地政学的要因による運賃急騰のシグナルとして注目できます。


H2: 海運三社の財務戦略と株主還元

コロナ禍の超高運賃で積み上げた巨大なキャッシュを、日本郵船・商船三井・川崎汽船の三社はどう活用するかが注目されています。三社それぞれが積極的な自社株買い・配当増額を実施したことで、「高配当×自社株買い」銘柄として長期投資家からの需要が生まれました。日本郵船は株主還元と並行して次世代燃料（アンモニア・LNG・メタノール）対応船の建造投資を拡大しており、2050年カーボンニュートラルに向けた「脱炭素船隊」への転換投資が進んでいます。

H2: 物流の2024年問題の影響と対応策

2024年4月施行の「物流の2024年問題」はトラック運送業界に大きな変化をもたらしました。時間外労働規制によりドライバー一人あたりの年間輸送量が約10〜15%減少するとされており、荷主企業は「積み合わせ輸送（複数荷主の荷物を混載）」「中継輸送（長距離を中継ポイントで乗り継ぐ）」「モーダルシフト（トラックから鉄道・船舶へ転換）」への対応を迫られています。物流コストの上昇は消費財・食品・建材などあらゆる商品価格に波及しており、インフレの構造的要因の一つとなっています。

H2: 自動化・DXで変わる物流業界

人手不足・コスト上昇への対応として、物流業界全体で自動化・デジタル化が加速しています。大型倉庫へのAMR（自律走行搬送ロボット）・GTP（商品を人のところへ搬送するシステム）・AIによる配送ルート最適化・デジタルインボイス（電子的な輸送書類）の導入が急速に進んでいます。ヤマトホールディングス（9064）は大規模な物流自動化投資（宅急便の仕分け自動化・ロボット配送の実証）を推進しており、長期的なコスト競争力向上を目指しています。

H2: 電動化・脱炭素が変える輸送業

脱炭素規制の強化により、輸送業界でも電動化・代替燃料への転換が急務となっています。EV配送トラック（ヤマト・佐川が導入を拡大）・LNG燃料船（商船三井・日本郵船が新造船に採用）・水素燃料電池トラック（トヨタ・本田の実証）など、輸送手段の低炭素化が多方面で進んでいます。欧州ではカーボン国境調整メカニズム（CBAM）が導入されており、国際輸送に関わる日本の物流・海運会社にとっても脱炭素対応が長期的な競争力に直結します。

H2: StockWaveJP編集部の見解

輸送・物流テーマを継続的に観察していると、海運三社（日本郵船・商船三井・川崎汽船）はほぼ同じタイミングで騰落率・出来高が動く「三社連動パターン」が顕著です。ただし詳細に比較すると、LNG輸送の比率・コンテナ船比率・資本政策（配当性向・自社株買い規模）の違いにより、三社の株価パフォーマンスに差が生まれることもあります。テーマ別詳細ページで三社の騰落率を並べて比較することで、どの企業に資金が最も集中しているかを把握できます。地政学的緊張が高まる局面（中東情勢・台湾海峡緊張）では三社ともに出来高が急増するため、地政学ニュースとの照合を習慣化することを推奨します。

H2: 物流テクノロジーとスタートアップの台頭

物流の2024年問題対応として、AI・ロボット・IoTを活用した物流テクノロジースタートアップへの投資が急増しています。AGV（自動搬送ロボット）・AMR（自律走行ロボット）・無人フォークリフト・AI需要予測・配送最適化システムなどが実用化され、大手物流企業との提携が進んでいます。物流ロボットのMujin（非上場）・AI配送最適化のFLEXY（非上場）など新興勢力が業界を変革しつつあります。

H2: まとめ

輸送・物流テーマは「海運運賃の乱高下」という短期的な投機要素と「EC物流・2024年問題対応・航空旅行回復」という中長期の成長要素が混在するテーマです。海運3社の地政学的な動きとJNTO訪日統計の両方を追いながら、StockWaveJPのモメンタムデータで現在市場が注目しているサブセクター（海運か航空か物流か）を見極めることが投資判断の精度向上につながります。
`},{id:"fintech-theme",category:"フィンテック",icon:"💳",title:"フィンテックテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["フィンテック","仮想通貨","ネット銀行","銀行・金融"],keywords:["フィンテック","キャッシュレス","PayPay","マネーフォワード","freee","BNPL"],summary:"キャッシュレス化の普及・家計管理アプリの成長・中小企業向けSaaSの拡大でフィンテックテーマが成長しています。日本のフィンテック市場の構造と主要プレイヤーを解説します。",body:`
H2: フィンテックテーマとは

フィンテック（FinTech: Financial Technology）テーマはスマートフォン決済・デジタルバンキング・家計管理アプリ・法人向け会計SaaS・後払い決済（BNPL）・暗号資産・ロボアドバイザー・保険テックなど、テクノロジーを活用した金融サービスを提供する企業を対象とした投資テーマです。日本では現金決済大国からキャッシュレス社会への転換が続いており、フィンテック企業の成長機会が広がっています。

H2: キャッシュレス化の進展と現状

日本のキャッシュレス決済比率は2023年に40%を突破し、政府目標を達成しました。主な要因はQRコード決済（PayPay・楽天ペイ・au PAY・d払い）の急速な普及です。PayPayは2018年のサービス開始からわずか数年でユーザー数6,000万人を超え、コンビニ・スーパー・飲食店から個人間送金まで日常的な決済手段として定着しました。

ただし欧州・中国（70〜80%）と比べるとまだ低水準で、2030年に80%という政府の新目標達成に向けてさらなる拡大が見込まれます。特に現金比率が高い中小企業・個人商店・農水産業・医療・交通での普及拡大が次の成長ドライバーです。

H2: 法人向けSaaSの急成長

中小企業・フリーランス向けの会計・請求書・給与・経費精算・勤怠管理などのクラウドSaaSが急成長しています。マネーフォワード（3994）はクラウド会計・給与・請求書・経費精算・確定申告・連結決算をワンプラットフォームで提供する「マネーフォワード クラウド」が中小企業・フリーランスに広く普及しています。2024年度に初の通期黒字化を達成し、SaaS企業として成熟段階に入りました。

freee（4053）も会計・人事労務SaaSで急成長を続けており、マネーフォワードと激しいシェア争いを展開しています。インフォマート（2492）は企業間の請求書電子化（BtoB電子取引プラットフォーム）で高いシェアを持ちます。電子インボイス制度（2023年10月施行）が追い風となり、法人向けフィンテックSaaSの需要がさらに高まっています。

H2: BNPL・デジタルレンディングの成長

後払い決済（BNPL: Buy Now Pay Later）は特に若年層・Z世代を中心に普及が拡大しています。クレジットカードを持ちにくい若者層・審査が通りにくい個人に対して、簡易な審査・後払い・分割払いを提供するBNPLは新たな信用インフラとして機能しています。

ネットプロテクションHD（7383）はECサイト向けBNPL「NP後払い」「atone」で国内先駆者として存在感を持ちます。LINE Pay・PayPay後払い・メルペイスマート払いなど大手プラットフォームもBNPL機能を強化しています。

H2: 暗号資産・Web3の動向

2024年に米国でビットコインETFが相次いで承認（ブラックロック・フィデリティ等）されたことを機に、機関投資家の暗号資産への参入が本格化しました。ビットコイン価格は2024年に1BTC=1,000万円を超え、暗号資産取引所を運営するGMOフィナンシャルHD（7833）・SBIホールディングス（8473）・マネックスグループ（8698）などの株価も上昇しました。

NFT（非代替性トークン）・DeFi（分散型金融）・Web3など新しい概念を活用したビジネスモデルの商業化も進んでおり、大手企業（ソニー・セガ・バンダイナムコ等）がNFTゲーム・デジタルコンテンツ領域に参入しています。

H2: ロボアドバイザーと資産運用の民主化

ウェルスナビ（7342）・THEO（お金のデザイン、非上場）などのロボアドバイザーサービスは、少額から分散投資・自動リバランスを実現し、投資初心者の資産形成を支援しています。NISAの普及・老後資産形成への関心の高まりを追い風に、自動化された資産運用サービスへの需要が拡大しています。

H2: 主要関連銘柄と上昇・下落因子

マネーフォワード（3994）・freee（4053）・インフォマート（2492）・BASE（4477）・GMOペイメントゲートウェイ（3769）・ネットプロテクションHD（7383）・ウェルスナビ（7342）・SBIホールディングス（8473）・マネックスグループ（8698）が主要関連銘柄です。

上昇因子はキャッシュレス化率の向上・電子インボイス・マイナンバー活用の拡大・中小企業DXの進展・ビットコイン等の暗号資産価格上昇・BNPL市場の拡大・黒字化の達成（SaaS系）です。下落因子はPayPayなど大手の過剰な値引き競争・金融庁の規制強化（暗号資産・BNPL）・サイバー攻撃・個人情報流出・黒字化の遅れによる投資家離れ・金利上昇によるグロース株バリュエーションの圧縮です。

決済関連指標・電子インボイス登録数・大手プラットフォームの利用者数などの発表でこのテーマが動きやすい傾向があります。テーマ一覧でフィンテックの騰落率・出来高をチェックし、モメンタムが「転換↑」に転じたタイミングを好決算や業界規制緩和のニュースと照合することが有効です。


H2: マイナンバーとデジタル化の加速

マイナンバーカードの普及（2024年に保有率が約70%超に）・マイナ保険証への統合・健康保険証との統合が進む中、医療・金融・行政の各分野でのデジタル化が加速しています。特に金融分野では「マイナカードを使った本人確認（eKYC）」により、銀行口座開設・証券口座開設・ローン申込がスマートフォンだけで完結するサービスが広がっています。これらのデジタル化を支援するID認証・eKYCサービス・API接続プラットフォームを提供するフィンテック企業に商機があります。

H2: オープンバンキングと金融インフラの開放

金融庁の政策としてオープンバンキング（銀行の口座情報・取引情報をAPI経由で第三者のサービスが利用できる仕組み）の整備が進んでいます。マネーフォワード・freeeなどの家計管理・法人会計SaaSは銀行APIを通じてユーザーの口座残高・取引履歴を自動取得し、リアルタイムでの資金管理を可能にしています。この「金融データの民主化」によりフィンテックサービスの品質と利便性が急速に向上しています。

H2: デジタル円（CBDC）の研究と影響

日本銀行はデジタル円（CBDC: Central Bank Digital Currency）の実証実験を進めています。デジタル円が実用化された場合、現在の銀行決済システム・電子マネー・クレジットカードに大きな影響が生じる可能性があります。フィンテック企業にとってはCBDCインフラへの接続・CBDC対応ウォレットの開発という新たなビジネス機会となる一方、既存の決済ビジネスとの競合も懸念されます。実用化は2030年代以降と見られていますが、研究の進展に注目が集まっています。

H2: STO（セキュリティトークンオファリング）と金融の民主化

ブロックチェーン技術を活用したSTO（Security Token Offering：デジタル証券の発行）が金融商品の取引を変える可能性があります。不動産・未公開株・アート・インフラの権益をトークン化して小口で売買できるようにすることで、これまで富裕層や機関投資家にしかアクセスできなかった資産への個人投資を可能にします。三菱UFJ・野村ホールディングスなどの大手金融機関もSTO事業に参入しており、フィンテックと既存金融機関の融合が進んでいます。

H2: StockWaveJP編集部の見解

フィンテックテーマを観察していると、マネーフォワード・freeeなどのSaaS系銘柄は「黒字化の達成・四半期業績の上振れ」に対して株価が大きく反応することを確認しています。特にARR（年間経常収益）の成長率が加速しているという決算内容が出た直後に出来高急増・株価急騰というパターンが繰り返されています。SaaSビジネスの特性として「一度導入されたシステムはなかなか解約されない（スイッチングコストが高い）」ため、ARRが順調に増加している企業は長期的に安定した収益成長が見込めます。フィンテックテーマ全体のモメンタムとSaaS個別銘柄の四半期決算を組み合わせた投資判断を推奨します。

H2: フィンテックとレガシー金融機関の「協業」

フィンテックスタートアップとメガバンク・大手証券会社の協業（コペティション）が加速しています。三菱UFJはマネーフォワードとAPI連携、SBIホールディングスは地方銀行とのデジタルバンク構築、三井住友フィナンシャルグループはSBI証券・freeeとの連携を強化しています。「フィンテック企業が単独でフルバンキングサービスを提供する」時代よりも「既存金融機関とフィンテックが協業してデジタルサービスを提供する」という「バンキング・アズ・ア・サービス（BaaS）」モデルが主流になってきています。

H2: まとめ

フィンテックテーマは「キャッシュレス化の進展」「法人DXの加速」「デジタル資産・暗号資産の制度整備」という三つの成長エンジンを持ちながら、黒字化への時間軸・規制リスク・大手との競争という課題も抱えています。StockWaveJPでフィンテックテーマのモメンタムを追いながら、個別銘柄のSaaS指標（MRR・解約率・ARR成長率）も確認する複合的なアプローチが推奨されます。
`},{id:"robot-automation-theme",category:"ロボット・自動化",icon:"🤖",title:"ロボット・自動化テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["ロボット・自動化","フィジカルAI","AI半導体"],keywords:["ロボット","自動化","ファナック","安川電機","AI","スマート工場"],summary:"人手不足・工場自動化需要・AI活用による産業ロボットの進化が続いています。日本が世界首位を誇る産業用ロボット分野の競争環境と主要メーカーの成長戦略を解説します。",body:`
H2: ロボット・自動化テーマとは

ロボット・自動化テーマは産業用ロボット・協働ロボット（コボット）・自動化システム・マシンビジョン・サービスロボット・AMR（自律走行搬送ロボット）など、人の作業を代替・補助するロボット技術全般を製造・提供する企業を対象とした投資テーマです。日本は産業用ロボットの累積設置台数・輸出金額で世界トップクラスを誇り、ファナック・安川電機・川崎重工業などのメーカーがグローバル市場をリードしています。深刻な人手不足・スマート工場化の加速・AI技術との融合という三つの力がこのテーマを強力に後押ししています。

H2: 日本が誇る産業用ロボットの世界的競争力

産業用ロボットとは工場の生産ラインで溶接・組立・塗装・搬送・検査などの作業を自動で行う多関節ロボットです。国際ロボット連盟（IFR）によれば、世界の産業用ロボット年間設置台数は2023年に57万台を超え、2030年には年間100万台に達する見通しです。

日本はロボット技術のブランド力・品質・精度において世界最高水準を誇ります。ファナック（6954）はCNC装置・産業用ロボット・ファクトリーオートメーション機器で世界トップシェアを持ち、「ロボットのロボット（ロボットがロボットを製造する工場）」を実現した企業として有名です。安川電機（6506）はMOTOMANシリーズの溶接・塗装・組立ロボットで世界トップシェアを誇り、半導体・液晶パネル製造向けクリーンルームロボットでも実績があります。川崎重工業（7012）は宇宙・航空・摩擦攪拌接合など特殊分野に強みを持ちます。

H2: 人手不足が生む構造的な需要

日本の製造業・物流・建設業では少子高齢化による労働力不足が深刻化しており、ロボット・自動化への需要が構造的に高まっています。2030年には日本全体で644万人の労働力が不足するという試算もあり、人手に依存してきた現場の自動化は企業の生存に関わる課題となっています。

従来は「危険・重労働・単純反復（3K）作業」を中心にロボットが導入されてきましたが、近年はより複雑な「組立・検査・食品加工・物流仕分け・清掃・警備」など多様な作業へ適用範囲が拡大しています。人口減少が続く日本において、ロボット産業の成長は長期的に確実な構造的追い風の上にあります。

H2: 協働ロボットとAI搭載ロボットの台頭

従来の産業用ロボットは安全フェンスで人と隔離する必要がありましたが、協働ロボット（コボット）は人と隣り合って安全に作業できる設計で、中小製造業でも導入しやすい特性を持ちます。デンマークのUniversal Robots（UR、テラダイン傘下）が市場をリードしていますが、ファナック・安川電機・川崎重工・DENSO（6902）なども協働ロボットラインアップを強化しています。

AI・機械学習の進化により、「自ら学習して動作を改善する」インテリジェントロボットが実用化されています。カメラで物体の形状・位置を認識してランダムな向きのワークを掴む「ビン・ピッキング」、人の動作をAIで学習して再現する「ダイレクト・ティーチング」など、従来は人間にしかできなかった作業の自動化が可能になっています。

H2: 半導体・液晶製造向け精密ロボットと要素部品

半導体ウェーハ搬送・液晶パネル組立・プリント基板実装などの高精度作業にも特化したロボット・自動化装置が重要な市場を形成しています。ダイヘン（6622）はウェーハ搬送ロボットで高いシェアを持ちます。

要素部品メーカーも重要な投資対象です。THK（6481）は直動案内（LMガイド）と呼ばれるロボットの直線移動を支える基幹部品で世界首位シェアを持ちます。ロボット台数の増加に直接連動して需要が拡大する安定した構造を持ちます。SMC（6273）は空気圧制御機器（エアシリンダ・バルブ）で世界首位シェアを誇り、製造現場の自動化に不可欠な存在です。ナブテスコ（6268）は精密減速機（RV減速機）で世界シェア60%を占め、産業用ロボットの関節部に使われる重要部品です。

H2: 物流ロボット・サービスロボットの普及

物流倉庫向けのAMR（Autonomous Mobile Robot: 自律走行搬送ロボット）市場が急成長しています。Amazonが自社倉庫に大量導入したことで注目を集め、日本でも楽天・ヤマト・佐川などの大手物流会社が導入を加速しています。国内では Mujin・GROUND・RFLYSYSTEMSなどのスタートアップが台頭しています。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は製造業・物流業の人手不足深刻化による自動化投資の拡大・AI搭載スマートロボットの普及・半導体・EV工場向け精密ロボット需要・中国・東南アジア・メキシコでの工場自動化投資・円安による輸出採算の改善です。下落因子は中国経済減速による受注急減・設備投資サイクルの下降局面（半導体不況など）・中国ロボットメーカー（ESTUN・SIASUN等）の価格競争・円高への転換です。

工作機械受注統計・設備投資計画・顧客（自動車・半導体）業界の設備投資状況の発表でこのテーマが動きます。テーマ別詳細でファナックと安川電機の動きを比較し、どちらが主要顧客（自動車vs半導体）の動向を優位に受け取れているかを確認することが投資判断の参考になります。


H2: ヒューマノイドロボットの実用化競争

産業用ロボットの進化と並行して、「人型ロボット（ヒューマノイドロボット）」の実用化競争が加速しています。テスラの「Optimus（オプティマス）」・Boston Dynamicsの「Atlas」・Figure AIのロボットなどが工場・倉庫での実証を進めており、将来的には人間と同じ環境で同じ作業ができるロボットの実現が目指されています。日本でも川崎重工業・安川電機・ソニーグループが独自のヒューマノイドロボット開発を進めており、「フィジカルAI（現実世界で動くAI）」との融合で大きな進化が予想されます。

H2: ロボットの「ブレイン」：制御システムとAI

産業用ロボットの競争力は「ハードウェア（機械部品）」だけでなく「ソフトウェア（制御システム・AI）」が重要な差別化要因になっています。ファナック（6954）の「FANUC AI」・安川電機の「Wrist Integrated Controller」など、AIを組み込んだ「自ら学習して最適化する」制御システムが普及しています。従来は熟練工が設定していた加工条件・動作パラメータをAIが自動最適化することで、非熟練者でも高精度な生産が可能になります。この「匠技能のAI化（暗黙知の形式知化）」は日本の製造業が直面する技術伝承問題の解決策としても注目されています。

H2: 食品・医療・サービス分野への拡張

産業用ロボットは従来の「汚い・危険・きつい（3K）作業」の自動化から、食品加工（惣菜の盛り付け・弁当箱への詰め）・医療（手術支援ロボット・調剤ロボット）・ホテル・飲食（配膳ロボット・受付ロボット）という新分野への拡張が進んでいます。食品加工はこれまで繊細な感触が必要で自動化が難しい分野でしたが、センサー技術・ロボットハンドの柔軟性向上により実用化が進んでいます。医療分野ではダビンチ（da Vinci）手術ロボット（インテュイティブサージカル・米国上場）が腹腔鏡手術の精度・患者への侵襲を改善しており、日本の医療機関への導入も拡大しています。

H2: SMCとTHK：「縁の下の力持ち」的存在

ロボット産業において、最終製品（ロボット本体）のメーカー以上に重要な「要素部品メーカー」が存在します。SMC（6273）は空気圧制御機器（エアシリンダ・電磁弁・空気圧フィルタ等）で世界シェア首位（約35%）を誇ります。製造現場の自動化には空気圧制御が不可欠であり、ロボット・FA（ファクトリーオートメーション）設備の増加に直接連動して需要が拡大します。THK（6481）の直動案内（LMガイド）はロボット・工作機械・半導体製造装置の直線移動を支える基幹部品で、世界首位のシェアを持ちます。

H2: StockWaveJP編集部の見解

ロボット・自動化テーマを観察していると、ファナック（6954）の四半期決算は「日本の製造業の設備投資のバロメーター」として機能することがわかります。ファナックが「受注が回復している・中国からの需要が戻ってきた」というコメントを出すと、ロボット・自動化テーマ全体の出来高が急増するパターンが繰り返されています。また半導体関連テーマとの連動性が強く、半導体工場建設ラッシュのニュースが出たときに同時にロボット・自動化テーマの出来高も増加することを確認しています。SMC・THKのような要素部品メーカーはロボット本体より株価変動が比較的穏やかで、長期投資にも適した安定性があります。

H2: 協働ロボットと人間の共存

従来の産業用ロボットは人と隔離されたフェンスの中で動作しましたが、協働ロボット（コボット）は人の隣で安全に動作できる設計です。力を感知して人に触れたときに動作を止める機能・丸みのある形状・低速動作・軽量化などの安全設計が特徴です。食品加工・医療・農業・組立など「人の手が必要だがロボット化したい」分野での活用が拡大しており、中小企業でも導入しやすい価格帯・設置のしやすさが普及を加速しています。

H2: まとめ

ロボット・自動化テーマは「日本の製造業の強さ」と「深刻な人手不足」という二つの要因が交差する投資テーマです。ファナック・安川電機・川崎重工・THK・SMCという日本のロボット産業の主要プレイヤーが、AI化・協働化・データ連携という次のイノベーションサイクルに入っています。工作機械受注統計・自動車生産計画・半導体設備投資計画の動向をStockWaveJPのモメンタムデータと組み合わせることで、このテーマのサイクルの位置を把握してください。
`},{id:"rare-earth-resources-theme",category:"レアアース・資源",icon:"⛏️",title:"レアアース・資源テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["レアアース・資源","EV・電気自動車","半導体材料"],keywords:["レアアース","資源","住友商事","三菱商事","EV","電池","資源安全保障"],summary:"EV電池・半導体・防衛装備に不可欠なレアアースと戦略資源の確保が国際的な競争になっています。資源安全保障の観点から注目される総合商社と鉱山関連企業を解説します。",body:`
H2: レアアース・資源テーマとは

レアアース・資源テーマはリチウム・コバルト・ニッケル・マンガン・ネオジム・ジスプロシウムなどの希少金属（レアメタル・レアアース）と、原油・天然ガス（LNG）・鉄鉱石・石炭・銅などの主要資源の探鉱・採掘・製錬・貿易に関わる企業を対象とした投資テーマです。EV普及・半導体需要急増・防衛装備の高度化により「戦略資源」の確保が国際的な最重要課題となっており、資源安全保障が外交・産業政策の中心に位置づけられています。

H2: EV普及がレアメタル需要を激変させる

電気自動車（EV）のリチウムイオン電池（LIB）にはリチウム・コバルト・ニッケル・マンガン・黒鉛が大量に使われます。IEA（国際エネルギー機関）の試算では、2040年にEV・電力貯蔵向けのリチウム需要は2023年比で40倍以上に達するとされています。

リチウムはチリ・オーストラリア・アルゼンチンの「リチウムトライアングル」が生産量の多くを占めます。コバルトは世界生産の70%をコンゴ民主共和国（DRC）に依存しており、政情不安・児童労働問題などのリスクが指摘されています。ニッケルはインドネシアが世界最大の生産国で、EVシフトによる需要急増を背景に同国の資源外交力が高まっています。

H2: 脱中国依存とサプライチェーン多角化

レアアース（希土類）の世界生産の約60〜70%を中国が占めており、中国が輸出規制を行うと世界の製造業に甚大な影響が生じます。2023〜2024年に中国がガリウム・ゲルマニウムの輸出規制を実施（半導体・太陽光パネルに不可欠）し、各国が資源安全保障の強化に本腰を入れました。

米国はIRA（インフレ抑制法）で中国産バッテリー材料を使うEVの補助金対象から除外し、同盟国からの資源調達・国内生産を優遇しています。EU・日本も同様の「フレンドショアリング（友好国からの調達）」政策を推進しています。日本政府は「重要鉱物サプライチェーンの強靭化」を国家戦略に掲げ、オーストラリア・カナダ・南米・アフリカとの資源外交を強化しています。

H2: 日本の総合商社が担う資源ビジネス

日本では総合商社5社（三菱商事・住友商事・伊藤忠商事・三井物産・丸紅）が海外の鉱山権益・LNG権益・農業資源に直接投資し、資源の安定調達と収益の両立を図っています。バフェットが2020年に日本の5大商社に投資したことで世界的な注目を集め、「商社株ルネサンス」と呼ばれる評価の転換が起きました。

三菱商事（8058）はオーストラリアのLNG（INPEX・ブラウズ）・銅鉱山（チリのエスコンディダ）・石炭（BMA炭鉱）などで大型権益を持ちます。三井物産（8031）はLNG・鉄鉱石・銅・レアアースのポートフォリオが充実しています。丸紅（8002）はアンモニア・リチウムなどのエネルギー転換・脱炭素関連資源での存在感が増しています。

H2: レアアース精製技術と日本の独自強み

鉱石からレアアースを取り出す「精製・製錬」分野でも日本企業は技術的な強みを持ちます。太平洋金属（5541）はニッケル・クロム・コバルトの製錬で独自の技術力を持ちます。東邦チタニウム（5727）・大阪チタニウムテクノロジーズ（5726）はチタンスポンジ製造で世界トップシェアを誇ります。チタンは航空機・半導体製造装置・医療機器に不可欠な素材です。

H2: 資源価格と商社株の関係

総合商社の業績は資源価格（特に石炭・LNG・銅）と強い相関があります。原油・LNG価格が上昇すると商社のエネルギー権益収益が増加し、株価が上昇しやすくなります。逆に中国の景気後退で鉄鉱石・石炭の需要が落ち込むと業績悪化リスクが高まります。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子はEV普及加速によるリチウム・コバルト需要の拡大・中国の資源輸出規制強化（価格上昇・代替需要）・資源価格（原油・LNG・銅）の上昇・円安による資源収益の円換算増・脱中国依存政策による日本の友好国資源への需要増です。下落因子は資源価格の急落（中国景気後退・需要減）・採掘コスト・輸送コストの上昇・資源産出国の政治不安・通貨リスク・環境規制による採掘制限です。

原油・LNG・銅・リチウムの先物価格と中国の製造業PMIがこのテーマに直結します。StockWaveJPのテーマ別詳細で総合商社5社の相対パフォーマンスを比較することで、現在どの資源価格が最も恩恵を与えているかを把握できます。


H2: 資源安全保障の国際政治学

レアアース・資源テーマは単なる「商品市場」の問題ではなく、国際政治の核心課題となっています。中国が2023年にガリウム・ゲルマニウムの輸出規制を実施し、2024年にはアンチモン・超硬素材の輸出制限を拡大しました。これらは半導体製造・防衛装備に使われる戦略的素材であり、輸出規制は「経済的な兵器」として機能しています。

米国はIRA（インフレ抑制法）で友好国産のバッテリー材料を使うEVへの補助金を優遇し、「フレンドショアリング（同盟国からの資源調達）」政策を推進しています。日本も重要鉱物の国内備蓄強化・友好国（オーストラリア・カナダ・アフリカ）との資源外交を国家戦略として推進しており、商社5社のレアメタル権益への投資が加速しています。

H2: 海底資源・メタンハイドレートの長期展望

日本近海の海底には大量のレアアース泥・コバルトリッチクラスト・メタンハイドレート（天然ガスの一種）が存在することが確認されています。南鳥島周辺の排他的経済水域（EEZ）にはレアアース泥が大量に眠っており、経済的な採掘が実現すれば日本が「資源国」に転換する可能性があります。ただし深海採掘の技術開発・環境影響評価・採算性の確保には長期的な取り組みが必要で、商業化は2030年代以降とされています。

H2: StockWaveJP編集部の見解

レアアース・資源テーマを観察していると、中国の輸出規制発表・地政学的緊張の高まり（台湾海峡問題・ウクライナ情勢）のタイミングで出来高が急増するパターンが繰り返されています。これらのイベントは事前予測が難しいため、地政学カレンダー（中台関係・G7サミット・資源国の選挙）を意識しながらStockWaveJPのテーマ一覧で出来高変化を確認する習慣が有効です。総合商社5社の相対パフォーマンスを比較することで、現在の資源価格環境で最も恩恵を受けている商社を特定することにも活用できます。

H2: StockWaveJP活用の実践ポイント

レアアース・資源テーマは地政学的なニュース（中台関係・資源国の政変・輸出規制発表）に対して敏感に反応します。地政学リスクが高まる局面でのStockWaveJPの出来高確認が特に有効で、商社5社の相対パフォーマンス比較から「今の資源価格環境でどの商社が最も有利か」を分析するアプローチを推奨します。

H2: まとめと今後の展望

レアアース・資源テーマは「EV普及・半導体需要・脱中国依存」という世界規模の構造変化を背景に、長期的な需要増加が確実な分野です。総合商社5社を中心に、資源権益保有・製錬技術・代替材料開発という多角的な視点で日本企業の競争力を評価してください。
`},{id:"cybersecurity-theme",category:"サイバーセキュリティ",icon:"🔒",title:"サイバーセキュリティテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["サイバーセキュリティ","生成AI","通信"],keywords:["サイバーセキュリティ","トレンドマイクロ","ゼロトラスト","ランサムウェア"],summary:"サイバー攻撃の高度化・ランサムウェア被害の深刻化・政府のセキュリティ強化方針を背景に、需要が急拡大しています。日本の主要プレイヤーと市場動向を解説します。",body:`
H2: サイバーセキュリティテーマとは

サイバーセキュリティテーマは企業・政府・重要インフラをサイバー攻撃から守るためのセキュリティソフトウェア・マネージドサービス・コンサルティングを提供する企業を対象とした投資テーマです。生成AIを悪用した高度なフィッシング攻撃・ランサムウェア被害の深刻化・国家支援型ハッカーによる重要インフラへの攻撃増加により、サイバーセキュリティ投資は企業・政府にとって削減できない最重要IT予算となっています。日本の病院・港湾・企業への被害が相次ぐ中、国内のセキュリティ需要も急拡大しています。

H2: サイバー攻撃の高度化と被害の深刻化

2024〜2026年にかけてサイバー攻撃の手口は一層巧妙化しています。生成AIを悪用した本物そっくりのフィッシングメール・音声・動画（ディープフェイク）を使ったビジネスメール詐欺（BEC）が急増しています。サプライチェーン攻撃（取引先企業を踏み台にして大企業に侵入）も主要な攻撃手法となっており、大企業が直接狙われるケースだけでなく、中小のサプライヤー経由での被害が増えています。

日本での深刻な被害事例として、2022年の徳島県立海部病院・2022年の大阪急性期・総合医療センター・2023年の名古屋港物流ターミナル・2024年のKADOKAWAへのランサムウェア攻撃が社会問題となりました。病院や港湾など社会インフラへの攻撃は人命・物流に直接影響するため、重要インフラのセキュリティ強化が政府の緊急課題となっています。

H2: ゼロトラストセキュリティへの移行

従来の「境界型セキュリティ（社内ネットワークは安全という前提）」から、クラウド・リモートワーク普及に対応した「ゼロトラストセキュリティ（すべてのアクセスを常に検証・認証する）」への移行が加速しています。

ゼロトラストの実装には多要素認証（MFA）・IAM（IDとアクセス管理）・マイクロセグメンテーション（内部ネットワークの細分化）・SASE（セキュアアクセスサービスエッジ）・エンドポイント保護（EDR）など多数のセキュリティ製品・サービスの導入が必要で、セキュリティIT支出の拡大につながっています。米国のCrowdStrike・Palo Alto Networks・Zscaler・CyberArkなどのグローバルベンダーと、日本の独自ベンダーとの競争が続いています。

H2: 政府のサイバー防衛強化政策

日本政府は2022年のサイバーセキュリティ戦略改定・2023年の「国家サイバー防衛戦略」で、重要インフラ（電力・ガス・水道・金融・医療・交通）へのセキュリティ規制を大幅に強化しました。「能動的サイバー防衛（アクティブサイバーディフェンス）」の法整備も進んでおり、攻撃者のインフラへの侵入・無力化を可能にする法的根拠の整備が議論されています。

防衛費の増額（2023〜2027年度で43兆円規模）に伴い、サイバー防衛予算も大幅に拡大しています。防衛省・自衛隊のサイバー作戦部隊（現在約4,000人→将来的に2万人規模）の拡充に伴い、防衛・政府向けサイバーセキュリティサービスへの需要が急増しています。

H2: 日本のサイバーセキュリティ企業の特徴

トレンドマイクロ（4704）は日本発の世界的サイバーセキュリティ企業で、エンドポイント保護・クラウドセキュリティ・IoTセキュリティ・OT（製造設備）セキュリティで世界150カ国以上に製品・サービスを提供しています。創業から30年以上にわたりウイルス対策ソフトのパイオニアとして実績を積み上げてきました。

FFRI Security（3692）は高度なサイバー攻撃（APT・ゼロデイ攻撃）の解析・対策技術で日本トップクラスの研究力を持ち、防衛省・内閣官房との取引実績があります。サイバーセキュリティクラウド（4493）はWebアプリケーションファイアウォール（WAF）のクラウドサービス「WafCharm（ワフチャーム）」で急成長しています。ラック（3857）はSOC（セキュリティオペレーションセンター）の運営・インシデント対応・教育・コンサルティングで官民両方に幅広く対応しています。

H2: セキュリティ人材不足という深刻な問題

国内のサイバーセキュリティ人材は経産省の推計で2030年に約20万人不足するとされており、専門家の確保が業界全体の課題です。人材不足を背景に、セキュリティ運用をアウトソーシングするMSSP（マネージドセキュリティサービスプロバイダー）への需要が急増しており、SOC運営・脅威インテリジェンス・自動インシデント対応ツールを提供するサービス型セキュリティが成長しています。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は大規模サイバー攻撃事案の発生（社会的注目・企業のセキュリティ予算増加）・政府の重要インフラセキュリティ規制強化・防衛サイバー予算の拡大・ゼロトラスト移行によるセキュリティIT支出増・生成AIを使った新種攻撃の増加・クラウド移行加速による新たなセキュリティ需要です。下落因子は大手クラウドプロバイダー（Microsoft・AWS・Google）への機能集約（バンドル化）による独立系ベンダーへの圧力・価格競争激化・優秀な人材確保の困難さによるサービス供給制約です。

大規模サイバー攻撃事案の発生後にこのテーマへの関心と株価が上昇しやすいパターンがあります。テーマ別詳細でトレンドマイクロ・サイバーセキュリティクラウドなどの出来高急増タイミングを確認し、社会的インシデントとの照合が有効な分析手法です。


H2: 日本固有のサイバーセキュリティ課題

日本のサイバーセキュリティは国際的に見て「まだ発展途上」という評価を受けています。経営層のサイバーリスクへの意識の低さ・セキュリティ専門人材の不足・レガシーシステム（老朽化したITシステム）へのサイバー投資の遅れなど、多くの課題があります。政府は2022年に「サイバーセキュリティ戦略」を改定し、2024年には「能動的サイバー防衛（相手国のサーバーへの侵入・無力化を可能にする攻撃的防御）」の法整備を進めました。

H2: OT（制御システム）セキュリティの重要性

製造工場・電力・ガス・水道・鉄道などの重要インフラの制御システム（OT: Operational Technology）へのサイバー攻撃リスクが高まっています。従来のIT（情報技術）系セキュリティとは異なる専門知識が必要なOTセキュリティは、専門企業が限られており需要に供給が追いついていない状況です。トレンドマイクロ（4704）はOTセキュリティ製品「TXOne Networks（共同事業）」を通じて製造業・インフラへの展開を強化しています。

H2: セキュリティクリアランス制度の導入

2024年に施行された「経済安全保障推進法」に基づくセキュリティクリアランス（機密情報取扱資格）制度の整備が進んでいます。防衛・原子力・宇宙・航空・重要インフラ関連の研究開発に従事する人材がセキュリティクリアランスを取得することで、国際的な安全保障協力に参加できるようになります。FFRI Security・ラックなどセキュリティ専門企業はこの制度に対応した人材育成・審査支援サービスで新たなビジネス機会を得ています。

H2: AIとサイバーセキュリティの相互影響

生成AIはサイバー攻撃者にとっても防御者にとっても強力なツールです。攻撃側ではリアルなフィッシングメール・なりすまし音声・ディープフェイク動画の自動生成に利用されています。防御側ではAIを使った「脅威インテリジェンス（攻撃パターンの自動分析）」「異常検知（通常とは異なる行動パターンを即座に発見）」「自動インシデント対応」の精度が向上しています。AIを活用したセキュリティ製品（AI-powered XDR: Extended Detection and Response）は急成長市場として注目されています。

H2: StockWaveJP編集部の見解

サイバーセキュリティテーマは「大規模インシデントが発生した直後の出来高急増」という特徴的なパターンが最も顕著なテーマの一つです。徳島県の病院攻撃・名古屋港の物流停止・KADOKAWAへの攻撃など、社会的に大きな注目を集めたサイバーインシデントが発生した翌週には、このテーマの出来高が急増し株価が上昇するというパターンが繰り返されています。これは「インシデントがセキュリティ投資の必要性を社会全体に意識させる」という連想買いであり、実際の個別企業の業績改善が確認できるのは数四半期後になります。短期の「インシデント後の連想買い」と中長期の「セキュリティ市場の構造的成長」という二つの時間軸を意識した投資判断が重要と考えています。

H2: 重要インフラへのサイバー攻撃リスクと対策

医療・電力・水道・金融・交通などの重要インフラへのサイバー攻撃は「社会インフラの麻痺」という深刻な被害をもたらす可能性があります。2022年の大阪急性期・総合医療センター・2023年の名古屋港物流ターミナルへのランサムウェア攻撃は、現代社会のサイバー脆弱性を改めて示しました。政府は重要インフラの「能動的サイバー防御（攻撃者のシステムへの先制的アクセス）」の法制化を進めており、官民一体でのセキュリティ強化が国家的な優先課題となっています。

H2: まとめ

サイバーセキュリティテーマは「攻撃の高度化・頻度増加」「政府の規制強化」「企業のDX推進に伴う新たな攻撃面の拡大」という三つの構造的需要に支えられた長期成長テーマです。大規模サイバー攻撃事案の発生後にStockWaveJPでこのテーマの出来高急増を確認するパターンが繰り返されており、社会的インシデントと市場データの照合が有効な分析手法です。
`},{id:"drone-theme",category:"ドローン",icon:"🚁",title:"ドローンテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["ドローン","防衛・航空","輸送・物流"],keywords:["ドローン","UAV","農業ドローン","Level4","テラドローン"],summary:"2023年のドローンレベル4飛行解禁により、日本のドローン市場が本格始動しました。農業・物流・インフラ点検・空飛ぶクルマへの展開と関連企業の動向を解説します。",body:`
H2: ドローンテーマとは

ドローンテーマは無人航空機（UAV: Unmanned Aerial Vehicle）の製造・販売企業、ドローンを活用した農業・物流・インフラ点検・測量・撮影・防衛などのサービス企業、そして「空飛ぶクルマ（eVTOL: 電動垂直離着陸機）」の開発企業を対象とした投資テーマです。2023年12月の「レベル4飛行（有人地帯での補助者なし目視外飛行）」解禁により日本のドローン商業利用が本格始動し、農業・物流・インフラ保全という三分野での急速な普及が始まっています。

H2: 日本のドローン法制度の整備

H3: レベル分類とレベル4解禁の意義

国土交通省は飛行リスクに応じてドローン飛行を4段階に分類しています。レベル1（立入管理された無人地帯での手動飛行）〜レベル4（有人地帯での補助者なし目視外飛行）まであり、2023年12月のレベル4解禁が日本のドローン商業利用の「本格化」を意味します。

それまでのレベル3まではドローン飛行に目視（自分の目で確認できる範囲）または補助者の同行が必要でしたが、レベル4では人がいる地域の上空でも完全自律飛行が可能となり、宅配ドローン・インフラ点検の商業展開に必要な法的基盤が整いました。

H3: 型式認証・機体認証・操縦ライセンス制度

レベル4飛行には「型式認証（機体の設計・製造の安全性証明）」または「機体認証（個別の機体の安全性証明）」と、「一等無人航空機操縦士ライセンス」が必要です。国家資格化されたことで産業用ドローンの信頼性・安全性が公的に担保され、事業者・利用者双方の信頼度が向上しています。

H2: 農業ドローンの現状と将来

H3: 農薬散布ドローンの急速な普及

農業分野はドローンの実用化が最も進んでいる領域で、農薬・肥料の空中散布が主な用途です。従来のヘリコプターによる防除（農薬散布）に比べて低コスト・高精度・柔軟な運用が可能なことから、全国の水田・畑での普及が加速しています。

ヤマハ発動機（7272）は1990年代から農業用無人ヘリコプターを展開してきた先駆者で、ドローンへの移行でも競争力を持ちます。クボタ（6326）・ヤンマーHD（非上場）も農業ドローンに参入しています。中国のDJI（大疆創新、非上場）は農業ドローンで世界最大のシェアを持ち、日本市場でも広く使われていますが、安全保障上の懸念から国産品への切り替えを求める動きもあります。

H3: 精密農業への展開

ドローンにマルチスペクトルカメラ（植物の生育状態を色の違いで把握できる特殊カメラ）を搭載した「作物のヘルスチェック」サービスが普及しています。稲・小麦・野菜の生育不良・病害虫の発生を早期発見し、適切な農薬・肥料の施用量を算出することで、収量増加・農薬コスト削減を実現します。

H2: インフラ点検ドローンの成長市場

橋梁・トンネル・送電線・ダム・風力発電タービンなどのインフラ点検にドローンを活用する需要が急拡大しています。従来は足場を設置して目視検査する必要があった点検作業がドローンで代替されることで、コスト（足場設置費の削減）・安全性（高所作業員の危険排除）・スピード（検査時間の大幅短縮）が同時に改善します。

ゼンリン（9474）は高精度地図・点群データとドローン測量を組み合わせたインフラ点検サービスを展開しています。セコム（9735）はドローンを活用した警備・監視サービスの実証を進めています。ジャパンメンテナンス（非上場）・サイトセンシング（非上場）などのスタートアップも急成長しています。

H2: 物流ドローンと最後の一マイル配送

過疎地・離島・山間部への荷物配送（ラストワンマイル配送）にドローンを活用するサービスの実証が各地で進んでいます。医療品（離島の診療所への薬・血液）・食料品（過疎地の高齢者向け）・小型荷物の配送での活用が先行しています。

楽天グループ（4755）は「楽天ドローン」で複数の自治体・企業と連携したドローン配送の実証を進めています。川崎重工業（7012）は大型物流ドローンの開発に参入しています。

H2: 防衛ドローンと安全保障

ロシアのウクライナ侵攻でドローン（特に安価な民間用FPVドローンの軍事転用）が現代戦の主役の一つとなったことで、各国が防衛ドローンへの投資を急増させています。

日本でも防衛省が自衛隊への偵察ドローン・電子戦ドローン・攻撃型ドローンの導入計画を発表しており、国産防衛ドローンの開発・量産が国防上の優先事項となっています。川崎重工業・三菱重工業（7011）・NECが防衛ドローンの開発に参入しています。テラドローン（278A）は防衛分野でも事業拡大を進めています。

H2: 空飛ぶクルマ（eVTOL）の現状と展望

電動垂直離着陸機（eVTOL）は「ヘリコプターより静かで環境に優しい」都市内短距離移動手段として期待されています。SkyDrive（非上場）は大阪・関西万博（2025年）でのデモ飛行を経て商業化を目指しています。ANAホールディングス（9202）・JAL（9201）・丸紅・住友商事などの大手がeVTOL事業者との提携・出資を進めています。

本格的な商業運航は2030年代以降になる見通しで、電池技術・安全認証・インフラ（ヘリポート・充電設備）の整備が課題です。

H2: ドローン関連の主要課題

電池持続時間の制約（航続時間30分〜1時間程度）・積載重量の限界（数kg〜数十kg）が物流・農業用途での制約要因です。安全性の確保（機体の故障対策・緊急時の落下リスク）・騒音問題・プライバシー侵害（カメラ搭載機による撮影問題）なども規制強化につながる可能性があります。

H2: StockWaveJP編集部の見解

ドローンテーマは「規制解禁のタイミング・防衛関連ニュース・農業関連ニュース」に対してテーマ全体の出来高が反応することを観察しています。レベル4解禁後も「具体的な商業サービスの開始発表」「大型受注の公表」「防衛省との契約」のニュースが出るたびに出来高が急増するパターンが見られます。

国産ドローンの育成・DJI排除という政策的な動きも追い風になる可能性があります。当編集部は「技術的な実現可能性よりも収益化の実績」を重視しており、実際に売上・利益が発生しているドローン関連銘柄を選別することが重要と考えています。テラドローン（278A）のような上場企業の業績推移をStockWaveJPの出来高変化と組み合わせて確認することを推奨します。

H2: まとめと今後の展望

ドローンテーマは農業・インフラ点検・物流・防衛という四分野での構造的な需要拡大を背景に、2030年代に向けて成長が続く長期テーマです。レベル4解禁という法的基盤の整備が完了した現在、商業化の加速フェーズに入っており、実績を積み上げる企業が投資価値を高めていくと予想されます。

H2: StockWaveJP活用の実践ポイント

ドローンテーマは規制解禁・防衛受注・農業普及という三つのカタリスト（株価を動かす材料）に敏感に反応します。国交省の規制緩和ニュース・防衛省の調達発表・農水省のスマート農業補助金の決定タイミングでStockWaveJPの出来高変化を確認することを習慣化してください。テラドローン（278A）のような純粋なドローン銘柄と、ヤマハ発動機（農業ドローン）・川崎重工（防衛ドローン）のような複合銘柄を比較することで市場の関心の方向性を把握できます。

H2: まとめと今後の展望

ドローンテーマは法制度整備が完了し、商業化フェーズに入った「離陸直前」の産業です。農業・物流・インフラ点検・防衛という四分野での実需が着実に拡大しており、収益化に成功した企業が投資価値を高めていく過程を長期的に追跡する価値があります。
`},{id:"tourism-hotel-theme",category:"観光・ホテル・レジャー",icon:"🏨",title:"観光・ホテル・レジャーテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["観光・ホテル・レジャー","インバウンド"],keywords:["観光","ホテル","レジャー","インバウンド","IR","テーマパーク"],summary:"訪日外国人過去最高と観光消費の拡大を背景に、観光・ホテル・レジャーテーマが急成長しています。IR開業期待も加わる関連銘柄の動向を解説します。",body:`
H2: 観光・ホテル・レジャーテーマとは

観光・ホテル・レジャーテーマはホテル・旅館・テーマパーク・観光地・旅行代理店・クルーズ・スキー場・カジノ（IR）など観光・余暇・娯楽に関わる企業を対象とした投資テーマです。日本では2024年の訪日外国人数が3,688万人と過去最高を記録し、消費額も8兆円超（推計）に達しました。ホテル・旅館の稼働率・客室単価・免税店・飲食・交通の全分野で好調が続いており、インバウンド需要が日本の観光・レジャー産業を変革しています。

H2: 訪日外国人急増の背景と市場規模

H3: 過去最高を更新した訪日外国人数

2024年の訪日外国人数3,688万人は2019年（コロナ前の過去最高：3,188万人）を大幅に上回り、「史上最多」を達成しました。国籍別では韓国・中国・台湾・香港・米国が上位を占めますが、近年は東南アジア（タイ・シンガポール・マレーシア・フィリピン）・インド・オーストラリアからの旅行者も急増しています。

H3: 「消費の質」の向上：高単価旅行者の増加

訪日外国人の消費構造が「量から質へ」変化しています。従来の「爆買い（大量の物品購入）」から「体験消費（高級旅館・文化体験・地方旅行）」へのシフトが鮮明で、1人あたりの消費単価が大幅に上昇しています。特にヨーロッパ・北米・中東からの富裕層旅行者は、1泊5万〜20万円以上の高級宿泊施設での長期滞在を好み、日本各地の高級旅館・高級ホテルの稼働率・単価を押し上げています。

H2: ホテル・旅館市場の現状

H3: 客室単価（ADR）と稼働率の過去最高更新

国内主要都市のホテルの客室単価（ADR: Average Daily Rate）と稼働率（RevPAR: Revenue Per Available Room）は2024年に過去最高を更新しました。東京・京都・大阪では1泊3〜5万円（中高級ホテル）が標準となり、ラグジュアリーホテルでは1泊10万〜30万円という水準も珍しくなくなっています。

H3: ホテルの需給逼迫と新規開業の遅れ

訪日外国人の急増に対してホテルの供給が追いついていない「需給逼迫」が続いています。新規ホテル建設は建設コスト高騰・人手不足・用地確保難により遅延が相次いでおり、しばらくは供給不足が続く見通しです。外資系ラグジュアリーホテル（マリオット・ヒルトン・フォーシーズンズ等）の新規開業も相次いでいますが、全体的な供給量の増加は限定的です。

H2: 主要関連銘柄の詳細

H3: 帝国ホテル（9708）

日本最高級ホテルの象徴として国内外の富裕層・ビジネス客に高い認知度を持ちます。東京・大阪・上諏訪に展開し、客室単価・稼働率ともに過去最高を更新しています。帝国ホテルの株価は「ブランド力と希少性」からプレミアムバリュエーションがついており、長期的な資産価値向上も評価されています。

H3: 藤田観光（9722）

ワシントンホテル（中級ビジネスホテル）・椿山荘（高級パーティー・宴会施設）・箱根小涌園（温泉リゾート）など多様なグレードと業態を持つホテル・レジャー会社です。インバウンド需要の恩恵を幅広いセグメントで受けており、客室単価の引き上げと稼働率向上で業績が急改善しています。

H3: オリエンタルランド（4661）

東京ディズニーリゾート（TDR）の運営会社で、訪日外国人・国内旅行者双方から圧倒的な支持を受けます。入場価格の段階的引き上げ（2024年に最高1DAYパスポート14,900円）により客単価が大幅に向上しており、高価格戦略と需要の強さが両立しています。TDRのブランド力と独占的なポジションは長期投資家から高い評価を受けています。

H2: IR（統合型リゾート）への期待

H3: 大阪IRの現状

大阪・夢洲での日本初のIR（カジノを含む統合型リゾート）は2030年代前半の開業が見込まれており、MGMリゾーツ・オリックスが事業者として開発を進めています。IR開業は年間数兆円規模の経済効果と500万人超の外国人旅行者誘致が期待されており、周辺のホテル・交通・小売・飲食への波及効果も大きいとされています。

長崎・ハウステンボスでもカシドン（カジノ・ホテル・展示施設の複合）の計画があり、地域経済への貢献が期待されています。

H2: 国内旅行と「ワーケーション」

インバウンド需要だけでなく国内旅行市場も好調です。テレワーク普及により「ワーケーション（仕事しながら旅行）」の需要が定着しており、地方のリゾートホテル・温泉旅館への平日の宿泊需要が増加しています。星野リゾート（非上場）は国内各地で旅館・リゾートホテルの再生・新規開業を進め、高単価・高稼働率を実現した「ラグジュアリーリゾートブランド」として定着しています。

H2: オーバーツーリズムという新課題

急増する訪日客への対応として「オーバーツーリズム（観光客の過密）」が社会問題化しています。京都・鎌倉・富士山・宮島などの人気観光地では交通渋滞・ゴミ問題・住民の生活妨害が起きており、一部では入場規制・観光税の導入・バスの有料化などの対策が実施されています。

オーバーツーリズム対策は「観光客の分散化（地方へのリダイレクト）」「時間帯・人数の管理（予約制の導入）」「高付加価値旅行者への絞り込み」という方向で進んでおり、長期的にはホテルの単価維持・品質向上につながる可能性もあります。

H2: StockWaveJP編集部の見解

観光・ホテル・レジャーテーマを観察していると、為替（円安・円高）に対して最も感応度が高いテーマの一つです。円高が進むと「訪日客の割安感が薄れる」という連想から売られ、円安が進むと追い風として買われるパターンが繰り返されています。

また毎月発表されるJNTO（日本政府観光局）の訪日外国人統計が「過去最高を更新」という内容だった翌週に、このテーマの出来高が急増するというパターンも確認しています。統計発表のカレンダー（通常、前月分が翌月中旬に発表）を把握した上でStockWaveJPでの確認を習慣化することを推奨します。

H2: まとめと今後の展望

観光・ホテル・レジャーテーマは「円安の継続」「日本文化・食・体験への世界的な関心の高まり」「IR開業期待」という三つの追い風が続く構造的な成長テーマです。2030年に政府が掲げる訪日外国人6,000万人という目標に向けた長期的な成長ストーリーは説得力があります。為替リスク・感染症リスク・オーバーツーリズム規制リスクを意識しながら、StockWaveJPのモメンタムデータと組み合わせた総合的な判断を行ってください。

H2: テーマパーク・エンタメ施設の動向

東京ディズニーリゾート（オリエンタルランド）以外にも、ユニバーサル・スタジオ・ジャパン（USJ・大阪）・ナガシマスパーランド・ハウステンボスなど主要テーマパークの来場者数・売上が回復・拡大しています。USJはニンテンドーワールド・ドンキーコングエリアの拡張で外国人客を含む来場者数を大幅に増加させています。

H2: 高級旅館とインバウンド

日本の高級旅館（旅館形式のラグジュアリー宿泊施設）は外国人富裕層旅行者に特に人気があります。「一泊数万円〜数十万円」という価格帯にもかかわらず予約が取りにくい状態が続いており、温泉・懐石料理・茶道・着物体験などの「日本文化体験」がパッケージされた旅館は世界のラグジュアリー旅行市場でも高い評価を受けています。星野リゾート（非上場）・界（星野リゾートのブランド）・加賀屋（石川）・吉川観光ホテル（京都）などのハイエンド旅館が代表例です。

H2: まとめ

観光・ホテル・レジャーテーマは「訪日外国人の急増」「高付加価値観光へのシフト」「IR開業期待」という三つの強力な成長ドライバーを持つ中長期的に魅力的なテーマです。為替リスクとオーバーツーリズム規制リスクを念頭に置きながら、JNTO統計とStockWaveJPのモメンタムデータを組み合わせた定期的な確認を継続してください。
`},{id:"agritech-foodtech-theme",category:"農業・フードテック",icon:"🌾",title:"農業・フードテックテーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["農業・フードテック","食品・飲料"],keywords:["農業","フードテック","スマート農業","代替肉","食料安全保障"],summary:"食料安全保障への関心・スマート農業の普及・代替タンパクの成長が農業・フードテックテーマを後押ししています。農業DXと食料サプライチェーンの変革を解説します。",body:`
H2: 農業・フードテックテーマとは

農業・フードテックテーマはIoT・ドローン・AI・ロボットを活用したスマート農業、植物工場・垂直農業、代替タンパク（代替肉・昆虫食・細胞培養肉・大豆ミート）、農業機械・農業資材、食料安全保障インフラに関わる企業を対象とした投資テーマです。気候変動による農業への影響・世界人口増加による食料需要拡大・日本の農業従事者の高齢化という三つの課題が重なる中、テクノロジーによる農業の革新（アグリテック）が世界的に注目されています。

H2: 食料安全保障：日本が直面する根本課題

H3: 食料自給率の低さ

日本の食料自給率（カロリーベース）は約38%と先進国最低水準にあります。小麦の約90%・大豆の約93%を輸入に依存しており、国際的な供給不安（戦争・気候異変・輸出規制）の影響を直接受けやすい構造です。ロシアのウクライナ侵攻（2022年）による小麦価格急騰が食料安全保障問題を改めて浮き彫りにしました。

H3: 農業従事者の高齢化と農地の集約化

日本の農業従事者の平均年齢は67歳を超えており、毎年数万人の農業離脱が続いています。農地の集約化（耕作放棄地の再活用・農業法人への集積）を通じて、スマート農業技術の導入・大規模化による生産性向上が政府の重点政策となっています。

H2: スマート農業の技術と現場への普及

H3: 農業ドローン

農薬散布ドローンは現在最も普及しているスマート農業技術です。水田の農薬散布（ヤマハ発動機・DJI等）は全国的に普及が進んでおり、散布時間の短縮・農薬使用量の削減・農業者の体力的負担軽減に貢献しています。マルチスペクトルカメラを搭載したドローンで作物の生育状況・病害虫被害を早期発見するサービスも拡大しています。

H3: GPS自動操舵農機

クボタ（6326）はGPSで自動操舵するトラクター「アグリロボトラクタ」・田植機・コンバインを市場投入しており、「農業の完全自動化」に向けた技術開発を進めています。ヤンマーHD（非上場）も自動操舵農機で競争力を持ちます。これらの農機は高精度に同じ軌跡を走行できるため、肥料・農薬の過不足なく均一な施用が可能になり、収量増加とコスト削減を両立できます。

H3: 衛星データと農業IoT

人工衛星・気象センサー・土壌センサーのデータを組み合わせて「いつ・どこに・どれだけ」肥料・水・農薬を施用するかを最適化するシステムが普及しています。天地人（非上場）はJAXA出身者が創業した衛星データ活用農業スタートアップで、農地の土地評価・農業適性分析サービスを提供しています。

H2: 植物工場・垂直農業の成長

植物工場は室内で光・温度・養分を完全制御してLED照明で野菜を栽培する施設です。天候に左右されない安定生産・農薬使用量の大幅削減・都市近郊での地産地消が実現でき、輸送コストと食品ロスの削減にも貢献します。

スプレッド（非上場・京都）は完全自動化の植物工場でリタスを年間3,000万株生産する世界最大規模の植物工場を運営しています。ホクト（1379）はきのこの菌床栽培で植物工場型生産の先駆者であり、安定した収益基盤と高い利益率を持ちます。

H2: 代替タンパクの市場動向

H3: 大豆ミートの普及状況

大豆・エンドウ豆などの植物性タンパクを肉の食感・味に近づけた「大豆ミート（プラントベースミート）」は2020年前後に世界的なブームとなりました。しかし2022年以降は「本物の肉との価格差が縮まらない」「味・食感の課題」「ブームの落ち着き」で市場成長が鈍化しています。長期的には環境意識の高い欧米を中心に成長が続くと見られていますが、当初の過剰な期待は修正されました。

H3: 昆虫食と細胞培養肉

昆虫食（コオロギ・ミールワーム等）は高タンパク・低環境負荷の食材として注目されますが、消費者の心理的抵抗感・価格の高さが普及の壁となっています。細胞培養肉（動物の細胞を培養して作る肉）は研究段階で商業化にはまだ時間が必要です。

H2: 農業・フードテックの投資機会

H3: 農業機械・農業資材

クボタ（6326）は農業機械のグローバル大手で、スマート農業・自動運転農機のパイオニアです。井関農機（6310）は水田農業向け機械で国内シェアが高く、農業機械の更新需要と高機能化需要の恩恵を受けます。日本農薬（4997）はアジア向け農薬の販売に強みを持ちます。

H3: 食品・食料安全保障

食料安全保障への政策的関心の高まりから、農産物の国内生産拡大・食品加工業の国産原料へのシフトが進んでいます。雪印メグミルク（2270）は国内乳業最大手として、国産牛乳の消費拡大に貢献しています。

H2: StockWaveJP編集部の見解

農業・フードテックテーマは「長期的な成長テーマとしての方向性は明確だが、短期のモメンタムが生まれにくい」という特性を観察しています。テーマ全体の騰落率・出来高が突然急増するのは「食料安全保障に関する大型政策発表」や「気候変動による農産物価格の急騰」のタイミングが多く、それ以外の期間は比較的地味な動きが続く傾向があります。

当編集部は農業・フードテックテーマを「長期保有のディフェンシブ投資対象（クボタ・井関農機）」と「短期のカタリスト（政策発表・農産物価格急騰）を狙う機会投資」の二段構えで見ています。スマート農業の普及は5〜10年単位での緩やかな浸透が続くと予想しており、急激な株価上昇よりも安定的な成長を期待するテーマとして位置づけています。

H2: まとめと今後の展望

農業・フードテックテーマは食料安全保障・農業のデジタル化・代替タンパク市場という三つの成長軸を持つ長期投資テーマです。日本の農業機械メーカー（クボタ・井関農機）の技術競争力・スマート農業スタートアップの成長・食料安全保障政策の強化を組み合わせた長期的な視点で投資機会を評価してください。

H2: 農業政策の最新動向

農林水産省は「みどりの食料システム戦略」（2021年策定）で2050年までに有機農業面積を25%に拡大・化学農薬使用量を50%削減・化学肥料使用量を30%削減という目標を掲げています。この目標達成に向け、有機農業支援・スマート農業技術の普及・農業DX推進に対する補助金・助成金が充実しており、農業テクノロジー企業にとって大きな事業機会です。

2024年には農地法改正により農業法人への農地集積・大規模農業経営への転換が促進されています。スマート農業への投資対効果が高まる「大規模農場」が増えることで、クボタ・ヤンマーなどの高機能農機への需要が拡大します。

H2: フードテック投資の国際比較

世界的にはフードテック（食料とテクノロジーの融合）への投資が急増しており、2025年時点で年間数十億ドルの投資が行われています。日本でも大手食品メーカー（日清食品・味の素・明治HD等）が社内ベンチャー・スタートアップ出資を通じてフードテック事業に参入しています。ただし代替タンパクのような新市場は「技術的実現可能性」と「消費者受容性」のギャップが大きく、短期的な業績貢献には時間がかかる分野です。

H2: まとめ

農業・フードテックは食料安全保障・スマート農業・代替タンパクという複数の成長軸を持ちますが、短期のモメンタムが生まれにくいテーマでもあります。農業政策の予算発表・農産物価格の急騰・大型農業技術の実証成功ニュースをStockWaveJPの出来高データと照合し、機動的な投資判断に役立ててください。
`},{id:"education-hr-theme",category:"教育・HR・人材",icon:"📚",title:"教育・HR・人材テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["教育・HR・人材","人材派遣","AI人材"],keywords:["教育","HR","人材","リスキリング","EdTech","ベネッセ","リクルート"],summary:"人的資本経営・リスキリング支援・EdTechの成長が教育・HR・人材テーマを押し上げています。政府の人的資本開示義務化と主要企業の事業動向を解説します。",body:`
H2: 教育・HR・人材テーマとは

教育・HR（Human Resources）・人材テーマは、学習塾・予備校・eラーニング（EdTech）・語学学校・幼児教育などの教育機関と、人材派遣・人材紹介・求人メディア・採用管理システム（ATS）・HRテック（HR分野のITサービス）など人事・雇用サービスを提供する企業を対象とした投資テーマです。

少子化による国内教育市場の縮小リスクと、深刻な人手不足を背景とした人材サービス市場の拡大という相反する力が同時に働く複雑なテーマです。ただし「リスキリング（学び直し）」需要の急増・EdTech（教育テクノロジー）の進化・外国人材受入の拡大という新たな成長エンジンが加わり、市場全体としては成長が続いています。

H2: 人的資本経営とリスキリング需要の急拡大

H3: 政府の「人への投資」政策

岸田政権（2021〜2024年）は「人への投資」を重点政策に掲げ、リスキリング（既存スキルの再教育・新スキルの習得）支援に3年間で4,000億円規模の投資を実施しました。この政策を受け、法人向けのeラーニングプラットフォーム・研修サービス・スキル管理システムへの需要が急拡大しました。

また2023年から上場企業に義務付けられた人的資本の情報開示（従業員研修投資額・離職率・エンゲージメント指標等の開示）により、企業が従業員教育・研修への投資を「コストではなく資本」として捉えるシフトが起きています。

H3: リスキリング市場の主要プレイヤー

グロービス（非上場）は経営学・MBAプログラムのeラーニングで法人・個人双方に高い認知度を持ちます。Udemy（米国上場・日本では学研グループが提携販売）は2万以上のオンライン講座を持つグローバルプラットフォームで、IT・デザイン・ビジネス系の講座が人気です。ベネッセホールディングス（9783）は「進研ゼミ」から「ベネッセコーポレーション」「ベネッセパレット（法人研修）」まで幅広い教育サービスを展開しています。

H2: 深刻な人手不足と採用市場の拡大

H3: 人手不足の現状

日本の労働力不足は製造業・建設業・サービス業・医療介護・物流と業種を超えて深刻化しています。帝国データバンクの調査では中小企業の60%以上が人手不足を訴えており、正社員・非正社員ともに採用難が続いています。2024年4月の「物流の2024年問題」（ドライバーの時間外労働規制）を契機に、人手不足問題が改めて社会的注目を集めました。

H3: 採用サービス市場の成長

人手不足が深刻化するほど、企業の採用活動への投資が増加します。求人広告（Indeed・リクナビNEXT・マイナビ等）・人材紹介（リクルート・パーソル・エン・ジャパン等）・採用管理システム（ATS）・リファラル採用支援（従業員紹介制度）・採用代行（RPO）など、採用に関わるあらゆるサービスへの需要が拡大しています。

リクルートホールディングス（6098）は国内最大の人材サービス企業で、Indeed（世界最大の求人検索エンジン）・Glassdoor（職場口コミサイト）など海外プラットフォームも傘下に持ちます。海外売上比率が高く、グローバルな採用市場の成長を取り込める独自のポジションにあります。

H2: EdTech：デジタルで変わる教育の形

H3: GIGA構想とEdTechの普及

2019年に政府が開始したGIGA構想（全小中学生への1人1台端末配布・校内Wi-Fi整備）により、EdTechを活用するデジタル環境が全国の学校に整備されました。コロナ禍での学校閉鎖がオンライン授業への大規模移行を加速させ、EdTechサービスへの需要が一気に高まりました。

H3: AIによる個別最適化学習

AIを活用した「アダプティブラーニング（学習者の理解度・苦手分野に合わせて最適な問題・コンテンツを提供する学習）」が急速に進化しています。RISU Japan（非上場）はタブレット算数教材でAI最適化を実現し、全国の家庭での普及が進んでいます。Z会（非上場）・トライグループ（2G HD・非上場）・個別指導のトライもAI活用の個別指導に積極投資しています。

H2: 外国人労働者・グローバル人材採用の拡大

2024年6月に「育成就労制度」が新設され、旧来の技能実習制度が廃止・改革されました。新制度では労働者の転籍制限が緩和され、より適切な環境での就労が保障されるようになりました。外国人材の日本への受入はIT・介護・農業・建設・製造など幅広い分野で拡大しており、外国人材の採用支援・定着支援・日本語教育を提供する企業に大きな商機が生まれています。

エン・ジャパン（4849）は外国人採用支援サービス「エンゲージ」「エン派遣」を強化しており、外国人材採用市場でのプレゼンスを高めています。

H2: HRテック：テクノロジーで変わる人事業務

H3: HRテックの主要サービス

採用管理（ATS）・入社手続きのデジタル化（SmartHR・freee人事労務等）・勤怠管理・給与計算・評価・目標管理（OKR）・エンゲージメントサーベイ・タレントマネジメントなど、人事業務全般をSaaS化するHRテックが急成長しています。

SmartHR（非上場）は従業員情報の一元管理・入退社手続きの自動化・労務書類のペーパーレス化で急成長し、日本最大のHRテックユニコーンとなりました。

H2: 主要関連銘柄の詳細

リクルートHD（6098）は人材サービスのグローバルリーダーで、Indeed・Glassdoorの海外展開とHRテック事業（Recruiting Solutions）が成長ドライバー。国内では就職・転職・アルバイトの各サービスが圧倒的なシェアを持ちます。

パーソルHD（2181）は派遣・紹介・アウトソーシングを統合した人材サービス大手。東南アジアでの人材事業も拡大しています。

エン・ジャパン（4849）は転職サイト「エン転職」・HR向けSaaS・外国人採用支援で急成長。高い営業利益率が評価されています。

ジェイエイシーリクルートメント（2124）は管理職・専門職向けのプレミアム人材紹介で高い単価・利益率を維持します。

H2: StockWaveJP編集部の見解

教育・HR・人材テーマは日本の雇用・労働市場の構造変化を最も直接的に反映するテーマです。有効求人倍率（仕事の数÷求職者数）・転職意向率・企業の採用計画指数などの雇用関連指標の発表に対してこのテーマが敏感に反応することを繰り返し観察しています。

当編集部が注目しているのは「景気動向との連動性」です。景気が拡大している局面では採用活動が活発化し、人材サービス会社の業績が改善します。逆に景気後退局面では企業が採用を抑制するため、人材派遣・紹介の需要が急減します。このサイクルを把握した上で、景気拡大局面の初期段階でこのテーマへの投資を検討することが有効と考えています。

一方でEdTech・リスキリング・HRテックは景気の影響を受けにくい「成長のモメンタムがある」サブセクターで、中長期の成長性の高い投資対象として別途評価することを推奨します。

H2: まとめと今後の展望

教育・HR・人材テーマは「少子化による縮小」と「人手不足・DXによる成長」という二つの力が拮抗する複雑なテーマです。EdTech・リスキリング・外国人材・HRテックという成長サブセクターを持ちながら、全体としては景気連動性が強いという特性を理解した上で投資判断に臨んでください。
`},{id:"space-satellite-theme",category:"宇宙・衛星",icon:"🚀",title:"宇宙・衛星テーマ徹底解説：経緯・現状・上昇下落因子と主要銘柄",date:"2026/04/04",themes:["宇宙・衛星","防衛・航空","IOWN"],keywords:["宇宙","衛星","JAXA","Astroscale","衛星データ","小型ロケット","宇宙戦略基金"],summary:"政府の宇宙戦略基金1兆円超・民間宇宙ビジネスの成長・衛星データ活用が宇宙・衛星テーマを牽引しています。日本の宇宙産業エコシステムを解説します。",body:`
H2: 宇宙・衛星テーマとは

宇宙・衛星テーマはロケット打ち上げ・人工衛星の製造・衛星データの活用・宇宙探査・月面開発・スペースデブリ除去・宇宙旅行など宇宙ビジネス全般に関わる企業を対象とした投資テーマです。日本政府は2020年代〜2030年代を「宇宙産業の離陸期」と位置づけ、宇宙戦略基金（約1兆円）を通じて官民連携の大規模投資を推進しています。SpaceX・Amazonのカイパー・OneWebなど海外企業が主導してきた宇宙産業に、日本独自の技術・企業が本格参入する段階にあります。

H2: 政府の宇宙戦略基金と支援体制

2023年に設立された「宇宙戦略基金」は、宇宙輸送（ロケット）・衛星・月探査・スペースデブリ除去・宇宙状況把握（SSA）などの分野で10年間・総額1兆円超の支援を行う大型基金です。JAXAが管理機関となりスタートアップから大手企業まで公募で採択しています。

2024年に採択が決定した主なプロジェクトには、インターステラテクノロジズの小型ロケット「ZERO」開発（宇宙輸送）、Astroscaleのスペースデブリ除去サービス、QPS研究所の小型SAR衛星コンステレーション、アストロスケールとの協力によるOOS（軌道上サービス）技術の開発などがあります。

H2: H3ロケットと日本の宇宙輸送能力

JAXAと三菱重工業（7011）が共同開発した新型基幹ロケット「H3」は2024年2月の2号機打ち上げで成功しました。H3はH-IIAの後継として開発された次世代主力ロケットで、打ち上げコストを大幅に削減（H-IIAの約半分）し、国際競争力のある商業打ち上げサービスの提供を目指しています。

H3の成功により日本は自律的な宇宙輸送能力を維持しました。防衛・気象・資源探査の国家衛星を確実に打ち上げられることは国家安全保障上も重要で、SpaceXへの依存を回避できます。今後は商業衛星の打ち上げ受注獲得が課題で、価格・信頼性・柔軟性での競争力向上が求められます。

H2: 小型ロケット・スタートアップの台頭

インターステラテクノロジズ（IST、非上場・北海道大樹町）は堀江貴文氏が関与するロケットスタートアップで、小型ロケット「MOMO」の打ち上げ成功で実績を積み、大型の軌道投入ロケット「ZERO」の開発を進めています。スペースワン（和歌山）は2024年に初の商業小型ロケット打ち上げを試みましたが失敗に終わり、2回目の打ち上げに向けて開発を継続しています。PDエアロスペース（名古屋）は宇宙旅行向けの再使用型宇宙往還機を開発しています。

H2: 衛星データビジネスの商業化

小型衛星を多数打ち上げる「衛星コンステレーション」を使った地球観測データの商業活用が本格化しています。Synspective（東京）は小型SAR（合成開口レーダー）衛星で夜間・雲の上からでも地表を撮影できるデータを農業・防災・インフラ監視向けに提供しています。QPS研究所（5595、東証グロース）は独自の小型SAR衛星コンステレーションを構築しており、日本の民間宇宙ビジネスのフロントランナーです。天地人（非上場）は衛星データを活用した農業向け土地評価サービスで成長しています。

H2: スペースデブリ問題とAstroscale

宇宙空間に廃棄されたロケット残骸・故障した衛星などのスペースデブリは推計で3万個以上（10cm以上のもの）あり、現役衛星や国際宇宙ステーション（ISS）に衝突するリスクが高まっています。Astroscale（186A、東証グロース）は世界初のスペースデブリ除去専業企業として2024年に上場し、ESAとJAXAとの除去実証プロジェクトを進めています。デブリ除去は長期的に兆円規模の市場に成長する可能性があるとされています。

H2: 防衛宇宙と安全保障の重要性

ロシアのウクライナ侵攻・米中の宇宙覇権争いが激化する中、宇宙は「第5の戦場」として軍事的重要性が急上昇しています。偵察衛星・通信衛星・GPS（測位）・宇宙状況把握（SSA）が現代軍事作戦の中核となっています。

日本は2022年に「宇宙安全保障構想」を策定し、防衛宇宙予算を大幅に増額。航空自衛隊を「航空宇宙自衛隊」に改称し、宇宙作戦部隊を創設しました。三菱電機（6503）は防衛・気象・資源探査衛星の製造で国内最大の実績を持ちます。IHI（7013）はH3ロケットのエンジン（LE-9）を製造する重要サプライヤーです。

H2: 上昇因子・下落因子とStockWaveJPの活用

上昇因子は宇宙戦略基金の新規採択・H3ロケットの商業打ち上げ成功・防衛宇宙予算の拡大・衛星データ活用ビジネスの成長・スペースデブリ除去の実証成功・月面探査（JAXA SLIM等）の進展です。下落因子はロケット打ち上げ失敗のリスク（開発段階では頻繁に発生）・開発コストの高さと収益化までの長い時間軸・SpaceXのFalcon 9による競争（圧倒的な低コスト・高頻度打ち上げ）・宇宙スタートアップの資金調達困難です。

ロケット打ち上げ成功・大型契約獲得・宇宙戦略基金の新規採択発表などのタイミングでこのテーマの出来高が急増することがあります。テーマ一覧で宇宙・衛星の騰落率・出来高をチェックし、モメンタムが「転換↑」に転じたタイミングをニュースと照合することが有効です。


H2: 日本の月探査と深宇宙探査

JAXAは「SLIM（スリム：小型月着陸実証機）」を2024年1月に月面着陸させ、世界初の「ピンポイント着陸（目標地点から100m以内）」を実証しました。SLIMは着陸後に転倒するトラブルがあったものの、太陽電池の発電を確認し複数の月面画像を送信するという成果を上げました。この成功は日本が「月面高精度着陸技術」を持つ数少ない国の一つであることを証明し、将来のアルテミス計画（NASA主導の有人月探査）への日本の貢献可能性を示しました。

H2: アルテミス計画と日本の役割

米国が主導するアルテミス計画（2020年代中の有人月面着陸・月軌道ステーション建設）に日本は重要なパートナーとして参加しています。JAXAは月軌道ゲートウェイ（月を回る宇宙ステーション）の居住モジュール・生命維持システムの開発を担当します。日本人宇宙飛行士の月面着陸が実現する見通しで、これが実現すれば日本の宇宙産業への国際的な評価・資金流入が大幅に高まります。

H2: 商業宇宙の市場規模と成長予測

宇宙ビジネスのグローバル市場規模は2040年に1兆ドル超に達するという予測があります（モルガン・スタンレー等）。宇宙輸送（ロケット打ち上げ）・衛星製造・衛星データ利用・宇宙旅行・スペースデブリ除去という各分野が成長し、民間企業の参入が加速しています。SpaceX（非上場）のFalcon 9・Starshipが市場をリードしていますが、欧州・日本・インド・中国も独自の商業打ち上げ市場を確立しようとしています。

H2: QPS研究所と国内宇宙スタートアップ

QPS研究所（5595）は福岡発の衛星スタートアップで、小型SAR（合成開口レーダー）衛星を複数打ち上げてコンステレーションを構築し、地球観測データサービスを提供しています。SARは天候・昼夜に関わらず地表を観測できるため、防災・農業・インフラ管理・海運・安全保障など幅広い用途があります。東証グロース市場への上場を通じて知名度が高まっており、宇宙スタートアップの先駆けとして注目を集めています。

H2: StockWaveJP編集部の見解

宇宙・衛星テーマを観察すると、「ロケット打ち上げ成功・失敗」「宇宙戦略基金の新規採択発表」「JAXAの重大発表」のタイミングで出来高が急変することが最も特徴的です。QPS研究所のような小型宇宙スタートアップは、衛星打ち上げ成功・大型受注のニュース一つで株価が30〜50%以上動くことがあり、出来高の変化を事前に察知することが投資タイミングの鍵になります。宇宙テーマは「開発フェーズ」から「商業化フェーズ」への移行が今まさに起きている段階であり、実際の収益・受注実績が積み上がっていく過程をStockWaveJPのデータで確認していくことが、このテーマへの正確な評価につながります。中長期の成長テーマとして位置づけながら、短期的なカタリスト（打ち上げ成功・契約締結）を起点としたモメンタム投資を組み合わせるアプローチを推奨します。

H2: JAXAのミッションと日本の宇宙政策

JAXAは2024年に月面着陸探査機「SLIM」が精密着陸に成功し、日本が世界で5番目に月面軟着陸を達成した国となりました。この成功はH3ロケットの商業打ち上げ成功と相まって、日本の宇宙技術力の世界的な再評価につながりました。政府の宇宙戦略基金（1兆円超）とJAXAの技術力が組み合わさることで、日本独自の宇宙産業エコシステムが形成されつつあります。

H2: まとめ

宇宙・衛星テーマは「政府の大型投資（宇宙戦略基金）」「民間宇宙ビジネスの本格離陸」「防衛宇宙への需要急増」という三つの強力なドライバーを持つ長期成長テーマです。SLIMの月着陸・H3の商業打ち上げ成功・Astroscaleのデブリ除去実証という「日本宇宙技術の世界的な成果」が積み重なる中、StockWaveJPで宇宙・衛星テーマのモメンタムと出来高変化を追跡することで、次のカタリストを早期に察知できます。
`},{id:"value-investing-guide",category:"投資手法",icon:"💎",title:"バリュー投資の基礎：割安株の見つけ方と長期投資の実践",date:"2026/04/05",themes:["銀行・金融","保険","バフェット銘柄"],keywords:["バリュー投資","PBR","PER","割安株","長期投資","ウォーレンバフェット","ROE"],summary:"PERやPBRなどの指標を使って「割安な株」を見つけるバリュー投資の基本を解説します。バフェットが実践する長期保有の哲学から、日本株での活用法まで初心者にもわかりやすく説明します。",body:`
H2: バリュー投資とは何か

バリュー投資（Value Investing）とは、企業の「本来の価値（内在価値）」と比べて株価が割安になっている銘柄を買い、株価が適正水準に戻るまで長期保有する投資手法です。ウォーレン・バフェットの師であるベンジャミン・グレアムが1934年に「証券分析」で体系化し、バフェットがさらに発展させたことで「株式投資の王道」とも呼ばれるようになりました。

バリュー投資の核心は「株式市場は短期的に非合理的な価格をつけることがあるが、長期的には企業の本来の価値に収束する」という考え方です。市場の過剰な悲観・恐怖によって売り込まれた優良企業の株を買い、株価が適正水準に戻るまで待ち続けるという、忍耐と分析力が求められる戦略です。

H2: バリュー投資の主要指標と計算方法

H3: PER（株価収益率）

PER = 株価 ÷ 1株あたり純利益（EPS）

PERは「今の株価は利益の何年分か」を示す最も基本的な割安度指標です。PER15倍であれば現在の利益水準が15年続いた場合の累積利益と株価が等しいことを意味します。

日本株全体のPER平均は通常14〜18倍程度で推移しており、PER10倍以下の銘柄は「割安水準」と判断されることが多いです。ただし業種によって平均水準が大きく異なります。グロース株・IT系は20〜50倍以上が普通、銀行・不動産などは10倍以下が多いです。異なる業種同士をPERだけで比較することは適切ではありません。

H3: PBR（株価純資産倍率）

PBR = 株価 ÷ 1株あたり純資産（BPS）

PBRは「株価が会社の解散価値の何倍か」を示す指標です。PBR1.0倍は「株価 ＝ 会社の純資産」を意味し、PBR1倍割れは「株価 < 解散価値」、つまり「今すぐ会社を清算した場合に株主が受け取れる金額より安い値段で株が買える状態」です。

2023年に東京証券取引所がPBR1倍割れ企業に対して改善策の開示を要請したことで、多くの日本企業が増配・自社株買いを実施し、バリュー株の一大イベントとなりました。

H3: ROE（自己資本利益率）

ROE = 純利益 ÷ 自己資本 × 100

ROEは「株主から預かったお金をどれだけ効率よく使って利益を生んでいるか」を示す経営効率の指標です。目安として8%以上が「優良企業」とされます。バフェットが長年投資してきた企業（コカ・コーラ・アメリカン・エキスプレス等）は概してROE20〜30%以上という高いリターンを長年維持しています。

H3: PEGレシオ（成長調整PER）

PEG = PER ÷ EPS成長率（%）

バリュー投資の視点でグロース株を評価する際に有効な指標です。PEGが1.0以下であれば「成長率に対して割安」と判断できます。PER50倍でもEPS成長率が60%以上なら「成長を考慮した割安株」として評価できます。

H2: バリュー投資の実践手順

H3: ステップ1：スクリーニング（銘柄を絞り込む）

まず証券会社のスクリーニングツールを使い「PER15倍以下・PBR1倍以下・ROE8%以上・配当利回り3%以上」などの条件で候補銘柄を絞り込みます。スクリーニングで絞り込んだ後は「なぜ割安なのか」を必ず確認します。業績悪化・不祥事・構造的な衰退産業による割安は「バリュートラップ」の可能性があります。

H3: ステップ2：業績分析（3〜5年の決算データ）

候補銘柄の過去3〜5年の決算データ（売上・営業利益・純利益・キャッシュフロー）を確認します。売上・利益が安定して成長しているか、あるいは安定的に推移しているかをチェックします。大きな赤字・不規則な損益は財務の安定性への懸念となります。

H3: ステップ3：財務健全性の確認

自己資本比率（40%以上が目安）・有利子負債の水準・フリーキャッシュフローのプラス維持を確認します。財務基盤が脆弱な企業は景気後退時に倒産リスクが高まるため、バリュー株の「安全域」が確保できません。

H3: ステップ4：競争優位性（ウォーモート）の評価

「この企業が10年後もビジネスを続けられるか」を評価します。ブランド力・特許・ネットワーク効果・規制による参入障壁・低コスト構造などの競争優位性があるかを確認します。

H3: ステップ5：適正株価の試算

DCF法（将来のキャッシュフローを現在価値に割引く方法）や「PER×予想EPS」などで適正株価を試算し、現在の株価との乖離（安全域）を計算します。一般的に「適正価格の70%以下で購入できる状態」が十分な安全域とされています。

H2: バリュー投資の落とし穴：バリュートラップ

バリュー投資の最大の失敗パターンが「バリュートラップ（割安に見えて実は正当評価の罠）」です。PERやPBRが低くても、以下の場合は「割安ではなく正当評価」または「さらに下落する可能性がある」と判断すべきです。

業績が毎年悪化している企業（PERが低いのは利益が減少して計算上低く見えるだけ）、産業全体が構造的に衰退している（石炭・新聞・フィルム等）、財務レバレッジが高く景気後退で危機になりうる、経営陣の資本配分が不適切（利益を無駄な投資に使い続けている）などがバリュートラップの典型的な特徴です。

H2: テーマ株投資とバリュー投資の融合

StockWaveJPのテーマ分析とバリュー投資を組み合わせる効果的なアプローチがあります。例えば「銀行・金融テーマが日銀利上げを背景に注目されているとき」に、そのテーマ内でPBR1倍割れ・ROE10%以上・連続増配という条件を満たす地方銀行株をスクリーニングするという方法です。テーマの追い風（モメンタム）と個別銘柄のバリュー評価を組み合わせることで、「割安な銘柄がさらに割安になる」という事態を避け、テーマ全体の資金流入がバリュー株の適正評価への回帰を加速するタイミングに乗ることができます。

H2: StockWaveJP編集部の見解

バリュー投資において当編集部が最も重要と感じているのは「なぜ割安なのかという理由の確認」です。同じPBR0.7倍・PER8倍という割安株でも、「業界全体が成熟・縮小しているために長年割安放置されている株」と「最近の悪材料（一時的な業績悪化）で過剰に売られた優良企業の株」では、投資のリターンが大きく異なります。

StockWaveJPで「そのテーマ全体のモメンタムがどの状態か」を確認することが、バリュー株の「割安放置から適正評価へ」というプロセスの加速を判断する材料になります。テーマ全体のモメンタムが「転換↑→加速」に転じているとき、そのテーマ内のバリュー株は「業績の実態を正しく評価されるタイミング」に入っている可能性が高いです。

H2: まとめ

バリュー投資は「割安な優良企業を買い、市場が正しく評価するまで待つ」というシンプルな哲学ですが、実践には「なぜ割安か」の見極め・財務分析・長期的な競争優位性の評価という高いスキルが求められます。PER・PBR・ROEという基本指標を正しく理解し、バリュートラップを回避するための質的分析と組み合わせることが成功の鍵です。StockWaveJPのテーマモメンタムと組み合わせることで、割安株が再評価されるタイミングをより精度高く捉えることができます。
`},{id:"growth-investing-guide",category:"投資手法",icon:"🚀",title:"グロース投資の基礎：高成長企業の見つけ方と売買タイミング",date:"2026/04/05",themes:["生成AI","半導体製造装置","SaaS"],keywords:["グロース投資","成長株","PEGレシオ","売上成長率","EPS成長","GARP"],summary:"高い成長率が期待される企業（グロース株）に投資するグロース投資の基本を解説します。成長企業の見分け方、適切な買いタイミング、リスク管理まで詳しく説明します。",body:`
H2: グロース投資とは何か

グロース投資（Growth Investing）は、現在の株価が高く見えても、将来の高い成長率を先取りして投資する手法です。「今は割高だが、数年後には成長が株価を正当化する」という考え方に基づいており、ピーター・リンチ（マゼランファンド）やフィリップ・フィッシャーが体系化しました。バリュー投資が「現在の割安さ」を重視するのに対し、グロース投資は「将来の成長可能性」を最重要視します。

グロース株の最大の特徴は高いPER（株価収益率）です。一般的にPER15〜20倍が「普通」とされる日本株市場で、PER50倍・100倍という銘柄がグロース株には珍しくありません。これは「今の利益は少ないが、将来は大きな利益を生む」という期待が株価に織り込まれているためです。エヌビディアも2020年時点では「割高すぎる」と言われながら、AI需要という成長テーマを背景に株価が数十倍に上昇しました。

H2: グロース企業を見分ける7つの指標

H3: ①売上高成長率（最重要指標）

グロース投資で最も重視すべき指標が売上高の成長率です。前年同期比で20%以上の売上成長が継続している企業は「グロース株の候補」として評価されます。ただし「売上は増えているが赤字が拡大している」企業は注意が必要で、売上成長と利益率の両方を確認することが重要です。

H3: ②EPS（1株利益）の成長率

売上成長が利益に結びついているかを確認するため、EPS（1株あたり純利益）の成長率も重要です。理想的なグロース企業は売上成長と同等またはそれ以上のペースでEPSが成長しています。売上は成長しているがEPSが横ばい・低下している場合、コスト増大・競争激化のサインである可能性があります。

H3: ③PEGレシオ（成長調整後バリュエーション）

PEGレシオは「PER ÷ EPS成長率（%）」で計算します。PER50倍でもEPS成長率が60%なら、PEG＝0.83となり「成長率に対して割安」と判断できます。一般的にPEG1.0以下が「割安」、1.5以上が「割高」の目安とされています。単純なPERだけでなくPEGを使うことで、高PERのグロース株を適切に評価できます。

H3: ④TAM（総市場規模）の大きさ

グロース企業が狙っている市場（TAM: Total Addressable Market）が大きいほど、長期的な成長余地があります。AI・半導体・再生可能エネルギー・医薬品など「兆円規模」の市場にいる企業は、長期的な成長ストーリーを描きやすいです。逆に市場規模が小さい分野での高成長は、早い段階で成長の天井に達するリスクがあります。

H3: ⑤競争優位性（ウォーモート）の存在

グロース企業が成長を持続するには、競合他社が容易に模倣できない「競争優位性（ウォーモート）」が必要です。特許・ブランド力・ネットワーク効果（ユーザーが増えるほど価値が上がる）・スイッチングコスト（他社への乗り換えが難しい）などが代表的です。ウォーモートのないグロース企業は、競合の参入によって急速に成長が鈍化するリスクがあります。

H3: ⑥売上総利益率（グロスマージン）の水準と推移

売上総利益率（売上高から原価を引いた粗利の割合）は、ビジネスモデルの品質を示します。SaaS企業は70〜80%、製薬会社は60〜70%、製造業は20〜30%が典型的な水準です。重要なのは「水準の高さ」だけでなく「成長に伴ってマージンが改善しているか」です。規模が拡大するほど利益率が上がる「スケールメリット」があるビジネスは、長期的に高いリターンをもたらす可能性があります。

H3: ⑦経営陣の質と創業者の存在

グロース企業の成功には、優れた経営者の存在が不可欠です。創業者が経営に関与している「創業者主導企業」は、一般的にプロ経営者が率いる企業よりも長期的な成長に積極的な傾向があります。アマゾンのジェフ・ベゾス・エヌビディアのジェンスン・ファン・ソフトバンクの孫正義など、ビジョンと実行力を持つリーダーの存在はグロース企業の重要な評価要素です。

H2: 日本株グロース株の特徴と注意点

H3: 日本のグロース市場（旧マザーズ）の特性

東証グロース市場（旧マザーズ）は比較的小型・新興企業が上場する市場で、高い成長期待と高いリスクが共存します。2021〜2022年に米国の金利上昇を受け、グロース指数は高値から60〜70%以上の下落を経験しました。高PERのグロース株は金利上昇局面で特に大きく売られる特性があることを理解する必要があります。

H3: 日本のグロース株で注目すべき分野

2026年時点で日本のグロース株で特に注目される分野はAI・クラウド関連SaaS（マネーフォワード・freee・Sansan等）、医薬品・バイオ（第一三共のADC技術を中心としたバイオ創薬）、フィンテック（キャッシュレス・BtoB SaaS）、そして宇宙・防衛の新興企業です。

H2: グロース投資の実践：買い・売りのタイミング

H3: 買いのタイミング

グロース株の最適な買い場は「好決算発表直後に出来高を伴いながら株価が上昇したとき」です。特に「売上が予想を大幅に上回る（ポジティブサプライズ）＋通期予想を上方修正」という決算は最も強いサインです。また「新規上場後の初値形成から3〜6ヶ月経過し、落ち着いてきた段階」も狙い目の一つです。

H3: 売りのタイミング

グロース株の売り時は難しいですが、以下のサインが出たら利益確定を検討します。売上成長率が前四半期から鈍化し始めたとき（例：40%成長→25%成長→15%成長）、PEGレシオが2.0を大幅に超えてきたとき、競合他社の参入によってマージンが圧迫され始めたとき、そして「もはや誰もがその銘柄を知っている」状態になったときです。

H2: グロース投資のリスク管理

グロース株は「高リターン・高リスク」であるため、ポートフォリオの中での位置づけを明確にする必要があります。一般的にグロース株への投資はポートフォリオ全体の30〜40%程度に抑え、残りをバリュー株・高配当株・債券などで分散することが推奨されます。

損切りルールは必須で、購入価格から20〜25%下落したら機械的に損切りする規則を事前に決めておきます。グロース株の損失は大きくなりやすいため、感情を排除した機械的な損切りが長期的な資産保全に不可欠です。

H2: テーマ株投資とグロース投資の組み合わせ

StockWaveJPでのテーマ株分析は、グロース投資と相性が抜群です。テーマ一覧で「騰落率・出来高・モメンタムが揃って強い」テーマを特定し、そのテーマ内でグロース指標（PEGレシオ・売上成長率）が優れた銘柄を選ぶ「テーマ×グロース」の複合アプローチは、両手法の弱点を補い合います。

例えば「AI・クラウドテーマが加速モメンタムにある」ときに、同テーマ内のSaaS企業の中で売上成長率30%以上・PEG1.5以下の銘柄を選ぶことで、テーマ全体の追い風を受けながら個別銘柄のバリュエーション上のリスクも管理できます。

H2: StockWaveJP編集部の見解

グロース投資において当編集部が最も重視しているのは「テーマのモメンタムとグロース株の決算タイミングの組み合わせ」です。

特定のテーマ（例：AI・クラウド）のモメンタムが「加速」状態にある時期に、そのテーマ内の企業が好決算を発表した場合、「テーマの追い風」と「個別企業の業績サプライズ」が重なることで、通常よりはるかに大きな株価上昇が起きることを繰り返し観察しています。

逆に、テーマのモメンタムが「失速・転換↓」の時期には、たとえ個別企業の決算が好調でも株価の上昇は限定的になりがちです。グロース株は「テーマの潮流」に強く連動するため、個別銘柄の分析だけでなく、StockWaveJPでテーマ全体の状態を常に確認することが、グロース投資の精度を高める上で重要と考えています。

また、日本のグロース株特有の注意点として、株式市場全体のリスクオフ（VIX上昇・円高進行）の局面では、個別企業の業績とは無関係に大きく売られる「グロース株の不条理な下落」が起きやすいことも覚えておく必要があります。テーマのモメンタム確認と同時に、マクロ環境（為替・金利・米国市場の動向）のチェックも組み合わせることを推奨します。

H2: まとめ

グロース投資は「未来の成長に先んじて投資する」戦略で、高いリターンが期待できる反面、バリュエーションの高さと成長鈍化リスクという二つの大きなリスクを抱えています。成功の鍵は「本当に長期的な成長が見込めるビジネスモデルか」を見極める目と、感情に流されない損切りルールの徹底です。StockWaveJPのテーマ分析ツールと組み合わせることで、グロース投資のエントリー精度と出口判断を大幅に向上させることができます。
`},{id:"momentum-investing-advanced",category:"投資手法",icon:"📈",title:"モメンタム投資の実践：出来高と騰落率で読むトレンドフォロー戦略",date:"2026/04/05",themes:[],keywords:["モメンタム投資","トレンドフォロー","出来高","52週高値","移動平均","相対強度"],summary:"価格の勢い（モメンタム）を利用するモメンタム投資の理論と実践を解説します。学術的に証明された「強いものはより強くなる」効果を、テーマ株投資にどう活かすかを説明します。",body:`
H2: モメンタム投資とは何か

モメンタム投資（Momentum Investing）とは、「直近で上昇した資産はしばらく上昇し続け、下落した資産はしばらく下落し続ける傾向がある」という市場の特性（モメンタム効果）を利用する投資手法です。「強いものをさらに買う」という、バリュー投資の「割安なものを買う」とは一見逆に見えるアプローチですが、学術研究で広く効果が確認されており、機関投資家も積極的に活用しています。

1993年にジェガディッシュとティットマンが発表した研究では、過去6〜12ヶ月で強いパフォーマンスを示した米国株は、次の3〜12ヶ月でも市場平均を上回る傾向があることが統計的に証明されました。この「モメンタムファクター」はその後、日本株・欧州株・新興国株など世界の主要市場でも確認されています。

H2: なぜモメンタムが持続するのか：メカニズムの解説

モメンタムが発生・持続する理由は複数あります。

H3: ①情報の遅延伝播（アンダーリアクション）

企業の好業績・新製品・規制緩和などのポジティブな情報は、すべての投資家に同時に伝わるわけではありません。情報を早期に入手した機関投資家・アナリストが先に買いを入れ、後から情報を得た投資家が追随することで株価の上昇が段階的に続きます。この「情報の遅延伝播」がモメンタムの主要な発生源の一つです。

H3: ②需給の連鎖とトレンドフォロー

上昇している株にはトレンドフォロー型の投資家（CTA：商品取引アドバイザー）・アルゴリズムトレード・インデックスリバランスなどの機械的な買いが入りやすく、上昇が加速します。また、株価上昇によりアナリストのカバレッジ開始や格上げが増え、さらに新たな買い手を呼び込むという連鎖が生まれます。

H3: ③確証バイアスと過剰反応

上昇トレンドにある銘柄・テーマについては、ポジティブなニュースが集まりやすく、投資家はそれを重視する傾向（確証バイアス）があります。結果として、しばしば「行き過ぎた上昇（過剰反応）」が生じ、モメンタムが増幅されます。

H2: 出来高とモメンタムの深い関係

StockWaveJPが騰落率とともに重視しているのが「出来高」と「売買代金」です。モメンタム投資においてこの2指標は非常に重要な意味を持ちます。

「株価の上昇＋出来高の増加」の組み合わせは、多くの参加者が納得して買っているという「強いモメンタム」の証拠です。一方で「株価の上昇＋出来高の減少」は、売り手が少ないだけで実際の買いの勢いが弱まっているサインであり、上昇が続かない可能性があります。

テーマ株においては、特定テーマの出来高急増は「機関投資家・外国人投資家が注目し始めた」初期シグナルとして機能することが多いです。個人投資家よりはるかに大きな資金を動かす機関投資家が買い始めると、出来高が急増し株価が継続上昇するパターンが生まれます。StockWaveJPの出来高ランキングで突然上位に浮上したテーマは、この「機関投資家の注目シグナル」として注目に値します。

H2: StockWaveJPのモメンタム指標5分類の詳細

当サイトでは各テーマを「🔥加速・↗転換↑・→横ばい・↘転換↓・❄️失速」の5状態に分類しています。それぞれの状態の意味と投資判断への活用方法を詳しく説明します。

H3: 🔥加速（強気継続）

短期・中期ともに騰落率がプラスで、かつ前週より改善している状態です。出来高が増加しながら株価が上昇している「理想的なトレンド」を示します。トレンドフォロー戦略が最も機能しやすい局面で、追随資金が入りやすく、上昇の持続性が高いと判断できます。ただし「加速」状態が長期間続いた後は過熱感が高まるため、週次での確認が重要です。

H3: ↗転換↑（反転初動）

前週まで下落（マイナス騰落率）だったテーマが、今週プラスに転じた状態です。モメンタム投資において最も注目すべきシグナルの一つで、「底値からの反転初動」を意味する可能性があります。出来高増加を伴う転換↑は特に信頼性が高く、翌週以降に「加速」に転じるケースが多いです。

H3: →横ばい（方向感なし）

騰落率がほぼゼロ付近で推移し、明確なトレンドが存在しない状態です。この局面でのエントリーは方向感がないため避けるのが基本です。ブレイクアウト（横ばいからどちらかに動き始めるタイミング）を待ってから参入する戦略が有効です。

H3: ↘転換↓（弱気初動）

前週まで上昇していたテーマが、今週マイナスに転じた状態です。高値圏からの下落初動の可能性があり、保有ポジションの利益確定を検討する局面です。出来高が増加しながら下落している転換↓は、大口投資家の売りが出ている可能性があり、特に注意が必要です。

H3: ❄️失速（下落継続）

短期・中期ともに騰落率がマイナスで、前週よりさらに悪化している状態です。下落トレンドが継続・加速しており、損切り売りが損切り売りを呼ぶ展開になりやすい局面です。反転サインが明確に出るまでは新規参入を避け、保有ポジションは損切りルールに従って整理することを推奨します。

H2: 実践的なモメンタム投資の手順

H3: ステップ1：テーマ一覧でモメンタム確認

毎週1回（週初め月曜または週末）にStockWaveJPのテーマ一覧を開き、騰落率ランキング上位とモメンタムのカードを確認します。「加速」または「転換↑」のテーマを「注目テーマ」としてリストアップします。

H3: ステップ2：出来高・売買代金で裏付け確認

注目テーマの出来高ランキング・売買代金ランキングも同時に確認します。騰落率上位＋出来高上位＋モメンタム加速の三拍子が揃っているテーマが最も信頼性の高い候補です。

H3: ステップ3：テーマ別詳細で個別銘柄を絞り込む

テーマ別詳細ページで、そのテーマ内の構成銘柄を騰落率・出来高でソートして確認します。テーマ全体が上昇している中でも、特に高い騰落率・出来高急増を示している銘柄に資金が集中している可能性があります。

H3: ステップ4：テーマヒートマップで期間別強さを確認

テーマヒートマップで「1週・1ヶ月・3ヶ月・6ヶ月・1年」の全期間で強いテーマかどうかを確認します。短期だけでなく中長期でも強いテーマは、一時的なバブルではなく構造的な成長トレンドにある可能性が高いです。

H2: モメンタムが崩れるサインと出口戦略

モメンタム投資で最も難しいのは「いつ出口を取るか」です。以下のサインが出たら利益確定・損切りを検討します。

テーマのモメンタムが「加速→横ばい→転換↓」に変化したタイミングが最も明確な出口サインです。また「株価は高値更新しているが出来高が減少している（ダイバージェンス）」も、上昇の勢いが弱まっているサインです。さらに「そのテーマに関する楽観的なニュースが毎日のように流れ、SNSでの話題が急増している」ような過熱局面も、利益確定を検討すべきサインです。

損切りは購入価格から10〜15%下落を目安に機械的に実施することを推奨します。「まだ戻るかもしれない」という希望的観測で損切りを遅らせると、損失が雪だるま式に拡大するリスクがあります。

H2: StockWaveJP編集部の見解

StockWaveJPのデータを継続的に観察していると、モメンタム投資において特に有効なパターンがあることがわかります。

最も注目しているのは「転換↑」から「加速」に転じるタイミングです。長期間失速・転換↓が続いたテーマが突然「転換↑」を示したとき、同時に出来高が急増していれば、「底値から反転した最初の週」を掴んでいる可能性があります。このタイミングは後から振り返ると「最良のエントリー地点だった」ことが多いのですが、その時点では「本当に転換したのかわからない」という不確実性があります。

そのため、当編集部では「転換↑を確認したら小さなポジションでエントリーし、翌週に加速に転じたら追加投資する」という段階的なアプローチを有効と考えています。一度に大きなポジションを取るよりも、シグナルの確認度合いに応じて少しずつ積み上げていく方法が、モメンタム投資のリスク管理として実践的です。

また、日本株特有の特性として「政策イベント前後でモメンタムが急変する」ことも観察されます。日銀の政策会合・予算案の閣議決定・決算シーズンなど、特定のイベントのタイミングで複数のテーマが同時に「転換↑」または「転換↓」に動くことがあります。このようなマクロイベントのカレンダーを把握した上でモメンタムを確認することで、より精度の高い判断が可能になります。

H2: まとめ：モメンタム投資をStockWaveJPで実践するために

モメンタム投資は「強いものをさらに買う」という一見シンプルな戦略ですが、その実践には「どの指標でモメンタムを測るか」「いつエントリーするか」「どうやって出口を取るか」という三つの技術が必要です。

StockWaveJPはこの三つすべての判断材料を提供します。テーマ一覧の騰落率・出来高ランキングでエントリー候補を絞り込み、モメンタムページで状態を確認し、テーマヒートマップで期間別強さを検証する。この流れを週1回習慣化するだけで、モメンタム投資の精度は大きく改善されます。

最後に重要な注意点として、モメンタム投資はトレンドが存在する相場環境では非常に有効ですが、市場全体が方向感を失っている「横ばい相場」や「乱高下相場」では機能しにくくなります。VIX（恐怖指数）が高く市場全体が不安定な時期は、モメンタムシグナルの信頼性が低下することを理解した上で活用してください。
`},{id:"technical-analysis-basics",category:"投資手法",icon:"📊",title:"テクニカル分析の基礎：移動平均線・RSI・MACDの読み方",date:"2026/04/05",themes:[],keywords:["テクニカル分析","移動平均線","RSI","MACD","ゴールデンクロス","デッドクロス","ローソク足"],summary:"テクニカル分析の基本的な指標（移動平均線・RSI・MACD）の読み方を初心者向けに解説します。チャートの見方からシグナルの使い方まで、実践的な投資判断に役立てましょう。",body:`
H2: テクニカル分析とは何か

テクニカル分析とは、過去の株価・出来高のデータをチャート（グラフ）で分析し、将来の株価の方向性・売買タイミングを判断する手法です。「すべての情報は市場価格に織り込まれている」「価格はトレンドを形成する傾向がある」「過去のパターンは繰り返す傾向がある」という三つの前提に基づいています。

ファンダメンタルズ分析が「この銘柄は買う価値があるか（何を買うか）」を判断するのに対し、テクニカル分析は「今がエントリー・エグジットの適切なタイミングか（いつ買うか・いつ売るか）」を判断するのに適しています。多くの投資家が両方を組み合わせて使います。

H2: ローソク足チャートの読み方

H3: ローソク足の基本構造

ローソク足は日本発祥のチャート技法で、1本のローソク足が一定期間（1日・1週・1ヶ月など）の株価の動きを「始値・高値・安値・終値」の4本値で表示します。

始値より終値が高い（値上がりした）日は「陽線（白・緑）」、始値より終値が低い（値下がりした）日は「陰線（黒・赤）」で表示されます。ローソクの実体（始値〜終値の範囲）の上下に伸びる「ひげ」は、その期間中の最高値・最安値を示します。

H3: 重要なローソク足パターン

長い下ひげ（タクリ足・ハンマー）は安値圏での強い買い意欲を示し、底打ちのサインとして知られています。長い上ひげ（首吊り足・流れ星）は高値圏での強い売り圧力を示し、天井形成のサインとして警戒が必要です。「包み足（前の足の高値・安値をすべて包む大きなローソク足）」は強いトレンド転換のサインになることがあります。

H2: 移動平均線（MA）の活用法

H3: 移動平均線の種類と意味

移動平均線は直近N日間の終値の平均を日々計算して結んだ線です。よく使われるのは短期の25日線（約1ヶ月）・中期の75日線（約3ヶ月）・長期の200日線（約1年）です。移動平均線は「全体のトレンドの方向性」を示す指標で、株価が移動平均線より上にある場合は上昇トレンド、下にある場合は下降トレンドと判断します。

H3: ゴールデンクロスとデッドクロス

ゴールデンクロスは短期線（例：25日線）が長期線（例：75日線）を下から上に突き抜けるパターンで、上昇トレンドへの転換シグナルとして最もよく知られています。デッドクロスは逆で、短期線が長期線を上から下に突き抜けるパターンで下降トレンドへの転換シグナルです。ただし、これらはあくまで「遅行指標（過去のデータから計算されるため、シグナルが出るのは転換後になる）」であることを理解しておく必要があります。

H3: 移動平均線のサポートとレジスタンス

株価が上昇トレンドにある時、株価が75日線や200日線まで下落して反発することがよくあります（移動平均線がサポートとして機能）。逆に下降トレンドでは移動平均線が上値の抵抗線（レジスタンス）として機能し、株価が移動平均線に近づくたびに売られることがあります。

H2: RSI（相対力指数）の読み方と活用

H3: RSIの計算と意味

RSI（Relative Strength Index）は0〜100の数値で表される「買われすぎ・売られすぎ」を測るオシレーター系指標です。一定期間（通常14日間）の値上がり幅の平均と値下がり幅の平均の比率から計算されます。

70以上は「買われすぎ（過熱圏）」、30以下は「売られすぎ（底値圏）」と判断するのが一般的です。RSIが70を超えて高値をつけた後に70を下回った場合は利益確定のシグナル、30を下回った後に30を回復した場合は底打ちのシグナルとして使われます。

H3: RSIのダイバージェンス（逆行現象）

株価が高値を更新しているのにRSIが前回高値を下回る「弱気ダイバージェンス」は天井形成のサイン、株価が安値を更新しているのにRSIが前回安値を上回る「強気ダイバージェンス」は底打ちのサインとして知られています。このダイバージェンスは単純なRSIの水準判断より信頼性が高いとされています。

H2: MACD（移動平均収束拡散法）の実践

H3: MACDの構成要素

MACDは「短期EMA（指数平滑移動平均）」と「長期EMA」の差（MACDライン）と、そのシグナルライン（MACDラインの移動平均）から構成されます。標準的な設定は短期EMA12日・長期EMA26日・シグナル9日です。

H3: MACDシグナルの読み方

MACDラインがシグナルラインを下から上に突き抜けた（ゴールデンクロス）タイミングが買いシグナル、上から下に突き抜けた（デッドクロス）タイミングが売りシグナルです。MACDとシグナルの差を棒グラフで表示した「ヒストグラム（MACDバー）」が正から負に転換した場合も売りシグナルとして機能します。

H2: 出来高分析：テクニカル分析の補完指標

テクニカル分析において出来高は非常に重要な補完指標です。「価格の動きと出来高の組み合わせ」で判断の精度が上がります。「株価上昇＋出来高増加」は強い買いの勢いを示す信頼性の高いシグナルです。「株価上昇＋出来高減少」は買いの勢いが弱まっているサインで、上昇の持続性に疑問符がつきます。「株価下落＋出来高急増」は大口の売りが出ている可能性を示す警戒サインです。

H2: テクニカル分析とStockWaveJPの組み合わせ

StockWaveJPが提供するテーマ別騰落率・出来高データはテクニカル分析の視点から活用できます。複数週にわたる騰落率の推移が「下落→横ばい→反転上昇」のパターンを示し、同時に出来高が増加している場合は底打ちからの反転シグナルです。これはテクニカルの「ゴールデンクロスに相当するテーマレベルのシグナル」として機能します。

H2: テクニカル分析の限界と注意点

テクニカル分析は過去のパターンの繰り返しを前提にしていますが、未来が常に過去と同じとは限りません。決算発表・政策変更・地政学的イベントなどのファンダメンタルな要因により、テクニカルシグナルが無効化されることがあります。「コンフルエンス（複数の指標が同時にシグナルを発するタイミング）」を重視することで、単一指標に依存するリスクを低減できます。

H2: StockWaveJP編集部の見解

テクニカル分析を日本株のテーマ投資に組み合わせるとき、当編集部が最も有効と感じているのは「移動平均線のゴールデンクロス＋出来高増加＋モメンタム転換↑の三重シグナル」です。個別銘柄の週足チャートでゴールデンクロスが発生し、同時にそのテーマ全体のモメンタムが転換↑を示し、出来高が前週比2倍以上に増加しているタイミングは、買いの信頼性が非常に高いと考えています。

逆に「株価は高値付近にあるが、テーマのモメンタムが失速・転換↓を示し、個別銘柄の出来高が減少している」局面は、テクニカルとテーマ分析の両面から利益確定を検討するサインと捉えています。一つの指標だけでなく、テーマ全体のデータと個別銘柄のテクニカルを組み合わせる「マルチアングル分析」が投資精度の向上に有効です。

H2: まとめ

テクニカル分析は「いつ買うか・いつ売るか」のタイミングを判断する強力なツールです。ローソク足・移動平均線・RSI・MACDなどの基本指標をマスターし、出来高との組み合わせ・複数指標のコンフルエンスを意識することで、投資のエントリー・エグジット精度が大きく改善します。StockWaveJPのテーマ別データとテクニカル指標を組み合わせた「テーマ×テクニカル」の複合分析を日々の投資判断に取り入れてください。
`},{id:"stock-terms-glossary",category:"用語解説",icon:"📖",title:"株式投資用語解説：初心者が押さえるべき50の基本用語",date:"2026/04/05",themes:[],keywords:["株式用語","投資用語","PER","PBR","ROE","配当","時価総額","信用取引","空売り"],summary:"株式投資を始めるにあたって知っておくべき基本用語を50個厳選して解説します。PER・PBR・配当利回りなどの評価指標から、信用取引・空売りまでわかりやすく説明します。",body:`
H2: 株式投資の基本用語を理解する重要性

株式投資を始める上で最初の壁の一つが「専門用語」です。証券会社のサイト・経済ニュース・企業の決算資料には多くの専門用語が使われており、意味を理解しないと情報を正しく解釈できません。本コラムでは株式投資で頻繁に使われる基本用語を厳選し、初心者にもわかりやすく解説します。

H2: 株価・市場の基本用語

【時価総額（Market Capitalization）】株価×発行済株式総数で算出する「会社全体の市場価値」。1兆円超が大型株、1,000億〜1兆円が中型株、1,000億円未満が小型株の目安です。時価総額が大きいほど大口投資家（機関投資家）が売買しやすく、流動性（売買のしやすさ）が高い傾向があります。

【出来高（Volume）】一定期間に売買された株数の合計。出来高が多い銘柄は市場参加者の関心が高く、売買しやすい状態です。突然の出来高急増は「大口投資家の動き」のシグナルになることがあります。

【売買代金（Trading Value）】出来高×株価で計算する「取引された金額」。出来高よりも実際に動いた資金規模を正確に示します。大型株は少ない出来高でも大きな売買代金になるため、株価規模の異なる銘柄を比較するには売買代金の方が適切です。

【始値・高値・安値・終値（Open・High・Low・Close）】1日の取引で最初についた価格（始値）・最も高かった価格（高値）・最も低かった価格（安値）・最後についた価格（終値）の4本値。ローソク足チャートはこの4値で描かれます。

【前日比・騰落率】前日終値と比較した値上がり・値下がりの幅（円・ドル）と割合（%）。「+3.5%」であれば前日から3.5%値上がりしたことを意味します。

【52週高値・52週安値】直近52週（約1年間）での最高値と最安値。株価が52週高値を更新することは「1年間で最も高い水準」を意味し、強いモメンタムのシグナルとして重視されます。

H2: 企業評価・バリュエーション指標

【PER（Price Earnings Ratio・株価収益率）】株価÷1株利益（EPS）。「今の株価は利益の何年分か」を示す最も基本的な割安度指標。一般的に15〜20倍が目安ですが業種により大きく異なります。

【PBR（Price Book-value Ratio・株価純資産倍率）】株価÷1株純資産（BPS）。1倍割れは「解散価値以下」の超割安状態。東証が2023年にPBR1倍割れ改善を求めたことで日本株全体への注目が集まりました。

【ROE（Return on Equity・自己資本利益率）】純利益÷自己資本×100。株主資本をどれだけ効率よく使って利益を生み出しているか。8%以上が優良企業の目安。

【ROA（Return on Assets・総資産利益率）】純利益÷総資産×100。会社が持つすべての資産をどれだけ効率よく使っているかを示します。ROEより借入金の影響を受けにくい指標です。

【EPS（Earnings Per Share・1株利益）】純利益÷発行済株式数。企業の稼ぐ力の基本指標。EPSが毎年増加している企業は成長企業と判断できます。

【BPS（Book value Per Share・1株純資産）】純資産÷発行済株式数。株式の理論的な解散価値。PBRの計算に使います。

【配当利回り（Dividend Yield）】年間1株配当金÷現在の株価×100。3〜4%以上を高配当株と呼ぶことが多い。ただし株価下落により利回りが高くなるケース（配当利回りトラップ）に注意。

【配当性向（Payout Ratio）】年間配当金÷純利益×100。利益のうち何%を配当に回しているか。高すぎると業績悪化時に減配リスクがあります。

H2: 投資の基本概念・戦略用語

【ロング（買いポジション）】株を買って保有する通常の投資スタンス。株価上昇で利益が出ます。

【ショート・空売り（売りポジション）】株を借りて売り、後で安値で買い戻す投資手法。株価下落で利益が出る「逆張り」戦略。信用取引口座が必要で上級者向けです。

【損切り（ストップロス）】保有株が下落した際に損失を確定して売ること。「小さな損失で済ませる」ことが長期的な資産保全の核心。機械的なルール（例：購入価格から20%下落で必ず売る）の設定が重要です。

【利益確定（利確・テイクプロフィット）】株価が上昇した段階で売って利益を確定すること。「どこで利確するか」は損切りと並ぶ最重要の投資判断です。

【ポジション】保有している株・金融商品の状態。「ポジションを持つ＝株を買う」「ポジションを解消する＝株を売る」という使い方をします。

【ポートフォリオ】保有する金融資産全体の組み合わせ。「分散されたポートフォリオ」とは複数の資産に投資してリスクを分散した状態を指します。

H2: 市場・相場用語

【センチメント（市場心理）】投資家の心理・気分の総称。強気センチメント（楽観・リスクオン）は株高、弱気センチメント（悲観・リスクオフ）は株安につながります。

【リスクオン・リスクオフ】リスクオンは「積極的にリスクを取る姿勢」で株式・新興国通貨が買われます。リスクオフは「リスクを避ける姿勢」で株式が売られ、国債・円・金などの安全資産が買われます。

【ボラティリティ（Volatility）】株価の変動の大きさ・激しさ。ボラティリティが高い銘柄・相場は上下の値動きが激しい状態。VIX（恐怖指数）は米国株市場のボラティリティの予測値を示します。

【信用取引】証拠金を担保に株式売買の資金を証券会社から借りる取引。自己資金の約3.3倍まで取引できますが、損失も拡大するため上級者向けです。

【バブル・崩壊】株価が企業の実態価値を大幅に超えて上昇する「バブル」と、その後の急激な下落「崩壊」。日本では1989年末が最高値で、翌年から崩壊が始まった「バブル崩壊」が有名です。

H2: 決算・企業情報用語

【増収増益・減収減益】前年同期比で売上（収）と利益（益）がともに増加・減少した状態。増収増益が最も理想的で株価が上がりやすい。

【上方修正・下方修正】企業が期初に公表した業績予想を上方・下方に変更すること。上方修正発表後は急騰するケースが多い。

【決算サプライズ】アナリスト予想を大幅に上回る（ポジティブサプライズ）または下回る（ネガティブサプライズ）決算。大きなサプライズは株価の急激な変動につながります。

【自社株買い（バイバック）】会社が自社の株式を市場から買い戻すこと。発行済株式数が減少してEPSが向上し、株主還元として評価されます。

H2: StockWaveJP固有の用語

【テーマ騰落率】テーマを構成する銘柄群の株価変化率の平均値。個別銘柄のノイズを除いた「テーマ全体への資金の流れ」を把握できます。

【騰落モメンタム】StockWaveJPが各テーマの騰落率の勢いを「🔥加速・↗転換↑・→横ばい・↘転換↓・❄️失速」の5状態に分類した指標。テーマのトレンドの強さ・方向性を把握するために活用します。

【テーマローテーション】市場の資金が特定のテーマから別のテーマへ移動する現象。テーマヒートマップで複数テーマの騰落率を期間別に比較することでローテーションの方向性を把握できます。

H2: まとめ

本コラムで紹介した用語は株式投資の「共通言語」です。これらを理解することで、経済ニュース・決算資料・証券会社のレポートの内容が格段に理解しやすくなります。分からない用語が出てきたら積極的に調べる習慣をつけることが、投資力向上の基本です。
`},{id:"dividend-investing-guide",category:"投資手法",icon:"💰",title:"高配当株投資の基礎：配当利回りと連続増配銘柄の選び方",date:"2026/04/05",themes:["銀行・金融","電力会社","保険"],keywords:["配当投資","高配当株","配当利回り","連続増配","配当性向","NISA","インカムゲイン"],summary:"株式投資で安定した収入（インカムゲイン）を得る「高配当株投資」の基本を解説します。配当利回りの見方、連続増配銘柄の選び方、NISAとの組み合わせまで詳しく説明します。",body:`
H2: 高配当株投資とは何か

高配当株投資とは、配当利回り（年間配当金÷株価）が高い銘柄に投資し、毎年の配当収入（インカムゲイン）を安定的に受け取る投資戦略です。株価の値上がり益（キャピタルゲイン）を主な目的とするモメンタム投資やグロース投資とは対照的に、「持っているだけで収入が入ってくる」安定性を重視する手法です。

2024年からの新NISA制度拡充（年間360万円・非課税保有期間無期限）により、NISA口座内での配当金が非課税になることから、高配当株投資が個人投資家に急速に普及しています。配当金への20.315%の課税が免除されることで、実質的な手取り配当が増え、長期複利効果が大きくなります。

H2: 配当利回りの計算と「良い高配当」の見分け方

H3: 配当利回りの計算式

配当利回り（%）＝年間1株配当金 ÷ 現在の株価 × 100

例：株価1,000円の銘柄が年間40円の配当を支払う場合、配当利回り＝4.0%

日本株の平均配当利回りは約2%前後で推移しており、3%以上は「やや高配当」、4%以上は「高配当株」、5%以上は「超高配当株」と分類されることが多いです。

H3: 「配当利回りトラップ」に注意

高配当利回りには二種類あります。一つは「配当金が多い（業績が良く還元が手厚い）」という良いケース、もう一つは「株価が大幅に下落している」という悪いケースです。後者では分母（株価）が下がって利回りが高くなっているだけで、業績悪化→減配→さらに株価下落という「配当利回りトラップ」に陥るリスクがあります。

高い配当利回りの銘柄を見つけたら必ず「なぜ利回りが高いのか」を確認し、業績・財務・配当性向をチェックすることが重要です。

H2: 配当継続性を判断する指標

H3: 配当性向（ペイアウトレシオ）

配当性向（%）＝年間配当金総額 ÷ 純利益 × 100

利益のうち何%を配当に回しているかを示す指標です。配当性向が高すぎる（80〜100%超）場合、少しでも業績が悪化すると配当を維持できなくなるリスクがあります。一般的に30〜60%程度が健全な水準とされています。ただし業種によって異なり、銀行・保険・インフラ企業は比較的高い配当性向でも安定しやすい特性があります。

H3: フリーキャッシュフロー（FCF）の確認

利益ベースの配当性向だけでなく、実際のキャッシュフロー（現金の出入り）を確認することも重要です。FCF（フリーキャッシュフロー：営業CFから設備投資を引いた金額）が配当金総額を上回っていれば、利益以上のキャッシュで配当を支払える財務的な余裕があります。FCFが赤字にもかかわらず高配当を維持している企業は、借入で配当を支払っている状態であり持続性に疑問があります。

H3: 連続増配の実績

「連続増配（毎年配当金を増やし続けている実績）」は配当の持続可能性の最も信頼できる指標の一つです。業績が毎年安定して成長しているからこそ増配できるのであり、10年以上の連続増配実績を持つ企業は財務基盤・競争力ともに優れていることが多いです。

日本では花王（4452）が30年以上の連続増配を続けており、「日本の連続増配王」として知られています。伊藤忠商事（8001）・KDDI（9433）・三菱商事（8058）なども10年以上の連続増配実績を持ちます。

H2: 業種別の高配当株の特徴

H3: 通信（NTT・KDDI・ソフトバンク）

通信大手3社は配当利回り3〜5%台で安定した高配当を維持しています。通信インフラという景気に左右されにくい安定収益を背景に、NTTとKDDIは長期連続増配を続けています。NISA口座での長期保有に適した代表的な高配当株として認知されています。

H3: 銀行・金融（メガバンク・地銀）

日銀の利上げにより業績が改善しているメガバンクは増配が続いており、配当利回りが3〜4%台に達しています。株主還元強化（大規模自社株買い＋増配）がさらに進む見通しで、高配当としての魅力が高まっています。

H3: 総合商社（三菱商事・伊藤忠・三井物産等）

バフェットの投資で注目を集めた総合商社5社は配当利回り3〜4%台に加え、自社株買いによる株主還元も積極的です。資源価格の変動によって業績が左右されますが、事業の多角化により安定性が増しています。

H3: 日本たばこ産業（JT・2914）

JTは配当利回り5〜6%台と日本株トップクラスの高配当で知られています。ただしタバコ産業は少子高齢化・健康志向の高まりによる国内販売量の長期的な減少という構造問題を抱えており、海外展開（英国・ロシア等の買収）での成長戦略との持続性が投資判断の核心です。

H2: 高配当株投資の実践戦略

H3: 配当再投資で複利効果を最大化

受け取った配当金を同じ銘柄または別の高配当株に再投資することで、複利効果（雪だるま式に資産が増える効果）を活用できます。NISA口座内での配当は非課税のため、再投資の効率が課税口座より高くなります。

H3: 分散投資で減配リスクを管理

一銘柄に集中せず、業種・テーマを分散させて高配当株を保有することが重要です。例えば「通信2銘柄・銀行2銘柄・商社2銘柄・製造業1銘柄」のように5〜10銘柄に分散することで、一社の減配がポートフォリオ全体の配当収入に与えるダメージを軽減できます。

H2: StockWaveJPと高配当株投資の組み合わせ

StockWaveJPのテーマ分析は高配当株投資の「買い場判断」にも活用できます。銀行・金融テーマや通信テーマのモメンタムが「失速・転換↓」を示している局面は、配当利回りが相対的に高くなっている（株価が下がっているため）「高配当株の買い場」と一致することがあります。「テーマが一時的に売られている局面を狙って高配当株を仕込む」逆張り的なアプローチは、長期の配当収入を狙う投資家に有効な戦略です。

H2: StockWaveJP編集部の見解

高配当株投資において当編集部が最も重要と考えるのは「配当の持続可能性を徹底的に確認すること」です。高い利回りに飛びついた結果、業績悪化で減配・無配となり株価も大幅下落という「二重の損失」を受ける配当利回りトラップは、初心者が最も陥りやすい失敗パターンです。

連続増配の実績・配当性向の適切さ・フリーキャッシュフローの余裕・業界の競争環境という四つのチェックポイントを必ず確認した上で、StockWaveJPのテーマ分析でそのテーマ全体の長期的な方向性も確認する。この二段構えの分析が、高配当株投資の失敗リスクを大幅に低減します。

H2: まとめと今後の展望

高配当株投資は「持続的な配当収入」という明確な目標を持つ長期投資戦略です。新NISAの非課税メリットと組み合わせることで、税引き後の手取り配当収入を最大化できます。「配当利回りの高さ」だけでなく「配当の持続可能性」を重視した銘柄選別を行い、複数テーマ・業種に分散した高配当ポートフォリオを構築することが、長期的な資産形成の王道と言えます。

H2: 配当再投資の複利効果シミュレーション

配当再投資（受け取った配当を同じ銘柄に再投資する）の長期的な効果は非常に大きいです。例えば100万円を年間配当利回り4%の高配当株に投資し、毎年の配当を全額再投資した場合、20年後の資産額は約219万円（年利4%複利）となります。NISA口座（非課税）での再投資の場合、20.315%の税金がかからない分、さらに効果が高まります。

配当再投資を効率的に行うために、NISA成長投資枠での高配当株保有・配当支払い月の分散（3月・6月・9月・12月等に支払いが分散する銘柄の組み合わせ）・配当金を自動的に同じ銘柄に再投資する仕組み（一部証券会社のサービス）の活用が有効です。

H2: 高配当株投資の税務知識

NISA口座外での高配当株投資では、配当金に20.315%（所得税15.315%・住民税5%）の税金がかかります。複数の証券口座に分散している場合、「損益通算（利益と損失を相殺する）」により課税対象を減らすことができます。ただしNISA口座の損益は通算できません。

H2: まとめ

高配当株投資は「配当の持続可能性の確認」「分散投資によるリスク管理」「NISA活用による非課税メリットの最大化」という三点を押さえることで、長期的に安定したインカムゲインと資産成長を実現できる投資戦略です。StockWaveJPのテーマ分析でテーマの調整局面（モメンタム転換↓）を高配当株の割安仕込みのタイミングとして活用することも有効なアプローチです。
`},{id:"portfolio-management",category:"投資手法",icon:"📂",title:"ポートフォリオ管理の基本：分散投資・リバランス・リスク管理",date:"2026/04/05",themes:[],keywords:["ポートフォリオ","分散投資","リバランス","リスク管理","アセットアロケーション","相関係数"],summary:"複数の投資先を組み合わせてリスクを分散する「ポートフォリオ管理」の基本を解説します。アセットアロケーションの考え方から、定期的なリバランスの方法まで詳しく説明します。",body:`
H2: ポートフォリオ管理とは

ポートフォリオとは保有する金融資産（株式・債券・現金・不動産・金等）の組み合わせ全体を指します。「卵を一つのカゴに盛るな」という古くからの格言通り、複数の資産に分散することでリスクを低減しながら安定したリターンを目指す考え方がポートフォリオ管理の根幹です。

1952年にハリー・マーコウィッツが発表した「現代ポートフォリオ理論（MPT）」では、互いに相関の低い資産を組み合わせることで「同じリターンをより低いリスクで実現できる（効率的フロンティア）」ことが数学的に証明されました。この理論はその後の資産運用の基礎となり、現代の機関投資家・個人投資家のポートフォリオ構築に広く活用されています。

H2: アセットアロケーション：資産配分の考え方

H3: 主要な資産クラスとその特性

ポートフォリオを構成する主な資産クラスには以下があります。

国内株式は成長性が高い一方、景気サイクルや市場センチメントにより大きく変動します。長期では債券を上回るリターンが期待できますが、短期での損失リスクも大きいです。

海外株式（特に米国株）は世界最大の株式市場であり、技術革新をリードする企業が集中しています。為替リスク（円高になると円換算リターンが低下）を伴いますが、分散効果として国内株式との組み合わせに有効です。

国内債券（国債・社債）は株式と逆相関することが多く、ポートフォリオの安定装置として機能します。ただし低金利時代には期待リターンが低く、金利上昇局面では価格が下落するリスクがあります。

現金・現金同等物は最も安全ですが長期ではインフレに負けます。「買い場を待つための弾丸」として一定割合を保つことが重要です。

H3: 年齢に応じた資産配分の目安

「100マイナス年齢＝株式への投資比率（%）」という経験則があります。20代なら80%、40代なら60%、60代なら40%を株式に配分するイメージです。ただしこれはあくまで目安であり、リスク許容度・収入の安定性・投資目的によって個人差があります。

近年は「110〜120マイナス年齢」という修正版も提唱されています。平均寿命の延伸と低金利環境による債券の低リターンを背景に、従来より株式比率を高めに設定する考え方です。

H2: 分散投資の三つの軸

H3: ①資産クラスの分散

株式・債券・不動産（REIT）・コモディティ（金・原油）を組み合わせることで、一つの資産クラスが大きく下落しても他の資産でカバーできる構造を作ります。特に株式と債券は一般的に逆相関（株価が下がると債券価格が上がる傾向）があり、組み合わせることでポートフォリオ全体の変動を抑えられます。

H3: ②地域・国の分散

国内株だけに集中すると日本経済・日本の政治リスクに集中してしまいます。米国株・欧州株・新興国株などを組み合わせることで、特定の国の経済悪化・政情不安によるリスクを分散できます。為替リスクはありますが、長期的には地域分散がポートフォリオの安定性に貢献します。

H3: ③テーマ・業種の分散

テーマ株投資において特に重要なのがテーマ間の分散です。「半導体テーマ」と「AI・クラウドテーマ」は相関が高く、同時に上昇・下落する傾向があります。一方「銀行・金融テーマ」と「半導体テーマ」は相関が低く、組み合わせることで分散効果が生まれます。StockWaveJPのテーマヒートマップを活用することで、各テーマが同じ方向に動いているのか（相関が高い）、独立して動いているのか（相関が低い）を視覚的に把握できます。

H2: リバランスの実践

H3: リバランスが必要な理由

時間の経過とともに、各資産クラスのリターンの差によって当初設定した資産配分が崩れます。例えば「株式60%・債券40%」で始めたポートフォリオが、株式の好調により「株式75%・債券25%」になった場合、リスクが当初より高い状態になっています。リバランスとはこれを元の目標配分に戻す作業です。

H3: リバランスの方法と頻度

リバランスには「定期リバランス（年1〜2回の決まったタイミング）」と「乖離リバランス（配分が目標から5〜10%以上ずれたときに実施）」の二種類があります。

定期リバランスは「毎年1月と7月」のように決まった時期に行うシンプルな方法です。乖離リバランスは配分の乖離が大きくなったときのみ実施するため、取引コストを抑えられます。

NISAの成長投資枠では売却しても非課税のためリバランスを積極的に行いやすいというメリットがあります。課税口座では売却益に税金がかかるため、新規購入する際に不足している資産クラスを優先的に購入する「部分リバランス」が節税的に有効です。

H3: テーマ株ポートフォリオのリバランス

テーマ株投資においては、StockWaveJPのモメンタム変化をリバランスの判断材料として活用できます。「加速モメンタムにあったテーマが失速に転じた」ときが、そのテーマのポジションを縮小してより強いモメンタムのテーマに移す「テーマローテーション」のタイミングです。

H2: リスク管理の実践

H3: ポジションサイズの管理

一銘柄・一テーマへの集中投資を避けるため、単一テーマへの投資はポートフォリオ全体の20〜30%以内に抑えることを推奨します。仮に一つのテーマが50%下落しても、ポートフォリオ全体への影響を10〜15%に抑えられます。

H3: 損切りルールの徹底

購入価格から20〜25%下落したら機械的に損切りするルールを事前に設定することが重要です。このルールを感情的に破り「まだ戻るかもしれない」と保有し続けることが、投資家の最大の損失要因の一つです。

H3: 緊急資金の確保

生活費の3〜6ヶ月分は現金で確保し、投資には「余裕資金」のみを使う原則が長期投資を継続するための基本です。緊急時に投資ポジションを強制的に解消しなければならない状況になると、最悪のタイミングで損失を確定させるリスクがあります。

H2: NISAを活用した長期ポートフォリオ構築

2024年以降の新NISA制度（年間投資枠360万円・非課税保有期間無期限）は、長期ポートフォリオ構築の絶好の機会を提供しています。

つみたて投資枠（年120万円）では低コストのインデックスファンド（全世界株・S&P500）を積み立て、成長投資枠（年240万円）では個別株や高配当ETF・テーマ型株式に投資する「二段構え」の戦略が多くの投資家に支持されています。

H2: StockWaveJP編集部の見解

ポートフォリオ管理において、当編集部が最も重視しているのは「テーマ間の相関を意識したリスク管理」です。

日本株のテーマ投資を観察していると、相場環境によってテーマ間の相関が大きく変化することがわかります。例えばリスクオン相場（相場全体が上昇する局面）では半導体・AI・防衛・インバウンドなど多くのテーマが同時に上昇し、テーマ分散の効果が薄れます。一方リスクオフ相場（相場全体が下落する局面）では、食品・通信・銀行などディフェンシブテーマは相対的に強く、半導体・AI・グロース系テーマは特に大きく下落します。

これを踏まえると、テーマ株ポートフォリオは「攻め（グロース・モメンタム系テーマ）」と「守り（ディフェンシブテーマ）」のバランスを意識して構築することが重要です。StockWaveJPのテーマヒートマップで複数テーマの期間別騰落率を比較することで、「どのテーマが今の相場環境で相対的に強いか」を把握しながら、柔軟にポジション配分を調整することを推奨します。

また、「常に満額投資する必要はない」という点も当編集部が重要と考えるポイントです。相場全体のバリュエーションが過熱していると判断した場合は、現金比率を高めて「次の調整局面での買い場を待つ」ことも有効な戦略です。買い場を作るために現金を残しておくことは、感情的に動きにくい長期投資家として重要な判断力です。

H2: まとめ

ポートフォリオ管理は「どこに投資するか」よりも「どのように組み合わせるか」が重要です。資産クラス・地域・テーマの三つの軸で分散し、定期的なリバランスと損切りルールの徹底で長期的な資産形成を目指してください。StockWaveJPのテーマ分析ツールを活用することで、テーマ間の相関変化を把握しながら、より精度の高いポートフォリオ管理が可能になります。
`},{id:"toyota-analysis",category:"個別銘柄",icon:"🚗",title:"トヨタ自動車（7203）徹底解説：EV・HV戦略と2026年の投資ポイント",date:"2026/04/05",themes:["EV・電気自動車","自動運転","全固体電池"],keywords:["トヨタ","7203","自動車","EV","ハイブリッド","全固体電池","配当"],summary:"日本株時価総額1位のトヨタ自動車を徹底解説。ハイブリッド車の世界的強みとEV戦略の現状、全固体電池の開発動向、配当・株主還元の状況まで個人投資家向けにわかりやすく解説します。",body:`
H2: トヨタ自動車とはどんな会社か

トヨタ自動車（証券コード：7203）は日本最大・世界でも上位に位置する自動車メーカーです。レクサス・トヨタ・ダイハツ・日野を傘下に持ち、2024年の世界販売台数は約1,030万台と3年連続で世界首位を維持しました。日本株時価総額は最大時に50兆円を超え、東京証券取引所上場企業の中で断トツの1位です。

連結売上高は約46兆円（2024年度）と日本企業で最大規模であり、その経営規模は「トヨタが日本経済に占める比重は非常に大きく、為替が1円動くだけで数百億円の利益影響が出る」と言われるほどです。

H2: ハイブリッド車（HV）の世界的競争力

トヨタの最大の強みはハイブリッド車（HV）技術です。1997年に初代「プリウス」を世界で初めて量産化して以来、トヨタはHV技術で30年近くの先行優位を積み上げてきました。現在はカムリ・ハリアー・RAV4・アルファードなどほぼ全車種にHVモデルが設定されており、HV販売台数は年間数百万台規模です。

EV一辺倒と言われた欧米市場でも2024年以降「マルチパスウェイ（電動化技術の多様性）」の重要性が再認識され、HV・PHVへの需要が復活しています。トヨタが主張し続けてきた「電動化は一つの技術だけでなく多様な選択肢が必要」という考え方が世界的に支持されるようになっています。

H2: EV戦略の現状と課題

トヨタのEV（BEV）戦略は競合（テスラ・BYD・GM・フォルクスワーゲン）と比べると「後発・慎重」というイメージがありましたが、2024〜2026年にかけて本格的な巻き返しが始まっています。「bZ」シリーズ（bZ4X等）の販売拡大・中国市場での現地合弁によるEV開発・北米でのEV専用工場建設計画が進行中です。

H2: 全固体電池：次世代の切り札

トヨタが最も注力している技術開発が全固体電池です。現在のリチウムイオン電池が液体の電解質を使うのに対し、固体の電解質を使う全固体電池は「高いエネルギー密度（航続距離延長）・超高速充電（10分以下）・高い安全性（発火リスクほぼゼロ）」という革命的なメリットを持ちます。

トヨタは2027〜2028年に全固体電池搭載EVの量産開始を目標にしており、実現すれば世界のEV市場の勢力図を塗り替える可能性があります。全固体電池関連の特許出願数でトヨタは世界首位であり、この技術的な先行優位はまだ市場に十分に評価されていない「隠れた資産」と言えます。

H2: 財務状況と株主還元

トヨタの財務基盤は極めて堅固です。現金・預金・有価証券などの「ネット現金（手元流動性）」は数十兆円規模に達しており、世界最強クラスのバランスシートを持ちます。この巨大な財務余力が大規模なEV・全固体電池投資を可能にしています。

配当は近年増配傾向が続いており、配当利回りは2〜3%台で推移しています。自社株買いも積極的に実施しており、株主還元に積極的な姿勢が外国人投資家からも評価されています。

H2: 為替感応度：円安・円高の影響

トヨタは海外売上比率が高い（約90%）ため、為替変動の影響を強く受けます。円安は海外収益の円換算額を増加させ業績にプラス、円高は逆に業績にマイナスとなります。目安として「ドル円が1円円安になるとトヨタの営業利益が約500億円改善」とされています。

H2: 株価のバリュエーションと投資判断

PERは業績の好不調によって変動しますが、グローバルな自動車大手と比べて適切な水準です。「EV移行期の不確実性」「全固体電池への期待」「HVの安定収益」という三つの要素を総合的に評価することが重要です。

H2: StockWaveJP編集部の見解

トヨタ株はEV・電気自動車テーマの中で最も大型の銘柄であり、テーマ全体のモメンタムに強く連動します。StockWaveJPでEV・脱炭素テーマのモメンタムが「加速」状態にある局面でトヨタに出来高増加が見られる場合は、外国人投資家によるテーマへの組み入れが進んでいるシグナルです。

全固体電池の開発進捗（定期的な発表がある）とEV販売台数のモメンタム確認を組み合わせた長期投資アプローチが有効と考えています。

H2: まとめ

トヨタ自動車は「世界最強のHV技術」「全固体電池という切り札」「圧倒的な財務基盤」を持つ日本株の核心銘柄です。EV移行という産業変革期の不確実性はありますが、マルチパスウェイ戦略の再評価・全固体電池の実用化期待が中長期的な株価の支えとなっています。
    
H2: CASE戦略とトヨタの次世代ビジョン

自動車産業は「CASE（Connected・Autonomous・Shared・Electric）」という四つの変革が同時に進行する大転換期を迎えています。トヨタはこれらすべての領域に積極的に対応しています。

Connectedではコネクティッドカー（ネットに常時接続した車）から収集するデータを活用したサービス（予防整備・保険連携・交通情報等）の開発。Autonomousでは自動運転の段階的な実現（現在はレベル2のToyota Safety Sense、将来的なレベル4〜5の開発継続）。Sharedでは「KINTO」ブランドによるサブスクリプション型カーシェアリング。Electricではハイブリッド・PHEV・BEV・FCEVの全方位電動化戦略（マルチパスウェイ）を展開しています。

特に注目されるのは「ウーブン・シティ（Woven City）」プロジェクトです。静岡県裾野市に建設中の「実証実験都市」で、自動運転・パーソナルモビリティ・スマートホーム・AI活用など未来の街の技術を実際の都市環境でテストする世界初の試みです。2025年に開所しており、トヨタの次世代技術の実験場として機能しています。

H2: 世界の主要拠点と生産体制

トヨタは世界28カ国に生産拠点を持ち、海外生産比率は約60%に達します。北米（テキサス・ケンタッキー）・欧州（チェコ）・アジア（タイ・インドネシア・中国）が主要拠点です。特に北米・欧州はアルファード・RAV4などの高付加価値車種を生産しており、現地生産による為替リスク軽減と市場ニーズへの即応が強みです。

中国市場では広汽トヨタ・一汽トヨタという合弁会社を通じて事業展開していますが、EVシフトが急速に進む中国での競争激化（BYD・NIO等）が課題となっています。

H2: 関連銘柄・サプライヤー

トヨタグループの主要関連企業として、デンソー（6902、自動車部品世界大手）・アイシン（7259、ドライブトレーン部品）・豊田自動織機（6201、フォークリフト・エンジン）・トヨタ紡織（3116、内装部品）・ジェイテクト（6473、ステアリング）があります。これらはトヨタ株と連動して動くことが多いです。

海外の競合ではBYD（中国、002594）・テスラ（米、TSLA）・Volkswagen（独、VOW）・Hyundai（韓、005380）・GM（米、GM）・Ford（米、F）が主要プレイヤーです。

H2: StockWaveJP編集部の見解（詳細）

トヨタ株はEV・脱炭素テーマのモメンタムと「逆相関」することがあります。純EVメーカー（テスラ・BYD）が市場の主役として注目される局面では、HVに注力するトヨタが「EV移行に乗り遅れている」という評価で売られることがあります。しかし「マルチパスウェイの再評価」という流れが始まった2024年以降、トヨタは純EVメーカーと異なる独自の価値として再評価されるようになっています。

全固体電池の開発進捗発表・米国大型工場の開設・ウーブン・シティの進捗という三つのカタリストを定期的に確認し、これらが具体化するタイミングにStockWaveJPのEV・脱炭素テーマのモメンタム変化を組み合わせることで、トヨタ株への投資タイミングを精度高く管理できます。

H2: まとめ

トヨタ自動車は世界トップの自動車メーカーとして、EV移行という大変革期でも「マルチパスウェイ戦略・全固体電池・ウーブン・シティ」という独自の成長ストーリーを持ちます。世界最大の自動車生産・販売規模・圧倒的な財務基盤・グループ企業群の総合力が長期的な競争力を支えます。

H2: トヨタの生産方式（TPS）と品質管理

トヨタ生産方式（TPS：Toyota Production System）は「ジャスト・イン・タイム（必要なものを必要な時に必要な量だけ）」と「自働化（問題が発生したら自動的に停止する仕組み）」を二本柱とする世界標準の生産管理システムです。TPSは製造業の「カイゼン（改善）」という概念を世界に広め、GE・ボーイング・トヨタのサプライヤー群など世界の製造業に導入されています。

この生産方式による徹底した品質管理・コスト削減・納期順守が、トヨタが世界販売台数首位を維持し続ける基盤の一つです。EV・全固体電池という新技術分野でも、TPSのノウハウを応用した効率的な製造ラインの構築が競争力の源泉となります。

H2: 北米市場の重要性とトヨタの戦略

トヨタにとって北米（特に米国）は最大の利益貢献市場です。ケンタッキー州・テキサス州・ミシシッピ州などに大型工場を持ち、カムリ・タコマ・ランドクルーザーなどの主要モデルを現地生産しています。米国でのハイブリッド車（カムリHV・RAV4HV等）の人気は非常に高く、テスラやBYDのEVと並んで「環境対応車」として高い評価を受けています。

トランプ政権（2025年〜）の自動車関税政策は、メキシコ・カナダから輸入される自動車に関税をかける動きがあり、トヨタのサプライチェーン（メキシコでの生産比率）に影響する可能性があります。ただしトヨタは米国内生産の拡大（テキサス工場の増強）で対応策を打ち出しており、関税リスクへの対応能力も示しています。

H2: 水素社会とトヨタのFCV戦略

トヨタは「マルチパスウェイ」戦略の一環として燃料電池車（FCV：Fuel Cell Vehicle）にも注力しています。「MIRAI（ミライ）」というFCVを市販しており、水素で発電した電気でモーターを動かすゼロエミッション車です。FCVは特に「長距離輸送（バス・トラック）」「水素が豊富な地域（欧州・アジア）」での普及が期待されており、トヨタは日本・欧州・中国でのFCVバス・大型トラックのプロジェクトに参画しています。

H2: CASE・ウーブン・シティと未来への投資

静岡県裾野市に建設中のウーブン・シティ（Woven City）は2025年に部分開所し、自動運転・スマートホーム・ロボット・AIなど未来技術の実証実験都市として機能しています。実際に社員・研究者が居住・勤務しながら技術の実証を行うというユニークな試みで、自動運転の安全性確認・配送ロボットの実用化・エネルギーマネジメントの最適化などが進められています。この投資は短期的な収益には貢献しませんが「未来のモビリティ社会の構築者」というポジションを確立するための長期的な価値投資です。

H2: まとめ（詳細版）

トヨタは「HVの世界的競争力」「全固体電池という次世代の切り札」「FCV・水素という長期オプション」「ウーブン・シティという未来社会の実証」という複数の成長軸を持ちます。EV一強の時代でもマルチパスウェイ戦略が再評価される中、日本株の中核銘柄として長期投資・テーマ投資双方の観点から重要な存在です。
`},{id:"sony-analysis",category:"個別銘柄",icon:"🎮",title:"ソニーグループ（6758）徹底解説：ゲーム・音楽・映画・センサーの総合エンタメ企業",date:"2026/04/05",themes:["ゲーム・エンタメ","AI半導体","フィジカルAI"],keywords:["ソニー","6758","PS5","クランチロール","CMOS","映画","音楽","株価"],summary:"ソニーグループはゲーム・音楽・映画・金融・半導体センサーという多様な事業を持つ複合企業。各事業の詳細と投資ポイント、ソニーらしい「安定×成長」の魅力を解説します。",body:`
H2: ソニーグループとはどんな会社か

ソニーグループ（証券コード：6758）は「PlayStation」「クランチロール（アニメ配信）」「Sony Music」「コロンビア映画」「CMOSイメージセンサー」という一見異なる事業群を持つ総合エンタメ・テクノロジー企業です。かつての家電メーカーというイメージは薄れ、現在はエンタメ・コンテンツ・センサー技術が三本柱の高収益企業に変貌しています。

H2: ゲーム・ネットワークサービス事業

ソニーの最大の収益事業がPlayStation 5（PS5）を中心としたゲーム・ネットワークサービス部門です。PS5の累計販売台数は5,000万台超（2024年時点）に達し、月額課金の「PlayStation Plus（PS+）」は会員数4,000万超という安定した経常収益をもたらしています。

バンジー（Bungie）・ハーモン・Haven Studiosなどのゲームスタジオを積極買収し、サードパーティゲームへの依存を減らしながら自社開発タイトルの充実を図っています。また「PlayStation PC」として一部タイトルをPC向けにも展開し、PlayStation以外のプラットフォームでの収益機会を拡大しています。

H2: 音楽事業：世界2位の音楽会社

Sony Music Entertainmentはユニバーサルミュージックに次ぐ世界第2位の音楽会社です。ビヨンセ・アデル・ハリー・スタイルズ・BTSなどのグローバルアーティストと契約しており、音楽ストリーミング（Spotifyへの楽曲供給）からライブイベントまで幅広く収益化しています。音楽はストリーミングの普及で市場が再成長しており、Sony Musicは安定した高収益を生み出しています。

H2: 映画・アニメ事業：クランチロールの急成長

ソニー・ピクチャーズ（コロンビア映画等）に加え、2021年に買収したクランチロール（世界最大のアニメ配信プラットフォーム）が急成長しています。クランチロールは登録会員数1億人超を誇り、日本アニメを世界に届ける「グローバルアニメゲートウェイ」として機能しています。

日本アニメの世界的な人気の高まりを背景に、クランチロールのサブスクリプション収益は急増しており、ソニーのコンテンツ事業の成長を牽引しています。

H2: CMOSイメージセンサー：スマホカメラに不可欠な技術

ソニーのイメージセンサー・ソリューション部門は、スマートフォンのカメラに使われるCMOSイメージセンサーで世界シェア約50%を誇ります。iPhone（アップル）・ファーウェイ・サムスンなどの主要スマホメーカーの大半がソニーのセンサーを使用しており、「見えないソニー」として莫大な収益を生み出しています。

AIカメラ・自動運転車のカメラ・医療内視鏡など、センサーの応用範囲は拡大しており、フィジカルAI時代の基幹部品としての需要も期待されています。

H2: 金融事業の分離上場

ソニーグループはソニー生命・ソニー銀行・ソニー損保などを傘下に持つ「ソニーフィナンシャルグループ（SFG）」を2025年に分離上場させました。金融事業の独立上場により、ソニーグループ本体のバリュエーションがエンタメ・テクノロジー企業として再評価されやすくなりました。

H2: 財務状況と株主還元

ソニーの財務基盤は堅固で、有利子負債よりも現金・有価証券が大幅に多い「ネットキャッシュ」の状態にあります。研究開発費（R&D）への投資を維持しながら増配・自社株買いを継続しており、成長投資と株主還元のバランスが取れています。

H2: StockWaveJP編集部の見解

ソニーグループはゲーム・エンタメテーマの最重要銘柄の一つですが、「ゲームだけの会社」ではなく音楽・映画・センサーが加わった複合企業です。そのため、テーマのモメンタムが「ゲーム・エンタメ」だけでなく「AI・クラウド（センサー需要）」「インバウンド（コンテンツ需要）」など複数のテーマと連動することがあります。

StockWaveJPでPS5の新作タイトル発売（特に年末商戦）のタイミングとゲーム・エンタメテーマの出来高変化を照合することで、ソニー株の短期的な動きを先読みするヒントが得られます。

H2: まとめ

ソニーグループは「ゲーム×音楽×映画×アニメ×センサー」という唯一無二のポートフォリオを持つ企業です。各事業がデジタル化・グローバル化の波に乗って成長しており、日本のエンタメ産業のグローバル競争力を体現しています。長期的な視点で保有に値する優良企業として評価されます。
    `},{id:"mitsubishi-ufj-analysis",category:"個別銘柄",icon:"🏦",title:"三菱UFJフィナンシャル・グループ（8306）徹底解説：金利上昇時代の最注目メガバンク",date:"2026/04/05",themes:["銀行・金融","フィンテック"],keywords:["三菱UFJ","MUFG","8306","メガバンク","配当","金利","利上げ","自社株買い"],summary:"日本最大のメガバンク・三菱UFJフィナンシャル・グループを徹底解説。日銀の金利正常化で恩恵を受ける仕組み・海外事業の現状・積極的な株主還元の詳細まで、投資家向けに解説します。",body:`
H2: 三菱UFJフィナンシャル・グループとは

三菱UFJフィナンシャル・グループ（MUFG、証券コード：8306）は三菱UFJ銀行・三菱UFJ信託銀行・三菱UFJ証券HD・アコム（消費者金融）などを傘下に持つ日本最大の金融グループです。総資産は約400兆円と世界でも有数の規模を誇り、「日本の銀行の代名詞」的な存在です。

バフェットが2023年に「MUFGに投資したい」と発言したことや、外国人機関投資家からの「割安・高配当・利上げ恩恵」という評価が重なり、2024〜2026年にかけて株価が大幅に上昇しました。

H2: 日銀利上げによる収益改善の仕組み

メガバンクにとって「金利が上がる」ことがなぜ良いのかを理解することが、MUFG投資の核心です。

銀行は預金を集め（短期の低金利で調達）、その資金を貸出（長期の高金利で運用）することで利益を得ます。この「調達金利と運用金利の差（NIM：純金利マージン）」が銀行の基本的な収益源です。マイナス金利時代はこの差が極限まで縮まっていましたが、金利正常化によってNIMが回復します。

MUFGの場合、政策金利が0.1%上昇するだけで年間約600〜700億円の業績改善効果があるとされています。

H2: 政策保有株の売却と資本効率改善

MUFGは事業会社との長年の「持ち合い株（政策保有株）」を大規模に売却するプログラムを進めています。持ち合い株の売却で得た資金は自社株買い・増配・成長投資に振り向けられ、ROE（自己資本利益率）の向上につながります。

2023〜2025年にかけてMUFGが実施した自社株買いは合計1兆円超に達しており、日本株市場でも最大規模の株主還元の一つです。

H2: 海外事業：アジアを中心としたグローバル展開

MUFGの重要な成長ドライバーが海外事業です。タイのバンク・オブ・アユタヤ（クルンシィ）に76%出資し東南アジア最大級の銀行グループを形成。フィリピン・インドネシア・インドなど高成長新興国での法人・リテール金融サービスが拡大しています。

海外利益比率は2024年度に全体の40%超に達しており、国内の低成長を補いながらグローバルな成長を取り込む構造が確立されています。

H2: 配当と株主還元の現状

MUFGの配当は近年大幅な増配が続いており、配当利回りは3〜4%台で推移しています。自社株買いを含めた総還元性向は50%超を目標としており、インカムゲイン（配当収入）を重視する投資家にとって魅力的です。NISAの成長投資枠での長期保有候補としても人気があります。

H2: リスク要因

景気後退期における不良債権の増加が最大のリスクです。特にコロナ禍のゼロゼロ融資の返済が進む中、中小企業の業績悪化による貸倒れ増加が業績に影響する可能性があります。また海外事業での円高転換による収益の目減りも注意が必要です。

H2: StockWaveJP編集部の見解

MUFGはStockWaveJPで「銀行・金融テーマ」のモメンタムが「転換↑→加速」に転じるとき、最初に出来高が急増する銘柄の一つです。機関投資家・外国人投資家がこのテーマへの資金配分を増やす際に「流動性が最も高い大型株」として最初に買われる傾向があります。

日銀政策決定会合の前後1〜2週間はMUFGの出来高変化を特に注意深く観察することを推奨します。出来高増加を伴いながら株価が上昇し始めるタイミングが「機関投資家が動き始めたシグナル」として有効に機能することを繰り返し観察しています。

H2: まとめ

三菱UFJフィナンシャル・グループは「金利正常化の恩恵」「積極的な株主還元」「アジア成長の取り込み」という三つの価値創造要素を持つ日本株の代表的な高配当バリュー株です。NISAでの長期保有と短期のモメンタム投資の双方で活用できる銘柄として、多くの個人投資家の注目を集めています。
    `},{id:"nintendo-analysis",category:"個別銘柄",icon:"🎮",title:"任天堂（7974）徹底解説：Nintendo Switch 2とIP戦略が拓く次の成長ステージ",date:"2026/04/11",themes:["ゲーム・エンタメ"],keywords:["任天堂","7974","Nintendo Switch 2","マリオ","ポケモン","IP","配当","株価"],summary:"日本が世界に誇るゲーム・エンタメ企業・任天堂を徹底解説。Nintendo Switch 2の発売、マリオ映画に代表されるIPのマルチメディア展開、盤石の財務基盤と株主還元まで、投資家視点で詳しく解説します。",body:`
H2: 任天堂とはどんな会社か

任天堂（証券コード：7974）は1889年に花札・トランプの製造会社として創業し、1977年にゲーム機事業に参入、現在は世界三大ゲームプラットフォームの一角「Nintendo Switch」を擁する日本最大のゲーム・エンタメ企業です。売上高は2024年度で約1.7兆円、営業利益率は35〜40%という驚異的な高収益体質を誇ります。時価総額は最大時に15兆円を超え、日本の製造業・エンタメ企業の最上位に位置します。連結従業員数は約7,000人というコンパクトな規模でこれだけの収益を生み出す「超高効率企業」としても知られています。

任天堂の最大の特徴は「ハードウェア（ゲーム機）とソフトウェア（ゲームタイトル）の両方を自社で開発・販売する垂直統合モデル」にあります。これにより自社プラットフォーム上で最高の品質・体験を実現しながら、サードパーティゲームのロイヤリティ収入も得るという二重の収益構造を持ちます。また「ゲーム機を売ってソフトを売る」というビジネスの基本サイクルが非常に強固で、一度ファンになった顧客が新しいハードとソフトをセットで購入し続けるという強力なリテンション（顧客維持）が実現しています。

H2: Nintendo Switchシリーズの歴史的成功

初代Nintendo Switchは2017年3月の発売以来、2025年末までに累計1億4,500万台超という歴史的な販売台数を記録しました。「据え置き型（テレビに接続）と携帯型（持ち歩き）を一台で兼ねる」というハイブリッドコンセプトは、競合他社が容易に模倣できない独創的な設計です。ソファでのリビングプレイ・電車の中での携帯プレイ・友人とのテーブルプレイという複数のシーンに対応し、年齢・性別・プレイスタイルを問わない幅広いユーザー層を獲得しました。

特に「あつまれ どうぶつの森（あつ森）」は2020年3月のコロナ禍の中で発売され、自宅で楽しめるゲームとして世界中でブームを巻き起こし、4,500万本超を販売。「マリオカート8デラックス」は発売から7年以上が経過した現在も世界で最も売れているSwitchソフトとして6,000万本超を記録しています。「ゼルダの伝説 ティアーズ オブ ザ キングダム（2023年）」は発売3日で1,000万本という驚異的なスピードで、ゲーム史上に残る大ヒットとなりました。

H2: Nintendo Switch 2の登場と次世代への移行

2025年、Nintendo Switch 2が発売されました。前世代のユーザーベース1億4,500万台という巨大な基盤を引き継ぎながら、より高性能なグラフィック（4K対応）・改良されたJoy-Con（コントローラー）・マウスライクな新機能・大容量ゲームカードへの対応などを搭載した次世代機です。Switch 2は初代Switchのゲームとの後方互換性も持ち、既存ユーザーが移行しやすい設計になっています。

任天堂特有の「ハードのサイクル」について理解することが投資において重要です。新ハード発売後の2〜3年は「ハネムーン期」と呼ばれ、キラータイトルが続々リリースされてハード・ソフト販売が相乗的に伸びます。任天堂の過去の業績パターンを見ると、新ハード発売から2〜3年間は売上・利益ともに急成長する傾向があります。Switch 2の2025〜2027年という時期はまさにこの「ハネムーン期」にあたります。

H2: IPビジネスの圧倒的な強さ

任天堂の株価を長期的に押し上げているのが「IPのマルチメディア展開」です。スーパーマリオ・ゼルダ・ポケモン・ドンキーコング・ピクミン・メトロイド・カービィ・スプラトゥーンなど、数十年にわたって愛され続けるIPを多数保有しています。

「スーパーマリオ ブラザーズ ムービー（2023年）」は全世界興行収入13億ドル超というビデオゲーム原作映画史上最高水準の大ヒットとなり、映画ビジネスの収益だけでなく「マリオというIPへの世界的な認知度・親しみ」をさらに高めました。映画公開後にマリオ関連のゲーム販売も伸びるという相乗効果が確認されています。2026年には「ゼルダの伝説」の実写映画プロジェクトが進行中です。

ユニバーサル・スタジオ・ジャパン（USJ）の「スーパー・ニンテンドー・ワールド」は世界的な人気テーマパークエリアとなり、年間数百万人が訪れています。米国オーランドのユニバーサル・スタジオにも同エリアが展開され、海外展開が進んでいます。ポケモンカードゲームの世界的ブームは2024〜2026年も継続しており、カードの希少性・コレクション価値から二次市場での取引も活発です。

H2: 財務の卓越した強さ

任天堂の財務基盤は世界のゲーム企業の中でも際立って健全です。有利子負債がほぼゼロで、現金・有価証券などの手元流動性は1.5兆〜2兆円規模に達します。この巨大な「現金の山」は業界環境が悪化した際のバッファーであり、大型M&A・新規事業投資・積極的な株主還元の原資でもあります。

Wii U（2012〜2017年）という失敗した前世代ハードの時期でさえ、任天堂はその豊富な内部留保を取り崩しながら黒字を維持し続けました。この財務的な頑健性が「不況に強い安定株」としての評価にもつながっています。

ROE（自己資本利益率）は好調期に25〜30%という製造業としては非常に高水準を記録しており、バフェットが重視する「長期的な競争優位性と高ROE」の条件を満たす企業の一つです。

H2: 株主還元の方針

任天堂は「業績連動型配当」を採用しており、業績が好調な年には大幅な増配・特別配当が実施されることがあります。2021年度の特別配当（1株1,000円）は市場に大きなサプライズをもたらしました。配当利回りは通常1〜3%程度ですが、手元現金の豊富さから「いつでも大規模な追加還元ができる」という潜在的な株主還元力が長期投資家には重要です。

自社株買いも節目節目で実施されており、株主にとって複数の形での還元が期待できます。発行済み株式数が少なく（約1億3,000万株程度）、一株あたりの価値が相対的に大きいことも特徴です。

H2: リスク要因の詳細分析

任天堂固有のリスクとして最大のものは「新ハードの商業的失敗リスク」です。過去には「Wii U（2012年）」が約1,350万台という商業的に失敗したハードがあり、失敗期には業績・株価ともに大きく落ち込みました。Switch 2についても「前世代の成功が続くとは限らない」というリスクは常に存在します。

為替リスクも大きく、海外売上が全体の80%超を占めるため、円高進行は業績の逆風となります。ドル円が1円円高になると任天堂の営業利益が数十億円悪化するとされています。

競合環境の変化も注目点です。PlayStation（ソニー）・Xbox（マイクロソフト）というコンソールゲームの競合に加え、スマートフォンゲーム・PC向けゲームという代替プラットフォームとの競争も続きます。ただし任天堂は「ゲーム機の性能競争」ではなく「遊びの革新性競争」という独自の土俵で戦うことで、競合との正面衝突を回避し続けています。

H2: 関連銘柄・海外競合の詳細

国内の直接的な関連銘柄として、任天堂のゲーム開発を委託するゲームフリーク（非上場・ポケモン開発）・ハル研究所（非上場・カービィ開発）・モノリスソフト（任天堂子会社・ゼノブレイド）などの開発会社があります。流通面では、ゲームソフトの販売代理店を担うマーベラス（7844）・コーエーテクモ（3635）などがSwitchプラットフォームで重要な役割を果たしています。

日本の部品サプライヤーとしては液晶パネル（Sharp）・バッテリー（村田製作所等）・半導体（エヌビディアのカスタムSoC採用）などがあります。特にSwitch 2のSoC（System on Chip）にはエヌビディアのカスタム設計が採用されており、エヌビディアとの関係が深いです。

海外競合はソニーグループ（6758）のPlayStation 5・マイクロソフト（MSFT）のXbox Series X/Sが主要コンソール競合です。スマートフォンゲームではApple（AAPL）のApp Store・Google（GOOGL）のPlay Storeというプラットフォーマーとも間接的な関係があります。ゲームエンジン分野ではエピックゲームズ（非上場・Unreal Engine）・Unity（U、NYSE）が業界インフラを提供しています。

H2: StockWaveJP編集部の見解

任天堂株はゲーム・エンタメテーマのモメンタムに強く連動し、「Nintendo Direct（任天堂の独自メディア発表会）」での新作タイトル発表後に出来高が急増するパターンが規則的に現れます。特にサプライズの大型タイトル発表（新ゼルダ・マリオ・新規IP等）があると、当日〜翌日にかけて株価が3〜7%急騰することがあります。

任天堂の四半期決算（5月・8月・11月・2月）ではSwitch/Switch 2の累計・四半期販売台数・ソフト販売本数ランキングが開示されます。販売数が市場予想を上回るたびにテーマ全体への資金流入が確認されており、決算発表スケジュールをStockWaveJPのモメンタム確認と組み合わせることが投資タイミング管理に有効です。

Switch 2の発売サイクルでは2025〜2027年が「ハネムーン期」として最もキラータイトルが集中する時期であり、この期間はゲーム・エンタメテーマへの強気スタンスが正当化されます。テーマヒートマップでゲーム・エンタメテーマが「全期間で緑」を維持しているかを定期確認してください。

H2: まとめと今後の展望

任天堂はIP価値・ハードウェアとソフトウェアの垂直統合・圧倒的な財務基盤という「三重の競争優位性」を持つ日本株屈指の優良企業です。Nintendo Switch 2の成功サイクル・スーパーマリオ映画第二弾への期待・ゼルダ実写映画・ユニバーサルスタジオでのテーマパーク展開加速という複数のカタリストが重なる2026〜2028年は、任天堂株にとって中長期的に最も追い風が強い時期と評価しています。「ゲームで遊ぶ楽しさ」を世界中で提供し続ける限り、任天堂の企業価値は長期的に向上し続けると考えます。

H2: 任天堂のゲームデザイン哲学

任天堂のゲーム開発の根幹にある哲学は「驚きと発見（Surprise and Discovery）」です。宮本茂プロデューサーが長年にわたって体現してきたこの哲学は「技術の最先端を追うのではなく、プレイヤーが思わず笑顔になるような新しい遊びを発明すること」です。PS5・Xboxが性能（グラフィック・処理速度）の競争に注力する一方、任天堂はモーションコントロール（Wii）・タッチスクリーン（DS）・ハイブリッド形態（Switch）・Joy-Conの多様な使い方（Switch 2）という「遊びの発明」で差別化してきました。

この哲学はマーケティング的な言葉ではなく、実際に大型タイトルの開発現場での意思決定基準として機能しています。「技術的に可能だから作る」のではなく「それで遊ぶのが楽しいから作る」という基準で開発されたゲームが世界中のユーザーの心をつかんでいます。

H2: 著作権保護とブランド管理の徹底

任天堂はIPの保護に業界で最も厳格な姿勢を取ることで知られています。無許諾のゲーム改造（MOD）・ROM（ゲームデータ）の配布・非公式グッズの販売・YouTubeでの無許可動画投稿に対して積極的に法的措置を取ります。一見ユーザーフレンドリーではないように見えるこの姿勢は「ブランドの希少性・品質管理の徹底・IP価値の長期的な維持」という観点から理解できます。任天堂が承認したライセンス商品・コラボレーション（USJのコラボ・マクドナルドのハッピーセット等）は品質管理が厳格で、「任天堂ブランドへの信頼」を世界で維持し続けています。

H2: ポケモンという特別な存在

ポケモンは任天堂が直接保有するIPではなく、株式会社ポケモン（任天堂・クリーチャーズ・ゲームフリークが共同所有）が管理するIPですが、任天堂の持分法適用関連会社として収益に貢献しています。ポケモンカードゲームの世界的ブームは2020年以降続いており、レアカードが数百万〜数千万円で取引される投資・コレクションの対象となっています。ポケモンは単なるゲームIPを超えて「文化的現象」となっており、その経済的規模はGDPに匹敵するという試算もあるほどです。

H2: 関連銘柄の詳細

任天堂に関連する国内銘柄として、Switch 2のSoCにエヌビディア（NVDA）のカスタムチップが採用されている点でエヌビディアとの接点があります。液晶ディスプレイはJDI（ジャパンディスプレイ）・シャープが部品供給に関与しています。ゲームソフトの主要サードパーティとして、スクウェア・エニックス（9684）・カプコン（9697）・バンダイナムコ（7832）・コーエーテクモ（3635）がSwitchプラットフォームに重要なタイトルを供給しており、Switch 2の普及はこれらのソフト会社にとっても追い風です。

H2: 株価水準と長期投資の考え方

任天堂のPERは業績サイクルによって大きく変動します。Switch 2の「ハネムーン期（2025〜2027年）」は業績が急拡大するため見かけのPERが低下し、割安感が出やすい時期です。逆に次のハードサイクルの谷（2029〜2031年頃）には業績が落ち込みPERが高くなりますが、その局面が長期投資の仕込み場になる場合があります。「ハードサイクルを理解した上で、底値圏で積み上げ・好調期に保有を継続する」という戦略が任天堂株への長期投資の基本です。
`},{id:"fujikura-analysis",category:"個別銘柄",icon:"🔌",title:"フジクラ（5803）徹底解説：光ファイバー・AI電力ケーブルで急成長する素材企業",date:"2026/04/11",themes:["光通信","IOWN","AIデータセンター"],keywords:["フジクラ","5803","光ファイバー","電力ケーブル","データセンター","AI","海底ケーブル"],summary:"フジクラは光ファイバー・電力ケーブル・自動車用ワイヤーハーネスを手掛ける総合ケーブルメーカー。AI・データセンター需要の急増で光ファイバーと電力ケーブルの両輪が急成長。株価は2024年に年初比3倍超を記録した注目銘柄を徹底解説します。",body:`
H2: フジクラとはどんな会社か

フジクラ（証券コード：5803）は1885年創業の老舗ケーブルメーカーで、光ファイバーケーブル・電力ケーブル・自動車用ワイヤーハーネス・FPC（フレキシブルプリント回路基板）の4事業を柱とする総合電線メーカーです。売上高は約8,000億円（2024年度）、東京都江東区に本社を置きます。競合の住友電気工業・古河電気工業とともに「電線御三家」を形成し、日本の電線産業を牽引しています。

2024年に起きたフジクラ最大のニュースが株価の驚異的な急騰です。年初比で株価が3倍超という異例のパフォーマンスを記録し、東証プライム市場でも最も注目を集めた銘柄の一つとなりました。その背景にあるのが「AI・データセンター需要の爆発的増加」という構造的かつ強力なテーマです。

H2: 光ファイバー事業：AIインフラの恩恵を最も直接的に受ける事業

フジクラの光ファイバー・光ケーブル事業はAI・クラウドコンピューティングの急拡大による史上空前の需要ブームを享受しています。データセンター内のサーバーラック間・データセンター同士を結ぶ光ファイバーケーブルは、AIの演算を支えるネットワーク基盤そのものです。エヌビディアのGPUクラスターが増えるほど、それらを繋ぐ光ファイバーの需要も比例して増加します。

具体的な製品として光ファイバー（光を導波する細いガラス繊維）・光ケーブル（光ファイバーを複数本束ねて保護外装を施したケーブル）・光コネクター（光ファイバーを接続する精密部品）・光スプリッター（光信号を分岐させる部品）などを製造しています。データセンターの通信速度が400G・800Gbps・1.6Tbpsと高速化するほど、高品質な光接続部品への需要が増し、フジクラの製品の付加価値も上昇します。

フジクラは北米・欧州・アジアに製造・販売拠点を持ち、Google・Amazon・Microsoft・Metaなどのハイパースケーラーがデータセンターを拡張するたびに受注が積み上がっています。2024〜2025年の受注は過去最高を更新し続けており、生産能力の拡大（新工場・増産ライン設置）が追いつかないほどの需要過剰状態が続いています。

H2: 電力ケーブル事業：洋上風力・再生可能エネルギーの主力サプライヤー

電力ケーブル事業はフジクラの第二の成長エンジンです。高圧・超高圧電力ケーブル・海底電力ケーブルなどを製造しており、特に洋上風力発電所から陸上の電力系統に送電するための海底電力ケーブルの大型受注が相次いでいます。

日本政府が2040年までに洋上風力4,500万kWの導入を目標とするほか、欧州では2030年に300GW超という野心的な洋上風力目標があります。洋上風力発電所の建設には発電した電力を陸上に送る海底ケーブルが不可欠であり、その長さは一プロジェクトで数十km〜数百kmに及びます。フジクラはこの大型需要に対応する製造能力と技術力を持ち、欧州・アジア・国内の洋上風力プロジェクトへの供給を積み上げています。

国内でも国土強靭化・老朽インフラ更新に伴う送電線の更新需要・再生可能エネルギーの系統接続工事という電力インフラ需要が安定的に続いています。

H2: ワイヤーハーネス事業：EV時代に向けた進化

自動車用ワイヤーハーネス（車内の電気配線システム）は日本・メキシコ・フィリピン・中国・ベトナムなどに製造拠点を持ち、国内外の主要自動車メーカーへ安定供給しています。EV（電気自動車）はガソリン車より多くの電子部品を持ち・モーター・バッテリー・充電系統のための高電圧（400V・800V）ハーネスが必要なため、EV普及に伴い一台あたりのハーネス単価・重量ともに上昇しています。

またADAS（先進運転支援システム）・自動運転の普及で自動車のセンサー・制御系の電装化が進み、ハーネスの複雑化・高機能化が進んでいます。これがワイヤーハーネス事業の付加価値向上につながっています。

H2: FPC（フレキシブルプリント基板）事業

FPCはスマートフォン・折りたたみスマートフォン・ウェアラブル機器・カメラモジュールなどのコンパクトな電子機器に使われる薄くて曲げられる電子回路基板です。タイ・中国・ベトナムの工場で製造しており、日本の大手電機メーカーへ供給しています。折りたたみスマートフォンの普及・カメラの多眼化・ヘッドセット（XR機器）の普及がFPC需要を支えています。

H2: 2024年株価急騰の背景と要因分析

フジクラ株が2024年に年初比3倍超という異例の上昇を記録した理由は複合的です。第一に光ファイバー部門の四半期ごとの決算が市場予想を大幅に上回るサプライズ好決算を連発したことです。第二にAI・データセンターテーマへの世界的な投資資金の流入が光通信関連株全体を強く押し上げました。第三に洋上風力向け海底電力ケーブルの大型受注が相次ぎ、電力ケーブル部門の将来収益への期待が急上昇しました。第四に外国人機関投資家の買いが集中したことで需給が極度に引き締まり、上昇が加速するという「モメンタムの自己強化」が起きました。

このような一年で株価が3倍になる銘柄は、後から振り返ると「なぜあの時買えなかったのか」と悔やまれますが、StockWaveJPで光通信テーマの出来高急増・モメンタム「加速」を確認していれば、早期にエントリーできた可能性があります。

H2: 中期経営計画と生産能力増強

フジクラは光ファイバー・電力ケーブルの生産能力増強に向けた大型投資を実施中です。国内外の工場増設・製造ラインの拡張に数百億円規模の設備投資を行っており、旺盛な需要に対応する供給能力の強化を急いでいます。この設備投資のピーク期（2024〜2026年）を過ぎると投資回収フェーズに入り、フリーキャッシュフローの改善と利益率向上が見込まれます。

H2: リスク要因

株価が急騰した後のバリュエーション（PER・PBR）は過去に比べて大幅に高くなっており、業績成長が続かなければ調整リスクがあります。光ファイバー分野での中国メーカー（長飛光纖光纜・中天科技等）の低価格攻勢が汎用品での価格競争を激化させるリスクもあります。またデータセンター投資がハイパースケーラーの戦略転換によって減速した場合、受注が急減するリスクも無視できません。電力ケーブル分野では建設コスト上昇・人手不足による工期遅延が採算を悪化させる可能性があります。

H2: 競合・関連銘柄・海外

国内競合は住友電気工業（5802）・古河電気工業（5801）・タツタ電線（5809）です。光ファイバー世界大手は米コーニング（GLW）・伊プリズミアン（PRY）・仏넥ス（Nexans）です。海底電力ケーブルでは韓国LS Cable・プリズミアン・넥ス（Nexans）が世界大手で、日本の洋上風力プロジェクトへの参入も進んでいます。ワイヤーハーネス分野ではドイツのLeoni・矢崎総業（非上場）・住友電工・古河電工が世界的な競合です。

H2: StockWaveJP編集部の見解

フジクラは光通信テーマと再生可能エネルギーテーマの双方に連動する「クロステーマ銘柄」として継続観察しています。この二つのテーマが同時に「加速」モメンタムとなっているときはフジクラへの複合的な追い風となり、最も株価が上昇しやすい局面です。

エヌビディアの決算発表・ハイパースケーラーの設備投資計画発表・洋上風力の入札結果という三つのカタリストのカレンダーを把握した上でStockWaveJPのモメンタム変化を確認することが有効です。また「電線御三家の中でフジクラが最初に出来高急増→次に古河電工・住友電工にローテーション」というパターンも観察されており、フジクラの動きが他の電線株への先行指標として機能することもあります。

H2: まとめと今後の展望

フジクラはAI・データセンターと再生可能エネルギーという「現代の二大成長インフラ」の双方に不可欠な製品を供給する稀少な企業です。光ファイバーと電力ケーブルという二つの成長エンジンが同時稼働するという構造は中長期にわたって維持される見通しであり、設備投資の回収が本格化する2027〜2028年以降はフリーキャッシュフローの改善・株主還元強化という新たなポジティブ要因も期待されます。

H2: 光ファイバーの製造技術と参入障壁

光ファイバーの製造は「OVD（外付け気相堆積）法」「VAD（気相軸付け）法」などの特殊な製造プロセスが必要で、光ファイバーの原材料であるガラス母材（プリフォーム）を高温で溶融・延伸するという高度な精密製造技術が必要です。この製造技術の習得には長年の経験が不可欠であり、新規参入者が容易に品質・コストで既存大手に追いつけない構造的な参入障壁があります。

フジクラは日本国内だけでなく、米国（フジクラ・アメリカ）・英国・タイ・インドネシア・南アフリカに製造・販売拠点を持ち、グローバルな顧客への安定供給体制を構築しています。

H2: FPC事業とスマートフォン市場の関係

フジクラのFPC（フレキシブルプリント回路基板）事業はタイ・中国・ベトナムに製造拠点を持ち、日本・韓国・台湾の主要電子機器メーカーに供給しています。折りたたみスマートフォンの普及がFPCの高付加価値化（折り曲げ耐久性が高い特殊FPC）をもたらしており、折りたたみ対応スマホがSamsungのGalaxy Z・Huaweiのmate X・Motorola等で販売されるにつれて、フジクラのFPC事業の単価が向上しています。

H2: 競合との比較と差別化ポイント

住友電工・古河電工との電線御三家比較では、フジクラが最もAI・データセンター関連の収益比率が高く、株価の上昇率もフジクラが最大でした。住友電工はより大きな企業規模（売上4兆円超）で安定性が高い代わり成長率はやや低め。古河電工は最も割安なバリュエーションで「フジクラの割安版」という見方もあります。三社の中でどれを選ぶかは「成長性重視ならフジクラ・安定性重視なら住友電工・割安重視なら古河電工」という判断軸が参考になります。

H2: まとめ（詳細版）

フジクラの投資ストーリーは「AI・データセンター→光ファイバー需要急増」「再生可能エネルギー→洋上風力海底ケーブル需要増」という二つの明確な因果関係に支えられています。これらのメガトレンドが2030年代まで継続する以上、フジクラへの構造的な需要拡大も続きます。株価急騰後のバリュエーションには注意が必要ですが、業績成長が続く限り長期保有の正当性は維持されます。
`},{id:"softbank-analysis",category:"個別銘柄",icon:"📱",title:"ソフトバンク（9434）徹底解説：通信×PayPay×AI投資の総合デジタル企業",date:"2026/04/11",themes:["通信","生成AI","フィンテック"],keywords:["ソフトバンク","9434","PayPay","通信","5G","LINE","配当","AI"],summary:"ソフトバンク（9434）は国内第3位の通信キャリアとしての安定収益に加え、PayPay・LINE・LINEヤフーというデジタルプラットフォームを傘下に持つ総合デジタル企業。高配当・AI投資・5G展開を軸とした投資ポイントを徹底解説します。",body:`
H2: ソフトバンク（9434）とはどんな会社か

ソフトバンク（証券コード：9434）はソフトバンクグループ（9984）の通信子会社として2018年に東証上場を果たした総合デジタル企業です。携帯電話事業（SoftBank・Y!mobile・LINEMO）を中核に、PayPay・LINEヤフー・法人向けDXサービス・AIビジネスまで幅広い事業を展開しています。売上高は約6兆円（2024年度）、連結従業員数は約1万8,000人です。

ソフトバンクグループ（9984）と混同されやすいですが、（9434）は国内通信事業中心の「運用会社」であり、（9984）はARM・ビジョンファンド・スタートアップ投資を行う「投資持株会社」です。投資目的に応じた適切な銘柄選択が重要です。

H2: 国内通信事業：三層構造の顧客獲得戦略

ソフトバンクの通信事業は国内第3位のキャリアとして約2,900万回線のスマートフォン契約を持ちます。競争戦略は「SoftBankブランド（プレミアム価格帯・高機能サービス）」「Y!mobileブランド（中価格帯・シンプルプラン）」「LINEMOブランド（低価格・スマホのみ）」という三層構造で、異なる価格感度・ニーズを持つ顧客層を幅広くカバーしています。

2021年の菅政権以降の「携帯料金引き下げ政策」によって低価格プランへの移行・ARPU（1契約あたり月額収入）の一時的な低下という逆風を受けましたが、現在は端末割賦・オプションサービス・PayPayとの連携で収益が回復しています。光回線（SoftBank光・Yahoo! BB）・固定電話・企業向け通信サービスも安定した収益源です。

H2: PayPayエコシステム：日本最大のデジタル決済プラットフォーム

ソフトバンクが最も注力する成長事業がPayPayを中心としたフィンテックエコシステムです。PayPayは2018年のサービス開始から驚異的なスピードで普及し、2024年末時点で登録ユーザー数6,500万人超・年間取扱高10兆円超・加盟店400万カ所超という日本最大のQRコード決済サービスに成長しました。コンビニ・スーパー・ドラッグストア・飲食店から個人間送金まで日常的な決済インフラとして定着しています。

PayPayの収益モデルは加盟店から徴収する決済手数料（取扱高の1.6〜1.98%）・PayPay銀行の預金利息・PayPay証券の取引手数料・PayPay後払い（BNPL：Buy Now Pay Later）の与信手数料・PayPayポイントを活用したマーケティング収益などから構成されます。ユーザー数・取扱高の拡大に伴い収益が積み上がる「プラットフォームビジネス」の特性を持ちます。

PayPayカード（クレジットカード）・PayPay銀行（スマートフォン専業銀行）・PayPay証券（スマートフォン証券）・PayPay保険（保険サービス）という金融サービス群が連携した「PayPayフィナンシャルスフィア（PayPay金融圏）」を形成しており、一人のユーザーが複数サービスを利用するクロスセル戦略でLTV（顧客生涯価値）を最大化しています。

H2: LINEヤフーとの関係と課題

ソフトバンクの重要な関連会社がLINEヤフー（4689）です。LINE（日本最大のメッセージアプリ・ユーザー数9,600万人超）・Yahoo! JAPAN（国内最大のポータルサイト・検索エンジン）・ZOZOTOWN（ファッションEC）・PayPayモール・一休.comなどを傘下に持つデジタルコングロマリットで、ソフトバンクと韓国ネイバーが共同で支配株主となっています。

2023年のLINEの個人情報流出問題（韓国ネイバーのシステム経由での流出）では総務省から行政指導を受け、ネイバーとの資本・技術関係の見直しが求められました。この問題はLINEヤフーの経営・ガバナンスに影響を与えており、ソフトバンクとネイバーの間の資本関係の調整交渉が進んでいます。日本の個人情報の安全な管理という観点から行政・世論の注目が続いています。

H2: 5G展開と法人向けDXビジネス

ソフトバンクは5Gのエリア展開を積極的に進めており、主要都市圏のカバレッジが90%超に達しています。5Gの活用として、工場・物流センターへの「プライベート5G（企業専用ネットワーク）」の導入支援が好調で、スマート工場・自動搬送ロボット・遠隔医療・スマート農業といったユースケースで実績を積み上げています。

法人向けのITサービスでは「クラウド・SaaS導入支援」「AI活用のDXコンサルティング」「セキュリティサービス」「データ分析・AI基盤構築」など企業のデジタル化を包括的に支援するビジネスが高成長を続けています。通信回線というインフラを持ちながらDXサービスを提供できる強みは、純粋なITベンダーとの差別化ポイントです。

H2: AIビジネスへの取り組み

孫正義氏が率いる親会社ソフトバンクグループは「AI革命」を最重要テーマとして大型投資を加速していますが、ソフトバンク（9434）自体もAI関連ビジネスに取り組んでいます。生成AIを活用した法人向けソリューション（カスタマーサポートAI・文書作成AI・データ分析AI）の提供・AIを使ったネットワーク最適化・AI活用の農業IoT（農業ソリューション「ソラコム」等）・AI採用支援（HR Tech）などが展開されています。

H2: 財務・配当・株主還元

ソフトバンク（9434）の特徴的な財務構造として「有利子負債が多い」という点があります。通信インフラ（基地局・光ファイバー網）の整備・PayPay関連投資などで多額の借入を行っており、金利上昇局面では借入コストの増加が業績を圧迫するリスクがあります。

一方で配当は「1株86円（2024年度）」という水準で、配当利回りは5〜6%前後という高水準を維持しています。高配当というインカム面での魅力から、NISAの成長投資枠での長期保有に人気があります。配当性向は80〜90%と高く、積極的な株主還元を優先する方針を採っています。

H2: 競合・関連銘柄・海外

国内の直接競合は通信事業でNTTドコモ（NTT・9432）・KDDI（9433）です。フィンテック分野ではマネーフォワード（3994）・freee（4053）・Zaif・LINE Payなどが競合・協力関係にあります。楽天グループ（4755）のPayPay対抗の楽天ペイ・三菱UFJフィナンシャルグループのデジタルウォレットも競合です。

ソフトバンクグループ（9984）が投資するARMホールディングス（NASDAQ：ARM）は半導体設計IPで世界首位で、スマートフォン・AIチップのほぼ全てにARM設計が使われています。ARMの業績はソフトバンク（9984）を通じてソフトバンク（9434）の評価に間接的に影響を与えます。海外の通信・フィンテック大手ではT-Mobile（TMUS）・Verizon（VZ）・AT&T（T）が通信競合、PayPal（PYPL）・Block（SQ）・Stripe（非上場）がフィンテック競合です。

H2: StockWaveJP編集部の見解

ソフトバンク（9434）はStockWaveJPで通信テーマとフィンテックテーマの双方に連動するクロステーマ銘柄として観察しています。日銀の追加利上げ観測が高まる局面では高配当の安定株として見直される傾向があり、逆に金利上昇が決まると有利子負債の多さからコスト増懸念で売られることもあります。

PayPayの月次データ（取扱高・ユーザー数）の開示タイミングでこの銘柄の出来高が変化することがあります。市場予想を上回るPayPay成長データが出た際の出来高急増が「機関投資家のフィンテック評価の高まり」を示すシグナルとして機能します。StockWaveJPのフィンテックテーマのモメンタムが「転換↑→加速」となる局面と照合することを推奨します。

H2: まとめと今後の展望

ソフトバンク（9434）は「高配当の通信株」という安定性と「PayPayを軸とするフィンテック成長株」という成長性を兼ね備えた希少な投資対象です。5Gインフラの整備完了後のコスト削減・PayPayエコシステムの収益化進展・法人DXビジネスの拡大という三つの成長要素が2026〜2030年にかけて収益を押し上げる見通しです。

H2: ソフトバンクと親会社（9984）との資本関係

ソフトバンクグループ（9984）はソフトバンク（9434）の株式約40%を保有する親会社です。ソフトバンクグループはARMホールディングスへの約90%出資・ビジョンファンド（スタートアップ投資ファンド）を持ちますが、通信事業は持っておらず、通信収益はソフトバンク（9434）から配当・持分法利益として得ています。

ソフトバンクグループの財務状況（特に有利子負債の多さ・ビジョンファンドの評価損益）がソフトバンク（9434）の独立した事業評価に影響することがあります。投資家はソフトバンク（9434）を「親会社リスクとは独立した通信・フィンテック銘柄」として評価することが適切です。

H2: PayPayの黒字化と成長フェーズの変化

PayPayは長年の先行投資（巨額のポイント還元・加盟店開拓コスト）を経て2024年度に単体での黒字化を達成しました。「赤字を垂れ流してシェアを取りに行く」フェーズから「収益を最大化するフェーズ」への移行は投資家にとって大きなポジティブシグナルです。黒字化後のPayPayは手数料率の段階的な引き上げ・高付加価値サービス（PayPay後払い・PayPay銀行のローン等）への誘導によって収益性が改善するというシナリオが描かれています。

H2: Starlinkとの競合関係

SpaceXのStarlink（低軌道衛星を使った超高速インターネット）がソフトバンクとSoftBank Corpを通じて日本での販売を開始しています。離島・山間部・船舶などの地上通信インフラが届かない場所でのブロードバンド提供がStarlinkの強みで、ソフトバンクのパートナーとして一部地域での補完的な通信サービスとして提供されています。SpaceXとソフトバンクは競合ではなく協力関係にあるという理解が適切です。

H2: まとめ（詳細版）

ソフトバンク（9434）は「高配当（利回り5〜6%）による安定インカム」「PayPayの収益化による成長」「5G法人DX事業の拡大」という三つの価値軸を持ちます。NISAの成長投資枠での長期保有・短期のモメンタム投資双方に活用できる流動性の高い銘柄であり、通信テーマ・フィンテックテーマの双方でStockWaveJPのモメンタム確認と組み合わせた投資管理を推奨します。
`},{id:"mitsui-mining-analysis",category:"個別銘柄",icon:"⚗️",title:"三井金属（5706）徹底解説：銅箔・車載材料・亜鉛精錬で世界に存在感を示す非鉄金属企業",date:"2026/04/11",themes:["EV・電気自動車","レアアース・資源","鉄鋼・素材"],keywords:["三井金属","5706","銅箔","亜鉛","車載部品","電池材料","EV","非鉄金属"],summary:"三井金属鉱業（5706）は亜鉛精錬・銅箔・電子材料・自動車部品材料を手掛ける非鉄金属大手。電気自動車向け電池用銅箔・プリント基板用銅箔で世界トップクラスのシェアを持ち、EV普及の直接的な恩恵を受ける銘柄を徹底解説します。",body:`
H2: 三井金属とはどんな会社か

三井金属鉱業（証券コード：5706、通称「三井金属」）は三井グループの非鉄金属メーカーで、亜鉛精錬・銅箔・電子材料・自動車部品材料を主力事業とする中堅素材企業です。売上高は約6,000億円（2024年度）、東京都品川区に本社を置きます。設立は1950年ですが、前身の神岡鉱山（1880年代から操業）を含めると100年以上の歴史を持ちます。

「非鉄金属メーカー」という地味な印象がありますが、三井金属の製品は現代社会のデジタル化・電動化を支える不可欠な素材です。特に電気自動車のリチウムイオン電池負極材・プリント基板（電子回路基板）に使われる「電池用銅箔」「プリント基板用銅箔」では世界トップクラスのシェアを誇り、スマートフォン・パソコン・そして急拡大するEVのリチウムイオン電池に欠かせない素材メーカーとして注目されています。

H2: 銅箔事業：現代のデジタル・EV社会を支える最重要素材

三井金属の最重要成長事業が「銅箔事業」です。銅箔とは厚さ数マイクロメートル〜数十マイクロメートルという極薄の銅のシートで、電子回路基板（PCB）やリチウムイオン電池の負極集電体に使われます。三井金属は「電解銅箔（電気化学的に析出させた銅箔）」と「圧延銅箔（銅を薄く延ばした銅箔）」の両方を製造しており、用途に応じて使い分けされます。

電池用銅箔：リチウムイオン電池の負極（マイナス極）の電流を集める基材として使われます。EV1台のバッテリーには軽量化の進んだ現在でも数十kgの銅箔が必要であり、EV販売台数の急増が銅箔需要を直接押し上げます。IEAの予測では2030年のEV販売台数は2023年比で2〜3倍になるとされており、電池用銅箔の中長期的な需要拡大は確実視されています。三井金属は「圧延銅箔」という高品質銅箔で差別化しており、サイクル寿命・充放電特性という品質面で競合より優位な評価を得ています。

プリント基板用銅箔：スマートフォン・パソコン・サーバーのマザーボードなどの電子回路基板（PCB）に使われます。AIサーバーには通常のサーバーより多くの多層PCBが使われており、AI需要増加がPCB用銅箔の需要を押し上げています。また5G・6G通信の高周波帯対応に必要な「低粗度銅箔（電気信号の伝達効率を高める表面が滑らかな銅箔）」は高付加価値品として収益性が高い分野です。

H2: 亜鉛精錬事業：安定収益の基盤

三井金属の伝統的な中核事業が亜鉛精錬です。亜鉛は鉄鋼の防錆（亜鉛メッキ）・タイヤ製造（加硫剤）・医薬品・化粧品・農業用農薬（殺菌剤）など幅広い用途を持ちます。三井金属は国内最大の亜鉛精錬能力を持ち、神岡製錬所（岐阜県飛騨市）を中核精錬拠点として安定操業を続けています。

亜鉛のLME（ロンドン金属取引所）価格は世界の建設需要・自動車生産・インフラ投資の動向によって変動します。中国が世界最大の亜鉛消費国であり、中国の建設・製造業の景況感がダイレクトに亜鉛価格・三井金属の亜鉛事業収益に影響します。亜鉛精錬は銅箔ほど高成長ではありませんが、安定した収益基盤として銅箔事業の成長投資を支えています。

H2: 自動車部品材料：ドアラッチと触媒材料

三井金属は「セリウム系複合酸化物（排気ガス浄化触媒の助触媒材料）」「ドアラッチ（自動車ドアの開閉・施錠機構）」という自動車部品材料分野でも独自の地位を持ちます。ドアラッチは国内外の主要自動車メーカーへの安定供給が続いており、シェアが高い領域です。EVシフトに伴い内燃機関向けの排気ガス触媒需要は縮小傾向ですが、EV向けの電動ドアラッチ・センサー統合型ドアシステムへの移行で単価・付加価値を維持・向上させる戦略を進めています。

H2: 鉱山権益とサプライチェーン戦略

三井金属は製錬だけでなく、海外の鉱山権益も保有しています。カナダでの銅・亜鉛鉱山権益・アラスカのビッグベンター銅鉱山への参画・南米での鉱山探索など、川上（採掘）から川下（製錬・材料製造）までを見渡す垂直統合的なサプライチェーン強化を進めています。特に銅は「産業の血液」と称され、EV普及・電力インフラ拡張・データセンター建設で需要急増が見込まれる戦略資源です。川上の鉱山権益保有は原料調達の安定化と銅価格上昇局面での収益向上をもたらします。

H2: 電池リサイクル事業：次の成長軸

三井金属が注力している新事業が「廃電池リサイクル（都市鉱山）」です。使用済みのリチウムイオン電池（主にEV・スマートフォン由来）からコバルト・ニッケル・リチウム・銅を回収・精錬するケミカルリサイクル技術の開発を進めています。2030年代以降に大量に廃棄されることが予測されるEV電池のリサイクル需要は巨大市場になると見込まれており、三井金属の精錬技術・素材加工技術が活きる新領域です。サーキュラーエコノミー（循環経済）という世界的なトレンドとも合致しており、ESG投資の観点からも評価されやすい事業です。

H2: 中期経営計画「MMP2030」の骨子

三井金属の中期経営計画「MMP2030」では、2030年に向けた事業ポートフォリオの進化として「電池用銅箔の生産能力倍増以上」「亜鉛精錬の効率化によるコスト競争力強化」「電池リサイクルの商業化」「車載部品のEV対応製品への転換」という四つの優先課題を掲げています。特に電池用銅箔の生産能力拡大のための設備投資は数百億円規模で計画されており、EV需要急増に対応するための生産体制を整備します。

H2: 財務状況と株主還元

三井金属の財務は安定しており、有利子負債・自己資本のバランスは健全な水準を維持しています。ROEは事業の性質上（素材メーカーとして資本集約的）10〜15%前後で推移しており、東証のPBR改善要請を受けた株主還元強化（増配・自社株買い）も実施されています。配当利回りは2〜4%前後で、バリュー株として割安に放置されることがある銘柄です。

H2: 競合・関連銘柄・海外

国内競合・関連企業は住友金属鉱山（5713）・DOWAホールディングス（5714）・JX金属（非上場、ENEOSグループ）です。銅箔分野では韓国のSK Nexilis・LG化学・台湾の長春石油化学・日本のNEPCO（古河電工系）が主要競合です。電池材料全般では住友化学（4005）・東レ（3402）・旭化成（3407）がセパレーター等で競合します。亜鉛精錬では韓国のYoung Poong・ベルギーのNyrstar（非上場）・中国の厳重鉛亜鉛が世界大手です。銅箔の主要顧客であるEVメーカーとしてテスラ（TSLA）・BYD（002594）・パナソニックHD（6752、電池メーカーとして）が重要です。

H2: StockWaveJP編集部の見解

三井金属はEV・脱炭素テーマと鉄鋼・素材テーマの双方に関連するクロステーマ銘柄として観察しています。特に電池用銅箔の需要動向はEV販売統計（テスラ・BYDの四半期納車台数）と強く連動しており、EV販売の市場予想超えのタイミングで三井金属の出来高急増が起きることを繰り返し観察しています。

亜鉛・銅のLME価格動向も株価に直接影響するため、LME価格の週次変化と中国の製造業PMI（銅需要の最大要因）をStockWaveJPのテーマモメンタムと組み合わせた確認が投資判断の精度向上に有効です。特に「EV・脱炭素テーマが加速モメンタムに入る局面で、LME銅価格も上昇している時期」はEV普及と銅需要の拡大が重なるタイミングとして注目しています。

H2: まとめと今後の展望

三井金属は電池用銅箔というEV時代の必須素材・亜鉛という安定素材・リサイクルという新成長軸の組み合わせで、素材メーカーとして中長期的な競争力を維持する企業です。EV普及と電子機器の高度化という二つのメガトレンドの恩恵を受ける位置にあり、電池リサイクルという次の成長軸の商業化が進む2027〜2030年にかけてのさらなる企業価値向上が期待されます。

H2: 銅箔市場の世界競争動向

銅箔市場では中国・韓国・台湾のメーカーが積極的な設備投資を行っており、汎用品での価格競争が激化しています。中国の電解銅箔メーカー（諾電科技・嘉元科技等）は政府補助を受けた大規模投資で急成長しており、低価格での市場参入を進めています。この価格競争に対して三井金属は「圧延銅箔という高品質・高付加価値品に特化すること」で差別化しており、汎用電解銅箔との直接競争を避ける戦略を採っています。

H2: 全固体電池への対応

次世代EV電池として注目される「全固体電池」では、現在のリチウムイオン電池と異なる集電体（電流を集める部分）の設計が必要になる可能性があります。固体電解質との相性・固体の体積変化への対応など、銅箔への要求仕様も変化することが予想されます。三井金属は全固体電池向けの次世代銅箔・電極材料の研究開発にも取り組んでおり、2030年代の全固体電池商業化に備えた先行開発を進めています。

H2: まとめ（詳細版）

三井金属は電池用銅箔・亜鉛精錬・車載部品・電池リサイクルという四事業の複合的な強みで、EV普及とデジタル化という二大メガトレンドに対応する非鉄金属企業です。圧延銅箔という技術的な差別化軸を持ちながら、全固体電池時代への先行対応も進めており、2030年代に向けた素材企業としての競争力維持に積極的です。

H2: 亜鉛精錬の技術と環境対応

神岡製錬所（岐阜県飛騨市）はISA法（Imperial Smelting Accepter法）という効率的な亜鉛精錬プロセスを採用しています。製錬工程で生じる硫黄分を硫酸として回収・販売（肥料・化学原料用）することで副産物収入を確保しながら環境負荷を低減しています。ISO14001の環境マネジメント認証を取得しており、持続可能な製錬事業の実現を目指しています。

H2: 神岡鉱山とカミオカンデ

余談ながら、三井金属の旧神岡鉱山の廃坑を利用した「スーパーカミオカンデ（ニュートリノ観測施設）」は世界的に有名な科学施設です。小柴昌俊博士（2002年ノーベル物理学賞）・梶田隆章博士（2015年同賞）の研究が行われた施設として知られ、三井金属の歴史と日本の科学技術の歴史が交差する象徴的な場所です。

H2: まとめ（最終版）

三井金属は電池用銅箔というEV必須素材・亜鉛という安定素材・電池リサイクルという次世代成長軸を組み合わせた非鉄金属企業です。EV普及と電子機器の高度化という二大メガトレンドの恩恵を長期にわたって受け続けられるポジションにあり、持続的な企業価値向上が期待されます。
`},{id:"ajinomoto-analysis",category:"個別銘柄",icon:"🍜",title:"味の素（2802）徹底解説：うま味・アミノ酸の世界企業が示す海外展開と高利益率の秘密",date:"2026/04/11",themes:["食品・飲料","農業・フードテック"],keywords:["味の素","2802","うま味","アミノ酸","グローバル","ASEAN","冷凍食品","配当"],summary:"味の素（2802）はうま味調味料「味の素」で世界に知られる食品企業。アミノ酸技術を核にASEANでのリーダー的地位・高い利益率・連続増配という「食品の優等生」を徹底解説します。",body:`
H2: 味の素とはどんな会社か

味の素（証券コード：2802）は1909年創業の食品・アミノ酸メーカーで、うま味調味料「味の素（AJI-NO-MOTO）」を世界130カ国以上で販売するグローバル企業です。売上高は約1.4兆円（2024年度）ですが、注目すべきは「海外売上比率が55%超」という食品企業としての高い国際展開度です。

「うま味（UMAMI）」は日本発の概念で、甘・塩・酸・苦に次ぐ第5の基本味として世界的に認知されています。この「うま味の発見と産業化」という味の素の歴史的な業績が、同社のグローバルブランド力の基盤となっています。

H2: アミノ酸技術という独自の競争優位性

味の素の事業の核心は「アミノ酸（タンパク質を構成する有機化合物）の発酵・合成技術」です。この技術は食品（調味料）だけでなく、医薬・化粧品・電子部品・飼料など多岐にわたる分野に応用されています。

特に注目されるのが半導体パッケージ材料「ABF（Ajinomoto Build-up Film）」です。ABFはインテルのCPU・GPUのパッケージ基板に使われる絶縁材料で、味の素がほぼ独占的なシェアを持ちます。AIチップの需要急増（エヌビディアのGPU増産等）に伴いABFの需要も急増しており、「食品企業が半導体材料でも世界シェアを持つ」というユニークな企業体として投資家から高い評価を受けています。

H2: ASEAN市場でのリーダーシップ

味の素の海外事業の核心はASEAN（東南アジア）市場です。タイ・ベトナム・フィリピン・インドネシアなどでは「味の素（AJI-NO-MOTO）」がほぼ日本の「醤油」並みの認知度を持ち、家庭料理の必需品として定着しています。

タイでは調味料・冷凍食品・飲料にわたって全国的なブランドを持ち、味の素タイランドは現地の主要食品企業として株式市場にも上場しています。ブラジル（南米市場）でも「アジノモト」ブランドが強く、中南米市場での展開も進んでいます。

H2: 冷凍食品・加工食品の成長

日本国内では「ギョーザ（冷凍餃子）」「唐揚げ粉」「コンソメ」「ほんだし」などの家庭向け食品で高いブランド力を持ちます。特に「味の素の冷凍餃子」は国内冷凍食品市場でトップクラスのシェアを誇り、スーパー・コンビニ・業務用市場に安定供給しています。

アミノ酸技術を活用した「機能性食品（プロテイン・アミノ酸補給食品）」市場への参入も進んでおり、高齢化社会での「健康×食品」需要の取り込みを進めています。

H2: ABF（Ajinomoto Build-up Film）：半導体テーマとの接点

味の素の隠れた高成長事業がABF（アジノモト・ビルドアップ・フィルム）です。半導体パッケージの多層基板に使われる絶縁フィルムで、世界シェアほぼ100%という圧倒的な寡占状態にあります。インテルが「インテルアーキテクチャ」の設計基準にABFを採用して以来、ABFなしには最先端の半導体パッケージが作れない状況が続いています。

AI時代のGPU（エヌビディアH100・B200等）・HBM（高帯域メモリ）パッケージにもABFが使用されており、AI半導体需要の急増がABFの需要を直接押し上げます。食品企業でありながら「半導体テーマ」での投資機会という二重の価値を持つ稀有な企業です。

H2: 財務・株主還元

味の素は連続増配を続けており、株主還元に積極的な企業として知られています。ROE（自己資本利益率）は10〜15%と食品企業としては高水準で、アミノ酸・食品・ABFという高付加価値事業が高い利益率を生み出しています。配当利回りは2〜3%台で安定しています。

H2: 関連銘柄・競合・海外

国内食品競合は日清食品HD（2897）・明治HD（2269）・キッコーマン（2801）・ハウス食品（2810）などです。アミノ酸事業では協和キリン（4151）・KYOWA（非上場）が競合します。ABF（電子材料）分野ではPanasonic（エレクトロニクス材料）・太陽インキ製造が一部競合します。海外食品大手ではネスレ・ユニリーバ・モノデリーズが間接的な競合です。

H2: StockWaveJP編集部の見解

味の素はStockWaveJPで食品・飲料テーマと半導体テーマの両方に注目されるユニークな銘柄です。エヌビディア決算などのAI半導体関連ニュースで半導体テーマの出来高が急増するとき、ABF需要への期待から味の素にも関連した動きが出ることがあります。

食品テーマとしての側面では円安局面でASEAN収益の円換算増加が業績に貢献するため、為替の動向も重要な確認ポイントです。長期投資の観点からは「連続増配×ABFの世界シェア独占×ASEANでのブランド力」という三つの強みが複合する優良銘柄として評価しています。

H2: まとめと今後の展望

味の素は「食品×アミノ酸×半導体材料」という一見異質な三事業が一体となった、日本株市場でも稀有なユニーク企業です。うま味のグローバルブランド・ABFの独占的シェア・ASEANの盤石な市場基盤という三重の競争優位性が長期的な株主価値の創出を支えます。

H2: ABFの供給増強と半導体パッケージの進化

味の素のABF（Ajinomoto Build-up Film）は、半導体パッケージの高密度化・多層化という技術トレンドによって需要が継続的に拡大しています。AIチップの開発競争でパッケージ基板の多層化（20層以上）が進む中、ABFの使用量も増加しています。

味の素はABF工場の増設投資を続けており、生産能力の拡大が需要増加に追いついているかが業績の鍵となっています。知名度が低いながらも「半導体に不可欠な素材の独占メーカー」というユニークなポジションは、AI時代が続く限り安定した需要基盤を提供します。

H2: サステナビリティと「アミノ酸の力」

味の素の事業活動の根幹にある「発酵技術」はサトウキビやキャッサバなどのバイオマスを原料とし、マイクロバイオームを活用するバイオテクノロジーです。化石燃料に頼らない持続可能な製造方法であり、ESG・サステナビリティの観点からも機関投資家から高い評価を受けています。

H2: まとめ

味の素は「食品×半導体材料×アミノ酸」という一見不思議な組み合わせを持つ企業です。うま味のグローバルブランド・ABFの独占的シェア・ASEANでの盤石なブランド力という三重の競争優位性が、業績の安定性と成長性を長期にわたって支えます。

H2: 医薬・バイオサイエンス事業

味の素はアミノ酸技術を医薬分野にも応用しています。アミノ酸製剤（病院での静脈栄養剤：ビーフリードなど）・医薬品原料（医薬品中間体・添加剤）・バイオ医薬品の製造受託（CDMO：Contract Development and Manufacturing Organization）に参入しています。バイオ医薬品の需要急増を背景に、CDMOビジネスの成長が期待されており、アミノ酸の医薬用途での収益拡大が続いています。

H2: 日本食の世界普及と輸出拡大

「JAPANIZATION（日本食の世界普及）」という潮流の中で、味の素の調味料・食品の海外需要が拡大しています。特に「ほんだし（だし調味料）」「クノール（スープ・コンソメ）」「Cook Do（中華合わせ調味料）」などの日本生まれの調味料が欧米・アジアの家庭料理でも使われるようになっています。日本食レストランの世界的な増加（ユネスコ無形文化遺産認定の「和食」普及）がこのトレンドを後押ししています。

H2: まとめ

味の素は「食品×半導体材料×アミノ酸×医薬バイオ」という複数の成長エンジンを持つユニークな企業です。ABFの独占的シェアという「隠れた半導体企業」としての側面と、ASEANでの圧倒的な食品ブランドという二重の価値が長期的な株主価値を高め続けます。

H2: アミノ酸科学の深化と医薬CDMO事業

味の素はアミノ酸技術を医薬・バイオ分野にも積極展開しています。CDMO（Contract Development and Manufacturing Organization：医薬品製造受託）事業では、製薬会社が自社工場を持たずに製造を外注する需要を取り込んでいます。特にバイオ医薬品（抗体医薬・mRNAワクチン等）の製造において、高純度アミノ酸を使った培地（細胞培養液）の提供・バイオ医薬品の製造工程への技術支援で独自の競争力を持ちます。

COVID-19ワクチン（mRNA型）の製造で使われるアミノ酸関連材料の需要が急増したことで、味の素の医薬事業が市場から再評価されました。バイオ医薬品市場は今後も高成長が続く見通しであり、味の素のアミノ酸技術という「隠れたバイオ企業」としての価値が再認識されています。

H2: サステナビリティ経営とESG評価

味の素は「バイオ・ファイン」という事業理念のもと、微生物発酵技術（バイオテクノロジー）を活用した持続可能な製造を推進しています。サトウキビ・キャッサバなどの農業由来バイオマスを原料とし、化石燃料依存を最小化した製造プロセスを採用しています。

この「発酵技術によるサステナブル製造」はESG投資の観点から高く評価されており、欧米の機関投資家からの評価が年々高まっています。国連のSDGs（持続可能な開発目標）との親和性が高く、ESGファンドへの組み入れ比率上昇が株式需給の改善につながっています。

H2: 海外展開の詳細：地域別の強みと成長

タイ：味の素（タイ）がBKK証券取引所に上場しており、タイ最大の食品企業として調味料・冷凍食品・飲料で圧倒的なブランドを持ちます。タイのGDP成長とともに消費市場が拡大しており、中間層向けの高付加価値商品への移行が収益性を高めています。ベトナム：急速な経済成長と都市化を背景に、うま味調味料・即席麺・冷凍食品の需要が拡大しています。ブラジル：南米最大の市場でアジノモトブランドが「料理の基本調味料」として定着しています。

H2: まとめ（詳細版）

味の素は「うま味×アミノ酸×ABF×バイオCDMO」という一見複雑に見える事業群が実は「アミノ酸科学」という一つの技術軸で統合されている企業です。ABFの独占シェア・ASEANの盤石なブランド・医薬バイオCDMOという三つの高付加価値事業が中長期の収益成長を支え続けます。
`},{id:"furukawa-analysis",category:"個別銘柄",icon:"⚡",title:"古河電気工業（5801）徹底解説：光ファイバー・電力ケーブル・車載部品の総合電線メーカー",date:"2026/04/11",themes:["光通信","EV・電気自動車","IOWN"],keywords:["古河電工","5801","光ファイバー","電力ケーブル","ワイヤーハーネス","EV","データセンター","銅"],summary:"古河電気工業（5801）は光ファイバー・電力ケーブル・自動車用ワイヤーハーネス・銅製品を手掛ける総合電線メーカー。AIデータセンター向け光ファイバー需要急増と洋上風力向け電力ケーブルという二大成長テーマを背景に株価が上昇。競合のフジクラ・住友電工とともに光通信テーマの中核銘柄を徹底解説します。",body:`
H2: 古河電気工業とはどんな会社か

古河電気工業（証券コード：5801、通称「古河電工」）は1884年創業という長い歴史を持つ総合電線メーカーです。光ファイバー・光ケーブル・電力ケーブル・自動車用ワイヤーハーネス・銅製品・機能性材料を主要事業とし、売上高は約8,000〜9,000億円（2024年度）規模、東京都千代田区に本社を置きます。

古河電工・フジクラ・住友電工は「電線御三家」と呼ばれ、日本の電線産業を三分する競合企業群です。古河電工はこの三社の中で最も歴史が古く、明治時代の銅山開発・銅製錬事業を起源とします。現在は銅という素材から光ファイバー・電力インフラ・自動車電装まで幅広い応用分野をカバーするという独自の強みを持ちます。

H2: 光ファイバー・光ケーブル事業：AIの追い風

古河電工の成長事業第一位が光ファイバー・光ケーブル事業です。データセンターの建設・拡張・ネットワーク高速化という世界的なトレンドの中で、古河電工の光ファイバー製品への需要が急増しています。

国内ではNTT（9432）・KDDI（9433）などの通信キャリアとの長期的な取引関係を持ち、5G基地局の展開・光通信インフラの整備向けに安定供給を続けています。海外では北米・欧州・アジアへの光ファイバー輸出も拡大しており、特にハイパースケーラー（Google・Amazon・Microsoft等）が世界各地でデータセンターを拡張する動きに連動した需要増が続いています。

光ケーブルの製造においては「光ファイバーの紡糸（極細の光導波路を溶融・延伸で製造する工程）」という高度な製造技術が参入障壁となっており、新規競合が容易に参入できない構造的な競争優位性があります。光ファイバーの世界市場ではコーニング（米国）・プリズミアン（伊）・住友電工・フジクラ・古河電工という少数のプレイヤーが高いシェアを持つ寡占構造です。

H2: 電力ケーブル事業：再生可能エネルギーと国土強靭化

電力ケーブル事業も古河電工の重要な収益柱です。電力会社向けの高圧・超高圧ケーブル（送電線の地中化）・工場・ビル向けの構内用電力ケーブルに加え、洋上風力発電向けの海底電力ケーブルの需要が急増しています。

政府が2040年までに洋上風力4,500万kWの導入を掲げており、洋上風力発電所から陸上の電力系統に送電するための海底電力ケーブルの需要は今後10〜20年にわたって構造的に拡大します。古河電工はこの市場で国内有力サプライヤーの一角を占めており、大型受注の積み上がりが業績見通しを押し上げています。

また老朽化した電力インフラの更新（国土強靭化・停電防止対策）という政策的な需要も電力ケーブル市場を支えています。

H2: ワイヤーハーネス・自動車部品材料

自動車向けのワイヤーハーネス（車内の電気配線システム）はフジクラ・住友電工と並ぶ古河電工の主要事業です。国内外の主要自動車メーカーへ供給しており、EV（電気自動車）の普及に伴い車内の電装化・高電圧ハーネス化が進むことで単価上昇・需要増が見込まれます。

自動車向けには銅系合金・アルミニウム合金などの高機能導体材料も供給しており、EV向けの軽量化（銅→アルミへの材料変換）というトレンドに対応した製品開発も進めています。

H2: 銅製品・機能性材料

古河電工の起源である銅製錬・銅圧延事業は現在も重要な事業基盤です。銅条（銅の板・棒・管）・銅合金製品を各種産業向けに供給しています。また半導体リードフレーム（IC・LSIのパッケージ部品）・伸銅品（プレス部品）などの機能性材料でも高い技術力を持ちます。

H2: 財務状況と課題

古河電工は長期にわたって低収益が続いていた時期があり、構造改革（事業ポートフォリオの見直し・収益性の低い事業の縮小）が進行中です。現在は光ファイバーと電力ケーブルという高成長・高付加価値事業への集中により収益性が改善しており、営業利益率の向上が続いています。

有利子負債は中程度で、借入過多ではありませんが、設備投資（光ファイバー・電力ケーブルの増産ライン）への資金需要が続く状況です。配当は安定的に維持されており、業績改善に伴う増配の動きも出てきています。

H2: 競合・関連銘柄・海外

国内競合は住友電気工業（5802）・フジクラ（5803）・三菱電線工業（住友電工グループ）です。光ファイバー世界大手では米コーニング（GLW）・伊プリズミアン（PRY）・仏넥ス（Nexans・NEX）が競合します。電力ケーブルでは韓国のLS Cable・LS Electric、欧州のプリズミアン・넥スが大手です。自動車ワイヤーハーネスでは独レオニ（Leoni）・仏Valeo・韓国のYura Corp.が海外競合です。

H2: StockWaveJP編集部の見解

古河電工は光通信テーマと再生可能エネルギーテーマの双方に連動するクロステーマ銘柄として観察しています。フジクラと同様に「AI・データセンター需要の強さ＋再エネ政策の追い風」が重なる局面でこの銘柄への資金流入が加速するパターンが見られます。

電線御三家（古河・フジクラ・住友電工）の中で古河電工は相対的にバリュエーションが低い局面が多く、「フジクラが先行して上昇した後に古河電工にローテーションする」というパターンも観察されます。StockWaveJPの光通信テーマの出来高ランキングでフジクラ・住友電工に加え古河電工が上位に現れ始めたとき、テーマ全体のモメンタムが広がっているサインとして注目します。

H2: まとめと今後の展望

古河電工はAIデータセンター向け光ファイバーと洋上風力向け電力ケーブルという「現代の二大インフラ需要」を取り込む位置にある総合電線メーカーです。構造改革による収益性改善が続く中で、成長事業への集中投資が業績・株価の上昇基調を支えます。フジクラの影に隠れがちですが、同様の成長テーマに乗る「割安な代替投資候補」として投資家の注目に値します。

H2: 古河電工グループの多角化とシナジー

古河電工グループには銅・電線以外にも多様な事業会社があります。古河機械金属（FMMD）は産業機械・ポンプ・鉱山機械を手掛け、古河電池（FDK）はニッケル水素電池・アルカリ電池を製造しています。古河スカイ（現UACJ、5741）はアルミ圧延で国内首位で、古河電工の持分法適用関連会社です。

H2: 超電導技術と次世代応用

古河電工は「超電導技術」の研究開発でも先進的な取り組みをしています。超電導ケーブル（電気抵抗ゼロで電力を送電する次世代技術）の実証実験に参加しており、将来的な「超電導電力グリッド」実現に向けた基盤技術の蓄積を進めています。この技術が実用化されれば送電ロスの大幅削減（現在約5%の送電損失をほぼゼロに）が実現し、脱炭素社会のインフラに革命をもたらす可能性があります。

H2: まとめ

古河電工はフジクラと同じ「電線御三家」の一角として、AI・データセンター向け光ファイバーと洋上風力向け電力ケーブルという二大成長テーマに乗る素材メーカーです。フジクラほど市場の注目を集めていない分「割安な代替銘柄」としての投資機会もあります。超電導という将来技術の実用化という長期オプション価値も含め、電線セクター全体での分散投資の一選択肢です。

H2: 古河電工の歴史と事業多角化

古河電工の起源は明治時代の古河財閥による足尾銅山（栃木県）の採掘・銅製錬事業です。銅という素材から出発し、電線（銅を使った電気の通路）・光ファイバー（光を通す特殊なガラス）・ワイヤーハーネス（自動車の電気配線）という時代に応じた多角化を重ねてきた歴史があります。現在は「電気系素材・部品のスペシャリスト」として多様な産業を支えています。

H2: 超電導ケーブル技術という長期オプション

古河電工は超電導ケーブル（絶対零度に近い極低温で電気抵抗がゼロになる素材を使ったケーブル）の研究開発にも参加しています。超電導ケーブルが実用化されれば送電ロスをほぼゼロにできるため、電力インフラの効率化に革命をもたらす可能性があります。現時点では冷却コストが高く商業化には課題がありますが、長期的な技術オプションとして注目されています。

H2: FPC・機能性材料事業

古河電工グループのUBE-FTM（古河電工とUBEが合弁で設立した企業）はフレキシブルプリント回路（FPC）基材の「ユーピレックス（高耐熱性ポリイミドフィルム）」で世界的な競争力を持ちます。このフィルムはスマートフォン・宇宙機器・航空機などの高信頼性が求められる用途で採用されています。

H2: 電池材料への参入

古河電工は電池用材料への参入も進めています。リチウムイオン電池の正極材・電池パックの熱管理部材（アルミ製放熱材・銅合金製部材）・電池ケース用材料など、電池の周辺材料分野での事業化を目指しています。銅という素材技術と熱管理技術の組み合わせが電池材料への参入を可能にしています。

H2: まとめ（詳細版）

古河電工はフジクラと並ぶ光通信・電力ケーブルのプレイヤーとして、AI・データセンター需要と洋上風力需要の双方の追い風を受けています。フジクラほど市場の注目を集めていない分、割安なバリュエーションでの投資機会があります。超電導・FPC基材・電池材料という長期的な新事業の種も持ち、安定した基盤事業の上に成長オプションを持つ素材企業として評価します。

H2: 古河電工のグループ企業と事業シナジー

古河電工グループには多様な事業会社があります。古河機械金属（5715）は産業機械・ポンプ・鉱山機械を手掛け、古河電池（6937）はニッケル水素電池・アルカリ電池を製造しています。UACJ（5741）は古河電工と住友軽金属の統合で誕生したアルミ圧延最大手で、自動車・缶向けアルミ材料を供給しています。これらグループ各社との素材技術・製造ノウハウの共有がシナジーをもたらしています。

H2: 洋上風力の国内受注動向

政府が指定する日本の洋上風力発電の大型案件（秋田・千葉・長崎等）は総合商社・電力会社・外資系エネルギー企業などが入札に参加しています。入札が確定した案件では海底電力ケーブルの調達・敷設工事の発注が続き、古河電工・フジクラ・住友電工への引き合いが増加します。各案件の着工スケジュール・ケーブル調達の入札結果がこれらの企業の受注動向を左右するため、エネルギー省・国土交通省の洋上風力関連の公示情報を定期確認することが投資管理に有効です。

H2: まとめ（最終版）

古河電工はAI・データセンター需要（光ファイバー）と洋上風力・再エネ需要（電力ケーブル）という二大成長テーマに乗りながら、EV向けワイヤーハーネス・電池材料という第三の成長軸も育てています。フジクラほど市場の注目度は高くありませんが、割安なバリュエーションで同様の成長テーマに投資できる「割安な代替候補」として、電線セクターのポートフォリオ分散投資の観点からも評価に値する銘柄です。
`},{id:"advantest-analysis",category:"個別銘柄",icon:"🔬",title:"アドバンテスト（6857）徹底解説：AI半導体テスト装置で世界首位を誇る技術企業",date:"2026/04/11",themes:["半導体検査装置","AI半導体"],keywords:["アドバンテスト","6857","半導体テスト","SoC","HBM","AI","エヌビディア","TSMC"],summary:"アドバンテスト（6857）は半導体テスト装置（ATE）で世界首位シェアを誇る日本の精密機器メーカー。エヌビディアのAI用GPU・HBM（高帯域メモリ）のテスト需要急増で業績・株価ともに急拡大。日経平均採用銘柄でもある日本のAI関連代表銘柄を徹底解説します。",body:`
H2: アドバンテストとはどんな会社か

アドバンテスト（証券コード：6857）は半導体の品質検査に使われる「半導体テスト装置（ATE：Automatic Test Equipment）」を開発・製造・販売する精密機器メーカーです。1954年創業、東京都新宿区に本社を置き、売上高は約5,000〜6,000億円（2024年度）規模、東証プライム上場・日経平均225採用銘柄です。

半導体テスト装置とは、製造された半導体チップが正しく動作するかどうかを電気的に検査する装置です。高度化する半導体に対応した超高精度・超高速の電気信号を使ってチップの良否を判定します。この「テスト工程」は半導体の品質保証に不可欠であり、歩留まり（良品率）の管理と製品信頼性の確保に直結します。

H2: 世界シェア50%超という圧倒的な市場地位

アドバンテストの最大の強みは、SoC（システム・オン・チップ、スマートフォンや AI 用チップ）テスト装置で世界市場シェア50%超という圧倒的な地位にあることです。競合の米テラダイン（TER）と世界市場をほぼ二分する「ATE市場の二強」の一角として君臨しています。

この高いシェアを支えるのは「長年の技術蓄積による顧客との深い信頼関係」です。半導体テスト装置は数十億円規模の高額設備であり、一度導入した装置メーカーを簡単に変更できません。TSMC・サムスン・SKハイニックス・インテルなどの世界的半導体メーカーとの長期的なビジネス関係が参入障壁となっています。

H2: AI半導体・HBMテスト需要が急増

アドバンテストの業績を直近で最も押し上げているのが「AI用GPU（エヌビディアH100・B200等）」と「HBM（High Bandwidth Memory：高帯域メモリ）」のテスト需要です。

AI用GPUは従来のPC向けCPUとは桁違いに複雑な回路構造を持ち、テストに要する時間・精度・電力も格段に高い仕様が必要です。1台あたりのテスト装置単価が高く、エヌビディアのGPU出荷量が増えるほどアドバンテストの収益が拡大する構造です。

HBM（高帯域メモリ）はAI学習に使われる大規模並列演算のために、膨大なデータを超高速でやり取りするDRAMの積層型パッケージです。SKハイニックス・マイクロン・サムスンがHBMを大量生産しており、その全数テストにアドバンテスト製テスト装置が使われています。HBMのテストは通常のDRAMより複雑で高価なため、HBM需要の増加は単価向上と需要量増加の両方をもたらします。

H2: 半導体サイクルとの関係

アドバンテストの業績は半導体産業の設備投資サイクルに強く連動します。半導体業界は「好況期（設備投資旺盛）→過剰生産→不況期（在庫調整・設備投資抑制）→回復期」という周期的なサイクルを繰り返します。このサイクルに合わせてアドバンテストの受注・売上・株価が大きく変動します。

ただしAI用GPU・HBMという分野は従来の半導体サイクルとは異なる「構造的な需要拡大」が続いており、従来のサイクル的な需要変動より安定した成長が期待されます。

H2: 財務状況

アドバンテストは無借金に近い健全な財務状態で、豊富な現金・有価証券を保有します。研究開発費（R&D）に売上の15〜20%規模を継続投資しており、技術的な競争優位性の維持に積極的です。配当は増配傾向が続いており、配当利回りは1〜2%前後です。

H2: 関連銘柄・競合・海外

直接の競合は米テラダイン（TER、Nasdaq上場）です。テラダインも世界ATE市場二強の一角で、スマートフォン向けテスト（Apple向けが大口顧客）に強みがあります。他の関連企業として半導体製造装置全般ではASML（蘭）・東京エレクトロン（8035）・ラムリサーチ（米）・アプライドマテリアルズ（米）があります。テスト工程の周辺装置・部品ではコクシステム（HMI）・マクロニクス（台湾）・コアリス（韓国）などが関連します。

国内では半導体検査装置で日本電子（6951）・ニコン（7731）（露光装置）が周辺領域の企業です。HBM製造のサプライヤーとしてSKハイニックス（韓国・米ADR：HXAPL）・マイクロン（MU）・サムスン電子（韓国）がアドバンテストの主要顧客です。

H2: StockWaveJP編集部の見解

アドバンテストは半導体テーマのモメンタムと最も強く連動する銘柄の一つとして観察しています。エヌビディアの決算発表（四半期ごと）のタイミングで半導体テーマの出来高が急増する際、アドバンテストは東京エレクトロンとともに「日本の半導体関連株の代表格」として真っ先に買われる傾向があります。

注目しているのは「エヌビディアのGPU出荷台数予想と、アドバンテストの受注残の相関」です。エヌビディアが次世代GPU（Blackwell等）の大量出荷を発表するたびに、アドバンテストのテスト装置需要が急増するという連鎖が鮮明に現れています。この相関を把握した上でStockWaveJPの半導体テーマモメンタムを確認することが、エントリータイミングの精度向上に有効と考えています。

H2: まとめと今後の展望

アドバンテストはAI半導体という「現代最大の成長テーマ」のど真ん中に位置する企業です。エヌビディアGPU・HBMという最先端半導体のテスト需要が急増する中で、世界シェア50%超という圧倒的な地位が業績の長期成長を支えます。半導体サイクルのリスクはありますが、AIという構造的なテーマがサイクルの谷を浅くする可能性があり、中長期の成長期待は高い状態が続いています。

H2: アドバンテストの技術開発と標準化

アドバンテストは毎年の売上の15〜20%を研究開発費に投じており、テスト装置の技術進化に積極投資しています。特に「SoC用テスター（V93000シリーズ）」はAI向けSoC・GPUのテストに対応した最先端機種で、顧客である半導体メーカーの新製品開発スケジュールに合わせて常に最新のテスト仕様に対応しています。

また「量子コンピュータ用デバイスのテスト」という次世代需要にも対応した装置開発を進めており、量子コンピュータの商業化が進む2030年代への布石を打っています。

H2: 米テラダインとの競合構造

アドバンテストの唯一の直接競合が米テラダイン（TER）です。テラダインはスマートフォン向けAP（アプリケーションプロセッサ）のテストでAppleのサプライチェーンとの関係が深く、アップルのiPhoneチップ（A・Mシリーズ）向けのテスト需要が業績を左右します。アドバンテストはAIチップ・HBM向けに強みがあり、両社は半導体の用途によって顧客が分かれています。

H2: まとめ

アドバンテストはAI半導体というメガトレンドの直接受益者として、東京エレクトロンとともに「日本の半導体関連株の旗手」的な位置づけです。世界シェア50%超・高い研究開発投資・HBM・AIチップ需要への対応という三つの強みが長期的な競争優位性を形成しています。

H2: テスト装置の新領域：次世代パッケージとChiplet

半導体の次世代パッケージング技術として「Chiplet（チップレット）」が注目されています。複数の小さなチップ（チップレット）を一つのパッケージに統合する技術で、インテルやAMDが採用しています。Chipletパッケージのテストは複雑さが増し、テスト装置への要求が高度化するため、アドバンテストのような高性能ATE専業メーカーの技術的な優位性が発揮されやすい分野です。

また「エッジAI向けの低消費電力チップ」のテストも新たな需要として拡大しており、従来とは異なるテスト要件（超低消費電力測定・発熱管理）に対応した専用装置の開発が進んでいます。

H2: まとめ

アドバンテストはAI半導体の「作る段階」ではなく「検査する段階」という独自のポジションで、エヌビディアのGPU・HBMというAI時代の必須半導体のテストを独占的に担っています。この「検査インフラ」としての不可欠性が、半導体サイクルの谷でも比較的安定した受注を確保する競争優位性の源泉です。

H2: テスト工程の重要性とATEの役割

半導体の製造工程は「設計→製造（前工程：ウェーハプロセス）→パッケージング（後工程）→テスト」という流れで進みます。テスト工程は最終的な品質保証の砦であり、不良品が顧客（スマートフォンメーカー・データセンター等）に届くことを防ぐ重要な役割を担います。特にAI向けGPUやデータセンター向けHBMのような高額チップは一個あたりの単価が数万〜数十万円に達するため、テストの精度・速度・コストが製品競争力に直結します。

H2: HBMテストの特殊性と市場優位

HBM（High Bandwidth Memory）は複数のDRAMチップを縦に積み重ねた「3D積層型高帯域メモリ」で、AIの大規模計算に不可欠なデバイスです。SKハイニックスが先行して開発し、エヌビディアのGPU（H100・B200等）に採用されており、AIブームとともに需要が急拡大しています。

HBMのテストには特殊な要件があります。積層された複数のDRAMチップを一体的にテストする「スタック全体のテスト（KGD：Known Good Die）」という工程が追加されており、通常のDRAMテストより複雑・高コストです。アドバンテストはこのHBM向けテストで高いシェアを持ち、HBM需要の拡大が直接的な受注増につながっています。

H2: 量子コンピュータ・次世代デバイスへの対応

アドバンテストは「量子コンピュータ用チップのテスト」という次世代の市場も見据えています。量子コンピュータは極低温環境での動作・量子ビットの精密制御という従来とは全く異なる特性を持ち、テスト装置にも特殊な対応が必要です。アドバンテストは量子デバイスのテストに関する研究開発を進めており、量子コンピュータが商業化する2030年代への布石を打っています。

H2: 地政学リスクと輸出規制への対応

半導体産業全体の懸念として「対中輸出規制」があります。米国は中国向けの先端半導体・製造装置への輸出規制を段階的に強化しており、アドバンテストの中国向け輸出も一部制限を受けています。中国市場での売上比率が一定程度あるアドバンテストにとって、規制強化は短期的なリスク要因です。ただし「AI用半導体のテスト」という需要は中国以外（米国・韓国・台湾・日本）でも急増しており、地域分散によるリスク軽減が進んでいます。

H2: まとめ（詳細版）

アドバンテストは半導体産業の「テストというインフラ」を担う唯一無二のポジションを持ちます。AI半導体・HBMという世界最先端かつ最高単価のチップのテスト需要が急増する中で、世界シェア50%超という圧倒的な地位が長期的な競争優位を形成しています。半導体サイクルのリスクはありますが、AI需要という構造的な成長がサイクルの谷を浅くしています。
`},{id:"kioxia-analysis",category:"個別銘柄",icon:"💾",title:"キオクシア（285A）徹底解説：NAND型フラッシュメモリ世界2位・東芝メモリの後継企業",date:"2026/04/11",themes:["メモリ","AI半導体"],keywords:["キオクシア","285A","NAND","フラッシュメモリ","SSD","スマートフォン","AI","半導体サイクル"],summary:"キオクシアホールディングス（285A）はNAND型フラッシュメモリで世界第2位シェアを持つ半導体メーカー。2024年に東証へ再上場し注目を集めました。AI時代のSSD需要・スマートフォン向けストレージ・データセンター向けエンタープライズSSDの成長と半導体サイクルリスクを徹底解説します。",body:`
H2: キオクシアとはどんな会社か

キオクシアホールディングス（証券コード：285A）は、東芝の半導体メモリ事業を分社化・売却した企業を前身とする、NAND型フラッシュメモリ専業の半導体メーカーです。2019年に社名を「東芝メモリ」から「キオクシア」に変更し、2024年12月に東京証券取引所プライム市場に再上場しました。

NAND型フラッシュメモリとは、電源を切ってもデータが消えない不揮発性の半導体記憶素子で、スマートフォン・タブレット・パソコンのSSD（ソリッドステートドライブ）・SDカード・USBメモリ・データセンター向けのエンタープライズSSDなど幅広い用途に使われます。「記憶する」ことに特化した半導体であり、デジタル社会のデータを保存する基盤インフラです。

H2: NAND市場での世界的ポジション

キオクシアはNAND型フラッシュメモリの市場で世界第2位（シェア約15〜20%）のポジションを持ちます。第1位は韓国サムスン電子（約30〜35%）で、以下SKハイニックス・マイクロン・ウエスタンデジタル（WD）が続きます。

WD（ウエスタンデジタル）とはNAND製造で長年の合弁関係にあり、三重県四日市市と岩手県北上市の最先端製造拠点を共同運営しています。このWDとの協力関係はコスト分担・技術開発での競争力を高めており、双方にとって重要な戦略的パートナーシップです。ただし2024〜2025年にWDとの合弁解消・再編の動きが一部で報じられており、今後の事業構造の変化に注目が必要です。

H2: フラッシュメモリの技術進化：3D NAND

NANDメモリの技術的な進化の方向は「3D NAND（三次元積層NAND）」の高層化です。従来の2D（平面的な）NANDから、セルを縦に積み重ねる3D NAND化によって同一面積でより多くのデータを記録できるようになります。

キオクシアは「BiCS FLASH（ビクスフラッシュ）」という独自の3D NAND技術を持ち、現在は積層数200層を超えた最先端の製品を開発・量産しています。積層数が増えるほど単位記憶容量あたりのコストが低下し、競争力が向上します。この技術競争でサムスン・SKハイニックスとの熾烈な開発競争が続いています。

H2: AI時代のSSD需要：エンタープライズ向け急成長

AIデータセンターの普及がNANDメモリ市場に新たな成長ドライバーをもたらしています。AIの学習・推論に使われる大規模GPUクラスターでは、膨大な訓練データ・モデルデータをリアルタイムに読み書きする高速・大容量のストレージが必要です。

データセンター向けの「エンタープライズSSD」は、コンシューマー向けより高い耐久性・速度・信頼性が求められる高付加価値製品で、単価もコンシューマー向けの数倍〜数十倍です。AIサーバーへのエンタープライズSSD搭載量は急増しており、キオクシアの収益ミックス改善に貢献しています。

H2: 半導体サイクルの影響

キオクシアの業績はNANDメモリの市況（価格）に強く依存します。NANDメモリはコモディティ（汎用品）としての性格が強く、供給過剰局面では価格が急落し業績が赤字に転落することがあります。2022〜2023年は業界全体の過剰生産・在庫増加でNAND価格が急落し、キオクシアも大幅な赤字を計上、上場計画を延期しました。

2024年以降は需要回復・AI向け需要増加でNAND価格が回復し、業績が黒字化。この回復を機に2024年12月に東証再上場を果たしました。今後もサイクル的な価格変動リスクは続きますが、AI需要という構造的な成長が谷を浅くすると期待されています。

H2: 東芝・ベインキャピタルとの資本関係

キオクシアの大株主にはベインキャピタル（米国系PEファンド、2018年の東芝メモリ買収を主導）・東芝（持分法適用関連会社として約40%保有）・WD（合弁パートナー）・ソフトバンクグループなどがいます。東芝は財務改善のためキオクシアの株式を徐々に売却する可能性があり、株式需給への影響が注目されます。

H2: 関連銘柄・競合・海外

直接の競合はサムスン電子（韓国・米ADR：SSNLF）・SKハイニックス（韓国）・マイクロン・テクノロジー（MU、NASDAQ）・ウエスタンデジタル（WDC、NASDAQ）です。製造装置・材料では東京エレクトロン（8035）・信越化学（4063）・JSR（4185）・レゾナック（4004、旧昭和電工マテリアルズ）がサプライヤーです。

H2: StockWaveJP編集部の見解

キオクシアは半導体テーマの中でも特に「NANDメモリ価格の動向」に業績・株価が連動する銘柄です。NANDスポット価格（DRAMexchange等で確認できる市況価格）の週次変化と半導体テーマのモメンタムを組み合わせることで、キオクシア株の短期動向をある程度先読みできます。

AI向けエンタープライズSSD需要の「構造的成長」とNAND市況の「サイクル変動」を分けて評価することが重要です。前者は長期ポジティブ、後者は短期リスク要因として、StockWaveJPのテーマヒートマップで「半導体テーマが全期間で強い状態」を確認できれば長期保有の正当性が高まると考えています。

H2: まとめと今後の展望

キオクシアはデジタル社会のデータ爆発・AI学習データの蓄積という「デジタルインフラの根幹」を支える半導体メーカーです。NAND市場第2位という世界的なポジション・3D NANDの技術競争力・AI向けエンタープライズSSDの成長が長期的な投資ストーリーを支えます。半導体サイクルのリスクを理解した上で、AI・クラウド・データ蓄積という構造的なテーマとの連動を長期視点で評価することが適切です。

H2: ウエスタンデジタルとの合弁と今後

キオクシアとウエスタンデジタル（WD）は三重県四日市市の「四日市工場」と岩手県北上市の「北上工場」を共同運営してきました。2024年以降、両社の合弁関係の見直し・再編の可能性が浮上しており、その行方がキオクシアの事業構造に影響を与える重要な変数です。合弁が解消された場合の投資コスト増・製造効率の変化・共同開発した技術の扱いなど、注視すべき課題が複数あります。

H2: NANDからSCM・ストレージクラスメモリへ

次世代のストレージ技術として「SCM（ストレージクラスメモリ）」が注目されています。NANDの高速性とDRAMの不揮発性を組み合わせた中間的な性能を持つメモリで、AI推論の高速化・データセンターの効率改善に貢献します。キオクシアを含む半導体メーカーが研究開発を進めており、商業化されれば新たな収益源となります。

H2: まとめ

キオクシアはNANDフラッシュメモリという「デジタル社会のデータ保管庫」を製造する世界第2位の専業メーカーです。AI時代のエンタープライズSSD需要という構造的成長とNANDサイクルのリスクを両面から理解した上で、半導体テーマのモメンタムを定期確認しながら投資判断することが重要です。

H2: ストレージの需要予測とAIの関係

IDC・ガートナーなどの調査会社はAI時代のデータ生成量急増を背景に、2030年までにストレージ（記憶装置）の総需要が現在の5〜10倍に増加すると予測しています。テキスト・画像・動画・音声というマルチモーダルなAIモデルの普及でデータ量は爆発的に増加しており、そのデータを保存するNANDの長期需要は構造的に拡大します。

H2: 国産半導体の重要性

政府はキオクシアなどの国内半導体メーカーを「経済安全保障上の重要企業」として位置づけ、設備投資への補助金（CHIPS法日本版）を拠出しています。キオクシアの四日市・北上工場への補助金は数百億円規模に達しており、半導体の国内製造能力維持が国家的な政策として支援されています。

H2: まとめ

キオクシアは日本の半導体産業の要として、国家的な支援を受けながら世界のNAND市場で第2位のポジションを維持しています。AI時代のデータ爆発という長期トレンドと国産半導体振興政策の双方を追い風に、2024年の再上場後の成長軌道を歩んでいます。

H2: 四日市・北上工場の最先端製造拠点

キオクシアの主要製造拠点は三重県四日市市（四日市工場）と岩手県北上市（北上工場）の2カ所です。四日市工場は1992年から稼働する日本最大のNAND工場群で、最先端の200層超3D NANDを量産しています。北上工場は2021年から稼働を開始した新鋭工場で、WD（ウエスタンデジタル）との合弁で運営されています。両工場合わせた生産能力は世界のNAND生産量の約15〜20%を占め、キオクシアの世界第2位というポジションを支えています。

H2: NANDの用途別市場

NANDメモリの主要用途は（1）スマートフォン・タブレットのストレージ（2）パソコン・ノートPCのSSD（3）企業向けサーバー・クラウドのエンタープライズSSD（4）SDカード・USBメモリ（5）自動車（EV・ADAS）の記録媒体に大別されます。AI時代に急成長しているのは（3）エンタープライズSSDで、AIサーバー一台あたりの搭載容量は通常のサーバーの数倍から数十倍に達します。このエンタープライズ向けは単価も高く、キオクシアの収益ミックス改善に大きく貢献しています。

H2: 2024年の東証再上場の経緯

キオクシアは2020年に東証上場を計画していましたが、当時の米中貿易摩擦や半導体市況の不透明感から上場を延期しました。その後のNAND市況悪化（2022〜2023年の価格急落期）でも上場を延期し、2024年の市況回復と黒字化を機に2024年12月に東証プライム市場に上場しました。上場時の時価総額は約8,000億円で、東証上場企業の中でも中型株に位置します。

H2: まとめ（詳細版）

キオクシアはNAND型フラッシュメモリという「デジタル社会のデータ保管庫」を製造する世界第2位のプレイヤーです。AI時代のエンタープライズSSD需要という構造的成長・国産半導体振興政策という政策的追い風・3D NANDの技術競争力という三つの強みが中長期の投資ストーリーを支えます。サイクル変動リスクを念頭に置きながら、半導体テーマのモメンタムと組み合わせた投資管理を実践してください。
`},{id:"nittobo-analysis",category:"個別銘柄",icon:"🧵",title:"日東紡績（3110）徹底解説：ガラス繊維世界4位・防音材・住宅建材で独自ポジションを築く素材メーカー",date:"2026/04/11",themes:["光通信","建築資材"],keywords:["日東紡績","3110","ガラス繊維","防音材","グラスウール","建材","医薬","情報通信"],summary:"日東紡績（3110）はガラス繊維（グラスウール）を中核とした素材メーカーで、防音・断熱建材・ガラスクロス・情報通信部品・医薬用途まで多角展開。国内断熱材市場での強固なポジションと、世界的なガラス繊維需要に支えられた成長ストーリーを徹底解説します。",body:`
H2: 日東紡績とはどんな会社か

日東紡績（証券コード：3110、通称「日東紡」）は1923年創業のガラス繊維・機能材料メーカーです。本社は東京都千代田区、売上高は約1,500億円規模（2024年度）の中堅素材メーカーです。「日東紡」というブランド名で断熱・防音材料として一般的に知名度がありますが、その事業は住宅建材にとどまらず、電子基板・フィルター・医薬・情報通信材料まで多岐にわたります。

主な事業セグメントは「ガラス繊維・グラスウール（断熱・防音材）事業」「特殊ガラス繊維（電子基板・産業用途）事業」「医薬・情報通信材料事業」などです。ガラス繊維の製造技術を核に、様々な応用分野へ展開する「素材の多角化戦略」が特徴です。

H2: グラスウール：断熱・防音の国内市場での強みとZEBへの追い風

グラスウール（ガラス繊維を綿状に加工した断熱・防音材）は日東紡の主力製品です。住宅の断熱材・防音材・産業用断熱材として広く使われており、国内市場で首位クラスのシェアを持ちます。

2050年カーボンニュートラルに向けた政策として、政府はZEB（ネット・ゼロ・エネルギー・ビルディング）・ZEH（ネット・ゼロ・エネルギー・ハウス）の普及を積極的に推進しています。断熱材は建物の省エネ性能を左右する最重要建材の一つで、断熱強化の義務化（2025年断熱等級の義務化）や断熱補助金の拡充が国内の断熱材需要を構造的に押し上げています。

また2024年以降に全国で急増しているデータセンターの建設でも、サーバールームの熱管理（断熱・防音）に大量のグラスウールが使われており、デジタルインフラ整備との連動需要も発生しています。

H2: 電子基板向けガラスクロス：半導体・AI需要との接点

日東紡の注目される成長分野が「電子基板向けガラスクロス（ガラス繊維の織物）」事業です。ガラスクロスはプリント配線板（PCB、電子回路基板）の基材として使われる重要材料で、ガラスクロスにエポキシ樹脂を含浸させたものがPCBの絶縁基板（FR-4等）となります。

AIサーバー・データセンター・5G基地局の需要増大に伴い、PCBの需要も急増しています。AI向けの高性能サーバーには通常より多くの多層PCBが使われており、ガラスクロスの需要も連動して拡大します。日東紡はガラスクロスの品質・均一性で高い評価を受けており、電子基板向け高付加価値品の販売拡大が収益改善に貢献しています。

H2: 医薬・情報通信材料事業

日東紡の独自性の高い事業として「医薬・情報通信材料事業」があります。酵素免疫測定（ELISA）キット・PCR試薬・遺伝子検査キットなどの医薬・診断用試薬を製造・販売しており、COVID-19パンデミック時には新型コロナウイルス検査キットの需要が急増して業績が大幅に改善しました。

情報通信材料では光ファイバーの接続に使われる「フェルール（光コネクターの精密部品）」を製造しており、データセンターの光通信インフラ拡大の恩恵を受けています。

H2: 財務状況と株主還元

日東紡は無借金に近い健全な財務体質で、豊富な自己資本を持ちます。PBR（株価純資産倍率）は長期間1倍前後で推移しており、東証のPBR改善要請を受けた株主還元強化（増配・自社株買い）が進んでいます。配当利回りは2〜4%台で、バリュー株として評価される局面が多い銘柄です。

H2: 関連銘柄・競合・海外

ガラス繊維・断熱材の競合は旭ファイバーグラス（AGC子会社）・ニチアス（5393）・マグ・イゾベール（サンゴバン子会社、非上場）などです。ガラスクロス分野では中国の台湾・硝子纖維（タイワン・グラス、海外）・日本のユニチカ（3103）が競合します。海外のガラス繊維大手では米国のOwens Corning（OC）・仏サンゴバン（SGO）・中国のTaijia Fiberglass（非上場）が世界市場をリードしています。医薬・診断試薬分野ではロシュ（スイス）・シーメンスヘルシニアース（独）が世界大手です。

H2: StockWaveJP編集部の見解

日東紡績は「鉄鋼・素材テーマ」の中で地味ながらも独自の価値を持つ銘柄として観察しています。断熱材・グラスウール事業は省エネ・ZEB政策の追い風で需要が構造的に増加しており、電子基板向けガラスクロスはAI・データセンター需要と連動する成長要素を持ちます。

StockWaveJPの鉄鋼・素材テーマのモメンタムが「転換↑」または「加速」となる局面では、大型の鉄鋼銘柄（日本製鉄等）が注目される中、日東紡のような中型素材銘柄にも遅れて資金が流入するパターンが見られます。また建設・インフラテーマの出来高急増との連動も観察されており、国土強靭化・住宅建設需要と断熱材需要の相関をStockWaveJPデータで確認することを推奨します。

H2: まとめと今後の展望

日東紡績はガラス繊維という特定の材料技術を核に、断熱建材・電子基板材料・医薬試薬という異なる成長分野に展開する独自のポジションを持つ素材メーカーです。省エネ建材需要・AI関連のガラスクロス需要・診断試薬という三つの成長軸が中長期的な業績を支えます。日経平均採用銘柄ではないため機関投資家の注目度は低めですが、その分割安なバリュエーションで放置されやすく、テーマの見直しによる再評価が期待できる銘柄です。

H2: 断熱強化義務化とZEH・ZEBへの追い風

2025年4月から住宅の断熱等性能等級4（断熱基準）への適合が全新築住宅に義務化されました。この法的義務化はグラスウール・ロックウール等の断熱材の需要を底上げする構造的な政策効果をもたらしています。さらに政府が推進するZEH（ネット・ゼロ・エネルギー・ハウス）・ZEB（同ビル）の普及は「高断熱性能材料への補助金拡充」と組み合わさり、高付加価値断熱材の市場を拡大させます。日東紡のグラスウールはこの義務化・補助金拡充の直接受益製品です。

H2: コーニングとの関係と競合

光ファイバー用プリフォーム（光ファイバーの原材料となる母材）の製造では、コーニング（米国・GLW）との技術協力関係の歴史があります。ガラス繊維という素材技術という観点では共通の基盤を持ちますが、最終製品・顧客・市場は大きく異なります。

H2: まとめ

日東紡績はガラス繊維という独自の素材技術を核に、断熱建材・電子基板材料・医薬試薬・光部品という複数の成長分野に展開する独自性の高い素材メーカーです。断熱義務化という政策的追い風・AI需要との接点（ガラスクロス・光部品）が複合することで、地味ながらも堅実な成長が続く投資対象として評価します。

H2: 防音・吸音材料の需要拡大

グラスウールは断熱性能だけでなく「防音・吸音性能」でも優れた素材です。都市部での騒音問題への意識の高まり・マンション・オフィスビルでの遮音規制強化・音楽スタジオ・映画館・会議室の防音需要が、グラスウールの防音・吸音用途での需要を拡大させています。データセンターのサーバー騒音対策にも防音材が使われており、AI・デジタル投資との連動需要も発生しています。

H2: PCB用ガラスクロスのグレードアップ

AIサーバー向けの高性能プリント基板は「低誘電率・低誘電正接（電気信号が伝わる速度・精度を高める特性）」という要求仕様が厳格化しています。日東紡は次世代の高周波対応ガラスクロス（NE glass等の特殊組成ガラス繊維を使用したクロス）の開発を進めており、5G・6G通信向けの高性能PCBへの採用拡大を目指しています。

H2: まとめ

日東紡績は断熱義務化という政策追い風・AIデータセンター向けガラスクロス需要・医薬試薬という三事業の複合成長が期待できる独自の素材メーカーです。中型株・内需系という地味な印象とは異なり、デジタルインフラ・建設インフラという現代の二大テーマに連動した事業を持つ銘柄として再評価の余地があります。

H2: カーボンニュートラルと断熱材の役割

建物の断熱性能向上は「ZEB（ネット・ゼロ・エネルギー・ビルディング）・ZEH（同ハウス）」の実現に向けた最も費用対効果の高い施策の一つです。断熱材を適切に施工することで冷暖房エネルギーの消費量を大幅に削減でき、CO2排出量の削減に直接貢献します。政府は2025年から新築住宅への断熱等性能等級4以上の義務化を施行しており、高性能断熱材への需要が構造的に高まっています。日東紡の「Magsilan（マグシラン）」などの高性能グラスウール製品は、この義務化・高断熱化のトレンドの直接受益製品です。

H2: ガラス繊維の特殊応用

日東紡は建材・電子基板用途に加え、産業用の特殊ガラス繊維製品も手掛けています。航空機・自動車の内装・防音材向けのガラス繊維不織布・フィルター媒体（工場排煙フィルター・空調フィルター）・農業用（農地のマルチシート）など多様な用途への展開が収益の多角化をもたらしています。

H2: 医薬・診断事業：ニッチな競争優位

日東紡のユニークな事業として「医薬・生化学製品」があります。ELISA（酵素結合免疫測定法）キット・抗体・精密検査試薬を医療機関・研究機関向けに供給しており、感染症診断・癌マーカー検査・アレルギー検査などに使われています。COVID-19パンデミック期には検査試薬の需要が急増し業績が大幅に改善しました。ニッチ市場ながら参入障壁が高く安定した収益が見込める事業です。

H2: まとめ（詳細版）

日東紡績は断熱建材・電子基板材料・医薬試薬・光部品という四つの異なる市場に展開するガラス繊維専業素材メーカーです。断熱義務化という政策追い風・AIガラスクロス需要という成長要素・医薬試薬というニッチ優位という三つの価値軸が複合することで、地味ながらも堅実な成長が続く投資対象として評価します。中型株・内需系という性質上、大型成長株が調整する局面でも比較的底堅い動きをする傾向がある銘柄です。
`},{id:"inpex-analysis",category:"個別銘柄",icon:"🛢️",title:"INPEX（1605）徹底解説：日本最大の石油・天然ガス開発会社の資源戦略と投資ポイント",date:"2026/04/11",themes:["石油","LNG","資源（水素・ヘリウム・水）"],keywords:["INPEX","1605","石油","LNG","天然ガス","オーストラリア","イクシス","資源","配当"],summary:"INPEX（1605）は日本最大の石油・天然ガス開発会社。オーストラリア・イクシスLNGを中核に世界20カ国以上で資源開発事業を展開。資源価格に連動する収益構造・高配当・エネルギー安全保障という観点で注目される企業を徹底解説します。",body:`
H2: INPEXとはどんな会社か

INPEX（証券コード：1605）は日本最大の石油・天然ガス開発会社（E&P：Exploration & Production）です。正式名称はINPEX Corporation、東京都港区に本社を置き、売上高は約1.5兆円（2024年度）、時価総額は2〜3兆円規模です。

INPEXは「油田・ガス田を探索・開発・生産し、石油・天然ガス（LNG）を販売する」という資源開発の川上に特化したビジネスモデルを持ちます。製油所・ガソリンスタンドを持つ石油元売り（ENEOSホールディングス等）とは異なり、あくまで地下資源の探索・生産が専門です。国際石油開発帝石ホールディングス（INPEX）として2004年設立（前身の国際石油開発と帝国石油の経営統合）、2006年東証上場です。

H2: イクシスLNGプロジェクト：中核資産

INPEXの最重要資産が「イクシス（Ichthys）LNGプロジェクト」です。オーストラリア北西部・ブラウズ海盆で開発されたこのプロジェクトはINPEXが62.245%（オペレーター）を保有する巨大なLNG（液化天然ガス）プロジェクトで、年間生産能力は約890万トンのLNG+約160万トンのLPGという大規模な生産規模を誇ります。

2018年から生産を開始したイクシスは日本のJERAをはじめとするアジア・欧州の電力会社・ガス会社への長期供給契約に基づいた安定収益を生み出しています。LNG生産量の大部分は日本・韓国・中国・台湾向けに出荷されており、アジアのエネルギー安全保障に直結した重要なインフラプロジェクトです。

H2: 世界20カ国以上の資源ポートフォリオ

INPEXはイクシス以外にも世界20カ国以上で多様な石油・ガス田の権益を保有しています。中東（アラブ首長国連邦のUMM LULU油田・アブダビ沿岸権益）・東南アジア（インドネシア・マレーシア・東ティモール）・カスピ海（アゼルバイジャンのACG油田・BTC石油パイプライン）・中央アジア（カザフスタン）・北米（米国・カナダ）などに分散した権益ポートフォリオを持ちます。

この地域分散は政情リスクや自然災害リスクを分散させ、特定地域への依存を避けるという資源開発企業としてのリスク管理戦略です。

H2: 資源価格との関係：収益構造の理解

INPEXの業績は原油価格・LNG価格に直接連動します。原油価格（WTIまたはブレント）が1ドル上昇するとINPEXの税後純利益が数十億円改善するという「原油感応度」があり、資源価格の動向が株価を大きく左右します。

ロシアのウクライナ侵攻（2022年）で原油・LNG価格が急騰した局面ではINPEXの業績・株価が急上昇しました。逆に原油価格が下落する局面（世界景気後退・石油増産）では業績・株価が圧迫されます。

LNGは原油リンク（油価連動）の長期契約と、スポット市場価格の双方で取引されており、インPEXの場合は長期契約比率が高いため、油価変動の影響を一定程度平滑化しています。

H2: 低炭素・水素戦略

脱炭素の潮流の中で、INPEXも「低炭素エネルギー・水素」への事業転換を進めています。CCS（二酸化炭素回収・貯留）技術の実証・再生可能エネルギー（洋上風力・太陽光）への参入・グリーン水素・アンモニアの製造・輸送インフラの開発に取り組んでいます。

2050年カーボンニュートラルに向けた事業転換として「LNGの低炭素化（CCS付きLNG）」「水素・アンモニアの製造・供給」という方向性を打ち出しており、エネルギー転換期でも生き残れる企業体制の構築を目指しています。

H2: 財務・配当・株主還元

INPEXは高い営業キャッシュフローを生み出す財務体質で、豊富な現金から積極的な株主還元を実施しています。配当は増配傾向が続いており、配当利回りは3〜5%台という高水準で、エネルギー安全保障という政策的な後押しもある「高配当・バリュー株」として機関投資家・個人投資家双方に支持されています。

H2: 関連銘柄・競合・海外

国内競合・関連企業はENEOSホールディングス（5020）・石油資源開発（1662）・三井石油開発（子会社）などです。国際的な競合はSaipem（伊）・Equinor（ノルウェー）・Shell（英蘭）・BP（英）・TotalEnergies（仏）・ExxonMobil（米）・Chevron（米）などのメジャー石油会社です。LNG事業では豪州のWoodside Energy・カタールエナジー（カタール国営）・マレーシアのPetronas（非上場）が主要な競合・協力関係にあります。

H2: StockWaveJP編集部の見解

INPEXはレアアース・資源テーマの中で「最も明確に原油価格と連動する日本株」として観察しています。WTI原油先物価格の週次変化とINPEXの株価・出来高の相関は非常に強く、原油価格が急上昇するタイミング（中東情勢悪化・OPEC減産決定）でINPEXの出来高が急増するパターンが規則的に現れます。

StockWaveJPで資源・エネルギーテーマのモメンタムが「転換↑」に転じたとき、WTI原油価格の直近の動向を確認することで、INPEXへの投資タイミングの精度を高めることができます。また高配当（利回り3〜5%）というインカム面での魅力から、株価下落局面でも配当利回りが支えとなりやすい特性も観察されています。

H2: まとめと今後の展望

INPEXはイクシスLNGという世界トップクラスの資源権益を中核に、日本のエネルギー安全保障を支える国策的な役割を担う石油・ガス開発企業です。原油・LNG価格という外部要因に業績が左右されますが、長期LNG供給契約による安定収益・積極的な株主還元・低炭素戦略への転換が中長期の投資価値を支えます。

H2: 水素・アンモニアのサプライチェーン構築

INPEXは2050年カーボンニュートラルに向けた事業転換として、「水素・アンモニア」の製造・輸送・販売のサプライチェーン構築を進めています。オーストラリアでの水電解によるグリーン水素製造・日本への海上輸送という「グリーン水素サプライチェーン」の実証プロジェクトが進行中です。アンモニアは水素を安定した状態で輸送できる「水素キャリア」として注目されており、発電所での燃料アンモニア混焼・アンモニア専焼の実現に向けた取り組みも進んでいます。

H2: CCS（炭素回収・貯留）事業

INPEXはCCS（Carbon Capture and Storage）技術の商業化にも積極的に取り組んでいます。石油・ガスの生産工程で排出されるCO2を地中に注入・貯留することで、LNG生産の低炭素化（「低炭素LNG」「CCS付きLNG」）を実現しようとしています。特にオーストラリアのイクシスプロジェクト周辺での大規模CCSサイトの開発が進んでいます。

H2: まとめ

INPEXは日本最大の石油・ガス開発会社として、エネルギー安全保障の根幹を担いながら低炭素・水素という次世代エネルギーへの転換を進めています。原油・LNG価格の動向という短期変数と、水素・CCSという長期成長戦略を組み合わせた複合的な評価が必要な企業です。

H2: イクシスLNGの詳細と日本のエネルギー安全保障

イクシスプロジェクトはオーストラリア北西部・ブラウズ海盆のジャオ複合油ガス田を開発するプロジェクトです。水深約250mの海底に存在するガス・コンデンセート田から採取した天然ガスを洋上処理施設（FPSO）で一次処理し、パイプラインで陸上のLNGプラントに送りLNGに液化します。年間LNG生産能力は約890万トンと日本のLNG輸入量の約10%に相当する大規模案件で、日本のエネルギー安全保障の観点から国策的な重要性を持ちます。

H2: カーボンニュートラルとINPEXの対応

LNG（天然ガス）は石炭・石油に比べてCO2排出量が少なく「化石燃料の中では最もクリーン」という位置づけです。しかし脱炭素の長期トレンドの中ではLNGも将来的な需要縮小が懸念されます。INPEXはこれに対応するため「低炭素LNG（CCS付きLNG：製造過程のCO2を地中に封じ込めたLNG）」「グリーン水素（再生可能エネルギーで製造した水素）」「アンモニア（水素キャリア・燃料アンモニア）」への事業転換を進めています。2050年カーボンニュートラルに向けた具体的なロードマップを公表しており、「脱炭素時代にも生き残れるエネルギー企業」としての位置づけを確立する戦略です。

H2: 原油感応度と業績の関係

INPEXの業績は原油・LNG価格に強く連動します。WTI原油価格が1バレル上昇するとINPEXの営業利益が数十億円改善するという「原油感応度」が業績予測の基礎となります。2022年のロシアのウクライナ侵攻による原油・LNG価格急騰時には業績が急拡大し、株価が大幅上昇しました。投資家はWTI原油・Henry Hub天然ガス・アジアのLNGスポット価格（JKM）の動向を定期的に確認することで、INPEXの業績方向性を先読みできます。

H2: まとめ（詳細版）

INPEXは日本最大の石油・ガス開発会社としてエネルギー安全保障の根幹を担いながら、水素・アンモニア・CCSという低炭素事業への転換を進めています。原油価格という外部変数に業績が左右されるリスクはありますが、長期LNG供給契約による安定収益・世界20カ国以上に分散した権益ポートフォリオ・積極的な株主還元という三つの価値が中長期の投資判断を支えます。
`},{id:"skyperfect-analysis",category:"個別銘柄",icon:"📡",title:"スカパーJSATホールディングス（9412）徹底解説：衛星通信・放送・宇宙ビジネスの複合企業",date:"2026/04/11",themes:["宇宙・衛星","通信"],keywords:["スカパーJSAT","9412","衛星通信","宇宙","BS","CS放送","SSA","デブリ","防衛衛星"],summary:"スカパーJSATホールディングス（9412）は日本唯一の商業衛星オペレーター。スカパー！放送サービス・衛星通信（法人向け・海外向け）・宇宙状況把握（SSA）・防衛衛星通信まで幅広い事業を展開。宇宙テーマの中核企業として注目される企業を徹底解説します。",body:`
H2: スカパーJSATとはどんな会社か

スカパーJSATホールディングス（証券コード：9412）は、スカパー！の放送サービスで知られる日本最大の衛星放送・衛星通信会社です。スカパー（旧：パーフェクTV）とJSAT（日本サテライトシステムズ）が2007年に経営統合して誕生したホールディングス企業で、売上高は約900億円（2024年度）、東証プライム上場です。

「衛星を保有・運用する日本唯一の商業衛星オペレーター」という独自のポジションを持ちます。自社衛星（複数のCS・BS衛星を運用）からの放送・通信サービスの提供と、衛星軌道・周波数という希少な「宇宙インフラ」の保有が最大の資産です。

H2: スカパー！放送：熟成した安定収益事業

スカパー！は映画・スポーツ・音楽・ドキュメンタリー・アニメなど多様なジャンルの専門チャンネルを100チャンネル超提供するCSデジタル放送です。月額サブスクリプション型のビジネスモデルで、契約者数は約250万件（2024年時点）。Netflixなどのストリーミングサービスの台頭で契約者数は緩やかに減少傾向にありますが、スポーツ中継（プロ野球・サッカー・ゴルフ等）という代替困難なコンテンツが解約率を抑制しています。

放送事業は成熟フェーズにありますが、依然として高い利益率を維持しており、安定したキャッシュフローをもたらしています。この安定収益が「衛星通信」「宇宙事業」という成長分野への投資の原資となっています。

H2: 衛星通信（法人向け・海外向け）

スカパーJSATの成長事業の中核が「衛星通信事業」です。自社の静止衛星（現在15機程度を運用）を使って、船舶・航空機・遠隔地・海外の企業・政府機関に通信サービスを提供しています。

法人向けでは石油・ガス・鉱山の採掘現場（ケーブルが引けない場所での通信）・海上のタンカー・コンテナ船・漁船へのブロードバンド通信（VSAT）・災害時の緊急通信バックアップなどの用途があります。特に地上通信インフラが未整備の東南アジア・太平洋島嶼国・アフリカ向けの衛星通信は安定した需要があります。

近年は「HTS（高スループット衛星）」という次世代衛星通信技術への移行も進めており、従来より大容量・低コストの衛星通信サービスの提供を目指しています。

H2: 宇宙状況把握（SSA）と防衛事業

スカパーJSATが積極投資している成長分野が「宇宙状況把握（SSA：Space Situational Awareness）」と防衛関連宇宙事業です。宇宙空間にはスペースデブリ（廃棄された衛星・ロケット残骸）が数万個以上存在しており、現役衛星への衝突リスクが高まっています。

スカパーJSATは独自の光学・電波センサーを使った宇宙物体の観測・追跡技術を持ち、防衛省・内閣府のSSAシステムへの参画を進めています。防衛省との間で衛星通信サービスの提供契約も締結しており、防衛宇宙という成長市場での存在感を高めています。

2022年のロシアのウクライナ侵攻でも、ウクライナが商業衛星（Starlink等）を軍事通信に活用したことで「衛星通信の安全保障上の重要性」が世界的に認識されました。スカパーJSATの防衛衛星事業はこの流れを追い風に受けています。

H2: 低軌道衛星コンステレーションとの競争

衛星通信市場で最大の構造変化が「低軌道衛星コンステレーション」の台頭です。SpaceXのStarlink（5,000機超の衛星で超高速・低遅延の衛星ブロードバンドを提供）・AmazonのProject Kuiperなどが大規模な低軌道衛星網を構築しており、従来の静止衛星通信（スカパーJSATが主体）に対する強力な競合となっています。

Starlinkはすでに日本でも個人・法人向けに提供を開始しており、スカパーJSATの一部の法人顧客にとって代替選択肢となっています。スカパーJSATはこの競争に対し「静止衛星の高安定性・サービスエリアの広さ・法人向けSLAの優位性」で差別化しつつ、低軌道衛星事業者との協力関係も模索しています。

H2: 財務状況と株主還元

スカパーJSATは安定したキャッシュフロー創出能力を持ち、衛星資産という多額の固定資産（減価償却が年間数百億円）の計上にもかかわらず、安定した配当を維持しています。配当利回りは3〜4%台と高水準です。PBR・PERともに割安な水準に放置されることが多く、「地味なバリュー株」としての側面があります。

H2: 関連銘柄・競合・海外

国内の宇宙・衛星関連企業ではAstroscale（186A）・QPS研究所（5595）・テラドローン（278A）・三菱電機（6503、防衛衛星製造）・NEC（6701、宇宙システム）が関連します。国際的な衛星オペレーターではSES（ルクセンブルク）・Eutelsat（仏）・Intelsat（米）・Viasat（米）が競合です。低軌道コンステレーションではSpaceX（Starlink、非上場）・Amazon（Kuiper、非上場）が最大の競合です。

H2: StockWaveJP編集部の見解

スカパーJSATは宇宙・衛星テーマの中で「唯一の東証上場の商業衛星オペレーター」という独自のポジションを持ちます。防衛省のSSA参画・衛星通信の防衛利用拡大という防衛予算増額の恩恵も受けるため、StockWaveJPで防衛・宇宙テーマのモメンタムが強くなる局面では注目銘柄として観察しています。

ただし放送事業の緩やかな縮小・Starlinkとの競争という逆風要因もあり、長期成長シナリオの実現可能性を定期的に確認することが重要です。防衛衛星関連の大型受注・SSA事業の政府契約などのカタリストが出るタイミングと出来高急増の照合が有効な投資管理手法です。

H2: まとめと今後の展望

スカパーJSATは安定した放送収益を基盤に、衛星通信・宇宙状況把握・防衛宇宙という成長領域への転換を進める企業です。放送事業の縮小というリスクを防衛・宇宙事業の成長で補えるかどうかが長期的な投資価値の鍵となります。宇宙の安全保障上の重要性が高まる2030年代に向け、独自のインフラ（衛星軌道・周波数）を持つ企業としての評価向上が期待されます。

H2: 5G・衛星融合（NTN）という新技術

通信の次世代技術として「NTN（Non-Terrestrial Network：非地上系ネットワーク）」が注目されています。NTNとは衛星・高高度プラットフォーム（HAPS）・無人航空機などを使って地上通信インフラを補完・拡張する技術で、離島・山間部・洋上の通信カバレッジを実現します。スカパーJSATの静止衛星ネットワークは5G・NTNの基盤インフラとして活用される可能性があり、通信事業者との連携が進んでいます。

H2: 軍民融合：防衛衛星通信の需要増

日本の防衛力強化政策（防衛費GDP比2%目標）に伴い、自衛隊の衛星通信能力の強化が進んでいます。スカパーJSATは防衛省との衛星通信サービス提供契約を持ち、有事の際の軍事通信インフラとしての役割が期待されています。政府・自衛隊向けの長期安定契約は安定収益源として評価されています。

H2: まとめ

スカパーJSATは放送から衛星通信・宇宙安全保障という事業転換を進める企業で、宇宙・衛星テーマと通信テーマの双方に関連する独自のポジションを持ちます。Starlinkとの競争という逆風がありながらも、防衛衛星・SSA・NTNという新たな成長領域への展開が中長期の投資ストーリーを支えます。

H2: 衛星の軌道位置という希少な資産

スカパーJSATが保有・運用する静止衛星の「軌道位置（赤道上空36,000kmの特定の経度）」は国際電気通信連合（ITU）が管理する希少な「宇宙インフラ資産」です。全世界で利用できる静止衛星の軌道スロット数には物理的な限界があり、一度確保した軌道スロットは継続使用の権利が保証されます。競合他社が新規参入するためにはITUへの申請から実際の衛星打ち上げまでに多大な時間・コストが必要であり、スカパーJSATの軌道スロット保有は参入障壁として機能しています。

H2: デジタル放送の変化と対応

スカパー！のCS放送はNetflixやAmazon Primeなどのストリーミングサービスの台頭で契約者数が緩やかに減少していますが、スポーツコンテンツ（プロ野球・Jリーグ・欧州サッカー・ゴルフ・格闘技）という「ライブ・リニア放送」の価値は依然として高く、完全なストリーミング代替は困難です。スカパーJSATはスポーツライツの確保・4K HDR高品質放送・スポーツファン向けのニッチ特化で差別化を維持しています。

H2: HAPS（高高度プラットフォーム局）との連携

HAPS（High Altitude Platform Stations：高高度に滞留する無人航空機・気球）は地上20km付近から通信サービスを提供する技術で、衛星通信と地上通信の中間的なカバレッジを実現します。スカパーJSATは静止衛星・低軌道衛星・HAPSを組み合わせた「多層的な空間通信インフラ」の構築を視野に入れており、通信カバレッジの完全化を目指す長期戦略を描いています。

H2: まとめ（詳細版）

スカパーJSATは静止衛星という希少な資産を保有する日本唯一の商業衛星オペレーターとして、放送・通信・宇宙安全保障という三つの事業軸で存在感を持ちます。Starlinkとの競争という逆風の中でも、防衛衛星通信・SSA・法人向け衛星通信という独自の成長領域への展開が中長期の投資ストーリーを支えます。
`},{id:"axelspace-analysis",category:"個別銘柄",icon:"🛸",title:"アクセルスペース（186A除外・宇宙ベンチャー全体解説）：小型衛星と宇宙データビジネスの最前線",date:"2026/04/11",themes:["宇宙・衛星","ドローン"],keywords:["アクセルスペース","小型衛星","宇宙ベンチャー","衛星データ","SAR","リモートセンシング","宇宙テーマ"],summary:"アクセルスペースをはじめとする日本の宇宙ベンチャー群を徹底解説。小型衛星コンステレーション・衛星データビジネス・宇宙状況把握の最前線企業群の事業内容・投資ポイント・リスクまでわかりやすく解説します。",body:`
H2: アクセルスペースとはどんな会社か

アクセルスペースホールディングス（証券コード：166A、東証グロース上場）は2008年創業の宇宙スタートアップです。「誰もが宇宙を利用できる世界を実現する（Space for Everyone）」をビジョンに掲げ、小型地球観測衛星の開発・製造・運用とその衛星データを活用したビジネスサービスを提供しています。本社は東京都中央区、東京大学の衛星工学研究室を起源とする研究者・エンジニア集団が創業した「ディープテック系スタートアップ」です。

H2: 小型衛星コンステレーション「GRUS」

アクセルスペースのコア事業は独自開発の小型地球観測衛星「GRUS（グルス）」を複数機打ち上げて形成する「コンステレーション（衛星群）」の運営です。コンステレーションを形成することで地球上のほぼすべての地点を頻繁（1日に複数回）に観測できるようになり、農業・林業・災害対応・インフラ管理・海洋監視・金融（農産物の収穫量予測等）など多様な用途に衛星データを提供できます。

GRUSは「光学カメラ（可視光・近赤外線）」を搭載した地球観測衛星で、地表の様子を高解像度で撮影します。現在（2026年）時点で数機を軌道上で運用しており、コンステレーションの規模拡大を続けています。

H2: 衛星データビジネスの成長性

アクセルスペースのビジネスモデルは「衛星を製造・打ち上げ・運用する（ハードウェア）」だけでなく「衛星データを解析・加工してビジネス価値を提供する（データサービス）」という二段階の収益構造を目指しています。

衛星データの活用例として、農業分野では作物の生育状況・収穫量の予測（AIと組み合わせた精密農業）、金融分野では駐車場の混雑度から小売業の業績を事前に予測する「オルタナティブデータ」の提供、環境分野では森林の違法伐採・海洋の不法漁業の監視などがあります。衛星データの潜在的な応用範囲は広大であり、データサービスの単価・顧客数の成長が将来的な収益拡大のカギです。

H2: 日本の宇宙ベンチャー企業群

アクセルスペース以外の日本の注目宇宙ベンチャーも合わせて解説します。

QPS研究所（5595）：小型SAR（合成開口レーダー）衛星のコンステレーション構築を進める福岡の宇宙ベンチャーです。SARは光学カメラと異なり夜間・雲の上からでも地表を観測できる特性を持ちます。防衛省・JAXA・民間企業との契約実績があります。東証グロース上場（2023年）。

Astroscale（186A）：スペースデブリ（宇宙ゴミ）の除去を世界で初めて事業化した宇宙スタートアップです。ESA（欧州宇宙機関）・JAXAとのデブリ除去実証プロジェクトを進めており、「宇宙環境の持続可能性」という独自のテーマで世界的な注目を集めています。東証グロース上場（2024年）。

インターステラテクノロジズ（非上場）：北海道大樹町拠点の小型ロケット開発企業。「MOMO」ロケットの打ち上げ成功実績を積み上げ、軌道投入ロケット「ZERO」の開発を進めています。堀江貴文氏が支援する企業として知名度があります。

H2: 宇宙ベンチャーへの投資のポイントとリスク

宇宙ベンチャーへの投資は「高リスク・高リターン」の典型的なケースです。

主なリスクとして、まず打ち上げリスク（ロケット打ち上げ失敗・衛星の機能不全）は技術的なリスクとして常に存在します。次に長い黒字化までの道のり：衛星製造・打ち上げには多額の先行投資が必要で、衛星データの顧客獲得・価格形成に時間がかかります。多くの宇宙ベンチャーは上場時点で赤字が続いており、黒字化までの資金調達が課題です。また国際競合のSpaceX（Starlink）・Planet Labs（米国、地球観測）・Spire Global（米国）などの資金力・技術力のある海外勢との競争も激しいです。

H2: 政府の宇宙産業支援：宇宙戦略基金

宇宙ベンチャーにとっての最大の追い風が政府の「宇宙戦略基金」です。2023年に設立された1兆円規模の基金がJAXAを通じてアクセルスペース・QPS研究所・Astroscaleなどの企業に助成金・開発委託という形で支援しています。基金からの採択は「事業継続の資金的保証」として投資家から評価されており、採択発表のタイミングで当該銘柄の株価・出来高が急増するパターンが見られます。

H2: 関連銘柄・海外比較

海外の地球観測衛星企業ではPlanet Labs（PL、NYSE）・Satellogic（SATL、NASDAQ）・Satellic（欧州）が上場企業として比較対象になります。SpaceXのStarlink（非上場）・Amazon Kuiper（非上場）は低軌道コンステレーションで宇宙産業全体に影響を与えています。国内の宇宙・防衛関連大手では三菱電機（6503）・NEC（6701）・IHI（7013）・川崎重工業（7012）が防衛衛星・ロケットエンジン分野で参画しています。

H2: StockWaveJP編集部の見解

宇宙・衛星テーマは宇宙戦略基金の採択発表・H3ロケットの打ち上げ成功・防衛省の宇宙関連受注などのカタリストが出るたびにテーマ全体の出来高が急増することを繰り返し観察しています。

アクセルスペース・QPS研究所・Astroscaleのような小型宇宙ベンチャーは「夢はあるが黒字化に時間がかかる」という特性から、グロース株市場全体のリスクオン・オフに強く連動します。StockWaveJPの宇宙・衛星テーマのモメンタムが「加速」となる局面を確認してから少額でエントリーし、「失速」に転じたら利益確定するというモメンタム投資の手法が適しています。

H2: まとめと今後の展望

アクセルスペースに代表される日本の宇宙ベンチャー群は、政府の1兆円規模の支援を受けながら小型衛星・衛星データ・デブリ除去という独自の市場開拓を進めています。黒字化・商業化の実現には時間がかかりますが、宇宙産業が本格的に「産業化」する2030年代に向けて、今の先行投資期間に日本の宇宙産業のエコシステムを作る重要な段階にあります。

H2: 衛星データの実際の活用事例

衛星データのビジネス活用は急速に現実化しています。農業分野では「ほ場モニタリング（農地の生育状況を定期撮影してAI解析）」が保険会社・農協・農業法人に採用されています。資産運用では「駐車場の混雑度から小売チェーンの売上を予測するオルタナティブデータ」としてヘッジファンド・機関投資家が利用しています。環境・ESGでは「衛星画像による企業サプライチェーンの森林破壊監視」が欧米の機関投資家のESG評価に活用されています。

H2: 宇宙ベンチャー投資の心構え

宇宙ベンチャー株への投資においては「技術の実現可能性だけでなく事業化・収益化の道筋の評価」が重要です。打ち上げ成功・実証成功という「技術マイルストーン」の達成は株価のカタリストになりますが、「その先の商業収益がどれだけ積み上がるか」という事業化フェーズの評価が長期的な株価を決定します。宇宙戦略基金からの採択・主要顧客との商業契約・売上・損益の改善トレンドという三つを継続的に確認することが宇宙ベンチャー投資の基本です。

H2: まとめ

アクセルスペースをはじめとする日本の宇宙ベンチャー群は政府の宇宙戦略基金という追い風を受けながら、衛星製造・衛星データ・デブリ除去・ロケット開発という多様な宇宙ビジネスの商業化を目指しています。宇宙産業が本格的に「普通の産業」として確立されていく2030年代に向けて、今の投資は「宇宙産業の黎明期への参加」という位置づけで評価することが適切です。

H2: 宇宙スタートアップの資金調達と成長フェーズ

アクセルスペース・Astroscale・QPS研究所など日本の宇宙スタートアップは「先行投資フェーズ（衛星製造・打ち上げ・実証）」から「商業化フェーズ（データサービス収益・製造受託収益の積み上げ）」への移行を目指しています。多くのスタートアップはまだ赤字が続いており、投資判断においては「売上・収益の改善トレンド」「宇宙戦略基金からの採択状況」「主要顧客との長期契約獲得」という三つの事業化指標を重視することが重要です。

H2: 小型衛星の技術革新

従来の大型衛星（重さ数百kg〜数トン）に対し、アクセルスペースが手掛けるような小型衛星（数十kg程度）は「COTS（Commercial Off-The-Shelf：民生用既製部品の活用）」によるコスト削減・短い開発期間・SpaceXのFalcon 9などのライドシェア打ち上げ（低コスト）という特性を持ちます。小型衛星のコスト低下により、かつては政府・大企業しか持てなかった衛星を民間スタートアップが開発・運用できる時代になっています。

H2: 衛星データの商業価値と市場規模

衛星データ市場は2030年に世界全体で数兆円規模に成長するという予測があります。衛星データの活用が進む農業・保険（自然災害の被害評価）・不動産（都市変化のモニタリング）・エネルギー（パイプラインの異常検知）・金融（オルタナティブデータ）などの市場が拡大することで、衛星データを提供する企業の収益機会が広がります。アクセルスペースはこの市場拡大の波に乗る位置にありますが、商業化・収益化の実現には時間がかかる見通しです。

H2: まとめ（詳細版）

日本の宇宙ベンチャー群（アクセルスペース・Astroscale・QPS研究所・インターステラテクノロジズ）は政府の宇宙戦略基金（1兆円超）という強力な後押しを受けながら、衛星製造・衛星データ・デブリ除去・ロケット開発という多様な宇宙ビジネスを商業化しようとしています。黒字化までに時間がかかるハイリスク投資ですが、宇宙産業が本格化する2030年代への長期的な視点での参加として意義があります。
`},{id:"sogo-shosha-analysis",category:"個別銘柄",icon:"🏢",title:"総合商社5社完全解説：三菱商事・三井物産・伊藤忠・住友商事・丸紅の投資比較",date:"2026/04/11",themes:["バフェット銘柄","レアアース・資源","LNG"],keywords:["総合商社","三菱商事","三井物産","伊藤忠","住友商事","丸紅","バフェット","配当","資源"],summary:"日本株の「バフェット銘柄」として世界的に注目される総合商社5社（三菱商事・三井物産・伊藤忠商事・住友商事・丸紅）を徹底比較解説。各社の強み・事業ポートフォリオ・配当・PBRの違いと投資ポイントを詳しく解説します。",body:`
H2: 総合商社とはどんなビジネスモデルか

総合商社とは商品・原材料・製品の売買仲介（トレーディング）を起源に、現在は資源開発・インフラ・食品・金融・リテール・ITなど多様な産業に投資・経営参加する日本独自の「複合投資会社」です。欧米には同様の企業形態は存在せず、日本のビジネス文化が生んだ独自の企業モデルとして「Sogo Shosha（総合商社）」として世界で認知されています。

収益の柱は「持分法利益（投資先企業からの利益分配）」「商品・原材料の売買差益（トレーディング）」「サービス手数料」の三種類です。近年は資源（石炭・LNG・銅・鉄鉱石）の権益投資から得る持分法利益が収益の大部分を占める状況になっています。

H2: バフェット効果と外国人投資家の再評価

2020年8月、ウォーレン・バフェット率いるバークシャー・ハサウェイが日本の総合商社5社の株式を各社5%程度取得したと発表し、日本株市場と世界の投資家に衝撃を与えました。バフェットは「商社はバークシャーに似ている」「割安だと判断した」とコメントし、2023年の来日時には追加購入の意欲を示しました。

バフェットの投資以降、外国人機関投資家も商社株を再評価し始め、2024年までに商社5社の株価は軒並み2〜4倍に上昇しました。バフェットが指摘した「割安性（低PBR）・高配当・資源ポートフォリオ」という評価軸が世界の投資家に共有されたことで、商社株の国際的な認知度が飛躍的に高まりました。

H2: 三菱商事（8058）：最大の総合商社

三菱商事は商社5社の中で最大規模（連結純利益約1兆円前後）を誇り、三菱グループの中核企業です。エネルギー（LNG・石炭・原油）・金属（銅・鉄鉱石・アルミ）・機械・化学品・食品・産業インフラ・新産業（EV・デジタル）という幅広い事業ポートフォリオを持ちます。

強みは「スケールの大きさ」と「グループ企業との連携」です。ローソン（コンビニ）・三菱自動車・三菱UFJ・三菱電機など三菱グループ各社との取引・出資関係が安定した収益基盤を形成しています。配当は増配傾向で配当利回りは3〜4%台。PBR1倍前後で推移しており、バリュー×高配当×成長の三要素を兼ね備えます。

H2: 三井物産（8031）：資源に強い商社

三井物産は資源（鉄鉱石・石炭・LNG・銅・金）への集中度が商社5社の中で最も高く、資源価格の恩恵を最も受けやすい事業構造です。ブラジルのバーレ社（世界最大の鉄鉱石メーカー）への持分・オーストラリアのLNG権益・チリの銅鉱山・ペルーの銅・亜鉛鉱山など、世界各地の大型資源権益を保有しています。

資源価格が高い局面（原油高・鉄鉱石高）では商社5社の中で最大の利益改善効果を得られる反面、資源価格低迷時の業績悪化幅も相対的に大きいという特性があります。エネルギー転換（LNG→水素・アンモニア）の時代に向けた戦略転換が中長期の課題です。

H2: 伊藤忠商事（8001）：非資源で高ROE・高評価

伊藤忠商事は商社5社の中で「非資源ビジネスへの傾斜度が最も高い」という差別化戦略を採っています。ファミリーマート（コンビニ）・ユニー（スーパー）・CTC（ITサービス）・ドール（農産物）・プリマハム（食品）など、消費者に近いリテール・食品・ITサービス分野での収益比率が高いため、資源価格の影響を受けにくい安定した収益が特徴です。

岡藤正広前会長（現相談役）のもとで「商社は下請けではなく経営者集団」という文化を醸成し、投資先企業の経営に積極的に関与するハンズオン型の経営スタイルを確立しました。ROEは商社5社の中でも高水準を維持しており、日本企業の資本効率改善のロールモデルとしても評価されています。

H2: 住友商事（8053）：インフラ・環境に特色

住友商事は金属資源（ニッケル・銅・鉛亜鉛）・電力・インフラ・トランスポーテーション&コンストラクション・環境・生活関連・ICTという7セグメントで事業を展開しています。東南アジアでのインフラ開発（フィリピン・インドネシアでの電力・交通）・アフリカでの農業・食品事業など、フロンティア地域への進出に積極的です。

電力ビジネス（再生可能エネルギー発電所の開発・運営）では国内外での実績が積み上がっており、エネルギー転換時代の成長事業として期待されています。ニッケル事業（EVバッテリー材料）ではアンバトビー（マダガスカルのニッケル鉱山）への大型投資の成否が業績の変動要因となっています。

H2: 丸紅（8002）：農業・電力・水事業に特徴

丸紅は「農業・食料（穀物・肥料・農薬）」「電力（再生可能エネルギー）」「水（上下水道の運営）」という他の商社との差別化分野で独自のポジションを確立しています。米国最大の穀物輸送会社Gavilon（買収）・チリの銅鉱山（Los Pelambres権益）・アンモニア事業など、食料安全保障・エネルギー転換という時代のニーズに沿った事業ポートフォリオが特徴です。

電力事業では発電所（太陽光・風力・天然ガス）の開発・所有・運営（IPP）で世界的な実績があり、再生可能エネルギーの普及という長期トレンドの恩恵を受ける立場にあります。

H2: 5社の比較：どれに投資すべきか

5社を比較すると以下の傾向があります。「資源価格上昇局面に最大の恩恵」を求めるなら三井物産。「安定成長・高ROE・非資源」を重視するなら伊藤忠。「規模と安定性のバランス」なら三菱商事。「インフラ・再エネの長期成長」なら住友商事か丸紅。PBR・配当利回りは5社間で大きな差はなく、事業ポートフォリオの差異と連動する資源・産業によって判断することが適切です。

H2: 関連銘柄・海外比較

海外の商社・複合投資会社では英Jardine Matheson（香港）・韓国の大宇（現ポスコインターナショナル）が類似の事業形態を持ちます。純粋なコモディティトレーダーではグレンコア（スイス）・Vitol（非上場）・トラフィグラ（非上場）が世界大手です。資源メジャーのBHP（豪）・Rio Tinto（英豪）・Anglo American（英）は商社の投資先企業として関わることもあります。

H2: StockWaveJP編集部の見解

総合商社5社は「バフェット銘柄」としての安定した買い需要・高配当による個人投資家の支持・資源価格連動という三つの力が重なる際に最も強い上昇を見せます。StockWaveJPのレアアース・資源テーマやバフェット銘柄テーマのモメンタムが「加速」となっているとき、商社株全体への資金流入が増加することを繰り返し確認しています。

5社の中でも特定の資源価格の上昇局面では対応する商社への資金集中が起きることがあります（例：LNG価格上昇時に三菱商事・三井物産、銅価格上昇時に三井物産・住友商事）。テーマ別詳細でこれらの銘柄の相対パフォーマンスを確認することで、どの商社に資金が集まっているかを把握できます。

H2: まとめと今後の展望

総合商社5社はバフェットの「割安・高配当・多角化されたビジネスポートフォリオ」という評価に加え、資源安全保障・食料安全保障・エネルギー転換という現代の最重要テーマを体現する企業群です。PBRの継続改善・株主還元強化・非資源成長事業の拡大という三つの価値創造要素が重なる中、中長期にわたって日本株市場を代表する投資対象であり続けると評価しています。

H2: 商社の次の10年：脱炭素・デジタル・フロンティア

総合商社の次の10年の成長テーマは「脱炭素（再エネ・水素・アンモニア）」「デジタル（DX支援・データビジネス）」「フロンティア地域（アフリカ・インド・中東の新興国）」の三つです。三菱商事は再エネ（洋上風力・太陽光）・伊藤忠は自動車・消費者サービスのデジタル化・住友商事はインフラ×デジタルの融合・丸紅はアンモニア・電力という方向性が特徴的です。

H2: 商社5社の比較投資データ

（注：以下は2024〜2025年時点の参考値。変動します）配当利回りは各社3〜5%台。PBRは各社0.8〜1.5倍程度。ROEは伊藤忠・三菱商事が高め（15〜20%）、住友・丸紅がやや低め（10〜15%）という傾向があります。時価総額は三菱商事が最大（8〜10兆円）、丸紅が最小（2〜3兆円）という順序で、規模に応じたリスク・リターン特性があります。

H2: まとめ

総合商社5社は「割安×高配当×資源ポートフォリオ×脱炭素転換」という日本株の中でも稀有な投資ストーリーを持つ企業群です。バフェットが発掘した「日本のビジネスモデルの真の価値」が世界的に認知される中、中長期にわたって日本株のコア投資対象として保有価値があります。

H2: 各商社のDX・テクノロジー投資の詳細

三菱商事はデジタルトランスフォーメーション（DX）投資に積極的です。MUFGとの共同デジタルバンク計画・ローソンのデジタル化（スマートストア・顔認証決済）・AI活用のサプライチェーン最適化など、既存事業のデジタル化を通じた収益向上を進めています。

伊藤忠はC2C（Consumer to Consumer）プラットフォームへの投資で独自路線を歩んでいます。FamilyMartのスマートフォンアプリを活用したパーソナライゼーション・CTC（伊藤忠テクノソリューションズ）によるデータセンター・AI基盤構築の受注拡大など、デジタルと実物資産の融合が収益の多様化をもたらしています。

H2: 商社株のバリュエーション変化

バフェットの投資が明らかになった2020年8月時点の商社株は軒並みPBR0.5〜0.8倍という超割安水準でしたが、2024〜2026年現在はPBR0.9〜1.5倍程度まで是正されています。「割安」という最初の評価軸は一定程度解消されており、今後の株価上昇は「業績成長（利益拡大）」「さらなるROE向上（資本効率改善）」「株主還元強化」という要因に依存する段階に移っています。

H2: 商社の後継者育成と次世代経営

商社は「総合的なビジネスパーソン育成の場」として機能しており、国内外で様々な事業に関与しながら経営人材を育成します。各商社の次世代経営層が資本配分・M&A判断・事業転換という意思決定をどう行うかが、中長期の企業価値を左右します。伊藤忠の石井敬太社長・三井物産の堀健一社長など、各社の若返りしつつある経営チームの戦略が注目されています。

H2: まとめ（詳細版）

総合商社5社はバフェットの投資以来「日本株の代表的な高配当バリュー株」という評価が世界に定着しました。現在は割安修正が進みバリュエーションが適正水準に近づく中で、「資本効率のさらなる向上」「脱炭素・デジタル成長事業の育成」「株主還元の継続強化」という三つの価値創造要素がどれだけ実現するかが今後の株価を決定します。StockWaveJPのテーマモメンタムと資源価格動向を組み合わせながら、5社の相対パフォーマンスを定期比較することを推奨します。
`}],gr={半導体製造装置:"semiconductor-theme",半導体検査装置:"semiconductor-theme",半導体材料:"semiconductor-theme",メモリ:"semiconductor-theme",パワー半導体:"power-semiconductor",次世代半導体:"semiconductor-theme",生成AI:"ai-cloud-theme",AIデータセンター:"ai-cloud-theme",フィジカルAI:"physical-ai-edge-ai",AI半導体:"semiconductor-theme",AI人材:"education-hr-theme",エッジAI:"physical-ai-edge-ai","EV・電気自動車":"ev-green-theme",全固体電池:"ev-green-theme",自動運転:"ev-green-theme",ドローン:"drone-theme","輸送・物流":"transport-logistics-theme",造船:"shipbuilding-theme",再生可能エネルギー:"renewable-energy-theme",太陽光発電:"renewable-energy-theme",核融合発電:"renewable-energy-theme",原子力発電:"renewable-energy-theme",電力会社:"renewable-energy-theme",LNG:"inpex-analysis",石油:"inpex-analysis",蓄電池:"ev-green-theme","資源（水素・ヘリウム・水）":"rare-earth-resources-theme",IOWN:"optical-communication",光通信:"optical-communication",通信:"telecom-theme",量子コンピューター:"ai-cloud-theme",SaaS:"fintech-theme",ウェアラブル端末:"game-entertainment-theme",仮想通貨:"fintech-theme",ネット銀行:"banking-finance-theme","鉄鋼・素材":"steel-materials-theme",化学:"chemical-theme",建築資材:"construction-infra-theme",塗料:"chemical-theme","医薬品・バイオ":"pharma-bio-theme","ヘルスケア・介護":"healthcare-nursing-theme","薬局・ドラッグストア":"healthcare-nursing-theme","銀行・金融":"banking-finance-theme",地方銀行:"regional-bank-theme",保険:"insurance-theme",フィンテック:"fintech-theme",不動産:"real-estate-theme","建設・インフラ":"construction-infra-theme",国土強靭化計画:"national-resilience",下水道:"construction-infra-theme","食品・飲料":"food-beverage-theme","農業・フードテック":"agritech-foodtech-theme","小売・EC":"retail-ec-theme","観光・ホテル・レジャー":"tourism-hotel-theme",インバウンド:"inbound-theme","リユース・中古品":"retail-ec-theme","防衛・航空":"defense-theme","宇宙・衛星":"space-satellite-theme","ロボット・自動化":"robot-automation-theme","レアアース・資源":"rare-earth-resources-theme",バフェット銘柄:"sogo-shosha-analysis",サイバーセキュリティ:"cybersecurity-theme",警備:"cybersecurity-theme","脱炭素・ESG":"ev-green-theme","教育・HR・人材":"education-hr-theme",人材派遣:"education-hr-theme","ゲーム・エンタメ":"game-entertainment-theme"},Ol=["すべて","テーマ","入門","分析手法","投資手法","用語解説","個別銘柄"],Pn={入門:{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},半導体:{bg:"rgba(255,69,96,0.1)",color:"#ff4560",border:"rgba(255,69,96,0.25)"},"AI・クラウド":{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},"防衛・宇宙":{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},インバウンド:{bg:"rgba(255,140,66,0.1)",color:"#ff8c42",border:"rgba(255,140,66,0.25)"},"EV・脱炭素":{bg:"rgba(6,214,160,0.1)",color:"#06d6a0",border:"rgba(6,214,160,0.25)"},分析手法:{bg:"rgba(255,214,25,0.1)",color:"#ffd619",border:"rgba(255,214,25,0.25)"},"防衛・宇宙":{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},造船:{bg:"rgba(91,156,246,0.1)",color:"#5b9cf6",border:"rgba(91,156,246,0.25)"},親子上場:{bg:"rgba(255,140,66,0.1)",color:"#ff8c42",border:"rgba(255,140,66,0.25)"},バフェット銘柄:{bg:"rgba(255,214,25,0.1)",color:"#ffd619",border:"rgba(255,214,25,0.25)"},フィジカルAI:{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},再生可能エネルギー:{bg:"rgba(6,214,160,0.12)",color:"#06d6a0",border:"rgba(6,214,160,0.3)"},エッジAI:{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},パワー半導体:{bg:"rgba(255,69,96,0.1)",color:"#ff4560",border:"rgba(255,69,96,0.25)"},NISA:{bg:"rgba(6,214,160,0.1)",color:"#06d6a0",border:"rgba(6,214,160,0.25)"},光通信:{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},国土強靭化:{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},イラク:{bg:"rgba(180,120,80,0.1)",color:"#b47850",border:"rgba(180,120,80,0.25)"},"ゲーム・エンタメ":{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},"銀行・金融":{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},地方銀行:{bg:"rgba(74,158,255,0.08)",color:"#4a9eff",border:"rgba(74,158,255,0.2)"},保険:{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},不動産:{bg:"rgba(255,140,66,0.1)",color:"#ff8c42",border:"rgba(255,140,66,0.25)"},"医薬品・バイオ":{bg:"rgba(255,69,96,0.1)",color:"#ff4560",border:"rgba(255,69,96,0.25)"},"ヘルスケア・介護":{bg:"rgba(6,214,160,0.1)",color:"#06d6a0",border:"rgba(6,214,160,0.25)"},"食品・飲料":{bg:"rgba(255,214,25,0.1)",color:"#ffd619",border:"rgba(255,214,25,0.25)"},"小売・EC":{bg:"rgba(255,140,66,0.1)",color:"#ff8c42",border:"rgba(255,140,66,0.25)"},通信:{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},"鉄鋼・素材":{bg:"rgba(180,120,80,0.1)",color:"#b47850",border:"rgba(180,120,80,0.25)"},化学:{bg:"rgba(6,214,160,0.1)",color:"#06d6a0",border:"rgba(6,214,160,0.25)"},"建設・インフラ":{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},"輸送・物流":{bg:"rgba(91,156,246,0.1)",color:"#5b9cf6",border:"rgba(91,156,246,0.25)"},フィンテック:{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},"ロボット・自動化":{bg:"rgba(255,69,96,0.1)",color:"#ff4560",border:"rgba(255,69,96,0.25)"},"レアアース・資源":{bg:"rgba(180,120,80,0.1)",color:"#b47850",border:"rgba(180,120,80,0.25)"},サイバーセキュリティ:{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},ドローン:{bg:"rgba(6,214,160,0.1)",color:"#06d6a0",border:"rgba(6,214,160,0.25)"},"観光・ホテル・レジャー":{bg:"rgba(255,214,25,0.1)",color:"#ffd619",border:"rgba(255,214,25,0.25)"},"農業・フードテック":{bg:"rgba(76,175,130,0.1)",color:"#4caf82",border:"rgba(76,175,130,0.25)"},"教育・HR・人材":{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},"宇宙・衛星":{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"},投資手法:{bg:"rgba(255,140,66,0.1)",color:"#ff8c42",border:"rgba(255,140,66,0.25)"},用語解説:{bg:"rgba(170,119,255,0.1)",color:"#aa77ff",border:"rgba(170,119,255,0.25)"},個別銘柄:{bg:"rgba(255,69,96,0.1)",color:"#ff4560",border:"rgba(255,69,96,0.25)"}};function Wl({text:t}){const e=t.trim().split(`
`),r=[];let i=0;for(;i<e.length;){const s=e[i].trim();if(!s){i++;continue}if(s.startsWith("H2: "))r.push(n.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"#e8f0ff",margin:"24px 0 10px",borderBottom:"1px solid var(--border)",paddingBottom:"6px"},children:s.slice(4)},i));else if(s.startsWith("H3: "))r.push(n.jsx("h3",{style:{fontSize:"14px",fontWeight:700,color:"var(--accent)",margin:"16px 0 6px"},children:s.slice(4)},i));else if(s.startsWith("## "))r.push(n.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"#e8f0ff",margin:"24px 0 10px",borderBottom:"1px solid var(--border)",paddingBottom:"6px"},children:s.slice(3)},i));else if(s.startsWith("**")&&s.endsWith("**"))r.push(n.jsx("p",{style:{fontSize:"13px",fontWeight:700,color:"var(--accent)",margin:"14px 0 6px"},children:s.slice(2,-2)},i));else if(s.startsWith("- ")){const o=[];for(;i<e.length&&e[i].trim().startsWith("- ");)o.push(e[i].trim().slice(2)),i++;r.push(n.jsx("ul",{style:{margin:"6px 0 12px",paddingLeft:"20px"},children:o.map((a,l)=>n.jsx("li",{style:{fontSize:"13px",color:"#e8f0ff",lineHeight:1.8,marginBottom:"2px"},children:a.includes("（")?n.jsxs(n.Fragment,{children:[n.jsx("span",{style:{color:"var(--text)",fontWeight:600},children:a.split("：")[0]}),a.includes("：")?n.jsxs("span",{style:{color:"var(--text2)"},children:["：",a.split("：").slice(1).join("：")]}):null]}):a},l))},`ul-${i}`));continue}else if(s.startsWith("| ")){const o=[];for(;i<e.length&&e[i].trim().startsWith("| ");)e[i].includes("---")||o.push(e[i].trim().split("|").filter(a=>a.trim()).map(a=>a.trim())),i++;o.length>0&&r.push(n.jsx("div",{style:{overflowX:"auto",margin:"12px 0 20px"},children:n.jsxs("table",{style:{borderCollapse:"collapse",fontSize:"12px",width:"100%",minWidth:"400px"},children:[n.jsx("thead",{children:n.jsx("tr",{children:o[0].map((a,l)=>n.jsx("th",{style:{padding:"8px 12px",textAlign:"left",borderBottom:"1px solid var(--border)",color:"var(--text3)",fontWeight:600,background:"var(--bg3)",whiteSpace:"nowrap"},children:a},l))})}),n.jsx("tbody",{children:o.slice(1).map((a,l)=>n.jsx("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.04)"},children:a.map((c,d)=>n.jsx("td",{style:{padding:"8px 12px",color:"#e8f0ff",lineHeight:1.6},children:c},d))},l))})]})},`table-${i}`));continue}else r.push(n.jsx("p",{style:{fontSize:"13px",color:"#e8f0ff",lineHeight:1.9,margin:"0 0 12px"},children:s},i));i++}return n.jsx("div",{children:r})}function Nl({initialArticleId:t=null,onNavigate:e}){const[r,i]=S.useState("すべて"),[s,o]=S.useState(t),[a,l]=S.useState(""),[c,d]=S.useState(1),h=20;S.useEffect(()=>{t&&(o(t),window.history.replaceState(null,"",`#column/${t}`))},[t]);const f=p=>{o(p),window.history.replaceState(null,"",`#column/${p}`),window.scrollTo(0,0)},u=()=>{o(null),window.history.replaceState(null,"",window.location.pathname),window.scrollTo(0,0)},g=["半導体製造装置","半導体検査装置","半導体材料","メモリ","パワー半導体","次世代半導体","生成AI","AIデータセンター","フィジカルAI","AI半導体","AI人材","エッジAI","EV・電気自動車","全固体電池","自動運転","ドローン","輸送・物流","造船","再生可能エネルギー","太陽光発電","核融合発電","原子力発電","電力会社","LNG","石油","蓄電池","資源（水素・ヘリウム・水）","IOWN","光通信","通信","量子コンピューター","SaaS","ウェアラブル端末","仮想通貨","ネット銀行","鉄鋼・素材","化学","建築資材","塗料","医薬品・バイオ","ヘルスケア・介護","薬局・ドラッグストア","銀行・金融","地方銀行","保険","フィンテック","不動産","建設・インフラ","国土強靭化計画","下水道","食品・飲料","農業・フードテック","小売・EC","観光・ホテル・レジャー","インバウンド","リユース・中古品","防衛・航空","宇宙・衛星","ロボット・自動化","レアアース・資源","バフェット銘柄","サイバーセキュリティ","警備","脱炭素・ESG","教育・HR・人材","人材派遣","ゲーム・エンタメ"],m=[...r==="すべて"?Mt:r==="テーマ"?Mt.filter(p=>g.includes(p.category)):Mt.filter(p=>p.category===r)].filter(p=>{if(!a.trim())return!0;const v=a.trim().toLowerCase();return p.title.toLowerCase().includes(v)||p.summary.toLowerCase().includes(v)||(p.keywords||[]).some(w=>w.toLowerCase().includes(v))||(p.themes||[]).some(w=>w.toLowerCase().includes(v))}).sort((p,v)=>v.date.localeCompare(p.date)),b=Math.ceil(m.length/h),x=m.slice((c-1)*h,c*h);if(s){const p=Mt.find(w=>w.id===s);if(!p)return o(null),null;const v=Pn[p.category]||{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"};return n.jsxs("div",{style:{padding:"20px 32px 60px",maxWidth:"760px",margin:"0 auto"},children:[n.jsx("button",{onClick:()=>u(),style:{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",color:"var(--accent)",fontSize:"13px",cursor:"pointer",fontFamily:"var(--font)",padding:"0",marginBottom:"20px"},children:"← コラム一覧に戻る"}),n.jsx("span",{style:{fontSize:"11px",fontWeight:600,padding:"3px 10px",borderRadius:"20px",background:v.bg,color:v.color,border:`1px solid ${v.border}`,display:"inline-block",marginBottom:"12px"},children:p.category}),n.jsx("h1",{style:{fontSize:"20px",fontWeight:700,color:"#e8f0ff",lineHeight:1.5,marginBottom:"8px"},children:p.title}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"24px"},children:p.date}),n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"6px 20px 20px",marginBottom:"28px"},children:n.jsx(Wl,{text:p.body})}),n.jsx("div",{style:{background:"rgba(255,140,66,0.07)",border:"1px solid rgba(255,140,66,0.2)",borderRadius:"8px",padding:"14px 18px",fontSize:"12px",color:"#e8f0ff",lineHeight:1.8},children:"⚠️ 本コラムは情報提供を目的としており、特定の銘柄・投資方法を推奨するものではありません。 実際の投資判断はご自身の責任において行ってください。"}),p.themes&&p.themes.length>0&&e&&n.jsxs("div",{style:{marginTop:"24px",padding:"16px 20px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"10px"},children:"🔗 関連テーマ"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text2)",lineHeight:1.8,marginBottom:"12px"},children:"関連テーマ: "+p.themes.join("、")}),n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:p.themes.map(w=>n.jsxs("div",{style:{background:"rgba(255,255,255,0.03)",borderRadius:"6px",padding:"10px 12px",border:"1px solid rgba(255,255,255,0.06)"},children:[n.jsx("div",{style:{fontSize:"12px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:w}),n.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"},children:[n.jsx("button",{onClick:()=>e("テーマ別詳細",w),style:{padding:"5px 12px",borderRadius:"5px",fontSize:"11px",fontWeight:600,background:"rgba(170,119,255,0.1)",border:"1px solid rgba(170,119,255,0.3)",color:"#aa77ff",cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.15s"},onMouseEnter:H=>H.currentTarget.style.background="rgba(170,119,255,0.2)",onMouseLeave:H=>H.currentTarget.style.background="rgba(170,119,255,0.1)",children:"📊 テーマ詳細を見る"}),gr[w]&&gr[w]!==p.id&&n.jsx("button",{onClick:()=>e("コラム・解説",gr[w]),style:{padding:"5px 12px",borderRadius:"5px",fontSize:"11px",fontWeight:600,background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.2)",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.15s"},onMouseEnter:H=>H.currentTarget.style.background="rgba(74,158,255,0.15)",onMouseLeave:H=>H.currentTarget.style.background="rgba(74,158,255,0.07)",children:"📖 関連コラムを読む"})]})]},w))})]}),(()=>{const H={半導体製造装置:"半導体製造装置",半導体検査装置:"半導体検査装置",半導体材料:"半導体材料",メモリ:"メモリ",パワー半導体:"パワー半導体",次世代半導体:"次世代半導体",生成AI:"生成AI",AIデータセンター:"AIデータセンター",フィジカルAI:"フィジカルAI",AI半導体:"AI半導体",AI人材:"AI人材",エッジAI:"エッジAI","EV・電気自動車":"EV・電気自動車",全固体電池:"全固体電池",自動運転:"自動運転",ドローン:"ドローン","輸送・物流":"輸送・物流",造船:"造船",再生可能エネルギー:"再生可能エネルギー",太陽光発電:"太陽光発電",核融合発電:"核融合発電",原子力発電:"原子力発電",電力会社:"電力会社",LNG:"LNG",石油:"石油",蓄電池:"蓄電池","資源（水素・ヘリウム・水）":"資源（水素・ヘリウム・水）",IOWN:"IOWN",光通信:"光通信",通信:"通信",量子コンピューター:"量子コンピューター",SaaS:"SaaS",ウェアラブル端末:"ウェアラブル端末",仮想通貨:"仮想通貨",ネット銀行:"ネット銀行","鉄鋼・素材":"鉄鋼・素材",化学:"化学",建築資材:"建築資材",塗料:"塗料","医薬品・バイオ":"医薬品・バイオ","ヘルスケア・介護":"ヘルスケア・介護","薬局・ドラッグストア":"薬局・ドラッグストア","銀行・金融":"銀行・金融",地方銀行:"地方銀行",保険:"保険",フィンテック:"フィンテック",不動産:"不動産","建設・インフラ":"建設・インフラ",国土強靭化計画:"国土強靭化計画",下水道:"下水道","食品・飲料":"食品・飲料","農業・フードテック":"農業・フードテック","小売・EC":"小売・EC","観光・ホテル・レジャー":"観光・ホテル・レジャー",インバウンド:"インバウンド","リユース・中古品":"リユース・中古品","防衛・航空":"防衛・航空","宇宙・衛星":"宇宙・衛星","ロボット・自動化":"ロボット・自動化","レアアース・資源":"レアアース・資源",バフェット銘柄:"バフェット銘柄",サイバーセキュリティ:"サイバーセキュリティ",警備:"警備","脱炭素・ESG":"脱炭素・ESG","教育・HR・人材":"教育・HR・人材",人材派遣:"人材派遣","ゲーム・エンタメ":"ゲーム・エンタメ"}[p.category];return!H||!e?null:n.jsxs("div",{style:{marginTop:"20px",display:"flex",gap:"10px",flexWrap:"wrap"},children:[n.jsxs("button",{onClick:()=>e("テーマ別詳細",H),style:{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.3)",borderRadius:"8px",color:"var(--accent)",cursor:"pointer",fontFamily:"var(--font)",fontSize:"13px",fontWeight:600,padding:"10px 20px",transition:"all 0.15s"},onMouseEnter:I=>{I.currentTarget.style.background="rgba(74,158,255,0.2)"},onMouseLeave:I=>{I.currentTarget.style.background="rgba(74,158,255,0.1)"},children:["📊 ",H,"テーマのデータを見る"]}),n.jsx("button",{onClick:()=>e("テーマ一覧"),style:{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(170,119,255,0.1)",border:"1px solid rgba(170,119,255,0.3)",borderRadius:"8px",color:"#aa77ff",cursor:"pointer",fontFamily:"var(--font)",fontSize:"13px",fontWeight:600,padding:"10px 20px",transition:"all 0.15s"},onMouseEnter:I=>{I.currentTarget.style.background="rgba(170,119,255,0.2)"},onMouseLeave:I=>{I.currentTarget.style.background="rgba(170,119,255,0.1)"},children:"📈 全テーマ一覧を見る"})]})})(),n.jsx("div",{style:{marginTop:"32px",paddingTop:"24px",borderTop:"1px solid var(--border)",textAlign:"center"},children:n.jsx("button",{onClick:()=>u(),style:{display:"inline-flex",alignItems:"center",gap:"8px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font)",fontSize:"13px",fontWeight:600,padding:"10px 28px",transition:"all 0.15s"},onMouseEnter:w=>{w.currentTarget.style.borderColor="var(--accent)",w.currentTarget.style.color="var(--accent)"},onMouseLeave:w=>{w.currentTarget.style.borderColor="var(--border)",w.currentTarget.style.color="var(--text2)"},children:"← コラム一覧に戻る"})})]})}return n.jsxs("div",{style:{padding:"20px 32px 60px"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",color:"#e8f0ff",marginBottom:"4px"},children:"コラム・解説"}),n.jsx("p",{style:{fontSize:"13px",color:"var(--text3)",marginBottom:"24px"},children:"テーマ株投資の基礎から各テーマの詳細解説まで、投資判断に役立つ情報を提供します。"}),n.jsxs("div",{style:{position:"relative",marginBottom:"12px",maxWidth:"400px"},children:[n.jsx("input",{type:"text",placeholder:"キーワード・テーマ名で検索...",value:a,onChange:p=>{l(p.target.value),d(1)},style:{width:"100%",padding:"9px 36px 9px 14px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",fontSize:"13px",fontFamily:"var(--font)",outline:"none",boxSizing:"border-box"}}),a&&n.jsx("button",{onClick:()=>l(""),style:{position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"14px",padding:"2px 4px"},children:"✕"})]}),n.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"24px"},children:Ol.map(p=>n.jsx("button",{onClick:()=>{i(p),d(1)},style:{padding:"5px 14px",borderRadius:"20px",fontSize:"12px",cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.15s",border:r===p?"1px solid var(--accent)":"1px solid var(--border)",background:r===p?"rgba(74,158,255,0.12)":"transparent",color:r===p?"var(--accent)":"var(--text3)",fontWeight:r===p?600:400},children:p},p))}),m.length>0&&n.jsxs("div",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"12px"},children:[m.length,"件中 ",(c-1)*h+1,"〜",Math.min(c*h,m.length),"件表示"]}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"14px"},className:"col-grid",children:x.filter(Boolean).map((p,v)=>{const w=Pn[p.category]||{bg:"rgba(74,158,255,0.1)",color:"#4a9eff",border:"rgba(74,158,255,0.25)"};return n.jsxs("div",{onClick:()=>f(p.id),style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"18px 20px",cursor:"pointer",animation:`fadeUp 0.3s ease ${v*.05}s both`,transition:"border-color 0.15s, transform 0.15s"},onMouseEnter:H=>{H.currentTarget.style.borderColor="rgba(74,158,255,0.3)",H.currentTarget.style.transform="translateY(-2px)"},onMouseLeave:H=>{H.currentTarget.style.borderColor="var(--border)",H.currentTarget.style.transform="translateY(0)"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"},children:[n.jsx("span",{style:{fontSize:"20px"},children:p.icon}),n.jsx("span",{style:{fontSize:"11px",fontWeight:600,padding:"2px 8px",borderRadius:"12px",background:w.bg,color:w.color,border:`1px solid ${w.border}`},children:p.category}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",marginLeft:"auto",fontFamily:"var(--mono)"},children:p.date})]}),n.jsx("h2",{style:{fontSize:"13px",fontWeight:700,color:"#e8f0ff",lineHeight:1.5,marginBottom:"8px"},children:p.title}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",lineHeight:1.7,margin:0,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"},children:p.summary}),n.jsx("div",{style:{marginTop:"12px",fontSize:"11px",color:"var(--accent)",fontWeight:600},children:"続きを読む →"})]},p.id)})}),b>1&&n.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginTop:"28px",flexWrap:"wrap"},children:[n.jsx("button",{onClick:()=>{d(p=>Math.max(1,p-1)),window.scrollTo(0,0)},disabled:c===1,style:{padding:"6px 14px",borderRadius:"6px",border:"1px solid var(--border)",background:c===1?"transparent":"var(--bg2)",color:c===1?"var(--text3)":"var(--text)",cursor:c===1?"default":"pointer",fontFamily:"var(--font)",fontSize:"12px"},children:"← 前へ"}),Array.from({length:b},(p,v)=>v+1).map(p=>n.jsx("button",{onClick:()=>{d(p),window.scrollTo(0,0)},style:{padding:"6px 12px",borderRadius:"6px",fontSize:"12px",fontFamily:"var(--font)",cursor:"pointer",border:p===c?"1px solid var(--accent)":"1px solid var(--border)",background:p===c?"rgba(74,158,255,0.15)":"var(--bg2)",color:p===c?"var(--accent)":"var(--text)",fontWeight:p===c?700:400},children:p},p)),n.jsx("button",{onClick:()=>{d(p=>Math.min(b,p+1)),window.scrollTo(0,0)},disabled:c===b,style:{padding:"6px 14px",borderRadius:"6px",border:"1px solid var(--border)",background:c===b?"transparent":"var(--bg2)",color:c===b?"var(--text3)":"var(--text)",cursor:c===b?"default":"pointer",fontFamily:"var(--font)",fontSize:"12px"},children:"次へ →"})]}),n.jsx("style",{children:`
        @media (max-width:640px) { .col-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; } }
        @media (max-width:640px) { .col-grid > div { padding: 12px 12px !important; } }
      `})]})}function Dl(){return n.jsxs("div",{style:{padding:"28px 32px 60px",maxWidth:"760px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,color:"#e8f0ff",marginBottom:"4px"},children:"プライバシーポリシー"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"32px"},children:"最終更新日：2026年3月26日"}),[{title:"1. 基本方針",body:"StockWaveJP（以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、以下のポリシーを定めます。当サイトは個人情報保護の重要性を認識し、適切な保護に努めます。"},{title:"2. 収集する情報",body:`当サイトは以下の情報を収集することがあります。

・アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）
・Googleアナリティクスによる利用状況データ（ページビュー、滞在時間等）
・ユーザーがカスタムテーマ機能で入力したデータ（ブラウザのローカルストレージに保存）

氏名・メールアドレス等の個人を特定できる情報は収集していません。`},{title:"3. Cookieの使用",body:`当サイトは、ユーザー体験の向上および利用状況の分析を目的として、Cookieを使用しています。

・Google Analytics：サイトの利用状況を分析するために使用します。収集されたデータは匿名化されており、個人を特定できません。
・Google AdSense：広告配信の最適化のために使用します。

ブラウザの設定によりCookieを無効にすることができますが、一部の機能が正常に動作しなくなる場合があります。`},{title:"4. 広告について",body:`当サイトは、第三者配信事業者であるGoogleが提供する広告サービス「Google AdSense」を利用しています。Googleを含む第三者配信事業者は、Cookieを使用して、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。

ユーザーは、Googleの広告設定でパーソナライズ広告を無効にできます。また、www.aboutads.info にアクセスすることで、第三者配信事業者のCookieを無効にすることも可能です。`},{title:"5. アクセス解析ツール",body:"当サイトではGoogleアナリティクスを使用しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。"},{title:"6. 免責事項",body:"当サイトに掲載されている情報は、信頼できると考えられる情報源に基づいて作成していますが、その正確性・完全性を保証するものではありません。当サイトの情報を参考にして生じたいかなる損害についても、当サイト運営者は一切責任を負いません。"},{title:"7. プライバシーポリシーの変更",body:"本ポリシーの内容は、法令その他の事情の変化により、予告なく変更することがあります。変更後のポリシーは本ページに掲載した時点で効力を生じます。"},{title:"8. お問い合わせ",body:"プライバシーポリシーに関するお問い合わせは、X（旧Twitter）のDM（@StockWaveJP）またはサイト内のお問い合わせフォームよりご連絡ください。"}].map((t,e)=>n.jsxs("div",{style:{marginBottom:"28px"},children:[n.jsx("h2",{style:{fontSize:"15px",fontWeight:700,color:"#e8f0ff",marginBottom:"10px",borderLeft:"3px solid var(--accent)",paddingLeft:"12px"},children:t.title}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:1.9,whiteSpace:"pre-line"},children:t.body})]},e))]})}function Ll(){return n.jsxs("div",{style:{padding:"24px 32px 60px",maxWidth:"860px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"22px",fontWeight:700,color:"var(--text)",marginBottom:"6px",letterSpacing:"-0.02em"},children:"利用規約"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"32px"},children:"制定日：2026年4月1日　最終改訂：2026年4月1日"}),n.jsx(fe,{title:"第1条（本規約の適用）",children:n.jsx("p",{children:"本利用規約（以下「本規約」）は、StockWaveJP（以下「当サイト」）が提供するすべてのサービス（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」）には、本規約に同意いただいた上で本サービスをご利用いただきます。当サイトにアクセスした時点で、本規約に同意したものとみなします。"})}),n.jsxs(fe,{title:"第2条（サービスの内容）",children:[n.jsx("p",{children:"当サイトは、日本株式市場におけるテーマ別騰落率・出来高・売買代金・モメンタム等の統計データ、およびテーマ株投資に関するコラム・解説記事を提供する情報サービスです。"}),n.jsx("p",{style:{marginTop:"8px"},children:"本サービスが提供する情報は以下を含みます。"}),n.jsxs("ul",{style:{paddingLeft:"20px",marginTop:"6px"},children:[n.jsx("li",{children:"テーマ別株価騰落率・出来高・売買代金の集計データ"}),n.jsx("li",{children:"テーマ別騰落モメンタム分析"}),n.jsx("li",{children:"市場ヒートマップおよびマクロ指標"}),n.jsx("li",{children:"テーマ株投資に関するコラム・解説記事・用語解説"}),n.jsx("li",{children:"カスタムテーマ作成機能（ユーザー登録者向け）"})]})]}),n.jsxs(fe,{title:"第3条（投資助言の禁止および免責）",children:[n.jsxs("p",{children:["当サイトが提供するすべての情報は、",n.jsx("strong",{style:{color:"var(--red)"},children:"投資に関する意思決定の参考情報として提供するものであり、特定の銘柄・投資商品・取引手法を推奨・勧誘するものではありません。"})]}),n.jsx("p",{style:{marginTop:"8px"},children:"当サイトは金融商品取引法に基づく投資助言業者ではなく、いかなる投資助言も行いません。投資に関する最終的な判断はユーザー自身の責任において行ってください。"}),n.jsx("p",{style:{marginTop:"8px"},children:"当サイトの情報を参考にした投資行動によって生じた損害（逸失利益・機会損失を含む）について、当サイト運営者は一切の責任を負いません。"})]}),n.jsxs(fe,{title:"第4条（情報の正確性・完全性・最新性）",children:[n.jsx("p",{children:"当サイトが提供するデータは、外部データプロバイダー（Yahoo Finance等）から自動取得した情報に基づきます。当サイトは情報の正確性・完全性・最新性について最善を尽くしますが、以下の事由により誤り・遅延・欠損が生じる場合があります。"}),n.jsxs("ul",{style:{paddingLeft:"20px",marginTop:"6px"},children:[n.jsx("li",{children:"データプロバイダー側の障害・仕様変更・配信遅延"}),n.jsx("li",{children:"システムメンテナンスまたは障害"}),n.jsx("li",{children:"ネットワーク障害その他の技術的要因"}),n.jsx("li",{children:"市場の急激な変動に伴うデータ更新の遅延"})]}),n.jsx("p",{style:{marginTop:"8px"},children:"これらによって生じた損害について、当サイト運営者は責任を負いません。重要な投資判断を行う際は、必ず公式の市場データおよび各証券会社の情報をご確認ください。"})]}),n.jsxs(fe,{title:"第5条（禁止事項）",children:[n.jsx("p",{children:"ユーザーは本サービスの利用にあたり、以下の行為を行ってはなりません。"}),n.jsxs("ul",{style:{paddingLeft:"20px",marginTop:"6px"},children:[n.jsx("li",{children:"当サイトのコンテンツ（テキスト・データ・画像・ソースコード等）を無断で複製・転載・改変・販売・二次利用する行為"}),n.jsx("li",{children:"当サイトへの過度なアクセス（クローリング・スクレイピングを含む）によりサーバーに負荷をかける行為"}),n.jsx("li",{children:"当サイトを装った偽サイトの作成やフィッシング行為"}),n.jsx("li",{children:"本サービスを利用した投資詐欺・不正勧誘その他の違法行為"}),n.jsx("li",{children:"他のユーザーまたは第三者の権利・利益を侵害する行為"}),n.jsx("li",{children:"当サイトの運営を妨害する行為"}),n.jsx("li",{children:"その他、当サイト運営者が不適切と判断する行為"})]})]}),n.jsxs(fe,{title:"第6条（知的財産権）",children:[n.jsx("p",{children:"当サイトに掲載されているコラム・解説記事・テキスト・デザイン・ロゴ・ソースコードその他のコンテンツに関する知的財産権は、当サイト運営者または正当な権利者に帰属します。"}),n.jsx("p",{style:{marginTop:"8px"},children:"ユーザーは、個人的な参照・学習目的に限り本サービスのコンテンツを閲覧することができます。それ以外の目的での複製・転用・商業利用は、書面による事前の許可がない限り禁止します。"}),n.jsx("p",{style:{marginTop:"8px"},children:"当サイトが表示する株価・企業名・証券コードは、各証券取引所および企業の商標・情報であり、当サイトはこれらの権利を主張するものではありません。"})]}),n.jsxs(fe,{title:"第7条（リンクおよび外部サービス）",children:[n.jsx("p",{children:"当サイトは第三者のウェブサイトへのリンクを含む場合があります。リンク先のサービス・コンテンツ・プライバシーポリシーについては当サイトは責任を負いません。リンク先のサービスを利用する際は、各サービスの利用規約をご確認ください。"}),n.jsx("p",{style:{marginTop:"8px"},children:"当サイトへのリンクは、非商業目的かつ当サイトの内容・品質を正確に伝える場合に限り原則として自由です。ただし、フレーム内への組み込み・誤解を招く形でのリンクは禁止します。"})]}),n.jsxs(fe,{title:"第8条（広告について）",children:[n.jsx("p",{children:"当サイトはGoogle AdSense等の広告配信サービスを利用する場合があります。広告配信に際し、ユーザーの興味に合わせた広告を表示するためにCookieが使用されることがあります。Cookieの使用を望まない場合は、ブラウザの設定から無効にすることができます。"}),n.jsx("p",{style:{marginTop:"8px"},children:"広告主の商品・サービスに関するお問い合わせは、各広告主に直接お願いします。当サイトは広告主の行為について責任を負いません。"})]}),n.jsx(fe,{title:"第9条（個人情報の取り扱い）",children:n.jsx("p",{children:"当サイトにおける個人情報の取り扱いは、別途定める「プライバシーポリシー」に従います。ユーザーは本サービスを利用することにより、プライバシーポリシーに同意したものとみなします。"})}),n.jsxs(fe,{title:"第10条（ユーザー登録・アカウント）",children:[n.jsx("p",{children:"一部のサービス（カスタムテーマ機能等）はユーザー登録が必要です。ユーザーは以下の事項を遵守してください。"}),n.jsxs("ul",{style:{paddingLeft:"20px",marginTop:"6px"},children:[n.jsx("li",{children:"正確な情報を登録すること"}),n.jsx("li",{children:"アカウントのパスワードを厳重に管理し、第三者に提供しないこと"}),n.jsx("li",{children:"アカウントが不正利用された場合、速やかに当サイトに連絡すること"})]}),n.jsx("p",{style:{marginTop:"8px"},children:"アカウントの管理不備により生じた損害について、当サイト運営者は責任を負いません。"})]}),n.jsxs(fe,{title:"第11条（サービスの変更・中断・終了）",children:[n.jsx("p",{children:"当サイト運営者は、以下の場合においてユーザーへの事前通知なくサービスの全部または一部を変更・中断・終了することができます。"}),n.jsxs("ul",{style:{paddingLeft:"20px",marginTop:"6px"},children:[n.jsx("li",{children:"システムメンテナンス・障害対応"}),n.jsx("li",{children:"外部データソースの仕様変更または提供停止"}),n.jsx("li",{children:"運営上の都合"}),n.jsx("li",{children:"天災・感染症拡大その他の不可抗力"})]}),n.jsx("p",{style:{marginTop:"8px"},children:"サービスの変更・中断・終了によってユーザーに生じた損害について、当サイト運営者は責任を負いません。"})]}),n.jsx(fe,{title:"第12条（準拠法・管轄裁判所）",children:n.jsx("p",{children:"本規約の解釈および適用は日本法に準拠します。本サービスに関して紛争が生じた場合は、当サイト運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。"})}),n.jsx(fe,{title:"第13条（規約の変更）",children:n.jsx("p",{children:"当サイト運営者は、必要に応じて本規約を変更することができます。変更後の規約は当サイトに掲載した時点から効力を生じます。重要な変更を行う場合は、当サイト上にてお知らせします。変更後も本サービスを継続利用した場合、変更後の規約に同意したものとみなします。"})}),n.jsx(fe,{title:"お問い合わせ",children:n.jsx("p",{children:"本規約に関するお問い合わせは、サイト内のお問い合わせフォームよりご連絡ください。"})}),n.jsxs("div",{style:{marginTop:"40px",padding:"16px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",fontSize:"12px",color:"var(--text3)"},children:[n.jsx("strong",{style:{color:"var(--text2)"},children:"StockWaveJP 運営事務局"}),n.jsx("br",{}),"URL: stockwavejp.com",n.jsx("br",{}),"お問い合わせ: サイト内お問い合わせフォームをご利用ください"]})]})}function fe({title:t,children:e}){return n.jsxs("div",{style:{marginBottom:"28px"},children:[n.jsx("h2",{style:{fontSize:"14px",fontWeight:700,color:"var(--accent)",marginBottom:"10px",paddingBottom:"6px",borderBottom:"1px solid var(--border)"},children:t}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.9"},children:e})]})}function Bl(){return n.jsxs("div",{style:{padding:"28px 32px 60px",maxWidth:"760px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"24px",fontWeight:700,color:"#e8f0ff",marginBottom:"4px"},children:"当サイトについて"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"32px"},children:"StockWaveJP の目的と作成の背景"}),n.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(74,158,255,0.1), rgba(255,69,96,0.07))",border:"1px solid rgba(74,158,255,0.2)",borderRadius:"12px",padding:"28px 32px",marginBottom:"24px"},children:[n.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"var(--accent)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"12px"},children:"Mission"}),n.jsx("div",{style:{fontSize:"20px",fontWeight:700,color:"#e8f0ff",marginBottom:"20px",lineHeight:1.5},children:"StockWaveJPが目指すもの：主観を排した相場の可視化"}),n.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[n.jsx("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:2,margin:0},children:"株式市場において、投資家が分析に割ける時間は限られています。StockWaveJPは、その限られた時間の中で最大のインサイト（洞察）を得るために設計された客観的データプラットフォームです。"}),n.jsx("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:2,margin:0},children:"独自のセクター分類と集計アルゴリズムにより、国内主要大型株の騰落トレンドを数値化。個別のニュースや主観的なバイアスを完全に排除し、純粋な資金の流入・流出という「事実」のみをランキング形式で直感的に表示します。"}),n.jsx("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:2,margin:0},children:"複雑な分析にかかる労力を最小化し、誰もが瞬時に現在の相場の全体像を掴める。そんな「速さ」と「客観性」を両立したツールとして、皆様のフラットな投資判断に貢献します。"})]})]}),n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"22px 26px",marginBottom:"16px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"},children:[n.jsx("span",{style:{fontSize:"22px"},children:"⚡"}),n.jsx("h2",{style:{fontSize:"15px",fontWeight:700,color:"#e8f0ff",margin:0,borderLeft:"3px solid #ffd619",paddingLeft:"10px"},children:"StockWaveJPでしか見られない機能"})]}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"10px"},children:[{icon:"📡",title:"騰落モメンタム",desc:"🔥加速・↗転換↑・→横ばい・↘転換↓・❄️失速の5分類は当サイト独自の指標"},{icon:"🗺️",title:"テーマ×期間ヒートマップ",desc:"30テーマの騰落率を1週〜1年の複数期間で同時比較できる"},{icon:"📊",title:"三指標同時表示",desc:"騰落率・出来高・売買代金を30テーマ分まとめてランキング表示"},{icon:"⚙️",title:"カスタムテーマ",desc:"自分だけのテーマを作成して独自の銘柄群を追跡できる"},{icon:"📈",title:"マクロ連動表示",desc:"日経平均・ドル円・VIX等のマクロ指標とテーマ動向を同時確認"},{icon:"📰",title:"週次レポート",desc:"毎週の相場振り返りと来週の注目ポイントを編集部が解説"}].map(({icon:t,title:e,desc:r})=>n.jsxs("div",{style:{background:"rgba(74,158,255,0.04)",border:"1px solid rgba(74,158,255,0.15)",borderRadius:"8px",padding:"12px 14px"},children:[n.jsx("div",{style:{fontSize:"18px",marginBottom:"6px"},children:t}),n.jsx("div",{style:{fontSize:"12px",fontWeight:700,color:"var(--accent)",marginBottom:"4px"},children:e}),n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",lineHeight:1.7},children:r})]},e))})]}),[{icon:"🎯",title:"このサイトの目的",color:"#4a9eff",content:`日本株の投資情報は、証券会社のツールや有料サービスに集中しており、初心者が「今どのテーマが動いているか」を無料で把握できる場所が少ないという課題がありました。

StockWaveJPは、半導体・AI・防衛・インバウンドなど30の投資テーマについて、騰落率・出来高・売買代金を自動集計し、「資金の流れ」を視覚的に把握できるダッシュボードとして開発しました。

投資助言や個別銘柄の推奨ではなく、「今市場は何を注目しているか」を客観的なデータで提供することを第一の目的としています。`},{icon:"💡",title:"作成の背景・理由",color:"#aa77ff",content:`株式市場では、個別銘柄の分析だけでなく「どのテーマやセクターに資金が流れているか」という大局観が投資判断に非常に重要です。しかし、テーマ別の騰落率・出来高・売買代金を一元管理できる無料ツールは国内に限られていました。

特に投資初心者の方が「今日半導体が上がっているのはわかった、でも他のテーマはどうなの？」という疑問を持ったとき、比較できるデータに無料でアクセスできる場所を作りたいという思いから、このサイトを開発しました。

また、テーマ株投資の「流れを読む」楽しさを、より多くの方に体験してもらいたいという思いも込めています。`}].map((t,e)=>n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"22px 26px",marginBottom:"16px",animation:`fadeUp 0.3s ease ${e*.08}s both`},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"22px"},children:t.icon}),n.jsx("h2",{style:{fontSize:"15px",fontWeight:700,color:"#e8f0ff",margin:0,borderLeft:`3px solid ${t.color}`,paddingLeft:"10px"},children:t.title})]}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:2,whiteSpace:"pre-line"},children:t.content})]},e)),n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"22px 26px",marginBottom:"16px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"},children:[n.jsx("span",{style:{fontSize:"22px"},children:"🏢"}),n.jsx("h2",{style:{fontSize:"15px",fontWeight:700,color:"#e8f0ff",margin:0,borderLeft:"3px solid #4a9eff",paddingLeft:"10px"},children:"運営者情報"})]}),n.jsx("div",{style:{display:"grid",gridTemplateColumns:"120px 1fr",gap:"12px 24px",fontSize:"13px",marginBottom:"14px"},children:[["サイト名","StockWaveJP"],["URL","https://stockwavejp.com"],["運営開始","2026年3月"],["運営者","StockWaveJP編集部（兼業日米株投資家）"],["目的","日本株テーマ別の騰落率・出来高・売買代金をリアルタイムで可視化し、投資判断の参考情報を提供すること"],["対象ユーザー","日本株に興味を持つ個人投資家・投資初心者"]].map(([t,e],r)=>n.jsxs("div",{style:{display:"contents"},children:[n.jsx("span",{style:{color:"var(--text3)",fontWeight:600,letterSpacing:"0.05em",fontSize:"11px",textTransform:"uppercase",alignSelf:"start",paddingTop:"2px"},children:t}),n.jsx("span",{style:{color:"var(--text2)",lineHeight:1.7},children:t==="運営者"?n.jsx("a",{href:"https://twitter.com/StockWaveJP",target:"_blank",rel:"noopener noreferrer",style:{color:"var(--accent)",textDecoration:"none"},children:e}):e})]},r))}),n.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:1.9},children:"StockWaveJPは、日本株のテーマ別動向を視覚的に把握するためのダッシュボードです。 個別銘柄の推奨や投資助言は行っておらず、あくまで「市場全体のテーマの流れを把握する」ための 情報提供ツールです。実際の投資判断は、必ずご自身の責任において行ってください。"})]}),n.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:"12px",padding:"22px 26px",marginBottom:"16px"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"},children:[n.jsx("span",{style:{fontSize:"22px"},children:"👤"}),n.jsx("h2",{style:{fontSize:"15px",fontWeight:700,color:"#e8f0ff",margin:0,borderLeft:"3px solid #aa77ff",paddingLeft:"10px"},children:"運営者プロフィール"})]}),n.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"20px",flexWrap:"wrap"},children:[n.jsx("div",{style:{width:"64px",height:"64px",borderRadius:"50%",background:"linear-gradient(135deg,#4a9eff,#aa77ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",flexShrink:0},children:"📊"}),n.jsxs("div",{style:{flex:1,minWidth:"200px"},children:[n.jsx("div",{style:{fontSize:"16px",fontWeight:700,color:"#e8f0ff",marginBottom:"4px"},children:"StockWaveJP編集部"}),n.jsx("div",{style:{fontSize:"12px",color:"var(--accent)",marginBottom:"12px",fontWeight:600},children:"兼業日米株投資家"}),n.jsxs("div",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:2},children:["日本株・米国株に投資する個人投資家として、テーマ株の資金フローを独自に追跡・分析しています。 「どのテーマに資金が集まっているか」「モメンタムはどう変化しているか」を客観的なデータで 可視化することで、感情に左右されない投資判断をサポートしたいという思いからStockWaveJPを開発しました。",n.jsx("br",{}),n.jsx("br",{}),"日米両市場の特性の違い（日本株のテーマ集中度の高さ・政策感応度の強さ）を踏まえた 分析視点を大切にしています。騰落率・出来高・売買代金・モメンタムの4指標を組み合わせた テーマ分析アプローチを通じて、個人投資家が機関投資家と同じ目線でマーケットを俯瞰できる ツールの提供を目指しています。"]}),n.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"14px",flexWrap:"wrap"},children:[{label:"投資スタイル",value:"テーマ株モメンタム投資・長期バリュー投資"},{label:"投資市場",value:"日本株・米国株（日米兼業）"}].map(({label:t,value:e})=>n.jsxs("div",{style:{background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.15)",borderRadius:"6px",padding:"6px 12px",fontSize:"11px"},children:[n.jsxs("span",{style:{color:"var(--text3)",marginRight:"6px"},children:[t,":"]}),n.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:e})]},t))})]})]})]}),n.jsx("div",{style:{textAlign:"center",marginTop:"32px"},children:n.jsxs("a",{href:"https://twitter.com/StockWaveJP",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"10px",background:"rgba(91,156,246,0.1)",border:"1px solid rgba(91,156,246,0.25)",borderRadius:"8px",padding:"12px 24px",color:"var(--accent)",textDecoration:"none",fontWeight:600,fontSize:"14px"},children:[n.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor",children:n.jsx("path",{d:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"})}),"X（旧Twitter）@StockWaveJP"]})})]})}function Tn(){return n.jsxs("div",{style:{textAlign:"center",padding:"60px",color:"var(--text3)"},children:[[0,.2,.4].map((t,e)=>n.jsx("span",{style:{display:"inline-block",width:"8px",height:"8px",borderRadius:"50%",background:"var(--accent)",margin:"0 3px",animation:`pulse 1.2s ease-in-out ${t}s infinite`}},e)),n.jsx("div",{style:{marginTop:"12px",fontSize:"13px"},children:"読み込み中..."})]})}function Ml({text:t,onNavigate:e}){if(!t)return null;const r=t.split(`
`),i=[];let s=null;for(let o=0;o<r.length;o++){const a=r[o];if(a.match(/^###?\s*(?:\d+位[：:]\s*)?(.+?)(?:（.+）)?$/),a.startsWith("# "))i.push(n.jsx("h1",{style:{fontSize:"20px",fontWeight:700,color:"var(--text)",margin:"24px 0 10px",borderBottom:"1px solid var(--border)",paddingBottom:"6px"},children:a.slice(2)},o));else if(a.startsWith("## "))i.push(n.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"var(--text)",margin:"18px 0 8px"},children:a.slice(3)},o));else if(a.startsWith("### ")){const l=a.slice(4),c=l.match(/\d+位[：:]\s*(.+?)(?:\s*（|$)/);s=c?c[1].trim():null,i.push(n.jsx("h3",{style:{fontSize:"14px",fontWeight:700,color:"var(--text2)",margin:"14px 0 6px"},children:l},o))}else if(a.startsWith("- ")||a.startsWith("・"))i.push(n.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"4px",paddingLeft:"8px"},children:[n.jsx("span",{style:{color:"var(--accent)",flexShrink:0},children:"▸"}),n.jsx("span",{style:{color:"var(--text)",fontSize:"13px",lineHeight:1.7},children:a.slice(2)})]},o));else if(a.trim()==="---")i.push(n.jsx("hr",{style:{border:"none",borderTop:"1px solid var(--border)",margin:"16px 0"}},o));else if(a.trim()==="")if(s&&o>0&&r[o-1].trim()!==""){i.push(n.jsx("div",{style:{height:"6px"}},`space-${o}`));const l=r.slice(o+1).find(c=>c.trim()!=="");l&&(l.startsWith("##")||l.startsWith("---")||o===r.length-1)?(i.push(n.jsx("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",margin:"8px 0 12px"},children:e&&n.jsxs(n.Fragment,{children:[n.jsxs("button",{onClick:()=>e("テーマ別詳細",s),style:{padding:"5px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.3)",color:"var(--accent)"},children:["📊 ",s,"の詳細 →"]}),n.jsx("button",{onClick:()=>e("コラム・解説"),style:{padding:"5px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(170,119,255,0.08)",border:"1px solid rgba(170,119,255,0.25)",color:"#aa77ff"},children:"📖 コラムを読む →"})]})},`btn-${o}`)),s=null):i.push(n.jsx("div",{style:{height:"6px"}},`space2-${o}`))}else i.push(n.jsx("div",{style:{height:"6px"}},o));else i.push(n.jsx("p",{style:{color:"var(--text)",fontSize:"13px",lineHeight:1.8,marginBottom:"4px"},children:a},o))}return n.jsx("div",{children:i})}function $l({entry:t,isActive:e,onClick:r}){const i=t.avg_pct_1w,s=i>=0?"var(--red)":"var(--green)",o=(()=>{try{const a=new Date(t.week),l=`${a.getMonth()+1}/${a.getDate()}`,c=new Date(a);return c.setDate(a.getDate()-4),`${`${c.getMonth()+1}/${c.getDate()}`}〜${l}`}catch{return t.week}})();return n.jsxs("div",{onClick:r,style:{background:e?"rgba(74,158,255,0.1)":"var(--bg2)",border:`1px solid ${e?"var(--accent)":"var(--border)"}`,borderRadius:"10px",padding:"14px 16px",cursor:"pointer",transition:"all 0.15s",borderLeft:`4px solid ${s}`},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"4px",letterSpacing:"0.06em"},children:"📰 週次レポート"}),n.jsxs("div",{style:{fontSize:"14px",fontWeight:700,color:"var(--text)",marginBottom:"6px"},children:[o," 週次レポート"]}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"},children:[n.jsxs("span",{style:{fontSize:"18px",fontWeight:800,fontFamily:"var(--mono)",color:s},children:[i>=0?"+":"",i==null?void 0:i.toFixed(2),"%"]}),n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:"週間テーマ平均"}),t.generated_at&&n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",marginLeft:"auto"},children:t.generated_at.slice(0,10)})]}),t.top_theme&&n.jsxs("div",{style:{marginTop:"6px",fontSize:"11px",color:"var(--text3)"},children:["🔥 TOP: ",n.jsx("span",{style:{color:"var(--red)",fontWeight:600},children:t.top_theme})]})]})}function Fl({onNavigate:t}){var m,b;const[e,r]=S.useState(null),[i,s]=S.useState([]),[o,a]=S.useState(!0),[l,c]=S.useState(null),[d,h]=S.useState(null),[f,u]=S.useState(!1);S.useEffect(()=>{fetch("/data/weekly_report.json?t="+Date.now()).then(x=>{if(!x.ok)throw new Error("レポートがありません");return x.json()}).then(x=>{r(x),a(!1)}).catch(x=>{c(x.message),a(!1)}),fetch("/data/weekly_reports/index.json?t="+Date.now()).then(x=>x.ok?x.json():[]).then(x=>s(x)).catch(()=>{})},[]);const g=x=>{h(x),a(!0),u(!0),fetch(`/data/weekly_reports/${x}.json?t=`+Date.now()).then(p=>p.json()).then(p=>{r(p),a(!1)}).catch(()=>a(!1))},y=()=>{h(null),a(!0),u(!0),fetch("/data/weekly_report.json?t="+Date.now()).then(x=>x.json()).then(x=>{r(x),a(!1)}).catch(()=>a(!1))};if(o&&i.length===0)return n.jsx(Tn,{});if(f){const{summary:x}=e||{};return n.jsxs("div",{style:{padding:"20px 24px 80px",maxWidth:"860px",margin:"0 auto"},children:[n.jsx("button",{onClick:()=>u(!1),style:{display:"flex",alignItems:"center",gap:"6px",marginBottom:"16px",background:"transparent",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",fontSize:"12px",padding:"6px 12px",fontFamily:"var(--font)"},children:"← レポート一覧に戻る"}),n.jsxs("div",{style:{background:"linear-gradient(135deg,rgba(91,156,246,0.1),rgba(170,119,255,0.08))",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px 24px",marginBottom:"16px"},children:[n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"6px",letterSpacing:"0.1em",textTransform:"uppercase"},children:"📰 週次マーケットレポート"}),n.jsx("h1",{style:{fontSize:"18px",fontWeight:700,color:"var(--text)",marginBottom:"8px"},children:(e==null?void 0:e.title)||"レポートなし"}),n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",fontSize:"11px",color:"var(--text3)"},children:[n.jsxs("span",{children:["作成: ",e==null?void 0:e.generated_at]}),(e==null?void 0:e.next_report_at)&&n.jsxs("span",{style:{color:"var(--accent)"},children:["📅 ",e.next_report_at]})]}),x&&n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"8px",marginTop:"14px"},children:[n.jsxs("div",{style:{background:"var(--bg2)",borderRadius:"8px",padding:"8px 12px",textAlign:"center"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:"週間平均"}),n.jsxs("div",{style:{fontSize:"17px",fontWeight:700,fontFamily:"var(--mono)",color:x.avg_pct_1w>=0?"var(--red)":"var(--green)"},children:[x.avg_pct_1w>=0?"+":"",x.avg_pct_1w,"%"]})]}),n.jsxs("div",{style:{background:"var(--bg2)",borderRadius:"8px",padding:"8px 12px",textAlign:"center"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:"上昇テーマ"}),n.jsx("div",{style:{fontSize:"17px",fontWeight:700,color:"var(--red)"},children:x.rise_count})]}),n.jsxs("div",{style:{background:"var(--bg2)",borderRadius:"8px",padding:"8px 12px",textAlign:"center"},children:[n.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:"下落テーマ"}),n.jsx("div",{style:{fontSize:"17px",fontWeight:700,color:"var(--green)"},children:x.fall_count})]})]}),x&&n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginTop:"14px"},children:[n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"5px",fontWeight:600},children:"🔥 週間TOP5テーマ"}),(m=x.top5_themes)==null?void 0:m.map((p,v)=>{var w;return n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"11px",marginBottom:"3px",padding:"3px 8px",background:"rgba(255,83,112,0.06)",borderRadius:"4px",cursor:t?"pointer":"default"},onClick:()=>t==null?void 0:t("テーマ別詳細",p.theme),children:[n.jsxs("span",{style:{color:"var(--text2)"},children:[v+1,". ",p.theme]}),n.jsxs("span",{style:{color:"var(--red)",fontFamily:"var(--mono)",fontWeight:700,marginLeft:"6px",flexShrink:0},children:[p.pct>=0?"+":"",(w=p.pct)==null?void 0:w.toFixed(1),"%"]})]},p.theme)})]}),n.jsxs("div",{children:[n.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"5px",fontWeight:600},children:"❄️ 週間BOT5テーマ"}),(b=x.bot5_themes)==null?void 0:b.map((p,v)=>{var w;return n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"11px",marginBottom:"3px",padding:"3px 8px",background:"rgba(0,196,140,0.06)",borderRadius:"4px",cursor:t?"pointer":"default"},onClick:()=>t==null?void 0:t("テーマ別詳細",p.theme),children:[n.jsxs("span",{style:{color:"var(--text2)"},children:[v+1,". ",p.theme]}),n.jsxs("span",{style:{color:"var(--green)",fontFamily:"var(--mono)",fontWeight:700,marginLeft:"6px",flexShrink:0},children:[p.pct>=0?"+":"",(w=p.pct)==null?void 0:w.toFixed(1),"%"]})]},p.theme)})]})]}),(x==null?void 0:x.top5_themes)&&t&&n.jsxs("div",{style:{marginTop:"12px",display:"flex",flexWrap:"wrap",gap:"6px"},children:[n.jsx("span",{style:{fontSize:"10px",color:"var(--text3)",alignSelf:"center"},children:"注目テーマを確認:"}),x.top5_themes.slice(0,3).map(p=>n.jsxs("button",{onClick:()=>t("テーマ別詳細",p.theme),style:{padding:"4px 10px",borderRadius:"5px",fontSize:"11px",fontFamily:"var(--font)",background:"rgba(170,119,255,0.1)",border:"1px solid rgba(170,119,255,0.3)",color:"#aa77ff",cursor:"pointer",fontWeight:600},children:["📊 ",p.theme]},p.theme))]})]}),o?n.jsx(Tn,{}):n.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"24px 28px"},children:n.jsx(Ml,{text:e==null?void 0:e.report,onNavigate:t})}),n.jsxs("div",{style:{marginTop:"14px",padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"8px",fontSize:"11px",color:"var(--text3)",lineHeight:1.7},children:["⚠️ 本レポートはStockWaveJPの市場データをもとに作成した参考情報です。特定銘柄の購入・売却を推奨するものではなく、",n.jsx("strong",{style:{color:"var(--text2)"},children:"投資の最終判断はご自身の責任でお願いします。"})]}),n.jsx("div",{style:{textAlign:"center",marginTop:"24px"},children:n.jsx("button",{onClick:()=>u(!1),style:{padding:"10px 28px",borderRadius:"8px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.3)",color:"var(--accent)"},children:"← レポート一覧に戻る"})}),n.jsx("style",{children:"@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}"})]})}return n.jsxs("div",{style:{padding:"20px 24px 80px",maxWidth:"960px",margin:"0 auto"},children:[n.jsx("h1",{style:{fontSize:"20px",fontWeight:700,color:"var(--text)",marginBottom:"4px"},children:"📰 週次レポート"}),n.jsx("p",{style:{fontSize:"12px",color:"var(--text3)",marginBottom:"20px"},children:"毎週末更新予定。各カードをクリックしてレポート全文を確認できます。"}),l&&i.length===0?n.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[n.jsx("div",{style:{fontSize:"48px",marginBottom:"16px"},children:"📭"}),n.jsx("div",{style:{color:"var(--text2)",fontSize:"15px"},children:"レポートがまだありません"}),n.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginTop:"4px"},children:"毎週末 更新予定"})]}):n.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"12px"},children:i.map((x,p)=>{var v,w;return n.jsx($l,{entry:{...x,top_theme:((w=(v=x.top5_themes)==null?void 0:v[0])==null?void 0:w.theme)??null,generated_at:x.generated_at},isActive:p===0&&!d,onClick:()=>{p===0?y():g(x.week)}},x.week)})}),n.jsx("style",{children:"@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}"})]})}const li=[{icon:"🏠",label:"ホーム",component:Na},{icon:"📊",label:"テーマ一覧",component:rl},{icon:"🔥",label:"テーマヒートマップ",component:sl},{icon:"🔍",label:"テーマ別詳細",component:vl},{icon:"📋",label:"市場別詳細",component:ul},{icon:"🎨",label:"カスタムテーマ",component:jl}],ci=[{icon:"🏢",label:"当サイトについて",component:Bl},{icon:"📣",label:"お知らせ",component:Hl},{icon:"📖",label:"使い方",component:Pl},{icon:"📰",label:"週次レポート",component:Fl},{icon:"📝",label:"コラム・解説",component:Nl},{icon:"⚙️",label:"設定",component:Tl},{icon:"⚖️",label:"免責事項",component:Rl},{icon:"🔒",label:"プライバシーポリシー",component:Dl},{icon:"📋",label:"利用規約",component:Ll}],Cn="https://forms.gle/XjNypTdmZt265Kib6",zl=[...li,...ci],Rn="swjp_color_theme";function Ul(){const[t,e]=S.useState("ホーム"),[r,i]=S.useState(null),[s,o]=S.useState(null);S.useEffect(()=>{const w=window.location.hash.replace("#","");if(w.startsWith("column/")){const I=w.replace("column/","");e("コラム・解説"),i(I)}else w==="terms"?e("利用規約"):w==="privacy"&&e("プライバシーポリシー");const H=()=>{const I=window.location.hash.replace("#","");if(I.startsWith("column/")){const C=I.replace("column/","");e("コラム・解説"),i(C)}};return window.addEventListener("hashchange",H),()=>window.removeEventListener("hashchange",H)},[]);const[a,l]=S.useState(!1),[c,d]=S.useState("auto"),[h,f]=S.useState(()=>typeof window<"u"&&window.innerWidth<=1200),[u,g]=S.useState(()=>localStorage.getItem(Rn)||"dark"),y=Si();S.useEffect(()=>{document.documentElement.setAttribute("data-theme",u),localStorage.setItem(Rn,u)},[u]),S.useEffect(()=>{const w=()=>{if(c==="mobile"){f(!0);return}if(c==="pc"){f(!1);return}f(window.innerWidth<=1200)};return w(),window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[c]);const m=zl.find(w=>w.label===t),b=m==null?void 0:m.component,x=(w,H=null)=>{e(w),l(!1),i(H),o(w==="テーマ別詳細"&&H||null),w==="コラム・解説"&&H?window.history.replaceState(null,"",`#column/${H}`):w==="利用規約"?window.history.replaceState(null,"","#terms"):w==="プライバシーポリシー"?window.history.replaceState(null,"","#privacy"):window.history.replaceState(null,"",window.location.pathname)},p=()=>{e("ホーム"),l(!1)},v=t==="設定"?{viewMode:c,onViewModeChange:d,colorTheme:u,onColorThemeChange:g,isMobile:h}:t==="ホーム"?{onNavigate:x,isMobile:h}:t==="コラム・解説"?{initialArticleId:r,onNavigate:x,isMobile:h}:t==="テーマ一覧"?{onNavigate:x,isMobile:h}:t==="テーマ別詳細"?{onNavigate:x,initialTheme:s,isMobile:h}:t==="テーマヒートマップ"?{onNavigate:x,isMobile:h}:t==="週次レポート"?{onNavigate:x,isMobile:h}:t==="市場別詳細"?{onNavigate:x,isMobile:h}:{isMobile:h};return n.jsxs("div",{style:{minHeight:"100vh",background:"var(--bg)"},children:[n.jsx(Ha,{status:y,onMenuClick:()=>l(w=>!w),sidebarOpen:a,viewMode:c,onViewModeChange:d,onLogoClick:p}),a&&h&&n.jsx("div",{onClick:()=>l(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:800}}),n.jsx(Ia,{pages:li,pagesOther:ci,currentPage:t,onPageChange:x,isOpen:a,isMobile:h,onOpen:()=>l(!0),onClose:()=>l(!1),contactUrl:Cn}),n.jsxs("main",{style:{marginLeft:h?"0":"var(--sidebar)",paddingTop:"var(--header)",minHeight:"100vh",transition:"margin-left 0.25s",background:"var(--bg)"},children:[b?n.jsx(b,{...v}):n.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"calc(100vh - var(--header))",flexDirection:"column",gap:"16px",color:"var(--text3)"},children:[n.jsx("div",{style:{fontSize:"48px"},children:m==null?void 0:m.icon}),n.jsx("div",{style:{fontSize:"18px",fontWeight:600,color:"var(--text2)"},children:t}),n.jsx("div",{style:{fontSize:"13px"},children:"このページは準備中です"})]}),n.jsxs("footer",{style:{borderTop:"1px solid var(--border)",padding:"16px 24px",textAlign:"center",color:"var(--text3)",fontSize:"11px"},children:[n.jsxs("div",{style:{marginBottom:"8px",display:"flex",justifyContent:"center",gap:"20px",flexWrap:"wrap"},children:[n.jsx("button",{onClick:()=>x("免責事項"),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font)",padding:0,textDecoration:"underline",textUnderlineOffset:"2px"},children:"免責事項"}),n.jsx("button",{onClick:()=>x("プライバシーポリシー"),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font)",padding:0,textDecoration:"underline",textUnderlineOffset:"2px"},children:"プライバシーポリシー"}),n.jsx("button",{onClick:()=>x("利用規約"),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:"11px",fontFamily:"var(--font)",padding:0,textDecoration:"underline",textUnderlineOffset:"2px"},children:"利用規約"}),n.jsx("a",{href:Cn,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--text3)",fontSize:"11px",fontFamily:"var(--font)",textDecoration:"underline",textUnderlineOffset:"2px"},children:"お問い合わせ"})]}),n.jsxs("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"2px 0",alignItems:"center"},children:[n.jsx("span",{style:{color:"#e63030",fontWeight:700},children:"Stock"}),n.jsx("span",{style:{fontWeight:700,color:"var(--text2)"},children:"Wave"}),n.jsx("span",{style:{color:"#e63030",fontWeight:700,fontSize:"10px"},children:"JP"}),n.jsx("span",{style:{whiteSpace:"nowrap"},children:" — stockwavejp.com"}),n.jsx("span",{style:{whiteSpace:"nowrap"},children:" — 投資助言ではありません"}),n.jsx("span",{style:{whiteSpace:"nowrap"},children:" — © 2026"})]})]})]})]})}(function(){const e="swjp_v3_",r=["swjp_","swjp_v1_","swjp_v2_"];try{Object.keys(localStorage).forEach(s=>{const o=r.some(l=>s.startsWith(l)),a=s.startsWith(e);o&&!a&&localStorage.removeItem(s)})}catch{}})();function Jl(){return n.jsx(ka,{children:n.jsx(Ul,{})})}Nn(document.getElementById("root")).render(n.jsx(S.StrictMode,{children:n.jsx(Jl,{})}));
