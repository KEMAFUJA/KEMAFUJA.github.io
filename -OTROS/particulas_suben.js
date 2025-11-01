// particles.js

export function createGoldParticles(containerSelector, {
    cuantas = 40,
    tamMax = 50,
    durMax = 20,
    aparMax = 20
} = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Limpiar partículas existentes
    container.innerHTML = '';

    for (let i = 0; i < cuantas; i++) {
        const particle = document.createElement('div');
        particle.classList.add('gold-particle');

        // posición inicial
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `100%`;

        // tamaño aleatorio
        particle.style.width = `${Math.random() * tamMax}px`;
        particle.style.height = `${Math.random() * tamMax}px`;

        // duración aleatoria
        const duration = Math.random() * durMax + 10; // ajustable
        particle.style.animationDuration = `${duration}s`;

        // retardo aleatorio
        particle.style.animationDelay = `${Math.random() * aparMax}s`;

        container.appendChild(particle);
    }
}
