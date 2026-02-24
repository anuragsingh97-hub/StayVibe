const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/stayvibe";
const path=require("path");
const methodOverride=require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema} =require("./schema.js")


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


//check vlaidation
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
app.get("/listing", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
}));
//create new listing
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new");
}));

//show rout
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const {id}=req.params;
    const listingdata = await Listing.findById(id);
    res.render("listings/show", { listingdata });
}));


 //create rout
 app.post("/listings",validatelisting, wrapAsync(async(req, res,next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
        let newlisting=new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listing");
}));


// edit rout
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));


//update rout
app.put("/listings/:id",validatelisting, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete rout
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("server running");
});