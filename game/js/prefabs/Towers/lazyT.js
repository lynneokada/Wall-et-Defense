// lazyT.js

function LazyT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 15, 3, atkrange, 0, atkspeed);
	this.attackSpeed = 150;
	this.ammoText = game.add.text(x + 15, y - 25, "ammo: " + this.ammo+ "/15", {fontSize: '20px', fill: '#ffffff'});
}

LazyT.prototype = Object.create(Tower.prototype);
LazyT.prototype.constructor = LazyT;

LazyT.prototype.update = function(){
	 this.ammoText.text = "ammo: " + this.ammo+ "/15";
}
