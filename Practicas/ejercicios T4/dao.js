'use strict'

const mysql = require("mysql");

class DAO {
    constructor(host, user, password, databaseName) {
        this.pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: databaseName
        });
    }

    insertarUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "INSERT INTO usuarios (nombre, correo, telefono) VALUES (?,?,?)";
                let user = [usuario.nombre, usuario.correo, usuario.telefono];

                connection.query(sql, user, function (err) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });

            }
        });
    }

    enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "INSERT INTO mensajes (idOrigen, idDestino, mensaje, hora, leido) VALUES (?,?,?,?,?)";
                let user = [usuarioOrigen.id, usuarioDestino.id, mensaje, Date.now(), 0];

                connection.query(sql, user, function (err) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });

            }
        });
    }

    bandejaEntrada(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM mensajes JOIN usuarios ON mensajes.idDestino = usuarios.id WHERE idDestino=? AND leido=0";
                let user = usuario.id;

                connection.query(sql, user, function (err, mensajes) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {

                        let msg = [];
                        for (let x of mensajes) {
                            let aux = {
                                "Nombre": x.nombre,
                                "Mensaje": x.mensaje,
                                "Hora": x.hora
                            };
                            msg.push(aux);
                        }
                        callback(null, msg);
                    }
                });

            }
        });
    }

    buscarUsuario(str, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM usuarios WHERE nombre LIKE ?";
                let name = '%'+str+'%';
                connection.query(sql, name, function (err, usuarios) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, usuarios);
                    }
                });

            }
        });
    }

    terminarConexion(callback){
        this.pool.end(function(err){
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        });
    }
}

module.exports = DAO;