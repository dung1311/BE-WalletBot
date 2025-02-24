"use strict";

const { asyncHandler } = require("../auth/checkAuth");
const FeeService = require("../services/expense.service");

class FeeController {
    addExpense = asyncHandler(async (req, res, next) => {
        const response = await FeeService.addExpense(req.body, req.user.id);
        return res.status(response.code).json(response);
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

    getExpenseByAmount = asyncHandler(async (req, res) => {
        const response = await FeeService.getExpenseByAmount(req.query, req.user.id );
        return res.status(response.code).json(response);
    })

    getExpenseByDate = asyncHandler(async (req, res) => {
        const response = await FeeService.getExpenseByDate(req.query, req.user.id);
        return res.status(response.code).json(response);
    })

    getExpenseByCategory = asyncHandler(async (req, res) => {
        const response = await FeeService.getExpenseByCategory(req.query, req.user.id);
        return res.status(response.code).json(response);
    })

    sortExpenses = asyncHandler(async (req, res) => {
        const response = await FeeService.sortExpenses(req.query, req.user.id);
        return res.status(response.code).json(response);
    })

    sortPartner = asyncHandler(async (req, res) => {
        const response = await FeeService.sortPartner(req.query, req.user.id);
        return res.status(response.code).json(response);
    })

}

module.exports = new FeeController();
