// Activar eliminar para los participantes existentes al cargar
document.querySelectorAll('.removeParticipante').forEach(btn => attachRemoveEvent(btn));
// BOTÓN AGREGAR PARTICIPANTE
document.getElementById('addParticipante').addEventListener('click', function() {
    const container = document.getElementById('participantesContainer');
    const div = document.createElement('div');
    div.classList.add('participante');
    div.innerHTML = `
    <div class="nombre">
        <label>Nombre:</label>
        <input type="text" id="nombre" name="nombre[]" maxlength="150" placeholder="Nombre Completo" autocomplete="off" required title="Nombre&#10;(Automaticamente cada primer letra se pone en mayuscula)">
        <ul class="listaSugerenciasNombre"></ul>
    </div>
    <div class="identificacion">
        <label>C.I. o Pass.:</label>
        <input type="text" id="identificacion" name="identificacion[]" maxlength="25" placeholder="C.I. o Pasaporte" autocomplete="off" required title="Carnet/Pasaporte/Identificacion&#10;Ej: 77777-1A&#10;(Automatico se pone mayuscula para las letras)">
        <ul class="listaSugerenciasIdentificacion"></ul>
    </div>
    <div class="tipopersona">
        <label>Tipo de Persona:</label>
        <select name="tipo_persona[]" title="Tipo de Persona">
            <option value="Natural" selected>NATURAL</option>
            <option value="Jurídica">JURÍDICA</option>
            <option value="ANULADO">ANULADO</option>
        </select>
    </div>
    <div class="calidad">
        <label>Calidad:</label>
        <input type="text" name="calidad[]" maxlength="25" placeholder="Calidad" autocomplete="off" title="Caldidad&#10;Ej: Vendedor/Comprador&#10;(Si lo deja vacio es automatico 'Parte')&#10;(Automaticamente cada primer letra se pone en mayuscula)">
        <ul class="listaSugerenciascalidad"></ul>
    </div>
    <div class="pais">
        <label>País:</label>
        <input type="text" id="pais" name="pais[]" placeholder="Bolivia" maxlength="40" autocomplete="off" title="País&#10;Ej: Bolivia&#10;(Si lo deja vacio es automatico 'Bolivia')">
        <ul class="listaSugerenciasPais"></ul>        
    </div>
    <div class="nacionalidad">
        <label for="nacionalidad">Nacionalidad:</label>
        <input type="text" id="nacionalidad" name="nacionalidad[]" placeholder="Escribe en País..." maxlength="30" readonly title="Nacionalidad&#10;(Se escribe automaticamente el gentilicio dependiendo al pais)">
    </div>
    <br>
    <button type="button" class="removeParticipante" title="Eliminar participante&#10;(Se puede activar con 'Alt'+'-')">Eliminar</button>
    `;
    container.appendChild(div);
    activarAutocomplete(div);
    // Poner focus en el input "nombre"
    div.querySelector('input[name="nombre[]"]').focus();
    // Activar botón eliminar
    attachRemoveEvent(div.querySelector('.removeParticipante'));    
});

// Función para eliminar participante
function attachRemoveEvent(button) {

    button.addEventListener('click', function() {

        const participante = this.closest('.participante');
        participante.remove();

        // buscar el último input nombre
        const nombres = document.querySelectorAll('input[name="nombre[]"]');

        if(nombres.length > 0){
            const ultimo = nombres[nombres.length - 1];

            ultimo.focus();

            // opcional: centrar en pantalla
            ultimo.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    });

}

document.addEventListener("keydown", function(e){

    const activo = document.activeElement;

    // SHIFT + N → ir al primer nombre de participantes desde cualquier campo
    if(e.altKey && e.key.toLowerCase() === "n"){

        e.preventDefault();

        const primerNombre = document.querySelector('input[name="nombre[]"]');

        if(primerNombre){
            primerNombre.focus();
        }

    }

    // SHIFT + + → agregar participante
    if(e.altKey && e.key === "+"){
        e.preventDefault();
        document.getElementById("addParticipante").click();
    }

    // SHIFT + - → eliminar participante actual
    if(e.altKey && e.key === "-"){

        e.preventDefault();

        const participante = activo.closest(".participante");

        if(participante){
            const btnEliminar = participante.querySelector(".removeParticipante");
            if(btnEliminar) btnEliminar.click();
        }

    }

});