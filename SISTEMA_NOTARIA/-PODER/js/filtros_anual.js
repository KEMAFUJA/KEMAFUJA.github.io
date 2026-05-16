document.addEventListener("DOMContentLoaded", () => {

    fetch("php/anual.php")
        .then(res => res.json())
        .then(data => {

            const contenedor = document.getElementById("filtro-anios");

            data.forEach(item => {

                const btn = document.createElement("button");
                btn.className = "btn-anio";
                btn.textContent = `${item.cantidad}/${item.anio}`;

                btn.onclick = () => {
                    aplicarFiltroAnio(item.anio);
                };

                contenedor.appendChild(btn);
            });

        });

});

function aplicarFiltroAnio(anio){

    const input = document.querySelector("input[data-filtro='numero']");
    input.value = anio;

    // dispara el mismo evento que usas al escribir
    input.dispatchEvent(new Event("input"));
}
