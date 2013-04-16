//setup Dependencies
var http    = require('http'),
    fs      = require('fs'),
    connect = require('connect'),
    express = require('express'),
    exphbs  = require('express3-handlebars'),
    app     = express(),
    port    = (process.env.PORT || 8000),
    server  = app.listen(port, 'localhost'),
    io = require('socket.io').listen(server);

//server.listen(8000);
//Setup Express App
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.enable('view cache');

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "shhhhhhhhh!"}));
    app.use(connect.static(__dirname + '/static'));
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
    })
});

//app.listen(port, 'localhost');

//Setup Socket.IO
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('app_message',data);
    socket.emit('app_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
app.get('/', function (req, res, next) {
    res.render('home');
});

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
