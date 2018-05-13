// gamePlay.js

var gamePlayState = {
	preload: function() {
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.atlas('weatherTower', 'assets/img/towersprites/weatherTowerAtlas.png', 'assets/img/towersprites/weatherTowerAtlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.tilemap('levelOne', 'assets/img/WTTileMapOne.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('tilesheet', 'assets/img/WTspritesheetR.png', 32, 32);
		game.load.spritesheet('banktile', 'assets/img/WTspritesheetBank.png', 32, 32);
		game.load.spritesheet('grasstile', 'assets/img/WTspritesheetG.png', 32, 32);
		game.load.audio('defense', './assets/audio/WalletDefense0001.ogg');
	},

	create: function() {
		var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);

		var healthText = game.add.text(20, 15, 'health: 100', {fontSize: '24px', fill: '#ffffff'});
		var moneyText = game.add.text(20, 50, 'money: 100', {fontSize: '24px', fill: '#ffffff'});

		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.setBackgroundColor('#87CEEB');

		map = game.add.tilemap('levelOne');

		map.addTilesetImage('WTspritesheetR', 'tilesheet');
		map.addTilesetImage('WTspritesheetBank', 'banktile');
		map.addTilesetImage('WTspritesheetG', 'grasstile')

		map.setCollisionByExclusion([]);

		mapLayer = map.createLayer('Roads');
		bankLayer = map.createLayer('Bank');
		grassLayer = map.createLayer('Grass');

		mapLayer.resizeWorld();

		this.spawnPlayer();

		// Spawning Boba enemies
		this.boba = this.add.group();
		//this.spawnBoba(this.boba);
		timer = game.time.create(false);
		timer.loop(2000, this.spawnBoba, this, this.boba);
		timer.start();

		// Spawn weather tower
		weatherTower = new WeatherT(game, 800, 400,'Weather0001', 10, 6);
		// Background music
		game.menuMusic.stop();
		game.playMusic = game.add.audio('defense', 0.4, true);
		game.playMusic.play();
	},

	spawnPlayer: function() {
		var player = new Player(game, game.world.centerX, game.world.centerY, 'Player0001');
		player.scale.setTo(0.2,0.2);
	},

	spawnBoba: function(group){
		var boba = new Boba(game, -50, 500, 'boba0002');
		boba.scale.setTo(.4, .4);
		group.add(boba);
	},

	render: function() {
		// game.debug.body(boba);
	},

	update: function(){
		if(game.physics.arcade.distanceBetween(this.boba, weatherTower)< 50){
			this.boba.kill();
			console.log('help');
		}
	}
};

function endTapped(item) {
	game.state.start('over');
}
