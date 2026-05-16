document.addEventListener('DOMContentLoaded', function() {
    let selectedIndex = -1;
    let currentSuggestionsList = null;
    let currentInput = null;
    
    // Función para obtener sugerencias desde el servidor
    function obtenerSugerencias(tipo, valor, listaSugerencias, inputElement) {
        if (valor.length < 2) {
            listaSugerencias.innerHTML = '';
            selectedIndex = -1;
            currentSuggestionsList = null;
            currentInput = null;
            return;
        }
        
        const nombreTramite = "DECLARACIONES VOLUNTARIAS";

        fetch(`../php/autocompletar.php?tipo=${tipo}&q=${encodeURIComponent(valor)}&nombre=${encodeURIComponent(nombreTramite)}`)
            .then(response => response.json())
            .then(data => {
                listaSugerencias.innerHTML = '';
                
                if (data.length > 0 && !data.error) {
                    currentSuggestionsList = listaSugerencias;
                    currentInput = inputElement;
                    selectedIndex = -1;
                    
                    data.forEach((sugerencia, index) => {
                        const li = document.createElement('li');
                        li.textContent = sugerencia;
                        li.dataset.index = index;
                        li.dataset.value = sugerencia;
                        li.style.cursor = 'pointer';
                        li.style.padding = '10px 12px';
                        li.style.borderBottom = '1px solid rgba(201, 169, 110, 0.1)';
                        li.style.transition = 'all 0.2s ease';
                        
                        // Efecto hover
                        li.addEventListener('mouseenter', function() {
                            // Remover selección anterior de teclado
                            if (currentSuggestionsList === listaSugerencias) {
                                const items = listaSugerencias.querySelectorAll('li');
                                items.forEach(item => {
                                    item.style.background = '#fff';
                                    item.style.color = '';
                                    item.style.fontWeight = '';
                                });
                            }
                            this.style.background = 'rgba(201, 169, 110, 0.1)';
                            selectedIndex = parseInt(this.dataset.index);
                        });
                        
                        li.addEventListener('mouseleave', function() {
                            if (parseInt(this.dataset.index) !== selectedIndex || currentSuggestionsList !== listaSugerencias) {
                                this.style.background = '#fff';
                            }
                        });
                        
                        li.addEventListener('click', function() {
                            inputElement.value = sugerencia;
                            listaSugerencias.innerHTML = '';
                            selectedIndex = -1;
                            currentSuggestionsList = null;
                            currentInput = null;
                            // Disparar evento input para validación
                            inputElement.dispatchEvent(new Event('input'));
                        });
                        
                        listaSugerencias.appendChild(li);
                    });
                } else {
                    // Mostrar mensaje cuando no hay resultados
                    const li = document.createElement('li');
                    li.textContent = 'No se encontraron resultados';
                    li.style.padding = '10px';
                    li.style.color = '#999';
                    li.style.fontStyle = 'italic';
                    li.style.cursor = 'default';
                    listaSugerencias.appendChild(li);
                    currentSuggestionsList = null;
                    currentInput = null;
                }
            })
            .catch(error => {
                console.error('Error al obtener sugerencias:', error);
            });
    }
    
    // Función para manejar navegación con teclado
    function manejarNavegacionTeclado(e, inputElement, listaSugerencias, tipo) {
        const items = listaSugerencias.querySelectorAll('li');
        if (!items.length || items[0].textContent === 'No se encontraron resultados') return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
            actualizarSeleccion(items, listaSugerencias);
            // Hacer scroll al item seleccionado
            items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
            actualizarSeleccion(items, listaSugerencias);
            // Hacer scroll al item seleccionado
            items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                inputElement.value = items[selectedIndex].dataset.value;
                listaSugerencias.innerHTML = '';
                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;
                // Disparar evento input para validación
                inputElement.dispatchEvent(new Event('input'));
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            listaSugerencias.innerHTML = '';
            selectedIndex = -1;
            currentSuggestionsList = null;
            currentInput = null;
        }
    }
    
    // Función para actualizar la selección visual con resaltado
    function actualizarSeleccion(items, listaSugerencias) {
        items.forEach((item, i) => {
            if (i === selectedIndex) {
                item.style.background = 'rgba(201, 169, 110, 0.2)';
                item.style.color = 'var(--primary-color)';
                item.style.fontWeight = '600';
                currentSuggestionsList = listaSugerencias;
                currentInput = listaSugerencias.previousElementSibling;
            } else {
                item.style.background = '#fff';
                item.style.color = '';
                item.style.fontWeight = '';
            }
        });
    }
    
    // Configurar eventos para los participantes (delegación de eventos)
    document.addEventListener('input', function(e) {
        const target = e.target;
        let tipo = '';
        let listaSugerencias = null;
        
        if (target.name === 'nombre[]') {
            tipo = 'nombre';
            listaSugerencias = target.closest('.nombre')?.querySelector('.listaSugerenciasNombre');
            if (listaSugerencias) {
                clearTimeout(target.timeout);
                target.timeout = setTimeout(() => {
                    obtenerSugerencias(tipo, target.value, listaSugerencias, target);
                }, 300);
            }
        }
        else if (target.name === 'identificacion[]') {
            tipo = 'identificacion';
            listaSugerencias = target.closest('.identificacion')?.querySelector('.listaSugerenciasIdentificacion');
            if (listaSugerencias) {
                clearTimeout(target.timeout);
                target.timeout = setTimeout(() => {
                    obtenerSugerencias(tipo, target.value, listaSugerencias, target);
                }, 300);
            }
        }
    });
    
    // Agregar eventos de teclado a los inputs dinámicamente
    document.addEventListener('keydown', function(e) {
        const target = e.target;
        
        if (target.name === 'nombre[]') {
            const listaSugerencias = target.closest('.nombre')?.querySelector('.listaSugerenciasNombre');
            if (listaSugerencias && listaSugerencias.children.length > 0) {
                manejarNavegacionTeclado(e, target, listaSugerencias, 'nombre');
            }
        }
        else if (target.name === 'identificacion[]') {
            const listaSugerencias = target.closest('.identificacion')?.querySelector('.listaSugerenciasIdentificacion');
            if (listaSugerencias && listaSugerencias.children.length > 0) {
                manejarNavegacionTeclado(e, target, listaSugerencias, 'identificacion');
            }
        }
    });
    
    // Función para manejar clics fuera de los inputs con sugerencias
    function cerrarSugerenciasSiEsNecesario(e) {
        // Verificar si el clic fue fuera de cualquier input con sugerencias activas
        if (currentSuggestionsList) {
            const clickEnInput = e.target === currentInput;
            const clickEnLista = e.target === currentSuggestionsList || 
                                 currentSuggestionsList.contains(e.target);
            
            if (!clickEnInput && !clickEnLista) {
                currentSuggestionsList.innerHTML = '';
                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;
            }
        } else {
            // Si no hay sugerencias activas, cerrar todas
            
            const isNombreInput = e.target.name === 'nombre[]';
            const isIdentificacionInput = e.target.name === 'identificacion[]';
            const isInSuggestions = e.target.closest('.listaSugerenciasNombre, .listaSugerenciasIdentificacion');
            
            if (!isNombreInput && !isIdentificacionInput && !isInSuggestions) {
                document.querySelectorAll('.listaSugerenciasNombre, .listaSugerenciasIdentificacion').forEach(lista => {
                    lista.innerHTML = '';
                });
                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;
            }
        }
    }
    
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', cerrarSugerenciasSiEsNecesario);
    
    // También ocultar sugerencias cuando se presiona Tab
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (currentSuggestionsList) {
                // Si hay sugerencias activas, seleccionar el item actual
                if (selectedIndex >= 0) {
                    const items = currentSuggestionsList.querySelectorAll('li');
                    if (items[selectedIndex] && currentInput) {
                        e.preventDefault();
                        currentInput.value = items[selectedIndex].dataset.value;
                        currentInput.dispatchEvent(new Event('input'));
                    }
                }
                currentSuggestionsList.innerHTML = '';
                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;
            }
        }
    });
    
    // Cerrar sugerencias cuando un input pierde el foco
    document.addEventListener('focusout', function(e) {
        if (e.target.name === 'nombre[]' || e.target.name === 'identificacion[]') {
            setTimeout(() => {
                if (currentSuggestionsList && currentInput === e.target) {
                    currentSuggestionsList.innerHTML = '';
                    selectedIndex = -1;
                    currentSuggestionsList = null;
                    currentInput = null;
                }
            }, 150);
        }
    });
    
    // Función para limpiar todas las sugerencias
    window.clearAllSuggestions = function() {
        document.querySelectorAll('.listaSugerenciasNombre, .listaSugerenciasIdentificacion').forEach(lista => {
            lista.innerHTML = '';
        });
        selectedIndex = -1;
        currentSuggestionsList = null;
        currentInput = null;
    };
    
});