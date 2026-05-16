document.addEventListener('DOMContentLoaded', function () {


// Crear toast
const toast = document.createElement('div');
toast.className = 'maxlength-toast';
toast.textContent = '¡Has alcanzado el límite de caracteres!';
document.body.appendChild(toast);

function activarInput(input) {

    if (input.dataset.limiteActivo) return;
    input.dataset.limiteActivo = "true";

    const maxLength = parseInt(input.getAttribute('maxlength'));
    const parent = input.parentElement;

    const counter = document.createElement('span');
    counter.className = 'char-counter';
    parent.appendChild(counter);

    function updateCounter() {

        const current = input.value.length;
        const remaining = maxLength - current;

        counter.textContent = current + "/" + maxLength;

        counter.classList.remove('warning', 'limit');
        input.classList.remove('limit-reached');

        if (remaining <= 10 && remaining > 5) {
            counter.classList.add('warning');
        }
        else if (remaining <= 5 && remaining > 0) {
            counter.classList.add('limit');
        }
        else if (remaining <= 0) {

            counter.classList.add('limit');
            input.classList.add('limit-reached');

            if (!input.dataset.limitShown) {

                toast.style.display = 'block';
                input.dataset.limitShown = 'true';

                setTimeout(() => {
                    toast.style.display = 'none';
                }, 2500);
            }

            if (current > maxLength) {
                input.value = input.value.substring(0, maxLength);
            }
        }
    }

    input.addEventListener('input', updateCounter);

    input.addEventListener('keydown', function (e) {

        const current = input.value.length;

        if (current >= maxLength &&
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey) {

            e.preventDefault();

            input.style.animation = 'none';

            setTimeout(() => {
                input.style.animation = 'shake 0.5s';
            }, 10);
        }
    });

    updateCounter();
}

// Activar en inputs existentes
document.querySelectorAll('input[maxlength]').forEach(activarInput);

// Detectar nuevos inputs automáticamente
const observer = new MutationObserver(function (mutations) {

    mutations.forEach(function (mutation) {

        mutation.addedNodes.forEach(function (node) {

            if (node.nodeType === 1) {

                node.querySelectorAll('input[maxlength]').forEach(activarInput);

            }

        });

    });

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});


});

const style = document.createElement('style');
style.textContent = `
@keyframes shake {
0%,100%{transform:translateX(0)}
25%{transform:translateX(-5px)}
75%{transform:translateX(5px)}
}`;
document.head.appendChild(style);
