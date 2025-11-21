const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


/* "listing Schema Validation" */
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  }else {
    next();
  }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/",validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing })
}));

router.put("/:id", wrapAsync(async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing})
  res.redirect(`/listings/${id}`); 
}));

/* delete route */
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;