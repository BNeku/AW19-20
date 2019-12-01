"use strict";

const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

//configurar ejs como motor de plantillas
app.set("view engine", "ejs");
//directorio donde van a estas las vistas plantillas
app.set("views", path.join(__dirname, "views"));
/*
en views estan las plantiilas
 ____________________
|directorio proyecto |
|____________________|  ____________
                    |__|node_modules|
                    |  |____________|
                    |   ______
                    |__|public|
            ______  |  |______|
           |views|__|       |___*.html
           |_____|  |       |  _____
                    |       |__|css|
   (app.js) index.js|       |  |___|
                            |   ___
                            |__|img|
                               |___|                             
*/

app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "bienvenido.html"))
});


//response es lo que tú envias a la pagina
/*
app.get("/", function (request, response) {
    response.status(200);
    response.type("text/plain; charset=utf-8");
    response.end("Esta es la página raíz");
});*/
/*
app.get("/users", function (request, response) {
    response.status(200);
    response.type("text/plain; charset=utf-8");
    response.end("Aquí se mostrará la página de usuarios");
});*/

var usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];

app.get("/users", function(request, response) {
    response.status(200);
    //render es para enviar los datos a la plantillas
    //primer dato, nombre de la plantilla
    //segundo dato, modelo de datos que enviamos a la plantilla
    response.render("users", {
        users: usuarios
    });
    // Busca la plantilla "views/users.ejs"
    // La variable 'users' que hay dentro de esta plantilla tomará
    // el valor del array 'usuarios'.
});

app.get("/users.html", function(request, response) {
    response.redirect("/users");
});


let ipsCensuradas = ["147.96.81.244", "145.2.34.23"];

function logger(request, response, next) {
    console.log(`Recibida petición ${request.method} ` +
        `en ${request.url} de ${request.ip}`);
    // Saltar al siguiente middleware
    next();
}

function ipCensurada(request, response, next) {
    // Comprobar si la IP de la petición está dentro de la
    // lista de IPs censuradas.
    if (ipsCensuradas.indexOf(request.ip) >= 0) {
        // Si está censurada, se devuelve el código 401 (Unauthorized
        response.status(401);
        response.end("No autorizado"); // TERMINA LA RESPUESTA
    } else {
        // En caso contrario, se pasa el control al siguiente middlew
        console.log("IP autorizada");
        next();
    }
}

function ipUCM(request, response, next) {
    request.esUCM = request.ip.startsWith("147.96.");
    next();
}

//EL ORDEN IMPORTA
app.use(logger);
app.use(ipCensurada);
app.use(ipUCM);

app.get("/index.html", function(request, response) {
    response.status(200);
    response.type("text/plain; encoding=utf-8");
    response.write("¡Hola!");
    if (request.esUCM) {
        response.write("Estás conectado desde la UCM");
    }
    response.end();
});

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});