"use strict";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { db: { host, port, name } } = require("../configs/config.mongodb");
// const CONNECT_STRING_DB = `mongodb://${host}:${port}/${name}`;
const CONNECT_STRING_DB = process.env.DB_CLOUD

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    // dev environment
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    
    mongoose
      .connect(CONNECT_STRING_DB)
      .then((_) => {
        console.log("Database connection successful");
      })
      .catch(err => {console.error("Database connection error", err)});
  }

  static getInstance() {
    if (!Database.instance) {
        Database.instance = new Database();
    }

    return Database.instance;
  }

}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
