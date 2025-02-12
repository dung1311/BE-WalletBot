'use strict';
const jwt = require('jsonwebtoken');
const KeyToken = require('../models/keytoken.model');
class KeyTokenService{
    static async getKeyTokenById(id) {
        try {
            const keyToken = await KeyToken.findOne({userID: id });
            return keyToken;
        } catch (error) {
            throw new Error(error);
        }
    }
    static async createKeyToken(data){
        return await KeyToken.create(data);
    }
    static async updateTokens(userID, refreshToken) {

        await KeyToken.findOneAndUpdate(
            { userID: userID },
            { $push: { refreshToken: refreshToken } },
            { new: true }
        );
        const key = await KeyTokenService.getKeyTokenById(userID);
    }
    static generateAccessToken(payload){
        const token = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        return token;
    }

    static generateRefreshToken(payload){
        const token = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        return token;
    }

    static verifyAccessToken(token){
        return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    }
    static verifyRefreshToken(token){
        return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    }

}

module.exports = KeyTokenService;