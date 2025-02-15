"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const authenticate = require("../../middleware/authMiddleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// middleware
router.use(authenticate)

router.post("/refresh-token", AuthController.refreshAccessToken);
router.post("/logout",  AuthController.logout);

router.get("/index", (req, res) => {
    res.send("hello v1/api");
});

module.exports = router