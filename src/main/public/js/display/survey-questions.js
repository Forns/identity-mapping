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
      finalAnswers = {},
      
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
        stageI.render(formContainer, function () {
          // Quick fix for our two edge case items (emails and blogs)
          // that require different checkbox titles than their values
          $("#mod-stageI-blogs :checkbox")
            .attr("id", "Blogs-cb")
            .attr("name", "Blogs-cb");
          $("#mod-stageI-email :checkbox")
            .attr("id", "Emails-cb")
            .attr("name", "Emails-cb");
          $("#Emails-cb, #Blogs-cb")
            .click(function () {
              $(this).attr("value", ! ($(this).attr("value") === "true"));
            });
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
    // Submit function for Stage I -> Stage II
    .setSubmit(
      "Go to Part II",
      "container",
      function () {
        // Adjust the page scroll
        $(window).scrollTop("#header");
        
        // Collect the demographic data first
        finalAnswers["demo"] = {};
        finalAnswers["demo"]["birth-year"] = $("#demo-year-select").val();
        finalAnswers["demo"]["sex"] = $("input:radio[name='sex']:checked").val();
        finalAnswers["demo"]["country"] = $("#country-select").val();
        finalAnswers["demo"]["education"] = $("input:radio[name='edu']:checked").val();
        
        var currentModule,
            currentSingularTitle,
            currentDomain,
            currentResponse,
            currentFollowup,
            currentMatch,
            specifics = [],
            generals = [],
            generalModifier;
            
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
                  currentDomain = r.replace("-cb", "").replace(/-/g, " ");
                  // Add the domain to the answers list if it doesn't already exist
                  if (typeof(finalAnswers[currentModule.title]) === "undefined") {
                    finalAnswers[currentModule.title] = {};
                  }
                  finalAnswers[currentModule.title][currentDomain] = {};
                  specifics.push(
                    {
                      text:
                        // JD: Indicate the number of instances per domain here.
                        "You indicated that you " + idiomMap[currentDomain].verb + " " + currentDomain + ". " +
                        idiomMap[currentDomain].countQuestion,
                        
                      domain: currentDomain
                    }
                  );
                }
                break;
              // Some answers will simply be, "how many other instances of this platform do you use?"
              case "-field":
                currentResponse = parseInt(currentResponse);
                generalModifier = (currentModule.title === "Emails" || currentModule.title === "Blogs") ? "" : "additional";
                for (var i = 1; i <= currentResponse; i++) {
                  // Add the domain to the answers list if it doesn't already exist
                  if (typeof(finalAnswers[currentModule.title]) === "undefined") {
                    finalAnswers[currentModule.title] = {};
                  }
                  finalAnswers[currentModule.title][currentModule.title + "-" + i] = {};
                  generals.push(
                    {
                      text: 
                        "You indicated that you " + idiomMap[currentModule.title].verb + " one or more " + generalModifier + " " +
                        idiomMap[currentModule.title].account + ". " + idiomMap[currentModule.title].countQuestion + " " +
                        numToRank(i) + " " + generalModifier + " " + currentSingularTitle + "?",
                        
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
                  emptyResponse = true,
                  noFollowups = true;
              
              // Now, we need to construct part IIa of the survey from the responses in part II
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
                noFollowups = true;
                
                // Make sure there were at least some followups to perform for this section
                if ((currentSpecifics.length === 0 && currentGenerals.length === 0)) {
                  continue;
                }
                emptyResponse = false;
                
                // First, we'll take a look at all of the responses in the current module...
                for (var r in currentModule.responses) {
                  currentResponse = parseInt(currentModule.responses[r]);
                  
                  // Only continue if the current response requires more inquiry
                  if (currentResponse > 0) {
                    noFollowups = false;
                    currentQuestion = {};
                    // If the number of responses is greater than the number of "specifics", then we know
                    // we're on to the general questions
                    if (responseCount < currentSpecifics.length) {
                      // We have a different question for the unique case versus the multiple accounts case
                      if (currentResponse === 1) {
                        currentQuestion.text =
                          "You indicated that you operate 1 name / username / account / avatar / character " +
                          "in " + currentSpecifics[responseCount].domain + ". Please describe your purpose or " +
                          "function when using this name / username / account / avatar / character."
                      } else {
                        currentQuestion.text =
                          "You indicated that you operate " + currentResponse + " names / usernames / accounts / avatars / characters " +
                          "in " + currentSpecifics[responseCount].domain + ". Please explain the reason you have multiple " +
                          currentSpecifics[responseCount].domain + " accounts. Furthermore, please explain the individual purpose or function " +
                          "of each account."
                      }
                    } else {
                      if (currentResponse === 1) {
                        currentQuestion.text =
                          "You indicated that you operate 1 name / username / account / avatar / character " +
                          "in the " + numToRank(generalCount) + " additional " + currentGenerals[responseCount - currentSpecifics.length].domain + ". Please describe your purpose or " +
                          "function when using this name / username / account / avatar / character."
                      } else {
                        currentQuestion.text =
                          "You indicated that you operate " + currentResponse + " names / usernames / accounts / avatars / characters " +
                          "in the " + numToRank(generalCount) + " additional " + currentGenerals[responseCount - currentSpecifics.length].domain + ". Please explain the reason you have multiple " +
                          currentGenerals[responseCount - currentSpecifics.length].domain + " accounts. Furthermore, please explain the individual purpose or function " +
                          "of each account."
                      }
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
                    for (var i = 1; i <= currentResponse; i++) {
                      currentFollowup.push(
                        {
                          text:
                            "How often do you typically use the " + ((currentResponse === 1) ? "" : numToRank(i)) + " name / username / account / avatar / character?",
                          input:
                            frequencyRadio.replace(/--name--/g, r.replace("stageII", "stageIII"))
                        }
                      );
                    }
                  }
                  
                  responseCount++;
                }
                
                // Finally, add the module to the stage IIa form as long as there are followups
                if (!noFollowups) {
                  stageIIa.addModule(
                    currentModule.id.replace("stageII", "stageIIa"),
                    currentModule.title,
                    currentFollowup
                  );
                }
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

                    // Add the stage III description
                    stageIII.addModule(
		                  stageIIIMods.briefing.id,
                      stageIIIMods.briefing.title,
            		      stageIIIMods.briefing.questions
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
                      emptyResponse = true,
                      noFollowups = true;
            		    
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
                      noFollowups = true;
                      
                      // Make sure there were at least some followups to perform for this section
                      if ((currentSpecifics.length === 0 && currentGenerals.length === 0)) {
                        continue;
                      }
                      emptyResponse = false;
                      
                      // First, we'll take a look at all of the responses in the current module...
                      for (var r in currentModule.responses) {
                        currentResponse = parseInt(currentModule.responses[r]);
                      }
                    }
            		    
                    stageIII.setSubmit(
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
                        .render(formContainer);
                      }
                    )
                    .render(formContainer);
                  }
                )
                .render(formContainer);
            }
          )
          // Need a callback to attach event listeners to the stage 2 "number of accounts"
          // questions to dynamically add questions underneath them
          .render(formContainer, function () {
            
          });
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
