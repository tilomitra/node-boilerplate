//setup Dependencies
var http    = require('http'),
    fs      = require('fs'),
    express = require('express'),
    exphbs  = require('express3-handlebars'),
    state   = require('express-state'),
    app     = express(),
    port    = (process.env.PORT || 8000),
    routes  = require('./routes'),
    server  = app.listen(port, 'localhost');

//Setup Express App
state.extend(app);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.enable('view cache');
app.enable('strict routing');

//Change "ProjectName" to whatever your application's name is.
app.set('state namespace', 'Place');

app.set('views', __dirname + '/views');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "shhhhhhhhh!"}));
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.use(function(err, req, res, next){
  // if an error occurs Connect will pass it down
  // through these "error-handling" middleware
  // allowing you to respond however you like
  if (err instanceof NotFound) {
      res.render('404');
  }
  else {
      res.render('500');
  }
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
app.get('/', routes.home);

//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://localhost:' + port );
