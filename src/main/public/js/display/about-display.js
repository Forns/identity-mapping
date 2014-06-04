/**
 * about-display.js
 *
 * Display javascript for the about page
 */

$(function () {
  var aboutContainer = "main-content",
      aboutModule = $S.createForm("about");
  
  aboutModule
    .addModule(
      "about",
      
      "About the Identity Mapping Project",
      
      [
        {
          text:
            "<strong>The goal</strong> of the Identity Mapping Project is to generate thousands (if not millions) of identity maps " +
            "from around the globe and chart the nature of identity in the today&rsquo;s digital world. " +
            "An \"identity map\" shows how active someone is online and how their identity is expressed in a variety of online forms."
        },
        
        {
          text:
            "<strong>The project</strong> is a collaboration of 3 professors at Loyola Marymount University--Richard Gilbert (Psychology), " +
            "John Dionisio (Computer Science), and Philip Dorin (Computer Science)--and Andrew Forney, a doctoral student in Computer Science " +
            "at UCLA."
        },
        
        {
          text:
            "<strong>To participate</strong> in the project, just click on the \"Map My Identity\" button below or on the home page and complete " +
            "the brief, anonymous survey. After you're done, you can see and share a free color-coded map of your identity."
        },
        
        {
          text:
            "<strong>Thank you</strong> for your interest in the Identity Mapping Project!",
          input:
            "<button id='survey-button' class='btn btn-info pull-right'>Map My Identity</button>" +
            "<button id='home-button' class='btn btn-info pull-right'>Home</button><br/>"
        }
      ]
    )
    .render(aboutContainer);
    
    // Set up nav buttons
    $("#survey-button").click(function (event) {
      event.preventDefault();
      window.location = "../survey";
    });
    
    $("#home-button").click(function (event) {
      event.preventDefault();
      window.location = "../";
    });
});
