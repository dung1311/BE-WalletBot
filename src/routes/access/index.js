"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const authenticate = require("../../middleware/authMiddleware");
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh-token", AuthController.refreshAccessToken);
router.post("/logout", authenticate, AuthController.logout);
router.get("/index", authenticate ,(req, res) => {
    res.send("hello v1/api");
});
module.exports = router