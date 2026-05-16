<?php
require_once '../conexion.php';
require_once 'preguntas_lista.php';
require_once 'preguntas.php';

if(!isset($_POST['id_documento'])) die("No se indicó documento");
if(!isset($_POST['nombre']) || !isset($_POST['tipo_persona'])) die("Faltan datos");
 
$pdo = Database::connect();

$sql = "SELECT d.id_tipo, c.tipo_documento, c.id_documento
        FROM certesc c
        JOIN documento d ON c.id_documento = d.id_documento
        WHERE c.id_documento = :id_documento";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id_documento' => $_POST['id_documento']
]);

$fila = $stmt->fetch(PDO::FETCH_ASSOC);

$tipo_documento = $fila['tipo_documento'];
$id_tipo = $fila['id_tipo'];

if ($tipo_documento !== "Ninguno" && $tipo_documento !== "ANULADO") {
    control_decre($pdo, null, $_POST['id_documento'], $tipo_documento, $id_tipo);
}

$stmt = $pdo->prepare("INSERT INTO participante 
    (id_documento, nombre, identificacion, tipo_persona, nacionalidad, calidad) 
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id_participante");
$stmt->execute([$_POST['id_documento'], $_POST['nombre'], $_POST['identificacion'], $_POST['tipo_persona'], $_POST['nacionalidad'], $_POST['calidad']]);

$id_participante = $stmt->fetchColumn();

Database::disconnect();

echo json_encode([
    'id_participante' => $_POST['id_documento'],
    'nombre' => $_POST['nombre'],
    'identificacion' => $_POST['identificacion'],
    'tipo_persona' => $_POST['tipo_persona'],
    'nacionalidad' => $_POST['nacionalidad'],
    'calidad' => $_POST['calidad']
]);

if($tipo_documento != "Ninguno" && $tipo_documento != "ANULADO"){
    control_incre($pdo, $_POST['id_documento'],$tipo_documento, $id_tipo);
}
