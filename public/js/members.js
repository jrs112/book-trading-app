$(document).ready(function() {

  $.get("/api/userinfo", function(req) {
    console.log(req);
    $("#currentUser").append("Welcome " + req.first_name + " " + req.last_name);
    var listingCont = $("#listingCont");
    var offerCont = $("#offerCont");

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
function deleteListing() {
    var info = {
      id: $(this).attr("data-id")
    };
    $.post("/api/delete/" + info.id)
    .done(function(deldata) {
      console.log(deldata);
      console.log("Deleted Successfully");
      window.location.href = "/members";
    });
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
        deleteBtn.attr("data-id", data[i].id);

        $("#userListing-" + i).append(deleteBtn);

      }
    }
    $(".delete").on("click", deleteListing);
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

  $(".denyButton").on("click", function(event) {
    event.preventDefault();
    offerCont.empty();
    offerCont.show();
    var denyProposeId = {
      id: $(this).attr("data-id")
    };
    $.get("/api/listings/" + denyProposeId.id)
    .done(function(results) {
      var denyWellSection = $("<div>");
      denyWellSection.addClass("well");
      denyWellSection.attr("id", "deny-book-well");
      offerCont.append(denyWellSection);
      $("#deny-book-well").append("<h2>Are you sure you want to decline the trade proposal for your " +
                                    results.title  + " by " + results.author + " in exchange for " +
                                    results.proposal_first_name + " " + results.proposal_last_name + "'s " +
                                    results.proposal_title + " by " + results.proposal_author + "?</h2>");
      $("#deny-book-well").append("<button class='declineOffer btn btn-danger'>Yes, Decline This Trade!</button>");
      $("#deny-book-well").append("<a href='/members' class='btn btn-primary'> Back to Offer List</a>");
      $(".declineOffer").on("click", function(denyEvent) {
        denyEvent.preventDefault();
        var proposeTitle = "none";
        var proposeAuthor = "none";
        var proposeFirstName = "none";
        var proposeLastName = "none";
        var declineInfo = {
          id: results.id,
          propose_title: proposeTitle,
          propose_author: proposeAuthor,
          propose_first_name: proposeFirstName,
          propose_last_name: proposeLastName,
          offer: false
        };
        updateProposal(declineInfo);
        var to = results.proposal_email;
        var subject = "Your Book Trade Proposal Has Been Declined!"
        var html = "<h1>Unfortunately, your trade proposal for " + results.title + " by " + results.author + " was declined by the owner.</h1>" +
                  "<img src='https://az616578.vo.msecnd.net/files/responsive/cover/main/desktop/2016/12/08/636167736301696436-543435143_140815-its-ok.jpg' alt='book-image' style='width:300px;height:250px;'>" +
                   "<h2>You can go back to <a href='https://radiant-eyrie-66256.herokuapp.com/'>www.thebookshelf.com</a> to see what other books" +
                   " are available for trade!</h2><br><p>Thank for using the Bookshelf!</p>";
        $(".declineOffer").text("Sending Decline Confirmation...");
        $.get("http://localhost:8080/send",{to:to,subject:subject,html:html}, function (dataEmail) {
          if (dataEmail == "sent") {
            alert("Decline Confirmation Sent");
            window.location.href = "/members"
          }
        });
      });

    });
  });

  $(".acceptButton").on("click", function(event) {
    event.preventDefault();
    offerCont.empty();
    offerCont.show();
    var acceptProposeId = {
      id: $(this).attr("data-id")
    };
    $.get("/api/listings/" + acceptProposeId.id)
    .done(function(results) {
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
                   "<img src='http://clipartix.com/wp-content/uploads/2016/08/Handshake-clipart-2.jpg' alt='book-image' style='width:300px;height:250px;'>" +
                   "<h4>" + req.first_name + " " + req.last_name + " has accepted your proposal to trade " + results.title + " by " +
                   results.author + "!</h4><h4>You can e-mail " + req.first_name + " at " + req.email + " to discuss how you two " +
                   "would like to exchange your books.</h4>" +
                   "<br><p><a href='https://radiant-eyrie-66256.herokuapp.com/'>www.thebookshelf.com</a></p>";
        $(".acceptOffer").text("Sending Trade Confirmation...")
        $.get("http://localhost:8080/send",{to:to,subject:subject,html:html}, function(data) {
            if(data == "sent") {
              alert("Trade Confirmation Sent!");
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








