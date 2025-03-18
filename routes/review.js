const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, reviewAuther } = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js")

// reviews posting route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.reviewPost));

//delete route for review
router.delete("/:review_id", isLoggedIn, reviewAuther, wrapAsync(reviewController.deleteReview));

module.exports = router;