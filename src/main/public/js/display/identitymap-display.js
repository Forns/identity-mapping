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
        // Just for starters: insanely basic d3 implementation.
        var d3div = d3.select("#main-content").selectAll("div")
            .data(Object.keys(survey));

        d3div.enter().append("div");
        d3div
            .text(function (d) { return d; })
            .style("font-size", function (d) {
                return (($.type(survey[d]) === 'string' ? survey[d] :
                    Object.keys(survey[d])).length * 10) + "px";
            })
            .style("color", function (d) {
                return $.type(survey[d]) === 'string' ? "green" : "red";
            });
    });
});
