// gamePlay.js

var gamePlayState = {
	preload: function() {
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	},
	create: function() {
		var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);

		boba = new Boba(game, game.world.centerX, game.world.centerY, 'boba0002');

		var healthText = game.add.text(20, 15, 'health: 100', {fontSize: '24px', fill: '#ffffff'});
		var moneyText = game.add.text(20, 50, 'money: 100', {fontSize: '24px', fill: '#ffffff'});
	},
	render: function() {
		game.debug.body(boba);
	}
};

function endTapped(item) {
	game.state.start('over');
}