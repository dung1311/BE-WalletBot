"use strict";
const nodemailer = require("nodemailer");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");
const { subtle } = require("crypto");

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

const checkValidId = (Id) => {
    return mongoose.Types.ObjectId.isValid(Id)? true : false
}

const removeNullUndefinedAttribute = (obj) => {
    Object.keys(obj).forEach(
        key => {
            if(obj[key] === null || obj[key] === undefined){
                delete obj[key];
            }
        }
    )

    return obj;
}

    const sendEmail = async(content, to) =>{
        try {
            const transporter = nodemailer.createTransport(
                {
                    host: process.env.EMAIL_SERVER,
                    port: Number(process.env.EMAIL_PORT),
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_HOST,
                        pass: process.env.EMAIL_APP_PASSWORD,
                    },
                    
                }
            ) ;

            const mail = {
                from: '"Support Team"  <${process.env.EMAIL_HOST}>',
                to: to,
                subject: "OTP",
                text: content,
            }
            await transporter.sendMail(mail) ;
        }catch(err){
            console.log(err) ;
        }
    }

module.exports = {
    getInfoData,
    checkValidId,
    removeNullUndefinedAttribute,
    sendEmail
}