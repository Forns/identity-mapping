/**
 * admin-display.js
 */

$(function () {
  var totalSurveys;
  
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
      data.domains = [];
          
      $("input[name='domains']:checked").each(function () {
        data.domains.push($(this).val());
      });
      
      console.log(data);
      
      $.ajax({
        url: "/admin-aggregates",
        type: "POST",
        data: data,
        success: function (results, textStatus, jqXHR) {
          console.log(results);
        }
      });
    });
});
