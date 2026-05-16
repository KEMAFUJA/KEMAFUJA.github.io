document.addEventListener('DOMContentLoaded', function () {

    let selectedIndex = -1;
    let currentSuggestionsList = null;
    let currentInput = null;

    function obtenerSugerenciasNombre(valor, lista, input) {

        if (valor.length < 2) {
            lista.innerHTML = '';
            selectedIndex = -1;
            currentSuggestionsList = null;
            currentInput = null;
            return;
        }

        fetch(`../php/autocompletar.php?q=${encodeURIComponent(valor)}`)
        .then(r => r.json())
        .then(data => {

            lista.innerHTML = '';
            selectedIndex = -1;

            if (!data.length) return;

            currentSuggestionsList = lista;
            currentInput = input;

            data.forEach((obj, index) => {

                const li = document.createElement('li');

                li.textContent = obj.nombre;
                li.dataset.index = index;
                li.dataset.data = JSON.stringify(obj);

                li.style.cursor = 'pointer';
                li.style.padding = '10px 12px';
                li.style.borderBottom = '1px solid rgba(201,169,110,0.1)';
                li.style.transition = 'all .2s ease';

                // HOVER
                li.addEventListener('mouseenter', () => {

                    const items = lista.querySelectorAll('li');

                    items.forEach(item=>{
                        item.style.background = '#fff';
                        item.style.color = '';
                        item.style.fontWeight = '';
                    });

                    li.style.background = 'rgba(201,169,110,0.1)';
                    selectedIndex = index;
                });

                li.addEventListener('mouseleave', () => {

                    if(index !== selectedIndex){
                        li.style.background = '#fff';
                    }

                });

                // CLICK
                li.addEventListener('click', () => {

                    rellenarCampos(input, obj);

                    lista.innerHTML = '';

                    selectedIndex = -1;
                    currentSuggestionsList = null;
                    currentInput = null;

                    input.dispatchEvent(new Event('input'));
                });

                lista.appendChild(li);

            });

        });

    }


    function actualizarSeleccion(items){

        items.forEach((item,i)=>{

            if(i === selectedIndex){

                item.style.background = 'rgba(201,169,110,0.2)';
                item.style.color = 'var(--primary-color)';
                item.style.fontWeight = '600';

            }else{

                item.style.background = '#fff';
                item.style.color = '';
                item.style.fontWeight = '';

            }

        });

    }


    function manejarTeclado(e,input,lista){

        const items = lista.querySelectorAll('li');

        if(!items.length) return;

        if(e.key === "ArrowDown"){

            e.preventDefault();

            selectedIndex = selectedIndex >= items.length-1
                ? 0
                : selectedIndex + 1;

            actualizarSeleccion(items);

            items[selectedIndex].scrollIntoView({
                block:'nearest',
                behavior:'smooth'
            });

        }


        if(e.key === "ArrowUp"){

            e.preventDefault();

            selectedIndex = selectedIndex <= 0
                ? items.length-1
                : selectedIndex - 1;

            actualizarSeleccion(items);

            items[selectedIndex].scrollIntoView({
                block:'nearest',
                behavior:'smooth'
            });

        }


        if(e.key === "Enter"){

            if(selectedIndex >= 0){

                e.preventDefault();

                const data =
                    JSON.parse(items[selectedIndex].dataset.data);

                rellenarCampos(input,data);

                lista.innerHTML='';

                selectedIndex=-1;

                currentSuggestionsList=null;
                currentInput=null;

            }

        }


        if(e.key === "Escape"){

            lista.innerHTML='';
            selectedIndex=-1;

            currentSuggestionsList=null;
            currentInput=null;

        }

    }



    function rellenarCampos(inputNombre,data){

        const participante =
            inputNombre.closest('.participante');

        const inputPais =
            participante.querySelector('input[name="pais[]"]');

        inputNombre.value = data.nombre ?? '';

        participante.querySelector(
            'input[name="identificacion[]"]'
        ).value = data.identificacion ?? '';

        participante.querySelector(
            'select[name="tipo_persona[]"]'
        ).value = data.tipo_persona ?? 'Natural';

        inputPais.value = data.nacionalidad ?? '';

        inputPais.dispatchEvent(
            new Event('input',{bubbles:true})
        );

    }



    // INPUT
    document.addEventListener('input',function(e){

        if(e.target.name === 'nombre[]'){

            const input = e.target;

            const lista =
                input.closest('.nombre')
                ?.querySelector('.listaSugerenciasNombre');

            if(!lista) return;

            clearTimeout(input._timer);

            input._timer=setTimeout(()=>{

                obtenerSugerenciasNombre(
                    input.value,
                    lista,
                    input
                );

            },300);

        }

    });



    // TECLADO
    document.addEventListener('keydown',function(e){

        if(e.target.name !== 'nombre[]') return;

        const input = e.target;

        const lista =
            input.closest('.nombre')
            ?.querySelector('.listaSugerenciasNombre');

        if(!lista || !lista.children.length) return;

        manejarTeclado(e,input,lista);

    });



    // CLICK FUERA
    document.addEventListener('click',function(e){

        if(!e.target.closest('.nombre')){

            document
            .querySelectorAll('.listaSugerenciasNombre')
            .forEach(l=>l.innerHTML='');

            selectedIndex=-1;
            currentSuggestionsList=null;
            currentInput=null;

        }

    });


});