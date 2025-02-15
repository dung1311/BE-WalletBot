"use strict";

const User = require("../models/user.model");
const {getInfoData} = require("../utils/index")
const bcrypt = require("bcryptjs");
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
    static async registerUser({ name, email, password }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
    
        await newUser.save();
        
        return newUser;
    }
}
module.exports = UserService;
