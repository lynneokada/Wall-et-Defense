// gamePlay.js

var gamePlayState = {
	create: function() {
		var endButtonText = game.add.text(game.world.width-60,10, 'end', {fontSize: '24px', fill: '#ffffff'});
		endButtonText.inputEnabled = true;
		endButtonText.events.onInputDown.add(endTapped, this);

		// boba = new Boba(game, '');

		var healthText = game.add.text(20, 15, 'health: 100', {fontSize: '24px', fill: '#ffffff'});
		var moneyText = game.add.text(20, 50, 'money: 100', {fontSize: '24px', fill: '#ffffff'});
	}
};

function endTapped(item) {
	game.state.start('over');
}