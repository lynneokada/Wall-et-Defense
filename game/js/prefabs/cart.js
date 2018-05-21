// cart.js

function Cart(game, x, y, spriteName) {
	// determine direction of cart
	this.speed = 100;
	this.health = 100;
	this.attack = 50;

	console.log("cart created");

	Enemy.call(this, game, x, y, spriteName);
	this.body.velocity.x = this.speed;
}

Cart.prototype = Object.create(Enemy.prototype);
Cart.prototype.constructor = Cart;