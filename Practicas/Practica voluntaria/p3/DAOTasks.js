'use strict'

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
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
}