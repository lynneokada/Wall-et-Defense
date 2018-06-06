// tutorial.js

var controlsState = {
	create: function() {
		this.game.add.sprite(0, 0, 'gameAtlas', 'Controls');
		var menuButtonText = game.add.text(game.world.width-80,10, 'menu', {fontSize: '24px', fill: '#ffffff'});
		menuButtonText.inputEnabled = true;
		menuButtonText.events.onInputDown.add(menuTapped, this);


	}
};

function menuTapped(item) {
	game.state.start('menu');
}
