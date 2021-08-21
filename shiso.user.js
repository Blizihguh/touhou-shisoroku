// ==UserScript==
// @name         Touhou Dominion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Waiting warmly...
// @author       Blizihguh
// @match        https://dominion.games/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// ==/UserScript==

function fix_caps(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_new_mini_art(str) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = str.match(regex);
	return "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/crop/" + matches[2] + ".png')";
}

function foo() {}

angular.element(document.body).injector().invoke(['$rootScope', function(rootScope) {
    rootScope.$on(Events.GAME_PAGE_LOADED, function (info) {
        // Replace mini card art
		var card_divs = document.getElementsByClassName("mini-card-art");
		for (var i=0; i<card_divs.length; i++) {
			card_divs[i].style.backgroundImage = get_new_mini_art(card_divs[i].style.backgroundImage);
		}

		// Replace full card art
		card_divs = document.getElementsByClassName("full-card-art");
		for (var i=0; i<card_divs.length; i++) {
			card_divs[i].style.backgroundImage = "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/Festival.png')";
		}

		// Replace landscape art
		// .game-page .landscape-art,

    });

    rootScope.$on(Events.CARD_STUDY_REQUEST, foo);
    rootScope.$on(Events.LANDMARK_STUDY_REQUEST, foo);
    rootScope.$on(Events.EVENT_STUDY_REQUEST, foo);
    rootScope.$on(Events.GLOBAL_CLICK, foo);
}]);