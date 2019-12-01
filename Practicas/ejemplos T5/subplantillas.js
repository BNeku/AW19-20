'use strict'
//instalar ejs, express, body-parser, cookie-parser, express-session
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs"); //para read file
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

var usuarios = [{
        nombre: "Francisco",
        apellidos: "Flores Blanco"
    },
    {
        nombre: "Elena",
        apellidos: "Nito del Bosque"
    },
    {
        nombre: "Germán",
        apellidos: "Gómez Gómez"
    }
]
app.get("/pag3", function (request, response) {
    response.status(200);
    response.render("view3", {
        usuarios: usuarios
    });
});

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});