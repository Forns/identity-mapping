/**
 * identitymap-display.js
 *
 * Javascript display stylings for the identitymap page
 */
$(function () {
    // Quick-and-dirty adaptation of http://bl.ocks.org/mbostock/5415941 for proof of concept.

    var modalPopup = function (container, id, title, body, buttons, options, display) {
          container = $(container);
          $("#" + id).remove();
          container
            .append(
              "<div id='" + id + "' data-backdrop='static' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='model-title' aria-hidden='true'>" +
                "<div class='modal-dialog'>" +
                  "<div class='modal-content'>" +
                    "<div class='modal-header'>" +
                      "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                      "<h4 class='modal-title'><span class='glyphicon glyphicon-chevron-right'></span>&nbsp" + title + "</h4>" +
                    "</div>" +
                    "<div class='modal-body text-left'>" +
                      body +
                    "</div>" +
                    "<div class='modal-footer'>" +
                      buttons +
                    "</div>" +
                  "</div>" +
                "</div>" +
              "</div>"
            );
            
          return $("#" + id).modal(options);
        },
    
        // Grab the ID from the URL.
        surveyId = window.location.href.split("/").pop(),

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
            return "d-" + domain.toLowerCase().replace(/[ \/]/g, "-");
        },

        // Convert the survey object into the "systems" data structure from
        // http://bl.ocks.org/mbostock/5415941
        surveyToSystems = function (survey) {
            // Special mappings.
            var ARCHDOMAINS = [
                    "Emails",
                    "Blogs / Personal Websites",
                    "Social Networks",
                    "Online Dating Sites",
                    "Online Forums",
                    "Digital Games",
                    "3D Virtual Worlds"
                    // TODO Find a way to centralize this so that *both* the visualization and the
                    //      survey are reading the same data (i.e., ideally we shouldn't have to
                    //      change multiple source files if we decide to add a new archdomain in
                    //      the future.
                ],

                OLD_ARCHDOMAINS = {
                    'Blogs / Personal Websites': "Blogs",
                    'Digital Games': "Digital Gaming Platforms"
                },

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

                // Check for backward-compatibility archdomains.
                if (!systemSource && OLD_ARCHDOMAINS[domainName]) {
                    systemSource = survey[OLD_ARCHDOMAINS[domainName]];
                }

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

    // Set up the legend popover.
    $(".periphery-button").tooltip();
    $(".legend-button").popover({
        html: true,
        placement: 'bottom',
        content: function () {
            return $(".legend-template").clone().removeClass("hidden");
        },
        container: "#periphery-buttons"
    });

    // Grab the survey object.
    $.getJSON("/survey/" + surveyId, function (survey) {
        var systems = surveyToSystems(survey),
            $main = $("#main-content"),
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
        $main.width(totalRadius * 2)
            .height(totalRadius * 2)
            .css({ marginTop: (-totalRadius / 2) + "px" });

        // Set up our "nebula" backgrounds.
        $(".nebula-holder, .nebula").css(prefix + "transform-origin", totalRadius + "px " + totalRadius + "px");

        // Temporarily take the "sun" out as we build the visualization.
        $sun.remove();

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
            .text(function (d) { return d.domainName === "Blogs / Personal Websites" ? "Blogs/Websites" : d.domainName; })
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
            .attr('class', function (d) { return domainToId(d.planetName); })
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

        var purpose = system.append("div")
            .attr('class', "label purpose obscured")
            .style('width', function (d) { return (d.radius * 6) + "px"; })
            .style('top', function (d) { return d.radius + 10 + "px"; })
            .style(prefix + "animation-duration", function (d) { return t(d.distance / 4) + "s"; })
            .append("span")
            .text(function (d) { return d.planetName.toUpperCase() + ": " + (d.purpose || "(purpose not stated)"); });

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

        // Put the sun back and set it up.
        // Adjust the sun at the center.  Nebula animation will also be centered on this.
        $main.append($sun);
        $sun.removeClass("hidden").css({
            left: totalRadius - ($sun.width() / 2) + "px",
            top: totalRadius - ($sun.height() / 2) + "px"
        });

        // Use a popover to display demographics.
        var demographics = survey['Demo'];
        $sun.popover({
            html: true,
            content: function () {
                return $("<table></table>").addClass("table table-condensed table-demographics")
                    .append($("<tbody></tbody>")
                        .append($("<tr></tr>")
                            .append($("<th></th>").text("Birth Year"))
                            .append($("<td></td>").text(demographics['birth-year']))
                        )
                        .append($("<tr></tr>")
                            .append($("<th></th>").text("Sex"))
                            .append($("<td></td>").text(demographics['sex']))
                        )
                        .append($("<tr></tr>")
                            .append($("<th></th>").text("Country"))
                            .append($("<td></td>").text(demographics['country']))
                        )
                        .append($("<tr></tr>")
                            .append($("<th></th>").text("Education"))
                            .append($("<td></td>").text(demographics['education']))
                        )
                    );
            },
            placement: 'bottom',
            trigger: 'manual',
            container: 'body'
        });

        $(".details-button").click(function (event) {
            $(".system .purpose").toggleClass("obscured");
            $sun.popover('toggle').toggleClass("shine");
        });

        // Crossover action!  First some data massaging.
        var crossovers = [],
            crossoverDomainToId = function (domain) {
                return domainToId(domain === "Blogs / Personal Websites" ? "blogs" : domain);
            };

        Object.keys(survey.Crossover || { } /* In the event of no Crossover. */).forEach(function (source) {
            survey.Crossover[source].forEach(function (destination) {
                crossovers.push({
                    source: crossoverDomainToId(source),
                    destination: crossoverDomainToId(destination)
                });
            });
        });

        var crossoverHolder = d3.select("svg.crossover-holder")
            .attr('width', totalRadius * 2)
            .attr('height', totalRadius * 2)
            .style('width', totalRadius * 2 + "px")
            .style('height', totalRadius * 2 + "px")
            .style('left', 0)
            .style('top', totalRadius / 2 + "px"),

            getPlanet = function (domainName) {
                return $(".planet circle." + domainName);
            },

            getCrossover = function (d, i) {
                return "url(#crossover-marker-" + i + ")";
            },

            getGradientUrl = function (domain) {
                // Unfortunately, browser incompatibility with gradients forces this.
                var needsUrl = navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/) && !navigator.userAgent.match(/Firefox/);
                return (needsUrl ? "url(" : "") + getPlanet(domain.source).css('fill') + (needsUrl ? ")" : "");
            },

            getGradientColor = function (domain) {
                var url = getGradientUrl(domain);
                return $(url.substr(4, url.length - 5)).find("stop:first-child").attr('stop-color');
            };

        d3.select("svg.crossover-holder > defs").selectAll("marker")
            .data(crossovers)
            .enter().append("marker")
            .attr('id', function (d, i) { return "crossover-marker-" + i; })
            .attr('viewBox', "0 0 10 10")
            .attr('refX', 16)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', "auto")
            .append("path")
            .attr('d', "M 0 0 L 10 5 L 0 10 z")
            .style('fill', getGradientColor)
            .style('stroke', getGradientColor);

        crossoverHolder.selectAll("path.crossover-mark")
            .data(crossovers)
            .enter().append("path")
            .attr('class', "crossover-mark")
            .attr('stroke', getGradientUrl)
            .attr('marker-mid', getCrossover)
            .attr('marker-end', getCrossover);

        // iPhone/iPad/iPod compatibility check---kill animation (and skip animating crossovers).
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            $(".nebula-holder").remove();
        }

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license 
        (function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                    || window[vendors[x]+'CancelRequestAnimationFrame'];
            }
 
            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                                               timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
 
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
        }());
// End polyfill

        // Helper function for crossover computation: "bow" as in "drawing a bow-and-arrow."
        var bow = function (source, count, divisor) {
            var destination = source.next,
                vectorX = destination.x - source.x,
                vectorY = destination.y - source.y,
                midpointX = (source.x + destination.x) / 2,
                midpointY = (source.y + destination.y) / 2,
                normalX = -vectorY,
                normalY = vectorX,
                midpoint = {
                    x: midpointX + (normalX / divisor),
                    y: midpointY + (normalY / divisor),
                    next: destination
                };

            source.next = midpoint;
            if (count > 1) {
                bow(source, count - 1, divisor * 2);
                bow(midpoint, count - 1, divisor * 2);
            }
        };

        // We can't use just animation CSS with crossovers because they involve
        // multiple elements and multiple transforms.
        var lastFrame = null;
        var frame = (function (timestamp) {
            // Do some governing.
            if (isNaN(lastFrame)) {
                lastFrame = timestamp;
            } else {
                if (timestamp - lastFrame < 50) {
                    window.requestAnimationFrame(frame);
                    return;
                } else {
                    lastFrame = timestamp;
                }
            }

            $("svg.crossover-holder path.crossover-mark").each(function (index, path) {
                var $path = $(path),
                    crossover = $path.prop('__data__'),
                    $sourceCircle = getPlanet(crossover.source),
                    $destinationCircle = getPlanet(crossover.destination),
                    sourceOffset = $sourceCircle.offset(),
                    destinationOffset = $destinationCircle.offset(),
                    sourceRadius = +$sourceCircle.attr('r'),
                    destinationRadius = +$destinationCircle.attr('r'),

                    destination = {
                        x: destinationOffset.left + destinationRadius,
                        y: destinationOffset.top + destinationRadius
                    },

                    source = {
                        x: sourceOffset.left + sourceRadius,
                        y: sourceOffset.top + sourceRadius,
                        next: destination
                    };

                bow(source, 3, 8);
                var current = source,
                    d = "M";

                while (current) {
                    d += current.x + "," + current.y;
                    if (current.next) {
                        current = current.next;
                        d += " Q" + current.x + "," + current.y + " ";
                    }
                    current = current.next;
                }

                $path.attr({ d: d });
            });

            window.requestAnimationFrame(frame);
        });

        frame();
    });

    // Configure share button
    $("#share-button")
      .click(function () {
        $("#main-content")
          .fadeOut(200);
          
        modalPopup(
          "body",
          "share-popup",
          "Share Identity Map",
          "<div class='form-horizontal'>" +
          "<p>Want to share your Identity Map with friends or save your results for yourself?</p>" +
          "<p>Send a link to this page by email to anyone you'd like! Just enter the addresses in the box below, separated by space, line, or comma!</p>" +
          "<div class='control-group'>" +
            "<label class='control-label' for='email-textarea'>Recipient(s)</label>" +
            "<div class='controls'>" +
              "<textarea id='email-textarea'></textarea>" +
            "</div>" +
          "</div>" +
          "<p>Want to let the people you're sharing with know who sent them the link? Enter your name below! (we won't collect this or keep it in any capacity and you can leave it blank if you wish)</p>" +
          "<div class='control-group'>" +
            "<label class='control-label' for='sharer'>Name</label>" +
            "<div class='controls'>" +
              "<input type='text' id='sharer' maxlength='30'/>" +
            "</div>" +
          "</div>",
          "<button type='button' class='btn btn-default' data-dismiss='modal' aria-hidden='true'>Cancel</button>" +
          "<button id='share-execute' type='button' class='btn btn-primary' aria-hidden='true'>" +
            "<i class='icon-envelope icon-white'></i> " +
            "Share!</button>"
        );
        
        // HACK to prevent overlapping SVG elements on buttons
        $("#share-popup")
          .on("hidden", function () {
            $("#main-content")
              .fadeIn(500);
          });
        
        // Once the modal is up, we need to configure the
        // email sharing
        $("#share-execute")
          .click(function () {
            $(this)
              .attr("disabled", "disabled")
              .html("Sharing...");
            
            var emails = $("#email-textarea").val().split(/[\s,]+/),
                sharer = $("#sharer").val();
                
            $.ajax({
              type: "POST",
              url: "/share",
              data: {
                emails: emails,
                surveyId: surveyId,
                sharer: sharer
              },
              success: function (data, textStatus, jqXHR) {
                var badEmails = (Object.keys(data.badEmails).length) ? data.badEmails : false;
                
                // Alert the user of the successful sharing
                $("#share-popup .modal-body")
                  .html(
                    "<h4>Sharing successful!</h4>" +
                    "<p>We've sent an email with a link to your Identity Map to the emails you've requested.</p>" +
                    ((badEmails) ? "<p><strong>NOTE:</strong> we couldn't find several of the emails you entered; please verify that they are correct and try sharing again!</p>" +
                                   "<ul>" +
                                   (function () {
                                     var results = "";
                                     for (var e in badEmails) {
                                       results += "<li>" + badEmails[e] + "</li>";
                                     }
                                     return results;
                                   })() +
                                   "</ul><br/>"
                                 : "") +
                    "<p>Thanks for participating in the Identity Mapping Project!</p>"
                  );
                $("#share-popup .modal-footer")
                  .html(
                    "<button type='button' class='btn btn-primary' data-dismiss='modal' aria-hidden='true'>Done!</button>"
                  );
              },
              error: function (jqXHR, textStatus, errorThrown) {
                alert("[ERROR] We got an unexpected response from the server.\n" +
                        "Please contact the IMP investigators.");
                $("#share-popup").modal("hide");
              }
            });
          });
      });
});
