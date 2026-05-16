document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", async function(e) {
        // Asegurarnos de que el click sea en un botón, no en un icono interno
        const boton = e.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("tr");
        if (!fila) return;
        
        // ---------------- ELIMINAR DOCUMENTO ----------------
        if (boton.classList.contains("eliminar-documento")) {
            if (!confirm("¿Eliminar este documento y todos sus participantes?")) return;
            boton.disabled = true; // prevenir clicks repetidos

            const idDoc = fila.dataset.iddocumento; // data-iddocumento

            try {
                const res = await fetch("../php/eliminar_documento2.php", {
                    method: "POST",
                    body: new URLSearchParams({ id_documento: idDoc })
                });
                const texto = await res.text();
                console.log(texto);

                // Opcional: eliminar filas del DOM
                document.querySelectorAll(`tr[data-iddocumento='${idDoc}']`).forEach(r => r.remove());

            } catch (err) {
                console.error("Error al eliminar documento:", err);
            }
            return;
        }


        // ---------------- ELIMINAR PARTICIPANTE ----------------
        if (boton.classList.contains("eliminar-participante")) {
            if (!confirm("¿Eliminar este participante?")) return;
            boton.disabled = true;

            const idParticipante = fila.dataset.idparticipante;
            try {
                const res = await fetch("../php/eliminar_participante.php", {
                    method: "POST",
                    body: new URLSearchParams({ id_participante: idParticipante })
                });
                const texto = await res.text();
                console.log(texto);
                fila.remove();
            } catch (err) {
                console.error("Error al eliminar participante:", err);
            }
            return;
        }


    });
});