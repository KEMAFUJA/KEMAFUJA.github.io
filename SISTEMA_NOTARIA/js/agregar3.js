document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", async function(e) {
        // Asegurarnos de que el click sea en un botón, no en un icono interno
        const boton = e.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("tr");
        if (!fila) return;

        // ---------------- AÑADIR PARTICIPANTE ----------------
        if (boton.classList.contains("agregar-participante")) {

            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                
                <td><input class="nombre" placeholder="Nombre"></td>
                <td><input class="identificacion" placeholder="Identificación"></td>
                <td>
                    <select class="tipo_persona">
                        <option value="NATURAL">NATURAL</option>
                        <option value="JURIDICA">JURIDICA</option>
                        <option value="ANULADO">ANULADO</option>
                    </select>
                </td>
                <td><input data-filtro="nacionalidad" class="nacionalidad" placeholder="Nacionalidad"></td>
                <td><input data-filtro="calidad" class="calidad" placeholder="Calidad"></td>
                <td><input class="nombre_beneficiario" placeholder="Nombre"></td>
                <td>
                    <button class="guardar-nuevo-participante" title="Guardar">💾</button>
                    <button class="cancelar-nuevo-participante" title="Cancelar">❌</button>
                </td>
            `;
            fila.after(nuevaFila);
            const nuevoInput = nuevaFila.querySelector('.nacionalidad');
            activarAutocompleteNacionalidad(nuevoInput);
            return;
        }

        // ---------------- GUARDAR NUEVO PARTICIPANTE ----------------
        if (boton.classList.contains("guardar-nuevo-participante")) {
            boton.disabled = true;
            const filaDocumento = fila.previousElementSibling;
            const id_documento = filaDocumento.dataset.iddocumento;

            const datos = {
                id_documento: id_documento,
                nombre: fila.querySelector(".nombre").value,
                identificacion: fila.querySelector(".identificacion").value,
                tipo_persona: fila.querySelector(".tipo_persona").value,
                nacionalidad: fila.querySelector(".nacionalidad").value,
                calidad: fila.querySelector(".calidad").value
            };

            try {
            const res = await fetch("../php/agregar_participante3.php", {
                method: "POST",
                body: new URLSearchParams(datos)
            });
            const json = await res.json();

                fila.innerHTML = `
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td> 
                    <td></td>
                    <td></td>
                    
                    <td>${json.nombre}</td>
                    <td>${json.identificacion}</td>
                    <td>${json.tipo_persona}</td>
                    <td>${json.nacionalidad}</td>
                    <td>${json.nombre_beneficiario}</td>
                    <td>
                        <button class='editar-participante' title='Modificar Participante'><i class='fa-solid fa-user-edit'></i></button>
                        <!--button class='editar-participante'>✏️</button-->
                        <button class='eliminar-participante' title='Eliminar Participante'><i class='fa-solid fa-trash-can'></i></button>
                    </td>
                `;
            } catch (err) {
                console.error("Error al guardar participante:", err);
                boton.disabled = false;
            }
            return;
        }

        // ---------------- CANCELAR NUEVO PARTICIPANTE ----------------
        if (boton.classList.contains("cancelar-nuevo-participante")) {
            fila.remove();
            return;
        }

    });
});