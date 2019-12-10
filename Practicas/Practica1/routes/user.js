'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("../config");
const utils = require("../utils");

/** setup Router */
const express = require('express');
let router = express.Router();

/** setupDB */
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

/* DAOs */
const UserDAO = require("../userDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

/** Frameworks */
const path = require("path");
const fs = require("fs"); //para read file
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const multerFactory = multer({
    dest: "../public/img"
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

/* GET - Sección para implementar las peticiones GET */

router.get("/", function(request, response) {
    response.status(200);
    response.redirect("/login")
});

router.get("/login", function(request, response) {
    response.status(200);
    if (request.session.currentUser != null) {
        response.redirect("/profile");
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
});

router.get("/register", function(request, response) {
    response.status(200);
    response.render("newUser", {
        msg: null
    });
});

router.get("/profile", currentUser, function(request, response) {
    userD.getUser(response.locals.userEmail, function(data, success) {
        if (success) {
            response.status(200);

            response.render("profile", {
                usuario: data,
                amigo: false
            });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
        }
    });
});

router.get("/modify", currentUser, function(request, response) {
    response.status(200);
    response.render("modify", {
        puntos: response.locals.puntos,
        msg: null
    });
});

router.get("/logout", currentUser, function(request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

/* POST - Sección para implementar las peticiones POST */

router.post("/procesar_login", function(request, response) {
    userD.isUserCorrect(request.body.email, request.body.password, function(err, existe) {
        if (err) {
            response.status(404);
            console.log("login post\n" + err);
        } else {
            response.status(200);
            if (existe) {
                request.session.currentUser = request.body.email;
                userD.getPuntos(request.body.email, function(err, puntos) {
                    if (err) {
                        response.status(404);
                        console.log("login post\n" + err);
                    } else {
                        request.session.puntos = puntos[0].puntos;
                        response.redirect("/profile");
                    }
                });

            } else {
                response.render("login", {
                    errorMsg: "Dirección de correo y/o contraseña no válidos"
                });
            }
        }
    });

});

router.post("/register", multerFactory.single("photo"), function(request, response) {
    var user = utils.createUserFromRequestBody(request);
    if (user == false) {
        response.render("newUser", {
            msg: "Revisa completar los campos obligatorios(*)"
        });
    } else {
        userD.insertUser(user, function(err, insertado) {
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

router.post("/post_modify", currentUser, multerFactory.single("photo"), function(request, response) {
    userD.getUser(response.locals.userEmail, function(data, success) {
        if (success) {
            var user = utils.modifyUserFromRequestBody(request, data);
            userD.getUserImageName(response.locals.userEmail, function(err, img) {
                if (err) {
                    response.status(404);
                    console.log(err + " post_modify");
                } else {
                    if (request.file) {
                        user.photo = request.file.filename;
                    } else {
                        user.photo = img[0].img;
                    }
                    userD.modifyUser(user, function(err, result) {
                        if (err) {
                            response.status(404);
                            console.log(err + " post_modify");
                        } else {
                            response.status(200);
                            if (result) {
                                response.render("modify", {
                                    puntos: user.puntos,
                                    msg: "Cambios realizados"
                                })
                            } else {
                                response.render("modify", {
                                    puntos: user.puntos,
                                    msg: "No se ha podido realizar los cambios"
                                })
                            }
                        }
                    });
                }
            });

        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
        }
    });
});



module.exports = router;