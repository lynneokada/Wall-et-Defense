// menu.js

var menuState = {

	create: function() {
		this.game.add.sprite(0, 0, 'gameAtlas', 'WalletTitle');
		//var gameTitle = game.add.text(game.world.centerX, 200, 'Wall-et Defense', {fontSize: '44px', fill: '#ffffff'});

		var startButtonText = game.add.text(game.world.centerX - 50, game.world.centerY +20, 'START', {fontSize: '24px', fill: '#ffffff'});
		startButtonText.inputEnabled = true;
		startButtonText.events.onInputDown.add(startTapped, this);

		var controlsButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 50, 'Controls', {fontSize: '24px', fill: '#ffffff'});
		controlsButtonText.inputEnabled = true;
		controlsButtonText.events.onInputDown.add(controlsTapped, this);

		var tutorialButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 80, 'Tutorial', {fontSize: '24px', fill: '#ffffff'});
		tutorialButtonText.inputEnabled = true;
		tutorialButtonText.events.onInputDown.add(tutorialTapped, this);

		var creditsButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 110, 'Credits', {fontSize: '24px', fill: '#ffffff'});
		creditsButtonText.inputEnabled = true;
		creditsButtonText.events.onInputDown.add(creditsTapped, this);

		// Background music
		game.sound.stopAll();
		game.menuMusic = game.add.audio('dramatic', 0.5, true);
		game.menuMusic.play();

		// Makes a button to mute music
		// new Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
		// Referenced code from XekeDeath's post: http://www.html5gamedevs.com/topic/1730-click-sprite-and-button-question/
		game.zero = 'MusicNote0001';
		game.one = 'MusicNote0001';
		game.two = 'MusicNote0002';
		game.soundButton = game.add.button(900, 0, 'gameAtlas', muteSound, this.game, game.one, game.zero, game.two);
		game.soundButton.on = false;
		game.soundButton.scale.setTo(0.3, 0.3);

	}
};

function startTapped(item) {
	game.state.start('play');
}

function tutorialTapped(item) {
	game.state.start('tutorial');
}

function controlsTapped(item) {
	game.state.start('controls');
}

function creditsTapped(item) {
	game.state.start('credits');
}
function muteSound(item) {
	game.sound.mute =! game.sound.mute;
	item.on =! item.on;
	item.setFrames(game.one, (item.on)?game.two:game.zero, game.two);
	item.frame = (item.on)?game.two:game.zero;
}
