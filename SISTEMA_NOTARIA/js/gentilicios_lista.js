let gentilicios = [];
let autocompleteActivo = null; // Variable global para controlar el autocomplete activo

fetch('../gentilicios.json')
  .then(r => r.json())
  .then(data => gentilicios = data)
  .catch(e => console.error(e));
 
// Función para activar autocomplete en un input de nacionalidad
function activarAutocompleteNacionalidad(inputNac) {
    // Crear contenedor de sugerencias
    const box = document.createElement("div");
    box.className = "sugerencias-nac";
    document.body.appendChild(box); // IMPORTANTE: Agregar al body, no al parent
    
    let selectedIndex = -1;
    let isVisible = false;

    // Función para posicionar el box
    function posicionarBox() {
        if (!isVisible) return;
        
        const rect = inputNac.getBoundingClientRect();
        box.style.position = 'fixed';
        box.style.top = (rect.bottom + window.scrollY) + 'px';
        box.style.left = (rect.left + window.scrollX) + 'px';
        box.style.width = rect.width + 'px';
        box.style.zIndex = '10000'; 
    }

    // Evento input
    inputNac.addEventListener("input", function () {
        const texto = this.value.trim().toLowerCase();
        box.innerHTML = "";
        selectedIndex = -1;
        isVisible = false;

        if (!texto) {
            autocompleteActivo = null;
            box.style.display = 'none';
            return;
        }

        const resultados = gentilicios
            .filter(g => g.pais.toLowerCase().includes(texto) || g.gentilicio.toLowerCase().includes(texto))
            .slice(0, 10);

        if (resultados.length === 0) {
            const div = document.createElement("div");
            div.textContent = 'No se encontraron países';
            div.style.padding = '10px';
            div.style.color = '#999';
            div.style.fontStyle = 'italic';
            div.style.cursor = 'default';
            box.appendChild(div);
            autocompleteActivo = null;
            box.style.display = 'block';
            isVisible = true;
            posicionarBox();
            return;
        }

        resultados.forEach((g, index) => {
            const div = document.createElement("div");
            div.textContent = `${g.pais} (${g.gentilicio})`;
            div.style.cursor = 'pointer';
            div.style.padding = '10px 12px';
            div.style.borderBottom = '1px solid rgba(201, 169, 110, 0.1)';
            div.style.transition = 'all 0.2s ease';
            div.dataset.index = index;
            div.dataset.pais = g.pais;
            div.dataset.gentilicio = g.gentilicio;

            // Efecto hover
            div.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(201, 169, 110, 0.1)';
            });

            div.addEventListener('mouseleave', function() {
                if (parseInt(this.dataset.index) !== selectedIndex) {
                    this.style.background = '#fff';
                }
            });

            // Seleccionar al hacer clic
            div.addEventListener('click', function() {
                const gentilicio = this.dataset.pais;
                inputNac.value = gentilicio;
                box.innerHTML = '';
                box.style.display = 'none';
                autocompleteActivo = null;
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
        autocompleteActivo = {
            input: inputNac,
            box: box,
            items: box.querySelectorAll('div')
        };
    });

    // Navegación con flechas y Enter
    inputNac.addEventListener('keydown', function(e) {
        const items = box.querySelectorAll('div');
        if (!items.length || items[0].textContent === 'No se encontraron países') return;

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
                const gentilicio = item.dataset.pais;
                if (gentilicio) {
                    inputNac.value = gentilicio;
                    box.innerHTML = '';
                    box.style.display = 'none';
                    autocompleteActivo = null;
                    selectedIndex = -1;
                    isVisible = false;
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            box.innerHTML = '';
            box.style.display = 'none';
            autocompleteActivo = null;
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
        if (autocompleteActivo && autocompleteActivo.input === inputNac) {
            const clickEnInput = e.target === autocompleteActivo.input;
            const clickEnBox = e.target === autocompleteActivo.box || 
                               autocompleteActivo.box.contains(e.target);
            
            if (!clickEnInput && !clickEnBox) {
                autocompleteActivo.box.innerHTML = '';
                autocompleteActivo.box.style.display = 'none';
                autocompleteActivo = null;
                selectedIndex = -1;
                isVisible = false;
            }
        }
    });

    // También cerrar cuando el input pierde el foco
    inputNac.addEventListener('blur', function() {
        setTimeout(() => {
            if (autocompleteActivo && autocompleteActivo.input === inputNac) {
                autocompleteActivo.box.innerHTML = '';
                autocompleteActivo.box.style.display = 'none';
                autocompleteActivo = null;
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
    const inputExistente = document.querySelector('[data-filtro="nacionalidad"]');
    if (inputExistente) {
        activarAutocompleteNacionalidad(inputExistente);
    }
});

