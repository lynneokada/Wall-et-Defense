function Tower(game, x, y, frame, health, ammo, attack, atkrange, atktargets, atkspeed){
	//Phaser.sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'gameAtlas', frame);
	this.anchor.setTo(0.5, 0.5);
	// Adds a circle to indicate attack radius
  this.circle = this.addChild(game.make.sprite(x, y, 'gameAtlas', 'Circle0001'));
	this.circle.scale.setTo(0.5, 0.5);
	this.circle.anchor.setTo(0.5, 0.5);
	this.circle.visible = true;
	this.circle.enableBody = true;
	this.circle.immovable = true;
	game.physics.enable(this.circle);
	game.add.existing(this.circle);


	// Display circle radius on click
	var clickableTower = this.circle;
	clickableTower.inputEnabled = true;
	clickableTower.events.onInputDown.add(toggleRange, this);

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

function toggleRange(item) {
	if(this.circle.alpha != 0){
		this.circle.alpha = 0;
	}else{
		this.circle.alpha = 100;
	}
}
