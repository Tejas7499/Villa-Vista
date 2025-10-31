const express = require("express");
const app = express();
const mongoose = require("mongoose");


app.listen(8080, () => {
    console.log("Listening on port: 8080");
});


app.get("/", (req, res) => {
    res.send("i am root");
});