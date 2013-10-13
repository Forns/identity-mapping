/**
 * identitymap-display.js
 *
 * Javascript display stylings for the identitymap page
 */
$(function () {
    // Quick-and-dirty adaptation of http://bl.ocks.org/mbostock/5415941 for proof of concept.

    // Grab the ID from the URL.
    var surveyId = window.location.href.split("/").pop(),

        // Scales for semimajor axis, planet radius, and planet period.
        x = d3.scale.linear().range([0, 400]),
        r = d3.scale.linear().domain([4, 40]).range([4 * .5, 40 * .5]).clamp(true),
        t = d3.scale.linear().range([0, 1]),

        PLANET_RADIUS = 15,
        padding = 16,

        // Detect the appropriate vendor prefix.
        prefix = "-webkit-transform" in document.body.style ? "-webkit-"
            : "-moz-transform" in document.body.style ? "-moz-"
            : "",

        type = function (d) {
            d.period = +d.period;
            d.planet_radius = +d.planet_radius;
            d.semimajor_axis = +d.semimajor_axis;
            d.stellar_radius = +d.stellar_radius;
            return d;
        },

        // Convert the survey object into the "systems" data structure from
        // http://bl.ocks.org/mbostock/5415941
        surveyToSystems = function (survey) {
            // Special mappings.
            var ONE_LEVEL_SYSTEMS = [ "Blogs", "Emails" ],

                TWO_LEVEL_SYSTEMS = [
                    "Online Forums",
                    "Social Networks",
                    "Digital Gaming Platforms",
                    "3D Virtual Worlds",
                    "Online Dating Sites"
                    // TODO Fill this out based on survey modules; heck, maybe even centralize this
                    //      so that *both* the visualization and the survey are reading the same
                    //      data.
                ],

                PERIODICITIES = {
                    'Daily': 1,
                    'Weekly / Several times a week': 7,
                    'Monthly / Several times a month': 31,
                    'Less than once a month': 93 // i.e., around once every three months
                },

                MOON_RADIUS = 10,
                ORBIT_STEP = 0.035,

                FREQUENCY_REGEX = /^frequency/,
                FREQUENCY_INDEX_REGEX = /\d+$/,

                // The final result.
                systems = [];

            // Each archdomain in the survey translates into a "system."
            // Each domain translates into a satellite around that system.
            // Each account within a domain translates into a subsatellite of that satellite.
            // The frequency of use of a particular domain/account translates to periodicity.
            // The number of domains naturally "enlarges" a system because it increases
            // the number of satellites therein.
            ONE_LEVEL_SYSTEMS.forEach(function (systemName) {
                var systemSource = survey[systemName];
                if (!systemSource) {
                    return;
                }

                // If that archdomain is present, then we go down another level.
                systemSource = systemSource[systemName];
                systems.push({
                    key: systems.length,
                    planet_name: systemName,
                    purpose: systemSource.purpose,
                    values: Object.keys(systemSource).filter(function (key) {
                        return key.match(FREQUENCY_REGEX);
                    }).map(function (frequencyKey, index) {
                        return {
                            id: systems.length,
                            period: PERIODICITIES[systemSource[frequencyKey]],
                            planet_name: systemName + frequencyKey.match(FREQUENCY_INDEX_REGEX),
                            planet_radius: MOON_RADIUS,
                            semimajor_axis: (index + 1) * ORBIT_STEP,
                        };
                    })
                });
            });

            // TODO Two-level systems should show satellites with satellites.  However, the
            //      visualization code does not handle this yet, so for now we "flatten" the
            //      two layers of satellites.
            TWO_LEVEL_SYSTEMS.forEach(function (systemName) {
                var systemSource = survey[systemName];
                if (!systemSource) {
                    return;
                }

                Object.keys(systemSource).forEach(function (subsystemName) {
                    // TODO This is a near-identical copy of the code above.  Yes, we need to fix this.
                    var subsystemSource = systemSource[subsystemName];

                    systems.push({
                        key: systems.length,
                        planet_name: systemName + ": " + (subsystemSource.definition || subsystemName), // TODO Temp while flat.
                        purpose: subsystemSource.purpose,
                        values: Object.keys(subsystemSource).filter(function (key) {
                            return key.match(FREQUENCY_REGEX);
                        }).map(function (frequencyKey, index) {
                            return {
                                id: systems.length,
                                period: PERIODICITIES[subsystemSource[frequencyKey]],
                                planet_name: subsystemName + frequencyKey.match(FREQUENCY_INDEX_REGEX),
                                planet_radius: MOON_RADIUS,
                                semimajor_axis: (index + 1) * ORBIT_STEP,
                            };
                        })
                    });
                });
            });

            return systems;
        };

    // Grab the survey object.
    $.getJSON("/survey/" + surveyId, function (survey) {
        var systems = surveyToSystems(survey),
            totalRadius = 0;

        console.log(systems);

        // Compute the "distances" of each system from the "sun."
        systems.forEach(function (s) {
            s.values.forEach(function (p) { p.system = s; });
            s.radius = d3.max(s.values, function (p) { return x(p.semimajor_axis) + r(p.planet_radius); }) + padding;
            s.distance = totalRadius + s.radius;
            totalRadius += s.radius * 2;
        });

        // We want to process our systems from the furthest to the closest to that the smallest orbits
        // are "on top."
        systems.sort(function (system1, system2) {
            return system2.distance - system1.distance;
        });

        // Resize our solar system according to the total calculated radius.
        $("#main-content")
            .width(totalRadius * 2)
            .height(totalRadius * 2);

        // Adjust the sun at the center.
        var $sun = $("#sun");
        $sun.css({
            left: totalRadius - ($sun.width() / 2) + "px",
            top: totalRadius - ($sun.height() / 2) + "px"
        });

        // TODO Lots and lots and lots of consolidation can be done here.
        var systemDomain = d3.select("#main-content").selectAll(".system-domain")
            .data(systems)
            .enter().append("div")
            .attr('class', "system-domain")
            .attr('title', function (d) { return d.purpose || "(purpose not stated)"; })
            .style('width', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style('height', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style('left', function (d) { return totalRadius - d.distance - d.radius + "px"; })
            .style('top', function (d) { return totalRadius - d.distance - d.radius + "px"; })
            .style(prefix + "border-radius", function (d) { return d.distance + d.radius + "px"; })
            .style(prefix + "animation-duration", function (d) { return t(d.distance / 20) + "s"; })
            .style(prefix + "transform-origin", function (d) { return (d.distance + d.radius) + "px " + (d.distance + d.radius) + "px"; });

        systemDomain.append("svg")
            .attr('class', "system-orbit")
            .attr('width', function (d) { return d.distance * 2; })
            .attr('height', function (d) { return d.distance * 2; })
            .style('left', function (d) { return d.radius + "px"; })
            .style('top', function (d) { return d.radius + "px"; })
            .style(prefix + "border-radius", function (d) { return d.distance + "px"; })
            .append("circle")
            .attr('cx', function (d) { return d.distance; })
            .attr('cy', function (d) { return d.distance; })
            .attr('r', function (d) { return d.distance; });

        var system = systemDomain.append("div")
            .attr('class', "system")
            .style('width', function (d) { return d.radius * 2 + "px"; })
            .style('height', function (d) { return d.radius * 2 + "px"; })
            .style('left', function (d) { return d.distance + d.distance + "px"; })
            .style('top', function (d) { return d.distance + "px"; });

        system.append("svg")
            .attr('class', "planet")
            .attr('width', function (d) { return d.radius * 2; })
            .attr('height', function (d) { return d.radius * 2; })
            .append("circle")
            .attr("transform", function (d) { return "translate(" + d.radius + "," + d.radius + ")"; })
            .attr("r", function (d) { return r(PLANET_RADIUS); });

        system.append("div")
            .attr('class', "label")
            .style('width', function (d) { return (d.radius * 2 - 10) + "px"; })
            .style('top', function (d) { return d.radius + "px"; })
            .text(function (d) { return d.planet_name; });

        system.append("svg")
            .attr('class', "orbit")
            .attr('width', function (d) { return d.radius * 2; })
            .attr('height', function (d) { return d.radius * 2; })
            .append("g")
            .attr("transform", function (d) { return "translate(" + d.radius + "," + d.radius + ")"; })
            .selectAll("circle")
            .data(function (d) { return d.values; })
            .enter().append("circle")
            .attr("r", function (d) { return x(d.semimajor_axis); });

        system.selectAll(".moon")
            .data(function (d) { return d.values; })
            .enter().append("svg")
            .attr("class", "moon")
            .attr("width", function (d) { return d.system.radius * 2; })
            .attr("height", function (d) { return d.system.radius * 2; })
            .style(prefix + "animation-duration", function (d) { return t(d.period) + "s"; })
            .style(prefix + "transform-origin", function (d) { return d.system.radius + "px " + d.system.radius + "px"; })
            .append("circle")
            .attr("transform", function (d) { return "translate(" + d.system.radius + "," + d.system.radius + ")"; })
            .attr("cx", function (d) { return x(d.semimajor_axis); })
            .attr("r", function (d) { return r(d.planet_radius); });
    });
});
