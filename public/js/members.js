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
    if(data[i].offer && req.id === data[i].UserId) {

    var offerWell = $("<div>");
        offerWell.addClass("well");
        offerWell.attr("id","userOffer-" + i);
        offerCont.append(offerWell);
        $("#userOffer-"+i).append("<h2>Title to Trade: " +data[i].title+"</h2>");
        $("#userOffer-"+i).append("<h2>Proposed Title: "+data[i].proposal_title+"</h2>");
        $("#userOffer-"+i).append("<h2>Author of Proposed Trade: "+data[i].proposal_author+"</h2>");
        $("#userOffer-"+i).append("<h2>User Proposing Trade: "+data[i].proposal_first_name + " "+data[i].proposal_last_name+"</h2>");
    if (data[i].available) {
    var acceptBtn = $("<button>");
        acceptBtn.text("Accept Trade!");
        acceptBtn.addClass("btn btn-success acceptButton");
        acceptBtn.attr("data-id", data[i].id);
        $("#userOffer-" + i).append(acceptBtn);

    var denyBtn = $("<button>");
        denyBtn.text("Decline Trade");
        denyBtn.addClass("btn btn-danger denyButton");
        denyBtn.attr("data-id", data[i].id);
        $("#userOffer-" + i).append(denyBtn);
      } else {
        $("#userOffer-"+i).append("<h2>You have accepted this offer! You can e-mail " + data[i].proposal_first_name + " at " +
          data[i].proposal_email + " to discuss how you two would like to exchange books.");
      }
    }
  }

  $(".acceptButton").on("click", function(event) {
    event.preventDefault();
    offerCont.empty();
    offerCont.show();
    var acceptProposeId = {
      id: $(this).attr("data-id")
    };
    console.log(acceptProposeId.id);
    $.get("/api/listings/" + acceptProposeId.id)
    .done(function(results) {
      console.log(results);
      var acceptWellSection = $("<div>");
      acceptWellSection.addClass("well");
      acceptWellSection.attr("id", "accept-book-well");
      offerCont.append(acceptWellSection);
      $("#accept-book-well").append("<h2>Are you sure you want to trade your " + results.title  + " by " + results.author +
                                    " for " + results.proposal_first_name + " " + results.proposal_last_name + "'s " +
                                    results.proposal_title + " by " + results.proposal_author + "?</h2>");
      $("#accept-book-well").append("<button class='acceptOffer btn btn-success'>Yes, Accept This Trade!</button>");
      $("#accept-book-well").append("<a href='/members' class='btn btn-primary'> Back to Offer List</a>");

      $(".acceptOffer").on("click", function(acceptEvent) {
        acceptEvent.preventDefault();
        var acceptInfo = {
            id: results.id,
            available: false,
        }
        updateProposal(acceptInfo);
        var to = results.proposal_email;
        var subject = "Accepted Book Trade Proposal!";
        var html = "<h1>Your Trade Proposal for " + results.title + " By " + results.author + " Has Been Accepted!</h1>" +
                   "<img src='http://images.clipartpanda.com/book-20clipart-book10.png' alt='book-image' style='width:300px;height:250px;'>" +
                   "<h4>" + req.first_name + " " + req.last_name + " has accepted your proposal to trade " + results.title + " by " +
                   results.author + "!</h4><h4>You can e-mail " + req.first_name + " at " + req.email + " to discuss how you two " +
                   "would like to exchange your books.</h4><br>";
        $(".acceptOffer").text("Sending Trade Confirmation...")
        $.get("http://localhost:8080/send",{to:to,subject:subject,html:html}, function(data) {
            if(data == "sent") {
              alert("Proposal sent!");
              window.location.href = "/members";
            }
        });

      });

    });


  });

}

});

function updateProposal(info) {
    $.ajax({
      method: "PUT",
      url: "/api/listings",
      data: info
    })
    .done(function() {
        console.log(info);
    });
  }

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








