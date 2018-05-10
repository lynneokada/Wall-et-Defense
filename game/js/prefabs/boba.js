// boba.js

function Boba(game, x, y, spriteName) {
	Enemy.call(this, game, spriteName, x, y, 10, 2, 20);

}

Boba.prototype = Object.create(Enemy.prototype);
Boba.prototype.constructor = Boba;

Boba.prototype.update = function() {

	// can call base class handlers for update()
	// Enemy.prototype.update.call(this);
};