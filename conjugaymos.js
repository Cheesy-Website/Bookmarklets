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
    function getQuestionText() {
        const pronoun = document.querySelector("#pronoun-input")?.textContent.trim();
        const verb = document.querySelector("#verb-input")?.textContent.trim();
        return pronoun && verb ? pronoun + "|" + verb : null;
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
        box.style.cssText = `
            position: fixed; top: 50px; left: 10px; width: 240px;
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

    /* ---------- Observe answers and save them ---------- */
    function observeAnswers() {
        createManualBox();
        const field = document.querySelector("#answer-field");
        if(!field) return;

        const span = Array.from(field.querySelectorAll("span")).find(s=>s.className.includes("bg-crimson"));
        if(!span) return;

        const answer = span.textContent.trim();
        if(!answer) return;

        // Save to localStorage
        const key = getStorageKey();
        if(key) localStorage.setItem(key, answer);

        // Fill the manual box
        const manualInput = document.querySelector("#manual-answer-box input");
        if(manualInput && manualInput.value !== answer) manualInput.value = answer;

        // Fill the real answer input
        const answerInput = document.querySelector("#answer-input");
        if(answerInput && answerInput.value !== answer){
            answerInput.value = answer;
            answerInput.dispatchEvent(new Event("input",{bubbles:true}));
            answerInput.dispatchEvent(new Event("change",{bubbles:true}));
            answerInput.dispatchEvent(new Event("keyup",{bubbles:true}));
        }
    }

    /* ---------- Auto-fill saved answers for same question ---------- */
    function autofillSaved() {
        const key = getStorageKey();
        const saved = key ? localStorage.getItem(key) : null;
        if(!saved) return;

        const answerInput = document.querySelector("#answer-input");
        const manualInput = document.querySelector("#manual-answer-box input");

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

    /* ---------- Main loop ---------- */
    let lastQ = "";
    const observer = new MutationObserver(()=>{
        const q = getQuestionText();
        if(!q) return;
        if(q !== lastQ){
            lastQ = q;
            autofillSaved();
        }
        observeAnswers();
    });

    const questionNode = document.querySelector("#pronoun-input");
    if(questionNode) observer.observe(questionNode.parentNode, {childList:true, subtree:true});

    // Run every second in case elements appear late
    setInterval(()=>{
        autofillSaved();
        observeAnswers();
    }, 1000);

})();
