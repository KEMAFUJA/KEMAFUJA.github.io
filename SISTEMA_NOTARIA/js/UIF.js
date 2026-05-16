const UIF = document.getElementById('UIF');
const UIFcv = document.getElementById('CV');
const UIFSoc = document.getElementById('Soc');
const autoUIF = document.getElementById("autoUIF");


tipoDocumento.addEventListener("change", function(){

        if(this.value === "Compra/Venta"){
            UIFSoc.style.display = "none";
            
            UIF.style.display = "inline-block";
            UIFcv.style.display = "inline-block";
            
        } else if(this.value === "Sociedad"){
            UIFcv.style.display = "none";

            UIF.style.display = "inline-block";
            UIFSoc.style.display = "inline-block";

        } else {
            UIF.style.display = "none";
            UIFcv.style.display = "none";
            UIFSoc.style.display = "none";

        }

    });

autoUIF.addEventListener("change", function(){

    if(this.checked){
        if(UIFcv.style.display !== "none"){
            UIFcv.style.display = "none";
        }

        if(UIFSoc.style.display !== "none"){
            UIFSoc.style.display = "none";
        }

    } else {
        if(tipoDocumento.value === "Compra/Venta"){
            UIFcv.style.display = "inline-block";
        }

        if(tipoDocumento.value === "Sociedad"){
            UIFSoc.style.display = "inline-block";
        }
    }

});


const cv5 = document.querySelector('input[name="uif[cv-5]"]');
const cv7 = document.querySelector('input[name="uif[cv-7]"]');

cv5.addEventListener('change', () => {
    if (cv5.checked) {
        cv7.checked = false;
    }
});

cv7.addEventListener('change', () => {
    if (cv7.checked) {
        cv5.checked = false;
    }
});

const soc8 = document.querySelector('input[name="uif[soc-8]"]');
const soc10 = document.querySelector('input[name="uif[soc-10]"]');

soc8.addEventListener('change', () => {
    if (soc8.checked) {
        soc10.checked = false;
    }
});

soc10.addEventListener('change', () => {
    if (soc10.checked) {
        soc8.checked = false;
    }
});

document.addEventListener("keydown", function(e){
    const activo = document.activeElement;

    if(e.altKey && e.key.toLowerCase() === "u"){
        e.preventDefault();
        const primerNombre = document.querySelector('input[name="Auto"]');

        if(primerNombre){
            primerNombre.focus();
        }

    }

});