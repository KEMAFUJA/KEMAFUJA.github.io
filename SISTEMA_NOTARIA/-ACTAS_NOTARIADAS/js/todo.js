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

            try {
                const res = await fetch("php/eliminar_documento.php", {
                    method: "POST",
    
                });
                const texto = await res.text();
                console.log(texto);

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
                const res = await fetch("php/eliminar_participante.php", {
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

        // ---------------- AÑADIR PARTICIPANTE ----------------
        if (boton.classList.contains("agregar-participante")) {

            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
                <td></td><td></td><td></td>
                <td><input class="nombre" placeholder="Nombre"></td>
                <td><input class="identificacion" placeholder="Identificación"></td>
                <td>
                    <select class="tipo_persona">
                        <option value="NATURAL">NATURAL</option>
                        <option value="JURIDICA">JURIDICA</option>
                        <option value="ANULADO">ANULADO</option>
                    </select>
                </td>
                <td><input class="nacionalidad" placeholder="Nacionalidad"></td>

                <td>
                    <button class="guardar-nuevo-participante" title="Guardar">💾</button>
                    <button class="cancelar-nuevo-participante" title="Cancelar">❌</button>
                </td>
            `;
            fila.after(nuevaFila);
            return;
        }

        // ---------------- GUARDAR NUEVO PARTICIPANTE ----------------
        if (boton.classList.contains("guardar-nuevo-participante")) {
            boton.disabled = true;
            const filaDocumento = fila.previousElementSibling;
            const id_documento = filaDocumento.dataset.iddocumento;

            const inputs = fila.querySelectorAll("input, select");

            const datos = {
                id_documento: id_documento,
                nombre: fila.querySelector(".nombre").value,
                identificacion: fila.querySelector(".identificacion").value,
                tipo_persona: fila.querySelector(".tipo_persona").value,
                nacionalidad: fila.querySelector(".nacionalidad").value
            };

            try {
            const res = await fetch("php/agregar_participante.php", {
                method: "POST",
                body: new URLSearchParams(datos)
            });
            const json = await res.json();

                fila.innerHTML = `
                    <td></td><td></td><td></td>
                    <td>${json.nombre}</td>
                    <td>${json.identificacion}</td>
                    <td>${json.tipo_persona}</td>
                    <td>${json.nacionalidad}</td>
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

        // ---------------- EDITAR DOCUMENTO ----------------
        if (boton.classList.contains("editar-documento")) {

            fila.dataset.numero = fila.cells[0].textContent;
            fila.dataset.fecha = fila.cells[1].textContent;
            fila.dataset.doc = fila.cells[2].textContent;

            fila.cells[0].innerHTML = `<input type="text" value="${fila.dataset.numero}" style="width:100%">`;
            fila.cells[1].innerHTML = `<input type="date" value="${fila.dataset.fecha}" style="width:100%">`;
            fila.cells[2].innerHTML = `<input type="text" value="${fila.dataset.doc}" style="width:100%">`;

            const btnGuardar = document.createElement("button");
            btnGuardar.innerHTML = '💾';
            btnGuardar.className = "guardar-documento";
            btnGuardar.title = "Guardar";

            const btnCancelar = document.createElement("button");
            btnCancelar.innerHTML = '❌';
            btnCancelar.className = "cancelar-documento";
            btnCancelar.title = "Cancelar";

            boton.after(btnGuardar, btnCancelar);
            boton.classList.add("oculto");

            fila.querySelector(".eliminar-documento")?.classList.add("oculto");
            fila.querySelector(".agregar-participante")?.classList.add("oculto");

            fila.classList.add("editando");
            return;
        }

        // ---------------- GUARDAR DOCUMENTO ----------------
        if (boton.classList.contains("guardar-documento")) {
            boton.disabled = true;

            const numero = fila.cells[0].children[0].value;
            const fecha = fila.cells[1].children[0].value;
            const doc = fila.cells[2].children[0].value;


            try {
                const res = await fetch("php/editar_documento.php", {
                    method: "POST",
                    body: datos
                });
                const texto = await res.text();
                console.log(texto);

                fila.cells[0].textContent = numero;
                fila.cells[1].textContent = fecha;
                fila.cells[2].textContent = doc;

                restaurarDocumento(fila);
            } catch (err) {
                console.error("Error al actualizar documento:", err);
                boton.disabled = false;
            }
            return;
        }

        // ---------------- CANCELAR DOCUMENTO ----------------
        if (boton.classList.contains("cancelar-documento")) {
            fila.cells[0].textContent = fila.dataset.numero;
            fila.cells[1].textContent = fila.dataset.fecha;
            fila.cells[2].textContent = fila.dataset.doc;

            restaurarDocumento(fila);
            return;
        }

        // ---------------- EDITAR PARTICIPANTE ----------------
        if (boton.classList.contains("editar-participante")) {

            fila.dataset.nombre = fila.cells[3].textContent;
            fila.dataset.identificacion = fila.cells[4].textContent;
            fila.dataset.tipo_persona = fila.cells[5].textContent;
            fila.dataset.nacionalidad = fila.cells[6].textContent;

            ["nombre", "identificacion", "tipo_persona", "nacionalidad"].forEach((campo, i) => {
                const valor = fila.cells[i + 3].textContent;
                if (campo === "tipo_persona") {
                    fila.cells[i + 3].innerHTML = `
                        <select>
                            <option value="NATURAL" ${valor === "NATURAL" ? "selected" : ""}>NATURAL</option>
                            <option value="JURIDICA" ${valor === "JURIDICA" ? "selected" : ""}>JURIDICA</option>
                            <option value="ANULADO" ${valor === "ANULADO" ? "selected" : ""}>ANULADO</option>
                        </select>`;
                } else {
                    fila.cells[i + 3].innerHTML = `<input value="${valor}">`;
                }
            });

            const btnGuardar = document.createElement("button");
            btnGuardar.innerHTML = '💾';
            btnGuardar.className = "guardar-participante";
            btnGuardar.title = "Guardar participante";

            const btnCancelar = document.createElement("button");
            btnCancelar.innerHTML = '❌';
            btnCancelar.className = "cancelar-modificar-participante";
            btnCancelar.title = "Cancelar";

            boton.after(btnGuardar, btnCancelar);
            boton.classList.add("oculto");

            fila.querySelector(".eliminar-participante")?.classList.add("oculto");
            fila.classList.add("editando");
            return;
        }

        // ---------------- GUARDAR PARTICIPANTE ----------------
        if (boton.classList.contains("guardar-participante")) {
            boton.disabled = true;

            const idParticipante = fila.dataset.idparticipante;
            const nombre = fila.cells[3].children[0].value;
            const identificacion = fila.cells[4].children[0].value;
            const tipo_persona = fila.cells[5].children[0].value;
            const nacionalidad = fila.cells[6].children[0].value;

            const datos = new URLSearchParams({ id_participante: idParticipante, nombre, identificacion, tipo_persona, nacionalidad });

            try {
                const res = await fetch("php/editar_participante.php", { method: "POST", body: datos });
                const texto = await res.text();
                console.log(texto);

                fila.cells[3].textContent = nombre;
                fila.cells[4].textContent = identificacion;
                fila.cells[5].textContent = tipo_persona;
                fila.cells[6].textContent = nacionalidad;

                fila.querySelector(".editar-participante")?.classList.remove("oculto");
                fila.querySelector(".eliminar-participante")?.classList.remove("oculto");
                fila.querySelector(".guardar-participante")?.remove();
                fila.querySelector(".cancelar-modificar-participante")?.remove();

                fila.classList.remove("editando");
            } catch (err) {
                console.error("Error al actualizar participante:", err);
                boton.disabled = false;
            }
            return;
        }

        // ---------------- CANCELAR PARTICIPANTE ----------------
        if (boton.classList.contains("cancelar-modificar-participante")) {
            fila.cells[3].textContent = fila.dataset.nombre;
            fila.cells[4].textContent = fila.dataset.identificacion;
            fila.cells[5].textContent = fila.dataset.tipo_persona;
            fila.cells[6].textContent = fila.dataset.nacionalidad;

            restaurarParticipante(fila);
            return;
        }

    }); // fin del listener click

    // ---------------- FUNCIONES AUXILIARES ----------------
    function restaurarDocumento(fila) {
        fila.querySelector(".guardar-documento")?.remove();
        fila.querySelector(".cancelar-documento")?.remove();

        fila.querySelector(".editar-documento")?.classList.remove("oculto");
        fila.querySelector(".eliminar-documento")?.classList.remove("oculto");
        fila.querySelector(".agregar-participante")?.classList.remove("oculto");

        fila.classList.remove("editando");
    }

    function restaurarParticipante(fila) {
        fila.querySelector(".guardar-participante")?.remove();
        fila.querySelector(".cancelar-modificar-participante")?.remove();

        fila.querySelector(".editar-participante")?.classList.remove("oculto");
        fila.querySelector(".eliminar-participante")?.classList.remove("oculto");

        fila.classList.remove("editando");
    }

});
