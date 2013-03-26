/**
 * survey-questions.js
 * 
 * Includes all of the questions and input processing of the
 * various survey stages
 */

$(function() {
  // Form instantiation
  var briefing = $S.createForm("briefing"),
      stageI = $S.createForm("stageI"),
      stageII = $S.createForm("stageII"),
      stageIII = $S.createForm("stageIII"),
      formContainer = "container",
      
      // Constants to reduce repetition
      countSelect = 
        "<select class='question-field' survey='count'>" +
        "<option>0</option>" +
        "<option>1</option>" +
        "<option>2</option>" +
        "<option>3</option>" +
        "<option>4</option>" +
        "<option>5 or more</option></select>";
      
  /*
   * BRIEFING
   */
  // Create modules and questions for the newly created form
  briefing
    .addModule(
      // ID for this module
      "mod-briefing",
    
      // Title for this module
      "Complete the Identity Mapping Survey and Download a Free Map of Your Identity",
      
      // List of questions for this module, if any
      [
        {
          text: 
            "<strong>Part I of the Survey</strong> will ask you to provide the following:<br/>" +
            "(1) Basic information about your Physical Self (such as your age, sex, education, and country of residence)<br/>" +
            "(2) A broad overview of your presence in each of 6 digital domains: Blogs, On-Line Forums, Social Networks, Digital Gaming Platforms, 3D Virtual Worlds, and Emails."
        },
        
        {
          text:
            "<strong>Part II of the Survey</strong> will ask you to provide more detailed information about your involvement in each digital domain where you currently have a presence."
        },
        
        {
          text:
            "<strong>After you complete the survey</strong>, you&rsquo;ll be able to download a free color-coded map of your current identity."
        },
        
        {
          text:
            "<strong>Please Note:</strong> Your responses are completely anonymous and we will not ask for any identifying information such as email addresses or account names. " + 
            "We are only interested in whether, and to what extent, you have a presence in a particular digital domain. " +
            "As such, please answer each question as honestly and fully as possible so we can obtain accurate information."
        }
      ]
    )
    .setSubmit(
      "Take the Survey",
      "container",
      function () {
        briefing.deleteForm();
        stageI.render(formContainer);
      }
    )
    .render(formContainer);
    
  /*
   * STAGE I
   */
  stageI
    .addModule(
      "mod-stageI-brief",
      "Identity Mapping Survey: Part I",
      [
        {
          text:
            "Please answer the following questions as completely and honestly as possible. Your answers are kept entirely anonymous. " +
            "This section of the survey asks about your physical self and an overview of your involvement in various digital domains."
        }
      ]
    )
    .addModule(
      "mod-stageI-demo",
      "The Physical Self",
      [
        {
          text:
            "What year were you born?",
          input:
	    "<input class='question-field' type='date' placeholder='1990'/>"
	    // TODO Insert validation code that requires a number >= 1900.
        },
        
        {
          text:
            "What is your sex?",
          input:
	    "<label class='radio'><input name='sex' type='radio'/> Male</label>" +
            "<label class='radio'><input name='sex' type='radio'/> Female</label>" +
            "<label class='radio'><input name='sex' type='radio'/> Transgender</label>"
        },
        
        {
	  // TODO Convert into an autocomplete text field.
          text:
            "What country do you live in?",
          input:
            "<select class='question-field'>" + 
            "<option value=''>Please select...</option>" + 
            "<option value='United States'>United States</option>" + 
            "<option value='United Kingdom'>United Kingdom</option>" + 
            "<option value='Afghanistan'>Afghanistan</option>" + 
            "<option value='Albania'>Albania</option>" + 
            "<option value='Algeria'>Algeria</option>" + 
            "<option value='American Samoa'>American Samoa</option>" + 
            "<option value='Andorra'>Andorra</option>" + 
            "<option value='Angola'>Angola</option>" + 
            "<option value='Anguilla'>Anguilla</option>" + 
            "<option value='Antarctica'>Antarctica</option>" + 
            "<option value='Antigua and Barbuda'>Antigua and Barbuda</option>" + 
            "<option value='Argentina'>Argentina</option>" + 
            "<option value='Armenia'>Armenia</option>" + 
            "<option value='Aruba'>Aruba</option>" + 
            "<option value='Australia'>Australia</option>" + 
            "<option value='Austria'>Austria</option>" + 
            "<option value='Azerbaijan'>Azerbaijan</option>" + 
            "<option value='Bahamas'>Bahamas</option>" + 
            "<option value='Bahrain'>Bahrain</option>" + 
            "<option value='Bangladesh'>Bangladesh</option>" + 
            "<option value='Barbados'>Barbados</option>" + 
            "<option value='Belarus'>Belarus</option>" + 
            "<option value='Belgium'>Belgium</option>" + 
            "<option value='Belize'>Belize</option>" + 
            "<option value='Benin'>Benin</option>" + 
            "<option value='Bermuda'>Bermuda</option>" + 
            "<option value='Bhutan'>Bhutan</option>" + 
            "<option value='Bolivia'>Bolivia</option>" + 
            "<option value='Bosnia and Herzegovina'>Bosnia and Herzegovina</option>" + 
            "<option value='Botswana'>Botswana</option>" + 
            "<option value='Bouvet Island'>Bouvet Island</option>" + 
            "<option value='Brazil'>Brazil</option>" + 
            "<option value='British Indian Ocean Territory'>British Indian Ocean Territory</option>" + 
            "<option value='Brunei Darussalam'>Brunei Darussalam</option>" + 
            "<option value='Bulgaria'>Bulgaria</option>" + 
            "<option value='Burkina Faso'>Burkina Faso</option>" + 
            "<option value='Burundi'>Burundi</option>" + 
            "<option value='Cambodia'>Cambodia</option>" + 
            "<option value='Cameroon'>Cameroon</option>" + 
            "<option value='Canada'>Canada</option>" + 
            "<option value='Cape Verde'>Cape Verde</option>" + 
            "<option value='Cayman Islands'>Cayman Islands</option>" + 
            "<option value='Central African Republic'>Central African Republic</option>" + 
            "<option value='Chad'>Chad</option>" + 
            "<option value='Chile'>Chile</option>" + 
            "<option value='China'>China</option>" + 
            "<option value='Christmas Island'>Christmas Island</option>" + 
            "<option value='Cocos (Keeling) Islands'>Cocos (Keeling) Islands</option>" + 
            "<option value='Colombia'>Colombia</option>" + 
            "<option value='Comoros'>Comoros</option>" + 
            "<option value='Congo'>Congo</option>" + 
            "<option value='Congo, The Democratic Republic of The'>Congo, The Democratic Republic of The</option>" + 
            "<option value='Cook Islands'>Cook Islands</option>" + 
            "<option value='Costa Rica'>Costa Rica</option>" + 
            "<option value='Cote D'ivoire'>Cote D'ivoire</option>" + 
            "<option value='Croatia'>Croatia</option>" + 
            "<option value='Cuba'>Cuba</option>" + 
            "<option value='Cyprus'>Cyprus</option>" + 
            "<option value='Czech Republic'>Czech Republic</option>" + 
            "<option value='Denmark'>Denmark</option>" + 
            "<option value='Djibouti'>Djibouti</option>" + 
            "<option value='Dominica'>Dominica</option>" + 
            "<option value='Dominican Republic'>Dominican Republic</option>" + 
            "<option value='Ecuador'>Ecuador</option>" + 
            "<option value='Egypt'>Egypt</option>" + 
            "<option value='El Salvador'>El Salvador</option>" + 
            "<option value='Equatorial Guinea'>Equatorial Guinea</option>" + 
            "<option value='Eritrea'>Eritrea</option>" + 
            "<option value='Estonia'>Estonia</option>" + 
            "<option value='Ethiopia'>Ethiopia</option>" + 
            "<option value='Falkland Islands (Malvinas)'>Falkland Islands (Malvinas)</option>" + 
            "<option value='Faroe Islands'>Faroe Islands</option>" + 
            "<option value='Fiji'>Fiji</option>" + 
            "<option value='Finland'>Finland</option>" + 
            "<option value='France'>France</option>" + 
            "<option value='French Guiana'>French Guiana</option>" + 
            "<option value='French Polynesia'>French Polynesia</option>" + 
            "<option value='French Southern Territories'>French Southern Territories</option>" + 
            "<option value='Gabon'>Gabon</option>" + 
            "<option value='Gambia'>Gambia</option>" + 
            "<option value='Georgia'>Georgia</option>" + 
            "<option value='Germany'>Germany</option>" + 
            "<option value='Ghana'>Ghana</option>" + 
            "<option value='Gibraltar'>Gibraltar</option>" + 
            "<option value='Greece'>Greece</option>" + 
            "<option value='Greenland'>Greenland</option>" + 
            "<option value='Grenada'>Grenada</option>" + 
            "<option value='Guadeloupe'>Guadeloupe</option>" + 
            "<option value='Guam'>Guam</option>" + 
            "<option value='Guatemala'>Guatemala</option>" + 
            "<option value='Guinea'>Guinea</option>" + 
            "<option value='Guinea-bissau'>Guinea-bissau</option>" + 
            "<option value='Guyana'>Guyana</option>" + 
            "<option value='Haiti'>Haiti</option>" + 
            "<option value='Heard Island and Mcdonald Islands'>Heard Island and Mcdonald Islands</option>" + 
            "<option value='Holy See (Vatican City State)'>Holy See (Vatican City State)</option>" + 
            "<option value='Honduras'>Honduras</option>" + 
            "<option value='Hong Kong'>Hong Kong</option>" + 
            "<option value='Hungary'>Hungary</option>" + 
            "<option value='Iceland'>Iceland</option>" + 
            "<option value='India'>India</option>" + 
            "<option value='Indonesia'>Indonesia</option>" + 
            "<option value='Iran, Islamic Republic of'>Iran, Islamic Republic of</option>" + 
            "<option value='Iraq'>Iraq</option>" + 
            "<option value='Ireland'>Ireland</option>" + 
            "<option value='Israel'>Israel</option>" + 
            "<option value='Italy'>Italy</option>" + 
            "<option value='Jamaica'>Jamaica</option>" + 
            "<option value='Japan'>Japan</option>" + 
            "<option value='Jordan'>Jordan</option>" + 
            "<option value='Kazakhstan'>Kazakhstan</option>" + 
            "<option value='Kenya'>Kenya</option>" + 
            "<option value='Kiribati'>Kiribati</option>" + 
            "<option value='Korea, Democratic People's Republic of'>Korea, Democratic People's Republic of</option>" + 
            "<option value='Korea, Republic of'>Korea, Republic of</option>" + 
            "<option value='Kuwait'>Kuwait</option>" + 
            "<option value='Kyrgyzstan'>Kyrgyzstan</option>" + 
            "<option value='Lao People's Democratic Republic'>Lao People's Democratic Republic</option>" + 
            "<option value='Latvia'>Latvia</option>" + 
            "<option value='Lebanon'>Lebanon</option>" + 
            "<option value='Lesotho'>Lesotho</option>" + 
            "<option value='Liberia'>Liberia</option>" + 
            "<option value='Libyan Arab Jamahiriya'>Libyan Arab Jamahiriya</option>" + 
            "<option value='Liechtenstein'>Liechtenstein</option>" + 
            "<option value='Lithuania'>Lithuania</option>" + 
            "<option value='Luxembourg'>Luxembourg</option>" + 
            "<option value='Macao'>Macao</option>" + 
            "<option value='Macedonia, The Former Yugoslav Republic of'>Macedonia, The Former Yugoslav Republic of</option>" + 
            "<option value='Madagascar'>Madagascar</option>" + 
            "<option value='Malawi'>Malawi</option>" + 
            "<option value='Malaysia'>Malaysia</option>" + 
            "<option value='Maldives'>Maldives</option>" + 
            "<option value='Mali'>Mali</option>" + 
            "<option value='Malta'>Malta</option>" + 
            "<option value='Marshall Islands'>Marshall Islands</option>" + 
            "<option value='Martinique'>Martinique</option>" + 
            "<option value='Mauritania'>Mauritania</option>" + 
            "<option value='Mauritius'>Mauritius</option>" + 
            "<option value='Mayotte'>Mayotte</option>" + 
            "<option value='Mexico'>Mexico</option>" + 
            "<option value='Micronesia, Federated States of'>Micronesia, Federated States of</option>" + 
            "<option value='Moldova, Republic of'>Moldova, Republic of</option>" + 
            "<option value='Monaco'>Monaco</option>" + 
            "<option value='Mongolia'>Mongolia</option>" + 
            "<option value='Montserrat'>Montserrat</option>" + 
            "<option value='Morocco'>Morocco</option>" + 
            "<option value='Mozambique'>Mozambique</option>" + 
            "<option value='Myanmar'>Myanmar</option>" + 
            "<option value='Namibia'>Namibia</option>" + 
            "<option value='Nauru'>Nauru</option>" + 
            "<option value='Nepal'>Nepal</option>" + 
            "<option value='Netherlands'>Netherlands</option>" + 
            "<option value='Netherlands Antilles'>Netherlands Antilles</option>" + 
            "<option value='New Caledonia'>New Caledonia</option>" + 
            "<option value='New Zealand'>New Zealand</option>" + 
            "<option value='Nicaragua'>Nicaragua</option>" + 
            "<option value='Niger'>Niger</option>" + 
            "<option value='Nigeria'>Nigeria</option>" + 
            "<option value='Niue'>Niue</option>" + 
            "<option value='Norfolk Island'>Norfolk Island</option>" + 
            "<option value='Northern Mariana Islands'>Northern Mariana Islands</option>" + 
            "<option value='Norway'>Norway</option>" + 
            "<option value='Oman'>Oman</option>" + 
            "<option value='Pakistan'>Pakistan</option>" + 
            "<option value='Palau'>Palau</option>" + 
            "<option value='Palestinian Territory, Occupied'>Palestinian Territory, Occupied</option>" + 
            "<option value='Panama'>Panama</option>" + 
            "<option value='Papua New Guinea'>Papua New Guinea</option>" + 
            "<option value='Paraguay'>Paraguay</option>" + 
            "<option value='Peru'>Peru</option>" + 
            "<option value='Philippines'>Philippines</option>" + 
            "<option value='Pitcairn'>Pitcairn</option>" + 
            "<option value='Poland'>Poland</option>" + 
            "<option value='Portugal'>Portugal</option>" + 
            "<option value='Puerto Rico'>Puerto Rico</option>" + 
            "<option value='Qatar'>Qatar</option>" + 
            "<option value='Reunion'>Reunion</option>" + 
            "<option value='Romania'>Romania</option>" + 
            "<option value='Russian Federation'>Russian Federation</option>" + 
            "<option value='Rwanda'>Rwanda</option>" + 
            "<option value='Saint Helena'>Saint Helena</option>" + 
            "<option value='Saint Kitts and Nevis'>Saint Kitts and Nevis</option>" + 
            "<option value='Saint Lucia'>Saint Lucia</option>" + 
            "<option value='Saint Pierre and Miquelon'>Saint Pierre and Miquelon</option>" + 
            "<option value='Saint Vincent and The Grenadines'>Saint Vincent and The Grenadines</option>" + 
            "<option value='Samoa'>Samoa</option>" + 
            "<option value='San Marino'>San Marino</option>" + 
            "<option value='Sao Tome and Principe'>Sao Tome and Principe</option>" + 
            "<option value='Saudi Arabia'>Saudi Arabia</option>" + 
            "<option value='Senegal'>Senegal</option>" + 
            "<option value='Serbia and Montenegro'>Serbia and Montenegro</option>" + 
            "<option value='Seychelles'>Seychelles</option>" + 
            "<option value='Sierra Leone'>Sierra Leone</option>" + 
            "<option value='Singapore'>Singapore</option>" + 
            "<option value='Slovakia'>Slovakia</option>" + 
            "<option value='Slovenia'>Slovenia</option>" + 
            "<option value='Solomon Islands'>Solomon Islands</option>" + 
            "<option value='Somalia'>Somalia</option>" + 
            "<option value='South Africa'>South Africa</option>" + 
            "<option value='South Georgia and The South Sandwich Islands'>South Georgia and The South Sandwich Islands</option>" + 
            "<option value='Spain'>Spain</option>" + 
            "<option value='Sri Lanka'>Sri Lanka</option>" + 
            "<option value='Sudan'>Sudan</option>" + 
            "<option value='Suriname'>Suriname</option>" + 
            "<option value='Svalbard and Jan Mayen'>Svalbard and Jan Mayen</option>" + 
            "<option value='Swaziland'>Swaziland</option>" + 
            "<option value='Sweden'>Sweden</option>" + 
            "<option value='Switzerland'>Switzerland</option>" + 
            "<option value='Syrian Arab Republic'>Syrian Arab Republic</option>" + 
            "<option value='Taiwan, Province of China'>Taiwan, Province of China</option>" + 
            "<option value='Tajikistan'>Tajikistan</option>" + 
            "<option value='Tanzania, United Republic of'>Tanzania, United Republic of</option>" + 
            "<option value='Thailand'>Thailand</option>" + 
            "<option value='Timor-leste'>Timor-leste</option>" + 
            "<option value='Togo'>Togo</option>" + 
            "<option value='Tokelau'>Tokelau</option>" + 
            "<option value='Tonga'>Tonga</option>" + 
            "<option value='Trinidad and Tobago'>Trinidad and Tobago</option>" + 
            "<option value='Tunisia'>Tunisia</option>" + 
            "<option value='Turkey'>Turkey</option>" + 
            "<option value='Turkmenistan'>Turkmenistan</option>" + 
            "<option value='Turks and Caicos Islands'>Turks and Caicos Islands</option>" + 
            "<option value='Tuvalu'>Tuvalu</option>" + 
            "<option value='Uganda'>Uganda</option>" + 
            "<option value='Ukraine'>Ukraine</option>" + 
            "<option value='United Arab Emirates'>United Arab Emirates</option>" + 
            "<option value='United Kingdom'>United Kingdom</option>" + 
            "<option value='United States'>United States</option>" + 
            "<option value='United States Minor Outlying Islands'>United States Minor Outlying Islands</option>" + 
            "<option value='Uruguay'>Uruguay</option>" + 
            "<option value='Uzbekistan'>Uzbekistan</option>" + 
            "<option value='Vanuatu'>Vanuatu</option>" + 
            "<option value='Venezuela'>Venezuela</option>" + 
            "<option value='Viet Nam'>Viet Nam</option>" + 
            "<option value='Virgin Islands, British'>Virgin Islands, British</option>" + 
            "<option value='Virgin Islands, U.S.'>Virgin Islands, U.S.</option>" + 
            "<option value='Wallis and Futuna'>Wallis and Futuna</option>" + 
            "<option value='Western Sahara'>Western Sahara</option>" + 
            "<option value='Yemen'>Yemen</option>" + 
            "<option value='Zambia'>Zambia</option>" + 
            "<option value='Zimbabwe'>Zimbabwe</option>" +
            "</select>"
        },

        // TODO Convert all other select/option elements into radio buttons.
        {
          text:
            "What is your highest level of education?",
          input:
            "<label class='radio'><input type='radio' name='edu'/> I did not complete high school</label>" +
            "<label class='radio'><input type='radio' name='edu'/> Completed high school / Received my GED</label>" +
            "<label class='radio'><input type='radio' name='edu'/> 2 year college / Associate's degree</label>" +
            "<label class='radio'><input type='radio' name='edu'/> 4 year college / Bachelor's degree</label>" +
            "<label class='radio'><input type='radio' name='edu'/> Master's Degree</label>" +
            "<label class='radio'><input type='radio' name='edu'/> Doctoral Degree</label>" +
            "<label class='radio'><input type='radio' name='edu'/> My highest level of education does not fit into any of these categories.  Please explain in the box below:</label>" +
	    // TODO Code for enabling/disabling alternative degree field.
	    "<input placeholder='Alternative degree'/>"
        },
      ]
    )
    .addModule(
      "mod-stageI-blogs",
      "Blogs",
      [
        {
          text:
            "Indicate the number of blogs that you operate:",
          input:
            countSelect
        }
      ]
    )
    .addModule(
      "mod-stageI-forums",
      "Online Forums",
      [
        {
          text:
            "Do you participate in any of the following online forums? Check all that apply:",
          input:
            "<input type='checkbox' class='question-checkbox' label='4chan' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Digg' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Foursquare' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Pinterest' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Reddit' survey='specific' />"
        },
        
        {
          text:
            "How many other online forums do you participate in?",
          input:
            countSelect
        }
      ]
    )
    .addModule(
      "mod-stageI-social-networks",
      "Social Networks",
      [
        {
          text:
            "Do you belong to any of the following social networks? Check all that apply:",
          input:
            "<input type='checkbox' class='question-checkbox' label='Facebook' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Google Plus' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Linked In' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Twitter' survey='specific' />"
        },
        
        {
          text:
            "How many other social networks do you participate in?",
          input:
            countSelect
        }
      ]
    )
    .addModule(
      "mod-stageI-gaming",
      "Digital Gaming Platforms",
      [
        {
          text:
            "Do you use any of the following digital gaming platforms? Check all that apply:",
          input:
            "<input type='checkbox' class='question-checkbox' label='Playstation' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Steam' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Wii' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Xbox 360' survey='specific' />"
        },
        
        {
          text:
            "How many other digital gaming platforms do you use?",
          input:
            countSelect
        }
      ]
    )
    .addModule(
      "mod-stageI-virtual-environments",
      "3D Virtual Worlds",
      [
        {
          text:
            "Indicate whether you have an account or avatar in any of the following 3D virtual worlds:",
          input:
            "<input type='checkbox' class='question-checkbox' label='Blue Mars' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Cloudparty' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Hipihi' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='IMVU' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Second Life' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='SIMS' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='There' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='Utherverse' survey='specific' />" +
            "<input type='checkbox' class='question-checkbox' label='World of Warcraft' survey='specific' />"
        },
        
        {
          text:
            "How many other 3D virtual worlds do you use?",
          input:
            countSelect
        }
      ]
    )
    .addModule(
      "mod-stageI-email",
      "Emails",
      [
        {
          text:
            "Indicate the number of email accounts you have for your <strong>Physical Self</strong>:",
          input:
            countSelect
        }
      ]
    )
    .setSubmit(
      "Go to Part II",
      "container",
      function () {
        // Adjust the page scroll
        $(window).scrollTop("#header");
        
        var currentModule,
            currentSingularTitle,
            currentResponse,
            currentFollowup,
            currentMatch
            specifics = [],
            generals = [];
            
        // We've named each input of interest as question-field or question-checkbox
        // so we can gather the user responses by question
        stageI.parseByModule("[class^=question-]");
        stageI.deleteForm();
        
  /*
   * STAGE II
   */
        
        // Give stage II a nice description for the users
        stageII.addModule(
          "mod-stageII-brief",
          "Identity Mapping Survey: Part II",
          [
            {
              text:
                "Part II of the survey will gather more detailed information about " +
                "your involvement in each digital domain where you currently have a presence.  " +
                "Please provide as much description as possible as you answer the questions in Part II... " +
                "thank you!"
            }
          ]
        )
        .setSubmit(
          "Submit!",
          "container",
          function () {
            // Adjust the page scroll
            $(window).scrollTop("#header");
            stageII
              .parseByModule("[class^=question-]")
              .deleteForm();
              
            stageIII.addModule(
              "mod-stageIII-debrief",
              "Thank you!",
              [
                {
                  text:
                    "<strong>Thank you</strong> for participating in the Identity Mapping Project! Your responses have been recorded."
                },
        
                {
                  text:
                    "<strong>Please tell others</strong> about this website and have them come map their identity! " +
                    "Our goal is to generate thousands or millions of identity maps from around the globe and chart the nature of identity in today&rsquo;s digital world."
                },

                {
                  text:
                    "<strong>To create your identity map</strong>, please click on the button below."
                }
              ]
            )
            .setSubmit(
              // TODO Check the size of this button.
              "Create My Identity Map",
              "container",
              function () {
                // TODO This should eventually go to an identity map display.
                window.location = "/";
              }
            )
            .render("container");
          }
        );
        
        // Now, we need to construct part II of the survey from the responses in part I
        for (var m = 2; m < stageI.modules.length; m++) {
          specifics = [];
          generals = [];
          currentFollowup = [];
          currentModule = stageI.modules[m];
          currentSingularTitle = currentModule.title.substring(0, currentModule.title.length - 1);
          
          // First, we'll take a look at all of the responses in the current module...
          for (var r in currentModule.responses) {
            currentResponse = currentModule.responses[r];
            currentMatch = r.match(/-cb$|-field$/g);
            
            // If the input requests no response, just move on
            if (currentMatch === null) {
              continue;
            }
            
            switch(currentMatch[0]) {
              // Some answers will ask specifics about the user's online persona, we'll handle these first
              case "-cb":
                // Only continue if the user actually selected this digital medium
                if (currentResponse === "true") { // Relax, it's the string "true", not the Boolean
                  specifics.push(
                    {
                      text:
                        "You indicated that you use " + r.replace("-cb", "") + ". Please describe your " +
                        "purpose or function when using this " + currentSingularTitle + "."
                    }
                  );
                }
                break;
              // Some answers will simply be, "how many other instances of this platform do you use?"
              case "-field":
                currentResponse = parseInt(currentResponse);
                for (var i = 1; i <= currentResponse; i++) {
                  generals.push(
                    {
                      text: 
                        "You indicated that you use additional " + currentModule.title + ". " +
                        "Please describe your purpose or function when using the " +
                        (function (num) {
                          var addon;
                          switch(num) {
                            case 1:
                              addon = "st";
                              break;
                            case 2:
                              addon = "nd";
                              break;
                            case 3:
                              addon = "rd";
                              break;
                            default:
                              addon = "th";
                              break;
                          }
                          
                          return num + addon;
                        })(i) +
                        " " + currentSingularTitle + "."
                    }
                  );
                }
                break;
              default:
                continue;
                break;
            }
          }
          
          // If we have any additional questions for this section, we'll add them here
          currentFollowup = specifics.concat(generals);
          if (currentFollowup.length === 0) {
            currentFollowup.push({
              text:
                "There are no additional questions for this category."
            });
          } else {
            var currentQuestion,
                newQuestions = [],
                currentSliderId = "";
            // We still need to add textareas to each question and add the frequency
            // of use question
            for (var i = 0; i < currentFollowup.length; i++) {
              currentQuestion = currentFollowup[i];
              currentQuestion.input = "<textarea class='question-field question-textarea' />";
              newQuestions.push(currentQuestion);
              
              newQuestions.push(
                {
                  text:
                    "How often do you typically use this " + currentSingularTitle + "? (Please select one below)",
                  input:
                    "<div class='text-center'><div class='btn-group btn-group-vertical scale-container' data-toggle='buttons-radio'>" +
                      "<button type='button' class='btn scale-button'>Multiple times a day</button>" +
                      "<button type='button' class='btn scale-button'>Daily / Almost daily</button>" +
                      "<button type='button' class='btn scale-button'>Several times a week</button>" +
                      "<button type='button' class='btn scale-button'>Weekly</button>" +
                      "<button type='button' class='btn scale-button'>Several times a month</button>" +
                      "<button type='button' class='btn scale-button'>Less than once a month</button>" +
                    "</div></div>"
                }
              );
          }
            currentFollowup = newQuestions;
          }
          
          // Finally, add the module to the stage II form
          stageII.addModule(
            currentModule.id.replace("stageI", "stageII"),
            currentModule.title,
            currentFollowup
          );
        }
        
        // Then render stage II!
        stageII.render("container");
      }
    );
    
  
});
