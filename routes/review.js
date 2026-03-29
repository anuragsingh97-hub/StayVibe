const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js");
//review rout
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    console.log("Review Object:", newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added");

    res.redirect(`/listings/${listing._id}`);
}));
//delete review rout
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;