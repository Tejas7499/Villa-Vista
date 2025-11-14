const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpresError.js");
const { lsitingSchema } = require("./schema.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => console.log("connection successful"))
  .catch((err) => {
    console.log(err)
  });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/villaVista");
};


const validateListing = (req, res, next) => {
  let { error } = lsitingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  }else {
    next();
  }
}

app.get("/", (req, res) => {
  res.redirect("/listings")
})

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing })
}));

app.put("/listings/:id", wrapAsync(async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing})
  res.redirect(`/listings/${id}`); 
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode=500, message="Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", {message})
});


app.listen(8080, () => {
    console.log("Listening on port: 8080");
});