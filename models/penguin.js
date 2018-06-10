  let mongoose = require('mongoose');

   let penguinSchema = mongoose.Schema({
   		"name":{
            "type":"string",
            "required": true
        },
        "color":{
            "type":"string",
            "required": true
        },
        "baseSpeed":{
            "type": Number,
            "required":true        
        },
        "speed":{
            "run":{
                "type": Number,
                "required":true,
                "minimum":0,
                "maximum":100
            },
            "slide":{
                "type": Number,
                "required":true,
                "minimum":0,
                "maximum":100
            },
            "swim":{
                "type": Number,
                "required":true,
            	"minimum":0,
	        	"maximum":100	
            } 
        },
        "penguinCost":{
            "type": Number,
            "required":true
        },
	
  });

  let penguin = module.exports = mongoose.model('penguin', penguinSchema);