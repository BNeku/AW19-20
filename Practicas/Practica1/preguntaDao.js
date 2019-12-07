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
                const sql = "INSERT INTO pregunta(texto) VALUES (?);";
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
                const sql = "INSERT INTO Respuesta(preguntaId, texto) VALUES ?;";
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
}

module.exports = PreguntaDao;