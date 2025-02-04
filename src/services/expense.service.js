"use strict";

const expenseModel = require("../models/expense.model");
const {getInfoData} = require("../utils/index")

class FeeService {
    static getFee = async () => {
        return {
            code: 200,
            messages: "This is get fee from FeeService"
        };
    };

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
