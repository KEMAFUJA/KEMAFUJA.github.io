<?php
function incrementar($pdo, $id, $campo, $cantidad = 1){
    $sql = "UPDATE preguntas 
            SET $campo = $campo + :cantidad
            WHERE id_preg = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':cantidad' => $cantidad,
        ':id' => $id
    ]);
}

function control_incre($pdo, $id_documento, $tipo_documento, $id_tramite){
    $sql = "SELECT 
        c.tipo_pago, 
        c.beneficiarios, 
        c.municipio
        FROM certesc c 
        WHERE c.id_documento = :id_documento";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
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
            WHERE id_documento = :id_documento
            Group by id_documento
        )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_documento' => $id_documento
    ]);

    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $tipos_persona = [];
    $nacionalidades = [];

    foreach ($res as $fila) {
        $tipos_persona[] = $fila['tipo_persona'];
        $nacionalidades[] = $fila['nacionalidad'];
    }

   return $resultado_procesamiento = procesarPreguntas($pdo,[ 
        'tipo_documento' => $tipo_documento,
        'tipo_pago' => $resultado['tipo_pago'],
        'municipio' => $resultado['municipio'],
        'beneficiarios' => $resultado['beneficiarios'],
        'tramite' => ($id_tramite == 3) ? 'cant_cert' : 'cant_esc',
        'tipo_persona' => $tipos_persona,
        'pais' => $nacionalidades
    ]);

}

function procesarPreguntas($pdo, $data){
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

    $procesado = false;

    if($tipo_documento == "Compra/Venta"){
        $procesado = true; // Entró en el primer if
        /* Cant. Tramites */
        incrementar($pdo,13,$tramite);
        /* Cant. ben. final */
        incrementar($pdo,6,$tramite,$beneficiarios);

        foreach ($tipos_persona as $tipo){
        /* Cant. de nat. */
            if($tipo == "Natural"){
                incrementar($pdo,1,$tramite);
            }
        /* Cant. de jur. */
            if($tipo == "Jurídica"){
                incrementar($pdo,4,$tramite);
            }

        }

        if($nac > 0 && $ext > 0){
        /* Cant. entre nac. y ext. */
            incrementar($pdo,5,$tramite);
        }

        if($nac == 0 && $ext > 0){
        /* Cant. entre ext. */
            incrementar($pdo,7,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            incrementar($pdo,15,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            incrementar($pdo,11,$tramite);
        }

    }

    if($tipo_documento == "Sociedad"){
        $procesado = true; // Entró en el segundo if
        /* Cant. Tramites */
        incrementar($pdo,12,$tramite);
        /* Cant. ben. final */
        incrementar($pdo,9,$tramite,$beneficiarios);
        /* Cant. cli. aten. */
        incrementar($pdo,3,$tramite,$cantidad_nombre);

        foreach ($tipos_persona as $tipo){

            if($tipo == "Jurídica"){
        /* Cant. de jur. */
                incrementar($pdo,2,$tramite);
            }

        }

        if($nac > 0 && $ext > 0){
        /* Cant. entre nac. y ext. */
            incrementar($pdo,8,$tramite);
        }

        if($nac == 0 && $ext > 0){
        /* Cant. entre ext. */
            incrementar($pdo,10,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            incrementar($pdo,16,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            incrementar($pdo,14,$tramite);
        }

    }
    
    return $procesado;
}

function procesarPreguntasEsc($pdo, $data){
    $tipo_documento = $data['tipo_documento'] ?? '';
    $tipo_pago = $data['tipo_pago'] ?? '';
    $municipio = trim($data['municipio'] ?? '');
    $beneficiarios = ($data['beneficiarios']) === 'NT' ? 0 : $data['beneficiarios'];
    $tramite = $data['tramite'] ?? 'cant_cert';
    
    $uif = $data['UIF'] ?? [];
    $per_nat = $uif['cv-1'] ?? 0;
    $per_jur = $uif['cv-4'] ?? 0;
    $tram_entre_nac_ext = isset($uif['cv-5']) ? 1 : 0;
    $tram_entre_ext = isset($uif['cv-7']) ? 1 : 0;
   
    $procesado = false;

    if($tipo_documento == "Compra/Venta"){
        $procesado = true; // Entró en el primer if
        /* Cant. Tramites */
        incrementar($pdo,13,$tramite);
        /* Cant. ben. final */
        incrementar($pdo,6,$tramite, $beneficiarios);
        /* Cant. de nat. */
        incrementar($pdo,1,$tramite, $per_nat);
        /* Cant. de jur. */
        incrementar($pdo,4,$tramite, $per_jur);

        if($tram_entre_nac_ext==1){
        /* Cant. entre nac. y ext. */
            incrementar($pdo,5,$tramite);
        }

        if($tram_entre_ext==1){
        /* Cant. entre ext. */
            incrementar($pdo,7,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            incrementar($pdo,15,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            incrementar($pdo,11,$tramite);
        }

    }

    $cant_per = $uif['soc-3'] ?? 0;
    $cant_jur = $uif['soc-2'] ?? 0;
    $tram_entre_nac_ext = isset($uif['soc-8']) ? 1 : 0;
    $tram_entre_ext = isset($uif['soc-10']) ? 1 : 0;
    

    if($tipo_documento == "Sociedad"){
        $procesado = true; // Entró en el segundo if
        /* Cant. Tramites */
        incrementar($pdo,12,$tramite);
        /* Cant. ben. final */
        incrementar($pdo,9,$tramite,$beneficiarios);
        /* Cant. cli. aten. */
        incrementar($pdo,3,$tramite,$cant_per);
        /* Cant. de jur. */
        incrementar($pdo,2,$tramite, $cant_jur);
        
        if($tram_entre_nac_ext){
        /* Cant. entre nac. y ext. */
            incrementar($pdo,8,$tramite);
        }

        if($tram_entre_ext){
        /* Cant. entre ext. */
            incrementar($pdo,10,$tramite);
        }

        if($tipo_pago == "Efectivo"){
        /* Cant. tram. efec. */
            incrementar($pdo,16,$tramite);
        }

        if($municipio != "Santa Cruz - Santa Cruz de la Sierra"){
        /* Cant. tram. fuera del municipio */
            incrementar($pdo,14,$tramite);
        }

    }
    
    return $procesado;
}