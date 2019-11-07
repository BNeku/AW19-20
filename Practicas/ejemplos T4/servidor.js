"use strict";
/*
const http = require("http");
// Establecimiento de la función callback del servidor
const servidor = http.createServer(function (request, response) {
    console.log(`Método: ${request.method}`);
    console.log(`URL: ${request.url}`);
    console.log(request.headers);

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    response.write('<!DOCTYPE html>');
    response.write('<html>');
    response.write('<head>');
    response.write('<title>Página de prueba</title>');
    response.write('<meta charset="utf-8">');
    response.write('</head>');
    response.write('<body></ul>');
    for (let i = 0; i < 10; i++) {
        response.write(`<li>Item ${i}</li>`);
    }
    response.write('</ul></body></html>');
    response.end();//MUY IMPORTANTE, SI NO SE PONE SE QUEDA EL SERVIDOR COLGADO
});
// Inicio del servidor
servidor.listen(3000, function (err) {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});*/

const http = require("http");
const mysql = require("mysql");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aw"
});

function consultaBD(callback) {
    pool.getConnection(function (err, conexion) {
        if (err) {
            callback(err);
        } else {
            conexion.query(
                "SELECT Nombre, Apellidos, COUNT(corr.Correo) as NumCorreos " +
                "FROM Contactos con LEFT JOIN Correos corr ON con.Id = corr.Id " +
                "GROUP BY con.id",
                function (err, rows) {
                    conexion.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                });
        }
    });
}

const servidor = http.createServer(function (request, response) {
    consultaBD(function (err, filasBD) {
        if (err) {
            response.statusCode = 500; // Internal Server Error
            console.error(err);
        } else {
            response.statusCode = 200;
            devolverPagina(response, filasBD);
        }
    });
});

function devolverPagina(response, filasBD) {
    response.setHeader("Content-Type", "text/html");
    response.write('<html>');
    response.write('<head>');
    response.write('<title>Base de datos de teléfonos</title>');
    response.write('<meta charset="utf-8">');
    response.write('<style>th, td { border: 1px solid }</style>');
    response.write('</head>');
    response.write('<body>');
    response.write('<table>');
    response.write('<tr><th>Nombre</th><th>Apellidos</th>' +
        '<th>Número direcciones</th></tr>');
    filasBD.forEach(function (fila) {
        response.write('<tr>');
        response.write(`<td>${fila.Nombre}</td>`);
        response.write(`<td>${fila.Apellidos}</td>`);
        response.write(`<td>${fila.NumCorreos}</td>`);
        response.write('</tr>');
    });
    response.write('</table>');
    response.write('</body></html>');
    response.end();
}

// Inicio del servidor
servidor.listen(3000, function (err) {
    if (err) {
        console.log("Error al iniciar el servidor");
    } else {
        console.log("Servidor escuchando en el puerto 3000")
    }
});