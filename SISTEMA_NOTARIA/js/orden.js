const tabla = document.getElementById("tablaActas");
const ths = tabla.querySelectorAll("th[data-col]");
const tbody = tabla.querySelector("tbody");

let ordenActual = {};

function obtenerBloques() {

    const filas = Array.from(tbody.querySelectorAll("tr"));
    const bloques = [];

    let bloque = null;

    filas.forEach(fila => {

        if (fila.classList.contains("documento-nuevo")) {
            bloque = {
                principal: fila,
                hijos: []
            };
            bloques.push(bloque);
        } else if (bloque) {
            bloque.hijos.push(fila);
        }

    });

    return bloques;
}

ths.forEach(th => {

    th.style.cursor = "pointer";

    th.addEventListener("click", () => {

        const col = parseInt(th.dataset.col);

        ordenActual[col] = ordenActual[col] === "asc" ? "desc" : "asc";

        // Limpiar flechas
        ths.forEach(t => t.querySelector("span").textContent = "");

        th.querySelector("span").textContent =
            ordenActual[col] === "asc" ? " ▲" : " ▼";

        const bloques = obtenerBloques();

        bloques.sort((a, b) => {

            let A = a.principal.cells[col].innerText.trim();
            let B = b.principal.cells[col].innerText.trim();

            if (col === 1) { // fecha
                return ordenActual[col] === "asc"
                    ? new Date(A) - new Date(B)
                    : new Date(B) - new Date(A);
            }

            if (col === 0) { // numero
                return ordenActual[col] === "asc"
                    ? A.localeCompare(B, undefined, { numeric: true })
                    : B.localeCompare(A, undefined, { numeric: true });
            }

            return ordenActual[col] === "asc"
                ? A.localeCompare(B)
                : B.localeCompare(A);
        });

        tbody.innerHTML = "";

        bloques.forEach(b => {
            tbody.appendChild(b.principal);
            b.hijos.forEach(h => tbody.appendChild(h));
        });

    });

});
