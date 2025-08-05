
// Efecto de máquina de escribir con cambio de fuentes
const titulo = document.getElementById('titulo');
const texto = "KEMAFUJA  ";
const titulo2 = document.getElementById('titulo2');
const texto2 = "ENTERPRISE";
let index = 0;

// Lista de fuentes para el efecto de cambio
const fonts = [
    "'Montserrat', sans-serif",
    "'Playfair Display', serif",
    "'Arial', sans-serif",
    "'Courier New', monospace",
    "'Georgia', serif",
    "'Times New Roman', serif",
    "'Verdana', sans-serif"
];

function escribirTitulo() {
    if (index < texto.length) {
        titulo.textContent += texto.charAt(index);
        titulo2.textContent += texto2.charAt(index);
        index++;

        // Cambiar la fuente periódicamente
        if (index % 3 === 0) { // Cambia cada 3 caracteres
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            titulo.style.fontFamily = randomFont;
            titulo2.style.fontFamily = randomFont;
        }

setTimeout(escribirTitulo, 150);
    } else {
        titulo.style.borderRight = 'none';
        titulo2.style.borderRight = 'none';

// Continuar cambiando las fuentes después de terminar la escritura
setInterval(() => {
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    titulo.style.fontFamily = randomFont;
    titulo2.style.fontFamily = randomFont;
}, 3000); // Cambia cada 3 segundos
    }
}
escribirTitulo();

// Control de audio
const miAudio = document.getElementById('background-audio');

function playAudio() {
    miAudio.play();
    document.querySelector('.audio-controls .fa-play').parentNode.classList.add('active');
    document.querySelector('.audio-controls .fa-pause').parentNode.classList.remove('active');
}

function pauseAudio() {
    miAudio.pause();
    document.querySelector('.audio-controls .fa-pause').parentNode.classList.add('active');
    document.querySelector('.audio-controls .fa-play').parentNode.classList.remove('active');
}

// Dropdown de servicios
document.querySelector('.dropdown-header').addEventListener('click', function() {
    this.querySelector('i').classList.toggle('fa-chevron-up');
    this.querySelector('i').classList.toggle('fa-chevron-down');
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Modal para PDF
function openPDF() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    
    // Contenido del modal
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-button">
        <i class="fas fa-times"></i>
            </button>
            <div class="pdf-viewer">
        <iframe src="PAQUETES KEMAFUJA.pdf"></iframe>
            </div>
            <a href="PAQUETES KEMAFUJA.pdf" download="PAQUETES KEMAFUJA.pdf" class="download-button">
        <i class="fas fa-download"></i> Descargar PDF
            </a>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.close-button').addEventListener('click', () => {
document.body.removeChild(modal);
    });
}

    
