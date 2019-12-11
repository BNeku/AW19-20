$(function () {
    /* $("#listaElementos li").on("click", function (event) {
         // event.target contiene un elemento del DOM
         // Construir una selección a partir de él:
         let elementoPulsado = $(event.target);
         // Mostrar mensaje con el contenido del <li>:
         alert("Has hecho clic en " + elementoPulsado.text());
     });*/
    /*
        let contador = 3;
        $("#añadir").on("click", function () {
            contador++;
            let newElem = $(`<li>Elemento ${contador}</li>`);
            $("#listaElementos").append(newElem);
        });

        $("#listaElementos").on("click", "li", function (event) {
            // event.target contiene un elemento del DOM
            // Construir una selección a partir de él:
            let elementoPulsado = $(event.target);
            // Mostrar mensaje con el contenido del <li>:
            alert("Has hecho clic en " + elementoPulsado.text());
        });*/
    /*
        $("body").on("click", function () {
            console.log("Se ha pulsado en el cuerpo de la página");
        });
        $("#contenedor").on("click", function () {
            console.log("Se ha pulsado en la región externa");
            event.stopPropagation();
        });
        $("#region1").on("click", function () {
            console.log("Se ha pulsado en la región 1");
            event.stopPropagation();
        });
        $("#region2").on("click", function () {
            console.log("Se ha pulsado en la región 2");
            event.stopPropagation();
        });*/

   /* // Mostrar y ocultar completamente
    $("#superficie").fadeIn(2000).fadeOut(2000);
    // Mostrar y ocultar hasta el 50% de opacidad
    $("#superficie").fadeIn(2000).fadeTo(2000, 0.5);
    // Deslizamiento hacia abajo
    $("#superficie").slideDown(2000);
    // Deslizamiento hacia hacia arriba
    $("#superficie").fadeIn(2000).slideUp(2000);
*/
    // Desplazamiento y fundido simultáneos
    $("#superficie").show().css("position", "relative")
        .animate({
            top: "400px",
            opacity: "0"
        }, 2000);
});