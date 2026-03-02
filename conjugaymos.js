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
        input.type="text";
        input.placeholder="Type answer…";
        input.style.width="100%";
        input.style.marginBottom="6px";

        const btn=document.createElement("button");
        btn.textContent="Set Answer";
        btn.style.width="100%";
        btn.style.cursor="pointer";

        btn.onclick=function(){
            const val=input.value.trim();
            if(!val) return;

            // Fill the actual #verb-input span
            const verbInput=document.querySelector("#verb-input");
            if(verbInput){
                verbInput.textContent=val;
                verbInput.dispatchEvent(new Event("input",{bubbles:true,composed:true}));
                verbInput.dispatchEvent(new Event("change",{bubbles:true,composed:true}));
            }
        };

        box.appendChild(input);
        box.appendChild(btn);
        document.body.appendChild(box);
    }

    function autoFillAnswer(){
        createManualBox();

        const answerField=document.querySelector("#answer-field");
        if(!answerField) return;

        const answerSpan=Array.from(answerField.querySelectorAll("span"))
            .find(s=>s.className.includes("bg-crimson"));
        if(!answerSpan) return;

        const answerText=answerSpan.textContent.trim();
        if(!answerText) return;

        const input=document.querySelector("#manual-answer-box input");
        if(!input) return;

        if(input.value!==answerText){
            input.value=answerText;
            input.dispatchEvent(new Event("input",{bubbles:true}));
            input.dispatchEvent(new Event("change",{bubbles:true}));
        }
    }

    setInterval(autoFillAnswer,1000);
})();
