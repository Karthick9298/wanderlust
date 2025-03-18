const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const { isLoggedIn, isAuthorized, validateListing } = require("../middlewares.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("image") ,validateListing,wrapAsync(listingController.postListing))
    
// new form of create 
router.get("/new", isLoggedIn, listingController.new);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(upload.single("image") , validateListing,isLoggedIn, isAuthorized, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isAuthorized, upload.single("image"), wrapAsync(listingController.deleteListing))

// get individual route
router.get("/edit/:id", isLoggedIn, isAuthorized, wrapAsync(listingController.editListing))

module.exports = router;


