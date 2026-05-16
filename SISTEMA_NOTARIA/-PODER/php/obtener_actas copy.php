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

$sql = "
SELECT DISTINCT
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
    pp.id_part_poder,
    pp.nombre_beneficiario
FROM documento d
JOIN tipo_documento td ON td.id_tipo = d.id_tipo AND td.nombre = 'ESCRITURAS PUBLICAS'
JOIN poder pd ON pd.id_documento = d.id_documento
LEFT JOIN participante p ON p.id_documento = d.id_documento
LEFT JOIN part_poder pp ON pp.id_documento = d.id_documento
WHERE " . implode(" AND ", $where) . "
ORDER BY 
    d.id_documento,
    CAST(split_part(d.numero, '/', 2) AS INT),
    CAST(split_part(d.numero, '/', 1) AS INT),
    p.id_participante,
    pp.id_part_poder
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$ultimoDoc = null;
$participantes_doc = [];
$beneficiarios_doc = [];

while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    $id_doc = $row['id_documento'];
    
    // Cuando cambia de documento
    if($id_doc !== $ultimoDoc){
        // Si no es el primer documento, mostrar los datos del anterior
        if($ultimoDoc !== null){
            mostrarDocumentoCompleto($ultimoDoc, $participantes_doc, $beneficiarios_doc);
        }
        
        // Reiniciar para nuevo documento
        $ultimoDoc = $id_doc;
        $participantes_doc = [];
        $beneficiarios_doc = [];
        
        // Guardar datos principales del documento
        $doc_data = [
            'numero' => $row['numero'],
            'fecha_documento' => $row['fecha_documento'],
            'tipo_poder' => $row['tipo_poder'],
            'testigos' => $row['testigos'],
            'cant_poderantes' => $row['cant_poderantes'],
            'cant_poderados' => $row['cant_poderados']
        ];
    }
    
    // Acumular participantes únicos
    if($row['id_participante'] && !isset($participantes_doc[$row['id_participante']])){
        $participantes_doc[$row['id_participante']] = [
            'nombre' => $row['nombre'],
            'identificacion' => $row['identificacion'],
            'tipo_persona' => $row['tipo_persona'],
            'nacionalidad' => $row['nacionalidad']
        ];
    }
    
    // Acumular beneficiarios únicos
    if($row['id_part_poder'] && !isset($beneficiarios_doc[$row['id_part_poder']])){
        $beneficiarios_doc[$row['id_part_poder']] = [
            'nombre_beneficiario' => $row['nombre_beneficiario']
        ];
    }
}

// Mostrar el último documento procesado
if($ultimoDoc !== null){
    mostrarDocumentoCompleto($ultimoDoc, $participantes_doc, $beneficiarios_doc);
}

// Función para mostrar documento con sus datos
function mostrarDocumentoCompleto($id_doc, $participantes, $beneficiarios) {
    global $doc_data;
    
    // Fila del documento
    echo "<tr class='documento-nuevo' data-iddocumento='{$id_doc}'>
            <td>{$doc_data['numero']}</td>
            <td>{$doc_data['fecha_documento']}</td>
            <td>{$doc_data['tipo_poder']}</td>
            <td>{$doc_data['testigos']}</td>
            <td>" . count($participantes) . "</td>
            <td>" . count($beneficiarios) . "</td>
            <td colspan='6'>
                <button class='editar-documento' title='Modificar Documento'>✏️</button>
                <button class='eliminar-documento' title='Eliminar Documento'><i class='fa-solid fa-trash-can'></i></button>
                <button class='agregar-participante' title='Agregar Participante'><i class='fa-solid fa-user-plus'></i></button>
            </td>
          </tr>";
    
    // Determinar máximo de filas
    $max_filas = max(count($participantes), count($beneficiarios), 1);
    $participantes_values = array_values($participantes);
    $beneficiarios_values = array_values($beneficiarios);
    
    // Mostrar filas combinadas
    for($i = 0; $i < $max_filas; $i++) {
        $p = $participantes_values[$i] ?? null;
        $b = $beneficiarios_values[$i] ?? null;
        
        echo "<tr class='participante-fila' data-iddocumento='{$id_doc}'>";
        
        // 6 celdas vacías para alineación
        echo "<td></td><td></td><td></td><td></td><td></td><td></td>";
        
        // Datos del participante
        echo "<td>" . ($p ? $p['nombre'] : '-.-') . "</td>";
        echo "<td>" . ($p ? $p['identificacion'] : '-.-') . "</td>";
        echo "<td>" . ($p ? $p['tipo_persona'] : '-.-') . "</td>";
        echo "<td>" . ($p ? $p['nacionalidad'] : '-.-') . "</td>";
        
        // Datos del beneficiario
        echo "<td>" . ($b ? $b['nombre_beneficiario'] : '-.-') . "</td>";
        
        // Acciones
        echo "<td>";
        if($p) {
            // Botones de acción para participantes
            $part_id = array_keys($participantes)[$i] ?? 0;
            echo "<button class='editar-participante' data-idparticipante='{$part_id}' title='Modificar Participante'><i class='fa-solid fa-user-edit'></i></button>";
            echo "<button class='eliminar-participante' data-idparticipante='{$part_id}' title='Eliminar Participante'><i class='fa-solid fa-trash-can'></i></button>";
        }
        echo "</td>";
        
        echo "</tr>";
    }
}

Database::disconnect();
?>