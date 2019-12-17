'use strict'

const questionRouter = require("./questionsRoutes");
const userSessionRouter = require("./userSessionRoutes");

/** setup Router */
const express = require('express');
var router = express.Router();

/** GET */
router.get("/", userSessionRouter.currentUser, questionRouter.preguntas);

router.get("/crearPregunta", userSessionRouter.currentUser, questionRouter.crearPregunta);

router.get("/pregunta/:id", userSessionRouter.currentUser, questionRouter.preguntaById);

router.get("/contestar_pregunta/:id", userSessionRouter.currentUser, questionRouter.contestarPregunta);

router.get("/adivinar_respuesta/:id/:email", userSessionRouter.currentUser, questionRouter.adivinarRespuesta);

/* POST - Sección para implementar las peticiones POST */

router.post("/procesar_crear_pregunta", userSessionRouter.currentUser, questionRouter.procesarCrearPregunta);

router.post("/procesar_respuesta", userSessionRouter.currentUser, questionRouter.procesarRespuesta);

router.post("/procesar_adivinar", userSessionRouter.currentUser, questionRouter.procesarAdivinar);

module.exports = router;