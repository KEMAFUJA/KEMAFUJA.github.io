<?php
require_once '../../conexion.php';
$pdo = Database::connect();

// Recibir filtros desde GET
$filtros = [
    'numero' => $_GET['numero'] ?? '',
    'fecha' => $_GET['fecha'] ?? '',
    'tipo_poder' => $_GET['tipo_poder'] ?? '',
    'testigos' => $_GET['testigos'] ?? '',
    'cant_poderante' => $_GET['cant_poderante'] ?? '',
    'cant_poderados' => $_GET['cant_poderados'] ?? '',
    
    'nombre' => $_GET['nombre'] ?? '',
    'identificacion' => $_GET['identificacion'] ?? '',
    'tipo_persona' => $_GET['tipo'] ?? '',
    'nacionalidad' => $_GET['nacionalidad'] ?? '',
    'nombre_beneficiarios' => $_GET['nombre_beneficiarios'] ?? '',
];

// Ordenamiento dinámico
$orderCol = $_GET['orderCol'] ?? 'numero';   // columna por defecto
$orderDir = $_GET['orderDir'] ?? 'ASC';      // dirección por defecto

$orderSQL = "CAST(split_part(d.numero, '/', 2) AS INT), CAST(split_part(d.numero, '/', 1) AS INT)"; 
if ($orderCol === 'fecha') $orderSQL = "d.fecha_documento $orderDir";

if ($orderCol === 'tipo_poder') $orderSQL = "pd.tipo_poder $orderDir";
if ($orderCol === 'testigos') $orderSQL = "pd.testigos $orderDir";

// Preparar condiciones dinámicas
$where = ["td.nombre = 'PODER'"];
$params = [];


if ($filtros['tipo_poder'] !== '') {
    $where[] = "pd.tipo_poder ILIKE ?";
    $params[] = "%{$filtros['tipo_poder']}%";
}
if ($filtros['testigos'] !== '') {
    $where[] = "pd.testigos LIKE ?";
    $params[] = "%{$filtros['testigos']}%";
}
if ($filtros['cant_poderante'] !== '') {
    $where[] = "pd.cant_poderante ILIKE ?";
    $params[] = "%{$filtros['cant_poderante']}%";
}
if ($filtros['cant_poderados'] !== '') {
    $where[] = "pd.cant_poderados ILIKE ?";
    $params[] = "%{$filtros['cant_poderados']}%";
}

if ($filtros['numero'] !== '') {
    $where[] = "d.numero LIKE ?";
    $params[] = "%{$filtros['numero']}%";
}
if ($filtros['fecha'] !== '') {

    $f = trim($filtros['fecha']);

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $f)) {
        // yyyy-mm-dd exacto
        $where[] = "d.fecha_documento = ?";
        $params[] = $f;

    } elseif (preg_match('/^\d{4}$/', $f)) {
        // año
        $where[] = "EXTRACT(YEAR FROM d.fecha_documento) = ?";
        $params[] = $f;

    } elseif (preg_match('/^\d{1,2}$/', $f)) {
        // día o mes
        $where[] = "(EXTRACT(DAY FROM d.fecha_documento) = ? OR EXTRACT(MONTH FROM d.fecha_documento) = ?)";
        $params[] = $f;
        $params[] = $f;
    }

}

if ($filtros['nombre_beneficiarios'] !== '') {
    $where[] = "pp.id_documento IN (
        SELECT id_documento FROM part_poder 
        WHERE nombre_beneficiario ILIKE ?
    )";
    $params[] = "%{$filtros['nombre_beneficiarios']}%";
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


// Consulta con LEFT JOIN para mantener todos los documentos aunque no tengan participantes filtrados
$sql = "
SELECT
    d.id_documento,
    d.numero,
    d.fecha_documento,
    pd.tipo_poder,
	pd.testigos,
	pd.cant_poderantes,
	pd.cant_poderados,
	
	p.id_participante,
    p.nombre,
    p.identificacion,
    p.tipo_persona,
    p.nacionalidad,
    pp.nombre_beneficiario
FROM documento d
JOIN tipo_documento td
    ON td.id_tipo = d.id_tipo
JOIN participante p
    ON p.id_documento = d.id_documento
JOIN poder pd
    ON pd.id_documento = d.id_documento
LEFT JOIN part_poder pp
    ON pp.id_documento = d.id_documento
WHERE " . implode(" AND ", $where) . "
ORDER BY 
    CAST(split_part(d.numero, '/', 2) AS INT),
    CAST(split_part(d.numero, '/', 1) AS INT)
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);


$ultimoDoc = null;
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    if($row['id_documento'] !== $ultimoDoc){
        echo "<tr class='documento-nuevo' data-iddocumento='{$row['id_documento']}'>
                <td>{$row['numero']}</td>
                <td>{$row['fecha_documento']}</td>
                <td>{$row['tipo_poder']}</td>
                <td>{$row['testigos']}</td>
                <td>{$row['cant_poderantes']}</td>
                <td>{$row['cant_poderados']}</td>
                <td colspan='5'>
                    <!--button class='editar-documento'><i class='fa-solid fa-edit'></i></button>
                    <button class='editar-documento'><i class='fa-solid fa-pencil'></i></button-->
                    <button class='editar-documento' title='Modificar Documento'>✏️</button>

                    <!--button class='eliminar-documento'><i class='fa-solid fa-trash'></i></button-->
                    <button class='eliminar-documento' title='Eliminar Documento'><i class='fa-solid fa-trash-can'></i></button>
                    <!--button class='eliminar-documento'><i class='fa-solid fa-times'></i></button>
                    <button class='eliminar-documento'>🗑️</button-->
                    
                    <!--button class='agregar-participante'><i class='fa-solid fa-plus'></i></button-->
                    <button class='agregar-participante' title='Agregar Participante'><i class='fa-solid fa-user-plus'></i></button>
                    <!--button class='agregar-participante'><i class='fa-solid fa-plus-square'></i></button>
                    <button class='agregar-participante'>➕</button-->
                </td>
            </tr>";
        $ultimoDoc = $row['id_documento'];
    }

    if($row['id_participante']){
        echo "<tr class='participante-fila' data-iddocumento='{$row['id_documento']}' data-idparticipante='{$row['id_participante']}'>
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
            <td>{$row['nombre_beneficiario']}</td>
            <td>
                <button class='editar-participante' title='Modificar Participante'><i class='fa-solid fa-user-edit'></i></button>
                <button class='eliminar-participante' title='Eliminar Participante'><i class='fa-solid fa-trash-can'></i></button>
            </td>
        </tr>";
    }
}


Database::disconnect();
?>
