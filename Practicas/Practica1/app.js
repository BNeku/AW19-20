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
const multerFactory = multer({
    dest: path.join(__dirname, "uploads")
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


/* DAOs */
const UserDAO = require("./UserDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

/*Middlewares */

function currentUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        next();
    } else {
        response.redirect("login");
    }
}

/* GET - Sección para implementar las peticiones GET */

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("login")
});

app.get("/login", function (request, response) {
    response.status(200);
    if (request.session.currentUser != null) {
        response.redirect("/profile");
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
});

app.get("/register", function (request, response) {
    response.status(200);
    response.render("newUser", {
        msg: null
    });
});

app.get("/profile", currentUser, function (request, response) {
    userD.getUser(response.locals.userEmail, function (data, success) {
        if (success) {
            response.status(200);
            response.render("profile", {
                usuario: data
            });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
        }
    });
});

app.get("/imagen/:id", currentUser, function (request, response) {
    userD.getUserImageName(response.locals.userEmail, function (err, img) {
        if (err) {
            response.status(500);
            console.log("imagenUsuario\n" + err);
        } else {
            if (img[0].img == null) {
                response.sendFile(path.join(__dirname, "/public/img", "NoPerfil.png"));
            } else {
                response.sendFile(path.join(__dirname, "uploads", request.params.id));
            }
        }
    });
});

app.get("/logout", currentUser, function (request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

/* POST - Sección para implementar las peticiones POST */

app.post("/procesar_login", function (request, response) {
    userD.isUserCorrect(request.body.email, request.body.password, function (err, existe) {
        if (err) {
            response.status(404);
            console.log("login post\n" + err);
        } else {
            response.status(200);
            if (existe) {
                request.session.currentUser = request.body.email;
                response.redirect("profile");
            } else {
                response.render("login", {
                    errorMsg: "Dirección de correo y/o contraseña no válidos"
                });
            }
        }
    });

});

app.post("/register", multerFactory.single("photo"), function (request, response) {
    var user = utils.createUserFromRequestBody(request);
    if(user == false){
        response.render("newUser", {
            msg: "Revisa completar los campos obligatorios(*)"
        });
    }else{
        userD.insertUser(user, function (err, insertado) {
            if (err) {
                response.status(404);
                console.log(err + "post register");
            } else {
                response.status(200);
                if (insertado) {
                    response.render("newUser", {
                        msg: "Usuario creado. Pulse Entrar para loguearte"
                    });
                } else {
                    response.render("newUser", {
                        msg: "Error al crear el usuario"
                    });
                }
            }
        });
    }
    
});




/* Listener */


app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});