var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//var expressValidator = require('expressValidator');

var app = express();

//production mode - zaradi vernosti odstrani error pages and in sčisti logging
process.env.NODE_ENV = 'production';
var compression = require('compression'); // zmanjsa cas nalaganja
app.use(compression()); //Compress all routes
var helmet = require('helmet');
app.use(helmet());
//menjaj console z debug



//baza
var mongoose = require('mongoose');
mongoose.connect('mongodb://pengui:mafiluta@ds163119.mlab.com:63119/pompenguin');
let db = mongoose.connection;
mongoose.Promise = global.Promise; //da se izognemo opozorilom

//body-parser Middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    
    extended: true
  }));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.use(express.bodyParser({limit:'50mb'}));
//check connection
db.once('open', function(){
	console.log('Povezan z Mongo DB');
})

//check for db errors
db.on('error', function(err){
	console.log(err);
})

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//--------------------MODELS---------------
//pridobimo obliko modelov za objekte
var racetrack = require('./models/racetrack');
var penguin = require('./models/penguin');
//./models/penguin
//./models/section


//------------------ROUTERS----------------
//vsak objekt imas svoj router, ki omogoca delo z objektom
var racetrack = require('./routes/racetrackRouter');
app.use('/racetrack', racetrack);

var section = require('./routes/sectionRouter');
app.use('/section', section);

var penguin = require('./routes/penguinRouter');
app.use('/penguin', penguin);


//testni request
app.get('/', function(req, res){
	res.render("index.ejs");
})
app.get('/testProge', function(req, res){
	res.render("testProge.ejs");
})

const host = '0.0.0.0';
app.listen(process.env.PORT || 3000, function(){
	console.log("server started on Port 3000...");
})