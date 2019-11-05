'use strict'

const DAO = require("./dao.js");

const daoMensajeria = new DAO("localhost", "root", "","mensajeria");

let usuario1={
    id:3,
    nombre:"Neku",
    correo:"neku@ucm.es",
    telefono:"123"
};
let usuario2={
    id:4,
    nombre:"Yhon",
    correo:"yhon@ucm.es",
    telefono:"345"
};

let msj= "holi";
/*
daoMensajeria.insertarUsuario(usuario1,function(err){
    if(err){
        console.log(err.message);
    }else{
        console.log("USUARIO INSERTADO CORRECTAMENTE");
    }
});

daoMensajeria.insertarUsuario(usuario2,function(err){
    if(err){
        console.log(err.message);
    }else{
        console.log("USUARIO INSERTADO CORRECTAMENTE");
    }
});

daoMensajeria.enviarMensaje(usuario1, usuario2,msj, function(err){
    if(err){
        console.log(err.message);
    }else{
        console.log("MENSAJE ENVIADO CORRECTAMENTE");
    }
});*/
/*
daoMensajeria.bandejaEntrada(usuario2,function(err, mensajes){
    if(err){
        console.log(err.message);
    }else{
        console.log(mensajes);
    }
});*/
/*
daoMensajeria.buscarUsuario("yh", function(err, usuarios){
    if(err){
        console.log(err.message);
    }else{
        console.log(usuarios);
    }
});*/

daoMensajeria.terminarConexion(function(err){
    if(err){
        console.log(err.message);
    }else{
        console.log("CONEXION TERMINADA");
    }
});