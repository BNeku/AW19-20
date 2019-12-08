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
                const sql = "SELECT * FROM Respuesta LEFT JOIN Pregunta on Pregunta.id = Respuesta.preguntaId WHERE Respuesta.preguntaId = ?;";
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

    insertRespuestaUsuario(respuesta, callback) {
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
}

module.exports = PreguntaDao;