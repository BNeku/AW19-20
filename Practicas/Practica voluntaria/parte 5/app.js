// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
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

function currentUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        next();
    } else {
        response.render("login", {
            errorMsg: null
        });
    }
}


// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks y DAOUsers
const daoT = new DAOTasks(pool);
const daoU = new DAOUsers(pool);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(middlewareSession);

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("/login");
});

app.get("/login", currentUser, function (request, response) {
    response.status(200);
    if (response.locals.userEmail != null) {
        response.redirect("/tasks");
    }

});

app.post("/login", function (request, response) {
    daoU.isUserCorrect(request.body.email, request.body.pass, function (err, existe) {
        if (err) {
            response.status(404);
            console.log("login post\n" + err);
        } else {
            response.status(200);
            if (existe) {
                request.session.currentUser = request.body.email;
                response.redirect("tasks");
            } else {
                response.render("login", {
                    errorMsg: "Dirección de correo y/o contraseña no válidos"
                });
            }
        }
    });
});

app.get("/imagenUsuario", currentUser, function (request, response) {
    daoU.getUserImageName(response.locals.userEmail, function (err, img) {
        if (err) {
            response.status(500);
            console.log("imagenUsuario\n" + err);
        } else {
            if (img[0].img == null) {
                response.sendFile(path.join(__dirname, "/public/img", "NoPerfil.png"));
            } else {
                response.sendFile(path.join(__dirname, "profile_imgs", img[0].img));
            }
        }
    });
});

app.get("/tasks", currentUser, function (request, response) {

    daoT.getAllTasks(response.locals.userEmail, function (error, tareas) {
        if (error) {
            response.status(500);
            console.log("tasksget\n" + error);
        } else {
            response.status(200);
            response.render("tasks", {
                user: response.locals.userEmail,
                tareas: tareas
            });
        }
    });

});

//añadir tareas
app.post("/addTask", currentUser, function (request, response) {
    var task = utils.createTask(request.body.task);
    daoT.insertTask(response.locals.userEmail, task, function (err, insertado) {
        if (err) {
            response.status(404);
            console.log("addTasks\n" + err);
        } else {
            if (insertado) {
                response.status(200);
                response.redirect("/tasks");
            } else {
                response.status(500);
                console.log("addtaskpost, no insertada tarea");
            }

        }
    });

});

//marcar finalizadas
app.get("/finish/:idTask", function (request, response) {
    daoT.markTaskDone(request.params.idTask, function (err) {
        if (err) {
            response.status(404);
            console.log("finishid\n" + err);
        } else {
            response.status(200);
            response.redirect("/tasks");
        }
    });
});

//borrar tareas completadas
app.get("/deletedCompleted", currentUser, function (request, response) {
    daoT.deleteCompleted(response.locals.userEmail, function (err) {
        if (err) {
            response.status(404);
            console.log("deletedCompleted\n" + err)
        } else {
            response.status(200);
            response.redirect("/tasks");
        }
    });
});

app.get("/logout", currentUser, function (request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});