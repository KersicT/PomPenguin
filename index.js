var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var methodOverride = require('method-override');
//var expressValidator = require('expressValidator');

var app = express();

//production mode - zaradi vernosti odstrani error pages and in sčisti logging
process.env.NODE_ENV = 'production';
var compression = require('compression'); // zmanjsa cas nalaganja
app.use(compression()); //Compress all routes
var helmet = require('helmet');
app.use(helmet());
//menjaj console z debug

//set header
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//baza
var mongoose = require('mongoose');
mongoose.connect('mongodb://penguin:mafiluta@ds163119.mlab.com:63119/pompenguin');
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