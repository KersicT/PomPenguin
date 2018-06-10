  let mongoose = require('mongoose');

   let improvementSchema = mongoose.Schema({
   		"name":{
            "type":"string",
            "required": true
        },
        "terrain_based":{
            "type":"string",
            "enum":["ice","snow","water"]
        },
        "improvement_value":{
            "type":Number,
            "required": true,
        }
	  
  });

  let improvement = module.exports = mongoose.model('improvement', improvementSchema);