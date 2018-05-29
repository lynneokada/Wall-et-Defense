// shirt.js

function Shirt(game, x, y, spriteName) {
	this.speed = 100;
	this.health = 100;
	this.attack = 10;

	Enemy.call(this, game, x, y, spriteName);
	if (x < 0) {
		this.speed = 100;
		this.body.velocity.x = this.speed;
	} else if (x > game.world.width) {
		this.speed = -100;
		this.body.velocity.x = this.speed;
	}

	if (y < 0) {
		this.speed = 100;
		this.body.velocity.y = this.speed;
	} else if (y > game.world.height) {
		this.speed = -100;
		this.body.velocity.y = this.speed;
	}
}

Shirt.prototype = Object.create(Enemy.prototype);
Shirt.prototype.constructor = Shirt;