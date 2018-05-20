// cart.js

function Cart(game, x, y, spriteName) {
	this.speed = 200;
	this.health = 100;
	this.attack = 50;

	Enemy.call(this, game, x, y, spriteName);
	this.body.velocity.x = this.speed;
}

Cart.prototype = Object.create(Enemy.prototype);
Cart.prototype.constructor = Cart;