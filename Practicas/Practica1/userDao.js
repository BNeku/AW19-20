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
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(sql, email, function(err, result) {
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

    modifyUser(user, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
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

    getPuntos(email,callback){
        this.pool.getConnection(function(err,connection){
            if(err){
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
}

module.exports = UserDao;