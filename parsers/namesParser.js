 //parsanje imen
var cheerio = require('cheerio');
const Https = require("https");
const Iconv = require("iconv-lite");

//imena pingvinov
var url = "https://www.ranker.com/list/list-of-penguin-characters/reference";
module.exports.getPenguins = function(callback)
{
	//pridobivanje spletne strani
	Https.get(url, function (res) {
	  	// dekodiranje streama
	  	res.pipe(Iconv.decodeStream("utf8")).collect(function (error, html) {
	        
	  		//parsanje z cheerio
	        var $ = cheerio.load(html);

	        //gremo skozi se najdene znacke z izbranim classom
	        var pengiunArray = [];
			$('.listItem__title').each(function(){
				var imePingvina = $(this).text();

				//odstranimo oklepaj, ce je v imenu
				var delImena = imePingvina.split('(');
				imePingvina = delImena[0];

				//imena prepisemo v array
				if(imePingvina != "")
				{
					pengiunArray.push(imePingvina);
				}
			});

			var penguinJSON = JSON.stringify(pengiunArray);

	        return callback(penguinJSON);
	    })

	})
};


//imena raket
var url_rockets = "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki/List_of_United_States_rockets.html";
module.exports.getRockets = function(callback)
{
	//pridobivanje spletne strani
	Https.get(url_rockets, function (res) {
	  	// dekodiranje streama
	  	res.pipe(Iconv.decodeStream("utf8")).collect(function (error, html) {
	        
	  		//parsanje z cheerio
	        var $ = cheerio.load(html);
	        
	        var rocketsArray = [];
	        
			$('.multicol li').each(function(){
				
				var rname = $(this).text();
				var partName = rname.split("(");

				rname = partName[0];
				
				if(rname != "")
					rocketsArray.push(rname);

			});

			var rocketJSON = JSON.stringify(rocketsArray);

	        return callback(rocketJSON);
	    })

	})
};


//imena prog

var ulr_raceTrack = "https://www.ranker.com/list/lighthouses-in-north-carolina/jennifer-lee";
module.exports.getRaceTracks = function(callback)
{
	//pridobivanje spletne strani
	Https.get(ulr_raceTrack, function (res) {
	  	// dekodiranje streama
	  	res.pipe(Iconv.decodeStream("utf8")).collect(function (error, html) {
	        
	  		//parsanje z cheerio
	        var $ = cheerio.load(html);

	        //gremo skozi se najdene znacke z izbranim classom
	        var raceTrackArray = [];
			$('.listItem__title').each(function(){
				var imeProge = $(this).text();

				//odstranimo oklepaj, ce je v imenu
				var delImenaProge = imeProge.split('Light');
				imeProge = delImenaProge[0];

				//imena prepisemo v array
				if(imeProge != "")
				{
					raceTrackArray.push(imeProge);
				}
			});

			var raceTrackJSON = JSON.stringify(raceTrackArray);

	        return callback(raceTrackJSON);
	    })

	})
};
