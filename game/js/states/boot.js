// boot.js

var bootState = {
	create: function() {
		// setup game physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// start load state
		game.state.start('load');
	}
};