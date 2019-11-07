'use strict'

class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM task JOIN user ON task.user = user.email WHERE email = ?";
                connection.query(sql, email, function (err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null, rdo);
                    }
                });
            }
        });
    }

    insertTag(id, tags, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "INSERT INTO tag(taskId, tag) VALUES ";
                let tagArray = [];
                for (var i = 0; i < tags.length - 1; i++) {
                    sql = sql + "(?, ?), "
                    tagArray.push(id);
                    tagArray.push(tags[i]);
                }
                sql = sql + "(?, ?);";
                tagArray.push(id);
                tagArray.push(tags[tags.length - 1]);

                connection.query(sql, tagArray, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    insertTask(email, task, callback) {
        let insertar = insertTag;
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO task(user, text,done) VALUES (?,?,?);";
                let taskArray = [email, task.text, task.done];
                connection.query(sql, taskArray, function (err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        task.id = rdo.insertId;
                        insertar(task.id, task.tags, callback);
                        
                    }
                });
            }
        });
    }


    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "UPDATE task SET VALUE done=true WHERE id = ?;"
                connection.query(sql, idTask, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    deleteCompleted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "SELECT id FROM task WHERE done = true AND user = ?;";
                connection.query(sql, email, function (err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        deleteTags(rdo, callback);
                    }
                });
            }
        });
    }

    deleteTags(ids, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "DELETE FROM tag WHERE taskId IN ?;"
                connection.query(sql, ids, function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        deleteTasks(ids, callback);
                    }
                });
            }
        });
    }

    deleteTasks(ids, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "DELETE FROM task WHERE id IN ?;"
                connection.query(sql, ids, function (err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }
}

module.exports = DAOTasks;