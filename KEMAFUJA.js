const titulo  = document.getElementById('titulo');
const titulo2 = document.getElementById('titulo2');
const texto   = "KEMAFUJA";
const texto2  = "ENTERPRISE";

let fonts = [];
let fontConfig = {};
let index = 0;
let currentFontIndex = 0;

// 🔹 Cargar los JSON antes de iniciar animaciones
Promise.all([
  fetch("/datos/fonts.json").then(res => res.json()),
  fetch("/datos/fontConfig.json").then(res => res.json())
])
.then(([fontsData, fontConfigData]) => {
  fonts = fontsData.fonts;            // arreglo simple de nombres
  fontConfig = fontConfigData;        // objeto con configuraciones
  iniciarAnimaciones();               // iniciar solo después de cargar
})
.catch(err => console.error("Error cargando los JSON:", err));

// =========================================================
// 🔸 FUNCIONES PRINCIPALES
// =========================================================

// Función para obtener configuración responsiva desde JSON
function getFontConfig(fontName) {
  const config = fontConfig[fontName] || fontConfig.default;
  const screenWidth = window.innerWidth;

  if (screenWidth <= 480) {
    return {
      baseSize: Math.floor(config.baseSize * 0.6),
      maxWidth: screenWidth * 0.85,
      marginBottom: config.marginBottom,
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing
    };
  } else if (screenWidth <= 768) {
    return {
      baseSize: Math.floor(config.baseSize * 0.8),
      maxWidth: screenWidth * 0.75,
      marginBottom: config.marginBottom,
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing
    };
  } else {
    return config;
  }
}

// Cargar fuentes desde Google Fonts dinámicamente
function loadGoogleFont(font) {
  const fontName = font.replace(/ /g, '+');
  if (!document.querySelector(`link[data-font="${fontName}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
    link.dataset.font = fontName;
    document.head.appendChild(link);

    link.onload = () => applyFontWithConfig(font);
  } else {
    applyFontWithConfig(font);
  }
}

// Aplicar la fuente y su configuración visual
function applyFontWithConfig(font) {
  const config = getFontConfig(font);
  console.log(`Aplicando fuente: ${font}`, config);

  // Aplicar fuente y estilos
  titulo.style.fontFamily  = `'${font}', sans-serif`;
  titulo2.style.fontFamily = `'${font}', sans-serif`;

  titulo.style.lineHeight     = config.lineHeight;
  titulo.style.letterSpacing  = config.letterSpacing;
  titulo.style.marginBottom   = config.marginBottom;
  titulo2.style.lineHeight    = config.lineHeight;
  titulo2.style.letterSpacing = config.letterSpacing;

  const nombreFuenteEl = document.getElementById('nombre-fuente');
  nombreFuenteEl.style.fontFamily = `'${font}', sans-serif`;

  // Ajustar tamaños
  setTimeout(() => {
      // Título principal
      adjustFontSize(titulo, texto, config.baseSize, config.maxWidth);

      // Título secundario = 50% del principal
      adjustFontSize(titulo2, texto2, config.baseSize*0.5, config.maxWidth);

      // Nombre de la fuente = 25% del principal
      nombreFuenteEl.style.fontSize = config.baseSize* 0.25 + 'px';
      nombreFuenteEl.textContent = font;
  }, 100);
}


// Ajuste automático del tamaño del texto según ancho máximo
function adjustFontSize(element, text, baseSize, maxWidth) {
  const tempSpan = document.createElement('span');
  tempSpan.style.fontFamily = element.style.fontFamily;
  tempSpan.style.fontSize   = baseSize + 'px';
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.position   = 'absolute';
  tempSpan.style.whiteSpace = 'nowrap';
  tempSpan.textContent = text;

  document.body.appendChild(tempSpan);
  const textWidth = tempSpan.offsetWidth;
  document.body.removeChild(tempSpan);

  if (textWidth > maxWidth) {
    const scaleFactor = maxWidth / textWidth;
    const adjustedSize = Math.floor(baseSize * scaleFactor);
    element.style.fontSize = adjustedSize + 'px';
    console.log(`Ajustada ${text}: ${baseSize}px → ${adjustedSize}px`);
  } else {
    element.style.fontSize = baseSize + 'px';
    console.log(`Manteniendo ${text}: ${baseSize}px`);
  }
}

// =========================================================
// 🔸 ANIMACIÓN DE TEXTO Y FUENTES
// =========================================================

function iniciarAnimaciones() {
  escribirTitulo();
  iniciarCambioAutomaticoFuentes();
}

// Animación tipo máquina de escribir
function escribirTitulo() {
  if (index < texto2.length) {
    titulo.textContent  += texto.charAt(index);
    titulo2.textContent += texto2.charAt(index);
    index++;

    // Cambiar fuente cada 2 caracteres
    if (index % 2 === 0) cambiarFuenteAleatoria();

    setTimeout(escribirTitulo, 150);
  }
}

// Cambiar a una fuente aleatoria
function cambiarFuenteAleatoria() {
  const randomIndex = Math.floor(Math.random() * fonts.length);
  const randomFont  = fonts[randomIndex];
  loadGoogleFont(randomFont);
}

// Cambiar a la siguiente fuente en secuencia
function cambiarFuenteSecuencial() {
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  const nextFont = fonts[currentFontIndex];
  loadGoogleFont(nextFont);
}

// Cambio automático de fuentes
function iniciarCambioAutomaticoFuentes() {
  const tiempoEscritura = texto.length * 150 + 2000;
  setTimeout(() => {
    setInterval(cambiarFuenteSecuencial, 3000);
    cambiarFuenteSecuencial();
  }, tiempoEscritura);
}

// =========================================================
// 🔸 CONTROL DE AUDIO
// =========================================================

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

// =========================================================
// 🔸 DROPDOWN DE SERVICIOS
// =========================================================

document.querySelector('.dropdown-header').addEventListener('click', function() {
  this.querySelector('i').classList.toggle('fa-chevron-up');
  this.querySelector('i').classList.toggle('fa-chevron-down');
  document.querySelector('.dropdown-content').classList.toggle('show');
});

