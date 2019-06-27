require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Restaurant = require("./models/restaurant.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var restaurantRoutes = require("./routes/restaurants");
var indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost/sushi_haven",{useNewUrlParser: true});//connects to db(creates a db if not present)
mongoose.connect("mongodb+srv://sahithi_03:mongodbatlas@123@cluster0-yoonv.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log("ERROR", err.message);
});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
     secret: "Joey is the cutest",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/",indexRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use("/restaurants",restaurantRoutes);


app.listen(process.env.PORT, process.env.IP,function(){
   console.log("sushihaven server has started");
});