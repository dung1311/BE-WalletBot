"use strict";

const expenseModel = require("../models/expense.model");
const {getInfoData} = require("../utils/index")

class FeeService {
    static getFee = async (Body) => {
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
    

    static addExpense = async ({amount, wallet, partner, type, category, description, userId}) => {
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
                metadata: {
                    expense: getInfoData({fields: ["_id", "amount", "description", "category"], object: newExpense})
                },
            };
        }

        return {
            code: 200,
            metadata: null,
        };

    };

}

module.exports = FeeService;
