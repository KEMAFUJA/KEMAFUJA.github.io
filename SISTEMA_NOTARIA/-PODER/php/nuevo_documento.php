<?php
require_once '../../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $numero = $_POST['numero'] ?? '';
    $fecha_documento = $_POST['fecha_documento'] ?? '';
    $tipo_poder = $_POST['tipo_poder'] ?? '';
    $testigos = $_POST['testigo'] ?? '0';

    $nombres = $_POST['nombre'] ?? [];
    $cantidad_nombre = count($nombres);

    $identificaciones = $_POST['identificacion'] ?? [];
    $tipos_persona = $_POST['tipo_persona'] ?? [];
    $nacionalidades = $_POST['pais'] ?? [];

    $nombres_beneficiarios = $_POST['nombre_beneficiario'] ?? [];
    $cantidad_nombre_ben = count($nombres_beneficiarios);
    
    if (!$numero || !$fecha_documento || empty($nombres)) {
        die("Faltan datos obligatorios");
    }

    try {
        $pdo = Database::connect();
        $pdo->beginTransaction();

        // Insertar el documento y obtener id_documento
        $stmt = $pdo->prepare("
            INSERT INTO documento (id_tipo, numero, fecha_documento)
            VALUES (
                (SELECT id_tipo FROM tipo_documento WHERE nombre = 'PODER'),
                :numero,
                :fecha_documento
            )
            RETURNING id_documento
        ");
        $stmt->execute([
            ':numero' => $numero,
            ':fecha_documento' => $fecha_documento
        ]);

        $id_documento = $stmt->fetchColumn();

        if ($cantidad_nombre_ben > 0) {

            $values = [];
            $params = [];

            foreach ($nombres_beneficiarios as $i => $nombre_ben) {
                $values[] = "(:id_documento, :nombre_beneficiario$i)";
                $params[":nombre_beneficiario$i"] = $nombre_ben; // ← aquí estaba tu error antes
            }

            $params[':id_documento'] = $id_documento;

            $sql = "INSERT INTO part_poder (id_documento, nombre_beneficiario) 
                    VALUES " . implode(", ", $values);

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO poder (id_documento, tipo_poder, testigos, cant_poderantes, cant_poderados)
            VALUES (
                :id_documento,
                :tipo_poder,
                :testigos,
                :cant_poderantes,
                :cant_poderados
            )
        ");
        $stmt->execute([
            ':id_documento'=> $id_documento,
            ':tipo_poder' => $tipo_poder,
            ':testigos' => $testigos,
            ':cant_poderantes' => $cantidad_nombre,
            ':cant_poderados' => $cantidad_nombre_ben
        ]);


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
        echo "Certificado y participantes guardados correctamente";

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
