// formulario.js
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser"); //20/11/2019

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

/*
app.get("/procesar_get.html", function (request, response) {
    console.log(request.query);
    // → { nombre: 'Juan Calvo',
    // edad: '34',
    // sexo: 'H',
    // fumador: 'ON' }
    response.end();
});*/
/*
app.get("/procesar_get.html", function (request, response) {
    let sexoStr = "No especificado";
    switch (request.query.sexo) {
        case "H":
            sexoStr = "Hombre";
            break;
        case "M":
            sexoStr = "Mujer";
            break;
    }
    //plantilla = inforForm
    response.render("infoForm", {
        nombre: request.query.nombre,
        edad: request.query.edad,
        sexo: sexoStr,
        fumador: (request.query.fumador === "ON" ? "Sí" : "No")
    });
});*/

app.post("/procesar_post.html", function (request, response) {
    let sexoStr = "No especificado";
    switch (request.body.sexo) {
        case "H":
            sexoStr = "Hombre";
            break;
        case "M":
            sexoStr = "Mujer";
            break;
    }
    response.render("infoForm", {
        nombre: request.body.nombre,
        edad: request.body.edad,
        sexo: sexoStr,
        fumador: (request.body.fumador === "ON" ? "Sí" : "No")
    });
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
    response.render("404", {
        url: request.url
    });
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