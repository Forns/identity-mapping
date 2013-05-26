/**
 * general-display.js
 * 
 * JS-mediated display options for general page visuals
 */

$(function () {
  
  /*
   * FACE GRID BACKGROUND DISPLAY
   */
  // First, we'll set up our constants
  
  var faceList = [
        "adam1",
        "facebook",
        "brett1",
        "freddy1",
        "brett2",
        "googlePlus",
        "andrew1",
        "adam2",
        "bailey1",
        "greg1",
        "katie2",
        "freddy2",
        "twitter",
        "joe1",
        "rob1",
        "andrew2",
        "secondLife",
        "jessica1",
        "katie1",
        "kelly2"
      ],
      faceCount = faceList.length,
      faceRepeat = 4,
      faceContainer = $("<div id='face-grid' class='face-margins-even'></div>"),
      // The ideal, css set margins for the case grid;
      // They are defined here soas to be invariant to later adjustment
      faceContainerMarginLeft = -80,
      faceContainerMarginRight = -80,
      faceLoad = faceCount * faceRepeat,
      faceInterval,
      faceImage,
      i, j;
  
  // Add the pictures: CSS is set up so that they wrap into
  // rows automagically.  For sufficient fill-age, we add them
  // a few times over.
  for (j = 0; j < faceRepeat; j += 1) {
    for (i = 0, max = faceCount; i < max; i += 1) {
      faceImage = $("<img/>")
        .addClass("img-polaroid face-img")
        .attr({
          src: "../../assets/grid-images/" + faceList[i] + ".png"
        });

      // This crazy thing is there so that the grid does not
      // appear until everything is loaded.  The property check
      // for complete is needed in Firefox, which does not fire
      // the load event if the image is already in the browser cache.
      if (faceImage.prop("complete")) {
	  faceLoad -= 1;
      } else {
          faceImage.load(function () { faceLoad -= 1; });
      }
      faceContainer.append(faceImage);
    }
  }
  
  // Fix for the face tiles in the event that the window is too small
  // to accommodate an even number of tiles; we adjust the faceContainer
  // on the sides (margins left and right) in order to facilitate a cleaner
  // look for the main buttons
  $(window).resize(function () {
    // Width of each tile in pixels plus border
    var faceWidth = 180 + 2 * parseInt($(".face-img").css("margin")),
        effectiveWindow = $(window).width() - faceContainerMarginLeft - faceContainerMarginRight;
    
    // If we can fit an even number of tiles into the grid, then we'll do so
    if (Math.floor(effectiveWindow / faceWidth) % 2 === 0) {
      faceContainer
        .removeClass("face-margins-odd")
        .addClass("face-margins-even");
    
    // Otherwise, there's only enough room for an odd quantity, so we'll modify
    // the face container margins
    } else {
      faceContainer
        .removeClass("face-margins-even")
        .addClass("face-margins-odd");
    }
  });

  // Once all images have loaded, add the face-grid background
  // container.  We go to these lengths because, on some browsers,
  // the layout is done before the images are all loaded, resulting
  // in some jarring rearrangement as images appear.
  faceInterval = setInterval(function () {
    if (!faceLoad) {
      $("#container").prepend(faceContainer);
      $(window).trigger("resize");
      clearInterval(faceInterval);
    }
  });
});