var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Sushi Den", 
        image: "https://images.unsplash.com/photo-1532347231146-80afc9e3df2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "If you can get here for happy hour, you will not be disappointed. You get to save money so that you can order more. I didn't expect to make happy hour, more or less even stay till closing. That just shows how much we enjoyed staying here. The waitstaff was awesome. They were very quick to respond to what we wanted to order and very friendly even as the night went on. "
    },
    {
        name: "Haiku", 
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "Ok so you want good sushi and avoid the lines on Ventura, check out this place on Riverside and Coldwater. These guys have the fast food sushi place Sushi don.  I always wondered how their fish was always so fresh and now realize they bring it in from this sushi restaurant.  Asahi on tap but craft beer from Japan (try Kawaba Snow Weizen). Beef tongue was grilled well. And the fish is very fresh. The sushi rice is well seasoned. The price is right but the portions are small"
    },
    {
        name: "Sushi Paradise", 
        image: "https://images.unsplash.com/photo-1548907368-35e5ea8cbc8a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "Came here for the first time today.  I absolutely love the food!  Tried the lunch special teriyaki chicken with tempura and it was delicious.  Tempura was freshly fried and teriyaki hits the spot.  Miso soup is great!"
    }
]
 
function seedDB(){
   //Remove all restaurants
   Restaurant.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed restaurants!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few restauarnts
            data.forEach(function(seed){
                Restaurant.create(seed, function(err, restaurant){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a restaurant");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great!!!",
                                author: "Bart"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    restaurant.comments.push(comment);
                                    restaurant.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;