/**
 *  db-config.js
 * 
 *  Contains the MongoDB DAO set-up
 */

module.exports = function () {
  
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

  // Get a survey response by object id.
  SurveyDao.prototype.findById = function (id, callback) {
      this.getCollection(function (error, surveys) {
        if (error) {
          callback(error);
        } else {
          var ObjectID = require('mongodb').ObjectID;
          surveys.findOne({ _id: new ObjectID(id) }, callback);
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
  var surveyDao = this.surveyDao = new SurveyDao("localhost", 27017);
  
  return this;
};
