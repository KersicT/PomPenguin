  let mongoose = require('mongoose');

   let constructed_penguinSchema = mongoose.Schema({

        "penguin_id":{
            "type":"string",
            "required":true
        },
	     "iceImprov_id":{
            "type":"string",
            "required":true
        },
        "snowImprov_id":{
            "type":"string",
            "required":true
        },
        "waterImprov_id":{
            "type":"string",
            "required":true
        }
        
  });

  let constructed_penguin = module.exports = mongoose.model('constructed_penguin', constructed_penguinSchema);