  import { createTypewriter } from '../maquina.js';

  const writer = createTypewriter({
    modo: "secuencial",
    velocidadEscritura: 150,
    velocidadBorrado: 100,
    pausaEscritura: 500,
    pausaFinal: 200,
    texto1: "KEMAFUJA",
    texto2: "ENTERPRISE"
  });

  
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") writer.stop();
    if (e.key === "Enter") writer.restart();
  });
