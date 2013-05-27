/**
 * survey-modules.js
 * 
 * Provides survey form construction for the various phases of the
 * identity mapping process.
 * 
 * This utility follows a hierarchical structure:
 * form0
 *   module0
 *     question0
 *     question1
 *     ...
 *   ...
 *   module(n)
 *  ...
 * form(n)
 * ...
 * 
 * Here, (typically) one form is shown at a given time with each of its modules
 * arranged for visual clarity, and each module consisting of set questions and
 * their input responses.
 * 
 * Code example:
 *   // Create form to be displayed
 *   var form = $S.createForm("survey1");
 *   
 *   // Create modules and questions for the newly created form
 *   form.addModule(
 *     // ID for this module
 *     "mod-briefing",
 * 
 *     // Title for this module
 *     "Identity Mapping Project Description",
 *     
 *     // List of questions for this module, if any
 *     [
 *       {
 *         // ID handled automatically by the 
 *         text: "Please read the following info about the study [truncated]...",
 *         input: {}
 *       },
 *       {
 *         ...
 *       }
 *     ]
 *   );
 */

// Global survey object used to create various survey components
var $S = function() {};

$(function () {
  
  // Internal Form class for the survey modules
  var Form = function() {},
      // Internal Module class that makes up each Form
      Module = function() {},
      // Internal Question class that makes up each Module
      Question = function() {},
  
      // Form, Module, and Question IDs for dynamic naming if no ids are provided
      formId = 0,
      moduleId = 0,
      questionId = 0,
      followupCount = 0;
  
  /*
   * FORM CONFIGURATION
   */
  Form.prototype = {
    
    // Returns a new Form instance with blank modules
    newForm: function (id) {
      this.id = (id) ? id : "form" + formId++;
      this.modules = [];
      this.submitButtons = [];
      this.rendered = false;
      return this;
    },
    
    // Adds a new module to a form
    addModule: function (id, title, questions) {
      var newModule = new Module().newModule(id, title, questions);
      this.modules.push(newModule);
      return this;
    },
    
    // Allows for easy submission behavior for form
    setSubmit: function (buttonText, container, behavior) {
      var buttonId = this.id + "-submit";
      
      // Set a handle for the submit button on the form
      this.submitButtons.push({
        text: buttonText,
        id: buttonId,
        container: container,
        behavior: behavior
      });
      
      return this;
    },
    
    // Pushes the current form to the page inside the given container element
    render: function (container, callback) {
      container = $("#" + container);
      var rendering = "<form id='" + this.id + "-form'>",
          lastModule = this.modules[this.modules.length - 1],
          currentSubmit;
      
      // First, we'll iterate through each module
      for (var m in this.modules) {
        rendering += this.modules[m].render();
      }
      
      // Then, we'll add the modules to the given container!
      container.prepend(rendering + "</form>");
      
      // ...iterating also through the submit buttons, if any
      for (var s in this.submitButtons) {
        currentSubmit = this.submitButtons[s];
        
        // Create a new button at the end of the given container
        $("#" + lastModule.id)
          .append(
            "<div class='submit-container'><button id='" + currentSubmit.id +
            "' class='submit-button btn btn-large btn-primary'>" + currentSubmit.text +
            "</button></div>"
          );

        $("#" + currentSubmit.id)
          .button()
          .click(currentSubmit.behavior);
      }
      
      // Next, we want to make sure the inputs are properly named for serialization
      $(".question-field").each(function () {
        $(this).attr("name", $(this).parent().attr("id") + "-field");
      });
      
      // Checkboxes should be labeled and named for serialization
      $(":checkbox")
        .each(function () {
          var currentBox = $(this).attr("label"),
              currentId = (currentBox + "-cb").replace(/ /g, "-");
          
          $(this)
            .attr("id", currentId)
            .attr("name", currentId)
            .val("false")
            .addClass("checkbox")
            .replaceWith("<label class='checkbox'>" + $(this)[0].outerHTML + currentBox + "</label>");
          
          $("#" + currentId)
            .click(function () {
              $(this).attr("value", ! ($(this).attr("value") === "true"));
            });
        });
      
      var radioNames = {};
      // Radio buttons should be named for serialization
      $(":radio")
        .each(function () {
          var currentGroup = $(this).attr("name"),
              currentId;
          
          if(typeof(radioNames[currentGroup]) === "undefined") {
            radioNames[currentGroup] = 0;
          } else {
            radioNames[currentGroup] += 1; 
          }
          
          currentId = currentGroup + "-" + radioNames[currentGroup];
          
          $(this)
            .attr("id", currentId)
            .val($(this).parent().text())
            .click(function () {
              $(this).parent().parent().val($(this).val());
            });
            
          $(this).parent().parent()
            .attr("name", $(this).attr("label"))
            .val("undefined");
        });
      
      // Finally, make sure the select options have proper values
      $("select.question-field")
        .children()
        .each(function () {
          $(this).val($(this).text());
        });
        
      if (callback) {
        callback();
      }
      
      this.rendered = true;
      return this;
    },
    
    // Parses the user's input by adding their responses to the hierarchical structure
    // of this form; questions matching the designated class will be recorded
    parseByModule: function (inputClass) {
      var currentModule,
          currentQuestion,
          currentInput,
          currentVal;
      
      // Iterate through each module...
      for (var m in this.modules) {
        currentModule = this.modules[m];
        // Then iterate through every question in the module...
        for (var q in currentModule.questions) {
          currentQuestion = currentModule.questions[q];
          // Some questions may have multiple inputs
          currentInput = $("#" + currentQuestion.id + " " + inputClass)
            .each(function () {
              currentVal = $(this).val();
              if (currentVal) {
                currentModule.responses[$(this).attr("name")] = currentVal;
              }
            });
        }
      }
      return this;
    },
    
    // Removes the calling form from the DOM
    deleteForm: function () {
      for (var m in this.modules) {
        $("#" + this.modules[m].id).remove();
      }
      for (var s in this.submitButtons) {
        $("#" + this.submitButtons[s].id).remove();
      }
      
      this.rendered = false;
      return this;
    }
    
  }
  
  /*
   * MODULE CONFIGURATION
   */
  Module.prototype = {
    
    // Returns a new Module instance with given Questions
    newModule: function (id, title, questionList) {
      this.id = (id) ? id : "module" + moduleId++;
      this.title = title;
      this.questions = [];
      this.responses = {};
      this.rendered = false;
      // Add all questions to this module for rendering
      for (var q in questionList) {
        this.questions.push(new Question().newQuestion(questionList[q]));
      }
      return this;
    },
    
    // Removes a question in the calling Module and animates its removal
    // if the particular module has already been rendered
    removeQuestionByIndex: function (index) {
      this.questions[index].removeQuestion();
      this.questions.splice(index, 1);
      return this;
    },
    
    // Adds a question in the calling Module and animates its addition
    // if the particular module has already been rendered
    // If the isFollowup flag is true, then the added question will have
    // an id of the form [previous_question_name]-followup# where # is an
    // incrementing value
    addQuestionByIndex: function (index, question, isFollowup) {
      var q = question,
          rendering;
      if (typeof(question) !== "Question") {
        q = new Question().newQuestion(question);
      }
      if (isFollowup) {
        q.id = ($("#" + this.questions[index - 1].id))
          ? this.questions[index - 1].id + "-followup" + followupCount++
          : this.id + "-followup" + followupCount++;
      }
      rendering = q.render();
      
      // Make sure the stated index always properly adds to the question
      // list (acts as a push if it's too high an index)
      if (index > this.questions.length) {
        index = this.questions.length;
      }
      
      // Now, add the HTML where it belongs in the survey
      if (index === 0) {
        $("#" + this.id).prepend(rendering);
      } else {
        $("#" + this.questions[index - 1].id).after(rendering);
      }
      
      this.questions.splice(index, 0, q);
      
      // Animate the question addition if the current module has been rendered
      if (this.rendered) {
        $("#" + this.questions[index].id).slideDown();
      }
      
      return this;
    },
    
    // Adds a question in the calling Module after the question with
    // the given id. If no such id is found, the question is not added.
    // If the isFollowup flag is true, then the added question will have
    // an id of the form [previous_question_name]-followup# where # is an
    // incrementing value
    addQuestionAfter: function (afterQuestion, question, isFollowup) {
      var i = 0;
      while (i < this.questions.length) {
        if (this.questions[i].id === afterQuestion) {
          this.addQuestionByIndex(i + 1, question, isFollowup);
          return this;
        }
        i++;
      }
      return this;
    },
    
    // Internal HTML-returning function to render a module with its questions
    render: function () {
      var rendering = "<div id='" + this.id + "' class='module'>" +
        "<div class='mod-title'>" + this.title + "</div>";
      
      // Render each question in this module individually
      for (var q in this.questions) {
        rendering += this.questions[q].render();
      }
      
      rendering += "</div>";
      this.rendered = true;
      return rendering;
    }
    
  }
  
  /*
   * QUESTION CONFIGURATION
   */
  Question.prototype = {
    
    // Returns a new Question instance with blank fields and inputs
    newQuestion: function (question) {
      this.id = (question.id) ? question.id : "question" + questionId++;
      this.text = question.text;
      this.input = question.input;
      this.rendered = false;
      return this;
    },
    
    // Removes the current question, and animates its removal if it's been rendered
    removeQuestion: function () {
      if (this.rendered) {
        $("#" + this.id)
          .slideUp(function () {
            $(this).remove();
          });
      }
    },
    
    // Internal HTML-returning function to render a question with its inputs
    render: function () {
      var input = (this.input) ? this.input : "",
      
      rendering = 
        "<div id='" + this.id + "' class='question'>" +
        "<p>" + this.text + "</p>" +
        "<div id='" + this.id + "-input' class='question-input'>" + input + "</div>" +
        "</div>";
      
      // No need to keep the input html
      delete this.input;
      this.rendered = false;
      
      return rendering;
    }
    
  }
  
  /*
   * SURVEY MODULE FUNCTIONS
   */
  
  // Creates a new form in which to hold survey modules
  $S.createForm = function (id) {
    var newForm = new Form().newForm(id);
    return newForm;
  };
  
  // Substitutes a bootstrap autofill for a select menu with the given id
  $S.convertSelectToAutofill = function (id) {
    var currentSelect = $("#" + id),
        currentOptions = $("option", currentSelect),
        itemList = "[";
        
    currentOptions.each(function () {
      itemList += "\"" + $(this).html() + "\", ";
    });
    // Shave off the last space and comma, then cap it with a bracket
    itemList = itemList.substring(0, itemList.length - 2) + "]";
    itemList = itemList.replace(/'/g, "");
    
    currentSelect.replaceWith(
      "<input id='" + id + "' type='text' data-provide='typeahead' data-source='" + itemList + "' >"
    );
  };
  
});

