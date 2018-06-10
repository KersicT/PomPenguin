var section = require('../models/section');
var info = require('../baseInfo');

 var discipline = { // prestavi v base info
 	sneg: 0,
 	led: 1,
 	voda: 2
}


module.exports = {
	generirajOdsek: function (mestoVstopa, tipOdseka, tezavnost, kotOvinka){
		var name = "test";
		var sectionType = tipOdseka;
		var baseLength = 20; 				//----------basic. bo treba še dodat da dobim podatek
		var curvature = kotOvinka;

		//doloci stevilo ovir
		var stOvir = tezavnost*4;
		//var stOvir = stOvir + tezavnost;

		//naklon proge
		if(tipOdseka == 0)
		{
			var incline = 0;
		}
		else if(tipOdseka == 1)
		{
			var incline = -25;
		}
		else if(tipOdseka == 2)
		{
			var incline = 0;
		}
		

		//matrika odseka
		var matrix = []; // 0 = prazno 1 = moznost ovire 2 = ovira

		//da ima prva vrstica prehod tam kjer to zahteva generator proge.
		var prvaVrsta = []; 
		var izbranoPojePrehoda = j;
		for(var j = 0; j < 3; j++)
		{
			if(j == mestoVstopa)
			{
				prvaVrsta.push(0);
				
				izbranoPojePrehoda = j;

			}
			else
			{
				prvaVrsta.push(1);
			}
		}
		matrix.push([prvaVrsta[0],prvaVrsta[1],prvaVrsta[2]]);
		

		//ZAČETEK GENERATORJA
		for(var i = 1; i < baseLength; i++) 
		{
			var polja = [];

			var tezavnostOdseka = tezavnost;
			if(tezavnostOdseka == 0){				// če je težavnost 0 (kar pomeni tuttorial) je realno 0,5 da pride občasno do zavoja
				tezavnostOdseka = 0.5;			
			}

			var delnaDolzina = baseLength;

			if(baseLength>20){
				delnaDolzina = 20;
			}

			var stZaporednikKock = Math.floor((delnaDolzina/(tezavnostOdseka+1))-(tezavnostOdseka/4)); //stevilo kock ki se pojavijo zapovrstjo
			var zavojnoPolje = izbranoPojePrehoda;
				//prvo stevilo skupnih kock
				//zavoj
				//drugo stevilo skupnih kock
			for(var k = 0; k<stZaporednikKock; k++){
				if(i+k >= baseLength){
					break;
				}
				polja = [];
				//console.log(k);
				//console.log(stZaporednikKock-1);
				if(k==(stZaporednikKock-1)){	//ko smo v zadnjem polju pred ovinkom
					zavojnoPolje = Math.floor(Math.random() * 3);
					for(var j = 0; j < 3; j++)
					{		
						var zavoj_ali_ravno = Math.floor(Math.random()*100);	//izbere ali gremo ravno/zavoj z možnostjo 0,25/0,75(ravno/zavoj)
						if(zavoj_ali_ravno >= 75){
							zavoj_ali_ravno = 0;
						}else{
							zavoj_ali_ravno = 1;
						}				
						if(zavojnoPolje == izbranoPojePrehoda-2)
						{
							//console.log(zavojnoPolje);
							zavojnoPolje = zavojnoPolje + zavoj_ali_ravno;  // izbrano polje = 2, zavojno polje = 0 -> zavojno polje = 1 ali 2
						}
						if(zavojnoPolje == izbranoPojePrehoda+2)
						{
							//console.log(zavojnoPolje);
							zavojnoPolje = zavojnoPolje - zavoj_ali_ravno;  // izbrano polje = 0, zavojno polje = 2 -> zavojno polje = 0 ali 1
						}


						if(j == izbranoPojePrehoda || j == zavojnoPolje)
						{
							if(j == izbranoPojePrehoda && j == zavojnoPolje)
							{
								polja.push(0);

								continue;
							}else{
								if(j == zavojnoPolje)
								{
									polja.push(0);
									continue;
								}else{
									polja.push(0);
								}	
							}
						}
						else
						{
							polja.push(1);
						}
					}
				}else{
					for(var j = 0; j < 3; j++)
					{
						if(j == izbranoPojePrehoda)
						{
							polja.push(0);
						}
						else
						{
							polja.push(1);
						}
					}
				}
				matrix.push([polja[0],polja[1],polja[2]]);	
			}
			izbranoPojePrehoda = zavojnoPolje; 			// nastavimo za na zavoj, zato da se naslednjič začne na pravem mestu
			i = i+stZaporednikKock-1;									// i-ju dodamo vrednost k-ja zato da ne gremo čez dolžino odseka
		}


		//TUKAJ POSTAVLJAŠ OVIRE KJER JE V MATRIKI DOLOČENO Z 
		//poisci indekse z vrednostjo 1
		var poljeMoznihPowerUp = [];
		var poljaMoznihOvir = [];
		var poljeMoznihCekinov = [];
		for(var i = 0; i < matrix.length; i++)
		{
			//ZA OVIRE
			if(matrix[i][0] == 1)
			{
				var index = [];
				index.push(i);
				index.push(0);
				poljaMoznihOvir.push(index);
			}
			if(matrix[i][1] == 1)
			{
				var index = [];
				index.push(i);
				index.push(1);
				poljaMoznihOvir.push(index);
			}
			if(matrix[i][2] == 1)
			{
				var index = [];
				index.push(i);
				index.push(2);
				poljaMoznihOvir.push(index);
			}

			// ZA CEKINE
			if(i < matrix.length-2 && matrix[i][0] == 0 && matrix[i+1][0] == 0 && matrix[i+2][0] == 0)
			{
				var indexa = [];
				indexa.push(i);
				indexa.push(0);
				poljeMoznihCekinov.push(indexa);
			}
			if(i < matrix.length-2 && matrix[i][1] == 0 && matrix[i+1][1] == 0 && matrix[i+2][1] == 0)
			{
				var indexa = [];
				indexa.push(i);
				indexa.push(1);
				poljeMoznihCekinov.push(indexa);
			}
			if(i < matrix.length-2 && matrix[i][2] == 0 && matrix[i+1][2] == 0 && matrix[i+2][2] == 0)
			{
				var indexa = [];
				indexa.push(i);
				indexa.push(2);
				poljeMoznihCekinov.push(indexa);
			}
			if(i % 4 == 0 && i < matrix.length - 3){				
				if(matrix[i][0] == 0)
				{
					var indexb = [];
					indexb.push(i);
					indexb.push(0);
					poljeMoznihPowerUp.push(indexb);
				}
				if(matrix[i][1] == 0)
				{
					var indexb = [];
					indexb.push(i);
					indexb.push(1);
					poljeMoznihPowerUp.push(indexb);
				}
				if(matrix[i][2] == 0)
				{
					var indexb = [];
					indexb.push(i);
					indexb.push(2);
					poljeMoznihPowerUp.push(indexb);
				}				
			}
		}
		for(var i = 0; i < 3; i++)
		{
			if(poljeMoznihCekinov.length > 0){
				var izbranoPoljea = Math.floor(Math.random() * poljeMoznihCekinov.length);
				var y = poljeMoznihCekinov[izbranoPoljea][0]; //pridmo na zacetno mesto kje v matriki bomo posatvili cekine
				var x = poljeMoznihCekinov[izbranoPoljea][1];

				for(var j = 0; j < 3; j++)
				{
					matrix[y+j][x] = 4;
				}
				poljeMoznihCekinov.splice(izbranoPoljea, 1);
			}
		}

		//ZA POWERUP (Le en bo na približno 2 odseka)
		var izbraniZaPowerup = Math.floor(Math.random() * poljeMoznihPowerUp.length);
		if((Math.random()*100)> 25)
		{
			var y = poljeMoznihPowerUp[izbraniZaPowerup][0];
			var x = poljeMoznihPowerUp[izbraniZaPowerup][1];
			matrix[y][x] = 5;
		}


		var stOvir3 = Math.floor((Math.random()*stOvir*2) / tezavnostOdseka);


		// med polji moznih ovir izberi polja za ovire
		for(var i = 0; i < stOvir; i++)
		{
			if(poljaMoznihOvir.length > 0)
			{
				var izbranoPolje = Math.floor(Math.random() * poljaMoznihOvir.length);
				var y = poljaMoznihOvir[izbranoPolje][0]; //pridmo mesto kje v matriki bomo posatvili oviro
				var x = poljaMoznihOvir[izbranoPolje][1];

				if(stOvir3 > 0 && Math.floor(Math.random()*100) > 50)
				{
					matrix[y][x] = 3;
					poljaMoznihOvir.splice(izbranoPolje, 1);
					stOvir3--;
				}else{
					matrix[y][x] = 2;
					poljaMoznihOvir.splice(izbranoPolje, 1);
				}			
			}
		}


		
		//vrnemo generiran odsek
		generiranOdsek = new section({
			name:name,
	    	sectionType:sectionType,
		    curvature:curvature,
		    baseLength:baseLength,
		    incline:incline,
	    	obstacleMatrix: matrix,
		});
		return generiranOdsek;
	}
};
