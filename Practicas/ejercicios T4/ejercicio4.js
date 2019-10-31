const mysql = require("mysql");

//CONFIGURACION DEL POOL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aw"
});



function leerArticulos(callback){

    pool.getConnection(function (err, connection) {
        if(err){
            console.log(`Error al obtener la conexión: ${err.message}`);
            callback(err);
        }else{
            const sql = "SELECT * from articulos JOIN palabrasclave ON id=idArticulo";
            connection.query(sql, function(err,listaArt){
                if(err){
                    callback(err, null);
                }else{
                    callback(err,listaArt);
                }
            });
        }
    });
}

leerArticulos(function(err, listaArti){
    if(err){
        console.log(`Error: ${err.message}`);
    }else{
        console.log(listaArti);
    }
});