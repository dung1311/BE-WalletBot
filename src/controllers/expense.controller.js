"use strict";

const { asyncHandler } = require("../auth/checkAuth");
const FeeService = require("../services/expense.service");

class FeeController {
    addExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.addExpense(req.body, req.user.id);
        return res.status(response.code).json(response);
    });

    getFee = asyncHandler(async (req, res, next) => {
        const response = await FeeService.getFee(req.query);
        return res.status(200).json(response);
    });
    getExpense = asyncHandler(async (req, res, next) => {
        // console.log(req.user.id)
        const response = await FeeService.getExpense({}, req.user.id);
        return res.status(response.code).json(response);
    });

    findExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.findExpense(req.params)
        return res.status(response.code).json(response)
    })

    searchExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.searchExpense(req.params, req.user.id)
        return res.status(response.code).json(response)
    })

    deleteExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.deleteExpenseById(req.params, req.user.id);
        return res.status(response.code).json(response)
    })

    updateExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.updateExpense(req.params, req.body, req.user.id);
        return res.status(response.code).json(response)
    })
}

module.exports = new FeeController();
