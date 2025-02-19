'use strict';
const {client} = require('../dbs/init.redis.js');
const random = require('lodash');
const userModel = require('../models/user.model.js');
class OTPService {
    static async generateOTP(email){
        try{
            const otpCode = random.random(100000, 999999).toString();
            const user = await userModel.findOne({email});
            if(!user) return 0;
            await client.setEx(`otp:${email}`, 300, otpCode);
            const check = await client.get(`otp:${email}`) ;
            console.log(check);
            return otpCode;
        }catch(error){
            throw new Error(error);
        }  
    }
    static async verifyOTP(email, otpCode){
        const user = await userModel.findOne({email});
        const otpClient = await client.get(`otp:${email}`);
        if(!otpClient) return {
            code: 400,
            message: 'Expired OTP',
            metadata: null
        };
        if(otpClient !== otpCode) return {
            code: 200,
            message: 'Wrong OTP',
            metadata: null
        }
        await client.del(`otp:${email}`);
        return {
            code: 200,
            message: 'Right OTP',
            metadata: null
        }
    }
}
module.exports = OTPService