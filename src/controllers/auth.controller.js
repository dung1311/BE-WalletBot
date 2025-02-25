const UserService = require("../services/user.service");
const KeyTokenService = require("../services/keytoken.service");
const KeyToken = require("../models/keytoken.model");
const jwt = require("jsonwebtoken");
const OTPService = require("../services/otp.service");

class AuthController {
    static async register(req, res) {
        const response = await UserService.register(req);
        return res.status(response.code).json(response);
    }
    static async confirmRegister(req, res) {
        const response = await UserService.confirmRegister(req);
        return res.status(response.code).json(response);
    }
    static async login(req, res) {
        const { email, password } = req.body;
        const response = await UserService.login(email, password);
        return res.status(response.code).json(response);
    }
    static refreshAccessToken = async (req, res) => {
        const {refreshToken }= req.body
        const response = await KeyTokenService.refreshAccessToken(refreshToken);
        return res.status(response.code).json(response);
    };
    static async logout(req, res) {
        const {email} = req.body;
        const response = await UserService.logout(email);
        return res.status(response.code).json(response);
    }
    static async forgotPassword(req, res) {
        const {email} = req.body;
        const response = await UserService.forgotPassword(email);
        return res.status(response.code).json(response);
    }
    static async resetPassword(req, res) {
        const {email, otpCode, newPassword, reNewPassword} = req.body;
        const response = await UserService.resetPassword(email, otpCode, newPassword, reNewPassword);
        return res.status(response.code).json(response);
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
