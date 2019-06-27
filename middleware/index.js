var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next){
     //is user logged in at all
    if(req.isAuthenticated()){
            Restaurant.findById(req.params.id,function(err,foundRestaurant){
                if(err || !foundRestaurant){
                    console.log(err);
                    req.flash("error","Restaurant not found");
                    res.redirect("/restaurants");
                }
                else{
                    //if yes dis user create that restaurant
                    if(foundRestaurant.author.id.equals(req.user._id) || req.user.isAdmin){
                         next();
                    }
                    else{
                       req.flash("error","You don't have permission to do that");
                      res.redirect("back");
                    }
                  
                }
            });
        }
        else{
            req.flash("error","You need to be logged in to do that");
           res.redirect("back");
        }
    
}
    


middlewareObj.checkCommentOwnership = function(req, res, next){
     //is user logged in at all
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err || !foundComment){
                    
                    console.log(err);
                    req.flash("error","Comment not found");
                    res.redirect("back");
                }
                else{
                    //if yes dis user create that comment
                    if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                         next();
                    }
                    else{
                        req.flash("error","You don't have permission to do that");
                      res.redirect("back");
                    }
                  
                }
            });
        }
        else{
             req.flash("error","You need to be logged in to do that");
           res.redirect("back");
        }
    
}
    
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}


module.exports = middlewareObj