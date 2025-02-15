"use strict";

const expenseModel = require("../models/expense.model");
const {getInfoData, checkValidId, removeNullUndefinedAttribute} = require("../utils/index");

class FeeService {
    static getExpense = async ({pageSize=10, page=1}) => {
        const expenses = await expenseModel
        .find({})
        .sort({_id: -1})
        .skip((page-1)*pageSize)
        .limit(pageSize)

        return {
            code: 200,
            messages: "Get all expense list success",
            metadata: {
                expenses: expenses,
            }
        }
    };

    static findExpense = async ({expenseId}) => {
        if(!checkValidId(expenseId)){
            return {
                code: 400,
                message: "Invalid expenseId",
                metadata: {}
            }
        }

        const holderExpense = await expenseModel.findById(expenseId)
        if(!holderExpense){
            return {
                code: 404,
                message: "Cannot find expense with specific expenseId",
                metadata: null
            }
        }

        return {
            code: 200,
            message: "Get expense with specific expenseId success",
            metadata: getInfoData({fields: ["_id", "amount", "description", "category"], object: holderExpense})
        }
    }

    static searchExpense = async ({keySearch}) => {
        const regexSearch = new RegExp(keySearch)
        const results = await expenseModel.find(
            {$text: { $search: regexSearch}}
        )

        return {
            code: 200,
            message: "Result for search expense",
            metadata: {
                results: results
            }
        }
    }

    static addExpense = async ({amount, category, description, userId}) => {
        const newExpense = await expenseModel.create({
            userId: userId,
            amount: amount,
            description: description,
            category: category
        });

        if (newExpense) {
            return {
                code: 201,
                message: "Add expense success",
                metadata: {
                    expense: getInfoData({fields: ["_id", "amount", "description", "category"], object: newExpense})
                },
            };
        }

        return {
            code: 200,
            message: "Add expense failed",
            metadata: null,
        };

    };

    static deleteExpenseById = async({expenseId}) => {
        if(!checkValidId(expenseId)) {
            return {
                code: 400,
                message: "Invalid expenseId",
                metadata: null 
            }
        }

        const holderExpense = await expenseModel.findByIdAndDelete(expenseId)

        if(!holderExpense) {
            return {
                code: 404,
                message: "Cannot find document with specific expenseId",
                metadata: null
            }
        }

        return {
            code: 200,
            message: "Delete expense with specific expenseId success",
            metadata: {
                expense: getInfoData({fields: ["_id", "amount", "description", "category"], object: holderExpense})
            }
        }
    }

    static updateExpense = async({expenseId}, bodyUpdate) => {
        if(!checkValidId(expenseId)){
            return {
                code: 400,
                message: "Invalid expenseId",
                metadata: {}
            }
        }

        const updateAttribute = removeNullUndefinedAttribute(bodyUpdate);
        
        const holderExpense = await expenseModel.findOneAndUpdate({_id: expenseId}, updateAttribute, {new: true, runValidators: true})
        if(!holderExpense){
            return {
                code: 404,
                message: "Cannot find expense with specific expenseId",
                metadata: null
            }
        }

        return {
            code: 200,
            message: "Update success",
            metadata: getInfoData({fields: ["_id", "amount", "description", "category"], object: holderExpense})
        }
    }
}

module.exports = FeeService;
