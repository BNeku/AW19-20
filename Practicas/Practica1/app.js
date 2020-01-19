'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("./config");
const utils = require("./utils");

const userRouter = require('./routes/userRouter');
const friendsRouter = require('./routes/friendsRouter');
const questionsRouter = require('./routes/questionsRouter');

/* Frameworks */
const logger = require("morgan");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig); // Crear un pool de conexiones a la base de datos de MySQL
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs"); //para read file
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const multerFactory = multer({
    dest: path.join(__dirname, "public/img")
});
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middlewareSession = session({
    saveUninitialized: false,

    secret: "foobar34",
    resave: false,
    store: sessionStore
});

/* setup */
app.set("view engine", "ejs"); //configurar ejs como motor de plantillas
app.set("views", path.join(__dirname, "views")); //directorio donde van a estas las vistas plantillas
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(middlewareSession);
app.use(logger('dev'));

app.use('/', userRouter);
app.use('/login', userRouter);
app.use('/amigos', friendsRouter);
app.use('/preguntas', questionsRouter);

/* DAOs */
const UserDAO = require("./userDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

/*Middlewares */

function currentUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.puntos = request.session.puntos;
        next();
    } else {
        response.redirect("/login");
    }
}

/* GET - Sección para obtener imágenes */

app.get("/imagen/:id", currentUser, function(request, response) {
    userD.getUserImageName(request.params.id, function(err, img) {
        if (err) {
            response.status(500);
            console.log("imagenUsuario\n" + err);
        } else {
            if (img[0].img == null) {
                response.sendFile(path.join(__dirname, "/public/img", "NoPerfil.png"));
            } else {

                response.sendFile(path.join(__dirname, "/public/img", img[0].img));
            }
        }
    });
});

// Captura error 404.
app.use(function(req, res, next) {
    var error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Error Handler.
app.use(function(error, request, response, next) {
    if (error.status == 404) {
        response.render("error404", {
            url: request.url
        });
    } else {
        response.render("error500", {
            mensaje: error.message,
            pila: error.stack
        });
    }
});

/* Listener */

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});