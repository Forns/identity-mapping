/**
 * topic-models-display.js
 *
 * Display javascript for the topic-models page
 */

$(function () {
  var topicModelsContainer = "main-content",
      topicModule = $S.createForm("topicModels"),
      topicTree,
      topicOptions = "<div id='topic-buttons'>",
      topicOptionsQuestion = 
        [
          {
            text:
              "<strong>Topic Models</strong> of digital domain-use purposes can be used to get an \"at a glance\" look " +
              "at the functions of peoples' different accounts, avatars, blogs, etc."
          }
        ];
        
  // Provide a button for every domain; we'll need to get the topic tree first
  $.ajax({
    type: "GET",
    url: "/topictree",
    success: function (data, textStatus, jqXHR) {
      if (jqXHR.status === 201) {
        var currentArchdomain,
            currentDomain;
            
        // Go through each archdomain and domain to form the selection button choices
        topicTree = data;
        for (var archdomain in topicTree) {
          currentArchdomain = topicTree[archdomain];
          topicOptions += "<div class='topic-divider'><strong>" + archdomain + "</strong></br>"
          for (var domain in currentArchdomain) {
            // TEMPORARY Skip the "general" other domains for now
            if (domain.indexOf(archdomain) !== -1 && domain !== archdomain) {
              continue;
            }
            currentDomain = currentArchdomain[domain];
            topicOptions += "<button id='" + archdomain + "-" + domain + "' class='btn topic-button' name='topic-options'>" + domain + "</button>";
          }
          topicOptions += "</div>"
        }
        topicOptions += "</div>"
        
        topicOptionsQuestion.push({
          text:
            "<strong>Click</strong> on a domain below to see what people have been saying!",
          input:
            topicOptions
        });
        
        // Then, render the module
        topicModule
          .addModule(
            "topic-models",
            
            "Topic Modelling",
            
            topicOptionsQuestion
          )
          .render(topicModelsContainer);
        
        // Set up title section
        $("#topic-buttons").after(
          "<hr/><h3 id='topics-intro'></h2>"
        );
          
        // Set up the event handlers for the topic model buttons
        $("[name='topic-options']")
          .each(function () {
            $(this).click(function (event) {
              event.preventDefault();
              
              var currentId = $(this).attr("id"),
                  idDomainSplit = currentId.split("-"),
                  buttonArchdomain = idDomainSplit[0],
                  buttonDomain = idDomainSplit[1],
                  buttonTreeEntry = topicTree[buttonArchdomain][buttonDomain],
                  currentTopics = buttonTreeEntry["topics"],
                  currentProbabilities = buttonTreeEntry["probabilities"],
                  currentTags,
                  tagCloud = "",
                  tagCloudBegun = false;
              
              // Remove the current canvas object and tags if they exist
              $(".weighted").remove();
              
              $("#topics-intro").text(buttonDomain + " Topics");
              
              for (var t = 0; t < currentTopics.length; t++) {
                tagCloud = "<ul class='weighted loading-hidden' id='tags-" + t + "'>";
                currentTags = currentTopics[t];
                for (var i = 0; i < currentTags.length; i++) {
                  tagCloud += "<li><a href='javascript:void(0);' data-weight='" + currentProbabilities[t][i] + "'>" + currentTopics[t][i] + "</a></li>";
                }
                tagCloud += "</ul>"
                
                $("#topics-intro").after(
                  tagCloud
                );
                // Add the topic display container
                if (!$("#tag-canvas-" + t).length) {
                  $("#topics-intro").after(
                    "<canvas id='tag-canvas-" + t + "' width='300' height='300' class='tag-canvas'>" +
                      "<p>Oops! Looks like your browser doesn't support WebGL--consider using Google Chrome or Mozilla Firefox instead!</p>" +
                    "</canvas>"
                  );
                }
                
                // Try to start the canvas, but account for possible errors with browser compatibility
                try {
                  TagCanvas.Start(
                    "tag-canvas-" + t,
                    "tags-" + t,
                    {
                      textColour: "#000000"
                    }
                  );
                  
                } catch (e) {
                  // Something went wrong here...
                  $(".weighted").remove();
                  alert(
                    "Error displaying topics; please contact the IMP team!"
                  );
                }
              }
              tagCloudBegun = true;
              $(window).scrollTop(20000);
            });
          });
      } else {
        alert(
          "We got an unexpected response from the server.\n" +
          "Please contact the IMP investigators."
        );
        window.location = "/";
      }
    }
  });
  
});
