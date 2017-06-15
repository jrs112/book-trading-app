//Display Listings for specific user
$(document).ready(function() {

var listingCont = $("#listingCont");
var url = window.location.search;
var userId;

if(url.indexOf("?email=") !== -1) {
		userId = url.split("=")[1];
		getPosts(userId);
	}
else {
	alert("No posts for this user!");
	}

//Display offers for a specific user's listings
// if(url.indexOf("?offer=") !== false) {
// 		userId = url.split("=")[1];
// 		getOffers(userId);
// 	}
// else {
// 	alert("No posts for this user!");
// 	}


function getPosts(email) {
    userId = email || "";
    if (userId) {
      userId = "/?email=" + userId;
    }
    $.get("/api/listings" + userId, function(data) {
      listings = data;
      if (!listings || !listings.length) {
        displayEmpty(email);
      }
      else {
        initializeRows();
      }
    });
  }

  // function getOffers(email) {
  //   userOffers = email || "";
  //   if (userId) {
  //     userId = "/?email=" + userId; && userOffers === true
  //   }
  //   $.get("/api/listings" + userId, function(data) {
  //     listings = data;
  //     if (!listings || !listings.length) {
  //       displayEmpty(email);
  //     }
  //     else {
  //       initializeRows();
  //     }
  //   });
  // }


function initializeRows() {
    listingCont.empty();
    var listingArr = [];
    for (var i = 0; i < listingArr.length; i++) {
      listingArr.push(createNewListingRow(posts[i]));
    }
    listingCont.append(listingArr);
  }

function createNewListingRow(post) {
    //Listing panel and heading
    var newListingPanel = $("<div>");
    newListingPanel.addClass("panel panel-default");

    var newListingPanelHeading = $("<div>");
    newListingPanelHeading.addClass("panel-heading");

    var newListingPanelBody = $("<div>");
    newListingPanelBody.addClass("panel-body");

    //Edit and delete buttons
    var deleteBtn = $("<button>");
    deleteBtn.text("Remove Listing");
    deleteBtn.addClass("delete btn btn-danger");

    var editBtn = $("<button>");
    editBtn.text("Edit Listing");
    editBtn.addClass("edit btn btn-info");


    var newListingTitle = $("<h2>");
    var newListingAuthor = $("<h3>");
    var newListingGenrePref = $("<h3>");
    var newListingUser = $("<h5>");
    newListingTitle.text(post.Listing.title + " ");
    newListingAuthor.text("Author: " + post.Listing.author);
    newListingAuthor.text("Preferred Genre to Trade: " + post.Listing.preferred_genre);
    newListingUser.text("Posted by: " + post.User.email);
  
    //Append buttons to screen
    newListingPanelHeading.append(deleteBtn);
    newListingPanelHeading.append(editBtn);
    newListingPanelHeading.append(newListingTitle);

    newListingPanelBody.append(newListingAuthor);
    newListingPanelBody.append(newListingGenrePref);
    newListingPanelBody.append(newListingUser);

    newListingPanel.append(newListingPanelHeading);
    newListingPanel.append(newListingPanelBody);
    newListingPanel.data("post", post);

    return newListingPanel;
  }






//Display Offers for a specific user







