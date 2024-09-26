const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor}= require("../middleware.js");

const {createReview, destroyReview}= require("../controllers/reviews.js");
//Reviews
//Post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

//DELETE review route
router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(destroyReview));

module.exports=router;