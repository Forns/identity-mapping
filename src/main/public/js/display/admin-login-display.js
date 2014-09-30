/**
 * admin-login-display.js
 */

$(function () {
  var loginButton = $("#login-button");
  
  loginButton.click(function (event) {
    event.preventDefault();
    
    $.ajax({
      url: "/admin-login",
      type: "POST",
      data: {password: $("#password").val()},
      success: function (results, textStatus, jqXHR) {
        if (jqXHR.status === 200) {
          window.location = "/admin";
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
          $("#login-error")
            .removeClass("hidden")
            .stop(true, true)
            .slideUp(0)
            .slideDown(500)
            .delay(3000)
            .slideUp(500);
          $("#password")
            .focus();
        } else {
          alert("[X] Error: Sorry, something went wrong logging you in! Please report this to the administrators and / or try again shortly.");
        }
      }
    });
  });
});
