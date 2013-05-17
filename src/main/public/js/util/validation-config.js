/**
 * validation-config.js
 * 
 * Utility that takes the given jQuery selection and adds an
 * "onblur" handler to the input elements such that they will
 * be validated with the given test and options.
 */

var validationConfig = function (formId, submitCallback) {
  formId = $("#" + formId);
 
  var validObject = formId.validate({
    errorClass: "errormessage",
    onkeyup: false,
    errorClass: 'ui-tooltip-red',
    validClass: 'valid',
    rules: {
      require: {required: true}
    },
    errorPlacement: function (error, element) {
      // Set positioning based on the elements position in the form
      var elem = $(element);
 
      // Check we have a valid error message
      if(!error.is(':empty')) {
        // Apply the tooltip only if it isn't valid
        elem
          .filter(':not(.valid)').qtip({
            overwrite: false,
            content: error,
            position: {
              my: "bottom left",
              at: "top right",
              viewport: $(window)
            },
            show: {
              event: "click mouseenter focus"
            },
            hide: {
              event: "blur mouseleave"
            },
            style: {
              classes: 'ui-tooltip-red ui-tooltip-shadow' // Make it red... the classic error colour!
            }
          })
 
          // If we have a tooltip on this element already, just update its content
          .qtip('option', 'content.text', error);
        }
 
        // If the error is empty, remove the qTip
      else { elem.qtip('destroy'); }
    },
    success: $.noop, // Odd workaround for errorPlacement not firing!
    submitHandler: submitCallback
  });
  
  return validObject;
};
