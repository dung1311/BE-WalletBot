"use strict";

const { asyncHandler } = require("../auth/checkAuth");
const FeeService = require("../services/expense.service");

class FeeController {
    addExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.addExpense(req.body);
        return res.status(response.code).json(response);
    });

    getExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.getExpense({});
        return res.status(response.code).json(response);
    });

    findExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.findExpense(req.params)
        return res.status(response.code).json(response)
    })

    searchExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.searchExpense(req.params)
        return res.status(response.code).json(response)
    })

    deleteExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.deleteExpenseById(req.params);
        return res.status(response.code).json(response)
    })

    updateExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.updateExpense(req.params, req.body);
        return res.status(response.code).json(response)
    })
}

module.exports = new FeeController();
