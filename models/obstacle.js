  let mongoose = require('mongoose');

   let obstacleSchema = mongoose.Schema({
   		"name":{
            "type":"string",
            "required": true
        },
        "slowdown_factor":{
            "type":Number,
            "required": true,
            "minimum":1,
            "maximum":100 
        },
         "slowdown_time":{
            "type":Number,
            "required": true
        },
        "terrain_based":{
            "type":"string",
            "enum":["ice","snow","water"]
        }
	  
  });

  let obstacle = module.exports = mongoose.model('obstacle', obstacleSchema);