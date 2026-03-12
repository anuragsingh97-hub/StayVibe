const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {Reviewschema} =require("../schema.js");
const Review=require("../models/review.js");

//check review validation
const validateReview=(req,res,next)=>{
    let {error}=Reviewschema.validate(req.body);
        if(error){
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
};
//review rout
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review added");

    res.redirect(`/listings/${listing._id}`);
}));
//delete review rout
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;