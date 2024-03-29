$(function () {
    // Cada vez que se pulse el botón de 'Enviar'
    $("#botonEnviar").on("click", function () {
        // Obtener el valor contenido en el cuadro de texto
        let valor = $("#cuadroTexto").val();
        // Realizar la petición al servidor
        $.ajax({
            method: "GET",
            url: "/factorial/ " + valor,
            // En caso de éxito, mostrar el resultado
            // en el documento HTML
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                $("#resultado").text(
                    "El resultado es " + data.result);
            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });
    });
});