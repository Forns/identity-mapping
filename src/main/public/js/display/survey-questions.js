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
      stageIISpecifics = {},
      stageIIGenerals = {},
      stageIIa = $S.createForm("stageIIa"),
      stageIIaMods = moduleList.stageIIa,
      stageIII = $S.createForm("stageIII"),
      stageIIIMods = moduleList.stageIII,
      stageIV = $S.createForm("stageIV"),
      stageIVMods = moduleList.stageIV,
      formContainer = "container",
      
      // Flags
      surveyComplete = false,
      
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
            currentMatch,
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
          (stageI.modules.length > 1) ? stageIIMods.briefing.questions : stageIIMods.empty.questions
        );
        
        // Now, we need to construct part II of the survey from the responses in part I
        for (var m = 2; m < stageI.modules.length; m++) {
          specifics = [];
          generals = [];
          currentFollowup = [];
          currentModule = stageI.modules[m];
          currentSingularTitle = currentModule.title.substring(0, currentModule.title.length - 1);
          
          // First, we'll take a look at all of the responses in the current module...
          for (var r in currentModule.responses) {
            currentResponse = currentModule.responses[r];
            currentMatch = r.match(/-cb$|-radio$|-field$/g);
            
            // If the input requests no response, just move on
            if (currentMatch === null) {
              continue;
            }

            switch(currentMatch[0]) {
              // Some answers will ask specifics about the user's online persona, we'll handle these first
              case "-cb":
                // Only continue if the user actually selected this digital medium
                if (currentResponse === "true") { // Relax, it's the string "true", not the Boolean
                  specifics.push(
                    {
                      text:
                        // JD: Indicate the number of instances per domain here.
                        "You indicated that you use " + r.replace("-cb", "").replace(/-/g, " ") + ". How many names, " +
                        "usernames, accounts, avatars, and characters do you have in this " + currentSingularTitle + "?",
                        
                      domain: r.replace("-cb", "").replace(/-/g, " ")
                    }
                  );
                }
                break;
              // Some answers will simply be, "how many other instances of this platform do you use?"
              case "-field":
              case "-radio":
                currentResponse = parseInt(currentResponse);
                for (var i = 1; i <= currentResponse; i++) {
                  generals.push(
                    {
                      text: 
                        "You indicated that you use additional " + currentModule.title + ". " +
                        "How many names, usernames, accounts, avatars, and characters do you have in " +
                        "the " + numToRank(i) +" " + currentSingularTitle + "?",
                        
                      domain: currentSingularTitle
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
          stageIISpecifics[currentModule.id.replace("stageI", "stageII")] = specifics;
          stageIIGenerals[currentModule.id.replace("stageI", "stageII")] = generals;
          if (currentFollowup.length !== 0) {
            var currentQuestion,
                newQuestions = [];
                
            // Now, add the questions to the module
            for (var i = 0; i < currentFollowup.length; i++) {
              currentQuestion = currentFollowup[i];
              currentQuestion.input = countSelect.replace(/--name--/g, currentModule.id.replace("stageI", "stageII") + "-radio-" + i);
              newQuestions.push(currentQuestion);
            }
            currentFollowup = newQuestions;
            
            // Finally, add the module to the stage II form
            stageII.addModule(
              currentModule.id.replace("stageI", "stageII"),
              currentModule.title,
              currentFollowup
            );
          }
        }
        
        // Then render stage II!
        stageII
          .setSubmit(
            "Go to Part IIa",
            "container",
            function () {
              // Adjust the page scroll
              $(window).scrollTop("#header");
              stageII
                .parseByModule("[class^=question-]")
                .deleteForm();

  /*
   * STAGE IIa
   */
              // Stage IIa begins with a descriptive title section
              stageIIa.addModule(
                stageIIaMods.briefing.id,
                stageIIaMods.briefing.title,
                (stageII.modules.length > 1) ? stageIIaMods.briefing.questions : stageIIaMods.empty.questions
              );
              
              var currentFollowup,
                  currentQuestion,
                  currentModule,
                  currentSingularTitle,
                  currentSpecifics,
                  currentGenerals,
                  responseCount,
                  generalCount,
                  generalTrack,
                  emptyResponse = true;
              
              // Now, we need to construct part III of the survey from the responses in part II
              for (var m = 1; m < stageII.modules.length; m++) {
                currentFollowup = [];
                currentQuestion = {};
                currentModule = stageII.modules[m];
                currentSingularTitle = currentModule.title.substring(0, currentModule.title.length - 1);
                currentSpecifics = stageIISpecifics[currentModule.id];
                currentGenerals = stageIIGenerals[currentModule.id];
                responseCount = 0;
                generalCount = 1;
                generalTrack = 0;
                emptyResponse = false;
                
                if (currentSpecifics.length === 0 && currentGenerals.length === 0) {
                  continue;
                }
                
                // First, we'll take a look at all of the responses in the current module...
                for (var r in currentModule.responses) {
                  currentResponse = parseInt(currentModule.responses[r]);
                  
                  for (var i = 1; i <= currentResponse; i++) {
                    currentQuestion = {};
                    // If the number of responses is greater than the number of "specifics", then we know
                    // we're on to the general questions
                    if (responseCount < currentSpecifics.length) {
                      currentQuestion.text =
                        "You indicated that you operate " + currentResponse + " name(s) / username(s) / account(s) / avatar(s) / character(s) " +
                        "in " + currentSpecifics[responseCount].domain + ". Please describe your purpose or " +
                        "function when using the " + numToRank(i) +  " name / username / account / avatar / character."
                    } else {
                      currentQuestion.text =
                        "You indicated that you operate " + currentResponse + " name(s) / username(s) / account(s) / avatar(s) / character(s) " +
                        "in the " + numToRank(generalCount) + " additional " + currentGenerals[responseCount - currentSpecifics.length].domain + ". Please describe your purpose or " +
                        "function when using the " + numToRank(i) + " name / username / account / avatar / character."
                      generalTrack++;
                      
                      // Correctly labels the current additional blog 
                      if (generalTrack === currentResponse) {
                        generalCount++;
                        generalTrack = 0;
                      }
                    }
                    currentQuestion.input = "<textarea class='question-field question-textarea' />";
                    currentFollowup.push(currentQuestion);
                    
                    // Then, ask about the frequency of use
                    currentFollowup.push(
                      {
                        text:
                          "How often do you typically use this name / username / account / avatar / character?",
                        input:
                          frequencyRadio.replace(/--name--/g, r.replace("stageII", "stageIII"))
                      }
                    );
                  }
                  
                  responseCount++;
                }
                
                // Finally, add the module to the stage IIa form
                stageIIa.addModule(
                  currentModule.id.replace("stageII", "stageIIa"),
                  currentModule.title,
                  currentFollowup
                );
              }
              
              // Render stage IIa
              stageIIa
                .setSubmit(
                  "Go to Part III",
                  "container",
                  function () {
                    // Adjust the page scroll
                    $(window).scrollTop("#header");
                    stageIIa
                      .parseByModule("[class^=question-]")
                      .deleteForm();

                    stageIII.addModule(
		      stageIIIMods.briefing.id,
                      stageIIIMods.briefing.title,
		      stageIIIMods.briefing.questions
		    )
                    .setSubmit(
                      "Submit!",
                      "container",
                      function () {
                        // Adjust the page scroll                                                                                                              
                        $(window).scrollTop("#header");
                        stageIII
                          .parseByModule("[class^=question-]")
                          .deleteForm();

                        surveyComplete = true;
                    
                        stageIV.addModule(
                          stageIVMods.id,
                          stageIVMods.title,
                          stageIVMods.questions
                        )
                        .setSubmit(
                          "Create My Identity Map",
                          "container",
                          function () {
                            // TODO This should eventually go to an identity map display.
                            window.location = "/";
                          }
                        )
                        .render("container");
                      }
                    )
                    .render("container");
                  }
                )
                .render("container");
            }
          )
          .render("container");
      }
    );
    
  // Warn the user that they have not submitted their survey yet if they
  // are at an adequate point of progress
  $(window).on("beforeunload", function () {
    if (!surveyComplete) {
      return "[!] WARNING: You have not yet completed the survey.";
    }
  });
    
});
