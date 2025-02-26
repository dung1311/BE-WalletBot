'use strict';
const jwt = require('jsonwebtoken');
const KeyToken = require('../models/keytoken.model');
const keytokenModel = require('../models/keytoken.model');
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
            await KeyToken.findOneAndDelete({userID: id});
        }catch (error){
            throw new Error(error);
        }
    }

    static async updateTokens(userID, refreshToken, newRefreshToken) {

        await KeyToken.findOneAndUpdate(
            { userID: userID },
            { $push: { refreshTokenUsed: refreshToken }, refreshToken: newRefreshToken },
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
    
    static async refreshAccessToken(refreshToken){
        if (!refreshToken) {
            return {
                code: 400,
                message: "refresh token is required",
                metadata: null
            }
        }
        try {
            const decoded = KeyTokenService.verifyRefreshToken(refreshToken);
            const userId = decoded.id
            const keyToken = await KeyTokenService.getKeyTokenById(userId);

            if(!keyToken){
                return {
                    code: 400,
                    message: "Cannot find keytoken with userId",
                    metadata: null
                }
            }

            if(keyToken.refreshTokenUsed.includes(refreshToken)){
                await KeyTokenService.deleteKeyToken(userId);

                return {
                    code: 400,
                    message: "Something wrong, please re-login",
                    metadata: null
                }
            }

            if(refreshToken !== keyToken.refreshToken){
                return {
                    code: 400,
                    message: "refresh token is not valid",
                    metadata: null
                }
            }

            const newAccessToken = KeyTokenService.generateAccessToken({ id: userId, name: decoded.name, email: decoded.email });
            const newRefreshToken = KeyTokenService.generateRefreshToken({id: userId, name: decoded.name, email: decoded.email});

            await KeyTokenService.updateTokens(userId, refreshToken, newRefreshToken);

            return {
                code: 200,
                message: 'Access token updated successfully',
                metadata:{
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                }
            }
        } catch (error) {
            return {
                code: 500,
                message: 'Couldn\'t update access token',
                metadata: null
            }
        }
    }
}

module.exports = KeyTokenService;