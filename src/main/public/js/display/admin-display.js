/**
 * admin-display.js
 */

$(function () {
  $.ajax({
    url: "/survey-snapshot",
    type: "GET",
    success: function (results, textStatus, jqXHR) {
      $("#count").text(results.count);
      $("#avgAge").text(results.avgAge.toFixed(2));
      $("#avgMale").text(results.avgMale.toFixed(2));
      $("#avgFemale").text((1 - results.avgMale).toFixed(2));
    }
  });
});
