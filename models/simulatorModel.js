  let mongoose = require('mongoose');

   let simulatorSchema = mongoose.Schema({
   		"hitrost":{
            "type":Number,
            "required": true
        },
        "id_sestavljenegaPingvina":{
            "type":"string",
            "required": true
        },
         "id_proge":{
            "type":"string",
            "required": true
        },
        "stOdseka":{
            "type":Number,
            "required": true
        }
	  
  });

  let simulatorMod = module.exports = mongoose.model('simulatorMod', simulatorSchema);