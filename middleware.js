const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const expressError=require("./utils/expressError.js");

const {listingSchema, reviewSchema}=require("./schema.js");
  
  // Authentication before user can add listing
  module.exports.isLoggedIn = (req, res, next) => { 
     if(!req.isAuthenticated()){
      //redirect url where we need to redirect after login
      req.session.rediredUrl=req.originalUrl;
      req.flash("error","You must be logged to create the listing");
      return res.redirect("/login");
    }
    next();
  }

  module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.rediredUrl){
      res.locals.redirectUrl = req.session.rediredUrl;
    }
    next();
  }

  module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }

  module.exports.validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new expressError(400, errMsg);
  }else{
      next();
  }
};

module.exports.isAuthor= async(req,res,next)=>{
  let {id, reviewId}=req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","You did not created this review");
      return res.redirect(`/listings/${id}`);
  }
  next();
}