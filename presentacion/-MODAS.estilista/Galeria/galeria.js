const categoriaDesc = {
    "Novia": "Momentos especiales de novias.",
    "Gala": "Eventos de gala y elegancia.",
    "15_anos": "Celebraciones de 15 años."
};

async function cargarGaleria() {
    try {
        const res = await fetch('galeria.json'); 
        if (!res.ok) throw new Error("No se encontró galeria.json");

        const data = await res.json();
        const container = document.getElementById('galleryContainer');
        container.innerHTML = '';

        for (const categoria in data) {
            const section = document.createElement('div');
            section.className = 'category';

            // Título automático
            const title = document.createElement('h3');
            title.className = 'category-title';
            title.textContent = categoria.replace('_', ' ');
            section.appendChild(title);

            // Descripción
            const desc = document.createElement('p');
            desc.className = 'category-desc';
            desc.textContent = categoriaDesc[categoria] || "";
            section.appendChild(desc);

            // Galería
            const gallery = document.createElement('div');
            gallery.className = 'gallery';
            data[categoria].forEach(img => {
                const item = document.createElement('div');
                item.className = 'gallery-item';

                const imageEl = document.createElement('img');
                imageEl.src = 'Fotos/' + img.src;
                imageEl.alt = img.alt;

                // Click para modal
                imageEl.addEventListener('click', () => {
                    const modal = document.getElementById('modalOverlay');
                    modal.querySelector('img').src = imageEl.src;
                    modal.style.display = 'flex';
                });

                item.appendChild(imageEl);
                gallery.appendChild(item);
            });

            section.appendChild(gallery);
            container.appendChild(section);
        }

        // Cerrar modal al click
        const modal = document.getElementById('modalOverlay');
        modal.addEventListener('click', () => { modal.style.display = 'none'; });

    } catch(err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', cargarGaleria);
