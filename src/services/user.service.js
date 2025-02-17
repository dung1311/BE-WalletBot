"use strict";

const User = require("../models/user.model");
const {getInfoData, sendEmail} = require("../utils/index")
const bcrypt = require("bcryptjs");
const KeyTokenService = require("./keytoken.service");
const random  = require("lodash");
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
    static async register(req, res){
        const {name, email, password} = req.body;
        const existingUser = await UserService.getUserByEmail(email);
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name: name, email: email, password: hashPassword });
        const payload = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
        const accessToken = KeyTokenService.generateAccessToken(payload);
        const refreshToken = KeyTokenService.generateRefreshToken(payload);

        let keyToken = await KeyTokenService.createKeyToken({
            userID: newUser.id,
            refreshToken: refreshToken,
        });
        return res.status(201).json({accessToken, refreshToken});
    }
    static async login(req, res) {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Email is not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password wrong" });
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
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    
    static async logout(req, res) {
        const {email} = req.body;
        const user = await UserService.getUserByEmail(email);
        try{
            await KeyTokenService.deleteKeyToken(user._id);
            return res.status(200).json({message:"Logged out successfully"});
        }catch(error){
            return res.status(400).json({message:"Logged out failed"});
        }
    }
    static async generateOTP(email){
        try{
            const otpCode = random.random(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 5*60*1000);
            const user = await UserService.getUserByEmail(email);
            if(!user) return 0;
            await User.findOneAndUpdate(
                {email},
                {otp: {code: otpCode, expiresAt: expiresAt}},
                {new: true},
            )
            return otpCode;
        }catch(error){
            throw new Error(error);
        }
        
    }
    static async verifyOTP(email, otpCode){
        const user = await UserService.getUserByEmail(email);
        if(!user || !user.otp || user.otp.code !== otpCode) 
            return {
                code: 400,
                message: 'Wrong OTP',
                metadata: null
        }   
        if(user.otp.expiresAt < Date.now())
            return {
                code: 400,
                message: 'Expired OTP',
                metadata: null
        }
        await User.findOneAndUpdate(
            {email: email},
            {$unset: {otp: 1}}
        );
        return {
            code: 200,
            message: 'Right OTP',
            metadata: null
        }
    }
    static async sendOTP(email){
        try {
            const otpCode = await UserService.generateOTP(email);
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
                code: 201,
                message: 'Sent OTP',
                metadata: {
                    otpCode: otpCode,
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
