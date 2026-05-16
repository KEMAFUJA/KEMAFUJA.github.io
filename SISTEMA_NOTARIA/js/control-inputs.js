//NUMERO DE DOCUMENTO 
const numeroInput = document.getElementById('numero');

numeroInput.addEventListener('keydown', function(e) {
    // espacio = /
    if (e.code === 'Space') {
        e.preventDefault();

        if (!this.value.includes('/')) {
            this.value += '/';
        }
    }

    // TAB → completar con año actual
    if (e.key === 'Tab') {
        const valor = this.value.trim();

        if (valor && !valor.includes('/')) {
            const year = new Date().getFullYear();
            this.value = valor + '/' + year;
        }

    }



});

// opcional: permitir solo números y una barra
numeroInput.addEventListener('input', function() {
    // elimina todo lo que no sea número o '/'
    this.value = this.value.replace(/[^0-9/]/g, '');
    // que haya solo una barra
    const parts = this.value.split('/');
    if (parts.length > 2) {
        this.value = parts[0] + '/' + parts[1];
    }
});

// validación al enviar
document.getElementById('Form').addEventListener('submit', function(e) {
    const numero = numeroInput.value;
    const regexnum = /^[1-9][0-9]{0,3}\/[0-9]{1,4}$/;
    if (!regexnum.test(numero)) {
        e.preventDefault();
        alert("El número debe tener el formato nnnn/nnnn (ej: 1/2025, 123/2025, 9999/9999)");
        numeroInput.focus();
        return false;
    }
});

document.getElementById('participantesContainer').addEventListener('input', function(e) {
    const target = e.target;

// NOMBRE: solo letras, espacios y algunos símbolos
if (target.matches('input[name="nombre[]"]')) {

    // limpiar caracteres no permitidos
    let valor = target.value.replace(/[^a-zA-ZñÑ áéíóúÁÉÍÓÚ,.]/g, '');

    // convertir cada palabra a formato Nombre
    valor = valor
        .toLowerCase()
        .split(" ")
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(" ");

    target.value = valor;
}
    // IDENTIFICACIÓN: solo mayúsculas y números
else if (target.matches('input[name="identificacion[]"]')) {
    let valor = target.value.toUpperCase();
    valor = valor.replace(/[^A-Z0-9 -]/g, '');
    target.value = valor;
}
    // PAÍS: solo letras
    else if (target.matches('input[name="pais[]"]')) {
        target.value = target.value.replace(/[^a-zA-Z áéíóúÁÉÍÓÚ]/g, '');
    }
});
 

const meses = {
    enero:1, febrero:2, marzo:3, abril:4, mayo:5, junio:6,
    julio:7, agosto:8, septiembre:9, setiembre:9,
    octubre:10, noviembre:11, diciembre:12
};

const fechaInput = document.getElementById("fecha");
// TAB → insertar fecha actual
fechaInput.addEventListener("keydown", function(e){
    if(e.key === "Tab"){
        const valor = this.value.trim();

        if(valor === ""){
            const hoy = new Date();
            const dia = hoy.getDate();
            const mes = hoy.getMonth() + 1;
            const anio = hoy.getFullYear();
            this.value = `${dia}/${mes}/${anio}`;
        }
    }
});
// conversión de texto a formato fecha
fechaInput.addEventListener("blur", function(){
    let texto = this.value.toLowerCase()
        .replace(/\b(de|del|la|el|año)\b/g, "") // 🔥 aquí está la mejora
        .replace(/,/g,"")
        .replace(/\s+/g, " ")
        .trim();

    let partes = texto.split(" ");

    if(partes.length === 3){
        let dia = parseInt(partes[0]);
        let mes = meses[partes[1]] || parseInt(partes[1]);
        let anio = parseInt(partes[2]);

        if(dia && mes && anio){
            this.value = `${dia}/${String(mes).padStart(2,'0')}/${anio}`;
        }
    }
});