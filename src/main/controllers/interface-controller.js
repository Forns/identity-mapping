/**
 * interface-controller.js
 * 
 * Controller for UI-related routes.
 */

module.exports = function (tools) {
  var app = tools.app,
      surveyDao = tools.surveyDao,
      $TM = tools.$TM,
      adminMail = tools.adminMail,
      request = tools.request;

  /*
   * GET /
   *   Render the index with nav buttons for the project
   */
  app.get("/", function (req, res) {
    // Simply render the greeting page
    res.render("index", {layout: true});
  });
  
  /*
   * GET /about
   *   Render the about page with information about the project
   */
  app.get("/about", function (req, res) {
    res.render("about", {layout: true});
  });
  
  /*
   * GET /survey
   *   Render the survey part I
   */
  app.get("/survey", function (req, res) {
    res.render("survey", {layout: true});
  });
  
  /*
   * GET /identitymap
   *   Render the identitymap report section
   */
  app.get("/identitymap/:id?", function (req, res) {
    res.render("identitymap", {layout: true});
  });

  /*
   * GET /topicmodels
   *   Render the topic modelling report section
   */
  app.get("/topicmodels", function (req, res) {
    res.render("topicmodels", {layout: true});
  });
  

  /*
   *
   * -------------------> Ajax routes
   *
   */


  /*
   * GET /survey/:id
   *   Return the survey result with the given id
   */
  app.get("/survey/:id", function (req, res) {
    surveyDao.findById(req.params.id, function (error, surveyResponse) {
      if (error) {
        res.send(500, error);
      } else {
        if (surveyResponse) {
          res.send(surveyResponse);
        } else {
          res.send(404, "survey.response.not.found");
        }
      }
    });
  });
  
  /*
   * GET /topictree
   *   Returns the current topic models tree
   */
  app.get("/topictree", function (req, res) {
    res.send(201, $TM.currentModels);
  });

  /*
   * POST /identitymap
   *   Submit survey answers alongside a reCAPTCHA response and
   *   proceed to the identity map
   */
  app.post("/identitymap", function (req, res) {
    // TODO Validate the answers---we can't take just any body!

    // First, reCAPTCHA.
    request.post(
      {
        url: "http://www.google.com/recaptcha/api/verify",
        form: {
          privatekey: process.env.IMP_PRIVATE, // reCAPTCHA private key
          remoteip: req.ip,
          challenge: req.body.challenge,
          response: req.body.response
        }
      },
      function (error, response, body) {
        var result = body.split("\n");
        if (result[0] === "true") {
          // If the reCAPTCHA checks out, write the response to the database.
          surveyDao.save(req.body.survey, function (error, surveyResponse) {
            if (error) {
              res.send(500, error);
            } else {
              console.log(new Date() + ": Survey response saved:");
              console.log(surveyResponse);
              res.send(201, { location: surveyResponse._id.toString() });
            }
          });
        } else {
          // We choose to use 403 FORBIDDEN because, well, FORBIDDEN!
          // (if you fail the reCAPTCHA)
          res.send(403, result[1]);
        }
      }
    );

  });
  
  /*
   * POST /share
   *   Shares an identity map page with a list of email addresses
   */
  app.post("/share", function (req, res) {
    // Firstly, gather the inputs...
    var inputs = req.body,
        emails = inputs.emails,
        surveyId = inputs.surveyId,
        sharer = (inputs.sharer) ? inputs.sharer : "Somebody",
        mapAddress = "http://imp.cs.lmu.edu/identitymap/" + surveyId
        pureEmails = [],
        badEmails = [];
        
    // Next, we'll gather the email addresses that are
    // actually valid:
    for (var e in emails) {
      if (adminMail.validEmail(emails[e])) {
        pureEmails.push(emails[e]);
      } else {
        badEmails.push([emails[e]]);
      }
    }
    
    // For each good email, we'll send out a link in an email
    for (var p in pureEmails) {
      adminMail.shareEmail(
        pureEmails[p],
        mapAddress,
        sharer
      );
    }
    
    res.send(201, {badEmails: badEmails});
  });

}
