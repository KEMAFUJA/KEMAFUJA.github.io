<?php
require_once '../conexion.php';
require_once 'preguntas_lista.php';
require_once 'preguntas.php';

if(!isset($_POST['id_participante'])) die("Falta ID participante");

$pdo = Database::connect();

$sql = "SELECT d.id_tipo, c.tipo_documento, c.id_documento
        FROM participante p
        JOIN certesc c ON p.id_documento = c.id_documento
        JOIN documento d ON p.id_documento = d.id_documento
        WHERE p.id_participante = :id_participante";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id_participante' => $_POST['id_participante']
]);

$fila = $stmt->fetch(PDO::FETCH_ASSOC);

$tipo_documento = $fila['tipo_documento'];
$id_documento = $fila['id_documento'];
$tipo = $fila['id_tipo'];


if($tipo_documento != "Ninguno" && $tipo_documento != "ANULADO"){
    control_decre($pdo,$_POST['id_participante'],NULL,$tipo_documento, $tipo);
}

$stmt = $pdo->prepare("UPDATE participante SET nombre=?, identificacion=?, tipo_persona=?, nacionalidad=?, calidad=? WHERE id_participante=?");
$stmt->execute([$_POST['nombre'], $_POST['identificacion'], $_POST['tipo_persona'], $_POST['nacionalidad'], $_POST['calidad'], $_POST['id_participante']]);

if($tipo_documento != "Ninguno" && $tipo_documento != "ANULADO"){
    control_incre($pdo, $id_documento,$tipo_documento, $tipo);
}

Database::disconnect();
echo "Participante actualizado";
 