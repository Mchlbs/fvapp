//var jsonData = '{"Meta":{"Tijd":1454517390,"TotaalBedrag":"374,00"},"Deelnemers":[{"naam":"Rianne Engels","toppen":"3","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Hans Blaauwendraat","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"},{"naam":"Tim Sterel","toppen":"3","gehaaldetoppen":"0","bedrag":"374,00"},{"naam":"Aletta Boer","toppen":"0","gehaaldetoppen":"0","bedrag":"0,00"}]}';

var BASE_URL = "http://fietsenvoor.nl/toppen";
var SECURITY_KEY = "SDFE1dfs";
var EDITION_ID = 5;

/**************************************************************************/
/*********** ALGEMEEN *****************************************************/
/**************************************************************************/

/** Doe een request naar de Server **/
function request(url) {

	//Timestamp meegeven i.v.m. cache-issues
	var time = Date.now();

	var prefix = url.indexOf("?") > 0 ? "&" : "?";

	url += prefix + 'ts=' + time + '&ed=' + EDITION_ID + '&key=' + SECURITY_KEY;

	//alert(url);

	//Let's go
	var head = document.head;
	var script = document.createElement("script");

	script.setAttribute("src", url);
	head.appendChild(script);
	head.removeChild(script);

	//De Callback wordt geregeld via de Back-end
}

function onPause()
{
	//console.log("onPause");

	disconnectPusher();
}

function onResume()
{
	//console.log("onResume");

	connectPusher();

	loadNews();
	loadHups();
	loadParticipants();
}

/**************************************************************************/
/*********** PUSHER *******************************************************/
/**************************************************************************/

var pusher;

function connectPusher()
{
	//Verbinding maken met onze server (via Pusher.com)
	pusher = new Pusher('d11fb45626c063f59deb', {
		encrypted: true
	});

	var channel = pusher.subscribe('test_channel');

	channel.bind('my_event', function (data)
	{
		//Data is altijd in de vorm van een JSON
		data = JSON.parse(data);

		if (data.Type === 'updateHups')
		{
			loadHups();
		}

		if (data.Type === 'updateParticipants')
		{
			loadParticipants();
		}

		if (data.Type === 'updateNews')
		{
			loadNews();
		}
	});
}

function disconnectPusher()
{
	pusher.disconnect();
}

/**************************************************************************/
/*********** NIEUWS *******************************************************/
/**************************************************************************/

/**
 * Laad in de LocalStorage opgeslagen Nieuwsberichten
 */
function loadNewsFromLocalStorage()
{
	if (localStorage.getItem('News') !== 'undefined')
	{
		var sHTML = localStorage.getItem('News');

		//Nieuws laten zien
		$('#nieuws .content').html(sHTML);
		setScreenDimensions();
	}
}

/**
 * Laad News uit de JSON -> CallBack: onNewsLoaded()
 */
function loadNews()
{
	//1. Kijk in de LocalStorage
	loadNewsFromLocalStorage();

	//2. JSON van de Server inladen (als nodig)
	checkNewsTS(); //--> onCheckNewsTS()
}

function onNewsLoaded(jsonData)
{
	//HTML decoderen
	var decoded = $("<div/>").html(jsonData.News).text();

	decoded = decoded.replace(/<*src *= *["\']/g, 'src="http://fietsenvoor.nl/');

	localStorage.setItem("News", decoded);
	loadNewsFromLocalStorage();
}

/** TimeStamp laden van laatste Nieuws-update (callback: onCheckNewsTS()) **/
function checkNewsTS()
{
	url = 'http://fietsenvoor.nl/themes/fietsenvoor/newsTS.json';

	request(url);
}

/** TimeStamp van laatste Nieuws-update vergelijken met de TimeStamp in de Local Storage */
function onCheckNewsTS(timestamp)
{
	var localTS = localStorage.getItem("NewsTS");

	if (timestamp > localTS)
	{
		//Nieuws laden
		localStorage.setItem("NewsTS", timestamp);

		url = 'http://fietsenvoor.nl/themes/fietsenvoor/news.json';

		request(url); //--> onNewsLoaded()
	}
}

/**************************************************************************/
/*********** HUPJES *******************************************************/
/**************************************************************************/

/**
 * Laad de in de LocalStorage opgeslagen Hupjes
 */
function loadHupsFromLocalStorage() {

	if (localStorage.getItem('Hups') !== 'undefined') {

		var sHTML = localStorage.getItem('Hups');

		//Hupjes laten zien
		var hupOverview = $('.hupOverview');
		$(hupOverview).html(sHTML);
	}

	setScreenDimensions();
}

/**
 * Laad de Hups uit de JSON -> CallBack: onHupsLoaded()
 */
function loadHups()
{
	//1. Kijk in de LocalStorage
	loadHupsFromLocalStorage();

	//2. JSON van de Server inladen
	url = 'http://fietsenvoor.nl/themes/fietsenvoor/hups.json';

	request(url);
}

/**
 * Aangeroepen als callback van LoadHups() (zie backend JSON)
 */
function onHupsLoaded(jsonData)
{
	localStorage.setItem('jsonData', jsonData);

	jsonData = JSON.parse(jsonData);

	var sHupHTML = "";

	jQuery.each(jsonData.Hups, function (i, val)
	{
		sHupHTML += getHupHTML(val.Name, val.Participant, val.Message, val.Source);
	});

	/** TODO: Datavalidatie **/

	localStorage.setItem("Hups", sHupHTML);
	loadHupsFromLocalStorage();
}

function getHupHTML(name, sParticipant, message, source)
{
	var sHupHTML = "";
	if (source !== 'Server')
	{
		//Hupjes vanuit de App
		sHupHTML += '<div class="hupItem">';
		sHupHTML += '<div class="header"><span class="sender">' + name + '</span><div class="triangle"></div><span class="participant">' + sParticipant + '</span></div>';
		sHupHTML += '<div class="content">' + message + '</div>';
		sHupHTML += '</div>';
	}
	else
	{
		//Hupjes van de Redactie
		sHupHTML += '<div class="hupItem participantHup">';
		sHupHTML += '<div class="header"><span class="sender">' + name + '</span></div>';
		sHupHTML += '<div class="content">' + message + '</div>';
		sHupHTML += '</div>';
	}

	return sHupHTML;
}

function submitHup(e) //CallBack: onSubmitHup
{
	e.preventDefault();
	var sName = $('.hupFormWrapper #name').val();
	var sParticipant = $('.hupFormWrapper #participant').val();
	var sMessage = $('.hupFormWrapper #hupMessage').val();

	sName = sanitizeUserInput(sName);
	sMessage = sanitizeUserInput(sMessage);

	// check
	$('.hupFormWrapper .feedback').remove();
	var everythingIsOk = true;
	if (!sName)
	{
		everythingIsOk = false;
		$('.hupFormWrapper #name').after('<div class="feedback">Vul je naam in</div>');
	}
	if (!sParticipant)
	{
		everythingIsOk = false;
		$('.hupFormWrapper #participant').after('<div class="feedback">Kies een deelnemer</div>');
	}
	if (!sMessage)
	{
		everythingIsOk = false;
		$('.hupFormWrapper .textareaHolder').after('<div class="feedback">Je aanmoediging mag niet leeg zijn</div>');
	}

	if (!everythingIsOk) return;

	localStorage.setItem('username', sName);

	var sExtraGetString = 'sndr=' + sName + '&part=' + sParticipant + '&msg=' + sMessage;

	url = BASE_URL + '/insertHup?' + sExtraGetString;

	request(url);

	//Piep de nieuwe Hup er even tussen in het kader van de snappy User Experience
	var sNewHupHTML = getHupHTML(sName, sParticipant, sMessage);
	var sHupHTML = localStorage.getItem('Hups');
	sHupHTML = sNewHupHTML + sHupHTML;
	localStorage.setItem('Hups', sHupHTML);

	closeHupForm();
	$('.hupFormWrapper #hupMessage').val('');

	$('.screen.active').scrollTop(0);
	$('.hupOverview').find('.hupItem:first-child').fadeOut(0).fadeIn(3000);

	loadHupsFromLocalStorage();
}

//Deprecated?
function onSubmitHup(success)
{

	if (success === true)
	{

		//alert("HALLO!");
	}
}

function sanitizeUserInput(userInput)
{
	userInput = userInput.replace(/([&])/g, 'en');

	userInput = userInput.replace(/([^a-zA-Z0-9:();\-?! .,])/g, '');

	return userInput;
}

/**************************************************************************/
/*********** PARTICIPANTS/SCORES ******************************************/
/**************************************************************************/

/**
 * Laad de in de LocalStorage opgeslagen Participants (en TotaalBedrag)
 */
function loadParticipantsFromLocalStorage() {

	/** Participants **/

	if (localStorage.getItem('Participants') !== null) {

		var sHTML = localStorage.getItem('Participants');

		//Deelnemers/Scores laten zien
		$('.deelnemerOverzicht').html(sHTML);

		$('.hupFormWrapper #participant').html(getParticipantsDropdownOptions());
	}

	/** Totaalbedrag **/

	if (localStorage.getItem('TotaalBedrag') !== null) {

		var sTotaalBedrag = localStorage.getItem('TotaalBedrag');

		//Totaalbedrag laten zien
		$('#moneyHeader .value').html(sTotaalBedrag);
	}

	setScreenDimensions();
}

/**
 * Laad de Participants uit de JSON op de Server -> CallBack: onParticipantsLoaded()
 */
function loadParticipants()
{
	//1. Kijk in de LocalStorage
	loadParticipantsFromLocalStorage();

	//2. JSON van de Server inladen
	url = 'http://fietsenvoor.nl/themes/fietsenvoor/participants.json';

	request(url);
//	var head = document.head;
//	var script = document.createElement("script");
//
//	script.setAttribute("src", url);
//	head.appendChild(script);
//	head.removeChild(script);
}

/**
 * Aangeroepen als callback van loadParticipants()(zie backend)
 */
function onParticipantsLoaded(jsonData)
{
	//Dit is voor de dropdown met Deelnemers
	localStorage.setItem('jsonData', jsonData);

	jsonData = JSON.parse(jsonData);

	var sParticipantsHTML = "";
	var sFotoUrl;

	jQuery.each(jsonData.Participants, function (i, val)
	{
		sFotoUrl = "img/deelnemerDummy.png";
		if (val.FotoUrl != null)
		{
			sFotoUrl = val.FotoUrl;
		}

		sParticipantsHTML += '<div class="deelnemer clear">';
		sParticipantsHTML += '<div class="photoHolder"><img src="' + sFotoUrl + '"></div>';
		sParticipantsHTML += '<div class="contentHolder">';
		sParticipantsHTML += '<div class="naam header">' + val.Name + '</div>';
		sParticipantsHTML += '<div class="details content clear">';
		sParticipantsHTML += '<div class="detail doel">' + val.GehaaldeToppen + '/' + val.Toppen + '</div>';
		sParticipantsHTML += '<div class="detail bedrag">&euro;' + val.Bedrag + '</div>';
		sParticipantsHTML += '</div></div></div>';
	});

	/** TODO: Datavalidatie **/

	localStorage.setItem("Participants", sParticipantsHTML);

	localStorage.setItem("TotaalBedrag", jsonData.TotaalBedrag);

	loadParticipantsFromLocalStorage();
}

/********************************************************************************
******************************* LAYOUT / UI *************************************
********************************************************************************/

$(document).ready(function ()
{
	var username = localStorage.getItem('username') || null;
	jQuery('.hupFormWrapper #name').val(username);

	setScreenDimensions();
	$('.screen').fadeIn();

	setTimeout(function ()
	{
		$('.splashScreen').addClass('bounceOut');
		$('body').removeClass('navSwipeBlocked');
	}, 2000);

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
		threshold: 120
	});

	$('.submitHup').on('click', submitHup);

	$('#filterDeelnemers').on('focusin', function ()
	{
		$('.deelnemerOverzichtWrapper').addClass('active');
		$('.deelnemerOverzicht').css({"height": $(window).height() - 70});
		$(window).scrollTop(-999);
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
		if (!$(sendHupWrapper).hasClass('active'))
		{
			openHupForm();
		}
	});

	$('.closeHupFormTrigger').on('click', function ()
	{
		closeHupForm();
	});

	//$('.hupFormWrapper #participant').append(getParticipantsDropdownOptions());

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
	$(window).scrollTop(-999);
	$(hupFormWrapper).fadeIn().find("input:first-child").focus();
	if(sendHupWrapper.find('#name').val() != ''){
		sendHupWrapper.find('#participant').focus();
	}
	$(closeHupFormTrigger).fadeIn();

	//$(sendHupWrapper).width($(window).width());
	$(sendHupWrapper).height($(window).height());
	setTimeout(function ()
	{
		$(sendHupWrapper).find('.textareaHolder').height($(window).height() - 160);
	}, 200);


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
	$('.hupFormWrapper .feedback').remove();
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
				$(this).closest('.deelnemer').fadeOut(100);
				iterator++;
				if (totalItems === iterator) $('.noItemsFound').show();
			}
			else
			{
				$(this).closest('.deelnemer').fadeIn();
			}
		});
	}
	else
	{
		$(target).closest('.deelnemer').fadeIn();
	}

}

function getParticipantsDropdownOptions()
{
	var jsonData = localStorage.getItem('jsonData', jsonData);
	jsonData = JSON.parse(jsonData);
	if (jsonData && jsonData !== 'undefined')
	{

		var participants = jsonData.Participants;
		if (participants && participants !== 'undefined')
		{
			var html = '<option disabled value="">Deelnemer</option><optgroup label=""><option value="Alle helden">Alle helden</option></optgroup><optgroup label="">';
			$(participants).each(function (i, val)
			{
				html += '<option value="' + val.Name + '">' + val.Name + '</option>'
			});
			html += '</optgroup>';
			return html;
		}
	}
}