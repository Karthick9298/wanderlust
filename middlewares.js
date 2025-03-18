const Listing = require("./models/listing");
const ExpressError = require("./utils/expressErrros.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // not logged in then store the redirect url after login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must login/signIn ");
        res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthorized = async (req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are Not Owner for this Listing");
        res.redirect(`/listings/${req.params.id}`);
    }
    next();
}

// module.exports.validateListing = (req, res, next) => {
//     let listing = req.body;
//     let  url = req.file.path;
//     let filename = req.file.filename;
//     listing.image.url = url;
//     listing.image.filename = filename;

//     let result = listingSchema.validate(listing);

//     if (result.error) {
//         next(new ExpressError(404, result.error.message));  // Pass error to next()
//     } else {
//         next();
//     }
// }
module.exports.validateListing = (req, res, next) => {
    let listing = req.body;

    // Check if file is uploaded and then set image properties
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    // Validate using Joi
    let result = listingSchema.validate(listing, { abortEarly: false });  // Optionally set abortEarly to false for all errors

    if (result.error) {
        // Use next() to pass the error to the global error handler
        // console.log(result.error);
        next(new ExpressError(404, result.error.details.map(detail => detail.message).join(", ")));
    } else {
        next();  // No validation error, proceed to the next middleware
    }
}


module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    
    if (result.error) {  // Fix: No need for error.error
        // console.log(result);
        // let errMsg = result.details.map((el) => el.message).join(",");
        throw new ExpressError(400, result.error.message);
    } else {
        next();
    }
};

module.exports.reviewAuther = async (req,res,next)=>{
    let review = await Review.findById(req.params.review_id);

    let reviewAutherId = review.auther._id;
    let loggedInUserId = req.user._id;

    if (!reviewAutherId.equals(loggedInUserId)) {
        req.flash("error","You are Not Author of this Review");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
}
