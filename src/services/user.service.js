"use strict";

const User = require("../models/user.model");
const {getInfoData} = require("../utils/index")
const bcrypt = require("bcryptjs");
const KeyTokenService = require("./keytoken.service");
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
        const newUser = await User.create({ name: name, email: email, password: password });
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
        const accessToken = KeyTokenService.generateAccessToken(payload);
        const refreshToken = KeyTokenService.generateRefreshToken(payload);

        let keyToken = await KeyTokenService.getKeyTokenById(user._id);
        if(!keyToken){
            keyToken = KeyTokenService.createKeyToken({
                userID: user._id,
                refreshToken: [refreshToken],
            });
        }
        else{
            await KeyTokenService.updateTokens(user._id, refreshToken);
        }
        res.status(200).json({ accessToken });
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
}
module.exports = UserService;
