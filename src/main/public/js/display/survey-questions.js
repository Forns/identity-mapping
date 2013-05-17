/**
 * survey-questions.js
 * 
 * Includes all of the questions and input processing of the
 * various survey stages
 */

$(function() {
  // Form instantiation
  var briefing = $S.createForm("briefing"),
      briefingMods = moduleList.briefing,
      stageI = $S.createForm("stageI"),
      stageIMods = moduleList.stageI,
      stageII = $S.createForm("stageII"),
      stageIIMods = moduleList.stageII,
      stageIV = $S.createForm("stageIV"),
      stageIVMods = moduleList.stageIV,
      formContainer = "container",
      
      // Converts a number to its English ranking representation
      numToRank = function (num) {
        var addon;
        ones = Math.floor(num % 10);
        switch(ones) {
          case 1:
            addon = "st";
            break;
          case 2:
            addon = "nd";
            break;
          case 3:
            addon = "rd";
            break;
          default:
            addon = "th";
            break;
        }
        
        return num + addon;
      };
      
  /*
   * BRIEFING
   */
  // Create modules and questions for the newly created form
  briefing
    .addModule(
      // ID for this module
      briefingMods.id,
    
      // Title for this module
      briefingMods.title,
      
      // List of questions for this module, if any
      briefingMods.questions
    )
    .setSubmit(
      "Take the Survey",
      "container",
      function () {
        briefing.deleteForm();
        stageI.render(formContainer, function() {
          $S.convertSelectToAutofill("country-select");
          $("#country-select")
            .addClass("question-field")
            .attr("name", "country-select")
        });
      }
    )
    .render(formContainer);
    
  /*
   * STAGE I
   */
  stageI
    .addModule(
      stageIMods.briefing.id,
      stageIMods.briefing.title,
      stageIMods.briefing.questions
    )
    .addModule(
      stageIMods.demo.id,
      stageIMods.demo.title,
      stageIMods.demo.questions
    )
    .addModule(
      stageIMods.blogs.id,
      stageIMods.blogs.title,
      stageIMods.blogs.questions
    )
    .addModule(
      stageIMods.forums.id,
      stageIMods.forums.title,
      stageIMods.forums.questions
    )
    .addModule(
      stageIMods.socialNetworks.id,
      stageIMods.socialNetworks.title,
      stageIMods.socialNetworks.questions
    )
    .addModule(
      stageIMods.gaming.id,
      stageIMods.gaming.title,
      stageIMods.gaming.questions
    )
    .addModule(
      stageIMods.virtualEnvironments.id,
      stageIMods.virtualEnvironments.title,
      stageIMods.virtualEnvironments.questions
    )
    .addModule(
      stageIMods.email.id,
      stageIMods.email.title,
      stageIMods.email.questions
    )
    .setSubmit(
      "Go to Part II",
      "container",
      function () {
        // Adjust the page scroll
        $(window).scrollTop("#header");
        
        var currentModule,
            currentSingularTitle,
            currentResponse,
            currentFollowup,
            currentMatch
            specifics = [],
            generals = [];
            
        // We've named each input of interest as question-field or question-checkbox
        // so we can gather the user responses by question
        stageI.parseByModule("[class^=question-]");
        stageI.deleteForm();
        
  /*
   * STAGE II
   */
        
        // Give stage II a nice description for the users
        stageII.addModule(
          stageIIMods.briefing.id,
          stageIIMods.briefing.title,
          stageIIMods.briefing.questions
        )
        .setSubmit(
          "Submit!",
          "container",
          function () {
            // Adjust the page scroll
            $(window).scrollTop("#header");
            stageII
              .parseByModule("[class^=question-]")
              .deleteForm();
              
            stageIV.addModule(
              stageIVMods.id,
              stageIVMods.title,
              stageIVMods.questions
            )
            .setSubmit(
              // TODO Check the size of this button.
              "Create My Identity Map",
              "container",
              function () {
                // TODO This should eventually go to an identity map display.
                window.location = "/";
              }
            )
            .render("container");
          }
        );
        
        // Now, we need to construct part II of the survey from the responses in part I
        for (var m = 2; m < stageI.modules.length; m++) {
          specifics = [];
          generals = [];
          currentFollowup = [];
          currentModule = stageI.modules[m];
          currentSingularTitle = currentModule.title.substring(0, currentModule.title.length - 1);
          
          // First, we'll take a look at all of the responses in the current module...
          console.log(currentModule.responses);
          for (var r in currentModule.responses) {
            currentResponse = currentModule.responses[r];
            currentMatch = r.match(/-cb$|-field$/g);
            
            // If the input requests no response, just move on
            if (currentMatch === null) {
              continue;
            }

            // TODO If the user did not indicate any particular digital domain, eliminate
            //      it from Part II.

          // TODO The first question should be restructured as follows:
          //
          //      You indicated that you use xxxxxxxxx.  How many names/usernames/accounts/avatars/characters
          //      do you have in xxxxxxxxxx?
          //
          // Possible responses are 1, 2, 3, 4, 5 or more (just like with blogs).
          // If 1, then ask questions as they currently are.  If 2 or more, then ask:
          //
          // - Please describe why you use different names/usernames/accounts/avatars/characters
          //
          // - Indicate frequency for the account/name/user/avatar that you use the most;
          //   indicate the total frequency that you use all other accounts/names/users/avatars.

            switch(currentMatch[0]) {
              // Some answers will ask specifics about the user's online persona, we'll handle these first
              case "-cb":
                // Only continue if the user actually selected this digital medium
                if (currentResponse === "true") { // Relax, it's the string "true", not the Boolean
                  specifics.push(
                    {
                      text:
                        // JD: Indicate the number of instances per domain here.
                        "You indicated that you use " + r.replace("-cb", "") + ". Please describe your " +
                        "purpose or function when using this " + currentSingularTitle + "."
                    }
                  );
                }
                break;
              // Some answers will simply be, "how many other instances of this platform do you use?"
              case "-field":
                currentResponse = parseInt(currentResponse);
                for (var i = 1; i <= currentResponse; i++) {
                  generals.push(
                    {
                      text: 
                        "You indicated that you use additional " + currentModule.title + ". " +
                        "Please describe your purpose or function when using the " + numToRank(i) +
                        " " + currentSingularTitle + "."
                    }
                  );
                }
                break;
              default:
                continue;
                break;
            }
          }
          
          // If we have any additional questions for this section, we'll add them here
          currentFollowup = specifics.concat(generals);
          if (currentFollowup.length === 0) {
            currentFollowup.push({
              text:
                "There are no additional questions for this category."
            });
          } else {
            var currentQuestion,
                newQuestions = [],
                currentSliderId = "";
            // We still need to add textareas to each question and add the frequency
            // of use question
            for (var i = 0; i < currentFollowup.length; i++) {
              currentQuestion = currentFollowup[i];
              currentQuestion.input = "<textarea class='question-field question-textarea' />";
              newQuestions.push(currentQuestion);
              
              newQuestions.push(
                {
                  text:
                    "How often do you typically use this " + currentSingularTitle + "?",
                  input:
                    "<div class='text-center'><div class='btn-group btn-group-vertical scale-container' data-toggle='buttons-radio'>" +
                      "<button type='button' class='btn scale-button'>Daily</button>" +
                      "<button type='button' class='btn scale-button'>Weekly/several times a week</button>" +
                      "<button type='button' class='btn scale-button'>Monthly/several times a month</button>" +
                      "<button type='button' class='btn scale-button'>Less than once a month</button>" +
                    "</div></div>"
                }
              );
          }
            currentFollowup = newQuestions;
          }

          // Finally, add the module to the stage II form
          stageII.addModule(
            currentModule.id.replace("stageI", "stageII"),
            currentModule.title,
            currentFollowup
          );
        }
        
        // Then render stage II!
        stageII.render("container");
      }
    );
    
  
});
