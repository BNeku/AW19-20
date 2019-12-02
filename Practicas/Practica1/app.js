'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("./config");
const utils = require("./utils");

/* Frameworks */
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig); // Crear un pool de conexiones a la base de datos de MySQL
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs"); //para read file
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname, "uploads") });

/* setup */
app.set("view engine", "ejs"); //configurar ejs como motor de plantillas
app.set("views", path.join(__dirname, "views")); //directorio donde van a estas las vistas plantillas
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

/* DAOs */
const UserDAO = require("./UserDao");
const userDAO = new UserDAO(pool); // Crear una instancia de UserDAO

/* POST - Sección para implementar las peticiones POST */

app.post("/register", multerFactory.single("photo"), function(request, response) {
    var user = utils.createUserFromRequestBody(request);
    userDAO.insertUser(user, function(err, insertado) {
        if (err) {
            response.status(404);
            console.log("No se ha podido insertar el usuario");
        } else {
            if (insertado) {
                response.status(200);
                response.redirect("/newUser.html");
            } else {
                response.status(500);
            }
        }
    });
});

app.post("/procesar_login", function(request, response) {
    var user = utils.getUserFromRequestBody(request);
    userDAO.getUser(user, function(data, success) {
        if (success) {
            response.cookie("email", data.name, { maxAge: 86400000 });
            response.cookie("password", data.password, { maxAge: 86400000 });
            response.status(200);
            response.render("profile", { usuario: data });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
        }
    });
});

/* Middleware */
function userIsLogged(request, response, next) {
    if (request.cookies.email === undefined) {
        response.redirect("/login.html");
    } else {
        next();
    }
}

app.use(userIsLogged);

/* GET - Sección para implementar las peticiones GET */

app.get("/", function(request, response) {
    response.statusCode = 200;
    response.type("text/plain; charset=utf-8");
    response.redirect("/login.html")
});

app.get("/login", function(request, response) {
    response.statusCode = 200;
    response.type("text/plain; charset=utf-8");
    response.redirect("/login.html");
});

app.get("/profile", function(request, response) {
    let user = { email: request.cookies.email, password: request.cookies.password };
    userDAO.getUser(user, function(data, success) {
        if (success) {
            response.cookie("user_name", data.name, { maxAge: 86400000 });
            response.status(200);
            response.type("text/plain; charset=utf-8");
            response.render("profile", { usuario: data });
        } else {
            response.status(404);
            response.type("text/plain; charset=utf-8");
            console.log("No se ha encontrado el usuario");
        }
    });
});

/* Listener */
app.get("/imagen/:id", function(request, response) {
    let pathImg = path.join(__dirname, "uploads", request.params.id)
    response.sendFile(pathImg);
});

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});