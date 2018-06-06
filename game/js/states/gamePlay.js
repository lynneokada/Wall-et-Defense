// gamePlay.js

var bool = false;
var wflag = false;
var rflag = false;
var lflag = false;
var tower = 0;
var reloadableTower = 0;
var enemyDying = false;
var enemyCounter = 0;

var gamePlayState = {
	preload: function() {
		game.load.atlas('gameAtlas', 'assets/img/spriteatlas.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		game.load.tilemap('levelOne', 'assets/img/WTTileMapOne.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('tilesheet', 'assets/img/WTspritesheetR.png', 32, 32);
		game.load.spritesheet('banktile', 'assets/img/WTspritesheetBank.png', 32, 32);
		game.load.spritesheet('grasstile', 'assets/img/WTspritesheetG.png', 32, 32);
		game.load.audio('defense', './assets/audio/WalletDefense0001.ogg');
		game.load.audio('defense2', './assets/audio/WalletDefense0002.ogg');
		game.load.image('menu-button', 'assets/ui/menu.png');
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('assets/ui/kenney/kenney.json');
		game.load.audio('breach', './assets/audio/WalletBreach0001.ogg');
		game.load.audio('reloadSound', './assets/audio/WalletReload0001.ogg');
	},
	create: function() {
		this.game.happiness = 500;
		this.game.money = 100;
		var rKey;
		this.rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

		// GUI indicators for happiness and money values
		this.happinessText = game.add.text(60, 5, ': ' + this.game.happiness, {fontSize: '24px', fill: '#ffffff'});
		this.moneyText = game.add.text(60, 50, ': ' + this.game.money, {fontSize: '24px', fill: '#ffffff'});
		this.happinessIcon = game.add.sprite(0, 0, 'gameAtlas', 'Happiness0001');
		this.happinessFrames = Phaser.Animation.generateFrameNames('Happiness', 1, 3, '', 4);
		this.happinessIcon.scale.setTo(.1,.1);
		this.moneyIcon = game.add.sprite(0, 45, 'gameAtlas', 'Money0001');
		this.moneyIcon.scale.setTo(.1, .1);

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
		this.cartG = this.add.group();
		this.ticketG = this.add.group();
		this.shirtG = this.add.group();

		// this.generateEnemyWaves();
		enemyTimer = game.time.create(false);
		enemyTimer.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		enemyTimer.start();
		// ------------------------------------------------

		// Spawn weather tower
		this.weatherGroup = this.add.group();
		this.weatherCircleGroup = this.add.group();
		this.recycleCircleGroup = this.add.group();
		this.lazyCircleGroup = this.add.group();
		this.weatherTower = 0;


		// spawn recycle tower
		this.recycleGroup = this.add.group();
		this.recycleTower = 0;

		//spawn Lazy tower
		this.lazyGroup = this.add.group();
		this.lazyTower = 0;
		//Audio--------------------------------------------------------------------
		game.sound.stopAll();
		game.playMusic = game.add.audio('defense', 0.4, true);
		game.tiredMusic = game.add.audio('defense2', 0.6, true);
		tiredMusicPlaying = false;
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
	
	updateCounter: function() {
	// create a clock for enemy spawning
	// enemies cannot hit bank simultaneously
	    enemyCounter++;
	    // wave 1 -- easy
		if (enemyCounter == 5) {
			console.log("wave 1");
			this.spawnBoba(-50,game.world.height/2);
		}
		// wave 2
		if (enemyCounter == 12) {
			console.log("wave 2");
			this.spawnBoba(game.world.width+50,game.world.height/2);
		}
		// wave 3
		if (enemyCounter == 19) {
			console.log("wave 3");
			this.spawnBoba(game.world.width/2, -50);
		}
		// wave 4 
		if (enemyCounter == 25) {
			console.log("wave 4");
			this.spawnBoba(game.world.width/2, game.world.height+50);
		}

		// wave 5 -- medium
		if (enemyCounter == 33) {
			console.log("wave 5");
			this.spawnTicket(-50,game.world.height/2);
			this.spawnTicket(game.world.width+75,game.world.height/2);
		}
		// wave 6
		if (enemyCounter == 40) {
			console.log("wave 6");
			this.spawnShirt(game.world.width/2,-50);
			this.spawnShirt(game.world.width/2,game.world.height+75);
		}
		// wave 7
		if (enemyCounter == 47) {
			console.log("wave 7");
			this.spawnBoba(game.world.width/2 - 30, -50);
			this.spawnBoba(game.world.width/2 + 30, -75);
		}
		// wave 8
		if (enemyCounter == 53) {
			console.log("wave 8");
			this.spawnBoba(-50, game.world.height/2 - 30);
			this.spawnBoba(-75, game.world.height/2 + 30);
		}

		// set up infinite enemy waves
		if (enemyCounter > 53 && enemyCounter % 5 == 0) {
			console.log(enemyCounter);
			this.spawnRandomizer();
		}
	},

	spawnRandomizer: function() {
		var randNum = game.rnd.integerInRange(1, 10);
		switch(randNum) {
			case 1:
				console.log("1"); 	// 3 boba from top
				this.spawnBoba(game.world.width/2,-50);
				this.spawnBoba(game.world.width/2-30,-126);
				this.spawnBoba(game.world.width/2+30,-125);
				break;
			case 2:
				console.log("2");	// 3 boba from bottom
				this.spawnBoba(game.world.width/2,game.world.height+50);
				this.spawnBoba(game.world.width/2-30,game.world.height+126);
				this.spawnBoba(game.world.width/2+30,game.world.height+125);
				break;
			case 3: 
				console.log("3");	// 3 boba from right
				this.spawnBoba(game.world.width+50,game.world.height/2);
				this.spawnBoba(game.world.width+125,game.world.height/2-30);
				this.spawnBoba(game.world.width+126,game.world.height/2+30);
				break;
			case 4:
				console.log("4");	// 3 boba from left
				this.spawnBoba(-50,game.world.height/2);
				this.spawnBoba(-125,game.world.height/2-30);
				this.spawnBoba(-126,game.world.height/2+30);
				break;
			case 5:
				console.log("5");	// 4 carts from left and right
				this.spawnCart(-50, game.world.height/2);
				this.spawnCart(game.world.width+150, game.world.height/2);
				this.spawnCart(-250, game.world.height/2);
				this.spawnCart(game.world.width+350, game.world.height/2);
				break;
			case 6:
				console.log("6");	// 1 shirt from top, 1 ticket from bottom
				this.spawnShirt(game.world.width/2,-50);
				this.spawnTicket(game.world.width/2,game.world.height+100);
				break;
			case 7:
				console.log("7");	// 4 shirts from top and bottom
				this.spawnShirt(game.world.width/2,-50);
				this.spawnShirt(game.world.width/2,game.world.height+150);
				this.spawnShirt(game.world.width/2,-250);
				this.spawnShirt(game.world.width/2,game.world.height+350);
				break;
			case 8:
				console.log("8");	// 4 tickets all around
				this.spawnTicket(game.world.width/2,-50);
				this.spawnTicket(game.world.width/2,game.world.height+100);
				this.spawnTicket(game.world.width+150,game.world.height/2);
				this.spawnTicket(-200,game.world.height/2);
				break;
			case 9:
				console.log("9");	// 4 bobas all around
				this.spawnBoba(game.world.width/2,-50);
				this.spawnBoba(game.world.width/2,game.world.height+150);
				this.spawnBoba(game.world.width+250,game.world.height/2);
				this.spawnBoba(-350,game.world.height/2);
				break;
			case 10:
				console.log("10");	// 2 carts top and bottom
				this.spawnCart(game.world.width/2,-50);
				this.spawnCart(game.world.width/2,game.world.height+350);
				break;
			default:
				break;
		}
	},

 // Functions for spawning the bank, player and all the enemies
	spawnWallet: function() {
		this.wallet = new Wallet(game, game.world.centerX, game.world.centerY, 'Bank0001');
		this.wallet.body.setSize(205,252,25,10);
	},

	spawnPlayer: function() {
		this.player = new Player(game, game.world.centerX-250, game.world.centerY-250, 'Player0001');
		this.player.scale.setTo(0.2,0.2);
		this.player.stunnedAnim = this.player.animations.add('stunned', Phaser.Animation.generateFrameNames('Player', 2, 10, '', 4), 12);
		this.player.normAnim = this.player.animations.add('normal', Phaser.Animation.generateFrameNames('Player', 1, 1, '', 4), 1);

	},

	spawnBoba: function(x,y){
		this.boba = new Boba(game, x, y, 'Boba0001');
		this.boba.scale.setTo(.15, .15);
		this.bobaG.add(this.boba);
		this.boba.deathAnim = this.boba.animations.add('death', Phaser.Animation.generateFrameNames('Boba', 1, 13, '', 4), 11);
	},

	spawnCart: function(x,y) {
		this.cart = new Cart(game, x, y, 'Cart0001');
		this.cart.scale.setTo(.2, .2);
	  	this.cart.deathAnim = this.cart.animations.add('death', Phaser.Animation.generateFrameNames('Cart', 1, 7, '', 4), 30);

		this.cartG.add(this.cart);
	},

	spawnTicket: function(x,y) {
		this.ticket = new Ticket(game, x, y, 'Ticket0001');
		this.ticket.scale.setTo(.2,.2);
		this.ticket.deathAnim = this.ticket.animations.add('death', Phaser.Animation.generateFrameNames('Ticket', 2, 3, '', 4), 2);

		this.ticketG.add(this.ticket);
	},

	spawnShirt: function(x,y) {
		this.shirt = new Shirt(game, x, y, 'Clothes0001');
		this.shirt.scale.setTo(.2,.2);
		this.shirt.deathAnim = this.shirt.animations.add('death', Phaser.Animation.generateFrameNames('Clothes', 2, 10, '', 4), 15);

		this.shirtG.add(this.shirt);
	},

	initializeTowerSelection: function() {
		var button, panel, menuButton;
        slickUI.add(panel = new SlickUI.Element.Panel(game.width - 156, 8, 150, 280));
        panel.add(new SlickUI.Element.Text(10,0, "Towers")).centerHorizontally().text.alpha = 0.8;

        panel.add(button = new SlickUI.Element.Button(0, 30, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Weather Tower');
            if(this.game.happiness>=100){
            	rflag = false;
            	lflag = false;
            	wflag = true;
            	this.towerPlacement();
            }

        });
        button.add(new SlickUI.Element.Text(0,0, "Weather")).center();
        panel.add(new SlickUI.Element.Text(10,66, "100 :)")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 100, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Recycle Tower');
            if(this.game.happiness>=200){
            	rflag = true;
            	lflag = false;
            	wflag = false;
            	this.towerPlacement();
            }
        });
        button.add(new SlickUI.Element.Text(0,0, "Recycle")).center();
        panel.add(new SlickUI.Element.Text(10,136, "200 :)")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 165, 140, 40)).events.onInputUp.add(function () {
            console.log('Clicked Laziness Tower');
            if(this.game.happiness>=300){
            	console.log("in lazy loop preliminary spawn");
            	rflag = false;
            	lflag = true;
            	wflag = false;
            	this.towerPlacement();
            }
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
		this.weatherTower = new WeatherT(game, game.input.activePointer.worldX -32, game.input.activePointer.worldY -32,'Weather0001', 10, 10, 100, 2000);
		this.weatherTower.scale.setTo(.5, .5);
		this.weatherTower.body.immovable = true;
		this.weatherGroup.add(this.weatherTower);
		// Animating the weather tower
		var weatherFrames = Phaser.Animation.generateFrameNames('Weather', 1, 6, '', 4);
    var weatherAttackFrames = Phaser.Animation.generateFrameNames('Weather', 7, 8, '', 4);
		this.weatherTower.attackAnim = this.weatherTower.animations.add('attack', weatherAttackFrames, 2);
		this.weatherTower.idleAnim = this.weatherTower.animations.add('idleWeather', weatherFrames, 7);
		this.weatherTower.idleAnim.play('idleWeather', true);
		// this.weatherGroup.callAll('animations.add','animations', 'idleWeather', weatherFrames, 5, true);
		// this.weatherGroup.callAll('play', null, 'idleWeather');
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 100;
		this.happinessText.text = ': ' + this.game.happiness;
		this.weatherCircleGroup.add(this.weatherTower.circle);

	},

	spawnRecycleTower: function(){
		this.recycleTower = new RecycleT(game, game.input.activePointer.worldX - 32, game.input.activePointer.worldY - 32, 'Recycle0001', 10, 6);
		this.recycleTower.scale.setTo(.2, .2);
		this.recycleTower.body.immovable = true;
		this.recycleGroup.add(this.recycleTower);
		// Animating the Recycle tower
		var recycleFrames = Phaser.Animation.generateFrameNames('Recycle', 1, 35, '', 4);
		var recycleAttackFrames = Phaser.Animation.generateFrameNames('RecycleAttack', 1, 9, '', 4);
		this.recycleTower.attackAnim = this.recycleTower.animations.add('recycleAttack', recycleAttackFrames, 10);
		this.recycleTower.idleAnim = this.recycleTower.animations.add('idleRecycle', recycleFrames, 10);
		this.recycleTower.idleAnim.play('idleRecycle', true);
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 200;
		this.happinessText.text = ': ' + this.game.happiness;
		this.recycleCircleGroup.add(this.recycleTower.circle);

	},

	spawnLazyTower: function(){
		this.lazyTower = new LazyT(game, game.input.activePointer.worldX - 32, game.input.activePointer.worldY - 32, 'Lazy0001', 10, 6);
		this.lazyTower.scale.setTo(.2, .2);
		this.lazyTower.body.immovable = true;
		this.lazyGroup.add(this.lazyTower);
		// Animating the Lazy Tower
		var lazyFrames = Phaser.Animation.generateFrameNames('Lazy', 1, 10, '', 4);
		var lazyAttackFrames = Phaser.Animation.generateFrameNames('Lazy', 11, 14, '', 4);
		this.lazyTower.attackAnim = this.lazyTower.animations.add('lazyAttack', lazyAttackFrames, 10);
		this.lazyTower.idleAnim = this.lazyTower.animations.add('idleLazy', lazyFrames, 10);
		this.lazyTower.idleAnim.play('idleLazy', true);
		game.input.onDown.remove(getTileProperties, this);
		this.game.happiness -= 300;
		this.happinessText.text = ': ' + this.game.happiness;
		this.lazyCircleGroup.add(this.lazyTower.circle);
	},

	generateEnemyWaves: function(){
		this.spawnBoba(-50,game.world.height/2);
		this.spawnBoba(game.world.width+100,game.world.height/2);
	},

	// render: function() {
	// 	game.debug.body(this.weatherTower);
	// 	game.debug.body(this.wallet);
	//
	// 	game.debug.physicsGroup(this.bobaG);
	// },

	update: function(){
		var bobaBreach = game.physics.arcade.collide(this.bobaG, this.wallet);
		var shirtBreach = game.physics.arcade.collide(this.shirtG, this.wallet);
		var cartBreach = game.physics.arcade.collide(this.cartG, this.wallet);
		var ticketBreach = game.physics.arcade.collide(this.ticketG, this.wallet);
		//var weatherRecharge = game.physics.arcade.overlap(this.player, this.weatherCircleGroup);
		//var recycleRecharge = game.physics.arcade.overlap(this.player, this.recycleCircleGroup);
		//var lazyRecharge = game.physics.arcade.overlap(this.player, this.lazyCircleGroup);

		if(bool == false){
			marker.clear();
		//	console.log("clearing");
		}

		if(bool == true){
			makeMarker();
			game.input.addMoveCallback(updateMarker, this);
			game.input.onDown.add(getTileProperties, this);
		}

		if (bobaBreach) {
			this.game.money -= 1;
			//console.log("Money = " +this.game.money);
			this.moneyText.text = ': ' + this.game.money;
			this.target = this.bobaG.getClosestTo(this.wallet);
			this.target.destroy();
			this.breach.play();
		}

		if(shirtBreach){
			this.game.money -= 3;
			//console.log("Money = " +this.game.money);
			this.moneyText.text = ': ' + this.game.money;
			this.target = this.shirtG.getClosestTo(this.wallet);
			this.target.destroy();
			this.breach.play();
		}

		if(cartBreach){
			this.game.money -= 10;
			//console.log("Money = " +this.game.money);
			this.moneyText.text = ': ' + this.game.money;
			this.target = this.cartG.getClosestTo(this.wallet);
			this.target.destroy();
			this.breach.play();
		}

		if(ticketBreach){
			this.game.money -= 5;
			//console.log("Money = " +this.game.money);
			this.moneyText.text = ': ' + this.game.money;
			this.target = this.ticketG.getClosestTo(this.wallet);
			this.target.destroy();
			this.breach.play();
		}

		//Player and Tower reloading mechanics
		game.physics.arcade.overlap(this.player, this.weatherCircleGroup, weatherRecharge, null, this);
		game.physics.arcade.overlap(this.player, this.recycleCircleGroup, recycleRecharge, null, this);
		game.physics.arcade.overlap(this.player, this.lazyCircleGroup, lazyRecharge, null, this);

		//player's collision with towers and bank
		game.physics.arcade.collide(this.player, this.weatherGroup);
		game.physics.arcade.collide(this.player, this.recycleGroup);
		game.physics.arcade.collide(this.player, this.lazyGroup);
		game.physics.arcade.collide(this.player, this.wallet);

		game.physics.arcade.collide(this.player, this.wallet);

		// collision detection for Weather Tower and Enemies
		game.physics.arcade.overlap(this.bobaG, this.weatherCircleGroup, towerAttack, weatherAmmo, this);
		game.physics.arcade.overlap(this.cartG, this.weatherCircleGroup, towerAttack, weatherAmmo, this);
		game.physics.arcade.overlap(this.ticketG, this.weatherCircleGroup, towerAttack, weatherAmmo, this);
		game.physics.arcade.overlap(this.shirtG, this.weatherCircleGroup, towerAttack, weatherAmmo, this);

		// Collision detection for Recycle Tower and Enemies
		game.physics.arcade.overlap(this.bobaG, this.recycleCircleGroup, towerAttack, recycleAmmo, this);
		game.physics.arcade.overlap(this.cartG, this.recycleCircleGroup, towerAttack, recycleAmmo, this);
		game.physics.arcade.overlap(this.ticketG, this.recycleCircleGroup, towerAttack, recycleAmmo, this);
		game.physics.arcade.overlap(this.shirtG, this.recycleCircleGroup, towerAttack, recycleAmmo, this);

		// Collision detection for Laziness Tower and Enemies
		game.physics.arcade.overlap(this.bobaG, this.lazyCircleGroup, towerAttack, lazinessAmmo, this);
		game.physics.arcade.overlap(this.cartG, this.lazyCircleGroup, towerAttack, lazinessAmmo, this);
		game.physics.arcade.overlap(this.ticketG, this.lazyCircleGroup, towerAttack, lazinessAmmo, this);
		game.physics.arcade.overlap(this.shirtG, this.lazyCircleGroup, towerAttack, lazinessAmmo, this);

		// collision detection for player and enemies
		game.physics.arcade.overlap(this.player, this.bobaG, playerEnemyCollision, null, this);
		game.physics.arcade.overlap(this.player, this.cartG, playerEnemyCollision, null, this);
		game.physics.arcade.overlap(this.player, this.ticketG, playerEnemyCollision, null, this);
		game.physics.arcade.overlap(this.player, this.shirtG, playerEnemyCollision, null, this);

		// Updates happiness icon texture depending on amount of happiness
		if(this.game.happiness >300){
			this.happinessIcon.frameName = 'Happiness0001';
		}else if(this.game.happiness>200){
			this.happinessIcon.frameName = 'Happiness0002';
		}else if(this.game.happiness>0){
			this.happinessIcon.frameName = 'Happiness0003';
		}

		// Changes music based on current amount of money
		if(this.game.money <= 50 && tiredMusicPlaying == false){
			game.playMusic.pause();
			game.tiredMusic.play();
			tiredMusicPlaying = true;
		}

		// game over condition
		if (this.game.money <= 0 || this.game.happiness <= 0) {
			enemyCounter = 0;
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
		//console.log(bool);
	}

function towerAttack(obj1, obj2){
		obj1.Health -= 50;

		if(obj1.Health <= 0){
			obj1.body.enable = false;
			obj1.deathAnim.play('death', false, true);
			this.game.happiness = this.game.happiness + obj1.droppedHappiness;
			this.happinessText.text = ': ' + this.game.happiness;
		}
		obj1.alpha -= .3;

		//console.log(obj1.Health);
}


function weatherAmmo(obj1, obj2){
	tower = this.weatherGroup.getClosestTo(obj1);

	if(tower.attackSpeed == 0 && obj1.Health>0){
		if(tower.ammo>0){
			tower.ammo -= 1;
			tower.attackSpeed = 100;
			tower.idleAnim.stop();
			tower.attackAnim.play('weatherAttack', false);
			tower.attackAnim.onComplete.add(function(){
				tower.idleAnim.play('idleWeather', true);
			});
			return true;
		}else if(tower.ammo<=0){
			return false;
		}
	}else if(tower.attackSpeed >= 0 && obj1.Health>0){
		tower.attackSpeed -= 1;
		return false;
	}
	return false;
}

function recycleAmmo(obj1, obj2){
	tower = this.recycleGroup.getClosestTo(obj1);

	if(tower.attackSpeed == 0 && obj1.Health>0){
		if(tower.ammo>0){
			tower.ammo -= 1;
			tower.attackSpeed = 100;
			tower.idleAnim.stop();
			tower.attackAnim.play('recycleAttack', false);
			tower.attackAnim.onComplete.add(function(){
				tower.idleAnim.play('idleRecycle', true);
			});
			return true;
		}else if(tower.ammo<=0){
			return false;
		}
	}else if(tower.attackSpeed >= 0 && obj1.Health>0){
		tower.attackSpeed -= 1;
		return false;
	}
	return false;
}
	function lazinessAmmo(obj1, obj2){
		tower = this.lazyGroup.getClosestTo(obj1);

		if(tower.attackSpeed == 0 && obj1.Health>0){
			if(tower.ammo>0){
				tower.ammo -= 1;
				tower.attackSpeed = 100;
				tower.idleAnim.stop();
				tower.attackAnim.play('lazyAttack', false);
				tower.attackAnim.onComplete.add(function(){
					tower.idleAnim.play('idleLazy', true);
				});
				return true;
			}else if(tower.ammo<=0){
				return false;
			}
		}else if(tower.attackSpeed >= 0 && obj1.Health>0){
			tower.attackSpeed -= 1;
			return false;
		}
		return false;
	}

	function weatherRecharge(player, circle){

		reloadableTower = this.weatherGroup.getClosestTo(player);
		if(this.rKey.downDuration(5)){
			if (reloadableTower.ammo < 12) {
				reloadableTower.ammo++;
				this.reloadSFX.play();
			}
		}
	}

	function recycleRecharge(player, circle){

		reloadableTower = this.recycleGroup.getClosestTo(player);
		if(this.rKey.downDuration(5)){
			if (reloadableTower.ammo < 8) {
				reloadableTower.ammo++;
				this.reloadSFX.play();
			}
		}
	}

	function lazyRecharge(player, circle){
		reloadableTower = this.lazyGroup.getClosestTo(player);
		if(this.rKey.downDuration(5)){
			if (reloadableTower.ammo < 15) {
				reloadableTower.ammo++;
				this.reloadSFX.play();
			}
		}
	}

	function playerEnemyCollision(player, enemy) {
		this.player.speed = 0;	// stun player
		enemy.body.enable = false;
		this.player.stunnedAnim.play('stunnedAnim', true);

		game.time.events.add(3000, stunPlayer, this);
		this.game.happiness += enemy.stunnedAmt;
		this.happinessText.text = ': ' + this.game.happiness;
		this.game.money -= enemy.stunnedAmt;
		this.moneyText.text = ': ' + this.game.money;
		enemy.deathAnim.play('death', false, true);
	}

	function stunPlayer() {
		console.log("player stunned");
		this.player.speed = 85;
		this.player.normAnim.play('normal', true);
	}
