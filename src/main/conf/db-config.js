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
          console.error("[X] There were errors in the database configuration...");
          console.error(error);
        } else {
          console.log("[!] IMP database is " + host + ":" + port);
          
          // Performs a simple query every 3 hours to keep the db connection alive
          // (wait a few seconds at server start to give db time to connect)
          setTimeout(function () {
              surveyDao.preserveConnection();
            setInterval(function () {
              surveyDao.preserveConnection();
              console.log("[~] DB Connection stayin\' alive, stayin\' alive...");
            }, 10800000);
          }, 5000);
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
  
  // Keep DB connection open with a single query
  SurveyDao.prototype.preserveConnection = function (callback) {
    this.getCollection(function (error, surveys) {
      if (error) {
        callback(error);
      } else {
        surveys.find().limit(1);
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
  
  // Returns an array of the matching documents in the indicated collection
  SurveyDao.prototype.search = function (col, query, callback) {
    this.db.collection(col, function (error, currentCollection) {
      if (error) {
        callback(error);
      } else {
        currentCollection.find(
          query,
          // Omit password fields in any search
          {
            password: 0
          }
        ).toArray(function (error, results) {
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
  var surveyDao = this.surveyDao = new SurveyDao("localhost", 27017);

  return this;
};
