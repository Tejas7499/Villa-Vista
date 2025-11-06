const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");

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


app.get("/test", async (req, res) => {
    let testData = new listing({
        title: "tejas ki kahani",
        description: "by the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });
    
    await testData.save();
    console.log("sample was saved");
    res.send("successful testing");
});