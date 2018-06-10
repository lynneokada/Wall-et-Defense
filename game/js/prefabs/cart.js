// cart.js

function Cart(game, x, y, spriteName) {
	// determine direction of cart
	this.speed = 35;
	this.Health = 300;
	this.attack = 50;
	this.droppedHappiness = 25;
	this.stunnedAmt = 25;
	this.walletDamage = 10;
	this.location = 0;
	this.initX = x;
	this.initY = y;
	this.alphaLoss = .1;


	Enemy.call(this, game, x, y, spriteName);
	this.body.setSize(475,400,25,120);
	if (x < 0) {
		this.speed = 35;
		this.body.velocity.x = this.speed;
	} else if (x > game.world.width) {
		this.speed = -35;
		this.body.velocity.x = this.speed;
	}

	if (y < 0) {
		this.speed = 35;
		this.body.velocity.y = this.speed;
	} else if (y > game.world.height) {
		this.speed = -35;
		this.body.velocity.y = this.speed;
	}
}

Cart.prototype = Object.create(Enemy.prototype);
Cart.prototype.constructor = Cart;

Cart.prototype.update = function(){

}
