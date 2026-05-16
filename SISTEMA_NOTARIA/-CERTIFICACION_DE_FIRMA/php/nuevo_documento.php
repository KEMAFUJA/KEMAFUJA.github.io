<?php
require_once '../../conexion.php';
require_once '../../php/preguntas.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $numero = $_POST['numero'] ?? '';
    $fecha_documento = $_POST['fecha_documento'] ?? '';
    $documento = $_POST['documento'] ?? '';
    $beneficiarios = $_POST['beneficiarios'] ?: 'NT';
    $municipio = !empty($_POST['municipio']) ? $_POST['municipio'] : 'Santa Cruz - Santa Cruz de la Sierra';
    $tipo_pago = $_POST['tipo_pago'] ?? '';
    
    $tipo_documento = $_POST['tipo_documento'];
    if ($tipo_documento === 'Compra/Venta') {
        $tipo_venta = $_POST['tipo_venta'];

    } elseif ($tipo_documento === 'Sociedad') {
        $tipo_venta = $_POST['tipo_trato'];

    } elseif ($tipo_documento === 'ANULADO') {
        $tipo_venta = 'ANULADO';

    } elseif ($tipo_documento === 'Ninguno') {
        $tipo_venta = 'Ninguno';
    }
    
    $nombres = $_POST['nombre'] ?? [];
    $cantidad_nombre = count($nombres);
    $identificaciones = $_POST['identificacion'] ?? [];
    $tipos_persona = $_POST['tipo_persona'] ?? [];
    $nacionalidades = $_POST['pais'] ?? [];
    foreach ($nacionalidades as $i => $valor) {
        if (trim($valor) === '') {
            $nacionalidades[$i] = 'Bolivia';
        }
    }
    $calidad = $_POST['calidad'] ?? [];

    foreach ($calidad as $i => $valor) {
        if (trim($valor) === '') {
            $calidad[$i] = 'Parte';
        }
    }

    if (!$numero || !$fecha_documento || !$documento || empty($nombres)) {
        die("Faltan datos obligatorios");
    }

    try {
        $pdo = Database::connect();
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            SELECT numero FROM documento 
            WHERE id_tipo = (
                SELECT id_tipo FROM tipo_documento 
                WHERE nombre = 'CERTIFICACION DE FIRMA'
            )
            AND numero = :numero
        ");

        $stmt->execute([':numero' => $numero]);

        if ($stmt->fetch()) {
            $pdo->rollBack(); // 🔥 IMPORTANTE
            echo "existe|El número $numero ya está registrado.";
            exit;
        }


        $procesado = false;
        if($tipo_documento!="Ninguno" && $tipo_documento!="ANULADO"){
            $procesado = procesarPreguntas($pdo,[ 
            'tipo_documento' => $tipo_documento,
            'tipo_pago' => $tipo_pago,
            'municipio' => $municipio,
            'beneficiarios' => $beneficiarios,
            'tramite' => 'cant_esc',
            'tipo_persona' => $tipos_persona,
            'pais' => $nacionalidades
            ]);
            
        }
        $stmt = $pdo->prepare("
            INSERT INTO documento (id_tipo, numero, fecha_documento, documento)
            VALUES (
                (SELECT id_tipo FROM tipo_documento WHERE nombre = 'CERTIFICACION DE FIRMA'),
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

        $stmt = $pdo->prepare("
            INSERT INTO certesc (id_documento, tipo_pago, beneficiarios, municipio, tipo_documento, tipo_venta)
            VALUES (
                :id_documento,
                :tipo_pago,
                :beneficiarios,
                :municipio,
                :tipo_documento,
                :tipo_venta
            )
        ");
        $stmt->execute([
            'id_documento'=> $id_documento,
            ':tipo_pago' => $tipo_pago,
            ':beneficiarios' => $beneficiarios,
            ':municipio' => $municipio,
            ':tipo_documento' => $tipo_documento,
            ':tipo_venta' => $tipo_venta

        ]);


        // Preparar el insert de participantes dinámicamente
        $values = [];
        $params = [];
        foreach ($nombres as $i => $nombre) {
            $values[] = "(:id_documento, :nombre$i, :identificacion$i, :tipo_persona$i, :nacionalidad$i, :calidad$i)";
            $params[":nombre$i"] = $nombre;
            $params[":identificacion$i"] = $identificaciones[$i];
            $params[":tipo_persona$i"] = $tipos_persona[$i];
            $params[":nacionalidad$i"] = $nacionalidades[$i];
            $params[":calidad$i"] = $calidad[$i];
        }
        $params[':id_documento'] = $id_documento;

        $sql = "INSERT INTO participante (id_documento, nombre, identificacion, tipo_persona, nacionalidad, calidad) VALUES " . implode(", ", $values);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $pdo->commit();

        if($tipo_documento!="Ninguno" && $tipo_documento!="ANULADO"){            
            if($procesado){
                echo "correcto|Certificado $numero<br>con $cantidad_nombre participantes guardados correctamente.";
            } else {
                echo "Certificado $numero<br>con $cantidad_nombre participantes guardados correctamente.";
            }
        } else {
            echo "Certificado $numero<br>con $cantidad_nombre participantes guardados correctamente.";
        }

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
