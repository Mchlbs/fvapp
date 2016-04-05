//var jsonData = '{"Meta":{"Tijd":1454517390,"TotaalBedrag":"374,00"},"Deelnemers":[{"naam":"Rianne Engels","toppen":"3","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Hans Blaauwendraat","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Tim Sterel","toppen":"3","gehaaldetoppen":"0","bedrag":"374,00"},{"naam":"Aletta Boer","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"}]}';

var BASE_URL = "http://fietsenvoor.nl/toppen";
var SECURITY_KEY = "SDFEdfs";
var EDITION_ID = 5;

var newsInterval;
var scoreInterval;

function onPause()
{
}

function onResume()
{
}

//function pokeServer() {
//
//	alert("Michiel");
//
//	var sExtraGetString = "";
//
//	sExtraGetString += 'tsn=0';
//	//sExtraGetString += 'tsn='  + getTimeStamp('News');
//	sExtraGetString += '&tss=' + getTimeStamp('Scores');
//	sExtraGetString += '&tsh=' + getTimeStamp('Hups');
//
//	doJSONP('poke', sExtraGetString);
//}

////Return van het poken van de Server
//function poke(data) {
//
//	var jsonNews = data.News;
//
//	alert("Mciheil");
//
//	if (jsonNews) { processNews(jsonNews) }
//}

//function getTimeStamp(sDataStream) {
//
//	var sName = sDataStream + 'TimeStamp';
//
//	var iTimeStamp = localStorage.getItem(sName);
//
//	if (!isNumeric(iTimeStamp)) {
//
//		iTimeStamp = 0;
//	}
//
//	return iTimeStamp;
//}

//function setTimeStamp(sDataStream, iTimeStamp) {
//
//	var sName = sDataStream + 'TimeStamp';
//
//	if (!isNumeric(iTimeStamp)) {
//
//		iTimeStamp = 0;
//	}
//
//	localStorage.setItem(sName, iTimeStamp);
//}
//
//function isNumeric(val) {
//
//	return Number(parseFloat(val))== val;
//}
//
////getScores?ts=1231&ed=5
//
//function loadScores()
//{
//
//	doJSONP('onScoresLoaded', '');
//}
//
//function reloadScores()
//{
//
////	var iTimeStamp = 0;
////
////	if (localStorage.getItem("lastScoreUpdate") > 0) {
////
////		iTimeStamp = localStorage.getItem("lastScoreUpdate");
////	}
//
//	doJSONP('onScoresLoaded', '');
//}
//
//function onScoresLoaded(jsonData)
//{
//
//	//Oude interval clearen
//	clearInterval(newsInterval);
//
//	//getScoreLijst(jsonData);
//
//	//TimeStamp opslaan in de localstorage
//	//localStorage.setItem("lastScoresUpdate", jsonData.Meta['Tijd']);
//
//	//alert(jsonData.Deelnemers);
//
//	$('.deelnemerOverzicht').html(jsonData.Deelnemers);
//	setScreenDimensions();
//}
//
//function setLoadScoresInterval(ms)
//{
//
//	if (ms === undefined)
//	{
//
//		ms = 3000;
//	}
//
//	newsInterval = setInterval(reloadScores, ms);
//}

//function processNews(jsonNews) {
//
//	//setTimeStamp( 'News' , jsonNews.TimeStamp);
//
//	//console.log(jsonNews.Messages);
//
//	var storedMessages = localStorage.getItem('News');
//
//	//alert(storedMessages.Messages);
//
//	if (storedMessages) {
//
//		$.each(jsonNews.Messages,function(i, item) {
//
//			var ID = item.ID;
//
//			var index = storedMessages.length + 1;
//
//			$.each(storedMessages,function(j, curr_item) {
//
//				if (curr_item.ID == ID) {
//
//					delete storedMessages[j];
//
//					index = j;
//				}
//			});
//
//			storedMessages[index] = item;
//		});
//
//		localStorage.setItem('News', jsonNews.Messages);
//		//localStorage.setItem('News', storedMessages);
//
//	} else {
//
//		localStorage.setItem('News', jsonNews.Messages);
//	}
//
//	showNews();
//}

//function showNews() {
//
////	var storedMessages = localStorage.getItem('News');
////
////	var sNewsItems = "";
////
////	if (storedMessages) {
////
////		$.each(storedMessages,function(i, item) {
////
////			var sTitle = item.Title;
////
////			sNewsItems += `<div class="row top">
////				<section id="content">
////					<article id="content_wrapper" class="blogEntry clearfix">
////						<h1 class="postTitle">${sTitle}</h1>'
////
////					${item.Message}
////
////						<span class="post-metadata">Geplaatst op ${item.Date}</span>
////
////					</article>
////				</section>
////			</div>`;
////		});
////	}
//
//	//alert(sNewsItems);
//
//
//
//
////	//HTML decoderen
////	var decoded = $("<div/>").html(sNewsItems).text();
////	//Nieuws laten zien
////	$('#nieuws .content').html(decoded);
////	setScreenDimensions();
//}

//function makeSureThisIsAnArray(somevalue) {
//
//	if (!$.isArray(somevalue)) {
//
//		somevalue = [];
//	}
//
//	return somevalue;
//}

//function pokeScores()
//{
//	doJSONP('onScoresLoaded', '');
//}

//function processScores(data) {
//
//	$('.deelnemerOverzicht').html(data.Deelnemers);
//	setScreenDimensions();
//}

function loadNews()
{

	/** RELOAD UIT **/
		//Nieuwe interval starten
		//setLoadNewsInterval();

	doJSONP('onNewsLoaded', '');
}

//function reloadNews()
//{
//
//	var iTimeStamp = 0;
//
//	if (localStorage.getItem("lastNewsUpdate") > 0)
//	{
//
//		iTimeStamp = localStorage.getItem("lastNewsUpdate");
//	}
//
//	doJSONP('onNewsLoaded', '');
//}

function onNewsLoaded(jsonData)
{
	//Oude interval clearen
	clearInterval(newsInterval);

	//HTML decoderen
	var decoded = $("<div/>").html(jsonData.HTML).text();

	//Nieuws laten zien
	$('#nieuws .content').html(decoded);
	setScreenDimensions();

	//TimeStamp opslaan in de localstorage
	localStorage.setItem("lastNewsUpdate", jsonData.Meta['Tijd']);
}

//function setLoadNewsInterval(ms)
//{
//
//	if (ms === undefined)
//	{
//
//		ms = 10000;
//	}
//
//	newsInterval = setInterval(reloadNews, ms);
//}

//function loadHups()
//{
//
//	doJSONP('onHupsLoaded', '');
//}

function loadHupsNScores() //CallBack: onHupsNScoresLoaded
{
	url = 'http://fietsenvoor.nl/themes/fietsenvoor/hupsnscores.json';

	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);
}

function onHupsNScoresLoaded(jsonData) {

	jsonData = JSON.parse(jsonData);

	var sHupHTML = "";

	jQuery.each(jsonData.Hups, function(i, val) {

		sHupHTML += '<div class="hupItem infoBlock">';
		sHupHTML += '<div class="name header">' + val.Name + '</div>';
		sHupHTML += '<div class="content">' + val.Message + '</div>';
		sHupHTML += '</div>';
	});

	var sParticipantsHTML = "";

	jQuery.each(jsonData.Participants, function(i, val) {

		sParticipantsHTML += '<div class="deelnemer infoBlock clear">';
		sParticipantsHTML += '<div class="naam header">' + val.Name + '</div>';
		sParticipantsHTML += '<div class="details content clear">';
		sParticipantsHTML += '<div class="detail doel">' + val.Toppen + '</div>';
		sParticipantsHTML += '<div class="detail gehaald">' + val.GehaaldeToppen + ' (' + val.Percentage + '%)</div>';
		sParticipantsHTML += '<div class="detail bedrag">' + val.Bedrag + '</div>';
		sParticipantsHTML += '</div></div>';
	});

	/** TODO: Datavalidatie **/

	//Hupjes laten zien
	var hupOverview = $('.hupOverview');
	$(hupOverview).html(sHupHTML);

	//Deelnemers/Scores laten zien
	$('.deelnemerOverzicht').html(sParticipantsHTML);

	//Totaalbedrag laten zien
	$('#moneyHeader .value').html(jsonData.TotaalBedrag);

	setScreenDimensions();
}

function submitHup(e) //CallBack: onSubmitHup
{
	e.preventDefault();
	var sName = $('.hupFormWrapper #name').val();
	var sMessage = $('.hupFormWrapper #hupMessage').val();

	var sExtraGetString = 'sndr=' + sName + '&msg=' + sMessage;

	url = BASE_URL + '/insertHup?' + sExtraGetString;

	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);

	closeHupForm();
	$('.screen.active').scrollTop(0);
	$('.hupOverview').find('.hupItem:first-child').fadeOut(0).fadeIn(3000);
}

function onSubmitHup(success) {

	if (success === true) {

		//loadHupsNScores();
	}
}

//function onHupsLoaded(jsonData)
//{
//	loadHupsNScores();
//}

//Doe een JSONP-request
function doJSONP(sCallBack, sExtraGetString)
{

	if (sExtraGetString.length > 5)
	{

		sExtraGetString = '&' + sExtraGetString;

	}
	else
	{

		sExtraGetString = '';
	}

	var SessionID = localStorage.getItem('SocketID');

	if (SessionID.length > 3) {

		sExtraGetString += '&sid=' + SessionID;
	}

	//var url = BASE_URL + '?key=' + SECURITY_KEY + '&callback=' + sCallBack + '&' + sExtraGetString;
	var url = BASE_URL + '?ed=' + EDITION_ID + '&cb=' + sCallBack + sExtraGetString;

//	console.log(url);

	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);
}

////Callback Function
//function getScoreLijst(json)
//{
//	if(json !== undefined ) {
//
//		$('#chart').html("").json2html(json, transforms.scorelijst);
//	}
//}
//
//var transforms = {
//
//	'scorelijst': [
//		{ "tag" : "table",
//			"data-role" : "table",
//			"class" : "scoreList CSSTableGenerator ui-responsive",
//			"children" : [
//				{ "tag" : "thead",
//					"children" : [
//						{ "tag" : "tr",
//							"children" : [
//								{ "tag" : "th",
//									"html" : "Naam"
//								},
//								{ "tag" : "th",
//									"html" : "Doel"
//								},
//								{ "tag" : "th",
//									"html" : "Gehaald"
//								},
//								{ "tag" : "th",
//									"html" : "Bedrag"
//								}
//							]
//						}
//					]
//				},
//				{ "tag" : "tbody",
//					"children" : function() { return(json2html.transform(this.Deelnemers,transforms.deelnemers)); }
//				}
//			]
//		}
//	],
//
//	'deelnemers' : [
//		{ "tag":"tr","class":"deelnemer","children":[
//			{"tag":"td","class":"naam","html":"${naam}"},
//			{"tag":"td","class":"toppen","html":"${toppen}"},
//			{"tag":"td","class":"gehaaldetoppen","html":"${gehaaldetoppen}"},
//			{"tag":"td","class":"bedrag","html":"${bedrag}"}
//		]}
//	]
//};

/********************************************************************************
 ******************************* LAYOUT / UI *************************************
 ********************************************************************************/

$(document).ready(function ()
{
	setScreenDimensions();
	$('.screen').fadeIn();
	$('.sendHupWrapper').stop().show().animate({'margin-bottom': 0});

	$('.menu-button').on('click', function ()
	{
		var targetScreen = $(this).data("screenid");
		$(".menu-button").removeClass('active');
		$(this).addClass('active');
		slideToScreen(targetScreen);
	});

	$('body').swipe({
		swipeLeft: function (event, direction, distance, duration, fingerCount)
		{
			if ($(this).hasClass('navSwipeBlocked')) return;
			var currentScreenID = $('.screen.active').data("screenid");
			slideToNextScreen(currentScreenID);
		},
		swipeRight: function ()
		{
			if ($(this).hasClass('navSwipeBlocked')) return;
			var currentScreenID = $('.screen.active').data("screenid");
			slideToPrevScreen(currentScreenID);
		},
		threshold: 75
	});

	$('.submitHup').on('click', submitHup);

	$('#filterDeelnemers').on('focusin', function ()
	{
		$('.deelnemerOverzichtWrapper').addClass('active');
		$('.deelnemerOverzicht').css({"height": $(window).height() - 70});
		$('.exitFilterModus').removeClass('hidden');
		blockNavSwipe();
	}).on('focusout', function ()
	{
		$('.deelnemerOverzichtWrapper').removeClass('active');
		unBlockNavSwipe();
	}).on('input', function ()
	{
		var target = $(this).data("target");
		var criteria = $(this).val();

		filter(criteria, target);
	});

	$('.exitFilterModus').on('click', function ()
	{
		var filterInput = $('#filterDeelnemers');
		if (!$('.deelnemerOverzichtWrapper').hasClass('active'))
		{
			$(filterInput).val('');
		}
		$(filterInput).trigger('blur');
		var target = $(filterInput).data("target");
		var criteria = $(filterInput).val();
		if (criteria == '')
		{
			$(this).addClass('hidden');
		}
		else
		{
			$(this).removeClass('hidden');
		}
		filter(criteria, target);
	});

	$('.sendHupTrigger').on('click', function ()
	{
		var sendHupWrapper = $('.sendHupWrapper');
		if (! $(sendHupWrapper).hasClass('active'))
		{
			openHupForm();
		}
	});

	$('.closeHupFormTrigger').on('click', function ()
	{
		closeHupForm();
	});

});

$(window).resize(function ()
{
	setScreenDimensions();
});
window.onhashchange = function (event)
{

	alert('test');
};

function setScreenDimensions()
{
	$('.screen').css({"width": $(window).width(), "height": "auto", "max-height": $(window).height() - 109});
	$('.screen:not(.active)').css({"height": $(window).height() - 109});
}

function slideToNextScreen(id)
{
	if (id <= 2)
	{
		slideToScreen(id + 1);
	}
}
function slideToPrevScreen(id)
{
	if (id >= 2)
	{
		slideToScreen(id - 1);
	}
}

function slideToScreen(id)
{
	var position;
	switch (id)
	{
		case 1:
			position = 0;
			break;
		case 2:
			position = '-100%';
			break;
		case 3:
			position = '-200%';
			break;
	}

	$('.sendHupWrapper').stop().animate({'margin-bottom': '-50px'}, function ()
	{
		$(this).hide();
	});

	$('.screenWrapper').stop().animate({"left": position}, function ()
	{
		if (id == 1)  $('.sendHupWrapper').stop().show().animate({'margin-bottom': 0});
	});

	$('.screen').removeClass('active');
	$('.menu-button').removeClass('active');
	$('.screen[data-screenid="' + id + '"]').addClass('active');
	$('.menu-button[data-screenid="' + id + '"]').addClass('active');
	setScreenDimensions();
}

function blockNavSwipe()
{
	$('body').addClass('navSwipeBlocked');
}

function unBlockNavSwipe()
{
	$('body').removeClass('navSwipeBlocked');
}

function openHupForm()
{
	var sendHupWrapper = $('.sendHupWrapper');
	var hupFormWrapper = $('.hupFormWrapper');
	var sendHupTrigger = $('.sendHupTrigger');
	var closeHupFormTrigger = $('.closeHupFormTrigger');
	$(sendHupWrapper).addClass('active');
	$(sendHupWrapper).closest('.screen').removeClass('active');
	$(hupFormWrapper).fadeIn().find("input:first-child").focus();
	$(closeHupFormTrigger).fadeIn();

	$(sendHupWrapper).width($(window).width());
	$(sendHupWrapper).height($(window).height());
	setTimeout(function(){
	$(sendHupWrapper).find('.textareaHolder').height($(window).height() - 160);
	},200);


	blockNavSwipe();
}

function closeHupForm()
{
	var sendHupWrapper = $('.sendHupWrapper');
	var hupFormWrapper = $('.hupFormWrapper');
	var sendHupTrigger = $('.sendHupTrigger');
	var closeHupFormTrigger = $('.closeHupFormTrigger');
	$(closeHupFormTrigger).hide();
	$(sendHupWrapper).removeClass('active');
	$(sendHupWrapper).closest('.screen').addClass('active');
	$(hupFormWrapper).hide();
	$(sendHupWrapper).height('50px');
	unBlockNavSwipe();
}

function filter(criteria, target)
{
	var totalItems = $(target).length;
	var iterator = 0;
	$('.noItemsFound').hide();
	if (criteria !== '')
	{
		$(target).each(function ()
		{
			if ($(this).text().toUpperCase().indexOf(criteria.toUpperCase()) == -1)
			{
				$(this).parent().fadeOut(100);
				iterator++;
				if (totalItems === iterator) $('.noItemsFound').show();
			}
			else
			{
				$(this).parent().fadeIn();
			}
		});
	}
	else
	{
		$(target).parent().fadeIn();
	}

}

/********************************************************************************
 ******************************* RSS READER *************************************
 ********************************************************************************/
