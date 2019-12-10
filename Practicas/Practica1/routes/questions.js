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
const PreguntaDAO = require("../preguntaDao");
const preguntaDAO = new PreguntaDAO(pool); // Crear una instancia de PreguntaDao

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

/** /preguntas */
router.get("/", currentUser, function(request, response) {
    preguntaDAO.getPreguntas(function(err, preguntas) {
        if (err) {
            response.status(404);
        } else {
            response.status(200);
            response.render("questions", {
                preguntas: preguntas,
                puntos: response.locals.puntos
            });
        }
    });
});

router.get("/crearPregunta", currentUser, function(request, response) {
    response.status(200);
    response.render("createQuestion");
});

router.get("/pregunta/:id", currentUser, function(request, response) {
    preguntaDAO.getPregunta(request.params.id, response.locals.userEmail, function(err, resultado) {
        if (err || resultado.preguntas.length == 0) {
            response.status(404);
            console.log(err + " pregunta/:id");
        } else {
            //coger amigos que han respondido
            userD.getAmigos(response.locals.userEmail, function(err, amigos) {
                if (err) {
                    response.status(404);
                    console.log(err + "amigos");
                } else {
                    if (amigos.length > 0) {
                        var todo = utils.misAmigos(response.locals.userEmail, amigos);
                        if (todo.amigos.length > 0) {
                            preguntaDAO.getAmigosByPreguntaId(request.params.id, todo.amigos, function(err, amigosRespondido) {
                                if (err) {
                                    response.status(404);
                                    console.log(err + " pregunta/:id getamigos");
                                } else {
                                    if (amigosRespondido.length > 0) {
                                        preguntaDAO.getPreguntaAdivinada(response.locals.userEmail, request.params.id, amigosRespondido, function(err, adivinadas) {
                                            if (err) {
                                                response.status(404);
                                                console.log(err + " pregunta/:id getamigos");
                                            } else {
                                                userD.getName(amigosRespondido, function(err, nombres) {
                                                    if (err) {
                                                        response.status(404);
                                                        console.log(err + " pregunta/:id getamigos nombres");
                                                    } else {
                                                        response.status(200);
                                                        var final = utils.montarAmigosAdivinados(nombres, adivinadas);
                                                        response.render("pregunta", {
                                                            haSidoRespondidaPorElUsuario: resultado.haSidoRespondidaPorElUsuario,
                                                            pregunta: resultado.preguntas[0],
                                                            amigos: final,
                                                            puntos: response.locals.puntos
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    } else {
                                        response.status(200);
                                        response.render("pregunta", {
                                            haSidoRespondidaPorElUsuario: resultado.haSidoRespondidaPorElUsuario,
                                            pregunta: resultado.preguntas[0],
                                            amigos: null,
                                            puntos: response.locals.puntos
                                        });
                                    }
                                }
                            });
                        } else {
                            response.status(200);
                            response.render("pregunta", {
                                haSidoRespondidaPorElUsuario: resultado.haSidoRespondidaPorElUsuario,
                                pregunta: resultado.preguntas[0],
                                amigos: null,
                                puntos: response.locals.puntos
                            });

                        }

                    } else {
                        response.status(200);
                        response.render("pregunta", {
                            haSidoRespondidaPorElUsuario: resultado.haSidoRespondidaPorElUsuario,
                            pregunta: resultado.preguntas[0],
                            amigos: null,
                            puntos: response.locals.puntos
                        });
                    }
                }
            });



        }
    });
});

router.get("/contestar_pregunta/:id", currentUser, function(request, response) {
    preguntaDAO.getPreguntaConRespuestasById(request.params.id, function(err, resultado) {
        if (err || resultado.length == 0) {
            response.status(404);
            console.log(err + " contestar_pregunta/:id");
        } else {
            response.status(200);
            response.render("contestar_pregunta", {
                pregunta: {
                    preguntaId: resultado[0].preguntaId,
                    pregunta: resultado[0].preguntaTitle,
                },
                respuestas: resultado,
                puntos: response.locals.puntos
            });
        }
    });
});

router.get("/adivinar_respuesta/:id/:email", currentUser, function(request, response) {
    preguntaDAO.getPreguntaConRespuestasById(request.params.id, function(err, resultadoPregunta) {
        if (err || resultadoPregunta.length == 0) {
            response.status(404);
            console.log(err + "adivinar_respuesta/:id");
            next(err);
        } else {
            preguntaDAO.getRespuestaUsuarioByPreguntaId(request.params.id, request.params.email, function(err, resultadoRespuesta) {
                if (err || resultadoRespuesta.length == 0) {
                    response.status(404);
                    console.log(err + "adivinar_respuesta/:id");
                    next(err);
                } else {
                    response.status(200);

                    var respuestasIniciales = resultadoPregunta.filter(value => value.esRespuestaInicial === 1);
                    var respuestaCorrecta = resultadoPregunta.filter(value => value.respuestaId === resultadoRespuesta[0].respuestaId);

                    var respuestas = [respuestaCorrecta[0]];

                    while (respuestas.length < respuestasIniciales.length) {
                        var index = Math.floor(Math.random() * respuestasIniciales.length);
                        var respuestaSeleccionada = respuestasIniciales[index];

                        if (respuestaSeleccionada.respuestaId != respuestaCorrecta.respuestaId) {
                            if (respuestas.filter(value => value.respuestaId === respuestaSeleccionada.respuestaId).length == 0) {
                                respuestas.push(respuestaSeleccionada);
                            }
                        }
                    }

                    respuestas = respuestas.sort(function() {
                        return Math.random() - 0.5
                    });

                    var pregunta = {
                        pregunta: resultadoPregunta[0].preguntaTitle,
                        preguntaId: resultadoPregunta[0].preguntaId,
                        idAmigo: request.params.email,
                        idRespuestaAmigo: resultadoRespuesta[0].respuestaId
                    };

                    response.render("adivinar_respuesta", {
                        pregunta: pregunta,
                        respuestas: respuestas,
                        puntos: response.locals.puntos
                    });
                }
            });
        }
    });
});

/* POST - Sección para implementar las peticiones POST */

router.post("/procesar_crear_pregunta", function(request, response) {
    var respuestas = [];

    if (request.body.respuesta1.length > 0) {
        respuestas.push(request.body.respuesta1);
    }

    if (request.body.respuesta2.length > 0) {
        respuestas.push(request.body.respuesta2);
    }

    if (request.body.respuesta3.length > 0) {
        respuestas.push(request.body.respuesta3);
    }

    if (request.body.pregunta.length == 0 || respuestas.length == 0) {
        response.status(422);
        return;
    }

    var nuevaPregunta = {
        pregunta: request.body.pregunta,
        respuestas: respuestas
    }

    preguntaDAO.insertPregunta(nuevaPregunta, function(err, success) {
        if (err) {
            response.status(500);
            console.log("insertPregunta\n" + err);
            next(err);
        } else {
            response.status(200);
            if (success) {
                response.redirect("/preguntas");
            } else {
                response.status(404);
                console.log("insertPregunta\n" + err);
            }
        }
    });
});

router.post("/procesar_respuesta", currentUser, function(request, response) {
    if (request.body.respuesta.length == 0) {
        response.status(500);
        next(err);
        return;
    }

    if (request.body.respuesta[0] === "-1") {
        var respuesta = {
            preguntaId: request.body.preguntaId,
            respuesta: request.body.respuesta[1],
            email: response.locals.userEmail,
        };

        preguntaDAO.insertOtraRespuestaUsuario(respuesta, function(err, resultado) {
            if (err || resultado.length == 0) {
                response.status(404);
                console.log(err + " procesar_respuesta");
                next(err);
            } else {
                response.status(200);
                response.redirect("/preguntas");
            }
        });
    } else {
        var respuesta = {
            preguntaId: request.body.preguntaId,
            respuestaId: request.body.respuesta[0],
            email: response.locals.userEmail,
        };

        preguntaDAO.insertRespuestaUsuario(respuesta, function(err, resultado) {
            if (err || resultado.length == 0) {
                response.status(404);
                console.log(err + " procesar_respuesta");
                next(err);
            } else {
                response.status(200);
                response.redirect("/preguntas");
            }
        });
    }
});

router.post("/procesar_adivinar", currentUser, function(request, response) {
    var acierta = (request.body.idRespuestaAmigo == request.body.respuesta);
    var respuesta = [response.locals.userEmail,
        request.body.idAmigo,
        request.body.preguntaId, acierta
    ];

    preguntaDAO.insertAdivinaRespuesta(respuesta, function(err, resultado) {
        if (err || resultado.length == 0) {
            response.status(404);
            console.log(err + " procesar_respuesta");
            next(err);
        } else {
            response.status(200);
            var puntos = response.locals.puntos;
            if (acierta) {
                puntos += 10;
                userD.actualizaPuntos(response.locals.userEmail, puntos, function(err) {
                    if (err) {
                        response.status(404);
                        console.log(err + " procesar_respuesta");
                    } else {
                        request.session.puntos = puntos;
                        response.redirect("/preguntas");
                    }
                });
            } else {
                response.redirect("/preguntas");
            }

        }
    });
});

module.exports = router;