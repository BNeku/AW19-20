"use strict";
const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

let usuarios = [ "Javier Montoro", "Dolores Vega", "Beatriz Nito"];

app.get("/", function (request, response) {
    response.status(200);
    response.render("usuarios", {usuarios});
});

app.get("/borrar/:indice", function (request, response) {
    response.status(200);

    usuarios.splice(request.params.indice, 1);

    for(var i=0; i<usuarios.length;i++){
        usuarios[i].indice--;
    }

    response.render("usuarios", {usuarios});
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