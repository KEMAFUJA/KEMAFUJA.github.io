let paisesGentilicios = [];
let autocompleteActivo = null;

// Cargar JSON externo 
fetch('../gentilicios.json')
  .then(res => res.json())
  .then(data => paisesGentilicios = data)
  .catch(err => console.error('Error cargando JSON:', err));

// Función para buscar el gentilicio por nombre de país
function buscarGentilicioPorPais(nombrePais) {
    const paisLower = nombrePais.trim().toLowerCase();
    const paisEncontrado = paisesGentilicios.find(p => 
        p.pais.toLowerCase() === paisLower ||
        p.pais.toLowerCase().includes(paisLower)
    );
    return paisEncontrado ? paisEncontrado.gentilicio : '';
}

// Función principal
function activarAutocomplete(divParticipante) {
    const paisInput = divParticipante.querySelector('#pais');
    const nacInput = divParticipante.querySelector('#nacionalidad');
    const listaSugerencias = divParticipante.querySelector('.listaSugerenciasPais');
    let selectedIndex = -1;

    // Escuchar cuando el usuario termine de escribir (evento change o blur)
    paisInput.addEventListener('change', function() {
        if (this.value.trim()) {
            const gentilicio = buscarGentilicioPorPais(this.value);
            if (gentilicio) {
                nacInput.value = gentilicio;
            }
        }
    });

    paisInput.addEventListener('blur', function() {
        // Pequeño delay para que primero se ejecute el click en la lista si aplica
        setTimeout(() => {
            if (this.value.trim()) {
                const gentilicio = buscarGentilicioPorPais(this.value);
                if (gentilicio) {
                    nacInput.value = gentilicio;
                }
            }
        }, 200);
    });

    // También actualizar al presionar Enter en el input
    paisInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.value.trim()) {
                const gentilicio = buscarGentilicioPorPais(this.value);
                if (gentilicio) {
                    nacInput.value = gentilicio;
                }
                this.blur(); // Perder foco para cerrar sugerencias
            }
        }
    });

    // Limpiar lista cuando se hace clic en el input
    paisInput.addEventListener('click', function() {
        if (this.value && listaSugerencias.children.length === 0) {
            this.dispatchEvent(new Event('input'));
        }
    });

    // Mostrar sugerencias al escribir
    paisInput.addEventListener('input', function() {
        const text = this.value.trim().toLowerCase();
        listaSugerencias.innerHTML = '';
        selectedIndex = -1;
        
        if (!text) {
            nacInput.value = '';
            autocompleteActivo = null;
            return;
        }

        // Intentar encontrar gentilicio inmediatamente
        const gentilicio = buscarGentilicioPorPais(text);
        if (gentilicio) {
            nacInput.value = gentilicio;
        } else {
            nacInput.value = ''; // Limpiar si no se encuentra
        }

        const matches = paisesGentilicios
            .filter(p => p.pais.toLowerCase().includes(text))
            .slice(0, 10);

        if (matches.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No se encontraron países';
            li.style.padding = '10px';
            li.style.color = '#999';
            li.style.fontStyle = 'italic';
            li.style.cursor = 'default';
            listaSugerencias.appendChild(li);
            autocompleteActivo = null;
            return;
        }

        matches.forEach((p, index) => {
            const li = document.createElement('li');
            li.textContent = p.pais;
            li.style.cursor = 'pointer';
            li.style.padding = '10px 12px';
            li.style.borderBottom = '1px solid rgba(201, 169, 110, 0.1)';
            li.style.transition = 'all 0.2s ease';
            li.dataset.index = index;
            li.dataset.pais = p.pais;
            li.dataset.gentilicio = p.gentilicio;

            // Efecto hover
            li.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(201, 169, 110, 0.1)';
            });

            li.addEventListener('mouseleave', function() {
                if (parseInt(this.dataset.index) !== selectedIndex) {
                    this.style.background = '#fff';
                }
            });

            // Seleccionar país al hacer clic
            li.addEventListener('click', function() {
                const pais = this.dataset.pais;
                const gentilicio = this.dataset.gentilicio;
                paisInput.value = pais;
                nacInput.value = gentilicio;
                listaSugerencias.innerHTML = '';
                autocompleteActivo = null;
                paisInput.blur();
            });

            listaSugerencias.appendChild(li);
        });

        // Activar este autocomplete
        autocompleteActivo = {
            input: paisInput,
            lista: listaSugerencias,
            items: listaSugerencias.querySelectorAll('li')
        };
    });

    // Navegación con flechas y Enter (modificada)
    paisInput.addEventListener('keydown', function(e) {
        const items = listaSugerencias.querySelectorAll('li');
        
        // Si hay items en la lista, manejar navegación
        if (items.length && items[0].textContent !== 'No se encontraron países') {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
                actualizarSeleccion(items);
                items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
                actualizarSeleccion(items);
                items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    const item = items[selectedIndex];
                    const pais = item.dataset.pais;
                    const gentilicio = item.dataset.gentilicio;
                    if (pais && gentilicio) {
                        paisInput.value = pais;
                        nacInput.value = gentilicio;
                        listaSugerencias.innerHTML = '';
                        autocompleteActivo = null;
                    }
                } else {
                    // Si no hay item seleccionado pero se presionó Enter
                    if (this.value.trim()) {
                        const gentilicio = buscarGentilicioPorPais(this.value);
                        if (gentilicio) {
                            nacInput.value = gentilicio;
                        }
                        this.blur();
                    }
                }
            } else if (e.key === 'Escape') {
                listaSugerencias.innerHTML = '';
                autocompleteActivo = null;
                selectedIndex = -1;
            }
        } else if (e.key === 'Enter') {
            // Si no hay lista pero se presionó Enter
            e.preventDefault();
            if (this.value.trim()) {
                const gentilicio = buscarGentilicioPorPais(this.value);
                if (gentilicio) {
                    nacInput.value = gentilicio;
                }
                this.blur();
            }
        }
    });

    function actualizarSeleccion(items) {
        items.forEach((item, i) => {
            if (i === selectedIndex) {
                item.style.background = 'rgba(201, 169, 110, 0.2)';
                item.style.color = 'var(--primary-color)';
                item.style.fontWeight = '600';
            } else {
                item.style.background = '#fff';
                item.style.color = '';
                item.style.fontWeight = '';
            }
        });
    }

    // Cerrar lista si hace click fuera
    document.addEventListener('click', function(e) {
        if (autocompleteActivo) {
            const clickEnInput = e.target === autocompleteActivo.input;
            const clickEnLista = e.target === autocompleteActivo.lista || 
                                 autocompleteActivo.lista.contains(e.target);
            
            if (!clickEnInput && !clickEnLista) {
                // Antes de cerrar, verificar si hay texto para buscar gentilicio
                if (autocompleteActivo.input.value.trim()) {
                    const gentilicio = buscarGentilicioPorPais(autocompleteActivo.input.value);
                    if (gentilicio) {
                        const nacInputCorrespondiente = autocompleteActivo.input.closest('.participante').querySelector('#nacionalidad');
                        nacInputCorrespondiente.value = gentilicio;
                    }
                }
                
                autocompleteActivo.lista.innerHTML = '';
                autocompleteActivo = null;
                selectedIndex = -1;
            }
        }
    });

    // También cerrar cuando el input pierde el foco
    paisInput.addEventListener('blur', function() {
        setTimeout(() => {
            if (autocompleteActivo && autocompleteActivo.input === paisInput) {
                if (this.value.trim()) {
                    const gentilicio = buscarGentilicioPorPais(this.value);
                    if (gentilicio) {
                        nacInput.value = gentilicio;
                    }
                }
                autocompleteActivo.lista.innerHTML = '';
                autocompleteActivo = null;
                selectedIndex = -1;
            }
        }, 150);
    });
}

// Versión mejorada de la función de búsqueda con coincidencia exacta primero
function buscarGentilicioPorPaisMejorada(nombrePais) {
    const paisLower = nombrePais.trim().toLowerCase();
    
    // 1. Intentar coincidencia exacta
    const exacto = paisesGentilicios.find(p => 
        p.pais.toLowerCase() === paisLower
    );
    
    if (exacto) return exacto.gentilicio;
    
    // 2. Intentar coincidencia parcial (que comience con el texto)
    const parcial = paisesGentilicios.find(p => 
        p.pais.toLowerCase().startsWith(paisLower)
    );
    
    if (parcial) return parcial.gentilicio;
    
    // 3. Intentar cualquier coincidencia
    const cualquier = paisesGentilicios.find(p => 
        p.pais.toLowerCase().includes(paisLower)
    );
    
    return cualquier ? cualquier.gentilicio : '';
}

// Si quieres usar la versión mejorada, simplemente cambia la llamada a la función
// en lugar de buscarGentilicioPorPais, usa buscarGentilicioPorPaisMejorada

// Inicializar autocomplete para todos los participantes existentes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.participante').forEach(div => {
        activarAutocomplete(div);
    });

    // Si tienes un botón para agregar participantes
    const addParticipanteBtn = document.getElementById('addParticipante');
    if (addParticipanteBtn) {
        addParticipanteBtn.addEventListener('click', function() {
            // Tu código para clonar/agregar nuevo participante...
            setTimeout(() => {
                const nuevosParticipantes = document.querySelectorAll('.participante:not([data-autocomplete])');
                nuevosParticipantes.forEach(div => {
                    if (!div.hasAttribute('data-autocomplete')) {
                        activarAutocomplete(div);
                        div.setAttribute('data-autocomplete', 'true');
                    }
                });
            }, 100);
        });
    }
});

// Opción alternativa: Función más simple para actualizar en tiempo real
function setupAutoGentilicio() {
    document.querySelectorAll('#pais').forEach(input => {
        // Usar evento input para actualizar en tiempo real mientras se escribe
        input.addEventListener('input', function() {
            if (this.value.trim().length > 2) { // Solo buscar si tiene al menos 3 caracteres
                const gentilicio = buscarGentilicioPorPais(this.value);
                if (gentilicio) {
                    const nacInput = this.closest('.participante').querySelector('#nacionalidad');
                    nacInput.value = gentilicio;
                }
            }
        });
        
        // También actualizar cuando pierde el foco
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                const gentilicio = buscarGentilicioPorPais(this.value);
                if (gentilicio) {
                    const nacInput = this.closest('.participante').querySelector('#nacionalidad');
                    nacInput.value = gentilicio;
                }
            }
        });
    });
}

// Llamar esta función también si quieres comportamiento en tiempo real
document.addEventListener('DOMContentLoaded', setupAutoGentilicio);