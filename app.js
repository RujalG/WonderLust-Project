//NODE_ENV is set for env.. and we ideally dont send .env file to prod and what the config other than prod
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express=require("express");
const ejsMate= require('ejs-mate');
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const expressError=require("./utils/expressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbURL=process.env.ATLASTDB_URL;

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
       secret: process.env.SECRET,
     },
   touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session store", err);
})

const sessionOptions={
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

// app.get("/", (req , res)=>{
//     res.send("I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"student",
//     })
//     const registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req, res, next)=>{
    next(new expressError(404,"Page not found!"))
});

// Error handling middleware
app.use((err,req,res, next)=>{
    let{statusCode=500, message="Something went wrong"}= err;;
    res.status(statusCode).render("error.ejs",{err})
    // res.status(statusCode).send(message);
    // res.send("Some thing went wrong");
});

app.listen(8080, () => {
    console.log("server is listening");
})