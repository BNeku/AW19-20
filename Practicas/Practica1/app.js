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

/*Middlewares */

function currentUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        next();
    } else {
        response.redirect("/login");
    }
}

/* GET - Sección para implementar las peticiones GET */

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("/login")
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
                usuario: data,
                amigo:false
            });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
        }
    });
});

app.get("/imagen/:id", currentUser, function (request, response) {
    userD.getUserImageName(request.params.id, function (err, img) {
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

app.get("/modify", currentUser, function (request, response) {

    userD.getPuntos(response.locals.userEmail, function (err, rdo) {
        if (err) {
            response.status(404);
            console.log(err + " modify");
        } else {
            response.status(200);
            response.render("modify", {
                puntos: rdo[0].puntos,
                msg: null
            });
        }
    });


});

app.get("/amigos", currentUser, function (request, response) {
    userD.getAmigos(response.locals.userEmail, function (err, rdo) {
        if (err) {
            response.status(404);
            console.log(err + "amigos");
        } else {
            response.status(200);
            if (rdo.length > 0) {
                var todo = utils.misAmigos(response.locals.userEmail, rdo);
                userD.getName(todo.amigos, function (err, rdo) {
                    if (err) {
                        response.status(404);
                        console.log(err + "amigos");
                    } else {
                        if (typeof (rdo) != "undefined") {
                            var friends = rdo;
                        } else {
                            var friends = null;
                        }

                        userD.getName(todo.solicitudes, function (err, rdo2) {
                            if (err) {
                                response.status(404);
                                console.log(err + "amigos");
                            } else {
                                response.render("amigos", {
                                    amigos: friends,
                                    solicitudes: rdo2
                                });
                            }
                        });
                    }
                });

            } else {
                response.render("amigos", {
                    amigos: null,
                    solicitudes: null
                });
            }
        }
    });
});

app.get("/aceptar/:emailAmigo", currentUser, function (request, response) {
    userD.aceptarAmistad(response.locals.userEmail, request.params.emailAmigo, function (err) {
        if (err) {
            response.status(404);
            console.log(err + "aceptar");
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

app.get("/rechazar/:emailAmigo", currentUser, function (request, response) {
    userD.rechazarAmistad(response.locals.userEmail, request.params.emailAmigo, function (err) {
        if (err) {
            response.status(404);
            console.log(err + "rechazar");
        } else {
            response.status(200);
            response.redirect("/amigos");
        }
    });
});

app.get("/buscar", currentUser, function (request, response) {
    userD.buscarUsuario(request.body.buscaAmigo, function (err, rdo) {
        if (err) {
            response.status(404);
            console.log(err + " buscar");
        } else {
            userD.getPuntos(response.locals.userEmail, function (err, puntos) {
                if (err) {
                    response.status(404);
                    console.log(err + " buscar");
                }else{
                    response.render("search_results", {
                        busqueda: request.body.buscaAmigo,
                        resultado:rdo,
                        puntos: puntos[0].puntos
                    });
                }
            });
            
        }
    });
});

app.get("/amigo/:email", currentUser, function(request,response){
    userD.getUser(request.params.email, function(data, success) {
        if (success) {
            response.status(200);
            response.render("profile", {
                usuario: data,
                amigo: true
            });
        } else {
            response.status(404);
            console.log("No se ha encontrado el usuario");
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
                response.redirect("/profile");
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
    if (user == false) {
        response.render("newUser", {
            msg: "Revisa completar los campos obligatorios(*)"
        });
    } else {
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

app.post("/post_modify", currentUser, multerFactory.single("photo"), function (request, response) {
    userD.getUser(response.locals.userEmail, function (data, success) {
        if (success) {
            var user = utils.modifyUserFromRequestBody(request, data);
            userD.getUserImageName(response.locals.userEmail, function (err, img) {
                if (err) {
                    response.status(404);
                    console.log(err + " post_modify");
                } else {
                    if (request.file) {
                        user.photo = request.file.filename;
                    } else {
                        user.photo = img[0].img;
                    }
                    userD.modifyUser(user, function (err, result) {
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

/* Listener */


app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});