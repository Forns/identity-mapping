/**
 * module-list.js
 * 
 * Contains the modules to be used in the survey; they are abstracted
 * here for cleanliness in survey-questions.js
 */

// Constants to reduce repetition
var countRadio = 
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' checked />0</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' />1</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' />2</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' />3</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' />4</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='count' />5 or more</label>",
      
    frequencyRadio = 
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='frequency' />Daily</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='frequency' />Weekly / Several times a week</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='frequency' />Monthly / Several times a month</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='frequency' />Less than once a month</label>",
      
    booleanRadio =
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='boolean' value='true' />Yes</label>" +
      "<label class='radio'><input name='--name--' type='radio' label='--name--' survey='boolean' value='false' />No</label>",
      
    countSelect = 
       "<select class='question-field' survey='count' name='--name--'>" +
       "<option>0</option>" +
       "<option>1</option>" +
       "<option>2</option>" +
       "<option>3</option>" +
       "<option>4</option>" +
       "<option>5 or more</option></select>",
       
    yearSelect =
      "<select id='demo-year-select' class='question-field'>" +
      "<option>Please select...</option>" +
      (function() {
        var result = "",
            currentYear = new Date().getFullYear();
        for (var i = 0; i < 150; i++) {
          result += "<option>" + (currentYear - i) + "</option>"
        }
        return result;
      })() +
      "</select>",
      
    // Map that consists of the proper verb / account combinations of various digital mediums
    idiomMap = {
      // Blogs
      "Blogs": {
        verb: "operate",
        account: "accounts",
        countQuestion: "How many blog accounts do you operate?"
      },
      
      // Online Forums
      "Online Forums": {
        verb: "operate",
        account: "accounts",
        countQuestion: "How many forum accounts do you operate in the",
        general: true // Flag to show that this requires a followup description
      },
      
      "4chan": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts / tripcodes do you operate on 4chan?"
      },
      
      "Digg": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Digg?"
      },
      
      "Foursquare": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Foursquare?"
      },
      
      "Pinterest": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Pinterest?"
      },
      
      "Reddit": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Reddit?"
      },
      
      // Social Networks
      "Social Networks": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have in the",
        general: true // Flag to show that this requires a followup description
      },
      
      "Facebook": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Facebook?"
      },
      
      "Google Plus": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Google Plus?"
      },
      
      "Linked In": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Linked In?"
      },
      
      "Online Dating Sites": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have across Online Dating Sites?"
      },
      
      "Twitter": {
        verb: "use",
        account: "handles",
        countQuestion: "How many handles do you have on Twitter?"
      },
      
      // Digital Gaming Platforms
      "Digital Gaming Platforms": {
        verb: "use",
        account: "games",
        countQuestion: "During the last 6 months, in how many games have you been an active player within the",
        general: true // Flag to show that this requires a followup description
      },
      
      "Playstation": {
        verb: "use",
        account: "games",
        countQuestion: "During the last 6 months, how many games have you actively played on the Playstation?"
      },
      
      "Steam": {
        verb: "use",
        account: "games",
        countQuestion: "During the last 6 months, how many games have you actively played on Steam?"
      },
      
      "Wii": {
        verb: "use",
        account: "games",
        countQuestion: "During the last 6 months, how many games have you actively played on the Wii?"
      },
      
      "Xbox 360": {
        verb: "use",
        account: "games",
        countQuestion: "During the last 6 months, how many games have you actively played on the Xbox 360?"
      },
      
      // 3D Virtual Worlds
      "3D Virtual Worlds": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in the",
        general: true // Flag to show that this requires a followup description
      },
      
      "Blue Mars": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Blue Mars?"
      },
      
      "Cloudparty": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Cloudparty?"
      },
      
      "Hipihi": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Hipihi?"
      },
      
      "Kaneva": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Kaneva?"
      },
      
      "IMVU": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in IMVU?"
      },
      
      "Second Life": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Second Life?"
      },
      
      "SIMS": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in SIMS?"
      },
      
      "There": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in There?"
      },
      
      "Utherverse": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in Utherverse?"
      },
      
      "World of Warcraft": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you currently have in World of Warcraft?"
      },
      
      // Emails
      "Emails": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many email accounts do you have?"
      }
    }

    // List of modules
    moduleList = {
      
      /*
       * BRIEFING
       */
      briefing: {
        id: "mod-briefing",
        title: "Complete the Identity Mapping Survey and Download a Free Map of Your Identity",
        questions:
          [
            {
              text: 
                "<strong>Part I of the Survey</strong> will ask you to provide the following:<br/>" +
                "(1) Basic information about your Physical Self (such as your age, sex, education, and country of residence)<br/>" +
                "(2) A broad overview of your presence in each of six digital domains: Blogs, On-Line Forums, Social Networks, Digital Gaming Platforms, 3D Virtual Worlds, and Emails."
            },
            
            {
              text:
                "<strong>Part II of the Survey</strong> will ask you to provide more detailed information about your involvement in each digital domain where you currently have a presence."
            },

            {
              text:
                "<strong>Part III of the Survey</strong> will explain the concept of &ldquo;Crossover Accounts&rdquo; and find out if you have any crossover accounts in your digital identity."
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
      },
      
      /*
       * STAGE I
       */
      stageI: {
        briefing: {
          id: "mod-stageI-brief",
          title: "Identity Mapping Survey: Part I",
          questions: [
            {
              text:
                "Please answer the following questions as completely and honestly as possible. Your answers are kept entirely anonymous. " +
                "This section of the survey asks about your physical self and an overview of your involvement in various digital domains."
            }
          ]
        },
        
        demo: {
          id: "mod-stageI-demo",
          title: "The Physical Self",
          questions: [
            {
              text:
                "What year were you born?",
              input:
                yearSelect
            },
            
            {
              text:
                "What is your sex?",
              input:
                "<label class='radio'><input name='sex' type='radio'/>Male</label>" +
                "<label class='radio'><input name='sex' type='radio'/>Female</label>" +
                "<label class='radio'><input name='sex' type='radio'/>Transgender</label>"
            },
            
            {
              text:
                "What country do you live in?",
              input:
                "<select id='country-select' class='question-field'>" + 
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
    
            {
              text:
                "How many years of formal education have you completed?",
              input:
                "<label class='radio'><input type='radio' name='edu'/>Less than 12 years</label>" +
                "<label class='radio'><input type='radio' name='edu'/>12 years</label>" +
                "<label class='radio'><input type='radio' name='edu'/>13-15 years</label>" +
                "<label class='radio'><input type='radio' name='edu'/>16 years</label>" +
                "<label class='radio'><input type='radio' name='edu'/>More than 16 years</label>"
            },
          ]
        },
        
        blogs: {
          id: "mod-stageI-blogs",
          title: "Blogs",
          questions: [
            {
              text:
                "Do you operate one or more Blogs?",
              input:
                booleanRadio.replace(/--name--/g, "Blogs-radio")
            }
          ]
        },
        
        forums: {
          id: "mod-stageI-forums",
          title: "Online Forums",
          questions: [
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
                countSelect.replace(/--name--/g, "forums-radio")
            }
          ]
        },
        
        socialNetworks: {
          id: "mod-stageI-social-networks",
          title: "Social Networks",
          questions: [
            {
              text:
                "Do you belong to any of the following social networks? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox' label='Facebook' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Google Plus' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Linked In' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Online Dating Sites' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Twitter' survey='specific' />"
            },
            
            {
              text:
                "How many other social networks do you participate in?",
              input:
                countSelect.replace(/--name--/g, "social-net-radio")
            }
          ]
        },
        
        gaming: {
          id: "mod-stageI-gaming",
          title: "Digital Gaming Platforms",
          questions: [
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
                countSelect.replace(/--name--/g, "gaming-platform-radio")
            }
          ]
        },
        
        virtualEnvironments: {
          id: "mod-stageI-virtual-environments",
          title: "3D Virtual Worlds",
          questions: [
            {
              text:
                "Indicate whether you have an account or avatar in any of the following 3D virtual worlds:",
              input:
                "<input type='checkbox' class='question-checkbox' label='Blue Mars' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Cloudparty' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Hipihi' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Kaneva' survey='specific' />" +
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
                countSelect.replace(/--name--/g, "virtual-world-radio")
            }
          ]
        },
        
        email: {
          id: "mod-stageI-email",
          title: "Emails",
          questions: [
            {
              text:
                "Do you have any email accounts?",
              input:
                booleanRadio.replace(/--name--/g, "Emails-radio")
            }
          ]
        },
      },
      
      /*
       * STAGE II
       */
      stageII: {
        briefing: {
          id: "mod-stageII-brief",
          title: "Identity Mapping Survey: Part II",
          questions: [
            {
              text:
                "Part II of the survey will ask you to provide more detailed information about your involvement " +
                "in each digital domain where you currently have a presence. Once again, please answer the questions " +
                "as fully and accurately as possible. Thank you!"
            }
          ]
        },
        
        empty: {
          questions: [
            {
              text:
                "You indicated that you do not use any digital medium! Please click the button below to continue the survey."
            }
          ]
        }
      },
      
      /*
       * STAGE III
       */
      stageIII: {
        briefing: {
          id: "mod-stageIII-brief",
	        title: "Identity Mapping Survey: Part III",
      	  questions: [
      	    {
      	      text:
                "<p>The last section of the survey finds out " +
                "whether there are any <i>Crossover Accounts</i> in your digital identity.  " +
                "What is a &ldquo;Crossover Account?&rdquo;  " +
                "A crossover account is when you (1) create a user name " +
                "<strong>that is different from your physical name</strong> in a digital application " +
                "(e.g., email, Facebook, Twitter, virtual worlds, etc.) " +
                "and (2) you later use this identity in another digital application.</p>" +

                "<p>For example, let&rsquo;s say your physical name is &ldquo;John Smith&rdquo; " +
                "and you create a user name or identity of &ldquo;Merlin Merlot&rdquo; on Facebook.  " +
                "Then, at a later point, Merlin Merlot becomes the name of an avatar you control in a virtual world, " +
                "or a character you control in a digital gaming platform, " +
                "or a Twitter handle you use, or an email account name.  " +
                "In each case, the identity of Merlin Merlot was created in one digital domain or application (Facebook), " +
                "and has now &ldquo;crossed over&rdquo; into one or more other digital domains or applications " +
                "(virtual world, digital gaming, Twitter, email).</p>"
      	    }
          ]
        },
        
        crossover: {
          id: "mod-stageIII-crossovers",
          title: "Crossover Accounts"
        },

        empty: {
      	  questions: [
      	    {
      	      text:
                "You indicated that you are not involved in enough (2 or more) digital domains to possess any crossover accounts. Please click submit below to continue!"
      	    }
          ]
      	}
      },
      /*
       * STAGE IV
       */
      stageIV: {
        id: "mod-stageIV-debrief",
        title: "Thank you!",
        questions: [
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
      }
    };
