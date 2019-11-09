const DAOUsers = require("./DAOUsers.js");
const DAOTasks = require("./DAOTasks.js");
const mysql = require("mysql");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tareas"
});

const user = new DAOUsers(pool);
const task = new DAOTasks(pool);

let usuario1 = {
    email: "yhon@ucm.es",
    password: "234",
    img: "./google.com"
};

// user.insertarUsuario(usuario1, function(err) {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log("USUARIO INSERTADO CORRECTAMENTE");
//     }
// });

// user.isUserCorrect(usuario1.email, usuario1.password, function(err, existe) {
//     if (err) {
//         console.log(err);
//     } else {
//         if (existe) {
//             console.log("EXISTE EL USUARIO");
//         }
//     }
// });

// user.getUserImageName(usuario1.email, function(err, img) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(img);
//     }
// });

// let task1 = {
//     text: "IR AL SCAPEROOM",
//     done: 0,
//     tags: ["ocio", "chachi"]
// };

// task.insertTask(usuario1.email, task1, function(err, insertado) {
//     if (err) {
//         console.log(err);
//     } else {
//         if (insertado) {
//             console.log("TAREA INSERTADA");
//         }
//     }
// });

// task.markTaskDone(1, function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Tarea actualizada a Done");
//     }
// })