var back = "https://dominion.games/images/cards/templates/back.jpg";
var alch = "https://dominion.games/images/cards/art/alchemy/*";
var base = "https://dominion.games/images/cards/art/base/*";
var corn = "https://dominion.games/images/cards/art/cornucopia/*";
var dark = "https://dominion.games/images/cards/art/dark-ages/*";
var gild = "https://dominion.games/images/cards/art/guilds/*";
var hint = "https://dominion.games/images/cards/art/hinterlands/*";
var intr = "https://dominion.games/images/cards/art/intrigue/*";
var prmo = "https://dominion.games/images/cards/art/promos/*";
var prsp = "https://dominion.games/images/cards/art/prosperity/*";
var seas = "https://dominion.games/images/cards/art/seaside/*";

function get_new_full_art(url) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = url.match(regex);

	if (matches != null) { return "https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/full/" + matches[2] + ".png"; }
	// Handle card backs, platinum, and colony
	if (url == "https://dominion.games/images/cards/templates/back.jpg") {
		return "https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/back.png";
	}
}

function redirect(requestDetails) {
	console.log(requestDetails);
	return {
	redirectUrl: get_new_full_art(requestDetails.url)
	};
}

browser.webRequest.onBeforeRequest.addListener(
	redirect,
	{urls:[back, alch, base, corn, dark, gild, hint, intr, prmo, prsp, seas], types:["image"]},
	["blocking"]
);