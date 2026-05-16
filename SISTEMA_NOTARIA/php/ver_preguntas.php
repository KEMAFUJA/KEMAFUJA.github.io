<?php
require_once __DIR__ . '/../conexion.php';

$pdo = Database::connect();

$order = $_GET['order'] ?? 'id_preg';
$dir = $_GET['dir'] ?? 'ASC';

$allowed = ['id_preg','descripcion','cant_esc','cant_cert'];

if(!in_array($order,$allowed)){
    $order = 'id_preg';
}

$dir = $dir === 'DESC' ? 'DESC' : 'ASC';


$sql = "SELECT 
            id_preg,
            descripcion,
            CASE 
                WHEN id_preg = 5 THEN ROUND(cant_esc / 12.0, 2)
                ELSE cant_esc 
            END AS cant_esc,

            CASE 
                WHEN id_preg = 5 THEN ROUND(cant_cert / 12.0, 2)
                ELSE cant_cert 
            END AS cant_cert

        FROM preguntas
        ORDER BY $order $dir";
$stmt = $pdo->query($sql);$preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);


?>