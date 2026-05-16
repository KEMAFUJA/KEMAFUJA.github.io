document.addEventListener("DOMContentLoaded", function(){

    let ultimoId = null;

    document.querySelectorAll("#tablaActas tbody tr").forEach(row => {

        const actual = row.dataset.iddocumento;

        if(actual === ultimoId){
            row.cells[0].textContent = "";
            row.cells[1].textContent = "";
        }else{
            row.classList.add("documento-nuevo");
            ultimoId = actual;
        }

    });

});