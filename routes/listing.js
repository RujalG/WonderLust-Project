const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// const listingController  = require("../controllers/listings.js");

const { index, renderNewForm, showListing, createListing, renderEdit, updateListings, destroyListing } = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

//Router.route for index page
router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(createListing));
//validateListing
//New route
router.get("/newList", isLoggedIn, wrapAsync(renderNewForm));

//Router.route for show, delete update route with path as /:id
router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(updateListings))
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEdit));


module.exports = router;


