var penguin = require('../models/penguin');

console.log("klic generatorja");

function basicRandomINTGenerator(max){
	return Math.floor(Math.random() * Math.floor(max))+1;
}

function PrintPenguin(penguin,level){

	console.log('=========PENGUIN=========')
	console.log('=========Level:'+ level +'=========')
	console.log("Ime: "+penguin.name);
	console.log("Color: "+penguin.color);
	console.log("Base speed: "+penguin.baseSpeed);
	console.log("Tek: "+penguin.speed.run);
	console.log("Drsenje: "+penguin.speed.slide);
	console.log("Plavanje: "+penguin.speed.swim);
	console.log("Cena: "+penguin.penguinCost);
	console.log('=========================')

}

function GenerateBase(level){

	var base_Speed;
	var run;
	var swim;
	var slide;
	var cost;

	if(level == 1){
		base_Speed = 20;
		run = basicRandomINTGenerator(20);
		swim = basicRandomINTGenerator(20);
        slide = basicRandomINTGenerator(20);
        cost = 10;

	}else if(level == 2){
		base_Speed = 40;
		run = basicRandomINTGenerator(40);
		swim = basicRandomINTGenerator(40);
        slide = basicRandomINTGenerator(40);
        cost = 20;

	}else if(level == 3){
		base_Speed = 60;
		run = basicRandomINTGenerator(60);
		swim = basicRandomINTGenerator(60);
        slide = basicRandomINTGenerator(60);
        cost = 30;

	}else{
		console.log("napaka pri gen");
	}

	var p = new penguin({
		name: "base",
		color: "red",
		baseSpeed: base_Speed,
		speed:{
			run: run,
			slide: slide,
			swim: swim
		},
		penguinCost: cost
	});
	return p;
}

function CrossPenguins(one, two){

	var run;
	var swim;
	var slide;
	if(basicRandomINTGenerator(2) == 1){
		run=one.speed.run;
		swim=one.speed.swim;
		slide=two.speed.slide;

	}else{
		run=one.speed.run;
		swim=two.speed.swim;
		slide=two.speed.slide;
	}

	var p = new penguin({
		name: "crossed",
		color: "red",
		baseSpeed: one.baseSpeed,
		speed:{
			run: run,
			slide: slide,
			swim: swim
		},
		penguinCost: one.penguinCost
	});
	return p;
}

function MutatePenguin(good,bad){
	var num = basicRandomINTGenerator(3);
	var run;
	var swim;
	var slide;

	if(num == 1){
	run=good.speed.run;
	swim=bad.speed.swim;
	slide=good.speed.slide;

	}else if(num == 2){
	run=bad.speed.run;
	swim=good.speed.swim;
	slide=good.speed.slide;

	}else if(num == 3){
	run=good.speed.run;
	swim=good.speed.swim;
	slide=bad.speed.slide;
	}

	var p = new penguin({
		name: "mutated",
		color: "red",
		baseSpeed: good.baseSpeed,
		speed:{
			run: run,
			slide: slide,
			swim: swim
		},
		penguinCost: good.penguinCost
	});
	return p;

}

module.exports = {
	generatePenguine: function (level){

		var pen1;
		var pen2;
		var pen3;

		var maxLevel;

		if(level == 1){
			pen1 = GenerateBase(1);
			pen2 = GenerateBase(1);
			pen3 = GenerateBase(1);

			PrintPenguin(pen1,1);
			PrintPenguin(pen2,1);
			PrintPenguin(pen3,1);
			maxLevel=1;

		}else if(level == 2){
			pen1 = GenerateBase(2);
			pen2 = GenerateBase(2);
			pen3 = GenerateBase(1);

			PrintPenguin(pen1,2);
			PrintPenguin(pen2,2);
			PrintPenguin(pen3,1);
			maxLevel=2;

		}else if(level == 3){
			pen1 = GenerateBase(3);
			pen2 = GenerateBase(3);
			pen3 = GenerateBase(2);

			PrintPenguin(pen1,3);
			PrintPenguin(pen2,3);
			PrintPenguin(pen3,2);
			maxLevel=3;
		}


		var x = CrossPenguins(pen1,pen2);
		PrintPenguin(x,maxLevel);		

		x=MutatePenguin(pen1,pen3);
		PrintPenguin(x,maxLevel);		
		var error = x.validateSync();
		if(error)
		{
			return error
		}
		else
		{
			return x;
		}
	}
}

