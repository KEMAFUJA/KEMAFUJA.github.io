document.addEventListener("keyup", function(e){

    if(e.target.tagName === "INPUT"){

        if(e.getModifierState("CapsLock")){
            e.target.classList.add("capslock-activo");
        }else{
            e.target.classList.remove("capslock-activo");
        }

    }

});

document.addEventListener("focusin", function(e){
    const el = e.target;

    // solo inputs, selects y textarea
    if(!el.matches("input, select, textarea")) return;

el.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
});

});
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("numero").focus();
});