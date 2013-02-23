/**
 * index-display.js
 *
 * Contains js-mediated display elements for the index
 */

$(function () {
  
  // Begin with button setup
  $("#about-button")
    .button()
    .click(function () {
      window.location = "./about";
    })
    .removeClass("loading-hidden");
  
  $("#survey-button")
    .button()
    .click(function () {
      window.location = "./survey";
    })
    .removeClass("loading-hidden");
    
    
});
