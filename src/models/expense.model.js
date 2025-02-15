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
    wallet: {
      type: String,
      required: true,
    },
    partner: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Gửi", "Nhận"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Giải trí", "Mua sắm", "Di chuyển", "Sức khỏe", "Khác"],
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
