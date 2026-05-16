<?php
require_once '../../conexion.php';
$pdo = Database::connect();

$sql = "
SELECT 
    CAST(split_part(d.numero, '/', 2) AS INT) AS anio,
    COUNT(*) AS cantidad,
    (
        SELECT numero
        FROM documento d2
        JOIN tipo_documento td2 
            ON td2.id_tipo = d2.id_tipo
        WHERE td2.nombre = 'CERTIFICACION DE FIRMA'
        ORDER BY d2.id_documento DESC
        LIMIT 1
    ) AS ultimo_numero
FROM documento d
JOIN tipo_documento td 
    ON td.id_tipo = d.id_tipo
WHERE td.nombre = 'CERTIFICACION DE FIRMA'
GROUP BY anio
ORDER BY anio desc;
";
 
$stmt = $pdo->prepare($sql);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
