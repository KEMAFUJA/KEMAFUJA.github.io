const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const fontNameEl = document.getElementById("nombre-fuente");

const texto1 = "KEMAFUJA";
const texto2 = "ENTERPRISE";

const modo = "secuencial"; // simultaneo / secuencial
let usarFuenteEnNombre = true; // true = aplica fuente, false = default
let fontData = {};
let fuentes = [];

let i1 = 0;
let i2 = 0;

let escribiendo = true;
let indexFuente = 0;

fetch("datos/fontconfig.json")
  .then(res => res.json())
  .then(data => {
    fontData = data;
    fuentes = Object.keys(fontData).filter(f => f !== "default");
    animar();
  });

function cargarFuente(nombre) {
  const fontName = nombre.replace(/ /g, "+");

  if (document.querySelector(`link[data-font="${fontName}"]`)) return;

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
  link.rel = "stylesheet";
  link.dataset.font = fontName;

  document.head.appendChild(link);
}

function aplicarFuente(fuente) {
  const config = fontData[fuente] || fontData["default"];

  line1.style.fontFamily = `'${fuente}', sans-serif`;
//  line1.style.fontSize = config.baseSize + "px";
  line1.style.fontSize = generarClamp(config.baseSize);


  line2.style.fontFamily = `'${fuente}', sans-serif`;
//  line2.style.fontSize = (config.baseSize * 0.5) + "px"; // 👈 AJUSTA AQUÍ
  line2.style.fontSize = generarClamp(config.baseSize * 0.25);

  [line1, line2].forEach(el => {
    el.style.lineHeight = config.lineHeight;
    el.style.letterSpacing = config.letterSpacing;
  });
}

function cambiarNombreFuente(fuente) {
  fontNameEl.style.opacity = 0;

  setTimeout(() => {
    fontNameEl.textContent = fuente;

    if (usarFuenteEnNombre) {
      fontNameEl.style.fontFamily = `'${fuente}', sans-serif`;
    } else {
      fontNameEl.style.fontFamily = "sans-serif";
    }

    fontNameEl.style.opacity = 1;
  }, 200);
}

function animar() {
  const fuenteActual = fuentes[indexFuente];

  // 🔥 inicio de ciclo
  if (i1 === 0 && i2 === 0 && escribiendo) {
    cargarFuente(fuenteActual);
    aplicarFuente(fuenteActual);
    cambiarNombreFuente(fuenteActual);
    
    line1.textContent = "";
    line2.textContent = "";
  }
  actualizarCursores();
  if (escribiendo) {

    if (modo === "secuencial") {

      if (i1 < texto1.length) {
        line1.textContent += texto1[i1++];
      } else if (i2 < texto2.length) {
        line2.textContent += texto2[i2++];
      } else {
        escribiendo = false;
        setTimeout(animar, 1200);
        return;
      }

    } else {

      if (i1 < texto1.length) {
        line1.textContent += texto1[i1++];
      }

      if (i2 < texto2.length) {
        line2.textContent += texto2[i2++];
      }

      if (i1 >= texto1.length && i2 >= texto2.length) {
        escribiendo = false;
        setTimeout(animar, 3000);
        return;
      }
    }
    //vel. entre cada fuente
    setTimeout(animar, 100);

  } else {

    if (modo === "secuencial") {

      if (i2 > 0) {
        line2.textContent = texto2.substring(0, --i2);
      } else if (i1 > 0) {
        line1.textContent = texto1.substring(0, --i1);
      } else {
        reset();
        return;
      }

    } else {

      if (i1 > 0) {
        line1.textContent = texto1.substring(0, --i1);
      }

      if (i2 > 0) {
        line2.textContent = texto2.substring(0, --i2);
      }

      if (i1 === 0 && i2 === 0) {
        reset();
        return;
      }
    }
    //vel. entre cada fuente
    setTimeout(animar, 50);
  }
}

function actualizarCursores() {
  if (modo === "simultaneo") {
    // 🔥 ambos activos
    line1.classList.add("cursor");
    line2.classList.add("cursor");

  } else {
    // 🔥 solo uno activo
    if (escribiendo) {
      if (i1 < texto1.length) {
        line1.classList.add("cursor");
        line2.classList.remove("cursor");
      } else {
        line1.classList.remove("cursor");
        line2.classList.add("cursor");
      }
    } else {
      if (i2 > 0) {
        line2.classList.add("cursor");
        line1.classList.remove("cursor");
      } else {
        line1.classList.add("cursor");
        line2.classList.remove("cursor");
      }
    }
  }
}

function reiniciarAnimacion(el) {
  el.classList.remove("animar-aparicion");

  // 🔥 fuerza reflow (esto es la magia negra)
  void el.offsetWidth;

  el.classList.add("animar-aparicion");
}

function generarClamp(baseSize) {
  return `clamp(${baseSize * 0.25}px, ${baseSize / 7}vw, ${baseSize}px)`;
}

function reset() {
  escribiendo = true;
  indexFuente = (indexFuente + 1) % fuentes.length;

  // limpiar cursores
  line1.classList.remove("cursor");
  line2.classList.remove("cursor");

  setTimeout(animar, 500);
}
