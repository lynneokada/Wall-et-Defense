// gameOver.js

var gameOverState = {
	
	create: function() {
		game.sound.stopAll();
		game.endMusic = game.add.audio('endMusic', 1.0, true);
		game.endMusic.play();

		this.game.add.sprite(0, 0, 'gameAtlas', 'WalletOver');

        // menuText = game.add.text(300, 100, "Game Over!" , {fontSize: '32px' , fill: '#000'}); //game over output message
				var replayButtonText = game.add.text(game.world.centerX - 50, game.world.centerY + 100, 'Try Again', {fontSize: '48px', fill: '#000'});
				replayButtonText.inputEnabled = true;
				replayButtonText.events.onInputDown.add(replayTapped, this);
  },
  update: function() {
  	 // if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ //if space bar is pressed
  	 // 	game.state.start("play"); //loops back to gameplay state
  	 // }

	}
};
function replayTapped(item) {
	game.state.start('play');
}
