/**
 * identitymap-display.js
 *
 * Javascript display stylings for the identitymap page
 */

$(function () {
  var mapContainer = "main-content",
      mapModule = $S.createForm("map");
  
  mapModule
    .addModule(
      "map",
      
      "Identity Map",
      
      [
        {
          text:
            "<strong>The identity map report</strong> is currently under construction. Check back soon for more information!"
        },
        
        {
          text:
            "<strong>Thank you</strong> for your interest in the Identity Mapping Project!",
          input:
            "<button id='home-button' class='btn btn-info pull-right'>Home</button><br/>"
        }
      ]
    )
    .render(mapContainer);
    
    $("#home-button").click(function (event) {
      event.preventDefault();
      window.location = "../";
    });
});
