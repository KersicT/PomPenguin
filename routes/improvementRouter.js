var express = require('express'); 
var router = express.Router();
var improvement = require('../models/improvement.js');

router.post('/', function(req, res)
{
	var improv = new improvement(req.body);
	var error = improv.validateSync();

	improv.save(function(err, p)
	{
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			res.json(improv);
		}
	})

});

router.get('/',function(req,res){

	improvement.find(function(err,imp){
		if(err){
			res.status(500).send({error: err})
		}else {
			res.json(imp);
		}
	});
});


router.get('/:id', function(req,res){

	improvement.findById(req.params.id, function(err,p){

		if(err){
			res.status(500).send({error: err});
		}else{
			res.json(p);
		}

	});

});


module.exports=router;
