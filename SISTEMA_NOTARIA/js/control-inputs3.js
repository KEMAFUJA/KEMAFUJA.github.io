//NUMERO DE DOCUMENTO
document.getElementById('participantes2Container').addEventListener('input', function(e) {
    const target = e.target;

    if (target.matches('input[name="nombre_beneficiarios[]"]')) {
        target.value = target.value.replace(/[^a-zA-Z áéíóúÁÉÍÓÚ,.\-+/()]/g, '');
    }

});

["testigo"].forEach(id=>{
    const input = document.getElementById(id);
    input.addEventListener("input", function(){
        this.value = this.value.replace(/[^a-zA-Z áéíóúÁÉÍÓÚ]/g, '');
    });
});
