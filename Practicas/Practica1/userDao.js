'use strict'

class UserDao {
    constructor(pool) {
        this.pool = pool;
    }

    insertUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO usuario(email, password, name, gender, birthDate, img, puntos) VALUES (?,?,?,?,?,?,?);";
                let userData = [user.email, user.password, user.name, user.gender, user.birthday, user.photo, 0];
                connection.query(sql, userData, function (err, result) {
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

    getUser(email, callback) {
        const sql = "SELECT * FROM usuario WHERE email = ?;";
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(sql, email, function (err, result) {
                    connection.release();
                    if (err || result.length == 0) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        callback(result[0], true);
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
                const sql = "SELECT * FROM usuario WHERE email = ? AND password = ?;";
                let data = [email, password];
                connection.query(sql, data, function (err, existe) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        if (existe.length > 0) {
                            callback(null, true);
                        } else {
                            callback(null, false);
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
                const sql = "SELECT img FROM usuario WHERE email = ?;";
                connection.query(sql, email, function (err, img) {
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

    modifyUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "UPDATE usuario SET password= ?,name= ?, gender= ?,birthDate= ?,img=?,puntos=? WHERE email = ? ";
                let userData = [user.password, user.name, user.gender, user.birthDate, user.photo, user.puntos, user.email];
                connection.query(sql, userData, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        callback(null, true);
                    }
                });
            }
        });
    }

    getPuntos(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT puntos FROM usuario WHERE email = ?";
                connection.query(sql, email, function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        callback(null, result);
                    }
                });
            }
        });
    }

    getAmigos(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM amigos WHERE solicitante = ? OR solicitado = ?";

                connection.query(sql, [email, email], function (err, result) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), false);
                    } else {
                        callback(null, result);
                    }
                });
            }
        });
    }

    getName(emails, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                if (emails != null) {
                    var sql = "SELECT name, email FROM usuario WHERE email IN (";

                    for (var i = 0; i < emails.length; i++) {
                        sql += "?,"
                    }
                    sql = sql.substr(0, sql.length - 1);
                    sql += ");"
                    var emailsFinal = emails.map(n => n.email);

                    connection.query(sql, emailsFinal, function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), false);
                        } else {
                            callback(null, result);
                        }
                    });
                } else {
                    callback(null);
                }

            }
        });
    }

    aceptarAmistad(email, amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "UPDATE amigos SET amigos=1 WHERE (solicitante= ? AND solicitado= ?) OR (solicitante= ? AND solicitado= ?)";
                connection.query(sql, [email, amigo, amigo, email], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    rechazarAmistad(email, amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "DELETE FROM amigos WHERE (solicitante= ? AND solicitado= ?) OR (solicitante= ? AND solicitado= ?)";
                connection.query(sql, [email, amigo, amigo, email], function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    buscarUsuario(email, str, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "SELECT name,email FROM usuario WHERE name LIKE ? AND email <> ?;";
                let name = '%' + str + '%';
                connection.query(sql, [name, email], function (err, usuarios) {
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

    solicitarAmistad(solicitante, solicitado, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                const sql = "INSERT INTO amigos(solicitante, solicitado, amigos) VALUES (?,?,0)";
                connection.query(sql, [solicitado, solicitante,], function (err) {
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
}

module.exports = UserDao;