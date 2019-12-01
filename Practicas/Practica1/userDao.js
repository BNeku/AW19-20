'use strict'

class UserDao {
    constructor(pool) {
        this.pool = pool;
    }

    insertUser(user, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO User(email, password, name, gender, birthday, photo) VALUES (?,?,?,?,?,?);";
                let userData = [user.email, user.password, user.name, user.gender, user.birthday, null];
                connection.query(sql, userData, function(err, result) {
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

module.exports = UserDao;