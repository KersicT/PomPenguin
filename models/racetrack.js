  let mongoose = require('mongoose');

  //shema za racetrack
  let racetrackSchema = mongoose.Schema({
	    "name":{
	        "type":"string",
	        "required":true
	    },
	    "time":{
	        "type": Number,
	        "required":true,
	        "minimum":0,
	        "maximum":2400
	    },
	    "sectionCounter":{
	        "type":Number,
	        "required":true
	    },
	    "reward":{
	        "type":Number,
	        "required":true
	    },
	    "sectionArray": [] //shrani id-je odsekov
	
  });

  let racetrack = module.exports = mongoose.model('racetrack', racetrackSchema);