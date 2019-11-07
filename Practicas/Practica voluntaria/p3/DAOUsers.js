'use strict'

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?;";
                connection.query(sql, [email, password], function(err) {
                    connection.release();
                    if (err) {
                        callback(err, false);
                    } else {
                        callback(null, true);
                    }
                });
            }
        });
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT img FROM usuarios WHERE email = ?;";
                connection.query(sql, [email], function(err, img) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        callback(null, img);
                    }
                });
            }
        });
    }
}