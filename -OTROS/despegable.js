document.querySelectorAll('.despegable-toggle')
.forEach(toggle => {
    toggle.addEventListener('click', function () {
        const parent = this.parentElement;

        document.querySelectorAll('.despegable').forEach(d => {
            if (d !== parent) d.classList.remove('active');
        });

        parent.classList.toggle('active');
    });
});

document.querySelectorAll('.submenu > strong')
.forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation();

        const parent = this.parentElement;
        parent.classList.toggle('active');

        const siblings = parent.parentElement.children;
        for (let sib of siblings) {
            if (sib !== parent) {
                sib.classList.remove('active');
            }
        }
    });
});
