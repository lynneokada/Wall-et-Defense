// enemy.js

function Enemy(game, spriteName, x, y, health, attack, speed) {
	Phaser.sprite.call(this, game, x, y, spriteName);
	this.anchor.setTo(0.5, 0.5);

	game.physics.enable(this);
	this.speed = 10;
	this.health = 100;
	this.attack = 1;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;