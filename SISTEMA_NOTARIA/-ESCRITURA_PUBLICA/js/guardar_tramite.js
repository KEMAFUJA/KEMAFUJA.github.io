function validarFecha(fecha){
    const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if(!regex.test(fecha)) return false;

    const partes = fecha.split("/");
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const anio = parseInt(partes[2]);

    if(mes < 1 || mes > 12) return false;
    if(dia < 1 || dia > 31) return false;
    if(anio < 1900 || anio > 2100) return false;

    return true;
}

document.getElementById('Form').addEventListener('submit', function(e) {

    const fechaInput = document.getElementById("fecha");
    const numeroInput = document.getElementById("numero");

    if(!validarFecha(fechaInput.value)){
        e.preventDefault();
        mostrarAviso("Fecha inválida. Usa formato válido (ej: 5/4/2025)", "error");
        fechaInput.focus();
        fechaInput.select();
        return;
    }

    e.preventDefault();

    const form = this;
    const formData = new FormData(form);

    mostrarAviso('Guardando acta, por favor espere...', 'info', 0);

    fetch('php/nuevo_documento.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(res => {

        res = res.trim();

        if (res.startsWith("existe|")) {
            const mensaje = res.split("|")[1];
            mostrarAviso(mensaje, "error");
            numeroInput.focus();
            numeroInput.select();
            return;
        }

        if (res.includes('Error') || res.includes('error')) {
            mostrarAviso(res, "error");
            return;
        }

        let mensaje = res;

        if (res.includes("|")) {
            mensaje = res.split("|")[1];
        }

        mostrarAviso(mensaje, "exito");

        form.reset();
        dejarUnSoloParticipante();
        numeroInput.focus();
        tipoVenta.style.display = "none";
        tipoPago.style.display = "none";
        beneficiario.style.display = "none";

        if (typeof contador === "function") {
            contador();
        }

        if (res.startsWith("correcto|")) {
            hacerAlumbrarBoton();
        }

    })
    .catch(err => {
        console.error(err);
        mostrarAviso('Error: ' + err.message, 'error');
    });
});


function hacerAlumbrarBoton() {
    const boton = document.getElementById('Preguntas');
    
    boton.classList.add('alumbrar');
    
    setTimeout(() => {
        boton.classList.remove('alumbrar');
    }, 2000);
}

function mostrarAviso(mensaje, tipo = 'info', duracion = 3000) {

    const aviso = document.getElementById('mensajeAviso');
    aviso.className = 'aviso';
    let icono = '';

    if(tipo === 'exito') icono = '✔ ';
    if(tipo === 'error') icono = '✖ ';
    if(tipo === 'info') icono = 'ℹ ';

    aviso.innerHTML = icono + mensaje;
    aviso.classList.add(tipo, 'mostrar');

    if (duracion > 0) {
        setTimeout(() => {
            aviso.classList.remove('mostrar');
            aviso.textContent = '';
        }, duracion);
    }

}

function dejarUnSoloParticipante() {

    const container = document.getElementById('participantesContainer');
    const participantes = container.querySelectorAll('.participante');

    participantes.forEach((p, index) => {
        if(index > 0){
            p.remove();
        }
    });

    const primero = container.querySelector('.participante');

    if(primero){
        primero.querySelectorAll('input').forEach(input => {
            input.value = '';
        });

        primero.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        const nombre = primero.querySelector('input[name="nombre[]"]');
        if(nombre) nombre.focus();
    }
}