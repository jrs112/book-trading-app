var db = require("../models");

module.exports = function(app) {


//Pull all listings
app.get("/api/listings", function(req, res) {
    var query = {};
    if (req.query.email) {
      query.email = req.query.email;
    }
    // 1. Add a join here to include all of the Authors to these posts
    db.Listing.findAll({
      include: [db.User],
      where: query
    }).then(function(booksDb) {
      res.json(booksDb);
    });
});

//Pull a specific post
app.get("/api/listings/:id", function(req,res) {
	db.Listing.findOne({
		include: [db.User],
		where: {
			id: req.params.id
		}
	}).then(function(booksDb) {
		res.json(booksDb);
	});
});

//Create a listing
app.post("/api/newlisting", function(req, res) {

    console.log(req.body);
    db.Listing.create({
      title: req.body.title,
      author: req.body.author,
      preferred_genre: req.body.genre,
      UserId: req.body.UserId
    });

  });

//Delete a listing
app.post("/api/delete/:id",function(req, res) {
	db.Listing.destroy({
		where: {
			id: req.params.id
		}
	}).then(function(booksDb) {
		res.json(booksDb);
	});
});

//Update Listing
app.put("/api/listings", function(req, res) {
    db.Listing.update(
	req.body,
	{
		where: {
			id: req.body.id
		}
	}).then(function(booksDb) {
		res.json(booksDb);

	});
  });
};