<?php
require_once '../conexion.php';
if(!isset($_POST['id_documento'])) die("Falta ID documento");

$pdo = Database::connect();

$stmt = $pdo->prepare("UPDATE documento SET numero=?, fecha_documento=?, documento=? WHERE id_documento=?");
$stmt->execute([$_POST['numero'], $_POST['fecha'], $_POST['documento'], $_POST['id_documento']]);

Database::disconnect();
echo "Documento actualizado";
