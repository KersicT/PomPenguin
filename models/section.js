  let mongoose = require('mongoose');

  //shema za racetrack
  let sectionSchema = mongoose.Schema({   
	    "name":{
	        "type":"string",
	        "required":true
	    },
	    "sectionType":{
	        "type":Number,
	        "required":true
	    },
	    "curvature":{
	        "type":Number,
	        "required":true,
	        "minimum":0,
	        "maximum":360
	    },
	    "baseLength":{
	        "type":Number,
	        "required":true
	    },
	    "incline":{
	        "type":Number,
	        "required":true,
	        "minimum":-45,
	        "maximum":45
	    },
	    "obstacleMatrix": []

  });

  let section = module.exports = mongoose.model('section', sectionSchema);