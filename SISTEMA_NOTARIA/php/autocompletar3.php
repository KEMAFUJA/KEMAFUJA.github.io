<?php
header('Content-Type: application/json');
require_once '../conexion.php';
$pdo = Database::connect();

try {

    $busqueda = $_GET['q'] ?? '';
    $resultados = [];

    if (!empty($busqueda)) {

        $sql = "
            SELECT 
                documento,
                COUNT(*) as total
            FROM documento
            WHERE LOWER(documento) ILIKE LOWER(:busqueda)
            GROUP BY documento
            ORDER BY total DESC, documento ASC
            LIMIT 15;
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':busqueda' => '%' . $busqueda . '%'
        ]);

        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($resultados);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

Database::disconnect();
