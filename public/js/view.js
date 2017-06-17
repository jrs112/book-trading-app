
$.get("/api/userinfo", function(req) {
    console.log(req);

// Make a get request to our api route that will return every book
$.get("/api/listings", function(data) {
  // For each book that our server sends us back
  for (var i = 0; i < data.length; i++) {
        if(data[i].available && !data[i].offer) {

    // Create a parent div to hold book data
            var wellSection = $("<div>");
            // Add a class to this div: 'well'
            wellSection.addClass("well");
            // Add an id to the well to mark which well it is
            wellSection.attr("id", "book-well-" + i);

             // Append the well to the well section
            $("#availableBooks").append(wellSection);

            // Now  we add our book data to the well we just placed on the page
            $("#book-well-" + i).append("<h2>" + data[i].title + "</h2>");
            $("#book-well-" + i).append("<h3>Author: " + data[i].author + "</h3>");
            $("#book-well-" + i).append("<h3> Preferred Genre for Trade: " + data[i].preferred_genre + "</h3>");
            if (req.id == data[i].UserId) {
                $("#book-well-" + i).append("<h4>This is your book.  You can go to your profile to remove this book if you don't want to trade it.</h4>");
            } else {
                $("#book-well-" + i).append("<button class='propose btn btn-primary' data-id='" + data[i].id + "'>Propose a Trade</button>");
        }
        }

        if(data[i].available && data[i].offer) {

    // Create a parent div to hold book data
            var pendingSection = $("<div>");
            // Add a class to this div: 'well'
            pendingSection.addClass("well");
            // Add an id to the well to mark which well it is
            pendingSection.attr("id", "pending-book-well-" + i);


             // Append the well to the well section
            $("#pendingBooks").append(pendingSection);

            // Now  we add our book data to the well we just placed on the page
            $("#pending-book-well-" + i).append("<h2>" + data[i].title + "</h2>");
            $("#pending-book-well-" + i).append("<h3>Author: " + data[i].author + "</h3>");
            $("#pending-book-well-" + i).append("<h3> Preferred Genre for Trade: " + data[i].preferred_genre + "</h3>");
            $("#pending-book-well-" + i).append("<h4>A trade proposal has already been submitted by " +
                                                data[i].proposal_first_name  + " " + data[i].proposal_last_name +
                                                ". This book will become available if the owner does not accept the offer.</h4>");
            if (req.email == data[i].proposal_email) {
                $("#pending-book-well-" + i).append("<button class='cancelProposal btn btn-danger' data-id='" + data[i].id + "'>Cancel Proposal</button>");
            }
        }
    }


$(".cancelProposal").on("click", function(cancelEvent) {
    cancelEvent.preventDefault();
    $("#pendingBooks").empty();
    $("#pendingBooks").show();
    var cancelProposeId = {
        id: $(this).attr("data-id")
    };
    $.get("/api/listings/" + cancelProposeId.id)
    .done(function(cancelResults) {
        console.log(cancelResults);
        var cancelWellSection = $("<div>");
        cancelWellSection.addClass("well");
        cancelWellSection.attr("id", "cancel-book-well");
        $("#pendingBooks").append(cancelWellSection);
        $("#cancel-book-well").append("<h2>Are you sure you want to cancel your proposal" +
                                      " for " + cancelResults.title + " by " + cancelResults.author + "?</h2>");
        $("#cancel-book-well").append("<button class='sendCancel btn btn-danger btn-sm'>Cancel Trade Proposal</button>");
        $("#cancel-book-well").append("<a href='/view' class='btn btn-primary btn-sm'> Back to Proposal List</a>");
        $(".sendCancel").on("click", function(event) {

                        event.preventDefault();

                        var proposeTitle = "none";
                        var proposeAuthor = "none";
                        var proposeEmail = "none@example.com";
                        var proposeFirstName = "none";
                        var proposeLastName = "none";
                        var proposalInfo = {
                            id: cancelResults.id,
                            proposal_title: proposeTitle,
                            proposal_author: proposeAuthor,
                            proposal_email: proposeEmail,
                            proposal_first_name: proposeFirstName,
                            proposal_last_name: proposeLastName,
                            offer: false
                        };
                        updateProposal(proposalInfo);
                        var to = cancelResults.User.email;
                        var subject = "Cancelled Book Proposal";
                        var html = "<h1 class='text-center'>The proposal for " + cancelResults.title + " has been cancelled!</h1>" +
                                   "<img src='http://images.clipartpanda.com/book-20clipart-book10.png' alt='book-image' style='width:300px;height:250px;'>" +
                                  "<h3>The proposal was cancelled by: " + req.first_name + " " + req.last_name + " at " + req.email + "</h3><br>"
                        $(".sendCancel").text("Cancelling Proposal...Please wait");
                        $.get("http://localhost:8080/send",{to:to,subject:subject,html:html},function(dataEmail){
                        if(dataEmail=="sent")
                        {
                            alert("Proposal Cancelled!");
                            window.location.href = "/view";
                        }
                        });

                      });

    });
});

$(".propose").on("click", function(event) {
                event.preventDefault();
                $("#availableBooks").empty();
                $("#availableBooks").show();
                var proposeId = {
                    id: $(this).attr("data-id")
                };
                console.log(proposeId.id);
                $.get("/api/listings/" + proposeId.id)
                .done(function(results) {
                console.log(results);
            var proposeWellSection = $("<div>");
            // Add a class to this div: 'well'
            proposeWellSection.addClass("well");
            // Add an id to the well to mark which well it is
            proposeWellSection.attr("id", "propose-book-well");

             // Append the well to the well section
            $("#availableBooks").append(proposeWellSection);

            // Now  we add our book data to the well we just placed on the page
            $("#propose-book-well").append("<h2>Make Your Proposal for " + results.title + " by " + results.author + "</h2>");
            $("#propose-book-well").append("<h3>Remeber the owner would like to trade for a book in the " + results.preferred_genre + " genre.</h3>");
            $("#propose-book-well").append("<form><div class='form-group'>" +
                                        "<h5>Title of Book You Would Like to Trade</h5>" +
                                        "<input id='proposeBookTitle' placeholder='Enter Title Here'></div><div class='form-group'>" +
                                        "<h5>Author of Book You Would Like to Trade</h5>" +
                                        "<input id='proposeBookAuthor' placeholder='Enter Author Here'></div>" +
                                        "</form>");
             $("#propose-book-well").append("<button class='sendProposal btn btn-primary btn-sm' data-id='" + results.id + "'>Send Trade Proposal</button>");
             $("#propose-book-well").append("<a href='/view' class='btn btn-primary btn-sm'> Back to Book List</a>");
                $(".sendProposal").on("click", function(event) {

                        event.preventDefault();

                        var proposeTitle = $("#proposeBookTitle").val().trim();
                        var proposeAuthor = $("#proposeBookAuthor").val().trim();
                        var proposeEmail = req.email;
                        var proposeFirstName = req.first_name;
                        var proposeLastName = req.last_name;
                        var proposalInfo = {
                            id: results.id,
                            proposal_title: proposeTitle,
                            proposal_author: proposeAuthor,
                            proposal_email: proposeEmail,
                            proposal_first_name: proposeFirstName,
                            proposal_last_name: proposeLastName,
                            offer: true
                        }
                        updateProposal(proposalInfo);
                        var to = results.User.email;
                        var subject = "You Received A Book Trade Proposal";
                        var html = "<h1 class='text-center'>You Received a Book Trade Proposal for " + results.title + "!</h1>" +
                                   "<img src='http://images.clipartpanda.com/book-20clipart-book10.png' alt='book-image' style='width:300px;height:250px;'>" +
                                  "<h2 class='text-center'>The proposal information is below:</h2>" +
                                  "<ul><li>Book Title: " + proposeTitle + "</li>" +
                                  "<li>Author: " + proposeAuthor + "</li>" +
                                  "<li>Proposal was sent by: " + proposeFirstName + " " + proposeLastName + " at " + proposeEmail + "</li></ul>" +
                                  "<h4>Please go to <a href='https://radiant-eyrie-66256.herokuapp.com/'>www.thebookshelf.com</a> to accept or reject this proposal!</h4>" +
                                  "<br><p>Thank you from the Bookshelf!</p>";
                        $(".sendProposal").text("Sending Proposal...Please wait");
                        $.get("http://localhost:3306/send",{to:to,subject:subject,html:html},function(dataEmail){
                        if(dataEmail=="sent")
                        {
                            alert("Proposal sent!");
                            window.location.href = "/view";
                        }
                        });

                      });
                    });
        });

    });

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