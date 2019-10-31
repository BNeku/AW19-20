const mysql = require("mysql");

//sincrona. Nos crea el pool de conexiones
//CONFIGURACION DEL POOL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aw"
});

/*trabaja sobre el pool que acabamos de obtener
solo tiene un parámetro: la propia callback
el segundo parámetro de la callback es la propia conexión.
en caso de no haber error, es cuando podemos trabajar con la bbdd 
*/
//SOLICITUD DE CONEXION
/*
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        //EJECUCION DE LA CONSULTA
        connection.query(
            "SELECT Nombre, Apellidos FROM Contactos",
            function (err, filas) {
                //aqui ya ha terminado la query
                //LIBERACION DE LA CONEXION
                connection.release();//liberarla haya ido bien o haya ido mal
                if (err) {
                    console.log('Error en la consulta a la base de datos');
                } else {
                    // Acceso a las filas resultado de la consulta
                    filas.forEach(function (fila) {
                        console.log(`${fila.Nombre} ${fila.Apellidos}`);
                    });
                }
            }
        );
    }
});*/
/*primer parámetro es la consulta, el segundo parametro es la callback
en la invocacion de la callback pasa si hay error, y el resultado de la consulta(filas), por lo que
en el cuerpo de esta callback es donde dispongo del resultado de la consulta de la bbdd
el rdo de una consulta es un array de objetos, con tantas columnas como propiedades tiene el select
*/
/*
connection.query(
    "SELECT Nombre, Apellidos FROM Contactos",
    function (err, filas) {
        if (err) {
            console.log('Error en la consulta a la base de datos');
        } else {
            // Acceso a las filas resultado de la consulta
        }
    }
);
*/
/*
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        const sql = "INSERT INTO Contactos(Nombre, Apellidos) " + "VALUES ('Diana','Díaz')";
        connection.query(sql, function (err, resultado) {
            connection.release();
            if (err) {
                console.log("Error de inserción: " + err);
            } else {
                // Imprime el identificador de la nueva fila
                console.log(resultado.insertId);//5
                // Imprime el número de filas insertadas
                console.log(resultado.affectedRows);//1
            }
        });
    }
});*/
/*
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        const sql = `SELECT Nombre, Apellidos FROM Contactos WHERE Id=IDK`;
        connection.query(sql, function (err, filas) {
            connection.release();
            if (err) {
                console.log("Error en la consulta");
            } else {
                console.log(filas);
            }
        });
    }
});*/

//para evitar que saquen datos se utilizan consultas paramétricas
pool.getConnection(function (err, connection) {
    if (err) {
        console.log(`Error al obtener la conexión: ${err.message}`);
    } else {
        // Suponemos que la variable `id` contiene el identificador
        let id =4;
        // introducido por el usuario
        connection.query(
            `SELECT Nombre, Apellidos FROM contactos WHERE Id = ?`,
            [id],
            function (err, rows) {
                if (err) {
                    console.log('Error en la consulta');
                } else {
                    console.log(rows);
                }
            });
    }
});