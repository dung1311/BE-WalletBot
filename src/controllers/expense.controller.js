"use strict";

const { asyncHandler } = require("../auth/checkAuth");
const FeeService = require("../services/expense.service");

class FeeController {
    addExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.addExpense(req.body);
        return res.status(201).json(response);
    });

    getFee = asyncHandler(async (req, res, next) => {
        const response = await FeeService.getFee(req.query);
        return res.status(200).json(response);
    });
}

module.exports = new FeeController();
