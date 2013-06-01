/**
 * interface-controller.js
 * 
 * Controller for UI-related routes.
 */

module.exports = function (app) {

  /*
   * Mongo goodness.  For expediency, this is right here for now.
   * Should eventually go to a separate file.
   */
  var SurveyDao = function (host, port) {
      var Db = require('mongodb').Db,
          Server = require('mongodb').Server;

      this.db = new Db('imp',
        new Server(host, port, { safe: true }, { auto_reconnect: true }, { }),
        { w: 1 } // Has to do with write semantics.
      );

      this.db.open(function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log("imp database is " + host + ":" + port);
        }
      });
    };

  SurveyDao.prototype.getCollection = function (callback) {
      this.db.collection('surveys', function (error, surveys) {
        if (error) {
          callback(error);
        } else {
          callback(null, surveys);
        }
      });
    };

  // Get all survey responses.
  // TODO We may have to scope this into a query eventually.
  SurveyDao.prototype.findAll = function (callback) {
      this.getCollection(function (error, surveys) {
        if (error) {
          callback(error);
        } else {
          surveys.find().toArray(function (error, results) {
            if (error) {
              callback(error);
            } else {
              callback(null, results);
            }
          });
        }
      });
    };

  // Save a response.
  SurveyDao.prototype.save = function (surveyResponse, callback) {
      this.getCollection(function (error, surveys) {
        if (error) {
          callback(error);
        } else {
          // Add a date stamp, just cuz.
          surveyResponse.creationDate = new Date();
          surveys.insert(surveyResponse, function () {
            callback(null, surveyResponse);
          });
        }
      });
    };

  // TODO Defaults; parameterize, ideally.
  var surveyDao = new SurveyDao("localhost", 27017);

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
  app.get("/identitymap/:id", function (req, res) {
    res.render("identitymap", {layout: true});
  });


  /*
   *
   * -------------------> Ajax routes
   *
   */


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
        res.location(surveyResponse._id.toString()).send(201);
      }
    });
  });

}
