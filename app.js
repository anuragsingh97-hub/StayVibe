const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/stayvibe";
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

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


//show rout
app.get("/listing/:id", async (req, res) => {
    const {id}=req.params;
    const listingdata = await Listing.findById(id);
    res.render("listings/index", { listingdata });
});

app.listen(8080,()=>{
    console.log("server running");
});