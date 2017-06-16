
$(document).ready(function() {

  // Getting references to our form and input
  var signUpForm = $(".signup");
  var emailInput = $("#email-input");
  var passwordInput = $("#password-input");
  var passwordInput2 = $("#password-input2");
  var firstNameInput = $("#firstName-input");
  var lastNameInput = $("#lastName-input");

  // When the signup button is clicked, we validate the email and password are not blank
  $("#submit").on("click", function(event) {
    event.preventDefault();
    var userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: $("#email-input").val().trim(),
      password: passwordInput.val().trim(),
      password2: passwordInput2.val().trim()

    };
    console.log(userData);
   if (!userData.firstName || !userData.lastName || !userData.email || !userData.password ||!userData.password2 ) {
      return;
      console.log("passed");
    }
    // If we have an email and password, run the CreateProfileUser function
    createProfileUser(userData.firstName,userData.lastName,userData.email, userData.password,userData.password2);
    emailInput.val("");
    passwordInput.val("");
    passwordInput2.val("");
    firstNameInput.val("");
    lastNameInput.val("");

  });

//   // Does a post to the signup route. If succesful, we are redirected to the members page
//   // Otherwise we log any errors
  function createProfileUser(firstName,lastName,email, password,password2) {
    $.post("/api/New", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      password2: password2
    }).then(function(data) {
       //window.location.replace(data);
       console.log("sucess");
       window.location.href = "/";
    });
    // .catch(function(err) {
    //   console.log(err);
    // });
  }



});