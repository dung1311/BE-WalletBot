"use strict";

const expenseModel = require("../models/expense.model");
const {getInfoData, checkValidId, removeNullUndefinedAttribute} = require("../utils/index");

class FeeService {
    static getFee = async (Body) => {
        console.log(Body);
        const {
            userId,
            category,
            searchText,
            startDate,
            endDate,
            limit
          } = Body;
        const filter = { userId };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (category) filter.category = category; 
        if (searchText) filter.description = { $regex: searchText, $options: 'i' };
        const sortOption = { ['createdAt']: -1 };
        try {
            let query = expenseModel.find(filter).sort(sortOption);

            if (limit) {
                query = query.limit(limit);
            }
            
            const expenses = await query;
            
            return {
                code: 200,
                metadata: {
                    Expenses: expenses,
                    message: "Successfully retrieved fee data"
                }
            };
        } catch (error) {
            return {
                code: 500,
                message: "Error retrieving fee data",
                error: error.message
            };
        }
    };
    
    static getExpense = async ({pageSize=10, page=1}, userId) => {
        if(!checkValidId(userId)) {
            return {
                code: 400,
                message: "Invalid expenseId",
                metadata: null 
            }
        }

        const expenses = await expenseModel
        .find({userId: userId})
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

    static findExpense = async ({expenseId}, userId) => {
        if(!checkValidId(expenseId) || !checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid expenseId or userId",
                metadata: {}
            }
        }

        const holderExpense = await expenseModel.find({_id: expenseId, userId: userId})
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

    static searchExpense = async ({keySearch}, userId) => {
        if(!checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid userId",
                metadata: {}
            }
        }

        const regexSearch = new RegExp(keySearch)
        const results = await expenseModel.find(
            {userId: userId, $text: { $search: regexSearch}}
        )

        return {
            code: 200,
            message: "Result for search expense",
            metadata: {
                results: results
            }
        }
    }

    static addExpense = async ({amount, category, description}, userId) => {
        if(!checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid userId",
                metadata: null 
            }
        }
        const newExpense = await expenseModel.create({
            userId: userId,
            amount: amount,
            // wallet: wallet,
            // type: type,
            // partner: partner,
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

    static deleteExpenseById = async({expenseId}, userId) => {
        if(!checkValidId(expenseId) || !checkValidId(userId)) {
            return {
                code: 400,
                message: "Invalid expenseId or userId",
                metadata: null 
            }
        }

        const holderExpense = await expenseModel.findOneAndDelete({_id: expenseId, userId: userId});

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

    static updateExpense = async({expenseId}, bodyUpdate, userId) => {
        if(!checkValidId(expenseId) || !checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid expenseId or userId",
                metadata: {}
            }
        }

        const updateAttribute = removeNullUndefinedAttribute(bodyUpdate);
        
        const holderExpense = await expenseModel.findOneAndUpdate({_id: expenseId, userId: userId}, updateAttribute, {new: true, runValidators: true})
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
