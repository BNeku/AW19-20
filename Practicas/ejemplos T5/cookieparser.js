'use strict'
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");//new

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));


app.use(cookieParser());

app.get("/reset", function (request, response) {
    response.status(200);
    response.cookie("contador", 0, {
        maxAge: 86400000
    });
    response.type("text/plain");
    response.end("Has reiniciado el contador");
});

app.get("/increment", function (request, response) {
    if (request.cookies.contador === undefined) {
        response.redirect("/reset.html");
    } else {
        let contador = Number(request.cookies.contador) + 1;
        response.cookie("contador", contador);
        response.status(200);
        response.type("text/plain");
        response.end(`El valor actual del contador es ${contador}`);
    }
});

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});