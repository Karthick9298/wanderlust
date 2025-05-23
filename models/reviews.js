const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    auther:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Review = mongoose.model("Review", reviewSchema); // Corrected: use mongoose.model, not mongoose.Model
module.exports = Review;