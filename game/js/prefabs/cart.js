// cart.js

function Cart(game, x, y, spriteName) {
	// determine direction of cart
	this.speed = 100;
	this.health = 100;
	this.attack = 50;

	Enemy.call(this, game, x, y, spriteName);
	this.body.setSize(285,285,100,150);
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

Cart.prototype = Object.create(Enemy.prototype);
Cart.prototype.constructor = Cart;