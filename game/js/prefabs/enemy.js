// enemy.js

function Enemy(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, 'gameAtlas', spriteName);

	this.anchor.setTo(0.5, 0.5);
	game.physics.body.enable(this);
	game.add.existing(this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
