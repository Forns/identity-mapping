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
      request = tools.request,
      status = tools.status,
      sechash = tools.sechash,
      SITE_DOMAIN = status.SITE_DOMAIN;

  var extend = require('jquery-extend');

  /*
   * Aggregator functions.
   */
  var accumulateNumber = function (aggregate, addition, total) {
    return (+aggregate || 0) + ((+addition || 0) / total);
  },

  accumulateString = function (aggregate, addition) {
    var currentText = aggregate || "";
    if (addition && (currentText.indexOf(addition) === -1)) {
      currentText += (currentText ? ", " : "") + addition;
    }
    return currentText;
  },

  accumulateDemographics = function (aggregate, addition, total) {
    return {
      'birth-year': accumulateNumber(aggregate['birth-year'], addition['birth-year'], total),
      sex: accumulateString(aggregate.sex, addition.sex),
      country: accumulateString(aggregate.country, addition.country),
      education: accumulateNumber(aggregate.education, addition.education, total)
    };
  },

  accumulateDomain = function (aggregate, addition) {
  },

  accumulateCrossover = function (aggregate, addition) {
  },

  aggregateResults = function (surveys) {
    return surveys.reduce(function (aggregate, current, index, array) {
      var demographics = (index > 0) ?
        extend({ }, aggregate.Demo) :
        { 'birth-year': 0, sex: "", country: "", education: 0 };
      demographics = accumulateDemographics(demographics, current.Demo, array.length);

//      var domain = (index > 0) ? extend({ }, aggregate) : { };
//      Object.keys(current).filter(function (key) {
//        return key !== 'Demo' && key !== 'Crossover';
//      }).forEach(function (key) {
//        if (aggregate[key]) {
//          aggregate[key] = accumulateDomain(aggregate[key], current[key]);
//        } else {
//          aggregate[key] = current[key];
//        }
//      });

      extend(aggregate, current);
      aggregate.Demo = demographics;

      return aggregate;
    }, { });
  };

  /*
   * GET ROUTES
   */
  
  app.get("/admin-login", function (req, res) {
    res.render("admin-login", {
      layout: true,
      scripts: [
        "js/display/admin-login-display.js"
      ]
    });
  });
  
  app.get("/admin", function (req, res) {
    if (req.session.user && req.session.user.access === "admin") {
      res.render("admin", {
        layout: true,
        scripts: [
          "js/display/admin-display.js"
        ]
      });
    } else {
      res.redirect("/401");
    }
  });

  app.get("/401", function (req, res) {
    res.render("401", {layout: true});
  });
  
  app.get("/logout", function (req, res) {
    delete req.session.user;
    res.redirect("/");
  });
  
  app.get("/survey-snapshot", function (req, res) {
    var inputs = req.body;
    
    if (!req.session.user || req.session.user.access !== "admin") {
      res.send(401);
      return;
    }
    
    surveyDao.search(
      "surveys",
      {},
      function (err, results) {
        if (err) {
          console.error(err);
          return;
        }
        
        var snapshot = {
              count: 0,
              avgAge: 0,
              avgMale: 0
            },
            ageAnswered = 0,
            sexAnswered = 0;
        
        for (var r in results) {
          currentResult = results[r];
          snapshot.count++;
          if (!isNaN(new Date(currentResult["Demo"]["birth-year"]).getTime())) {
            snapshot.avgAge += new Date().getYear() - new Date(currentResult["Demo"]["birth-year"]).getYear();
            ageAnswered++;
          }
          if (currentResult["Demo"]["sex"] !== "Please select...") {
            snapshot.avgMale += (currentResult["Demo"]["sex"] === "Male") ? 1 : 0;
            sexAnswered++;
          }
        }
        
        snapshot.avgAge /= ageAnswered;
        snapshot.avgMale /= sexAnswered;
        
        res.send(snapshot);
      }
    );
  });
  

  /*
   * POST ROUTES
   */
  
  app.post("/admin-login", function (req, res) {
    // Firstly, gather the inputs...
    var inputs = req.body,
        password = sechash.basicHash("md5", inputs.password);
        
    surveyDao.search(
      "accounts",
      {
        password: password
      },
      function (err, results) {
        if (err) {
          console.error(err);
          return;
        }
        
        if (results.length) {
          req.session.user = {};
          req.session.user.access = "admin";
          res.send(200);
        } else {
          res.send(401);
        }
      }
    );
  });

  /*
   * callback is a function (results, count, domains) { }.
   */
  var processAggregateQuery = function (req, res, callback) {
    var inputs = req.body,
        domains = inputs.domains,
        gender = inputs.gender,
        age = inputs.age,
        edu = inputs.edu,
        query = {};

    // FIXME Cheap hack to [temporarily] accommodate non-array form submission
    if (typeof(domains) === "string"){
      domains = [domains];
    }

    // If any domains were selected, then create an "or" query over
    // them
    if (domains && domains.length) {
      var dQuery = {$or: []}
      for (var d in domains) {
        var toAdd = {};
        toAdd[domains[d]] = {$exists: 1};
        dQuery.$or.push(toAdd);
      }
      query = dQuery;
    }
    
    // Now we'll add any demographic query information
    if (age) {
      var thirtyYearsBack = new Date().getFullYear() - 30;
      query["Demo.birth-year"] = (age === "under30")
        ? {$lt: "" + thirtyYearsBack}
        : {$gte: "" + thirtyYearsBack};
    }
    if (edu) {
      query["Demo.education"] = (edu === "no")
        ? {$lt: "13"}
        : {$gte: "13"};
    }
    if (gender) {
      query["Demo.sex"] = inputs.gender;
    }
    
    // First get a tally of all surveys
    surveyDao.search(
      "surveys",
      {},
      function (err, results) {
        if (err) {
          console.error(err);
          res.send(500);
        }
        var count = results.length;

        // Then perform the sub-query
        surveyDao.search(
          "surveys",
          query,
          function (err, results) {
            if (err) {
              console.error(err);
              res.send(500);
            }
            
            callback(results, count, domains);
          }
        );
      }
    );
  };

  /*
   * Expects inputs of the format:
   * {
   *   domains: ["archdomain1", "archdomain2", ...], // currently only supporting 1 archdomain at a time
   *   age: "" | "under30" | "over30",
   *   edu: "" | "no" | "yes" // for no college or some college
   * }
   * 
   * Will return object with various aggregate statistics:
   * {
   *   totalCount: total number of surveys,
   *   filteredCount: total number of surveys matching the filter,
   *   filteredDomains: total number of domains amongst those matched by the filter,
   *   filteredProfiles: total number of domain profiles amongst those matched by the filter
   * }
   */
  app.post("/admin-aggregates", function (req, res) {
    processAggregateQuery(req, res,
          function (results, count, domains) {
            var result = {
              totalCount: count,
              filteredCount: results.length,
              filteredDomains: 0,
              filteredProfiles: 0
            };
            
            for (var r in results) {
              for (var d in domains) {
                var currentDomain = results[r][domains[d]],
                    domainKeys = Object.keys(currentDomain);
                
                result.filteredDomains += domainKeys.length;
                for (var k in domainKeys) {
                  var currentItem = currentDomain[domainKeys[k]],
                      itemKeys = Object.keys(currentItem);
                      
                  for (var c in itemKeys) {
                    if (itemKeys[c].substring(0, 9) === "frequency") {
                      result.filteredProfiles += 1;
                    }
                  }
                }
              }
            }
            
            res.send(200, result);
          }
    );
  });

  app.post("/aggregate-map", function (req, res) {
    processAggregateQuery(req, res,
      function (results, count, domains) {
        res.render("identitymap", {
          layout: true,
          url: SITE_DOMAIN + req.url,
          identitymap: aggregateResults(results)
        });
      }
    );
  });

}
