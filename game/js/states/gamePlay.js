// gamePlay.js

var health = 100;
var money = 100;
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

		var healthText = game.add.text(20, 15, 'health: ' + health, {fontSize: '24px', fill: '#ffffff'});
		var moneyText = game.add.text(20, 50, 'money: ' + money, {fontSize: '24px', fill: '#ffffff'});

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

		this.spawnWallet();
		this.spawnPlayer();

		// Spawning Boba enemies
		this.bobaG = this.add.group();
		//this.spawnBoba(this.boba);
		timer = game.time.create(false);
		timer.loop(2000, this.spawnBoba, this, this.bobaG);
		timer.start();

		// Spawn weather tower
		this.weatherTower = new WeatherT(game, 200, 375,'Weather0001', 10, 6);
		this.weatherTower.scale.setTo(.5, .5);
		this.weatherTower.body.immovable = true;

		console.log(this.weatherTower.ammo);
		// Background music
		game.menuMusic.stop();
		game.playMusic = game.add.audio('defense', 0.4, true);
		game.playMusic.play();
	},

	spawnWallet: function() {
		this.wallet = new Wallet(game, game.world.centerX, game.world.centerY, 'Bank0001');
	},

	spawnPlayer: function() {
		this.player = new Player(game, game.world.centerX, game.world.centerY, 'Player0001');
		this.player.scale.setTo(0.2,0.2);
	},

	spawnBoba: function(group){
		this.boba = new Boba(game, -50, 500, 'boba0002');
		this.boba2 = new Boba(game, -50, 550, 'boba0002');
		this.boba.scale.setTo(.4, .4);
		this.boba2.scale.setTo(.4, .4);
		this.bobaG.add(this.boba);
		this.bobaG.add(this.boba2);
	},

	render: function() {
		// game.debug.body(this.wallet);
	},

	update: function(){
		var hitEnemy = game.physics.arcade.collide(this.bobaG, this.wallet)

		if (hitEnemy) {
			this.wallet.money -= 10;
			console.log("Money = " +this.wallet.money);
			this.target = this.bobaG.getClosestTo(this.wallet);
			this.target.kill();
			moneyText = game.add.text(20, 50, 'money: ' + money, {fontSize: '24px', fill: '#ffffff'});
		}

		if(game.physics.arcade.collide(this.bobaG, this.weatherTower) && this.weatherTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.weatherTower.ammo = this.weatherTower.ammo -1;
			console.log("ammo = " + this.weatherTower.ammo);
		} else if(game.physics.arcade.collide(this.bobaG, this.weatherTower) && this.weatherTower.ammo <= 0){
			this.boba.kill();
			health = health -10;
		}

		//if(game.physics.arcade.distanceToXY(this.bobaG, (400, 400))< 500){
		//	this.bobaG.kill();
		//	console.log('help');
		//}

		// game over condition
		if (this.wallet.money == 0 || this.health == 0) {
			game.state.start('over');
		}
	}
};

function endTapped(item) {
	game.state.start('over');
}
