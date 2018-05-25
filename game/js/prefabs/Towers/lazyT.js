function LazyT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 6, 3, atkrange, 0, atkspeed);

	this.ammoText = game.add.text(0, 0, "ammo: " + this.ammo, {fontSize: '24px', fill: '#ffffff'});
}

LazyT.prototype = Object.create(Tower.prototype);
LazyT.prototype.constructor = LazyT;

LazyT.prototype.update = function(){
	 this.ammoText.text = "ammo: " + this.ammo;
}