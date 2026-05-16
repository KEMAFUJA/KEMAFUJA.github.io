<?php
require_once '../conexion.php';

if(!isset($_POST['id_documento'])) die("No se indicó documento");
if(!isset($_POST['nombre']) || !isset($_POST['tipo_persona'])) die("Faltan datos");
 
$id_documento   = $_POST['id_documento'];
$nombre         = $_POST['nombre'];
$identificacion = $_POST['identificacion'] ?? '';
$tipo_persona   = $_POST['tipo_persona'];
$nacionalidad   = $_POST['nacionalidad'] ?? '';

$pdo = Database::connect();

$stmt = $pdo->prepare("INSERT INTO participante 
    (id_documento, nombre, identificacion, tipo_persona, nacionalidad) 
    VALUES (?, ?, ?, ?, ?)
    RETURNING id_participante");
$stmt->execute([$id_documento, $nombre, $identificacion, $tipo_persona, $nacionalidad]);

$id_participante = $stmt->fetchColumn();

Database::disconnect();

echo json_encode([
    'id_participante' => $id_participante,
    'nombre' => $nombre,
    'identificacion' => $identificacion,
    'tipo_persona' => $tipo_persona,
    'nacionalidad' => $nacionalidad
]);
