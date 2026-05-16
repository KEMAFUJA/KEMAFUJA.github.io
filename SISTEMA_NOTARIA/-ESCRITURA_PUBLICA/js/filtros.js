async function filtrarActas() {
    const params = new URLSearchParams({
        numero: document.querySelector('[data-filtro="numero"]').value,
        fecha: document.querySelector('[data-filtro="fecha"]').value,
        documento: document.querySelector('[data-filtro="documento"]').value,
        tipo_doc: document.querySelector('[data-filtro="tipo_doc"]').value,
        beneficiarios: document.querySelector('[data-filtro="beneficiarios"]').value,
        tipo_pago: document.querySelector('[data-filtro="tipo_pago"]').value,
        municipio: document.querySelector('[data-filtro="municipio"]').value,
        nombre: document.querySelector('[data-filtro="nombre"]').value,
        identificacion: document.querySelector('[data-filtro="identificacion"]').value,
        tipo: document.querySelector('[data-filtro="tipo"]').value,
        calidad: document.querySelector('[data-filtro="calidad"]').value,
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



