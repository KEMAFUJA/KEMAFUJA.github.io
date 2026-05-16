// contador.js
function contador(){

    const ultimo = document.getElementById("Ultimo");
    const cuantos = document.getElementById("Cuantas");

    if (!ultimo || !cuantos) return; // 🔥 evita errores si no existe en el DOM

    fetch("php/anual.php")
        .then(res => res.json())
        .then(data => {

            if(!data || data.length === 0){
                ultimo.textContent = "Sin registros";
                cuantos.textContent = "";
                return;
            }

            const fila = data[0];

            ultimo.innerHTML =
                `Último ingresado: <span class="dato">${fila.ultimo_numero}</span>`;

            cuantos.innerHTML =
                `Total ingresados: <span class="dato">${fila.cantidad}</span> en <span class="dato">${fila.anio}</span>`;
        })
        .catch(console.error);
}

// 🔥 aseguramos ejecución inicial
document.addEventListener("DOMContentLoaded", contador);