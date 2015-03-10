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
  
  app.post("/admin-aggregates", function (req, res) {
    var inputs = req.body,
        domains = inputs.domains,
        gender = inputs.gender,
        age = inputs.age,
        edu = inputs.edu,
        query = {};
    
    // If any domains were selected, then create an "or" query over
    // them
    if (domains && domains.length) {
      var dQuery = {$or: []}
      for (var d in domains) {
        var toAdd = {};
        toAdd[domains[d]] = {$exists: 1};
        dQuery.$or.push(toAdd);
      }
      console.log(dQuery);
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
                  result.filteredProfiles += Object.keys(currentDomain[domainKeys[k]]).length;
                }
              }
            }
            
            res.send(200, result);
          }
        );
        
      }
    );
  });
  
}
