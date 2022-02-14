# What Is This?
A browser extension to replace the card art on [dominion.games](https://dominion.games) with the art from Touhou Shisoroku, an official Dominion reskin made by Hobby Japan. The game has been out of print for years now, and finding copies is both hard and expensive, even if you live in Japan. This extension seeks to provide a way for people to play the game without having to pay in the hundreds of thousands of yen for it. As a bonus, since the extension is designed around an official online implementation, you can support Dominion while you do it!

# How Do I Use This?
This extension is designed for Firefox, but I think it works with Chromium browsers as well. If it doesn't, it should be a pretty easy port. The assets are all in the repository in fullsize and cropped versions; all the extension does is intercept the loading of card assets and replace them with new ones, plus some graphical changes to make the app work with fullsize art.

At the moment, the project is a work in progress, but it works enough to use (and all officially-released Shisoroku cards are implemented, including the ones that aren't available on dominion.games). For now, there are two ways to run the extension in Firefox:
* [Install it as a temporary application](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
* [Package it and install it from an .xpi](https://extensionworkshop.com/documentation/publish/package-your-extension/)
