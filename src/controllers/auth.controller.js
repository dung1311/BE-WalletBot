const UserService = require("../services/user.service");
const KeyTokenService = require("../services/keytoken.service");
const KeyToken = require("../models/keytoken.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        return response;
  };
    static async logout(req, res) {
        const response = await UserService.logout(req, res);
        return response;
    }
}

module.exports = AuthController;
