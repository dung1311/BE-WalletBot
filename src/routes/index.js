"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.use("/v1/api", require("./access"))
router.use("/expense", require("./expense"))

module.exports = router

