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
      return this;
    },
    
    // Adds a new module to a form
    addModule: function (id, title, questions) {
      var newModule = new Module().newModule(id, title, questions);
      this.modules.push(newModule);
      return this;
    },
    
    // Pushes the current form to the page inside the given container element
    render: function (container) {
      container = $("#" + container);
      var rendering = "";
      
      // First, we'll iterate through each module
      for (var m in this.modules) {
        rendering += this.modules[m].render();
      }
      
      // Then, we'll add the modules to the given container!
      container.append(rendering);
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
        input +
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

/*
 * TESTING SECTION
 */

// Create form to be displayed
var form = $S.createForm("survey1");

// Create modules and questions for the newly created form
form.addModule(
    // ID for this module
    "mod-briefing",
  
    // Title for this module
    "Identity Mapping Project Description",
    
    // List of questions for this module, if any
    [
      {
        // ID handled automatically by the 
        text: "Please read the following info about the study [truncated]..."
      },
      
      {
        text: "Here's an input!",
        input: "<input type='text'>"
      }
    ]
  )
  .addModule(
    "test2",
    "Here's another Module buddy!",
    
    [
      {
        text: "I'm not your buddy, pal!"
      }
    ]
  )
  .render("container");
