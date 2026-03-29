const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

// INDEX
router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
}));

// NEW
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listingdata = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listingdata) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listingdata });
}));

// CREATE
router.post("/", isLoggedIn, validatelisting, wrapAsync(async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;

    await newlisting.save();

    req.flash("success", "New listing created");
    res.redirect("/listings");
}));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit", { listing });
}));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, validatelisting, wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;