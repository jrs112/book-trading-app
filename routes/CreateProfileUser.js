var path = require("path");
var db = require("../models");
var passport = require("../config/passport");
var expressValidator = require('express-validator');
module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
   app.post("/api/login", passport.authenticate("local"), function(req, res) {

    console.log(req.body);

    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
   res.json("/members");
  });
 
    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/New", function(req, res,next) {
     
        req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody('password', "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
        req.checkBody('password2', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody('password2', 'Passwords do not match, please try again.').equals(req.body.password);
        const errors = req.validationErrors();
        if (errors) {
           throw console.log(errors);

        }
        else {
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.firstName,
            last_name: req.body.lastName

        });
        //.then(function() {
        //   console.log("ok");
        //   res.redirect("/members");
        // })
        // .catch(function(err) {
        //   res.json(err);
        // });
        console.log("ok");
        res.redirect("/members");
      }
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

}
