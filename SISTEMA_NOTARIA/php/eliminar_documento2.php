<?php 
require_once '../conexion.php'; 
require_once 'preguntas_lista.php';

if(!isset($_POST['id_documento'])) die("No se indicó documento");

$pdo = Database::connect();

$sql = "SELECT d.id_tipo, c.tipo_documento
        FROM certesc c
        JOIN documento d ON c.id_documento = d.id_documento
        WHERE c.id_documento = :id_documento";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id_documento' => $_POST['id_documento']
]);

$fila = $stmt->fetch(PDO::FETCH_ASSOC);

$tipo_documento = $fila['tipo_documento'];
$tipo = $fila['id_tipo'];

if($tipo_documento != "Ninguno" && $tipo_documento != "ANULADO"){
    control_decre($pdo,NULL,$_POST['id_documento'],$tipo_documento, $tipo);
}

$stmt = $pdo->prepare("DELETE FROM documento WHERE id_documento = ?");
$stmt->execute([$_POST['id_documento']]);

$stmt = $pdo->prepare("DELETE FROM certesc WHERE id_documento = ?");
$stmt->execute([$_POST['id_documento']]);

echo "Documento y participantes eliminados correctamente";
Database::disconnect();
?>
