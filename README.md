# Sushi-Haven

This is a node.js web application for sushi lovers around world to share their favourite sushi restaurants.

## Front End 
* ejs
* Bootstrap

## Back End
* Node.js
* Express framework
* MongoDb database
* Mongoose for mongodb object modelling
* passport.js for handling authentication logic


All the required libraries and versions used are listed in the package.json file under dependencies
## Features
#### Authentication 
   - User login and password
   - Admin code for admin privileges
#### Authorization
   - One cannot add or edit a restaurant without being authenticated
   - One cannot add or edit a restaurant added by others
   - One cannot add or edit comments written by other users
#### Google maps
   - Google maps geocoding feature to display google maps for the address added by the user.
   
