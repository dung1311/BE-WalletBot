"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh-token", AuthController.refreshAccessToken);
router.get("/index", (req, res) => {
    res.send("hello v1/api");
});
module.exports = router