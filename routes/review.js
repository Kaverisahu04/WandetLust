const express = require("express");
const router = express.Router(mergeParams = true);
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js")


//Post Review Routes
router.post("/", validateReview, wrapAsync(async (req, res) => {
  console.log(req.params.id);
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  // console.log("Review added successfully");
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

// Delete Review Route
router.post("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  
  res.redirect(`/listings/${id}`);
}));


module.exports = router;