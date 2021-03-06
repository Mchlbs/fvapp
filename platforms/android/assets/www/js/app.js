//var jsonData = '{"Meta":{"Tijd":1454517390,"TotaalBedrag":"374,00"},"Deelnemers":[{"naam":"Rianne Engels","toppen":"3","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Hans Blaauwendraat","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Tim Sterel","toppen":"3","gehaaldetoppen":"0","bedrag":"374,00"},{"naam":"Aletta Boer","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"}]}';

var BASE_URL = "http://fietsenvoor.nl/toppen/";
var SECURITY_KEY = "SDFEdfs";
var EDITION_ID = 5;

var newsInterval;
var scoreInterval;

function onPause() {

	clearInterval(newsInterval);
	clearInterval(scoreInterval);
}

function onResume() {

	setLoadNewsInterval();
	setLoadScoresInterval();
}

//getScores?ts=1231&ed=5

function loadScores() {

	doJSONP('onDataLoaded', 'getScores?ts=1231');
}

function reloadScores() {

	var iTimeStamp = 0;

	if (localStorage.getItem("lastScoreUpdate") > 0) {

		iTimeStamp = localStorage.getItem("lastScoreUpdate");
	}

	doJSONP('onScoresLoaded', 'getScores?ts=' + iTimeStamp);
}

function onScoresLoaded(jsonData) {

	//Oude interval clearen
	clearInterval(newsInterval);

	getScoreLijst(jsonData);

	//TimeStamp opslaan in de localstorage
	localStorage.setItem("lastScoresUpdate", jsonData.Meta['Tijd']);

	//alert(data.Meta);

	/** RELOAD UIT **/
	//setLoadScoresInterval();

	//console.log("hallo");
}

function setLoadScoresInterval(ms) {

	if (ms === undefined) {

		ms = 3000;
	}

	newsInterval = setInterval(reloadScores, ms );
}


function loadNews() {

	/** RELOAD UIT **/
	//Nieuwe interval starten
	//setLoadNewsInterval();

	doJSONP('onNewsLoaded', 'getNews?ts=0');
}

function reloadNews() {

	var iTimeStamp = 0;

	if (localStorage.getItem("lastNewsUpdate") > 0) {

		iTimeStamp = localStorage.getItem("lastNewsUpdate");
	}

	doJSONP('onNewsLoaded', 'getNews?ts=' + iTimeStamp);
}

function onNewsLoaded(jsonData) {

	//Oude interval clearen
	clearInterval(newsInterval);

	//HTML decoderen
	var decoded = $("<div/>").html(jsonData.HTML).text();

	//Nieuws laten zien
	$('#nieuws').html(decoded);

	//TimeStamp opslaan in de localstorage
	localStorage.setItem("lastNewsUpdate", jsonData.Meta['Tijd']);
}

function setLoadNewsInterval(ms) {

	if (ms === undefined) {

		ms = 10000;
	}

	newsInterval = setInterval(reloadNews, ms );
}

//Doe een JSONP-request
function doJSONP(sCallBack, sExtraGetString) {

	if (sExtraGetString.length > 5) {

		//var url = BASE_URL + '?key=' + SECURITY_KEY + '&callback=' + sCallBack + '&' + sExtraGetString;
		var url = BASE_URL + sExtraGetString + '&callback=' + sCallBack + '&ed=' + EDITION_ID;

		var head = document.head;
		var script = document.createElement("script");

		script.setAttribute("src", url);
		head.appendChild(script);
		head.removeChild(script);
	}
}

//Callback Function
function getScoreLijst(json)
{
	if(json !== undefined ) {

		$('#chart').html("").json2html(json, transforms.scorelijst);
	}
}

var transforms = {

	'scorelijst': [
		{ "tag" : "table",
			"data-role" : "table",
			"class" : "scoreList CSSTableGenerator ui-responsive",
			"children" : [
				{ "tag" : "thead",
					"children" : [
						{ "tag" : "tr",
							"children" : [
								{ "tag" : "th",
									"html" : "Naam"
								},
								{ "tag" : "th",
									"html" : "Doel"
								},
								{ "tag" : "th",
									"html" : "Gehaald"
								},
								{ "tag" : "th",
									"html" : "Bedrag"
								}
							]
						}
					]
				},
				{ "tag" : "tbody",
					"children" : function() { return(json2html.transform(this.Deelnemers,transforms.deelnemers)); }
				}
			]
		}
	],

	'deelnemers' : [
		{ "tag":"tr","class":"deelnemer","children":[
			{"tag":"td","class":"naam","html":"${naam}"},
			{"tag":"td","class":"toppen","html":"${toppen}"},
			{"tag":"td","class":"gehaaldetoppen","html":"${gehaaldetoppen}"},
			{"tag":"td","class":"bedrag","html":"${bedrag}"}
		]}
	]
};

/********************************************************************************
******************************* LAYOUT / UI *************************************
********************************************************************************/

function toggle(someID) {

	$(".screen").hide();
	$(".menu-button").removeClass('active');

	$("#" + someID).show();
	$("#button-" + someID).addClass('active');
}

/********************************************************************************
 ******************************* RSS READER *************************************
 ********************************************************************************/
