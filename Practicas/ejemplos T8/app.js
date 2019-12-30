'use strict'

const express = require("express");
const app = express();
const path = require("path");
let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let agenda = [{
        nombre: "Juan",
        telefono: "89731982"
    },
    {
        nombre: "Carmen",
        telefono: "28329828"
    },
    {
        nombre: "David",
        telefono: "827272728"
    }
];

app.get("/factorial/:num", function (request, response) {
    let numero = Number(request.params.num);
    if (!isNaN(numero) && numero >= 0) {
        // Cálculo del factorial
        let f = 1;
        for (let i = 2; i <= numero; i++) {
            f *= i;
        }
        // Devolución del resultado
        response.json({
            result: f
        });
    } else {
        response.status(400);
        response.end();
    }
});
/*
app.get("/contactos", function (request, response) {
    // Por defecto se devuelve el código 200, por
    // lo que no hace falta indicarlo mediante el
    // método response.status().
    response.json(agenda);
});

app.get("/contactos/:indice", function (request, response) {
    let indice = Number(request.params.indice);
    if (!isNaN(indice) && agenda[indice] !== undefined) {
        // El parámetro "indice" es un número y
        // está dentro de los límites del array.
        // Se devuelve el elemento correspondiente.
        let elem = agenda[indice];
        response.json(elem);
    } else {
        // En caso contrario, se devuelve el error 404
        response.status(404);
        response.end();
    }
});

// Áñadir contactos
app.post("/contactos", function (request, response) {
    let nuevoElemento = request.body;
    agenda.push(nuevoElemento);
    response.status(201);
    response.end();
});

//NUEVOS

app.delete("/contactos/:indice", function (request, response) {
    let indice = Number(request.params.indice);
    if (!isNaN(indice) && agenda[indice] !== undefined) {
        agenda.splice(indice, 1);
        // Código 200 = OK
        response.status(200);
    } else {
        // Error 404 = Not found
        response.status(404);
    }
    response.end();
});

app.put("/contactos/:indice", function (request, response) {
    let indice = Number(request.params.indice);
    if (!isNaN(indice) && agenda[indice] !== undefined) {
        agenda[indice] = request.body;
    } else {
        // Error 404 = Not Found
        response.status(404);
    }
    response.end();
});*/

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});