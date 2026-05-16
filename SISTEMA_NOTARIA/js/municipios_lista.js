let municipios = [];
let autocompleteMunicipioActivo = null; // Variable global para controlar el autocomplete activo

// Cargar municipios desde el JSON
fetch('../provincias.json')
  .then(r => r.json())
  .then(data => municipios = data)
  .catch(e => console.error('Error cargando municipios:', e));

// Función para activar autocomplete en un input de municipio
function activarAutocompleteMunicipio(inputMunicipio) {
    // Crear contenedor de sugerencias
    const box = document.createElement("div");
    box.className = "sugerencias-municipio";
    document.body.appendChild(box); // Agregar al body
    
    let selectedIndex = -1;
    let isVisible = false;

    // Función para posicionar el box
    function posicionarBox() {
        if (!isVisible) return;
        
        const rect = inputMunicipio.getBoundingClientRect();
        box.style.position = 'fixed';
        box.style.top = (rect.bottom + window.scrollY) + 'px';
        box.style.left = (rect.left + window.scrollX) + 'px';
        box.style.width = rect.width + 'px';
        box.style.zIndex = '10000';
        box.style.maxHeight = '300px';
        box.style.overflowY = 'auto';
        box.style.background = '#fff';
        box.style.border = '1px solid #ddd';
        box.style.borderRadius = '4px';
        box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }

    // Evento input
    inputMunicipio.addEventListener("input", function () {
        const texto = this.value.trim().toLowerCase();
        box.innerHTML = "";
        selectedIndex = -1;
        isVisible = false;

        if (!texto) {
            autocompleteMunicipioActivo = null;
            box.style.display = 'none';
            return;
        }

        // Filtrar municipios que coincidan con el texto (en cualquier parte del string)
        const resultados = municipios
            .filter(m => m.toLowerCase().includes(texto))
            .slice(0, 15); // Limitar a 15 resultados

        if (resultados.length === 0) {
            const div = document.createElement("div");
            div.textContent = 'No se encontraron municipios';
            div.style.padding = '10px 12px';
            div.style.color = '#999';
            div.style.fontStyle = 'italic';
            div.style.cursor = 'default';
            box.appendChild(div);
            autocompleteMunicipioActivo = null;
            box.style.display = 'block';
            isVisible = true;
            posicionarBox();
            return;
        }

        resultados.forEach((municipio, index) => {
            const div = document.createElement("div");
            div.textContent = municipio;
            div.style.cursor = 'pointer';
            div.style.padding = '10px 12px';
            div.style.borderBottom = '1px solid rgba(201, 169, 110, 0.1)';
            div.style.transition = 'all 0.2s ease';
            div.style.fontSize = '14px';
            div.dataset.index = index;
            div.dataset.municipio = municipio;

            // Efecto hover
            div.addEventListener('mouseenter', function() {
                if (parseInt(this.dataset.index) !== selectedIndex) {
                    this.style.background = 'rgba(201, 169, 110, 0.1)';
                }
            });

            div.addEventListener('mouseleave', function() {
                if (parseInt(this.dataset.index) !== selectedIndex) {
                    this.style.background = '#fff';
                }
            });

            // Seleccionar al hacer clic
            div.addEventListener('click', function() {
                const municipioSeleccionado = this.dataset.municipio;
                inputMunicipio.value = municipioSeleccionado;
                box.innerHTML = '';
                box.style.display = 'none';
                autocompleteMunicipioActivo = null;
                selectedIndex = -1;
                isVisible = false;
            });

            box.appendChild(div);
        });

        // Mostrar y posicionar
        box.style.display = 'block';
        isVisible = true;
        posicionarBox();

        // Activar este autocomplete
        autocompleteMunicipioActivo = {
            input: inputMunicipio,
            box: box,
            items: box.querySelectorAll('div')
        };
    });

    // Navegación con flechas y Enter
    inputMunicipio.addEventListener('keydown', function(e) {
        if (!autocompleteMunicipioActivo || autocompleteMunicipioActivo.input !== inputMunicipio) {
            return;
        }

        const items = box.querySelectorAll('div');
        if (!items.length || items[0].textContent === 'No se encontraron municipios') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
            actualizarSeleccion(items);
            // Hacer scroll al item seleccionado
            items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
            actualizarSeleccion(items);
            // Hacer scroll al item seleccionado
            items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                const item = items[selectedIndex];
                const municipioSeleccionado = item.dataset.municipio;
                if (municipioSeleccionado) {
                    inputMunicipio.value = municipioSeleccionado;
                    box.innerHTML = '';
                    box.style.display = 'none';
                    autocompleteMunicipioActivo = null;
                    selectedIndex = -1;
                    isVisible = false;
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            box.innerHTML = '';
            box.style.display = 'none';
            autocompleteMunicipioActivo = null;
            selectedIndex = -1;
            isVisible = false;
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
        if (autocompleteMunicipioActivo && autocompleteMunicipioActivo.input === inputMunicipio) {
            const clickEnInput = e.target === autocompleteMunicipioActivo.input;
            const clickEnBox = e.target === autocompleteMunicipioActivo.box || 
                               autocompleteMunicipioActivo.box.contains(e.target);
            
            if (!clickEnInput && !clickEnBox) {
                autocompleteMunicipioActivo.box.innerHTML = '';
                autocompleteMunicipioActivo.box.style.display = 'none';
                autocompleteMunicipioActivo = null;
                selectedIndex = -1;
                isVisible = false;
            }
        }
    });

    // También cerrar cuando el input pierde el foco
    inputMunicipio.addEventListener('blur', function() {
        setTimeout(() => {
            if (autocompleteMunicipioActivo && autocompleteMunicipioActivo.input === inputMunicipio) {
                autocompleteMunicipioActivo.box.innerHTML = '';
                autocompleteMunicipioActivo.box.style.display = 'none';
                autocompleteMunicipioActivo = null;
                selectedIndex = -1;
                isVisible = false;
            }
        }, 150);
    });

    // Reposicionar cuando se haga scroll o redimensione
    window.addEventListener('scroll', posicionarBox);
    window.addEventListener('resize', posicionarBox);
    
    // Limpiar cuando se desmonte (si es necesario)
    return () => {
        window.removeEventListener('scroll', posicionarBox);
        window.removeEventListener('resize', posicionarBox);
        if (document.body.contains(box)) {
            document.body.removeChild(box);
        }
    };
}

// Activar para el input que ya existe en la fila de filtros
document.addEventListener('DOMContentLoaded', function() {
    const inputMunicipioExistente = document.querySelector('[data-filtro="municipio"]');
    if (inputMunicipioExistente) {
        activarAutocompleteMunicipio(inputMunicipioExistente);
    }
});