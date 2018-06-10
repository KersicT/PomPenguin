  let mongoose = require('mongoose');

   let powerupSchema = mongoose.Schema({
   		"name":{
            "type":"string",
            "required": true
        },
      "slowup_factor":{
            "type":Number,
            "required": true,
            "minimum":1,
            "maximum":100 
        },
      "slowup_time":{
            "type":Number,
            "required": true
        }
	  
  });

  let powerup = module.exports = mongoose.model('powerup', powerupSchema);