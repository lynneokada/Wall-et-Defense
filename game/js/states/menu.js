// menu.js

var menuState = {
	create: function() {
		var gameTitle = game.add.text(game.world.centerX, 200, 'Wall-et Defense', {fontSize: '44px', fill: '#ffffff'});
	
		var startButtonText = game.add.text(game.world.centerX, game.world.centerY, 'START', {fontSize: '24px', fill: '#ffffff'});
		startButtonText.inputEnabled = true;
		startButtonText.events.onInputDown.add(startTapped, this);

		var tutorialButtonText = game.add.text(game.world.centerX, game.world.centerY+50, 'tutorial', {fontSize: '24px', fill: '#ffffff'});
		tutorialButtonText.inputEnabled = true;
		tutorialButtonText.events.onInputDown.add(tutorialTapped, this);
	}
};

function startTapped(item) {
	game.state.start('play');
}

function tutorialTapped(item) {
	game.state.start('tutorial');
}