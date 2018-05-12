// boba.js

function Boba(game, x, y, spriteName) {
	this.speed = 50;
	this.health = 100;
	this.attack = 10;
	
	Enemy.call(this, game, x, y, spriteName);
}

Boba.prototype = Object.create(Enemy.prototype);
Boba.prototype.constructor = Boba;

Boba.prototype.update = function() {

	// can call base class handlers for update()
	// Enemy.prototype.update.call(this);
};