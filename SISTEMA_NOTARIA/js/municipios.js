let municipios = [];
let selectedIndex = -1;
let currentSuggestionsList = null;
let currentInput = null;

// ======================
// CARGAR JSON
// ======================
fetch('../provincias.json')
.then(res => res.json())
.then(data => {

    municipios = [];

    Object.entries(data).forEach(([departamento, listaMunicipios]) => {

        listaMunicipios.forEach(m => {

            municipios.push(`${departamento} - ${m}`);

        });

    });

})
.catch(err => console.error(err));

// ======================
// AUTOCOMPLETE
// ======================
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("municipio");
    const lista = document.querySelector(".listaSugerenciasmunicipio");

    if (!input || !lista) return;

    input.addEventListener("input", () => {

        const texto = input.value.toLowerCase().trim();

        lista.innerHTML = "";
        selectedIndex = -1;

        if (!texto) {
            currentSuggestionsList = null;
            currentInput = null;
            return;
        }

        const matches = municipios
            .filter(m => m.toLowerCase().includes(texto))
            .slice(0,10);

        if (!matches.length){

            const li = document.createElement("li");

            li.textContent = "Sin resultados";
            li.style.padding = "10px";
            li.style.color = "#999";
            li.style.fontStyle = "italic";

            lista.appendChild(li);

            return;
        }

        currentSuggestionsList = lista;
        currentInput = input;

        matches.forEach((m,i)=>{

            const li = document.createElement("li");

            li.textContent = m;
            li.dataset.index = i;

            li.style.cursor = "pointer";
            li.style.padding = "10px 12px";
            li.style.borderBottom = "1px solid rgba(201,169,110,0.1)";
            li.style.transition = "all .2s ease";

            // HOVER
            li.addEventListener("mouseenter",()=>{

                const items = lista.querySelectorAll("li");

                items.forEach(item=>{
                    item.style.background = "#fff";
                    item.style.color = "";
                    item.style.fontWeight = "";
                });

                li.style.background = "rgba(201,169,110,0.1)";

                selectedIndex = i;

            });

            li.addEventListener("mouseleave",()=>{

                if(i !== selectedIndex){
                    li.style.background = "#fff";
                }

            });


            // CLICK
            li.addEventListener("click",()=>{

                input.value = m;

                lista.innerHTML = "";

                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;

                input.dispatchEvent(new Event("input"));

            });

            lista.appendChild(li);

        });

    });



    // ======================
    // TECLADO
    // ======================
    input.addEventListener("keydown",(e)=>{

        const items = lista.querySelectorAll("li");

        if(!items.length) return;

        if(e.key === "ArrowDown"){

            e.preventDefault();

            selectedIndex =
                selectedIndex >= items.length-1
                ? 0
                : selectedIndex + 1;

            actualizarSeleccion(items);

            items[selectedIndex].scrollIntoView({
                block:"nearest",
                behavior:"smooth"
            });

        }


        if(e.key === "ArrowUp"){

            e.preventDefault();

            selectedIndex =
                selectedIndex <= 0
                ? items.length-1
                : selectedIndex - 1;

            actualizarSeleccion(items);

            items[selectedIndex].scrollIntoView({
                block:"nearest",
                behavior:"smooth"
            });

        }


        if(e.key === "Enter"){

            if(selectedIndex >= 0){

                e.preventDefault();

                input.value =
                    items[selectedIndex].textContent;

                lista.innerHTML="";

                selectedIndex = -1;
                currentSuggestionsList = null;
                currentInput = null;

                input.dispatchEvent(new Event("input"));

            }

        }


        if(e.key === "Escape"){

            lista.innerHTML="";

            selectedIndex=-1;

            currentSuggestionsList = null;
            currentInput = null;

        }

    });


    // ======================
    // RESALTADO
    // ======================
    function actualizarSeleccion(items){

        items.forEach((item,i)=>{

            if(i === selectedIndex){

                item.style.background = "rgba(201,169,110,0.2)";
                item.style.color = "var(--primary-color)";
                item.style.fontWeight = "600";

            }else{

                item.style.background = "#fff";
                item.style.color = "";
                item.style.fontWeight = "";

            }

        });

    }


    // ======================
    // CERRAR SI CLICK FUERA
    // ======================
    document.addEventListener("click",(e)=>{

        if(currentSuggestionsList){

            const clickInput =
                e.target === currentInput;

            const clickLista =
                e.target === currentSuggestionsList ||
                currentSuggestionsList.contains(e.target);

            if(!clickInput && !clickLista){

                currentSuggestionsList.innerHTML="";

                selectedIndex=-1;

                currentSuggestionsList=null;
                currentInput=null;

            }

        }

    });


    // ======================
    // CERRAR AL PERDER FOCO
    // ======================
    input.addEventListener("blur",()=>{

        setTimeout(()=>{

            lista.innerHTML="";

            selectedIndex=-1;

            currentSuggestionsList=null;
            currentInput=null;

        },150);

    });

});