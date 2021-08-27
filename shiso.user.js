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
		getSiblingBySelector(art_div, ".bottom-bar-full").style.visibility = "hidden";
		getSiblingBySelector(art_div, ".full-card-name-container").style.visibility = "hidden";
		let treasureBar = getSiblingBySelector(art_div, ".treasure-production-container")
		if (treasureBar) { treasureBar.style.visibility = "hidden"; }
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

function replace_card_backs() {
	// The deck div has nothing uniquely identifying it other than being the 1st child of the 1st child of the 3rd child of the hero-info div... ;_;
	var deck = document.querySelector(".hero-info > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)");
	deck.style.backgroundImage = "url(https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/back.png)";
}

function initialize_cards() {
	// Replace mini card art
	var card_divs = document.getElementsByClassName("mini-card-art");
	for (var i=0; i<card_divs.length; i++) {
		card_divs[i].style.backgroundImage = get_new_mini_art(card_divs[i].style.backgroundImage);
	}

	// Replace full card art
	replace_hand_cards();
	replace_card_backs();
}

function game_update() {
	// If the top of our discard has changed, change it
	// (Yes, and you call it opponent-discard-wrapper, despite the fact it is obviously ours...)
	var discard = document.querySelector("hero-discard > .opponent-discard-wrapper > .full-card > .full-card-template");
	if (discard) {
		// If it's already our image, it'll start with https://; if it's not, it'll start with images/
		if (discard.style.backgroundImage[5] != "h") {
			discard.style.backgroundImage = get_new_full_art(discard.nextElementSibling.style.backgroundImage);
			console.log(discard.style.backgroundImage);
		}
	}
}

// Opponent cards
	//TODO: Stop opponent cards from getting fucked up
	//TODO: Opponent card backs
	//TODO: Opponent discard
	//TODO: Opponent gains
	//TODO: Opponent played cards

// Player cards
	//TODO: Replace gained cards
	//TODO: Give cards rounded corners on the right
	//TODO: Cards should have a green glow if they're playable, black otherwise (this can be found in full-card-border's color style)

// Mini cards
	//TODO: Replace card names (optionally?)

// General fixes
	//TODO: Animations still show vanilla cards
	//TODO: Replacing all hand cards on every hand update is probably overkill

angular.element(document.body).injector().invoke(['$rootScope', function(rootScope) {

	rootScope.$on(Events.GAME_PAGE_LOADED, initialize_cards);
	rootScope.$on(Events.CARD_STUDY_REQUEST, replace_card_study);
	rootScope.$on(Events.HAND_UPDATE, replace_hand_cards);
	rootScope.$on(Events.PLAY_UPDATE, replace_played_cards);
	rootScope.$on(Events.GAME_STATE_CHANGE, game_update);

	//CARD_MOVE
	//PILE_UPDATE
	//REVEAL_UPDATE
	//OPPONENT_HAND_UPDATE
	//TRASH_ZONE_UPDATED
	//LANDMARK_STUDY_REQUEST
	//EVENT_STUDY_REQUEST
}]);