"use strict";
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
app.use(morgan("dev"));

// La variable ficherosEstaticos guarda el // nombre del directorio donde se encuentran // los ficheros estáticos:
// <directorioProyecto>/public
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

var usuarios = [{ nombre: "Javier Montoro", numero: "6123456" }, { nombre: "Dolores Vega", numero: "654321" }, { nombre: "Javier Montoro", numero: "098765" }];
var views = ["/users", "/usuarios", "/socios"];

function logger(request, response, next) {
    console.log(`Recibida petición ${request.method} ` +
        `en ${request.url} de ${request.ip}`);
    // Saltar al siguiente middleware
    next();
}

function showViewIfExist(request, response, next) {
    if (views.indexOf(request.url) >= 0) {
        response.status(200);
        response.render("usuarios", { users: usuarios });
        response.end();
    } else {
        next();
    }
}

function notFound(request, response, next) {
    response.status(404);
    response.render("error404", { url: request.url });
    response.end();
}

app.use(logger);
app.use(showViewIfExist);
app.use(notFound);

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});