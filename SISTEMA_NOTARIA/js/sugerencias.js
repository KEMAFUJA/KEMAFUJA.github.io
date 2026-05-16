document.addEventListener('DOMContentLoaded', function () {

    let selectedIndex = -1;

    function obtenerSugerenciasNombre(valor, lista, input) {

        if (valor.length < 2) {
            lista.innerHTML = '';
            selectedIndex = -1;
            return;
        }

        fetch(`../php/autocompletar.php?q=${encodeURIComponent(valor)}`)
            .then(r => r.json())
            .then(data => {

                lista.innerHTML = '';
                selectedIndex = -1;

                if (!data.length) return;

                data.forEach((obj, index) => {

                    const li = document.createElement('li');
                    li.textContent = obj.nombre;
                    li.dataset.index = index;
                    li.dataset.data = JSON.stringify(obj);

                    li.style.cursor = 'pointer';
                    li.style.padding = '8px 10px';
                    li.style.borderBottom = '1px solid #eee';

                    li.addEventListener('click', () => {
                        rellenarCampos(input, obj);
                        lista.innerHTML = '';
                        selectedIndex = -1;
                    });

                    lista.appendChild(li);
                }); 
            });
    }

    function rellenarCampos(inputNombre, data) {

    const participante = inputNombre.closest('.participante');

    const inputPais = participante.querySelector('input[name="pais[]"]');

    inputNombre.value = data.nombre ?? '';

    participante.querySelector('input[name="identificacion[]"]').value =
        data.identificacion ?? '';

    participante.querySelector('select[name="tipo_persona[]"]').value =
        (data.tipo_persona ?? 'Natural');

    // Asignar país
    inputPais.value = data.nacionalidad ?? '';

    // 🔥 DISPARAR EVENTO PARA QUE gentilicio.js ACTÚE
    inputPais.dispatchEvent(new Event('input', { bubbles: true }));
}


    // INPUT nombre
    document.addEventListener('input', function (e) {

        if (e.target.name === 'nombre[]') {

            const input = e.target;
            const lista = input.closest('.nombre')
                              ?.querySelector('.listaSugerenciasNombre');

            if (!lista) return;

            clearTimeout(input._timer);
            input._timer = setTimeout(() => {
                obtenerSugerenciasNombre(input.value, lista, input);
            }, 250);
        }
    });

    // TECLADO (Enter / Flechas)
    document.addEventListener('keydown', function (e) {

        if (e.target.name !== 'nombre[]') return;

        const input = e.target;
        const lista = input.closest('.nombre')
                          ?.querySelector('.listaSugerenciasNombre');

        if (!lista || !lista.children.length) return;

        const items = lista.querySelectorAll('li');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        }

        if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const data = JSON.parse(items[selectedIndex].dataset.data);
            rellenarCampos(input, data);
            lista.innerHTML = '';
            selectedIndex = -1;
            return;
        }

        items.forEach((li, i) => {
            li.style.background = i === selectedIndex ? '#f0f0f0' : '#fff';
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nombre')) {
            document.querySelectorAll('.listaSugerenciasNombre')
                .forEach(l => l.innerHTML = '');
            selectedIndex = -1;
        }
    });

});
