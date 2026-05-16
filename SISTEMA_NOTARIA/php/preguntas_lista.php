<?php
function decrementar($pdo, $id, $campo, $cantidad = 1){
    $sql = "UPDATE preguntas 
            SET $campo = GREATEST(0, $campo - :cantidad)
            WHERE id_preg = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':cantidad' => $cantidad,
        ':id' => $id
    ]);
}

function control_decre($pdo, $id_participante, $id_documento, $tipo_documento, $id_tramite){
        $sql = "SELECT 
            c.id_documento,
            c.tipo_pago, 
            c.beneficiarios, 
            c.municipio
        FROM participante p
        JOIN certesc c ON p.id_documento = c.id_documento
        WHERE p.id_documento = :id_documento or p.id_participante= :id_participante
        Group by c.id_documento,
            c.tipo_pago, 
            c.beneficiarios, 
            c.municipio";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_participante' => $id_participante,
        ':id_documento' => $id_documento
    ]);

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);


    $sql = "SELECT 
            tipo_persona, 
            nacionalidad
        FROM participante
        WHERE id_documento = (
            SELECT id_documento 
            FROM participante 
            WHERE id_participante = :id_participante
        ) OR id_documento = :id_documento";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_participante' => $id_participante,
        ':id_documento' => $id_documento
    ]);

    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $tipos_persona = [];
    $nacionalidades = [];

    foreach ($res as $fila) {
        $tipos_persona[] = $fila['tipo_persona'];
        $nacionalidades[] = $fila['nacionalidad'];
    }

    procesarPreguntas_lista($pdo,[ 
        'tipo_documento' => $tipo_documento,
        'tipo_pago' => $resultado['tipo_pago'],
        'municipio' => $resultado['municipio'],
        'beneficiarios' => $resultado['beneficiarios'],
        'tramite' => ($id_tramite === 3)? 'cant_cert' : 'cant_esc',
        'tipo_persona' => $tipos_persona,
        'pais' => $nacionalidades
    ]);
}

function procesarPreguntas_lista($pdo, $data){
    $tipo_documento = $data['tipo_documento'] ?? '';
    $tipo_pago = $data['tipo_pago'] ?? '';
    $municipio = trim($data['municipio'] ?? '');
    $beneficiarios = ($data['beneficiarios']) === 'NT' ? 0 : $data['beneficiarios'];
    $tramite = $data['tramite'] ?? 'cant_cert';
    $tipos_persona = $data['tipo_persona'] ?? [];
    $nacionalidades = $data['pais'] ?? [];
    $cantidad_nombre = count($tipos_persona);

    $nac = 0;
    $ext = 0;

    foreach ($nacionalidades as $pais){
        if(strtoupper($pais) == "BOLIVIA"){
            $nac++;
        }else{
            $ext++;
        }
    }

    if($tipo_documento == "Compra/Venta"){
        /* Cant. Tramites */
        decrementar($pdo,13,$tramite);
        /* Cant. ben. final */
        decrementar($pdo,6,$tramite,$beneficiarios);

        foreach ($tipos_persona as $tipo){
        /* Cant. de nat. */
            if($tipo == "Natural"){
                decrementar($pdo,1,$tramite);
            }
        /* Cant. de jur. */
            if($tipo == "Jurídica"){
                decrementar($pdo,4,$tramite);
            }

        }

        if($nac > 0 && $ext > 0){
        /* Cant. entre nac. y ext. */
            decrementar($pdo,5,$tramite);
        }

        if($nac == 0 && $ext > 0){
        /* Cant. entre ext. */
            decrementar($pdo,7,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            decrementar($pdo,15,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            decrementar($pdo,11,$tramite);
        }

    }

    if($tipo_documento == "Sociedad"){
        /* Cant. Tramites */
        decrementar($pdo,12,$tramite);
        /* Cant. ben. final */
        decrementar($pdo,9,$tramite,$beneficiarios);
        /* Cant. cli. aten. */
        decrementar($pdo,3,$tramite,$cantidad_nombre);

        foreach ($tipos_persona as $tipo){

            if($tipo == "Jurídica"){
        /* Cant. de jur. */
                decrementar($pdo,2,$tramite);
            }

        }

        if($nac > 0 && $ext > 0){
        /* Cant. entre nac. y ext. */
            decrementar($pdo,8,$tramite);
        }

        if($nac == 0 && $ext > 0){
        /* Cant. entre ext. */
            decrementar($pdo,10,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            decrementar($pdo,16,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            decrementar($pdo,14,$tramite);
        }

    }

}