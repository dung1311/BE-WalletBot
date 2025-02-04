"use strict";

const express = require("express");
const router = express.Router();
const feeController = require("../../controllers/expense.controller");

router.get("/get_fee", feeController.getFee);
router.post("/add_fee", feeController.addExpense)

module.exports = router;
