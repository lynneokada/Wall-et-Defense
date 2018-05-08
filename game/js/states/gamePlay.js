// gamePlay.js

var gamePlayState = {
	create: function() {
		var endButtonText = game.add.text(game.world.width-100,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);
	}
};

function endTapped(item) {
	game.state.start('over');
}