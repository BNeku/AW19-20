/*
$(function () {
    $("#campoNumero").on("change", function () {
        // Obtenemos valor actual
        let valor = $(event.target).prop("value").trim();
        if (valor === "") {
            //$("#mensaje").text("El campo está vacío");
            //para poner etiquetas html y que no se escriban, en vez de .text hay que utiliar .html
            //$("#mensaje").text("El campo está <em>vacío</em>");
            $("#mensaje").html("El campo está <em>vacío</em>");

        } else if (isNaN(Number(valor))) {
            $("#mensaje").text("No se ha introducido un número");
        } else {
            $("#mensaje").text("");
        }
    });
});
*/
/*
$(function () {
    // Al pulsar el botón Incrementar, se incrementan la propiedad
    // 'number' del párrafo.
    $("#incrementar").on("click", function () {
        let elemento = $("#elem");
        let num = elemento.data("number");
        elemento.data("number", num + 1);
    });

    // Al pulsar el botón Obtener, se muestra el valor actual de la
    // propiedad 'number' del párrafo
    $("#obtener").on("click", function () {
        alert($("#elem").data("number"));
    });

});

$(function () {
    $("#añadirElemento").on("click", function () {
        let nuevoElemento = $("<li>Nuevo elemento</li>");
        $("#listaNumerada").append(nuevoElemento);
    });
});

// Actualiza la etiqueta de la esquina superior derecha con las
// dimensiones del elemento pasado como parámetro
function actualizarEtiqueta(elem) {
    let ancho = Math.round(elem.width());
    let alto = Math.round(elem.height());
    $("div.tamaño").text(`${ancho} x ${alto}`);
}*/
/*
$(function () {
    let parrafo = $("div.parrafo");
    actualizarEtiqueta(parrafo);
    // Cuando se pulsa el botón de aumentar anchura...
    $("#aumentarAnchura").on("click", function () {
        // Obtenemos la anchura actual y establecemos la nueva
        let anchoActual = parrafo.width();
        parrafo.width(anchoActual + 20);
        // Actualizamos la etiqueta con la nueva dimensión
        actualizarEtiqueta(parrafo);
    });
});*/

const IZQUIERDA = 37;
const DERECHA = 39;
const ARRIBA = 38;
const ABAJO = 40;

$(function () {
    let parrafo = $("div.parrafo");
    $("body").on("keydown", function (event) {
        let incremento = {
            x: 0,
            y: 0
        };
        switch (event.which) {
            case IZQUIERDA:
                incremento.x = -1;
                break;
            case DERECHA:
                incremento.x = 1;
                break;
            case ARRIBA:
                incremento.y = -1;
                break;
            case ABAJO:
                incremento.y = 1;
                break;
        }
        let current = parrafo.offset();
        parrafo.offset({
            left: current.left + incremento.x,
            top: current.top + incremento.y
        });
        event.preventDefault();
    });
});

$(function () {
    $("#superficie").on("mouseenter", function () {
        $("#posicion").show();
    });
    $("#superficie").on("mouseleave", function () {
        $("#posicion").hide();
    });
    $("#superficie").on("mousemove", function (event) {
        $("#posicion").text(
            `${event.pageX} x ${event.pageY}`
        );
    });
});

$(function () {
    $(document).on("keydown", function (event) {
        $(".indicador").removeClass("activo");
        $("#codigoTecla").text(event.which);
        if (event.ctrlKey) {
            $("#ctrl").addClass("activo");
        }
        if (event.metaKey) {
            $("#meta").addClass("activo");
        }
        if (event.altKey) {
            $("#alt").addClass("activo");
        }
        if (event.shiftKey) {
            $("#shift").addClass("activo");
        }
        event.preventDefault();
    });
});