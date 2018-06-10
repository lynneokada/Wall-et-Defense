// tutorial.js

var tutorialState = {
	create: function() {
		this.tutorialFrames = Phaser.Animation.generateFrameNames('Tutorial', 1, 14, '', 4);
		this.tutorialSlide = this.game.add.sprite(0, 0, 'gameAtlas', 'Tutorial0001');
		this.tutorialAnimation = this.tutorialSlide.animations.add('tutorial', this.tutorialFrames, 1);

		var enterKey;
		this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		var menuButtonText = game.add.text(game.world.width-260,10, 'Exit Tutorial', {fontSize: '24px', fill: '#ffffff'});
		menuButtonText.inputEnabled = true;
		menuButtonText.events.onInputDown.add(menuTapped, this);

		this.tutorialCount = 0;
	},

	update: function(){
		if(this.enterKey.downDuration(5)){
			this.tutorialAnimation.next();
			this.tutorialCount += 1;
			if(this.tutorialCount == 14){
				game.state.start('menu');
			}
		}
	}
};

function menuTapped(item) {
	game.state.start('menu');
}
