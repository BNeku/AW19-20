'use strict'
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("suma1.html");
});

app.post("/primerDigito",function(request, response){
    response.status(200);
    response.cookie("s1", request.body.s1, {
        maxAge: 86400000
    });

    response.redirect("suma2.html");
});

app.post("/segundoDigito",function(request, response){
    response.status(200);

    response.cookie("s2", request.body.s2, {
        maxAge: 86400000
    });

    response.redirect("/suma");
    
});

app.get("/suma", function(request,response){
    response.status(200);

    let s1= Number(request.cookies.s1);
    let s2= Number(request.cookies.s2);

    response.render("rdo",{
        s1: s1,
        s2: s2,
        rdo: s1+s2
    });
   
});

app.get("/volver", function(request, response){
    response.status(200);
    response.clearCookie("s1");
    response.clearCookie("s2");
    response.redirect("suma1.html");
});


app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});