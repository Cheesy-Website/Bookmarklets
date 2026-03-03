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

            const answerInput=document.querySelector("#answer-input");
            if(!answerInput){
                console.log("[EXT] #answer-input not found");
                return;
            }

            console.log("[EXT] Injecting answer:", val);

            // 🔑 THIS IS THE IMPORTANT PART
            answerInput.focus();
            answerInput.value = val;

            answerInput.dispatchEvent(new Event("input", { bubbles: true }));
            answerInput.dispatchEvent(new Event("change", { bubbles: true }));
            answerInput.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "a" }));

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
        if(!field) return;

        const span=[...field.querySelectorAll("span")]
            .find(s=>s.className.includes("bg-crimson"));

        if(!span) return;

        const answer=span.textContent.trim();
        if(!answer) return;

        const input=document.querySelector("#manual-answer-box input");
        if(input && input.value!==answer){
            input.value=answer;
            console.log("[EXT] Manual box filled with:", answer);
        }
    }

    setInterval(autoFill,1000);
})();
