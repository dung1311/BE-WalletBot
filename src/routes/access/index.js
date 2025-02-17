"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const {authenticate, authenticateV2} = require("../../middleware/authMiddleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/otp", AuthController.otp);
router.post("/verifyOTP", AuthController.verifyOTP);
router.use(authenticateV2)

router.post("/refresh-token", AuthController.refreshAccessToken);
router.post("/logout",  AuthController.logout);

router.get("/index", (req, res) => {
    res.send("hello v1/api");
});

module.exports = router