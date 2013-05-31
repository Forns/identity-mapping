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
          // that require different radio labels than their values
          $("[name='Blogs-radio']:radio:nth(0)").val("true");
          $("[name='Blogs-radio']:radio:nth(1)").val("false");
          $("[name='Emails-radio']:radio:nth(0)").val("true");
          $("[name='Emails-radio']:radio:nth(1)").val("false");
          $("[name='Blogs-radio']:radio, [name='Emails-radio']:radio")
            .each(function () {
              $(this)
                .click(function () {
                  $(this).parent().parent().val($(this).val());
                });
                
              $(this).parent().parent()
                .attr("name", $(this).attr("label"))
                .val("undefined");
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
            generalModifier,
            blogAddition;
            
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
              case "-radio":
              case "-cb":
                // Only continue if the user actually selected this digital medium
                if (currentResponse === "true") { // Relax, it's the string "true", not the Boolean
                  currentDomain = r.replace("-cb", "").replace("-radio", "").replace(/-/g, " ");
                  // Add the domain to the answers list if it doesn't already exist
                  if (typeof(finalAnswers[currentModule.title]) === "undefined") {
                    finalAnswers[currentModule.title] = {};
                  }
                  blogAddition = (currentDomain === "Blogs") ? "one or more " : "";
                  finalAnswers[currentModule.title] = {};
                  specifics.push(
                    {
                      text:
                        "You indicated that you " + idiomMap[currentDomain].verb + " " + blogAddition + currentDomain + ". " +
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
                  finalAnswers[currentModule.title] = {};
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
                
              // Prep the answers from stage II into the finalAnswers bin
              var currentModule,
                  currentQuestion,
                  currentResponse,
                  currentArchdomain,
                  currentMatch,
                  currentSpecificDomain,
                  otherDomainCounter,
                  frequencyCounter;
              
              // Go through each module and examine the responses; we can make claims about the format of the
              // responses and their respective domains based on the survey-module question associated with it,
              // as well as the order of questions
              for (var m = 1; m < stageII.modules.length; m++) {
                otherDomainCounter = 0;
                frequencyCounter = 0;
                currentModule = stageII.modules[m];
                currentArchdomain = currentModule.title;
                for (var r in currentModule.responses) {
                  // Really sloppy, survey-modules admittedly sucks :(
                  currentQuestion = currentModule.getQuestionById(r.split("-")[0]);
                  currentResponse = currentModule.responses[r];
                  if (currentArchdomain === currentQuestion.domain && currentArchdomain !== "Blogs" && currentArchdomain !== "Emails") {
                    currentSpecificDomain = currentArchdomain + " " + otherDomainCounter;
                  } else {
                    currentSpecificDomain = currentQuestion.domain;
                  }
                    
                  // We'll sort our responses based on the type of question they answered
                  currentMatch = r.match(/-frequency-|-definition$|-purpose$/g);
                  // Meaning we've moved on to the next question set
                  if (!currentMatch) {
                    // Increment the "additional domain" counter when we've moved onto a new question set
                    if (currentArchdomain === currentQuestion.domain) {
                      otherDomainCounter++;
                    }
                    continue;
                  }
                  // Instantiate the answer "bin" if it needs to be
                  if (typeof(finalAnswers[currentArchdomain][currentSpecificDomain]) === "undefined") {
                    finalAnswers[currentArchdomain][currentSpecificDomain] = {};
                    frequencyCounter = 0;
                  }
                  switch (currentMatch[0]) {
                    case "-frequency-":
                      finalAnswers[currentArchdomain][currentSpecificDomain]["frequency" + frequencyCounter++] = currentResponse;
                      break;
                    case "-purpose":
                      finalAnswers[currentArchdomain][currentSpecificDomain]["purpose"] = currentResponse;
                      break;
                    case "-definition":
                      finalAnswers[currentArchdomain][currentSpecificDomain]["definition"] = currentResponse;
                      break;
                  }
                }
              }
              
  /*
   * STAGE III
   */

                stageIII.addModule(
                  stageIIIMods.briefing.id,
                  stageIIIMods.briefing.title,
                  stageIIIMods.briefing.questions
                );
                
                // We will use the current state of finalAnswers to populate the stage III questions
                var currentArchdomain,
                    currentSubdomain,
                    domainIdiom,
                    accountIdiom,
                    verbIdiom,
                    currentSingularAccount,
                    crossoverCount = 0,
                    crossoverQuestions = [];
                    
                for (var a in finalAnswers) {
                  if (a !== "demo") {
                    currentArchdomain = finalAnswers[a];
                    for (var s in currentArchdomain) {
                      currentSubdomain = currentArchdomain[s];
                      domainIdiom = (currentSubdomain["definition"])
                        ? currentSubdomain["definition"]
                        : ((idiomMap[s]) ? s : "the " + numToRank(s.split(" ")[parseInt(s.split(" ").length - 1)]) + " additional " + a.substring(0, a.length - 1));
                      accountIdiom = (currentSubdomain["definition"])
                        ? idiomMap[a].account
                        : ((idiomMap[s]) ? idiomMap[s].account : idiomMap[a].account);
                      verbIdiom = (currentSubdomain["definition"])
                        ? idiomMap[a].verb
                        : ((idiomMap[s]) ? idiomMap[s].verb : idiomMap[a].verb);
                      currentSingularAccount = accountIdiom.substring(0, accountIdiom.length - 1);
                      crossoverQuestions.push(
                        {
                          text:
                            "You indicated that you " + verbIdiom + " one or more " + accountIdiom + " in " + domainIdiom + ". Have you ever " +
                            "created " + correctIndefiniteArticle(accountIdiom) + " " + currentSingularAccount + " name in " + domainIdiom + " that is different " +
                            "than your real world name?",
                          input:
                            booleanRadio.replace(/--name--/g, s + "-radio-" + crossoverCount++),
                          domain:
                            s
                        }
                      );
                    }
                  }
                }
                
                // Add the questions to stage III!
                stageIII.addModule(
                  stageIIIMods.crossover.id,
                  stageIIIMods.crossover.title,
                  (crossoverQuestions.length > 0) ? crossoverQuestions : stageIIIMods.empty.questions
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
                      
                    for (var m = 1; m < stageIII.modules.length; m++) {
                      console.log(stageIII.modules[m]);
                    }

                    stageIV.addModule(
                      stageIVMods.id,
                      stageIVMods.title,
                      stageIVMods.questions
                    )
                    .setSubmit(
                      "Create My Identity Map",
                      "container",
                      function (event) {
                        event.preventDefault();
                        surveyComplete = true;
                        
                        window.location = "../identitymap";
                        // TODO This should eventually go to an identity map display.
                        /*
                        $.ajax({
                          type: "POST",
                          url: "/identitymap",
                          data: { finalAnswer: finalAnswers }
                        });
                        */
                      }
                    )
                    .render(formContainer); // Stage IV rendering
                  }
                )
                .render(formContainer, function () {
                  // Now we'll tackle the event handlers for the radio buttons we just created
                  $("[value='Yes']:radio").each(function () {
                    $(this)
                      .click(function () {
                        if ($(this).attr("clicked") === "true") {
                          return;
                        }
                        var currentModule = stageIII.modules[1],
                            currentQuestion = currentModule.getQuestionById($(this).parents().eq(2).attr("id")),
                            selectId = currentQuestion.id + "-crossover-count",
                            currentSelect,
                            currentSelectValue,
                            currentSelectFollowup = 0;
                        
                        currentModule.addQuestionAfter(
                          currentQuestion.id,
                          {
                            id:
                              selectId,
                            text:
                              "How many of these non-real world user names have you created for " + currentQuestion.domain,
                            input:
                              countSelect.replace(/--name--/g, selectId),
                            domain:
                              currentQuestion.domain
                          }
                        );
                        $(this).attr("clicked", "true");
                        
                        // Set up the handler on the newly created select menu
                        currentSelect = $("#" + selectId + " select");
                        currentSelect
                          .children()
                            .each(function () {
                              $(this).val($(this).text());
                            });
                        currentSelect.change(function () {
                          currentSelectFollowup = 0;
                          currentSelectValue = parseInt(currentSelect.val());
                          currentModule.removeQuestionsById(currentQuestion.id + "-crossover-followup", false);
                          for (var i = currentSelectValue; i >= 1; i--) {
                            currentModule.addQuestionAfter(
                              selectId,
                              {
                                id:
                                  currentQuestion.id + "-crossover-followup" + currentSelectFollowup,
                                text:
                                  "Have you ever used the " + numToRank(i) + " new user name in any of your other areas of digital activity?",
                                input:
                                  booleanRadio.replace(/--name--/g, currentQuestion.id + "-crossover-followup" + currentSelectFollowup++),
                                domain:
                                  currentQuestion.domain
                              }
                            );
                          }
                        });
                      });
                  });
                  
                  $("[value='No']:radio").each(function () {
                    $(this).click(function () {
                      var currentModule = stageIII.modules[1],
                          currentQuestion = currentModule.getQuestionById($(this).parents().eq(2).attr("id"));
                      $("[name='" + $(this).attr("name") + "']:radio:nth(0)").attr("clicked", "false");
                      
                      currentModule
                        .removeQuestionsById(currentQuestion.id + "-crossover-count", false)
                        .removeQuestionsById(currentQuestion.id + "-crossover-followup", false);
                    });
                  });
                }); // Stage III rendering
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
                    currentSingularTitle = currentIdioms.account.substring(0, currentIdioms.account.length - 1),
                    currentSingularDomain = currentQuestion.domain.substring(0, currentQuestion.domain.length - 1),
                    currentRadio;
                    
                // Begin by removing questions from the calling module
                currentModule
                  .removeQuestionsById(currentId + "-frequency-", false)
                  .removeQuestionsById(currentId + "-definition", false)
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
                          : "You indicated that you " + currentIdioms.verb + " multiple " + currentQuestion.domain + " " +
                          currentIdioms.account + ". Please explain the reason that you " + currentIdioms.verb + " multiple " + currentIdioms.account +
                          " and then describe the different purpose or function of each " + currentSingularTitle + ".",
                      input:
                        "<textarea name='" + currentId + "-purpose' class='question-field question-textarea' />",
                      domain:
                        currentQuestion.domain
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
                        frequencyRadio.replace(/--name--/g, currentId + "-frequency-" + i + "-radio"),
                      domain:
                        currentQuestion.domain
                    }
                  );
                  
                  // Set up handlers and attributes of the new radio set
                  currentRadio = $("[name='" + currentId + "-frequency-" + i + "-radio']");
                  currentRadio.each(function () {
                    $(this)
                      .val($(this).parent().text())
                      .click(function () {
                        $(this).parent().parent().val($(this).val());
                      });
                      
                    $(this).parent().parent()
                      .attr("name", $(this).attr("label"))
                      .val("undefined");
                  });
                }
                
                // Add the followup question for the general domains asking what the name of the "other"
                // domain is
                if (currentIdioms.general && currentValue !== 0) {
                  currentModule.addQuestionAfter(
                    currentId,
                    {
                      id:
                        currentId + "-definition",
                      text:
                        "Please provide the name of this additional " + currentSingularDomain + " below:",
                      input:
                        "<input name='" + currentId + "-definition' type='text' class='question-field' />",
                      domain:
                        currentQuestion.domain
                    }
                  );
                }
              });
          }); // Stage II render and callback
          
      }); // Stage I setSubmit
    
  // Warn the user that they have not submitted their survey yet if they
  // are at an adequate point of progress
  $(window).on("beforeunload", function () {
    if (!surveyComplete) {
      return "[!] WARNING: You have not yet completed the survey.";
    }
  });
    
});
