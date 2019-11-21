'use strict'

class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        var self = this;
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM task JOIN user ON task.user = user.email  WHERE email = ? ";
                connection.query(sql, email, function(err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        self.getAllTags(rdo, callback);
                    }
                });
            }
        });
    }

    getAllTags(tasks, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "SELECT * FROM tag  WHERE taskId IN ? ";
                var idTasks = tasks.map(n=> n.id);
                
                connection.query(sql, idTasks, function(err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        //COMPLETAR AQUI
                        rdo.map(function(v,i,a){

                        });
                        callback(null, rdo);
                    }
                });
            }
        });
    }

    insertTask(email, task, callback) {
        var self = this; //Guardamos en una variable el contexto.
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO task(user, text,done) VALUES (?,?,?);";
                let taskArray = [email, task.text, task.done];
                connection.query(sql, taskArray, function(err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        task.id = rdo.insertId;
                        self.insertTag(task.id, task.tags, callback);
                    }
                });
            }
        });
    }

    insertTag(id, tags, callback) {
        this.pool.getConnection(function(err, connection) {
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

                connection.query(sql, tagArray, function(err) {
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

    markTaskDone(idTask, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "UPDATE task SET done = 1 WHERE id = ?;"
                connection.query(sql, idTask, function(err) {
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
        var self = this; //Guardamos en una variable el contexto.
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "SELECT id FROM task WHERE done = 1 AND user = ?;";
                connection.query(sql, email, function(err, rdo) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else if (rdo.length == 0) {
                        callback(null); //Solo debemos llamar al resto de métodos si y solo sí, hemos encontrado tareas, en caso contrario daría un error en las siguientes queries que esperan valores. 
                    } else {
                        let ids = rdo.map(value => value.id); //Tenemos que pasar solo los ids, pasando directamente rdo, estamos pasando un dictionary de tipo [id: valor];
                        self.deleteTags(ids, callback);
                    }
                });
            }
        });
    }

    deleteTags(ids, callback) {
        var self = this; //Guardamos en una variable el contexto.
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "DELETE FROM tag WHERE taskId IN (?);"
                connection.query(sql, ids, function(err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"), null);
                    } else {
                        self.deleteTasks(ids, callback);
                    }
                });
            }
        });
    }

    deleteTasks(ids, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                var sql = "DELETE FROM task WHERE id IN (?);"
                connection.query(sql, ids, function(err, rdo) {
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