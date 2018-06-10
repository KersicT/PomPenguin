var express = require('express'); 
var router = express.Router();
var pathSimulator = require('../simulators/algoritemIskanjaPoti.js');
var racetrack = require('../models/racetrack');
var improvement = require('../models/improvement');
var penguin = require('../models/penguin');
var simulator = require('../simulators/simulator.js');
var sestavljeniPingvin = require('../models/constructed_penguin');


router.get('/getPath', function(req, res) {
	//pridobi prva dva odseka proge
	racetrack.findById('5b055e6b14839c1d2069d9c5' ,function(err, p){
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			var odsekTrenutni=p.sectionArray[0].obstacleMatrix;
			var odsekNaslednji=p.sectionArray[1].obstacleMatrix;
			var path = pathSimulator.poisciPot(2, odsekTrenutni, odsekNaslednji,2);
			res.json(path);
		}
	});

	
})

router.get('/:idProge/:idPingvina/:tezavnost', function(req, res) {
	//var sestavljeniPingvinObjekt = new sestavljeniPingvin(res.body);
	//pridobi prva dva odseka proge
		//pridobimo sestavljenega pingvina
		var hitrost;
		var baseHitrost;
		var sneg;
		var led;
		var voda;
		var snegIzb;
		var ledIzb;
		var vodaIzb;

	sestavljeniPingvin.findById(req.params.idPingvina, function(err, sPing){
		if(err){
			res.status(500).send({error: err})
		}else{
			//pridobimo pingvina
			penguin.findById(sPing.penguin_id, function(err, ping){
				if(err){
					res.status(500).send({error: err})
				}else{
					baseHitrost = ping.baseSpeed;
					sneg = ping.speed.run;
					led = ping.speed.slide;
					voda = ping.speed.swim;
				}
			}).then(function(){

				improvement.findById(sPing.iceImprov_id, function(err,ice){
					if(err){
						res.status(500).send({error: err})
					}else{

						ledIzb = ice.improvement_value;
						led = baseHitrost*led;
						led = led + led*ledIzb;
					}
				}).then(function(){
					improvement.findById(sPing.snowImprov_id, function(err,snow){
						if(err){
						res.status(500).send({error: err})
						}else{
							snegIzb = snow.improvement_value;
							sneg = baseHitrost*sneg;
							sneg = sneg + sneg*snegIzb;
						}
					})
				}).then(function(){
					improvement.findById(sPing.waterImprov_id, function(err,water){
						if(err){
						res.status(500).send({error: err})
						}else{
							vodaIzb = water.improvement_value;
							voda = baseHitrost*voda;
							voda = voda + voda*vodaIzb;
						}
					})
				}).then(function(){
					racetrack.findById(req.params.idProge ,function(err,p){
						if(err)
						{
							res.status(500).send({error: err})
						}
						else
						{
							var skupaj = [sneg,voda,led];
							var rezultat = simulator.simulator(p,skupaj,req.params.tezavnost,req.params.idPingvina,req.params.idProge);
							res.json(rezultat);
						}
					})
				})
			});
		}	
	});
})

module.exports=router;

