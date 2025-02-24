"use strict";

const express = require("express");
const router = express.Router();
const feeController = require("../../controllers/expense.controller");
const {authenticate, authenticateV2} = require("../../middleware/authMiddleware")


// midleware
router.use(authenticateV2)
router.get("/getExpenseByAmount", feeController.getExpenseByAmount);
router.get("/getExpenseByDate", feeController.getExpenseByDate);
router.get("/getExpenseByCategory", feeController.getExpenseByCategory);
router.get("/sortExpenses", feeController.sortExpenses);
router.get("/sortPartner", feeController.sortPartner);
router.get("/get-expense", feeController.getExpense);
router.get("/:expenseId", feeController.findExpense)
router.get("/search/:keySearch", feeController.searchExpense)

router.post("/add-expense", feeController.addExpense)

router.delete("/:expenseId", feeController.deleteExpense)

router.patch("/:expenseId", feeController.updateExpense)


module.exports = router;

