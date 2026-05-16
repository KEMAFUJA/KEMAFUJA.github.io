<?php
require_once '../../conexion.php';
$pdo = Database::connect();

$sql = "
SELECT 
    CAST(split_part(d.numero, '/', 2) AS INT) as anio,
    COUNT(*) as cantidad
FROM documento d
JOIN tipo_documento td 
    ON td.id_tipo = d.id_tipo
WHERE td.nombre = 'PODER'
GROUP BY anio
ORDER BY anio;
";

$stmt = $pdo->prepare($sql);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
