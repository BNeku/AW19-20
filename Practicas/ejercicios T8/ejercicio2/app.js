'use strict'

const express = require("express");
const app = express();
const path = require("path");
let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var records = [{
        nombre: "Fran",
        puntos: 955
    },
    {
        nombre: "Rafael",
        puntos: 865
    },
    {
        nombre: "Carmen",
        puntos: 563
    },
    {
        nombre: "Rosario",
        puntos: 534
    },
    {
        nombre: "Juan",
        puntos: 234
    },
    {
        nombre: "Estela",
        puntos: 107
    },
];

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});