<?php
require_once '../../conexion.php';
$pdo = Database::connect();

$filtros = [
    'numero' => $_GET['numero'] ?? '',
    'fecha' => $_GET['fecha'] ?? '',
    'documento' => $_GET['documento'] ?? '',
    'tipo_pago' => $_GET['tipo_pago'] ?? '',
    'beneficiarios' => $_GET['beneficiarios'] ?? '',
    'municipio' => $_GET['municipio'] ?? '',
    'tipo_documento' => $_GET['tipo_doc'] ?? '',
    'tipo_venta' => $_GET['tipo_venta'] ?? '',
    
    'nombre' => $_GET['nombre'] ?? '',
    'identificacion' => $_GET['identificacion'] ?? '',
    'tipo_persona' => $_GET['tipo'] ?? '',
    'nacionalidad' => $_GET['nacionalidad'] ?? '',
    'calidad' => $_GET['calidad'] ?? ''
];

$orderCol = $_GET['orderCol'] ?? 'numero';
$orderDir = $_GET['orderDir'] ?? 'ASC';

$orderSQL = "CAST(split_part(d.numero, '/', 2) AS INT), CAST(split_part(d.numero, '/', 1) AS INT)";
if ($orderCol === 'fecha') $orderSQL = "d.fecha_documento $orderDir";
if ($orderCol === 'documento') $orderSQL = "d.documento $orderDir";

if ($orderCol === 'tipo_pago') $orderSQL = "ce.tipo_pago $orderDir";
if ($orderCol === 'beneficiarios') $orderSQL = "ce.beneficiarios $orderDir";
if ($orderCol === 'municipio') $orderSQL = "ce.municipio $orderDir";
if ($orderCol === 'tipo_documento') $orderSQL = "ce.tipo_documento $orderDir";
if ($orderCol === 'tipo_venta') $orderSQL = "ce.tipo_venta $orderDir";

$where = ["td.nombre = 'CERTIFICACION DE FIRMA'"];
$params = [];

if ($filtros['tipo_pago'] !== '') {
    $where[] = "ce.tipo_pago ILIKE ?";
    $params[] = "%{$filtros['tipo_pago']}%";
}

if ($filtros['beneficiarios'] !== '') {

    if ($filtros['beneficiarios'] === 'NT') {
        // No tiene
        $where[] = "ce.beneficiarios = 'NT'";
    }

    if ($filtros['beneficiarios'] === '>0') {
        // Sí tiene (todo lo que NO es NT)
        $where[] = "ce.beneficiarios <> 'NT'";
    }
}

if ($filtros['municipio'] !== '') {
    $where[] = "ce.municipio ILIKE ?";
    $params[] = "%{$filtros['municipio']}%";
}
if ($filtros['tipo_documento'] !== '') {
    $where[] = "ce.tipo_documento ILIKE ?";
    $params[] = "%{$filtros['tipo_documento']}%";
}
if ($filtros['tipo_venta'] !== '') {
    $where[] = "ce.tipo_venta ILIKE ?";
    $params[] = "%{$filtros['tipo_venta']}%";
}

if ($filtros['numero'] !== '') {
$where[] = "split_part(d.numero, '/', 1) LIKE ?";
$params[] = "%{$filtros['numero']}%";
}

if ($filtros['fecha'] !== '') {

    $f = trim($filtros['fecha']);

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $f)) {
        $where[] = "d.fecha_documento = ?";
        $params[] = $f;

    } elseif (preg_match('/^\d{4}$/', $f)) {
        $where[] = "EXTRACT(YEAR FROM d.fecha_documento) = ?";
        $params[] = $f;

    } elseif (preg_match('/^\d{1,2}$/', $f)) {
        $where[] = "(EXTRACT(DAY FROM d.fecha_documento) = ? OR EXTRACT(MONTH FROM d.fecha_documento) = ?)";
        $params[] = $f;
        $params[] = $f;
    }
}

if ($filtros['documento'] !== '') {
    $where[] = "d.documento ILIKE ?";
    $params[] = "%{$filtros['documento']}%";
}

if ($filtros['nombre'] !== '') {
    $where[] = "d.id_documento IN (
        SELECT id_documento FROM participante 
        WHERE nombre ILIKE ?
    )";
    $params[] = "%{$filtros['nombre']}%";
}

if ($filtros['identificacion'] !== '') {
    $where[] = "d.id_documento IN (
        SELECT id_documento FROM participante 
        WHERE identificacion ILIKE ?
    )";
    $params[] = "%{$filtros['identificacion']}%";
}

if ($filtros['tipo_persona'] !== '') {
    $where[] = "d.id_documento IN (
        SELECT id_documento FROM participante 
        WHERE tipo_persona = ?
    )";
    $params[] = $filtros['tipo_persona'];
}

if ($filtros['nacionalidad'] !== '') {
    $where[] = "d.id_documento IN (
        SELECT id_documento FROM participante 
        WHERE nacionalidad ILIKE ?
    )";
    $params[] = "%{$filtros['nacionalidad']}%";
}

if ($filtros['calidad'] !== '') {
    $where[] = "d.id_documento IN (
        SELECT id_documento FROM participante 
        WHERE calidad ILIKE ?
    )";
    $params[] = "%{$filtros['calidad']}%";
}

$sql = "
SELECT
    d.id_documento,
    d.numero,
    d.fecha_documento,
    d.documento,
    p.id_participante,
    p.nombre,
    p.identificacion,
    p.tipo_persona,
    p.nacionalidad,
    p.calidad,
    ce.tipo_pago,
    ce.beneficiarios,
    ce.municipio,
    ce.tipo_documento,
    ce.tipo_venta

FROM documento d
JOIN tipo_documento td
    ON td.id_tipo = d.id_tipo
JOIN participante p
    ON p.id_documento = d.id_documento
JOIN certesc ce
    ON ce.id_documento = d.id_documento

WHERE " . implode(" AND ", $where) . "
ORDER BY 
    fecha_documento,
    CAST(split_part(d.numero, '/', 2) AS INT),
    CAST(split_part(d.numero, '/', 1) AS INT)
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$participantesPorDocumento = [];

foreach($rows as $r){
    $id = $r['id_documento'];

    if(!isset($participantesPorDocumento[$id])){
        $participantesPorDocumento[$id] = 0;
    }

    if($r['id_participante']){
        $participantesPorDocumento[$id]++;
    }
}


$ultimoDoc = null;

foreach($rows as $row){

    if($row['id_documento'] !== $ultimoDoc){
        echo "<tr class='documento-nuevo' data-iddocumento='{$row['id_documento']}'>
                <td>{$row['numero']}</td>
                <td>{$row['fecha_documento']}</td>
                <td>{$row['documento']}</td>
                <td>{$row['tipo_documento']}</td>
                <td>{$row['tipo_venta']}</td>
                <td>{$row['beneficiarios']}</td>
                <td>{$row['tipo_pago']}</td>
                <td>{$row['municipio']}</td>
                <td colspan='5'>
                    <button class='editar-documento' title='Modificar Documento'>✏️</button>
                    <button class='eliminar-documento' title='Eliminar Documento'>
                        <i class='fa-solid fa-trash-can'></i>
                    </button>
                    <button class='agregar-participante' title='Agregar Participante'>
                        <i class='fa-solid fa-user-plus'></i>
                    </button>
                </td>
                <td></td>
            </tr>";

        $ultimoDoc = $row['id_documento'];
    }

    if($row['id_participante']){

        $botonEliminar = '';

        $total_participantes = $participantesPorDocumento[$row['id_documento']];

        if($total_participantes > 1){
            $botonEliminar = "<button class='eliminar-participante' title='Eliminar Participante'>
                                <i class='fa-solid fa-trash-can'></i>
                            </button>";
        }

        echo "<tr class='participante-fila' 
                data-iddocumento='{$row['id_documento']}' 
                data-idparticipante='{$row['id_participante']}'>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{$row['nombre']}</td>
            <td>{$row['identificacion']}</td>
            <td>{$row['tipo_persona']}</td>
            <td>{$row['nacionalidad']}</td>
            <td>{$row['calidad']}</td>
            <td>
                <button class='editar-participante' title='Modificar Participante'>
                    <i class='fa-solid fa-user-edit'></i>
                </button>
                $botonEliminar
            </td>
        </tr>";
    }
}

Database::disconnect();
?>
