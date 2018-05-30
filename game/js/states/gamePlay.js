// gamePlay.js

var bool = false;
var wflag = false;
var rflag = false;
var lflag = false;

var gamePlayState = {
	preload: function() {
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.tilemap('levelOne', 'assets/img/WTTileMapOne.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('tilesheet', 'assets/img/WTspritesheetR.png', 32, 32);
		game.load.spritesheet('banktile', 'assets/img/WTspritesheetBank.png', 32, 32);
		game.load.spritesheet('grasstile', 'assets/img/WTspritesheetG.png', 32, 32);
		game.load.audio('defense', './assets/audio/WalletDefense0001.ogg');
		game.load.image('menu-button', 'assets/ui/menu.png');
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('assets/ui/kenney/kenney.json');
		game.load.audio('breach', './assets/audio/WalletBreach0001.ogg');
		game.load.audio('reloadSound', './assets/audio/WalletReload0001.ogg');
	},
	create: function() {
		this.game.happiness = 500;
		this.game.money = 100;

		// GUI indicators for happiness and money values
		this.happinessText = game.add.text(60, 5, ': ' + this.game.happiness, {fontSize: '24px', fill: '#ffffff'});
		this.moneyText = game.add.text(60, 50, ': ' + this.game.money, {fontSize: '24px', fill: '#ffffff'});
		this.happiness = game.add.sprite(0, 0, 'gameAtlas', 'Happiness0001');
		this.happiness.scale.setTo(.1,.1);
		this.money = game.add.sprite(0, 45, 'gameAtlas', 'Money0001');
		this.money.scale.setTo(.1, .1);

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

		cursors = game.input.keyboard.createCursorKeys();

		this.spawnWallet();
		this.spawnPlayer();

		// ENEMY TIMER SET UP -----------------------------
		this.bobaG = this.add.group();
		bobaTimer = game.time.create(false);
		bobaTimer.loop(5000, this.spawnBoba, this, this.bobaG);
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
		// ------------------------------------------------

		// Spawn weather tower
		this.weatherGroup = this.add.group();
		this.weatherTower = 0;


		// spawn recycle tower
		this.recycleGroup = this.add.group();
		this.recycleTower = 0;
		// this.recycleTower.scale.setTo(.5, .5);
		// this.recycleTower.body.immovable = true;

		console.log("ammo = " +this.weatherTower.ammo);

		//spawn Lazy tower
		this.lazyGroup = this.add.group();
		this.lazyTower = 0;
		//Audio--------------------------------------------------------------------
		game.sound.stopAll();
		game.playMusic = game.add.audio('defense', 0.4, true);
		game.playMusic.play();

		// Add sound effects
		this.reloadSFX = game.add.audio('reloadSound', 0.1);
		this.breach = game.add.audio('breach', 0.2);




		// // Makes a button to mute music
		if (game.sound.mute == true){
			game.zero = 'MusicNote0002';
			game.one = 'MusicNote0001';
			game.two = 'MusicNote0001';
		}
		this.game.soundButton = this.game.add.button(900, 0, 'gameAtlas', muteSound, this.game, game.one, game.zero, game.two);
		this.game.soundButton.scale.setTo(0.3, 0.3);
		//------------------------------------------------------------------
		this.initializeTowerSelection();
	},

 // Functions for spawning the bank, player and all the enemies
	spawnWallet: function() {
		this.wallet = new Wallet(game, game.world.centerX, game.world.centerY, 'Bank0001');
		this.wallet.body.setSize(205,252,25,3);
	},

	spawnPlayer: function() {
		this.player = new Player(game, game.world.centerX, game.world.centerY, 'Player0001');
		this.player.scale.setTo(0.2,0.2);
	},

	spawnBoba: function(group){
		this.boba = new Boba(game, game.world.width/2, -50, 'boba0002');
		this.boba2 = new Boba(game, -50, 550, 'boba0002');
		this.boba.scale.setTo(.4, .4);
		this.boba2.scale.setTo(.4, .4);
		this.bobaG.add(this.boba);
		this.bobaG.add(this.boba2);
	},

	spawnCart: function(group) {
		this.cart = new Cart(game, game.world.width + 50, 500, 'Cart0001');
		this.cart.scale.setTo(.2, .2);
		this.cartG.add(this.cart);
	},

	spawnTicket: function(group) {
		this.ticket = new Ticket(game, game.world.width/2, game.world.height+50, 'Ticket0001');
		this.ticket.scale.setTo(.2,.2);
		this.ticketG.add(this.ticket);
	},

	spawnShirt: function(group) {
		this.shirt = new Shirt(game, -50, 500, 'Clothes0001');
		this.shirt.scale.setTo(.2,.2);
		this.shirtG.add(this.shirt);
	},

	initializeTowerSelection: function() {
		var button, panel, menuButton;
        slickUI.add(panel = new SlickUI.Element.Panel(game.width - 156, 8, 150, 280));
        panel.add(new SlickUI.Element.Text(10,0, "Towers")).centerHorizontally().text.alpha = 0.8;

        panel.add(button = new SlickUI.Element.Button(0, 30, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Weather Tower');
            rflag = false;
            lflag = false;
            wflag = true;
            this.towerPlacement();
        });
        button.add(new SlickUI.Element.Text(0,0, "Weather")).center();
        panel.add(new SlickUI.Element.Text(10,66, "100 :)")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 100, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Recycle Tower');
            wflag = false;
            lflag = false;
            rflag = true;
            this.towerPlacement();
        });
        button.add(new SlickUI.Element.Text(0,0, "Recycle")).center();
        panel.add(new SlickUI.Element.Text(10,136, "200 :)")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 165, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Laziness Tower');
            rflag = false;
            wflag = false;
            lflag = true;
            this.towerPlacement();
        });
        button.add(new SlickUI.Element.Text(0,0, "Laziness")).center();
        panel.add(new SlickUI.Element.Text(0,201, "300 :)")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 230, 140, 40)).events.onInputUp.add(function () {
        	console.log("clicked close");
        	game.input.onDown.remove(getTileProperties, this);
        });
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

	spawnWeatherTower: function(){
		this.weatherTower = new WeatherT(game, game.input.activePointer.worldX -32, game.input.activePointer.worldY -32,'Weather0001', 10, 6);
		this.weatherTower.scale.setTo(.4, .4);
		this.weatherTower.body.immovable = true;
		this.weatherGroup.add(this.weatherTower);
		// Animating the weather tower
		var frameNames = Phaser.Animation.generateFrameNames('Weather', 1, 7, '', 4);
		this.weatherGroup.callAll('animations.add','animations', 'idle', frameNames, 5, true);
		this.weatherGroup.callAll('play', null, 'idle');
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 100;
		this.happinessText.text = ': ' + this.game.happiness;

	},

	spawnRecycleTower: function(){
		this.recycleTower = new RecycleT(game, game.input.activePointer.worldX - 32, game.input.activePointer.worldY - 32, 'Recycle0001', 10, 6);
		this.recycleTower.scale.setTo(.2, .2);
		this.recycleTower.body.immovable = true;
		this.recycleGroup.add(this.recycleTower);
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 200;
		this.happinessText.text = ': ' + this.game.happiness;
	},

	spawnLazyTower: function(){
		this.lazyTower = new LazyT(game, game.input.activePointer.worldX - 32, game.input.activePointer.worldY - 32, 'Laziness0001', 10, 6);
		this.lazyTower.scale.setTo(.2, .2);
		this.lazyTower.body.immovable = true;
		this.lazyGroup.add(this.lazyTower);
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 300;
		this.happinessText.text = ': ' + this.game.happiness;
	},

	render: function() {
		game.debug.body(this.shirt);
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
			this.moneyText.text = ': ' + this.game.money;
			this.target = this.bobaG.getClosestTo(this.wallet);
			this.target.kill();
			this.breach.play();
		}

		if(towerUpgrade && game.input.keyboard.isDown(Phaser.Keyboard.R)){
			if (this.weatherTower.ammo < 6) {
				this.weatherTower.ammo = this.weatherTower.ammo +1;
				this.reloadSFX.play();
			}
			console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		}

		// collision detection for Weather Tower and Enemies
		if(game.physics.arcade.overlap(this.bobaG, this.weatherTower.circle) && this.weatherTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
			this.weatherTower.ammo = this.weatherTower.ammo -1;
			// console.log("Weather Tower ammo = " + this.weatherTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.bobaG, this.weatherTower) && this.weatherTower.ammo <= 0)
		{
			this.target = this.bobaG.getClosestTo(this.weatherTower);
			this.target.kill();
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
		}

		// collision detection for Recycle Tower and Enemies
		if(game.physics.arcade.overlap(this.bobaG, this.recycleTower.circle) && this.recycleTower.ammo > 0){
			this.target = this.bobaG.getClosestTo(this.recycleTower);
			this.target.kill();
			this.recycleTower.ammo = this.recycleTower.ammo -1;
			console.log("Recycle Tower ammo = " + this.recycleTower.ammo);
		}
		else if(game.physics.arcade.overlap(this.bobaG, this.recycleTower) && this.recycleTower.ammo <= 0)
		{
			this.target = this.bobaG.getClosestTo(this.recycleTower);
			this.target.kill();
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
		}

		// collision detection for player and enemies
		var playerBobaCollision = game.physics.arcade.collide(this.bobaG, this.player);
		var playerCartCollision = game.physics.arcade.collide(this.cartG, this.player);
		var playerTicketCollision = game.physics.arcade.collide(this.ticketG, this.player);
		var playerShirtCollision = game.physics.arcade.collide(this.shirtG, this.player);

		if (playerBobaCollision) {
			console.log("player collided with boba");
		} else if (playerCartCollision) {
			console.log("player collided with cart");
		} else if (playerTicketCollision) {
			console.log("player collided with ticket");
		} else if (playerShirtCollision) {
			console.log("player collided with shirt");
		}

		// game over condition
		if (this.game.money == 0) {
			game.input.onDown.remove(getTileProperties, this);
			marker.clear();
			game.state.start('over');
		}
	}
};



	function getTileProperties(){

		var x = grassLayer.getTileX(game.input.activePointer.worldX);
		var y = grassLayer.getTileY(game.input.activePointer.worldY);

		var tile = map.getTile(x, y, grassLayer);
		var badTile = map.getTile(x, y, )

		currentDataString = JSON.stringify( tile.properties );
		tile.properties.grass = true;
		console.log(currentDataString);

		if(tile.properties.grass = true && wflag == true && this.game.happiness >99){
			console.log("bool1: " + bool);
			this.spawnWeatherTower();
			bool = false;
			console.log("bool2: "+ bool);
		}

		if(tile.properties.grass = true && rflag == true && this.game.happiness > 199){
			this.spawnRecycleTower();
			bool = false;
		}

		if(tile.properties.grass = true && lflag == true && this.game.happiness > 299){
			this.spawnLazyTower();
			bool = false;
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
