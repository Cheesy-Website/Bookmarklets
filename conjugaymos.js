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
            if(!val){
                console.log("[EXT] Set Answer clicked but input is empty");
                return;
            }

            const answerInput=document.querySelector("#answer-input");
            if(answerInput){
                answerInput.value=val;
                answerInput.dispatchEvent(new Event("input",{bubbles:true}));
                answerInput.dispatchEvent(new Event("change",{bubbles:true}));
                console.log("[EXT] Set Answer: typed into #answer-input ->", val);
            } else {
                console.log("[EXT] Set Answer: #answer-input not found");
            }
        };

        box.appendChild(input);
        box.appendChild(btn);
        document.body.appendChild(box);
        console.log("[EXT] Manual answer box created");
    }

    function autoFillAnswer(){
        createManualBox();

        const answerField=document.querySelector("#answer-field");
        if(!answerField) {
            console.log("[EXT] autoFillAnswer: #answer-field not found");
            return;
        }

        const answerSpan=Array.from(answerField.querySelectorAll("span"))
            .find(s=>s.className.includes("bg-crimson"));
        if(!answerSpan){
            console.log("[EXT] autoFillAnswer: correct answer span not found");
            return;
        }

        const answerText=answerSpan.textContent.trim();
        if(!answerText){
            console.log("[EXT] autoFillAnswer: answer text empty");
            return;
        }

        const manualInput=document.querySelector("#manual-answer-box input");
        if(!manualInput){
            console.log("[EXT] autoFillAnswer: manual input not found");
            return;
        }

        if(manualInput.value!==answerText){
            manualInput.value=answerText;
            manualInput.dispatchEvent(new Event("input",{bubbles:true}));
            manualInput.dispatchEvent(new Event("change",{bubbles:true}));
            console.log("[EXT] Auto-filled manual box with:", answerText);
        }

        const answerInput=document.querySelector("#answer-input");
        if(answerInput && answerInput.value!==answerText){
            answerInput.value=answerText;
            answerInput.dispatchEvent(new Event("input",{bubbles:true}));
            answerInput.dispatchEvent(new Event("change",{bubbles:true}));
            console.log("[EXT] Auto-filled #answer-input with:", answerText);
        } else if(!answerInput){
            console.log("[EXT] #answer-input not found for auto-fill");
        }
    }

    setInterval(autoFillAnswer,1000);
})();
