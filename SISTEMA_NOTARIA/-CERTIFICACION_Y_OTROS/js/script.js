function actualizarSeleccion(items, listaSugerencias) {
    items.forEach((item, i) => {
        if (i === selectedIndex) {
            item.classList.add('selected');
            currentSuggestionsList = listaSugerencias;
            currentInput = listaSugerencias.previousElementSibling;
        } else {
            item.classList.remove('selected');
        }
    });
}

// En mouseenter
li.addEventListener('mouseenter', function() {
    if (currentSuggestionsList === listaSugerencias) {
        const items = listaSugerencias.querySelectorAll('li');
        items.forEach(item => {
            item.classList.remove('selected');
        });
    }
    this.classList.add('selected');
    selectedIndex = parseInt(this.dataset.index);
});

li.addEventListener('mouseleave', function() {
    if (parseInt(this.dataset.index) !== selectedIndex || currentSuggestionsList !== listaSugerencias) {
        this.classList.remove('selected');
    }
});