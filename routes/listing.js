const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingschema} =require("../schema.js");
//check form vlaidation
const validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
        if(error){
            throw new ExpressError(400, error);
        }
        else{
            next();
        }
};

//index rout
router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
}));
//create new listing
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new");
}));

//show rout
router.get("/:id", wrapAsync(async (req, res) => {
    const {id}=req.params;
    const listingdata = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listingdata });
}));


 //create rout
 router.post("/",validatelisting, wrapAsync(async(req, res,next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
        let newlisting=new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
}));


// edit rout
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));


//update rout
router.put("/:id",validatelisting, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete rout
router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listings");
}));

module.exports=router;