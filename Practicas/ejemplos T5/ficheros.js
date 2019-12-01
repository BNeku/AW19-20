'use strict'

const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs"); //para read file
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
/*const multerFactory = multer({
    dest: path.join(__dirname, "uploads")
});*/
const multerFactory = multer({
    storage: multer.memoryStorage()
});
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aw2"
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
//app.use(multerFactory.none());


app.get("/", function (request, response) {
    response.status(200);
    response.redirect("formulario.html");
});

app.get("/imagen/:id", function (request, response) {
    let n = Number(request.params.id);
    if (isNaN(n)) {
        response.status(400);
        response.end("Petición incorrecta");
    } else {
        obtenerImagen(n, function (err, imagen) {
            if (imagen) {
                response.end(imagen);
            } else {
                response.status(404);
                response.end("Not found");
            }
        });
    }
});

app.post("/procesar_formulario", multerFactory.single("foto"), function (request, response) {
    let usuario = {
        nombre: request.body.nombre,
        apellidos: request.body.apellidos,
        fumador: request.body.fumador === "si" ? "Sí" : "No",
        imagen: null
    };
    if (request.file) {
        usuario.imagen = request.file.buffer;
    }
    insertarUsuario(usuario, function (err, newId) {
        if (!err) {
            usuario.id = newId;
            response.render("datosFormulario", usuario);
        }
    });
});

/*app.post("/procesar_formulario", function (request, response) {
     response.render("datosFormulario", {
         nombre: request.body.nombre,
         apellidos: request.body.apellidos,
         fumador: request.body.fumador === "si" ? "Sí" : "No"
     });
});*/

/* cuando no tenemos ficheros
app.post("/procesar_formulario",
    multerFactory.none(),
    function (request, response) {
        response.render("datosFormulario", {
            nombre: request.body.nombre,
            apellidos: request.body.apellidos,
            fumador: request.body.fumador === "si"
        });
    });*/

//cuando tenemos un fichero
/*
app.post("/procesar_formulario", multerFactory.single("foto"), function (request, response) {
    let nombreFichero = null;
    if (request.file) {
        nombreFichero = request.file.filename;
    }
    response.render("datosFormulario", {
        nombre: request.body.nombre,
        apellidos: request.body.apellidos,
        fumador: request.body.fumador === "si" ? "Sí" : "No",
        imagen: nombreFichero
    });
});*/

//manejador de ruta que envia la imagen
/*app.get("/imagen/:id", function (request, response) {
    let pathImg = path.join(__dirname, "uploads", request.params.id);
    response.sendFile(pathImg);
});*/



function insertarUsuario(usuario, callback) {
    pool.getConnection(function (err, con) {
        if (err) {
            callback(err);
        } else {
            let sql =
                "INSERT INTO personas(Nombre, Apellidos, Fumador, Foto) " +
                "VALUES (?, ?, ?, ?)";
            con.query(sql, [usuario.nombre, usuario.apellidos,
                    usuario.fumador, usuario.imagen
                ],
                function (err, result) {
                    con.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result.insertId);
                    }
                });
        }
    });
}

function obtenerImagen(id, callback) {
    pool.getConnection(function (err, con) {
        if (err) {
            callback(err);
        } else {
            let sql = "SELECT Foto FROM personas WHERE Id = ?";
            con.query(sql, [id], function (err, result) {
                con.release();
                if (err) {
                    callback(err);
                } else {
                    // Comprobar si existe una persona
                    // con el Id dado.
                    if (result.length === 0) {
                        callback("No existe");
                    } else {
                        callback(null, result[0].Foto);
                    }
                }
            });
        }
    });
}



/*
app.post("/procesar_formulario",
    multerFactory.single("foto"),
    function (request, response) {
        if (request.file) { // Si se ha subido un fichero
            console.log(`Fichero guardado en: ${request.file.path}`);
            console.log(`Tamaño: ${request.file.size}`);
            console.log(`Tipo de fichero: ${request.file.mimetype}`);
        }
        response.render("datosFormulario", {
            nombre: request.body.nombre,
            apellidos: request.body.apellidos,
            fumador: request.body.fumador === "si" ? "Sí" : "No"
        });
    });*/



app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});