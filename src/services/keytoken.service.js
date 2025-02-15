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
    static async deleteKeyToken(id) {
        try{
            const deleteKeyToken = await KeyToken.findOneAndDelete({userID: id});
        }catch (error){
            throw new Error(error);
        }
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
    static async refreshAccessToken(req, res){
        const { refreshToken} = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh Token is required." });
        }
        try {
            const decoded = KeyTokenService.verifyRefreshToken(refreshToken);
            const keyToken = await KeyTokenService.getKeyTokenById(decoded.id);
            if (!keyToken || !keyToken.refreshToken.includes(refreshToken)) {
                return res.status(403).json({ message: "Invalid Refresh Token." });
            }
            const newAccessToken = KeyTokenService.generateAccessToken({ id: decoded.id, name: decoded.name, email: decoded.email });
            console.log(newAccessToken);
            res.json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(403).json({ message: "Invalid or Expired Refresh Token." });
        }
    }
}

module.exports = KeyTokenService;