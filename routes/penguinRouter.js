var express = require('express'); 
var router = express.Router();
var penguin = require('../models/penguin');
var penguinGenerator = require('../generators/penguinGenerator');
var parser = require('../parsers/namesParser');

router.get('/testniVnos', function(req, res) {
	
	var test = new penguin({
		name: 'Penguin1',
	    color:'red',
	    baseSpeed: 100,
		speed:{
			run:20,
			slide:30,
			swim:20
		},
		penguinCost: 300
	});

	var error = test.validateSync();

	test.save(function(err, p)
	{
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			res.json(test);
		}
	});

});

///////////////////////

//vrni generiranega
router.get('/generator/:level', function(req, res){
	var penguin = penguinGenerator.generatePenguine(req.params.level);
	res.json(penguin);
});


////////////////////////

//vrni parsana imena
router.get('/names', function(req, res)
{
	parser.getPenguins(function(names){
		return res.send(names);
	});
});

//vrni parsana imena raket
router.get('/rockets', function(req, res)
{
	parser.getRockets(function(rockets){
		return res.send(rockets);
	});
});


/////////////////////


//vrni vse 
router.get('/', function(req, res){

	penguin.find(function(err, p){
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

router.get('/:id', function(req, res){

	penguin.findById(req.params.id ,function(err, p){
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


router.post('/', function(req, res)
{
	var p = new penguin(req.body);
	var error = p.validateSync();

	p.save(function(err, p)
	{
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			res.json(p);
		}
	})

});

router.delete('/:id', function(req,res){
	//preverimo ce obstaja
	penguin.findById(req.params.id, function(err, p){
		if(err)
		{
			console.log(req.params.id);
			res.status(500).send({error : err});
		}
		else if(!p){
			res.status(500).send({error : "Pingvin ne obstaja"});
		}
		else
		{
			p.remove(function(err)
			{
				if(err)
				{
					res.status(500).send({error : err});
				}
				else
				{
					res.json({msg:"OK"});
				}
			})
		}
	});
});
router.put('/:id/:newName', function(req, res){

	var n = req.params.newName;
	var query = {'_id':req.params.id};
	penguin.findOneAndUpdate(query, {"name": n}, {upsert:true}, function(err, doc){
    if (err) 
    {
    	return res.send(500, { error: err });
    }
    else
    {
    	 return res.send("succesfully saved");	
    }
	   
	});
});



module.exports=router;