/**
 * init.js
 * 
 * Provides the necessary js imports for specific pages
 */

// Setup include
var loc = window.location.toString().split("/"),
    includes = [
      "./js/display/general-display.js"
    ];
    
loc = loc[loc.length - 1];

// Page specific inclusions
switch (loc) {
  case "survey":
    includes.push("./js/util/survey-modules.js");
    includes.push("./js/display/survey-questions.js");
    break;
  default:
    includes.push("./js/display/index-display.js");
    break;
}

// Perform necessary inclusions
include.includeInit(includes);
