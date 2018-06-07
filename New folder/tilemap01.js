// Nathan Altice
// 4/22/18
// Tiled tilemap example

var game, map, layer, player, cursors;

window.onload = function() {
	game = new Phaser.Game(800, 600, Phaser.AUTO);
	game.state.add('Load', Load);
	game.state.add('Play', Play);
	game.state.start('Load');
}

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// load tilemap data (key, url, data, format)
		game.load.tilemap('level', 'assets/tiled_level.json', null, Phaser.Tilemap.TILED_JSON);	
		// load tilemap spritesheet (key, url, frameWidth, frameHeight)
		game.load.spritesheet('tilesheet', 'assets/tilesheet_complete.png', 32, 32);
		// load player image
		game.load.image('star', '../assets/img/star.png');
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
		map = game.add.tilemap('level');
		// add an image to the map to be used as a tileset (tileset, key)
		// the tileset name is specified w/in the .json file (or in Tiled)
		// a single map may use multiple tilesets
		map.addTilesetImage('abstract platformer', 'tilesheet');
		// set ALL tiles to collide *except* those passed in the array
		map.setCollisionByExclusion([]);
		// create new TilemapLayer object 
		// A Tilemap Layer is a set of map data combined with a tileset
		mapLayer = map.createLayer('Tile Layer 1');
		
		// set the world size to match the size of the Tilemap layer
		mapLayer.resizeWorld();

		// add player sprite, attach camera, enable physics
		player = game.add.sprite(250, game.world.height-200, 'star');
		player.anchor.set(0.5);
		game.camera.follow(player, 0, 0.1, 0.1);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.drag.set(200);
		player.body.maxVelocity = 75;

		// setup cursor control
		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function() {
		// collision checks
		game.physics.arcade.collide(player, mapLayer);

		// player movement
		if (cursors.up.isDown) {
	        player.body.velocity.y -= 15;
	    }
	    else if (cursors.down.isDown) {
	        player.body.velocity.y += 15;
	    }

	    if (cursors.left.isDown) {
	        player.body.velocity.x -= 15;
	    }
	    else if (cursors.right.isDown) {
	        player.body.velocity.x += 15;
	    }
	},
	mapCollision: function() {
		console.log('Collision');
	}
};
