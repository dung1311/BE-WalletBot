"use strict";

const { mongoose, model, Schema, Types } = require("mongoose");
const { default: slugify } = require("slugify");

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
    expense_slug: String
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// middleware to save slug for search 
expenseSchema.pre("save", function(next) {
  // check if description is changed 
  if(this.isModified("description")) {
    this.expense_slug = slugify(this.description, {lower: true});
  }
  next();
})

expenseSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  if (update.description) {
    update.expense_slug = slugify(update.description, {lower: true});
  }
  next();
})
// create index
expenseSchema.index({expense_slug: "text", description: "text"});

module.exports = model(DOCUMENT_NAME, expenseSchema);
