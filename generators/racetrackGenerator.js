var racetrack = require('../models/racetrack');
var discipline = require('../baseInfo');
var sectionGenerator = require('../generators/sectionGenerator');

module.exports = {
	generirajProgo: function (stOdsekov, minZaporednih){

		//TO DO
		//tezavnosti
		//shranjevanje
		



		var name = "test";
		var time = Math.floor((Math.random() * 100) + 1); //random cas med sto in ena
		var sectionCounter = stOdsekov;
		var reward = Math.floor((Math.random() * 20) + 1);
		var tezavnost = 5;

		//console.log("minZaporednih: " + minZaporednih);

		var stZaporednih = 0; //stejemo koliko je zaporednih in jih dolocimo tako, da je zaporedoma vsaj minZaporednih
		//izberemo random tip za prvi odsek
		var tip = Math.floor(Math.random() * 3);
		var mestoVstopa = Math.floor(Math.random() * 3);

		//moznosti za ovinek
		var minZaporednihRavnih = 4;
		var curvature = [180, 90, -90];
		var ovinek = 180; //curvature za prvi odsek
		var stRavnih = 0;
		

		//progo napolnimo z odseki, tako da je med njimi proga
		var odseki = [];
		var odsek = sectionGenerator.generirajOdsek(mestoVstopa, tip,tezavnost, ovinek); //prvi odsek se zacne brez ovir na sredini
		stZaporednih++;
		stRavnih++;
		odseki.push(odsek);

		var randomZaporednih = Math.floor(Math.random() * 3) + minZaporednih;
		var randomDoOvinka = Math.floor(Math.random() * 2) + minZaporednihRavnih; //koliko minimalno ravnih odsekov je do ovinka

		for(var i = 1; i < sectionCounter; i++) //generiramo osatle odseke tako, da se se deli brez ovir povezujejo
		{	
			var dolzinaPrejsnjegaOdseka = odseki[i-1].obstacleMatrix.length;
			var sirinaMatrike = odseki[i-1].obstacleMatrix[dolzinaPrejsnjegaOdseka -1].length;
			var mestoPrehoda;
			var izbranNoviTip = false; //da preprecimo da bi bil ovinek takrat ko se menja podlaga

			//za tip
			for(var j = 0; j < sirinaMatrike; j++) //ugotovimo, kje v prejdnjem odseku se konca mesto brez ovir
			{
				if(odseki[i-1].obstacleMatrix[dolzinaPrejsnjegaOdseka -1][j] == 0)
				{
					mestoPrehoda = j;
				}
			}
			//izberemo random tip za odseke
			if(stZaporednih == randomZaporednih) // ce dosezomo mejo zaporednih enakih dolocimo nov tip in resetiramo stevec
			{
				stZaporednih = 0;
				randomZaporednih = Math.floor(Math.random() * 5) + minZaporednih;
				tip = Math.floor(Math.random() * 3);
				izbranNoviTip = true;
			}
			

			//za ovinek
			if(randomDoOvinka <= stRavnih)
			{
				if(izbranNoviTip == false)
				{
					var izbranOvinek = Math.floor(Math.random() * curvature.length-1) + 1; //brez - 1 + da blahko gre tudi ravno	
				}
				else
				{
					var izbranOvinek = 0;
				}
				
				stRavnih = 0;
				randomDoOvinka = Math.floor(Math.random() * 2) + minZaporednihRavnih;
			}
			else
			{
				var izbranOvinek = 0;
				stRavnih++;
			}
			
			//generiramo odsek
			//console.log(curvature[izbranOvinek] + " menjava tipa: " + izbranNoviTip);
			var odsek = sectionGenerator.generirajOdsek(mestoPrehoda, tip,tezavnost, curvature[izbranOvinek]); //generiramo nov odsek z izbranimmestom brez ovir
			stZaporednih++;
			odseki.push(odsek);
		}


		//progo razdelimo v skupine glede na barvo
		var skupine = []
		var trenutniTip = odseki[0].sectionType;
		var skupina = [];
		for(var i = 0; i < odseki.length; i++ )
		{
			if(trenutniTip == odseki[i].sectionType)
			{
				skupina.push(odseki[i]);
				if(i == odseki.length-1)
				{
					skupine.push(skupina);
					//console.log("zacetna: "+ skupina.length);
				}
			}
			else
			{
				skupine.push(skupina);
				//console.log("zacenta: "+ skupina.length);
				skupina = [];
				trenutniTip = odseki[i].sectionType;
				skupina.push(odseki[i]);
			}
		}

		//preveri, ce je na koncu premalo in jih prilagodi
		var koncniTip = odseki[odseki.length-1].sectionType;
		var stevecKoncnih = 0; //gremo od zadaj na prej in preverjamo tipe, ob tem pa stejemo odseke
		while(odseki[odseki.length-stevecKoncnih-1].sectionType == koncniTip && stevecKoncnih < odseki.length-1)
		{
			stevecKoncnih++;
		}
		//console.log("stKoncnih"+stevecKoncnih);
		if(stevecKoncnih < minZaporednih)
		{
			var zahtevanTip = odseki[odseki.length-1-stevecKoncnih].sectionType;
			for(var i = 0; i < stevecKoncnih; i++)
			{
				odseki[odseki.length-1-i].sectionType = zahtevanTip;
			}
		}

		//preveri ce obstajajo vsi tipi
		var najdeniTipi = [false,false, false];
		for(var i = 0; i < skupine.length; i++)
		{
			najdeniTipi[skupine[i][0].sectionType] = true;
		}
		//console.log(JSON.stringify(najdeniTipi));

		var nenajdeniTipi = [];
		for(var i = 0; i < 3; i++)
		{
			if(najdeniTipi[i] == false)
			{
				nenajdeniTipi.push(i);
			}
		}
		//console.log(JSON.stringify(nenajdeniTipi));
		if(nenajdeniTipi.length > 0) //ce tipi ne obstajajo
		{

			//poiscemo dovolj dolge odseke da vanj dodamo nenajden tip
			var dolgiOdseki = [];
			for(var i = 0; i < skupine.length; i++)
			{
				if(skupine[i].length >= 2*minZaporednih)
				{
					dolgiOdseki.push(i);
					//console.log("dolgi odseki" + i + " : "+ skupine[i].length)
				}
			}

			//poiscemo odseke, ki so dovolj dolgi da tja vrinemo odseke, ki jih nismo nasli
			if(nenajdeniTipi.length > 0) //ponovimo tolikokrat kolikor tipov nismo nasli
			{
				if( dolgiOdseki.length > 0)
				{
					var izbranDolgiOdsek = Math.floor(Math.random() * dolgiOdseki.length);
					for(var k = 0; k < minZaporednih; k++)
					{
						//console.log("prepsujem odsek" + dolgiOdseki[izbranDolgiOdsek] + " v tip" + nenajdeniTipi[0] +  "stdilgih odsekov " + dolgiOdseki.length);
						skupine[dolgiOdseki[izbranDolgiOdsek]][k].sectionType = nenajdeniTipi[0]; //vstavimo minimalno stevilo odseka, ki ga prej ni bilo
					}
					//console.log("ostale:" + (skupine[dolgiOdseki[izbranDolgiOdsek]].length - minZaporednih));
					if(skupine[dolgiOdseki[izbranDolgiOdsek]].length - minZaporednih >= 2*minZaporednih)
					{
						for(var k = 0; k < minZaporednih; k++)
						{
							//console.log("prepsujem odsek" + dolgiOdseki[izbranDolgiOdsek] + " v tip" + nenajdeniTipi[1] +  "stdilgih odsekov " + dolgiOdseki.length);
							skupine[dolgiOdseki[izbranDolgiOdsek]][k+minZaporednih].sectionType = nenajdeniTipi[1];
						}
					}
				}
			}

		}
		var trenutniTip = odseki[0].sectionType;
		var stevec = 0;
		for(var i = 0; i < odseki.length; i++ )
		{
			if(trenutniTip == odseki[i].sectionType)
			{
				stevec++;
				//skupina.push(odseki[i]);
				if(i == odseki.length-1)
				{
					//skupine.push(skupina);
					//console.log("koncna: "+ stevec);
				}
			}
			else
			{
				//console.log("koncna: "+ stevec);
				trenutniTip = odseki[i].sectionType;
				stevec = 0;
				stevec++;
			}
		}

		//izracunamo delez vsake podlage
		var stVodnihOdsekov = 0;
		var stSneznihOdsekov = 0;
		var stLedenihOdsekov = 0;
		for(var i= 0; i < odseki.length; i++)
		{
			if(odseki[i].sectionType == 0)
			{
				stSneznihOdsekov++;
			}
			else if(odseki[i].sectionType == 1)
			{
				stLedenihOdsekov++;
			}
			else
			{
				stVodnihOdsekov++;
			}
		}
		var stVseh = stSneznihOdsekov+stLedenihOdsekov+stVodnihOdsekov;
		var waterPercent =  Math.round(((stVodnihOdsekov / stVseh) * 100)*10) / 10;
		var snowPercent = Math.round(((stSneznihOdsekov / stVseh) * 100)*10) / 10;
		var icePercent = Math.round(((stLedenihOdsekov / stVseh) * 100)*10) / 10;

		console.log("water: "+waterPercent);
		console.log("snow:"+snowPercent);
		console.log("ice"+icePercent);
		//podatke shranimo v json
		generiranaProga = new racetrack({
			name: name,
		    time: time,
		    sectionCounter: sectionCounter,
		    reward: reward,
		    sectionArray: odseki,
		    waterPercent:waterPercent,
		    snowPercent:snowPercent,
		    icePercent:icePercent,
		});


		//vrnemo podatke ce so v skladu z modelom
		var error = generiranaProga.validateSync();
		if(error)
		{
			return error
		}
		else
		{
			return generiranaProga;
		}
		
	}
};

