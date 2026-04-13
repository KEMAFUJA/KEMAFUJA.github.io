export function createFloatingShapes({
    contenedorId = "chocan-contenedor",
    cantidad = 10,
    tamMin = 15,
    tamMax = 50,
    velMax = 3,
    multVel = 1, // 👈 control global
    forma = null
} = {}) {

const simbolos = {
    estrella: ['★','✦','✧','✩','✪','✫','✬','✭','✮','✯'],
    sol: ['☀','⚡','❇','✺','✹','✸'],
    carta: ['♥', '♦', '♣', '♠'],
    diamante: ['♦'],
    trebol: ['♣','☘'],
    pica: ['♠'],
    brillo: ['✨','✴','✵','✶','✷','❂','❉'],
    luna: ['☾','☽'],
    nube: ['☁','☁︎'],
    fuego: ['🔥','♨'],
    naturaleza: ['🍃','🌿','☘','❀','✿','❃'],
    hielo: ['❄','❅','❆','✻','✼'],
    geometrico: ['◆','◇','◈','◉','◎','●','○','◌'],
    pixel: ['■','□','▢','▣','▤','▥','▦'],
    triangulos: ['▲','△','▴','▵','▶','▷'],
    abstracto: ['۞','࿔','༄','༒','☯','☢','☣'],
    espacio: ['⭒','⭑'],
    tech: ['⌘','⎔','⌬','⌗','⛶','⛭'],
    corazon: ['❤','♡','❥','❣','♥']
};

    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    let objetos = [];
    let animationId = null;

    let velocidadGlobal = multVel; 

    // ===== COLORES DESDE CSS =====
    function obtenerColoresCSS() {
        const styles = getComputedStyle(document.documentElement);
        const colores = [];

        for (let i = 1; i <= 20; i++) {
            const value = styles.getPropertyValue(`--color-${i}`).trim();
            if (value) colores.push(value);
        }

        return colores.length ? colores : ["red", "blue"];
    }

    const colores = obtenerColoresCSS();

    const formasDisponibles = [
        'circulo', 'triangulo', 'cuadrado','estrella','sol', 'carta', 'diamante','trebol', 'pica', 'brillo', 'luna', 
        'nube', 'fuego', 'naturaleza', 'hielo', 'geomatrico', 'pixel', 'triangulos', 'abstractos', 'espacio', 'tech', 'corazon'
    ];

    class Forma {
        constructor(id) {
            this.id = id;
            this.elemento = document.createElement("div");
            this.elemento.className = "chocan-logo";

            // ===== FORMA =====
            this.forma = (forma && formasDisponibles.includes(forma))
                ? forma
                : formasDisponibles[Math.floor(Math.random() * formasDisponibles.length)];

            this.elemento.classList.add(`c-${this.forma}`);

            // ===== TAMAÑO =====
            this.ancho = tamMin + Math.random() * (tamMax - tamMin);
            this.alto = this.ancho;

            // ===== POSICIÓN =====
            this.x = Math.random() * (window.innerWidth - this.ancho);
            this.y = Math.random() * (window.innerHeight - this.alto);

            // ===== VELOCIDAD =====
            const velocidadBase = Math.random() * velMax + 0.5;
            const angulo = Math.random() * Math.PI * 2;

            this.vx = Math.cos(angulo) * velocidadBase;
            this.vy = Math.sin(angulo) * velocidadBase;

            this.cambiarColor();
            this.aplicarForma();
            this.render();

            contenedor.appendChild(this.elemento);
        }

        cambiarColor() {
            let i;
            do {
                i = Math.floor(Math.random() * colores.length);
            } while (colores.length > 1 && this.colorIndex === i);

            this.colorIndex = i;

            const colorBase = colores[i];

            this.elemento.style.setProperty('--chocan-color', colorBase);

            const colorSombra = this.aplicarOpacidad(colorBase);
            this.elemento.style.setProperty('--chocan-shadow-color', colorSombra);
        }

        aplicarForma() {
            if (this.forma === 'circulo' || this.forma === 'cuadrado') {
                this.elemento.style.width = this.ancho + "px";
                this.elemento.style.height = this.alto + "px";
                this.elemento.style.background = "var(--chocan-color)";
            }

            else if (this.forma === 'triangulo') {
                this.elemento.style.width = '0';
                this.elemento.style.height = '0';
                this.elemento.style.borderLeft = `${this.ancho / 2}px solid transparent`;
                this.elemento.style.borderRight = `${this.ancho / 2}px solid transparent`;
                this.elemento.style.borderBottom = `${this.alto}px solid var(--chocan-color)`;
            }

            else {
                let char = '';

                if (simbolos[this.forma]) {
                    const lista = simbolos[this.forma];
                    char = lista[Math.floor(Math.random() * lista.length)];
                }
                this.elemento.textContent = char;
                this.elemento.style.fontSize = this.ancho*2 + "px";
                this.elemento.style.color = "var(--chocan-color)";
            }
        }

        render() {
            this.elemento.style.left = this.x + "px";
            this.elemento.style.top = this.y + "px";
            this.elemento.style.position = "fixed";
        }

        mover() {
            this.x += this.vx * velocidadGlobal;
            this.y += this.vy * velocidadGlobal;

            if (this.x <= 0 || this.x >= window.innerWidth - this.ancho) {
                this.vx *= -1;
                this.cambiarColor();
            }

            if (this.y <= 0 || this.y >= window.innerHeight - this.alto) {
                this.vy *= -1;
                this.cambiarColor();
            }

            this.render();
        }

        cambiarTamaño() {
            const nuevo = tamMin + Math.random() * (tamMax - tamMin);
            this.ancho = nuevo;
            this.alto = nuevo;
            this.aplicarForma();
        }

        cambiarSimbolo() {
            if (!['estrella', 'sol', 'carta'].includes(this.forma)) return;

            const lista = simbolos[this.forma];

            let nuevo;
            do {
                nuevo = lista[Math.floor(Math.random() * lista.length)];
            } while (this.elemento.textContent === nuevo);

            this.elemento.textContent = nuevo;
        }

        aplicarOpacidad(color) {
            const alpha = Math.min(0.8, 0.2 + Math.abs(this.vx + this.vy) * 0.1);

            const temp = document.createElement("div");
            temp.style.color = color;
            document.body.appendChild(temp);

            const rgb = getComputedStyle(temp).color;
            document.body.removeChild(temp);

            return rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
        }        
    }

    function detectarColisiones() {
        for (let i = 0; i < objetos.length; i++) {
            for (let j = i + 1; j < objetos.length; j++) {
                const a = objetos[i];
                const b = objetos[j];

                if (
                    a.x < b.x + b.ancho &&
                    a.x + a.ancho > b.x &&
                    a.y < b.y + b.alto &&
                    a.y + a.alto > b.y
                ) {
                    [a.vx, b.vx] = [b.vx, a.vx];
                    [a.vy, b.vy] = [b.vy, a.vy];

                    a.cambiarColor();
                    b.cambiarColor();

                    a.cambiarTamaño();
                    b.cambiarTamaño();

                    a.cambiarSimbolo();
                    b.cambiarSimbolo();
                }
            }
        }
    }

    function animar() {
        objetos.forEach(o => o.mover());
        detectarColisiones();
        animationId = requestAnimationFrame(animar);
    }

    function iniciar() {
        cancelAnimationFrame(animationId);
        objetos.forEach(o => o.elemento.remove());
        objetos = [];

        for (let i = 0; i < cantidad; i++) {
            objetos.push(new Forma(i));
        }

        animar();
    }

    iniciar();

    return {
        detener: () => cancelAnimationFrame(animationId),
        reiniciar: iniciar,
        cambiarVelocidad: (v) => velocidadGlobal = v // 🔥 control en tiempo real
    };
}
