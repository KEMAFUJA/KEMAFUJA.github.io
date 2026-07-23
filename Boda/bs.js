const CONFIG = {
  // Textos principales (puedes reescribirlos como quieras)
  introTexto: "Con muchísima alegría les damos la bienvenida a esta invitación. Muy pronto un pequeño príncipe llegará a iluminar nuestras vidas y nos encantaría celebrarlo junto a ustedes.",
  mensaje: "Con el corazón lleno de ilusión, los invitamos a celebrar juntos la dulce espera de nuestro pequeño príncipe. Su cariño y compañía harán de este momento un recuerdo inolvidable.",
  notaAsistencia: "Tu presencia hará este día aún más especial. Por favor confírmanos tu asistencia para poder recibirte como te mereces.",

  // Anfitriones
  papas: "Brian & Fabiola",
  padrinos: "Jenny & Pablo",

  // Fecha y hora del evento (usa estos formatos exactos)
  fecha: "2026-08-06", // AAAA-MM-DD
  hora:  "16:00",      // formato 24 horas HH:MM

  // Lugar
  lugarNombre:   "Av. Irala #603",
  lugarDireccion:"Colegio de Médicos Veterinarios, Santa Cruz, Bolivia",

  // Enlaces
  // mapsUrl: si lo dejas vacío, se genera automáticamente una búsqueda de
  // Google Maps a partir de "lugarDireccion". Pega aquí tu propio enlace
  // (por ejemplo uno compartido desde la app de Maps) si quieres precisión exacta.
  mapsUrl: "",
  // formUrl: pega aquí el enlace de tu Google Form para la confirmación de asistencia
  formUrl: "https://forms.gle/PON-AQUI-TU-FORMULARIO",
  // musicaUrl: déjalo vacío para usar la melodía integrada (no requiere archivos).
  // Si prefieres tu propia canción, pon aquí la ruta o URL de un .mp3
  musicaUrl: "Pooh.mp3"
};

/* =====================================================================
   5. CIELO ESTRELLADO — genera estrellas aleatorias con parpadeo
   ===================================================================== */
(function buildStars() {
  const layer = document.getElementById('stars-layer');
  const STAR_COUNT = 20;

  const bees = [
    { src: 'ab_izqar.png', x: -40, y: -40 },
    { src: 'ab_izqab.png', x: -40, y: 40 },
    { src: 'ab_derar.png', x: 40, y: -40 },
    { src: 'ab_derab.png', x: 40, y: 40 },
    { src: 'ab_ab.png', x: 0, y: 50 },
    { src: 'ab_ar.png', x: 0, y: -50 }
  ];

  for (let i = 0; i < STAR_COUNT; i++) {

    const beeData = bees[Math.floor(Math.random() * bees.length)];

    const star = document.createElement('img');
    star.className = 'star';
    star.src = beeData.src;

    // tamaño aleatorio
    const size = Math.random() * 30 + 15;
    star.style.width = size + 'px';
    star.style.height = 'auto';

    // posición aleatoria
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';

    // dirección según la imagen
    star.style.setProperty('--move-x', beeData.x + 'px');
    star.style.setProperty('--move-y', beeData.y + 'px');

    // duración aleatoria para que no se muevan igual
    star.style.setProperty(
      '--duration',
      (12 + Math.random() * 10) + 's'
    );

    // retraso aleatorio
    star.style.animationDelay =
      (-Math.random() * 20) + 's';

    layer.appendChild(star);
  }
})();
/* =====================================================================
   6. NAVEGACIÓN ENTRE PÁGINAS (flechas, puntos, teclado, swipe)
   ===================================================================== */
const pages = Array.from(document.querySelectorAll('.page'));
const dotsWrap = document.getElementById('dots');
let current = 0;

// Crea un punto de navegación por cada página
pages.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Ir a la página ' + (i + 1));
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

function render(){
  pages.forEach((p, i) => p.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  document.getElementById('arrow-prev').style.visibility = current === 0 ? 'hidden' : 'visible';
  document.getElementById('arrow-next').style.visibility = current === pages.length - 1 ? 'hidden' : 'visible';
}
function goTo(i){
  current = Math.max(0, Math.min(pages.length - 1, i));
  render();
}
document.getElementById('arrow-prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('arrow-next').addEventListener('click', () => goTo(current + 1));
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowRight') goTo(current + 1);
  if(e.key === 'ArrowLeft')  goTo(current - 1);
});

// Deslizar con el dedo (swipe) en pantallas táctiles
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if(Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
}, {passive:true});

render();

/* =====================================================================
   7. MÚSICA DE FONDO
   Por defecto se genera una melodía tipo "caja de música" con la Web Audio
   API (no necesita ningún archivo). Si CONFIG.musicaUrl tiene un valor,
   se usa esa canción en su lugar mediante una etiqueta <audio>.
   ===================================================================== */
let audioCtx = null, masterGain = null, musicStarted = false, musicPlaying = false;
const musicBtn = document.getElementById('btn-music-toggle');

// Escala pentatónica suave + patrón repetitivo = sonido de caja de música
const SCALE = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    698.46, // F5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
];

const PATTERN = [
    0,2,4,5,4,2,1,0,
    2,3,4,5,4,3,2,1,
    0,2,5,6,5,4,2,0,
    1,3,4,5,3,2,1,0,

    0,2,4,5,4,2,1,0,
    2,3,4,5,4,3,2,1,
    0,2,5,6,5,4,2,0,
    1,3,4,5,3,2,1,0
];
let noteIndex = 0, loopTimer = null;

// Variable para almacenar la URL de la música externa
let musicaExternaUrl = '';

/**
 * Función para establecer una música externa
 * @param {string} url - Ruta o URL del archivo de música (.mp3, .wav, etc.)
 */
function setMusicaExterna(url) {
    if (url && url.trim() !== '') {
        musicaExternaUrl = url.trim();
        // Si ya hay un audio creado, lo actualizamos
        if (window.audioExterno) {
            window.audioExterno.src = musicaExternaUrl;
            window.audioExterno.load();
        }
    }
}

function ensureAudioContext(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0; // arranca en silencio; se sube con un fundido
    masterGain.connect(audioCtx.destination);
  }
}
function playNote(freq, time){
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square'; // tono suave, tipo caja de música
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.35, time + 0.02);  // ataque
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9); // caída/resonancia
  osc.connect(gain).connect(masterGain);
  osc.start(time);
  osc.stop(time + 1);
}
function scheduleLoop(){
  playNote(SCALE[PATTERN[noteIndex % PATTERN.length]], audioCtx.currentTime);
  noteIndex++;
  loopTimer = setTimeout(scheduleLoop, 420); // tempo de la melodía (ms entre notas)
}
function updateMusicIcon(){ musicBtn.classList.toggle('muted', !musicPlaying); }

let startMusic = function(){
  ensureAudioContext();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  if(!musicStarted){ scheduleLoop(); musicStarted = true; }
  masterGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 1.2); // fundido de entrada
  musicPlaying = true;
  updateMusicIcon();
};
let stopMusic = function(){
  if(!audioCtx) return;
  masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6); // fundido de salida
  musicPlaying = false;
  updateMusicIcon();
};

// Si el usuario definió su propia canción, se reemplazan las funciones
// anteriores por controles de un <audio> normal.
if(CONFIG.musicaUrl && CONFIG.musicaUrl.trim() !== ''){
    musicaExternaUrl = CONFIG.musicaUrl.trim();
}

// Función para crear o actualizar el audio externo
function crearAudioExterno() {
    if (window.audioExterno) {
        // Si ya existe, solo actualizamos la fuente
        if (musicaExternaUrl) {
            window.audioExterno.src = musicaExternaUrl;
            window.audioExterno.load();
        }
        return window.audioExterno;
    }
    
    const audioEl = document.createElement('audio');
    if (musicaExternaUrl) {
        audioEl.src = musicaExternaUrl;
    }
    audioEl.loop = true;
    document.body.appendChild(audioEl);
    window.audioExterno = audioEl;
    return audioEl;
}

// Inicializamos el audio si hay URL configurada
if (musicaExternaUrl) {
    const audioExterno = crearAudioExterno();
    
    // Sobrescribimos las funciones start/stop para usar el audio externo
    startMusic = function(){
        const audio = window.audioExterno;
        if (audio && audio.src) {
            audio.play().catch(e => console.log('Error al reproducir audio:', e));
            musicPlaying = true;
            updateMusicIcon();
        } else {
            console.log('No hay música externa configurada, usando sintetizador');
            // Fallback al sintetizador
            ensureAudioContext();
            if(audioCtx.state === 'suspended') audioCtx.resume();
            if(!musicStarted){ scheduleLoop(); musicStarted = true; }
            masterGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 1.2);
            musicPlaying = true;
            updateMusicIcon();
        }
    };
    
    stopMusic = function(){
        const audio = window.audioExterno;
        if (audio) {
            audio.pause();
            musicPlaying = false;
            updateMusicIcon();
        } else {
            if(!audioCtx) return;
            masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
            musicPlaying = false;
            updateMusicIcon();
        }
    };
}

function toggleMusic(){ musicPlaying ? stopMusic() : startMusic(); }
musicBtn.classList.add('muted'); // estado inicial: silenciado hasta que el usuario inicie
musicBtn.addEventListener('click', toggleMusic);

document.getElementById('btn-start').addEventListener('click', () => { startMusic(); goTo(1); });
document.getElementById('btn-skip-sound').addEventListener('click', () => goTo(1));

// Función global para cambiar la música fácilmente desde cualquier parte
window.cambiarMusica = function(nombreArchivo) {
    // Aquí puedes poner la ruta completa o solo el nombre
    const urlMusica = `./musica/${nombreArchivo}`; // Ejemplo de ruta
    setMusicaExterna(urlMusica);
    crearAudioExterno();
    
    // Si la música está sonando, la reiniciamos con el nuevo archivo
    if (musicPlaying) {
        stopMusic();
        setTimeout(() => startMusic(), 100);
    }
    console.log(`Música cambiada a: ${nombreArchivo}`);
};

// Ejemplo de uso desde la consola o desde otro script:
// cambiarMusica('mi-cancion.mp3');
// cambiarMusica('mi-cancion.wav');
// cambiarMusica('https://ejemplo.com/musica.mp3');

/* =====================================================================
   8. TEXTOS DINÁMICOS (rellenan la página con los datos de CONFIG)
   ===================================================================== */
document.getElementById('intro-texto').textContent      = CONFIG.introTexto;
document.getElementById('papas-nombres').textContent    = CONFIG.papas;
document.getElementById('padrinos-nombres').textContent = CONFIG.padrinos;
document.getElementById('mensaje-texto').textContent    = CONFIG.mensaje;
//document.getElementById('nota-asistencia').textContent  = CONFIG.notaAsistencia;
document.getElementById('lugar-nombre-4').textContent   = CONFIG.lugarNombre;
document.getElementById('lugar-direccion-4').textContent= CONFIG.lugarDireccion;
document.getElementById('lugar-texto-corto').textContent= CONFIG.lugarNombre;

/* =====================================================================
   9. FECHA, HORA Y CALENDARIO
   ===================================================================== */
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS_SEMANA = ['L','M','X','J','V','S','D'];

// Combina fecha + hora de CONFIG en un único objeto Date (hora local)
const targetDate = new Date(CONFIG.fecha + 'T' + CONFIG.hora + ':00');

function pad(n){ return String(n).padStart(2, '0'); }

function formatFechaLarga(){
  return targetDate.getDate() + ' de ' + MESES[targetDate.getMonth()] + ' de ' + targetDate.getFullYear();
}
function formatHora12(){
  const [h, m] = CONFIG.hora.split(':').map(Number);
  const sufijo = h >= 12 ? 'p.m.' : 'a.m.';
  let h12 = h % 12; if(h12 === 0) h12 = 12;
  return h12 + ':' + pad(m) + ' ' + sufijo;
}
document.getElementById('fecha-larga').textContent = formatFechaLarga();
document.getElementById('hora-texto').textContent   = formatHora12();

// Genera el calendario del mes del evento y marca el día de la fiesta
function buildCalendar(){
  const year  = targetDate.getFullYear();
  const month = targetDate.getMonth();     // 0 = enero
  const targetDay = targetDate.getDate();

  document.getElementById('cal-mes-anio').textContent = MESES[month] + ' de ' + year;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DIAS_SEMANA.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-weekday';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = domingo ... 6 = sábado
  const offset = (firstWeekday + 6) % 7;                  // convertir a semana que empieza en lunes
  const totalDays = new Date(year, month + 1, 0).getDate();

  for(let i = 0; i < offset; i++){
    const empty = document.createElement('div');
    empty.className = 'cal-day cal-day--empty';
    grid.appendChild(empty);
  }
  for(let day = 1; day <= totalDays; day++){
    const cell = document.createElement('div');
    cell.className = 'cal-day' + (day === targetDay ? ' cal-day--target' : '');
    cell.innerHTML = '<span>' + day + '</span>' + (day === targetDay ? '<i class="cal-star">✦</i>' : '');
    grid.appendChild(cell);
  }
}
buildCalendar();

/* =====================================================================
   10. CUENTA REGRESIVA (días : horas : minutos : segundos)
   ===================================================================== */
function updateCountdown(){
  const diff = targetDate.getTime() - Date.now();

  if(diff <= 0){
    document.getElementById('countdown-wrap').innerHTML = '<p class="countdown-today">¡Hoy es el gran día! 🎉</p>';
    clearInterval(countdownInterval);
    return;
  }
  const dias    = Math.floor(diff / 86400000);
  const horas   = Math.floor((diff % 86400000) / 3600000);
  const minutos = Math.floor((diff % 3600000) / 60000);
  const segundos= Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-dias').textContent  = pad(dias);
  document.getElementById('cd-horas').textContent = pad(horas);
  document.getElementById('cd-min').textContent   = pad(minutos);
  document.getElementById('cd-seg').textContent   = pad(segundos);
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

/* =====================================================================
   11. ENLACE "AÑADIR A MI CALENDARIO" (Google Calendar)
   ===================================================================== */
function toGCalDate(dt){
  return dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate()) + 'T' + pad(dt.getHours()) + pad(dt.getMinutes()) + '00';
}
(function buildGCalLink(){
  const inicio = targetDate;
  const fin = new Date(targetDate.getTime() + 3 * 60 * 60 * 1000); // duración estimada: 3 horas (ajústala si quieres)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Baby Shower',
    dates: toGCalDate(inicio) + '/' + toGCalDate(fin),
    location: CONFIG.lugarDireccion,
    details: CONFIG.notaAsistencia
  });
  document.getElementById('btn-add-calendar').href = 'https://www.google.com/calendar/render?' + params.toString();
})();

/* =====================================================================
   12. BOTÓN DE GOOGLE MAPS
   Si no se definió CONFIG.mapsUrl, se construye una búsqueda automática
   a partir de la dirección — así el botón funciona sin configurar nada.
   ===================================================================== */
document.getElementById('btn-maps').href =
  (CONFIG.mapsUrl && CONFIG.mapsUrl.trim() !== '')
    ? CONFIG.mapsUrl
    : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.lugarDireccion);

    const mapUrl = (CONFIG.mapsUrl && CONFIG.mapsUrl.trim() !== '')
    ? CONFIG.mapsUrl
    : 'https://www.google.com/maps?q=' +
      encodeURIComponent(CONFIG.lugarDireccion) +
      '&output=embed';

document.getElementById('btn-maps').href = mapUrl;
document.getElementById('map-frame').src = mapUrl;

/* =====================================================================
   13. BOTÓN DE CONFIRMACIÓN DE ASISTENCIA (Google Forms)
   ===================================================================== */
document.getElementById('btn-rsvp').href = CONFIG.formUrl;






// =========================================================
// CARRUSEL AUTOMÁTICO CON BARRA DE PROGRESO
// =========================================================

// =========================================================
// CARRUSEL AUTOMÁTICO CON BARRA DE PROGRESO
// =========================================================

class Carousel {
  constructor(options = {}) {
    // Configuración
    this.duration = options.duration || 8000; // 8 segundos por página
    this.pages = document.querySelectorAll('.page');
    this.totalPages = this.pages.length;
    this.currentPage = 0;
    this.isPaused = false;
    this.timer = null;
    this.progressTimer = null;
    this.startTime = 0;
    this.remainingTime = this.duration;
    
    // Elementos existentes
    this.progressBar = document.getElementById('progressBar');
    this.arrowPrev = document.getElementById('arrow-prev');
    this.arrowNext = document.getElementById('arrow-next');
    this.dotsContainer = document.getElementById('dots');
    
    // Inicializar
    this.initDots();
    this.updateNavigation();
    this.start();
    this.setupControls();
  }
  
  initDots() {
    // Usar los dots existentes del HTML
    if (this.dotsContainer) {
      // Si ya hay dots, limpiarlos y recrearlos con eventos
      this.dotsContainer.innerHTML = '';
      
      for (let i = 0; i < this.totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
      }
    }
  }
  
  updateNavigation() {
    // Actualizar flechas
    if (this.arrowPrev) {
      this.arrowPrev.style.visibility = this.currentPage === 0 ? 'hidden' : 'visible';
      this.arrowPrev.style.opacity = this.currentPage === 0 ? '0' : '1';
    }
    
    if (this.arrowNext) {
      this.arrowNext.style.visibility = this.currentPage === this.totalPages - 1 ? 'hidden' : 'visible';
      this.arrowNext.style.opacity = this.currentPage === this.totalPages - 1 ? '0' : '1';
    }
    
    // Actualizar dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentPage);
      });
    }
    
    // Actualizar páginas
    this.pages.forEach((page, index) => {
      page.classList.toggle('active', index === this.currentPage);
    });
  }
  
  showPage(index) {
    this.currentPage = index;
    this.updateNavigation();
    
    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  goTo(index) {
    if (index === this.currentPage) return;
    if (index < 0 || index >= this.totalPages) return;
    
    // Reiniciar el temporizador
    this.stop();
    this.showPage(index);
    this.start();
  }
  
  start() {
    if (this.timer) return;
    
    this.startTime = Date.now();
    this.remainingTime = this.duration;
    
    // Iniciar barra de progreso
    this.updateProgress(1);
    
    // Temporizador principal para cambio de página
    this.timer = setTimeout(() => {
      this.next();
    }, this.duration);
    
    // Temporizador para actualizar la barra de progreso
    this.progressTimer = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const progress = Math.min(1 - (elapsed / this.duration), 1);
      this.updateProgress(progress);
    }, 50);
  }
  
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    
    // Guardar el tiempo restante
    if (this.startTime > 0) {
      const elapsed = Date.now() - this.startTime;
      this.remainingTime = Math.max(0, this.duration - elapsed);
    }
  }
  
  pause() {
    this.isPaused = true;
    this.stop();
    if (this.progressBar) {
      this.progressBar.classList.add('paused');
    }
  }
  
  resume() {
    this.isPaused = false;
    if (this.progressBar) {
      this.progressBar.classList.remove('paused');
    }
    this.start();
  }
  
  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }
  
  next() {
    if (this.currentPage < this.totalPages - 1) {
      this.stop();
      this.showPage(this.currentPage + 1);
      this.start();
    } else {
      // Opcional: si estás en la última página, puedes reiniciar desde el principio
      // this.goTo(0);
    }
  }
  
  prev() {
    if (this.currentPage > 0) {
      this.stop();
      this.showPage(this.currentPage - 1);
      this.start();
    }
  }
  
  updateProgress(value) {
    if (this.progressBar) {
      const percentage = Math.max(0, Math.min(value * 100, 100));
      this.progressBar.style.width = percentage + '%';
      this.progressBar.classList.toggle('active', value > 0 && value < 1);
    }
  }
  
  setupControls() {
    // Flechas existentes
    if (this.arrowPrev) {
      this.arrowPrev.addEventListener('click', () => this.prev());
    }
    
    if (this.arrowNext) {
      this.arrowNext.addEventListener('click', () => this.next());
    }
    
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.togglePause();
      }
    });
    
    // Pausar al pasar el mouse sobre la página
    const main = document.getElementById('app');
    if (main) {
      main.addEventListener('mouseenter', () => this.pause());
      main.addEventListener('mouseleave', () => this.resume());
    }
    
    // Swipe táctil
    let touchStartX = 0;
    let touchStartY = 0;
    
    if (main) {
      main.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }, { passive: true });
      
      main.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          e.preventDefault();
          
          if (deltaX < 0) {
            this.next();
          } else {
            this.prev();
          }
          
          touchStartX = 0;
          touchStartY = 0;
        }
      }, { passive: false });
    }
  }
}

// =========================================================
// INICIALIZAR EL CARRUSEL
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
  const checkData = setInterval(() => {
    const introText = document.getElementById('intro-texto');
    if (introText && introText.textContent !== '') {
      clearInterval(checkData);
      initCarousel();
    }
  }, 100);
  
  setTimeout(() => {
    const introText = document.getElementById('intro-texto');
    if (introText && introText.textContent === '') {
      initCarousel();
    }
  }, 5000);
  
  function initCarousel() {
    window.carousel = new Carousel({
      duration: 8000 // 8 segundos por página
    });
    
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        if (window.carousel && window.carousel.isPaused) {
          window.carousel.resume();
        }
      });
    }
  }
});


// =========================================================
// FUNCIONES DE UTILIDAD PARA EL CARRUSEL
// =========================================================

// Si necesitas pausar/reanudar manualmente desde la consola:
// window.carousel.pause()
// window.carousel.resume()
// window.carousel.goTo(2) // ir a la página 2
// window.carousel.next()
// window.carousel.prev()

// Cambiar la duración dinámicamente:
// window.carousel.duration = 10000 // 10 segundos