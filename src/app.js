"use strict";

const express = require('express');
const morgan = require('morgan');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const {redisSession,RedisConnection} = require('./dbs/init.redis.js');
// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init db

require('./dbs/init.mongodb');
RedisConnection.connect(); app.use(redisSession)
// index route
app.use("/", require('./routes/index'));


module.exports = app;