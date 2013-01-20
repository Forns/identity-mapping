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
    security = {},
    database,
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

// Nothing here... for now...

/*
 * CONTROLLERS
 */

controllers = [
  './src/main/controllers/interface-controller.js'
];
    
for (var c in controllers) {
  require(controllers[c])(app);
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

app.listen(4000);
console.log('[!] Express server listening on port 4000 in %s mode', app.settings.env);

