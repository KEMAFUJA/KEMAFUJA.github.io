// Función para mostrar aviso
function mostrarAviso(mensaje, tipo = 'info', duracion = 5000) {
    const aviso = document.getElementById('mensajeAviso');
    
    // Limpiar clases anteriores
    aviso.className = '';
    
    // Establecer contenido y tipo
    aviso.textContent = mensaje;
    aviso.classList.add(tipo, 'mostrar');
    
    // Si tiene duración limitada, ocultar después del tiempo
    if (duracion > 0) {
        setTimeout(() => {
            aviso.classList.remove('mostrar');
            aviso.className = '';
            aviso.textContent = '';
        }, duracion);
    }
}

// Enviar formulario (modificado para usar aviso en lugar de alert)
document.getElementById('Form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Mostrar mensaje de "procesando"
    mostrarAviso('Guardando acta, por favor espere...', 'info', 0);

    fetch('php/nuevo_documento.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(res => {
        // Determinar el tipo de mensaje basado en la respuesta
        let tipo = 'info';
        if (res.includes('correctamente')) {
            tipo = 'exito';
        } else if (res.includes('Error') || res.includes('error') || res.includes('Faltan')) {
            tipo = 'error';
        }
        
        mostrarAviso(res, tipo);
    })
    .catch(err => {
        console.error(err);
        mostrarAviso('Error: ' + err.message, 'error');
    });
});