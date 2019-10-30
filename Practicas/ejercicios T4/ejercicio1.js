'use strict'

/*Escribir un programa ej1a.js que lea un fichero concreto y sustituya cualquier grupo de uno o más espacios 
en blanco por un único blanco. Se deben utilizar las funciones asíncronas readFile y writeFile del módulo fs. */
/*
const fs = require("fs");

fs.readFile("ejercicios T4/fichero.txt", {
    encoding: "utf-8"
}, espaciosBlanco);

function espaciosBlanco(err, contenido) {
    if (err) {
        console.log("Se ha producido un error:");
        console.log(err.message);
    } else {
        console.log(contenido);
        console.log("parseo:");
        let texto = contenido.replace(/\s+/gm, ' ');

        fs.writeFile("ejercicios T4/fichero.txt", texto, {encoding: "utf-8"},
            function (err) {
                if (err) {
                    console.log("Se ha producido un error:");
                    console.log(err.message);
                }else{
                    console.log(texto);
                }
            }
        );
    }
}*/

/*Utilizando parte del código del apartado a., escribir un módulo ejnode.js que exporte la 
función freplace(fichero, buscar, sustituir, callback) que permite buscar en fichero las cadenas que describe 
la expresión regular buscar y sustituirlas por la cadena sustituir. La función callback recibe un único parámetro que 
vale null si no ha ocurrido ningún error y en caso contrario un objeto Error que describe el error ocurrido.
El módulo ejnode.js tiene que estar preparado para exportar más elementos además de la función freplace.
Escribir un programa ej1b.js para probar la función freplace.*/


const fs = require("fs");

function freplace(fichero, buscar, sustituir, callback) {
    
    fs.readFile(fichero, {
        encoding: "utf-8"
    },function(err, contenido){
        if(err){
            console.log("Se ha producido un error:");
            console.log(err.message);
            callback(err);
        }else {
            
            console.log(contenido);
            callback(null);
            let texto = contenido.replace(buscar, sustituir);
            console.log(texto);
           
        }
    });
}


module.exports = freplace;