// shirt.js

function Shirt(game, x, y, spriteName) {
	this.speed = 100;
	this.health = 100;
	this.attack = 10;

	Enemy.call(this, game, x, y, spriteName);
	this.body.velocity.x = this.speed;
}

Shirt.prototype = Object.create(Enemy.prototype);
Shirt.prototype.constructor = Shirt;