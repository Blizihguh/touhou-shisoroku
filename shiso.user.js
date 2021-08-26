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
		visibility: visible !important;
		border: 16px solid rbga(0, 0, 0, 1);
		border-style: solid;
		border-radius: 16px;
	}
	.full-card-text-container
	{
		visibility: hidden;
	}
	.full-card
	{
		border-style: none !important;
		border-radius: 16px;
	}
`);

function getSiblingBySelector(elem, selector) {

	// Get the next sibling element
	var sibling = elem.nextElementSibling;

	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling
	}

}

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

function replace_card_study() {
	var observer = new MutationObserver(function (mutations, me) {
	  // Wait for the study window to load
	  var study_card_divs = document.getElementsByClassName("card-study-window");
	  if (study_card_divs[0]) {
	  	// Get the template, to paste the full card art over
		var study_card = study_card_divs[0].querySelector(".full-card-template");
		// Get the name of the card
		var card_url = getSiblingBySelector(study_card, ".full-card-art").style.backgroundImage;
		// Replace image
		study_card.style.backgroundImage = get_new_full_art(card_url);
		// Make overlay text invisible
		getSiblingBySelector(study_card, ".full-card-name-container").style.visibility = "hidden";
		getSiblingBySelector(study_card, ".bottom-bar-full").style.visibility = "hidden";
		let treasureBar = getSiblingBySelector(study_card, ".treasure-production-container");
		if (treasureBar) { treasureBar.style.visibility = "hidden"; }
		// Exit from observer
		me.disconnect();
		return;
	  }
	});

	observer.observe(document, {childList: true, subtree: true});
}

function replace_played_cards() {
	// Find the most recently played card
	var played_cards = document.getElementsByClassName("play-stacks");
	var new_card = played_cards[played_cards.length-1];
	if (new_card) {
		var art_div = new_card.getElementsByClassName("full-card-art")[0];
		art_div.previousElementSibling.style.backgroundImage = get_new_full_art(art_div.style.backgroundImage);
	}
}

function replace_hand_cards() {
	var hand_divs = document.getElementsByClassName("my-visible-hand");
	for (var i=0; i<hand_divs.length; i++) {
		var art = hand_divs[i].getElementsByClassName("full-card-art")[0];
		art.previousElementSibling.style.backgroundImage = get_new_full_art(art.style.backgroundImage);
		// Make card types, name, and cost invisible
		getSiblingBySelector(art, ".bottom-bar-full").style.visibility = "hidden";
		getSiblingBySelector(art, ".full-card-name-container").style.visibility = "hidden";
		// If the card is a treasure, make its coin production invisible as well
		let treasureBar = getSiblingBySelector(art, ".treasure-production-container")
		if (treasureBar) { treasureBar.style.visibility = "hidden"; }
	}
}

function replace_all_cards() {
	// Replace mini card art
	var card_divs = document.getElementsByClassName("mini-card-art");
	for (var i=0; i<card_divs.length; i++) {
		card_divs[i].style.backgroundImage = get_new_mini_art(card_divs[i].style.backgroundImage);
	}

	// Replace full card art
	replace_hand_cards();
	//TODO: Fix cards only having rounded corners on the left and not on the right...?
	//TODO: Give the card image div the corresponding glow from full-card-border's color style
	//TODO: Council Room doesn't work on right click?
	//TODO: Replace card names
	//TODO: Replace card backs
	//TODO: Replace stack animations (if possible)
	//TODO: Fix opponents' cards just being totally fucked up
	//TODO: Replace gained cards (do Workshop gains count as purchase events?)
	//TODO: Gold, specifically, seems to have the treasure bar info appear when in play???
}

function foo() {}

angular.element(document.body).injector().invoke(['$rootScope', function(rootScope) {
	rootScope.$on(Events.GAME_PAGE_LOADED, function (info) {
		console.log(Events);
		replace_all_cards();
	});

	rootScope.$on(Events.CARD_STUDY_REQUEST, replace_card_study);
	rootScope.$on(Events.LANDMARK_STUDY_REQUEST, foo);
	rootScope.$on(Events.EVENT_STUDY_REQUEST, foo);
	rootScope.$on(Events.HAND_UPDATE, replace_hand_cards); //TODO: This is probably overkill
	rootScope.$on(Events.PLAY_UPDATE, replace_played_cards);
}]);