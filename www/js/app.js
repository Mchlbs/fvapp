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

function loadNews()
{
	doJSONP('onNewsLoaded', '');
}

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

function loadHupsNScores() //CallBack: onHupsNScoresLoaded
{
	url = 'http://fietsenvoor.nl/themes/fietsenvoor/hupsnscores.json';

	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);
}

//Aangeroepen als callback van LoadHupsNScores() (zie backend)
function onHupsNScoresLoaded(jsonData) {

	jsonData = JSON.parse(jsonData);

	var sHupHTML = "";

	jQuery.each(jsonData.Hups, function(i, val) {

		sHupHTML += getHupHTML(val.Name, val.Message);
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

function getHupHTML(name, message) {

	var sHupHTML = "";

	sHupHTML += '<div class="hupItem infoBlock">';
	sHupHTML += '<div class="name header">' + name + '</div>';
	sHupHTML += '<div class="content">' + message + '</div>';
	sHupHTML += '</div>';

	return sHupHTML;
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

	var sNewHupHTML = getHupHTML(sName, sMessage);

	$('.hupOverview').prepend(sNewHupHTML);

	closeHupForm();

	$('.screen.active').scrollTop(0);
	$('.hupOverview').find('.hupItem:first-child').fadeOut(0).fadeIn(3000);
}

function onSubmitHup(success) {

	if (success === true) {

		//loadHupsNScores();
	}
}

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

//	alert('test');
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
