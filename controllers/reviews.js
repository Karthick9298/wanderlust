const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.reviewPost = async (req, res) => {
    let review = req.body;
    review.auther = req.user._id;

    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(review).save()

    console.log(listing);
    console.log(newReview);
    listing.reviews.push(newReview._id)
    await listing.save();

    console.log(listing);
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let reviewId = req.params.review_id;
    let listingId = req.params.id;

    let review = await Review.findById(reviewId);

    await Review.deleteOne({ _id: review._id });
    let listing = await Listing.findById(listingId)
    let arr = listing.reviews;
    listing.reviews = arr.filter(id => id != reviewId);
    await listing.save();

    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${listingId}`);
}
