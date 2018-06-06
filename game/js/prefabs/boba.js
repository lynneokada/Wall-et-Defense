// boba.js

function Boba(game, x, y, spriteName) {
	this.Health = 50;
	this.attack = 10;
	this.droppedHappiness = 10;
	this.stunnedAmt = 10;
	this.walletDamage = 1;

	Enemy.call(this, game, x, y, spriteName);
	this.body.setSize(330,400,80,120);
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

Boba.prototype = Object.create(Enemy.prototype);
Boba.prototype.constructor = Boba;
