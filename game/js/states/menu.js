// menu.js

var menuState = function(game) {
	console.log("menuState...");
};

menuState.prototype = {
	create: function() {
		var gameTitle = game.add.text(game.world.center.x, 200, 'Wall-et Defense', {fontSize: '44px', fill: '#ffffff'});
	}
};