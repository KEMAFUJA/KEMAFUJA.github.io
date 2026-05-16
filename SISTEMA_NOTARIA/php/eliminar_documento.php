<?php
require_once '../conexion.php';

if(!isset($_POST['id_documento'])) die("No se indicó documento");

$pdo = Database::connect();
$stmt = $pdo->prepare("DELETE FROM documento WHERE id_documento = ?");
$stmt->execute([$_POST['id_documento']]);

echo "Documento y participantes eliminados correctamente";
Database::disconnect();
?>
