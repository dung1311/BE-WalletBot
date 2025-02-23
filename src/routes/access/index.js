"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/auth.controller");
const {authenticate, authenticateV2} = require("../../middleware/authMiddleware");

router.post("/register", AuthController.register);
router.post("/confirmRegister", AuthController.confirmRegister);
router.post("/login", AuthController.login);
router.post("/otp", AuthController.otp);
router.post("/forgotPassword", AuthController.forgotPassword);
router.post("/resetPassword", AuthController.resetPassword);
router.post("/verifyOTP", (req, res) =>{
    console.log(req.headers);
    if(req.headers['x-ssid'])
        return AuthController.confirmRegister(req, res);
    else { AuthController.resetPassword(req, res);}
});
router.use(authenticateV2)

router.post("/refresh-token", AuthController.refreshAccessToken);
router.post("/logout",  AuthController.logout);

router.get("/index", (req, res) => {
    res.send("hello v1/api");
});

module.exports = router