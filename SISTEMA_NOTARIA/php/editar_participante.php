<?php
require_once '../conexion.php';
if(!isset($_POST['id_participante'])) die("Falta ID participante");

$pdo = Database::connect();

$stmt = $pdo->prepare("UPDATE participante SET nombre=?, identificacion=?, tipo_persona=?, nacionalidad=? WHERE id_participante=?");
$stmt->execute([$_POST['nombre'], $_POST['identificacion'], $_POST['tipo_persona'], $_POST['nacionalidad'], $_POST['id_participante']]);

Database::disconnect();
echo "Participante actualizado";
