// load.js

var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80,150, 'loading...', {fontSize: '44px', fill: '#ffffff'});

		// load atlas
		// game.load.image();
	},

	create: function() {
		game.state.start('menu');
	}
};