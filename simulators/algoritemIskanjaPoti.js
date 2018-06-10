var section = require('../models/section');

//class za vozlisca
		class Vozlisce {
			constructor(index, cena, zacetnaCena, predhodnik, vrstica, pozicijaVvrsti){
				this.index = index;
				this.cena = cena; //celotne poti do tega vozlisca
				this.zacetnaCena = zacetnaCena;
				this.predhodnik = predhodnik;
				this.vrstica = vrstica; //na katrem indekdu v grafu je vrstica
				this.pozicijaVvrsti = pozicijaVvrsti; // kje v vrsici je stalo polje
			}
		}

function dolociCeno(vsebina, level)
{
	if(level == 0)
	{
		if(vsebina == 2 )
		{
			return 1;
		}
		else
		{
			return 1;
		}
	}
	if(level == 1)
	{
		if(vsebina == 2 )
		{
			return 100;
		}
		else
		{
			return 1;
		}
	}
	if(level == 2)
	{
		if(vsebina == 2)
		{
			return 1000;
		}
		if(vsebina == 3)
		{
			return 2000;
		}
		if(vsebina == 4)
		{
			return 10;
		}
		if(vsebina == 5)
		{
			return 0;
		}
		else
		{
			return 30;
		}
	}
}


module.exports = {
	poisciPot: function (trenuntaPozicija, trenutniOdsek, naslednjiOdsek, tezavnost){
		
		//tezavnost // 0-gre skozi nekaj ovir // 1-ne gre skozi ovire //2- pobira powerupe
		var stevilaZaOvire = [2];

		console.log(JSON.stringify(trenutniOdsek));
		console.log(JSON.stringify(naslednjiOdsek));

		//pripravi vozlisca za algoritem iz obeh odsekov
		var graf = [];
		var stevec = 0;
		var stevecVrst = 0;
		for(var i = 0; i < trenutniOdsek.length; i++)
		{
			var vrstica = [];

			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(trenutniOdsek[i][0], tezavnost), null, stevecVrst, 0);
			vrstica.push(novoVozlisce);
			stevec++;
			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(trenutniOdsek[i][1], tezavnost), null, stevecVrst, 1);
			vrstica.push(novoVozlisce);
			stevec++;
			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(trenutniOdsek[i][2], tezavnost), null, stevecVrst, 2);
			vrstica.push(novoVozlisce);
			stevec++;

			graf.push(vrstica);
			stevecVrst++;
		}
		for(var i = 0; i < naslednjiOdsek.length; i++)
		{
			var vrstica = [];

			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(naslednjiOdsek[i][0], tezavnost), null, stevecVrst, 0);
			vrstica.push(novoVozlisce);
			stevec++;
			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(naslednjiOdsek[i][1], tezavnost), null, stevecVrst, 1);
			vrstica.push(novoVozlisce);
			stevec++;
			var novoVozlisce = new Vozlisce(stevec,0, dolociCeno(naslednjiOdsek[i][2], tezavnost), null, stevecVrst, 2);
			vrstica.push(novoVozlisce);
			stevec++;

			graf.push(vrstica);
			stevecVrst++;
		}
		var zacetnoStanje = graf[0][trenuntaPozicija];
		var koncnaStanja = [];
		var zadnjaVrsta = graf[graf.length - 1];
		for(var i = 0; i < zadnjaVrsta.length; i++) //zadnja vrsta so ciljna polja
		{
			koncnaStanja.push(zadnjaVrsta[i]); // i je 0 1 ali 2, zadnji 
		}

		//algoritem A*
		open = [zacetnoStanje];
		closed = [];
		while(1)
		{
			//ce je open prazen pomeni da resitve ni mogoce najti
			if(open.length == 0)
			{
				return null;
			}
			//izberemo najbolj desno vozlisce iz open
			var vozlisceVObdelavi = open.pop();
			//console.log("razvijam:" + JSON.stringify(vozlisceVObdelavi));
			//peverimo ve je vozlisce ki ga obdelujemo resitev
			for(var i = 0; i < koncnaStanja.length; i++)
			{
				if(vozlisceVObdelavi == koncnaStanja[i])
				{

					//vrnemo najdeno pot
					var path =	[];
					var nasprotnaSmer = [];
					var v = [vozlisceVObdelavi.vrstica, vozlisceVObdelavi.pozicijaVvrsti];
					nasprotnaSmer.push(v);
					var predhodnik = graf[vozlisceVObdelavi.vrstica -1][vozlisceVObdelavi.predhodnik];
					for(var i = graf.length-1; i > 1; i--)
					{
						var v = [predhodnik.vrstica, predhodnik.pozicijaVvrsti];
						nasprotnaSmer.push(v);
						var predhodnik = graf[predhodnik.vrstica -1][predhodnik.predhodnik];
					
					}
					path.push([0,trenuntaPozicija]);
					var dolzina = nasprotnaSmer.length;
					for(var j = 0; j < dolzina; j++)
					{
						var naslednji = nasprotnaSmer.pop();
						path.push(naslednji);
					}

					return [path, vozlisceVObdelavi.cena];
					//return [path,nasprotnaSmer, vozlisceVObdelavi.cena];
				}
			}
			//ce ni resitev ga dodamo v closed in ga razvijemo
			closed.push(vozlisceVObdelavi);

			/*var istaVrsta = graf[vozlisceVObdelavi.vrstica];
			var naslednjaVrsta = graf[vozlisceVObdelavi.vrstica+1];
			var mozniNaslednjiki = [];

			if(vozlisceVObdelavi.pozicijaVvrsti == 0)
			{
				//v naslednji vrstici
				naslednjaVrsta[0].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				//console.log( vrsticaZaRazvoj[i].zacetnaCena + " + " + vozlisceVObdelavi.cena)
				naslednjaVrsta[0].cena = naslednjaVrsta[0].zacetnaCena + vozlisceVObdelavi.cena;
				
				mozniNaslednjiki.push(naslednjaVrsta[0]);

				//v isti vrstici
				istaVrsta[1].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				istaVrsta[1].cena = istaVrsta[1].zacetnaCena + vozlisceVObdelavi.cena;
				mozniNaslednjiki.push(istaVrsta[1]);
			}
			if(vozlisceVObdelavi.pozicijaVvrsti == 1)
			{
				//v naslednji vrstici
				naslednjaVrsta[1].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				//console.log( vrsticaZaRazvoj[i].zacetnaCena + " + " + vozlisceVObdelavi.cena)
				naslednjaVrsta[1].cena = naslednjaVrsta[1].zacetnaCena + vozlisceVObdelavi.cena;
				
				mozniNaslednjiki.push(naslednjaVrsta[1]);

				//v isti vrstici
				istaVrsta[0].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				istaVrsta[0].cena = istaVrsta[0].zacetnaCena + vozlisceVObdelavi.cena;
				mozniNaslednjiki.push(istaVrsta[0]);

				istaVrsta[2].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				istaVrsta[2].cena = istaVrsta[2].zacetnaCena + vozlisceVObdelavi.cena;
				mozniNaslednjiki.push(istaVrsta[2]);
			}
			if(vozlisceVObdelavi.pozicijaVvrsti == 2)
			{
				//v naslednji vrstici
				naslednjaVrsta[2].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				//console.log( vrsticaZaRazvoj[i].zacetnaCena + " + " + vozlisceVObdelavi.cena)
				naslednjaVrsta[2].cena = naslednjaVrsta[2].zacetnaCena + vozlisceVObdelavi.cena;
				
				mozniNaslednjiki.push(naslednjaVrsta[2]);

				//v isti vrstici
				istaVrsta[1].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				istaVrsta[1].cena = istaVrsta[1].zacetnaCena + vozlisceVObdelavi.cena;
				mozniNaslednjiki.push(istaVrsta[1]);
			}*/

			var preskociPrvega = 0;
			var preskociZadnjega = 0;
			if(vozlisceVObdelavi.pozicijaVvrsti == 0) // iz 0 ce moremo na polje 3 v naslednjem koraku
			{
				preskociZadnjega = 1;
			}
			if(vozlisceVObdelavi.pozicijaVvrsti == 2) // iz 2 ne moremo v polje 0 v naslednjem koraku
			{
				preskociPrvega = 1;
			}
			var vrsticaZaRazvoj = graf[vozlisceVObdelavi.vrstica+1];
			var istaVrstica = graf[vozlisceVObdelavi.vrstica];
			var mozniNaslednjiki = [];
			for(var i = 0 + preskociPrvega; i < vrsticaZaRazvoj.length - preskociZadnjega; i++)
			{
				vrsticaZaRazvoj[i].predhodnik = vozlisceVObdelavi.pozicijaVvrsti;
				//console.log( vrsticaZaRazvoj[i].zacetnaCena + " + " + vozlisceVObdelavi.cena)
				vrsticaZaRazvoj[i].cena = vrsticaZaRazvoj[i].zacetnaCena + vozlisceVObdelavi.cena;
				//pristejemo ceno ce gremo skozi oviro ob menjavi proge
				if(vozlisceVObdelavi.pozicijaVvrsti != i)
				{
					vrsticaZaRazvoj[i].cena = vrsticaZaRazvoj[i].cena + istaVrstica[i].zacetnaCena;
				}
				
				mozniNaslednjiki.push(vrsticaZaRazvoj[i]);
			}


			//foreach stavek za vse mozne Naslednike
			for(var i = 0; i < mozniNaslednjiki.length; i++)
			{
				//preverimo ve moznega naskednjika najdemo v open ali closed
				var indexVopen = null;
				for(var j = 0; j < open.length; j++)
				{
					if(mozniNaslednjiki[i].index == open[j].index)
					{
						indexVopen = j;
					}
				}
				var indexVclosed = null;
				for(var j = 0; j < closed.length; j++)
				{
					if(mozniNaslednjiki[i].index == closed[j].index)
					{
						indexVclosed = j;
					}
				}

				//ce ni v open in ni v closed ga dodam v open
				if(indexVopen == null && indexVclosed == null)
				{
					open.push(mozniNaslednjiki[i]);
				}
				// ce je v open preverimo ce smo nasli krajso pot, ce smo mu mejamo ceno in predhodnika
				else if(indexVopen != null)
				{
					if(open[indexVopen].cena > mozniNaslednjiki[i].cena)
					{
						open[indexVopen] = mozniNaslednjiki[i];
					}
					/*else if(open[indexVopen].cena == mozniNaslednjiki[i].cena)
					{
						var menjaj =  Math.floor(Math.random() * 2);
						if(menjaj)
						{
							open[indexVopen] = mozniNaslednjiki[i];
						}
					}*/
				}
				else if(indexVclosed != null)
				{
					if(closed[indexVclosed] > mozniNaslednjiki[i])
					{
						closed[indexVclosed] = mozniNaslednjiki[i];
					}
					/*else if(closed[indexVclosed] == mozniNaslednjiki[i])
					{
						var menjaj =  Math.floor(Math.random() * 2);
						if(menjaj)
						{
							closed[indexVclosed] = mozniNaslednjiki[i];
						}
					}*/
				}
			}
			
			//uredimo open po ceni
			var len = open.length,
		    min;

		    for (i=0; i < len; i++){

		        //set minimum to this position
		        min = i;

		        //check the rest of the array to see if anything is smaller
		        for (j=i+1; j < len; j++){
		            if (open[j].cena > open[min].cena){
		                min = j;
		            }
		        }

		        //if the minimum isn't in the position, swap it
		        if (i != min){
		            var tmp = open[i];
		            open[i] = open[min];
		            open[min] = tmp;
		        }
		    }
		}
	}
};