//setup Dependencies
var express  = require('express'),
bodyParser   = require('body-parser'),
cookieParser = require('cookie-parser'),
session      = require('express-session'),
state        = require('express-state'),
hbs          = require('./lib/exphbs'),
routes       = require('./routes'),
middleware   = require('./middleware'),
config       = require('./config'),
app          = express(),
port         = (process.env.PORT || 8000),
server       = app.listen(port, 'localhost'),
router;

//Setup Express App
state.extend(app);
app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
app.enable('view cache');
//app.enable('strict routing');

//Change "ProjectName" to whatever your application's name is.
app.set('state namespace', 'ProjectName');

//Create an empty Data object and expose it to the client. This
//will be available on the client under ProjectName.Data
app.expose({}, 'Data');

if (app.get('env') === 'development') {
    app.use(middleware.logger('tiny'));
}

app.set('views', config.dirs.views);

router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(express.static(config.dirs.pub));
app.use(router);


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
router.get('/', routes.render('home'));

//A Route for Creating a 500 Error (Useful to keep around)
router.get('/500', routes.render);

//The 404 Route (ALWAYS Keep this as the last route)
router.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://localhost:' + port );
