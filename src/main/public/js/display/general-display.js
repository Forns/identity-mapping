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
        "adam2",
        "bailey1",
        "bailey2",
        "brett1",
        "brett2",
        "freddy1",
        "freddy2",
        "greg1",
        "greg2",
        "jessica1",
        "jessica2",
        "joe1",
        "joe2",
        "katie1",
        "katie2",
        "kelly1",
        "kelly2",
        "rob1",
        "rob2"
      ],
      faceCount = faceList.length,
      rowSize = 5,
      faceRows = parseInt(faceCount / rowSize),
      faceContainer,
      currentRow;
      
  
  // Add the face-grid background container
  $("#container")
    .prepend(
      "<div id='face-grid'>" +
      "</div>"
    );
  faceContainer = $("#face-grid");
  
  // Now we'll add the number of rows
  for (var i = 0; i < faceRows; i++) {
    faceContainer.append("<div id='face-row-" + i + "' class='row'></div>");
  }
  
  // Finally, we'll seed each row with pictures
  for (var j = 0; j < faceCount; j++) {
    currentRow = parseInt(j / rowSize);
    $("#face-row-" + currentRow)
      .append("<div class='span2 face-img'><img src='../../assets/grid-images/adjusted-images/" + faceList[j] + ".png' style='opacity: " + (1 - ((currentRow * 25) / 100)) + ";' /></div>");
  }
    
});