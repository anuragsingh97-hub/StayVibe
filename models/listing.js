const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const listingschema=new Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
    },
    image: {
        url: String,
        filename: String
    },
    price:{
        type: Number,
        required:true,
    },
    location:{
        type: String,
        required:true,
    },
    country:{
        type: String,
        required:true,
    }
});

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;