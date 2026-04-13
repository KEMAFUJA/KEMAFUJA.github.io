export function createGoldParticles(containerSelector, {
    cuantas = 40,
    tamMax = 50,
    durMax = 20,
    durMin = 2,
    aparMax = 20,
    tamIgual = true,
    forma = null,
    color = null,
    r_opacidad= null
} = {}) {

    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';

    const formasDisponibles = [
        'circulo', 'triangulo', 'cuadrado','estrella','sol', 'carta', 'diamante', 'trebol', 'pica', 'brillo', 'luna',
        'nube', 'fuego', 'naturaleza', 'hielo', 'geomatrico', 'pixel', 'triangulos', 'abstractos', 'espacio', 'tech', 'corazon'
    ];

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

    function esColorValido(c) {
        if (!c) return false;
        const s = new Option().style;
        s.color = c;
        return s.color !== '';
    }

    function colorRandom() {
        return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    for (let i = 0; i < cuantas; i++) {

        const particle = document.createElement('div');
        particle.classList.add('sube-particle');

        // ===== FORMA =====
        let formaFinal = (forma && formasDisponibles.includes(forma))
            ? forma
            : formasDisponibles[Math.floor(Math.random() * formasDisponibles.length)];

        particle.classList.add(`s-${formaFinal}`);

        // ===== COLOR INTELIGENTE 🔥 =====
        let particleColor;

        if (!color || color === 'random') {
            particleColor = colorRandom();
        } else if (esColorValido(color)) {
            if (r_opacidad) {
                particleColor = colorConOpacidad(color);
            }else{
                particleColor = color;
            }

        } else {
            particleColor = colorRandom();
        }

        particle.style.setProperty('--particle-color', particleColor);

        // ===== POSICIÓN =====
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `100%`;

        // ===== TAMAÑO =====
        let ancho, alto;

        if (tamIgual) {
            ancho = alto = Math.random() * tamMax;
        } else {
            ancho = Math.random() * tamMax+0.1;
            alto = Math.random() * tamMax+0.1;
        }

        // ===== FORMAS =====
        if (formaFinal === 'circulo' || formaFinal === 'cuadrado') {
            particle.style.width = `${ancho}px`;
            particle.style.height = `${alto}px`;
            particle.style.background = particleColor;
        }

        else if (formaFinal === 'triangulo') {
            particle.style.width = '0';
            particle.style.height = '0';
            particle.style.borderLeft = `${ancho / 2}px solid transparent`;
            particle.style.borderRight = `${ancho / 2}px solid transparent`;
            particle.style.borderBottom = `${alto}px solid ${particleColor}`;
        }

        else {
            let char = '';
            if (simbolos[formaFinal]) {
                    const lista = simbolos[formaFinal];
                    char = lista[Math.floor(Math.random() * lista.length)];
                }

            particle.textContent = char;
            particle.style.fontSize = `${ancho*2}px`;
            particle.style.color = particleColor;
        }

        const duration = Math.random() * durMax + durMin;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * aparMax}s`;

        container.appendChild(particle);
    }

    function colorConOpacidad(colorBase) {
        const el = document.createElement("div");
        el.style.color = colorBase;
        document.body.appendChild(el);

        const rgb = getComputedStyle(el).color;
        document.body.removeChild(el);

        const valores = rgb.match(/\d+/g);

        const r = valores[0];
        const g = valores[1];
        const b = valores[2];

        const alpha = Math.random() * 0.8 + 0.2;

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
