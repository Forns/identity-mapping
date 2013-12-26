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
        t = d3.scale.linear().range([0, 3]),

        PLANET_RADIUS = 15,
        MOON_RADIUS = 10,
        ORBIT_STEP = 0.04,
        ORBIT_START = 2,

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

        // Helper for changing [arch]domain names to identifiers.
        domainToId = function (domain) {
            // Guarantee non-numeric first character.
            return "d-" + domain.toLowerCase().replace(/ /g, "-");
        },

        // Convert the survey object into the "systems" data structure from
        // http://bl.ocks.org/mbostock/5415941
        surveyToSystems = function (survey) {
            // Special mappings.
            var ARCHDOMAINS = [
                    "Blogs",
                    "Emails",
                    "Social Networks",
                    "Online Dating Sites",
                    "Online Forums",
                    "Digital Gaming Platforms",
                    "3D Virtual Worlds"
                    // TODO Find a way to centralize this so that *both* the visualization and the
                    //      survey are reading the same data (i.e., ideally we shouldn't have to
                    //      change multiple source files if we decide to add a new archdomain in
                    //      the future.
                ],

                PERIODICITIES = {
                    'Daily': 1,
                    'Weekly / Several times a week': 7,
                    'Monthly / Several times a month': 31,
                    'Less than once a month': 93 // i.e., around once every three months
                },

                FREQUENCY_REGEX = /^frequency/,
                FREQUENCY_INDEX_REGEX = /\d+$/,

                // The final result.
                systems = [];

            // Each archdomain in the survey translates into a "system domain."
            // Each domain translates into a "planet" within that system domain.
            // Each account within a domain translates into a "moon" of that "planet."
            // The frequency of use of a particular domain/account translates to periodicity.
            //
            // We multiple "planets" within the same archdomain on the same orbit.
            // This serves as the chosen alternative to the other options, which
            // are to either put multiple orbits in the same region (original version)
            // or to show two-level systems as satellites with satellites.
            ARCHDOMAINS.forEach(function (domainName) {
                var systemDomain = {
                        key: systems.length,
                        domainName: domainName,
                        planets: []
                    },

                    systemSource = survey[domainName];

                systems.push(systemDomain);

                // If no domains, then we're done.
                if (!systemSource) {
                    return;
                }

                // For every domain, add a planet.
                systemDomain.planets = Object.keys(systemSource).map(function (subsystemName, index) {
                    var subsystemSource = systemSource[subsystemName];
                    return {
                        key: index,
                        planetName: subsystemSource.definition || subsystemName,
                        planetRadius: PLANET_RADIUS,
                        purpose: subsystemSource.purpose,
                        moons: Object.keys(subsystemSource).filter(function (key) {
                            return key.match(FREQUENCY_REGEX);
                        }).map(function (frequencyKey, moonIndex) {
                            return {
                                id: moonIndex,
                                period: PERIODICITIES[subsystemSource[frequencyKey]],
                                moonName: subsystemName + frequencyKey.match(FREQUENCY_INDEX_REGEX),
                                moonRadius: MOON_RADIUS,
                                semimajorAxis: (moonIndex + ORBIT_START) * ORBIT_STEP,
                            };
                        })
                    };
                });
            });

            return systems;
        };

    // Grab the survey object.
    $.getJSON("/survey/" + surveyId, function (survey) {
        var systems = surveyToSystems(survey),
        $sun = $("#sun"),
        totalRadius = Math.max($sun.width(), $sun.height()) + padding * 3; // Margin for sun and some padding.

        // Compute the "distances" of each system from the "sun."
        // Must be done here because we are relying on the "sun"'s initial dimensions.
        systems.forEach(function (systemDomain) {
            // Radius is the larger of the base radius (which an empty region would get)
            // or the space needed by the planet with the most satellites.
            var regionRadius = x(ORBIT_START * ORBIT_STEP) + r(MOON_RADIUS),
                planetRadius = d3.max(systemDomain.planets, function (planet) {
                    planet.radius = d3.max(planet.moons, function (moon) {
                        return x(moon.semimajorAxis) + r(moon.moonRadius)
                    }) + padding;
                    return planet.radius;
                }) || 0;

            systemDomain.radius = Math.max(regionRadius, planetRadius);
            systemDomain.distance = totalRadius + systemDomain.radius;
            totalRadius += systemDomain.radius * 2;

            systemDomain.planets.forEach(function (planet) {
                planet.distance = systemDomain.distance + ((systemDomain.radius - planet.radius) / 2);
                planet.system = systemDomain;
                planet.moons.forEach(function (moon) {
                    moon.system = planet;
                });
            });
        });

        // We want to process our systems from the furthest to the closest to that the smallest orbits
        // are "on top."
        systems.sort(function (systemDomain1, systemDomain2) {
            return systemDomain2.distance - systemDomain1.distance;
        });

        // Resize our solar system according to the total calculated radius.
        $("#main-content")
            .width(totalRadius * 2)
            .height(totalRadius * 2)
            .css({ marginTop: (-totalRadius / 2) + "px" });

        // Adjust the sun at the center.  Nebula animation will also be centered on this.
        $sun.css({
            left: totalRadius - ($sun.width() / 2) + "px",
            top: totalRadius - ($sun.height() / 2) + "px"
        });
        $(".nebula-holder, .nebula").css(prefix + "transform-origin", totalRadius + "px " + totalRadius + "px");

        // TODO Lots and lots and lots of consolidation can be done here.
        var systemDomain = d3.select("#main-content").selectAll(".system-domain")
            .data(systems)
            .enter().append("div")
            .attr('class', "system-domain")
            .style('width', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style('height', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style('left', function (d) { return totalRadius - d.distance - d.radius + "px"; })
            .style('top', function (d) { return totalRadius - d.distance - d.radius + "px"; });

        systemDomain.append("div")
            .attr('class', function (d) { return "label " + domainToId(d.domainName); })
            .text(function (d) { return d.domainName; })
            .style('top', function (d) { return d.radius + 24 + "px"; });

        systemDomain = systemDomain.append("div")
            .attr('class', "region")
            .style('width', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style('height', function (d) { return (d.distance + d.radius) * 2 + "px"; })
            .style(prefix + "border-radius", function (d) { return d.distance + d.radius + "px"; })
            .style(prefix + "animation-duration", function (d) { return t(d.distance / 4) + "s"; })
            .style(prefix + "transform-origin", function (d) { return (d.distance + d.radius) + "px " + (d.distance + d.radius) + "px"; });

        systemDomain.append("svg")
            .attr('class', function (d) { return "system-orbit " + domainToId(d.domainName); })
            .attr('width', function (d) { return d.distance * 2; })
            .attr('height', function (d) { return d.distance * 2; })
            .style('left', function (d) { return d.radius + "px"; })
            .style('top', function (d) { return d.radius + "px"; })
            .style(prefix + "border-radius", function (d) { return d.distance + "px"; })
            .append("circle")
            .attr('cx', function (d) { return d.distance; })
            .attr('cy', function (d) { return d.distance; })
            .attr('r', function (d) { return d.distance; });

        var system = systemDomain.selectAll(".system")
            .data(function (d) { return d.planets; })
            .enter().append("div")
            .attr('class', "system")
            .attr('title', function (d) { return d.purpose || "(purpose not stated)"; })
            .style('width', function (d) { return d.radius * 2 + "px"; })
            .style('height', function (d) { return d.radius * 2 + "px"; })
            .style('left', function (d) { return d.distance * 2 + "px"; })
            .style('top', function (d) { return d.distance + ((d.system.radius - d.radius) / 2) + "px"; })
            .style(prefix + 'transform', function (d, index) {
                // When a system has multiple planets, we offset each planet evenly along the orbit.
                // The offset involves translating to the center, rotating, translating back, then
                // rotating again (so that the labels stay vertically oriented).
                var distanceOffset = d.distance - ((d.system.radius - d.radius) / 2),
                    degreeOffset = index * 360 / d.system.planets.length;

                return "translate(-" + distanceOffset + "px,0px) rotate(" + degreeOffset + "deg) " +
                    "translate(" + distanceOffset + "px,0px) rotate(-" + degreeOffset + "deg)";
            });

        system.append("div")
            .attr('class', "perspective-adjust")
            .style(prefix + "transform-origin", function (d) { return d.radius + "px " + d.radius + "px"; })
            .style(prefix + "animation-duration", function (d) { return t(d.distance / 4) + "s"; })
            .append("svg")
            .attr('class', "planet")
            .attr('width', function (d) { return d.radius * 2; })
            .attr('height', function (d) { return d.radius * 2; })
            .append("circle")
            .attr('transform', function (d) { return "translate(" + d.radius + "," + d.radius + ") scale(1.0,2.0)"; })
            .attr('r', function (d) { return r(d.planetRadius); })
            .style('fill', function (d) { return "url(#" + domainToId(d.system.domainName) + "-gradient)"; });

        system.append("div")
            .attr('class', "label")
            .style('width', function (d) { return (d.radius * 2 - 10) + "px"; })
            .style('top', function (d) { return d.radius + 10 + "px"; })
            .style(prefix + "animation-duration", function (d) { return t(d.distance / 4) + "s"; })
            .append("span")
            .text(function (d) { return d.planetName; });

        system.append("svg")
            .attr('class', "orbit")
            .attr('width', function (d) { return d.radius * 2; })
            .attr('height', function (d) { return d.radius * 2; })
            .append("g")
            .attr('transform', function (d) { return "translate(" + d.radius + "," + d.radius + ")"; })
            .selectAll("circle")
            .data(function (d) { return d.moons; })
            .enter().append("circle")
            .attr('r', function (d) { return x(d.semimajorAxis); });

        system.selectAll(".moon")
            .data(function (d) { return d.moons; })
            .enter().append("svg")
            .attr('class', "moon")
            .attr('width', function (d) { return d.system.radius * 2; })
            .attr('height', function (d) { return d.system.radius * 2; })
            .style(prefix + "animation-duration", function (d) {
                // "Perturb" periodicity by up to 2 days; this adds some variation while
                // retaining differences in frequencies.
                d.adjustedPeriod = t(d.period + Math.random(2));
                return d.adjustedPeriod + "s";
            })
            .style(prefix + "transform-origin", function (d) { return d.system.radius + "px " + d.system.radius + "px"; })
            .append("g")
            .attr('class', "orbiter")
            .attr('transform', function (d) { return "translate(" + (d.system.radius + x(d.semimajorAxis)) + "," + d.system.radius + ")"; })
            .append("g")
            .attr('class', "perspective-adjust")
            .style(prefix + "animation-duration", function (d) {
                // Such algebra.  Two rotational velocities, traveling the same distance (360 degrees).
                // Only the periodicities are known (t1, t2).  What is the periodicity when the velocity
                // is the *sum* of the two velocities?  This:
                var t1 = d.adjustedPeriod,
                    t2 = t(d.system.distance / 4);
                return (t1 * t2 / (t1 + t2)) + "s";
            })
            .append("circle")
            .style(prefix + "transform", function (d) { return "scale(1.0,2.0)"; })
            .attr('r', function (d) { return r(d.moonRadius); });
    });
});
