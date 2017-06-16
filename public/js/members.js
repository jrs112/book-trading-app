
$(document).ready(function() {

  $.get("/api/userinfo", function(req) {
    console.log(req);

    var listingCont = $("#listingCont");
    var offerCont = $("#offerCont");
    $(document).on("click", "button.delete", handlePostDelete);

    var url = window.location.search;
    var userId;


//Display Listings for specific user

 $.get("/api/listings", function(data) {
            createNewListingRow(data);
});

 $.get("/api/listings", function(data) {
            createNewOfferRow(data);
 });


//Delete Listing Functions
function deleteListing(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/listings/" + id
    })
    .done(function() {
      getPosts(postCategorySelect.val());
    });
  }

function handlePostDelete() {
    var currentListing = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentListing.id);
  }

//Append listings to listing pane in HTML

function createNewListingRow(data) {
    for (var i = 0; i < data.length; i++) {
          if(data[i].UserId === req.id) {

    //Listing panel and heading
    var newWell = $("<div>");
        newWell.addClass("well");
        newWell.attr("id","userListing-" + i);
        listingCont.append(newWell);
        $("#userListing-" + i).append("<h2>Title: " + data[i].title + "</h2>");
        $("#userListing-" + i).append("<h2>Author: " + data[i].author + "</h2>");
        $("#userListing-" + i).append("<h2>Looking to trade for: " + data[i].preferred_genre + "</h2>");
        $("#userListing-" + i).append("<h2>Posted By: " + req.email + "</h2>");

    var deleteBtn = $("<button>");
        deleteBtn.text("Remove Listing");
        deleteBtn.addClass("delete btn btn-danger");

        $("#userListing-" + i).append(deleteBtn);
      }
    }
}


//Append Offers to offer pane in HTML
function createNewOfferRow(data) {
  for (var i = 0; i < data.length; i++) {
    if(data[i].available && data[i].offer) {

    var offerWell = $("<div>");
        offerWell.addClass("well");
        offerWell.attr("id","userOffer-" + i);
        offerCont.append(offerWell);
        $("#userOffer-"+i).append("<h2>Title to Trade: " +data[i].title+"</h2>");
        $("#userOffer-"+i).append("<h2>Proposed Title: "+data[i].proposal_title+"</h2>");
        $("#userOffer-"+i).append("<h2>Author of Proposed Trade: "+data[i].proposal_author+"</h2>");
        $("#userOffer-"+i).append("<h2>User Proposing Trade: "+data[i].proposal_email+"</h2>");

    var acceptBtn = $("<button>");
        acceptBtn.text("Accept Trade!");
        acceptBtn.addClass("btn btn-success");
        }
        $("#userListing-" + i).append(acceptBtn);

    var denyBtn = $("<button>");
        denyBtn.text("Decline Trade");
        denyBtn.addClass("btn btn-danger");
        }
        $("#userListing-" + i).append(denyBtn);
    }
  }
}

});

  $("#postBtn").on("click", function(event) {
  event.preventDefault();
  $.get("/api/userinfo", function(req) {
    console.log(req);
  // Make a newBook object
  var newBook = {
    title: $("#titleInput").val().trim(),
    author: $("#authorInput").val().trim(),
    genre: $("#genreInput").val().trim(),
    UserId: req.id

  };
  // Send an AJAX POST-request with jQuery
  $.post("/api/newlisting", newBook)
    // On success, run the following code
    .done(function(data) {
      // Log the data we found
      console.log(data);
    });
  // Empty each input box by replacing the value with an empty string
  $("#titleInput").val("");
  $("#authorInput").val("");
  $("#genreInput").val("");
});
  window.location.href = "/members";
});
});









