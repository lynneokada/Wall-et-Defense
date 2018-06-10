// ticket.js

function Ticket(game, x, y, spriteName) {
	// determine direction of cart
	this.speed = 75;
	this.Health = 100;
	this.attack = 50;
	this.droppedHappiness = 35;
	this.stunnedAmt = 1;
	this.walletDamage = 5;
	this.location = 0;
	this.initX = x;
	this.initY = y;
	this.alphaLoss = .3;

	Enemy.call(this, game, x, y, spriteName);
	this.body.setSize(500,240,10,150);
	if (x < 0) {
		this.speed = 75;
		this.body.velocity.x = this.speed;
	} else if (x > game.world.width) {
		this.speed = -75;
		this.body.velocity.x = this.speed;
	}

	if (y < 0) {
		this.speed = 75;
		this.body.velocity.y = this.speed;
	} else if (y > game.world.height) {
		this.speed = -75;
		this.body.velocity.y = this.speed;
	}
}

Ticket.prototype = Object.create(Enemy.prototype);
Ticket.prototype.constructor = Ticket;
