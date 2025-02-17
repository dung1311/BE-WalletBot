const { mongoose, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      }
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
