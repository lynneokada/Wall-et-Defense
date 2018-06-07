// load.js

var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80,150, 'loading...', {fontSize: '44px', fill: '#ffffff'});

		// Load texture atlas and other images
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.tilemap('levelOne', 'assets/img/WTTileMapOne.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('tilesheet', 'assets/img/WTspritesheetR.png', 32, 32);
		game.load.spritesheet('banktile', 'assets/img/WTspritesheetBank.png', 32, 32);
		game.load.spritesheet('grasstile', 'assets/img/WTspritesheetG.png', 32, 32);
		game.load.image('menu-button', 'assets/ui/menu.png');


		// Load audio
		game.load.audio('breach', './assets/audio/WalletBreach0001.ogg');
		game.load.audio('reloadSound', './assets/audio/WalletReload0001.ogg');
		game.load.audio('dramatic', './assets/audio/WalletTitle0001.ogg');
		game.load.audio('defense', './assets/audio/WalletDefense0001.ogg');
		game.load.audio('defense2', './assets/audio/WalletDefense0002.ogg');
		game.load.audio('endMusic', './assets/audio/WalletEnd0001.ogg');

		},

	create: function() {
		game.state.start('menu');
	}
};
