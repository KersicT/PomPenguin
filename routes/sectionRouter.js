var express    = require('express'); 
var router = express.Router();
var section = require('../models/section');
//pridobimo funkcijo za generiranje objekta
var sectionGenerator = require('../generators/sectionGenerator');

// Tadeja rabi ta generator da ji zgenerira progo
router.get('/generator/:mestoPrehoda', function(req, res) {
	var odsek = sectionGenerator.generirajOdsek(req.params.mestoPrehoda, 1,3, 180); // 
	res.render('testOdseka',{
		odsek:odsek,
	});
});


router.get('/', function(req, res){
	console.log("get /");

	section.find(function(err, p){
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

	section.findById(req.params.id ,function(err, p){
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
// test v postmanu Body->raw->JSON->{"name": "LevoSnegFilip69","sectionType": 1,"curvature": 69,"baseLength": 20,"incline": 30,"obstacleMatrix": []}
router.post('/', function(req, res)
{
	var p = new section(req.body);
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

//Zbrisi glede na id
router.delete('/:id', function(req,res){
	//preverimo ce obstaja
	section.findById(req.params.id, function(err, p){
		if(err)
		{
			console.log(req.params.id);
			res.status(500).send({error : err});
		}
		else if(!p){
			res.status(500).send({error : "Odsek ne obstaja"});
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
router.put('/:id/:tipOdseka', function(req, res){

	var tip = req.params.tipOdseka;
	var query = {'_id':req.params.id};
	section.findOneAndUpdate(query, {"sectionType": tip}, {upsert:true}, function(err, doc){
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

//vrni glede na ime odseka localhost:3000/section/ime/Filip
router.get('/name/:name', function(req, res){

	section.find({name:req.params.name},function(err, p){
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


router.get('/sectionType/:sectionType', function(req, res){

	section.find({sectionType:req.params.sectionType},function(err, p){
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

router.get('/curvature/:curvature', function(req, res){

	section.find({curvature:req.params.curvature},function(err, p){
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

router.get('/baseLength/:baseLength', function(req, res){

	section.find({baseLength:req.params.baseLength},function(err, p){
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