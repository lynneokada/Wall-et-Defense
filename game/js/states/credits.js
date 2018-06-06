// tutorial.js

var creditsState = {
	create: function() {
		var menuButtonText = game.add.text(game.world.width-80,10, 'menu', {fontSize: '24px', fill: '#ffffff'});
		menuButtonText.inputEnabled = true;
		menuButtonText.events.onInputDown.add(menuTapped, this);
	}
};

function menuTapped(item) {
	game.state.start('menu');
}
