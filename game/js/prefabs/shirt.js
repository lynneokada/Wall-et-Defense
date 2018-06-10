// shirt.js

function Shirt(game, x, y, spriteName) {
	this.speed = 50;
	this.Health = 150;
	this.attack = 10;
	this.droppedHappiness = 25;
	this.stunnedAmt = 2;
	this.walletDamage = 8;
	this.location = 0;
	this.initX = x;
	this.initY = y;
	this.alphaLoss = .15;

	Enemy.call(this, game, x, y, spriteName);
	this.body.setSize(470,350,20,100);
	if (x < 0) {
		this.speed = 50;
		this.body.velocity.x = this.speed;
	} else if (x > game.world.width) {
		this.speed = -50;
		this.body.velocity.x = this.speed;
	}

	if (y < 0) {
		this.speed = 50;
		this.body.velocity.y = this.speed;
	} else if (y > game.world.height) {
		this.speed = -50;
		this.body.velocity.y = this.speed;
	}
}

Shirt.prototype = Object.create(Enemy.prototype);
Shirt.prototype.constructor = Shirt;
