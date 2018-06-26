var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var methodOverride = require('method-override');
//var expressValidator = require('expressValidator');

var app = express();

//za heroku
process.env.NODE_ENV = 'production';
var compression = require('compression'); 
app.use(compression()); //Compress all routes
var helmet = require('helmet');
app.use(helmet());
app.use(express.methodOverride());
//app.use(cors());

//CORS

var cors = require('cors');
var allowedOrigins = ['http://localhost:8100','http://localhost:3000',
                      'http://yourapp.com'];
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




//------------------ROUTERS----------------
//vsak objekt imas svoj router, ki omogoca delo z objektom
var indexRouter = require('./routes/indexRouter');
app.use('/',indexRouter);

var racetrack = require('./routes/racetrackRouter');
app.use('/racetrack', racetrack);

var section = require('./routes/sectionRouter');
app.use('/section',  section);

var penguin = require('./routes/penguinRouter');
app.use('/penguin', verifyToken, penguin);

var simulator = require('./routes/simulatorRouter');
app.use('/simulator', simulator);

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


app.listen(process.env.PORT || 3000, function(){
	console.log("server started on Port 3000...");
})