var express = require('express'); 
var router = express.Router();
var consPenguin = require('../models/constructed_penguin');


router.post('/',function(req,res){

	var cp = new consPenguin(req.body);
	var error = cp.validateSync();

	cp.save(function(err,o){

		if(err){
			res.status(500).send({error: err})
		}else{
			res.json(o);
		}

	});

});

router.get('/:id', function(req,res){

	consPenguin.findById(req.params.id, function(err,p){

		if(err){
			res.status(500).send({error: err});
		}else{
			res.json(p);
		}

	});

});

router.get('/', function(req, res){

	consPenguin.find(function(err, p){
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			res.json(p);
		}
	});
});

module.exports=router;