document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("filtro-anios");

    fetch("php/anual.php")
        .then(res => res.json())
        .then(data => {

            if (!data || data.length === 0) {
                const span = document.createElement("span");
                span.textContent = "No hay años disponibles";
                contenedor.appendChild(span);
                return;
            }

            data.forEach(item => {
                const btn = document.createElement("button");
                btn.className = "btn-anio";
                btn.textContent = `${item.cantidad}/${item.anio}`;
                btn.title = `Último registro: ${item.ultimo_numero}`;
                btn.addEventListener("click", () => {
                    aplicarFiltroAnio(item.anio);
                });

                contenedor.appendChild(btn);
            });
        })
        .catch(err => {
            console.error("Error cargando años:", err);
        });
});


function aplicarFiltroAnio(anio){
    const input = document.querySelector("input[data-filtro='numero']");
    if(!input) return;
    input.value = anio;
    input.dispatchEvent(new Event("input", { bubbles: true }));
}