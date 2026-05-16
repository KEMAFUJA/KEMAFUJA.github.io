document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("Form");

    form.addEventListener("input", function(e){

    const el = e.target;

    if(el.name === "municipio"){
        let valor = el.value.replace(/[^a-zA-Z áéíóúÁÉÍÓÚ]/g, '');
        valor = valor.charAt(0).toUpperCase() + valor.slice(1);
        el.value = valor;
    }

    if(el.name === "calidad[]"){
        let valor = el.value.replace(/[^a-zA-Z áéíóúÁÉÍÓÚ ]/g, '');
        valor = valor.replace(/\b[a-záéíóúñ]/g, letra => letra.toUpperCase());
        el.value = valor;
    }

    if(el.name === "beneficiarios"){
        el.value = el.value.replace(/[^0-9]/g, '');
    }

});

});