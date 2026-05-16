document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", async function(e) {
        // Asegurarnos de que el click sea en un botón, no en un icono interno
        const boton = e.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("tr.documento-nuevo") || boton.closest("tr");
        if (!fila) return;

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

    const filaDocumento = boton.closest("tr.documento-nuevo");

    const numero = filaDocumento.cells[0].children[0].value;
    const fecha  = filaDocumento.cells[1].children[0].value;
    const doc    = filaDocumento.cells[2].children[0].value;
    const idDoc  = filaDocumento.dataset.iddocumento;

    const datos = new URLSearchParams({
        id_documento: idDoc,
        numero: numero,
        fecha: fecha,
        documento: doc
    });

    try {
        const res = await fetch("../php/editar_documento.php", {
            method: "POST",
            body: datos
        });

        const texto = await res.text();
        console.log(texto);

        filaDocumento.cells[0].textContent = numero;
        filaDocumento.cells[1].textContent = fecha;
        filaDocumento.cells[2].textContent = doc;

        restaurarDocumento(filaDocumento);

    } catch (err) {
        console.error(err);
        boton.disabled = false;
    }
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

            // Mapeo de campos a sus valores de data-filtro
            const campos = [
                { campo: "nombre", dataFiltro: "nombre" },
                { campo: "identificacion", dataFiltro: "identificacion" },
                { campo: "tipo_persona", dataFiltro: "" },
                { campo: "nacionalidad", dataFiltro: "nacionalidad" }
            ];

            campos.forEach((item, i) => {
                const valor = fila.cells[i + 3].textContent;
                if (item.campo === "tipo_persona") {
                    fila.cells[i + 3].innerHTML = `
                        <select>
                            <option value="NATURAL" ${valor === "NATURAL" ? "selected" : ""}>NATURAL</option>
                            <option value="JURIDICA" ${valor === "JURIDICA" ? "selected" : ""}>JURIDICA</option>
                            <option value="ANULADO" ${valor === "ANULADO" ? "selected" : ""}>ANULADO</option>
                        </select>`;
                } else {
                    const dataFiltroAttr = item.dataFiltro ? `data-filtro="${item.dataFiltro}"` : '';
                    fila.cells[i + 3].innerHTML = `<input value="${valor}" ${dataFiltroAttr} class="${item.campo}">`;
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
            
            // Inicializar autocomplete para los inputs nuevos
            setTimeout(() => {
                const inputsConFiltro = fila.querySelectorAll('[data-filtro]');
                inputsConFiltro.forEach(input => {
                    if (!input.hasAttribute('data-autocomplete')) {
                        // Llama a tu función de autocomplete según el tipo de filtro
                        const tipo = input.getAttribute('data-filtro');
                        if (tipo === 'nacionalidad') {
                            activarAutocompleteNacionalidad(input);
                        }
                        input.setAttribute('data-autocomplete', 'true');
                    }
                });
            }, 50);
            
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
                const res = await fetch("../php/editar_participante.php", { method: "POST", body: datos });
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

    });

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