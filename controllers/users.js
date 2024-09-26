const User = require("../models/user.js");
module.exports.renderSignUpForm =(req, res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp=async(req, res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser = new User ({email, username});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }catch(e){
        console.log("Duplicate");
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm =(req, res)=>{
    res.render("user/login.ejs");
}

module.exports.login= async(req, res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl );
}

module.exports.logout=(req, res)=>{
    req.logout((err) =>{
        if(err){
            // this will triggered in only case when passport faces some issues.
            return next(err);
        }
        req.flash("success","Logged you out!")
        res.redirect("/listings");
    })
}