
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
      for (var i = 0; i < data.length; i++) {
          if(data[i].UserId === req.id) {
            initializeRows(data);
          }
        }
});

//Display offers for a specific user's listings
$.get("/api/listings", function(data) {
  // For each book that our server sends us back
  for (var i = 0; i < data.length; i++) {
        if(data[i].available && data[i].offer) {
            initializeRows(data);
          }
        }
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

//Puts applicable posts into array
function initializeRows() {
    listingCont.empty();
    var listingArr = [];
    for (var i = 0; i < listingArr.length; i++) {
      listingArr.push(createNewListingRow(posts[i]));
    }
    listingCont.append(listingArr);
  }

//Append listings to listing pane in HTML
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

//Append Offers to offer pane in HTML
function createNewOfferRow(post) {
    //Listing panel and heading
    var newOfferPanel = $("<div>");
    newOfferPanel.addClass("panel panel-default");

    var newOfferPanelHeading = $("<div>");
    newOfferPanelHeading.addClass("panel-heading");

    var newOfferPanelBody = $("<div>");
    newOfferPanelBody.addClass("panel-body");

    //Edit and delete buttons
    var deleteBtn = $("<button>");
    deleteBtn.text("Remove Listing");
    deleteBtn.addClass("delete btn btn-danger");

    var newListingTitle = $("<h2>");
    var newProposedTitle = $("<h3>");
    var newProposedAuthor = $("<h3>");
    var newOfferUser = $("<h5>");
    newListingTitle.text("Title to trade: " + post.Listing.title + " ");
    newProposedTitle.text("Proposed title to trade: " + post.Listing.proposal_title + " ");
    newProposedAuthor.text("Author of propsed trade: " + post.Listing.proposal_author);
    newOfferUser.text("User proposing trade: " + post.Listing.proposal_email);

    //Append buttons to screen
    newListingPanelHeading.append(deleteBtn);
    newListingPanelHeading.append(editBtn);
    newListingPanelHeading.append(newListingTitle);

    newListingPanelBody.append(newProposedTitle);
    newListingPanelBody.append(newProposedAuthor);
    newListingPanelBody.append(newOfferUser);

    newListingPanel.append(newListingPanelHeading);
    newListingPanel.append(newListingPanelBody);
    newListingPanel.data("post", post);

    return newOfferPanel;
  }

});
});









