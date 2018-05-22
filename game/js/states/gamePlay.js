// gamePlay.js

var bool = false;
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
		this.game.health = 100;
		this.game.money = 100;
		var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);

		this.healthText = game.add.text(20, 15, 'Health: ' + this.game.health, {fontSize: '24px', fill: '#ffffff'});
		this.moneyText = game.add.text(20, 50, 'Money: ' + this.game.money, {fontSize: '24px', fill: '#ffffff'});
		console.log(bool);
		var towerText = game.add.text(game.world.width-60, 50, 'Towers', {fontSize: '24px', fill: '#ffffff'});
		towerText.inputEnabled = true;
		towerText.events.onInputDown.add(towerPlacement, this);
		var tutorialText = game.add.text(20, 75, "Open the console for", {fontSize: '24px', fill: '#ffffff'});
			tutorialText = game.add.text(20, 100, "the status of your", {fontSize: '24px', fill: '#ffffff'});
			tutorialText = game.add.text(20, 125, "towers and money!", {fontSize: '24px', fill: '#ffffff'});
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

// if icon is pressed, trigger = true
// if trigger = true, make the marker drawRect stuff
// then get tile properties
// (in tile properties)
// if tile.properties.grass = true
// tower = newWeatherTower(this.x, this.y)

		marker = game.add.graphics();

		/*if(bool == true){
			marker.lineStyle(2, 0xffffff, 1);
			marker.drawRect(0, 0, 32, 32);
			console.log(bool);
			game.input.addMoveCallback(updateMarker, this);
			game.input.onDown.add(getTileProperties, this);
		}*/


		//game.input.addMoveCallback(updateMarker, this);
		//game.input.onDown.add(getTileProperties, this);

		cursors = game.input.keyboard.createCursorKeys();

		this.spawnWallet();
		this.spawnPlayer();

		// Spawning Boba enemies
		this.bobaG = this.add.group();
		//this.spawnBoba(this.boba);
		timer = game.time.create(false);
		timer.loop(2000, this.spawnBoba, this, this.bobaG);
		timer.start();

		// Spawn weather tower
		this.weatherGroup = this.add.group();
		this.weatherTower = 0;
		// this.weatherTower.scale.setTo(.5, .5);
		// this.weatherTower.body.immovable = true;

		//console.log("ammo = " +this.weatherTower.ammo);
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

	spawnWeatherTower: function(){
		this.weatherTower = new WeatherT(game, game.input.activePointer.worldX -32, game.input.activePointer.worldY -32,'Weather0001', 10, 6);
		this.weatherTower.scale.setTo(.5, .5);
		this.weatherTower.body.immovable = true;
		this.weatherGroup.add(this.weatherTower);
		game.input.onDown.remove(getTileProperties, this);
	},

	render: function() {
		// game.debug.body(this.wallet);
	},

	update: function(){
		var hitEnemy = game.physics.arcade.collide(this.bobaG, this.wallet);
		var towerUpgrade = game.physics.arcade.collide(this.player, this.weatherTower);

		if(bool == false){
			marker.clear();
			console.log("clearing");
		}

		if(bool == true){
			makeMarker();
			game.input.addMoveCallback(updateMarker, this);
			game.input.onDown.add(getTileProperties, this);
		}

		if (hitEnemy) {
			this.game.money -= 10;
			console.log("Money = " +this.game.money);
			this.moneyText.text = 'Money: ' + this.game.money;
			this.target = this.bobaG.getClosestTo(this.wallet);
			this.target.kill();
		}

		if(towerUpgrade && game.input.keyboard.isDown(Phaser.Keyboard.R)){
			if (this.weatherTower.ammo < 6) {
				this.weatherTower.ammo = this.weatherTower.ammo +1;
			}
			console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		}

		if(game.physics.arcade.overlap(this.bobaG, this.weatherTower) && this.weatherTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.weatherTower.ammo = this.weatherTower.ammo -1;
			console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.bobaG, this.weatherTower) && this.weatherTower.ammo <= 0)
		{
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.game.health -= 10;
			this.healthText.text = 'Health: ' + this.game.health;
		}

		// game over condition
		if (this.game.money == 0 || this.game.health == 0) {
			game.state.start('over');
		}
	}
};



	function getTileProperties(){

		var x = grassLayer.getTileX(game.input.activePointer.worldX);
		var y = grassLayer.getTileY(game.input.activePointer.worldY);

		var tile = map.getTile(x, y, grassLayer);

		currentDataString = JSON.stringify( tile.properties );
		tile.properties.grass = true;
		console.log(currentDataString);

		if(tile.properties.grass = true){
			console.log("bool1: " + bool);
			this.spawnWeatherTower();
			bool = false;
			console.log("bool2: "+ bool);
		}

	}

	function updateMarker(){
		marker.x = grassLayer.getTileX(game.input.activePointer.worldX) * 32;
		marker.y = grassLayer.getTileY(game.input.activePointer.worldY) * 32;
	}

	function towerPlacement(){
		bool = true;
	}

	function makeMarker(){
		marker.lineStyle(2, 0xffffff, 1);
		marker.drawRect(0, 0, 32, 32);
		console.log(bool);
	}

function endTapped(item) {
	game.state.start('over');
}
