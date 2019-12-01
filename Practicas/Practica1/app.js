'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("./config");

/* DAOs */
const userDAO = require("./userDAO");

/* Frameworks */
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig); // Crear un pool de conexiones a la base de datos de MySQL
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs"); //para read file
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

/* setup */
app.set("view engine", "ejs"); //configurar ejs como motor de plantillas
app.set("views", path.join(__dirname, "views")); //directorio donde van a estas las vistas plantillas
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

/* POST - Sección para implementar las peticiones POST */


/* GET - Sección para implementar las peticiones GET */

app.get("/", function(request, response) {
    response.statusCode = 200;
    response.type("text/plain; charset=utf-8");
    response.redirect("/newUser.html")
});

/* Listener */
app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});