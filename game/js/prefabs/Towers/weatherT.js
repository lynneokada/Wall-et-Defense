function WeatherT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 6, 3, Phaser.Circle(x, y, 100), 0, atkspeed);
	console.log(atkrange);

	

}

WeatherT.prototype = Object.create(Tower.prototype);
WeatherT.prototype.constructor = WeatherT;

WeatherT.prototype.update = function(){

}

