var section = require('./algoritemIskanjaPoti.js');
var simulatorModel = require('../models/simulatorModel.js');

function casPolja(tipPolja,hitrost,fizicnaDolzinaEnegaPolja, cekini)
{
	if(tipPolja == 0 || tipPolja == 1 || tipPolja == 4){
		if(tipPolja == 4)
		{
			cekini.vsota++;
			console.log("Cekini: "+cekini.vsota);
		}
		return fizicnaDolzinaEnegaPolja/hitrost;
	}


	if(tipPolja == 2){
		return (fizicnaDolzinaEnegaPolja/hitrost)*1.5;
	}

	if(tipPolja == 3){
		return (fizicnaDolzinaEnegaPolja/hitrost)*3;
	}

	if(tipPolja == 5){
		return (fizicnaDolzinaEnegaPolja/hitrost)*0.7;
	}
}

module.exports = {
	simulator: function (proga, sestavljenPingvin, tezavnost, idPingvina, idProge){
		
		var cekini = ({
			vsota: 0,
		});
		var trenutnaPozicija;
		var vmesniCasi=[];
		var vmesniCekini=[];
		var vmesniTipiPodlage=[];
		var skupniCasProge=0;
		sestevekCasov = 0;
		for(var i = 0; i<proga.sectionCounter;i++)
		{
			var odsekPrvi = proga.sectionArray[i];
			var odsekDrugi;
			if(i == proga.sectionCounter-1){
				odsekDrugi = proga.sectionArray[i];
			}else{
				odsekDrugi = proga.sectionArray[i+1];
			}
			
			if(i == 0){
				var polje = odsekPrvi.obstacleMatrix;;
				var zacetnaVrstica = polje[0];
				if(zacetnaVrstica[0] == "0"){
					trenutnaPozicija = 0;
				}else{
					if(zacetnaVrstica[1] == "0"){
						trenutnaPozicija = 1;
					}else{
						trenutnaPozicija = 2;
					}
				}
			}
			var UiPotTmp = section.poisciPot(trenutnaPozicija,odsekPrvi.obstacleMatrix,odsekDrugi.obstacleMatrix, tezavnost);

			//kocka matrike je dolga 5m
			//Trenutno dobi pingvin hitrost hardcodano, ko filip dokonča spremeni v apiju za simulator iz null, na kar koli pač bo

			//DODAJ DA BEREŠ HITROSTI PINGVINA
			//težavnost tudi spremeni
			var hSneg = sestavljenPingvin[0];	// 5m/s
			var hVoda = sestavljenPingvin[1];	// 8m/s
			var hLed = sestavljenPingvin[2];	// 8m/s
			var hitrost = [hSneg,hVoda,hLed];
			
			var UiPot = UiPotTmp[0];
			var skupniCasOdseka = 0;
			var vrsticaPrva;
			var vrsticaDruga;
			for(var j = 0; j<((UiPot.length)/2)-1;j++){
				//Tu dejansko bereš in računaš čase
				var vrstica = UiPot[j];
				vrsticaPrva = odsekPrvi.obstacleMatrix[j];
				vrsticaDruga = odsekPrvi.obstacleMatrix[j+1];
				skupniCasOdseka = skupniCasOdseka + casPolja(vrsticaPrva[vrstica[1]],hitrost[odsekPrvi.sectionType],3, cekini);	//base length za polje je 3
				
			}
			sestevekCasov = Math.round( (sestevekCasov + skupniCasOdseka)*100 ) / 100;

			vmesniCasi.push(sestevekCasov);
			var vsota = cekini.vsota;
			vmesniCekini.push(vsota);
			console.log(vmesniCasi);
			vmesniTipiPodlage.push(odsekPrvi.sectionType);

			skupniCasProge = skupniCasProge + skupniCasOdseka;
			var tmpa = (UiPot.length)/2;
			var tmp = UiPot[tmpa];
			trenutnaPozicija = tmp[1];

			var test = new simulatorModel({
				hitrost: skupniCasOdseka,
				id_sestavljenegaPingvina: idPingvina,
				id_proge: idProge,
				stOdseka: i
			});
			console.log(i);

			//test.save(function(err, p){});




		}	
		skupniCasProge =  Math.round( skupniCasProge*100 ) / 100;
		var rezultat = {
			vmesniCasi: vmesniCasi,
			skupniCasProge: skupniCasProge,
			vmesniCekini: vmesniCekini,
			skupniCekini: cekini.vsota,
			vmesniTipiPodlage: vmesniTipiPodlage,
		};
		return rezultat;
	}
}
