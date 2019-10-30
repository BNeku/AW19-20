/*"use strict";

//se suele llamar a la primera constante como el modulo 
const fs = require("fs");

try {
    const contenido = fs.readFileSync("ejemplos T4/FichTexto.txt", {
        encoding: "utf-8"
    });
    console.log("Fichero leído correctamente:");
    console.log(contenido);
} catch (err) {
    console.log("Se ha producido un error:");
    console.log(err.message);
}*/
/*
"use strict";
const fs = require("fs");

fs.readFile("ejemplos T4/FichTexto.txt", {
    encoding: "utf-8"
}, ficheroLeido);

// Función callback
function ficheroLeido(err, contenido) {
    if (err) {
        console.log("Se ha producido un error:");
        console.log(err.message);
    } else {
        console.log("Fichero leído correctamente:");
        console.log(contenido);
    }
}*/
/*
"use strict";

const fs = require("fs");

fs.readFile("ejemplos T4/FichTexto.txt", {
        encoding: "utf-8"
    },
    function (err, contenido) {
        if (err) {
            console.log("Se ha producido un error:");
            console.log(err.message);
        } else {
            console.log("Fichero leído correctamente:");
            console.log(contenido);
        }
    }
);*/

"use strict";
/*
const fs = require("fs");
let contenidoFichero;
//ERROR FRECUENTE
fs.readFile("ejemplos T4/FichTexto.txt", {
        encoding: "utf-8"
    },
    function (err, contenido) {
        if (!err) {
            // Asignamos el contenido a la variable
            // externa
            contenidoFichero = contenido;
            console.log(contenidoFichero);
        }
    });
//el contenido de la callback no se puede utilizar fuera, ya que el hilo ppal continua y se pierde la info
console.log(contenidoFichero); // ¿Qué se imprime aquí?*/

// globals.js
// ----------
//console.log(__dirname);
// → c:\Users\Nerea\Documents\University\GitHub\AW19-20\Practicas\ejemplos T4
//console.log(__filename);
// → c:\Users\Nerea\Documents\University\GitHub\AW19-20\Practicas\ejemplos T4\index.js
/*
//PARA TRABAJAR CON PATHS
const path = require("path");

const infoFichero = path.parse(__filename);

console.log(infoFichero);
// → { root: 'c:\\',
// dir: 'c:\Users\Nerea\Documents\University\GitHub\AW19-20…',
// base: 'index.js',
// ext: '.js',
// name: 'index' }
const nuevoFichero = path.join(infoFichero.dir, "nuevo",
    infoFichero.base);
console.log(nuevoFichero);
// → c:\Users\Nerea\Documents\University\GitHub\AW19-20\Practicas\ejemplos T4\nuevo\index.js
*/
/*
"use strict";
let fs = require('fs');

for (let i = 1; i < 10; i++) {
    let fichero = "f" + i + ".txt";
    console.log("Solicitada la escritura del fichero " + fichero);

    fs.writeFile(fichero, fichero, function (err) {
        if (!err) {
            console.log("Terminada la escritura del fichero" + fichero);
        }
    })
}*/

"use strict";
const fs = require("fs");
const texto = "Actualmente el registro de nmp tiene 800.000 paquetes.";

fs.writeFile("npm.txt", texto, {
        encoding: "utf-8"
    },
    function (err) {
        if (err) {
            console.log("Error al escribir el fichero.");
        } else {
            console.log("Fichero escrito correctamente.");
            fs.readFile("npm.txt", {
                    encoding: "utf-8"
                },
                function (err, contenido) {
                    if (!err) {
                        console.log(contenido);
                    }
                });
        }
    });