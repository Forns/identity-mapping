/**
 * admin-display.js
 */

$(function () {
  var totalSurveys;
  
  // Setup country select
  $("#country-select").html(
    moduleList.stageI.demo.questions[2].input
  );
  
  $.ajax({
    url: "/survey-snapshot",
    type: "GET",
    success: function (results, textStatus, jqXHR) {
      totalSurveys = results.count;
      $("#count").text(results.count);
      $("#avgAge").text(results.avgAge.toFixed(2));
      $("#avgMale").text(results.avgMale.toFixed(2));
      $("#avgFemale").text((1 - results.avgMale).toFixed(2));
    }
  });
  
  // Setup aggregates display
  $("#submit-button")
    .click(function () {
      // Gather inputs
      var data = {};

      data.gender = $("input[name='gender']:checked").val();
      data.age = $("input[name='age']:checked").val();
      data.edu = $("input[name='education']:checked").val();
      data.country = $("#country-select select").val();
      data.domains = [];
          
      $("input[name='domains']:checked").each(function () {
        if ($(this).val()) {
          data.domains.push($(this).val());
        }
      });
      
      $.ajax({
        url: "/admin-aggregates",
        type: "POST",
        data: data,
        success: function (results, textStatus, jqXHR) {
          var filterMatches = results.filteredCount,
              totalDomainAverage = results.filteredDomains / results.totalCount,
              totalProfileAverage = results.filteredProfiles / results.totalCount,
              filterAverage = filterMatches / results.totalCount,
              domainAverage = results.filteredDomains / filterMatches,
              profileAverage = results.filteredProfiles / filterMatches,
              crossoverAverage = results.crossoverCount / filterMatches,
              crossoverSources = Object.keys(results.crossoverDetails);
          
          // Descriptives
          $("#filter-match").text(filterMatches);
          $("#total-domain-average").text(totalDomainAverage.toFixed(2));
          $("#total-profile-average").text(totalProfileAverage.toFixed(2));
          $("#filter-match-average").text(filterAverage.toFixed(2));
          $("#filter-domain-average").text(domainAverage.toFixed(2));
          $("#filter-profile-average").text(profileAverage.toFixed(2));
          $("#filter-crossover-average").text(crossoverAverage.toFixed(2));
          
          // Crossovers
          $("#crossover-results tbody").html("");
          for (var c in crossoverSources) {
            var currentSource = crossoverSources[c],
                currentDests = Object.keys(results.crossoverDetails[currentSource]);
                
            for (var d in currentDests) {
              var currentCount = results.crossoverDetails[currentSource][currentDests[d]];
              
              $("#crossover-results tbody").append(
                "<tr>" +
                  "<td>" + currentSource + "</td>" +
                  "<td>" + currentDests[d] + "</td>" +
                  "<td>" + currentCount + "</td>" +
                "</tr>"
              );
            }
          }
          console.log(results);
        }
      });
    });
});
