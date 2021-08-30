var back = "https://dominion.games/images/cards/templates/back.jpg"
var base = "https://dominion.games/images/cards/art/base/*";

function get_new_full_art(url) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = url.match(regex);
	if (matches != null) { return "https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/full/" + matches[2] + ".png"; }
	// Handle card backs
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
	{urls:[back, base], types:["image"]},
	["blocking"]
);