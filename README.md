<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto Personal</title>
    
</head>

<style>
/*FONDO*/
@keyframes backgroundColorChange {
  0% { background-color: #ffffff; }
  20% { background-color: #0088ff; } 
  40% { background-color: #ff8400; }
  60% { background-color: #8c0033; }
  80% { background-color: #000000; }
  100% { background-color: #ffffff; }
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  animation: backgroundColorChange 20s ease-in-out infinite; /* Duración de 10 segundos, en bucle infinito */
}

/*FONDO CUBO*/
@keyframes backgroundColorChange2 {
  0% { background-color: #ffffff; }
  33% { background-color: #d2e5ff; } 
  66% { background-color:#59affa; }
  100% { background-color: #ffffff; }
}
/*CUBO*/
.card {  
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
  text-align: center;
  animation: backgroundColorChange2 40s ease-in-out infinite, heartbeat 2.5s infinite; 
}
/*NOMBRE*/
.card h2 {
  font-size: 24px;
  margin: 0;
}
/*RELLENO*/
.card p {
  color: #474747;
  margin: 5px 0;
}

/*LINK WHATS APP*/
@keyframes backgroundColorChange3 {
  0% { 
    background-color: #ffffff; 
    color: #000000; /* Color del texto inicial */
  }
  33% { 
    background-color: #d2e5ff; 
    color: #007bff; /* Cambia el color del texto en esta etapa */
  } 
  66% { 
    background-color: #59affa; 
    color: #ffcc00; /* Cambia el color del texto en esta etapa */
  }
  100% { 
    background-color: #ffffff; 
    color: #000000; /* Vuelve al color del texto inicial */
  }
}

.card a {
  text-decoration: none;
  font-weight: bold;
  animation: backgroundColorChange3 40s ease-in-out infinite, heartbeat 3s ease-in-out infinite;  
}

/*JUNTAO*/
.inline-text {
display: inline;
}
/*PALPITO*/
@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.01); }
}


/*TITUTO CON EFECTO*/
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

@keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

.letra {
    font-size: 50px;
    transition: font-size 10s; /* Suaviza la transición del cambio de tamaño de fuente */
    opacity: 1; /* Inicialmente visible */
}

.font1 {
    font-family: Arial, sans-serif;
}

.font2 {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
}

.font3 {
    font-family: 'Courier New', Courier, monospace;
}

.font4 {
    font-family: 'Times New Roman';
}

.hidden {
    display: none; /* Oculta el elemento cuando no está visible */
}

</style>

<body>
    <div class="card">

        <div class="letra-container">
            <h1 class="letra font1">FJ ENTERPRISE</h1>
            <h1 class="letra font2 hidden">FJ ENTERPRISE</h1>
            <h1 class="letra font3 hidden">FJ ENTERPRISE</h1>
            <h1 class="letra font4 hidden">FJ ENTERPRISE</h1>
        </div>
        
        
        <div class="mb-5">
            <h3 class="inline-text bg-ing">ING.</h3>
            <h2 class="inline-text bg-nombre">KEVIN MAURICIO FUENTES JAIMES</h2>
        </div>
        <p><strong>Teléfono:</strong> +591 71055268</p>
        <p><strong>Correo:</strong> kevin_mfuentes@hotmail.com</p>
        <p><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=59171055268" target="_blank">Ir a chat en WhatsApp</a></p>
    </div> 
    


    <script>
        const fonts = document.querySelectorAll('.letra');
        let currentFont = 0;
    
        function changeFont() {
            // Ocultar la fuente actual
            fonts[currentFont].style.animation = 'fadeOut 1s forwards'; // Aplicar la animación de desvanecimiento
            fonts[currentFont].classList.add('hidden');
    
            // Incrementar el índice de la fuente actual
            currentFont = (currentFont + 1) % fonts.length;
    
            // Mostrar la siguiente fuente
            fonts[currentFont].classList.remove('hidden');
            fonts[currentFont].style.animation = 'fadeIn 1s forwards'; // Aplicar la animación de aparición
        }
    
        // Cambiar la fuente cada 2 segundos (2000 milisegundos)
        setInterval(changeFont, 3000);
    </script>
    
</body>
</html>

