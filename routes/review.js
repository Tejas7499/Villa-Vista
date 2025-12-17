const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validatereview, isLoggedIn, isReviewAuthor} = require("../middleware.js");



/*Reviews Post route*/
router.post("", isLoggedIn, validatereview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  await listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  req.flash("success", "Review created !");  
  res.redirect(`/listings/${listing._id}`);
}))

/* Reviews Delete request */
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted !");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;


