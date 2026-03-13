const Listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema,Reviewschema} =require("./schema.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//check form vlaidation
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
        if(error){
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
};

//check review validation
module.exports.validateReview=(req,res,next)=>{
    let {error}=Reviewschema.validate(req.body);
        if(error){
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
};


module.exports.isreviewAuthor = async(req, res, next) => {
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};