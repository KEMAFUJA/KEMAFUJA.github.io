async function loadImages() {
    try {
        const res = await fetch('presentacion.json');
        if (!res.ok) throw new Error('No se encontró presentacion.json');
        const images = await res.json();
        return images;
    } catch(err) {
        console.error(err);
        return [];
    }
}

function renderImages(images) {
    const container = document.getElementById('imageList');
    container.innerHTML = '';
    images.forEach(img => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        // Contenedor de imagen
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Imagen clickeable
        const imageEl = document.createElement('img');
        imageEl.src = img.path;
        imageEl.style.cursor = 'pointer';
        imageEl.addEventListener('click', () => {
            window.open(img.url, '_blank');
        });

        // Overlay con botón
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const overlayBtn = document.createElement('button');
        overlayBtn.className = 'btn';
        overlayBtn.textContent = 'Ver imagen';
        overlayBtn.addEventListener('click', () => {
            window.open(img.url, '_blank');
        });
        overlay.appendChild(overlayBtn);
        
        imageContainer.appendChild(imageEl);
        imageContainer.appendChild(overlay);
        
        // Botón opcional que redirige
        const btn = document.createElement('button');
        btn.className = 'btn btn-link';
        btn.textContent = 'Ir al enlace';
        btn.addEventListener('click', () => {
            window.open(img.url, '_blank');
        });

        galleryItem.appendChild(imageContainer);
        galleryItem.appendChild(btn);
        container.appendChild(galleryItem);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const images = await loadImages();
    renderImages(images);
});