async function filtrarActas() {
    const params = new URLSearchParams({
        numero: document.querySelector('[data-filtro="numero"]').value,
        fecha: document.querySelector('[data-filtro="fecha"]').value,
        nombre: document.querySelector('[data-filtro="nombre"]').value,
        identificacion: document.querySelector('[data-filtro="identificacion"]').value,
        tipo: document.querySelector('[data-filtro="tipo"]').value,
        nacionalidad: document.querySelector('[data-filtro="nacionalidad"]').value
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
