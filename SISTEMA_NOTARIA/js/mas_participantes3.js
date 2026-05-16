// Activar eliminar para los participantes existentes al cargar
document.querySelectorAll('.removeParticipante2').forEach(btn => attachRemoveEvent(btn));
// BOTÓN AGREGAR PARTICIPANTE
document.getElementById('addParticipante2').addEventListener('click', function() {
    const container = document.getElementById('participantes2Container');
    const div = document.createElement('div');
    div.classList.add('participante2');
    div.innerHTML = `
    <div class="nombre_beneficiario">
        <label>Nombre:</label>
        <input type="text" name="nombre_beneficiarios[]" required maxlength="150" placeholder="Maximo 150 caracteres">
        <ul class="listaSugerenciasNombre_beneficiarios"></ul>
    </div>
    <br>
    <button type="button" class="removeParticipante2">Eliminar</button>
    `;
    container.appendChild(div);

    // Activar botón eliminar
    attachRemoveEvent(div.querySelector('.removeParticipante2'));    

});