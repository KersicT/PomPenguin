$(document).ready(function(){
//--------racetrack----------
	//get vse
   $("#vseProge").click(function(){
   	alert("asdas");
   	$.ajax({
	  url: "http://localhost:3000/racetrack",
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
   	var url = "http://localhost:3000/racetrack/"+ $('#izbranID').val();
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
   	var url = "http://localhost:3000/racetrack/"+ $('#izbranID').val();
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
   	var url = "http://localhost:3000/racetrack/generator/"+ $('#izbranaVelikost').val();
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
   	var url = "http://localhost:3000/racetrack/";
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
   	var url = "http://localhost:3000/racetrack/stOdsekov/"+ $('#izbranoStOdsekov').val();
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
   	var url = "http://localhost:3000/racetrack/"+ $('#izbranID').val() + "/" + $('#novoIme').val();
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
	  url: "http://localhost:3000/section",
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
   	var url = "http://localhost:3000/section/"+ $('#izbranIDOdsek').val();
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
   	var url = "http://localhost:3000/section/"+ $('#izbranIDOdsek').val();
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
   	var url = "http://localhost:3000/section/";
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
   	var url = "http://localhost:3000/section/sectionType/"+ $('#tipOdseka').val();
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
   	var url = "http://localhost:3000/section/"+ $('#izbranIDOdsek').val() + "/" + $('#noviTipOdseka').val();
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
   	var url = "http://localhost:3000/section/curvature/"+ $('#curvatureOdseka').val();
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
   	var url = "http://localhost:3000/section/baseLength/"+ $('#baseLengthOdseka').val();
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
	  url: "http://localhost:3000/penguin",
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
   	var url = "http://localhost:3000/penguin/"+ $('#izbranIDPin').val();
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
   	var url = "http://localhost:3000/penguin/"+ $('#izbranIDPin').val();
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
   	var url = "http://localhost:3000/penguin/generator";
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
   	var url = "http://localhost:3000/penguin/";
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
   	var url = "http://localhost:3000/penguin/"+ $('#izbranIDPin').val() + "/" + $('#newNamePin').val();
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
   	var url = "http://localhost:3000/penguin/ime/" + $('#imePin').val();
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



//--------------Sestavljen pingvin-------------------

	$("#pridobi_consPin").click( function(){

		var url = "http://localhost:3000/consPenguin/" + $('#izbranID_consPin').val();
		
	});




   $("#add_improv").click(function(){
   		//alert($("#select_improv_type").val() );

   		var url = "http://localhost:3000/improvement/";
   		var obj = JSON.parse('{ "name":"tmp_name", "terrain_based":"'+$("#select_improv_type").val()+'","improvement_value":"'+$("#input_improv_val").val()+'" }');
   		$.ajax({
   			url:url,
   			type:'POST',
   			context:document.body,
   			data:{
   				"name":obj.name,
   				"terrain_based":obj.terrain_based,
   				"improvement_value":obj.improvement_value
   			},
   			dataType:'json',
   			success: function(res)
	  		{
	  			$('#izpisImprov').html(JSON.stringify(res));
	 		},
	   		error: function (xhr, ajaxOptions, thrownError) {
       			$('#izpisImprov').html(xhr.status + " " + thrownError);
      		}
   		});

   });

   $("#pridobiImprov").click( function(){

		var url = "http://localhost:3000/improvement/" + $('#izbranID_improv').val();
		$.ajax({
			url:url,
			type:'GET',
			contex:document.body,
			success: function(res){
				$('#izpisImprov').html(JSON.stringify(res));
			},
			error: function (xhr, ajaxOptions, thrownError) {
       		 	$('#izpisImprov').html(xhr.status + " " + thrownError);
      		}
		});

	});

   $("#pridobiPin_forImprov").click(function(){
   	var url = "http://localhost:3000/penguin/"+ $('#izbranID_Pin_forImprov').val();
   	$.ajax({
	  url: url,
	  type: 'GET',
	  context: document.body,
	  success: function(res)
	  {
	  	$('#izpisPin_im').html(JSON.stringify(res));
	  },
	   error: function (xhr, ajaxOptions, thrownError) {
        $('#izpisPin_im').html(xhr.status + " " + thrownError);
      }
	})
   });

   $("#consPen").click(function(){

   		var improv_url = "http://localhost:3000/improvement/"+$('#izbranID_improv').val();
   		var improv_json;

   		$.ajax({
			url:improv_url,
			type:'GET',
			contex:document.body,
			success: function(res){
				
				improv_json = res;
				var url = "http://localhost:3000/consPenguin/";
				var ice = "null";
				var snow = "null";
				var water = "null";


				if(res.terrain_based=="ice"){
					ice=res._id;
				}else if (res.terrain_based=="snow") {
					snow=res._id;;
				}else if (res.terrain_based=="water"){
					water=res._id;
				}
				$.ajax({
					url: url,
					type: 'POST',
					context: document.body,
					data:{
						"penguin_id":$("#izbranID_Pin_forImprov").val(),
						"iceImprov_id":ice,
						"snowImprov_id":snow,
						"waterImprov_id":water
					},
					dataType: 'json',
					success: function(res){
						
						$('#izpis_consPin').html(JSON.stringify(res));
					},
					error:  function (xhr, ajaxOptions, thrownError) {
						
						$('#izpis_consPin').html(xhr.status + " " + thrownError);
					}

				});
				

			},
			error: function (xhr, ajaxOptions, thrownError) {
       		 	$('#izpisImprov').html(xhr.status + " " + thrownError);
      		}
		});


   });
   

});