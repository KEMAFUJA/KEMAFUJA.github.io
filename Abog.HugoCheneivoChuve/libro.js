const pages = document.querySelectorAll('.page');
const totalPages = pages.length;
let cantpag = 0;

let inicio = 0;
let fin = 0;
let isDragging = false;

function init() {
    const book = document.getElementById('myBook');

    // Orden inicial
    pages.forEach((page, index) => {
        page.style.zIndex = totalPages - index;
    });

    // Pointer events (mouse + touch)
    book.addEventListener('pointerdown', (e) => {
        inicio = e.clientX;
        isDragging = true;
    });

    book.addEventListener('pointerup', (e) => {
        if (!isDragging) return;

        fin = e.clientX;

        const didSwipe = deslizar();

        if (!didSwipe) presionarClick(fin);

        isDragging = false;
    });
}

function presionarClick(x) {
    const screenWidth = window.innerWidth;
    const zone = screenWidth * 0.2;

    // 👉 derecha
    if (x > screenWidth - zone) {
        if (cantpag >= totalPages) {
            irAlInicio(); // volver a portada
        } else {
            sigPagina();
        }
    } 
    // 👉 izquierda
    else if (x < zone) {
        if (cantpag <= 0) {
            irAlFinal(); // ir a contraportada
        } else {
            antPagina();
        }
    }
}

function deslizar() {
    const threshold = 30;
    const diff = fin - inicio;

    if (Math.abs(diff) < threshold) return false;

    if (diff < 0) {
        // 👉 izquierda (siguiente)
        if (cantpag >= totalPages) {
            irAlInicio();
        } else {
            sigPagina();
        }
    } else {
        // 👉 derecha (anterior)
        if (cantpag <= 0) {
            irAlFinal();
        } else {
            antPagina();
        }
    }

    return true;
}

// 👉 SIGUIENTE
function sigPagina() {
    if (cantpag >= totalPages) return;

    const page = pages[cantpag];
    page.classList.add('flipped');

    cantpag++;

    setTimeout(() => {
        actualizarIndice();
        ajustarLibro();
    }, 300);
}

// 👉 ANTERIOR
function antPagina() {
    if (cantpag <= 0) return;

    cantpag--;

    const page = pages[cantpag];
    page.classList.remove('flipped');
    page.style.zIndex = totalPages + 1;

    setTimeout(() => {
        actualizarIndice();
        ajustarLibro();
    }, 600);
}

// 👉 IR AL FINAL (contraportada)
function irAlFinal() {
    pages.forEach(page => page.classList.add('flipped'));
    cantpag = totalPages;
    actualizarIndice();
    ajustarLibro();
}

// 👉 VOLVER A INICIO (portada)
function irAlInicio() {
    pages.forEach(page => page.classList.remove('flipped'));
    cantpag = 0;
    actualizarIndice();
    ajustarLibro();
}

// 👉 Z-INDEX DINÁMICO
function actualizarIndice() {
    pages.forEach((page, index) => {
        if (page.classList.contains('flipped')) {
            page.style.zIndex = index + 1;
        } else {
            page.style.zIndex = totalPages - index;
        }
    });
}

function ajustarLibro() {
    const book = document.getElementById('myBook');

    if (cantpag === 0) {
        // portada
        book.style.transform = "translateX(-50%)";
    } 
    else if (cantpag === totalPages) {
        // contraportada (todo volteado)
        book.style.transform = "translateX(50%)";
    } 
    else {
        // estado intermedio
        book.style.transform = "translateX(-50%)";
    }
}

init();