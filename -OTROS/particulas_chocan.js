export function createFloatingShapes({
    containerId = "dvd-container",
    count = 10,
    colors = ["red","blue","yellow","green"],
    minSize = 15,
    maxSize = 50,
    maxSpeed = 3
} = {}) {

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Contenedor ${containerId} no existe`);
        return;
    }

    let objects = [];
    let animationId = null;

    class Shape {
        constructor(id) {
            this.id = id;
            this.element = document.createElement("div");
            this.element.className = "dvd-logo";

            // Tamaño
            this.width = minSize + Math.random() * (maxSize - minSize);
            this.height = this.width;

            // Posición inicial
            this.x = Math.random() * (window.innerWidth - this.width);
            this.y = Math.random() * (window.innerHeight - this.height);

            // Velocidad inicial
            const speed = Math.random() * maxSpeed + 0.5;
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            // Estilo inicial
            this.randomColor();
            this.render();
            container.appendChild(this.element);
        }

        randomColor() {
            let i;
            do { i = Math.floor(Math.random() * colors.length) } 
            while (colors.length > 1 && this.colorIndex === i);

            this.colorIndex = i;
            const bg = colors[i];

            let shadow;
            do { shadow = Math.floor(Math.random() * colors.length) }
            while (shadow === i && colors.length > 1);

            this.element.style.background = bg;
            this.element.style.boxShadow = `0 10px 40px ${colors[shadow]}, 0 -10px 40px ${colors[shadow]}`;
        }

        render() {
            this.element.style.width = this.width + "px";
            this.element.style.height = this.height + "px";
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
            this.element.style.position = "fixed";
            this.element.style.borderRadius = "0%";
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;

            // Bordes
            if (this.x <= 0 || this.x >= window.innerWidth - this.width) {
                this.vx *= -1;
                this.randomColor();
            }
            if (this.y <= 0 || this.y >= window.innerHeight - this.height) {
                this.vy *= -1;
                this.randomColor();
            }

            this.render();
        }
    }

    // Detectar rebotes entre objetos
    function handleCollisions() {
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const a = objects[i];
                const b = objects[j];

                if (
                    a.x < b.x + b.width &&
                    a.x + a.width > b.x &&
                    a.y < b.y + b.height &&
                    a.y + a.height > b.y
                ) {
                    // Intercambiar velocidades
                    [a.vx, b.vx] = [b.vx, a.vx];
                    [a.vy, b.vy] = [b.vy, a.vy];

                    a.randomColor();
                    b.randomColor();
                }
            }
        }
    }

    function animate() {
        objects.forEach(o => o.move());
        handleCollisions();
        animationId = requestAnimationFrame(animate);
    }

    function init() {
        cancelAnimationFrame(animationId);
        objects.forEach(o => o.element.remove());
        objects = [];

        for (let i = 0; i < count; i++) objects.push(new Shape(i));
        animate();
    }

    init();

    return {
        stop: () => cancelAnimationFrame(animationId),
        reload: init
    };
}
