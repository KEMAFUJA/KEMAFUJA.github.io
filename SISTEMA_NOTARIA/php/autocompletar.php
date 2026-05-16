<?php
header('Content-Type: application/json');
require_once '../conexion.php';
$pdo = Database::connect();

try {

    $busqueda = $_GET['q'] ?? '';
    $resultados = [];

    if (!empty($busqueda)) {

        $sql = "
            SELECT DISTINCT
                nombre, 
                identificacion,
                tipo_persona,
                nacionalidad
            FROM participante
            WHERE LOWER(nombre) ILIKE LOWER(:busqueda)
            Order By nombre asc
            LIMIT 10            
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
