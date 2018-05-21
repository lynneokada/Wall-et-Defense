// ticket.js

function Ticket(game, x, y, spriteName) {
	// determine direction of cart
	this.speed = 100;
	this.health = 100;
	this.attack = 50;

	Enemy.call(this, game, x, y, spriteName);
	this.body.velocity.x = this.speed;
}

Ticket.prototype = Object.create(Enemy.prototype);
Ticket.prototype.constructor = Ticket;
