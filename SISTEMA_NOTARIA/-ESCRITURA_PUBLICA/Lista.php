<html lang="es">
<head>
<meta charset="UTF-8">
<title>Listado Esc. Pública</title>
<link rel="stylesheet" href="../css/estilo.css">
<link rel="stylesheet" href="../css/estilocertesc.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

<h1>LISTA <strong>ESCRITURA PÚBLICA</strong></h1>
<button class="button" id="Lista" onclick="window.location.href='./'">Volver</button>
<div id="filtro-anios" style="margin-bottom:15px;"></div>
<div id="mensaje-vacio">No se hallaron coincidencias 🔍</div>
<div class="tabla-container">
<table id="tablaActas">
<thead>
<tr>
    <th data-col="0">Número <span></span></th>
    <th data-col="1">Fecha <span></span></th>
    <th data-col="2">Documento <span></span></th>
    <th data-col="3">Tipo de Doc. <span></span></th>
    <th data-col="4">Tipo de Venta <span></span></th>
    <th data-col="5">Benef. <span></span></th>
    <th data-col="6">Tipo de Pago/Trato <span></span></th>
    <th data-col="7">Municipio <span></span></th>
    <th>Nombre</th>
    <th>Identificación</th>
    <th>Tipo Persona</th>
    <th>Nacionalidad</th>
    <th>Calidad</th>
    <th>Acciones</th>
    <th data-col="14">Municipio <span></span></th>
    <th data-col="15">Municipio <span></span></th>
    <th data-col="16">Municipio <span></span></th>
    <th data-col="17">Municipio <span></span></th>
    <th data-col="18">Municipio <span></span></th>
    <th data-col="19">Municipio <span></span></th>
    <th data-col="20">Municipio <span></span></th>
</tr>

<tr class="fila-filtros">
    <th><input data-filtro="numero" placeholder="Numero"></th>
    <th><input data-filtro="fecha" placeholder="Año Mes Dia"></th>
    <th><input data-filtro="documento" placeholder="Titulo"></th>
    <th>
        <select data-filtro="tipo_doc">
            <option value="">Todos</option>
            <option value="Compra/Venta">COMPRA/VENTA</option>
            <option value="Sociedad">SOCIEDAD</option>
        </select>
    </th>
    <th>
        <select data-filtro="tipo_venta">
            <option value="">Todos</option>
            <option value="Mueble">Mueble</option>
            <option value="Inmueble">Inmueble</option>
        </select>
    </th>
    <th>
        <select data-filtro="beneficiarios">
            <option value="">Todos</option>
            <option value="NT">No tiene</option>
            <option value=">0">Si tienen</option>
        </select>
    </th>
    
    <th>
        <select data-filtro="tipo_pago">
            <option value="">Todos</option>
            <option value="Ninguno">Ninguno</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Creacion">Creacion</option>
            <option value="Modificacion">Modificacion</option>
            <option value="Extincion">Extincion</option>
        </select>
    </th>
    <th><input data-filtro="municipio" placeholder="Municipio"></th>
    <th><input data-filtro="nombre" placeholder="Nombre"></th>
    <th><input data-filtro="identificacion" placeholder="Identificacion"></th>
    <th>
        <select data-filtro="tipo">
            <option value="">Todos</option>
            <option value="Natural">NATURAL</option>
            <option value="Juridíca">JURIDÍCA</option>
        </select>
    </th>
    <th><input data-filtro="nacionalidad" placeholder="Gentilicio"></th>
    <th><input data-filtro="calidad" placeholder="Calidad"></th>
    
    <th></th>
</tr>
</thead>
<tbody><!-- Aquí se cargarán las actas mediante JS --></tbody>
</table>
</div>

<script src="../js/agregar2.js"></script>
<script src="../js/eliminar2.js"></script>
<script src="../js/modificar2.js"></script>

<script src="../js/orden.js"></script>
<script src="js/filtros.js"></script>
<script src="../js/gentilicios_lista.js"></script>
<script src="../js/municipios_lista.js"></script>
<script src="js/filtros_anual.js"></script>


</body>
</html>
