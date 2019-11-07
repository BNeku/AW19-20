const http = require("http");
const url = require("url");
const mysql = require("mysql");
const DAO = require("./dao.js");
const fs = require("fs");

const daoMensajeria = new DAO("localhost", "root", "", "mensajeria");

const servidor = http.createServer(function (request, response) {

            let method = request.method;
            console.log(method);
            //GET
            let requestUrl = request.url;
            console.log(requestUrl);
            // /nuevo_usuario?nombre=Juan+Calvo&correo=juan.calvo%40ucm.es&telefono=678678678
            let objetoUrl = url.parse(requestUrl, true);
            let pathname = objetoUrl.pathname;
            console.log(pathname);
            // /nuevo_usuario
            let query = objetoUrl.query;
            console.log(query);
            /*{ nombre: 'Juan Calvo',
  		correo: 'juan.calvo@ucm.es',
  		telefono: '678678678' }
        …..*/

            if (method === "GET" && pathname === "/index.html") {
                fs.readFile("." + pathname, function (err, content) {
                        if (err) {
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "text/html");
                            response.write("ERROR INTERNO");
                            response.end();
                        } else {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "text/html");
                            response.write(content);
                            response.end();
                        }
                    });
                }
                else if (method === "GET" && pathname == "/nuevo_usuario") {
                    daoMensajeria.insertarUsuario(query, function (err) {
                        if (err) {
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "text/html");
                            response.write("ERROR AL INSERTAR");
                            response.end();
                        } else {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "text/html");
                            response.write("Usuario insertado");
                            response.end();

                        }
                    });
                }else{
                    response.statusCode=404;
                    response.end();
                }



            });

        // Inicio del servidor
        servidor.listen(3000, function (err) {
            if (err) {
                console.log("Error al iniciar el servidor");
            } else {
                console.log("Servidor escuchando en el puerto 3000")
            }
        });