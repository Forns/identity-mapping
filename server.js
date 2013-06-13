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
    surveyDao,
    controllers;
    
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
lda = require("./src/main/conf/lda-config.js")().lda;
$TM = require("./src/main/conf/topic-modeler-config.js")(surveyDao, lda).$TM;

console.log(
  $TM.getTopics(["Its subfields can be divided into a variety of theoretical and practical disciplines. Some fields, such as computational complexity theory (which explores the fundamental properties of computational problems), are highly abstract, whilst fields such as computer graphics emphasize real-world visual applications. Still other fields focus on the challenges in implementing computation. For example, programming language theory considers various approaches to the description of computation, whilst the study of computer programming itself investigates various aspects of the use of programming language and complex systems. Human-computer interaction considers the challenges in making computers and computations useful, usable, and universally accessible to humans."])
);

/*
 * CONTROLLERS
 */

controllers = [
  './src/main/controllers/interface-controller.js'
];
    
for (var c in controllers) {
  require(controllers[c])(app, surveyDao);
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

