"use strict";

const express = require('express');
const morgan = require('morgan');
const app = express();
const helmet = require('helmet');
const compression = require('compression');

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init db
// require('./dbs/init.mongodb');

// index route
app.use("/", require('./routes/index'));

// handle errors
// app.use((req, res, next) => {
//     const error = new Error("Not Found");
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) => {
//     const statusCode = error.status || 500;
//     return res.status(statusCode).json({
//         status: "error",
//         code: statusCode,
//         message: error.message || "Internal Server error"
//     })
// });

module.exports = app;