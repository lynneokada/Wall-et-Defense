// player.js

function Player(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, 'gameAtlas', spriteName);
	game.physics.enable(this);
	this.anchor.setTo(0.5,0.5);

	this.health = 100;
	this.speed = 80;

	cursors = game.input.keyboard.createCursorKeys();

	game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	if (cursors.left.isDown) {
		//console.log("left");
		this.body.velocity.x = -this.speed;
	} else if (cursors.right.isDown) {
		//console.log("right");
		this.body.velocity.x = this.speed;
	}

	if (cursors.up.isDown) {
		//console.log("up");
		this.body.velocity.y = -this.speed;
	} else if (cursors.down.isDown) {
		//console.log("down");
		this.body.velocity.y = this.speed;
	}
}
