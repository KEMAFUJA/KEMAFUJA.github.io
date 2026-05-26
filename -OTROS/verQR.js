const abrirQr = document.querySelector(".sello-contenedor");
const cerrarQr = document.getElementById("cerrarQr");
const qrModal = document.getElementById("qrModal");
const qrOverlay = qrModal ? qrModal.querySelector(".qr-overlay") : null;

if (abrirQr && cerrarQr && qrModal && qrOverlay) {
    abrirQr.addEventListener("click", (e) => {
        e.stopPropagation();
        qrModal.classList.add("activo");
    });

    cerrarQr.addEventListener("click", (e) => {
        e.stopPropagation();
        qrModal.classList.remove("activo");
    });

    qrOverlay.addEventListener("click", () => {
        qrModal.classList.remove("activo");
    });
}
