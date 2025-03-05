"use strict";

const User = require("../models/user.model");
const {getInfoData, sendEmail} = require("../utils/index")
const bcrypt = require("bcryptjs");
const KeyTokenService = require("./keytoken.service");
const OTPService = require("./otp.service");
const client = require("../models/clientRedis.model.js");
const { isNull } = require("lodash");
class UserService {
    static async getAllUsers() {
        try {
            const users = await User.find().select("-password"); // Ẩn password
            return { code: 200, metadata: users };
        } catch (error) {
            return { code: 500, message: "Lỗi server", error };
        }
    }

    static async createUser({ name, email, password }) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { code: 400, message: "Email đã tồn tại" };
            }

            const newUser = await User.create({ name, email, password });

            return { 
                code: 201, 
                metadata: { 
                    _id: newUser._id, 
                    name: newUser.name, 
                    email: newUser.email 
                } 
            };
        } catch (error) {
            return { code: 500, message: "Lỗi server", error };
        }
    }
    static async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    static async register(req) {
        const {email, name, password} = req.body;
        const existingUser = await UserService.getUserByEmail(email);
        if(existingUser){
            return {
                code: 400, 
                message: "Email already registered",
                metadata: null,
            };
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const dataUser = {
            name: name,
            email: email,
            password: hashPassword
        }
        req.session.user = dataUser;
        await client.set(`sessionId:${req.session.id}`, JSON.stringify(dataUser), {EX: 300});
        const sendOTP = await UserService.sendOTP(email);
        sendOTP.metadata.sessionId = req.session.id;
        return sendOTP;

    }
    static async confirmRegister(req) {
        const { email, otpCode} = req.body;
        console.log(req.headers);
        const sessionId = req.headers['x-ssid'];
        console.log(sessionId);
        const verifyOTP = await OTPService.verifyOTP(email, otpCode);
        if(verifyOTP.code !== 200){
            return verifyOTP;
        }
        const curUserString = await client.get(`sessionId:${sessionId}`);
        if(!curUserString) return {
            code: 400,
            message: "Session expired or invalid",
            metadata: null,
        }
        const curUser = JSON.parse(curUserString);
        const newUser = await User.create(curUser);
        req.session.destroy();
        const payload = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
        const accessToken = KeyTokenService.generateAccessToken(payload);
        const refreshToken = KeyTokenService.generateRefreshToken(payload);

        let keyToken = await KeyTokenService.createKeyToken({
            userID: newUser._id,
            refreshToken: refreshToken,
        });
        return {
            code: 201,
            message: "Create new user successfully",
            metadata: {
                "access_token": accessToken,
                "refresh_token": refreshToken
            }
        };
    }
    static async login(email, password) {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return {
                code: 400,
                message: "Email is not exist",
                metadata: null,
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                code: 400,
                message: "Password wrong",
                metadata: null,
            }
        }
        
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        const newAccessToken = KeyTokenService.generateAccessToken(payload);
        const newRefreshToken = KeyTokenService.generateRefreshToken(payload);

        let keyToken = await KeyTokenService.getKeyTokenById(user._id);

        if(!keyToken){
            keyToken = KeyTokenService.createKeyToken({
                userID: user._id,
                refreshToken: newRefreshToken
            });
        }
        else{
            const refreshToken = keyToken.refreshToken
            await KeyTokenService.updateTokens(user._id, refreshToken, newRefreshToken);
        }
        return {
            code: 200,
            message: "Login successful",
            metadata: {
                accessToken: newAccessToken, refreshToken: newRefreshToken
            }
        }
    }
    static async forgotPassword(email){
        const sendOTP = await UserService.sendOTP(email);
        return sendOTP;
    }
    static async resetPassword(email, otpCode, newPassword, reNewPassword){
        if(newPassword !== reNewPassword ) return {
            code: 400,
            message: "New password and reNew Password do not match",
            metadata: null,
        }
        if(newPassword.length < 8) return {
            code: 400,
            message: "Password must be at least 8 characters",
            metadata: null,
        }
        const verifyOTP = await OTPService.verifyOTP(email, otpCode);
        if(verifyOTP.code !== 200) return verifyOTP;
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const resetUser = await User.findOneAndUpdate(
            {email: email},
            {password: newPasswordHash},
            {new: true},
        )
        if (!resetUser) {
            return { 
                code: 500, 
                message: "Failed to reset password",
                metadata: null,
            };
        }
        return {
            code: 200,
            message: "Password changed",
            metadata: null,
        }
    }
    static async logout(email) {
        const user = await UserService.getUserByEmail(email);
        try{
            await KeyTokenService.deleteKeyToken(user._id);
            return {
                code: 200,
                message: "Logged out successfully",
                metadata: null,
            }
        }catch(error){
            return {
                code: 404,
                message: "Logged out failed",
                metadata: null,
            }
        }
    }
    static async sendOTP(email){
        try {
            const otpCode = await OTPService.generateOTP(email);
            if(otpCode === 0){
                return {
                    code: 400,
                    message: "Please enter your email exactly!",
                    metadata: null,
                }
            }
            const content = `Here is your OTP CODE: ${otpCode}`;
            await sendEmail(content, email);
            return {
                code: 200,
                message: 'Sent OTP',
                metadata: {
                    sessionId: null,
                }
            }
        }catch(err){
            console.error(err);
            return {
                code: 500,
                message: "Can't send OTP, try again",
                metadata: null
            }
        }
        
    }
}

module.exports = UserService;
