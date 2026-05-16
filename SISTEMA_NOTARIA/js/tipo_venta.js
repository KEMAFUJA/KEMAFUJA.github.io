    const tipoDocumento = document.getElementById("tipo_documento");
    const tipoVenta = document.getElementById("contenedor_tipo_venta");
    const tipoTrato = document.getElementById("contenedor_tipo_trato");
    const tipoPago = document.getElementById("contenedor_tipo_pago");
    const beneficiario = document.getElementById("contenedor_beneficiarios");

    const selectTipoPago = document.querySelector('select[name="tipo_pago"]');
    const selectTipoVenta = document.querySelector('select[name="tipo_venta"]');
    const selectTipoTrato = document.querySelector('select[name="tipo_trato"]');

    tipoDocumento.addEventListener("change", function(){

        if(this.value === "Compra/Venta"){
            tipoTrato.style.display = "none";
            selectTipoTrato.value = "Ninguno";
            
            tipoVenta.style.display = "inline-block";
            tipoPago.style.display = "inline-block";
            beneficiario.style.display = "inline-block";
            
        } else if(this.value === "Sociedad"){
            tipoVenta.style.display = "none";
            selectTipoVenta.value = "Mueble";

            tipoTrato.style.display = "inline-block";
            tipoPago.style.display = "inline-block";
            beneficiario.style.display = "inline-block";

        } else {
            tipoVenta.style.display = "none";
            tipoPago.style.display = "none";
            beneficiario.style.display = "none";
            tipoTrato.style.display = "none";

            selectTipoPago.value = "Ninguno";
            selectTipoVenta.value = "Mueble";
            selectTipoTrato.value = "Ninguno";

        }

    });

