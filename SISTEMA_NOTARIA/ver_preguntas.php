<?php
require_once "php/ver_preguntas.php";
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Preguntas</title>
<link rel="stylesheet" href="css/preguntas.css">
</head>
<body>
<div class="preguntas-container">
<h2>Listado de Preguntas</h2>

<div id="boton-container">
    <!-- El botón se generará con JavaScript -->
</div>

 <table class="preguntas-tabla">

<tr>

<th onclick="ordenar('id_preg')">
ID <?= $order=='id_preg' ? ($dir=='ASC' ? '▲' : '▼') : '' ?>
</th>

<th onclick="ordenar('descripcion')">
Descripción <?= $order=='descripcion' ? ($dir=='ASC' ? '▲' : '▼') : '' ?>
</th>

<th onclick="ordenar('cant_esc')">
Cant. Esc <?= $order=='cant_esc' ? ($dir=='ASC' ? '▲' : '▼') : '' ?>
</th>

<th onclick="ordenar('cant_cert')">
Cant. Cert <?= $order=='cant_cert' ? ($dir=='ASC' ? '▲' : '▼') : '' ?>
</th>

</tr>

<?php foreach($preguntas as $p): ?>

<tr>
<td><?= $p['id_preg'] ?></td>
<td><?= htmlspecialchars($p['descripcion']) ?></td>
<td><?= $p['cant_esc'] ?></td>
<td><?= $p['cant_cert'] ?></td>
</tr>

<?php endforeach; ?>

</table>
</div>

<script>
const params = new URLSearchParams(window.location.search);
let dir = params.get("dir") || "ASC";
let order = params.get("order") || "";

let origen = params.get('origen') || localStorage.getItem('origen_anterior');

const botonContainer = document.getElementById('boton-container');

if (origen) {
    botonContainer.innerHTML = '<a href="' + origen + '" class="btn-volver">← Volver</a>';
    localStorage.removeItem('origen_anterior');
} else {
    botonContainer.innerHTML = '<a href="-CERTIFICACION_DE_FIRMA/" class="btn-volver">← Volver a Inicio</a>';
}

function ordenar(col){
    let nuevaDir = "ASC";
    if(order === col){
        nuevaDir = dir === "ASC" ? "DESC" : "ASC";
    }
    
    let url = "?order=" + col + "&dir=" + nuevaDir;
    window.location = url;
}
</script>


</body>
</html>