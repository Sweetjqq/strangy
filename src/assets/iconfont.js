(function(window){var svgSprite='<svg><symbol id="icon-yonghu" viewBox="0 0 1024 1024"><path d="M977.92 856.576V796.16c0-123.904-219.648-157.696-219.648-157.696h-443.392S92.16 672.256 92.16 796.16v60.416s-0.512 45.568 71.168 47.104c71.68 1.536 373.76 0 373.76 0s300.544 1.536 372.224 0 68.608-47.104 68.608-47.104z" fill="#F04D4E" ></path><path d="M614.4 629.76h-76.288l-223.232 4.608S92.16 672.768 92.16 796.672v60.416s-0.512 45.568 71.168 47.104c71.68 1.536 72.192-1.024 72.192-1.024L453.632 737.28H614.4V629.76z" fill="#D84850" ></path><path d="M404.48 501.76h266.24v163.84h-266.24z" fill="#C7928E" ></path><path d="M785.408 268.288S819.2 371.712 727.04 433.664v-185.344l58.368 19.968zM274.432 268.288S256 371.712 332.8 433.664v-185.344l-58.368 19.968z" fill="#333333" ></path><path d="M332.8 249.344v188.928s45.056 162.816 205.824 162.816S742.4 435.2 742.4 435.2v-172.544s10.24-245.76-203.776-245.76S332.8 249.344 332.8 249.344z" fill="#FECCCB" ></path><path d="M537.6 601.088c-158.72 0-204.8-162.816-204.8-162.816v-188.928s-10.24-232.96 204.8-232.96V601.088z" fill="#D8AEAF" ></path><path d="M450.048 150.016S484.352 286.72 801.792 286.72c0 0-5.12-273.408-263.168-273.408s-266.24 273.408-266.24 273.408 108.032-29.184 177.664-136.704z" fill="#2B2B2B" ></path><path d="M399.872 549.376l-84.48 88.064 138.24 102.4L541.184 670.72z" fill="#B6D5D0" ></path><path d="M673.28 549.376L757.76 637.44l-137.728 102.4L531.968 670.72z" fill="#B6D5D0" ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)