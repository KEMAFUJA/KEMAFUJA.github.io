import { createGoldParticles } from '../../-OTROS/particulas_suben.js';
    createGoldParticles('#sube-contenedor', {
        cuantas: 20,
        tamMax: 20,
        durMax: 10,
        durMin: 1,
        aparMax: 20,
        tamIgual: true,
        forma: 'cuadrado', //cirqlo, triangul, cuadrdo, estrlla, s0l, krta
        color: 'gold',
        r_opacidad: true
    });