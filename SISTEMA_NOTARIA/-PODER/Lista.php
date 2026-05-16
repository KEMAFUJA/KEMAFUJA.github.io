<html lang="es">
<head>
<meta charset="UTF-8">
<title>Listado Poder</title>
<link rel="stylesheet" href="../css/estilo.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

<h1>LISTA <strong>PODER</strong></h1>
<button class="button" id="Lista" onclick="window.location.href='./'">Volver</button>
<div id="filtro-anios" style="margin-bottom:15px;"></div>
<div id="mensaje-vacio">No se hallaron coincidencias 🔍</div>
<table id="tablaActas">
<thead>
<tr>
    <th data-col="0">Número <span></span></th>
    <th data-col="1">Fecha <span></span></th>
    <th data-col="2">Tipo de Poder <span></span></th>
    <th data-col="3">Testigos <span></span></th>
    <th data-col="4">Cant. Pod. <span></span></th>
    <th data-col="5">Cant. Podt. <span></span></th>
    <th>Nombre</th>
    <th>Identificación</th>
    <th>Tipo Persona</th>
    <th>Nacionalidad</th>
    <th>Nombre Beneficiarios</th>
    <th>Acciones</th>
</tr>

<tr class="fila-filtros">
    <th><input data-filtro="numero" placeholder="Numero"></th>
    <th><input data-filtro="fecha" placeholder="Año Mes Dia"></th>
    <th>
        <select data-filtro="tipo_poder">
            <option value="">Todos</option>
            <option value="COMPRA/VENTA">COMPRA/VENTA</option>
            <option value="ASOCIACION">ASOCIACION</option>
        </select>
    </th>
    <th><input data-filtro="testigos" placeholder="Cantidad"></th>
    <th><input data-filtro="cant_poderante" placeholder="Cantidad"></th>
    <th><input data-filtro="cant_poderados" placeholder="Cantidad"></th>

    <th><input data-filtro="nombre" placeholder="Nombre"></th>
    <th><input data-filtro="identificacion" placeholder="Identificacion"></th>
    <th>
        <select data-filtro="tipo">
            <option value="">Todos</option>
            <option value="NATURAL">NATURAL</option>
            <option value="JURIDICA">JURIDICA</option>
        </select>
    </th>
    <th><input data-filtro="nacionalidad" placeholder="Gentilicio"></th>
    <th><input data-filtro="nombre_beneficiarios" placeholder="Nombre"></th>    
    <th></th>
</tr>
</thead>
<tbody><!-- Aquí se cargarán las actas mediante JS --></tbody>
</table>

<script src="../js/agregar3.js"></script>
<script src="../js/eliminar2.js"></script>
<script src="../js/modificar2.js"></script>
<script src="../js/orden.js"></script>
<script src="js/filtros.js"></script>
<script src="../js/gentilicios_lista.js"></script>
<script src="../js/municipios_lista.js"></script>
<script src="js/filtros_anual.js"></script>

</body>
</html>
