/**
 * server.js
 *
 * Node server configuration and express framework
 */

/*
 * EXPRESS SERVER CONFIGURATION
 */

var express = require('express'),
    
    // Secure app config
    app = module.exports = express(),
    webAppPort = process.env.IMP_PORT || 4000,
    security = {},
    lda,
    adminMail,
    surveyDao,
    controllers,
    tools,
    
    status = {
      SITE_DOMAIN: "imp.cs.lmu.edu:4000"
    };

app.enable('trust proxy'); // For remote IP access, needed by reCAPTCHA:
// http://stackoverflow.com/questions/10849687/how-to-get-remote-client-address
    
app.configure(function () {
  app.set('views', __dirname + '/src/main/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    // To be changed to something less in-line, though less funny
    secret: 'zombie devops feynman identity mapping edition!',
    maxAge : new Date(Date.now() + 3600000)
  }));
  app.use(app.router);
  app.use(express['static'](__dirname + '/src/main/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});


/*
 * UTILITY CONFIG
 */

surveyDao = require("./src/main/conf/db-config.js")().surveyDao;
lda       = require("./src/main/conf/lda-config.js")().lda;
$TM       = require("./src/main/conf/topic-modeler-config.js")(surveyDao, lda).$TM;
adminMail = require('./src/main/conf/mailbox-config.js')(status).adminMail;

tools = {
  // Custom toolkits
  surveyDao: surveyDao,
  lda: lda,
  $TM: $TM,
  adminMail: adminMail,
  app: app,
  status: status,
  
  // NPM Modules
  request: require("request")
}

// We will perform our topic modeling once at the get-go, after the connection
// to the database has had time to set up
setTimeout(function () {
  $TM.getDomainModels();
}, 2000);

// Furthermore, we will perform it again once every 24 hours
setInterval(function () {
  $TM.getDomainModels();
}, 86400000);


/*
 * CONTROLLERS
 */

controllers = [
  './src/main/controllers/interface-controller.js'
];
    
for (var c in controllers) {
  require(controllers[c])(tools);
}


/*
 * MIDDLEWEAR
 */

/*
// Error catcher placed at end of all controller routes
app.use(function(req, res){ 
  res.render('404', {layout: true}); 
});
*/

/*
 * SERVER START
 */

app.listen(webAppPort);
console.log('[!] Express server listening on port %d in %s mode', webAppPort, app.settings.env);

