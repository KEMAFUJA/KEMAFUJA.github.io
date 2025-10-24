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

        // 🔹 Contenedor de QR
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        const imageEl = document.createElement('img');
        imageEl.src = img.path;
        imageEl.alt = 'Código QR';
        imageEl.style.cursor = 'pointer';
        imageEl.addEventListener('click', () => window.open(img.url, '_blank'));

        // Overlay con botón
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const overlayBtn = document.createElement('button');
        overlayBtn.className = 'btn';
        overlayBtn.textContent = 'Ver imagen';
        overlayBtn.addEventListener('click', () => window.open(img.url, '_blank'));
        overlay.appendChild(overlayBtn);

        imageContainer.appendChild(imageEl);
        imageContainer.appendChild(overlay);

        // 🔹 Contenedor centrado para IFRAME
        const previewWrapper = document.createElement('div');
        previewWrapper.style.display = 'flex';
        previewWrapper.style.justifyContent = 'center';
        previewWrapper.style.marginTop = '15px';
        previewWrapper.style.marginBottom = '20px';

        const preview = document.createElement('iframe');
        preview.src = img.url;
        preview.className = 'preview-frame';
        preview.title = `Vista previa de ${img.url}`;

        previewWrapper.appendChild(preview);

        // 🔹 Botón para abrir página
        const btn = document.createElement('button');
        btn.className = 'btn btn-link';
        btn.textContent = 'Ir al enlace';
        btn.addEventListener('click', () => window.open(img.url, '_blank'));

        // 🔹 Añadir todo a galleryItem
        galleryItem.appendChild(imageContainer);
        galleryItem.appendChild(previewWrapper);
        galleryItem.appendChild(btn);

        container.appendChild(galleryItem);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const images = await loadImages();
    renderImages(images);
});
