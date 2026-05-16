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
        <input type="text" id="nombre" name="nombre[]" required maxlength="150" placeholder="Maximo 150 caracteres">
        <ul class="listaSugerenciasNombre"></ul>
    </div>
    <div class="identificacion">
        <label>Identificacion:</label>
        <input type="text" id="identificacion" name="identificacion[]" required maxlength="25" placeholder="Maximo 25 caracteres">
        <ul class="listaSugerenciasIdentificacion"></ul>
    </div>
    <div class="tipopersona">
        <label>Tipo de Persona:</label>
        <select name="tipo_persona[]" required>
            <option value="NATURAL" selected>NATURAL</option>
            <option value="JURIDICA">JURIDICA</option>
            <option value="ANULADO">ANULADO</option>
        </select>
    </div>
    <div class="pais">
        <label>País:</label>
        <input type="text" id="pais" name="pais[]" placeholder="Escribe el país..." maxlength="40">
        <ul class="listaSugerenciasPais"></ul>            
    </div>
    <div class="nacionalidad">
        <label for="nacionalidad">Nacionalidad:</label>
        <input type="text" id="nacionalidad" name="nacionalidad[]" placeholder="Escribe en País..." required maxlength="15" readonly>
    </div>
    <br>
    <button type="button" class="removeParticipante">Eliminar</button>

    `;
    container.appendChild(div);
    // Activar botón eliminar
    attachRemoveEvent(div.querySelector('.removeParticipante'));    

});

// Función para eliminar participante
function attachRemoveEvent(button) {
    button.addEventListener('click', function() {
        this.parentElement.remove();
    });
}