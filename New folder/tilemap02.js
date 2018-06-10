// Nathan Altice
// 4/22/18
// Tilemaps with multiple layers

var game, map, layer, player, cursors, keys;

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
		game.load.tilemap('level', 'assets/arena_tiles.json', null, Phaser.Tilemap.TILED_JSON);	
		// load tilemap spritesheet (key, url, frameWidth, frameHeight)
		game.load.spritesheet('tilesheet', 'assets/tilesheet_complete.png', 32, 32);
		// load player image
		game.load.image('star', '../assets/img/star.png');
		// load red key image
		game.load.image('key', 'assets/keyRed.png');
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
		map.addTilesetImage('tilesheet_complete', 'tilesheet');

		// set ALL tiles to collide *except* those passed in the array
		map.setCollisionByExclusion([]);

		// create new TilemapLayer object 
		// A Tilemap Layer is a set of map data combined with a tileset
		terrainLayer = map.createLayer('Terrain');
		decorationLayer = map.createLayer('Decoration');
		
		// set the world size to match the size of the Tilemap layer
		terrainLayer.resizeWorld();

		// setup keys group
		keys = game.add.group();
		keys.enableBody = true;

		// convert Tiled objects w/ xx ID into key sprites
		// createFromObjects creates a sprite for every object matching the given gid (grid ID) in the map data
		// (object group name, gid, image key, frame, exists, autoCull, group)
		map.createFromObjects('Keys', 1057, 'key', 0, true, true, keys);

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
		game.physics.arcade.collide(player, terrainLayer);
		game.physics.arcade.collide(player, keys, this.collectKey, null, this);

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
	collectKey: function(player, key) {
		key.kill();
	}
};
