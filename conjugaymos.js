// ==UserScript==
// @name         Conjuguemos Auto Save + Auto Answer + Auto Submit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Saves answers, auto-fills them, and auto-submits
// @match        https://conjuguemos.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    console.log("[EXT] Script loaded");

    let delayMs = 5000; // default

    /* ---------- ASK DELAY ---------- */
    function askDelay() {
        let delay = prompt("Seconds between auto-submit:", "5");
        if (!delay) return;

        delay = parseFloat(delay);
        if (!isNaN(delay) && delay > 0) {
            delayMs = delay * 1000;
        }

        console.log("[EXT] Auto-submit every", delayMs, "ms");
    }

    /* ---------- QUESTION KEY ---------- */
    function getQuestionKey() {
        const q = document.querySelector("#question-input")?.textContent.trim();
        if (q) return "cg_" + q.toLowerCase();

        const pronoun = document.querySelector("#pronoun-input")?.textContent.trim();
        const verb = document.querySelector("#verb-input")?.textContent.trim();

        if (pronoun && verb) {
            return `cg_${pronoun}|${verb}`.toLowerCase();
        }

        return null;
    }

    /* ---------- TYPE ANSWER ---------- */
    function typeAnswer(value) {
        const input = document.querySelector("#answer-input");
        if (!input) return false;

        input.focus();
        input.value = value;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        console.log("[EXT] Typed:", value);
        return true;
    }

    /* ---------- MAIN LOOP ---------- */
    function loop() {
        const key = getQuestionKey();
        if (!key) return;

        const input = document.querySelector("#answer-input");
        const btn = document.querySelector(".js-check-button");
        if (!input || !btn) return;

        /* 🔹 LOAD SAVED ANSWER */
        const saved = localStorage.getItem(key);
        if (saved && input.value !== saved) {
            console.log("[EXT] Auto-fill:", saved);
            typeAnswer(saved);
        }

        /* 🔹 SAVE FROM RED ANSWER */
        const span = document.querySelector("#answer-field span[class*='bg-crimson']");
        if (span) {
            const answer = span.textContent.trim();
            if (answer && localStorage.getItem(key) !== answer) {
                localStorage.setItem(key, answer);
                console.log("[EXT] Saved:", key, "=", answer);
            }

            if (input.value !== answer) {
                typeAnswer(answer);
            }
        }

        /* 🔹 AUTO SUBMIT */
        if (!btn.classList.contains("disabled") && input.value.trim()) {
            btn.click();
            console.log("[EXT] Submitted");
        }
    }

    /* ---------- WAIT FOR GAME ---------- */
    function waitForGame() {
        const input = document.querySelector("#answer-input");
        if (input) {
            console.log("[EXT] Game detected");

            askDelay();

            setInterval(loop, 400);          // fast logic loop
            setInterval(loop, delayMs);      // slower submit loop
        } else {
            setTimeout(waitForGame, 500);
        }
    }

    waitForGame();

})();
