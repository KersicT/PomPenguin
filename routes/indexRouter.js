var express = require('express'); 
var router = express.Router();
var userModel = require('../models/userModel');
var penguin = require('../models/penguin');
var jwt = require('jsonwebtoken');
var consPenguin = require('../models/constructed_penguin');


router.get('/showPrijava',function(req,res,next){

	res.render('./user/prijava.ejs');
});

router.get('/showRegistracija',function(req,res,next){

	res.render('./user/registracija.ejs');
});

router.post('/prijava',function(req,res,next){

      userModel.authenticate(req.body.username, req.body.password, function (error, user) {
      if (!user) {
		res.json({message:'Wrong username or password'});      	
      }
      else if(error ){
      	console.log(error);
      	res.json({message:'Connection faled'});
      }else {
      	//seja
      	//req.session.userId = user._id;
      	//req.session.username = user.username;
      	//console.log("seja ob prijavi"+JSON.stringify( req.session));
		//res.json({message:'success'});
      	//jwt
      	jwt.sign({user: user}, 'mafiluta', {expiresIn: '2 days'}, (err, token) =>{
      		res.json({message:'success', token:token, user:user});
      	});

		
      }
    })

});

router.post('/registracija',function(req,res,next){


		//Preverimo ce email ali uporabnisko ime ze obstajata
		userModel.find(function(err, users){
			if(!users) //uporabnik z takim imenom se ne bostaja
			{
				console.log(err);
				return res.status(500).json({
	            	message: 'Error when creating user',
	                error: err
	            });
	
			}
			else
			{
				//preverimo da uporabik se ne obstaja
 				var usernameExist = false;
 				var emailExist = false;
 				for(var i = 0; i < users.length; i++)
 				{
 					if(users[i].email == req.body.email)
 					{
 						res.json({message:'You are already registred!'});
 						emailExist = true;
 						break;
 					}
 					if(users[i].username == req.body.username)
 					{
 						res.json({message:'Username is already taken!'});
 						usernameExist = true;
 						break;
 					}
 				}

 				//preverimo ali ima gelslo pod 48 zankov in nad 3
 				var primernoGelso = true
 				if(req.body.password.length > 58)
 				{
 					res.json({message:'Password must have less than 58 characters!'});
 					primernoGelso = false;
 				}
 				else if(req.body.password.length < 4)
 				{
 					res.json({message:'Password must have at least 4 characters!'});
 					primernoGelso = false;
 				}
 				if(usernameExist == false && emailExist == false && primernoGelso == true)
 				{


					penguin.find({"name": "Pingo"},function(err, pen){
					//console.log(pen[0]._id);
					if(err){
						console.log(err);
						res.status(500).send({
							err:err
						});
					}else{
						var kupljeni = [];
						kupljeni.push(pen[0]._id);
						var izboljsave = [];
						var leveli = ({
							snowLevel:0,
							iceLevel:0,
							waterLevel:0
						});
						izboljsave.push(leveli);
						var IdPingvina = pen[0]._id;
						var user = new userModel({
							email: req.body.email,
							username: req.body.username,
							password: req.body.password,
							coins: 1000,
							selectedPenguin_id: IdPingvina,
							selectedImprovements: leveli,
							boughtPenguins: kupljeni,
							boughtImprovements: izboljsave,
						});
						//console.log(user);
						user.save(function(err,user){
							if(err){
								console.log(err);
								return res.status(500).json({
					            	message: 'Error when creating user',
					                error: err
					            });
							}else{
								jwt.sign({user: user}, 'mafiluta', {expiresIn: '2 days'}, (err, token) =>{
						      		res.json({message:'success', token:token, user:user});
						      	});

							}

						});
					}

				});

			}

		}
	})


		

	

});

router.get('/getCurrentPenguin',function(req,res,next){

	console.log("GET CURRENT PENGUIN");
	var user;
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
	      	user = authData.user;
	      	//console.log("authData: "+JSON.stringify(authData));
	      	//poiscemo uporabnika	      
	      	userModel.findOne({_id: user._id}, function(err, currUser){

	      		//poiscemo pingvinva uporabnika
		      	penguin.findById(currUser.selectedPenguin_id,function(err, pen){
					if(err)
					{
						console.log(err);
						res.status(500).send({error: err})
					}
					else
					{
						console.log("pen: "+pen);
						res.json(pen);
					}		
				});
			       	
		      });
		  }
	    });
	}
});

router.post('/buyPenguin',function(req,res,next){

	var user;
	var penguinId = req.body.penguinId;
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
	      	//user iz tokena
	      	user = authData.user
	      	console.log(user);
	      	//poiscemo ouporabnika iz baze
	      	userModel.findOne({_id: user._id}, function(err, currUser){

	      		//preverimo ce pingvin ki ga dodajamo ni ze na seznamu kupljenih
				var niNaSeznamu = true;
				for(var i = 0; i < currUser.boughtPenguins.length; i++)
				{
					if(currUser.boughtPenguins[i] ==penguinId)
					{
						niNaSeznamu = false;
					}
				}

				if(niNaSeznamu == true) //dodamo samo ce ni na seznamu
				{
					//preverimo ce ima uporabnik dovolj denarja, najprej pridobimo ceno
		      		penguin.findById(penguinId,function(err, pen){
						if(err)
						{
							console.log(err);
							res.status(500).send({error: err})
						}
						else
						{
							//ceno odstejemo od uporabnikovega denarja
							console.log("ostanek denarja: "+currUser.coins +"-"+pen.penguinCost);
							if((currUser.coins - pen.penguinCost ) < 0)
							{
								res.json({message:"PremaloDenarja"});
							}
							else
							{


								currUser.coins = currUser.coins - pen.penguinCost;

								currUser.boughtPenguins.push(penguinId);
						      	currUser.boughtImprovements.push({
									snowLevel:0,
									iceLevel:0,
									waterLevel:0
								});
								currUser.selectedPenguin_id = penguinId;
								currUser.selectedImprovements = user.boughtImprovements[user.boughtImprovements.length-1];


						      	currUser.save(function(err, changedUser){
									if(err){
										console.log(err);
										return res.status(500).json({
							            	message: 'Error when creating user',
							                error: err
							            });
									}else{
								      	res.json({message:'success', changedUser:changedUser});
									}
								}); 


								

							}
		      	
					      	
						}		
					});
				}
				else
				{
					res.json({message:"PingvinJeZeBilKupljen"});
				}

	      		

	      	});
 	
	      }

	    });
	}

});

router.post('/selectPenguin',function(req,res,next){

	var user;
	var penguinId = req.body.penguinId;
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
	      		//console.log(currUser);
	      		//nastavimo novega current pingvina in njegove izboljsave
	      		currUser.selectedPenguin_id = penguinId;

	      		var index = 0;
	      		for(var i = 0; i < currUser.boughtPenguins.length; i++)
	      		{
	      			if(currUser.boughtPenguins[i] == penguinId)
	      			{
	      				index = i;
	      			}
	      		}
				currUser.selectedImprovements = currUser.boughtImprovements[index];
				console.log("SELECT PENGUIN");
				//console.log(penguinId  + " " + index + " " + JSON.stringify( currUser.selectedImprovements));
	      	
	      		currUser.save(function(err, changedUser){
					if(err){
						console.log(err);
						return res.status(500).json({
			            	message: 'Error when creating user',
			                error: err
			            });
					}else{
				      	res.json({message:'success', changedUser:changedUser});
					}
				}); 

	      	})

	      }

	    });
	}

});


router.post('/update',function(req,res,next){

	var user;
	var improvement = req.body.improvement;
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
	      		//procobimo uporabnika
	      		user = authData.user
		      	userModel.findOne({_id: user._id}, function(err, currUser){
		      	console.log(currUser);
		      	console.log("---------");

		      	var trenutniLevel;

		      		//dolocimo podateke o levelu in ceni
		      		if(improvement == "flippers")
		      		{
		      			trenutniLevel = currUser.selectedImprovements[0].waterLevel + 1;
		      		}
		      		else if( improvement == "skis")
		      		{
		      			trenutniLevel = currUser.selectedImprovements[0].snowLevel + 1;
		      		}
		      		else
		      		{
		      			trenutniLevel = currUser.selectedImprovements[0].iceLevel + 1;
		      		}

		      		//preverimo ce ima uporabnik dovolj denarja
		      		console.log("ostanek denarja: "+currUser.coins +"-"+trenutniLevel*100);
					if((currUser.coins - trenutniLevel*100) < 0)
					{
						res.json({message:"PremaloDenarja"});
					}
					else
					{
							currUser.coins = currUser.coins - trenutniLevel*100;
							//poiscemo index v vseh kupljenih izbljsavah
				      		var index;
				      		for(var i = 0; i <currUser.boughtImprovements.length; i++)
				      		{
				      			if(currUser.boughtPenguins[i] == currUser.selectedPenguin_id)
				      			{
				      				index = i;
				      			}
				      		}
				      		console.log("index:" + index);
				      		//console.log("improv: "+currUser.boughtImprovements[0].snowLevel);


				      		//current improvements, drugace ni shranjevalo
				      		console.log(currUser.selectedImprovements[0]);
				      		var currRun = currUser.selectedImprovements[0].snowLevel;
				      		var currSwim = currUser.selectedImprovements[0].waterLevel;
				      		var currSlide = currUser.selectedImprovements[0].iceLevel ;

				      		
							if(improvement == "flippers")//povecamo ustrenii level
				      		{
				      			currSwim++;
				      		}
				      		else if( improvement == "skis")
				      		{
				      			currRun++;
				      		}
				      		else
				      		{
				      			currSlide++;
				      		}

				      		currUser.selectedImprovements = [];
				      		currUser.selectedImprovements.push({
								snowLevel:currRun,
								iceLevel:currSlide,
								waterLevel:currSwim
							});

				      		//bought improvements
							console.log(currUser.boughtImprovements);
							var vse = currUser.boughtImprovements;
							currUser.boughtImprovements = [];

							

							for(var i = 0; i < vse.length; i++)
							{
								if(currUser.boughtPenguins[i] == currUser.selectedPenguin_id)
								{
									if(improvement == "flippers")//povecamo ustrenii level
						      		{
						      			vse[i].waterLevel++;
						      		}
						      		else if( improvement == "skis")
						      		{
						      			vse[i].snowLevel++;
						      		}
						      		else
						      		{
						      			vse[i].iceLevel++;
						      		}
								}
								currUser.boughtImprovements.push({
									snowLevel:vse[i].snowLevel,
									iceLevel:vse[i].iceLevel,
									waterLevel:vse[i].waterLevel,
								});
							}
				      		
							


				      		
				      		currUser.save(function(err, changedUser){
				      			console.log(changedUser);
								if(err){
									console.log(err);
									return res.status(500).json({
						            	message: 'Error when creating user',
						                error: err
						            });
								}else{
							      	res.json({message:'success', changedUser:changedUser});
								}
							}); 
					     
					}

		      		//pridobimo pingvina
		      		/*penguin.findById(currUser.selectedPenguin_id,function(err, pen){
						if(err)
						{
							console.log(err);
							res.status(500).send({error: err})
						}
						else
						{
							//preverimo ce ima uporabnik dovolj denarja
				      		console.log("ostanek denarja: "+currUser.coins +"-"+pen.penguinCost);
							if((currUser.coins - pen.penguinCost ) < 0)
							{
								res.json({message:"PremaloDenarja"});
							}
							else
							{

							}
						}
					});*/



		      		
		      	});
	      }

	    });
	}

});


router.post('/putUser',function(req,res,next){

	var user;
	const bearerHeader = req.headers['authorization'];

  	if(typeof bearerHeader !== 'undefined'){
    	const bearer = bearerHeader.split(' ');
    	const bearerToken = bearer[1];
    	req.token = bearerToken;

		jwt.verify(req.token, 'mafiluta',(err, authData) =>
	    {
	      if(err){
	        res.sendStatus(403);

	      }
	      else
	      {
	      	user = authData.user;
	       	console.log(req.body.username);
	      	userModel.findOne({_id: user._id}, function(err, currUser){
			      currUser.username =  req.body.username;
			      currUser.email =  req.body.email;

			     	currUser.save(function(err, changedUser){
				  		console.log(changedUser);
						if(err){
							console.log(err);
							return res.status(500).json({
					           	message: 'Error when creating user',
				                error: err
				            });

						}else{
							
							res.json({message:'success', changedUser:changedUser});
						}
					}); 
		    });
		    
		  }
	    });
	}

});



/*router.post('/selectPenguin',function(req,res,next){

	var user;
	var penguinId = req.body.penguinId;
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
	      		//koda
	      }

	    });
	}

});*/

module.exports=router;