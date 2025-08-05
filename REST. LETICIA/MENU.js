
const dias = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
const hoy = new Date();
const diaNombre = dias[hoy.getDay()];

fetch(`menu.json?t=${new Date().getTime()}`)
  .then(res => res.json())
  .then(data => {
    const comidas = data[diaNombre];
    const lista = document.getElementById("menu-lista");
    //const titulo = document.getElementById("titulo");
    
    //titulo.textContent = `Restaurante "Leticia"`;
    
    // Crear elemento para el título del día con precio
    const tituloDia = document.createElement("div");
    tituloDia.innerHTML = `🍽️ Menú "${diaNombre}" - Completo: <span class="precio">${diaNombre === "DOMINGO" ? "20" : "15"}Bs</span>`;
    lista.appendChild(tituloDia);
    
    if (comidas && comidas.length > 0) {
      comidas.forEach(comida => {
            const li = document.createElement("li");
            li.textContent = `${ ""} ${comida.nombre}`;
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
      const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
    const dia = diasSemana[ahora.getDay()];
      const h = ahora.getHours();
      const m = ahora.getMinutes();
      const s = ahora.getSeconds();

      const mensaje = document.getElementById("mensaje");
      const body = document.body;
      body.style.animationName = "";

      let tramo = "";
      if (h >= 0 && h < 6) {
        tramo = "MADRUGADA";
        mensaje.textContent = "🌃 Madrugada: ";
      } else if (h >= 6 && h < 12) {
        /*if(dia==="VIERNES"){
        tramo = "MANANA3";
        }else{*/
        tramo = "MANANA";//}
        mensaje.textContent = "🌞 Mañana: ";
      } else if (h >= 12 && h < 18) {
        tramo = "TARDE";
        mensaje.textContent = "🏖️ Tarde: ";
      } else if (h >= 18 && h <= 23) {
        tramo = "NOCHE";
        mensaje.textContent = "🌙 Noche: ";
      }

      body.style.animationName = tramo;
      mensaje.textContent += `\nSon las ${dosDigitos(h)}:${dosDigitos(m)}:${dosDigitos(s)}`;
    }

    actualizarFondoAnimado();
    setInterval(actualizarFondoAnimado, 1000);




    const flameContainer = document.getElementById("flames");
    for (let i = 0; i < 80; i++) {
      const flame = document.createElement("div");
      flame.classList.add("flame");
      flame.style.left = `${Math.random() * 100}%`;
      flame.style.animationDelay = `${Math.random() * 1.5}s`;
      flame.style.width = `${10 + Math.random() * 10}px`;
      flame.style.height = `${10 + Math.random() * 10}px`;
      flameContainer.appendChild(flame);
    }



    
    const smokeEffect = document.getElementById('smokeEffect');
    for (let i = 0; i < 15; i++) {
      const smoke = document.createElement('div');
      smoke.classList.add('smoke');
      smoke.style.height = smoke.style.width = `${Math.random() * 150 + 100}px`;
      smoke.style.left = `${Math.random() * 100}%`;
      smoke.style.animationDelay = `${Math.random() * 15}s`;
      smoke.style.opacity = Math.random() * 0.3;
      smokeEffect.appendChild(smoke);
    }

    function createSpark() {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.bottom = `0`;

    // Duración de la animación (más larga en pantallas pequeñas)
    const isMobile = window.innerWidth < 768; // Podés ajustar el umbral
    const duration = isMobile 
        ? Math.random() * 1 + 40.0  // más lento en móvil
        : Math.random() * 1 + 20.0; // más rápido en PC

    spark.style.animationDuration = `${duration}s`;

    // Tiempo de vida del elemento según tipo de dispositivo
    const timeout = isMobile ? 8000 : 3000;

    document.getElementById("sparkLayer").appendChild(spark);

    setTimeout(() => {
        spark.remove();
    }, timeout);
}


    setInterval(createSpark, 300);
