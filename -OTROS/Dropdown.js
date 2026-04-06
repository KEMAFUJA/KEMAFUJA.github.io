document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown');
            dropdown.classList.toggle('active');

            document.querySelectorAll('.dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // ✅ SUBMENÚS (AQUÍ estaba el fallo)
    document.querySelectorAll('.submenu > strong').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            const parent = this.parentElement;
            parent.classList.toggle('active');

            parent.parentElement.querySelectorAll('.submenu').forEach(sibling => {
                if (sibling !== parent) {
                    sibling.classList.remove('active');
                }
            });
        });
    });

});
