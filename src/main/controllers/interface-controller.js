/**
 * interface-controller.js
 * 
 * Controller for UI-related routes.
 */

module.exports = function (app) {
  
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
  app.get("/identitymap", function (req, res) {
    res.render("identitymap", {layout: true});
  });
  
  
  /*
   * POST /identitymap
   *   CURRENT PLACEHOLDER
   */
  app.post("/identitymap", function (req, res) {
    res.redirect("/identitymap");
  });
  
}
