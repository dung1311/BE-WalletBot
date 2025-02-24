"use strict";
const mongoose = require("mongoose");
const expenseModel = require("../models/expense.model");
const {getInfoData, checkValidId, removeNullUndefinedAttribute} = require("../utils/index");

class FeeService {
    static getExpense = async (Body, userId) => {
        if(!checkValidId(userId)) {
            return {
                code: 400,
                message: "Invalid expenseId",
                metadata: null 
            }
        }
        const {
            category,
            type,
            searchText,
            startDate,
            endDate,
            page, pageSize
        } = Body;


        if(!(page && pageSize)) {
            return {
                code: 400,
                message: "Page and PageSize are required",
                metadata: null 
            }
        }
        const filter = { userId };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (type) filter.type = type; 
        if (category) filter.category = category; 
        if (searchText) filter.description = { $regex: searchText, $options: 'i' };
        const sortOption = { ['createdAt']: -1 };
        try {
            let query = expenseModel.find(filter).sort(sortOption).skip((page-1)*pageSize).limit(pageSize);

            const expenses = await query;
            
            return {
                code: 200,
                metadata: {
                    Expenses: expenses,
                    message: "Successfully retrieved expense data"
                }
            };
        } catch (error) {
            return {
                code: 500,
                message: "Error retrieving expense data",
                error: error.message
            };
        }
    };
    
    // static getExpense = async ({pageSize=10, page=1}, userId) => {
    //     if(!checkValidId(userId)) {
    //         return {
    //             code: 400,
    //             message: "Invalid expenseId",
    //             metadata: null 
    //         }
    //     }

    //     const expenses = await expenseModel
    //     .find({userId: userId})
    //     .sort({_id: -1})
    //     .skip((page-1)*pageSize)
    //     .limit(pageSize)

    //     return {
    //         code: 200,
    //         messages: "Get all expense list success",
    //         metadata: {
    //             expenses: expenses,
    //         }
    //     }
    // };

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

    static addExpense = async (Body, userId) => {
        console.log(Body)
        const {
            amount,
            category,
            wallet,
            type,
            partner,
            description,
        } = Body;
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
            wallet: wallet,
            type: type,
            partner: partner,
            description: description,
            category: category  
        });

        if (newExpense) {
            return {
                code: 201,
                message: "Add expense success",
                metadata: {
                    expense: newExpense
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
            console.log(expenseId)
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
            metadata: holderExpense
        }
    }
    static getExpenseByAmount = async({amount, sinceBy = "2025-01-01"}, userId)=>{
        try{
            if(!checkValidId(userId)){
                return {
                    code: 400,
                    message: "Invalid user ID",
                    metadata: null,
                }
            }
            try{
                const timeToSearch = new Date(sinceBy);
                const expenseList = await expenseModel.find({
                    userId: userId,
                    amount: Number(amount),
                    createdAt: {$gte: timeToSearch},
                });
                return {
                    code: 200,
                    message: `"Get some expense with ${amount} since ${sinceBy}"`,
                    metadata: {
                        expense: expenseList,
                    }
                }
            }catch (e) {
                return {
                    code: 404,
                    message: "Can't get expense by amount"
                }
            }
            
        }catch (e) {
            return {
                code: 500,
                message: "Error processing expense list",
                metadata: null
            }
        }
    }
    static getExpenseByDate = async({from = "2025-01-01", to = "2029-01-01"}, userId)=>{
        try{
            if(!checkValidId(userId)){
                return {
                    code: 400,
                    message: "Invalid user ID",
                    metadata: null,
                }
            }
            try{
                const dateFrom = new Date(from);
                const dateTo = new Date(to);
                const expenseList = await expenseModel.find({
                    userId: userId, 
                    createdAt: {$gte:dateFrom},
                    updatedAt: {$lt:dateTo}
                });
                return {
                    code: 200,
                    message: `"Get some expense since ${dateFrom} to ${dateTo}"`,
                    metadata: {
                        expense: expenseList,
                    }
                }
            }catch(e){
                return {
                    code: 404,
                    message: "Can't get expense by date",
                    metadata: null,
                }             
            }
        }catch (err) {
            return {
                code: 500,
                message: "Error processing expense list",
                metadata: null
            }
        }
    }
    static getExpenseByCategory = async({category = "khác"}, userId)=>{
        try{
            if(!checkValidId(userId)){
                return {
                    code: 400,
                    message: "Invalid user ID",
                    metadata: null,
                }
            }
            try{
                const expenseList = await expenseModel.find({
                userId: userId, 
                category: category
                });
                return {
                    code: 200,
                    message: `"Get some expense by category"`,
                    metadata: {
                        expense: expenseList,
                    }
                }
            }catch(e) {
                return {
                    code: 404,
                    message: "can't get expense by category",
                    metadata: null
                }
            }
        }catch (err) {
                return {
                    code: 500,
                    message: "Error processing expense list",
                    metadata: null
                }
            }
    }
    static sortExpenses = async({option = 1}, userId) => {
        try{
            if(!checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid user ID",
                metadata: null,
            }
            }
            const optionSort = Number(option);
            try{
                const expenseList = await expenseModel.find({userId}).sort({amount: optionSort});
                return {
                    code: 200,
                    message: "Sorted expense list",
                    metadata: {
                        expense: expenseList,
                    }
                }
            }
            catch(err){
                return {
                    code: 404,
                    message: "Can't sort expense",
                    metadata: null,
                }
            }
        }
        catch (err) {
            return {
                code: 500,
                message: "Error processing expense list",
                metadata: null
            }
        }
    }
    static sortPartner = async({option = 1}, userId) => {
        try{
            if(!checkValidId(userId)){
            return {
                code: 400,
                message: "Invalid user ID",
                metadata: null,
            }
            }
            const optionSort = Number(option);
            const userObjectId = new mongoose.Types.ObjectId(userId);
            try{
                const expenseList = await expenseModel.aggregate([
                    {$match: {userId: userObjectId}},
                    {$group: {
                            _id: "$partner",
                            count: {$sum: 1},
                            amount: {$sum: "$amount"}  ,
                            list: {$push: {
                                amount: "$amount",
                                category: "$category",
                                description: "$description",
                            }}                      
                        }},
                    {$sort: {count: optionSort}},
                ])
                return {
                    code: 200,
                    message: "Sorted partner list",
                    metadata: {
                        expense: expenseList,
                    }
                }
            }
            catch(err){
                console.error(err);
                return {
                    code: 404,
                    message: "Can't sort partner list",
                    metadata: null,
                }
            }
        }
        catch (err) {
            return {
                code: 500,
                message: "Error processing expense list",
                metadata: null
            }
        }
    }
}

module.exports = FeeService;
