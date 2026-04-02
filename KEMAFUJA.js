const titulo = document.getElementById('titulo');
const titulo2 = document.getElementById('titulo2');
const texto = "KEMAFUJA";
const texto2 = "ENTERPRISE";

let fonts = [];
let fontConfig = {};
let index = 0;
let currentFontIndex = 0;
let fuenteActual = "";
let intervaloFuentes = null;
let pausadoPorUsuario = false;

const elementosTexto = [titulo, titulo2, document.getElementById('nombre-fuente')];

// 🔹 CARGA INICIAL DE JSON
Promise.all([
  fetch("datos/fonts.json").then(res => res.json()),
  fetch("datos/fontconfig.json").then(res => res.json())
])
.then(([fontsData, fontConfigData]) => {
  fonts = fontsData.fonts;
  fontConfig = fontConfigData;

  if (fonts.length) {
    loadGoogleFont(fonts[0]);
  }

  iniciarAnimaciones();
})
.catch(err => console.error("Error cargando los JSON:", err));

// 🔸 FUNCIONES PRINCIPALES
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
      baseSize: Math.floor(config.baseSize * 0.1),
      maxWidth: screenWidth * 0.75,
      marginBottom: config.marginBottom,
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing
    };
  } else {
    return config;
  }
}

function adjustFontSize(element, text, baseSize, maxWidth) {
  const tempSpan = document.createElement('span');
  tempSpan.style.fontFamily = element.style.fontFamily;
  tempSpan.style.fontSize = baseSize + 'px';
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.position = 'absolute';
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

// 🔁 REAJUSTE AL REDIMENSIONAR
function reajustarTextos() {
  let fuente = fuenteActual;
  if (!fuente) {
    const family = titulo.style.fontFamily;
    if (family) {
      const match = family.match(/'([^']+)'/);
      fuente = match ? match[1] : family.split(',')[0].replace(/['"]/g, '').trim();
    }
  }
  if (!fuente) return;

  const config = getFontConfig(fuente);
  const nombreFuenteEl = document.getElementById('nombre-fuente');

  titulo.style.lineHeight = config.lineHeight;
  titulo.style.letterSpacing = config.letterSpacing;
  titulo.style.marginBottom = config.marginBottom;
  titulo2.style.lineHeight = config.lineHeight;
  titulo2.style.letterSpacing = config.letterSpacing;

  adjustFontSize(titulo, texto, config.baseSize, config.maxWidth);
  adjustFontSize(titulo2, texto2, config.baseSize * 0.5, config.maxWidth);
  nombreFuenteEl.style.fontSize = config.baseSize * 0.15 + 'px';
}

// =========================================================
// 🔸 LÓGICA CON EFECTO DE TRANSFORMACIÓN
// =========================================================
function loadGoogleFont(font) {
  const fontName = font.replace(/ /g, '+');
  if (!document.querySelector(`link[data-font="${fontName}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
    link.dataset.font = fontName;
    document.head.appendChild(link);
    link.onload = () => aplicarConEfecto(font);
  } else {
    aplicarConEfecto(font);
  }
}

function aplicarConEfecto(font) {
  elementosTexto.forEach(el => {
    if (el) el.classList.add('font-changing');
  });

  setTimeout(() => {
    aplicarFuenteInterna(font).then(() => {
      elementosTexto.forEach(el => {
        if (el) {
          el.classList.remove('font-changing');
          el.classList.add('font-changing-restore');
          setTimeout(() => {
            el.classList.remove('font-changing-restore');
          }, 250);
        }
      });
    });
  }, 150);
}

function aplicarFuenteInterna(font) {
  return new Promise((resolve) => {
    const config = getFontConfig(font);
    console.log(`Aplicando fuente: ${font}`, config);
    fuenteActual = font;

    titulo.style.fontFamily = `'${font}', sans-serif`;
    titulo2.style.fontFamily = `'${font}', sans-serif`;

    titulo.style.lineHeight = config.lineHeight;
    titulo.style.letterSpacing = config.letterSpacing;
    titulo.style.marginBottom = config.marginBottom;
    titulo2.style.lineHeight = config.lineHeight;
    titulo2.style.letterSpacing = config.letterSpacing;

    const nombreFuenteEl = document.getElementById('nombre-fuente');
    nombreFuenteEl.style.fontFamily = `'${font}', sans-serif`;

    setTimeout(() => {
      adjustFontSize(titulo, texto, config.baseSize * 0.8, config.maxWidth);
      adjustFontSize(titulo2, texto2, config.baseSize * 0.35, config.maxWidth);
      nombreFuenteEl.style.fontSize = config.baseSize * 0.3 + 'px';
      nombreFuenteEl.textContent = font;
      resolve();
    }, 100);
  });
}

// =========================================================
// 🔸 ANIMACIÓN DE TEXTO Y FUENTES
// =========================================================
function iniciarAnimaciones() {
  escribirTitulo();
  iniciarCambioAutomaticoFuentes();
}

function escribirTitulo() {
  if (index < texto2.length) {
    titulo.textContent += texto.charAt(index);
    titulo2.textContent += texto2.charAt(index);
    index++;

    if (index % 2 === 0) cambiarFuenteAleatoria();

    setTimeout(escribirTitulo, 150);
  }
}

function cambiarFuenteAleatoria() {
  const randomIndex = Math.floor(Math.random() * fonts.length);
  const randomFont = fonts[randomIndex];
  loadGoogleFont(randomFont);
}

function cambiarFuenteSecuencial() {
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  const nextFont = fonts[currentFontIndex];
  loadGoogleFont(nextFont);
}

function iniciarCambioAutomaticoFuentes() {
  const tiempoEscritura = texto.length * 150 + 2000;
  setTimeout(() => {
    intervaloFuentes = setInterval(cambiarFuenteSecuencial, 3000);
    cambiarFuenteSecuencial();
  }, tiempoEscritura);
}

// =========================================================
// 🔸 PAUSA / REANUDA FUENTES POR INTERACCIÓN
// =========================================================
function pausarFuentes() {
  if (intervaloFuentes) {
    clearInterval(intervaloFuentes);
    intervaloFuentes = null;
    pausadoPorUsuario = true;
  }
}

function reanudarFuentes() {
  if (pausadoPorUsuario) {
    intervaloFuentes = setInterval(cambiarFuenteSecuencial, 3000);
    pausadoPorUsuario = false;
  }
}

// Mantener presionado o click = pausa mientras sostienes, reanuda al soltar
document.querySelector('.card').addEventListener('mousedown', pausarFuentes);
document.querySelector('.card').addEventListener('mouseup', reanudarFuentes);
document.querySelector('.card').addEventListener('touchstart', pausarFuentes, { passive: true });
document.querySelector('.card').addEventListener('touchend', reanudarFuentes);

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
document.querySelector('.dropdown-header').addEventListener('click', function () {
  this.querySelector('i').classList.toggle('fa-chevron-up');
  this.querySelector('i').classList.toggle('fa-chevron-down');
  document.querySelector('.dropdown-content').classList.toggle('show');
});

// =========================================================
// 🔸 EVENTO RESIZE (RESPONSIVIDAD)
// =========================================================
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    reajustarTextos();
    console.log('Texto reajustado por resize');
  }, 150);
});
