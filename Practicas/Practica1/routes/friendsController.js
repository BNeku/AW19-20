'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("../config");
const utils = require("../utils");

const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig); // Crear un pool de conexiones a la base de datos de MySQL

/* DAOs */
const UserDAO = require("../userDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

/** setup Router */
const express = require('express');

function amigos(request, response) {
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
}

function aceptarAmigo(request, response) {
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
}

function rechazarAmigo(request, response) {
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
}

function mostrarPerfilAmigo(request, response) {
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
}

function buscarAmigo(request, response) {
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
}

function solicitarAmistad(request, response) {
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
}

module.exports = {
    amigos,
    aceptarAmigo,
    rechazarAmigo,
    mostrarPerfilAmigo,
    buscarAmigo,
    solicitarAmistad
}