    import { createFloatingShapes } from '../../-OTROS/particulas_chocan.js';

    const controlador = createFloatingShapes({
        cantidad: 15,
        tamMin: 10,
        tamMax: 60,
        velMax: 10,
        multVel: 0.1,
        forma: 'cuadrado' //cirqlo, triangul, cuadrdo, estrlla, s0l, krta
    });

    setTimeout(() => {
        console.log("Shapes creados:", document.querySelectorAll(".chocan-logo").length);
    }, 1000);

    window.addEventListener("click", () => controller.reload());

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") controller.stop();
    });
