// wallet.js

function Wallet(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, 'gameAtlas', spriteName);
	this.anchor.setTo(0.5,0.5);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;
	this.body.setSize(100, 50);

	this.happiness = 100;
	this.money = 100;

	game.add.existing(this);
}

Wallet.prototype = Object.create(Phaser.Sprite.prototype);
Wallet.prototype.constructor = Wallet;

Wallet.prototype.update = function() {
	// var hitEnemy = game.physics.arcade.collide(this, boba); 
};