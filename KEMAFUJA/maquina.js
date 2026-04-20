export function createTypewriter(config = {}) {

  const {
    line1Selector = "#line1",
    line2Selector = "#line2",
    fontNameSelector = "#nombre-fuente",

    texto1 = "KEMAFUJA",
    texto2 = "ENTERPRISE",

    modo = "secuencial", // simultaneo | secuencial
    velocidadEscritura = 100,
    velocidadBorrado = 50,
    pausaEscritura = 1200,
    pausaFinal = 3000,

    usarFuenteEnNombre = true
  } = config;

  const line1 = document.querySelector(line1Selector);
  const line2 = document.querySelector(line2Selector);
  const fontNameEl = document.querySelector(fontNameSelector);

  let fontData = {};
  let fuentes = [];

  let i1 = 0;
  let i2 = 0;
  let escribiendo = true;
  let indexFuente = 0;

  fetch("./KEMAFUJA/datos/fontconfig.json")
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

  function generarClamp(baseSize) {
    return `clamp(${baseSize * 0.25}px, ${baseSize / 7}vw, ${baseSize}px)`;
  }

  function aplicarFuente(fuente) {
    const config = fontData[fuente] || fontData["default"];

    line1.style.fontFamily = `'${fuente}', sans-serif`;
    line1.style.fontSize = generarClamp(config.baseSize);

    line2.style.fontFamily = `'${fuente}', sans-serif`;
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

      fontNameEl.style.fontFamily = usarFuenteEnNombre
        ? `'${fuente}', sans-serif`
        : "sans-serif";

      fontNameEl.style.opacity = 1;
    }, 200);
  }

  function animar() {
    const fuenteActual = fuentes[indexFuente];

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
          setTimeout(animar, pausaEscritura);
          return;
        }

      } else {

        if (i1 < texto1.length) line1.textContent += texto1[i1++];
        if (i2 < texto2.length) line2.textContent += texto2[i2++];

        if (i1 >= texto1.length && i2 >= texto2.length) {
          escribiendo = false;
          setTimeout(animar, pausaFinal);
          return;
        }
      }

      setTimeout(animar, velocidadEscritura);

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

        if (i1 > 0) line1.textContent = texto1.substring(0, --i1);
        if (i2 > 0) line2.textContent = texto2.substring(0, --i2);

        if (i1 === 0 && i2 === 0) {
          reset();
          return;
        }
      }

      setTimeout(animar, velocidadBorrado);
    }
  }

  function actualizarCursores() {
    if (modo === "simultaneo") {
      line1.classList.add("cursor");
      line2.classList.add("cursor");
    } else {
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

  function reset() {
    escribiendo = true;
    indexFuente = (indexFuente + 1) % fuentes.length;

    line1.classList.remove("cursor");
    line2.classList.remove("cursor");

    setTimeout(animar, 500);
  }

  // 🔥 API pública (esto ya es nivel pro)
  return {
    stop() {
      escribiendo = false;
    },
    restart() {
      i1 = 0;
      i2 = 0;
      escribiendo = true;
      animar();
    }
  };
}