/**
 * admin-display.js
 */

$(function () {
  var totalSurveys,
  
      displayCrossovers = function (details, crossoverSources, table) {
        table.html("");
        for (var c in crossoverSources) {
          var currentSource = crossoverSources[c],
              currentDests = Object.keys(details[currentSource]);
          
          for (var d in currentDests) {
            var currentCount = details[currentSource][currentDests[d]];
            if (currentSource === "undefined" || currentDests[d] === "undefined") {
              continue;
            }
            
            table.append(
              "<tr>" +
                "<td>" + currentSource + "</td>" +
                "<td>" + currentDests[d] + "</td>" +
                "<td>" + currentCount + "</td>" +
              "</tr>"
            );
          }
        }
      };
  
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
          
          console.log(results);
          
          var filterMatches = results.filteredCount,
              totalDomainAverage = results.filteredDomains / results.totalCount,
              totalProfileAverage = results.filteredProfiles / results.totalCount,
              filterAverage = filterMatches / results.totalCount,
              domainAverage = results.filteredDomains / filterMatches,
              profileAverage = results.filteredProfiles / filterMatches,
              crossoverAverage = results.crossoverCount / filterMatches,
              crossoverSources = Object.keys(results.crossoverDetails),
              archCrossovers = Object.keys(results.archCrossoverDetails),
              countries = results.countryInfo,
              countriesSorted = Object.keys(countries).sort(),
              countriesTable = $("#country-results tbody");
          
          // Descriptives
          $("#filter-match").text(filterMatches);
          $("#total-domain-average").text(totalDomainAverage.toFixed(2));
          $("#total-profile-average").text(totalProfileAverage.toFixed(2));
          $("#filter-match-average").text(filterAverage.toFixed(2));
          $("#filter-domain-average").text(domainAverage.toFixed(2));
          $("#filter-profile-average").text(profileAverage.toFixed(2));
          $("#filter-crossover-average").text(crossoverAverage.toFixed(2));
          
          // Clear countries table, then report new results
          countriesTable.html("");
          for (var c in countriesSorted) {
            var currentName = countriesSorted[c];
            countriesTable.append(
              "<tr>" +
                "<td>" + currentName + "</td>" +
                "<td>" + countries[currentName] + "</td>" +
                "<td>" + (countries[currentName] / filterMatches).toFixed(2) + "</td>" +
              "</tr>"
            );
          }
          
          // Crossovers
          displayCrossovers(results.crossoverDetails, crossoverSources, $("#crossover-results tbody"));
          displayCrossovers(results.archCrossoverDetails, archCrossovers, $("#arch-crossover-results tbody"));
        }
      });
    });
});
