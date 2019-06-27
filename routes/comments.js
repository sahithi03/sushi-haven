var express = require("express");
var router = express.Router({mergeParams : true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new comment
router.get("/new",middleware.isLoggedIn,function(req,res){ 
    //find rest by id to attach comment
    Restaurant.findById(req.params.id,function(err,restaurant){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{restaurant : restaurant});
        }
    });
   
});

//create a comment
router.post("/",middleware.isLoggedIn,function(req,res){
    //look up rest
    // create new comment and attch it to restaurant
    Restaurant.findById(req.params.id,function(err, restaurant) {
        if(err){
            console.log(err);
            res.redirect("/restaurants");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong")
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    restaurant.comments.push(comment);
                    restaurant.save();
                    req.flash("success","Successfully added comment");
                    res.redirect('/restaurants/'+ restaurant._id);
                    
                }
            });
            
        }
    });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Restaurant.findById(req.params.id,function(err, foundRestaurant){
        if(err || !foundRestaurant){
            req.flash("error","Cannot find Restaurant");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err  || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }else {
                res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
                    }
        });
    });
   
});

//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/restaurants/" + req.params.id );
      }
   });
});

//DELETE ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req, res){
    //findByIdAndRemove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Successfully deleted");
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});




module.exports = router;