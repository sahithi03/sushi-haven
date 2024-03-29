var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root
router.get("/",function(req,res){
    res.render("landing");
});

//AUTH ROUTES
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
   /* if(req.body.adminCode === ''){
        newUser.isAdmin = true;
    } */
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to Sushi Haven " + user.username);
           res.redirect("/restaurants"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
//app.post(route,middleware,callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged you out");
   res.redirect("/restaurants");
});
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
