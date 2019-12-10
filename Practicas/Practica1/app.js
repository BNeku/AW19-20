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


/* DAOs */
const UserDAO = require("./userDao");
const userD = new UserDAO(pool); // Crear una instancia de UserDAO

const PreguntaDAO = require("./preguntaDao");
const preguntaDAO = new PreguntaDAO(pool); // Crear una instancia de PreguntaDao

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

app.get("/", function(request, response) {
    response.status(200);
    response.redirect("/login")
});

app.get("/login", function(request, response) {
    response.status(200);
    if (request.session.currentUser != null) {
        response.redirect("/profile");
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
});

app.get("/register", function(request, response) {
    response.status(200);
    response.render("newUser", {
        msg: null
    });
});

app.get("/profile", currentUser, function(request, response) {
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

app.get("/modify", currentUser, function(request, response) {
    response.status(200);
    response.render("modify", {
        puntos: response.locals.puntos,
        msg: null


    });
});

app.get("/amigos", currentUser, function(request, response) {
    userD.getAmigos(response.locals.userEmail, function(err, rdo) {
        if (err) {
            response.status(404);
            console.log(err + "amigos");
        } else {
            response.status(200);
            if (rdo.length > 0) {
                var todo = utils.misAmigos(response.locals.userEmail, rdo);
                userD.getName(todo.amigos, function(err, rdo) {
                    if (err) {
                        response.status(404);
                        console.log(err + "amigos");
                    } else {
                        var friends = rdo;
                        if (typeof(rdo) == "undefined") {
                            var friends = null;
                        }

                        userD.getName(todo.solicitudes, function(err, rdo2) {
                            if (err) {
                                response.status(404);
                                console.log(err + "amigos");
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

app.get("/aceptar/:emailAmigo", currentUser, function(request, response) {
    userD.aceptarAmistad(response.locals.userEmail, request.params.emailAmigo, function(err) {
        if (err) {
            response.status(404);
            console.log(err + "aceptar");
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

app.get("/rechazar/:emailAmigo", currentUser, function(request, response) {
    userD.rechazarAmistad(response.locals.userEmail, request.params.emailAmigo, function(err) {
        if (err) {
            response.status(404);
            console.log(err + "rechazar");
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

app.get("/amigo/:email", currentUser, function(request, response) {
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
        }
    });
});

app.get("/buscar", currentUser, function(request, response) {
    userD.buscarUsuario(response.locals.userEmail, request.query.buscaAmigo, function(err, rdo) {
        if (err) {
            response.status(404);
            console.log(err + " buscar");
        } else {
            response.render("search_results", {
                busqueda: request.body.buscaAmigo,
                resultado: rdo,
                puntos: response.locals.puntos
            });
        }
    });
});

app.get("/solicitar_amistad/:id", currentUser, function(request, response) {
    userD.solicitarAmistad(request.params.id, response.locals.userEmail, function(err) {
        if (err) {
            response.status(404);
            console.log(err + " solicitar amistad");
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

app.get("/preguntas", currentUser, function(request, response) {
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

app.get("/crearPregunta", currentUser, function(request, response) {
    response.status(200);
    response.render("createQuestion");
});

app.get("/pregunta/:id", currentUser, function(request, response) {
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

app.get("/contestar_pregunta/:id", currentUser, function(request, response) {
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

app.get("/adivinar_respuesta/:id/:email", currentUser, function(request, response) {
    preguntaDAO.getPreguntaConRespuestasById(request.params.id, function(err, resultadoPregunta) {
        if (err || resultadoPregunta.length == 0) {
            response.status(404);
            console.log(err + "adivinar_respuesta/:id");
        } else {
            preguntaDAO.getRespuestaUsuarioByPreguntaId(request.params.id, request.params.email, function(err, resultadoRespuesta) {
                if (err || resultadoRespuesta.length == 0) {
                    response.status(404);
                    console.log(err + "adivinar_respuesta/:id");
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

                    respuestas = respuestas.sort(function() { return Math.random() - 0.5 });

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

app.get("/logout", currentUser, function(request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

/* POST - Sección para implementar las peticiones POST */

app.post("/procesar_login", function(request, response) {
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

app.post("/register", multerFactory.single("photo"), function(request, response) {
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

app.post("/post_modify", currentUser, multerFactory.single("photo"), function(request, response) {
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


app.post("/procesar_crear_pregunta", function(request, response) {
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
            response.status(404);
            console.log("insertPregunta\n" + err);
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

app.post("/procesar_respuesta", currentUser, function(request, response) {
    if (request.body.respuesta.length == 0) {
        response.status(500);
        response.end();
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
            } else {
                response.status(200);
                response.redirect("/preguntas");
            }
        });
    }
});

app.post("/procesar_adivinar", currentUser, function(request, response) {
    var respuesta = [response.locals.userEmail,
        request.body.idAmigo,
        request.body.preguntaId, (request.body.idRespuestaAmigo == request.body.respuesta)
    ];

    preguntaDAO.insertAdivinaRespuesta(respuesta, function(err, resultado) {
        if (err || resultado.length == 0) {
            response.status(404);
            console.log(err + " procesar_respuesta");
        } else {
            response.status(200);
            response.redirect("/preguntas");
        }
    });
});

/* Listener */

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});