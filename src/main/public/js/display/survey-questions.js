/**
 * survey-questions.js
 * 
 * Includes all of the questions and input processing of the
 * various survey stages
 */

$(function() {
  // Form instantiation
  var briefing = $S.createForm("briefing"),
      stageI = $S.createForm("stageI"),
      stageII = $S.createForm("stageII"),
      formContainer = "container";

  /*
   * BRIEFING
   */
  // Create modules and questions for the newly created form
  briefing.addModule(
    // ID for this module
    "mod-briefing",
  
    // Title for this module
    "Identity Mapping Project",
    
    // List of questions for this module, if any
    [
      {
        text: 
          "<strong>Part I of this Survey</strong> will ask you to provide the following:<br/>" +
          "(1) Basic information about your Physical Self (such as your age, sex, education, and country of residence), and <br/>" +
          "(2) a broad overview of your presence in each of 6 digital domains: Email, Blogs, On-Line Forums, Social Networks, Digital Gaming, and 3D Virtual Worlds."
      },
      
      {
        text:
          "<strong>Part II of this Survey</strong> will ask you to provide more detailed information about your involvement in each digital domain where you currently have a presence."
      },
      
      {
        text:
          "<strong>After you complete the survey</strong>, a graphical representation of your current identity will automatically be generated that can be downloaded for free."
      },
      
      {
        text:
          "<strong>Please Note:</strong> Your responses are completely anonymous and we will not ask for any identifying information such as email addresses or account names. " + 
          "We are only interested in whether, and to what extent, you have a presence in a particular digital domain. " +
          "As such, please answer each question as honestly and fully as possible so we can obtain accurate information."
      },
      
      {
        text:
          "<strong>Thank you</strong> in advance for your participation in the project. Please tell others about this website and have them come map their identity. " +
          "Our goal is to generate thousands or even millions of identity maps from around the globe and chart the nature of identity in the contemporary world."
      }
    ]
  )
  .setSubmit(
    "Next",
    "container",
    function () {
      briefing.deleteForm(1000);
      stageI.render(formContainer);
    }
  )
  .render(formContainer);
    
  /*
   * STAGE I
   */
  stageI.addModule(
    "mod-stageI-brief",
    "Identity Mapping: Stage I",
    [
      {
        text: "Please answer the following questions as completely and honestly as possible. Your answers are kept entirely anonymous."
      }
    ]
  );
  
  /*
   * STAGE II
   */

});
