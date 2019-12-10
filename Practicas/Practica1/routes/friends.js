'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("../config");
const utils = require("../utils");

/** setup Router */
const express = require('express');
var router = express.Router();

/** setupDB */
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);

/* DAOs */
const UserDAO = require("../userDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

/** Frameworks */

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

//Amigos
router.get("/", currentUser, function(request, response) {
    userD.getAmigos(response.locals.userEmail, function(err, rdo) {
        if (err) {
            response.status(500);
            console.log(err + "amigos");
            next(err);
        } else {
            response.status(200);
            if (rdo.length > 0) {
                var todo = utils.misAmigos(response.locals.userEmail, rdo);
                userD.getName(todo.amigos, function(err, rdo) {
                    if (err) {
                        response.status(500);
                        console.log(err + "amigos");
                        next(err);
                    } else {
                        var friends = rdo;
                        if (typeof(rdo) == "undefined") {
                            var friends = null;
                        }

                        userD.getName(todo.solicitudes, function(err, rdo2) {
                            if (err) {
                                response.status(500);
                                console.log(err + "amigos");
                                next(err);
                            } else {
                                response.render("amigos", {
                                    amigos: friends,
                                    solicitudes: rdo2,
                                    puntos: response.locals.puntos
                                });
                            }
                        });
                    }
                });

            } else {
                response.render("amigos", {
                    amigos: null,
                    solicitudes: null,
                    puntos: response.locals.puntos
                });
            }
        }
    });
});

router.get("/aceptar/:emailAmigo", currentUser, function(request, response) {
    userD.aceptarAmistad(response.locals.userEmail, request.params.emailAmigo, function(err) {
        if (err) {
            response.status(500);
            console.log(err + "aceptar");
            next(err);
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

router.get("/rechazar/:emailAmigo", currentUser, function(request, response) {
    userD.rechazarAmistad(response.locals.userEmail, request.params.emailAmigo, function(err) {
        if (err) {
            response.status(500);
            console.log(err + "rechazar");
            next(err);
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

router.get('/amigo/:email', currentUser, function(request, response) {
    userD.getUser(request.params.email, function(data, success) {
        if (success) {
            response.status(200);
            response.render("profile", {
                usuario: data,
                amigo: true,
                puntos: response.locals.puntos
            });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
            next(err);
        }
    });
});

router.get("/buscar", currentUser, function(request, response) {
    userD.buscarUsuario(response.locals.userEmail, request.query.buscaAmigo, function(err, rdo) {
        if (err) {
            response.status(500);
            console.log(err + " buscar");
            next(err);
        } else {
            response.render("search_results", {
                busqueda: request.body.buscaAmigo,
                resultado: rdo,
                puntos: response.locals.puntos
            });
        }
    });
});

router.get("/solicitar_amistad/:id", currentUser, function(request, response) {
    userD.solicitarAmistad(request.params.id, response.locals.userEmail, function(err) {
        if (err) {
            response.status(500);
            console.log(err + " solicitar amistad");
            next(err);
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

module.exports = router;