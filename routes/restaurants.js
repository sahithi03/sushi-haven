var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - shows all restaurants
router.get("/",function(req,res){
    // all restaurants from db
    Restaurant.find({},function(err,allRestaurants){
       if(err){
           console.log(err);
           
       } 
       else{
           res.render("restaurants/index",{restaurants: allRestaurants});
       }
    });
    
});
//CREATE a new restaurant

router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to restaurants array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newRestaurant = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to restaurants page
            console.log(newlyCreated);
            res.redirect("/restaurants");
        }
    });
  });
});
//NEW-form to create a new restaurant
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("restaurants/new");
});

//SHOW
//should always be at the end
router.get("/:id",function(req,res){
    //find rest by id and show info
    Restaurant.findById(req.params.id).populate("comments").exec(function(err,foundRestaurant){
       if(err || !foundRestaurant){
           req.flash("error","Restaurant not found");
           console.log(err);
           res.redirect("back");
       } 
       else{
           res.render("restaurants/show",{restaurant: foundRestaurant});
       }
    });
});
//edit restaurant
router.get("/:id/edit",middleware.checkRestaurantOwnership,function(req,res){
   
    Restaurant.findById(req.params.id,function(err,foundRestaurant){
               //if yes dis user create that restaurant
        res.render("restaurants/edit",{restaurant : foundRestaurant});  
                
            });
        });


//update restaurant
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.restaurant.lat = data[0].latitude;
    req.body.restaurant.lng = data[0].longitude;
    req.body.restaurant.location = data[0].formattedAddress;

    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, restaurant){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/restaurants/" + restaurant._id);
        }
    });
  });
});

//delete restaurant
router.delete("/:id", middleware.checkRestaurantOwnership,function(req, res){
   Restaurant.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/restaurants");
      } else {
          res.redirect("/restaurants");
      }
   });
});




module.exports = router;