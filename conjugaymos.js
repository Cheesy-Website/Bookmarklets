// ==UserScript==
// @name         ConjuGAYmos show, save & auto answer
// @namespace    http://tampermonkey.net/
// @version      2026-03-03
// @description  Show, save, and auto-fill answers on Conjuguemos
// @author       Alex
// @match        https://conjuguemos.com/*
// @grant        none
// ==/UserScript==

(function(){
    'use strict';

    /* ---------- Helpers ---------- */
    function getQuestionText(){
        const el = document.querySelector("#question-input");
        return el ? el.textContent.trim() : null;
    }

    function getStorageKey(){
        const q = getQuestionText();
        return q ? "answer_" + q.toLowerCase() : null;
    }

    /* ---------- Manual Answer Box ---------- */
    function createManualBox(){
        if(document.getElementById("manual-answer-box")) return;

        const box = document.createElement("div");
        box.id = "manual-answer-box";
        box.style.cssText = `
            position: fixed; top: 50px; left: 10px; width: 220px;
            background: white; border: 1px solid black; padding: 10px;
            z-index: 999999; box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        `;

        const input = document.createElement("input");
        input.placeholder = "Type answer…";
        input.style.cssText = "width:100%; margin-bottom:6px;";

        const btn = document.createElement("button");
        btn.textContent = "Set Answer";
        btn.style.width = "100%";
        btn.onclick = () => {
            const val = input.value.trim();
            if(!val) return;

            const key = getStorageKey();
            if(key) localStorage.setItem(key, val);

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

    /* ---------- Auto-fill manual box from answer-field ---------- */
    function autoFillAnswer(){
        createManualBox();

        const field = document.querySelector("#answer-field");
        if(!field) return;

        const span = Array.from(field.querySelectorAll("span")).find(s=>s.className.includes("bg-crimson"));
        if(!span) return;

        const answer = span.textContent.trim();
        if(!answer) return;

        const input = document.querySelector("#manual-answer-box input");
        if(input && input.value !== answer){
            input.value = answer;
        }

        // Auto-fill saved answer if exists
        const key = getStorageKey();
        const saved = key ? localStorage.getItem(key) : null;
        const answerInput = document.querySelector("#answer-input");
        if(saved && answerInput){
            answerInput.value = saved;
            answerInput.dispatchEvent(new Event("input",{bubbles:true}));
            answerInput.dispatchEvent(new Event("change",{bubbles:true}));
            answerInput.dispatchEvent(new Event("keyup",{bubbles:true}));
        }
    }

    /* ---------- Observe question changes ---------- */
    let lastQ = "";
    const observer = new MutationObserver(()=>{
        const q = getQuestionText();
        if(q && q !== lastQ){
            lastQ = q;
            autoFillAnswer();
        }
    });
    const target = document.querySelector("#question-input");
    if(target) observer.observe(target, {childList:true, subtree:true});

    /* ---------- Periodic auto-fill ---------- */
    setInterval(autoFillAnswer, 1000);

})();
