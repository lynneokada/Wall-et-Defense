function LazyT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed){
	Tower.call(this, game, x, y, frame, 10, 6, 3, atkrange, 0, atkspeed);

}

LazyT.prototype = Object.create(Tower.prototype);
LazyT.prototype.constructor = LazyT;

LazyT.prototype.update = function(){
	 

}