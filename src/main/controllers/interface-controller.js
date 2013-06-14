/**
 * interface-controller.js
 * 
 * Controller for UI-related routes.
 */

module.exports = function (app, surveyDao, $TM) {

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
   *   Submit survey answers and proceed to the identity map
   */
  app.post("/identitymap", function (req, res) {
    // TODO Validate the answers---we can't take just any body!

    // Write the response to the database.
    surveyDao.save(req.body, function (error, surveyResponse) {
      if (error) {
        res.send(500, error);
      } else {
        console.log(new Date() + ": Survey response saved:");
        console.log(surveyResponse);
        res.send(201, {location: surveyResponse._id.toString()});
      }
    });
  });

}
