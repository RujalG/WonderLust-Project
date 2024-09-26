const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}

module.exports.renderNewForm = async(req, res)=>{
    res.render("listings/newList.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested doesnot exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

// kDMr8yaQNCygbcpc rujalgandhi
//mongodb+srv://rujalgandhi:<db_password>@cluster0.nbaaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://rujalgandhi:kDMr8yaQNCygbcpc@cluster0.nbaaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

module.exports.createListing = async(req,res, next)=>{
    // let {title, description, image, price, location, country}=req.body;
    // let listing=req.body.listing;
    let url =req.file.path;
    let filename = req.file.filename;
    const newList= new Listing(req.body.listing);
    newList.owner= req.user._id;
    newList.image={url,filename};
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings"); 
}

module.exports.renderEdit = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesnot exists!");
        res.redirect("/listings");
    }
    let original_img = listing.image.url;
    original_img= original_img.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, original_img});
}

module.exports.updateListings = async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename = req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async(req,res)=>{
    let {id}=req.params;
   
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    req.flash("success","Listing Deleted");
    res.redirect(`/listings`);
}