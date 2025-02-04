"use strict";

const { mongoose, model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Expense";
const COLLECTION_NAME = "Expenses";

const expenseSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["quần áo", "sách vở", "ăn uống", "giải trí", "khác"],
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, expenseSchema);
