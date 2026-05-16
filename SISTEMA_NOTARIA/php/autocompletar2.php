<?php
header('Content-Type: application/json');
require_once '../conexion.php';
$pdo = Database::connect();

try {
    $tipo = $_GET['tipo'] ?? '';
    $busqueda = $_GET['q'] ?? '';
    $nombre = $_GET['nombre'] ?? '';
    $resultados = [];
    
    // Añadir logging para depuración
    error_log("Tipo: $tipo, Busqueda: $busqueda, Nombre: $nombre");
 
    if ($tipo === 'calidad' && !empty($busqueda)) {
        $sql = "SELECT DISTINCT calidad 
                FROM participante 
                WHERE UPPER(calidad) ILIKE UPPER(:busqueda) 
                LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => '%' . $busqueda . '%']);
        $resultados = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        
        // Log para depuración
        error_log("Resultados calidad: " . print_r($resultados, true));
    }

    if ($tipo === 'nombre_beneficiario' && !empty($busqueda)) {
        $sql = "Select nombre 
                From (SELECT DISTINCT nombre
                FROM participante 
                union
                SELECT DISTINCT nombre_beneficiario
                FROM part_poder) as nombre
                WHERE UPPER(nombre) ILIKE UPPER(:busqueda) 
                order by nombre asc
                LIMIT 10";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => '%' . $busqueda . '%']);
        $resultados = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        
        // Log para depuración
        error_log("Resultados nombre_beneficiario: " . print_r($resultados, true));
    }
    
    // Asegurarse de que siempre devolvemos un array
    if (empty($resultados)) {
        $resultados = [];
    }
    
    echo json_encode($resultados);
    
} catch (PDOException $e) {
    // Devolver un array vacío en caso de error
    error_log("Error en autocompletar: " . $e->getMessage());
    echo json_encode([]);
}

Database::disconnect();
?>