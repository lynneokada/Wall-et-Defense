function Tower(game, x, y, frame, health, ammo, attack, atkrange, atktargets, atkspeed){
	//Phaser.sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'gameAtlas', frame);
	this.anchor.setTo(0.5, 0.5);
  this.circle = this.addChild(game.make.sprite(0, 0, 'circle'));
	this.circle.anchor.setTo(0.5, 0.5);
	this.circle.visible = false;




	this.health = health;
	this.ammo = ammo;
	this.attack = attack;

	this.atkrange = atkrange;
	this.atktargets = atktargets;
	this.atkspeed = atkspeed;

	this.enableBody = true;
	this.immovable = true;
	game.physics.enable(this);
	game.add.existing(this);
}

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;
