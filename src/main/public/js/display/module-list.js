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
      
    otherDomainFields =
      "<input type='text' class='question-field' name='--name--1' maxlength='75' />" +
      "<input type='text' class='question-field' name='--name--2' maxlength='75' />" +
      "<input type='text' class='question-field' name='--name--3' maxlength='75' />" +
      "<input type='text' class='question-field' name='--name--4' maxlength='75' />" +
      "<input type='text' class='question-field' name='--name--5' maxlength='75' />",
      
    countSelect = 
       "<select class='question-field' survey='count' name='--name--'>" +
       "<option>1</option>" +
       "<option>2</option>" +
       "<option>3</option>" +
       "<option>4</option>" +
       "<option>5 or more</option></select>",
       
    yearSelect =
      "<select id='demo-year-select' class='question-field must-select'>" +
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
      
    educationSelect =
      "<select id='edu-year-select' class='question-field must-select birthyear-education'>" +
      "<option>Please select...</option>" +
      (function() {
        var result = "";
        for (var i = 0; i < 20; i++) {
          result += "<option>" + i + "</option>"
        }
        result += "<option>20+</option>"
        return result;
      })() +
      "</select>",
      
    // Map that consists of the proper verb / account combinations of various digital mediums
    idiomMap = {
      // Blogs / Personal Websites
      "Blogs": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many blog accounts / personal websites do you have that you've used within the past year?",
        uses: "<input type='checkbox' class='question-checkbox' label='Expressing opinions and viewpoints' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Developing a reputation or recognition as an expert' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Journaling - writing about one&lsquo;s personal experience' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Posting one&lsquo;s resume, credentials, or achievements' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Promoting a business' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Making money via niche blogs (e.g. Adsense)' survey='specific' />"
      },
      
      // Online Forums
      "Online Forums": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many forum accounts do you use in",
        general: true, // Flag to show that this requires a followup description
        uses: "<input type='checkbox' class='question-checkbox' label='Get help with a problem, assignment, or project' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Propose a theory or idea to gain feedback from a community' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Vent frustrations and seek support from others' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Capitalize on an achievement or display work' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Read through submissions to a particular forum to gain exposure' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Amusement or viewing images for entertainment' survey='specific' />"
      },
      
      "4chan": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts / tripcodes do you operate on 4chan that you've used within the past year?"
      },
      
      "Digg": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Digg that you've used within the past year?"
      },
      
      "Foursquare": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Foursquare that you've used within the past year?"
      },
      
      "Pinterest": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Pinterest that you've used within the past year?"
      },
      
      "Reddit": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you operate on Reddit that you've used within the past year?"
      },
      
      // Social Networks
      "Social Networks": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have in ",
        general: true, // Flag to show that this requires a followup description
        uses: "<input type='checkbox' class='question-checkbox' label='Staying in touch with current friends (exchanging messages, viewing status updates, etc.)' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Re-connecting with lost contacts (friends or relatives from your past)' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Making new contacts, gaining new friends, and participating in a group' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Following people you don&lsquo;t know, but are interested in' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Battling boredom or loneliness' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Posting or sharing viewpoints, opinions, and recommendations' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Posting or sharing photos' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Learning about potential employers' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Learning about potential employees' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Promote a Business by marketing, networking, or communication with customers' survey='specific' />"
      },
      
      "Facebook": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Facebook that you've used within the past year?"
      },
      
      "Google Plus": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Google Plus that you've used within the past year?"
      },
      
      "Instagram": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Instagram that you've used within the past year?"
      },
      
      "Linked In": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Linked In that you've used within the past year?"
      },
      
      "Online Dating Sites": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have across Online Dating Sites that you've used within the past year?"
      },
      
      "Twitter": {
        verb: "use",
        account: "handles",
        countQuestion: "How many handles do you have on Twitter that you've used within the past year?"
      },
      
      "WeChat": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on WeChat that you've used within the past year?"
      },
      
      "Weibo": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many accounts do you have on Weibo that you've used within the past year?"
      },
      
      // Online Dating Sites
      "Online Dating Sites": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have in",
        general: true,
        uses: "<input type='checkbox' class='question-checkbox' label='Finding a date' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Finding a partner or relationship' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Making new friends' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Making new business contacts' survey='specific' />"
      },
      
      "eHarmony": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on eHarmony that you've used within the past year?"
      },
      
      "JDate": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on JDate that you've used within the past year?"
      },
      
      "Match": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on Match that you've used within the past year?"
      },
      
      "OKCupid": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on OKCupid that you've used within the past year?"
      },
      
      "PlentyOfFish": {
        verb: "use",
        account: "profiles",
        countQuestion: "How many profiles do you have on PlentyOfFish that you've used within the past year?"
      },
      
      // Digital Gaming Platforms
      "Digital Games": {
        verb: "use",
        account: "games",
        countQuestion: "How many characters have you played in",
        general: true, // Flag to show that this requires a followup description
        uses: "<input type='checkbox' class='question-checkbox' label='Having fun or relaxing' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Competing with others' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Becoming more skillful or mastering a game' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Making friends or connecting with friends' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Belonging to a community' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Battling loneliness' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Escaping from real life through fantasy' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Role playing - being someone or something different than my daily life' survey='specific' />"
      },
      
      "Dragon Age": {
        verb: "play",
        account: "characters",
        countQuestion: "How many characters have you played in a game in the Dragon Age series within the past year?"
      },
      
      "Fallout": {
        verb: "play",
        account: "characters",
        countQuestion: "How many characters have you played in a game in the Fallout series within the past?"
      },
      
      "Guild Wars": {
        verb: "play",
        account: "characters",
        countQuestion: "How many avatars do you have in Guild Wars that you've used within the past year?"
      },
      
      "Mass Effect": {
        verb: "play",
        account: "characters",
        countQuestion: "How many characters have you played in a game in the Mass Effect series within the past year?"
      },
      
      "Skyrim": {
        verb: "play",
        account: "characters",
        countQuestion: "How many characters have you played in Skyrim that you've played within the past year?"
      },
      
      "World of Warcraft": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in World of Warcraft that you've used within the past year?"
      },
      
      // 3D Virtual Worlds
      "3D Virtual Worlds": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in",
        general: true, // Flag to show that this requires a followup description
        uses: "<input type='checkbox' class='question-checkbox' label='Battling boredom or loneliness' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Building or scripting virtual objects and structures' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Exploring a virtual world' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Finding or enhancing a relationship' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Learning or education' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Role playing or fantasy - being someone or something different than my daily life' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Sex or sexual experiences' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Shopping' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Socializing' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Work or employment' survey='specific' />"
      },
      
      "Blue Mars": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Blue Mars that you've used within the past year?"
      },
      
      "Cloudparty": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Cloudparty that you've used within the past year?"
      },
      
      "Hipihi": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Hipihi that you've used within the past year?"
      },
      
      "Kaneva": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Kaneva that you've used within the past year?"
      },
      
      "IMVU": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in IMVU that you've used within the past year?"
      },
      
      "Second Life": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Second Life that you've used within the past year?"
      },
      
      "SIMS": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in SIMS that you've used within the past year?"
      },
      
      "There": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in There that you've used within the past year?"
      },
      
      "Utherverse": {
        verb: "use",
        account: "avatars",
        countQuestion: "How many avatars do you have in Utherverse that you've used within the past year?"
      },
      
      // Emails
      "Emails": {
        verb: "use",
        account: "accounts",
        countQuestion: "How many email accounts have you used for any purpose (personal, business, etc.) within the past year?",
        uses: "<input type='checkbox' class='question-checkbox' label='Communicating or sharing information with friends' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Communicating or sharing information with employers, coworkers, or customers' survey='specific' />" +
              "<input type='checkbox' class='question-checkbox' label='Networking (building social or work contacts)' survey='specific' />"
      }
    },

    // List of modules
    moduleList = {
      /*
       * INFORMED CONSENT
       */
      consent: {
        id: "consent-window",
        title: "Consent to Participate",
        billOfRights:
          "After reading the following 7 items, click on the &quot;Agree&quot; button below to begin the survey, or the &quot;Disagree&quot; button to decline to take the survey." +
          "<ol class='indent-1'><br/>" +
            "<li><p>I understand that I must be 18 years of age or older to participate in this project.</p></li>" +
            "<li><p>" +
              "I understand that if I am a participant in this research study, I will be completing a brief survey that will ask me to identify my age, gender, education, " +
              "and nationality and to describe my participation in a variety of digital domains." +
            "</p></li>" +
            "<li><p>" +
              "I understand that the survey information is completely anonymous. No personal names, account names, user names, IP addresses, or any other form of " +
              "identifying information will be collected and all survey responses will be stored according to a number and in no way linked to any individual." +
            "</p></li>" +
            "<li><p>I understand that the study includes no foreseeable risks or discomforts.</p></li>" +
            "<li><p>" +
              "I understand that the possible benefits of the study are that I will contribute to the understanding of how people of different ages, genders, " +
              "educational levels, and nationalities express their identities through a variety of online forms, and that I will be able to view or share" +
              "a free, color-coded copy of my current digital identity at the conclusion of the survey." +
            "</p></li>" +
            "<li><p>I understand that I have the right to refuse to participate in, or to withdraw from, this research at any time without prejudice to me in any respect.</p></li>" +
            "<li><p>" +
              "I understand that Dr. Richard Gilbert can be reached via email at <a href='mailto:richard.gilbert@lmu.edu'>richard.gilbert@lmu.edu</a>, and " +
              "Dr. David Hardy, Chair of the Loyola Marymount University Institutional Review Board can be reached at <a href='mailto:david.hardy@lmu.edu'>david.hardy@lmu.edu</a>," +
              "if any questions arise regarding any procedures performed as part of this study." +
            "</p></li>" +
          "</ol>",
        buttons:
          "<a class='btn btn-primary pull-right' href='/'>Disagree</a>" +
          "<a id='consent-button' class='btn btn-primary pull-left' class='close' data-dismiss='modal' aria-hidden='true'>Agree</a>"
      },
      
      /*
       * BRIEFING
       */
      briefing: {
        id: "mod-briefing",
        title: "Complete the Identity Mapping Survey and View a Free Map of Your Identity",
        questions:
          [
            {
              text: 
                "<strong>Part I of the Survey</strong> will ask you to provide the following:<br/>" +
                "(1) Basic information about your Physical Self (such as your age, sex, education, and country of residence)<br/>" +
                "(2) A broad overview of your presence in each of seven digital domains: Emails, Blogs / Personal Websites, Social Networks, Online Dating Sites, Online Forums, Digital Games, and 3D Virtual Worlds."
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
                "<strong>After you complete the survey</strong>, you&rsquo;ll be able to view and share a free color-coded map of your current identity."
            },
            
            {
              text:
                "<strong>Duration:</strong> The survey takes approximately <strong>20 minutes</strong> to complete. Feel free to take as much time as you need, but do not close the browser window or your progress will be lost!"
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
                "What is your gender?",
              input:
                "<label class='radio'><input name='sex' type='radio'/>Male</label>" +
                "<label class='radio'><input name='sex' type='radio'/>Female</label>" +
                "<label class='radio'><input name='sex' type='radio'/>Transgender</label>"
            },
            
            {
              text:
                "What country do you live in?",
              input:
                "<select id='country-select' class='question-field must-select'>" + 
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
                "How many years of formal education have you completed (starting with first grade or equivalent)?",
              input:
                educationSelect
            },
          ]
        },
        
        blogs: {
          id: "mod-stageI-blogs",
          title: "Blogs / Personal Websites",
          questions: [
            {
              text:
                "Do you have one or more Blogs / Personal Websites that you've used within the past year?",
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
                "Have you participated in any of the following online forums within the past year? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox noAnswer' label='I have not used an online forum in the past year' id='noAnswer-OF' survey='noAnswer' /><br/>" +
                "<input type='checkbox' class='question-checkbox' label='4chan' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Digg' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Foursquare' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Pinterest' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Reddit' survey='specific' />"
            },
            
            {
              text:
                "If you have participated in any other Online Forums within the past year, please enter their names below.",
              input:
                otherDomainFields.replace(/--name--/g, "forums-other-")
            }
          ]
        },
        
        socialNetworks: {
          id: "mod-stageI-social-networks",
          title: "Social Networks",
          questions: [
            {
              text:
                "Do you have an account in any of the following social networks that you've used within the past year? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox noAnswer' label='I have not used a social network in the past year' id='noAnswer-SN' survey='noAnswer' /><br/>" +
                "<input type='checkbox' class='question-checkbox' label='Facebook' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Google Plus' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Instagram' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Linked In' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Twitter' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='WeChat' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Weibo' survey='specific' />"
            },
            
            {
              text:
                "If you have used any other Social Networks within the past year, please enter their names below.",
              input:
                otherDomainFields.replace(/--name--/g, "social-net-other-")
            }
          ]
        },
        
        onlineDatingSites: {
          id: "mod-stageI-online-dating-sites",
          title: "Online Dating Sites",
          questions: [
            {
              text:
                "Do you have an account in any of the following Online Dating Sites that you've used within the past year? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox noAnswer' label='I have not used an online dating site in the past year' id='noAnswer-OD' survey='noAnswer' /><br/>" +
                "<input type='checkbox' class='question-checkbox' label='eHarmony' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='JDate' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Match' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='OKCupid' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='PlentyOfFish' survey='specific' />"
            },
            
            {
              text:
                "If you have used any other Online Dating Sites in the past year, please enter their names below.",
              input:
                otherDomainFields.replace(/--name--/g, "online-dating-other-")
            }
          ]
        },
        
        gaming: {
          id: "mod-stageI-gaming",
          title: "Digital Games",
          questions: [
            {
              text:
                "Please read the following before you complete this section on Digital Gaming and the next section on 3D Virtual Worlds." +
                "<ol>" +
                  "<li>We are only interested in Digital Games where you play through a <strong>character or avatar</strong>.</li>" +
                  "<li>Character-based Digital Games are different than 3D Virtual Worlds. Digital Games have goals built into the " +
                  "program such as amassing points, completing objectives, or reaching destinations. 3D Virtual Worlds also involve " +
                  "avatars but they are more open-ended environments where users select their own activities such as socializing, work, " +
                  "learning, or play and define their own goals and objectives.</li>" +
                "</ol>"
            },
            
            {
              text:
                "Have you played any of the following character or avatar-based digital games within the past year? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox noAnswer' label='I have not played a character or avatar-based digital game in the past year' id='noAnswer-DG' survey='noAnswer' /><br/>" +
                "<input type='checkbox' class='question-checkbox' label='Dragon Age' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Fallout' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Guild Wars' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Mass Effect' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Skyrim' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='World of Warcraft' survey='specific' />"
            },
            
            {
              text:
                "If you have played any other character or avatar-based digital games within the past year, please enter their names below.",
              input:
                otherDomainFields.replace(/--name--/g, "gaming-other-")
            }
          ]
        },
        
        virtualEnvironments: {
          id: "mod-stageI-virtual-environments",
          title: "3D Virtual Worlds",
          questions: [
            {
              text:
                "Do you have an account or avatar in any of the following 3D virtual worlds that you've used within the past year? Check all that apply:",
              input:
                "<input type='checkbox' class='question-checkbox noAnswer' label='I have not used a 3D virtual world in the past year' id='noAnswer-3D' survey='noAnswer' /><br/>" +
                "<input type='checkbox' class='question-checkbox' label='Blue Mars' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Cloudparty' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Hipihi' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Kaneva' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='IMVU' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Second Life' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='SIMS' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='There' survey='specific' />" +
                "<input type='checkbox' class='question-checkbox' label='Utherverse' survey='specific' />"
            },
            
            {
              text:
                "If you have used any other 3D Virtual Worlds within the past year, please enter their names below.",
              input:
                otherDomainFields.replace(/--name--/g, "virtual-world-other-")
            }
          ]
        },
        
        email: {
          id: "mod-stageI-email",
          title: "Emails",
          questions: [
            {
              text:
                "Do you have any email accounts that you've used within the past year?",
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
                "You indicated that you are not involved in enough (2 or more) digital domains to possess any crossover accounts. Please click the button below to continue!"
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
              "<strong>Thank you</strong> for participating in the Identity Mapping Project! To submit your answers and view your personalized identity map, please type the word images into the text box below and then click on the <i>Create My Identity</i> button." +
              "<div id='recaptcha_div'></div>" +
              "<script>Recaptcha.create('6LcmK_sSAAAAAHrPhy4O1E0a1LJfz9Di7siJ4rfP', 'recaptcha_div', { theme: 'clean', callback: Recaptcha.focus_response_field });</script>"
          }
        ],
        modal:
          "<div id='stageIVModal' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='modalTitle' aria-hidden='true'>" +
            "<div class='modal-header'>" +
              "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>" +
              "<h3 id='modalTitle'>Thank You!</h3>" +
            "</div>" +
            "<div class='modal-body'>" +
              "<p>Thanks again for participating! Please tell others about this website and have them map their own identities!</p>" +
              "<p>Our goal is to generate thousands (if not millions) of identity maps from around the globe and chart the nature of identity in today's digital world.</p>" +
            "</div>" +
            "<div class='modal-footer'>" +
              "<button class='btn' data-dismiss='modal' aria-hidden='true'>OK</button>" +
            "</div>" +
          "</div>"
      }
    },
    
    idiomArchdomain;
    
