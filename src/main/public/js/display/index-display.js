/**
 * index-display.js
 *
 * Contains js-mediated display elements for the index
 */

$(function () {
  
  // Begin with button setup
  $("#about-button")
    .button(
      {
        icons: {primary: "ui-icon-clipboard"}
      }
    )
    .click(function () {
      window.location = "./about";
    })
    .removeClass("loading-hidden");
  
  $("#survey-button")
    .button(
      {
        icons: {secondary: "ui-icon-circle-triangle-e"}
      }
    )
    .click(function () {
      window.location = "./survey";
    })
    .removeClass("loading-hidden");
    
    
});
