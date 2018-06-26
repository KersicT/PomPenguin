var express = require('express'); 
var router = express.Router();
var pathSimulator = require('../simulators/algoritemIskanjaPoti.js');
var racetrack = require('../models/racetrack');
var improvement = require('../models/improvement');
var penguin = require('../models/penguin');
var statistika = require('../models/statistics.js');
var simulator = require('../simulators/simulator.js');
var sestavljeniPingvin = require('../models/constructed_penguin');
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var getHint = require('../simulators/hint');

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




	
	var user;
	var penguinId = req.params.idPingvina;
	const bearerHeader = req.headers['authorization'];

  	//preverimo ce bearer is udefined
  	if(typeof bearerHeader !== 'undefined'){
    	const bearer = bearerHeader.split(' '); //Barrer <accest token>
    	const bearerToken = bearer[1];
    	req.token = bearerToken;

		jwt.verify(req.token, 'mafiluta',(err, authData) =>
	    {
	      if(err){
	        res.sendStatus(403);

	      }
	      else
	      {
	      		user = authData.user
		      	userModel.findOne({_id: user._id}, function(err, currUser){

		      		console.log(currUser);
		      		//preverimo ce id pingvina med kupljenimi
		      		var uporabikJeLastnik = false;
		      		for(var i = 0; i < currUser.boughtPenguins.length; i++)
		      		{
		      			if(penguinId == currUser.boughtPenguins[i])
		      			{
		      				uporabikJeLastnik = true;
		      			}
		      		}

		      		if(uporabikJeLastnik == true)
		      		{


						//pridobimo pingvina
						penguin.findById(req.params.idPingvina, function(err, ping){
							if(err){
								res.status(500).send({error: err})
							}else{
								baseHitrost = ping.baseSpeed;
								sneg = ping.speed.run;
								led = ping.speed.slide;
								voda = ping.speed.swim;
							}
						}).then(function(){
								racetrack.findById(req.params.idProge ,function(err,proga){
									if(err)
									{
										res.status(500).send({error: err})
									}
									else
									{
										var skupaj = [sneg*baseHitrost+currUser.selectedImprovements[0].snowLevel,voda*baseHitrost+currUser.selectedImprovements[0].waterLevel,led*baseHitrost+currUser.selectedImprovements[0].iceLevel];
										var rezultat = simulator.simulator(proga,skupaj,req.params.tezavnost,req.params.idPingvina,req.params.idProge);
										console.log("Novi cekini:"+rezultat.skupniCekini);

										currUser.coins = currUser.coins + rezultat.skupniCekini;
										//shranimo cenike uporabnika
										currUser.save(function(err, changedUser){
											if(err){
												console.log(err);
												return res.status(500).json({
									            	message: 'Error when saving new coins user',
									                error: err
									            });
											}else{

												//rezultat shranimo v statistiko
												
												var idp = proga._id;
												var np = proga.name;
												var idu = currUser.id;
												var nameu =currUser.username;
												
												var newStatistic = new statistika({
													time:rezultat.skupniCasProge,
													racetrack_id:idp,
													racetrackname:np,
													user_id:idu,
													username:nameu,
												});
												
												//console.log(newStatistic);
												var error = newStatistic.validateSync();
												
												newStatistic.save(function(err, statistika)
												{
													if(err)
													{
														console.log(err);
														res.status(500).send({error: err})
													}
													else
													{
														console.log(statistika);
														//vrnemo podatke o simulirani igri
										      			res.json({message:'success', rezultat:rezultat, changedUser:changedUser});
													}
												});

												
											}
										}); 

										
									}
								})
							})

					}
					else
					{
						res.json({message:"uporabikNiLastnik"});
						console.log("Zavrnjen pingvin:" + penguinId);
					}
				});
	      	}

	    });
	}

	
})

router.get('/getStatistics',  function(req, res) {

	var vsaStatistika = [];
	//pridobi vse proge
	racetrack.find(async function(err, proge){
		if(err)
		{
			res.status(500).send({error: err})
		}
		else
		{
			for(var i = 0; i < proge.length; i++)
			{
				//console.log(proge[i]._id);
				var imeProge = proge[i].name;
				await statistika.find({"racetrack_id":proge[i]._id},function(err, stat){
					if(err)
					{
						res.status(500).send({error: err})
					}
					else
					{
						//uredimo statistiko po casu
						
						for(var i = 0; i < stat.length-1; i++)
						{
							//console.log(stat[i].time);
							var min = i;
							for(var j = i+1; j < stat.length; j++)
							{
								if(stat[min].time > stat[j].time)
								{
									min = j;
								}
							}
							if(min != i)
							{
								var tmp = stat[i];
								stat[i] = stat[min];
								stat[min] = tmp;
							}
						}

						//pustimo samo 10 najboljsih podatkov iz statistike
						while(stat.length > 7)
						{
							stat.pop();
						}
						console.log("---------------");
						console.log(imeProge);
						console.log(stat);

						//vrnemo podatke
						vsaStatistika.push({
							stat:stat,
							name:imeProge,
						});
						//console.log(stat);
					}
				});
			}
			//console.log(vsaStatistika);
			res.json(vsaStatistika);
		}
	});

});

router.get('/getHint', function(req, res){
	console.log("klic /getHint");
	const bearerHeader = req.headers['authorization'];
		if(typeof bearerHeader !== 'undefined'){
	    	const bearer = bearerHeader.split(' '); //Barrer <accest token>
	    	const bearerToken = bearer[1];
	    	req.token = bearerToken;

			jwt.verify(req.token, 'mafiluta',(err, authData) =>
		    {
		      if(err){
		        res.sendStatus(403);
		        console.log("Uporabnik ni prijavljen");
		      }
		      else
		      {
		      		var user = authData.user
			      	userModel.findOne({_id: user._id}, function(err, currUser)
			      	{
			      		

			      		//pridobimo vse pingvine
			      		penguin.find( function(err, vsiPingvini){
							if(err){
								res.status(500).send({error: err})
								console.log(err);
							}else{
								//console.log(currUser); //trenutni uporabnik
								//console.log(vsiPingvini); //vsi pingvini

								var rezultat = getHint.getHint(currUser, vsiPingvini);
								res.json(rezultat);
							}
						})

			      	});
			  }
			})
		}
		else
		{
			res.sendStatus(403);
			console.log("Uporabnik ni prijavljen");
		}

})

module.exports=router;

