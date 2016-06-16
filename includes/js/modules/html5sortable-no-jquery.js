/*
 * HTML5 Sortable library
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 * jQuery-independent implementation by Nazar Mokrynskyi <nazar@mokrynskyi.com>
 *
 * Released under the MIT license.
 */
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.sortable=t()}(this,function(){"use strict";var e,t,n,r=[],a=[],i=function(e,t,n){return void 0===n?e&&e.h5s&&e.h5s.data&&e.h5s.data[t]:(e.h5s=e.h5s||{},e.h5s.data=e.h5s.data||{},e.h5s.data[t]=n,void 0)},o=function(e){e.h5s&&delete e.h5s.data};switch(!0){case"matches"in window.Element.prototype:n="matches";break;case"msMatchesSelector"in window.Element.prototype:n="msMatchesSelector";break;case"webkitMatchesSelector"in window.Element.prototype:n="webkitMatchesSelector"}var s=function(e,t){if(!t)return[].slice.call(e);for(var r=[],a=0;a<e.length;++a)"string"==typeof t&&e[a][n](t)&&r.push(e[a]),-1!==t.indexOf(e[a])&&r.push(e[a]);return r},l=function(e,t,n){var r,a;if(e instanceof Array)for(r=0;r<e.length;++r)l(e[r],t,n);else if(-1===t.indexOf(" "))e.addEventListener(t,n),e.h5s=e.h5s||{},e.h5s.events=e.h5s.events||{},e.h5s.events[t]=n;else for(r=0,a=t.split(" ");r<a.length;++r)l(e,a[r],n)},d=function(e,t){var n,r;if(e instanceof Array)for(n=0;n<e.length;++n)d(e[n],t);else if(-1===t.indexOf(" "))e.h5s&&e.h5s.events&&e.h5s.events[t]&&(e.removeEventListener(t,e.h5s.events[t]),delete e.h5s.events[t]);else for(n=0,r=t.split(" ");n<r.length;++n)d(e,r[n])},c=function(e,t,n){if(e instanceof Array)for(var r=0;r<e.length;++r)c(e[r],t,n);else e.setAttribute(t,n)},f=function(e,t){if(e instanceof Array)for(var n=0;n<e.length;++n)f(e[n],t);else e.removeAttribute(t)},h=function(e){var t=e.getClientRects()[0];return{left:t.left+window.scrollX,top:t.top+window.scrollY}},u=function(e){d(e,"dragstart dragend selectstart dragover dragenter drop")},p=function(e){d(e,"dragover dragenter drop")},g=function(e,t){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",""),e.dataTransfer.setDragImage&&e.dataTransfer.setDragImage(t.draggedItem,t.x,t.y)},m=function(e,t){return t.x||(t.x=parseInt(e.pageX-h(t.draggedItem).left)),t.y||(t.y=parseInt(e.pageY-h(t.draggedItem).top)),t},v=function(e){return{draggedItem:e}},y=function(e,t){var n=v(t);n=m(e,n),g(e,n)},b=function(e){o(e),f(e,"aria-dropeffect")},E=function(e){f(e,"aria-grabbed"),f(e,"draggable"),f(e,"role")},w=function(e,t){return e===t?!0:void 0!==i(e,"connectWith")?i(e,"connectWith")===i(t,"connectWith"):!1},x=function(e,t){var n,r=[];if(!t)return e;for(var a=0;a<e.length;++a)n=e[a].querySelectorAll(t),r=r.concat([].slice.call(n));return r},I=function(e){var t=i(e,"opts")||{},n=s(e.children,t.items),r=x(n,t.handle);p(e),b(e),d(r,"mousedown"),u(n),E(n)},C=function(e){var t=i(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);c(e,"aria-dropeffect","move"),c(r,"draggable","true");var a=(document||window.document).createElement("span");"function"!=typeof a.dragDrop||t.disableIEFix||l(r,"mousedown",function(){if(-1!==n.indexOf(this))this.dragDrop();else{for(var e=this.parentElement;-1===t.items.indexOf(e);)e=e.parentElement;e.dragDrop()}})},D=function(e){var t=i(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);c(e,"aria-dropeffect","none"),c(r,"draggable","false"),d(r,"mousedown")},A=function(e){var t=i(e,"opts"),n=s(e.children,t.items),r=x(n,t.handle);u(n),d(r,"mousedown"),p(e)},S=function(e){return e.parentElement?[].indexOf.call(e.parentElement.children,e):0},O=function(e){return!!e.parentNode},L=function(e){if("string"!=typeof e)return e;var t=document.createElement("div");return t.innerHTML=e,t.firstChild},W=function(e,t){e.parentElement.insertBefore(t,e)},N=function(e,t){e.parentElement.insertBefore(t,e.nextElementSibling)},T=function(e){e.parentNode&&e.parentNode.removeChild(e)},M=function(e,t){var n=document.createEvent("Event");return t&&(n.detail=t),n.initEvent(e,!1,!0),n},k=function(e,t){a.forEach(function(n){w(e,n)&&n.dispatchEvent(t)})},P=function(n,o){var d=String(o);return o=function(e){var t={connectWith:!1,placeholder:null,dragImage:null,disableIEFix:!1,placeholderClass:"sortable-placeholder",draggingClass:"sortable-dragging",hoverClass:!1};for(var n in e)t[n]=e[n];return t}(o),"string"==typeof n&&(n=document.querySelectorAll(n)),n instanceof window.Element&&(n=[n]),n=[].slice.call(n),n.forEach(function(n){if(/enable|disable|destroy/.test(d))return void P[d](n);o=i(n,"opts")||o,i(n,"opts",o),A(n);var f,u,p=s(n.children,o.items),m=o.placeholder;if(m||(m=document.createElement(/^ul|ol$/i.test(n.tagName)?"li":"div")),m=L(m),m.classList.add.apply(m.classList,o.placeholderClass.split(" ")),!n.getAttribute("data-sortable-id")){var v=a.length;a[v]=n,c(n,"data-sortable-id",v),c(p,"data-item-sortable-id",v)}if(i(n,"items",o.items),r.push(m),o.connectWith&&i(n,"connectWith",o.connectWith),C(n),c(p,"role","option"),c(p,"aria-grabbed","false"),o.hoverClass){var b="sortable-over";"string"==typeof o.hoverClass&&(b=o.hoverClass),l(p,"mouseenter",function(){this.classList.add(b)}),l(p,"mouseleave",function(){this.classList.remove(b)})}l(p,"dragstart",function(r){r.stopImmediatePropagation(),o.dragImage?(g(r,{draggedItem:o.dragImage,x:0,y:0}),console.log("WARNING: dragImage option is deprecated and will be removed in the future!")):y(r,this),this.classList.add(o.draggingClass),e=this,c(e,"aria-grabbed","true"),f=S(e),t=parseInt(window.getComputedStyle(e).height),u=this.parentElement,k(n,M("sortstart",{item:e,placeholder:m,startparent:u}))}),l(p,"dragend",function(){var a;e&&(e.classList.remove(o.draggingClass),c(e,"aria-grabbed","false"),e.style.display=e.oldDisplay,delete e.oldDisplay,r.forEach(T),a=this.parentElement,k(n,M("sortstop",{item:e,startparent:u})),f===S(e)&&u===a||k(n,M("sortupdate",{item:e,index:s(a.children,i(a,"items")).indexOf(e),oldindex:p.indexOf(e),elementIndex:S(e),oldElementIndex:f,startparent:u,endparent:a})),e=null,t=null)}),l([n,m],"drop",function(t){var a;w(n,e.parentElement)&&(t.preventDefault(),t.stopPropagation(),a=r.filter(O)[0],N(a,e),e.dispatchEvent(M("dragend")))}),l(p.concat(n),"dragover dragenter",function(a){if(w(n,e.parentElement))if(a.preventDefault(),a.stopPropagation(),a.dataTransfer.dropEffect="move",-1!==p.indexOf(this)){var i=parseInt(window.getComputedStyle(this).height),l=S(m),d=S(this);if(o.forcePlaceholderSize&&(m.style.height=t+"px"),i>t){var c=i-t,f=h(this).top;if(d>l&&a.pageY<f+c)return;if(l>d&&a.pageY>f+i-c)return}void 0===e.oldDisplay&&(e.oldDisplay=e.style.display),e.style.display="none",d>l?N(this,m):W(this,m),r.filter(function(e){return e!==m}).forEach(T)}else-1!==r.indexOf(this)||s(this.children,o.items).length||(r.forEach(T),this.appendChild(m))})}),n};return P.destroy=function(e){I(e)},P.enable=function(e){C(e)},P.disable=function(e){D(e)},P});
