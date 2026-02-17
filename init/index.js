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
    await Listing.insertMany(Alldata.data);
}

initDB();