//var jsonData = '{"Meta":{"Tijd":1454517390,"TotaalBedrag":"374,00"},"Deelnemers":[{"naam":"Rianne Engels","toppen":"3","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Hans Blaauwendraat","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Tim Sterel","toppen":"3","gehaaldetoppen":"0","bedrag":"374,00"},{"naam":"Aletta Boer","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"}]}';

var BASE_URL = "http://fietsenvoor.nl/toppen";
var SECURITY_KEY = "SDFEdfs";
var EDITION_ID = 5;

var newsInterval;
var scoreInterval;

function onPause()
{

	clearInterval(newsInterval);
	clearInterval(scoreInterval);
}

function onResume()
{

	setLoadNewsInterval();
	setLoadScoresInterval();
}

//getScores?ts=1231&ed=5

function loadScores()
{

	doJSONP('onScoresLoaded', '');
}

function reloadScores()
{

//	var iTimeStamp = 0;
//
//	if (localStorage.getItem("lastScoreUpdate") > 0) {
//
//		iTimeStamp = localStorage.getItem("lastScoreUpdate");
//	}

	doJSONP('onScoresLoaded', '');
}

function onScoresLoaded(jsonData)
{

	//Oude interval clearen
	clearInterval(newsInterval);

	//getScoreLijst(jsonData);

	//TimeStamp opslaan in de localstorage
	//localStorage.setItem("lastScoresUpdate", jsonData.Meta['Tijd']);

//	alert(jsonData.Deelnemers);
	$('.deelnemerOverzicht').html(jsonData.Deelnemers);
	setScreenDimensions();
}

function setLoadScoresInterval(ms)
{

	if (ms === undefined)
	{

		ms = 3000;
	}

	newsInterval = setInterval(reloadScores, ms);
}


function loadNews()
{

	/** RELOAD UIT **/
		//Nieuwe interval starten
		//setLoadNewsInterval();

	doJSONP('onNewsLoaded', 'getNews?ts=0');
}

function reloadNews()
{

	var iTimeStamp = 0;

	if (localStorage.getItem("lastNewsUpdate") > 0)
	{

		iTimeStamp = localStorage.getItem("lastNewsUpdate");
	}

	doJSONP('onNewsLoaded', 'getNews?ts=' + iTimeStamp);
}

function onNewsLoaded(jsonData)
{

	//Oude interval clearen
	clearInterval(newsInterval);

	//HTML decoderen
	var decoded = $("<div/>").html(jsonData.HTML).text();
	//Nieuws laten zien
	$('#nieuws').html(decoded);
	setScreenDimensions();

	//TimeStamp opslaan in de localstorage
	localStorage.setItem("lastNewsUpdate", jsonData.Meta['Tijd']);
}

function setLoadNewsInterval(ms)
{

	if (ms === undefined)
	{

		ms = 10000;
	}

	newsInterval = setInterval(reloadNews, ms);
}

function loadHups() {

	doJSONP('onHupsLoaded', '');
}

function submitHup(e) {
	e.preventDefault();
	var sName = $('.hupFormWrapper #name').val();
	var sMessage = $('.hupFormWrapper #hupMessage').val();

	var sExtraGetString = 'sndr=' + sName + '&msg=' + sMessage;

	doJSONP('onHupsLoaded', sExtraGetString);
}

function onHupsLoaded(jsonData) {

	//Hupjes zijn geladen: Laten zien
	console.log(jsonData.Hups);

	var hupOverview = $('.hupOverview');
	$(hupOverview).html(jsonData.Hups);
	$(hupOverview).find('.hupItem:first-child').fadeOut(0).fadeIn(1600);

	setScreenDimensions();
	$('.hupFormWrapper').slideUp();
}


//Doe een JSONP-request
function doJSONP(sCallBack, sExtraGetString)
{

	if (sExtraGetString.length > 5)
	{

		sExtraGetString = '&' + sExtraGetString;

	} else {

		sExtraGetString = '';
	}

	//var url = BASE_URL + '?key=' + SECURITY_KEY + '&callback=' + sCallBack + '&' + sExtraGetString;
	var url = BASE_URL + '?ed=' + EDITION_ID + '&cb=' + sCallBack + sExtraGetString;

	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);
}

/********************************************************************************
 ******************************* LAYOUT / UI *************************************
 ********************************************************************************/

function toggle(someID)
{

	$(".menu-button").removeClass('active');
	$("#button-" + someID).addClass('active');
	var position;
	$('.sendHupWrapper').stop().animate({'margin-bottom': '-50px'}, function ()
	{
		$(this).hide();
	});
	switch (someID)
	{
		case 'nieuws':
			position = 0;
			break;
		case 'scores':
			position = '-100%';
			break;
		case 'hup':
			position = '-200%';
			break;
	}

	$('.screenWrapper').animate({"left": position}, function ()
	{
		if(someID ==  'hup')	$('.sendHupWrapper').show().animate({'margin-bottom': 0});
	});
	$('.screen').removeClass('active');
	$('.screen#' + someID).addClass('active');
	setScreenDimensions();
}

$('.toggleSlide').on('click', function ()
{
	var targetClass = "." + $(this).data('target');
	$(targetClass).slideToggle(200);
});

$('body').click(function (e)
{
	var targetClass = "." + $('.toggleSlide').data('target');
	if (!$(e.target).closest(targetClass).length && !$(e.target).hasClass('toggleSlide'))
	{
		$(targetClass).slideUp();
	}
});

$(document).ready(function(){
	setScreenDimensions();

	$('.submitHup').on('click', submitHup);
});

$(window).resize(function(){
	setScreenDimensions();
});

function setScreenDimensions(){
	$('.screen').css({"width": $(window).width(), "height": "auto","max-height": $(window).height() -130});
	$('.screen:not(.active)').css({"height": $(window).height() -120});
}

/********************************************************************************
 ******************************* RSS READER *************************************
 ********************************************************************************/
