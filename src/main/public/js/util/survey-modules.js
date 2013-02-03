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
      questionId = 0;
  
  /*
   * FORM CONFIGURATION
   */
  Form.prototype = {
    
    // Returns a new Form instance with blank modules
    newForm: function (id) {
      this.id = (id) ? id : "form" + formId++;
      this.modules = [];
      this.submitButtons = [];
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
    render: function (container) {
      container = $("#" + container);
      var rendering = "<form id='" + this.id + "-form'>",
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
        $("#" + currentSubmit.container)
          .append("<div class='submit-container'><button id='" + currentSubmit.id + "' class='submit-button'>" + currentSubmit.text + "</button></div>");
          
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
              currentId = (currentBox + "-cb").replace(" ", "-");
          $(this)
            .attr("id", currentId)
            .attr("name", currentId)
            .after("<label for='" + currentId + "'>" + currentBox + "</label>")
        })
      
      // Finally, make sure the select options have proper values
      $("select.question-field")
        .children()
        .each(function () {
          $(this).val($(this).text());
        });
      
      return this;
    },
    
    // Parses the user's input by adding their responses to the hierarchical structure
    // of this form; questions matching the designated class will be recorded
    parseByModule: function (inputClass) {
      var currentModule,
          currentQuestion,
          currentInput;
          
      // Iterate through each module...
      for (var m in this.modules) {
        currentModule = this.modules[m];
        // Then iterate through every question in the module...
        for (var q in currentModule.questions) {
          currentQuestion = currentModule.questions[q];
          // Some questions may have multiple inputs
          currentInput = $("#" + currentQuestion.id + " " + inputClass)
            .each(function () {
              if ($(this).val()) {
                currentQuestion[$(this).attr("name")] = $(this).val();
              }
            });
        }
      }
          
    },
    
    // Removes the calling form from the DOM
    deleteForm: function () {
      for (var m in this.modules) {
        $("#" + this.modules[m].id).remove();
      }
      for (var s in this.submitButtons) {
        $("#" + this.submitButtons[s].id).remove();
      }
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
      // Add all questions to this module for rendering
      for (var q in questionList) {
        this.questions.push(new Question().newQuestion(questionList[q]));
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
      return this;
    },
    
    // Internal HTML-returning function to render a question with its inputs
    render: function () {
      var input = (this.input) ? this.input : "";
      
      var rendering = 
        "<div id='" + this.id + "' class='question'>" +
        "<p>" + this.text + "</p>" +
        "<div id='" + this.id + "-input' class='question-input'>" + input + "</div>" +
        "</div>";
      
      return rendering;
    }
    
  }
  
  // Creates a new form in which to hold survey modules
  $S.createForm = function (id) {
    var newForm = new Form().newForm(id);
    return newForm;
  }
  
});

