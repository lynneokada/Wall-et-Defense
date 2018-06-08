function WeatherT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 6, 3, atkrange, 0, atkspeed);
	this.attackSpeed = 100;

	this.ammoText = game.add.text(x+15, y-25, "ammo: " + this.ammo + "/6", {fontSize: '20px', fill: '#ffffff'});
}

WeatherT.prototype = Object.create(Tower.prototype);
WeatherT.prototype.constructor = WeatherT;

WeatherT.prototype.update = function(){
	 this.ammoText.text = "ammo: " + this.ammo + "/6";
}
