  let mongoose = require('mongoose');

   let statisticShema = mongoose.Schema({
   		"time":{
            "type":Number,
            "required": true
        },
        "racetrack_id":{
            "type":String,
            "required": true,
        },
        "racetrackname":{
          "type":String,
          "required": true,
        },
         "user_id":{
            "type":String,
            "required": true
        },
        "username":{
            "type":String,
            "required": true
        },
  });

  let obstacle = module.exports = mongoose.model('statistic', statisticShema);