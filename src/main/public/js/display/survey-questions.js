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
      
      // Determines whether or not a user's custom domain is actually one that already exists
      usedDomains = {},
      isDefinedDomain = function (userInput) {
        userInput = userInput.toLowerCase()
        for (var d in idiomMap) {
          if (d.toLowerCase() === userInput) {
            return d;
          }
        }
        return false;
      },
      
      // Finds whether or not there are valid responses to stage I
      stageIAnswered = function () {
        for (var a = 2; a < stageI.modules.length; a++) {
          for (var r in stageI.modules[a].responses) {
            if (stageI.modules[a].responses[r] !== "undefined" && stageI.modules[a].responses[r] !== "false") {
              return true;
            }
          }
        }
        return false;
      },
      
      // Finds whether or not there are valid responses to stage II
      stageIIAnswered = function () {
        var responses = 0;
        for (var a in finalAnswers) {
          if (a !== "Demo") {
            for (var r in finalAnswers[a]) {
              responses++;
              if (responses >= 2) {
                return true;
              }
            }
          }
        }
        return false;
      },
      
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
      
      // Sanitizes a string with any injected HTML or other code risks
      sanitizeString = function (str) {
        return str.replace(/[^\w\s]/gi, "");
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
        
        $("input[type='text']")
          .each(function () {
            $(this).change(function () {
              var noAnswer = $(this).parents().eq(2).find(":checkbox[survey='noAnswer']");
              if ($(this).val() !== "") {
                noAnswer.removeAttr("checked").val("false");
              }
            });
          });
        
        $(":checkbox[survey='specific']")
          .each(function () {
            $(this).click(function () {
              var noAnswer = $(this).parents().eq(2).find(":checkbox[survey='noAnswer']");
              if ($(this).val() === "true") {
                noAnswer.removeAttr("checked").val("false");
              }
            });
          });
        
        $(":checkbox[survey='noAnswer']")
          .each(function () {
            $(this).attr("name", $(this).attr("name") + "-" + $(this).parents().eq(3).find(".mod-title").text().replace(/\s/g, "-"))
            $(this).click(function () {
              if ($(this).val() === "true") {
                $(this).parent().siblings().find(":checkbox").removeAttr("checked").val("false");
                $(this).parents().eq(3).find("input[type='text']").val("");
              }
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
      stageIMods.email.id,
      stageIMods.email.title,
      stageIMods.email.questions
    )
    .addModule(
      stageIMods.blogs.id,
      stageIMods.blogs.title,
      stageIMods.blogs.questions
    )
    .addModule(
      stageIMods.socialNetworks.id,
      stageIMods.socialNetworks.title,
      stageIMods.socialNetworks.questions
    )
    .addModule(
      stageIMods.onlineDatingSites.id,
      stageIMods.onlineDatingSites.title,
      stageIMods.onlineDatingSites.questions
    )
    .addModule(
      stageIMods.forums.id,
      stageIMods.forums.title,
      stageIMods.forums.questions
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
    // Submit function for Stage I -> Stage II
    .setSubmit(
      "Go to Part II",
      "container",
      function (event) {
        event.preventDefault();
        // Adjust the page scroll
        $(window).scrollTop("#header");
        
        $(":checkbox[survey='noAnswer']")
          .each(function () {
            $(this).val("false");
          });
        
        // Collect the demographic data first
        finalAnswers["Demo"] = {};
        finalAnswers["Demo"]["birth-year"] = $("#demo-year-select").val();
        finalAnswers["Demo"]["sex"] = $("input:radio[name='sex']:checked").val();
        finalAnswers["Demo"]["country"] = $("#country-select").val();
        finalAnswers["Demo"]["education"] = $("#edu-year-select").val();
        
        var currentModule,
            currentSingularTitle,
            currentDomain,
            currentResponse,
            currentFollowup,
            currentMatch,
            definedDomain,
            responseFound,
            specifics = [],
            generals = [],
            generalModifier,
            blogAddition,
            domainIdiom,
            websiteAddition;
            
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
          (stageIAnswered()) ? stageIIMods.briefing.questions : stageIIMods.empty.questions
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
            currentMatch = r.match(/-cb$|-radio$|-field/g);
            
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
                  // Make sure that the user hasn't already specified this domain (e.g., in the "other" section)
                  if (typeof(usedDomains[currentDomain]) === "undefined") {
                    usedDomains[currentDomain] = true;
                  } else {
                    delete currentModule.responses[r];
                    continue;
                  }
                  // Add the domain to the answers list if it doesn't already exist
                  if (typeof(finalAnswers[currentModule.title]) === "undefined") {
                    finalAnswers[currentModule.title] = {};
                  }
                  blogAddition = (currentDomain === "Blogs") ? "one or more " : "";
                  websiteAddition = (currentDomain === "Blogs") ? " / Personal Websites" : "";
                  domainIdiom = (currentDomain === "Emails") ? "Email" : currentDomain;
                  specifics.push(
                    {
                      text:
                        "You indicated that you " + idiomMap[currentDomain].verb + " " + blogAddition + domainIdiom + websiteAddition + ". " +
                        idiomMap[currentDomain].countQuestion,
                        
                      domain: currentDomain
                    }
                  );
                }
                break;
              // Some answers will be to the question: "What other domains in this archdomain do you use?"
              case "-field":
                // Add the domain to the answers list if it doesn't already exist
                if (typeof(finalAnswers[currentModule.title]) === "undefined") {
                  finalAnswers[currentModule.title] = {};
                }
                currentDomain = currentResponse;
                definedDomain = isDefinedDomain(currentDomain);
                if (definedDomain) {
                  currentDomain = definedDomain;
                  // Make sure that the user hasn't already specified this domain (e.g., in the "other" section)
                  if (typeof(usedDomains[currentDomain]) === "undefined") {
                    usedDomains[currentDomain] = true;
                  } else {
                    delete currentModule.responses[r];
                    continue;
                  }
                }
                generals.push(
                  {
                    text:
                      "You indicated that you " + idiomMap[currentModule.title].verb + " " + currentDomain + ". " +
                      idiomMap[currentModule.title].countQuestion + " " + currentDomain + " that you've used within the past year?",
                      
                    definition: currentDomain,
                    domain: currentModule.title
                  }
                );
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
                    currentSpecificDomain = (currentQuestion.definition) ? currentQuestion.definition : currentArchdomain + " " + otherDomainCounter;
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
                      finalAnswers[currentArchdomain][currentSpecificDomain]["definition"] = sanitizeString(currentResponse);
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
                  (stageIIAnswered()) ? stageIIIMods.briefing.questions : stageIIIMods.empty.questions
                );
                
                // We will use the current state of finalAnswers to populate the stage III questions
                var currentArchdomain,
                    currentSubdomain,
                    domainIdiom,
                    accountIdiom,
                    verbIdiom,
                    currentSingularAccount,
                    crossoverCount = 0,
                    crossoverQuestions = [],
                    questionText,
                    domainInvolvementChecks = "",
                    domainSanitized,
                    blogAddition;
                
                for (var a in finalAnswers) {
                  if (a !== "Demo") {
                    currentArchdomain = finalAnswers[a];
                    for (var s in currentArchdomain) {
                      currentSubdomain = currentArchdomain[s];
                      // If the current subdomain has a "definition" field, then we know it must have been a write-in,
                      // which requires special treatment
                      domainIdiom = s;
                      accountIdiom = (idiomMap[s])
                        ? idiomMap[s].account
                        : idiomMap[a].account;
                      verbIdiom = (idiomMap[s])
                        ? idiomMap[s].verb
                        : idiomMap[a].verb;
                      currentSingularAccount = accountIdiom.substring(0, accountIdiom.length - 1);
                      currentSingularDomain = domainIdiom.substring(0, domainIdiom.length - 1);
                      blogAddition = (a === "Blogs / Personal Websites") ? " / Personal Website" : "";
                      // The question text has a different format for the Blogs and Emails case
                      questionText = (a === "Blogs / Personal Websites" || a === "Emails")
                        ? "You indicated that you " + verbIdiom + " one or more " + currentSingularDomain + blogAddition + " " + accountIdiom + ". Have you ever " +
                          "created " + correctIndefiniteArticle(domainIdiom) + " " + currentSingularDomain + blogAddition + " " + currentSingularAccount + " name that is different " +
                          "than your real world name?"
                        : "You indicated that you " + verbIdiom + " one or more " + accountIdiom + " in " + domainIdiom + ". Have you ever " +
                          "created " + correctIndefiniteArticle(accountIdiom) + " " + currentSingularAccount + " name in " + domainIdiom + " that is different " +
                          "than your real world name?"
                      crossoverQuestions.push(
                        {
                          text:
                            questionText,
                          input:
                            booleanRadio.replace(/--name--/g, s + "-radio-" + crossoverCount++),
                          domain:
                            s,
                          definition:
                            currentSubdomain["definition"]
                        }
                      );
                      domainSanitized = ((currentSubdomain["definition"]) ? currentSubdomain["definition"] : ((s === "Blogs") ? "Blogs / Personal Websites" : s)).replace(/[^a-zA-Z0-9\s\/]/g, "")
                      domainInvolvementChecks += "<input type='checkbox' name='--name--' class='question-checkbox' label='" + domainSanitized + "' survey='crossover' />";
                    }
                  }
                }
                
                // Add the questions to stage III!
                if (crossoverQuestions.length > 1) {
                  stageIII.addModule(
                    stageIIIMods.crossover.id,
                    stageIIIMods.crossover.title,
                    crossoverQuestions
                  );
                }
                
                stageIII.setSubmit(
                  "Continue",
                  "container",
                  function () {
                    // Adjust the page scroll
                    $(window).scrollTop("#header");
                    stageIII
                      .parseByModule(":checkbox:checked")
                      .deleteForm();
                      
                    var currentModule = stageIII.modules[1],
                        currentMatch,
                        currentQuestion,
                        currentResponse,
                        crossoverCategory;
                    
                    // Add the crossovers bucket to finalAnswers
                    finalAnswers["Crossover"] = {};
                    
                    if (currentModule) {
                      // Finally, we parse the stage III responses
                      for (var r in currentModule.responses) {
                        currentQuestion = currentModule.getQuestionById(r.split("-")[0]);
                        crossoverCategory = (currentQuestion.definition) ? currentQuestion.definition : currentQuestion.domain;
                        
                        if (typeof(finalAnswers["Crossover"][crossoverCategory]) === "undefined") {
                          finalAnswers["Crossover"][crossoverCategory] = [];
                        }
                        finalAnswers["Crossover"][crossoverCategory].push(currentModule.responses[r]);
                      }
                    }

                    stageIV.addModule(
                      stageIVMods.id,
                      stageIVMods.title,
                      stageIVMods.questions
                    )
                    .setSubmit(
                      "Create My Map",
                      "container",
                      function (event) {
                        event.preventDefault();
                        surveyComplete = true;
                        
                        console.log(finalAnswers);

                        $.ajax({
                          type: "POST",
                          url: "/identitymap",
                          data: {
                            challenge: Recaptcha.get_challenge(),
                            response: Recaptcha.get_response(),
                            survey: finalAnswers
                          },
                          success: function (data, textStatus, jqXHR) {
                            if (jqXHR.status === 201) {
                              // Created: grab the location and use it for the identity map.
                              window.location = "/identitymap/" + data.location;
                            } else {
                              alert("We got an unexpected response from the server.\n" +
                                    "Please contact the IMP investigators.");
                              window.location = "/";
                            }
                          },
                          error: function (jqXHR, textStatus, errorThrown) {
                            // 403 FORBIDDEN is what we return on a reCAPTCHA fail.
                            // For everything else, we go generic.
                            alert(jqXHR.status === 403 ?
                              "Sorry, but word answer verification did not succeed.\n" +
                                "Please try again.\n\n" +
                                "You can click the button above the speaker icon\n" +
                                "to get a new pair of word images if the one you see\n" +
                                "looks too difficult." :
                              "We got an unexpected response from the server.\n" +                                                                                                       
                                "Please contact the IMP investigators."
                            );
                            Recaptcha.reload();
                          }
                        });
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
                            followupCrossoverId = currentQuestion.id + "-crossovers",
                            followupCrossoverBooleanId = followupCrossoverId + "-boolean",
                            currentDomainCheck = (currentQuestion.domain === "Blogs") ? "Blogs / Personal Websites" : currentQuestion.domain,
                            effectiveDomainChecks = $('<div>').append($(domainInvolvementChecks).not("[label='" + currentDomainCheck + "'], " +
                              "[label='" + currentQuestion.definition + "']").clone()).html(),
                            effectiveReferent = (currentQuestion.domain === "Blogs" || currentQuestion.domain === "Emails")
                              ? currentQuestion.domain.substring(0, currentQuestion.domain.length - 1)
                              : currentQuestion.definition || currentQuestion.domain;
                              
                        if (currentQuestion.domain === "Blogs") {
                          effectiveReferent += " / Personal Website";
                        }
                        
                        currentModule.addQuestionAfter(
                          currentQuestion.id,
                          {
                            id:
                              followupCrossoverBooleanId,
                            text:
                              "Did this username <strong>originate</strong> as " + correctIndefiniteArticle(effectiveReferent) + " " + effectiveReferent +
                              " username and then <strong>later</strong> become a username in another digital domain?",
                            input:
                              booleanRadio.replace(/--name--/g, followupCrossoverBooleanId),
                            domain:
                              currentQuestion.domain,
                            definition:
                              currentQuestion.definition
                          }
                        );
                        
                        $("#" + followupCrossoverBooleanId + " [value='true']:radio")
                          .each(function () {
                            $(this).click(function () {
                              if ($(this).attr("clicked") === "true") {
                                return;
                              }
                              currentModule.addQuestionAfter(
                                followupCrossoverBooleanId,
                                {
                                  id:
                                    followupCrossoverId,
                                  text:
                                    "Please mark each domain below in which you have <strong>later</strong> used this same username:",
                                  input:
                                    effectiveDomainChecks.replace(/--name--/g, followupCrossoverId),
                                  domain:
                                    currentQuestion.domain,
                                  definition:
                                    currentQuestion.definition
                                }
                              );
                              
                              // Set up handlers for the newly created checkboxes
                              $("#" + followupCrossoverId + " :checkbox")
                                .each(function () {
                                  var currentBox = $(this).attr("label"),
                                      currentId = (followupCrossoverId + "-" + currentBox + "-cb").replace(/ /g, "-");
                                  
                                  $(this)
                                    .attr("id", currentId)
                                    .attr("name", currentId)
                                    .val(currentBox)
                                    .addClass("checkbox")
                                    .replaceWith("<label class='checkbox'>" + $(this)[0].outerHTML + currentBox + "</label>");
                                });
                                
                              $(this).attr("clicked", "true");
                              $("#" + followupCrossoverId).addClass("followup-2");
                              
                              $("#" + followupCrossoverBooleanId + " [value='false']:radio").each(function () {
                                $(this).click(function () {
                                  var currentModule = stageIII.modules[1],
                                      currentQuestion = currentModule.getQuestionById($(this).parents().eq(2).attr("id"));
                                  $("[name='" + $(this).attr("name") + "']:radio:nth(0)").attr("clicked", "false");
                                  
                                  currentModule
                                    .removeQuestionsById(followupCrossoverId, true);
                                });
                              });
                            });
                          });
                        
                        $(this).attr("clicked", "true");
                        $("#" + followupCrossoverBooleanId).addClass("followup-1");
                      });
                  });
                  
                  $("[value='No']:radio").each(function () {
                    $(this).click(function () {
                      var currentModule = stageIII.modules[1],
                          currentQuestion = currentModule.getQuestionById($(this).parents().eq(2).attr("id"));
                      $("[name='" + $(this).attr("name") + "']:radio:nth(0)").attr("clicked", "false");
                      
                      currentModule
                        .removeQuestionsById(currentQuestion.id + "-crossovers", false);
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
                    currentRadio,
                    modifiedDomain = (currentQuestion.domain === "Blogs" || currentQuestion.domain === "Emails")
                      ? currentQuestion.domain.substring(0, currentQuestion.domain.length - 1)
                      : (currentQuestion.definition) ? currentQuestion.definition : currentQuestion.domain;
                      
                if (currentQuestion.domain === "Blogs") {
                  modifiedDomain += " / Personal Website";
                }
                    
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
                          " " + modifiedDomain + " " + currentSingularTitle + ". What is your function or purpose in using this " +
                          currentSingularTitle + "?"
                          : "You indicated that you " + currentIdioms.verb + " multiple " + modifiedDomain + " " +
                          currentIdioms.account + ". Please explain the reason that you " + currentIdioms.verb + " multiple " + currentIdioms.account +
                          " and then describe the different purpose or function of each " + currentSingularTitle + ".",
                      input:
                        "<textarea name='" + currentId + "-purpose' maxlength='4000' class='question-field question-textarea' />",
                      domain:
                        currentQuestion.domain
                    }
                  );
                  $("#" + currentId + "-purpose").addClass("followup-1");
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
                  $("#" + currentId + "-frequency-" + i).addClass("followup-1");
                  
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
              }).change();
          }); // Stage II render and callback
          
      }); // Stage I setSubmit
    
  // Warn the user that they have not submitted their survey yet if they
  // are at an adequate point of progress
  $(window).on("beforeunload", function () {
    if (!surveyComplete) {
      return "[!] WARNING: You have not yet completed the survey.";
    }
  });
  
  // Remove the loading div
  $("#loading").remove();
    
});
