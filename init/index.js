/* const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log(err);
  });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/villaVista")
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69255e5f9ad2ea056e837055" }))
    await Listing.insertMany(initData.data);
    console.log("data was initaialized");
};

initDB(); */