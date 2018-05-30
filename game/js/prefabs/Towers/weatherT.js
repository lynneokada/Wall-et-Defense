function WeatherT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
    Tower.call(this, game, x, y, frame, 10, 6, 3, atkrange, 0, atkspeed);
	//this.weatherThing = game.add.group();
	//this.weatherThing.add(this.weatherStructure);

	this.ammoText = game.add.text(x+15, y-25, "ammo: " + this.ammo, {fontSize: '20px', fill: '#ffffff'});
}

WeatherT.prototype = Object.create(Tower.prototype);
WeatherT.prototype.constructor = WeatherT;

WeatherT.prototype.update = function(){
	 this.ammoText.text = "ammo: " + this.ammo;
	 /*if(game.physics.arcade.overlap(Enemy, this.circle)){
	 	Enemy.kill();
	 	this.weatherStructure.ammo--;
	 }*/
}
