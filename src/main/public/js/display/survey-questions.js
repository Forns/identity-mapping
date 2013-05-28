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
      },
      
      // Finds the correct preceding article for the given noun
      correctIndefiniteArticle = function (noun) {
        if (["a", "e", "i", "o", "u"].indexOf(noun[0].toLowerCase()) !== -1) {
          return "an";
        }
        return "a";
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
                        
                      domain: currentModule.title
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
            "Go to Part III",
            "container",
            function () {
              // Adjust the page scroll
              $(window).scrollTop("#header");
              stageII
                .parseByModule("[class^=question-]")
                .deleteForm();
                
  /*
   * STAGE III
   */

                stageIII.addModule(
                  stageIIIMods.briefing.id,
                  stageIIIMods.briefing.title,
                  stageIIIMods.briefing.questions
                );
                
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
                    .render(formContainer); // Stage IV rendering
                  }
                )
                .render(formContainer); // Stage III rendering
            }
          )
          // Need a callback to attach event listeners to the stage 2 "number of accounts"
          // questions to dynamically add questions underneath them
          .render(formContainer, function () {
            $("select[survey='count']")
              .change(function () {
                var currentId = $(this).parent().attr("id").split("-")[0],
                    currentValue = parseInt($(this).val()),
                    currentModule = stageII.getModuleById($("#" + currentId).closest(".module").attr("id")),
                    currentQuestion = currentModule.getQuestionById(currentId),
                    currentIdioms = idiomMap[currentQuestion.domain],
                    currentSingularTitle = currentIdioms.account.substring(0, currentIdioms.account.length - 1);
                    
                // Begin by removing questions from the calling module
                currentModule
                  .removeQuestionsById(currentId + "-frequency-", false)
                  .removeQuestionsById(currentId + "-purpose", false);
                  
                // Add the description question as long as the input wasn't 0
                if (currentValue > 0) {
                  currentModule.addQuestionAfter(
                    currentId,
                    {
                      id:
                        currentId + "-purpose",
                      text:
                        (currentValue === 1)
                          ? "You indicated that you " + currentIdioms.verb + " " + correctIndefiniteArticle(currentQuestion.domain) +
                          " " + currentQuestion.domain + " " + currentSingularTitle + ". What is your function or purpose in using this " +
                          currentSingularTitle + "?"
                          : "You indicated that you " + currentIdioms.verb + " multiple " + " " + currentQuestion.domain + " " +
                          currentIdioms.account + ". Please explain the reason that you " + currentIdioms.verb + " multiple " + currentIdioms.account +
                          " and then describe the different purpose or function of each " + currentSingularTitle + ".",
                      input:
                        "<textarea class='question-field question-textarea' />"
                    }
                  );
                }
                  
                // Now, for each of the number of accounts indicated, ask the frequency of use question
                for (var i = currentValue; i >= 1; i--) {
                  currentModule.addQuestionAfter(
                    currentId,
                    {
                      id:
                        currentId + "-frequency-" + i,
                      text:
                        "How often do you " + currentIdioms.verb + " the " + numToRank(i) + " " +
                        currentSingularTitle + "?",
                      input:
                        frequencyRadio.replace(/--name--/g, currentId + "-frequency-" + i + "-radio")
                    }
                  );
                }
              });
          }); // Stage II render and callback
          
      } // Stage I setSubmit 
    );
    
  // Warn the user that they have not submitted their survey yet if they
  // are at an adequate point of progress
  $(window).on("beforeunload", function () {
    if (!surveyComplete) {
      return "[!] WARNING: You have not yet completed the survey.";
    }
  });
    
});
