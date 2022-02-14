var load_cards = setInterval(replace_mini_art, 100);

function get_new_mini_art(url) {
	let regex = /art\/(.+)\/(.+).jpg/;
	let matches = url.match(regex);
	if (matches != null) { return "url('https://raw.githubusercontent.com/Blizihguh/touhou-shisoroku/master/img/" + matches[1] + "/crop/" + matches[2] + ".png')"; }
}

function replace_mini_art() {
	var card_divs = document.getElementsByClassName("mini-card-art");
	for (var i=0; i<card_divs.length; i++) {
		card_divs[i].style.backgroundImage = get_new_mini_art(card_divs[i].style.backgroundImage);
		//Can't do this if we want this to work for multiple games, unless we have some way of catching new game events
		//clearInterval(load_cards); // Only load cards once
	}
}


/*TODO: Something is making playable cards highlight green on hover??? */
/*TODO: Infinite load on undo */
//TODO: Basic cards, Nobles, Haggler, City, Governor broken in hand + right click
//TODO: Card backs broken