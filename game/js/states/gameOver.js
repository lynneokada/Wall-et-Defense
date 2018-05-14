// gameOver.js

var gameOverState = {
	create: function() {
		game.sound.stopAll();
        menuText = game.add.text(300, 100, "Game Over!" , {fontSize: '32px' , fill: '#000'}); //game over output message
        menuText = game.add.text(150, 500, "Press The Spacebar To Try Again!", {fontSize: '32px', fill: '#000'});

  },
  update: function() {
  	 if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ //if space bar is pressed
  	 	game.state.start("play"); //loops back to gameplay state  
  	 }

	}
};
