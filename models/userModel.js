var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	'email':String,
	'username':String,
	'password':String,
  'coins': Number,
  'selectedPenguin_id': String,
  'selectedImprovements': Array,
  'boughtPenguins': Array,
  'boughtImprovements': Array,
});

userSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username }).exec(function (err, user) {

      if (err) {
      	console.log(err);
        return callback(err)
     
      } else if (!user) {

        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
     
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {

          return callback(null, user);

        } else {

          return callback();
        
        }
      });
    });
}

userSchema.pre('save', function (next) {
  var user = this;
  if(user.password.length < 40)
  {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
      	console.log(err);
       	return next(err);
     }
     user.password = hash;
     next();
    });
  }
  else
  {
    next();
  }
});

var User = mongoose.model('User', userSchema);
module.exports = User;