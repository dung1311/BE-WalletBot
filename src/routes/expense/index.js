"use strict";

const express = require("express");
const router = express.Router();
const feeController = require("../../controllers/expense.controller");
const authenticate = require("../../middleware/authMiddleware")

// midleware
router.use(authenticate)

router.get("/get-expense", feeController.getExpense);
router.get("/:expenseId", feeController.findExpense)
router.get("/search/:keySearch", feeController.searchExpense)

router.post("/add-expense", feeController.addExpense)

router.delete("/:expenseId", feeController.deleteExpense)

router.patch("/:expenseId", feeController.updateExpense)

module.exports = router;

