const UserService = require("../services/user.service");
const KeyTokenService = require("../services/keytoken.service");
const KeyToken = require("../models/keytoken.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTPService = require("../services/otp.service");

class AuthController {
    static async register(req, res) {
        const response = await UserService.register(req, res);
        return response;
    }
    static async login(req, res) {
        const response = await UserService.login(req, res);
        return response;
    }
    static refreshAccessToken = async (req, res) => {
        const response = await KeyTokenService.refreshAccessToken(req, res);
        return res.status(response.code).json(response);
    };
    static async logout(req, res) {
        const response = await UserService.logout(req, res);
        return response;
    }
    static async otp(req, res) {
        const {email} = req.body;
        const response = await UserService.sendOTP(email);
        return res.status(response.code).json(response);
    }
    static async verifyOTP(req, res) {
        const {email, otpCode} = req.body;
        const response = await OTPService.verifyOTP(email, otpCode);
        return res.status(response.code).json(response);
    }
}

module.exports = AuthController;
