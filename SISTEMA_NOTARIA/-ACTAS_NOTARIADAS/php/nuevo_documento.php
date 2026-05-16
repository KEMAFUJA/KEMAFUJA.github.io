<?php
require_once '../../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $numero = $_POST['numero'] ?? '';
    $fecha_documento = $_POST['fecha_documento'] ?? '';
    $documento = $_POST['documento'] ?? '';

    $nombres = $_POST['nombre'] ?? [];
    $identificaciones = $_POST['identificacion'] ?? [];
    $tipos_persona = $_POST['tipo_persona'] ?? [];
    $nacionalidades = $_POST['pais'] ?? [];

    if (!$numero || !$fecha_documento || !$documento || empty($nombres)) {
        die("Faltan datos obligatorios");
    }

    try {
        $pdo = Database::connect();
        $pdo->beginTransaction();

        // Insertar el documento y obtener id_documento
        $stmt = $pdo->prepare("
            INSERT INTO documento (id_tipo, numero, fecha_documento, documento)
            VALUES (
                (SELECT id_tipo FROM tipo_documento WHERE nombre = 'ACTAS NOTARIADAS'),
                :numero,
                :fecha_documento,
                :documento
            )
            RETURNING id_documento
        ");
        $stmt->execute([
            ':numero' => $numero,
            ':fecha_documento' => $fecha_documento,
            ':documento' => $documento
        ]);
        $id_documento = $stmt->fetchColumn();

        // Preparar el insert de participantes dinámicamente
        $values = [];
        $params = [];
        foreach ($nombres as $i => $nombre) {
            $values[] = "(:id_documento, :nombre$i, :identificacion$i, :tipo_persona$i, :nacionalidad$i)";
            $params[":nombre$i"] = $nombre;
            $params[":identificacion$i"] = $identificaciones[$i];
            $params[":tipo_persona$i"] = $tipos_persona[$i];
            $params[":nacionalidad$i"] = $nacionalidades[$i];
        }
        $params[':id_documento'] = $id_documento;

        $sql = "INSERT INTO participante (id_documento, nombre, identificacion, tipo_persona, nacionalidad) VALUES " . implode(", ", $values);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $pdo->commit();
        echo "Acta y participantes guardados correctamente";

    } catch (Exception $e) {
        $pdo->rollBack();
        echo "Error: " . $e->getMessage();
    } finally {
        Database::disconnect();
    }
} else {
    echo "Método no permitido";
}
?>
