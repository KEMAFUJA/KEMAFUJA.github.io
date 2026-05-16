//DOCUMENTO
const archivoInput = document.getElementById('archivo');

// Validar mientras escribe
archivoInput.addEventListener('input', function() {
    let valor = this.value.replace(/[^a-zA-ZñÑ 0-9 áéíóúÁÉÍÓÚ,.\-+/()%]/g, '');

    // primera letra en mayúscula
    if (valor.length > 0) {
        valor = valor.charAt(0).toUpperCase() + valor.slice(1);
    }

    this.value = valor;

});


// Validación final al enviar el formulario
document.getElementById('Form').addEventListener('submit', function(e) {
    const archivo = archivoInput.value;
    const regexdoc = /^[a-zA-ZñÑ 0-9 áéíóúÁÉÍÓÚ,.\-+/()%]{1,100}$/;

    if (!regexdoc.test(archivo)) {
        e.preventDefault();
        alert("El campo Documento solo permite hasta 100 caracteres, con letras, números y estos símbolos: ( , . - + / )");
        archivoInput.focus();
        return false;
    }

});