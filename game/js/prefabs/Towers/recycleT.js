// recycleT.js

function RecycleT(game, x, y, frame, health, ammo, attack, atkrange, atkspeed) {
	Tower.call(this, game, x, y, frame, 10, 8, 3, atkrange, 0, atkspeed);

    var timer = game.time.create(false);
    timer.loop(5000, updateCounter, this);
    timer.start();
		this.attackSpeed = 120;
    this.ammoText = game.add.text(x + 15, y - 25, "ammo: " + this.ammo+"/8", {fontSize: '20px', fill: '#ffffff'});
}

function updateCounter() {
	console.log(this.ammo)
	if (this.ammo <= 4) {
		this.ammo += 2;
	} else if (this.ammo == 5) {
		this.ammo += 1;
	}
}

RecycleT.prototype = Object.create(Tower.prototype);
RecycleT.prototype.constructor = RecycleT;

RecycleT.prototype.update = function(){
	this.ammoText.text = "ammo: " + this.ammo+"/8";
}
