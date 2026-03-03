// ==UserScript==
// @name         ConjuGAYmos show answer and auto answer
// @namespace    http://tampermonkey.net/
// @version      2026-02-06
// @description  It's self explanitory, dumbass
// @author       Alex
// @match        https://conjuguemos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=conjuguemos.com
// @grant        none
// ==/UserScript==

javascript:(function(){
    const inject=document.createElement("script");
    inject.textContent=`
      (function(){
        if(typeof window.settings==="undefined") window.settings={};
        window.settings.see_correct=true;
        console.log("[PAGE] settings.see_correct = true");
      })();
    `;
    document.documentElement.appendChild(inject);
    inject.remove();
})();

javascript:(function(){
    function createManualBox(){
        if(document.getElementById("manual-answer-box")) return;

        const box=document.createElement("div");
        box.id="manual-answer-box";
        box.style.position="fixed";
        box.style.top="50px";
        box.style.left="10px";
        box.style.background="white";
        box.style.border="1px solid black";
        box.style.padding="10px";
        box.style.zIndex=999999;
        box.style.width="220px";
        box.style.boxShadow="0 3px 10px rgba(0,0,0,0.3)";

        const input=document.createElement("input");
        input.placeholder="Type answer…";
        input.style.width="100%";
        input.style.marginBottom="6px";

        const btn=document.createElement("button");
        btn.textContent="Set Answer";
        btn.style.width="100%";

        btn.onclick=function(){
            const val=input.value.trim();
            if(!val){
                console.log("[EXT] No value to set");
                return;
            }

            if(!window.$){
                console.log("[EXT] jQuery not found");
                return;
            }

            const $answer=$("#answer-input");
            if(!$answer.length){
                console.log("[EXT] #answer-input not found");
                return;
            }

            console.log("[EXT] Setting answer-input to:", val);
            $answer
                .val(val)
                .trigger("input")
                .trigger("change")
                .trigger("keyup");

            console.log("[EXT] Answer successfully injected");
        };

        box.appendChild(input);
        box.appendChild(btn);
        document.body.appendChild(box);
        console.log("[EXT] Manual answer box created");
    }

    function autoFill(){
        createManualBox();

        const field=document.querySelector("#answer-field");
        if(!field){
            console.log("[EXT] No answer-field yet");
            return;
        }

        const span=[...field.querySelectorAll("span")]
            .find(s=>s.className.includes("bg-crimson"));

        if(!span){
            console.log("[EXT] No correct-answer span yet");
            return;
        }

        const answer=span.textContent.trim();
        if(!answer) return;

        const input=document.querySelector("#manual-answer-box input");
        if(input.value!==answer){
            input.value=answer;
            console.log("[EXT] Manual box filled with:", answer);
        }
    }

    setInterval(autoFill,1000);
})();



