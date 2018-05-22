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
		game.load.image('menu-button', 'assets/ui/menu.png');
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('assets/ui/kenney/kenney.json');
	},
	create: function() {
		this.game.health = 100;
		this.game.money = 100;
		// var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		// endButtonText.inputEnabled = true;
		// endButtonText.events.onInputDown.add(endTapped, this);

		this.healthText = game.add.text(20, 15, 'Health: ' + this.game.health, {fontSize: '24px', fill: '#ffffff'});
		this.moneyText = game.add.text(20, 50, 'Money: ' + this.game.money, {fontSize: '24px', fill: '#ffffff'});
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

		this.spawnWallet();
		this.spawnPlayer();

		// ENEMY TIMER SET UP -----------------------------
		this.bobaG = this.add.group();
		bobaTimer = game.time.create(false);
		bobaTimer.loop(2000, this.spawnBoba, this, this.bobaG);
		bobaTimer.start();

		this.cartG = this.add.group();
		cartTimer = game.time.create(false);
		cartTimer.loop(4000, this.spawnCart, this, this.cartG);
		cartTimer.start();

		this.ticketG = this.add.group();
		ticketTimer = game.time.create(false);
		ticketTimer.loop(4000, this.spawnTicket, this, this.ticketG);
		ticketTimer.start();

		this.shirtG = this.add.group();
		shirtTimer = game.time.create(false);
		shirtTimer.loop(4000, this.spawnShirt, this, this.shirtG);
		shirtTimer.start();

		// this.steamG = this.add.group();
		// steamTimer = game.time.create(false);
		// steamTimer.loop(4000, this.steamTimer, this, this.steamG);
		// steamTimer.start();
		// ------------------------------------------------

		// Spawn weather tower
		this.weatherTower = new WeatherT(game, 200, 375,'Weather0001', 10, 6);
		this.weatherTower.scale.setTo(.5, .5);
		this.weatherTower.body.immovable = true;

		// spawn recycle tower
		this.recycleTower = new RecycleT(game, 200, 500, 'Weather0001', 10, 6);
		this.recycleTower.scale.setTo(.5, .5);
		this.recycleTower.body.immovable = true;

		console.log("ammo = " +this.weatherTower.ammo);
		// Background music
		game.menuMusic.stop();
		game.playMusic = game.add.audio('defense', 0.4, true);
		game.playMusic.play();

		this.initializeTowerSelection();
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

	spawnCart: function(group) {
		this.cart = new Cart(game, -50, 500, 'Cart0001');
		this.cart.scale.setTo(.2, .2);
		this.cartG.add(this.cart);
	},

	spawnTicket: function(group) {
		this.ticket = new Ticket(game, -50, 500, 'Ticket0001');
		this.ticket.scale.setTo(.2,.2);
		this.ticketG.add(this.ticket);
	},

	spawnShirt: function(group) {
		this.shirt = new Shirt(game, -50, 500, 'Clothes0001');
		this.shirt.scale.setTo(.2,.2);
		this.shirtG.add(this.shirt);
	},

	spawnSteam: function(group) {
		this.steam = new Steam(game, -50, 500, 'Games0001');
		this.steam.scale.setTo(.2,.2);
		this.steamG.add(this.steam);
	},

	initializeTowerSelection: function() {
		var button, panel, menuButton;
        slickUI.add(panel = new SlickUI.Element.Panel(game.width - 156, 8, 150, 355));
        panel.add(new SlickUI.Element.Text(10,0, "Towers")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 30, 140, 80)).events.onInputUp.add(function () {
            console.log('Clicked Weather Tower');
        });
        button.add(new SlickUI.Element.Text(0,0, "Weather")).center();

        panel.add(button = new SlickUI.Element.Button(0, 120, 140, 80)).events.onInputUp.add(function () {
            console.log('Clicked Recycle Tower');
        });
        button.add(new SlickUI.Element.Text(0,0, "Recycle")).center();

        panel.add(button = new SlickUI.Element.Button(0, 210, 140, 80)).events.onInputUp.add(function () {
            console.log('Clicked Laziness Tower');
        });
        button.add(new SlickUI.Element.Text(0,0, "Laziness")).center();

        panel.add(button = new SlickUI.Element.Button(0, 300, 140, 40));
        button.add(new SlickUI.Element.Text(0,0, "Close")).center();

        panel.visible = false;
        var basePosition = panel.x;

        slickUI.add(menuButton = new SlickUI.Element.DisplayObject(game.width - 45, 8, game.make.sprite(0, 0, 'menu-button')));
        menuButton.inputEnabled = true;
        menuButton.input.useHandCursor = true;
        menuButton.events.onInputDown.add(function () {
            if(panel.visible) {
                return;
            }
            panel.visible = true;
            panel.x = basePosition + 156;
            game.add.tween(panel).to( {x: basePosition}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
                menuButton.visible = false;
            });
            slickUI.container.displayGroup.bringToTop(panel.container.displayGroup);
        }, this);

        button.events.onInputUp.add(function () {
            game.add.tween(panel).to( {x: basePosition + 156}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
                panel.visible = false;
                panel.x -= 156;
            });
            menuButton.visible = true;
        });
	},

	render: function() {
		game.debug.body(this.recycleTower);
	},

	update: function(){
		var hitEnemy = game.physics.arcade.collide(this.bobaG, this.wallet);
		var towerUpgrade = game.physics.arcade.collide(this.player, this.weatherTower);

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

		// collision detection for Weather Tower and Enemies
		if(game.physics.arcade.overlap(this.bobaG, this.weatherTower) && this.weatherTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.weatherTower.ammo = this.weatherTower.ammo -1;
			// console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.bobaG, this.weatherTower) && this.weatherTower.ammo <= 0)
		{
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.game.health -= 10;
			// this.healthText.text = 'Health: ' + this.game.health;
		} 
		
		if (game.physics.arcade.overlap(this.cartG, this.weatherTower) && this.weatherTower.ammo > 0)
		{
			this.target = this.cartG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.weatherTower.ammo = this.weatherTower.ammo -1;
			// console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		} 
		else if(game.physics.arcade.overlap(this.cartG, this.weatherTower) && this.weatherTower.ammo <= 0)
		{
			this.target = this.cartG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.game.health -= 10;
		}

		// collision detection for Recycle Tower and Enemies
		if(game.physics.arcade.overlap(this.bobaG, this.recycleTower) && this.recycleTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.recycleTower);
			this.target.kill();
			this.recycleTower.ammo = this.recycleTower.ammo -1;
			console.log("Recycle Tower ammo = " + this.recycleTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.bobaG, this.recycleTower) && this.recycleTower.ammo <= 0)
		{
			this.target = this.bobaG.getClosestTo(this.recycleTower);
			this.target.kill();
			this.game.health -= 10;
			this.healthText.text = 'Health: ' + this.game.health;
		}

		if(game.physics.arcade.overlap(this.cartG, this.recycleTower) && this.recycleTower.ammo > 0){
			this.target = this.cartG.getClosestTo(this.recycleTower);
			this.target.kill();
			this.recycleTower.ammo = this.recycleTower.ammo -1;
			console.log("Recycle Tower ammo = " + this.recycleTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.cartG, this.recycleTower) && this.recycleTower.ammo <= 0)
		{
			this.target = this.cartG.getClosestTo(this.recycleTower);
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

function endTapped(item) {
	game.state.start('over');
}
