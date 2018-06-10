// Nathan Altice
// 4/23/18
// Tilemaps with with path information

var game;

window.onload = function() {
	game = new Phaser.Game(960, 640, Phaser.AUTO);
	game.state.add('Load', Load);
	game.state.add('Play', Play);
	game.state.start('Load');
}

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// load tilemap data (key, url, data, format)
		game.load.tilemap('map', 'assets/pathtest.json', null, Phaser.Tilemap.TILED_JSON);
		// load tilemap spritesheet (key, url, frameWidth, frameHeight)
		game.load.image('tilesheet', 'assets/tiles_sheet.png');
		// load other images
		game.load.image('ship10', 'assets/ship10.png');
		game.load.image('ship20', 'assets/ship20.png');
	},
	create: function() {
		game.state.start('Play');
	}
};

var Play = function(game) {};
Play.prototype = {
	create: function() {
		// spinup physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set bg color
		game.stage.setBackgroundColor('#87CEEB');

		// create new Tilemap object - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('map');
		// add an image to the map to be used as a tileset (tileset, key)
		// the tileset name is specified w/in the .json file (or in Tiled)
		// a single map may use multiple tilesets
		this.map.addTilesetImage('pathtest', 'tilesheet');

		// create new TilemapLayer object
		// A Tilemap Layer is a set of map data combined with a tileset
		this.SeaLayer = this.map.createLayer('Sea');
		this.TileLayer = this.map.createLayer('Tiles');

		// set the world size to match the size of the Tilemap layer
		this.TileLayer.resizeWorld();

		// set ALL tiles to collide *except* those passed in the array
		this.map.setCollisionByExclusion([], true, this.TileLayer);

		// add player sprite, attach camera, enable physics
		this.player = game.add.sprite(200, 200, 'ship10');
		this.player.anchor.set(0.5);
		game.camera.follow(this.player, 0, 1, 1);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.drag.set(200);
		this.player.body.maxVelocity = 75;
		this.player.body.collideWorldBounds = true;

		// setup cursor control
		this.cursors = game.input.keyboard.createCursorKeys();

		// create a new objectPath object to store polyline data
		// this isn't necessary, but it saves some typing :)
		// (fyi: we *wouldn't* want to do this if we updated our map JSON on the fly)
		var objectPath = {
			polyline: this.map.objects.Path[0].polyline,
			x: this.map.objects.Path[0].x,
			y: this.map.objects.Path[0].y
		};

		// setup the graphics "pen" to draw the path we import from Tiled JSON data
		this.pathLine = game.add.graphics(0 ,0);
		// lineStyle(lineWidth, color, alpha)
		this.pathLine.lineStyle(1, 0x0088FF, 1);
		this.pathLine.moveTo(objectPath.x, objectPath.y);

		// prep our pathPoints object to hold path coordinates
		this.pathPoints = {
			x: [objectPath.x],
			y: [objectPath.y],
			a: 0
		};

		// iterate through polyline data and move "pen" to each point
		let nextX, nextY;
		for(let i = 1; i < objectPath.polyline.length; i++) {
			// Tiled polyline data gives x,y coordinates *relative* to x,y position of starting point,
			// so we always need to coordinates to that base value
			nextX = objectPath.x + objectPath.polyline[i][0];
			nextY = objectPath.y + objectPath.polyline[i][1];
			this.pathLine.lineTo(nextX, nextY);
			// push coordinates into pathPoints object
			this.pathPoints.x.push(nextX);
			this.pathPoints.y.push(nextY);
		}

		// setup enemy sprite
		this.enemy = game.add.sprite(0, 0, 'ship20');
		this.enemy.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
		this.currentPosition = {
			x: this.enemy.x,
			y: this.enemy.y
		};

		// setup motion interpolation variables
		this.interpIncrement = 1 / game.width;	// acts as a movement rate
		this.i = 0;								// acts as a starting position
	},
	update: function() {
		// collision checks
		game.physics.arcade.collide(this.player, this.TileLayer);
		game.physics.arcade.collide(this.player, this.enemy);

		// player movement
		if(this.cursors.up.isDown) {
			// accelerationFromRotation(rotation in radians, speed in px/sec^2, point x/y acceleration)
			this.physics.arcade.accelerationFromRotation(this.player.rotation-3*Math.PI/2, 200, this.player.body.acceleration);
		} else {
			this.player.body.acceleration.set(0);
		}

		if(this.cursors.left.isDown) {
			this.player.body.angularVelocity = -300;	// rate of change of angular pos of rotating body
		} else if (this.cursors.right.isDown) {
			this.player.body.angularVelocity = 300;
		} else {
			this.player.body.angularVelocity = 0;
		}

	    // simple check to reset sprite position
	    if (this.i >= 1)
	    	{ this.i = 0 };
	    // move the enemy sprite
	    this.lastPosition = this.currentPosition;
	    this.plotMotion();
	},
	// plotMotion function adapts some code from Andrew Grant's motion paths tutorial
	// https://codepen.io/andrewgrant/post/phaser-motion-paths
	plotMotion: function() {
		// plot the motion of the sprite
		var posx = this.math.linearInterpolation(this.pathPoints.x, this.i);
		var posy = this.math.linearInterpolation(this.pathPoints.y, this.i);
		this.enemy.x = posx;
		this.enemy.y = posy;
		// update current position so we can check angle against last position
		this.currentPosition = {
			x: posx,
			y:posy
		};
		var angle = this.math.angleBetweenPoints(this.lastPosition, this.currentPosition)-Math.PI/2;
		this.enemy.rotation = angle;
		this.i += this.interpIncrement;
	}
};
