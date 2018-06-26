function izboljsave(cekini, livelia, hitrost, cikel)
{	
	var liveli=[];
	for(var i=0;i<livelia.length;i++){
		liveli=livelia[i];
		if(liveli.length == undefined){
			liveli=livelia;
		}
	}
	var vrni = [];
	if (cikel==3)
	{
		vrni = [-1,-1,-1];
		return vrni;
	}
	var minimum = Math.min(hitrost[0]+liveli[0], hitrost[1]+liveli[1], hitrost[2]+liveli[2]); // 0=sneg  1=voda  2=led
	if(minimum == hitrost[0]+liveli[0]){
		if(((liveli[0]+1)*100)>cekini){										//če nimamo zadosti cekinov
			cikel++;
			vrni = izboljsave(cekini, [99999,liveli[1],liveli[2]],hitrost, cikel);	//rekurzija in pogleda če je katera druga boljša
		}else{
			vrni = [liveli[0]+1,liveli[1],liveli[2]];
		}
	}else if(minimum == hitrost[1]+liveli[1]){
		if(((liveli[1]+1)*100)>cekini){										//če nimamo zadosti cekinov
			cikel++;
			vrni = izboljsave(cekini, [liveli[0],99999,liveli[2]],hitrost, cikel);	//rekurzija in pogleda če je katera druga boljša
		}else{
			vrni = [liveli[0],liveli[1]+1,liveli[2]];
		}
	}else if(minimum == hitrost[2]+liveli[2]){
		if(((liveli[2]+1)*100)>cekini){										//če nimamo zadosti cekinov
			cikel++;
			vrni = izboljsave(cekini, [liveli[0],liveli[1],99999],hitrost, cikel);	//rekurzija in pogleda če je katera druga boljša
		}else{
			vrni = [liveli[0],liveli[1],liveli[2]+1];
		}
	}
	return vrni;	//Vrnem livele
}

function minZaIzboljsavo(liveli,hitrost){
	var najmanjsi=0;
	if(liveli[0]+hitrost[0]<liveli[1]+hitrost[1]){
		if(liveli[0]+hitrost[0]<=liveli[2]+hitrost[2])
			najmanjsi=0;
		else
			najmanjsi=2;
	}else{
		if(liveli[1]+hitrost[1]<=liveli[2]+hitrost[2])
			najmanjsi=1;
		else
			najmanjsi=2;
	}
	return ((liveli[najmanjsi]+1)*100);

}
function boljsiPingvinLahkoKupim(cekini,vsiPingviniArray,najboljsi){
	var izbrani=-1;
	for (var i = najboljsi; i<vsiPingviniArray.length;i++){
		if(cekini > vsiPingviniArray[i].penguinCost){
			izbrani=i;
		}
	}
	return izbrani;
}

function razlika(trenutniLiveli,izboljsava){
	var razlike = [izboljsava[0]-trenutniLiveli[0],izboljsava[1]-trenutniLiveli[1],izboljsava[2]-trenutniLiveli[2]];
	var skupajCena=0;
	for(var i = 0;i<3;i++){
		for(var j=trenutniLiveli[i]+1;j<=izboljsava[i];j++){
			skupajCena += j*100;
		}
	}
	return skupajCena;
}

module.exports = {
	getHint: function (user, vsiPingvini){
		//-----------------------------INICIALIZACIJA-----------------------------//
		//console.log(user);
		//console.log(vsiPingvini);
		var kupljeniPingvini=[];
		var kupjeneIzboljsave=[];
		var vsiPingviniArray=[];
		var cekini = user.coins;
		var hitrost=[];
		for(var i = 0; i<user.boughtPenguins.length;i++){			//Vstavimo iz json elementov v array
			kupljeniPingvini.push(user.boughtPenguins[i]);
			kupjeneIzboljsave.push([user.boughtImprovements[i].snowLevel,user.boughtImprovements[i].waterLevel,user.boughtImprovements[i].iceLevel]);
		}
		for(var i = 0; i<vsiPingvini.length;i++){					//Vstavimo iz json elementov v array
			vsiPingviniArray.push(vsiPingvini[i]);
		}
		var najboljsi = 0;

		for(var i = 0; i<vsiPingviniArray.length;i++){				//Pingvini ki so že kupljeni premenimo v "Kupljeno"
			for(var j = 0; j<kupljeniPingvini.length;j++){
				if(kupljeniPingvini[j]+"" == vsiPingviniArray[i]._id+""){
					hitrost = [vsiPingviniArray[i].speed.run,vsiPingviniArray[i].speed.swim,vsiPingviniArray[i].speed.slide];
					
					vsiPingviniArray[i] = {kupljeno:"KUPLJENO"};
					najboljsi = i;
				}
			}
		}
		var trenutniLiveli=[];
		
		for(var i=0;i<kupjeneIzboljsave.length;i++){
			trenutniLiveli=kupjeneIzboljsave[i];
		}
		var izboljsava=[];
		izboljsava=trenutniLiveli;
		var cekiniPoIzboljsavi=cekini;
		var izbrani=0;
		var izhod = "";
		if(vsiPingviniArray[vsiPingviniArray.length-1].kupljeno=="KUPLJENO"){	//imamo najbolsega pingvina
			while(cekiniPoIzboljsavi>minZaIzboljsavo(izboljsava,hitrost)){
				var tmp = izboljsava;
				izboljsava=izboljsave(cekiniPoIzboljsavi,izboljsava,hitrost,0);
				cekiniPoIzboljsavi -= razlika(tmp,izboljsava);
			}	
			izhod += "Ker imaš že najboljšega pingvina ga le izboljšaj:\n-Sneg:"+izboljsava[0]+"x\n-Voda:"+izboljsava[1]+"x\n-Led:"+izboljsava[2]+"x";
		}else if((izbrani = boljsiPingvinLahkoKupim(cekini,vsiPingviniArray,najboljsi))>0){	//lahko kupimo boljsega pingvina
			cekiniPoIzboljsavi -= vsiPingviniArray[izbrani].penguinCost;
			izboljsava=[0,0,0];
			while(cekiniPoIzboljsavi>minZaIzboljsavo(izboljsava,hitrost)){
				var tmp = izboljsava;
				izboljsava=izboljsave(cekiniPoIzboljsavi,izboljsava,hitrost,0);
				cekiniPoIzboljsavi -= razlika(tmp,izboljsava);
			}
			izhod += "Ker lahko kupiš boljšega priporočamo da kupiš pingvina z imenom "+vsiPingviniArray[izbrani].name;
			if(izboljsava != [0,0,0]){
				izhod += "\n in izboljšaš:\n-Sneg:"+izboljsava[0]+"x\n-Voda:"+izboljsava[1]+"x\n-Led:"+izboljsava[2]+"x";
			}
		}else{																	//lahko le izbolšamo trenutnega pingvina
			while(cekiniPoIzboljsavi>minZaIzboljsavo(izboljsava,hitrost)){	
				var tmp = izboljsava;
				izboljsava=izboljsave(cekiniPoIzboljsavi,izboljsava,hitrost,0);
				cekiniPoIzboljsavi -= razlika(tmp,izboljsava);
			}	
			if(izboljsava==trenutniLiveli){
				izhod += "Nimaš zadosti cekinov za nadgradnjo.";
			}else{
				izhod += "Trenutno lahko le izboljšaš:\n-Sneg:"+izboljsava[0]+"x\n-Voda:"+izboljsava[1]+"x\n-Led:"+izboljsava[2]+"x";
				izhod += "\n\nIgraj več in kupi boljšega pingvina";
			}
		}
		console.log(izhod);
		return izhod;
	}
}

