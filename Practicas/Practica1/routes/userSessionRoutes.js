'use strict'

/* Ficheros del proyecto (creados por nosotros)*/
const config = require("../config");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const session = require("express-session");
const mysqlSession = require("express-mysql-session");

/*Middlewares */
function currentUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.puntos = request.session.puntos;
        next();
    } else {
        response.redirect("/login");
    }
}

module.exports = {
    currentUser
}