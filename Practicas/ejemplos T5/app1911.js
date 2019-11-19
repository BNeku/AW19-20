// app.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

app.get("/usuarios", function (request, response, next) {
    fs.readFile("./ejemplos T5/noexiste.txt", function (err, contenido) {
        if (err) {
            next(err);
        } else {
            request.contenido = contenido;
        }
    });
});

// Manejador del error
/*app.use(function (error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error", {
        mensaje: error.message,
        pila: error.stack
    });
});*/

app.use(middlewareNotFoundError);
app.use(middlewareServerError);

function middlewareNotFoundError(request, response) {
    response.status(404);
    response.render("404", { url: request.url });
    // envío de página 404
}

function middlewareServerError(error, request, response, next) {
    response.status(500);
    response.render("error", {
        mensaje: error.message,
        pila: error.stack
    });
    // envío de página 500
}

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});