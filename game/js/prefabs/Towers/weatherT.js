function WeatherT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 6, 3, atkrange, 0, atkspeed);
	

}

WeatherT.prototype = Object.create(Tower.prototype);
WeatherT.prototype.constructor = WeatherT;

WeatherT.prototype.update = function(){
	
}

