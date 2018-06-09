//gameplayTwo.js


var gameplayTwoState = {
	preload: function(){
		game.load.tilemap('levelTwo', 'assets/img/WTDMap2.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create: function() {
		game.stage.setBackgroundColor('#87CEEB');

		map = game.add.tilemap('levelTwo');

		map.addTilesetImage('WTMap2spritesheetR', 'tilesheet');
		map.addTilesetImage('WTMap2spritesheetBank', 'banktile');
		map.addTilesetImage('WTMap2spritesheetG', 'grasstile')

		map.setCollisionByExclusion([]);

		mapLayer = map.createLayer('Roads');
		bankLayer = map.createLayer('Bank');
		grassLayer = map.createLayer('Grass');

		mapLayer.resizeWorld();
	}
};

function menuTapped(item) {
	game.state.start('menu');
}
