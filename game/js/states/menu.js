// menu.js

var menuState = {
	preload: function(){
		game.load.audio('dramatic', './assets/audio/WalletTitle0001.ogg');
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	},
	create: function() {
		this.game.add.sprite(0, 0, 'gameAtlas', 'TitleBG');
		//var gameTitle = game.add.text(game.world.centerX, 200, 'Wall-et Defense', {fontSize: '44px', fill: '#ffffff'});

		var startButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 100, 'START', {fontSize: '24px', fill: '#ffffff'});
		startButtonText.inputEnabled = true;
		startButtonText.events.onInputDown.add(startTapped, this);

		var tutorialButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 150, 'Tutorial', {fontSize: '24px', fill: '#ffffff'});
		tutorialButtonText.inputEnabled = true;
		tutorialButtonText.events.onInputDown.add(tutorialTapped, this);

		// Background music
		game.sound.stopAll();
		game.menuMusic = game.add.audio('dramatic', 0.5, true);
		game.menuMusic.play();

	}
};

function startTapped(item) {
	game.state.start('play');
}

function tutorialTapped(item) {
	game.state.start('tutorial');
}
