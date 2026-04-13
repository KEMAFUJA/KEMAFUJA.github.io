const categoriaDesc = {
    "Novia": "Momentos especiales de novias.",
    "Gala": "Eventos de gala y elegancia.",
    "15_anos": "Celebraciones de 15 años."
};

document.addEventListener('DOMContentLoaded', () => {

    // ===== VARIABLES =====
    const modal = document.getElementById('modalOverlay');
    const modalImg = document.getElementById('modalImg');
    const cerrar = document.getElementById('cerrarModal');

    let escala = 1;
    let posX = 0;
    let posY = 0;
    let arrastrando = false;
    let startX, startY;
    let distInicial = 0;

    // ===== CARGAR GALERÍA =====
    async function cargarGaleria() {
        try {
            const res = await fetch('galeria.json'); 
            if (!res.ok) throw new Error("No se encontró galeria.json");

            const data = await res.json();
            console.log("DATA:", data);
            const container = document.getElementById('galeria-contenedor');
            container.innerHTML = '';

            for (const categoria in data) {
                const section = document.createElement('div');
                section.className = 'category';

                const title = document.createElement('h3');
                title.className = 'category-title';
                title.textContent = categoria.replace('_', ' ');
                section.appendChild(title);

                const desc = document.createElement('p');
                desc.className = 'category-desc';
                desc.textContent = categoriaDesc[categoria] || "";
                section.appendChild(desc);

                const gallery = document.createElement('div');
                gallery.className = 'gallery';

                data[categoria].forEach(img => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';

                    const imageEl = document.createElement('img');
                    imageEl.src = 'Fotos/' + img.src;
                    imageEl.alt = img.alt;

                    // 🔥 CLICK FUNCIONA AQUÍ
                    imageEl.addEventListener('click', () => abrirModal(imageEl.src));

                    item.appendChild(imageEl);
                    gallery.appendChild(item);
                    console.log("Imagen creada:", imageEl.src);
                });

                section.appendChild(gallery);
                container.appendChild(section);
            }

        } catch(err) {
            console.error(err);
        }
    }

    cargarGaleria();

    // ===== MODAL =====
    function abrirModal(src) {
        modal.classList.add('active');
        modalImg.src = src;

        escala = 1;
        posX = 0;
        posY = 0;

        actualizar();
    }

    cerrar.onclick = () => modal.classList.remove('active');

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // ===== ZOOM PC =====
    modal.addEventListener('wheel', (e) => {
        e.preventDefault();

        escala += e.deltaY * -0.001;
        escala = Math.min(Math.max(1, escala), 5);

        actualizar();
    });

    // ===== DRAG =====
    modal.addEventListener('mousedown', (e) => {
        arrastrando = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!arrastrando) return;

        posX = e.clientX - startX;
        posY = e.clientY - startY;

        actualizar();
    });

    document.addEventListener('mouseup', () => arrastrando = false);

    // ===== TOUCH =====
    modal.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            distInicial = distancia(e.touches);
        }
    });

    modal.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            let nueva = distancia(e.touches);
            let factor = nueva / distInicial;

            escala *= factor;
            escala = Math.min(Math.max(1, escala), 5);

            distInicial = nueva;
            actualizar();
        }
    });

    function distancia(t) {
        let dx = t[0].clientX - t[1].clientX;
        let dy = t[0].clientY - t[1].clientY;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function actualizar() {
        modalImg.style.transform = `scale(${escala}) translate(${posX}px, ${posY}px)`;
    }

});
