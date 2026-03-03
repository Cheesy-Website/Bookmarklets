// ==UserScript==
// @name         ConjuGAYmos Show + Auto Answer
// @namespace    http://tampermonkey.net/
// @version      2026-03-03
// @description  Show and auto-fill answers on Conjuguemos
// @author       Alex
// @match        https://conjuguemos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=conjuguemos.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- Helpers ---------- */
    function getQuestionText() {
        const el = document.querySelector("#pronoun-input") && document.querySelector("#verb-input");
        if(!el) return null;
        return `${document.querySelector("#pronoun-input").textContent.trim()}|${document.querySelector("#verb-input").textContent.trim()}`;
    }

    function getStorageKey() {
        const q = getQuestionText();
        return q ? "answer_" + q.toLowerCase() : null;
    }

    /* ---------- Manual Answer Box ---------- */
    function createManualBox() {
        if(document.getElementById("manual-answer-box")) return;

        const box = document.createElement("div");
        box.id = "manual-answer-box";
        box.style.position = "fixed";
        box.style.top = "50px";
        box.style.left = "10px";
        box.style.background = "white";
        box.style.border = "1px solid black";
        box.style.padding = "10px";
        box.style.zIndex = 999999;
        box.style.width = "220px";
        box.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";

        const input = document.createElement("input");
        input.placeholder = "Type answer…";
        input.style.width = "100%";
        input.style.marginBottom = "6px";

        const btn = document.createElement("button");
        btn.textContent = "Set Answer";
        btn.style.width = "100%";

        btn.onclick = function() {
            const val = input.value.trim();
            if(!val) return;

            const key = getStorageKey();
            if(!key) return;

            localStorage.setItem(key, val);

            const answerInput = document.querySelector("#answer-input");
            if(answerInput){
                answerInput.value = val;
                answerInput.dispatchEvent(new Event("input",{bubbles:true}));
                answerInput.dispatchEvent(new Event("change",{bubbles:true}));
                answerInput.dispatchEvent(new Event("keyup",{bubbles:true}));
            }
        };

        box.appendChild(input);
        box.appendChild(btn);
        document.body.appendChild(box);
    }

    /* ---------- Auto-fill / Show Answer ---------- */
    function autoFill() {
        createManualBox();

        const key = getStorageKey();
        const saved = key ? localStorage.getItem(key) : null;

        const answerInput = document.querySelector("#answer-input");
        const manualInput = document.querySelector("#manual-answer-box input");

        // Fill saved answer
        if(saved){
            if(answerInput && answerInput.value !== saved){
                answerInput.value = saved;
                answerInput.dispatchEvent(new Event("input",{bubbles:true}));
                answerInput.dispatchEvent(new Event("change",{bubbles:true}));
                answerInput.dispatchEvent(new Event("keyup",{bubbles:true}));
            }
            if(manualInput && manualInput.value !== saved){
                manualInput.value = saved;
            }
        }

        // Check correct answer span
        const field = document.querySelector("#answer-field");
        if(field){
            const span = Array.from(field.querySelectorAll("span"))
                .find(s => s.className.includes("bg-crimson"));
            if(span){
                const answer = span.textContent.trim();
                if(manualInput && manualInput.value !== answer){
                    manualInput.value = answer;
                }
                if(answerInput && answerInput.value !== answer){
                    answerInput.value = answer;
                    answerInput.dispatchEvent(new Event("input",{bubbles:true}));
                    answerInput.dispatchEvent(new Event("change",{bubbles:true}));
                    answerInput.dispatchEvent(new Event("keyup",{bubbles:true}));
                }
            }
        }
    }

    /* ---------- Start Auto-Fill Interval ---------- */
    setInterval(autoFill, 1000);
})();
