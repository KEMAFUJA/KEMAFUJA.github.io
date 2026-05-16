<?php
require_once '../conexion.php';
require_once 'preguntas_lista.php';
require_once 'preguntas.php';

if(!isset($_POST['id_documento'])) die("Falta ID documento");

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
    control_decre($pdo, NULL, $_POST['id_documento'], $tipo_documento, $tipo);
}


$stmt = $pdo->prepare("UPDATE documento 
                        SET numero=?, fecha_documento=?, documento=? 
                        WHERE id_documento=?");

$stmt->execute([
    $_POST['numero'], 
    $_POST['fecha'], 
    $_POST['documento'], 
    $_POST['id_documento']
]);


$beneficiarios = trim($_POST['beneficiarios'] ?? '');

if ($beneficiarios === '') {
    $beneficiarios = 'NT';
}

$municipio = !empty($_POST['municipio']) ? $_POST['municipio'] : 'Santa Cruz - Santa Cruz de la Sierra';
$tipoDocumento = $_POST['tipo_documento'];
$tipoVenta = $_POST['tipo_venta'];

if(strtoupper($tipoDocumento) === 'Ninguno'){
    $tipoVenta = 'NINGUNO';
}

$stmt = $pdo->prepare("UPDATE certesc 
                        SET tipo_pago=?, 
                            beneficiarios=?, 
                            municipio=?, 
                            tipo_documento=?, 
                            tipo_venta=? 
                        WHERE id_documento=?");

$stmt->execute([
    $_POST['tipo_pago'],
    $beneficiarios,
    $municipio,
    $tipoDocumento,
    $tipoVenta,
    $_POST['id_documento']
]);


if($_POST['tipo_documento'] != "Ninguno" && $_POST['tipo_documento'] != "ANULADO"){
    control_incre($pdo, $_POST['id_documento'],$_POST['tipo_documento'], $tipo);
}

Database::disconnect();
echo "Documento actualizado";