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

GM_addStyle(`
    .game-page .full-card-art
    {
    	background-size: contain;
    }
    .game-page .full-card-template
    {
    	width: 120% !important;
    	background-size: contain !important;
    }
    .full-card-text-container
    {
    	visibility: hidden;
    }
`);

function get_new_mini_art(str) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = str.match(regex);
	if (matches != null) { return "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/crop/" + matches[2] + ".png')"; }
}

function get_new_full_art(str) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = str.match(regex);
	if (matches != null) { return "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/full/" + matches[2] + ".png')"; }
}

function replace_all_cards() {
	// Replace mini card art
	var card_divs = document.getElementsByClassName("mini-card-art");
	for (var i=0; i<card_divs.length; i++) {
		card_divs[i].style.backgroundImage = get_new_mini_art(card_divs[i].style.backgroundImage);
	}

	// Replace full card art
	card_divs = document.getElementsByClassName("full-card-art");
	for (var i=0; i<card_divs.length; i++) {
		card_divs[i].previousElementSibling.style.backgroundImage = get_new_full_art(card_divs[i].style.backgroundImage);
	}
	//TODO: Make the corresponding "full-card-border" div invisible, and give the card image div the corresponding glow from full-card-border's color style

	// Replace card backs
	// card_divs = document.getElementsByClassName("full-card-template");
	// for (var i=0; i<card_divs.length; i++) {
	// 	card_divs[i].style.backgroundImage = "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/Card%20Back.png')";
	// }
}

function foo() {}

angular.element(document.body).injector().invoke(['$rootScope', function(rootScope) {
	rootScope.$on(Events.GAME_PAGE_LOADED, function (info) {
		console.log(Events);
		replace_all_cards();
	});

	rootScope.$on(Events.CARD_STUDY_REQUEST, foo);
	rootScope.$on(Events.LANDMARK_STUDY_REQUEST, foo);
	rootScope.$on(Events.EVENT_STUDY_REQUEST, foo);
	rootScope.$on(Events.HAND_UPDATE, replace_all_cards);
}]);