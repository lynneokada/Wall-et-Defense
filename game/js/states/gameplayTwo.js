// gameplayTwo.js

var bool = false;
var wflag = false;
var rflag = false;
var lflag = false;
var tower = 0;
var reloadableTower = 0;
var enemyCounter = 0;

var gameplayTwoState = {
	preload: function() {

		game.load.tilemap('levelTwo', 'assets/img/WTDMap2.json', null, Phaser.Tilemap.TILED_JSON);
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('assets/ui/kenney/kenney.json');

	},
	create: function() {
		this.game.happiness = 525;
		this.game.money = 100;
		var rKey;
		this.rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
		enemyCounter = 0;

		// GUI indicators for happiness and money values
		this.happinessText = game.add.text(60, 5, ': ' + this.game.happiness, {fontSize: '24px', fill: '#ffffff'});
		this.moneyText = game.add.text(60, 50, ': ' + this.game.money, {fontSize: '24px', fill: '#ffffff'});
		this.happinessIcon = game.add.sprite(0, 0, 'gameAtlas', 'Happiness0001');
		this.happinessFrames = Phaser.Animation.generateFrameNames('Happiness', 1, 3, '', 4);
		this.happinessIcon.scale.setTo(.1,.1);
		this.moneyIcon = game.add.sprite(0, 45, 'gameAtlas', 'Money0001');
		this.moneyIcon.scale.setTo(.1, .1);

		game.stage.setBackgroundColor('#87CEEB');

		map = game.add.tilemap('levelTwo');

		map.addTilesetImage('WTMap2spritesheetR', 'tilesheet');
		map.addTilesetImage('WTMap2spritesheetG', 'grasstile')

		map.setCollisionByExclusion([]);

		mapLayer = map.createLayer('Roads');
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

		// create a new objectPath object to store polyline data
		var objectPath1 = { // Spawning from the left
			polyline: map.objects.Path[0].polyline,
			x: map.objects.Path[0].x,
			y: map.objects.Path[0].y
		};
		var objectPath2 = { // Spawning from the right
			polyline: map.objects.Path[1].polyline,
			x: map.objects.Path[1].x,
			y: map.objects.Path[1].y
		};
		// var objectPath3 = { // Spawning from the top
		// 	polyline: map.objects.Path[2].polyline,
		// 	x: map.objects.Path[2].x,
		// 	y: map.objects.Path[2].y
		// };
		// var objectPath4 = { // Spawning from the bottom
		// 	polyline: map.objects.Path[3].polyline,
		// 	x: map.objects.Path[3].x,
		// 	y: map.objects.Path[3].y
		// };
		// this.currentPosition = {
		// 	x: this.enemy.x,
		// 	y: this.enemy.y
		// };

		// setup the graphics "pen" to draw the path we import from Tiled JSON data
		// this.pathLine = game.add.graphics(0 ,0);
		// // lineStyle(lineWidth, color, alpha)
		// this.pathLine.visible = false;
		// this.pathLine.lineStyle(1, 0x0088FF, 1);
		// this.pathLine.moveTo(objectPath1.x, objectPath1.y);

		this.path1Points = {
			x: [objectPath1.x],
			y: [objectPath1.y],
			a: 0
		};
		this.path2Points = {
			x: [objectPath2.x],
			y: [objectPath2.y],
			a: 0
		};
		// this.path3Points = {
		// 	x: [objectPath3.x],
		// 	y: [objectPath3.y],
		// 	a: 0
		// };
		// this.path4Points = {
		// 	x: [objectPath4.x],
		// 	y: [objectPath4.y],
		// 	a: 0
		// };


		let nextX1, nextY1;
		for(let i = 1; i < objectPath1.polyline.length; i++) {
			// Tiled polyline data gives x,y coordinates *relative* to x,y position of starting point,
			// so we always need to coordinates to that base value
			nextX1 = objectPath1.x + objectPath1.polyline[i][0];
			nextY1 = objectPath1.y + objectPath1.polyline[i][1];
			// this.pathLine.lineTo(nextX, nextY);
			// push coordinates into pathPoints object
			this.path1Points.x.push(nextX1);
			this.path1Points.y.push(nextY1);
		}
		let nextX2, nextY2;
		for(let i = 1; i < objectPath2.polyline.length; i++) {
			// Tiled polyline data gives x,y coordinates *relative* to x,y position of starting point,
			// so we always need to coordinates to that base value
			nextX2 = objectPath2.x + objectPath2.polyline[i][0];
			nextY2 = objectPath2.y + objectPath2.polyline[i][1];
			// this.pathLine.lineTo(nextX, nextY);
			// push coordinates into pathPoints object
			this.path2Points.x.push(nextX2);
			this.path2Points.y.push(nextY2);
		}
		// let nextX3, nextY3;
		// for(let i = 1; i < objectPath3.polyline.length; i++) {
		// 	// Tiled polyline data gives x,y coordinates *relative* to x,y position of starting point,
		// 	// so we always need to coordinates to that base value
		// 	nextX3 = objectPath3.x + objectPath3.polyline[i][0];
		// 	nextY3 = objectPath3.y + objectPath3.polyline[i][1];
		// 	// this.pathLine.lineTo(nextX, nextY);
		// 	// push coordinates into pathPoints object
		// 	this.path3Points.x.push(nextX3);
		// 	this.path3Points.y.push(nextY3);
		// }
		// let nextX4, nextY4;
		// for(let i = 1; i < objectPath4.polyline.length; i++) {
		// 	// Tiled polyline data gives x,y coordinates *relative* to x,y position of starting point,
		// 	// so we always need to coordinates to that base value
		// 	nextX4 = objectPath4.x + objectPath4.polyline[i][0];
		// 	nextY4 = objectPath4.y + objectPath4.polyline[i][1];
		// 	// this.pathLine.lineTo(nextX, nextY);
		// 	// push coordinates into pathPoints object
		// 	this.path4Points.x.push(nextX4);
		// 	this.path4Points.y.push(nextY4);
		// }
		this.interpIncrement = 1 / game.width;	// acts as a movement rate

	},

	updateCounter: function() {
	// create a clock for enemy spawning
	// enemies cannot hit bank simultaneously
	    enemyCounter++;
	    // wave 1 -- easy
		if (enemyCounter == 5) {
			console.log("wave 1");
			this.spawnBoba(-50,game.world.height/2);
			this.spawnCart(game.world.width, game.world.height);

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

		if (this.game.happiness>= 600 && enemyCounter % 5 == 0){
			this.spawnCart(game.world.width/2, game.world.height-50);
			this.spawnCart(game.world.width/2, game.world.height-50);
			this.spawnCart(game.world.width/2, game.world.height-50);
			this.spawnCart(game.world.width/2, game.world.height-50);
			this.spawnCart(game.world.width/2, game.world.height+75);
			this.spawnCart(game.world.width/2, game.world.height+75);
			this.spawnCart(game.world.width/2, game.world.height+75);
			this.spawnCart(game.world.width/2, game.world.height+75);
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
				this.spawnCart(game.world.width, game.world.height);
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
		this.wallet = new Wallet(game, 120, 900, 'Bank0001');
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
		this.weatherTower.attackAnim = this.weatherTower.animations.add('attack', weatherAttackFrames, 4);
		this.weatherTower.idleAnim = this.weatherTower.animations.add('idleWeather', weatherFrames, 7);
		this.weatherTower.idleAnim.play('idleWeather', true);

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

		//Player and Tower reloading mechanics
		game.physics.arcade.overlap(this.player, this.weatherCircleGroup, weatherRecharge, null, this);
		game.physics.arcade.overlap(this.player, this.recycleCircleGroup, recycleRecharge, null, this);
		game.physics.arcade.overlap(this.player, this.lazyCircleGroup, lazyRecharge, null, this);

		//player's collision with bank
		game.physics.arcade.collide(this.player, this.wallet);

		//collision dectection for enemies and wallet
		game.physics.arcade.overlap(this.wallet, this.bobaG, enemyWalletCollision, null, this);
	  game.physics.arcade.overlap(this.wallet, this.shirtG, enemyWalletCollision, null, this);
		game.physics.arcade.overlap(this.wallet, this.cartG, enemyWalletCollision, null, this);
		game.physics.arcade.overlap(this.wallet, this.ticketG, enemyWalletCollision, null, this);

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

		this.lastPosition = this.currentPosition;
		// Moves enemies on their preset paths
		this.bobaG.forEachAlive(this.plotMotion, this, this);
		this.ticketG.forEachAlive(this.plotMotion, this, this);
		this.cartG.forEachAlive(this.plotMotion, this, this);
		this.shirtG.forEachAlive(this.plotMotion, this, this);


		// game over condition
		if (this.game.money <= 0 || this.game.happiness <= 0) {
			enemyCounter = 0;
			game.input.onDown.remove(getTileProperties, this);
			marker.clear();
			game.state.start('over');
		}
	},
	// Borrowing from Nathan's slides
	// plotMotion function adapts some code from Andrew Grant's motion paths tutorial
	// https://codepen.io/andrewgrant/post/phaser-motion-paths
	plotMotion: function(enemy) {
		// plot the motion of the sprite
		if(enemy.initX < game.world.width/2){ // If spawning from the left
			var posx = this.math.linearInterpolation(this.path1Points.x, enemy.location);
			var posy = this.math.linearInterpolation(this.path1Points.y, enemy.location);
			enemy.x = posx;
			enemy.y = posy;
		}else if(enemy.initX > game.world.width){ // if spawning from the right
			var posx = this.math.linearInterpolation(this.path2Points.x, enemy.location);
			var posy = this.math.linearInterpolation(this.path2Points.y, enemy.location);
			enemy.x = posx;
			enemy.y = posy;
		} else if(enemy.initY < game.world.height/2){ // if spawning from the top
			var posx = this.math.linearInterpolation(this.path2Points.x, enemy.location);
			var posy = this.math.linearInterpolation(this.path2Points.y, enemy.location);
			enemy.x = posx;
			enemy.y = posy;
		} else if(enemy.initY > game.world.height){ // if spawning from the bottom
			var posx = this.math.linearInterpolation(this.path1Points.x, enemy.location);
			var posy = this.math.linearInterpolation(this.path1Points.y, enemy.location);
			enemy.x = posx;
			enemy.y = posy;
		}
		enemy.location += this.interpIncrement;

	}

		// var angle = this.math.angleBetweenPoints(this.lastPosition, this.currentPosition)-Math.PI/2;
		// this.enemy.rotation = angle;
		// enemy.location += this.interpIncrement;
	// },
	// plotMotion2: function(enemy) {
	// 	// plot the motion of the sprite
	// 	var posx = this.math.linearInterpolation(this.path2Points.x, enemy.location);
	// 	var posy = this.math.linearInterpolation(this.path2Points.y, enemy.location);
	// 	enemy.x = posx;
	// 	enemy.y = posy;
	//
	// 	// var angle = this.math.angleBetweenPoints(this.lastPosition, this.currentPosition)-Math.PI/2;
	// 	// this.enemy.rotation = angle;
	// 	enemy.location += this.interpIncrement;
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
			obj1.alive = false;
			obj1.deathAnim.play('death', false, true);
			this.game.happiness = this.game.happiness + obj1.droppedHappiness;
			this.happinessText.text = ': ' + this.game.happiness;
		}
		obj1.alpha -= obj1.alphaLoss;

		//console.log(obj1.Health);
}


function weatherAmmo(obj1, obj2){
	tower = this.weatherGroup.getClosestTo(obj2);

	if(tower.attackSpeed == 0 && obj1.Health>0){
		if(tower.ammo>0){
			tower.ammo -= 1;
			tower.attackSpeed = 100;

			tower.idleAnim.stop();
			tower.attackAnim.play('weatherAttack', false);
			tower.attackAnim.onComplete.addOnce(playIdle, this, tower);
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
	tower = this.recycleGroup.getClosestTo(obj2);

	if(tower.attackSpeed == 0 && obj1.Health>0){
		if(tower.ammo>0){
			tower.ammo -= 1;
			tower.attackSpeed = 100;
			tower.idleAnim.stop();
			tower.attackAnim.play('recycleAttack', false);
			tower.attackAnim.onComplete.addOnce(playIdle, this, tower);
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
		tower = this.lazyGroup.getClosestTo(obj2);

		if(tower.attackSpeed == 0 && obj1.Health>0){
			if(tower.ammo>0){
				tower.ammo -= 1;
				tower.attackSpeed = 100;
				tower.idleAnim.stop();
				tower.attackAnim.play('lazyAttack', false);
				tower.attackAnim.onComplete.addOnce(playIdle, this, tower);
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

	function playIdle(tower){
		tower.idleAnim.play(true);
	}

	function weatherRecharge(player, circle){

		reloadableTower = this.weatherGroup.getClosestTo(player);
		if(this.rKey.downDuration(5)){
			if (reloadableTower.ammo < 4) {
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
			if (reloadableTower.ammo < 12) {
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
		this.game.happiness += enemy.droppedHappiness*2;
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


	function enemyWalletCollision(wallet, enemy){
		enemy.kill();
		this.game.money = this.game.money - enemy.walletDamage;
		this.moneyText.text = ': ' + this.game.money;
		this.breach.play();
	}
