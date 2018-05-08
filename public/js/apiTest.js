$(document).ready(function(){
//--------racetrack----------
	var PageUrl = "https://agile-island-71770.herokuapp.com"

   $("#vseProge").click(function(){
   	$.ajax({
	  url: PageUrl + "/racetrack",
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
	})
   });

   //get by id
   $("#pridobiProgo").click(function(){
   	var url = PageUrl+"/racetrack/"+ $('#izbranID').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });

	//delete by id
	$("#zbrisiProgo").click(function(){
   	var url = PageUrl+"/racetrack/"+ $('#izbranID').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'DELETE',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });

	//generiraj
	$("#generirajProgo").click(function(){
   	var url = PageUrl+"/racetrack/generator/"+ $('#izbranaVelikost').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });

	// vstavi generirano
	$("#vstaviProgo").click(function(){
   	var url = PageUrl+"/racetrack/";
   	var objekt = JSON.parse($('#izbranaProga').val());
   	$.ajax({
	  url: url,
	  type: 'POST',
	  context: document.body,
	  data: {
        "name": objekt.name,
        "time":objekt.time,
        "sectionCounter":objekt.sectionCounter, 
        "reward":objekt.reward
	  },
	  dataType: 'json',
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });

	//najdi po st odsekov
	$("#PoisciPoOdsekih").click(function(){
   	var url = PageUrl+"/racetrack/stOdsekov/"+ $('#izbranoStOdsekov').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });

	//put za povsodabljanje glede na id
	$("#povsodobiProgo").click(function(){
   	var url = PageUrl+"/racetrack/"+ $('#izbranID').val() + "/" + $('#novoIme').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'PUT',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpis').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpis').html(xhr.status + " " + thrownError);
      }
	})
   });



//--------section----------

	//get vse
   $("#vsiOdseki").click(function(){
   	$.ajax({
	  url: PageUrl+"/section",
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
	})
   });

   //get by id
   $("#pridobiOdsek").click(function(){
   	var url = PageUrl+"/section/"+ $('#izbranIDOdsek').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

	//delete by id
	$("#zbrisiOdsek").click(function(){
   	var url = PageUrl+"/section/"+ $('#izbranIDOdsek').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'DELETE',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

	// vstavi 
	$("#vstaviOdsek").click(function(){
   	var url = PageUrl+"/section/";
   	var objekt = JSON.parse($('#vstaviOdsekJson').val());
   	//alert($('#vstaviOdsekJson').val());
   	$.ajax({
	  url: url,
	  type: 'POST',
	  context: document.body,
	  data: {
	  	"name": objekt.name,
	  	"sectionType": objekt.sectionType,
	  	"curvature": objekt.curvature,
	  	"baseLength": objekt.baseLength,
	  	"incline": objekt.incline,
	  	"obstacleMatrix": objekt.obstacleMatrix
	  },
	  dataType: 'json',
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

	//najdi po tipu odseka
	$("#PoisciPoTipuOdseka").click(function(){
   	var url = PageUrl+"/section/sectionType/"+ $('#tipOdseka').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

	//put za povsodabljanje glede na id
	$("#posodobiTipOdsek").click(function(){
   	var url = PageUrl+"/section/"+ $('#izbranIDOdsek').val() + "/" + $('#noviTipOdseka').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'PUT',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

	$("#PoisciPoCurvatureOdseka").click(function(){
   	var url = PageUrl+"/section/curvature/"+ $('#curvatureOdseka').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });


	$("#PoisciPoBaseLengthOdseka").click(function(){
   	var url = PageUrl+"/section/baseLength/"+ $('#baseLengthOdseka').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisOdseka').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisOdseka').html(xhr.status + " " + thrownError);
      }
	})
   });

//--------------penguin-------------------

	$("#vsiPin").click(function(){
   	$.ajax({
	  url: PageUrl+"/penguin",
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }
	})
   });

   //get by id
   $("#pridobiPin").click(function(){
   	var url = PageUrl+"/penguin/"+ $('#izbranIDPin').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });

	//delete by id
	$("#zbrisiPin").click(function(){
   	var url = PageUrl+"/penguin/"+ $('#izbranIDPin').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'DELETE',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });

	//generiraj
	$("#genPin").click(function(){
   	var url = PageUrl+"/penguin/generator";
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });

	// vstavi generirano
	$("#vstaviPin").click(function(){
   	var url = PageUrl+"/penguin/";
   	var objekt = JSON.parse($('#izbranPin').val());
   	$.ajax({
	  url: url,
	  type: 'POST',
	  context: document.body,
	  data: {
        "name": objekt.name,
        "color":objekt.color,
        "baseSpeed":objekt.baseSpeed, 
        "speed":{
			"run": objekt.speed.run,
			"slide": objekt.speed.slide,
			"swim": objekt.speed.swim
		},
		"penguinCost": objekt.penguinCost
		},

	  dataType: 'json',
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });


	//put za povsodabljanje glede na id
	$("#povsodobiPinName").click(function(){
   	var url = PageUrl+"/penguin/"+ $('#izbranIDPin').val() + "/" + $('#newNamePin').val();
   	//alert(url);
   	$.ajax({
	  url: url,
	  type: 'PUT',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });

	$("#PoisciPoImenuPin").click(function(){
   	var url = PageUrl+"/penguin/ime/" + $('#imePin').val();
   	//alert(izbranID);
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin').html(xhr.status + " " + thrownError);
      }
	})
   });

});