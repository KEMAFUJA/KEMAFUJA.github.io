const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const hoy = new Date();
let diaNombre = dias[hoy.getDay()];
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diaNumero = hoy.getDate();
const mesNombre = meses[hoy.getMonth()];
const completo = diaNombre + " " + diaNumero + " de " + mesNombre;  
fetch(`menu.json?t=${new Date().getTime()}`)
  .then(res => res.json())
  .then(data => {
    const comidas = data[diaNombre];
    const lista = document.getElementById("menu-lista");
    
    const tituloDia = document.createElement("div");
    tituloDia.innerHTML = `🍽️ Menú "${completo}"`;
    lista.appendChild(tituloDia);

    const precio = document.createElement("div");
    precio.innerHTML = `Completo: <span class="precio">${diaNombre === "Domingo" ? "20" : "15"}Bs</span>`;
    precio.style.marginLeft='5px';
    lista.appendChild(precio);
    
    if (comidas && comidas.length > 0) {
      comidas.forEach(comida => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="bien">✔</span> ${comida.nombre}`;
        li.style.backgroundColor = comida.color || "white";
        if (comida.negrita) {
          li.style.fontWeight = "bold";
        }
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = "<li>No hay menú disponible para hoy.</li>";
    }
  })
  .catch(err => {
    console.error("Error cargando el JSON:", err);
    document.getElementById("menu-lista").innerHTML = "<li>Error al cargar el menú.</li>";
  });

function dosDigitos(num) {
  return num < 10 ? "0" + num : num;
}

function actualizarFondoAnimado() {
  const ahora = new Date();
  const h = ahora.getHours();
  const m = ahora.getMinutes();
  const s = ahora.getSeconds();

  const mensaje = document.getElementById("mensaje");
  const body = document.body;
  body.style.animationName = "";

  let tramo = "";
  let emoji = "";
  let periodo = "";
  
  if (h >= 0 && h < 6) {
    tramo = "MADRUGADA";
    emoji = "🌃";
    periodo = "Madrugada";
  } else if (h >= 6 && h < 12) {
    tramo = "MANANA";
    emoji = "🌞";
    periodo = "Mañana";
  } else if (h >= 12 && h < 18) {
    tramo = "TARDE";
    emoji = "🏖️";
    periodo = "Tarde";
  } else if (h >= 18 && h <= 23) {
    tramo = "NOCHE";
    emoji = "🌙";
    periodo = "Noche";
  }

  body.style.animationName = tramo;
  mensaje.textContent = `${emoji} ${periodo}:\n${dosDigitos(h)}:${dosDigitos(m)}:${dosDigitos(s)}`;
}

actualizarFondoAnimado();
setInterval(actualizarFondoAnimado, 1000);

// 🔥 Flamas
const flameContainer = document.getElementById("flames");
for (let i = 0; i < 200; i++) {
  const flame = document.createElement("div");
  flame.classList.add("flame");

  const size = 10 + Math.random() * 10; // 10–20px
  flame.style.width = `${size}px`;
  flame.style.height = `${size}px`;

  const maxLeft = window.innerWidth - size;
  flame.style.left = `${Math.random() * maxLeft}px`;

  flame.style.animationDelay = `${Math.random() * 1.5}s`;
  flameContainer.appendChild(flame);
}

// ☁️ Humo
const smokeEffect = document.getElementById('smokeEffect');
for (let i = 0; i < 15; i++) {
  const smoke = document.createElement('div');
  smoke.classList.add('smoke');

  const size = Math.random() * 50 + 100; // 100–250px
  smoke.style.width = smoke.style.height = `${size}px`;

  // posición vertical desde abajo, pero no tan pegado
  //const minBottom = 100;   // altura mínima
  //const maxBottom = 500;  // altura máxima
  smoke.style.bottom = `250px`;

  const maxLeft = window.innerWidth - size;
  smoke.style.left = `${Math.random() * maxLeft}px`;

  smoke.style.animationDelay = `${Math.random() * 15}s`;
  smoke.style.opacity = Math.random() * 0.3;
  smokeEffect.appendChild(smoke);
}

// ✨ Chispas
function createSpark() {
  const spark = document.createElement('div');
  spark.classList.add('spark');

  // tamaño aleatorio (2–8px)
  const size = Math.random() * 6 + 2;
  spark.style.width = spark.style.height = `${size}px`;

  // posición horizontal aleatoria
  const maxLeft = window.innerWidth - size;
  spark.style.left = `${Math.random() * maxLeft}px`;

  // posición vertical desde abajo, pero no tan pegado
  const minBottom = 150;   // altura mínima
  const maxBottom = 350;  // altura máxima
  spark.style.bottom = `${minBottom + Math.random() * (maxBottom - minBottom)}px`;

  // duración de la animación (más lenta en móvil)
  const isMobile = window.innerWidth < 768;
  const duration = isMobile 
      ? Math.random() * 1 + 40.0  
      : Math.random() * 1 + 20.0; 
  spark.style.animationDuration = `${duration}s`;

  // tiempo de vida del spark
  const timeout = isMobile ? 8000 : 3000;

  document.getElementById("sparkLayer").appendChild(spark);

  setTimeout(() => spark.remove(), timeout);
}


setInterval(createSpark, 300);
