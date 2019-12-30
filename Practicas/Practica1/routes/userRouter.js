'use strict'

const userRouter = require("./userController");
const userSessionRouter = require("./userSessionRouter");

/** setup Router */
const express = require('express');
var router = express.Router();
const path = require("path");

const multer = require("multer");
const multerFactory = multer({
    dest: __dirname.substring(0, __dirname.lastIndexOf('/')) + "/public/img"
});

/* GET - Sección para implementar las peticiones GET */

router.get("/", userRouter.root);

router.get("/login", userRouter.login);

router.get("/register", userRouter.register);

router.get("/profile", userSessionRouter.currentUser, userRouter.profile);

router.get("/modify", userSessionRouter.currentUser, userRouter.modify);

router.get("/logout", userSessionRouter.currentUser, userRouter.logout);

/* POST - Sección para implementar las peticiones POST */

router.post("/procesar_login", userRouter.procesarLogin);

router.post("/register", multerFactory.single("photo"), userRouter.registerWithPhoto);

router.post("/post_modify", userSessionRouter.currentUser, multerFactory.single("photo"), userRouter.modifyProfile);

module.exports = router;