const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/stayvibe";
const path=require("path");
const methodOverride=require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(()=>{
    console.log("connected database");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//index rout
app.get("/listing", async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
});
//create new listing
app.get("/listings/new", async (req, res) => {
    res.render("listings/new");
});

//show rout
app.get("/listings/:id", async (req, res) => {
    const {id}=req.params;
    const listingdata = await Listing.findById(id);
    res.render("listings/show", { listingdata });
});

 //
 app.post("/listings", async (req, res) => {
    let newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
});

// edit rout
app.get("/listings/:id/edit", async (req, res) => {
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
});

//update rout
app.put("/listings/:id", async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete rout
app.delete("/listing/:id",async(req,res)=>{
    const {id}=req.params;
    const deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
})
app.listen(8080,()=>{
    console.log("server running");
});