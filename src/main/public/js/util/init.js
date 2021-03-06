/**
 * init.js
 * 
 * Provides the necessary js imports for specific pages
 */

// Setup include
var loc = window.location.pathname.split("/")[1],
    includes = [];

// Page specific inclusions
switch (loc) {
  case "survey":
    includes.push("/js/display/module-list.js");
    includes.push("/js/lib/jquery.qtip.min.js");
    includes.push("/js/lib/jquery.validate.min.js");
    includes.push("/js/util/validation-config.js");
    includes.push("/js/util/survey-modules.js");
    includes.push("/js/display/survey-questions.js");
    break;
  case "about":
    includes.push("/js/display/module-list.js");
    includes.push("/js/util/survey-modules.js");
    includes.push("/js/display/about-display.js");
    break;
  case "identitymap":
    includes.push("/js/lib/d3.v3.min.js");
    includes.push("/js/display/identitymap-display.js");
    break;
  case "topicmodels":
    includes.push("/js/util/survey-modules.js");
    includes.push("/js/lib/jquery.tagcanvas.min.js");
    includes.push("/js/display/topic-models-display.js");
    break;
  default:
    includes.push("/js/display/index-display.js");
    break;
}

if ([ "survey", "topicmodels", "identitymap" ].indexOf(loc) === -1) {
  includes.push("/js/display/general-display.js");
}

// Perform necessary inclusions
include.includeInit(includes);
