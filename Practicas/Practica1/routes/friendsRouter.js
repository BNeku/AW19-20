'use strict'

const friendsRouter = require("./friendsController");
const userSessionRouter = require("./userSessionRouter");

/** setup Router */
const express = require('express');
var router = express.Router();

//Routes
router.get("/", userSessionRouter.currentUser, friendsRouter.amigos);

router.get("/aceptar/:emailAmigo", userSessionRouter.currentUser, friendsRouter.aceptarAmigo);

router.get("/rechazar/:emailAmigo", userSessionRouter.currentUser, friendsRouter.rechazarAmigo);

router.get('/amigo/:email', userSessionRouter.currentUser, friendsRouter.mostrarPerfilAmigo);

router.get("/buscar", userSessionRouter.currentUser, friendsRouter.buscarAmigo);

router.get("/solicitar_amistad/:id", userSessionRouter.currentUser, friendsRouter.solicitarAmistad);

module.exports = router;