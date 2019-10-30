const freplace = require("./ejercicio1.js");

freplace("ejercicios T4/fichero.txt", /\s+/gm, " ", function(err){
    if(err){
        console.log("Se ha producido un error:");
        console.log(err.message);
    }else{
        console.log("fichero reemplazado");
    }
});