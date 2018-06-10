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


app.use(express.methodOverride());
app.use(cors());

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//JWT
var jwt = require('jsonwebtoken');
app.post('/api/posts',verifyToken, (req, res) =>{
  
      res.json({
        message:"zascitena stran",
      })
  
  
})

function verifyToken(req, res, next){
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  //preverimo ce bearer is udefined
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' '); //Barrer <accest token>
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, 'mafiluta',(err, authData) =>
    {
      if(err){
        res.sendStatus(403);
      }
      else
      {
        next();
      }
    });
  }
  else
  {
    //forbidden
    res.sendStatus(403);
  }
}

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
var indexRouter = require('./routes/indexRouter');
app.use('/',indexRouter);

var racetrack = require('./routes/racetrackRouter');
app.use('/racetrack',verifyToken, racetrack);

var section = require('./routes/sectionRouter');
app.use('/section',  section);

var penguin = require('./routes/penguinRouter');
app.use('/penguin', verifyToken, penguin);


var simulator = require('./routes/simulatorRouter');
app.use('/simulator',verifyToken, simulator);

var improvement = require('./routes/improvementRouter');
app.use('/improvement',verifyToken, improvement);

var consPenguin = require('./routes/consPenguinRouter');
app.use('/consPenguin',verifyToken, consPenguin);

//testni request
app.get('/', function(req, res){
	res.render("index.ejs");
})
app.get('/testProge', function(req, res){
	res.render("testProge.ejs");
})

app.get('/testSimulator', function(req, res){
    res.render("testSimulator.ejs");
})

const host = '0.0.0.0';
app.listen(process.env.PORT || 3000, function(){
	console.log("server started on Port 3000...");
})