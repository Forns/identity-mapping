/**
 * identitymap-display.js
 *
 * Javascript display stylings for the identitymap page
 */
$(function () {
    // Grab the ID from the URL.
    var surveyId = window.location.href.split("/").pop();

    // Grab the survey object.
    $.getJSON("/survey/" + surveyId, function (survey) {
        console.log(survey);
    });
});
