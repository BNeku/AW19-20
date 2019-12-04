let candadoAbierto = true;

function cambiarCandado() {
    candadoAbierto = !candadoAbierto;
    if (candadoAbierto) {
        $("#candado").prop("src", "candadoAbierto.png");
    } else {
        $("#candado").prop("src", "candadoCerrado.png");
    }
}
$(function () {
    $("#botonAbrirCerrar").on("click", cambiarCandado);
});

function mostrarInfo() {
    let edad = $("#campoEdad").prop("value");
    let fumador = $("#campoFumador").prop("checked");
    alert(`Tienes ${edad} años y ` +
        `${fumador ? '' : 'no'} eres fumador`);
}

$(function () {
    $("#botonComprobarFormulario").on("click", mostrarInfo);
});

$(function () {
    let cabecera = $("h1");
    cabecera.on("click", function () {
        cabecera.toggleClass("rojo");
    });
});

function abrirVentana() {
    $("#ventana").show();
}

function cerrarVentana() {
    $("#ventana").hide();
}
$(function () {
    $("#mostrarVentana").on("click", abrirVentana);
    $("#ventana span.cerrar").on("click", cerrarVentana);
    $("#cerrar").on("click", cerrarVentana);
});