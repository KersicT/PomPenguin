var express    = require('express'); 
var router = express.Router();
//pridobimo obliko modelov za objekte
var racetrack = require('../models/racetrack');
//pridobimo funkcijo za generiranje objekta
var racetrackGenerator = require('../generators/racetrackGenerator');
var  jsonSize = require ('json-size');
var parser = require('../parsers/namesParser');

router.get('/testniVnos', function(req, res) {
	
	var odseki = [];
	odseki.push(1);
	odseki.push(2);
	odseki.push(3);

	var testnaProga = new racetrack({
		name: 'Proga2',
	    time:5,
	    sectionCounter:10,
	    reward:30,
	    sectionArray: odseki
	});

	var error = testnaProga.validateSync();
	//res.json(error);

	//shranjevanje v bazo
	testnaProga.save(function(err, p)
	{

		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			res.json(testnaProga);
		}
	});

});

////////////////////////////////////////
//Parser za proge
//vrni parsana imena
router.get('/names', function(req, res)
{
	parser.getRaceTracks(function(names){
		return res.send(names);
	});
});

///////////////////////////////////////

//vrni generiranega
router.get('/generator/:stOdsekov', function(req, res){
	var proga = racetrackGenerator.generirajProgo(req.params.stOdsekov, 2);
	res.json(proga);

});

//vrni vse 
router.get('/', function(req, res){

	racetrack.find(function(err, p){
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

//vrni glede na id // test v postman GET: http://localhost:3000/racetrack/?id=1
router.get('/:id', function(req, res){

	racetrack.findById(req.params.id ,function(err, p){
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

//ustvari // na vhodu pricakujemo json objekt v obliki racetrack
// test v postmanu Body->raw->{"name": "Proga2","time":5,"sectionCounter":10, "reward":30}
router.post('/', function(req, res)
{
	//alert(req.body);
	console.log("velikost" + jsonSize(req.body));
	var p = new racetrack(req.body);
	var error = p.validateSync();

	console.log(p);

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
	racetrack.findById(req.params.id, function(err, p){
		if(err)
		{
			console.log(req.params.id);
			res.status(500).send({error : err});
		}
		else if(!p){
			res.status(500).send({error : "Proga ne obstaja"});
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

//put povsodobi glede na id
router.put('/:id/:novoIme', function(req, res){

	var ime = req.params.novoIme;
	var query = {'_id':req.params.id};
	racetrack.findOneAndUpdate(query, {"name": ime}, {upsert:true}, function(err, doc){
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

//vrni pos stevilu odsekov //http://localhost:3000/racetrack/stOdsekov/30
router.get('/stOdsekov/:stevilo', function(req, res){

	racetrack.find({sectionCounter:req.params.stevilo},function(err, p){
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


//mongoose poizvedbe
//http://mongoosejs.com/docs/queries.html

module.exports=router;