const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

var pregunta = "¿Cuál es tu color favorito?";
var opciones = [{
        texto: "Rojo",
        numeroVotos: 0
    },
    {
        texto: "Azul",
        numeroVotos: 0
    },
    {
        texto: "Verde",
        numeroVotos: 0
    },
    {
        texto: "Ninguno de los anteriores",
        numeroVotos: 0
    }
];

app.get("/", function (request, response) {
    response.status(200);
    response.render("encuesta", {pregunta,opciones});
});

app.get("/procesarEncuesta_get.html", function (request, response) {
    var sumado=false;

    for(var i=0; i< opciones.length && !sumado;i++){
        if(opciones[i].texto == request.query.color){
            opciones[i].numeroVotos++;
            sumado=true;
        }
    }

    if(!sumado){
        opciones[opciones.length-1].numeroVotos++;
    }

    response.render("tabla", {pregunta,opciones});
});

app.use(middlewareNotFoundError);
app.use(middlewareServerError);

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});

function middlewareNotFoundError(request, response) {
    response.status(404);
    response.render("error404", {
        url: request.url
    });
    // envío de página 404
}

function middlewareServerError(error, request, response, next) {
    response.status(500);
    response.render("error500", {
        mensaje: error.message,
        pila: error.stack
    });
    // envío de página 500
}