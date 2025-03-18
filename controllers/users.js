
const User = require("../models/user.js");

module.exports.signUp =  (req, res) => {
    res.render("../users/signup.ejs");
}

module.exports.signUpPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registredUser = await User.register(newUser, password);
        console.log(registredUser);

        req.login(registredUser, (err)=>{
            if(err){
                return next(err);
            }            
            else{
                req.flash("success","Welcome to wanderlust");
                res.redirect("/listings");
            }
        })
        // req.flash("success", "user registred sucessfully ");
        // res.redirect("/listings");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.logIn = (req,res)=>{
    res.render("../users/login.ejs");
}

module.exports.logInPost = async (req,res)=>{
    req.flash("success","Welcome to wanderlust ! you are logged in ");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }   
}

module.exports.logOut = async (req,res,next)=>{
    console.log("I am executed ....");
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success", "User logged Out successfully");
            res.redirect("/listings");
        }
    })
}