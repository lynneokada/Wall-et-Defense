// boot.js

var bootState = function(game) {
	console.log("bootState...");
};

bootState.prototype = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.state.start('load');
	}
}