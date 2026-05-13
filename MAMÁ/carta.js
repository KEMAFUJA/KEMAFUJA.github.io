let particulas = [];
let cantidad = 1000;
let estado = 0;
let animando = false;
let postExplosion = false;
let modoPost = false;

let linternaActiva = true;
let textoCompleto = false;

const mensajeContinuar = document.getElementById("mensajeContinuar");
const panelControles = document.querySelector(".panel-controles");
const toggleLinterna = document.getElementById("toggleLinterna");
const toggleCarta = document.getElementById("toggleCarta");
const scrollHint = document.getElementById("scrollHint");
const scrollHintCarta = document.getElementById("scrollHintCarta");
const musicaFondo = document.getElementById("musicaFondo");

let musicaIniciada = false;
const scratchCanvas = document.getElementById("scratchCanvas");
const sctx = scratchCanvas.getContext("2d");

const cursor = document.getElementById("cursor");
cursor.style.opacity = "0";
cursor.style.pointerEvents = "none";
let cartaActiva = false;

const mensajeScratch = document.getElementById("mensajeScratch");
let usuarioEmpezoScratch = false;

const esTouch = 'ontouchstart' in window;

let luzCartaActiva = false;

function iniciarScratch(){

    scratchCanvas.width = carta.offsetWidth;
    scratchCanvas.height = carta.offsetHeight;

    // capa negra inicial
    sctx.fillStyle = "rgba(0,0,0,1)";
    sctx.fillRect(0,0,scratchCanvas.width,scratchCanvas.height);

}

function actualizarEstadoCarta(){

    if(!cartaActiva){
        scrollHintCarta.classList.remove("show");
        return;
    }

    scrollHintCarta.classList.add("show");

    if(luzCartaActiva){

    toggleCarta.classList.add("on");

    scratchCanvas.style.opacity = "0";

    cursor.style.opacity = "0";

    scrollHintCarta.textContent = "Apagar luz";

}else{

        toggleCarta.classList.remove("on");

scratchCanvas.style.opacity = "1";

        scrollHintCarta.textContent = "Prender luz";
    }
}

toggleCarta.addEventListener("click", (e)=>{
    e.stopPropagation();

    luzCartaActiva = !luzCartaActiva;
    actualizarEstadoCarta();
});

function actualizarEstadoLinterna(){

    if(!cartaActiva){
        scrollHintCarta.classList.remove("show");
        scrollHint.classList.remove("show");
        return;
    }

    if(linternaActiva){
        toggleLinterna.classList.remove("off");
        scrollHint.textContent = "Desliza para ver con la linterna";
        scrollHint.classList.add("show");
        luz.classList.add("activa");

    }else{
        toggleLinterna.classList.add("off");
        scrollHint.textContent = "Desliza para leer";
        scrollHint.classList.add("show");
        luz.classList.remove("activa");
        cursor.style.opacity = "0";
    }
}

toggleLinterna.addEventListener("click", (e)=>{
    e.stopPropagation();

    linternaActiva = !linternaActiva;
    actualizarEstadoLinterna();

    if(linternaActiva && cartaActiva){
        cursor.style.opacity = "1";
    }
});

/* PARTICULA */
class Particula{
    constructor(){
        this.el=document.createElement("div");
        this.el.className="particula";

        this.x=Math.random()*innerWidth;
        this.y=Math.random()*innerHeight;

        this.vx=(Math.random()-0.5)*20;
        this.vy=(Math.random()-0.5)*20;

        this.destino=null;

        let s=Math.random()*3+2;
        this.el.style.width=s+"px";
        this.el.style.height=s+"px";

        document.body.appendChild(this.el);
    }

    mover(){
    if(this.destino){
        let dx=this.destino.x-this.x;
        let dy=this.destino.y-this.y;
        this.x+=dx*0.02;
        this.y+=dy*0.02;
    }else{

        // 🔥 modo universo vivo
        this.x+=this.vx;
        this.y+=this.vy;

        // si ya explotó → movimiento suave infinito
        if(postExplosion && modoPost){

    this.vx += (Math.random()-0.5)*0.5;
    this.vy += (Math.random()-0.5)*0.5;

    this.vx *= 0.98;
    this.vy *= 0.98;
}
    }

    this.el.style.transform=`translate(${this.x}px,${this.y}px)`;
}
}

/* TEXTO A PUNTOS */
function puntosTexto(txt){
    let c=document.createElement("canvas");
    let ctx=c.getContext("2d");

    c.width=innerWidth;
    c.height=innerHeight;

    let size = Math.min(innerWidth / txt.length, 180);

    ctx.fillStyle="white";
    ctx.font=`${size}px Arial`;
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.fillText(txt,c.width/2,c.height/2);

    let data=ctx.getImageData(0,0,c.width,c.height).data;
    let pts=[];

    for(let y=0;y<c.height;y+=8){
        for(let x=0;x<c.width;x+=8){
            let i=(y*c.width+x)*4;
            if(data[i+3]>128) pts.push({x,y});
        }
    }

    pts.sort(()=>Math.random()- 0.5);
    return pts;
}

/* LOOP */
function animar(){
    if(!animando) return;
    particulas.forEach(p=>p.mover());
    requestAnimationFrame(animar);
}

function dividirTexto(txt, maxChars){
    const palabras = txt.split(" ");
    let lineas = [];
    let linea = "";

    for(let p of palabras){
        if((linea + " " + p).trim().length > maxChars){
            lineas.push(linea.trim());
            linea = p;
        }else{
            linea += " " + p;
        }
    }

    if(linea.trim()) lineas.push(linea.trim());

    return lineas;
}

function iniciar(){

    if(!musicaIniciada){

        musicaIniciada = true;

        musicaFondo.volume = 0;

musicaFondo.play().catch(()=>{});

let vol = 0;

let fade = setInterval(()=>{

    vol += 0.02;

    if(vol >= 0.7){
        vol = 0.7;
        clearInterval(fade);
    }

    musicaFondo.volume = vol;

}, 150);
    }

        if(animando || particulas.length) return;

    document.querySelector('.intro').style.display="none";

    for(let i=0;i<cantidad;i++){
        particulas.push(new Particula());
    }

    let texto = "FELIZ CUMPLE AÑOS MAMÁ";

    // 🔥 dividir automáticamente según longitud
    let lineas = dividirTexto(texto, 5);

    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");

    c.width = innerWidth;
    c.height = innerHeight;

    let size = Math.min(innerWidth * 0.12, 120);
    size = Math.max(size, 75.75);

    ctx.fillStyle = "white";
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 🔥 calcular altura total
    let spacing = size + 20;
    let startY = c.height / 2 - (lineas.length * spacing) / 2;

    lineas.forEach((linea, i)=>{
        ctx.fillText(linea, c.width/2, startY + i * spacing);
    });

    let data = ctx.getImageData(0,0,c.width,c.height).data;
    let pts = [];

    for(let y=0;y<c.height;y+=8){
        for(let x=0;x<c.width;x+=8){
            let i=(y*c.width+x)*4;
            if(data[i+3]>128){
                pts.push({x,y});
            }
        }
    }

    pts.sort(()=>Math.random()-0.5);

    particulas.forEach((p,i)=>{
        let index = i % pts.length;

        p.destino = {
            x: pts[index].x + (Math.random()-0.5)*6,
            y: pts[index].y + (Math.random()-0.5)*6
        };
    });

    animando = true;
    animar();

    setTimeout(()=>{

    textoCompleto = true;

    mensajeContinuar.classList.add("show");

}, 3500);
}

/* EXPLOSION */
function explosion(){
    postExplosion = true;
    modoPost = true;
    mensajeContinuar.classList.remove("show");
    
    particulas.forEach((p, i)=>{

        p.destino=null;

        // 🔥 explosión inicial fuerte
        p.vx=(Math.random()-0.5)*30;
        p.vy=(Math.random()-0.5)*30;

        // 🔥 después suaviza movimiento
        setTimeout(()=>{
            if(postExplosion){
                p.vx *= 0.5;
                p.vy *= 0.5;
            }
        }, 400);

        // 🔥 MENOS BRILLO (visual pro)
        setTimeout(()=>{
            p.el.style.opacity = "0.5";
            p.el.style.boxShadow = "0 0 2px rgba(255,255,255,0.5)";
        }, 900);

        // 🔥 solo algunas quedan visibles
        if(i % 2 === 0){
            setTimeout(()=>{
                p.el.style.opacity = "0.08";
            }, 900);
        }
    });

setTimeout(()=>{

    carta.classList.add("show");
    iniciarScratch();

setTimeout(()=>{
    cartaActiva = true;

    setTimeout(()=>{
    mensajeScratch.classList.add("show");
}, 1200);

    // mostrar UI
    panelControles.style.opacity = "1";
    panelControles.style.pointerEvents = "auto";

    toggleLinterna.style.opacity = "1";
    toggleLinterna.style.pointerEvents = "auto";

    toggleCarta.style.opacity = "1";
    toggleCarta.style.pointerEvents = "auto";


    actualizarEstadoLinterna();
    actualizarEstadoCarta();

    if(linternaActiva && !luzCartaActiva){
        cursor.style.opacity = "1";
    }

    cursor.style.pointerEvents = "none";
    document.body.style.cursor = "none";

}, 120);

}, 900);
}

/* LUZ */
function actualizarLuz(x, y){

    if(!cartaActiva || !linternaActiva){
        return;
    }

    // cursor visual
    cursor.style.left = x + "px";
    cursor.style.top  = y + "px";

    if(cartaActiva){
        cursor.style.transform = "translate(-50%,-50%) scale(2)";

        cursor.style.boxShadow =
        "0 0 30px rgba(255,255,255,0.9), 0 0 100px rgba(255,255,255,0.5)";
    }

    // 🔥 revelar permanentemente
    revelarZona(x, y);
}

/* DESKTOP */
if(!esTouch){
    document.addEventListener("mousemove", e=>{
        if(!linternaActiva) return;

        actualizarLuz(e.clientX, e.clientY);
        luz.classList.add("activa");
    });
}

/* MÓVIL */
if(esTouch){
    let activo = false;

    document.addEventListener("touchstart", e=>{

    // evitar conflicto con botones UI
    if(
        e.target.closest("#toggleLinterna") ||
        e.target.closest("#toggleCarta") ||
        e.target.closest(".panel-controles")
    ){
        return;
    }

        if(estado === 0){
            iniciar();
            estado = 1;
            return;
        }

        if(estado === 1){

    if(!textoCompleto){
        return;
    }

    explosion();

    estado = 2;

    return;
}

        // carta activa + linterna encendida
        if(
            !cartaActiva ||
            !linternaActiva ||
            luzCartaActiva
        ) return;

        activo = true;

        const t = e.touches[0];
        actualizarLuz(t.clientX, t.clientY);

        luz.classList.add("activa");

    }, { passive:false });

    document.addEventListener("touchmove", e=>{

        if(
            !activo ||
            !linternaActiva ||
            !cartaActiva ||
            luzCartaActiva
        ) return;

        const t = e.touches[0];

        actualizarLuz(t.clientX, t.clientY);

        e.preventDefault();

    }, { passive:false });

    document.addEventListener("touchend", ()=>{

        activo = false;

        if(linternaActiva){
            luz.classList.remove("activa");
        }

    });
}

/* CLICK FLOW DESKTOP */
document.body.addEventListener("click",()=>{
    if(esTouch) return;

    if(estado===0){
        iniciar();
        estado=1;

    }else if(estado===1 && textoCompleto){

    explosion();

    estado = 2;
}
});


function revelarZona(x, y){

    if(!usuarioEmpezoScratch){

    usuarioEmpezoScratch = true;

    mensajeScratch.classList.remove("show");
    mensajeScratch.classList.add("hide");
}

    let rect = carta.getBoundingClientRect();

    let localX = x - rect.left;
    let localY = y - rect.top;

    if(
        localX < 0 ||
        localY < 0 ||
        localX > rect.width ||
        localY > rect.height
    ){
        return;
    }

    sctx.globalCompositeOperation = "destination-out";

    // suavizado
    sctx.filter = "blur(10px)";

    let radio = 75;

    let gradiente = sctx.createRadialGradient(
        localX,
        localY,
        0,
        localX,
        localY,
        radio
    );

    // 🔥 BORRADO PARCIAL
    gradiente.addColorStop(0, "rgba(0,0,0,0.20)");
    gradiente.addColorStop(0.5, "rgba(0,0,0,0.10)");
    gradiente.addColorStop(1, "rgba(0,0,0,0)");

    sctx.fillStyle = gradiente;

    sctx.beginPath();
    sctx.arc(localX, localY, radio, 0, Math.PI * 2);
    sctx.fill();

    sctx.filter = "none";
}
