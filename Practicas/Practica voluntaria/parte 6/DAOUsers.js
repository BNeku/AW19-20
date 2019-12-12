'use strict'

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }


    insertarUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "INSERT INTO user (email, password, img) VALUES (?,?,?)";
                let user = [usuario.email, usuario.password, usuario.img];

                connection.query(sql, user, function (err, rdo) {
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

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM user WHERE email = ? AND password = ?;";
                let data = [email,password];
                connection.query(sql, data, function (err, existe) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        if (existe.length > 0) {
                            callback(null, true);
                        } else {
                            callback(null,false);
                        }

                    }
                });
            }
        });
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT img FROM user WHERE email = ?;";
                connection.query(sql, [email], function (err, img) {
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

module.exports = DAOUsers;