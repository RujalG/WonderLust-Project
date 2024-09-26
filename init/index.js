const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB= async() =>{
    //Delete the db if any data present
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"66d2eadb108efc0649cc1808"}));
    await Listing.insertMany(initData.data);
    console.log("Data was saved");
};

initDB();