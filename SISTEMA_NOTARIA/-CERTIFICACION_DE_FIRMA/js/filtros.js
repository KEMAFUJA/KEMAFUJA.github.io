async function filtrarActas() {

    const params = new URLSearchParams();

    document.querySelectorAll("[data-filtro]").forEach(el => {
        if (el.value.trim() !== "") {
            params.append(el.dataset.filtro, el.value.trim());
        }
    });

    const res = await fetch("php/obtener_actas.php?" + params.toString());
    const html = await res.text();

    document.querySelector("#tablaActas tbody").innerHTML = html;
}

// Escuchar filtros
document.querySelectorAll("[data-filtro]").forEach(f => {
    f.addEventListener("input", filtrarActas);
    f.addEventListener("change", filtrarActas);
});

// Cargar todas las actas al inicio
filtrarActas();



