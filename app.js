const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main()
  .then(() => console.log("connection successful"))
  .catch((err) => {
    console.log(err)
  });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/villaVista");
}


app.listen(8080, () => {
    console.log("Listening on port: 8080");
});


app.get("/", (req, res) => {
    res.send("i am root");
});