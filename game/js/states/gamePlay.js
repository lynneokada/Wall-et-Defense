// gamePlay.js

var gamePlayState = {
	create: function() {
		var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);

		boba = new Enemy(game, '');
	}
};

function endTapped(item) {
	game.state.start('over');
}