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

function root(request, response) {
    response.status(200);
    response.redirect("/login")
}

function login(request, response) {
    response.status(200);
    if (request.session.currentUser != null) {
        response.redirect("/profile");
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
}

function register(request, response) {
    response.status(200);
    response.render("newUser", {
        msg: null
    });
}

function profile(request, response) {
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
            next(new Error("Not Found"));
        }
    });
}

function modify(request, response) {
    response.status(200);
    response.render("modify", {
        puntos: response.locals.puntos,
        msg: null
    });
}

function logout(request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
}

function procesarLogin(request, response) {
    userD.isUserCorrect(request.body.email, request.body.password, function(err, existe) {
        if (err) {
            response.status(500);
            console.log("login post\n" + err);
            next(err);
        } else {
            response.status(200);
            if (existe) {
                request.session.currentUser = request.body.email;
                userD.getPuntos(request.body.email, function(err, puntos) {
                    if (err) {
                        console.log("login post\n" + err);
                        next(err);
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
}

function registerWithPhoto(request, response) {
    var user = utils.createUserFromRequestBody(request);
    if (user == false) {
        response.render("newUser", {
            msg: "Revisa completar los campos obligatorios(*)"
        });
    } else {
        userD.insertUser(user, function(err, insertado) {
            if (err) {
                response.status(500);
                console.log(err + "post register");
                next(err);
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
}

function modifyProfile(request, response) {
    userD.getUser(response.locals.userEmail, function(data, success) {
        if (success) {
            var user = utils.modifyUserFromRequestBody(request, data);
            userD.getUserImageName(response.locals.userEmail, function(err, img) {
                if (err) {
                    response.status(500);
                    console.log(err + " post_modify");
                    next(err);
                } else {
                    if (request.file) {
                        user.photo = request.file.filename;
                    } else {
                        user.photo = img[0].img;
                    }
                    userD.modifyUser(user, function(err, result) {
                        if (err) {
                            response.status(500);
                            console.log(err + " post_modify");
                            next(err);
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
            next(new Error("Not Found"));
        }
    });
}

module.exports = {
    root,
    login,
    register,
    profile,
    modify,
    logout,
    procesarLogin,
    registerWithPhoto,
    modifyProfile
}