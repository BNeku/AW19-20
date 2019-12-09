'use strict'

class PreguntaDao {
    constructor(pool) {
        this.pool = pool;
    }

    insertPregunta(pregunta, callback) {
        var self = this;
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO pregunta(preguntaTitle) VALUES (?);";
                let preguntaData = [pregunta.pregunta];
                connection.query(sql, preguntaData, function(err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        self.insertRespuestas(pregunta.respuestas, result.insertId, callback);
                    }
                });
            }
        });
    }

    insertRespuestas(respuestas, preguntaId, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO Respuesta(preguntaId, respuestaTitle) VALUES ?;";
                var respuestasArray = respuestas.map(value => [preguntaId, value]);

                connection.query(sql, [respuestasArray], function(err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true);
                    }
                });
            }
        });
    }

    getPreguntas(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM Pregunta;";
                connection.query(sql, function(err, preguntas) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, preguntas);
                    }
                });
            }
        });
    }

    getPregunta(preguntaId, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM Pregunta WHERE id = ?;";
                connection.query(sql, preguntaId, function(err, pregunta) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, pregunta);
                    }
                });
            }
        });
    }

    getPreguntaConRespuestasById(preguntaId, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT p.id AS preguntaId, preguntaTitle, r.id AS respuestaId, preguntaId, respuestaTitle FROM Respuesta AS r LEFT JOIN Pregunta AS p on p.id = r.preguntaId WHERE r.preguntaId = ?;";
                connection.query(sql, preguntaId, function(err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado);
                    }
                });
            }
        });
    }

    getRespuestaUsuarioByPreguntaId(preguntaId, idUsuario, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM RespuestaUsuario WHERE preguntaId = ? AND idUsuario = ?;";
                connection.query(sql, [preguntaId, idUsuario], function(err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado);
                    }
                });
            }
        });
    }

    updateRespuestaUsuario(respuesta, callback) {
        var self = this;

        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "UPDATE RespuestaUsuario SET respuestaId = ? WHERE preguntaId = ? AND idUsuario = ?;";
                var data = [respuesta.respuestaId, respuesta.preguntaId, respuesta.idUsuario];
                connection.query(sql, data, function(err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true);
                    }
                });
            }
        });
    }


    insertRespuestaUsuarioAuxiliar(respuesta, callback) {
        var self = this;

        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO RespuestaUsuario(preguntaId, respuestaId, idUsuario) VALUES (?, ?, ?);";
                var data = [respuesta.preguntaId, respuesta.respuestaId, respuesta.idUsuario];
                connection.query(sql, data, function(err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true);
                    }
                });
            }
        });
    }

    insertRespuestaUsuario(respuesta, callback) {
        var self = this;
        this.getRespuestaUsuarioByPreguntaId(respuesta.preguntaId, respuesta.idUsuario, function(err, result) {
            if (err) {
                callback(new Error("Error de acceso a la base de datos"), null);
            } else if (result.length == 0) { // El usuario es la primera vez que responde esta pregunta.
                self.insertRespuestaUsuarioAuxiliar(respuesta, callback);
            } else { //El usuario ya ha respondido esta pregunta así que hay que actualizarla
                self.updateRespuestaUsuario(respuesta, callback);
            }
        });
    }

    insertRespuesta(respuesta, preguntaId, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO Respuesta(preguntaId, respuestaTitle) VALUES (?, ?);";

                connection.query(sql, [preguntaId, respuesta], function(err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, true, result.insertId);
                    }
                });
            }
        });
    }

    insertOtraRespuestaUsuario(nuevaRespuesta, callback) {
        var self = this;

        this.insertRespuesta(nuevaRespuesta.respuesta, nuevaRespuesta.preguntaId, function(err, success, respuestaId) {
            if (err || !success) {
                callback(new Error("Error de acceso a la base de datos"), null);
            } else {
                var respuesta = {
                    preguntaId: nuevaRespuesta.preguntaId,
                    respuestaId: respuestaId,
                    idUsuario: nuevaRespuesta.idUsuario,
                };

                self.insertRespuestaUsuario(respuesta, callback);
            }
        });
    }
}

module.exports = PreguntaDao;