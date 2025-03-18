const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.index = async (req, res) => {
    await Listing.find()
        .then((result) => {
            res.render("index.ejs", { result });
        })
        .catch((err) => {
            console.log(err)
        })
};

module.exports.new = (req, res) => {
    res.render("form.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
    populate({path:"reviews", populate:{path:"auther"}}) // nested populate
    .populate("owner");
    if (!listing) {
        req.flash("error", "listing your are looking was Deleted !");
        res.redirect("/listings");
    }
    res.render("show.ejs", { listing });
    // .catch((err) => {
    //     // console.log(err);
    // })
}

module.exports.postListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , " ", filename);

    let listing = req.body;
    listing.owner = req.user._id;
    listing.image = {url,filename};
    await new Listing(listing)
        .save()
        .then((result) => {
            console.log(result);
            console.log("added successfully....");
        });
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    await Listing.findById(req.params.id)
        .then((listing) => {
            res.render("edit.ejs", {listing});
        })
}

module.exports.updateListing = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
        req.flash("error", "listing your are looking was Deleted !");
        return res.redirect("/listings");
    }
    // if(res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id)){
    else{
        let {title, description, price } = req.body;
        let updatedListing = await Listing.findByIdAndUpdate(req.params.id, { title: title, description: description, price: price })
        if(req.file){
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = {url,filename};
            await updatedListing.save();
        }
        console.log(updatedListing);
        console.log("Saved Successfully ");
        res.redirect(`/listings/${req.params.id}`);
    }

    // .catch((err) => {
    //     res.send("could not update at this moment...");
    //     console.log(err);
    // })
}

module.exports.deleteListing =async (req, res) => {
    let id = req.params.id;
    console.log(id);

    // deleting corresponding reviews
    let listing = await Listing.findById(id);
    if(listing.reviews){
        for (let review of listing.reviews) {
            await Review.findByIdAndDelete(review);
        }
    }
    await Listing.findByIdAndDelete(id)
        .then(() => {
            req.flash("success", " Listing Deleted !");
            res.redirect("/listings");
        })

} 