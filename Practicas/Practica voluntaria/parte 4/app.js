// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");


// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

var user = {
    email: "yhon@ucm.es",
    password: "234",
    img: "https://www.012global.com/Account/Slices/user-anonymous.png"
}

// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

app.get("/", function(request, response){
    response.status(200);
    response.redirect("/tasks");
} );

app.get("/tasks", function(request, response){
    response.status(200);
    daoT.getAllTasks(user.email, function(error, task){
        if(error){
            response.status(418);
        }else{
            
           
            response.render("tasks", {user, tareas});
        }
    });
} );


// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});