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
        onkeyup: false,
        errorClass: 'error',
        validClass: 'success',
        showErrors: function(errorMap, errorList) {
          $.each(this.successList, function(index, value) {
            return $(value).popover("hide");
          });
          if (errorList.length) {
            var firstError = $(errorList[0].element);
            $("html, body")
              .stop()
              .animate({
                scrollTop: firstError.position().top - 50
              }, 500);
            $("select").change(function () {
              $(this).valid();
            });
          }
          return $.each(errorList, function(index, value) {
            var _popover;
            _popover = $(value.element).popover({
              trigger: "manual",
              placement: "right",
              content: value.message,
              template: "<div class='popover alert-error'><div class='arrow'></div><div class='popover-inner'><div class='popover-content'><p></p></div></div></div>"
            });
            _popover.data("popover").options.content = value.message;
            return $(value.element).popover("show");
          });
        },
        success: $.noop, // Odd workaround for errorPlacement not firing!
        submitHandler: submitCallback
      });
  
  return validObject;
};

if (jQuery.validator) {
  jQuery.validator.addMethod(
    "must-select",
    
    function(value, element) {
      return !/^Please select...|^\s$/.test(value);
    },
    
    "Please select a menu option"
  );
  
  jQuery.validator.addMethod(
    "radio",
    
    function(value, element) {
      return $("input[name='" + $(element).attr("name") + "']:checked").length > 0;
    },
    
    "Please select an option"
  );
  
  jQuery.validator.addMethod(
    "question-textarea",
    
    function(value, element) {
      return Boolean(value);
    },
    
    "Please enter a description"
  );
  
  jQuery.validator.addMethod(
    "birthyear-education",
    
    function(value, element) {
      var yearsAlive = new Date().getYear() + 1900 - parseInt($("#demo-year-select").val());
      return yearsAlive >= parseInt(value);
    },
    
    "Your years of education exceed your age"
  );
}