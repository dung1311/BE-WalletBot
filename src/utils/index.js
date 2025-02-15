"use strict";

const _ = require("lodash");
const { default: mongoose } = require("mongoose");

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

module.exports = {
    getInfoData,
    checkValidId,
    removeNullUndefinedAttribute
}