const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const Alldata =require("./data.js");
const MONGO_URL="mongodb://127.0.0.1:27017/stayvibe";

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

const initDB=async()=>{
    await Listing.deleteMany({});
    Alldata.data=Alldata.data.map((obj)=>({...obj,owner:"69b25b6e878cb443c6278438"}));
    await Listing.insertMany(Alldata.data);
    console.log("data initialized");
}

initDB();